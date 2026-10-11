# Supabase

**Supabase** 节点用于读取和修改 Supabase 项目通过 PostgREST API 暴露的表。当你希望在工作流中访问由 SQL 支持的应用程序状态，而无需手写 HTTP 请求时，可以使用该节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | Supabase |
| 输出 | `$nodeLabel.rows`、`$nodeLabel.count`、`$nodeLabel.success` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自[凭证](../tabs/credentials-tab.md)的 Supabase 凭证 |
| `supabaseOperation` | string | 操作类型：`select`、`insert`、`update`、`upsert` 或 `delete` |
| `supabaseSchema` | expression | Schema 名称。若留空，节点将使用凭证的默认 schema，然后回退到 `public`。 |
| `supabaseTable` | expression | 要查询或修改的简单表名。请将 schema 放在 `supabaseSchema` 中，而非此处。 |
| `supabaseSelectColumns` | expression | 用于 `select` 的逗号分隔 PostgREST select 列表（默认 `*`） |
| `supabaseFilter` | expression | JSON 过滤对象。支持精确匹配以及操作符对象和逻辑分组，例如 `{"id":123}`、`{"created_at":{"gte":"2026-01-01"}}` 或 `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | `select` 返回的最大行数（`0` = 通过服务端分页获取所有匹配行，负值回退为 `100`） |
| `supabaseOrderBy` | expression | 用于 `select` 的可选排序列 |
| `supabaseAscending` | boolean | 为 `true` 时升序排序，为 `false` 时降序排序 |
| `supabaseRowsInputMode` | string | 用于 `insert`/`upsert`：`raw` JSON 数组模式，或 `auto` 自动映射单个上游输入 |
| `supabaseDataInputMode` | string | 用于 `update`：`raw` JSON 对象模式，或 `auto` 自动映射单个上游输入 |
| `supabaseIgnoredInputFields` | string | 自动映射输入数据时要省略的可选逗号分隔字段名 |
| `supabaseRows` | expression | 用于 `insert` 和 `upsert` 的行对象 JSON 数组 |
| `supabaseOnConflict` | expression | 用于 `upsert` 的可选逗号分隔冲突目标列，例如 `id` 或 `tenant_id,email` |
| `supabaseData` | expression | 用于 `update` 的更新列值 JSON 对象 |

## 凭证设置

在[凭证选项卡](../tabs/credentials-tab.md)中创建 **Supabase** 凭证，包含：

1. 你的 **Project URL**，例如 `https://your-project.supabase.co`
2. 一个可访问此工作流所需表的 **API key**
3. 可选的 **默认 schema**（默认为 `public`）

该节点通过 `/rest/v1/<table>` 与 Supabase PostgREST endpoint 通信。
`supabaseTable` 仅填写表名，例如 `users` 或 `profiles`。请勿在此传入 `schema.table`、`rpc/...` 或其他 API 路径。

当选择了有效的 Supabase 凭证后，编辑器可以直接从 PostgREST OpenAPI 元数据中发现已暴露的表和表列。使用 **discovered tables** 下拉菜单选择表，并使用 **Select Columns** 下的 **column chips** 快速构建 select 列表。

## 操作

| 操作 | 必填字段 | 描述 |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | 读取行，支持可选的精确匹配过滤器、limit 和排序 |
| `insert` | `supabaseTable`、`supabaseRows` 或自动映射输入 | 插入一行或多行 |
| `update` | `supabaseTable`、`supabaseData` 或自动映射输入、`supabaseFilter` | 更新匹配过滤器的行 |
| `upsert` | `supabaseTable`、`supabaseRows` 或自动映射输入 | 使用 Supabase upsert 语义插入或合并行。需要显式冲突目标时，请使用 `supabaseOnConflict`。 |
| `delete` | `supabaseTable`、`supabaseFilter` | 删除匹配过滤器的行 |

## 过滤器语法

`supabaseFilter` 将结构化 JSON 编译为 PostgREST 查询参数。

- 精确匹配：`{"status":"active"}`
- 比较：`{"created_at":{"gte":"2026-01-01"}}`
- 成员关系：`{"status":{"in":["active","paused"]}}`
- 模式匹配：`{"email":{"ilike":"*@example.com"}}`
- 逻辑 OR：`{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- 逻辑 AND：`{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

若要对同一字段使用多个操作符，建议使用逻辑分组：

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## 分页

`select` 现在会针对 PostgREST 执行真正的服务端分页。

- `supabaseLimit: "0"` 会逐页获取所有匹配行
- 大于 1000 的 `supabaseLimit` 值会自动拆分为多个请求
- 结果会合并回一个 `.rows` 数组，`.count` 保持为匹配的总行数

读取大表时，请设置稳定的 `supabaseOrderBy`，以保持分页边界可预测。

## 自动映射输入

对于 `insert`、`upsert` 和 `update`，当单个上游节点已经输出你希望写入的数据结构时，可将节点切换为 **Auto-map input**。

- 单个对象会成为一行或一个更新 payload
- 对象数组会成为 `insert` / `upsert` 的多行
- 带有 `rows` 数组的上游对象会直接复用该数组
- `supabaseIgnoredInputFields` 允许你丢弃诸如 `id`、`created_at` 或 `success` 之类的字段
## 输出参考

| 输出字段 | 类型 | 描述 |
|-------------|------|-------------|
| `.rows` | array | 返回的行对象 |
| `.count` | number | 返回或受影响的行数 |
| `.success` | boolean | 操作是否成功 |

## 示例 – 查询活跃用户

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

访问输出：`$activeUsers.rows`、`$activeUsers.rows[0].email`、`$activeUsers.count`。

## 示例 – Upsert 一行 Profile 数据

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型概览
- [Credentials 标签页](../tabs/credentials-tab.md) – 添加 Supabase credentials
- [第三方集成](../reference/integrations.md) – 集成 credential 设置
