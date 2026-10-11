# WebSocket Gönderimi

**WebSocket Send** düğümü, harici bir WebSocket sunucusuna giden bir istemci bağlantısı açar, bir mesaj gönderir ve bağlantıyı kapatır. Bir workflow'un, Heym'e ait bir socket endpoint'i açığa çıkarmadan bir gerçek zamanlı sisteme olayları iletmesi gerektiğinde bunu kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Harici `ws://` veya `wss://` URL |
| `websocketHeaders` | JSON object string / expression | İsteğe bağlı handshake header'ları |
| `websocketSubprotocols` | string | İsteğe bağlı, virgülle ayrılmış subprotocol listesi |
| `websocketMessage` | expression | Gönderilecek payload |

## Mesaj Serileştirme Kuralları

- `websocketMessage` bir **string** olarak çözümlenirse, Heym bir metin çerçevesi gönderir.
- Bir **object**, **array**, **number**, **boolean** veya `null` olarak çözümlenirse, Heym bunu JSON metni olarak serileştirir.
- **bytes** olarak çözümlenirse, Heym bir ikili çerçeve gönderir.
- `$input` gibi tam ifadeler, serileştirmeden önce yerel türlerini korur.

## Çıkış Alanları

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.status` | Başarı durumunda `"sent"` |
| `$nodeLabel.url` | Çözümlenmiş hedef URL |
| `$nodeLabel.message_type` | `text`, `json` veya `binary` |
| `$nodeLabel.size_bytes` | Payload boyutu (byte cinsinden) |
| `$nodeLabel.subprotocol` | Mevcut olduğunda üzerinde anlaşılan subprotocol |
| `$nodeLabel.sent_at` | ISO zaman damgası |

## Örnek Workflow

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- **Set**, `{ "type": "user.updated", "user": $input.body }` gibi bir payload nesnesi oluşturur
- **WebSocket Send**, `websocketMessage` olarak `$payloadNode` kullanır
- **Output**, `$socketSend.status` döndürebilir

## Örnek Node JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Notlar

- Bu düğüm için herhangi bir [credential](../reference/credentials.md) gerekli değildir.
- Uzak sunucu auth veya tenant header'ları bekliyorsa, bunları `websocketHeaders` aracılığıyla iletin.
- Uzak sistem socket tabanlı yerine istek/yanıt tabanlıysa [HTTP](./http-node.md) kullanın.

## Egress Güvenliği

- Varsayılan olarak, URL `ws://` veya `wss://` kullanmalı ve yalnızca genel adreslere çözümlenmelidir. Loopback, private, link-local, multicast ve cloud-metadata hedefleri engellenir.
- Heym, çözümlenen her adresi doğrular ve doğrudan bu adreslerden birine bağlanır. Koruma etkinken ortam proxy'leri ve WebSocket yönlendirmeleri devre dışı bırakılır.
- `Authorization`, `Origin`, `User-Agent` ve özel veri header'ları desteklenir. `Origin`, WebSocket istemcisinin özel seçeneği aracılığıyla gönderilir. `Host`, `Connection`, `Upgrade` ve `Sec-WebSocket-*` header'ları geçersiz kılınamaz.
- Dahili servislere kasıtlı olarak bağlanan güvenilir self-hosted dağıtımlar `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ayarını yapabilir. Hosted veya çok kiracılı dağıtımlarda varsayılan ayarı koruyun.

**v0.0.105 için yükseltme notu:** bu instance genelindeki politika artık Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, özel LLM yürütme ve model keşfi, AI asistanı, guardrails ve RAG embeddings tarafından kullanılan credential kaynaklı hedefleri de korumaktadır. Loopback, private veya link-local adreslere işaret eden mevcut credential'lar, güvenilir bir self-hosted instance üzerinde `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` etkinleştirilmediği sürece reddedilir. Koruma açıkken, korunan HTTP istemcileri `HTTP_PROXY` ve `HTTPS_PROXY` ayarlarını yok sayar; opt-out etkinleştirildiğinde bunlar geri yüklenir. `SSL_CERT_FILE` veya `SSL_CERT_DIR` aracılığıyla yapılandırılan operatör CA paketleri desteklenmeye devam eder. ClickHouse, bağlantı açılmadan önce kontrol edilir ancak dial anında sabitlenmez, çünkü clickhouse-connect kendi urllib3 transport'unu getirir.

## İlgili

- [WebSocket Trigger](./websocket-trigger-node.md) – Harici bir socket'i dinleyin ve olaylarda workflow'ları tetikleyin
- [Node Types](../reference/node-types.md) – Entegrasyon düğümü genel bakışı
- [Expression DSL](../reference/expression-dsl.md) – Dinamik JSON payload'ları oluşturun
- [Third-Party Integrations](../reference/integrations.md) – Credential destekli ve doğrudan yapılandırma entegrasyonları
