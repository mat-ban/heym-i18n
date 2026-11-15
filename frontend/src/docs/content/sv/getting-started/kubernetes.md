# Heym på Kubernetes

Distribuera Heym på Kubernetes utan en Docker-socket. Kör varje sandbox som en egen pod, med guider för lagring, nätverk och workers.

Exempelmanifest för att köra Heym utan en Docker-socket. Varje sandbox (Python-verktyg, skills, Code-noden, filanalys, Playwright, MCP stdio, Codex, OpenCode) körs som en egen pod via Kubernetes API.

## Krav

- Kubernetes 1.30 eller senare (sandbox-stdin använder anslutningsprotokollet `v5.channel.k8s.io`).
- Ett CNI som tillämpar NetworkPolicy. Heym kontrollerar detta före den första offline-sandboxen och vägrar köra offline-sandboxar om en testpod fortfarande kan ansluta.
- Ett `podPidsLimit` i kubelet. Poddar saknar fält för PID-gräns per pod; detta är därför det enda skyddet mot fork-bomber utöver minne, CPU och tidsgräns. Heym kan inte kontrollera detta: en containers `/sys/fs/cgroup/pids.max` tillhör dess egen cgroup, inte poddens. Talos levereras som standard utan denna gräns.

## Installation

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) är ett community-chart som underhålls av Alexey Masolov och publiceras på [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), med plattformsförinställningar för OpenShift, EKS, AKS och GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Lagring (Storage)

`heym-data` lagrar Drive-filer, insticksprogram och Codex/OpenCode-arbetsytor. Sandbox-poddar monterar en `subPath` av denna volym per körning. Med `ReadWriteMany` kan de köras på valfri nod. Med `ReadWriteOnce` är de låsta till backend-nodens nod. `ReadWriteOncePod` stöds inte.

## Anpassade CA-certifikatpaket

Montera CA-paketet i backend-podden och rikta `SSL_CERT_FILE` (eller `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) mot det. Heym kopierar filen till `codex-workspaces/_ca/` på volymanspråket och monterar kopian som skrivskyddad på samma sökväg i varje sandbox som tar emot variabeln. Med ett `ReadWriteOnce`-anspråk körs dessa sandboxar på backend-nodens nod.

En CA öppnar inte nätverket. Sandbox-egress når endast offentliga adresser; en intern paketspegel, proxy eller internt API kräver därför en egen regel, till exempel:

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

## En dedikerad sandbox-namespace

Ange `HEYM_SANDBOX_K8S_NAMESPACE` för att köra sandboxar i ett annat namespace, märk detta namespace med `pod-security.kubernetes.io/enforce: restricted`, flytta Role dit och behåll i Heyms namespace en Role som ger `get` för `pods`. Arbetsytans sandboxar kräver sedan ett anspråk med namnet `heym-data` i sandbox-namespacet bundet till samma RWX-resurs (en andra, statiskt tillhandahållen PersistentVolume).

## Credentials från Kubernetes Secrets

Ett Secret märkt med `heym.run/credential: "true"` blir ett skrivskyddat credential. Värden stannar i minnet för varje process och når aldrig databasen eller dess säkerhetskopior; ändring av Secret roterar credential utan omstart. Alla verktyg som skriver ett Secret stöds: External Secrets Operator, SealedSecrets, SOPS via Flux eller Argo CD, eller `kubectl`.

Lägg till komponenten i ditt overlay. Den ger ServiceAccount behörighet för `get`, `list` och `watch` på Secrets och sätter `HEYM_K8S_CREDENTIALS=true` på varje Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC för Secrets kan inte begränsas per etikett; Heym kan därför läsa varje Secret i det övervakade namespacet. Kör Heym i ett eget namespace eller ställ in `HEYM_K8S_CREDENTIALS_NAMESPACE` till ett namespace som endast innehåller Heym-credentials. Starten nekas om någon av variablerna `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` eller `HEYM_MCP_STDIO_SANDBOX` är satt till `subprocess`, eftersom användarkod då skulle köras bredvid ServiceAccount-tokenet.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Credential-namn som visas i Heym
        heym.run/type: custom                   # En credential-typ
        heym.run/owner: admin@example.com       # En befintlig användare
        heym.run/share-users: alice@example.com # Valfria, kommaseparerade e-postadresser
        heym.run/share-teams: automation        # Valfria, kommaseparerade teamnamn
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Varje datanyckel motsvarar ett konfigurationsfält. För en typ med kapslade fält eller icke-strängfält placeras hela konfigurationen som JSON under en enda `config.json`-nyckel. Typer som lagrar förnyade OAuth-tokens (Codex, Google, BigQuery samt Linear eller Notion i OAuth-läge) kan inte vara skrivskyddade och avvisas.

Med External Secrets Operator placeras etiketten och annoteringarna på målmallen:

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

Vad man kan förvänta sig:

- **En pod kan vara Ready innan den har synkroniserats.** Starten väntar inte på API-servern, så användargränssnittet förblir tillgängligt. Tills en process har synkroniserats tar den inte emot köade körningar; en körning som använder ett av dessa credentials misslyckas med `not synced from Kubernetes yet` innan någon nod körs. Inställningar → Kubernetes (en administratörsflik som endast visas när `HEYM_K8S_CREDENTIALS` är aktivt) och Inställningar → Instanser visar synkroniseringsstatusen; bygg därför inte en hälsokontroll som förutsätter att Ready betyder synkroniserad.
- **Ett borttaget Secret gör dess credential otillgängligt**, med bibehållet ID och delningar; återskapande av Secret (GitOps-rensning och återapplicering) återställer det för varje workflow. Rader tas aldrig bort automatiskt; en administratör tar bort dem från Inställningar → Kubernetes.
- **För en ägare som ännu inte har loggat in** görs nya försök var femte minut.
- **Ett användarcredential med samma namn och ägare** skrivs aldrig över; Secret rapporteras i stället som en konflikt.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes utvärderar egress-policyn efter att DNS Service har översatts till en DNS-pod, och OpenShifts DNS-poddar lyssnar på port 5353, inte 53. Med baspolicyn når nätverksanslutna sandboxar internet via IP, men varje namnuppslagning gör timeout. Overlayet ändrar endast den regeln:

- Det tillåter UDP och TCP 5353, DNS-poddarnas port, i stället för tjänstens 53.
- Det väljer DNS-namespace via `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` är inte inställt på alla kluster.
- Den publika `ipBlock`-regeln fortsätter att utesluta privata, link-local och CGNAT-intervall.

## Cilium med ersättning av kube-proxy

Basen tilldelar inte backend-podden någon egress-policy. Om en sådan läggs till kan ett vanligt `ipBlock` inte tillåta API-servern: Service-adressen skrivs om till en nods `:6443` innan policyn tillämpas, och den adressen bär Ciliums `kube-apiserver`-identitet. Tillåt den med en `CiliumNetworkPolicy`. Den väljer även workers, vilka också startar sandbox-poddar (se Lastfördelning):

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

## Schemaläggning (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` tar emot JSON med `nodeSelector`, `tolerations`, `runtimeClassName` (till exempel gVisor), `imagePullSecrets` och `priorityClassName`. Inga andra fält accepteras.

## Lastfördelning

Workers är ytterligare Deployments av samma image med `HEYM_INSTANCE_ROLE=worker`, samma värden för `SECRET_KEY` och `ENCRYPTION_KEY`, samt ServiceAccount-kontot `heym-backend`, så att de också kan starta sandbox-poddar. En worker kör Code-noden och behöver därför ett volymanspråk i arbetsytekatalogen för Code-nodens beroenden: ett eget `ReadWriteOnce`-anspråk räcker, eftersom dessa kataloger endast existerar under en enda körning. `overlays/orbstack-cluster` lägger till en worker; `scripts/k8s-cluster-smoke.sh` kontrollerar att köade körningar hamnar på den och att deras sandbox-poddar tillhör workern.

Starta workers direkt med uvicorn, så som `overlays/orbstack-cluster/worker.yaml` gör. Imagems entrypoint kör databasmigreringar, och dessa tillhör main. Tilldela varje worker ett unikt, stabilt `HEYM_INSTANCE_ID`; namnet på en pod i ett StatefulSet fungerar utmärkt. Körningar som köats för en worker som stoppas flyttas till en annan instans av ledaren (leader).

## Lokalt test på OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

För main plus en worker tillämpas i stället `overlays/orbstack-cluster` och kör `./scripts/k8s-cluster-smoke.sh`.

## Relaterat

- [Exempelmanifest och källkodens README](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Drift och distribution](./running-and-deployment.md)
- [Lastfördelning](../reference/cluster.md)
