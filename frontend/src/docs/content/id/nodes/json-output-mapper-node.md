# Pemeta Output JSON

Node **Pemeta keluaran JSON** membangun objek JSON dari [pemetaan](./set-node.md) key/value (model yang sama dengan [Set](./set-node.md)). Gunakan node ini ketika pemanggil harus menerima **body JSON biasa** pada root respons.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 0 (sink) |
| Keluaran runtime | Objek yang dibangun dari `mappings` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `mappings` | array | Entri `{ "key": "fieldName", "value": "expression" }` (sama seperti Set) |

## Penggunaan sebagai alat Agent

Tidak didukung. Node ini merupakan sink terminal, sehingga tidak dapat dilampirkan ke handle tools [Agent Node](./agent-node.md). Gunakan node [Set](./set-node.md) ketika agen perlu membentuk nilai di tengah percakapan.

## Perilaku Webhook dan eksekusi

Ketika node ini merupakan **satu-satunya** keluaran terminal dari workflow, **output** eksekusi adalah objek yang dipetakan itu sendiri: key dari `mappings` muncul pada **level teratas** JSON. **Tidak ada** pembungkus luar yang di-key berdasarkan label node dan **tidak ada** objek `{ "result": ... }` (berbeda dengan node [Output](./output-node.md)).

Jika beberapa node terminal menghasilkan output (misalnya [Output](./output-node.md) ditambah Pemeta keluaran JSON, atau beberapa cabang), Heym menggunakan bentuk normal: setiap terminal di-key berdasarkan `label`-nya.

## Batasan Loop

Aturan yang sama dengan [Output](./output-node.md): jangan menempatkan node ini di dalam cabang iterasi loop—hanya setelah cabang `done` loop. Lihat [Loop](./loop-node.md).

## Contoh

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Terkait

- [Set](./set-node.md) – Mekanisme pemetaan yang sama untuk transformasi perantara
- [Output](./output-node.md) – Respons berbasis pesan atau skema dengan pembungkus `result`
- [Node Types](../reference/node-types.md) – Semua tipe node
- [Workflow Structure](../reference/workflow-structure.md) – Format workflow JSON
- [Webhooks](../reference/webhooks.md) – Endpoint eksekusi dan respons
