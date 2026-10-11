# DataTable

**DataTable** 节点用于读取、写入和管理 Heym DataTable 中的数据。可使用它对第一方结构化存储执行 CRUD 操作，无需外部凭证。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.rows`、`$nodeLabel.row`、`$nodeLabel.success`、`$nodeLabel.id` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `dataTableId` | UUID | 来自 [DataTable 标签页](../tabs/datatable-tab.md) 的 DataTable |
| `dataTableOperation` | string | 操作：`find`、`getAll`、`count`、`getById`、`insert`、`update`、`remove`、`upsert` |
| `dataTableRowId` | expression | 行 UUID（用于 getById、update、remove） |
| `dataTableData` | JSON string | 列值：`{"column_name": "value"}` |
| `dataTableFilter` | JSON string | 过滤器（find/upsert/count）。`find` 和 `count` 支持运算符 `{"age": {"$gt": 18}}`；`upsert` 使用精确匹配 `{"column_name": "value"}` |
| `dataTableSort` | string | 排序列，前缀 `-` 表示降序 |
| `dataTableLimit` | number | 返回的最大行数（默认：100） |

## 操作

| 操作 | 必填字段 | 描述 |
|-----------|----------------|-------------|
| `find` | dataTableId | 查找匹配可选运算符过滤器的行，可附带排序/限制 |
| `getAll` | dataTableId | 获取所有行，可附带排序/限制 |
| `count` | dataTableId | 统计匹配可选运算符过滤器的行数（在数据库中计数；仅返回一个数字） |
| `getById` | dataTableId, dataTableRowId | 按 UUID 获取单行 |
| `insert` | dataTableId, dataTableData | 插入新行 |
| `update` | dataTableId, dataTableRowId, dataTableData | 更新行（合并数据） |
| `remove` | dataTableId, dataTableRowId | 删除行 |
| `upsert` | dataTableId, dataTableFilter, dataTableData | 若找到匹配则更新，否则插入 |

## 示例 - 查找行

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## 示例 - 插入行

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## 示例 - 统计行数

在单个节点中统计匹配条件的行数，而无需使用 `getAll` → If/Else → Map。

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

结果可通过 `$activeAdults.count` 获取。空过滤器或省略过滤器将统计所有行。

### Find 和 count 过滤器运算符

在 `find` 或 `count` 过滤器中，普通值表示等于；对象值则应用运算符：

| 运算符 | 含义 |
|----------|---------|
| `$eq`（或普通值） | 等于 |
| `$ne` | 不等于 |
| `$gt`、`$gte`、`$lt`、`$lte` | 大于/小于比较（对于类型为 `number` 的列按数值比较，否则按文本比较） |
| `$contains` | 不区分大小写的子字符串匹配 |
| `$in` | 值在给定数组中 |

组合多个运算符的示例：`{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`。未知运算符将被忽略。`upsert` 过滤器仍使用精确匹配值来查找要更新的行。

你还可以基于行元数据进行过滤——`id`、`table_id`、`created_at`、`updated_at`、`created_by`、`updated_by`——这些元数据作为真实列存储，而非存储在你的数据内部。对于日期，进行范围比较时请传入完整值（例如 `{"created_at": {"$gt": "2026-06-04"}}`），或使用 `$contains` 进行部分文本匹配（例如 `{"created_at": {"$contains": "2026-06-04"}}`）。如果你自己的某个列与元数据字段同名，则数据列优先。

## 输出访问

- `$nodeLabel.success` - 布尔成功状态
- `$nodeLabel.rows` - 行数组（find、getAll）
- `$nodeLabel.row` - 单行对象（getById、insert、update、upsert）
- `$nodeLabel.row.data.column_name` - 访问特定列值
- `$nodeLabel.count` - 行数（find/getAll 返回的行数；count 为匹配行总数）
- `$nodeLabel.id` - 行 UUID（insert、update、remove）
- `$nodeLabel.found` - 布尔值（getById）
- `$nodeLabel.operation` - 操作名称（例如 `count`；upsert 为 `insert`/`update`）

## 无需凭证

与外部集成不同，DataTable 操作的是 Heym 的内部数据库。工作流所有者的访问权限会被自动检查。

## 由 AI Assistant 构建

当 [AI Assistant](../reference/ai-assistant.md#data-tables) 或 [Chat](../tabs/chat-tab.md) 构建此节点时，它会与你一起选择或创建表，并将表的精确列名写入 `dataTableData` 和 `dataTableFilter`。

## 相关

- [DataTable 标签页](../tabs/datatable-tab.md) - 创建和管理表
- [Grist 节点](./grist-node.md) - 外部电子表格集成
- [Expression DSL](../reference/expression-dsl.md) - 动态值的表达式语法
