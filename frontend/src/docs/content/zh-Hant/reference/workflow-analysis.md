# Workflow 分析

**Workflow Analysis** 是一個左側面板，每個 workflow 各持有一份可共用的、可編輯的 Markdown 文件。用它來說明 workflow 的功能並記錄改善想法——並讓 AI 為你產生初稿。

該文件為共用性質：所有能存取該 workflow 的人都能閱讀與編輯。它會與 workflow 一同儲存，並在 workflow 刪除時自動刪除。

## 開啟面板

1. 在編輯器中開啟一個 workflow。
2. 點擊編輯器工具列中的 **Analyze**（Sparkles 圖示）。
3. 面板會在左側開啟。面板開啟時，節點面板（左側面板）會收合；重新開啟節點面板則會關閉分析面板。

此面板僅適用於已儲存的 workflow。若是全新且尚未儲存的 workflow，請先儲存。

## 文件

面板會顯示單一 Markdown 文件，並提供兩種檢視，可透過 **Edit**（鉛筆）與 **Preview**（眼睛）按鈕切換：

| 檢視 | 用途 |
|------|---------|
| **Edit** | 純 Markdown 編輯器（textarea）。 |
| **Preview** | 渲染後的 Markdown。 |

標頭會顯示**最後編輯者**及編輯時間。

### 儲存

點擊 **Save** 以保存你的變更。僅在有未儲存的編輯時，Save 才會啟用。

由於文件為共用性質，儲存採用樂觀並行控制（optimistic concurrency）：

- 若在你開啟面板後，其他人已儲存較新的版本，你的儲存會被拒絕，並顯示警告指出另一位編輯者。
- 接著你可以選擇 **Reload (discard mine)** 採用伺服器版本，或選擇 **Overwrite** 強制以你的版本覆蓋對方的版本。

## AI Analysis

在面板頂端選擇 LLM **Credential** 與 **Model**（模型清單會從所選 credential 載入——請參閱 [Credentials](../tabs/credentials-tab.md)）。接著執行分析：

- **Analyze my workflow** — 當文件為空時顯示。它會將 AI 產生的 Markdown 報告以未儲存草稿的形式直接串流至編輯器。檢閱並編輯後，再點擊 **Save**。
- **Reanalyze** — 當文件已有內容時顯示。它會將全新的報告串流至另一個獨立的 **preview**，不會更動你目前的文件。選擇 **Accept** 以用新的分析取代編輯器內容，或選擇 **Discard** 保留原有內容。

這兩個動作都會先**執行 workflow**（當其有效且可執行時），並將執行結果納入分析 prompt，因此報告會反映 workflow 的實際行為。若 workflow 無法執行，分析則改以其靜態結構進行。

產生的報告依序涵蓋三個區段：**Improvement areas**（具體建議，只要 workflow 涉及 credentials、使用者輸入、外部請求或資料暴露，就會包含**安全性**角度）、workflow 的 **Purpose**，以及 **What it does**（逐步走訪各節點）。

**Improvement areas** 區段一律執行四項明確檢查：

1. **Error coverage** — 若畫布上沒有 [Error Handler](../nodes/error-handler-node.md) 節點，且未設定 error workflow，報告會指出此點並建議加入錯誤處理。
2. **Time saved** — 若未設定每次執行預估節省時間，報告會建議設定一個，以便 [Analytics](../tabs/analytics-tab.md) 的 **Time Saved** 指標能夠填入資料。
3. **Network nodes** — 對於會發出網路呼叫的節點（例如 [HTTP](../nodes/http-node.md) 與整合節點），報告會建議在這些節點上設定節點專屬的錯誤處理（retry 及／或 continue-on-error）。
4. **Alerts** — 當該 workflow 未設定任何 [alerts](../tabs/alerts-tab.md) 時，報告會建議在進入正式環境前先設定 alerts。

5. **Evals**：當 Workflow 包含沒有 Agent 套件的 [Agent 節點](../nodes/agent-node.md)時，報告建議在 [Evals](../tabs/evals-tab.md#agent-suites) 中建立 **Agent Suite**（或 **Prompt Suite**）；當包含 [LLM](../nodes/llm-node.md) 節點時，建議使用 **Prompt Suite** 跨模型測試該 Prompt。

### 從 Properties 執行 Analyzer

當 workflow 在畫布上有節點但尚無分析文件時，workflow 層級的 [Properties](./canvas-features.md) 面板（未選取任何節點時顯示）會出現 **Run Analyzer** 按鈕。它會開啟此 Workflow Analysis 面板，讓你能選擇 credential 與 model 並產生報告。

每次分析執行都會記錄在 [Traces](../tabs/traces-tab.md) 中，來源為 **Workflow Analysis**。

若未設定任何 LLM credential，Analyze 按鈕會停用——請在 [Credentials Tab](../tabs/credentials-tab.md) 中新增一個。

## Related

- [AI Assistant](./ai-assistant.md) — 以自然語言產生或修改 workflow 節點。
- [Sticky Note](../nodes/sticky-note-node.md) — 用於直接釘選在畫布上的簡短筆記。
