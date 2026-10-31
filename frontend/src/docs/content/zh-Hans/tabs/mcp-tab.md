# MCP / A2A Tab

**MCP** 标签页用于配置 Model Context Protocol (MCP) 集成。MCP 允许 AI 客户端（Claude、ChatGPT、Gemini、Cursor 以及任何兼容 MCP 的工具）将您的 Heym workflow 作为工具进行调用。，并作为其他智能体可以委托任务的 [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) 服务器。

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
- **ChatGPT** – 该标签页会显示适用于 ChatGPT 应用的 MCP 服务器 URL 和设置步骤。开启开发者模式（Developer mode），使用该 URL 创建应用并选择 OAuth；ChatGPT 会自动完成注册。
- **Gemini** – 该标签页会显示适用于 Gemini 自定义应用的 MCP 服务器 URL 和设置步骤：在 gemini.google.com 中依次打开 **Settings → Connected Apps → Add a custom app**，粘贴 URL 并保持 **Advanced features** 关闭；Gemini 会自动注册并通过 Heym OAuth 进行身份验证。连接后，Heym 也可在 Gemini 移动应用中使用。

### Workflow MCP 开关

每个 workflow 均可作为 MCP 工具暴露：

- **Enable** – 该 workflow 的工具将对所有连接到默认服务器的客户端可用
- **Disable** – 该 workflow 不会被暴露

Workflow 卡片会显示描述以及输入字段名称的预览，以便您在启用前了解每个工具的预期输入。


### 排队运行与 heym_execution_status

具有[并发限制](../reference/webhooks.md#concurrency-limit-and-queued-runs)的 workflow 在客户端调用时可能处于繁忙状态。调用将立即返回非错误的结果：

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

客户端使用该 `execution_id` 轮询 `heym_execution_status` 工具。它返回与[状态 URL](../reference/webhooks.md#status-url)相同的响应体：带有当前位置的 `queued`、`running`，随后是带有输出的 `success` 或 `error`。它仅能查找由同一服务器公开的 workflow 运行。该工具仅在默认服务器和每个命名服务器上至少有一个 workflow 设置了并发限制时才会列出。当 workflow 的队列已满时，调用将返回错误 "Concurrency queue is full"。
## Heym Agent

**Heym Capabilities** 部分将 Chat 标签页引擎转换为名为 `heym_chat` 的单个 MCP 工具。您可以在默认服务器、任意命名服务器或两者上启用它——每个界面都保留各自的开关和模型选择。

启用后，`heym_chat` 会与您的 workflow 工具一同出现在 `tools/list` 中。MCP 客户端发送一条自然语言消息，Heym 引擎便会接管后续处理，具备与 Chat 标签页相同的能力：

- 构建 workflow，使用示例输入进行测试运行，修复问题，并在运行通过时完成（参见[构建模式](#build-mode)）
- 检查并运行您现有的 workflow
- 报告分析数据、近期执行记录以及即将到来的 cron 计划
- 说明 workflow 在何处失败以及为何缓慢：运行最多、失败最多和最慢的 workflow，以及在过去 1、3 或 6 小时、24 小时、7 或 30 天或所有时间内耗时最多、错误最多和调用最多的节点类型
- 报告单个 workflow 的运行历史：运行次数、状态计数、运行时间，并可按需提供单次运行的输入、输出以及各节点错误
- 报告当前正在运行的内容：活跃执行数量、其 workflow 名称、各自已运行时长、当前所在节点，以及实时运行的链接
- 在 [Board 标签页](./board-tab.md)上列出看板、创建卡片并读取卡片详情
- 列出仪表板（Heym Work 页面）及其组件，查找 workflow 所在的仪表板，添加新组件并构建其 workflow，将现有 workflow 作为组件放置，重命名或删除组件，或整理布局（参见 [Dashboard › 从 Chat 和 MCP](./dashboard-tab.md#from-chat-and-mcp)）
- 检查数据表和行，创建数据表，添加或删除列，插入、更新或删除行，并将数据表接入 workflow
- 创建、编辑和运行提示词与智能体评估套件（[Eval suites](./evals-tab.md#from-chat-and-mcp)），包括智能体的基线：报告的、从运行中构建的或以数值指定的。结果列出调用中保存的每个套件的 Evals 链接。
- 在 Heym 专属页面上创建或更新您的凭据（参见[凭据](#凭据))
- 读取团队和全局变量，并搜索文档
- 批准、编辑或拒绝待处理的人工介入审核

后续添加到 Chat 标签页的能力会自动通过 `heym_chat` 可用——无需逐项同步开关。

这些功能在 `heym_chat` 内部运行：`tools/list` 仅显示 `heym_chat` 和您的 workflow 工具，从不显示聊天内部工具（例如评估套件工具）。

### 构建模式

`heym_chat` 始终以构建模式（build mode）运行 Chat 引擎。在单次调用中，助手可以保存新 workflow、使用真实的示例输入运行它、读取运行报告、修复失败之处并再次运行，每次调用最多可进行五次测试运行。当最新保存版本的最新一次运行通过时，它会以一句话总结收尾，且回复以 `Verified: the latest test run of the saved workflow passed.` 结束。

当调用创建或编辑 workflow 时，回复会列出每个 workflow 及其完整的编辑器链接（例如 `https://heym.example.com/workflows/<id>`），助手回答中的链接也是完整链接。它们使用您配置的 Heym 地址（`FRONTEND_URL`），已登录 Heym 且有权访问该 workflow 的用户均可打开。

- 测试运行是真实的运行。它们的副作用会实际发生，并且会像其他运行一样出现在 workflow 的运行历史记录中。
- 保存操作遵循编辑器的路径：对图结构的更改会将先前的图保留在 workflow 的编辑历史（**Edit History**）中。
- 若要修改其先前构建的 workflow，请使用相同的 `conversation_id` 继续该对话线程。助手会更新该 workflow 而不是新建一个，并且仅会修改您有权编辑的 workflow。
- 当五次测试运行用尽时，助手会停止并说明仍然失败的原因。

`heym_chat` 可以检查您的数据表和行，创建表，添加或删除列，以及插入、更新或删除行。为其提供表名、UUID 或 DataTable 链接，例如：“向 https://heym.example/?tab=datatable/<table-id> 添加两列字符串：姓名”。它直接修改表，并在添加列时保留现有列和值。

`heym_chat` 可以检查您的数据表和行，创建表，添加或删除列，以及插入、更新或删除行。为其提供表名、UUID 或 DataTable 链接，例如：“向 https://heym.example/?tab=datatable/<table-id> 添加两列字符串：姓名”。它直接修改表，并在添加列时保留现有列和值。

写入操作需要所有权或通过直接/团队共享获得的**写入**权限。只读访问允许检查。行写入遵循 DataTable 标签页的类型、默认值、必填和唯一性检查；部分导入会报告被拒绝的行。删除列会从每行中清除其对应的值。与 DataTable 标签页一样，删除列和清空所有行需要先确认；使用相同的 `conversation_id` 进行回复以确认。删除选定行无需额外确认。


### 凭据

`heym_chat` 与 Chat 标签页一样，按名称和类型查看您拥有的凭据以及与您共享的凭据。当它构建的 workflow 需要凭据时，会在结果中以提问的方式询问使用哪一个。请使用相同的 `conversation_id` 进行回复。

要添加凭据或更新您拥有的凭据，助手会在 Heym 页面 `/credentials/setup/<id>` 上打开凭据表单。您在该页面登录 Heym，输入密钥或连接账户，然后保存。该值直接存入 Heym：MCP 客户端及其模型只能获知凭据的名称和类型。切勿将密钥粘贴到 MCP 客户端中，请改为主动作出表单请求。

| 客户端 | 处理方式 |
|--------|----------|
| 支持 MCP URL 引导弹出 | 客户端会提示您打开 Heym 页面。调用会等待您填写表单（最多十分钟），然后使用新凭据继续。 |
| 其他客户端 | 结果中附带链接并提示客户端携带 `wait_for_credential_form` 再次调用 `heym_chat`。该调用在您填写表单时最多等待五分钟，然后恢复对话。如果客户端没有等待，请保存表单并使用相同的 `conversation_id` 回复；下一次调用将获知表单已保存并使用了哪个凭据。 |

该页面仅针对发起请求的 Heym 账户打开，因此转发的链接对其他任何人无效。表单有效期为 24 小时，您也可以在页面上拒绝。一旦您保存或拒绝，Chat 标签页对话中的相应步骤就会显示结果。


### 凭证与模型

`heym_chat` 在您的 Heym 账户上运行引擎，因此需要自己的 LLM 凭证：

| 字段 | 行为 |
|-------|----------|
| **Credential** | 选择任何您可访问的 OpenAI、Google 或 Custom 凭证。当您尚未选择时，会从 [Settings](../reference/user-settings.md) 中的首选凭证预填。 |
| **Model** | 从所选凭证加载。当凭证匹配时，会从您的首选模型预填。 |

如果任一缺失，该工具仍会出现在 `tools/list` 中，但每次调用都会返回错误，提示您在此标签页中完成设置。


`heym_chat` 构建的 workflow 中的 LLM 和 Agent 节点在此凭据和模型上运行（包括与您共享的凭据），因此无需其他设置步骤即可直接进行测试运行。当 `heym_chat` 编辑 workflow 时，已有凭据的 LLM 和 Agent 节点将保留原有凭据及其模型。
### 参数与历史记录

| 参数 | 必填 | 描述 |
|----------|----------|-------------|
| `message` | 是 | 以自然语言给出的指令或问题。 |
| `conversation_id` | 否 | 来自先前 `heym_chat` 结果的 `conversation_id`，用于继续该对话线程。 |
| `wait_for_credential_form` | 否 | 配合 `conversation_id`：等待用户保存或拒绝该线程打开的凭据表单，然后发送 `message`。 |

每次调用都会作为普通对话写入您的 [Chat 标签页](./chat-tab.md)历史记录，并在对话列表中标记为插头图标。消息、工具卡片和澄清暂停看起来与您自己发起的对话完全一致，您可以打开该线程并在浏览器中继续对话。每个结果都会返回其 `conversation_id`，以便 MCP 客户端继续同一线程，而不是在每次调用时打开新线程。

当助手需要澄清时，它会暂停并说明；请使用相同的 `conversation_id` 回复答案。

### 启用 A2A

当 Heym Agent 开启时，卡片上会显示 **启用 A2A** 复选框。勾选后，其他智能体可以通过 Agent2Agent 协议 (A2A 1.0) 向 Heym Agent 发送任务。卡片随后会列出 **Agent Card** URL 和 **JSON-RPC endpoint**（各配有复制按钮），以及获取卡片的 `curl` 命令。A2A 使用与 MCP 相同的密钥和 OAuth 登录凭据。关闭智能体也会同时关闭 A2A。有关方法、任务状态和示例，请参阅 [A2A](../reference/a2a.md)。

### 进度

较长时间的 `heym_chat` 调用会以 MCP 进度通知 (`notifications/progress`) 形式报告智能体的操作，使用 Chat 标签页中显示的文本，例如 `正在测试 workflow · 尝试 2/5`。在收到进度通知时重置超时的客户端会在智能体工作期间继续等待。

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
| **Heym Capabilities** | 为此服务器切换 Heym Agent (`heym_chat`) 工具，并选择其凭据和模型 |
| **启用 A2A** | 此服务器专属的 A2A 开关，在 `{origin}/api/a2a/servers/{uuid}/agent-card.json` 拥有独立的 Agent Card |
| **启用 A2A** | 此服务器专属的 A2A 开关，在 `{origin}/api/a2a/servers/{uuid}/agent-card.json` 拥有独立的 Agent Card |
| **Assigned Workflows** | 切换此服务器暴露哪些 workflows |

### Workflow 分配

Workflow 分配是按服务器进行的，独立于默认服务器的切换。一个 workflow 可以同时在默认服务器和多个命名服务器上启用，也可以全部不启用。

切换 workflow 会将其移动到已分配列表的顶部，因此您刚刚更改的行会保持可见，而不会滚动消失。

### 身份验证

命名服务器支持与默认服务器相同的身份验证方法：

- **X-MCP-Key header** – 直接传递服务器的 API key（API 客户端、Cursor）。仅限 header：密钥不接受作为 `?key=` 查询参数，因为 URL 会出现在访问日志、代理日志和浏览器历史记录中。
- **Claude、ChatGPT 和 Gemini OAuth** – 将服务器 URL 添加到客户端的连接器或自定义应用中；将凭据留空，客户端会通过 OAuth 自动注册。bearer token 必须通过 `Authorization` header 传递，而非 `?token=`。
- **Session token** – 在 SSE 握手期间签发；作用域限定于特定服务器，因此来自一个命名服务器的 token 无法访问另一个。这个短生命周期的 `?session=` 参数不受影响。

### 删除命名服务器

点击服务器卡片标题上的 **X** 图标。删除操作会移除该服务器及其所有 workflow 分配；workflows 本身不受影响。

## SSE Endpoint

| 服务器 | Endpoint |
|--------|----------|
| 默认 | `{origin}/api/mcp/sse` |
| 命名 | `{origin}/api/mcp/servers/{server-uuid}/sse` |

两个 endpoints 均支持 SSE 传输（GET，MCP 规范 2024-11-05）和 Streamable HTTP 传输（POST，MCP 规范 2025-03-26）。Claude、ChatGPT 和 Gemini 在两者上均使用 OAuth 2.1 / PKCE 进行安全登录。

## 相关

- [Why Heym](../getting-started/why-heym.md) – MCP 作为 Heym 中的一等原语
- [Agent Node](../nodes/agent-node.md) – 支持 MCP 工具的 Agent 节点
- [Agent Architecture](../reference/agent-architecture.md) – MCP 客户端、工具分发、编排器
- [Triggers](../reference/triggers.md) – MCP 作为 workflow 入口点
- [Chat Tab](./chat-tab.md) – `heym_chat` 工具背后的引擎
- [Workflows Tab](./workflows-tab.md) – 创建和管理 workflows
- [Node Types](../reference/node-types.md) – AI 节点概览
- [Contextual Showcase](../reference/contextual-showcase.md) – 仪表板界面的紧凑页面指南