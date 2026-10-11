# OpenTelemetry Tracing

Heym dapat memancarkan [OpenTelemetry](https://opentelemetry.io/) trace untuk setiap workflow run, eksekusi Node, dan pemanggilan tool Agent. Setiap run menghasilkan root span dengan child span per Node dan tool Agent, sehingga Anda dapat melihat langkah mana yang gagal, berapa lama prosesnya, apa yang dipanggil, dan apa yang dikembalikan. Span diekspor melalui OTLP/HTTP ke backend kompatibel mana pun seperti Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic, atau Grafana Cloud.

Tracing **dinonaktifkan secara default**. Saat dinonaktifkan, tidak ada overhead yang terukur dan tidak ada span yang dibuat.

## Mengaktifkan Tracing

Tetapkan variabel lingkungan berikut pada backend, lalu mulai ulang backend:

Untuk daftar lengkap variabel lingkungan, lihat [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabel | Default | Deskripsi |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Sakelar utama. Tetapkan ke `true` untuk mengaktifkan tracing. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint dasar OTLP/HTTP, misalnya `http://collector:4318`. Heym mengirim span ke `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Header `key=value` yang dipisahkan koma untuk autentikasi exporter, misalnya `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atribut resource `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Rasio head sampling antara `0.0` dan `1.0`, diterapkan dengan sampler berbasis parent. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Saat `true`, lampirkan payload input dan output Node yang terpotong ke span Node. Nonaktif secara default untuk privasi. |

Contoh minimal:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Anda dapat mengonfirmasi konfigurasi aktif di aplikasi melalui **Settings → Observability** (buka dari avatar Anda di header). Panel tersebut bersifat read-only dan tidak pernah menampilkan secret exporter.

## Apa yang Di-trace

### Workflow root span

Nama: `heym.workflow.execute`

| Atribut | Deskripsi |
|-----------|-------------|
| `heym.workflow.id` | UUID workflow. |
| `heym.node.count` | Jumlah Node dalam workflow. |
| `heym.workflow.test_mode` | `true` untuk test run. |
| `heym.sub_workflow.depth` | Kedalaman nesting saat dipanggil sebagai sub-workflow. |
| `heym.workflow.status` | Status akhir run. Run yang gagal menetapkan status span ke `ERROR`. |

### Node span

Nama: `heym.node.execute`, dibuat sebagai child dari workflow span.

| Atribut | Deskripsi |
|-----------|-------------|
| `heym.node.id` | ID Node. |
| `heym.node.type` | Tipe Node, misalnya `agent`, `llm`, `http`. |
| `heym.node.label` | Label Node yang ditampilkan pada canvas. |
| `heym.node.status` | `success` atau `error`. Error menetapkan status span ke `ERROR`. |
| `heym.node.duration_ms` | Waktu eksekusi Node dalam milidetik. |
| `heym.llm.model` | Nama model untuk Node LLM dan agent, jika tersedia. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Penggunaan Token untuk Node LLM dan agent, jika tersedia. |

Node span bersarang dengan benar di bawah workflow span bahkan ketika Node berjalan secara paralel, karena konteks workflow dipropagasikan ke worker thread.

### Agent tool span

Nama: `heym.agent.tool.execute`, dibuat di bawah span Node Agent yang aktif.

| Atribut | Deskripsi |
|-----------|-------------|
| `heym.agent.tool.name` | Nama tool yang dipilih oleh model. |
| `heym.agent.tool.call_id` | ID tool-call dari provider, jika tersedia. |
| `heym.agent.tool.source` | Sumber tool seperti `node_tool`, `mcp`, `skill`, atau `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Label MCP server, jika berlaku. |
| `heym.agent.tool.iteration` | Iterasi tool-loop Agent. |
| `heym.agent.tool.args_bytes` | Ukuran UTF-8 dari argumen tool yang diserialisasi. |
| `heym.agent.tool.result_bytes` | Ukuran UTF-8 dari hasil tool yang diserialisasi. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout`, atau `cancelled`. Error tool menetapkan status span ke `ERROR`. |

Argumen dan hasil tool mentah tidak dilampirkan ke span secara default.

## Keamanan payload tool Agent

Payload observability Agent yang dipersistenkan diredaksi dan dipotong di dalam kode (`4096` karakter per string, kedalaman `6`, `32768` total karakter per penulisan LLM trace). Anggaran trace total dibagi ke seluruh record tool sehingga hasil besar yang muncul lebih awal tidak dapat menyembunyikan identitas dan status siklus hidup pemanggilan berikutnya. Metadata unduhan `_generated_files` yang dibatasi dicadangkan secara terpisah dari output skill yang besar:

- Bagian tool `request` / `response` pada LLM trace, termasuk salinan `_hitl_pending` yang ditulis ke trace store
- Record `tool_calls` hasil Agent yang ditampilkan di execution history
- Event hasil tool pada panel Live Debug, yang menggunakan kembali record tersanitasi terbatas yang sama

Eksekusi tool secara live, pesan tool yang terikat model, dan state HITL resume di memori (`_hitl_pending.agent_state.messages` / `tool_arguments`) mempertahankan nilai asli sehingga resume dan pencocokan argumen yang tepat tetap berfungsi. Hanya salinan observability yang disimpan yang disanitasi.
## Propagasi Trace Context

Heym mengikuti standar [W3C Trace Context](https://www.w3.org/TR/trace-context/) agar trace tetap terhubung lintas batas layanan.

- **Webhook masuk:** ketika permintaan yang masuk membawa header `traceparent`, eksekusi Workflow dicatat sebagai child dari trace tersebut. Hal ini menghubungkan eksekusi Heym dengan sistem hulu yang memicunya.
- **HTTP keluar:** Node HTTP menyuntikkan `traceparent` ke dalam permintaan yang dibuatnya, sehingga layanan hilir dapat melanjutkan trace yang sama.
- **Sub-workflow:** eksekusi sub-workflow menjadi child dari Node yang memanggilnya, sehingga hierarki pemanggilan tetap terjaga dalam satu trace.

Trigger tanpa konteks masuk (seperti Cron, IMAP, RabbitMQ, dan WebSocket) memulai trace baru untuk setiap eksekusi.

## Keandalan

- Collector yang lambat atau tidak dapat dijangkau tidak akan pernah menghambat eksekusi Workflow. Span dikumpulkan dalam batch dan diekspor di latar belakang.
- Jika tracing gagal diinisialisasi (misalnya, Endpoint yang salah), backend mencatat error dan melanjutkan dengan tracing dinonaktifkan alih-alih gagal untuk memulai.
- Header autentikasi OTLP hanya dibaca dari environment. Header tersebut tidak pernah disimpan di database dan tidak pernah dikembalikan oleh API status.

## Terkait

- [Settings](./user-settings.md) – Tab Observability yang menampilkan status tracing
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referensi konfigurasi lengkap
- [Triggers](./triggers.md) – Cara Workflow dimulai, termasuk Webhook
- [Execution History](./execution-history.md) – Tampilan riwayat per-eksekusi bawaan Heym
- [HTTP](../nodes/http-node.md) – Node yang mempropagasikan trace context ke panggilan hilir
