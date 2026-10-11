# Trigger

I workflow vengono avviati da **nodi trigger** o **entry point**. Ogni tipo di trigger dispone di un proprio endpoint o processo in background.

## Nodi Trigger

Nodi di avvio (senza archi entranti) che danno inizio all'esecuzione:

| Tipo di Nodo | Descrizione |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Entry point HTTP. Riceve `body`, `headers`, `query` dalle richieste. |
| [Cron](../nodes/cron-node.md) | Viene eseguito secondo una pianificazione (espressione cron, ad es. `0 * * * *` per cadenza oraria). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Si avvia quando Telegram invia un aggiornamento webhook del bot all'URL webhook specifico del nodo. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Si avvia quando Discord invia un webhook dell'Interactions API all'endpoint specifico del nodo. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Esegue il polling di una casella IMAP e si avvia una volta per ogni nuova email rilevata. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Si avvia quando Heym pubblica un evento di piattaforma. Gli eventi all'interno di una stessa finestra di dispatch arrivano insieme come array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Apre una connessione client in uscita verso un socket esterno e si avvia sugli eventi socket selezionati. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genera un URL di upload monouso e si avvia quando un chiamante invia un file multipart di grandi dimensioni. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Si avvia quando un messaggio viene consumato da una coda RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Si avvia quando Slack invia un evento tramite il webhook delle Events API. |

## Entry Point

| Trigger | Endpoint / Origine | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Header `X-MCP-Key` oppure `Authorization: Bearer` (solo header) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token di sessione del Portal |
| **Board** | [Board](../tabs/board-tab.md) spostamento di una card / esecuzione di follow-up in una colonna con una catena di workflow (`trigger_source="board"`) | JWT (proprietario della board) |
| **Cron** | Scheduler cron (viene eseguito ogni 60s, valuta le espressioni cron) | N/A |
| **IMAP** | Gestore dei trigger IMAP (worker leader, intervallo di polling per nodo) | Username/password IMAP |
| **WebSocket** | Gestore dei trigger WebSocket in uscita (worker leader, connessioni client persistenti) | Header opzionali per nodo |
| **File Upload** | `POST /api/file-intake/u/{token}` dopo la generazione di uno slot | Token di capability monouso |
| **RabbitMQ** | Consumer RabbitMQ (worker leader) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Secret di firma HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Chiave pubblica dell'applicazione Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opzionale |
| **Editor** | Come per Webhook, tramite `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Il body della richiesta viene passato come `body` ai nodi textInput
- **Modalità body**: I workflow possono utilizzare esempi con campi definiti (`defined`) oppure esempi JSON grezzi (`generic`) nell'editor e nella finestra cURL
- **Auth**: Configurata per singolo workflow (`auth_type`, `allow_anonymous`)

Consultare [Webhooks](./webhooks.md) per dettagli su TTL, cache, rate limiting e auth.

### MCP

I workflow con `mcp_enabled=true` compaiono come tool ai client MCP. Il nome del tool deriva dal nome del workflow. Consultare [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interfaccia chat pubblica su `/chat/{slug}`. Consultare [Portal](./portal.md) per dettagli.

### Cron

Lo scheduler cron viene eseguito ogni 60 secondi, individua i workflow con nodi `cron` attivi, valuta le espressioni cron ed esegue i workflow corrispondenti. L'input include `{"triggered_by": "cron"}`.

### IMAP

Il gestore dei trigger IMAP viene eseguito nel worker leader e verifica i nodi `imapTrigger` attivi in base al `pollIntervalMinutes` configurato. Ogni nodo memorizza un cursore IMAP (`UIDVALIDITY` + ultimo UID rilevato). L'input include `email`, `triggered_by: "imap"`, `trigger_node_id` e `triggered_at`.

### Eventi della Piattaforma Heym

Il dispatcher degli eventi Heym esegue il polling del log `heym_events` ogni 5 secondi e consegna gli eventi corrispondenti ai nodi `heymTrigger` attivi. La consegna viene rivendicata per (evento, workflow, nodo) tramite un vincolo di unicità, così un evento viene attivato esattamente una volta per nodo sottoscritto su ogni worker, container e macchina. Ogni evento rivendicato in un singolo passaggio viene consegnato in un'unica esecuzione: l'input include `events` (sempre un array, dal più vecchio al più recente), `count`, `triggered_by: "heym_event"`, `trigger_node_id` e `triggered_at`. Vengono inviati solo gli eventi pubblicati negli ultimi 5 minuti, il che impedisce che un'interruzione comporti la riproduzione di un backlog; gli eventi vengono conservati per 7 giorni.

### WebSocket

Il gestore dei trigger WebSocket viene eseguito nel worker leader e mantiene una connessione client in uscita per ogni nodo [WebSocket Trigger](../nodes/websocket-trigger-node.md) attivo. Può emettere esecuzioni per `onMessage`, `onConnected` e `onClosed`. L'input include `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` e uno tra `message`, `connection` o `close`.

### Caricamento file

Il [Trigger Caricamento file](../nodes/file-upload-trigger-node.md) genera uno slot di caricamento monouso con TTL limitato quando il workflow viene invocato tramite API, MCP o canvas. Il caricamento di dati multipart form a `POST /api/file-intake/u/{token}` consuma lo slot, archivia il file come file di Drive e avvia il workflow in modo sincrono. L'input include `file`, `uploaded_at`, `triggered_by: "file_upload"` e i metadati di caricamento.

### Telegram

Telegram invia gli aggiornamenti del webhook del bot a `POST /api/telegram/webhook/{node_id}`. Il payload viene passato al workflow come `update`, `message`, `callback_query` opzionale, `headers` sanitizzati, `triggered_by`, `trigger_node_id` e `triggered_at`. Se la credenziale selezionata dispone di un token segreto, Heym verifica `x-telegram-bot-api-secret-token` prima dell'esecuzione.

### Discord

Discord invia i webhook di interazione a `POST /api/discord/webhook/{node_id}`. Il payload viene passato al workflow come `interaction`, `type`, `data`, `headers` sanitizzati, `triggered_by`, `trigger_node_id` e `triggered_at`. Heym verifica la richiesta utilizzando Ed25519 e la chiave pubblica dell'applicazione della credenziale `discord_trigger` selezionata prima dell'esecuzione.

### RabbitMQ

Il consumer RabbitMQ si avvia quando il worker leader viene inizializzato. I workflow con nodi `rabbitmq` in cui `rabbitmqOperation === "receive"` ricevono un consumer. L'input include `message_data` (body, headers, routing_key, ecc.) e `triggered_by: "rabbitmq"`.

## trigger_source

La cronologia delle esecuzioni registra `trigger_source` per ogni punto di ingresso:

| Valore | Quando |
|-------|------|
| `"API"` | Chiamata Webhook / API senza header esplicito (predefinito) |
| `"Canvas"` | Esecuzione dal canvas dell'editor del workflow |
| `"Quick Drawer"` | Esecuzione dal pannello quick-drawer dell'editor |
| `"cron"` | Pianificatore Cron |
| `"imap"` | Gestore del Trigger IMAP |
| `"websocket"` | Gestore del Trigger WebSocket in uscita |
| `"file_upload"` | Endpoint di caricamento del Trigger Caricamento file |
| `"telegram"` | Webhook del bot Telegram |
| `"Discord"` | Webhook delle interazioni Discord |
| `"MCP"` | Chiamata di uno strumento MCP |
| `"portal"` | Esecuzione dal Portale |
| `"dashboard_chat"` | Chat dell'assistente IA |
| `"AI Agents"` | Sub-workflow invocato da un nodo agente IA |
| `"SUB_WORKFLOW"` | Sub-workflow invocato da un nodo Execute Workflow |
| personalizzato | Qualsiasi valore inviato nell'header `X-Trigger-Source` o nel parametro query/body `trigger_source` |
| (non impostato) | Consumer RabbitMQ |

## Input per Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` dalla richiesta
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opzionale + `headers` sanitizzati + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` sanitizzati + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Caricamento file**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (oggetto evento Slack completo) + `headers` (sanitizzati) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portale**: `body.inputs` + `conversation_history` opzionale

## Correlati

- [Webhook](./webhooks.md) – TTL, cache, rate limit e autenticazione dei Webhook
- [Struttura del workflow](./workflow-structure.md) – Nodi e archi
- [Tipi di nodo](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Trigger Telegram](../nodes/telegram-trigger-node.md), [Trigger IMAP](../nodes/imap-trigger-node.md), [Trigger Heym](../nodes/heym-trigger-node.md), [Trigger WebSocket](../nodes/websocket-trigger-node.md), [Trigger Caricamento file](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Trigger Discord](../nodes/discord-trigger-node.md) – Trigger webhook delle interazioni Discord
- [Guida rapida](../getting-started/quick-start.md) – Creare un workflow con Input
- [Portale](./portal.md) – Trigger del Portale e interfaccia chat
- [Cronologia delle esecuzioni](./execution-history.md) – Visualizzare le esecuzioni passate e trigger_source
