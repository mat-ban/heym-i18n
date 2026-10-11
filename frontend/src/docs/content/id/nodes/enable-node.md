# Aktifkan Node

Node **Enable Node** mengaktifkan kembali node lain. Saat dieksekusi, node ini menetapkan `active` milik node target menjadi `true` dan menyimpan perubahan tersebut secara persisten. Node ini merupakan pasangan dari [Disable Node](./disable-node.md): gunakan untuk mengaktifkan kembali [Cron](./cron-node.md) trigger atau node apa pun yang sebelumnya dimatikan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `targetNodeLabel` | string | Label node yang akan diaktifkan (misalnya `hourlyCheck`) |

## Perilaku

- Target disimpan sebagai aktif, sehingga eksekusi dan trigger berikutnya akan melihatnya. Cron trigger yang diaktifkan kembali akan berjalan lagi pada waktu terjadwal berikutnya.
- Jika target berada di hilir Enable Node dan belum berjalan, target juga akan berjalan pada eksekusi saat ini.
- Mengaktifkan node yang sudah aktif tidak mengubah apa pun; output tetap melaporkan `enabled: true`.
- Node gagal dengan error ketika `targetNodeLabel` kosong atau tidak ada node dengan label tersebut.

## Kasus Penggunaan

Mulai [Cron](./cron-node.md) trigger sesuai permintaan. Simpan node Cron dalam keadaan dimatikan, dan berikan workflow titik masuk kedua seperti [Input](./input-node.md) trigger. Permintaan ke titik masuk tersebut menjalankan Enable Node, dan Cron mulai berjalan.

Trigger yang dimatikan tidak akan pernah memulai eksekusi dengan sendirinya, sehingga Enable Node harus berada di belakang titik masuk yang dapat berjalan.

## Contoh

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Alur: Input → Enable Node (target: cron) → Output. Node Cron `hourlyCheck` disimpan dalam keadaan nonaktif pada workflow yang sama dan menjalankan cabang pemeriksaan HTTP-nya sendiri setelah diaktifkan.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Disable Node](./disable-node.md) – Mematikan node dari dalam workflow
- [Cron Node](./cron-node.md) – Trigger yang akan diaktifkan
- [Condition Node](./condition-node.md) – Percabangan sebelum mengaktifkan
- [Canvas Features](../reference/canvas-features.md) – Mengaktifkan atau menonaktifkan node secara manual
