# Supabase

**Supabase** düğümü, bir Supabase projesinin PostgREST API'si tarafından sunulan tabloları okur ve değiştirir. SQL tabanlı uygulama durumuna, HTTP isteklerini elle yazmadan workflow erişimi sağlamak istediğinizde kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Credential | Supabase |
| Çıkış | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden Supabase credential |
| `supabaseOperation` | string | İşlem: `select`, `insert`, `update`, `upsert` veya `delete` |
| `supabaseSchema` | expression | Şema adı. Boş bırakılırsa düğüm, credential'ın varsayılan şemasını, ardından `public` şemasını kullanır. |
| `supabaseTable` | expression | Sorgulanacak veya değiştirilecek basit tablo adı. Şemayı buraya değil, `supabaseSchema` alanına yazın. |
| `supabaseSelectColumns` | expression | `select` için virgülle ayrılmış PostgREST select listesi (varsayılan `*`) |
| `supabaseFilter` | expression | JSON filtre nesnesi. Tam eşleşmelerin yanı sıra operatör nesnelerini ve mantıksal grupları destekler; örn. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` veya `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | `select` için döndürülecek maksimum satır sayısı (`0` = sunucu tarafı sayfalama ile eşleşen tüm satırları getirir, negatif değerler `100` değerine geri döner) |
| `supabaseOrderBy` | expression | `select` için isteğe bağlı sıralama sütunu |
| `supabaseAscending` | boolean | `true` olduğunda artan, `false` olduğunda azalan sıralama |
| `supabaseRowsInputMode` | string | `insert`/`upsert` için: `raw` JSON dizisi modu veya tek bir üst akış girişini otomatik eşlemek için `auto` |
| `supabaseDataInputMode` | string | `update` için: `raw` JSON nesnesi modu veya tek bir üst akış girişini otomatik eşlemek için `auto` |
| `supabaseIgnoredInputFields` | string | Giriş verileri otomatik eşlenirken atlanacak isteğe bağlı virgülle ayrılmış alan adları |
| `supabaseRows` | expression | `insert` ve `upsert` için satır nesnelerinden oluşan JSON dizisi |
| `supabaseOnConflict` | expression | `upsert` için isteğe bağlı virgülle ayrılmış çakışma hedefi sütunları; örneğin `id` veya `tenant_id,email` |
| `supabaseData` | expression | `update` için güncellenen sütun değerlerinden oluşan JSON nesnesi |

## Credential Kurulumu

[Credentials sekmesinde](../tabs/credentials-tab.md) bir **Supabase** credential'ı oluşturun:

1. **Project URL**'nizi, örneğin `https://your-project.supabase.co`
2. Bu workflow'un kullanması gereken tablolara erişimi olan bir **API key**
3. İsteğe bağlı bir **varsayılan şema** (varsayılan olarak `public`)

Düğüm, `/rest/v1/<table>` adresindeki Supabase PostgREST endpoint'i ile iletişim kurar.
`supabaseTable` için yalnızca tabloyu kullanın; örneğin `users` veya `profiles`. Buraya `schema.table`, `rpc/...` veya başka API yolları yazmayın.

Geçerli bir Supabase credential'ı seçildiğinde, editör sunulan tabloları ve tablo sütunlarını doğrudan PostgREST OpenAPI meta verilerinden keşfedebilir. Bir tablo seçmek için **keşfedilen tablolar** açılır menüsünü ve hızlıca bir select listesi oluşturmak için **Select Columns** altındaki **sütun çiplerini** kullanın.

## İşlemler

| İşlem | Gerekli Alanlar | Açıklama |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | İsteğe bağlı tam eşleşme filtreleri, limit ve sıralama ile satırları okuyun |
| `insert` | `supabaseTable`, `supabaseRows` veya girişi otomatik eşleme | Bir veya daha fazla satır ekleyin |
| `update` | `supabaseTable`, `supabaseData` veya girişi otomatik eşleme, `supabaseFilter` | Filtreyle eşleşen satırları güncelleyin |
| `upsert` | `supabaseTable`, `supabaseRows` veya girişi otomatik eşleme | Supabase upsert semantiğini kullanarak satırları ekleyin veya birleştirin. Açık bir çakışma hedefi belirtmeniz gerektiğinde `supabaseOnConflict` kullanın. |
| `delete` | `supabaseTable`, `supabaseFilter` | Filtreyle eşleşen satırları silin |

## Filtre Sözdizimi

`supabaseFilter`, yapılandırılmış JSON'u PostgREST sorgu parametrelerine derler.

- Tam eşleşme: `{"status":"active"}`
- Karşılaştırma: `{"created_at":{"gte":"2026-01-01"}}`
- Üyelik: `{"status":{"in":["active","paused"]}}`
- Desen eşleşmesi: `{"email":{"ilike":"*@example.com"}}`
- Mantıksal OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Mantıksal AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Aynı alan üzerinde birden fazla operatör için mantıksal bir grup tercih edin:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Sayfalama

`select` artık PostgREST'e karşı gerçek sunucu tarafı sayfalama gerçekleştirir.

- `supabaseLimit: "0"` eşleşen tüm satırları sayfa sayfa getirir
- 1000'in üzerindeki `supabaseLimit` değerleri otomatik olarak birden fazla isteğe dağılır
- Sonuçlar tek bir `.rows` dizisinde birleştirilir ve `.count` eşleşen toplam satır sayısı olarak kalır

Büyük tabloları okurken, sayfa sınırlarını öngörülebilir tutmak için sabit bir `supabaseOrderBy` ayarlayın.

## Girişi Otomatik Eşleme

`insert`, `upsert` ve `update` için, tek bir üst akış düğümü zaten yazmak istediğiniz şekli çıktı olarak veriyorsa düğümü **Auto-map input** moduna geçirin.

- Tek bir nesne, bir satır veya bir update payload'ı haline gelir
- Nesnelerden oluşan bir dizi, `insert` / `upsert` için birçok satır haline gelir
- `rows` dizisi içeren bir üst akış nesnesi, o diziyi doğrudan yeniden kullanır
- `supabaseIgnoredInputFields`, `id`, `created_at` veya `success` gibi alanları atlamanıza olanak tanır
## Çıktı Referansı

| Çıktı alanı | Tür | Açıklama |
|-------------|------|-------------|
| `.rows` | array | Döndürülen satır nesneleri |
| `.count` | number | Döndürülen veya etkilenen satır sayısı |
| `.success` | boolean | İşlemin başarılı olup olmadığı |

## Örnek – Aktif Kullanıcıları Seçme

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Çıktıya erişim: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Örnek – Bir Profil Satırını Upsert Etme

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials Sekmesi](../tabs/credentials-tab.md) – Supabase credentials ekleme
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md) – Entegrasyon credential kurulumu
