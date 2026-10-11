# Node Agent

Node **Agen AI** adalah node LLM dengan pemanggilan tool. Node ini dapat menjalankan tool Python, memanggil node canvas yang terhubung sebagai tool, terhubung ke server MCP, menggunakan skill, secara opsional bertindak sebagai orkestrator yang mendelegasikan ke node agen lain, memanggil workflow lain sebagai tool, dan berhenti sejenak untuk [tinjauan manusia](../reference/human-in-the-loop.md).

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1, ditambah `review` opsional saat HITL diaktifkan |
| Output | `$nodeLabel.text`, `$nodeLabel.fieldName` (saat output JSON diaktifkan), atau payload HITL yang tertunda saat menunggu tinjauan |

## Parameter Inti

### Kredensial & Model

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial LLM (API key) dari Pengaturan |
| `model` | string | Nama model (mis. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opsional) | Kredensial cadangan saat kredensial utama gagal |
| `fallbackModel` | string (opsional) | Model cadangan saat model utama gagal |

Tambahkan kredensial di tab [Kredensial](../tabs/credentials-tab.md). Daftar model dimuat dari kredensial yang dipilih. Jika kredensial atau model utama mengembalikan error, node secara otomatis mencoba ulang dengan kredensial dan model cadangan sebelum gagal.

### Prompt

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt untuk AI. Mendukung [ekspresi](../reference/expression-dsl.md). |
| `userMessage` | string | Pesan/prompt pengguna. Default: `$input.text` |
| `jsonOutputEnabled` | boolean | Output JSON terstruktur |
| `jsonOutputSchema` | string | JSON Schema untuk output terstruktur |
| `extraBodyEnabled` | boolean | Kirim parameter permintaan khusus penyedia (default: `false`) |
| `extraBody` | string | Objek JSON yang digabungkan ke setiap permintaan API yang dibuat agen |

Gunakan `$input.text`, `$nodeName.field`, dan sintaks [Expression DSL](../reference/expression-dsl.md) lainnya.

### Model penalaran (o1, o3)

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (default: 0.7), untuk model standar |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Kedalaman penalaran untuk model penalaran |

Saat menggunakan model penalaran (mis. o1, o3), UI menampilkan **Reasoning Effort** alih-alih Temperature. Untuk model standar, **Temperature** mengontrol kreativitas.

**Contoh output JSON:** Saat Anda memerlukan data terstruktur dari agen (mis. klasifikasi, ekstraksi), aktifkan output JSON dan berikan schema. Agen mengembalikan JSON yang sesuai dengan schema; akses field berdasarkan nama pada output node:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Node hilir dapat menggunakan `$agentLabel.status`, `$agentLabel.reason`, dan seterusnya. Perilaku yang sama dengan output JSON [node LLM](../nodes/llm-node.md).

## Tinjauan Manusia (HITL)

Gunakan HITL saat agen mungkin memerlukan persetujuan pada momen tertentu sebelum tindakan penting.

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Menambahkan checkpoint tinjauan manusia ke agen |
| `hitlSummary` | string | Panduan persetujuan yang memberi tahu agen kapan tinjauan manusia diperlukan |

Saat HITL diaktifkan, agen menerima tool `request_human_review`. Gunakan system prompt dan
field panduan ini untuk menjelaskan pemanggilan tool, sub-agen, sub-workflow, tindakan MCP, skill,
atau efek samping mana yang memerlukan persetujuan. Agen dapat memanggil tool tersebut hanya saat
diperlukan, termasuk beberapa kali dalam satu eksekusi.

Ringkasan yang ditampilkan kepada peninjau pada halaman publik dihasilkan dari permintaan tinjauan
agen saat runtime. Jika agen tidak memberikan ringkasan secara eksplisit, Heym menurunkannya dari
badan tinjauan Markdown.

Untuk tool MCP, Heym meminta model untuk menafsirkan instruksi HITL tertulis Anda sebagai salah
satu dari tiga cakupan: `always`, `once`, atau `never`. Artinya, frasa bebas seperti "untuk setiap
panggilan", "hanya satu kali", atau "jangan pernah bertanya" dinormalisasi sebelum gating runtime
diterapkan.

Setiap checkpoint HITL membuat tautan tinjauan publik sekali pakai di `/review/{token}`. Peninjau dapat:

- **Accept** teks tinjauan Markdown asli
- **Edit & Continue** dengan Markdown yang dimodifikasi
- **Refuse** dan melanjutkan dengan `text: ""`

Saat HITL diaktifkan, node juga mengekspos handle output `review` pada canvas. Hubungkan cabang tersebut ke Slack, email, atau node notifikasi lain jika Anda ingin menyiarkan URL tinjauan dan ringkasan segera setelah eksekusi berhenti sejenak.

Eksekusi berpindah ke status `pending` hingga peninjau merespons. Teks tinjauan adalah satu badan Markdown, dan payload yang tertunda juga menyertakan teks tautan yang dapat dibagikan untuk penyerahan eksternal. Node pada cabang `review` berjalan segera saat jeda dibuat; jalur output normal hanya berlanjut setelah persetujuan. Setelah persetujuan, Heym melanjutkan dari snapshot eksekusi yang tersimpan dan agen melanjutkan dengan konteks yang disetujui. Jika langkah berikutnya juga memerlukan persetujuan, agen dapat membuat checkpoint HITL lain. Lihat [Human-in-the-Loop](../reference/human-in-the-loop.md) untuk bentuk payload, perilaku URL tinjauan, dan semantik lanjutan.

HITL hanya tersedia untuk output agen dalam mode teks. Pada v1, HITL tidak dapat digabungkan dengan `jsonOutputEnabled`.
## Mode Orchestrator

Saat diaktifkan, agen dapat mendelegasikan tugas ke node agen lain dalam workflow. Jika **mode Orchestrator dinonaktifkan**, agen **tidak dapat membuat koneksi agen→agen** di kanvas.

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Saat `true`, agen mendapatkan tool `call_sub_agent` |
| `subAgentLabels` | string[] | Label node agen yang dapat dipanggil oleh orchestrator ini |

**Sub-agen** harus menggunakan `$input.text` pada User Message mereka agar menerima prompt dari orchestrator.

Saat orchestrator memanggil beberapa sub-agen dalam satu giliran, sub-agen tersebut dieksekusi secara paralel. Lihat [Agent Architecture](../reference/agent-architecture.md) untuk detailnya.

## Sub-Workflow

Saat dikonfigurasi, agen menerima tool `call_sub_workflow` untuk mengeksekusi workflow lain.

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID workflow yang dapat dipanggil oleh agen ini sebagai tool |

Pilih workflow pada bagian Sub-Workflows di konfigurasi agen. Agen akan memanggilnya dengan `workflow_id` dan `inputs` (objek yang sesuai dengan field input workflow target). Kedalaman maksimum: 5 pemanggilan sub-workflow bersarang.

## Tool Node Kanvas

Anda dapat menghubungkan node workflow yang didukung ke handle **tools** milik agen sehingga agen dapat memanggil node tersebut saat runtime. Hal ini mengubah aksi dan transformasi kanvas yang sudah ada menjadi tool yang dapat dipanggil tanpa menulis Python.

Gunakan tool node kanvas ketika Anda ingin agen memutuskan kapan menjalankan node yang telah dikonfigurasi, sambil tetap menyimpan credential, field statis, dan pengaturan khusus workflow di UI node.

### Field yang disediakan agen

Field pada node tool yang terhubung dapat ditandai dengan ikon bot. Field yang ditandai menjadi parameter tool wajib yang harus disediakan agen saat memanggil node. Field yang tidak ditandai tetap statis dan dibaca dari konfigurasi node.

Sebagai contoh:

- Hubungkan node Slack ke agen sebagai tool
- Biarkan credential tetap statis di node Slack
- Tandai `message` sebagai disediakan agen
- Agen menerima tool Slack di mana agen hanya menyediakan pesan saat runtime

Jika node tidak terhubung ke agen sebagai tool, ikon bot disembunyikan dan node berperilaku seperti langkah workflow biasa.

### Perilaku runtime

Saat agen memanggil tool node kanvas, Heym untuk sementara menggabungkan argumen yang disediakan agen ke dalam data node tersebut, mengeksekusi node, mengembalikan output node ke agen, lalu memulihkan konfigurasi node semula. Node tool tidak berjalan sebagai langkah workflow biasa melalui penjadwalan normal; node tersebut hanya berjalan ketika agen memanggilnya.

Tool node kanvas berguna dengan node integrasi seperti Slack, Telegram, HTTP, Send Email, dan node pembentuk data seperti [Set](./set-node.md). Node Trigger, node control-flow, dan pemeta output terminal ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) tidak dapat digunakan sebagai tool agen.

## Tool Python

Definisikan tool kustom yang dapat dipanggil agen. Setiap tool memiliki:

| Field | Tipe | Deskripsi |
|-------|------|-------------|
| `name` | string | Nama tool (mis. `count_characters`) |
| `description` | string | Deskripsi untuk LLM |
| `parameters` | JSON Schema | Skema function-calling OpenAI (format objek) |
| `code` | string | Kode fungsi Python |

**Parameters** harus berupa objek JSON, bukan string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Contoh tool:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Tool Python dijalankan sebagai kode tidak tepercaya di dalam container Docker yang terisolasi dan diperketat secara default (tanpa jaringan, tanpa Docker socket, filesystem read-only, non-root). Import dibatasi pada allowlist modul standard-library yang aman. Lihat [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) untuk konfigurasi (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Detik maksimum per eksekusi tool (default: 30) |
| `requestTimeoutSeconds` | number | Detik maksimum untuk menunggu setiap respons model sebelum timeout (default: 60). Naikkan untuk provider yang lambat atau self-hosted (LiteLLM, vLLM, model lokal) dan eksekusi multi-langkah yang panjang. |
## Koneksi MCP

Hubungkan ke server [Model Context Protocol](https://modelcontextprotocol.io/) untuk mengekspos tools mereka kepada agen.

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Jenis koneksi |
| `timeoutSeconds` | number | Timeout untuk koneksi ini (default: 30) |
| `label` | string | Nama tampilan opsional |

**stdio** (proses lokal):

| Field | Deskripsi |
|-------|-------------|
| `command` | Perintah yang akan dijalankan (misalnya `npx`) |
| `args` | JSON array (misalnya `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON object berisi environment variable yang disuntikkan ke dalam proses (misalnya `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Sebagian besar server stdio yang menggunakan API key melakukan autentikasi melalui environment variable, bukan argumen perintah. Tetapkan `env` per koneksi agar setiap node agen dapat menggunakan kredensial yang berbeda tanpa mengubah environment host.

Nilai `env` mendukung [Expression DSL](../reference/expression-dsl.md), sehingga Anda dapat meneruskan input workflow sebagai kredensial alih-alih menuliskan secret secara hardcode:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Ekspresi `$userInput.pat` diselesaikan saat runtime terhadap data input workflow sebelum proses MCP dimulai. Hal ini memungkinkan Anda menerima token dari trigger atau node input alih-alih menyematkannya dalam definisi workflow.

Contoh — GitHub MCP dengan token hardcode:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Contoh — GitHub MCP dengan token dinamis dari input workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Contoh — GitHub MCP dengan kredensial GitHub Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Kredensial GitHub bawaan saat ini ditujukan untuk autentikasi berbasis PAT. Jika Anda memerlukan akses organisasi, gunakan PAT dengan izin org/repositori yang diperlukan.

Contoh — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (server remote):

| Field | Deskripsi |
|-------|-------------|
| `url` | URL endpoint SSE. Mendukung ekspresi (misalnya `$userInput.serverUrl`). |
| `headers` | JSON object untuk header autentikasi/kustom. Nilainya mendukung ekspresi. |

**Streamable HTTP** (server remote):

| Field | Deskripsi |
|-------|-------------|
| `url` | URL endpoint MCP (misalnya `https://example.com/mcp`). Mendukung ekspresi. |
| `headers` | JSON object untuk header autentikasi/kustom. Nilainya mendukung ekspresi. |

## Skills

Skills adalah instruksi SKILL.md ditambah file Python opsional dan aset yang dibundel. Skills memperluas konteks sistem agen dan dapat menambahkan tools Python.

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `name` | string | Nama skill |
| `content` | string | Konten SKILL.md (instruksi) |
| `timeoutSeconds` | number | Timeout untuk eksekusi Python skill (default: 30) |
| `driveFilesEnabled` | boolean | Mengaktifkan helper `heym_drive` saat runtime untuk skill ini (default: false) |
| `files` | array | Entri `{ path, content, encoding, mimeType }` opsional (misalnya skrip `.py` atau aset biner yang disimpan sebagai base64) |

Skills dapat ditambahkan dengan meletakkan file `.zip` atau `.md` ke area Skills.
Setelah memperluas kartu skill, letakkan file apa pun ke skill tersebut untuk melampirkan atau mengganti file yang dibundel, termasuk aset biner seperti PDF dan gambar.
Gunakan tombol unduh pada kartu skill untuk mengekspor skill tersebut sebagai arsip `.zip` untuk pencadangan atau penggunaan ulang di workflow lain.

Aktifkan **Drive files** pada skill hanya ketika kode Python-nya perlu membaca file dari Heym Drive. Skill yang diaktifkan akan menerima helper `heym_drive.py` yang dihasilkan saat runtime dan dapat memanggil `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text`, atau `read_drive_base64` dengan id file Drive atau nama file yang persis. Pencarian nama file menggunakan kecocokan terbaru yang dapat diakses. Skill yang dinonaktifkan tidak menerima helper tersebut.

Setiap kartu skill memiliki empat aksi pada baris di bawah judul:

| Tombol | Deskripsi |
|--------|-------------|
| **Edit with AI** | Membuka Skill Builder untuk merevisi skill dari prompt chat |
| **Download** | Mengekspor skill sebagai arsip `.zip` |
| **Remove** | Menghapus skill dari node agen ini |
| **History** | Membuka riwayat skill yang berasal dari [Edit History](../reference/edit-history.md) |
### Riwayat Skill

Riwayat Skill **tidak** disimpan secara terpisah. Riwayat ini diturunkan dari snapshot Riwayat Edit workflow: setiap versi workflow yang disimpan menyertakan array `skills` lengkap dari node agen.

Dari dialog Riwayat, Anda dapat:

- **Pratinjau** snapshot sebelumnya (SKILL.md dan daftar file)
- **Edit** — memuat snapshot ke editor skill tanpa mengembalikan seluruh workflow
- **AI Fine-tune** — membuka Skill Builder dengan snapshot tersebut sebagai titik awal
- **Kembalikan** — memulihkan hanya skill ini dari versi sebelumnya (node lain tetap seperti semula)

Riwayat mengikuti retensi 7 hari yang sama dengan Riwayat Edit workflow. Menyimpan workflow setelah pengeditan skill akan membuat entri riwayat baru.

Bagian Skills juga menyertakan **AI Build**:

- Klik **AI Build** untuk membuat skill baru dari prompt chat
- Klik tombol sparkle pada skill yang sudah ada untuk merevisinya dengan AI
- Jatuhkan file ke prompt composer untuk melampirkannya ke komentar fine-tune; file tersebut juga disimpan sebagai aset skill yang dibundel
- Modal tersebut menampilkan teks asisten secara streaming sambil menampilkan pratinjau file `SKILL.md` dan `.py` secara langsung
- **Download ZIP** mengekspor pratinjau saat ini tanpa menambahkannya ke node
- **Save & Add** menyimpan file yang dihasilkan kembali melalui alur parsing ZIP yang sama dengan yang digunakan untuk unggahan manual

Saat mengedit dengan AI, Heym hanya mengirim file skill teks `.md` dan `.py` ke builder. Lampiran biner dan non-editable lainnya dipertahankan dan dibagikan ke builder sebagai metadata path agar kode Python yang dihasilkan dapat mempertahankan referensi file relatif dengan benar.
Pilih file terlampir di panel kanan dan aktifkan **Include this file in AI context** ketika AI perlu memeriksa template yang dibundel. File teks, PDF, dan DOCX diekstrak ke konteks prompt jika memungkinkan; Heym tidak menerapkan batas ukuran lampiran Skill Builder terpisah di luar batas body permintaan platform.

## Extra Body

Beberapa provider menerima parameter permintaan yang tidak tercakup oleh field standar yang kompatibel dengan OpenAI, seperti menonaktifkan mode thinking suatu model. Centang **Send extra request body** di properti node dan masukkan objek JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Dinonaktifkan secara default.** Dengan checkbox tidak dicentang, tidak ada tambahan yang dikirim.
- Diterapkan ke **setiap** permintaan dalam loop tool-calling, bukan hanya turn pertama, ditambah upaya model fallback. Tidak diterapkan ke pemeriksaan guardrail, yang menggunakan model terpisah.
- Harus berupa **objek** JSON. Array, skalar, atau teks yang tidak valid akan menggagalkan node dengan `Invalid extra body JSON` alih-alih diabaikan secara diam-diam.
- Ekspresi `$` diselesaikan sebelum parsing. Karena ini merupakan substitusi tekstual, nilai yang telah diselesaikan yang mengandung tanda kutip ganda atau baris baru akan menghasilkan JSON yang tidak valid dan menggagalkan node.

Field dan perilaku yang sama dengan extra body pada [node LLM](./llm-node.md).

## Guardrails

Aktifkan **Guardrails** di properti node untuk memblokir pesan pengguna yang tidak aman sebelum agen berjalan. Lihat [Guardrails](../reference/guardrails.md) untuk referensi lengkapnya.

## Memori persisten (graph)

Knowledge graph opsional **per-node-agen** yang disimpan di database. Saat diaktifkan, Heym menambahkan ringkasan Markdown dari entitas dan relasi yang diingat ke **system instruction** sebelum setiap eksekusi (hanya jika graph tidak kosong). Setelah penyelesaian agen yang **berhasil**, job latar belakang mengekstrak fakta baru yang tahan lama dari percakapan dan menggabungkannya ke dalam graph.

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Mengaktifkan pemuatan + ekstraksi latar belakang untuk node canvas ini |

**Sub-agen** mempertahankan graph **mereka sendiri** (di-key berdasarkan id node mereka), terpisah dari orkestrator.

Gunakan kontrol **brain** berwarna merah muda pada node (saat memori aktif atau baris model ditampilkan) untuk membuka editor graph dan **memory sharing** opsional (workflow/agen lain). Perilaku lengkap, path REST, dan detail ekspor JSON: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API dan kesinambungan reasoning

Checkbox **Use Responses API** mengarahkan panggilan model agen melalui [Responses API](https://platform.openai.com/docs/api-reference/responses) alih-alih Chat Completions. Fitur ini nonaktif secara default.

Fitur ini paling penting pada model reasoning seperti `gpt-5` atau seri `o`. Responses API mengembalikan reasoning model bersama setiap tool call, dan agen mengirimkan item reasoning tersebut kembali pada turn berikutnya, sehingga model mempertahankan rantai pemikirannya di seluruh loop tool multi-langkah alih-alih menurunkannya kembali setelah setiap hasil tool. Seluruh loop berjalan pada jalur yang sama, termasuk jeda dan lanjutkan [human review](#human-review-hitl), [context compression](#context-compression), dan jawaban akhir.

Percakapan itu sendiri tetap berada di Heym. Heym mengirimkan input lengkap pada setiap turn dan membawa reasoning sebagai blob terenkripsi, sehingga tidak ada yang disimpan di sisi provider antar panggilan. Item reasoning di dalam span yang diringkas oleh context compression akan dihapus bersamanya, karena blob terenkripsi tidak dapat diringkas.

Fitur ini berfungsi dengan credential OpenAI, dan dengan credential kustom yang gateway-nya mendukung endpoint tersebut. Dengan credential Google, fitur ini tetap dinonaktifkan.
## Kompresi Konteks

Ketika sebuah agen menjalankan banyak iterasi tool dengan hasil yang besar (web scraping, pembacaan dokumen, output sub-workflow), riwayat pesan yang terakumulasi dapat mendekati batas context window model. Heym secara otomatis mengompresi riwayat percakapan di tengah proses eksekusi untuk mencegah context overflow.

**Cara kerjanya:**

1. Sebelum setiap iterasi tool, Heym memperkirakan jumlah token saat ini (~4 karakter per token).
2. Jika perkiraan tersebut melebihi **80%** dari context window model, kompresi akan dipicu.
3. Riwayat pesan dibagi menjadi bagian yang dipertahankan dan bagian yang dikompresi:
   - **Dipertahankan**: system prompt, pesan pengguna pertama, pesan pengguna terbaru
   - **Dikompresi**: semua yang ada di antaranya (giliran penalaran asisten, pemanggilan tool, hasil tool)
4. Bagian tengah diringkas menggunakan **model dan credential yang sama** — tidak memerlukan konfigurasi tambahan.
5. Ringkasan yang telah dikompresi menggantikan bagian tengah sebagai satu pesan asisten tunggal.

**Observabilitas:**

Peristiwa kompresi muncul sebagai entri `Context compressed (N messages → summary)` di:
- Daftar pemanggilan tool pada **Debug panel** selama eksekusi langsung
- Tampilan detail eksekusi pada **Execution history**
- **Traces tab** sebagai entri trace `context.compression`

Kompresi bersifat otomatis dan selalu aktif untuk node Agent. Fitur ini **tidak** berlaku untuk node LLM, Chat tab, atau sesi AI Assistant.

## Terkait

- [Why Heym](../getting-started/why-heym.md) – Bagaimana agen berjalan dan tetap terkendali di lingkungan produksi
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Knowledge graph per node agen, berbagi opsional, API, editor
- [Agent Architecture](../reference/agent-architecture.md) – Sub-agen, orkestrator, skills, MCP, pemanggilan tool
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Halaman tinjauan publik, eksekusi tertunda, alur setujui/edit/tolak
- [Guardrails](../reference/guardrails.md) – Memblokir kategori konten yang tidak aman
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [AI Assistant](../reference/ai-assistant.md) – Antarmuka chat untuk membangun workflow dengan bahasa alami (berbeda dari node Agent)
- [Expression DSL](../reference/expression-dsl.md) – Mereferensikan data dalam prompt
- [Workflow Structure](../reference/workflow-structure.md) – Node, edge, dan format DSL
- [Quick Start](../getting-started/quick-start.md) – Workflow dasar dengan LLM dan ekspresi
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan API key untuk agen
- [MCP Tab](../tabs/mcp-tab.md) – Mengonfigurasi MCP untuk tool workflow
