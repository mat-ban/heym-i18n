# Penggabungan

Node **Merge** menunggu beberapa input paralel dan menggabungkannya menjadi satu output tunggal. Gunakan node ini ketika Anda perlu menggabungkan hasil dari cabang paralel sebelum melanjutkan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | n (dapat dikonfigurasi) |
| Output | 1 |
| Output | `$nodeLabel.merged` – objek dengan input dari setiap cabang |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `inputCount` | number | Jumlah input yang ditunggu (default: 2) |

## Kapan Menggunakan

- Gunakan ketika Anda perlu **menggabungkan** atau **menyatukan** hasil dari cabang paralel
- **Jangan** gunakan untuk Workflow paralel yang berakhir dengan node [Output](./output-node.md) terpisah
- Setiap cabang input berkontribusi pada output yang digabungkan

## Contoh

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Hubungkan beberapa cabang ke node merge. Node menunggu semua input sebelum menghasilkan output.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Parallel Execution](../reference/parallel-execution.md) – Cara cabang paralel berjalan
- [Workflow Structure](../reference/workflow-structure.md) – Edge dan handle
