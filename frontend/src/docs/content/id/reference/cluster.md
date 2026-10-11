# Distribusi Beban

Arahkan instance Heym kedua ke database PostgreSQL yang sama dan instance tersebut akan bergabung sebagai worker. Proses workflow di latar belakang kemudian dibagi di antara instance-instance tersebut berdasarkan persentase yang Anda tetapkan, sehingga mesin yang melayani UI dan API tidak lagi menjadi satu-satunya mesin yang menjalankan setiap workflow.

Instance-instance tersebut tidak pernah saling berkomunikasi. Postgres yang membawa pekerjaan tersebut, sehingga worker tidak memerlukan port terbuka, sertifikat, maupun rute kembali ke instance utama — hanya akses database.

## Peran

Satu instance berperan sebagai **main**, yang ditetapkan melalui environment variable. Instance ini melayani UI, API, MCP, dan portal chat, serta memiliki penyimpanan file dan plugin yang terpasang. Setiap instance lainnya berperan sebagai **worker**: instance tersebut hanya menjangkau database dan menjalankan proses di latar belakang.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # atau: worker
HEYM_INSTANCE_NAME=EU Main    # label tampilan, dapat diubah nanti dari Settings
HEYM_INSTANCE_ID=eu-main      # opsional; diturunkan dari nama saat kosong
```

Peran main terpisah dari leader election. Heym sudah memilih satu leader di seluruh cluster untuk memiliki cron, evaluasi alert, dan crash recovery; jika main mati, kepemimpinan berpindah ke worker dalam beberapa detik dan proses terjadwal tetap berjalan. Peran main tidak berpindah, karena penyimpanan file tidak dapat berpindah bersamanya.

## Apa yang dapat meninggalkan instance main

Penempatan ditentukan dari node workflow sebelum proses dimulai. Suatu proses tetap berada di main ketika ada node di dalamnya — termasuk node di dalam sub-workflow yang dipanggilnya — menyentuh sesuatu yang hanya ada di satu mesin:

| Node | Alasan tetap berada di main |
|---|---|
| Codex, OpenCode Go | Workspace coding-agent tetap berada di disk lokal agar tindak lanjut dapat dilanjutkan di dalamnya |
| Agent dengan skill yang terpasang | Kode skill membaca dan menulis ke Heym Drive |
| Drive, Converter, Google Drive | Node-node ini membaca dan menulis file yang dihasilkan |
| Trigger File Upload | File yang diunggah mendarat di disk main |
| Send Email | Relay SMTP korporat umumnya hanya mengizinkan satu alamat sumber |
| Node plugin | Plugin terpasang di disk salah satu instance |

**Semua node lainnya didistribusikan** — termasuk node Code, Playwright, dan Agent Python tools. Setiap instance menjalankan image yang sama dengan Docker socket-nya sendiri, sehingga sandbox bukan alasan untuk mempertahankan suatu proses di main, dan node-node tersebut adalah node yang paling boros CPU dalam produk ini.

Workflow yang sub-workflow-nya dipilih melalui ekspresi tidak dapat diperiksa terlebih dahulu, sehingga tetap berada di main.

## Memilih persentase

Bobot adalah bilangan bulat yang ditetapkan di **Settings → Instances**. Bobot tersebut adalah **bagian dari instance mana pun yang saat ini dapat mengambil pekerjaan**, bukan persentase dari 100: scheduler membaginya dengan total pool itu sendiri.

Perbedaan ini langsung terlihat begitu satu instance keluar. Dengan `Main 41, Worker A 26, Worker B 33`, menonaktifkan Worker B menyisakan pool sebesar 67, sehingga Main sebenarnya menerima 41/67 = **61%** dan Worker A 26/67 = **39%**. Panel menampilkan pembagian efektif di bawah tabel justru karena alasan ini, dan penyimpanan tidak pernah diblokir hanya karena angka-angkanya tidak berjumlah 100 — hanya pembagian di mana tidak ada instance yang aktif memiliki bobot yang ditolak.

Ada dua hal lagi yang mudah keliru.

**Persentase bukanlah bagian dari kekuatan mesin.** Persentase hanya mencakup proses yang melewati antrean. Melayani UI dan API, menjalankan editor dan portal secara streaming, serta menangani unggahan file semuanya adalah pekerjaan main dan tidak ada yang dihitung. Main mengerjakan lebih banyak daripada yang ditunjukkan angkanya.

**Persentase main adalah batas atas, bukan batas bawah.** Proses yang hanya dapat dijalankan di main dibebankan pada kuotanya, sehingga setelah kuota tersebut habis, sisa proses yang dapat didistribusikan jatuh ke worker. Menetapkan angka main yang rendah itu aman — pekerjaan yang harus dijalankan di sana tetap dijalankan. Menetapkannya terlalu tinggi akan membuat worker kelaparan.

Jadi dengan main yang kuat dan worker yang lebih kecil, mulailah mendekati 60/40 daripada rasio mentah mesinnya, lalu bandingkan durasi proses yang sebenarnya di tab Traces dan sesuaikan.

Bobot dinormalisasi ulang di antara instance yang saat ini aktif dan diaktifkan. Dengan `main=70, A=15, B=15`, jika A offline, pembagiannya menjadi 70/85 dan 15/85 antara main dan B, dan kembali ke 70/15/15 saat A kembali.

**Instance yang kembali tidak berhak atas proses yang terlewat.** Waktu yang dihabiskan dalam status Offline, Disabled, atau pada versi yang tidak cocok tidak dihitung terhadapnya, sehingga worker yang tidak tersedia selama satu malam bergabung kembali pada posisi pool saat itu dan pembagiannya kembali terbaca 70/30 sejak proses pertamanya — worker tersebut tidak menyerap setiap proses sampai ia mengejar ketertinggalan. Worker yang tersedia sepanjang waktu tetap mengejar ketertinggalan, dan itulah yang menjadikan persentase main sebagai batas atas.

### Instance baru bergabung pada nilai nol

Instance yang belum pernah diberi bobot dimulai dari 0, yang akan membuatnya berstatus Live, Enabled, tetapi tidak menerima apa pun. **Beri instance baru bagian secara otomatis** — aktif secara default, di bawah tabel instances — memperbaiki hal itu: pada pass berikutnya oleh leader, pendatang baru diberi bagian yang setara dari pool, dan bobot yang ada diperkecil dengan tetap mempertahankan rasio satu sama lain, sehingga 70/30 yang disengaja tetap terbaca sekitar 70/30 setelahnya. Totalnya tetap tepat 100.

Proses ini berjalan **sekali per instance**. Baik pass otomatis maupun pengeditan Anda sendiri menandai instance sebagai telah dikonfigurasi, sehingga instance yang Anda tetapkan sendiri tidak pernah diubah di belakang Anda — termasuk instance yang sengaja Anda tetapkan ke 0. Nonaktifkan pengaturan ini jika Anda lebih suka setiap mesin baru menunggu Anda.

Hanya instance yang aktif, live, dan kompatibel yang ikut serta. Memberikan bagian kepada mesin yang tidak dapat menjalankan apa pun akan membuat bagian tersebut terbengkalai.
### Ketika persentase tidak dapat membantu

Panel pengaturan melaporkan berapa banyak dari eksekusi 24 jam terakhir yang hanya dapat dijalankan di main. Jika angka tersebut tinggi — beban kerja yang berat Codex atau berat Drive — para worker akan menganggur apa pun yang dikatakan oleh bobot, dan solusinya adalah instance main yang lebih besar, bukan lebih banyak instance.

## Menentukan ukuran PostgreSQL untuk sebuah cluster

Koneksi berskala seiring jumlah instance, bukan hanya pengguna. Setiap instance menjalankan beberapa proses uvicorn, dan setiap proses memegang connection pool ditambah empat koneksi `LISTEN` (pembatalan, kebangkitan antrean, hasil eksekusi, aliran chat). Aliran chat yang terbuka berbagi satu koneksi chat, sehingga tidak menambah koneksi database. Cluster dengan tiga instance pada `max_connections = 100` bawaan akan kehabisan koneksi, dan Heym kemudian gagal menjangkau database-nya sendiri.

Perkirakan kira-kira `instances x processes x (async pool + sync pool + 4)` dan tetapkan `max_connections` di atasnya.

Perkecil pool-nya alih-alih hanya menaikkan batas atasnya. Satu deployment secara bawaan menggunakan 10+20 koneksi async dan 5+10 koneksi sync per proses, yang cukup longgar untuk satu mesin dan terlalu besar untuk sebuah cluster:

| Variabel | Instance tunggal | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Contoh file compose menetapkan nilai-nilai tersebut dan `max_connections = 300`. Hal itu menurunkan batas atas 768 koneksi untuk cluster dua instance menjadi 192, dengan tiga instance masih di bawah 300.

## Persyaratan yang tidak dapat ditegakkan oleh cluster untuk Anda

**Setiap instance harus menggunakan `SECRET_KEY` dan `ENCRYPTION_KEY` yang sama.** Worker dengan `ENCRYPTION_KEY` yang berbeda tidak dapat mendekripsi kredensial, dan setiap eksekusi yang menggunakan kredensial akan gagal dengan error yang tidak menyebutkan hal yang berguna. Heym membandingkan digest dari kedua kunci pada setiap heartbeat, bersama dengan versi aplikasi dan revisi database, dan menandai instance yang tidak cocok sebagai **Mismatch** sehingga tidak menerima pekerjaan sama sekali. Beban kembali ke main sampai Anda memperbaikinya.

Hal itu juga menentukan urutan upgrade. Melakukan upgrade pada main terlebih dahulu menandai setiap worker sebagai tidak kompatibel; pekerjaan kembali ke main, dan setiap worker bergabung kembali saat di-upgrade. Lebih lambat, terlihat, dan dapat dibalik.

**Arahkan ingress hanya ke instance main.** Melakukan round-robin lalu lintas pengguna ke seluruh instance akan mengirim unggahan file ke satu mesin dan unduhannya ke mesin lain. Tidak ada apa pun dalam kode yang mencegah hal ini, karena worker menjalankan image yang sama dan akan menjawab setiap permintaan yang diterimanya.

**Setiap instance memerlukan `FRONTEND_URL`, yang diatur ke alamat publik yang sama.** Eksekusi yang berhenti untuk peninjauan manusia membuat tautan peninjauannya pada instance yang menjalankannya, bukan pada main, dan hal yang sama berlaku untuk tautan lanjutan Codex dan untuk URL unduhan file yang dihasilkan. Worker yang dibiarkan tanpa variabel ini akan membangun tautan tersebut terhadap alamat lokalnya sendiri, dan siapa pun yang menerimanya tidak dapat membukanya.

**Instance worker memiliki IP keluar yang berbeda.** Setiap API yang memasukkan alamat sumber ke allowlist akan melihat IP yang baru. Send Email dijalankan di main justru karena alasan ini; untuk node HTTP, berikan cluster alamat egress NAT tunggal atau masukkan setiap instance ke allowlist.

## Menambahkan worker di mesin lain

`docker-compose.worker.yml` di root repositori menjalankan worker di host-nya sendiri. File ini tidak memiliki database dan tidak memiliki UI: ia menjangkau PostgreSQL instance main dan mengambil bagiannya dari eksekusi latar belakang.

Isi `.env` di sebelahnya - tag image, host dan kredensial database, kedua kunci, dan id instance - lalu jalankan. Compose menolak untuk mulai sampai setiap nilai yang diperlukan diatur, alih-alih muncul dengan placeholder yang gagal kemudian dengan cara yang sulit dibaca.

Tag image harus berupa versi yang dijalankan main, dan kedua kunci harus disalin persis. Perbedaan pada salah satunya akan menampilkan worker sebagai Mismatch dan ia tidak menerima pekerjaan.

## Membaca tabel Instances

| Kolom | Arti |
|---|---|
| Name | Label yang dapat diedit; label ini dicap pada setiap eksekusi yang dijalankan instance ini |
| Role | `main` atau `worker`, dari environment |
| Status | **Live** dengan heartbeat yang baru, **Offline** setelah 30 detik tanpa sinyal, **Mismatch** ketika versi, revisi database, atau kunci berbeda dari milik main |
| ms | Waktu pulang-pergi dari instance tersebut ke database, diukur oleh instance itu sendiri |
| On | Keluarkan worker dari rotasi tanpa menghentikannya — eksekusi yang sedang berjalan diselesaikan, tidak ada eksekusi baru yang ditugaskan. Terkunci aktif untuk instance main: pekerjaan file, plugin, dan coding-agent dijalankan di sana apa pun yang dikatakan toggle |
| Weight | Bagiannya dari eksekusi yang dapat didistribusikan |

## Riwayat eksekusi

Setiap eksekusi dalam riwayat eksekusi menyebutkan instance yang menjalankannya, dan kedua dialog riwayat dapat difilter hingga satu instance. Filter mencocokkan berdasarkan id instance sambil menampilkan namanya, sehingga mengganti nama instance tidak menulis ulang apa yang dikatakan eksekusi lama.

Tidak ada hal ini yang muncul pada instalasi instance tunggal: field-nya kosong, tidak ada label yang ditampilkan, dan tidak ada filter yang disediakan.
## Perilaku kegagalan

**Jika worker mati di tengah proses**, heartbeat-nya menjadi usang dan proses recovery sweep milik leader yang sudah ada akan menjalankan ulang eksekusi pada instance yang masih hidup. Baris antrean yang telah diklaimnya akan dihentikan secara terpisah: setelah tidak ada eksekusi aktif untuknya dan masa tenggang dua menit telah berlalu, leader akan menggagalkan baris tersebut dan membangunkan siapa pun yang sedang menunggu hasilnya. Usia saja tidak pernah menjadi pemicunya, sehingga proses yang memang berjalan lama akan dibiarkan; dan baris tersebut digagalkan alih-alih dimasukkan kembali ke antrean, karena recovery sudah menangani proses jalankan ulang dan memasukkan kembali ke antrean akan menjalankan workflow yang sama dua kali.

**Jika main mengalami gangguan**, cron tetap berjalan dari worker dan proses yang dapat didistribusikan tetap dieksekusi. Proses yang membutuhkan main akan mengantre dan menunggu, lalu diproses saat main kembali — tetapi hanya dalam jendela tenggang misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, secara default 600 detik). Apa pun yang lebih lama akan ditutup sebagai dilewati, dengan alasan yang tercatat, alih-alih memutar ulang tumpukan pekerjaan berjam-jam sekaligus.

UI, API, MCP, dan editor tidak tersedia selama main mengalami gangguan, karena ingress mengarah ke sana.

## Terkait

- [Running & Deployment](../getting-started/running-and-deployment.md) – Deploy satu instance terlebih dahulu; variabel lingkungan dan penyiapan kunci ada di sana
- [Settings](./user-settings.md) – Tab Instances, dan siapa yang dapat melihatnya
- [Traces](../tabs/traces-tab.md) – Bandingkan durasi proses nyata antar instance sebelum mengubah pembagian
- [Security](./security.md) – Mengapa setiap instance harus berbagi `SECRET_KEY` dan `ENCRYPTION_KEY`
