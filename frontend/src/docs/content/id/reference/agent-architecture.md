# Arsitektur Agent

[Node Agent](../nodes/agent-node.md) mendukung sub-agent, sub-workflow, tool berupa canvas node, pola orchestrator, skill, koneksi MCP, pemanggilan tool, [memori persisten](./agent-persistent-memory.md) opsional (per canvas node, dengan opsi berbagi ke agent lain), serta [tinjauan manusia](./human-in-the-loop.md) opsional. Halaman ini menjelaskan arsitekturnya.

## Sub-Agent

Sub-agent adalah Node Agent yang dapat dipanggil oleh orchestrator melalui tool `call_sub_agent`.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agent**: Harus menggunakan `$input.text` pada User Message agar menerima prompt dari orchestrator
- **Tool**: `call_sub_agent` dengan `sub_agent_label` (enum) dan `prompt`
- **Batas kedalaman**: Maksimal 5 pemanggilan sub-agent bersarang

### Alur Eksekusi

1. Orchestrator memutuskan untuk memanggil sub-agent
2. `_execute_sub_agent_tool` mencari agent target berdasarkan label
3. Membangun `synthetic_inputs = {"input": {"text": prompt}}`
4. Menjalankan `_execute_agent_node` untuk sub-agent
5. Hasil dikembalikan ke orchestrator

### Eksekusi Sub-Agent Paralel

Ketika orchestrator mengembalikan beberapa pemanggilan tool `call_sub_agent` dalam satu giliran, pemanggilan tersebut dieksekusi **secara paralel**. Sebagai contoh, jika pengguna bertanya tentang "Paris" dan orchestrator memanggil `distanceAgent` serta `foodAgent`, keduanya berjalan secara bersamaan alih-alih berurutan.

- **Manfaat**: Total waktu kira-kira setara dengan sub-agent terlambat, bukan jumlah dari semuanya.
- **Saran**: Dorong orchestrator untuk memanggil beberapa sub-agent dalam satu giliran ketika tugas memerlukannya.

## Sub-Workflow

Ketika `subWorkflowIds` dikonfigurasi, agent dapat memanggil Workflow lain melalui tool `call_sub_workflow`.

- **Konfigurasi**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Tool**: `call_sub_workflow` dengan `workflow_id` (enum) dan `inputs` (object)
- **Batas kedalaman**: Maksimal 5 pemanggilan sub-workflow bersarang

### Alur Eksekusi

1. Agent memutuskan untuk memanggil sub-workflow
2. `_execute_sub_workflow_tool` mengambil Workflow dari `workflow_cache`
3. Membangun `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Menjalankan `WorkflowExecutor.execute()` untuk sub-workflow
5. Hasil dikembalikan ke agent

Sub-workflow tidak dapat dijeda untuk HITL pada v1. Jika sub-workflow bersarang mencoba masuk ke status tinjauan tertunda, eksekusi akan gagal alih-alih ditangguhkan di dalam pemanggilan bersarang tersebut.

## Tool Berupa Canvas Node

Tool berupa canvas node adalah Node Workflow yang terhubung ke agent melalui handle `tool-input`. Selama penyiapan agent, `_build_node_tool_schemas` memindai edge tersebut dan menambahkan satu skema tool yang kompatibel dengan OpenAI untuk setiap Node yang terhubung.

- **Sumber tool**: `_source: "node_tool"`
- **Nama tool**: diturunkan dari label Node yang terhubung, dengan sufiks ditambahkan untuk duplikat
- **Parameter tool**: dibangun dari `agentProvidedFields` milik Node
- **Field tetap**: semua field Node yang tidak tercantum dalam `agentProvidedFields` tetap berada dalam konfigurasi Node

### Alur Eksekusi

1. Agent memutuskan untuk memanggil tool Node yang terhubung
2. `_execute_node_tool` menyalin data Node
3. Argumen yang disediakan agent digabungkan ke dalam field Node yang dikonfigurasi
4. `execute_node` menjalankan Node tersebut satu kali dengan penjadwalan cabang dinonaktifkan
5. Data Node asli dipulihkan
6. Output Node dikembalikan ke agent sebagai hasil tool

Node tool dikecualikan dari penjadwalan Workflow normal agar tidak berjalan dua kali. Node tersebut hanya dieksekusi melalui jalur pemanggilan tool agent.

## Human-in-the-Loop

Ketika `hitlEnabled` diaktifkan pada agent, agent menerima tool `request_human_review` yang dapat dipanggilnya pada titik pemeriksaan persetujuan tertentu.

1. System prompt dan panduan HITL Node memberi tahu agent tindakan mana yang memerlukan persetujuan
2. Ketika agent mencapai salah satu langkah tersebut, agent memanggil `request_human_review`
3. Heym menyimpan snapshot eksekusi Workflow dan membuat permintaan tinjauan publik
4. Hasil Node ditandai `pending` dengan URL tinjauan
5. Handle output `review` milik agent dijadwalkan segera agar cabang notifikasi dapat berjalan dengan payload yang tertunda
6. Penjadwalan eksekusi utama berhenti hingga peninjau merespons
7. Pada `accept`, `edit`, atau `refuse`, executor dibangun ulang dari snapshot yang tersimpan
8. Agent yang dijeda melanjutkan dengan konteks tinjauan yang disetujui, atau langsung keluar pada `refuse`
9. Node hilir melanjutkan setelah agent yang dilanjutkan selesai, tanpa menjalankan ulang cabang `review`
10. Jika tindakan selanjutnya juga memerlukan persetujuan, agent dapat membuat titik pemeriksaan HITL lain dalam eksekusi yang sama

Ringkasan yang ditujukan untuk peninjau dihasilkan dari permintaan tinjauan itu sendiri, sehingga field Node dapat tetap berfokus pada kebijakan persetujuan dan waktu.

Hal ini memungkinkan Workflow agent menunggu persetujuan eksternal sambil mempertahankan riwayat percakapan, output Node yang telah selesai, status loop, dan konteks runtime lainnya.

## Executor Tool Orchestrator

Executor tool kustom merutekan:

- **Pemanggilan sub-agent** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Pemanggilan sub-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Tool berupa canvas node** (`_source == "node_tool"`) → `_execute_node_tool`
- **Tinjauan manusia** (`_source == "hitl"`) → membuat titik pemeriksaan HITL yang tertunda
- **Tool lainnya** → `_unified_tool_executor` (Python, MCP, tool skill)

Executor ini digunakan ketika HITL diaktifkan, ketika `isOrchestrator` dengan `subAgentLabels` ditetapkan, atau ketika `subWorkflowIds` dikonfigurasi.
## Skills

Skills memperluas konteks sistem agen dan dapat menambahkan Python tools.

- **Bentuk**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Konten**: Ditambahkan di awal system instruction (digabungkan dengan `---`)
- **Python tools**: Untuk setiap skill dengan file `.py`, sebuah tool `skill_{skill_name}` akan ditambahkan
- **Eksekusi**: `skill_python_executor.py` menjalankan skrip dengan `uv run python` di direktori sementara; argumen berupa JSON melalui stdin, hasil berupa JSON melalui stdout

Skills dapat ditambahkan dengan meletakkan file `.zip` atau `.md` ke area Skills pada konfigurasi [Agent Node](../nodes/agent-node.md).

## MCP Client

Klien MCP (Model Context Protocol) terhubung ke server tool eksternal.

- **Transport**: `stdio` (command + args) atau `sse` (url + headers)
- **Daftar tool**: `list_mcp_tools` → `ClientSession.list_tools()` → dikonversi ke format fungsi OpenAI dengan `_source: "mcp"`
- **Eksekusi**: `execute_mcp_tool` → `ClientSession.call_tool()` → hasil melalui `_extract_tool_result`

Konfigurasikan koneksi MCP pada [MCP Tab](../tabs/mcp-tab.md) atau pada `mcpConnections` milik agent node.

## Tool Calling

Layanan LLM menjalankan loop `execute_with_tools`:

1. **Pemeriksaan kompresi konteks** — sebelum setiap iterasi, estimasikan penggunaan token dan kompres jika diperlukan (lihat di bawah)
2. Panggil model dengan `tools` dan `tool_choice: "auto"`
3. Jika `tool_calls` ada: untuk setiap panggilan, jalankan `tool_executor(tool_def, name, args, timeout)`
4. Tambahkan hasil tool ke messages, ulangi
5. Berhenti ketika tidak ada lagi tool call atau `max_tool_iterations` tercapai

### Tool Dispatch

`_unified_tool_executor` merutekan berdasarkan `_source`:

| Sumber | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (default) | `execute_tool` (Python code tools) |

Tool menggunakan format function-calling OpenAI: `name`, `description`, `parameters` (JSON schema).

## Context Compression

Untuk mencegah overflow konteks pada agen yang berjalan lama, Heym secara otomatis mengompresi daftar `messages` yang terakumulasi sebelum setiap iterasi tool.

### Algoritma

1. **Estimasi token**: `total_chars / 4` di seluruh messages (cepat, tidak memerlukan tokenizer)
2. **Pemeriksaan threshold**: jika `estimated_tokens < context_limit × 0.80`, lewati kompresi
3. **Batas konteks**: coba `client.models.retrieve(model).context_window`; fallback ke tabel bawaan (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, dll.); default 128K
4. **Preservasi anchor**: selalu pertahankan
   - Pesan `system` pertama (identitas dan instruksi agen)
   - Pesan `user` pertama (tugas awal)
   - Pesan `user` terakhir (instruksi terbaru)
5. **Ringkas bagian tengah**: semua yang berada di antara pesan user pertama dan terakhir diserialisasi dan dikirim ke model yang sama dengan prompt peringkasan
6. **Bangun ulang**: `[system, first_user, assistant(summary), last_user]`

Kompresi dilewati jika terdapat kurang dari 2 pesan user yang berbeda (tidak ada bagian tengah untuk diringkas) atau jika panggilan peringkasan LLM gagal (fallback aman: kembalikan messages asli).

### Observabilitas

Setiap peristiwa kompresi dicatat sebagai:
- Entri `_context_compression` pada `tool_calls_collected` → terlihat pada detail run Execution History
- Peristiwa `on_tool_call` dengan `phase: "compression"` → dirender pada panel Debug sebagai `Context compressed (N messages → summary)`
- Entri LLM trace `context.compression` → terlihat pada tab Traces dengan estimasi token sebelum/sesudah

Tool call agen juga menghasilkan observabilitas yang lebih kaya:

- Field siklus hidup per panggilan pada `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agregat pada hasil agen (jumlah berdasarkan status plus durasi total/maksimum); entri `_context_compression` dikecualikan dari hitungan tersebut
- Span anak OpenTelemetry opt-in dengan nama `heym.agent.tool.execute` (lihat [OpenTelemetry Tracing](./opentelemetry.md))
- Payload `tool_calls` pada LLM trace / execution-history yang dipersistenkan telah disunting dan dibatasi ukurannya; state resume HITL aktif menyimpan data asli untuk pencocokan

## Terkait

- [Why Heym](../getting-started/why-heym.md) – Orkestrasi multi-agen di seluruh siklus hidup agen
- [Agent Node](../nodes/agent-node.md) – Konfigurasi dan parameter
- [Agent Persistent Memory](./agent-persistent-memory.md) – Knowledge graph per agent node dan berbagi antar peer
- [Human-in-the-Loop](./human-in-the-loop.md) – Tautan review, payload tertunda, dan perilaku resume
- [OpenTelemetry Tracing](./opentelemetry.md) – Span Workflow, node, dan Agent tool
- [Node Types](./node-types.md) – Node Agent dan node terkait
- [Parallel Execution](./parallel-execution.md) – Eksekusi paralel berbasis DAG dan sub-agen
- [MCP Tab](../tabs/mcp-tab.md) – Konfigurasikan koneksi MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` untuk sub-agen
