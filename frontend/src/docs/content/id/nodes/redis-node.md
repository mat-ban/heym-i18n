# Redis

Node **Redis** menjalankan operasi Redis: set, get, memeriksa keberadaan key, dan delete. Gunakan node ini untuk caching, pembatasan laju (rate limiting), dan penyimpanan key-value.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial Redis dari [Credentials](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Jenis operasi |
| `redisKey` | expression | Key Redis (mendukung expression) |
| `redisValue` | expression | Nilai untuk operasi set |
| `redisTtl` | number | TTL dalam detik (hanya untuk set, opsional) |

## Operasi

| Operasi | Wajib | Output |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Contoh – Cache

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

## Contoh – Get

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

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua jenis node
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan kredensial Redis
- [Third-Party Integrations](../reference/integrations.md#redis) – Penyiapan kredensial Redis
- [Credentials Sharing](../reference/credentials-sharing.md) – Berbagi kredensial
