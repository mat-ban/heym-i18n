# Trigger

Workflow dimulai oleh **Node trigger** atau **titik masuk**. Setiap jenis trigger memiliki endpoint atau proses latar belakangnya sendiri.

## Node Trigger

Node awal (tanpa edge masuk) yang memulai eksekusi:

| Jenis Node | Deskripsi |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Titik masuk HTTP. Menerima `body`, `headers`, `query` dari permintaan. |
| [Cron](../nodes/cron-node.md) | Berjalan sesuai jadwal (ekspresi cron, misalnya `0 * * * *` untuk setiap jam). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Dimulai saat Telegram mengirim pembaruan webhook bot ke URL webhook khusus Node. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Dimulai saat Discord mengirim webhook Interactions API ke endpoint khusus Node. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Melakukan polling ke kotak surat IMAP dan dimulai sekali untuk setiap email yang baru terdeteksi. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Dimulai saat Heym memublikasikan event platform. Event dalam satu jendela pengiriman tiba bersamaan sebagai array. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Membuka koneksi klien keluar ke socket eksternal dan dimulai pada event socket yang dipilih. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Membuat URL unggah sekali pakai dan dimulai saat pemanggil mengirim file multipart berukuran besar. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Dimulai saat pesan dikonsumsi dari antrean RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Dimulai saat Slack mengirim event melalui webhook Events API. |

## Titik Masuk

| Trigger | Endpoint / Sumber | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Header `X-MCP-Key` atau `Authorization: Bearer` (hanya header) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token sesi Portal |
| **Board** | Perpindahan kartu [Board](../tabs/board-tab.md) / tindak lanjut berjalan ke kolom dengan rantai workflow (`trigger_source="board"`) | JWT (pemilik board) |
| **Cron** | Penjadwal Cron (berjalan setiap 60 detik, mengevaluasi ekspresi cron) | N/A |
| **IMAP** | Manajer trigger IMAP (worker pemimpin, interval polling per Node) | Nama pengguna/kata sandi IMAP |
| **WebSocket** | Manajer trigger WebSocket keluar (worker pemimpin, koneksi klien persisten) | Header per Node opsional |
| **File Upload** | `POST /api/file-intake/u/{token}` setelah slot dibuat | Token kapabilitas sekali pakai |
| **RabbitMQ** | Konsumen RabbitMQ (worker pemimpin) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | Secret penandatanganan HMAC-SHA256 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Kunci publik aplikasi Ed25519 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` opsional |
| **Editor** | Sama seperti Webhook, melalui `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Body permintaan diteruskan sebagai `body` ke Node textInput
- **Mode Body**: Workflow dapat menggunakan contoh berbentuk field `defined` atau contoh JSON mentah `generic` di editor dan dialog cURL
- **Auth**: Dikonfigurasi per workflow (`auth_type`, `allow_anonymous`)

Lihat [Webhook](./webhooks.md) untuk detail tentang TTL, cache, pembatasan laju, dan auth.

### MCP

Workflow dengan `mcp_enabled=true` muncul sebagai tool bagi klien MCP. Nama tool diturunkan dari nama workflow. Lihat [Tab MCP](../tabs/mcp-tab.md).

### Portal

UI obrolan publik di `/chat/{slug}`. Lihat [Portal](./portal.md) untuk detail.

### Cron

Penjadwal cron berjalan setiap 60 detik, menemukan workflow dengan Node `cron` aktif, mengevaluasi ekspresi cron, dan menjalankan workflow yang cocok. Input mencakup `{"triggered_by": "cron"}`.

### IMAP

Manajer trigger IMAP berjalan di worker pemimpin dan memeriksa Node `imapTrigger` aktif pada `pollIntervalMinutes` yang dikonfigurasi. Setiap Node menyimpan kursor IMAP (`UIDVALIDITY` + UID terakhir yang terlihat). Input mencakup `email`, `triggered_by: "imap"`, `trigger_node_id`, dan `triggered_at`.

### Event Platform Heym

Dispatcher event Heym melakukan polling ke log `heym_events` setiap 5 detik dan mengirimkan event yang cocok ke Node `heymTrigger` aktif. Pengiriman diklaim per (event, workflow, Node) melalui batasan unik, sehingga sebuah event dipicu tepat sekali per Node yang berlangganan di setiap worker, kontainer, dan mesin. Setiap event yang diklaim dalam satu proses dikirim dalam satu kali eksekusi: input mencakup `events` (selalu berupa array, terlama lebih dulu), `count`, `triggered_by: "heym_event"`, `trigger_node_id`, dan `triggered_at`. Hanya event yang dipublikasikan dalam 5 menit terakhir yang dikirim, yang mencegah gangguan memutar ulang tumpukan; event disimpan selama 7 hari.

### WebSocket

Manajer trigger WebSocket berjalan di worker pemimpin dan mempertahankan satu koneksi klien keluar per Node [WebSocket Trigger](../nodes/websocket-trigger-node.md) yang aktif. Ini dapat memancarkan eksekusi untuk `onMessage`, `onConnected`, dan `onClosed`. Input mencakup `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id`, dan salah satu dari `message`, `connection`, atau `close`.
### File Upload

[File Upload Trigger](../nodes/file-upload-trigger-node.md) membuat slot unggahan sekali pakai dengan batas TTL ketika Workflow dipanggil melalui API, MCP, atau kanvas. Mengunggah data formulir multipart ke `POST /api/file-intake/u/{token}` akan menghabiskan slot, menyimpan file sebagai Drive file, dan memulai Workflow secara sinkron. Input mencakup `file`, `uploaded_at`, `triggered_by: "file_upload"`, dan metadata unggahan.

### Telegram

Telegram mengirim pembaruan webhook bot ke `POST /api/telegram/webhook/{node_id}`. Payload diteruskan ke dalam Workflow sebagai `update`, `message`, `callback_query` opsional, `headers` yang telah disanitasi, `triggered_by`, `trigger_node_id`, dan `triggered_at`. Jika kredensial yang dipilih memiliki token rahasia, Heym memverifikasi `x-telegram-bot-api-secret-token` sebelum eksekusi.

### Discord

Discord mengirim webhook interaksi ke `POST /api/discord/webhook/{node_id}`. Payload diteruskan ke dalam Workflow sebagai `interaction`, `type`, `data`, `headers` yang telah disanitasi, `triggered_by`, `trigger_node_id`, dan `triggered_at`. Heym memverifikasi permintaan menggunakan Ed25519 dan kunci publik aplikasi dari kredensial `discord_trigger` yang dipilih sebelum eksekusi.

### RabbitMQ

Konsumer RabbitMQ dimulai ketika leader worker melakukan inisialisasi. Workflow dengan Node `rabbitmq` di mana `rabbitmqOperation === "receive"` akan mendapatkan konsumer. Input mencakup `message_data` (body, headers, routing_key, dll.) dan `triggered_by: "rabbitmq"`.

## Batas konkurensi

Workflow dengan [batas konkurensi](./webhooks.md#concurrency-limit-and-queued-runs) mengantrekan run produksi dari setiap titik masuk di atas ketika slotnya penuh, pertama masuk, pertama keluar, di semua instans. Cara pemanggil mengetahui hasilnya bergantung pada titik masuk:

| Titik masuk | Saat run menunggu |
|---|---|
| Webhook / API | `202 Accepted` dengan `execution_id` dan URL status |
| SSE streaming, Quick Drawer, Portal chat | Stream tetap terbuka dan mengirim event `queued` |
| Portal without streaming | Permintaan menunggu hasilnya |
| MCP | Hasil `queued` untuk di-poll dengan `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger menunggu hasilnya selama run di [instans](./cluster.md) lain akan menunggu. Run tetap dieksekusi dan dicatat ke riwayat |

Ketika antrean penuh, run tidak dimulai dan riwayat mencatatnya sebagai `queue_full`. Run pengujian editor, panggilan sub-workflow (node [Execute](../nodes/execute-node.md) dan alat workflow agen), [Evals](../tabs/evals-tab.md), run uji mode build obrolan, dan pelanjutan peninjauan tidak pernah dimasukkan ke antrean. Run kartu [Board](../tabs/board-tab.md), run [File Upload](../nodes/file-upload-trigger-node.md), run yang dimulai oleh alat run-workflow asisten AI, dan workflow notifikasi peringatan juga dimulai tanpa menunggu slot.

## trigger_source

Riwayat eksekusi mencatat `trigger_source` untuk setiap titik masuk:

| Nilai | Kapan |
|-------|------|
| `"API"` | Panggilan Webhook / API tanpa header eksplisit (default) |
| `"Canvas"` | Dijalankan dari kanvas editor Workflow |
| `"Quick Drawer"` | Dijalankan dari panel quick-drawer editor, termasuk eksekusi file yang diunggah dari zona lepasnya |
| `"cron"` | Penjadwal Cron |
| `"imap"` | Manajer Trigger IMAP |
| `"websocket"` | Manajer Trigger WebSocket keluar |
| `"file_upload"` | Endpoint unggahan File Upload Trigger (tautan yang dibuat melalui HTTP, MCP, atau kanvas) |
| `"dashboard"` | Eksekusi widget dasbor dan unggahan dari widget lepas file |
| `"telegram"` | Webhook bot Telegram |
| `"Discord"` | Webhook interaksi Discord |
| `"MCP"` | Pemanggilan tool MCP |
| `"portal"` | Eksekusi Portal |
| `"dashboard_chat"` | Obrolan asisten AI |
| `"AI Agents"` | Sub-workflow yang dipanggil oleh Node agen AI |
| `"SUB_WORKFLOW"` | Sub-workflow yang dipanggil oleh Node Execute Workflow |
| kustom | Nilai apa pun yang dikirim dalam header `X-Trigger-Source` atau parameter query/body `trigger_source` |
| (tidak diatur) | Konsumer RabbitMQ |

## Input berdasarkan Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` dari permintaan
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` opsional + `headers` yang telah disanitasi + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` yang telah disanitasi + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (objek event Slack lengkap) + `headers` (disanitasi) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` opsional

## Terkait

- [Webhooks](./webhooks.md) – TTL Webhook, cache, rate limit, autentikasi
- [Workflow Structure](./workflow-structure.md) – Node dan edge
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger webhook interaksi Discord
- [Quick Start](../getting-started/quick-start.md) – Membangun Workflow dengan Input
- [Portal](./portal.md) – Trigger Portal dan UI obrolan
- [Execution History](./execution-history.md) – Melihat eksekusi sebelumnya dan trigger_source
