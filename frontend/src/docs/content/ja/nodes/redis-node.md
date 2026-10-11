# Redis

**Redis** ノードは、set、get、キー存在チェック、delete といった Redis 操作を実行します。キャッシュ、レート制限、キーバリューストレージなどにご利用いただけます。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力値 | `$nodeLabel.value`、`$nodeLabel.success`、`$nodeLabel.exists`、`$nodeLabel.deleted` |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) で設定した Redis 認証情報 |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | 操作タイプ |
| `redisKey` | expression | Redis キー（式をサポート） |
| `redisValue` | expression | set 操作で設定する値 |
| `redisTtl` | number | TTL（秒単位、set のみ、任意） |

## 操作

| 操作 | 必須 | 出力 |
|-----------|----------|--------|
| `set` | key、value | `success`、`key`、`ttl` |
| `get` | key | `value`、`exists`、`key` |
| `hasKey` | key | `exists`、`key` |
| `deleteKey` | key | `deleted`、`key` |

## 例 – キャッシュ

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

## 例 – 取得

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

## 関連項目

- [ノードタイプ](../reference/node-types.md) – すべてのノードタイプの概要
- [Credentials タブ](../tabs/credentials-tab.md) – Redis 認証情報の追加
- [サードパーティ統合](../reference/integrations.md#redis) – Redis 認証情報の設定
- [認証情報の共有](../reference/credentials-sharing.md) – 認証情報を共有する
