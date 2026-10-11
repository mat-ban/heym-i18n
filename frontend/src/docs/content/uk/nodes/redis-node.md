# Redis

**Вузол Redis** виконує операції Redis: встановлення, отримання, перевірку наявності ключа та видалення. Використовуйте його для кешування, обмеження швидкості та зберігання ключ-значення.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вивід | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані Redis з [Облікові дані](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Тип операції |
| `redisKey` | expression | Ключ Redis (підтримує вирази) |
| `redisValue` | expression | Значення для операції set |
| `redisTtl` | number | TTL у секундах (лише для set, необов'язково) |

## Операції

| Операція | Обов'язково | Вивід |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Приклад – Кешування

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

## Приклад – Отримання

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

## Пов'язане

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання облікових даних Redis
- [Сторонні інтеграції](../reference/integrations.md#redis) – Налаштування облікових даних Redis
- [Спільний доступ до облікових даних](../reference/credentials-sharing.md) – Надання спільного доступу до облікових даних
