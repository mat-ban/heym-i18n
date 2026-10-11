# Agent 架构

[Agent 节点](../nodes/agent-node.md)支持子 Agent、子 Workflow、画布节点工具、编排器模式、技能、MCP 连接、工具调用、可选的[持久化记忆](./agent-persistent-memory.md)（按画布节点存储，可选择共享给其他 Agent），以及可选的[人工审核](./human-in-the-loop.md)。本页介绍其架构。

## 子 Agent

子 Agent 是编排器可通过 `call_sub_agent` 工具调用的 Agent 节点。

- **编排器**：`isOrchestrator: true`，`subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **子 Agent**：必须在其 User Message 中使用 `$input.text`，以便接收编排器的 Prompt
- **工具**：`call_sub_agent`，参数为 `sub_agent_label`（枚举）和 `prompt`
- **深度限制**：最多 5 层嵌套子 Agent 调用

### 执行流程

1. 编排器决定调用某个子 Agent
2. `_execute_sub_agent_tool` 根据标签查找目标 Agent
3. 构建 `synthetic_inputs = {"input": {"text": prompt}}`
4. 对子 Agent 运行 `_execute_agent_node`
5. 结果返回给编排器

### 并行子 Agent 执行

当编排器在单轮中返回多个 `call_sub_agent` 工具调用时，它们将**并行**执行。例如，如果用户询问“Paris”，而编排器同时调用了 `distanceAgent` 和 `foodAgent`，两者将并发运行而非顺序执行。

- **优势**：总耗时约等于最慢的子 Agent，而非所有子 Agent 之和。
- **提示**：当任务需要时，鼓励编排器在单轮中调用多个子 Agent。

## 子 Workflow

当配置了 `subWorkflowIds` 时，Agent 可通过 `call_sub_workflow` 工具调用其他 Workflow。

- **配置**：`subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **工具**：`call_sub_workflow`，参数为 `workflow_id`（枚举）和 `inputs`（对象）
- **深度限制**：最多 5 层嵌套子 Workflow 调用

### 执行流程

1. Agent 决定调用某个子 Workflow
2. `_execute_sub_workflow_tool` 从 `workflow_cache` 获取该 Workflow
3. 构建 `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. 对子 Workflow 运行 `WorkflowExecutor.execute()`
5. 结果返回给 Agent

在 v1 中，子 Workflow 无法暂停以进行 HITL。如果嵌套的子 Workflow 尝试进入待审核状态，执行将失败，而不会在嵌套调用内部挂起。

## 画布节点工具

画布节点工具是通过 `tool-input` 句柄连接到 Agent 的 Workflow 节点。在 Agent 设置期间，`_build_node_tool_schemas` 会扫描这些边，并为每个连接的节点添加一个 OpenAI 兼容的工具 schema。

- **工具来源**：`_source: "node_tool"`
- **工具名称**：派生自所连接节点的标签，重复时添加后缀
- **工具参数**：根据节点的 `agentProvidedFields` 构建
- **固定字段**：未列入 `agentProvidedFields` 的所有节点字段保留在节点配置中

### 执行流程

1. Agent 决定调用某个已连接的节点工具
2. `_execute_node_tool` 复制节点数据
3. Agent 提供的参数合并到已配置的节点字段中
4. `execute_node` 在禁用分支调度的情况下运行该节点一次
5. 恢复原始节点数据
6. 节点输出作为工具结果返回给 Agent

工具节点被排除在常规 Workflow 调度之外，因此不会运行两次。它们仅通过 Agent 工具调用路径执行。

## Human-in-the-Loop

当在 Agent 上设置了 `hitlEnabled` 时，Agent 会获得一个 `request_human_review` 工具，可在特定审批检查点调用。

1. 系统 Prompt 和节点 HITL 指南告知 Agent 哪些操作需要审批
2. 当 Agent 到达其中某个步骤时，调用 `request_human_review`
3. Heym 存储 Workflow 执行快照并创建公开审核请求
4. 节点结果被标记为 `pending`，并附带审核 URL
5. Agent 的 `review` 输出句柄立即被调度，以便通知分支可使用 pending payload 运行
6. 主执行调度停止，直到审核者响应
7. 在 `accept`、`edit` 或 `refuse` 时，执行器从存储的快照重建
8. 暂停的 Agent 使用已批准的审核上下文继续执行，或在 `refuse` 时立即退出
9. 下游节点在恢复的 Agent 完成后继续执行，不会重新运行 `review` 分支
10. 如果后续操作也需要审批，Agent 可在同一次运行中创建另一个 HITL 检查点

面向审核者的摘要由审核请求本身生成，因此节点字段可专注于审批策略和时机。

这使 Agent Workflow 能够等待外部审批，同时保留对话历史、已完成的节点输出、循环状态及其他运行时上下文。

## 编排器工具执行器

自定义工具执行器负责路由：

- **子 Agent 调用**（`_source == "sub_agent"`）→ `_execute_sub_agent_tool`
- **子 Workflow 调用**（`_source == "sub_workflow"`）→ `_execute_sub_workflow_tool`
- **画布节点工具**（`_source == "node_tool"`）→ `_execute_node_tool`
- **人工审核**（`_source == "hitl"`）→ 创建待处理的 HITL 检查点
- **其他工具** → `_unified_tool_executor`（Python、MCP、技能工具）

当启用 HITL、设置了带 `subAgentLabels` 的 `isOrchestrator`，或配置了 `subWorkflowIds` 时，将使用该执行器。

## Skills

Skills 扩展 agent 的系统上下文，并可添加 Python 工具。

- **结构**：`AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **内容**：前置添加到系统指令中（以 `---` 连接）
- **Python 工具**：对于每个包含 `.py` 文件的 skill，会添加一个 `skill_{skill_name}` 工具
- **执行**：`skill_python_executor.py` 在临时目录中通过 `uv run python` 运行脚本；参数以 JSON 格式通过 stdin 传入，结果以 JSON 格式通过 stdout 返回

可通过将 `.zip` 或 `.md` 文件拖放到 [Agent 节点](../nodes/agent-node.md)配置中的 Skills 区域来添加 Skills。

## MCP Client

MCP（Model Context Protocol）客户端用于连接外部工具服务器。

- **传输方式**：`stdio`（command + args）或 `sse`（url + headers）
- **列出工具**：`list_mcp_tools` → `ClientSession.list_tools()` → 转换为 OpenAI function 格式，并带有 `_source: "mcp"`
- **执行**：`execute_mcp_tool` → `ClientSession.call_tool()` → 通过 `_extract_tool_result` 获取结果

可在 [MCP Tab](../tabs/mcp-tab.md) 或 agent 节点的 `mcpConnections` 中配置 MCP 连接。

## Tool Calling

LLM 服务运行 `execute_with_tools` 循环：

1. **上下文压缩检查** — 在每次迭代前，估算 token 用量并在需要时进行压缩（见下文）
2. 使用 `tools` 和 `tool_choice: "auto"` 调用模型
3. 如果存在 `tool_calls`：对每个调用执行 `tool_executor(tool_def, name, args, timeout)`
4. 将工具结果追加到 messages，重复执行
5. 当没有更多工具调用或达到 `max_tool_iterations` 时停止

### Tool Dispatch

`_unified_tool_executor` 根据 `_source` 进行路由：

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| （默认） | `execute_tool`（Python 代码工具） |

工具使用 OpenAI function-calling 格式：`name`、`description`、`parameters`（JSON schema）。

## Context Compression

为防止长时间运行的 agent 出现上下文溢出，Heym 会在每次工具迭代前自动压缩累积的 `messages` 列表。

### 算法

1. **估算 token**：对所有 messages 计算 `total_chars / 4`（快速，无需 tokenizer）
2. **阈值检查**：如果 `estimated_tokens < context_limit × 0.80`，跳过压缩
3. **上下文限制**：尝试 `client.models.retrieve(model).context_window`；回退到内置表（`gpt-4o` → 128K，`claude-3-5-sonnet` → 200K，`gemini-2.0-flash` → 1M 等）；默认 128K
4. **锚点保留**：始终保留
   - 第一条 `system` message（agent 身份和指令）
   - 第一条 `user` message（原始任务）
   - 最后一条 `user` message（最新指令）
5. **摘要中间部分**：将第一条和最后一条 user message 之间的所有内容序列化，并使用摘要 Prompt 发送给同一模型
6. **重建**：`[system, first_user, assistant(summary), last_user]`

如果不同的 user message 少于 2 条（没有中间部分可摘要），或 LLM 摘要调用失败（安全回退：返回原始 messages），则跳过压缩。

### 可观测性

每次压缩事件记录为：
- `tool_calls_collected` 中的 `_context_compression` 条目 → 在 Execution History 运行详情中可见
- 带有 `phase: "compression"` 的 `on_tool_call` 事件 → 在 Debug 面板中渲染为 `Context compressed (N messages → summary)`
- `context.compression` LLM trace 条目 → 在 Traces Tab 中可见，包含压缩前后的 token 估算

Agent 工具调用还会发出更丰富的可观测性数据：

- `tool_calls` 上的每次调用生命周期字段：`tool_call_id`、`status`（`success` / `error` / `pending` / `timeout` / `cancelled`）、`started_at`、`finished_at`、`elapsed_ms`
- agent 结果上的聚合 `tool_metrics`（按状态计数以及总/最大持续时间）；`_context_compression` 条目不计入这些计数
- 可选的 OpenTelemetry 子 span，名称为 `heym.agent.tool.execute`（参见 [OpenTelemetry Tracing](./opentelemetry.md)）
- 持久化的 LLM trace / execution-history `tool_calls` payload 会经过脱敏和大小限制；实时 HITL 恢复状态保留原始数据用于匹配

## Related

- [Why Heym](../getting-started/why-heym.md) – 跨 agent 生命周期的多 agent 编排
- [Agent Node](../nodes/agent-node.md) – 配置与参数
- [Agent Persistent Memory](./agent-persistent-memory.md) – 每个 agent 节点的知识图谱与对等共享
- [Human-in-the-Loop](./human-in-the-loop.md) – 审核链接、待处理 payload 与恢复行为
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow、节点与 Agent 工具 span
- [Node Types](./node-types.md) – Agent 及相关节点
- [Parallel Execution](./parallel-execution.md) – 基于 DAG 的并行执行与子 agent 并行执行
- [MCP Tab](../tabs/mcp-tab.md) – 配置 MCP 连接
- [Expression DSL](./expression-dsl.md) – 子 agent 的 `$input.text`
