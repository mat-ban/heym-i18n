# Tunggu

Node **Wait** menjeda eksekusi workflow selama durasi yang ditentukan. Gunakan node ini untuk pembatasan laju (rate limiting), tindakan tertunda, atau interval polling.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Meneruskan input |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `duration` | number | Penundaan dalam milidetik (mis. 1000 = 1 detik). Editor menerima 1 hingga 900000 (15 menit) |

## Contoh

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Loop Node](./loop-node.md) – Gunakan Wait di dalam loop untuk pembatasan laju
