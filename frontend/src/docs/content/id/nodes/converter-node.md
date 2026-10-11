# Konverter

Node **Converter** mengonversi data dan file antar format tanpa menulis kode. Node ini bersifat netral terhadap teknologi sehingga lebih banyak format dapat ditambahkan seiring waktu. Node ini mengonversi data CSV, JSON, dan XML dalam kedua arah, menjalankan Tesseract OCR untuk mengekstrak teks dari gambar dan PDF, serta menulis ulang file yang tersimpan dalam format lain.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.result` (data yang di-parse untuk `csvToJson` / `xmlToJson`, teks untuk `jsonToCsv` / `jsonToXml`, teks yang diekstrak untuk `imageToText` / `pdfToText`, metadata file baru untuk `fileConvert`) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `conversion` | string | `csvToJson` (teks CSV → array objek baris), `jsonToCsv` (array objek/baris → teks CSV), `xmlToJson` (teks XML → objek), `jsonToXml` (objek → teks XML), `imageToText` (OCR pada gambar), `pdfToText` (OCR setiap halaman PDF yang dipilih), atau `fileConvert` (menulis ulang file yang tersimpan dalam format lain) |
| `source` | expression | Data yang akan dikonversi. Biarkan kosong untuk menggunakan input pertama node |
| `delimiter` | string | Pemisah field satu karakter (default `,`) |
| `hasHeader` | boolean | Hanya `csvToJson` — perlakukan baris pertama sebagai header (default `true`) |
| `trimValues` | boolean | Hanya `csvToJson` — hapus spasi di sekitar nama header dan nilai sel (default `true`) |
| `includeHeader` | boolean | Hanya `jsonToCsv` — tulis baris header (default `true`) |
| `converterColumns` | string | Hanya `jsonToCsv` — urutan kolom opsional yang dipisahkan koma |
| `converterFileId` | expression | Konversi file — file Heym Drive yang akan dibaca, misalnya `$Upload.file.id` |
| `converterTargetFormat` | string | Hanya `fileConvert` — format output (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Hanya OCR — `auto` (default), kode Tesseract seperti `tur`, atau `custom` |
| `ocrLanguageCustom` | string | Hanya OCR — kode bahasa yang digunakan saat `ocrLanguage` bernilai `custom`, misalnya `eng+tur` |
| `ocrEncoding` | string | Hanya OCR — charset tempat teks dinormalisasi (default `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Hanya OCR — terapkan normalisasi NFC (default `true`) |
| `ocrPsm` | string | Hanya OCR — mode segmentasi halaman Tesseract (default `3`) |
| `ocrDpi` | number | Hanya `pdfToText` — DPI rasterisasi halaman (default `300`) |
| `ocrPageRange` | expression | Hanya `pdfToText` — `3` atau `2-5`. Kosong berarti semua halaman |

## Perilaku

- **`csvToJson`** mem-parse teks CSV sumber. Dengan `hasHeader: true` setiap baris menjadi objek dengan kunci dari nilai header; dengan `hasHeader: false` setiap baris menjadi array nilai sel. Field yang dikutip, pemisah yang tertanam, dan baris baru yang tertanam ditangani sesuai RFC 4180. BOM UTF-8 di awal (umum pada ekspor Excel) dihapus, dan nama header duplikat dibuat unik tanpa menimpa kolom asli (`a, a, a_2` → `a`, `a_3`, `a_2`). Atur `delimiter` ke `\t` untuk mem-parse nilai yang dipisahkan tab.
- **`trimValues`** (default `true`) menghapus spasi di sekitar nama header dan nilai sel, **termasuk di dalam field yang dikutip** (`" padded "` → `padded`). RFC 4180 memperlakukan spasi dalam tanda kutip sebagai data, jadi atur `trimValues: false` untuk mempertahankannya secara persis.
- **`jsonToCsv`** membangun teks CSV dari array objek (atau array). Urutan kolom diambil dari `converterColumns` bila disediakan, jika tidak disimpulkan dari kunci objek pertama. Nilai yang mengandung pemisah, tanda kutip, atau baris baru akan dikutip secara otomatis.
- **`xmlToJson`** mem-parse XML menjadi objek. Atribut menggunakan awalan `@` dan teks yang bercampur dengan atribut menggunakan `#text`; elemen saudara yang berulang menjadi array. Ekspansi entitas XML dinonaktifkan.
- **`jsonToXml`** menyerialkan objek ke dokumen XML. Objek harus memiliki tepat satu kunci tingkat atas, yang menjadi elemen root XML. Gunakan konvensi `@attribute` dan `#text` yang sama seperti `xmlToJson` untuk menghasilkan atribut dan teks di samping elemen anak.
- **`imageToText`** menjalankan Tesseract pada satu gambar (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** merasterisasi setiap halaman yang dipilih pada `ocrDpi` dan mengenalinya. Setiap halaman melewati OCR, sehingga PDF digital dengan lapisan teks yang sempurna tetap dibaca ulang dari piksel. Hal ini menjaga dokumen hasil pindai dan digital berperilaku identik, dengan mengorbankan kecepatan, jadi persempit `ocrPageRange` pada file yang panjang.
- **`fileConvert`** menulis ulang file sumber dalam format lain dan menyimpan hasilnya sebagai file Drive **baru**. File asli tidak pernah diubah. Dokumen diproses melalui pandoc, gambar melalui Pillow, dan JSON ke CSV melalui penulis csv Python. Gambar tidak dapat menjadi dokumen dan dokumen tidak dapat menjadi gambar; untuk membaca teks dari gambar gunakan `imageToText`.

## Memasukkan file

Konversi file membaca dari Heym Drive, bukan dari path atau URL, sehingga file harus disimpan terlebih dahulu. Tiga rantai yang umum:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — arahkan `converterFileId` ke `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — ambil file jarak jauh ke Drive, lalu teruskan `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — skill yang menulis file mengeksposnya sebagai `$reportAgent._generated_files[0].id`.

`converterFileId` juga menerima objek file utuh (`$Upload.file`) atau URL unduhan Heym; id file diambil dari keduanya. File harus milik Anda atau dibagikan oleh rekan kerja kepada Anda.
## Bahasa

`auto` (default) menjalankan deteksi orientasi-dan-skrip Tesseract terlebih dahulu, lalu memilih model terbaik yang terpasang untuk skrip yang terdeteksi. Model skrip seperti `Latin` atau `Cyrillic` membaca setiap bahasa yang ditulis dalam skrip tersebut, itulah sebabnya auto dapat menangani faktur berbahasa Turki dan faktur berbahasa Inggris tanpa perlu diberi tahu yang mana yang mana.

Menyebutkan bahasa secara eksplisit tetap lebih akurat jika Anda mengetahuinya. Gunakan satu kode (`tur`), atau gabungkan beberapa dengan `+` (`eng+tur`) untuk dokumen campuran — semakin banyak bahasa berarti pengenalan lebih lambat dan sedikit lebih berisik, jadi jaga agar daftarnya tetap pendek. Kode hanya berfungsi jika data bahasa yang sesuai terpasang di backend; node akan menampilkan apa yang tersedia ketika Anda memilih kode yang tidak ada.

Setiap image Heym menyertakan `osd`, bahasa Inggris, Turki, Jerman, Prancis, Spanyol, Italia, Portugis, Belanda, Rusia, Arab, Tionghoa Sederhana, Jepang, Korea, serta model skrip Latin, Cyrillic, Arabic, HanS, Japanese, dan Hangul.

## Encoding

Teks yang dikenali berformat UTF-8 dan mempertahankan setiap karakter yang dihasilkan Tesseract. `ocrNormalizeUnicode` (aktif secara default) menerapkan normalisasi NFC, sehingga huruf yang ditulis sebagai `s` ditambah combining cedilla menjadi satu `ş` — sebaiknya dibiarkan aktif, karena kedua bentuk tersebut tidak sama dalam perbandingan atau pencarian database.

`ocrEncoding` hanya penting ketika sesuatu di hilir tidak dapat menyimpan rentang Unicode penuh. Memilih `cp1254` atau `iso-8859-9` menjaga teks Turki tetap utuh sekaligus menjamin hasilnya sesuai dengan charset tersebut; `latin-1` dan `ascii` lebih sempit dan mengganti karakter yang tidak dapat direpresentasikan dengan `?`. Biarkan pada `utf-8` kecuali sistem target memaksa Anda untuk mengubahnya.

## Output

`csvToJson`, `jsonToCsv`, `xmlToJson`, dan `jsonToXml` mengembalikan `$label.result` dan `$label.conversion`. Konversi OCR menambahkan:

| Field | Description |
|-------|-------------|
| `$label.result` | Teks lengkap yang diekstrak, halaman digabungkan dengan baris kosong |
| `$label.language` | Model yang benar-benar dijalankan (berguna untuk melihat apa yang dipilih `auto`) |
| `$label.encoding` | Charset yang digunakan untuk menormalisasi teks |
| `$label.page_count` | Jumlah halaman yang dikenali |
| `$label.pages` | Array `{ page, text }` untuk penanganan per halaman |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` dari file sumber |

`fileConvert` mengembalikan file baru sebagai gantinya:

| Field | Description |
|-------|-------------|
| `$label.id` | UUID dari file yang baru disimpan |
| `$label.filename` | Nama file hasil konversi, nama dasar dipertahankan dan ekstensi diganti |
| `$label.mime_type` | MIME type dari file baru |
| `$label.size_bytes` | Ukuran file baru |
| `$label.download_url` | URL unduhan Drive untuk file baru |
| `$label.source_file` | Metadata dari file yang dikonversi |

## Contoh

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

Untuk input `name,age\nAda,36`, node di hilir mengakses baris yang telah di-parse melalui `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Mengonversi XML ke JSON:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

Untuk `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` adalah `{ "person": { "@id": "1", "name": "Ada" } }`. Untuk membuat XML, teruskan objek tersebut ke node Converter kedua dengan `conversion: "jsonToXml"`.

Membaca faktur hasil pemindaian yang diunggah melalui file upload trigger:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

Node [Agent](./agent-node.md) atau [LLM](./llm-node.md) di hilir kemudian dapat mengekstrak field terstruktur dari `$readInvoice.result`.

Mengubah laporan markdown dari agent menjadi PDF:

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

Node di hilir membaca `$convertDoc.download_url` untuk membagikan PDF, atau `$convertDoc.id` untuk terus mengolahnya di [Drive](./drive-node.md).

## Persyaratan

OCR memanggil `tesseract` dan `pdftoppm` dari poppler, dan konversi dokumen menggunakan pandoc. Ketiganya disertakan pada setiap cara menjalankan Heym, termasuk `run.sh`, docker-compose, dan single release image, sehingga tidak ada yang perlu dikonfigurasi. Batas halaman, timeout, dan DPI maksimum adalah nilai platform yang tetap, bukan pengaturan.

## Terkait

- [Set](./set-node.md) – Transformasi dan petakan field individual
- [JSON output mapper](./json-output-mapper-node.md) – Bangun objek respons JSON
- [File upload trigger](./file-upload-trigger-node.md) – Terima file ke Heym Drive
- [Drive](./drive-node.md) – Simpan, ambil, dan bagikan file
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Expression DSL](../reference/expression-dsl.md) – Fungsi dan sintaks
