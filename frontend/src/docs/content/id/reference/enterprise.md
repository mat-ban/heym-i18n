# Enterprise

Lisensi komersial, dukungan profesional, dan layanan deployment untuk platform Heym.

## Ikhtisar

Heym dapat digunakan dan di-self-host secara gratis di bawah lisensinya yang tersedia dalam bentuk source. Untuk organisasi yang memerlukan lisensi komersial, bantuan deployment tingkat produksi, atau dukungan khusus, paket Enterprise menyediakan layanan langsung dari tim Heym.

| Layanan | Deskripsi |
|---------|-------------|
| **Production Agent Support** | Tinjauan arsitektur, panduan desain agent dan workflow, serta bantuan langsung untuk membawa agent ke produksi |
| **Tool Training** | Sesi onboarding dan pelatihan untuk tim Anda yang mencakup workflow editor, node AI, agent, dan integrasi |
| **Heym Q&A** | Akses langsung ke tim engineering Heym untuk pertanyaan seputar platform, praktik terbaik, dan troubleshooting |
| **Kubernetes Deployment** | Bantuan untuk penyiapan multi-worker-node, sidecar container, strategi scaling, dan konfigurasi cluster |
| **Solution Consulting** | Desain solusi khusus untuk use case spesifik Anda, termasuk perencanaan integrasi dan rekomendasi arsitektur |
| **Priority Support & SLA** | Waktu respons yang terjamin dan penyelesaian masalah secara prioritas |
| **Custom Development** | Pengembangan fitur dan modifikasi yang disesuaikan dengan kebutuhan organisasi Anda |

## Heym Work

[Heym Work](./heym-work.md) adalah antarmuka untuk tim bisnis yang berjalan di atas Heym. Pengguna mendeskripsikan pekerjaan, menjawab beberapa pertanyaan, dan mendapatkan workflow yang telah diuji, bekerja dari halaman yang dibuat khusus untuk mereka, serta merespons tinjauan, lengkap dengan single sign-on (SSO), peran Owner, Editor, dan Viewer, serta nama pada setiap eksekusi. Heym Work berjalan berdampingan dengan Heym Anda menggunakan lisensinya sendiri; hubungkan melalui **Settings → Heym Work**. Pelajari lebih lanjut dan ajukan uji coba di [heym.run/enterprise](https://heym.run/enterprise).

## Production Agent Support

Tim Heym membantu Anda merancang, membangun, dan memperkuat agent serta workflow untuk proses bisnis Anda. Ini mencakup peninjauan kebutuhan Anda, rekomendasi konfigurasi node, dan memastikan workflow Anda mengikuti praktik terbaik untuk keandalan, observabilitas, dan tata kelola.

Dukungan mencakup semua jenis node termasuk [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), dan trigger [Cron](../nodes/cron-node.md) — serta pola lanjutan seperti [multi-agent orchestration](./agent-architecture.md), checkpoint [Human-in-the-Loop](./human-in-the-loop.md), dan [parallel execution](./parallel-execution.md) di seluruh branch.

## Tool Training

Sesi pelatihan langsung yang disesuaikan dengan tingkat keterampilan dan use case tim Anda:

- Workflow editor dan [fitur canvas](./canvas-features.md)
- Node bertenaga AI: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent architecture](./agent-architecture.md) dan multi-agent orchestration
- Manajemen [Credentials](./credentials.md) dan [integrasi pihak ketiga](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md), dan penjadwalan dengan [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) dan [global variables](./global-variables.md)
- Kolaborasi [Teams](./teams.md) dan [credentials sharing](./credentials-sharing.md)
- Deployment [Portal](./portal.md) untuk antarmuka chat yang menghadap pelanggan
- [Traces](../tabs/traces-tab.md) dan [Evals](../tabs/evals-tab.md) untuk observabilitas workflow AI

## Kubernetes Deployment

Panduan standar [Running & Deployment](../getting-started/running-and-deployment.md) mencakup Docker Compose untuk penyiapan produksi server tunggal. Pelanggan Enterprise menerima bantuan untuk deployment Kubernetes produksi guna mencapai ketersediaan tinggi dan scaling horizontal:

- **Multiple worker nodes** — Mendistribusikan worker backend Heym ke beberapa node Kubernetes untuk redundansi dan load balancing
- **Sidecar containers** — Mengonfigurasi pola sidecar untuk pengumpulan log, monitoring agent, service mesh (Istio, Linkerd), dan injeksi secret (Vault)
- **Resource planning** — Request/limit CPU dan memori, pod disruption budget, dan kebijakan horizontal pod autoscaling
- **Networking** — Konfigurasi Ingress controller, terminasi TLS, dan komunikasi layanan internal antara pod backend, frontend, dan database
- **Persistent storage** — Penyediaan volume database dan vector store dengan StorageClass dan strategi backup yang sesuai
- **Monitoring** — Integrasi dengan Prometheus, Grafana, atau stack observabilitas yang sudah Anda miliki untuk metrik container, log, dan alert

## Solution Consulting

Setiap organisasi menjalankan agent terhadap sistem dan batasan yang berbeda. Tim Heym menyediakan konsultasi untuk membantu Anda:

- Mengevaluasi apakah Heym cocok untuk use case spesifik Anda
- Merancang arsitektur agent dan workflow secara end-to-end
- Merencanakan integrasi dengan infrastruktur yang sudah ada dan layanan pihak ketiga
- Men-debug workflow yang kompleks dan menyelesaikan masalah produksi
- Memigrasikan workflow yang sudah ada dari tools seperti n8n, Zapier, atau Make.com

## Kontak

Hubungi tim enterprise di **enterprise@heym.run** untuk pertanyaan lisensi, harga, atau untuk menjadwalkan panggilan perkenalan.

## Terkait

- [Running & Deployment](../getting-started/running-and-deployment.md) — Deployment produksi dengan Docker Compose
- [Security](./security.md) — Praktik dan konfigurasi keamanan platform
- [Parallel Execution](./parallel-execution.md) — Model eksekusi multi-worker
- [Teams](./teams.md) — Kolaborasi tim dan berbagi sumber daya
- [Full Feature Set](./features.md) — Ikhtisar lengkap kemampuan Heym
- [Heym Work](./heym-work.md): antarmuka untuk tim bisnis, dan cara menghubungkannya
