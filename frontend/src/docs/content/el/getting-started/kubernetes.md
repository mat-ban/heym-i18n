# Heym στο Kubernetes

Αναπτύξτε το Heym στο Kubernetes χωρίς Docker socket. Εκτελέστε κάθε sandbox ως ξεχωριστό pod, με οδηγούς για αποθήκευση, δικτύωση και workers.

Παραδείγματα manifest για την εκτέλεση του Heym χωρίς Docker socket. Κάθε sandbox (εργαλεία Python, skills, ο κόμβος Code, ανάλυση αρχείων, Playwright, MCP stdio, Codex, OpenCode) εκτελείται ως δικό του pod μέσω του Kubernetes API.

## Απαιτήσεις

- Kubernetes 1.30 ή νεότερο (το stdin του sandbox χρησιμοποιεί το πρωτόκολλο προσάρτησης `v5.channel.k8s.io`).
- CNI που επιβάλλει NetworkPolicy. Το Heym το ελέγχει πριν από το πρώτο offline sandbox και αρνείται να εκτελέσει offline sandboxes όταν ένα δοκιμαστικό pod μπορεί ακόμα να συνδεθεί.
- Ρύθμιση `podPidsLimit` στο kubelet. Τα pods δεν διαθέτουν πεδίο ορίου PID ανά pod, επομένως αυτή είναι η μόνη προστασία από fork-bombs εκτός από τη μνήμη, την CPU και το χρονικό όριο. Το Heym δεν μπορεί να το ελέγξει: το `/sys/fs/cgroup/pids.max` ενός container ανήκει στο δικό του cgroup, όχι σε αυτό του pod. Το Talos παρέχεται χωρίς αυτό το όριο από προεπιλογή.

## Εγκατάσταση

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

Το [heym-helm](https://github.com/amasolov/heym-helm) είναι ένα κοινοτικό chart που συντηρείται από τον Alexey Masolov και δημοσιεύεται στο [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), με προεπιλογές πλατφόρμας για OpenShift, EKS, AKS και GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Αποθήκευση (Storage)

Το `heym-data` περιέχει αρχεία Drive, plugins και τους χώρους εργασίας Codex/OpenCode. Τα pods των sandbox προσαρτούν ένα `subPath` αυτού του τόμου ανά εκτέλεση. Με το `ReadWriteMany` μπορούν να εκτελούνται σε οποιονδήποτε κόμβο. Με το `ReadWriteOnce` παραμένουν συνδεδεμένα στον κόμβο του backend. Το `ReadWriteOncePod` δεν υποστηρίζεται.

## Προσαρμοσμένα πακέτα CA

Προσαρτήστε το πακέτο CA σας στο pod του backend και κατευθύνετε το `SSL_CERT_FILE` (ή `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) σε αυτό. Το Heym αντιγράφει το αρχείο στο `codex-workspaces/_ca/` στον τόμο και προσαρτά αυτό το αντίγραφο μόνο για ανάγνωση στην ίδια διαδρομή σε κάθε sandbox που λαμβάνει τη μεταβλητή. Με αίτημα `ReadWriteOnce`, αυτά τα sandboxes εκτελούνται στον κόμβο του backend.

Μια αρχή CA δεν ανοίγει το δίκτυο. Η κίνηση egress του sandbox φτάνει μόνο σε δημόσιες διευθύνσεις. Συνεπώς, ένα εσωτερικό mirror πακέτων, proxy ή εσωτερικό API χρειάζεται δικό του κανόνα, για παράδειγμα:

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

## Αποκλειστικό namespace για sandboxes

Ορίστε το `HEYM_SANDBOX_K8S_NAMESPACE` για την εκτέλεση sandboxes σε διαφορετικό namespace, επισημάνετε αυτό το namespace με `pod-security.kubernetes.io/enforce: restricted`, μετακινήστε το Role εκεί και διατηρήστε στο namespace του Heym ένα Role που παρέχει `get` στα `pods`. Τα sandboxes χώρων εργασίας χρειάζονται στη συνέχεια μια απαίτηση τόμου με όνομα `heym-data` στο namespace των sandbox συνδεδεμένη με τον ίδιο διαμοιρασμό RWX (ένας δεύτερος, στατικά δεσμευμένος PersistentVolume).

## Credentials από Kubernetes Secrets

Ένα Secret με ετικέτα `heym.run/credential: "true"` μετατρέπεται σε credential μόνο για ανάγνωση. Οι τιμές παραμένουν στη μνήμη κάθε διεργασίας και δεν φτάνουν ποτέ στη βάση δεδομένων ή στα αντίγραφα ασφαλείας της. Η αλλαγή του Secret ανανεώνει το credential χωρίς επανεκκίνηση. Οποιοδήποτε εργαλείο δημιουργεί Secret λειτουργεί: External Secrets Operator, SealedSecrets, SOPS μέσω Flux ή Argo CD, ή `kubectl`.

Προσθέστε το component στο overlay σας. Παρέχει στο ServiceAccount δικαιώματα `get`, `list` και `watch` σε Secrets και ορίζει `HEYM_K8S_CREDENTIALS=true` σε κάθε Deployment:

    components:
      - ../../components/kubernetes-credentials

Το RBAC των Secrets δεν μπορεί να περιοριστεί βάσει ετικέτας. Επομένως, το Heym μπορεί να διαβάσει κάθε Secret στο παρακολουθούμενο namespace. Εκτελέστε το Heym στο δικό του namespace ή ορίστε το `HEYM_K8S_CREDENTIALS_NAMESPACE` σε ένα namespace που περιέχει μόνο credentials του Heym. Η εκκίνηση απορρίπτεται εάν οποιαδήποτε από τις μεταβλητές `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` ή `HEYM_MCP_STDIO_SANDBOX` έχει οριστεί σε `subprocess`, καθώς ο κώδικας χρήστη θα εκτελούνταν δίπλα στο διακριτικό του ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Όνομα credential που εμφανίζεται στο Heym
        heym.run/type: custom                   # Ένας τύπος credential
        heym.run/owner: admin@example.com       # Υπάρχων χρήστης
        heym.run/share-users: alice@example.com # Προαιρετικά email διαχωρισμένα με κόμμα
        heym.run/share-teams: automation        # Προαιρετικά ονόματα ομάδων διαχωρισμένα με κόμμα
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Κάθε κλειδί δεδομένων είναι ένα πεδίο διαμόρφωσης. Για έναν τύπο με ένθετα πεδία ή πεδία που δεν είναι συμβολοσειρές, τοποθετήστε ολόκληρη τη διαμόρφωση ως JSON κάτω από ένα μοναδικό κλειδί `config.json`. Οι τύποι που αποθηκεύουν ανανεωμένα διακριτικά OAuth (Codex, Google, BigQuery και Linear ή Notion σε λειτουργία OAuth) δεν μπορούν να είναι μόνο για ανάγνωση και απορρίπτονται.

Με τον External Secrets Operator, τοποθετήστε την ετικέτα και τα annotations στο πρότυπο προορισμού:

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

Τι να περιμένετε:

- **Ένα pod μπορεί να είναι Ready πριν συγχρονιστεί.** Η εκκίνηση δεν περιμένει τον API server, διατηρώντας το UI προσβάσιμο χωρίς αυτόν. Μέχρι να συγχρονιστεί μια διεργασία, δεν αναλαμβάνει εκτελέσεις στην ουρά. Μια εκτέλεση που χρησιμοποιεί ένα από αυτά τα credentials αποτυγχάνει με `not synced from Kubernetes yet` πριν από την εκτέλεση οποιουδήποτε κόμβου. Οι Ρυθμίσεις → Kubernetes (καρτέλα διαχειριστή που εμφανίζεται μόνο όταν το `HEYM_K8S_CREDENTIALS` είναι ενεργό) και οι Ρυθμίσεις → Instances εμφανίζουν την κατάσταση συγχρονισμού. Επομένως, μην δημιουργείτε health checks που υποθέτουν ότι το Ready σημαίνει συγχρονισμένο.
- **Ένα διαγραμμένο Secret καθιστά το credential μη διαθέσιμο**, διατηρώντας το ID και τις κοινοποιήσεις του. Η εκ νέου δημιουργία του Secret (GitOps prune και επανεφαρμογή) το επαναφέρει για κάθε workflow. Οι γραμμές δεν καταργούνται ποτέ αυτόματα. Ένας διαχειριστής τις καταργεί από τις Ρυθμίσεις → Kubernetes.
- **Για έναν κάτοχο που δεν έχει συνδεθεί ακόμα**, γίνεται επανάληψη κάθε πέντε λεπτά.
- **Ένα credential χρήστη με το ίδιο όνομα και κάτοχο** δεν αντικαθίσταται ποτέ. Το Secret αναφέρεται ως διένεξη.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

Το OVN-Kubernetes αξιολογεί την πολιτική egress μετά τη μετάφραση της υπηρεσίας DNS Service σε ένα pod DNS, και τα pods DNS του OpenShift ακούν στη θύρα 5353 και όχι στην 53. Με τη βασική πολιτική, τα δικτυωμένα sandboxes φτάνουν στο διαδίκτυο μέσω IP αλλά κάθε αναζήτηση ονόματος λήγει λόγω χρονικού ορίου. Το overlay αλλάζει μόνο αυτόν τον κανόνα:

- Επιτρέπει UDP και TCP στη θύρα 5353 (θύρα των pods DNS) και όχι στην 53 του Service.
- Επιλέγει το DNS namespace μέσω του `kubernetes.io/metadata.name: openshift-dns`. Το `network.openshift.io/policy-group: dns` δεν έχει οριστεί σε κάθε cluster.
- Ο δημόσιος κανόνας `ipBlock` συνεχίζει να αποκλείει ιδιωτικές, link-local και CGNAT περιοχές.

## Cilium με αντικατάσταση του kube-proxy

Η βασική διαμόρφωση δεν παρέχει πολιτική egress στο pod του backend. Εάν προσθέσετε μία, ένα απλό `ipBlock` δεν μπορεί να επιτρέψει τον API server: η διεύθυνση του Service ξαναγράφεται στη θύρα `:6443` ενός κόμβου πριν από την εφαρμογή της πολιτικής, και αυτή η διεύθυνση φέρει την ταυτότητα `kube-apiserver` του Cilium. Επιτρέψτε το με ένα `CiliumNetworkPolicy`. Επιλέγει επίσης workers, οι οποίοι εκκινούν επίσης pods sandbox (βλ. Κατανομή φορτίου):

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

## Προγραμματισμός (Scheduling)

Το `HEYM_SANDBOX_K8S_POD_OVERRIDES` δέχεται JSON με `nodeSelector`, `tolerations`, `runtimeClassName` (για παράδειγμα gVisor), `imagePullSecrets` και `priorityClassName`. Τίποτα άλλο δεν γίνεται αποδεκτό.

## Κατανομή φορτίου

Οι workers είναι πρόσθετα Deployments της ίδιας εικόνας με `HEYM_INSTANCE_ROLE=worker`, τις ίδιες τιμές `SECRET_KEY` και `ENCRYPTION_KEY`, και το ServiceAccount `heym-backend`, ώστε να μπορούν επίσης να εκκινούν pods sandbox. Ένας worker εκτελεί τον κόμβο Code, επομένως χρειάζεται τόμο στον κατάλογο χώρου εργασίας για τις εξαρτήσεις του κόμβου Code: ένας δικός του τόμος `ReadWriteOnce` επαρκεί, καθώς αυτοί οι κατάλογοι διατηρούνται μόνο για μία εκτέλεση. Το `overlays/orbstack-cluster` προσθέτει έναν worker. Το `scripts/k8s-cluster-smoke.sh` ελέγχει ότι οι εκτελέσεις στην ουρά κατευθύνονται σε αυτόν και ότι τα pods sandbox ανήκουν στον εν λόγω worker.

Εκκινήστε τους workers απευθείας με το uvicorn, όπως κάνει το `overlays/orbstack-cluster/worker.yaml`. Το σημείο εισόδου της εικόνας εκτελεί μεταναστεύσεις βάσης δεδομένων, οι οποίες ανήκουν στην κύρια εγκατάσταση (main). Δώστε σε κάθε worker ένα μοναδικό, σταθερό `HEYM_INSTANCE_ID`. Το όνομα ενός pod StatefulSet λειτουργεί ιδανικά. Οι εκτελέσεις στην ουρά για έναν worker που σταματά μεταφέρονται σε άλλη παρουσία από τον ηγέτη (leader).

## Τοπικός έλεγχος στο OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Για την κύρια παρουσία συν έναν worker, εφαρμόστε αντ' αυτού το `overlays/orbstack-cluster` και εκτελέστε το `./scripts/k8s-cluster-smoke.sh`.

## Σχετικά θέματα

- [Παραδείγματα manifest και README πηγαίου κώδικα](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Εκτέλεση και ανάπτυξη](./running-and-deployment.md)
- [Κατανομή φορτίου](../reference/cluster.md)
