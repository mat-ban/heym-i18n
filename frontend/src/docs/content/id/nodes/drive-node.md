# Drive

Node **Drive** mengelola file yang dihasilkan oleh skill langsung dari dalam sebuah workflow. Gunakan node ini untuk mengambil file, mengunduh file dari URL eksternal, menghapusnya, membagikan atau membatalkan pembagiannya dengan tim Anda, atau memperbarui batasan aksesnya (password, kedaluwarsa, batas unduhan) secara programatik.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (bervariasi menurut operasi) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `driveOperation` | string | Operasi: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID file Drive yang akan dikelola (semua operasi kecuali `getAll`, `downloadUrl`, dan `save`) |
| `driveLimit` | number | Jumlah maksimum file yang dikembalikan (hanya `getAll`; kosong berarti tanpa batas) |
| `driveSourceUrl` | expression | URL untuk diambil dan disimpan di Drive (hanya `downloadUrl`) |
| `driveFilename` | expression | Nama file lengkap termasuk ekstensi (hanya `save`, contoh: `1.mp3`) |
| `driveBase64Content` | expression | String base64 mentah atau data URL untuk didekode dan disimpan (hanya `save`) |
| `driveIncludeBinary` | boolean | Sertakan konten file sebagai base64 dalam output (hanya `get`) |
| `drivePassword` | expression | Password yang akan ditetapkan pada access token (hanya `setPassword`) |
| `driveTtlHours` | number | Jam hingga tautan unduhan kedaluwarsa (hanya `setTtl`) |
| `driveMaxDownloads` | number | Jumlah maksimum unduhan yang diizinkan (hanya `setMaxDownloads`) |

## Mendapatkan File ID

Ketika sebuah skill menghasilkan file, output menyertakan array `_generated_files`. Setiap entri menyertakan field `id`:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Referensikan file ID dengan: `$agentLabel._generated_files[0].id`

## Operasi

| Operasi | Field Wajib | Deskripsi |
|-----------|----------------|-------------|
| `get` | driveFileId | Mengambil metadata file (dan secara opsional konten biner) dari Drive |
| `getAll` | tidak ada | Menampilkan daftar file Drive yang dimiliki dan dibagikan ke tim yang dapat dibaca beserta metadata seperti nama file, tipe MIME, ukuran, sumber, dan URL unduhan |
| `downloadUrl` | driveSourceUrl | Mengambil file dari URL eksternal dan menyimpannya di Drive |
| `save` | driveFilename, driveBase64Content | Mendekode konten base64 dan menyimpannya sebagai file Drive |
| `delete` | driveFileId | Menghapus file dan semua access token-nya dari disk dan database |
| `setPassword` | driveFileId, drivePassword | Mengganti token publik default dengan token yang dilindungi password |
| `setTtl` | driveFileId, driveTtlHours | Mengganti token publik default dengan token yang kedaluwarsa setelah N jam |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Mengganti token publik default dengan token yang dibatasi hingga N unduhan |
| `shareWithMyTeams` | driveFileId | Membagikan file secara read-only ke semua tim tempat pemilik workflow saat ini menjadi anggota |
| `unshareWithMyTeams` | driveFileId | Menghapus semua pembagian tim dari file |

> **Catatan:** Operasi `set*` menghapus token publik default (tanpa batasan) dan membuat token baru dengan batasan yang ditentukan. `download_url` yang diperbarui disertakan dalam output.
> **Pembagian tim:** `shareWithMyTeams` membuat pembagian eksplisit untuk tim pemilik saat ini. Tim di masa mendatang tidak ditambahkan secara otomatis kecuali operasi dijalankan kembali. `unshareWithMyTeams` menghapus semua pembagian tim dari file.

## Contoh — Mengunduh File dari URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Referensikan file yang disimpan di hilir: `$fetchReport.id`, `$fetchReport.download_url`

Nama file diambil dari header respons `Content-Disposition`; jika tidak ada, nama file diturunkan dari jalur URL.

## Contoh — Menyimpan Input Base64 ke Drive

Gunakan ini ketika node input teks (atau node upstream mana pun) menyediakan konten file base64:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Referensikan file yang disimpan di hilir: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` menerima string base64 mentah atau data URL `data:...;base64,...`. Tipe MIME disimpulkan dari ekstensi nama file.

## Contoh — Mendapatkan File dan Menggunakan Biner di Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Referensikan konten base64 di hilir: `$fetchImage.file_base64`

Gambar yang dikembalikan melalui `file_base64` ditampilkan secara inline di panel debug ketika Anda menjalankan workflow.

## Contoh — Menampilkan Daftar File Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Referensikan file pertama yang dikembalikan di hilir: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Contoh — Hapus File Setelah Pemrosesan

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Contoh — Tetapkan Kata Sandi pada File yang Dihasilkan

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Contoh — Tetapkan Kedaluwarsa (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Contoh — Batasi Unduhan

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Contoh — Bagikan Dengan Tim Saya

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Anggota tim dapat melihat dan mengunduh file dari Drive serta menggunakan operasi baca dalam workflow. Mereka tidak dapat menghapus, membagikan ulang, atau mengubah batasan tautan publik.

## Contoh — Batalkan Berbagi Dari Tim Saya

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Mengonversi file

Konversi format dipindahkan ke node [Converter](./converter-node.md). Simpan atau ambil file dengan Drive, lalu serahkan id-nya ke node converter:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

File asli dipertahankan dan file yang dikonversi disimpan sebagai file Drive baru.

## Akses Output

**get:**
- `$nodeLabel.id` — UUID file
- `$nodeLabel.filename` — nama file
- `$nodeLabel.mime_type` — tipe MIME (misalnya `image/png`)
- `$nodeLabel.size_bytes` — ukuran file dalam byte
- `$nodeLabel.download_url` — URL unduhan publik
- `$nodeLabel.file_base64` — konten file yang dikodekan base64 (hanya ketika **Include binary content** diaktifkan)

**getAll:**
- `$nodeLabel.files` — Array objek metadata file
- `$nodeLabel.count` — Jumlah file yang dikembalikan
- `$nodeLabel.files[0].id` — UUID file
- `$nodeLabel.files[0].filename` — Nama file
- `$nodeLabel.files[0].mime_type` — Tipe MIME
- `$nodeLabel.files[0].size_bytes` — Ukuran file dalam byte
- `$nodeLabel.files[0].download_url` — URL unduhan publik ketika token publik tersedia
- `$nodeLabel.files[0].metadata` — Objek metadata yang disimpan
- `$nodeLabel.files[0].created_at` — Timestamp pembuatan file

**downloadUrl:**
- `$nodeLabel.id` — UUID file yang baru disimpan
- `$nodeLabel.filename` — nama file (dari `Content-Disposition` atau jalur URL)
- `$nodeLabel.mime_type` — tipe MIME yang terdeteksi dari respons atau ekstensi file
- `$nodeLabel.size_bytes` — ukuran file dalam byte
- `$nodeLabel.download_url` — URL unduhan Drive untuk file yang disimpan

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID file yang dihapus

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID file
- `$nodeLabel.download_url` — URL token akses baru dengan batasan yang diterapkan

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID file
- `$nodeLabel.shared_team_count` — Jumlah berbagi tim setelah operasi

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID file
- `$nodeLabel.shared_team_count` — `0` setelah operasi

## Kepemilikan

Operasi khusus pemilik mengharuskan file dimiliki oleh pemilik workflow. Operasi baca (`get`, `getAll`) juga dapat mengakses file yang dibagikan kepada pemilik workflow melalui tim.

## Terkait

- [File Generation](../reference/file-generation.md) - Bagaimana skill menghasilkan file dan output `_generated_files`
- [Drive Tab](../reference/drive.md) - Manajemen file visual di dashboard
- [Agent Node](./agent-node.md) - Menjalankan skill yang menghasilkan file
- [Converter Node](./converter-node.md) - Mengonversi file yang disimpan ke format lain, atau melakukan OCR ke teks
- [Expression DSL](../reference/expression-dsl.md) - Sintaks ekspresi untuk nilai dinamis
