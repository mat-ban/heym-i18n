# JSON Çıkış Eşleyici

**JSON çıktı eşleyici** düğümü, anahtar/değer [eşlemelerinden](./set-node.md) (Set ile aynı model) bir JSON nesnesi oluşturur. Çağıranların yanıtın kökünde **düz bir JSON gövdesi** alması gerektiğinde bunu kullanın.

## Genel bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 0 (sink) |
| Çalışma zamanı çıktısı | `mappings` üzerinden oluşturulan nesne |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` girdileri (Set ile aynı) |

## Agent aracı kullanımı

Desteklenmez. Bu düğüm terminal bir sink olduğundan, bir [Agent Düğümü](./agent-node.md) araç tutamacına bağlanamaz. Bir agent'ın konuşma ortasında değerleri şekillendirmesi gerektiğinde bir [Set](./set-node.md) düğümü kullanın.

## Webhook ve çalışma davranışı

Bu düğüm workflow'un **tek** terminal çıktısı olduğunda, yürütme **çıktıları** eşlenen nesnenin kendisidir: `mappings` içindeki anahtarlar JSON'un **üst düzeyinde** görünür. Düğüm etiketiyle anahtarlanmış bir dış sarmalayıcı ve `{ "result": ... }` nesnesi **yoktur** ([Output](./output-node.md) düğümünün aksine).

Birden fazla terminal düğümü çıktı üretirse (örneğin [Output](./output-node.md) artı JSON çıktı eşleyici veya birkaç dal), Heym normal şekli kullanır: her terminal kendi `label` değeriyle anahtarlanır.

## Döngü kısıtlaması

[Output](./output-node.md) ile aynı kural: bu düğümü bir döngü yineleme dalının içine yerleştirmeyin—yalnızca döngünün `done` dalından sonra. Bkz. [Loop](./loop-node.md).

## Örnek

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## İlgili

- [Set](./set-node.md) – Ara dönüşümler için aynı eşleme mekaniği
- [Output](./output-node.md) – `result` sarmalamalı mesaj veya şema tabanlı yanıt
- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türleri
- [Workflow Yapısı](../reference/workflow-structure.md) – JSON workflow formatı
- [Webhooks](../reference/webhooks.md) – Execute endpoint ve yanıtları
