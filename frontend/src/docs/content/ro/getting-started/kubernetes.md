# Heym pe Kubernetes

Implementați Heym pe Kubernetes fără un socket Docker. Rulați fiecare sandbox ca pod dedicat, cu ghiduri pentru stocare, rețea și workeri.

Exemple de manifeste pentru rularea Heym fără un socket Docker. Fiecare sandbox (instrumente Python, skills, nodul Code, analiză de fișiere, Playwright, MCP stdio, Codex, OpenCode) rulează ca pod dedicat prin intermediul Kubernetes API.

## Cerințe

- Kubernetes 1.30 sau mai recent (stdin-ul din sandbox utilizează protocolul de atașare `v5.channel.k8s.io`).
- Un CNI care aplică NetworkPolicy. Heym verifică acest aspect înainte de primul sandbox offline și refuză rularea sandboxurilor offline atunci când un pod de test se poate conecta în continuare.
- O valoare `podPidsLimit` la nivel de kubelet. Podurile nu au un câmp dedicat pentru limita de PID per pod; prin urmare, aceasta este singura protecție împotriva atacurilor de tip fork-bomb pe lângă memorie, CPU și timpul limită de execuție. Heym nu poate verifica acest lucru: `/sys/fs/cgroup/pids.max` al unui container aparține propriului cgroup, nu celui al podului. Talos este livrat fără această limită în mod implicit.

## Instalare

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) este un chart comunitar întreținut de Alexey Masolov și publicat pe [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), cu presetări de platformă pentru OpenShift, EKS, AKS și GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Stocare (Storage)

`heym-data` stochează fișierele Drive, pluginurile și spațiile de lucru Codex/OpenCode. Podurile de sandbox montează un `subPath` al acestui volum pentru fiecare execuție. Cu `ReadWriteMany`, acestea pot rula pe orice nod. Cu `ReadWriteOnce`, acestea sunt fixate pe nodul de backend. `ReadWriteOncePod` nu este acceptat.

## Pachete de CA personalizate

Montați pachetul CA în podul de backend și direcționați `SSL_CERT_FILE` (sau `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) către acesta. Heym copiază fișierul în `codex-workspaces/_ca/` pe revendicarea de volum și montează acea copie în mod read-only la aceeași cale în fiecare sandbox care primește variabila. Cu o revendicare `ReadWriteOnce`, aceste sandboxuri vor rula pe nodul de backend.

O autoritate CA nu deschide rețeaua. Traficul egress din sandbox ajunge exclusiv la adrese publice; prin urmare, o oglindă internă de pachete, un proxy sau un API intern necesită o regulă proprie, de exemplu:

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

## Un namespace dedicat pentru sandboxuri

Setați `HEYM_SANDBOX_K8S_NAMESPACE` pentru a rula sandboxurile în alt namespace, etichetați acel namespace cu `pod-security.kubernetes.io/enforce: restricted`, mutați Role acolo și păstrați în namespace-ul Heym o Role care acordă `get` pe `pods`. Sandboxurile spațiului de lucru vor avea nevoie de o revendicare numită `heym-data` în namespace-ul de sandbox legată de aceeași partajare RWX (un al doilea PersistentVolume alocat static).

## Credentials din Kubernetes Secrets

Un Secret etichetat cu `heym.run/credential: "true"` devine un credential read-only. Valorile rămân în memoria fiecărui proces și nu ajung niciodată în baza de date sau în backupurile acesteia; modificarea Secretului rotește credentialul fără repornire. Orice instrument care scrie un Secret este compatibil: External Secrets Operator, SealedSecrets, SOPS prin Flux sau Argo CD, ori `kubectl`.

Adăugați componenta la overlayul dumneavoastră. Aceasta acordă ServiceAccount drepturi de `get`, `list` și `watch` pe Secrets și setează `HEYM_K8S_CREDENTIALS=true` pe fiecare Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC pentru Secrets nu poate fi filtrat după etichetă; prin urmare, Heym poate citi orice Secret din namespace-ul monitorizat. Rulați Heym în propriul namespace sau setați `HEYM_K8S_CREDENTIALS_NAMESPACE` la un namespace care conține exclusiv credentials Heym. Pornirea refuză inițializarea dacă oricare dintre variabilele `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` sau `HEYM_MCP_STDIO_SANDBOX` este setată pe `subprocess`, deoarece codul utilizatorului ar rula alături de tokenul ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Numele credentialului afișat în Heym
        heym.run/type: custom                   # Un tip de credential
        heym.run/owner: admin@example.com       # Un utilizator existent
        heym.run/share-users: alice@example.com # Adrese de e-mail opționale separate prin virgulă
        heym.run/share-teams: automation        # Nume opționale de echipe separate prin virgulă
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Fiecare cheie de date reprezintă un câmp de configurare. Pentru un tip cu câmpuri imbricate sau care nu sunt șiruri de caractere, plasați întreaga configurare ca JSON sub o singură cheie `config.json`. Tipurile care stochează tokenuri OAuth reîmprospătate (Codex, Google, BigQuery și Linear sau Notion în modul OAuth) nu pot fi read-only și sunt refuzate.

Cu External Secrets Operator, plasați eticheta și adnotările pe șablonul țintă:

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

La ce să vă așteptați:

- **Un pod poate fi Ready înainte de a fi sincronizat.** Pornirea nu așteaptă serverul de API, permițând interfeței să rămână disponibilă fără acesta. Până când un proces este sincronizat, acesta nu preia execuții în coadă; o execuție care utilizează unul dintre aceste credentials eșuează cu `not synced from Kubernetes yet` înainte de rularea vreunui nod. Setări → Kubernetes (o filă de administrare vizibilă numai când `HEYM_K8S_CREDENTIALS` este activat) și Setări → Instanțe afișează starea de sincronizare; prin urmare, nu construiți un health check presupunând că Ready înseamnă sincronizat.
- **Un Secret șters face credentialul indisponibil**, păstrându-și ID-ul și partajările; recrearea Secretului (curățare și reaplicare prin GitOps) îl restaurează pentru fiecare workflow. Rândurile nu sunt eliminate niciodată automat; un administrator le poate elimina din Setări → Kubernetes.
- **Pentru un proprietar care nu s-a autentificat încă**, se reîncearcă la fiecare cinci minute.
- **Un credential de utilizator cu același nume și proprietar** nu este niciodată suprascris; Secretul este raportat ca un conflict.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes evaluează politica de egress după ce serviciul DNS Service este tradus într-un pod DNS, iar podurile DNS din OpenShift ascultă pe portul 5353, nu pe 53. Cu politica de bază, sandboxurile conectate la rețea ajung la internet prin IP, dar rezolvarea numelor expiră. Overlayul modifică doar această regulă:

- Permite UDP și TCP pe portul 5353, portul podurilor DNS, și nu 53 al serviciului Service.
- Selectează namespace-ul DNS prin `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` nu este setat pe toate clusterele.
- Regula publică `ipBlock` continuă să excludă intervalele private, link-local și CGNAT.

## Cilium cu înlocuire de kube-proxy

Configurația de bază nu alocă nicio politică de egress podului de backend. Dacă adăugați una, un simplu `ipBlock` nu poate permite serverul de API: adresa Service este rescrisă pe portul `:6443` al unui nod înainte de aplicarea politicii, iar acea adresă poartă identitatea `kube-apiserver` Cilium. Permiteți accesul cu o `CiliumNetworkPolicy`. Aceasta selectează și workerii, care pornesc la rândul lor poduri de sandbox (consultați Distribuția sarcinii):

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

## Planificare (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` acceptă JSON cu `nodeSelector`, `tolerations`, `runtimeClassName` (de exemplu gVisor), `imagePullSecrets` și `priorityClassName`. Niciun alt câmp nu este acceptat.

## Distribuția sarcinii

Workerii sunt Deployments suplimentare ale aceleiași imagini cu `HEYM_INSTANCE_ROLE=worker`, aceleași valori pentru `SECRET_KEY` și `ENCRYPTION_KEY`, și ServiceAccount `heym-backend`, astfel încât să poată porni poduri de sandbox. Un worker rulează nodul Code, necesitând o revendicare în directorul spațiului de lucru pentru dependențele nodului Code: o revendicare proprie `ReadWriteOnce` este suficientă, deoarece aceste directoare există doar pe durata unei singure execuții. `overlays/orbstack-cluster` adaugă un worker; `scripts/k8s-cluster-smoke.sh` verifică dacă execuțiile din coadă ajung la acesta și dacă podurile lor de sandbox îi aparțin.

Porniți workerii direct cu uvicorn, așa cum face `overlays/orbstack-cluster/worker.yaml`. Punctul de intrare al imaginii rulează migrările bazei de date, iar acestea aparțin instanței principale (main). Atribuiți fiecărui worker un `HEYM_INSTANCE_ID` unic și stabil; numele unui pod din StatefulSet funcționează perfect. Execuțiile din coadă atribuite unui worker care se oprește sunt mutate pe o altă instanță de către lider.

## Test local pe OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Pentru instanța principală plus un worker, aplicați în schimb `overlays/orbstack-cluster` și rulați `./scripts/k8s-cluster-smoke.sh`.

## Resurse conexe

- [Manifeste de exemplu și README sursă](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Operare și implementare](./running-and-deployment.md)
- [Distribuția sarcinii](../reference/cluster.md)
