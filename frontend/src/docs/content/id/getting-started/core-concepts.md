# Konsep Inti

## Workflow

Workflow adalah graf berarah dari [**Node**](../reference/node-types.md) yang dihubungkan oleh **edge**. Kelola Workflow di tab [Workflows](../tabs/workflows-tab.md). Atur Workflow dalam [folder](../reference/workflow-organization.md). Eksekusi mengalir dari [Node Trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) melalui Node pemrosesan hingga ke Node [output](../nodes/output-node.md). Lihat [Struktur Workflow](../reference/workflow-structure.md) untuk format JSON. Simpan dan bagikan Workflow sebagai [Template](../tabs/templates-tab.md) untuk digunakan kembali di berbagai proyek. Workflow juga dapat dijalankan dari [Board](../tabs/board-tab.md), di mana kartu kanban memicu rantai Workflow suatu kolom dengan konteks lengkap dari kartu tersebut.

## Node

Setiap Node memiliki:

- **Type** – Menentukan perilaku (misalnya `llm`, `condition`, `http`)
- **Data** – Konfigurasi (model, prompt, URL, dan lain-lain)
- **Input/Output** – Handle untuk menghubungkan ke Node lain

Lihat [Tipe Node](../reference/node-types.md) untuk daftar lengkapnya.

## Edge

Edge menghubungkan handle output suatu Node sumber ke handle input Node tujuan. Data mengalir melalui edge selama eksekusi.

## Alur Eksekusi

1. **Trigger** – Node Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger, atau [WebSocket Trigger](../nodes/websocket-trigger-node.md) memulai eksekusi (lihat [Trigger](../reference/triggers.md))
2. **Downstream** – Setiap Node menerima output dari Node upstream yang terhubung; [eksekusi paralel](../reference/parallel-execution.md) menjalankan Node independen secara bersamaan
3. **Expression** – Node mereferensikan data upstream melalui `$nodeLabel.field`. Lihat [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Node [Output](../nodes/output-node.md) menghasilkan hasil akhir

## Referensi Expression

Gunakan `$input` untuk data Node Input dan `$nodeLabel.field` untuk Node upstream mana pun. Contoh: `$llm.text` mereferensikan field `text` dari Node berlabel "llm". Sintaks lengkap: [Expression DSL](../reference/expression-dsl.md). Gunakan [Dialog Evaluasi Expression](../reference/expression-evaluation-dialog.md) untuk editor yang lebih besar dengan pratinjau backend secara langsung saat mengedit Expression.

## Terkait

- [Quick Start](./quick-start.md) – Bangun Workflow pertama Anda
- [Fitur Canvas](../reference/canvas-features.md) – Data pin, log eksekusi, aktifkan/nonaktifkan, ekstrak ke sub-Workflow
- [Asisten AI](../reference/ai-assistant.md) – Buat Workflow dengan bahasa alami
- [Tipe Node](../reference/node-types.md) – Semua Node yang tersedia
- [Expression DSL](../reference/expression-dsl.md) – Mereferensikan data dalam Expression
- [Dialog Evaluasi Expression](../reference/expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend secara langsung
- [Tab Workflows](../tabs/workflows-tab.md) – Kelola Workflow dan folder
- [Organisasi Workflow](../reference/workflow-organization.md) – Folder dan penghapusan terjadwal
- [Trigger](../reference/triggers.md) – Titik masuk untuk Workflow
- [Webhook](../reference/webhooks.md) – Trigger Webhook HTTP (TTL, cache, rate limit)
- [Eksekusi Paralel](../reference/parallel-execution.md) – Cara Node berjalan secara paralel
