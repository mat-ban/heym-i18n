# Switch

**Switch** düğümü, bir değeri case'lerle eşleştirerek yürütmeyi farklı yollara yönlendirir. N adet case ve bir varsayılan (default) durumu destekler.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | n (her case için bir tane + default) |
| Çıkış | Girişi eşleşen dala geçirir |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `expression` | expression | Değerlendirilecek değer (örn. `$input.category`) |
| `cases` | string[] | Eşleştirilecek case değerleri (örn. `["case1", "case2", "case3"]`) |

## Kenar Tutamaçları (Edge Handles)

- Her case bir kaynak tutamaç alır (indeks 0, 1, 2, …)
- Eşleşmeyen değerler için default tutamaç

## Örnek

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Kenarları (edge), `sourceHandle` değerini case indeksine (0, 1, 2) veya eşleşmeyen değerler için default tutamaca ayarlayarak bağlayın.

## İlgili Konular

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Condition Düğümü](./condition-node.md) – If/else dallanması
- [Expression DSL](../reference/expression-dsl.md) – Expression sözdizimi
