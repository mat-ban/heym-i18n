# ClickHouse

Node **ClickHouse** menjalankan operasi CRUD, count, dan SQL mentah terhadap database [ClickHouse](https://clickhouse.com/) eksternal melalui antarmuka HTTP-nya. Gunakan node ini untuk menulis event ke dalam tabel ClickHouse dari sebuah workflow, membaca atau mengagregasi data analitik, atau menjalankan SQL arbitrer — tanpa perlu menulis permintaan HTTP secara manual.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | ClickHouse |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Credential ClickHouse dari [Credentials](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operasi: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, atau `upsert` |
| `clickhouseTable` | expression | Nama tabel sederhana. Wajib untuk setiap operasi kecuali `query`. |
| `clickhouseQuery` | expression | SQL mentah untuk `query`. `SELECT`/`SHOW`/`DESCRIBE` mengembalikan baris; pernyataan lain dijalankan sebagai perintah. |
| `clickhouseFilter` | expression | Objek JSON berisi filter kesetaraan, misalnya `{"status":"active"}`. Digunakan oleh `find`, `count`, `update`, dan `remove`. Nilai diparameterisasi. |
| `clickhouseLimit` | string | Jumlah baris maksimum untuk `find` / `getAll` (`0` = tanpa batas, tanpa klausa LIMIT). Default `100`. |
| `clickhouseSort` | expression | Opsional `column` atau `column ASC\|DESC` untuk `find` |
| `clickhouseRowId` | expression | Nilai yang dicocokkan dengan kolom `id` tabel untuk `getById` |
| `clickhouseInputMode` | string | Untuk `insert`/`upsert`: mode array JSON `raw` atau mode field key/value `selective` |
| `clickhouseData` | expression | Array JSON berisi objek baris untuk `insert`/`upsert`, atau objek JSON berisi nilai kolom untuk `update` |
| `clickhouseMappings` | array | Pasangan `{key, value}` yang digunakan ketika `clickhouseInputMode` bernilai `selective` |

## Penyiapan Credential

Buat credential **ClickHouse** di [tab Credentials](../tabs/credentials-tab.md) dengan:

1. **Host** — host HTTP tanpa skema, misalnya `your-instance.clickhouse.cloud`
2. **Port** — port antarmuka HTTP (`8443` untuk HTTPS, `8123` untuk HTTP)
3. **Username** / **Password** — default `default` dengan password kosong
4. **Database** — default `default`
5. **Secure** — aktifkan untuk HTTPS (ClickHouse Cloud)

Node terhubung melalui klien HTTP resmi `clickhouse-connect`. Gunakan **Test connection** pada dialog credential untuk memverifikasi keterjangkauan sebelum menyimpan.

## Operasi

| Operasi | Field Wajib | Deskripsi |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Menjalankan SQL mentah. `SELECT` mengembalikan `{rows, count}`; pernyataan lain mengembalikan `{result}`. |
| `find` | `clickhouseTable` | Membaca baris dengan filter kesetaraan, pengurutan, dan limit opsional |
| `getAll` | `clickhouseTable` | Membaca baris hingga batas limit tanpa filter |
| `count` | `clickhouseTable` | Menghitung baris, dengan filter opsional |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Membaca satu baris berdasarkan kolom `id`-nya |
| `insert` | `clickhouseTable`, `clickhouseData` atau mappings | Menyisipkan satu atau lebih baris |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Memperbarui baris yang cocok melalui `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Menghapus baris yang cocok melalui `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` atau mappings | Menyisipkan baris (mengasumsikan tabel `ReplacingMergeTree`) |

## Sintaks Filter

`clickhouseFilter` adalah objek JSON datar berisi pemeriksaan kesetaraan kolom. Nilai dikirim sebagai parameter query terikat, sehingga aman terhadap injeksi.

```json
{ "status": "active", "tenant_id": 42 }
```

Ini dikompilasi menjadi `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Hanya kesetaraan yang didukung pada pembuat filter — untuk rentang, join, atau agregasi, gunakan operasi `query` dengan SQL mentah.

## Mode Input (insert / upsert)

- **Array JSON** (`raw`): sediakan array JSON berisi objek baris pada `clickhouseData`. Key yang tidak ada pada baris tertentu akan disisipkan sebagai `NULL`. Himpunan kolom adalah gabungan key dari seluruh baris.
- **Key-value** (`selective`): setelah Anda memilih credential dan tabel, editor akan menemukan kolom tabel dan membuat satu field nilai per kolom. Satu baris disisipkan per eksekusi; setiap nilai mendukung expression.

## Mutasi dan Semantik ClickHouse

ClickHouse adalah database OLAP, sehingga penulisan tingkat baris berperilaku berbeda dari penyimpanan OLTP:

- **`update`** menjalankan `ALTER TABLE … UPDATE` dan **`remove`** menjalankan `DELETE FROM`. Keduanya merupakan **mutasi asinkron** — diterapkan secara bertahap dan relatif mahal. Utamakan penulisan secara batch daripada mutasi baris tunggal yang sering.
- **`upsert`** melakukan `INSERT`. Untuk mendapatkan perilaku merge-on-key, gunakan tabel dengan engine `ReplacingMergeTree`.
- **`getById`** mengasumsikan tabel memiliki kolom `id`.
- `update` dan `remove` memerlukan `clickhouseFilter` yang tidak kosong untuk menghindari mutasi seluruh tabel.

## Referensi Output

| Field output | Tipe | Deskripsi |
|-------------|------|-------------|
| `.rows` | array | Objek baris yang dikembalikan (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Jumlah baris (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Baris tunggal atau `null` (`getById`) |
| `.result` | string | Ringkasan perintah untuk `query` non-SELECT |
| `.success` | boolean | Apakah operasi berhasil |
## Contoh – Menyisipkan Event

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

## Contoh – Menghitung Pengguna Aktif

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

Akses output: `$activeCount.count`.

## Contoh – Query Laporan Harian

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

Akses output: `$dailyReport.rows`, `$dailyReport.count`.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan kredensial ClickHouse
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial integrasi
