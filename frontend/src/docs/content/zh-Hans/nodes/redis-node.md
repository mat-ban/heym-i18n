# Redis

**Redis** 节点执行 Redis 操作：set、get、检查键是否存在以及 delete。可将其用于缓存、限流和键值存储。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.value`、`$nodeLabel.success`、`$nodeLabel.exists`、`$nodeLabel.deleted` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自[凭据](../tabs/credentials-tab.md)的 Redis 凭据 |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | 操作类型 |
| `redisKey` | expression | Redis 键（支持表达式） |
| `redisValue` | expression | set 操作的值 |
| `redisTtl` | number | TTL（以秒为单位，仅 set 操作，可选） |

## 操作

| 操作 | 必填 | 输出 |
|-----------|----------|--------|
| `set` | key、value | `success`、`key`、`ttl` |
| `get` | key | `value`、`exists`、`key` |
| `hasKey` | key | `exists`、`key` |
| `deleteKey` | key | `deleted`、`key` |

## 示例 – 缓存

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

## 示例 – 获取

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

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型概述
- [凭据选项卡](../tabs/credentials-tab.md) – 添加 Redis 凭据
- [第三方集成](../reference/integrations.md#redis) – Redis 凭据设置
- [凭据共享](../reference/credentials-sharing.md) – 共享凭据
