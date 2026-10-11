# Бърз старт

Стартирайте първия си Workflow в Heym за минути.

Все още ли не сте стартирали Heym? Вижте [Стартиране и внедряване](./running-and-deployment.md) или следвайте видео ръководството: [Настройте Heym локално за под 2 минути](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Създайте Workflow

1. Отворете раздела [Workflows](../tabs/workflows-tab.md)
2. Натиснете **New Workflow**
3. Дайте име на вашия workflow (напр. „Hello World")

## 2. Добавете Nodes

1. Отворете панела **Nodes** отляво
2. Плъзнете [Input](../nodes/input-node.md) node върху работната площ
3. Плъзнете [LLM](../nodes/llm-node.md) node и го свържете с Input
4. Плъзнете [Output](../nodes/output-node.md) node и го свържете с LLM

```
[Input] --> [LLM] --> [Output]
```

Вижте [Node Types](../reference/node-types.md) за всички налични nodes.

## 3. Конфигурирайте

- **Input**: Задайте стойност по подразбиране или оставете празно за въвеждане от потребителя (вижте [Input Node](../nodes/input-node.md))
- **LLM**: Изберете [credential](../tabs/credentials-tab.md) и модел, добавете системна инструкция и задайте `userMessage` на `$input.text` (вижте [LLM Node](../nodes/llm-node.md))
- **Output**: Задайте `message` на `$llm.text`, за да предадете отговора от LLM (вижте [Output Node](../nodes/output-node.md))

Използвайте синтаксиса на [Expression DSL](../reference/expression-dsl.md) за `$input.text` и `$llm.text`. Натиснете бутона за разгъване върху полетата за изрази, за да отворите [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) с преглед на живо от backend.

## 4. Стартирайте

Натиснете **Run**, натиснете `Ctrl + Enter` или използвайте debug панела, за да изпълните. Workflow се изпълнява от Input node през свързаните nodes до Output. Вижте [Triggers](../reference/triggers.md) за други начини за стартиране на workflows ([webhook](../reference/webhooks.md), портал, cron и др.).

Прегледайте предишни изпълнения в **History** (лентата с инструменти) и използвайте **Bring to Canvas**, за да ги стартирате отново със същите входни данни.

В Docs, Evals и други вътрешни страници извън работната площ можете също да използвате [Quick Drawer](../reference/quick-drawer.md), за да изберете закачен workflow и да го стартирате, без да се връщате към редактора.

Ако четете документацията и искате пояснение преди да започнете, отворете [Chat with Heym](../reference/chat-with-heym.md) от хедъра на Docs, за да зададете въпроси, свързани с текущата страница.

Като алтернатива използвайте [AI Assistant](../reference/ai-assistant.md) от Debug панела, за да създавате workflows с естествен език—опишете какво искате и AI генерира nodes и връзки.

Вече създавате автоматизации в друг инструмент? [Migrate to Heym](./migrate-to-heym.md) преобразува workflow от n8n, Flowise, Dify, Langflow, sim.ai или Activepieces във workflow за Heym, който можете да импортирате.

## Свързани

- [Основни концепции](./core-concepts.md) – Workflows, nodes и поток на изпълнение
- [Мигриране към Heym](./migrate-to-heym.md) – Конвертирайте n8n, Flowise, Dify, Langflow, sim.ai или Activepieces workflows към Heym с AI
- [Стартиране и внедряване](./running-and-deployment.md) – Стартирайте локално с `run.sh` или внедрете с `deploy.sh`
- [Променливи на средата](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Пълна справка за конфигурацията
- [Настройки](../reference/user-settings.md) – Конфигурирайте име, User Rules и парола
- [Функции на Canvas](../reference/canvas-features.md) – Data pin, логове за изпълнение, включване/изключване, извличане в sub-workflow
- [Клавишни комбинации](../reference/keyboard-shortcuts.md) – Клавишни комбинации за Canvas и редактора
- [Expression DSL](../reference/expression-dsl.md) – Референциране на данни в конфигурацията на node
- [Диалог за оценка на изрази](../reference/expression-evaluation-dialog.md) – Разгъваем редактор с преглед на живо от backend
- [Triggers](../reference/triggers.md) – Всички входни точки на workflow ([webhook](../reference/webhooks.md), портал, cron и др.)
- [История на изпълненията](../reference/execution-history.md) – Преглед на минали изпълнения и Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Стартирайте закачени workflows от страници извън canvas
- [Чат с Heym](../reference/chat-with-heym.md) – Задавайте контекстуални въпроси от хедъра на документацията
- [Раздел Workflows](../tabs/workflows-tab.md) – Създавайте и управлявайте workflows
- [Раздел Credentials](../tabs/credentials-tab.md) – Добавяйте API keys за LLM nodes
- [AI асистент](../reference/ai-assistant.md) – Създавайте workflows с естествен език
