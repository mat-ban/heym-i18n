# Kubernetes 上的 Heym

在没有 Docker 套接字（Docker socket）的情况下在 Kubernetes 上部署 Heym。将每个 sandbox 作为独立的 pod 运行，并提供存储、网络与 worker 配置指南。

用于在没有 Docker 套接字的情况下运行 Heym 的示例清单。每个 sandbox（Python 工具、skills、Code 节点、文件分析、Playwright、MCP stdio、Codex、OpenCode）均通过 Kubernetes API 作为其专属 pod 运行。

## 环境要求

- Kubernetes 1.30 或更高版本（sandbox 的 stdin 使用 `v5.channel.k8s.io` 连接协议）。
- 强制执行 NetworkPolicy 的 CNI。Heym 会在启动第一个离线 sandbox 之前进行检查，如果测试 pod 仍能连接网络，则拒绝运行离线 sandbox。
- kubelet 的 `podPidsLimit`。Pod 本身没有单 pod 的 PID 限制字段；因此除了内存、CPU 和超时时限外，这是唯一的防 fork-bomb 措施。Heym 无法自行检查该项：容器的 `/sys/fs/cgroup/pids.max` 属于其自身的 cgroup，而非 pod 的 cgroup。Talos 默认未配置此限制。

## 安装

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) 是由 Alexey Masolov 维护并发布在 [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym) 上的社区 chart，提供了针对 OpenShift、EKS、AKS 和 GKE 的平台预设：

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## 存储 (Storage)

`heym-data` 存放 Drive 文件、插件以及 Codex/OpenCode 工作区。Sandbox pod 在每次运行时挂载其中的一个 `subPath`。采用 `ReadWriteMany` 时可以在任何节点上运行。采用 `ReadWriteOnce` 时则固定在 backend 所在的节点上。不支持 `ReadWriteOncePod`。

## 自定义 CA 证书包

将 CA 证书包挂载到 backend pod 中，并将 `SSL_CERT_FILE`（或 `REQUESTS_CA_BUNDLE`、`NODE_EXTRA_CA_CERTS`）指向该文件。Heym 会将该文件复制到持久卷声明中的 `codex-workspaces/_ca/`，并在接收该变量的每个 sandbox 中以只读方式挂载到相同路径。使用 `ReadWriteOnce` 声明时，这些 sandbox 将在 backend 所在的节点上运行。

CA 不会放开网络权限。Sandbox 的 egress 流量仅能访问公共地址；因此内部包镜像源、代理或内部 API 需要单独配置规则，例如：

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

## 专用的 Sandbox Namespace

设置 `HEYM_SANDBOX_K8S_NAMESPACE` 可以在其他位置运行 sandbox，为该 namespace 添加标签 `pod-security.kubernetes.io/enforce: restricted`，将 Role 移入其中，并在 Heym 的 namespace 中保留一个授予 `pods` 的 `get` 权限的 Role。工作区 sandbox 随后需要在 sandbox namespace 中申请名为 `heym-data` 的声明，该声明绑定到相同的 RWX 共享（第二个静态置备的 PersistentVolume）。

## 来自 Kubernetes Secrets 的 Credentials

带有标签 `heym.run/credential: "true"` 的 Secret 会转变为只读凭据。凭据值保存在各个进程的内存中，绝不会进入数据库或其备份；修改 Secret 无需重启即可轮换凭据。任何能够写入 Secret 的工具均受支持：External Secrets Operator、SealedSecrets、通过 Flux 或 Argo CD 使用的 SOPS，或者 `kubectl`。

将该组件添加到您的 overlay 中。它会授予 ServiceAccount 对 Secrets 的 `get`、`list` 和 `watch` 权限，并在每个 Deployment 上设置 `HEYM_K8S_CREDENTIALS=true`：

    components:
      - ../../components/kubernetes-credentials

Secrets 的 RBAC 无法按标签细分；因此 Heym 可以读取被监控 namespace 中的所有 Secret。请在独立 namespace 中运行 Heym，或将 `HEYM_K8S_CREDENTIALS_NAMESPACE` 设置为仅包含 Heym 凭据的 namespace。如果 `HEYM_PYTHON_TOOL_SANDBOX`、`HEYM_PLAYWRIGHT_SANDBOX` 或 `HEYM_MCP_STDIO_SANDBOX` 中有任何一个设置为 `subprocess`，启动将被拒绝，因为用户代码可能会在 ServiceAccount 令牌旁运行。

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # 在 Heym 中显示的凭据名称
        heym.run/type: custom                   # 凭据类型
        heym.run/owner: admin@example.com       # 现有用户
        heym.run/share-users: alice@example.com # 可选，逗号分隔的邮箱
        heym.run/share-teams: automation        # 可选，逗号分隔的团队名称
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

每个数据键都是一个配置字段。对于具有嵌套字段或非字符串字段的类型，请将完整配置作为 JSON 放置在单个 `config.json` 键下。存储刷新 OAuth 令牌的类型（Codex、Google、BigQuery，以及处于 OAuth 模式的 Linear 或 Notion）无法设置为只读，因而会被拒绝。

使用 External Secrets Operator 时，请将标签与注解添加到目标模板中：

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

预期行为：

- **Pod 可能会在完成同步前处于 Ready 状态。** 启动过程不会等待 API 服务器，因此即使没有它，UI 也能正常访问。在进程完成同步之前，它不会领取队列中的运行任务；在执行任何节点之前，使用这些凭据之一的任务将因 `not synced from Kubernetes yet` 而失败。设置 → Kubernetes（仅在启用 `HEYM_K8S_CREDENTIALS` 时出现的管理标签页）和设置 → 实例会显示同步状态；因此，请勿构建将 Ready 假设为已同步的健康检查。
- **删除 Secret 会使其凭据变为不可用**，但仍保留其 ID 与共享关系；重新创建 Secret（GitOps 清理并重新应用）将为所有 workflow 恢复该凭据。数据行绝不会被自动删除；管理员可以从设置 → Kubernetes 中将其移除。
- **对于尚未登录的所有者**，系统每五分钟会重试一次。
- **具有相同名称与所有者的用户凭据**绝不会被覆盖；该 Secret 会被作为冲突报告。

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes 会在 DNS Service 转换为 DNS pod 之后评估 egress 策略，而 OpenShift 的 DNS pod 监听的是 5353 端口而非 53 端口。使用基础策略时，联网 sandbox 能够通过 IP 访问互联网，但所有域名解析均会超时。Overlay 仅修改了该规则：

- 允许 UDP 和 TCP 5353（DNS pod 的端口），而非服务的 53 端口。
- 通过 `kubernetes.io/metadata.name: openshift-dns` 选择 DNS namespace。并非所有集群都设置了 `network.openshift.io/policy-group: dns`。
- 公共 `ipBlock` 规则继续排除私有、链路本地（link-local）和 CGNAT 地址段。

## 配合 kube-proxy 替代方案的 Cilium

基础配置未向 backend pod 分配 egress 策略。如果您添加策略，单纯的 `ipBlock` 无法放行 API 服务器：Service 地址在应用策略前会被重写为节点的 `:6443`，且该地址携带 Cilium 的 `kube-apiserver` 身份。请使用 `CiliumNetworkPolicy` 予以放行。该策略还会选择同样会启动 sandbox pod 的 worker（参见负载分发）：

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

## 调度 (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` 接受包含 `nodeSelector`、`tolerations`、`runtimeClassName`（例如 gVisor）、`imagePullSecrets` 和 `priorityClassName` 的 JSON 配置。不接受其他任何字段。

## 负载分发

Worker 是相同镜像的额外 Deployments，带有 `HEYM_INSTANCE_ROLE=worker`、相同的 `SECRET_KEY` 和 `ENCRYPTION_KEY` 以及 `heym-backend` ServiceAccount，因此它们也能启动 sandbox pod。Worker 负责运行 Code 节点，因此需要在工作区目录为其依赖项配置存储声明：其自身的 `ReadWriteOnce` 声明即可满足需求，因为这些目录仅在单次运行期间存在。`overlays/orbstack-cluster` 会添加一个 worker；`scripts/k8s-cluster-smoke.sh` 用于验证排队的运行任务是否分配至该 worker 且其 sandbox pod 归属于该 worker。

请直接使用 uvicorn 启动 worker，如 `overlays/orbstack-cluster/worker.yaml` 所示。镜像入口点会执行数据库迁移，而迁移属于主实例（main）的职责。为每个 worker 分配一个唯一且稳定的 `HEYM_INSTANCE_ID`；StatefulSet 的 pod 名称非常适用。已停止 worker 的队列运行任务将由领导者（leader）转移到其他实例。

## 在 OrbStack 上进行本地测试

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

对于 main 加上一个 worker，请改为应用 `overlays/orbstack-cluster` 并运行 `./scripts/k8s-cluster-smoke.sh`。

## 相关主题

- [示例清单和源码 README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [运行与部署](./running-and-deployment.md)
- [负载分发](../reference/cluster.md)
