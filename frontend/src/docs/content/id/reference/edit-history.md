# Riwayat Pengeditan

Riwayat Edit melacak versi tersimpan dari sebuah workflow. Gunakan fitur ini untuk melihat perubahan dari waktu ke waktu, membandingkan versi, atau mengembalikan ke keadaan sebelumnya.

**Catatan:** Riwayat Edit berbeda dari [Riwayat Eksekusi](./execution-history.md). Riwayat Edit melacak **penyimpanan** (perubahan struktur workflow); Riwayat Eksekusi melacak **proses berjalan** (eksekusi sebelumnya).

## Lokasi Menemukannya

**Toolbar editor** → **Riwayat Edit** (ikon GitBranch)

## Versi

Versi baru dibuat setiap kali Anda **Menyimpan** workflow. Daftar ini menampilkan:

- **Saat Ini** – Keadaan tersimpan terbaru (yang Anda lihat di kanvas)
- **Versi N** – Penyimpanan sebelumnya beserta stempel waktu

Versi yang tidak memiliki perubahan dibandingkan versi sebelumnya akan disembunyikan.

## Tampilan Diff

Pilih sebuah versi untuk melihat apa yang berubah dibandingkan dengan workflow saat ini:

| Jenis Perubahan | Deskripsi |
|-------------|--------------|
| **Node** | Node yang ditambahkan, dihapus, atau dimodifikasi |
| **Edge** | Koneksi yang ditambahkan, dihapus, atau dimodifikasi |
| **Config** | Pengaturan tingkat workflow (auth, batas laju, dll.) |

Perluas setiap perubahan untuk melihat diff tingkat field (misalnya properti node mana yang berubah).

## Pratinjau

Untuk melihat tampilan workflow pada versi sebelumnya, klik **Pratinjau** di samping Kembalikan.

Kanvas hanya-baca akan terbuka menampilkan node dan edge dari versi tersebut. Anda dapat menggeser dan memperbesar untuk menjelajahi tata letaknya; tidak ada perubahan yang dapat dilakukan dari tampilan ini.

## Kembalikan

Untuk memulihkan versi sebelumnya:

1. Pilih versi yang Anda inginkan
2. Klik **Kembalikan**
3. Konfirmasi tindakan tersebut
4. Workflow saat ini digantikan dengan versi yang dipilih; halaman akan dimuat ulang

Mengembalikan akan membuat keadaan "saat ini" yang baru—Anda dapat mengembalikan lagi jika diperlukan.

## Hapus Riwayat

Klik ikon tempat sampah di header dialog untuk menghapus semua riwayat versi. Tindakan ini tidak dapat dibatalkan. Workflow saat ini tetap ada; hanya versi sebelumnya yang dihapus.

## Kapan Versi Dibuat

Versi hanya dibuat ketika Anda **Menyimpan** (Ctrl/Cmd+S atau tombol Simpan). Perubahan yang belum disimpan tidak disimpan dalam Riwayat Edit hingga Anda menyimpannya.

Edit pada Agent skill disertakan dalam snapshot ini. Untuk menelusuri atau memulihkan satu skill tanpa mengembalikan seluruh workflow, gunakan tombol **Riwayat** pada kartu skill tersebut di panel properti Node Agent. Lihat [Node Agent](../nodes/agent-node.md#skill-history).

## Terkait

- [Riwayat Eksekusi](./execution-history.md) – Proses berjalan sebelumnya dan Bring to Canvas
- [Struktur Workflow](./workflow-structure.md) – Format node dan edge
- [Tab Workflows](../tabs/workflows-tab.md) – Membuat dan mengelola workflow
