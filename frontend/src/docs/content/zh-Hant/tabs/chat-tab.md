# Chat 分頁

**Chat** 分頁提供直接的 LLM 對話介面。您可以使用它來測試模型、提出問題、執行現有的 Workflow，或透過自然語言請求建立新的 Workflow。

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ 觀看 Chat 示範</a></p>

## 設定

1. 選擇一組 [credential](./credentials-tab.md)（OpenAI、Google 等的 API key）
2. 從下拉式選單中選擇模型（模型會從所選的 credential 載入）
3. 開始輸入以傳送訊息

您也可以從 [Workflows 分頁](./workflows-tab.md)的聊天方塊開始對話。它會傳送您的第一則訊息，並在此處開啟新的對話，且答案已開始串流。

## 功能

- **Global variables 情境** – 您的 [Global Variables](../reference/global-variables.md) 可供 LLM 使用，因此您可以詢問或引用已儲存的值
- **Workspace template 情境** – 您 workspace 中共享的 Workflow 與節點範本會作為情境納入，因此 Chat 可以回答關於可用範本的問題
- **長時間執行的 Agent** – 即使瀏覽器關閉，Chat 仍會在後端持續運作，因此您可以從其他裝置回來並繼續相同的對話
- **Workflow 建立** – 要求 Chat 建立或設定 Workflow，它會使用與編輯器助理相同的 Workflow AI Builder 引擎來產生並儲存 Workflow
- **Kanban 任務建立** – 以自然語言要求新增任務或建立卡片。Chat 會將其新增至所要求看板的第一個欄位；當您有多個看板且未指定名稱時，Chat 會在建立卡片前顯示看板選擇器
- **排隊的後續訊息** – 在答案串流期間傳送更多訊息。排隊的訊息會被保存，可在開始執行前編輯或刪除，並在目前回應完成後依序執行
- **Kanban boards** – Ask naturally to add, assign, move, update or comment on a task, list your overdue tasks or what waits for a review, or create and arrange boards and columns. When you have multiple boards and do not name one, Chat presents a board picker before creating a card. See [Board › From Chat and MCP](./board-tab.md#from-chat-and-mcp)
- **Send now** – Click **Send now** beside a queued message to stop the active reply and send that message immediately. The partial reply stays in the conversation, followed by your message and the new answer. The message keeps its files and chosen model; the other queued messages remain and resume in order afterward
- **Changing direction** – After **Send now**, your latest message controls the task. A cancelled question stays as context and is not another pending job. Interrupted requests appear as **cancelled** in Traces and run history, including ones stopped before the model answers
