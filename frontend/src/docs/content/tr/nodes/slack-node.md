# Slack

**Slack** düğümü, bir Incoming Webhook aracılığıyla bir Slack kanalına mesaj gönderir. Bildirimler, uyarılar ve hata raporlaması için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | Girişi olduğu gibi iletir |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden Slack credential (webhook URL) |
| `message` | expression | Mesaj metni. [expressions](../reference/expression-dsl.md) destekler. |

## Kurulum

1. Slack çalışma alanınızda bir Incoming Webhook oluşturun
2. Credentials sekmesinde webhook URL'si ile bir Slack credential ekleyin
3. Düğümde credential'a başvurun

## Örnek

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Hata bildirimleri için [Error Handler](./error-handler-node.md) ile birlikte kullanın:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress Güvenliği

- Credential'da saklanan webhook URL'si `http://` veya `https://` kullanmalı ve yalnızca genel adreslere çözümlenmelidir. Loopback, private, link-local, multicast ve cloud-metadata hedefleri engellenir.
- Heym, çözümlenen adresleri doğrular ve göndermeden önce bağlantı hedefini sabitler; böylece bir DNS yanıtı, kontrol sonrasında isteği dahili bir adrese taşıyamaz. Koruma etkinken ortam proxy'leri devre dışı bırakılır ve yönlendirmeler takip edilmez.
- Dahili bir webhook alıcısına gönderim yapan dağıtımlar, güvenilir bir self-hosted örnek üzerinde `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ayarını yapabilir. Hosted veya çok kiracılı dağıtımlarda varsayılan ayarı koruyun.

**v0.0.109 için yükseltme notu:** bu kontrol Slack için yenidir. Webhook URL'si loopback veya private bir adrese işaret eden bir credential, yukarıdaki ayar etkinleştirilmediği sürece reddedilir.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Error Handler](./error-handler-node.md) – Workflow hatasında Slack gönderin
- [Credentials Tab](../tabs/credentials-tab.md) – Slack webhook ekleyin
