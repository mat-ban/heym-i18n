# Portal

**Portal** 将 Heym 工作流以公开聊天式 UI 的形式对外暴露。最终用户无需登录 Heym，即可通过 URL 运行工作流。

## 功能说明

- **公开 URL**：`/chat/{slug}`（例如 `/chat/my-workflow`）
- **聊天界面**：用户通过聊天 UI 进行交互（消息、输入、响应）
- **可选认证**：如果配置了 portal 用户，则需要登录；否则 portal 为公开访问
- **流式传输**：执行期间实时显示节点进度（启用时）
- **停止运行中的执行**：用户可在聊天页脚停止正在进行的 portal 运行；服务端也会取消当前活动的工作流执行
- **文件上传**：每个输入字段可选支持文件上传（文本、图片等）
- **人工审核交接**：当 Agent 暂停等待审批时，Portal 运行可展示 [HITL 审核链接](./human-in-the-loop.md)
- **图片显示**：包含图片的工作流输出（例如来自 LLM 图片生成或 Playwright 截图）会以缩略图形式显示在聊天中。点击任意图片可打开全屏查看器；按 **Esc** 或使用设备返回按钮关闭

## 工作流配置

| 设置 | 描述 |
|---------|-------------|
| `portal_enabled` | 为此工作流启用 portal |
| `portal_slug` | URL slug（例如 `my-workflow` → `/chat/my-workflow`） |
| `portal_stream_enabled` | 使用流式执行 |
| `portal_file_upload_enabled` | 允许文件上传 |
| `portal_file_config` | 按字段的文件配置（类型、限制） |

在编辑器中配置：工作流头部的 **Portal** 按钮可打开 portal 设置对话框。

## 流程

1. **信息**：`GET /api/portal/{slug}/info` – 返回工作流元数据和输入字段（无需认证）
2. **登录**（如需要）：`POST /api/portal/{slug}/login` – 返回会话 Token
3. **执行**：`POST /api/portal/{slug}/execute` – Portal 聊天 UI 调用此接口（启用时内部使用其流式变体）；最终用户通过聊天界面交互，而非直接调用 API。
4. **停止**：`POST /api/portal/{slug}/executions/{execution_id}/cancel` – 当用户在活动 portal 运行期间按下 **Stop** 时请求

## 并发限制

当工作流设置了[并发限制](./webhooks.md#concurrency-limit-and-queued-runs)且所有槽位均已被占用时，Portal 消息将排队等待轮到它，而不是立即运行。在运行开始之前，聊天界面的进度行会显示 **Waiting in queue (2/5)**，随后像往常一样显示回答。即使用户关闭页面，运行仍会继续执行。点击 **Stop** 会将等待中的运行从队列中移除。当队列已满时，消息将失败并提示 "Concurrency queue is full"。在队列中等待过的运行不会逐个 Token 地流式传输答案；整个答案将在运行完成时一次性显示。

## Portal 运行中的 HITL

如果 portal 工作流到达启用了 [Human-in-the-Loop](./human-in-the-loop.md) 的 [Agent 节点](../nodes/agent-node.md)，portal 响应会显示审核链接，而不是显示为空。

- 工作流执行状态变为 `pending`
- Portal 聊天显示审核 URL
- 任何连接到 Agent `review` 输出句柄的节点都可以立即通知 Slack、邮件或其他渠道
- 审核者在 `/review/{token}` 上完成决策，无需登录
- 审核完成后，工作流从存储的快照恢复

这使得将公开聊天流程与私有的人工审批步骤相结合成为可能。

## 输入字段

输入字段来自 [Input](../nodes/input-node.md) 节点。API 提取类型为 `textInput` 的起始节点及其 `inputFields`。执行使用与普通运行相同的引擎；输入作为 `body.inputs` 和 `conversation_history` 传递，用于多轮流程。

## 认证与会话

- **WorkflowPortalUser**：每个工作流的用户名/密码（启用认证时）
- **删除最后一个用户**：在启用门户的情况下，删除最后一个门户用户将使门户重新变为公开状态；设置对话框会首先请求确认
- **PortalSession**：会话 Token，TTL 为 168 小时
- **速率限制**：3 次登录失败 → 按工作流+IP 封禁 24 小时
- 过期会话由 Cron 任务清理

## 配置 UI

**WebPortalSettingsDialog** 选项卡：

1. **General**：启用 portal、设置 slug、复制 portal URL
2. **Users**：添加/移除 portal 用户（用户名/密码）
3. **Options**：流式模式、文件上传、查看输入字段

## 相关

- [Why Heym](../getting-started/why-heym.md) – Portal 作为生产环境中 Agent 的聊天界面
- [Workflows Tab](../tabs/workflows-tab.md) – 创建工作流并启用 portal
- [Human-in-the-Loop](./human-in-the-loop.md) – 待处理 Agent 输出的公开审核页面
- [Triggers](./triggers.md) – Portal 作为入口点
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) 用于 portal 输入
- [Workflow Structure](./workflow-structure.md) – 节点与边
