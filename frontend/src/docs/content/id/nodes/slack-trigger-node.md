# Slack Trigger

Node **Slack Trigger** adalah titik masuk tanpa input yang menerima webhook Slack Events API dan memulai workflow secara otomatis. Node ini menangani tantangan verifikasi URL dari Slack dan memverifikasi signature permintaan dengan signing secret.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial `slack_trigger` yang berisi signing secret |

## Panduan Penyiapan

### 1. Buat Kredensial `slack_trigger`

1. Buka **Settings → Credentials → New Credential**
2. Pilih tipe **Slack Trigger (Signing Secret)**
3. Tempelkan **Signing Secret** dari Slack App Anda:
   - Di Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Simpan kredensial

### 2. Tambahkan Node ke Workflow Anda

1. Buka kanvas workflow
2. Seret **Slack Trigger** dari panel node ke kanvas
3. Klik node untuk membuka panel Properties
4. Pilih kredensial `slack_trigger` Anda
5. Salin **Webhook URL** yang ditampilkan di panel

### 3. Konfigurasikan Slack App Anda

1. Di pengaturan Slack App Anda, buka **Event Subscriptions**
2. Aktifkan **Enable Events**
3. Tempelkan Webhook URL ke kolom **Request URL**
4. Slack mengirimkan tantangan verifikasi URL — Heym merespons secara otomatis dalam hitungan milidetik
5. Kolom berubah menjadi hijau: ✓ Verified
6. Berlangganan **Bot Events** yang Anda butuhkan (misalnya `message.channels`, `reaction_added`)
7. Simpan perubahan Anda dan pasang ulang aplikasi ke workspace Anda jika diminta

## Kolom Output

Setelah node terpicu, node hilir dapat mengakses:

| Ekspresi | Deskripsi |
|------------|-------------|
| `$nodeLabel.event` | Objek event Slack lengkap |
| `$nodeLabel.event.type` | Tipe event (misalnya `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Teks pesan (jika berlaku) |
| `$nodeLabel.event.user` | ID pengguna Slack yang memicu event |
| `$nodeLabel.event.channel` | ID channel |
| `$nodeLabel.event.ts` | Timestamp event |
| `$nodeLabel.headers` | HTTP header yang telah disanitasi dari Slack |
| `$nodeLabel.triggered_by` | Label sumber trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID node kanvas yang menerima event Slack |

## Contoh Workflow

**Pesan Slack → balasan LLM → kirim Slack:**

```
slackTrigger → llm → slack
```

- Label **slackTrigger**: `slackEvent`
- Pesan pengguna **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Pesan **Slack**: `$llm.text`

## Keamanan

- Permintaan diverifikasi menggunakan **HMAC-SHA256** dengan signing secret Anda
- Timestamp yang lebih lama dari **5 menit** ditolak (pencegahan serangan replay)
- Header sensitif (`x-slack-signature`, `authorization`, dll.) dihapus sebelum mencapai node hilir
- Jika tidak ada kredensial yang ditetapkan, node berjalan tanpa verifikasi — hanya direkomendasikan untuk pengujian lokal

## Catatan

- Heym merespons dengan `200 OK` segera dan menjalankan workflow di latar belakang — ini memenuhi persyaratan respons 3 detik dari Slack
- Webhook URL diturunkan dari ID node dan tidak pernah berubah, bahkan setelah workflow diganti namanya
- Hanya diperlukan satu node `slackTrigger` per workflow; gunakan node **Switch** atau **Condition** di hilir untuk merutekan berbagai tipe event
