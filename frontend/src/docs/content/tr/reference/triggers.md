# Trigger'lar

Workflow'lar **trigger node'ları** veya **giriş noktaları** tarafından başlatılır. Her trigger türünün kendi endpoint'i veya arka plan süreci vardır.

## Trigger Node'ları

Yürütmeyi başlatan başlangıç node'ları (gelen kenarı olmayan):

| Node Türü | Açıklama |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP giriş noktası. İsteklerden `body`, `headers`, `query` alır. |
| [Cron](../nodes/cron-node.md) | Bir zamanlamaya göre çalışır (cron ifadesi, örn. saatlik için `0 * * * *`). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram, node'a özel webhook URL'sine bir bot webhook güncellemesi gönderdiğinde başlar. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord, node'a özel endpoint'e bir Interactions API webhook'u gönderdiğinde başlar. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Bir IMAP posta kutusunu yoklar ve yeni algılanan her e-posta için bir kez başlar. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Heym bir platform olayı yayımladığında başlar. Bir dispatch penceresindeki olaylar bir dizi olarak birlikte gelir. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Harici bir socket'e giden bir istemci bağlantısı açar ve seçilen socket olaylarında başlar. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Tek kullanımlık bir yükleme URL'si üretir ve bir çağıran büyük bir multipart dosya gönderdiğinde başlar. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Bir RabbitMQ kuyruğundan bir mesaj tüketildiğinde başlar. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Slack, Events API webhook'u aracılığıyla bir olay gönderdiğinde başlar. |

## Giriş Noktaları

| Trigger | Endpoint / Kaynak | Kimlik Doğrulama |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header'ı veya `Authorization: Bearer` (yalnızca header'lar) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal oturum token'ı |
| **Board** | [Board](../tabs/board-tab.md) kart taşıma / bir workflow zinciri içeren bir sütuna takip çalıştırması (`trigger_source="board"`) | JWT (board sahibi) |
| **Cron** | Cron zamanlayıcısı (her 60 saniyede çalışır, cron ifadelerini değerlendirir) | Yok |
| **IMAP** | IMAP trigger yöneticisi (lider worker, node başına yoklama aralığı) | IMAP kullanıcı adı/parola |
| **WebSocket** | Giden WebSocket trigger yöneticisi (lider worker, kalıcı istemci bağlantıları) | Node başına isteğe bağlı header'lar |
| **File Upload** | Bir slot üretildikten sonra `POST /api/file-intake/u/{token}` | Tek kullanımlık yetenek token'ı |
| **RabbitMQ** | RabbitMQ tüketicisi (lider worker) | Yok |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 imzalama gizli anahtarı |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 uygulama genel anahtarı |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | İsteğe bağlı `x-telegram-bot-api-secret-token` |
| **Editor** | Webhook ile aynı, `workflowStore.executeWorkflow` aracılığıyla | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Giriş**: İstek gövdesi, textInput node'larına `body` olarak iletilir
- **Body modu**: Workflow'lar, editörde ve cURL diyaloğunda `defined` alan şeklindeki örnekleri veya `generic` ham JSON örneklerini kullanabilir
- **Kimlik Doğrulama**: Workflow başına yapılandırılır (`auth_type`, `allow_anonymous`)

TTL, önbellek, hız sınırlama ve kimlik doğrulama ayrıntıları için [Webhooks](./webhooks.md) bölümüne bakın.

### MCP

`mcp_enabled=true` olan workflow'lar, MCP istemcilerine araç olarak görünür. Araç adı, workflow adından türetilir. Bkz. [MCP Tab](../tabs/mcp-tab.md).

### Portal

`/chat/{slug}` adresindeki genel sohbet arayüzü. Ayrıntılar için [Portal](./portal.md) bölümüne bakın.

### Cron

Cron zamanlayıcısı her 60 saniyede çalışır, etkin `cron` node'larına sahip workflow'ları bulur, cron ifadelerini değerlendirir ve eşleşen workflow'ları çalıştırır. Giriş `{"triggered_by": "cron"}` içerir.

### IMAP

IMAP trigger yöneticisi lider worker'da çalışır ve etkin `imapTrigger` node'larını yapılandırılmış `pollIntervalMinutes` değerlerinde kontrol eder. Her node bir IMAP imleci (`UIDVALIDITY` + son görülen UID) saklar. Giriş `email`, `triggered_by: "imap"`, `trigger_node_id` ve `triggered_at` içerir.

### Heym Platform Olayları

Heym olay dağıtıcısı, `heym_events` günlüğünü her 5 saniyede yoklar ve eşleşen olayları etkin `heymTrigger` node'larına iletir. Teslimat, benzersiz bir kısıtlama aracılığıyla (olay, workflow, node) başına talep edilir; böylece bir olay, her worker, container ve makine genelinde abone olan node başına tam olarak bir kez tetiklenir. Bir geçişte talep edilen her olay tek bir çalıştırmada iletilir: giriş `events` (her zaman bir dizi, en eskisi ilk), `count`, `triggered_by: "heym_event"`, `trigger_node_id` ve `triggered_at` içerir. Yalnızca son 5 dakika içinde yayımlanan olaylar dağıtılır; bu, bir kesintinin birikmiş işleri yeniden oynatmasını engeller; olaylar 7 gün boyunca saklanır.

### WebSocket

WebSocket trigger yöneticisi lider worker'da çalışır ve etkin her [WebSocket Trigger](../nodes/websocket-trigger-node.md) node'u için bir giden istemci bağlantısı tutar. `onMessage`, `onConnected` ve `onClosed` için çalıştırmalar yayabilir. Giriş `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` ve `message`, `connection` veya `close` değerlerinden birini içerir.

### Dosya Yükleme

[File Upload Trigger](../nodes/file-upload-trigger-node.md), workflow API, MCP veya canvas üzerinden çağrıldığında TTL ile sınırlı, tek kullanımlık bir yükleme slotu oluşturur. `POST /api/file-intake/u/{token}` adresine multipart form verisi yüklemek slotu tüketir, dosyayı bir Drive dosyası olarak saklar ve workflow'u senkron olarak başlatır. Girdi `file`, `uploaded_at`, `triggered_by: "file_upload"` ve yükleme meta verilerini içerir.

### Telegram

Telegram, bot webhook güncellemelerini `POST /api/telegram/webhook/{node_id}` adresine gönderir. Payload, workflow'a `update`, `message`, isteğe bağlı `callback_query`, temizlenmiş `headers`, `triggered_by`, `trigger_node_id` ve `triggered_at` olarak aktarılır. Seçili credential bir secret token içeriyorsa, Heym yürütmeden önce `x-telegram-bot-api-secret-token` değerini doğrular.

### Discord

Discord, etkileşim webhook'larını `POST /api/discord/webhook/{node_id}` adresine gönderir. Payload, workflow'a `interaction`, `type`, `data`, temizlenmiş `headers`, `triggered_by`, `trigger_node_id` ve `triggered_at` olarak aktarılır. Heym, yürütmeden önce isteği Ed25519 ve seçili `discord_trigger` credential'ının uygulama public key'i ile doğrular.

### RabbitMQ

RabbitMQ consumer, leader worker başlatıldığında çalışmaya başlar. `rabbitmqOperation === "receive"` olan `rabbitmq` node'larına sahip workflow'lar bir consumer alır. Girdi `message_data` (body, headers, routing_key vb.) ve `triggered_by: "rabbitmq"` içerir.

## trigger_source

Execution history, her giriş noktası için `trigger_source` kaydeder:

| Değer | Ne Zaman |
|-------|------|
| `"API"` | Açık bir header olmadan Webhook / API çağrısı (varsayılan) |
| `"Canvas"` | Workflow editörü canvas'ından çalıştırma |
| `"Quick Drawer"` | Editör quick-drawer panelinden çalıştırma (bırakma alanından yüklenen dosya çalıştırmaları dahil) |
| `"cron"` | Cron scheduler |
| `"imap"` | IMAP trigger manager |
| `"websocket"` | Giden WebSocket trigger manager |
| `"file_upload"` | File Upload Trigger yükleme endpoint'i (HTTP, MCP veya tuval üzerinden oluşturulan bağlantılar) |
| `"dashboard"` | Pano widget çalıştırmaları ve dosya bırakma widget'ından yapılan yüklemeler |
| `"telegram"` | Telegram bot webhook |
| `"Discord"` | Discord interactions webhook |
| `"MCP"` | MCP tool çağrısı |
| `"portal"` | Portal execute |
| `"dashboard_chat"` | AI assistant chat |
| `"AI Agents"` | Bir AI agent node'u tarafından çağrılan sub-workflow |
| `"SUB_WORKFLOW"` | Bir Execute Workflow node'u tarafından çağrılan sub-workflow |
| özel | `X-Trigger-Source` header'ında veya `trigger_source` query/body parametresinde gönderilen herhangi bir değer |
| (ayarlanmamış) | RabbitMQ consumer |

## Trigger'a Göre Girdiler

- **HTTP/Webhook**: İstekten gelen `body`, `headers`, `query`
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + isteğe bağlı `callback_query` + temizlenmiş `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + temizlenmiş `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (tam Slack event nesnesi) + `headers` (temizlenmiş) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + isteğe bağlı `conversation_history`

## İlgili

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow Structure](./workflow-structure.md) – Node'lar ve edge'ler
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord interactions webhook trigger
- [Quick Start](../getting-started/quick-start.md) – Input ile bir workflow oluşturun
- [Portal](./portal.md) – Portal trigger ve chat UI
- [Execution History](./execution-history.md) – Geçmiş çalıştırmaları ve trigger_source'u görüntüleyin
