# Kirim Email

Node **Send Email** mengirim email melalui SMTP. Gunakan node ini untuk notifikasi, peringatan, dan email transaksional.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial SMTP dari [Credentials](../tabs/credentials-tab.md) |
| `to` | expression | Penerima. Pisahkan dengan koma untuk beberapa penerima. |
| `cc` | expression | Penerima carbon-copy. Pisahkan dengan koma untuk beberapa penerima. |
| `bcc` | expression | Penerima blind carbon-copy. Pisahkan dengan koma untuk beberapa penerima. Disembunyikan dari penerima lainnya. |
| `subject` | expression | Subjek email |
| `emailBody` | expression | Konten isi email |
| `attachments` | expression | ID file [Drive](./drive-node.md) yang dipisahkan dengan koma untuk dilampirkan. Hanya file yang dimiliki oleh pemilik workflow atau yang dibagikan ke salah satu timnya yang dapat dilampirkan. |

## Lampiran

Lampirkan file dari [Drive](./drive-node.md) Anda dengan meneruskan satu atau beberapa ID file Drive ke field `attachments`. Gunakan ekspresi `$` untuk mereferensikan output `id` dari node Drive di hulu (misalnya `$drive.id`), atau cantumkan ID statis yang dipisahkan dengan koma. Setiap ID diselesaikan dalam cakupan pemilik workflow; ID yang tidak valid atau tidak dapat diakses akan menggagalkan node alih-alih mengirim email secara parsial.

## Penyiapan

Tambahkan kredensial SMTP dengan server, port, email, dan kata sandi. Server SMTP umum:

- Gmail: `smtp.gmail.com`, port 587 (memerlukan App Password)
- Outlook: `smtp.office365.com`, port 587

## Contoh

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Nilai `attachments` di atas mereferensikan node [Drive](./drive-node.md) di hulu yang diberi label `drive`, dengan melampirkan file yang dihasilkannya.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Error Handler](./error-handler-node.md) – Kirim email saat terjadi kegagalan
- [Credentials Tab](../tabs/credentials-tab.md) – Tambahkan kredensial SMTP
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – Penyiapan penyedia SMTP (Gmail, Outlook, Mailgun, SendGrid)
