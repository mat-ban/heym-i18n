# ClickHouse

**ClickHouse** düğümü, harici bir [ClickHouse](https://clickhouse.com/) veritabanına HTTP arayüzü üzerinden CRUD, sayma ve ham SQL işlemleri gerçekleştirir. Bir workflow'dan ClickHouse tablosuna olay yazmak, analitik verileri okumak veya toplamak ya da rastgele SQL çalıştırmak için kullanın — HTTP isteklerini elle yazmanıza gerek kalmaz.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Credential | ClickHouse |
| Çıkış | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden ClickHouse credential'ı |
| `clickhouseOperation` | string | İşlem: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` veya `upsert` |
| `clickhouseTable` | expression | Basit tablo adı. `query` dışındaki her işlem için gereklidir. |
| `clickhouseQuery` | expression | `query` için ham SQL. `SELECT`/`SHOW`/`DESCRIBE` satır döndürür; diğer ifadeler komut olarak çalıştırılır. |
| `clickhouseFilter` | expression | Eşitlik filtrelerinden oluşan JSON nesnesi, örn. `{"status":"active"}`. `find`, `count`, `update` ve `remove` tarafından kullanılır. Değerler parametrelendirilir. |
| `clickhouseLimit` | string | `find` / `getAll` için maksimum satır sayısı (`0` = sınırsız, LIMIT yan tümcesi yok). Varsayılan `100`. |
| `clickhouseSort` | expression | `find` için isteğe bağlı `column` veya `column ASC\|DESC` |
| `clickhouseRowId` | expression | `getById` için tablonun `id` sütunuyla eşleştirilen değer |
| `clickhouseInputMode` | string | `insert`/`upsert` için: `raw` JSON dizisi modu veya `selective` anahtar/değer alan modu |
| `clickhouseData` | expression | `insert`/`upsert` için satır nesnelerinden oluşan JSON dizisi veya `update` için sütun değerlerinden oluşan JSON nesnesi |
| `clickhouseMappings` | array | `clickhouseInputMode` değeri `selective` olduğunda kullanılan `{key, value}` çiftleri |

## Credential Kurulumu

[Credentials sekmesinde](../tabs/credentials-tab.md) aşağıdaki bilgilerle bir **ClickHouse** credential'ı oluşturun:

1. **Host** — şema olmadan HTTP ana bilgisayarı, örneğin `your-instance.clickhouse.cloud`
2. **Port** — HTTP arayüz portu (HTTPS için `8443`, HTTP için `8123`)
3. **Username** / **Password** — varsayılan olarak boş parola ile `default`
4. **Database** — varsayılan olarak `default`
5. **Secure** — HTTPS için etkinleştirin (ClickHouse Cloud)

Düğüm, resmi `clickhouse-connect` HTTP istemcisi üzerinden bağlanır. Kaydetmeden önce erişilebilirliği doğrulamak için credential iletişim kutusundaki **Test connection** seçeneğini kullanın.

## İşlemler

| İşlem | Gerekli Alanlar | Açıklama |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Ham SQL çalıştırır. `SELECT` `{rows, count}` döndürür; diğer ifadeler `{result}` döndürür. |
| `find` | `clickhouseTable` | İsteğe bağlı eşitlik filtreleri, sıralama ve limit ile satırları okur |
| `getAll` | `clickhouseTable` | Filtre olmadan limite kadar satırları okur |
| `count` | `clickhouseTable` | İsteğe bağlı olarak filtrelenmiş satırları sayar |
| `getById` | `clickhouseTable`, `clickhouseRowId` | `id` sütununa göre tek bir satırı okur |
| `insert` | `clickhouseTable`, `clickhouseData` veya mappings | Bir veya daha fazla satır ekler |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | `ALTER TABLE ... UPDATE` aracılığıyla eşleşen satırları günceller |
| `remove` | `clickhouseTable`, `clickhouseFilter` | `DELETE FROM` aracılığıyla eşleşen satırları siler |
| `upsert` | `clickhouseTable`, `clickhouseData` veya mappings | Satırları ekler (`ReplacingMergeTree` tablosu varsayar) |

## Filtre Sözdizimi

`clickhouseFilter`, sütun eşitlik kontrollerinden oluşan düz bir JSON nesnesidir. Değerler bağlı sorgu parametreleri olarak gönderilir, bu nedenle injection'a karşı güvenlidir.

```json
{ "status": "active", "tenant_id": 42 }
```

Bu, `WHERE status = {…:String} AND tenant_id = {…:Int64}` olarak derlenir. Filtre oluşturucuda yalnızca eşitlik desteklenir — aralıklar, join'ler veya toplamalar için ham SQL ile `query` işlemini kullanın.

## Giriş Modları (insert / upsert)

- **JSON dizisi** (`raw`): `clickhouseData` içinde satır nesnelerinden oluşan bir JSON dizisi sağlayın. Belirli bir satırda eksik olan anahtarlar `NULL` olarak eklenir. Sütun kümesi, tüm satırlardaki anahtarların birleşimidir.
- **Anahtar-değer** (`selective`): bir credential ve tablo seçtikten sonra, düzenleyici tablo sütunlarını keşfeder ve her sütun için bir değer alanı oluşturur. Her yürütmede bir satır eklenir; her değer expression'ları destekler.

## Mutasyonlar ve ClickHouse Semantiği

ClickHouse bir OLAP veritabanıdır, bu nedenle satır düzeyindeki yazma işlemleri bir OLTP deposundan farklı davranır:

- **`update`** `ALTER TABLE … UPDATE` ve **`remove`** `DELETE FROM` komutlarını yürütür. Her ikisi de **asenkron mutasyonlardır** — zaman içinde uygulanırlar ve görece maliyetlidirler. Sık tek satırlık mutasyonlar yerine toplu yazma işlemlerini tercih edin.
- **`upsert`** bir `INSERT` gerçekleştirir. Anahtar üzerinde birleştirme davranışı elde etmek için tabloyu bir `ReplacingMergeTree` motoruyla destekleyin.
- **`getById`** tablonun bir `id` sütununa sahip olduğunu varsayar.
- `update` ve `remove`, tam tablo mutasyonlarını önlemek için boş olmayan bir `clickhouseFilter` gerektirir.

## Çıkış Referansı

| Çıkış alanı | Tür | Açıklama |
|-------------|------|-------------|
| `.rows` | array | Döndürülen satır nesneleri (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Satır sayısı (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Tek satır veya `null` (`getById`) |
| `.result` | string | SELECT olmayan `query` için komut özeti |
| `.success` | boolean | İşlemin başarılı olup olmadığı |
## Örnek – Bir Event Ekleme

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Örnek – Aktif Kullanıcıları Sayma

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Çıktıya erişim: `$activeCount.count`.

## Örnek – Günlük Rapor Sorgusu

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Çıktıya erişim: `$dailyReport.rows`, `$dailyReport.count`.

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials Sekmesi](../tabs/credentials-tab.md) – ClickHouse kimlik bilgilerini ekleme
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md) – Entegrasyon kimlik bilgisi kurulumu
