# Quick Drawer

**Quick Drawer** adalah panel eksekusi cepat di sisi kanan untuk workflow. Panel ini muncul pada halaman-halaman yang telah terautentikasi seperti [Workflows tab](../tabs/workflows-tab.md) pada dashboard, Docs, dan Evals.

## Akses

- Klik pemicu tetap **Quick / Workflows** di tepi kanan-tengah layar
- Ketika [Contextual Showcase](./contextual-showcase.md) juga tersedia, pemicu **Page Guide**-nya berada di atas Quick Workflows
- Drawer terbuka dari sisi kanan dan menggeser halaman saat ini ke kiri dengan rescale yang halus
- Pada perangkat mobile, Quick Drawer disembunyikan
- Drawer tidak ditampilkan pada workflow editor, login/register, portal, atau halaman tinjauan HITL

## Pencarian Workflow

Gunakan kolom filter di bagian atas drawer untuk mencari workflow berdasarkan:

- Nama workflow
- Deskripsi workflow

Pencarian tidak peka huruf besar/kecil dan memperbarui daftar secara langsung.

## Workflow yang Disematkan

Sematkan workflow untuk menjaganya tetap di bagian atas drawer.

- Workflow yang disematkan muncul di bagian tersendiri di atas daftar lengkap
- Pin baru ditambahkan ke bagian atas
- Urutan pin dipertahankan di seluruh pemuatan ulang dalam penyimpanan browser

## Menjalankan Workflow

Pilih workflow untuk membuka formulir input-nya.

- Kolom input ditampilkan secara vertikal sesuai urutan drawer
- Klik **Run Workflow** untuk mengeksekusi workflow yang dipilih
- Klik **Stop Workflow** untuk membatalkan eksekusi yang sedang berjalan dari drawer
- Workflow tanpa kolom Input tetap dapat dijalankan secara langsung

Drawer menggunakan API eksekusi workflow yang sama dengan permukaan eksekusi Heym lainnya, sehingga output dan perilaku runtime tetap konsisten.

Menghentikan eksekusi dari drawer juga membatalkan eksekusi backend yang aktif, termasuk tugas browser Playwright yang sedang berjalan untuk eksekusi workflow tersebut.

## Progres dan Hasil

Setelah memulai eksekusi, drawer menampilkan:

- Progres langkah secara streaming untuk node saat mulai dan selesai
- Status akhir: `success`, `error`, atau `pending`
- Output akhir dalam panel JSON yang ringkas
- Entri riwayat yang ditandai dengan `Quick Drawer`

`pending` berarti workflow sedang menunggu tindakan selanjutnya seperti tinjauan manusia.

## Penyimpanan Browser

Quick Drawer menyimpan preferensi pribadi di `localStorage`:

- ID workflow yang disematkan
- Workflow yang terakhir dipilih

Drawer **tidak** menyimpan nilai input pada versi ini.

## Cakupan

Quick Drawer sengaja dirancang sebagai permukaan eksekusi yang ringan.

- Termasuk: pencarian, penyematan, pemilihan, input, eksekusi, progres, hasil
- Tidak termasuk: pembuatan workflow, pengeditan, pengelolaan folder, dan tindakan canvas

## Terkait

- [Workflows Tab](../tabs/workflows-tab.md) – Daftar workflow utama, folder, dan pengelolaan
- [Quick Start](../getting-started/quick-start.md) – Bangun dan jalankan workflow pertama Anda
- [Execution History](./execution-history.md) – Tinjau eksekusi sebelumnya
- [Webhooks](./webhooks.md) – Memicu workflow melalui HTTP
- [Contextual Showcase](./contextual-showcase.md) – Rel panduan tingkat halaman yang melengkapi Quick Drawer
