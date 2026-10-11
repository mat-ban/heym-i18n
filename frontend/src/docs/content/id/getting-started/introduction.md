# Pendahuluan

**Bangun sistem agentic. Jalankan dengan percaya diri.**

Heym adalah infrastruktur untuk menjalankan dan mengelola agen AI di lingkungan produksi. Orkestrasikan agen, otomatiskan proses bisnis, periksa setiap eksekusi, dan pastikan manusia tetap memegang kendali. Deploy Heym pada infrastruktur Anda sendiri.

Di Heym, sebuah workflow mendefinisikan bagaimana agen, langkah deterministik, tools, dan data bekerja bersama. Runtime mengeksekusi graf tersebut, mencatat setiap eksekusi, dan berhenti sejenak untuk tinjauan manusia di titik yang Anda tentukan. Canvas visual adalah tempat Anda membangun dan memeriksa workflow, dan workflow yang sama juga dapat dijalankan dari API, jadwal, event trigger, klien MCP, dan obrolan Portal. Kunjungi [heym.run](https://heym.run) untuk situs produk, dan lihat [Mengapa Heym](./why-heym.md) untuk mengetahui apa yang ditangani Heym pada setiap tahap siklus hidup agen.

## Yang Dapat Anda Lakukan

- **Bangun** – Susun agen dan langkah deterministik pada [canvas](../reference/canvas-features.md) di tab [Workflows](../tabs/workflows-tab.md), deskripsikan kepada [AI Assistant](../reference/ai-assistant.md), atau mulai dari [Templates](../tabs/templates-tab.md)
- **Orkestrasikan** – Koordinasikan Node [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), dan [RAG](../nodes/rag-node.md), [sub-agen](../reference/agent-architecture.md), tools MCP, dan [integrasi](../reference/integrations.md) seperti HTTP, Slack, dan email, dengan [eksekusi paralel](../reference/parallel-execution.md) di mana dependensi memungkinkan
- **Jalankan** – Mulai workflow dari [webhook](../reference/webhooks.md), jadwal [Cron](../nodes/cron-node.md), dan [trigger](../reference/triggers.md) event, dengan percobaan ulang per-Node, [penanganan error](../nodes/error-handler-node.md), dan [distribusi beban](../reference/cluster.md) di seluruh instance
- **Amati** – Periksa [riwayat eksekusi](../reference/execution-history.md), [trace LLM](../tabs/traces-tab.md) dengan biaya token, [analitik](../tabs/analytics-tab.md), dan [alert](../tabs/alerts-tab.md), serta ekspor trace [OpenTelemetry](../reference/opentelemetry.md)
- **Evaluasi** – Uji prompt dan model terhadap output yang diharapkan di tab [Evals](../tabs/evals-tab.md)
- **Kendalikan** – Hentikan agen untuk [tinjauan manusia](../reference/human-in-the-loop.md), blokir konten tidak aman dengan [guardrails](../reference/guardrails.md), dan kelola akses dengan [credentials](../tabs/credentials-tab.md), [tim](../reference/teams.md), [single sign-on](../reference/sso.md), dan [jejak audit](../reference/audit.md)
- **Ekspos** – Sajikan workflow melalui REST dan [streaming SSE](../reference/sse-streaming.md), sebagai tools [MCP](../tabs/mcp-tab.md), dan sebagai antarmuka obrolan [Portal](../reference/portal.md) untuk pengguna akhir; gunakan tab [Chat](../tabs/chat-tab.md) untuk menguji model secara langsung
- **Mengobrol dengan Heym** – Ajukan pertanyaan produk yang sadar halaman dari dialog [Chat with Heym](../reference/chat-with-heym.md) di dokumentasi

## Konsep Utama

- **Workflow** – Graf terarah yang terdiri dari Node dan edge. Kelola di tab [Workflows](../tabs/workflows-tab.md). Lihat [Struktur Workflow](../reference/workflow-structure.md).
- **Node** – Unit pemrosesan ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), dsb.). Lihat [Tipe Node](../reference/node-types.md).
- **Edge** – Koneksi yang mendefinisikan alur eksekusi
- **Credentials** – API key dan secret yang disimpan di tab [Credentials](../tabs/credentials-tab.md), direferensikan oleh Node.
- **Variabel** – Data key-value persisten di tab [Variables](../tabs/global-variables-tab.md), dapat diakses melalui `$global.variableName`. Lihat [Global Variables](../reference/global-variables.md).
- **Ekspresi** – Referensikan data hulu dengan `$input` dan `$nodeName.field`. Lihat [Expression DSL](../reference/expression-dsl.md).

## Terkait

- [Mengapa Heym](./why-heym.md) – Apa yang ditangani Heym pada setiap tahap siklus hidup agen
- [Quick Start](./quick-start.md) – Bangun workflow pertama Anda
- [Menjalankan & Deployment](./running-and-deployment.md) – Mulai secara lokal dengan `run.sh` atau deploy dengan `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Buat workflow dengan bahasa alami
- [Chat with Heym](../reference/chat-with-heym.md) – Ajukan pertanyaan lanjutan saat membaca dokumentasi
- [Konsep Inti](./core-concepts.md) – Workflow, Node, dan alur eksekusi
- [Tab Workflows](../tabs/workflows-tab.md) – Kelola workflow dan folder
- [Tab Credentials](../tabs/credentials-tab.md) – Tambahkan API key untuk Node
