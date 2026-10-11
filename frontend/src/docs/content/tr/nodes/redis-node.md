# Redis

**Redis** düğümü Redis işlemlerini gerçekleştirir: set, get, anahtar varlığını kontrol etme ve silme. Önbellekleme, hız sınırlama ve anahtar-değer depolama için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden Redis kimlik bilgisi |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | İşlem türü |
| `redisKey` | expression | Redis anahtarı (ifadeleri destekler) |
| `redisValue` | expression | Set işlemi için değer |
| `redisTtl` | number | Saniye cinsinden TTL (yalnızca set, isteğe bağlı) |

## İşlemler

| İşlem | Gerekli | Çıkış |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Örnek – Önbellek

```json
{
  "type": "redis",
  "data": {
    "label": "cacheResponse",
    "credentialId": "redis-credential-uuid",
    "redisOperation": "set",
    "redisKey": "cache:$userInput.body.userId",
    "redisValue": "$apiResponse.body",
    "redisTtl": 3600
  }
}
```

## Örnek – Get

```json
{
  "type": "redis",
  "data": {
    "label": "getCache",
    "credentialId": "redis-credential-uuid",
    "redisOperation": "get",
    "redisKey": "cache:$userInput.body.userId"
  }
}
```

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Credentials Tab](../tabs/credentials-tab.md) – Redis kimlik bilgilerini ekleyin
- [Third-Party Integrations](../reference/integrations.md#redis) – Redis kimlik bilgisi kurulumu
- [Credentials Sharing](../reference/credentials-sharing.md) – Kimlik bilgilerini paylaşın
