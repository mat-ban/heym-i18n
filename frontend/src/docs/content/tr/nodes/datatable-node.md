# DataTable

**DataTable** düğümü, Heym DataTable'larındaki verileri okur, yazar ve yönetir. Harici kimlik bilgileri olmadan birinci taraf yapılandırılmış depolama üzerinde CRUD işlemleri için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `dataTableId` | UUID | [DataTable sekmesinden](../tabs/datatable-tab.md) DataTable |
| `dataTableOperation` | string | İşlem: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Satır UUID'si (getById, update, remove için) |
| `dataTableData` | JSON string | Sütun değerleri: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtre (find/upsert/count). `find` ve `count`, `{"age": {"$gt": 18}}` operatörlerini destekler; `upsert` tam eşleşme `{"column_name": "value"}` kullanır |
| `dataTableSort` | string | Sıralama sütunu, azalan sıralama için `-` öneki |
| `dataTableLimit` | number | Döndürülen maksimum satır sayısı (varsayılan: 100) |

## İşlemler

| İşlem | Gerekli Alanlar | Açıklama |
|-----------|----------------|-------------|
| `find` | dataTableId | İsteğe bağlı operatör filtresiyle eşleşen satırları, isteğe bağlı sıralama/limit ile bulur |
| `getAll` | dataTableId | Tüm satırları isteğe bağlı sıralama/limit ile alır |
| `count` | dataTableId | İsteğe bağlı operatör filtresiyle eşleşen satırları sayar (veritabanında sayılır; yalnızca bir sayı döndürür) |
| `getById` | dataTableId, dataTableRowId | UUID ile tek bir satır alır |
| `insert` | dataTableId, dataTableData | Yeni bir satır ekler |
| `update` | dataTableId, dataTableRowId, dataTableData | Satırı günceller (verileri birleştirir) |
| `remove` | dataTableId, dataTableRowId | Bir satırı siler |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Eşleşme bulunursa günceller, aksi halde ekler |

## Örnek - Satır Bulma

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Örnek - Satır Ekleme

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Örnek - Satır Sayma

`getAll` → If/Else → Map yerine, tek bir düğümde koşulla eşleşen satırları sayın.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Sonuç `$activeAdults.count` olarak kullanılabilir. Boş veya atlanmış bir filtre tüm satırları sayar.

### Find ve count filtre operatörleri

Bir `find` veya `count` filtresinde, düz bir değer eşittir anlamına gelir; bir nesne değeri bir operatör uygular:

| Operatör | Anlam |
|----------|---------|
| `$eq` (veya düz bir değer) | Eşittir |
| `$ne` | Eşit değildir |
| `$gt`, `$gte`, `$lt`, `$lte` | Büyüktür/küçüktür karşılaştırmaları (`number` olarak tiplendirilmiş sütunlar için sayısal, aksi halde metin) |
| `$contains` | Büyük/küçük harf duyarsız alt dize eşleşmesi |
| `$in` | Değer verilen dizide bulunur |

Birkaçını birleştiren örnek: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Bilinmeyen operatörler yok sayılır. `upsert` filtreleri, güncellenecek satırı bulmak için hâlâ tam eşleşme değerlerini kullanır.

Ayrıca satır meta verileri üzerinde de filtreleme yapabilirsiniz — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — bunlar verilerinizin içinde değil, gerçek sütunlar olarak saklanır. Tarihler için, aralık karşılaştırmaları için tam bir değer iletin (örn. `{"created_at": {"$gt": "2026-06-04"}}`) veya kısmi metin eşleşmesi için `$contains` kullanın (örn. `{"created_at": {"$contains": "2026-06-04"}}`). Kendi sütunlarınızdan biri bir meta veri alanıyla aynı ada sahipse, veri sütunu öncelik kazanır.

## Çıkış Erişimi

- `$nodeLabel.success` - Boolean başarı durumu
- `$nodeLabel.rows` - Satır dizisi (find, getAll)
- `$nodeLabel.row` - Tek satır nesnesi (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Belirli sütun değerine erişim
- `$nodeLabel.count` - Satır sayısı (find/getAll için döndürülen satırlar; count için eşleşen satır toplamı)
- `$nodeLabel.id` - Satır UUID'si (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - İşlem adı (örn. `count`; upsert için `insert`/`update`)

## Kimlik Bilgisi Gerekmez

Harici entegrasyonların aksine, DataTable Heym'in dahili veritabanı üzerinde çalışır. Workflow sahibinin erişim izinleri otomatik olarak kontrol edilir.

## AI Assistant Tarafından Oluşturulur

[AI Assistant](../reference/ai-assistant.md#data-tables) veya [Chat](../tabs/chat-tab.md) bu düğümü oluşturduğunda, tabloyu sizinle birlikte seçer veya oluşturur ve tablonun tam sütun adlarını `dataTableData` ve `dataTableFilter` içine yazar.

## İlgili

- [DataTable Sekmesi](../tabs/datatable-tab.md) - Tabloları oluşturun ve yönetin
- [Grist Düğümü](./grist-node.md) - Harici elektronik tablo entegrasyonu
- [Expression DSL](../reference/expression-dsl.md) - Dinamik değerler için expression sözdizimi
