# Portal

**Portal** 將 Heym Workflow 以公開的聊天式 UI 形式對外提供。終端使用者可透過 URL 執行 Workflow，無需登入 Heym。

## 功能說明

- **公開 URL**：`/chat/{slug}`（例如 `/chat/my-workflow`）
- **聊天介面**：使用者透過聊天 UI（訊息、輸入、回應）進行互動
- **選用驗證**：若已設定 Portal 使用者，則需登入；否則 Portal 為公開狀態
- **串流**：執行期間即時顯示節點進度（啟用時）
- **停止執行中的 Execution**：使用者可從聊天頁尾停止進行中的 Portal 執行；伺服器端亦會一併取消該進行中的 Workflow Execution
- **檔案上傳**：可針對每個輸入欄位選擇性啟用檔案上傳（文字、圖片等）
- **人工審查交接**：當 Agent 暫停等待核准時，Portal 執行可顯示 [HITL 審查連結](./human-in-the-loop.md)
- **圖片顯示**：Workflow 輸出若包含圖片（例如來自 LLM 圖片生成或 Playwright 截圖），會以縮圖形式顯示於聊天中。點擊任一圖片可開啟全螢幕檢視器；按 **Esc** 或使用裝置的返回按鈕即可關閉

## Workflow 設定

| 設定 | 說明 |
|---------|-------------|
| `portal_enabled` | 為此 Workflow 啟用 Portal |
| `portal_slug` | URL slug（例如 `my-workflow` → `/chat/my-workflow`） |
| `portal_stream_enabled` | 使用串流執行 |
| `portal_file_upload_enabled` | 允許檔案上傳 |
| `portal_file_config` | 各欄位的檔案設定（類型、限制） |

於編輯器中設定：Workflow 頁首的 **Portal** 按鈕會開啟 Portal 設定對話框。

## 流程

1. **Info**：`GET /api/portal/{slug}/info` – 回傳 Workflow 中繼資料與輸入欄位（無需驗證）
2. **Login**（若需要）：`POST /api/portal/{slug}/login` – 回傳 Session Token
3. **Execute**：`POST /api/portal/{slug}/execute` – Portal 聊天 UI 會呼叫此 Endpoint（啟用時，內部會改用其串流變體）；終端使用者透過聊天介面互動，而非直接呼叫 API。
4. **Stop**：`POST /api/portal/{slug}/executions/{execution_id}/cancel` – 當使用者在 Portal 執行期間按下 **Stop** 時發出請求

## Portal 執行中的 HITL

若 Portal Workflow 執行至啟用 [Human-in-the-Loop](./human-in-the-loop.md) 的 [Agent 節點](../nodes/agent-node.md)，Portal 回應會顯示審查連結，而非呈現空白。

- Workflow Execution 狀態會變為 `pending`
- Portal 聊天會顯示審查 URL
- 任何連接至 Agent 的 `review` 輸出控制代碼的節點，可立即通知 Slack、電子郵件或其他管道
- 審查者無需登入，即可於 `/review/{token}` 完成決策
- 審查完成後，Workflow 會從儲存的快照繼續執行

這使得公開聊天流程能與私密的人工核准步驟相互結合。

## 輸入欄位

輸入欄位來自 [Input](../nodes/input-node.md) 節點。API 會擷取類型為 `textInput` 的起始節點及其 `inputFields`。執行時使用與一般執行相同的引擎；輸入會以 `body.inputs` 及 `conversation_history` 傳遞，以支援多輪流程。

## 驗證與 Session

- **WorkflowPortalUser**：每個 Workflow 的使用者名稱／密碼（啟用驗證時）
- **PortalSession**：Session Token，TTL 為 168 小時
- **速率限制**：3 次登入失敗 → 依 Workflow 與 IP 封鎖 24 小時
- 過期的 Session 會由 Cron 作業清理

## 設定 UI

**WebPortalSettingsDialog** 分頁：

1. **General**：啟用 Portal、設定 slug、複製 Portal URL
2. **Users**：新增／移除 Portal 使用者（使用者名稱／密碼）
3. **Options**：串流模式、檔案上傳、檢視輸入欄位

## 相關內容

- [Why Heym](../getting-started/why-heym.md) – 將 Portal 作為正式環境中 Agent 的聊天介面
- [Workflows Tab](../tabs/workflows-tab.md) – 建立 Workflow 並啟用 Portal
- [Human-in-the-Loop](./human-in-the-loop.md) – 針對待處理 Agent 輸出的公開審查頁面
- [Triggers](./triggers.md) – 將 Portal 作為進入點
- [Node Types](./node-types.md) – 用於 Portal 輸入的 [Input](../nodes/input-node.md)
- [Workflow Structure](./workflow-structure.md) – 節點與邊
