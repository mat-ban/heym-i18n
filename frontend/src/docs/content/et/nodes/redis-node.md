# Redis

**Redis** node teostab Redis-operatsioone: set, get, võtme olemasolu kontrollimine ja kustutamine. Kasutage seda vahemällu salvestamiseks, päringusageduse piiramiseks ja võtme-väärtuse salvestamiseks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | Redis'i mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operatsiooni tüüp |
| `redisKey` | avaldis | Redis'i võti (toetab avaldisi) |
| `redisValue` | avaldis | Väärtus set-operatsiooni jaoks |
| `redisTtl` | number | TTL sekundites (ainult set, valikuline) |

## Operatsioonid

| Operatsioon | Nõutud | Väljund |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Näide – Vahemälu

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

## Näide – Get

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

## Seotud

- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Redis'i mandaatide lisamine
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md#redis) – Redis'i mandaadi seadistamine
- [Mandaatide jagamine](../reference/credentials-sharing.md) – Mandaatide jagamine
