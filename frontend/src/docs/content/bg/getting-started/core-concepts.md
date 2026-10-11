# Основни концепции

## Workflows

Един workflow представлява насочен граф от [**nodes**](../reference/node-types.md), свързани чрез **edges**. Управлявайте workflows в раздела [Workflows](../tabs/workflows-tab.md). Организирайте ги в [папки](../reference/workflow-organization.md). Изпълнението протича от [trigger nodes](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) през processing nodes до [output](../nodes/output-node.md) nodes. Вижте [Workflow Structure](../reference/workflow-structure.md) за JSON формата. Запазвайте и споделяйте workflows като [Templates](../tabs/templates-tab.md), за да ги използвате повторно в различни проекти. Workflows могат да се стартират и от [Board](../tabs/board-tab.md), където kanban картите задействат workflow веригата на дадена колона с пълния контекст на картата.

## Nodes

Всеки node има:

- **Type** – Определя поведението (напр. `llm`, `condition`, `http`)
- **Data** – Конфигурация (модел, prompt, URL и т.н.)
- **Inputs/Outputs** – Манипулатори за свързване с други nodes

Вижте [Node Types](../reference/node-types.md) за пълния списък.

## Edges

Edges свързват output манипулатора на изходния node с input манипулатора на целевия node. По време на изпълнение данните преминават по edges.

## Execution Flow

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger или [WebSocket Trigger](../nodes/websocket-trigger-node.md) node стартира изпълнението (вижте [Triggers](../reference/triggers.md))
2. **Downstream** – Всеки node получава output от свързаните upstream nodes; [parallel execution](../reference/parallel-execution.md) изпълнява независими nodes едновременно
3. **Expressions** – Nodes реферират upstream данни чрез `$nodeLabel.field`. Вижте [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md) node произвежда крайния резултат

## Референции към изрази

Използвайте `$input` за данните на Input node и `$nodeLabel.field` за всеки upstream node. Пример: `$llm.text` реферира полето `text` от node с етикет "llm". Пълен синтаксис: [Expression DSL](../reference/expression-dsl.md). Използвайте [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) за по-голям редактор с live backend preview при редактиране на изрази.

## Свързани

- [Quick Start](./quick-start.md) – Създайте първия си workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, execution logs, enable/disable, extract to sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Създавайте workflow-и с естествен език
- [Node Types](../reference/node-types.md) – Всички налични node-ове
- [Expression DSL](../reference/expression-dsl.md) – Референциране на данни в изрази
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Разгъваем редактор с live backend preview
- [Workflows Tab](../tabs/workflows-tab.md) – Управление на workflow-и и папки
- [Workflow Organization](../reference/workflow-organization.md) – Папки и планирано изтриване
- [Triggers](../reference/triggers.md) – Входни точки за workflow-и
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Как node-овете се изпълняват паралелно
