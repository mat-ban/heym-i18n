# Tab Evals

Tab **Evals** adalah halaman terpisah di `/evals`. Halaman ini memungkinkan Anda membuat suite evaluasi, mendefinisikan test case, dan menjalankan evaluasi terhadap workflow [Agent](../nodes/agent-node.md) Anda.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Tonton demo Evals</a></p>

## Akses

- Klik **Evals** pada bilah tab dashboard
- Atau navigasikan ke `/evals`
- Atau gunakan **Ctrl+K** (Cmd+K) dan pilih "Evals" dari command palette

## Eval Suite

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
- **Temperature** – Atur temperature model (`Exact Match` dan `Contains`)
- **Reasoning effort** – Atur reasoning effort untuk model reasoning (`Exact Match` dan `Contains`)

### LLM-as-Judge

Dengan judge, setiap model menjawab input pengujian hanya dengan prompt suite, lalu judge menilai seberapa dekat jawaban tersebut dengan output yang diharapkan dari 0 hingga 100:

- **Judge model** (OpenAI, OpenAI compatible atau Gemini) membaca pertanyaan, output yang diharapkan dan jawaban, lalu mengembalikan skor dengan alasan satu baris. Judge berjalan pada temperature `0`, atau pada reasoning effort `low` untuk model reasoning, sehingga jawaban yang sama mendapatkan penilaian yang sama.
- **Judge decision model** menilai jawaban berdasarkan rubrik lima tingkat, dari *Completely off* hingga *Fully matches*. Skor adalah posisi berbobot probabilitas pada rubrik tersebut, sehingga berasal dari distribusi yang dihitung model, bukan angka yang ditulisnya.

Kartu hover pada sel menampilkan alasan judge, atau untuk decision model menampilkan level, skor dan confidence-nya. Latency dan token menggambarkan model yang diuji; panggilan judge itu sendiri muncul di [Traces](./traces-tab.md) di bawah sumber **Evals**. Pemilih model tidak menyertakan credential Model Router, karena eval membandingkan model-model tertentu.

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
