# Въведение

**Създавайте агентни системи. Стартирайте ги с увереност.**

Heym е инфраструктура за стартиране и управление на AI агенти в продукционна среда. Оркестрирайте агенти, автоматизирайте бизнес процеси, инспектирайте всяко изпълнение и запазете контрола в ръцете на хората. Разположете Heym на собствената си инфраструктура.

В Heym, workflow дефинира как агенти, детерминистични стъпки, инструменти и данни работят заедно. Средата за изпълнение изпълнява тази графа, записва всяко изпълнение и спира за човешки преглед там, където сте указали. Визуалният canvas е мястото, където създавате и инспектирате workflow-и, а същите тези workflow-и се стартират също от API-та, графици, event trigger-и, MCP клиенти и Portal чатове. Посетете [heym.run](https://heym.run) за продуктовия сайт и вижте [Защо Heym](./why-heym.md), за да разберете какво покрива Heym на всеки етап от жизнения цикъл на агента.

## Какво можете да правите

- **Създаване** – Композирайте агенти и детерминистични стъпки върху [canvas](../reference/canvas-features.md) в раздела [Workflows](../tabs/workflows-tab.md), опишете ги на [AI Assistant](../reference/ai-assistant.md) или започнете от [Templates](../tabs/templates-tab.md)
- **Оркестрация** – Координирайте [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) и [RAG](../nodes/rag-node.md) възли, [sub-agents](../reference/agent-architecture.md), MCP инструменти и [интеграции](../reference/integrations.md) като HTTP, Slack и имейл, с [паралелно изпълнение](../reference/parallel-execution.md) там, където зависимостите позволяват
- **Стартиране** – Стартирайте workflow-и от [webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md) графици и event [trigger-и](../reference/triggers.md), с повторни опити за всеки възел, [обработка на грешки](../nodes/error-handler-node.md) и [разпределение на натоварването](../reference/cluster.md) между инстанциите
- **Наблюдение** – Инспектирайте [история на изпълненията](../reference/execution-history.md), [LLM трасета](../tabs/traces-tab.md) с разходи за token-и, [аналитики](../tabs/analytics-tab.md) и [известия](../tabs/alerts-tab.md), и експортирайте [OpenTelemetry](../reference/opentelemetry.md) трасета
- **Оценка** – Тествайте prompt-ове и модели спрямо очаквани резултати в раздела [Evals](../tabs/evals-tab.md)
- **Контрол** – Спирайте агенти за [човешки преглед](../reference/human-in-the-loop.md), блокирайте небезопасно съдържание с [guardrails](../reference/guardrails.md) и управлявайте достъпа с [credentials](../tabs/credentials-tab.md), [екипи](../reference/teams.md), [единен вход](../reference/sso.md) и [одитен запис](../reference/audit.md)
- **Експониране** – Предоставяйте workflow-и чрез REST и [SSE streaming](../reference/sse-streaming.md), като [MCP](../tabs/mcp-tab.md) инструменти и като [Portal](../reference/portal.md) чат интерфейси за крайни потребители; използвайте раздела [Chat](../tabs/chat-tab.md), за да тествате модели директно
- **Чат с Heym** – Задавайте въпроси за продукта, съобразени с текущата страница, от диалога [Chat with Heym](../reference/chat-with-heym.md) в документацията

## Ключови концепции

- **Workflows** – Насочен граф от nodes и edges. Управлявайте ги в раздела [Workflows](../tabs/workflows-tab.md). Вижте [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Обработващи единици ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) и др.). Вижте [Node Types](../reference/node-types.md).
- **Edges** – Връзки, които дефинират потока на изпълнение
- **Credentials** – API ключове и тайни, съхранявани в раздела [Credentials](../tabs/credentials-tab.md), реферирани от nodes.
- **Variables** – Постоянни данни тип ключ-стойност в раздела [Variables](../tabs/global-variables-tab.md), достъпни чрез `$global.variableName`. Вижте [Global Variables](../reference/global-variables.md).
- **Expressions** – Рефериране на upstream данни с `$input` и `$nodeName.field`. Вижте [Expression DSL](../reference/expression-dsl.md).

## Свързани

- [Why Heym](./why-heym.md) – Какво управлява Heym на всеки етап от жизнения цикъл на агента
- [Quick Start](./quick-start.md) – Създайте своя първи workflow
- [Running & Deployment](./running-and-deployment.md) – Стартирайте локално с `run.sh` или deploy-нете с `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Създавайте workflows с естествен език
- [Chat with Heym](../reference/chat-with-heym.md) – Задавайте допълнителни въпроси, докато четете документацията
- [Core Concepts](./core-concepts.md) – Workflows, nodes и поток на изпълнение
- [Workflows Tab](../tabs/workflows-tab.md) – Управление на workflows и папки
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне на API ключове за nodes
