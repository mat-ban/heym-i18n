# Google Sheets

**Google Sheets** 節點透過 OAuth2 讀取、寫入及管理 Google Sheets 試算表中的資料。使用此節點可自動化試算表 Workflow — 讀取報表、記錄結果、更新追蹤表等。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`、`$nodeLabel.updatedRange`、`$nodeLabel.sheets`、`$nodeLabel.success` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 Google Sheets 認證 |
| `gsOperation` | string | 操作：`readRange`、`appendRows`、`updateRange`、`clearRange`、`getSheetInfo` |
| `gsSpreadsheetId` | expression | 試算表 ID 或完整的 Google Sheets URL |
| `gsSheetName` | expression | 工作表分頁名稱（例如 `Sheet1`）。`getSheetInfo` 不需要此項。 |
| `gsStartRow` | expression | 用於 `readRange`：以 1 為基準的第一個資料列（搭配 `gsHasHeader` 時，第 1 列為標題列）。 |
| `gsMaxRows` | expression | 用於 `readRange`：資料列數上限（0 = 全部）。 |
| `gsHasHeader` | boolean | 用於 `readRange`：為 true 時，將第 1 列視為欄位名稱。 |
| `gsUpdateRow` | expression | 僅用於 `updateRange`：要更新的工作表列號（以 1 為基準，欄位 A–Z）；若未設定，則使用 `gsStartRow`。非 batchUpdate — 單次 values API PUT。 |
| `gsRange` | expression | A1 標記法範圍（例如 `A1:D100`）。為舊版範例；編輯器在讀取/更新時使用列欄位。 |
| `gsKeepHeader` | boolean | 僅用於 `clearRange`：為 true 時，保留第 1 列並清除其下方的資料列（欄位 A–Z）。 |
| `gsAppendPlacement` | `append` \| `prepend` | 僅用於 `appendRows`：**Bottom** 會加在最後一列有資料的列之後；**Top** 會直接在第 1 列下方插入新列（將資料向下推移）。 |
| `gsValuesInputMode` | `raw` \| `selective` | 用於 `appendRows` / `updateRange`：**Raw** = 完整 JSON 陣列；**Selective** = 單一工作表列，僅含欄位（不含 A1 標籤）。 |
| `gsValuesSelectiveCols` | string | Selective 模式：欄位數（A–Z）。 |
| `gsValues` | expression | 值的 JSON 二維陣列（例如 `[["Name","Age"],["Alice",30]]`）。`appendRows`、`updateRange` 必填。 |

## 試算表 ID

`gsSpreadsheetId` 欄位可接受**純 ID**（Google Sheets URL 中 `/d/` 與 `/edit` 之間的長英數字串）或**完整 URL** — Heym 會自動擷取 ID。

## Credential 設定

Google Sheets 採用 **OAuth2「Bring Your Own App」** 模式。您需提供自己的 Google Cloud OAuth2 認證。

**後端設定：** 將 Heym 後端的 **`FRONTEND_URL`** 設為應用程式的公開 URL（使用者在瀏覽器中輸入的位址），例如 `https://your-heym-domain`。OAuth 重新導向 URI 一律為 `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — 它僅由此設定推導，而非來自請求標頭。

1. 前往 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → 啟用 **Google Sheets API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 選擇 **Web application**。
3. 在 **Authorized redirect URIs** 下，確切加入：`{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`（例如 `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`）。
4. 複製 **Client ID** 與 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 選擇 **Google Sheets (OAuth2)**。
6. 輸入 Client ID、Client Secret 及名稱，然後點擊 **Connect**，在瀏覽器彈出視窗中完成 OAuth2 同意程序。

Token 會在背景自動更新 — 無需手動管理 Token。

## 操作

| 操作 | 必填欄位 | 說明 |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId、gsSheetName、gsStartRow、gsMaxRows、gsHasHeader | 讀取儲存格值（A–Z）；舊版流程可選用 `gsRange` |
| `appendRows` | gsSpreadsheetId、gsSheetName、gsValues | 在底部新增列（`gsAppendPlacement` 為 append）或在第 1 列下方新增（`prepend`） |
| `updateRange` | gsSpreadsheetId、gsSheetName、gsUpdateRow、gsValues | 從 `gsUpdateRow` 開始覆寫列（A–Z）；多列 JSON 會寫入連續列 |
| `clearRange` | gsSpreadsheetId、gsSheetName | 清除該分頁欄位 A–Z 中的所有值；選用的 `gsKeepHeader` 會保留第一列 |
| `getSheetInfo` | gsSpreadsheetId | 取得試算表標題及工作表分頁清單 |

## Output 參考

| 操作 | Output 欄位 | 類型 | 說明 |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | 列物件：欄位鍵（標題名稱或 A、B、……）加上 **`rowIndex`**（以 1 為基準的工作表列號） |
| `readRange` | `.total` | number | 傳回的資料列數 |
| `appendRows` | `.updatedRange` | string | 已寫入的範圍 |
| `appendRows` | `.updates` | number | 已新增的列數 |
| `updateRange` | `.updatedRange` | string | 已寫入的範圍 |
| `updateRange` | `.updatedCells` | number | 已更新的儲存格數 |
| `clearRange` | `.clearedRange` | string | 已清除的範圍 |
| `getSheetInfo` | `.title` | string | 試算表標題 |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` 物件清單 |

所有操作都會在 Output 中包含 `success: true` 與 `operation: "<name>"`。
## 範例 – 讀取範圍

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

存取輸出：`$readReport.rows[0]`（第一筆資料列物件）、`$readReport.rows[0].Name`（依表頭取得欄位）、`$readReport.rows[0].rowIndex`（以 1 為基準的工作表列號）。

## 範例 – 從輸入附加一列

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

## 相關

- [節點類型](../reference/node-types.md) – 所有節點類型總覽
- [Credentials 分頁](../tabs/credentials-tab.md) – 新增 Google Sheets OAuth2 認證
- [第三方整合](../reference/integrations.md#google-sheets-oauth2) – Google Sheets 認證設定
