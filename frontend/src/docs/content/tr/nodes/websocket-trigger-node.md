# WebSocket Trigger

**WebSocket Trigger** düğümü, harici bir WebSocket sunucusuna giden bir istemci bağlantısı açar ve seçilen socket olayları gerçekleştiğinde workflow'u başlatır. Piyasa akışları, telemetri veya sohbet arka uçları gibi olay akışları için kullanın. Dahili gerçek zamanlı sistemlere bağlanmak için aşağıda açıklanan özel URL devre dışı bırakma seçeneği gereklidir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Önemli Davranış

- Bu düğüm **Heym'den başka bir WebSocket sunucusuna** bağlanır.
- Heym üzerinde bir WebSocket endpoint'i **sunmaz**.
- Herhangi bir [credential](../reference/credentials.md) gerekmez. URL, header'lar ve subprotocol'leri doğrudan düğüm üzerinde yapılandırın.
- Leader worker bağlantıyı arka planda açık tutar ve etkinleştirildiğinde yeniden bağlanır.

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `websocketUrl` | string | Harici `ws://` veya `wss://` URL |
| `websocketHeaders` | JSON object string | İsteğe bağlı handshake header'ları |
| `websocketSubprotocols` | string | İsteğe bağlı virgülle ayrılmış subprotocol listesi |
| `websocketTriggerEvents` | array | `onMessage`, `onConnected`, `onClosed` değerlerinden herhangi biri |
| `retryEnabled` | boolean | Bağlantı kesildikten sonra yeniden bağlan |
| `retryWaitSeconds` | integer | Yeniden bağlanmadan önce bekleme süresi |

## Yayılan Olaylar

### `onMessage`

Uzak socket'ten bir frame geldiğinde tetiklenir.

Kullanışlı alanlar:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.message.data` | Ayrıştırılmış JSON payload veya ham mesaj değeri |
| `$nodeLabel.message.text` | Mevcut olduğunda UTF-8 çözümlenmiş metin |
| `$nodeLabel.message.base64` | Base64 olarak ikili payload |
| `$nodeLabel.message.sizeBytes` | Payload boyutu |
| `$nodeLabel.message.isJson` | Mesajın JSON olarak ayrıştırılıp ayrıştırılmadığı |

### `onConnected`

Socket başarıyla açıldıktan sonra tetiklenir.

Kullanışlı alanlar:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | İlk bağlantıda `false`, sonraki yeniden bağlantılarda `true` |
| `$nodeLabel.connection.subprotocol` | Üzerinde anlaşılan subprotocol |

### `onClosed`

Kurulmuş bir bağlantı kapandığında tetiklenir.

Kullanışlı alanlar:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` veya `unknown` |
| `$nodeLabel.close.code` | WebSocket kapatma kodu |
| `$nodeLabel.close.reason` | Kapatma nedeni |
| `$nodeLabel.close.wasClean` | Normal `1000` kapatma için `true` |
| `$nodeLabel.close.reconnecting` | Düğümün yeniden bağlanmayı deneyip denemeyeceği |

## Trigger Semantiği

- Bir etkin düğüm, uzun ömürlü tek bir giden socket bağlantısı tutar.
- Bağlantı yalnızca leader worker üzerinde çalışır; [IMAP Trigger](./imap-trigger-node.md) ve [RabbitMQ](./rabbitmq-node.md) alma moduna benzer.
- Yeniden bağlanma etkinleştirilmişse, Heym `retryWaitSeconds` bekler ve bağlantı koptuktan sonra socket'i yeniden açar.
- Yayılan her olay, `trigger_source = "websocket"` ile ayrı bir workflow çalıştırması oluşturur.

## Giden Trafik Güvenliği

- Varsayılan olarak URL `ws://` veya `wss://` kullanmalı ve yalnızca genel adreslere çözümlenmelidir. Loopback, özel, link-local, multicast ve bulut metadata hedefleri engellenir.
- Heym her yeniden bağlanmada DNS'i yeniden doğrular, çözümlenen her adresi doğrular ve doğrudan bu adreslerden birine bağlanır. Koruma etkinken ortam proxy'leri ve WebSocket yönlendirmeleri devre dışı bırakılır.
- Kalıcı politika ihlalleri, sonsuza kadar yeniden denemek yerine trigger'ı durdurur. Geçici DNS veya ağ hataları yine de düğümün yeniden deneme ayarlarını izler.
- `Authorization`, `Origin`, `User-Agent` ve özel veri header'ları desteklenir. `Origin`, WebSocket istemcisinin özel seçeneği aracılığıyla gönderilir. `Host`, `Connection`, `Upgrade` ve `Sec-WebSocket-*` header'ları geçersiz kılınamaz.
- Dahili servislere kasıtlı olarak bağlanan güvenilir self-hosted kurulumlar `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ayarını yapabilir. Hosted veya çok kiracılı kurulumlarda varsayılanı koruyun.

**v0.0.105 için yükseltme notu:** bu örnek genelinde geçerli politika artık Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, özel LLM yürütme ve model keşfi, AI asistanı, guardrail'ler ve RAG embedding'leri tarafından kullanılan credential kaynaklı hedefleri de korur. Loopback, özel veya link-local adreslere işaret eden mevcut credential'lar, güvenilir bir self-hosted örnekte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` etkinleştirilmediği sürece reddedilir. Koruma açıkken, korunan HTTP istemcileri `HTTP_PROXY` ve `HTTPS_PROXY` değişkenlerini yok sayar; devre dışı bırakma seçeneğinin etkinleştirilmesi bunları geri getirir. `SSL_CERT_FILE` veya `SSL_CERT_DIR` aracılığıyla yapılandırılan operatör CA paketleri desteklenmeye devam eder. ClickHouse, bağlantı açılmadan önce kontrol edilir ancak dial anında sabitlenmez; çünkü clickhouse-connect kendi urllib3 taşıma katmanını getirir.

## Örnek Workflow

**Harici olay akışı → filtre → bildirim**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** etiketi: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** mesajı: `"Realtime alert: $streamEvent.message.data.title"`
## Örnek Node JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## İlgili

- [Trigger'lar](../reference/triggers.md) – Arka plan trigger mimarisi ve `trigger_source`
- [WebSocket Gönderimi](./websocket-send-node.md) – Bir workflow adımından harici bir sokete veri gönderin
- [Node Türleri](../reference/node-types.md) – Tüm node'lara genel bakış
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md) – Hangi node'ların credential kullandığı ve hangilerinin kullanmadığı
