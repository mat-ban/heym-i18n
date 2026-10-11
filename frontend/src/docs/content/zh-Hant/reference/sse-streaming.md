# SSE Streaming

Workflow 可透過 Server-Sent Events（SSE）即時串流執行事件。

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

此 Endpoint 使用與標準 execute Endpoint 相同的 workflow 層級驗證、速率限制及回應快取規則，詳見 [Webhooks](./webhooks.md)。

## 在 cURL 對話框中啟用 SSE

在編輯器中開啟 **Run with cURL** 對話框，並啟用 **SSE Streaming**。

啟用後，Heym 會：

- 將產生的指令從 `/execute` 切換為 `/execute/stream`
- 加入 `--no-buffer`，讓串流事件立即顯示於終端機輸出中
- 加入 `Accept: text/event-stream`
- 讓您直接在對話框中設定每個節點的 `node_start` 訊息

## 事件協定

每個 SSE 訊框皆為以 `data: ` 為前綴的換行分隔 JSON。

| 事件類型 | 發出時機 | 關鍵欄位 |
|------------|--------------------|------------|
| `execution_started` | 請求被接受後立即發出 | `execution_id`、`server_now_ms` |
| `node_start` | 節點開始執行前 | `node_id`、`node_label`、`started_at_ms`、選用的 `message` |
| `node_retry` | 節點重試時 | `node_id`、`attempt`、`max_attempts` |
| `node_complete` | 節點完成後 | `node_id`、`node_label`、`status`、`output`、`execution_time_ms` |
| `final_output` | Output 節點提前回傳時 | `node_label`、`output` |
| `execution_complete` | Workflow 結束後 | `status`、`outputs`、`execution_time_ms` |

## 各節點啟動訊息

cURL 對話框會將 SSE 設定儲存於 workflow 本身：

- **Send start** 控制 `node_start` 事件是否包含 `message`
- **Start message** 預設為 `[START] {nodeLabel}`
- 清除自訂訊息後會退回使用預設文字
- `node_complete` 一律會發出，且一律包含節點輸出

儲存設定範例：

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## cURL 範例

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

事件串流範例：

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## 安全性注意事項

- `anonymous`、`jwt` 及 `header_auth` workflow 的行為與一般 webhook Endpoint 相同
- 當設定了 `cache_ttl_seconds` 時，回應快取仍會生效
- 當設定了 `rate_limit_requests` 及 `rate_limit_window_seconds` 時，workflow 速率限制仍會生效
- `test_run` 會同時繞過快取與速率限制，與 `/execute` 的行為相同

## 相關內容

- [Webhooks](./webhooks.md) – 標準 execute Endpoint 與 cURL 對話框
- [Parallel Execution](./parallel-execution.md) – 串流如何融入 Heym 的 DAG 排程器
- [Canvas Features](./canvas-features.md) – 包含 Run with cURL 的編輯器控制項
- [Security](./security.md) – 驗證與機密處理
