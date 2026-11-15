# Kubernetes 上的 Heym

在沒有 Docker 通訊端（Docker socket）的情況下於 Kubernetes 上部署 Heym。將每個 sandbox 作為獨立的 pod 執行，並提供儲存、網路與 worker 配置指南。

用於在沒有 Docker 通訊端的情況下執行 Heym 的範例資訊清單。每個 sandbox（Python 工具、skills、Code 節點、檔案分析、Playwright、MCP stdio、Codex、OpenCode）均透過 Kubernetes API 作為其專屬 pod 執行。

## 環境需求

- Kubernetes 1.30 或更新版本（sandbox 的 stdin 使用 `v5.channel.k8s.io` 連接協定）。
- 強制執行 NetworkPolicy 的 CNI。Heym 會在啟動第一個離線 sandbox 之前進行檢查，如果測試 pod 仍能連線網路，則拒絕執行離線 sandbox。
- kubelet 的 `podPidsLimit`。Pod 本身沒有單 pod 的 PID 限制欄位；因此除了記憶體、CPU 和逾時時限外，這是唯一的防 fork-bomb 措施。Heym 無法自行檢查該項：容器的 `/sys/fs/cgroup/pids.max` 屬於其自身的 cgroup，而非 pod 的 cgroup。Talos 預設未配置此限制。

## 安裝

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) 是由 Alexey Masolov 維護並發布在 [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym) 上的社群 chart，提供了針對 OpenShift、EKS、AKS 和 GKE 的平台預設：

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## 儲存 (Storage)

`heym-data` 存放 Drive 檔案、外掛程式以及 Codex/OpenCode 工作區。Sandbox pod 在每次執行時掛載其中的一個 `subPath`。採用 `ReadWriteMany` 時可以在任何節點上執行。採用 `ReadWriteOnce` 時則固定在 backend 所在的節點上。不支援 `ReadWriteOncePod`。

## 自訂 CA 憑證套件

將 CA 憑證套件掛載到 backend pod 中，並將 `SSL_CERT_FILE`（或 `REQUESTS_CA_BUNDLE`、`NODE_EXTRA_CA_CERTS`）指向該檔案。Heym 會將該檔案複製到永續磁碟宣告中的 `codex-workspaces/_ca/`，並在接收該變數的每個 sandbox 中以唯讀方式掛載到相同路徑。使用 `ReadWriteOnce` 宣告時，這些 sandbox 將在 backend 所在的節點上執行。

CA 不會開放網路權限。Sandbox 的 egress 流量僅能存取公開位址；因此內部套件鏡像站、Proxy 或內部 API 需要單獨配置規則，例如：

    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: heym-sandbox-egress-internal-mirror
    spec:
      podSelector:
        matchLabels:
          app.kubernetes.io/managed-by: heym
          heym.run/network: egress
      policyTypes: [Egress]
      egress:
        - to:
            - ipBlock: {cidr: 10.20.30.40/32}
          ports:
            - {protocol: TCP, port: 443}

## 專用的 Sandbox Namespace

設定 `HEYM_SANDBOX_K8S_NAMESPACE` 可以在其他位置執行 sandbox，為該 namespace 新增標籤 `pod-security.kubernetes.io/enforce: restricted`，將 Role 移入其中，並在 Heym 的 namespace 中保留一個授予 `pods` 的 `get` 權限的 Role。工作區 sandbox 隨後需要在 sandbox namespace 中申請名為 `heym-data` 的宣告，該宣告繫結到相同的 RWX 共用（第二個靜態佈建的 PersistentVolume）。

## 來自 Kubernetes Secrets 的 Credentials

帶有標籤 `heym.run/credential: "true"` 的 Secret 會轉變為唯讀憑據。憑據值保存在各個處理程序的記憶體中，絕不會進入資料庫或其備份；修改 Secret 無需重新啟動即可輪替憑據。任何能夠寫入 Secret 的工具均受支援：External Secrets Operator、SealedSecrets、透過 Flux 或 Argo CD 使用的 SOPS，或者 `kubectl`。

將該元件新增至您的 overlay 中。它會授予 ServiceAccount 對 Secrets 的 `get`、`list` 和 `watch` 權限，並在每個 Deployment 上設定 `HEYM_K8S_CREDENTIALS=true`：

    components:
      - ../../components/kubernetes-credentials

Secrets 的 RBAC 無法按標籤細分；因此 Heym 可以讀取被監控 namespace 中的所有 Secret。請在獨立 namespace 中執行 Heym，或將 `HEYM_K8S_CREDENTIALS_NAMESPACE` 設定為僅包含 Heym 憑據的 namespace。如果 `HEYM_PYTHON_TOOL_SANDBOX`、`HEYM_PLAYWRIGHT_SANDBOX` 或 `HEYM_MCP_STDIO_SANDBOX` 中有任何一個設定為 `subprocess`，啟動將被拒絕，因為使用者程式碼可能會在 ServiceAccount 權杖旁執行。

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # 在 Heym 中顯示的憑據名稱
        heym.run/type: custom                   # 憑據類型
        heym.run/owner: admin@example.com       # 現有使用者
        heym.run/share-users: alice@example.com # 選用，逗號分隔的電子郵件
        heym.run/share-teams: automation        # 選用，逗號分隔的團隊名稱
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

每個資料鍵都是一個設定欄位。對於具有巢狀欄位或非字串欄位的類型，請將完整設定作為 JSON 放置在單一 `config.json` 鍵下。儲存重新整理 OAuth 權杖的類型（Codex、Google、BigQuery，以及處於 OAuth 模式的 Linear 或 Notion）無法設定為唯讀，因而會被拒絕。

使用 External Secrets Operator 時，請將標籤與註解新增至目標範本中：

    apiVersion: external-secrets.io/v1
    kind: ExternalSecret
    metadata:
      name: heym-cred-llm-gateway
    spec:
      secretStoreRef: {kind: ClusterSecretStore, name: parameter-store}
      target:
        template:
          metadata:
            labels: {heym.run/credential: "true"}
            annotations:
              heym.run/name: llm-gateway
              heym.run/type: custom
              heym.run/owner: admin@example.com
          data:
            base_url: http://llm-gateway.internal/v1
            api_key: "{{ .key }}"
      data:
        - secretKey: key
          remoteRef: {key: /heym/llm-gateway-key}

預期行為：

- **Pod 可能會在完成同步前處於 Ready 狀態。** 啟動過程不會等待 API 伺服器，因此即使沒有它，UI 也能正常存取。在處理程序完成同步之前，它不會領取佇列中的執行任務；在執行任何節點之前，使用這些憑據之一的任務將因 `not synced from Kubernetes yet` 而失敗。設定 → Kubernetes（僅在啟用 `HEYM_K8S_CREDENTIALS` 時出現的管理分頁）和設定 → 執行個體會顯示同步狀態；因此，請勿建構將 Ready 假設為已同步的健康狀態檢查。
- **刪除 Secret 會使其憑據變為無法使用**，但仍保留其 ID 與共用關係；重新建立 Secret（GitOps 清理並重新套用）將為所有 workflow 復原該憑據。資料列絕不會被自動刪除；管理員可以從設定 → Kubernetes 中將其移除。
- **對於尚未登入的擁有者**，系統每五分鐘會重試一次。
- **具有相同名稱與擁有者的使用者憑據**絕不會被覆寫；該 Secret 會被回報為衝突。

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes 會在 DNS Service 轉換為 DNS pod 之後評估 egress 策略，而 OpenShift 的 DNS pod 接聽的是 5353 連接埠而非 53 連接埠。使用基礎策略時，聯網 sandbox 能夠透過 IP 連線網際網路，但所有網域名稱解析均會逾時。Overlay 僅修改了該規則：

- 允許 UDP 和 TCP 5353（DNS pod 的連接埠），而非服務的 53 連接埠。
- 透過 `kubernetes.io/metadata.name: openshift-dns` 選取 DNS namespace。並非所有叢集都設定了 `network.openshift.io/policy-group: dns`。
- 公共 `ipBlock` 規則繼續排除私人、連結本地（link-local）和 CGNAT 位址區段。

## 配合 kube-proxy 替代方案的 Cilium

基礎設定未向 backend pod 分配 egress 策略。如果您新增策略，單純的 `ipBlock` 無法放行 API 伺服器：Service 位址在套用策略前會被重寫為節點的 `:6443`，且該位址攜帶 Cilium 的 `kube-apiserver` 身分。請使用 `CiliumNetworkPolicy` 予以放行。該策略還會選取同樣會啟動 sandbox pod 的 worker（參見負載分發）：

    apiVersion: cilium.io/v2
    kind: CiliumNetworkPolicy
    metadata:
      name: heym-kube-apiserver
    spec:
      endpointSelector:
        matchExpressions:
          - key: app.kubernetes.io/name
            operator: In
            values: [heym, heym-worker]
      egress:
        - toEntities: [kube-apiserver]
          toPorts:
            - ports: [{port: "6443", protocol: TCP}]

## 排程 (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` 接受包含 `nodeSelector`、`tolerations`、`runtimeClassName`（例如 gVisor）、`imagePullSecrets` 和 `priorityClassName` 的 JSON 設定。不接受其他任何欄位。

## 負載分發

Worker 是相同映像檔的額外 Deployments，帶有 `HEYM_INSTANCE_ROLE=worker`、相同的 `SECRET_KEY` 和 `ENCRYPTION_KEY` 以及 `heym-backend` ServiceAccount，因此它們也能啟動 sandbox pod。Worker 負責執行 Code 節點，因此需要在工作區目錄為其相依性配置儲存宣告：其自身的 `ReadWriteOnce` 宣告即可滿足需求，因為這些目錄僅在單次執行期間存在。`overlays/orbstack-cluster` 會新增一個 worker；`scripts/k8s-cluster-smoke.sh` 用於驗證排隊的執行任務是否分配至該 worker 且其 sandbox pod 歸屬於該 worker。

請直接使用 uvicorn 啟動 worker，如 `overlays/orbstack-cluster/worker.yaml` 所示。映像檔進入點會執行資料庫移轉，而移轉屬於主執行個體（main）的職責。為每個 worker 分配一個唯一且穩定的 `HEYM_INSTANCE_ID`；StatefulSet 的 pod 名稱非常適用。已停止 worker 的佇列執行任務將由領導者（leader）轉移到其他執行個體。

## 在 OrbStack 上進行本機測試

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

對於 main 加上一個 worker，請改為套用 `overlays/orbstack-cluster` 並執行 `./scripts/k8s-cluster-smoke.sh`。

## 相關主題

- [範例資訊清單和原始碼 README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [執行與部署](./running-and-deployment.md)
- [負載分發](../reference/cluster.md)
