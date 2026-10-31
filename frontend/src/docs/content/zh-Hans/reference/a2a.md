# A2A

Heym 通过 Agent2Agent 协议（A2A 1.0，JSON-RPC 绑定）提供 **Heym Agent** 服务。Heym Agent 是 [Chat 标签页](../tabs/chat-tab.md) 背后的核心引擎；MCP 客户端可以通过 `heym_chat` 工具访问相同的 agent（参见 [MCP / A2A 标签页](../tabs/mcp-tab.md)）。启用 A2A 后，其他 agent 可以通过自然语言向其发送 Task 并获取回复，享有与 Chat 完全相同的能力。

## 启用 A2A

1. 打开 **MCP / A2A** 标签页。
2. 在默认服务器或指定名称的服务器上开启 **Heym Agent**，并为其选择凭据与模型。
3. 勾选 **启用 A2A**。卡片将显示 **Agent Card** 的 URL 以及 **JSON-RPC Endpoint**。

A2A 依附于 Heym Agent：关闭该 agent 也会同时关闭 A2A。

## Endpoints

| | 默认服务器 | 指定名称的服务器 |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card 无需任何凭据，也不会列出任何用户、服务器或 Workflow 名称。它仅在 A2A 处于启用状态时存在：当至少有一位用户为默认服务器启用了 A2A 时域卡片生效；当指定服务器的 A2A 处于开启状态时该服务器的卡片生效。否则，该地址将响应 404。

## 认证

请以与 MCP 相同的形式发送凭据，且仅能在请求头中传递：

- `X-MCP-Key: <key>`：默认服务器的密钥或指定服务器的密钥
- `Authorization: Bearer <token>`：来自 Heym OAuth 服务器的 OAuth Token

URL 中携带的凭据将被拒绝。Agent Card 同时声明了这两种方案，A2A 客户端可以直接从卡片中读取它们。

## 方法列表

| 方法 | 功能说明 |
|---|---|
| `SendMessage` | 启动一个 Task，或继续等待输入的任务。等待回复，除非 `configuration.returnImmediately` 为 `true`。 |
| `SendStreamingMessage` | 相同功能，以 Server-Sent Events 事件流形式实时传输任务进展和最终结果。 |
| `GetTask` | 获取 Task 的状态、回复和历史记录（`historyLength` 可限制历史长度）。 |
| `ListTasks` | 查询您在该服务器上的任务列表，最新在前，支持按 `contextId` 或 `status` 过滤，配合 `pageSize` 和 `pageToken`。 |
| `CancelTask` | 停止仍在运行或处于等待中的 Task。 |
| `SubscribeToTask` | 订阅并追踪仍在运行中的 Task。 |
| `GetExtendedAgentCard` | 扩展卡片，包含服务器名称及其分配的 Workflows（作为技能展示）。 |

平台不提供推送通知：卡片声明 `pushNotifications: false`，调用推送方法将返回 `PushNotificationNotSupportedError`。所有请求必须遵循 A2A 1.0；请发送请求头 `A2A-Version: 1.0`。A2A 0.3 版本的方法名（如 `message/send`）将返回 `VersionNotSupportedError`。

## Tasks 与会话

每一个 Task 都是 Chat 标签页中的一次会话，并以网络图标标记。Task 的 `contextId` 对应于该会话：发送带有相同 `contextId` 且不带 `taskId` 的新消息即可继续该会话。

| Agent 执行结果 | Task 状态 |
|---|---|
| 已回复 | `TASK_STATE_COMPLETED`，回复为文本内容；若有保存内容，则将 Workflows 和评测套件链接作为数据附带 |
| 提出澄清问题 | `TASK_STATE_INPUT_REQUIRED`：使用相同的 `taskId` 回复 |
| 需要凭据 | `TASK_STATE_AUTH_REQUIRED`：状态信息包含指向 Heym 凭据页面的链接。用户在已登录 Heym 的浏览器中打开此链接并配置；凭据值绝不会流经另一个 agent。随后在同一 Task 上发送消息即可继续。 |
| 失败 | `TASK_STATE_FAILED`，附带失败原因 |
| 已取消 | `TASK_STATE_CANCELED` |

向已完成或仍在运行中的 Task 发送消息将被拒绝并返回 `UnsupportedOperationError`。消息支持 `text` 和 `data` 部分，两者总计最多 20,000 个字符；文件部分将被拒绝，请将文件作为链接发送。

## 进度更新

当 Task 执行时，事件流会为每个步骤发送状态更新，其用语与 Chat 标签页中完全一致，例如 `Running workflow "Invoice Parser"` 或 `Testing the workflow · attempt 2/5`。MCP 客户端从 `heym_chat` 获取相同的步骤作为 `notifications/progress`。

## 示例

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## 限制与注意事项

- `CancelTask` 会立即终止正在运行该轮次的 Heym 实例上的执行，与 Chat 标签页中的停止按钮行为完全一致。在其他节点上，该任务会被标记为已取消，且不再记录晚到的轮次结果。
- 不支持推送通知，不提供 REST 或 gRPC 绑定，不支持签名的 Agent Cards。

## 相关主题

- [MCP / A2A 标签页](../tabs/mcp-tab.md)：启用 Heym Agent 和 A2A
- [Chat 标签页](../tabs/chat-tab.md)：agent 背后的核心引擎
- [安全](./security.md)：密钥的存储与保护机制
