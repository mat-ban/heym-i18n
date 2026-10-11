# Supabase

Node **Supabase** membaca dan mengubah tabel yang diekspos oleh PostgREST API sebuah proyek Supabase. Gunakan node ini ketika Anda ingin mengakses status aplikasi yang didukung SQL melalui workflow tanpa perlu menulis permintaan HTTP secara manual.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | Supabase |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `credentialId` | UUID | Credential Supabase dari [Credentials](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operasi: `select`, `insert`, `update`, `upsert`, atau `delete` |
| `supabaseSchema` | expression | Nama schema. Jika kosong, node akan menggunakan schema default dari credential, lalu `public`. |
| `supabaseTable` | expression | Nama tabel sederhana yang akan dibaca atau diubah. Letakkan schema pada `supabaseSchema`, bukan di sini. |
| `supabaseSelectColumns` | expression | Daftar select PostgREST yang dipisahkan koma untuk `select` (default `*`) |
| `supabaseFilter` | expression | Objek filter JSON. Mendukung pencocokan persis serta objek operator dan grup logika, misalnya `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}`, atau `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Jumlah maksimum baris yang dikembalikan untuk `select` (`0` = ambil semua baris yang cocok dengan pagination sisi server, nilai negatif akan kembali ke `100`) |
| `supabaseOrderBy` | expression | Kolom opsional untuk pengurutan pada `select` |
| `supabaseAscending` | boolean | Urutkan menaik jika `true`, menurun jika `false` |
| `supabaseRowsInputMode` | string | Untuk `insert`/`upsert`: mode JSON array `raw` atau `auto` untuk memetakan satu input upstream secara otomatis |
| `supabaseDataInputMode` | string | Untuk `update`: mode objek JSON `raw` atau `auto` untuk memetakan satu input upstream secara otomatis |
| `supabaseIgnoredInputFields` | string | Nama field opsional yang dipisahkan koma untuk dihilangkan saat memetakan data input secara otomatis |
| `supabaseRows` | expression | JSON array berisi objek baris untuk `insert` dan `upsert` |
| `supabaseOnConflict` | expression | Kolom target konflik opsional yang dipisahkan koma untuk `upsert`, misalnya `id` atau `tenant_id,email` |
| `supabaseData` | expression | Objek JSON berisi nilai kolom yang diperbarui untuk `update` |

## Penyiapan Credential

Buat credential **Supabase** di [tab Credentials](../tabs/credentials-tab.md) dengan:

1. **Project URL** Anda, misalnya `https://your-project.supabase.co`
2. Sebuah **API key** dengan akses ke tabel yang akan digunakan oleh workflow ini
3. Sebuah **default schema** opsional (default-nya `public`)

Node ini berkomunikasi dengan endpoint PostgREST Supabase pada `/rest/v1/<table>`.
Gunakan `supabaseTable` hanya untuk nama tabel, seperti `users` atau `profiles`. Jangan memasukkan `schema.table`, `rpc/...`, atau jalur API lainnya di sana.

Ketika credential Supabase yang valid dipilih, editor dapat menemukan tabel yang diekspos dan kolom
tabel secara langsung dari metadata OpenAPI PostgREST. Gunakan dropdown **discovered tables** untuk
memilih tabel dan **column chips** di bawah **Select Columns** untuk membangun daftar select dengan cepat.

## Operasi

| Operasi | Field Wajib | Deskripsi |
|---------|-------------|-----------|
| `select` | `supabaseTable` | Membaca baris dengan filter pencocokan persis opsional, limit, dan pengurutan |
| `insert` | `supabaseTable`, `supabaseRows` atau auto-map input | Menyisipkan satu atau beberapa baris |
| `update` | `supabaseTable`, `supabaseData` atau auto-map input, `supabaseFilter` | Memperbarui baris yang cocok dengan filter |
| `upsert` | `supabaseTable`, `supabaseRows` atau auto-map input | Menyisipkan atau menggabungkan baris menggunakan semantik upsert Supabase. Gunakan `supabaseOnConflict` ketika Anda memerlukan target konflik yang eksplisit. |
| `delete` | `supabaseTable`, `supabaseFilter` | Menghapus baris yang cocok dengan filter |

## Sintaks Filter

`supabaseFilter` mengompilasi JSON terstruktur menjadi parameter query PostgREST.

- Pencocokan persis: `{"status":"active"}`
- Perbandingan: `{"created_at":{"gte":"2026-01-01"}}`
- Keanggotaan: `{"status":{"in":["active","paused"]}}`
- Pencocokan pola: `{"email":{"ilike":"*@example.com"}}`
- Logika OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logika AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Untuk beberapa operator pada field yang sama, utamakan grup logika:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Pagination

`select` kini melakukan pagination sisi server yang sesungguhnya terhadap PostgREST.

- `supabaseLimit: "0"` mengambil semua baris yang cocok halaman demi halaman
- Nilai `supabaseLimit` di atas 1000 secara otomatis dipecah menjadi beberapa permintaan
- Hasil digabungkan kembali menjadi satu array `.rows` dan `.count` tetap berisi jumlah total baris yang cocok

Saat membaca tabel besar, tetapkan `supabaseOrderBy` yang stabil agar batas halaman tetap dapat diprediksi.

## Auto-map Input

Untuk `insert`, `upsert`, dan `update`, alihkan node ke **Auto-map input** ketika satu
node upstream sudah menghasilkan bentuk data yang ingin Anda tulis.

- Satu objek menjadi satu baris atau satu payload update
- Array berisi objek menjadi banyak baris untuk `insert` / `upsert`
- Objek upstream dengan array `rows` akan langsung menggunakan array tersebut
- `supabaseIgnoredInputFields` memungkinkan Anda menghilangkan field seperti `id`, `created_at`, atau `success`
## Referensi Output

| Kolom output | Tipe | Deskripsi |
|-------------|------|-------------|
| `.rows` | array | Objek baris yang dikembalikan |
| `.count` | number | Jumlah baris yang dikembalikan atau terpengaruh |
| `.success` | boolean | Apakah operasi berhasil |

## Contoh – Pilih Pengguna Aktif

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

Akses output: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Contoh – Upsert Baris Profil

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

## Terkait

- [Tipe Node](../reference/node-types.md) – Ikhtisar semua tipe node
- [Tab Credentials](../tabs/credentials-tab.md) – Tambahkan credentials Supabase
- [Integrasi Pihak Ketiga](../reference/integrations.md) – Penyiapan credential integrasi
