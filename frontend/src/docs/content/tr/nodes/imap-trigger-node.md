# IMAP Trigger

**IMAP Trigger** düğümü, bir e-posta gelen kutusunu sabit aralıklarla yoklar ve yeni algılanan her mesaj için bir kez bir workflow başlatır. Destek triyajı, paylaşılan posta kutusu izleme ve onay posta kutuları gibi gelen e-posta otomasyonu için tasarlanmış, sıfır girişli bir trigger düğümüdür.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|-----|----------|
| `credentialId` | UUID | Sunucu, oturum açma bilgileri, posta kutusu ve SSL ayarlarını içeren `imap` credential |
| `pollIntervalMinutes` | Integer | Heym'in posta kutusunu yeni e-posta için ne sıklıkla kontrol edeceği |

## Kurulum Kılavuzu

### 1. Bir `imap` Credential Oluşturun

1. **Settings → Credentials → New Credential** yolunu izleyin
2. **IMAP Email Inbox** türünü seçin
3. Şunları girin:
   - **IMAP Host** (örneğin `imap.gmail.com`)
   - **IMAP Port** (çoğu sağlayıcıda SSL/TLS için `993`)
   - **Username / Email**
   - **Password / App Password**
   - İsteğe bağlı **Mailbox** (varsayılan: `INBOX`)
4. Posta sunucunuz açıkça SSL olmayan IMAP gerektirmedikçe **Use SSL / TLS** seçeneğini etkin bırakın
5. Credential'ı kaydedin

### 2. Düğümü Workflow'unuza Ekleyin

1. **IMAP Trigger** düğümünü tuvale sürükleyin
2. Düğümü seçerek Properties panelini açın
3. `imap` credential'ınızı seçin
4. **Poll Interval (Minutes)** değerini `1`, `5` veya `15` gibi bir tamsayı değerine ayarlayın

## Trigger Semantiği

- İlk yoklama, mevcut posta kutusu içeriğinin bir temel referansını oluşturur ve eski e-postaları **yeniden oynatmaz**.
- Sonraki yoklamalar, IMAP UID'si kaydedilen imleçten daha yeni olan her mesaj için bir kez tetiklenir.
- Posta kutusu `UIDVALIDITY` değeri değişirse, Heym yinelenen işlemeyi önlemek için imleci sıfırlar ve yeniden temel referans oluşturur.
- Her yeni e-posta, `trigger_source = "imap"` ile ayrı bir workflow yürütmesi başlatır.

## Çıkış Alanları

Düğüm tetiklendikten sonra, aşağı akış düğümleri şunlara erişebilir:

| İfade | Açıklama |
|------------|-------------|
| `$nodeLabel.email` | Tam olarak ayrıştırılmış e-posta payload'ı |
| `$nodeLabel.email.subject` | Çözümlenmiş konu |
| `$nodeLabel.email.from` | Ham `From` başlığı |
| `$nodeLabel.email.fromAddresses` | Ayrıştırılmış gönderen listesi |
| `$nodeLabel.email.toAddresses` | Ayrıştırılmış alıcı listesi |
| `$nodeLabel.email.ccAddresses` | Ayrıştırılmış CC listesi |
| `$nodeLabel.email.replyToAddresses` | Ayrıştırılmış reply-to listesi |
| `$nodeLabel.email.text` | Düz metin gövdesi |
| `$nodeLabel.email.html` | HTML gövdesi |
| `$nodeLabel.email.attachments` | Ek meta verileri dizisi (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Çözümlenmiş başlık nesnesi |
| `$nodeLabel.email.uid` | Yinelenenleri ayıklama veya günlükleme için IMAP UID |
| `$nodeLabel.triggered_by` | Trigger kaynağı etiketi (`"imap"`) |
| `$nodeLabel.trigger_node_id` | E-postayı algılayan canvas düğümü ID'si |
| `$nodeLabel.triggered_at` | Workflow yürütmesi için ISO zaman damgası |

## Örnek Workflow

**Gelen destek e-postası → özetle → yönlendir**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** etiketi: `supportInbox`
- **LLM** kullanıcı mesajı: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Notlar

- Birçok sağlayıcı, IMAP erişimi için ana hesap parolanız yerine bir **app password** gerektirir.
- Ek içerikleri workflow girişine enjekte edilmez; yalnızca ek meta verileri dahil edilir.
- Yeni e-postayı yönlendirmek veya günlüklemek için aşağı akışta [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) veya [DataTable](./datatable-node.md) kullanın.

## İlgili

- [Triggers](../reference/triggers.md) – Tüm workflow giriş noktalarına genel bakış
- [Third-Party Integrations](../reference/integrations.md) – IMAP credential kurulumu
- [Credentials Tab](../tabs/credentials-tab.md) – `imap` credential'larını ekleyin ve yönetin
- [Send Email](./send-email-node.md) – Gelen mesajları yanıtlayın veya iletin
