# Heym na Kubernetesu

Namestite Heym na Kubernetes brez vtičnice Docker (Docker socket). Zaženite vsak sandbox kot svoj pod z navodili za shranjevanje, omrežje in workere.

Primeri manifestov za izvajanje Heyma brez vtičnice Docker. Vsak sandbox (orodja Python, skills, vozlišče Code, analiza datotek, Playwright, MCP stdio, Codex, OpenCode) deluje kot lasten pod prek Kubernetes API-ja.

## Zahteve

- Kubernetes 1.30 ali novejši (stdin sandboxa uporablja protokol pripenjanja `v5.channel.k8s.io`).
- CNI, ki uveljavlja NetworkPolicy. Heym to preveri pred prvim offline sandboxom in zavrne izvajanje offline sandboxov, če se poskusni pod še vedno lahko poveže.
- Nastavitev `podPidsLimit` v kubeletu. Podi nimajo polja za omejitev PID na ravni poda; zato je to edina zaščita pred fork-bombami poleg pomnilnika, procesorja in časovne omejitve. Heym tega ne more preveriti: `/sys/fs/cgroup/pids.max` vsebnika pripada njegovi lastni skupini cgroup, ne tisti od poda. Talos privzeto prihaja brez te omejitve.

## Namestitev

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) je chart skupnosti, ki ga vzdržuje Alexey Masolov in je objavljen na [Artifact Hubu](https://artifacthub.io/packages/helm/heym/heym), s prednastavitvami platform za OpenShift, EKS, AKS in GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Shramba (Storage)

`heym-data` hrani datoteke Drive, vtičnike in delovne prostore Codex/OpenCode. Podi sandboxa pripnejo en `subPath` tega nosilca na posamezen zagon. Z `ReadWriteMany` se lahko izvajajo na katerem koli vozlišču. Z `ReadWriteOnce` so vezani na vozlišče backend sistema. `ReadWriteOncePod` ni podprt.

## Prilagojeni paketi potrdil CA

Pripnite svoj paket CA v backend pod in nanj usmerite `SSL_CERT_FILE` (ali `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`). Heym prekopira datoteko v `codex-workspaces/_ca/` na nosilcu in pripne to kopijo samo za branje na isto pot v vsakem sandboxu, ki prejme spremenljivko. Z zahtevo `ReadWriteOnce` se ti sandboxi izvajajo na vozlišču backend sistema.

Potrdilo CA ne odpre omrežja. Egress promet sandboxa doseže le javne naslove; zato interno zrcalo paketov, proxy ali interni API potrebuje svoje pravilo, na primer:

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

## Namenski namespace za sandboxe

Nastavite `HEYM_SANDBOX_K8S_NAMESPACE` za zagon sandboxov v drugem namespaceu, označite ta namespace z oznako `pod-security.kubernetes.io/enforce: restricted`, premaknite Role tja in v Heymovem namespaceu obdržite Role, ki dodeljuje `get` nad `pods`. Sandboxi delovnih prostorov nato potrebujejo zahtevek z imenom `heym-data` v namespaceu sandboxa, vezan na isto skupno rabo RWX (drugi, statično dodeljen PersistentVolume).

## Credentials iz Kubernetes Secrets

Secret z oznako `heym.run/credential: "true"` postane credential samo za branje. Vrednosti ostanejo v pomnilniku vsakega procesa in nikoli ne dosežejo baze podatkov ali njenih varnostnih kopij; spreminjanje Secreta zamenja credential brez ponovnega zagona. Deluje vsako orodje, ki zapisuje Secret: External Secrets Operator, SealedSecrets, SOPS prek Fluxa ali Argo CD-ja, ali `kubectl`.

Dodajte komponento v svoj overlay. ServiceAccountu podeli pravice `get`, `list` in `watch` nad Secrets ter nastavi `HEYM_K8S_CREDENTIALS=true` na vsakem Deploymentu:

    components:
      - ../../components/kubernetes-credentials

RBAC za Secrets ni mogoče omejiti po oznaki; Heym lahko zato prebere vsak Secret v nadzorovanem namespaceu. Zaženite Heym v lastnem namespaceu ali nastavite `HEYM_K8S_CREDENTIALS_NAMESPACE` na namespace, ki vsebuje izključno credentiale Heym. Zagon se zavrne, če je katera koli od spremenljivk `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` ali `HEYM_MCP_STDIO_SANDBOX` nastavljena na `subprocess`, saj bi se uporabniška koda izvajala poleg žetona ServiceAccounta.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Ime credentiala, prikazano v Heymu
        heym.run/type: custom                   # Vrsta credentiala
        heym.run/owner: admin@example.com       # Obstoječi uporabnik
        heym.run/share-users: alice@example.com # Neobvezna e-poštna sporočila, ločena z vejico
        heym.run/share-teams: automation        # Neobvezna imena ekip, ločena z vejico
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Vsak podatkovni ključ predstavlja konfiguracijsko polje. Za vrsto z vgnezdenimi polji ali polji, ki niso nizi znakov, vnesite celotno konfiguracijo kot JSON pod en sam ključ `config.json`. Vrste, ki shranjujejo osvežene žetone OAuth (Codex, Google, BigQuery ter Linear ali Notion v načinu OAuth), ne morejo biti samo za branje in so zavrnjene.

Pri External Secrets Operatorju postavite oznako in opombe na ciljno predlogo:

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

Kaj pričakovati:

- **Pod je lahko v stanju Ready, preden je sinhroniziran.** Zagon ne čaka na API strežnik, zato uporabniški vmesnik ostaja na voljo. Dokler se proces ne sinhronizira, ne prevzema zagonov v čakalni vrsti; zagon, ki uporablja enega od teh credentialov, ne uspe z napako `not synced from Kubernetes yet` pred zagonom katerega koli vozlišča. Nastavitve → Kubernetes (skrbniški zavihek, ki se prikaže le, ko je vklopljen `HEYM_K8S_CREDENTIALS`) in Nastavitve → Instance prikazujeta stanje sinhronizacije; zato ne gradite preverjanja stanja (health check), ki predpostavlja, da Ready pomeni sinhronizirano.
- **Izbrisan Secret povzroči nedostopnost credentiala**, pri čemer ohrani svoj ID in deljenja; ponovno ustvarjanje Secreta (GitOps brisanje in ponovna uveljavitev) ga obnovi za vsak workflow. Vrstice se nikoli ne odstranijo samodejno; skrbnik jih odstrani v Nastavitve → Kubernetes.
- **Za lastnika, ki se še ni prijavil**, se poskus ponovi vsakih pet minut.
- **Uporabniški credential z enakim imenom in lastnikom** se nikoli ne prepiše; Secret se namesto tega prijavi kot spor.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes oceni pravilo egress po tem, ko se storitev DNS Service prevede v DNS pod, in OpenShiftovi DNS podi poslušajo na vratih 5353, ne 53. Z osnovnim pravilom omrežni sandboxi dosežejo internet prek IP naslova, vendar vsako iskanje imena poteče. Overlay spreminja zgolj to pravilo:

- Dovoljuje UDP in TCP na vratih 5353 (vrata DNS podov), ne 53 storitve Service.
- Izbere DNS namespace prek `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` ni nastavljen na vsakem gruči.
- Javno pravilo `ipBlock` še naprej izključuje zasebne, link-local in CGNAT obsege.

## Cilium z zamenjavo kube-proxyja

Osnovna konfiguracija ne dodeli pravila egress backend podu. Če ga dodate, običajen `ipBlock` ne more omogočiti API strežnika: naslov storitve se prepiše na vrata `:6443` vozlišča pred uveljavitvijo pravila, ta naslov pa nosi identiteto `kube-apiserver` Ciliuma. Omogočite ga s `CiliumNetworkPolicy`. Ta izbere tudi workere, ki prav tako zaganjajo sandbox pode (glejte Porazdelitev obremenitve):

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

## Razporejanje (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` sprejema JSON s polji `nodeSelector`, `tolerations`, `runtimeClassName` (na primer gVisor), `imagePullSecrets` in `priorityClassName`. Nobena druga polja niso sprejeta.

## Porazdelitev obremenitve

Workeri so dodatni Deployments iste slike s `HEYM_INSTANCE_ROLE=worker`, enakimi vrednostmi `SECRET_KEY` in `ENCRYPTION_KEY`, ter računom `heym-backend` ServiceAccount, tako da lahko tudi oni zaganjajo sandbox pode. Worker izvaja vozlišče Code, zato potrebuje nosilec v delovnem imeniku za odvisnosti vozlišča Code: zadošča lasten zahtevek `ReadWriteOnce`, saj ti imeniki obstajajo le med enim zagonom. `overlays/orbstack-cluster` doda enega workerja; `scripts/k8s-cluster-smoke.sh` preveri, ali zagoni v čakalni vrsti prispejo nanj in ali njihovi sandbox podi pripadajo temu workerju.

Zaženite workere neposredno z uvicornom, kot to počne `overlays/orbstack-cluster/worker.yaml`. Vstopna točka slike izvaja migracije baze podatkov, te pa pripadajo glavni instanci (main). Vsakemu workerju dodelite edinstven in stabilen `HEYM_INSTANCE_ID`; ime poda v StatefulSetu deluje odlično. Zagone v čakalni vrsti za ustavljenega workerja vodja (leader) premakne na drugo instanco.

## Lokalni preizkus na OrbStacku

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Za glavno instanco in enega workerja uporabite raje `overlays/orbstack-cluster` in zaženite `./scripts/k8s-cluster-smoke.sh`.

## Povezane vsebine

- [Primeri manifestov in README izvorne kode](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Delovanje in namestitev](./running-and-deployment.md)
- [Porazdelitev obremenitve](../reference/cluster.md)
