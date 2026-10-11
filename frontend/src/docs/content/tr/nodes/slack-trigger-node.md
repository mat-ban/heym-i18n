# Slack Trigger

**Slack Trigger** düğümü, Slack Events API webhook'larını alan ve bir workflow'u otomatik olarak başlatan sıfır girişli bir giriş noktasıdır. Slack'in URL doğrulama challenge'ını işler ve istek imzalarını bir signing secret ile doğrular.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Signing secret içeren `slack_trigger` credential'ı |

## Kurulum Kılavuzu

### 1. Bir `slack_trigger` Credential'ı Oluşturun

1. **Settings → Credentials → New Credential** yolunu izleyin
2. **Slack Trigger (Signing Secret)** türünü seçin
3. Slack App'inizden **Signing Secret**'ı yapıştırın:
   - Slack'te: **App settings → Basic Information → App Credentials → Signing Secret**
4. Credential'ı kaydedin

### 2. Düğümü Workflow'unuza Ekleyin

1. Workflow canvas'ını açın
2. **Slack Trigger**'ı düğüm panelinden canvas'a sürükleyin
3. Özellikler panelini açmak için düğüme tıklayın
4. `slack_trigger` credential'ınızı seçin
5. Panelde gösterilen **Webhook URL**'sini kopyalayın

### 3. Slack App'inizi Yapılandırın

1. Slack App ayarlarınızda **Event Subscriptions** bölümüne gidin
2. **Enable Events** seçeneğini açın
3. Webhook URL'sini **Request URL** alanına yapıştırın
4. Slack bir URL doğrulama challenge'ı gönderir — Heym milisaniyeler içinde otomatik olarak yanıt verir
5. Alan yeşile döner: ✓ Verified
6. İhtiyacınız olan **Bot Events**'e abone olun (örn. `message.channels`, `reaction_added`)
7. Değişikliklerinizi kaydedin ve istemde bulunulursa uygulamayı workspace'inize yeniden yükleyin

## Çıkış Alanları

Düğüm tetiklendikten sonra, aşağı akış düğümleri şunlara erişebilir:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.event` | Tam Slack event nesnesi |
| `$nodeLabel.event.type` | Event türü (örn. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Mesaj metni (uygun olduğunda) |
| `$nodeLabel.event.user` | Event'i tetikleyen Slack kullanıcı ID'si |
| `$nodeLabel.event.channel` | Kanal ID'si |
| `$nodeLabel.event.ts` | Event zaman damgası |
| `$nodeLabel.headers` | Slack'ten gelen temizlenmiş HTTP header'ları |
| `$nodeLabel.triggered_by` | Trigger kaynak etiketi (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Slack event'ini alan canvas düğüm ID'si |

## Örnek Workflow

**Slack mesajı → LLM yanıtı → Slack gönderimi:**

```
slackTrigger → llm → slack
```

- **slackTrigger** etiketi: `slackEvent`
- **LLM** kullanıcı mesajı: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** mesajı: `$llm.text`

## Güvenlik

- İstekler, signing secret'ınız ile **HMAC-SHA256** kullanılarak doğrulanır
- **5 dakikadan** eski zaman damgaları reddedilir (replay attack önleme)
- Hassas header'lar (`x-slack-signature`, `authorization` vb.) aşağı akış düğümlerine ulaşmadan önce çıkarılır
- Hiçbir credential ayarlanmamışsa düğüm doğrulama olmadan çalışır — yalnızca yerel test için önerilir

## Notlar

- Heym hemen `200 OK` ile yanıt verir ve workflow'u arka planda çalıştırır — bu, Slack'in 3 saniyelik yanıt gereksinimini karşılar
- Webhook URL'si düğüm ID'sinden türetilir ve workflow yeniden adlandırılsa bile asla değişmez
- Workflow başına yalnızca bir `slackTrigger` düğümü gereklidir; farklı event türlerini yönlendirmek için aşağı akışta **Switch** veya **Condition** düğümlerini kullanın
