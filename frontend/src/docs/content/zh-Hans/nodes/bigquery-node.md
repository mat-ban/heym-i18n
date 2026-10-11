# BigQuery

**BigQuery** 节点通过 BigQuery REST API v2 运行 SQL 查询并向 Google BigQuery 数据集插入行。使用它可以从工作流数据中查询大型分析数据集或将行流式写入表中。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | BigQuery (OAuth2) |
| 输出 | `$nodeLabel.rows`、`$nodeLabel.total`、`$nodeLabel.schema`、`$nodeLabel.insertedCount`、`$nodeLabel.errors` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自[凭证](../tabs/credentials-tab.md)的 BigQuery 凭证 |
| `bqOperation` | string | 操作：`query` 或 `insertRows` |
| `bqProjectId` | expression | Google Cloud 项目 ID（例如 `my-gcp-project`） |
| `bqQuery` | expression | SQL 查询字符串。`query` 操作必填。 |
| `bqMaxResults` | string | `query` 返回的最大行数（默认 `1000`）。 |
| `bqDatasetId` | expression | 数据集 ID（例如 `my_dataset`）。`insertRows` 操作必填。 |
| `bqTableId` | expression | 表 ID（例如 `my_table`）。`insertRows` 操作必填。 |
| `bqRowsInputMode` | `raw` \| `selective` | 用于 `insertRows`：**Raw** = 完整 JSON 数组；**Selective** = 单行作为键值字段对。 |
| `bqRows` | expression | raw 模式下的行对象 JSON 数组（例如 `[{"col": "$input.value"}]`）。 |
| `bqMappings` | array | selective 模式下的键值对。每个键是列名；每个值是表达式。 |

## 凭证设置

BigQuery 使用 **OAuth2 "Bring Your Own App"** 模式。您需要提供自己的 Google Cloud OAuth2 凭证。

**后端配置：** 将 Heym 后端上的 **`FRONTEND_URL`** 设置为应用的公开 URL（用户在浏览器中输入的地址），例如 `https://your-heym-domain`。OAuth 重定向 URI 始终为 `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`。

1. 前往 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → 启用 **BigQuery API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 选择 **Web application**。
3. 在 **Authorized redirect URIs** 下，准确添加：`{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`。
4. 复制 **Client ID** 和 **Client Secret**。
5. 在 Heym Dashboard 中 → **Credentials** → **New** → 选择 **BigQuery (OAuth2)**。
6. 输入 Client ID、Client Secret 和名称，然后点击 **Connect** 在浏览器弹窗中完成 OAuth2 授权。

Token 会在后台自动刷新——无需手动管理 Token。

## 操作

| 操作 | 必填字段 | 描述 |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | 运行 SQL 查询并返回行 |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows 或 bqMappings | 通过流式 insertAll API 插入一行或多行 |

## 输出参考

| 操作 | 输出字段 | 类型 | 描述 |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | 行对象数组（列名 → 值） |
| `query` | `.total` | number | 返回的行数 |
| `query` | `.schema` | array | 表 schema 字段 |
| `insertRows` | `.insertedCount` | number | 成功插入的行数 |
| `insertRows` | `.errors` | array | 每行的插入错误（完全成功时为空） |

## 示例 – 运行查询

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

访问输出：`$getUsers.rows`（行对象数组）、`$getUsers.rows[0].email`、`$getUsers.total`。

## 示例 – 插入一行

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型概述
- [凭证选项卡](../tabs/credentials-tab.md) – 添加 BigQuery OAuth2 凭证
- [Google Sheets](./google-sheets-node.md) – 用于电子表格数据的类似 OAuth2 模式
- [第三方集成](../reference/integrations.md) – 集成凭证设置
