# Pintasan Papan Ketik

Heym menyediakan pintasan keyboard di seluruh editor workflow dan kanvas untuk mempercepat tindakan umum.

## Pintasan Editor Global

Pintasan ini aktif di mana saja dalam editor workflow.

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Buka Command Palette |
| `Ctrl + I` / `Cmd + I` | Alihkan panel [AI Assistant](./ai-assistant.md) (berfungsi saat mengetik) |
| `Ctrl + Enter` / `Cmd + Enter` | Jalankan workflow saat ini |
| `Ctrl + S` / `Cmd + S` | Simpan workflow |
| `Ctrl + Z` / `Cmd + Z` | Urungkan |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Ulangi |
| `Ctrl + Y` / `Cmd + Y` | Ulangi (alternatif) |
| `Escape` | Tutup overlay, dialog, dan panel yang terbuka |

## Pintasan Kanvas

Pintasan ini berlaku saat kanvas dalam keadaan fokus (tidak ada input teks yang aktif).

### Pemilihan & Navigasi

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Pilih semua node |
| `Shift` (tahan) | Seret untuk memilih beberapa node |
| `Ctrl` / `Cmd` (tahan) | Klik untuk menambahkan node individual ke pemilihan |
| `Escape` | Batalkan pemilihan semua node; tutup pencarian node inline |

### Mengedit Node

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Salin node yang dipilih |
| `Ctrl + X` / `Cmd + X` | Potong node yang dipilih |
| `Ctrl + V` / `Cmd + V` | Tempel node |
| `Delete` atau `Backspace` | Hapus node dan/atau edge yang dipilih |
| `D` | Alihkan node yang dipilih aktif / nonaktif |
| `P` | Alihkan data yang dipin pada node yang dipilih |

### Pencarian Node Inline

Mengetik karakter apa pun yang dapat dicetak pada kanvas (saat tidak ada input teks yang difokuskan) akan membuka popup pencarian node inline. Karakter yang diketik menjadi karakter pertama dari kueri pencarian.

| Pintasan | Tindakan |
|----------|--------|
| Karakter apa pun yang dapat dicetak | Buka pencarian node inline dan mulai mengetik |
| `Backspace` | Hapus karakter terakhir dari kueri pencarian |
| `Escape` | Tutup pencarian node inline |

## Command Palette (`Ctrl + K`)

Command Palette tersedia dari tampilan editor, dashboard, docs, dan evals. Fitur ini memungkinkan Anda menavigasi ke workflow, tab, dan halaman dokumentasi dengan cepat tanpa meninggalkan keyboard.

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Buka Command Palette |
| `↑` / `↓` | Navigasi daftar hasil |
| `Tab` / `Shift + Tab` | Navigasi daftar hasil |
| `Enter` | Buka item yang dipilih |
| `Escape` | Tutup palette |

## Pintasan Dashboard

Pintasan ini aktif pada tab Workflows saat tidak ada input teks lain yang aktif.

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Fokuskan pencarian workflow |
| `Escape` | Hapus pencarian workflow saat berisi teks |

## Pintasan Panel Properti

Pintasan ini aktif saat sebuah node dipilih dan panel properti terbuka.

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Buka sub-workflow yang tertaut di tab baru (hanya node Execute) |

## Pintasan Dialog Evaluate

Pintasan ini aktif saat dialog Evaluate terbuka.

| Pintasan | Tindakan |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Terapkan ekspresi dan tutup dialog |
| `Ctrl + Z` / `Cmd + Z` | Urungkan perubahan di editor ekspresi |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Ulangi perubahan di editor ekspresi |
| `Ctrl + Y` / `Cmd + Y` | Ulangi perubahan di editor ekspresi (alternatif) |

## Pintasan Riwayat & Trace

Pintasan ini tersedia di dialog Execution History dan panel Traces.

| Pintasan | Tindakan |
|----------|--------|
| `S` | Alihkan input pencarian untuk memfilter entri |

## Terkait

- [Fitur Kanvas](./canvas-features.md) – Data pin, aktifkan/nonaktifkan, ekstrak ke sub-workflow
- [Struktur Workflow](./workflow-structure.md) – Format node dan edge
- [Node Execute](../nodes/execute-node.md) – Memanggil sub-workflow (`Ctrl + Shift + O`)
- [Mulai Cepat](../getting-started/quick-start.md) – Bangun workflow pertama Anda
