# Heym Trigger

**Heym Trigger** 節點會在 Heym 本身發佈平台事件時啟動 Workflow。這是一個零輸入的 Trigger 節點，用於以 Heym 自動化 Heym：變更稽核軌跡、部署公告，以及執行個體健康摘要。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.events`、`$nodeLabel.count`、`$nodeLabel.triggered_at` |
| Credential | 不需要 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `eventNames` | 字串陣列 | 要訂閱哪些事件。留空以接收所有事件。 |

## 事件

| 事件 | 發佈時機 | 範圍 |
|-------|----------------|-------|
| `heym.started` | Heym 平台啟動時 | 執行個體範圍：每位訂閱者都會收到 |
| `workflow.created` | 建立 Workflow 時 | 僅限該 Workflow 擁有者的訂閱者 |
| `workflow.updated` | 儲存 Workflow 時 | 僅限該 Workflow 擁有者的訂閱者 |
| `workflow.deleted` | 刪除 Workflow 時 | 僅限該 Workflow 擁有者的訂閱者 |

Dashboard 小工具在內部是以 Workflow 的形式儲存，但它們永遠不會產生 `workflow.*` 事件。

## 傳遞採用批次處理

Heym 每五秒派送一次事件。**在一次派送階段中被取用的所有事件，會以陣列的形式在單一次 Workflow 執行中送達。**

- 在五秒內建立兩個 Workflow → **一次**執行，包含兩個事件。
- 建立一個 Workflow → **一次**執行，包含單一元素的陣列。

結構永遠不變，因此下游表達式永遠不需要依據送達的是一個事件還是多個事件來分支處理。當你需要對每個事件各執行一次動作時，請在 `$nodeLabel.events` 上放置一個 [Loop](./loop-node.md) 節點。

## 恰好一次傳遞

每個事件在傳遞之前，都會透過唯一的資料庫條件約束，依訂閱節點逐一取用。這在每個 uvicorn worker、每個容器，以及每台機器上都成立：在兩台伺服器上執行 Heym 不會將事件傳遞兩次。若無法記錄取用，事件就完全不會被傳遞——此設計會以失敗關閉（fail closed），而非觸發兩次。

兩個不同的 `heymTrigger` 節點訂閱同一個事件時，各自會收到一次；它們不會互相競爭。

## 派送視窗

派送器只會考慮在**過去五分鐘**內發佈的事件。較舊的事件會保留在日誌中供檢視，但永遠不會被傳遞。這限制了停機後會發生的情況：在離線一小時後重新啟動 Heym 不會重播任何內容，而不是一次觸發一小時的積壓事件。

事件會保留 **7 天**，之後便會刪除。

## 輸出欄位

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.events` | 事件物件陣列，最舊的在前。永遠是陣列。 |
| `$nodeLabel.events[0].id` | 事件 UUID |
| `$nodeLabel.events[0].name` | 事件名稱，例如 `workflow.created` |
| `$nodeLabel.events[0].payload` | 事件內容 |
| `$nodeLabel.events[0].workflow_id` | 主體 Workflow 的 id，若是 `heym.started` 則為 `null` |
| `$nodeLabel.events[0].created_at` | 事件發佈時間的 ISO 時間戳記 |
| `$nodeLabel.count` | 此批次中的事件數量 |
| `$nodeLabel.triggered_at` | Workflow 執行時間的 ISO 時間戳記 |

### Payload 結構

`workflow.created`、`workflow.updated`、`workflow.deleted`：

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`：

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` 會帶有刪除前所擷取的名稱，因為當你讀取該事件時，Workflow 資料列已經不存在了。

## 範例 Workflow

**Workflow 變更稽核軌跡**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** 標籤為 `platformEvents`，訂閱 `workflow.created`、`workflow.updated`、`workflow.deleted`
- **Heym** 節點使用 `getWorkflow`，並將 `heymWorkflowId` 設為 `$platformEvents.events[0].workflow_id`
- **Slack** 訊息：`"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## 備註

- `heym.started` 會在**每次平台啟動時觸發一次**，而非每個 worker 一次，即使 Heym 每個容器執行八個 worker 亦然。啟動時間相隔超過五分鐘的容器會各自發佈一個事件。
- 以此方式觸發的執行會出現在歷史記錄中，並帶有 `trigger_source = "heym_event"`。
- 若你想自動接收未來版本新增的事件類型，請將 **Events** 設為無，而不是列出全部四種。

## 相關

- [Heym](./heym-node.md) – 讀取 Workflow 與執行歷史記錄
- [Triggers](../reference/triggers.md) – 所有 Workflow 進入點的概觀
- [Loop](./loop-node.md) – 對批次中的每個事件各執行一次動作
