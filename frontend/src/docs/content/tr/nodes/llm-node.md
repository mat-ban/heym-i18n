# LLM

**LLM** düğümü, bir dil modeliyle metin işler veya görsel üretir. Metin üretimi, görü (görsel girişi), görsel üretimi, yapılandırılmış JSON çıktısı ve desteklenen metin modelleri için sağlayıcıya özgü **Batch API** yürütmesini destekler.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1, ayrıca batch modu etkinleştirildiğinde isteğe bağlı `batchStatus` |
| Çıktı | `$nodeLabel.text` (metin), `$nodeLabel.image` (görsel) veya `$nodeLabel.results` gibi batch sonuç alanları |

## Parametreler

### Credential ve Model

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden LLM credential |
| `model` | string | Model adı (örn. `gpt-4o`, `gemini-2.5-flash-lite`, görseller için `nanobanana`) |
| `fallbackCredentialId` | UUID (isteğe bağlı) | Birincil başarısız olduğunda yedek credential |
| `fallbackModel` | string (isteğe bağlı) | Birincil başarısız olduğunda yedek model |

Birincil credential veya model bir hata döndürürse, düğüm başarısız olmadan önce otomatik olarak yedek credential ve model ile yeniden dener.

Heym ayrıca seçilen credential ve modelden **batch yeteneğini** kontrol eder. Batch modu şunlar için kullanılabilir:

- OpenAI credential'ları
- Endpoint'i gerekli `/v1/files` ve `/v1/batches` API'lerini sunan Özel / OpenAI uyumlu credential'lar

Seçilen sağlayıcı veya model batch yürütmeyi desteklemiyorsa, Properties paneli bunu doğrudan gösterir ve anahtarı devre dışı bırakır.

### Prompt'lar (metin modu)

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt. [İfadeleri](../reference/expression-dsl.md) destekler. |
| `userMessage` | string | Kullanıcı mesajı. Varsayılan: `$input.text` |
| `temperature` | number | 0.0–2.0 (varsayılan: 0.7) |
| `maxTokens` | number | Maksimum yanıt token'ı (isteğe bağlı) |
| `requestTimeoutSeconds` | number | Zaman aşımına uğramadan önce model yanıtı için beklenecek maksimum saniye (varsayılan: 60). Yavaş veya kendi barındırılan sağlayıcılar (LiteLLM, vLLM, yerel modeller) için artırın. |

### Görsel ve Çıktı

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Metin veya görsel üretimi |
| `imageInputEnabled` | boolean | Kullanıcı mesajına görsel ekle (görü) |
| `imageInput` | expression | Base64 data URL veya görsel URL'si |
| `jsonOutputEnabled` | boolean | Yapılandırılmış JSON çıktısı |
| `jsonOutputSchema` | string | Yapılandırılmış çıktı için JSON Schema |
| `extraBodyEnabled` | boolean | Sağlayıcıya özgü istek parametrelerini gönder (varsayılan: `false`) |
| `extraBody` | string | API istek gövdesine birleştirilen JSON nesnesi |

### Reasoning modelleri (o1, o3)

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Reasoning modelleri için etkinleştirin |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning derinliği |

### Batch Modu

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Tek istek yürütmesi yerine sağlayıcıya özgü Batch API'yi kullan |

Batch modu yalnızca **LLM** düğümünde kullanılabilir. [Agent Node](./agent-node.md) için geçerli **değildir**.

Batch modu etkinleştirildiğinde:

- `outputType` `text` olarak kalmalıdır
- `imageInputEnabled` `false` olarak kalmalıdır
- `userMessage` bir **dizi** olarak çözümlenmelidir
- her dizi öğesi bir string veya ilkel değere çözümlenmelidir

Tipik örnekler:

- `$input.items.map("item.text")`
- `$vars.promptList`

İfade bir dizi yerine tek bir string'e çözümlenirse, sağlayıcı çağrısı başlamadan önce çalıştırma bir doğrulama hatasıyla başarısız olur.

## Batch Durum Dalı

Batch modu etkinleştirildiğinde, LLM düğümü ikinci bir çıkış tutamacı sunar: `batchStatus`.

Bu dalı, batch hâlâ çalışırken bildirimler, günlükleme, Slack mesajları veya yan etkiler için kullanın. Dal, sağlayıcı durumu anlamlı şekilde değiştiğinde tetiklenir; aşağıdakiler gibi normalleştirilmiş durumlar dahil:

- `pending`
- `processing`
- `completed`
- `failed`

Durum dalı payload'ı, aşağı akış düğümlerinde `$input` olarak kullanılabilir ve şunları içerir:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Örnek kenar:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Örnek durum eşleyici:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Batch Sonuç Yapısı

Başarılı tamamlanmada, ana LLM çıktısı şunları içerir:

- `$nodeLabel.text` – birleştirilmiş başarılı metinler
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – öğe başına sonuçlar orijinal sırada
- `$nodeLabel.usage`

`$nodeLabel.results` içindeki her öğe şu gibi alanları içerir:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

**JSON çıktısı** batch moduyla birlikte etkinleştirildiğinde, Heym her başarılı öğeyi ayrı ayrı ayrıştırır. Ayrıştırılmış nesneler öğe başına sunulur ve `parsedResults` üzerinde toplanır.
## Responses API

Bir **Use Responses API** onay kutusu, düğümün çağrısını Chat Completions yerine
[Responses API](https://platform.openai.com/docs/api-reference/responses) üzerinden yönlendirir.
Varsayılan olarak kapalıdır ve düğüm her iki durumda da aynı şekilde davranır: aynı prompt'lar,
aynı JSON çıktı şeması, aynı sonuç yapısı.

Bir OpenAI credential'ı ile ve gateway'i bu endpoint'i destekleyen özel bir credential ile
çalışır; böylece self-hosted veya proxy üzerinden çalışan bir kurulum da bunu kullanabilir. Bir
Google credential'ı ile devre dışı kalır ve [Batch mode](#batch-status-branch) ile birlikte
kullanılamaz - düğüm paneli, herhangi bir şey çalıştırmadan önce belirli bir credential'ın
durumunu belirtir.

Endpoint'in çalışma zamanında kullanılamaz olduğu ortaya çıkarsa, düğüm sessizce geri dönmek
yerine nedeni belirten bir mesajla başarısız olur; böylece Responses API için yapılandırılmış bir
düğüm her zaman onun üzerinde çalışır. Kasıtlı olarak başka bir credential veya modele geri
dönmek için **Fallback Credential** ve **Fallback Model** alanlarını kullanın; bunlar bu onay
kutusunu devralır, dolayısıyla bir fallback credential'ının da endpoint'i desteklemesi gerekir.

## Image Generation

- **Modeller:** `nanobanana`, `gemini-2.0-flash-exp`
- **Çıktı:** `$nodeLabel.image` (base64 data URL)
- Prompt için [Input](./input-node.md) kullanırken, `userMessage` içinde `$userPrompt.body.text`
  kullanın

## JSON Output

`jsonOutputEnabled` true olduğunda, LLM şemaya uyan JSON döndürür. Alanlara
`$nodeLabel.fieldName` üzerinden erişin.

## Extra Body

Bazı sağlayıcılar, standart OpenAI uyumlu alanların kapsamadığı istek parametrelerini kabul
eder; örneğin bir modelin thinking modunu devre dışı bırakmak gibi. Düğüm özelliklerinde **Send
extra request body** seçeneğini işaretleyin ve bir JSON nesnesi girin. Bu, bu düğümün yaptığı her
API isteğine birleştirilir.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Varsayılan olarak devre dışı.** Onay kutusu kapalıyken hiçbir ek veri gönderilmez.
- Bir JSON **nesnesi** olmalıdır. Bir dizi, bir skaler veya hatalı biçimlendirilmiş metin,
  sessizce yok sayılmak yerine düğümü `Invalid extra body JSON` ile başarısız kılar.
- Onay kutusunun yanındaki **Format** düğmesi JSON'u yeniden biçimlendirir ve metin
  ayrıştırılamadığında `Invalid` yazarak kırmızıya döner.
- Ana completion'a, fallback model denemesine ve batch mode isteklerine uygulanır. Farklı bir
  istek şekli ve ayrı bir model kullanan image generation veya guardrail kontrollerine
  uygulanmaz.
- `$` ifadeleri ayrıştırmadan önce çözümlenir, dolayısıyla `{"max_tokens": $prev.limit}` çalışır.
  Bu metinsel bir değiştirme olduğundan, çözümlenen bir değerin çift tırnak veya yeni satır
  içermesi geçersiz JSON üretir ve düğümü başarısız kılar.

## Örnek – Metin

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Örnek – Batch metni

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Örnek – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

LLM çağrısından önce güvenli olmayan kullanıcı mesajlarını engellemek için düğüm
özelliklerinde **Guardrails** seçeneğini etkinleştirin. Tam referans için
[Guardrails](../reference/guardrails.md) bölümüne bakın.

## İlgili

- [Agent Node](./agent-node.md) – Tool calling özellikli LLM
- [Why Heym](../getting-started/why-heym.md) – LLM adımlarının agent yaşam döngüsüne nerede
  uyduğu
- [Guardrails](../reference/guardrails.md) – Güvenli olmayan içerik kategorilerini engelleyin
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Expression DSL](../reference/expression-dsl.md) – Prompt'larda verilere başvurma
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Prompt'lar için
  canlı backend önizlemeli genişletilebilir düzenleyici
- [Credentials Tab](../tabs/credentials-tab.md) – LLM API anahtarları ekleyin
- [Quick Start](../getting-started/quick-start.md) – Temel LLM workflow'u
