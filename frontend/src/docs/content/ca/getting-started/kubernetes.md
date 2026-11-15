# Heym a Kubernetes

Desplegui Heym a Kubernetes sense socket de Docker. Executi cada sandbox com el seu propi pod, amb guies per a emmagatzematge, xarxa i workers.

Manifestos d'exemple per a executar Heym sense socket de Docker. Cada sandbox (eines de Python, skills, el node Code, anàlisi de fitxers, Playwright, MCP stdio, Codex, OpenCode) s'executa com el seu propi pod a través de l'API de Kubernetes.

## Requisits

- Kubernetes 1.30 o superior (l'stdin de la sandbox utilitza el protocol d'adjunció `v5.channel.k8s.io`).
- Un CNI que apliqui NetworkPolicy. Heym comprova això abans de la primera sandbox offline i rebutja executar sandboxes offline quan un pod de prova encara pot connectar-se.
- Un `podPidsLimit` al kubelet. Els pods no disposen d'un camp de límit de PID per pod; per tant, aquesta és l'única protecció contra fork-bombs a més de la memòria, la CPU i el temps límit. Heym no pot comprovar-ho: `/sys/fs/cgroup/pids.max` d'un contenidor pertany al seu propi cgroup, no al del pod. Talos es distribueix sense aquest límit per defecte.

## Instal·lació

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) és un chart comunitari mantingut per Alexey Masolov i publicat a [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), amb preconfiguracions de plataforma per a OpenShift, EKS, AKS i GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Emmagatzematge (Storage)

`heym-data` emmagatzema els fitxers de Drive, els plugins i els espais de treball de Codex/OpenCode. Els pods de sandbox munten un `subPath` del volum per execució. Amb `ReadWriteMany` poden executar-se en qualsevol node. Amb `ReadWriteOnce` queden vinculats al node del backend. `ReadWriteOncePod` no és compatible.

## Paquets de CA personalitzats

Munti el seu paquet de CA al pod del backend i apunti `SSL_CERT_FILE` (o `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) cap a ell. Heym copia el fitxer a `codex-workspaces/_ca/` a la reclamació i munta aquesta còpia en mode de només lectura a la mateixa ruta a cada sandbox que rebi la variable. Amb una reclamació `ReadWriteOnce`, aquestes sandboxes s'executen al node del backend.

Una CA no obre la xarxa. L'egress de la sandbox només arriba a adreces públiques; per tant, un mirall de paquets intern, un proxy o una API interna necessita la seva pròpia regla, per exemple:

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

## Un namespace dedicat per a sandboxes

Definiu `HEYM_SANDBOX_K8S_NAMESPACE` per a executar sandboxes en un altre namespace, etiqueteu aquest namespace amb `pod-security.kubernetes.io/enforce: restricted`, moveu el Role allà i manteniu al namespace de Heym un Role que atorgui `get` sobre `pods`. Les sandboxes d'espai de treball necessitaran llavors una reclamació anomenada `heym-data` al namespace de sandbox vinculada al mateix recurs compartit RWX (un segon PersistentVolume aprovisionat estàticament).

## Credentials a partir de Kubernetes Secrets

Un Secret etiquetat amb `heym.run/credential: "true"` esdevé un credential de només lectura. Els valors romanen a la memòria de cada procés i mai arriben a la base de dades ni a les seves còpies de seguretat; modificar el Secret rota el credential sense reiniciar. Qualsevol eina que escrigui un Secret funciona: External Secrets Operator, SealedSecrets, SOPS mitjançant Flux o Argo CD, o `kubectl`.

Afegiu el component al vostre overlay. Atorga al ServiceAccount permisos `get`, `list` i `watch` sobre Secrets i estableix `HEYM_K8S_CREDENTIALS=true` a cada Deployment:

    components:
      - ../../components/kubernetes-credentials

El RBAC de Secrets no es pot restringir per etiqueta; per tant, Heym pot llegir qualsevol Secret al namespace supervisat. Executeu Heym al seu propi namespace o establiu `HEYM_K8S_CREDENTIALS_NAMESPACE` a un que contingui exclusivament credentials de Heym. L'arrencada es rebutja si qualsevol de les variables `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` o `HEYM_MCP_STDIO_SANDBOX` està configurada com a `subprocess`, ja que el codi d'usuari s'executaria al costat del token del ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nom del credential mostrat a Heym
        heym.run/type: custom                   # Un tipus de credential
        heym.run/owner: admin@example.com       # Un usuari existent
        heym.run/share-users: alice@example.com # E-mails opcionals separats per comes
        heym.run/share-teams: automation        # Noms d'equips opcionals separats per comes
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Cada clau de dades és un camp de configuració. Per a un tipus amb camps niats o que no siguin cadenes de text, col·loqueu tota la configuració com a JSON sota una única clau `config.json`. Els tipus que emmagatzemen tokens OAuth actualitzats (Codex, Google, BigQuery, i Linear o Notion en mode OAuth) no poden ser de només lectura i són rebutjats.

Amb External Secrets Operator, afegiu l'etiqueta i les anotacions a la plantilla de destinació:

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

Què cal esperar:

- **Un pod pot estar Ready abans d'haver-se sincronitzat.** L'inici no espera el servidor de l'API, de manera que la interfície es manté accessible sense ell. Fins que un procés s'hagi sincronitzat no processarà execucions en cua; una execució que utilitzi un d'aquests credentials fallarà amb `not synced from Kubernetes yet` abans d'executar cap node. Configuració → Kubernetes (una pestanya d'administració que apareix només amb `HEYM_K8S_CREDENTIALS` actiu) i Configuració → Instàncies mostren l'estat de sincronització; per tant, no creeu una comprovació d'estat que assumeixi que Ready equival a sincronitzat.
- **Un Secret eliminat deixa el credential no disponible**, mantenint el seu ID i recursos compartits; recrear el Secret (neteja i reaplicació amb GitOps) el restaura per a cada workflow. Les files mai s'eliminen automàticament; un administrador les elimina des de Configuració → Kubernetes.
- **Si el propietari encara no ha iniciat sessió**, es reintenta cada cinc minuts.
- **Un credential d'usuari amb el mateix nom i propietari** mai es sobreescriu; en el seu lloc, el Secret es notifica com a conflicte.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes avalua la política d'egress després que el Service DNS es tradueixi a un pod DNS, i els pods DNS d'OpenShift escolten al port 5353, no al 53. Amb la política base, les sandboxes amb xarxa arriben a internet per IP però qualsevol resolució de noms esgota el temps d'espera. L'overlay modifica exclusivament aquesta regla:

- Permet UDP i TCP 5353, el port dels pods DNS, no el port 53 del Service.
- Selecciona el namespace DNS mitjançant `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` no està definit a tots els clústers.
- La regla pública de `ipBlock` continua excloent rangs privats, d'enllaç local i CGNAT.

## Cilium amb substitució de kube-proxy

La base no atorga cap política d'egress al pod del backend. Si n'afegiu una, un `ipBlock` senzill no pot permetre el servidor de l'API: l'adreça del Service es reescriu al port `:6443` d'un node abans d'aplicar la política, i aquesta adreça porta la identitat `kube-apiserver` de Cilium. Permeteu-ho mitjançant una `CiliumNetworkPolicy`. Aquesta també selecciona workers, que també inicien pods de sandbox (vegeu Distribució de càrrega):

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

## Planificació (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` accepta JSON amb `nodeSelector`, `tolerations`, `runtimeClassName` (per exemple gVisor), `imagePullSecrets` i `priorityClassName`. No s'accepta cap altre camp.

## Distribució de càrrega

Els workers són Deployments addicionals de la mateixa imatge amb `HEYM_INSTANCE_ROLE=worker`, els mateixos valors de `SECRET_KEY` i `ENCRYPTION_KEY`, i el ServiceAccount `heym-backend`, permetent-los també iniciar pods de sandbox. Un worker executa el node Code, de manera que requereix una reclamació al directori d'espai de treball per a les dependències del node Code: la seva pròpia reclamació `ReadWriteOnce` és suficient, ja que aquests directoris només viuen durant una execució. `overlays/orbstack-cluster` afegeix un worker; `scripts/k8s-cluster-smoke.sh` verifica que les execucions en cua s'assignin a ell i que els seus pods de sandbox pertanyin al worker.

Inicieu els workers directament amb uvicorn, tal com fa `overlays/orbstack-cluster/worker.yaml`. El punt d'entrada de la imatge executa les migracions de la base de dades, i aquestes pertanyen a la instància principal (main). Assigneu a cada worker un `HEYM_INSTANCE_ID` únic i estable; el nom d'un pod en un StatefulSet funciona adequadament. Les execucions en cua assignades a un worker que s'atura són transferides a una altra instància pel líder.

## Prova local a OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Per a la instància principal més un worker, apliqueu en el seu lloc `overlays/orbstack-cluster` i executeu `./scripts/k8s-cluster-smoke.sh`.

## Referències relacionades

- [Manifestos d'exemple i README font](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Execució & Desplegament](./running-and-deployment.md)
- [Distribució de càrrega](../reference/cluster.md)
