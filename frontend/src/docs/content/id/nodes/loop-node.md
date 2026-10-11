# Loop

Node **Loop** melakukan iterasi pada sebuah array, menjalankan node-node hilir untuk setiap item. Memerlukan koneksi balik (back-connection) dari node terakhir di dalam badan iterasi untuk melanjutkan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 2 (default + loop back) |
| Output | 2 (loop, done) |
| Output | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `label` | string | Pengenal node (camelCase) |
| `arrayExpression` | expression | Ekspresi yang menghasilkan sebuah array (misalnya `$input.items`) |

## Edge Handle

- **Source `loop`** – Menghubungkan ke node yang memproses setiap item (berjalan per iterasi)
- **Source `done`** – Menghubungkan ke node yang berjalan setelah semua iterasi selesai
- **Target default** – Menerima data awal yang berisi array
- **Target `loop`** – Menerima koneksi balik dari node terakhir di badan iterasi

## Konteks Loop (di dalam badan iterasi)

- `$loopNode.item` – Item saat ini
- `$loopNode.index` – Indeks berbasis 0
- `$loopNode.total` – Total item
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Aturan Penting

1. **Koneksi balik wajib:** Node terakhir di badan iterasi HARUS terhubung kembali ke handle input `loop` pada node loop.
2. **Tidak ada output di badan loop:** Node [Output](./output-node.md) dilarang berada di dalam badan loop. Gunakan [Set](./set-node.md) atau [Variable](./variable-node.md) untuk hasil antara.
3. **Tidak ada pengumpulan hasil otomatis:** Loop tidak mengumpulkan hasil. Gunakan node Variable dengan `$array()` dan `.add()` untuk mengakumulasi.

## Contoh

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Alur: loop → process node → (kembali ke loop) → loop → cabang done → output.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Variable Node](./variable-node.md) – Mengumpulkan item di dalam loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metode array
