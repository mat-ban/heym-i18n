# Workflow 結構

Workflow 以 JSON 格式儲存，包含節點與邊。可用的節點類型請參閱 [Node Types](./node-types.md)，`data` 欄位中的表達式語法請參閱 [Expression DSL](./expression-dsl.md)。

## Workflow 物件

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## 節點物件

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent 節點 `data`（持久記憶）

[Agent](../nodes/agent-node.md) 節點支援每個畫布節點各自的選用知識圖譜：

| 欄位 | 類型 | 說明 |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | 當設為 `true` 時，會將已儲存的圖譜載入 system prompt，並在成功執行後合併新的事實 |
| `memoryShares` | array（選用） | 授予其他 agent 存取此節點記憶圖譜的權限（`peerWorkflowId`、`peerCanvasNodeId`、`permission`：`read` \| `write`）。請參閱 [Agent Persistent Memory](./agent-persistent-memory.md)。 |

範例：

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

API 路徑、編輯器行為與擷取語意請參閱 [Agent Persistent Memory](./agent-persistent-memory.md)。

## 邊物件

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## 節點類型

常見的 `type` 值包括：[Input](../nodes/input-node.md)（`textInput`）、[Cron](../nodes/cron-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)（`websocketTrigger`）、[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Condition](../nodes/condition-node.md)、[Switch](../nodes/switch-node.md)、[Output](../nodes/output-node.md)、[JSON output mapper](../nodes/json-output-mapper-node.md)（`jsonOutputMapper`）、[Wait](../nodes/wait-node.md)、[HTTP](../nodes/http-node.md)、[WebSocket Send](../nodes/websocket-send-node.md)（`websocketSend`）、[Merge](../nodes/merge-node.md)、[Set](../nodes/set-node.md)、[Variable](../nodes/variable-node.md)、[Loop](../nodes/loop-node.md) 等。完整清單請參閱：[Node Types](./node-types.md)。同一執行層級的節點會以[平行](./parallel-execution.md)方式執行。

## 編輯器版面配置

每個節點皆具有 `position.x` 與 `position.y`，用於桌面畫布版面配置。在低於 768px 中斷點的螢幕上，編輯器會以全螢幕、縮排的 workflow 樹狀結構取代自由形式的 Vue Flow 畫布。此樹狀結構會依循相連的執行路徑、標示平行分支，並使用與桌面編輯器相同的節點標籤、圖示及最近一次執行狀態。

點選節點即可選取。若該節點有已記錄的執行結果，其全螢幕詳細資料會開啟，並顯示 input、output 與 error 分頁。行動版底部導覽提供 **Nodes**、**Properties**、**Run** 與 **More**；頁首則保留儲存、歷史紀錄、搜尋、設定與分享等操作。桌面版則繼續使用自由形式的 Vue Flow 畫布與側邊面板。

在行動版 Nodes 分頁中使用 **Add node** 即可搜尋節點資料庫。一般節點在新增後會立即開啟連線面板：選擇一個錨點節點，並將其放置於 **After**、**Before**，或作為 **Parallel** 分支。在編輯模式下，點選既有的 一般節點會開啟相同的面板，並預先選取其目前的連線。Trigger 節點會保持獨立，因為它們不接受一般輸入。編輯控制項也會針對所選節點提供移除操作。當相鄰節點的執行結果可用時，執行詳細資料會包含上一個與下一個箭頭。AI Assistant 會以底部面板的形式在行動版樹狀結構上方開啟，且不會變更目前作用中的編輯器分頁。

## 相關內容

- [Node Types](./node-types.md) – 所有節點類型與說明
- [Canvas Features](./canvas-features.md) – 編輯器功能（資料釘選、執行日誌、啟用/停用、擷取為子 workflow）
- [Download & Import](./download-import.md) – 以 JSON 匯出與匯入 workflow
- [Agent Node](../nodes/agent-node.md) – Agent 節點的 `data` 結構
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`、`memoryShares` 與記憶圖譜 API
- [Expression DSL](./expression-dsl.md) – `userMessage`、`condition`、`$vars`、`$global` 等的語法
- [Parallel Execution](./parallel-execution.md) – 節點如何平行執行
- [Triggers](./triggers.md) – 起始節點與進入點
- [Workflows Tab](../tabs/workflows-tab.md) – 建立與管理 workflow
