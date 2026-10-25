# Trigger

Workflows werden durch **Trigger-Knoten** oder **Einstiegspunkte** gestartet. Jeder Trigger-Typ hat seinen eigenen Endpoint oder Hintergrundprozess.

## Trigger-Knoten

Startknoten (keine eingehenden Kanten), die die Ausführung initiieren:

| Knoten-Typ | Beschreibung |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP-Einstiegspunkt. Empfängt `body`, `headers`, `query` aus Anfragen. |
| [Cron](../nodes/cron-node.md) | Läuft nach Zeitplan (Cron-Ausdruck, z. B. `0 * * * *` für stündlich). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Startet, wenn Telegram ein Bot-Webhook-Update an die knotenspezifische Webhook-URL sendet. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Startet, wenn Discord einen Interactions-API-Webhook an den knotenspezifischen Endpoint sendet. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Fragt ein IMAP-Postfach ab und startet einmal für jede neu erkannte E-Mail. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Startet, wenn Heym ein Plattform-Ereignis veröffentlicht. Ereignisse in einem Dispatch-Fenster treffen gemeinsam als Array ein. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Öffnet eine ausgehende Client-Verbindung zu einem externen Socket und startet bei ausgewählten Socket-Ereignissen. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Erzeugt eine einmalig verwendbare Upload-URL und startet, wenn ein Aufrufer eine große Multipart-Datei sendet. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Startet, wenn eine Nachricht aus einer RabbitMQ-Queue konsumiert wird. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Startet, wenn Slack ein Ereignis über den Events-API-Webhook sendet. |

## Einstiegspunkte

| Trigger | Endpoint / Quelle | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key`-Header oder `Authorization: Bearer` (nur Header) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal-Session-Token |
| **Board** | [Board](../tabs/board-tab.md) Kartenverschiebung / Follow-up-Lauf in eine Spalte mit einer Workflow-Kette (`trigger_source="board"`) | JWT (Board-Eigentümer) |
| **Cron** | Cron-Scheduler (läuft alle 60 s, wertet Cron-Ausdrücke aus) | N/A |
| **IMAP** | IMAP-Trigger-Manager (Leader-Worker, Polling-Intervall pro Knoten) | IMAP-Benutzername/Passwort |
| **WebSocket** | Ausgehender WebSocket-Trigger-Manager (Leader-Worker, persistente Client-Verbindungen) | Optionale Header pro Knoten |
| **File Upload** | `POST /api/file-intake/u/{token}` nachdem ein Slot erzeugt wurde | Einmalig verwendbares Capability-Token |
| **RabbitMQ** | RabbitMQ-Consumer (Leader-Worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256-Signing-Secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519-Anwendungs-Public-Key |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Optionales `x-telegram-bot-api-secret-token` |
| **Editor** | Wie Webhook, über `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Der Request-Body wird als `body` an textInput-Knoten übergeben
- **Body-Modus**: Workflows können im Editor und im cURL-Dialog `defined` feldbasierte Beispiele oder `generic` rohe JSON-Beispiele verwenden
- **Auth**: Pro Workflow konfiguriert (`auth_type`, `allow_anonymous`)

Siehe [Webhooks](./webhooks.md) für Details zu TTL, Cache, Rate Limiting und Auth.

### MCP

Workflows mit `mcp_enabled=true` erscheinen für MCP-Clients als Tools. Der Tool-Name wird vom Workflow-Namen abgeleitet. Siehe [Reiter MCP](../tabs/mcp-tab.md).

### Portal

Öffentliche Chat-UI unter `/chat/{slug}`. Siehe [Portal](./portal.md) für Details.

### Cron

Der Cron-Scheduler läuft alle 60 Sekunden, findet Workflows mit aktiven `cron`-Knoten, wertet Cron-Ausdrücke aus und führt passende Workflows aus. Der Input enthält `{"triggered_by": "cron"}`.

### IMAP

Der IMAP-Trigger-Manager läuft im Leader-Worker und prüft aktive `imapTrigger`-Knoten in ihrem konfigurierten `pollIntervalMinutes`. Jeder Knoten speichert einen IMAP-Cursor (`UIDVALIDITY` + zuletzt gesehene UID). Der Input enthält `email`, `triggered_by: "imap"`, `trigger_node_id` und `triggered_at`.

### Heym Plattform-Ereignisse

Der Heym-Ereignis-Dispatcher fragt das `heym_events`-Log alle 5 Sekunden ab und liefert passende Ereignisse an aktive `heymTrigger`-Knoten. Die Zustellung wird pro (Ereignis, Workflow, Knoten) über eine eindeutige Constraint beansprucht, sodass ein Ereignis genau einmal pro abonnierendem Knoten über jeden Worker, Container und jede Maschine hinweg ausgelöst wird. Jedes Ereignis, das in einem Durchlauf beansprucht wird, wird in einem einzigen Lauf zugestellt: Der Input enthält `events` (immer ein Array, ältestes zuerst), `count`, `triggered_by: "heym_event"`, `trigger_node_id` und `triggered_at`. Nur Ereignisse, die in den letzten 5 Minuten veröffentlicht wurden, werden zugestellt, was verhindert, dass ein Ausfall einen Rückstand erneut abspielt; Ereignisse werden 7 Tage lang aufbewahrt.

### WebSocket

Der WebSocket-Trigger-Manager läuft im Leader-Worker und hält eine ausgehende Client-Verbindung pro aktivem [WebSocket Trigger](../nodes/websocket-trigger-node.md)-Knoten. Er kann Läufe für `onMessage`, `onConnected` und `onClosed` ausgeben. Der Input enthält `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` und eines von `message`, `connection` oder `close`.

### File Upload

Der [File Upload Trigger](../nodes/file-upload-trigger-node.md) erzeugt einen TTL-begrenzten, einmalig verwendbaren Upload-Slot, wenn der Workflow über die API, MCP oder den Canvas aufgerufen wird. Das Hochladen von Multipart-Formulardaten an `POST /api/file-intake/u/{token}` verbraucht den Slot, speichert die Datei als Drive-Datei und startet den Workflow synchron. Der Input enthält `file`, `uploaded_at`, `triggered_by: "file_upload"` und Upload-Metadaten.

### Telegram

Telegram sendet Bot-Webhook-Updates an `POST /api/telegram/webhook/{node_id}`. Der Payload wird als `update`, `message`, optionales `callback_query`, bereinigte `headers`, `triggered_by`, `trigger_node_id` und `triggered_at` in den Workflow übergeben. Wenn die ausgewählte Anmeldedaten über ein Secret-Token verfügt, verifiziert Heym `x-telegram-bot-api-secret-token` vor der Ausführung.
### Discord

Discord sendet Interaktions-Webhooks an `POST /api/discord/webhook/{node_id}`. Der Payload wird als `interaction`, `type`, `data`, bereinigte `headers`, `triggered_by`, `trigger_node_id` und `triggered_at` in den Workflow übergeben. Heym verifiziert die Anfrage vor der Ausführung mithilfe von Ed25519 und dem öffentlichen Anwendungsschlüssel der ausgewählten `discord_trigger`-Anmeldedaten.

### RabbitMQ

Der RabbitMQ-Consumer startet, wenn der Leader-Worker initialisiert wird. Workflows mit `rabbitmq`-Knoten, bei denen `rabbitmqOperation === "receive"` gilt, erhalten einen Consumer. Die Eingabe umfasst `message_data` (Body, Headers, routing_key usw.) und `triggered_by: "rabbitmq"`.

## Gleichzeitigkeitslimit

Ein Workflow mit einem [Gleichzeitigkeitslimit](./webhooks.md#concurrency-limit-and-queued-runs) reiht Produktionsläufe von jedem der oben genannten Einstiegspunkte in eine Warteschlange ein, wenn seine Slots voll sind, nach dem FIFO-Prinzip (First In, First Out) über alle Instanzen hinweg. Wie ein Aufrufer das Ergebnis erfährt, hängt vom Einstiegspunkt ab:

| Einstiegspunkt | Während der Lauf wartet |
|---|---|
| Webhook / API | `202 Accepted` mit einer `execution_id` und einer Status-URL |
| SSE streaming, Quick Drawer, Portal chat | Der Stream bleibt geöffnet und sendet `queued`-Ereignisse |
| Portal without streaming | Die Anfrage wartet auf das Ergebnis |
| MCP | Ein `queued`-Ergebnis zur Abfrage mit `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Der Trigger wartet auf das Ergebnis, so lange wie ein Lauf auf einer anderen [Instanz](./cluster.md) warten würde. Der Lauf wird in jedem Fall ausgeführt und in die Historie geschrieben |

Wenn die Warteschlange voll ist, startet der Lauf nicht und die Historie zeichnet ihn als `queue_full` auf. Editor-Testläufe, Sub-Workflow-Aufrufe ([Execute](../nodes/execute-node.md)-Knoten und Agent-Workflow-Tools), [Evals](../tabs/evals-tab.md), Chat-Build-Modus-Testläufe und Review-Wiederaufnahmen werden niemals in eine Warteschlange gestellt. [Board](../tabs/board-tab.md)-Kartenläufe, [File Upload](../nodes/file-upload-trigger-node.md)-Läufe, vom Run-Workflow-Tool des AI Assistant gestartete Läufe und Benachrichtigungs-Workflows für Warnungen starten ebenfalls ohne Wartezeit auf einen Slot.

## trigger_source

Der Ausführungsverlauf zeichnet `trigger_source` für jeden Einstiegspunkt auf:

| Wert | Wann |
|-------|------|
| `"API"` | Webhook / API-Aufruf ohne expliziten Header (Standard) |
| `"Canvas"` | Ausführung vom Canvas des Workflow-Editors |
| `"Quick Drawer"` | Ausführung über das Quick-Drawer-Panel des Editors, einschließlich Dateiläufen aus dessen Dropzone |
| `"cron"` | Cron-Scheduler |
| `"imap"` | IMAP-Trigger-Manager |
| `"websocket"` | Ausgehender WebSocket-Trigger-Manager |
| `"file_upload"` | Upload-Endpoint des File-Upload-Triggers (über HTTP, MCP oder den Canvas erstellte Links) |
| `"dashboard"` | Ausführungen von Dashboard-Widgets sowie Uploads über ein Datei-Drop-Widget |
| `"telegram"` | Telegram-Bot-Webhook |
| `"Discord"` | Discord-Interaktions-Webhook |
| `"MCP"` | MCP-Tool-Aufruf |
| `"portal"` | Portal-Ausführung |
| `"dashboard_chat"` | KI-Assistent-Chat |
| `"AI Agents"` | Sub-Workflow, der von einem KI-Agenten-Knoten aufgerufen wird |
| `"SUB_WORKFLOW"` | Sub-Workflow, der von einem Execute-Workflow-Knoten aufgerufen wird |
| benutzerdefiniert | Jeder Wert, der im `X-Trigger-Source`-Header oder als `trigger_source`-Query-/Body-Parameter gesendet wird |
| (nicht gesetzt) | RabbitMQ-Consumer |

## Eingaben nach Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` aus der Anfrage
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + optional `callback_query` + bereinigte `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + bereinigte `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (vollständiges Slack-Event-Objekt) + `headers` (bereinigt) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + optional `conversation_history`

## Verwandte Themen

- [Webhooks](./webhooks.md) – Webhook-TTL, Cache, Rate Limit, Authentifizierung
- [Workflow-Struktur](./workflow-structure.md) – Knoten und Kanten
- [Knotentypen](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord-Interaktions-Webhook-Trigger
- [Schnellstart](../getting-started/quick-start.md) – Einen Workflow mit Input erstellen
- [Portal](./portal.md) – Portal-Trigger und Chat-UI
- [Ausführungsverlauf](./execution-history.md) – Vergangene Ausführungen und trigger_source anzeigen
