# Triggers

Los Workflows se inician mediante **nodos trigger** o **puntos de entrada**. Cada tipo de trigger dispone de su propio endpoint o proceso en segundo plano.

## Nodos Trigger

Nodos de inicio (sin aristas entrantes) que inician la ejecución:

| Tipo de Nodo | Descripción |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Punto de entrada HTTP. Recibe `body`, `headers`, `query` de las peticiones. |
| [Cron](../nodes/cron-node.md) | Se ejecuta según una programación (expresión cron, por ejemplo `0 * * * *` para cada hora). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Se inicia cuando Telegram envía una actualización de webhook del bot a la URL de webhook específica del nodo. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Se inicia cuando Discord envía un webhook de la Interactions API al endpoint específico del nodo. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Consulta periódicamente un buzón IMAP y se inicia una vez por cada correo electrónico recién detectado. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Se inicia cuando Heym publica un evento de plataforma. Los eventos de una misma ventana de despacho llegan juntos como un array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Abre una conexión de cliente saliente hacia un socket externo y se inicia ante los eventos de socket seleccionados. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genera una URL de carga de un solo uso y se inicia cuando un solicitante publica un archivo multipart de gran tamaño. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Se inicia cuando se consume un mensaje de una cola de RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Se inicia cuando Slack envía un evento mediante el webhook de la Events API. |

## Puntos de Entrada

| Trigger | Endpoint / Origen | Autenticación |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Cabecera `X-MCP-Key` o `Authorization: Bearer` (solo cabeceras) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token de sesión del Portal |
| **Board** | Movimiento de tarjeta en el [Board](../tabs/board-tab.md) / ejecución de seguimiento hacia una columna con una cadena de workflow (`trigger_source="board"`) | JWT (propietario del board) |
| **Cron** | Planificador cron (se ejecuta cada 60 s, evalúa expresiones cron) | N/A |
| **IMAP** | Gestor de triggers IMAP (worker líder, intervalo de sondeo por nodo) | Usuario/contraseña de IMAP |
| **WebSocket** | Gestor de triggers WebSocket salientes (worker líder, conexiones de cliente persistentes) | Cabeceras opcionales por nodo |
| **File Upload** | `POST /api/file-intake/u/{token}` tras generarse un slot | Token de capacidad de un solo uso |
| **RabbitMQ** | Consumidor de RabbitMQ (worker líder) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Secreto de firma HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Clave pública de aplicación Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opcional |
| **Editor** | Igual que Webhook, mediante `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Entrada**: El cuerpo de la petición se pasa como `body` a los nodos textInput
- **Modo de cuerpo**: Los workflows pueden usar ejemplos con forma de campos `defined` o ejemplos JSON sin procesar `generic` en el editor y en el diálogo de cURL
- **Autenticación**: Se configura por workflow (`auth_type`, `allow_anonymous`)

Consulte [Webhooks](./webhooks.md) para obtener detalles sobre TTL, caché, limitación de tasa y autenticación.

### MCP

Los workflows con `mcp_enabled=true` aparecen como herramientas para los clientes MCP. El nombre de la herramienta se deriva del nombre del workflow. Consulte [MCP Tab](../tabs/mcp-tab.md).

### Portal

Interfaz de chat pública en `/chat/{slug}`. Consulte [Portal](./portal.md) para obtener detalles.

### Cron

El planificador cron se ejecuta cada 60 segundos, localiza los workflows con nodos `cron` activos, evalúa las expresiones cron y ejecuta los workflows coincidentes. La entrada incluye `{"triggered_by": "cron"}`.

### IMAP

El gestor de triggers IMAP se ejecuta en el worker líder y comprueba los nodos `imapTrigger` activos según su `pollIntervalMinutes` configurado. Cada nodo almacena un cursor IMAP (`UIDVALIDITY` + último UID visto). La entrada incluye `email`, `triggered_by: "imap"`, `trigger_node_id` y `triggered_at`.

### Eventos de la Plataforma Heym

El despachador de eventos de Heym consulta el log `heym_events` cada 5 segundos y entrega los eventos coincidentes a los nodos `heymTrigger` activos. La entrega se reclama por (evento, workflow, nodo) mediante una restricción única, de modo que un evento se dispara exactamente una vez por nodo suscriptor en cada worker, contenedor y máquina. Todos los eventos reclamados en una misma pasada se entregan en una única ejecución: la entrada incluye `events` (siempre un array, del más antiguo al más reciente), `count`, `triggered_by: "heym_event"`, `trigger_node_id` y `triggered_at`. Solo se despachan los eventos publicados en los últimos 5 minutos, lo que evita que una interrupción reproduzca un backlog; los eventos se conservan durante 7 días.

### WebSocket

El gestor de triggers WebSocket se ejecuta en el worker líder y mantiene una conexión de cliente saliente por cada nodo [WebSocket Trigger](../nodes/websocket-trigger-node.md) activo. Puede emitir ejecuciones para `onMessage`, `onConnected` y `onClosed`. La entrada incluye `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` y uno de `message`, `connection` o `close`.

### Carga de archivos

El [Trigger de carga de archivos](../nodes/file-upload-trigger-node.md) genera un slot de carga de un solo uso con TTL limitado cuando el workflow se invoca a través de la API, MCP o el canvas. La carga de datos de formulario multipart a `POST /api/file-intake/u/{token}` consume el slot, almacena el archivo como un archivo de Drive e inicia el workflow de forma síncrona. La entrada incluye `file`, `uploaded_at`, `triggered_by: "file_upload"` y metadatos de la carga.

### Telegram

Telegram envía actualizaciones del webhook del bot a `POST /api/telegram/webhook/{node_id}`. El payload se pasa al workflow como `update`, `message`, `callback_query` opcional, `headers` saneados, `triggered_by`, `trigger_node_id` y `triggered_at`. Si la credencial seleccionada tiene un token secreto, Heym verifica `x-telegram-bot-api-secret-token` antes de la ejecución.

### Discord

Discord envía webhooks de interacción a `POST /api/discord/webhook/{node_id}`. El payload se pasa al workflow como `interaction`, `type`, `data`, `headers` saneados, `triggered_by`, `trigger_node_id` y `triggered_at`. Heym verifica la solicitud mediante Ed25519 y la clave pública de la aplicación de la credencial `discord_trigger` seleccionada antes de la ejecución.

### RabbitMQ

El consumidor de RabbitMQ se inicia cuando el worker líder se inicializa. Los workflows con nodos `rabbitmq` donde `rabbitmqOperation === "receive"` obtienen un consumidor. La entrada incluye `message_data` (body, headers, routing_key, etc.) y `triggered_by: "rabbitmq"`.

## trigger_source

El historial de ejecuciones registra `trigger_source` para cada punto de entrada:

| Valor | Cuándo |
|-------|------|
| `"API"` | Llamada de Webhook / API sin header explícito (predeterminado) |
| `"Canvas"` | Ejecución desde el canvas del editor de workflows |
| `"Quick Drawer"` | Ejecución desde el panel quick-drawer del editor, incluidas las ejecuciones de archivos subidos desde su zona de soltar |
| `"cron"` | Programador Cron |
| `"imap"` | Gestor de Trigger IMAP |
| `"websocket"` | Gestor de Trigger WebSocket saliente |
| `"file_upload"` | Endpoint de carga del Trigger de carga de archivos (enlaces generados mediante HTTP, MCP o el lienzo) |
| `"dashboard"` | Ejecuciones de widgets del panel y cargas desde un widget de soltar archivos |
| `"telegram"` | Webhook del bot de Telegram |
| `"Discord"` | Webhook de interacciones de Discord |
| `"MCP"` | Llamada a herramienta MCP |
| `"portal"` | Ejecución desde el Portal |
| `"dashboard_chat"` | Chat del asistente de IA |
| `"AI Agents"` | Sub-workflow invocado por un Nodo de agente IA |
| `"SUB_WORKFLOW"` | Sub-workflow invocado por un Nodo de ejecución de workflow |
| personalizado | Cualquier valor enviado en el header `X-Trigger-Source` o en el parámetro `trigger_source` de query/body |
| (no establecido) | Consumidor de RabbitMQ |

## Entradas por Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` de la solicitud
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opcional + `headers` saneados + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` saneados + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Carga de archivos**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (objeto de evento completo de Slack) + `headers` (saneados) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` opcional

## Relacionado

- [Webhooks](./webhooks.md) – TTL de Webhook, caché, límite de tasa, autenticación
- [Estructura del workflow](./workflow-structure.md) – Nodos y aristas
- [Tipos de nodo](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Trigger de Telegram](../nodes/telegram-trigger-node.md), [Trigger de IMAP](../nodes/imap-trigger-node.md), [Trigger de Heym](../nodes/heym-trigger-node.md), [Trigger de WebSocket](../nodes/websocket-trigger-node.md), [Trigger de carga de archivos](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Trigger de Discord](../nodes/discord-trigger-node.md) – Trigger de webhook de interacciones de Discord
- [Inicio rápido](../getting-started/quick-start.md) – Cree un workflow con Input
- [Portal](./portal.md) – Trigger de Portal e interfaz de chat
- [Historial de ejecuciones](./execution-history.md) – Consulte ejecuciones anteriores y trigger_source
