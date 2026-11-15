# Heym op Kubernetes

Implementeer Heym op Kubernetes zonder Docker-socket. Voer elke sandbox uit als een eigen pod, met handleidingen voor opslag, netwerken en workers.

Voorbeeldmanifesten voor het uitvoeren van Heym zonder Docker-socket. Elke sandbox (Python-tools, skills, de Code-node, bestandsanalyse, Playwright, MCP stdio, Codex, OpenCode) draait als een eigen pod via de Kubernetes-API.

## Vereisten

- Kubernetes 1.30 of nieuwer (de stdin van de sandbox gebruikt het `v5.channel.k8s.io`-koppelingsprotocol).
- Een CNI dat NetworkPolicy afdwingt. Heym controleert dit vóór de eerste offline sandbox en weigert offline sandboxes uit te voeren wanneer een test-pod nog verbinding kan maken.
- Een `podPidsLimit` op de kubelet. Pods hebben geen PID-limietveld per pod; dit is dus de enige bescherming tegen fork-bombs naast geheugen, CPU en de tijdslimiet. Heym kan dit niet controleren: `/sys/fs/cgroup/pids.max` van een container behoort tot zijn eigen cgroup, niet die van de pod. Talos wordt standaard zonder deze limiet geleverd.

## Installatie

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) is een community-chart onderhouden door Alexey Masolov en gepubliceerd op [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), met platformpresets voor OpenShift, EKS, AKS en GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Opslag (Storage)

`heym-data` bevat Drive-bestanden, plugins en de Codex/OpenCode-werkruimten. Sandbox-pods koppelen per run één `subPath` hiervan. Met `ReadWriteMany` kunnen ze op elk knooppunt draaien. Met `ReadWriteOnce` zijn ze gekoppeld aan het knooppunt van de backend. `ReadWriteOncePod` werkt niet.

## Aangepaste CA-bundels

Koppel uw CA-bundel aan de backend-pod en verwijs `SSL_CERT_FILE` (of `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) ernaar. Heym kopieert het bestand naar `codex-workspaces/_ca/` op de claim en koppelt die kopie als alleen-lezen op hetzelfde pad in elke sandbox die de variabele ontvangt. Met een `ReadWriteOnce`-claim draaien die sandboxes op het knooppunt van de backend.

Een CA opent het netwerk niet. Sandbox-egress bereikt uitsluitend openbare adressen; een interne pakket-mirror, proxy of interne API heeft daarom een eigen regel nodig, bijvoorbeeld:

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

## Een speciale sandbox-namespace

Stel `HEYM_SANDBOX_K8S_NAMESPACE` in om sandboxes elders uit te voeren, voorzie die namespace van het label `pod-security.kubernetes.io/enforce: restricted`, verplaats de Role daarheen en behoud in de namespace van Heym een Role die `get` verleent op `pods`. Werkruimtesandboxes hebben dan een claim met de naam `heym-data` nodig in de sandbox-namespace, gekoppeld aan dezelfde RWX-share (een tweede, statisch ingericht PersistentVolume).

## Credentials uit Kubernetes Secrets

Een Secret met het label `heym.run/credential: "true"` wordt een alleen-lezen credential. Waarden blijven in het geheugen van elk proces en bereiken nooit de database of de back-ups ervan; het wijzigen van het Secret roteert het credential zonder herstart. Alles wat een Secret schrijft werkt: External Secrets Operator, SealedSecrets, SOPS via Flux of Argo CD, of `kubectl`.

Voeg het component toe aan uw overlay. Het verleent de ServiceAccount de rechten `get`, `list` en `watch` op Secrets en stelt `HEYM_K8S_CREDENTIALS=true` in op elk Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC voor Secrets kan niet per label worden beperkt; Heym kan dus elk Secret in de bewaakte namespace lezen. Voer Heym uit in een eigen namespace, of stel `HEYM_K8S_CREDENTIALS_NAMESPACE` in op een namespace die uitsluitend Heym-credentials bevat. Het opstarten weigert als een van de variabelen `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` of `HEYM_MCP_STDIO_SANDBOX` is ingesteld op `subprocess`, omdat gebruikerscode dan naast het ServiceAccount-token zou worden uitgevoerd.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # In Heym getoonde credential-naam
        heym.run/type: custom                   # Een credential-type
        heym.run/owner: admin@example.com       # Een bestaande gebruiker
        heym.run/share-users: alice@example.com # Optionele, door komma's gescheiden e-mails
        heym.run/share-teams: automation        # Optionele, door komma's gescheiden teamnamen
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Elke datasleutel is een configuratieveld. Voor een type met geneste velden of niet-tekenreeksvelden plaatst u de volledige configuratie als JSON onder één `config.json`-sleutel. Typen die vernieuwde OAuth-tokens opslaan (Codex, Google, BigQuery, en Linear of Notion in OAuth-modus) kunnen niet alleen-lezen zijn en worden geweigerd.

Plaats bij External Secrets Operator het label en de annotaties op de doelsjabloon:

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

Wat u kunt verwachten:

- **Een pod kan Ready zijn voordat deze gesynchroniseerd is.** Het opstarten wacht niet op de API-server, waardoor de gebruikersinterface zonder deze server actief blijft. Totdat een proces is gesynchroniseerd, verwerkt het geen taken in de wachtrij; een run die een van deze credentials gebruikt, mislukt met `not synced from Kubernetes yet` voordat er een node wordt uitgevoerd. Instellingen → Kubernetes (een beheerders tabblad dat alleen verschijnt als `HEYM_K8S_CREDENTIALS` is ingeschakeld) en Instellingen → Instanties tonen de synchronisatiestatus; bouw daarom geen statuscontrole die ervan uitgaat dat Ready gesynchroniseerd betekent.
- **Een verwijderd Secret maakt het credential onbeschikbaar**, met behoud van ID en shares; het opnieuw aanmaken van het Secret (een GitOps-opschoning en herhaling) herstelt het voor elke workflow. Rijen worden nooit automatisch verwijderd; een beheerder verwijdert ze via Instellingen → Kubernetes.
- **Voor een eigenaar die zich nog niet heeft aangemeld**, wordt dit elke vijf minuten opnieuw geprobeerd.
- **Een gebruikerscredential met dezelfde naam en eigenaar** wordt nooit overgenomen; het Secret wordt in plaats daarvan gemeld als een conflict.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes evalueert het egress-beleid nadat de DNS-service is vertaald naar een DNS-pod, en de DNS-pods van OpenShift luisteren op poort 5353, niet op 53. Met het basisbeleid bereiken met het netwerk verbonden sandboxes het internet via IP, maar elke naamresolutie resulteert in een time-out. De overlay wijzigt alleen die regel:

- Het staat UDP en TCP toe op poort 5353, de poort van de DNS-pods, in plaats van poort 53 van de Service.
- Het selecteert de DNS-namespace via `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` is niet op elk cluster ingesteld.
- De openbare `ipBlock`-regel blijft privé-, link-lokale en CGNAT-bereiken uitsluiten.

## Cilium met kube-proxy-vervanging

De basis biedt de backend-pod geen egress-beleid. Als u er een toevoegt, kan een eenvoudige `ipBlock` de API-server niet toestaan: het Service-adres wordt herschreven naar poort `:6443` van een knooppunt voordat het beleid wordt toegepast, en dat adres draagt de identiteit `kube-apiserver` van Cilium. Sta dit toe met een `CiliumNetworkPolicy`. Hiermee worden ook workers geselecteerd, die eveneens sandbox-pods starten (zie Lastverdeling):

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

## Planning (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` accepteert JSON met `nodeSelector`, `tolerations`, `runtimeClassName` (bijvoorbeeld gVisor), `imagePullSecrets` en `priorityClassName`. Niets anders wordt geaccepteerd.

## Lastverdeling

Workers zijn extra Deployments van dezelfde image met `HEYM_INSTANCE_ROLE=worker`, dezelfde waarden voor `SECRET_KEY` en `ENCRYPTION_KEY`, en de `heym-backend`-ServiceAccount, zodat zij ook sandbox-pods kunnen starten. Een worker voert de Code-node uit en heeft daarom een claim nodig in de werkruimtemap voor afhankelijkheden van de Code-node: een eigen `ReadWriteOnce`-claim is voldoende, omdat die mappen slechts gedurende één run bestaan. `overlays/orbstack-cluster` voegt één worker toe; `scripts/k8s-cluster-smoke.sh` controleert of runs in de wachtrij daarop terechtkomen en of de sandbox-pods van de worker zijn.

Start workers rechtstreeks met uvicorn, zoals gedefinieerd in `overlays/orbstack-cluster/worker.yaml`. Het startpunt van de image voert databasemigraties uit, en die behoren toe aan main. Geef elke worker een unieke, stabiele `HEYM_INSTANCE_ID`; een StatefulSet-podnaam werkt hiervoor uitstekend. Runs in de wachtrij voor een worker die stopt, worden door de leider naar een andere instantie verplaatst.

## Lokale test op OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Voor main plus een worker past u in plaats daarvan `overlays/orbstack-cluster` toe en voert u `./scripts/k8s-cluster-smoke.sh` uit.

## Gerelateerd

- [Voorbeeldmanifesten en bron-README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Beheer & Implementatie](./running-and-deployment.md)
- [Lastverdeling](../reference/cluster.md)
