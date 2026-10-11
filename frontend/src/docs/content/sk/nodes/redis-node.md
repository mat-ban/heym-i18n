# Redis

Uzol **Redis** vykonáva operácie Redis: nastavenie, získanie, kontrolu existencie kľúča a vymazanie. Použite ho na cachovanie, obmedzovanie rýchlosti (rate limiting) a ukladanie kľúč–hodnota.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje Redis z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Typ operácie |
| `redisKey` | výraz | Kľúč Redis (podporuje výrazy) |
| `redisValue` | výraz | Hodnota pre operáciu set |
| `redisTtl` | číslo | TTL v sekundách (iba pre set, voliteľné) |

## Operácie

| Operácia | Povinné | Výstup |
|-----------|----------|--------|
| `set` | kľúč, hodnota | `success`, `key`, `ttl` |
| `get` | kľúč | `value`, `exists`, `key` |
| `hasKey` | kľúč | `exists`, `key` |
| `deleteKey` | kľúč | `deleted`, `key` |

## Príklad – Cache

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

## Príklad – Get

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

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov Redis
- [Integrácie tretích strán](../reference/integrations.md#redis) – Nastavenie prihlasovacích údajov Redis
- [Zdieľanie prihlasovacích údajov](../reference/credentials-sharing.md) – Zdieľanie prihlasovacích údajov
