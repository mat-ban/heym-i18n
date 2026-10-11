# DataTable

Node **DataTable** membaca, menulis, dan mengelola data di Heym DataTables. Gunakan node ini untuk operasi CRUD pada penyimpanan terstruktur pihak pertama tanpa memerlukan credential eksternal.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable dari [tab DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operasi: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID baris (untuk getById, update, remove) |
| `dataTableData` | JSON string | Nilai kolom: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filter (find/upsert/count). `find` dan `count` mendukung operator `{"age": {"$gt": 18}}`; `upsert` menggunakan pencocokan persis `{"column_name": "value"}` |
| `dataTableSort` | string | Kolom pengurutan, awalan `-` untuk urutan menurun |
| `dataTableLimit` | number | Jumlah maksimum baris yang dikembalikan (default: 100) |

## Operasi

| Operasi | Kolom Wajib | Deskripsi |
|-----------|----------------|-------------|
| `find` | dataTableId | Menemukan baris yang cocok dengan filter operator opsional beserta sort/limit opsional |
| `getAll` | dataTableId | Mendapatkan semua baris dengan sort/limit opsional |
| `count` | dataTableId | Menghitung baris yang cocok dengan filter operator opsional (dihitung di database; hanya mengembalikan angka) |
| `getById` | dataTableId, dataTableRowId | Mendapatkan satu baris berdasarkan UUID |
| `insert` | dataTableId, dataTableData | Menyisipkan baris baru |
| `update` | dataTableId, dataTableRowId, dataTableData | Memperbarui baris (menggabungkan data) |
| `remove` | dataTableId, dataTableRowId | Menghapus baris |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Memperbarui jika ditemukan kecocokan, jika tidak maka menyisipkan |

## Contoh - Menemukan Baris

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

## Contoh - Menyisipkan Baris

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

## Contoh - Menghitung Baris

Menghitung baris yang cocok dengan suatu kondisi dalam satu node, alih-alih `getAll` → If/Else → Map.

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

Hasilnya tersedia sebagai `$activeAdults.count`. Filter yang kosong atau dihilangkan akan menghitung setiap baris.

### Operator filter find dan count

Dalam filter `find` atau `count`, nilai biasa berarti sama dengan; nilai objek menerapkan operator:

| Operator | Arti |
|----------|---------|
| `$eq` (atau nilai biasa) | Sama dengan |
| `$ne` | Tidak sama dengan |
| `$gt`, `$gte`, `$lt`, `$lte` | Perbandingan lebih besar/kecil dari (numerik untuk kolom bertipe `number`, jika tidak maka teks) |
| `$contains` | Pencocokan substring tanpa membedakan huruf besar/kecil |
| `$in` | Nilai ada dalam array yang diberikan |

Contoh menggabungkan beberapa: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Operator yang tidak dikenal akan diabaikan. Filter `upsert` tetap menggunakan nilai pencocokan persis untuk menemukan baris yang akan diperbarui.

Anda juga dapat memfilter berdasarkan metadata baris — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — yang disimpan sebagai kolom sesungguhnya, bukan di dalam data Anda. Untuk tanggal, berikan nilai lengkap untuk perbandingan rentang (misalnya `{"created_at": {"$gt": "2026-06-04"}}`) atau gunakan `$contains` untuk pencocokan teks sebagian (misalnya `{"created_at": {"$contains": "2026-06-04"}}`). Jika salah satu kolom Anda memiliki nama yang sama dengan field metadata, kolom data yang diutamakan.

## Akses Output

- `$nodeLabel.success` - Status keberhasilan Boolean
- `$nodeLabel.rows` - Array baris (find, getAll)
- `$nodeLabel.row` - Objek baris tunggal (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Mengakses nilai kolom tertentu
- `$nodeLabel.count` - Jumlah baris (baris yang dikembalikan untuk find/getAll; total baris yang cocok untuk count)
- `$nodeLabel.id` - UUID baris (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Nama operasi (misalnya `count`; `insert`/`update` untuk upsert)

## Tidak Memerlukan Credential

Berbeda dengan integrasi eksternal, DataTable beroperasi pada database internal Heym. Izin akses pemilik workflow diperiksa secara otomatis.

## Dibuat oleh AI Assistant

Ketika [AI Assistant](../reference/ai-assistant.md#data-tables) atau [Chat](../tabs/chat-tab.md) membuat node ini, ia memilih atau membuat tabel bersama Anda dan menuliskan nama kolom tabel yang tepat ke dalam `dataTableData` dan `dataTableFilter`.

## Terkait

- [Tab DataTable](../tabs/datatable-tab.md) - Membuat dan mengelola tabel
- [Node Grist](./grist-node.md) - Integrasi spreadsheet eksternal
- [Expression DSL](../reference/expression-dsl.md) - Sintaks expression untuk nilai dinamis
