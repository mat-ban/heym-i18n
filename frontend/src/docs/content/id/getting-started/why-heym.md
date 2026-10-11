# Mengapa Heym

Heym adalah infrastruktur untuk menjalankan dan mengelola agen AI di lingkungan produksi. Satu runtime yang di-self-host mencakup setiap tahap siklus hidup agen.

Agen prototipe memerlukan model, prompt, dan beberapa tools. Agen produksi juga memerlukan Trigger dan retry, state tersimpan saat berhenti untuk menunggu manusia, catatan setiap pemanggilan model dan tool, biaya untuk setiap eksekusi, pengujian sebelum perubahan dirilis, serta batasan yang jelas atas apa yang boleh dilakukannya secara mandiri. Heym menampung semua itu di satu tempat, sehingga sistem yang Anda rancang di kanvas adalah sistem yang benar-benar berjalan. Bangun sistem agentic, lalu jalankan dengan percaya diri.

## Satu Runtime untuk Siklus Hidup Agen

| Tahap | Yang Heym berikan kepada Anda |
|---|---|
| **Build** | Susun agen dan langkah deterministik di kanvas, hasilkan melalui [AI Assistant](../reference/ai-assistant.md), atau mulai dari [Templates](../tabs/templates-tab.md) dan skill portabel. |
| **Orchestrate** | Koordinasikan agen, [sub-agen](../reference/agent-architecture.md), coding agent, RAG, otomatisasi browser, dan tools dengan aliran data eksplisit serta [eksekusi paralel](../reference/parallel-execution.md). |
| **Run** | Mulai eksekusi dari [webhook](../reference/webhooks.md), jadwal, dan [Trigger](../reference/triggers.md) peristiwa, dengan retry per-Node, [penanganan error](../nodes/error-handler-node.md), dan [distribusi beban](../reference/cluster.md) lintas instance. |
| **Observe** | Periksa setiap eksekusi melalui [history](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), biaya USD per eksekusi, eksekusi langsung di kanvas, [analitik](../tabs/analytics-tab.md), [alert](../tabs/alerts-tab.md), dan ekspor [OpenTelemetry](../reference/opentelemetry.md). |
| **Evaluate** | Uji prompt dan model terhadap output yang diharapkan di [Evals](../tabs/evals-tab.md), dengan penilaian LLM-as-Judge dan perbandingan model secara berdampingan. |
| **Control** | Jaga manusia tetap memegang kendali dengan [review checkpoint](../reference/human-in-the-loop.md) dan [guardrail](../reference/guardrails.md), serta kelola akses dengan [credentials](../reference/credentials.md) terenkripsi, [teams](../reference/teams.md), [single sign-on](../reference/sso.md), dan [audit trail](../reference/audit.md). |
| **Expose** | Sajikan Workflow melalui REST dan [SSE](../reference/sse-streaming.md), sebagai tools [MCP](../tabs/mcp-tab.md), sebagai UI chat [Portal](../reference/portal.md), dan sebagai widget [dashboard](../tabs/dashboard-tab.md). |

## Build

### AI Assistant: Bangun Workflow dengan Bahasa Alami

[AI Assistant](../reference/ai-assistant.md) adalah panel chat di dalam editor Workflow. Jelaskan apa yang Anda inginkan, misalnya "buat Workflow yang menerima input pengguna, mencari di basis pengetahuan saya, dan membalas menggunakan GPT-4o", dan asisten akan menghasilkan Node dan edge yang langsung diterapkan ke kanvas.

- Menggunakan credential LLM Anda sendiri (model apa pun yang didukung)
- Mendukung **input suara** untuk perancangan Workflow tanpa menggunakan tangan
- Secara otomatis menerapkan JSON Workflow yang valid dari respons AI ke kanvas
- Menstreaming respons secara real time

Asisten bekerja langsung di dalam editor dan menstreaming Node ke kanvas secara real time, dan semua yang dihasilkannya tetap dapat diedit seperti Node yang Anda tempatkan sendiri.

### Skills System

Skill adalah bundel kapabilitas portabel, sebuah berkas instruksi `SKILL.md` ditambah skrip Python opsional, yang dapat dijatuhkan ke Node Agent mana pun.

- Instruksi skill ditambahkan di awal system prompt agen
- Berkas Python dalam skill menjadi tool yang dapat dipanggil
- Skill dapat digunakan ulang lintas Workflow dan dibagikan sebagai arsip `.zip`

Ini analog dengan memberikan deskripsi pekerjaan dan kotak peralatan kepada agen Anda dalam satu langkah.

### Workflow Analyzer: Umpan Balik Berbasis Eksekusi

Panel [Workflow Analysis](../reference/workflow-analysis.md) adalah alat dokumentasi dan umpan balik berbasis eksekusi yang terpasang di editor. Klik **Analyze**, pilih credential dan model LLM, dan Heym akan menghasilkan laporan Markdown yang dapat diedit untuk Workflow saat ini.

Berbeda dari catatan statis, analyzer terlebih dahulu menjalankan Workflow bila memungkinkan dan menyertakan hasil eksekusi dalam prompt. Laporan mencakup area perbaikan, tujuan Workflow, dan penjelasan langkah demi langkah tentang apa yang dilakukan Node. Ketika laporan sudah ada, **Reanalyze** menstreaming pratinjau terpisah sehingga Anda dapat menerima versi baru atau mempertahankan dokumen bersama yang berlaku saat ini.

## Orchestrate
### Node LLM dan Agent Bawaan

[Node Agent](../nodes/agent-node.md) milik Heym menjalankan loop pemanggilan tool yang terintegrasi erat dengan tool Python inline, koneksi MCP, dan sistem skills portabel, semuanya dirancang untuk agent produksi.

[Node LLM](../nodes/llm-node.md) biasa milik Heym juga melampaui langkah prompt-response tunggal. Untuk endpoint OpenAI dan OpenAI-compatible yang didukung, node ini dapat beralih ke **mode Batch API** sehingga satu Node mengirimkan array prompt dalam permintaan batch native penyedia dengan biaya lebih rendah. Canvas kemudian mengekspos cabang `batchStatus` khusus yang terpicu saat batch bergerak melalui status seperti `pending`, `processing`, dan `completed`.

Artinya, Node LLM dapat melakukan dua hal sekaligus:

- Menjalankan permintaan batch utama dan mengembalikan output akhir per-item pada cabang normal
- Memicu logika notifikasi atau logging pada setiap pembaruan status batch yang berarti tanpa mengubah alur menjadi loop polling kustom

Eksekusi batch adalah primitif Workflow LLM kelas utama, dengan pemeriksaan kapabilitas penyedia dan model di UI Node.

**Node Agent** adalah inti orkestrasi agent di Heym:

- **Pemanggilan tool** – Agent melakukan iterasi atas pemanggilan tool dalam sebuah loop hingga menghasilkan jawaban akhir
- **Tool Python** – Definisikan tool kustom secara inline dengan Python penuh; Agent memanggilnya saat runtime
- **Koneksi MCP** – Hubungkan ke server [Model Context Protocol](https://modelcontextprotocol.io/) mana pun (stdio atau SSE) dan Agent otomatis mendapatkan semua tool-nya
- **Skills** – Jatuhkan file `.zip` atau `.md` ke Agent untuk memperluas konteks sistemnya dan menambahkan tooling Python
- **Pemanggilan sub-workflow** – Agent dapat memanggil Workflow Heym lain sebagai tool, menyusun perilaku kompleks tanpa kode kustom

Lihat [Node Agent](../nodes/agent-node.md) dan [Arsitektur Agent](../reference/agent-architecture.md) untuk referensi lengkapnya.

### Orkestrasi Multi-Agent

Heym mendukung **pola orkestrator** dengan primitif visual kelas utama:

- Satu Agent bertindak sebagai **orkestrator** (`isOrchestrator: true`) dan diberikan tool `call_sub_agent`
- Agent tersebut mendelegasikan tugas kepada **sub-agent** bernama di canvas yang sama
- Sub-agent dapat memanggil Agent lain atau sub-workflow (kedalaman maksimum: 5)
- **Eksekusi paralel**: Ketika orkestrator memanggil beberapa sub-agent dalam satu giliran, sub-agent tersebut berjalan secara paralel untuk hasil yang lebih cepat

Hal ini memungkinkan arsitektur seperti Agent perencana yang merutekan pekerjaan ke peneliti, pembuat kode, dan peringkas, semuanya terhubung secara visual tanpa kode orkestrasi kustom.

Lihat [Arsitektur Agent](../reference/agent-architecture.md) untuk detail eksekusi.

### Coding Agent sebagai Node Workflow

Heym menyediakan dua Node yang menjalankan coding agent sungguhan sebagai langkah Workflow, bukan chat completion:

- **[Node Codex](../nodes/codex-node.md)** – Menjalankan OpenAI Codex CLI di workspace Heym yang terisolasi terhadap repositori GitHub. Mendukung **Sign in with ChatGPT** (PKCE OAuth pada langganan Plus/Pro Anda, tanpa biaya API per-token) atau access token, mengkloning repo, membiarkan Codex mengedit kode, dan mengembalikan `summary`, `diff`, `changedFiles`, serta draft `pullRequestUrl`.
- **[Node OpenCode Go](../nodes/opencode-go-node.md)** – Alur repositori yang sama melalui gateway OpenCode yang agnostik penyedia (Kimi, DeepSeek, Qwen, dan lainnya), dieksekusi dalam **container sekali pakai yang diperkuat**: semua kapabilitas dihapus, root read-only, batas pid/memori/CPU. Token GitHub tetap berada di luar sandbox: Heym melakukan setiap operasi git dan GitHub di sisi host, sehingga kode yang dihasilkan tidak dapat mengeksfiltrasi kredensial push.

Artinya, sebuah Workflow dapat menangani triase bug dari Webhook, menyerahkan repo ke coding agent, menunggu draft PR, dan memposting tautannya ke Slack, sepenuhnya otomatis, dengan batas sumber daya yang dapat dikonfigurasi per deployment.

### Pipeline RAG Bawaan

Heym menyertakan [Node RAG / Vector Store](../nodes/rag-node.md) dan tab [Vectorstores](../tabs/vectorstores-tab.md) terkelola. Anda dapat:

- Memilih backend vektor Anda: **Qdrant** (server eksternal) atau **Postgres (pgvector)**, yang menyimpan vektor di database Heym sendiri tanpa layanan tambahan yang perlu dijalankan
- Menyisipkan dokumen ke vector store langsung dari Node Workflow
- Melakukan pencarian semantik dan meneruskan hasilnya ke Node LLM atau Agent
- Mereferensikan hasil dengan ekspresi seperti `$ragNode.results.map("item.payload.content").join("\n\n")`

Di Heym, RAG adalah dua Node dengan kontrol penuh atas embedding dan retrieval.

### Otomatisasi Browser dengan Playwright

[Node Playwright](../nodes/playwright-node.md) adalah otomatisasi browser pihak pertama di canvas.

- **Mode langkah** – Susun aksi navigate, click, type, fill, screenshot, extract, dan scroll secara visual
- **Langkah AI dengan auto-heal** – Deskripsikan aksi dalam bahasa alami dan LLM menghasilkan aksi Playwright; selector yang gagal dapat diperbaiki secara otomatis, dan langkah yang dihasilkan dapat di-cache untuk melewati pemanggilan LLM di masa mendatang
- **Mode Run Code** – Alihkan Node ke Playwright Python penuh untuk alur kompleks (dinonaktifkan secara default; berjalan di sandbox Heym yang diperkuat saat diaktifkan)
- **Sesi terautentikasi** – Pulihkan cookie/`storageState` sebelum menjalankan, verifikasi login dengan pemeriksaan selector, dan fallback ke langkah login terprogram
- **Penangkapan jaringan** – Secara opsional mengumpulkan respons JSON, header, cookie, dan penyimpanan browser bersama hasil

Heym memperlakukan browser sebagai Node biasa dengan ekspresi, kredensial, dan penanganan error yang sama seperti komponen lainnya.
### Expression DSL

[Expression DSL](../reference/expression-dsl.md) milik Heym menyediakan sintaksis yang bersih dan andal untuk mereferensikan data Node upstream:

- `$input.text` – Data Node Input
- `$nodeName.field` – Field output dari Node upstream mana pun
- `$global.variableName` – Variabel global yang persisten
- Helper array: `.first()`, `.map("field")`, `.join("\n")`

Expression berfungsi di setiap field string, termasuk Prompt, HTTP header, kondisi, dan nilai yang ditetapkan, sehingga data berpindah antar langkah secara eksplisit. DSL ini menyeimbangkan kekuatan dan keterbacaan tanpa memerlukan pengetahuan JavaScript secara menyeluruh.

## Menjalankan

### Trigger, Retry, dan Jalur Error

Sebuah Workflow dapat dimulai dari berbagai tempat. Node [Input](../nodes/input-node.md) menerima [webhook](../reference/webhooks.md) HTTP, [Cron](../nodes/cron-node.md) berjalan sesuai jadwal, dan [trigger](../reference/triggers.md) event memulai eksekusi dari Telegram, Discord, Slack, kotak masuk IMAP, stream WebSocket, antrean RabbitMQ, unggahan file, dan event platform Heym.

Kegagalan ditangani di dalam graf. Setiap Node dapat melakukan retry saat gagal dengan jumlah percobaan tertentu dan jeda di antaranya, setiap percobaan tercatat dalam [riwayat eksekusi](../reference/execution-history.md), dan Node [Error Handler](../nodes/error-handler-node.md) berjalan secara otomatis ketika sebuah Node gagal, sehingga pemulihan menjadi bagian dari Workflow itu sendiri.

### Eksekusi DAG Paralel

Eksekutor Workflow Heym menggunakan penjadwal directed acyclic graph (DAG). Node yang independen berjalan secara paralel secara otomatis, tanpa memerlukan konfigurasi.

- Node pada tingkat dependensi yang sama dikirim secara bersamaan ke thread pool (`max_workers=8`)
- Segera setelah sebuah Node selesai, Node downstream-nya dijadwalkan
- [Merge Node](../nodes/merge-node.md) menggabungkan hasil cabang paralel
- Beberapa eksekusi Workflow berjalan secara bersamaan; setiap eksekusi sepenuhnya terisolasi

Paralelisme adalah perilaku default, yang ditentukan oleh struktur graf.

Lihat [Eksekusi Paralel](../reference/parallel-execution.md).

### Skala Lintas Instance

Arahkan instance Heym kedua ke database PostgreSQL yang sama dan instance tersebut bergabung sebagai worker. Eksekusi background dibagi antar instance berdasarkan bobot yang Anda tetapkan, satu leader terpilih menjaga jadwal, evaluasi alert, dan pemulihan crash tetap berjalan melalui failover, dan setiap eksekusi mencatat instance yang menjalankannya. Lihat [Distribusi Beban](../reference/cluster.md).

### Papan Kanban Agentic

[Tab Board](../tabs/board-tab.md) adalah papan Kanban bawaan di mana kolom-kolomnya sendiri menjalankan Workflow. Sebuah kartu adalah pekerjaan agentic persisten yang membawa konteks, riwayat percakapan, status eksekusi, output, dan eksekusi Workflow.

- **Rantai Workflow kolom** – Memindahkan kartu ke dalam kolom memicu rantai Workflow kolom tersebut; sebuah **Agentic Kanban Model** (kredensial + model Anda) memetakan konten kartu ke input Workflow dan mengubah output kembali menjadi teks yang dapat dibaca
- **Lampiran kartu** – Jatuhkan file ke kartu; dokumen diekstraksi menjadi teks dan gambar diteruskan ke model yang mendukung vision sebelum setiap eksekusi
- **Kanvas eksekusi langsung** – Buka eksekusi aktif di dalam kartu dan saksikan eksekusinya pada kanvas Workflow sesungguhnya, Node demi Node
- **Berbagi tim** – Bagikan board kepada pengguna atau tim dengan izin baca/tulis; rantai pada board yang dibagikan berjalan dengan kredensial pemiliknya, sehingga kolaborator tidak perlu memiliki kredensial sendiri
- **Visibilitas kegagalan** – Kartu yang gagal menampilkan indikator riwayat error, dan eksekusi lanjutan dapat dijeda untuk menunggu komentar

Board adalah permukaan native platform ini: kartu, Workflow, kredensial, dan eksekusi langsung semuanya berada di satu tempat.

### Heym Drive: Penyimpanan File Bawaan

[Tab Drive](../tabs/drive-tab.md) adalah penyimpanan file yang terintegrasi ke dalam platform. File yang dihasilkan oleh skill dan Workflow (PDF, DOCX, CSV, gambar) tersimpan di sana secara otomatis, dan lampiran kartu board juga disimpan di sana.

- **Tautan berbagi** – Tautan unduhan publik atau yang dilindungi kata sandi (Basic Auth) dengan masa berlaku opsional dan batas maksimum unduhan
- **Berbagi tim** – Bagikan file secara read-only kepada tim Anda, dan hapus semua berbagi tim dalam satu tindakan
- **Tindakan massal** – Multi-pilih dengan rentang shift-click, gabungkan pilihan menjadi satu unduhan ZIP, atau terapkan satu pengaturan berbagi/kata sandi/hapus ke banyak file sekaligus
- **Akses agen** – Skill dapat memilih untuk membaca file Drive, sehingga agen dapat bekerja atas dokumen yang Anda atau Workflow lain hasilkan

Artefak yang dihasilkan mendapatkan tempat permanen yang dapat dibagikan di dalam platform.

## Mengamati

### LLM Traces

[Tab Traces](../tabs/traces-tab.md) menyediakan observabilitas penuh untuk setiap panggilan LLM:

- Payload request dan response
- Waktu per panggilan: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nama tool call, argumen, dan hasilnya
- Skill yang diteruskan ke model

Sistem trace dirancang khusus untuk men-debug perilaku agentic, dengan payload request dan response lengkap serta waktu per panggilan.
### Pelacakan Biaya Token LLM

Setiap panggilan LLM di Heym secara otomatis dihitung biayanya. [Traces Tab](../tabs/traces-tab.md) menampilkan jumlah token input dan output per-trace beserta biaya USD real-time yang berasal dari tabel harga yang tersinkronisasi.

- **Biaya per-trace** – Token input, token output, dan total USD ditampilkan pada setiap baris trace
- **Analitik biaya** – Kartu KPI dan grafik biaya per-model diperbarui sesuai rentang waktu yang dipilih (1h / 24h / 7d / 30d / All)
- **LLM Cost Table** – Tabel sistem di [DataTable tab](../tabs/datatable-tab.md) diisi dari Helicone setiap 24 jam; Anda dapat menimpa harga atau menambahkan baris kustom untuk model yang belum terdaftar
- **Peringatan harga tidak tersedia** – Trace untuk model tanpa entri harga akan menampilkan peringatan inline dengan tautan langsung ke tabel biaya

Setiap eksekusi membawa biaya USD-nya sendiri, yang dipecah berdasarkan model.

### Membuka Production Run pada Live Canvas

Workflow produksi tetap dapat diperiksa setelah dimulai di luar editor. Buka entri **Running** mana pun dari salah satu dialog History, atau buka run aktif di dalam kartu Agentic Kanban, dan Heym akan melampirkan editor workflow normal ke eksekusi tersebut.

- Node yang sudah selesai akan langsung muncul beserta hasilnya
- Node saat ini dan node downstream yang tertunda akan terus berdenyut seiring eksekusi berlanjut
- Panel Debug menerima hasil node inkremental yang sama seperti run yang dimulai dari canvas
- Output akhir dan sorotan eksekusi tiba tanpa polling atau memulai run duplikat
- Menutup editor hanya memutus observer; tidak pernah membatalkan workflow produksi

Observer menggunakan SSE yang didukung oleh snapshot eksekusi lintas-worker, sehingga berfungsi untuk trigger webhook, schedule, chat, MCP, integration, dan Board bahkan ketika worker backend lain yang memiliki run tersebut.

### OpenTelemetry, Analitik, dan Alert

Heym memancarkan span [OpenTelemetry](../reference/opentelemetry.md) untuk setiap workflow run, eksekusi node, dan pemanggilan tool Agent, yang diekspor melalui OTLP/HTTP ke Jaeger, Grafana Tempo, Honeycomb, Datadog, atau backend kompatibel lainnya.

Tab [Analytics](../tabs/analytics-tab.md) melacak jumlah run, tingkat keberhasilan, durasi, dan tren per workflow. [Alerts](../tabs/alerts-tab.md) memantau jumlah error, durasi run, pengeluaran token atau USD, dan volume eksekusi dalam jendela waktu tertentu, lalu menjalankan workflow notifikasi yang Anda pilih, sehingga alert dapat mencapai Slack, email, Telegram, atau ke mana pun yang dapat dijangkau oleh Node.

## Evaluate

### Built-In Evals

[Evals Tab](../tabs/evals-tab.md) memungkinkan Anda mendefinisikan test suite dan menjalankannya terhadap workflow agent Anda:

- Buat test case dengan input dan output yang diharapkan, atau hasilkan dari prompt suite
- Jalankan satu suite terhadap beberapa model dan bandingkan outputnya secara berdampingan
- Beri skor dengan Exact Match, Contains, atau LLM-as-Judge dengan model judge independen
- Tinjau pass/fail, aktual vs yang diharapkan, dan riwayat run

Ubah prompt atau model, jalankan ulang suite, dan bandingkan hasilnya sebelum perubahan mencapai produksi.

## Control

### Human-in-the-Loop (HITL)

Heym memiliki sistem [Human-in-the-Loop](../reference/human-in-the-loop.md) bawaan yang memungkinkan agent menjeda eksekusi, meminta tinjauan manusia, dan melanjutkan tepat dari tempat mereka berhenti.

- **Checkpoint Agent** – Aktifkan `hitlEnabled` pada Node Agent mana pun untuk memberinya tool `request_human_review`. Agent memutuskan kapan suatu keputusan memerlukan pengawasan manusia dan memanggil tool tersebut dengan ringkasan dan draf.
- **URL tinjauan publik** – Setiap permintaan tinjauan menghasilkan tautan sekali pakai yang aman di `/review/{token}` (TTL 168 jam). Peninjau dapat **accept**, **edit & continue**, atau **refuse** tanpa perlu masuk.
- **Snapshot eksekusi** – Workflow membekukan status lengkapnya (riwayat percakapan, variabel, hasil tool) sehingga dapat melanjutkan tepat dari tempat ia berhenti setelah peninjau merespons.
- **Cabang notifikasi** – Handle output `review` opsional memungkinkan Anda menghubungkan alur notifikasi (Slack, email, webhook) yang dipicu saat tinjauan diminta.
- **Kebijakan persetujuan tool MCP** – Pedoman HITL tertulis diinterpretasikan menjadi cakupan persetujuan (`always` / `once` / `never`) sehingga agent dapat menyetujui otomatis tool berisiko rendah dan mengeskalasi yang berisiko tinggi.
- **Beberapa checkpoint** – Satu run agent dapat berhenti untuk tinjauan beberapa kali; setiap checkpoint bersifat independen.

URL tinjauan publik, edit-and-continue, percabangan notifikasi, dan resume berbasis snapshot semuanya bekerja dari checkpoint agent yang sama.

Lihat [Human-in-the-Loop](../reference/human-in-the-loop.md) untuk referensi lengkapnya.

### LLM Guardrails

Heym memiliki [Guardrails](../reference/guardrails.md) bawaan pada Node [LLM](../nodes/llm-node.md) dan [Agent](../nodes/agent-node.md), sehingga Anda dapat memblokir konten tidak aman sebelum respons model mencapai langkah downstream.

- **Toggle keamanan tingkat Node** – Aktifkan guardrails langsung pada Node yang menghasilkan atau memproses konten yang ditujukan untuk pengguna
- **Cakupan kebijakan yang luas** – Blokir kekerasan, ujaran kebencian, konten seksual, NSFW/profanity, pelecehan, aktivitas ilegal, permintaan data pribadi, dan upaya prompt injection
- **Deteksi multibahasa** – Terapkan aturan keamanan yang sama di seluruh bahasa Turki, Inggris, Arab, Spanyol, dan bahasa lainnya
- **Fallback native workflow** – Ketika pesan diblokir, Node akan melempar error workflow bertipe yang dapat Anda arahkan melalui [Error Handler](../nodes/error-handler-node.md)

Kebijakan keamanan berada langsung di dalam konfigurasi LLM dan Agent serta terhubung langsung ke percabangan workflow dan penanganan error.
### Akses, Kredensial, dan Audit

Agen bertindak dengan kredensial nyata, sehingga akses menjadi bagian dari tata kelola. [Kredensial](../reference/credentials.md) dienkripsi saat disimpan, disamarkan setelah pembuatan, dan dapat dibagikan kepada pengguna atau [tim](../reference/teams.md), dan tim juga berbagi Workflow, variabel, vector store, serta file Drive. [Single sign-on](../reference/sso.md) menghubungkan penyedia OpenID Connect apa pun, termasuk Okta, Entra ID, Keycloak, Auth0, dan Google. [Jejak audit](../reference/audit.md) mencatat setiap tindakan yang relevan dengan keamanan beserta pelaku, target, dan hasilnya, yang dialirkan bersama log kontainer Anda ke log collector atau SIEM yang sudah Anda jalankan.

### Self-Hosted, Anda Memiliki Data Anda

Heym berjalan di infrastruktur Anda. Workflow, kredensial, riwayat eksekusi, dan trace tersimpan di database Anda sendiri, dan panggilan model mengalir dari server Anda ke penyedia yang Anda pilih, atau ke model yang Anda host sendiri melalui Ollama atau vLLM. Untuk agen yang memproses dokumen sensitif, data pelanggan, atau basis pengetahuan proprietary, hal ini sering menjadi persyaratan mutlak.

Heym dilisensikan di bawah **MIT License dengan ketentuan Commons Clause**. Kode sumber tersedia secara source-available: Anda dapat menggunakan, memodifikasi, dan self-host secara bebas. Commons Clause membatasi penjualan perangkat lunak, termasuk menawarkan hosting berbayar atau layanan konsultasi/dukungan yang nilainya berasal secara substansial dari Heym. Untuk lisensi komersial, deployment enterprise, atau dukungan profesional, hubungi [enterprise@heym.run](mailto:enterprise@heym.run).

## Expose

### API dan Streaming

Workflow dapat dipanggil melalui HTTP di `/api/workflows/{workflow_id}/execute`, yang mengembalikan JSON, dan di `/api/workflows/{workflow_id}/execute/stream`, yang mengalirkan event Node sebagai Server-Sent Events selama proses berjalan. Keduanya berbagi autentikasi tingkat Workflow, pembatasan laju, dan caching respons. Lihat [Webhook](../reference/webhooks.md) dan [SSE Streaming](../reference/sse-streaming.md).

### Integrasi MCP (Model Context Protocol)

Heym memiliki dukungan [MCP](../tabs/mcp-tab.md) native di kedua sisi:

- **Sebagai klien**: Node Agent terhubung ke server MCP eksternal (Filesystem, Browserbase, tool kustom) melalui stdio atau SSE dan mengonsumsi tool-nya secara otomatis
- **Sebagai server**: Workflow dengan MCP yang diaktifkan menjadi tool pada server default di `/api/mcp/sse`, atau pada server bernama dengan URL dan API key-nya sendiri, sehingga Claude Desktop, Cursor, dan klien MCP lainnya dapat memanggil Workflow Heym Anda secara langsung

Agen dapat mengonsumsi beberapa server MCP sekaligus, dan Workflow apa pun dapat menjadi tool bagi klien MCP eksternal.

### Portal: Publikasikan Workflow sebagai Chat UI

Fitur [Portal](../reference/portal.md) mengubah Workflow apa pun menjadi antarmuka chat yang menghadap publik di `/chat/{slug}`:

- Autentikasi opsional dengan kredensial per pengguna
- Eksekusi streaming (progres Node secara real-time)
- Dukungan unggah file
- Riwayat percakapan multi-turn

Tim dapat merilis tool internal, chatbot yang menghadap pelanggan, dan formulir bertenaga AI dari sebuah Workflow dan URL, tanpa perlu menulis kode frontend.

### Dashboard Bertenaga Workflow

[Tab Dashboard](../tabs/dashboard-tab.md) adalah permukaan pelaporan yang dibangun pengguna di mana setiap widget chart didukung oleh Workflow Heym tersembunyinya sendiri. Sebuah widget dapat memanggil API, melakukan kueri BigQuery, mencari di RAG/vector store, menjalankan langkah LLM, mentransformasi baris, dan diakhiri dengan [Node Chart Output](../nodes/chart-output-node.md). Anda dapat membuat widget secara manual, menghasilkannya dengan AI, menyempurnakannya nanti, melakukan cache hasil, dan mengatur ulang grid secara visual.
## Dibandingkan dengan Alat Otomatisasi Workflow

Banyak tim beralih ke Heym dari alat otomatisasi Workflow. Tabel di bawah ini membandingkan Heym dengan n8n, Zapier, dan Make.com pada kemampuan yang krusial ketika agen beroperasi di lingkungan produksi, dan catatan kaki di bawahnya mengutip dokumentasi resmi yang mendasari perbandingan tersebut. Untuk penelusuran lebih mendalam pada satu alat secara spesifik, lihat halaman perbandingan di [heym.run/compare](https://heym.run/compare).

| Kemampuan | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Node LLM bawaan | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + cabang status | ✓ | terbatas¹¹ | –¹¹ | terbatas¹¹ |
| Node Agent bawaan (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Orkestrasi multi-agen | ✓ | ✓ | terbatas | terbatas |
| Node coding agent (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / vector store bawaan | ✓ | ✓ | terbatas¹ | plugin² |
| Baca / tulis WebSocket | ✓ | terbatas¹² | –¹³ | –¹⁴ |
| Pembuat Workflow bahasa alami | ✓ | terbatas³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Membuka proses yang sedang berjalan di kanvas langsung | ✓ | terbatas¹⁹ | terbatas¹⁹ | –¹⁹ |
| Dasbor bertenaga Workflow | ✓ | terbatas¹⁷ | terbatas¹⁷ | terbatas¹⁷ |
| Papan Kanban agentic | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistem Skills untuk agen | ✓ | – | – | – |
| File drive bawaan (tautan berbagi, tim) | ✓ | terbatas²² | terbatas²² | –²² |
| Node otomatisasi browser (Playwright) | ✓ | terbatas²³ | terbatas²³ | –²³ |
| Inspeksi jejak LLM | ✓ | terbatas⁴ | – | ✓ |
| Ekspor tracing OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Pelacakan biaya Token LLM (USD) | ✓ | –¹⁵ | –¹⁵ | terbatas¹⁵ |
| Evals bawaan untuk Workflow AI | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | terbatas⁶ | terbatas⁷ |
| Guardrails LLM | ✓ | ✓⁸ | ✓⁸ | terbatas⁸ |
| Kompresi konteks otomatis | ✓ | – | – | – |
| Eksekusi DAG paralel | ✓ | terbatas⁹ | – | – |
| Dapat di-self-host, sumber tersedia | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL untuk data dinamis | ✓ | ✓ | terbatas | ✓ |
> **Catatan Kaki:** ¹ Zapier Knowledge Sources — tidak ada vector store atau kontrol embedding yang terekspos. ² Make.com memiliki modul Pinecone/Qdrant tetapi tidak memiliki Node RAG native. ³ n8n AI Workflow Builder hanya tersedia sebagai beta di cloud dengan batas kredit. ⁴ n8n menampilkan langkah-langkah perantara; tracing penuh memerlukan alat pihak ketiga. ⁵ n8n mendukung persetujuan AI tool-call melalui chat, email, dan kanal kolaborasi, tetapi tidak melakukan snapshot dan melanjutkan keseluruhan eksekusi seperti yang dilakukan Heym. ⁶ Zapier Human in the Loop mendukung persetujuan dan pengumpulan data di dalam Zap, tetapi bukan sistem checkpoint public-review dengan snapshot-resume. ⁷ Make.com menawarkan Human in the Loop sebagai aplikasi Enterprise dengan permintaan review dan hasil adjusted/approved/canceled, tetapi tetap terbatas pada paket tertentu dan kurang agent-native. ⁸ n8n menyediakan Node Guardrails khusus, Zapier menyediakan AI Guardrails di seluruh produk AI-nya, dan Make.com mendokumentasikan aturan agen beserta alur review tetapi tidak memiliki fitur guardrails mandiri yang sebanding, sehingga Make ditandai terbatas. ⁹ n8n mengeksekusi secara sekuensial secara default; paralelisme memerlukan workaround sub-workflow. ¹⁰ Sustainable Use License — bebas untuk self-host untuk penggunaan internal, redistribusi komersial dibatasi. ¹¹ Per 22 April 2026, dokumentasi resmi n8n menjelaskan HTTP batching dan pola loop/wait alih-alih cabang status batch LLM native, dokumentasi resmi aplikasi ChatGPT Zapier tidak mencantumkan Trigger apa pun dan hanya menyediakan API Request beta generik, dan halaman integrasi OpenAI resmi Make hanya mengekspos aksi batch seperti create/watch completed tetapi bukan Node LLM dengan percabangan status kelas utama, sehingga n8n/Make ditandai terbatas dan Zapier ditandai tidak tersedia untuk pola Workflow spesifik ini. ¹² Dokumentasi resmi n8n mencakup Node HTTP Webhook dan HTTP Request serta ekstensibilitas Code/custom/community, tetapi saya tidak dapat menemukan Node Trigger/send WebSocket pihak pertama, sehingga n8n ditandai terbatas. ¹³ Dokumentasi resmi Zapier mencakup Webhook masuk dan permintaan Webhook/API keluar hanya melalui HTTP, bukan langkah Trigger atau send WebSocket native. ¹⁴ Dokumentasi resmi Make mencakup modul Webhook dan modul permintaan HTTP(S), tetapi saya tidak dapat menemukan modul Trigger atau send WebSocket native. ¹⁵ n8n tidak memiliki pelacakan biaya Token LLM native; Workflow workaround dari komunitas tersedia tetapi memerlukan instalasi manual dan panggilan API pasca-eksekusi (permintaan fitur masih terbuka per Mei 2026). Zapier tidak mengekspos jumlah Token per eksekusi atau biaya USD kepada pengguna; langkah AI hanya mengonsumsi task. Dasbor kredit Make.com sebagian mencerminkan konsumsi Token untuk AI yang dihosting Make (sejak Agustus 2025) tetapi koneksi API key pihak ketiga ditagih sebagai 1 operasi = 1 kredit tanpa penghitungan Token; tidak ada rincian USD per eksekusi berdasarkan model yang tersedia. ¹⁶ Heym memancarkan span OpenTelemetry native (satu per eksekusi Workflow ditambah satu per Node) melalui OTLP/HTTP ke backend apa pun yang kompatibel, dengan propagasi trace-context W3C dan tanpa kode instrumentasi, dikonfigurasi melalui variabel env `HEYM_OTEL_*` dan dinonaktifkan secara default. n8n memiliki integrasi tracing OpenTelemetry yang terdokumentasi untuk eksekusi Workflow dan Node. Zapier dan Make.com tidak mendokumentasikan ekspor OpenTelemetry dari eksekusi Workflow/skenario mereka per Juni 2026. ¹⁷ n8n mendokumentasikan dasbor Insights untuk metrik eksekusi produksi, Zapier mendokumentasikan Zap History plus Task Usage, dan Make.com mendokumentasikan Scenario History; ini adalah permukaan pemantauan/riwayat, bukan widget dasbor kustom yang didukung oleh logika Workflow arbitrer seperti tab Dashboard milik Heym. ¹⁸ Heym Workflow Analyzer menjalankan Workflow bila memungkinkan, membaca hasil eksekusi, dan menghasilkan laporan Markdown yang dapat diedit bersama yang mencakup area perbaikan, tujuan, dan perilaku langkah demi langkah. n8n mendokumentasikan AI Workflow Builder untuk membuat/menyempurnakan/men-debug Workflow, Zapier mendokumentasikan pemecahan masalah AI untuk eksekusi Zap yang error, dan Make.com mendokumentasikan riwayat skenario plus langkah penalaran agen AI, tetapi dokumentasi publik mereka tidak menjelaskan dokumen analisis Workflow bersama yang sadar-eksekusi yang sama. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) mencantumkan eksekusi yang sedang berjalan dan dapat memuat data dari eksekusi sebelumnya ke dalam editor, sementara [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) mengekspos status running di editornya. [Make Scenario History](https://help.make.com/scenario-history) mendokumentasikan detail eksekusi dan log. Dokumentasi publik mereka, yang diperiksa pada 18 Juli 2026, tidak menjelaskan alur persis Heym: membuka eksekusi produksi yang sedang berjalan secara arbitrer dari History atau kartu Kanban, memulihkan snapshot Node saat ini, dan terus menerima animasi Node serta log Debug pada kanvas yang sama. ²⁰ Node [Codex](../nodes/codex-node.md) dan [OpenCode Go](../nodes/opencode-go-node.md) milik Heym menjalankan CLI agen coding nyata di workspace Heym yang terisolasi terhadap repositori GitHub — clone, edit, menghasilkan diff, push branch, buka pull request — sebagai langkah Workflow kelas utama. Per 20 Juli 2026, tidak ada pesaing yang mendokumentasikan hal yang setara: [Node OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) milik n8n mencakup panggilan API chat/assistant, bukan agen coding tingkat repositori, dan dukungan Codex native masih menjadi permintaan komunitas; blog Zapier sendiri mendokumentasikan arah sebaliknya — [Codex menggerakkan alat Zapier melalui Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — bukan Codex sebagai langkah Zap; modul OpenAI Make.com mengekspos completions/assistants/aksi batch, bukan agen coding yang meng-clone repo dan membuka PR. ²¹ [Tab Board](../tabs/board-tab.md) milik Heym adalah papan Kanban agentic bawaan yang kolomnya mengeksekusi Workflow dan kartunya membawa konteks, riwayat percakapan, status eksekusi, dan run. n8n ([integrasi Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integrasi Kanban Tool](https://zapier.com/apps/kanbantool/integrations)), dan Make.com ([integrasi Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) hanya terhubung ke aplikasi kanban pihak ketiga seperti Kanban Tool, Wekan, atau NocoDB; tidak ada yang mendokumentasikan papan bawaan yang menjalankan Workflow-nya sendiri, per 20 Juli 2026. ²² n8n menyimpan data biner eksekusi secara internal (opsional pada [penyimpanan eksternal yang kompatibel dengan S3](https://docs.n8n.io/hosting/scaling/external-storage/)) tetapi tidak mendokumentasikan drive file yang menghadap pengguna dengan tautan berbagi atau berbagi tim, sehingga ditandai terbatas. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) milik Zapier memproses file hanya selama eksekusi Zap berlangsung dan [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) menyimpan nilai teks kecil, sehingga Zapier ditandai terbatas. [data store](https://help.make.com/l6du-data-stores) milik Make.com menyimpan catatan terstruktur dan [penanganan file](https://help.make.com/working-with-files)-nya meneruskan file antar aplikasi tanpa penyimpanan bawaan yang persisten, sehingga Make ditandai tidak tersedia. ²³ [Node Playwright](../nodes/playwright-node.md) milik Heym adalah otomatisasi browser pihak pertama dengan mode langkah visual, langkah yang dihasilkan AI, dan mode kode penuh. n8n hanya menawarkan paket komunitas seperti [n8n-playwright](https://github.com/toema/n8n-playwright) dengan [permintaan fitur untuk Node otomatisasi browser native](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796) yang masih terbuka, sehingga ditandai terbatas. Zapier Agents dapat [menjelajah dan membaca halaman melalui penjelajahan web dan ekstensi Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) tetapi Zapier tidak mendokumentasikan langkah otomatisasi browser berskrip, sehingga ditandai terbatas. Make.com mendokumentasikan modul HTTP dan aplikasi scraping pihak ketiga alih-alih modul otomatisasi browser native apa pun, per 20 Juli 2026.
## Terkait

- [Pendahuluan](./introduction.md) – Ikhtisar platform
- [Mulai Cepat](./quick-start.md) – Bangun Workflow pertama Anda
- [Analisis Workflow](../reference/workflow-analysis.md) – Hasilkan laporan Workflow yang sadar-jalannya (run-aware) dan umpan balik perbaikan
- [Tab Dashboard](../tabs/dashboard-tab.md) – Bangun dashboard berbasis Workflow dengan widget grafik yang dihasilkan AI
- [Node Agent](../nodes/agent-node.md) – Node LLM dengan pemanggilan tool, MCP, dan skills
- [Arsitektur Agent](../reference/agent-architecture.md) – Sub-agent, orkestrator, dan pengiriman tool
- [Tab Board](../tabs/board-tab.md) – Papan Kanban agentik dengan kolom yang mengeksekusi Workflow
- [Node Codex](../nodes/codex-node.md) – Jalankan agen coding OpenAI Codex terhadap repositori GitHub
- [Node OpenCode Go](../nodes/opencode-go-node.md) – Agen coding yang agnostik terhadap penyedia dalam container yang diperkuat
- [Tab Drive](../tabs/drive-tab.md) – Penyimpanan file bawaan dengan tautan berbagi, tim, dan tindakan massal
- [Node Playwright](../nodes/playwright-node.md) – Otomatisasi browser pihak pertama dengan langkah AI dan mode kode
- [Node RAG / Vector Store](../nodes/rag-node.md) – Pencarian vektor dan penyisipan dokumen (Qdrant atau Postgres pgvector)
- [Asisten AI](../reference/ai-assistant.md) – Pembangun Workflow dengan bahasa alami
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Checkpoint Agent dengan URL tinjauan publik
- [Guardrails](../reference/guardrails.md) – Blokir Prompt yang tidak aman sebelum mencapai model Anda
- [Tab Traces](../tabs/traces-tab.md) – Observabilitas pemanggilan LLM
- [Tab Evals](../tabs/evals-tab.md) – Rangkaian pengujian untuk Workflow AI
- [Tab Alerts](../tabs/alerts-tab.md) – Peringatan ambang batas pada error, durasi, biaya, dan volume run
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Ekspor span run, Node, dan tool melalui OTLP
- [Distribusi Beban](../reference/cluster.md) – Bagikan run di seluruh instance dengan failover pemimpin
- [Single Sign-On](../reference/sso.md) – Masuk melalui penyedia OpenID Connect mana pun
- [Audit Logging](../reference/audit.md) – Tindakan yang relevan dengan keamanan beserta aktor, target, dan hasil
- [Portal](../reference/portal.md) – Publikasikan Workflow sebagai UI obrolan publik
- [Eksekusi Paralel](../reference/parallel-execution.md) – Eksekusi konkuren berbasis DAG
- [Tab MCP](../tabs/mcp-tab.md) – Konfigurasi server dan klien MCP
