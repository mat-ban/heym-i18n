# Telegram

**Telegram** düğümü, Telegram Bot API aracılığıyla bir mesaj gönderir. Sohbet yanıtları, operasyonel uyarılar, workflow durum güncellemeleri veya bir Telegram kullanıcısına, grubuna ya da kanalına mesaj göndermesi gereken herhangi bir alt adım için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Bot token'ını içeren `telegram` credential |
| `chatId` | expression | Hedef sohbet, grup veya kanal ID'si |
| `message` | expression | Giden mesaj metni. [expression](../reference/expression-dsl.md) desteği sunar. |

## Kurulum

1. Bir [Telegram Bot credential](../reference/integrations.md#telegram) oluşturun
2. Workflow'unuza **Telegram** düğümünü ekleyin
3. Credential'ı seçin
4. `chatId` değerini statik bir sohbet ID'sine veya `$telegramEvent.message.chat.id` gibi bir expression'a ayarlayın
5. `message` değerini giden metne veya üst verilerden oluşturulan bir şablona ayarlayın

## Örnek

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Çıkış Alanları

| Expression | Açıklama |
|------------|-------------|
| `$nodeLabel.status` | Başarı durumunda `"sent"` |
| `$nodeLabel.ok` | Telegram API başarı bayrağı |
| `$nodeLabel.result` | Telegram'dan gelen ham `sendMessage` sonuç nesnesi |
| `$nodeLabel.result.message_id` | Telegram mesaj ID'si |
| `$nodeLabel.result.chat.id` | Telegram tarafından döndürülen hedef sohbet ID'si |

## Yaygın Kullanım Kalıpları

- Sohbet botları için [Telegram Trigger](./telegram-trigger-node.md) ile eşleştirin
- [Error Handler](./error-handler-node.md) üzerinden hata bildirimleri gönderin
- [LLM](./llm-node.md) veya [Agent](./agent-node.md) tarafından oluşturulan özetleri paylaşın

## İlgili

- [Telegram Trigger](./telegram-trigger-node.md) – Gelen bot mesajlarından bir workflow başlatın
- [Third-Party Integrations](../reference/integrations.md) – Telegram credential kurulumu
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` credential'larını ekleyin ve yönetin
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
