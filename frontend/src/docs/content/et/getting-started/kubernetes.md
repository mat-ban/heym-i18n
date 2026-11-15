# Heym Kuberneteses

Paigaldage Heym Kubernetesesse ilma Docker socketita. Käitage iga sandboxi eraldi podina koos salvestusruumi, võrgunduse ja workerite juhenditega.

Näidismanifestid Heymi käitamiseks ilma Docker socketita. Iga sandbox (Pythoni tööriistad, skills, Code sõlm, failianalüüs, Playwright, MCP stdio, Codex, OpenCode) töötab eraldi podina Kubernetes API kaudu.

## Nõuded

- Kubernetes 1.30 või uuem (sandboxi stdin kasutab `v5.channel.k8s.io` liidestusprotokolli).
- CNI, mis jõustab NetworkPolicy reegleid. Heym kontrollib seda enne esimest offline-sandboxi ja keeldub offline-sandboxe käitamast, kui testpod suudab endiselt ühendust luua.
- Kubeleti `podPidsLimit`. Podidel puudub podipõhine PID-limiidi väli; seega on see peale mälu, CPU ja ajalimiidi ainus kaitse fork-pommide eest. Heym ei saa seda kontrollida: konteineri `/sys/fs/cgroup/pids.max` kuulub tema enda cgroupi, mitte podi oma alla. Talos tarnitakse vaikimisi ilma selle piiranguta.

## Paigaldus

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) on kogukonna chart, mida haldab Alexey Masolov ja mis on avaldatud [Artifact Hubis](https://artifacthub.io/packages/helm/heym/heym), pakkudes platvormi eelseadistusi OpenShifti, EKS-i, AKS-i ja GKE jaoks:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Salvestusruum (Storage)

`heym-data` hoiab Drive'i faile, pistikprogramme ja Codex/OpenCode tööruume. Sandboxi podid monteerivad sellest igaks käituseks ühe `subPath`-i. Valikuga `ReadWriteMany` saavad need töötada mis tahes sõlmes. Valikuga `ReadWriteOnce` on need seotud backend-serveri sõlmega. `ReadWriteOncePod` ei ole toetatud.

## Kohandatud CA sertifikaadipaketid

Monteerige oma CA pakett backend-podi ja suunake `SSL_CERT_FILE` (või `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) sellele. Heym kopeerib faili salvestusruumi nõudesse `codex-workspaces/_ca/` ja monteerib selle koopia kirjutuskaitstuna samale teele igas muutujat vastuvõtvas sandboxis. `ReadWriteOnce` nõude korral töötavad need sandboxid backend-serveri sõlmes.

CA ei ava võrku. Sandboxi egress-liiklus jõuab ainult avalike aadressideni; sisemine paketipeegel, proksi või sisemine API vajab seetõttu oma reeglit, näiteks:

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

## Eraldi nimeruum (namespace) sandboxidele

Määrake `HEYM_SANDBOX_K8S_NAMESPACE`, et käitada sandboxe mujal, märgistage see nimeruum sildiga `pod-security.kubernetes.io/enforce: restricted`, viige Role sinna ja säilitage Heymi nimeruumis Role, mis annab `get` õiguse `pods` ressurssidele. Tööruumi sandboxid vajavad seejärel sandboxi nimeruumis nõuet nimega `heym-data`, mis on seotud sama RWX jagamisega (teine, staatiliselt eraldatud PersistentVolume).

## Credentials Kubernetes Secrets ressurssidest

Secret sildiga `heym.run/credential: "true"` muutub kirjutuskaitstud credentialiks. Väärtused jäävad iga protsessi mällu ega jõua kunagi andmebaasi ega selle varukoopiatesse; Secreti muutmine roteerib credentiali ilma taaskäivituseta. Iga tööriist, mis kirjutab Secreti, töötab: External Secrets Operator, SealedSecrets, SOPS Fluxi või Argo CD kaudu või `kubectl`.

Lisage komponent oma overlayle. See annab ServiceAccountile `get`, `list` ja `watch` õigused Secrets ressurssidele ning määrab `HEYM_K8S_CREDENTIALS=true` igale Deploymentile:

    components:
      - ../../components/kubernetes-credentials

Secrets RBAC-i ei saa sildi järgi kitsendada; seega saab Heym lugeda kõiki jälgitava nimeruumi Secrete. Käitage Heymi tema enda nimeruumis või määrake `HEYM_K8S_CREDENTIALS_NAMESPACE` nimeruumile, mis sisaldab ainult Heymi credentiale. Käivitamine lükatakse tagasi, kui mõni muutujatest `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` või `HEYM_MCP_STDIO_SANDBOX` on seatud väärtusele `subprocess`, kuna kasutajakood käivitataks ServiceAccounti tokeni kõrval.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Heymis kuvatav credentiali nimi
        heym.run/type: custom                   # Credentiali tüüp
        heym.run/owner: admin@example.com       # Olemasolev kasutaja
        heym.run/share-users: alice@example.com # Valikulised komaga eraldatud e-posti aadressid
        heym.run/share-teams: automation        # Valikulised komaga eraldatud meeskonnanimed
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Iga andmevõti on konfiguratsiooniväli. Pesastatud või mitte-string väljadega tüübi puhul sisestage kogu konfiguratsioon JSON-ina ühe `config.json` võtme alla. Tüübid, mis salvestavad värskendatud OAuth-tokeneid (Codex, Google, BigQuery ning Linear või Notion OAuth-režiimis), ei saa olla kirjutuskaitstud ja lükatakse tagasi.

External Secrets Operatori puhul asetage silt ja annotatsioonid sihtmallile:

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

Mida oodata:

- **Pod võib olla Ready enne sünkroonimist.** Käivitamine ei oota API serverit, seega kasutajaliides jääb kättesaadavaks. Kuni protsess pole sünkroonitud, ei võta see järjekorras olevaid käitusi vastu; ühte neist credentialidest kasutav käitus ebaõnnestub veateatega `not synced from Kubernetes yet` enne mis tahes sõlme käivitamist. Seaded → Kubernetes (administraatori vahekaart, mis kuvatakse ainult siis, kui `HEYM_K8S_CREDENTIALS` on sees) ja Seaded → Eksemplarid näitavad sünkroonimise olekut; seetõttu ärge looge tervisekontrolli, mis eeldab, et Ready tähendab sünkroonitut.
- **Kustutatud Secret muudab credentiali kättesaamatuks**, säilitades selle ID ja jagamised; Secreti uuesti loomine (GitOpsi eemaldamine ja uuesti rakendamine) taastab selle iga workflow jaoks. Ridu ei eemaldata kunagi automaatselt; administraator eemaldab need menüüst Seaded → Kubernetes.
- **Omaniku puhul, kes pole veel sisse loginud**, proovitakse uuesti iga viie minuti järel.
- **Sama nime ja omanikuga kasutaja credentialit** ei kirjutata kunagi üle; Secretist teatatakse selle asemel kui konfliktist.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes hindab egress-poliitikat pärast seda, kui DNS Service on tõlgitud DNS-podiks, ja OpenShifti DNS-podid kuulavad porti 5353, mitte 53. Baaspoliitika korral jõuavad võrguga ühendatud sandboxid internetti IP kaudu, kuid iga nimepäring aegub. Overlay muudab ainult seda reeglit:

- See lubab UDP ja TCP pordil 5353 (DNS-podide port), mitte teenuse pordil 53.
- See valib DNS-nimeruumi `kubernetes.io/metadata.name: openshift-dns` kaudu. `network.openshift.io/policy-group: dns` ei ole määratud igas klastris.
- Avalik `ipBlock` reegel välistab jätkuvalt privaatsed, link-local ja CGNAT vahemikud.

## Cilium koos kube-proxy asendusega

Baaskonfiguratsioon ei määra backend-podile egress-poliitikat. Kui lisate selle, ei saa tavaline `ipBlock` API serverit lubada: teenuse aadress kirjutatakse enne poliitika rakendamist ümber sõlme pordile `:6443` ja see aadress kannab Ciliumi `kube-apiserver` identiteeti. Lubage see `CiliumNetworkPolicy` abil. See valib ka workerid, mis käivitavad samuti sandbox-pode (vt Koormuse jaotamine):

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

## Ajastamine (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` võtab vastu JSON-i väljadega `nodeSelector`, `tolerations`, `runtimeClassName` (näiteks gVisor), `imagePullSecrets` ja `priorityClassName`. Midagi muud vastu ei võeta.

## Koormuse jaotamine

Workerid on sama tõmmise täiendavad Deployments-üksused väärtusega `HEYM_INSTANCE_ROLE=worker`, samade `SECRET_KEY` ja `ENCRYPTION_KEY` väärtustega ning `heym-backend` ServiceAccountiga, nii et nad saavad samuti käivitada sandbox-pode. Worker käitab Code sõlme, mistõttu vajab ta Code sõlme sõltuvuste jaoks tööruumi kataloogis salvestusruumi nõuet: piisab tema enda `ReadWriteOnce` nõudest, kuna need kataloogid eksisteerivad vaid ühe käituse vältel. `overlays/orbstack-cluster` lisab ühe workeri; `scripts/k8s-cluster-smoke.sh` kontrollib, et järjekorras olevad käitused jõuavad sinna ja nende sandbox-podid kuuluvad sellele workerile.

Käivitage workerid otse uvicorniga, nagu teeb `overlays/orbstack-cluster/worker.yaml`. Tõmmise sisenemispunkt käitab andmebaasi migratsioone ja need kuuluvad peamisele eksemplarile (main). Andke igale workerile unikaalne ja stabiilne `HEYM_INSTANCE_ID`; StatefulSet podi nimi sobib selleks hästi. Peatunud workeri järjekorras olevad käitused viib juht (leader) üle teisele eksemplarile.

## Kohalik test OrbStackis

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Peamise eksemplari ja ühe workeri jaoks rakendage selle asemel `overlays/orbstack-cluster` ja käivitage `./scripts/k8s-cluster-smoke.sh`.

## Seotud teemad

- [Näidismanifestid ja lähtekoodi README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Käitamine ja paigaldamine](./running-and-deployment.md)
- [Koormuse jaotamine](../reference/cluster.md)
