# Ayarla

**Set** düğümü, giriş verilerini dönüştürür ve özel çıktıya eşler. Büyük harfe dönüştürme, alt dize alma, birleştirme, rastgele sayı üretme ve her türlü veri dönüşümü için kullanın—workflow çağırmak için kullanmayın (bunun için [Execute](./execute-node.md) düğümünü kullanın).

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıktı | Her eşleme anahtarı için `$nodeLabel.keyName` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `mappings` | array | Anahtar-değer çiftleri. Her biri: `{ key, value }` burada `value` bir [expression](../reference/expression-dsl.md)'dır |

## Agent tool kullanımı

Bir Set düğümü, canvas düğümü aracı olarak bir [Agent Node](./agent-node.md)'a bağlandığında, her eşleme değeri bot simgesiyle **agent-provided** olarak işaretlenebilir. İşaretlenen eşleme değerleri, agent'ın çalışma zamanında doldurduğu tool parametreleri haline gelir. İşaretlenmeyen eşlemeler düğüm yapılandırmasında sabit kalır.

Bot simgesi yalnızca Set düğümü bir agent'ın tools handle'ına bağlandığında görünür. Bağımsız bir Set düğümü agent-provided kontrollerini göstermez.

## Expression Kuralları

- Önceki düğümlere başvurun: `$nodeName.text`, `$nodeName.body.field`
- Fonksiyonları kullanın: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` b'yi hariç tutar; `a > b` durumunda hata verir.
- Expression'ın başında yalnızca bir `$` bulunur—asla parantez içinde değil
- Çıktıya anahtarla erişin: `$setNode.randomNumber`, `$setNode.text`

## Örnek

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Alt düğümler `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr` üzerinden erişir.

## İlgili

- [JSON output mapper](./json-output-mapper-node.md) – Aynı eşlemeler; tek terminal webhook'lar/runs için kök JSON döndürür
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Execute Node](./execute-node.md) – Workflow çağırma (veri dönüşümü değil)
- [Expression DSL](../reference/expression-dsl.md) – Fonksiyonlar ve sözdizimi
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Canlı backend önizlemesi ve eşlemeler için Prev/Next içeren genişletilebilir editör
