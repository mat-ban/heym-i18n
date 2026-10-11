# Human-in-the-Loop

Human-in-the-loop (HITL), bir [Agent Node](../nodes/agent-node.md) düğümünün belirli anlarda onay istemesine, bir insan kararını beklemesine ve ardından workflow'u aynı execution snapshot'ından sürdürmesine olanak tanır.

## Ne Yapar

- Ayrı bir onay workflow'u oluşturmadan bir agent'a açık onay kontrol noktaları ekler
- `/review/{token}` adresinde tek kullanımlık bir genel inceleme URL'si oluşturur
- Bir gözden geçirenin `Accept`, `Edit & Continue` veya `Refuse` seçeneklerinden birini seçmesini sağlar
- Bir karar gelene kadar execution'ı `pending` olarak işaretler
- Duraklatılmış execution'ı sürdürür ve onaydan sonra agent'ın devam etmesini sağlar
- Aynı agent çalıştırmasında birden fazla sıralı HITL kontrol noktasını destekler

## Agent Yapılandırması

Agent özellikleri panelinde HITL'i etkinleştirin.

| Ayar | Açıklama |
|---------|-------------|
| `hitlEnabled` | Bu agent için insan incelemesini açar |
| `hitlSummary` | Agent'ın ne zaman insan incelemesi istemesi gerektiğine dair onay yönergeleri |

HITL, agent'a bir `request_human_review` aracı ekler. Agent'a hangi eylemlerin onay gerektirdiğini bildirmek için system prompt'u ve `hitlSummary` yönergelerini kullanın. Agent bir kontrol noktasının inceleme gerektirdiğine karar verdiğinde, insana tek bir Markdown inceleme metni gönderir. Gözden geçirene gösterilen özet, çalışma zamanında agent'ın isteğinden oluşturulur; agent bunu atlarsa, Heym Markdown gövdesinden bir özet türetir. v1'de HITL yalnızca metin modundaki agent çıktılarını destekler, bu nedenle `jsonOutputEnabled` ile birlikte kullanılamaz.

MCP araçları için Heym, modelden yazılı HITL talimatlarını üç onay kapsamından birine yorumlamasını ister:

- "always", "on each" veya "for each" gibi ifadeler için `always`
- "once" veya "only one time" gibi ifadeler için `once`
- "never", "do not ask" veya "already approved" gibi ifadeler için `never`

Bu yorum, tekrarlanan MCP çağrılarının yeniden duraklayıp duraklamayacağını, bir kez onaylı kalıp kalmayacağını veya insan incelemesini tamamen atlayıp atlamayacağını kontrol eder.

HITL etkinleştirildiğinde, agent ayrıca `review` etiketli ikinci bir canvas çıktı tutamacı sunar. Ana execution bir kişiyi beklerken bekleyen inceleme URL'sini ve özetini Slack, e-posta, günlük kaydı veya başka bir bildirim akışına göndermek için bu dalı kullanın.

## İnceleme Akışı

1. Agent onay gerektiren bir adıma ulaşır ve `request_human_review` çağrısını yapar
2. Heym genel bir inceleme isteği oluşturur ve bir inceleme URL'si döndürür
3. Agent'ın `review` tutamacına bağlı tüm düğümler, bekleyen HITL payload'ı ile hemen çalışır
4. Workflow execution'ı `pending` durumuna geçer
5. Bir gözden geçiren, giriş yapmadan `/review/{token}` adresini açar
6. Gözden geçiren bir eylem seçer:
   - `Accept` orijinal Markdown ile devam eder
   - `Edit & Continue` düzenlenmiş Markdown ile devam eder
   - `Refuse` `decision: "refused"` ile devam eder ve sonraki agent eylemlerini atlar
7. Heym workflow'u saklanan snapshot'tan sürdürür ve agent'ın onaylanan Markdown bağlamıyla devam etmesini sağlar
8. Sonraki bir adım da onay gerektiriyorsa, agent HITL'i yeniden çağırabilir ve başka bir bekleyen kontrol noktası oluşturabilir

Kimse yanıt vermezse inceleme bağlantıları 168 saat sonra sona erer.

## Genel İnceleme Sayfası

Genel inceleme sayfası şunları gösterir:

- Workflow adını ve agent etiketini
- Agent'ın inceleme isteğinden otomatik oluşturulan bir gözden geçiren özetini
- Ana içerik olarak önce Markdown inceleme metnini
- Yalnızca gözden geçiren `Edit` seçeneğine tıkladıktan sonra açılan bir düzenleme kutusunu
- Düzenleme sırasında canlı bir Markdown önizlemesini
- `Accept`, `Edit & Continue` ve `Refuse` için eylem düğmelerini

Bir karar gönderildikten sonra token kilitlenir ve yeniden kullanılamaz.

## Çıktılar ve Execution Durumu

İnceleme beklenirken agent çıktısı bekleyen bir payload içerir:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Gözden geçiren yanıt verdikten ve workflow sürdürüldükten sonra, nihai agent çıktısı karar meta verilerini içerir:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Kabul edilen, düzenlenen veya reddedilen sonuçlara göre dallanmak için sonraki düğümlerde `$agentLabel.decision` kullanın.

## Canvas İnceleme Dalı

`review` çıktı tutamacı yalnızca bir agent için `hitlEnabled` açıldığında kullanılabilir.

- İnsan kararı gelmeden önce çalışır
- `summary`, `draftText`, `reviewUrl`, `shareText` ve `shareMarkdown` dahil olmak üzere bekleyen HITL payload'ını alır
- Slack, e-posta veya denetim günlüğü gibi bildirim veya devir adımları için tasarlanmıştır
- Her HITL kontrol noktası için bir kez çalışır
- Gözden geçiren yanıt verdikten sonra yeniden çalışmaz; devam etme sırasında yalnızca normal agent çıktı yolu sürdürülür

## Göründüğü Yerler

- [Execution History](./execution-history.md), `pending` çalışmaları hemen gösterir ve inceleme URL'sini node sonuçlarında saklar
- [Portal](./portal.md) sohbet yanıtları, boş bir yanıt yerine insan inceleme bağlantısını gösterir
- Debug paneli ve geçmiş iletişim kutuları, nihai HITL kararını ve incelenen metni gösterir
- İnceleme çıktı handle'ı, workflow cron, curl veya portal trafiğiyle tetiklenmiş olsa bile harici kanalları bilgilendirebilir
- Birden fazla HITL kontrol noktası, aynı execution history girdisini yeniden kullanırken her duraklama için yeni bir tek kullanımlık inceleme bağlantısı oluşturur

## Mevcut Sınırlamalar

- HITL yalnızca Agent node'larında kullanılabilir
- HITL, agent'ın metin çıktısını kullanır ve v1'de JSON çıktısını desteklemez
- Duraklatılmış bir çalışma, en son düzenlenen workflow sürümünden değil, saklanan workflow snapshot'ından devam eder
- İç içe sub-workflow'lar v1'de bekleyen bir HITL durumuna giremez; bunları çağırmadan önce üst agent'tan inceleme talep edin

## İlgili

- [Agent Node](../nodes/agent-node.md) - Bir agent üzerinde HITL yapılandırın
- [Agent Architecture](./agent-architecture.md) - Agent'ların, tool'ların, sub-agent'ların ve HITL'in birbirine nasıl uyduğu
- [Execution History](./execution-history.md) - Bekleyen ve devam ettirilen çalışmaları inceleyin
- [Board](../tabs/board-tab.md) - Board chain çalışmaları, HITL'de kartı bekleyen (amber) durumda duraklatır
- [Portal](./portal.md) - Genel sohbet akışları ve HITL inceleme bağlantıları
