# Trigger-e

Workflow-urile sunt pornite de **noduri trigger** sau **puncte de intrare**. Fiecare tip de trigger are propriul endpoint sau proces în fundal.

## Noduri Trigger

Noduri de start (fără muchii de intrare) care inițiază execuția:

| Tip de nod | Descriere |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Punct de intrare HTTP. Primește `body`, `headers`, `query` din cereri. |
| [Cron](../nodes/cron-node.md) | Rulează conform unui program (expresie cron, de ex. `0 * * * *` pentru fiecare oră). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Pornește când Telegram trimite o actualizare webhook de bot către URL-ul webhook specific nodului. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Pornește când Discord trimite un webhook Interactions API către endpoint-ul specific nodului. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Interoghează periodic o căsuță poștală IMAP și pornește o dată pentru fiecare e-mail nou detectat. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Pornește când Heym publică un eveniment de platformă. Evenimentele dintr-o fereastră de dispatch sosesc împreună ca un array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Deschide o conexiune client de ieșire către un socket extern și pornește la evenimentele de socket selectate. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Generează un URL de încărcare de unică folosință și pornește când un apelant trimite un fișier multipart de dimensiuni mari. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Pornește când un mesaj este consumat dintr-o coadă RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Pornește când Slack trimite un eveniment prin webhook-ul Events API. |

## Puncte de intrare

| Trigger | Endpoint / Sursă | Autentificare |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Header `X-MCP-Key` sau `Authorization: Bearer` (doar headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token de sesiune Portal |
| **Board** | [Board](../tabs/board-tab.md) mutare card / rulare de continuare într-o coloană cu un lanț de workflow-uri (`trigger_source="board"`) | JWT (proprietar board) |
| **Cron** | Planificator cron (rulează la fiecare 60s, evaluează expresii cron) | N/A |
| **IMAP** | Manager trigger IMAP (worker lider, interval de interogare per nod) | Nume utilizator/parolă IMAP |
| **WebSocket** | Manager trigger WebSocket de ieșire (worker lider, conexiuni client persistente) | Headers opționale per nod |
| **File Upload** | `POST /api/file-intake/u/{token}` după ce un slot este generat | Token de capacitate de unică folosință |
| **RabbitMQ** | Consumator RabbitMQ (worker lider) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Secret de semnare HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Cheie publică de aplicație Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opțional |
| **Editor** | Identic cu Webhook, prin `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Corpul cererii este transmis ca `body` către nodurile textInput
- **Mod body**: Workflow-urile pot utiliza exemple cu formă de câmp `defined` sau exemple JSON brute `generic` în editor și în dialogul cURL
- **Autentificare**: Configurată per workflow (`auth_type`, `allow_anonymous`)

Consultați [Webhooks](./webhooks.md) pentru detalii despre TTL, cache, limitare de rată și autentificare.

### MCP

Workflow-urile cu `mcp_enabled=true` apar ca unelte pentru clienții MCP. Numele uneltei este derivat din numele workflow-ului. Consultați [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interfață publică de chat la `/chat/{slug}`. Consultați [Portal](./portal.md) pentru detalii.

### Cron

Planificatorul cron rulează la fiecare 60 de secunde, găsește workflow-urile cu noduri `cron` active, evaluează expresiile cron și rulează workflow-urile corespunzătoare. Input-ul include `{"triggered_by": "cron"}`.

### IMAP

Managerul trigger IMAP rulează în worker-ul lider și verifică nodurile `imapTrigger` active conform `pollIntervalMinutes` configurat. Fiecare nod stochează un cursor IMAP (`UIDVALIDITY` + ultimul UID văzut). Input-ul include `email`, `triggered_by: "imap"`, `trigger_node_id` și `triggered_at`.

### Evenimente de platformă Heym

Dispatcher-ul de evenimente Heym interoghează periodic jurnalul `heym_events` la fiecare 5 secunde și livrează evenimentele corespunzătoare către nodurile `heymTrigger` active. Livrarea este revendicată per (eveniment, workflow, nod) printr-o constrângere unică, astfel încât un eveniment se declanșează exact o dată per nod abonat, indiferent de worker, container sau mașină. Fiecare eveniment revendicat într-o singură trecere este livrat într-o singură rulare: input-ul include `events` (întotdeauna un array, cel mai vechi primul), `count`, `triggered_by: "heym_event"`, `trigger_node_id` și `triggered_at`. Doar evenimentele publicate în ultimele 5 minute sunt dispatch-uite, ceea ce împiedică o întrerupere să redea un backlog; evenimentele sunt păstrate timp de 7 zile.

### WebSocket

Managerul trigger WebSocket rulează în worker-ul lider și menține o conexiune client de ieșire per nod [WebSocket Trigger](../nodes/websocket-trigger-node.md) activ. Poate emite rulări pentru `onMessage`, `onConnected` și `onClosed`. Input-ul include `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` și unul dintre `message`, `connection` sau `close`.
### Încărcare fișier

[Triggerul de încărcare fișier](../nodes/file-upload-trigger-node.md) generează un slot de încărcare cu durată TTL limitată și utilizare unică atunci când workflow-ul este invocat prin API, MCP sau canvas. Încărcarea datelor de formular multipart către `POST /api/file-intake/u/{token}` consumă slotul, stochează fișierul ca fișier Drive și pornește workflow-ul sincron. Intrarea include `file`, `uploaded_at`, `triggered_by: "file_upload"` și metadate de încărcare.

### Telegram

Telegram trimite actualizări webhook de bot către `POST /api/telegram/webhook/{node_id}`. Payload-ul este transmis în workflow ca `update`, `message`, `callback_query` opțional, `headers` sanitizate, `triggered_by`, `trigger_node_id` și `triggered_at`. Dacă credentialul selectat are un token secret, Heym verifică `x-telegram-bot-api-secret-token` înainte de execuție.

### Discord

Discord trimite webhook-uri de interacțiune către `POST /api/discord/webhook/{node_id}`. Payload-ul este transmis în workflow ca `interaction`, `type`, `data`, `headers` sanitizate, `triggered_by`, `trigger_node_id` și `triggered_at`. Heym verifică cererea folosind Ed25519 și cheia publică a aplicației din credentialul `discord_trigger` selectat înainte de execuție.

### RabbitMQ

Consumatorul RabbitMQ pornește când worker-ul lider se inițializează. Workflow-urile cu noduri `rabbitmq` unde `rabbitmqOperation === "receive"` primesc un consumator. Intrarea include `message_data` (body, headers, routing_key etc.) și `triggered_by: "rabbitmq"`.

## trigger_source

Istoricul execuțiilor înregistrează `trigger_source` pentru fiecare punct de intrare:

| Valoare | Când |
|-------|------|
| `"API"` | Apel Webhook / API fără header explicit (implicit) |
| `"Canvas"` | Rulare din canvas-ul editorului de workflow |
| `"Quick Drawer"` | Rulare din panoul quick-drawer al editorului, inclusiv rulările cu fișiere încărcate din zona sa de plasare |
| `"cron"` | Planificator Cron |
| `"imap"` | Manager de trigger IMAP |
| `"websocket"` | Manager de trigger WebSocket de ieșire |
| `"file_upload"` | Endpoint de încărcare al Triggerului de încărcare fișier (linkuri generate prin HTTP, MCP sau canvas) |
| `"dashboard"` | Rulări ale widgeturilor din tabloul de bord și încărcări dintr-un widget de plasare a fișierelor |
| `"telegram"` | Webhook de bot Telegram |
| `"Discord"` | Webhook de interacțiuni Discord |
| `"MCP"` | Apel de tool MCP |
| `"portal"` | Execuție Portal |
| `"dashboard_chat"` | Chat asistent AI |
| `"AI Agents"` | Sub-workflow invocat de un nod de agent AI |
| `"SUB_WORKFLOW"` | Sub-workflow invocat de un nod Execute Workflow |
| personalizat | Orice valoare trimisă în header-ul `X-Trigger-Source` sau parametrul `trigger_source` din query/body |
| (nesetat) | Consumator RabbitMQ |

## Intrări după Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` din cerere
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opțional + `headers` sanitizate + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` sanitizate + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Încărcare fișier**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (obiect complet de eveniment Slack) + `headers` (sanitizate) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` opțional

## Resurse conexe

- [Webhook-uri](./webhooks.md) – TTL Webhook, cache, limită de rată, autentificare
- [Structura workflow-ului](./workflow-structure.md) – Noduri și muchii
- [Tipuri de noduri](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger webhook de interacțiuni Discord
- [Quick Start](../getting-started/quick-start.md) – Construiți un workflow cu Input
- [Portal](./portal.md) – Trigger Portal și interfață de chat
- [Istoricul execuțiilor](./execution-history.md) – Vizualizați rulările anterioare și trigger_source
