# Nonaktifkan Node

Node **Disable Node** menonaktifkan node lain di dalam workflow secara permanen. Saat dieksekusi, node ini menetapkan `active` pada node target menjadi `false` dan menyimpan perubahan tersebut. Gunakan node ini untuk operasi satu kali seperti menghentikan trigger cron setelah suatu kondisi terpenuhi.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `targetNodeLabel` | string | Label node yang akan dinonaktifkan (misalnya `hourlyCheck`) |

## Kasus Penggunaan

Nonaktifkan trigger [Cron](./cron-node.md) setelah suatu kondisi terpenuhi agar tidak lagi berjalan pada eksekusi workflow berikutnya. Aktifkan kembali nanti dengan [Enable Node](./enable-node.md).

## Contoh

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Alur: Cron → HTTP check → Condition (status complete?) → jika true: Disable Node (target: cron) → Output.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Enable Node](./enable-node.md) – Mengaktifkan kembali node yang dinonaktifkan
- [Cron Node](./cron-node.md) – Trigger yang akan dinonaktifkan
- [Condition Node](./condition-node.md) – Percabangan sebelum menonaktifkan
