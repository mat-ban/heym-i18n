# Output

Node **Output** adalah endpoint workflow yang mengembalikan respons kepada pemanggil. Selalu rujuk node sebelumnya berdasarkan label—jangan pernah gunakan `$input`.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 (opsional, untuk pasca-pemrosesan asinkron) |
| Output | Mengembalikan `message` kepada pemanggil |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `message` | expression | Nilai output. **Harus** merujuk node sebelumnya: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Jika true, node setelah output berjalan secara asinkron setelah respons dikirim |

## Penggunaan agent tool

Ketika node Output terhubung ke [Agent Node](./agent-node.md) sebagai canvas node tool, field `message` dapat ditandai sebagai **agent-provided** dengan ikon bot. Agent kemudian menyediakan message saat memanggil tool tersebut. Jika node Output tidak terhubung sebagai agent tool, ikon bot disembunyikan.

## Aturan Kritis

**Jangan pernah gunakan `$input` pada node output.** Selalu gunakan label node sebelumnya:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (di mana `processData` adalah label node sebelumnya)

## Pasca-Pemrosesan Asinkron

Ketika `allowDownstream: true`, respons dikembalikan segera. Node yang terhubung setelah output berjalan di latar belakang (misalnya notifikasi Slack, logging). Karena bagian hilir (downstream) mungkin selesai lebih lambat, kegagalan downstream dapat mengubah status run yang tercatat menjadi `error` setelah respons awal telah dikembalikan; riwayat dan analitik akhir mencerminkan hasil akhir tersebut.

## Contoh

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Contoh – Dengan Asinkron

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Kemudian hubungkan [Telegram](./telegram-node.md), [Slack](./slack-node.md), atau node lain setelah output untuk notifikasi fire-and-forget.

## Terkait

- [JSON output mapper](./json-output-mapper-node.md) – Root JSON body tanpa pembungkusan `result` ketika menjadi terminal tunggal
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Expression DSL](../reference/expression-dsl.md) – Merujuk output node
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend langsung untuk message
- [Workflow Structure](../reference/workflow-structure.md) – Format JSON
