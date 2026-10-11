# Cron

Node **Cron** memicu workflow sesuai jadwal menggunakan ekspresi cron. Tidak diperlukan input dari pengguna—workflow berjalan secara otomatis pada waktu yang ditentukan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | Peristiwa trigger (tanpa payload) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `cronExpression` | string | Ekspresi cron (misalnya `0 * * * *` untuk setiap jam) |

## Format Ekspresi Cron

Cron standar 5-field: `minute hour day-of-month month day-of-week`

| Field | Nilai | Contoh |
|-------|--------|---------|
| Minute | 0–59 | `0` = pada menit 0 |
| Hour | 0–23 | `*` = setiap jam |
| Day of month | 1–31 | `*` = setiap hari |
| Month | 1–12 | `*` = setiap bulan |
| Day of week | 0–7 (0 dan 7 = Minggu) | `*` = setiap hari |

**Contoh umum:**

- `0 * * * *` – setiap jam
- `0 0 * * *` – setiap hari pada tengah malam
- `*/15 * * * *` – setiap 15 menit
- `0 9 * * 1-5` – hari kerja pada pukul 9:00

## Contoh

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Hentikan trigger cron setelah suatu kondisi
- [Enable Node](./enable-node.md) – Mulai kembali trigger cron yang dinonaktifkan
