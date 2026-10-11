# SSE Streaming

Workflow 可以通过 Server-Sent Events (SSE) 实时流式传输执行事件。

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

此 Endpoint 使用与标准 execute Endpoint 相同的 Workflow 级身份验证、速率限制和响应缓存规则，详见 [Webhooks](./webhooks.md)。

## 在 cURL 对话框中启用 SSE

在编辑器中打开 **Run with cURL** 对话框，并启用 **SSE Streaming**。

启用后，Heym 会：

- 将生成的命令从 `/execute` 切换为 `/execute/stream`
- 添加 `--no-buffer`，使流式事件立即显示在终端输出中
- 添加 `Accept: text/event-stream`
- 允许你直接在对话框中配置每个节点的 `node_start` 消息

## 事件协议

每个 SSE 帧都是以 `data: ` 为前缀的换行分隔 JSON。

| 事件类型 | 触发时机 | 关键字段 |
|------------|--------------------|------------|
| `execution_started` | 请求被接受后立即触发 | `execution_id`, `server_now_ms` |
| `node_start` | 节点开始执行之前 | `node_id`, `node_label`, `started_at_ms`, 可选 `message` |
| `node_retry` | 节点重试时 | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | 节点完成后 | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Output 节点提前返回时 | `node_label`, `output` |
| `execution_complete` | Workflow 结束后 | `status`, `outputs`, `execution_time_ms` |

## 每个节点的启动消息

cURL 对话框将 SSE 设置存储在工作流本身上：

- **Send start** 控制 `node_start` 事件是否包含 `message`
- **Start message** 默认为 `[START] {nodeLabel}`
- 清除自定义消息后会回退到默认文本
- `node_complete` 始终会被发出，并且始终包含节点输出

存储配置示例：

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

## cURL 示例

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

事件流示例：

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## 安全说明

- `anonymous`、`jwt` 和 `header_auth` Workflow 的行为与常规 Webhook Endpoint 相同
- 当配置了 `cache_ttl_seconds` 时，响应缓存仍然生效
- 当配置了 `rate_limit_requests` 和 `rate_limit_window_seconds` 时，Workflow 速率限制仍然生效
- `test_run` 会同时绕过缓存和速率限制，与 `/execute` 的行为一致

## 相关内容

- [Webhooks](./webhooks.md) – 标准 execute Endpoint 和 cURL 对话框
- [Parallel Execution](./parallel-execution.md) – 流式传输如何融入 Heym 的 DAG 调度器
- [Canvas Features](./canvas-features.md) – 编辑器控件，包括 Run with cURL
- [Security](./security.md) – 身份验证和密钥处理
