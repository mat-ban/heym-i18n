# Triggers

Workflows startas av **triggernoder** eller **ingångspunkter**. Varje triggertyp har sin egen endpoint eller bakgrundsprocess.

## Triggernoder

Startnoder (inga inkommande kanter) som initierar körning:

| Nodtyp | Beskrivning |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP-ingångspunkt. Tar emot `body`, `headers`, `query` från förfrågningar. |
| [Cron](../nodes/cron-node.md) | Körs enligt ett schema (cron-uttryck, t.ex. `0 * * * *` för varje timme). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Startar när Telegram skickar en bot-webhook-uppdatering till nodens specifika webhook-URL. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Startar när Discord skickar en Interactions API-webhook till nodens specifika endpoint. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Pollar en IMAP-brevlåda och startar en gång för varje nyupptäckt e-postmeddelande. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Startar när Heym publicerar en plattformshändelse. Händelser inom ett dispatch-fönster anländer tillsammans som en array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Öppnar en utgående klientanslutning till en extern socket och startar vid valda socket-händelser. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Skapar en engångs-uppladdnings-URL och startar när en anropare skickar en stor multipart-fil. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Startar när ett meddelande konsumeras från en RabbitMQ-kö. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Startar när Slack skickar en händelse via Events API-webhooken. |

## Ingångspunkter

| Trigger | Endpoint / Källa | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key`-header eller `Authorization: Bearer` (endast headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal-sessionstoken |
| **Board** | [Board](../tabs/board-tab.md) kortflytt / uppföljningskörning till en kolumn med en workflow-kedja (`trigger_source="board"`) | JWT (board-ägare) |
| **Cron** | Cron-schemaläggaren (körs var 60:e sekund, utvärderar cron-uttryck) | N/A |
| **IMAP** | IMAP trigger-hanteraren (leader-worker, pollningsintervall per nod) | IMAP-användarnamn/lösenord |
| **WebSocket** | Utgående WebSocket trigger-hanterare (leader-worker, beständiga klientanslutningar) | Valfria headers per nod |
| **File Upload** | `POST /api/file-intake/u/{token}` efter att en slot har skapats | Engångs-capability-token |
| **RabbitMQ** | RabbitMQ-konsument (leader-worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256-signeringshemlighet |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519-applikationens publika nyckel |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Valfri `x-telegram-bot-api-secret-token` |
| **Editor** | Samma som Webhook, via `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Förfrågans body skickas som `body` till textInput-noder
- **Body-läge**: Workflows kan använda `defined` fältformade exempel eller `generic` råa JSON-exempel i editorn och cURL-dialogen
- **Auth**: Konfigureras per workflow (`auth_type`, `allow_anonymous`)

Se [Webhooks](./webhooks.md) för detaljer om TTL, cache, hastighetsbegränsning och auth.

### MCP

Workflows med `mcp_enabled=true` visas som verktyg för MCP-klienter. Verktygsnamnet härleds från workflow-namnet. Se [MCP Tab](../tabs/mcp-tab.md).

### Portal

Publikt chattgränssnitt på `/chat/{slug}`. Se [Portal](./portal.md) för detaljer.

### Cron

Cron-schemaläggaren körs var 60:e sekund, hittar workflows med aktiva `cron`-noder, utvärderar cron-uttryck och kör matchande workflows. Input innehåller `{"triggered_by": "cron"}`.

### IMAP

IMAP trigger-hanteraren körs i leader-workern och kontrollerar aktiva `imapTrigger`-noder enligt deras konfigurerade `pollIntervalMinutes`. Varje nod lagrar en IMAP-markör (`UIDVALIDITY` + senast sedda UID). Input innehåller `email`, `triggered_by: "imap"`, `trigger_node_id` och `triggered_at`.

### Heym Platform Events

Heym-händelsedispatchern pollar `heym_events`-loggen var 5:e sekund och levererar matchande händelser till aktiva `heymTrigger`-noder. Leverans görs anspråk på per (händelse, workflow, nod) genom en unik begränsning, så en händelse utlöses exakt en gång per prenumererande nod över varje worker, container och maskin. Varje händelse som görs anspråk på i en omgång levereras i en enda körning: input innehåller `events` (alltid en array, äldst först), `count`, `triggered_by: "heym_event"`, `trigger_node_id` och `triggered_at`. Endast händelser som publicerats under de senaste 5 minuterna skickas, vilket förhindrar att ett avbrott spelar upp en backlog; händelser behålls i 7 dagar.

### WebSocket

WebSocket trigger-hanteraren körs i leader-workern och håller en utgående klientanslutning per aktiv [WebSocket Trigger](../nodes/websocket-trigger-node.md)-nod. Den kan skicka körningar för `onMessage`, `onConnected` och `onClosed`. Input innehåller `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` och en av `message`, `connection` eller `close`.
### Filuppladdning

[File Upload Trigger](../nodes/file-upload-trigger-node.md) skapar en TTL-begränsad engångsuppladdningsplats när workflowet anropas via API, MCP eller canvas. Uppladdning av multipart-formulärdata till `POST /api/file-intake/u/{token}` förbrukar platsen, lagrar filen som en Drive-fil och startar workflowet synkront. Indata inkluderar `file`, `uploaded_at`, `triggered_by: "file_upload"` och uppladdningsmetadata.

### Telegram

Telegram skickar bot-webhook-uppdateringar till `POST /api/telegram/webhook/{node_id}`. Payloaden skickas in i workflowet som `update`, `message`, valfri `callback_query`, sanerade `headers`, `triggered_by`, `trigger_node_id` och `triggered_at`. Om den valda credentialen har en secret token verifierar Heym `x-telegram-bot-api-secret-token` före körning.

### Discord

Discord skickar interaktions-webhooks till `POST /api/discord/webhook/{node_id}`. Payloaden skickas in i workflowet som `interaction`, `type`, `data`, sanerade `headers`, `triggered_by`, `trigger_node_id` och `triggered_at`. Heym verifierar begäran med Ed25519 och den valda `discord_trigger`-credentialens publika applikationsnyckel före körning.

### RabbitMQ

RabbitMQ-konsumenten startar när leader-workern initieras. Workflows med `rabbitmq`-noder där `rabbitmqOperation === "receive"` får en konsument. Indata inkluderar `message_data` (body, headers, routing_key, etc.) och `triggered_by: "rabbitmq"`.

## trigger_source

Körningshistorik registrerar `trigger_source` för varje startpunkt:

| Värde | När |
|-------|------|
| `"API"` | Webhook / API-anrop utan explicit header (standard) |
| `"Canvas"` | Körning från workfloweditorns canvas |
| `"Quick Drawer"` | Körning från editorns quick-drawer-panel |
| `"cron"` | Cron-schemaläggare |
| `"imap"` | IMAP trigger manager |
| `"websocket"` | Outbound WebSocket trigger manager |
| `"file_upload"` | File Upload Trigger-uppladdningsendpoint |
| `"telegram"` | Telegram bot-webhook |
| `"Discord"` | Discord interactions-webhook |
| `"MCP"` | MCP-verktygsanrop |
| `"portal"` | Portal execute |
| `"dashboard_chat"` | AI-assistentchatt |
| `"AI Agents"` | Sub-workflow anropat av en AI-agentnod |
| `"SUB_WORKFLOW"` | Sub-workflow anropat av en Execute Workflow-nod |
| anpassat | Valfritt värde som skickas i `X-Trigger-Source`-headern eller `trigger_source`-query/body-parametern |
| (ej angivet) | RabbitMQ-konsument |

## Indata per Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` från begäran
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + valfri `callback_query` + sanerade `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanerade `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (fullständigt Slack-eventobjekt) + `headers` (sanerade) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + valfri `conversation_history`

## Relaterat

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow Structure](./workflow-structure.md) – Noder och kanter
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord interactions-webhook-trigger
- [Quick Start](../getting-started/quick-start.md) – Bygg ett workflow med Input
- [Portal](./portal.md) – Portal-trigger och chattgränssnitt
- [Execution History](./execution-history.md) – Visa tidigare körningar och trigger_source
