# Tab Logs

Tab **Logs** menampilkan log kontainer Docker untuk stack Heym. Gunakan tab ini untuk debugging, pemantauan, dan troubleshooting. Untuk log eksekusi Workflow (hasil Node, output), gunakan panel Debug di editor Workflow—lihat [Fitur Canvas](../reference/canvas-features.md#execution-logs).

Log berbasis Docker dinonaktifkan secara default pada deployment self-hosted. Untuk mengaktifkannya, set `DOCKER_LOGS_ENABLED=true`, set `DOCKER_LOGS_ALLOWED_EMAILS` ke daftar email pengguna tepercaya yang dipisahkan koma yang diizinkan mengakses log Docker, dan pastikan `/var/run/docker.sock` di-mount ke kontainer backend. Layanan Docker Compose default dan contoh `docker run` langsung menyertakan mount tersebut untuk alat MCP stdio berbasis Docker; pertahankan hanya jika Anda menerima batas kepercayaan Docker socket.

Jika registrasi terbuka, buat akun admin tepercaya sebelum mengaktifkan log Docker atau pertahankan `ALLOW_REGISTER=false`; jika tidak, self-registration yang tidak terverifikasi dapat mengklaim email yang ada dalam daftar izin.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Tonton demo Logs</a></p>

## Pemilihan Kontainer

- **All Containers** – Log gabungan dari backend, frontend, dan PostgreSQL
- **Backend** – Kontainer `heym-backend`
- **Frontend** – Kontainer `heym-frontend`
- **PostgreSQL** – Kontainer `heym-postgres`

## Filter Log Level

- **All** – Tampilkan semua log level
- **INFO** – INFO dan di atasnya
- **WARNING** – Peringatan dan error
- **ERROR** – Hanya error
- **DEBUG** – Debug dan di atasnya

## Pencarian

- Filter log berdasarkan pencarian teks
- Kecocokan disorot pada output log

## Fitur

- **Auto scroll** – Gulir ke bawah saat log baru masuk
- **Stream** – Streaming log secara real time (jika didukung)
- **Copy** – Salin log ke clipboard
- **Download** – Unduh log sebagai file

## Kasus Penggunaan

- Debug kegagalan eksekusi Workflow
- Periksa log permintaan/respons API
- Pantau kueri database
- Periksa pesan startup dan health

## Terkait

- [Fitur Canvas](../reference/canvas-features.md) – Log eksekusi di panel Debug Workflow
- [Tab Traces](./traces-tab.md) – Inspeksi trace LLM
- [Tab Analytics](./analytics-tab.md) – Metrik eksekusi
- [Tab Workflows](./workflows-tab.md) – Manajemen Workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk permukaan dashboard
