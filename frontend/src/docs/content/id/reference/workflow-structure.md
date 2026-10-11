# Struktur Workflow

Workflow disimpan sebagai JSON dengan nodes dan edges. Lihat [Node Types](./node-types.md) untuk tipe node yang tersedia dan [Expression DSL](./expression-dsl.md) untuk sintaks ekspresi pada field `data`.

## Objek Workflow

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Objek Node

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### `data` Node Agent (memori persisten)

Node [Agent](../nodes/agent-node.md) mendukung knowledge graph opsional per node canvas:

| Field | Tipe | Deskripsi |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ketika `true`, muat graph yang tersimpan ke dalam system prompt dan gabungkan fakta baru setelah eksekusi berhasil |
| `memoryShares` | array (opsional) | Memberikan akses agent lain ke memory graph node ini (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Lihat [Agent Persistent Memory](./agent-persistent-memory.md). |

Contoh:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Lihat [Agent Persistent Memory](./agent-persistent-memory.md) untuk API path, perilaku editor, dan semantik ekstraksi.

## Objek Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipe Node

Nilai `type` yang umum: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), dan lainnya. Daftar lengkap: [Node Types](./node-types.md). Node pada level eksekusi yang sama berjalan secara [paralel](./parallel-execution.md).

## Tata letak editor

Setiap node memiliki `position.x` dan `position.y` untuk tata letak canvas desktop. Pada layar di bawah
breakpoint 768px, editor menggantikan canvas Vue Flow bebas dengan workflow tree layar penuh yang
menjorok. Tree mengikuti jalur eksekusi yang terhubung, menandai cabang paralel, dan menggunakan
label node, ikon, serta status eksekusi terbaru yang sama seperti editor desktop.

Ketuk node untuk memilihnya. Jika node memiliki hasil eksekusi yang tercatat, detail layar penuhnya
terbuka dengan tab input, output, dan error. Navigasi bawah mobile menyediakan **Nodes**, **Properties**,
**Run**, dan **More**; header tetap mempertahankan aksi simpan, riwayat, pencarian, pengaturan, dan
berbagi. Desktop tetap menggunakan canvas Vue Flow bebas dan panel samping.

Gunakan **Add node** pada tab Nodes mobile untuk mencari pustaka node. Node reguler membuka
connection sheet segera setelah ditambahkan: pilih node anchor dan tempatkan sebagai **After**,
**Before**, atau cabang **Parallel**. Dalam mode edit, ketuk node reguler yang ada untuk membuka sheet
yang sama dengan koneksi saat ini yang telah dipilih. Node Trigger tetap independen karena tidak
menerima input reguler. Kontrol edit juga menyediakan aksi hapus untuk node yang dipilih. Detail
eksekusi menyertakan panah sebelumnya dan berikutnya ketika hasil node yang berdekatan tersedia.
AI Assistant terbuka di atas tree mobile sebagai bottom sheet, tanpa mengubah tab editor yang aktif.

## Terkait

- [Node Types](./node-types.md) – Semua tipe node dan deskripsinya
- [Canvas Features](./canvas-features.md) – Fitur editor (data pin, log eksekusi, aktifkan/nonaktifkan, ekstrak ke sub-workflow)
- [Download & Import](./download-import.md) – Ekspor dan impor workflow sebagai JSON
- [Agent Node](../nodes/agent-node.md) – Struktur `data` node Agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares`, dan API memory graph
- [Expression DSL](./expression-dsl.md) – Sintaks untuk `userMessage`, `condition`, `$vars`, `$global`, dll.
- [Parallel Execution](./parallel-execution.md) – Cara node berjalan secara paralel
- [Triggers](./triggers.md) – Node awal dan titik masuk
- [Workflows Tab](../tabs/workflows-tab.md) – Membuat dan mengelola workflow
