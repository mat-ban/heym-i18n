# Hata İşleyici

**Error Handler** düğümü, workflow içindeki herhangi bir düğümden gelen hataları yakalar. Mevcut olduğunda, herhangi bir düğüm başarısız olduğunda otomatik olarak çalışır. Gelen bağlantıya gerek yoktur—workflow motoru tarafından tetiklenir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 (hata durumunda tetiklenir) |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `message` | expression | İsteğe bağlı. Varsayılan: `$error.message` |

## Hata Bağlamı

Error handler çalıştığında, aşağıdaki alanlar kullanılabilir:

| Alan | Açıklama |
|-------|-------------|
| `$errorHandler.error` | Hata mesajı dizesi |
| `$errorHandler.errorNode` | Başarısız olan düğümün etiketi |
| `$errorHandler.errorNodeType` | Başarısız düğümün türü |
| `$errorHandler.timestamp` | Hatanın oluştuğu zaman |

## Kullanım Senaryoları

- Başarısızlık durumunda [Telegram](./telegram-node.md), [Slack](./slack-node.md) veya [Send Email](./send-email-node.md) bildirimleri gönderin
- Hataları harici sistemlere kaydedin
- [Output](./output-node.md) aracılığıyla özel bir hata yanıtı döndürün

Workflow başına yalnızca bir Error Handler bulunabilir.

## Örnek

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Özel hata yanıtı için Output'a bağlayın:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Veya bildirimler için Slack'e bağlayın:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Telegram Node](./telegram-node.md) – Hata durumunda bildirim
- [Slack Node](./slack-node.md) – Hata durumunda bildirim
- [Send Email Node](./send-email-node.md) – E-posta uyarıları
- [Throw Error Node](./throw-error-node.md) – Kasıtlı hatalar
