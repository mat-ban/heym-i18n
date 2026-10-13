# Triggeri

Workflow tiek palaistas ar **trigger node** jeb **ieejas punktiem**. Katram triggera veidam ir savs endpoint vai fona process.

## Trigger node

Sākuma node (bez ienākošajām šķautnēm), kas uzsāk izpildi:

| Node tips | Apraksts |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP ieejas punkts. Saņem `body`, `headers`, `query` no pieprasījumiem. |
| [Cron](../nodes/cron-node.md) | Darbojas pēc grafika (cron izteiksme, piem., `0 * * * *` katru stundu). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Palaidjas, kad Telegram nosūta bota webhook atjauninājumu uz node specifisko webhook URL. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Palaidjas, kad Discord nosūta Interactions API webhook uz node specifisko endpoint. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Aptaujā IMAP pastkasti un palaidjas vienu reizi par katru jaunu atrasto e-pastu. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Palaidjas, kad Heym publicē platformas notikumu. Notikumi vienā nosūtīšanas logā ierodas kopā kā masīvs. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Atver izejošu klienta savienojumu uz ārēju socket un palaidjas uz atlasītajiem socket notikumiem. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Izveido vienreiz lietojamu augšupielādes URL un palaidjas, kad izsaucējs nosūta lielu multipart failu. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Palaidjas, kad ziņa tiek patērēta no RabbitMQ rindas. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Palaidjas, kad Slack nosūta notikumu, izmantojot Events API webhook. |

## Ieejas punkti

| Triggers | Endpoint / Avots | Autentifikācija |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header vai `Authorization: Bearer` (tikai headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portāla sesijas token |
| **Board** | [Board](../tabs/board-tab.md) kartītes pārvietošana / papildu palaišana kolonnā ar workflow ķēdi (`trigger_source="board"`) | JWT (board īpašnieks) |
| **Cron** | Cron plānotājs (darbojas ik pēc 60s, izvērtē cron izteiksmes) | N/A |
| **IMAP** | IMAP triggera pārvaldnieks (leader worker, node specifisks aptaujas intervāls) | IMAP lietotājvārds/parole |
| **WebSocket** | Izejošo WebSocket triggeru pārvaldnieks (leader worker, pastāvīgi klienta savienojumi) | Neobligāti node specifiski headers |
| **File Upload** | `POST /api/file-intake/u/{token}` pēc slota izveides | Vienreiz lietojams capability token |
| **RabbitMQ** | RabbitMQ patērētājs (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 parakstīšanas noslēpums |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 lietotnes publiskā atslēga |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Neobligāts `x-telegram-bot-api-secret-token` |
| **Editor** | Tāpat kā Webhook, izmantojot `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Ievade**: Pieprasījuma body tiek nodots kā `body` uz textInput node
- **Body režīms**: Workflow redaktorā un cURL dialogā var izmantot `defined` lauku formas piemērus vai `generic` neapstrādātus JSON piemērus
- **Autentifikācija**: Konfigurēta katram workflow atsevišķi (`auth_type`, `allow_anonymous`)

Skatiet [Webhooks](./webhooks.md), lai uzzinātu par TTL, kešatmiņu, ātruma ierobežošanu un autentifikāciju.

### MCP

Workflow ar `mcp_enabled=true` parādās MCP klientiem kā rīki. Rīka nosaukums tiek atvasināts no workflow nosaukuma. Skatiet [MCP Tab](../tabs/mcp-tab.md).

### Portal

Publiska chat saskarne vietnē `/chat/{slug}`. Skatiet [Portal](./portal.md), lai uzzinātu sīkāk.

### Cron

Cron plānotājs darbojas ik pēc 60 sekundēm, atrod workflow ar aktīviem `cron` node, izvērtē cron izteiksmes un palaiž atbilstošos workflow. Ievade ietver `{"triggered_by": "cron"}`.

### IMAP

IMAP triggera pārvaldnieks darbojas leader worker un pārbauda aktīvos `imapTrigger` node pēc to konfigurētā `pollIntervalMinutes`. Katrs node saglabā IMAP kursoru (`UIDVALIDITY` + pēdējais redzētais UID). Ievade ietver `email`, `triggered_by: "imap"`, `trigger_node_id` un `triggered_at`.

### Heym platformas notikumi

Heym notikumu izsūtītājs aptaujā `heym_events` žurnālu ik pēc 5 sekundēm un piegādā atbilstošos notikumus aktīvajiem `heymTrigger` node. Piegāde tiek rezervēta katram (notikums, workflow, node) pārim, izmantojot unikālu ierobežojumu, tāpēc notikums tiek palaists tieši vienu reizi katram abonētajam node visos worker, konteineros un mašīnās. Katrs notikums, kas rezervēts vienā ciklā, tiek piegādāts vienā palaišanā: ievade ietver `events` (vienmēr masīvs, vecākais pirmais), `count`, `triggered_by: "heym_event"`, `trigger_node_id` un `triggered_at`. Tiek izsūtīti tikai notikumi, kas publicēti pēdējo 5 minūšu laikā, kas novērš uzkrāto notikumu atkārtotu izsūtīšanu pēc pārtraukuma; notikumi tiek glabāti 7 dienas.

### WebSocket

WebSocket triggera pārvaldnieks darbojas leader worker un uztur vienu izejošu klienta savienojumu katram aktīvajam [WebSocket Trigger](../nodes/websocket-trigger-node.md) node. Tas var izraisīt palaišanas notikumiem `onMessage`, `onConnected` un `onClosed`. Ievade ietver `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` un vienu no `message`, `connection` vai `close`.
### Faila augšupielāde

[Faila augšupielādes trigger](../nodes/file-upload-trigger-node.md) izveido ar TTL ierobežotu, vienreiz lietojamu augšupielādes slotu, kad workflow tiek izsaukts caur API, MCP vai kanvu. Multipart form datu augšupielāde uz `POST /api/file-intake/u/{token}` patērē slotu, saglabā failu kā Drive failu un sinhroni palaiž workflow. Ievade ietver `file`, `uploaded_at`, `triggered_by: "file_upload"` un augšupielādes metadatus.

### Telegram

Telegram sūta bota webhook atjauninājumus uz `POST /api/telegram/webhook/{node_id}`. Payload tiek nodots workflow kā `update`, `message`, neobligāts `callback_query`, sanitizēti `headers`, `triggered_by`, `trigger_node_id` un `triggered_at`. Ja izvēlētajiem akreditācijas datiem ir secret token, Heym pirms izpildes pārbauda `x-telegram-bot-api-secret-token`.

### Discord

Discord sūta mijiedarbības webhook uz `POST /api/discord/webhook/{node_id}`. Payload tiek nodots workflow kā `interaction`, `type`, `data`, sanitizēti `headers`, `triggered_by`, `trigger_node_id` un `triggered_at`. Heym pirms izpildes pārbauda pieprasījumu, izmantojot Ed25519 un izvēlēto `discord_trigger` akreditācijas datu aplikācijas publisko atslēgu.

### RabbitMQ

RabbitMQ patērētājs tiek palaists, kad līdera worker tiek inicializēts. Workflow ar `rabbitmq` mezgliem, kuros `rabbitmqOperation === "receive"`, iegūst patērētāju. Ievade ietver `message_data` (body, headers, routing_key utt.) un `triggered_by: "rabbitmq"`.

## trigger_source

Izpildes vēsture reģistrē `trigger_source` katram ieejas punktam:

| Vērtība | Kad |
|-------|------|
| `"API"` | Webhook / API izsaukums bez precīza header (noklusējums) |
| `"Canvas"` | Palaide no workflow redaktora kanvas |
| `"Quick Drawer"` | Palaide no redaktora quick-drawer paneļa, tostarp failu izpildes, kas augšupielādētas no tā nomešanas zonas |
| `"cron"` | Cron grafiks |
| `"imap"` | IMAP trigger pārvaldnieks |
| `"websocket"` | Izejošais WebSocket trigger pārvaldnieks |
| `"file_upload"` | Faila augšupielādes trigger augšupielādes endpoint (saites, kas izveidotas caur HTTP, MCP vai audeklu) |
| `"dashboard"` | Informācijas paneļa logrīku izpildes un augšupielādes no failu nomešanas logrīka |
| `"telegram"` | Telegram bota webhook |
| `"Discord"` | Discord mijiedarbības webhook |
| `"MCP"` | MCP rīka izsaukums |
| `"portal"` | Portal izpilde |
| `"dashboard_chat"` | AI asistenta chat |
| `"AI Agents"` | Apakš-workflow, ko izsauc AI aģenta mezgls |
| `"SUB_WORKFLOW"` | Apakš-workflow, ko izsauc Execute Workflow mezgls |
| custom | Jebkura vērtība, kas nosūtīta `X-Trigger-Source` header vai `trigger_source` query/body param |
| (nav iestatīts) | RabbitMQ patērētājs |

## Ievades pēc trigger

- **HTTP/Webhook**: `body`, `headers`, `query` no pieprasījuma
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + neobligāts `callback_query` + sanitizēti `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanitizēti `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Faila augšupielāde**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (pilns Slack notikuma objekts) + `headers` (sanitizēti) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + neobligāts `conversation_history`

## Saistītie

- [Webhooks](./webhooks.md) – Webhook TTL, kešatmiņa, pieprasījumu limits, autentifikācija
- [Workflow struktūra](./workflow-structure.md) – Mezgli un savienojumi
- [Mezglu tipi](./node-types.md) – [Ievade](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [Faila augšupielādes trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord mijiedarbības webhook trigger
- [Ātrā sākšana](../getting-started/quick-start.md) – Izveidojiet workflow ar Ievadi
- [Portal](./portal.md) – Portal trigger un chat UI
- [Izpildes vēsture](./execution-history.md) – Skatīt iepriekšējās palaides un trigger_source
