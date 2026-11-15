# Heym a Kubernetes rendszeren

Telepítse a Heym alkalmazást Kubernetes környezetben Docker socket nélkül. Futtasson minden sandbox környezetet saját podként, a tárolásra, hálózatkezelésre és workerekre vonatkozó útmutatók segítségével.

Példa jegyzékek (manifests) a Heym Docker socket nélküli futtatásához. Minden sandbox (Python eszközök, skills, a Code csomópont, fájlelemzés, Playwright, MCP stdio, Codex, OpenCode) saját podként fut a Kubernetes API-n keresztül.

## Követelmények

- Kubernetes 1.30 vagy újabb verzió (a sandbox stdin a `v5.channel.k8s.io` csatolási protokollt használja).
- NetworkPolicy szabályokat kikényszerítő CNI. A Heym ezt az első offline sandbox előtt ellenőrzi, és megtagadja az offline sandboxok futtatását, ha egy tesztpod továbbra is képes kapcsolatot létesíteni.
- Kubelet `podPidsLimit`. A podok nem rendelkeznek podonkénti PID-korlát mezővel, így a memória, a CPU és az időkorlát mellett ez az egyetlen fork-bomba elleni védelem. A Heym ezt nem tudja ellenőrizni: egy konténer `/sys/fs/cgroup/pids.max` értéke a saját cgroupjához tartozik, nem a podéhoz. A Talos alapértelmezés szerint e korlát nélkül érkezik.

## Telepítés

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

A [heym-helm](https://github.com/amasolov/heym-helm) egy Alexey Masolov által karbantartott és az [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym) felületén közzétett közösségi chart, platform-előbeállításokkal az OpenShift, EKS, AKS és GKE rendszerekhez:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Tárolás (Storage)

A `heym-data` tárolja a Drive fájlokat, a beépülő modulokat és a Codex/OpenCode munkaterületeket. A sandbox podok futásonként ennek egy `subPath` útvonalát csatolják. A `ReadWriteMany` beállítással bármely csomóponton futhatnak. A `ReadWriteOnce` használatával a backend csomópontjához vannak rögzítve. A `ReadWriteOncePod` nem támogatott.

## Egyéni CA csomagok

Csatolja CA-csomagját a backend podba, és irányítsa rá az `SSL_CERT_FILE` (vagy `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) változót. A Heym átmásolja a fájlt a kötetigény `codex-workspaces/_ca/` könyvtárába, és ezt a másolatot csak olvasható módon csatolja ugyanazon az útvonalon minden olyan sandboxban, amely megkapja a változót. `ReadWriteOnce` igény esetén ezek a sandboxok a backend csomópontján futnak.

A CA nem nyitja meg a hálózatot. A sandbox egress kizárólag nyilvános címeket ér el; ezért egy belső csomagtükör, proxy vagy belső API saját szabályt igényel, például:

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

## Dedikált sandbox névtér

Állítsa be a `HEYM_SANDBOX_K8S_NAMESPACE` változót a sandboxok máshol történő futtatásához, lássa el a névteret a `pod-security.kubernetes.io/enforce: restricted` címkével, helyezze át a Role objektumot oda, és tartson fenn a Heym névtérben egy olyan Role-t, amely `get` jogosultságot ad a `pods` erőforrásokra. A munkaterület sandboxoknak ezután egy `heym-data` nevű kötetigényre van szükségük a sandbox névtérben, amely ugyanahhoz az RWX megosztáshoz kapcsolódik (egy második, statikusan kiosztott PersistentVolume).

## Credentials a Kubernetes Secrets objektumokból

A `heym.run/credential: "true"` címkével ellátott Secret csak olvasható credentiallé válik. Az értékek az egyes folyamatok memóriájában maradnak, és soha nem kerülnek az adatbázisba vagy annak biztonsági mentéseibe; a Secret módosítása újraindítás nélkül rotálja a credentialt. Bármely eszköz támogatott, amely Secretet ír: External Secrets Operator, SealedSecrets, SOPS Fluxon vagy Argo CD-n keresztül, illetve a `kubectl`.

Adja hozzá a komponenst a réteghez (overlay). Ez `get`, `list` és `watch` jogosultságot ad a ServiceAccount számára a Secrets objektumokra, és beállítja a `HEYM_K8S_CREDENTIALS=true` értéket minden Deploymenten:

    components:
      - ../../components/kubernetes-credentials

A Secrets RBAC nem szűkíthető címke alapján; így a Heym a megfigyelt névtér minden Secretjét képes olvasni. Futtassa a Heymet saját névtérben, vagy állítsa a `HEYM_K8S_CREDENTIALS_NAMESPACE` értékét egy olyan névtérre, amely kizárólag Heym-credentialöket tartalmaz. Az indítás megtagadva marad, amíg a `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` vagy `HEYM_MCP_STDIO_SANDBOX` bármelyike `subprocess` értékre van állítva, mivel a felhasználói kód a ServiceAccount token mellett futna.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # A Heymben megjelenő credential név
        heym.run/type: custom                   # Egy credential típus
        heym.run/owner: admin@example.com       # Egy meglévő felhasználó
        heym.run/share-users: alice@example.com # Opcionális, vesszővel elválasztott e-mailek
        heym.run/share-teams: automation        # Opcionális, vesszővel elválasztott csapatnevek
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Minden adatkulcs egy konfigurációs mezőnek felel meg. Beágyazott vagy nem szöveges mezőkkel rendelkező típus esetén helyezze el a teljes konfigurációt JSON-ként egyetlen `config.json` kulcs alá. A frissített OAuth-tokeneket tároló típusok (Codex, Google, BigQuery, valamint a Linear vagy Notion OAuth módban) nem lehetnek csak olvashatók, és elutasításra kerülnek.

Az External Secrets Operator használata esetén helyezze a címkét és az annotációkat a célsablonra:

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

Mire számíthat:

- **Egy pod a szinkronizálás előtt is lehet Ready állapotban.** Az indítás nem vár az API szerverre, így a felhasználói felület nélküle is elérhető marad. Amíg egy folyamat nem szinkronizálódik, nem fogad sorba állított futásokat; az ezeket a credentialöket használó futások a csomópontok elindulása előtt meghiúsulnak `not synced from Kubernetes yet` hibával. A Beállítások → Kubernetes (egy adminisztrátori lap, amely csak bekapcsolt `HEYM_K8S_CREDENTIALS` mellett jelenik meg) és a Beállítások → Példányok mutatják a szinkronizálási állapotot; ezért ne építsen olyan állapotellenőrzést, amely feltételezi, hogy a Ready állapot egyben szinkronizáltat is jelent.
- **A törölt Secret elérhetetlenné teszi a credentialt**, megőrizve annak azonosítóját és megosztásait; a Secret újbóli létrehozása (GitOps törlés és újraalkalmazás) minden workflow számára visszaállítja azt. A sorok soha nem törlődnek automatikusan; a rendszergazda a Beállítások → Kubernetes menüpontban távolíthatja el őket.
- **Azon tulajdonos esetén, aki még nem jelentkezett be**, a kísérlet ötpercenként megismétlődik.
- **Az azonos nevű és azonos tulajdonosú felhasználói credential** soha nem íródik felül; a Secret ehelyett ütközésként kerül jelentésre.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

Az OVN-Kubernetes azután értékeli ki az egress szabályzatot, hogy a DNS Service egy DNS podra fordításra került, és az OpenShift DNS podjai az 5353-as porton figyelnek, nem az 53-ason. Az alapszabályzat mellett a hálózatra kapcsolt sandboxok IP alapján elérik az internetet, de minden névfeloldás túllépi az időkorlátot. Az overlay kizárólag ezt a szabályt módosítja:

- Engedélyezi az UDP és TCP 5353-as portot (a DNS podok portját), nem a Service 53-as portját.
- Kiválasztja a DNS névteret a `kubernetes.io/metadata.name: openshift-dns` alapján. A `network.openshift.io/policy-group: dns` nincs beállítva minden fürtön.
- A nyilvános `ipBlock` szabály továbbra is kizárja a magán, link-local és CGNAT címtartományokat.

## Cilium kube-proxy helyettesítéssel

Az alapkonfiguráció nem ad egress szabályzatot a backend podnak. Ha hozzáad egyet, egy egyszerű `ipBlock` nem engedélyezheti az API szervert: a Service címe a szabályzat alkalmazása előtt átíródik egy csomópont `:6443` portjára, és ez a cím a Cilium `kube-apiserver` identitását hordozza. Engedélyezze egy `CiliumNetworkPolicy` segítségével. Ez kiválasztja a workereket is, amelyek szintén indítanak sandbox podokat (lásd: Terheléselosztás):

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

## Ütemezés (Scheduling)

A `HEYM_SANDBOX_K8S_POD_OVERRIDES` JSON formátumot fogad el a következő mezőkkel: `nodeSelector`, `tolerations`, `runtimeClassName` (például gVisor), `imagePullSecrets` és `priorityClassName`. Semmilyen más mező nem fogadható el.

## Terheléselosztás

A workerek ugyanazon képfájl további Deploymentjei `HEYM_INSTANCE_ROLE=worker` beállítással, azonos `SECRET_KEY` és `ENCRYPTION_KEY` értékekkel, valamint a `heym-backend` ServiceAccount fiókkal, így ők is indíthatnak sandbox podokat. A worker futtatja a Code csomópontot, ezért a Code csomópont függőségeihez kötetigényre van szüksége a munkaterület könyvtárában: a saját `ReadWriteOnce` igény megfelelő, mivel ezek a könyvtárak csak egyetlen futás erejéig élnek. Az `overlays/orbstack-cluster` hozzáad egy workert; a `scripts/k8s-cluster-smoke.sh` ellenőrzi, hogy a sorba állított futások oda érkeznek-e, és a sandbox podjaik a workerhez tartoznak-e.

Indítsa el a workereket közvetlenül az uvicorn segítségével, ahogyan az `overlays/orbstack-cluster/worker.yaml` teszi. A képfájl belépési pontja adatbázis-migrációkat futtat, és ezek a main feladatai közé tartoznak. Adjon minden workernek egyedi, stabil `HEYM_INSTANCE_ID` azonosítót; a StatefulSet pod neve megfelel a célnak. A leállított workerhez tartozó sorba állított futásokat a vezető (leader) áthelyezi egy másik példányra.

## Helyi tesztelés OrbStack környezetben

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

A main plusz egy worker konfigurációhoz alkalmazza inkább az `overlays/orbstack-cluster` réteget, és futtassa a `./scripts/k8s-cluster-smoke.sh` parancsot.

## Kapcsolódó témakörök

- [Példa jegyzékek és forráskód README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Futtatás és telepítés](./running-and-deployment.md)
- [Terheléselosztás](../reference/cluster.md)
