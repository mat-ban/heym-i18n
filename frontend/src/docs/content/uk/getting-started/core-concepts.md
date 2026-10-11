# Основні концепції

## Workflows

Workflow — це орієнтований граф [**nodes**](../reference/node-types.md), з'єднаних **edges**. Керуйте workflows на вкладці [Workflows](../tabs/workflows-tab.md). Організовуйте їх у [folders](../reference/workflow-organization.md). Виконання відбувається від [trigger nodes](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) через processing nodes до [output](../nodes/output-node.md) nodes. Дивіться [Workflow Structure](../reference/workflow-structure.md) щодо формату JSON. Зберігайте та діліться workflows як [Templates](../tabs/templates-tab.md), щоб повторно використовувати їх у різних проєктах. Workflows також можуть запускатися з [Board](../tabs/board-tab.md), де kanban-картки запускають ланцюжок workflow колонки з повним контекстом картки.

## Nodes

Кожен node має:

- **Type** – Визначає поведінку (наприклад, `llm`, `condition`, `http`)
- **Data** – Конфігурація (model, prompt, URL тощо)
- **Inputs/Outputs** – Handles для з'єднання з іншими nodes

Повний список дивіться в [Node Types](../reference/node-types.md).

## Edges

Edges з'єднують output handle вихідного node з input handle цільового node. Під час виконання дані передаються вздовж edges.

## Execution Flow

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger або [WebSocket Trigger](../nodes/websocket-trigger-node.md) node запускає виконання (дивіться [Triggers](../reference/triggers.md))
2. **Downstream** – Кожен node отримує output від з'єднаних upstream nodes; [parallel execution](../reference/parallel-execution.md) запускає незалежні nodes одночасно
3. **Expressions** – Nodes посилаються на upstream дані через `$nodeLabel.field`. Дивіться [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md) node створює фінальний результат

## Expression References

Використовуйте `$input` для даних Input node та `$nodeLabel.field` для будь-якого upstream node. Приклад: `$llm.text` посилається на поле `text` з node з міткою "llm". Повний синтаксис: [Expression DSL](../reference/expression-dsl.md). Використовуйте [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) для більшого редактора з живим backend-превʼю під час редагування expressions.

## Related

- [Quick Start](./quick-start.md) – Створіть свій перший workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, execution logs, enable/disable, extract to sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Створюйте workflows за допомогою природної мови
- [Node Types](../reference/node-types.md) – Усі доступні nodes
- [Expression DSL](../reference/expression-dsl.md) – Посилання на дані в expressions
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Розширюваний редактор з живим backend-превʼю
- [Workflows Tab](../tabs/workflows-tab.md) – Керування workflows та folders
- [Workflow Organization](../reference/workflow-organization.md) – Folders та заплановане видалення
- [Triggers](../reference/triggers.md) – Точки входу для workflows
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Як nodes виконуються паралельно
