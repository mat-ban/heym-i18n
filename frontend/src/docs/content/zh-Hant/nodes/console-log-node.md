# 主控台記錄

**Console Log** 節點會將值記錄到後端（伺服器）主控台。請在開發期間使用它來進行除錯與檢查。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | 傳遞輸入 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `logMessage` | expression | 要記錄的值。支援[表達式](../reference/expression-dsl.md)。 |

## 範例

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

輸出會顯示於伺服器日誌中（例如執行 `uvicorn` 時的終端機輸出）。

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型的概觀
- [Logs 分頁](../tabs/logs-tab.md) – 檢視應用程式日誌
