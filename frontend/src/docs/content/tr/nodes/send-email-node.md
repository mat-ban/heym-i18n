# E-posta Gönder

**E-posta Gönder** düğümü, SMTP üzerinden e-posta gönderir. Bildirimler, uyarılar ve işlemsel e-postalar için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden SMTP kimlik bilgisi |
| `to` | expression | Alıcı(lar). Birden fazla için virgülle ayırın. |
| `cc` | expression | Bilgi (carbon-copy) alıcı(lar)ı. Birden fazla için virgülle ayırın. |
| `bcc` | expression | Gizli bilgi (blind carbon-copy) alıcı(lar)ı. Birden fazla için virgülle ayırın. Diğer alıcılardan gizlenir. |
| `subject` | expression | E-posta konusu |
| `emailBody` | expression | E-posta gövdesi içeriği |
| `attachments` | expression | Eklenecek virgülle ayrılmış [Drive](./drive-node.md) dosya ID'leri. Yalnızca workflow sahibine ait veya ekiplerinden biriyle paylaşılan dosyalar eklenebilir. |

## Ekler

`attachments` alanına bir veya daha fazla Drive dosya ID'si ileterek [Drive](./drive-node.md) alanınızdan dosya ekleyin. Bir üst akıştaki Drive düğümünün `id` çıkışına başvurmak için bir `$` ifadesi kullanın (örneğin `$drive.id`) veya virgülle ayrılmış statik ID'leri listeleyin. Her ID, workflow sahibinin kapsamında çözümlenir; geçersiz veya erişilemeyen bir ID, kısmi bir e-posta göndermek yerine düğümü başarısız kılar.

## Kurulum

Sunucu, port, e-posta ve parola içeren bir SMTP kimlik bilgisi ekleyin. Yaygın SMTP sunucuları:

- Gmail: `smtp.gmail.com`, port 587 (Uygulama Parolası gerekir)
- Outlook: `smtp.office365.com`, port 587

## Örnek

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

Yukarıdaki `attachments` değeri, `drive` etiketli bir üst akış [Drive](./drive-node.md) düğümüne başvurur ve ürettiği dosyayı ekler.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Error Handler](./error-handler-node.md) – Hata durumunda e-posta gönderin
- [Credentials Tab](../tabs/credentials-tab.md) – SMTP kimlik bilgileri ekleyin
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – SMTP sağlayıcı kurulumu (Gmail, Outlook, Mailgun, SendGrid)
