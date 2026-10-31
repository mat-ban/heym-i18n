# Tab Evals

Tab **Evals** adalah halaman terpisah di `/evals`. Halaman ini memungkinkan Anda membuat suite evaluasi, mendefinisikan test case, dan menjalankan evaluasi terhadap workflow [Agent](../nodes/agent-node.md) Anda. Sebuah [suite agen](#agent-suites) menjalankan agen atau membaca eksekusi nyatanya, serta memeriksa alat yang dipanggil, latensinya, biaya dalam USD, token, dan jumlah panggilan alatnya.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Tonton demo Evals</a></p>

## Akses

- Klik **Evals** pada bilah tab dashboard
- Atau navigasikan ke `/evals`
- Atau gunakan **Ctrl+K** (Cmd+K) dan pilih "Evals" dari command palette

## Eval Suite

- **Suite Baru** – Pilih **Suite prompt** untuk menguji prompt sistem di berbagai model, atau **Suite agen** untuk memeriksa eksekusi nyata agen (lihat [Suite Agen](#agent-suites))
- **Pemilih suite** – Menampilkan suite prompt dan agen bersama dengan tipe di samping setiap nama; ketik untuk mencari
- **Buat suite** – Definisikan suite dengan nama dan deskripsi
- **Pilih workflow** – Pilih workflow yang akan dievaluasi
- **Pilih credential** – API key untuk menjalankan workflow
- **System prompt** – Edit system prompt tingkat suite langsung di panel kiri
- **Optimize Prompt** – Minta LLM untuk menyempurnakan system prompt saat ini

## Test Case

- Tambahkan test case dengan input prompt dan output yang diharapkan
- Setiap case dapat memiliki nilai yang diharapkan khusus untuk perbandingan
- Edit atau hapus case dari suite
- **Generate Test Data** – Gunakan credential/model yang dipilih untuk membuat test case secara otomatis dari prompt suite

## Menjalankan Evaluasi

- **Pilih satu atau beberapa model** – Jalankan suite yang sama terhadap beberapa model dalam satu evaluasi
- **Metode penilaian** – Pilih `Exact Match`, `Contains`, atau `LLM-as-Judge`
- **Judge** – Untuk `LLM-as-Judge`, secara opsional pilih credential OpenAI, OpenAI compatible (Custom), Gemini (Google) atau [Decision Model](../nodes/decision-node.md) dan ketikkan model judge (misalnya `gpt-4o-mini` atau `jev-latest`) untuk menilai dengan judge independen
- **Runs per test** – Ulangi setiap test case beberapa kali dalam satu run
- **Pengaturan tersimpan** – Suite terbuka dengan pengaturan dari eksekusi terbarunya: kredensial, model, metode penilaian dan penilai, suhu, upaya penalaran, dan eksekusi per pengujian. Membuka eksekusi sebelumnya akan memuat pengaturannya, sehingga **Jalankan Ulang Evaluasi** mengulangi pengujian yang sama
- **Temperature** – Atur temperature model (`Exact Match` dan `Contains`)
- **Upaya penalaran** – Atur upaya penalaran untuk model penalaran, dari Rendah hingga Sangat tinggi dan Maks seperti pada node LLM dan Agent (`Exact Match` dan `Contains`)

### LLM-as-Judge

Dengan judge, setiap model menjawab input pengujian hanya dengan prompt suite, lalu judge menilai seberapa dekat jawaban tersebut dengan output yang diharapkan dari 0 hingga 100:

- **Judge model** (OpenAI, OpenAI compatible atau Gemini) membaca pertanyaan, output yang diharapkan dan jawaban, lalu mengembalikan skor dengan alasan satu baris. Judge berjalan pada temperature `0`, atau pada reasoning effort `low` untuk model reasoning, sehingga jawaban yang sama mendapatkan penilaian yang sama.
- **Judge decision model** menilai jawaban berdasarkan rubrik lima tingkat, dari *Completely off* hingga *Fully matches*. Skor adalah posisi berbobot probabilitas pada rubrik tersebut, sehingga berasal dari distribusi yang dihitung model, bukan angka yang ditulisnya.

Kartu saat kursor diarahkan ke sel menampilkan alasan penilai atau, untuk model keputusan, tingkat, skor, dan tingkat keyakinannya. Latensi dan token menjelaskan model yang diuji; panggilan penilai itu sendiri muncul di [Jejak](./traces-tab.md) di bawah sumber **Evaluasi**. Pemilih penilai mengecualikan kredensial Model Router, karena penilai harus berupa satu model tetap. Kredensial untuk model yang diuji dapat berupa [Model Router](../reference/credentials.md#model-router-auto-model): model **Auto** miliknya memilih model per permintaan, sama seperti di dalam workflow.

Tanpa judge, setiap model menjawab dan menilai jawabannya sendiri dalam satu permintaan.

Temperature dan reasoning effort disembunyikan dalam mode ini, dan run menggunakan pengaturan tetap: temperature `0.7` untuk model standar, dan reasoning effort `medium` untuk model reasoning (`low` saat menilai jawabannya sendiri).

## Hasil

- Lihat pass/fail per test case
- Periksa output aktual vs output yang diharapkan
- Bandingkan output per model secara berdampingan saat sebuah run mencakup beberapa model
- Tinjau riwayat run untuk evaluasi sebelumnya; run `LLM-as-Judge` menampilkan model judge-nya di daftar riwayat
- Buka run historis dari panel hasil dan periksa snapshot prompt/input/output yang tersimpan
- Membuka run sebelumnya akan memuat metode penilaian dan judge-nya ke panel kiri, sehingga **Re-Run Evals** mengulang evaluasi yang sama
- **Export** mengunduh run sebagai JSON, termasuk `judge_credential_id` dan `judge_model`

## Agent Suites

Suite agen memeriksa node [Agent](../nodes/agent-node.md) berdasarkan eksekusinya. Suite membaca dari [Jejak](./traces-tab.md), di mana setiap eksekusi sudah mencatat waktu, token, biaya, dan panggilan alatnya, serta dapat menjalankan workflow untuk Anda.

Buat melalui **Suite Baru** → **Suite agen** dan ikuti tiga langkah berikut:

1. **Agent** – Pilih workflow, lalu pilih node agennya. Hanya workflow dengan node agen yang dicantumkan; workflow atau agen yang belum pernah dijalankan akan ditampilkan tetapi tidak dapat dipilih. Pengaturan agen yang dipilih (model, instruksi, alat, dan batas) muncul di sebelah kanan, dan kanvas baca-saja dari workflow-nya dengan agen yang disorot ditampilkan di bawah.
2. **Baseline** – 10 eksekusi terakhir agen: latensi p50 dan p95, biaya per eksekusi, token per eksekusi, dan panggilan alat per eksekusi, alat apa saja yang dipanggil dan seberapa sering, serta angka spesifik dari setiap eksekusi. Eksekusi yang berakhir dengan kesalahan dicantumkan tetapi tidak dimasukkan ke dalam baseline.
3. **Pemeriksaan** – Tandai setiap alat sebagai **Must call**, **Must not call**, atau **Either**. Setiap jenis panggilan dicantumkan bersama tipenya: alat Python dan node, alat **MCP** dengan servernya, **sub-agen** berdasarkan label, **sub-workflow** berdasarkan nama, dan **skills**. Tambahkan alat berdasarkan jenis dan nama jika belum pernah dijalankan, dan hapus kembali dengan tanda **X**. Tetapkan batas atas untuk latensi, biaya, total token, dan panggilan alat; masing-masing dimulai 20% di atas p95 baseline dan dapat dinonaktifkan.

Suite yang disimpan terbuka di tab **Hasil**, dengan **Baseline** dan **Edit pemeriksaan** di sampingnya:

- **Jalankan workflow** – Pilih jumlah eksekusi (hingga 20); empat berjalan sekaligus. Input diisi dari eksekusi terbaru workflow dan dapat diedit, dan setiap eksekusi menggunakannya. Aktifkan **Hasilkan input** (ikon kilau), lalu pilih kredensial dan model agar model menuliskan input yang berbeda untuk setiap eksekusi. Model membaca instruksi sistem agen dan tetap mendekati nilai yang Anda ketikkan: mengetik nama kota akan menghasilkan nama kota lainnya. Setiap eksekusi menjalankan seluruh workflow seperti eksekusi biasa lainnya dan dicantumkan dalam Riwayat Eksekusi dengan trigger `agent_suite`. Untuk melewati langkah selanjutnya, seperti pengiriman email, buka workflow dengan **Buka workflow** di panel dan nonaktifkan node tersebut terlebih dahulu. **Hentikan** mengakhiri eksekusi suite: tidak ada eksekusi baru yang dimulai dan eksekusi yang sedang berjalan dibatalkan. Eksekusi suite yang servernya berhenti, misalnya saat restart, akan ditampilkan sebagai terputus setelah satu menit alih-alih tetap macet.
- **Hasil** – Eksekusi suite terbaru dinilai secara default. Setiap eksekusi suite disimpan bersama tanggalnya di pemilih eksekusi, di mana Anda dapat membuka atau menghapusnya; atau beralih ke 10, 20, atau 50 eksekusi terakhir agen untuk menyertakan eksekusi lainnya. Anda melihat tingkat kelulusan, seberapa sering setiap pemeriksaan lulus, latensi, biaya, token, dan panggilan alat di samping baseline yang disimpan, serta setiap eksekusi dengan alasan kegagalan dan tautan ke jejaknya.
- **Buka workflow** membuka workflow agen di tab baru. Pada kolom nama, menekan **Esc** atau **X** akan menghapus teks.

Bagaimana angka-angka tersebut ditafsirkan:

- **Latensi** adalah waktu model ditambah waktu panggilan alat dari eksekusi tersebut.
- **Biaya** menggunakan harga yang sama dengan Traces. Eksekusi model tanpa harga melewati pemeriksaan biaya alih-alih gagal.
- Eksekusi dinyatakan **lulus** jika selesai tanpa kesalahan dan setiap pemeriksaan berhasil.
- Suite hanya membaca jejak Anda sendiri, aturan yang sama seperti tab Jejak.
- **Gunakan eksekusi terbaru sebagai baseline** pada **Edit pemeriksaan** menggantikan baseline yang disimpan dengan eksekusi terbaru agen.

Baseline suite berasal dari salah satu dari tiga sumber. **Edit pemeriksaan** menunjukkan sumber yang aktif di samping **Baseline tersimpan**:

- eksekusi terbaru agen (default, dan yang diambil oleh **Gunakan eksekusi terbaru sebagai baseline**),
- satu eksekusi suite yang telah selesai,
- angka yang dimasukkan secara manual.

Dua opsi terakhir diatur dari [Chat](./chat-tab.md#working-with-evals) atau melalui API:

- `PATCH /api/evals/agent-suites/{id}` menerima `baseline: {"source": "suite_run", "run_id": "…"}` atau `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` menerima `inputs_list`: satu objek input per eksekusi, hingga 20.

### Dari Chat dan MCP

[Chat](./chat-tab.md#working-with-evals) dan alat MCP `heym_chat` dapat membuat, mengubah, dan menjalankan suite prompt serta agen:

- Mereka menuliskan kasus uji dan input eksekusi secara mandiri.
- Mereka menanyakan kredensial mana yang akan digunakan sebelum membuat suite prompt, kecuali hanya satu yang sesuai.
- Mereka menautkan setiap suite yang mereka sebutkan di halaman ini.

## Ide Matriks Benchmark

Saat Anda membangun matriks benchmark untuk workflow agent, sertakan skenario HITL sebagai case kelas utama alih-alih memperlakukannya sebagai edge case.

- Cakup ketiga keputusan review: `accepted`, `edited`, dan `refused`
- Sertakan berbagai sumber trigger seperti editor runs, portal, curl/webhook, dan eksekusi yang dipicu cron
- Tambahkan skenario repeated-review di mana satu agent run berhenti lebih dari sekali
- Verifikasi cabang notifikasi yang terhubung ke output `review` agent
- Pastikan perilaku downstream setelah penolakan, terutama jika node berikutnya bercabang pada `$agent.decision`

## Terkait

- [Why Heym](../getting-started/why-heym.md) – Evals sebagai tahap pengujian dalam siklus hidup agent
- [Agent Node](../nodes/agent-node.md) – Workflow yang dievaluasi
- [Credentials Tab](./credentials-tab.md) – Credential untuk eval run
- [Traces Tab](./traces-tab.md) – Inspeksi trace secara detail
- [Workflows Tab](./workflows-tab.md) – Buat workflow untuk dievaluasi
- [Execution History](../reference/execution-history.md) – Lihat run sebelumnya (tombol History di header)
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas yang tersedia di halaman evals
