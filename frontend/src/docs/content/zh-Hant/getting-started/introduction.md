# 簡介

**打造 agentic 系統，安心運行。**

Heym 是於正式環境運行與治理 AI agents 的基礎設施。可協調 agents、自動化業務流程、檢視每一次執行，並讓人類保有控制權。將 Heym 部署在您自己的基礎設施上。

在 Heym 中，Workflow 定義了 agents、確定性步驟、工具與資料如何協同運作。Runtime 會執行該圖、記錄每一次運行，並在您指定的位置暫停以進行人工審查。視覺化畫布是您建構與檢視 Workflows 的地方，而相同的 Workflows 亦可透過 API、排程、事件 Trigger、MCP 用戶端與 Portal 聊天來執行。請造訪 [heym.run](https://heym.run) 以了解產品網站，並參閱 [Why Heym](./why-heym.md) 了解 Heym 在 agent 生命週期各階段所處理的事項。

## 您可以做什麼

- **建構** – 在 [Workflows](../tabs/workflows-tab.md) 分頁的[畫布](../reference/canvas-features.md)上組合 agents 與確定性步驟、以自然語言向 [AI Assistant](../reference/ai-assistant.md) 描述，或從 [Templates](../tabs/templates-tab.md) 開始
- **協調** – 協調 [Agent](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md) 與 [RAG](../nodes/rag-node.md) 節點、[sub-agents](../reference/agent-architecture.md)、MCP 工具，以及 [integrations](../reference/integrations.md)（例如 HTTP、Slack 與電子郵件），並在相依性允許時進行[平行執行](../reference/parallel-execution.md)
- **運行** – 從 [webhooks](../reference/webhooks.md)、[Cron](../nodes/cron-node.md) 排程與事件 [triggers](../reference/triggers.md) 啟動 Workflows，並具備各節點重試、[錯誤處理](../nodes/error-handler-node.md)與跨執行個體的[負載分配](../reference/cluster.md)
- **觀測** – 檢視[執行歷史](../reference/execution-history.md)、含 Token 成本的 [LLM traces](../tabs/traces-tab.md)、[analytics](../tabs/analytics-tab.md) 與 [alerts](../tabs/alerts-tab.md)，並匯出 [OpenTelemetry](../reference/opentelemetry.md) traces
- **評估** – 在 [Evals](../tabs/evals-tab.md) 分頁中，針對預期輸出測試 prompts 與模型
- **控制** – 暫停 agents 以進行[人工審查](../reference/human-in-the-loop.md)、以 [guardrails](../reference/guardrails.md) 封鎖不安全的內容，並透過 [credentials](../tabs/credentials-tab.md)、[teams](../reference/teams.md)、[single sign-on](../reference/sso.md) 與[稽核軌跡](../reference/audit.md)管理存取權
- **暴露** – 以 REST 與 [SSE streaming](../reference/sse-streaming.md)、[MCP](../tabs/mcp-tab.md) 工具，以及供終端使用者使用的 [Portal](../reference/portal.md) 聊天介面來提供 Workflows；使用 [Chat](../tabs/chat-tab.md) 分頁直接測試模型
- **與 Heym 對話** – 在文件中透過 [Chat with Heym](../reference/chat-with-heym.md) 對話框，詢問能感知頁面內容的產品問題

## 核心概念

- **Workflows** – 由節點與邊構成的有向圖。於 [Workflows](../tabs/workflows-tab.md) 分頁中管理。請參閱 [Workflow Structure](../reference/workflow-structure.md)。
- **Nodes** – 處理單元（[Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[Condition](../nodes/condition-node.md) 等）。請參閱 [Node Types](../reference/node-types.md)。
- **Edges** – 定義執行流程的連接
- **Credentials** – 儲存於 [Credentials](../tabs/credentials-tab.md) 分頁中的 API 金鑰與機密，由節點參照。
- **Variables** – 儲存於 [Variables](../tabs/global-variables-tab.md) 分頁中的持久性鍵值資料，可透過 `$global.variableName` 存取。請參閱 [Global Variables](../reference/global-variables.md)。
- **Expressions** – 以 `$input` 與 `$nodeName.field` 參照上游資料。請參閱 [Expression DSL](../reference/expression-dsl.md)。

## 相關內容

- [Why Heym](./why-heym.md) – Heym 在 agent 生命週期各階段所處理的事項
- [Quick Start](./quick-start.md) – 建構您的第一個 Workflow
- [Running & Deployment](./running-and-deployment.md) – 以 `run.sh` 在本機啟動，或以 `deploy.sh` 部署
- [AI Assistant](../reference/ai-assistant.md) – 以自然語言建立 Workflows
- [Chat with Heym](../reference/chat-with-heym.md) – 閱讀文件時詢問後續問題
- [Core Concepts](./core-concepts.md) – Workflows、節點與執行流程
- [Workflows Tab](../tabs/workflows-tab.md) – 管理 Workflows 與資料夾
- [Credentials Tab](../tabs/credentials-tab.md) – 為節點新增 API 金鑰
