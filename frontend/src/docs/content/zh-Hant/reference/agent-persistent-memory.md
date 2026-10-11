# Agent 持久記憶體

Agent 節點可將**每個節點各自的知識圖譜**儲存於資料庫中：包含實體（附類型與屬性）以及實體之間的關係。啟用後，Heym 會在每次執行時**將該圖譜的摘要注入系統提示**（若圖譜非空）。執行成功後，**LLM 擷取任務**會在背景將對話中的新事實合併至圖譜中。

Sub-agent 與 orchestrator 預設各自使用綁定於**其自身畫布節點**的圖譜。你也可以**授予其他 agent 對此節點圖譜的讀取或讀寫權限**（包括你擁有的**其他 workflow** 中的 agent）——請參閱[與其他 agent 共享](#sharing-with-other-agents)。

## 啟用

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | 當設為 `true` 時，將此節點的圖譜載入系統提示，並為此節點的圖譜排程執行後的擷取 |
| `memoryShares` | array（選用） | 授予其他 agent 節點存取**此**節點記憶圖譜的權限；請參閱[共享](#sharing-with-other-agents) |

請在 Agent 節點屬性中開啟（**Persistent memory (graph)**）。當記憶功能啟用時（或顯示模型時），節點上會出現粉紅色的**大腦**圖示，點擊即可開啟圖譜編輯器。

## 圖譜編輯器

此對話框會以動畫化的力導向圖呈現實體——圓圈依連線數量調整大小、依實體類型分群——並提供編輯與導覽功能（符合視圖、整理版面、鍵盤快速鍵）。你可以手動**新增、編輯或刪除**節點與邊；當圖譜包含大量實體時，Source/Target 關係選擇器支援搜尋。選取節點時會顯示其連出與連入的連線，每條連線皆可點擊以跳至該節點。變更僅套用於**此** agent 的圖譜（即你開啟其大腦圖示的畫布節點所屬圖譜）。

## 與其他 agent 共享

在記憶圖譜對話框中，**Share memory with other agents** 可讓你附加可在執行階段取用此圖譜的**對等節點（peer）**：

1. 選擇一個 **workflow**（任何你能在編輯器中開啟的 workflow）。
2. 在該 workflow 中選擇一個 **agent** 節點。
3. 設定為 **Read only** 或 **Read & write**。

| 權限 | 效果 |
|------------|--------|
| Read only | 當**對等** agent 執行時，此圖譜會合併至對等節點的系統提示中（若其包含實體）。對等節點的執行不會將資料擷取至此圖譜。 |
| Read & write | 提示行為與讀取相同，且在對等節點**成功**完成後，一般的記憶擷取也可能使用對等節點執行的憑證**合併至此（擁有者）圖譜**。 |

對等節點會以 `memoryShares` 項目的形式儲存於各擁有者節點，包含 `peerWorkflowId` 與 `peerCanvasNodeId`（以及 `permission`）。較舊的 workflow 對於**同一** workflow 中的對等節點可能省略 `peerWorkflowId`；編輯器會將其視為目前的 workflow。

**跨 workflow 共享**會在執行階段透過掃描**你擁有**的 workflow 來解析。沒有已驗證使用者情境的執行，僅會解析定義於**目前** workflow JSON（同一畫布）中的共享。

## 執行階段行為

### 自身圖譜（`persistentMemoryEnabled`）

1. **在 LLM 呼叫之前** — 若圖譜包含實體，會將一個區塊附加至系統指令，說明這些是來自先前執行的事實（可能不完整；發生衝突時以目前的使用者訊息為準）。
2. **成功完成之後** — 背景任務會向模型（使用與 agent 執行相同的憑證）要求結構化 JSON（實體 + 關係）。該 payload 會合併至資料庫（部分類型會套用去重與關係清理，例如 employment 類型的邊）。

### 對等節點接收共享圖譜

當 agent 執行時，系統會尋找（盡可能在你任何 workflow 中）其 `memoryShares` 指向此次執行之 workflow 與畫布節點的**擁有者**節點。對於每個符合的項目，該擁有者的圖譜會以**共享記憶**區段附加至系統提示中。**Read & write** 對等節點在執行成功時，會額外為**擁有者** workflow/圖譜排程擷取目標。

當執行發生錯誤或結束於 HITL 待處理狀態時，擷取**不會**執行。

## Workflow JSON（`data` 欄位）

與其他設定一樣，會持久化於 agent 節點上：

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` 為 `"read"` 或 `"write"`。若無共享，請省略 `memoryShares` 或使用 `[]`。

完整的節點物件結構請參閱 [Workflow Structure](./workflow-structure.md)。

## 相關內容

- [Agent Node](../nodes/agent-node.md) — 完整的 agent 設定
- [Agent Architecture](./agent-architecture.md) — Orchestrator、sub-agent、工具
- [Workflow Structure](./workflow-structure.md) — JSON workflow 格式
- [Canvas Features](./canvas-features.md) — 大腦控制項與圖譜對話框
- [Traces tab](../tabs/traces-tab.md) — LLM 請求/回應可觀測性
