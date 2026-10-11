# Berbagi Kredensial

Credentials dapat dibagikan kepada pengguna lain agar workflow mereka dapat menggunakan API key Anda. Lihat [Credentials](./credentials.md) untuk ikhtisar dan [Credentials Tab](../tabs/credentials-tab.md) untuk menambahkan dan mengelola credentials.

## Berbagi Credentials dengan LLM

Untuk memungkinkan LLM atau agen AI menggunakan API key, simpan key tersebut sebagai credential dan biarkan node yang membuat permintaan melampirkannya. Model memutuskan apa yang akan dipanggil; node mengautentikasi panggilan tersebut saat dijalankan.

- **Simpan secret sebagai credential.** Nilai sensitif dienkripsi saat disimpan dan disamarkan di UI setelah dibuat.
- **Rujuk credential di tempat permintaan dibuat.** Node [LLM](../nodes/llm-node.md) dan [Agent](../nodes/agent-node.md) memilih credential model mereka berdasarkan ID, dan permintaan HTTP menempatkan `$credentials.CredentialName` di header autentikasi. Jauhkan secret dari field prompt, karena semua yang ada di prompt dikirim ke penyedia model sebagai teks.
- **Berikan tools kepada agen, bukan keys.** Ketika Agent memanggil node HTTP, server MCP, atau sub-workflow sebagai tool, credential diterapkan di dalam tool tersebut dan model menerima hasil dari tool tersebut.
- **Output disamarkan.** Ketika nilai credential yang lebih panjang dari tujuh karakter muncul di output sebuah node, hanya tujuh karakter pertamanya yang dipertahankan, sehingga respons yang menyalin sebuah key hanya menampilkan prefiks tersebut di hasil dan trace. Lihat [Output Masking](#output-masking).
- **Biarkan asisten membuat credentials.** Ketika [AI Assistant](./ai-assistant.md#credentials) atau tab Chat membuat credential, ia hanya melihat nama dan tipe, dan Anda memasukkan secret di formulir credential biasa.
- **Bagikan kepada orang lain dengan cara yang sama.** Bagikan credential kepada pengguna atau tim, seperti dijelaskan di bawah, dan workflow mereka dapat menggunakan key Anda melalui node LLM dan Agent mereka sendiri.

## Model Berbagi

- **CredentialShare** – Menghubungkan `credential_id` ke `user_id` (unik per pasangan)
- **Berbagi berdasarkan email** – `POST /api/credentials/{credential_id}/shares` dengan email; pengguna dicari dan ditambahkan
- **Cabut** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Anda juga dapat membagikan credentials kepada [Teams](./teams.md):

- **CredentialTeamShare** – Menghubungkan `credential_id` ke `team_id`; semua anggota tim mendapatkan akses
- **Berbagi dengan tim** – `POST /api/credentials/{credential_id}/team-shares` dengan `team_id`
- **Cabut berbagi tim** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Credentials yang dibagikan menampilkan indikator di UI [Credentials Tab](../tabs/credentials-tab.md).

## Credentials dengan Cakupan Luas

Membagikan credential memberikan kepada penerima semua yang dapat dilakukan credential tersebut. Untuk sebagian besar integrasi, cakupannya terbatas pada satu workspace atau izin satu API key, tetapi beberapa credential jauh lebih luas.

> **Credentials Google Drive memberikan akses penuh ke Drive.** Credential [Google Drive](../nodes/google-drive-node.md) diotorisasi dengan scope `https://www.googleapis.com/auth/drive` sehingga node dapat beroperasi pada file yang sudah Anda miliki. Membagikannya kepada pengguna atau tim memberikan kepada setiap dari mereka kemampuan untuk **membaca, mengubah, dan menghapus secara permanen apa pun di Google Drive Anda** melalui workflow — bukan hanya file yang Anda maksudkan. Bagikan hanya kepada orang yang akan Anda beri akses penuh ke Drive secara langsung.

Jika Anda perlu membatasi eksposur, buat akun Google khusus dengan akses hanya ke folder yang dibutuhkan workflow, dan hubungkan credential dengan akun tersebut alih-alih akun utama Anda.

Credential **Decision Model** membawa endpoint dan, jika diatur, sebuah API key. Membagikannya memungkinkan penerima membelanjakan key tersebut dari workflow apa pun yang dapat mereka jalankan, persis seperti credential LLM.

Credential **Model Router** membagikan semua yang dirutekannya. Orang yang Anda bagikan dapat menjalankan permintaan terhadap setiap credential di daftar opsinya, dan permintaan tersebut membelanjakan key Anda. Mereka tidak dapat membaca key tersebut, dan credentials tersebut tidak muncul di daftar credential mereka sendiri.

Ini adalah pemberian yang sama dengan membagikan credential OpenAI secara langsung, dan inilah yang membuat router berguna bagi sebuah tim. Jika Anda tidak menginginkannya, bagikan credentials satu per satu dan biarkan setiap orang memilih model.

## Berbagi dengan Kolaborator Workflow

Ketika Anda membagikan workflow, kolaborator dapat membuka dan menjalankannya tetapi tidak dapat menggunakan credentials Anda kecuali Anda juga membagikan credentials tersebut kepada mereka. Hal ini berlaku untuk credentials di workflow utama dan di setiap sub-workflow yang dipanggilnya. Bagikan setiap credential kepada pengguna atau tim yang sama dengan yang Anda undang ke workflow. Sub-workflow juga harus dibagikan secara terpisah dari editor workflow anak. Lihat [Workflow Organization](./workflow-organization.md#sharing-workflows).

## Konteks Eksekusi

Ketika workflow dijalankan, credentials diresolusikan untuk **pemilik workflow** (atau pengguna saat ini ketika dijalankan). `get_credentials_context()` menggabungkan:

1. **Credentials yang dimiliki** – `Credential.owner_id == user_id`
2. **Credentials yang dibagikan ke pengguna** – `CredentialShare` di mana `CredentialShare.user_id == user_id`
3. **Credentials yang dibagikan ke tim** – `CredentialTeamShare` di mana pengguna adalah anggota tim

Semuanya digabungkan ke dalam satu dict konteks yang di-key berdasarkan nama credential.

## Penggunaan di Workflows
### Berdasarkan Nama (Expression DSL)

Credential diekspos sebagai `$credentials.CredentialName` dalam [Expression DSL](./expression-dsl.md). Gunakan ini untuk:

- Node HTTP (autentikasi Bearer/Header)
- Node Telegram
- Node Slack
- Token bearer Notion dalam permintaan HTTP kustom (token internal atau OAuth access token)
- Node apa pun yang menerima ekspresi untuk autentikasi

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Berdasarkan ID (credentialId)

Beberapa node menyimpan `credentialId` (UUID) di `node.data`:

| Tipe Node | Field | Deskripsi |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Credential LLM API |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credential access token Codex dan credential GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credential gateway OpenCode Go dan credential GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credential email/API token Jira Cloud atau username/password Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Token internal Notion atau credential workspace OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Auth token Sentry dan base URL opsional |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL proyek Supabase dan API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detail koneksi ClickHouse (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credential bot Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Public key Discord atau credential webhook |
| Vector Store | `credential_id` | Vector DB Qdrant atau Postgres (pgvector), melalui credential RAG Qdrant, Psql, atau Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credential model; credential model atau Decision Model untuk judge LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) langkah AI | `credentialId` | Model LLM/Vision (untuk langkah AI dan [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executor memuat credential langsung dari database berdasarkan ID dan mendekripsi konfigurasinya.

## Output Masking

Setelah eksekusi, `mask_sensitive_output()` menyamarkan nilai credential pada output, dengan mempertahankan tujuh karakter pertama dari setiap secret yang panjangnya lebih dari tujuh karakter dan mengganti sisanya dengan `**`, sehingga secret tidak terekspos dalam hasil atau trace.

## Terkait

- [Tab Credentials](../tabs/credentials-tab.md) – Menambahkan dan membagikan credential
- [Integrasi Pihak Ketiga](./integrations.md) – Penyiapan terperinci untuk setiap tipe credential
- [Teams](./teams.md) – Bagikan dengan tim
- [Expression DSL](./expression-dsl.md) – Sintaks `$credentials`
- [Tipe Node](./node-types.md) – Node yang menggunakan credential ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Node Agent](../nodes/agent-node.md) – Menggunakan `credentialId` untuk LLM
