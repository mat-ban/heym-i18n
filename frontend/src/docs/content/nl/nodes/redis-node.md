# Redis

De **Redis**-node voert Redis-bewerkingen uit: set, get, controleer of een sleutel bestaat, en delete. Gebruik deze voor caching, rate limiting en key-value opslag.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Redis-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Type bewerking |
| `redisKey` | expressie | Redis-sleutel (ondersteunt expressies) |
| `redisValue` | expressie | Waarde voor set-bewerking |
| `redisTtl` | getal | TTL in seconden (alleen set, optioneel) |

## Bewerkingen

| Bewerking | Vereist | Uitvoer |
|-----------|----------|--------|
| `set` | sleutel, waarde | `success`, `key`, `ttl` |
| `get` | sleutel | `value`, `exists`, `key` |
| `hasKey` | sleutel | `exists`, `key` |
| `deleteKey` | sleutel | `deleted`, `key` |

## Voorbeeld – Cache

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

## Voorbeeld – Get

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

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Tabblad Referenties](../tabs/credentials-tab.md) – Redis-referenties toevoegen
- [Integraties met derden](../reference/integrations.md#redis) – Redis-referentie instellen
- [Referenties delen](../reference/credentials-sharing.md) – Referenties delen
