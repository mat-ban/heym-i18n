# Konsol Günlüğü

**Console Log** düğümü, bir değeri backend (sunucu) konsoluna kaydeder. Geliştirme sırasında hata ayıklama ve inceleme için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | Girişi olduğu gibi iletir |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `logMessage` | expression | Kaydedilecek değer. [İfadeleri](../reference/expression-dsl.md) destekler. |

## Örnek

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Çıktı, sunucu loglarında görünür (örn. `uvicorn` çalıştırılırken terminal çıktısı).

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Logs Sekmesi](../tabs/logs-tab.md) – Uygulama loglarını görüntüleyin
