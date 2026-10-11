# Board

**Board** 分頁是一個 agentic kanban board。工作會在各欄之間流動，而每一欄都可以執行 Heym workflows。一張卡片不只是任務——它是一個持續存在的 agentic job，承載著上下文、對話歷史、執行狀態、輸出，以及 workflow runs。

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boards 與欄

- 您可以依需求建立任意數量的 boards。新的 board 會以預設欄位 **Backlog → Planning → Development → Done** 開始。
- 每個 board 都需要一個 **Agentic Kanban Model**（一組 credential 加上一個 model）。這是強制性的——New board 對話框在沒有它的情況下不會建立 board，而沒有設定它的 board 會使其操作保持停用——因為正是這個 model 將每張卡片對應到其所執行 workflows 的輸入，並將其輸出轉換回可讀的文字。
- board 標題中的齒輪圖示會開啟 board 設定：名稱、描述（顯示於標題下方）以及 Agentic Kanban Model。
- 欄位完全可編輯：可從欄設定中新增、重新命名、變更顏色、重新排序或刪除（欄必須為空才能刪除）。
- 卡片依優先順序垂直排列——拖曳即可重新排序。
- 您也可以從 [Chat 分頁](./chat-tab.md) 以自然語言請求建立卡片。Chat 會在需要時請您選擇一個 board，並一律將卡片加入該 board 的第一欄。

## 分享 board

Board 設定也可將 board 分享給 **users**（依 email）與 **teams**，並具備 `read` 或 `write` 權限：

- **read**——board 及其卡片可被看見，但無法變更任何內容：不能新增卡片、不能移動、不能留言、不能執行。
- **write**——完整使用 board：卡片、移動、留言與執行。
- 只有 **owner** 會看到齒輪與刪除按鈕，且只有 owner 能變更 board 的設定、其 Agentic Kanban Model 或其分享設定。

共享 board 上的 chains 一律以 **owner 的** credentials 與 Agentic Kanban Model 執行，因此協作者永遠不需要自己的。

## 卡片附件

開啟一張卡片並使用 **Attach file** 為其新增檔案——將檔案拖放到方框中，或使用按鈕選取，並可從同一份清單中移除。附件會儲存於 [Drive](./drive-tab.md)。

每次執行都會**在 workflows 開始前解析附件**，依類型處理：

- **Documents**（pdf、markdown、csv、json、text）會被擷取為文字，每個檔案上限為 20,000 個字元，存放於附件的 `text` 欄位。
- **Images** 會以 `url` 形式交付，由 vision 路徑直接載入（LLM 節點的 image 輸入可直接接受它）。
- **其他任何內容**則以單純的參照形式傳遞（`name`、`url`、`mime_type`）。

Workflows 可於 `$input.card.attachments` 讀取它們（且無論 mapper 對應了什麼，一律可於 `$input.board.attachments` 讀取）。Agentic Kanban Model 也會看到擷取出的文字與 image URLs，因此它可以將附件直接對應到 workflow 所預期的欄位。

## 欄的 workflow chains

每一欄都可以設定一個**有序的 workflows 清單**（即 chain）。當卡片移入具有 chain 的欄時：

1. chain 會在背景自動開始——移動本身永遠不會等待。
2. Workflows 會**依序**執行。每個 workflow 的輸出會在下一個開始前附加到卡片上下文。
3. 若某個 workflow 失敗，chain 會停止：剩餘的環節會被略過，且卡片會轉為**紅色**。
4. 當每個環節都成功時，卡片會轉為**綠色**。當 chain 正在執行時，卡片會以**琥珀色**脈動；若某次執行因人工審核而暫停，則會顯示靜態的琥珀色狀態。

執行會以 `board` trigger source 記錄於 [Execution History](../reference/execution-history.md)，且每張卡片會保留自己的執行清單，包含各 workflow 的輸出與錯誤。在 workflow 執行期間開啟卡片，並在該次執行旁選擇 **Open live**，即可將編輯器附加到該次確切的執行。相同的 canvas 動畫、增量 Debug logs 與最終結果會隨之出現，而不會啟動第二次執行。

## Workflow 會接收什麼

鏈會傳遞一個標準 payload 作為 Workflow 的輸入。使用一般的
[表達式](../reference/expression-dsl.md)（例如 `$input.card.title`）來讀取它：

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — 卡片上的每一則留言，最舊的排在最前面。
- `history` — 完整的活動時間軸（留言、移動、輸出），上限為最近 200 筆。
- `previous_outputs` — 先前已完成執行的輸出（先前的欄位與後續回合）。
- `chain.previous_workflow_outputs` — *當前*鏈中較早環節的輸出。
- 在後續回合中，`move` 為 `null`，且 `rerun` 為 `true`。

## 規劃迴圈（後續回合）

常見的模式是將規劃 Workflow 放在**第二個欄位**（預設名稱為 Planning — 名稱不重要，位置才是關鍵）。該 Workflow 會豐富卡片內容並提出後續問題：

1. 將卡片移入第二個欄位 — 該 Workflow 會撰寫一份豐富的計畫，並將其問題作為輸出寫回卡片。
2. 在卡片的留言串中回答。該回答會釋放卡片：它會前進到下一個欄位，該欄位會在上下文中帶著該回答接手處理。第二個欄位的鏈不會再次執行。
3. 若要在原地改進計畫，請按下 **Run follow-up round**。同一條鏈會帶著所有累積的上下文再次執行，接著卡片會在該欄位中等待，直到您新增留言來釋放它。

規劃閘門是基於位置，而非名稱：最左側的欄位及其正右方的欄位永遠不會自行前進 — 它們會執行其鏈並在該處等待您（一則留言會釋放第二個欄位）。從第三個欄位起，成功的鏈會自行將卡片向右推進，一路前進到最後一個欄位。重新命名或移除預設的「Planning」標籤並不會改變哪個位置是閘門。一張卡片一次只能有一個進行中的執行。

## Human-in-the-Loop 與 Codex 問題

如果鏈中的 Workflow 暫停 — 在 [Human-in-the-Loop](../reference/human-in-the-loop.md)
節點上、在 agent 的 HITL 工具上，或因為 [Codex](../nodes/codex-node.md) 節點需要
更多資訊 — 該次執行會以待處理狀態被持久化，且卡片會顯示琥珀色的待處理狀態。每次暫停都會保留各自的回答介面：HITL 使用 HITL 審查連結，Codex 使用 Codex 後續畫面。

一旦您回答，鏈會自行恢復：暫停的 Workflow 會完成，其輸出會落到卡片上，該欄位鏈的其餘部分會執行，且卡片會照常前進。如果恢復的執行失敗，卡片會轉為紅色，且其餘環節會被略過。

## 相關內容

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
