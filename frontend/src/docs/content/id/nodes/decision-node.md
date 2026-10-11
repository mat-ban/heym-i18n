# Keputusan

Node **Decision** mengajukan pertanyaan berjenis kepada model decision tentang status run saat ini dan mengembalikan probabilitas. Node ini tidak menghasilkan teks. Gunakan node ini ketika sebuah workflow memerlukan penilaian yang dapat dijadikan dasar percabangan — routing, triage, pemeringkatan, verifikasi, atau gating pada langkah yang tidak dapat dibatalkan.

Model decision (juga disebut model *System One*) adalah jenis model yang berbeda dari LLM. Tidak ada prompt, tidak ada system instruction, tidak ada temperature, dan tidak ada tool calling. Anda mengirimkan sebuah **state** beserta peta **questions**, dan setiap jawaban dikembalikan sebagai angka dengan distribusi probabilitas di baliknya. Karena jawabannya hanya beberapa token, model ini cepat dan murah dibandingkan meminta [LLM](./llm-node.md) menghasilkan JSON lalu mem-parsing-nya.

Untuk pembuatan teks, gunakan node [LLM](./llm-node.md). Untuk model yang memanggil tools, gunakan [Agent Node](./agent-node.md).

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Respons provider apa adanya — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial *Decision Model*. Bukan kredensial LLM. |
| `model` | string | Nama model, misalnya `jev-latest` |
| `state` | expression | Apa yang harus dibaca oleh model (default `$input.text`) |
| `questions` | array | Baris pertanyaan berurutan; minimal satu |
| `customBodyEnabled` | boolean | Kirim body request yang ditulis manual alih-alih menggunakan form |
| `customBody` | expression (JSON) | Body yang dikirim ketika toggle aktif |
| `requestTimeoutSeconds` | number | Waktu tunggu maksimum dalam detik (default: 60) |

### State

**State** adalah situasi yang dinilai oleh model. Menerima string, object, atau array.

Field yang berisi tepat satu expression mempertahankan tipenya sendiri, sehingga `$input` mengirimkan object itu sendiri alih-alih teksnya. Template dengan expression di dalamnya (`Ticket: $input.text`) akan menghasilkan string. Berikan setiap pertanyaan cukup informasi untuk dijawab: teks sumber, identitas, relasi, kebijakan, dan fakta terkini.

## Jenis pertanyaan

Setiap pertanyaan memiliki `id`, `type`, `instructions`, dan kriteria yang bergantung pada tipenya.

`id` adalah cara workflow Anda membaca kembali jawabannya. `id` **tidak pernah dikirim ke model**, sehingga seluruh makna harus ada di dalam `instructions`. Menulis `id: is_urgent` dengan `instructions: "Is it?"` tidak memberi model apa pun untuk dikerjakan.

### Noul

Apakah suatu kondisi terpenuhi. Mengembalikan probabilitas bahwa jawabannya ya, dari 0 hingga 1.

Kriteria bersifat opsional: **Yes means** dan **No means** menjelaskan cakupan masing-masing sisi. Nilai mendekati 0,5 berarti model menilai ya dan tidak kurang lebih sama mungkinnya — bukan "intensitas sedang".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Baca dengan `$triage.answers.is_urgent.noul`.

### Choice

Memilih satu opsi dari himpunan yang Anda tentukan. Mengembalikan opsi yang dipilih, distribusi lengkapnya, dan confidence yang diturunkan darinya.

Tambahkan opsi yang mencakup "none of these" setiap kali mungkin tidak ada yang cocok — model tidak dapat memilih opsi yang tidak Anda sediakan.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Baca dengan `$triage.answers.department.choice`, `.probabilities.billing` dan `.confidence`.

### Score

Menilai state berdasarkan rubrik berurutan. Mengembalikan nilai berbobot probabilitas yang dapat berada **di antara** level, beserta legend dan distribusinya.

Level diurutkan dari terendah terlebih dahulu, minimal dua dan maksimal sepuluh. Setiap level harus menggambarkan situasi konkret dan berdiri sendiri.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Baca dengan `$triage.answers.frustration.score`, `.legend` dan `.confidence`.

## Generate with AI

**Generate with AI** mengubah satu kalimat biasa menjadi saran template state dan sekumpulan baris pertanyaan. Deskripsikan apa yang ingin Anda nilai — "triage tiket dukungan yang masuk: seberapa mendesak, tim mana yang menanganinya, dan seberapa frustrasi pelanggannya" — lalu tinjau hasilnya sebelum menambahkannya ke node.

Penyusunan draf dilakukan oleh LLM, sehingga dialog meminta kredensial LLM. Model decision akan menjawab pertanyaannya nanti, saat workflow berjalan. Id yang dihasilkan akan di-deduplikasi terhadap baris yang sudah dimiliki node, sehingga melakukan generate dua kali tidak akan pernah menimpa answer key yang sudah ada.

Setiap generasi dicatat di tab [Traces](../tabs/traces-tab.md) di bawah sumber **Decision Questions**, bersama dengan trace `decision.systemone` yang ditulis oleh node itu sendiri saat run.
## Custom request body

Aktifkan **Custom request body** untuk mengirim JSON yang Anda tulis sendiri alih-alih menggunakan form. Gunakan fitur ini untuk endpoint yang kontraknya berbeda dari yang dibangun oleh form.

Editor diisi dari form saat ini, dan ekspresi di dalamnya diselesaikan sebelum permintaan dikirim. Selama toggle aktif, kolom State dan baris pertanyaan diabaikan. Respons diteruskan tanpa perubahan dalam kedua kasus, sehingga kontrak yang berbeda cukup menghasilkan bentuk yang berbeda untuk dibaca oleh ekspresi Anda.

## Output

Node mengembalikan persis seperti yang dikembalikan oleh penyedia. Tidak ada yang diubah namanya atau diratakan.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Branching pada sebuah jawaban

Node [Switch](./switch-node.md) melakukan routing berdasarkan opsi yang dipilih, dan node [Condition](./condition-node.md) dapat mengirim kasus dengan confidence rendah ke tempat yang akan dilihat oleh manusia:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Jawaban yang bertipe menjamin bentuknya, bukan kebenarannya. Pilih threshold berdasarkan data dan konsekuensi Anda sendiri daripada menyalin angka dari contoh.

## Credential

Buat credential **Decision Model** di tab [Credentials](../tabs/credentials-tab.md) dengan:

- **Base URL** — endpoint, misalnya `https://api.typesafe.ai`. Heym menambahkan `/v1/systemone`.
- **API Key** — opsional. Endpoint yang tidak memerlukan key dapat dibiarkan kosong.

Mengedit credential akan mempertahankan key yang tersimpan ketika kolom key dibiarkan kosong; ketik ulang hanya untuk menggantinya.

Credential yang sama dapat menilai proses [Evals](../tabs/evals-tab.md): dengan **LLM-as-Judge** dipilih, pilih credential tersebut sebagai judge dan decision model akan menilai setiap jawaban terhadap output yang diharapkan.

Heym memblokir permintaan keluar ke alamat privat dan loopback secara default, sehingga endpoint decision yang Anda jalankan sendiri di `localhost` atau rentang privat memerlukan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Decision model tidak muncul dalam tabel harga LLM yang disinkronkan Heym, sehingga kolom **Cost** di [Traces](../tabs/traces-tab.md) tetap kosong untuk panggilan-panggilan ini. Jumlah token tetap dicatat, dan Anda dapat menambahkan harga Anda sendiri dengan pricing override.

## Error

| Situasi | Yang terjadi |
|-----------|--------------|
| API key tidak valid | Node gagal dengan pesan yang menyebutkan credential |
| Pertanyaan tidak valid | Pesan tingkat field dari penyedia dibawa ke dalam error node |
| Rate limited atau overloaded | Node gagal dengan pesan yang menyatakan kondisi bersifat sementara — aktifkan [retry](../reference/features.md) untuk node ini agar dapat melewatinya |
| ID pertanyaan duplikat atau kosong | Node gagal sebelum permintaan apa pun dikirim |

## Terkait

- [LLM Node](./llm-node.md) – Menghasilkan teks alih-alih penilaian
- [Agent Node](./agent-node.md) – Mengumpulkan bukti dengan tools, lalu menilainya di sini
- [Switch Node](./switch-node.md) – Melakukan routing berdasarkan opsi yang dipilih
- [Condition Node](./condition-node.md) – Membatasi berdasarkan confidence
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Credentials](../reference/credentials.md) – Tipe dan field credential
- [Traces Tab](../tabs/traces-tab.md) – Memeriksa panggilan decision dan penggunaan token
