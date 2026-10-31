# A2A

Heym 透過 Agent2Agent 協定（A2A 1.0，JSON-RPC 綁定）提供 **Heym Agent** 服務。Heym Agent 是 [Chat 標籤頁](../tabs/chat-tab.md) 背後的核心引擎；MCP 客戶端可以透過 `heym_chat` 工具存取相同的 agent（請參閱 [MCP / A2A 標籤頁](../tabs/mcp-tab.md)）。啟用 A2A 後，其他 agent 可以透過自然語言向其發送 Task 並獲取回覆，享有與 Chat 完全相同的能力。

## 啟用 A2A

1. 開啟 **MCP / A2A** 標籤頁。
2. 在預設伺服器或指定名稱的伺服器上開啟 **Heym Agent**，並為其選取憑證與模型。
3. 勾選 **啟用 A2A**。卡片將顯示 **Agent Card** 的 URL 以及 **JSON-RPC Endpoint**。

A2A 依附於 Heym Agent：關閉該 agent 也會同時關閉 A2A。

## Endpoints

| | 預設伺服器 | 指定名稱的伺服器 |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card 無需任何憑證，亦不會列出任何使用者、伺服器或 Workflow 名稱。它僅在 A2A 處於啟用狀態時存在：當至少有一位使用者為預設伺服器啟用 A2A 時網域卡片生效；當指定伺服器的 A2A 處於開啟狀態時該伺服器的卡片生效。否則，該位址將回應 404。

## 驗證

請以與 MCP 相同的形式發送憑證，且僅能在請求標頭中傳遞：

- `X-MCP-Key: <key>`：預設伺服器的金鑰或指定伺服器的金鑰
- `Authorization: Bearer <token>`：來自 Heym OAuth 伺服器的 OAuth Token

URL 中攜帶的憑證將被拒絕。Agent Card 同時宣告了這兩種配置，A2A 客戶端可以直接從卡片中讀取它們。

## 方法列表

| 方法 | 功能說明 |
|---|---|
| `SendMessage` | 啟動一個 Task，或繼續等待輸入的任務。等待回覆，除非 `configuration.returnImmediately` 為 `true`。 |
| `SendStreamingMessage` | 相同功能，以 Server-Sent Events 事件串流形式即時傳輸任務進展與最終結果。 |
| `GetTask` | 獲取 Task 的狀態、回覆和歷史記錄（`historyLength` 可限制歷史長度）。 |
| `ListTasks` | 查詢您在該伺服器上的任務列表，最新在前，支援依 `contextId` 或 `status` 篩選，配合 `pageSize` 和 `pageToken`。 |
| `CancelTask` | 停止仍在執行或處於等待中的 Task。 |
| `SubscribeToTask` | 訂閱並追蹤仍在執行中的 Task。 |
| `GetExtendedAgentCard` | 擴充卡片，包含伺服器名稱及其分配的 Workflows（作為技能展示）。 |

平台不提供推播通知：卡片聲明 `pushNotifications: false`，呼叫推播方法將回應 `PushNotificationNotSupportedError`。所有請求必須遵循 A2A 1.0；請發送請求標頭 `A2A-Version: 1.0`。A2A 0.3 版本的方法名稱（如 `message/send`）將回應 `VersionNotSupportedError`。

## Tasks 與對話

每一個 Task 都是 Chat 標籤頁中的一次對話，並以網路圖示標記。Task 的 `contextId` 對應該對話：發送帶有相同 `contextId` 且不帶 `taskId` 的新訊息即可繼續該對話。

| Agent 執行結果 | Task 狀態 |
|---|---|
| 已回覆 | `TASK_STATE_COMPLETED`，回覆為文字內容；若有儲存內容，則將 Workflows 和評測套件連結作為資料附帶 |
| 提出釐清問題 | `TASK_STATE_INPUT_REQUIRED`：使用相同的 `taskId` 回覆 |
| 需要憑證 | `TASK_STATE_AUTH_REQUIRED`：狀態訊息包含指向 Heym 憑證頁面的連結。使用者在已登入 Heym 的瀏覽器中開啟此連結並配置；憑證值絕不會流經另一個 agent。隨後在同一 Task 上發送訊息即可繼續。 |
| 失敗 | `TASK_STATE_FAILED`，附帶失敗原因 |
| 已取消 | `TASK_STATE_CANCELED` |

向已完成或仍在執行中的 Task 發送訊息將被拒絕並回應 `UnsupportedOperationError`。訊息支援 `text` 和 `data` 部分，兩者合計最多 20,000 個字元；檔案部分將被拒絕，請將檔案作為連結發送。

## 進度更新

當 Task 執行時，事件串流會為每個步驟發送狀態更新，其用字與 Chat 標籤頁中完全一致，例如 `Running workflow "Invoice Parser"` 或 `Testing the workflow · attempt 2/5`。MCP 客戶端從 `heym_chat` 獲取相同的步驟作為 `notifications/progress`。

## 範例

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## 限制與注意事項

- `CancelTask` 會立即終止正在執行該輪次的 Heym 實例上的執行，與 Chat 標籤頁中的停止按鈕行為完全一致。在其他節點上，該任務會被標記為已取消，且不再記錄晚到的輪次結果。
- 不支援推播通知，不提供 REST 或 gRPC 綁定，不支援簽署的 Agent Cards。

## 相關主題

- [MCP / A2A 標籤頁](../tabs/mcp-tab.md)：啟用 Heym Agent 和 A2A
- [Chat 標籤頁](../tabs/chat-tab.md)：agent 背後的核心引擎
- [安全性](./security.md)：金鑰的儲存與保護機制
