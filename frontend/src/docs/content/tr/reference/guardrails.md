# Guardrails

Guardrails, güvenli olmayan veya istenmeyen kullanıcı mesajlarını bir [LLM](../nodes/llm-node.md) veya [Agent](../nodes/agent-node.md) düğümüne ulaşmadan önce engellemenizi sağlar. Bir mesaj engellenen bir kategoriyle eşleştiğinde, düğüm yürütülmek yerine bir hata fırlatır; bu hatayı bir [Error Handler](../nodes/error-handler-node.md) düğümü ile yakalayabilirsiniz.

## Guardrails'ı Etkinleştirme

Bir **LLM** veya **AI Agent** düğümünün Properties panelini açın ve **Enable Guardrails** anahtarına (kalkan simgesi) gidin. Kutuyu işaretlemek yapılandırma bölümünü görünür kılar.

## Guardrail Credential ve Model

Guardrails etkinleştirildiğinde, içerik güvenliği için bir **credential ve model** seçmeniz **gerekir**. Guardrail kontrolü, düğümde seçilen credential ve modeli kullanır — yedek yok, ortam değişkeni yok. Güvenilir içerik filtreleme için bir OpenAI veya Google credential kullanın; özellikle ana modeliniz guardrails'ı desteklemeyebilecek veya API hataları (örn. 404) döndürebilecek özel bir sağlayıcı (örn. Zhipu, GLM) kullanıyorsa.

Hem Guardrail Credential hem de Guardrail Model seçilene kadar workflow çalıştırılamaz.

## Engellenen Kategoriler

Engellemek için bir veya daha fazla kategori seçin. İşaretlenen herhangi bir kategoriyle eşleşen bir mesaj reddedilir.

| Kategori | Neyi engeller |
|---|---|
| **Violence** | Şiddet içeren, tehditkâr veya fiziksel olarak zararlı içerik |
| **Hate Speech** | Ayrımcılık, ırkçılık veya bağnazlık |
| **Sexual Content** | Müstehcen cinsel içerik veya senaryolar |
| **NSFW / Profanity** | Herhangi bir dilde kaba dil, küfür, açık hakaretler ve yetişkin argosu |
| **Self-Harm** | İntihar, kendine zarar verme veya ilgili içerik |
| **Harassment** | Kişisel saldırılar, hakaretler, zorbalık veya gözdağı |
| **Illegal Activity** | Yasa dışı eylemlerin gerçekleştirilmesine yönelik talimatlar |
| **Political Extremism** | Aşırılıkçı siyasi içerik veya şiddet içeren propaganda |
| **Spam / Phishing** | Spam, phishing veya sosyal mühendislik |
| **Personal Data Request** | Özel veya kişisel olarak tanımlanabilir bilgi talebi |
| **Prompt Injection** | Sistem talimatlarını geçersiz kılma, kötü amaçlı prompt enjekte etme veya modelin davranışını manipüle etme girişimleri |

## Hassasiyet

**Sensitivity** ayarı, ihlallerin ne kadar katı bir şekilde tespit edileceğini kontrol eder:

| Seviye | Davranış |
|---|---|
| **Low** | Sınırda veya belirsiz durumları bile işaretler |
| **Medium** *(varsayılan)* | Net ihlalleri işaretler; sınırda durumları yok sayar |
| **High** | Yalnızca aşırı, tartışmasız ihlalleri işaretler |

## Tespit Nasıl Çalışır

Tespit, **seçilen guardrail credential ve modelini** kullanır:

- **OpenAI credential'ları** — yerel olarak kapsadığı beş kategori (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment) için [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)'yi (ücretsiz, hızlı, token kullanımı yok) kullanır. Kalan kategoriler, seçilen guardrail modeli kullanılarak bir LLM sınıflandırma çağrısıyla kontrol edilir.
- **Google / özel credential'lar** — tüm kategoriler, seçilen guardrail credential ve modeli kullanılarak bir LLM sınıflandırma çağrısıyla kontrol edilir.

Ana modeliniz 404 veya başka API hataları döndürebilecek özel bir sağlayıcı (örn. Zhipu, Cerebras) kullanıyorsa, guardrails için bir **OpenAI veya Google credential** seçin.

## Hata Formatı

Bir guardrail tetiklendiğinde düğüm şu mesajla bir hata fırlatır:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Düğüm sonucunun `output` alanı ayrıca `guardrail_violated_categories` (ihlal edilen kategori etiketlerinden oluşan dizi) içerir; böylece Debug Panel ve Execution History "Blocked by: X, Y" ifadesini net bir şekilde görüntüleyebilir.

Guardrails tetiklendiğinde workflow'u bir yedek dala yönlendirmek için düğümün **Continue on error** seçeneğini (veya bir [Error Handler](../nodes/error-handler-node.md)) kullanın.

## Örnek Workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Notlar

- **Yeniden deneme yok**: Guardrail ihlalleri kasıtlı engellemelerdir ve düğümde "Retry on failure" etkin olsa bile asla yeniden denenmez.
- Veritabanı geçişi gerekmez — guardrail ayarları, diğer düğüm verileriyle birlikte workflow'un düğüm JSON'unda saklanır.
- Guardrails, ham şablonu değil, çözümlenmiş **kullanıcı mesajını** (şablon ifadeleri değerlendirildikten sonra) kontrol eder.
- Guardrails etkinken **hiçbir kategori** ayarlamamak, bunların devre dışı olmasıyla eşdeğerdir — hiçbir kontrol yapılmaz.
- **Low** hassasiyette, LLM sınıflandırması her zaman çalışır (en iyi çok dilli kapsama). OpenAI credential'ları ek olarak Moderation API'yi çalıştırır.
- **Medium/High** hassasiyette, OpenAI credential'ları yerel olarak desteklenen kategoriler için Moderation API'yi, geri kalanı için LLM sınıflandırmasını kullanır. Google/özel credential'lar her zaman LLM sınıflandırmasını kullanır.
- LLM sınıflandırması **dilden bağımsızdır** — Türkçe, Arapça, Rusça, İspanyolca ve diğer dillerdeki ihlalleri tespit eder.
