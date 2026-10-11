# Telegram Trigger

Node **Telegram Trigger** adalah titik masuk tanpa input yang memulai workflow saat bot Telegram Anda menerima pembaruan webhook. Gunakan node ini untuk chatbot, triase dukungan, perintah mirip slash, atau callback tombol inline yang harus diteruskan ke node AI dan integrasi hilir.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial `telegram` yang berisi token bot dan token rahasia webhook opsional |

## Panduan Penyiapan

### 1. Buat Kredensial `telegram`

1. Buka **Settings → Credentials → New Credential**
2. Pilih tipe **Telegram Bot**
3. Tempelkan **Bot Token** dari BotFather
4. Secara opsional, atur **Webhook Secret Token** jika Anda ingin Telegram mengirim header verifikasi yang cocok
5. Simpan kredensial

### 2. Tambahkan Node ke Workflow Anda

1. Seret **Telegram Trigger** ke kanvas
2. Pilih node untuk membuka panel Properties
3. Pilih kredensial `telegram` Anda
4. Salin **Webhook URL** yang ditampilkan di panel node

### 3. Daftarkan Webhook di Telegram

Gunakan metode `setWebhook` dari Bot API dengan URL dari node:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Jika Anda mengonfigurasi token rahasia di Heym, kirimkan nilai yang sama saat mengatur webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Field Output

Setelah node terpicu, node hilir dapat mengakses:

| Ekspresi | Deskripsi |
|------------|-------------|
| `$nodeLabel.update` | Payload pembaruan Telegram lengkap |
| `$nodeLabel.message` | Objek utama yang menyerupai pesan dari pembaruan |
| `$nodeLabel.message.text` | Teks pesan yang masuk |
| `$nodeLabel.message.chat.id` | ID chat untuk membalas di node hilir |
| `$nodeLabel.message.from.id` | ID pengguna Telegram |
| `$nodeLabel.callback_query` | Payload callback saat pembaruan berasal dari keyboard inline |
| `$nodeLabel.headers` | Header webhook yang telah disanitasi |
| `$nodeLabel.triggered_by` | Label sumber Trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID node di kanvas yang menerima pembaruan Telegram |
| `$nodeLabel.triggered_at` | Timestamp ISO untuk eksekusi workflow ini |

## Contoh Workflow

**Pesan Telegram → LLM → Balasan Telegram**

```
telegramTrigger → llm → telegram
```

- Label **Telegram Trigger**: `telegramEvent`
- Pesan pengguna **LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId **Telegram**: `$telegramEvent.message.chat.id`

## Keamanan

- Jika kredensial Anda memiliki `secret_token`, Heym memverifikasi `x-telegram-bot-api-secret-token` sebelum menjalankan workflow.
- Header permintaan yang sensitif dihapus sebelum payload mencapai node hilir.
- URL webhook bersifat statis untuk ID node, sehingga Anda hanya perlu mendaftarkannya ulang saat node itu sendiri berubah.

## Terkait

- [Telegram Node](./telegram-node.md) – Kirim balasan atau notifikasi keluar
- [Triggers](../reference/triggers.md) – Ikhtisar semua titik masuk workflow
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Tambahkan dan kelola kredensial `telegram`
