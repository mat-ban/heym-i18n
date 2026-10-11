# BigQuery

**BigQuery** düğümü, BigQuery REST API v2 aracılığıyla SQL sorguları çalıştırır ve Google BigQuery veri kümelerine satır ekler. Büyük analitik veri kümelerini sorgulamak veya workflow verilerinden tablolara satır akışı yapmak için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Credential | BigQuery (OAuth2) |
| Çıkış | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden BigQuery credential |
| `bqOperation` | string | İşlem: `query` veya `insertRows` |
| `bqProjectId` | expression | Google Cloud proje ID'si (örn. `my-gcp-project`) |
| `bqQuery` | expression | SQL sorgu dizesi. `query` için gereklidir. |
| `bqMaxResults` | string | `query` tarafından döndürülen maksimum satır sayısı (varsayılan `1000`). |
| `bqDatasetId` | expression | Veri kümesi ID'si (örn. `my_dataset`). `insertRows` için gereklidir. |
| `bqTableId` | expression | Tablo ID'si (örn. `my_table`). `insertRows` için gereklidir. |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows` için: **Raw** = tam JSON dizisi; **Selective** = anahtar-değer alan çiftleri olarak tek satır. |
| `bqRows` | expression | Raw modu için satır nesnelerinden oluşan JSON dizisi (örn. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Selective modu için anahtar-değer çiftleri. Her anahtar bir sütun adıdır; her değer bir expression'dır. |

## Credential Kurulumu

BigQuery, **OAuth2 "Bring Your Own App"** modelini kullanır. Kendi Google Cloud OAuth2 credential'larınızı sağlarsınız.

**Backend yapılandırması:** Heym backend'inde **`FRONTEND_URL`** değerini uygulamanın genel URL'sine (kullanıcıların tarayıcıya yazdığı adres) ayarlayın, örn. `https://your-heym-domain`. OAuth yönlendirme URI'si her zaman `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` şeklindedir.

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → **BigQuery API**'yi etkinleştirin.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application** seçeneğine gidin.
3. **Authorized redirect URIs** altında tam olarak şunu ekleyin: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. **Client ID** ve **Client Secret** değerlerini kopyalayın.
5. Heym Dashboard → **Credentials** → **New** → **BigQuery (OAuth2)** seçeneğini seçin.
6. Client ID, Client Secret ve bir ad girin, ardından tarayıcı açılır penceresinde OAuth2 onayını tamamlamak için **Connect**'e tıklayın.

Token'lar arka planda otomatik olarak yenilenir — manuel token yönetimi gerekmez.

## İşlemler

| İşlem | Gerekli Alanlar | Açıklama |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Bir SQL sorgusu çalıştırır ve satırları döndürür |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows veya bqMappings | streaming insertAll API'si aracılığıyla bir veya daha fazla satır ekler |

## Çıkış Referansı

| İşlem | Çıkış alanı | Tür | Açıklama |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Satır nesnelerinden oluşan dizi (sütun adı → değer) |
| `query` | `.total` | number | Döndürülen satır sayısı |
| `query` | `.schema` | array | Tablo şeması alanları |
| `insertRows` | `.insertedCount` | number | Başarıyla eklenen satır sayısı |
| `insertRows` | `.errors` | array | Satır başına ekleme hataları (tam başarı durumunda boş) |

## Örnek – Sorgu Çalıştırma

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Çıkışa erişim: `$getUsers.rows` (satır nesnelerinden oluşan dizi), `$getUsers.rows[0].email`, `$getUsers.total`.

## Örnek – Satır Ekleme

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials Tab](../tabs/credentials-tab.md) – BigQuery OAuth2 credential ekleme
- [Google Sheets](./google-sheets-node.md) – Elektronik tablo verileri için benzer OAuth2 deseni
- [Third-Party Integrations](../reference/integrations.md) – Entegrasyon credential kurulumu
