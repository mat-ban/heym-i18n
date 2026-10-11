# Redis

**Redis** mazgas atlieka Redis operacijas: nustatyti, gauti, patikrinti rakto egzistavimą ir ištrinti. Naudokite jį talpinimui, greičio ribojimui ir raktų-vertės saugojimui.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | Redis kredencialas iš [Kredencialai](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operacijos tipas |
| `redisKey` | išraiška | Redis raktas (palaiko išraiškas) |
| `redisValue` | išraiška | Vertė nustatymo operacijai |
| `redisTtl` | skaičius | TTL sekundėmis (tik nustatymui, neprivalomas) |

## Operacijos

| Operacija | Reikalinga | Išvestis |
|-----------|------------|----------|
| `set` | raktas, vertė | `success`, `key`, `ttl` |
| `get` | raktas | `value`, `exists`, `key` |
| `hasKey` | raktas | `exists`, `key` |
| `deleteKey` | raktas | `deleted`, `key` |

## Pavyzdys – Talpinimas

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

## Pavyzdys – Gauti

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

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visi mazgų tipai
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti Redis kredencialus
- [Trečiųjų šalių integracijos](../reference/integrations.md#redis) – Redis kredencialų nustatymas
- [Kredencialų dalijimasis](../reference/credentials-sharing.md) – Dalintis kredencialais
