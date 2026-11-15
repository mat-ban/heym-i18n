# Kubernetes 환경의 Heym

Docker 소켓 없이 Kubernetes에 Heym을 배포하세요. 스토리지, 네트워킹 및 worker 가이드를 참조하여 각 sandbox를 독립된 pod로 실행할 수 있습니다.

Docker 소켓 없이 Heym을 실행하기 위한 예제 매니페스트입니다. 각 sandbox(Python 도구, skills, Code 노드, 파일 분석, Playwright, MCP stdio, Codex, OpenCode)는 Kubernetes API를 통해 자체 pod로 실행됩니다.

## 요구 사항

- Kubernetes 1.30 이상 (sandbox stdin은 `v5.channel.k8s.io` 연결 프로토콜을 사용합니다).
- NetworkPolicy를 적용하는 CNI. Heym은 첫 번째 오프라인 sandbox 실행 전에 이를 확인하며, 테스트 pod가 여전히 연결할 수 있는 경우 오프라인 sandbox 실행을 거부합니다.
- kubelet의 `podPidsLimit`. Pod에는 pod별 PID 제한 필드가 없으므로 메모리, CPU 및 실행 마감 시간 외에 fork-bomb 공격을 방지하는 유일한 수단입니다. Heym은 이를 자체적으로 검사할 수 없습니다. 컨테이너의 `/sys/fs/cgroup/pids.max`는 pod가 아닌 컨테이너 자체 cgroup에 속합니다. Talos는 기본적으로 이 제한 없이 제공됩니다.

## 설치

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm)은 Alexey Masolov가 관리하고 [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym)에 게시된 커뮤니티 chart로, OpenShift, EKS, AKS 및 GKE용 플랫폼 사전 설정을 제공합니다.

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## 스토리지 (Storage)

`heym-data`는 Drive 파일, 플러그인 및 Codex/OpenCode 작업 공간을 저장합니다. Sandbox pod는 실행당 이 볼륨의 `subPath` 하나를 마운트합니다. `ReadWriteMany`를 사용하면 모든 노드에서 실행될 수 있습니다. `ReadWriteOnce`를 사용하면 backend 노드에 고정됩니다. `ReadWriteOncePod`는 지원되지 않습니다.

## 사용자 지정 CA 인증서 번들

CA 번들을 backend pod에 마운트하고 `SSL_CERT_FILE`(또는 `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`)이 해당 경로를 가리키도록 설정합니다. Heym은 파일을 볼륨 요청의 `codex-workspaces/_ca/`에 복사하고, 해당 변수를 수신하는 모든 sandbox의 동일한 경로에 읽기 전용으로 마운트합니다. `ReadWriteOnce` 요청을 사용하면 이러한 sandbox는 backend 노드에서 실행됩니다.

CA가 네트워크를 개방하지는 않습니다. Sandbox의 egress 트래픽은 공개 주소에만 도달하므로 내부 패키지 미러, 프록시 또는 내부 API에는 별도의 규칙이 필요합니다. 예:

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

## 전용 Sandbox Namespace

`HEYM_SANDBOX_K8S_NAMESPACE`를 설정하여 sandbox를 다른 위치에서 실행하고, 해당 namespace에 `pod-security.kubernetes.io/enforce: restricted` 레이블을 지정하고, Role을 그곳으로 이동한 후 Heym의 namespace에는 `pods`에 대한 `get` 권한을 부여하는 Role을 유지합니다. 그러면 작업 공간 sandbox에는 동일한 RWX 공유(정적으로 프로비저닝된 두 번째 PersistentVolume)에 바인딩된 sandbox namespace의 `heym-data`라는 요청이 필요합니다.

## Kubernetes Secrets 기반 Credentials

`heym.run/credential: "true"` 레이블이 지정된 Secret은 읽기 전용 credential이 됩니다. 값은 각 프로세스의 메모리에 유지되며 데이터베이스나 백업에 저장되지 않습니다. Secret을 수정하면 재시작 없이 credential이 순환(rotate)됩니다. Secret을 작성하는 모든 도구(External Secrets Operator, SealedSecrets, Flux 또는 Argo CD를 통한 SOPS, `kubectl`)가 지원됩니다.

오버레이에 컴포넌트를 추가합니다. 이 컴포넌트는 ServiceAccount에 Secrets에 대한 `get`, `list`, `watch` 권한을 부여하고 모든 Deployment에 `HEYM_K8S_CREDENTIALS=true`를 설정합니다.

    components:
      - ../../components/kubernetes-credentials

Secrets의 RBAC는 레이블별로 범위를 좁힐 수 없으므로 Heym은 모니터링되는 namespace의 모든 Secret을 읽을 수 있습니다. Heym을 자체 namespace에서 실행하거나 `HEYM_K8S_CREDENTIALS_NAMESPACE`를 Heym credential만 포함하는 namespace로 설정하세요. `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` 또는 `HEYM_MCP_STDIO_SANDBOX` 중 하나라도 `subprocess`로 설정되어 있으면 사용자 코드가 ServiceAccount 토큰 옆에서 실행되므로 시작이 거부됩니다.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heym에 표시되는 credential 이름
        heym.run/type: custom                   # credential 유형
        heym.run/owner: admin@example.com       # 기존 사용자
        heym.run/share-users: alice@example.com # 선택 사항, 쉼표로 구분된 이메일
        heym.run/share-teams: automation        # 선택 사항, 쉼표로 구분된 팀 이름
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

각 데이터 키는 구성 필드입니다. 중첩된 필드나 문자열이 아닌 필드가 있는 유형의 경우 단일 `config.json` 키 아래에 전체 구성을 JSON으로 배치하세요. 갱신된 OAuth 토큰을 저장하는 유형(Codex, Google, BigQuery 및 OAuth 모드의 Linear 또는 Notion)은 읽기 전용으로 설정할 수 없으므로 거부됩니다.

External Secrets Operator를 사용하는 경우 대상 템플릿에 레이블과 어노테이션을 추가하세요.

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

예상되는 동작:

- **Pod는 동기화되기 전에 Ready 상태가 될 수 있습니다.** 시작 프로세스는 API 서버를 기다리지 않으므로 UI는 API 서버 없이도 계속 작동합니다. 프로세스가 동기화될 때까지 대기열에 있는 실행을 가져오지 않습니다. 이러한 credential 중 하나를 사용하는 실행은 노드가 실행되기 전에 `not synced from Kubernetes yet` 오류로 실패합니다. 설정 → Kubernetes(`HEYM_K8S_CREDENTIALS`가 켜져 있을 때만 나타나는 관리자 탭) 및 설정 → 인스턴스에 동기화 상태가 표시됩니다. 따라서 Ready 상태가 동기화 완료를 의미한다고 가정하는 상태 확인(health check)을 구성하지 마세요.
- **삭제된 Secret은 credential을 사용할 수 없게 만들지만** ID와 공유 관계는 유지됩니다. 따라서 Secret을 다시 생성(GitOps 정리 및 재적용)하면 모든 workflow에 대해 복원됩니다. 행은 자동으로 제거되지 않으며 관리자가 설정 → Kubernetes에서 수동으로 제거합니다.
- **아직 로그인하지 않은 소유자에 대해서는** 5분마다 재시도합니다.
- **이름과 소유자가 동일한 사용자 credential은** 덮어쓰지 않으며 Secret이 충돌로 보고됩니다.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes는 DNS Service가 DNS pod로 변환된 후 egress 정책을 평가하며, OpenShift의 DNS pod는 53이 아닌 5353 포트에서 수신 대기합니다. 기본 정책을 사용하면 네트워크에 연결된 sandbox가 IP를 통해 인터넷에 연결되지만 모든 도메인 이름 확인이 시간 초과됩니다. 오버레이는 해당 규칙만 수정합니다.

- Service의 53 포트 대신 DNS pod의 포트인 UDP 및 TCP 5353을 허용합니다.
- `kubernetes.io/metadata.name: openshift-dns`를 통해 DNS namespace를 선택합니다. `network.openshift.io/policy-group: dns`는 모든 클러스터에 설정되어 있지는 않습니다.
- 공개 `ipBlock` 규칙은 개인, 링크 로컬 및 CGNAT 범위를 계속 제외합니다.

## kube-proxy 대체 환경의 Cilium

기본 구성은 backend pod에 egress 정책을 할당하지 않습니다. 정책을 추가하는 경우 일반 `ipBlock`으로는 API 서버를 허용할 수 없습니다. 정책이 적용되기 전에 Service 주소가 노드의 `:6443`으로 다시 작성되고 해당 주소에는 Cilium의 `kube-apiserver` ID가 부여되기 때문입니다. `CiliumNetworkPolicy`로 이를 허용하세요. 이 정책은 sandbox pod도 시작하는 worker도 함께 선택합니다(부하 분산 참조).

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

## 스케줄링 (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES`는 `nodeSelector`, `tolerations`, `runtimeClassName`(예: gVisor), `imagePullSecrets` 및 `priorityClassName`이 포함된 JSON을 허용합니다. 다른 필드는 허용되지 않습니다.

## 부하 분산

Worker는 `HEYM_INSTANCE_ROLE=worker`, 동일한 `SECRET_KEY` 및 `ENCRYPTION_KEY`, 그리고 `heym-backend` ServiceAccount를 사용하는 동일한 이미지의 추가 Deployments이므로 sandbox pod를 시작할 수도 있습니다. Worker는 Code 노드를 실행하므로 Code 노드 종속성을 위해 작업 공간 디렉터리에 볼륨 요청이 필요합니다. 이러한 디렉터리는 단 한 번의 실행 동안만 유지되므로 자체 `ReadWriteOnce` 요청으로 충분합니다. `overlays/orbstack-cluster`는 worker 하나를 추가합니다. `scripts/k8s-cluster-smoke.sh`는 대기열에 있는 실행이 해당 worker에 도달하고 해당 sandbox pod가 worker의 소유인지 확인합니다.

`overlays/orbstack-cluster/worker.yaml`에 정의된 대로 uvicorn으로 worker를 직접 시작하세요. 이미지 진입점은 데이터베이스 마이그레이션을 실행하며 이는 기본 인스턴스(main)의 역할입니다. 각 worker에 고유하고 안정적인 `HEYM_INSTANCE_ID`를 할당하세요. StatefulSet pod 이름이 적합합니다. 중지된 worker에 대기 중인 실행은 리더(leader)에 의해 다른 인스턴스로 이동됩니다.

## OrbStack에서 로컬 테스트

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

main과 worker 하나를 함께 테스트하려면 `overlays/orbstack-cluster`를 적용하고 `./scripts/k8s-cluster-smoke.sh`를 실행하세요.

## 관련 주제

- [예제 매니페스트 및 소스 README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [실행 및 배포](./running-and-deployment.md)
- [부하 분산](../reference/cluster.md)
