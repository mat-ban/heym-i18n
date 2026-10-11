# Redis

**Redis** 節點會執行 Redis 操作：set、get、檢查鍵是否存在，以及 delete。可用於快取、速率限制和鍵值儲存。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.value`、`$nodeLabel.success`、`$nodeLabel.exists`、`$nodeLabel.deleted` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 Redis 認證 |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | 操作類型 |
| `redisKey` | expression | Redis 鍵（支援表達式） |
| `redisValue` | expression | set 操作的值 |
| `redisTtl` | number | TTL（以秒為單位，僅限 set，選填） |

## 操作

| 操作 | 必填 | 輸出 |
|-----------|----------|--------|
| `set` | key、value | `success`、`key`、`ttl` |
| `get` | key | `value`、`exists`、`key` |
| `hasKey` | key | `exists`、`key` |
| `deleteKey` | key | `deleted`、`key` |

## 範例 – 快取

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

## 範例 – 取得

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

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型概觀
- [Credentials 分頁](../tabs/credentials-tab.md) – 新增 Redis 認證
- [第三方整合](../reference/integrations.md#redis) – Redis 認證設定
- [認證共用](../reference/credentials-sharing.md) – 共用認證
