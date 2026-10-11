# 擲出錯誤

**Throw Error** 節點會立即停止 Workflow 執行，並回傳帶有自訂 HTTP 狀態碼的錯誤回應。可用於驗證失敗、未授權存取，或其他錯誤情況。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 0 |
| 輸出結果 | Workflow 停止；錯誤回應回傳給呼叫端 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `errorMessage` | expression | 錯誤訊息（支援表達式） |
| `httpStatusCode` | number | HTTP 狀態碼（例如 400、401、403、404、429、500） |

## 常見狀態碼

| 狀態碼 | 使用情境 |
|------|----------|
| 400 | Bad Request（輸入無效） |
| 401 | Unauthorized（需要驗證） |
| 403 | Forbidden（拒絕存取） |
| 404 | Not Found（資源不存在） |
| 422 | Unprocessable Entity（驗證錯誤） |
| 429 | Too Many Requests（速率限制） |
| 500 | Internal Server Error |

## 範例

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

搭配 [Condition](./condition-node.md) 驗證輸入，並僅在無效時拋出錯誤：
- Condition 為 true → 繼續前往 Output
- Condition 為 false → Throw Error

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Condition Node](./condition-node.md) – 在拋出錯誤前進行驗證
- [Error Handler](./error-handler-node.md) – 捕捉來自其他節點的錯誤
