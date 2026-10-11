# Kondisi

Node **Condition** mencabangkan workflow berdasarkan ekspresi if/else. Mengarahkan ke jalur true atau false tergantung pada hasilnya.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 2 (true, false) |
| Output | Meneruskan input ke cabang yang dipilih |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `condition` | expression | Ekspresi mirip JavaScript (misalnya `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – ketika condition bernilai truthy
- **Source handle `false`** – ketika condition bernilai falsy

## Operator Ekspresi

Mendukung: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, dll. Lihat [Expression DSL](../reference/expression-dsl.md).

## Contoh

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Hubungkan edge dengan `sourceHandle: "true"` atau `sourceHandle: "false"` untuk mengarahkan ke cabang yang berbeda.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Switch Node](./switch-node.md) – Perutean multi-arah berdasarkan nilai
- [Expression DSL](../reference/expression-dsl.md) – Sintaks condition
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend langsung untuk condition
