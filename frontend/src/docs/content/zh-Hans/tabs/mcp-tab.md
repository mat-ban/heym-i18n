# MCP Tab

**MCP** 标签页用于配置 Model Context Protocol (MCP) 集成。MCP 允许 AI 客户端（Claude、Cursor 以及任何兼容 MCP 的工具）将您的 Heym workflow 作为工具进行调用。

Heym 支持两种模式：**默认服务器**，在单一 endpoint 下暴露所有启用了 MCP 的 workflow；以及**命名服务器**，为每个逻辑 workflow 分组提供专属 URL 和 API key。

两种模式均可暴露两类工具：独立的 **workflow**，以及 **Heym chat 工具**——将整个 [Chat 标签页](./chat-tab.md)引擎封装在单个 `heym_chat` 工具之后。

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ 观看 MCP 演示</a></p>

## 默认 MCP 服务器

默认服务器始终可通过 `{origin}/api/mcp/sse` 访问。所有开启了 MCP 开关的 workflow 都会在此处作为工具出现。

### MCP API Key

- Key 以 SHA-256 摘要形式存储，因此 Heym 无法向您展示已有的 key。该标签页仅报告是否已设置，而不会显示具体内容。
- **Generate** / **Regenerate** – 新 key 仅在创建后显示一次。请务必在此时复制；重新加载标签页后它将永久隐藏。
- 在将 Claude Desktop、Cursor 或其他 MCP 客户端连接到 Heym 时使用此 key
- 丢失了 key？重新生成即可。之前的 key 会立即失效。

### 连接方式

- **API Key** – 使用 MCP API key 进行程序化连接。该标签页可复制一份即用型 JSON 配置，并提供 **Add to Cursor** 按钮以实现一键 Cursor 设置。
- **Claude** – 该标签页显示 MCP 服务器 URL 以及 Claude 的设置步骤。将 OAuth Client ID 和 Secret 留空；Claude 会自动注册并通过 Heym OAuth 进行身份验证。

### Workflow MCP 开关

每个 workflow 均可作为 MCP 工具暴露：

- **Enable** – 该 workflow 的工具将对所有连接到默认服务器的客户端可用
- **Disable** – 该 workflow 不会被暴露

Workflow 卡片会显示描述以及输入字段名称的预览，以便您在启用前了解每个工具的预期输入。

## Heym Chat 工具

**Heym Capabilities** 部分将 Chat 标签页引擎转换为名为 `heym_chat` 的单个 MCP 工具。您可以在默认服务器、任意命名服务器或两者上启用它——每个界面都保留各自的开关和模型选择。

启用后，`heym_chat` 会与您的 workflow 工具一同出现在 `tools/list` 中。MCP 客户端发送一条自然语言消息，Heym 引擎便会接管后续处理，具备与 Chat 标签页相同的能力：

- 通过 Workflow AI Builder 构建、编辑、检查并运行 workflow
- 报告分析数据、近期执行记录以及即将到来的 cron 计划
- 报告单个 workflow 的运行历史：运行次数、状态计数、运行时间，并可按需提供单次运行的输入、输出以及各节点错误
- 报告当前正在运行的内容：活跃执行数量、其 workflow 名称、各自已运行时长、当前所在节点，以及实时运行的链接
- 在 [Board 标签页](./board-tab.md)上列出看板、创建卡片并读取卡片详情
- 列出您的数据表及其列，创建新表，并将其接入它所构建的 workflow 中
- 读取团队和全局变量，并搜索文档
- 批准、编辑或拒绝待处理的人工介入审核

后续添加到 Chat 标签页的能力会自动通过 `heym_chat` 可用——无需逐项同步开关。

凭证保留在 UI 中：`heym_chat` 从不列出、选择或创建凭证。当它构建或编辑 workflow 时，需要凭证的新节点会留空，并在回复中指明这些节点，以便您在编辑器中设置。

数据表则不同。表不包含任何机密信息，因此 `heym_chat` 可以列出您的表、询问 workflow 应使用哪张表，并创建带有列的新表。它从不读取或写入行数据。

### 凭证与模型

`heym_chat` 在您的 Heym 账户上运行引擎，因此需要自己的 LLM 凭证：

| 字段 | 行为 |
|-------|----------|
| **Credential** | 选择任何您可访问的 OpenAI、Google 或 Custom 凭证。当您尚未选择时，会从 [Settings](../reference/user-settings.md) 中的首选凭证预填。 |
| **Model** | 从所选凭证加载。当凭证匹配时，会从您的首选模型预填。 |

如果任一缺失，该工具仍会出现在 `tools/list` 中，但每次调用都会返回错误，提示您在此标签页中完成设置。

### 参数与历史记录

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `message` | 是 | 以自然语言给出的指令或问题。 |
| `conversation_id` | 否 | 来自先前 `heym_chat` 结果的 `conversation_id`，用于继续该对话线程。 |

每次调用都会作为普通对话写入您的 [Chat 标签页](./chat-tab.md)历史记录，并在对话列表中标记为插头图标。消息、工具卡片和澄清暂停看起来与您自己发起的对话完全一致，您可以打开该线程并在浏览器中继续对话。每个结果都会返回其 `conversation_id`，以便 MCP 客户端继续同一线程，而不是在每次调用时打开新线程。

当助手需要澄清时，它会暂停并说明；请使用相同的 `conversation_id` 回复答案。

## 命名 MCP Servers

命名服务器让您可以将 workflows 划分为相互隔离的 MCP endpoints。每个服务器拥有自己的 URL 和 API key，因此不同的 AI 客户端、团队或用例可以精确连接到所需的 workflows。

### 创建命名服务器

1. 在 MCP 标签页底部的输入框中输入名称（例如 **CRM Tools**）
2. 点击 **Create** — 新的服务器卡片会立即出现
3. 点击卡片将其展开

### 各服务器设置

每个服务器卡片显示：

| 设置 | 描述 |
|---------|-------------|
| **SSE Endpoint** | 唯一 URL：`{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | 独立密钥，在生成或重新生成时仅显示一次。请立即复制；密钥以哈希形式存储，之后无法再次查看 |
| **How to connect** | **Copy JSON** 复制可直接粘贴的 MCP 配置；**Add to Cursor** 一键安装 |
| **Heym Capabilities** | 为此服务器切换 `heym_chat` 工具，并选择其凭据和模型 |
| **Assigned Workflows** | 切换此服务器暴露哪些 workflows |

### Workflow 分配

Workflow 分配是按服务器进行的，独立于默认服务器的切换。一个 workflow 可以同时在默认服务器和多个命名服务器上启用，也可以全部不启用。

切换 workflow 会将其移动到已分配列表的顶部，因此您刚刚更改的行会保持可见，而不会滚动消失。

### 身份验证

命名服务器支持与默认服务器相同的身份验证方法：

- **X-MCP-Key header** – 直接传递服务器的 API key（API 客户端、Cursor）。仅限 header：密钥不接受作为 `?key=` 查询参数，因为 URL 会出现在访问日志、代理日志和浏览器历史记录中。
- **Claude OAuth** – 将服务器 URL 添加到 Claude 集成中；将凭据留空，Claude 会通过 OAuth 自动注册。bearer token 必须通过 `Authorization` header 传递，而非 `?token=`。
- **Session token** – 在 SSE 握手期间签发；作用域限定于特定服务器，因此来自一个命名服务器的 token 无法访问另一个。这个短生命周期的 `?session=` 参数不受影响。

### 删除命名服务器

点击服务器卡片标题上的 **X** 图标。删除操作会移除该服务器及其所有 workflow 分配；workflows 本身不受影响。

## SSE Endpoint

| 服务器 | Endpoint |
|--------|----------|
| 默认 | `{origin}/api/mcp/sse` |
| 命名 | `{origin}/api/mcp/servers/{server-uuid}/sse` |

两个 endpoints 均支持 SSE 传输（GET，MCP 规范 2024-11-05）和 Streamable HTTP 传输（POST，MCP 规范 2025-03-26）。Claude 在两者上均使用 OAuth 2.1 / PKCE 进行安全登录。

## 相关

- [Why Heym](../getting-started/why-heym.md) – MCP 作为 Heym 中的一等原语
- [Agent Node](../nodes/agent-node.md) – 支持 MCP 工具的 Agent 节点
- [Agent Architecture](../reference/agent-architecture.md) – MCP 客户端、工具分发、编排器
- [Triggers](../reference/triggers.md) – MCP 作为 workflow 入口点
- [Chat Tab](./chat-tab.md) – `heym_chat` 工具背后的引擎
- [Workflows Tab](./workflows-tab.md) – 创建和管理 workflows
- [Node Types](../reference/node-types.md) – AI 节点概览
- [Contextual Showcase](../reference/contextual-showcase.md) – 仪表板界面的紧凑页面指南
