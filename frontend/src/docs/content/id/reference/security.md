# Keamanan

Praktik dan konfigurasi keamanan untuk platform Heym.

## Kebijakan Kata Sandi

Semua kata sandi — saat pendaftaran dan saat mengubah kata sandi Anda — harus memenuhi persyaratan berikut:

| Aturan | Persyaratan |
|------|-------------|
| Panjang minimum | 8 karakter |
| Huruf besar | Minimal satu huruf besar (A–Z) |
| Huruf kecil | Minimal satu huruf kecil (a–z) |
| Digit | Minimal satu angka (0–9) |

Aturan-aturan ini diberlakukan pada frontend dan backend (validator Pydantic). Permintaan dengan kata sandi yang tidak memenuhi syarat akan ditolak dengan respons `422 Unprocessable Entity` sebelum terjadi penulisan apa pun ke database.

**Contoh kata sandi yang valid:** `MyWorkflow7!`

## Manajemen Sesi

- Access token disimpan dalam cookie **HttpOnly**, bukan `localStorage`. Hal ini mencegah JavaScript (termasuk payload XSS) membaca token tersebut.
- Refresh token dibatasi pada jalur `/api/auth/refresh` dan tidak dapat dikirim ke endpoint lain.
- Setiap panggilan `/api/auth/refresh` **merotasi** refresh token: token lama segera dicabut dan token baru diterbitkan. Menggunakan ulang refresh token yang sudah dipakai akan mengembalikan `401`.

## Pembatasan Laju (Rate Limiting)

Endpoint berikut dibatasi lajunya per IP:

| Endpoint | Batas | Durasi blokir |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (klien OAuth) | 5 req / 60 s | 10 min |
| Login Portal | 3 percobaan | 24 jam |

Ketika `REDIS_URL` dikonfigurasi, batas laju dibagikan ke seluruh worker backend. Tanpa konfigurasi tersebut, batas berlaku per proses worker.

## Enkripsi Kredensial

Semua API key, webhook URL, dan bearer token yang disimpan di panel [Credentials](../tabs/credentials-tab.md) dienkripsi saat disimpan (at rest) menggunakan AES-256 (Fernet) sebelum ditulis ke database. Kunci diturunkan dari variabel lingkungan `ENCRYPTION_KEY`. Skrip `run.sh` dan `deploy.sh` menghasilkan nilai yang kuat secara otomatis ketika kosong; aplikasi menolak untuk dijalankan jika `ENCRYPTION_KEY` kosong atau masih menggunakan nilai placeholder yang diketahui.

## MCP API Key

MCP API key digunakan untuk mengautentikasi klien MCP eksternal yang terhubung ke endpoint `/api/mcp/sse`. Ketika koneksi SSE terbentuk, session token berumur pendek (1 jam) diterbitkan dan disematkan pada URL endpoint pesan alih-alih API key yang sebenarnya, sehingga mencegah kunci tersebut muncul di log akses server. Lihat [MCP Tab](../tabs/mcp-tab.md) untuk penyiapan.

## OAuth / PKCE

Server otorisasi OAuth 2.0 (yang digunakan untuk klien MCP) hanya mendukung grant `authorization_code` dengan PKCE (`S256`). Formulir persetujuan menggunakan token CSRF HMAC-SHA256 yang berlaku selama 10 menit. Semua nilai yang ditampilkan di halaman persetujuan di-escape HTML.

## Execution Token

[Execution token](./execution-tokens.md) adalah JWT dengan cakupan (scoped) untuk memanggil endpoint execute suatu workflow dari sistem eksternal. Berbeda dengan token sesi pengguna, token ini:

- **Bercakupan satu workflow** — token ditolak untuk workflow lain mana pun.
- **Dapat dicabut secara independen** — mencabut token tidak berdampak pada sesi pengguna yang menerbitkannya.
- **Berumur pendek atau panjang** — pilih TTL dari 60 detik hingga 10 tahun.

Token ditandatangani dengan secret aplikasi yang sama (`SECRET_KEY`) dan diperiksa pada setiap permintaan: tanda tangan, masa berlaku, kecocokan klaim `wid`, dan status pencabutan. Lihat [Execution Tokens](./execution-tokens.md) untuk penyiapan dan referensi API.

## Keamanan Konten

Gunakan [Guardrails](./guardrails.md) pada Node LLM dan Node Agent untuk memblokir pesan pengguna yang tidak aman atau melanggar kebijakan sebelum mencapai model. Guardrails mendukung sembilan kategori konten (kekerasan, ujaran kebencian, konten seksual, dan lain-lain) dengan tingkat sensitivitas yang dapat dikonfigurasi.

## Sandbox Python Tool

Python tool yang ditentukan pengguna pada [Node Agent](../nodes/agent-node.md) menjalankan kode yang tidak tepercaya. Secara default, Heym menjalankan setiap tool di dalam kontainer Docker sekali pakai yang diperketat dengan:

- tanpa akses jaringan,
- filesystem root hanya-baca dengan direktori kerja `tmpfs` berukuran kecil,
- pengguna non-root dengan semua kapabilitas Linux dihapus dan `no-new-privileges`,
- batas CPU, memori, dan PID yang ketat, serta
- **tanpa Docker socket** yang di-mount, sehingga tool tidak dapat menjangkau daemon Docker host.

Backend eksekusi dikendalikan oleh variabel lingkungan `HEYM_PYTHON_TOOL_SANDBOX`:

| Nilai | Perilaku |
|-------|----------|
| `auto` (default) | Jalankan di dalam kontainer Docker yang diperketat. Jika Docker tidak tersedia, eksekusi **gagal secara tertutup (fails closed)** — tidak menjalankan kode tidak tepercaya secara diam-diam tanpa isolasi OS. |
| `docker` | Sama seperti `auto`, tetapi tidak pernah melakukan fallback. |
| `subprocess` | Jalankan di subprocess lokal dalam proses yang dijaga oleh allowlist impor. Ini **bukan batas keamanan** dan hanya ditujukan untuk kode tepercaya atau pengembangan lokal. `run.sh` memilihnya untuk pengembangan native. |

Setel `HEYM_PYTHON_TOOL_IMAGE` untuk mematok image sandbox; ketika kosong, Heym mendeteksi otomatis image backend yang sedang berjalan. Pembatasan dalam proses (allowlist impor ditambah pemfilteran atribut dan introspeksi) diterapkan sebagai pertahanan berlapis, tetapi kontainer adalah batas isolasi yang sebenarnya — pertahankan mode default `auto` (atau `docker`) untuk deployment multi-pengguna dan produksi.
## Skill Sandbox

Skill Python yang dilampirkan pada [Node Agent](../nodes/agent-node.md) juga menjalankan kode yang tidak tepercaya — sebuah skill dapat diterima secara verbatim di dalam Workflow yang dibagikan atau template dengan visibilitas `everyone` — sehingga skill dijalankan melalui sakelar `HEYM_PYTHON_TOOL_SANDBOX` yang **sama** dengan tool Python dan gagal secara tertutup dengan cara yang sama. Container skill dikeraskan secara identik (non-root, seluruh capability dihapus, `no-new-privileges`, filesystem root hanya-baca, batas CPU/memori/PID, dan **tanpa Docker socket**), dengan dua perbedaan yang disengaja karena skill memang membutuhkannya secara sah:

- **Egress jaringan diizinkan** (skill memanggil API dan memasang dependensinya sendiri melalui `uv`), dan
- **workspace yang dapat ditulis di-mount** agar skill dapat menghasilkan file output dan membaca file Heym Drive.

Workspace dibagikan dengan container saudara sekali-pakai melalui volume Docker bernama yang sama yang digunakan oleh Codex runner (`heym-codex-workspaces`, di-mount pada `/app/data/codex-workspaces`). Hanya subdirektori milik run ini sendiri yang di-mount ke container saudara — melalui `volume-subpath` per-run — sehingga satu skill tidak akan pernah melihat data workspace milik run lain atau milik Codex. Docker Compose stack selalu me-mount volume ini; `docker run` single-container harus menyertakan `-v heym-codex-workspaces:/app/data/codex-workspaces` untuk skill Python maupun Codex. Jika volume tidak ada dalam mode `auto`/`docker`, eksekusi skill **gagal secara tertutup** alih-alih berjalan di backend. Karena mount subpath per-run memerlukan **Docker Engine 25.0 atau lebih baru**, engine yang lebih lama sebaiknya melakukan upgrade atau menjalankan skill tepercaya dengan `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Hanya variabel environment portabel non-rahasia (pengaturan proxy dan CA-bundle, locale) yang diteruskan ke dalam container; URL database, `SECRET_KEY`/`ENCRYPTION_KEY`, API key provider, dan secret OAuth ditahan oleh allowlist. Jalur file skill divalidasi agar tetap berada di dalam workspace, dan symlink yang ditanam di direktori output (termasuk sentinel `_hitl_request.json`) tidak pernah diikuti. Timpa nilai default dengan `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS`, dan `HEYM_SKILL_USER` jika diperlukan.

Seperti halnya tool, mode `subprocess` menjalankan skill di dalam proses backend dan **bukan merupakan batas keamanan** — gunakan hanya untuk single-user tepercaya atau pengembangan lokal (`run.sh` memilihnya untuk pengembangan native).

## Code Node Sandbox

[Node Code](../nodes/code-node.md) menjalankan Python milik pengguna secara arbitrer bersama dengan dependensi pihak ketiga yang arbitrer, sehingga ia merupakan yang paling ketat di antara ketiga sandbox dan satu-satunya yang **tanpa escape hatch**: ia tidak membaca variabel mode sandbox apa pun, tidak memiliki mode `subprocess`, dan gagal secara tertutup ketika tidak ada daemon Docker yang dapat dijangkau. Ia tidak pernah jatuh kembali untuk menjalankan kode pengguna di dalam proses backend.

Eksekusi berupa satu atau dua container sekali-pakai, keduanya dikeraskan seperti sandbox tool dan skill (non-root, seluruh capability dihapus, `no-new-privileges`, filesystem root hanya-baca, batas CPU/memori/PID, dan **tanpa Docker socket**):

- Dengan `requirements.txt` yang kosong, **satu container dengan `--network none`** menjalankan kode. Runner tiba di dalam payload stdin container, sehingga tidak ada yang di-mount sama sekali.
- Dengan dependensi, container pertama memasangnya dengan akses jaringan ke direktori `.deps` per-run, dan container kedua me-mount subtree tersebut **hanya-baca** dan menjalankan kode. Container eksekusi tidak memiliki jaringan kecuali opsi `codeAllowNetwork` pada Node diaktifkan.

Dependensi dipasang dengan `uv`, dicoba ulang dengan `pip`, dan tidak pernah di-cache antar run. Ketika backend berjalan di dalam container, direktori per-run berada pada volume `heym-codex-workspaces` yang sama dengan yang digunakan sandbox skill, di-mount melalui `volume-subpath` per-run sehingga satu run tidak akan pernah melihat file milik run lain; bentuk ini memerlukan **Docker Engine 25.0 atau lebih baru**. Backend native (`./run.sh`) tidak memiliki volume tersebut dan tidak membutuhkannya — direktori per-run-nya adalah jalur temporer lokal yang di-bind-mount langsung ke container saudara. Apa pun caranya, direktori tersebut dihapus setelah setiap eksekusi terlepas dari hasilnya.

Hanya variabel environment portabel non-rahasia yang diteruskan ke dalam container — pengaturan proxy, CA bundle, dan locale, yang dibutuhkan instalasi dependensi untuk menjangkau PyPI di balik proxy korporat. URL database, `SECRET_KEY`/`ENCRYPTION_KEY`, API key provider, dan secret OAuth ditahan oleh allowlist, sehingga secret backend yang baru akan dihilangkan secara default alih-alih bocor sampai seseorang memperbarui denylist. `HOME` milik backend tidak pernah menimpa jalur yang dapat ditulis milik sandbox itu sendiri.

Tombol **Format** menggunakan sandbox yang sama. Ruff mem-parsing dan menulis ulang kode sumber alih-alih mengeksekusinya, tetapi menjalankannya di host backend akan memberikan file yang tidak tepercaya sebuah proses yang mewarisi seluruh environment backend, sehingga ia mendapatkan container `--network none` sekali-pakai tersendiri dengan batas yang sama dan environment allowlist yang sama. Ia gagal secara tertutup tanpa Docker alih-alih memformat di host.

Batas sandbox berupa konstanta, bukan variabel environment — 512 MB memori, satu CPU, 256 proses, timeout instalasi 120 detik, dan timeout eksekusi 60 detik. Image diresolusi dari rantai `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` yang sudah ada; Node ini tidak memperkenalkan konfigurasi tersendiri.
## Terkait

- [Menjalankan & Deployment](../getting-started/running-and-deployment.md) – Konfigurasikan `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER`, dan `HEYM_PYTHON_TOOL_SANDBOX` saat startup
- [Node Code](../nodes/code-node.md) – Eksekusi Python dalam sandbox dengan dependensinya sendiri
- [Node Agent](../nodes/agent-node.md) – Tool Python kustom yang berjalan di dalam sandbox
- [Token Eksekusi](./execution-tokens.md) – JWT dengan cakupan untuk memanggil Workflow dari sistem eksternal
- [Guardrails](./guardrails.md) – Blokir konten tidak aman pada Node LLM dan Node Agent
- [Pengaturan](./user-settings.md) – Ubah kata sandi Anda
- [Tab Credentials](../tabs/credentials-tab.md) – Kelola API key
- [Tab MCP](../tabs/mcp-tab.md) – MCP API key dan klien OAuth
- [Portal](./portal.md) – Kontrol akses portal chat publik
