# Heym na Kubernetes

Nasaďte Heym na Kubernetes bez socketu Docker. Prevádzkujte každý sandbox ako samostatný pod s návodmi pre úložisko, sieť a workery.

Príklady manifestov pre prevádzkovanie Heym bez socketu Docker. Každý sandbox (nástroje Python, skills, uzol Code, analýza súborov, Playwright, MCP stdio, Codex, OpenCode) beží ako samostatný pod prostredníctvom Kubernetes API.

## Požiadavky

- Kubernetes 1.30 alebo novší (stdin sandboxu používa protokol pripojenia `v5.channel.k8s.io`).
- CNI presadzujúce NetworkPolicy. Heym toto overuje pred spustením prvého offline sandboxu a odmieta spustenie offline sandboxov, ak testovací pod môže stále nadväzovať pripojenie.
- Hodnota `podPidsLimit` v kubelete. Pody nemajú pole limitu PID na úrovni jednotlivých podov; ide teda o jedinú ochranu proti fork-bombám popri pamäti, CPU a časovom limite. Heym to nemôže overiť: hodnota `/sys/fs/cgroup/pids.max` kontajnera patrí jeho vlastnej cgroup, nie cgroup podu. Talos sa v predvolenom nastavení dodáva bez tohto limitu.

## Inštalácia

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) je komunitný chart spravovaný Alexejom Masolovom a publikovaný na [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), s predvoľbami platforiem pre OpenShift, EKS, AKS a GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Úložisko (Storage)

`heym-data` uchováva súbory Drive, pluginy a pracovné priestory Codex/OpenCode. Pody sandboxu pripájajú jeden `subPath` tohto zväzku pre každé spustenie. S `ReadWriteMany` môžu bežať na ľubovoľnom uzle. S `ReadWriteOnce` sú viazané na uzol backendu. `ReadWriteOncePod` nie je podporovaný.

## Vlastné balíky certifikačných autorít (CA)

Pripojte svoj balík CA do podu backendu a nasmerujte naň `SSL_CERT_FILE` (alebo `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`). Heym skopíruje súbor do `codex-workspaces/_ca/` na zväzku a pripojí túto kópiu v režime iba na čítanie na rovnakej ceste v každom sandboxe, ktorý premennú prijme. S požiadavkou `ReadWriteOnce` tieto sandboxy bežia na uzle backendu.

Certifikačná autorita neotvára sieť. Egress prevádzka sandboxu smeruje výhradne na verejné adresy; interné zrkadlo balíkov, proxy alebo interné API preto vyžaduje vlastné pravidlo, napríklad:

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

## Vyhradený namespace pre sandboxy

Nastavte `HEYM_SANDBOX_K8S_NAMESPACE` pre beh sandboxov v inom namespace, označte tento namespace štítkom `pod-security.kubernetes.io/enforce: restricted`, presuňte tam Role a ponechajte v namespace Heym Role udeľujúcu oprávnenie `get` pre `pods`. Sandboxy pracovných priestorov potom vyžadujú požiadavku s názvom `heym-data` v namespace sandboxu naviazanú na rovnaké zdieľanie RWX (druhý, staticky zriadený PersistentVolume).

## Credentials z Kubernetes Secrets

Secret označený štítkom `heym.run/credential: "true"` sa stane credentialom iba na čítanie. Hodnoty zostávajú v pamäti každého procesu a nikdy sa nedostanú do databázy ani jej záloh; zmena Secretu vykoná rotáciu credentialu bez reštartu. Funguje akýkoľvek nástroj zapisujúci Secret: External Secrets Operator, SealedSecrets, SOPS cez Flux alebo Argo CD, prípadne `kubectl`.

Pridajte komponent do svojho overlayu. Udeľuje ServiceAccount oprávnenia `get`, `list` a `watch` pre Secrets a nastavuje `HEYM_K8S_CREDENTIALS=true` na každom Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC pre objekty Secret nemožno zúžiť podľa štítka; Heym preto môže čítať každý Secret v monitorovanom namespace. Prevádzkujte Heym vo vlastnom namespace alebo nastavte `HEYM_K8S_CREDENTIALS_NAMESPACE` na namespace obsahujúci výhradne credentials Heym. Spustenie bude odmietnuté, ak je niektorá z premenných `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` alebo `HEYM_MCP_STDIO_SANDBOX` nastavená na `subprocess`, pretože používateľský kód by sa spúšťal vedľa tokenu ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Názov credentialu zobrazený v Heym
        heym.run/type: custom                   # Typ credentialu
        heym.run/owner: admin@example.com       # Existujúci používateľ
        heym.run/share-users: alice@example.com # Voliteľné e-maily oddelené čiarkami
        heym.run/share-teams: automation        # Voliteľné názvy tímov oddelené čiarkami
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Každý dátový kľúč predstavuje konfiguračné pole. Pre typ s vnorenými poľami alebo nereťazcovými poľami vložte celú konfiguráciu ako JSON pod jediný kľúč `config.json`. Typy, ktoré ukladajú obnovované tokeny OAuth (Codex, Google, BigQuery a Linear alebo Notion v režime OAuth), nemôžu byť iba na čítanie a sú odmietnuté.

Pri External Secrets Operator vložte štítok a anotácie do cieľovej šablóny:

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

Čo očakávať:

- **Pod môže byť v stave Ready pred dokončením synchronizácie.** Spustenie nečaká na API server, takže používateľské rozhranie zostáva dostupné. Kým sa proces nesynchronizuje, neprijíma behy z frontu; beh využívajúci niektorý z týchto credentials zlyhá s chybou `not synced from Kubernetes yet` pred spustením akéhokoľvek uzla. Nastavenia → Kubernetes (karta správcu viditeľná iba pri zapnutom `HEYM_K8S_CREDENTIALS`) a Nastavenia → Inštancie zobrazujú stav synchronizácie; nevytvárajte preto kontrolu stavu (health check), ktorá predpokladá, že Ready znamená synchronizované.
- **Zmazaný Secret spôsobí nedostupnosť credentialu**, pričom zachová jeho ID a zdieľania; opätovné vytvorenie Secretu (vyčistenie a opätovná aplikácia cez GitOps) ho obnoví pre každý workflow. Riadky sa nikdy neodstraňujú automaticky; správca ich odstraňuje v Nastavenia → Kubernetes.
- **V prípade vlastníka, ktorý sa doteraz neprihlásil**, sa pokus opakuje každých päť minút.
- **Používateľský credential s rovnakým názvom a vlastníkom** nie je nikdy prepísaný; Secret je namiesto toho nahlásený ako konflikt.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes vyhodnocuje pravidlá egress po preložení služby DNS Service na pod DNS, a pody DNS v OpenShift počúvajú na porte 5353, nie 53. So základným pravidlom sieťové sandboxy dosiahnu na internet prostredníctvom IP adresy, ale každé vyhľadávanie názvu vyprší. Overlay upravuje výhradne toto pravidlo:

- Povoľuje UDP a TCP na porte 5353 (port podov DNS), nie 53 služby Service.
- Vyberá namespace DNS pomocou `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` nie je nastavené na každom clustri.
- Verejné pravidlo `ipBlock` naďalej vylučuje privátne, link-local a CGNAT rozsahy.

## Cilium s náhradou kube-proxy

Základná konfigurácia neprideľuje podu backendu žiadne pravidlo egress. Ak ho pridáte, bežný `ipBlock` nemôže povoliť API server: adresa Service je pred uplatnením pravidla prepísaná na port `:6443` uzla a nesie identitu `kube-apiserver` Cilium. Povoľte ho pomocou `CiliumNetworkPolicy`. Tá vyberá aj workerov, ktorí takisto spúšťajú pody sandboxov (pozri Rozloženie záťaže):

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

## Plánovanie (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` prijíma formát JSON s poľami `nodeSelector`, `tolerations`, `runtimeClassName` (napríklad gVisor), `imagePullSecrets` a `priorityClassName`. Žiadne iné polia nie sú akceptované.

## Rozloženie záťaže

Workery predstavujú ďalšie Deployments rovnakého obrazu s premennou `HEYM_INSTANCE_ROLE=worker`, rovnakými hodnotami `SECRET_KEY` a `ENCRYPTION_KEY` a účtom `heym-backend` ServiceAccount, takže môžu rovnako spúšťať pody sandboxov. Worker vykonáva uzol Code, takže potrebuje zväzok v pracovnom adresári pre závislosti uzla Code: postačuje vlastná požiadavka `ReadWriteOnce`, pretože tieto adresáre existujú iba počas jedného behu. `overlays/orbstack-cluster` pridáva jedného workera; skript `scripts/k8s-cluster-smoke.sh` overuje, či behy z frontu smerujú naňho a či ich pody sandboxov patria tomuto workeru.

Spúšťajte workerov priamo pomocou uvicorn, ako je definované v `overlays/orbstack-cluster/worker.yaml`. Vstupný bod obrazu spúšťa migrácie databázy, a tie patria hlavnej inštancii (main). Prideľte každému workerovi jedinečný a stabilný `HEYM_INSTANCE_ID`; názov podu v StatefulSet funguje spoľahlivo. Behy vo fronte pre zastavený worker sú vedúcou inštanciou (leader) presunuté na inú inštanciu.

## Miestny test na OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Pre inštanciu main a jedného workera použite namiesto toho `overlays/orbstack-cluster` a spustite `./scripts/k8s-cluster-smoke.sh`.

## Súvisiace témy

- [Príklady manifestov a zdrojové README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Prevádzka a nasadenie](./running-and-deployment.md)
- [Rozloženie záťaže](../reference/cluster.md)
