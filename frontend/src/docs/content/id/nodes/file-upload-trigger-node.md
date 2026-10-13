# Trigger Unggah File

Node **File Upload Trigger** adalah titik masuk tanpa input untuk workflow yang memerlukan **file berukuran besar** (audio, video, arsip) yang tidak dapat disematkan sebagai base64 di dalam permintaan JSON. Memanggil workflow akan mengembalikan tautan unggah `curl` yang telah terisi sebelumnya dan bersifat sekali pakai; mengunggah file ke tautan tersebut akan memulai eksekusi dengan file yang dilampirkan.

Gunakan node ini ketika pemanggil — termasuk agen AI seperti Claude atau ChatGPT yang berjalan di dalam sandbox — harus menyerahkan rekaman suara berukuran 20 MB atau video berukuran 75 MB ke workflow Heym.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Cara kerja

Node ini berjalan dalam dua fase:

1. **Mint.** Ketika workflow dipanggil melalui HTTP (`POST /api/workflows/{id}/execute`), sebagai MCP tool, atau melalui tombol **Run Workflow** di canvas, eksekusi **tidak** menjalankan isi workflow. Sebagai gantinya, node ini membuat slot unggah sekali pakai dan mengembalikan:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Unggah + eksekusi.** Pemanggil menjalankan `curl` dengan file mereka. Endpoint unggah memvalidasi slot, menyimpan file, menjalankan workflow secara **sinkron**, dan mengembalikan output workflow di dalam respons unggahan. Tautan bersifat **sekali pakai** — unggahan kedua akan mengembalikan `409`.

Di canvas, **Run Workflow** menampilkan `curl` yang telah dibuat di panel debug dengan tombol salin.

## Menjalankan dari Heym

Dua tempat menjalankan Workflow semacam ini secara langsung pada sebuah file, melalui proses pembuatan tautan dan unggahan yang sama:

- [Quick Drawer](../reference/quick-drawer.md) menampilkan zona lepas (drop zone) untuk file tersebut. Eksekusi ini diberi tag `Quick Drawer` di riwayat.
- [Widget Run](../tabs/dashboard-tab.md#run-widgets) di dasbor menjalankan Workflow pada setiap file yang dilepaskan. Eksekusi ini diberi tag `dashboard`.

## Parameter

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Berapa lama tautan unggah tetap valid (1–10080 menit / hingga 7 hari). |
| `maxSizeMb` | number | `100` | Ukuran file maksimum yang diterima. Batas maksimum adalah **100 MB**. |
| `allowedTypes` | string | (kosong) | Allowlist MIME/ekstensi opsional yang dipisahkan koma, misalnya `audio/*, .wav`. Kosong berarti mengizinkan semua tipe. |

## Field output

| Ekspresi | Deskripsi |
|------------|-------------|
| `$nodeLabel.file.id` | UUID file yang disimpan (file Drive). |
| `$nodeLabel.file.name` | Nama file asli. |
| `$nodeLabel.file.mime` | Tipe konten yang terdeteksi. |
| `$nodeLabel.file.size` | Ukuran dalam byte. |
| `$nodeLabel.file.download_url` | URL unduhan terautentikasi untuk node hilir. |
| `$nodeLabel.uploaded_at` | Timestamp ISO dari unggahan. |

## Contoh

Sebuah workflow transkripsi:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Sebuah agen memanggil MCP tool workflow dan menerima `curl`.
2. Agen menjalankan `curl` dengan rekaman dari sandbox-nya.
3. Unggahan menjalankan workflow dan respons `curl` berisi ringkasan transkrip.

## Keamanan

- URL unggah menyematkan token dengan entropi tinggi — token tersebut **adalah** kapabilitasnya, sehingga agen yang berjalan di sandbox tidak memerlukan kredensial Heym untuk mengunggah. Hanya hash token yang disimpan di sisi server.
- Pembuatan tautan memerlukan autentikasi workflow normal, sehingga hanya pemanggil yang berwenang yang dapat membuat tautan unggah.
- Setiap pembuatan tautan dan setiap upaya unggahan (diterima atau ditolak — kedaluwarsa, diputar ulang, melebihi ukuran, tipe tidak diizinkan, token tidak dikenal) dicatat ke dalam jejak audit yang bersifat append-only.
- Unggahan diberlakukan sekali pakai, dibatasi TTL, dan dibatasi ukurannya; unggahan yang melebihi ukuran akan ditolak.

## Catatan

- Kanal pemanggilan HTTP generik, MCP, dan canvas tetap hanya mendukung JSON; node ini adalah cara yang didukung untuk menerima unggahan file multipart.
- File yang diunggah disimpan sebagai file Drive biasa, sehingga node hilir apa pun yang menerima referensi file (transkripsi, lampiran email, dll.) dapat mengonsumsi `$nodeLabel.file`.
