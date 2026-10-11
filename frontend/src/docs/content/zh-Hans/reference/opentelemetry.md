# OpenTelemetry Tracing

Heym 可为每次 Workflow 运行、节点执行以及 Agent 工具调用发出 [OpenTelemetry](https://opentelemetry.io/) 追踪数据。每次运行都会生成一个根 span，并为每个节点和 Agent 工具生成子 span，因此您可以查看哪一步失败了、耗时多久、调用了什么以及返回了什么。Span 通过 OTLP/HTTP 导出到任何兼容的后端，例如 Jaeger、Grafana Tempo、Honeycomb、Datadog、New Relic 或 Grafana Cloud。

追踪功能**默认处于禁用状态**。关闭时不会产生可测量的开销，也不会创建任何 span。

## 启用追踪

在后端设置以下环境变量，然后重启后端：

完整的环境变量列表请参阅 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)。

| 变量 | 默认值 | 描述 |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | 总开关。设置为 `true` 以启用追踪。 |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP 基础 Endpoint，例如 `http://collector:4318`。Heym 会将 span 发送到 `<endpoint>/v1/traces`。 |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | 用于导出器认证的逗号分隔 `key=value` 请求头，例如 `authorization=Bearer <token>`。 |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` 资源属性。 |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | 介于 `0.0` 和 `1.0` 之间的头部采样比率，与基于父级的采样器配合使用。 |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | 当设置为 `true` 时，将截断后的节点输入和输出 Payload 附加到节点 span 上。出于隐私考虑，默认关闭。 |

最小示例：

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

您可以在应用的 **Settings → Observability** 中确认当前生效的配置（从页眉中的头像打开）。该面板为只读，且绝不会显示导出器的密钥。

## 追踪的内容

### Workflow 根 span

名称：`heym.workflow.execute`

| 属性 | 描述 |
|-----------|-------------|
| `heym.workflow.id` | Workflow UUID。 |
| `heym.node.count` | Workflow 中的节点数量。 |
| `heym.workflow.test_mode` | 测试运行时为 `true`。 |
| `heym.sub_workflow.depth` | 作为子 Workflow 被调用时的嵌套深度。 |
| `heym.workflow.status` | 运行的最终状态。运行失败会将 span 状态设置为 `ERROR`。 |

### 节点 span

名称：`heym.node.execute`，作为 Workflow span 的子 span 创建。

| 属性 | 描述 |
|-----------|-------------|
| `heym.node.id` | 节点 id。 |
| `heym.node.type` | 节点类型，例如 `agent`、`llm`、`http`。 |
| `heym.node.label` | 画布上显示的节点标签。 |
| `heym.node.status` | `success` 或 `error`。错误会将 span 状态设置为 `ERROR`。 |
| `heym.node.duration_ms` | 节点执行时间，以毫秒为单位。 |
| `heym.llm.model` | LLM 和 Agent 节点的模型名称（如可用）。 |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | LLM 和 Agent 节点的 Token 用量（如可用）。 |

即使节点并行运行，节点 span 也能正确地嵌套在 Workflow span 之下，因为 Workflow 上下文会被传播到工作线程中。

### Agent 工具 span

名称：`heym.agent.tool.execute`，在活动的 Agent 节点 span 下创建。

| 属性 | 描述 |
|-----------|-------------|
| `heym.agent.tool.name` | 模型选择的工具名称。 |
| `heym.agent.tool.call_id` | 提供方的工具调用 id（如可用）。 |
| `heym.agent.tool.source` | 工具来源，例如 `node_tool`、`mcp`、`skill` 或 `sub_workflow`。 |
| `heym.agent.tool.mcp_server` | MCP 服务器标签（如适用）。 |
| `heym.agent.tool.iteration` | Agent 工具循环迭代次数。 |
| `heym.agent.tool.args_bytes` | 序列化工具参数的 UTF-8 大小。 |
| `heym.agent.tool.result_bytes` | 序列化工具结果的 UTF-8 大小。 |
| `heym.agent.tool.status` | `success`、`error`、`pending`、`timeout` 或 `cancelled`。工具错误会将 span 状态设置为 `ERROR`。 |

默认情况下，原始工具参数和结果不会附加到 span 上。

## Agent 工具 Payload 安全性

持久化的 Agent 可观测性 Payload 会在代码中进行脱敏和截断（每个字符串 `4096` 个字符，深度 `6`，每次 LLM trace 写入总计 `32768` 个字符）。总 trace 预算会在各工具记录之间分配，因此早期的大型结果不会掩盖后续调用的身份和生命周期状态。有界的 `_generated_files` 下载元数据会与庞大的 skill 输出分开预留：

- LLM trace 的 `request` / `response` 工具部分，包括写入 trace 存储的 `_hitl_pending` 副本
- 执行历史中显示的 Agent 结果 `tool_calls` 记录
- Live Debug 面板的工具结果事件，复用同一份有界脱敏记录

实时工具执行、绑定到模型的消息以及内存中的 HITL 恢复状态（`_hitl_pending.agent_state.messages` / `tool_arguments`）会保留原始值，以确保恢复和精确参数匹配仍然有效。只有存储的可观测性副本会被脱敏。

## Trace Context 传播

Heym 遵循 [W3C Trace Context](https://www.w3.org/TR/trace-context/) 标准，确保 Trace 在跨服务边界时保持连通。

- **入站 Webhook：** 当传入请求携带 `traceparent` 请求头时，该 Workflow 运行会被记录为该 Trace 的子级。这将 Heym 运行与触发它们的上游系统关联起来。
- **出站 HTTP：** HTTP 节点会在其发起的请求中注入 `traceparent`，以便下游服务能够延续同一 Trace。
- **子 Workflow：** 子 Workflow 运行以调用它的节点为父级，从而在单个 Trace 中保留调用层级关系。

没有入站上下文的 Trigger（例如 Cron、IMAP、RabbitMQ 和 WebSocket）每次运行都会启动一个新的 Trace。

## 可靠性

- 缓慢或不可达的 collector 永远不会阻塞 Workflow 执行。Span 会在后台批量导出。
- 如果 tracing 初始化失败（例如 Endpoint 配置错误），后端会记录错误并以禁用 tracing 的状态继续运行，而不是启动失败。
- OTLP 认证请求头仅从环境变量读取。它们永远不会存储在数据库中，也永远不会由状态 API 返回。

## 相关内容

- [设置](./user-settings.md) – 显示 tracing 状态的 Observability 标签页
- [环境变量](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完整配置参考
- [Trigger](./triggers.md) – Workflow 如何启动，包括 Webhook
- [执行历史](./execution-history.md) – Heym 内置的每次运行历史视图
- [HTTP](../nodes/http-node.md) – 向下游调用传播 Trace Context 的节点
