# Discord

**Discord** düğümü, bir Incoming Webhook aracılığıyla bir Discord kanalına mesaj gönderir. Uyarılar, workflow bildirimleri, bot benzeri yanıtlar ve hata raporlama için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Incoming webhook URL'sini içeren `discord` credential |
| `message` | expression | Giden mesaj metni. [Expressions](../reference/expression-dsl.md) destekler. |
| `username` | expression | Bu mesaj için isteğe bağlı görünen ad geçersiz kılma |
| `avatarUrl` | expression | Bu mesaj için isteğe bağlı avatar URL geçersiz kılma |

## Kurulum

1. Bir [Discord Webhook credential](../reference/integrations.md#discord) oluşturun
2. Workflow'unuza **Discord** düğümünü ekleyin
3. Credential'ı seçin
4. `message` değerini giden metne veya upstream verilerden oluşturulan bir şablona ayarlayın
5. İsteğe bağlı olarak görünen `username` ve `avatarUrl` değerlerini geçersiz kılın

## Örnek

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Çıkış Alanları

| Expression | Açıklama |
|------------|-------------|
| `$nodeLabel.status` | Discord tarafından döndürülen HTTP durum kodu, başarı durumunda genellikle `204` |
| `$nodeLabel.response` | Discord webhook tarafından döndürülen ham yanıt gövdesi |
| `$nodeLabel.message` | Heym'in gönderdiği mesaj metni |
| `$nodeLabel.username` | Sağlanmışsa webhook ile gönderilen kullanıcı adı |
| `$nodeLabel.avatar_url` | Sağlanmışsa webhook ile gönderilen avatar URL'si |

## Yaygın Kalıplar

- Etkileşim yanıtının ötesinde ek bir kanal gönderisi istediğinizde [Discord Trigger](./discord-trigger-node.md) ile birlikte kullanın
- [Error Handler](./error-handler-node.md) üzerinden hata bildirimleri gönderin
- [LLM](./llm-node.md) veya [Agent](./agent-node.md) tarafından oluşturulan özetleri paylaşın

## Egress Güvenliği

- Credential'da saklanan webhook URL'si `http://` veya `https://` kullanmalı ve yalnızca genel adreslere çözümlenmelidir. Loopback, private, link-local, multicast ve cloud-metadata hedefleri engellenir.
- Heym, çözümlenen adresleri doğrular ve göndermeden önce bağlantı hedefini sabitler; böylece bir DNS yanıtı, kontrol sonrasında isteği dahili bir adrese taşıyamaz. Koruma etkinken ortam proxy'leri devre dışı bırakılır ve yönlendirmeler takip edilmez.
- Dahili bir webhook alıcısına gönderim yapan dağıtımlar, güvenilir bir self-hosted instance üzerinde `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ayarını yapabilir. Hosted veya çok kiracılı dağıtımlarda varsayılan ayarı koruyun.

**v0.0.109 için yükseltme notu:** bu kontrol Discord için yenidir. Webhook URL'si loopback veya private bir adrese işaret eden bir credential, yukarıdaki ayar etkinleştirilmedikçe reddedilir.

## İlgili

- [Discord Trigger](./discord-trigger-node.md) – Gelen Discord etkileşimlerinden bir workflow başlatın
- [Third-Party Integrations](../reference/integrations.md) – Discord credential kurulumu
- [Credentials Tab](../tabs/credentials-tab.md) – `discord` credential'larını ekleyin ve yönetin
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
