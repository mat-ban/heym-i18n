# Pengaturan

Dialog Pengaturan memungkinkan Anda mengelola profil, menetapkan instruksi AI yang persisten, memperbarui kata sandi akun, mengonfigurasi suara chat, menetapkan kredensial dan model AI default, serta meninjau status observabilitas. Buka dialog ini dengan mengklik **avatar dan nama Anda** di sudut kanan atas header.

## Membuka Dialog

Klik **avatar dan nama Anda** di sudut kanan atas header. Dialog akan terbuka dengan tab berikut: **Profile**, **Security**, **Voice**, **AI Defaults**, dan **Observability**. Administrator instans juga akan melihat tab **SSO**, **Heym Work**, dan **Instances**.

## Tab Profile

### Foto Profil

Heym menampilkan foto [Gravatar](https://gravatar.com) untuk email akun Anda di header, di samping pesan Anda di [Chat](../tabs/chat-tab.md) dan **Chat with Heym**, pada komentar [Board](../tabs/board-tab.md), serta di samping nama Anda di dialog berbagi dan daftar anggota tim. Untuk mengubahnya, perbarui foto pada Gravatar; Heym akan mengambil foto baru tersebut dalam beberapa jam. Tanpa foto Gravatar, Heym akan menampilkan huruf pertama dari nama Anda.

Foto tersebut diambil oleh server Heym dan di-cache di sana, sehingga browser Anda tidak pernah menghubungi Gravatar. Jika server tidak dapat menjangkau Gravatar, semua orang akan tetap melihat inisial.

### Nama

Nama tampilan Anda yang ditampilkan di seluruh aplikasi. Kolom ini wajib diisi dan tidak boleh dibiarkan kosong.

### User Rules

User Rules adalah instruksi kustom yang secara otomatis disuntikkan ke setiap permintaan AI—baik di workflow builder maupun di chat dashboard. Di **workflow builder** ([AI Assistant](./ai-assistant.md)), instruksi ini ditambahkan ke system prompt yang digunakan untuk menghasilkan workflow JSON. Di **chat dashboard**, instruksi ini diterapkan sebagai konteks tingkat sistem. Anda cukup menuliskannya sekali dan instruksi tersebut berlaku secara global tanpa perlu mengulanginya di setiap prompt.

**Penggunaan umum:**

- Bahasa atau nada: `Always respond in English. Keep responses concise.`
- Gaya penulisan kode: `Use async/await patterns. Prefer TypeScript interfaces over types.`
- Konvensi workflow: `Include error handling in all workflows. Use descriptive node labels.`
- Format respons: `Use bullet points. Avoid lengthy explanations.`

**Tempat penerapannya:**

| Konteks | Deskripsi |
|---------|-------------|
| **Workflow builder** | Permintaan [AI Assistant](./ai-assistant.md) untuk menghasilkan atau memodifikasi workflow |
| **Dashboard chat** | Semua percakapan pada [Chat tab](../tabs/chat-tab.md) |

User Rules disuntikkan pada tingkat sistem—instruksi ini dijalankan sebelum setiap prompt secara otomatis, tanpa konfigurasi tambahan per workflow atau percakapan.

### Menyimpan Perubahan Profil

Klik **Save Changes** untuk menerapkan. Perubahan berlaku segera untuk semua permintaan AI baru.

## Tab Security

### Mengubah Kata Sandi

Gunakan tab Security untuk memperbarui kata sandi akun Anda.

**Persyaratan:**

| Aturan | Ketentuan |
|------|-------------|
| Panjang minimum | 8 karakter |
| Huruf besar | Minimal satu huruf besar (A–Z) |
| Huruf kecil | Minimal satu huruf kecil (a–z) |
| Digit | Minimal satu angka (0–9) |

Kata sandi juga harus berbeda dari kata sandi Anda saat ini. Aturan-aturan ini diberlakukan baik di frontend maupun backend.

**Langkah-langkah:**

1. Masukkan **Current Password** Anda
2. Masukkan **New Password** Anda (harus memenuhi semua persyaratan di atas)
3. Masukkan kembali pada **Confirm New Password**
4. Klik **Update Password**

Jika kata sandi saat ini salah, pesan kesalahan inline akan ditampilkan. Jika berhasil, pesan konfirmasi akan muncul dan formulir akan direset secara otomatis.

## Tab Voice

Tab Voice mengonfigurasi suara yang diucapkan untuk [Chat tab](../tabs/chat-tab.md): pilih **ElevenLabs credential** (atau tambahkan secara inline), pilih **Voice** dari akun ElevenLabs Anda, lalu **Save Voice Settings**. Ini mengaktifkan fitur baca-keras per pesan dan mode suara interaktif. Lihat [Chat Voice (TTS & STT)](./chat-voice.md) untuk alur lengkapnya.

## Tab AI Defaults

Tab AI Defaults memiliki dua bagian.

### Kredensial & model pilihan

Pilih **preferred LLM credential** dan **model** darinya. Ini akan menjadi default awal untuk setiap fitur AI di aplikasi — chat, [AI Assistant](./ai-assistant.md) (builder, analyzer, dan pembuatan workflow), board mapper, widget dashboard AI, [docs chat](../tabs/chat-tab.md), helper skema AI data-table, expression builder, dan evals — setiap kali permukaan tersebut tidak memiliki pilihan tersimpan sendiri.

Aturan pemilihan yang diikuti setiap permukaan adalah:

1. **Saved selection** — pilihan yang sudah Anda buat pada permukaan tersebut (misalnya model terakhir pada suatu percakapan chat) selalu menang.
2. **Preferred** — digunakan ketika tidak ada pilihan tersimpan.
3. **First available credential** — fallback ketika Anda belum menetapkan preferensi.

Anda tetap dapat mengubah kredensial dan model per permukaan kapan saja; preferensi hanya mengisi default awal. Biarkan kredensial sebagai **No preference** untuk mempertahankan perilaku kredensial pertama sebelumnya. Jika kredensial pilihan Anda nantinya dihapus atau tidak lagi dibagikan, tab akan menampilkan pemberitahuan dan permukaan akan secara diam-diam beralih ke kredensial pertama yang tersedia.
### Penggunaan Paket Coding

Untuk setiap kredensial **Codex** (termasuk yang dibagikan), tab menampilkan sisa penggunaan batas laju sebagai bilah horizontal per jendela aktif — misalnya jendela **5 jam** dan/atau jendela **Mingguan**, bergantung pada paket Anda. Setiap bilah menampilkan persentase kuota yang tersisa dan hitungan mundur pengaturan ulang. Tombol **Refresh** mengambil ulang data sesuai permintaan (hasil di-cache sementara di server).

Untuk setiap kredensial **OpenCode**, tab menampilkan jendela langganan OpenCode Go — **5 jam**, **Mingguan**, dan **Bulanan** — dengan gaya bilah yang sama, dibaca dari endpoint penggunaan terautentikasi gateway menggunakan API key kredensial tersebut. Jendela yang telah mencapai batasnya ditampilkan sebagai **"limit reached"** dengan warna kuning. Jika key tidak valid atau workspace tidak memiliki langganan Go, kartu akan menampilkan alasannya alih-alih menampilkan bilah.

## Tab Observability

Tab Observability menampilkan status hanya-baca dari [OpenTelemetry Tracing](./opentelemetry.md) untuk instans ini: apakah tracing diaktifkan, endpoint OTLP, nama layanan, rasio sampler, dan span mana yang dipancarkan. Tracing dikonfigurasi melalui variabel lingkungan `HEYM_OTEL_*` pada backend, sehingga tab ini tidak mengubah apa pun. Ketika tracing dinonaktifkan, tab menampilkan daftar variabel lingkungan yang diperlukan untuk mengaktifkannya. Rahasia seperti header autentikasi OTLP tidak pernah ditampilkan di sini. Lihat [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) untuk referensi konfigurasi lengkap.

## Tab SSO

Hanya terlihat oleh administrator instans — akun yang terdaftar dalam `HEYM_ADMIN_EMAILS`. Tab ini menghubungkan Heym ke penyedia OpenID Connect eksternal sehingga pengguna dapat masuk dengan akun yang sudah mereka miliki. Masukkan URL issuer dan kredensial klien, salin redirect URI hanya-baca ke penyedia Anda, dan jalankan **Test connection** sebelum mengaktifkannya. Masuk dengan kata sandi dapat dinonaktifkan dari sini setelah pengujian berhasil. Lihat [Single Sign-On](./sso.md) untuk pengaturan lengkapnya.

## Tab Heym Work

Administrator instans menghubungkan [Heym Work](./heym-work.md), antarmuka untuk tim bisnis, di sini: alamatnya, kunci integrasi yang ditampilkan sekali, serta sakelar **Enable Heym Work**. Tab ini juga menampilkan kapan terakhir kali Heym Work melapor, versinya, dan status lisensinya. Lihat [Menghubungkan Heym Work](./heym-work.md#connecting-heym-work).

## Tab Instances

Hanya terlihat oleh administrator instans — akun yang terdaftar dalam `HEYM_ADMIN_EMAILS`. Tab ini menampilkan daftar instans Heym yang terhubung ke database ini dan mengatur bagaimana proses latar belakang dibagi di antara instans tersebut. Setiap baris menampilkan nama instans yang dapat diedit, perannya, apakah aktif, latensi terukur ke database, tombol on/off, dan bobotnya. Bobot adalah bagian dari instans yang saat ini dapat mengambil pekerjaan, bukan persentase dari 100: dengan `41 / 26 / 33` dan instans ketiga dimatikan, dua instans pertama benar-benar menerima 61% dan 39%. Panel menampilkan pembagian efektif tersebut di bawah tabel, dan hanya menolak menyimpan ketika tidak ada instans yang diaktifkan memiliki bobot sama sekali.

**Give new instances a share automatically** aktif secara default: instans yang bergabung akan berada pada bobot 0 dan tidak menerima apa pun, sehingga leader memberinya bagian yang setara satu kali dan menyesuaikan bobot yang ada ke bawah dengan mempertahankan rasionya. Fitur ini tidak pernah menyentuh instans yang bobotnya Anda tetapkan sendiri.

Panel juga melaporkan berapa banyak dari proses 24 jam terakhir yang hanya dapat dijalankan pada instans utama. Ketika bagian tersebut tinggi, bobot di bawahnya tidak dapat memindahkan pekerjaan itu. Lihat [Load Distribution](./cluster.md) untuk mengetahui apa yang tetap berada di main dan cara memilih angkanya.

## Apa yang Tidak Ada di Dialog Ini

| Fitur | Di Mana Menemukannya |
|---------|-----------------|
| **Manajemen API key (MCP)** | [Tab MCP](../tabs/mcp-tab.md) – lihat, salin, dan regenerasi API key server MCP Anda |
| **Tema (gelap / terang)** | Tombol toggle Matahari/Bulan di header (di samping badge pengguna) |
| **Perubahan email** | Saat ini tidak didukung |

## Terkait

- [AI Assistant](./ai-assistant.md) – Obrolan pembuat Workflow yang menggunakan User Rules
- [Tab Chat](../tabs/chat-tab.md) – Obrolan Dashboard yang menggunakan User Rules
- [Chat Voice (TTS & STT)](./chat-voice.md) – Suara ElevenLabs yang dikonfigurasi di tab Voice
- [Tab MCP](../tabs/mcp-tab.md) – API key server MCP dan eksposur tool workflow
- [Tab Credentials](../tabs/credentials-tab.md) – API key untuk Node AI dan integrasi
- [Security](./security.md) – Manajemen sesi, pembatasan laju, enkripsi kredensial
- [Single Sign-On](./sso.md) – Menghubungkan penyedia OpenID Connect eksternal
- [OpenTelemetry Tracing](./opentelemetry.md) – Tracing terdistribusi untuk eksekusi workflow dan Node
