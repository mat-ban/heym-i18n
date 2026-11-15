# Kubernetes 上の Heym

Docker ソケットなしで Kubernetes 上に Heym をデプロイします。ストレージ、ネットワーク、worker のガイドを参照しながら、各 sandbox を独自の pod として実行します。

Docker ソケットなしで Heym を実行するためのサンプルマニフェストです。各 sandbox（Python ツール、skills、Code ノード、ファイル分析、Playwright、MCP stdio、Codex、OpenCode）は、Kubernetes API を通じて独自の pod として実行されます。

## 要件

- Kubernetes 1.30 以降（sandbox の stdin は `v5.channel.k8s.io` アタッチプロトコルを使用します）。
- NetworkPolicy を適用する CNI。Heym は最初のオフライン sandbox の前にこれを検証し、テスト pod が依然として接続可能な場合はオフライン sandbox の実行を拒否します。
- kubelet の `podPidsLimit`。Pod には pod ごとの PID 制限フィールドがないため、メモリ、CPU、実行期限に加えて、これが唯一の fork-bomb 対策となります。Heym はこれを検査できません。コンテナの `/sys/fs/cgroup/pids.max` は pod ではなくコンテナ自身の cgroup に属します。Talos はデフォルトでこの制限なしに出荷されます。

## インストール

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) は Alexey Masolov 氏によって保守され、[Artifact Hub](https://artifacthub.io/packages/helm/heym/heym) で公開されているコミュニティ chart であり、OpenShift、EKS、AKS、GKE 向けのプラットフォームプリセットを備えています。

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## ストレージ (Storage)

`heym-data` は Drive ファイル、プラグイン、および Codex/OpenCode ワークスペースを保持します。Sandbox pod は実行ごとにその `subPath` をマウントします。`ReadWriteMany` を使用すると、任意のノードで実行できます。`ReadWriteOnce` を使用すると、backend のノードに固定されます。`ReadWriteOncePod` はサポートされていません。

## カスタム CA 証明書バンドル

CA バンドルを backend pod にマウントし、`SSL_CERT_FILE`（または `REQUESTS_CA_BUNDLE`、`NODE_EXTRA_CA_CERTS`）をそのパスに向けます。Heym はファイルをボリューム要求の `codex-workspaces/_ca/` にコピーし、その変数値を受け取るすべての sandbox の同一パスに読み取り専用でマウントします。`ReadWriteOnce` 要求の場合、これらの sandbox は backend のノードで実行されます。

CA はネットワークを開放しません。Sandbox の egress はパブリックアドレスにのみ到達するため、内部パッケージミラー、プロキシ、または内部 API には独自のルールが必要です。例：

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

## 専用の Sandbox Namespace

`HEYM_SANDBOX_K8S_NAMESPACE` を設定して sandbox を別の場所で実行し、その namespace に `pod-security.kubernetes.io/enforce: restricted` ラベルを付与して Role を移動し、Heym の namespace に `pods` に対する `get` 権限を付与する Role を保持します。ワークスペースの sandbox には、同じ RWX 共有（静的にプロビジョニングされた 2 つ目の PersistentVolume）にバインドされた、sandbox namespace 内の `heym-data` という名前の要求が必要になります。

## Kubernetes Secrets からの Credentials

`heym.run/credential: "true"` とラベル付けされた Secret は、読み取り専用の credential になります。値は各プロセスのメモリ内に留まり、データベースやそのバックアップに保存されることはありません。Secret を変更すると、再起動なしで credential がローテーションされます。Secret を書き込む任意のツールが動作します：External Secrets Operator、SealedSecrets、Flux または Argo CD 経由の SOPS、あるいは `kubectl` です。

オーバーレイにコンポーネントを追加します。これにより ServiceAccount に Secrets に対する `get`、`list`、`watch` 権限が付与され、すべての Deployment に `HEYM_K8S_CREDENTIALS=true` が設定されます。

    components:
      - ../../components/kubernetes-credentials

Secrets の RBAC はラベルによって絞り込むことができないため、Heym は監視対象 namespace 内のすべての Secret を読み取ることができます。Heym を独自の namespace で実行するか、`HEYM_K8S_CREDENTIALS_NAMESPACE` を Heym の credential のみを保持する namespace に設定してください。`HEYM_PYTHON_TOOL_SANDBOX`、`HEYM_PLAYWRIGHT_SANDBOX`、または `HEYM_MCP_STDIO_SANDBOX` のいずれかが `subprocess` に設定されている場合、ユーザーコードが ServiceAccount トークンの横で実行されることになるため、起動が拒否されます。

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heym に表示される credential 名
        heym.run/type: custom                   # credential の種類
        heym.run/owner: admin@example.com       # 既存のユーザー
        heym.run/share-users: alice@example.com # 任意のカンマ区切りメールアドレス
        heym.run/share-teams: automation        # 任意のカンマ区切りチーム名
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

各データキーは設定フィールドに対応します。ネストされたフィールドや文字列以外のフィールドを持つタイプの場合は、単一の `config.json` キーの下に設定全体を JSON として配置してください。リフレッシュされた OAuth トークンを保存するタイプ（Codex、Google、BigQuery、および OAuth モードの Linear や Notion）は読み取り専用にできず、拒否されます。

External Secrets Operator を使用する場合は、ターゲットテンプレートにラベルとアノテーションを記述します。

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

留意事項：

- **Pod は同期完了前に Ready 状態になる場合があります。** 起動処理は API サーバーを待機しないため、UI は API サーバーなしでもアクセス可能です。プロセスが同期されるまで、キューに入れられた実行を引き受けることはありません。これらの credential のいずれかを使用する実行は、ノードが実行される前に `not synced from Kubernetes yet` で失敗します。設定 → Kubernetes（`HEYM_K8S_CREDENTIALS` が有効な場合のみ表示される管理者タブ）および 設定 → インスタンス で同期状態を確認できます。したがって、Ready が同期完了を意味すると仮定したヘルスチェックを構築しないでください。
- **削除された Secret はその credential を利用不可にしますが**、ID と共有設定は保持されます。Secret を再作成（GitOps の prune と再適用）することで、すべての workflow に対して復元されます。行が自動的に削除されることはありません。管理者が 設定 → Kubernetes から手動で削除します。
- **まだサインインしていない所有者については**、5分ごとに再試行されます。
- **同じ名前と所有者を持つユーザー credential は**決して上書きされず、Secret は競合として報告されます。

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes は DNS Service が DNS pod に変換された後に egress ポリシーを評価しますが、OpenShift の DNS pod は 53 ではなく 5353 番ポートをリッスンします。基本ポリシーでは、ネットワーク接続された sandbox は IP 経由でインターネットに到達できますが、すべての名前解決がタイムアウトします。オーバーレイはこのルールのみを変更します：

- Service の 53 番ポートではなく、DNS pod のポートである UDP および TCP 5353 を許可します。
- `kubernetes.io/metadata.name: openshift-dns` によって DNS namespace を選択します。`network.openshift.io/policy-group: dns` はすべてのクラスタで設定されているわけではありません。
- パブリックの `ipBlock` ルールは、プライベート、リンクローカル、CGNAT の各範囲を引き続き除外します。

## kube-proxy 代替環境での Cilium

基本設定では backend pod に egress ポリシーを割り当てていません。ポリシーを追加する場合、単純な `ipBlock` では API サーバーを許可できません。Service アドレスはポリシー適用前にノードの `:6443` に書き換えられ、そのアドレスは Cilium の `kube-apiserver` アイデンティティを保持するためです。`CiliumNetworkPolicy` でこれを許可してください。これは sandbox pod も起動する worker も選択します（負荷分散を参照）：

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

## スケジューリング (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` は、`nodeSelector`、`tolerations`、`runtimeClassName`（gVisor など）、`imagePullSecrets`、`priorityClassName` を含む JSON を受け入れます。その他のフィールドは受け付けられません。

## 負荷分散

Worker は、`HEYM_INSTANCE_ROLE=worker`、同じ `SECRET_KEY` および `ENCRYPTION_KEY`、および `heym-backend` ServiceAccount を備えた同一イメージの追加 Deployments であり、sandbox pod を起動することもできます。Worker は Code ノードを実行するため、Code ノードの依存関係のためにワークスペースディレクトリにボリューム要求が必要です。これらのディレクトリは 1 回の実行の間しか存在しないため、独自の `ReadWriteOnce` 要求で十分です。`overlays/orbstack-cluster` は worker を 1 つ追加します。`scripts/k8s-cluster-smoke.sh` は、キューに入れられた実行がその worker に到達し、その sandbox pod が worker のものであることを確認します。

`overlays/orbstack-cluster/worker.yaml` で行われているように、uvicorn で worker を直接起動します。イメージのエントリポイントはデータベース移行を実行しますが、それらは main インスタンスの役割です。各 worker に一意で安定した `HEYM_INSTANCE_ID` を付与してください。StatefulSet の pod 名が適しています。停止した worker 宛てにキューイングされた実行は、leader インスタンスによって別のインスタンスに移動されます。

## OrbStack でのローカルテスト

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

main に加えて worker をテストする場合は、代わりに `overlays/orbstack-cluster` を適用し、`./scripts/k8s-cluster-smoke.sh` を実行します。

## 関連トピック

- [サンプルマニフェストとソース README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [実行とデプロイ](./running-and-deployment.md)
- [負荷分散](../reference/cluster.md)
