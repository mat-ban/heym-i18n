# Heym в Kubernetes

Внедрете Heym в Kubernetes без Docker socket. Стартирайте всеки sandbox като самостоятелен pod с ръководства за съхранение, мрежа и workers.

Примерни манифести за изпълнение на Heym без Docker socket. Всеки sandbox (Python инструменти, skills, възелът Code, анализ на файлове, Playwright, MCP stdio, Codex, OpenCode) работи като собствен pod чрез Kubernetes API.

## Изисквания

- Kubernetes 1.30 или по-нов (stdin на sandbox използва протокола за прикачване `v5.channel.k8s.io`).
- CNI, който прилага NetworkPolicy. Heym проверява това преди първия офлайн sandbox и отказва стартиране на офлайн sandbox-ове, ако тестов pod все още може да осъществи връзка.
- Параметър `podPidsLimit` в kubelet. Pod-овете нямат поле за лимит на PID на ниво pod; следователно това е единствената защита срещу fork-бомби освен паметта, процесора и крайния срок за изпълнение. Heym не може да провери това: стойността `/sys/fs/cgroup/pids.max` на контейнера принадлежи на неговата собствена cgroup, а не на тази на pod-а. Talos се доставя без този лимит по подразбиране.

## Инсталация

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) е chart на общността, поддържан от Алексей Масолов и публикуван в [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), с предварителни настройки за платформи като OpenShift, EKS, AKS и GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Съхранение (Storage)

`heym-data` съхранява файлове на Drive, плъгини и работни пространства на Codex/OpenCode. Pod-овете на sandbox монтират един `subPath` от този обем за всяко изпълнение. С `ReadWriteMany` те могат да работят на всеки възел. С `ReadWriteOnce` те са фиксирани към възела на бекенда. `ReadWriteOncePod` не се поддържа.

## Персонализирани CA пакети

Монтирайте своя CA пакет в бекенд pod-а и насочете `SSL_CERT_FILE` (или `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) към него. Heym копира файла в `codex-workspaces/_ca/` на заявката за обем и монтира това копие в режим само за четене на същия път във всеки sandbox, който получава променливата. При заявка `ReadWriteOnce` тези sandbox-ове се изпълняват на възела на бекенда.

Сертифициращият орган (CA) не отваря мрежата. Egress трафикът на sandbox достига само до публични адреси; следователно вътрешно огледало за пакети, прокси или вътрешен API изисква собствено правило, например:

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

## Специализиран namespace за sandbox-ове

Задайте `HEYM_SANDBOX_K8S_NAMESPACE`, за да изпълнявате sandbox-ове в друг namespace, етикетирайте този namespace с `pod-security.kubernetes.io/enforce: restricted`, преместете Role там и запазете в namespace-а на Heym Role, която предоставя `get` за `pods`. Sandbox-овете на работните пространства след това се нуждаят от заявка с име `heym-data` в namespace-а на sandbox, свързана със същия RWX дял (втори, статично осигурен PersistentVolume).

## Credentials от Kubernetes Secrets

Secret с етикет `heym.run/credential: "true"` се превръща в credential само за четене. Стойностите остават в паметта на всеки процес и никога не достигат до базата данни или нейните резервни копия; промяната на Secret ротира credential-а без рестартиране. Всеки инструмент, който записва Secret, се поддържа: External Secrets Operator, SealedSecrets, SOPS през Flux или Argo CD, или `kubectl`.

Добавете компонента към вашия overlay. Той предоставя на ServiceAccount права за `get`, `list` и `watch` върху Secrets и задава `HEYM_K8S_CREDENTIALS=true` на всеки Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC за Secrets не може да се стеснява по етикет; следователно Heym може да чете всеки Secret в наблюдавания namespace. Изпълнявайте Heym в собствен namespace или задайте `HEYM_K8S_CREDENTIALS_NAMESPACE` за namespace, съдържащ само credentials на Heym. Стартирането се отказва, ако някоя от променливите `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` или `HEYM_MCP_STDIO_SANDBOX` е настроена на `subprocess`, тъй като потребителският код би се изпълнявал до токена на ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Име на credential, показвано в Heym
        heym.run/type: custom                   # Тип credential
        heym.run/owner: admin@example.com       # Съществуващ потребител
        heym.run/share-users: alice@example.com # Незадължителни имейли, разделени със запетая
        heym.run/share-teams: automation        # Незадължителни имена на екипи, разделени със запетая
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Всеки ключ с данни представлява конфигурационно поле. За тип с вложени полета или полета, различни от низове, поставете цялата конфигурация като JSON под един ключ `config.json`. Типове, които съхраняват обновени OAuth токени (Codex, Google, BigQuery и Linear или Notion в режим OAuth), не могат да бъдат само за четене и се отхвърлят.

При External Secrets Operator поставете етикета и анотациите върху целевия шаблон:

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

Какво да очаквате:

- **Pod може да бъде в състояние Ready преди да е синхронизиран.** Стартирането не чака API сървъра, така че потребителският интерфейс остава достъпен. Докато даден процес не се синхронизира, той не поема изпълнения на опашка; изпълнение, използващо един от тези credentials, се проваля с `not synced from Kubernetes yet` преди изпълнението на който и да е възел. Настройки → Kubernetes (администраторски раздел, видим само при включен `HEYM_K8S_CREDENTIALS`) и Настройки → Инстанции показват състоянието на синхронизация; следователно не изграждайте проверка на състоянието (health check), която приема, че Ready означава синхронизиран.
- **Изтрит Secret прави неговия credential недостъпен**, като запазва неговия идентификатор и споделяния; повторното създаване на Secret (изчистване и повторно прилагане чрез GitOps) го възстановява за всеки workflow. Редовете никога не се премахват автоматично; администраторът ги премахва от Настройки → Kubernetes.
- **За собственик, който все още не е влязъл**, се прави повторен опит на всеки пет минути.
- **Потребителски credential със същото име и собственик** никога не се презаписва; вместо това Secret се съобщава като конфликт.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes оценява политиката за egress, след като DNS услугата Service бъде преведена към DNS pod, а DNS pod-овете на OpenShift слушат на порт 5353, а не 53. С базовата политика мрежовите sandbox-ове достигат до интернет по IP адрес, но всяко търсене на имена изтича по време (timeout). Overlay променя единствено това правило:

- Разрешава UDP и TCP на порт 5353 (портът на DNS pod-овете), а не 53 на Service.
- Избира DNS namespace чрез `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` не е зададен на всеки клъстер.
- Публичното правило `ipBlock` продължава да изключва частни, link-local и CGNAT диапазони.

## Cilium със замяна на kube-proxy

Базовата конфигурация не задава egress политика за бекенд pod-а. Ако добавите такава, обикновен `ipBlock` не може да разреши API сървъра: адресът на Service се пренаписва на порт `:6443` на възел преди прилагането на политиката и носи идентичността `kube-apiserver` на Cilium. Разрешете го с `CiliumNetworkPolicy`. Тя също така избира workeri, които също стартират sandbox pod-ове (вижте Разпределение на натоварването):

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

## Планиране (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` приема JSON с `nodeSelector`, `tolerations`, `runtimeClassName` (например gVisor), `imagePullSecrets` и `priorityClassName`. Други стойности не се приемат.

## Разпределение на натоварването

Worker-ите са допълнителни Deployments на същия образ с `HEYM_INSTANCE_ROLE=worker`, същите стойности на `SECRET_KEY` и `ENCRYPTION_KEY` и ServiceAccount `heym-backend`, така че да могат също да стартират sandbox pod-ове. Даден worker изпълнява възела Code, поради което се нуждае от заявка за обем в работната директория за зависимостите на възела Code: собствена заявка `ReadWriteOnce` е достатъчна, тъй като тези директории съществуват само по време на едно изпълнение. `overlays/orbstack-cluster` добавя един worker; `scripts/k8s-cluster-smoke.sh` проверява дали изпълненията на опашка попадат върху него и дали техните sandbox pod-ове принадлежат на този worker.

Стартирайте worker-ите директно с uvicorn, както е описано в `overlays/orbstack-cluster/worker.yaml`. Входната точка на изображението изпълнява миграции на базата данни, а те принадлежат на главната инстанция (main). Задайте на всеки worker уникален и стабилен `HEYM_INSTANCE_ID`; името на pod в StatefulSet работи отлично. Изпълненията на опашка за спрян worker се прехвърлят към друга инстанция от лидера.

## Локален тест в OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

За главна инстанция плюс worker приложете вместо това `overlays/orbstack-cluster` и изпълнете `./scripts/k8s-cluster-smoke.sh`.

## Свързани теми

- [Примерни манифести и README на изходния код](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Работа и внедряване](./running-and-deployment.md)
- [Разпределение на натоварването](../reference/cluster.md)
