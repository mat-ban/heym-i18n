# 迴圈

**Loop** 節點會迭代陣列，並針對每個項目執行下游節點。需要從迭代主體中的最後一個節點建立回連，才能推進迭代。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 2（default + loop 回連） |
| 輸出 | 2（loop、done） |
| 輸出 | `$nodeLabel.item`、`$nodeLabel.index`、`$nodeLabel.total`、`$nodeLabel.isFirst`、`$nodeLabel.isLast` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `arrayExpression` | expression | 解析為陣列的 Expression（例如 `$input.items`） |

## 邊緣控點

- **來源 `loop`** – 連接到處理每個項目的節點（每次迭代執行）
- **來源 `done`** – 連接到所有迭代完成後執行的節點
- **目標 default** – 接收包含該陣列的初始資料
- **目標 `loop`** – 接收來自迭代主體最後一個節點的回連

## Loop 情境（在迭代主體中）

- `$loopNode.item` – 目前項目
- `$loopNode.index` – 以 0 為基礎的索引
- `$loopNode.total` – 項目總數
- `$loopNode.isFirst` – 布林值
- `$loopNode.isLast` – 布林值

## 關鍵規則

1. **必須建立回連：** 迭代主體中的最後一個節點必須連回 loop 的 `loop` 輸入控點。
2. **迭代主體中不得有輸出：** 迭代主體內禁止使用 [Output](./output-node.md) 節點。請使用 [Set](./set-node.md) 或 [Variable](./variable-node.md) 處理中間結果。
3. **不會自動收集結果：** loop 不會收集結果。請使用 Variable 節點搭配 `$array()` 與 `.add()` 來累積。

## 範例

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

流程：loop → 處理節點 →（回到 loop）→ loop → done 分支 → 輸出。

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型的概觀
- [Variable 節點](./variable-node.md) – 在 loop 中收集項目
- [Expression DSL](../reference/expression-dsl.md) – `item`、`index`、陣列方法
