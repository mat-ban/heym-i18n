# Heym auf Kubernetes

Deployen Sie Heym auf Kubernetes ohne Docker-Socket. Führen Sie jede Sandbox als eigenen Pod aus, mit Anleitungen für Speicher, Netzwerke und Worker.

Beispiel-Manifeste für den Betrieb von Heym ohne Docker-Socket. Jede Sandbox (Python-Tools, Skills, der Code-Knoten, Dateianalyse, Playwright, MCP stdio, Codex, OpenCode) läuft über die Kubernetes-API als eigener Pod.

## Anforderungen

- Kubernetes 1.30 oder neuer (Sandbox-stdin nutzt das `v5.channel.k8s.io`-Attach-Protokoll).
- Ein CNI, das NetworkPolicy durchsetzt. Heym prüft dies vor der ersten Offline-Sandbox und verweigert die Ausführung von Offline-Sandboxes, wenn ein Test-Pod weiterhin Verbindungen aufbauen kann.
- Ein Kubelet-`podPidsLimit`. Pods besitzen kein feldbezogenes PID-Limit pro Pod; dies ist daher der einzige Fork-Bomb-Schutz neben Arbeitsspeicher, CPU und dem Ausführungs-Deadline. Heym kann dies nicht prüfen: `/sys/fs/cgroup/pids.max` eines Containers gehört zu dessen eigenem Cgroup, nicht zu dem des Pods. Talos wird standardmäßig ohne dieses Limit ausgeliefert.

## Installation

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) ist ein Community-Chart, gepflegt von Alexey Masolov und veröffentlicht auf [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), mit Plattform-Presets für OpenShift, EKS, AKS und GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Speicher

`heym-data` speichert Drive-Dateien, Plugins und die Codex/OpenCode-Arbeitsbereiche. Sandbox-Pods mounten pro Durchlauf einen `subPath` davon. Mit `ReadWriteMany` können sie auf jedem Node ausgeführt werden. Mit `ReadWriteOnce` sind sie an den Node des Backends gebunden. `ReadWriteOncePod` funktioniert nicht.

## Eigene CA-Zertifikatsbündel

Mounten Sie Ihr CA-Bündel in den Backend-Pod und verweisen Sie mit `SSL_CERT_FILE` (oder `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) darauf. Heym kopiert die Datei nach `codex-workspaces/_ca/` auf dem Volume-Claim und mountet diese Kopie schreibgeschützt unter demselben Pfad in jede Sandbox, die diese Variable empfängt. Bei einem `ReadWriteOnce`-Claim laufen diese Sandboxes auf dem Node des Backends.

Eine CA öffnet nicht das Netzwerk. Sandbox-Egress erreicht standardmäßig ausschließlich öffentliche Adressen; ein interner Paket-Mirror, Proxy oder eine interne API benötigt daher eine eigene Regel, zum Beispiel:

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

## Ein dedizierter Sandbox-Namespace

Setzen Sie `HEYM_SANDBOX_K8S_NAMESPACE`, um Sandboxes in einem separaten Namespace auszuführen, versehen Sie diesen Namespace mit dem Label `pod-security.kubernetes.io/enforce: restricted`, verschieben Sie die Role dorthin und behalten Sie im Heym-Namespace eine Role, die `get` für `pods` gewährt. Workspace-Sandboxes benötigen dann einen Claim namens `heym-data` im Sandbox-Namespace, der an denselben RWX-Share gebunden ist (ein zweites, statisch bereitgestelltes PersistentVolume).

## Credentials aus Kubernetes Secrets

Ein Secret mit dem Label `heym.run/credential: "true"` wird zu einem schreibgeschützten Credential. Werte verbleiben im Arbeitsspeicher des jeweiligen Prozesses und gelangen niemals in die Datenbank oder deren Backups. Eine Änderung des Secrets rotiert das Credential ohne Neustart. Jedes Werkzeug, das Secrets schreibt, wird unterstützt: External Secrets Operator, SealedSecrets, SOPS über Flux oder Argo CD oder `kubectl`.

Fügen Sie die Komponente Ihrem Overlay hinzu. Sie gewährt dem ServiceAccount `get`, `list` und `watch` auf Secrets und setzt `HEYM_K8S_CREDENTIALS=true` auf jedem Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC für Secrets kann nicht nach Labels eingeschränkt werden; Heym kann daher jedes Secret im überwachten Namespace lesen. Führen Sie Heym in einem eigenen Namespace aus oder setzen Sie `HEYM_K8S_CREDENTIALS_NAMESPACE` auf einen Namespace, der ausschließlich Heym-Credentials enthält. Der Start verweigert den Dienst, solange eine der Variablen `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` oder `HEYM_MCP_STDIO_SANDBOX` auf `subprocess` gesetzt ist, da Benutzercode sonst neben dem ServiceAccount-Token ausgeführt würde.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # In Heym angezeigter Credential-Name
        heym.run/type: custom                   # Ein Credential-Typ
        heym.run/owner: admin@example.com       # Ein bestehender Benutzer
        heym.run/share-users: alice@example.com # Optional, kommagetrennte E-Mails
        heym.run/share-teams: automation        # Optional, kommagetrennte Teamnamen
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Jeder Datenschlüssel entspricht einem Konfigurationsfeld. Bei einem Typ mit verschachtelten Feldern oder Nicht-String-Feldern hinterlegen Sie stattdessen die gesamte Konfiguration als JSON unter einem einzelnen `config.json`-Schlüssel. Typen, die aktualisierte OAuth-Token speichern (Codex, Google, BigQuery sowie Linear oder Notion im OAuth-Modus), können nicht schreibgeschützt sein und werden abgelehnt.

Beim External Secrets Operator hinterlegen Sie Label und Annotationen im Ziel-Template:

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

Verhaltenserwartungen:

- **Ein Pod kann Ready sein, bevor er synchronisiert ist.** Der Start wartet nicht auf den API-Server, sodass die UI auch ohne ihn erreichbar bleibt. Bis ein Prozess synchronisiert ist, beansprucht er keine Durchläufe in der Warteschlange. Ein Durchlauf, der eines dieser Credentials verwendet, schlägt vor der Ausführung eines Knotens mit `not synced from Kubernetes yet` fehl. Einstellungen → Kubernetes (ein Admin-Reiter, der nur angezeigt wird, wenn `HEYM_K8S_CREDENTIALS` aktiv ist) und Einstellungen → Instanzen zeigen den Synchronisierungsstatus an; erstellen Sie daher keinen Healthcheck, der annimmt, dass Ready bereits synchronisiert bedeutet.
- **Ein gelöschtes Secret macht das Credential nicht verfügbar**, behält jedoch ID und Freigaben bei. Das erneute Erstellen des Secrets (GitOps Prune und Re-Apply) stellt es daher für jeden Workflow wieder her. Zeilen werden niemals automatisch entfernt; ein Administrator entfernt sie unter Einstellungen → Kubernetes.
- **Für einen Eigentümer, der sich noch nicht angemeldet hat**, wird der Vorgang alle fünf Minuten wiederholt.
- **Ein Benutzer-Credential mit identischem Namen und Eigentümer** wird niemals überschrieben; das Secret wird stattdessen als Konflikt gemeldet.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes wertet Egress-Policies aus, nachdem der DNS-Service in einen DNS-Pod aufgelöst wurde, und die DNS-Pods von OpenShift lauschen auf Port 5353, nicht 53. Mit der Standard-Policy erreichen vernetzte Sandboxes das Internet zwar per IP, jede Namensauflösung läuft jedoch in einen Timeout. Das Overlay passt ausschließlich diese Regel an:

- Es erlaubt UDP und TCP 5353, den Port der DNS-Pods, statt Port 53 des Service.
- Es selektiert den DNS-Namespace über `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` ist nicht auf jedem Cluster gesetzt.
- Die öffentliche `ipBlock`-Regel schließt weiterhin private, link-lokale und CGNAT-Adressbereiche aus.

## Cilium mit kube-proxy-Ersatz

Die Basis definiert keine Egress-Policy für den Backend-Pod. Wenn Sie eine hinzufügen, kann ein einfacher `ipBlock` den API-Server nicht freigeben: Die Service-Adresse wird vor der Policy-Auswertung auf `:6443` eines Nodes umgeschrieben und trägt Ciliums `kube-apiserver`-Identität. Erlauben Sie dies mit einer `CiliumNetworkPolicy`. Diese wählt auch Worker aus, die ebenfalls Sandbox-Pods starten (siehe Lastverteilung):

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

## Scheduling

`HEYM_SANDBOX_K8S_POD_OVERRIDES` akzeptiert JSON mit `nodeSelector`, `tolerations`, `runtimeClassName` (z. B. gVisor), `imagePullSecrets` und `priorityClassName`. Andere Felder werden abgelehnt.

## Lastverteilung

Worker sind zusätzliche Deployments desselben Images mit `HEYM_INSTANCE_ROLE=worker`, denselben Werten für `SECRET_KEY` und `ENCRYPTION_KEY` sowie dem `heym-backend`-ServiceAccount, sodass auch sie Sandbox-Pods starten können. Ein Worker führt den Code-Knoten aus und benötigt daher einen Claim im Workspace-Verzeichnis für Abhängigkeiten des Code-Knotens: Ein eigener `ReadWriteOnce`-Claim reicht aus, da diese Verzeichnisse nur für einen Durchlauf existieren. `overlays/orbstack-cluster` fügt einen Worker hinzu; `scripts/k8s-cluster-smoke.sh` prüft, ob Durchläufe aus der Warteschlange dort ankommen und deren Sandbox-Pods dem Worker zugeordnet sind.

Starten Sie Worker direkt mit uvicorn, wie in `overlays/orbstack-cluster/worker.yaml` definiert. Der Image-Entrypoint führt Datenbankmigrationen aus, und diese obliegen der Main-Instanz. Vergeben Sie für jeden Worker eine eindeutige, stabile `HEYM_INSTANCE_ID`; der Name eines StatefulSet-Pods eignet sich hierfür. Durchläufe, die für einen gestoppten Worker eingereiht sind, werden von der Leader-Instanz an eine andere Instanz übergeben.

## Lokaler Test auf OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Wenden Sie für Main plus einen Worker stattdessen `overlays/orbstack-cluster` an und führen Sie `./scripts/k8s-cluster-smoke.sh` aus.

## Verwandte Themen

- [Beispiel-Manifeste und Quellcode-README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Betrieb & Deployment](./running-and-deployment.md)
- [Lastverteilung](../reference/cluster.md)
