# Heym na Kubernetes

Nasaďte Heym na Kubernetes bez socketu Docker. Provozujte každý sandbox jako samostatný pod, včetně průvodců pro úložiště, sítě a workery.

Příklady manifestů pro provozování Heym bez socketu Docker. Každý sandbox (nástroje Python, skills, uzel Code, analýza souborů, Playwright, MCP stdio, Codex, OpenCode) běží jako samostatný pod prostřednictvím Kubernetes API.

## Požadavky

- Kubernetes 1.30 nebo novější (stdin sandboxu používá připojovací protokol `v5.channel.k8s.io`).
- CNI vynucující NetworkPolicy. Heym toto ověřuje před spuštěním prvního offline sandboxu a odmítá spuštění offline sandboxů, pokud testovací pod může stále navazovat připojení.
- Hodnota `podPidsLimit` v kubeletu. Pody nemají pole limitu PID na úrovni jednotlivých podů; jedná se tedy o jedinou ochranu proti fork-bombám vedle paměti, CPU a časového limitu. Heym to nemůže ověřit: hodnota `/sys/fs/cgroup/pids.max` kontejneru náleží jeho vlastní cgroup, nikoli cgroup podu. Talos se ve výchozím nastavení dodává bez tohoto limitu.

## Instalace

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) je komunitní chart spravovaný Alexejem Masolovem a publikovaný na [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), s předvolbami platforem pro OpenShift, EKS, AKS a GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Úložiště (Storage)

`heym-data` uchovává soubory Drive, pluginy a pracovní prostory Codex/OpenCode. Pody sandboxu připojují jeden `subPath` tohoto svazku pro každé spuštění. S `ReadWriteMany` mohou běžet na libovolném uzlu. S `ReadWriteOnce` jsou vázány na uzel backendu. `ReadWriteOncePod` není podporován.

## Vlastní balíčky certifikačních autorit (CA)

Připojte svůj balíček CA do podu backendu a nasměrujte na něj `SSL_CERT_FILE` (nebo `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`). Heym zkopíruje soubor do `codex-workspaces/_ca/` na svazku a připojí tuto kopii pouze pro čtení na stejné cestě v každém sandboxu, který proměnnou obdrží. S požadavkem `ReadWriteOnce` tyto sandboxy běží na uzlu backendu.

Certifikační autorita neotevírá síť. Egress provoz sandboxu směřuje výhradně na veřejné adresy; interní zrcadlo balíčků, proxy nebo interní API proto vyžaduje vlastní pravidlo, například:

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

## Vyhrazený namespace pro sandboxy

Nastavte `HEYM_SANDBOX_K8S_NAMESPACE` pro běh sandboxů v jiném namespace, označte tento namespace štítkem `pod-security.kubernetes.io/enforce: restricted`, přesuňte tam Role a ponechte v namespace Heym Role udělující oprávnění `get` pro `pods`. Sandboxy pracovních prostorů pak vyžadují požadavek s názvem `heym-data` v namespace sandboxu navázaný na stejné sdílení RWX (druhý, staticky zřízený PersistentVolume).

## Credentials z Kubernetes Secrets

Secret označený štítkem `heym.run/credential: "true"` se stane credentialem pouze pro čtení. Hodnoty zůstávají v paměti každého procesu a nikdy se nedostanou do databáze ani jejích záloh; změna Secretu provede rotaci credentialu bez restartu. Funguje jakýkoli nástroj zapisující Secret: External Secrets Operator, SealedSecrets, SOPS přes Flux nebo Argo CD, případně `kubectl`.

Přidejte komponentu do svého overlaye. Uděluje ServiceAccount oprávnění `get`, `list` a `watch` pro Secrets a nastavuje `HEYM_K8S_CREDENTIALS=true` na každém Deploymentu:

    components:
      - ../../components/kubernetes-credentials

RBAC pro objekty Secret nelze zúžit podle štítku; Heym proto může číst každý Secret ve sledovaném namespace. Provozujte Heym ve vlastním namespace nebo nastavte `HEYM_K8S_CREDENTIALS_NAMESPACE` na namespace obsahující výhradně credentials Heym. Spuštění bude odmítnuto, pokud je některá z proměnných `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` nebo `HEYM_MCP_STDIO_SANDBOX` nastavena na `subprocess`, protože uživatelský kód by se spouštěl vedle tokenu ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Název credentialu zobrazený v Heym
        heym.run/type: custom                   # Typ credentialu
        heym.run/owner: admin@example.com       # Existující uživatel
        heym.run/share-users: alice@example.com # Volitelné e-maily oddělené čárkami
        heym.run/share-teams: automation        # Volitelné názvy týmů oddělené čárkami
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Každý datový klíč představuje konfigurační pole. Pro typ se vnořenými poli nebo neřetězcovými poli vložte celou konfiguraci jako JSON pod jediný klíč `config.json`. Typy, které ukládají obnovované tokeny OAuth (Codex, Google, BigQuery a Linear nebo Notion v režimu OAuth), nemohou být pouze pro čtení a jsou odmítnuty.

U External Secrets Operator vložte štítek a anotace do cílové šablony:

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

Co očekávat:

- **Pod může být ve stavu Ready před dokončením synchronizace.** Spuštění nečeká na API server, takže uživatelské rozhraní zůstává dostupné. Dokud se proces nesynchronizuje, nepřijímá běhy z fronty; běh využívající některý z těchto credentials selže s chybou `not synced from Kubernetes yet` před spuštěním jakéhokoli uzlu. Nastavení → Kubernetes (karta správce viditelná pouze při zapnutém `HEYM_K8S_CREDENTIALS`) a Nastavení → Instance zobrazují stav synchronizace; nevytvářejte proto kontrolu stavu (health check), která předpokládá, že Ready znamená synchronizováno.
- **Smazaný Secret způsobí nedostupnost credentialu**, přičemž zachová jeho ID a sdílení; opětovné vytvoření Secretu (pročištění a opětovná aplikace přes GitOps) jej obnoví pro každý workflow. Řádky se nikdy neodstraňují automaticky; správce je odstraňuje v Nastavení → Kubernetes.
- **V případě vlastníka, který se dosud nepřihlásil**, se pokus opakuje každých pět minut.
- **Uživatelský credential se stejným názvem a vlastníkem** není nikdy přepsán; Secret je místo toho nahlášen jako konflikt.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes vyhodnocuje pravidla egress poté, co je služba DNS Service přeložena na pod DNS, a pody DNS v OpenShift naslouchají na portu 5353, nikoli 53. Se základním pravidlem síťové sandboxy dosáhnou na internet prostřednictvím IP adresy, ale každé vyhledávání názvu vyprší. Overlay upravuje pouze toto pravidlo:

- Povoluje UDP a TCP na portu 5353 (port podů DNS), nikoli 53 služby Service.
- Vybírá namespace DNS pomocí `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` není nastaveno na každém clusteru.
- Veřejné pravidlo `ipBlock` nadále vylučuje privátní, link-local a CGNAT rozsahy.

## Cilium s náhradou kube-proxy

Základní konfigurace nepřiděluje podu backendu žádné pravidlo egress. Pokud jej přidáte, běžný `ipBlock` nemůže povolit API server: adresa Service je před uplatněním pravidla přepsána na port `:6443` uzlu a nese identitu `kube-apiserver` Cilium. Povolte jej pomocí `CiliumNetworkPolicy`. Ta vybírá také workery, které rovněž spouštějí pody sandboxů (viz Rozložení zátěže):

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

## Plánování (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` přijímá formát JSON s poli `nodeSelector`, `tolerations`, `runtimeClassName` (například gVisor), `imagePullSecrets` a `priorityClassName`. Žádné jiné hodnoty nejsou akceptovány.

## Rozložení zátěže

Workery představují další Deployments stejného obrazu s proměnnou `HEYM_INSTANCE_ROLE=worker`, stejnými hodnotami `SECRET_KEY` a `ENCRYPTION_KEY` a účtem `heym-backend` ServiceAccount, takže mohou rovněž spouštět pody sandboxů. Worker spouští uzel Code, takže potřebuje svazek v adresáři pracovního prostoru pro závislosti uzlu Code: postačuje vlastní požadavek `ReadWriteOnce`, protože tyto adresáře existují pouze po dobu jednoho běhu. `overlays/orbstack-cluster` přidává jednoho workera; skript `scripts/k8s-cluster-smoke.sh` ověřuje, zda běhy z fronty směřují na něj a zda jejich pody sandboxů patří tomuto workeru.

Spouštějte workery přímo pomocí uvicorn, jak je definováno v `overlays/orbstack-cluster/worker.yaml`. Vstupní bod obrazu spouští migrace databáze, a ty náleží instanci main. Přidělte každému workeru jedinečné a stabilní `HEYM_INSTANCE_ID`; název podu ve StatefulSet funguje spolehlivě. Běhy ve frontě pro zastavený worker jsou vedoucí instancí (leader) přesunuty na jinou instanci.

## Místní test na OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Pro instanci main a jednoho workera použijte místo toho `overlays/orbstack-cluster` a spusťte `./scripts/k8s-cluster-smoke.sh`.

## Související témata

- [Příklady manifestů a zdrojové README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Provoz a nasazení](./running-and-deployment.md)
- [Rozložení zátěže](../reference/cluster.md)
