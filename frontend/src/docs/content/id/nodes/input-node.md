# Input

Node **Input** adalah titik masuk untuk workflow yang menerima data dari pengguna atau pemanggil API. Node ini mendukung satu atau beberapa field input dan mengekspos metadata request (headers, query params).

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `value` | string | Nilai default untuk input teks tunggal (opsional) |
| `inputFields` | array | Definisi field input. Setiap item: `{ key, defaultValue? }` |

### Field Input

| Field | Tipe | Deskripsi |
|-------|------|-------------|
| `key` | string | Kunci field (mis. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Nilai default jika tidak disediakan (opsional) |

## Mengakses Data Input

**Field body** (selalu gunakan `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – field teks
- `$userInput.body.imageUrl` – URL gambar
- `$userInput.body.userId` – dengan nilai default jika dikonfigurasi
- `$userInput.body.event.user.id` – JSON bersarang dari mode webhook Generic

**Metadata request** (saat dieksekusi melalui API):

- `$userInput.headers` – semua headers (kunci huruf kecil)
- `$userInput.headers.authorization` – header tertentu
- `$userInput.query` – query parameters
- `$userInput.query.param1` – query param tertentu

## Input File pada Run Panel

Pada tab **Run** di editor (mode webhook Defined), setiap field input mendukung drag-and-drop dan kontrol lampiran inline (di kanan bawah field):

- **File teks** (`.txt`, `.md`, `.json`, `.csv`, dan sejenisnya) dibaca sebagai teks biasa.
- **Gambar** (JPEG, PNG, GIF, WebP) disimpan sebagai URL `data:` (base64) pada nilai field — gunakan kunci field seperti `imageUrl` atau `base64` ketika node hilir mengharapkan data gambar.
- **File PDF** dikonversi menjadi teks yang diekstrak (maksimal file 5 MB, 100k karakter konten).

Satu file per field. Anda tetap dapat mengedit textarea setelah file dimuat. Mode webhook Generic (body JSON mentah) tidak menampilkan kontrol file per field.

## Field Input vs Webhook Generic

`inputFields` tetap mendeskripsikan input yang diharapkan untuk formulir editor mode defined, pemetaan sub-workflow, dan permukaan lain yang digerakkan oleh metadata.

Ketika workflow menggunakan mode body webhook **Generic**, body HTTP yang masuk tidak dibentuk ulang dari `inputFields`. Sebagai gantinya, payload JSON mentah diteruskan ke `$nodeLabel.body`, dan kontrol tambah/hapus field pada node Input disembunyikan di panel node.

## Contoh

**Input tunggal (default):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Beberapa input:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Triggers](../reference/triggers.md) – Titik masuk (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Mereferensikan `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Mengekspos workflow sebagai UI chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP untuk workflow
