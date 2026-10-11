# Redis

Der **Redis**-Knoten führt Redis-Operationen aus: set, get, Prüfen der Schlüsselexistenz und delete. Verwende ihn für Caching, Rate Limiting und Key-Value-Speicherung.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Redis-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Operationstyp |
| `redisKey` | expression | Redis-Schlüssel (unterstützt Ausdrücke) |
| `redisValue` | expression | Wert für die set-Operation |
| `redisTtl` | number | TTL in Sekunden (nur set, optional) |

## Operationen

| Operation | Erforderlich | Ausgabe |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Beispiel – Cache

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

## Beispiel – Get

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

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – Redis-Anmeldedaten hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md#redis) – Einrichtung der Redis-Anmeldedaten
- [Anmeldedaten teilen](../reference/credentials-sharing.md) – Anmeldedaten teilen
