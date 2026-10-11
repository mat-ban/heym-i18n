# 設定

**Set** 節點會轉換並映射輸入資料，以產生自訂輸出。可用於大寫轉換、子字串、串接、隨機數字，以及任何資料轉換——而非用於呼叫 Workflow（請改用 [Execute](./execute-node.md)）。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | 每個映射鍵對應的 `$nodeLabel.keyName` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `mappings` | array | 鍵值對。每項為：`{ key, value }`，其中 `value` 是一個[表達式](../reference/expression-dsl.md) |

## Agent 工具用法

當 Set 節點作為畫布節點工具連接到 [Agent Node](./agent-node.md) 時，每個映射值都可以透過機器人圖示標記為 **agent-provided**。被標記的映射值會成為工具參數，由 agent 在執行階段填入。未標記的映射則維持固定在節點配置中。

機器人圖示僅在 Set 節點連接到 agent 的 tools 控制點時才會顯示。獨立的 Set 節點不會顯示 agent-provided 控制項。

## 表達式規則

- 參照先前的節點：`$nodeName.text`、`$nodeName.body.field`
- 使用函式：`$randomInt(1, 10)`、`$range(1, 5)`、`$now.format('HH:mm')`
- `$range(a,b)` 不包含 b；當 `a > b` 時會產生錯誤。
- 表達式開頭僅能有一個 `$`——括號內絕不能有
- 依鍵存取輸出：`$setNode.randomNumber`、`$setNode.text`

## 範例

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

下游節點可透過 `$transformData.text`、`$transformData.firstChar`、`$transformData.randomNum`、`$transformData.rangeArr` 存取。

## 相關

- [JSON output mapper](./json-output-mapper-node.md) – 相同的映射；唯一的終端節點會為 webhook/run 傳回根 JSON
- [Node Types](../reference/node-types.md) – 所有節點類型的概觀
- [Execute Node](./execute-node.md) – 呼叫 Workflow（非資料轉換）
- [Expression DSL](../reference/expression-dsl.md) – 函式與語法
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 可展開的編輯器，具備即時後端預覽，以及用於映射的 Prev/Next
