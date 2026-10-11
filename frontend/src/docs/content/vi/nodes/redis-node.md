# Redis

Node **Redis** thực hiện các thao tác Redis: set, get, kiểm tra sự tồn tại của key và delete. Sử dụng node này cho caching, rate limiting và lưu trữ key-value.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Redis credential từ [Credentials](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Loại thao tác |
| `redisKey` | expression | Redis key (hỗ trợ biểu thức) |
| `redisValue` | expression | Giá trị cho thao tác set |
| `redisTtl` | number | TTL tính bằng giây (chỉ dùng cho set, tùy chọn) |

## Các thao tác

| Thao tác | Bắt buộc | Output |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Ví dụ – Cache

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

## Ví dụ – Get

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

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm Redis credentials
- [Third-Party Integrations](../reference/integrations.md#redis) – Thiết lập Redis credential
- [Credentials Sharing](../reference/credentials-sharing.md) – Chia sẻ credentials
