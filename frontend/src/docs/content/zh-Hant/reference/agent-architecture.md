# Agent 架構

[Agent 節點](../nodes/agent-node.md)支援子 Agent、子 Workflow、畫布節點工具、協調器模式、技能、MCP 連線、工具呼叫、選用的[持久記憶](./agent-persistent-memory.md)（依畫布節點區分，可選擇與其他 Agent 共享），以及選用的[人工審查](./human-in-the-loop.md)。本頁說明其架構。

## 子 Agent

子 Agent 是協調器可透過 `call_sub_agent` 工具呼叫的 Agent 節點。

- **協調器**：`isOrchestrator: true`、`subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **子 Agent**：必須在其 User Message 中使用 `$input.text`，以便接收協調器的 Prompt
- **工具**：`call_sub_agent`，包含 `sub_agent_label`（enum）與 `prompt`
- **深度限制**：最多 5 層巢狀子 Agent 呼叫

### 執行流程

1. 協調器決定呼叫子 Agent
2. `_execute_sub_agent_tool` 依 label 尋找目標 Agent
3. 建構 `synthetic_inputs = {"input": {"text": prompt}}`
4. 對子 Agent 執行 `_execute_agent_node`
5. 結果回傳給協調器

### 平行子 Agent 執行

當協調器在單一回合中回傳多個 `call_sub_agent` 工具呼叫時，這些呼叫會**平行**執行。例如，若使用者詢問「Paris」相關問題，而協調器同時呼叫 `distanceAgent` 與 `foodAgent`，兩者會並行執行而非依序執行。

- **效益**：總耗時約等於最慢的子 Agent，而非所有子 Agent 的加總。
- **提示**：當任務需要時，鼓勵協調器在單一回合中呼叫多個子 Agent。

## 子 Workflow

當設定了 `subWorkflowIds` 時，Agent 可透過 `call_sub_workflow` 工具呼叫其他 Workflow。

- **設定**：`subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **工具**：`call_sub_workflow`，包含 `workflow_id`（enum）與 `inputs`（object）
- **深度限制**：最多 5 層巢狀子 Workflow 呼叫

### 執行流程

1. Agent 決定呼叫子 Workflow
2. `_execute_sub_workflow_tool` 從 `workflow_cache` 取得該 Workflow
3. 建構 `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. 對子 Workflow 執行 `WorkflowExecutor.execute()`
5. 結果回傳給 Agent

在 v1 中，子 Workflow 無法暫停以進行 HITL。若巢狀子 Workflow 嘗試進入待審查狀態，執行會失敗，而不會在巢狀呼叫中暫停。

## 畫布節點工具

畫布節點工具是透過 `tool-input` 控制點連線至 Agent 的 Workflow 節點。在 Agent 設定階段，`_build_node_tool_schemas` 會掃描這些邊，並為每個已連線的節點新增一個 OpenAI 相容的工具 schema。

- **工具來源**：`_source: "node_tool"`
- **工具名稱**：衍生自已連線節點的 label，若有重複則加上後綴
- **工具參數**：由節點的 `agentProvidedFields` 建構
- **固定欄位**：所有未列於 `agentProvidedFields` 的節點欄位會保留在節點設定中

### 執行流程

1. Agent 決定呼叫已連線的節點工具
2. `_execute_node_tool` 複製節點資料
3. Agent 提供的引數會合併至已設定的節點欄位
4. `execute_node` 在停用分支排程的情況下執行該節點一次
5. 還原原始節點資料
6. 節點輸出會作為工具結果回傳給 Agent

工具節點會從一般 Workflow 排程中排除，因此不會執行兩次。它們僅透過 Agent 工具呼叫路徑執行。

## Human-in-the-Loop

當 Agent 設定了 `hitlEnabled` 時，Agent 會收到一個 `request_human_review` 工具，可在特定核准檢查點呼叫。

1. 系統 Prompt 與節點 HITL 指引會告知 Agent 哪些動作需要核准
2. 當 Agent 到達其中一個步驟時，會呼叫 `request_human_review`
3. Heym 儲存 Workflow 執行快照並建立公開審查請求
4. 節點結果會標記為 `pending`，並附上審查 URL
5. Agent 的 `review` 輸出控制點會立即排程，以便通知分支能以 pending payload 執行
6. 主要執行排程會停止，直到審查者回應
7. 在 `accept`、`edit` 或 `refuse` 時，執行器會從儲存的快照重建
8. 暫停的 Agent 會以已核准的審查內容繼續，或在 `refuse` 時立即結束
9. 下游節點會在恢復的 Agent 完成後繼續，而不會重新執行 `review` 分支
10. 若後續動作也需要核准，Agent 可在同一次執行中建立另一個 HITL 檢查點

面向審查者的摘要會由審查請求本身產生，因此節點欄位可專注於核准政策與時機。

這讓 Agent Workflow 能等待外部核准，同時保留對話歷史、已完成的節點輸出、迴圈狀態與其他執行階段內容。

## 協調器工具執行器

自訂工具執行器的路由如下：

- **子 Agent 呼叫**（`_source == "sub_agent"`）→ `_execute_sub_agent_tool`
- **子 Workflow 呼叫**（`_source == "sub_workflow"`）→ `_execute_sub_workflow_tool`
- **畫布節點工具**（`_source == "node_tool"`）→ `_execute_node_tool`
- **人工審查**（`_source == "hitl"`）→ 建立待處理的 HITL 檢查點
- **其他工具** → `_unified_tool_executor`（Python、MCP、技能工具）

當啟用 HITL、設定了帶有 `subAgentLabels` 的 `isOrchestrator`，或設定了 `subWorkflowIds` 時，便會使用此執行器。

## Skills

Skills 會擴充 agent 的系統上下文，並可加入 Python 工具。

- **結構**：`AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **內容**：會前置加入系統指令（以 `---` 串接）
- **Python 工具**：對於每個含有 `.py` 檔案的 skill，會新增一個 `skill_{skill_name}` 工具
- **執行**：`skill_python_executor.py` 會在暫存目錄中以 `uv run python` 執行腳本；args 以 JSON 格式從 stdin 傳入，結果以 JSON 格式從 stdout 輸出

您可以將 `.zip` 或 `.md` 檔案拖放到 [Agent Node](../nodes/agent-node.md) 設定中的 Skills 區域來新增 Skills。

## MCP Client

MCP（Model Context Protocol）client 會連線至外部工具伺服器。

- **傳輸方式**：`stdio`（command + args）或 `sse`（url + headers）
- **列出工具**：`list_mcp_tools` → `ClientSession.list_tools()` → 轉換為 OpenAI function 格式，並帶有 `_source: "mcp"`
- **執行**：`execute_mcp_tool` → `ClientSession.call_tool()` → 透過 `_extract_tool_result` 取得結果

您可以在 [MCP Tab](../tabs/mcp-tab.md) 或 agent node 的 `mcpConnections` 中設定 MCP 連線。

## Tool Calling

LLM 服務會執行 `execute_with_tools` 迴圈：

1. **上下文壓縮檢查** — 在每次迭代前，估算 token 用量，並視需要進行壓縮（見下文）
2. 以 `tools` 與 `tool_choice: "auto"` 呼叫模型
3. 若存在 `tool_calls`：針對每個呼叫執行 `tool_executor(tool_def, name, args, timeout)`
4. 將工具結果附加至 messages，然後重複
5. 當沒有更多工具呼叫，或達到 `max_tool_iterations` 時停止

### Tool Dispatch

`_unified_tool_executor` 會依據 `_source` 進行路由：

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| （預設） | `execute_tool`（Python 程式碼工具） |

工具使用 OpenAI function-calling 格式：`name`、`description`、`parameters`（JSON schema）。

## Context Compression

為避免長時間執行的 agent 發生上下文溢位，Heym 會在每次工具迭代前自動壓縮累積的 `messages` 清單。

### 演算法

1. **估算 token**：對所有 messages 計算 `total_chars / 4`（快速，無需 tokenizer）
2. **閾值檢查**：若 `estimated_tokens < context_limit × 0.80`，則跳過壓縮
3. **上下文限制**：嘗試 `client.models.retrieve(model).context_window`；若失敗則改用內建對照表（`gpt-4o` → 128K、`claude-3-5-sonnet` → 200K、`gemini-2.0-flash` → 1M 等）；預設為 128K
4. **錨點保留**：一律保留
   - 第一則 `system` message（agent 身分與指令）
   - 第一則 `user` message（原始任務）
   - 最後一則 `user` message（最新指令）
5. **摘要中間部分**：第一則與最後一則 user message 之間的所有內容會被序列化，並以摘要 prompt 傳送至同一個模型
6. **重建**：`[system, first_user, assistant(summary), last_user]`

若不同的 user message 少於 2 則（沒有中間部分可摘要），或 LLM 摘要呼叫失敗（安全回退：回傳原始 messages），則會跳過壓縮。

### Observability

每個壓縮事件會記錄為：
- `tool_calls_collected` 中的一筆 `_context_compression` 項目 → 可在 Execution History 的 run detail 中檢視
- 一個帶有 `phase: "compression"` 的 `on_tool_call` 事件 → 會在 Debug 面板中呈現為 `Context compressed (N messages → summary)`
- 一筆 `context.compression` LLM trace 項目 → 可在 Traces tab 中檢視，並包含壓縮前後的 token 估算值

Agent 工具呼叫也會產生更豐富的 observability：

- `tool_calls` 上的每次呼叫生命週期欄位：`tool_call_id`、`status`（`success` / `error` / `pending` / `timeout` / `cancelled`）、`started_at`、`finished_at`、`elapsed_ms`
- agent 結果上的彙總 `tool_metrics`（依 status 計數，加上總計/最大持續時間）；`_context_compression` 項目會從這些計數中排除
- 可選用的 OpenTelemetry 子 span，名稱為 `heym.agent.tool.execute`（請參閱 [OpenTelemetry Tracing](./opentelemetry.md)）
- 持久化的 LLM trace / execution-history `tool_calls` payload 會經過遮蔽並限制大小；即時 HITL resume 狀態會保留原始內容以供比對

## Related

- [Why Heym](../getting-started/why-heym.md) – 橫跨 agent 生命週期的多 agent 協同運作
- [Agent Node](../nodes/agent-node.md) – 設定與參數
- [Agent Persistent Memory](./agent-persistent-memory.md) – 每個 agent node 的知識圖譜與同儕分享
- [Human-in-the-Loop](./human-in-the-loop.md) – 審核連結、待處理 payload 與 resume 行為
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow、node 與 Agent 工具 span
- [Node Types](./node-types.md) – Agent 與相關節點
- [Parallel Execution](./parallel-execution.md) – 以 DAG 為基礎與 sub-agent 的平行執行
- [MCP Tab](../tabs/mcp-tab.md) – 設定 MCP 連線
- [Expression DSL](./expression-dsl.md) – 供 sub-agent 使用的 `$input.text`
