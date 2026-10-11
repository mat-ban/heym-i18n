# Workflow Yapısı

Workflow'lar, nodes ve edges içeren JSON olarak saklanır. Kullanılabilir node türleri için [Node Türleri](./node-types.md) ve `data` alanlarındaki ifade sözdizimi için [Expression DSL](./expression-dsl.md) sayfalarına bakın.

## Workflow Nesnesi

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Node Nesnesi

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent node `data` (kalıcı bellek)

[Agent](../nodes/agent-node.md) node'ları, her canvas node'u için isteğe bağlı bir bilgi grafiğini destekler:

| Alan | Tür | Açıklama |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | `true` olduğunda, saklanan grafiği system prompt'a yükler ve başarılı çalıştırmalardan sonra yeni olguları birleştirir |
| `memoryShares` | array (isteğe bağlı) | Diğer agent'lara bu node'un bellek grafiğine erişim izni verir (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Bkz. [Agent Kalıcı Belleği](./agent-persistent-memory.md). |

Örnek:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

API yolları, editör davranışı ve çıkarım semantiği için [Agent Kalıcı Belleği](./agent-persistent-memory.md) sayfasına bakın.

## Edge Nesnesi

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Node Türleri

Yaygın `type` değerleri: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) ve daha fazlası. Tam liste: [Node Türleri](./node-types.md). Aynı execution seviyesindeki node'lar [paralel](./parallel-execution.md) çalışır.

## Editör düzeni

Her node, masaüstü canvas düzeni için `position.x` ve `position.y` değerlerine sahiptir. 768px
breakpoint'inin altındaki ekranlarda editör, serbest biçimli Vue Flow canvas'ını tam ekran,
girintili bir workflow ağacıyla değiştirir. Ağaç, bağlı execution yollarını takip eder, paralel
dalları işaretler ve masaüstü editörüyle aynı node etiketlerini, simgeleri ve son çalıştırma
durumunu kullanır.

Bir node'u seçmek için dokunun. Kayıtlı bir execution sonucu varsa, tam ekran detayı input, output
ve error sekmeleriyle açılır. Mobil alt navigasyon **Nodes**, **Properties**, **Run** ve **More**
seçeneklerini sunar; başlık kısmı kaydetme, geçmiş, arama, ayarlar ve paylaşma eylemlerini korur.
Masaüstü, serbest biçimli Vue Flow canvas'ını ve yan panelleri kullanmaya devam eder.

Node kütüphanesinde arama yapmak için mobil Nodes sekmesindeki **Add node** seçeneğini kullanın.
Normal bir node eklendikten hemen sonra bir bağlantı sayfası açılır: bir anchor node seçin ve onu
**After**, **Before** veya **Parallel** dal olarak yerleştirin. Düzenleme modunda, mevcut bir normal
node'a dokunarak aynı sayfayı mevcut bağlantısı seçili şekilde açabilirsiniz. Trigger node'ları
bağımsız kalır çünkü normal input kabul etmezler. Düzenleme kontrolü ayrıca seçili node için bir
kaldırma eylemi sunar. Execution detayları, komşu node sonuçları mevcut olduğunda önceki ve sonraki
oklarını içerir. AI Assistant, mobil ağacın üzerinde bir alt sayfa olarak açılır ve aktif editör
sekmesini değiştirmez.

## İlgili

- [Node Türleri](./node-types.md) – Tüm node türleri ve açıklamaları
- [Canvas Özellikleri](./canvas-features.md) – Editör özellikleri (data pin, execution log'ları, etkinleştirme/devre dışı bırakma, alt workflow'a çıkarma)
- [İndirme ve İçe Aktarma](./download-import.md) – Workflow'ları JSON olarak dışa ve içe aktarma
- [Agent Node](../nodes/agent-node.md) – Agent node `data` yapısı
- [Agent Kalıcı Belleği](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` ve bellek grafiği API'si
- [Expression DSL](./expression-dsl.md) – `userMessage`, `condition`, `$vars`, `$global` vb. için sözdizimi
- [Paralel Execution](./parallel-execution.md) – Node'ların paralel olarak nasıl çalıştığı
- [Trigger'lar](./triggers.md) – Başlangıç node'ları ve giriş noktaları
- [Workflows Sekmesi](../tabs/workflows-tab.md) – Workflow'ları oluşturma ve yönetme
