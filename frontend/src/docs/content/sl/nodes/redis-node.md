# Redis

Vozlišče **Redis** izvaja operacije Redis: nastavitev, pridobitev, preverjanje obstoja ključa in brisanje. Uporabite ga za predpomnjenje, omejevanje hitrosti in shranjevanje ključ-vrednost.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | Poverilnica Redis iz [Poverilnic](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Vrsta operacije |
| `redisKey` | izraz | Redis ključ (podpira izraze) |
| `redisValue` | izraz | Vrednost za operacijo nastavitev |
| `redisTtl` | število | TTL v sekundah (samo za nastavitev, neobvezno) |

## Operacije

| Operacija | Obvezno | Izhod |
|-----------|---------|-------|
| `set` | ključ, vrednost | `success`, `key`, `ttl` |
| `get` | ključ | `value`, `exists`, `key` |
| `hasKey` | ključ | `exists`, `key` |
| `deleteKey` | ključ | `deleted`, `key` |

## Primer – Predpomnjenje

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

## Primer – Pridobitev

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte poverilnice Redis
- [Integracije tretjih oseb](../reference/integrations.md#redis) – Nastavitev poverilnic Redis
- [Deljenje poverilnic](../reference/credentials-sharing.md) – Delite poverilnice
