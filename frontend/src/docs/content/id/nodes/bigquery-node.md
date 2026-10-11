# BigQuery

Node **BigQuery** menjalankan kueri SQL dan menyisipkan baris ke dalam dataset Google BigQuery melalui BigQuery REST API v2. Gunakan node ini untuk mengueri dataset analitik berukuran besar atau melakukan streaming baris ke dalam tabel dari data workflow.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | BigQuery (OAuth2) |
| Output | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Credential BigQuery dari [Credentials](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operasi: `query` atau `insertRows` |
| `bqProjectId` | expression | ID project Google Cloud (contoh: `my-gcp-project`) |
| `bqQuery` | expression | String kueri SQL. Wajib untuk `query`. |
| `bqMaxResults` | string | Jumlah maksimum baris yang dikembalikan oleh `query` (default `1000`). |
| `bqDatasetId` | expression | ID dataset (contoh: `my_dataset`). Wajib untuk `insertRows`. |
| `bqTableId` | expression | ID tabel (contoh: `my_table`). Wajib untuk `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Untuk `insertRows`: **Raw** = array JSON penuh; **Selective** = satu baris sebagai pasangan field key-value. |
| `bqRows` | expression | Array JSON berisi objek baris untuk mode raw (contoh: `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Pasangan key-value untuk mode selective. Setiap key adalah nama kolom; setiap value adalah sebuah expression. |

## Penyiapan Credential

BigQuery menggunakan model **OAuth2 "Bring Your Own App"**. Anda menyediakan credential OAuth2 Google Cloud milik Anda sendiri.

**Konfigurasi backend:** Setel **`FRONTEND_URL`** pada backend Heym ke URL publik aplikasi (alamat yang diketik pengguna di browser), contoh: `https://your-heym-domain`. URI redirect OAuth selalu `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Buka [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktifkan **BigQuery API**.
2. Buka **Credentials** → **Create Credentials** → **OAuth client ID** → pilih **Web application**.
3. Di bagian **Authorized redirect URIs**, tambahkan persis: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Salin **Client ID** dan **Client Secret**.
5. Di Heym Dashboard → **Credentials** → **New** → pilih **BigQuery (OAuth2)**.
6. Masukkan Client ID, Client Secret, dan sebuah nama, lalu klik **Connect** untuk menyelesaikan persetujuan OAuth2 di popup browser.

Token diperbarui secara otomatis di latar belakang — tidak diperlukan pengelolaan token secara manual.

## Operasi

| Operasi | Field Wajib | Deskripsi |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Menjalankan kueri SQL dan mengembalikan baris |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows atau bqMappings | Menyisipkan satu atau beberapa baris melalui API streaming insertAll |

## Referensi Output

| Operasi | Field output | Tipe | Deskripsi |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array berisi objek baris (nama kolom → nilai) |
| `query` | `.total` | number | Jumlah baris yang dikembalikan |
| `query` | `.schema` | array | Field skema tabel |
| `insertRows` | `.insertedCount` | number | Jumlah baris yang berhasil disisipkan |
| `insertRows` | `.errors` | array | Kesalahan penyisipan per baris (kosong jika seluruhnya berhasil) |

## Contoh – Menjalankan Kueri

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

Akses output: `$getUsers.rows` (array berisi objek baris), `$getUsers.rows[0].email`, `$getUsers.total`.

## Contoh – Menyisipkan Baris

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

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan credential BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Pola OAuth2 serupa untuk data spreadsheet
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan credential integrasi
