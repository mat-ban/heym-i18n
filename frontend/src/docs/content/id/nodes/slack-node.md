# Slack

Node **Slack** mengirim pesan ke channel Slack melalui Incoming Webhook. Gunakan node ini untuk notifikasi, peringatan, dan pelaporan kesalahan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Meneruskan input |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial Slack (URL webhook) dari [Credentials](../tabs/credentials-tab.md) |
| `message` | expression | Teks pesan. Mendukung [expressions](../reference/expression-dsl.md). |

## Penyiapan

1. Buat Incoming Webhook di workspace Slack Anda
2. Tambahkan kredensial Slack di tab Credentials dengan URL webhook
3. Referensikan kredensial tersebut di node

## Contoh

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Gunakan bersama [Error Handler](./error-handler-node.md) untuk notifikasi kegagalan:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Keamanan Egress

- URL webhook yang disimpan dalam kredensial harus menggunakan `http://` atau `https://` dan hanya mengarah ke alamat publik. Tujuan loopback, privat, link-local, multicast, dan cloud-metadata diblokir.
- Heym memvalidasi alamat yang telah di-resolve dan menyematkan target koneksi sebelum mengirim, sehingga jawaban DNS tidak dapat memindahkan permintaan ke alamat internal setelah pemeriksaan. Proxy lingkungan dinonaktifkan selama guard aktif, dan redirect tidak diikuti.
- Deployment yang mengirim ke penerima webhook internal dapat menetapkan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` pada instance self-hosted yang tepercaya. Pertahankan nilai default pada deployment hosted atau multi-tenant.

**Catatan peningkatan untuk v0.0.109:** pemeriksaan ini baru untuk Slack. Kredensial yang URL webhook-nya mengarah ke loopback atau alamat privat akan ditolak kecuali pengaturan di atas diaktifkan.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Error Handler](./error-handler-node.md) – Kirim Slack saat workflow gagal
- [Credentials Tab](../tabs/credentials-tab.md) – Tambahkan webhook Slack
