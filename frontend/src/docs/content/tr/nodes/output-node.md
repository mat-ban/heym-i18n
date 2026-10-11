# Çıkış

**Çıktı** düğümü, çağırana yanıtı döndüren iş akışı bitiş noktasıdır. Her zaman önceki düğüme label ile başvurun—asla `$input` kullanmayın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 (isteğe bağlı, asenkron son işleme için) |
| Çıktı | Çağırana `message` döndürür |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `message` | expression | Çıktı değeri. Önceki düğüme başvurmalıdır: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | True ise, çıktıdan sonraki düğümler yanıt gönderildikten sonra asenkron olarak çalışır |

## Agent aracı kullanımı

Bir Çıktı düğümü, canvas düğümü aracı olarak bir [Agent Düğümü](./agent-node.md) ile bağlandığında, `message` alanı bot simgesiyle **agent tarafından sağlanan** olarak işaretlenebilir. Agent daha sonra aracı çağırdığında mesajı sağlar. Çıktı düğümü bir agent aracı olarak bağlı değilse, bot simgesi gizlenir.

## Kritik Kural

**Çıktı düğümünde asla `$input` kullanmayın.** Her zaman önceki düğümün label'ını kullanın:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (burada `processData` önceki düğümün label'ıdır)

## Asenkron Son İşleme

`allowDownstream: true` olduğunda, yanıt hemen döndürülür. Çıktıdan sonra bağlanan düğümler arka planda çalışır (örn. Slack bildirimleri, loglama). Downstream kuyruğu daha sonra tamamlanabileceğinden, bir downstream hatası, erken yanıt zaten döndürülmüş olsa bile kaydedilen çalıştırma durumunu `error` olarak değiştirebilir; nihai geçmiş ve analitikler bu sonraki sonucu yansıtır.

## Örnek

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Örnek – Asenkron ile

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Ardından, fire-and-forget bildirimler için çıktıdan sonra bir [Telegram](./telegram-node.md), [Slack](./slack-node.md) veya başka bir düğüm bağlayın.

## İlgili

- [JSON çıktı eşleyici](./json-output-mapper-node.md) – Tek terminal olduğunda `result` sarmalaması olmadan kök JSON gövdesi
- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Expression DSL](../reference/expression-dsl.md) – Düğüm çıktısına başvurma
- [Expression Değerlendirme Diyaloğu](../reference/expression-evaluation-dialog.md) – message için canlı backend önizlemeli genişletilebilir düzenleyici
- [İş Akışı Yapısı](../reference/workflow-structure.md) – JSON formatı
