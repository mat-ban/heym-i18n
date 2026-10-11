# Alerts 分頁

**Alerts** 分頁讓您定義一段時間窗口內的閾值條件，並在條件被跨越時收到通知。Heym 已經記錄了執行結果、執行時長與 LLM 花費，但它從不主動告知您任何一項。Alert 就是您要求它這麼做的方式。

每個 Alert 都會在您選擇的**時間窗口**內進行評估，絕不會只針對單一事件。一次失敗的執行只是雜訊。十分鐘內十二次失敗的執行則是一起事故。

## Alert 類型

| 類型 | 它回答的問題 | 數字從何而來 |
|---|---|---|
| **Error threshold** | 在窗口內失敗次數是否超過 N 次？ | 狀態為 error 的[執行歷史](../reference/execution-history.md)資料列 |
| **Workflow duration** | 在窗口內執行是否變得比預期更慢？ | 執行時間，以最大值、平均值或第 95 百分位數彙總 |
| **Token / USD cost** | 在窗口內花費是否超過預算？ | [LLM traces](./traces-tab.md) 加上 LLM 成本表 |
| **Execution count** | 執行次數是否遠超出應有的頻率？ | 執行歷史資料列計數 |

### Error threshold

計算窗口內的失敗執行次數，並在計數達到您的閾值時觸發。由於它是在一段窗口內計數，而非逐一掛鉤每次失敗，因此單一暫時性錯誤不會對您發出告警。

### Workflow duration

衡量窗口內的執行時長。可選擇 **max**（最慢的一次執行）、**average** 或 **p95**。p95 數值採用與 [Analytics 分頁](./analytics-tab.md)相同的百分位數計算方式，因此 Alert 與延遲圖表對同一窗口的結果永遠不會不一致。

**窗口內最少執行次數**讓這項設定保持誠實。在幾乎空白的窗口中最慢的一次執行就只是那一次執行，因此設定例如最少 3 次可避免 Alert 因雜訊而觸發。

### Token / USD cost

加總窗口內的 LLM 花費，可以是以總 token 數或美元計算。美元金額透過與 [Traces 分頁](./traces-tab.md)及 [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)相同的定價表換算，因此成本 Alert 與成本頁面永遠一致。

當範圍涵蓋您的所有 Workflow 時，這包含在 Workflow 之外進行的 LLM 呼叫，例如 [Chat 分頁](./chat-tab.md)與 [AI Assistant](../reference/ai-assistant.md)。Coding agent 的使用量（Codex、OpenCode）不包含在內。

沒有定價資料列的模型會在 Alert 的上下文中標示為未定價，而非默默計為零。

### Execution count

計算窗口內任何狀態的執行次數。這是能捕捉 Trigger 出錯的那一項：一個平常每小時執行 20 次的 Workflow 突然執行了 2,000 次。觸發記錄包含依 Trigger 來源的細分，因為那通常就是「為什麼會發生這件事」的答案。

## 範圍

Alert 監看的對象可以是**單一 Workflow**或**您的所有 Workflow**。

「您的所有 Workflow」指的是 Alert 擁有者所能存取的所有 Workflow。它刻意不代表 Heym 執行個體上的每一個 Workflow：Alert 可以被分享，而分享 Alert 不應將某人無法開啟的 Workflow 的彙總數字交到他們手上。

## 精靈

建立 Alert 會依序走過五個步驟。

1. **Type** — 從上述四種類型中選擇一種。
2. **Scope** — 單一 Workflow，或全部。
3. **Condition** — 時間窗口，以及該類型的閾值欄位。
4. **Response** — 觸發時執行什麼，以及多久持續通知您一次。
5. **Review** — 為它命名，並查看回測。

### 回測

Review 步驟會在您儲存前回答真正重要的問題：*在過去 24 小時內，這項 Alert 會觸發多少次？*

它會回報觸發次數，以及相對於您閾值所觀察到的最高值。如果它顯示該條件原本會觸發 400 次，您就能在儲存前修正閾值，而不是在被通知後才修正。您可以將回溯期間擴大至 3 天或 7 天。

## AI 草擬

第一步的最上方有一個方框，讓您用自然語言描述您的需求：

> Warn me if the invoice sync fails more than 5 times in 10 minutes

Heym 會將其轉換為 Alert 定義，填入它能填的每一個步驟，並跳轉至已標示 AI 填入欄位的位置，讓您確認而非重新輸入。完整的請求會直接帶您到 Review。

**不完整的請求仍會帶您往前推進。**假設只說了「warn me if it fails 5 times」，您會得到一個已填入次數的 error threshold Alert、其餘欄位的預設值，而精靈會開啟在第一個仍需要您的步驟：在此情況下是 Scope，因為沒有指名任何 Workflow。頂端會有一則說明指出還剩下什麼需要決定。它絕不會阻擋 Next 或 Create。

當模型指名了您無法存取的 Workflow，或回傳的條件缺少欄位時，同樣的原則也適用。合理的部分會被保留，其餘則回退為該 Alert 類型的預設值，您再從那裡調整。這裡沒有任何環節會繞過驗證：精靈本身的規則與 API 在您儲存時都會重新檢查該 Alert。

## Repeat Behaviour

一旦 alert 觸發，就會進入 triggered 狀態。接下來會發生什麼，取決於您在步驟 4 的選擇。

- **Notify once, until it recovers**（預設）—— 觸發一次後，只要條件持續成立就保持靜默。當指標回落到閾值以下時，alert 會回到 OK 狀態，並可再次觸發。Recovery 是一種狀態變化，而非事件：它不會建立 firing 記錄，也不會執行 notify workflow。
- **Keep notifying on an interval** —— 只要條件持續成立，每隔 N 分鐘再次觸發。

之所以有這個預設行為，是因為一個故障的 workflow 若每 60 秒被檢查一次，否則每小時會產生 60 次 firing，這正是 alerting 被靜音的原因。

## Running a Workflow on Fire

步驟 4 對「當此 alert 觸發時應該發生什麼」提供三種答案：

- **Create and assign a new workflow**（預設）—— 儲存 alert 時也會建立一個名為 *"&lt;alert name&gt; notification"* 的 workflow 並連結它。它會附帶一個 input 節點，其欄位正是下方的 payload，因此 `$alert.body.observed_value` 與其他欄位可立即解析，您只需接上負責傳遞訊息的節點即可。alert 卡片上的 **Go to workflow** 可開啟它。這是預設選項，因為一個觸發後毫無反應的 alert 很容易被忽略。
- **Pick an existing workflow** —— 執行您已經建立好的項目。
- **Do nothing** —— firing 仍會記錄在該分頁中，只是不會執行任何東西。

alert payload 會作為該 workflow 的 input body 傳入：

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Which workflow produced the number

`workflows` 是唯一會出現 workflow 的地方。它列出所有對該讀數有貢獻的 workflow，每個都帶有自己的 `value` —— 依 alert 類型而定，可能是該 workflow 的 error count、run count、最慢一次執行的毫秒數，或 spend。此列表依 `value` 由高到低排序，因此 `workflows[0]` 就是問題最嚴重的那一個。

它**永遠是一個陣列**：在單一 workflow scope 下只有一個元素，在「all my workflows」下有多個元素，而在無任何可歸屬對象時會是空陣列而非 null。notify workflow 可以直接迭代它，無需檢查結構。

這裡刻意沒有單一的 `workflow_id`。它描述的是 alert 的 scope 而非該指標，因此在 system scope 下會是 `null`，而這正是「哪個 workflow？」最為重要的情況。`observed_value` 仍是用來與閾值比較的彙總值；各 workflow 的 `value` 欄位則說明了它的來源。

這就是 alert 觸達 Slack、email、Telegram 或其他任何地方的方式：使用您已經擁有的 [nodes](../reference/node-types.md)，而非另一套獨立的通知系統。

alert 無法通知它所監看的 workflow。那會形成迴圈，最明顯的例子是 execution count alert，因為每次通知都會增加它所測量的計數。

Notify 執行屬於一般執行，因此會像其他任何執行一樣出現在 [execution history](../reference/execution-history.md) 中。失敗的 notify workflow 會記錄在該 firing 上，但絕不會阻止 firing 本身被記錄。

notify workflow 會以 alert 擁有者的身分執行，使用其 credentials 與 global variables，就如同他們自己執行一樣。選擇他人分享給您的 workflow 並不會借用那個人的 credentials。若擁有者失去對該 notify workflow 的存取權，firing 仍會被記錄，但 notify 執行會被略過。

## Firing History

alert 列表下方是 firing history：什麼觸發了、何時觸發、相對於閾值的觀測值、被評估的確切時間窗，以及 notify 結果。

對某次 firing 進行 acknowledging 會標記該列，並將 alert 的徽章從 **Firing** 變更為 **Acknowledged**。這是關於您的陳述，而非關於 alert：條件仍然成立，當指標回落到閾值以下時，alert 會自行回到 **OK**。

每筆記錄都會儲存觸發當下的貢獻細節：失敗的 execution ids 與錯誤訊息、各 model 的 spend，或 trigger-source 明細。這是刻意的。時間窗已經過去，事後重新計算可能會得到不同的結果。

Firing 記錄會保留 90 天。

## Asking Chat About Alerts

[Chat tab](./chat-tab.md) 可以回答關於您 alert 的問題：

- 「我有哪些 alert？」
- 「invoice workflow 上有 alert 嗎？」
- 「cost alert 為什麼觸發？」
- 「這上次是什麼時候觸發的？」

對於「為什麼觸發」這類問題，Chat 會引用 firing 記錄中實際的觀測值、閾值與時間窗，以及貢獻細節。

## Sharing

alert 可以分享給個別使用者或 [teams](./teams-tab.md)。您分享的對象可以查看該 alert 及其 firing history。只有擁有者可以編輯、暫停、刪除或再次分享它。

### 當 workflow 存取權被移除時

針對單一 workflow 的 alert 會持續讀取該 workflow 的執行指標，因此移除某人對該 workflow 的存取權，也會同時決定其 alert 的後續處置：

- **移除使用者或團隊分享**時，會詢問 workflow 擁有者是否一併停止該使用者或團隊在該 workflow 上的 alert。預設為停止。已停止的 alert 是暫停而非刪除，且每一筆都會以 `alert.disable_on_access_revoke` 記錄於[稽核日誌](../reference/audit.md)中。
- **移除團隊成員或刪除團隊**時，一律停止受影響的 alert，因為進行該變更的人不一定是 workflow 擁有者。
- 只有在 alert 擁有者已無其他通往該 workflow 的路徑（例如直接分享或另一個團隊）時，該 alert 才會被停止。
- 恢復或測試已暫停的 alert 時，會再次檢查擁有者的存取權，因此已停止的 alert 在沒有存取權的情況下無法重新開啟，也無法用來讀取該 workflow 的指標。在沒有存取權的情況下按下 **Resume** 會顯示通知，說明必須由 workflow 擁有者重新分享才行。

## 管理 Alerts

- **Pause / Resume** — 已暫停的 alert 永遠不會被評估。恢復時會立即檢查，而非等待下一個間隔。
- **Edit** — 變更會以整體方式驗證，因此部分編輯不會讓 alert 處於無效狀態。
- **Delete** — 移除該 alert 及其觸發歷史記錄。

## 另請參閱

- [Analytics Tab](./analytics-tab.md) — 這些閾值所繪製來源的圖表
- [Traces Tab](./traces-tab.md) — LLM 成本數據的來源
- [Execution History](../reference/execution-history.md) — 錯誤、持續時間與計數 alert 所測量的執行
- [Chat Tab](./chat-tab.md) — 以自然語言查詢 alerts
- [Teams](./teams-tab.md) — 與團隊分享 alerts
