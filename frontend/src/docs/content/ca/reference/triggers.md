# Triggers

Els Workflows s'inicien mitjançant **trigger nodes** o **punts d'entrada**. Cada tipus de trigger té el seu propi endpoint o procés en segon pla.

## Trigger Nodes

Nodes d'inici (sense arestes entrants) que inicien l'execució:

| Tipus de Node | Descripció |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Punt d'entrada HTTP. Rep `body`, `headers`, `query` de les peticions. |
| [Cron](../nodes/cron-node.md) | S'executa segons una planificació (expressió cron, p. ex. `0 * * * *` per cada hora). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | S'inicia quan Telegram envia una actualització de webhook del bot a la URL de webhook específica del Node. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | S'inicia quan Discord envia un webhook de l'API d'Interactions a l'endpoint específic del Node. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Consulta periòdicament una bústia IMAP i s'inicia una vegada per cada correu electrònic nou detectat. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | S'inicia quan Heym publica un esdeveniment de plataforma. Els esdeveniments d'una mateixa finestra de despatx arriben junts com un array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Obre una connexió de client sortint a un socket extern i s'inicia amb els esdeveniments de socket seleccionats. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genera una URL de càrrega d'un sol ús i s'inicia quan un sol·licitant publica un fitxer multipart gran. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | S'inicia quan es consumeix un missatge d'una cua de RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | S'inicia quan Slack envia un esdeveniment mitjançant el webhook de l'Events API. |

## Punts d'entrada

| Trigger | Endpoint / Origen | Autenticació |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Capçalera `X-MCP-Key` o `Authorization: Bearer` (només capçaleres) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token de sessió del Portal |
| **Board** | Moviment de targeta o execució de seguiment del [Board](../tabs/board-tab.md) cap a una columna amb una cadena de workflow (`trigger_source="board"`) | JWT (propietari del board) |
| **Cron** | Planificador cron (s'executa cada 60 s, avalua expressions cron) | N/A |
| **IMAP** | Gestor de triggers IMAP (worker líder, interval d'enquesta per Node) | Usuari/contrasenya IMAP |
| **WebSocket** | Gestor de triggers WebSocket sortints (worker líder, connexions de client persistents) | Capçaleres opcionals per Node |
| **File Upload** | `POST /api/file-intake/u/{token}` després de generar una ranura | Token de capacitat d'un sol ús |
| **RabbitMQ** | Consumidor de RabbitMQ (worker líder) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Secret de signatura HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Clau pública d'aplicació Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opcional |
| **Editor** | Igual que Webhook, mitjançant `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Entrada**: El cos de la petició es passa com a `body` als nodes textInput
- **Mode del cos**: Els workflows poden utilitzar exemples amb forma de camps `defined` o exemples JSON en brut `generic` a l'editor i al diàleg de cURL
- **Autenticació**: Configurada per workflow (`auth_type`, `allow_anonymous`)

Consulteu [Webhooks](./webhooks.md) per a més detalls sobre TTL, caché, limitació de velocitat i autenticació.

### MCP

Els workflows amb `mcp_enabled=true` apareixen com a eines per als clients MCP. El nom de l'eina es deriva del nom del workflow. Consulteu [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interfície de xat pública a `/chat/{slug}`. Consulteu [Portal](./portal.md) per a més detalls.

### Cron

El planificador cron s'executa cada 60 segons, troba els workflows amb nodes `cron` actius, avalua les expressions cron i executa els workflows coincidents. L'entrada inclou `{"triggered_by": "cron"}`.

### IMAP

El gestor de triggers IMAP s'executa al worker líder i comprova els nodes `imapTrigger` actius segons el seu `pollIntervalMinutes` configurat. Cada Node emmagatzema un cursor IMAP (`UIDVALIDITY` + darrer UID vist). L'entrada inclou `email`, `triggered_by: "imap"`, `trigger_node_id` i `triggered_at`.

### Esdeveniments de la plataforma Heym

El despatxador d'esdeveniments de Heym consulta el registre `heym_events` cada 5 segons i lliura els esdeveniments coincidents als nodes `heymTrigger` actius. El lliurament es reclama per (esdeveniment, workflow, Node) mitjançant una restricció única, de manera que un esdeveniment s'activa exactament una vegada per Node subscrit a tots els workers, contenidors i màquines. Cada esdeveniment reclamat en una passada es lliura en una única execució: l'entrada inclou `events` (sempre un array, del més antic al més recent), `count`, `triggered_by: "heym_event"`, `trigger_node_id` i `triggered_at`. Només es despatxen els esdeveniments publicats en els darrers 5 minuts, cosa que evita que una interrupció reprodueixi una acumulació; els esdeveniments es conserven durant 7 dies.

### WebSocket

El gestor de triggers WebSocket s'executa al worker líder i manté una connexió de client sortint per cada Node [WebSocket Trigger](../nodes/websocket-trigger-node.md) actiu. Pot emetre execucions per a `onMessage`, `onConnected` i `onClosed`. L'entrada inclou `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` i un de `message`, `connection` o `close`.
### Càrrega de fitxers

El [Trigger de càrrega de fitxers](../nodes/file-upload-trigger-node.md) genera un espai de càrrega d'un sol ús amb TTL limitat quan el workflow s'invoca a través de l'API, MCP o el canvas. Carregar dades de formulari multipart a `POST /api/file-intake/u/{token}` consumeix l'espai, emmagatzema el fitxer com a fitxer de Drive i inicia el workflow de manera sincrònica. L'entrada inclou `file`, `uploaded_at`, `triggered_by: "file_upload"` i les metadades de la càrrega.

### Telegram

Telegram envia actualitzacions del webhook del bot a `POST /api/telegram/webhook/{node_id}`. El payload es passa al workflow com a `update`, `message`, `callback_query` opcional, `headers` sanejats, `triggered_by`, `trigger_node_id` i `triggered_at`. Si la credencial seleccionada té un token secret, Heym verifica `x-telegram-bot-api-secret-token` abans de l'execució.

### Discord

Discord envia webhooks d'interacció a `POST /api/discord/webhook/{node_id}`. El payload es passa al workflow com a `interaction`, `type`, `data`, `headers` sanejats, `triggered_by`, `trigger_node_id` i `triggered_at`. Heym verifica la sol·licitud mitjançant Ed25519 i la clau pública de l'aplicació de la credencial `discord_trigger` seleccionada abans de l'execució.

### RabbitMQ

El consumidor de RabbitMQ s'inicia quan el worker líder s'inicialitza. Els workflows amb nodes `rabbitmq` on `rabbitmqOperation === "receive"` obtenen un consumidor. L'entrada inclou `message_data` (cos, headers, routing_key, etc.) i `triggered_by: "rabbitmq"`.

## trigger_source

L'historial d'execucions registra `trigger_source` per a cada punt d'entrada:

| Valor | Quan |
|-------|------|
| `"API"` | Crida de Webhook / API sense capçalera explícita (per defecte) |
| `"Canvas"` | Execució des del canvas de l'editor de workflows |
| `"Quick Drawer"` | Execució des del panell de calaix ràpid de l'editor, incloses les execucions de fitxers pujats des de la seva zona d'arrossegament |
| `"cron"` | Planificador Cron |
| `"imap"` | Gestor de triggers IMAP |
| `"websocket"` | Gestor de triggers de WebSocket de sortida |
| `"file_upload"` | Endpoint de càrrega del Trigger de càrrega de fitxers (enllaços generats per HTTP, MCP o el llenç) |
| `"dashboard"` | Execucions de ginys del tauler i pujades des d'un giny d'arrossegament de fitxers |
| `"telegram"` | Webhook del bot de Telegram |
| `"Discord"` | Webhook d'interaccions de Discord |
| `"MCP"` | Crida d'eina MCP |
| `"portal"` | Execució del portal |
| `"dashboard_chat"` | Xat de l'assistent d'IA |
| `"AI Agents"` | Sub-workflow invocat per un node d'agent d'IA |
| `"SUB_WORKFLOW"` | Sub-workflow invocat per un node d'Execute Workflow |
| personalitzat | Qualsevol valor enviat a la capçalera `X-Trigger-Source` o al paràmetre de consulta/cos `trigger_source` |
| (no definit) | Consumidor de RabbitMQ |

## Entrades per Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` de la sol·licitud
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opcional + `headers` sanejats + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` sanejats + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Càrrega de fitxers**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (objecte d'esdeveniment complet de Slack) + `headers` (sanejats) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` opcional

## Relacionat

- [Webhooks](./webhooks.md) – TTL de Webhook, caché, límit de velocitat, autenticació
- [Estructura del workflow](./workflow-structure.md) – Nodes i arestes
- [Tipus de Node](./node-types.md) – [Entrada](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Trigger de Telegram](../nodes/telegram-trigger-node.md), [Trigger d'IMAP](../nodes/imap-trigger-node.md), [Trigger de Heym](../nodes/heym-trigger-node.md), [Trigger de WebSocket](../nodes/websocket-trigger-node.md), [Trigger de càrrega de fitxers](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Trigger de Discord](../nodes/discord-trigger-node.md) – Trigger del webhook d'interaccions de Discord
- [Inici ràpid](../getting-started/quick-start.md) – Creeu un workflow amb Entrada
- [Portal](./portal.md) – Trigger del portal i interfície de xat
- [Historial d'execucions](./execution-history.md) – Visualitzeu execucions passades i trigger_source
