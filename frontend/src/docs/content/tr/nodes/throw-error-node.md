# Hata Fırlat

**Throw Error** düğümü, workflow yürütmesini anında durdurur ve özel bir HTTP durum koduyla hata yanıtı döndürür. Doğrulama hataları, yetkisiz erişim veya diğer hata durumları için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 0 |
| Çıkış | Workflow durur; çağırana hata yanıtı döndürülür |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `errorMessage` | expression | Hata mesajı (ifadeleri destekler) |
| `httpStatusCode` | number | HTTP durum kodu (örn. 400, 401, 403, 404, 429, 500) |

## Yaygın Durum Kodları

| Kod | Kullanım durumu |
|------|----------|
| 400 | Bad Request (geçersiz giriş) |
| 401 | Unauthorized (kimlik doğrulama gerekli) |
| 403 | Forbidden (erişim reddedildi) |
| 404 | Not Found (kaynak mevcut değil) |
| 422 | Unprocessable Entity (doğrulama hatası) |
| 429 | Too Many Requests (hız sınırı) |
| 500 | Internal Server Error |

## Örnek

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Girişi doğrulamak ve yalnızca geçersiz olduğunda hata fırlatmak için [Condition](./condition-node.md) ile birlikte kullanın:
- Condition true → Output'a devam et
- Condition false → Throw Error

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Condition Node](./condition-node.md) – Fırlatmadan önce doğrulama yapın
- [Error Handler](./error-handler-node.md) – Diğer düğümlerden gelen hataları yakalayın
