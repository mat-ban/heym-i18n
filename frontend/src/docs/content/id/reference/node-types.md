# Jenis Node

Heym menyediakan berbagai jenis Node untuk membangun Workflow. Gunakan [ekspresi](./expression-dsl.md) seperti `$input.text` dan `$nodeLabel.field` dalam konfigurasi Node.

## Node Trigger

| Node | Deskripsi | Output |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Titik masuk teks untuk Workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger sesuai jadwal (ekspresi cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger saat pembaruan webhook bot Telegram diterima | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger saat Slack mengirim webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger saat Discord mengirim webhook interaksi aplikasi | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger saat email baru tiba di kotak surat IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger saat Heym memublikasikan peristiwa platform (array yang dibatch) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger dari koneksi keluar ke server WebSocket eksternal | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Buat tautan unggah sekali pakai dan mulai saat file berukuran besar diunggah | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger saat pesan diterima dari antrean | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Dijalankan saat Node mana pun mengalami error (tanpa edge masuk) | 1 |

Lihat [Trigger](./triggers.md) untuk semua titik masuk.

## Node AI

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Memproses teks dengan model bahasa | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Ajukan pertanyaan bertipe ke model pengambilan keputusan dan bercabang berdasarkan probabilitas yang dikembalikan | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM dengan pemanggilan tool, skills, MCP, opsional [tinjauan manusia](./human-in-the-loop.md), dan opsional [graf memori persisten](./agent-persistent-memory.md). Lihat [Arsitektur Agent](./agent-architecture.md). | 1 | 1, plus output `review` opsional |
| [Codex](../nodes/codex-node.md) | Jalankan Codex CLI lokal terhadap repositori GitHub menggunakan token akses ChatGPT/Codex | 1 | 1, plus output `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Jalankan OpenCode CLI terhadap repositori GitHub dalam kontainer yang diperkuat menggunakan kunci API gateway OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Panggil tool MCP tertentu secara langsung tanpa LLM yang memilihnya | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Sisipkan, upsert, hapus, atau cari di [vector store](../tabs/vectorstores-tab.md) Qdrant atau Postgres (pgvector) untuk RAG | 1 | 1 |

## Node Logika

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Bercabang berdasarkan if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Rutekan dengan mencocokkan nilai ke case | 1 | n |
| [Merge](../nodes/merge-node.md) | Tunggu beberapa input dan gabungkan | n | 1 |
| [Loop](../nodes/loop-node.md) | Iterasi melalui array | 1 | 2 (loop/done) |

## Node Data

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformasi dan petakan data | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konversi data antar format (CSV, JSON, XML) dan OCR gambar atau PDF ke teks | 1 | 1 |
| [Code](../nodes/code-node.md) | Jalankan Python dalam sandbox sekali pakai yang terisolasi jaringan dengan requirements.txt-nya sendiri | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Set atau ambil variabel (lokal Workflow atau [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Panggil Workflow lain | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Baca Workflow Heym dan riwayat eksekusi | 1 | 1 |
## Node Integrasi

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Melakukan permintaan HTTP (cURL) | 0 atau 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Menghubungkan ke WebSocket eksternal dan mengirim satu pesan | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Mengirim pesan bot Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Mengirim pesan Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Mengirim pesan webhook Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Mengirim email melalui SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operasi Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Membaca/menulis spreadsheet Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Mengelola repositori, pengguna, issue, pull request, review, rilis, Workflow Actions, dan file melalui GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Mengelola proyek, issue, komentar, lampiran, pengguna, notifikasi, dan transisi Workflow Jira melalui Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Mengelola tim, proyek, issue, status Workflow, dan komentar Linear melalui GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Membaca/menulis Google Sheets melalui OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Menampilkan daftar, mengunduh, memperbarui, dan menghapus file Google Drive melalui OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Menjalankan kueri SQL dan menyisipkan baris di BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Melakukan kueri dan mutasi tabel Supabase melalui PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Menjalankan operasi SQL, CRUD, dan count terhadap ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Mengelola database, sumber data, halaman, dan blok Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Mengelola organisasi, proyek, tim, issue, event, dan rilis Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Mengelola bucket dan folder; menampilkan daftar, mengunggah, mengunduh, menyalin, dan menghapus objek | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Membaca/menulis Heym DataTables (penyimpanan pihak pertama) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Mengelola file Drive: menghapus, mengatur kata sandi, TTL, batas unduhan, berbagi/berhenti berbagi tim | 1 | 1 |

## Node Otomatisasi

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Melakukan scraping halaman web dengan FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Otomatisasi browser dengan langkah AI dan Auto Heal | 1 | 1 |

## Node Utilitas

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Menunda eksekusi | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint output | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Memetakan field ke objek JSON; terminal tunggal = body webhook/run tingkat atas | 1 | 0 |
| [HTML output mapper](../nodes/html-output-node.md) | Merender halaman HTML; terminal tunggal = webhook merespons dengan text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Output widget dasbor terminal yang memetakan baris upstream ke payload chart | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Menambahkan catatan markdown ke kanvas (tidak dieksekusi) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Mencatat ke konsol backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Menonaktifkan Node lain dalam Workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Mengaktifkan Node yang dinonaktifkan dalam Workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Menghentikan Workflow dengan respons error | 1 | 0 |

## Node Plugin

Node Plugin disediakan oleh plugin yang terpasang pada instance. Setiap plugin
yang terpasang muncul di palet di bawah **Plugins** dengan namanya sendiri; di balik
layar, plugin tersebut dipetakan ke salah satu dari dua jenis Node berikut.

| Node | Deskripsi | Input | Output |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Aksi kustom yang disediakan oleh plugin yang terpasang | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger kustom yang disediakan oleh plugin yang terpasang | 0 | 1 |
## Terkait

- [Fitur Canvas](./canvas-features.md) – Data pin, log eksekusi, aktifkan/nonaktifkan, ekstrak ke sub-workflow
- [Node Agent](../nodes/agent-node.md) – Referensi terperinci untuk Node AI Agent
- [Arsitektur Agent](./agent-architecture.md) – Sub-agent, orkestrator, skill, MCP, pemanggilan tool
- [Memori Persisten Agent](./agent-persistent-memory.md) – Graf pengetahuan per-Node, berbagi, dan ekstraksi latar belakang
- [Human-in-the-Loop](./human-in-the-loop.md) – Jeda output Agent untuk persetujuan manusia
- [Expression DSL](./expression-dsl.md) – Mereferensikan data dalam konfigurasi Node
- [Dialog Evaluasi Expression](./expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend secara langsung
- [Trigger Unggah File](../nodes/file-upload-trigger-node.md) – Menerima unggahan multipart berukuran besar melalui tautan sekali pakai
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger socket keluar secara realtime
- [WebSocket Send](../nodes/websocket-send-node.md) – Mendorong pesan ke socket eksternal
- [Struktur Workflow](./workflow-structure.md) – Format JSON untuk Node dan edge
- [Trigger](./triggers.md) – Semua titik masuk Workflow
- [Tab Credentials](../tabs/credentials-tab.md) – Menambahkan API key untuk Node LLM, HTTP, dan lainnya
- [Berbagi Credentials](./credentials-sharing.md) – Berbagi credentials dengan pengguna lain
- [Portal](./portal.md) – Menampilkan Workflow sebagai UI chat publik
- [Tab Vectorstores](../tabs/vectorstores-tab.md) – Membuat vector store untuk Node RAG
