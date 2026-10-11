# Redis

**Redis** node изпълнява Redis операции: set, get, проверка за съществуване на ключ и изтриване. Използвайте го за кеширане, ограничаване на честотата и съхранение на ключ-стойност.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | Redis удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Тип операция |
| `redisKey` | expression | Redis ключ (поддържа изрази) |
| `redisValue` | expression | Стойност за операция set |
| `redisTtl` | number | TTL в секунди (само за set, незадължително) |

## Операции

| Операция | Задължителни | Изход |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Пример – Кеширане

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

## Пример – Get

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

## Свързани

- [Типове node](../reference/node-types.md) – Преглед на всички типове node
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на Redis удостоверения
- [Интеграции с трети страни](../reference/integrations.md#redis) – Настройка на Redis удостоверение
- [Споделяне на удостоверения](../reference/credentials-sharing.md) – Споделяне на удостоверения
