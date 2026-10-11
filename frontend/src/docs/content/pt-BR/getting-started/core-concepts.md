# Conceitos Fundamentais

## Workflows

Um workflow é um grafo direcionado de [**nós**](../reference/node-types.md) conectados por **arestas**. Gerencie workflows na aba [Workflows](../tabs/workflows-tab.md). Organize-os em [pastas](../reference/workflow-organization.md). A execução flui dos [nós de trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) através dos nós de processamento até os nós de [output](../nodes/output-node.md). Consulte [Estrutura de Workflow](../reference/workflow-structure.md) para o formato JSON. Salve e compartilhe workflows como [Templates](../tabs/templates-tab.md) para reutilizá-los entre projetos. Workflows também podem ser executados a partir do [Board](../tabs/board-tab.md), onde cards kanban disparam a cadeia de workflow de uma coluna com o contexto completo do card.

## Nós

Cada nó possui:

- **Type** – Determina o comportamento (ex.: `llm`, `condition`, `http`)
- **Data** – Configuração (modelo, prompt, URL, etc.)
- **Inputs/Outputs** – Handles para conexão com outros nós

Consulte [Tipos de Nó](../reference/node-types.md) para a lista completa.

## Arestas

Arestas conectam o handle de saída de um nó de origem ao handle de entrada de um nó de destino. Os dados fluem pelas arestas durante a execução.

## Fluxo de Execução

1. **Trigger** – Nó Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger ou [WebSocket Trigger](../nodes/websocket-trigger-node.md) inicia a execução (consulte [Triggers](../reference/triggers.md))
2. **Downstream** – Cada nó recebe output dos nós upstream conectados; a [execução paralela](../reference/parallel-execution.md) executa nós independentes simultaneamente
3. **Expressões** – Os nós referenciam dados upstream via `$nodeLabel.field`. Consulte [Expression DSL](../reference/expression-dsl.md).
4. **Output** – O nó [Output](../nodes/output-node.md) produz o resultado final

## Referências de Expressão

Use `$input` para os dados do nó Input e `$nodeLabel.field` para qualquer nó upstream. Exemplo: `$llm.text` referencia o campo `text` de um nó rotulado como "llm". Sintaxe completa: [Expression DSL](../reference/expression-dsl.md). Use o [Diálogo de Avaliação de Expressão](../reference/expression-evaluation-dialog.md) para um editor maior com preview em tempo real do backend ao editar expressões.

## Relacionados

- [Início Rápido](./quick-start.md) – Construa seu primeiro workflow
- [Recursos do Canvas](../reference/canvas-features.md) – Data pin, logs de execução, habilitar/desabilitar, extrair para sub-workflow
- [Assistente de IA](../reference/ai-assistant.md) – Crie workflows com linguagem natural
- [Tipos de Nó](../reference/node-types.md) – Todos os nós disponíveis
- [Expression DSL](../reference/expression-dsl.md) – Referenciando dados em expressões
- [Diálogo de Avaliação de Expressão](../reference/expression-evaluation-dialog.md) – Editor expansível com preview em tempo real do backend
- [Aba Workflows](../tabs/workflows-tab.md) – Gerencie workflows e pastas
- [Organização de Workflows](../reference/workflow-organization.md) – Pastas e exclusão agendada
- [Triggers](../reference/triggers.md) – Pontos de entrada para workflows
- [Webhooks](../reference/webhooks.md) – Trigger de webhook HTTP (TTL, cache, rate limit)
- [Execução Paralela](../reference/parallel-execution.md) – Como os nós são executados em paralelo
