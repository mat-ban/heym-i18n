# Guardrails

Guardrails memungkinkan Anda memblokir pesan pengguna yang tidak aman atau tidak diinginkan sebelum mencapai node [LLM](../nodes/llm-node.md) atau [Agent](../nodes/agent-node.md). Ketika sebuah pesan cocok dengan kategori yang diblokir, node akan memunculkan error alih-alih mengeksekusi, yang dapat Anda tangkap dengan node [Error Handler](../nodes/error-handler-node.md).

## Mengaktifkan Guardrails

Buka panel Properties untuk node **LLM** atau **AI Agent** dan gulir ke toggle **Enable Guardrails** (ikon perisai). Centang kotak tersebut untuk menampilkan bagian konfigurasi.

## Kredensial dan Model Guardrail

Ketika guardrails diaktifkan, Anda **harus** memilih **kredensial dan model** untuk keamanan konten. Pemeriksaan guardrail menggunakan kredensial dan model yang dipilih dari node — tanpa fallback, tanpa variabel lingkungan. Gunakan kredensial OpenAI atau Google untuk pemfilteran konten yang andal, terutama ketika model utama Anda menggunakan penyedia kustom (misalnya Zhipu, GLM) yang mungkin tidak mendukung guardrails atau mengembalikan error API (misalnya 404).

Workflow tidak dapat dijalankan sampai Guardrail Credential dan Guardrail Model keduanya dipilih.

## Kategori yang Diblokir

Pilih satu atau lebih kategori untuk diblokir. Pesan yang cocok dengan kategori mana pun yang dicentang akan ditolak.

| Kategori | Apa yang diblokir |
|---|---|
| **Violence** | Konten kekerasan, ancaman, atau yang membahayakan secara fisik |
| **Hate Speech** | Diskriminasi, rasisme, atau kefanatikan |
| **Sexual Content** | Konten atau skenario seksual yang eksplisit |
| **NSFW / Profanity** | Bahasa kasar, kata-kata kotor, hinaan eksplisit, dan slang dewasa dalam bahasa apa pun |
| **Self-Harm** | Bunuh diri, melukai diri sendiri, atau konten terkait |
| **Harassment** | Serangan pribadi, penghinaan, perundungan, atau intimidasi |
| **Illegal Activity** | Instruksi untuk melakukan tindakan ilegal |
| **Political Extremism** | Konten politik ekstremis atau propaganda kekerasan |
| **Spam / Phishing** | Spam, phishing, atau rekayasa sosial |
| **Personal Data Request** | Permintaan informasi pribadi atau yang dapat diidentifikasi secara pribadi |
| **Prompt Injection** | Upaya untuk menimpa instruksi sistem, menyuntikkan prompt berbahaya, atau memanipulasi perilaku model |

## Sensitivitas

Pengaturan **Sensitivity** mengontrol seberapa ketat pelanggaran dideteksi:

| Tingkat | Perilaku |
|---|---|
| **Low** | Menandai bahkan kasus yang ambigu atau berada di batas |
| **Medium** *(default)* | Menandai pelanggaran yang jelas; mengabaikan kasus yang ambigu |
| **High** | Hanya menandai pelanggaran yang ekstrem dan tidak ambigu |

## Cara Kerja Deteksi

Deteksi menggunakan **kredensial dan model guardrail yang dipilih**:

- **Kredensial OpenAI** — menggunakan [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (gratis, cepat, tanpa penggunaan token) untuk lima kategori yang didukung secara native (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Kategori lainnya diperiksa dengan panggilan klasifikasi LLM menggunakan model guardrail yang dipilih.
- **Kredensial Google / kustom** — semua kategori diperiksa dengan panggilan klasifikasi LLM menggunakan kredensial dan model guardrail yang dipilih.

Ketika model utama Anda menggunakan penyedia kustom (misalnya Zhipu, Cerebras) yang mungkin mengembalikan 404 atau error API lainnya, pilih **kredensial OpenAI atau Google** untuk guardrails.

## Format Error

Ketika guardrail dipicu, node akan memunculkan error dengan pesan:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

`output` dari hasil node juga menyertakan `guardrail_violated_categories` (array label kategori yang dilanggar) sehingga Debug Panel dan Execution History dapat menampilkan "Blocked by: X, Y" dengan jelas.

Gunakan opsi **Continue on error** pada node (atau [Error Handler](../nodes/error-handler-node.md)) untuk mengarahkan workflow ke cabang fallback ketika guardrails terpicu.

## Contoh Workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Catatan

- **Tanpa percobaan ulang**: Pelanggaran guardrail adalah pemblokiran yang disengaja dan tidak pernah dicoba ulang, bahkan jika node memiliki opsi "Retry on failure" yang diaktifkan.
- Tidak diperlukan migrasi basis data — pengaturan guardrail disimpan dalam JSON node workflow bersama data node lainnya.
- Guardrails memeriksa **pesan pengguna** yang telah diselesaikan (setelah ekspresi template dievaluasi), bukan template mentahnya.
- Menetapkan **tanpa kategori** saat guardrails diaktifkan setara dengan menonaktifkannya — tidak ada pemeriksaan yang dilakukan.
- Pada tingkat **Low**, klasifikasi LLM selalu dijalankan (cakupan multibahasa terbaik). Kredensial OpenAI juga menjalankan Moderation API.
- Pada tingkat **Medium/High**, kredensial OpenAI menggunakan Moderation API untuk kategori yang didukung secara native dan klasifikasi LLM untuk sisanya. Kredensial Google/kustom selalu menggunakan klasifikasi LLM.
- Klasifikasi LLM bersifat **language-agnostic** — mendeteksi pelanggaran dalam bahasa Turki, Arab, Rusia, Spanyol, dan bahasa lainnya.
