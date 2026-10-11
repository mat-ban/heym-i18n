# Menjalankan & Deployment

Heym menyediakan dua skrip untuk lingkungan yang berbeda: `run.sh` untuk pengembangan lokal dan `deploy.sh` untuk deployment produksi menggunakan Docker Compose.

> **Panduan video:** [Menyiapkan Heym Secara Lokal dalam Waktu Kurang dari 2 Menit](https://www.youtube.com/watch?v=P6YvlupUboU) — clone repositori, jalankan PostgreSQL, isi variabel lingkungan yang diperlukan, dan buat akun pertama Anda pada instans lokal.

## Prasyarat

Kedua skrip memerlukan alat berikut untuk dipasang:

| Alat | Kegunaan |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Kontainer database (dev) dan full stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Manajer paket Python untuk backend |
| [bun](https://bun.sh) | Runtime JavaScript untuk frontend |

## Penyiapan Lingkungan

Baik `run.sh` maupun `deploy.sh` membaca dari berkas `.env` di root proyek. Jika berkas tersebut tidak ada, skrip akan secara otomatis membuatnya dari `.env.example` — baik untuk pengembangan lokal maupun produksi.

`SECRET_KEY` dan `ENCRYPTION_KEY` disertakan dalam keadaan kosong pada `.env.example`. Ketika salah satunya kosong, `run.sh` dan `deploy.sh` akan menghasilkan nilai yang kuat secara kriptografis secara otomatis dan menuliskannya kembali ke `.env`, sehingga penyiapan baru tidak memerlukan penanganan kunci secara manual. Jika `.env` yang ada masih berisi placeholder `ENCRYPTION_KEY` lama (`change_this_to_a_random_32_byte_hex_value`), skrip akan berhenti dengan kesalahan eksplisit alih-alih menimpanya — merotasi kunci tersebut akan membuat kredensial yang sebelumnya terenkripsi menjadi tidak dapat dibaca. Backend sendiri juga menolak untuk memulai jika salah satu kunci kosong atau dibiarkan pada placeholder yang diketahui.

Untuk membuat berkas secara manual (opsional — skrip akan melakukannya untuk Anda):

```bash
cp .env.example .env
```

Variabel lingkungan utama:

Untuk setiap variabel yang didukung, nilai default, dan catatan produksi, lihat [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabel | Deskripsi |
|----------|-------------|
| `SECRET_KEY` | **Wajib.** Secret penandatanganan JWT. Dibuat otomatis oleh `run.sh`/`deploy.sh` ketika kosong. |
| `ENCRYPTION_KEY` | **Wajib.** Kunci enkripsi kredensial. Dibuat otomatis oleh `run.sh`/`deploy.sh` ketika kosong. |
| `DATABASE_URL` | Override string koneksi database opsional. Jika kosong, Heym akan membangunnya dari pengaturan `POSTGRES_*`. |
| `BACKEND_PORT` | Port API backend — default ke `10105` |
| `FRONTEND_PORT` | Port frontend — default ke `4017` |
| `FRONTEND_URL` | **Wajib di produksi.** URL publik aplikasi (skema + host, misalnya `https://heym.example.com`). Digunakan untuk URI pengalihan OAuth (Google Sheets, BigQuery, Notion, dan sejenisnya), serta untuk tautan review, tindak lanjut Codex, dan tautan berkas yang dihasilkan oleh proses background; harus cocok dengan URL yang digunakan pengguna di browser. Dalam cluster, tetapkan nilai yang sama pada setiap instans. |
| `ALLOW_REGISTER` | Pendaftaran pengguna terbuka (`false` di prod, `true` di dev). Ubah menjadi `false` hanya setelah akun admin Anda ada — tidak ada bootstrap pengguna pertama, sehingga database kosong ditambah pendaftaran yang dinonaktifkan tidak menyisakan cara untuk membuatnya. |
| `DOCKER_LOGS_ENABLED` | Mengaktifkan akses tab Logs berbasis Docker ketika diatur ke `true`; juga memerlukan akses socket Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Daftar email pengguna tepercaya yang dipisahkan koma yang diizinkan mengakses log Docker ketika `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Ukuran maksimum body permintaan HTTP yang diterima sebelum handler endpoint dijalankan; default ke `100`, satu MB di atas `FILE_MAX_SIZE_MB` untuk memberi ruang bagi overhead multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Bagaimana tool Python yang ditentukan pengguna dijalankan: `auto` (default — kontainer Docker yang diperkuat dan terisolasi; gagal tertutup jika Docker tidak tersedia), `docker` (sama, tidak pernah fallback), atau `subprocess` (fallback lokal dalam proses; bukan batas keamanan, hanya untuk tepercaya/dev). `run.sh` menetapkan `subprocess` untuk dev native. Lihat [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image yang digunakan untuk sandbox Docker tool Python. Kosong = deteksi otomatis image backend yang sedang berjalan. |

Default koneksi database (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) didokumentasikan dalam [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) dan `.env.example`.

---
## Pengembangan: `run.sh`

`run.sh` menjalankan ketiga layanan secara lokal — database (sebagai kontainer Docker), backend FastAPI, dan Vite dev server — dengan satu perintah.

```bash
./run.sh
```

**Apa yang dilakukannya, langkah demi langkah:**

1. Memeriksa ketersediaan `docker`, `bun`, dan `uv`
2. Membuat `.env` dari `.env.example` jika belum ada, dan menghasilkan `SECRET_KEY` serta `ENCRYPTION_KEY` acak ketika salah satunya kosong
3. Menjalankan (atau membuat) kontainer Docker database pada port `6543`, menyimpan datanya di volume Docker `heym-postgres-data` alih-alih direktori host
4. Memasang dependensi Python melalui `uv sync`
5. Menjalankan migrasi database Alembic (`alembic upgrade head`)
6. Membebaskan port backend dan frontend jika sedang digunakan
7. Menjalankan backend FastAPI dengan `--reload` (hot-reload saat ada perubahan kode)
8. Memasang dependensi frontend melalui `bun install`
9. Menjalankan Vite dev server

**Opsi:**

| Flag | Deskripsi |
|------|-------------|
| *(tidak ada)* | Mulai dengan debug logging aktif (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Mulai dengan level log bawaan (tanpa output debug) |
| `--help` | Tampilkan informasi penggunaan |

**Alamat layanan (dev):**

| Layanan | Alamat |
|---------|---------|
| Frontend | `localhost` pada `FRONTEND_PORT` (bawaan: 4017) |
| Backend API | `localhost` pada `BACKEND_PORT` (bawaan: 10105) |
| Dokumentasi API Interaktif | `localhost:10105/docs` |
| Database | `localhost:6543` |

Tekan `Ctrl+C` untuk menghentikan semua layanan secara graceful.

---

## End-to-End Tests: `run_e2e.sh`

Suite Playwright frontend dijalankan terhadap aplikasi Vue yang sebenarnya, backend FastAPI, dan
database PostgreSQL yang terisolasi:

```bash
./run_e2e.sh
```

Suite ini merupakan smoke dan regression suite untuk jalur kunci, bukan cakupan produk yang menyeluruh. Suite ini mencakup autentikasi, siklus hidup dan eksekusi Workflow inti, sumber daya dashboard terpilih, rute publik, dan UI review HITL yang di-mock. Integrasi provider, setiap tipe Node, matriks sharing/permission, dan eksekusi resume HITL penuh tetap tercakup terutama oleh pengujian backend atau memerlukan lingkungan integrasi khusus.

Setiap eksekusi mendapatkan kontainer PostgreSQL 16 sementara tersendiri, port database/backend/frontend acak yang tersedia, status autentikasi, hasil pengujian, dan laporan HTML. Hal ini memungkinkan beberapa proses `run_e2e.sh` berjalan secara bersamaan tanpa berbagi status atau menimpa artefak. Skrip akan menghapus kontainer database-nya saat eksekusi selesai dan mencetak direktori artefak serta jalur laporan.

Perintah yang berguna:

```bash
./run_e2e.sh --ui         # Playwright runner interaktif dengan database terisolasi
cd frontend
bun run test:e2e:report   # Buka eksekusi lokal terakhir yang telah selesai
```

Eksekusi langsung `bun run test:e2e` dan `bun run test:e2e:ui` memerlukan `DATABASE_URL` yang eksplisit agar tidak dapat secara diam-diam berjalan terhadap database pengembangan lokal. Gunakan `./run_e2e.sh` untuk eksekusi lokal normal.

`./check.sh` menjalankan lint, typecheck, formatting, dan pengujian backend tanpa suite E2E, sehingga jalur pemeriksaan lokal bawaan tetap cepat. Jalankan pengujian Playwright E2E secara terpisah dengan `./run_e2e.sh`. Pull request selalu menjalankan suite E2E Chromium di GitHub Actions dan menyimpan trace, screenshot, video, serta laporan HTML ketika terjadi kegagalan.

---
## Produksi: `deploy.sh`

`deploy.sh` membangun dan menjalankan seluruh stack menggunakan Docker Compose. Ketiga layanan — database, backend, dan frontend — berjalan sebagai container. Entrypoint backend secara otomatis menjalankan migrasi sebelum memulai server dengan 8 worker.

**Deploy awal (build + start):**

```bash
./deploy.sh
```

Perintah ini melakukan deploy tanpa downtime: image dibangun terlebih dahulu selagi container yang ada tetap berjalan, kemudian versi baru ditukar masuk.

**Perintah yang tersedia:**

| Perintah | Deskripsi |
|---------|-------------|
| `./deploy.sh` | Bangun image dan mulai/perbarui semua layanan |
| `./deploy.sh --status` | Tampilkan status container |
| `./deploy.sh --logs` | Alirkan log dari semua container |
| `./deploy.sh --restart` | Mulai ulang semua container |
| `./deploy.sh --down` | Hentikan dan hapus semua container |
| `./deploy.sh --migrate-pgdata` | Migrasi satu kali: salin direktori `data/postgres` yang ada ke dalam Docker volume `heym-postgres-data` dan bangun ulang indeksnya |
| `./deploy.sh --help` | Tampilkan informasi penggunaan |

**Penyimpanan database: Docker named volume, bukan direktori host.**

Compose menyimpan PostgreSQL di dalam Docker volume `heym-postgres-data`. Versi sebelumnya melakukan bind-mount pada direktori host `./data/postgres`. Bind mount host pada macOS (virtiofs) dan Windows/WSL2 tidak memberikan jaminan `fsync` dan penutupan file yang dibutuhkan PostgreSQL: cluster di sana mengalami `PANIC: could not close file … Input/output error` pada segmen WAL dan rusak seiring waktu. Bind mount Linux tidak pernah terpengaruh, tetapi setiap platform kini menggunakan tata letak yang sama.

Meningkatkan deployment yang masih memiliki data di `./data/postgres` merupakan langkah satu kali. `./deploy.sh` mendeteksinya, berhenti sebelum membangun, dan meminta Anda untuk melakukan migrasi terlebih dahulu:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**Migrasi juga membangun ulang indeks.** Penyalinan dilakukan byte-for-byte, sehingga kerusakan indeks yang disebabkan oleh bind mount lama akan ikut terbawa. Oleh karena itu, `--migrate-pgdata` menjalankan layanan `postgres` saja pada volume baru, menjalankan `reindexdb` terhadapnya, dan menghentikannya kembali sebelum sisa stack dinyalakan. Hal ini penting karena kelas kerusakan ini meninggalkan entri indeks yang menunjuk melewati akhir heap — suatu kondisi yang dilaporkan `pg_amcheck` sebagai bersih, sehingga pemeriksaan yang lolos bukanlah bukti tabel yang sehat. REINDEX memperbaiki entri tersebut; REINDEX tidak dapat memulihkan halaman heap yang telah hilang dari filesystem lama. Pada database besar yang diketahui sehat, Anda dapat melewati pembangunan ulang dengan `./deploy.sh --migrate-pgdata --skip-reindex`.

Penyalinan bersifat non-destruktif. `./data/postgres` tetap berada di tempatnya sebagai cadangan, dan migrasi menolak menimpa volume yang sudah berisi database. Jika ada langkah yang gagal, volume baru akan dihapus, sehingga cluster yang termigrasi setengah tidak akan pernah ter-deploy secara tidak sengaja. Hapus direktori lama setelah Anda memastikan Workflow Anda utuh. Container `postgres` membawa pengaman yang sama, sehingga `docker compose up` secara manual juga tidak dapat secara diam-diam menginisialisasi database kosong di atas data Anda. Instalasi baru tidak memerlukan tindakan apa pun.

**Alamat layanan (produksi):**

Container frontend diekspos pada `FRONTEND_PORT` (default: 4017). API backend disajikan di bawah path `/api`, diproksikan melalui container frontend — sehingga hanya ada satu port yang menghadap publik di produksi.

**Ikhtisar container:**

| Container | Deskripsi |
|-----------|-------------|
| `heym-db` | Database relasional |
| `heym-backend` | Server API FastAPI (8 worker, dibangun dari `backend/Dockerfile`) |
| `heym-frontend` | Container preview frontend yang menyajikan aplikasi Vue yang telah dibangun (dibangun dari `frontend/Dockerfile`) |

**Badge pembaruan versi:**

Header aplikasi menampilkan versi build Docker yang sedang berjalan. Ketika versi tersebut tertinggal dari rilis GitHub Heym terbaru, badge **Update** berwarna ungu akan muncul di samping versi. Klik versi atau badge untuk membuka halaman rilis GitHub Heym.

---
## Image Siap Pakai: `docker run`

Jika Anda lebih memilih untuk tidak membangun aplikasi secara lokal, Anda dapat menarik image container yang telah dipublikasikan dan menjalankannya secara langsung.

Image ini menjalankan frontend dan backend secara bersamaan dalam satu container. PostgreSQL tetap bersifat eksternal, namun Anda dapat menyediakan `DATABASE_URL` atau variabel `POSTGRES_*` dari `.env.example`.

> **Simpan database Anda dalam Docker named volume.** Image rilis tidak menyertakan database, sehingga PostgreSQL di balik `DATABASE_URL` menjadi tanggung jawab Anda untuk menjalankannya. Mount sebagai `-v heym-postgres-data:/var/lib/postgresql/data` alih-alih path host: pada macOS (virtiofs) dan Windows/WSL2, direktori data PostgreSQL yang di-bind-mount tidak mematuhi jaminan `fsync` yang dibutuhkan database dan akan merusak cluster seiring waktu.

> **Backend vector store.** `run.sh` dan `deploy.sh` menjalankan image resmi `postgres:16` dan secara otomatis memasang paket `postgresql-16-pgvector` saat startup, sehingga **backend RAG Postgres (pgvector)** berfungsi langsung tanpa perubahan pada data Anda. Namun, image single-container siap pakai terhubung ke PostgreSQL yang **Anda** sediakan — database tersebut harus mendukung ekstensi `vector` untuk menggunakan backend Postgres. Heym tidak dapat memasang pgvector ke dalam database yang tidak dikelolanya. Tanpa ekstensi tersebut, migrasi startup akan melewati tabel pgvector secara graceful — deployment tetap berhasil, RAG Qdrant tetap berfungsi, dan pembuatan atau pengunggahan ke Postgres vector store akan mengembalikan pesan "backend unavailable" yang jelas hingga pgvector diaktifkan.

**Tetapkan key sendiri untuk menjalankan image secara langsung.** Berbeda dengan `run.sh`/`deploy.sh`, image siap pakai tidak menghasilkan key secara otomatis. Setelah `cp .env.example .env`, isi kedua key yang kosong (mengganti di tempat menghindari entri duplikat):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Pastikan mount file dan plugin bersifat absolut.** `FILE_STORAGE_DIR` dan `HEYM_PLUGINS_DIR` secara default menggunakan path relatif `./data/files` dan `data/plugins`, dan image rilis menjalankan backend dari `/app/backend`. Jika dibiarkan relatif, keduanya akan mengarah ke `/app/backend/data/files` dan `/app/backend/data/plugins`, sehingga kedua bind mount di atas tidak menerima apa pun dan unggahan akan hilang saat container diganti. Flag `-e` menimpa nilai relatif yang disediakan `.env.example` melalui `--env-file`, karena `-e` pada command-line menang atas `--env-file`. Compose (`./deploy.sh`) tidak memerlukan ini: image tersebut menjalankan backend dari `/app`, di mana nilai default relatif sudah mengarah ke mount yang tepat.

> **Akses Docker socket.** Mount `/var/run/docker.sock` memberikan backend kontrol luas atas Docker daemon host. Layanan Docker Compose default dan contoh `docker run` langsung menyertakannya untuk tool MCP stdio berbasis Docker yang menjalankan perintah `docker`. Tab Logs tetap memerlukan `DOCKER_LOGS_ENABLED=true` dan `DOCKER_LOGS_ALLOWED_EMAILS` dengan daftar email pengguna tepercaya yang dipisahkan koma. Buat akun admin tepercaya sebelum mengaktifkan Docker logs, atau biarkan `ALLOW_REGISTER=false`, agar pendaftaran mandiri yang tidak terverifikasi tidak dapat mengklaim email yang ada dalam allow-list. Tool Python yang ditentukan pengguna **tidak** mendapatkan socket ini: tool tersebut berjalan dalam container terpisah yang diperketat tanpa Docker socket. Lihat [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Node Codex menggunakan image `ghcr.io/heymrun/heym` yang sama sebagai container runner saudara (`--entrypoint codex`) agar sandbox Linux Codex dapat membuat namespace. Pertahankan mount volume `heym-codex-workspaces` jika Anda menginginkan Workflow Codex dalam setup image langsung; runner tidak menerima Docker socket atau secret backend.

> **OpenCode Go runner.** Node OpenCode Go menggunakan image yang sama sebagai runner saudara yang diperketat (`--entrypoint opencode`) dengan berbagi `heym-opencode-workspaces`. Pertahankan mount volume tersebut jika Anda menginginkan Workflow OpenCode dalam setup image langsung; runner tidak menerima Docker socket atau token GitHub.

> **Skill sandbox.** Skill Python pada Node Agent berjalan dalam container saudara yang diperketat dengan berbagi volume `heym-codex-workspaces`, jadi pertahankan mount volume tersebut untuk skill juga — bukan hanya Codex. Setiap eksekusi mendapatkan subpath per-run yang terisolasi, dan container saudara tidak menerima Docker socket maupun secret backend. Ini memerlukan **Docker Engine 25.0+**; pada engine yang lebih lama, atau tanpa volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` akan gagal secara fail-closed — tetapkan `HEYM_PYTHON_TOOL_SANDBOX=subprocess` hanya untuk setup single-user yang tepercaya. Lihat [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` diperlukan untuk Playwright.** Docker memberikan container 64 MB untuk `/dev/shm` dan Chromium akan mengalami crash pada renderer-nya di bawah batas tersebut. Node Playwright berbasis langkah menjalankan Chromium sebagai subprocess di dalam container ini, sehingga batasnya adalah batas container ini; `playwrightCode` kustom berjalan di container sibling yang menetapkan batasnya sendiri. `docker-compose.yml` sudah mendeklarasikan `shm_size: "2gb"`, sehingga `run.sh` dan `deploy.sh` tidak terpengaruh — hanya `docker run` biasa yang memerlukan flag tersebut.

> **Playwright Run Code.** Playwright Python kustom memerlukan `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` dan mount Docker socket di atas. Image rilis menetapkan `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` untuk tata letak GHCR (`/app/backend/.venv`). Compose `./deploy.sh` menetapkan default image sandbox ke `heym-backend:local`. Pertahankan `--no-sandbox` pada argumen peluncuran Chromium di dalam container sandbox.

**Environment variable minimum untuk menjalankan image secara langsung:**

| Variable | Wajib | Tujuan |
|----------|----------|---------|
| `DATABASE_URL` | Opsional | Override string koneksi PostgreSQL lengkap |
| `POSTGRES_HOST` | Ya, jika `DATABASE_URL` kosong | Host PostgreSQL |
| `POSTGRES_PORT` | Ya, jika `DATABASE_URL` kosong | Port PostgreSQL |
| `POSTGRES_USER` | Ya, jika `DATABASE_URL` kosong | Username PostgreSQL |
| `POSTGRES_PASSWORD` | Ya, jika `DATABASE_URL` kosong | Password PostgreSQL |
| `POSTGRES_DB` | Ya, jika `DATABASE_URL` kosong | Nama database PostgreSQL |
| `SECRET_KEY` | Ya | Secret penandatanganan JWT |
| `ENCRYPTION_KEY` | Ya | Kunci enkripsi kredensial |
| `FRONTEND_URL` | Direkomendasikan | URL browser publik, terutama untuk callback OAuth |
| `CORS_ORIGINS` | Direkomendasikan | Origin browser yang diizinkan |
| `FILE_STORAGE_DIR` | Direkomendasikan | Tetapkan ke path absolut `/app/data/files` saat Anda me-mount path tersebut; default relatif `./data/files` akan diselesaikan di bawah `/app/backend` pada image ini dan tidak menemukan mount tersebut |
| `ALLOW_REGISTER` | Direkomendasikan | Tetapkan `false` di produksi kecuali pendaftaran terbuka memang diinginkan, tetapi hanya setelah akun admin Anda ada — tidak ada bootstrap pengguna pertama |
| `DOCKER_LOGS_ENABLED` | Opsional | Tetapkan `true` untuk mengizinkan tab Logs menggunakan akses Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Wajib saat `DOCKER_LOGS_ENABLED=true` | Daftar email pengguna tepercaya yang dipisahkan koma yang diizinkan mengakses log Docker |
| `HEYM_PLUGINS_ENABLED` | Opsional | Tetapkan `true` untuk mengaktifkan subsistem plugin (Node kustom yang dipasang sebagai zip). Nonaktif secara default |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Wajib saat `HEYM_PLUGINS_ENABLED=true` | Email operator yang dipisahkan koma yang diizinkan memasang/mencopot plugin |
| `HEYM_PLUGINS_DIR` | Opsional | Lokasi penyimpanan file plugin. Tetapkan ke path absolut `/app/data/plugins` saat Anda me-mount path tersebut; default relatif `data/plugins` akan diselesaikan di bawah `/app/backend` pada image ini dan tidak menemukan mount tersebut |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opsional | Mode isolasi Python tool; default ke `auto` (sandbox Docker yang diperkuat, fail closed). Lihat [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opsional | Override image sandbox Python tool; kosong = deteksi otomatis image backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opsional | Volume Docker yang digunakan oleh container runner Codex sibling; default ke `heym-codex-workspaces` pada deployment Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opsional | Mengizinkan perintah sandbox Codex mengunduh file/dependensi; deployment Docker mengaktifkan ini secara default |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opsional | Volume Docker yang digunakan oleh container runner OpenCode sibling; default ke `heym-opencode-workspaces` pada deployment Docker |

**Catatan:**

- Image mengekspos port `4017`
- Backend tetap internal dan diproksikan di bawah `/api`
- Saat `POSTGRES_HOST=localhost`, image rilis secara otomatis menulis ulang menjadi `host.docker.internal` bila diperlukan sehingga `.env` yang sama berfungsi dengan container PostgreSQL tingkat host pada alat macOS Docker/Desktop
- Pertahankan mount `data/files` jika Anda ingin unggahan Drive dan file yang dihasilkan skill tetap bertahan setelah container di-restart
- **Plugin:** untuk mengaktifkannya, tetapkan `HEYM_PLUGINS_ENABLED=true` dan `HEYM_PLUGIN_ADMIN_EMAILS`, serta mount `data/plugins` agar file plugin yang terpasang tetap persisten di seluruh pembuatan ulang container. Metadata plugin tersimpan di PostgreSQL Anda, sehingga juga tetap bertahan. `dependencies` pip yang dideklarasikan plugin akan dipasang ke container pada waktu instalasi; karena filesystem image bersifat ephemeral, dependensi tersebut **dipasang ulang secara otomatis saat startup** untuk setiap plugin yang terpasang (venv `uv` pada image rilis dapat ditulis, sehingga ini juga berfungsi pada image single-container)

### Memindahkan database yang ada ke named volume

`./deploy.sh --migrate-pgdata` hanya mengetahui tentang stack Compose. Jika Anda menjalankan image rilis terhadap container PostgreSQL Anda sendiri dan container tersebut me-bind-mount direktori host, migrasikan sendiri.

Periksa terlebih dahulu apa yang digunakan container database Anda:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Jika `"Type"` terbaca `bind`, pindahkan ke named volume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
# nama volume jika host Docker ini menjalankan lebih dari satu deployment Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Jalankan kembali PostgreSQL pada volume tersebut, gunakan kembali flag yang Anda miliki sebelumnya
#    tetapi ganti bind mount-nya.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Setelah menerima koneksi, bangun ulang indeks.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Gunakan image Anda sendiri pada langkah 2 dan 3, bukan `postgres:16`.** Jika database Anda menjalankan `pgvector/pgvector:pg16` atau varian lain, memulai cluster hasil salinan dengan image bawaan dapat gagal karena pustaka ekstensi yang diharapkannya tidak tersedia.

Direktori data asli Anda tidak tersentuh oleh prosedur ini, sehingga tetap menjadi jalur rollback Anda. Hapus hanya setelah memastikan database yang dimigrasikan melayani Workflow Anda. Langkah 4 penting karena alasan yang sama seperti pada migrasi Compose: salinan tersebut membawa kerusakan indeks yang ada.

---

## Menjalankan Lebih dari Satu Instance

Semua langkah di atas men-deploy satu instance Heym. Ketika satu mesin tidak lagi memadai, arahkan instance kedua ke database PostgreSQL yang sama dan instance tersebut bergabung sebagai worker: background run — cron, webhook, pemanggilan tool MCP, chat trigger — kemudian dibagi antar instance berdasarkan persentase yang Anda tetapkan di **Settings → Instances**.

Instance tidak pernah saling berkomunikasi. Postgres yang membawa beban kerja, sehingga worker tidak memerlukan port terbuka maupun rute kembali ke instance utama, dan tidak ada message broker yang terlibat. Pekerjaan yang menyentuh disk lokal — file Drive, workspace coding-agent, plugin yang terpasang — selalu berjalan pada instance utama, sehingga tidak ada yang perlu dibagikan melalui filesystem.

Dua aturan yang tidak dapat ditegakkan oleh cluster untuk Anda: setiap instance harus menggunakan `SECRET_KEY` dan `ENCRYPTION_KEY` yang sama, dan ingress harus mengarah hanya ke instance utama. Keduanya dijelaskan, bersama dengan aturan penempatan dan cara memilih persentase, di [Load Distribution](../reference/cluster.md).

> Ini adalah load distribution, bukan high availability. Instance utama tetap menjadi single point of failure untuk ingress, penyimpanan file, dan editor.

## Workflow Umum

**Setup pertama kali:**

```bash
./run.sh          # development — membuat .env dari .env.example dan menghasilkan SECRET_KEY/ENCRYPTION_KEY secara otomatis
# atau
./deploy.sh       # production — .env dan pembuatan key otomatis yang sama
```

Untuk image `docker run` yang sudah dibangun, hasilkan key secara manual terlebih dahulu (lihat bagian **Prebuilt Image** di atas).

**Perbarui production setelah perubahan kode:**

```bash
git pull
./deploy.sh       # membangun ulang image, swap tanpa downtime
```

**Periksa log production:**

```bash
./deploy.sh --logs
```

**Hentikan layanan production:**

```bash
./deploy.sh --down
```

---

## Terkait

- [Introduction](./introduction.md) – Ikhtisar platform
- [Quick Start](./quick-start.md) – Bangun Workflow pertama Anda
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referensi konfigurasi lengkap
- [Security](../reference/security.md) – Pengaturan JWT, enkripsi, dan CORS
- [Load Distribution](../reference/cluster.md) – Jalankan beberapa instance terhadap satu database
