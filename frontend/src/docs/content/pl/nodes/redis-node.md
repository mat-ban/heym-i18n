# Redis

**Węzeł Redis** wykonuje operacje Redis: ustawianie, pobieranie, sprawdzanie istnienia klucza oraz usuwanie. Znajduje zastosowanie w buforowaniu, ograniczaniu liczby żądań (rate limiting) oraz przechowywaniu danych typu klucz-wartość.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania Redis z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Typ operacji |
| `redisKey` | wyrażenie | Klucz Redis (obsługuje wyrażenia) |
| `redisValue` | wyrażenie | Wartość dla operacji set |
| `redisTtl` | liczba | TTL w sekundach (tylko dla set, opcjonalne) |

## Operacje

| Operacja | Wymagane | Wyjście |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Przykład – Buforowanie

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

## Przykład – Pobieranie

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

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania Redis
- [Integracje zewnętrzne](../reference/integrations.md#redis) – Konfiguracja danych logowania Redis
- [Udostępnianie danych logowania](../reference/credentials-sharing.md) – Udostępnianie danych logowania
