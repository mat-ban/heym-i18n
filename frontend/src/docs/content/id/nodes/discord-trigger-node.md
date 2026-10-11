# Discord Trigger

Node **Discord Trigger** adalah titik masuk tanpa input yang menerima webhook Discord Interactions API dan memulai workflow secara otomatis. Gunakan node ini untuk slash command, tombol, modal, dan interaksi aplikasi Discord lainnya yang harus mengalir ke node AI atau integrasi hilir.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial `discord_trigger` yang berisi public key aplikasi Discord |

## Panduan Penyiapan

### 1. Buat Kredensial `discord_trigger`

1. Buka **Settings → Credentials → New Credential**
2. Pilih tipe **Discord Trigger (Public Key)**
3. Tempelkan **Application Public Key** dari Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Simpan kredensial

### 2. Tambahkan Node ke Workflow Anda

1. Seret **Discord Trigger** ke kanvas
2. Pilih node untuk membuka panel Properties
3. Pilih kredensial `discord_trigger` Anda
4. Salin **Interactions URL** yang ditampilkan di panel node

### 3. Daftarkan Endpoint Interactions di Discord

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Pilih aplikasi Anda
3. Buka **General Information** atau **Interactions**
4. Tempelkan **Interactions Endpoint URL** milik node ke kolom endpoint
5. Discord mengirim permintaan `PING` untuk memvalidasi endpoint dan Heym merespons secara otomatis setelah memverifikasi signature
6. Simpan perubahan Anda

## Kolom Output

Setelah node terpicu, node hilir dapat mengakses:

| Ekspresi | Deskripsi |
|------------|-------------|
| `$nodeLabel.interaction` | Payload interaksi Discord lengkap |
| `$nodeLabel.type` | Tipe interaksi |
| `$nodeLabel.data` | Payload command, tombol, atau modal |
| `$nodeLabel.data.name` | Nama slash command, jika berlaku |
| `$nodeLabel.data.options` | Array opsi slash command |
| `$nodeLabel.headers` | Header webhook yang telah disanitasi |
| `$nodeLabel.triggered_by` | Label sumber trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID node kanvas yang menerima interaksi Discord |
| `$nodeLabel.triggered_at` | Timestamp ISO untuk eksekusi workflow ini |

## Contoh Workflow

**Slash command Discord → LLM → Output**

```
discordTrigger → llm → output
```

- Label **Discord Trigger**: `discordEvent`
- Pesan pengguna **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Pesan **Output**: `$llm.text`

## Keamanan

- Permintaan diverifikasi menggunakan **Ed25519** dengan public key aplikasi Anda
- Timestamp yang lebih lama dari **5 menit** ditolak untuk mengurangi serangan replay
- Header sensitif (`x-signature-ed25519`, `authorization`, dll.) dihapus sebelum data mencapai node hilir
- Trigger memerlukan kredensial `discord_trigger` yang valid; permintaan ditolak jika kredensial tidak ada atau tidak valid

## Catatan

- Heym mengembalikan respons Discord yang ditangguhkan segera, menjalankan workflow di latar belakang, dan memposting output workflow akhir sebagai tindak lanjut Discord ketika node `Output` menghasilkan konten
- URL interactions diturunkan dari ID node dan tetap stabil meskipun workflow diganti namanya
- Gunakan [Discord Node](./discord-node.md) biasa hanya ketika Anda juga menginginkan posting webhook terpisah selain tindak lanjut interaksi
- Satu node `discordTrigger` biasanya sudah cukup; gunakan **Switch** atau **Condition** di hilir untuk merutekan berbagai tipe interaksi

## Terkait

- [Discord Node](./discord-node.md) – Kirim pesan Discord keluar
- [Triggers](../reference/triggers.md) – Ikhtisar semua titik masuk workflow
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Tambahkan dan kelola kredensial `discord_trigger`
