# Redis

El node **Redis** duu a terme operacions de Redis: establir, obtenir, comprovar l'existència d'una clau i eliminar. Utilitzeu-lo per a la memòria cau, la limitació de velocitat i l'emmagatzematge clau-valor.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Redis des de [Credencials](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tipus d'operació |
| `redisKey` | expressió | Clau de Redis (admet expressions) |
| `redisValue` | expressió | Valor per a l'operació set |
| `redisTtl` | number | TTL en segons (només set, opcional) |

## Operacions

| Operació | Obligatori | Sortida |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Exemple – Memòria cau

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

## Exemple – Obtenir

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

## Relacionat

- [Tipus de node](../reference/node-types.md) – Visió general de tots els tipus de node
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu credencials de Redis
- [Integracions de tercers](../reference/integrations.md#redis) – Configuració de credencials de Redis
- [Compartició de credencials](../reference/credentials-sharing.md) – Compartiu credencials