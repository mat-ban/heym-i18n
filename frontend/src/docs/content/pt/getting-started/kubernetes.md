# Heym em Kubernetes

Implemente o Heym em Kubernetes sem socket Docker. Execute cada sandbox como o seu próprio pod, com orientações para armazenamento, rede e workers.

Manifestos de exemplo para executar o Heym sem socket Docker. Cada sandbox (ferramentas Python, skills, o nó Code, análise de ficheiros, Playwright, MCP stdio, Codex, OpenCode) é executada como o seu próprio pod através da API do Kubernetes.

## Requisitos

- Kubernetes 1.30 ou superior (o stdin da sandbox utiliza o protocolo de anexo `v5.channel.k8s.io`).
- Um CNI que aplique NetworkPolicy. O Heym verifica isto antes da primeira sandbox offline e recusa-se a executar sandboxes offline quando um pod de teste ainda consegue estabelecer ligação.
- Um `podPidsLimit` no kubelet. Os pods não possuem um campo de limite de PID por pod; como tal, esta é a única proteção contra fork-bombs além da memória, CPU e prazo limite. O Heym não pode verificar isto: `/sys/fs/cgroup/pids.max` de um contentor pertence ao seu próprio cgroup, e não ao do pod. O Talos é distribuído sem este limite por predefinição.

## Instalação

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) é um chart comunitário mantido por Alexey Masolov e publicado no [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), com predefinições de plataforma para OpenShift, EKS, AKS e GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Armazenamento (Storage)

`heym-data` armazena os ficheiros do Drive, plugins e os espaços de trabalho do Codex/OpenCode. Os pods de sandbox montam um `subPath` do volume por execução. Com `ReadWriteMany`, podem ser executados em qualquer nó. Com `ReadWriteOnce`, ficam associados ao nó do backend. `ReadWriteOncePod` não é suportado.

## Pacotes de CA personalizados

Monte o seu pacote de CA no pod do backend e aponte `SSL_CERT_FILE` (ou `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) para ele. O Heym copia o ficheiro para `codex-workspaces/_ca/` na reivindicação e monta essa cópia em modo de apenas leitura no mesmo caminho em cada sandbox que receba a variável. Com uma reivindicação `ReadWriteOnce`, essas sandboxes são executadas no nó do backend.

Uma CA não abre a rede. O tráfego de egress da sandbox apenas alcança endereços públicos; como tal, um espelho de pacotes interno, proxy ou API interna requer uma regra dedicada, por exemplo:

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

## Um namespace dedicado para sandboxes

Defina `HEYM_SANDBOX_K8S_NAMESPACE` para executar sandboxes noutro namespace, aplique a esse namespace o rótulo `pod-security.kubernetes.io/enforce: restricted`, mova o Role para lá e mantenha no namespace do Heym um Role que conceda `get` sobre `pods`. As sandboxes de espaço de trabalho necessitam então de uma reivindicação com o nome `heym-data` no namespace da sandbox associada à mesma partilha RWX (um segundo PersistentVolume aprovisionado estaticamente).

## Credentials a partir de Kubernetes Secrets

Um Secret com o rótulo `heym.run/credential: "true"` converte-se num credential de apenas leitura. Os valores permanecem na memória de cada processo e nunca chegam à base de dados nem às suas cópias de segurança; alterar o Secret efetua a rotação do credential sem reinicialização. Qualquer ferramenta que escreva um Secret é suportada: External Secrets Operator, SealedSecrets, SOPS via Flux ou Argo CD, ou `kubectl`.

Adicione o componente ao seu overlay. Este concede à ServiceAccount os privilégios `get`, `list` e `watch` sobre Secrets e define `HEYM_K8S_CREDENTIALS=true` em cada Deployment:

    components:
      - ../../components/kubernetes-credentials

O RBAC de Secrets não pode ser restringido por rótulo; como tal, o Heym pode ler qualquer Secret no namespace monitorizado. Execute o Heym no seu próprio namespace ou defina `HEYM_K8S_CREDENTIALS_NAMESPACE` para um que contenha apenas credentials do Heym. O arranque é recusado caso qualquer uma das opções `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` ou `HEYM_MCP_STDIO_SANDBOX` esteja configurada como `subprocess`, pois o código do utilizador seria executado junto do token da ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nome do credential apresentado no Heym
        heym.run/type: custom                   # Um tipo de credential
        heym.run/owner: admin@example.com       # Um utilizador existente
        heym.run/share-users: alice@example.com # E-mails opcionais separados por vírgulas
        heym.run/share-teams: automation        # Nomes de equipa opcionais separados por vírgulas
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Cada chave de dados corresponde a um campo de configuração. Para um tipo com campos aninhados ou que não sejam strings, insira toda a configuração como JSON sob uma única chave `config.json`. Tipos que armazenem tokens OAuth atualizados (Codex, Google, BigQuery, e Linear ou Notion em modo OAuth) não podem ser de apenas leitura e são recusados.

Com o External Secrets Operator, insira o rótulo e as anotações no modelo de destino:

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

O que esperar:

- **Um pod pode estar Ready antes de estar sincronizado.** O arranque não aguarda pelo servidor da API, pelo que a interface permanece acessível sem ele. Até que um processo seja sincronizado, não assume execuções em fila; uma execução que utilize um destes credentials falha com `not synced from Kubernetes yet` antes da execução de qualquer nó. Definições → Kubernetes (um separador de administração que surge apenas quando `HEYM_K8S_CREDENTIALS` está ativo) e Definições → Instâncias mostram o estado de sincronização; por conseguinte, não configure uma verificação de estado assumindo que Ready equivale a sincronizado.
- **Um Secret eliminado torna o credential indisponível**, mantendo o respetivo ID e partilhas; recriar o Secret (uma limpeza e reaplicação com GitOps) restaura-o para todos os workflows. As linhas nunca são removidas automaticamente; um administrador pode removê-las em Definições → Kubernetes.
- **Se o proprietário ainda não tiver iniciado sessão**, o processo é repetido a cada cinco minutos.
- **Um credential de utilizador com o mesmo nome e proprietário** nunca é substituído; em alternativa, o Secret é reportado como um conflito.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

O OVN-Kubernetes avalia a política de egress após o Service DNS ser traduzido para um pod DNS, e os pods DNS do OpenShift escutam na porta 5353, e não 53. Com a política de base, as sandboxes ligadas em rede alcançam a Internet por IP, mas qualquer resolução de nomes esgota o tempo limite. O overlay ajusta apenas essa regra:

- Permite UDP e TCP na porta 5353, a porta dos pods DNS, e não a porta 53 do Service.
- Seleciona o namespace DNS através de `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` não se encontra definido em todos os clusters.
- A regra pública de `ipBlock` continua a excluir intervalos privados, link-local e CGNAT.

## Cilium com substituição de kube-proxy

A configuração base não atribui uma política de egress ao pod do backend. Se adicionar uma, um `ipBlock` simples não consegue permitir o servidor da API: o endereço do Service é reescrito para a porta `:6443` de um nó antes da aplicação da política, e esse endereço transporta a identidade `kube-apiserver` do Cilium. Permita-o através de uma `CiliumNetworkPolicy`. Esta também seleciona workers, que também iniciam pods de sandbox (consulte Distribuição de carga):

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

## Agendamento (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` aceita JSON com `nodeSelector`, `tolerations`, `runtimeClassName` (por exemplo gVisor), `imagePullSecrets` e `priorityClassName`. Nenhum outro campo é aceite.

## Distribuição de carga

Os workers são Deployments adicionais da mesma imagem com `HEYM_INSTANCE_ROLE=worker`, os mesmos valores de `SECRET_KEY` e `ENCRYPTION_KEY`, e a ServiceAccount `heym-backend`, para que também possam iniciar pods de sandbox. Um worker executa o nó Code, necessitando de uma reivindicação no diretório de espaço de trabalho para as dependências do nó Code: a sua própria reivindicação `ReadWriteOnce` é suficiente, pois esses diretórios existem apenas durante uma execução. `overlays/orbstack-cluster` adiciona um worker; `scripts/k8s-cluster-smoke.sh` verifica se as execuções em fila são atribuídas a ele e se os respetivos pods de sandbox pertencem ao worker.

Inicie os workers diretamente com o uvicorn, tal como efetuado em `overlays/orbstack-cluster/worker.yaml`. O ponto de entrada da imagem executa as migrações da base de dados, cabendo estas à instância principal (main). Atribua a cada worker um `HEYM_INSTANCE_ID` exclusivo e estável; o nome de um pod num StatefulSet funciona adequadamente. As execuções em fila atribuídas a um worker que é interrompido são transferidas para outra instância pelo líder.

## Teste local em OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Para a instância principal com um worker, aplique antes `overlays/orbstack-cluster` e execute `./scripts/k8s-cluster-smoke.sh`.

## Tópicos relacionados

- [Manifestos de exemplo e README da fonte](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Execução & Implementação](./running-and-deployment.md)
- [Distribuição de carga](../reference/cluster.md)
