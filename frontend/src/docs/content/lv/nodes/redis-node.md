# Redis

**Redis** mezgls veic Redis operācijas: iestatīšanu, iegūšanu, atslēgas esamības pārbaudi un dzēšanu. Izmantojiet to kešatmiņai, pieprasījumu skaita ierobežošanai un atslēgu-vērtību glabāšanai.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | Redis akreditācijas dati no [Akreditācijas datiem](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operācijas tips |
| `redisKey` | expression | Redis atslēga (atbalsta izteiksmes) |
| `redisValue` | expression | Vērtība iestatīšanas operācijai |
| `redisTtl` | number | TTL sekundēs (tikai iestatīšanai, nav obligāts) |

## Operācijas

| Operācija | Nepieciešams | Izvade |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Piemērs – Kešatmiņa

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

## Piemērs – Iegūšana

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

## Saistītais

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienojiet Redis akreditācijas datus
- [Trešo pušu integrācijas](../reference/integrations.md#redis) – Redis akreditācijas datu iestatīšana
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md) – Koplietojiet akreditācijas datus
