# Penangan Kesalahan

Node **Error Handler** menangkap error dari node mana pun dalam workflow. Saat node ini ada, node ini berjalan secara otomatis ketika ada node yang gagal. Tidak diperlukan koneksi masuk—node ini dipicu oleh workflow engine.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 (dipicu saat error) |
| Output | 1 |
| Output | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `message` | expression | Opsional. Default: `$error.message` |

## Konteks Error

Saat error handler berjalan, field-field berikut tersedia:

| Field | Deskripsi |
|-------|-------------|
| `$errorHandler.error` | String pesan error |
| `$errorHandler.errorNode` | Label dari node yang gagal |
| `$errorHandler.errorNodeType` | Tipe dari node yang gagal |
| `$errorHandler.timestamp` | Waktu terjadinya error |

## Kasus Penggunaan

- Kirim notifikasi [Telegram](./telegram-node.md), [Slack](./slack-node.md), atau [Send Email](./send-email-node.md) saat terjadi kegagalan
- Catat error ke sistem eksternal
- Kembalikan respons error kustom melalui [Output](./output-node.md)

Hanya satu Error Handler per workflow.

## Contoh

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Hubungkan ke Output untuk respons error kustom:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Atau hubungkan ke Slack untuk notifikasi:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Telegram Node](./telegram-node.md) – Notifikasi saat error
- [Slack Node](./slack-node.md) – Notifikasi saat error
- [Send Email Node](./send-email-node.md) – Peringatan email
- [Throw Error Node](./throw-error-node.md) – Error yang disengaja
