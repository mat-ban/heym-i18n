# Redis

**Redis**-solmu suorittaa Redis-operaatioita: arvon asettaminen, hakeminen, avaimen olemassaolon tarkistaminen ja poistaminen. Sitä voidaan käyttää välimuistin hallintaan, rajoitusten asettamiseen ja avain-arvo -tallennukseen.

## Yleiskatsaus

| Ominaisuus | Arvo |
|------------|------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|---------|
| `credentialId` | UUID | Redis-tunnistetiedot kohdasta [Tunnistetiedot](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operaation tyyppi |
| `redisKey` | lauseke | Redis-avain (tukee lausekkeita) |
| `redisValue` | lauseke | Arvo asetusoperaatiota varten |
| `redisTtl` | numero | TTL sekunneissa (vain asetusoperaatiossa, valinnainen) |

## Operaatiot

| Operaatio | Pakollinen | Tuloste |
|-----------|------------|---------|
| `set` | avain, arvo | `success`, `key`, `ttl` |
| `get` | avain | `value`, `exists`, `key` |
| `hasKey` | avain | `exists`, `key` |
| `deleteKey` | avain | `deleted`, `key` |

## Esimerkki – Välimuisti

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

## Esimerkki – Haku

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

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää Redis-tunnistetiedot
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#redis) – Redis-tunnistetietojen määrittäminen
- [Tunnistetietojen jakaminen](../reference/credentials-sharing.md) – Jaa tunnistetiedot
