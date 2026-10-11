# Triggers

Workflows се стартират от **trigger nodes** или **entry points**. Всеки тип trigger има собствен endpoint или фонов процес.

## Trigger Nodes

Начални nodes (без входящи връзки), които инициират изпълнение:

| Тип node | Описание |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP entry point. Получава `body`, `headers`, `query` от заявките. |
| [Cron](../nodes/cron-node.md) | Изпълнява се по график (cron израз, напр. `0 * * * *` за всеки час). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Стартира, когато Telegram изпрати webhook update от бот към специфичния за node webhook URL. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Стартира, когато Discord изпрати webhook от Interactions API към специфичния за node endpoint. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Периодично проверява IMAP пощенска кутия и стартира веднъж за всеки новооткрит имейл. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Стартира, когато Heym публикува платформено събитие. Събитията в един dispatch прозорец пристигат заедно като масив. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Отваря изходяща клиентска връзка към външен socket и стартира при избрани socket събития. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Генерира URL за еднократно качване и стартира, когато извикващият изпрати голям multipart файл. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Стартира, когато съобщение бъде изтеглено от RabbitMQ опашка. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Стартира, когато Slack изпрати събитие чрез webhook от Events API. |

## Entry Points

| Trigger | Endpoint / Източник | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header или `Authorization: Bearer` (само headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal session token |
| **Board** | [Board](../tabs/board-tab.md) преместване на карта / follow-up изпълнение в колона с workflow верига (`trigger_source="board"`) | JWT (собственик на board) |
| **Cron** | Cron scheduler (изпълнява се на всеки 60 сек., оценява cron изрази) | N/A |
| **IMAP** | IMAP trigger manager (leader worker, интервал на проверка за всеки node) | IMAP потребителско име/парола |
| **WebSocket** | Outbound WebSocket trigger manager (leader worker, постоянни клиентски връзки) | Опционални headers за всеки node |
| **File Upload** | `POST /api/file-intake/u/{token}` след генериране на слот | Token за еднократна употреба |
| **RabbitMQ** | RabbitMQ consumer (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 signing secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 публичен ключ на приложението |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Опционален `x-telegram-bot-api-secret-token` |
| **Editor** | Същото като Webhook, чрез `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Тялото на заявката се предава като `body` към textInput nodes
- **Body mode**: Workflows могат да използват `defined` примерни полета или `generic` сурови JSON примери в редактора и cURL диалога
- **Auth**: Конфигурира се за всеки workflow (`auth_type`, `allow_anonymous`)

Вижте [Webhooks](./webhooks.md) за подробности относно TTL, кеш, rate limiting и auth.

### MCP

Workflows с `mcp_enabled=true` се показват като инструменти за MCP клиенти. Името на инструмента се извлича от името на workflow. Вижте [MCP Tab](../tabs/mcp-tab.md).

### Portal

Публичен chat интерфейс на `/chat/{slug}`. Вижте [Portal](./portal.md) за подробности.

### Cron

Cron scheduler се изпълнява на всеки 60 секунди, намира workflows с активни `cron` nodes, оценява cron изрази и стартира съответстващите workflows. Input включва `{"triggered_by": "cron"}`.

### IMAP

IMAP trigger manager работи в leader worker и проверява активните `imapTrigger` nodes според конфигурирания `pollIntervalMinutes`. Всеки node съхранява IMAP курсор (`UIDVALIDITY` + последно видян UID). Input включва `email`, `triggered_by: "imap"`, `trigger_node_id` и `triggered_at`.

### Heym Platform Events

Heym event dispatcher проверява лога `heym_events` на всеки 5 секунди и доставя съответстващите събития към активните `heymTrigger` nodes. Доставката се заявява за всяка комбинация (събитие, workflow, node) чрез уникално ограничение, така че събитието се задейства точно веднъж за всеки абониран node във всеки worker, контейнер и машина. Всяко събитие, заявено в един цикъл, се доставя в едно изпълнение: input включва `events` (винаги масив, най-старите първи), `count`, `triggered_by: "heym_event"`, `trigger_node_id` и `triggered_at`. Dispatch-ват се само събития, публикувани през последните 5 минути, което предотвратява повторното изпълнение на натрупани събития след прекъсване; събитията се запазват за 7 дни.

### WebSocket

WebSocket trigger manager работи в leader worker и поддържа една изходяща клиентска връзка за всеки активен [WebSocket Trigger](../nodes/websocket-trigger-node.md) node. Той може да генерира изпълнения за `onMessage`, `onConnected` и `onClosed`. Input включва `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` и едно от `message`, `connection` или `close`.
### Качване на файл

[File Upload Trigger](../nodes/file-upload-trigger-node.md) създава ограничен с TTL, еднократен
слот за качване, когато workflow се извика чрез API, MCP или canvas. Качването на multipart form
data към `POST /api/file-intake/u/{token}` консумира слота, съхранява файла като Drive файл и
стартира workflow синхронно. Входните данни включват `file`, `uploaded_at`,
`triggered_by: "file_upload"` и метаданни за качването.

### Telegram

Telegram изпраща bot webhook обновления към `POST /api/telegram/webhook/{node_id}`. Payload се предава във workflow като `update`, `message`, опционален `callback_query`, санитизирани `headers`, `triggered_by`, `trigger_node_id` и `triggered_at`. Ако избраното удостоверение има secret token, Heym проверява `x-telegram-bot-api-secret-token` преди изпълнение.

### Discord

Discord изпраща interaction webhooks към `POST /api/discord/webhook/{node_id}`. Payload се предава във workflow като `interaction`, `type`, `data`, санитизирани `headers`, `triggered_by`, `trigger_node_id` и `triggered_at`. Heym проверява заявката чрез Ed25519 и публичния ключ на приложението от избраното удостоверение `discord_trigger` преди изпълнение.

### RabbitMQ

RabbitMQ consumer стартира, когато leader worker се инициализира. Workflows с `rabbitmq` nodes, където `rabbitmqOperation === "receive"`, получават consumer. Входните данни включват `message_data` (body, headers, routing_key и др.) и `triggered_by: "rabbitmq"`.

## trigger_source

Историята на изпълненията записва `trigger_source` за всяка входна точка:

| Стойност | Кога |
|-------|------|
| `"API"` | Webhook / API заявка без изричен header (по подразбиране) |
| `"Canvas"` | Стартиране от canvas на редактора на workflow |
| `"Quick Drawer"` | Стартиране от панела quick-drawer на редактора |
| `"cron"` | Cron scheduler |
| `"imap"` | IMAP trigger manager |
| `"websocket"` | Outbound WebSocket trigger manager |
| `"file_upload"` | Endpoint за качване на File Upload Trigger |
| `"telegram"` | Telegram bot webhook |
| `"Discord"` | Discord interactions webhook |
| `"MCP"` | MCP tool call |
| `"portal"` | Portal execute |
| `"dashboard_chat"` | Chat с AI асистент |
| `"AI Agents"` | Sub-workflow, извикан от AI agent node |
| `"SUB_WORKFLOW"` | Sub-workflow, извикан от Execute Workflow node |
| custom | Всяка стойност, изпратена в `X-Trigger-Source` header или `trigger_source` query/body param |
| (не е зададено) | RabbitMQ consumer |

## Входни данни по Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` от заявката
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + опционален `callback_query` + санитизирани `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + санитизирани `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (пълен Slack event object) + `headers` (санитизирани) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + опционален `conversation_history`

## Свързани

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow Structure](./workflow-structure.md) – Nodes и edges
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord interactions webhook trigger
- [Quick Start](../getting-started/quick-start.md) – Създаване на workflow с Input
- [Portal](./portal.md) – Portal trigger и chat UI
- [Execution History](./execution-history.md) – Преглед на минали изпълнения и trigger_source
