# Output Grafik

Node **Chart Output** adalah node terminal dari workflow [widget dashboard](../tabs/dashboard-tab.md). Node ini mengambil baris yang dihasilkan oleh node-node upstream dan mengubahnya menjadi payload chart terstandardisasi yang dirender oleh dashboard.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 0 (terminal) |
| Output | Payload chart terstandardisasi |

Tempatkan node ini **terakhir** dalam workflow widget dashboard. Node sebelumnya harus menghasilkan array objek baris, misalnya:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Ketika Anda hanya memiliki data contoh/sampel (tanpa sumber nyata), hasilkan baris-baris ini dengan node **Set** menggunakan `$array(dict(...), dict(...))` — misalnya `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Jangan** gunakan `${...}` atau literal objek `{...}` polos; Heym hanya membangun objek dengan `dict(key=value)`.

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text`, atau `hitl` |
| `orientation` | string | `vertical` atau `horizontal` (hanya untuk bar chart) |
| `dataPath` | string | Jalur bertitik (dot path) ke array baris di dalam output upstream (misalnya `data` atau `result.items`). Biarkan kosong untuk deteksi otomatis. |
| `labelField` | string | Kunci baris yang digunakan sebagai label kategori (pie/bar/line) |
| `valueField` | string | Kunci baris yang digunakan sebagai nilai numerik (pie/bar/line/numeric/gauge) |
| `series` | array | Definisi multi-series opsional `[{ "name": "Sent", "field": "sent" }]` untuk bar/line (menimpa `valueField`) |
| `columns` | array | Daftar kolom opsional untuk `table` (default-nya adalah kunci dari baris pertama) |
| `xField` / `yField` | string | Kunci baris untuk sumbu X dan Y numerik (scatter) |
| `min` / `max` | number | Rentang numerik untuk `gauge` (default `0` / `100`) |
| `unit` | string | Unit opsional yang ditampilkan di samping nilai `numeric` atau `gauge` |
| `text` | string | Pesan Markdown untuk tipe chart `text`. Biarkan kosong dan setel `valueField` untuk merender pesan dinamis yang diambil dari data upstream. |
| `title` | string | Judul chart opsional |

## Tipe chart

- **bar / line / area / pie** — chart kategorikal yang digerakkan oleh `labelField` + `valueField` (atau `series` untuk bar/line/area multi-series). `area` adalah chart tren terisi.
- **table** — baris mentah yang dirender sebagai tabel yang dapat digulir menggunakan `columns`.
- **numeric** — satu nilai KPI dari baris pertama, dengan `unit` opsional.
- **gauge** — satu nilai yang ditampilkan terhadap rentang `min`–`max` (misalnya persentase). Menggunakan `valueField`.
- **scatter** — titik X/Y dari `xField` dan `yField` untuk plot korelasi.
- **proportion** — satu bar horizontal yang dibagi menjadi beberapa bagian dengan legenda persentase (misalnya rincian bahasa). Menggunakan `labelField` + `valueField`.
- **barGauge** — satu gauge horizontal per baris dengan gradien merah→hijau dan sebuah nilai (misalnya ruang disk kosong). Menggunakan `labelField` + `valueField`, `unit` opsional dan `max` (default-nya adalah nilai baris terbesar).
- **text** — pesan markdown (misalnya catatan status seperti "Last execution at 19:47"). Letakkan markdown di `text` untuk pesan statis, atau biarkan `text` kosong dan setel `valueField` untuk merender string yang dihasilkan upstream. Mendukung heading, bold/italic, [daftar](../nodes/chart-output-node.md#interactive-task-lists), tautan, dan inline code.
- **hitl** — carousel tinjauan manusia (human review) Anda yang tertunda. Header menampilkan `1/n pending`; panah kiri dinonaktifkan pada kartu pertama dan panah kanan pada kartu terakhir. Nama workflow membuka run tersebut di canvas. **Approve**, **Request changes**, dan **Reject** menyelesaikannya, dan ikon riwayat di samping judul widget membuka run tersebut di dialog riwayat pada halaman yang sama. Tipe chart ini mengabaikan baris upstream, sehingga workflow widget hanya berupa node Chart Output. Setiap orang yang masuk akan melihat tinjauan pada workflow yang mereka miliki.

### Daftar tugas interaktif

Gunakan sintaks daftar tugas markdown bergaya GitHub di bidang `text` statis:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Pada [Dashboard](../tabs/dashboard-tab.md), kotak centang dirender sebagai kontrol yang dapat diklik (ramah untuk mode gelap dan terang). Mengalihkan kotak centang akan memperbarui bidang `text` workflow widget dan tetap tersimpan setelah refresh.

**Pengeditan inline:** klik ganda label item tugas untuk mengeditnya di tempat. Tekan Enter atau klik di luar untuk menyimpan; tekan Escape untuk membatalkan. Kosongkan label sepenuhnya untuk menghapus item tersebut dari daftar.

**Tautan dalam item tugas:** ketika label berisi tautan markdown (`[title](url)`), mengklik tautan akan membuka URL tanpa mengalihkan kotak centang. Klik di tempat lain pada baris untuk mengalihkan.

**Hanya teks statis:** interaktivitas memerlukan sintaks daftar tugas GFM (`- [ ]` / `- [x]`). Pesan status dinamis biasa tanpa item tugas tetap hanya-baca. Ketika markdown berasal dari `valueField`, pengalihan pertama akan menyalinnya ke bidang `text` statis agar perubahan tetap tersimpan.
### Daftar bernomor

Widget teks merender markdown dengan **nomor baris eksplisit yang dipertahankan**. Awali setiap baris dengan nomor yang ingin ditampilkan (misalnya `9.`, `8.`, `7.`). Heym tidak menomori ulang baris untuk Anda.

**Mengapa nomor eksplisit?** Daftar berurutan markdown standar (`1.`, `2.`, `3.`) menjadi daftar HTML `<ol>`, yang hanya menghitung **naik** dari nomor pertama. Daftar yang ditulis sebagai `9.` / `8.` / `7.` akan ditampilkan sebagai `9`, `10`, `11` pada perender markdown biasa. Mengawali setiap baris dengan nomor yang dimaksud menghindari hal tersebut.

**Daftar menurun (misalnya terbaru lebih dulu):** bangun markdown dalam loop workflow dan hitung nomor tampilan per item:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Pola umum:

1. Ambil atau bangun array item (misalnya HTTP → `body.videos`).
2. [Loop](./loop-node.md) melalui array; di dalam body, gunakan [Variable](./variable-node.md) dengan `.add()` untuk menambahkan satu baris bernomor per iterasi.
3. Setelah cabang **done** dari loop, [Set](./set-node.md) `join("\n")` pada array yang terakumulasi (atau yang setara) menjadi satu string markdown.
4. Arahkan **Chart Output** `valueField` ke string tersebut (atau set `text` statis).

Contoh ekspresi baris di dalam loop (label `processVideos`, item dengan `title` dan `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown yang dihasilkan:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Untuk daftar menaik sederhana yang dimulai dari 1, awali setiap baris (`1.`, `2.`, `3.`) atau gunakan loop dengan `$loop.index + 1`. Gunakan [daftar bullet](#interactive-task-lists) (`- item`) ketika Anda tidak memerlukan nomor.

## Bagaimana data diselesaikan

1. Jika `dataPath` diatur, node mengikuti dot path tersebut ke output upstream.
2. Jika tidak, node mencari array: daftar tingkat atas, array `data`, atau field bernilai daftar pertama.
3. Untuk `table`, setiap baris menjadi baris tabel menggunakan `columns` (atau key dari baris pertama).
4. Untuk `numeric` dan `gauge`, nilai berasal dari `valueField` pada baris pertama (atau field numerik pertama).
5. Untuk `scatter`, setiap baris menjadi titik `[xField, yField]`.
6. Untuk `text`, pesan diambil dari `valueField` pada baris pertama jika diatur, jika tidak dari konfigurasi `text` statis (jika tidak, dari field string pertama pada baris pertama).

## Contoh

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (nilai tunggal vs. rentang):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (titik X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proporsi (satu bar yang dibagi berdasarkan porsi + legenda persentase):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (tren multi-seri yang terisi):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge gradien per baris dengan nilai):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (pesan markdown statis — tidak memerlukan baris upstream):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dinamis — string pesan dihasilkan upstream dan diambil melalui `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## Contoh prompt AI

Saat membuat widget dengan **AI**, prompt seperti berikut dapat dipetakan secara langsung ke setiap tipe:

- **Bar** — "Tampilkan pendapatan bulanan selama 6 bulan terakhir sebagai diagram batang vertikal dengan contoh data."
- **Line** — "Gambarkan pengguna aktif harian selama 14 hari terakhir sebagai diagram garis."
- **Area** — "Tampilkan penggunaan memori dan CPU selama 24 jam terakhir sebagai diagram area dengan dua seri. Gunakan contoh data."
- **Pie** — "Rincikan status eksekusi (sukses, error, dibatalkan) sebagai diagram pai."
- **Table** — "Tampilkan 10 Workflow teratas berdasarkan jumlah eksekusi sebagai tabel yang dapat digulir dengan kolom nama dan runs. Gunakan contoh data."
- **Numeric** — "Tampilkan total eksekusi Workflow hari ini sebagai satu KPI dengan unit 'runs'. Gunakan contoh data."
- **Gauge** — "Tampilkan penggunaan CPU saat ini sebagai gauge dari 0 hingga 100 persen."
- **Scatter** — "Gambarkan latensi permintaan versus ukuran payload sebagai diagram sebar dengan contoh data."
- **Proportion** — "Tampilkan bahasa yang paling banyak saya gunakan sebagai bar proporsi: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Gunakan contoh data."
- **Bar gauge** — "Tampilkan ruang disk kosong per volume (sda1 hingga sda7) sebagai bar gauge dalam GB. Gunakan contoh data."
- **Text** — "Tambahkan widget teks dengan daftar periksa markdown (satu item tercentang, dua tidak tercentang), atau daftarkan 5 video tutorial terbaru dalam urutan menurun (5. turun ke 1.) dengan tautan YouTube — awali setiap baris dengan angka eksplisit (`5. Judul`, `4. Judul`, …)."

## Terkait

- [Tab Dashboard](../tabs/dashboard-tab.md) — buat dan atur widget
- [Node output](output-node.md) — node terminal untuk Workflow reguler
