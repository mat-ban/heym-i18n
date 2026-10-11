# DataTable

Tab **DataTable** memungkinkan Anda membuat dan mengelola tabel data terstruktur langsung di Heym. Tabel dapat digunakan dalam Workflow melalui [Node DataTable](../nodes/datatable-node.md) untuk operasi CRUD secara programatik.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Tonton demo DataTable</a></p>

## Membuat Tabel

1. Buka tab DataTable dari dasbor
2. Klik **Create DataTable**
3. Masukkan nama dan deskripsi opsional
4. Tambahkan kolom dengan editor kolom

## Kolom

Setiap kolom memiliki:

| Properti | Deskripsi |
|----------|-------------|
| Name | Nama tampilan kolom |
| Type | `string`, `number`, `boolean`, `date`, atau `json` |
| Required | Apakah baris baru harus menyertakan kolom ini |
| Unique | Apakah nilai harus unik di seluruh baris |
| Default Value | Terisi otomatis saat baris tidak menyertakan kolom ini |

Tambahkan, edit, atau hapus kolom dari header tampilan detail tabel.

## Membuat Kolom dengan AI

Alih-alih menambahkan kolom secara manual, Anda dapat mendeskripsikan tabel dalam bahasa alami (atau menempelkan contoh JSON) dan membiarkan LLM mengusulkan skema. Kedua titik masuk membuka dialog yang sama:

- **Generate with AI** (header daftar DataTable) — membuat tabel baru dari deskripsi Anda.
- **AI columns** (tampilan detail tabel, di samping kontrol kolom) — mengusulkan kolom *baru* untuk ditambahkan ke tabel yang sedang Anda buka.

### Cara kerjanya

1. Pilih **LLM credential** dan **model** (default ke LLM credential pertama Anda dan model terbarunya).
2. Ketik deskripsi — misalnya *"Tabel buku dengan judul, penulis, jumlah halaman, dan apakah sudah saya baca"* — atau tempelkan contoh/skema JSON.
3. Klik **Generate**. Model akan mengembalikan skema yang disarankan.
4. Tinjau kolom yang dihasilkan dalam formulir yang dapat diedit: ubah **name**, **type**, **default**, **unique**, dan **notEmpty** (required) untuk setiap kolom, hapus kolom yang tidak diinginkan, atau **Add column** secara manual. Untuk tabel baru, Anda juga dapat mengedit **name** dan **description** yang disarankan AI.
5. Klik **Create Table** (tabel baru) atau **Add Columns** (tabel yang sudah ada) untuk menyimpan. Tekan **Esc** untuk menutup dialog kapan saja.

### Hanya menambahkan untuk tabel yang sudah ada

Saat membuat kolom untuk tabel yang sudah ada, model melihat kolom Anda saat ini sebagai konteks dan hanya mengusulkan kolom **baru**. Kolom yang sudah ada dan datanya tidak pernah diubah atau dihapus — kolom yang dihasilkan akan ditambahkan. Nama duplikat (tidak peka huruf besar/kecil) akan dihapus secara otomatis.

> Diperlukan LLM credential (OpenAI, Google, atau Custom). Jika Anda belum memilikinya, tambahkan terlebih dahulu di Settings.

## Mengelola Baris

- **Add row**: Klik tombol tambah untuk membuat baris baru
- **Inline edit**: Klik dua kali pada sel mana pun untuk mengedit nilainya. Tekan Enter atau klik di luar untuk menyimpan, Escape untuk membatalkan
- **Delete row**: Gunakan menu aksi baris untuk menghapus baris
- **Pagination**: Baris ditampilkan 25 per halaman dengan navigasi halaman

## Impor/Ekspor CSV

### Impor
1. Klik **Import CSV** di tampilan detail tabel
2. Pilih file CSV untuk diunggah
3. Pratinjau 5 baris pertama dan pemetaan kolom
4. Kolom hijau cocok dengan kolom tabel yang sudah ada; kuning tidak cocok
5. Klik Import untuk menyisipkan baris secara massal

### Ekspor
Klik **Export CSV** untuk mengunduh semua baris sebagai file CSV.

## Berbagi

Bagikan tabel dengan pengguna atau tim lain:

1. Buka dialog berbagi dari tampilan detail tabel
2. Tambahkan pengguna berdasarkan email dengan izin **read** atau **write**
3. Tambahkan tim dengan izin **read** atau **write**
4. Pengguna hanya-baca dapat melihat data; pengguna dengan izin tulis dapat mengubah baris

## Membuat Tabel dari AI Assistant

[AI Assistant](../reference/ai-assistant.md#data-tables) pada kanvas, [Chat](./chat-tab.md), dan tool `heym_chat` pada [tab MCP](./mcp-tab.md) dapat memilih salah satu tabel Anda untuk Workflow yang mereka buat, atau membuat tabel baru. Mereka mengusulkan nama dan kolom, lalu membuat tabel saat Anda mengirimkan kartu pertanyaan. Mereka tidak pernah mengubah kolom tabel yang sudah ada atau menyentuh barisnya: tambahkan atau edit kolom di sini.

## Penggunaan dalam Workflow

[Node DataTable](../nodes/datatable-node.md) menghubungkan tabel ke Workflow. Operasinya meliputi find, getAll, getById, insert, update, remove, dan upsert. Tidak diperlukan credential.

## LLM Cost Table (tabel sistem)

Bagian **System tables** yang disematkan muncul di atas tabel buatan pengguna Anda dengan satu entri: **LLM Cost Table**. Ini adalah tampilan harga per model dengan skema tetap yang dapat diedit per pengguna, digunakan oleh grafik biaya [Traces](./traces-tab.md).

### Asal data

Heym menyimpan tabel global harga per model yang di-seed dari endpoint harga publik Helicone (`https://www.helicone.ai/api/llm-costs`). Sinkronisasi berjalan di latar belakang saat pertama kali Anda membuka tabel atau Traces dan dibatasi hingga satu pengambilan per 24 jam. Tekan **Refresh** untuk memaksa sinkronisasi ulang segera. Model yang dihapus dari daftar upstream Helicone tidak dihapus secara lokal, sehingga pencarian biaya historis tetap stabil.

### Skema (kolom hanya-baca)

| Kolom | Arti |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informasional, digunakan oleh Helicone) |
| Model | Pengenal model yang dicocokkan dengan `trace.model` |
| Op | Operator pencocokan: `equals`, `startsWith`, atau `includes` |
| Input $/1M | USD per 1 juta prompt token |
| Output $/1M | USD per 1 juta completion token |
| Source | `helicone`, `seed`, atau `user` |
### Menyesuaikan harga

- **Edit baris** untuk mengganti harganya. Penggantian Anda bersifat per-pengguna dan ditandai dengan badge `Customized`; sinkronisasi Helicone di masa mendatang tidak akan mengubahnya.
- **Reset ke default** menghapus penggantian dan memulihkan nilai global untuk baris tersebut.
- **Add Custom Model** membuka dialog untuk membuat baris khusus pengguna (misalnya, model fine-tuned privat yang tidak terdaftar di Helicone). Baris khusus ditandai `User added` dan menghapusnya akan menghilangkannya sepenuhnya.

### Pencocokan terhadap trace

Saat dasbor Traces menghitung biaya, dasbor tersebut mencocokkan setiap `trace.model` terhadap:

1. Penggantian Anda (pencocokan persis pada nama model) terlebih dahulu
2. Jika tidak, tabel global — pencocokan persis `equals` diprioritaskan di atas `startsWith`/`includes`; hasil seri dalam operator yang sama diselesaikan berdasarkan prefiks/substring model yang paling panjang cocok

Jika tidak ada baris yang cocok, model akan dicantumkan pada pemberitahuan **Unpriced models** di halaman Traces; kontribusi biayanya nol hingga Anda menambahkan baris khusus atau mengganti salah satunya.

## Terkait

- [Node DataTable](../nodes/datatable-node.md) - Referensi Node Workflow
- [Tab Traces](./traces-tab.md) - Menggunakan LLM Cost Table untuk donat biaya dan kartu KPI
- [Node Grist](../nodes/grist-node.md) - Alternatif spreadsheet eksternal
- [Tab Variables](./global-variables-tab.md) - Alternatif penyimpanan key-value
