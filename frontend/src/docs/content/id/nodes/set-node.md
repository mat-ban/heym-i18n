# Tetapkan

Node **Set** mengubah dan memetakan data input menjadi output kustom. Gunakan untuk uppercase, substring, konkatenasi, angka acak, dan transformasi data apa pun—bukan untuk memanggil workflow (gunakan [Execute](./execute-node.md) untuk itu).

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.keyName` untuk setiap key pemetaan |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `mappings` | array | Pasangan key-value. Masing-masing: `{ key, value }` di mana `value` adalah [expression](../reference/expression-dsl.md) |

## Penggunaan tool Agent

Ketika node Set terhubung ke [Agent Node](./agent-node.md) sebagai tool node canvas, setiap nilai pemetaan dapat ditandai sebagai **agent-provided** dengan ikon bot. Nilai pemetaan yang ditandai menjadi parameter tool yang diisi oleh agent saat runtime. Pemetaan yang tidak ditandai tetap tetap dalam konfigurasi node.

Ikon bot hanya muncul ketika node Set terhubung ke handle tool agent. Node Set yang berdiri sendiri tidak menampilkan kontrol agent-provided.

## Aturan Expression

- Referensikan node sebelumnya: `$nodeName.text`, `$nodeName.body.field`
- Gunakan fungsi: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` mengecualikan b; memberikan error jika `a > b`.
- Hanya satu `$` di awal expression—tidak pernah di dalam tanda kurung
- Akses output berdasarkan key: `$setNode.randomNumber`, `$setNode.text`

## Contoh

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Node hilir mengakses melalui `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Terkait

- [JSON output mapper](./json-output-mapper-node.md) – Pemetaan yang sama; terminal tunggal mengembalikan root JSON untuk webhook/run
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Execute Node](./execute-node.md) – Memanggil workflow (bukan transformasi data)
- [Expression DSL](../reference/expression-dsl.md) – Fungsi dan sintaks
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend langsung dan Prev/Next untuk pemetaan
