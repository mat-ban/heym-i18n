# Credentials

Credentials menyimpan API key dan secret yang digunakan oleh Node Workflow. Anda menambahkannya di [Credentials Tab](../tabs/credentials-tab.md) dan mereferensikannya berdasarkan nama dalam konfigurasi Node.

## Apa Itu Credentials

- **Disimpan per pengguna** – Setiap credential dimiliki oleh seorang pengguna dan dapat [dibagikan](./credentials-sharing.md) dengan pengguna lain atau [Teams](./teams.md).
- **Terenkripsi saat disimpan** – Nilai sensitif dienkripsi; UI menyamarkannya setelah pembuatan.
- **Direferensikan berdasarkan nama** – Node memilih credential berdasarkan nama (atau ID). Execution engine menyelesaikan credential untuk pemilik Workflow pada saat eksekusi.

## Cara Node Menggunakannya

| Jenis Node | Credential umum | Tujuan |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API key untuk model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Base URL dari endpoint decision model, plus API key opsional |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Memilih model mana milik Anda yang melayani setiap permintaan, menggunakan decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Sign-in langganan ChatGPT (OAuth) atau access token Codex untuk runner, plus GitHub PAT untuk operasi repositori |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API key gateway OpenCode Go (base URL opsional) untuk runner, plus GitHub PAT untuk operasi repositori |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) untuk panggilan GitHub API, operasi Node GitHub, dan integrasi MCP |
| [Jira](../nodes/jira-node.md) | Jira | Email/API token Cloud atau username/password Data Center, base URL situs Jira, mode deployment, dan versi REST API opsional |
| [Linear](../nodes/linear-node.md) | Linear | Personal API key atau OAuth2 untuk tim, proyek, issue, dan komentar |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Auth untuk permintaan |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token dan webhook secret opsional |
| [Discord](../nodes/discord-node.md) | Discord | URL incoming webhook |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Public key aplikasi untuk verifikasi signature |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Koneksi vector store (Qdrant eksternal, atau Postgres milik Heym sendiri via pgvector), dengan OpenAI atau endpoint embedding apa pun yang kompatibel dengan OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook atau API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Koneksi mailbox masuk |
| [Send Email](../nodes/send-email-node.md) | SMTP | Server email |
| [Redis](../nodes/redis-node.md) | Redis | Koneksi |
| [Grist](../nodes/grist-node.md) | Grist | API key + URL server |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + persetujuan OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + persetujuan OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + persetujuan OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL proyek + API key (+ skema default opsional) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + username/password + database (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token, atau Client ID + Client Secret + persetujuan OAuth integrasi publik |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token plus base URL self-hosted opsional |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Untuk penyiapan terperinci (host, port, field khusus penyedia), lihat [Third-Party Integrations](./integrations.md). Ini mencakup penyiapan bot Telegram, email masuk via IMAP, dan email keluar via SMTP.

Credential GitHub juga dapat menyertakan `base_url` opsional ketika Anda menargetkan GitHub
Enterprise Server alih-alih GitHub.com. Ketika Anda mengedit credential GitHub untuk merotasi token,
membiarkan `base_url` kosong akan mempertahankan endpoint Enterprise yang ada. Masukkan URL baru hanya ketika
Anda ingin mengubah endpoint tersebut.

Credential Jira, Linear, Supabase, Notion, Sentry, dan ClickHouse menampilkan **Test Connection** di dialog credential. Untuk Jira, pemeriksaan memanggil endpoint pengguna saat ini milik Jira. Untuk Linear,
pemeriksaan memanggil Linear API dengan `getViewer` dan mengonfirmasi bahwa API key atau OAuth token valid.
Saat mengedit, Anda dapat menguji tanpa memasukkan ulang API key jika secret yang tersimpan masih ada. Untuk Notion,
pilih **Internal token** atau **OAuth** di dialog; OAuth menggunakan Client ID dan Client Secret
dari integrasi publik Notion Anda. Lihat [Third-Party Integrations](./integrations.md#notion) untuk
detail penyiapan Notion.
## Penggunaan paket coding

Tab **AI Defaults** di [Settings](./user-settings.md) menampilkan sisa penggunaan paket coding untuk kredensial Codex Anda (milik sendiri dan yang dibagikan). Untuk setiap kredensial Codex, tab ini menampilkan bilah horizontal per jendela rate-limit yang aktif — umumnya jendela **5 jam** dan/atau **Weekly**, bergantung pada paket Anda — beserta persentase kuota yang tersisa dan hitung mundur reset. Data berasal dari header respons rate-limit backend Codex, yang diambil sesuai permintaan.

Kredensial OpenCode Go juga tercantum di sana, tetapi ditandai **"usage unavailable"**: gateway OpenCode zen tidak mengekspos data sisa kuota, sehingga tidak ada bilah yang dapat ditampilkan.

## Dalam Expressions

Beberapa Node mengizinkan expressions untuk auth. Gunakan [Expression DSL](./expression-dsl.md) dengan `$credentials.CredentialName` untuk mereferensikan secret kredensial yang telah di-resolve di dalam sebuah expression. Untuk baris header yang dibutuhkan setiap tipe kredensial dalam permintaan HTTP, lihat [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Kredensial Codex sengaja dikecualikan dari `$credentials`. Baik Anda masuk dengan ChatGPT (langganan, tanpa biaya API per-token) atau menempelkan Codex `access_token`, token hanya diteruskan ke proses Codex runner lokal. Token sign-in ChatGPT di-refresh secara otomatis saat kedaluwarsa.

Kredensial Jira juga dikecualikan dari `$credentials`. [Jira node](../nodes/jira-node.md) memuat kredensial berdasarkan `credentialId` saat runtime. Untuk panggilan Jira REST kustom yang tidak tercakup oleh Jira node, gunakan [HTTP node](../nodes/http-node.md) dengan Jira Basic Auth (`email:api_token` untuk Jira Cloud atau `username:password` untuk Data Center / Server), misalnya `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Anda juga dapat menggunakan kredensial [Header](../nodes/http-node.md) dengan `Authorization: Basic <base64(user:secret)>`. Personal access token dan Bearer auth Jira Data Center / Server belum didukung oleh kredensial Jira.

| Tipe kredensial | Nilai yang diekspos ke `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | String Bearer token |
| Header | Baris lengkap `header key: header value`, siap dimasukkan ke argumen `-H` cURL |
| GitHub | Personal access token |
| Notion | `api_token` internal atau OAuth `access_token` (Bearer token untuk panggilan Notion API) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Contoh:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Gunakan **node** Notion untuk operasi database, page, dan block native. Gunakan `$credentials` ketika permintaan [HTTP](../nodes/http-node.md) kustom membutuhkan bearer token Notion yang sama.

## Membuat Kredensial dari Chat

[AI Assistant](./ai-assistant.md#credentials), [Chat tab](../tabs/chat-tab.md), dan [Chat with Heym](./chat-with-heym.md) dapat membuat kredensial ketika sebuah Workflow membutuhkannya, atau kapan pun Anda memintanya. Asisten menyarankan tipe dan nama, lalu formulir kredensial reguler terbuka di dalam percakapan. Mintalah untuk memperbarui kredensial yang Anda miliki, dan formulir yang sama akan terbuka pada kredensial tersebut, dengan secret-nya disamarkan. Asisten hanya melihat nama dan tipe. `heym_chat` melalui [MCP](../tabs/mcp-tab.md) tidak dapat membuat, memperbarui, atau memilih kredensial.

## Terkait

- [Credentials Tab](../tabs/credentials-tab.md) – Menambah, mengedit, menghapus kredensial
- [GitHub Node](../nodes/github-node.md) – Operasi GitHub REST native
- [Jira Node](../nodes/jira-node.md) – Otomatisasi proyek, issue, komentar, lampiran, pengguna, notifikasi, dan transisi Jira
- [Linear Node](../nodes/linear-node.md) – Otomatisasi workspace dan issue Linear GraphQL
- [Notion Node](../nodes/notion-node.md) – Mencari dan mengelola konten Notion
- [Sentry Node](../nodes/sentry-node.md) – Otomatisasi organisasi, proyek, tim, issue, event, dan rilis Sentry
- [Credentials Sharing](./credentials-sharing.md) – Berbagi dengan pengguna dan tim
- [Third-Party Integrations](./integrations.md) – Panduan penyiapan per tipe kredensial
- [Expression DSL](./expression-dsl.md) – `$credentials` dalam expressions

## Model Router (Auto Model)

Model Router tidak menyimpan key. Ia menyimpan **decision model credential**, daftar **model
options** — masing-masing berupa kredensial OpenAI, Google, atau Custom yang sudah ada beserta sebuah model — dan, untuk
setiap opsi, teks bebas yang menyatakan kapan opsi tersebut harus digunakan.

Ia muncul di setiap picker yang menawarkan model: Node [LLM](../nodes/llm-node.md) dan
[Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, expression
builder, dan Data Tables. Satu-satunya modelnya adalah **Auto**. Pilih ia, dan decision model akan membaca
setiap permintaan dan merutekannya. [Evals](../tabs/evals-tab.md) tidak menyertakannya, karena eval
membandingkan model-model tertentu sedangkan router memilih sendiri.

Sebuah agent akan merutekan ulang seiring kemajuan tool loop-nya, sehingga model yang murah dapat mengambil giliran awal
dan model yang lebih kuat mengambil giliran yang membutuhkannya. Input yang identik akan menggunakan kembali keputusan sebelumnya,
sehingga sebuah loop hanya membayar keputusan ketika percakapan benar-benar telah bergerak.

### Yang tidak dapat dilakukannya

Auto Model tidak dapat dikombinasikan dengan **Responses API**, **Batch mode**, atau **image
output**. Toggle tersebut menonaktifkan dirinya sendiri ketika sebuah router dipilih, dan masing-masing menjelaskan alasannya.
Pemeriksaan guardrail dan classifier kebijakan human-review adalah panggilan single-model yang tetap dan
tidak pernah dirutekan.
### Ketika routing gagal

Tandai satu opsi **Gunakan opsi ini ketika routing gagal** dan gangguan pada model pengambil keputusan tidak akan pernah menghentikan sebuah run; fallback akan digunakan dan alasannya dicatat pada run tersebut. Tanpa opsi tersebut, Node akan gagal alih-alih menebak.

### Melihat ke mana sebuah permintaan diarahkan

Traces menampilkan `Auto Model / GPT-5` alih-alih hanya modelnya saja, dan biaya tetap diatribusikan ke model yang benar-benar dijalankan. Execution Log dan Span View pada canvas menampilkan pasangan yang sama, dan Span View mencantumkan turn mana yang diarahkan ke mana.
