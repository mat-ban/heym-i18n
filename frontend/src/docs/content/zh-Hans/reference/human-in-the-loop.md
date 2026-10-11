# Human-in-the-Loop

Human-in-the-loop (HITL) 允许 [Agent 节点](../nodes/agent-node.md) 在特定时刻请求审批，等待人工决策，然后从同一执行快照继续运行 Workflow。

## 功能概述

- 为 Agent 添加显式审批检查点，无需构建单独的审批 Workflow
- 在 `/review/{token}` 创建一次性公开审核 URL
- 允许审核者选择 `Accept`、`Edit & Continue` 或 `Refuse`
- 在决策到达之前，将执行标记为 `pending`
- 审批通过后恢复暂停的执行，让 Agent 继续运行
- 支持在同一 Agent 运行中设置多个顺序 HITL 检查点

## Agent 配置

在 Agent 属性面板中启用 HITL。

| 设置项 | 说明 |
|---------|-------------|
| `hitlEnabled` | 为此 Agent 开启人工审核 |
| `hitlSummary` | 审批准则，说明 Agent 应在何时请求人工审核 |

HITL 会为 Agent 添加一个 `request_human_review` 工具。通过系统 Prompt 和 `hitlSummary` 准则告知 Agent 哪些操作需要审批。当 Agent 判断某个检查点需要审核时，它会向人工发送一段 Markdown 审核文本。面向审核者的摘要由 Agent 在运行时的请求生成；如果 Agent 未提供，Heym 会从 Markdown 正文中推导一个。在 v1 中，HITL 仅支持文本模式的 Agent 输出，因此不能与 `jsonOutputEnabled` 同时使用。

对于 MCP 工具，Heym 要求模型将书面的 HITL 指令解释为以下三种审批范围之一：

- `always`，对应“always”、“on each”或“for each”等表述
- `once`，对应“once”或“only one time”等表述
- `never`，对应“never”、“do not ask”或“already approved”等表述

该解释决定了重复的 MCP 调用是再次暂停、保持已审批状态，还是完全跳过人工审核。

启用 HITL 后，Agent 还会暴露第二个画布输出句柄，标记为 `review`。使用该分支将待处理的审核 URL 和摘要发送到 Slack、邮件、日志或任何其他通知流程，同时主执行等待人工响应。

## 审核流程

1. Agent 到达需要审批的步骤，调用 `request_human_review`
2. Heym 创建公开审核请求并返回审核 URL
3. 连接到 Agent `review` 句柄的任何节点立即运行，携带待处理的 HITL Payload
4. Workflow 执行转为 `pending` 状态
5. 审核者无需登录即可打开 `/review/{token}`
6. 审核者选择一项操作：
   - `Accept` 使用原始 Markdown 继续
   - `Edit & Continue` 使用编辑后的 Markdown 继续
   - `Refuse` 以 `decision: "refused"` 继续，并跳过后续 Agent 操作
7. Heym 从存储的快照恢复 Workflow，让 Agent 基于已批准的 Markdown 上下文继续运行
8. 如果后续步骤也需要审批，Agent 可以再次调用 HITL 并创建另一个待处理检查点

如果无人响应，审核链接将在 168 小时后过期。

## 公开审核页面

公开审核页面显示：

- Workflow 名称和 Agent 标签
- 根据 Agent 审核请求自动生成的审核者摘要
- Markdown 审核文本作为主要内容优先展示
- 仅在审核者点击 `Edit` 后展开的编辑框
- 编辑时的实时 Markdown 预览
- `Accept`、`Edit & Continue` 和 `Refuse` 操作按钮

一旦提交决策，Token 即被锁定，无法重复使用。

## 输出与执行状态

等待审核期间，Agent 输出包含待处理的 Payload：

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

审核者响应且 Workflow 恢复后，最终 Agent 输出包含决策元数据：

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

在下游节点中使用 `$agentLabel.decision` 根据 accepted、edited 或 refused 结果进行分支。

## 画布审核分支

`review` 输出句柄仅在 Agent 启用 `hitlEnabled` 时可用。

- 它在人工决策到达之前运行
- 它接收待处理的 HITL Payload，包括 `summary`、`draftText`、`reviewUrl`、`shareText` 和 `shareMarkdown`
- 它适用于通知或交接步骤，例如 Slack、邮件或审计日志
- 每个 HITL 检查点运行一次
- 审核者响应后不会再次运行；恢复时仅正常的 Agent 输出路径继续执行

## 出现位置

- [Execution History](./execution-history.md) 会立即显示 `pending` 运行，并将审核 URL 存储在节点结果中
- [Portal](./portal.md) 聊天响应会显示人工审核链接，而非空白回答
- Debug 面板和历史对话框会显示最终的 HITL 决策及审核后的文本
- 即使 Workflow 由 cron、curl 或 portal 流量触发，审核输出句柄仍可通知外部渠道
- 多个 HITL 检查点复用同一条执行历史记录，同时为每次暂停创建新的一次性审核链接

## 当前限制

- HITL 仅适用于 Agent 节点
- HITL 使用 Agent 的文本输出，v1 不支持 JSON 输出
- 暂停的执行从存储的 Workflow 快照恢复，而非最新编辑的 Workflow 版本
- 嵌套子 Workflow 在 v1 中无法进入 pending HITL 状态；请在调用它们之前从父 Agent 请求审核

## 相关内容

- [Agent Node](../nodes/agent-node.md) - 在 Agent 上配置 HITL
- [Agent Architecture](./agent-architecture.md) - Agent、工具、子 Agent 与 HITL 如何协同工作
- [Execution History](./execution-history.md) - 查看 pending 和已恢复的运行
- [Board](../tabs/board-tab.md) - Board 链式运行在 HITL 时会将卡片暂停为 pending（琥珀色）状态
- [Portal](./portal.md) - 公开聊天流程与 HITL 审核链接
