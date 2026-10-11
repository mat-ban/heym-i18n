# HTTP

Node **HTTP** melakukan permintaan HTTP menggunakan sintaks cURL. Node ini dapat menjadi titik awal workflow (tanpa edge masuk) atau menerima input dari node upstream.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 atau 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `label` | string | Pengenal node (camelCase) |
| `curl` | string | Perintah cURL (misalnya `curl -X GET https://api.example.com`) |

## Format Respons

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Mengakses Respons

- `$httpNode.status` – Kode status HTTP
- `$httpNode.body` – Body respons (string atau JSON yang telah di-parse)
- `$httpNode.body.fieldName` – Mengakses field JSON
- `$httpNode.headers` – Header respons

## Contoh

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Gunakan sintaks cURL dengan `-H` untuk header, `-d` untuk body POST, dan sebagainya. Ekspresi dapat digunakan di mana saja dalam string curl, termasuk pada URL, header, atau seluruh baris header. [Credential](../reference/credentials.md) Header akan di-resolve menjadi `key: value`, sehingga `-H "$credentials.MyApiKey"` mengirimkan header secara lengkap:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Tanda kutip dan spasi di dalam sebuah ekspresi merupakan bagian dari ekspresi tersebut, bukan bagian dari perintah cURL, sehingga metode yang menerima argumen string dapat digunakan secara inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentikasi dengan Credential

`$credentials.Name` akan di-resolve menjadi nilai yang berbeda untuk setiap tipe [credential](../reference/credentials.md), sehingga baris header bergantung pada tipenya:

| Tipe credential | `$credentials.Name` di-resolve menjadi | Header |
|-----------------|-----------------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | API key mentah | `-H "Authorization: Bearer $credentials.Name"` |
| Google | API key mentah | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | API key mentah | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | OAuth access token yang baru, diperbarui saat kedaluwarsa | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Credential Bearer sudah membawa prefiks `Bearer `, sehingga menambahkan satu lagi akan mengirimkan `Bearer Bearer …`. Credential Google Sheets dan Google Drive memungkinkan Anda memanggil API Google yang tidak tercakup oleh node-nya, seperti menambahkan tab ke spreadsheet, dalam cakupan scope yang diberikan kepada credential tersebut. Ketika sebuah nama bukan merupakan pengenal sederhana (mengandung `-`, diawali dengan digit, atau merupakan reserved word), gunakan bentuk bracket: `-H "Authorization: $credentials["my-api-key"]"`.

Ketika [AI Assistant](../reference/ai-assistant.md) atau [Chat](../tabs/chat-tab.md) membangun permintaan HTTP yang memerlukan autentikasi dan tidak ada node khusus yang mencakup layanan tersebut, ia akan menanyakan credential mana yang akan digunakan. Pilih salah satu, ubah nama header yang telah terisi sebelumnya jika API mengharapkan nama yang berbeda, dan ia akan menuliskan baris header untuk Anda. Asisten hanya melihat nama dan tipe credential, tidak pernah nilainya. Jika Anda tidak memiliki credential yang sesuai, pertanyaan tersebut menawarkan untuk membuatnya. Rahasia yang mencapai output node, seperti `request.headers` yang dikirim, akan disamarkan pada hasil eksekusi.

## Keamanan Egress

- Secara default, URL harus menggunakan `http://` atau `https://` dan hanya di-resolve ke alamat publik. Tujuan loopback, privat, link-local, multicast, dan cloud-metadata akan diblokir.
- Heym memvalidasi alamat yang di-resolve dan menyematkan target koneksi untuk mencegah DNS rebinding. Proxy lingkungan dinonaktifkan selama guard aktif. Redirect tidak diikuti secara default; tambahkan opsi `-L` dari cURL untuk mengikutinya. Ketika diaktifkan, setiap hop redirect diperiksa terhadap kebijakan alamat publik yang sama dan disematkan sebelum terhubung.
- Deployment self-hosted tepercaya yang secara sengaja terhubung ke layanan internal dapat menetapkan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Pertahankan nilai default pada deployment hosted atau multi-tenant.

**Catatan upgrade untuk v0.0.105:** kebijakan tingkat instance ini kini juga melindungi tujuan yang berasal dari credential yang digunakan oleh Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, eksekusi LLM kustom dan penemuan model, AI assistant, guardrails, serta embedding RAG. Credential yang ada yang mengarah ke alamat loopback, privat, atau link-local akan ditolak kecuali `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` diaktifkan pada instance self-hosted tepercaya. Selama guard aktif, klien HTTP yang dijaga akan mengabaikan `HTTP_PROXY` dan `HTTPS_PROXY`; mengaktifkan opt-out akan memulihkannya. Bundel CA operator yang dikonfigurasi melalui `SSL_CERT_FILE` atau `SSL_CERT_DIR` tetap didukung. ClickHouse diperiksa sebelum koneksi dibuka tetapi tidak disematkan pada waktu dial, karena clickhouse-connect membawa transport urllib3-nya sendiri.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Triggers](../reference/triggers.md) – HTTP sebagai titik masuk workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan API key untuk permintaan yang terautentikasi
