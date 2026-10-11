# Notion

Node **Notion** mengelola database, data source, halaman, dan block melalui Notion API.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | Token integrasi internal atau Notion OAuth |
| Versi API | `2026-03-11` |

Koleksi bergaya database Notion menggunakan **data source ID** pada versi API terkini. Bagikan setiap halaman
atau data source yang dibutuhkan workflow ke integrasi sebelum menjalankan node.
Kolom resource menerima ID Notion mentah atau URL Notion lengkap. URL dinormalisasi ke ID resource
yang tertanam di dalamnya sebelum permintaan API dilakukan.

## Operasi

| Operasi | Kolom wajib | Output utama |
|---------|-------------|--------------|
| Search | Query/filter/sort opsional | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID atau Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, salah satu dari Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request dengan `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, database request yang tidak kosong | `.database`, `.id`, `.url` |
| Create Data Source | Data source request dengan `parent` dan `properties` yang tidak kosong | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, data source request yang tidak kosong | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block atau Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, objek block update | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block atau Page ID, Children | `.results`, `.count` |

Semua operasi juga mengembalikan `.success` dan `.operation`.

## Kolom JSON

Kolom Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon, dan Cover menerima
JSON Notion API. Ekspresi di dalam string JSON diselesaikan sebelum permintaan dilakukan. Suatu kolom juga dapat
berupa satu ekspresi mandiri yang langsung menghasilkan objek atau array yang dibutuhkan, seperti
`$input.database`, `$input.properties`, atau `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Untuk konten halaman atau block, Children adalah array objek block Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Database dan data source

Pada Notion API terkini, **database** adalah wadah dan **data source** menyimpan skema properti
serta baris yang dapat di-query. Retrieve Database mengembalikan daftar `data_sources` milik database; gunakan salah satu
ID tersebut dengan Retrieve Data Source atau Query Data Source.

Create Database menerima objek request lengkap dari endpoint Create a database milik Notion. Objek tersebut
harus berisi `parent` dan dapat berisi `title`, `description`, `is_inline`,
`initial_data_source`, `icon`, dan `cover`. Contoh:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database menerima objek request dari endpoint update, termasuk `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash`, dan `is_locked`. Kolom Database ID menerima
ID mentah, URL Notion lengkap, atau ekspresi.

Gunakan **Retrieve Data Source** untuk mengambil skema `properties` milik data source sebelum menyusun
objek properties Create Page. **Create Data Source** memerlukan objek database induk dan skema
`properties` yang tidak kosong. **Update Data Source** menerima objek request tidak kosong yang didukung
oleh endpoint Notion terkait.

Sebagai contoh, buat data source di dalam database yang sudah ada:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Selector Data Source dan Parent Page mendukung pencarian sisi server dengan debounce singkat dan
paginasi **Load more** berbasis cursor. Gunakan **Refresh** setelah membagikan resource baru di Notion.
Beralih ke **Use expression** untuk memasukkan ekspresi, ID mentah, atau URL.

Filter Search dari tutorial lama yang menggunakan
`{"property":"object","value":"database"}` diterjemahkan ke nilai `data_source` terkini.
Workflow baru sebaiknya langsung menggunakan `data_source` atau `page`.

Append Blocks mendukung posisi **Start**, **End**, dan **After Block**. Create Page dan Append
Blocks secara otomatis memecah lebih dari 100 children tingkat atas menjadi permintaan berurutan untuk memenuhi
batas per-permintaan Notion.

Permintaan yang terkena rate limit (`429` atau `529`) dicoba ulang hingga tiga kali. Heym mematuhi header
`Retry-After` dari Notion, membatasi setiap penantian maksimal 10 detik, dan menambahkan jitter acak. Permintaan Notion
berbagi connection pool HTTP tingkat proses di seluruh halaman dan node workflow.
## Batasan API Notion

- Satu nilai rich-text `text.content` dapat memuat paling banyak 2.000 karakter. Pisahkan teks yang lebih panjang
  menjadi beberapa objek rich-text.
- Notion membatasi block children tingkat atas hingga 100 per permintaan. Heym membagi array Children yang lebih besar,
  tetapi setiap blok individual tetap harus memenuhi batasan payload Notion.
- API menerima paling banyak dua tingkat block children bersarang dalam satu permintaan. Buat struktur yang lebih dalam
  dengan operasi Append Blocks lanjutan.
- Payload permintaan dibatasi hingga 1.000 elemen blok dan total 500 KB.

## Pagination

Search, Query Data Source, dan Get Block Children menerima ukuran halaman dari 1 hingga 100 dan kursor awal opsional. Atur ukuran halaman ke `0` untuk mengikuti kursor secara otomatis dan menggabungkan semua hasil, hingga batas keamanan 10.000 hasil milik node.

## Penyiapan kredensial

Pilih salah satu penyiapan di dialog kredensial (**Internal token** atau **OAuth**):

- **Internal token:** Buat integrasi internal, salin token-nya ke Heym, lalu bagikan setiap halaman atau data source yang diperlukan dengan integrasi tersebut. Gunakan **Test Connection** untuk memverifikasi akses.
- **OAuth:** Buat integrasi Notion publik dan daftarkan
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` di Notion. Di dialog kredensial Heym,
  pilih **OAuth**, masukkan Client ID dan Client Secret milik integrasi, lalu klik **Connect** untuk
  mengotorisasi workspace. Secret disimpan secara terenkripsi bersama kredensial dan tidak ditempatkan di
  OAuth state atau konfigurasi environment. Setelah otorisasi, kredensial menampilkan nama
  workspace yang terhubung (`connected (Workspace Name)`). Kredensial OAuth yang tertunda menampilkan
  `Not connected`.

Membiarkan kolom internal token kosong saat mengedit akan mempertahankan token yang tersimpan.

Untuk permintaan [HTTP](../nodes/http-node.md) kustom, `$credentials.YourNotionCredential` menghasilkan
bearer token yang sama dengan yang digunakan node Notion (internal token atau OAuth access token).

## Catatan versi API

Heym menyematkan permintaan Notion ke versi API `2026-03-11`. Versi ini menggunakan:

- Parent `data_source_id` dan endpoint `/data_sources` sebagai ganti jalur database-query lama
- `in_trash` sebagai ganti `archived` untuk operasi trash/restore halaman
- Objek `position` (`start`, `end`, `after_block`) untuk Append Block Children

Saat memigrasikan contoh otomasi Notion yang lebih lama:

- Ganti referensi parent/query database dengan ID data source dari **Retrieve Database** atau
  pemilih data-source di editor
- Ganti `archived: true` dengan `in_trash: true`
- Ganti parameter append `after` dengan kolom **Append Position** milik node

Filter Search yang masih menggunakan nilai objek `database` akan dinormalisasi menjadi `data_source` secara otomatis.

## Terkait

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)
