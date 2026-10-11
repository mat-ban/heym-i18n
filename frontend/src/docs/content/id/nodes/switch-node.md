# Switch

Node **Switch** mengarahkan eksekusi ke jalur yang berbeda berdasarkan pencocokan nilai terhadap case. Mendukung N case ditambah default.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | n (satu per case + default) |
| Output | Meneruskan input ke cabang yang cocok |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `expression` | expression | Nilai yang akan dievaluasi (misalnya `$input.category`) |
| `cases` | string[] | Nilai case yang akan dicocokkan (misalnya `["case1", "case2", "case3"]`) |

## Edge Handle

- Setiap case mendapatkan source handle (indeks 0, 1, 2, …)
- Handle default untuk nilai yang tidak cocok

## Contoh

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Hubungkan edge dengan `sourceHandle` yang diatur ke indeks case (0, 1, 2) atau handle default untuk nilai yang tidak cocok.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Condition Node](./condition-node.md) – Percabangan If/else
- [Expression DSL](../reference/expression-dsl.md) – Sintaks ekspresi
