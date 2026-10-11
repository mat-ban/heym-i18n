# Human-in-the-Loop

Human-in-the-loop (HITL) 讓 [Agent 節點](../nodes/agent-node.md) 在特定時刻請求核准、等待人員決策，然後從相同的執行快照繼續 Workflow。

## 功能說明

- 為 Agent 加入明確的核准檢查點，無需建立獨立的核准 Workflow
- 在 `/review/{token}` 建立一次性的公開審閱 URL
- 讓審閱者可以 `Accept`、`Edit & Continue` 或 `Refuse`
- 在決策送達前，將執行標記為 `pending`
- 在核准後恢復暫停的執行，並讓 Agent 繼續運作
- 支援在同一次 Agent 執行中設置多個依序的 HITL 檢查點

## Agent 設定

在 Agent 屬性面板中啟用 HITL。

| 設定 | 說明 |
|---------|-------------|
| `hitlEnabled` | 為此 Agent 開啟人員審閱 |
| `hitlSummary` | 供 Agent 判斷何時應請求人員審閱的核准準則 |

HITL 會為 Agent 加入一個 `request_human_review` 工具。使用 system prompt 與 `hitlSummary` 準則來告訴 Agent 哪些動作需要核准。當 Agent 判斷某個檢查點需要審閱時，會向人員傳送單一 Markdown 審閱文字。面向審閱者的摘要會在執行時根據 Agent 的請求產生；若 Agent 省略該摘要，Heym 會從 Markdown 內容推導出一份。在 v1 中，HITL 僅支援文字模式的 Agent 輸出，因此無法與 `jsonOutputEnabled` 合併使用。

對於 MCP 工具，Heym 會要求模型將寫入的 HITL 指示解讀為以下三種核准範圍之一：

- `always`，對應「always」、「on each」或「for each」等詞語
- `once`，對應「once」或「only one time」等詞語
- `never`，對應「never」、「do not ask」或「already approved」等詞語

該解讀結果會控制重複的 MCP 呼叫是否會再次暫停、僅核准一次，或完全略過人員審閱。

當 HITL 啟用時，Agent 也會在畫布上顯示第二個標示為 `review` 的輸出連接點。使用該分支在主要執行等待人員回應期間，將待處理的審閱 URL 與摘要傳送至 Slack、電子郵件、日誌記錄或任何其他通知流程。

## 審閱流程

1. Agent 到達需要核准的步驟，並呼叫 `request_human_review`
2. Heym 建立公開審閱請求並回傳審閱 URL
3. 連接到 Agent `review` 連接點的任何節點會立即以待處理的 HITL payload 執行
4. Workflow 執行轉為 `pending`
5. 審閱者無需登入即可開啟 `/review/{token}`
6. 審閱者選擇以下其中一個動作：
   - `Accept` 以原始 Markdown 繼續
   - `Edit & Continue` 以編輯後的 Markdown 繼續
   - `Refuse` 以 `decision: "refused"` 繼續，並略過後續的 Agent 動作
7. Heym 從儲存的快照恢復 Workflow，並讓 Agent 以已核准的 Markdown 內容繼續運作
8. 若後續步驟也需要核准，Agent 可以再次呼叫 HITL 並建立另一個待處理的檢查點

若無人回應，審閱連結會在 168 小時後過期。

## 公開審閱頁面

公開審閱頁面會顯示：

- Workflow 名稱與 Agent 標籤
- 根據 Agent 審閱請求自動產生的審閱者摘要
- 以 Markdown 審閱文字作為主要內容並優先顯示
- 僅在審閱者點擊 `Edit` 後才會開啟的編輯方塊
- 編輯期間的即時 Markdown 預覽
- `Accept`、`Edit & Continue` 與 `Refuse` 的動作按鈕

一旦提交決策，該 token 即會鎖定且無法重複使用。

## 輸出與執行狀態

在等待審閱期間，Agent 輸出會包含待處理的 payload：

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

在審閱者回應且 Workflow 恢復後，最終 Agent 輸出會包含決策中繼資料：

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

在下游節點中使用 `$agentLabel.decision`，依據 accepted、edited 或 refused 的結果進行分支。

## 畫布審閱分支

`review` 輸出連接點僅在 Agent 啟用 `hitlEnabled` 時可用。

- 它會在人員決策送達前執行
- 它會接收待處理的 HITL payload，包括 `summary`、`draftText`、`reviewUrl`、`shareText` 與 `shareMarkdown`
- 它適用於通知或交接步驟，例如 Slack、電子郵件或稽核日誌記錄
- 每個 HITL 檢查點會執行一次
- 審閱者回應後不會再次執行；恢復時僅有正常的 Agent 輸出路徑會繼續

## 適用範圍

- [Execution History](./execution-history.md) 會立即顯示 `pending` 執行，並將審核 URL 儲存於節點結果中
- [Portal](./portal.md) 聊天回應會顯示人工審核連結，而非空白答案
- Debug 面板與歷史對話框會顯示最終 HITL 決策與已審核的文字
- 即使 Workflow 是由 Cron、cURL 或 Portal 流量所觸發，審核輸出 handle 仍可通知外部頻道
- 多個 HITL 檢查點會重複使用相同的 Execution History 項目，同時為每次暫停建立新的一次性審核連結

## 目前限制

- HITL 僅適用於 Agent 節點
- HITL 使用 Agent 的文字輸出，v1 不支援 JSON 輸出
- 暫停的執行會從已儲存的 Workflow 快照恢復，而非最新編輯的 Workflow 版本
- v1 中巢狀子 Workflow 無法進入 pending HITL 狀態；請在呼叫它們之前，先向父 Agent 請求審核

## 相關內容

- [Agent Node](../nodes/agent-node.md) - 在 Agent 上設定 HITL
- [Agent Architecture](./agent-architecture.md) - Agent、工具、子 Agent 與 HITL 如何相互搭配
- [Execution History](./execution-history.md) - 檢視 pending 與已恢復的執行
- [Board](../tabs/board-tab.md) - Board 鏈式執行會在 HITL 時將卡片暫停於 pending（琥珀色）狀態
- [Portal](./portal.md) - 公開聊天流程與 HITL 審核連結
