# Drive

Tab Drive menyediakan tempat terpusat untuk melihat, mengelola, dan membagikan semua file yang dihasilkan oleh skill.

## Mengakses Drive

Buka tab **Drive** di dasbor. Semua file yang dihasilkan oleh skill workflow Anda muncul di sini, diurutkan berdasarkan tanggal pembuatan.

## Daftar File

Daftar file menampilkan:

- **Name** - Nama file asli dengan ikon khusus tipe file
- **Type** - Tipe MIME file (misalnya, pdf, csv, docx)
- **Size** - Ukuran file yang mudah dibaca
- **Source** - Label node yang menghasilkan file
- **Date** - Waktu file dibuat
- **Actions** - Tombol unduh, bagikan, dan hapus

## Tindakan Massal

Setiap file yang Anda miliki memiliki kotak centang di awal barisnya. File yang dibagikan kepada Anda melalui tim bersifat hanya-baca dan tidak dapat dipilih. Pilih beberapa file (Shift-klik memilih rentang yang berurutan; kotak centang header memilih seluruh halaman) untuk menampilkan bilah tindakan massal di atas daftar, lalu klik **Bulk actions** untuk membuka satu dialog yang menerapkan pengaturan yang sama ke setiap file yang dipilih:

- **Share all with my teams** / **Remove team sharing** — mengaktifkan atau menonaktifkan berbagi tim untuk semua file yang dipilih sekaligus
- **Create share link for each file** — membuat tautan berbagi pada setiap file yang dipilih menggunakan nilai kedaluwarsa, kata sandi, dan maksimum unduhan yang sama

Dialog melaporkan berapa banyak file yang berhasil diterapkan; file yang bukan milik Anda akan dilewati. Pemilih baris per halaman (25 / 50 / 100 / **All**) di bagian bawah daftar memungkinkan Anda memuat lebih banyak file dalam satu halaman sehingga Anda dapat memilih di seluruh Drive Anda.

## Membagikan File

Klik ikon **Share** untuk membuka dialog berbagi. Anda dapat membuat beberapa tautan berbagi per file dengan konfigurasi berbeda dan secara opsional membagikan file tersebut dengan tim Anda saat ini.

### Tautan Publik (Berbasis Token)

Buat tautan berbagi tanpa kata sandi. Siapa pun yang memiliki tautan dapat mengunduh file.

### Tautan yang Dilindungi Kata Sandi (Basic Auth)

Tetapkan kata sandi saat membuat tautan berbagi. URL unduhan menggunakan HTTP Basic Authentication - browser akan meminta username (`file`) dan kata sandi saat tautan dibuka.

### Opsi Tautan

- **Expires (hours)** - Secara opsional tetapkan waktu kedaluwarsa
- **Max downloads** - Secara opsional batasi jumlah unduhan
- Keduanya dapat dikombinasikan untuk kontrol maksimal

### Bagikan Dengan Tim Saya

Aktifkan **Share with my teams** untuk memberikan akses hanya-baca ke semua tim tempat Anda saat ini menjadi anggota. Anggota tim dapat melihat dan mengunduh file dari Drive serta menggunakan operasi node Drive yang bersifat baca, tetapi hanya pemilik file yang dapat menghapus file, membuat atau mencabut tautan publik, atau mengubah batas kata sandi/TTL/unduhan.

Pengaturan ini bersifat khusus per file. Jika Anda bergabung atau membuat tim lain di kemudian hari, aktifkan kembali berbagi atau jalankan operasi `shareWithMyTeams` pada node Drive untuk menambahkan tim tersebut. Gunakan `unshareWithMyTeams` untuk menghapus berbagi tim dari file dalam sebuah workflow.

### Mengelola Berbagi

Dialog berbagi menampilkan semua tautan berbagi yang ada beserta:
- Jumlah unduhan saat ini
- Status kedaluwarsa
- Apakah Basic Auth diaktifkan
- Tombol salin dan cabut

## Tautan File di Chat & Portal

Ketika sebuah skill menghasilkan file selama eksekusi workflow melalui chat Portal atau Quick Drawer, tautan unduhan muncul secara otomatis dalam respons. Pengguna dapat mengklik untuk mengunduh langsung.

## Penyimpanan

File yang dihasilkan disimpan pada filesystem server di bawah `data/files/`. Dalam deployment Docker, direktori ini di-mount sebagai volume untuk persistensi.

## Mengelola File dari Workflow

[Node Drive](../nodes/drive-node.md) memungkinkan Anda mengelola file Drive secara programatik dari dalam sebuah workflow. Gunakan untuk:

- **List** file Anda dan mengembalikan metadata seperti nama file, tipe MIME, ukuran, sumber, dan URL unduhan
- **Delete** file setelah dikirimkan kepada pengguna
- **Share atau unshare dengan tim Anda** sehingga anggota tim dapat membaca dan mengunduhnya hanya selama berbagi tim masih ada
- **Set a password** pada tautan unduhan
- **Set a TTL** sehingga tautan kedaluwarsa setelah N jam
- **Set a max downloads** limit

Mengonversi file ke format lain adalah tugas [Node Converter](../nodes/converter-node.md), dengan `conversion: "fileConvert"`. Node ini membaca file Drive dan menyimpan hasil konversi sebagai file baru.

Rujuk file berdasarkan ID-nya dari output skill: `$agentLabel._generated_files[0].id`

Lihat [dokumentasi node Drive](../nodes/drive-node.md) untuk detail konfigurasi.

## Membaca File Drive dari Skill

Skill agen dapat mengaktifkan pembacaan Drive melalui pengaturan **Enable Drive files** pada kartu skill. Ketika diaktifkan, runtime skill menyertakan helper `heym_drive.py` yang dihasilkan. Kode skill dapat mengimpor helper seperti `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path`, dan `list_drive_files`.

Pembacaan Drive dibatasi pada file yang dapat diakses oleh aktor workflow: file yang dimiliki dan file yang dibagikan kepada aktor melalui tim. Gunakan ID file untuk pencarian yang tepat, atau nama file yang persis ketika pengguna merujuk file berdasarkan nama. Pencarian berdasarkan nama file mengembalikan file terbaru yang dapat diakses dengan nama tersebut; `list_drive_files(filename="...")` mengembalikan semua kecocokan.

## Terkait

- [Drive Node](../nodes/drive-node.md) - Operasi workflow (list, get, delete, password, TTL, max downloads, berbagi tim)
- [Drive Tab](../tabs/drive-tab.md) - Menjelajahi file di dasbor
- [File Generation](./file-generation.md) - Bagaimana `_generated_files` dan URL unduhan dihasilkan

## Pembersihan
Token berbagi yang kedaluwarsa dibersihkan secara otomatis setiap hari. File itu sendiri tetap ada hingga dihapus secara manual melalui tab Drive. Gunakan **Clear All** untuk menghapus setiap file dan tautan berbaginya dalam satu tindakan.
