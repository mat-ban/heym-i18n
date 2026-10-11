# Redis

**Redis** čvor izvodi Redis operacije: postavljanje, dohvaćanje, provjeru postojanja ključa i brisanje. Koristite ga za keširanje, ograničavanje brzine i pohranu ključ-vrijednost.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | Redis vjerodajnica iz [Vjerodajnica](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tip operacije |
| `redisKey` | izraz | Redis ključ (podržava izraze) |
| `redisValue` | izraz | Vrijednost za operaciju postavljanja |
| `redisTtl` | broj | TTL u sekundama (samo za postavljanje, opcionalno) |

## Operacije

| Operacija | Obavezno | Izlaz |
|-----------|----------|-------|
| `set` | ključ, vrijednost | `success`, `key`, `ttl` |
| `get` | ključ | `value`, `exists`, `key` |
| `hasKey` | ključ | `exists`, `key` |
| `deleteKey` | ključ | `deleted`, `key` |

## Primjer – Keširanje

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

## Primjer – Dohvaćanje

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

## Povezani

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Zavičaj Vjerodajnica](../tabs/credentials-tab.md) – Dodajte Redis vjerodajnice
- [Integracije trećih strana](../reference/integrations.md#redis) – Postavljanje Redis vjerodajnica
- [Dijeljenje vjerodajnica](../reference/credentials-sharing.md) – Dijelite vjerodajnice
