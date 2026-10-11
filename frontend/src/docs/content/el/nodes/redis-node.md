# Redis

Ο **node** Redis εκτελεί λειτουργίες Redis: set, get, έλεγχο ύπαρξης κλειδιού και διαγραφή. Χρησιμοποιήστε τον για caching, περιορισμό ρυθμού (rate limiting) και αποθήκευση key-value.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο Redis από την καρτέλα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Τύπος λειτουργίας |
| `redisKey` | expression | Κλειδί Redis (υποστηρίζει expressions) |
| `redisValue` | expression | Τιμή για τη λειτουργία set |
| `redisTtl` | number | TTL σε δευτερόλεπτα (μόνο για set, προαιρετικό) |

## Λειτουργίες

| Λειτουργία | Απαιτείται | Έξοδος |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Παράδειγμα – Cache

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

## Παράδειγμα – Get

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

## Σχετικά

- [Τύποι nodes](../reference/node-types.md) – Επισκόπηση όλων των τύπων nodes
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίων Redis
- [Ενσωματώσεις τρίτων](../reference/integrations.md#redis) – Ρύθμιση διαπιστευτηρίων Redis
- [Κοινή χρήση διαπιστευτηρίων](../reference/credentials-sharing.md) – Κοινή χρήση διαπιστευτηρίων
