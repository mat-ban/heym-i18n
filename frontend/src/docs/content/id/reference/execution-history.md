# Riwayat Eksekusi

Riwayat eksekusi mencatat setiap kali Workflow dijalankan: input, output, hasil per Node, status, dan sumber Trigger. Gunakan fitur ini untuk memantau eksekusi produksi yang sedang aktif, memeriksa eksekusi sebelumnya, men-debug kegagalan, atau menjalankan ulang dengan input yang sama melalui **Bring to Canvas**.

## Ikhtisar

Setiap eksekusi menyimpan:

| Field | Deskripsi |
|-------|-----------|
| **Inputs** | Request body atau input eksekusi (misalnya `text` untuk Node Input) |
| **Outputs** | Output tingkat Workflow |
| **Node results** | Output per Node, status, dan waktu eksekusi |
| **Status** | `success`, `error`, `pending`, `skipped`, atau `failed` (lihat [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Bagaimana eksekusi dipicu (lihat [Triggers](./triggers.md)) |

## Mengakses Riwayat

| Lokasi | Cakupan |
|--------|---------|
| Toolbar **Editor** | Hanya Workflow yang sedang dibuka |
| Header tampilan **Docs** | Hanya Workflow yang sedang dibuka |
| Header **Dashboard** (tab Chat) | Semua Workflow + eksekusi chat/assistant |
| Header tampilan **Evals** | Semua Workflow + eksekusi chat/assistant |

Klik tombol **History** (ikon jam) untuk membuka dialog.

## Riwayat Per-Workflow vs Semua Riwayat

- **Per-Workflow** (Editor, Docs): Menampilkan eksekusi untuk Workflow yang sedang Anda buka. Gunakan **Clear history** untuk menghapus eksekusi pada Workflow tersebut saja.
- **All History** (Dashboard, Evals): Menampilkan eksekusi di seluruh Workflow dan sesi chat/assistant. Cakupannya sesuai dengan akses Workflow: Workflow yang Anda miliki, Workflow yang dibagikan langsung kepada Anda, dan Workflow yang dibagikan kepada tim tempat Anda bergabung. Gunakan **Clear all history** untuk menghapus semua catatan yang Anda miliki. Riwayat untuk Workflow yang dibagikan akan tetap dipertahankan.

## Bring to Canvas

**Bring to Canvas** memuat input dan output Node dari eksekusi yang dipilih ke dalam Workflow saat ini.

### Apa yang dimuat

- **Inputs** → Panel input eksekusi (misalnya `text` untuk Node Input, atau field kustom)
- **Node results** → Panel hasil eksekusi menampilkan output sebelumnya per Node
- **Execution result** → Status, output, dan waktu dari eksekusi tersebut

### Perilaku berdasarkan konteks

- **Di Editor** (riwayat per-Workflow): Langsung diterapkan ke Workflow yang sedang dibuka dan menutup dialog.
- **Dari All History** (Dashboard/Evals): Berpindah ke editor Workflow, lalu menerapkan data saat editor selesai dimuat. Hanya tersedia untuk eksekusi Workflow—bukan untuk eksekusi chat/assistant.

### Deep link eksekusi

Membuka Workflow pada `/workflows/{workflowId}/{executionId}` secara otomatis memuat eksekusi tersebut ke canvas — sama seperti memilih eksekusi dan memilih **Bring to Canvas**. Ini memungkinkan eksekusi tertentu di masa lalu dibagikan sebagai URL. Jika eksekusi tidak ditemukan (id salah atau telah dihapus), editor akan kembali memuat Workflow biasa.

### Kasus penggunaan

- Menjalankan ulang Workflow dengan input yang sama
- Men-debug eksekusi yang gagal dengan memeriksa input dan output Node
- Membandingkan output antar eksekusi

## Tanya AI

Kedua dialog riwayat memiliki tombol **Tanya AI** (ikon kilau) di samping judulnya. Tombol ini membuka [tab Chat](../tabs/chat-tab.md#asking-about-a-run) dalam percakapan baru dengan workflow dan eksekusi yang dipilih terlampir sebagai chip yang dapat dilepas. Tanyakan mengapa eksekusi lambat, apa yang gagal, atau minta Chat memperbaiki workflow. Chat membaca eksekusi yang tepat itu, termasuk jejak dan kesalahan per node.

Dalam dialog All History, **Tanya AI** hanya muncul saat eksekusi workflow dipilih; eksekusi chat dan asisten tidak menampilkannya.

## Linimasa eksekusi

Dalam detail eksekusi, tombol **Linimasa** (ikon stopwatch) di samping **Perluas Semua** menukar daftar **Langkah** dengan linimasa span. Saat linimasa ditampilkan, tombol yang sama bertuliskan **Log**; klik untuk kembali ke daftar. Di All History tombol ini hanya muncul untuk eksekusi workflow. Linimasa menggambar bilah per node pada saat dimulai, sehingga Anda dapat melihat node mana yang memakan waktu berapa lama dan mana yang berjalan secara paralel. Arahkan kursor ke bilah untuk melihat durasinya; klik untuk membuka inspektur detail yang sama dengan [linimasa eksekusi](#execution-timeline-details) editor. Tampilan yang Anda pilih tetap aktif selama dialog terbuka.

Eksekusi yang direkam sebelum waktu mulai node disimpan disusun satu demi satu berdasarkan durasi.

## Execution Highlights

Setelah eksekusi langsung — atau setelah **Bring to Canvas** — popup **Execution Highlights** yang dapat ditutup akan muncul di **pojok kanan atas Canvas**. Ini adalah cara cepat untuk melihat *apa yang dihasilkan setiap Node*, ditampilkan dari atas ke bawah sesuai urutan eksekusi. Tutup dengan **✕**; popup akan muncul kembali pada eksekusi berikutnya.

### Apa yang ditampilkan

| Record | Sumber | Otomatis? |
|--------|--------|-----------|
| **Input** | Parameter input eksekusi (Node input/trigger) | Ya |
| **Output** | Hasil Node output — atau, jika tidak ada, pesan Node terakhir | Ya |
| **Agent / LLM** | Output setiap Node agent atau LLM | Ya |
| **Output** | Node lain yang mengaktifkan **Highlight Node Output** | Opsional |

Node yang sudah ditampilkan secara otomatis (input / output / terakhir / agent / llm) tidak akan muncul dua kali, meskipun Anda juga mengaktifkan toggle tersebut.

### Setiap record

- Menampilkan `Node — message…` dengan **250 karakter** pertama; klik baris untuk memperluas dan merender **pesan lengkap sebagai Markdown**, dengan tombol **Copy**.
- Node yang dijalankan beberapa kali (misalnya di dalam loop) menampilkan `Node (N)` dengan pemilih `‹ i / N ›` — pilih eksekusi mana yang ingin dilihat; pemilih setiap Node bersifat independen.

### Highlight Node Output

Setiap Node **kecuali Agent dan LLM** memiliki checkbox **Highlight Node Output** di panel propertinya (default nonaktif). Aktifkan untuk menambahkan output Node tersebut ke popup. Badge kecil ✦ akan muncul pada Node yang di-highlight di canvas. Dalam [workflow DSL](./expression-dsl.md), ini adalah field data Node `"highlight": true` (default `false`).

### Pada dashboard

Kartu widget Dashboard yang menjalankan Workflow menampilkan tombol ✦ **Execution highlights** di header kartu; klik untuk membuka popup yang sama untuk eksekusi widget tersebut, dengan output yang digambar oleh widget sebagai record yang ditonjolkan.
## Menjalankan Execution

Kedua dialog riwayat menampilkan **execution yang sedang berjalan** di bagian atas daftar, sebelum run yang telah lalu.

- Indikator berputar dan label **Running** muncul bersama waktu mulai
- Klik **Open live** untuk melampirkan editor ke run tersebut secara persis tanpa memulainya ulang
- Kanvas terlebih dahulu memulihkan Node yang telah selesai, lalu menerima
  event `node_start`, `node_complete`, dan event execution final melalui SSE
- Node saat ini berdenyut di kanvas, Node hilir mempertahankan animasi pending-nya, dan
  panel Debug menambahkan setiap hasil saat tiba—sama seperti run yang dimulai dari editor
- Klik **Cancel** untuk menghentikan execution segera
- Membatalkan dari dialog mana pun (Editor atau Dashboard) juga menutup aliran SSE aktif di setiap tab kanvas yang terbuka untuk Workflow tersebut, sehingga status editor direset dengan bersih
- Setelah pembatalan, entri yang berjalan menghilang pada refresh berikutnya; tekan **Refresh** untuk memperbarui daftar secara manual
- Jika Anda membatalkan run yang telah selesai, permintaan tersebut tidak melakukan apa pun (no-op)

URL live adalah `/workflows/{workflowId}/{executionId}`. Observer bersifat read-only: meninggalkan
editor hanya memutuskan tab browser tersebut dan tidak pernah menghentikan Workflow. Snapshot aktif
dibagikan melalui PostgreSQL, sehingga membuka run tetap berfungsi ketika Trigger dan permintaan editor
berada pada worker backend yang berbeda.

## Crash Recovery

Jika server dimulai ulang (deploy, restart container, atau crash) saat Workflow sedang berjalan, worker run tersebut berhenti di tengah eksekusi. Heym secara otomatis memulihkan run yang terinterupsi ini alih-alih membiarkannya tersangkut sebagai **Running**.

- Pada startup berikutnya, proses leader yang terpilih mendeteksi run yatim — secara instan untuk restart yang graceful, atau dalam ~60 detik untuk crash keras (setelah heartbeat benar-benar berhenti).
- Run yang dipulihkan **dijalankan ulang dari awal dengan input yang sama** (bukan dilanjutkan dari tempat berhentinya), menggunakan definisi Workflow saat ini. Setelah selesai, run mencatat entri terminal normal (misalnya `success`), sehingga riwayat menampilkan run sebagai selesai.
- Sebuah run dicoba ulang **satu kali**. Jika upaya pemulihan juga terinterupsi — atau Workflow telah dihapus — entri dicatat sebagai `failed`.
- Ini bekerja sama baik pada deployment container tunggal maupun multi-worker; hanya leader yang melakukan pemulihan, sehingga sebuah run tidak pernah dipulihkan dua kali oleh worker yang berbeda.

### Toggle Auto-recover

Panel **Execution Log** (run) di editor memiliki checkbox **Auto-recover**, **aktif secara default** per Workflow.

- **On**: run yang terinterupsi dari Workflow ini dijalankan ulang seperti dijelaskan di atas.
- **Off**: run yang terinterupsi tidak dijalankan ulang dan dicatat dengan status `skipped`.

> Run sub-workflow tidak dipulihkan secara independen — mereka dikendalikan ulang oleh run induknya yang dipulihkan. Trigger dengan pengiriman ulang sendiri (RabbitMQ, scheduled/cron, IMAP) juga dapat mengirim ulang saat restart, sehingga run yang dipulihkan terkadang dapat dieksekusi dua kali.

## Pending Human Review

Run yang berhenti sementara untuk persetujuan [Human-in-the-Loop](./human-in-the-loop.md) langsung ditulis ke riwayat dengan status `pending`.

- Node agent yang pending menyimpan payload review yang mencakup `reviewUrl`, `draftText`, dan `expiresAt`
- Node apa pun yang terhubung ke handle `review` milik agent juga dapat berjalan sebelum manusia merespons, dan hasil Node-nya disimpan dalam entri riwayat pending yang sama
- Dialog riwayat menampilkan tautan review sehingga pemilik dapat menyalin atau membukanya
- Dialog riwayat dan panel Debug editor menampilkan keputusan manusia final setelah run dilanjutkan
- Ketika reviewer menerima, mengedit, atau menolak draft, entri riwayat yang sama diperbarui dengan hasil execution final
- Jika run yang sama berhenti sementara untuk HITL lebih dari sekali, entri riwayat tetap sama sementara setiap checkpoint mendapatkan tautan review sekali pakai miliknya sendiri

Ini sangat berguna untuk run portal dan Workflow berumur panjang yang mungkin menunggu berjam-jam atau berhari-hari sebelum melanjutkan.

## Copy

Gunakan **Copy** di samping Inputs atau Outputs untuk menyalin JSON ke clipboard.

## Clear History

- **Per-workflow**: Di dialog riwayat Editor, klik **Clear history** untuk menghapus run untuk Workflow saat ini.
- **All History**: Di dialog riwayat Dashboard/Evals, klik **Clear all history** untuk menghapus semua catatan execution yang Anda miliki. Run dari Workflow yang dibagikan tetap dipertahankan. Tindakan ini tidak dapat dibatalkan.

## Detail timeline execution

Ketika **Execution Log** editor terbuka, klik tombol timer untuk menampilkan timeline execution. Pilih sebuah span untuk membuka inspector detail inline yang mengambil alih area baris. Inspector menampilkan status langkah yang dipilih, durasi, jumlah percobaan, informasi retry, error, trace ID, dan pratinjau output yang ringkas. Output objek dan array menggunakan viewer `JsonTree` yang sama seperti bagian lain dari panel Debug; nilai skalar menggunakan pratinjau teks. Ketika sebuah langkah menghasilkan gambar (tangkapan layar Playwright, gambar yang dihasilkan, file gambar, atau gambar base64 dalam isi permintaan, yang ditemukan di mana saja dalam output), gambar tersebut muncul sebagai thumbnail di atas output, dan JSON menampilkan placeholder singkat sebagai pengganti base64 mentah. Klik thumbnail untuk membukanya di lightbox; tombol panah atau tombol ←/→ menelusuri setiap gambar dalam run, dengan penghitung seperti `2 / 5`. Gunakan **Open trace** untuk span LLM dan Agent ketika trace ID tersedia.
## Detail node seluler

Pada ponsel, editor menampilkan pohon Workflow layar penuh alih-alih kanvas bebas. Ketuk Node pohon yang memiliki hasil terekam untuk membuka eksekusinya sebagai detail layar penuh. Tampilan ini menyediakan tab **Input Data**, **Output Data**, dan **Errors** yang terpisah. Tab output menampilkan hasil yang terekam dan menyediakan **Copy Output**; tab input menampilkan konfigurasi Node yang dipilih, dan tab errors menampilkan error yang terekam saat Node gagal. Gunakan **Back to workflow** atau tombol tutup untuk kembali ke pohon.

Dialog riwayat kanvas dan dasbor tetap menempatkan kontrol eksekusinya dalam satu baris dan menempatkan filter tag serta instance yang tersedia dalam grid responsif. Menu filternya menggunakan pemilih dalam aplikasi yang sama, sehingga tanda centang yang dipilih memiliki gutter dan baseline yang konsisten dengan setiap label opsi.

## Terkait

- [Trigger](./triggers.md) – Bagaimana Workflow dimulai; riwayat mencatat `trigger_source` (termasuk `board` untuk eksekusi yang dimulai oleh perpindahan kartu [Board](../tabs/board-tab.md) dan tindak lanjutnya)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL peninjauan yang tertunda dan perilaku resume
- [Edit History](./edit-history.md) – Kontrol versi untuk penyimpanan Workflow (revert, diff)
- [Quick Start](../getting-started/quick-start.md) – Bangun dan jalankan Workflow pertama Anda
- [Workflows Tab](../tabs/workflows-tab.md) – Buat dan kelola Workflow
