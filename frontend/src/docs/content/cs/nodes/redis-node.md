# Redis

Uzel **Redis** provádí operace s Redis: nastavení, získání, kontrolu existence klíče a smazání. Použijte jej pro cachování, omezování rychlosti (rate limiting) a ukládání klíč–hodnota.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje Redis z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Typ operace |
| `redisKey` | expression | Klíč Redis (podporuje výrazy) |
| `redisValue` | expression | Hodnota pro operaci set |
| `redisTtl` | number | TTL v sekundách (pouze pro set, volitelné) |

## Operace

| Operace | Vyžadováno | Výstup |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Příklad – Cache

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

## Příklad – Get

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

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacích údajů Redis
- [Integrace třetích stran](../reference/integrations.md#redis) – Nastavení přihlašovacích údajů Redis
- [Sdílení přihlašovacích údajů](../reference/credentials-sharing.md) – Sdílení přihlašovacích údajů
