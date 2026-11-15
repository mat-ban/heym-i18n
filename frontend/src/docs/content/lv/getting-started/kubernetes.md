# Heym operētājsistēmā Kubernetes

Izvietojiet Heym sistēmā Kubernetes bez Docker ligzdas (Docker socket). Palaidiet katru sandbox kā atsevišķu pod ar ceļvežiem krātuvei, tīklam un worker procesiem.

Parauga manifesti Heym darbināšanai bez Docker ligzdas. Katrs sandbox (Python rīki, skills, Code mezgls, failu analīze, Playwright, MCP stdio, Codex, OpenCode) darbojas kā atsevišķs pod, izmantojot Kubernetes API.

## Prasības

- Kubernetes 1.30 vai jaunāka versija (sandbox stdin izmanto pievienošanas protokolu `v5.channel.k8s.io`).
- CNI, kas nodrošina NetworkPolicy izpildi. Heym to pārbauda pirms pirmā bezsaistes sandbox un atsakās palaist bezsaistes sandboxus, ja testa pod joprojām var izveidot savienojumu.
- Kubelet `podPidsLimit`. Podiem nav atsevišķa PID limita lauka; tāpēc šī ir vienīgā aizsardzība pret fork-bumbām līdzās atmiņai, procesoram un izpildes termiņam. Heym to nevar pārbaudīt: konteinera `/sys/fs/cgroup/pids.max` pieder tā paša cgroup, nevis poda grupai. Talos pēc noklusējuma tiek piegādāts bez šī ierobežojuma.

## Uzstādīšana

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) ir kopienas chart, ko uztur Aleksejs Masolovs un kas publicēts [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), ar platformas priekšiestatījumiem OpenShift, EKS, AKS un GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Krātuve (Storage)

`heym-data` glabā Drive failus, spraudņus un Codex/OpenCode darba vietas. Sandbox podi katrā izpildes reizē piemontē vienu šī sējuma `subPath`. Izmantojot `ReadWriteMany`, tie var darboties jebkurā mezglā. Izmantojot `ReadWriteOnce`, tie ir piesaistīti backend mezglam. `ReadWriteOncePod` netiek atbalstīts.

## Pielāgotas CA sertifikātu pakotnes

Piemontējiet savu CA pakotni backend podā un norādiet uz to ar `SSL_CERT_FILE` (vai `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`). Heym nokopēs failu uz `codex-workspaces/_ca/` sējuma pieprasījumā un piemontēs šo kopiju tikai lasīšanas režīmā tajā pašā ceļā katrā sandboxā, kas saņem mainīgo. Izmantojot `ReadWriteOnce` pieprasījumu, šie sandboxi darbosies backend mezglā.

Sertifikācijas iestāde (CA) neatver tīklu. Sandbox egress satiksme sasniedz tikai publiskas adreses; tāpēc iekšējam pakotņu spogulim, starpniekserverim vai iekšējam API ir nepieciešams savs noteikums, piemēram:

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

## Īpaša vārdtelpa (namespace) sandboxiem

Iestatiet `HEYM_SANDBOX_K8S_NAMESPACE`, lai palaistu sandboxus citur, atzīmējiet šo vārdtelpu ar etiķeti `pod-security.kubernetes.io/enforce: restricted`, pārvietojiet Role uz turieni un Heym vārdtelpā saglabājiet Role, kas piešķir `get` tiesības pār `pods`. Darba vietas sandboxiem pēc tam būs nepieciešams pieprasījums ar nosaukumu `heym-data` sandbox vārdtelpā, kas piesaistīts tai pašai RWX koplietošanai (otrs, statiski nodrošināts PersistentVolume).

## Credentials no Kubernetes Secrets

Secret ar etiķeti `heym.run/credential: "true"` kļūst par tikai lasāmu credential. Vērtības paliek katra procesa atmiņā un nekad nenonāk datubāzē vai tās dublējumos; Secret maiņa rotē credential bez restartēšanas. Jebkurš rīks, kas ieraksta Secret, darbojas: External Secrets Operator, SealedSecrets, SOPS, izmantojot Flux vai Argo CD, vai `kubectl`.

Pievienojiet komponentu savam overlay. Tas piešķir ServiceAccount `get`, `list` un `watch` tiesības pār Secrets un iestata `HEYM_K8S_CREDENTIALS=true` katrā Deployment:

    components:
      - ../../components/kubernetes-credentials

Secrets RBAC nevar sašaurināt pēc etiķetes; tāpēc Heym var nolasīt jebkuru Secret pārraudzītajā vārdtelpā. Palaidiet Heym savā vārdtelpā vai iestatiet `HEYM_K8S_CREDENTIALS_NAMESPACE` uz vārdtelpu, kurā ir tikai Heym credentiali. Palaišana tiek noraidīta, ja kāds no mainīgajiem `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` vai `HEYM_MCP_STDIO_SANDBOX` ir iestatīts uz `subprocess`, jo lietotāja kods tiktu palaists blakus ServiceAccount marķierim.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heym redzamais credential nosaukums
        heym.run/type: custom                   # Credential tips
        heym.run/owner: admin@example.com       # Esošs lietotājs
        heym.run/share-users: alice@example.com # Neobligāti, ar komatu atdalīti e-pasti
        heym.run/share-teams: automation        # Neobligāti, ar komatu atdalīti komandu nosaukumi
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Katra datu atslēga atbilst konfigurācijas laukam. Tipam ar ligzdotiem laukiem vai laukiem, kas nav virknes, ievietojiet visu konfigurāciju kā JSON zem vienas `config.json` atslēgas. Tipus, kuros tiek glabāti atjaunināti OAuth marķieri (Codex, Google, BigQuery un Linear vai Notion OAuth režīmā), nevar padarīt tikai lasāmus, un tie tiek noraidīti.

Izmantojot External Secrets Operator, ievietojiet etiķeti un anotācijas mērķa veidnē:

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

Ko sagaidīt:

- **Pod var būt Ready stāvoklī pirms sinhronizācijas.** Palaišana negaida API serveri, tāpēc lietotāja saskarne paliek pieejama bez tā. Kamēr process nav sinhronizēts, tas nepieņem rindā esošos izpildes uzdevumus; izpilde, kurā tiek izmantots kāds no šiem credentialiem, neizdodas ar kļūdu `not synced from Kubernetes yet` pirms jebkura mezgla palaišanas. Iestatījumi → Kubernetes (administratora cilne, kas parādās tikai tad, ja ir ieslēgts `HEYM_K8S_CREDENTIALS`) un Iestatījumi → Instances parāda sinhronizācijas stāvokli; tāpēc neveidojiet darbspējas pārbaudi (health check), pieņemot, ka Ready nozīmē sinhronizēts.
- **Dzēsts Secret padara tā credential nepieejamu**, saglabājot tā ID un koplietojumus; atkārtota Secret izveide (GitOps attīrīšana un atkārtota piemērošana) atjauno to katram workflow. Rindas nekad netiek noņemtas automātiski; administrators tās noņem sadaļā Iestatījumi → Kubernetes.
- **Īpašniekam, kurš vēl nav pieteicies**, mēģinājums tiek atkārtots ik pēc piecām minūtēm.
- **Lietotāja credential ar tādu pašu nosaukumu un īpašnieku** nekad netiek pārrakstīts; tā vietā par Secret tiek ziņots kā par konfliktu.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes novērtē egress politiku pēc tam, kad pakalpojums DNS Service ir pārtulkots uz DNS pod, un OpenShift DNS podi klausās portā 5353, nevis 53. Izmantojot bāzes politiku, tīklam pievienotie sandboxi sasniedz internetu, izmantojot IP, bet jebkura nosaukuma meklēšana beidzas ar noildzi. Overlay maina tikai šo noteikumu:

- Tas atļauj UDP un TCP portā 5353 (DNS podu ports), nevis pakalpojuma portā 53.
- Tas atlasa DNS vārdtelpu, izmantojot `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` nav iestatīts visos klasteros.
- Publiskais `ipBlock` noteikums turpina izslēgt privātos, link-local un CGNAT apgabalus.

## Cilium ar kube-proxy aizstāšanu

Bāzes konfigurācija backend podam nepiešķir egress politiku. Ja pievienojat kādu, parasts `ipBlock` nevar atļaut API serveri: pakalpojuma adrese pirms politikas piemērošanas tiek pārrakstīta uz mezgla portu `:6443`, un šī adrese nes Cilium `kube-apiserver` identitāti. Atļaujiet to, izmantojot `CiliumNetworkPolicy`. Tā atlasa arī worker procesus, kas arī palaiž sandbox podus (skatiet Slodzes sadale):

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

## Plānošana (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` pieņem JSON ar laukiem `nodeSelector`, `tolerations`, `runtimeClassName` (piemēram, gVisor), `imagePullSecrets` un `priorityClassName`. Nekas cits netiek pieņemts.

## Slodzes sadale

Workeri ir tā paša attēla papildu Deployments ar `HEYM_INSTANCE_ROLE=worker`, tām pašām `SECRET_KEY` un `ENCRYPTION_KEY` vērtībām un `heym-backend` ServiceAccount, lai tie varētu arī palaist sandbox podus. Worker izpilda Code mezglu, tāpēc tam ir nepieciešams pieprasījums darba vietas direktorijā Code mezgla atkarībām: pietiek ar savu `ReadWriteOnce` pieprasījumu, jo šie direktoriji pastāv tikai vienas izpildes laikā. `overlays/orbstack-cluster` pievieno vienu worker; `scripts/k8s-cluster-smoke.sh` pārbauda, vai rindā esošās izpildes nonāk pie tā un vai to sandbox podi pieder šim worker procesam.

Palaidiet workerus tieši ar uvicorn, kā to dara `overlays/orbstack-cluster/worker.yaml`. Attēla ieejas punkts veic datubāzes migrācijas, un tās pieder galvenajai instancei (main). Piešķiriet katram worker unikālu, stabilu `HEYM_INSTANCE_ID`; StatefulSet poda nosaukums darbojas nevainojami. Rindā esošos uzdevumus workeram, kurš apstājas, līderis (leader) pārvieto uz citu instanci.

## Vietējā pārbaude OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Galvenajai instancei un vienam workerim tā vietā lietojiet `overlays/orbstack-cluster` un palaidiet `./scripts/k8s-cluster-smoke.sh`.

## Saistītās tēmas

- [Parauga manifesti un avota README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Darbība un izvietošana](./running-and-deployment.md)
- [Slodzes sadale](../reference/cluster.md)
