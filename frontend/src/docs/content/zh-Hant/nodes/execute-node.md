# 執行

**Execute** 節點會呼叫另一個 Workflow（子 Workflow）並將輸入傳遞給它。請將其用於可重複使用的邏輯，而非用於資料轉換——資料轉換請使用 [Set](./set-node.md)。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.outputs.output.result`、`$nodeLabel.status`、`$nodeLabel.workflow_id` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `executeWorkflowId` | UUID | 要執行的 Workflow ID |
| `executeInput` | expression | 單一輸入（適用於僅有一個輸入欄位的 Workflow） |
| `executeInputMappings` | array | 用於多個輸入的 `{ key, value }`。`key` = 目標 Workflow 的輸入欄位名稱。 |
| `executeDoNotWait` | boolean | 當為 `true` 時，會將子 Workflow 派送至背景執行而不等待。輸出：`{ "status": "dispatched", "workflow_id": "..." }`。預設值：`false`。 |

## 回應格式

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## 不等待

當 `executeDoNotWait: true` 時，節點會將子 Workflow 派送至背景執行緒並立即返回：

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

父 Workflow 會繼續執行下一個節點而不等待。子 Workflow 的執行記錄會在其完成時以非同步方式寫入 trace。當下游不需要子 Workflow 的結果時，請使用此選項。

## 單一輸入

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## 多個輸入

當目標 Workflow 有多個輸入欄位時，請使用 `executeInputMappings`：
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key` 必須與目標 Workflow 的 [Input](./input-node.md) `inputFields` 鍵相符。

## 相關內容

- [Canvas Features](../reference/canvas-features.md) – 使用 Extract to Sub-Workflow 從選取的節點建立 Execute 節點
- [Node Types](../reference/node-types.md) – 所有節點類型的概觀
- [Input Node](./input-node.md) – 目標 Workflow 的輸入欄位
- [Set Node](./set-node.md) – 資料轉換（非 Workflow 呼叫）
