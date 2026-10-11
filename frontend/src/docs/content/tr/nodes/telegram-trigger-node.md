# Telegram Trigger

**Telegram Trigger** düğümü, Telegram botunuz bir webhook güncellemesi aldığında bir workflow başlatan sıfır girişli bir giriş noktasıdır. Chatbot'lar, destek triyajı, slash benzeri komutlar veya alt akıştaki AI ve entegrasyon düğümlerine yönlendirilmesi gereken inline button callback'leri için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Bot token'ını ve isteğe bağlı webhook secret token'ını içeren `telegram` credential'ı |

## Kurulum Kılavuzu

### 1. Bir `telegram` Credential'ı Oluşturun

1. **Settings → Credentials → New Credential** yolunu izleyin
2. **Telegram Bot** türünü seçin
3. BotFather'dan aldığınız **Bot Token**'ını yapıştırın
4. Telegram'ın eşleşen bir doğrulama header'ı göndermesini istiyorsanız isteğe bağlı olarak bir **Webhook Secret Token** ayarlayın
5. Credential'ı kaydedin

### 2. Düğümü Workflow'unuza Ekleyin

1. **Telegram Trigger**'ı canvas'a sürükleyin
2. Properties panelini açmak için düğüme tıklayın
3. `telegram` credential'ınızı seçin
4. Düğüm panelinde gösterilen **Webhook URL**'ini kopyalayın

### 3. Webhook'u Telegram'da Kaydedin

Düğümdeki URL ile Bot API `setWebhook` metodunu kullanın:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Heym'de bir secret token yapılandırdıysanız, webhook'u ayarlarken aynı değeri gönderin:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Çıkış Alanları

Düğüm tetiklendikten sonra, alt akıştaki düğümler şunlara erişebilir:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.update` | Tam Telegram update payload'ı |
| `$nodeLabel.message` | Update'ten gelen birincil message benzeri nesne |
| `$nodeLabel.message.text` | Gelen mesaj metni |
| `$nodeLabel.message.chat.id` | Alt akışta yanıt vermek için chat ID |
| `$nodeLabel.message.from.id` | Telegram kullanıcı ID'si |
| `$nodeLabel.callback_query` | Update bir inline keyboard'dan geldiğinde callback payload'ı |
| `$nodeLabel.headers` | Temizlenmiş webhook header'ları |
| `$nodeLabel.triggered_by` | Trigger kaynak etiketi (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Telegram update'ini alan canvas düğüm ID'si |
| `$nodeLabel.triggered_at` | Bu workflow yürütmesi için ISO zaman damgası |

## Örnek Workflow

**Telegram mesajı → LLM → Telegram yanıtı**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** etiketi: `telegramEvent`
- **LLM** kullanıcı mesajı: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Güvenlik

- Credential'ınızda bir `secret_token` varsa, Heym workflow'u çalıştırmadan önce `x-telegram-bot-api-secret-token` değerini doğrular.
- Hassas istek header'ları, payload alt akıştaki düğümlere ulaşmadan önce kaldırılır.
- Webhook URL'i düğüm ID'si için statiktir, bu nedenle yalnızca düğümün kendisi değiştiğinde yeniden kaydetmeniz gerekir.

## İlgili

- [Telegram Node](./telegram-node.md) – Bir yanıt veya giden bildirim gönderin
- [Triggers](../reference/triggers.md) – Tüm workflow giriş noktalarına genel bakış
- [Third-Party Integrations](../reference/integrations.md) – Telegram credential kurulumu
- [Credentials Tab](../tabs/credentials-tab.md) – `telegram` credential'larını ekleyin ve yönetin
