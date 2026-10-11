# Quick Start

Jalankan Workflow Heym pertama Anda dalam hitungan menit.

Belum menjalankan Heym? Lihat [Running & Deployment](./running-and-deployment.md), atau ikuti panduan video: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Membuat Workflow

1. Buka tab [Workflows](../tabs/workflows-tab.md)
2. Klik **New Workflow**
3. Beri nama Workflow Anda (misalnya "Hello World")

## 2. Menambahkan Node

1. Buka panel **Nodes** di sebelah kiri
2. Seret Node [Input](../nodes/input-node.md) ke kanvas
3. Seret Node [LLM](../nodes/llm-node.md) dan hubungkan ke Input
4. Seret Node [Output](../nodes/output-node.md) dan hubungkan ke LLM

```
[Input] --> [LLM] --> [Output]
```

Lihat [Node Types](../reference/node-types.md) untuk semua Node yang tersedia.

## 3. Konfigurasi

- **Input**: Tetapkan nilai default atau biarkan kosong untuk input pengguna (lihat [Input Node](../nodes/input-node.md))
- **LLM**: Pilih [credential](../tabs/credentials-tab.md) dan model, tambahkan instruksi sistem, dan tetapkan `userMessage` ke `$input.text` (lihat [LLM Node](../nodes/llm-node.md))
- **Output**: Tetapkan `message` ke `$llm.text` untuk meneruskan respons LLM (lihat [Output Node](../nodes/output-node.md))

Gunakan sintaks [Expression DSL](../reference/expression-dsl.md) untuk `$input.text` dan `$llm.text`. Klik tombol perluas pada kolom ekspresi untuk membuka [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) dengan pratinjau backend secara langsung.

## 4. Menjalankan

Klik **Run**, tekan `Ctrl + Enter`, atau gunakan panel debug untuk mengeksekusi. Workflow berjalan dari Node Input melalui Node yang terhubung hingga ke Output. Lihat [Triggers](../reference/triggers.md) untuk cara lain menjalankan Workflow ([webhook](../reference/webhooks.md), portal, cron, dll.).

Lihat riwayat eksekusi di **History** (toolbar) dan gunakan **Bring to Canvas** untuk menjalankan ulang dengan input yang sama.

Pada halaman Docs, Evals, dan halaman internal non-kanvas lainnya, Anda juga dapat menggunakan [Quick Drawer](../reference/quick-drawer.md) untuk memilih Workflow yang disematkan dan menjalankannya tanpa kembali ke editor.

Jika Anda sedang membaca dokumentasi dan ingin klarifikasi sebelum membangun, buka [Chat with Heym](../reference/chat-with-heym.md) dari header Docs untuk mengajukan pertanyaan yang sadar konteks halaman.

Alternatifnya, gunakan [AI Assistant](../reference/ai-assistant.md) dari panel Debug untuk membuat Workflow dengan bahasa alami—jelaskan apa yang Anda inginkan dan AI akan menghasilkan Node dan edge.

Sudah membangun otomatisasi di alat lain? [Migrate to Heym](./migrate-to-heym.md) mengonversi Workflow n8n, Flowise, Dify, Langflow, sim.ai, atau Activepieces menjadi Workflow Heym yang dapat Anda impor.

## Terkait

- [Core Concepts](./core-concepts.md) – Workflow, Node, dan alur eksekusi
- [Migrate to Heym](./migrate-to-heym.md) – Konversi Workflow n8n, Flowise, Dify, Langflow, sim.ai, atau Activepieces ke Heym dengan AI
- [Running & Deployment](./running-and-deployment.md) – Mulai secara lokal dengan `run.sh` atau deploy dengan `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referensi konfigurasi lengkap
- [Settings](../reference/user-settings.md) – Konfigurasi nama, User Rules, dan kata sandi
- [Canvas Features](../reference/canvas-features.md) – Data pin, log eksekusi, aktifkan/nonaktifkan, ekstrak ke sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Pintasan kanvas dan editor
- [Expression DSL](../reference/expression-dsl.md) – Mereferensikan data dalam konfigurasi Node
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend secara langsung
- [Triggers](../reference/triggers.md) – Semua titik masuk Workflow ([webhook](../reference/webhooks.md), portal, cron, dll.)
- [Execution History](../reference/execution-history.md) – Lihat riwayat eksekusi dan Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Jalankan Workflow yang disematkan dari halaman non-kanvas
- [Chat with Heym](../reference/chat-with-heym.md) – Ajukan pertanyaan kontekstual dari header Docs
- [Workflows Tab](../tabs/workflows-tab.md) – Membuat dan mengelola Workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan API key untuk Node LLM
- [AI Assistant](../reference/ai-assistant.md) – Membuat Workflow dengan bahasa alami
