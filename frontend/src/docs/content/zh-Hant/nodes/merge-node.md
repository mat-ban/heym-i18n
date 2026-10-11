# 合併

**Merge** 節點會等待多個平行輸入，並將它們合併為單一輸出。當您需要在繼續執行之前彙整來自平行分支的結果時，請使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | n（可設定） |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.merged` – 包含來自各分支輸入的物件 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `inputCount` | number | 要等待的輸入數量（預設值：2） |

## 使用時機

- 當您需要**合併**或**彙整**來自平行分支的結果時使用
- **請勿**用於以個別 [Output](./output-node.md) 節點作為結尾的平行 Workflow
- 每個輸入分支都會對合併後的輸出有所貢獻

## 範例

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

將多個分支連接到 merge 節點。該節點會等待所有輸入後才產生輸出。

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型的概觀
- [Parallel Execution](../reference/parallel-execution.md) – 平行分支的執行方式
- [Workflow Structure](../reference/workflow-structure.md) – 邊與控制點
