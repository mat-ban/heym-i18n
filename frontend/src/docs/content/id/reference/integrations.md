# Integrasi Pihak Ketiga

Heym terhubung ke layanan eksternal melalui **credentials**. Setiap jenis credential menyimpan detail koneksi untuk satu layanan dan dapat digunakan kembali di berbagai node dan workflow. Lihat [Credentials](./credentials.md) untuk ikhtisar.

Tambahkan credential di [Settings → Credentials](../tabs/credentials-tab.md). Semua nilai dienkripsi saat disimpan. Credential dapat [dibagikan](./credentials-sharing.md) dengan pengguna lain atau [Teams](./teams.md).

Beberapa node integrasi **tidak** memerlukan credential. [WebSocket Trigger](../nodes/websocket-trigger-node.md) dan [WebSocket Send](../nodes/websocket-send-node.md) terhubung ke socket eksternal menggunakan URL, header, dan subprotokol yang dikonfigurasi langsung pada node.

## Jenis Credential Secara Singkat

| Jenis | Digunakan Oleh | Field Utama |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, opsional `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, opsional `base_url` |
| **Jira** | [Node Jira](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (khusus Basic auth), opsional `api_version` |
| **Linear** | [Node Linear](../nodes/linear-node.md) | `api_key`, atau `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Node Sentry](../nodes/sentry-node.md) | `api_token`, opsional `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, opsional `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | credential decision model, plus opsi model yang merujuk ke credential Anda yang lain |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vektor disimpan di Postgres milik Heym sendiri melalui pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, opsional `embedding_api_key`, plus `qdrant_host` ketika `db_type` adalah `qdrant` |
| **Grist** | [Node Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Node Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + persetujuan OAuth2 |
| **Google Drive** | [Node Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + persetujuan OAuth2 (scope Drive penuh) |
| **BigQuery** | [Node BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + persetujuan OAuth2 |
| **Supabase** | [Node Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, opsional `supabase_schema` |
| **ClickHouse** | [Node ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Node Notion](../nodes/notion-node.md) | `api_token`, atau `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Node Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Node IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Node Telegram Trigger](../nodes/telegram-trigger-node.md), [Node Telegram](../nodes/telegram-node.md) | `bot_token`, opsional `secret_token` |
| **Discord** | [Node Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Node Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Node RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Node Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Node Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Node Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Node HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Node HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Node Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Credential GitHub menyimpan personal access token (PAT) GitHub sehingga workflow dapat memanggil GitHub REST API melalui [node GitHub](../nodes/github-node.md), meneruskan token ke MCP server seperti `@modelcontextprotocol/server-github`, atau menggunakannya dari [node HTTP](../nodes/http-node.md) untuk panggilan REST kustom.

### Field yang Diperlukan

| Field | Deskripsi |
|-------|-------------|
| `api_key` | Personal access token GitHub (PAT fine-grained `github_pat_...` atau PAT klasik `ghp_...`) |
### Kolom Opsional

| Kolom | Deskripsi |
|-------|-------------|
| `base_url` | URL dasar API GitHub untuk GitHub Enterprise Server (misalnya `https://github.example.com/api/v3`) |

### Catatan

- Personal access token dengan cakupan terperinci (fine-grained) disarankan jika memungkinkan karena Anda dapat membatasinya pada repositori dan izin tertentu.
- Biarkan `base_url` kosong untuk GitHub.com. Untuk GitHub Enterprise Server, gunakan endpoint REST API
  lengkap termasuk `/api/v3` (misalnya `https://github.example.com/api/v3`), bukan
  akar antarmuka web server seperti `https://github.example.com`.
- Kredensial ini saat ini hanya memodelkan autentikasi berbasis PAT. Untuk mengakses repositori organisasi, gunakan PAT yang telah diberikan izin organisasi/repositori yang diperlukan.
- Token instalasi GitHub App dan alur penyiapan GitHub App belum menjadi fitur utama di antarmuka Heym saat ini.
- Utamakan [node GitHub](../nodes/github-node.md) untuk operasi native repositori, pengguna, issue, pull request, review, rilis, workflow Actions, traffic, dan file. Gunakan [node HTTP](../nodes/http-node.md) hanya ketika Anda memerlukan endpoint atau payload yang tidak dicakup oleh node GitHub.
- Gunakan [node Agent](../nodes/agent-node.md) dengan MCP dengan meneruskan `$credentials.YourGitHubCredential` ke variabel lingkungan koneksi MCP seperti `GITHUB_PERSONAL_ACCESS_TOKEN`.
- REST API GitHub umumnya mengharapkan `Authorization: Bearer <token>` ditambah `Accept: application/vnd.github+json`.
- Saat mengedit kredensial GitHub, membiarkan `base_url` GitHub Enterprise kosong akan mempertahankan
  endpoint yang ada. Masukkan URL baru hanya ketika Anda ingin mengubah endpoint tersebut.

### Digunakan Oleh

- [node GitHub](../nodes/github-node.md)
- [node Codex](../nodes/codex-node.md)
- [node Agent](../nodes/agent-node.md)
- [node HTTP](../nodes/http-node.md)

---

## Decision Model

Decision model menjawab pertanyaan bertipe tentang suatu state dan mengembalikan probabilitas alih-alih teks. Jev dari TypeSafe adalah implementasi referensinya; endpoint apa pun yang menerima body `{model, state, questions}` yang sama akan berfungsi, dan node [Decision](../nodes/decision-node.md) dapat mengirim body yang ditulis secara manual untuk endpoint yang tidak menerimanya.

### Kolom Wajib

- `base_url` – endpoint, misalnya `https://api.typesafe.ai`. Heym menambahkan `/v1/systemone`.

### Kolom Opsional

- `api_key` – dikirim sebagai `Authorization: Bearer`. Endpoint yang tidak memerlukan key dapat membiarkan kolom ini kosong.

### Catatan

- **Test Connection** mengirim satu pertanyaan kecil untuk mengonfirmasi bahwa endpoint dan key berfungsi.
- Mengedit kredensial akan mempertahankan key yang tersimpan ketika kolom key dibiarkan kosong.
- Permintaan keluar ke alamat privat dan loopback diblokir secara default, sehingga endpoint yang di-host sendiri pada `localhost` atau rentang privat memerlukan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Model-model ini tidak ada dalam tabel harga LLM yang disinkronkan Heym, sehingga kolom Cost di [Traces](../tabs/traces-tab.md) tetap kosong. Jumlah token tetap dicatat.

### Digunakan Oleh

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – menilai jawaban `LLM-as-Judge` terhadap output yang diharapkan

## OpenAI Codex

Kredensial OpenAI Codex mengautentikasi [node Codex](../nodes/codex-node.md). Kredensial ini terpisah dari kredensial API key OpenAI yang digunakan oleh node LLM, Agent, dan RAG.

### Mode Autentikasi

| Mode | Deskripsi |
|------|-------------|
| **Sign in with ChatGPT** (disarankan) | Proses masuk OAuth (PKCE) yang menggunakan langganan ChatGPT Plus/Pro Anda, sehingga eksekusi menghindari biaya API per token. Heym menyimpan dan menyegarkan ulang bundel token secara otomatis. |
| **Access token** | `access_token` ChatGPT/Codex yang hanya diteruskan ke proses Codex CLI lokal. |

### Catatan

- API key ditolak untuk jenis kredensial ini.
- Token Codex tidak diekspos melalui `$credentials.Name`.
- Node Codex juga memerlukan kredensial GitHub untuk clone repositori, push branch, dan pembuatan draft PR.

### Digunakan Oleh

- [node Codex](../nodes/codex-node.md)

## OpenCode Go

Kredensial OpenCode Go mengautentikasi [node OpenCode Go](../nodes/opencode-go-node.md). Kredensial ini menyimpan API key gateway OpenCode Go (dari [opencode.ai/go](https://opencode.ai/go)) dan base URL gateway opsional.

### Kolom

| Kolom | Deskripsi |
|-------|-------------|
| **API Key** | API key gateway OpenCode Go (wajib). |
| **Gateway Base URL** | Opsional; default ke `https://opencode.ai/zen/go/v1`. Ganti hanya untuk gateway yang di-host sendiri atau melalui proxy. |

### Catatan

- API key hanya diteruskan ke proses OpenCode CLI di dalam container yang diperketat keamanannya.
- Node OpenCode Go juga memerlukan kredensial GitHub untuk clone repositori, push branch, dan pembuatan pull request. Token GitHub tidak pernah ditempatkan di dalam container sandbox.

### Digunakan Oleh

- [node OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Kredensial Linear mendukung baik API key pribadi maupun OAuth2 untuk
[node Linear](../nodes/linear-node.md). Heym mengirim kueri GraphQL native ke Linear untuk metadata workspace,
proyek, issue, dan komentar.
### Penyiapan

Pilih salah satu mode autentikasi:

**Personal API key**

1. Di Linear, buka **Settings → Security & Access → Personal API keys**.
2. Buat kunci dengan akses ke workspace yang ingin Anda otomatiskan.
3. Tempelkan kunci tersebut ke dalam kredensial Linear di Heym dan gunakan **Test Connection** untuk memverifikasinya.

**OAuth2**

1. Buat aplikasi OAuth Linear.
2. Daftarkan `{FRONTEND_URL}/api/credentials/linear/oauth/callback` sebagai redirect URI.
3. Di Heym Dashboard → **Credentials** → **New** → ketik **Linear**.
4. Pilih **OAuth2**, masukkan Client ID dan Client Secret, lalu klik **Connect**.

### Field yang Diperlukan

| Mode | Field | Deskripsi |
|------|-------|-------------|
| Personal API key | `api_key` | Personal API key Linear, umumnya diawali dengan `lin_api_` |
| OAuth2 | `client_id` | Client ID dari aplikasi OAuth Linear |
| OAuth2 | `client_secret` | Client Secret dari aplikasi OAuth Linear |

Token OAuth (`access_token`, `refresh_token`, `token_expiry`) disimpan dan diperbarui secara otomatis.

### Catatan

- Personal API key dan token OAuth bertindak sebagai pengguna Linear yang membuat atau mengotorisasinya.
- OAuth Linear menggunakan scope `read,write,issues:create,comments:create`.
- Gunakan **Test Connection** pada dialog kredensial untuk memverifikasi API key atau token OAuth terhadap API Linear.
- Gunakan List Teams dan List Projects pada node Linear untuk menemukan UUID sebelum membuat atau memfilter issue.
- Gunakan List Workflow States dan List Team Members untuk menemukan UUID state dan assignee untuk pembaruan.
- Rotasi API key dengan mengedit kredensial dan memasukkan nilai pengganti. Jika Anda merotasi secret aplikasi OAuth, sambungkan kembali kredensial melalui **Connect**.

### Digunakan Oleh

- [Node Linear](../nodes/linear-node.md)

---

## Jira

Kredensial Jira menyimpan kredensial Basic auth Jira atau token akses pribadi Data Center, base URL situs Jira, mode deployment, dan versi REST API opsional untuk [node Jira](../nodes/jira-node.md). Gunakan `cloud` untuk Jira Cloud atau `data_center` untuk Jira Data Center / Server.

### Penyiapan

**Jira Cloud**

1. Di pengaturan akun Atlassian, buat API token.
2. Di Heym Dashboard → **Credentials** → **New** → ketik **Jira**.
3. Masukkan email Atlassian, API token, dan URL situs Jira seperti `https://your-domain.atlassian.net`.
4. Gunakan **Test Connection** untuk memverifikasi kredensial.

**Jira Data Center / Server**

1. Pilih **Jira Data Center / Server** sebagai deployment.
2. Pilih metode autentikasi. **Nama pengguna dan kata sandi** menggunakan Basic auth. **Personal Access Token** menggunakan `Authorization: Bearer <token>` dan memerlukan Jira Data Center / Server 8.14 atau yang lebih baru. Buat token di bawah **Profil → Personal Access Tokens** di Jira.
3. Masukkan nama pengguna dan kata sandi Jira, atau tempelkan token akses pribadi (nama pengguna tidak diperlukan).
4. Masukkan URL situs Jira, misalnya `https://jira.example.com`.
5. Gunakan **Test Connection** untuk memverifikasi kredensial.

### Field

| Field | Deskripsi |
| --- | --- |
| `auth_mode` | `basic` (default jika tidak ada) atau `pat`. `pat` hanya valid dengan `data_center` |
| `email` | Email akun Atlassian Jira Cloud, atau nama pengguna Jira Data Center / Server. Tidak digunakan dalam mode `pat` |
| `api_token` | Token API Atlassian Jira Cloud, kata sandi Jira Data Center / Server untuk Basic auth, atau token akses pribadi Data Center dalam mode `pat` |
| `base_url` | Base URL situs Jira |
| `deployment` | `cloud` untuk Jira Cloud atau `data_center` untuk Jira Data Center / Server |
| `api_version` | Versi REST API; default `3` untuk Jira Cloud. Data Center / Server menggunakan v2 |

### Catatan

- Node Jira mengirim deskripsi dan komentar issue sebagai dokumen teks Atlassian Document Format
  untuk Jira Cloud REST API v3. Kredensial Data Center / Server mengirim teks biasa.
- Data Center / Server mendukung autentikasi Basic nama pengguna/kata sandi dan autentikasi token akses pribadi (PAT) menggunakan skema Bearer. Autentikasi PAT memerlukan Jira Data Center / Server 8.14 atau yang lebih baru.
- Unggahan lampiran menerima konten base64 atau data URL dan tunduk pada batas ukuran file platform (default 99 MB). Unduhan lampiran dapat mengembalikan konten base64 jika diaktifkan.
- Pembuatan pengguna, penghapusan, dan notifikasi issue memerlukan akun Jira yang terautentikasi untuk memiliki izin situs atau organisasi Jira yang relevan.
- Gunakan List Projects, Search Issues, dan List Transitions untuk menemukan project key, issue key, dan transition ID.
- Untuk endpoint kustom yang tidak dicakup oleh node Jira, gunakan [node HTTP](../nodes/http-node.md) dengan Jira Basic Auth (`email:api_token` untuk Cloud atau `username:password` untuk Data Center / Server), atau PAT Bearer auth (`Authorization: Bearer <token>` untuk Data Center / Server). Alternatifnya, gunakan kredensial Header dengan header `Authorization` yang sesuai.

Lihat juga:

- [Node Jira](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Kredensial Sentry menyimpan auth token untuk [node Sentry](../nodes/sentry-node.md). Heym menggunakan REST API Sentry untuk operasi organization, project, team, issue, event, dan release.

### Field yang Diperlukan

| Field | Deskripsi |
|-------|-------------|
| `api_token` | Auth token Sentry dengan akses ke organization dan project yang Anda otomatiskan |

### Field Opsional

| Field | Deskripsi |
|-------|-------------|
| `base_url` | URL root opsional untuk Sentry yang di-host sendiri, misalnya `https://sentry.example.com` |

### Catatan

- Biarkan `base_url` kosong untuk Sentry SaaS.
- Gunakan **Test Connection** untuk memastikan token dapat menampilkan daftar organization yang terlihat.
- Untuk panggilan REST kustom, gunakan `$credentials.YourSentryCredential` sebagai bearer token.

### Digunakan Oleh

- [Node Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) adalah basis data vektor open-source yang digunakan untuk pencarian semantik dan RAG (Retrieval Augmented Generation).

### Field yang Diperlukan

| Field | Deskripsi |
|-------|-------------|
| `qdrant_host` | URL lengkap ke instance Qdrant Anda (misalnya `http://localhost:6333` atau endpoint cloud) |
| `openai_api_key` | API key OpenAI yang digunakan untuk menghasilkan embedding saat mengindeks dan mencari dokumen |
### Catatan

- Koleksi Qdrant dikelola dari tab [Vectorstores](../tabs/vectorstores-tab.md). Setiap vector store dipetakan ke satu koleksi Qdrant.
- [Node RAG](../nodes/rag-node.md) menggunakan vector store (yang mereferensikan kredensial Qdrant) — node ini tidak mereferensikan kredensial secara langsung.
- Jika instans Qdrant Anda memerlukan API key, sertakan key tersebut dalam nilai `qdrant_host` atau konfigurasikan Qdrant sesuai kebutuhan; integrasi saat ini tidak memiliki kolom API key Qdrant terpisah.
- Qdrant yang di-host sendiri: gunakan [image Docker resmi](https://hub.docker.com/r/qdrant/qdrant) dan ekspos port `6333`.

### Digunakan Oleh

- [Node RAG](../nodes/rag-node.md) (melalui vector store)
- [Tab Vectorstores](../tabs/vectorstores-tab.md)

## Custom Embeddings (RAG)

Secara default, embedding RAG berasal dari OpenAI. Kredensial **RAG: Custom Embeddings**
mengarah ke endpoint embedding apa pun yang kompatibel dengan OpenAI — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together, atau gateway yang di-host — dan menamai vector
store tujuan penulisannya.

### Kolom Wajib

| Kolom | Deskripsi |
|-------|-------------|
| `embedding_base_url` | URL endpoint termasuk jalur `/v1`, misalnya `http://localhost:11434/v1` |
| `embedding_api_key` | Opsional. Server lokal biasanya tidak memerlukan key |
| `embedding_model` | Nama model sesuai yang diharapkan endpoint, misalnya `nomic-embed-text` |
| `embedding_dimensions` | Lebar vektor yang dikembalikan model (default `1536`) |
| `embedding_request_dimensions` | Opsional. Minta endpoint mengembalikan `embedding_dimensions` alih-alih lebar native model |
| `db_type` | `qdrant` atau `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Koneksi Qdrant, wajib ketika `db_type` bernilai `qdrant` |

### Catatan

- **Qdrant menerima jumlah dimensi berapa pun.** Setiap koleksi dibuat dengan lebar yang
  dideklarasikan kredensial ini, sehingga kolom Dimensions dapat diedit dengan bebas.
- **Postgres (pgvector) memerlukan tepat 1536 dimensi.** Kolomnya adalah
  `vector(1536)` yang bersifat tetap, sehingga kolom Dimensions dipatok ke 1536 dan kredensial yang mendeklarasikan
  lebar lain akan ditolak saat penyimpanan.
- **Pemendekan untuk pgvector.** Ketika store adalah Postgres, dialog menawarkan *Ask the
  endpoint to return 1536 dimensions*. Opsi ini mengirim parameter permintaan `dimensions`,
  yang dihormati oleh model yang dilatih dengan representasi Matryoshka (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` dan sejenisnya) dengan mengembalikan vektor yang dipendekkan namun
  tetap bermakna. Endpoint yang tidak mendukung parameter ini akan menolak
  permintaan, dan endpoint yang menerima tetapi mengabaikannya akan menghasilkan error jelas yang menyebutkan
  lebar yang sebenarnya dikembalikan. Heym tidak pernah memotong vektor sendiri, karena memotong
  output model non-Matryoshka akan menurunkan kualitas retrieval secara diam-diam. Opsi ini
  tidak ditawarkan untuk Qdrant, yang dapat menyesuaikan ukuran koleksi ke lebar berapa pun.
- Gunakan **Test Connection** di dialog kredensial untuk melakukan embedding pada string uji dan melihat
  lebar yang sebenarnya dikembalikan model sebelum Anda membuat store.
- Parameter permintaan `dimensions` hanya dikirim ke OpenAI sendiri, karena sebagian besar
  server yang kompatibel dengan OpenAI menolak parameter yang tidak dikenal. Lebar native model
  divalidasi terhadap kredensial sebagai gantinya.
- Kredensial **RAG: Qdrant + OpenAI** dan **RAG: Psql + OpenAI** yang ada
  tidak berubah dan tetap berfungsi.

### Digunakan Oleh

- [Node RAG](../nodes/rag-node.md) (melalui vector store)
- [Tab Vectorstores](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym juga dapat menyimpan vektor **di dalam database Postgres miliknya sendiri** menggunakan
ekstensi [pgvector](https://github.com/pgvector/pgvector) — tanpa memerlukan layanan vektor
eksternal. Buat kredensial **RAG: Psql + OpenAI** dan gunakan saat membuat vector
store, lalu pilih **Postgres (pgvector)** di dropdown Database pada node RAG.

### Kolom Wajib

| Kolom | Deskripsi |
|-------|-------------|
| `openai_api_key` | OpenAI API key yang digunakan untuk menghasilkan embedding saat mengindeks dan mencari dokumen |

### Catatan

- Tidak diperlukan host/port — vektor ditulis ke database milik Heym sendiri; Heym tidak pernah terhubung ke database lain.
- Setiap fitur RAG yang tersedia dengan Qdrant (insert, search, filter metadata, reranking Cohere, cloning, sharing) berfungsi secara identik dengan backend Postgres.
- Memerlukan ekstensi `vector`. Heym mempertahankan image resmi `postgres:16` tanpa perubahan (sehingga data yang ada tidak pernah tersentuh) dan **memasang paket `postgresql-16-pgvector` secara otomatis saat startup** — `run.sh`, `deploy.sh`, dan `run_e2e.sh` semuanya menangani hal ini. Pemasangan ini bersifat non-fatal: jika tidak dapat dijalankan (misalnya tanpa jaringan), RAG Qdrant tetap berfungsi dan backend Postgres tetap tidak aktif (migrasi melewati tabel tersebut dengan aman).
- Jika Anda menjalankan image single-container yang dipublikasikan (`ghcr.io/heymrun/heym`) terhadap **Postgres eksternal milik Anda sendiri**, database tersebut harus mendukung ekstensi `vector` (Heym tidak dapat memasangnya ke database yang tidak dikelolanya). Tanpa ekstensi tersebut, pembuatan atau pengunggahan ke vector store Postgres akan mengembalikan pesan yang jelas dan RAG Qdrant tetap berfungsi.

### Digunakan Oleh

- [Node RAG](../nodes/rag-node.md) (melalui vector store)
- [Tab Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) adalah hibrida spreadsheet/database yang mendukung data terstruktur dan formula. Kredensial Grist memungkinkan Heym membaca dan menulis dokumen Grist.
### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `api_key` | Grist API key (dapat ditemukan di **Profile → API Key** pada instance Grist Anda) |
| `server_url` | Base URL server Grist Anda (misalnya `https://docs.getgrist.com` untuk Grist Cloud, atau URL self-hosted Anda) |

### Catatan

- [Node Grist](../nodes/grist-node.md) memerlukan **Document ID** (dari URL dokumen Grist) dan **Table ID** dalam konfigurasinya — keduanya bukan bagian dari credential.
- Untuk Grist self-hosted, set `server_url` ke domain instance Anda.
- Column ID di Grist menggunakan garis bawah (misalnya `User_Name`), bukan label tampilan. Gunakan operasi `listColumns` untuk menemukannya.

### Digunakan Oleh

- [Node Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Credential Google Sheets menghubungkan Heym ke Google Sheets API menggunakan model OAuth2 "Bring Your Own App". Anda menyediakan Google Cloud OAuth2 Client ID dan Client Secret, lalu mengotorisasi akses melalui popup browser. Token diperbarui secara otomatis di latar belakang.

### Penyiapan

1. Buka [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cari dan aktifkan **Google Sheets API**.
2. Buka **Credentials** → **Create Credentials** → **OAuth client ID** → tipe aplikasi **Web application**.
3. Di bagian **Authorized redirect URIs** tambahkan: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Salin **Client ID** dan **Client Secret** yang dihasilkan.
5. Di Heym Dashboard → **Credentials** → **New** → tipe **Google Sheets (OAuth2)**.
6. Masukkan Client ID, Client Secret, dan nama, lalu klik **Connect** untuk membuka popup persetujuan Google dan mengotorisasi akses.

### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `client_id` | OAuth2 Client ID dari Google Cloud Console |
| `client_secret` | OAuth2 Client Secret dari Google Cloud Console |

Token (`access_token`, `refresh_token`, `token_expiry`) disimpan dan diperbarui secara otomatis — Anda tidak mengelolanya secara langsung.

### Catatan

- Layar persetujuan OAuth2 memerlukan scope spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym menggunakan refresh token untuk memperoleh access token baru sebelum kedaluwarsa (buffer keamanan 60 detik).
- Jika Anda merotasi Client Secret di Google Cloud Console, hubungkan kembali credential melalui tombol **Connect**.
- **Produksi:** Set backend **`FRONTEND_URL`** ke URL publik persis yang dibuka pengguna di browser (skema + host, misalnya `https://heym.example.com`). Heym membangun Google OAuth redirect URI hanya dari nilai ini — Heym **tidak** mempercayai header `Origin` atau `X-Forwarded-*` (yang dikendalikan klien). Daftarkan `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` di Google Cloud Console.

### Digunakan Oleh

- [Node Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Credential Google Drive menghubungkan Heym ke Google Drive API menggunakan model OAuth2 "Bring Your Own App" yang sama seperti Google Sheets. Anda menyediakan Google Cloud OAuth2 Client ID dan Client Secret, lalu mengotorisasi akses melalui popup browser. Token diperbarui secara otomatis di latar belakang.

### Penyiapan

1. Buka [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cari dan aktifkan **Google Drive API**.
2. Buka **Credentials** → **Create Credentials** → **OAuth client ID** → tipe aplikasi **Web application**.
3. Di bagian **Authorized redirect URIs** tambahkan: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Salin **Client ID** dan **Client Secret** yang dihasilkan.
5. Di Heym Dashboard → **Credentials** → **New** → tipe **Google Drive (OAuth2)**.
6. Masukkan Client ID, Client Secret, dan nama, lalu klik **Connect** untuk membuka popup persetujuan Google dan mengotorisasi akses.

### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `client_id` | OAuth2 Client ID dari Google Cloud Console |
| `client_secret` | OAuth2 Client Secret dari Google Cloud Console |

Token (`access_token`, `refresh_token`, `token_expiry`) disimpan dan diperbarui secara otomatis — Anda tidak mengelolanya secara langsung.

### Scope

Google Drive meminta **scope Drive penuh** (`https://www.googleapis.com/auth/drive`).

Ini diperlukan karena node beroperasi pada file yang sudah Anda miliki. Scope `drive.file` yang lebih sempit hanya memberikan akses ke file yang dibuat oleh klien OAuth itu sendiri, yang akan membuat `listFolderFiles`, `updateFile`, `removeFile`, dan `removeFolder` tidak melihat apa pun dari Drive Anda yang sudah ada.

Karena Anda menyediakan Client ID dan Secret sendiri dari proyek Google Cloud Anda sendiri, persyaratan verifikasi aplikasi Google untuk scope ini berlaku pada proyek Anda, bukan pada Heym.

### Catatan

- Heym menggunakan refresh token untuk memperoleh access token baru sebelum kedaluwarsa (buffer keamanan 60 detik).
- Jika Anda merotasi Client Secret di Google Cloud Console, hubungkan kembali credential melalui tombol **Connect**.
- Shared drive didukung — node menetapkan `supportsAllDrives` pada setiap panggilan API.
- **Produksi:** Set backend **`FRONTEND_URL`** ke URL publik persis yang dibuka pengguna di browser. Heym membangun Google OAuth redirect URI hanya dari nilai ini — Heym **tidak** mempercayai header `Origin` atau `X-Forwarded-*`. Daftarkan `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` di Google Cloud Console.
- Lihat [Credential Sharing](./credentials-sharing.md) sebelum membagikan credential ini dengan tim.

### Digunakan Oleh

- [Node Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Kredensial BigQuery menghubungkan Heym ke Google BigQuery API menggunakan model OAuth2 "Bring Your Own App". Anda menyediakan Client ID dan Client Secret OAuth2 dari Google Cloud, lalu mengotorisasi akses melalui popup browser. Token diperbarui secara otomatis di latar belakang.

### Penyiapan

1. Buka [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → cari dan aktifkan **BigQuery API**.
2. Buka **Credentials** → **Create Credentials** → **OAuth client ID** → jenis aplikasi **Web application**.
3. Di bagian **Authorized redirect URIs**, tambahkan: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Salin **Client ID** dan **Client Secret** yang dihasilkan.
5. Di Heym Dashboard → **Credentials** → **New** → pilih tipe **BigQuery (OAuth2)**.
6. Masukkan Client ID, Client Secret, dan nama, lalu klik **Connect** untuk membuka popup persetujuan Google dan mengotorisasi akses.

### Field yang Diperlukan

| Field | Deskripsi |
|-------|-------------|
| `client_id` | Client ID OAuth2 dari Google Cloud Console |
| `client_secret` | Client Secret OAuth2 dari Google Cloud Console |

Token (`access_token`, `refresh_token`, `token_expiry`) disimpan dan diperbarui secara otomatis.

### Catatan

- Layar persetujuan OAuth2 memerlukan scope BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Produksi:** Atur **`FRONTEND_URL`** backend ke URL publik. Daftarkan `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` di Google Cloud Console.

### Digunakan Oleh

- [Node BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Kredensial Supabase menghubungkan Heym ke PostgREST API sebuah proyek Supabase sehingga workflow dapat melakukan kueri dan memodifikasi tabel yang didukung Postgres.

### Field yang Diperlukan

| Field | Deskripsi |
|-------|-------------|
| `supabase_url` | URL dasar proyek, misalnya `https://your-project.supabase.co` |
| `supabase_key` | API key dengan akses ke tabel target |
| `supabase_schema` | Schema default opsional (default ke `public`) |

### Catatan

- [Node Supabase](../nodes/supabase-node.md) berkomunikasi dengan `/rest/v1/<table>` dan mendukung filter operator (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in`, dan operator PostgREST terkait) serta grup logika `or` / `and` bersarang.
- Untuk operasi tulis, utamakan key yang ditujukan untuk penggunaan sisi server tepercaya dengan izin tabel minimum yang diperlukan.
- Node dapat menimpa schema per langkah meskipun kredensial mendefinisikan schema default.

### Digunakan Oleh

- [Node Supabase](../nodes/supabase-node.md)

## ClickHouse

Kredensial ClickHouse menghubungkan Heym ke database ClickHouse eksternal melalui antarmuka HTTP-nya sehingga workflow dapat menjalankan operasi SQL, CRUD, dan count terhadap tabel OLAP.

### Field yang Diperlukan

| Field | Deskripsi |
|-------|-------------|
| `host` | Host HTTP tanpa skema, misalnya `your-instance.clickhouse.cloud` |
| `port` | Port antarmuka HTTP (`8443` untuk HTTPS, `8123` untuk HTTP) |
| `username` | Pengguna ClickHouse (default ke `default`) |
| `password` | Kata sandi pengguna (opsional) |
| `database` | Database target (default ke `default`) |
| `secure` | Gunakan HTTPS saat `true` (diperlukan untuk ClickHouse Cloud) |

### Catatan

- [Node ClickHouse](../nodes/clickhouse-node.md) menggunakan klien HTTP resmi `clickhouse-connect` dan memparameterisasi binding filter dan nilai.
- `update` dan `remove` dipetakan ke `ALTER TABLE ... UPDATE` dan `DELETE FROM`, yang merupakan mutasi ClickHouse asinkron; keduanya memerlukan filter.
- `upsert` melakukan `INSERT` dan mengasumsikan tabel `ReplacingMergeTree` untuk perilaku merge-on-key.
- Gunakan **Test connection** di dialog kredensial untuk memverifikasi keterjangkauan.

### Digunakan Oleh

- [Node ClickHouse](../nodes/clickhouse-node.md)

## Notion

Kredensial Notion mendukung baik token integrasi internal maupun koneksi OAuth
integrasi publik. OAuth memungkinkan setiap pengguna mengotorisasi workspace Notion dari Heym alih-alih menyalin
token secara manual.

### Field yang Diperlukan

| Mode | Field | Deskripsi |
|------|-------|-------------|
| Token internal | `api_token` | Token integrasi internal (`ntn_...`) |
| OAuth | `client_id` | Client ID dari integrasi publik Notion |
| OAuth | `client_secret` | Client Secret dari integrasi publik Notion |

Callback OAuth menyimpan `access_token`, `auth_mode`, `workspace_id`, `workspace_name`, dan `bot_id`
secara otomatis. `api_token` internal sebelumnya akan dihapus saat OAuth selesai. Daftarkan
redirect URI ini di Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Alur penyiapan OAuth

1. Pilih **OAuth** di dialog kredensial, masukkan nama, Client ID, dan Client Secret.
2. Klik **Connect** dan otorisasi workspace di popup Notion.
   - Untuk kredensial **baru**, Heym membuat record kredensial saat Anda mengklik **Connect**.
   - Selesaikan otorisasi di popup, lalu klik **Save** untuk kembali ke daftar kredensial.
3. Kredensial yang terhubung menampilkan `connected (Workspace Name)` di daftar. Kredensial OAuth
   yang tertunda menampilkan `Not connected` hingga otorisasi selesai.

Gunakan **Test Connection** di dialog kredensial untuk memverifikasi baik token internal maupun otorisasi
OAuth yang telah selesai. Saat mengedit, membiarkan field token kosong akan mempertahankan token internal yang tersimpan.

Baik token internal maupun access token OAuth tersedia melalui
`$credentials.CredentialName` untuk panggilan [HTTP](../nodes/http-node.md) kustom yang memerlukan
bearer token Notion.
### Catatan

- Integrasi internal memerlukan halaman, database, dan sumber data terkait untuk dibagikan.
- Pengguna OAuth memilih workspace/halaman selama otorisasi Notion.
- Kredensial aplikasi OAuth dienkripsi di dalam kredensial Notion. Callback memuat ulang
  kredensial tersebut di sisi server; secret tidak disematkan dalam OAuth state.
- Kredensial OAuth yang terhubung menampilkan nama workspace; kredensial OAuth yang tertunda menampilkan
  `Not connected` hingga otorisasi selesai.
- **Production:** Setel backend **`FRONTEND_URL`** ke URL browser publik (scheme + host, tanpa
  trailing slash). Redirect URI Notion harus cocok persis:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Node ini menggunakan versi API `2026-03-11` dan terminologi `data_source` terkini. Lihat artikel
  [Notion node](../nodes/notion-node.md#api-version-notes) untuk panduan migrasi dari
  contoh `archived`, `after`, atau database-query yang lebih lama.
- Filter pencarian lama dengan nilai objek `database` dinormalisasi menjadi `data_source`.

### Digunakan Oleh

- [Notion node](../nodes/notion-node.md)

---

## SMTP (Email)

Kredensial SMTP menyimpan detail koneksi server email untuk mengirim email keluar.

### Kolom Wajib

| Kolom | Deskripsi |
|-------|-------------|
| `host` | Nama host server SMTP (mis. `smtp.gmail.com`) |
| `port` | Port SMTP (biasanya `587` untuk STARTTLS, `465` untuk SSL) |
| `email` | Nama pengguna yang digunakan server SMTP untuk masuk; juga pengirim yang terlihat saat `from` kosong |
| `password` | Kata sandi SMTP atau App Password |

### Kolom Opsional

| Kolom | Deskripsi |
|-------|-------------|
| `from` (`smtp_from`) | Alamat From (pengirim) yang terlihat. Biarkan kosong untuk mengirim sebagai `email`. Server tetap masuk sebagai `email`, sehingga akun tersebut harus diizinkan mengirim sebagai alamat ini (di Gmail, alias **Kirim email sebagai** yang terverifikasi). |

### Penyedia SMTP Umum

| Penyedia | Host | Port | Catatan |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Memerlukan [App Password](https://support.google.com/accounts/answer/185833) (2FA harus diaktifkan) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Gunakan kredensial akun Microsoft Anda |
| Mailgun | `smtp.mailgun.org` | `587` | Gunakan kredensial SMTP Mailgun dari pengaturan domain Anda |
| SendGrid | `smtp.sendgrid.net` | `587` | Gunakan `apikey` sebagai username dan API key sebagai password |
| Custom / Self-hosted | domain Anda | `587` / `465` | Postfix, Exim, dll. |

### Catatan

- Gmail memerlukan **App Password** sebagai ganti kata sandi reguler Anda saat Verifikasi 2 Langkah diaktifkan.
- Port `587` menggunakan STARTTLS (dimulai dengan plaintext, ditingkatkan ke TLS). Port `465` menggunakan TLS implisit (SSL sejak awal).

### Digunakan Oleh

- [Send Email node](../nodes/send-email-node.md)

---

## IMAP (Email Masuk)

Kredensial IMAP menyimpan detail koneksi untuk memantau kotak masuk dengan [IMAP Trigger node](../nodes/imap-trigger-node.md).

### Kolom Wajib

| Kolom | Deskripsi |
|-------|-------------|
| `imap_host` | Nama host server IMAP (misalnya `imap.gmail.com`) |
| `imap_port` | Port IMAP (`993` untuk SSL/TLS pada sebagian besar penyedia) |
| `imap_username` | Username kotak surat atau alamat email lengkap |
| `imap_password` | Kata sandi atau app password khusus penyedia |

### Kolom Opsional

| Kolom | Deskripsi |
|-------|-------------|
| `imap_mailbox` | Folder kotak surat yang dipantau (default: `INBOX`) |
| `imap_use_ssl` | Aktifkan SSL/TLS (disarankan; default: `true`) |

### Catatan

- IMAP trigger menetapkan baseline kotak surat saat ini pada polling pertama dan kemudian hanya memproses email yang lebih baru.
- Gmail, Microsoft 365, dan penyedia hosted lainnya sering kali memerlukan **app password** atau secret khusus IMAP serupa.
- Konten lampiran tidak diunduh ke dalam payload workflow; Heym hanya mengekspos metadata lampiran.

### Digunakan Oleh

- [IMAP Trigger node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP sebagai workflow trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) adalah message broker open-source. Kredensial RabbitMQ menyimpan detail koneksi untuk mempublikasikan ke dan mengonsumsi dari queue dan exchange.

### Kolom Wajib

| Kolom | Deskripsi |
|-------|-------------|
| `rabbitmq_host` | URL koneksi AMQP (mis. `amqp://localhost:5672`) |
| `rabbitmq_username` | Username RabbitMQ (default: `guest`) |
| `rabbitmq_password` | Kata sandi RabbitMQ (default: `guest`) |

### Virtual Host

Untuk terhubung ke virtual host tertentu, sertakan di URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Jika menggunakan vhost default, path `/` dapat dihilangkan.

### Plugin Delayed Message

[RabbitMQ node](../nodes/rabbitmq-node.md) mendukung plugin **rabbitmq_delayed_message_exchange**. Saat plugin ini diaktifkan di server RabbitMQ Anda, Anda dapat menyetel delay (dalam milidetik) pada pesan keluar menggunakan kolom `rabbitmqDelayMs` pada node.

Node menyetel header `x-delay` pada pesan yang dipublikasikan. Tipe exchange harus `x-delayed-message` agar delay berlaku.

Untuk mengaktifkan plugin pada instance RabbitMQ self-hosted:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Saat plugin tidak terpasang, header `x-delay` diabaikan dan pesan dikirimkan segera.

### Digunakan Oleh

- [RabbitMQ node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ sebagai workflow trigger)

---

## Amazon S3

Kredensial Amazon S3 menghubungkan Heym ke [Amazon S3](https://aws.amazon.com/s3/). Gunakan dengan [Amazon S3 node](../nodes/amazon-s3-node.md) untuk mengelola bucket dan folder, mengunggah dan mengunduh objek, menyalin key, serta menampilkan daftar atau menghapus objek dari workflow.
### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `aws_access_key_id` | ID access key AWS IAM |
| `aws_secret_access_key` | Secret access key yang dipasangkan dengan ID access key |
| `aws_region` | Region AWS tempat bucket berada (misalnya `us-east-1`) |

### Field Opsional

| Field | Deskripsi |
|-------|-------------|
| `aws_session_token` | Token sesi sementara saat menggunakan kredensial AWS STS |

### Catatan

- Kredensial ini menggunakan autentikasi AWS SigV4 standar melalui boto3.
- Operasi unggah saat ini mengirimkan konten teks UTF-8; unduhan dapat mengembalikan teks atau base64 untuk objek biner.

### Digunakan Oleh

- [Node Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) adalah penyimpanan key-value in-memory yang digunakan untuk caching dan akses data yang cepat.

### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `host` | Nama host atau IP server Redis (misalnya `localhost`) |
| `port` | Port Redis (default: `6379`) |
| `password` | Kata sandi Redis (biarkan kosong jika tidak diatur) |

### Digunakan Oleh

- [Node Redis](../nodes/redis-node.md)

---

## Slack

Kredensial Slack menyimpan **Incoming Webhook URL** untuk memposting pesan ke channel Slack.

### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (dari konfigurasi aplikasi Slack Anda) |

### Catatan

- Buat Incoming Webhook di [api.slack.com/apps](https://api.slack.com/apps) → aplikasi Anda → **Incoming Webhooks**.
- Setiap webhook dibatasi untuk channel tertentu. Buat beberapa kredensial untuk channel yang berbeda.

### Digunakan Oleh

- [Node Slack](../nodes/slack-node.md)

---

## Telegram

Kredensial Telegram menyimpan **Bot Token** dan **Webhook Secret Token** opsional untuk workflow berbasis bot.

### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `bot_token` | Token Telegram Bot API dari BotFather |

### Field Opsional

| Field | Deskripsi |
|-------|-------------|
| `secret_token` | Shared secret yang diverifikasi terhadap `x-telegram-bot-api-secret-token` pada webhook yang masuk |

### Catatan

- Gunakan kredensial yang sama untuk [Telegram Trigger](../nodes/telegram-trigger-node.md) dan [Telegram](../nodes/telegram-node.md).
- Daftarkan webhook secara manual dengan API `setWebhook` milik Telegram menggunakan URL yang ditampilkan di panel node Telegram Trigger.
- `chatId` pada node Telegram dapat berupa ID literal atau ekspresi seperti `$telegramEvent.message.chat.id`.

### Digunakan Oleh

- [Node Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Node Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Kredensial ini digunakan oleh [node HTTP](../nodes/http-node.md) untuk mengautentikasi permintaan yang keluar.

### Bearer

Melampirkan header `Authorization: Bearer <token>` ke permintaan HTTP.

| Field | Deskripsi |
|-------|-------------|
| `token` | Nilai bearer token |

### Header

Melampirkan header kustom ke permintaan HTTP.

| Field | Deskripsi |
|-------|-------------|
| `header_key` | Nama header (misalnya `X-Api-Key`) |
| `header_value` | Nilai header |

Kedua tipe juga dapat direferensikan melalui `$credentials.CredentialName` dalam [Expression DSL](./expression-dsl.md) untuk penggunaan dinamis di node mana pun yang menerima ekspresi.

### Digunakan Oleh

- [Node HTTP](../nodes/http-node.md)

---

## Penyedia LLM (OpenAI, Google, Custom, Cohere)

Kredensial ini menggerakkan node AI.

| Tipe | Deskripsi |
|------|-------------|
| **OpenAI** | API key untuk model GPT dan embedding OpenAI |
| **Google** | API key untuk model Gemini |
| **Custom** | API key + base URL untuk endpoint yang kompatibel dengan OpenAI (Ollama, vLLM, LM Studio, dll.) |
| **Cohere** | API key untuk embedding Cohere |

### OpenAI Prompt Caching

OpenAI secara otomatis menyimpan cache prefix statis (tidak berubah) dari system prompt Anda — tidak diperlukan konfigurasi tambahan. Eksekusi workflow berulang yang berbagi prefix system prompt yang sama akan mendapatkan manfaat dari harga token yang di-cache, sehingga mengurangi biaya dan latensi. Hal ini sangat berguna ketika Anda memiliki instruksi panjang yang tetap dan hanya pesan pengguna yang berubah antar eksekusi. Pantau tingkat cache hit dan penghematan token di [tab Traces](../tabs/traces-tab.md) atau dasbor penggunaan OpenAI untuk mengoptimalkan struktur prompt Anda agar penggunaan ulang cache maksimal.

### Digunakan Oleh

- [Node LLM](../nodes/llm-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Node RAG](../nodes/rag-node.md) (embedding OpenAI melalui kredensial Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) adalah server proxy untuk melewati Cloudflare dan tantangan perlindungan bot serupa.

### Field Wajib

| Field | Deskripsi |
|-------|-------------|
| `flaresolverr_url` | URL instans FlareSolverr Anda (misalnya `http://localhost:8191`) |

Alamat loopback dan privat didukung di sini, sehingga menjalankan FlareSolverr di samping Heym berfungsi sesuai dokumentasi. URL tidak boleh mengarah ke alamat link-local atau cloud-metadata. Karena alamat privat diizinkan, field ini juga dapat diarahkan ke layanan internal lain dan balasannya akan dikembalikan pada output node. Setiap pengguna yang telah masuk dapat membuat kredensial ini, sehingga batasannya adalah siapa yang boleh membuat workflow ditambah aturan jaringan Anda, bukan berbagi kredensial. Lihat [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Digunakan Oleh

- [Node Crawler](../nodes/crawler-node.md)

---
## Terkait

- [Credentials](./credentials.md) – Ikhtisar credentials dan bagaimana node menggunakannya
- [Tab Credentials](../tabs/credentials-tab.md) – Menambahkan dan mengelola credentials
- [Berbagi Credentials](./credentials-sharing.md) – Bagikan credentials kepada pengguna dan tim
- [Keamanan](./security.md) – Enkripsi saat penyimpanan, kontrol akses
- [Expression DSL](./expression-dsl.md) – Sintaks `$credentials` untuk akses dinamis

---

## Model Router (Auto Model)

Mengarahkan setiap permintaan ke salah satu credentials model yang sudah Anda miliki, dengan menggunakan model keputusan untuk memilih. Fitur ini menyimpan referensi, tidak pernah menyimpan key miliknya sendiri.

### Field Wajib

- `decision_credential_id` – credential **Decision Model** yang dapat Anda akses.
- `decision_model` – model yang melakukan panggilan routing, misalnya `jev-latest`.
- `options` – minimal dua entri, masing-masing dengan nama, salah satu credentials OpenAI/Google/Custom Anda, sebuah model pada credentials tersebut, dan kriteria yang menyatakan kapan entri tersebut harus dipilih.

### Field Opsional

- `routing_instructions` – cara menimbang opsi secara keseluruhan.
- Satu opsi dapat ditandai sebagai fallback yang digunakan ketika routing gagal.

### Catatan

Nama opsi adalah pilihan yang dipertimbangkan oleh model keputusan, sehingga nama-nama tersebut harus berbeda. Sebuah opsi tidak dapat menunjuk ke Model Router lain.
