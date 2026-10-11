# Discord Trigger

**Discord Trigger** düğümü, Discord Interactions API webhook'larını alan ve bir workflow'u otomatik olarak başlatan sıfır girişli bir giriş noktasıdır. Slash komutları, butonlar, modallar ve downstream AI veya entegrasyon düğümlerine akması gereken diğer Discord uygulama etkileşimleri için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Discord uygulaması public key'ini içeren `discord_trigger` credential |

## Kurulum Kılavuzu

### 1. Bir `discord_trigger` Credential Oluşturun

1. **Settings → Credentials → New Credential** yolunu izleyin
2. **Discord Trigger (Public Key)** türünü seçin
3. Discord Developer Portal'dan **Application Public Key**'ini yapıştırın:
   - **Your application → General Information → Public Key**
4. Credential'ı kaydedin

### 2. Düğümü Workflow'unuza Ekleyin

1. **Discord Trigger** düğümünü canvas'a sürükleyin
2. Düğümü seçerek Properties panelini açın
3. `discord_trigger` credential'ınızı seçin
4. Düğüm panelinde gösterilen **Interactions URL**'ini kopyalayın

### 3. Discord'da Interactions Endpoint'ini Kaydedin

1. [Discord Developer Portal](https://discord.com/developers/applications) sayfasını açın
2. Uygulamanızı seçin
3. **General Information** veya **Interactions** bölümüne gidin
4. Düğümün **Interactions Endpoint URL**'ini endpoint alanına yapıştırın
5. Discord, endpoint'i doğrulamak için bir `PING` isteği gönderir ve Heym imzayı doğruladıktan sonra otomatik olarak yanıt verir
6. Değişikliklerinizi kaydedin

## Çıkış Alanları

Düğüm tetiklendikten sonra downstream düğümler şunlara erişebilir:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.interaction` | Tam Discord interaction payload'ı |
| `$nodeLabel.type` | Interaction türü |
| `$nodeLabel.data` | Komut, buton veya modal payload'ı |
| `$nodeLabel.data.name` | Uygun olduğunda slash komut adı |
| `$nodeLabel.data.options` | Slash komut seçenekleri dizisi |
| `$nodeLabel.headers` | Temizlenmiş webhook header'ları |
| `$nodeLabel.triggered_by` | Trigger kaynak etiketi (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Discord interaction'ını alan canvas düğüm ID'si |
| `$nodeLabel.triggered_at` | Bu workflow yürütmesi için ISO zaman damgası |

## Örnek Workflow

**Discord slash komutu → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** etiketi: `discordEvent`
- **LLM** kullanıcı mesajı: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** mesajı: `$llm.text`

## Güvenlik

- İstekler, uygulamanızın public key'i ile **Ed25519** kullanılarak doğrulanır
- **5 dakikadan** eski zaman damgaları, replay saldırılarını azaltmak için reddedilir
- Hassas header'lar (`x-signature-ed25519`, `authorization` vb.) veriler downstream düğümlere ulaşmadan önce kaldırılır
- Trigger geçerli bir `discord_trigger` credential'ı gerektirir; credential eksik veya geçersizse istekler reddedilir

## Notlar

- Heym hemen ertelenmiş bir Discord yanıtı döndürür, workflow'u arka planda çalıştırır ve bir `Output` düğümü içerik ürettiğinde son workflow çıktısını Discord takip mesajı olarak gönderir
- Interactions URL'i düğüm ID'sinden türetilir ve workflow yeniden adlandırılsa bile sabit kalır
- Yalnızca interaction takip mesajına ek olarak ayrı bir webhook gönderimi de istediğinizde normal bir [Discord Node](./discord-node.md) kullanın
- Genellikle bir `discordTrigger` düğümü yeterlidir; farklı interaction türlerini yönlendirmek için downstream'de **Switch** veya **Condition** kullanın

## İlgili

- [Discord Node](./discord-node.md) – Giden Discord mesajları gönderin
- [Triggers](../reference/triggers.md) – Tüm workflow giriş noktalarına genel bakış
- [Third-Party Integrations](../reference/integrations.md) – Discord credential kurulumu
- [Credentials Tab](../tabs/credentials-tab.md) – `discord_trigger` credential'larını ekleyin ve yönetin
