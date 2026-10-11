# Grist

**Grist** 节点用于读取、写入和管理 Grist 电子表格中的数据。可用于 CRUD 操作、批量更新以及电子表格自动化。

## 概览

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.records`、`$nodeLabel.record`、`$nodeLabel.success`、`$nodeLabel.id` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 Grist 凭据 |
| `gristOperation` | string | 操作：`getRecord`、`getRecords`、`createRecord`、`createRecords`、`updateRecord`、`updateRecords`、`deleteRecord`、`listTables`、`listColumns` |
| `gristDocId` | expression | 文档 ID（来自 Grist URL） |
| `gristTableId` | expression | 表 ID |
| `gristRecordId` | expression | 记录 ID（单记录操作） |
| `gristRecordData` | JSON string | 用于创建/更新的字段值。请使用 **column ID**（例如 `User_Name`），而非标签。 |
| `gristRecordsData` | JSON string | 用于批量操作的记录数组 |
| `gristFilter` | JSON string | 筛选条件：`{"Column_ID": [values]}` |
| `gristSort` | string | 排序：`Column_ID` 或 `-Column_ID`（降序） |
| `gristLimit` | number | 最大记录数（默认：100） |

## Column ID 与标签

在 `gristRecordData` 和筛选条件中，请使用 **column ID**（带下划线，例如 `User_Name`），而非显示标签。可使用 `listColumns` 来发现 column ID。

## 示例 – 获取记录

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## 示例 – 创建记录

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型的概览
- [Credentials 标签页](../tabs/credentials-tab.md) – 添加 Grist API key
- [第三方集成](../reference/integrations.md#grist) – Grist 凭据设置
