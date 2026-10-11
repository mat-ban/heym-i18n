# IMAP Trigger

Node **IMAP Trigger** melakukan polling pada kotak masuk email secara berkala dan memulai workflow satu kali untuk setiap pesan baru yang terdeteksi. Node ini merupakan node trigger tanpa input yang dirancang untuk otomatisasi email masuk seperti triase dukungan, pemantauan kotak surat bersama, dan kotak surat persetujuan.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `credentialId` | UUID | Kredensial `imap` yang berisi server, login, kotak surat, dan pengaturan SSL |
| `pollIntervalMinutes` | Integer | Seberapa sering Heym memeriksa kotak surat untuk email baru |

## Panduan Penyiapan

### 1. Buat Kredensial `imap`

1. Buka **Settings → Credentials → New Credential**
2. Pilih tipe **IMAP Email Inbox**
3. Masukkan:
   - **IMAP Host** (misalnya `imap.gmail.com`)
   - **IMAP Port** (`993` untuk SSL/TLS pada sebagian besar penyedia)
   - **Username / Email**
   - **Password / App Password**
   - Opsional **Mailbox** (default: `INBOX`)
4. Biarkan **Use SSL / TLS** tetap aktif kecuali server email Anda secara eksplisit memerlukan IMAP non-SSL
5. Simpan kredensial

### 2. Tambahkan Node ke Workflow Anda

1. Seret **IMAP Trigger** ke kanvas
2. Pilih node untuk membuka panel Properties
3. Pilih kredensial `imap` Anda
4. Atur **Poll Interval (Minutes)** dengan nilai integer seperti `1`, `5`, atau `15`

## Semantik Trigger

- Polling pertama menetapkan baseline dari isi kotak surat saat ini dan **tidak** memutar ulang email lama.
- Polling berikutnya memicu satu kali per pesan yang IMAP UID-nya lebih baru daripada kursor yang tersimpan.
- Jika `UIDVALIDITY` kotak surat berubah, Heym mengatur ulang kursor dan menetapkan baseline kembali untuk menghindari pemrosesan duplikat.
- Setiap email baru memulai eksekusi workflow terpisah dengan `trigger_source = "imap"`.

## Field Output

Setelah node terpicu, node hilir dapat mengakses:

| Ekspresi | Deskripsi |
|----------|-----------|
| `$nodeLabel.email` | Payload email lengkap yang telah diurai |
| `$nodeLabel.email.subject` | Subjek yang telah didekode |
| `$nodeLabel.email.from` | Header `From` mentah |
| `$nodeLabel.email.fromAddresses` | Daftar pengirim yang telah diurai |
| `$nodeLabel.email.toAddresses` | Daftar penerima yang telah diurai |
| `$nodeLabel.email.ccAddresses` | Daftar CC yang telah diurai |
| `$nodeLabel.email.replyToAddresses` | Daftar reply-to yang telah diurai |
| `$nodeLabel.email.text` | Isi teks biasa |
| `$nodeLabel.email.html` | Isi HTML |
| `$nodeLabel.email.attachments` | Array metadata lampiran (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Objek header yang telah didekode |
| `$nodeLabel.email.uid` | IMAP UID untuk deduplikasi atau pencatatan log |
| `$nodeLabel.triggered_by` | Label sumber trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID node kanvas yang mendeteksi email |
| `$nodeLabel.triggered_at` | Timestamp ISO untuk eksekusi workflow |

## Contoh Workflow

**Email dukungan masuk → ringkas → rutekan**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Label **IMAP Trigger**: `supportInbox`
- Pesan pengguna **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Catatan

- Banyak penyedia mengharuskan **app password** untuk akses IMAP alih-alih kata sandi akun utama Anda.
- Isi lampiran tidak dimasukkan ke input workflow; hanya metadata lampiran yang disertakan.
- Gunakan [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md), atau [DataTable](./datatable-node.md) di hilir untuk merutekan atau mencatat email baru.

## Terkait

- [Triggers](../reference/triggers.md) – Ikhtisar semua titik masuk workflow
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan dan mengelola kredensial `imap`
- [Send Email](./send-email-node.md) – Membalas atau meneruskan pesan masuk
