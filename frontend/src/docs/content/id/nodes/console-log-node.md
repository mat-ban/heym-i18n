# Log Konsol

Node **Console Log** mencatat sebuah nilai ke konsol backend (server). Gunakan node ini untuk debugging dan inspeksi selama pengembangan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Meneruskan input |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `logMessage` | expression | Nilai yang akan dicatat. Mendukung [expressions](../reference/expression-dsl.md). |

## Contoh

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Output muncul di log server (misalnya output terminal saat menjalankan `uvicorn`).

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Logs Tab](../tabs/logs-tab.md) – Lihat log aplikasi
