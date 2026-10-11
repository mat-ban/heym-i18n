# Webhooks

Workflow dapat dipicu melalui webhook HTTP. Endpoint execute standar mengembalikan JSON, dan varian streaming mengembalikan Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Ganti `{workflow_id}` dengan UUID workflow. Base URL adalah instance Heym Anda (misalnya `https://app.heym.ai`).

## Request Method

Setiap workflow menerima satu HTTP verb, yang dipilih pada dialog cURL di editor: `GET`, `POST`, `PUT`, atau `DELETE`. **`POST` adalah default**, dan setiap workflow yang dibuat sebelum pengaturan ini ada akan tetap menggunakannya, sehingga tidak ada yang berubah dari yang sudah berjalan saat ini.

Memanggil workflow dengan verb yang berbeda akan mengembalikan `405 Method Not Allowed` dengan header `Allow` yang menyebutkan verb yang dikonfigurasi:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Satu pengecualian: permintaan yang membawa `?test_run=true` akan melewati pemeriksaan tersebut. Itulah yang dikirim oleh tombol **Run** di editor dan panel debug, sehingga workflow yang diatur ke `GET` tetap dapat diuji dari dalam produk.

### Bodyless methods

`GET` dan `DELETE` tidak membawa request body. Input berasal dari query string, dan dibaca dengan `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Dialog cURL menyembunyikan editor request-body dan menghapus header `Content-Type` untuk kedua method ini.

Pasangkan `GET` dengan [HTML output mapper](../nodes/html-output-mapper-node.md) untuk menyajikan halaman yang dapat dibuka langsung oleh browser.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Gunakan streaming endpoint ketika Anda menginginkan event eksekusi secara inkremental alih-alih satu respons JSON tunggal. Lihat [SSE Streaming](./sse-streaming.md) untuk protokol event dan konfigurasi pesan start per-Node.

## Request Format

Request body diteruskan sebagai `body` ke Node [Input](../nodes/input-node.md). Heym menerima kedua bentuk permintaan:

- **Raw JSON** – misalnya `{"userId": "123", "action": "create"}`
- **Wrapped format** – `{"inputs": {...}, "test_run": false}`

Saat menggunakan wrapped format, `inputs` diekstrak dan diteruskan sebagai `body`. `test_run` melewati rate limiting dan response caching. Anda juga dapat mengirim `?test_run=true` sebagai query parameter saat memposting raw JSON.

## Request Body Modes

Setiap workflow memiliki pengaturan `webhook_body_mode` yang mengontrol bagaimana editor membangun contoh permintaan:

| Mode | Perilaku |
|------|----------|
| **defined** | Editor dan dialog cURL membentuk contoh body dari field Node Input workflow dan mempertahankan key kosong pada payload JSON. Payload cURL bergaya defined yang sudah ada tetap berfungsi. |
| **generic** | Editor dan dialog cURL menggunakan body JSON bebas. Request body diteruskan apa adanya sehingga aplikasi eksternal dapat mengirim bentuk payload tetapnya sendiri. |

API eksekusi tetap kompatibel ke belakang pada kedua mode. Raw JSON dan permintaan wrapped `{ "inputs": ... }` tetap diterima pada keduanya.

Header dan query param tersedia dalam ekspresi sebagai `$input.headers` dan `$input.query`. Key header diubah menjadi huruf kecil.

## Authentication

Dikonfigurasi per workflow di editor (pengaturan workflow). Auth diperiksa sebelum eksekusi.

| auth_type | Perilaku |
|-----------|----------|
| **anonymous** | Tidak memerlukan auth. Siapa pun dapat memanggil endpoint. |
| **jwt** | Memerlukan Bearer token. Menerima token sesi pengguna (pengguna harus memiliki akses workflow) atau [Execution Token](./execution-tokens.md) terbatas yang dibuat untuk workflow ini. |
| **header_auth** | Header kustom harus cocok. Atur `auth_header_key` (misalnya `X-API-Key`) dan `auth_header_value`. |

Untuk `header_auth`, nilai header permintaan harus sama persis dengan nilai yang dikonfigurasi. Pengguna JWT dengan akses workflow juga dapat memanggil tanpa header kustom.

Untuk `jwt`, [Execution Tokens](./execution-tokens.md) adalah cara yang direkomendasikan untuk memanggil workflow dari sistem eksternal — token tersebut dibatasi pada satu workflow dan dapat dicabut secara independen.

## Response Caching

Konfigurasikan `cache_ttl_seconds` per workflow. Ketika diatur dan lebih besar dari 0:

- **Cache key**: Hash SHA256 dari `workflow_id` + `body` + `query`
- **Cache hit**: Mengembalikan segera dengan `status: "cached"` dan output yang di-cache
- **Cache set**: Hanya setelah eksekusi berhasil (`status: "success"`)
- **Storage**: Berbasis Postgres dan dibagikan antar backend worker

| Pengaturan | Efek |
|---------|--------|
| `cache_ttl_seconds` = 0 atau null | Caching dinonaktifkan |
| `cache_ttl_seconds` > 0 | Respons di-cache selama sekian detik |

Permintaan `test_run` melewati cache (tidak membaca, tidak menulis).

Ketika response caching diaktifkan pada dialog cURL, **Clear cache** akan menghapus respons yang di-cache dari workflow saat ini secara langsung.

## Rate Limiting

Konfigurasikan per workflow: `rate_limit_requests` dan `rate_limit_window_seconds`.

- **Scope**: Per `workflow_id` + IP klien (sliding window)
- **Terlampaui**: HTTP 429 dengan header `Retry-After`
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Pengaturan | Deskripsi |
|---------|-------------|
| `rate_limit_requests` | Jumlah maksimum permintaan yang diizinkan dalam window |
| `rate_limit_window_seconds` | Durasi window dalam detik |

Permintaan `test_run` melewati rate limiting.
## Format Respons

Endpoint mengembalikan JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Field | Deskripsi |
|-------|-----------|
| `workflow_id` | UUID Workflow |
| `status` | `success`, `error`, `cached`, atau `rate_limited` |
| `outputs` | Output Node terminal. Dengan satu [JSON output mapper](../nodes/json-output-mapper-node.md) sebagai satu-satunya terminal, body respons adalah objek yang dipetakan tersebut pada level teratas (respons JSON sederhana secara default). Jika tidak, mencakup [Output](../nodes/output-node.md) dan terminal lainnya yang dikunci berdasarkan label. |
| `execution_time_ms` | Waktu eksekusi dalam milidetik (0 untuk cached/rate_limited) |

Saat terjadi error, `outputs` dapat berisi detail error. Node [Throw Error](../nodes/throw-error-node.md) dapat menetapkan kode status HTTP kustom (4xx/5xx).

## Dialog Run with cURL

Tombol toolbar **Run with cURL** (di kanan atas editor, ikon `cURL`) membuka dialog yang membuat dan menyalin perintah cURL siap jalan untuk Workflow saat ini.

### Fungsinya

| Field | Deskripsi |
|-------|-----------|
| **Request Body Mode** | Pilih **Defined** atau **Generic**. Generic mempertahankan body sebagai JSON mentah alih-alih membentuknya dari field Input. |
| **Authentication** | Pilih Anonymous, JWT Token, atau Header Auth. Menetapkan header autentikasi yang benar pada perintah. Saat JWT Token dipilih, dialog menampilkan pengelola [Execution Token](./execution-tokens.md) — buat atau pilih Token untuk menyematkannya langsung ke dalam perintah. |
| **Header Key / Value** | Terlihat saat Header Auth dipilih. Terisi otomatis dari pengaturan autentikasi Workflow. |
| **Response Cache** | Menit untuk meng-cache respons identik (0 = nonaktif). Perubahan disimpan ke Workflow. Saat diaktifkan, **Clear cache** menghapus respons yang di-cache segera. |
| **Rate Limit** | Maksimum permintaan per jendela waktu. Perubahan disimpan ke Workflow. |
| **SSE Streaming** | Mengalihkan perintah ke `/execute/stream`, menambahkan `--no-buffer`, dan menampilkan pengaturan pesan `node_start` per Node. |
| **Body** | Body permintaan JSON. Dalam mode Defined, terisi otomatis dari field [Input](../nodes/input-node.md) dan mempertahankan key kosong. Dalam mode Generic, ini adalah editor JSON mentah. |
| **Command** | Pratinjau hanya-baca dari perintah cURL lengkap. |

Klik **Copy cURL** untuk menyalin perintah ke clipboard.

### Contoh

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Dalam mode Generic, Payload bersarang tetap utuh, misalnya:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialog mencerminkan pengaturan autentikasi, mode body, caching, dan rate-limit yang tersimpan pada Workflow — mengeditnya di sini akan memperbarui Workflow segera.

### SSE Streaming di Dialog

Aktifkan **SSE Streaming** saat Anda ingin perintah yang dihasilkan mengikuti eksekusi secara real time dari terminal Anda.

- Endpoint berubah dari `/execute` menjadi `/execute/stream`
- Perintah menambahkan `--no-buffer` dan `Accept: text/event-stream`
- Setiap Node non-sticky muncul dalam daftar di mana Anda dapat:
  - mengaktifkan atau menonaktifkan pesan `node_start`
  - menyesuaikan teks pesan start
- Event `node_complete` selalu dipancarkan dan mencakup output Node lengkap

Contoh:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Untuk protokol event lengkap dan contoh, lihat [SSE Streaming](./sse-streaming.md).

## Penandaan Trigger Source

Setiap eksekusi menyimpan label `trigger_source` yang terlihat di [Execution History](./execution-history.md). Tetapkan dengan mengirim header `X-Trigger-Source` dengan nilai apa pun yang Anda pilih:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Tombol **Copy cURL** di dialog editor menyertakan `X-Trigger-Source: API` secara otomatis. Anda dapat mengganti `API` dengan nilai apa pun yang bermakna — `scheduler`, `rabbitmq`, `github-actions`, dan sebagainya.

Jika header tidak dikirim, `trigger_source` default ke `"API"` dan eksekusi diberi label **API** di history. Ganti dengan nilai apa pun yang bermakna bagi sistem Anda — `scheduler`, `github-actions`, `rabbitmq`, dan sebagainya.

## Terkait

- [Execution Tokens](./execution-tokens.md) – JWT terbatas untuk memanggil Workflow dari sistem eksternal
- [SSE Streaming](./sse-streaming.md) – Streaming event Node secara real time melalui Server-Sent Events
- [Triggers](./triggers.md) – Semua titik masuk Workflow termasuk Webhook
- [Workflow Structure](./workflow-structure.md) – Node dan edge
- [Expression DSL](./expression-dsl.md) – Mengakses `$input.body`, `$input.headers`, `$input.query`
