# Showcase Kontekstual

**Contextual Showcase** adalah panduan ringan di dalam aplikasi yang menjelaskan halaman yang sedang Anda buka tanpa langsung menggiring Anda ke alur dokumentasi lengkap.

## Fungsinya

- Menampilkan ringkasan singkat untuk halaman saat ini
- Menjaga lapisan pertama tetap ringkas agar Anda tidak kebanjiran informasi
- Memungkinkan Anda memperluas sedikit detail tambahan hanya saat diperlukan
- Menautkan ke halaman dokumentasi lengkap untuk pembacaan lebih mendalam

## Tempat Kemunculannya

Pada v1, showcase tersedia di permukaan utama Heym yang terautentikasi:

- Tab Dashboard
- [Evals](../tabs/evals-tab.md)
- [Dokumentasi](../getting-started/introduction.md)
- Kanvas editor workflow

Halaman publik seperti login, register, chat portal, dan HITL review tidak menampilkan showcase.

## Akses

### Desktop

- Pemicu **Page Guide** yang tetap muncul di tepi kanan layar
- Showcase terbuka sebagai drawer sisi kanan
- Secara default tetap tertutup
- Teaser sekali tampil membantu memperlihatkan bahwa panduan ini ada tanpa memaksa membukanya

### Mobile

- Konten yang sama tersedia dari tombol mengambang **Page Guide**
- Terbuka dalam bottom sheet, bukan rail kanan

## Model Konten

Setiap entri showcase menggunakan definisi terstruktur, bukan komponen yang sepenuhnya kustom.

- **Title** – Apa halaman ini
- **Summary** – Satu penjelasan singkat
- **Bullets** – Beberapa petunjuk yang mudah dipindai
- **Highlights** – Kartu kecil untuk nilai atau pola penggunaan utama
- **More Detail** – Bagian yang diciutkan untuk konteks tambahan
- **Actions** – Biasanya satu atau dua tautan, paling sering ke dokumentasi lengkap

Hal ini menjaga sistem tetap fleksibel sekaligus menghindari panel bantuan yang panjang dan berisik.

## Kesadaran Konteks

Showcase berubah sesuai permukaan saat ini.

- Setiap tab Dashboard memiliki ringkasannya sendiri
- Editor mengarah ke [Canvas Features](./canvas-features.md)
- Halaman docs menggunakan ikhtisar dokumentasi generik dan, jika memungkinkan, mengarah ke artikel yang sedang Anda buka

## Persistensi

Showcase menyimpan sedikit status UI personal di penyimpanan browser:

- Apakah panel atau sheet terakhir kali terbuka
- Konteks halaman mana yang sudah menampilkan teaser
- Bagian detail terakhir yang diperluas per konteks

## Alasan Keberadaannya

Tujuannya adalah membuat Heym lebih mudah dipelajari tanpa menambah elemen UI yang berat.

- Panduan singkat yang selalu tersedia untuk orientasi
- Jalur yang jelas menuju dokumentasi yang lebih mendalam
- Gangguan minimal bagi pengguna berpengalaman

## Terkait

- [Tab Workflows](../tabs/workflows-tab.md) – Permukaan dashboard utama
- [Tab Evals](../tabs/evals-tab.md) – Workflow evaluasi
- [Canvas Features](./canvas-features.md) – Perilaku editor dan debugging
- [Quick Drawer](./quick-drawer.md) – Permukaan utilitas sisi kanan tetap lainnya
