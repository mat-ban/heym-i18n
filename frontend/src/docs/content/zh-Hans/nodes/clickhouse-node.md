# ClickHouse

**ClickHouse** 节点通过 HTTP 接口对外部 [ClickHouse](https://clickhouse.com/) 数据库执行 CRUD、count 和原始 SQL 操作。使用它可以从 Workflow 中将事件写入 ClickHouse 表、读取或聚合分析数据，或运行任意 SQL —— 无需手动编写 HTTP 请求。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | ClickHouse |
| 输出 | `$nodeLabel.rows`、`$nodeLabel.count`、`$nodeLabel.row`、`$nodeLabel.success` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 ClickHouse 凭证 |
| `clickhouseOperation` | string | 操作：`query`、`find`、`getAll`、`count`、`getById`、`insert`、`update`、`remove` 或 `upsert` |
| `clickhouseTable` | expression | 简单表名。除 `query` 外的所有操作均必填。 |
| `clickhouseQuery` | expression | 用于 `query` 的原始 SQL。`SELECT`/`SHOW`/`DESCRIBE` 返回行；其他语句作为命令执行。 |
| `clickhouseFilter` | expression | 等值过滤条件的 JSON 对象，例如 `{"status":"active"}`。由 `find`、`count`、`update` 和 `remove` 使用。值会被参数化。 |
| `clickhouseLimit` | string | `find` / `getAll` 的最大行数（`0` = 无限制，不带 LIMIT 子句）。默认 `100`。 |
| `clickhouseSort` | expression | 用于 `find` 的可选 `column` 或 `column ASC\|DESC` |
| `clickhouseRowId` | expression | 用于 `getById` 的、与表 `id` 列匹配的值 |
| `clickhouseInputMode` | string | 用于 `insert`/`upsert`：`raw` JSON 数组模式或 `selective` 键/值字段模式 |
| `clickhouseData` | expression | 用于 `insert`/`upsert` 的行对象 JSON 数组，或用于 `update` 的列值 JSON 对象 |
| `clickhouseMappings` | array | 当 `clickhouseInputMode` 为 `selective` 时使用的 `{key, value}` 键值对 |

## 凭证设置

在 [Credentials 标签页](../tabs/credentials-tab.md)中创建 **ClickHouse** 凭证，包含：

1. **Host** —— 不带 scheme 的 HTTP 主机，例如 `your-instance.clickhouse.cloud`
2. **Port** —— HTTP 接口端口（HTTPS 为 `8443`，HTTP 为 `8123`）
3. **Username** / **Password** —— 默认为 `default`，密码为空
4. **Database** —— 默认为 `default`
5. **Secure** —— 启用 HTTPS（ClickHouse Cloud）

该节点通过官方 `clickhouse-connect` HTTP 客户端进行连接。保存前，请在凭证对话框中使用 **Test connection** 验证可达性。

## 操作

| 操作 | 必填字段 | 描述 |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | 运行原始 SQL。`SELECT` 返回 `{rows, count}`；其他语句返回 `{result}`。 |
| `find` | `clickhouseTable` | 读取行，支持可选的等值过滤、排序和限制 |
| `getAll` | `clickhouseTable` | 在限制范围内读取行，无过滤 |
| `count` | `clickhouseTable` | 统计行数，可选过滤 |
| `getById` | `clickhouseTable`、`clickhouseRowId` | 通过 `id` 列读取单行 |
| `insert` | `clickhouseTable`、`clickhouseData` 或 mappings | 插入一行或多行 |
| `update` | `clickhouseTable`、`clickhouseData`、`clickhouseFilter` | 通过 `ALTER TABLE ... UPDATE` 更新匹配的行 |
| `remove` | `clickhouseTable`、`clickhouseFilter` | 通过 `DELETE FROM` 删除匹配的行 |
| `upsert` | `clickhouseTable`、`clickhouseData` 或 mappings | 插入行（假定表为 `ReplacingMergeTree`） |

## 过滤语法

`clickhouseFilter` 是一个扁平的 JSON 对象，用于列等值检查。值会作为绑定查询参数发送，因此可安全防范注入。

```json
{ "status": "active", "tenant_id": 42 }
```

这会编译为 `WHERE status = {…:String} AND tenant_id = {…:Int64}`。过滤构建器仅支持等值 —— 如需范围、连接或聚合，请使用带原始 SQL 的 `query` 操作。

## 输入模式（insert / upsert）

- **JSON 数组**（`raw`）：在 `clickhouseData` 中提供行对象的 JSON 数组。某行中缺失的键会以 `NULL` 插入。列集合为所有行键的并集。
- **键值**（`selective`）：选择凭证和表后，编辑器会发现表的列，并为每列创建一个值字段。每次执行插入一行；每个值支持表达式。

## 变更操作与 ClickHouse 语义

ClickHouse 是 OLAP 数据库，因此行级写入的行为与 OLTP 存储不同：

- **`update`** 发出 `ALTER TABLE … UPDATE`，**`remove`** 发出 `DELETE FROM`。两者都是**异步变更** —— 它们最终生效，且成本相对较高。优先使用批量写入，而非频繁的单行变更。
- **`upsert`** 执行 `INSERT`。要获得按键合并的行为，请将表底层引擎设为 `ReplacingMergeTree`。
- **`getById`** 假定表具有 `id` 列。
- `update` 和 `remove` 要求 `clickhouseFilter` 非空，以避免全表变更。

## 输出参考

| 输出字段 | 类型 | 描述 |
|-------------|------|-------------|
| `.rows` | array | 返回的行对象（`query` SELECT、`find`、`getAll`） |
| `.count` | number | 行数（`find`、`getAll`、`count`、`insert`/`upsert`） |
| `.row` | object | 单行或 `null`（`getById`） |
| `.result` | string | 非 SELECT `query` 的命令摘要 |
| `.success` | boolean | 操作是否成功 |
## 示例 – 插入事件

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## 示例 – 统计活跃用户数

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

访问输出：`$activeCount.count`。

## 示例 – 每日报表查询

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

访问输出：`$dailyReport.rows`、`$dailyReport.count`。

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型的概览
- [Credentials 选项卡](../tabs/credentials-tab.md) – 添加 ClickHouse 凭据
- [第三方集成](../reference/integrations.md) – 集成凭据设置
