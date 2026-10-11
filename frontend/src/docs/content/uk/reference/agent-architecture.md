# Архітектура Agent

[Agent Node](../nodes/agent-node.md) підтримує субагенти, sub-workflows, інструменти вузлів canvas, шаблон оркестратора, skills, з'єднання MCP, виклик інструментів, опціональну [постійну пам'ять](./agent-persistent-memory.md) (для кожного вузла canvas, з опціональним спільним доступом для інших агентів) та опціональний [людський перегляд](./human-in-the-loop.md). Ця сторінка описує архітектуру.

## Субагенти

Субагенти — це вузли agent, які оркестратор може викликати через інструмент `call_sub_agent`.

- **Оркестратор**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Субагенти**: Повинні використовувати `$input.text` у своєму User Message, щоб отримати prompt оркестратора
- **Інструмент**: `call_sub_agent` з `sub_agent_label` (enum) та `prompt`
- **Обмеження глибини**: Максимум 5 вкладених викликів субагентів

### Потік виконання

1. Оркестратор вирішує викликати субагента
2. `_execute_sub_agent_tool` знаходить цільовий agent за label
3. Формує `synthetic_inputs = {"input": {"text": prompt}}`
4. Запускає `_execute_agent_node` для субагента
5. Результат повертається оркестратору

### Паралельне виконання субагентів

Коли оркестратор повертає кілька викликів інструменту `call_sub_agent` за один хід, вони виконуються **паралельно**. Наприклад, якщо користувач запитує про "Paris" і оркестратор викликає одночасно `distanceAgent` та `foodAgent`, обидва запускаються одночасно, а не послідовно.

- **Перевага**: Загальний час приблизно дорівнює найповільнішому субагенту, а не сумі всіх.
- **Підказка**: Заохочуйте оркестратор викликати кілька субагентів за один хід, коли цього вимагає завдання.

## Sub-Workflows

Коли налаштовано `subWorkflowIds`, agent може викликати інші workflows через інструмент `call_sub_workflow`.

- **Конфігурація**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Інструмент**: `call_sub_workflow` з `workflow_id` (enum) та `inputs` (object)
- **Обмеження глибини**: Максимум 5 вкладених викликів sub-workflow

### Потік виконання

1. Agent вирішує викликати sub-workflow
2. `_execute_sub_workflow_tool` отримує workflow з `workflow_cache`
3. Формує `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Запускає `WorkflowExecutor.execute()` для sub-workflow
5. Результат повертається agent

Sub-workflows не можуть призупинятися для HITL у v1. Якщо вкладений sub-workflow намагається перейти в стан очікування перегляду, виконання завершується помилкою замість призупинення всередині вкладеного виклику.

## Інструменти вузлів Canvas

Інструменти вузлів canvas — це вузли workflow, підключені до agent через handle `tool-input`. Під час налаштування agent `_build_node_tool_schemas` сканує ці ребра та додає одну сумісну з OpenAI схему інструменту для кожного підключеного вузла.

- **Джерело інструменту**: `_source: "node_tool"`
- **Назва інструменту**: походить від label підключеного вузла, з додаванням суфіксів для дублікатів
- **Параметри інструменту**: формуються з `agentProvidedFields` вузла
- **Фіксовані поля**: усі поля вузла, не вказані в `agentProvidedFields`, залишаються в конфігурації вузла

### Потік виконання

1. Agent вирішує викликати інструмент підключеного вузла
2. `_execute_node_tool` копіює дані вузла
3. Надані agent аргументи об'єднуються з налаштованими полями вузла
4. `execute_node` запускає цей вузол один раз з вимкненим плануванням гілок
5. Оригінальні дані вузла відновлюються
6. Вивід вузла повертається agent як результат інструменту

Вузли інструментів виключаються зі звичайного планування workflow, щоб вони не запускалися двічі. Вони виконуються лише через шлях виклику інструменту agent.

## Human-in-the-Loop

Коли на agent встановлено `hitlEnabled`, agent отримує інструмент `request_human_review`, який він може викликати на певних контрольних точках затвердження.

1. Системний prompt та HITL-настанови вузла вказують agent, які дії потребують затвердження
2. Коли agent досягає одного з цих кроків, він викликає `request_human_review`
3. Heym зберігає знімок виконання workflow та створює публічний запит на перегляд
4. Результат вузла позначається як `pending` з URL перегляду
5. Вихідний handle `review` agent планується негайно, щоб гілки сповіщень могли запуститися з payload у стані очікування
6. Планування основного виконання зупиняється, доки рецензент не відповість
7. При `accept`, `edit` або `refuse` виконавець відновлюється зі збереженого знімка
8. Призупинений agent продовжує роботу із затвердженим контекстом перегляду або негайно завершується при `refuse`
9. Нижчі вузли продовжують роботу після завершення відновленого agent, без повторного запуску гілки `review`
10. Якщо пізніша дія також потребує затвердження, agent може створити ще одну контрольну точку HITL у тому самому запуску

Підсумок для рецензента генерується із самого запиту на перегляд, тому поле вузла може залишатися зосередженим на політиці затвердження та часі.

Це дозволяє agent-workflows чекати на зовнішнє затвердження, зберігаючи історію розмови, виводи завершених вузлів, стан циклу та інший контекст виконання.

## Виконавець інструментів оркестратора

Кастомний виконавець інструментів маршрутизує:

- **Виклики субагентів** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Виклики sub-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Інструменти вузлів canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Людський перегляд** (`_source == "hitl"`) → створює контрольну точку HITL у стані очікування
- **Інші інструменти** → `_unified_tool_executor` (Python, MCP, інструменти skills)

Він використовується, коли ввімкнено HITL, коли встановлено `isOrchestrator` з `subAgentLabels` або коли налаштовано `subWorkflowIds`.

## Skills

Skills розширюють системний контекст агента та можуть додавати Python-інструменти.

- **Форма**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Вміст**: Додається на початок системної інструкції (об'єднується через `---`)
- **Python-інструменти**: Для кожного skill з файлами `.py` додається інструмент `skill_{skill_name}`
- **Виконання**: `skill_python_executor.py` запускає скрипти через `uv run python` у тимчасовій директорії; аргументи як JSON на stdin, результат як JSON на stdout

Skills можна додати, перетягнувши файл `.zip` або `.md` у область Skills у конфігурації [Agent Node](../nodes/agent-node.md).

## MCP Client

Клієнт MCP (Model Context Protocol) підключається до зовнішніх серверів інструментів.

- **Транспорти**: `stdio` (команда + аргументи) або `sse` (url + headers)
- **Список інструментів**: `list_mcp_tools` → `ClientSession.list_tools()` → конвертується у формат функцій OpenAI з `_source: "mcp"`
- **Виконання**: `execute_mcp_tool` → `ClientSession.call_tool()` → результат через `_extract_tool_result`

Налаштуйте MCP-з'єднання на вкладці [MCP Tab](../tabs/mcp-tab.md) або в `mcpConnections` вузла агента.

## Tool Calling

Сервіс LLM виконує цикл `execute_with_tools`:

1. **Перевірка стиснення контексту** — перед кожною ітерацією оцініть використання token і за потреби стисніть (див. нижче)
2. Виклик моделі з `tools` та `tool_choice: "auto"`
3. Якщо є `tool_calls`: для кожного виклику запустіть `tool_executor(tool_def, name, args, timeout)`
4. Додайте результат інструмента до messages, повторіть
5. Зупиніться, коли більше немає викликів інструментів або досягнуто `max_tool_iterations`

### Tool Dispatch

`_unified_tool_executor` маршрутизує за `_source`:

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (default) | `execute_tool` (Python code tools) |

Інструменти використовують формат function-calling OpenAI: `name`, `description`, `parameters` (JSON schema).

## Context Compression

Щоб запобігти переповненню контексту в агентів, що працюють довго, Heym автоматично стискає накопичений список `messages` перед кожною ітерацією інструментів.

### Алгоритм

1. **Оцінка token**: `total_chars / 4` по всіх messages (швидко, без tokenizer)
2. **Перевірка порогу**: якщо `estimated_tokens < context_limit × 0.80`, пропустити стиснення
3. **Ліміт контексту**: спробуйте `client.models.retrieve(model).context_window`; інакше використайте вбудовану таблицю (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M тощо); за замовчуванням 128K
4. **Збереження якорів**: завжди зберігайте
   - Перше `system` message (ідентичність та інструкції агента)
   - Перше `user` message (початкове завдання)
   - Останнє `user` message (найновіша інструкція)
5. **Підсумування середини**: усе між першим і останнім user message серіалізується та надсилається тій самій моделі з prompt для підсумування
6. **Перебудова**: `[system, first_user, assistant(summary), last_user]`

Стиснення пропускається, якщо є менше ніж 2 різних user message (немає середини для підсумування) або якщо виклик підсумування LLM зазнав невдачі (безпечний fallback: повернути оригінальні messages).

### Observability

Кожна подія стиснення записується як:
- Запис `_context_compression` у `tool_calls_collected` → видно в деталях запуску Execution History
- Подія `on_tool_call` з `phase: "compression"` → відображається в панелі Debug як `Context compressed (N messages → summary)`
- Запис трасування LLM `context.compression` → видно на вкладці Traces з оцінками token до/після

Виклики інструментів агента також генерують багатшу observability:

- Поля життєвого циклу для кожного виклику в `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Агреговані `tool_metrics` у результаті агента (кількість за статусом плюс загальна/максимальна тривалість); записи `_context_compression` виключаються з цих підрахунків
- Опціональні дочірні spans OpenTelemetry з назвою `heym.agent.tool.execute` (див. [OpenTelemetry Tracing](./opentelemetry.md))
- Збережені payloads трасування LLM / execution-history `tool_calls` редагуються та обмежуються за розміром; живий стан HITL resume зберігає оригінали для зіставлення

## Related

- [Why Heym](../getting-started/why-heym.md) – Multi-agent orchestration across the agent lifecycle
- [Agent Node](../nodes/agent-node.md) – Configuration and parameters
- [Agent Persistent Memory](./agent-persistent-memory.md) – Knowledge graph per agent node and peer sharing
- [Human-in-the-Loop](./human-in-the-loop.md) – Review links, pending payloads, and resume behavior
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow, node, and Agent tool spans
- [Node Types](./node-types.md) – Agent and related nodes
- [Parallel Execution](./parallel-execution.md) – DAG-based and sub-agent parallel execution
- [MCP Tab](../tabs/mcp-tab.md) – Configure MCP connections
- [Expression DSL](./expression-dsl.md) – `$input.text` for sub-agents
