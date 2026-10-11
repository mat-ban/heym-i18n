# Giriş

**Input** düğümü, kullanıcıdan veya API çağırıcısından veri alan iş akışları için giriş noktasıdır. Tek veya birden fazla giriş alanını destekler ve istek üst verilerini (headers, query params) sunar.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `value` | string | Tek metin girişi için varsayılan değer (isteğe bağlı) |
| `inputFields` | array | Giriş alanı tanımları. Her biri: `{ key, defaultValue? }` |

### Giriş Alanları

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `key` | string | Alan anahtarı (örn. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Sağlanmadığında varsayılan (isteğe bağlı) |

## Giriş Verilerine Erişim

**Body alanları** (her zaman `$nodeLabel.body.fieldKey` kullanın):

- `$userInput.body.text` – metin alanı
- `$userInput.body.imageUrl` – görsel URL'si
- `$userInput.body.userId` – yapılandırıldıysa varsayılan değerle birlikte
- `$userInput.body.event.user.id` – Generic webhook modundan iç içe JSON

**İstek üst verileri** (API aracılığıyla yürütüldüğünde):

- `$userInput.headers` – tüm headers (anahtarlar küçük harf)
- `$userInput.headers.authorization` – belirli header
- `$userInput.query` – query parametreleri
- `$userInput.query.param1` – belirli query parametresi

## Run Panelinde Dosya Girişi

Editördeki **Run** sekmesinde (Defined webhook modu), her giriş alanı sürükle-bırak ve satır içi bir ek denetimini (alanın sağ alt köşesinde) destekler:

- **Metin dosyaları** (`.txt`, `.md`, `.json`, `.csv` ve benzerleri) düz metin olarak okunur.
- **Görseller** (JPEG, PNG, GIF, WebP) alan değerinde bir `data:` URL'si (base64) olarak saklanır — alt düğümler görsel verisi beklediğinde `imageUrl` veya `base64` gibi alan anahtarlarını kullanın.
- **PDF** dosyaları çıkarılan metne dönüştürülür (maksimum 5 MB dosya, 100k karakter içerik).

Her alan için bir dosya. Bir dosya yüklendikten sonra textarea'yı yine de düzenleyebilirsiniz. Generic webhook modu (ham JSON body) alan başına dosya denetimlerini göstermez.

## Giriş Alanları ile Generic Webhook'ların Karşılaştırması

`inputFields`, tanımlı moddaki editör formları, alt iş akışı eşlemesi ve diğer üst veri odaklı yüzeyler için beklenen girişleri tanımlamaya devam eder.

Bir iş akışı **Generic** webhook body modunu kullandığında, gelen HTTP body `inputFields` üzerinden yeniden şekillendirilmez. Bunun yerine, ham JSON payload doğrudan `$nodeLabel.body` içine aktarılır ve Input düğümünün alan ekleme/kaldırma denetimleri düğüm panelinde gizlenir.

## Örnekler

**Tek giriş (varsayılan):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Birden fazla giriş:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Trigger'lar](../reference/triggers.md) – Giriş noktaları (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – `$nodeLabel.body`, `$nodeLabel.query` referansları
- [Portal](../reference/portal.md) – İş akışlarını sohbet arayüzleri olarak sunma
- [Webhook'lar](../reference/webhooks.md) – İş akışları için HTTP trigger
