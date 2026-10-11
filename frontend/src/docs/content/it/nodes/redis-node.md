# Redis

Il nodo **Redis** esegue operazioni Redis: set, get, verifica dell'esistenza di una chiave ed eliminazione. Utilizzarlo per caching, rate limiting e archiviazione chiave-valore.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale Redis da [Credenziali](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tipo di operazione |
| `redisKey` | expression | Chiave Redis (supporta espressioni) |
| `redisValue` | expression | Valore per l'operazione set |
| `redisTtl` | number | TTL in secondi (solo set, opzionale) |

## Operazioni

| Operazione | Obbligatori | Output |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Esempio – Cache

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

## Esempio – Get

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

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere credenziali Redis
- [Integrazioni di terze parti](../reference/integrations.md#redis) – Configurazione delle credenziali Redis
- [Condivisione delle credenziali](../reference/credentials-sharing.md) – Condividere le credenziali