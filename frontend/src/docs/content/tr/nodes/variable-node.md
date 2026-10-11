# Değişken

**Variable** düğümü, herhangi bir düğümden `$vars.variableName` (workflow-local) veya `$global.variableName` (kalıcı) aracılığıyla erişilebilen bir değişkeni ayarlar veya günceller. Sayaçlar, biriktirilen listeler ve workflow genelinde paylaşılan durum için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.value` veya `$vars.variableName` / `$global.variableName` aracılığıyla erişim |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `variableName` | string | Değişken adı (`$vars.variableName` veya `$global.variableName` olarak kullanılır). [Ayrılmış adlardan](../reference/expression-dsl.md) kaçının. |
| `variableValue` | expression | Ayarlanacak değer. İfadeleri destekler. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tür dönüşümü (varsayılan: auto) |
| `isGlobal` | boolean | `true` olduğunda, [Global Variable Store](../reference/global-variables.md) içinde saklanır (kalıcı, kullanıcı kapsamlı). `false` olduğunda veya belirtilmediğinde, workflow-local (bellek içi). |

## Dizi Değişkenleri

`.add()` kullanmadan önce bir Variable düğümünde dizileri `$array()` veya `$array("a", "b")` ile başlatın:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Ardından öğeleri ekleyin (parantez içinde `$` olmadan):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritik Kural

**Metot parantezlerinin içinde asla `$` kullanmayın:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – ifadeyi bozar

## Örnek – Sayaç

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Loop Node](./loop-node.md) – Döngü gövdesinde Variable ile öğeleri toplayın
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, ayrılmış adlar
- [Global Variables](../reference/global-variables.md) – `isGlobal` ile kalıcı değişkenler
