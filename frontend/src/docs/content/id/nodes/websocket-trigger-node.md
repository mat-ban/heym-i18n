# WebSocket Trigger

Node **WebSocket Trigger** membuka koneksi klien keluar ke server WebSocket eksternal dan memulai workflow ketika event socket yang dipilih terjadi. Gunakan node ini untuk aliran event seperti feed pasar, telemetri, atau backplane chat. Menghubungkan ke sistem realtime internal memerlukan opt-out URL privat yang dijelaskan di bawah ini.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Perilaku Penting

- Node ini menghubungkan **dari Heym ke server WebSocket lain**.
- Node ini **tidak** mengekspos endpoint WebSocket pada Heym.
- Tidak diperlukan [credential](../reference/credentials.md). Konfigurasikan URL, header, dan subprotokol secara langsung pada node.
- Worker leader menjaga koneksi tetap terbuka di latar belakang dan menghubungkan ulang saat diaktifkan.

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `websocketUrl` | string | URL `ws://` atau `wss://` eksternal |
| `websocketHeaders` | JSON object string | Header handshake opsional |
| `websocketSubprotocols` | string | Daftar subprotokol opsional yang dipisahkan koma |
| `websocketTriggerEvents` | array | Salah satu dari `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Menghubungkan ulang setelah terputus |
| `retryWaitSeconds` | integer | Jeda sebelum menghubungkan ulang |

## Event yang Dipancarkan

### `onMessage`

Terpicu ketika sebuah frame tiba dari socket jarak jauh.

Field yang berguna:

| Ekspresi | Deskripsi |
|----------|-----------|
| `$nodeLabel.message.data` | Payload JSON yang telah di-parse atau nilai pesan mentah |
| `$nodeLabel.message.text` | Teks yang didekode UTF-8 jika tersedia |
| `$nodeLabel.message.base64` | Payload biner sebagai base64 |
| `$nodeLabel.message.sizeBytes` | Ukuran payload |
| `$nodeLabel.message.isJson` | Apakah pesan berhasil di-parse sebagai JSON |

### `onConnected`

Terpicu setelah socket berhasil terbuka.

Field yang berguna:

| Ekspresi | Deskripsi |
|----------|-----------|
| `$nodeLabel.connection.reconnected` | `false` pada koneksi pertama, `true` pada koneksi ulang berikutnya |
| `$nodeLabel.connection.subprotocol` | Subprotokol yang dinegosiasikan |

### `onClosed`

Terpicu ketika koneksi yang telah terbentuk ditutup.

Field yang berguna:

| Ekspresi | Deskripsi |
|----------|-----------|
| `$nodeLabel.close.initiatedBy` | `server`, `client`, atau `unknown` |
| `$nodeLabel.close.code` | Kode penutupan WebSocket |
| `$nodeLabel.close.reason` | Alasan penutupan |
| `$nodeLabel.close.wasClean` | `true` untuk penutupan normal `1000` |
| `$nodeLabel.close.reconnecting` | Apakah node akan mencoba menghubungkan ulang |

## Semantik Trigger

- Satu node aktif mempertahankan satu koneksi socket keluar yang berumur panjang.
- Koneksi hanya berjalan pada worker leader, serupa dengan mode penerimaan [IMAP Trigger](./imap-trigger-node.md) dan [RabbitMQ](./rabbitmq-node.md).
- Jika koneksi ulang diaktifkan, Heym menunggu `retryWaitSeconds` dan membuka socket kembali setelah terputus.
- Setiap event yang dipancarkan membuat workflow run terpisah dengan `trigger_source = "websocket"`.

## Keamanan Egress

- Secara default, URL harus menggunakan `ws://` atau `wss://` dan hanya di-resolve ke alamat publik. Tujuan loopback, privat, link-local, multicast, dan cloud-metadata diblokir.
- Heym memvalidasi ulang DNS pada setiap koneksi ulang, memvalidasi setiap alamat yang di-resolve, dan terhubung langsung ke salah satu alamat tersebut. Proxy lingkungan dan pengalihan WebSocket dinonaktifkan selama guard aktif.
- Pelanggaran kebijakan permanen menghentikan trigger alih-alih mencoba ulang tanpa batas. Kegagalan DNS atau jaringan sementara tetap mengikuti pengaturan retry node.
- Header `Authorization`, `Origin`, `User-Agent`, dan header data kustom didukung. `Origin` dikirim melalui opsi khusus klien WebSocket. Header `Host`, `Connection`, `Upgrade`, dan `Sec-WebSocket-*` tidak dapat ditimpa.
- Deployment self-hosted tepercaya yang dengan sengaja terhubung ke layanan internal dapat menetapkan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Pertahankan default pada deployment hosted atau multi-tenant.

**Catatan upgrade untuk v0.0.105:** kebijakan tingkat instans ini kini juga melindungi tujuan yang berasal dari credential yang digunakan oleh Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, eksekusi LLM kustom dan penemuan model, asisten AI, guardrails, dan embedding RAG. Credential yang ada yang mengarah ke alamat loopback, privat, atau link-local akan ditolak kecuali `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` diaktifkan pada instans self-hosted tepercaya. Selama guard aktif, klien HTTP yang dijaga mengabaikan `HTTP_PROXY` dan `HTTPS_PROXY`; mengaktifkan opt-out akan memulihkannya. Bundel CA operator yang dikonfigurasi melalui `SSL_CERT_FILE` atau `SSL_CERT_DIR` tetap didukung. ClickHouse diperiksa sebelum koneksi dibuka tetapi tidak dipin pada waktu dial, karena clickhouse-connect membawa transport urllib3-nya sendiri.

## Contoh Workflow

**Aliran event eksternal → filter → notifikasi**

```
websocketTrigger → condition → slack
```

- Label **WebSocket Trigger**: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- Pesan **Slack**: `"Realtime alert: $streamEvent.message.data.title"`
## Contoh Node JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Terkait

- [Trigger](../reference/triggers.md) – Arsitektur trigger latar belakang dan `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Mendorong data ke socket eksternal dari langkah workflow
- [Tipe Node](../reference/node-types.md) – Ikhtisar semua node
- [Integrasi Pihak Ketiga](../reference/integrations.md) – Node mana yang menggunakan kredensial dan mana yang tidak
