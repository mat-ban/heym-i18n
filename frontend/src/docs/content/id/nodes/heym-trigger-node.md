# Heym Trigger

Node **Heym Trigger** memulai sebuah workflow ketika Heym sendiri mempublikasikan sebuah event platform. Node ini merupakan node trigger tanpa input untuk mengotomatisasi Heym dengan Heym: jejak audit perubahan, pengumuman deployment, dan ringkasan kesehatan instance.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credential | Tidak diperlukan |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `eventNames` | String array | Event mana yang akan disubscribe. Biarkan kosong untuk menerima semua event. |

## Event

| Event | Dipublikasikan ketika | Cakupan |
|-------|-----------------------|---------|
| `heym.started` | Platform Heym dimulai | Seluruh instance: setiap subscriber menerimanya |
| `workflow.created` | Sebuah workflow dibuat | Hanya subscriber milik pemilik workflow tersebut |
| `workflow.updated` | Sebuah workflow disimpan | Hanya subscriber milik pemilik workflow tersebut |
| `workflow.deleted` | Sebuah workflow dihapus | Hanya subscriber milik pemilik workflow tersebut |

Widget dashboard disimpan sebagai workflow secara internal, tetapi widget tersebut tidak pernah menghasilkan event `workflow.*`.

## Pengiriman Dilakukan Secara Batch

Heym mengirimkan event setiap lima detik. **Setiap event yang diklaim dalam satu proses pengiriman akan tiba dalam satu eksekusi workflow**, sebagai sebuah array.

- Membuat dua workflow dalam rentang lima detik satu sama lain → **satu** eksekusi dengan dua event.
- Membuat satu workflow → **satu** eksekusi dengan array berisi satu elemen.

Bentuknya tidak pernah berubah, sehingga ekspresi hilir tidak perlu bercabang berdasarkan apakah yang tiba hanya satu event atau banyak. Ketika Anda perlu melakukan tindakan sekali per event, letakkan node [Loop](./loop-node.md) di atas `$nodeLabel.events`.

## Pengiriman Exactly-Once

Setiap event diklaim per node yang melakukan subscribe melalui batasan database yang unik sebelum dikirimkan. Hal ini berlaku di setiap worker uvicorn, setiap container, dan setiap mesin: menjalankan Heym di dua server tidak akan mengirimkan sebuah event dua kali. Jika klaim tidak dapat dicatat, event tersebut tidak dikirimkan sama sekali — desainnya gagal secara tertutup (fail closed) alih-alih memicu dua kali.

Dua node `heymTrigger` yang berbeda yang melakukan subscribe ke event yang sama masing-masing menerimanya sekali; keduanya tidak bersaing untuk memperolehnya.

## Jendela Pengiriman

Dispatcher hanya mempertimbangkan event yang dipublikasikan dalam **lima menit terakhir**. Event yang lebih lama tetap tersimpan di log untuk diperiksa tetapi tidak pernah dikirimkan. Hal ini membatasi apa yang terjadi setelah downtime: menyalakan kembali Heym setelah satu jam offline tidak akan memutar ulang apa pun, alih-alih memicu tumpukan event selama satu jam sekaligus.

Event disimpan selama **7 hari** lalu dihapus.

## Field Output

| Ekspresi | Deskripsi |
|----------|-----------|
| `$nodeLabel.events` | Array objek event, dari yang paling lama. Selalu berupa array. |
| `$nodeLabel.events[0].id` | UUID event |
| `$nodeLabel.events[0].name` | Nama event, misalnya `workflow.created` |
| `$nodeLabel.events[0].payload` | Body event |
| `$nodeLabel.events[0].workflow_id` | Id workflow subjek, atau `null` untuk `heym.started` |
| `$nodeLabel.events[0].created_at` | Timestamp ISO untuk waktu event dipublikasikan |
| `$nodeLabel.count` | Jumlah event dalam batch ini |
| `$nodeLabel.triggered_at` | Timestamp ISO untuk eksekusi workflow |

### Bentuk payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` membawa nama yang ditangkap tepat sebelum penghapusan, karena baris workflow sudah tidak ada pada saat Anda membaca event tersebut.

## Contoh Workflow

**Jejak audit perubahan workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** dengan label `platformEvents`, disubscribe ke `workflow.created`, `workflow.updated`, `workflow.deleted`
- Node **Heym** dengan `getWorkflow` dan `heymWorkflowId` diatur ke `$platformEvents.events[0].workflow_id`
- Pesan **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Catatan

- `heym.started` dipicu **sekali per platform start**, bukan sekali per worker, meskipun Heym menjalankan delapan worker per container. Container yang menyala dengan selisih lebih dari lima menit masing-masing mempublikasikan satu event.
- Eksekusi yang dipicu dengan cara ini muncul di history dengan `trigger_source = "heym_event"`.
- Atur **Events** ke kosong daripada mencantumkan keempatnya jika Anda ingin secara otomatis menangkap tipe event yang ditambahkan pada versi mendatang.

## Terkait

- [Heym](./heym-node.md) – Membaca workflow dan riwayat eksekusi
- [Triggers](../reference/triggers.md) – Ikhtisar semua titik masuk workflow
- [Loop](./loop-node.md) – Melakukan tindakan sekali per event dalam sebuah batch
