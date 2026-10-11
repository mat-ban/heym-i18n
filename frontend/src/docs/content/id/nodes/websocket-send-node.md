# Kirim WebSocket

Node **WebSocket Send** membuka koneksi klien keluar ke server WebSocket eksternal, mengirim satu pesan, lalu menutup koneksi. Gunakan node ini ketika sebuah workflow perlu mendorong event ke sistem realtime tanpa mengekspos endpoint socket milik Heym.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `websocketUrl` | string / expression | URL `ws://` atau `wss://` eksternal |
| `websocketHeaders` | JSON object string / expression | Header handshake opsional |
| `websocketSubprotocols` | string | Daftar subprotocol opsional yang dipisahkan koma |
| `websocketMessage` | expression | Payload yang akan dikirim |

## Aturan Serialisasi Pesan

- Jika `websocketMessage` menghasilkan **string**, Heym mengirim frame teks.
- Jika menghasilkan **object**, **array**, **number**, **boolean**, atau `null`, Heym menserialisasikannya sebagai teks JSON.
- Jika menghasilkan **bytes**, Heym mengirim frame biner.
- Ekspresi penuh seperti `$input` mempertahankan tipe native sebelum serialisasi.

## Field Output

| Expression | Deskripsi |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` jika berhasil |
| `$nodeLabel.url` | URL tujuan yang telah di-resolve |
| `$nodeLabel.message_type` | `text`, `json`, atau `binary` |
| `$nodeLabel.size_bytes` | Ukuran payload dalam byte |
| `$nodeLabel.subprotocol` | Subprotocol yang dinegosiasikan jika ada |
| `$nodeLabel.sent_at` | Timestamp ISO |

## Contoh Workflow

**HTTP request → transform → publish melalui WebSocket**

```
input → set → websocketSend → output
```

- **Set** membuat objek payload seperti `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** menggunakan `$payloadNode` sebagai `websocketMessage`
- **Output** dapat mengembalikan `$socketSend.status`

## Contoh Node JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Catatan

- Node ini tidak memerlukan [credential](../reference/credentials.md).
- Jika server remote mengharapkan header auth atau tenant, teruskan melalui `websocketHeaders`.
- Gunakan [HTTP](./http-node.md) ketika sistem remote berbasis request/response, bukan berbasis socket.

## Keamanan Egress

- Secara default, URL harus menggunakan `ws://` atau `wss://` dan hanya boleh mengarah ke alamat publik. Tujuan loopback, private, link-local, multicast, dan cloud-metadata diblokir.
- Heym memvalidasi setiap alamat yang di-resolve dan terhubung langsung ke salah satu alamat tersebut. Proxy lingkungan dan pengalihan WebSocket dinonaktifkan selama guard aktif.
- Header `Authorization`, `Origin`, `User-Agent`, dan header data kustom didukung. `Origin` dikirim melalui opsi khusus klien WebSocket. Header `Host`, `Connection`, `Upgrade`, dan `Sec-WebSocket-*` tidak dapat ditimpa.
- Deployment self-hosted tepercaya yang secara sengaja terhubung ke layanan internal dapat menetapkan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Biarkan default tetap aktif pada deployment hosted atau multi-tenant.

**Catatan upgrade untuk v0.0.105:** kebijakan tingkat instans ini kini juga melindungi tujuan yang berasal dari credential yang digunakan oleh Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, eksekusi LLM kustom dan penemuan model, asisten AI, guardrails, serta embedding RAG. Credential yang ada yang mengarah ke alamat loopback, private, atau link-local akan ditolak kecuali `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` diaktifkan pada instans self-hosted tepercaya. Selama guard aktif, klien HTTP yang dijaga mengabaikan `HTTP_PROXY` dan `HTTPS_PROXY`; mengaktifkan opt-out akan memulihkannya. Bundel CA operator yang dikonfigurasi melalui `SSL_CERT_FILE` atau `SSL_CERT_DIR` tetap didukung. ClickHouse diperiksa sebelum koneksi dibuka tetapi tidak dipin pada waktu dial, karena clickhouse-connect membawa transport urllib3-nya sendiri.

## Terkait

- [WebSocket Trigger](./websocket-trigger-node.md) – Mendengarkan socket eksternal dan memicu workflow pada event
- [Node Types](../reference/node-types.md) – Ikhtisar node integrasi
- [Expression DSL](../reference/expression-dsl.md) – Membangun payload JSON dinamis
- [Third-Party Integrations](../reference/integrations.md) – Integrasi berbasis credential vs konfigurasi langsung
