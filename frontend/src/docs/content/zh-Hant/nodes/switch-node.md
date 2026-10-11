# Switch

**Switch** 節點會根據將值與各案例進行比對的結果，將執行流程路由至不同的路徑。支援 N 個案例外加一個預設分支。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | n（每個案例一個 + 預設） |
| 輸出 | 將輸入傳遞至符合的分支 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `expression` | expression | 要評估的值（例如 `$input.category`） |
| `cases` | string[] | 要比對的案例值（例如 `["case1", "case2", "case3"]`） |

## 邊緣連接點

- 每個案例會取得一個來源連接點（索引 0、1、2、…）
- 用於不符合值的預設連接點

## 範例

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

將邊緣的 `sourceHandle` 設為案例索引（0、1、2）或不符合值的預設連接點來連接邊緣。

## 相關

- [節點類型](../reference/node-types.md) – 所有節點類型的概觀
- [Condition 節點](./condition-node.md) – If/else 分支
- [Expression DSL](../reference/expression-dsl.md) – 表達式語法
