# Tab Analytics

Tab **Analytics** menampilkan metrik eksekusi dan tren untuk Workflow Anda. Pantau penggunaan, performa, dan identifikasi hambatan.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Tonton demo Analytics</a></p>

## Statistik Ringkasan

- **Total eksekusi** – Jumlah eksekusi Workflow dalam periode yang dipilih
- **Tingkat keberhasilan** – Persentase eksekusi yang berhasil
- **Durasi rata-rata** – Rata-rata waktu eksekusi
- **Waktu yang dihemat** – Total estimasi waktu yang dihemat: menit-yang-dihemat-per-eksekusi yang dikonfigurasi pada setiap Workflow × eksekusi yang berhasil, dijumlahkan pada rentang waktu yang dipilih
- **Tren** – Indikator naik/turun dibandingkan periode sebelumnya

## Rentang Waktu

- **24j** – 24 jam terakhir
- **7h** – 7 hari terakhir
- **30h** – 30 hari terakhir
- **Semua** – Seluruh riwayat yang tersedia

## Filter Workflow

- Filter metrik berdasarkan Workflow tertentu
- **Semua Workflow** – Agregasi dari seluruh Workflow

## Tabel

Dua tabel menampilkan penggunaan Workflow: **Paling Banyak Digunakan** (lebih lebar) dan **Paling Banyak Gagal**.

- **Waktu yang Dihemat** – Paling Banyak Digunakan menampilkan total waktu yang dihemat per Workflow (menit yang dihemat per eksekusi × eksekusi yang berhasil). **Belum Diatur** berarti estimasi belum tersedia; klik untuk membuka kolom tersebut pada Workflow.
- **Kolom yang dapat diurutkan** – Klik header kolom untuk mengurutkan berdasarkan kolom tersebut. Klik lagi untuk beralih antara menaik/menurun. Indikator panah menunjukkan arah pengurutan.
- **Label seluler** – Pada layar kecil, label kolom dipersingkat (misalnya "Executions" → "Runs", "Success" → "OK", "Error" → "Err") agar tabel muat tanpa perlu menggulir secara horizontal.

## Grafik

- **Volume Eksekusi dari Waktu ke Waktu** – Grafik garis eksekusi per interval waktu
- **Tingkat Keberhasilan vs Kesalahan** – Grafik area yang membandingkan eksekusi yang sehat dan yang gagal
- **Latensi Rata-rata dari Waktu ke Waktu** – Grafik garis yang menunjukkan perubahan waktu respons
- **Seret untuk memilih** – Klik dan seret pada grafik mana pun untuk memfokuskan rentang tanggal khusus
- **Mode pemilihan** – Rentang yang dipilih akan menyegarkan kartu ringkasan, grafik, dan tabel Workflow tanpa mengubah preset dasar
- **Hapus Pilihan** – Kembali ke jendela waktu preset setelah selesai menelusuri

## Auto Refresh

- Aktifkan auto refresh untuk menjaga metrik tetap terbarui tanpa memuat ulang secara manual

## Terkait

- [Tab Workflows](./workflows-tab.md) – Workflow yang diukur
- [Tab Traces](./traces-tab.md) – Inspeksi trace secara detail
- [Tab Logs](./logs-tab.md) – Log runtime untuk debugging
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk tampilan dashboard

Ketika sebuah grafik menunjukkan tren yang ingin Anda ketahui secara otomatis alih-alih dipantau, ubah menjadi [alert](./alerts-tab.md): jumlah kesalahan, durasi eksekusi, pengeluaran LLM, dan jumlah eksekusi semuanya dapat diberikan ambang batas pada jendela waktu tertentu.
