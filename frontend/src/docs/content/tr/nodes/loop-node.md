# Döngü

**Loop** düğümü bir dizi üzerinde yineleme yapar ve her öğe için alt düğümleri çalıştırır. İlerlemek için yineleme gövdesindeki son düğümden bir geri bağlantı gerektirir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 2 (varsayılan + loop geri bağlantısı) |
| Çıkışlar | 2 (loop, done) |
| Çıktı | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `arrayExpression` | expression | Bir diziye çözümlenen ifade (örn. `$input.items`) |

## Kenar Tutamaçları

- **Kaynak `loop`** – Her öğeyi işleyen düğümlere bağlanır (her yinelemede çalışır)
- **Kaynak `done`** – Tüm yinelemeler tamamlandıktan sonra çalışan düğümlere bağlanır
- **Hedef default** – Diziyi içeren başlangıç verisini alır
- **Hedef `loop`** – Yineleme gövdesindeki son düğümden geri bağlantıyı alır

## Loop Bağlamı (yineleme gövdesinde)

- `$loopNode.item` – Geçerli öğe
- `$loopNode.index` – 0 tabanlı dizin
- `$loopNode.total` – Toplam öğe sayısı
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritik Kurallar

1. **Geri bağlantı gereklidir:** Yineleme gövdesindeki son düğüm, loop'un `loop` giriş tutamacına MUTLAKA geri bağlanmalıdır.
2. **Loop gövdesinde çıktı olmaz:** Loop gövdesi içinde [Output](./output-node.md) düğümleri yasaktır. Ara sonuçlar için [Set](./set-node.md) veya [Variable](./variable-node.md) kullanın.
3. **Otomatik sonuç yoktur:** Loop sonuçları toplamaz. Biriktirmek için `$array()` ve `.add()` ile Variable düğümlerini kullanın.

## Örnek

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Akış: loop → işlem düğümü → (loop'a geri) → loop → done dalı → output.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Variable Node](./variable-node.md) – Bir loop içinde öğeleri toplama
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, dizi metotları
