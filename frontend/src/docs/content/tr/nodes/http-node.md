# HTTP

**HTTP** düğümü, cURL sözdizimini kullanarak HTTP istekleri gerçekleştirir. Bir workflow başlangıç noktası olabilir (gelen kenar yok) veya yukarı akış düğümlerinden girdi alabilir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girdiler | 0 veya 1 |
| Çıktılar | 1 |
| Çıktı | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `curl` | string | cURL komutu (örn. `curl -X GET https://api.example.com`) |

## Yanıt Formatı

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Yanıta Erişim

- `$httpNode.status` – HTTP durum kodu
- `$httpNode.body` – Yanıt gövdesi (string veya ayrıştırılmış JSON)
- `$httpNode.body.fieldName` – JSON alanlarına erişim
- `$httpNode.headers` – Yanıt başlıkları

## Örnek

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Başlıklar için `-H`, POST gövdesi için `-d` vb. ile cURL sözdizimini kullanın. İfadeler curl string'inin herhangi bir yerinde kullanılabilir; URL, bir başlık veya tam bir başlık satırı dahil. Bir [Header credential](../reference/credentials.md) `key: value` biçimine çözümlenir, böylece `-H "$credentials.MyApiKey"` tam başlığı gönderir:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Bir ifade içindeki tırnak işaretleri ve boşluklar cURL komutuna değil, ifadeye aittir; bu nedenle string argüman alan metotlar satır içinde çalışır:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Credential ile Kimlik Doğrulama

`$credentials.Name`, her [credential](../reference/credentials.md) türü için farklı bir değere çözümlenir; bu nedenle başlık satırı türe bağlıdır:

| Credential türü | `$credentials.Name` şuna çözümlenir | Başlık |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Ham API anahtarı | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Ham API anahtarı | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Ham API anahtarı | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Süresi dolduğunda yenilenen taze bir OAuth access token | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Bir Bearer credential zaten `Bearer ` önekini taşır; bu nedenle bir tane daha eklemek `Bearer Bearer …` gönderir. Google Sheets ve Google Drive credential'ları, credential'ın verildiği kapsamlar dahilinde, düğümünün kapsamadığı Google API'lerini çağırmanıza olanak tanır; örneğin bir spreadsheet'e sekme ekleme. Bir ad düz bir tanımlayıcı olmadığında (`-` içerdiğinde, bir rakamla başladığında veya ayrılmış bir sözcük olduğunda), köşeli parantez biçimini kullanın: `-H "Authorization: $credentials["my-api-key"]"`.

[AI Assistant](../reference/ai-assistant.md) veya [Chat](../tabs/chat-tab.md), kimlik doğrulama gerektiren ve hizmeti kapsayan özel bir düğümün bulunmadığı bir HTTP isteği oluşturduğunda, hangi credential'ın kullanılacağını sorar. Birini seçin, API farklı bir ad bekliyorsa önceden doldurulmuş başlık adını değiştirin; başlık satırını sizin için yazar. Asistan credential adlarını ve türlerini görür, değerlerini asla görmez. Uygun bir credential'ınız yoksa, soru bir tane oluşturmayı önerir. Gönderilen `request.headers` gibi düğümün çıktısına ulaşan gizli bilgiler, çalıştırma sonuçlarında maskelenir.

## Çıkış Güvenliği

- Varsayılan olarak URL, `http://` veya `https://` kullanmalı ve yalnızca genel adreslere çözümlenmelidir. Loopback, private, link-local, multicast ve cloud-metadata hedefleri engellenir.
- Heym, çözümlenen adresleri doğrular ve DNS rebinding'i önlemek için bağlantı hedefini sabitler. Koruma etkinken ortam proxy'leri devre dışı bırakılır. Yönlendirmeler varsayılan olarak izlenmez; bunları izlemek için cURL'ün `-L` seçeneğini ekleyin. Etkinleştirildiğinde, her yönlendirme adımı aynı genel adres politikasına göre denetlenir ve bağlanmadan önce sabitlenir.
- Dahili hizmetlere kasıtlı olarak bağlanan güvenilir self-hosted dağıtımlar `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ayarını yapabilir. Barındırılan veya çok kiracılı dağıtımlarda varsayılanı koruyun.

**v0.0.105 için yükseltme notu:** bu örnek genelinde geçerli politika artık Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, özel LLM yürütme ve model keşfi, AI assistant, guardrails ve RAG embeddings tarafından kullanılan credential kaynaklı hedefleri de korur. Loopback, private veya link-local adreslere işaret eden mevcut credential'lar, güvenilir bir self-hosted örnekte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` etkinleştirilmediği sürece reddedilir. Koruma açıkken, korunan HTTP istemcileri `HTTP_PROXY` ve `HTTPS_PROXY` değişkenlerini yok sayar; devre dışı bırakma seçeneğinin etkinleştirilmesi bunları geri getirir. `SSL_CERT_FILE` veya `SSL_CERT_DIR` aracılığıyla yapılandırılan operatör CA paketleri desteklenmeye devam eder. ClickHouse, bağlantı açılmadan önce denetlenir ancak dial anında sabitlenmez; çünkü clickhouse-connect kendi urllib3 taşıma katmanını getirir.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Triggers](../reference/triggers.md) – Workflow giriş noktası olarak HTTP
- [Credentials Tab](../tabs/credentials-tab.md) – Kimlik doğrulamalı istekler için API anahtarları ekleme
