# Google Drive

Node **Google Drive** menampilkan daftar, mengunduh, memperbarui, dan menghapus file serta folder di Google Drive melalui OAuth2. Node ini juga dapat menyalin file Drive langsung ke [Heym Drive](./drive-node.md) dengan satu operasi.

> **Ini bukan node [Drive](./drive-node.md).** Node tersebut adalah *Heym Drive* — penyimpanan file internal milik Heym sendiri. Node ini berkomunikasi dengan Google Drive. Operasi `syncToHeymDrive` adalah jembatan antara keduanya.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | Google Drive (OAuth2) |
| Output | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Credential Google Drive dari [Credentials](../tabs/credentials-tab.md) |
| `gdOperation` | string | Operasi: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID folder atau URL folder Drive lengkap. Digunakan oleh `listFolderFiles` dan `removeFolder`. Kosong berarti root Drive. |
| `gdFileId` | expression | ID file atau URL Drive/Docs lengkap. Digunakan oleh `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Untuk `listFolderFiles`: jumlah maksimum file yang dikembalikan (default 100). Kosong atau `0` memuat seluruh folder melalui paging. Setiap file yang terdaftar menyertakan `size_bytes` ketika Drive melaporkan ukurannya. |
| `gdQuery` | expression | Untuk `listFolderFiles`: query Drive tambahan yang di-AND dengan filter folder, misalnya `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Untuk `listFolderFiles`: sertakan file yang ada di trash. Default false. |
| `gdExportFormat` | string | Untuk `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Kosong berarti otomatis. Diabaikan untuk file biasa. |
| `gdFilename` | expression | Untuk `syncToHeymDrive`: menimpa nama file yang disimpan di Heym Drive. |
| `gdBase64Content` | expression | Untuk `updateFile`: string base64 atau URL `data:` yang menggantikan konten file. |
| `gdNewName` | expression | Untuk `updateFile`: nama file baru (rename). |
| `gdNewParentId` | expression | Untuk `updateFile`: ID atau URL folder tujuan (move). |
| `gdPermanentDelete` | boolean | Untuk `removeFile` / `removeFolder`: ketika false (default) item dipindahkan ke trash dan dapat dipulihkan; ketika true item dihancurkan. |

## ID File dan Folder

`gdFileId`, `gdFolderId`, dan `gdNewParentId` menerima **ID saja** atau **URL lengkap** — Heym mengekstrak ID secara otomatis. Semua bentuk berikut dapat digunakan:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets, dan Slides

Dokumen native Google **tidak memiliki byte yang dapat diunduh**. Dokumen tersebut merupakan record di server Google, bukan file — Drive API mengembalikan `403 Only files with binary content can be downloaded` jika Anda meminta konten mentahnya.

`downloadFile` dan `syncToHeymDrive` mendeteksi hal ini secara otomatis dan melakukan **export** sebagai gantinya, sehingga tidak ada operasi yang gagal hanya karena targetnya adalah Google Doc:

| Sumber | Export default |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Tipe native Google lainnya | PDF |

Atur **Export Format** untuk menimpa target. Pengaturan ini diabaikan untuk file yang diunggah biasa, yang selalu diunduh apa adanya.

## Operasi

| Operasi | Wajib | Deskripsi |
|-----------|----------|-------------|
| `listFolderFiles` | — (folder kosong = root) | Menampilkan daftar file dalam folder, dengan filter query opsional |
| `downloadFile` | `gdFileId` | Mengunduh byte file sebagai base64, mengekspor dokumen native secara otomatis |
| `syncToHeymDrive` | `gdFileId` | Mengunduh dari Google Drive dan menyimpan hasilnya di Heym Drive |
| `updateFile` | `gdFileId` + minimal salah satu dari konten / nama / parent | Mengganti konten, rename, dan/atau move |
| `removeFile` | `gdFileId` | Memindahkan ke trash (default) atau menghapus file secara permanen |
| `removeFolder` | `gdFolderId` | Memindahkan ke trash (default) atau menghapus folder beserta isinya secara permanen |

### Penghapusan dapat dipulihkan secara default

`removeFile` dan `removeFolder` memindahkan item ke **trash Google Drive**, tempat item tersebut dapat dipulihkan. Ini adalah default yang aman untuk sesuatu yang mungkin dijalankan sesuai jadwal atau di dalam [Loop](./loop-node.md).

Mengaktifkan **Delete permanently** menghancurkan item tanpa pemulihan. Untuk `removeFolder`, hal itu juga menghancurkan semua yang ada di dalam folder.

Node ini juga memeriksa tipe target: `removeFile` menolak folder dan `removeFolder` menolak file, sehingga ID yang salah ketik tidak dapat secara diam-diam menghapus item yang salah.

### updateFile membiarkan field kosong tidak tersentuh

`updateFile` adalah pembaruan, bukan penggantian. Isi kombinasi apa pun dari konten, nama baru, dan folder baru — apa pun yang Anda biarkan kosong tidak akan disentuh. Minimal salah satu dari ketiganya wajib diisi.
## Penyiapan Credential

Google Drive menggunakan model **OAuth2 "Bring Your Own App"**. Anda menyediakan kredensial OAuth2 Google Cloud Anda sendiri.

> **Credential ini memberikan akses penuh ke Drive.** Heym meminta scope `https://www.googleapis.com/auth/drive` karena node ini beroperasi pada file yang sudah Anda miliki. Scope `drive.file` yang lebih sempit hanya dapat melihat file yang dibuat oleh aplikasi itu sendiri, sehingga akan membuat operasi listing, pembaruan, dan penghapusan file Anda yang sudah ada menjadi tidak mungkin. Lihat [Credential Sharing](../reference/credentials-sharing.md) sebelum membagikan credential ini kepada tim.

**Konfigurasi backend:** Tetapkan **`FRONTEND_URL`** pada backend Heym ke URL publik aplikasi. OAuth redirect URI selalu `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — nilai ini hanya diturunkan dari pengaturan tersebut, bukan dari header permintaan.

1. Buka [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktifkan **Google Drive API**.
2. Buka **Credentials** → **Create Credentials** → **OAuth client ID** → pilih **Web application**.
3. Di bagian **Authorized redirect URIs**, tambahkan dengan tepat `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Salin **Client ID** dan **Client Secret**.
5. Di Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, tempelkan kedua nilai tersebut, lalu klik **Connect** dan setujui akses pada popup.

## Output

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` bernilai `null` untuk folder dan file native Google, yang tidak melaporkan ukuran.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Untuk file biasa, `exported` bernilai `false` dan `export_format` bernilai `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` adalah ID file **Heym Drive** yang baru, berbeda dari `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` bernilai `"trashed"` atau `"permanent"`.

## Contoh: mencadangkan folder Drive ke Heym Drive

1. **[Cron](./cron-node.md)** — jalankan setiap hari.
2. **Google Drive** — `listFolderFiles` pada folder sumber, dengan `gdQuery` diatur ke `mimeType='application/pdf'` jika Anda hanya menginginkan PDF.
3. **[Loop](./loop-node.md)** — iterasi `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` dengan `gdFileId` diatur ke `$BackupLoop.item.id` dan `gdFilename` diatur ke `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — kirimkan ringkasan tentang apa yang telah dicadangkan.

## Catatan

- Setiap kolom teks menerima ekspresi `$`, sehingga ID dan nama file dapat berasal dari node sebelumnya.
- Shared drive didukung — node ini menetapkan `supportsAllDrives` pada setiap permintaan.
- Unduhan diperiksa ukurannya terhadap pengaturan `FILE_MAX_SIZE_MB` pada backend.
- Lampirkan node ini ke input tool pada node [Agent](./agent-node.md) dan gunakan ikon bot pada kolom mana pun untuk membiarkan agent mengisinya saat runtime.

## Lihat Juga

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Credential Sharing](../reference/credentials-sharing.md)
