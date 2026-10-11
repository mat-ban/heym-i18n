# Koşul

**Condition** düğümü, bir if/else ifadesine göre workflow'u dallandırır. Sonuca bağlı olarak true veya false yoluna yönlendirir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 2 (true, false) |
| Çıkış | Girdiyi seçilen dala aktarır |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `condition` | expression | JavaScript benzeri ifade (örn. `$input.text.length > 0`) |

## Kenar Tutamaçları

- **Kaynak tutamacı `true`** – koşul truthy olarak değerlendirildiğinde
- **Kaynak tutamacı `false`** – koşul falsy olarak değerlendirildiğinde

## İfade Operatörleri

Desteklenenler: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` vb. Bkz. [Expression DSL](../reference/expression-dsl.md).

## Örnek

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Farklı dallara yönlendirmek için kenarları `sourceHandle: "true"` veya `sourceHandle: "false"` ile bağlayın.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Switch Node](./switch-node.md) – Değere göre çok yollu yönlendirme
- [Expression DSL](../reference/expression-dsl.md) – Koşul sözdizimi
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Koşul için canlı backend önizlemeli genişletilebilir düzenleyici
