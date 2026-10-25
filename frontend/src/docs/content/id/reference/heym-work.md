# Heym Work

**Heym Work** adalah antarmuka kedua untuk tim bisnis yang dibangun di atas Heym. Pengguna mendeskripsikan suatu pekerjaan dengan kata-kata sendiri, menjawab beberapa pertanyaan, dan memperoleh workflow yang telah dibangun serta diuji oleh Heym. Mereka bekerja dari halaman khusus yang dibuat untuk kebutuhan tim, memproses tinjauan, dan memantau setiap eksekusi lengkap dengan nama pemulainya. Heym menjalankan setiap pekerjaan di latar belakang.

Heym Work berjalan sebagai kontainer mandiri berdampingan dengan Heym, dengan lisensi terpisah dari tim Heym. Pelajari lebih lanjut dan ajukan uji coba di [heym.run/enterprise](https://heym.run/enterprise). Tonton [video Heym Work](https://youtu.be/5Z2gGo6bcpU) untuk tur singkat berdurasi dua menit.

## Manfaat bagi Tim Bisnis

| Area | Fungsi |
|------|--------|
| **Chat** | Deskripsikan pekerjaan melalui teks atau suara. Heym menanyakan data yang dibutuhkan, menyusun workflow, mengujinya, dan menandainya sebagai Terverifikasi. |
| **Flows** | Editor membangun flow dari pilihan daripada canvas: apa yang memulainya, draf AI opsional, dan tindakan di Slack, Google Sheets, dan email. Jawaban dari Slack melanjutkan eksekusi, dan persetujuan juga menunggu di Aktivitas. Lihat [Flows](#flows). |
| **Halaman** | Halaman widget yang disematkan: angka ringkasan, grafik, tabel dengan label status, area unggah berkas, dan persetujuan. Baris tabel dapat membuka halaman rincian tersendiri. |
| **Persetujuan** | Tinjauan dari langkah [Human-in-the-Loop](./human-in-the-loop.md) menunggu di Aktivitas dan pada halaman, dengan opsi Setujui, Minta Perubahan, dan Tolak. |
| **Aktivitas** | Setiap eksekusi, disertai nama orang yang memulainya dan instans yang menjalankannya. |
| **Peran** | Pemilik, Editor, dan Pelihat. Masuk dilakukan melalui [Single Sign-On](./sso.md) yang sudah digunakan oleh Heym. |
| **Edisi Industri** | Edisi hukum, pendidikan, keuangan, logistik, energi, dan niaga elektronik hadir dengan halaman siap pakai, data sampel, serta workflow khusus industri. |

## Flows

**Flows** ada di menu Heym Work untuk Editor dan Pemilik. Flow dibuat dari pilihan alih-alih node, dan Heym Work menyimpannya sebagai workflow Heym biasa melalui Heym API, atas nama orang yang membuatnya. Aturan akses, riwayat edit, dan sinkronisasi trigger Heym berlaku seperti di editor, dan setiap eksekusi muncul di Aktivitas seperti yang lainnya.

| Bagian | Pilihan |
|---|---|
| **Apa yang memulainya** | Sesuai permintaan, berdasarkan jadwal, pada pesan Slack, saat tab Google Sheets berubah (baris ditambahkan, diubah, atau dihapus), atau saat email mencapai kotak masuk. Trigger spreadsheet dan email memeriksa setiap 1, 5, 15, atau 60 menit. |
| **Draf AI** (opsional) | Model dan instruksi mengubah apa yang memulai flow menjadi teks untuk langkah-langkah setelahnya. Flow yang tidak dimulai dari spreadsheet atau email dapat membaca pesan Slack terbaru dari saluran atau utas terlebih dahulu. |
| **Apa yang terjadi selanjutnya** | Tindakan secara berurutan, di salah satu dari tiga alat, apa pun yang memulai flow. **Slack:** pesan saluran, pesan langsung, formulir, pesan dengan tombol, persetujuan, balasan utas, pembaruan pesan, dan hasil akhir. **Google Sheets:** tambahkan baris, atau perbarui baris yang berubah. **Email:** kirim email. |

- **Jawaban melanjutkan eksekusi.** Persetujuan, tombol, atau formulir menjeda eksekusi hingga seseorang menjawab di Slack. Persetujuan juga menunggu di Aktivitas, dan keputusan di salah satu tempat menghapus tombol dari pesan Slack. Langkah Slack selanjutnya tetap berada di utas pesan pertama.
- **Satu kartu Koneksi.** Setiap flow menunjukkan ruang kerja Slack, akun Google Sheets, dan kotak masuk tempat ia membaca dan mengirim. Itu adalah kredensial Heym: **Slack Bot** (token bot, `xoxb-…`), **Google Sheets**, **IMAP**, dan **SMTP**; kredensial yang hilang dapat ditambahkan langsung dari flow itu sendiri.
- **Satu aplikasi Slack untuk setiap flow.** Di aplikasi Slack, setel URL Permintaan Interaktivitas ke `https://<Heym Anda>/api/slack/interactions/<id kredensial>` dan URL Permintaan Langganan Peristiwa ke `https://<Heym Anda>/api/slack/events/<id kredensial>`. Heym Work menampilkan keduanya untuk koneksi yang dipilih. Semua flow pada kredensial tersebut membagikannya.
- **Trigger Slack memilih apa yang mereka dengar:** pesan di saluran dan DM, pesan langsung ke bot, sebutan bot, atau pesan di satu saluran. Postingan bot itu sendiri tidak pernah memulai flow.
- **Persyaratan.** Flows memerlukan Heym 0.0.131 atau yang lebih baru.

Langkah-langkah yang dibangun flow adalah node yang sama yang dapat Anda gunakan di canvas: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), dan [Cron](../nodes/cron-node.md).

## Menghubungkan Heym Work

Tonton [video instalasi](https://youtu.be/zXGfg1HPSLk) untuk panduan konfigurasi menyeluruh, dari perintah awal hingga halaman beranda.

Koneksi dikonfigurasi pada menu **Pengaturan → Heym Work**. Tab ini hanya muncul untuk administrator instans yang terdaftar dalam `HEYM_ADMIN_EMAILS`.

| Kolom | Fungsi |
|-------|--------|
| **Alamat Heym Work** | Lokasi Heym Work berjalan, misalnya `https://work.example.com`. Pengguna akan diarahkan kembali ke alamat ini setelah masuk. Klik **Simpan**. |
| **Kunci integrasi** | Tombol **Buat kunci** menghasilkan kunci yang digunakan Heym Work untuk setiap permintaan ke Heym. Kunci ditampilkan satu kali saja dengan tombol salin. Heym hanya menyimpan nilai hash-nya. |
| **Aktifkan Heym Work** | Mengaktifkan koneksi. Memerlukan alamat dan kunci terlebih dahulu. |
| **Edisi industri dan tim** | Edisi hukum, pendidikan, keuangan, logistik, energi, dan e-commerce, ditambah edisi TI, penjualan, pemasaran, dan SDM untuk tim perusahaan, terbuka dengan halaman, data sampel, dan workflow untuk pekerjaan tersebut. |

Selanjutnya buka alamat Heym Work dan selesaikan konfigurasinya:

1. **Lisensi**: masukkan kunci lisensi dari tim Heym.
2. **Heym**: masukkan alamat Heym dan kunci integrasi.
3. **Pemilik**: masuk dengan akun yang terdaftar sebagai Pemilik Heym Work.

Halaman beranda terbuka dan siap digunakan oleh tim.

### Rotasi Kunci

Pilihan **Putar kunci** menggantikan kunci integrasi. Heym Work berhenti berfungsi hingga kunci baru dimasukkan di sana, dan seluruh pengguna yang sedang masuk di Heym Work akan dikeluarkan. Gunakan opsi ini jika kunci dicurigai bocor atau ada personel yang memiliki akses kunci meninggalkan organisasi.

### Menonaktifkan Koneksi

Matikan sakelar **Aktifkan Heym Work** untuk memutus koneksi. Heym Work kemudian akan meminta kunci Heym kembali. Heym akan tetap menjalankan seluruh workflow, jadwal, dan webhook dalam situasi apa pun.

## Model Keamanan

- **Setiap perubahan melalui Heym.** Heym Work membaca data yang ditampilkan dari basis data Heym dan mengirim setiap tindakan ke Heym melalui saluran yang dilindungi kunci, tempat Heym menerapkan aturan aksesnya sendiri. Heym Work menyimpan datanya dalam skema terpisah `heym_work`.
- **Kunci di-hash saat disimpan.** Heym membandingkan nilai hash dari kunci yang diberikan dan tidak pernah menyimpan kunci dalam format teks polos.
- **Autentikasi tetap berada di Heym.** Pengguna masuk melalui Heym menggunakan penyedia identitas organisasi Anda saat [SSO](./sso.md) aktif.
- **Perubahan diaudit.** Menyimpan konfigurasi dan memutar kunci menuliskan catatan `work_integration.update` dan `work_integration.key_rotate` ke dalam [log audit](./audit.md).

## Lisensi

Heym Work memerlukan kunci lisensi tersendiri yang diterbitkan oleh tim Heym. Setiap hari Heym Work mengirimkan ID lisensi, ID instalasi, jumlah pengguna aktif selama 30 hari terakhir, total anggota, jumlah eksekusi dalam 24 jam terakhir, serta versi Heym dan Heym Work ke heym.run. Konten workflow, input, output, dan kredensial tetap tersimpan sepenuhnya di server lokal Anda.

Jika sinkronisasi harian gagal selama 30 hari, masa tenggang 14 hari akan dimulai, setelah itu antarmuka Heym Work akan meminta kunci kepada Pemilik. Masa uji coba berlaku hingga hari terakhir dan aktif kembali setelah diperpanjang oleh tim Heym (hanya diperbolehkan satu masa uji coba per instalasi). Heym sendiri tetap berjalan tanpa gangguan sepanjang waktu. Jaringan tanpa akses internet menggunakan lisensi offline melalui enterprise@heym.run.

## Video

Semua video Heym Work tersedia dalam [daftar putar Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Topik Terkait

- [Enterprise](./enterprise.md): Lisensi komersial dan dukungan teknis
- [Single Sign-On](./sso.md): Mekanisme autentikasi yang digunakan Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Tinjauan persetujuan di Heym Work
- [Pencatatan Audit](./audit.md): Entri log yang dihasilkan dari perubahan koneksi
- [Pengaturan](./user-settings.md): Lokasi tab Heym Work
