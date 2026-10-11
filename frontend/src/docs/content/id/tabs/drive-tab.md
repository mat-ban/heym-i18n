# Tab Drive

Tab Drive menampilkan semua file yang dihasilkan oleh skill di seluruh Workflow Anda.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Tonton demo Drive</a></p>

## Ikhtisar

File yang dihasilkan oleh skill (PDF, DOCX, CSV, gambar, dan lain-lain) secara otomatis disimpan dan ditampilkan dalam tab Drive. Setiap file menampilkan nama, tipe, ukuran, Node sumber, tanggal pembuatan, dan status berbagi tim.

## Fitur

- **Pencarian** - Filter file berdasarkan nama, tipe, atau Node sumber
- **Salin ID file** - Salin UUID file ke clipboard, siap ditempelkan ke Node [Drive](../nodes/drive-node.md) atau [Converter](../nodes/converter-node.md)
- **Unduh** - Unduhan terautentikasi untuk file Anda dan file yang dibagikan kepada Anda melalui tim
- **Bagikan** - Buat tautan unduhan yang dapat dibagikan dengan perlindungan kata sandi dan masa berlaku opsional, atau bagikan file secara hanya-baca dengan tim Anda saat ini
- **Hapus** - Hapus file dan tautan berbaginya
- **Hapus Semua** - Hapus setiap file dan tautan berbaginya setelah konfirmasi
- **Tindakan massal** - Pilih beberapa file dengan kotak centang (Shift-klik untuk memilih rentang) dan terapkan tindakan yang sama ke semuanya sekaligus
- **Penomoran halaman** - Telusuri koleksi file yang besar, dengan pemilih jumlah baris per halaman (25 / 50 / 100 / Semua)

## Tindakan Massal

File yang Anda miliki menampilkan kotak centang di awal barisnya (file yang dibagikan kepada Anda melalui tim bersifat hanya-baca dan tidak dapat dipilih). Pilih beberapa baris — atau gunakan kotak centang header untuk memilih seluruh halaman, dan **Shift-klik** untuk memilih rentang — lalu gunakan bilah tindakan massal yang muncul di atas daftar:

- **Unduh ZIP** menggabungkan setiap file yang dipilih ke dalam satu arsip ZIP dan mengunduhnya
- **Tindakan massal** membuka satu dialog untuk menerapkan satu pengaturan ke setiap file yang dipilih:
  - **Bagikan semua dengan tim saya** / **Hapus berbagi tim** dalam satu klik
  - **Buat tautan berbagi untuk setiap file** menggunakan pengaturan kata sandi, masa berlaku, dan batas unduhan yang sama
- **Hapus** menghapus setiap file yang dipilih dan tautan berbaginya setelah konfirmasi
- **Hapus pilihan** membatalkan pilihan semuanya

Dialog melaporkan berapa banyak file yang diterapkan (file yang bukan milik Anda akan dilewati). Gunakan opsi **Semua** pada pemilih jumlah baris per halaman untuk memuat setiap file dalam satu halaman dan memilih di seluruh Drive Anda. Mengetik di kotak pencarian secara otomatis mengalihkan pemilih jumlah baris per halaman ke **Semua** sehingga pencarian mencakup setiap file, bukan hanya halaman saat ini; menghapus pencarian akan memulihkan pilihan Anda sebelumnya.

## Berbagi

Buat tautan berbagi dengan:
- **Tanpa autentikasi** - URL unduhan publik berbasis Token
- **Basic Auth** - Tautan yang dilindungi kata sandi (nama pengguna: `file`)
- **Masa berlaku** - Masa berlaku berbasis waktu opsional
- **Batas unduhan** - Jumlah unduhan maksimum opsional

Aktifkan **Bagikan dengan tim saya** pada suatu file agar file tersebut terlihat oleh semua tim tempat Anda saat ini menjadi anggotanya. Anggota tim yang dibagikan mendapatkan akses hanya-baca; tindakan pengelolaan tetap hanya untuk pemilik.

## Akses Skill Agen

Skill pada Node Agent dapat memilih untuk membaca file Drive. Saat **Aktifkan file Drive** diaktifkan untuk suatu skill, kode Python-nya dapat membaca file Drive yang dapat diakses berdasarkan ID file atau nama file yang persis melalui helper `heym_drive.py` yang dihasilkan. Pengaturan ini nonaktif secara bawaan.

Lihat [Referensi Drive](../reference/drive.md) untuk detail lengkap.

## Terkait

- [Node Drive](../nodes/drive-node.md) - Tampilkan file, ambil metadata, bagikan dengan tim, atau ubah batasan berbagi dari Workflow
- [Pembuatan File](../reference/file-generation.md) - Bagaimana skill menghasilkan file
- [Referensi Drive](../reference/drive.md) - Tautan berbagi, Token, dan pembersihan
- [Portal](../reference/portal.md) - Tautan file dalam respons obrolan portal
