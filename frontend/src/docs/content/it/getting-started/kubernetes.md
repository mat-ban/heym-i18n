# Heym su Kubernetes

Esegua il deployment di Heym su Kubernetes senza socket Docker. Esegua ogni sandbox come proprio pod, con guide per archiviazione, rete e worker.

Manifest di esempio per eseguire Heym senza socket Docker. Ogni sandbox (strumenti Python, skills, il nodo Code, analisi dei file, Playwright, MCP stdio, Codex, OpenCode) viene eseguita come pod dedicato tramite l'API di Kubernetes.

## Requisiti

- Kubernetes 1.30 o versioni successive (lo stdin della sandbox utilizza il protocollo di associazione `v5.channel.k8s.io`).
- Un CNI che applichi le NetworkPolicy. Heym verifica questo requisito prima della prima sandbox offline e rifiuta l'esecuzione di sandbox offline qualora un pod di test sia ancora in grado di connettersi.
- Un valore `podPidsLimit` nel kubelet. I pod non dispongono di un campo per il limite di PID per singolo pod; pertanto questo rappresenta l'unica protezione da fork-bomb oltre a memoria, CPU e limite temporale. Heym non può verificarlo: `/sys/fs/cgroup/pids.max` di un container fa riferimento al proprio cgroup e non a quello del pod. Talos viene distribuito senza questo limite predefinito.

## Installazione

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) è un chart della community mantenuto da Alexey Masolov e pubblicato su [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), con preconfigurazioni per piattaforme quali OpenShift, EKS, AKS e GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Archiviazione (Storage)

`heym-data` archivia i file di Drive, i plugin e gli spazi di lavoro di Codex/OpenCode. I pod di sandbox montano un `subPath` di questo volume per ogni esecuzione. Con `ReadWriteMany` possono essere eseguiti su qualsiasi nodo. Con `ReadWriteOnce` sono vincolati al nodo del backend. `ReadWriteOncePod` non è supportato.

## Pacchetti di CA personalizzati

Monti il proprio bundle CA nel pod di backend e imposti `SSL_CERT_FILE` (o `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) su di esso. Heym copia il file in `codex-workspaces/_ca/` sul volume claim e monta tale copia in sola lettura nello stesso percorso all'interno di ogni sandbox che riceve la variabile. Con un claim `ReadWriteOnce`, queste sandbox vengono eseguite sul nodo del backend.

Una CA non sblocca la rete. L'egress della sandbox raggiunge unicamente indirizzi pubblici; pertanto, un mirror di pacchetti interno, un proxy o una API interna necessita di una regola dedicata, ad esempio:

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

## Un namespace dedicato per le sandbox

Imposti `HEYM_SANDBOX_K8S_NAMESPACE` per eseguire le sandbox in un altro namespace, etichetti tale namespace con `pod-security.kubernetes.io/enforce: restricted`, sposti il Role in quest'ultimo e mantenga nel namespace di Heym un Role che conceda `get` sui `pods`. Le sandbox degli spazi di lavoro necessiteranno quindi di un claim denominato `heym-data` nel namespace della sandbox associato alla medesima condivisione RWX (un secondo PersistentVolume fornito staticamente).

## Credentials da Kubernetes Secrets

Un Secret con etichetta `heym.run/credential: "true"` diventa un credential di sola lettura. I valori risiedono nella memoria di ciascun processo e non raggiungono mai il database né i suoi backup; la modifica del Secret ruota il credential senza riavvio. Qualsiasi strumento che scriva un Secret è supportato: External Secrets Operator, SealedSecrets, SOPS tramite Flux o Argo CD oppure `kubectl`.

Aggiunga il componente al Suo overlay. Esso concede al ServiceAccount i permessi `get`, `list` e `watch` sui Secrets e imposta `HEYM_K8S_CREDENTIALS=true` su ogni Deployment:

    components:
      - ../../components/kubernetes-credentials

L'RBAC dei Secrets non può essere filtrato per etichetta; pertanto, Heym può leggere ogni Secret presente nel namespace monitorato. Esegua Heym in un namespace dedicato o imposti `HEYM_K8S_CREDENTIALS_NAMESPACE` su uno contenente esclusivamente credentials di Heym. L'avvio viene rifiutato se una qualsiasi tra `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` o `HEYM_MCP_STDIO_SANDBOX` è impostata su `subprocess`, poiché il codice utente verrebbe eseguito a ridosso del token del ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nome del credential mostrato in Heym
        heym.run/type: custom                   # Un tipo di credential
        heym.run/owner: admin@example.com       # Un utente esistente
        heym.run/share-users: alice@example.com # E-mail opzionali separate da virgola
        heym.run/share-teams: automation        # Nomi dei team opzionali separati da virgola
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Ogni chiave di dati rappresenta un campo di configurazione. Per un tipo con campi nidificati o non testuali, inserisca l'intera configurazione come JSON sotto un'unica chiave `config.json`. I tipi che memorizzano token OAuth aggiornati (Codex, Google, BigQuery, e Linear o Notion in modalità OAuth) non possono essere in sola lettura e vengono rifiutati.

Con External Secrets Operator, inserisca l'etichetta e le annotazioni nel template di destinazione:

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

Cosa aspettarsi:

- **Un pod può essere Ready prima di essere sincronizzato.** L'avvio non attende l'API server, consentendo alla UI di rimanere accessibile. Fino a quando un processo non è sincronizzato non richiede esecuzioni in coda; un'esecuzione che utilizza uno di questi credentials fallisce con `not synced from Kubernetes yet` prima dell'esecuzione di qualsiasi nodo. Impostazioni → Kubernetes (una scheda di amministrazione visibile unicamente se `HEYM_K8S_CREDENTIALS` è attivo) e Impostazioni → Istanze mostrano lo stato di sincronizzazione; pertanto non progetti health check che presumano che Ready equivalga a sincronizzato.
- **Un Secret eliminato rende il rispettivo credential non disponibile**, conservandone ID e condivisioni; la ricreazione del Secret (eliminazione GitOps e nuova applicazione) lo ripristina per ogni workflow. Le righe non vengono mai eliminate automaticamente; un amministratore può rimuoverle da Impostazioni → Kubernetes.
- **Un proprietario che non ha ancora eseguito l'accesso** viene riprovato ogni cinque minuti.
- **Un credential utente con il medesimo nome e proprietario** non viene mai sovrascritto; il Secret viene invece segnalato come conflitto.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes valuta la policy di egress dopo che il Service DNS è stato risolto verso un pod DNS, e i pod DNS di OpenShift sono in ascolto sulla porta 5353, non 53. Con la policy di base, le sandbox connesse alla rete raggiungono Internet tramite IP ma qualsiasi risoluzione dei nomi va in timeout. L'overlay modifica unicamente questa regola:

- Consente UDP e TCP sulla porta 5353, la porta dei pod DNS, invece della porta 53 del Service.
- Seleziona il namespace DNS tramite `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` non è impostato su tutti i cluster.
- La regola pubblica `ipBlock` continua a escludere gli intervalli privati, link-local e CGNAT.

## Cilium con sostituzione di kube-proxy

La configurazione di base non applica alcuna policy di egress al pod di backend. Se ne aggiunge una, un semplice `ipBlock` non è in grado di autorizzare l'API server: l'indirizzo del Service viene riscritto sulla porta `:6443` di un nodo prima dell'applicazione della policy, e tale indirizzo veicola l'identità `kube-apiserver` di Cilium. Lo consenta tramite una `CiliumNetworkPolicy`. Questa seleziona anche i worker, che avviano a loro volta pod di sandbox (vedere Distribuzione del carico):

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

## Pianificazione (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` accetta un JSON con `nodeSelector`, `tolerations`, `runtimeClassName` (ad esempio gVisor), `imagePullSecrets` e `priorityClassName`. Nessun altro parametro è ammesso.

## Distribuzione del carico

I worker sono Deployment aggiuntivi della medesima immagine con `HEYM_INSTANCE_ROLE=worker`, i medesimi valori di `SECRET_KEY` ed `ENCRYPTION_KEY`, nonché il ServiceAccount `heym-backend`, consentendo loro di avviare anch'essi pod di sandbox. Un worker esegue il nodo Code e necessita pertanto di un claim nella directory di lavoro per le dipendenze del nodo Code: un proprio claim `ReadWriteOnce` è sufficiente, poiché tali directory risiedono unicamente per la durata di un'esecuzione. `overlays/orbstack-cluster` aggiunge un worker; `scripts/k8s-cluster-smoke.sh` verifica che le esecuzioni in coda vengano instradate su di esso e che i relativi pod di sandbox appartengano al worker.

Avvii i worker direttamente con uvicorn, come configurato in `overlays/orbstack-cluster/worker.yaml`. L'entrypoint dell'immagine esegue le migrazioni del database, che spettano all'istanza principale (main). Assegni a ciascun worker un `HEYM_INSTANCE_ID` univoco e stabile; il nome di un pod di uno StatefulSet è ideale. Le esecuzioni in coda per un worker che si arresta vengono riassegnate a un'altra istanza dal leader.

## Test locale su OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Per l'istanza principale assieme a un worker, applichi invece `overlays/orbstack-cluster` ed esegua `./scripts/k8s-cluster-smoke.sh`.

## Riferimenti correlati

- [Manifest di esempio e README del codice sorgente](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Esecuzione & Deployment](./running-and-deployment.md)
- [Distribuzione del carico](../reference/cluster.md)
