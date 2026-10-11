# Kalıcı Agent Belleği

Agent düğümleri, veritabanında saklanan **düğüm başına bir bilgi grafiği** tutabilir: varlıklar (türleri ve özellikleriyle birlikte) ve aralarındaki ilişkiler. Etkinleştirildiğinde Heym, **her çalıştırmada bu grafiğin bir özetini sistem prompt'una enjekte eder** (grafik boş değilse). Başarılı bir çalıştırmadan sonra, arka planda bir **LLM çıkarım işi** konuşmadaki yeni olguları grafiğe birleştirir.

Alt ajanlar ve orkestratörler varsayılan olarak **kendi canvas düğümlerine** bağlı grafiği kullanır. Ayrıca **diğer ajanlara bu düğümün grafiğine okuma veya okuma/yazma erişimi verebilirsiniz** (sahip olduğunuz **diğer workflow'lardaki** ajanlar dahil)—bkz. [Diğer ajanlarla paylaşma](#sharing-with-other-agents).

## Etkinleştirme

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | `true` olduğunda, bu düğümün grafiğini sistem prompt'una yükler ve bu düğümün grafiği için çalıştırma sonrası çıkarım planlar |
| `memoryShares` | array (isteğe bağlı) | Diğer agent düğümlerine **bu** düğümün bellek grafiğine erişim verir; bkz. [Paylaşma](#sharing-with-other-agents) |

Agent düğümü özelliklerinde (**Kalıcı bellek (grafik)**) etkinleştirin. Bellek etkinleştirildiğinde (veya bir model gösterildiğinde) düğüm üzerindeki pembe bir **beyin** simgesi grafik düzenleyicisini açar.

## Grafik düzenleyici

İletişim kutusu varlıkları animasyonlu, kuvvet yönlendirmeli bir grafik olarak işler — bağlantı sayısına göre boyutlandırılmış ve varlık türüne göre kümelenmiş renkli daireler — ayrıca düzenleme ve gezinme (görünümü sığdır, düzeni toparla, klavye kısayolları) sunar. Düğümleri ve kenarları **manuel olarak ekleyebilir, düzenleyebilir veya silebilirsiniz**; Kaynak/Hedef ilişki seçicileri çok sayıda varlık içeren grafikler için aranabilir. Bir düğüm seçildiğinde, o düğüme atlamak için her biri tıklanabilir olan giden ve gelen bağlantıları gösterilir. Değişiklikler yalnızca **bu** ajanın grafiğine uygulanır (beyinini açtığınız canvas düğümünün grafiği).

## Diğer ajanlarla paylaşma

Bellek grafiği iletişim kutusunda, **Belleği diğer ajanlarla paylaş**, çalışma zamanında bu grafiği tüketebilecek **eşleri** eklemenize olanak tanır:

1. Bir **workflow** seçin (düzenleyicide açabileceğiniz herhangi bir workflow).
2. O workflow'daki bir **agent** düğümü seçin.
3. **Salt okunur** veya **Oku ve yaz** olarak ayarlayın.

| İzin | Etki |
|------------|--------|
| Salt okunur | **Eş** ajan çalıştığında, bu grafik (varlıkları varsa) eşin sistem prompt'una birleştirilir. Eşin çalıştırmasından bu grafiğe çıkarım yapılmaz. |
| Oku ve yaz | Okuma ile aynı prompt davranışı ve **başarılı** bir eş tamamlanmasından sonra, olağan bellek çıkarımı eş çalıştırmasının kimlik bilgisi kullanılarak **bu (sahip) grafiğe de birleştirilebilir**. |

Eşler, sahip düğüm başına `peerWorkflowId` ve `peerCanvasNodeId` (ve `permission`) içeren `memoryShares` girdileri olarak saklanır. Eski workflow'lar **aynı** workflow'daki eşler için `peerWorkflowId` alanını atlayabilir; düzenleyici bunu geçerli workflow olarak değerlendirir.

**Workflow'lar arası paylaşım**, çalışma zamanında **sahip olduğunuz** workflow'lar taranarak çözümlenir. Kimliği doğrulanmış kullanıcı bağlamı olmayan çalıştırmalar yalnızca **geçerli** workflow'un JSON'unda (aynı canvas) tanımlanan paylaşımları çözümler.

## Çalışma zamanı davranışı

### Kendi grafiği (`persistentMemoryEnabled`)

1. **LLM çağrısından önce** — Grafikte varlıklar varsa, sistem talimatına bunların önceki çalıştırmalardan gelen olgular olduğunu açıklayan bir blok eklenir (eksik olabilir; çakışma durumunda geçerli kullanıcı mesajı geçerlidir).
2. **Başarılı bir tamamlamadan sonra** — Bir arka plan işi, modelden (ajan çalıştırmasıyla aynı kimlik bilgisi) yapılandırılmış JSON (varlıklar + ilişkiler) ister. Bu payload veritabanına birleştirilir (bazı türler için, örneğin istihdam tarzı kenarlar için yinelenenleri kaldırma ve ilişki temizliği uygulanır).

### Paylaşılan grafikleri alan eş

Bir ajan çalıştığında, sistem `memoryShares` alanları bu çalıştırmanın workflow'una ve canvas düğümüne işaret eden **sahip** düğümleri (mümkün olduğunda workflow'larınızdan herhangi birinde) bulur. Her eşleşme için, o sahibin grafiği sistem prompt'una bir **paylaşılan bellek** bölümü olarak eklenir. **Oku ve yaz** eşleri ayrıca çalıştırma başarılı olduğunda **sahip** workflow/grafiği için çıkarım hedefleri planlar.

Çalıştırma hata verdiğinde veya HITL bekleyen durumunda sona erdiğinde çıkarım **çalışmaz**.

## Workflow JSON (`data` alanı)

Diğer ayarlar gibi agent düğümünde saklanır:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` değeri `"read"` veya `"write"` olur. Paylaşım yoksa `memoryShares` alanını atlayın veya `[]` kullanın.

Tam düğüm nesnesi yapısı için bkz. [Workflow Yapısı](./workflow-structure.md).

## İlgili

- [Agent Düğümü](../nodes/agent-node.md) — Tam agent yapılandırması
- [Agent Mimarisi](./agent-architecture.md) — Orkestratör, alt ajanlar, araçlar
- [Workflow Yapısı](./workflow-structure.md) — JSON workflow biçimi
- [Canvas Özellikleri](./canvas-features.md) — Beyin kontrolü ve grafik iletişim kutusu
- [Traces sekmesi](../tabs/traces-tab.md) — LLM istek/yanıt gözlemlenebilirliği
