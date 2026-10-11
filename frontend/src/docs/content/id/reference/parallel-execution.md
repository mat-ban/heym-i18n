# Eksekusi Paralel

Heym menjalankan node secara paralel ketika node-node tersebut tidak memiliki dependensi satu sama lain, dan memungkinkan beberapa workflow run untuk dieksekusi secara bersamaan.

## Dalam Satu Run

### Penjadwalan Berbasis DAG

Executor mengelompokkan node berdasarkan **execution level** menggunakan directed acyclic graph (DAG):

1. **Level 0** – Node tanpa incoming edge (start node)
2. **Level N** – Node yang seluruh dependensi hulunya berada pada level 0..N-1

Node pada level yang sama tidak memiliki dependensi satu sama lain dan dijalankan secara paralel.

### Thread Pool

- **Shared pool**: `ThreadPoolExecutor(max_workers=8)` untuk eksekusi node
- **Penjadwalan**: `wait(..., return_when=FIRST_COMPLETED)` – segera setelah ada node yang selesai, node hilir dijadwalkan
- **Thread-safe**: Output node disimpan dengan lock (`store_node_output`)

### Sub-Agent Orchestrator

Ketika sebuah orchestrator agent mengembalikan beberapa pemanggilan tool `call_sub_agent` dalam satu turn, pemanggilan tersebut dijalankan secara paralel. Lihat [Agent Architecture](./agent-architecture.md).

### Node Merge

Node [Merge](../nodes/merge-node.md) menggabungkan output dari beberapa cabang paralel. Gunakan node ini ketika Anda secara eksplisit perlu menggabungkan hasil; jika tidak, cabang paralel dapat berakhir pada node output yang terpisah.

### Loop

Iterasi loop dijalankan secara **sekuensial**. Node-node di dalam body loop dijadwalkan ulang untuk setiap iterasi.

### Early Return

Node output dengan `allowDownstream` dapat melakukan return lebih awal. Pekerjaan hilir yang tersisa dijalankan di background.

## Workflow Run yang Konkuren

- **Tanpa lock per-workflow** – Beberapa request dapat menjalankan workflow yang sama pada waktu yang bersamaan
- **Async API** – Endpoint FastAPI menggunakan `asyncio.to_thread(execute_workflow)` sehingga event loop tetap responsif
- **Isolasi** – Setiap run mendapatkan instance `WorkflowExecutor` dan state-nya sendiri

Trigger yang menjalankan workflow ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) masing-masing memanggil `execute_workflow` secara independen.

## Streaming

Streaming menggunakan model paralel yang sama tetapi mengirimkan event saat node selesai. Editor dan portal chat UI menggunakan streaming secara internal untuk progres real-time, dan pengguna webhook kini dapat memilih untuk menggunakan event stream yang sama melalui endpoint execute [SSE Streaming](./sse-streaming.md).

## Terkait

- [Why Heym](../getting-started/why-heym.md) – Eksekusi DAG paralel pada runtime Heym
- [Workflow Structure](./workflow-structure.md) – Node, edge, dan alur eksekusi
- [Core Concepts](../getting-started/core-concepts.md) – Ikhtisar alur eksekusi
- [Node Types](./node-types.md) – Node [Merge](../nodes/merge-node.md) dan tipe lainnya
- [Triggers](./triggers.md) – Entry point yang memicu run
- [SSE Streaming](./sse-streaming.md) – Format event stream untuk `/execute/stream`
