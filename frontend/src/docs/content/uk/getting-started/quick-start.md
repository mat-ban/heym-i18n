# Швидкий старт

Запустіть свій перший Heym workflow за лічені хвилини.

Ще не запустили Heym? Дивіться [Запуск і розгортання](./running-and-deployment.md) або перегляньте відеоінструкцію: [Налаштування Heym локально менш ніж за 2 хвилини](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Створіть Workflow

1. Перейдіть на вкладку [Workflows](../tabs/workflows-tab.md)
2. Натисніть **New Workflow**
3. Дайте назву своєму workflow (наприклад, "Hello World")

## 2. Додайте Nodes

1. Відкрийте панель **Nodes** ліворуч
2. Перетягніть node [Input](../nodes/input-node.md) на полотно
3. Перетягніть node [LLM](../nodes/llm-node.md) і з'єднайте його з Input
4. Перетягніть node [Output](../nodes/output-node.md) і з'єднайте його з LLM

```
[Input] --> [LLM] --> [Output]
```

Дивіться [Node Types](../reference/node-types.md), щоб ознайомитися з усіма доступними nodes.

## 3. Налаштуйте

- **Input**: Встановіть значення за замовчуванням або залиште порожнім для введення користувачем (дивіться [Input Node](../nodes/input-node.md))
- **LLM**: Виберіть [credential](../tabs/credentials-tab.md) і модель, додайте системну інструкцію та встановіть `userMessage` як `$input.text` (дивіться [LLM Node](../nodes/llm-node.md))
- **Output**: Встановіть `message` як `$llm.text`, щоб передати відповідь LLM (дивіться [Output Node](../nodes/output-node.md))

Використовуйте синтаксис [Expression DSL](../reference/expression-dsl.md) для `$input.text` і `$llm.text`. Натисніть кнопку розгортання на полях виразів, щоб відкрити [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) з живим попереднім переглядом на боці бекенду.

## 4. Запустіть

Натисніть **Run**, натисніть `Ctrl + Enter` або скористайтеся панеллю налагодження для виконання. Workflow виконується від node Input через з'єднані nodes до Output. Дивіться [Triggers](../reference/triggers.md), щоб дізнатися про інші способи запуску workflows ([webhook](../reference/webhooks.md), portal, cron тощо).

Перегляньте минулі запуски в **History** (панель інструментів) і скористайтеся **Bring to Canvas**, щоб повторно запустити з тими самими вхідними даними.

На сторінках Docs, Evals та інших внутрішніх сторінках, що не є полотном, Ви також можете скористатися [Quick Drawer](../reference/quick-drawer.md), щоб вибрати закріплений workflow і запустити його, не повертаючись до редактора.

Якщо Ви читаєте документацію і хочете отримати роз'яснення перед створенням, відкрийте [Chat with Heym](../reference/chat-with-heym.md) із заголовка Docs, щоб поставити запитання з урахуванням контексту сторінки.

Крім того, скористайтеся [AI Assistant](../reference/ai-assistant.md) з панелі Debug, щоб створювати workflows природною мовою — опишіть, що Ви хочете, і AI згенерує nodes та edges.

Уже створюєте автоматизації в іншому інструменті? [Migrate to Heym](./migrate-to-heym.md) перетворює workflow з n8n, Flowise, Dify, Langflow, sim.ai або Activepieces на Heym workflow, який Ви можете імпортувати.

## Пов'язане

- [Core Concepts](./core-concepts.md) – Workflows, nodes і потік виконання
- [Migrate to Heym](./migrate-to-heym.md) – Перетворюйте workflows з n8n, Flowise, Dify, Langflow, sim.ai або Activepieces на Heym за допомогою AI
- [Запуск і розгортання](./running-and-deployment.md) – Запустіть локально за допомогою `run.sh` або розгорніть за допомогою `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Повний довідник конфігурації
- [Settings](../reference/user-settings.md) – Налаштуйте ім'я, User Rules і пароль
- [Canvas Features](../reference/canvas-features.md) – Data pin, журнали виконання, увімкнення/вимкнення, виокремлення в sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Сполучення клавіш для полотна та редактора
- [Expression DSL](../reference/expression-dsl.md) – Посилання на дані в конфігурації node
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Редактор, що розгортається, з живим попереднім переглядом на боці бекенду
- [Triggers](../reference/triggers.md) – Усі точки входу workflow ([webhook](../reference/webhooks.md), portal, cron тощо)
- [Execution History](../reference/execution-history.md) – Перегляд минулих запусків і Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Запуск закріплених workflows зі сторінок, що не є полотном
- [Chat with Heym](../reference/chat-with-heym.md) – Ставте контекстні запитання із заголовка документації
- [Workflows Tab](../tabs/workflows-tab.md) – Створюйте workflows і керуйте ними
- [Credentials Tab](../tabs/credentials-tab.md) – Додавайте API keys для LLM nodes
- [AI Assistant](../reference/ai-assistant.md) – Створюйте workflows природною мовою
