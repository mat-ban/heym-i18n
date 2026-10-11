# Google Sheets

**Google Sheets** 节点通过 OAuth2 读取、写入和管理 Google Sheets 电子表格中的数据。使用它可以自动化电子表格工作流——读取报表、记录结果、更新跟踪表等。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 凭证 | Google Sheets (OAuth2) |
| 输出 | `$nodeLabel.values`、`$nodeLabel.updatedRange`、`$nodeLabel.sheets`、`$nodeLabel.success` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 Google Sheets 凭证 |
| `gsOperation` | string | 操作：`readRange`、`appendRows`、`updateRange`、`clearRange`、`getSheetInfo` |
| `gsSpreadsheetId` | expression | 电子表格 ID 或完整的 Google Sheets URL |
| `gsSheetName` | expression | 工作表标签名称（例如 `Sheet1`）。`getSheetInfo` 不需要此项。 |
| `gsStartRow` | expression | 用于 `readRange`：从 1 开始的第一个数据行（配合 `gsHasHeader` 时，第 1 行为表头）。 |
| `gsMaxRows` | expression | 用于 `readRange`：最大数据行数（0 = 全部）。 |
| `gsHasHeader` | boolean | 用于 `readRange`：为 true 时将第 1 行视为列名。 |
| `gsUpdateRow` | expression | 仅用于 `updateRange`：要更新的从 1 开始的工作表行号（列 A–Z）；若未设置，则使用 `gsStartRow`。不是 batchUpdate——而是单次 values API PUT。 |
| `gsRange` | expression | A1 表示法范围（例如 `A1:D100`）。旧版示例；编辑器对读取/更新使用行字段。 |
| `gsKeepHeader` | boolean | 仅用于 `clearRange`：为 true 时保留第 1 行，清除其下方的数据行（列 A–Z）。 |
| `gsAppendPlacement` | `append` \| `prepend` | 仅用于 `appendRows`：**Bottom** 在最后一个有数据的行之后添加；**Top** 在第 1 行正下方插入新行（将数据下移）。 |
| `gsValuesInputMode` | `raw` \| `selective` | 用于 `appendRows` / `updateRange`：**Raw** = 完整 JSON 数组；**Selective** = 单行工作表，仅列字段（无 A1 标签）。 |
| `gsValuesSelectiveCols` | string | Selective 模式：列数（A–Z）。 |
| `gsValues` | expression | 值的 JSON 二维数组（例如 `[["Name","Age"],["Alice",30]]`）。`appendRows`、`updateRange` 必填。 |

## 电子表格 ID

`gsSpreadsheetId` 字段接受**裸 ID**（Google Sheets URL 中 `/d/` 与 `/edit` 之间的长字母数字字符串）或**完整 URL**——Heym 会自动提取 ID。

## 凭证设置

Google Sheets 使用 **OAuth2 "Bring Your Own App"** 模式。你需要提供自己的 Google Cloud OAuth2 凭证。

**后端配置：** 将 Heym 后端的 **`FRONTEND_URL`** 设置为应用的公开 URL（用户在浏览器中输入的地址），例如 `https://your-heym-domain`。OAuth 重定向 URI 始终为 `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`——它仅由此设置派生，不来自请求头。

1. 前往 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → 启用 **Google Sheets API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 选择 **Web application**。
3. 在 **Authorized redirect URIs** 下，准确添加：`{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`（例如 `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`）。
4. 复制 **Client ID** 和 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 选择 **Google Sheets (OAuth2)**。
6. 输入 Client ID、Client Secret 和名称，然后点击 **Connect**，在浏览器弹窗中完成 OAuth2 授权。

Token 会在后台自动刷新——无需手动管理 Token。

## 操作

| 操作 | 必填字段 | 描述 |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | 读取单元格值（A–Z）；旧版流程中可选 `gsRange` |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | 在底部（`gsAppendPlacement` 为 append）或第 1 行下方（`prepend`）添加行 |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | 从 `gsUpdateRow` 开始覆盖行（A–Z）；多行 JSON 会写入连续的行 |
| `clearRange` | gsSpreadsheetId, gsSheetName | 清除该标签页中列 A–Z 的所有值；可选 `gsKeepHeader` 保留第一行 |
| `getSheetInfo` | gsSpreadsheetId | 获取电子表格标题和工作表标签列表 |

## 输出参考

| 操作 | 输出字段 | 类型 | 描述 |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | 行对象：列键（表头名称或 A、B、……）加上 **`rowIndex`**（从 1 开始的工作表行号） |
| `readRange` | `.total` | number | 返回的数据行数 |
| `appendRows` | `.updatedRange` | string | 写入的范围 |
| `appendRows` | `.updates` | number | 追加的行数 |
| `updateRange` | `.updatedRange` | string | 写入的范围 |
| `updateRange` | `.updatedCells` | number | 更新的单元格数 |
| `clearRange` | `.clearedRange` | string | 被清除的范围 |
| `getSheetInfo` | `.title` | string | 电子表格标题 |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` 对象列表 |

所有操作的输出中都包含 `success: true` 和 `operation: "<name>"`。
## 示例 – 读取一个范围

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

访问输出：`$readReport.rows[0]`（第一个数据行对象）、`$readReport.rows[0].Name`（按表头获取列）、`$readReport.rows[0].rowIndex`（基于 1 的工作表行号）。

## 示例 – 从输入追加一行

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## 相关内容

- [节点类型](../reference/node-types.md) – 所有节点类型概览
- [Credentials 选项卡](../tabs/credentials-tab.md) – 添加 Google Sheets OAuth2 凭据
- [第三方集成](../reference/integrations.md#google-sheets-oauth2) – Google Sheets 凭据设置
