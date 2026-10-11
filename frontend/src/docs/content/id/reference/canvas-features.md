# Fitur Canvas

Editor Workflow menyediakan beberapa fitur untuk debugging, pengujian, dan pengorganisasian Node: **Run to Node**, **Data Pin**, **Execution Logs**, **Enable/Disable**, dan **Extract to Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Tonton demo Editor</a></p>

## Run to Node

Arahkan kursor ke Node mana pun kecuali sticky note, lalu klik **Run** di bawahnya. Heym akan mengeksekusi Node tersebut beserta dependensi hulu (upstream)-nya, tanpa mengubah Node hilir (downstream) dan cabang yang tidak terkait. Fitur ini menggunakan mode pengujian Canvas, termasuk output yang di-pin dan kondisi cabang normal Workflow.

Jika jalur yang dipilih memiliki kolom input, panel **Run** di sisi kanan akan terbuka dan memfokuskan kolom pertama. Masukkan nilai, lalu klik **Run to _node label_** atau tekan **Ctrl+Enter** (Cmd+Enter pada macOS). Mode body generik akan memfokuskan editor body JSON. Jalur tanpa kolom input akan langsung dijalankan tanpa membuka panel. Node Input yang di-pin akan menggunakan kembali output yang di-pin tanpa meminta input.

Panel akan mempertahankan target yang dipilih untuk eksekusi berikutnya. Pilih **Run full workflow** untuk menghapus target. Tombol Run dinonaktifkan saat eksekusi sedang berlangsung. Target di dalam loop akan menghentikan eksekusi saat Node tersebut pertama kali tercapai; memilih Node setelah loop akan menjalankan loop hulu secara lengkap.

## Data Pin

Data Pin memungkinkan Anda mem-pin output Node dari eksekusi terakhir sehingga Anda dapat menguji Node hilir tanpa mengeksekusi ulang Node yang di-pin.

### Lokasi

- **Panel Properties** – Pilih Node dan gulir ke bagian **Pinned Data**
- **Badge Node** – Ikon pin akan muncul pada Node saat data di-pin

### Tindakan

| Tindakan | Deskripsi |
|--------|-------------|
| **Pin** | Mem-pin output eksekusi terakhir Node (tersedia setelah eksekusi) |
| **Clear** | Menghapus data yang di-pin |
| **Edit** | Mengedit JSON yang di-pin secara langsung; klik Save untuk menerapkan |

### Perilaku Mode Pengujian

Saat menjalankan Workflow dalam mode pengujian, Node dengan `pinnedData` akan melewati eksekusi dan menggunakan output yang di-pin sebagai gantinya. Gunakan fitur ini untuk:

- Menguji logika hilir tanpa memanggil API eksternal
- Melakukan debugging ekspresi yang mereferensikan output Node
- Melakukan iterasi pada Prompt atau kondisi dengan data sampel yang tetap

Penyelesaian ekspresi di editor menggunakan data yang di-pin jika tersedia untuk menyarankan kolom.

## Execution Logs

**Panel Debug** (laci bawah) menampilkan log eksekusi secara real-time selama Workflow berjalan. Anda juga dapat membuka eksekusi produksi yang sedang berjalan dari dialog History atau kartu Board. Editor akan terhubung ke aliran SSE eksekusi tersebut, memulihkan hasil Node yang telah selesai, dan terus menampilkan animasi Node serta log saat Node baru mulai dan selesai.

### Yang Ditampilkan

- **Hasil Node** – Status per Node (`success`, `error`, `skipped`, `running`), waktu eksekusi, dan output
- **Output akhir** – Output teragregasi dari Node [Output](../nodes/output-node.md)
- **Progres Agent** – Untuk Node [Agent](../nodes/agent-node.md), panggilan tool dan penalaran langkah demi langkah

### Tindakan

- **Copy as JSON** – Menyalin log eksekusi lengkap ke clipboard
- **Open in JSON editor** – Membuka log di JSON Hero atau JSON Editor Online untuk inspeksi
- **Download generated files** – Jika sebuah skill menghasilkan file yang dapat diunduh (`_generated_files`), tombol Download akan muncul. File tunggal akan diunduh langsung; beberapa file akan membuka popup pemilihan.

### Perbedaan dengan Tab Logs

Panel Debug menampilkan log **eksekusi Workflow** (hasil Node, output). [Tab Logs](../tabs/logs-tab.md) menampilkan log **kontainer Docker** (backend, frontend, database). <!-- pragma: allowlist secret -->

## Enable / Disable

Anda dapat menonaktifkan Node sehingga dilewati selama eksekusi. Node yang dinonaktifkan akan menampilkan badge "off" dan tampak redup.

### Cara Mengaktifkan/Menonaktifkan

| Metode | Deskripsi |
|--------|-------------|
| **Panel Properties** | Pilih Node → Ikon Power (kanan atas) |
| **Menu konteks** | Klik kanan Node → Disable atau Enable |
| **Keyboard** | Pilih Node → tekan **D** (lihat [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Multi-Select

Saat beberapa Node dipilih, Enable/Disable akan diterapkan ke semuanya. Menu konteks menampilkan "Enable" jika ada Node yang dipilih dalam keadaan nonaktif, dan "Disable" jika semuanya aktif.

### Perilaku Runtime

Node dengan `active: false` akan dilewati. Node hilir tidak akan menerima data dari Node yang dilewati. Gunakan fitur ini untuk mengecualikan Node sementara tanpa menghapusnya.

Untuk mengaktifkan atau menonaktifkan Node dari dalam Workflow alih-alih secara manual, gunakan [Disable Node](../nodes/disable-node.md) dan [Enable Node](../nodes/enable-node.md).
## Graf memori Agent

Node [Agent](../nodes/agent-node.md) dengan **[memori persisten](./agent-persistent-memory.md)** yang diaktifkan menampilkan kontrol **brain** berwarna merah muda pada Node. Klik kontrol tersebut untuk membuka editor graf memori: entitas dirender sebagai graf teranimasi berbasis gaya (force-directed) yang dikelompokkan berdasarkan tipe entitas, dengan pemilih Source/Target yang dapat dicari untuk menambahkan relasi dan panel koneksi untuk berpindah antar entitas yang tertaut. Dialog yang sama menyertakan **Share memory with other agents** (Workflow → Agent → read atau read/write) untuk [berbagi memori antar-Agent](./agent-persistent-memory.md#sharing-with-other-agents). Selama dialog terbuka, undo/redo kanvas utama ditunda agar pengeditan graf menyimpan riwayatnya sendiri.

**Memfilter graf.** Di kiri atas kanvas terdapat kontrol pencarian, yang terlipat menjadi tombol pintasan hingga Anda mengkliknya atau menekan **Ctrl/Cmd+F**. Kontrol ini mencocokkan nama entitas, tipenya, serta setiap kunci dan nilai atributnya, juga tipe relasi (`parent_of`) beserta propertinya; relasi yang cocok akan membawa kedua entitasnya. Semua istilah yang dipisahkan spasi harus cocok. Entitas yang cocok akan membawa seluruh lingkungannya — setiap relasi yang melibatkannya dan entitas di sisi lain masing-masing relasi — sehingga hasil yang cocok tidak pernah dibiarkan sebagai titik yang tidak terhubung. Relasi yang cocok hanya membawa dua entitas yang dihubungkannya dan berhenti di situ, karena mencari tipe relasi adalah pertanyaan tentang relasi tersebut, bukan tentang segala hal yang terhubung pada ujung-ujungnya. Semua yang lain disembunyikan sepenuhnya — bukan diredupkan — pada kanvas dan dalam daftar **All edges**, dan sebuah lencana menunjukkan berapa banyak dari total entitas yang tersisa. Tombol **✕** di dalam kotak akan menghapus kueri terlebih dahulu, lalu menutup kotak pada penekanan kedua. Escape mengurai dengan urutan yang sama, dari yang paling dalam: menghapus kueri, lalu menutup kotak pencarian, lalu keluar dari tampilan kanvas yang diperluas, dan hanya menutup dialog setelah tidak ada satupun yang terbuka. Menghapus kueri akan memulihkan graf lengkap dengan setiap entitas kembali ke posisinya semula.

**Menempatkan entitas secara manual.** Menyeret entitas akan memakukannya di tempat Anda melepaskannya, sehingga tata letak otomatis menata sisa graf di sekitarnya alih-alih menariknya kembali. Menyeret entitas yang sedang Anda pilih akan memindahkan entitas yang terhubung langsung dengannya, mempertahankan bentuk klaster; menyeret entitas lain hanya memindahkan entitas tersebut. **Tidy layout** (tombol tongkat sihir) melepaskan setiap entitas yang dipakukan dan menjalankan ulang tata letak otomatis.

## Extract to Sub-Workflow

Mengonversi Node yang dipilih menjadi sub-Workflow yang dapat digunakan kembali dan menggantinya dengan Node [Execute](../nodes/execute-node.md).

### Cara Penggunaan

1. Pilih satu atau beberapa Node pada kanvas
2. Klik kanan → **Extract to Sub-Workflow**
3. Masukkan nama (dan deskripsi opsional) untuk Workflow baru
4. Klik **Extract**

### Yang Terjadi

- Workflow baru dibuat dengan Node yang dipilih
- Input eksternal (edge dari luar pilihan) menjadi field [Input](../nodes/input-node.md) sub-Workflow
- Output eksternal (edge ke Node di luar pilihan) dipetakan ke [Output](../nodes/output-node.md) sub-Workflow
- Node yang dipilih digantikan dengan satu Node [Execute](../nodes/execute-node.md) yang memanggil Workflow baru
- Pemetaan input/output dipertahankan secara otomatis

### Kasus Penggunaan

- Menggunakan kembali rangkaian Node di beberapa Workflow
- Menyederhanakan Workflow kompleks dengan mengelompokkan logika yang terkait
- Membuat sub-Workflow yang modular dan dapat diuji

## Run with cURL

Tombol **cURL** pada toolbar editor (kanan atas) membuka dialog untuk membuat dan menyalin perintah cURL guna memicu Workflow melalui API.

- Pilih mode request body Workflow (`Defined` atau `Generic`)
- Tetapkan tipe autentikasi (Anonymous, JWT, atau Header Auth)
- Konfigurasikan response caching dan rate limiting
- Aktifkan/nonaktifkan SSE streaming dan sesuaikan pesan mulai per-Node
- Edit request body
- Dalam mode Generic, panel run kanvas menggunakan raw JSON body yang sama dengan dialog cURL
- Klik **Copy cURL** untuk menyalin perintah yang siap dijalankan

Lihat [Webhooks](./webhooks.md#run-with-curl-dialog) untuk detail lengkap dialog dan [SSE Streaming](./sse-streaming.md) untuk protokol event.

## Terkait

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Semua pintasan kanvas dan editor
- [Agent Persistent Memory](./agent-persistent-memory.md) – Perilaku dan API graf memori
- [Execute Node](../nodes/execute-node.md) – Memanggil sub-Workflow
- [Expression DSL](./expression-dsl.md) – Referensi dan data yang dipakukan
- [Workflow Structure](./workflow-structure.md) – Format Node dan edge
- [Download & Import](./download-import.md) – Ekspor dan impor Workflow sebagai JSON
- [Node Types](./node-types.md) – Semua tipe Node
- [Logs Tab](../tabs/logs-tab.md) – Log kontainer Docker
- [Execution History](./execution-history.md) – Riwayat eksekusi
- [Templates](../tabs/templates-tab.md) – Simpan dan gunakan kembali Workflow dan Node
- [Contextual Showcase](./contextual-showcase.md) – Panduan halaman ringkas yang tersedia di editor
