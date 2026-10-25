# Triggers

Workflows worden gestart door **trigger-knooppunten** of **entry points**. Elk triggertype heeft een eigen endpoint of achtergrondproces.

## Trigger-knooppunten

Startknooppunten (zonder inkomende edges) die de uitvoering initiëren:

| Knooppunttype | Beschrijving |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP-entry point. Ontvangt `body`, `headers`, `query` uit requests. |
| [Cron](../nodes/cron-node.md) | Draait volgens een schema (cron-expressie, bijvoorbeeld `0 * * * *` voor elk uur). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Start wanneer Telegram een bot-webhook-update naar de knooppuntspecifieke webhook-URL stuurt. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Start wanneer Discord een Interactions API-webhook naar het knooppuntspecifieke endpoint stuurt. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Pollt een IMAP-mailbox en start één keer voor elke nieuw gedetecteerde e-mail. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Start wanneer Heym een platformevent publiceert. Events binnen één dispatch-venster komen samen aan als een array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Opent een uitgaande clientverbinding naar een externe socket en start bij geselecteerde socket-events. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genereert een eenmalig bruikbare upload-URL en start wanneer een aanroeper een groot multipart-bestand plaatst. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Start wanneer een bericht uit een RabbitMQ-queue wordt geconsumeerd. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Start wanneer Slack een event via de Events API-webhook stuurt. |

## Entry points

| Trigger | Endpoint / Bron | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key`-header of `Authorization: Bearer` (alleen headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal-sessietoken |
| **Board** | [Board](../tabs/board-tab.md) kaartverplaatsing / follow-up-run naar een kolom met een workflow-keten (`trigger_source="board"`) | JWT (board-eigenaar) |
| **Cron** | Cron-scheduler (draait elke 60s, evalueert cron-expressies) | N.v.t. |
| **IMAP** | IMAP-triggerbeheerder (leader-worker, pollinterval per knooppunt) | IMAP-gebruikersnaam/wachtwoord |
| **WebSocket** | Uitgaande WebSocket-triggerbeheerder (leader-worker, persistente clientverbindingen) | Optionele headers per knooppunt |
| **File Upload** | `POST /api/file-intake/u/{token}` nadat een slot is aangemaakt | Eenmalig bruikbaar capability-token |
| **RabbitMQ** | RabbitMQ-consumer (leader-worker) | N.v.t. |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256-signing secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519-applicatie-public key |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Optioneel `x-telegram-bot-api-secret-token` |
| **Editor** | Hetzelfde als Webhook, via `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: De request-body wordt als `body` doorgegeven aan textInput-knooppunten
- **Body-modus**: Workflows kunnen in de editor en het cURL-dialoogvenster gebruikmaken van `defined` veldvormige voorbeelden of `generic` ruwe JSON-voorbeelden
- **Auth**: Per workflow geconfigureerd (`auth_type`, `allow_anonymous`)

Zie [Webhooks](./webhooks.md) voor details over TTL, cache, rate limiting en auth.

### MCP

Workflows met `mcp_enabled=true` verschijnen als tools voor MCP-clients. De toolnaam wordt afgeleid van de workflownaam. Zie [MCP Tab](../tabs/mcp-tab.md).

### Portal

Openbare chat-UI op `/chat/{slug}`. Zie [Portal](./portal.md) voor details.

### Cron

De cron-scheduler draait elke 60 seconden, vindt workflows met actieve `cron`-knooppunten, evalueert cron-expressies en voert overeenkomende workflows uit. De input bevat `{"triggered_by": "cron"}`.

### IMAP

De IMAP-triggerbeheerder draait in de leader-worker en controleert actieve `imapTrigger`-knooppunten op hun geconfigureerde `pollIntervalMinutes`. Elk knooppunt slaat een IMAP-cursor op (`UIDVALIDITY` + laatst geziene UID). De input bevat `email`, `triggered_by: "imap"`, `trigger_node_id` en `triggered_at`.

### Heym Platform Events

De Heym-event-dispatcher pollt elke 5 seconden het `heym_events`-log en levert overeenkomende events aan actieve `heymTrigger`-knooppunten. Levering wordt geclaimd per (event, workflow, knooppunt) via een unieke constraint, zodat een event precies één keer per abonnerend knooppunt wordt afgevuurd, over elke worker, container en machine. Elk event dat in één pass wordt geclaimd, wordt in één run geleverd: de input bevat `events` (altijd een array, oudste eerst), `count`, `triggered_by: "heym_event"`, `trigger_node_id` en `triggered_at`. Alleen events die in de afgelopen 5 minuten zijn gepubliceerd worden gedispatcht, wat voorkomt dat een storing een backlog opnieuw afspeelt; events worden 7 dagen bewaard.

### WebSocket

De WebSocket-triggerbeheerder draait in de leader-worker en houdt één uitgaande clientverbinding per actief [WebSocket Trigger](../nodes/websocket-trigger-node.md)-knooppunt in stand. Deze kan runs uitzenden voor `onMessage`, `onConnected` en `onClosed`. De input bevat `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` en één van `message`, `connection` of `close`.

### Bestandsupload

De [Bestandsupload-trigger](../nodes/file-upload-trigger-node.md) maakt een TTL-gebonden, eenmalig
bruikbare uploadslot aan wanneer de workflow wordt aangeroepen via de API, MCP of het canvas. Het uploaden van multipart
form data naar `POST /api/file-intake/u/{token}` verbruikt de slot, slaat het bestand op als een Drive-bestand en
start de workflow synchroon. De invoer omvat `file`, `uploaded_at`,
`triggered_by: "file_upload"` en uploadmetadata.

### Telegram

Telegram stuurt bot webhook-updates naar `POST /api/telegram/webhook/{node_id}`. De payload wordt doorgegeven aan de workflow als `update`, `message`, optionele `callback_query`, gesanitiseerde `headers`, `triggered_by`, `trigger_node_id` en `triggered_at`. Als de geselecteerde referentie een secret token heeft, verifieert Heym `x-telegram-bot-api-secret-token` vóór uitvoering.

### Discord

Discord stuurt interactie-webhooks naar `POST /api/discord/webhook/{node_id}`. De payload wordt doorgegeven aan de workflow als `interaction`, `type`, `data`, gesanitiseerde `headers`, `triggered_by`, `trigger_node_id` en `triggered_at`. Heym verifieert het verzoek met Ed25519 en de applicatie-public key van de geselecteerde `discord_trigger`-referentie vóór uitvoering.

### RabbitMQ

De RabbitMQ-consumer start wanneer de leader worker initialiseert. Workflows met `rabbitmq`-knooppunten waarbij `rabbitmqOperation === "receive"` krijgen een consumer. De invoer omvat `message_data` (body, headers, routing_key, enz.) en `triggered_by: "rabbitmq"`.

## Gelijktijdigheidslimiet

Een workflow met een [gelijktijdigheidslimiet](./webhooks.md#concurrency-limit-and-queued-runs) plaatst productieruns van elk bovenstaand entry point in de wachtrij wanneer de slots vol zijn, first in, first out, over alle instanties heen. Hoe een aanroeper het resultaat verneemt, hangt af van het entry point:

| Entry point | Terwijl de run wacht |
|---|---|
| Webhook / API | `202 Accepted` met een `execution_id` en een status-URL |
| SSE streaming, Quick Drawer, Portal chat | De stream blijft open en verzendt `queued`-gebeurtenissen |
| Portal without streaming | Het verzoek wacht op het resultaat |
| MCP | Een `queued`-resultaat om te pollen met `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | De trigger wacht op het resultaat, zolang een run op een andere [instantie](./cluster.md) zou wachten. De run wordt in elk geval uitgevoerd en naar de geschiedenis geschreven |

Wanneer de wachtrij vol is, start de run niet en wordt deze in de geschiedenis geregistreerd als `queue_full`. Editor-testruns, sub-workflow-aanroepen ([Execute](../nodes/execute-node.md)-node en agent-workflowtools), [Evals](../tabs/evals-tab.md), chat build-modus testruns en hervattingen van reviews worden nooit in de wachtrij geplaatst. [Board](../tabs/board-tab.md)-kaartruns, [File Upload](../nodes/file-upload-trigger-node.md)-runs, runs gestart door de run-workflow-tool van de AI-assistent en waarschuwings-meldingsworkflows starten eveneens zonder op een slot te wachten.

## trigger_source

De uitvoeringsgeschiedenis registreert `trigger_source` voor elk toegangspunt:

| Waarde | Wanneer |
|-------|------|
| `"API"` | Webhook / API-aanroep zonder expliciete header (standaard) |
| `"Canvas"` | Uitvoering vanuit het canvas van de workflow-editor |
| `"Quick Drawer"` | Uitvoering vanuit het quick-drawer-paneel van de editor, inclusief bestandsuitvoeringen geüpload vanuit de dropzone |
| `"cron"` | Cron-scheduler |
| `"imap"` | IMAP-triggerbeheer |
| `"websocket"` | Uitgaand WebSocket-triggerbeheer |
| `"file_upload"` | Upload-endpoint van de Bestandsupload-trigger (links aangemaakt via HTTP, MCP of het canvas) |
| `"dashboard"` | Uitvoeringen van dashboardwidgets en uploads vanuit een bestandsdrop-widget |
| `"telegram"` | Telegram-bot webhook |
| `"Discord"` | Discord-interacties webhook |
| `"MCP"` | MCP-toolaanroep |
| `"portal"` | Portal-uitvoering |
| `"dashboard_chat"` | AI-assistent chat |
| `"AI Agents"` | Sub-workflow aangeroepen door een AI-agent-knooppunt |
| `"SUB_WORKFLOW"` | Sub-workflow aangeroepen door een Execute Workflow-knooppunt |
| aangepast | Elke waarde verzonden in de `X-Trigger-Source`-header of `trigger_source`-query-/body-parameter |
| (niet ingesteld) | RabbitMQ-consumer |

## Invoer per Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` uit het verzoek
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + optionele `callback_query` + gesanitiseerde `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + gesanitiseerde `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Bestandsupload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (volledig Slack-eventobject) + `headers` (gesanitiseerd) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + optionele `conversation_history`

## Gerelateerd

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow-structuur](./workflow-structure.md) – Knooppunten en edges
- [Knooppunttypen](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram-trigger](../nodes/telegram-trigger-node.md), [IMAP-trigger](../nodes/imap-trigger-node.md), [Heym-trigger](../nodes/heym-trigger-node.md), [WebSocket-trigger](../nodes/websocket-trigger-node.md), [Bestandsupload-trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord-trigger](../nodes/discord-trigger-node.md) – Discord-interacties webhook-trigger
- [Snelstart](../getting-started/quick-start.md) – Bouw een workflow met Input
- [Portal](./portal.md) – Portal-trigger en chat-UI
- [Uitvoeringsgeschiedenis](./execution-history.md) – Bekijk eerdere uitvoeringen en trigger_source
