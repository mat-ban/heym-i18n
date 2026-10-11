# Discord

Node **Discord** mengirim pesan ke channel Discord melalui Incoming Webhook. Gunakan node ini untuk alert, notifikasi workflow, balasan bergaya bot, dan pelaporan error.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial `discord` yang berisi URL incoming webhook |
| `message` | expression | Teks pesan keluar. Mendukung [expressions](../reference/expression-dsl.md). |
| `username` | expression | Nama tampilan opsional yang akan menggantikan nama untuk pesan ini |
| `avatarUrl` | expression | URL avatar opsional yang akan menggantikan avatar untuk pesan ini |

## Penyiapan

1. Buat [kredensial Discord Webhook](../reference/integrations.md#discord)
2. Tambahkan node **Discord** ke workflow Anda
3. Pilih kredensial
4. Atur `message` ke teks keluar atau template yang dibangun dari data upstream
5. Secara opsional, ganti `username` dan `avatarUrl` yang ditampilkan

## Contoh

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Field Output

| Expression | Deskripsi |
|------------|-------------|
| `$nodeLabel.status` | Kode status HTTP yang dikembalikan oleh Discord, biasanya `204` jika berhasil |
| `$nodeLabel.response` | Body respons mentah yang dikembalikan oleh webhook Discord |
| `$nodeLabel.message` | Teks pesan yang dikirim oleh Heym |
| `$nodeLabel.username` | Username yang dikirim bersama webhook, jika disediakan |
| `$nodeLabel.avatar_url` | URL avatar yang dikirim bersama webhook, jika disediakan |

## Pola Umum

- Gunakan bersama [Discord Trigger](./discord-trigger-node.md) ketika Anda ingin mengirim postingan channel tambahan di luar balasan interaksi
- Kirim pemberitahuan kegagalan dari [Error Handler](./error-handler-node.md)
- Posting ringkasan yang dihasilkan oleh [LLM](./llm-node.md) atau [Agent](./agent-node.md)

## Keamanan Egress

- URL webhook yang disimpan dalam kredensial harus menggunakan `http://` atau `https://` dan hanya mengarah ke alamat publik. Tujuan loopback, privat, link-local, multicast, dan cloud-metadata diblokir.
- Heym memvalidasi alamat yang telah di-resolve dan menyematkan target koneksi sebelum mengirim, sehingga jawaban DNS tidak dapat memindahkan permintaan ke alamat internal setelah pemeriksaan. Proxy lingkungan dinonaktifkan selama guard aktif, dan redirect tidak diikuti.
- Deployment yang mengirim ke penerima webhook internal dapat mengatur `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` pada instance self-hosted yang tepercaya. Biarkan pengaturan default pada deployment hosted atau multi-tenant.

**Catatan upgrade untuk v0.0.109:** pemeriksaan ini baru untuk Discord. Kredensial yang URL webhook-nya mengarah ke loopback atau alamat privat akan ditolak kecuali pengaturan di atas diaktifkan.

## Terkait

- [Discord Trigger](./discord-trigger-node.md) – Memulai workflow dari interaksi Discord yang masuk
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan dan mengelola kredensial `discord`
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
