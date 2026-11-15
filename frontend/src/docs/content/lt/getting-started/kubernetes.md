# Heym sistemoje Kubernetes

Įdiekite Heym sistemoje Kubernetes be Docker lizdo (Docker socket). Paleiskite kiekvieną sandbox kaip atskirą pod su saugyklos, tinklo ir worker procesų gairėmis.

Pavyzdiniai manifestai, skirti Heym paleidimui be Docker lizdo. Kiekvienas sandbox (Python įrankiai, skills, Code mazgas, failų analizė, Playwright, MCP stdio, Codex, OpenCode) veikia kaip atskiras pod per Kubernetes API.

## Reikalavimai

- Kubernetes 1.30 arba naujesnė versija (sandbox stdin naudoja prijungimo protokolą `v5.channel.k8s.io`).
- CNI, kuris taiko NetworkPolicy. Heym tai patikrina prieš pirmąjį neprisijungusį sandbox ir atsisako vykdyti neprisijungusius sandbox, jei bandomasis pod vis dar gali prisijungti.
- Kubelet parametras `podPidsLimit`. Podai neturi atskiro PID limito lauko kiekvienam pod; todėl tai yra vienintelė apsauga nuo fork-bombų greta atminties, procesoriaus ir vykdymo laiko limito. Heym negali to patikrinti: konteinerio `/sys/fs/cgroup/pids.max` priklauso jo paties cgroup, o ne podo grupei. Talos pagal numatytuosius nustatymus platinamas be šio apribojimo.

## Įdiegimas

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) yra bendruomenės chart, kurį prižiūri Aleksejus Masolovas ir kuris publikuojamas [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), su išankstiniais platformų nustatymais OpenShift, EKS, AKS ir GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Saugykla (Storage)

`heym-data` saugo Drive failus, papildinius ir Codex/OpenCode darbo sritis. Sandbox podai kiekvienam vykdymui prijungia vieną šio tomo `subPath`. Su `ReadWriteMany` jie gali veikti bet kuriame mazge. Su `ReadWriteOnce` jie yra susieti su backend mazgu. `ReadWriteOncePod` nepalaikomas.

## Pasirinktiniai CA sertifikatų paketai

Prijunkite savo CA paketą prie backend podo ir nukreipkite `SSL_CERT_FILE` (arba `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) į jį. Heym nukopijuos failą į `codex-workspaces/_ca/` tomo paraiškoje ir prijungs tą kopiją tik skaitymo režimu tuo pačiu keliu kiekviename sandboxe, kuris gauna kintamąjį. Su `ReadWriteOnce` paraiška šie sandboxai veiks backend mazge.

Sertifikavimo įstaiga (CA) neatveria tinklo. Sandbox egress srautas pasiekia tik viešuosius adresus; todėl vidiniam paketų veidrodžiui, tarpiniam serveriui ar vidinei API reikalinga atskira taisyklė, pavyzdžiui:

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

## Dedikuota vardų erdvė (namespace) sandboxams

Nustatykite `HEYM_SANDBOX_K8S_NAMESPACE`, kad paleistumėte sandboxus kitoje vardų erdvėje, pažymėkite šią vardų erdvę etikete `pod-security.kubernetes.io/enforce: restricted`, perkelkite Role ten ir išlaikykite Heym vardų erdvėje Role, suteikiančią `get` teisę resursams `pods`. Darbo srities sandboxams tada reikės paraiškos pavadinimu `heym-data` sandbox vardų erdvėje, susietos su tuo pačiu RWX bendrinimu (antrasis, statiškai aprūpintas PersistentVolume).

## Credentials iš Kubernetes Secrets

Secret su etikete `heym.run/credential: "true"` tampa tik skaitymui skirtu credential. Reikšmės lieka kiekvieno proceso atmintyje ir niekada nepatenka į duomenų bazę ar jos atsargines kopijas; pakeitus Secret, credential atnaujinamas be pakartotinio paleidimo. Veikia bet kuris įrankis, kuris rašo Secret: External Secrets Operator, SealedSecrets, SOPS per Flux arba Argo CD, arba `kubectl`.

Pridėkite komponentą prie savo overlay. Jis suteikia ServiceAccount `get`, `list` ir `watch` teises į Secrets ir nustato `HEYM_K8S_CREDENTIALS=true` kiekviename Deployment:

    components:
      - ../../components/kubernetes-credentials

Secrets RBAC negali būti susiaurintas pagal etiketę; todėl Heym gali perskaityti kiekvieną Secret stebimoje vardų erdvėje. Paleiskite Heym atskiroje vardų erdvėje arba nustatykite `HEYM_K8S_CREDENTIALS_NAMESPACE` į vardų erdvę, kurioje yra tik Heym credentialai. Paleidimas atmetamas, jei bet kuris iš kintamųjų `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` arba `HEYM_MCP_STDIO_SANDBOX` yra nustatytas į `subprocess`, nes naudotojo kodas būtų vykdomas šalia ServiceAccount žetono.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heym rodomas credential pavadinimas
        heym.run/type: custom                   # Credential tipas
        heym.run/owner: admin@example.com       # Esamas naudotojas
        heym.run/share-users: alice@example.com # Pasirenkami el. laiškai, atskirti kableliais
        heym.run/share-teams: automation        # Pasirenkami komandų pavadinimai, atskirti kableliais
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Kiekvienas duomenų raktas atitinka konfigūracijos lauką. Tipui su įdėtiniais laukais arba ne eilutės laukais pateikite visą konfigūraciją kaip JSON po vienu `config.json` raktu. Tipai, kuriuose saugomi atnaujinti OAuth žetonai (Codex, Google, BigQuery ir Linear arba Notion OAuth režimu), negali būti tik skaitomi ir yra atmetami.

Naudodami External Secrets Operator, įdėkite etiketę ir anotacijas į tikslinį šabloną:

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

Ko tikėtis:

- **Pod gali būti Ready būsenoje prieš sinchronizavimą.** Paleidimas nelaukia API serverio, todėl vartotojo sąsaja lieka pasiekiama be jo. Kol procesas nėra sinchronizuotas, jis neprisiima eilėje esančių vykdymų; vykdymas, naudojantis vieną iš šių credentials, nepavyksta su klaida `not synced from Kubernetes yet` prieš paleidžiant bet kurį mazgą. Nustatymai → Kubernetes (administratoriaus skirtukas, matomas tik įjungus `HEYM_K8S_CREDENTIALS`) ir Nustatymai → Egzemplioriai rodo sinchronizavimo būseną; todėl nekurkite būsenos patikrinimo (health check), darančio prielaidą, kad Ready reiškia sinchronizuota.
- **Ištrintas Secret padaro jo credential nepasiekiamą**, išsaugant jo ID ir bendrinimus; iš naujo sukūrus Secret (GitOps išvalymas ir pakartotinis taikymas), jis atkūrimas kiekvienam workflow. Eilutės niekada nepašalinamos automatiškai; administratorius jas pašalina iš Nustatymai → Kubernetes.
- **Savininkui, kuris dar neprisijungė**, bandymas kartojamas kas penkias minutes.
- **Naudotojo credential su tuo pačiu pavadinimu ir savininku** niekada nėra perrašomas; vietoj to apie Secret pranešama kaip apie konfliktą.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes įvertina egress politiką po to, kai DNS Service išverčiama į DNS pod, o OpenShift DNS podai klausosi 5353 prievade, o ne 53. Pagal bazinę politiką tinkle esantys sandboxai pasiekia internetą per IP, tačiau bet kuri vardo paieška baigiasi skirtuoju laiku (timeout). Overlay keičia tik šią taisyklę:

- Jis leidžia UDP ir TCP 5353 prievade (DNS podų prievade), o ne paslaugos 53 prievade.
- Jis pasirenka DNS vardų erdvę pagal `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` nėra nustatytas kiekviename klasteryje.
- Viešoji `ipBlock` taisyklė toliau neapima privačių, link-local ir CGNAT diapazonų.

## Cilium su kube-proxy pakeitimu

Bazinė konfigūracija backend podui nesuteikia egress politikos. Jei pridėsite tokią, paprastas `ipBlock` negali leisti API serverio: paslaugos adresas perrašomas į mazgo prievadą `:6443` prieš taikant politiką, ir šis adresas turi Cilium `kube-apiserver` tapatybę. Leiskite tai naudodami `CiliumNetworkPolicy`. Ji taip pat pasirenka workerius, kurie taip pat paleidžia sandbox podus (žr. Apkrovos paskirstymas):

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

## Planavimas (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` priima JSON su `nodeSelector`, `tolerations`, `runtimeClassName` (pavyzdžiui gVisor), `imagePullSecrets` ir `priorityClassName`. Jokie kiti laukai nepriimami.

## Apkrovos paskirstymas

Workeriai yra papildomi to paties atvaizdo Deployments su `HEYM_INSTANCE_ROLE=worker`, tomis pačiomis `SECRET_KEY` ir `ENCRYPTION_KEY` reikšmėmis bei `heym-backend` ServiceAccount, kad jie taip pat galėtų paleisti sandbox podus. Worker vykdo Code mazgą, todėl jam reikia tomo darbo srities kataloge Code mazgo priklausomybėms: pakanka jo paties `ReadWriteOnce` paraiškos, nes šie katalogai egzistuoja tik vieno vykdymo metu. `overlays/orbstack-cluster` prideda vieną workerį; `scripts/k8s-cluster-smoke.sh` patikrina, ar eilėje esantys vykdymo darbai patenka į jį ir ar jų sandbox podai priklauso šiam worker procesui.

Paleiskite workerius tiesiogiai naudodami uvicorn, kaip tai daroma `overlays/orbstack-cluster/worker.yaml`. Atvaizdo įėjimo taškas atlieka duomenų bazės migracijas, ir jos priklauso pagrindiniam egzemplioriui (main). Kiekvienam worker suteikite unikalų, stabilų `HEYM_INSTANCE_ID`; StatefulSet podo pavadinimas puikiai tinka. Eilėje esančius vykdymo darbus sustabdytam worker procesui lyderis (leader) perkelia į kitą egzempliorių.

## Vietinis bandymas OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Pagrindiniam egzemplioriui kartu su worker pritaikykite `overlays/orbstack-cluster` ir paleiskite `./scripts/k8s-cluster-smoke.sh`.

## Susijusios temos

- [Pavyzdiniai manifestai ir pradinio kodo README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Veikimas ir diegimas](./running-and-deployment.md)
- [Apkrovos paskirstymas](../reference/cluster.md)
