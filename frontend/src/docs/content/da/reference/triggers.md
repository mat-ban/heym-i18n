# Triggers

Workflows startes af **trigger nodes** eller **entry points**. Hver triggertype har sin egen endpoint eller baggrundsproces.

## Trigger Nodes

Startnoder (uden indgående kanter), der initierer kørsel:

| Node Type | Beskrivelse |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP-entry point. Modtager `body`, `headers`, `query` fra requests. |
| [Cron](../nodes/cron-node.md) | Kører på en tidsplan (cron-udtryk, f.eks. `0 * * * *` for hver time). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Starter, når Telegram sender en bot-webhook-opdatering til den nodespecifikke webhook-URL. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Starter, når Discord sender en Interactions API-webhook til den nodespecifikke endpoint. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Poller en IMAP-mailboks og starter én gang for hver nyopdaget email. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Starter, når Heym udgiver en platformbegivenhed. Begivenheder i ét dispatch-vindue ankommer sammen som et array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Åbner en udgående klientforbindelse til en ekstern socket og starter på udvalgte socketbegivenheder. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genererer en engangsbrugs-upload-URL og starter, når en caller poster en stor multipart-fil. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Starter, når en besked konsumeres fra en RabbitMQ-kø. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Starter, når Slack sender en begivenhed via Events API-webhook'en. |

## Entry Points

| Trigger | Endpoint / Kilde | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header eller `Authorization: Bearer` (kun headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal-sessionstoken |
| **Board** | [Board](../tabs/board-tab.md) kortflytning / follow-up kørsel ind i en kolonne med en workflow-kæde (`trigger_source="board"`) | JWT (board-ejer) |
| **Cron** | Cron-scheduler (kører hvert 60. sekund, evaluerer cron-udtryk) | N/A |
| **IMAP** | IMAP-trigger manager (leader worker, per-node polling-interval) | IMAP brugernavn/adgangskode |
| **WebSocket** | Udgående WebSocket-trigger manager (leader worker, persistente klientforbindelser) | Valgfrie per-node headers |
| **File Upload** | `POST /api/file-intake/u/{token}` efter et slot er genereret | Engangsbrugs capability-token |
| **RabbitMQ** | RabbitMQ-consumer (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 signeringshemmelighed |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 applikations offentlige nøgle |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Valgfri `x-telegram-bot-api-secret-token` |
| **Editor** | Samme som Webhook, via `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Request-body sendes som `body` til textInput-noder
- **Body mode**: Workflows kan bruge `defined` field-shaped eksempler eller `generic` rå JSON-eksempler i editoren og cURL-dialogen
- **Auth**: Konfigureret per workflow (`auth_type`, `allow_anonymous`)

Se [Webhooks](./webhooks.md) for detaljer om TTL, cache, rate limiting og auth.

### MCP

Workflows med `mcp_enabled=true` vises som værktøjer til MCP-klienter. Værktøjsnavnet er afledt af workflow-navnet. Se [MCP Tab](../tabs/mcp-tab.md).

### Portal

Offentlig chat-UI på `/chat/{slug}`. Se [Portal](./portal.md) for detaljer.

### Cron

Cron-scheduleren kører hvert 60. sekund, finder workflows med aktive `cron`-noder, evaluerer cron-udtryk og kører matchende workflows. Input inkluderer `{"triggered_by": "cron"}`.

### IMAP

IMAP-trigger manageren kører i leader workeren og tjekker aktive `imapTrigger`-noder på deres konfigurerede `pollIntervalMinutes`. Hver node gemmer en IMAP-cursor (`UIDVALIDITY` + sidst sete UID). Input inkluderer `email`, `triggered_by: "imap"`, `trigger_node_id` og `triggered_at`.

### Heym Platformbegivenheder

Heym-begivenhedsdispatcheren poller `heym_events`-loggen hvert 5. sekund og leverer matchende begivenheder til aktive `heymTrigger`-noder. Levering claims per (begivenhed, workflow, node) gennem en unik constraint, så en begivenhed udløses præcis én gang per abonnerende node på tværs af hver worker, container og maskine. Hver begivenhed, der claims i ét gennemløb, leveres i én enkelt kørsel: input inkluderer `events` (altid et array, ældste først), `count`, `triggered_by: "heym_event"`, `trigger_node_id` og `triggered_at`. Kun begivenheder udgivet inden for de sidste 5 minutter dispatches, hvilket forhindrer en nedetid i at afspille en backlog; begivenheder opbevares i 7 dage.

### WebSocket

WebSocket-trigger manageren kører i leader workeren og opretholder én udgående klientforbindelse per aktiv [WebSocket Trigger](../nodes/websocket-trigger-node.md)-node. Den kan udløse kørsler for `onMessage`, `onConnected` og `onClosed`. Input inkluderer `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` og én af `message`, `connection` eller `close`.
### Filupload

[File Upload Trigger](../nodes/file-upload-trigger-node.md) genererer en TTL-begrænset, engangs-uploadplads, når workflowet aktiveres via API, MCP eller canvas. Ved upload af multipart form-data til `POST /api/file-intake/u/{token}` bruges pladsen, filen gemmes som en Drive-fil, og workflowet startes synkront. Input inkluderer `file`, `uploaded_at`, `triggered_by: "file_upload"` samt upload-metadata.

### Telegram

Telegram sender bot-webhook-opdateringer til `POST /api/telegram/webhook/{node_id}`. Payloaden sendes ind i workflowet som `update`, `message`, valgfri `callback_query`, rensete `headers`, `triggered_by`, `trigger_node_id` og `triggered_at`. Hvis de valgte legitimationsoplysninger indeholder en hemmelig token, verificerer Heym `x-telegram-bot-api-secret-token` før eksekvering.

### Discord

Discord sender interaktions-webhooks til `POST /api/discord/webhook/{node_id}`. Payloaden sendes ind i workflowet som `interaction`, `type`, `data`, rensete `headers`, `triggered_by`, `trigger_node_id` og `triggered_at`. Heym verificerer anmodningen ved hjælp af Ed25519 og den valgte `discord_trigger`-legitimationsoplysningers applikations-offentlige nøgle før eksekvering.

### RabbitMQ

RabbitMQ-forbrugeren startes, når leder-workeren initialiseres. Workflows med `rabbitmq`-noder, hvor `rabbitmqOperation === "receive"`, får en forbruger. Input inkluderer `message_data` (body, headers, routing_key osv.) og `triggered_by: "rabbitmq"`.

## trigger_source

Eksekveringshistorik registrerer `trigger_source` for hver indgangspunkt:

| Værdi | Når |
|-------|------|
| `"API"` | Webhook/API-kald uden eksplicit header (standard) |
| `"Canvas"` | Kørsel fra workflow-editor canvas |
| `"Quick Drawer"` | Kørsel fra editorens quick-drawer-panel, herunder filkørsler uploadet fra dets dropzone |
| `"cron"` | Cron-scheduler |
| `"imap"` | IMAP-trigger manager |
| `"websocket"` | Outbound WebSocket-trigger manager |
| `"file_upload"` | File Upload Trigger upload-endpoint (links oprettet via HTTP, MCP eller lærredet) |
| `"dashboard"` | Kørsler fra dashboard-widgets og uploads fra en fildrop-widget |
| `"telegram"` | Telegram bot-webhook |
| `"Discord"` | Discord-interaktions-webhook |
| `"MCP"` | MCP-værktøjskald |
| `"portal"` | Portal-eksekvering |
| `"dashboard_chat"` | AI-assistent-chat |
| `"AI Agents"` | Sub-workflow aktiveret af en AI-agent-node |
| `"SUB_WORKFLOW"` | Sub-workflow aktiveret af en Execute Workflow-node |
| brugerdefineret | Enhver værdi sendt i `X-Trigger-Source`-headeren eller `trigger_source` query/body-param |
| (ikke angivet) | RabbitMQ-forbruger |

## Input efter Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` fra anmodningen
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + valgfri `callback_query` + rensete `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + rensete `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Filupload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (fuldt Slack-event-objekt) + `headers` (renset) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + valgfri `conversation_history`

## Relateret

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow-struktur](./workflow-structure.md) – Noder og kanter
- [Nodetyper](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord-interaktions-webhook-trigger
- [Hurtig start](../getting-started/quick-start.md) – Byg et workflow med Input
- [Portal](./portal.md) – Portal-trigger og chat-brugergrænseflade
- [Eksekveringshistorik](./execution-history.md) – Se tidligere kørsler og trigger_source
