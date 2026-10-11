# OpenTelemetry Tracing

Heym 可為每次 Workflow 執行、節點執行與 Agent 工具呼叫發出 [OpenTelemetry](https://opentelemetry.io/) trace。每次執行會產生一個 root span，並為每個節點與 Agent 工具建立子 span，讓您能看到哪個步驟失敗、耗時多久、呼叫了什麼，以及回傳了什麼。Span 會透過 OTLP/HTTP 匯出至任何相容的後端，例如 Jaeger、Grafana Tempo、Honeycomb、Datadog、New Relic 或 Grafana Cloud。

Tracing **預設為停用**。停用時不會產生可量測的額外負擔，也不會建立任何 span。

## 啟用 Tracing

在後端設定以下環境變數，然後重新啟動後端：

完整的環境變數清單，請參閱 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)。

| 變數 | 預設值 | 說明 |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | 主開關。設為 `true` 以啟用 tracing。 |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP 基礎 Endpoint，例如 `http://collector:4318`。Heym 會將 span 發佈至 `<endpoint>/v1/traces`。 |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | 以逗號分隔的 `key=value` header，用於 exporter 驗證，例如 `authorization=Bearer <token>`。 |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` 資源屬性。 |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | 介於 `0.0` 與 `1.0` 之間的 head sampling 比例，會搭配 parent-based sampler 套用。 |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | 設為 `true` 時，會將截斷後的節點輸入與輸出 Payload 附加至節點 span。基於隱私考量，預設為停用。 |

最小範例：

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

您可以在應用程式的 **Settings → Observability**（從頁首的頭像開啟）中確認目前生效的設定。該面板為唯讀，且永遠不會顯示 exporter 機密資訊。

## 會被 Tracing 的內容

### Workflow root span

名稱：`heym.workflow.execute`

| 屬性 | 說明 |
|-----------|-------------|
| `heym.workflow.id` | Workflow UUID。 |
| `heym.node.count` | Workflow 中的節點數量。 |
| `heym.workflow.test_mode` | 測試執行時為 `true`。 |
| `heym.sub_workflow.depth` | 作為 sub-workflow 被呼叫時的巢狀深度。 |
| `heym.workflow.status` | 該次執行的最終狀態。執行失敗會將 span 狀態設為 `ERROR`。 |

### 節點 span

名稱：`heym.node.execute`，建立為 workflow span 的子 span。

| 屬性 | 說明 |
|-----------|-------------|
| `heym.node.id` | 節點 id。 |
| `heym.node.type` | 節點類型，例如 `agent`、`llm`、`http`。 |
| `heym.node.label` | 畫布上顯示的節點標籤。 |
| `heym.node.status` | `success` 或 `error`。錯誤會將 span 狀態設為 `ERROR`。 |
| `heym.node.duration_ms` | 節點執行時間，以毫秒為單位。 |
| `heym.llm.model` | LLM 與 agent 節點的模型名稱（若有）。 |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | LLM 與 agent 節點的 Token 用量（若有）。 |

即使節點平行執行，節點 span 仍會正確巢狀於 workflow span 之下，因為 workflow context 會傳播至 worker thread。

### Agent 工具 span

名稱：`heym.agent.tool.execute`，建立於作用中的 Agent 節點 span 之下。

| 屬性 | 說明 |
|-----------|-------------|
| `heym.agent.tool.name` | 由模型選擇的工具名稱。 |
| `heym.agent.tool.call_id` | 供應商的 tool-call id（若有）。 |
| `heym.agent.tool.source` | 工具來源，例如 `node_tool`、`mcp`、`skill` 或 `sub_workflow`。 |
| `heym.agent.tool.mcp_server` | MCP server 標籤（若適用）。 |
| `heym.agent.tool.iteration` | Agent 工具迴圈迭代次數。 |
| `heym.agent.tool.args_bytes` | 序列化後工具引數的 UTF-8 大小。 |
| `heym.agent.tool.result_bytes` | 序列化後工具結果的 UTF-8 大小。 |
| `heym.agent.tool.status` | `success`、`error`、`pending`、`timeout` 或 `cancelled`。工具錯誤會將 span 狀態設為 `ERROR`。 |

原始工具引數與結果預設不會附加至 span。

## Agent 工具 Payload 安全性

持久化的 Agent 可觀測性 Payload 會在程式碼中進行遮蔽與截斷（每個字串 `4096` 字元、深度 `6`、每次 LLM trace 寫入總計 `32768` 字元）。整體 trace 預算會分配至各工具記錄，因此早期的大型結果不會遮蔽後續呼叫的身分與生命週期狀態。受限制的 `_generated_files` 下載中介資料會與龐大的 skill 輸出分開保留：

- LLM trace 的 `request` / `response` 工具區段，包括寫入 trace store 的 `_hitl_pending` 副本
- 執行歷史中顯示的 Agent 結果 `tool_calls` 記錄
- Live Debug 面板的工具結果事件，其重用相同的受限制、已消毒記錄

即時工具執行、綁定至模型的工具訊息，以及記憶體中的 HITL 恢復狀態（`_hitl_pending.agent_state.messages` / `tool_arguments`）會保留原始值，因此恢復與精確引數比對仍可運作。只有儲存的可觀測性副本會被消毒。

## Trace Context 傳播

Heym 遵循 [W3C Trace Context](https://www.w3.org/TR/trace-context/) 標準，讓 trace 能夠跨越服務邊界保持連結。

- **入站 Webhook：** 當傳入的請求帶有 `traceparent` header 時，該 Workflow 執行會被記錄為該 trace 的子項。這會將 Heym 的執行與觸發它們的上游系統連結起來。
- **出站 HTTP：** HTTP 節點會在其發出的請求中注入 `traceparent`，讓下游服務能夠延續同一條 trace。
- **子 Workflow：** 子 Workflow 的執行會以呼叫它的節點作為父項，從而在單一 trace 中保留呼叫階層。

沒有入站上下文的 Trigger（例如 Cron、IMAP、RabbitMQ 與 WebSocket）會為每次執行啟動一條全新的 trace。

## 可靠性

- 緩慢或無法連線的 collector 絕不會阻擋 Workflow 執行。Span 會以批次方式在背景匯出。
- 若 tracing 初始化失敗（例如 endpoint 設定錯誤），後端會記錄錯誤並在停用 tracing 的情況下繼續運作，而非啟動失敗。
- OTLP 驗證 header 僅從環境讀取。它們永遠不會儲存於資料庫，也永遠不會由狀態 API 回傳。

## 相關內容

- [Settings](./user-settings.md) – 顯示 tracing 狀態的 Observability 分頁
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完整配置參考
- [Triggers](./triggers.md) – Workflow 如何啟動，包括 Webhook
- [Execution History](./execution-history.md) – Heym 內建的每次執行歷史檢視
- [HTTP](../nodes/http-node.md) – 將 trace context 傳播至下游呼叫的節點
