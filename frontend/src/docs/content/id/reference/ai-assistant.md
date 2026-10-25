# Asisten AI

**AI Assistant** adalah panel chat yang terbuka dari panel Debug dan dimulai di kanan bawah editor. Seret header untuk memindahkannya, dan seret tepi atau sudut untuk mengubah lebar atau tingginya. Panel tidak akan menyusut di bawah 360×480 piksel. Posisi dan ukuran diingat di browser ini. **Reset position and size** di header mengembalikan panel ke kanan bawah. Gunakan bahasa alami untuk membuat atau memodifikasi workflow—jelaskan apa yang Anda inginkan, dan AI akan menghasilkan node dan edge yang diterapkan ke canvas.

Untuk pertanyaan dokumentasi di luar editor, gunakan [Chat with Heym](./chat-with-heym.md). Antarmuka tersebut dioptimalkan untuk bantuan produk yang sadar halaman, bukan untuk pembuatan workflow.

## Membuka Panel

1. Buka workflow di editor
2. Temukan **Debug panel** di bagian bawah (area hasil eksekusi)
3. Klik tombol **AI** (ikon Sparkles) di toolbar panel
4. Panel AI Assistant terbuka di kanan bawah. Seret headernya untuk memindahkan, atau seret tepi atau sudut untuk mengubah lebar dan tingginya.

Tekan `Ctrl + I` / `Cmd + I` di mana saja di editor untuk membuka atau menutup panel — pintasan ini berfungsi bahkan saat input teks sedang difokuskan. Lihat [Keyboard Shortcuts](./keyboard-shortcuts.md).

Untuk bekerja pada satu node, arahkan kursor ke atasnya di canvas dan klik **AI** di atasnya. Panel terbuka berfokus pada node tersebut. Lihat [Mengubah Satu Node](#changing-one-node).

## Menutup Panel

Klik tombol **X**, tekan `Ctrl + I` / `Cmd + I`, atau alihkan tombol **AI** di toolbar panel Debug. Header berfungsi untuk menyeret panel; bukan untuk menutupnya.

## Konfigurasi

Sebelum mengirim pesan, pilih:

| Pengaturan | Deskripsi |
|---------|-------------|
| **Credential** | Kredensial LLM (API key) dari [Credentials](../tabs/credentials-tab.md) |
| **Model** | Nama model (mis. `gpt-4o`, `gemini-2.5-flash`) |

Tambahkan kredensial di [Credentials Tab](../tabs/credentials-tab.md). Daftar model dimuat dari kredensial yang dipilih.

## Agent Mode vs Ask Mode

Panel ini memiliki dua mode, yang dialihkan dengan chip **Agent / Ask** di header panel.

| Mode | Default | Perilaku |
|------|---------|-----------|
| **Agent** | ✓ | Membangun dan memodifikasi canvas. AI menghasilkan blok JSON workflow yang secara otomatis diterapkan ke canvas saat respons selesai. |
| **Ask** | | Hanya menjawab pertanyaan. Canvas tidak pernah disentuh. Gunakan ini untuk bertanya tentang workflow Anda, fitur Heym, atau mendapatkan saran tanpa memicu pembaruan canvas. |

Alihkan mode kapan saja. Mengubah mode tidak menghapus percakapan.

Dalam mode Agent, kotak **YOLO mode** di bawah kolom pesan membuat asisten menjalankan dan memperbaiki apa yang dibangunnya. Lihat [YOLO Mode](#yolo-mode).

## Menggunakan Chat

- Ketik permintaan Anda di input (mis. "Create a workflow that takes user input and sends it to an LLM")
- Tekan **Enter** untuk mengirim (Shift+Enter untuk baris baru)
- AI melakukan streaming responsnya. Dalam mode **Agent**, jika respons menyertakan workflow dalam blok kode \`\`\`json, blok tersebut otomatis diuraikan dan diterapkan ke canvas. Dalam mode **Ask**, canvas tidak pernah dimodifikasi.
- Gunakan **Clear** untuk mengatur ulang percakapan
- Arahkan kursor ke pesan dan klik ikon salinnya untuk menyalin teks yang ditampilkan, termasuk JSON workflow apa pun
- Seret garis di atas kotak pesan untuk membuat kotak lebih tinggi. Area input dapat tumbuh hingga 60% dari panel, dan kembali ke tinggi defaultnya saat halaman dimuat ulang

## Auto-Apply Workflow

Saat respons AI berisi blok JSON workflow yang valid (dengan `nodes` dan opsional `edges`) dalam blok kode \`\`\`json, Heym akan:

1. Menguraikan JSON dari respons
2. Mengganti canvas saat ini dengan node dan edge baru
3. Merapikan tata letak node
4. Menandai workflow sebagai belum disimpan

Jika penguraian gagal, tombol **Retry** muncul untuk menghasilkan ulang respons.

## Mengubah Satu Node

Arahkan kursor ke node di canvas dan klik **AI** di atasnya. Panel terbuka dalam mode Agent, berfokus pada node tersebut, dan menunjukkan node mana yang sedang diubahnya:

| Node memiliki... | Panel menunjukkan |
|---|---|
| Tidak ada hasil dalam eksekusi saat ini | **Modifying Node:** dalam baris ringkas dengan ikon dan nama node. Asisten mengedit hanya dari konfigurasi node; jalankan node terlebih dahulu jika harus melihat output |
| Ada hasil dalam eksekusi saat ini | **Modifying Node: (Has Node Output)** di atas node itu sendiri: ikon, nama dan tipe, status dan durasi terakhir, serta kesalahan jika gagal. Asisten melihat output dan kesalahan tersebut saat mengedit node |

Arahkan kursor ke label untuk melihat status panel saat ini.

Dalam status apa pun, asisten juga membaca halaman dokumentasi node, yang ada di balik ikon buku di header node. Halaman ini digunakan untuk memahami opsi node dan menjawab pertanyaan tentangnya.

Di bawah pesan, tiga opsi memulai permintaan:

| Opsi | Fungsinya |
|---|---|
| **Change this node as ...** | Mengisi kotak pesan dengan *Ubah node ini menjadi* agar Anda dapat menyelesaikan kalimatnya |
| **Fix error in this node ...** | Mengisi *Perbaiki kesalahan pada node ini.* Asisten membaca kesalahan node ini dari eksekusi terakhir |
| **Other** | Memfokuskan kotak pesan kosong |

Edit teks dan tekan **Send**. Asisten hanya mengembalikan node ini dan Heym memperbaruinya di tempat: node mempertahankan id, tipe, dan namanya, sehingga ekspresi seperti `$checkLinkedIn.result` di node lain tetap berfungsi. Node, koneksi, dan tata letak lain tidak berubah, dan **Undo** memulihkan konfigurasi sebelumnya.

Jika permintaan tidak muat di dalam node, misalnya memerlukan tipe node lain atau node baru, asisten menyatakan apa yang harus diubah alih-alih mengedit. Tutup fokus node dengan **X** pada kartu node untuk mengedit seluruh workflow lagi. Menutup panel juga menghapus fokus.

[Mode YOLO](#yolo-mode) berfungsi dengan node yang difokuskan: asisten mengubah node, menjalankan workflow, dan memperbaiki node hingga eksekusi berhasil. Dalam mode **Ask**, fokus memberi tahu asisten node mana yang menjadi pertanyaan Anda, dan canvas tidak diubah.

## YOLO Mode

**YOLO mode** memungkinkan asisten menguji apa yang dibangunnya. Centang kotak **YOLO mode** di bawah kolom pesan, lalu kirim permintaan Anda. Kotak ini hanya muncul dalam mode Agent. Secara default nonaktif dan diatur ulang ke nonaktif saat halaman dimuat ulang. Arahkan kursor ke ikon info di sebelahnya untuk ringkasan singkat.

Dengan YOLO mode aktif, asisten tidak berhenti setelah menerapkan workflow:

1. Asisten menerapkan workflow ke canvas.
2. Sebelum eksekusi pertama, asisten meminta input pengujian. Kartu ini mencantumkan field input workflow, yang diisi dengan nilai yang disarankan asisten. Edit nilai tersebut dan tekan **Run**. Eksekusi berikutnya menggunakan kembali nilai-nilai ini. Kartu hanya muncul kembali saat field input berubah atau asisten membutuhkan data pengujian yang berbeda.
3. Asisten menjalankan workflow di canvas persis seperti tombol **Run**: perubahan yang belum disimpan disimpan terlebih dahulu, node menyala, dan eksekusi muncul di panel Debug dan [Execution History](./execution-history.md).
4. Asisten membaca hasilnya. Jika eksekusi melakukan apa yang Anda minta, asisten menyelesaikannya dengan **Verified** dan ringkasan singkat. Jika tidak, asisten memperbaiki workflow dan menjalankannya lagi.

Asisten melakukan paling banyak **5 eksekusi** per pesan. Tekan **Stop** kapan saja untuk mengakhiri loop dan menghentikan eksekusi yang sedang berlangsung.

Setiap balasan menampilkan langkah-langkahnya saat terjadi:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, dengan baris `Executing <node>` untuk setiap node;
- putusan akhir.

Setelah setiap eksekusi, baris singkat seperti *Attempt 1 result sent · error in 1.2s* menunjukkan bahwa hasilnya dikirim kembali ke asisten.
### Menjalankan workflow Anda yang lain

Dalam mode YOLO, asisten juga dapat menjalankan workflow Anda yang lain ketika memerlukan hasilnya. Sebagai contoh, asisten dapat memeriksa apa yang dikembalikan oleh suatu workflow sebelum memanggilnya dari node [Execute](../nodes/execute-node.md). Proses ini ditampilkan sebagai langkah `Running workflow "<name>"...` dan tercatat dalam Execution History dengan sumber trigger `ai_assistant`. Workflow yang sedang diedit selalu diuji pada kanvas.

### Ketika berhenti lebih awal

| Situasi | Yang terjadi |
|---|---|
| Asisten memerlukan keputusan, informasi, credential, atau data table | Asisten bertanya melalui kartu pertanyaan seperti biasa. Menjawabnya akan melanjutkan loop. |
| Proses menunggu [human review](./human-in-the-loop.md) | Loop berhenti. Setujui review tersebut, lalu kirim pesan. |
| Workflow menunggu unggahan file | Loop berhenti. Mode YOLO tidak dapat menguji proses yang dipicu oleh unggahan. |
| Versi workflow yang lebih baru telah disimpan di tempat lain | Loop berhenti. Selesaikan konflik penyimpanan, lalu kirim pesan. |

> **Proses berjalan secara nyata.** Email, pesan, dan panggilan API dalam workflow benar-benar dikirim pada setiap percobaan, dan node DataTable menulis baris yang nyata. Setiap proses menyimpan workflow, sehingga versi sebelumnya tetap tersimpan di [Edit History](./edit-history.md).

## Voice Input

Pada browser yang mendukung, tombol **Voice** mengaktifkan speech-to-text. Klik untuk mulai merekam, klik lagi untuk berhenti. Teks hasil transkripsi dikirim ke AI untuk perbaikan tata bahasa sebelum Anda mengirimkannya.

## Agent Node vs AI Assistant

| | Agent Node | AI Assistant |
|---|------------|---------------|
| **Tujuan** | Node LLM di dalam workflow; berjalan selama eksekusi | UI chat untuk membangun workflow dengan bahasa alami |
| **Lokasi** | Node pada kanvas | Debug panel → floating panel |
| **Kapan** | Saat runtime | Saat mengedit |

Lihat [Agent Node](../nodes/agent-node.md) untuk node workflow yang mengeksekusi panggilan LLM dengan tools dan MCP.

## Cara Kerjanya (AI Builder DSL)

AI Assistant didukung oleh **workflow DSL** (domain-specific language) yang mendeskripsikan node, edge, dan expression. Ketika Anda mengirim pesan:

1. Pesan Anda beserta [User Rules](./user-settings.md) dan workflow saat ini (jika ada) dikirim ke backend.
2. Backend membangun **system prompt** yang mencakup:
   - Workflow DSL secara lengkap (tipe node, sintaks expression, aturan, contoh)
   - User Rules Anda yang ditambahkan sebagai "User Custom Rules"
   - JSON workflow saat ini ketika Anda sedang mengedit workflow yang sudah ada
   - Daftar workflow yang tersedia jika Anda menggunakan node Execute
   - Nama, tipe, dan id credential milik Anda (tidak pernah nilainya)
   - Nama, id, deskripsi, dan kolom data table yang dapat Anda gunakan (tidak pernah barisnya)
3. Model mengembalikan satu blok JSON workflow (dengan `nodes` dan `edges`). Frontend mem-parsing-nya dan menerapkannya ke kanvas.

### Credentials

Ketika suatu workflow memerlukan credential, asisten bertanya sebelum membangunnya. Jika Anda memiliki credential dengan tipe yang sesuai, asisten akan menampilkannya bersama **Create a new credential**; jika Anda tidak memilikinya, asisten menanyakan apakah akan membuatnya. Setiap pertanyaan juga memungkinkan Anda melanjutkan tanpa credential.

Memilih untuk membuatnya akan membuka formulir credential di panel, dengan tipe yang tepat dan nama yang disarankan sudah terisi. Nilainya langsung dikirim ke Heym; asisten hanya mengetahui nama dan tipenya. Credential OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) terhubung melalui popup, dan tautan ke halaman otorisasi akan muncul jika popup diblokir. Setelah credential disimpan, kartu akan menampilkan namanya dan tombol create menjadi nonaktif; tekan **Submit answers** dan asisten akan memasang credential baru tersebut pada node.

Anda juga dapat meminta credential secara terpisah ("create a GitHub credential") atau meminta perubahan pada credential yang Anda miliki ("update my sheet credential", "reconnect my Google Sheets"). Asisten menjawab dengan kartu yang sama: pembuatan membuka formulir kosong, pembaruan membuka formulir pada credential tersebut dengan secret-nya disamarkan.

Asisten mengutamakan node khusus. Ketika tidak ada node yang mencakup suatu operasi, seperti menambahkan tab ke Google Sheet, asisten menggunakan HTTP request dan menulis baris header untuk credential yang dipilih. Lihat [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Pertanyaan klarifikasi yang tidak diperlukan oleh workflow akan menampilkan **Optional** pada inputnya dan dapat dilewati.

DSL memberlakukan label camelCase, aturan expression yang terpadu, dan field khusus node. Jika nilai suatu field berupa satu `$expr`, backend mempertahankan tipe aslinya; jika nilainya mencampur prosa dengan `$refs`, hasilnya berupa string. Aturan satu-`$` tetap berlaku: tidak ada `$` di dalam tanda kurung. User Rules pada [Settings](./user-settings.md) disuntikkan ke dalam system prompt ini sehingga preferensi Anda berlaku pada setiap workflow yang dihasilkan AI.

Jika workflow saat ini berisi Agent skills, AI Assistant hanya menyertakan `SKILL.md` dari setiap skill dalam konteks workflow tersebut. File `.py` yang dilampirkan dan aset skill biner dihapus sebelum permintaan dikirim agar builder tetap berada dalam batas konteks model meskipun skill berisi implementasi yang besar.
### Tabel Data

Ketika sebuah workflow menyimpan, menyimpan, atau mencari record dan Anda belum menamai penyimpanan lain, asisten menggunakan node [DataTable](../nodes/datatable-node.md). Jika Anda menamai salah satu tabel Anda dan tabel tersebut memiliki kolom yang dibutuhkan workflow, asisten akan menggunakannya. Jika tidak, asisten akan menanyakan tabel mana yang harus digunakan. Kartu tersebut mencantumkan tabel-tabel yang sesuai, masing-masing dengan deskripsi dan tipe kolomnya, ditambah **Create a new table** dengan nama dan kolom yang diusulkan. Tabel yang dibagikan kepada Anda juga ditawarkan; tabel yang hanya dapat Anda baca hanya ditawarkan untuk dibaca.

Pilih tabel baru dan tekan **Submit answers**: kartu tersebut membuat tabel, dan asisten menempatkan id-nya pada node serta menggunakan nama kolomnya secara persis. Anda juga dapat meminta tabel secara terpisah, misalnya "create a table for my leads".

Asisten melihat nama tabel, deskripsi, dan kolom, tidak pernah melihat baris. Asisten tidak pernah mengubah kolom tabel yang sudah ada: jika sebuah tabel kekurangan kolom yang dibutuhkan workflow, asisten akan menamai kolom tersebut dan menawarkan tabel baru sebagai gantinya. Tambahkan kolom di [DataTable tab](../tabs/datatable-tab.md).

## Terkait

- [Why Heym](../getting-started/why-heym.md) – Natural-language building as the first stage of the agent lifecycle
- [Quick Start](../getting-started/quick-start.md) – Build your first workflow
- [Settings](./user-settings.md) – User Rules injected into AI Assistant system prompt
- [Chat with Heym](./chat-with-heym.md) – Page-aware assistant inside the documentation area
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes, and execution flow
- [Agent Node](../nodes/agent-node.md) – LLM node with tools and MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Add API keys for the AI Assistant
- [Workflow Structure](./workflow-structure.md) – JSON format for workflows
