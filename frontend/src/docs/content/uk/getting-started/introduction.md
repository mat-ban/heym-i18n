# Вступ

**Створюйте агентні системи. Запускайте їх упевнено.**

Heym — це інфраструктура для запуску та керування AI-агентами у production. Оркеструйте агентів, автоматизуйте бізнес-процеси, перевіряйте кожне виконання та зберігайте контроль за людьми. Розгортайте Heym на власній інфраструктурі.

У Heym workflow визначає, як агенти, детерміновані кроки, інструменти та дані працюють разом. Runtime виконує цей граф, записує кожен запуск і зупиняється для перевірки людиною там, де Ви це вказали. Візуальне полотно — це місце, де Ви створюєте та перевіряєте workflow, а ті самі workflow також запускаються з API, розкладів, event triggers, MCP-клієнтів і чатів Portal. Відвідайте [heym.run](https://heym.run), щоб переглянути сайт продукту, і дивіться [Why Heym](./why-heym.md), щоб дізнатися, що Heym обробляє на кожному етапі життєвого циклу агента.

## Що Ви можете робити

- **Створювати** – Компонуйте агентів і детерміновані кроки на [полотні](../reference/canvas-features.md) у вкладці [Workflows](../tabs/workflows-tab.md), описуйте їх для [AI Assistant](../reference/ai-assistant.md) або починайте з [Templates](../tabs/templates-tab.md)
- **Оркеструвати** – Координуйте вузли [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) і [RAG](../nodes/rag-node.md), [sub-agents](../reference/agent-architecture.md), MCP-інструменти та [інтеграції](../reference/integrations.md), як-от HTTP, Slack і email, з [паралельним виконанням](../reference/parallel-execution.md), де це дозволяють залежності
- **Запускати** – Запускайте workflow з [webhooks](../reference/webhooks.md), розкладів [Cron](../nodes/cron-node.md) і event [triggers](../reference/triggers.md), з повторними спробами для кожного вузла, [обробкою помилок](../nodes/error-handler-node.md) і [розподілом навантаження](../reference/cluster.md) між інстансами
- **Спостерігати** – Перевіряйте [історію виконань](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md) з вартістю token, [аналітику](../tabs/analytics-tab.md) та [сповіщення](../tabs/alerts-tab.md), а також експортуйте [OpenTelemetry](../reference/opentelemetry.md) traces
- **Оцінювати** – Тестуйте prompts і моделі на відповідність очікуваним результатам у вкладці [Evals](../tabs/evals-tab.md)
- **Контролювати** – Зупиняйте агентів для [перевірки людиною](../reference/human-in-the-loop.md), блокуйте небезпечний вміст за допомогою [guardrails](../reference/guardrails.md) і керуйте доступом через [credentials](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) та [журнал аудиту](../reference/audit.md)
- **Надавати доступ** – Надавайте workflow через REST і [SSE streaming](../reference/sse-streaming.md), як інструменти [MCP](../tabs/mcp-tab.md) і як чат-інтерфейси [Portal](../reference/portal.md) для кінцевих користувачів; використовуйте вкладку [Chat](../tabs/chat-tab.md), щоб тестувати моделі безпосередньо
- **Спілкуватися з Heym** – Ставте запитання про продукт із урахуванням сторінки в діалозі [Chat with Heym](../reference/chat-with-heym.md) у документації

## Ключові концепції

- **Workflows** – Орієнтований граф вузлів і ребер. Керуйте ними у вкладці [Workflows](../tabs/workflows-tab.md). Дивіться [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Одиниці обробки ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) тощо). Дивіться [Node Types](../reference/node-types.md).
- **Edges** – Зв'язки, що визначають потік виконання
- **Credentials** – API-ключі та секрети, що зберігаються у вкладці [Credentials](../tabs/credentials-tab.md) і на які посилаються вузли.
- **Variables** – Постійні дані типу ключ-значення у вкладці [Variables](../tabs/global-variables-tab.md), доступні через `$global.variableName`. Дивіться [Global Variables](../reference/global-variables.md).
- **Expressions** – Посилайтеся на дані попередніх вузлів за допомогою `$input` і `$nodeName.field`. Дивіться [Expression DSL](../reference/expression-dsl.md).

## Пов'язане

- [Why Heym](./why-heym.md) – Що Heym обробляє на кожному етапі життєвого циклу агента
- [Quick Start](./quick-start.md) – Створіть свій перший workflow
- [Running & Deployment](./running-and-deployment.md) – Запустіть локально за допомогою `run.sh` або розгорніть за допомогою `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Створюйте workflow природною мовою
- [Chat with Heym](../reference/chat-with-heym.md) – Ставте додаткові запитання під час читання документації
- [Core Concepts](./core-concepts.md) – Workflows, вузли та потік виконання
- [Workflows Tab](../tabs/workflows-tab.md) – Керуйте workflow і теками
- [Credentials Tab](../tabs/credentials-tab.md) – Додавайте API-ключі для вузлів
