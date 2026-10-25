# SSE Streaming

Workflow dapat melakukan streaming event eksekusi secara real time dengan Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Endpoint ini menggunakan autentikasi tingkat workflow, pembatasan laju (rate limiting), dan aturan caching respons yang sama dengan endpoint execute standar yang didokumentasikan di [Webhooks](./webhooks.md).

## Mengaktifkan SSE di Dialog cURL

Buka dialog **Run with cURL** di editor dan aktifkan **SSE Streaming**.

Saat diaktifkan, Heym:

- mengalihkan perintah yang dihasilkan dari `/execute` menjadi `/execute/stream`
- menambahkan `--no-buffer` agar event yang di-stream langsung muncul di output terminal
- menambahkan `Accept: text/event-stream`
- memungkinkan Anda mengonfigurasi pesan `node_start` per node langsung di dialog

## Protokol Event

Setiap frame SSE berupa JSON yang dipisahkan baris baru dengan awalan `data: `.

| Jenis event | Kapan dipancarkan | Field utama |
|------------|--------------------|------------|
| `queued` | Workflow berada pada [batas konkurensi](./webhooks.md#concurrency-limit-and-queued-runs); dikirim lagi setiap kali posisi run berubah | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Segera setelah permintaan diterima, atau ketika run yang diantrekan dimulai | `execution_id`, `server_now_ms` |
| `node_start` | Tepat sebelum node mulai dieksekusi | `node_id`, `node_label`, `started_at_ms`, opsional `message` |
| `node_retry` | Saat node melakukan percobaan ulang | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Setelah node selesai | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Saat node Output mengembalikan hasil lebih awal | `node_label`, `output` |
| `execution_complete` | Setelah workflow berakhir | `status`, `outputs`, `execution_time_ms` |

### Run yang diantrekan

Ketika workflow berada pada batas konkurensinya, stream tetap terbuka dan mengirim event `queued` saat run menunggu. Run yang diantrekan dijalankan di background worker, kemungkinan di proses lain, sehingga stream-nya membawa `execution_started` saat run dimulai dan `execution_complete` saat berakhir, tetapi tanpa event `node_start`, `node_complete`, atau token di antaranya. `execution_complete`-nya memiliki `node_results` kosong; buka run di [Riwayat Eksekusi](./execution-history.md) untuk detail node. Menutup koneksi tidak membatalkan run yang sedang diantrekan. Ketika antrean penuh, permintaan dijawab dengan `429` sebelum stream dibuka.

## Pesan Start per Node

Dialog cURL menyimpan pengaturan SSE pada workflow itu sendiri:

- **Send start** mengontrol apakah event `node_start` menyertakan `message`
- **Start message** secara default bernilai `[START] {nodeLabel}`
- menghapus pesan kustom akan kembali ke teks default
- `node_complete` selalu dipancarkan dan selalu menyertakan output node

Contoh konfigurasi yang tersimpan:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Contoh cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Contoh event stream:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Catatan Keamanan

- Workflow `anonymous`, `jwt`, dan `header_auth` berperilaku sama seperti endpoint webhook biasa
- caching respons tetap berlaku saat `cache_ttl_seconds` dikonfigurasi
- pembatasan laju workflow tetap berlaku saat `rate_limit_requests` dan `rate_limit_window_seconds` dikonfigurasi
- `test_run` melewati cache dan pembatasan laju, sama seperti perilakunya untuk `/execute`

## Terkait

- [Webhooks](./webhooks.md) – Endpoint execute standar dan dialog cURL
- [Parallel Execution](./parallel-execution.md) – Bagaimana streaming terintegrasi dengan penjadwal DAG Heym
- [Canvas Features](./canvas-features.md) – Kontrol editor termasuk Run with cURL
- [Security](./security.md) – Autentikasi dan penanganan secret
