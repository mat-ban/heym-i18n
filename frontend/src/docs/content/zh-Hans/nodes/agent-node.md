# Agent 节点

**AI Agent** 节点是一个具备工具调用能力的 LLM 节点。它可以运行 Python 工具、将已连接的画布节点作为工具调用、连接 MCP 服务器、使用技能，可选地充当编排器将任务委派给其他 agent 节点、将其他工作流作为工具调用，并暂停以进行[人工审核](../reference/human-in-the-loop.md)。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1，当启用 HITL 时额外提供一个可选的 `review` |
| 输出 | `$nodeLabel.text`、`$nodeLabel.fieldName`（启用 JSON 输出时），或等待审核期间的待处理 HITL Payload |

## 核心参数

### 凭证与模型

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自设置中的 LLM 凭证（API key） |
| `model` | string | 模型名称（例如 `gpt-4o`、`gemini-2.5-flash-lite`） |
| `fallbackCredentialId` | UUID（可选） | 主凭证失败时使用的备用凭证 |
| `fallbackModel` | string（可选） | 主模型失败时使用的备用模型 |

在 [Credentials](../tabs/credentials-tab.md) 标签页中添加凭证。模型列表从所选凭证中加载。如果主凭证或模型返回错误，节点会在失败前自动使用备用凭证和模型重试。

### Prompt

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `systemInstruction` | string | 用于 AI 的系统 Prompt。支持[表达式](../reference/expression-dsl.md)。 |
| `userMessage` | string | 用户消息/Prompt。默认值：`$input.text` |
| `jsonOutputEnabled` | boolean | 结构化 JSON 输出 |
| `jsonOutputSchema` | string | 用于结构化输出的 JSON Schema |
| `extraBodyEnabled` | boolean | 发送提供商特定的请求参数（默认：`false`） |
| `extraBody` | string | 合并到 agent 发起的每次 API 请求中的 JSON 对象 |

使用 `$input.text`、`$nodeName.field` 以及其他 [Expression DSL](../reference/expression-dsl.md) 语法。

### 推理模型（o1、o3）

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0（默认：0.7），用于标准模型 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | 推理模型的推理深度 |

使用推理模型（例如 o1、o3）时，UI 会显示 **Reasoning Effort** 而非 Temperature。对于标准模型，**Temperature** 控制创造性。

**JSON 输出示例：** 当你需要从 agent 获取结构化数据时（例如分类、提取），启用 JSON 输出并提供 schema。agent 会返回符合 schema 的 JSON；可通过节点输出上的字段名访问各字段：

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

下游节点可以使用 `$agentLabel.status`、`$agentLabel.reason` 等。行为与 [LLM 节点](../nodes/llm-node.md) 的 JSON 输出相同。

## 人工审核（HITL）

当 agent 在执行重要操作前需要在特定时刻获得批准时，请使用 HITL。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `hitlEnabled` | boolean | 为 agent 添加人工审核检查点 |
| `hitlSummary` | string | 审批指南，告知 agent 何时需要人工审核 |

启用 HITL 后，agent 会收到一个 `request_human_review` 工具。使用系统 Prompt 和此指南字段来说明哪些工具调用、子 agent、子工作流、MCP 操作、技能或副作用需要审批。agent 仅在需要时调用该工具，一次运行中可多次调用。

面向审核者的公开页面摘要会在运行时根据 agent 的审核请求生成。如果 agent 未显式提供摘要，Heym 会从 Markdown 审核正文中推导出一个摘要。

对于 MCP 工具，Heym 会要求模型将你编写的 HITL 指令解释为三种范围之一：`always`、`once` 或 `never`。这意味着诸如“每次调用”、“仅一次”或“从不询问”之类的自由措辞会在运行时门控应用之前被规范化。

每个 HITL 检查点都会在 `/review/{token}` 创建一个一次性公开审核链接。审核者可以：

- **Accept**（接受）原始 Markdown 审核文本
- **Edit & Continue**（编辑并继续）使用修改后的 Markdown
- **Refuse**（拒绝）并以 `text: ""` 继续

启用 HITL 后，节点还会在画布上暴露一个 `review` 输出句柄。如果你希望在运行暂停时立即将审核 URL 和摘要广播出去，可将该分支连接到 Slack、电子邮件或其他通知节点。

执行会进入 `pending` 状态，直到审核者响应。审核文本是单个 Markdown 正文，待处理 Payload 还包含用于外部交接的可分享链接文本。`review` 分支上的节点会在暂停创建时立即运行；正常输出路径仅在批准后继续。批准后，Heym 会从存储的执行快照恢复，agent 使用已批准的上下文继续执行。如果后续步骤也需要批准，agent 可以创建另一个 HITL 检查点。有关 Payload 结构、审核 URL 行为和恢复语义，请参阅 [Human-in-the-Loop](../reference/human-in-the-loop.md)。

HITL 仅适用于文本模式的 agent 输出。在 v1 中，它不能与 `jsonOutputEnabled` 组合使用。
## Orchestrator 模式

启用后，Agent 可以将任务委派给 Workflow 中的其他 Agent 节点。如果 **Orchestrator 模式被禁用**，Agent **无法在画布中创建 Agent→Agent 连接**。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `isOrchestrator` | boolean | 当为 `true` 时，Agent 获得一个 `call_sub_agent` 工具 |
| `subAgentLabels` | string[] | 此 Orchestrator 可以调用的 Agent 节点的标签 |

**Sub-agent** 必须在其 User Message 中使用 `$input.text`，以便接收 Orchestrator 的 Prompt。

当 Orchestrator 在单次轮次中调用多个 Sub-agent 时，它们会并行执行。详见 [Agent 架构](../reference/agent-architecture.md)。

## Sub-Workflow

配置后，Agent 会获得一个 `call_sub_workflow` 工具，用于执行其他 Workflow。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | 此 Agent 可以作为工具调用的 Workflow 的 ID |

在 Agent 配置的 Sub-Workflows 区域中选择 Workflow。Agent 将通过 `workflow_id` 和 `inputs`（与目标 Workflow 输入字段匹配的对象）来调用它们。最大深度：5 层嵌套 Sub-Workflow 调用。

## 画布节点工具

你可以将受支持的 Workflow 节点连接到 Agent 的 **tools** 句柄，使 Agent 能够在运行时调用该节点。这样无需编写 Python 即可将现有的画布操作和转换变为可调用的工具。

当你希望由 Agent 决定何时运行某个已配置的节点，同时仍将凭证、静态字段和 Workflow 特定设置保留在节点 UI 中时，请使用画布节点工具。

### Agent 提供的字段

已连接工具节点上的字段可以标记机器人图标。被标记的字段将成为 Agent 在调用该节点时必须提供的必填工具参数。未标记的字段保持固定，从节点配置中读取。

例如：

- 将 Slack 节点作为工具连接到 Agent
- 在 Slack 节点中固定凭证
- 将 `message` 标记为 Agent 提供
- Agent 获得一个 Slack 工具，在运行时仅需提供消息内容

如果节点未作为工具连接到 Agent，机器人图标将被隐藏，该节点将像普通 Workflow 步骤一样运行。

### 运行时行为

当 Agent 调用画布节点工具时，Heym 会临时将 Agent 提供的参数合并到该节点的数据中，执行该节点，将节点输出返回给 Agent，然后恢复原始节点配置。工具节点不会通过正常调度作为常规 Workflow 步骤运行；它们仅在 Agent 调用时执行。

画布节点工具适用于 Slack、Telegram、HTTP、Send Email 等集成节点，以及 [Set](./set-node.md) 等数据整形节点。Trigger 节点、控制流节点和终端输出映射器（[JSON 输出映射器](./json-output-mapper-node.md)、[HTML 输出映射器](./html-output-mapper-node.md)）不能用作 Agent 工具。

## Python 工具

定义 Agent 可以调用的自定义工具。每个工具包含：

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `name` | string | 工具名称（例如 `count_characters`） |
| `description` | string | 提供给 LLM 的描述 |
| `parameters` | JSON Schema | OpenAI function-calling schema（对象格式） |
| `code` | string | Python 函数代码 |

**Parameters** 必须是 JSON 对象，而非字符串：

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**示例工具：**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **沙箱。** Python 工具默认作为不受信任的代码在加固的隔离 Docker 容器中运行（无网络、无 Docker socket、只读文件系统、非 root）。导入仅限于安全标准库模块的允许列表。配置方法（`HEYM_PYTHON_TOOL_SANDBOX`）详见 [安全 → Python 工具沙箱](../reference/security.md#python-tool-sandbox)。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | 每次工具执行的最大秒数（默认：30） |
| `requestTimeoutSeconds` | number | 等待每次模型响应的最大秒数，超时后终止（默认：60）。对于较慢或自托管的提供商（LiteLLM、vLLM、本地模型）以及长时间多步骤运行，请调高此值。 |
## MCP Connections

连接到 [Model Context Protocol](https://modelcontextprotocol.io/) 服务器，将其工具暴露给 Agent。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | 连接类型 |
| `timeoutSeconds` | number | 此连接的超时时间（默认：30） |
| `label` | string | 可选的显示名称 |

**stdio**（本地进程）：

| 字段 | 描述 |
|-------|-------------|
| `command` | 要运行的命令（例如 `npx`） |
| `args` | JSON 数组（例如 `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`） |
| `env` | 注入到进程的环境变量的 JSON 对象（例如 `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`） |

大多数基于 API key 的 stdio 服务器通过环境变量而非命令参数进行身份验证。为每个连接设置 `env`，这样每个 Agent 节点都可以使用不同的凭证，而无需修改宿主环境。

`env` 值支持 [Expression DSL](../reference/expression-dsl.md)，因此你可以将 Workflow 输入作为凭证传入，而无需硬编码密钥：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

表达式 `$userInput.pat` 会在 MCP 进程启动之前，根据 Workflow 的输入数据在运行时进行解析。这让你可以从 Trigger 或输入节点接收 Token，而无需将其嵌入 Workflow 定义中。

示例 — 使用硬编码 Token 的 GitHub MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

示例 — 使用来自 Workflow 输入的动态 Token 的 GitHub MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

示例 — 使用 Heym GitHub 凭证的 GitHub MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

内置的 GitHub 凭证目前针对基于 PAT 的身份验证。如果你需要访问组织资源，请使用具有所需组织/仓库权限的 PAT。

示例 — Slack MCP：

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE**（远程服务器）：

| 字段 | 描述 |
|-------|-------------|
| `url` | SSE Endpoint URL。支持表达式（例如 `$userInput.serverUrl`）。 |
| `headers` | 用于身份验证/自定义 Header 的 JSON 对象。值支持表达式。 |

**Streamable HTTP**（远程服务器）：

| 字段 | 描述 |
|-------|-------------|
| `url` | MCP Endpoint URL（例如 `https://example.com/mcp`）。支持表达式。 |
| `headers` | 用于身份验证/自定义 Header 的 JSON 对象。值支持表达式。 |

## Skills

Skills 是 SKILL.md 指令加上可选的 Python 文件和捆绑资源。它们扩展 Agent 的系统上下文，并可以添加 Python 工具。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `name` | string | Skill 名称 |
| `content` | string | SKILL.md 内容（指令） |
| `timeoutSeconds` | number | Skill Python 执行的超时时间（默认：30） |
| `driveFilesEnabled` | boolean | 为此 Skill 启用运行时 `heym_drive` 辅助工具（默认：false） |
| `files` | array | 可选的 `{ path, content, encoding, mimeType }` 条目（例如 `.py` 脚本或以 base64 存储的二进制资源） |

可以通过将 `.zip` 或 `.md` 文件拖放到 Skills 区域来添加 Skills。
展开 Skill 卡片后，将任意文件拖放到该 Skill 上即可附加或替换捆绑文件，包括 PDF 和图像等二进制资源。
使用 Skill 卡片上的下载按钮可将该 Skill 导出为 `.zip` 归档，以便备份或在另一个 Workflow 中复用。

仅当 Skill 的 Python 代码需要从 Heym Drive 读取文件时，才在该 Skill 上启用 **Drive files**。已启用的 Skill 会在运行时收到生成的 `heym_drive.py` 辅助工具，并可以使用 Drive 文件 id 或精确文件名调用 `list_drive_files`、`get_drive_file`、`get_drive_file_path`、`read_drive_file`、`read_drive_text` 或 `read_drive_base64`。文件名查找使用最新的可访问匹配项。未启用的 Skill 不会收到该辅助工具。

每个 Skill 卡片在标题下方的一行中有四个操作：

| 按钮 | 描述 |
|--------|-------------|
| **Edit with AI** | 打开 Skill Builder，通过聊天 Prompt 修改 Skill |
| **Download** | 将该 Skill 导出为 `.zip` 归档 |
| **Remove** | 从此 Agent 节点删除该 Skill |
| **History** | 打开源自 [Edit History](../reference/edit-history.md) 的 Skill 历史记录 |
### Skill 历史记录

Skill 历史记录**不会**单独存储。它派生自 Workflow 编辑历史快照：每个已保存的 Workflow 版本都包含完整的 Agent 节点 `skills` 数组。

在 History 对话框中，你可以：

- **Preview**（预览）某个历史快照（SKILL.md 和文件列表）
- **Edit**（编辑）——将快照加载到 Skill 编辑器中，而不回滚整个 Workflow
- **AI Fine-tune**（AI 微调）——以该快照为起点打开 Skill Builder
- **Revert**（回滚）——仅从历史版本恢复此 Skill（其他节点保持不变）

历史记录遵循与 Workflow 编辑历史相同的 7 天保留期。在 Skill 编辑后保存 Workflow 会创建新的历史记录条目。

Skills 部分还包含 **AI Build**：

- 点击 **AI Build**，通过聊天 Prompt 创建新 Skill
- 点击现有 Skill 上的闪光按钮，用 AI 修改它
- 将文件拖入 Prompt 输入框，即可将其附加到微调评论中；这些文件也会作为捆绑的 Skill 资源保存
- 该模态框会流式输出助手文本，同时实时显示 `SKILL.md` 和 `.py` 文件预览
- **Download ZIP** 导出当前预览，但不将其添加到节点
- **Save & Add** 通过与手动上传相同的 ZIP 解析流程，将生成的文件保存回去

使用 AI 编辑时，Heym 仅将文本 `.md` 和 `.py` Skill 文件发送给构建器。二进制及其他不可编辑的附件会被保留，并作为路径元数据与构建器共享，以便生成的 Python 代码能够保持正确的相对文件引用。
在右侧面板中选择一个已附加的文件，当 AI 需要检查捆绑的模板时，启用 **Include this file in AI context**。文本、PDF 和 DOCX 文件在可能的情况下会被提取到 Prompt 上下文中；除平台请求体限制外，Heym 不会对 Skill Builder 附件大小施加单独的上限。

## Extra Body

某些提供商接受标准 OpenAI 兼容字段未涵盖的请求参数，例如禁用模型的思考模式。在节点属性中勾选 **Send extra request body**，并输入一个 JSON 对象。

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **默认禁用。** 复选框关闭时，不会发送任何额外内容。
- 应用于工具调用循环中的**每一次**请求，而不仅是第一轮，还包括回退模型尝试。不应用于 Guardrail 检查，后者使用单独的模型。
- 必须是 JSON **对象**。数组、标量或格式错误的文本会导致节点失败并报错 `Invalid extra body JSON`，而不是被静默丢弃。
- `$` 表达式在解析前会被求值。由于这是文本替换，求值结果若包含双引号或换行符，会产生无效 JSON 并导致节点失败。

字段和行为与 [LLM 节点](./llm-node.md) 的 extra body 相同。

## Guardrails

在节点属性中启用 **Guardrails**，以在 Agent 运行前拦截不安全的用户消息。完整参考请见 [Guardrails](../reference/guardrails.md)。

## 持久记忆（图谱）

可选的**按 Agent 节点**知识图谱，存储在数据库中。启用后，Heym 会在每次运行前将记忆实体和关系的 Markdown 摘要追加到**系统指令**中（仅当图谱非空时）。在 Agent **成功**完成后，后台任务会从对话中提取新的持久事实，并将其合并到图谱中。

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | 为此画布节点启用加载 + 后台提取 |

**子 Agent** 保留其**自己的**图谱（以其节点 id 为键），与编排器相互独立。

使用节点上的粉色 **brain** 控件（当记忆开启或模型行显示时）打开图谱编辑器以及可选的**记忆共享**（其他 Workflow/Agent）。完整行为、REST 路径和 JSON 导出详情：[Agent Persistent Memory](../reference/agent-persistent-memory.md)。

## Responses API 与推理连续性

**Use Responses API** 复选框会将 Agent 的模型调用路由到 [Responses API](https://platform.openai.com/docs/api-reference/responses)，而非 Chat Completions。它默认关闭。

它在推理模型（如 `gpt-5` 或 `o` 系列）上最为重要。Responses API 会在每次工具调用时返回模型的推理内容，Agent 会在下一轮将这些推理项反馈回去，因此模型在多步工具循环中能够保持其思维链，而不必在每次工具结果后重新推导。整个循环都运行在同一路径上，包括[人工审核](#human-review-hitl)的暂停与恢复、[上下文压缩](#context-compression)以及最终答案。

对话本身保留在 Heym 中。Heym 在每一轮发送完整输入，并以加密 blob 的形式携带推理内容，因此调用之间不会在提供商侧保留任何内容。上下文压缩所摘要的跨度内的推理项会随之被丢弃，因为加密 blob 无法被摘要。

它可与 OpenAI 凭证一起使用，也可与网关支持该 Endpoint 的自定义凭证一起使用。使用 Google 凭证时，它保持禁用。
## 上下文压缩

当 Agent 运行大量工具迭代并产生大型结果（网页抓取、文档读取、子工作流输出）时，累积的消息历史可能会接近模型的上下文窗口限制。Heym 会在运行过程中自动压缩对话历史，以防止上下文溢出。

**工作原理：**

1. 在每次工具迭代之前，Heym 会估算当前的 Token 数量（约每 Token 4 个字符）。
2. 如果估算值超过模型上下文窗口的 **80%**，则会触发压缩。
3. 消息历史会被拆分为保留部分和压缩部分：
   - **保留**：系统 Prompt、第一条用户消息、最近的用户消息
   - **压缩**：中间的所有内容（助手推理轮次、工具调用、工具结果）
4. 中间部分使用**相同的模型和凭证**进行摘要——无需额外配置。
5. 压缩后的摘要作为单条助手消息替换中间部分。

**可观测性：**

压缩事件会以 `Context compressed (N messages → summary)` 条目的形式出现在以下位置：
- 实时执行期间 **Debug 面板**的工具调用列表
- **执行历史**的运行详情视图
- **Traces 标签页**中作为 `context.compression` trace 条目

压缩是自动的，并且始终对 Agent 节点生效。它**不**适用于 LLM 节点、Chat 标签页或 AI Assistant 会话。

## 相关内容

- [为什么选择 Heym](../getting-started/why-heym.md) – Agent 如何在生产环境中运行并保持受控
- [Agent 持久化记忆](../reference/agent-persistent-memory.md) – 每个 Agent 节点的知识图谱、可选共享、API、编辑器
- [Agent 架构](../reference/agent-architecture.md) – 子 Agent、编排器、技能、MCP、工具调用
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 公开审核页面、待处理执行、批准/编辑/拒绝流程
- [Guardrails](../reference/guardrails.md) – 阻止不安全的内容类别
- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [AI Assistant](../reference/ai-assistant.md) – 使用自然语言构建工作流的 Chat UI（区别于 Agent 节点）
- [Expression DSL](../reference/expression-dsl.md) – 在 Prompt 中引用数据
- [工作流结构](../reference/workflow-structure.md) – 节点、边和 DSL 格式
- [快速开始](../getting-started/quick-start.md) – 使用 LLM 和表达式的基础工作流
- [Credentials 标签页](../tabs/credentials-tab.md) – 为 Agent 添加 API 密钥
- [MCP 标签页](../tabs/mcp-tab.md) – 为工作流工具配置 MCP
