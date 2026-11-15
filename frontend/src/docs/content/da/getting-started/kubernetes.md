# Heym på Kubernetes

Udrul Heym på Kubernetes uden en Docker-socket. Kør hver sandbox som sin egen pod med vejledninger til lagring, netværk og workers.

Eksempelmanifestet til at køre Heym uden en Docker-socket. Hver sandbox (Python-værktøjer, skills, Code-noden, filanalyse, Playwright, MCP stdio, Codex, OpenCode) kører som sin egen pod via Kubernetes API.

## Krav

- Kubernetes 1.30 eller nyere (sandbox-stdin benytter tilknytningsprotokollen `v5.channel.k8s.io`).
- Et CNI, der håndhæver NetworkPolicy. Heym kontrollerer dette før den første offline-sandbox og afviser at køre offline-sandboxe, hvis en testpod stadig kan oprette forbindelse.
- En `podPidsLimit` på kubelet. Pods har intet felt til PID-grænse pr. pod; dette er derfor det eneste værn mod fork-bomber ud over hukommelse, CPU og tidsfrist. Heym kan ikke kontrollere dette: en containers `/sys/fs/cgroup/pids.max` tilhører dens egen cgroup, ikke poddens. Talos leveres som standard uden denne grænse.

## Installation

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) er et community-chart vedligeholdt af Alexey Masolov og udgivet på [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), med platformsforudindstillinger til OpenShift, EKS, AKS og GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Lagring (Storage)

`heym-data` opbevarer Drive-filer, plugins og Codex/OpenCode-arbejdsområder. Sandbox-pods monterer en `subPath` af denne diskenhed pr. kørsel. Med `ReadWriteMany` kan de køre på enhver node. Med `ReadWriteOnce` er de låst til backend-nodens node. `ReadWriteOncePod` understøttes ikke.

## Tilpassede CA-certifikatpakker

Monter din CA-pakke i backend-podden, og ret `SSL_CERT_FILE` (eller `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) mod den. Heym kopierer filen til `codex-workspaces/_ca/` på diskenhedskravet og monterer denne kopi som skrivebeskyttet på samme sti i enhver sandbox, der modtager variablen. Med et `ReadWriteOnce`-krav kører disse sandboxe på backend-nodens node.

En CA åbner ikke netværket. Sandbox-egress når udelukkende offentlige adresser; et internt pakkespejl, en proxy eller et internt API kræver derfor sin egen regel, for eksempel:

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

## Et dedikeret sandbox-namespace

Angiv `HEYM_SANDBOX_K8S_NAMESPACE` for at køre sandboxe i et andet namespace, mærk dette namespace med `pod-security.kubernetes.io/enforce: restricted`, flyt Role dertil, og behold i Heyms namespace en Role, der tildeler `get` på `pods`. Arbejdsområdets sandboxe kræver derefter et krav ved navn `heym-data` i sandbox-namespacet bundet til det samme RWX-share (en anden, statisk tildelt PersistentVolume).

## Credentials fra Kubernetes Secrets

Et Secret mærket med `heym.run/credential: "true"` bliver til et skrivebeskyttet credential. Værdier forbliver i hukommelsen for hver proces og når aldrig databasen eller dens sikkerhedskopier; ændring af Secret roterer credential uden genstart. Ethvert værktøj, der skriver et Secret, understøttes: External Secrets Operator, SealedSecrets, SOPS via Flux eller Argo CD, eller `kubectl`.

Føj komponenten til dit overlay. Den tildeler ServiceAccount rettighederne `get`, `list` og `watch` på Secrets og sætter `HEYM_K8S_CREDENTIALS=true` på hvert Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC for Secrets kan ikke indsnævres pr. etiket; Heym kan derfor læse ethvert Secret i det overvågede namespace. Kør Heym i sit eget namespace, eller indstil `HEYM_K8S_CREDENTIALS_NAMESPACE` til et namespace, der udelukkende indeholder Heym-credentials. Opstart afvises, hvis nogen af variablerne `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` eller `HEYM_MCP_STDIO_SANDBOX` er sat til `subprocess`, da brugerkode ville køre ved siden af ServiceAccount-tokenet.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Credential-navn vist i Heym
        heym.run/type: custom                   # En credential-type
        heym.run/owner: admin@example.com       # En eksisterende bruger
        heym.run/share-users: alice@example.com # Valgfri, kommaseparerede e-mails
        heym.run/share-teams: automation        # Valgfri, kommaseparerede teamnavne
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Hver datanøgle svarer til et konfigurationsfelt. For en type med indlejrede felter eller ikke-strengfelter placeres hele konfigurationen som JSON under en enkelt `config.json`-nøgle. Typer, der gemmer opdaterede OAuth-tokens (Codex, Google, BigQuery samt Linear eller Notion i OAuth-tilstand), kan ikke være skrivebeskyttede og afvises.

Med External Secrets Operator placeres etiketten og annoteringerne på målskabelonen:

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

Hvad man kan forvente:

- **En pod kan være Ready, før den er synkroniseret.** Opstart venter ikke på API-serveren, så brugergrænsefladen forbliver tilgængelig uden den. Indtil en proces er synkroniseret, påtager den sig ingen køede kørsler; en kørsel, der bruger et af disse credentials, mislykkes med `not synced from Kubernetes yet` før kørslen af nogen node. Indstillinger → Kubernetes (en administratorfane, der kun vises, når `HEYM_K8S_CREDENTIALS` er slået til) og Indstillinger → Instanser viser synkroniseringstilstanden; opbyg derfor ikke et sundhedstjek, der antager, at Ready betyder synkroniseret.
- **Et slettet Secret gør dets credential utilgængeligt**, idet dets ID og delinger bevares; genskabelse af Secret (GitOps-oprydning og genanvendelse) gendanner det for hvert workflow. Rækker fjernes aldrig automatisk; en administrator fjerner dem fra Indstillinger → Kubernetes.
- **For en ejer, der endnu ikke har logget ind**, gøres der nyt forsøg hvert femte minut.
- **Et brugercredential med samme navn og ejer** overskrives aldrig; Secret rapporteres i stedet som en konflikt.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes evaluerer egress-politikken, efter at DNS Service er oversat til en DNS-pod, og OpenShifts DNS-pods lytter på port 5353, ikke 53. Med basispolitikken når netværkstilsluttede sandboxe internettet via IP, men ethvert navneopslag timer ud. Overlayet ændrer udelukkende denne regel:

- Det tillader UDP og TCP 5353, DNS-poddenes port, i stedet for tjenestens 53.
- Det vælger DNS-namespace via `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` er ikke indstillet på alle klynger.
- Den offentlige `ipBlock`-regel fortsætter med at udelukke private, link-local og CGNAT-intervaller.

## Cilium med erstatning af kube-proxy

Basiskonfigurationen tildeler ikke backend-podden nogen egress-politik. Hvis der tilføjes en, kan en almindelig `ipBlock` ikke tillade API-serveren: Service-adressen omskrives til en nodes `:6443`, før politikken anvendes, og den adresse bærer Ciliums `kube-apiserver`-identitet. Tillad den med en `CiliumNetworkPolicy`. Den vælger også workers, som ligeledes starter sandbox-pods (se Belastningsfordeling):

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

## Tidsplanlægning (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` modtager JSON med `nodeSelector`, `tolerations`, `runtimeClassName` (for eksempel gVisor), `imagePullSecrets` og `priorityClassName`. Intet andet accepteres.

## Belastningsfordeling

Workers er yderligere Deployments af samme image med `HEYM_INSTANCE_ROLE=worker`, de samme værdier for `SECRET_KEY` og `ENCRYPTION_KEY`, samt `heym-backend` ServiceAccount, så de også kan starte sandbox-pods. En worker udfører Code-noden og har derfor brug for et diskenhedskrav i arbejdsområdekataloget til Code-nodens afhængigheder: et eget `ReadWriteOnce`-krav er tilstrækkeligt, da disse mapper kun eksisterer under en enkelt kørsel. `overlays/orbstack-cluster` tilføjer en worker; `scripts/k8s-cluster-smoke.sh` kontrollerer, at køede kørsler ender på den, og at deres sandbox-pods tilhører workeren.

Start workers direkte med uvicorn, som `overlays/orbstack-cluster/worker.yaml` gør det. Imagets entrypoint udfører databasemigreringer, og disse tilhører hovedinstansen (main). Tildel hver worker et unikt, stabilt `HEYM_INSTANCE_ID`; navnet på en pod i et StatefulSet fungerer glimrende. Kørsler i kø for en worker, der stopper, flyttes til en anden instans af lederen (leader).

## Lokal test på OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

For main plus en worker anvendes i stedet `overlays/orbstack-cluster` og kør `./scripts/k8s-cluster-smoke.sh`.

## Relaterede emner

- [Eksempelmanifest og kildekodedokumentation (README)](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Drift og udrulning](./running-and-deployment.md)
- [Belastningsfordeling](../reference/cluster.md)
