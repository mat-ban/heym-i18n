# 變數

**Variable** 節點會設定或更新可從任何節點透過 `$vars.variableName`（workflow 區域）或 `$global.variableName`（持久化）存取的變數。可用於計數器、累積清單，以及跨 workflow 的共享狀態。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.value`，或透過 `$vars.variableName` / `$global.variableName` 存取 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `variableName` | string | 變數名稱（用作 `$vars.variableName` 或 `$global.variableName`）。請避免使用[保留名稱](../reference/expression-dsl.md)。 |
| `variableValue` | expression | 要設定的值。支援表達式。 |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | 類型強制轉換（預設：auto） |
| `isGlobal` | boolean | 當為 `true` 時，儲存於 [Global Variable Store](../reference/global-variables.md)（持久化、以使用者為範圍）。當為 `false` 或省略時，為 workflow 區域（記憶體內）。 |

## 陣列變數

在使用 `.add()` 之前，請先於 Variable 節點中以 `$array()` 或 `$array("a", "b")` 初始化陣列：

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

接著新增項目（括號內不加 `$`）：

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## 關鍵規則

**切勿在方法括號內使用 `$`：**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – 會破壞表達式

## 範例 – 計數器

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## 相關

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Loop Node](./loop-node.md) – 在迴圈主體中使用 Variable 收集項目
- [Expression DSL](../reference/expression-dsl.md) – `$vars`、`$global`、保留名稱
- [Global Variables](../reference/global-variables.md) – 使用 `isGlobal` 的持久化變數
