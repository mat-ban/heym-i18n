# LLM

Node **LLM** memproses teks dengan model bahasa atau menghasilkan gambar. Node ini mendukung pembuatan teks, vision (input gambar), pembuatan gambar, output JSON terstruktur, dan eksekusi **Batch API** native penyedia untuk model teks yang didukung.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1, ditambah `batchStatus` opsional saat mode batch diaktifkan |
| Output | `$nodeLabel.text` (teks), `$nodeLabel.image` (gambar), atau field hasil batch seperti `$nodeLabel.results` |

## Parameter

### Credential & Model

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | LLM credential dari [Credentials](../tabs/credentials-tab.md) |
| `model` | string | Nama model (mis. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` untuk gambar) |
| `fallbackCredentialId` | UUID (opsional) | Credential fallback saat credential utama gagal |
| `fallbackModel` | string (opsional) | Model fallback saat model utama gagal |

Jika credential atau model utama mengembalikan error, node secara otomatis mencoba ulang dengan credential dan model fallback sebelum gagal.

Heym juga memeriksa **kemampuan batch** dari credential dan model yang dipilih. Mode batch tersedia untuk:

- Credential OpenAI
- Credential Custom / kompatibel OpenAI yang endpoint-nya menyediakan API `/v1/files` dan `/v1/batches` yang diperlukan

Jika penyedia atau model yang dipilih tidak mendukung eksekusi batch, panel Properties akan menampilkannya secara langsung dan menonaktifkan toggle.

### Prompt (mode teks)

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt. Mendukung [ekspresi](../reference/expression-dsl.md). |
| `userMessage` | string | Pesan pengguna. Default: `$input.text` |
| `temperature` | number | 0.0–2.0 (default: 0.7) |
| `maxTokens` | number | Token respons maksimum (opsional) |
| `requestTimeoutSeconds` | number | Detik maksimum untuk menunggu respons model sebelum timeout (default: 60). Naikkan untuk penyedia yang lambat atau self-hosted (LiteLLM, vLLM, model lokal). |

### Gambar & Output

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Pembuatan teks atau gambar |
| `imageInputEnabled` | boolean | Sertakan gambar dengan pesan pengguna (vision) |
| `imageInput` | expression | Data URL Base64 atau URL gambar |
| `jsonOutputEnabled` | boolean | Output JSON terstruktur |
| `jsonOutputSchema` | string | JSON Schema untuk output terstruktur |
| `extraBodyEnabled` | boolean | Kirim parameter request khusus penyedia (default: `false`) |
| `extraBody` | string | Objek JSON yang digabungkan ke body request API |

### Model reasoning (o1, o3)

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Aktifkan untuk model reasoning |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Kedalaman reasoning |

### Mode Batch

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Gunakan Batch API native penyedia alih-alih eksekusi request tunggal |

Mode batch hanya tersedia pada node **LLM**. Mode ini **tidak** berlaku untuk [Agent Node](./agent-node.md).

Saat mode batch diaktifkan:

- `outputType` harus tetap `text`
- `imageInputEnabled` harus tetap `false`
- `userMessage` harus menghasilkan **array**
- setiap item array harus menghasilkan string atau nilai primitif

Contoh umum:

- `$input.items.map("item.text")`
- `$vars.promptList`

Jika ekspresi menghasilkan string tunggal alih-alih array, eksekusi akan gagal dengan error validasi sebelum panggilan ke penyedia dimulai.

## Cabang Batch Status

Saat mode batch diaktifkan, node LLM mengekspos handle output kedua: `batchStatus`.

Gunakan cabang tersebut untuk notifikasi, logging, pesan Slack, atau efek samping selama batch masih berjalan. Cabang ini dipicu setiap kali status penyedia berubah secara signifikan, termasuk state yang dinormalisasi seperti:

- `pending`
- `processing`
- `completed`
- `failed`

Payload cabang status tersedia sebagai `$input` di dalam node downstream dan mencakup:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Contoh edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Contoh status mapper:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Bentuk Hasil Batch

Setelah selesai dengan sukses, output LLM utama berisi:

- `$nodeLabel.text` – teks sukses yang digabungkan
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – hasil per item dalam urutan asli
- `$nodeLabel.usage`

Setiap item dalam `$nodeLabel.results` mencakup field seperti:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Saat **JSON output** diaktifkan bersamaan dengan mode batch, Heym mem-parsing setiap item sukses secara terpisah. Objek yang telah diparsing diekspos per item dan dikumpulkan pada `parsedResults`.
## Responses API

Sebuah checkbox **Use Responses API** mengarahkan panggilan node melalui
[Responses API](https://platform.openai.com/docs/api-reference/responses) alih-alih Chat
Completions. Opsi ini nonaktif secara default, dan node berperilaku sama dalam kedua kondisi: prompt yang sama,
skema output JSON yang sama, bentuk hasil yang sama.

Opsi ini berfungsi dengan kredensial OpenAI, dan dengan kredensial kustom yang gateway-nya mendukung
endpoint tersebut, sehingga penyiapan self-hosted atau melalui proxy juga dapat menggunakannya. Dengan kredensial Google, opsi ini tetap
dinonaktifkan, dan tidak dapat dikombinasikan dengan [Batch mode](#batch-status-branch) - panel node akan menampilkan
posisi kredensial tertentu sebelum Anda menjalankan apa pun.

Jika endpoint ternyata tidak tersedia pada saat runtime, node akan gagal dengan pesan yang menyebutkan
penyebabnya alih-alih diam-diam melakukan fallback, sehingga node yang dikonfigurasi untuk Responses API selalu
berjalan di atasnya. Untuk melakukan fallback ke kredensial atau model lain secara sengaja, gunakan field **Fallback
Credential** dan **Fallback Model**; keduanya mewarisi checkbox ini, sehingga kredensial fallback
juga harus mendukung endpoint tersebut.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Saat menggunakan [Input](./input-node.md) untuk prompt, gunakan `$userPrompt.body.text` di `userMessage`

## JSON Output

Saat `jsonOutputEnabled` bernilai true, LLM mengembalikan JSON yang sesuai dengan skema. Akses field melalui `$nodeLabel.fieldName`.

## Extra Body

Beberapa provider menerima parameter request yang tidak tercakup oleh field standar yang
kompatibel dengan OpenAI, seperti menonaktifkan mode thinking suatu model. Centang **Send extra request body** di
properti node dan masukkan objek JSON. Objek ini digabungkan ke setiap request API yang dibuat node ini.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Nonaktif secara default.** Dengan checkbox tidak dicentang, tidak ada tambahan yang dikirim.
- Harus berupa **objek** JSON. Array, skalar, atau teks yang tidak valid akan menggagalkan node dengan
  `Invalid extra body JSON` alih-alih diabaikan secara diam-diam.
- Tombol **Format** di samping checkbox akan memformat ulang JSON, dan berubah merah bertuliskan
  `Invalid` ketika teks tidak dapat di-parse.
- Diterapkan pada completion utama, upaya model fallback, dan request batch mode.
  **Tidak** diterapkan pada image generation atau pada pemeriksaan guardrail, yang menggunakan bentuk request
  berbeda dan model terpisah.
- Ekspresi `$` diselesaikan sebelum parsing, sehingga `{"max_tokens": $prev.limit}` berfungsi. Karena
  ini merupakan substitusi tekstual, nilai hasil resolusi yang mengandung tanda kutip ganda atau baris baru
  menghasilkan JSON yang tidak valid dan menggagalkan node.

## Contoh – Text

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Contoh – Batch text

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Contoh – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

Aktifkan **Guardrails** di properti node untuk memblokir pesan pengguna yang tidak aman sebelum panggilan LLM. Lihat [Guardrails](../reference/guardrails.md) untuk referensi lengkapnya.

## Terkait

- [Agent Node](./agent-node.md) – LLM dengan tool calling
- [Why Heym](../getting-started/why-heym.md) – Di mana langkah LLM berada dalam siklus hidup agent
- [Guardrails](../reference/guardrails.md) – Memblokir kategori konten yang tidak aman
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Expression DSL](../reference/expression-dsl.md) – Mereferensikan data dalam prompt
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau backend langsung untuk prompt
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan kunci API LLM
- [Quick Start](../getting-started/quick-start.md) – Workflow LLM dasar
