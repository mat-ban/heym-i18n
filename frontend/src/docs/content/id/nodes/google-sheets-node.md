# Google Sheets

Node **Google Sheets** membaca, menulis, dan mengelola data dalam spreadsheet Google Sheets melalui OAuth2. Gunakan node ini untuk mengotomatiskan alur kerja spreadsheet — membaca laporan, mencatat hasil, memperbarui pelacak, dan lainnya.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Credential Google Sheets dari [Credentials](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operasi: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID spreadsheet atau URL lengkap Google Sheets |
| `gsSheetName` | expression | Nama tab sheet (mis. `Sheet1`). Tidak diperlukan untuk `getSheetInfo`. |
| `gsStartRow` | expression | Untuk `readRange`: baris data pertama berbasis 1 (dengan `gsHasHeader`, baris 1 adalah header). |
| `gsMaxRows` | expression | Untuk `readRange`: jumlah maksimum baris data (0 = semua). |
| `gsHasHeader` | boolean | Untuk `readRange`: perlakukan baris 1 sebagai nama kolom jika true. |
| `gsUpdateRow` | expression | Hanya untuk `updateRange`: nomor baris sheet berbasis 1 yang akan diperbarui (kolom A–Z); jika tidak diatur, `gsStartRow` akan digunakan. Bukan batchUpdate — satu values API PUT. |
| `gsRange` | expression | Rentang notasi A1 (mis. `A1:D100`). Contoh legacy; editor menggunakan field baris untuk read/update. |
| `gsKeepHeader` | boolean | Hanya untuk `clearRange`: jika true, baris 1 dipertahankan dan baris data di bawahnya dihapus (kolom A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Hanya untuk `appendRows`: **Bottom** menambahkan setelah baris terakhir yang berisi data; **Top** menyisipkan baris baru tepat di bawah baris 1 (menggeser data ke bawah). |
| `gsValuesInputMode` | `raw` \| `selective` | Untuk `appendRows` / `updateRange`: **Raw** = array JSON lengkap; **Selective** = satu baris sheet, hanya field kolom (tanpa label A1). |
| `gsValuesSelectiveCols` | string | Mode selective: jumlah kolom (A–Z). |
| `gsValues` | expression | Array JSON 2D berisi nilai (mis. `[["Name","Age"],["Alice",30]]`). Diperlukan untuk `appendRows`, `updateRange`. |

## ID Spreadsheet

Field `gsSpreadsheetId` menerima **ID saja** (string alfanumerik panjang di antara `/d/` dan `/edit` pada URL Google Sheets) atau **URL lengkap** — Heym mengekstrak ID secara otomatis.

## Penyiapan Credential

Google Sheets menggunakan model **OAuth2 "Bring Your Own App"**. Anda menyediakan credential OAuth2 Google Cloud milik Anda sendiri.

**Konfigurasi backend:** Atur **`FRONTEND_URL`** pada backend Heym ke URL publik aplikasi (alamat yang diketik pengguna di browser), mis. `https://your-heym-domain`. URI redirect OAuth selalu `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — URI ini hanya diturunkan dari pengaturan ini, bukan dari header permintaan.

1. Buka [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktifkan **Google Sheets API**.
2. Buka **Credentials** → **Create Credentials** → **OAuth client ID** → pilih **Web application**.
3. Di bagian **Authorized redirect URIs**, tambahkan dengan tepat: `{FRONTEND_URL Anda}/api/credentials/google-sheets/oauth/callback` (misalnya `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Salin **Client ID** dan **Client Secret**.
5. Di Heym Dashboard → **Credentials** → **New** → pilih **Google Sheets (OAuth2)**.
6. Masukkan Client ID, Client Secret, dan nama, lalu klik **Connect** untuk menyelesaikan persetujuan OAuth2 di popup browser.

Token diperbarui secara otomatis di latar belakang — tidak diperlukan pengelolaan token secara manual.

## Operasi

| Operasi | Field yang Diperlukan | Deskripsi |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Membaca nilai sel (A–Z); `gsRange` opsional pada alur legacy |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Menambahkan baris di bagian bawah (`gsAppendPlacement` append) atau di bawah baris 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Menimpa baris dimulai dari `gsUpdateRow` (A–Z); JSON multi-baris menulis baris berurutan |
| `clearRange` | gsSpreadsheetId, gsSheetName | Menghapus semua nilai di kolom A–Z untuk tab; `gsKeepHeader` opsional mempertahankan baris pertama |
| `getSheetInfo` | gsSpreadsheetId | Mendapatkan judul spreadsheet dan daftar tab sheet |

## Referensi Output

| Operasi | Field output | Tipe | Deskripsi |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objek baris: key kolom (nama header atau A, B, …) ditambah **`rowIndex`** (baris sheet berbasis 1) |
| `readRange` | `.total` | number | Jumlah baris data yang dikembalikan |
| `appendRows` | `.updatedRange` | string | Rentang yang ditulis |
| `appendRows` | `.updates` | number | Jumlah baris yang ditambahkan |
| `updateRange` | `.updatedRange` | string | Rentang yang ditulis |
| `updateRange` | `.updatedCells` | number | Jumlah sel yang diperbarui |
| `clearRange` | `.clearedRange` | string | Rentang yang dihapus |
| `getSheetInfo` | `.title` | string | Judul spreadsheet |
| `getSheetInfo` | `.sheets` | array | Daftar objek `{sheetId, title}` |

Semua operasi menyertakan `success: true` dan `operation: "<name>"` pada output.
## Contoh – Membaca Range

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Akses output: `$readReport.rows[0]` (objek baris data pertama), `$readReport.rows[0].Name` (kolom berdasarkan header), `$readReport.rows[0].rowIndex` (indeks baris sheet berbasis 1).

## Contoh – Menambahkan Baris dari Input

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan kredensial Google Sheets OAuth2
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Penyiapan kredensial Google Sheets
