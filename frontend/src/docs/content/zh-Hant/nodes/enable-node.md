# 啟用節點

**啟用節點**節點會將另一個節點重新開啟。執行時，它會將目標節點的 `active` 設為 `true` 並保存此變更。它是[停用節點](./disable-node.md)的對應操作：用於重新啟用 [Cron](./cron-node.md) Trigger 或任何先前被關閉的節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.targetNode`、`$nodeLabel.enabled` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `targetNodeLabel` | string | 要啟用的節點標籤（例如 `hourlyCheck`） |

## 行為

- 目標會以啟用狀態保存，因此未來的執行與 Trigger 都會看到它。重新啟用的 Cron Trigger 會在其下一次排定時間再次觸發。
- 若目標位於啟用節點的下游且尚未執行，它也會在當前執行中一併執行。
- 啟用一個已處於啟用狀態的節點不會有任何變更；輸出仍會回報 `enabled: true`。
- 當 `targetNodeLabel` 為空或沒有節點具有該標籤時，此節點會以錯誤失敗。

## 使用案例

依需求啟動 [Cron](./cron-node.md) Trigger。將 Cron 節點以關閉狀態保存，並為 Workflow 提供第二個進入點，例如 [Input](./input-node.md) Trigger。對該進入點發出請求會執行啟用節點，接著 Cron 便開始觸發。

已關閉的 Trigger 本身永遠不會啟動執行，因此啟用節點必須位於可執行的進入點之後。

## 範例

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

流程：Input → 啟用節點（目標：cron）→ Output。Cron 節點 `hourlyCheck` 在同一 Workflow 中以停用狀態保存，並在啟用後執行其自身的 HTTP 檢查分支。

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型的概觀
- [停用節點](./disable-node.md) – 從 Workflow 內部關閉節點
- [Cron 節點](./cron-node.md) – 要啟用的 Trigger
- [條件節點](./condition-node.md) – 在啟用前進行分支
- [Canvas 功能](../reference/canvas-features.md) – 手動啟用或停用節點
