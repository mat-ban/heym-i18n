# 停用節點

**停用節點**節點會永久停用 Workflow 中的另一個節點。執行時，它會將目標節點的 `active` 設為 `false` 並保存此變更。可用於一次性操作，例如在條件滿足後停止 Cron Trigger。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `targetNodeLabel` | string | 要停用的節點標籤（例如 `hourlyCheck`） |

## 使用情境

在條件滿足後停用 [Cron](./cron-node.md) Trigger，使其在未來的 Workflow 執行中不再運行。之後可使用 [啟用節點](./enable-node.md) 將其重新開啟。

## 範例

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

流程：Cron → HTTP 檢查 → 條件（狀態為完成？）→ 若為 true：停用節點（目標：cron）→ 輸出。

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型概觀
- [啟用節點](./enable-node.md) – 將已停用的節點重新開啟
- [Cron 節點](./cron-node.md) – 要停用的 Trigger
- [條件節點](./condition-node.md) – 停用前的分支
