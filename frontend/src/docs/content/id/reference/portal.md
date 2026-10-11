# Portal

**Portal** mengekspos Workflow Heym sebagai UI bergaya chat publik. Pengguna akhir dapat menjalankan Workflow melalui URL tanpa login ke Heym.

## Fungsinya

- **URL Publik**: `/chat/{slug}` (contoh: `/chat/my-workflow`)
- **Antarmuka chat**: Pengguna berinteraksi melalui UI chat (pesan, input, respons)
- **Auth opsional**: Jika pengguna portal dikonfigurasi, login diperlukan; jika tidak, portal bersifat publik
- **Streaming**: Progres node secara real-time selama eksekusi (jika diaktifkan)
- **Hentikan eksekusi yang berjalan**: Pengguna dapat menghentikan eksekusi portal yang sedang berjalan dari footer chat; eksekusi Workflow yang aktif juga dibatalkan di sisi server
- **Unggah file**: Unggahan file opsional (teks, gambar, dll.) per field input
- **Penyerahan tinjauan manusia**: Eksekusi portal dapat menampilkan [tautan tinjauan HITL](./human-in-the-loop.md) ketika agen berhenti untuk persetujuan
- **Tampilan gambar**: Output Workflow yang berisi gambar (misalnya dari pembuatan gambar LLM atau tangkapan layar Playwright) muncul sebagai thumbnail di chat. Klik gambar mana pun untuk membuka penampil layar penuh; tekan **Esc** atau gunakan tombol kembali perangkat untuk menutup

## Konfigurasi Workflow

| Pengaturan | Deskripsi |
|---------|-------------|
| `portal_enabled` | Aktifkan portal untuk Workflow ini |
| `portal_slug` | Slug URL (contoh: `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Gunakan eksekusi streaming |
| `portal_file_upload_enabled` | Izinkan unggahan file |
| `portal_file_config` | Konfigurasi file per-field (jenis, batas) |

Konfigurasikan di editor: Tombol **Portal** di header Workflow membuka dialog pengaturan portal.

## Alur

1. **Info**: `GET /api/portal/{slug}/info` – Mengembalikan metadata Workflow dan field input (tanpa auth)
2. **Login** (jika diperlukan): `POST /api/portal/{slug}/login` – Mengembalikan token sesi
3. **Eksekusi**: `POST /api/portal/{slug}/execute` – UI chat portal memanggil ini (atau varian streaming-nya secara internal jika diaktifkan); pengguna akhir berinteraksi melalui antarmuka chat, bukan dengan memanggil API secara langsung.
4. **Hentikan**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Diminta ketika pengguna menekan **Stop** selama eksekusi portal yang aktif

## HITL dalam Eksekusi Portal

Jika Workflow portal mencapai [Node Agen](../nodes/agent-node.md) dengan [Human-in-the-Loop](./human-in-the-loop.md) yang diaktifkan, respons portal menampilkan tautan tinjauan alih-alih tampak kosong.

- Status eksekusi Workflow menjadi `pending`
- Chat portal menampilkan URL tinjauan
- Node apa pun yang terhubung ke handle output `review` agen dapat memberi tahu Slack, email, atau saluran lain segera
- Peninjau menyelesaikan keputusan di `/review/{token}` tanpa login
- Setelah tinjauan, Workflow dilanjutkan dari snapshot yang tersimpan

Ini memungkinkan untuk menggabungkan alur chat publik dengan langkah persetujuan manusia yang privat.

## Field Input

Field input berasal dari node [Input](../nodes/input-node.md). API mengekstrak node awal bertipe `textInput` dan `inputFields`-nya. Eksekusi menggunakan mesin yang sama dengan eksekusi normal; input diteruskan sebagai `body.inputs` dan `conversation_history` untuk alur multi-turn.

## Auth dan Sesi

- **WorkflowPortalUser**: Nama pengguna/kata sandi per Workflow (ketika auth diaktifkan)
- **PortalSession**: Token sesi dengan TTL 168 jam
- **Pembatasan laju**: 3 percobaan login gagal → larangan 24 jam per Workflow+IP
- Sesi yang kedaluwarsa dibersihkan oleh cron job

## UI Konfigurasi

Tab **WebPortalSettingsDialog**:

1. **General**: Aktifkan portal, atur slug, salin URL portal
2. **Users**: Tambah/hapus pengguna portal (nama pengguna/kata sandi)
3. **Options**: Mode streaming, unggah file, lihat field input

## Terkait

- [Mengapa Heym](../getting-started/why-heym.md) – Portal sebagai permukaan chat untuk agen di produksi
- [Tab Workflows](../tabs/workflows-tab.md) – Buat Workflow dan aktifkan portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Halaman tinjauan publik untuk output agen yang tertunda
- [Trigger](./triggers.md) – Portal sebagai titik masuk
- [Jenis Node](./node-types.md) – [Input](../nodes/input-node.md) untuk input portal
- [Struktur Workflow](./workflow-structure.md) – Node dan edge
