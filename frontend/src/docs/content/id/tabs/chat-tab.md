# Tab Chat

Tab **Chat** menyediakan antarmuka chat LLM langsung. Gunakan untuk menguji model, mengajukan pertanyaan, menjalankan Workflow yang sudah ada, atau membuat Workflow baru dari permintaan berbahasa alami.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Tonton demo Chat</a></p>

## Penyiapan

1. Pilih [credential](./credentials-tab.md) (API key untuk OpenAI, Google, dll.)
2. Pilih model dari dropdown (model dimuat dari credential yang dipilih)
3. Mulai mengetik untuk mengirim pesan

Anda juga dapat memulai percakapan dari kotak chat pada [tab Workflows](./workflows-tab.md). Kotak tersebut mengirim pesan pertama Anda dan membuka percakapan baru di sini dengan jawaban yang sudah mulai streaming.

## Fitur

- **Konteks Global Variables** – [Global Variables](../reference/global-variables.md) Anda tersedia bagi LLM, sehingga Anda dapat menanyakan atau merujuk nilai yang tersimpan
- **Konteks template Workspace** – Template Workflow dan Node yang dibagikan di Workspace Anda disertakan sebagai konteks, sehingga Chat dapat menjawab pertanyaan tentang template yang tersedia
- **Agen berjalan lama** – Chat tetap bekerja di backend meskipun browser ditutup, sehingga Anda dapat kembali dari perangkat lain dan melanjutkan percakapan yang sama
- **Pembuatan Workflow** – Mintalah Chat membuat atau menyiapkan Workflow, dan Chat menggunakan mesin Workflow AI Builder yang sama dengan asisten editor untuk menghasilkan dan menyimpan Workflow
- **Pembuatan tugas Kanban** – Mintalah secara alami untuk menambahkan tugas atau membuat kartu. Chat menambahkannya ke kolom pertama board yang diminta; ketika Anda memiliki beberapa board dan tidak menyebutkan salah satunya, Chat menampilkan pemilih board sebelum membuat kartu
- **Tindak lanjut dalam antrean** – Kirim lebih banyak pesan saat jawaban sedang streaming. Pesan dalam antrean disimpan secara persisten, dapat diedit atau dihapus sebelum dimulai, dan dijalankan secara berurutan setelah respons aktif
- **Jeda perencanaan** – Ketika Chat memerlukan detail perencanaan, Chat mengajukan pertanyaan klarifikasi dan menjeda tindak lanjut dalam antrean hingga Anda menjawab. Setelah jawaban perencanaan selesai, pesan dalam antrean dilanjutkan
- **Credentials** – Ketika Workflow yang dibuat atau diedit oleh Chat memerlukan credential, Chat menanyakan credential mana yang akan digunakan, menawarkan untuk membuat yang baru dalam percakapan, atau memungkinkan Anda melanjutkan tanpa credential. Anda juga dapat meminta Chat membuat credential atau memperbarui credential yang Anda miliki; Chat membuka formulir credential dalam percakapan. Model hanya melihat nama dan tipe credential, tidak pernah nilainya. Lihat [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Data tables** – Ketika Workflow yang dibuat atau diedit oleh Chat menyimpan record, Chat menanyakan [data table](./datatable-tab.md) mana yang akan digunakan atau menawarkan untuk membuatnya dengan kolom yang dibutuhkan Workflow. Chat juga dapat menampilkan daftar tabel Anda beserta kolomnya. Chat tidak pernah membaca atau menulis baris. Lihat [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Respons streaming** – Lihat output model saat di-streaming
- **Hentikan respons** – Hentikan jawaban yang sedang streaming kapan saja; menghentikan juga menghapus pesan dalam antrean untuk percakapan tersebut
- **Rendering Markdown** – Respons mendukung pemformatan markdown, termasuk gambar inline
- **Tampilan gambar** – Gambar yang disematkan dalam respons (misalnya dari pembuatan gambar LLM) muncul secara inline; klik gambar mana pun untuk melihatnya layar penuh. Tekan **Esc** atau tombol kembali (seluler) untuk menutup tampilan layar penuh
- **Salin pesan** – Salin pesan apa pun ke clipboard
- **Bersihkan chat** – Mulai percakapan baru
- **Input suara** – Gunakan tombol mikrofon untuk speech-to-text (didukung browser). Ketika perekaman berhenti, Heym dapat sedikit merapikan transkrip sebelum Anda mengirimnya
- **Workflow terjadwal** – Tanyakan kapan Workflow cron berjalan (hari ini, minggu ini, bulan ini, atau rentang tanggal khusus). Asisten menggunakan data jadwal yang sama dengan tab [Scheduled](./scheduled-tab.md) dan dapat membatasi hasil pada Workflow yang Anda miliki atau menyertakan yang dibagikan kepada Anda
- **Riwayat eksekusi Workflow** – Tanyakan tentang satu Workflow ("berapa kali laporan harian berjalan?", "apakah gagal?", "kapan terakhir berjalan?"). Chat mencari Workflow berdasarkan ID-nya dan menjawab dari jumlah eksekusi, rincian status, waktu eksekusi pertama dan terakhir, serta durasi rata-rata. Tanyakan mengapa suatu eksekusi gagal atau apa yang dikembalikannya, dan Chat kemudian membuka eksekusi tunggal tersebut untuk membaca input, output, dan error per-Node
- **Status eksekusi langsung** – Tanyakan apa yang sedang berjalan saat ini dan Chat menjawab dengan jumlah, nama Workflow, berapa lama setiap eksekusi berjalan, Node mana yang sedang diproses, dan tautan langsung ke eksekusi langsung
## Menggunakan Chat dari MCP Client

Mesin Chat juga dapat diakses dari luar browser. Aktifkan **Heym Chat Tool** di [tab MCP](./mcp-tab.md) dan MCP client — Claude, Cursor, serta apa pun yang mendukung MCP — akan mendapatkan satu tool `heym_chat` yang menjalankan mesin yang sama dengan seluruh kemampuannya.

Percakapan tersebut tersimpan dalam riwayat tab ini, ditandai dengan ikon plug pada daftar percakapan. Buka salah satunya untuk membaca apa yang diminta oleh client, melihat tool card yang dipicu, dan melanjutkan thread tersebut sendiri. Menjawab pertanyaan klarifikasi bekerja dengan cara yang sama, baik giliran dimulai dari sini maupun dari MCP client.

Melalui MCP, Chat tidak menampilkan, memilih, atau membuat credential. Workflow yang dibangunnya akan membiarkan kolom credential kosong, dan balasannya akan menyebutkan Node yang memerlukan credential agar Anda dapat mengaturnya di editor.

Data table juga berfungsi melalui MCP: Chat menampilkan daftar table Anda, membuat yang baru, dan menghubungkannya ke dalam workflow yang dibangunnya. Pertanyaan tentang table muncul sebagai teks dalam hasil, jadi jawablah dengan `conversation_id` yang sama.

## Batas Konteks

Chat menyimpan hingga 25 pesan terbaru dalam konteks. Pesan yang lebih lama dipangkas agar tetap berada dalam batas model.

## Membuat Workflow

Ketika Anda meminta Chat untuk membuat, membangun, menghasilkan, atau menyiapkan sebuah workflow, Chat akan membuat workflow tersimpan baru dengan nama dan deskripsi yang dihasilkan. Responsnya mencakup pratinjau canvas read-only dari Node dan edge yang dihasilkan, serta tautan **Open workflow** yang membuka editor workflow di tab browser baru. Gunakan tombol **Run** pada kartu pratinjau ketika Anda ingin menjalankan workflow tersebut.

Umpan balik lanjutan dalam chat yang sama akan mengedit workflow tersebut alih-alih membuat yang baru. Misalnya, setelah Chat membuat workflow, Anda dapat mengatakan "add an approval step", "change the output format", atau "şöyle yap" dan Chat akan memperbarui workflow tersimpan serta menyegarkan pratinjaunya.

Ini paling cocok untuk permintaan di mana Anda ingin pekerjaan tersebut diselesaikan sebagai otomatisasi yang dapat digunakan kembali, bukan sekadar jawaban sekali pakai.

## Membuat Kanban Task

Minta kepada Chat dengan bahasa biasa, misalnya, "Add a task called Fix login bug" atau
"Create a new card Update documentation on the Launch board." Anda dapat menyertakan
deskripsi dalam permintaan yang sama. Chat selalu membuat card di kolom pertama
board yang dipilih.

Jika workspace Anda memiliki beberapa board dan Anda tidak menyebutkan salah satunya, Chat akan berhenti dengan
pemilih board pilihan tunggal. Pilih sebuah board untuk menyelesaikan pembuatan card. Tidak diperlukan slash command
atau format pesan khusus.

## Menanyakan Apa yang Sedang Berjalan

Tanyakan dengan bahasa biasa — "what is running?", "how many workflows are active right now?",
"which node is the nightly report on?" — dan Chat akan melaporkan gambaran langsungnya:

- **Berapa banyak** eksekusi yang sedang berlangsung, terbagi menjadi running dan awaiting human review
- **Workflow mana** yang terkait, berdasarkan nama
- **Berapa lama** setiap run telah berjalan (misalnya `1m 35s`, `3h 25m`)
- **Node mana** yang sedang dieksekusi saat ini, berdasarkan label canvas-nya, plus Node terakhir yang selesai
- **Tautan** ke setiap live run, yang membuka canvas dengan eksekusi tersebut diputar ulang

Run yang dijeda untuk [Human-in-the-Loop](../reference/human-in-the-loop.md) atau Codex review dilaporkan sebagai
menunggu Anda, bukan sebagai running. Ini adalah data yang sama dengan badge active-runs di header,
sehingga Chat dan badge tersebut tidak pernah berbeda. Untuk run yang sudah selesai, tanyakan recent executions
saja — itu akan membaca [Execution History](../reference/execution-history.md).

## Menanyakan Tentang Alert

Chat dapat menjawab pertanyaan tentang [alert](./alerts-tab.md) yang telah Anda definisikan:

- **Apa yang ada** — "what alerts do I have?", "is there an alert on the invoice workflow?",
  "which alerts are firing right now?"
- **Bagaimana sebuah alert diatur** — "what is the threshold on the cost alert?", "how is that configured?"
- **Mengapa dan kapan alert tersebut terpicu** — "why did the cost alert fire?", "when did this last trigger?"

Untuk pertanyaan "why did it fire", Chat akan membaca catatan firing dan mengutip nilai aktual yang teramati,
threshold, dan window persis yang dievaluasi, plus detail kontribusinya:
execution id yang gagal dan pesan error untuk error alert, pengeluaran per-model untuk cost alert, atau
rincian sumber trigger untuk execution-count alert. Chat melaporkan apa yang benar saat alert tersebut
terpicu alih-alih menghitung ulang window, karena window tersebut sudah lewat dan perhitungan baru
dapat memberikan jawaban yang berbeda.

## User Rules

[User Rules](../reference/user-settings.md) (dikonfigurasi di Settings) secara otomatis disuntikkan ke setiap percakapan Chat sebagai instruksi tingkat sistem. Atur sekali untuk menerapkan preferensi persisten ke semua permintaan chat.
## Terkait

- [Tab MCP](./mcp-tab.md) – Ekspos engine ini ke klien MCP sebagai tool `heym_chat`
- [Pengaturan](../reference/user-settings.md) – Tetapkan User Rules yang berlaku untuk semua permintaan chat
- [Tab Credentials](./credentials-tab.md) – Tambahkan dan kelola API key
- [Tab Variables](./global-variables-tab.md) – Variabel global yang tersedia untuk Chat
- [Node Types](../reference/node-types.md) – Node LLM dan Agent untuk workflow
- [Node Agent](../nodes/agent-node.md) – AI Agent dengan pemanggilan tool
- [AI Assistant](../reference/ai-assistant.md) – Asisten editor yang didukung oleh workflow builder DSL yang sama
- [Execution History](../reference/execution-history.md) – Lihat riwayat eksekusi (tombol History di header)
- [Tab Scheduled](./scheduled-tab.md) – Kalender jadwal cron mendatang (data yang sama dapat diringkas oleh Chat)
- [Tab Alerts](./alerts-tab.md) – Alert ambang batas yang dapat didaftar dan dijelaskan oleh Chat
- [Contextual Showcase](../reference/contextual-showcase.md) – Orientasi dalam aplikasi yang ringkas untuk halaman ini
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – Bacakan pesan dengan suara dan bicara tanpa menggunakan tangan dengan ElevenLabs

## Pemanggilan tool dan ukuran konteks

Setiap kali asisten memanggil sebuah tool (menjalankan workflow, mendaftar eksekusi, membangun workflow baru), sebuah kartu yang dapat dilipat akan muncul dalam percakapan. Kartu tersebut otomatis terbuka saat tool berjalan, menampilkan argumen secara persis. Ketika tool selesai, kartu akan terlipat menjadi ringkasan satu baris beserta waktu yang dibutuhkan. Klik kartu mana pun untuk membuka kembali argumen dan ringkasan respons.

Sebuah badge cincin kecil di bawah input menampilkan penggunaan konteks saat ini sebagai persentase dari window model (misalnya `12% · ~9.2k`). Arahkan kursor ke badge untuk melihat rinciannya: system prompt, AGENTS.md, blok workflow, user rules, riwayat, dan draf input Anda. Ketika penggunaan melewati 80% cincin berubah menjadi kuning; pada 95% berubah menjadi merah.

Jika penggunaan mendekati batas, Heym secara otomatis memadatkan pesan-pesan lama menjadi ringkasan singkat menggunakan mekanisme yang sama dengan yang digunakan Node agent. Sebuah kartu "Context compressed" akan muncul secara inline untuk menunjukkan apa yang terjadi.
