# Redis

A **Redis** csomópont Redis-műveleteket hajt végre: set, get, kulcs létezésének ellenőrzése és delete. Használja gyorsítótárazáshoz, sebességkorlátozáshoz és kulcs-érték tároláshoz.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Redis hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Művelet típusa |
| `redisKey` | expression | Redis kulcs (támogatja a kifejezéseket) |
| `redisValue` | expression | Érték a set művelethez |
| `redisTtl` | number | TTL másodpercben (csak set esetén, opcionális) |

## Műveletek

| Művelet | Kötelező | Kimenet |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Példa – Gyorsítótár

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

## Példa – Get

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

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Redis hitelesítési adatok hozzáadása
- [Külső integrációk](../reference/integrations.md#redis) – Redis hitelesítési adatok beállítása
- [Hitelesítési adatok megosztása](../reference/credentials-sharing.md) – Hitelesítési adatok megosztása
