# Tab Traces

Tab **Traces** menampilkan jejak eksekusi LLM. Periksa payload request/response, timing, pemanggilan tool, dan debug perilaku Node [Agent](../nodes/agent-node.md) serta [LLM](../reference/node-types.md), beserta metrik agregat (calls, tokens, biaya, latensi, tingkat error) pada rentang waktu mana pun.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Tonton demo Traces</a></p>

## Header Statistik

Halaman dibuka dengan ringkasan statistik di atas daftar trace, yang dihitung berdasarkan rentang waktu yang dipilih dan filter aktif lainnya:

- **Kartu KPI** – Total Calls, Total Tokens, Total Cost (USD), Avg Latency, Error %
- **Tokens by Model** – Diagram donat volume token per model
- **Cost by Model** – Diagram donat pengeluaran USD per model. Model tanpa harga menampilkan tautan "Configure pricing" ke [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **Calls Over Time** – Diagram area bertumpuk untuk calls berhasil vs gagal per bucket (5 menit / 1 jam / 6 jam / 1 hari, dipilih otomatis sesuai rentang)
- **Pemberitahuan model tanpa harga** – Muncul di bawah diagram ketika beberapa model yang dilacak tidak memiliki baris harga, dengan tautan ke LLM Cost Table

## Rentang Waktu

Satu pemilih **Time range** di bagian atas bilah filter mengendalikan header statistik dan daftar trace sekaligus. Pilihan: Last 1 hour, Last 24 hours, Last 7 days (default), Last 30 days, All time. Mengubah rentang akan mengatur ulang paginasi dan memuat ulang diagram serta daftar secara bersamaan.

## Daftar Trace

- Daftar trace terbaru yang dipaginasi dalam rentang waktu yang dipilih
- Setiap trace menampilkan: workflow, node, credential, timestamp, durasi
- Klik trace untuk membuka tampilan detail
- Gunakan **Prev / Next** di dalam dialog detail untuk berpindah antar trace tanpa menutupnya

## Pemfilteran

- **Time range** – 1h / 24h / 7d / 30d / All; memfilter diagram dan daftar sekaligus
- **Credential** – Filter berdasarkan credential (API key) yang digunakan
- **Source** – Filter berdasarkan workflow atau sumber eksekusi
- **Search** – Cari berdasarkan model, workflow, credential, atau label node
- **Refresh** – Muat ulang halaman trace saat ini

## Detail Trace

Saat Anda membuka trace:

- **Steps** – Timeline dari atas ke bawah yang membaca trace sebagai rantai terurut: System → User → Assistant → Tool → Answer. Setiap langkah dapat dilipat; memperluas salah satunya menampilkan detail yang mudah dibaca (teks pesan, atau argumen dan hasil tool) diikuti JSON langkah tersebut. Konten JSON pada setiap tipe event—termasuk panggilan MCP dan payload JSON-RPC—terbuka dalam pohon yang dapat diperluas secara default, dengan level pertama sudah diperluas. Gunakan **Tree / Raw** untuk beralih antara struktur terformat dan teks asli. JSON yang tidak valid tetap terlihat sebagai teks biasa. Langkah tool menampilkan durasinya dan badge MCP/Skill jika berlaku, beserta badge pending / timeout / cancelled ketika status tool-call ditetapkan. Langkah Answer dapat menampilkan badge `tool_metrics` agregat (jumlah panggilan berdasarkan status dan total durasi tool). Ketika sebuah trace mencatat setiap panggilan model, seperti yang dilakukan oleh pesan Dashboard Chat dan agent yang dirutekan, langkah **LLM** berada sebelum tool yang diminta panggilan tersebut, dan **Duration Breakdown** menampilkan setiap panggilan model, tool, dan keputusan routing pada satu timeline. Sebuah pesan Dashboard Chat adalah satu trace, berapa pun putaran tool yang diperlukan. Trace tanpa rantai pesan (misalnya pembuatan gambar) menampilkan timeline minimal Request → Response.
- **Request** – Payload request lengkap yang dikirim ke LLM, dengan tampilan JSON **Tree / Raw**
- **Response** – Respons model, termasuk tool calls jika ada, dengan tampilan JSON **Tree / Raw**
- **Tool metrics** – Jika ada pada respons, ringkasan ringkas jumlah tool call (`success` / `error` / `pending` / `timeout` / `cancelled`) dan total durasi tool
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` untuk analisis performa
- **Tool calls** – Nama tool, argumen, hasil, status, dan waktu yang dibutuhkan
- **Skills included** – Skills yang diteruskan ke model dalam request
- **Go to Workflow** – Lompat langsung ke workflow terkait dari dialog detail trace

## Salin dan Ekspor

- Salin JSON request atau response ke clipboard; penyalinan selalu menggunakan payload mentah lengkap terlepas dari tampilan yang aktif
- Gunakan untuk debugging atau berbagi dengan tim support

## Pemeliharaan

- **Clear All** – Hapus semua trace yang tersimpan setelah konfirmasi
- Kontrol paginasi menampilkan rentang yang terlihat saat ini (misalnya `1-25 of 240`)

## Terkait

- [Why Heym](../getting-started/why-heym.md) – Observabilitas LLM di seluruh siklus hidup agent
- [Agent Node](../nodes/agent-node.md) – Node Agent dengan tool calling
- [Node Types](../reference/node-types.md) – Node LLM dan Agent
- [Credentials Tab](./credentials-tab.md) – Credential yang digunakan dalam trace
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Ekspor OTel opsional untuk span workflow, node, dan Agent tool
- [DataTable Tab](./datatable-tab.md) – Menyediakan LLM Cost Table yang digunakan oleh diagram biaya
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk permukaan dashboard
