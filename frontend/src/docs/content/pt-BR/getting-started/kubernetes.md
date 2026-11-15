# Heym no Kubernetes

Faça o deploy do Heym no Kubernetes sem um Docker socket. Execute cada sandbox como seu próprio pod, com orientações para armazenamento, rede e workers.

Manifestos de exemplo para executar o Heym sem um Docker socket. Cada sandbox (ferramentas Python, skills, o nó Code, análise de arquivos, Playwright, MCP stdio, Codex, OpenCode) roda como seu próprio pod por meio da API do Kubernetes.

## Requisitos

- Kubernetes 1.30 ou mais recente (o stdin da sandbox usa o protocolo de anexo `v5.channel.k8s.io`).
- Um CNI que aplique NetworkPolicy. O Heym valida isso antes da primeira sandbox offline e recusa-se a executar sandboxes offline quando um pod de teste ainda consegue se conectar.
- Um `podPidsLimit` no kubelet. Pods não possuem campo de limite de PID por pod; portanto, essa é a única proteção contra fork-bombs além de memória, CPU e prazo de execução. O Heym não pode verificar isso: o `/sys/fs/cgroup/pids.max` de um contêiner pertence ao seu próprio cgroup, não ao do pod. O Talos vem sem esse limite por padrão.

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

`heym-data` armazena os arquivos do Drive, plugins e os workspaces do Codex/OpenCode. Os pods de sandbox montam um `subPath` do volume por execução. Com `ReadWriteMany`, eles podem rodar em qualquer nó. Com `ReadWriteOnce`, ficam fixados ao nó do backend. `ReadWriteOncePod` não funciona.

## Pacotes de CA personalizados

Monte seu pacote de CA no pod do backend e aponte `SSL_CERT_FILE` (ou `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) para ele. O Heym copia o arquivo para `codex-workspaces/_ca/` na claim e monta essa cópia em modo somente leitura no mesmo caminho em cada sandbox que receber a variável. Com uma claim `ReadWriteOnce`, essas sandboxes rodam no nó do backend.

Uma CA não abre a rede. O tráfego egress da sandbox só alcança endereços públicos; portanto, um mirror interno de pacotes, proxy ou API interna precisa de uma regra própria, por exemplo:

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

Defina `HEYM_SANDBOX_K8S_NAMESPACE` para rodar sandboxes em outro namespace, adicione a esse namespace o rótulo `pod-security.kubernetes.io/enforce: restricted`, mova o Role para lá e mantenha no namespace do Heym um Role que conceda `get` sobre `pods`. As sandboxes de workspace precisarão então de uma claim chamada `heym-data` no namespace da sandbox vinculada ao mesmo compartilhamento RWX (um segundo PersistentVolume provisionado estaticamente).

## Credentials a partir de Kubernetes Secrets

Um Secret com o rótulo `heym.run/credential: "true"` torna-se um credential somente leitura. Os valores permanecem na memória de cada processo e nunca chegam ao banco de dados ou aos seus backups; alterar o Secret faz a rotação do credential sem reinicialização. Qualquer ferramenta que escreva um Secret funciona: External Secrets Operator, SealedSecrets, SOPS via Flux ou Argo CD, ou `kubectl`.

Adicione o componente ao seu overlay. Ele concede à ServiceAccount permissões de `get`, `list` e `watch` sobre Secrets e define `HEYM_K8S_CREDENTIALS=true` em cada Deployment:

    components:
      - ../../components/kubernetes-credentials

O RBAC de Secrets não pode ser restringido por rótulo; assim, o Heym pode ler qualquer Secret no namespace monitorado. Execute o Heym em seu próprio namespace ou defina `HEYM_K8S_CREDENTIALS_NAMESPACE` para um namespace que contenha apenas credentials do Heym. O início é recusado caso qualquer uma das variáveis `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX` ou `HEYM_MCP_STDIO_SANDBOX` esteja configurada como `subprocess`, pois o código do usuário rodaria ao lado do token da ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nome do credential exibido no Heym
        heym.run/type: custom                   # Um tipo de credential
        heym.run/owner: admin@example.com       # Um usuário existente
        heym.run/share-users: alice@example.com # E-mails opcionais separados por vírgula
        heym.run/share-teams: automation        # Nomes de equipe opcionais separados por vírgula
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Cada chave de dados corresponde a um campo de configuração. Para um tipo com campos aninhados ou que não sejam strings, insira toda a configuração como JSON sob uma única chave `config.json`. Tipos que armazenam tokens OAuth atualizados (Codex, Google, BigQuery, e Linear ou Notion em modo OAuth) não podem ser somente leitura e são recusados.

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

- **Um pod pode estar Ready antes de estar sincronizado.** A inicialização não aguarda o servidor da API, mantendo a interface acessível sem ele. Até que um processo seja sincronizado, ele não assume execuções enfileiradas; uma execução que usa um desses credentials falha com `not synced from Kubernetes yet` antes de rodar qualquer nó. Configurações → Kubernetes (uma aba administrativa que só aparece com `HEYM_K8S_CREDENTIALS` ativo) e Configurações → Instâncias exibem o estado de sincronização; portanto, não construa um health check assumindo que Ready signifique sincronizado.
- **Um Secret excluído deixa o credential indisponível**, mantendo seu ID e compartilhamentos; recriar o Secret (prune e re-apply via GitOps) o restaura para todos os workflows. As linhas nunca são removidas automaticamente; um administrador as exclui em Configurações → Kubernetes.
- **Caso um proprietário ainda não tenha feito login**, novas tentativas ocorrem a cada cinco minutos.
- **Um credential de usuário com mesmo nome e proprietário** nunca é sobrescrito; em vez disso, o Secret é reportado como um conflito.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

O OVN-Kubernetes avalia a política de egress após a tradução do Service DNS para um pod DNS, e os pods DNS do OpenShift escutam na porta 5353, e não 53. Com a política base, sandboxes conectadas à rede alcançam a internet por IP, mas qualquer resolução de nomes expira. O overlay altera apenas essa regra:

- Permite UDP e TCP 5353, a porta dos pods DNS, e não a porta 53 do Service.
- Seleciona o namespace DNS via `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` não está definido em todos os clusters.
- A regra pública de `ipBlock` continua excluindo intervalos privados, link-local e CGNAT.

## Cilium com substituição de kube-proxy

A configuração base não atribui política de egress ao pod de backend. Se você adicionar uma, um `ipBlock` simples não consegue liberar o servidor da API: o endereço do Service é reescrito para a porta `:6443` de um nó antes da aplicação da política, e esse endereço carrega a identidade `kube-apiserver` do Cilium. Libere-o com uma `CiliumNetworkPolicy`. Ela também seleciona workers, que também iniciam pods de sandbox (consulte Distribuição de carga):

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

`HEYM_SANDBOX_K8S_POD_OVERRIDES` aceita JSON com `nodeSelector`, `tolerations`, `runtimeClassName` (por exemplo gVisor), `imagePullSecrets` e `priorityClassName`. Nenhum outro campo é aceito.

## Distribuição de carga

Workers são Deployments adicionais da mesma imagem com `HEYM_INSTANCE_ROLE=worker`, os mesmos valores de `SECRET_KEY` e `ENCRYPTION_KEY`, e a ServiceAccount `heym-backend`, permitindo que também iniciem pods de sandbox. Um worker executa o nó Code, necessitando de uma claim no diretório de workspace para as dependências do nó Code: sua própria claim `ReadWriteOnce` é suficiente, pois esses diretórios existem apenas durante uma execução. `overlays/orbstack-cluster` adiciona um worker; `scripts/k8s-cluster-smoke.sh` verifica se as execuções em fila são atribuídas a ele e se seus pods de sandbox pertencem ao worker.

Inicie os workers diretamente com o uvicorn, como feito em `overlays/orbstack-cluster/worker.yaml`. O ponto de entrada da imagem roda as migrações do banco de dados, que pertencem à instância principal (main). Atribua a cada worker um `HEYM_INSTANCE_ID` estável e exclusivo; o nome de um pod em um StatefulSet funciona perfeitamente. Execuções em fila para um worker que é interrompido são movidas para outra instância pelo líder.

## Teste local no OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Para a instância principal com um worker, aplique antes `overlays/orbstack-cluster` e execute `./scripts/k8s-cluster-smoke.sh`.

## Tópicos relacionados

- [Manifestos de exemplo e README fonte](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Operação & Deploy](./running-and-deployment.md)
- [Distribuição de carga](../reference/cluster.md)
