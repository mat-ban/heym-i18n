# 等待

**Wait** 節點會將 Workflow 的執行暫停指定的時間長度。可用於速率限制、延遲動作或輪詢間隔。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | 直接傳遞輸入 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `duration` | number | 延遲時間，單位為毫秒（例如 1000 = 1 秒）。編輯器接受 1 至 900000（15 分鐘） |

## 範例

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型的概觀
- [Loop Node](./loop-node.md) – 在迴圈中使用 Wait 進行速率限制
