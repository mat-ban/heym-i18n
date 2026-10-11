# Redis

El nodo **Redis** realiza operaciones de Redis: set, get, verificar la existencia de claves y delete. Utilícelo para almacenamiento en caché, limitación de velocidad y almacenamiento de clave-valor.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Redis desde [Credenciales](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tipo de operación |
| `redisKey` | expression | Clave de Redis (admite expresiones) |
| `redisValue` | expression | Valor para la operación set |
| `redisTtl` | number | TTL en segundos (solo set, opcional) |

## Operaciones

| Operación | Requerido | Salida |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Ejemplo – Caché

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

## Ejemplo – Get

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

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir credenciales de Redis
- [Integraciones de terceros](../reference/integrations.md#redis) – Configuración de credenciales de Redis
- [Uso compartido de credenciales](../reference/credentials-sharing.md) – Compartir credenciales