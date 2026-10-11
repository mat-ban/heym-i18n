# 遷移至 Heym

已經在其他工具有 Workflow 了嗎？**AI Convert** 能為您將它們轉換成 Heym Workflow。貼上來自 n8n、Flowise、Dify、Langflow、sim.ai 或 Activepieces 的 Workflow——或者直接描述您的需求——Heym 便會在即時畫布上建構出等效的 Workflow，供您下載並匯入。

請前往 **[heym.run/convert](https://heym.run/convert)** 開啟，或使用網站頁首的 **✨ AI Convert** 按鈕。

## 運作方式

1. **選擇來源工具**（選用）——n8n、Flowise、Dify、Langflow、sim.ai、Activepieces，或保持 *Auto*。
2. **提供您的 Workflow**——貼上您目前工具匯出的 JSON，或以淺白英文描述您想要的自动化流程。
3. **生成**——Heym 會將結果串流至畫布上，在產生過程中即時繪製節點與連線。
4. **下載或複製**生成的 Workflow 為 JSON。
5. **匯入 Heym**——使用 [Download & Import](../reference/download-import.md) 流程將 JSON 貼上至您的畫布，然後執行它。

轉換過程也會在畫布上加入一張小型的 *Sticky Note*，標示該 Workflow 是由 Heym 生成——您可隨時刪除它。

## 您會獲得什麼

轉換器會將來源概念對應至原生 Heym 節點——Trigger、[LLM](../nodes/llm-node.md) 步驟、[HTTP](../nodes/http-node.md) 呼叫、[Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) 動作、[Loop](../nodes/loop-node.md)、[Condition](../nodes/condition-node.md) 以及 [Output](../nodes/output-node.md)。請在畫布上檢閱結果、連接您的 [Credentials](../reference/credentials.md)，並調整來源工具表達方式不同的任何部分。

> AI Convert 是起點，而非保證 1:1 的移植。在正式環境執行生成的 Workflow 之前，請務必先行檢閱。

## 須知事項

- **AI 驅動：** 轉換由大型語言模型產生，因此每次執行的結果可能有所不同。若第一次結果不盡理想，請重新生成。
- **輸入大小：** 您貼上或輸入的內容限制約為 **25,000 tokens**。轉換前請先精簡過大的匯出檔。
- **速率限制：** 為確保所有人都能使用此工具，每位訪客的請求上限為**每分鐘 1 次、每小時 5 次、每天 10 次**。
- **安全性：** 請求會經過篩選，僅處理與建構 Workflow 相關的請求。

## 後續步驟

- 初次使用畫布？請從 [Quick Start](./quick-start.md) 開始。
- 在 [Download & Import](../reference/download-import.md) 中了解匯入的運作方式。
- 自行架設 Heym？請參閱 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) 以取得完整設定參考。
- 使用應用程式內的 [AI Assistant](../reference/ai-assistant.md) 從零開始建構。
