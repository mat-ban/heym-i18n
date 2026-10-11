# Organização de Workflow

O Heym permite organizar workflows em pastas, criar subpastas e agendar workflows para exclusão. Consulte a [Aba Workflows](../tabs/workflows-tab.md) para uma visão geral da interface.

## Pastas e Subpastas

As pastas formam uma árvore. Cada pasta possui:

- **Name** – Nome de exibição
- **Parent** – `parent_id` aponta para outra pasta; `null` significa raiz
- **Workflows** – Workflows podem ser movidos para pastas via `folder_id`

### API

| Endpoint | Finalidade |
|----------|---------|
| `GET /folders` | Apenas pastas raiz |
| `GET /folders/tree` | Árvore completa (filhos + workflows) |
| `GET /folders/{id}` | Pasta única com seu conteúdo |
| `POST /folders` | Criar pasta (`parent_id` opcional) |
| `PUT /folders/{id}` | Atualizar nome ou `parent_id` |
| `DELETE /folders/{id}` | Excluir pasta (em cascata) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Mover workflow para a pasta |
| `DELETE /folders/workflows/{workflow_id}/folder` | Remover workflow da pasta |
| `GET /folders/{id}/export` | Baixar pasta + todas as subpastas como ZIP |

### Estrutura de Árvore

A resposta da árvore inclui `children` e `workflows` por pasta. Workflows compartilhados podem aparecer em uma pasta via `WorkflowShare.folder_id`.

## Compartilhamento de Workflows

Abra **Share** no editor de workflow para convidar usuários por e-mail ou compartilhar com um [time](./teams.md). Todo convite e todo compartilhamento com time carrega uma permissão:

| Permissão | O que o colaborador pode fazer |
|------------|------------------------------|
| **Read** | Abrir o workflow, inspecioná-lo, visualizar o histórico de execuções e executá-lo. O editor abre em modo somente leitura: o botão Save fica desabilitado e o canvas não pode ser alterado. |
| **Write** | Tudo o que Read permite, além de editar o canvas, as configurações, o documento de análise e a memória do agente. |

A permissão é exibida ao lado de cada entrada no diálogo Share e pode ser alterada a qualquer momento nesse dropdown, sem remover e adicionar novamente o compartilhamento. Quando um usuário acessa um workflow por vários caminhos (um compartilhamento direto e um ou mais times), a permissão **mais alta** prevalece. Compartilhamentos que existiam antes da introdução das permissões são **Write**, e clientes de API que omitem `permission` também recebem **Write**.

Ações exclusivas do proprietário nunca dependem da permissão: excluir um workflow, reverter ou limpar versões, limpar o histórico, gerenciar compartilhamentos e as [configurações exclusivas do proprietário](#configurações-exclusivas-do-proprietário) abaixo permanecem com o proprietário mesmo para colaboradores com **Write**. Um colaborador com **Read** que envia uma edição pela API (`PUT /api/workflows/{id}`, a nota de análise, a memória do agente, limpeza de cache) ou pelo Assistente de IA recebe `403` com `You have read-only access to this workflow`.

Compartilhar um workflow concede acesso ao canvas, ao histórico de execuções e ao documento de análise. Isso **não** compartilha automaticamente:

- **Credentials** referenciadas por nós no workflow
- **Sub-workflows** chamados por nós [Execute](../nodes/execute-node.md) ou agentes

Os destinatários precisam dessas credentials e dos workflows filhos compartilhados com eles separadamente (mesmos usuários ou times). Compartilhe credentials pela [Aba Credentials](../tabs/credentials-tab.md); consulte [Compartilhamento de Credentials](./credentials-sharing.md). Compartilhe cada sub-workflow pelo diálogo de compartilhamento do seu próprio editor.

### Configurações exclusivas do proprietário

Toda a configuração de **Run with cURL** permanece com o proprietário após o compartilhamento. Os colaboradores ainda abrem o diálogo e copiam o comando gerado, mas os controles ficam somente leitura.

Alterar qualquer um destes como não proprietário é rejeitado com `403`:

- **Authentication** (`auth_type`) e **Header Key** (`auth_header_key`)
- Modo do **Request Body** (`webhook_body_mode`) e **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) e **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) se comporta de forma diferente: fica totalmente oculto dos colaboradores, e a escrita de um colaborador é ignorada em vez de rejeitada. O editor renderiza o campo mascarado, então um `403` ali quebraria um save comum em vez de sinalizar um ataque.

A autenticação é o motivo pelo qual o bloco é exclusivo do proprietário: `Anonymous` permite que chamadores não autenticados executem o workflow, e uma execução sem chamador autenticado resolve credentials e variáveis globais como o **proprietário**, não o chamador. O restante do bloco é o contrato de requisição publicado e os controles de custo do proprietário, então ele acompanha isso.

**On error, run workflow** (`error_workflow_id`) no painel **Properties** em nível de workflow é exclusivo do proprietário pelo mesmo motivo: o [error workflow](./features.md#error-workflow) é executado com as credentials e variáveis globais da execução que falhou, que pertencem ao proprietário em execuções disparadas e anônimas. Os colaboradores veem a configuração em modo somente leitura, e adicioná-la, substituí-la ou limpá-la como não proprietário é rejeitado com `403`.

Editar o canvas, o nome e a descrição não é afetado.

### Tokens de execução

Um colaborador pode gerar um token de execução para um workflow compartilhado com ele. A execução é atribuída a **quem gerou o token**, portanto usa as credentials e variáveis globais desse usuário, não as do proprietário. Apenas uma chamada genuinamente anônima — `auth_type: anonymous` sem chamador — é executada no contexto do proprietário.

## Agendado para Exclusão

Workflows podem ser agendados para exclusão em vez de serem removidos imediatamente.

- **Campo**: `scheduled_for_deletion` (datetime anulável)
- **Comportamento**: Quando definido, o workflow é movido para `folder_id = null` e aparece na seção "Scheduled for Deletion".
### API

| Endpoint | Finalidade |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Define `scheduled_for_deletion`, limpa `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Limpa `scheduled_for_deletion` (restaura) |

### UI

- **Arrastar para a lixeira** – Solte workflows na área "Agendado para Exclusão" para agendá-los
- **Restaurar** – Remove do agendamento
- **Excluir imediatamente** – Ícone de lixeira para remoção permanente

### Lógica de Limpeza

Um cron job é executado diariamente às **23:59** (fuso horário configurado). Um workflow só é excluído quando:

- **Todos os nós de entrada** (nós sem arestas de entrada, excluindo sticky/errorHandler) possuem `active === false`

Se qualquer nó de entrada ainda estiver ativo, o workflow permanece até a próxima execução.

## Dashboard UI

- **Linhas de pasta** – Nova Pasta, árvore de pastas recursiva com expandir/recolher. Cada pasta carrega uma
  descrição opcional sob seu nome e um badge contando os workflows que ela contém, incluindo
  subpastas.
- **Ações de pasta** – Nova Subpasta, Renomear, Alterar ícone, Baixar como ZIP e Excluir ficam inline
  em cada linha de pasta; o menu de contexto do clique direito oferece o mesmo conjunto, e celulares exibem um único
  botão de menu.
- **Área principal** – Workflows raiz (sem pasta, não agendados) e Agendado para Exclusão
- **Pré-visualização de destino de pasta** – Arrastar um workflow destaca a pasta ou subpasta exata e
  mostra seu caminho completo em uma pré-visualização do tamanho de um card. Uma pasta recolhida se expande após um breve hover.
- **Feedback de arraste estável** – O card de origem usa um drag ghost, e o destino de soltura ativo permanece
  selecionado ao rolar ou cruzar controles dentro da mesma pasta.
- **Verificação de destino** – A pasta atual é exibida como **Já está na Pasta** e não aceita
  uma movimentação redundante.
- **Outras zonas de soltura** – Raiz e "Agendado para Exclusão" são destacados quando podem aceitar o
  workflow arrastado.
- **Soltura de ZIP** – Solte um arquivo ZIP na área de workflows para importar uma estrutura de pastas no nível raiz

## Relacionados

- [Aba Workflows](../tabs/workflows-tab.md) – Crie e gerencie workflows
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhe credenciais com colaboradores de workflow
- [Equipes](./teams.md) – Compartilhe workflows e credenciais com equipes
- [Conceitos Fundamentais](../getting-started/core-concepts.md) – Workflows, nós e execução
- [Estrutura de Workflow](./workflow-structure.md) – Formato JSON para workflows
- [Triggers](./triggers.md) – Nós de entrada e pontos de entrada
