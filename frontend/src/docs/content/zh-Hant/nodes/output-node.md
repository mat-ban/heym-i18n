# 輸出

**Output** 節點是 Workflow 的終點，負責將回應回傳給呼叫方。請一律以標籤參照前一個節點——切勿使用 `$input`。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1（選用，用於非同步後處理） |
| Output | 將 `message` 回傳給呼叫方 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `message` | expression | 輸出值。**必須**參照前一個節點：`$previousNodeLabel.field` |
| `allowDownstream` | boolean | 若為 true，output 之後的節點會在回應送出後以非同步方式執行 |

## Agent 工具用法

當 Output 節點作為畫布節點工具連接至 [Agent Node](./agent-node.md) 時，`message` 欄位可透過機器人圖示標記為 **agent-provided**。此時 Agent 會在呼叫該工具時提供 message。若 Output 節點未作為 Agent 工具連接，則會隱藏機器人圖示。

## 關鍵規則

**切勿在 output 節點中使用 `$input`。** 請一律使用前一個節點的標籤：

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"`（其中 `processData` 為前一個節點的標籤）

## 非同步後處理

當 `allowDownstream: true` 時，回應會立即回傳。連接於 output 之後的節點會在背景執行（例如 Slack 通知、記錄）。由於下游尾端可能較晚完成，下游失敗可能會在早期回應已回傳後，將記錄的執行狀態變更為 `error`；最終的歷史記錄與分析會反映該較晚的結果。

## 範例

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## 範例 – 搭配非同步

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

接著在 output 之後連接 [Telegram](./telegram-node.md)、[Slack](./slack-node.md) 或其他節點，以進行 fire-and-forget 通知。

## 相關

- [JSON output mapper](./json-output-mapper-node.md) – 作為唯一終端節點時，不需以 `result` 包裝的根 JSON body
- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Expression DSL](../reference/expression-dsl.md) – 參照節點輸出
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 可展開的編輯器，具備 message 的即時後端預覽
- [Workflow Structure](../reference/workflow-structure.md) – JSON 格式
