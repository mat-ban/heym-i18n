# Dashboard

Tab **Dashboard** adalah ruang bergaya Grafana tempat Anda membangun kisi-kisi widget chart. Setiap widget dirender dari output Workflow Heym tersembunyinya sendiri, sehingga data apa pun yang dapat Anda hasilkan dalam sebuah Workflow — kueri database, panggilan API, pencarian RAG, output LLM — dapat menjadi sebuah chart. Anda dapat menyimpan beberapa dashboard dan membagikan masing-masing kepada orang atau tim.

## Dashboard

Setiap orang memulai dengan satu dashboard, yang dibuat saat pertama kali mereka membuka tab ini. Gunakan pemilih dashboard di bagian atas tab untuk beralih antar dashboard, dan **+** di sebelahnya untuk membuat dashboard baru. Pemilih tersebut mencantumkan dashboard milik Anda terlebih dahulu, lalu dashboard yang dibagikan kepada Anda, dengan label nama orang yang membagikannya.

Tab akan membuka kembali dashboard yang terakhir Anda gunakan, dan address bar memuat dashboard yang sedang terbuka (`?tab=dashboard&dashboard=<id>`), sehingga sebuah tautan akan membuka dashboard tersebut secara persis bagi siapa pun yang memiliki akses.

Tombol pengaturan (hanya untuk pemilik) berfungsi untuk mengganti nama dashboard, mengelola pembagian, dan menghapusnya. Menghapus dashboard akan menghapus widget-widgetnya beserta Workflow-nya. Anda selalu menyimpan setidaknya satu dashboard milik sendiri, sehingga dashboard terakhir tidak dapat dihapus.

## Widget

Widget adalah satu chart pada kisi. Jenis chart yang didukung:

- **Bar** (vertikal atau horizontal)
- **Line**
- **Area** (tren terisi, mendukung beberapa seri)
- **Pie**
- **Table** (dapat digulir)
- **Numeric** (satu nilai KPI dengan unit opsional)
- **Gauge** (satu nilai terhadap rentang min–maks, misalnya persentase)
- **Scatter** (titik X/Y untuk plot korelasi)
- **Proportion** (satu bar yang dibagi menjadi beberapa bagian dengan legenda persentase, misalnya rincian bahasa)
- **Bar gauge** (satu gauge horizontal per baris dengan gradien merah→hijau dan sebuah nilai, misalnya ruang disk kosong)
- **Text** (pesan markdown, misalnya catatan status seperti "Last execution at 19:47"; mendukung [interactive checkboxes](../nodes/chart-output-node.md#interactive-task-lists) ketika markdown bersifat statis, dan [explicit numbered lists](../nodes/chart-output-node.md#numbered-lists) untuk penomoran kustom atau menurun)
- **HITL** (tinjauan human review Anda yang tertunda. Header menampilkan `1/n pending`. Nama Workflow membuka run tersebut di canvas. **Approve**, **Request changes**, dan **Reject** menyelesaikannya. Ikon riwayat di samping judul widget membuka run tersebut dalam dialog riwayat di halaman ini. Widget ini tidak menggunakan baris upstream, dan setiap orang melihat antreannya sendiri)

Setiap widget memuat datanya secara asinkron saat Anda membuka tab, sehingga halaman tetap responsif selama chart terisi.

## Menambahkan widget

1. Klik **Add widget**, beri judul, dan pilih jenis chart. Di bawah pemilih, dialog menampilkan contoh jenis chart tersebut dengan data sampel dan menyebutkan baris yang diharapkannya, sehingga Anda dapat membandingkan jenis sebelum membangun apa pun.
2. Widget terbuka di editor Workflow dengan graf awal: Node [Set](../nodes/set-node.md) yang menghasilkan baris, terhubung ke Node [Chart Output](../nodes/chart-output-node.md). Ganti Node Set dengan sumber data apa pun. Widget **HITL** hanya berupa Node Chart Output; widget ini membaca tinjauan Anda yang tertunda dan tidak memerlukan sumber data.
3. Bangun Workflow sehingga Node yang mengisi **Chart Output** menghasilkan array baris, lalu konfigurasikan pemetaan field Node Chart Output (field label, field nilai, dan sebagainya).
4. Simpan, kembali ke tab Dashboard, dan widget akan dirender.

Klik dua kali pada widget (atau gunakan tombol edit-nya) untuk membuka kembali Workflow-nya kapan saja. Gunakan **Clone widget** di header widget untuk menduplikasi widget beserta Workflow lengkapnya. Salinan ditempatkan di bawah aslinya dan diberi label **(Copy)** sehingga Anda dapat mengeditnya secara independen.

## Menghasilkan widget dengan AI

Klik **AI**, deskripsikan metrik yang Anda inginkan (misalnya, "workflow success rate over the last 30 days as a bar chart"), lalu pilih kredensial LLM dan model. Heym menghasilkan Workflow widget lengkap yang diakhiri dengan Node Chart Output dan menambahkannya ke kisi. Lihat [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) untuk contoh Prompt per jenis chart.

Gunakan tombol **Fine-tune with AI** pada widget untuk merevisi widget yang sudah ada dengan instruksi baru. Setiap fine-tune AI mengambil snapshot Workflow sebelumnya ke dalam **Edit History** widget, sehingga Anda dapat meninjau atau mengembalikan perubahan dari editor Workflow.

## Mengedit tata letak

Aktifkan **Edit** untuk masuk ke mode edit, tempat Anda dapat menyeret widget dan mengubah ukurannya pada kisi 12 kolom. Perubahan tata letak disimpan secara otomatis. Judul widget dapat diedit secara inline dari header widget.

## Caching dan refresh

Setiap widget menyimpan cache data terakhir yang dihitung di server selama time-to-live (TTL) yang dapat dikonfigurasi. Selama cache masih segar, membuka kembali dashboard akan menyajikan hasil yang tersimpan alih-alih menjalankan ulang Workflow. Cache diganti di tempat setiap kali data dihitung ulang (satu cache per widget), dan secara otomatis dibatalkan ketika Anda mengedit Workflow widget.

Gunakan tombol **Refresh** pada widget (atau **Refresh** di toolbar) untuk melewati cache dan menghitung ulang segera.
## Berbagi

Pemilik membagikan dashboard dari pengaturannya, kepada pengguna individual (melalui email) atau kepada [tim](teams-tab.md) mana pun yang mereka ikuti. Setiap pembagian bersifat **Read** atau **Write**; apabila seseorang memiliki pembagian personal sekaligus pembagian tim, yang lebih kuat yang berlaku.

| Tindakan | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| Melihat widget, menyegarkannya, menggunakan auto-refresh | ✓ | ✓ | ✓ |
| Menambah, menggandakan, menghapus, mengganti nama, dan mengubah ukuran widget; AI generate dan fine-tune; mencentang item checklist | ✓ | ✓ | |
| Membuka Workflow sebuah widget di editor | ✓ | ✓ | |
| Mengganti nama atau menghapus dashboard, mengelola pembagian | ✓ | | |

**Widget selalu berjalan sebagai pemilik dashboard.** Siapa pun yang melihatnya, sebuah widget menggunakan kredensial dan variabel global milik pemilik, dan eksekusinya muncul di riwayat eksekusi serta trace milik pemilik. Dengan demikian, rekan tim melihat data yang sama tanpa akses ke akun di baliknya, dan setiap penampil berbagi satu hasil yang di-cache per widget. Widget yang ditambahkan atau digandakan oleh kolaborator dengan akses write juga menjadi milik pemilik.

Oleh karena itu, **Write** membawa tingkat kepercayaan yang sama dengan membagikan Workflow untuk diedit: kolaborator dengan akses write dapat mengubah apa yang berjalan dengan kredensial Anda. Berikan hanya kepada orang yang Anda izinkan mengedit Workflow Anda. Test run yang dimulai kolaborator dari editor Workflow menggunakan kredensial mereka sendiri, seperti pada Workflow yang dibagikan pada umumnya; hanya dashboard itu sendiri yang berjalan sebagai pemilik. **Read** tidak memberikan akses apa pun ke Workflow widget, dan penampil read-only menerima chart itu sendiri tetapi bukan detail eksekusi per-Node di baliknya.

Menghapus pembagian, atau menurunkannya dari write menjadi read, berlaku segera.

## Terkait

- [Node Chart Output](../nodes/chart-output-node.md)
- [Tab Analytics](analytics-tab.md) — metrik eksekusi bawaan (berbeda dari dashboard buatan pengguna)
