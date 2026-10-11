# Agent Düğümü

**AI Agent** düğümü, araç çağırma yeteneğine sahip bir LLM düğümüdür. Python araçlarını çalıştırabilir, bağlı canvas düğümlerini araç olarak çağırabilir, MCP sunucularına bağlanabilir, yetenekleri (skills) kullanabilir, isteğe bağlı olarak diğer agent düğümlerine delege eden bir orkestratör görevi görebilir, diğer workflow'ları araç olarak çağırabilir ve [insan incelemesi](../reference/human-in-the-loop.md) için durabilir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1, ayrıca HITL etkinleştirildiğinde isteğe bağlı `review` |
| Çıkış | `$nodeLabel.text`, `$nodeLabel.fieldName` (JSON çıkışı etkinleştirildiğinde) veya inceleme beklenirken bekleyen bir HITL payload'ı |

## Temel Parametreler

### Credential ve Model

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | Settings'ten alınan LLM credential'ı (API anahtarı) |
| `model` | string | Model adı (örn. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (isteğe bağlı) | Birincil başarısız olduğunda kullanılacak yedek credential |
| `fallbackModel` | string (isteğe bağlı) | Birincil başarısız olduğunda kullanılacak yedek model |

Credential'ları [Credentials](../tabs/credentials-tab.md) sekmesinden ekleyin. Model listesi seçilen credential'dan yüklenir. Birincil credential veya model bir hata döndürürse, düğüm başarısız olmadan önce otomatik olarak yedek credential ve model ile yeniden dener.

### Prompt'lar

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `systemInstruction` | string | AI için system prompt. [İfadeleri](../reference/expression-dsl.md) destekler. |
| `userMessage` | string | Kullanıcı mesajı/prompt'u. Varsayılan: `$input.text` |
| `jsonOutputEnabled` | boolean | Yapılandırılmış JSON çıkışı |
| `jsonOutputSchema` | string | Yapılandırılmış çıkış için JSON Schema |
| `extraBodyEnabled` | boolean | Sağlayıcıya özgü istek parametrelerini gönderir (varsayılan: `false`) |
| `extraBody` | string | Agent'ın yaptığı her API isteğine birleştirilen JSON nesnesi |

`$input.text`, `$nodeName.field` ve diğer [Expression DSL](../reference/expression-dsl.md) sözdizimini kullanın.

### Reasoning modelleri (o1, o3)

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (varsayılan: 0.7), standart modeller için |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning modelleri için reasoning derinliği |

Bir reasoning modeli (örn. o1, o3) kullanırken, arayüz Temperature yerine **Reasoning Effort** gösterir. Standart modeller için **Temperature** yaratıcılığı kontrol eder.

**JSON çıkış örneği:** Agent'tan yapılandırılmış veriye ihtiyaç duyduğunuzda (örn. sınıflandırma, çıkarım), JSON çıkışını etkinleştirin ve bir schema sağlayın. Agent, schema ile eşleşen JSON döndürür; alanlara düğüm çıkışında adlarıyla erişebilirsiniz:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Alt düğümler `$agentLabel.status`, `$agentLabel.reason` vb. kullanabilir. [LLM düğümü](../nodes/llm-node.md) JSON çıkışıyla aynı davranış.

## İnsan İncelemesi (HITL)

Bir agent'ın önemli eylemlerden önce belirli anlarda onaya ihtiyaç duyabileceği durumlarda HITL kullanın.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Agent'a insan incelemesi kontrol noktaları ekler |
| `hitlSummary` | string | Agent'a insan incelemesinin ne zaman gerekli olduğunu söyleyen onay yönergeleri |

HITL etkinleştirildiğinde, agent bir `request_human_review` aracı alır. Hangi araç çağrılarının, alt agent'ların, alt workflow'ların, MCP eylemlerinin, yeteneklerin veya yan etkilerin onay gerektirdiğini açıklamak için system prompt'u ve bu yönergeler alanını kullanın. Agent bu aracı yalnızca gerektiğinde çağırabilir; tek bir çalıştırmada birden çok kez dahil.

Genel sayfadaki inceleyiciye yönelik özet, çalışma zamanında agent'ın inceleme isteğinden oluşturulur. Agent açıkça bir özet sağlamazsa, Heym Markdown inceleme gövdesinden bir özet türetir.

MCP araçları için Heym, modelden yazdığınız HITL talimatlarını üç kapsamdan biri olarak yorumlamasını ister: `always`, `once` veya `never`. Bu, "her çağrı için", "yalnızca bir kez" veya "asla sorma" gibi serbest biçimli ifadelerin çalışma zamanı geçitlendirmesi uygulanmadan önce normalleştirildiği anlamına gelir.

Her HITL kontrol noktası `/review/{token}` adresinde tek kullanımlık bir genel inceleme bağlantısı oluşturur. Bir inceleyici şunları yapabilir:

- Orijinal Markdown inceleme metnini **Kabul edebilir**
- Değiştirilmiş Markdown ile **Düzenle ve Devam Et**
- **Reddet** ve `text: ""` ile devam et

HITL etkinleştirildiğinde, düğüm ayrıca canvas üzerinde bir `review` çıkış tutamacı sunar. İnceleme URL'sini ve özetini çalıştırma duraklatılır duraklatılmaz yayınlamak istiyorsanız, bu dalı Slack, e-posta veya diğer bildirim düğümlerine bağlayın.

Bir inceleyici yanıt verene kadar yürütme `pending` durumuna geçer. İnceleme metni tek bir Markdown gövdesidir ve bekleyen payload ayrıca harici devir için paylaşılabilir bağlantı metni içerir. `review` dalındaki düğümler duraklatma oluşturulduğunda hemen çalışır; normal çıkış yolu yalnızca onaydan sonra devam eder. Onaydan sonra Heym, saklanan yürütme anlık görüntüsünden devam eder ve agent onaylanan bağlamla sürdürür. Sonraki bir adım da onay gerektiriyorsa, agent başka bir HITL kontrol noktası oluşturabilir. Payload şekli, inceleme URL'si davranışı ve devam etme semantiği için [Human-in-the-Loop](../reference/human-in-the-loop.md) bölümüne bakın.

HITL yalnızca metin modunda agent çıkışı için kullanılabilir. v1'de `jsonOutputEnabled` ile birleştirilemez.
## Orchestrator Modu

Etkinleştirildiğinde, ajan görevleri workflow içindeki diğer ajan düğümlerine devredebilir. **Orchestrator modu devre dışıysa**, ajan canvas üzerinde **ajan→ajan bağlantıları oluşturamaz**.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `isOrchestrator` | boolean | `true` olduğunda, ajan bir `call_sub_agent` aracı alır |
| `subAgentLabels` | string[] | Bu orchestrator'ın çağırabileceği ajan düğümlerinin etiketleri |

**Alt ajanlar**, orchestrator'ın prompt'unu alabilmeleri için User Message'larında `$input.text` kullanmalıdır.

Orchestrator tek bir turda birden fazla alt ajanı çağırdığında, bunlar paralel olarak yürütülür. Ayrıntılar için [Ajan Mimarisi](../reference/agent-architecture.md) bölümüne bakın.

## Alt Workflow'lar

Yapılandırıldığında, ajan diğer workflow'ları yürütmek için bir `call_sub_workflow` aracı alır.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | Bu ajanın araç olarak çağırabileceği workflow'ların ID'leri |

Ajan yapılandırmasının Sub-Workflows bölümünde workflow'ları seçin. Ajan bunları `workflow_id` ve `inputs` (hedef workflow'un giriş alanlarıyla eşleşen nesne) ile çağırır. Maksimum derinlik: 5 iç içe alt workflow çağrısı.

## Canvas Düğüm Araçları

Desteklenen bir workflow düğümünü bir ajanın **tools** tutamacına bağlayabilirsiniz, böylece ajan çalışma zamanında o düğümü çağırabilir. Bu, mevcut canvas eylemlerini ve dönüşümlerini Python yazmadan çağrılabilir araçlara dönüştürür.

Canvas düğüm araçlarını, kimlik bilgilerini, statik alanları ve workflow'a özgü ayarları düğüm arayüzünde tutarken ajanın yapılandırılmış bir düğümü ne zaman çalıştıracağına karar vermesini istediğinizde kullanın.

### Ajan tarafından sağlanan alanlar

Bağlı bir araç düğümündeki alanlar bot simgesiyle işaretlenebilir. İşaretlenen alanlar, ajanın düğümü çağırırken sağlaması gereken zorunlu araç parametreleri haline gelir. İşaretlenmemiş alanlar sabit kalır ve düğüm yapılandırmasından okunur.

Örneğin:

- Bir Slack düğümünü bir ajana araç olarak bağlayın
- Kimlik bilgisini Slack düğümünde sabit tutun
- `message` alanını ajan tarafından sağlanan olarak işaretleyin
- Ajan, çalışma zamanında yalnızca mesajı sağladığı bir Slack aracı alır

Düğüm bir ajana araç olarak bağlı değilse, bot simgesi gizlenir ve düğüm normal bir workflow adımı gibi davranır.

### Çalışma zamanı davranışı

Ajan bir canvas düğüm aracını çağırdığında, Heym ajan tarafından sağlanan argümanları geçici olarak o düğümün verisine birleştirir, düğümü yürütür, düğüm çıktısını ajana döndürür ve ardından orijinal düğüm yapılandırmasını geri yükler. Araç düğümleri normal zamanlama yoluyla düzenli workflow adımları olarak çalışmaz; yalnızca ajan onları çağırdığında çalışırlar.

Canvas düğüm araçları, Slack, Telegram, HTTP, Send Email gibi entegrasyon düğümleri ve [Set](./set-node.md) gibi veri şekillendirme düğümleriyle kullanışlıdır. Trigger düğümleri, kontrol akışı düğümleri ve terminal çıktı eşleyicileri ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) ajan araçları olarak kullanılamaz.

## Python Araçları

Ajanın çağırabileceği özel araçları tanımlayın. Her aracın şunları vardır:

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `name` | string | Araç adı (örn. `count_characters`) |
| `description` | string | LLM için açıklama |
| `parameters` | JSON Schema | OpenAI function-calling şeması (nesne biçimi) |
| `code` | string | Python fonksiyon kodu |

**Parameters** bir dize değil, bir JSON nesnesi olmalıdır:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Sayılacak metin" }
  },
  "required": ["text"]
}
```

**Örnek araç:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python araçları varsayılan olarak güvenilmeyen kod olarak sağlamlaştırılmış, yalıtılmış bir Docker konteynerinde çalışır (ağ yok, Docker soketi yok, salt okunur dosya sistemi, root olmayan). İçe aktarımlar, güvenli standart kütüphane modüllerinden oluşan bir izin listesiyle sınırlıdır. Yapılandırma (`HEYM_PYTHON_TOOL_SANDBOX`) için [Güvenlik → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) bölümüne bakın.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Araç yürütmesi başına maksimum saniye (varsayılan: 30) |
| `requestTimeoutSeconds` | number | Zaman aşımına uğramadan önce her model yanıtı için beklenecek maksimum saniye (varsayılan: 60). Yavaş veya kendi barındırılan sağlayıcılar (LiteLLM, vLLM, yerel modeller) ve uzun çok adımlı çalıştırmalar için bunu artırın. |
## MCP Bağlantıları

Araçlarını agent'a sunmak için [Model Context Protocol](https://modelcontextprotocol.io/) sunucularına bağlanın.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Bağlantı türü |
| `timeoutSeconds` | number | Bu bağlantı için zaman aşımı (varsayılan: 30) |
| `label` | string | İsteğe bağlı görünen ad |

**stdio** (yerel süreç):

| Alan | Açıklama |
|-------|-------------|
| `command` | Çalıştırılacak komut (örn. `npx`) |
| `args` | JSON dizisi (örn. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Sürece enjekte edilen ortam değişkenlerini içeren JSON nesnesi (örn. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Çoğu API anahtarı kullanan stdio sunucusu, komut argümanları yerine ortam değişkenleri aracılığıyla kimlik doğrulaması yapar. Her agent düğümünün ana makine ortamına dokunmadan farklı bir kimlik bilgisi kullanabilmesi için `env` değerini bağlantı başına ayarlayın.

`env` değerleri [Expression DSL](../reference/expression-dsl.md) destekler; böylece gizli anahtarları sabit kodlamak yerine workflow girdilerini kimlik bilgisi olarak iletebilirsiniz:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

`$userInput.pat` ifadesi, MCP süreci başlamadan önce çalışma zamanında workflow'un girdi verisine göre çözümlenir. Bu sayede token'ları workflow tanımına gömmek yerine bir trigger veya girdi düğümünden kabul edebilirsiniz.

Örnek — Sabit kodlanmış token ile GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Örnek — Workflow girdisinden dinamik token ile GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Örnek — Heym GitHub kimlik bilgisi ile GitHub MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Yerleşik GitHub kimlik bilgisi şu anda PAT tabanlı kimlik doğrulamayı hedefler. Kuruluş erişimine ihtiyacınız varsa, gerekli kuruluş/depo izinlerine sahip bir PAT kullanın.

Örnek — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (uzak sunucu):

| Alan | Açıklama |
|-------|-------------|
| `url` | SSE endpoint URL'si. İfadeleri destekler (örn. `$userInput.serverUrl`). |
| `headers` | Kimlik doğrulama/özel başlıklar için JSON nesnesi. Değerler ifadeleri destekler. |

**Streamable HTTP** (uzak sunucu):

| Alan | Açıklama |
|-------|-------------|
| `url` | MCP endpoint URL'si (örn. `https://example.com/mcp`). İfadeleri destekler. |
| `headers` | Kimlik doğrulama/özel başlıklar için JSON nesnesi. Değerler ifadeleri destekler. |

## Skills

Skills, SKILL.md talimatları ile isteğe bağlı Python dosyaları ve paketlenmiş varlıklardan oluşur. Agent'ın sistem bağlamını genişletir ve Python araçları ekleyebilir.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `name` | string | Skill adı |
| `content` | string | SKILL.md içeriği (talimatlar) |
| `timeoutSeconds` | number | Skill Python yürütmesi için zaman aşımı (varsayılan: 30) |
| `driveFilesEnabled` | boolean | Bu skill için çalışma zamanı `heym_drive` yardımcısını etkinleştirir (varsayılan: false) |
| `files` | array | İsteğe bağlı `{ path, content, encoding, mimeType }` girdileri (örn. `.py` betikleri veya base64 olarak saklanan ikili varlıklar) |

Skills, Skills alanına bir `.zip` veya `.md` dosyası bırakılarak eklenebilir.
Bir skill kartını genişlettikten sonra, paketlenmiş bir dosyayı (PDF ve görseller gibi ikili varlıklar dahil) eklemek veya değiştirmek için o skill'e herhangi bir dosya bırakın.
Bir skill'i yedeklemek veya başka bir workflow'da yeniden kullanmak üzere `.zip` arşivi olarak dışa aktarmak için skill kartındaki indirme düğmesini kullanın.

Bir skill'de **Drive files** seçeneğini yalnızca Python kodu Heym Drive'dan dosya okumaya ihtiyaç duyduğunda etkinleştirin. Etkinleştirilen skill'ler çalışma zamanında oluşturulan bir `heym_drive.py` yardımcısı alır ve bir Drive dosya kimliği veya tam dosya adı ile `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` veya `read_drive_base64` çağrılarını yapabilir. Dosya adı araması, erişilebilen en yeni eşleşmeyi kullanır. Devre dışı bırakılan skill'ler yardımcıyı almaz.

Her skill kartında başlığın altındaki satırda dört eylem bulunur:

| Düğme | Açıklama |
|--------|-------------|
| **Edit with AI** | Skill'i bir sohbet prompt'undan revize etmek için Skill Builder'ı açın |
| **Download** | Skill'i `.zip` arşivi olarak dışa aktarın |
| **Remove** | Skill'i bu agent düğümünden silin |
| **History** | [Edit History](../reference/edit-history.md) üzerinden türetilen skill geçmişini açın |
### Skill geçmişi

Skill geçmişi ayrı olarak **depolanmaz**. Workflow Düzenleme Geçmişi anlık görüntülerinden türetilir: kaydedilen her workflow sürümü, tam agent düğümü `skills` dizisini içerir.

Geçmiş iletişim kutusundan şunları yapabilirsiniz:

- Geçmiş bir anlık görüntüyü **Önizleme** (SKILL.md ve dosya listesi)
- **Düzenle** — tüm workflow'u geri almadan bir anlık görüntüyü skill düzenleyicisine yükleme
- **AI Fine-tune** — o anlık görüntüyü başlangıç noktası olarak kullanarak Skill Builder'ı açma
- **Geri Al** — yalnızca bu skill'i geçmiş bir sürümden geri yükleme (diğer düğümler olduğu gibi kalır)

Geçmiş, workflow Düzenleme Geçmişi ile aynı 7 günlük saklama süresini izler. Skill düzenlemelerinden sonra workflow'un kaydedilmesi yeni geçmiş girdileri oluşturur.

Skills bölümü ayrıca **AI Build** içerir:

- Bir sohbet prompt'undan yeni bir skill oluşturmak için **AI Build**'e tıklayın
- Mevcut bir skill'i AI ile revize etmek için o skill üzerindeki parıltı düğmesine tıklayın
- Dosyaları prompt oluşturucuya bırakarak fine-tune yorumuna ekleyin; bu dosyalar ayrıca paketlenmiş skill varlıkları olarak kaydedilir
- Modal, canlı `SKILL.md` ve `.py` dosya önizlemelerini gösterirken asistan metnini akış halinde iletir
- **Download ZIP**, düğüme eklemeden geçerli önizlemeyi dışa aktarır
- **Save & Add**, oluşturulan dosyaları manuel yüklemelerde kullanılan aynı ZIP ayrıştırma akışı üzerinden geri kaydeder

AI ile düzenleme yaparken Heym, builder'a yalnızca metin `.md` ve `.py` skill dosyalarını gönderir. İkili ve diğer düzenlenemeyen ekler korunur ve builder ile yol meta verisi olarak paylaşılır; böylece oluşturulan Python kodu göreli dosya referanslarını doğru tutabilir.
Sağ panelde ekli bir dosya seçin ve AI'nın paketlenmiş bir şablonu incelemesi gerektiğinde **Include this file in AI context** seçeneğini etkinleştirin. Metin, PDF ve DOCX dosyaları mümkün olduğunda prompt bağlamına çıkarılır; Heym, platform istek gövdesi sınırının ötesinde ayrı bir Skill Builder ek boyut sınırı uygulamaz.

## Extra Body

Bazı sağlayıcılar, standart OpenAI uyumlu alanların kapsamadığı istek parametrelerini kabul eder; örneğin bir modelin düşünme modunu devre dışı bırakmak gibi. Düğüm özelliklerinde **Send extra request body** seçeneğini işaretleyin ve bir JSON nesnesi girin.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Varsayılan olarak devre dışıdır.** Onay kutusu kapalıyken hiçbir ek veri gönderilmez.
- Yalnızca ilk turda değil, tool-calling döngüsündeki **her** isteğe ve ayrıca fallback model denemesine uygulanır. Ayrı bir model kullanan guardrail kontrollerine uygulanmaz.
- Bir JSON **nesnesi** olmalıdır. Bir dizi, skaler veya hatalı biçimlendirilmiş metin sessizce yok sayılmak yerine düğümü `Invalid extra body JSON` hatasıyla başarısız kılar.
- `$` ifadeleri ayrıştırmadan önce çözümlenir. Bu metinsel bir değiştirme olduğundan, çözümlenen değerin çift tırnak veya yeni satır içermesi geçersiz JSON üretir ve düğümü başarısız kılar.

[LLM düğümü](./llm-node.md) extra body ile aynı alan ve davranış.

## Guardrails

Agent çalışmadan önce güvenli olmayan kullanıcı mesajlarını engellemek için düğüm özelliklerinde **Guardrails** seçeneğini etkinleştirin. Tam referans için [Guardrails](../reference/guardrails.md) bölümüne bakın.

## Kalıcı bellek (graph)

Veritabanında depolanan isteğe bağlı **agent düğümü başına** bilgi grafiği. Etkinleştirildiğinde Heym, her çalıştırmadan önce hatırlanan varlıkların ve ilişkilerin Markdown özetini **system instruction**'a ekler (yalnızca graph boş değilse). **Başarılı** bir agent tamamlanmasından sonra, bir arka plan işi konuşmadan yeni kalıcı gerçekleri çıkarır ve bunları graph'a birleştirir.

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Bu canvas düğümü için yükleme + arka plan çıkarımını etkinleştirir |

**Sub-agent'lar**, orkestratörden ayrı olarak **kendi** graph'larını (düğüm kimliklerine göre anahtarlanmış) tutar.

Graph düzenleyicisini ve isteğe bağlı **memory sharing** (diğer workflow'lar/agent'lar) özelliğini açmak için düğümdeki pembe **brain** kontrolünü kullanın (bellek açıkken veya model satırı gösterildiğinde). Tam davranış, REST yolları ve JSON dışa aktarma ayrıntıları: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API ve akıl yürütme sürekliliği

Bir **Use Responses API** onay kutusu, agent'ın model çağrılarını Chat Completions yerine [Responses API](https://platform.openai.com/docs/api-reference/responses) üzerinden yönlendirir. Varsayılan olarak kapalıdır.

En çok `gpt-5` veya `o` serisi gibi bir akıl yürütme modelinde önemlidir. Responses API, her tool çağrısının yanında modelin akıl yürütmesini döndürür ve agent bu akıl yürütme öğelerini bir sonraki turda geri besler; böylece model, her tool sonucundan sonra yeniden türetmek yerine çok adımlı bir tool döngüsü boyunca düşünce zincirini korur. [İnsan incelemesi](#human-review-hitl) duraklatma ve devam ettirme, [bağlam sıkıştırma](#context-compression) ve nihai yanıt dahil olmak üzere tüm döngü aynı yol üzerinde çalışır.

Konuşmanın kendisi Heym'de kalır. Heym her turda tam girdiyi gönderir ve akıl yürütmeyi şifrelenmiş bir blob olarak taşır; böylece çağrılar arasında sağlayıcı tarafında hiçbir şey saklanmaz. Bağlam sıkıştırmasının özetlediği bir aralıktaki akıl yürütme öğeleri de onunla birlikte düşürülür, çünkü şifrelenmiş bir blob özetlenemez.

Bir OpenAI credential'ı ile ve gateway'i endpoint'i destekleyen özel bir credential ile çalışır. Bir Google credential'ı ile devre dışı kalır.
## Context Sıkıştırma

Bir agent, büyük sonuçlarla (web kazıma, belge okuma, alt workflow çıktıları) birçok araç yinelemesi çalıştırdığında, biriken mesaj geçmişi modelin context penceresi sınırına yaklaşabilir. Heym, context taşmasını önlemek için çalışma sırasında konuşma geçmişini otomatik olarak sıkıştırır.

**Nasıl çalışır:**

1. Her araç yinelemesinden önce Heym mevcut token sayısını tahmin eder (~token başına 4 karakter).
2. Tahmin, modelin context penceresinin **%80**'ini aşarsa sıkıştırma tetiklenir.
3. Mesaj geçmişi korunan ve sıkıştırılan bölümlere ayrılır:
   - **Korunan**: system prompt, ilk kullanıcı mesajı, en son kullanıcı mesajı
   - **Sıkıştırılan**: aradaki her şey (assistant akıl yürütme turları, araç çağrıları, araç sonuçları)
4. Orta bölüm, **aynı model ve credential** kullanılarak özetlenir — ek yapılandırma gerekmez.
5. Sıkıştırılmış özet, orta bölümün yerini tek bir assistant mesajı olarak alır.

**Gözlemlenebilirlik:**

Sıkıştırma olayları, aşağıdaki yerlerde `Context compressed (N messages → summary)` girdileri olarak görünür:
- Canlı yürütme sırasında **Debug paneli** araç çağrısı listesinde
- **Execution history** çalıştırma detay görünümünde
- **Traces sekmesi**nde bir `context.compression` trace girdisi olarak

Sıkıştırma otomatiktir ve Agent düğümleri için her zaman etkindir. LLM düğümleri, Chat sekmesi veya AI Assistant oturumları için **geçerli değildir**.

## İlgili

- [Why Heym](../getting-started/why-heym.md) – Agent'ların üretimde nasıl çalıştığı ve yönetildiği
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Agent düğümü başına bilgi grafiği, isteğe bağlı paylaşım, API, editör
- [Agent Architecture](../reference/agent-architecture.md) – Alt agent'lar, orchestrator, skills, MCP, araç çağrısı
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Genel inceleme sayfaları, bekleyen yürütmeler, onayla/düzenle/reddet akışı
- [Guardrails](../reference/guardrails.md) – Güvenli olmayan içerik kategorilerini engelleme
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [AI Assistant](../reference/ai-assistant.md) – Doğal dille workflow oluşturmak için Chat arayüzü (Agent düğümünden farklıdır)
- [Expression DSL](../reference/expression-dsl.md) – Prompt'larda verilere başvurma
- [Workflow Structure](../reference/workflow-structure.md) – Düğümler, kenarlar ve DSL formatı
- [Quick Start](../getting-started/quick-start.md) – LLM ve ifadelerle temel workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Agent için API anahtarları ekleme
- [MCP Tab](../tabs/mcp-tab.md) – Workflow araçları için MCP yapılandırma
