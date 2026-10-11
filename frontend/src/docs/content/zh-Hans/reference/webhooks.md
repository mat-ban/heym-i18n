# Webhooks

Workflow 可通过 HTTP webhook 触发。标准执行 Endpoint 返回 JSON，流式变体则返回 Server-Sent Events（SSE）。

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

将 `{workflow_id}` 替换为 Workflow UUID。基础 URL 为您的 Heym 实例（例如 `https://app.heym.ai`）。

## 请求方法

每个 Workflow 接受一种 HTTP 动词，可在编辑器的 cURL 对话框中选定：`GET`、`POST`、`PUT` 或 `DELETE`。**`POST` 为默认值**，在此设置存在之前创建的所有 Workflow 均保持该默认值，因此当前可正常工作的配置不会发生任何变化。

使用其他动词调用 Workflow 将返回 `405 Method Not Allowed`，并在 `Allow` 头中指明所配置的动词：

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

唯一的例外：携带 `?test_run=true` 的请求会跳过该检查。编辑器的 **Run** 按钮和调试面板发送的正是此类请求，因此设置为 `GET` 的 Workflow 在产品内部仍可进行测试。

### 无请求体的方法

`GET` 和 `DELETE` 不携带请求体。输入改从查询字符串中获取，并通过 `$input.query.<name>` 读取：

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

对于这两种方法，cURL 对话框会隐藏请求体编辑器并移除 `Content-Type` 头。

将 `GET` 与 [HTML 输出映射器](../nodes/html-output-mapper-node.md) 搭配使用，即可提供浏览器可直接打开的页面。

## 流式 Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

当您希望获得增量执行事件而非单个 JSON 响应时，请使用流式 Endpoint。有关事件协议及各节点启动消息配置，请参阅 [SSE Streaming](./sse-streaming.md)。

## 请求格式

请求体会作为 `body` 传递给 [Input](../nodes/input-node.md) 节点。Heym 接受两种请求结构：

- **原始 JSON** – 例如 `{"userId": "123", "action": "create"}`
- **包装格式** – `{"inputs": {...}, "test_run": false}`

使用包装格式时，`inputs` 会被提取并作为 `body` 传递。`test_run` 会绕过速率限制和响应缓存。在发送原始 JSON 时，也可以通过查询参数发送 `?test_run=true`。

## 请求体模式

每个 Workflow 都有一个 `webhook_body_mode` 设置，用于控制编辑器如何构建示例请求：

| 模式 | 行为 |
|------|----------|
| **defined** | 编辑器和 cURL 对话框根据 Workflow 的 Input 节点字段构建示例请求体，并在 JSON Payload 中保留空键。现有的 defined 风格 cURL Payload 继续有效。 |
| **generic** | 编辑器和 cURL 对话框使用自由格式的 JSON 请求体。请求体按原样传递，以便外部应用发送其自定义的固定 Payload 结构。 |

在两种模式下，执行 API 均保持向后兼容。无论采用哪种模式，原始 JSON 和包装格式 `{ "inputs": ... }` 请求均仍被接受。

Headers 和查询参数可在表达式中通过 `$input.headers` 和 `$input.query` 访问。Header 键会被转换为小写。

## 身份验证

在编辑器中按 Workflow 配置（Workflow 设置）。身份验证在执行之前进行检查。

| auth_type | 行为 |
|-----------|----------|
| **anonymous** | 无需身份验证。任何人都可调用该 Endpoint。 |
| **jwt** | 需要 Bearer Token。接受用户会话 Token（用户须具有 Workflow 访问权限）或为此 Workflow 创建的作用域 [Execution Token](./execution-tokens.md)。 |
| **header_auth** | 自定义 Header 必须匹配。设置 `auth_header_key`（例如 `X-API-Key`）和 `auth_header_value`。 |

对于 `header_auth`，请求 Header 值必须与配置值完全匹配。具有 Workflow 访问权限的 JWT 用户也可在不携带自定义 Header 的情况下调用。

对于 `jwt`，[Execution Tokens](./execution-tokens.md) 是从外部系统调用 Workflow 的推荐方式——它们的作用域限定为单个 Workflow，并可独立撤销。

## 响应缓存

按 Workflow 配置 `cache_ttl_seconds`。当设置且大于 0 时：

- **缓存键**：`workflow_id` + `body` + `query` 的 SHA256 哈希
- **缓存命中**：立即返回，`status: "cached"` 及缓存的输出
- **缓存写入**：仅在成功执行后（`status: "success"`）
- **存储**：基于 Postgres，并在各后端 worker 之间共享

| 设置 | 效果 |
|---------|--------|
| `cache_ttl_seconds` = 0 或 null | 缓存禁用 |
| `cache_ttl_seconds` > 0 | 响应缓存该秒数 |

`test_run` 请求会绕过缓存（不读取，不写入）。

在 cURL 对话框中启用响应缓存后，**Clear cache** 会立即清除当前 Workflow 的缓存响应。

## 速率限制

按 Workflow 配置：`rate_limit_requests` 和 `rate_limit_window_seconds`。

- **作用域**：按 `workflow_id` + 客户端 IP（滑动窗口）
- **超出限制**：HTTP 429，并附带 `Retry-After` Header
- **Headers**：`X-RateLimit-Limit`、`X-RateLimit-Remaining`、`X-RateLimit-Reset`

| 设置 | 描述 |
|---------|-------------|
| `rate_limit_requests` | 窗口内允许的最大请求数 |
| `rate_limit_window_seconds` | 窗口时长（秒） |

`test_run` 请求会绕过速率限制。

## 响应格式

Endpoint 返回 JSON：

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| 字段 | 描述 |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`、`error`、`cached` 或 `rate_limited` |
| `outputs` | 终端节点输出。当唯一的终端为单个 [JSON output mapper](../nodes/json-output-mapper-node.md) 时，响应体即为该映射对象（默认简单 JSON 响应）。否则包含 [Output](../nodes/output-node.md) 及其他以标签为键的终端。 |
| `execution_time_ms` | 执行时间（毫秒）（cached/rate_limited 时为 0） |

出错时，`outputs` 可能包含错误详情。[Throw Error](../nodes/throw-error-node.md) 节点可设置自定义 HTTP 状态码（4xx/5xx）。

## Run with cURL 对话框

**Run with cURL** 工具栏按钮（编辑器右上角，`cURL` 图标）会打开一个对话框，为当前 workflow 构建并复制可直接运行的 cURL 命令。

### 功能说明

| 字段 | 描述 |
|-------|-------------|
| **Request Body Mode** | 选择 **Defined** 或 **Generic**。Generic 模式保持请求体为原始 JSON，而非根据 Input 字段构建。 |
| **Authentication** | 选择 Anonymous、JWT Token 或 Header Auth。在命令中设置正确的认证头。选择 JWT Token 时，对话框会显示 [Execution Token](./execution-tokens.md) 管理器——创建或选择 Token 以直接嵌入命令中。 |
| **Header Key / Value** | 选择 Header Auth 时可见。从 workflow 的认证设置中预填充。 |
| **Response Cache** | 缓存相同响应的分钟数（0 = 禁用）。更改会保存到 workflow。启用后，**Clear cache** 会立即清除缓存的响应。 |
| **Rate Limit** | 每时间窗口的最大请求数。更改会保存到 workflow。 |
| **SSE Streaming** | 将命令切换为 `/execute/stream`，添加 `--no-buffer`，并显示各节点的 `node_start` 消息设置。 |
| **Body** | JSON 请求体。Defined 模式下从 [Input](../nodes/input-node.md) 字段预填充并保留空键。Generic 模式下为原始 JSON 编辑器。 |
| **Command** | 完整 cURL 命令的只读预览。 |

点击 **Copy cURL** 将命令复制到剪贴板。

### 示例

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

在 Generic 模式下，嵌套 Payload 保持完整，例如：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

该对话框与 workflow 上存储的认证、请求体模式、缓存和速率限制设置保持同步——在此处编辑会立即更新 workflow。

### 对话框中的 SSE Streaming

如需生成的命令在终端中实时跟踪执行过程，请启用 **SSE Streaming**。

- Endpoint 从 `/execute` 变为 `/execute/stream`
- 命令添加 `--no-buffer` 和 `Accept: text/event-stream`
- 每个非 sticky 节点会出现在列表中，您可以：
  - 启用或禁用 `node_start` 消息
  - 自定义启动消息文本
- `node_complete` 事件始终发出，并包含完整的节点输出

示例：

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

完整的事件协议和示例，请参阅 [SSE Streaming](./sse-streaming.md)。

## Trigger 来源标记

每次执行都会存储一个 `trigger_source` 标签，可在 [Execution History](./execution-history.md) 中查看。通过发送 `X-Trigger-Source` 头并设置任意值来指定：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

编辑器对话框中的 **Copy cURL** 按钮会自动包含 `X-Trigger-Source: API`。您可以将 `API` 替换为任何有意义的标识——`scheduler`、`rabbitmq`、`github-actions` 等。

如果未发送该头，`trigger_source` 默认为 `"API"`，运行记录在历史中标记为 **API**。可用对您的系统有意义的任意值覆盖——`scheduler`、`github-actions`、`rabbitmq` 等。

## 相关内容

- [Execution Tokens](./execution-tokens.md) – 用于从外部系统调用 workflow 的范围化 JWT
- [SSE Streaming](./sse-streaming.md) – 通过 Server-Sent Events 实时流式传输节点事件
- [Triggers](./triggers.md) – 所有 workflow 入口点，包括 webhook
- [Workflow Structure](./workflow-structure.md) – 节点与边
- [Expression DSL](./expression-dsl.md) – 访问 `$input.body`、`$input.headers`、`$input.query`
