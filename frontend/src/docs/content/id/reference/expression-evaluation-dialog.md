# Dialog Evaluasi Ekspresi

Dialog Evaluasi Expression adalah editor yang diperluas untuk field yang mendukung expression. Dialog ini terbuka dari tombol perluas di samping input expression dan memberi Anda ruang kerja yang lebih luas, autocomplete, pratinjau backend secara langsung, serta penelusuran output dalam satu tempat.

## Membuka Dialog

- Klik tombol perluas di samping field expression pada panel Properties.
- Field multi-baris menampilkan tombol di dalam input.
- Field satu baris menampilkan tombol di sebelah kanan input.

## Tata Letak Dialog

- Dialog terbuka sebagai modal terpusat dengan ukuran sekitar **80vw × 80vh**.
- Header menampilkan **Evaluate — {field name}** ketika label field diketahui.
- Editor mempertahankan autocomplete, navigasi antar-field, dan aksi **Apply** / **Cancel** seperti biasa.
- Pratinjau diperbarui secara otomatis sekitar **300 ms** setelah Anda berhenti mengetik.
- Tekan `Ctrl` / `Cmd` + `Enter` untuk menerapkan teks saat ini kembali ke field dan menutup dialog (sama seperti **Apply**).

## Bagian Output

Area Output diperbarui secara otomatis setelah Anda berhenti mengetik di editor.

### Evaluasi

| Jenis expression | Hasil |
|---|---|
| Satu `$expr` (seluruh field) | Nilai native dipertahankan |
| Satu dot path tanpa `$` (seluruh field, tanpa `$`, tanpa baris baru tersemat) | Sama dengan `$` + path tersebut (backend menormalisasi untuk evaluasi) |
| Teks dengan `$refs` tersemat | Hasil akhir selalu berupa string |
| Teks literal (tanpa `$`, bukan dot path tunggal) | Dikembalikan apa adanya |

**Contoh**

| Input | Hasil |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (sama dengan `$input.items` ketika seluruh nilai adalah path ini) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Konteks evaluasi dibangun dengan urutan berikut:

- **Pinned data** pada node upstream
- **Last run outputs** dari canvas
- `null` ketika tidak ada data upstream yang tersedia

Jika node saat ini memiliki dependensi upstream tetapi tidak ada yang memiliki pinned data atau hasil run terbaru, dialog terlebih dahulu melakukan test run untuk membangun konteks, lalu mengevaluasi teks saat ini.

### Output Path Picker

Ketika hasil backend berupa object atau array, area Output dapat menampilkan path picker interaktif alih-alih JSON mentah.

- Klik dua kali pada baris untuk menambahkan path tersebut ke referensi `$node.path` saat ini.
- Klik satu kali pada baris yang dapat diperluas untuk membuka atau menutup cabang.
- Gunakan kotak pencarian bawaan untuk mencari key, value, dan string path.

## Autocomplete

- Ketik `$` untuk membuka saran bagi node upstream, built-in, dan method.
- Tekan `Tab` atau `Enter` untuk menyisipkan saran yang dipilih.
- Gunakan `↑` / `↓` untuk berpindah melalui daftar saran.

### Contoh Jawaban

Ketika Anda melanjutkan referensi `$…` dengan sebuah dot, setiap baris saran menampilkan jawaban yang akan dihasilkan oleh saran tersebut, dalam huruf tebal di sisi kanan baris.

- Mengetik `$set.listItems.first().toString().u` akan menampilkan `upper`, `urlEncode`, `urlDecode`, dan `unescape`, masing-masing dengan hasil evaluasinya — sehingga Anda dapat memilih berdasarkan hasil alih-alih berdasarkan nama.
- Mengetik `$node.text.toJson()` akan mengurai string JSON menjadi object atau array. Setelah `.toJson()`, autocomplete dapat menawarkan key hasil penguraian (misalnya `repoUrl`) ketika output last-run atau pinned tersedia.
- Hasil dievaluasi di backend terhadap pinned data dan last-run outputs yang sama dengan yang digunakan pratinjau dialog, sehingga hasilnya sesuai dengan yang akan dihasilkan oleh field.
- Hanya saran yang berdiri sendiri yang dievaluasi: method tanpa argumen (`upper()`, `first()`, `keys()`, `toJson()`) dan properti biasa (`length`, `year`). Saran yang memerlukan argumen terlebih dahulu — `map`, `filter`, `sort`, `replace` — dibiarkan kosong.
- Baris tetap kosong ketika kandidat tidak menghasilkan jawaban: error, `null`, atau method yang tidak berlaku untuk nilai tersebut.
- Jawaban dipersingkat menjadi satu baris. Arahkan kursor ke jawaban yang dipersingkat untuk melihat lebih banyak.

## Build with AI

Tombol **Build with AI** muncul di sudut kanan atas dialog evaluate ketika sebuah workflow telah dimuat. Tombol ini membuka modal bersarang tempat Anda dapat mendeskripsikan expression yang Anda inginkan dalam teks biasa dan meminta LLM menghasilkannya untuk Anda.

### Cara kerjanya

1. Klik **Build with AI** pada toolbar dialog evaluate.
2. Pilih credential dan model LLM dari dropdown.
3. Ketik deskripsi teks biasa tentang apa yang Anda inginkan — misalnya, *"Get the customer name from the API response"*.
4. Klik **Generate**. Modal akan memanggil backend, yang menggunakan system prompt [Expression DSL](./expression-dsl.md) ditambah output last workflow run Anda sebagai konteks, dan mengembalikan satu string expression.
5. Expression yang dihasilkan langsung dievaluasi terhadap data canvas yang sama sehingga Anda dapat melihat hasilnya sebelum menerapkan.
6. Klik **Apply** untuk mengganti konten editor dengan expression yang dihasilkan, atau **Regenerate** untuk mencoba lagi.

### Konteks yang digunakan

Generator menerima output node dari test run terakhir pada canvas. Jika workflow belum dijalankan, LLM akan menghasilkan expression dengan upaya terbaik berdasarkan label node dan konvensi DSL.

### Persyaratan

- Sebuah credential LLM (OpenAI, Google, atau Custom) harus dikonfigurasi pada tab [Credentials](./credentials.md).
- Workflow harus terbuka di editor.

## Pintasan Keyboard

| Pintasan | Aksi |
|---|---|
| Jeda mengetik (~300 ms) | Perbarui pratinjau backend |
| `Ctrl` / `Cmd` + `Enter` | Terapkan dan tutup dialog |
| `Escape` | Tutup autocomplete terlebih dahulu, jika tidak tutup dialog |
## `$` Bersarang dalam Argumen Method

Untuk evaluasi dialog / backend, Anda dapat meneruskan referensi lain dengan `$` bersarang di dalam pemanggilan seperti `.get($other.field)` ketika Anda memerlukan key yang dinamis. Anda juga dapat menggunakan path tanpa pembungkus di dalam `.get(...)` (misalnya `other.field`); backend menyelesaikannya dengan cara yang sama. Field Workflow yang disimpan tetap harus mengikuti aturan [Expression DSL](./expression-dsl.md); API evaluate juga menerima dot path tanpa pembungkus sepanjang baris untuk kemudahan (lihat tabel di atas).

## Navigasi

Editor pemetaan Set dan Execute dapat menampilkan tombol **Prev** / **Next** sehingga Anda dapat berpindah antar field tanpa menutup dialog.

## Terkait

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — diperlukan untuk fitur Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
