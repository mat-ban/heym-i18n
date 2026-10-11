# Telegram

Node **Telegram** mengirim pesan melalui Telegram Bot API. Gunakan node ini untuk balasan chat, peringatan operasional, pembaruan status workflow, atau langkah hilir apa pun yang harus mengirim pesan ke pengguna, grup, atau kanal Telegram.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial `telegram` yang berisi token bot |
| `chatId` | expression | ID chat, grup, atau kanal tujuan |
| `message` | expression | Teks pesan keluar. Mendukung [expressions](../reference/expression-dsl.md). |

## Penyiapan

1. Buat [kredensial Telegram Bot](../reference/integrations.md#telegram)
2. Tambahkan node **Telegram** ke workflow Anda
3. Pilih kredensial
4. Tetapkan `chatId` ke ID chat statis atau expression seperti `$telegramEvent.message.chat.id`
5. Tetapkan `message` ke teks keluar atau template yang dibangun dari data hulu

## Contoh

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Field Output

| Expression | Deskripsi |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` jika berhasil |
| `$nodeLabel.ok` | Flag keberhasilan Telegram API |
| `$nodeLabel.result` | Objek hasil `sendMessage` mentah dari Telegram |
| `$nodeLabel.result.message_id` | ID pesan Telegram |
| `$nodeLabel.result.chat.id` | ID chat tujuan yang dikembalikan oleh Telegram |

## Pola Umum

- Pasangkan dengan [Telegram Trigger](./telegram-trigger-node.md) untuk bot percakapan
- Kirim pemberitahuan kesalahan dari [Error Handler](./error-handler-node.md)
- Posting ringkasan yang dihasilkan oleh [LLM](./llm-node.md) atau [Agent](./agent-node.md)

## Terkait

- [Telegram Trigger](./telegram-trigger-node.md) – Memulai workflow dari pesan bot yang masuk
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan dan mengelola kredensial `telegram`
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
