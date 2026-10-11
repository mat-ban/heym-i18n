# Tab Credentials

Tab **Credentials** mengelola API key dan secret yang digunakan oleh Node. Tambahkan credential di sini dan rujuk berdasarkan nama pada Node Workflow. Untuk gambaran umum mengenai apa itu credential dan bagaimana Node menggunakannya, lihat [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Tonton demo Credentials</a></p>

## Jenis Credential

| Jenis | Kasus Penggunaan |
|------|----------|
| **OpenAI** | OpenAI API key untuk Node LLM, Agent, dan RAG |
| **Google** | Google AI (Gemini) API key |
| **GitHub** | GitHub personal access token (PAT) untuk GitHub API, Workflow Node GitHub, MCP server, dan Workflow Agent; opsional `base_url` GitHub Enterprise |
| **Linear** | Linear personal API key atau OAuth2 untuk tim, proyek, issue, dan komentar |
| **Notion** | Internal integration token atau otorisasi workspace OAuth public-integration |
| **Custom** | Endpoint LLM kustom |
| **Bearer** | Bearer token untuk autentikasi HTTP |
| **Header** | Key-value header kustom untuk permintaan HTTP |
| **Telegram** | Telegram bot token dan webhook secret opsional |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Discord application public key |
| **IMAP** | Credential Trigger kotak masuk |
| **SMTP** | Credential pengiriman email |
| **Redis** | Koneksi Redis |
| **RAG: Qdrant + OpenAI** | Vector store untuk Node RAG, didukung oleh server Qdrant eksternal |
| **RAG: Psql + OpenAI** | Vector store untuk Node RAG, didukung oleh database Postgres milik Heym sendiri (pgvector) — tanpa layanan eksternal |
| **RAG: Custom Embeddings** | Vector store untuk Node RAG menggunakan endpoint embedding apa pun yang kompatibel dengan OpenAI, dengan Qdrant atau Postgres (pgvector) sebagai penyimpanan |
| **Cohere** | Cohere API untuk embedding |

## Menambahkan Credential

1. Klik **Add Credential**
2. Pilih jenis credential
3. Masukkan nilai yang diperlukan (API key, URL, dll.)
4. Beri nama untuk dirujuk pada Node

Untuk GitHub, alur credential saat ini berbasis PAT. PAT dengan cakupan terperinci (fine-grained) direkomendasikan. Alur instalasi GitHub App belum menjadi fitur utama di UI saat ini. Jika Anda menggunakan GitHub Enterprise Server, Anda juga dapat menetapkan GitHub API base URL opsional seperti `https://github.example.com/api/v3`.

Untuk Linear, pilih **Personal API key** atau **OAuth2** pada dialog. Personal API key dibuat
di bawah **Settings → Security & Access → Personal API keys** di Linear. OAuth2 menggunakan
Client ID dan Client Secret dari aplikasi OAuth Linear, dengan `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
didaftarkan sebagai redirect URI. Credential bertindak dengan izin dari pengguna Linear yang
membuat atau mengotorisasinya. Gunakan **Test Connection** pada dialog credential untuk memverifikasi API key atau
OAuth token sebelum menyimpan.

Untuk **Notion**, pilih **Internal token** atau **OAuth** pada dialog. OAuth menggunakan Client ID dan
Client Secret dari public integration Notion Anda; Heym menyimpannya secara terenkripsi di dalam credential.
Gunakan **Test Connection** untuk memverifikasi credential Supabase, Linear, atau Notion sebelum menyimpan Workflow. Lihat
[Third-Party Integrations](../reference/integrations.md#notion) untuk detail penyiapan Notion.

Credential OAuth membuka halaman otorisasi penyedia di popup. Jika browser memblokirnya, gunakan tautan **Open the authorization page** di bawah tombol Connect; dialog akan memberi tahu ketika koneksi selesai. Setelah credential baru terhubung, tombol akan menampilkan **Connected**.

## Mengedit dan Menghapus

- **Edit** – Perbarui nilai credential (nilai sensitif disamarkan)
- **Delete** – Hapus credential; Workflow yang menggunakannya memerlukan pengganti

Saat mengedit credential **GitHub** di GitHub Enterprise Server, membiarkan **GitHub
API Base URL** opsional kosong akan mempertahankan endpoint Enterprise yang ada. Masukkan URL baru hanya ketika Anda
ingin mengubah endpoint tersebut.

## Berbagi

- [Bagikan credential](../reference/credentials-sharing.md) dengan pengguna lain melalui email atau dengan [Teams](../reference/teams.md)
- Credential yang dibagikan muncul dengan indikator
- Cabut berbagi dari menu kartu credential
## Penggunaan di Node

Referensikan credentials berdasarkan nama dalam konfigurasi Node. Sebagai contoh:
- [Node LLM](../nodes/llm-node.md) – Pilih credential untuk API model
- [Node HTTP](../nodes/http-node.md) – Gunakan credential Bearer atau Header untuk autentikasi
- [Node Agent](../nodes/agent-node.md) – Teruskan token GitHub ke dalam env var server MCP seperti `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Node GitHub](../nodes/github-node.md) – Jalankan operasi native GitHub untuk repositori, pengguna, issue, review, release, workflow, traffic, dan file
- [Node Linear](../nodes/linear-node.md) – Baca metadata workspace dan otomatiskan issue serta komentar Linear
- [Node Notion](../nodes/notion-node.md) – Kelola database, sumber data, halaman, dan blok Notion
- [Node RAG](../nodes/rag-node.md) – Gunakan credential Qdrant atau Postgres (pgvector) untuk vector store
- [Node Telegram Trigger](../nodes/telegram-trigger-node.md) – Terima webhook bot Telegram
- [Node Telegram](../nodes/telegram-node.md) – Kirim pesan bot Telegram
- [Node Discord Trigger](../nodes/discord-trigger-node.md) – Terima webhook interaksi Discord
- [Node Discord](../nodes/discord-node.md) – Kirim pesan webhook Discord
- [Node IMAP Trigger](../nodes/imap-trigger-node.md) – Polling inbox bersama untuk email baru

Lihat [Expression DSL](../reference/expression-dsl.md) untuk mereferensikan nilai yang didukung credential dalam ekspresi.

## Terkait

- [Integrasi Pihak Ketiga](../reference/integrations.md) – Panduan penyiapan terperinci untuk setiap jenis credential (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack, dan lainnya)
- [Berbagi Credentials](../reference/credentials-sharing.md) – Bagikan credentials dengan pengguna lain
- [Keamanan](../reference/security.md) – Enkripsi saat penyimpanan, manajemen sesi, pembatasan laju
- [Jenis Node](../reference/node-types.md) – Node yang menggunakan credentials ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Tab Vectorstores](./vectorstores-tab.md) – Menggunakan credential Qdrant atau Postgres (pgvector)
- [Tab Chat](./chat-tab.md) – Menggunakan credential OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk tampilan dashboard
