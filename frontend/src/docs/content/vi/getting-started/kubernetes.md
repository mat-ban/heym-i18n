# Heym trên Kubernetes

Triển khai Heym trên Kubernetes mà không cần Docker socket. Chạy mỗi sandbox dưới dạng một pod độc lập, kèm theo hướng dẫn về lưu trữ, mạng và workers.

Các manifest mẫu để chạy Heym mà không cần Docker socket. Mỗi sandbox (công cụ Python, skills, node Code, phân tích tệp, Playwright, MCP stdio, Codex, OpenCode) chạy dưới dạng một pod riêng thông qua Kubernetes API.

## Yêu cầu

- Kubernetes 1.30 trở lên (stdin của sandbox sử dụng giao thức đính kèm `v5.channel.k8s.io`).
- Một CNI thực thi NetworkPolicy. Heym kiểm tra điều này trước sandbox ngoại tuyến đầu tiên và từ chối chạy sandbox ngoại tuyến nếu pod thử nghiệm vẫn có thể kết nối.
- Giá trị `podPidsLimit` trong kubelet. Các pod không có trường giới hạn PID theo từng pod; do đó đây là biện pháp bảo vệ duy nhất chống lại fork-bomb bên cạnh bộ nhớ, CPU và giới hạn thời gian. Heym không thể kiểm tra điều này: `/sys/fs/cgroup/pids.max` của một container thuộc về cgroup của chính nó, không phải của pod. Talos mặc định được phát hành mà không có giới hạn này.

## Cài đặt

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) là một chart cộng đồng được duy trì bởi Alexey Masolov và xuất bản trên [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), với các cấu hình sẵn cho OpenShift, EKS, AKS và GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Lưu trữ (Storage)

`heym-data` lưu trữ các tệp Drive, plugin và không gian làm việc Codex/OpenCode. Các pod sandbox gắn một `subPath` của ổ đĩa này cho mỗi lần chạy. Với `ReadWriteMany`, chúng có thể chạy trên bất kỳ node nào. Với `ReadWriteOnce`, chúng được gắn chặt vào node của backend. `ReadWriteOncePod` không được hỗ trợ.

## Gói chứng chỉ CA tùy chỉnh

Gắn gói CA của bạn vào pod backend và trỏ `SSL_CERT_FILE` (hoặc `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) vào đó. Heym sao chép tệp vào `codex-workspaces/_ca/` trên yêu cầu ổ đĩa và gắn bản sao đó dưới dạng chỉ đọc tại cùng một đường dẫn trong mỗi sandbox nhận biến. Với yêu cầu `ReadWriteOnce`, các sandbox đó sẽ chạy trên node của backend.

Một CA không mở mạng. Lưu lượng egress của sandbox chỉ tiếp cận các địa chỉ công cộng; do đó, máy nhân bản gói nội bộ, proxy hoặc API nội bộ cần quy tắc riêng, ví dụ:

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

## Một namespace chuyên dụng cho sandbox

Đặt `HEYM_SANDBOX_K8S_NAMESPACE` để chạy sandbox ở nơi khác, gắn nhãn namespace đó là `pod-security.kubernetes.io/enforce: restricted`, chuyển Role đến đó và giữ lại trong namespace của Heym một Role cấp quyền `get` trên `pods`. Các sandbox không gian làm việc sau đó cần một yêu cầu tên là `heym-data` trong namespace sandbox liên kết với cùng một chia sẻ RWX (PersistentVolume thứ hai được cấp phát tĩnh).

## Credentials từ Kubernetes Secrets

Một Secret được gắn nhãn `heym.run/credential: "true"` sẽ trở thành một credential chỉ đọc. Các giá trị nằm trong bộ nhớ của từng tiến trình và không bao giờ đi vào cơ sở dữ liệu hoặc các bản sao lưu của nó; việc thay đổi Secret sẽ xoay vòng credential mà không cần khởi động lại. Bất kỳ công cụ nào ghi Secret đều hoạt động: External Secrets Operator, SealedSecrets, SOPS qua Flux hoặc Argo CD, hoặc `kubectl`.

Thêm thành phần vào overlay của bạn. Nó cấp cho ServiceAccount quyền `get`, `list` và `watch` trên Secrets và đặt `HEYM_K8S_CREDENTIALS=true` trên mỗi Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC của Secrets không thể thu hẹp theo nhãn; do đó Heym có thể đọc mọi Secret trong namespace được theo dõi. Chạy Heym trong namespace riêng của nó hoặc đặt `HEYM_K8S_CREDENTIALS_NAMESPACE` thành namespace chỉ chứa các credential của Heym. Quá trình khởi động sẽ bị từ chối nếu bất kỳ biến nào trong `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` hoặc `HEYM_MCP_STDIO_SANDBOX` được đặt thành `subprocess`, vì mã người dùng sẽ chạy cạnh mã thông báo của ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Tên credential hiển thị trong Heym
        heym.run/type: custom                   # Một loại credential
        heym.run/owner: admin@example.com       # Người dùng hiện có
        heym.run/share-users: alice@example.com # Email tùy chọn cách nhau bằng dấu phẩy
        heym.run/share-teams: automation        # Tên nhóm tùy chọn cách nhau bằng dấu phẩy
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Mỗi khóa dữ liệu là một trường cấu hình. Đối với loại có các trường lồng nhau hoặc không phải chuỗi, hãy đặt toàn bộ cấu hình dưới dạng JSON dưới một khóa `config.json` duy nhất. Các loại lưu trữ mã thông báo OAuth được làm mới (Codex, Google, BigQuery và Linear hoặc Notion ở chế độ OAuth) không thể là chỉ đọc và bị từ chối.

Với External Secrets Operator, hãy đặt nhãn và các chú thích trên mẫu đích:

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

Những điều cần lưu ý:

- **Một pod có thể ở trạng thái Ready trước khi được đồng bộ hóa.** Quá trình khởi động không đợi máy chủ API, do đó giao diện người dùng vẫn khả dụng. Cho đến khi một tiến trình được đồng bộ hóa, nó không nhận các lượt chạy trong hàng đợi; một lượt chạy sử dụng một trong các credential này sẽ thất bại với `not synced from Kubernetes yet` trước khi bất kỳ node nào chạy. Cài đặt → Kubernetes (tab quản trị chỉ xuất hiện khi `HEYM_K8S_CREDENTIALS` bật) và Cài đặt → Phiên bản hiển thị trạng thái đồng bộ hóa; do đó, không xây dựng kiểm tra tình trạng (health check) giả định rằng Ready có nghĩa là đã đồng bộ hóa.
- **Một Secret bị xóa làm cho credential của nó không khả dụng**, nhưng vẫn giữ nguyên ID và quyền chia sẻ; việc tạo lại Secret (dọn dẹp GitOps và áp dụng lại) sẽ khôi phục nó cho mọi workflow. Các hàng không bao giờ bị xóa tự động; quản trị viên xóa chúng từ Cài đặt → Kubernetes.
- **Đối với chủ sở hữu chưa đăng nhập**, hệ thống sẽ thử lại sau mỗi năm phút.
- **Credential của người dùng có cùng tên và chủ sở hữu** không bao giờ bị ghi đè; thay vào đó, Secret được báo cáo là một xung đột.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes đánh giá chính sách egress sau khi DNS Service được dịch thành một pod DNS, và các pod DNS của OpenShift lắng nghe trên cổng 5353, không phải 53. Với chính sách cơ sở, các sandbox được nối mạng kết nối tới internet bằng IP nhưng mọi truy vấn tên miền đều bị quá thời gian. Overlay chỉ thay đổi quy tắc đó:

- Cho phép UDP và TCP 5353 (cổng của các pod DNS), không phải 53 của Service.
- Chọn namespace DNS thông qua `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` không được đặt trên mọi cụm.
- Quy tắc `ipBlock` công khai tiếp tục loại trừ các dải mạng riêng tư, link-local và CGNAT.

## Cilium với sự thay thế kube-proxy

Cấu hình cơ sở không cấp chính sách egress cho pod backend. Nếu bạn thêm vào, một `ipBlock` thông thường không thể cho phép máy chủ API: địa chỉ Service được ghi lại thành `:6443` của một node trước khi áp dụng chính sách, và địa chỉ đó mang danh tính `kube-apiserver` của Cilium. Cho phép điều này bằng `CiliumNetworkPolicy`. Nó cũng chọn các worker, những thành phần cũng khởi chạy các pod sandbox (xem Phân phối tải):

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

## Lập lịch (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` nhận JSON với `nodeSelector`, `tolerations`, `runtimeClassName` (ví dụ gVisor), `imagePullSecrets` và `priorityClassName`. Không có trường nào khác được chấp nhận.

## Phân phối tải

Các worker là các Deployments bổ sung của cùng một image với `HEYM_INSTANCE_ROLE=worker`, cùng các giá trị `SECRET_KEY` và `ENCRYPTION_KEY`, và ServiceAccount `heym-backend`, nhờ đó chúng cũng có thể khởi động các pod sandbox. Một worker thực thi node Code, vì vậy nó cần một yêu cầu ổ đĩa tại thư mục không gian làm việc cho các phần phụ thuộc của node Code: yêu cầu `ReadWriteOnce` của riêng nó là đủ, vì các thư mục này chỉ tồn tại trong một lần chạy. `overlays/orbstack-cluster` thêm một worker; `scripts/k8s-cluster-smoke.sh` kiểm tra để các lần chạy trong hàng đợi đến được worker đó và các pod sandbox của chúng thuộc về worker đó.

Khởi động các worker trực tiếp bằng uvicorn, như được thực hiện trong `overlays/orbstack-cluster/worker.yaml`. Điểm vào của image chạy các di chuyển cơ sở dữ liệu, và những việc đó thuộc về phiên bản chính (main). Cung cấp cho mỗi worker một `HEYM_INSTANCE_ID` duy nhất và ổn định; tên pod trong StatefulSet hoạt động rất tốt. Các lần chạy được xếp hàng đợi cho một worker bị dừng sẽ được phiên bản dẫn đầu (leader) chuyển sang một phiên bản khác.

## Kiểm tra cục bộ trên OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Đối với phiên bản main cộng với một worker, hãy áp dụng `overlays/orbstack-cluster` và chạy `./scripts/k8s-cluster-smoke.sh`.

## Chủ đề liên quan

- [Các manifest mẫu và README mã nguồn](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Vận hành và Triển khai](./running-and-deployment.md)
- [Phân phối tải](../reference/cluster.md)
