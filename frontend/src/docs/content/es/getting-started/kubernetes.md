# Heym en Kubernetes

Despliegue Heym en Kubernetes sin socket de Docker. Ejecute cada sandbox en su propio pod, con guías para almacenamiento, redes y workers.

Manifiestos de ejemplo para ejecutar Heym sin socket de Docker. Cada sandbox (herramientas de Python, skills, el nodo Code, análisis de archivos, Playwright, MCP stdio, Codex, OpenCode) se ejecuta en su propio pod mediante la API de Kubernetes.

## Requisitos

- Kubernetes 1.30 o superior (el stdin de la sandbox utiliza el protocolo de conexión `v5.channel.k8s.io`).
- Un CNI que aplique NetworkPolicy. Heym comprueba esto antes de la primera sandbox offline y rechaza ejecutar sandboxes offline si un pod de prueba todavía puede conectarse.
- Un `podPidsLimit` en el kubelet. Los pods no disponen de un campo de límite de PID por pod; por tanto, esta es la única protección contra bifurcaciones masivas (fork-bombs) además de la memoria, la CPU y el tiempo límite de ejecución. Heym no puede comprobarlo: `/sys/fs/cgroup/pids.max` de un contenedor pertenece a su propio cgroup, no al del pod. Talos se distribuye sin este límite por defecto.

## Instalación

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) es un chart comunitario mantenido por Alexey Masolov y publicado en [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), con preajustes para plataformas como OpenShift, EKS, AKS y GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Almacenamiento

`heym-data` aloja los archivos de Drive, los plugins y los espacios de trabajo de Codex/OpenCode. Los pods de sandbox montan un `subPath` del volumen por cada ejecución. Con `ReadWriteMany` pueden ejecutarse en cualquier nodo. Con `ReadWriteOnce` quedan vinculados al nodo del backend. `ReadWriteOncePod` no es compatible.

## Paquetes de certificados CA personalizados

Monte su paquete de CA en el pod del backend y apunte `SSL_CERT_FILE` (o `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) hacia él. Heym copia el archivo a `codex-workspaces/_ca/` en la notificación de volumen y monta dicha copia en modo solo lectura en la misma ruta en cada sandbox que reciba la variable. Con una notificación `ReadWriteOnce`, esas sandboxes se ejecutan en el nodo del backend.

Una CA no abre la red. El tráfico egress de la sandbox solo alcanza direcciones públicas; por tanto, un mirror interno de paquetes, un proxy o una API interna requiere su propia regla, por ejemplo:

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

## Un namespace dedicado para sandboxes

Configure `HEYM_SANDBOX_K8S_NAMESPACE` para ejecutar las sandboxes en otro namespace, etiquete ese namespace con `pod-security.kubernetes.io/enforce: restricted`, mueva el Role allí y mantenga en el namespace de Heym un Role que otorgue `get` sobre `pods`. Las sandboxes de espacios de trabajo necesitarán entonces un claim denominado `heym-data` en el namespace de sandbox vinculado al mismo recurso compartido RWX (un segundo PersistentVolume aprovisionado estáticamente).

## Credentials desde Kubernetes Secrets

Un Secret etiquetado con `heym.run/credential: "true"` se convierte en un credential de solo lectura. Los valores permanecen en la memoria de cada proceso y nunca llegan a la base de datos ni a sus copias de seguridad; modificar el Secret rota el credential sin necesidad de reiniciar. Cualquier sistema que escriba un Secret es compatible: External Secrets Operator, SealedSecrets, SOPS a través de Flux o Argo CD, o `kubectl`.

Añada el componente a su overlay. Otorga al ServiceAccount permisos `get`, `list` y `watch` sobre Secrets y establece `HEYM_K8S_CREDENTIALS=true` en cada Deployment:

    components:
      - ../../components/kubernetes-credentials

El RBAC de los Secrets no puede restringirse por etiqueta; por tanto, Heym puede leer cualquier Secret dentro del namespace supervisado. Ejecute Heym en su propio namespace o establezca `HEYM_K8S_CREDENTIALS_NAMESPACE` en uno que contenga exclusivamente credentials de Heym. El inicio se rechazará si alguna de las opciones `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` o `HEYM_MCP_STDIO_SANDBOX` está configurada como `subprocess`, ya que el código de usuario se ejecutaría junto al token del ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nombre del credential visible en Heym
        heym.run/type: custom                   # Un tipo de credential
        heym.run/owner: admin@example.com       # Un usuario existente
        heym.run/share-users: alice@example.com # E-mails opcionales separados por comas
        heym.run/share-teams: automation        # Nombres de equipos opcionales separados por comas
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Cada clave de datos es un campo de configuración. Para un tipo con campos anidados o que no sean cadenas de texto, coloque toda la configuración como JSON bajo una única clave `config.json`. Los tipos que almacenan tokens OAuth actualizados (Codex, Google, BigQuery, y Linear o Notion en modo OAuth) no pueden ser de solo lectura y son rechazados.

Con External Secrets Operator, añada la etiqueta y las anotaciones a la plantilla de destino:

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

Qué esperar:

- **Un pod puede estar Ready antes de haberse sincronizado.** El inicio no espera al servidor de API, por lo que la interfaz de usuario se mantiene disponible sin él. Hasta que un proceso se sincronice, no procesará ejecuciones en cola; cualquier ejecución que use uno de estos credentials fallará con `not synced from Kubernetes yet` antes de ejecutar ningún nodo. Configuración → Kubernetes (una pestaña de administración que aparece únicamente con `HEYM_K8S_CREDENTIALS` activo) y Configuración → Instancias muestran el estado de sincronización; por tanto, no construya comprobaciones de salud asumiendo que Ready implica sincronizado.
- **Un Secret eliminado deja su credential no disponible**, conservando su identificador y accesos compartidos; recrear el Secret (limpieza y reaplicación con GitOps) lo restablece en cada workflow. Las filas nunca se eliminan automáticamente; un administrador las elimina desde Configuración → Kubernetes.
- **Si el propietario aún no ha iniciado sesión**, se reintenta cada cinco minutos.
- **Un credential de usuario con el mismo nombre y propietario** nunca se sobreescribe; en su lugar, el Secret se notifica como un conflicto.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes evalúa las directivas de egress después de que el Service DNS se traduzca a un pod DNS, y los pods DNS de OpenShift escuchan en el puerto 5353, no en el 53. Con la directiva base, las sandboxes con red alcanzan internet por IP pero cualquier resolución de nombres agota el tiempo de espera. El overlay modifica únicamente esa regla:

- Permite UDP y TCP 5353, el puerto de los pods DNS, no el 53 del Service.
- Selecciona el namespace de DNS mediante `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` no está configurado en todos los clústeres.
- La regla pública de `ipBlock` sigue excluyendo rangos privados, de enlace local y CGNAT.

## Cilium con sustitución de kube-proxy

La base no otorga ninguna directiva de egress al pod del backend. Si añade una, un `ipBlock` común no puede permitir el servidor de API: la dirección del Service se reescribe al puerto `:6443` de un nodo antes de aplicar la directiva, y esa dirección porta la identidad `kube-apiserver` de Cilium. Permítalo mediante una `CiliumNetworkPolicy`. Esta también selecciona workers, que asimismo inician pods de sandbox (consulte Distribución de carga):

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

## Programación (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` recibe un JSON con `nodeSelector`, `tolerations`, `runtimeClassName` (por ejemplo gVisor), `imagePullSecrets` y `priorityClassName`. No se acepta ningún otro campo.

## Distribución de carga

Los workers son Deployments adicionales de la misma imagen con `HEYM_INSTANCE_ROLE=worker`, los mismos valores de `SECRET_KEY` y `ENCRYPTION_KEY`, y el ServiceAccount `heym-backend`, lo que les permite iniciar también pods de sandbox. Un worker ejecuta el nodo Code, por lo que requiere una notificación en el directorio de espacios de trabajo para las dependencias del nodo Code: su propia notificación `ReadWriteOnce` es suficiente, ya que esos directorios solo existen durante una ejecución. `overlays/orbstack-cluster` añade un worker; `scripts/k8s-cluster-smoke.sh` verifica que las ejecuciones en cola se procesen en él y que sus pods de sandbox correspondan a dicho worker.

Inicie los workers directamente con uvicorn, tal como hace `overlays/orbstack-cluster/worker.yaml`. El punto de entrada de la imagen ejecuta las migraciones de la base de datos, las cuales pertenecen a la instancia principal (main). Asigne a cada worker un `HEYM_INSTANCE_ID` único y estable; el nombre de un pod en un StatefulSet funciona adecuadamente. Las ejecuciones en cola asignadas a un worker que se detiene son redirigidas a otra instancia por el líder.

## Prueba local en OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Para la instancia principal junto a un worker, aplique en su lugar `overlays/orbstack-cluster` y ejecute `./scripts/k8s-cluster-smoke.sh`.

## Referencias relacionadas

- [Manifiestos de ejemplo y README fuente](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Ejecución & Despliegue](./running-and-deployment.md)
- [Distribución de carga](../reference/cluster.md)
