# RAG / Penyimpanan Vektor

Node **RAG / Vector Store** menyisipkan, melakukan upsert, menghapus, dan mencari dokumen di dalam vector store untuk Retrieval Augmented Generation (RAG). Gunakan node ini untuk memperkaya konteks LLM dengan dokumen yang relevan, dan untuk menjaga konteks tersebut tetap selaras dengan sistem asal dokumen.

Node ini memiliki dropdown **Database** yang memilih backend:

- **Qdrant** – menyimpan vektor di server Qdrant eksternal (memerlukan kredensial *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – menyimpan vektor di dalam database Postgres milik Heym sendiri, tanpa layanan eksternal (memerlukan kredensial *RAG: Psql + OpenAI*).

Nilai default adalah **Qdrant** untuk kompatibilitas mundur. Mengubah Database akan memfilter daftar **Vector Store** menjadi store yang didukung oleh database tersebut. Kedua backend mendukung operasi, pemfilteran metadata, dan reranking Cohere yang sama.

Kedua backend juga dapat diakses melalui kredensial *RAG: Custom Embeddings*, yang menggantikan OpenAI dengan endpoint embedding apa pun yang kompatibel dengan OpenAI dan menamai vector store-nya sendiri. Store yang dibuat dari kredensial semacam itu akan muncul di bawah Database mana pun yang menjadi targetnya. Lihat [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend vector store (default: `"qdrant"`) |
| `vectorStoreId` | UUID | Vector store dari tab [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Jenis operasi (juga `operation`) |
| `documentContent` | expression | Teks dokumen yang akan disimpan (insert, upsert) |
| `documentMetadata` | JSON string | Metadata untuk dokumen yang disimpan (insert, upsert); nilai mendukung expression |
| `documentIdField` | string | Field payload yang menyimpan id unik (upsert, delete; default `doc_id`) |
| `documentId` | expression | Nilai id unik (upsert, delete) |
| `queryText` | expression | Query pencarian (hanya search) |
| `searchLimit` | number | Hasil maksimum (default: 5) |
| `metadataFilters` | JSON string | Filter metadata untuk pencarian (nilai mendukung expression) |
| `enableReranker` | boolean | Gunakan Cohere untuk melakukan reranking hasil pencarian |
| `rerankerCredentialId` | UUID | Kredensial Cohere untuk reranking |
| `rerankerTopN` | number | Jumlah hasil teratas yang dipertahankan setelah reranking |

## Operasi

### Insert

Menambahkan dokumen ke vector store.

| Field | Wajib | Deskripsi |
|-------|----------|-------------|
| `documentContent` | ya | Teks yang akan di-embed dan disimpan |
| `documentMetadata` | tidak | Objek JSON, misalnya `{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expression metadata

Nilai metadata menerima expression, sehingga sebuah dokumen dapat disimpan dengan konteks dari proses run:

```json
{ "url": "$start.url", "category": "faq" }
```

Expression diselesaikan setelah JSON di-parse, bukan dengan menyubstitusi teks ke dalamnya, sehingga nilai yang berisi tanda kutip atau baris baru tidak dapat memecah objek tersebut. Nilai yang merupakan satu expression utuh akan mempertahankan tipe hasilnya — `{"count": "$start.count"}` menyimpan sebuah number, bukan `"7"` — hal ini penting karena `metadataFilters` pada pencarian mencocokkan berdasarkan tipe yang persis. Teks campuran seperti `"page $start.count"` akan menghasilkan string, dan objek serta array bersarang juga ditelusuri.

Hal yang sama berlaku untuk `upsert`, dan untuk `metadataFilters` pada search: JSON di-parse terlebih dahulu dan nilainya diselesaikan setelahnya, dengan aturan yang sama. Jadi filter yang ditulis sebagai `{"count": "$start.count"}` akan mencocokkan number yang disimpan oleh insert, bukan string `"7"`.

### Workflow mana yang menyimpan sebuah dokumen

Dokumen yang disimpan tanpa `source` miliknya sendiri akan ditandai dengan workflow yang menyimpannya, sebagai `source: "workflow:<workflow name>"`. Tab [Vectorstores](../tabs/vectorstores-tab.md) mengelompokkan dokumen-dokumen tersebut di bawah **Added workflow: _name_**, sehingga isi sebuah store menunjukkan dari mana setiap dokumen berasal, dan dokumen milik satu workflow dapat dihapus sebagai satu grup. Menetapkan `source` sendiri di dalam `documentMetadata` selalu menang atas penandaan tersebut.

### Upsert

Menyisipkan dokumen, atau menggantikan dokumen yang sudah tersimpan di bawah id unik yang sama.

Id adalah field **di dalam payload**, bukan point id internal store, sehingga dokumen mempertahankan pengenal yang sudah digunakan oleh sistem Anda sendiri — id record CRM, SKU, slug halaman. `documentIdField` menamai field tersebut dan `documentId` membawa nilainya.

| Field | Wajib | Deskripsi |
|-------|----------|-------------|
| `documentId` | ya | Id unik dokumen (mendukung expression) |
| `documentContent` | ya | Teks yang akan di-embed dan disimpan |
| `documentIdField` | tidak | Field payload tempat id berada (default `doc_id`) |
| `documentMetadata` | tidak | Objek JSON, misalnya `{"source": "crm", "url": "$start.url"}` (nilai mendukung expression) |

Setiap point yang field id-nya cocok akan dihapus terlebih dahulu, sehingga dokumen yang sebelumnya tersimpan sebagai beberapa chunk akan digantikan secara utuh, bukan diduplikasi. Field id dituliskan ke dalam payload untuk Anda, dan point id tetap stabil di seluruh upsert dari dokumen yang sama.

**Output:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — apakah versi yang sudah ada digantikan), `$nodeLabel.replaced_count`
### Hapus

Menghapus dokumen berdasarkan id unik yang sama.

| Field | Wajib | Deskripsi |
|-------|----------|-------------|
| `documentId` | ya | Id unik dokumen (mendukung ekspresi) |
| `documentIdField` | tidak | Field Payload tempat id berada (default `doc_id`) |

**Output:** `$nodeLabel.deleted` – `true` ketika setidaknya satu point cocok, `false` ketika id
tidak ada di dalam store. `$nodeLabel.deleted_count` menyimpan berapa banyak point yang dihapus.

Menghapus id yang tidak ada bukanlah sebuah error: node berhasil dengan `deleted: false`, sehingga
branch pembersihan tidak memerlukan guard di depannya.

### Pencarian

Pencarian semantik untuk dokumen yang serupa.

| Field | Wajib | Deskripsi |
|-------|----------|-------------|
| `queryText` | ya | Query pencarian |
| `searchLimit` | tidak | Hasil maksimum (default: 5) |
| `metadataFilters` | tidak | Filter berdasarkan metadata (objek JSON exact match, nilai mendukung ekspresi) |
| `enableReranker` | tidak | Aktifkan reranking Cohere untuk relevansi yang lebih baik |
| `rerankerCredentialId` | saat reranking | Kredensial Cohere |
| `rerankerTopN` | tidak | Jumlah hasil akhir setelah reranking |

**Output:** `$nodeLabel.results` – array dari `{ id, text, score, metadata }`

Ketika reranking diaktifkan:

- `$nodeLabel.reranked` menjadi `true`
- Setiap hasil juga menyertakan `relevance_score`
- `score` tetap merupakan skor similarity vektor asli
- `relevance_score` adalah skor reranker Cohere

## Mengakses Hasil

- `$ragNode.results.first().text` – konten hasil teratas
- `$ragNode.results.first().score` – skor similarity (0–1)
- `$ragNode.results.first().metadata.source` – metadata hasil teratas
- `$ragNode.results.map("item.text").join("\n\n")` – gabungkan untuk konteks LLM
- `$ragNode.reranked` – apakah reranking diterapkan
- `$ragNode.count` – jumlah hasil yang dikembalikan
- `$ragNode.replaced` – apakah sebuah upsert menggantikan dokumen yang sudah ada
- `$ragNode.deleted` – apakah sebuah delete menghapus sesuatu

## Contoh – Pencarian

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Contoh – Insert

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Contoh – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Contoh – Hapus

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## Terkait

- [Why Heym](../getting-started/why-heym.md) – RAG bawaan sebagai bagian dari runtime agen
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – Membuat dan mengelola vector store
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Penyiapan kredensial Qdrant dan Postgres (pgvector)
- [Agent Node](./agent-node.md) – Gunakan hasil RAG sebagai konteks agen
- [LLM Node](./llm-node.md) – Suapkan hasil RAG ke dalam system prompt LLM
