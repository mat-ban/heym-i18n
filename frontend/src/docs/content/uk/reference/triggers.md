# Triggers

Workflow запускаються **trigger nodes** або **entry points**. Кожен тип trigger має власний endpoint або фоновий процес.

## Trigger Nodes

Стартові nodes (без вхідних ребер), які ініціюють виконання:

| Тип Node | Опис |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP entry point. Отримує `body`, `headers`, `query` із запитів. |
| [Cron](../nodes/cron-node.md) | Запускається за розкладом (cron expression, наприклад `0 * * * *` для щогодинного запуску). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Запускається, коли Telegram надсилає оновлення bot webhook на webhook URL, специфічний для node. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Запускається, коли Discord надсилає webhook Interactions API на endpoint, специфічний для node. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Опитує поштову скриньку IMAP і запускається один раз для кожного нововиявленого листа. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Запускається, коли Heym публікує подію платформи. Події в одному вікні dispatch надходять разом як масив. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Відкриває вихідне клієнтське з'єднання до зовнішнього socket і запускається на вибраних подіях socket. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Створює одноразовий upload URL і запускається, коли викликач надсилає великий multipart-файл. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Запускається, коли повідомлення споживається з черги RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Запускається, коли Slack надсилає подію через webhook Events API. |

## Entry Points

| Trigger | Endpoint / Джерело | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | заголовок `X-MCP-Key` або `Authorization: Bearer` (лише headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal session token |
| **Board** | [Board](../tabs/board-tab.md) переміщення картки / follow-up run у стовпець із workflow chain (`trigger_source="board"`) | JWT (власник board) |
| **Cron** | Планувальник Cron (запускається кожні 60 с, обчислює cron expressions) | N/A |
| **IMAP** | Менеджер IMAP trigger (leader worker, інтервал опитування для кожного node) | IMAP username/password |
| **WebSocket** | Менеджер вихідних WebSocket trigger (leader worker, постійні клієнтські з'єднання) | Опціональні headers для кожного node |
| **File Upload** | `POST /api/file-intake/u/{token}` після створення слота | Одноразовий capability token |
| **RabbitMQ** | Споживач RabbitMQ (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 signing secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Публічний ключ застосунку Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Опціональний `x-telegram-bot-api-secret-token` |
| **Editor** | Те саме, що Webhook, через `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Тіло запиту передається як `body` до textInput nodes
- **Body mode**: Workflow можуть використовувати `defined` приклади у формі полів або `generic` приклади raw JSON у редакторі та діалозі cURL
- **Auth**: Налаштовується для кожного workflow (`auth_type`, `allow_anonymous`)

Деталі щодо TTL, cache, rate limiting та auth дивіться у [Webhooks](./webhooks.md).

### MCP

Workflow з `mcp_enabled=true` відображаються як tools для клієнтів MCP. Назва tool походить від назви workflow. Дивіться [MCP Tab](../tabs/mcp-tab.md).

### Portal

Публічний чат-інтерфейс за адресою `/chat/{slug}`. Деталі дивіться у [Portal](./portal.md).

### Cron

Планувальник Cron запускається кожні 60 секунд, знаходить workflow з активними `cron` nodes, обчислює cron expressions і запускає відповідні workflow. Input містить `{"triggered_by": "cron"}`.

### IMAP

Менеджер IMAP trigger працює в leader worker і перевіряє активні `imapTrigger` nodes згідно з налаштованим `pollIntervalMinutes`. Кожен node зберігає курсор IMAP (`UIDVALIDITY` + останній побачений UID). Input містить `email`, `triggered_by: "imap"`, `trigger_node_id` та `triggered_at`.

### Heym Platform Events

Диспетчер подій Heym опитує журнал `heym_events` кожні 5 секунд і доставляє відповідні події до активних `heymTrigger` nodes. Доставка заявляється для кожної (event, workflow, node) через унікальне обмеження, тому подія спрацьовує рівно один раз для кожного node-підписника на кожному worker, container і машині. Кожна подія, заявлена за один прохід, доставляється в одному запуску: input містить `events` (завжди масив, найстаріші спочатку), `count`, `triggered_by: "heym_event"`, `trigger_node_id` та `triggered_at`. Диспетчеризуються лише події, опубліковані за останні 5 хвилин, що запобігає повторному відтворенню накопичених подій після збою; події зберігаються протягом 7 днів.

### WebSocket

Менеджер WebSocket trigger працює в leader worker і підтримує одне вихідне клієнтське з'єднання для кожного активного [WebSocket Trigger](../nodes/websocket-trigger-node.md) node. Він може генерувати запуски для `onMessage`, `onConnected` та `onClosed`. Input містить `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` та одне з `message`, `connection` або `close`.

### Завантаження файлів

[File Upload Trigger](../nodes/file-upload-trigger-node.md) створює обмежений за TTL, одноразовий
слот завантаження, коли workflow викликається через API, MCP або canvas. Завантаження multipart form
data на `POST /api/file-intake/u/{token}` споживає слот, зберігає файл як Drive file та
запускає workflow синхронно. Input містить `file`, `uploaded_at`,
`triggered_by: "file_upload"` та метадані завантаження.

### Telegram

Telegram надсилає bot webhook updates на `POST /api/telegram/webhook/{node_id}`. Payload передається у workflow як `update`, `message`, опціональний `callback_query`, очищені `headers`, `triggered_by`, `trigger_node_id` та `triggered_at`. Якщо вибраний credential має secret token, Heym перевіряє `x-telegram-bot-api-secret-token` перед виконанням.

### Discord

Discord надсилає interaction webhooks на `POST /api/discord/webhook/{node_id}`. Payload передається у workflow як `interaction`, `type`, `data`, очищені `headers`, `triggered_by`, `trigger_node_id` та `triggered_at`. Heym перевіряє запит за допомогою Ed25519 та публічного ключа застосунку вибраного credential `discord_trigger` перед виконанням.

### RabbitMQ

Consumer RabbitMQ запускається, коли ініціалізується leader worker. Workflow з вузлами `rabbitmq`, де `rabbitmqOperation === "receive"`, отримують consumer. Input містить `message_data` (body, headers, routing_key тощо) та `triggered_by: "rabbitmq"`.

## Ліміт одночасності

Workflow із [лімітом одночасності](./webhooks.md#concurrency-limit-and-queued-runs) ставить у чергу виробничі запуски з кожної точки входу вище, коли його слоти заповнені, у порядку живої черги (FIFO), на всіх екземплярах. Те, як клієнт дізнається про результат, залежить від точки входу:

| Entry point | Поки запуск очікує |
|---|---|
| Webhook / API | `202 Accepted` із `execution_id` та URL статусу |
| SSE streaming, Quick Drawer, Portal chat | Потік залишається відкритим і надсилає події `queued` |
| Portal without streaming | Запит очікує на результат |
| MCP | Результат `queued` для опитування через `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger очікує на результат так само довго, як і запуск на іншому [екземплярі](./cluster.md). Запуск виконується в будь-якому випадку і записується в історію |

Коли черга заповнена, запуск не починається, а історія записує його як `queue_full`. Тестові запуски редактора, виклики під-workflow (вузол [Execute](../nodes/execute-node.md) та інструменти workflow агента), [Evals](../tabs/evals-tab.md), тестові запуски в режимі chat build та відновлення після перегляду ніколи не ставляться в чергу. Запуски карток [Board](../tabs/board-tab.md), запуски [File Upload](../nodes/file-upload-trigger-node.md), запуски, ініційовані інструментом run-workflow асистента ШІ, та workflow сповіщень про попередження також запускаються без очікування слота.

## trigger_source

Історія виконань записує `trigger_source` для кожної точки входу:

| Значення | Коли |
|-------|------|
| `"API"` | Webhook / API виклик без явного header (за замовчуванням) |
| `"Canvas"` | Запуск з canvas редактора workflow |
| `"Quick Drawer"` | Запуск із панелі quick-drawer редактора, включно із запусками файлів, завантажених із її зони перетягування |
| `"cron"` | Планувальник Cron |
| `"imap"` | Менеджер IMAP trigger |
| `"websocket"` | Менеджер вихідних WebSocket trigger |
| `"file_upload"` | Endpoint завантаження File Upload Trigger (посилання, створені через HTTP, MCP або полотно) |
| `"dashboard"` | Запуски віджетів панелі керування та завантаження з віджета перетягування файлів |
| `"telegram"` | Webhook бота Telegram |
| `"Discord"` | Webhook взаємодій Discord |
| `"MCP"` | Виклик інструменту MCP |
| `"portal"` | Виконання через Portal |
| `"dashboard_chat"` | Чат AI-асистента |
| `"AI Agents"` | Sub-workflow, викликаний вузлом AI agent |
| `"SUB_WORKFLOW"` | Sub-workflow, викликаний вузлом Execute Workflow |
| custom | Будь-яке значення, надіслане в header `X-Trigger-Source` або параметрі `trigger_source` query/body |
| (не встановлено) | Consumer RabbitMQ |

## Inputs за Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` із запиту
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + опціональний `callback_query` + очищені `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + очищені `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (повний об'єкт події Slack) + `headers` (очищені) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + опціональний `conversation_history`

## Пов'язане

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow Structure](./workflow-structure.md) – Вузли та ребра
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Webhook trigger взаємодій Discord
- [Quick Start](../getting-started/quick-start.md) – Створення workflow з Input
- [Portal](./portal.md) – Portal trigger та чат UI
- [Execution History](./execution-history.md) – Перегляд минулих запусків і trigger_source
