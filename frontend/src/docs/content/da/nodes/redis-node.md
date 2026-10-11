# Redis

**Redis**-noden udfører Redis-operationer: set, get, tjek nøgle-eksistens og sletning. Den kan anvendes til caching, rate limiting og key-value-lagring.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | Redis-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operationstype |
| `redisKey` | expression | Redis-nøgle (understøtter expressions) |
| `redisValue` | expression | Værdi til set-operation |
| `redisTtl` | number | TTL i sekunder (kun ved set, valgfri) |

## Operationer

| Operation | Påkrævet | Output |
|-----------|----------|--------|
| `set` | nøgle, værdi | `success`, `key`, `ttl` |
| `get` | nøgle | `value`, `exists`, `key` |
| `hasKey` | nøgle | `exists`, `key` |
| `deleteKey` | nøgle | `deleted`, `key` |

## Eksempel – Cache

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

## Eksempel – Get

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

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj Redis-legitimationsoplysninger
- [Tredjepartsintegrationer](../reference/integrations.md#redis) – Opsætning af Redis-legitimationsoplysninger
- [Deling af legitimationsoplysninger](../reference/credentials-sharing.md) – Del legitimationsoplysninger
