# 條件

**Condition** 節點會根據 if/else 表達式將 Workflow 分支。依據結果將流程導向 true 或 false 路徑。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 2（true、false） |
| 輸出 | 將輸入傳遞至所選分支 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `condition` | expression | 類 JavaScript 表達式（例如 `$input.text.length > 0`） |

## 邊緣控點

- **來源控點 `true`** – 當條件評估為 truthy 時
- **來源控點 `false`** – 當條件評估為 falsy 時

## 表達式運算子

支援：`==`、`!=`、`>`、`<`、`>=`、`<=`、`&&`、`||`、`.length`、`.contains()` 等。請參閱 [Expression DSL](../reference/expression-dsl.md)。

## 範例

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

使用 `sourceHandle: "true"` 或 `sourceHandle: "false"` 連接邊緣，以導向不同的分支。

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Switch Node](./switch-node.md) – 依值進行多向路由
- [Expression DSL](../reference/expression-dsl.md) – 條件語法
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 可展開的編輯器，具備條件的即時後端預覽
