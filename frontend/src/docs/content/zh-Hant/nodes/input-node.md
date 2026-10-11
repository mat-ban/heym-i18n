# 輸入

**Input** 節點是接收來自使用者或 API 呼叫者資料的 Workflow 進入點。它支援單一或多個輸入欄位，並暴露請求中介資料（headers、query params）。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `value` | string | 單一文字輸入的預設值（選填） |
| `inputFields` | array | 輸入欄位定義。每項為：`{ key, defaultValue? }` |

### 輸入欄位

| 欄位 | 類型 | 說明 |
|-------|------|-------------|
| `key` | string | 欄位鍵（例如 `text`、`imageUrl`、`base64`） |
| `defaultValue` | string | 未提供時的預設值（選填） |

## 存取輸入資料

**Body 欄位**（一律使用 `$nodeLabel.body.fieldKey`）：

- `$userInput.body.text` – 文字欄位
- `$userInput.body.imageUrl` – 圖片 URL
- `$userInput.body.userId` – 若已設定則帶有預設值
- `$userInput.body.event.user.id` – 來自 Generic webhook 模式的巢狀 JSON

**請求中介資料**（透過 API 執行時）：

- `$userInput.headers` – 所有 headers（鍵為小寫）
- `$userInput.headers.authorization` – 特定 header
- `$userInput.query` – query parameters
- `$userInput.query.param1` – 特定 query param

## Run Panel 檔案輸入

在編輯器的 **Run** 分頁（Defined webhook 模式）中，每個輸入欄位支援拖放以及內嵌附件控制項（位於欄位右下角）：

- **文字檔**（`.txt`、`.md`、`.json`、`.csv` 及類似格式）會以純文字讀取。
- **圖片**（JPEG、PNG、GIF、WebP）會以 `data:` URL（base64）形式儲存於欄位值中——當下游節點需要圖片資料時，請使用如 `imageUrl` 或 `base64` 等欄位鍵。
- **PDF** 檔案會轉換為擷取的文字（檔案上限 5 MB，內容上限 100k 字元）。

每個欄位僅限一個檔案。載入檔案後，你仍可編輯該 textarea。Generic webhook 模式（原始 JSON body）不會顯示各欄位的檔案控制項。

## 輸入欄位與 Generic Webhooks 的比較

`inputFields` 仍用於描述 defined 模式編輯器表單、sub-workflow 對應，以及其他由中介資料驅動的介面所需的預期輸入。

當 Workflow 使用 **Generic** webhook body 模式時，傳入的 HTTP body 不會依據 `inputFields` 重新塑形。取而代之的是，原始 JSON payload 會直接傳遞至 `$nodeLabel.body`，且 Input 節點的欄位新增/移除控制項會在節點面板中隱藏。

## 範例

**單一輸入（預設）：**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**多重輸入：**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Triggers](../reference/triggers.md) – 進入點（Input、Cron、RabbitMQ）
- [Expression DSL](../reference/expression-dsl.md) – 參照 `$nodeLabel.body`、`$nodeLabel.query`
- [Portal](../reference/portal.md) – 將 Workflow 暴露為聊天 UI
- [Webhooks](../reference/webhooks.md) – Workflow 的 HTTP trigger
