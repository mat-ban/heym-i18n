# Tab Workflows

Tab **Workflows** adalah tampilan dasbor default. Tab ini menampilkan daftar workflow Anda, struktur folder, dan memungkinkan Anda membuat, mengedit, serta mengatur workflow.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Tonton demo Workflows</a></p>

## Mulai Chat

Di atas daftar workflow terdapat kotak chat yang menyapa Anda dengan nama dan menanyakan apa yang ingin Anda otomatiskan. Ketikkan prompt, secara opsional lampirkan satu file, lalu pilih credential dan model yang Anda inginkan. Kedua dropdown dapat dicari dan dimulai dari [default AI](../reference/user-settings.md) Anda.

Mengirim akan membuat percakapan baru dan membukanya di [tab Chat](./chat-tab.md), tempat balasan di-streaming. Lampiran yang didukung adalah file teks, gambar, dan PDF, satu per pesan, sama seperti composer chat.

Jika Anda belum memiliki credential LLM, kotak tersebut menampilkan tautan ke [tab Credentials](./credentials-tab.md) dan pengiriman tetap dinonaktifkan.

Klik **x** untuk menyembunyikan kotak. Tombol **Ask AI** kemudian muncul di samping judul Workflows dan memunculkannya kembali. Pilihan ini diingat di browser Anda.

## Daftar Workflow

Daftar ini adalah tampilan dua panel: workflow dan folder di sebelah kiri, pratinjau workflow yang dipilih di sebelah kanan.

- Setiap baris menampilkan ikon workflow, nama, deskripsi, waktu pembaruan terakhir, dan [chip status](#workflow-status)
- Workflow dapat berada di root atau di dalam folder, dan workflow yang di-pin muncul di grup **Pinned** tersendiri di bagian atas
- **Klik** sebuah baris untuk memilihnya dan memuat pratinjaunya di sebelah kanan
- **Klik ganda** sebuah baris, atau tekan **Enter** saat baris tersebut dalam fokus, untuk membukanya di [editor](../getting-started/quick-start.md)
- Gunakan **Ctrl+klik** (atau **Cmd+klik**) untuk membuka di tab baru
- Setiap baris memiliki aksi edit, salin, pin, dan hapus di sebelah kanan. Di ponsel, aksi tersebut disembunyikan agar nama tetap memenuhi lebar penuh; **tekan lama** sebuah baris di sana untuk membuka sheet aksi
- Pin workflow yang sering digunakan di [Quick Drawer](../reference/quick-drawer.md) agar Anda dapat menjalankannya dengan cepat dari tab Workflows dan halaman internal lainnya

## Pratinjau Workflow

Memilih workflow akan mengisi panel pratinjau di samping daftar. Pada layar yang lebih sempit dari 1280px, panel yang sama terbuka sebagai sheet dari bagian bawah layar.

Panel menampilkan:

- Nama workflow, siapa yang membuatnya dan kapan, serta kapan terakhir diedit
- **Open Workflow** – membuka workflow di editor
- **Run Now** – membuka workflow di [Quick Drawer](../reference/quick-drawer.md), tempat Anda mengisi input-nya dan memulai eksekusi tanpa meninggalkan daftar
- **Description** – deskripsi workflow
- **Trigger Configuration** – jadwal untuk workflow cron, atau trigger pendengar untuk workflow event. Workflow yang dipanggil melalui HTTP menampilkan tombol **Copy cURL** alih-alih endpoint mentah dan penjelasan auth: tombol ini menyalin permintaan lengkap dengan URL yang tepat, header, placeholder auth, dan body yang dibangun dari field input workflow. Ketika workflow mempublikasikan [portal](../reference/portal.md), tautan chat publiknya juga muncul di sini
- **Last Run Details** – hasil dan durasi eksekusi terbaru, atau catatan bahwa workflow belum pernah dijalankan
- **Workflow Steps & Sub-agents** – Node dalam urutan eksekusi, masing-masing dengan model, operasi, atau jadwalnya dan titik yang menunjukkan apakah Node tersebut aktif. Memilih sebuah langkah akan membuka Node tersebut di editor dengan panel propertinya sudah terbuka

Panel tetap ter-pin di samping daftar saat Anda menggulir, sehingga tetap terbaca dalam daftar workflow yang panjang.
## Administrasi Instance

Akun yang terdaftar dalam `HEYM_ADMIN_EMAILS` dapat menampilkan, membuka, mengedit, memeriksa riwayat eksekusi, dan menghapus Workflow apa pun pada instance tanpa perlu berbagi atau pengalihan kepemilikan. Pengaturan ini berupa daftar alamat email yang dipisahkan koma, dicocokkan tanpa membedakan huruf besar/kecil. Daftar kosong tidak memberikan akses ini kepada siapa pun. Mulai ulang backend setelah mengubahnya.

Administrator dapat melihat email pemilik pada daftar Workflow dan dapat mencari berdasarkan alamat tersebut. Pilih sebuah Workflow untuk membuka **Administrasi instance** pada pratinjaunya:

1. **Jeda Trigger** hanya ditampilkan untuk Workflow yang berisi Node Cron. Tindakan ini menonaktifkan Cron Workflow dan Node Trigger otomatis lainnya melalui penyimpanan berversi yang normal. Proses yang sedang berjalan dapat diselesaikan. Pemanggilan manual, API, portal, dan sub-workflow tetap tersedia; tindakan ini bukan penguncian eksekusi menyeluruh pada Workflow.
2. Tombol berubah menjadi **Lanjutkan Trigger** selama dijeda, termasuk setelah halaman dimuat ulang. Lanjutkan akan mengaktifkan kembali Trigger yang dijeda oleh administrator dan membiarkan Trigger yang sudah dinonaktifkan sebelumnya tetap tidak berubah. Untuk Workflow lama yang dijeda tanpa status jeda admin yang tersimpan, Lanjutkan akan mengaktifkan Trigger otomatisnya.
3. Gunakan tindakan **Hapus Workflow** pada baris Workflow setelah semua proses selesai. Penghapusan akan mengembalikan konflik selama masih ada pekerjaan yang sedang berjalan, dalam antrean, atau menunggu peninjauan. Penjadwalan penghapusan menerapkan pemeriksaan yang sama.

Jeda Trigger dan biarkan proses yang sedang berjalan selesai sebelum menghapus. Trigger yang sudah dikirim saat dijeda masih dapat diselesaikan. Gunakan penghapusan ketika Workflow tidak boleh lagi dipanggil.

Rahasia Webhook dan pengaturan autentikasi yang hanya untuk pemilik tetap mempertahankan perlindungan yang ada. Administrasi tidak mengalihkan kepemilikan atau membagikan catatan kredensial pemilik. Tindakan jeda, lanjutkan, penghapusan, dan penjadwalan administratif muncul pada [audit trail](../reference/audit.md) beserta administrator yang bertindak dan pemilik Workflow.

## Status Workflow

Setiap baris memiliki chip status yang berasal dari Node Trigger Workflow, status proses aktifnya,
dan — untuk Workflow tanpa Node Trigger — bagaimana proses terakhirnya dimulai:

| Status | Arti |
| --- | --- |
| **Running** | Workflow sedang memiliki eksekusi yang berlangsung saat ini |
| **Scheduled** | Workflow memiliki Trigger [cron](../nodes/cron-node.md) yang aktif |
| **Listening** | Workflow memiliki Trigger peristiwa yang aktif, seperti Trigger Slack, Telegram, IMAP, atau WebSocket |
| **Paused** | Workflow memiliki Node Trigger, tetapi semuanya dinonaktifkan |
| **API** | Workflow tidak memiliki Node Trigger dan terakhir dijalankan oleh panggilan HTTP ke endpoint eksekusinya |
| **SubWorker** | Workflow tidak memiliki Node Trigger dan terakhir dijalankan sebagai sub-workflow oleh Workflow induk |
| **Portal** | Workflow tidak memiliki Node Trigger dan terakhir dijalankan dari [portal](../reference/portal.md) miliknya |
| **WEB** | Workflow tidak memiliki Node Trigger dan terminal satu-satunya adalah [HTML output mapper](../nodes/html-output-mapper-node.md), sehingga pemanggilannya mengembalikan halaman web yang dirender |
| **Manual** | Workflow tidak memiliki Node Trigger dan belum pernah dijalankan, atau proses terakhirnya berasal dari tempat lain |
| **Remove Scheduled** | Workflow [dijadwalkan untuk dihapus](../reference/workflow-organization.md) |

Chip API, SubWorker, dan Portal membaca satu entri paling baru pada
[riwayat eksekusi](./logs-tab.md) Workflow, sehingga Workflow yang dipanggil melalui dua cara akan menampilkan cara yang terakhir. **WEB** ditentukan dari graf, sehingga lebih diutamakan daripada ketiganya: Workflow penyedia halaman akan terbaca WEB bahkan setelah dipanggil melalui HTTP. Node Trigger selalu lebih diutamakan daripada semuanya: Workflow cron yang juga dipanggil seseorang melalui HTTP tetap berstatus **Scheduled**.

Gunakan dropdown **Status** di samping kolom pencarian untuk menampilkan hanya satu status. Dropdown mencantumkan berapa banyak Workflow yang saat ini cocok dengan masing-masing status. Filter status juga menjangkau ke dalam folder: folder yang memiliki kecocokan akan diperluas secara otomatis, dan folder tanpa kecocokan disembunyikan hingga Anda menghapus filter.

## Workflow Aktif

Pada desktop, lencana melingkar di toolbar atas menunjukkan berapa banyak Workflow yang saat ini
sedang berjalan dan diperbarui secara otomatis setiap 10 detik. Klik lencana yang tidak bernilai nol untuk membuka daftar
Workflow aktif, yang menampilkan hingga empat baris sebelum dapat digulir. Pilih nama Workflow untuk melampirkan
editor ke tampilan langsung proses tersebut. Lencana nol bersifat informasional dan tidak dapat dibuka, serta
lencana disembunyikan pada layar seluler.

## Pencarian

Gunakan kolom pencarian Workflow di samping **Status**, atau tekan **Ctrl+F** (atau **Cmd+F**), untuk memfilter Workflow berdasarkan judul atau deskripsi. Workflow yang cocok di dalam folder ditampilkan dengan cabang foldernya diperluas. Tekan **Escape** untuk menghapus pencarian.
## Folder

- Atur workflow ke dalam [folder dan sub-folder](../reference/workflow-organization.md)
- Buat folder dengan tombol **New Folder**, beri nama setiap folder dan deskripsi opsional yang ditampilkan di bawah namanya dalam daftar
- Setiap baris folder menampilkan jumlah workflow yang disimpan, termasuk sub-folder, beserta aksi new-subfolder, rename, change-icon, download-as-ZIP, dan delete. Pada ponsel, baris menampilkan satu tombol menu
- Seret workflow ke atas folder atau sub-folder untuk melihat pratinjau tujuan seukuran kartu. Pratinjau
  yang disorot menampilkan jalur folder lengkap sebelum Anda melepas, dan mengarahkan kursor ke folder
  yang terlipat akan memperluasnya sebentar sehingga Anda dapat menjangkau folder bertingkat.
- Seret workflow antar folder atau ke root. Kartu yang diseret tetap terlihat sebagai ghost,
  dan tujuan aktif tetap disorot saat Anda menggulir.
- Melepas workflow kembali ke folder saat ini dinonaktifkan dan ditandai **Already in Folder**.
- Ganti nama folder, atau ubah deskripsinya, dari aksi rename atau menu konteks klik kanan

## Membuat Workflow

1. Klik **New Workflow**
2. Masukkan nama dan deskripsi opsional
3. Workflow terbuka di editor

## Import

Seret dan lepas file workflow JSON ke area workflow untuk membuat workflow baru. Node dan edge yang diimpor digunakan untuk membuat workflow; nama diambil dari field `name` dalam JSON atau nama file. Lihat [Download & Import](../reference/download-import.md) untuk format JSON dan opsi import.

## Sharing

Buka workflow di editor dan klik **Share** untuk mengundang pengguna melalui email atau berbagi dengan [tim](./teams-tab.md). Pilih **Read** (lihat dan jalankan) atau **Write** (juga dapat mengedit) untuk setiap pengguna atau tim, dan ubah nanti dari dropdown di samping entri. Credential dan sub-workflow tidak dibagikan secara otomatis; bagikan secara terpisah dengan pengguna atau tim yang sama. Lihat [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) dan [Credentials Sharing](../reference/credentials-sharing.md).

## Mengedit dan Menghapus

- **Edit** – Ubah nama dan deskripsi workflow dari aksi edit pada baris
- **Delete** – Workflow [dijadwalkan untuk dihapus](../reference/workflow-organization.md); workflow dipindahkan ke area trash sebelum penghapusan permanen

## Pengeditan Bersamaan

Saat menyimpan, revisi yang menjadi dasar pengeditan Anda akan dikirim, dan server menolak penulisan jika workflow berubah di sementara itu — misalnya karena rekan tim menyimpannya, atau Anda membiarkan workflow yang sama terbuka di tab kedua. Heym kemudian menampilkan dialog **Stale Workflow Detected** dengan dua pilihan:

- **Cancel** – Menyimpan perubahan Anda yang belum disimpan di editor sehingga Anda dapat memuat ulang di tab lain dan merekonsiliasinya
- **Override** – Tetap menyimpan, menggantikan versi orang lain

**Menjalankan** workflow akan menyimpannya terlebih dahulu, sehingga melewati pemeriksaan yang sama. Jika workflow berubah di bawah Anda, proses run berhenti pada dialog alih-alih menimpa secara diam-diam: **Override and Run** menyimpan versi Anda dan memulai run, **Cancel Run** membatalkan keduanya dan membiarkan pengeditan Anda tidak tersentuh.

Pemeriksaan ini merupakan bagian dari permintaan penyimpanan itu sendiri, sehingga tidak memerlukan round trip tambahan dan tidak ada jendela waktu di mana penyimpanan dapat lolos dari pemeriksaan. Perubahan Anda sendiri dari bagian lain aplikasi — rename, perubahan pengaturan, toggle properties-panel — tidak pernah dianggap sebagai konflik.

## Command Palette

Tekan **Ctrl+K** (atau **Cmd+K**) untuk membuka command palette. Anda dapat:
- Mencari workflow berdasarkan nama
- Melompat ke [tab dashboard](./credentials-tab.md) mana pun
- Membuka workflow terbaru

## Terkait

- [Quick Start](../getting-started/quick-start.md) – Bangun workflow pertama Anda
- [Workflow Organization](../reference/workflow-organization.md) – Folder, sub-folder, dan penghapusan terjadwal
- [Workflow Structure](../reference/workflow-structure.md) – Format JSON untuk workflow
- [Download & Import](../reference/download-import.md) – Ekspor dan impor workflow sebagai JSON
- [Portal](../reference/portal.md) – Tampilkan workflow sebagai UI chat publik
- [Board](./board-tab.md) – Jalankan workflow dari kartu kanban melalui column chain
- [Core Concepts](../getting-started/core-concepts.md) – Workflow, node, dan eksekusi
- [Execution History](../reference/execution-history.md) – Lihat run sebelumnya dan Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Pin dan jalankan workflow dari dashboard, docs, dan halaman non-editor lainnya
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman singkat untuk permukaan dashboard
