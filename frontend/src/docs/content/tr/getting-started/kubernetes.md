# Kubernetes Üzerinde Heym

Heym'i bir Docker soketi olmadan Kubernetes üzerinde dağıtın. Depolama, ağ iletişimi ve worker kılavuzları ile her sandbox'ı kendi pod'u olarak çalıştırın.

Heym'i bir Docker soketi olmadan çalıştırmak için örnek manifestler. Her sandbox (Python araçları, skills, Code düğümü, dosya analizi, Playwright, MCP stdio, Codex, OpenCode), Kubernetes API aracılığıyla kendi pod'u olarak çalışır.

## Gereksinimler

- Kubernetes 1.30 veya daha yenisi (sandbox stdin, `v5.channel.k8s.io` iliştirme protokolünü kullanır).
- NetworkPolicy uygulayan bir CNI. Heym, ilk çevrimdışı sandbox'tan önce bunu doğrular ve bir test pod'u hala bağlantı kurabiliyorsa çevrimdışı sandbox'ları çalıştırmayı reddeder.
- Kubelet `podPidsLimit` değeri. Pod'lar pod başına bir PID sınırı alanına sahip değildir; bu nedenle bellek, CPU ve zaman aşımının yanında fork-bomb saldırılarına karşı tek korumadır. Heym bunu kontrol edemez: bir konteynerin `/sys/fs/cgroup/pids.max` değeri pod'un değil, kendi cgroup'unun değeridir. Talos varsayılan olarak bu sınır olmadan gelir.

## Kurulum

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm), Alexey Masolov tarafından sürdürülen ve [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym) üzerinde yayınlanan, OpenShift, EKS, AKS ve GKE için platform ön ayarları sunan bir topluluk chart'ıdır:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Depolama (Storage)

`heym-data`, Drive dosyalarını, eklentileri ve Codex/OpenCode çalışma alanlarını barındırır. Sandbox pod'ları çalıştırma başına bunun bir `subPath` yolunu bağlar. `ReadWriteMany` ile herhangi bir düğümde çalışabilirler. `ReadWriteOnce` ile backend düğümüne sabitlenirler. `ReadWriteOncePod` desteklenmez.

## Özel CA Sertifika Paketleri

CA paketinizi backend pod'una bağlayın ve `SSL_CERT_FILE` (veya `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) değişkenini buna yönlendirin. Heym, dosyayı birim talebindeki `codex-workspaces/_ca/` yoluna kopyalar ve bu kopyayı değişkeni alan her sandbox'ta aynı yola salt okunur olarak bağlar. Bir `ReadWriteOnce` talebi ile bu sandbox'lar backend düğümünde çalışır.

Bir CA ağı açmaz. Sandbox egress trafiği yalnızca genel adreslere ulaşır; bu nedenle dahili bir paket aynası, proxy veya dahili bir API kendi kuralına ihtiyaç duyar, örneğin:

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

## Ayrılmış Bir Sandbox Namespace'i

Sandbox'ları başka bir yerde çalıştırmak için `HEYM_SANDBOX_K8S_NAMESPACE` tanımlayın, bu namespace'i `pod-security.kubernetes.io/enforce: restricted` olarak etiketleyin, Role nesnesini oraya taşıyın ve Heym'in namespace'inde `pods` üzerinde `get` yetkisi veren bir Role bulundurun. Çalışma alanı sandbox'ları daha sonra sandbox namespace'inde aynı RWX paylaşımına bağlı `heym-data` adlı bir talebe ihtiyaç duyar (statik olarak sağlanan ikinci bir PersistentVolume).

## Kubernetes Secrets Üzerinden Credentials

`heym.run/credential: "true"` olarak etiketlenmiş bir Secret, salt okunur bir credential haline gelir. Değerler her işlemin belleğinde kalır ve hiçbir zaman veritabanına veya yedeklerine ulaşmaz; Secret'ın değiştirilmesi, yeniden başlatmaya gerek kalmadan credential'ı döndürür. Secret yazan tüm araçlar desteklenir: External Secrets Operator, SealedSecrets, Flux veya Argo CD aracılığıyla SOPS veya `kubectl`.

Bileşeni overlay'inize ekleyin. ServiceAccount'a Secrets üzerinde `get`, `list` ve `watch` izinleri verir ve her Deployment üzerinde `HEYM_K8S_CREDENTIALS=true` ayarını yapar:

    components:
      - ../../components/kubernetes-credentials

Secrets RBAC etikete göre daraltılamaz; bu nedenle Heym, izlenen namespace içindeki her Secret'ı okuyabilir. Heym'i kendi namespace'inde çalıştırın veya `HEYM_K8S_CREDENTIALS_NAMESPACE` değerini yalnızca Heym credential'larını barındıran bir namespace olarak ayarlayın. `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` veya `HEYM_MCP_STDIO_SANDBOX` değişkenlerinden herhangi biri `subprocess` olarak ayarlandığında başlatma reddedilir, çünkü kullanıcı kodu ServiceAccount belirtecinin yanında çalışır.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heym'de gösterilen credential adı
        heym.run/type: custom                   # Bir credential türü
        heym.run/owner: admin@example.com       # Mevcut bir kullanıcı
        heym.run/share-users: alice@example.com # İsteğe bağlı, virgülle ayrılmış e-postalar
        heym.run/share-teams: automation        # İsteğe bağlı, virgülle ayrılmış ekip adları
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Her veri anahtarı bir yapılandırma alanıdır. İç içe veya dize olmayan alanlara sahip bir tür için tüm yapılandırmayı tek bir `config.json` anahtarı altında JSON olarak yerleştirin. Yenilenen OAuth belirteçlerini depolayan türler (Codex, Google, BigQuery ve OAuth modundaki Linear veya Notion) salt okunur olamaz ve reddedilir.

External Secrets Operator ile etiketi ve ek açıklamaları hedef şablona yerleştirin:

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

Neler beklenmeli:

- **Bir pod senkronize edilmeden önce Ready durumunda olabilir.** Başlatma API sunucusunu beklemez, bu nedenle kullanıcı arayüzü onsuz da erişilebilir kalır. Bir işlem senkronize edilene kadar kuyruktaki çalıştırmaları talep etmez; bu credential'lardan birini kullanan bir çalıştırma, herhangi bir düğüm çalışmadan önce `not synced from Kubernetes yet` hatasıyla başarısız olur. Ayarlar → Kubernetes (yalnızca `HEYM_K8S_CREDENTIALS` açıkken görünen bir yönetici sekmesi) ve Ayarlar → Örnekler senkronizasyon durumunu gösterir; bu nedenle Ready durumunun senkronize anlamına geldiğini varsayan bir sistem durumu denetimi (health check) oluşturmayın.
- **Silinen bir Secret, kimliğini ve paylaşımlarını koruyarak credential'ını kullanılamaz hale getirir**; Secret'ın yeniden oluşturulması (GitOps temizleme ve yeniden uygulama) bunu her workflow için geri yükler. Satırlar hiçbir zaman otomatik olarak kaldırılmaz; bir yönetici bunları Ayarlar → Kubernetes bölümünden kaldırır.
- **Henüz oturum açmamış bir sahip için** işlem her beş dakikada bir yeniden denenir.
- **Aynı ada ve sahibe sahip bir kullanıcı credential'ı** asla üzerine yazılmaz; bunun yerine Secret bir çakışma olarak bildirilir.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes, DNS Service bir DNS pod'una çevrildikten sonra egress politikasını değerlendirir ve OpenShift'in DNS pod'ları 53 değil, 5353 numaralı bağlantı noktasını dinler. Temel politika ile ağa bağlı sandbox'lar internete IP ile ulaşır ancak tüm ad çözümlemeleri zaman aşımına uğrar. Overlay yalnızca bu kuralı değiştirir:

- Service'in 53 numaralı bağlantı noktası yerine DNS pod'larının bağlantı noktası olan UDP ve TCP 5353'e izin verir.
- DNS namespace'ini `kubernetes.io/metadata.name: openshift-dns` aracılığıyla seçer. `network.openshift.io/policy-group: dns` her kümede ayarlanmamıştır.
- Genel `ipBlock` kuralı özel, link-local ve CGNAT aralıklarını hariç tutmaya devam eder.

## Kube-proxy Değişimi ile Cilium

Temel yapılandırma backend pod'una herhangi bir egress politikası vermez. Bir tane eklerseniz, düz bir `ipBlock` API sunucusuna izin veremez: Service adresi, politika uygulanmadan önce bir düğümün `:6443` portuna yeniden yazılır ve bu adres Cilium'un `kube-apiserver` kimliğini taşır. Buna bir `CiliumNetworkPolicy` ile izin verin. Bu ayrıca sandbox pod'larını da başlatan worker'ları seçer (bkz. Yük Dağıtımı):

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

## Zamanlama (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES`, `nodeSelector`, `tolerations`, `runtimeClassName` (örneğin gVisor), `imagePullSecrets` ve `priorityClassName` içeren JSON'u kabul eder. Başka hiçbir alan kabul edilmez.

## Yük Dağıtımı

Worker'lar, `HEYM_INSTANCE_ROLE=worker`, aynı `SECRET_KEY` ve `ENCRYPTION_KEY` değerleri ve `heym-backend` ServiceAccount hesabı ile aynı görüntünün ek Deployments nesneleridir, böylece onlar da sandbox pod'ları başlatabilir. Bir worker Code düğümünü çalıştırır, bu nedenle Code düğümü bağımlılıkları için çalışma alanı dizininde bir talebe ihtiyaç duyar: kendi `ReadWriteOnce` talebi yeterlidir, çünkü bu dizinler yalnızca bir çalıştırma süresince yaşar. `overlays/orbstack-cluster` bir worker ekler; `scripts/k8s-cluster-smoke.sh`, kuyruktaki çalıştırmaların ona ulaştığını ve sandbox pod'larının o worker'a ait olduğunu doğrular.

Worker'ları `overlays/orbstack-cluster/worker.yaml` dosyasında yapıldığı gibi doğrudan uvicorn ile başlatın. Görüntü giriş noktası veritabanı geçişlerini çalıştırır ve bunlar ana (main) örneğe aittir. Her worker'a benzersiz, kararlı bir `HEYM_INSTANCE_ID` atayın; bir StatefulSet pod adı bu amaç için idealdir. Durdurulan bir worker için kuyruğa alınan çalıştırmalar, lider tarafından başka bir örneğe taşınır.

## OrbStack Üzerinde Yerel Test

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Ana örnek ve bir worker için bunun yerine `overlays/orbstack-cluster` uygulayın ve `./scripts/k8s-cluster-smoke.sh` çalıştırın.

## İlgili Konular

- [Örnek manifestler ve kaynak README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Çalıştırma ve Dağıtım](./running-and-deployment.md)
- [Yük Dağıtımı](../reference/cluster.md)
