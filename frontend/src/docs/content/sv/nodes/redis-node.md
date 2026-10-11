# Redis

**Redis**-noden utför Redis-operationer: set, get, kontrollera om nyckel finns samt delete. Den används för cachelagring, hastighetsbegränsning och nyckel-värde-lagring.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | Redis-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operationstyp |
| `redisKey` | expression | Redis-nyckel (stöder uttryck) |
| `redisValue` | expression | Värde för set-operationen |
| `redisTtl` | number | TTL i sekunder (endast set, valfritt) |

## Operationer

| Operation | Krävs | Utdata |
|-----------|-------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Exempel – Cache

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

## Exempel – Get

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till Redis-autentiseringsuppgifter
- [Tredjepartsintegrationer](../reference/integrations.md#redis) – Konfigurering av Redis-autentiseringsuppgifter
- [Delning av autentiseringsuppgifter](../reference/credentials-sharing.md) – Dela autentiseringsuppgifter
