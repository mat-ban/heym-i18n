# Tab MCP / A2A / A2A

Tab **MCP** mengonfigurasi integrasi Model Context Protocol (MCP), dan sebagai server [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) yang dapat didelegasikan tugas oleh agen lain. MCP memungkinkan klien AI (Claude, ChatGPT, Gemini, Cursor, dan alat apa pun yang kompatibel dengan MCP) memanggil Workflow Heym Anda sebagai tools.

Heym mendukung dua mode: **server default** yang mengekspos semua Workflow dengan MCP aktif di bawah satu Endpoint, dan **server bernama** yang memberikan setiap grup Workflow logis URL khusus dan API Key tersendiri.

Kedua mode dapat mengekspos dua jenis tools: **Workflow** individual, dan **Heym chat tool** — seluruh mesin [Tab Chat](./chat-tab.md) di balik satu tool `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Tonton demo MCP</a></p>

## Server MCP Default

Server default selalu tersedia di `{origin}/api/mcp/sse`. Semua Workflow dengan MCP yang diaktifkan akan muncul sebagai tools di sini.

### API Key MCP

- Key disimpan sebagai digest SHA-256, sehingga Heym tidak dapat menampilkan key yang sudah ada. Tab ini melaporkan apakah key sudah diatur, bukan nilai key tersebut.
- **Generate** / **Regenerate** – Key baru ditampilkan satu kali, tepat setelah Anda membuatnya. Salin saat itu juga; memuat ulang tab akan menyembunyikannya secara permanen.
- Gunakan key ini saat menghubungkan Claude Desktop, Cursor, atau klien MCP lain ke Heym
- Kehilangan key? Regenerate key tersebut. Key sebelumnya langsung berhenti berfungsi.

### Metode Koneksi

- **API Key** – Gunakan API Key MCP untuk koneksi programatik. Tab ini dapat menyalin konfigurasi JSON yang siap pakai dan menyertakan tombol **Add to Cursor** untuk penyiapan Cursor sekali klik.
- **Claude** – Tab ini menampilkan URL server MCP dan langkah-langkah penyiapan untuk Claude. Biarkan OAuth Client ID dan Secret kosong; Claude mendaftar secara otomatis dan melakukan autentikasi melalui OAuth Heym.
- **ChatGPT** – Tab ini menampilkan URL server MCP dan langkah-langkah penyiapan untuk aplikasi ChatGPT. Aktifkan mode Pengembang (Developer mode), buat aplikasi dengan URL tersebut, lalu pilih OAuth; ChatGPT akan mendaftar secara otomatis.
- **Gemini** – Tab ini menampilkan URL server MCP dan langkah-langkah penyiapan untuk aplikasi kustom Gemini: di gemini.google.com, buka **Settings → Connected Apps → Add a custom app**, tempelkan URL, dan biarkan **Advanced features** tertutup; Gemini akan mendaftar secara otomatis dan melakukan autentikasi melalui Heym OAuth. Setelah terhubung, Heym juga berfungsi di aplikasi seluler Gemini.

### Toggle MCP Workflow

Setiap Workflow dapat diekspos sebagai tool MCP:

- **Enable** – Tools Workflow menjadi tersedia untuk semua klien yang terhubung ke server default
- **Disable** – Workflow tidak diekspos

Kartu Workflow menampilkan deskripsi dan pratinjau nama field input sehingga Anda dapat melihat apa yang diharapkan oleh setiap tool sebelum mengaktifkannya.


### Eksekusi dalam antrean dan heym_execution_status

Workflow dengan [batas konkurensi](../reference/webhooks.md#concurrency-limit-and-queued-runs) mungkin sedang sibuk saat klien memanggilnya. Panggilan kemudian segera mengembalikan hasil yang bukan merupakan kesalahan:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Klien melakukan polling pada alat `heym_execution_status` dengan `execution_id` tersebut. Ini mengembalikan isi yang sama dengan [URL status](../reference/webhooks.md#status-url): `queued` dengan posisi saat ini, `running`, lalu `success` atau `error` beserta keluarannya. Ini hanya menemukan eksekusi workflow yang diekspos oleh server yang sama. Alat ini terdaftar di server default dan di setiap server bernama hanya selama setidaknya satu workflow memiliki batas konkurensi. Saat antrean penuh, panggilan mengembalikan kesalahan "Concurrency queue is full".
## Agen Heym

Bagian **Heym Capabilities** mengubah mesin Tab Chat menjadi satu tool MCP bernama `heym_chat`. Aktifkan pada server default, pada server bernama mana pun, atau pada keduanya — setiap permukaan menyimpan toggle dan pemilihan modelnya sendiri.

Saat aktif, `heym_chat` muncul di `tools/list` bersama tools Workflow Anda. Klien MCP mengirimkan satu pesan bahasa alami dan mesin Heym menanganinya, dengan kemampuan yang sama seperti Tab Chat:

- Membangun Workflow, melakukan uji jalan dengan input sampel, memperbaikinya, dan menyelesaikan saat eksekusi berhasil (lihat [Mode Build](#build-mode))
- Memeriksa dan menjalankan Workflow Anda yang sudah ada
- Melaporkan analitik, eksekusi terbaru, dan jadwal Cron yang akan datang
- Menjelaskan di mana workflow gagal dan mengapa lambat: workflow yang paling sering dijalankan, paling sering gagal, dan paling lambat, serta jenis node dengan waktu, kesalahan, dan panggilan terbanyak selama 1, 3, atau 6 jam, 24 jam, 7 atau 30 hari terakhir, atau sepanjang waktu
- Melaporkan riwayat eksekusi satu Workflow: berapa kali dijalankan, jumlah status, kapan dijalankan, dan atas permintaan input, output, serta error per-Node dari satu eksekusi
- Melaporkan apa yang sedang berjalan saat ini: berapa banyak eksekusi aktif, nama Workflow-nya, berapa lama masing-masing berjalan, Node yang sedang dijalani, dan tautan ke eksekusi langsung
- Menampilkan daftar board, membuat card, dan membaca detail card pada [Tab Board](./board-tab.md)
- Mencantumkan dashboard Anda (halaman Heym Work) dan widget-nya, menemukan di dashboard mana workflow berada, menambahkan widget baru dan membangun workflow-nya, menempatkan workflow yang ada sebagai widget, mengganti nama atau menghapus widget, atau merapikan tata letak (lihat [Dashboard › Dari Chat dan MCP](./dashboard-tab.md#from-chat-and-mcp))
- Memeriksa tabel data dan baris, membuat tabel, menambah atau menghapus kolom, menyisipkan, memperbarui, atau menghapus baris, dan menghubungkan tabel ke dalam workflow
- Membuat, mengedit, dan menjalankan rangkaian evaluasi prompt dan agen ([Eval suites](./evals-tab.md#from-chat-and-mcp)), termasuk baseline agen: dilaporkan, dibangun dari proses eksekusi, atau dinyatakan dalam angka. Hasilnya mencantumkan tautan Evals dari setiap suite yang disimpan.
- Buat atau perbarui credential Anda di halaman khusus Heym (lihat [Credentials](#credentials))
- Membaca team dan global variable, serta mencari dokumentasi
- Menyetujui, mengedit, atau menolak review human-in-the-loop yang tertunda

Kemampuan yang ditambahkan ke Tab Chat di kemudian hari otomatis tersedia melalui `heym_chat` — tidak ada toggle per-kemampuan yang perlu disinkronkan.

Kemampuan ini berjalan di dalam `heym_chat`: `tools/list` menampilkan `heym_chat` dan alat workflow Anda, tidak pernah alat internal chat seperti alat rangkaian evaluasi.

### Mode Build

`heym_chat` selalu menjalankan mesin Chat dalam mode build. Dalam satu panggilan, asisten dapat menyimpan Workflow baru, menjalankannya dengan input sampel yang realistis, membaca laporan eksekusi, memperbaiki bagian yang gagal, dan menjalankannya kembali, hingga lima kali uji jalan per panggilan. Ketika eksekusi terakhir dari penyimpanan terakhir berhasil, asisten menyelesaikannya dengan ringkasan satu kalimat, dan balasan diakhiri dengan `Verified: the latest test run of the saved workflow passed.`

Saat panggilan membuat atau mengedit workflow, jawabannya mencantumkan masing-masing dengan tautan editor lengkapnya, seperti `https://heym.example.com/workflows/<id>`, dan tautan di dalam jawaban asisten juga merupakan tautan lengkap. Tautan tersebut menggunakan alamat Heym yang Anda konfigurasi (`FRONTEND_URL`) dan terbuka untuk orang yang masuk ke Heym yang dapat mengakses workflow tersebut.

- Uji jalan adalah eksekusi nyata. Efek sampingnya benar-benar terjadi dan muncul di riwayat eksekusi Workflow seperti eksekusi lainnya.
- Penyimpanan mengikuti jalur editor: perubahan pada graf menyimpan graf sebelumnya di **Edit History** Workflow.
- Untuk mengubah Workflow yang dibuat sebelumnya, lanjutkan utas dengan `conversation_id` yang sama. Asisten memperbarui Workflow tersebut alih-alih membuat yang baru, dan hanya mengubah Workflow yang dapat Anda edit.
- Ketika lima uji jalan telah terpakai, asisten berhenti dan menjelaskan apa yang masih gagal.

`heym_chat` dapat memeriksa tabel dan baris Anda, membuat tabel, menambah atau menghapus kolom, serta menyisipkan, memperbarui, atau menghapus baris. Berikan nama tabel, UUID, atau tautan DataTable, misalnya: „Tambahkan dua kolom string, nama depan dan nama belakang, ke https://heym.example/?tab=datatable/<table-id>”. Ini mengubah tabel secara langsung dan mempertahankan kolom serta nilai yang ada saat menambahkan kolom baru.

`heym_chat` dapat memeriksa tabel dan baris Anda, membuat tabel, menambah atau menghapus kolom, serta menyisipkan, memperbarui, atau menghapus baris. Berikan nama tabel, UUID, atau tautan DataTable, misalnya: „Tambahkan dua kolom string, nama depan dan nama belakang, ke https://heym.example/?tab=datatable/<table-id>”. Ini mengubah tabel secara langsung dan mempertahankan kolom serta nilai yang ada saat menambahkan kolom baru.

Operasi tulis memerlukan kepemilikan atau akses **tulis** melalui pembagian langsung atau tim. Akses hanya-baca memungkinkan inspeksi. Penulisan baris menerapkan pemeriksaan tipe, nilai default, keharusan, dan keunikan dari tab DataTable; impor parsial melaporkan baris yang ditolak. Menghapus kolom akan menghapus nilainya dari setiap baris. Seperti pada tab DataTable, penghapusan kolom dan pengosongan semua baris memerlukan konfirmasi terlebih dahulu; balas dengan `conversation_id` yang sama untuk mengonfirmasi. Menghapus baris yang dipilih tidak memerlukan konfirmasi tambahan.


### Credentials

`heym_chat` melihat credential yang Anda miliki dan yang dibagikan kepada Anda, berdasarkan nama dan jenis, sama seperti tab Chat. Saat workflow yang dibangun memerlukan credential, ia menanyakan mana yang akan digunakan sebagai pertanyaan dalam hasil. Jawab dengan `conversation_id` yang sama.

Untuk menambahkan credential, atau memperbarui yang Anda miliki, asisten membuka formulir credential Heym di halaman Heym, `/credentials/setup/<id>`. Anda masuk ke Heym di sana, memasukkan kunci atau menghubungkan akun, lalu menekan simpan. Nilai langsung masuk ke Heym: klien MCP dan modelnya hanya mempelajari nama dan jenis credential. Jangan menempelkan kunci ke klien MCP; mintalah formulirnya.

| Klien | Apa yang terjadi |
|-------|------------------|
| Mendukung elisitasi URL MCP | Klien meminta Anda untuk membuka halaman Heym. Panggilan menunggu saat Anda mengisi formulir, hingga sepuluh menit, lalu dilanjutkan dengan credential baru. |
| Lainnya | Hasil membawa tautan dan meminta klien untuk memanggil `heym_chat` lagi dengan `wait_for_credential_form`. Panggilan tersebut menunggu hingga lima menit saat Anda mengisi formulir, lalu melanjutkan percakapan. Jika klien tidak menunggu, simpan formulir dan balas dengan `conversation_id` yang sama; panggilan berikutnya tahu bahwa formulir telah disimpan dan credential apa yang dibuatnya. |

Halaman hanya terbuka untuk akun Heym yang memulai permintaan, jadi tautan yang diteruskan tidak berguna bagi orang lain. Formulir tetap terbuka selama 24 jam, dan Anda dapat menolaknya dari halaman. Setelah Anda menyimpan atau menolaknya, langkah dalam percakapan tab Chat menampilkan hasilnya.


### Credential dan model

`heym_chat` menjalankan mesin pada akun Heym Anda, sehingga memerlukan credential LLM tersendiri:

| Field | Perilaku |
|-------|----------|
| **Credential** | Pilih credential OpenAI, Google, atau Custom apa pun yang dapat Anda akses. Terisi otomatis dari credential pilihan di [Settings](../reference/user-settings.md) saat Anda belum memilihnya. |
| **Model** | Dimuat dari credential yang dipilih. Terisi otomatis dari model pilihan Anda saat credential cocok. |

Jika salah satunya tidak ada, tool tetap muncul di `tools/list` tetapi setiap panggilan mengembalikan error yang meminta Anda menyelesaikan penyiapan di tab ini.


Node LLM dan Agent dalam workflow yang dibangun `heym_chat` berjalan pada credential dan model ini, termasuk credential yang dibagikan seseorang dengan Anda, sehingga uji coba berfungsi tanpa langkah penyiapan lain. Saat `heym_chat` mengedit workflow, node LLM dan Agent yang sudah memiliki credential akan menyimpannya, beserta modelnya.
### Argumen dan riwayat

| Argumen | Wajib | Deskripsi |
|----------|----------|-------------|
| `message` | Ya | Instruksi atau pertanyaan, dalam bahasa alami. |
| `conversation_id` | Tidak | `conversation_id` dari hasil `heym_chat` sebelumnya, untuk melanjutkan thread tersebut. |
| `wait_for_credential_form` | Tidak | Dengan `conversation_id`: tunggu hingga pengguna menyimpan atau menolak formulir credential yang dibuka oleh utas, lalu kirim `message`. |

Setiap panggilan ditulis ke riwayat [Tab Chat](./chat-tab.md) Anda sebagai percakapan normal, ditandai dengan ikon plug di daftar percakapan. Pesan, tool card, dan jeda klarifikasi terlihat persis seperti percakapan yang Anda mulai sendiri, dan Anda dapat membuka thread tersebut serta terus berbicara di browser. Setiap hasil mengembalikan `conversation_id`-nya sehingga klien MCP dapat melanjutkan thread yang sama alih-alih membuka thread baru pada setiap panggilan.

Saat asisten memerlukan klarifikasi, ia berhenti sejenak dan memberitahukannya; balas dengan jawabannya menggunakan `conversation_id` yang sama.
### Aktifkan A2A

Saat Agen Heym aktif, kartu menampilkan kotak centang **Aktifkan A2A**. Centang kotak ini dan agen lain dapat mengirim tugas ke Agen Heym melalui protokol Agent2Agent (A2A 1.0). Kartu kemudian mencantumkan URL **Agent Card** dan **JSON-RPC endpoint**, masing-masing dengan tombol salin, serta perintah `curl` untuk mengambil kartu. A2A menggunakan kunci dan info masuk OAuth yang sama dengan MCP. Menonaktifkan agen juga menonaktifkan A2A. Lihat [A2A](../reference/a2a.md) untuk metode, status tugas, dan contoh.

### Kemajuan

Panggilan `heym_chat` yang berlangsung lama melaporkan aktivitas agen sebagai kemajuan MCP (`notifications/progress`), dengan kata-kata yang ditampilkan pada tab Chat, misalnya `Menguji workflow · percobaan 2/5`. Klien yang menyetel ulang batas waktu saat pemberitahuan kemajuan akan terus menunggu saat agen bekerja.

## Named MCP Server

Server bernama memungkinkan Anda memisahkan Workflow ke dalam endpoint MCP yang terisolasi. Setiap server memiliki URL dan API key tersendiri, sehingga klien AI, tim, atau kasus penggunaan yang berbeda dapat terhubung tepat ke Workflow yang mereka butuhkan.

### Membuat Named Server

1. Ketikkan nama pada kolom input di bagian bawah tab MCP (misalnya **CRM Tools**)
2. Klik **Create** — kartu server baru akan langsung muncul
3. Klik kartu tersebut untuk memperluasnya

### Pengaturan Per-Server

Setiap kartu server menampilkan:

| Pengaturan | Deskripsi |
|---------|-------------|
| **SSE Endpoint** | URL unik: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Key independen, ditampilkan satu kali saat dibuat atau dibuat ulang. Salin segera; key disimpan dalam bentuk hash dan tidak dapat ditampilkan kembali di kemudian hari |
| **How to connect** | **Copy JSON** menyalin konfigurasi MCP yang siap ditempel; **Add to Cursor** memasangnya dengan satu klik |
| **Heym Capabilities** | Aktifkan/nonaktifkan Agen Heym (`heym_chat`) untuk server ini dan pilih credential serta modelnya |
| **Aktifkan A2A** | Sakelar A2A milik server ini, dengan Agent Card sendiri di `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Aktifkan A2A** | Sakelar A2A milik server ini, dengan Agent Card sendiri di `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Aktifkan/nonaktifkan Workflow mana saja yang diekspos oleh server ini |

### Penetapan Workflow

Penetapan Workflow bersifat per-server dan independen dari toggle server default. Sebuah Workflow dapat diaktifkan pada server default dan pada beberapa named server secara bersamaan, atau tidak pada satu pun.

Mengaktifkan/nonaktifkan sebuah Workflow akan memindahkannya ke bagian atas daftar yang ditetapkan, sehingga baris yang baru saja Anda ubah tetap terlihat dan tidak tergulir keluar dari tampilan.

### Autentikasi

Named server mendukung metode autentikasi yang sama dengan server default:

- **Header X-MCP-Key** – Kirimkan API key server secara langsung (klien API, Cursor). Hanya melalui header: key tidak diterima sebagai parameter kueri `?key=`, karena URL akan tercatat dalam access log, log proxy, dan riwayat browser.
- **Claude, ChatGPT, dan Gemini OAuth** – Tambahkan URL server ke konektor atau aplikasi kustom klien; biarkan credential kosong dan klien akan mendaftar melalui OAuth secara otomatis. Bearer token harus dikirim melalui header `Authorization`, bukan sebagai `?token=`.
- **Session token** – Diterbitkan selama handshake SSE; dibatasi pada server tertentu sehingga token dari satu named server tidak dapat mengakses server lainnya. Parameter `?session=` berumur pendek ini tidak terpengaruh.

### Menghapus Named Server

Klik ikon **X** pada header kartu server. Penghapusan akan menghapus server beserta seluruh penetapan Workflow-nya; Workflow itu sendiri tidak terpengaruh.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Kedua endpoint mendukung transport SSE (GET, MCP spec 2024-11-05) dan transport Streamable HTTP (POST, MCP spec 2025-03-26). Claude, ChatGPT, dan Gemini menggunakan OAuth 2.1 / PKCE untuk sign-in yang aman pada keduanya.

## Terkait

- [Why Heym](../getting-started/why-heym.md) – MCP sebagai primitif kelas utama di Heym
- [Agent Node](../nodes/agent-node.md) – Node Agent dengan dukungan tool MCP
- [Agent Architecture](../reference/agent-architecture.md) – Klien MCP, pengiriman tool, orkestrator
- [Triggers](../reference/triggers.md) – MCP sebagai titik masuk Workflow
- [Chat Tab](./chat-tab.md) – Mesin di balik tool `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Membuat dan mengelola Workflow
- [Node Types](../reference/node-types.md) – Ikhtisar Node AI
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk tampilan dashboard