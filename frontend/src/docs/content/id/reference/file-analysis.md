# Analisis File

Analisis file memungkinkan Chat, [node Agent](../nodes/agent-node.md), dan [node Code](../nodes/code-node.md) membuka dan menganalisis file besar dari [Drive](./drive.md) dalam sandbox Python yang terisolasi. File PDF, spreadsheet, CSV, DOCX, dan JSON diperiksa terlebih dahulu lalu dibaca secara selektif, sehingga kontrak 200 halaman atau buku kerja dengan satu juta baris tidak perlu dimuat seluruhnya ke dalam konteks model.

## Cara kerja

Setiap panggilan berjalan dalam container baru tanpa akses jaringan. File yang diperlukan disalin sebagai baca-saja, kode dijalankan, dan container dihapus. Folder kerja kecil dipertahankan di antara panggilan sesi yang sama, memungkinkan langkah selanjutnya melanjutkan hasil yang disimpan oleh langkah sebelumnya.

| Jalur | Isi |
|------|--------|
| `/input` | File Drive sesi ini, baca-saja |
| `/work` | Ruang kerja yang dipertahankan selama sesi, misal `/work/sales.pkl` |
| `/work/out` | File yang ditulis di sini disimpan ke Drive setelah panggilan dan dikembalikan sebagai tautan |

Sandbox telah dilengkapi dengan pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx, dan langdetect yang telah diinstal sebelumnya, ditambah OCR Tesseract yang juga digunakan oleh [node Konverter](../nodes/converter-node.md).

## Alat

Model bekerja dengan tiga alat, ditambah alat keempat di Chat:

| Alat | Fungsi |
|------|----------|
| `list_files` | Mencantumkan file Drive yang dapat Anda buka: nama, jenis, ukuran, tanggal |
| `inspect_file` | Mengembalikan jenis file, metadata, dan struktur dengan sampel singkat |
| `run_python` | Menjalankan Python pada file yang ditentukan dan mengembalikan output konsol |
| `clear_workspace` | Hanya Chat: menghapus folder kerja percakapan |

`inspect_file` hanya membaca apa yang diperlukan untuk ringkasan:

| Jenis | Ringkasan |
|-----|-----------------|
| PDF | Jumlah halaman, judul dan penulis, kemampuan ekstraksi teks, bahasa, ukuran halaman, teks dan tabel halaman pertama. PDF pindaian dibaca dengan OCR (hingga 5 halaman) |
| XLSX / XLS | Lembar kerja dengan jumlah baris dan kolom, baris header, tipe data, `read_hint` pandas, rentang bernama, baris pertama |
| CSV / TSV | Pengkodean, pembatas, jumlah baris, kolom dengan tipe data, baris pertama |
| DOCX | Struktur judul, tabel, jumlah kata dan karakter, penulis, dan tanggal |
| JSON | Tipe root, kunci, panjang array, kedalaman penyarangan, rekaman sampel |

Di dalam `run_python`, buka file menggunakan modul `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Di Chat

Lampirkan file PDF, spreadsheet, DOCX, CSV, atau JSON, gambar (PNG, JPG, GIF, WebP), atau file teks biasa di [tab Chat](../tabs/chat-tab.md), di Chat Heym Work, atau melalui alat MCP `heym_chat`. Satu pesan dapat membawa hingga 10 file. Setiap file disimpan di Drive Anda; hanya nama dan ID-nya yang masuk ke dalam pesan. Chat memeriksa file, membaca bagian yang diperlukan untuk pertanyaan Anda, dan merespons dengan tabel atau cuplikan.

## Di Workflow

Eksekusi hanya membuka filenya sendiri: file yang diunggah melalui [Trigger Unggah File](../nodes/file-upload-trigger-node.md), file yang ditulis node-nya ke Drive, dan file yang diambil oleh [node Drive](../nodes/drive-node.md) dengan langkah **Get** dalam eksekusi yang sama.

- **Node Agent**: jika input atau pesan agent menyertakan file eksekusi, agent secara otomatis menerima alat di atas untuk file tersebut.
- **Node Code**: atur **Files** ke ekspresi seperti `$Upload.file.id`. File dipasang dan dicantumkan dalam `params.files`.

## Batasan

| Batasan | Nilai |
|-----------|------|
| Memori per panggilan | 2 GB |
| Waktu per panggilan | 120 detik |
| Folder kerja per sesi | 2 GB |
| File output per panggilan | 20, hingga 100 MB masing-masing |
| Teks cetak yang dikembalikan ke model | 20.000 karakter |
| File per panggilan | 20 |

## Keamanan

- Sandbox tidak memiliki akses jaringan, tidak memiliki akses ke pengaturan atau rahasia Heym, dan berjalan sebagai pengguna tanpa hak istimewa.
- File diproses secara eksklusif di dalam sandbox.
- Di Chat, akses mengikuti Drive: Anda membuka file Anda sendiri dan file yang dibagikan dengan tim Anda.
- Pembukaan file di Chat dicatat dalam log audit.
- Konten file diperlakukan secara ketat sebagai data; instruksi di dalam file tidak dijalankan.

## Persyaratan

Analisis file memerlukan backend sandbox pada instans Heym (Docker atau [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Terkait

- [Drive](./drive.md)
- [Node Code](../nodes/code-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Tab Chat](../tabs/chat-tab.md)
