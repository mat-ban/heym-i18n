# JSON 輸出對應器

**JSON 輸出映射器**節點會根據鍵/值[映射](./set-node.md)（與 [Set](./set-node.md) 相同的模型）建立 JSON 物件。當呼叫端應在回應根層級收到**純 JSON 主體**時，請使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 0（終端節點） |
| 執行階段輸出 | 由 `mappings` 建立的物件 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` 項目（與 Set 相同） |

## Agent 工具使用方式

不支援。此節點為終端節點，因此無法附加至 [Agent 節點](./agent-node.md) 的工具控制代碼。當 Agent 需要在對話過程中塑造值時，請使用 [Set](./set-node.md) 節點。

## Webhook 與執行行為

當此節點是 Workflow 的**唯一**終端輸出時，執行**輸出**即為映射後的物件本身：來自 `mappings` 的鍵會出現在 JSON 的**最上層**。與 [Output](./output-node.md) 節點不同，這裡**沒有**以節點標籤為鍵的外層包裝，也**沒有** `{ "result": ... }` 物件。

若有多個終端節點產生輸出（例如 [Output](./output-node.md) 加上 JSON 輸出映射器，或多個分支），Heym 會使用一般結構：每個終端節點以其 `label` 作為鍵。

## 迴圈限制

與 [Output](./output-node.md) 相同的規則：請勿將此節點放在迴圈迭代分支內——僅能放在迴圈的 `done` 分支之後。請參閱 [Loop](./loop-node.md)。

## 範例

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## 相關內容

- [Set](./set-node.md) – 用於中繼轉換的相同映射機制
- [Output](./output-node.md) – 以訊息或結構描述為基礎、帶有 `result` 包裝的回應
- [節點類型](../reference/node-types.md) – 所有節點類型
- [Workflow 結構](../reference/workflow-structure.md) – JSON Workflow 格式
- [Webhooks](../reference/webhooks.md) – 執行 Endpoint 與回應
