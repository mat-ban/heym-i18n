# Tab Terjadwal

Tab **Terjadwal** menampilkan semua Workflow cron yang aktif pada kalender visual. Beralihlah antara tampilan hari, minggu, dan bulan untuk melihat kapan otomatisasi Anda dijadwalkan berjalan.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Tonton demo Terjadwal</a></p>

## Tampilan

- **Hari** – Linimasa per jam untuk hari yang dipilih; setiap kemunculan ditampilkan sebagai blok pada waktu terjadwalnya
- **Minggu** – Kisi tujuh kolom yang mencakup minggu berjalan; blok akan bertumpuk ketika beberapa Workflow berjalan pada jam yang sama
- **Bulan** – Kisi satu bulan penuh; setiap sel mencantumkan Workflow yang dijadwalkan berjalan pada hari tersebut

## Blok Workflow

Setiap blok menampilkan:

- **Nama Workflow** – Klik untuk membuka kanvas Workflow secara langsung
- **Ekspresi Cron** – Terlihat saat kursor diarahkan, menampilkan jadwal mentah (misalnya `0 9 * * 1-5`)

## Navigasi

Administrator instans yang terdaftar dalam `HEYM_ADMIN_EMAILS` dapat melihat jadwal setiap pemilik ketika **Tampilkan semua Workflow** dicentang. Hapus centang untuk melihat hanya Workflow miliknya sendiri. Pengguna lain tetap memiliki opsi **Tampilkan yang dibagikan kepada saya**. Untuk menghentikan otomatisasi seorang karyawan, gunakan [kontrol administrasi instans](./workflows-tab.md#instance-administration) pada pratinjau Workflows untuk menjeda atau melanjutkan Trigger.

- Gunakan panah **sebelumnya / berikutnya** untuk berpindah antar hari, minggu, atau bulan
- Tombol **Hari ini** akan kembali ke tanggal saat ini secara instan

## Terkait

- [Node Cron](../nodes/cron-node.md) – Konfigurasikan Trigger terjadwal pada kanvas
- [Tab Workflows](./workflows-tab.md) – Kelola dan atur semua Workflow
- [Tab Analytics](./analytics-tab.md) – Metrik dan tren eksekusi
