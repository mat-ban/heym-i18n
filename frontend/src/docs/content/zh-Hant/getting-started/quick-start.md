# 快速開始

在幾分鐘內讓您的第一個 Heym workflow 開始運行。

還沒開始運行 Heym 嗎？請參閱[運行與部署](./running-and-deployment.md)，或觀看影片教學：[在 2 分鐘內於本機設定 Heym](https://www.youtube.com/watch?v=P6YvlupUboU)。

## 1. 建立 Workflow

1. 前往 [Workflows](../tabs/workflows-tab.md) 分頁
2. 點擊 **New Workflow**
3. 為您的 workflow 命名（例如「Hello World」）

## 2. 新增節點

1. 開啟左側的 **Nodes** 面板
2. 將 [Input](../nodes/input-node.md) 節點拖曳至畫布上
3. 將 [LLM](../nodes/llm-node.md) 節點拖曳至畫布，並將其連接至 Input
4. 將 [Output](../nodes/output-node.md) 節點拖曳至畫布，並將其連接至 LLM

```
[Input] --> [LLM] --> [Output]
```

請參閱[節點類型](../reference/node-types.md)以了解所有可用的節點。

## 3. 設定

- **Input**：設定預設值，或留空以供使用者輸入（請參閱 [Input 節點](../nodes/input-node.md)）
- **LLM**：選擇 [credential](../tabs/credentials-tab.md) 與模型，新增系統指令，並將 `userMessage` 設為 `$input.text`（請參閱 [LLM 節點](../nodes/llm-node.md)）
- **Output**：將 `message` 設為 `$llm.text`，以傳遞 LLM 的回應（請參閱 [Output 節點](../nodes/output-node.md)）

使用 [Expression DSL](../reference/expression-dsl.md) 語法來撰寫 `$input.text` 與 `$llm.text`。點擊表達式欄位上的展開按鈕，即可開啟[表達式評估對話框](../reference/expression-evaluation-dialog.md)，其中提供即時的後端預覽。

## 4. 執行

點擊 **Run**、按下 `Ctrl + Enter`，或使用除錯面板來執行。Workflow 會從 Input 節點開始，經過相連的節點，一路執行至 Output。請參閱 [Triggers](../reference/triggers.md) 以了解其他執行 workflow 的方式（[webhook](../reference/webhooks.md)、portal、cron 等）。

在 **History**（工具列）中查看過去的執行紀錄，並使用 **Bring to Canvas** 以相同的輸入重新執行。

在 Docs、Evals 及其他非畫布內部頁面上，您也可以使用 [Quick Drawer](../reference/quick-drawer.md) 挑選已釘選的 workflow 並執行，無需返回編輯器。

如果您在閱讀文件時希望在開始建置前獲得釐清，請從 Docs 頁首開啟 [Chat with Heym](../reference/chat-with-heym.md)，以針對當前頁面提出問題。

或者，您也可以從 Debug 面板使用 [AI Assistant](../reference/ai-assistant.md)，以自然語言建立 workflow——描述您的需求，AI 便會產生節點與連接線。

已經在其他工具中建置自動化了嗎？[遷移至 Heym](./migrate-to-heym.md) 可將 n8n、Flowise、Dify、Langflow、sim.ai 或 Activepieces 的 workflow 轉換為可匯入的 Heym workflow。

## 相關內容

- [核心概念](./core-concepts.md) – Workflows、節點與執行流程
- [遷移至 Heym](./migrate-to-heym.md) – 透過 AI 將 n8n、Flowise、Dify、Langflow、sim.ai 或 Activepieces 的 workflow 轉換為 Heym
- [運行與部署](./running-and-deployment.md) – 使用 `run.sh` 在本機啟動，或使用 `deploy.sh` 進行部署
- [環境變數](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完整設定參考
- [設定](../reference/user-settings.md) – 設定名稱、User Rules 與密碼
- [畫布功能](../reference/canvas-features.md) – 資料釘選、執行日誌、啟用/停用、擷取為子 workflow
- [鍵盤快速鍵](../reference/keyboard-shortcuts.md) – 畫布與編輯器快速鍵
- [Expression DSL](../reference/expression-dsl.md) – 在節點設定中參照資料
- [表達式評估對話框](../reference/expression-evaluation-dialog.md) – 可展開的編輯器，附即時後端預覽
- [Triggers](../reference/triggers.md) – 所有 workflow 進入點（[webhook](../reference/webhooks.md)、portal、cron 等）
- [執行歷史](../reference/execution-history.md) – 查看過去的執行紀錄與 Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – 從非畫布頁面執行已釘選的 workflow
- [Chat with Heym](../reference/chat-with-heym.md) – 從文件頁首提出情境相關問題
- [Workflows 分頁](../tabs/workflows-tab.md) – 建立與管理 workflows
- [Credentials 分頁](../tabs/credentials-tab.md) – 為 LLM 節點新增 API keys
- [AI Assistant](../reference/ai-assistant.md) – 以自然語言建立 workflows
