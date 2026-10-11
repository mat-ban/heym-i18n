# Tab Alerts

Tab **Alerts** memungkinkan Anda menentukan kondisi ambang batas (threshold) dalam suatu rentang waktu (time window) dan diberi tahu saat kondisi tersebut terlampaui. Heym telah mencatat hasil eksekusi, durasi proses, dan pengeluaran LLM, tetapi tidak pernah menyampaikannya secara proaktif. Alert adalah cara Anda memintanya.

Setiap alert dievaluasi dalam **time window** yang Anda pilih, tidak pernah berdasarkan satu peristiwa tunggal. Satu eksekusi gagal hanyalah noise. Dua belas eksekusi gagal dalam sepuluh menit adalah sebuah insiden.

## Jenis Alert

| Jenis | Pertanyaan yang dijawab | Asal angka |
|---|---|---|
| **Error threshold** | Apakah ini gagal lebih dari N kali dalam window? | Baris [Execution history](../reference/execution-history.md) dengan status error |
| **Workflow duration** | Apakah eksekusi menjadi lebih lambat dari yang diharapkan dalam window? | Waktu eksekusi, diagregasi sebagai max, average, atau persentil ke-95 |
| **Token / USD cost** | Apakah pengeluaran melewati anggaran dalam window? | [LLM traces](./traces-tab.md) ditambah tabel biaya LLM |
| **Execution count** | Apakah ini berjalan jauh lebih sering dari seharusnya? | Jumlah baris execution history |

### Error threshold

Menghitung eksekusi yang gagal di seluruh window dan terpicu saat jumlahnya mencapai threshold Anda. Karena menghitung dalam suatu window alih-alih memantau setiap kegagalan, satu error sementara tidak akan memicu notifikasi kepada Anda.

### Workflow duration

Mengukur durasi eksekusi di dalam window. Pilih **max** (eksekusi paling lambat), **average**, atau **p95**. Angka p95 menggunakan perhitungan persentil yang sama dengan [Analytics tab](./analytics-tab.md), sehingga alert dan grafik latensi tidak akan pernah berbeda untuk window yang sama.

**Minimum runs in the window** menjaga hal ini tetap akurat. Eksekusi paling lambat dalam window yang hampir kosong hanyalah eksekusi tunggal tersebut, sehingga menetapkan minimum, misalnya 3, mencegah alert terpicu karena noise.

### Token / USD cost

Menjumlahkan pengeluaran LLM di seluruh window, baik sebagai total token maupun dalam dolar AS. Jumlah dolar dihitung melalui tabel harga yang sama dengan yang digunakan [Traces tab](./traces-tab.md) dan [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table), sehingga alert biaya dan halaman biaya selalu konsisten.

Ketika cakupannya adalah semua Workflow Anda, ini mencakup panggilan LLM yang dilakukan di luar Workflow, seperti [Chat tab](./chat-tab.md) dan [AI Assistant](../reference/ai-assistant.md). Penggunaan coding agent (Codex, OpenCode) tidak termasuk.

Model yang tidak memiliki baris harga dilaporkan dalam konteks alert sebagai unpriced alih-alih dihitung sebagai nol secara diam-diam.

### Execution count

Menghitung eksekusi dengan status apa pun dalam window. Inilah yang menangkap Trigger yang bermasalah: Workflow yang biasanya berjalan 20 kali per jam tiba-tiba berjalan 2.000 kali. Catatan pemicuan mencakup rincian per sumber Trigger, karena biasanya itulah jawaban atas "mengapa ini terjadi".

## Scope

Sebuah alert memantau **satu Workflow** atau **semua Workflow Anda**.

"Semua Workflow Anda" berarti setiap Workflow yang dapat diakses oleh pemilik alert. Ini sengaja tidak berarti setiap Workflow pada instance Heym: alert dapat dibagikan, dan membagikan alert tidak boleh memberikan seseorang angka agregat untuk Workflow yang tidak dapat mereka buka.

## Wizard

Membuat alert melalui lima langkah.

1. **Type** — pilih salah satu dari empat jenis di atas.
2. **Scope** — satu Workflow, atau semuanya.
3. **Condition** — time window, ditambah field threshold untuk jenis tersebut.
4. **Response** — apa yang dijalankan saat terpicu, dan seberapa sering terus memberi tahu Anda.
5. **Review** — beri nama, dan lihat backtest.

### Backtest

Langkah Review menjawab pertanyaan yang benar-benar penting sebelum Anda menyimpan: *selama 24 jam terakhir, seberapa sering ini akan terpicu?*

Ini melaporkan jumlah pemicuan dan nilai tertinggi yang teramati terhadap threshold Anda. Jika dikatakan kondisi tersebut akan terpicu 400 kali, Anda memperbaiki threshold sebelum menyimpan alih-alih setelah menerima notifikasi. Anda dapat memperlebar lookback menjadi 3 atau 7 hari.

## AI Drafting

Di bagian atas langkah pertama terdapat kotak tempat Anda mendeskripsikan apa yang Anda inginkan dalam bahasa sehari-hari:

> Warn me if the invoice sync fails more than 5 times in 10 minutes

Heym mengubahnya menjadi definisi alert, mengisi setiap langkah yang dapat diisi, dan melompat ke depan dengan field yang diisi AI ditandai, sehingga Anda mengonfirmasi alih-alih mengetik ulang. Permintaan yang lengkap akan membawa Anda ke Review.

**Permintaan yang sebagian tetap membawa Anda maju.** Katakan hanya "warn me if it fails 5 times" dan Anda mendapatkan alert error threshold dengan jumlah yang telah diisi, default untuk sisanya, dan wizard terbuka pada langkah pertama yang masih membutuhkan Anda: dalam kasus ini Scope, karena tidak ada Workflow yang disebutkan. Catatan di bagian atas menyebutkan apa yang masih perlu diputuskan. Ini tidak pernah memblokir Next atau Create.

Hal yang sama berlaku ketika model menyebutkan Workflow yang tidak dapat Anda akses, atau mengembalikan kondisi dengan field yang hilang. Bagian yang masuk akal dipertahankan, sisanya kembali ke default untuk jenis alert tersebut, dan Anda menyesuaikannya dari sana. Tidak ada yang melewati validasi di sini: aturan wizard itu sendiri dan API keduanya memeriksa ulang alert saat Anda menyimpan.
## Perilaku Pengulangan

Setelah sebuah alert terpicu, alert tersebut memasuki status triggered. Apa yang terjadi selanjutnya adalah pilihan Anda pada langkah 4.

- **Notify sekali, hingga pulih** (default) — terpicu sekali, lalu tetap tenang selama kondisi masih terpenuhi. Ketika metrik kembali turun di bawah threshold, alert kembali ke OK dan menjadi memenuhi syarat untuk terpicu lagi. Pemulihan adalah perubahan status, bukan sebuah event: pemulihan tidak membuat firing record dan tidak menjalankan workflow notify.
- **Tetap notify pada interval tertentu** — terpicu lagi setiap N menit selama kondisi masih terpenuhi.

Default ini ada karena workflow yang rusak dan diperiksa setiap 60 detik akan menghasilkan 60 firing per jam, yang justru membuat alerting di-mute.

## Menjalankan Workflow saat Firing

Langkah 4 menawarkan tiga jawaban atas "apa yang harus terjadi ketika ini terpicu":

- **Buat dan tetapkan workflow baru** (default) — menyimpan alert juga membuat workflow bernama *"&lt;alert name&gt; notification"* dan menautkannya. Workflow tersebut hadir dengan input node yang field-nya persis seperti payload di bawah, sehingga `$alert.body.observed_value` dan lainnya langsung ter-resolve dan Anda hanya perlu melampirkan Node yang mengirimkan pesan. **Go to workflow** pada kartu alert akan membukanya. Ini adalah default karena alert yang terpicu tanpa tindakan apa pun mudah terlewat.
- **Pilih workflow yang sudah ada** — jalankan sesuatu yang sudah Anda buat sebelumnya.
- **Lakukan apa pun** — firing tetap tercatat di tab, hanya saja tidak menjalankan apa pun.

Payload alert masuk sebagai input body workflow tersebut:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Workflow mana yang menghasilkan angka tersebut

`workflows` adalah satu-satunya tempat sebuah workflow muncul. Field ini mencantumkan setiap workflow yang berkontribusi terhadap pembacaan, masing-masing dengan `value`-nya sendiri — jumlah error, jumlah run, run terlambat dalam milidetik, atau spend workflow tersebut, tergantung pada tipe alert. Daftar ini diurutkan berdasarkan `value`, tertinggi lebih dulu, sehingga `workflows[0]` adalah penyebab terburuk.

Field ini **selalu berupa array**: satu elemen pada scope satu workflow, banyak elemen pada "all my workflows", dan kosong alih-alih null ketika tidak ada yang dapat diatribusikan. Workflow notify dapat mengiterasinya tanpa perlu memeriksa bentuknya.

Secara sengaja tidak ada `workflow_id` tunggal. Field tersebut mendeskripsikan scope alert, bukan metriknya, sehingga bernilai `null` pada scope sistem, yang justru merupakan kasus di mana pertanyaan "workflow mana?" paling penting. `observed_value` tetap merupakan agregat yang dibandingkan dengan threshold; field `value` per workflow menjelaskan dari mana angka tersebut berasal.

Beginilah cara alert menjangkau Slack, email, Telegram, atau ke mana pun: dengan [Node](../reference/node-types.md) yang sudah Anda miliki, bukan dengan sistem notifikasi terpisah.

Sebuah alert tidak dapat menotify workflow yang sedang dipantaunya. Hal itu akan menjadi loop, yang paling jelas terlihat pada alert jumlah eksekusi di mana setiap notifikasi menambah jumlah yang diukurnya.

Run notify adalah eksekusi biasa, sehingga muncul di [execution history](../reference/execution-history.md) seperti run lainnya. Workflow notify yang gagal tercatat pada firing tersebut tetapi tidak pernah mencegah firing itu sendiri untuk tercatat.

Workflow notify berjalan sebagai pemilik alert, dengan credentials dan global variables miliknya, persis seperti jika pemilik tersebut menjalankannya sendiri. Memilih workflow yang dibagikan kepada Anda tidak meminjam credentials orang tersebut. Jika pemilik kehilangan akses ke workflow notify, firing tetap tercatat tetapi run notify dilewati.

## Riwayat Firing

Di bawah daftar alert terdapat riwayat firing: apa yang terpicu, kapan, nilai yang diamati terhadap threshold, jendela waktu persis yang dievaluasi, dan hasil notify.

Mengakui sebuah firing akan menandai baris tersebut dan mengubah badge alert dari **Firing** menjadi **Acknowledged**. Itu adalah pernyataan tentang Anda, bukan tentang alert: kondisinya masih terpenuhi, dan alert kembali ke **OK** dengan sendirinya ketika metrik turun kembali di bawah threshold.

Setiap record menyimpan detail kontribusi pada saat firing terjadi: id eksekusi yang gagal dan pesan error, spend per model, atau rincian sumber trigger. Ini disengaja. Jendela waktunya sudah berlalu, dan menghitungnya ulang di kemudian hari dapat memberikan hasil yang berbeda.

Firing record disimpan selama 90 hari.

## Bertanya kepada Chat tentang Alert

[Tab Chat](./chat-tab.md) dapat menjawab pertanyaan tentang alert Anda:

- "Alert apa saja yang saya miliki?"
- "Apakah ada alert pada workflow invoice?"
- "Mengapa alert biaya terpicu?"
- "Kapan terakhir kali ini terpicu?"

Untuk pertanyaan "mengapa ini terpicu", Chat mengutip nilai yang diamati sebenarnya, threshold, dan jendela waktu dari firing record, beserta detail kontribusinya.

## Berbagi

Alert dapat dibagikan kepada pengguna individual atau kepada [tim](./teams-tab.md). Orang yang Anda bagikan dapat melihat alert dan riwayat firing-nya. Hanya pemilik yang dapat mengedit, menjeda, menghapus, atau membagikan ulang alert tersebut.
### Ketika akses workflow dihapus

Alert pada satu workflow akan terus membaca metrik run workflow tersebut, sehingga menghapus akses seseorang ke workflow juga menentukan apa yang terjadi pada alert miliknya di workflow itu:

- **Menghapus share pengguna atau tim** akan menanyakan kepada pemilik workflow apakah alert pengguna atau tim tersebut pada workflow juga harus dihentikan. Penghentian adalah default. Alert yang dihentikan akan dijeda, bukan dihapus, dan setiap alert dicatat sebagai `alert.disable_on_access_revoke` di [audit log](../reference/audit.md).
- **Menghapus anggota tim atau menghapus tim** selalu menghentikan alert yang terdampak, karena orang yang melakukan perubahan tersebut belum tentu merupakan pemilik workflow.
- Alert hanya dihentikan ketika pemiliknya tidak memiliki jalur lain ke workflow tersebut, seperti share langsung atau tim lain.
- Melanjutkan atau menguji alert yang dijeda akan memeriksa ulang akses pemiliknya, sehingga alert yang dihentikan tidak dapat diaktifkan kembali atau digunakan untuk membaca metrik workflow tanpa akses. Menekan **Resume** tanpa akses akan menampilkan notifikasi yang menjelaskan bahwa pemilik workflow harus membagikannya kembali terlebih dahulu.

## Mengelola Alert

- **Pause / Resume** — alert yang dijeda tidak pernah dievaluasi. Resume akan memeriksanya segera alih-alih menunggu interval berikutnya.
- **Edit** — perubahan divalidasi secara keseluruhan, sehingga edit parsial tidak dapat meninggalkan alert dalam keadaan tidak valid.
- **Delete** — menghapus alert beserta riwayat firing-nya.

## Lihat Juga

- [Tab Analytics](./analytics-tab.md) — grafik yang menjadi sumber ambang batas ini
- [Tab Traces](./traces-tab.md) — asal angka biaya LLM
- [Riwayat Eksekusi](../reference/execution-history.md) — run yang diukur oleh alert error, durasi, dan jumlah
- [Tab Chat](./chat-tab.md) — menanyakan alert dalam bahasa alami
- [Tim](./teams-tab.md) — membagikan alert dengan tim
