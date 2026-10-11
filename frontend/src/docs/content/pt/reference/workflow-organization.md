# Organização de Workflows

O Heym permite organizar workflows em pastas, criar subpastas e agendar workflows para exclusão. Consulte a [Guia Workflows](../tabs/workflows-tab.md) para obter uma visão geral da interface.

## Pastas e Subpastas

As pastas formam uma árvore. Cada pasta possui:

- **Name** – Nome de exibição
- **Parent** – `parent_id` faz referência a outra pasta; `null` indica a raiz
- **Workflows** – Os workflows podem ser movidos para pastas por meio de `folder_id`

### API

| Endpoint | Finalidade |
|----------|---------|
| `GET /folders` | Apenas pastas raiz |
| `GET /folders/tree` | Árvore completa (filhos + workflows) |
| `GET /folders/{id}` | Pasta individual com o respetivo conteúdo |
| `POST /folders` | Criar pasta (`parent_id` opcional) |
| `PUT /folders/{id}` | Atualizar o nome ou `parent_id` |
| `DELETE /folders/{id}` | Excluir pasta (em cascata) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Mover workflow para a pasta |
| `DELETE /folders/workflows/{workflow_id}/folder` | Remover workflow da pasta |
| `GET /folders/{id}/export` | Transferir a pasta e todas as subpastas como ZIP |

### Estrutura de Árvore

A resposta da árvore inclui `children` e `workflows` por pasta. Os workflows partilhados podem aparecer numa pasta por meio de `WorkflowShare.folder_id`.

## Partilha de Workflows

Abra **Share** no editor de workflow para convidar utilizadores por email ou partilhar com uma [equipa](./teams.md). Cada convite e cada partilha com equipa transporta uma permissão:

| Permissão | O que o colaborador pode fazer |
|------------|------------------------------|
| **Read** | Abrir o workflow, inspecioná-lo, consultar o histórico de execuções e executá-lo. O editor abre em modo de leitura: Guardar está desativado e o canvas não pode ser alterado. |
| **Write** | Tudo o que a permissão Read permite, além de editar o canvas, as configurações, o documento de análise e a memória do agente. |

A permissão é apresentada junto a cada entrada na caixa de diálogo Share e pode ser alterada a qualquer momento a partir dessa lista pendente, sem remover e adicionar novamente a partilha. Quando um utilizador chega a um workflow por vários caminhos (uma partilha direta e uma ou mais equipas), prevalece a permissão **mais elevada**. As partilhas que existiam antes da introdução das permissões são **Write**, e os clientes de API que omitem `permission` também obtêm **Write**.

As ações exclusivas do proprietário nunca dependem da permissão: excluir um workflow, reverter ou limpar versões, limpar o histórico, gerir partilhas e as [configurações exclusivas do proprietário](#configurações-exclusivas-do-proprietário) abaixo permanecem com o proprietário mesmo para colaboradores com **Write**. Um colaborador com **Read** que envie uma edição através da API (`PUT /api/workflows/{id}`, a nota de análise, a memória do agente, a limpeza de cache) ou através do Assistente de IA recebe `403` com `You have read-only access to this workflow`.

Partilhar um workflow concede acesso ao canvas, ao histórico de execuções e ao documento de análise. **Não** partilha automaticamente:

- **Credenciais** referenciadas por nós no workflow
- **Sub-workflows** chamados por nós [Execute](../nodes/execute-node.md) ou agentes

Os destinatários precisam que essas credenciais e workflows filhos sejam partilhados com eles separadamente (os mesmos utilizadores ou equipas). Partilhe credenciais a partir da [Guia Credenciais](../tabs/credentials-tab.md); consulte [Partilha de Credenciais](./credentials-sharing.md). Partilhe cada sub-workflow a partir da respetiva caixa de diálogo de partilha do editor.

### Configurações exclusivas do proprietário

Toda a configuração **Run with cURL** permanece com o proprietário após a partilha. Os colaboradores continuam a abrir a caixa de diálogo e a copiar o comando gerado, mas os controlos são apenas de leitura.

Alterar qualquer um destes elementos enquanto não proprietário é rejeitado com `403`:

- **Authentication** (`auth_type`) e **Header Key** (`auth_header_key`)
- Modo **Request Body** (`webhook_body_mode`) e **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) e **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

O **Header Value** (`auth_header_value`) comporta-se de forma diferente: fica totalmente oculto para os colaboradores, e uma escrita de um colaborador é ignorada em vez de rejeitada. O editor apresenta o campo mascarado, pelo que um `403` nesse ponto quebraria uma gravação comum em vez de sinalizar um ataque.

A autenticação é a razão pela qual o bloco é exclusivo do proprietário: `Anonymous` permite que chamadores não autenticados executem o workflow, e uma execução sem chamador autenticado resolve credenciais e variáveis globais como o **proprietário**, não o chamador. O resto do bloco é o contrato de pedido publicado e os controlos de custo do proprietário, pelo que se move com ele.

**On error, run workflow** (`error_workflow_id`) no painel **Properties** ao nível do workflow é exclusivo do proprietário pela mesma razão: o [error workflow](./features.md#error-workflow) é executado com as credenciais e variáveis globais da execução falhada, que pertencem ao proprietário no caso de execuções acionadas e anónimas. Os colaboradores veem a configuração apenas de leitura, e adicioná-la, substituí-la ou limpá-la enquanto não proprietário é rejeitado com `403`.

Editar o canvas, o nome e a descrição não é afetado.
### Tokens de execução

Um colaborador pode gerar um token de execução para um workflow compartilhado com ele. A execução é atribuída a **quem gerou o token**, portanto utiliza as credenciais e variáveis globais desse usuário, e não as do proprietário. Apenas uma chamada genuinamente anônima — `auth_type: anonymous` sem chamador — é executada no contexto do proprietário.

## Agendado para Exclusão

Os workflows podem ser agendados para exclusão em vez de serem removidos imediatamente.

- **Campo**: `scheduled_for_deletion` (datetime anulável)
- **Comportamento**: Quando definido, o workflow passa para `folder_id = null` e aparece na seção "Agendado para Exclusão".

### API

| Endpoint | Finalidade |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Define `scheduled_for_deletion`, limpa `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Limpa `scheduled_for_deletion` (restaurar) |

### UI

- **Arrastar para a lixeira** – Solte workflows na área "Agendado para Exclusão" para agendá-los
- **Restaurar** – Remove do agendamento
- **Excluir imediatamente** – Ícone de lixeira para remoção permanente

### Lógica de limpeza

Um cron job é executado diariamente às **23:59** (fuso horário configurado). Um workflow só é excluído quando:

- **Todos os nós de entrada** (nós sem arestas de entrada, excluindo sticky/errorHandler) têm `active === false`

Se qualquer nó de entrada ainda estiver ativo, o workflow permanece até a próxima execução.

## UI do Dashboard

- **Linhas de pasta** – Nova Pasta, árvore de pastas recursiva com expandir/recolher. Cada pasta carrega uma
  descrição opcional sob o seu nome e um badge que conta os workflows que ela contém, incluindo
  subpastas.
- **Ações de pasta** – Nova Subpasta, Renomear, Alterar ícone, Baixar como ZIP e Excluir ficam inline
  em cada linha de pasta; o menu de contexto do clique direito oferece o mesmo conjunto, e os telefones exibem um único
  botão de menu.
- **Área principal** – Workflows raiz (sem pasta, não agendados) e Agendado para Exclusão
- **Pré-visualização de soltar em pasta** – Arrastar um workflow destaca a pasta ou subpasta exata e
  mostra o seu caminho completo numa pré-visualização do tamanho de um card. Uma pasta recolhida expande após um breve hover.
- **Feedback de arrasto estável** – O card de origem usa um drag ghost, e o alvo de soltar ativo permanece
  selecionado ao rolar ou cruzar controles dentro da mesma pasta.
- **Verificação de destino** – A pasta atual é mostrada como **Já está na Pasta** e não aceita
  uma movimentação redundante.
- **Outras zonas de soltar** – Raiz e "Agendado para Exclusão" destacam-se quando podem aceitar o
  workflow arrastado.
- **Soltar ZIP** – Solte um arquivo ZIP na área de workflows para importar uma estrutura de pastas no nível raiz

## Relacionado

- [Aba Workflows](../tabs/workflows-tab.md) – Crie e gerencie workflows
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhe credenciais com colaboradores de workflow
- [Equipes](./teams.md) – Compartilhe workflows e credenciais com equipes
- [Conceitos Fundamentais](../getting-started/core-concepts.md) – Workflows, nós e execução
- [Estrutura de Workflow](./workflow-structure.md) – Formato JSON para workflows
- [Triggers](./triggers.md) – Nós de entrada e pontos de entrada
