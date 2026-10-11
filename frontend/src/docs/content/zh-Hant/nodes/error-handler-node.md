# 錯誤處理常式

**Error Handler** 節點會捕捉 Workflow 中任何節點所產生的錯誤。當此節點存在時，任何節點失敗都會自動觸發它。它不需要任何輸入連線——由 Workflow 引擎觸發。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0（發生錯誤時觸發） |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.error`、`$nodeLabel.errorNode`、`$nodeLabel.errorNodeType`、`$nodeLabel.timestamp` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `message` | expression | 選填。預設值：`$error.message` |

## 錯誤情境

當 Error Handler 執行時，可使用下列欄位：

| 欄位 | 說明 |
|-------|-------------|
| `$errorHandler.error` | 錯誤訊息字串 |
| `$errorHandler.errorNode` | 失敗節點的 Label |
| `$errorHandler.errorNodeType` | 失敗節點的類型 |
| `$errorHandler.timestamp` | 錯誤發生的時間 |

## 使用案例

- 在失敗時發送 [Telegram](./telegram-node.md)、[Slack](./slack-node.md) 或 [Send Email](./send-email-node.md) 通知
- 將錯誤記錄至外部系統
- 透過 [Output](./output-node.md) 回傳自訂錯誤回應

每個 Workflow 僅能有一個 Error Handler。

## 範例

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

連接至 Output 以回傳自訂錯誤回應：
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

或連接至 Slack 以發送通知：
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Telegram Node](./telegram-node.md) – 發生錯誤時通知
- [Slack Node](./slack-node.md) – 發生錯誤時通知
- [Send Email Node](./send-email-node.md) – 電子郵件警示
- [Throw Error Node](./throw-error-node.md) – 刻意拋出錯誤
