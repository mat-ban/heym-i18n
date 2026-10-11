# Conceitos Fundamentais

## Workflows

Um workflow é um grafo direcionado de [**nós**](../reference/node-types.md) ligados por **arestas**. Faça a gestão dos workflows no separador [Workflows](../tabs/workflows-tab.md). Organize-os em [pastas](../reference/workflow-organization.md). A execução flui dos [nós de trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) através de nós de processamento até aos nós de [output](../nodes/output-node.md). Consulte [Estrutura do Workflow](../reference/workflow-structure.md) para o formato JSON. Guarde e partilhe workflows como [Modelos](../tabs/templates-tab.md) para os reutilizar entre projetos. Os workflows também podem ser executados a partir do [Board](../tabs/board-tab.md), onde os cartões kanban despoletam a cadeia de workflows de uma coluna com o contexto completo do cartão.

## Nós

Cada nó tem:

- **Tipo** – Determina o comportamento (por exemplo, `llm`, `condition`, `http`)
- **Dados** – Configuração (modelo, prompt, URL, etc.)
- **Entradas/Saídas** – Pontos de ligação para outros nós

Consulte [Tipos de Nó](../reference/node-types.md) para a lista completa.

## Arestas

As arestas ligam o ponto de saída de um nó de origem ao ponto de entrada de um nó de destino. Os dados fluem ao longo das arestas durante a execução.

## Fluxo de Execução

1. **Trigger** – Um nó Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger ou [WebSocket Trigger](../nodes/websocket-trigger-node.md) inicia a execução (consulte [Triggers](../reference/triggers.md))
2. **A jusante** – Cada nó recebe o output dos nós a montante ligados; a [execução paralela](../reference/parallel-execution.md) executa nós independentes em simultâneo
3. **Expressões** – Os nós referenciam dados a montante através de `$nodeLabel.field`. Consulte [Expression DSL](../reference/expression-dsl.md).
4. **Output** – O nó [Output](../nodes/output-node.md) produz o resultado final

## Referências de Expressões

Utilize `$input` para os dados do nó Input e `$nodeLabel.field` para qualquer nó a montante. Exemplo: `$llm.text` referencia o campo `text` de um nó com a etiqueta "llm". Sintaxe completa: [Expression DSL](../reference/expression-dsl.md). Utilize a [Caixa de Diálogo de Avaliação de Expressões](../reference/expression-evaluation-dialog.md) para um editor maior com pré-visualização em tempo real do backend ao editar expressões.

## Relacionado

- [Início Rápido](./quick-start.md) – Construa o seu primeiro workflow
- [Funcionalidades do Canvas](../reference/canvas-features.md) – Data pin, registos de execução, ativar/desativar, extrair para sub-workflow
- [Assistente de IA](../reference/ai-assistant.md) – Crie workflows com linguagem natural
- [Tipos de Nó](../reference/node-types.md) – Todos os nós disponíveis
- [Expression DSL](../reference/expression-dsl.md) – Referenciar dados em expressões
- [Caixa de Diálogo de Avaliação de Expressões](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend
- [Separador Workflows](../tabs/workflows-tab.md) – Faça a gestão de workflows e pastas
- [Organização de Workflows](../reference/workflow-organization.md) – Pastas e eliminação agendada
- [Triggers](../reference/triggers.md) – Pontos de entrada para workflows
- [Webhooks](../reference/webhooks.md) – Trigger de webhook HTTP (TTL, cache, limite de taxa)
- [Execução Paralela](../reference/parallel-execution.md) – Como os nós são executados em paralelo
