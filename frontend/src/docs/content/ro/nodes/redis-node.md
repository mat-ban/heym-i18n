# Redis

Nodul **Redis** efectuează operațiuni Redis: set, get, verificarea existenței cheilor și ștergere. Utilizați-l pentru caching, limitarea ratei și stocarea de tip cheie-valoare.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare Redis din [Acreditări](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tipul operațiunii |
| `redisKey` | expression | Cheia Redis (acceptă expresii) |
| `redisValue` | expression | Valoarea pentru operațiunea set |
| `redisTtl` | number | TTL în secunde (doar pentru set, opțional) |

## Operațiuni

| Operațiune | Obligatoriu | Ieșire |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Exemplu – Cache

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

## Exemplu – Get

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

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați acreditări Redis
- [Integrări terțe](../reference/integrations.md#redis) – Configurarea acreditărilor Redis
- [Partajarea acreditărilor](../reference/credentials-sharing.md) – Partajați acreditările
