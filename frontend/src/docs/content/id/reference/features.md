# Kumpulan Fitur Lengkap

Ikhtisar komprehensif dari semua kemampuan Heym. Setiap bagian menjelaskan sebuah fitur atau konsep dalam beberapa kalimat.

---

## Memulai

### [Introduction](../getting-started/introduction.md)

Heym adalah infrastruktur untuk menjalankan dan mengelola agen AI di lingkungan produksi. Anda membangun sistem agentic di atas kanvas visual dan menjalankannya dengan percaya diri: mengorkestrasi agen, mengotomatiskan proses bisnis, memeriksa setiap eksekusi, dan menjaga manusia tetap memegang kendali pada infrastruktur Anda sendiri. Heym mendukung workflow visual, node bertenaga AI ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), sebuah [AI Assistant](./ai-assistant.md), integrasi ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), email masuk melalui [IMAP Trigger](../nodes/imap-trigger-node.md), email keluar melalui [Send Email](../nodes/send-email-node.md)), penjadwalan dengan [Cron](../nodes/cron-node.md), dan portal chat [Portal](./portal.md) untuk pengguna akhir.

Lihat juga [Core Concepts](../getting-started/core-concepts.md), [Node Types](./node-types.md), dan [Third-Party Integrations](./integrations.md).

### [Why Heym](../getting-started/why-heym.md)

Why Heym menelusuri siklus hidup agen (build, orchestrate, run, observe, evaluate, control, expose) dan menunjukkan apa yang ditangani oleh satu runtime self-hosted pada setiap tahap. Hal ini mencakup node [LLM](../nodes/llm-node.md) dan [Agent Node](../nodes/agent-node.md) dengan tool calling, Python tools, koneksi [MCP](../tabs/mcp-tab.md), skills, dan orkestrasi multi-agen; trigger, retry, dan [load distribution](./cluster.md); [Traces](../tabs/traces-tab.md) dengan biaya USD per-run dan ekspor OpenTelemetry; [Evals](../tabs/evals-tab.md); [human review checkpoints](./human-in-the-loop.md), guardrails, SSO, dan audit trail; serta endpoint REST, MCP, dan Portal. Perbandingan kemampuan dengan n8n, Zapier, dan Make.com menutup halaman ini.

Lihat juga [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md), dan [Agent Architecture](./agent-architecture.md).

### [Quick Start](../getting-started/quick-start.md)

Jalankan workflow pertama Anda dalam hitungan menit: buat workflow dari tab [Workflows](../tabs/workflows-tab.md), tambahkan node [Input](../nodes/input-node.md), node [LLM](../nodes/llm-node.md), dan node [Output](../nodes/output-node.md), lalu hubungkan semuanya. Konfigurasikan [LLM](../nodes/llm-node.md) dengan sebuah credential dan atur `userMessage` menjadi `$input.text`; gunakan Run atau [AI Assistant](./ai-assistant.md) untuk mengeksekusi atau menghasilkan workflow dengan bahasa alami.

Berpasangan secara alami dengan [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md), dan [Expression DSL](./expression-dsl.md).

### [Core Concepts](../getting-started/core-concepts.md)

Workflow adalah graf berarah dari node yang dihubungkan oleh edge; eksekusi mengalir dari node trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) melalui node pemrosesan menuju node [Output](../nodes/output-node.md). Setiap node memiliki tipe, data (konfigurasi), dan input/output; edge mendefinisikan aliran data. Node mereferensikan data upstream melalui ekspresi [Expression DSL](./expression-dsl.md) seperti `$nodeLabel.field`; node independen berjalan secara [paralel](./parallel-execution.md) secara otomatis.

Lihat juga [Triggers](./triggers.md), [Parallel Execution](./parallel-execution.md), dan [Workflow Structure](./workflow-structure.md).

### [Running & Deployment](../getting-started/running-and-deployment.md)

Heym menyediakan `run.sh` untuk pengembangan lokal (database di Docker, backend FastAPI, frontend Vite) dan `deploy.sh` untuk produksi dengan Docker Compose. Keduanya menggunakan file `.env`; variabel kunci meliputi `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL`, dan `ALLOW_REGISTER`. Pengembangan berjalan pada port frontend dan backend yang dapat dikonfigurasi; produksi menyajikan API di bawah `/api` melalui container frontend.

Lihat juga [Security](./security.md), [Enterprise](./enterprise.md), dan [Settings](./user-settings.md).

### [Migrate to Heym](../getting-started/migrate-to-heym.md)

Alat AI Convert mengubah workflow dari platform lain (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) atau deskripsi dalam bahasa sehari-hari menjadi workflow Heym, yang dialirkan secara langsung ke kanvas dan siap untuk [diunduh dan diimpor](./download-import.md). Alat ini menjalankan pemeriksaan keamanan AI, lalu menghasilkan DSL dengan batas input dan rate yang telah ditetapkan. Buka di [heym.run/convert](https://heym.run/convert).

Lihat juga [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md), dan [AI Assistant](./ai-assistant.md).

---

## Nodes

### Triggers
#### [Input](../nodes/input-node.md)

Node Input adalah titik masuk untuk workflow yang menerima data dari pengguna atau pemanggil API. Node ini mendukung satu atau beberapa field input dan mengekspos metadata permintaan (headers, query params). Akses field body melalui `$nodeLabel.body.fieldKey`, headers melalui `$nodeLabel.headers`, dan query melalui `$nodeLabel.query`.

Berpasangan secara alami dengan [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md), dan [Output](../nodes/output-node.md). Untuk referensi payload dan akses field, lihat [Expression DSL](./expression-dsl.md) dan [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Node Cron memicu workflow sesuai jadwal menggunakan ekspresi cron lima field standar. Tidak diperlukan input dari pengguna—workflow berjalan secara otomatis pada waktu yang ditentukan (misalnya setiap jam, setiap hari, setiap 15 menit). Output berupa peristiwa trigger tanpa payload.

Lihat juga [Triggers](./triggers.md), [Wait](../nodes/wait-node.md), dan [Execution History](./execution-history.md) untuk eksekusi terjadwal dan tertunda.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Node IMAP Trigger melakukan polling pada kotak masuk dengan interval menit yang dapat dikonfigurasi dan memulai workflow untuk setiap email yang baru terdeteksi. Node ini menghasilkan headers yang telah diurai, daftar pengirim dan penerima, body teks biasa dan HTML, metadata lampiran, serta timestamp trigger. Gunakan untuk triase kotak masuk dukungan, perutean mailbox ke [Slack](../nodes/slack-node.md), atau alur persetujuan berbasis email dengan [Human-in-the-Loop](./human-in-the-loop.md).

Berpasangan dengan [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md), dan [Slack](../nodes/slack-node.md) untuk workflow triase masuk dan respons.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Node Heym Trigger memulai workflow ketika Heym sendiri menerbitkan peristiwa platform: `heym.started`, `workflow.created`, `workflow.updated`, atau `workflow.deleted`. Pengiriman dilakukan secara batch - setiap peristiwa yang diterbitkan dalam satu jendela pengiriman lima detik tiba dalam satu eksekusi sebagai `$nodeLabel.events`, selalu berupa array. Setiap peristiwa diklaim melalui batasan database yang unik, sehingga peristiwa tersebut dipicu tepat satu kali per node yang berlangganan, tidak peduli berapa banyak worker, container, atau mesin yang berjalan. Gunakan untuk jejak audit perubahan workflow, pengumuman deploy, dan ringkasan kesehatan instance.

Berpasangan dengan node [Heym](../nodes/heym-node.md) untuk mencari workflow yang berubah, dan dengan [Loop](../nodes/loop-node.md) untuk bertindak sekali per peristiwa.

#### [Heym](../nodes/heym-node.md)

Node Heym membaca data Heym sendiri melalui tiga operasi: `listWorkflows` mengembalikan setiap workflow yang dapat dijangkau oleh pemilik beserta jumlah node dan timestamp, `getWorkflow` mengembalikan struktur node dan edge dari satu workflow, dan `getExecutionHistory` mengembalikan entri riwayat eksekusi dari yang terbaru dengan filter status, rentang waktu, dan limit opsional, beserta total yang dikelompokkan berdasarkan status. Hasil dibatasi pada pemilik workflow tempat node berada, sehingga eksekusi yang dimulai oleh cron, portal, atau peristiwa mengembalikan data yang sama dengan eksekusi manual. `getWorkflow` mengembalikan konfigurasi node secara lengkap, yang memungkinkan audit workflow untuk menemukan key atau token yang di-hardcode; node ini tidak mengekspos apa pun yang tidak dapat dibuka sendiri oleh pemilik workflow di editor. Tidak diperlukan credential.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Node WebSocket Trigger membuka koneksi klien keluar ke server WebSocket eksternal dan memulai workflow pada `onMessage`, `onConnected`, atau `onClosed`. Node ini mengekspos payload pesan yang telah diurai, status reconnect, metadata penutupan, dan URL socket untuk ekspresi hilir.

Berpasangan dengan [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md), dan [SSE Streaming](./sse-streaming.md) untuk integrasi realtime.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Node Telegram Trigger menerima pembaruan webhook bot dan memulai workflow segera. Node ini mengekspos payload pembaruan lengkap, objek pesan utama, callback query, headers yang telah disanitasi, dan timestamp trigger. Gunakan untuk chatbot, asisten AI di [Telegram](../nodes/telegram-node.md), dan alur yang digerakkan tombol.

Berpasangan dengan [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md), dan [Webhooks](./webhooks.md) untuk workflow yang digerakkan bot.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Node Slack Trigger menerima webhook Slack Events API dan memulai workflow secara otomatis setelah memverifikasi signature permintaan. Node ini mengekspos payload peristiwa dan headers yang telah disanitasi untuk perutean hilir, klasifikasi berbasis [LLM](../nodes/llm-node.md), dan alur balasan.

Berpasangan dengan [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md), dan [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Node Discord Trigger menerima webhook Discord Interactions API, memverifikasi signature Ed25519 dengan credential `discord_trigger` yang dipilih, dan memulai workflow. Node ini mengekspos payload interaksi lengkap, data command, headers yang telah disanitasi, dan metadata trigger untuk perutean atau balasan hilir.

Berpasangan dengan [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md), dan [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Node RabbitMQ mengirim atau menerima pesan dari antrean dan exchange RabbitMQ. Gunakan node ini untuk Workflow yang digerakkan oleh pesan dan pemrosesan peristiwa. Mode kirim mempublikasikan pesan dengan penundaan opsional; mode terima berfungsi sebagai [trigger](./triggers.md) sehingga Workflow dimulai saat pesan tiba. Output mencakup status, message_id, dan body.

Berpasangan dengan [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md), dan [Parallel Execution](./parallel-execution.md) untuk pemrosesan yang digerakkan oleh peristiwa.

#### [Error Handler](../nodes/error-handler-node.md)

Node Error Handler berjalan secara otomatis ketika ada node mana pun dalam Workflow yang gagal. Tidak diperlukan edge masuk; node ini dipicu oleh engine. Output mencakup pesan error, label node yang gagal, tipe node, dan timestamp. Gunakan node ini untuk mengirim notifikasi melalui [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md), atau [Send Email](../nodes/send-email-node.md), mencatat error, atau mengembalikan respons error kustom.

Sebagai alternatif penanganan error di kanvas, sebuah Workflow juga dapat mendelegasikan kegagalan ke Workflow terpisah — lihat [Error Workflow](#error-workflow). Jika kanvas sudah berisi node Error Handler, error workflow **tidak** dipanggil (handler lokal yang diutamakan).

Target notifikasi yang umum adalah [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md), dan [Send Email](../nodes/send-email-node.md); detail eksekusi lebih mudah diperiksa di [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Node AI Agent adalah node [LLM](../nodes/llm-node.md) dengan pemanggilan tool. Node ini dapat menjalankan tool Python, memanggil node kanvas yang terhubung sebagai tool, terhubung ke server [MCP](../tabs/mcp-tab.md), menggunakan skill (file instruksi dan skrip Python opsional), berperan sebagai orkestrator yang mendelegasikan ke node agent lain, dan memanggil Workflow lain sebagai tool. Output tersedia sebagai `$nodeLabel.text`. Toggle opsional **Extra Body** melampirkan objek JSON berisi parameter permintaan spesifik penyedia ke setiap permintaan dalam loop pemanggilan tool; toggle ini nonaktif secara default. Toggle opsional **Use Responses API** mengarahkan pemanggilan model agent melalui Responses API, yang mempertahankan penalaran model di seluruh pemanggilan tool sehingga model penalaran tetap mempertahankan rantai pemikirannya melalui loop multi-langkah; toggle ini nonaktif secara default dan berfungsi dengan OpenAI serta credential kustom.

Tool node kanvas memungkinkan agent memanggil node Workflow yang telah dikonfigurasi langsung dari kanvas. Hubungkan node yang didukung ke handle tool agent, lalu tandai field tertentu sebagai disediakan agent dengan ikon bot. Field tersebut menjadi parameter tool saat runtime, sementara credential dan field yang tidak ditandai tetap terkunci dalam konfigurasi node.

Bagian Skills kini mencakup **AI Build** untuk membuat skill baru, aksi edit AI inline untuk skill yang sudah ada, unduhan ZIP per skill, dan toggle opsional **Enable Drive files** untuk skill yang perlu membaca file Heym Drive saat runtime. Modal Skill Builder menampilkan percakapan chat secara streaming di sisi kiri, menerima file drag-and-drop dengan setiap komentar fine-tune, menampilkan pratinjau read-only langsung dari file `SKILL.md` dan `.py` yang dihasilkan di sisi kanan, dapat mengunduh pratinjau tersebut sebagai ZIP, dan menyimpan file fine-tune yang diunggah kembali sebagai aset skill yang dibundel melalui alur ingest ZIP yang sama dengan yang digunakan untuk unggahan manual.

Dengan **[Agent Persistent Memory](./agent-persistent-memory.md)** yang diaktifkan, setiap node agent menyimpan knowledge graph-nya sendiri: fakta dimuat ke dalam system prompt saat tidak kosong, dan eksekusi yang berhasil memicu penggabungan di latar belakang atas entitas dan relasi baru. Sub-agent menggunakan graph terpisah. Anda dapat **membagikan** graph agent dengan agent lain (dalam Workflow yang sama atau berbeda) dengan akses read-only atau read/write dari dialog graph. Kontrol brain di kanvas membuka editor graph.

Node agent juga dapat masuk ke mode [Human-in-the-Loop](./human-in-the-loop.md). Dalam mode ini agent mendapatkan tool `request_human_review` dan dapat berhenti pada langkah tertentu yang memerlukan persetujuan, membuat tautan review publik sekali pakai, mengekspos cabang kanvas `review` untuk alur notifikasi, dan menunggu hingga reviewer menerima, mengedit, atau menolak teks review Markdown. Field HITL pada node berfungsi sebagai panduan persetujuan untuk menentukan kapan harus bertanya, sementara ringkasan yang ditampilkan ke reviewer dihasilkan dari setiap permintaan review. Untuk tool [MCP](../tabs/mcp-tab.md), Heym menggunakan model untuk menafsirkan instruksi tertulis tersebut menjadi `always`, `once`, atau `never`, sehingga bahasa persetujuan bebas dipetakan ke kebijakan runtime yang konkret. Eksekusi ditandai `pending` dan dilanjutkan dari snapshot eksekusi yang tersimpan setelah keputusan diterima, dan eksekusi agent yang sama dapat berhenti lebih dari sekali jika langkah berikutnya juga memerlukan review.

Node agent secara otomatis memadatkan riwayat pesan yang terakumulasi ketika mendekati 80% dari context window model. System prompt, pesan pengguna pertama, dan pesan pengguna terbaru selalu dipertahankan; semua di antaranya diringkas menggunakan model dan credential yang sama. Peristiwa pemadatan terlihat di panel Debug, [Execution History](./execution-history.md), dan tab [Traces](../tabs/traces-tab.md).

Lihat juga [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md), dan [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Node Codex menjalankan OpenAI Codex CLI di dalam workspace Heym yang terisolasi. Node ini menerima kredensial Codex (masuk dengan ChatGPT untuk menggunakan langganan Anda tanpa biaya API per token, atau tempelkan access token), kredensial GitHub, URL repositori, base branch, prompt tugas, mode publikasi (`diff_only` atau `draft_pr`), nama branch, dan timeout. Runner melakukan clone repositori secara lokal, meneruskan bundel token ChatGPT atau `CODEX_ACCESS_TOKEN` hanya ke proses Codex, dan mengembalikan ringkasan terstruktur, catatan validasi, file yang diubah, diff, metadata penggunaan, dan URL draft PR opsional.

Ketika Codex mengembalikan `needs_input`, workflow akan berhenti sementara dan mengekspos branch `question`. Hubungkan branch tersebut ke Slack, email, atau node notifikasi lainnya; tautan tindak lanjut publik akan melanjutkan snapshot eksekusi yang tersimpan setelah jawaban dikirimkan. Node Codex juga dapat dilampirkan ke AI Agent sebagai tool, sehingga agent dapat mendelegasikan tugas pengkodean; sebagai tool, hasil `needs_input` dikembalikan secara inline ke agent alih-alih menghentikan workflow.

Lihat juga [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), dan [Node Types](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Node OpenCode Go menjalankan OpenCode CLI (Go) terhadap repositori GitHub. Isolasi mengikuti pola Codex: secara lokal dijalankan sebagai subproses host, sedangkan deployment Docker menjalankannya di dalam container saudara yang diperketat yang berbagi volume workspace. Node ini menerima kredensial OpenCode Go (kunci API gateway dengan base URL opsional), kredensial GitHub, URL repositori, base branch, prompt tugas, mode publikasi, nama branch, timeout, dan model `opencode-go/<model>` yang dipilih dari daftar model langsung yang dapat dicari (dengan fallback bawaan). Heym melakukan semua operasi git/GitHub pada host dan tidak pernah menempatkan token GitHub di dalam sandbox; OpenCode hanya mengedit file di disk. Node ini mengembalikan ringkasan terstruktur, catatan validasi, file yang diubah, diff, dan URL pull request opsional. Node ini dapat dilampirkan ke AI Agent sebagai tool.

Lihat juga [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), dan [Node Types](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Node LLM memproses teks dengan model bahasa atau menghasilkan gambar. Node ini mendukung pembuatan teks, vision (input gambar), pembuatan gambar, output JSON terstruktur, eksekusi Batch API native provider untuk endpoint OpenAI dan OpenAI-compatible yang didukung, serta toggle opsional **Use Responses API** yang mengarahkan panggilan melalui Responses API alih-alih Chat Completions (nonaktif secara bawaan; berfungsi dengan OpenAI dan kredensial kustom, dan tidak dapat digabungkan dengan mode Batch). Konfigurasikan kredensial, model, pesan sistem dan pengguna, temperature, dan max tokens; gunakan [Expression DSL](./expression-dsl.md) dalam prompt. Dalam mode batch, `userMessage` harus menghasilkan array, node memancarkan branch `batchStatus` dengan pembaruan progres, dan output akhir menyertakan hasil batch per item. Toggle opsional **Extra Body** melampirkan objek JSON berisi parameter permintaan spesifik provider (misalnya `{"thinking": {"type": "disabled"}}`) ke setiap panggilan API; toggle ini nonaktif secara bawaan. [Guardrails](./guardrails.md) opsional memblokir konten tidak aman sebelum panggilan dilakukan.

Berpasangan secara alami dengan [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md), dan [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Node Decision mengajukan pertanyaan berjenis kepada model keputusan tentang status eksekusi dan mengembalikan probabilitas alih-alih prosa. Field **State** membawa apa yang harus dibaca oleh model — ekspresi tunggal mempertahankan tipenya sendiri, sehingga `$input` mengirim objeknya alih-alih teksnya — dan daftar pertanyaan membawa penilaian. Pertanyaan hadir dalam tiga bentuk: **noul** menjawab apakah suatu kondisi terpenuhi, **choice** memilih satu opsi dari himpunan yang Anda tentukan dan mengembalikan distribusi penuh, dan **score** menilai state sepanjang level terurut dan dapat berada di antara level tersebut. Jawaban choice dan score juga membawa confidence, sehingga [Switch](../nodes/switch-node.md) dapat melakukan routing berdasarkan jawaban sementara [Condition](../nodes/condition-node.md) melakukan gating berdasarkan seberapa yakin jawaban tersebut. **Generate with AI** menyusun templat state dan baris pertanyaan dari kalimat biasa, dan **Custom request body** mengirim JSON yang ditulis tangan untuk endpoint yang kontraknya berbeda. Respons provider diteruskan tanpa perubahan, dan setiap panggilan dicatat dalam [Traces](../tabs/traces-tab.md).

Memerlukan kredensial Decision Model; berpasangan secara alami dengan [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md), dan [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Node RAG / Vector Store menyisipkan, melakukan upsert, menghapus, dan mencari dokumen di dalam vector store untuk retrieval-augmented generation. Dropdown Database memilih backend — **Qdrant** (server eksternal) atau **Postgres (pgvector)** (database milik Heym sendiri, tanpa layanan eksternal), dengan default Qdrant. Pilih vector store dari tab [Vectorstores](../tabs/vectorstores-tab.md) dan atur operasi menjadi insert, upsert, delete, atau search. Upsert dan delete mengalamatkan dokumen berdasarkan id unik yang tersimpan di dalam payload — sebuah **Document ID Field** menamai field tersebut (default `doc_id`) dan **Document ID** membawa nilainya — sehingga dokumen tetap menggunakan id yang sudah dipakai sistem Anda sendiri: upsert menggantikan setiap point yang cocok sebelum menyimpan versi baru, dan delete melaporkan apakah ada yang cocok. Metadata dokumen menerima ekspresi pada nilainya, sehingga `{"url": "$start.url"}` menyimpan apa yang dihasilkan oleh run. Search mendukung filter metadata dan reranking Cohere opsional, serta mengembalikan array hasil dengan text, score, metadata, flag reranked, dan count untuk digunakan pada alur [LLM](../nodes/llm-node.md) atau [Agent Node](../nodes/agent-node.md).

Node hilir yang umum digunakan adalah [LLM](../nodes/llm-node.md) dan [Agent Node](../nodes/agent-node.md); penyiapan vector store terdapat di [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Node MCP Call memanggil tool [MCP](../tabs/mcp-tab.md) tertentu secara langsung, tanpa LLM yang menentukan tool mana yang harus dipanggil. Gunakan node ini ketika Anda sudah tahu persis tool mana yang akan dijalankan pada saat desain — untuk eksekusi tool MCP satu langkah yang deterministik di dalam workflow. Konfigurasikan koneksi (SSE, Streamable HTTP, atau stdio; field yang sama dengan koneksi MCP pada [Agent Node](../nodes/agent-node.md)), klik **Fetch Tools** untuk mengisi dropdown, pilih sebuah tool, dan isi field argumen yang dirender secara otomatis dari input schema tool tersebut. Setiap argumen menerima nilai statis atau [ekspresi DSL](./expression-dsl.md) seperti `$userInput.body.text`. Hasilnya tersedia sebagai `$nodeLabel.result` (objek JSON jika dapat di-parse, jika tidak berupa string). Node MCP Call tidak dapat dihubungkan ke [Agent Node](../nodes/agent-node.md) sebagai canvas tool.

Lihat juga [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md), dan [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Node Condition mencabangkan workflow berdasarkan ekspresi if/else. Node ini memiliki dua output handle: satu untuk ketika kondisi bernilai truthy dan satu untuk falsy. Gunakan operator perbandingan dan logika dari [Expression DSL](./expression-dsl.md) pada ekspresi kondisi; node ini meneruskan input ke cabang yang dipilih.

Lihat juga [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md), dan [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Node Switch mengarahkan eksekusi ke jalur yang berbeda dengan mencocokkan sebuah nilai terhadap case. Konfigurasikan ekspresi yang akan dievaluasi dan daftar nilai case; setiap case mendapatkan source handle dan sebuah default handle digunakan untuk nilai yang tidak cocok. Input diteruskan ke cabang yang cocok.

Gunakan [Condition](../nodes/condition-node.md) untuk percabangan biner dan [Merge](../nodes/merge-node.md) untuk menggabungkan kembali jalur yang telah diarahkan; aturan pencocokan dibahas di [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Node Merge menunggu beberapa input paralel dan menggabungkannya menjadi satu output tunggal. Atur jumlah input yang akan ditunggu; node ini menghasilkan objek gabungan setelah semua cabang selesai. Gunakan node ini untuk menggabungkan hasil dari cabang paralel sebelum melanjutkan; jangan gunakan ketika cabang paralel berakhir di node Output yang terpisah.

Lihat juga [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md), dan [Output](../nodes/output-node.md) saat menggabungkan kembali cabang.

#### [Loop](../nodes/loop-node.md)

Node Loop melakukan iterasi pada sebuah array, mengeksekusi node hilir untuk setiap item. Node ini memerlukan back-connection dari node terakhir di dalam body iterasi untuk melanjutkan. Di dalam body loop gunakan `item`, `index`, `total`, `isFirst`, dan `isLast`; loop memiliki output terpisah untuk jalur iterasi dan jalur done.

Berpasangan dengan [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md), dan [Expression DSL](./expression-dsl.md) untuk workflow iteratif.

### Data

#### [Set](../nodes/set-node.md)

Node Set mentransformasi dan memetakan data input ke output kustom. Definisikan pemetaan key-value di mana setiap nilai merupakan ekspresi [Expression DSL](./expression-dsl.md). Gunakan node ini untuk uppercase, substring, konkatenasi, angka acak, dan transformasi serupa. Akses output berdasarkan key (misalnya `$setNode.keyName`). Ketika dihubungkan ke agent sebagai canvas node tool, nilai pemetaan dapat ditandai sebagai agent-provided sehingga agent mengisinya saat runtime. Untuk memanggil workflow lain gunakan node [Execute](../nodes/execute-node.md).

Lihat juga [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md), dan [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Node Converter mengonversi data antar format tanpa menulis kode. Konversi teks meliputi `csvToJson` (teks CSV menjadi array objek baris, atau array ketika tidak ada header), `jsonToCsv` (array objek/baris menjadi teks CSV), `xmlToJson` (teks XML menjadi objek), dan `jsonToXml` (objek menjadi teks XML). Konfigurasikan arah konversi dan ekspresi sumber; konversi CSV juga menggunakan delimiter dan penanganan header, dan `jsonToCsv` dapat menetapkan urutan kolom secara eksplisit. Pengutipan, delimiter tersemat, dan baris baru tersemat mengikuti RFC 4180. Atribut XML menggunakan prefiks `@`, teks yang bercampur dengan atribut menggunakan `#text`, elemen berulang menjadi array, dan ekspansi entitas XML dinonaktifkan. Node yang sama juga bekerja pada file yang tersimpan. `imageToText` dan `pdfToText` menjalankan Tesseract OCR, membaca file dari Heym Drive (`$Upload.file.id` dari File upload trigger, hasil node Drive, atau file yang dihasilkan agen), memilih bahasa secara otomatis dari skrip yang terdeteksi atau menggunakan kode yang Anda tentukan seperti `tur` atau `eng+tur`, dan menormalkan teks ke UTF-8 secara default dengan normalisasi NFC opsional dan charset yang lebih sempit seperti `cp1254`. `fileConvert` menulis ulang file yang tersimpan dalam format lain, dokumen melalui pandoc dan gambar melalui Pillow, serta menyimpan hasilnya sebagai file Drive baru tanpa mengubah file asli. Hasilnya tersedia sebagai `$converterNode.result`, dengan `.language`, `.encoding`, `.page_count`, `.pages`, dan `.file` di sampingnya untuk eksekusi OCR, serta `.id`, `.filename`, dan `.download_url` untuk `fileConvert`.

Lihat juga [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), dan [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Node Code menjalankan Python yang Anda tulis, dengan `requirements.txt`-nya sendiri, dalam container yang dibuat dan dihancurkan untuk setiap eksekusi. Kode Anda mendefinisikan fungsi `main(params)` dan mengembalikan nilai apa pun yang dapat diserialisasi JSON, yang menjadi `$codeNode.result`; apa pun yang dicetaknya ditangkap secara terpisah sebagai `$codeNode.logs`, dan `$codeNode.install` melaporkan alat mana yang memasang dependensi. Parameter dikonfigurasi sebagai objek JSON yang ekspresi `$`-nya diselesaikan sebelum eksekusi, dan kode membacanya dengan notasi titik seperti `params.user.name` atau `params.orders[0].id`. Dependensi dipasang dengan `uv`, dengan fallback ke `pip` untuk paket yang tidak dapat ditangani `uv`, tanpa caching antar eksekusi; membiarkan `requirements.txt` kosong akan melewati instalasi sepenuhnya dan jauh lebih cepat. Fase eksekusi tidak memiliki jaringan kecuali `codeAllowNetwork` diaktifkan, sementara instalasi dependensi selalu menjangkau PyPI. Sandbox berjalan sebagai non-root dengan semua kapabilitas dihapus, filesystem root read-only, tanpa Docker socket, dan tanpa akses ke secret backend, dibatasi pada 512 MB memori, satu CPU, 256 proses, instalasi 120 detik, dan eksekusi 60 detik. Docker diperlukan dan tidak ada mode fallback: tanpa daemon yang dapat dijangkau, node akan gagal alih-alih menjalankan kode Anda dalam proses backend.

#### [Variable](../nodes/variable-node.md)

Node Variable menetapkan atau memperbarui variabel lokal workflow (`$vars.variableName`) atau [global variable](./global-variables.md) yang persisten (`$global.variableName`). Gunakan untuk counter, daftar terakumulasi, dan state bersama. Konfigurasikan nama variabel, ekspresi nilai, type coercion, dan apakah akan disimpan di global store. Variabel array mendukung `$array()` dan `.add()`.

Berpasangan dengan [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md), dan [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Node Execute memanggil workflow lain (sub-workflow) dan meneruskan input ke sana. Tentukan workflow target berdasarkan ID dan berikan input melalui satu ekspresi atau pemetaan key-value. Output mencakup workflow_id, status, dan outputs; gunakan untuk logika yang dapat digunakan ulang, bukan untuk transformasi data (gunakan Set untuk itu).

Lihat juga [Canvas Features](./canvas-features.md) untuk Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md), dan [Output](../nodes/output-node.md).

### Integrations

#### [HTTP](../nodes/http-node.md)

Node HTTP membuat permintaan HTTP menggunakan konfigurasi bergaya cURL. Node ini dapat menjadi titik awal workflow (tanpa edge masuk) atau menerima input dari node hulu. Respons tersedia sebagai status, headers, dan body (JSON yang di-parse bila berlaku). Gunakan [Credentials](./credentials.md) untuk autentikasi Bearer atau header kustom.

Berpasangan dengan [Webhooks](./webhooks.md), [Credentials](./credentials.md), dan [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Node WebSocket Send membuka koneksi klien keluar, mengirim satu pesan teks/JSON/biner, lalu menutupnya. Gunakan untuk memublikasikan output workflow ke sistem realtime tanpa membuat endpoint socket yang dihosting Heym.

Lihat juga [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md), dan [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Node Telegram mengirim pesan bot ke chat, grup, atau kanal. Konfigurasikan [credential](./credentials.md) Telegram, tetapkan `chatId`, dan susun `message` keluar dengan ekspresi [Expression DSL](./expression-dsl.md). Node ini secara alami berpasangan dengan [Telegram Trigger](../nodes/telegram-trigger-node.md) untuk Workflow percakapan dan dengan [Error Handler](../nodes/error-handler-node.md) untuk peringatan operator.

Lihat juga [Third-Party Integrations](./integrations.md) dan [Credentials](./credentials.md) untuk penyiapan dan pola credential.

#### [Slack](../nodes/slack-node.md)

Node Slack mengirim pesan ke kanal Slack melalui Incoming Webhook. Konfigurasikan [credential](./credentials.md) Slack dan ekspresi pesan. Gunakan untuk notifikasi, peringatan, dan pelaporan error; output diteruskan dari input.

Berpasangan dengan [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md), dan [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Node Discord mengirim pesan ke kanal Discord melalui Incoming Webhook. Konfigurasikan [credential](./credentials.md) Discord, susun pesan keluar dengan [Expression DSL](./expression-dsl.md), dan secara opsional tetapkan penimpaan username atau avatar webhook.

Berpasangan dengan [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md), dan [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Node Send Email mengirim email melalui SMTP. Konfigurasikan [credential](./credentials.md) SMTP dan ekspresi [Expression DSL](./expression-dsl.md) untuk penerima, subjek, dan isi. Gunakan untuk notifikasi, peringatan, dan email transaksional. Output mencakup status, to, dan subject.

[IMAP Trigger](../nodes/imap-trigger-node.md) melengkapi Send Email dengan menangani email masuk. Bersama-sama keduanya memungkinkan Workflow membaca email masuk dari kotak masuk bersama, meringkas atau mengklasifikasikannya dengan node AI, dan mengirim pesan tindak lanjut atau eskalasi. [Telegram Trigger](../nodes/telegram-trigger-node.md) dan [Telegram node](../nodes/telegram-node.md) menyediakan pola masuk/keluar yang sama untuk Workflow chat yang digerakkan bot.

Untuk alur notifikasi dua arah, node ini juga berpasangan dengan baik dengan [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), dan [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Node Redis melakukan operasi Redis: set, get, hasKey, dan deleteKey. Gunakan untuk caching, pembatasan laju, dan penyimpanan key-value. Konfigurasikan [credential](./credentials.md), jenis operasi, ekspresi key, dan untuk operasi set, value serta TTL opsional. Output bervariasi menurut operasi (value, success, exists, deleted).

Berpasangan dengan [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md), dan [Parallel Execution](./parallel-execution.md) untuk caching, throttling, dan koordinasi.

#### [Grist](../nodes/grist-node.md)

Node Grist membaca, menulis, dan mengelola data di spreadsheet Grist. Operasi mencakup getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables, dan listColumns. Sediakan document ID, table ID, dan untuk create/update, data record menggunakan column ID. Gunakan untuk CRUD, pembaruan batch, dan otomatisasi spreadsheet.

Lihat juga [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md), dan [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Node Google Sheets membaca, menulis, dan mengelola data spreadsheet melalui OAuth2. Gunakan untuk membaca laporan, menambahkan hasil Workflow, memperbarui pelacak, dan membersihkan atau memeriksa tab sheet dari dalam Workflow. Seperti [BigQuery](../nodes/bigquery-node.md), node ini menggunakan credential integrasi berbasis Google dan cocok berdampingan dengan [Grist](../nodes/grist-node.md) ketika data spreadsheet menjadi bagian dari alur.

Berpasangan dengan [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md), dan [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Node BigQuery menjalankan kueri SQL dan menyisipkan baris ke dataset Google BigQuery melalui OAuth2. Node ini berguna untuk Workflow analitik, pipeline pelaporan, dan penulisan data peristiwa terstruktur dari eksekusi Workflow. Node ini sering berpasangan dengan [Set](../nodes/set-node.md) untuk membentuk baris dan [Google Sheets](../nodes/google-sheets-node.md) untuk pelaporan yang lebih ringan berbasis spreadsheet.

Berpasangan dengan [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md), dan [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Node Google Drive mendaftar, mengunduh, memperbarui, dan menghapus file serta folder Drive melalui OAuth2, dan dapat menyalin file Drive langsung ke [Heym Drive](../nodes/drive-node.md) dengan operasi `syncToHeymDrive`-nya. Google Docs, Sheets, dan Slides tidak memiliki byte yang dapat diunduh, sehingga node mengekspornya secara otomatis — Docs ke PDF, Sheets ke XLSX, Slides ke PPTX — dengan opsi override untuk format target. Penghapusan memindahkan item ke Drive trash kecuali "Delete permanently" diaktifkan, dan node menolak menghapus folder melalui operasi file atau sebaliknya. Seperti [Google Sheets](../nodes/google-sheets-node.md), node ini menggunakan kredensial OAuth2 yang didukung Google; perhatikan bahwa node ini meminta akses Drive penuh, jadi tinjau [Credential Sharing](./credentials-sharing.md) sebelum membagikannya.

Berpasangan dengan [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md), dan [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Node GitHub menyediakan 40 aksi REST GitHub native yang mencakup repositori, organisasi dan pengguna, issue, pull request, review, rilis, workflow Actions, insight traffic, dan file repositori. Gunakan node ini untuk triase issue, otomatisasi review, workflow dispatch dan penantian penyelesaian, otomatisasi rilis, dan pembaruan file repo tanpa membangun permintaan HTTP secara manual. Node ini mendukung GitHub.com dan `base_url` GitHub Enterprise opsional pada kredensial.

Berpasangan dengan [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md), dan [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Node Jira menghubungkan workflow ke Jira Cloud atau Jira Data Center / Server REST API untuk otomatisasi proyek, issue, komentar, lampiran, pengguna, notifikasi, dan transisi. Node ini dapat mendaftar proyek, mencari issue dengan JQL, membuat atau memperbarui issue, memeriksa changelog, memberi tahu pemangku kepentingan, mengelola komentar dan lampiran, mengambil atau mengelola pengguna, mendaftar transisi yang tersedia, dan memindahkan issue melalui transition ID. Gunakan kredensial Jira dengan email Atlassian, API token, base URL situs, dan mode deployment.

Berpasangan dengan [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md), dan [Third-Party Integrations](./integrations.md) untuk intake dukungan, triase bug, dan workflow rilis.

#### [Linear](../nodes/linear-node.md)

Node Linear menghubungkan workflow ke GraphQL API Linear untuk otomatisasi workspace dan issue. Node ini dapat mendaftar tim, proyek, issue, workflow state, anggota tim, dan komentar; membuat, memperbarui, menghapus, dan menautkan issue; serta membuat, memperbarui, menyelesaikan, membatalkan penyelesaian, atau menghapus komentar. Gunakan personal API key atau kredensial OAuth2 Linear, lalu temukan UUID tim, proyek, state, dan assignee dari operasi list sebelum membuat atau memperbarui issue.

Berpasangan dengan [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md), dan [Third-Party Integrations](./integrations.md) untuk workflow intake, triase, dan backlog engineering.

#### [Supabase](../nodes/supabase-node.md)

Node Supabase membaca dan mengubah tabel yang diekspos melalui Supabase PostgREST. Node ini cocok untuk backend produk, data pengguna/profil, workflow state, dan otomatisasi bergaya CRUD yang menginginkan akses database tanpa pengkabelan permintaan HTTP kustom.

Berpasangan dengan [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md), dan [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Node ClickHouse menjalankan operasi CRUD, count, dan SQL mentah terhadap database ClickHouse eksternal melalui antarmuka HTTP-nya. Node ini cocok untuk pipeline analitik, pencatatan event, dan workflow pelaporan: sisipkan event saat terjadi, lalu agregasikan atau hitung dengan `query`/`count`. Node ini mencerminkan kumpulan operasi [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) ditambah jalur escape SQL mentah, dengan `update`/`remove` dijalankan sebagai mutasi ClickHouse.

Berpasangan dengan [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) untuk laporan terjadwal, dan [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Node Notion mengelola database, data source, halaman, dan blok Notion melalui Notion API terkini (`2026-03-11`). Node ini mendukung pencarian, CRUD halaman, operasi database dan data source, block children, append/update/delete blok, serta trash/restore. Gunakan internal integration token atau kredensial OAuth2 integrasi publik Notion. Editor dapat mencari dan melakukan cursor-paginate pada data source dan halaman induk yang dapat diakses. Kredensial bersama berfungsi sama seperti kredensial milik sendiri untuk eksekusi workflow.

Untuk panggilan REST kustom, `$credentials.YourNotionCredential` menghasilkan bearer token yang sama. Berpasangan dengan [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md), dan [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Node Sentry mengotomatiskan organisasi, proyek, tim, issue, event, dan rilis Sentry melalui Sentry REST API. Gunakan node ini untuk triase alert, pembaruan status issue, otomatisasi rilis, pencarian event, serta penyiapan atau pembersihan proyek/tim. Node ini mendukung Sentry SaaS dan Sentry yang di-host sendiri (self-hosted) melalui base URL kredensial opsional.

Berpasangan dengan [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md), dan [Third-Party Integrations](./integrations.md) untuk workflow insiden dan rilis.

#### [DataTable](../nodes/datatable-node.md)

Node DataTable membaca, menulis, dan mengelola data di Heym DataTables (penyimpanan terstruktur pihak pertama). Operasinya meliputi find, getAll, getById, insert, update, remove, dan upsert. Tidak memerlukan kredensial eksternal. Tabel dikelola dari tab dasbor [DataTable](../tabs/datatable-tab.md) dan diakses langsung oleh pemilik workflow.

Berpasangan dengan [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), dan [tab DataTable](../tabs/datatable-tab.md) untuk penyimpanan terstruktur pihak pertama.

#### [Drive](../nodes/drive-node.md)

Node Drive mengelola file yang dihasilkan oleh skill langsung dari dalam workflow. Operasinya meliputi delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams, dan unshareWithMyTeams untuk manajemen akses tim hanya-baca; konversi format berada di node [Converter](../nodes/converter-node.md). Referensikan file dengan `$agentLabel._generated_files[0].id`; outputnya meliputi status, file_id, download_url yang diperbarui untuk batasan tautan, dan shared_team_count untuk berbagi ke tim. Ini sangat berguna pada workflow [Agent Node](../nodes/agent-node.md) yang menggunakan [File Generation](./file-generation.md) dan model referensi [Drive](./drive.md).

Pendamping umumnya adalah [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md), dan [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Node Amazon S3 menjalankan operasi penyimpanan objek pada Amazon S3 menggunakan kredensial `s3` (access key, secret key, region, session token opsional). Operasinya meliputi putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder, dan listBuckets. Unggah teks serta unduh teks atau base64 didukung, dengan kolom bucket dan key menerima [Expression DSL](./expression-dsl.md). Gunakan node ini untuk menyimpan output workflow, mengarsipkan file, dan membaca objek kembali ke dalam alur.

Berpasangan dengan [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md), dan [Third-Party Integrations](./integrations.md).

### Automation

#### [Crawler](../nodes/crawler-node.md)

Node Crawler melakukan scraping halaman web menggunakan FlareSolverr dengan ekstraksi HTML opsional melalui CSS selector. Konfigurasikan [credential](./credentials.md) FlareSolverr, ekspresi URL, waktu tunggu, dan selector opsional untuk ekstraksi. Outputnya adalah HTML mentah atau konten yang diekstraksi. Gunakan node ini untuk web scraping dan ekstraksi konten.

Berpasangan dengan [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md), dan [LLM](../nodes/llm-node.md) untuk alur scrape-and-analyze.

#### [Playwright](../nodes/playwright-node.md)

Node Playwright mengotomatiskan interaksi browser dengan langkah-langkah yang dapat dikonfigurasi (navigate, refresh, click, type, screenshot, extract, aiStep) atau mode **Run Code** untuk Playwright Python kustom (sandboxed; nonaktif secara default melalui `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Node ini mendukung mode headless, pengaturan opsional yang mengurangi sinyal otomatisasi Playwright umum, timeout, penangkapan jaringan opsional (responses, cookies, localStorage, sessionStorage), bootstrap autentikasi cookie/storageState dari ekspresi [Global Variables](./global-variables.md) seperti `$global.authState`, langkah login fallback ketika pemulihan autentikasi gagal, dan langkah AI dengan Auto Heal ketika selector gagal. Gunakan node ini untuk web scraping, pengisian formulir, dan workflow berbasis browser.

Lihat juga [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md), dan [Execution History](./execution-history.md) untuk otomatisasi browser dan debugging.

### Utilities

#### [Output](../nodes/output-node.md)

Node Output adalah endpoint workflow yang mengembalikan respons kepada pemanggil. Tetapkan ekspresi message untuk mereferensikan node sebelumnya berdasarkan label (jangan pernah menggunakan `$input` dari node [Input](../nodes/input-node.md) di sini). Async downstream opsional memungkinkan node setelah output berjalan di latar belakang setelah respons dikirim.

Sumber upstream yang umum adalah [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), dan [Execute](../nodes/execute-node.md); pembentukan respons lebih mudah di-debug di [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Node JSON output mapper membangun objek JSON biasa dari pemetaan key-value bergaya [Set](../nodes/set-node.md) dan mengembalikannya pada root respons workflow. Gunakan node ini ketika pemanggil API harus menerima body JSON mentah alih-alih pembungkus node [Output](../nodes/output-node.md) standar.
#### [Pemeta keluaran HTML](../nodes/html-output-mapper-node.md)

Node pemeta keluaran HTML merender satu templat HTML, dengan menginterpolasi ekspresi `$nodeLabel.field` ke dalam halaman. Ketika node ini merupakan satu-satunya node terminal pada workflow, webhook execute akan merespons dengan `text/html` dan kode status yang dikonfigurasi pada node tersebut alih-alih body JSON, sehingga sebuah workflow dapat menyajikan halaman secara langsung kepada browser. Kirim `X-Simple-Response: false` untuk mendapatkan envelope JSON seperti biasa guna keperluan debugging.

Berpasangan dengan [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md), dan [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Node Chart Output adalah node terminal dari workflow widget [Dashboard](../tabs/dashboard-tab.md). Node ini mengubah baris yang dihasilkan oleh node-node hulu menjadi payload chart terstandardisasi yang dirender oleh dashboard. Pilih `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text, atau HITL), petakan `labelField`/`valueField` (atau `series` untuk multi-series, atau `text` untuk pesan markdown), dan tempatkan di posisi terakhir; node ini tidak memiliki output edge. HITL mengabaikan baris dari hulu dan menampilkan daftar tinjauan manusia yang tertunda.

Lihat juga [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md), dan [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Node Wait menjeda eksekusi workflow selama durasi tertentu dalam milidetik, hingga 15 menit. Gunakan untuk rate limiting, tindakan tertunda, atau interval polling. Node ini meneruskan input tanpa perubahan.

Berpasangan dengan [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md), dan [Parallel Execution](./parallel-execution.md) untuk pengaturan tempo dan polling.

#### [Sticky Note](../nodes/sticky-note-node.md)

Node Sticky Note menambahkan catatan markdown ke canvas. Node ini tidak dieksekusi. Gunakan untuk dokumentasi, instruksi, atau catatan workflow bersama [Canvas Features](./canvas-features.md) lainnya. Klik ganda pada canvas untuk mengedit konten catatan.

Lihat juga [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md), dan [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Node Console Log mencatat sebuah nilai ke konsol backend (server). Gunakan untuk debugging dan inspeksi selama pengembangan. Pesan log mendukung ekspresi [Expression DSL](./expression-dsl.md); output diteruskan dari input.

Berpasangan dengan [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), dan [Expression Evaluation Dialog](./expression-evaluation-dialog.md) untuk debugging.

#### [Disable Node](../nodes/disable-node.md)

Node Disable Node menonaktifkan node lain secara permanen dalam workflow dengan menetapkan flag `active`-nya menjadi false. Tentukan node target berdasarkan label. Gunakan untuk operasi sekali jalan seperti menghentikan trigger [Cron](../nodes/cron-node.md) setelah suatu kondisi terpenuhi.

Lihat juga [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), dan [Cron](../nodes/cron-node.md) untuk pola kontrol workflow.

#### [Enable Node](../nodes/enable-node.md)

Node Enable Node mengaktifkan kembali node lain dengan menetapkan flag `active`-nya menjadi true dan menyimpan perubahan tersebut. Tentukan node target berdasarkan label. Gunakan untuk mengaktifkan kembali trigger [Cron](../nodes/cron-node.md) yang dinonaktifkan dari titik masuk lain, atau untuk mengaktifkan sebuah node setelah suatu kondisi terpenuhi. Target yang berada di hilir Enable Node dan belum berjalan juga akan berjalan pada eksekusi saat ini.

Lihat juga [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md), dan [Cron](../nodes/cron-node.md) untuk pola kontrol workflow.

#### [Throw Error](../nodes/throw-error-node.md)

Node Throw Error menghentikan eksekusi workflow segera dan mengembalikan respons error dengan kode status HTTP kustom. Tetapkan ekspresi pesan error dan kode status (misalnya 400, 401, 403, 404, 429, 500). Gunakan untuk kegagalan validasi, akses tidak sah, atau kondisi error lainnya, terutama bila dipasangkan dengan [Condition](../nodes/condition-node.md) dan [Error Handler](../nodes/error-handler-node.md).

Berpasangan dengan [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md), dan [Security](./security.md) untuk jalur kegagalan yang eksplisit.

---

## Referensi
### [Tipe Node](./node-types.md)

Heym menyediakan berbagai tipe node: trigger seperti [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), dan [Error Handler](../nodes/error-handler-node.md); node AI seperti [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md), dan [MCP Call](../nodes/mcp-call-node.md); node logika seperti [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md), dan [Loop](../nodes/loop-node.md); node data seperti [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md), dan [Heym](../nodes/heym-node.md); integrasi seperti [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md), dan [Drive](../nodes/drive-node.md); node otomatisasi seperti [Crawler](../nodes/crawler-node.md) dan [Playwright](../nodes/playwright-node.md); serta utilitas seperti [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md), dan [Sticky Note](../nodes/sticky-note-node.md). Gunakan ekspresi seperti `$input.text` dan `$nodeLabel.field` dalam konfigurasi node.

Lihat juga [Trigger](./triggers.md), [Integrasi Pihak Ketiga](./integrations.md), dan [Eksekusi Paralel](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym menggunakan bahasa ekspresi sederhana untuk mereferensikan data dari node upstream. Gunakan `$input` untuk node [Input](../nodes/input-node.md), `$nodeLabel.field` untuk node upstream mana pun, `$credentials.CredentialName` untuk [credentials](./credentials.md), dan `$global.variableName` untuk [global variables](./global-variables.md). Variabel khusus bawaan meliputi `$now`, `$UUID`, dan metadata workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl`, dan `$executionId` (id [Execution History](./execution-history.md) dari proses eksekusi — `/workflows/{id}/{executionId}` membuka eksekusi tersebut di kanvas; hanya tersedia saat runtime, kosong pada dialog pratinjau ekspresi). Dukungan meliputi literal, aritmetika, perbandingan, konteks [Loop](../nodes/loop-node.md), field bersarang, dan helper string/array (termasuk `$text.toJson()` untuk mengurai string JSON). Ketika nilai penuh berupa satu `$expr`, backend mempertahankan array, objek, boolean, dan angka sebagai tipe native.

Lihat juga [Dialog Evaluasi Ekspresi](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md), dan [Struktur Workflow](./workflow-structure.md).

### [Global Variables](./global-variables.md)

Global Variable Store menyimpan data key-value persisten yang tercakup pada pengguna dan bertahan di seluruh eksekusi workflow. Buat variabel dari tab [Variables](../tabs/global-variables-tab.md) atau dari node [Variable](../nodes/variable-node.md) dengan opsi "Store in Global Variable Store" yang diaktifkan. Akses variabel tersebut dengan `$global.variableName` dalam ekspresi; variabel dapat dibagikan kepada pengguna lain atau [teams](./teams.md).

Berpasangan dengan [Variable](../nodes/variable-node.md), [Teams](./teams.md), dan [Credentials Sharing](./credentials-sharing.md) untuk state workflow yang dibagikan.
### [Dialog Evaluasi Ekspresi](./expression-evaluation-dialog.md)

Dialog Evaluasi Ekspresi adalah editor yang dapat diperluas yang muncul saat Anda mengklik tombol perluas di samping kolom ekspresi. Dialog ini terbuka sebagai modal besar yang terpusat, menjaga autocomplete tetap aktif, dan menyegarkan output pratinjau backend secara otomatis setelah Anda berhenti mengetik. Hasil objek dan array dapat ditelusuri dengan pemilih jalur output. Dialog ini menerima jalur titik telanjang satu baris penuh (misalnya `myNode.output.field`) seolah-olah merupakan `$myNode.output.field`; lihat aturan penempatan [Expression DSL](./expression-dsl.md).

Tombol **Build with AI** di toolbar memungkinkan Anda mendeskripsikan ekspresi yang Anda inginkan dalam teks biasa. Pilih [credential](./credentials.md) dan model LLM, ketik deskripsi seperti *"Get the customer name from the API response"*, lalu klik Generate. Backend mengirimkan konteks [Expression DSL](./expression-dsl.md) dan output node dari eksekusi terakhir ke model dan mengembalikan satu string ekspresi. Hasilnya dievaluasi segera sehingga Anda dapat memverifikasinya sebelum mengklik Apply.

Berpasangan secara alami dengan [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md), dan [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Struktur Workflow](./workflow-structure.md)

Workflow disimpan sebagai JSON dengan node dan edge. Objek workflow mencakup id, name, description, nodes, edges, dan pengaturan auth. Setiap node memiliki id, type, position, dan data (label dan konfigurasi khusus tipe). Edge menghubungkan ID node sumber dan target dengan ID handle opsional. Sintaks ekspresi di kolom data mengikuti [Expression DSL](./expression-dsl.md), dan bentuk yang sama digunakan oleh [Download & Import](./download-import.md).

Lihat juga [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md), dan [Download & Import](./download-import.md).

### [Fitur Canvas](./canvas-features.md)

Arahkan kursor ke node canvas non-sticky mana pun dan klik **Run** untuk mengeksekusi hingga node tersebut. Input yang diperlukan terbuka di panel Run dengan kolom pertama yang difokuskan; jalur tanpa input dimulai segera. Lihat [Run to Node](./canvas-features.md#run-to-node).

Editor workflow menyediakan Data Pin (sematkan output terakhir sebuah node untuk pengujian hilir tanpa menjalankan ulang), Execution Logs (hasil node dan kemajuan agen secara real-time yang melengkapi [Execution History](./execution-history.md)), Enable/Disable (lewati node selama eksekusi), dan Extract to Sub-Workflow (pindahkan pilihan ke workflow baru dan ganti dengan node [Execute](../nodes/execute-node.md)). Eksekusi produksi yang sedang berjalan dapat dibuka dari History atau kartu Board; editor memulihkan snapshot saat ini, terhubung ke SSE, dan menjaga animasi canvas serta log Debug tetap aktif. [Keyboard Shortcuts](./keyboard-shortcuts.md) mendukung copy, paste, run, dan pencarian node inline.

Lihat juga [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md), dan [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym menyediakan pintasan di seluruh editor: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo, dan Escape untuk menutup. Di canvas: pilih semua, pilih beberapa, copy/cut/paste, hapus, alihkan node aktif (D), alihkan data yang disematkan (P), dan pencarian node inline dengan mengetik. Pintasan didokumentasikan dalam referensi dalam aplikasi dan bekerja erat dengan [Canvas Features](./canvas-features.md) seperti Data Pin dan pengaktifan/penonaktifan node.

Lihat juga [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md), dan [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant adalah panel obrolan yang dibuka dari panel Debug yang memungkinkan Anda membuat atau memodifikasi workflow dengan bahasa alami. Pilih [credential](./credentials.md) dan model, lalu deskripsikan apa yang Anda inginkan; AI mengalirkan respons dan [workflow JSON](./workflow-structure.md) yang valid dalam blok kode secara otomatis diuraikan dan diterapkan ke canvas. Input suara didukung pada browser yang kompatibel.

Aktifkan **YOLO mode** (mode Agent, nonaktif secara default) dan asisten akan menguji apa yang dibuatnya. Setelah setiap perubahan, ia menjalankan workflow di canvas, membaca hasilnya, dan memperbaiki workflow hingga melakukan apa yang Anda minta, hingga 5 kali eksekusi per pesan. Ia meminta input pengujian sebelum eksekusi pertama, dapat menjalankan workflow Anda yang lain saat membutuhkan hasilnya, dan menampilkan setiap langkah saat ia bekerja. Lihat [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Saat workflow menyimpan catatan, asisten menanyakan [data table](../tabs/datatable-tab.md) mana yang akan digunakan, atau membuatnya dengan kolom yang dibutuhkan workflow. Lihat [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Saat workflow saat ini berisi skill [Agent Node](../nodes/agent-node.md), asisten hanya mengirim `SKILL.md` setiap skill ke dalam konteks workflow. File `.py` yang dilampirkan dan aset skill biner dikecualikan sebelum permintaan sehingga bundel skill yang besar tidak meluap ke jendela konteks model.

Berpasangan dengan baik dengan [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md), dan [Expression DSL](./expression-dsl.md).
### [Chat with Heym](./chat-with-heym.md)

Chat with Heym adalah asisten header dokumentasi untuk pertanyaan seputar produk. Fitur ini terbuka dalam dialog di tengah layar, menjaga pilihan kredensial dan model tetap terlihat di bagian atas, menyisipkan jalur halaman dokumentasi yang aktif sebagai konteks, dan menghapus riwayat pesan saat dialog ditutup. Fitur ini melengkapi [AI Assistant](./ai-assistant.md) yang lebih luas dan [Contextual Showcase](./contextual-showcase.md) yang lebih ringan.

Lihat juga [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md), dan [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

Administrator instance (`HEYM_ADMIN_EMAILS`) dapat mengakses dan mengedit setiap workflow, menemukan workflow milik pemilik berdasarkan email, memeriksa jadwal dan riwayat eksekusi, menjeda dan melanjutkan Trigger otomatis, serta menghapus workflow setelah eksekusi selesai. Lihat [Instance Administration](../tabs/workflows-tab.md#instance-administration) untuk alur offboarding dan perbedaan antara menjeda Trigger otomatis dan memblokir semua panggilan.

Workflow dapat diorganisasikan dalam folder dan sub-folder dalam struktur pohon. Folder memiliki nama dan parent opsional; workflow ditetapkan ke folder. Workflow dapat dijadwalkan untuk dihapus (dipindahkan ke area trash sebelum penghapusan permanen). API mendukung pembuatan, pembaruan, penghapusan, dan pemindahan workflow antar folder, dan model organisasi yang sama muncul di tab [Workflows](../tabs/workflows-tab.md).

Lihat juga [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md), dan [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer adalah panel fast-run tetap di sisi kanan untuk halaman internal non-canvas. Fitur ini memungkinkan Anda mencari [workflow](../tabs/workflows-tab.md), menyematkan favorit, memilih input, menjalankan segera, dan memeriksa progres atau hasil tanpa membuka editor. Workflow dengan [File Upload Trigger](../nodes/file-upload-trigger-node.md) menerima file yang dilepas atau dipilih. Urutan pin dan workflow yang terakhir dipilih disimpan di browser.

Lihat juga [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md), dan [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase adalah panduan ringkas dalam aplikasi untuk permukaan utama yang terautentikasi seperti tab dashboard, [Evals](../tabs/evals-tab.md), Docs, dan editor workflow. Fitur ini tetap tertutup secara default, menampilkan ringkasan halaman singkat terlebih dahulu, menawarkan sedikit detail tambahan sesuai permintaan, dan menautkan ke artikel dokumentasi lengkap ketika Anda menginginkan panduan yang lebih mendalam.

Berpasangan dengan [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md), dan [AI Assistant](./ai-assistant.md) untuk alur panduan dalam aplikasi.

### [Credentials](./credentials.md)

Credentials menyimpan API key dan secret yang digunakan oleh node workflow. Tambahkan di tab [Credentials](../tabs/credentials-tab.md) dan rujuk berdasarkan nama atau ID di node seperti [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md), dan [Redis](../nodes/redis-node.md). Credentials dienkripsi saat disimpan, dapat dibagikan dengan pengguna atau [teams](./teams.md), dan juga dapat dirujuk dalam [Expression DSL](./expression-dsl.md) melalui `$credentials.Name`.

Lihat juga [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md), dan [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Credentials dapat dibagikan dengan pengguna lain melalui email atau dengan teams; semua anggota team mendapatkan akses ketika sebuah credential dibagikan dengan team. Credentials yang dibagikan muncul dengan indikator di tab [Credentials](../tabs/credentials-tab.md). Saat runtime, konteks pemilik workflow menggabungkan credentials yang dimiliki, yang dibagikan ke pengguna, dan yang dibagikan ke team. Gunakan `$credentials.CredentialName` dalam ekspresi atau tetapkan credentialId di data node.

Lihat juga [Credentials](./credentials.md), [Teams](./teams.md), dan [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Teams memungkinkan Anda membagikan workflow, credentials, global variables, vector store, dan file Drive dengan sekelompok pengguna sekaligus. Buat team dari tab [Teams](../tabs/teams-tab.md) dan tambahkan anggota berdasarkan email. Bagikan sumber daya dengan team dari dialog berbagi yang relevan; semua anggota kemudian memiliki akses. Pembuat dapat mengedit dan menghapus team; menghapus team akan menghapus semua pembagian team.

Berpasangan dengan [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md), dan [Enterprise](./enterprise.md).

### [Parallel Execution](./parallel-execution.md)

Heym menjalankan node secara paralel ketika node tersebut tidak memiliki dependensi satu sama lain. Executor membangun DAG dan menjalankan node pada level yang sama secara bersamaan dengan thread pool; segera setelah sebuah node selesai, node hilirnya dijadwalkan. Gunakan node [Merge](../nodes/merge-node.md) untuk menggabungkan cabang paralel bila diperlukan. Beberapa eksekusi workflow berjalan secara bersamaan; setiap eksekusi terisolasi. Mode [SSE Streaming](./sse-streaming.md) memancarkan event saat node selesai.

Lihat juga [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md), dan [Execution History](./execution-history.md).
### [Arsitektur Agent](./agent-architecture.md)

[Node Agent](../nodes/agent-node.md) mendukung sub-agent (orchestrator memanggil node agent lain melalui call_sub_agent), sub-workflow (agent memanggil workflow lain melalui call_sub_workflow), skill (konten instruksi dan alat Python dari .zip atau .md), serta koneksi klien [MCP](../tabs/mcp-tab.md). Eksekutor alat orchestrator merutekan panggilan sub-agent dan sub-workflow; alat lainnya diarahkan ke eksekutor Python, MCP, atau skill. Kedalaman nesting maksimum untuk sub-agent dan sub-workflow adalah 5. Loop pemanggilan alat mencakup kompresi konteks otomatis: sebelum setiap iterasi, penggunaan token diperkirakan dan jika melebihi 80% dari jendela konteks model, pesan-pesan di tengah diringkas menggunakan model yang sama, dengan tetap mempertahankan system prompt, pesan pengguna pertama, dan pesan pengguna terakhir secara utuh.

Lihat juga [Node Agent](../nodes/agent-node.md), [Memori Persisten Agent](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md), dan [MCP](../tabs/mcp-tab.md).

### [Memori Persisten Agent](./agent-persistent-memory.md)

Graf pengetahuan opsional per-[Node Agent](../nodes/agent-node.md) yang disimpan di Postgres: entitas, tipe, properti, dan relasi terarah. Ketika `persistentMemoryEnabled` bernilai true, graf tersebut diringkas ke dalam system prompt pada setiap eksekusi; setelah penyelesaian yang berhasil, sebuah [LLM](../nodes/llm-node.md) mengekstrak pembaruan terstruktur di latar belakang. REST CRUD tersedia di bawah `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Editor terbuka dari kontrol otak berwarna merah muda pada node.

Lihat juga [Node Agent](../nodes/agent-node.md), [Arsitektur Agent](./agent-architecture.md), dan [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop memungkinkan [Node Agent](../nodes/agent-node.md) meminta persetujuan pada checkpoint tertentu, membuat halaman publik `/review/{token}`, dan menunggu peninjau yang tidak login untuk menerima, mengedit, atau menolak teks tinjauan Markdown. Agent yang mendukung HITL juga menyediakan handle output `review` sehingga Anda dapat memberi notifikasi ke [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md), atau kanal lain selama eksekusi masih tertunda. Teks HITL tingkat node digunakan sebagai panduan persetujuan, sedangkan ringkasan halaman publik dihasilkan dari permintaan tinjauan itu sendiri. Eksekusi yang tertunda langsung muncul di [Riwayat Eksekusi](./execution-history.md), dapat terjadi lebih dari sekali dalam eksekusi yang sama, dan dilanjutkan dari snapshot workflow yang tersimpan secara persis setelah setiap keputusan dikirimkan.

Lihat juga [Node Agent](../nodes/agent-node.md), [Portal](./portal.md), [Riwayat Eksekusi](./execution-history.md), dan [Send Email](../nodes/send-email-node.md).

### [Webhook](./webhooks.md)

Workflow dapat dipicu melalui [HTTP](../nodes/http-node.md) di `POST /api/workflows/{workflow_id}/execute`, atau dialirkan secara inkremental dari `POST /api/workflows/{workflow_id}/execute/stream`. Body permintaan diteruskan sebagai body ke node [Input](../nodes/input-node.md); header dan query param tersedia dalam ekspresi [Expression DSL](./expression-dsl.md). Konfigurasikan autentikasi per-workflow: anonim, JWT, atau header kustom. Caching respons opsional, pembatasan laju, dan dialog Run with cURL di editor semuanya berada pada workflow dan berlaku untuk kedua mode.

Lihat juga [Input](../nodes/input-node.md), [Token Eksekusi](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md), dan [Struktur Workflow](./workflow-structure.md).

### [Token Eksekusi](./execution-tokens.md)

Token eksekusi adalah JWT dengan cakupan yang memberikan akses ke endpoint execute dan stream satu workflow. Ketika sebuah workflow menggunakan autentikasi JWT, token memungkinkan skrip eksternal, pipeline CI, dan integrasi memanggil workflow tanpa berbagi sesi pengguna. Setiap token membawa klaim `wid` yang mengikatnya ke satu workflow, `jti` yang digunakan untuk pencabutan instan, dan TTL yang dapat dikonfigurasi (60 detik hingga 10 tahun). Buat, pilih, dan cabut token langsung dari dialog **Run with cURL** — token yang dipilih secara otomatis disematkan dalam perintah yang dihasilkan.

Lihat juga [Webhook](./webhooks.md), [Keamanan](./security.md), dan [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Dialog cURL dapat mengalihkan eksekusi [webhook](./webhooks.md) ke mode Server-Sent Events. Ini menghasilkan event `execution_started`, `node_start`, `node_complete`, dan `execution_complete` secara real time, menambahkan `--no-buffer` ke perintah cURL yang dihasilkan, dan memungkinkan Anda mengonfigurasi pesan mulai per-node seperti `[START] LLM` atau teks kustom untuk konsumen terminal eksternal.

Lihat juga [Webhook](./webhooks.md), [Riwayat Eksekusi](./execution-history.md), dan [LLM](../nodes/llm-node.md).
### [Trigger](./triggers.md)

Workflow dimulai oleh node trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) receive) atau titik masuk: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), penjadwal Cron, webhook Telegram, webhook interaksi Discord, manajer trigger IMAP, konsumer RabbitMQ, atau eksekusi Editor. Setiap trigger memiliki endpoint atau proses latar belakangnya sendiri; [Cron](../nodes/cron-node.md) berjalan setiap 60 detik, node [Telegram Trigger](../nodes/telegram-trigger-node.md) menerima webhook bot, node [Discord Trigger](../nodes/discord-trigger-node.md) menerima webhook interaksi yang ditandatangani, dan node [IMAP Trigger](../nodes/imap-trigger-node.md) berjalan pada interval polling yang dikonfigurasi. Node [Input](../nodes/input-node.md) menerima body, headers, dan query dari permintaan webhook.

Lihat juga [Tipe Node](./node-types.md), [Webhook](./webhooks.md), dan [Eksekusi Paralel](./parallel-execution.md).

### [Riwayat Eksekusi](./execution-history.md)

Riwayat eksekusi mencatat setiap eksekusi workflow: input, output, hasil node, status, dan sumber trigger. Akses dari toolbar Editor, tampilan Docs, header Dashboard, atau tampilan [Evals](../tabs/evals-tab.md). Riwayat per-workflow menampilkan eksekusi untuk workflow yang sedang dibuka; tampilan semua riwayat menampilkan eksekusi di seluruh workflow dan chat. Eksekusi yang sedang berjalan muncul di bagian atas kedua dialog dengan aksi **Open live** dan **Cancel**. Open live melampirkan editor ke eksekusi yang ada melalui [SSE](./sse-streaming.md), memulihkan node yang telah selesai, menandai node saat ini dan yang tertunda, serta menambahkan log Debug tanpa memulai eksekusi baru. Bring to Canvas memuat input dan output node dari eksekusi yang telah selesai untuk dijalankan ulang atau di-debug; tautan langsung `/workflows/{workflowId}/{executionId}` mendukung eksekusi yang sedang berjalan maupun yang telah selesai. Eksekusi yang dijeda oleh [Human-in-the-Loop](./human-in-the-loop.md) disimpan segera sebagai `pending`, termasuk URL tinjauan publik dan node notifikasi apa pun yang dijalankan dari cabang `review` agen. Jika server dimulai ulang di tengah eksekusi, eksekusi yang terputus dipulihkan secara otomatis: eksekusi dijalankan ulang dari awal dengan input yang sama dan ditampilkan sebagai selesai (ditandai **Recovered**), dikendalikan oleh toggle **Auto-recover runs** per-workflow yang sebagai alternatif dapat mencatatnya sebagai `skipped`.

Lihat juga [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md), dan [Traces](../tabs/traces-tab.md).

### Execution Highlights

Setelah eksekusi langsung — atau setelah **Bring to Canvas** — popup **Execution Highlights** yang dapat ditutup muncul di kanan atas Canvas, menampilkan apa yang dihasilkan setiap node dalam urutan eksekusi. Ini adalah cara cepat untuk memeriksa output per-node tanpa membuka setiap node; tutup dengan **✕**, dan popup akan terbuka kembali pada eksekusi berikutnya. Highlights juga ditampilkan pada eksekusi dashboard. Lihat [Riwayat Eksekusi](./execution-history.md) untuk detailnya.

### [Riwayat Edit](./edit-history.md)

Riwayat Edit melacak versi tersimpan dari sebuah workflow (setiap Save membuat satu versi). Lihat daftar, buka versi untuk melihat diff terhadap workflow saat ini ([node](./workflow-structure.md), edge, konfigurasi), dan Revert untuk memulihkan versi sebelumnya. Berbeda dengan [Riwayat Eksekusi](./execution-history.md), Riwayat Edit melacak perubahan struktur, bukan eksekusi.

Lihat juga [Riwayat Eksekusi](./execution-history.md), [Struktur Workflow](./workflow-structure.md), dan [Fitur Canvas](./canvas-features.md).

### Error Workflow

Sebuah workflow dapat menunjuk workflow lain untuk dijalankan ketika terjadi kegagalan. Konfigurasikan di panel **Properties** tingkat workflow (ditampilkan saat tidak ada node yang dipilih) di bawah **On error, run workflow**. Hanya pemilik workflow yang dapat mengatur, mengubah, atau menghapusnya; lihat [Pengaturan khusus pemilik](./workflow-organization.md#owner-only-settings). Ketika eksekusi tingkat atas berakhir dengan kegagalan yang tidak ditangani, error workflow yang dipilih akan dijalankan dan menerima konteks kegagalan (id dan nama workflow yang gagal, id eksekusi, pesan error, label dan tipe node yang gagal, serta timestamp). Jika canvas sudah berisi node [Error Handler](../nodes/error-handler-node.md), handler lokal akan diprioritaskan dan error workflow **tidak** dipanggil. Error workflow itu sendiri berjalan secara langsung, sehingga tidak akan memicu error workflow-nya sendiri.

Ini mencakup setiap eksekusi tingkat atas non-tes: kedua endpoint eksekusi, [Portal](./portal.md), dan setiap trigger, termasuk [cron](../nodes/cron-node.md), trigger platform chat, email, antrean, [MCP](../tabs/mcp-tab.md), dan widget dashboard. Dengan [Load Distribution](./cluster.md) yang diaktifkan, hal ini tidak berubah, termasuk eksekusi yang dijalankan oleh worker: node yang gagal dikembalikan bersama hasilnya, dan error workflow kemudian didistribusikan seperti eksekusi lainnya, sehingga node di dalamnya yang harus berjalan pada instance utama tetap berjalan demikian. Dua kasus sengaja dikecualikan, karena hasil workflow itu sendiri belum diketahui: eksekusi yang tidak pernah dijalankan oleh instance mana pun, dan wait yang timeout sementara eksekusi mungkin masih berjalan. Ini juga **tidak** dipicu oleh eksekusi tes manual di canvas.
### Workflow Timeout

Setiap workflow dapat menetapkan **workflow timeout** dalam satuan detik pada panel **Properties** tingkat workflow. `0` (nilai default) menonaktifkannya. Jika ditetapkan, proses yang melebihi batas akan dihentikan pada batas node berikutnya dan dicatat sebagai proses yang gagal dengan error "timed out". Timeout berlaku untuk proses manual, API, dan yang dipicu oleh trigger. Node [Wait](../nodes/wait-node.md) yang berdurasi panjang akan diinterupsi segera alih-alih terblokir selama durasi penuhnya.

### Time Saved

Setiap workflow dapat mencatat **estimasi waktu yang dihemat per proses** (dalam menit), yang ditetapkan pada panel **Properties** tingkat workflow. Tab [Analytics](../tabs/analytics-tab.md) mengagregasi nilai ini pada rentang yang dipilih sebagai statistik total **Time Saved** (jumlah dari estimasi setiap workflow × prosesnya yang berhasil). Most Used juga mencantumkan jumlah tersebut per workflow; **Not Set** membuka kolom estimasi ketika belum ditetapkan. Laporan [Workflow Analysis](./workflow-analysis.md) merekomendasikan penetapan estimasi ketika belum dikonfigurasi.

### [Settings](./user-settings.md)

Dialog Settings (dibuka dari avatar Anda di header) memiliki empat tab: Profile (foto Gravatar, nama tampilan, User Rules), [Security](./security.md) (ubah kata sandi), Voice ([ElevenLabs TTS/STT](./chat-voice.md)), dan Observability (status [OpenTelemetry](./opentelemetry.md) hanya-baca). User Rules adalah instruksi kustom yang disisipkan ke setiap permintaan AI, termasuk workflow builder dan [Chat](../tabs/chat-tab.md), sehingga Anda dapat menetapkan bahasa, nada, gaya penulisan kode, atau konvensi workflow satu kali saja. Kebijakan kata sandi dan pengelolaan API key [MCP](../tabs/mcp-tab.md) juga tersedia.

Lihat juga [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md), dan [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym dapat memancarkan trace OpenTelemetry untuk setiap proses workflow dan eksekusi node: span root `heym.workflow.execute` per proses dan span anak `heym.node.execute` per node, dengan penggunaan model dan token yang dilampirkan pada node LLM dan agent. Span diekspor melalui OTLP/HTTP ke backend kompatibel mana pun (Jaeger, Grafana Tempo, Honeycomb, Datadog), dan konteks trace W3C dipropagasikan melintasi webhook masuk, HTTP keluar, dan sub-workflow. Tracing dinonaktifkan secara default dan dikonfigurasi dengan [environment variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; status aktif ditampilkan pada tab Observability di [Settings](./user-settings.md).

Lihat juga [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), dan [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Ekspor workflow saat ini sebagai JSON dari toolbar Editor (tombol Download); file tersebut mencakup node dan edge. Impor dengan menyeret file JSON ke tab [Workflows](../tabs/workflows-tab.md) (membuat workflow baru) atau ke canvas (mengganti atau menggabungkan). JSON harus menyertakan array nodes; name dan edges bersifat opsional. Gunakan untuk pencadangan, berbagi, atau migrasi antar instance.

Lihat juga [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md), dan [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal mengekspos workflow sebagai UI chat publik di `/chat/{slug}`. Konfigurasikan portal_enabled, slug, autentikasi opsional (pengguna portal), streaming, dan unggahan file per workflow. Pengguna akhir berinteraksi melalui antarmuka chat tanpa login ke Heym; output gambar dapat ditampilkan di chat. Workflow Portal juga dapat dialihkan ke halaman tinjauan [Human-in-the-Loop](./human-in-the-loop.md) ketika [Agent Node](../nodes/agent-node.md) memerlukan persetujuan, sementara cabang `review` milik agent mengirimkan notifikasi ke saluran lain. Gunakan untuk alat internal, chatbot yang menghadap pelanggan, dan formulir bertenaga AI.

Lihat juga [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md), dan [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skill dapat menghasilkan file seperti PDF, DOCX, CSV, JSON, dan gambar selama eksekusi dengan menulis ke workspace `_OUTPUT_DIR`. Heym menangkap file tersebut secara otomatis, menyimpannya, dan mengekspos metadata unduhan di bawah `_generated_files`, yang kemudian dapat dikelola dengan [Drive node](../nodes/drive-node.md) atau ditinjau pada tab [Drive](../tabs/drive-tab.md).

Lihat juga [Agent Node](../nodes/agent-node.md), [Drive](./drive.md), dan [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive adalah lapisan penyimpanan dan berbagi bersama untuk file yang dihasilkan oleh skill. Drive memungkinkan Anda menelusuri file, membuat tautan publik atau yang dilindungi kata sandi, menerapkan kedaluwarsa dan batas unduhan, membagikan file secara hanya-baca dengan tim Anda, serta mengelola file tersebut secara programatik dengan [Drive node](../nodes/drive-node.md) atau secara manual dari tab [Drive](../tabs/drive-tab.md).

Lihat juga [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md), dan [Portal](./portal.md).
### [Keamanan](./security.md)

Heym menerapkan kebijakan kata sandi (panjang, huruf besar, huruf kecil, digit), menyimpan access token dalam cookie HttpOnly, dan merotasi refresh token saat digunakan. Pembatasan laju berlaku untuk login, register, dan login [Portal](./portal.md). [Credentials](./credentials.md) dienkripsi saat disimpan dengan AES-256 (Fernet). API key [MCP](../tabs/mcp-tab.md) digunakan untuk autentikasi klien; keamanan konten tersedia melalui [Guardrails](./guardrails.md) pada node [LLM](../nodes/llm-node.md) dan [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) menyediakan JWT dengan cakupan per-workflow untuk pemanggil eksternal.

Lihat juga [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md), dan [Credentials](./credentials.md).

### [Single Sign-On](./sso.md)

Heym mengautentikasi pengguna terhadap penyedia OpenID Connect eksternal mana pun - Keycloak, Okta, Entra ID, Auth0, Google - yang dikonfigurasi saat runtime dari **Settings → SSO** oleh administrator instans yang terdaftar dalam `HEYM_ADMIN_EMAILS`. Hanya URL issuer dan kredensial klien yang dimasukkan; setiap endpoint berasal dari dokumen discovery penyedia, sehingga tidak ada penyedia yang di-hardcode. Proses masuk menggunakan Authorization Code dengan PKCE, dan ID token diverifikasi terhadap kunci yang dipublikasikan penyedia. Akun dipetakan berdasarkan `(issuer, subject)` terlebih dahulu dan email terverifikasi kedua, dengan auto-provisioning opsional yang dibatasi pada allowlist domain email. Proses masuk dengan kata sandi tetap tersedia bersama SSO dan dapat dinonaktifkan setelah uji koneksi berhasil, dengan akun `HEYM_ADMIN_EMAILS` dikecualikan agar penyedia yang salah konfigurasi tidak dapat mengunci instans.

Lihat juga [Settings](./user-settings.md), [Security](./security.md), dan [Audit Logging](./audit.md).

### [Distribusi Beban](./cluster.md)

Arahkan instans Heym kedua ke database yang sama dan instans tersebut akan bergabung sebagai worker. Proses latar belakang - cron, webhook, pemanggilan alat MCP, chat trigger - dibagi di antara instans berdasarkan persentase yang ditetapkan administrator instans di bawah **Settings → Instances**, dengan status, latensi database, dan versi setiap instans dalam satu tabel. Instans tidak pernah berkomunikasi satu sama lain: Postgres yang membawa pekerjaan, sehingga worker tidak memerlukan port terbuka maupun rute kembali ke instans utama. Pekerjaan yang menyentuh file lokal, workspace coding-agent, atau plugin yang terpasang selalu berjalan di instans utama, dan panel melaporkan berapa banyak dari 24 jam terakhir yang demikian, sehingga operator dapat melihat kapan persentase tidak dapat membantu. Setiap proses dalam riwayat mencantumkan instans yang menjalankannya, dan kedua dialog riwayat dapat memfilternya.

Lihat juga [Settings](./user-settings.md), [Traces](../tabs/traces-tab.md), dan [Analytics](../tabs/analytics-tab.md).

### [Integrasi Pihak Ketiga](./integrations.md)

Heym terhubung ke layanan eksternal melalui credentials yang disimpan di tab [Credentials](../tabs/credentials-tab.md) (dienkripsi saat disimpan). Jenis yang didukung meliputi OpenAI, Google, Decision Model untuk [Decision node](../nodes/decision-node.md), Model Router untuk pemilihan model otomatis (lihat di bawah), GitHub untuk [GitHub node](../nodes/github-node.md) dan integrasi MCP, Jira untuk [Jira node](../nodes/jira-node.md), Notion untuk [Notion node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP untuk [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header, dan FlareSolverr untuk [Crawler](../nodes/crawler-node.md). Setiap jenis mendokumentasikan field yang diperlukan; credentials dapat dibagikan kepada pengguna atau [teams](./teams.md) dan direferensikan berdasarkan nama di node atau sebagai `$credentials.Name` dalam ekspresi.

### Model Router (Auto Model)

Credential **Model Router** memilih model per permintaan alih-alih menyimpan kunci. Credential ini
menyimpan credential decision model beserta daftar credential OpenAI/Google/Custom yang sudah ada,
masing-masing dengan kriteria yang menyatakan kapan harus digunakan, dan muncul di setiap pemilih model
dengan satu model bernama **Auto**.

Traces, Execution Log kanvas, dan Span View menampilkan kedua bagian dari pilihan tersebut, misalnya
`Auto Model / GPT-5`, sementara biaya tetap diatribusikan ke model yang dijalankan. Auto
Model tidak dapat dikombinasikan dengan Responses API, mode Batch, atau output gambar. Lihat
[Credentials](./credentials.md) untuk perilaku lengkapnya.

Lihat juga [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), dan [Teams](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails memblokir pesan pengguna yang tidak aman atau tidak diinginkan sebelum mencapai [LLM](../nodes/llm-node.md) atau [Agent Node](../nodes/agent-node.md). Aktifkan per node dan pilih kategori yang akan diblokir (misalnya kekerasan, ujaran kebencian, konten seksual, menyakiti diri sendiri, pelecehan, aktivitas ilegal). Tetapkan sensitivitas (rendah, sedang, tinggi). Saat terpicu, node akan melempar error yang dapat Anda tangkap dengan [Error Handler](../nodes/error-handler-node.md). Deteksi menggunakan API moderasi penyedia atau klasifikasi LLM tergantung pada jenis credential.

Lihat juga [Security](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), dan [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise mencakup lisensi komersial, dukungan profesional, dan layanan deployment untuk tim yang menjalankan Heym di lingkungan produksi. Layanan ini mencakup bantuan arsitektur workflow, onboarding, panduan Kubernetes dan scaling, dukungan prioritas, serta pengembangan kustom untuk fitur-fitur lanjutan seperti [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md), dan [Portal](./portal.md).

Lihat juga [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md), dan [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work adalah antarmuka kedua untuk tim bisnis di atas Heym. Pengguna cukup menjelaskan pekerjaan, menjawab beberapa pertanyaan, dan mendapatkan workflow yang telah diuji, lalu bekerja melalui halaman, persetujuan, dan daftar Aktivitas di mana setiap proses memiliki nama. Administrator instans menghubungkannya di **Pengaturan → Heym Work** dengan alamat dan kunci integrasinya; fitur ini memiliki lisensi tersendiri dari tim Heym.

Lihat juga [Enterprise](./enterprise.md), [Single Sign-On](./sso.md), dan [Human-in-the-Loop](./human-in-the-loop.md).

---

## Tab Dashboard

### [Workflows](../tabs/workflows-tab.md)

Tab Workflows adalah tampilan dashboard default. Tab ini menampilkan daftar dua panel: workflow dan folder sebagai baris padat di sebelah kiri, serta pratinjau workflow yang dipilih di sebelah kanan beserta trigger, eksekusi terakhir, dan langkah-langkahnya, ditambah tombol Open Workflow dan Run Now. Setiap baris memiliki chip status (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) yang dapat difilter melalui dropdown Status. Workflow tanpa node trigger diberi label berdasarkan bagaimana eksekusi terakhirnya dimulai - API untuk panggilan HTTP, SubWorker untuk workflow induk, Portal untuk chat publiknya - dan tetap berstatus Manual hingga dijalankan. Folder dan sub-folder menangani [organisasi](./workflow-organization.md). Buat workflow dengan New Workflow, seret dan lepas JSON untuk [impor](./download-import.md), serta edit atau hapus dari aksi baris. Workflow dapat dipindahkan antar folder; penghapusan dijadwalkan (trash) sebelum penghapusan permanen.

Lihat juga [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md), dan [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Papan kanban agentic di mana kartu merupakan job persisten. Konfigurasikan setiap kolom dengan rantai workflow berurutan; memindahkan kartu ke dalam kolom akan menjalankan rantai tersebut dengan konteks lengkap kartu (konten, komentar, riwayat, output sebelumnya). Hasil ditulis kembali ke kartu — hijau jika berhasil, merah jika gagal, kuning saat berjalan. Putaran lanjutan menjalankan ulang rantai kolom saat ini dengan semua yang telah terakumulasi, yang mendukung perencanaan iteratif. Eksekusi dicatat dalam [Execution History](./execution-history.md) dengan sumber trigger `board`. Saat eksekusi kartu aktif, **Open live** membuka eksekusi tersebut secara persis pada canvas beranimasi dengan log Debug inkremental.

Lihat juga [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md), dan [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Tab Templates memungkinkan Anda menyimpan dan menggunakan kembali template workflow (workflow lengkap) dan template node (node tunggal yang telah dikonfigurasi). Buat template workflow dari editor (Share as Template) dan template node dengan mengklik kanan sebuah node. Telusuri berdasarkan visibilitas (Everyone atau pengguna/[tim](./teams.md) tertentu), terapkan template untuk membuat workflow baru atau menambahkan node ke canvas, serta kelola template yang Anda bagikan.

Lihat juga [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md), dan [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Tab Variables mengelola [Global Variable Store](./global-variables.md). Buat, edit, dan hapus variabel global; atur nama, nilai, dan tipe nilai (Auto, String, Number, Boolean, Array, Object). Variabel bersifat user-scoped dan tetap ada di seluruh eksekusi. Referensikan variabel tersebut dalam [expression](./expression-dsl.md) workflow mana pun sebagai `$global.variableName`. Variabel dapat dibagikan dengan pengguna lain atau [tim](./teams.md).

Lihat juga [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md), dan [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Tab Chat adalah antarmuka agen berjalan lama milik Heym untuk mengoperasikan workspace melalui percakapan. Pilih [credential](./credentials.md) dan model, lalu minta Chat untuk menjawab pertanyaan, memeriksa definisi workflow, menjalankan workflow yang ada, merangkum eksekusi dan jadwal, melaporkan riwayat eksekusi satu workflow (jumlah eksekusi, rincian status, eksekusi terakhir, dan detail satu eksekusi berdasarkan permintaan), melaporkan eksekusi mana yang sedang berjalan saat ini (beserta waktu berjalan, node saat ini, dan tautan ke setiap eksekusi yang sedang berlangsung), menyelesaikan tinjauan manusia yang tertunda, membuat dan merevisi workflow dengan mesin AI Builder yang sama seperti yang digunakan di editor, atau menambahkan kartu ke papan kanban dengan bahasa alami. Kartu baru selalu dimulai pada kolom pertama papan yang dipilih; ketika tersedia beberapa papan dan tidak ada yang disebutkan, Chat menampilkan pilihan papan sebelum membuat kartu.

Chat tetap berjalan di backend setelah browser ditutup. Saat jawaban sedang di-streaming, Anda dapat mengirim lebih banyak pesan; Heym menyimpannya dalam antrean berbasis database, memungkinkan Anda mengedit atau menghapus pesan dalam antrean sebelum diproses, dan menjalankannya secara berurutan saat respons saat ini selesai. Jika asisten memerlukan detail perencanaan dan mengembalikan pertanyaan klarifikasi, antrean akan dijeda hingga Anda menjawab pertanyaan tersebut, lalu dilanjutkan setelah respons perencanaan.

Respons di-streaming dengan markdown, gambar inline, kartu pratinjau workflow, kartu tool-call yang dapat dilipat, penggunaan konteks, dan kompresi konteks otomatis. Chat mendukung lampiran, input suara, pemutaran read-aloud, tindakan salin, quick prompt, User Rules dari [Settings](./user-settings.md), dan [global variables](./global-variables.md) sebagai konteks.

Lihat juga [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md), dan [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Tonton demo Chat</a></p>

### [Credentials](../tabs/credentials-tab.md)

Tab Credentials mengelola API key dan secret yang digunakan oleh node. Tambahkan credential berdasarkan tipe (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, dan lain-lain), beri nama, dan rujuk di node workflow. Edit atau hapus dari kartu; bagikan kepada pengguna melalui email atau kepada [teams](./teams.md). Semua nilai dienkripsi saat disimpan dan disamarkan di UI.

Lihat juga [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md), dan [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Tonton demo Credentials</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Tab Vectorstores mengelola vector store yang digunakan oleh node [RAG](../nodes/rag-node.md). Buat store dengan nama dan [credential](./credentials.md) vector store — *RAG: Qdrant + OpenAI* (Qdrant eksternal) atau *RAG: Psql + OpenAI* (Postgres milik Heym melalui pgvector), yang menetapkan backend store — secara opsional tetapkan nama collection, lalu unggah dokumen (PDF, TXT, dan lain-lain). Kelola konten (lihat, hapus sumber), edit detail store, dan bagikan store kepada pengguna. Di node [RAG](../nodes/rag-node.md), pilih Database, pilih vector store, dan jalankan operasi insert, upsert, delete, atau search.

Lihat juga [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md), dan [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Tonton demo Vectorstores</a></p>
### [MCP](../tabs/mcp-tab.md)

Tab MCP mengonfigurasi integrasi Model Context Protocol. Heym mendukung dua mode:

**Server default** – Satu endpoint di `/api/mcp/sse` yang mengekspos semua Workflow yang mendukung MCP. Lihat dan regenerasi API key Anda, salin JSON klien yang siap digunakan, hubungkan Cursor dengan satu klik, atau ikuti alur penyiapan Claude dengan registrasi OAuth otomatis.

**Server bernama** – Buat beberapa endpoint MCP terisolasi, masing-masing dengan URL berbasis UUID-nya sendiri (`/api/mcp/servers/{uuid}/sse`) dan API key yang independen. Tetapkan Workflow tertentu ke setiap server sehingga klien AI atau tim yang berbeda hanya melihat tool yang mereka butuhkan. Setiap server bernama mendukung metode autentikasi yang sama (API key, Claude OAuth) dan memiliki pintasan Copy JSON serta Add to Cursor tersendiri. Kedua endpoint mendukung SSE transport (GET) dan Streamable HTTP transport (POST). Mengaktifkan atau menonaktifkan Workflow di dalam server bernama akan memindahkannya ke bagian atas daftar yang ditetapkan agar baris yang diubah tetap terlihat.

**Tool chat Heym** – Kedua mode juga dapat mengekspos mesin [Chat](../tabs/chat-tab.md) sebagai satu tool `heym_chat`, yang diaktifkan per surface dengan credential dan model LLM-nya sendiri (terisi otomatis dari model pilihan Anda di [Settings](./user-settings.md)). Klien MCP mengirim satu `message` dalam bahasa alami dan mesin akan melakukan sisanya: membangun Workflow dalam mode build (simpan, uji jalan hingga lima kali, perbaiki, dan verifikasi), menjalankan Workflow, analytics, execution, status run langsung, schedule, board dan card, tim, variabel global, pencarian dokumentasi, dan keputusan human-in-the-loop. Kemampuan yang ditambahkan ke Chat di kemudian hari dapat diakses melalui tool yang sama tanpa registrasi tambahan. Setiap panggilan disimpan dalam riwayat tab Chat sebagai percakapan bertanda plug dan mengembalikan `conversation_id` yang dapat dikirim kembali oleh klien untuk melanjutkan thread.

Lihat juga [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md), dan [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Tab Traces menampilkan trace eksekusi [LLM](../nodes/llm-node.md). Header statistik di atas daftar merangkum rentang waktu yang dipilih dengan kartu KPI (Calls, Tokens, Cost, Avg Latency, Error %) dan tiga grafik — Tokens by Model, Cost by Model, dan Calls Over Time (bertumpuk sukses vs error). Satu pemilih **Time range** (1h / 24h / 7d / 30d / All; default 7 hari) memfilter grafik dan daftar secara bersamaan. Cost dihitung dari [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) per pengguna; model tanpa harga akan muncul sebagai peringatan inline yang menautkannya. Buka trace mana pun untuk melihat payload request dan response, rincian waktu (llm_ms, tools_ms, mcp_list_ms), tool call (nama, argumen, hasil), dan skill yang disertakan. Event yang diperluas menampilkan JSON—termasuk payload MCP dan JSON-RPC—sebagai pohon yang dapat dilipat dengan level pertama terbuka secara default; **Tree / Raw** beralih kembali ke teks asli dan JSON yang tidak valid tetap dapat dibaca. Gunakan trace untuk men-debug perilaku [Agent Node](../nodes/agent-node.md) dan [LLM](../nodes/llm-node.md) serta untuk menyalin atau mengekspor payload.

Lihat juga [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md), dan [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Alerts](../tabs/alerts-tab.md)

Tab Alerts mendefinisikan kondisi ambang batas (threshold) selama jendela waktu tertentu dan memberi tahu Anda ketika kondisi tersebut terlampaui. Empat jenis alert mencakup pertanyaan yang benar-benar diajukan oleh operator: **error threshold** (apakah ini gagal lebih dari N kali dalam jendela waktu), **workflow duration** (apakah eksekusi menjadi lebih lambat, diukur sebagai max, average, atau p95), **token / USD cost** (apakah pengeluaran melampaui anggaran, dihitung melalui tabel harga yang sama dengan [Traces](../tabs/traces-tab.md)), dan **execution count** (apakah ini berjalan jauh lebih sering dari yang seharusnya). Setiap jenis dinilai selama jendela waktu yang Anda pilih, tidak pernah berdasarkan satu peristiwa saja, karena satu eksekusi yang gagal hanyalah noise sedangkan lonjakan adalah insiden. Alerts memantau satu workflow atau setiap workflow yang dapat Anda akses.

Wizard lima langkah memandu Anda melalui type, scope, condition, response, dan review. Langkah Review melakukan **backtest** terhadap kondisi terlebih dahulu, melaporkan seberapa sering kondisi tersebut akan terpicu selama 24 jam hingga 7 hari terakhir, sehingga threshold yang terlalu rendah dapat terdeteksi sebelum disimpan, bukan setelah memicu notifikasi kepada seseorang. Deskripsikan apa yang Anda inginkan dalam bahasa alami dan AI akan mengisi setiap langkah yang dapat diisi, sambil menandai tebakannya; permintaan yang sebagian pun tetap memajukan wizard, membuka pada langkah pertama yang masih memerlukan keputusan alih-alih membuat Anda memulai dari awal. Secara default, alert terpicu sekali dan tetap tenang hingga metrik pulih; Anda dapat mengaturnya agar terpicu berulang pada interval tertentu.

Pada langkah response, alert dapat membuat dan menetapkan workflow baru untuk dijalankan saat terpicu, menggunakan workflow yang sudah Anda miliki, atau tidak melakukan apa pun. Payload yang terpicu membawa nilai yang diamati, threshold, jendela waktu, dan workflow yang berkontribusi terhadap angka tersebut, yang merupakan cara alert menjangkau Slack, email, atau Telegram menggunakan node yang sudah Anda miliki. Riwayat firing mencatat apa yang benar pada saat setiap alert terpicu dan disimpan selama 90 hari; mengakui (acknowledge) sebuah firing mengubah badge dari Firing menjadi Acknowledged tanpa berpura-pura bahwa kondisi telah teratasi. Tab [Chat](../tabs/chat-tab.md) dapat menjawab alert apa saja yang ada dan mengapa atau kapan salah satunya terpicu. Alerts dapat dibagikan kepada pengguna dan [teams](../tabs/teams-tab.md).

Lihat juga [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), dan [Execution History](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

Tab Analytics menampilkan metrik dan tren eksekusi. Statistik ringkasan mencakup total eksekusi, success rate, error rate, rincian latensi, dan total **Time Saved** (jumlah dari estimasi menit yang dihemat per eksekusi setiap workflow × eksekusi yang berhasil). Most Used mencantumkan jumlah yang sama per workflow. Pilih rentang waktu dasar (24h, 7d, 30d, atau all), secara opsional filter berdasarkan workflow, lalu seret melintasi grafik mana pun untuk menelusuri rentang tanggal yang dipilih. Grafik dan tabel workflow akan diperbarui sesuai pilihan, dan auto refresh menjaga metrik tetap terbarui. Ini melengkapi [Execution History](./execution-history.md) dan tampilan [Scheduled](../tabs/scheduled-tab.md) ketika Anda memerlukan hasil masa lalu sekaligus eksekusi yang akan datang.

Lihat juga [Execution History](./execution-history.md), [Scheduled](../tabs/scheduled-tab.md), dan [Evals](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Tonton demo Analytics</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Tab Dashboard adalah ruang bergaya Grafana tempat Anda membangun kisi widget grafik, masing-masing dirender dari workflow Heym tersembunyinya sendiri. Simpan sebanyak mungkin dashboard yang Anda perlukan dan bagikan masing-masing kepada pengguna atau tim, read-only atau editable; widget selalu berjalan dengan kredensial pemiliknya, sehingga semua orang melihat data yang sama. Deskripsikan metrik dalam bahasa alami dan AI akan menghasilkan widget tersebut, atau tambahkan secara manual dan pilih jenis grafik, dengan pratinjau menggunakan data sampel: bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text, atau HITL. HITL adalah carousel dari human review Anda yang tertunda. Header menampilkan `1/n pending`. Nama workflow membuka eksekusi tersebut di canvas. **Approve**, **Request changes**, dan **Reject** menyelesaikannya, dan ikon riwayat di samping judul widget membuka eksekusi tersebut dalam dialog riwayat pada halaman yang sama. Widget menyimpan hasilnya dalam cache, dapat disempurnakan dengan AI (setiap perubahan disimpan ke [Edit History](./edit-history.md)), dikloning bersama workflow lengkapnya, ditata ulang dengan Tidy up, serta dapat diseret atau diubah ukurannya dalam mode edit. Tabel dapat menampilkan chip status dan menautkan barisnya ke dasbor detail yang membaca rekaman baris yang diklik sebagai `$page.record`, dan widget Run menjalankan workflow dari dasbor: pada file yang dilepas, dengan kolom inputnya, atau dengan tombol Run. Karena setiap widget adalah sebuah workflow, data apa pun yang dapat Anda ambil — panggilan [HTTP](../nodes/http-node.md), kueri [BigQuery](../nodes/bigquery-node.md), pencarian [RAG](../nodes/rag-node.md), atau keluaran [LLM](../nodes/llm-node.md) — dapat menjadi grafik.

Lihat juga [Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md), dan [Execution History](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Tonton demo Dashboard</a></p>
### [Evals](../tabs/evals-tab.md)

Tab Evals (di `/evals`) memungkinkan Anda membuat rangkaian evaluasi, menambahkan atau menghasilkan kasus uji, mengoptimalkan prompt rangkaian, dan menjalankan evaluasi terhadap workflow [Agent Node](../nodes/agent-node.md). Pilih satu atau beberapa model, pilih metode penilaian (Exact Match, Contains, atau LLM-as-Judge), secara opsional biarkan model terpisah atau [Decision Model](../nodes/decision-node.md) menilai jawaban LLM-as-Judge, tetapkan jumlah run per uji (beserta temperature dan reasoning effort untuk Exact Match dan Contains), lalu bandingkan hasil lulus/gagal dan output per model. Tinjau riwayat run untuk evaluasi sebelumnya, termasuk judge yang digunakan setiap run, jalankan ulang dengan judge yang sama, ekspor sebagai JSON, dan periksa silang perilaku yang mendasarinya di [Traces](../tabs/traces-tab.md).

Lihat juga [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md), dan [Execution History](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Tonton demo Evals</a></p>

### [Teams](../tabs/teams-tab.md)

Tab Teams memungkinkan Anda membuat dan mengelola tim. Buat tim, tambahkan anggota berdasarkan email, dan hapus anggota (pembuat tidak dapat dihapus). Bagikan [workflow](../tabs/workflows-tab.md), [template](../tabs/templates-tab.md), [credential](../tabs/credentials-tab.md), [variabel](../tabs/global-variables-tab.md), [vector store](../tabs/vectorstores-tab.md), dan [file Drive](../tabs/drive-tab.md) dengan tim melalui dialog berbagi masing-masing; semua anggota tim mendapatkan akses. Edit nama dan deskripsi tim atau hapus tim (menghapus semua berbagi tim).

Lihat juga [Teams](./teams.md), [Credentials Sharing](./credentials-sharing.md), dan [Workflow Organization](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Tonton demo Teams</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Tab Scheduled menampilkan semua workflow [Cron](../nodes/cron-node.md) yang aktif pada kalender visual. Beralih antara tampilan hari, minggu, dan bulan untuk melihat kapan otomatisasi Anda dijadwalkan berjalan, lalu kembali ke [workflow](../tabs/workflows-tab.md) terkait saat Anda perlu mengedit jadwal.

Lihat juga [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md), dan [Execution History](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Tonton demo Scheduled</a></p>

### [Logs](../tabs/logs-tab.md)

Tab Logs menampilkan log kontainer Docker untuk stack Heym (backend, frontend, PostgreSQL). Pilih kontainer, filter berdasarkan level log (All, INFO, WARNING, ERROR, DEBUG), dan cari di dalam log. Gunakan untuk debugging dan troubleshooting. Untuk log eksekusi workflow (hasil node, output), gunakan [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), atau panel Debug di editor.

Lihat juga [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), dan [Canvas Features](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Tonton demo Logs</a></p>

### [DataTable](../tabs/datatable-tab.md)

Tab DataTable memungkinkan Anda membuat dan mengelola tabel data terstruktur di dalam Heym. Tentukan kolom bertipe (string, number, boolean, date, JSON), kelola baris dengan pengeditan inline klik ganda, impor/ekspor CSV, dan bagikan tabel dengan pengguna atau [tim](./teams.md) dengan izin baca/tulis. Gunakan [node DataTable](../nodes/datatable-node.md) untuk mengakses tabel secara terprogram dalam workflow. Bagian **System tables** yang disematkan di bagian atas menampung **LLM Cost Table**: tampilan skema tetap dari harga per model yang di-seed dari Helicone di latar belakang (TTL 24 jam, Refresh manual), di mana setiap pengguna dapat menimpa harga atau menambahkan baris kustom untuk model yang tidak terdaftar di Helicone. Aturan harga ini menggerakkan KPI biaya dan grafik biaya per model pada tab [Traces](../tabs/traces-tab.md).

Lihat juga [node DataTable](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Workflow Structure](./workflow-structure.md), dan [Teams](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Tonton demo DataTable</a></p>
### [Drive](../tabs/drive-tab.md)

Tab Drive menampilkan semua file yang dihasilkan oleh skill di seluruh workflow Anda. Tab ini mencantumkan setiap file beserta nama, tipe, ukuran, node sumber, tanggal pembuatan, dan status berbagi tim, serta menyediakan kontrol pencarian, unduhan terautentikasi, berbagi, penghapusan, dan penomoran halaman. Tab ini merupakan pendamping dasbor untuk [File Generation](./file-generation.md), referensi [Drive](./drive.md), dan [Drive node](../nodes/drive-node.md).

Lihat juga [Drive](./drive.md), [File Generation](./file-generation.md), dan [Drive node](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Tonton demo Drive</a></p>
