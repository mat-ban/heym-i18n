# Karar

**Decision** düğümü, bir karar modeline çalışmanın mevcut durumu hakkında yazılı sorular sorar ve olasılıkları döndürür. Metin üretmez. Bir workflow'un dallanabileceği bir yargıya ihtiyaç duyduğunda — yönlendirme, triyaj, sıralama, doğrulama veya geri alınamayacak bir adımı kapılamada — bu düğüme başvurun.

Karar modelleri (aynı zamanda *System One* modelleri olarak da adlandırılır), bir LLM'den farklı türde bir modeldir. Prompt yoktur, sistem talimatı yoktur, temperature yoktur ve tool calling yoktur. Bir **state** ile bir **questions** haritası gönderirsiniz ve her yanıt, arkasında bir olasılık dağılımı bulunan bir sayı olarak geri döner. Bir yanıt yalnızca birkaç token olduğundan, bu modeller bir [LLM](./llm-node.md)'den JSON üretmesini isteyip ayrıştırmaya kıyasla hızlı ve ucuzdur.

Metin üretimi için [LLM](./llm-node.md) düğümünü kullanın. Araçları çağıran bir model için [Agent Node](./agent-node.md) düğümünü kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | Sağlayıcı yanıtı birebir — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Bir *Decision Model* credential'ı. Bir LLM credential'ı değil. |
| `model` | string | Model adı, örneğin `jev-latest` |
| `state` | expression | Modelin okuması gereken şey (varsayılan `$input.text`) |
| `questions` | array | Sıralı soru satırları; en az bir tane |
| `customBodyEnabled` | boolean | Form yerine elle yazılmış bir istek gövdesi gönder |
| `customBody` | expression (JSON) | Anahtar açıkken gönderilecek gövde |
| `requestTimeoutSeconds` | number | Beklenecek maksimum saniye (varsayılan: 60) |

### State

**State**, modelin yargıladığı durumdur. Bir string, bir nesne veya bir dizi kabul eder.

Tam olarak bir expression içeren bir alan kendi türünü korur; bu nedenle `$input`, metni yerine nesnenin kendisini gönderir. İçinde bir expression bulunan bir şablon (`Ticket: $input.text`) bir string'e çözümlenir. Her soruya yanıtlayabileceği kadar bilgi verin: kaynak metin, kimlikler, ilişkiler, politikalar ve güncel gerçekler.

## Soru türleri

Her sorunun bir `id`'si, bir `type`'ı, `instructions`'ı ve türe bağlı kriterleri vardır.

`id`, workflow'unuzun yanıtı geri okuma şeklidir. **Asla modele gönderilmez**, bu nedenle tüm anlam `instructions` içinde yaşamak zorundadır. `id: is_urgent` ile `instructions: "Is it?"` yazmak modele üzerinde çalışacağı hiçbir şey vermez.

### Noul

Bir koşulun geçerli olup olmadığı. Yanıtın evet olma olasılığını 0 ile 1 arasında döndürür.

Kriterler isteğe bağlıdır: **Yes means** ve **No means**, her bir tarafın neyi kapsadığını açıklar. 0,5'e yakın bir değer, modelin evet ve hayırı yaklaşık olarak eşit olasılıklı bulduğu anlamına gelir — "orta yoğunluk" değil.

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Bunu `$triage.answers.is_urgent.noul` ile okuyun.

### Choice

Tanımladığınız bir kümeden bir seçenek seçer. Seçilen seçeneği, tam dağılımı ve bundan türetilen bir güveni döndürür.

Hiçbir şeyin uymayabileceği durumlarda "bunların hiçbiri"ni kapsayan bir seçenek ekleyin — model, sunmadığınız bir seçeneği seçemez.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Bunu `$triage.answers.department.choice`, `.probabilities.billing` ve `.confidence` ile okuyun.

### Score

Durumu sıralı bir rubriğe göre derecelendirir. Seviyeler **arasına** düşebilen olasılık ağırlıklı bir değer, ayrıca legend ve dağılımı döndürür.

Seviyeler en düşükten başlar, en az iki ve en fazla on tanedir. Her seviye somut bir durumu tanımlamalı ve kendi başına ayakta durmalıdır.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Bunu `$triage.answers.frustration.score`, `.legend` ve `.confidence` ile okuyun.

## Generate with AI

**Generate with AI**, düz bir cümleyi önerilen bir state şablonuna ve bir dizi soru satırına dönüştürür. Neyin yargılanmasını istediğinizi tanımlayın — "gelen bir destek talebini triyaj et: ne kadar acil olduğunu, hangi ekibin sahip olduğunu ve müşterinin ne kadar hayal kırıklığına uğramış göründüğünü" — ve düğüme eklemeden önce geri geleni gözden geçirin.

Taslak, bir LLM tarafından yapılır, bu nedenle iletişim kutusu bir LLM credential'ı ister. Karar modeli, soruları daha sonra, workflow çalıştığında yanıtlar. Üretilen id'ler, düğümün hâlihazırda tuttuğu satırlara karşı yinelenmez hale getirilir, böylece iki kez üretmek mevcut bir yanıt anahtarının üzerine asla yazmaz.

Her üretim, düğümün kendisi tarafından çalışma zamanında yazılan `decision.systemone` trace'lerinin yanı sıra [Traces](../tabs/traces-tab.md) sekmesinde **Decision Questions** kaynağı altında kaydedilir.
## Özel istek gövdesi

Form yerine kendi yazdığınız JSON'u göndermek için **Özel istek gövdesi** seçeneğini açın. Bunu, sözleşmesi formun oluşturduğundan farklı olan bir endpoint için kullanın.

Düzenleyici mevcut formdan başlatılır ve içindeki ifadeler istek gönderilmeden önce çözümlenir. Bu seçenek açıkken State alanı ve soru satırları yok sayılır. Yanıt her iki durumda da değiştirilmeden iletilir; bu nedenle farklı bir sözleşme, ifadelerinizin okuması için yalnızca farklı bir şekil üretir.

## Çıktı

Düğüm, sağlayıcının döndürdüğü şeyi tam olarak döndürür. Hiçbir şey yeniden adlandırılmaz veya düzleştirilmez.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Bir yanıt üzerinde dallanma

Bir [Switch](./switch-node.md) düğümü seçilen seçeneğe göre yönlendirme yapar ve bir [Condition](./condition-node.md) düğümü düşük güvenli durumları bir kişinin göreceği bir yere gönderebilir:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Tipli bir yanıt şekli garanti eder, gerçeği değil. Eşik değerlerini bir örnekten kopyalamak yerine kendi verilerinize ve sonuçlarınıza göre seçin.

## Credential

[Credentials](../tabs/credentials-tab.md) sekmesinde aşağıdakilerle bir **Decision Model** credential'ı oluşturun:

- **Base URL** — endpoint, örneğin `https://api.typesafe.ai`. Heym `/v1/systemone` ekler.
- **API Key** — isteğe bağlı. Anahtar gerektirmeyen endpoint'ler boş bırakılabilir.

Bir credential düzenlenirken anahtar alanı boş bırakılırsa saklanan anahtar korunur; yalnızca değiştirmek için yeniden yazın.

Aynı credential, [Evals](../tabs/evals-tab.md) çalıştırmalarını da değerlendirebilir: **LLM-as-Judge** seçiliyken bunu judge olarak seçin ve decision model her yanıtı beklenen çıktıya göre puanlar.

Heym varsayılan olarak özel ve loopback adreslerine giden istekleri engeller; bu nedenle `localhost` veya özel bir aralıkta kendi çalıştırdığınız bir decision endpoint'i için `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` gerekir.

Decision modelleri, Heym'in senkronize ettiği LLM fiyatlandırma tablolarında görünmez; bu nedenle bu çağrılar için [Traces](../tabs/traces-tab.md) içindeki **Cost** sütunu boş kalır. Token sayıları yine de kaydedilir ve bir fiyatlandırma geçersiz kılmasıyla kendi fiyatınızı ekleyebilirsiniz.

## Hatalar

| Durum | Ne olur |
|-----------|--------------|
| Geçersiz API key | Düğüm, credential'ı adlandıran bir mesajla başarısız olur |
| Bozuk soru | Sağlayıcının kendi alan düzeyindeki mesajı düğüm hatasına taşınır |
| Hız sınırlandı veya aşırı yüklendi | Düğüm, durumun geçici olduğunu belirten bir mesajla başarısız olur — bunu atlatmak için bu düğümde [retry](../reference/features.md) seçeneğini açın |
| Yinelenen veya boş soru id | Düğüm, herhangi bir istek gönderilmeden önce başarısız olur |

## İlgili

- [LLM Node](./llm-node.md) – Bir yargı yerine metin üretin
- [Agent Node](./agent-node.md) – Araçlarla kanıt toplayın, ardından burada değerlendirin
- [Switch Node](./switch-node.md) – Seçilen seçeneğe göre yönlendirin
- [Condition Node](./condition-node.md) – Güvene göre kapı görevi görün
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials](../reference/credentials.md) – Credential türleri ve alanları
- [Traces Tab](../tabs/traces-tab.md) – Decision çağrılarını ve token kullanımını inceleyin
