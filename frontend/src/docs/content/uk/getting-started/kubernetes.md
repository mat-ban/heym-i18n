# Heym у Kubernetes

Розгортайте Heym у Kubernetes без сокета Docker (Docker socket). Запускайте кожен sandbox як окремий pod з інструкціями щодо сховища, мережі та worker-ів.

Приклади маніфестів для запуску Heym без сокета Docker. Кожен sandbox (інструменти Python, skills, вузол Code, аналіз файлів, Playwright, MCP stdio, Codex, OpenCode) працює як власний pod через Kubernetes API.

## Вимоги

- Kubernetes 1.30 або новішої версії (stdin пісочниці використовує протокол приєднання `v5.channel.k8s.io`).
- CNI з підтримкою NetworkPolicy. Heym перевіряє це перед першим офлайн-sandbox і відмовляється запускати офлайн-sandbox, якщо тестовий pod все ще може встановлювати з'єднання.
- Параметр `podPidsLimit` у kubelet. Pod-и не мають поля обмеження PID на рівні окремого pod-а; тому це єдиний захист від fork-бомб, крім оперативної пам'яті, процесора та ліміту часу. Heym не може це перевірити: `/sys/fs/cgroup/pids.max` контейнера належить його власній групі cgroup, а не групі pod-а. Talos за замовчуванням постачається без цього обмеження.

## Встановлення

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) — це chart спільноти, який підтримується Олексієм Масоловим і опублікований на [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), із попередніми налаштуваннями платформ для OpenShift, EKS, AKS і GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Сховище (Storage)

`heym-data` зберігає файли Drive, плагіни та робочі простори Codex/OpenCode. Pod-и sandbox монтують один `subPath` цього тому на кожне виконання. З `ReadWriteMany` вони можуть працювати на будь-якому вузлі. З `ReadWriteOnce` вони прив'язані до вузла бекенда. `ReadWriteOncePod` не підтримується.

## Власні пакети сертифікатів CA

Змонтуйте ваш пакет CA у pod бекенда та спрямуйте `SSL_CERT_FILE` (або `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) на нього. Heym скопіює файл до `codex-workspaces/_ca/` у заявці на том і змонтує цю копію в режимі лише для читання за тим самим шляхом у кожному sandbox, який отримує змінну. За наявності заявки `ReadWriteOnce` ці sandbox запускатимуться на вузлі бекенда.

Сертифікат CA не відкриває доступ до мережі. Трафік egress пісочниці досягає лише публічних адрес; тому внутрішнє дзеркало пакетів, проксі або внутрішній API потребує власного правила, наприклад:

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

## Виділений namespace для sandbox

Встановіть `HEYM_SANDBOX_K8S_NAMESPACE` для запуску sandbox в іншому namespace, позначте цей namespace міткою `pod-security.kubernetes.io/enforce: restricted`, перемістіть туди Role та збережіть у namespace Heym Role, що надає `get` для `pods`. Sandbox робочих просторів потім потребують заявки з назвою `heym-data` у namespace sandbox, прив'язаної до того самого спільного ресурсу RWX (другий, статично виділений PersistentVolume).

## Credentials з Kubernetes Secrets

Secret із міткою `heym.run/credential: "true"` стає credential лише для читання. Значення залишаються в пам'яті кожного процесу та ніколи не потрапляють до бази даних або її резервних копій; зміна Secret ротує credential без перезавантаження. Працює будь-який інструмент, що записує Secret: External Secrets Operator, SealedSecrets, SOPS через Flux або Argo CD чи `kubectl`.

Додайте компонент до вашого overlay. Він надає ServiceAccount права `get`, `list` і `watch` для Secrets і встановлює `HEYM_K8S_CREDENTIALS=true` на кожному Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC для Secrets не можна обмежити за міткою; тому Heym може читати будь-який Secret у контрольованому namespace. Запускайте Heym у власному namespace або встановіть `HEYM_K8S_CREDENTIALS_NAMESPACE` для namespace, що містить виключно credentials Heym. Запуск блокується, якщо будь-яка зі змінних `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` або `HEYM_MCP_STDIO_SANDBOX` має значення `subprocess`, оскільки код користувача виконувався б поруч із токеном ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Назва credential, що відображається в Heym
        heym.run/type: custom                   # Тип credential
        heym.run/owner: admin@example.com       # Наявний користувач
        heym.run/share-users: alice@example.com # Необов'язкові адреси електронної пошти через кому
        heym.run/share-teams: automation        # Необов'язкові назви команд через кому
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Кожен ключ даних відповідає полю конфігурації. Для типу із вкладеними полями або полями, відмінними від рядків, розмістіть усю конфігурацію як JSON під одним ключем `config.json`. Типи, які зберігають оновлені токени OAuth (Codex, Google, BigQuery та Linear або Notion у режимі OAuth), не можуть бути лише для читання і відхиляються.

З External Secrets Operator розмістіть мітку та анотації в цільовому шаблоні:

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

Чого очікувати:

- **Pod може перебувати в стані Ready до завершення синхронізації.** Запуск не очікує на сервер API, тому інтерфейс користувача залишається доступним. Доки процес не синхронізовано, він не обробляє запуски з черги; запуск, який використовує один із цих credentials, зазнає помилки `not synced from Kubernetes yet` перед виконанням будь-якого вузла. Налаштування → Kubernetes (вкладка адміністратора, що з'являється лише за увімкненого `HEYM_K8S_CREDENTIALS`) і Налаштування → Екземпляри відображають стан синхронізації; тому не створюйте перевірку працездатності (health check), яка передбачає, що Ready означає завершення синхронізації.
- **Видалений Secret робить credential недоступним**, зберігаючи його ідентифікатор і спільний доступ; повторне створення Secret (очищення GitOps і повторне застосування) відновлює його для кожного workflow. Рядки ніколи не видаляються автоматично; адміністратор видаляє їх у розділі Налаштування → Kubernetes.
- **Для власника, який ще не ввійшов у систему**, спроба повторюється кожні п'ять хвилин.
- **Credential користувача з такою самою назвою та власником** ніколи не перезаписується; замість цього Secret фіксується як конфлікт.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes оцінює політику egress після того, як служба DNS Service транслюється в pod DNS, а pod-и DNS OpenShift прослуховують порт 5353, а не 53. За базової політики мережеві sandbox досягають інтернету за IP-адресою, але будь-який запит на розпізнавання імен завершується перевищенням часу очікування (timeout). Overlay змінює лише це правило:

- Дозволяє UDP і TCP на порту 5353 (порт pod-ів DNS), а не 53 служби Service.
- Вибирає DNS namespace за допомогою `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` налаштовано не на кожному кластері.
- Публічне правило `ipBlock` продовжує виключати приватні, link-local і CGNAT діапазони.

## Cilium із заміною kube-proxy

Базова конфігурація не призначає політику egress для pod-а бекенда. Якщо ви додасте її, звичайний `ipBlock` не зможе надати доступ до сервера API: адреса Service переписується на порт `:6443` вузла перед застосуванням політики, і ця адреса містить ідентифікатор `kube-apiserver` Cilium. Дозвольте її за допомогою `CiliumNetworkPolicy`. Вона також вибирає worker-ів, які також запускають pod-и sandbox (див. Розподіл навантаження):

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

## Планування (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` приймає JSON з полями `nodeSelector`, `tolerations`, `runtimeClassName` (наприклад gVisor), `imagePullSecrets` і `priorityClassName`. Жодні інші поля не приймаються.

## Розподіл навантаження

Worker-и — це додаткові Deployments того самого образу з `HEYM_INSTANCE_ROLE=worker`, тими самими значеннями `SECRET_KEY` та `ENCRYPTION_KEY`, а також ServiceAccount `heym-backend`, що дозволяє їм також запускати pod-и sandbox. Worker виконує вузол Code, тому йому потрібна заявка на том у робочій директорії для залежностей вузла Code: власної заявки `ReadWriteOnce` достатньо, оскільки ці директорії існують лише протягом одного виконання. `overlays/orbstack-cluster` додає одного worker-а; `scripts/k8s-cluster-smoke.sh` перевіряє, чи надходять запуски з черги на нього та чи належать їхні pod-и sandbox цьому worker-у.

Запускайте worker-ів безпосередньо за допомогою uvicorn, як це реалізовано в `overlays/orbstack-cluster/worker.yaml`. Точка входу образу запускає міграції бази даних, а вони належать головному екземпляру (main). Призначте кожному worker-у унікальний стабільний `HEYM_INSTANCE_ID`; назва pod-а у StatefulSet підходить ідеально. Запуски в черзі для зупиненого worker-а переносяться на інший екземпляр лідером.

## Локальне тестування в OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Для main з одним worker-ом застосуйте натомість `overlays/orbstack-cluster` і виконайте `./scripts/k8s-cluster-smoke.sh`.

## Пов'язані теми

- [Приклади маніфестів і README вихідного коду](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Експлуатація та розгортання](./running-and-deployment.md)
- [Розподіл навантаження](../reference/cluster.md)
