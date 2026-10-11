# Webhooks

Workflow'lar HTTP webhook'ları aracılığıyla tetiklenebilir. Standart execute endpoint'i JSON döndürür, streaming varyantı ise Server-Sent Events (SSE) döndürür.

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

`{workflow_id}` yerine workflow UUID'sini yazın. Base URL, Heym instance'ınızdır (örn. `https://app.heym.ai`).

## Request Method

Her workflow tek bir HTTP verb kabul eder; bu, editördeki cURL dialog'unda seçilir: `GET`, `POST`, `PUT` veya `DELETE`. **`POST` varsayılandır** ve bu ayar mevcut olmadan önce oluşturulan her workflow bunu korur, dolayısıyla bugün çalışan hiçbir şey değişmez.

Bir workflow'u farklı bir verb ile çağırmak, yapılandırılmış olanı belirten bir `Allow` header'ı ile birlikte `405 Method Not Allowed` döndürür:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Bir istisna: `?test_run=true` taşıyan istekler bu kontrolü atlar. Editördeki **Run** butonu ve debug panelinin gönderdiği budur, dolayısıyla `GET` olarak ayarlanmış bir workflow ürün içinden test edilebilir kalır.

### Bodyless methods

`GET` ve `DELETE` request body taşımaz. Girdiler bunun yerine query string'den gelir ve `$input.query.<name>` ile okunur:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL dialog'u bu iki method için request-body editörünü gizler ve `Content-Type` header'ını kaldırır.

Bir tarayıcının doğrudan açabileceği bir sayfa sunmak için `GET`'i bir [HTML output mapper](../nodes/html-output-mapper-node.md) ile eşleştirin.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Tek bir JSON yanıtı yerine artımlı execution event'leri istediğinizde streaming endpoint'ini kullanın. Event protokolü ve node başına start message yapılandırması için [SSE Streaming](./sse-streaming.md) bölümüne bakın.

## Request Format

Request body, [Input](../nodes/input-node.md) node'larına `body` olarak iletilir. Heym her iki request şeklini de kabul eder:

- **Raw JSON** – örn. `{"userId": "123", "action": "create"}`
- **Wrapped format** – `{"inputs": {...}, "test_run": false}`

Wrapped format kullanıldığında `inputs` çıkarılır ve `body` olarak iletilir. `test_run` rate limiting ve response caching'i atlar. Raw JSON gönderirken `?test_run=true`'yu query parametresi olarak da gönderebilirsiniz.

## Request Body Modes

Her workflow'un, editörün örnek istekleri nasıl oluşturacağını kontrol eden bir `webhook_body_mode` ayarı vardır:

| Mode | Behavior |
|------|----------|
| **defined** | Editör ve cURL dialog'u örnek body'yi workflow'un Input node alanlarından şekillendirir ve JSON payload'ında boş anahtarları korur. Mevcut defined tarzı cURL payload'ları çalışmaya devam eder. |
| **generic** | Editör ve cURL dialog'u serbest biçimli bir JSON body kullanır. Request body olduğu gibi iletilir, böylece harici uygulamalar kendi sabit payload şekillerini gönderebilir. |

Execution API her iki modda da geriye dönük uyumlu kalır. Raw JSON ve wrapped `{ "inputs": ... }` istekleri her iki durumda da kabul edilir.

Header'lar ve query param'ları ifadelerde `$input.headers` ve `$input.query` olarak kullanılabilir. Header anahtarları küçük harfe çevrilir.

## Authentication

Editörde workflow başına yapılandırılır (workflow settings). Auth, execution'dan önce kontrol edilir.

| auth_type | Behavior |
|-----------|----------|
| **anonymous** | Auth gerekmez. Endpoint'i herkes çağırabilir. |
| **jwt** | Bearer token gerekir. Ya bir kullanıcı session token'ı (kullanıcının workflow erişimi olmalıdır) ya da bu workflow için oluşturulmuş kapsamlı bir [Execution Token](./execution-tokens.md) kabul eder. |
| **header_auth** | Özel header eşleşmelidir. `auth_header_key` (örn. `X-API-Key`) ve `auth_header_value` ayarlayın. |

`header_auth` için request header değeri yapılandırılmış değerle tam olarak eşleşmelidir. Workflow erişimi olan JWT kullanıcıları özel header olmadan da çağırabilir.

`jwt` için, [Execution Tokens](./execution-tokens.md) workflow'ları harici sistemlerden çağırmanın önerilen yoludur — tek bir workflow'a kapsamlandırılırlar ve bağımsız olarak iptal edilebilirler.

## Response Caching

Workflow başına `cache_ttl_seconds` yapılandırın. Ayarlandığında ve 0'dan büyük olduğunda:

- **Cache key**: `workflow_id` + `body` + `query`'nin SHA256 hash'i
- **Cache hit**: Hemen `status: "cached"` ve cache'lenmiş output'larla döner
- **Cache set**: Yalnızca başarılı bir execution'dan sonra (`status: "success"`)
- **Storage**: Postgres destekli ve backend worker'lar arasında paylaşılır

| Setting | Effect |
|---------|--------|
| `cache_ttl_seconds` = 0 veya null | Caching devre dışı |
| `cache_ttl_seconds` > 0 | Yanıtlar bu kadar saniye boyunca cache'lenir |

`test_run` istekleri cache'i atlar (okuma yok, yazma yok).

cURL dialog'unda response caching etkinleştirildiğinde, **Clear cache** mevcut workflow'un cache'lenmiş yanıtlarını hemen temizler.

## Rate Limiting

Workflow başına yapılandırın: `rate_limit_requests` ve `rate_limit_window_seconds`.

- **Scope**: `workflow_id` + client IP başına (sliding window)
- **Aşıldığında**: `Retry-After` header'ı ile HTTP 429
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Setting | Description |
|---------|-------------|
| `rate_limit_requests` | Window içinde izin verilen maksimum istek sayısı |
| `rate_limit_window_seconds` | Saniye cinsinden window süresi |

`test_run` istekleri rate limiting'i atlar.

## Yanıt Formatı

Endpoint JSON döndürür:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Alan | Açıklama |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`, `error`, `cached` veya `rate_limited` |
| `outputs` | Terminal node çıktıları. Tek terminal olarak yalnızca bir [JSON output mapper](../nodes/json-output-mapper-node.md) varsa, yanıt gövdesi en üst düzeyde eşlenen nesnedir (varsayılan basit JSON yanıtları). Aksi takdirde etikete göre anahtarlanmış [Output](../nodes/output-node.md) ve diğer terminalleri içerir. |
| `execution_time_ms` | Milisaniye cinsinden yürütme süresi (cached/rate_limited için 0) |

Hata durumunda `outputs` hata ayrıntılarını içerebilir. Bir [Throw Error](../nodes/throw-error-node.md) node'u özel bir HTTP durum kodu (4xx/5xx) ayarlayabilir.

## cURL ile Çalıştır Dialogu

**Run with cURL** araç çubuğu düğmesi (düzenleyicinin sağ üst köşesinde, `cURL` simgesi), geçerli workflow için çalıştırılmaya hazır bir cURL komutu oluşturan ve kopyalayan bir dialog açar.

### Ne Yapar

| Alan | Açıklama |
|-------|-------------|
| **Request Body Mode** | **Defined** veya **Generic** seçin. Generic, gövdeyi Input alanlarından şekillendirmek yerine ham JSON olarak tutar. |
| **Authentication** | Anonymous, JWT Token veya Header Auth seçin. Komutta doğru auth başlığını ayarlar. JWT Token seçildiğinde, dialog bir [Execution Token](./execution-tokens.md) yöneticisi gösterir — komuta doğrudan gömmek için bir token oluşturun veya seçin. |
| **Header Key / Value** | Header Auth seçildiğinde görünür. Workflow'un auth ayarlarından önceden doldurulur. |
| **Response Cache** | Aynı yanıtları önbelleğe alma süresi (dakika) (0 = devre dışı). Değişiklikler workflow'a kaydedilir. Etkinleştirildiğinde, **Clear cache** önbelleğe alınmış yanıtları hemen temizler. |
| **Rate Limit** | Zaman penceresi başına maksimum istek sayısı. Değişiklikler workflow'a kaydedilir. |
| **SSE Streaming** | Komutu `/execute/stream` olarak değiştirir, `--no-buffer` ekler ve node başına `node_start` mesaj ayarlarını sunar. |
| **Body** | JSON istek gövdesi. Defined modunda [Input](../nodes/input-node.md) alanlarından önceden doldurulur ve boş anahtarları korur. Generic modunda ham bir JSON düzenleyicisidir. |
| **Command** | Tam cURL komutunun salt okunur önizlemesi. |

Komutu panoya kopyalamak için **Copy cURL** düğmesine tıklayın.

### Örnek

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic modunda, iç içe payload'lar bozulmadan kalır, örneğin:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialog, workflow'da saklanan kimlik doğrulama, gövde modu, önbelleğe alma ve rate-limit ayarlarını yansıtır — burada düzenlemek workflow'u hemen günceller.

### Dialogda SSE Streaming

Oluşturulan komutun terminalinizden yürütmeyi gerçek zamanlı olarak takip etmesini istediğinizde **SSE Streaming**'i etkinleştirin.

- Endpoint `/execute` yerine `/execute/stream` olur
- Komut `--no-buffer` ve `Accept: text/event-stream` ekler
- Her sticky olmayan node, şunları yapabileceğiniz bir listede görünür:
  - `node_start` mesajını etkinleştirin veya devre dışı bırakın
  - başlangıç mesajı metnini özelleştirin
- `node_complete` olayları her zaman yayınlanır ve tam node çıktısını içerir

Örnek:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Tam olay protokolü ve örnekler için [SSE Streaming](./sse-streaming.md) bölümüne bakın.

## Trigger Source Etiketleme

Her yürütme, [Execution History](./execution-history.md) içinde görünen bir `trigger_source` etiketi saklar. Bunu, seçtiğiniz herhangi bir değerle `X-Trigger-Source` başlığını göndererek ayarlayın:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Düzenleyici dialogundaki **Copy cURL** düğmesi otomatik olarak `X-Trigger-Source: API` içerir. `API` değerini anlamlı herhangi bir şeyle değiştirebilirsiniz — `scheduler`, `rabbitmq`, `github-actions` vb.

Başlık gönderilmezse, `trigger_source` varsayılan olarak `"API"` olur ve çalıştırma geçmişte **API** olarak etiketlenir. Bunu sisteminiz için anlamlı herhangi bir değerle geçersiz kılın — `scheduler`, `github-actions`, `rabbitmq` vb.

## İlgili

- [Execution Tokens](./execution-tokens.md) – Workflow'ları harici sistemlerden çağırmak için kapsamlı JWT'ler
- [SSE Streaming](./sse-streaming.md) – Server-Sent Events aracılığıyla node olaylarını gerçek zamanlı olarak akışa alın
- [Triggers](./triggers.md) – Webhook dahil tüm workflow giriş noktaları
- [Workflow Structure](./workflow-structure.md) – Node'lar ve kenarlar
- [Expression DSL](./expression-dsl.md) – `$input.body`, `$input.headers`, `$input.query` erişimi
