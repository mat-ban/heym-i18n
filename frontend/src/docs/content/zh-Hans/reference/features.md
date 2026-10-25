# 完整功能集

全面概述 Heym 的所有能力。每个章节用几句话描述一项功能或概念。

---

## 入门

### [简介](../getting-started/introduction.md)

Heym 是用于在生产环境中运行和治理 AI Agent 的基础设施。你可以在可视化画布上构建 Agent 系统并放心运行：编排 Agent、自动化业务流程、检查每一次执行，并在你自己的基础设施上保持人工控制。它支持可视化 Workflow、AI 驱动的节点（[LLM](../nodes/llm-node.md)、[Agent 节点](../nodes/agent-node.md)、[Qdrant RAG](../nodes/rag-node.md)）、[AI Assistant](./ai-assistant.md)、集成（[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md)、[Jira](../nodes/jira-node.md)、[Notion](../nodes/notion-node.md)、[WebSocket Send](../nodes/websocket-send-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、入站 [IMAP Trigger](../nodes/imap-trigger-node.md) 邮件、出站 [Send Email](../nodes/send-email-node.md)）、基于 [Cron](../nodes/cron-node.md) 的调度，以及面向最终用户的 [Portal](./portal.md) 聊天门户。

另请参阅[核心概念](../getting-started/core-concepts.md)、[节点类型](./node-types.md)和[第三方集成](./integrations.md)。

### [为什么选择 Heym](../getting-started/why-heym.md)

《为什么选择 Heym》贯穿 Agent 生命周期（构建、编排、运行、观测、评估、控制、暴露），并展示一个自托管运行时在每个阶段所处理的内容。这涵盖 [LLM](../nodes/llm-node.md) 节点和具备工具调用能力的 [Agent 节点](../nodes/agent-node.md)、Python 工具、[MCP](../tabs/mcp-tab.md) 连接、技能和多 Agent 编排；Trigger、重试和[负载分发](./cluster.md)；带每次运行 USD 成本和 OpenTelemetry 导出的 [Traces](../tabs/traces-tab.md)；[Evals](../tabs/evals-tab.md)；[人工审核检查点](./human-in-the-loop.md)、护栏、SSO 和审计追踪；以及 REST、MCP 和 Portal Endpoint。页面最后与 n8n、Zapier 和 Make.com 进行了能力对比。

另请参阅 [Agent 节点](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md)、[Qdrant RAG](../nodes/rag-node.md)和 [Agent 架构](./agent-architecture.md)。

### [快速开始](../getting-started/quick-start.md)

几分钟内运行你的第一个 Workflow：从 [Workflows](../tabs/workflows-tab.md) 标签页创建 Workflow，添加一个[输入](../nodes/input-node.md)节点、一个 [LLM](../nodes/llm-node.md) 节点和一个[输出](../nodes/output-node.md)节点，然后将它们连接起来。为 [LLM](../nodes/llm-node.md) 配置凭据，并将 `userMessage` 设置为 `$input.text`；使用 Run 或 [AI Assistant](./ai-assistant.md) 以自然语言执行或生成 Workflow。

与[输入](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[输出](../nodes/output-node.md)和[表达式 DSL](./expression-dsl.md)自然搭配使用。

### [核心概念](../getting-started/core-concepts.md)

Workflow 是由边连接节点构成的有向图；执行从 Trigger 节点（[输入](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)）流经处理节点，最终到达[输出](../nodes/output-node.md)节点。每个节点都有类型、数据（配置）和输入/输出；边定义数据流。节点通过[表达式 DSL](./expression-dsl.md) 表达式（如 `$nodeLabel.field`）引用上游数据；相互独立的节点会自动[并行](./parallel-execution.md)运行。

另请参阅 [Trigger](./triggers.md)、[并行执行](./parallel-execution.md)和 [Workflow 结构](./workflow-structure.md)。

### [运行与部署](../getting-started/running-and-deployment.md)

Heym 提供用于本地开发的 `run.sh`（数据库运行在 Docker 中、FastAPI 后端、Vite 前端）和用于生产环境的 `deploy.sh`（配合 Docker Compose）。两者都使用 `.env` 文件；关键变量包括 `SECRET_KEY`、`ENCRYPTION_KEY`、`DATABASE_URL` 和 `ALLOW_REGISTER`。开发环境运行在可配置的前端和后端端口上；生产环境通过前端容器在 `/api` 下提供 API 服务。

另请参阅[安全](./security.md)、[企业版](./enterprise.md)和[设置](./user-settings.md)。

### [迁移到 Heym](../getting-started/migrate-to-heym.md)

AI Convert 工具可将来自其他平台（n8n、Flowise、Dify、Langflow、sim.ai、Activepieces）的 Workflow 或纯英文描述转换为 Heym Workflow，实时流式呈现在画布上，并可随时[下载和导入](./download-import.md)。它会运行 AI 安全检查，然后在输入和速率限制就位的情况下生成 DSL。可在 [heym.run/convert](https://heym.run/convert) 打开它。

另请参阅[快速开始](../getting-started/quick-start.md)、[下载与导入](./download-import.md)和 [AI Assistant](./ai-assistant.md)。

---

## 节点

### Trigger
#### [Input](../nodes/input-node.md)

Input 节点是接收来自用户或 API 调用方数据的工作流入口点。它支持单个或多个输入字段，并暴露请求元数据（headers、query params）。通过 `$nodeLabel.body.fieldKey` 访问 body 字段，通过 `$nodeLabel.headers` 访问 headers，通过 `$nodeLabel.query` 访问 query。

与 [Condition](../nodes/condition-node.md)、[LLM](../nodes/llm-node.md) 和 [Output](../nodes/output-node.md) 天然搭配。有关 payload 引用和字段访问，请参阅 [Expression DSL](./expression-dsl.md) 和 [Webhooks](./webhooks.md)。

#### [Cron](../nodes/cron-node.md)

Cron 节点使用标准五字段 cron 表达式按计划触发工作流。无需用户输入——工作流会在指定时间自动运行（例如每小时、每天、每 15 分钟）。输出为触发事件，不包含 payload。

另请参阅 [Triggers](./triggers.md)、[Wait](../nodes/wait-node.md) 和 [Execution History](./execution-history.md)，了解计划运行和延迟运行。

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger 节点按可配置的分钟间隔轮询收件箱，并为每封新检测到的邮件启动一个工作流。它输出解析后的 headers、发件人和收件人列表、纯文本和 HTML 正文、附件元数据以及触发时间戳。可将其用于支持收件箱分类、邮箱到 [Slack](../nodes/slack-node.md) 的路由，或结合 [Human-in-the-Loop](./human-in-the-loop.md) 实现邮件驱动的审批流程。

与 [Send Email](../nodes/send-email-node.md)、[LLM](../nodes/llm-node.md) 和 [Slack](../nodes/slack-node.md) 搭配，用于入站分类和响应工作流。

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger 节点在 Heym 自身发布平台事件时启动工作流：`heym.started`、`workflow.created`、`workflow.updated` 或 `workflow.deleted`。投递采用批处理方式——在一个五秒分发窗口内发布的每个事件都会作为 `$nodeLabel.events` 在单次运行中到达，且始终为数组。每个事件都通过唯一的数据库约束进行认领，因此无论有多少 worker、容器或机器在运行，每个订阅节点都只会触发一次。可将其用于工作流变更审计追踪、部署公告和实例健康摘要。

与 [Heym](../nodes/heym-node.md) 节点搭配以查找已变更的工作流，与 [Loop](../nodes/loop-node.md) 搭配以对每个事件执行一次操作。

#### [Heym](../nodes/heym-node.md)

Heym 节点通过三种操作读取 Heym 自身的数据：`listWorkflows` 返回所有者可访问的每个工作流及其节点数量和时间戳，`getWorkflow` 返回单个工作流的节点和边结构，`getExecutionHistory` 按最新优先返回执行历史条目，并支持可选的 status、time-window 和 limit 过滤条件，同时返回按 status 分组的汇总数据。结果范围限定为该节点所在工作流的所有者，因此由 cron、portal 或事件启动的运行返回的数据与手动运行相同。`getWorkflow` 返回完整的节点配置，这使得审计工作流中是否存在硬编码的密钥或 token 成为可能；它不会暴露工作流所有者无法在编辑器中打开的任何内容。无需 credential。

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger 节点向外部 WebSocket 服务器打开出站客户端连接，并在 `onMessage`、`onConnected` 或 `onClosed` 时启动工作流。它暴露解析后的消息 payload、重连状态、关闭元数据以及 socket URL，供下游表达式使用。

与 [WebSocket Send](../nodes/websocket-send-node.md)、[HTTP](../nodes/http-node.md) 和 [SSE Streaming](./sse-streaming.md) 搭配，用于实时集成。

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger 节点接收 bot webhook 更新并立即启动工作流。它暴露完整的 update payload、主 message 对象、callback queries、经过清理的 headers 以及触发时间戳。可将其用于聊天机器人、[Telegram](../nodes/telegram-node.md) 中的 AI 助手以及按钮驱动的流程。

与 [Telegram](../nodes/telegram-node.md)、[Agent Node](../nodes/agent-node.md) 和 [Webhooks](./webhooks.md) 搭配，用于 bot 驱动的工作流。

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger 节点接收 Slack Events API webhooks，并在验证请求签名后自动启动工作流。它暴露事件 payload 和经过清理的 headers，供下游路由、基于 [LLM](../nodes/llm-node.md) 的分类以及回复流程使用。

与 [Slack](../nodes/slack-node.md)、[Agent Node](../nodes/agent-node.md) 和 [Third-Party Integrations](./integrations.md) 搭配。

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger 节点接收 Discord Interactions API webhooks，使用选定的 `discord_trigger` credential 验证 Ed25519 签名，并启动工作流。它暴露完整的 interaction payload、command 数据、经过清理的 headers 以及触发元数据，供下游路由或回复使用。

与 [Output](../nodes/output-node.md)、[Discord](../nodes/discord-node.md)、[Agent Node](../nodes/agent-node.md) 和 [Third-Party Integrations](./integrations.md) 搭配。
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ 节点从 RabbitMQ 队列和交换机发送或接收消息。将其用于消息驱动的工作流和事件处理。发送模式发布一条消息，可设置可选延迟；接收模式充当 [Trigger](./triggers.md)，因此当消息到达时工作流会启动。输出包含 status、message_id 和 body。

与 [Condition](../nodes/condition-node.md)、[Error Handler](../nodes/error-handler-node.md) 和 [Parallel Execution](./parallel-execution.md) 搭配使用，实现事件驱动处理。

#### [Error Handler](../nodes/error-handler-node.md)

当工作流中任何节点失败时，Error Handler 节点会自动运行。无需传入边；它由引擎触发。输出包含错误消息、失败节点标签、节点类型和时间戳。使用它通过 [Slack](../nodes/slack-node.md)、[Telegram](../nodes/telegram-node.md) 或 [Send Email](../nodes/send-email-node.md) 发送通知、记录错误，或返回自定义错误响应。

作为在画布上处理错误的替代方案，工作流也可以将失败委托给单独的工作流——参见 [Error Workflow](#error-workflow)。如果画布中已包含 Error Handler 节点，则**不会**调用错误工作流（本地处理器优先）。

常见的通知目标为 [Slack](../nodes/slack-node.md)、[Telegram](../nodes/telegram-node.md) 和 [Send Email](../nodes/send-email-node.md)；运行详情在 [Execution History](./execution-history.md) 中更易于查看。

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent 节点是一个具备工具调用能力的 [LLM](../nodes/llm-node.md) 节点。它可以运行 Python 工具、将已连接的画布节点作为工具调用、连接到 [MCP](../tabs/mcp-tab.md) 服务器、使用技能（指令文件和可选的 Python 脚本）、充当编排器将任务委托给其他 agent 节点，以及将其他工作流作为工具调用。输出可通过 `$nodeLabel.text` 获取。可选的 **Extra Body** 开关会将一个包含提供商特定请求参数的 JSON 对象附加到工具调用循环中的每个请求；默认关闭。可选的 **Use Responses API** 开关会将 agent 的模型调用路由到 Responses API，从而在工具调用之间保留模型的推理过程，使推理模型在多步循环中保持其思维链；默认关闭，适用于 OpenAI 和自定义凭证。

画布节点工具让 agent 可以直接从画布调用已配置的工作流节点。将受支持的节点连接到 agent 的 tools 句柄，然后使用机器人图标将特定字段标记为 agent 提供。这些字段在运行时成为工具参数，而凭证和未标记的字段则固定在节点配置中。

Skills 部分现在包含用于创建新技能的 **AI Build**、针对现有技能的内联 AI 编辑操作、按技能下载 ZIP，以及针对需要在运行时读取 Heym Drive 文件的技能的可选 **Enable Drive files** 开关。Skill Builder 模态框在左侧流式显示聊天对话，接受拖放文件并附带每条微调评论，在右侧实时显示生成的 `SKILL.md` 和 `.py` 文件的只读预览，可将该预览下载为 ZIP，并通过与手动上传相同的 ZIP 摄取流程将上传的微调文件保存回捆绑的技能资产。

启用 **[Agent Persistent Memory](./agent-persistent-memory.md)** 后，每个 agent 节点会维护自己的知识图谱：当事实非空时，事实会被加载到系统 Prompt 中，成功运行会触发新实体和关系的后台合并。子 agent 使用独立的图谱。你可以通过图谱对话框以只读或读/写访问权限将某个 agent 的图谱**共享**给其他 agent（同一工作流或其他工作流）。画布上的大脑控件可打开图谱编辑器。

Agent 节点还可以进入 [Human-in-the-Loop](./human-in-the-loop.md) 模式。在此模式下，agent 会获得一个 `request_human_review` 工具，可以在特定的需要审批的步骤暂停，创建一个一次性公开审查链接，为通知流暴露一个 `review` 画布分支，并等待审查者接受、编辑或拒绝 Markdown 审查文本。节点的 HITL 字段充当何时请求审批的审批指南，而面向审查者的摘要则根据每个审查请求生成。对于 [MCP](../tabs/mcp-tab.md) 工具，Heym 使用模型将这些书面指令解释为 `always`、`once` 或 `never`，从而将自由形式的审批语言映射为具体的运行时策略。运行会被标记为 `pending`，并在决策到达后从存储的执行快照恢复，如果后续步骤也需要审查，同一次 agent 运行可以暂停多次。

当 agent 节点累积的消息历史接近模型上下文窗口的 80% 时，会自动压缩。系统 Prompt、第一条用户消息和最近的用户消息始终保留；中间的所有内容使用相同的模型和凭证进行摘要。压缩事件在 Debug 面板、[Execution History](./execution-history.md) 和 [Traces](../tabs/traces-tab.md) 标签页中可见。

另请参见 [LLM](../nodes/llm-node.md)、[Agent Architecture](./agent-architecture.md)、[Agent Persistent Memory](./agent-persistent-memory.md)、[Human-in-the-Loop](./human-in-the-loop.md) 和 [File Generation](./file-generation.md)。
#### [Codex](../nodes/codex-node.md)

Codex 节点在隔离的 Heym 工作区内运行 OpenAI Codex CLI。它接受 Codex 凭证（通过 ChatGPT 登录以使用你的订阅，无需按 Token 计费的 API 成本，或粘贴访问 Token）、GitHub 凭证、仓库 URL、基础分支、任务 Prompt、发布模式（`diff_only` 或 `draft_pr`）、分支名称和超时时间。运行器在本地克隆仓库，仅将 ChatGPT Token 包或 `CODEX_ACCESS_TOKEN` 传递给 Codex 进程，并返回结构化摘要、验证说明、变更文件、diff、用量元数据以及可选的草稿 PR URL。

当 Codex 返回 `needs_input` 时，工作流暂停并暴露 `question` 分支。将该分支连接到 Slack、电子邮件或其他通知节点；公开的后续链接会在答案提交后恢复已保存的执行快照。Codex 节点还可以作为工具附加到 AI Agent，让 Agent 委派编码任务；作为工具时，`needs_input` 结果会以内联方式返回给 Agent，而不会暂停工作流。

另请参阅 [GitHub](../nodes/github-node.md)、[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 和 [Node Types](./node-types.md)。

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go 节点针对 GitHub 仓库运行 OpenCode CLI (Go)。隔离方式遵循 Codex 模式：在本地作为宿主子进程运行，而在 Docker 部署中则在共享工作区卷的加固同级容器内运行。它接受 OpenCode Go 凭证（带有可选 base URL 的网关 API 密钥）、GitHub 凭证、仓库 URL、基础分支、任务 Prompt、发布模式、分支名称、超时时间，以及从实时可搜索的模型列表中选择的 `opencode-go/<model>` 模型（带有内置回退）。Heym 在宿主机上执行所有 git/GitHub 操作，绝不将 GitHub Token 放入沙箱；OpenCode 仅编辑磁盘上的文件。该节点返回结构化摘要、验证说明、变更文件、diff 以及可选的拉取请求 URL。它可以作为工具附加到 AI Agent。

另请参阅 [Codex](../nodes/codex-node.md)、[GitHub](../nodes/github-node.md)、[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 和 [Node Types](./node-types.md)。

#### [LLM](../nodes/llm-node.md)

LLM 节点使用语言模型处理文本或生成图像。它支持文本生成、视觉（图像输入）、图像生成、结构化 JSON 输出、针对受支持的 OpenAI 及 OpenAI 兼容 Endpoint 的提供商原生 Batch API 执行，以及可选的 **Use Responses API** 开关，该开关将调用路由至 Responses API 而非 Chat Completions（默认关闭；适用于 OpenAI 和自定义凭证，且不能与 Batch 模式组合使用）。配置凭证、模型、系统消息和用户消息、temperature 和 max tokens；在 Prompt 中使用 [Expression DSL](./expression-dsl.md)。在批处理模式下，`userMessage` 必须解析为数组，节点会发出带有进度更新的 `batchStatus` 分支，最终输出包含逐项的批处理结果。可选的 **Extra Body** 开关会将提供商特定请求参数的 JSON 对象（例如 `{"thinking": {"type": "disabled"}}`）附加到每次 API 调用；默认关闭。可选的 [Guardrails](./guardrails.md) 会在调用前阻止不安全内容。

与 [Qdrant RAG](../nodes/rag-node.md)、[Agent Node](../nodes/agent-node.md)、[Guardrails](./guardrails.md) 和 [Expression Evaluation Dialog](./expression-evaluation-dialog.md) 自然搭配使用。

#### [Decision](../nodes/decision-node.md)

Decision 节点向决策模型提出关于运行状态的类型化问题，并返回概率而非散文式回答。**State** 字段承载模型应读取的内容——单独的表达式会保留其自身类型，因此 `$input` 发送的是对象而非其文本——问题列表承载判断。问题有三种形式：**noul** 回答条件是否成立，**choice** 从你定义的集合中选择一个选项并返回完整分布，**score** 沿有序等级对状态进行评分，且可以落在等级之间。Choice 和 score 答案还带有置信度，因此 [Switch](../nodes/switch-node.md) 可以根据答案进行路由，而 [Condition](../nodes/condition-node.md) 则根据其确定程度进行门控。**Generate with AI** 从一句简单描述起草状态模板和问题行，**Custom request body** 为契约不同的 Endpoint 发送手写 JSON。提供商响应会原样传递，每次调用都会记录在 [Traces](../tabs/traces-tab.md) 中。

需要 Decision Model 凭证；与 [Switch](../nodes/switch-node.md)、[Condition](../nodes/condition-node.md) 和 [Agent Node](../nodes/agent-node.md) 自然搭配使用。
#### [RAG / Vector Store](../nodes/rag-node.md)

RAG / Vector Store 节点在向量存储中插入、更新插入、删除和搜索文档，用于检索增强生成。Database 下拉菜单用于选择后端——**Qdrant**（外部服务器）或 **Postgres (pgvector)**（Heym 自有数据库，无需外部服务），默认为 Qdrant。从 [Vectorstores](../tabs/vectorstores-tab.md) 标签页中选择一个向量存储，并将操作设置为 insert、upsert、delete 或 search。Upsert 和 delete 通过存储在 payload 中的唯一 id 来定位文档——**Document ID Field** 指定该字段的名称（默认为 `doc_id`），**Document ID** 携带其值——因此文档可以保留您自己系统已使用的 id：upsert 在存储新版本之前会替换所有匹配的 point，delete 会报告是否有任何匹配。文档元数据的值支持表达式，因此 `{"url": "$start.url"}` 会存储运行所产生的内容。Search 支持元数据过滤和可选的 Cohere 重排序，并返回一个结果数组，包含 text、score、metadata、reranked 标志和 count，供 [LLM](../nodes/llm-node.md) 或 [Agent Node](../nodes/agent-node.md) 流程使用。

常见的下游节点是 [LLM](../nodes/llm-node.md) 和 [Agent Node](../nodes/agent-node.md)；向量存储的设置位于 [Vectorstores](../tabs/vectorstores-tab.md)。

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call 节点直接调用特定的 [MCP](../tabs/mcp-tab.md) 工具，无需由 LLM 决定调用哪个工具。当您在设计中明确知道要运行哪个工具时使用它——用于在工作流中确定性地执行单步 MCP 工具。配置连接（SSE、Streamable HTTP 或 stdio；字段与 [Agent Node](../nodes/agent-node.md) 的 MCP 连接相同），点击 **Fetch Tools** 填充下拉菜单，选择一个工具，并填写根据工具输入 schema 自动渲染的参数字段。每个参数接受静态值或 [DSL 表达式](./expression-dsl.md)，例如 `$userInput.body.text`。结果可通过 `$nodeLabel.result` 获取（如果可解析则为 JSON 对象，否则为字符串）。MCP Call 节点不能作为画布工具连接到 [Agent Node](../nodes/agent-node.md)。

另请参阅 [Agent Node](../nodes/agent-node.md)、[MCP](../tabs/mcp-tab.md) 和 [Expression DSL](./expression-dsl.md)。

### Logic

#### [Condition](../nodes/condition-node.md)

Condition 节点根据 if/else 表达式对工作流进行分支。它有两个输出句柄：一个用于条件为真时，一个用于条件为假时。在条件表达式中使用 [Expression DSL](./expression-dsl.md) 的比较和逻辑运算符；该节点将输入传递到所选分支。

另请参阅 [Switch](../nodes/switch-node.md)、[Throw Error](../nodes/throw-error-node.md) 和 [Expression DSL](./expression-dsl.md)。

#### [Switch](../nodes/switch-node.md)

Switch 节点通过将值与 case 进行匹配，将执行路由到不同路径。配置一个要评估的表达式和一个 case 值列表；每个 case 获得一个源句柄，默认句柄用于不匹配的值。输入被传递到匹配的分支。

使用 [Condition](../nodes/condition-node.md) 进行二元分支，使用 [Merge](../nodes/merge-node.md) 重新汇合路由后的路径；匹配规则详见 [Expression DSL](./expression-dsl.md)。

#### [Merge](../nodes/merge-node.md)

Merge 节点等待多个并行输入并将它们合并为单个输出。设置要等待的输入数量；当所有分支完成后，该节点生成一个合并对象。使用它在继续之前汇合来自并行分支的结果；当并行分支以单独的 Output 节点结束时，请勿使用它。

另请参阅 [Parallel Execution](./parallel-execution.md)、[Loop](../nodes/loop-node.md) 以及重新组合分支时的 [Output](../nodes/output-node.md)。

#### [Loop](../nodes/loop-node.md)

Loop 节点遍历数组，为每个项执行下游节点。它需要从迭代体中的最后一个节点建立回连才能推进。在循环体内使用 `item`、`index`、`total`、`isFirst` 和 `isLast`；该循环为迭代路径和完成路径提供单独的输出。

与 [Variable](../nodes/variable-node.md)、[Merge](../nodes/merge-node.md) 和 [Expression DSL](./expression-dsl.md) 搭配使用，实现迭代工作流。

### Data

#### [Set](../nodes/set-node.md)

Set 节点将输入数据转换并映射为自定义输出。定义键值映射，其中每个值都是一个 [Expression DSL](./expression-dsl.md) 表达式。将其用于大写转换、子字符串、拼接、随机数及类似转换。通过键访问输出（例如 `$setNode.keyName`）。当作为画布节点工具连接到 agent 时，映射值可以标记为由 agent 提供，以便 agent 在运行时填充它们。要调用其他工作流，请改用 [Execute](../nodes/execute-node.md) 节点。

另请参阅 [Variable](../nodes/variable-node.md)、[Execute](../nodes/execute-node.md) 和 [Expression DSL](./expression-dsl.md)。
#### [Converter](../nodes/converter-node.md)

Converter 节点无需编写代码即可在格式之间转换数据。文本转换包括 `csvToJson`（将 CSV 文本转换为行对象数组，若无表头则转换为数组）、`jsonToCsv`（将对象/行数组转换为 CSV 文本）、`xmlToJson`（将 XML 文本转换为对象）以及 `jsonToXml`（将对象转换为 XML 文本）。配置转换方向和源表达式；CSV 转换还需使用分隔符和表头处理，且 `jsonToCsv` 可指定显式的列顺序。引号处理、嵌入分隔符和嵌入换行符遵循 RFC 4180。XML 属性使用 `@` 前缀，与属性混合的文本使用 `#text`，重复元素变为数组，且 XML 实体扩展被禁用。同一节点也可作用于已存储的文件。`imageToText` 和 `pdfToText` 运行 Tesseract OCR，从 Heym Drive 读取文件（来自 File upload trigger 的 `$Upload.file.id`、Drive 节点的结果，或 agent 生成的文件），根据检测到的文字系统自动选择语言，或使用你指定的代码如 `tur` 或 `eng+tur`，并默认将文本规范化为 UTF-8，可选启用 NFC 规范化以及更窄的字符集如 `cp1254`。`fileConvert` 将已存储的文件重写为另一种格式，文档通过 pandoc 处理，图像通过 Pillow 处理，并将结果保存为新的 Drive 文件，不触碰原始文件。结果可通过 `$converterNode.result` 获取，OCR 运行时还附带 `.language`、`.encoding`、`.page_count`、`.pages` 和 `.file`，而 `fileConvert` 则附带 `.id`、`.filename` 和 `.download_url`。

另请参阅 [Set](../nodes/set-node.md)、[DataTable](../nodes/datatable-node.md) 和 [Expression DSL](./expression-dsl.md)。

#### [Code](../nodes/code-node.md)

Code 节点运行你编写的 Python 代码，带有自己的 `requirements.txt`，在一个每次执行时创建并销毁的容器中运行。你的代码定义一个 `main(params)` 函数并返回任何可 JSON 序列化的值，该值成为 `$codeNode.result`；它打印的任何内容会单独捕获为 `$codeNode.logs`，而 `$codeNode.install` 报告哪个工具安装了依赖。参数配置为一个 JSON 对象，其中的 `$` 表达式在运行前解析，代码通过点号表示法读取它们，如 `params.user.name` 或 `params.orders[0].id`。依赖使用 `uv` 安装，对于 `uv` 无法处理的包回退到 `pip`，运行之间没有缓存；将 `requirements.txt` 留空则完全跳过安装，速度会快得多。除非开启 `codeAllowNetwork`，否则执行阶段没有网络，而依赖安装始终会访问 PyPI。沙箱以非 root 身份运行，所有 capabilities 被丢弃，根文件系统只读，无 Docker socket，且无法访问后端密钥，限制为 512 MB 内存、一个 CPU、256 个进程、120 秒安装时间和 60 秒执行时间。需要 Docker 且没有回退模式：若无可达的 daemon，节点会失败，而不会在后端进程中运行你的代码。

#### [Variable](../nodes/variable-node.md)

Variable 节点设置或更新 workflow 局部变量（`$vars.variableName`）或持久化的[全局变量](./global-variables.md)（`$global.variableName`）。用于计数器、累积列表和共享状态。配置变量名、值表达式、类型强制转换，以及是否存储到全局存储中。数组变量支持 `$array()` 和 `.add()`。

与 [Set](../nodes/set-node.md)、[Loop](../nodes/loop-node.md) 和 [Global Variables](./global-variables.md) 配合使用。

#### [Execute](../nodes/execute-node.md)

Execute 节点调用另一个 workflow（子 workflow）并向其传递输入。通过 ID 指定目标 workflow，并通过单个表达式或键值映射提供输入。输出包括 workflow_id、status 和 outputs；用于可复用逻辑，而非数据转换（数据转换请使用 Set）。

另请参阅 [Canvas Features](./canvas-features.md) 中的 Extract to Sub-Workflow、[Workflow Structure](./workflow-structure.md) 和 [Output](../nodes/output-node.md)。

### Integrations

#### [HTTP](../nodes/http-node.md)

HTTP 节点使用 cURL 风格的配置发起 HTTP 请求。它可以是 workflow 的起点（无入边），也可以接收来自上游节点的输入。响应可通过 status、headers 和 body 获取（适用时解析为 JSON）。使用 [Credentials](./credentials.md) 进行 Bearer 或自定义 header 认证。

与 [Webhooks](./webhooks.md)、[Credentials](./credentials.md) 和 [Third-Party Integrations](./integrations.md) 配合使用。

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send 节点打开一个出站客户端连接，发送一条 text/JSON/binary 消息，然后关闭它。用于将 workflow 输出发布到实时系统，而无需创建 Heym 托管的 socket endpoint。

另请参阅 [WebSocket Trigger](../nodes/websocket-trigger-node.md)、[SSE Streaming](./sse-streaming.md) 和 [Third-Party Integrations](./integrations.md)。
#### [Telegram](../nodes/telegram-node.md)

Telegram 节点向聊天、群组或频道发送机器人消息。配置 Telegram [凭据](./credentials.md)，设置 `chatId`，并使用 [Expression DSL](./expression-dsl.md) 表达式编写外发 `message`。它天然适合与 [Telegram Trigger](../nodes/telegram-trigger-node.md) 搭配构建对话式 Workflow，也可与 [Error Handler](../nodes/error-handler-node.md) 搭配用于运维告警。

有关设置和凭据模式，另请参阅[第三方集成](./integrations.md)和[凭据](./credentials.md)。

#### [Slack](../nodes/slack-node.md)

Slack 节点通过 Incoming Webhook 向 Slack 频道发送消息。配置 Slack [凭据](./credentials.md)和消息表达式。可用于通知、告警和错误报告；输出透传输入。

可与 [Slack Trigger](../nodes/slack-trigger-node.md)、[Error Handler](../nodes/error-handler-node.md) 和[第三方集成](./integrations.md)搭配使用。

#### [Discord](../nodes/discord-node.md)

Discord 节点通过 Incoming Webhook 向 Discord 频道发送消息。配置 Discord [凭据](./credentials.md)，使用 [Expression DSL](./expression-dsl.md) 编写外发消息，并可选择设置 Webhook 用户名或头像覆盖。

可与 [Discord Trigger](../nodes/discord-trigger-node.md)、[Output](../nodes/output-node.md)、[Error Handler](../nodes/error-handler-node.md) 和[第三方集成](./integrations.md)搭配使用。

#### [Send Email](../nodes/send-email-node.md)

Send Email 节点通过 SMTP 发送电子邮件。配置 SMTP [凭据](./credentials.md)以及用于收件人、主题和正文的 [Expression DSL](./expression-dsl.md) 表达式。可用于通知、告警和事务性邮件。输出包含 status、to 和 subject。

[IMAP Trigger](../nodes/imap-trigger-node.md) 通过处理入站邮件来补充 Send Email。二者结合可让 Workflow 从共享收件箱读取来信，使用 AI 节点对其进行摘要或分类，并发送后续或升级消息。[Telegram Trigger](../nodes/telegram-trigger-node.md) 和 [Telegram 节点](../nodes/telegram-node.md)为机器人驱动的聊天 Workflow 提供了相同的入站/出站模式。

对于双向通知流程，它还可与 [LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md) 和[第三方集成](./integrations.md)良好搭配。

#### [Redis](../nodes/redis-node.md)

Redis 节点执行 Redis 操作：set、get、hasKey 和 deleteKey。可用于缓存、速率限制和键值存储。配置[凭据](./credentials.md)、操作类型、键表达式，对于 set 操作还需配置值和可选的 TTL。输出因操作而异（value、success、exists、deleted）。

可与 [Wait](../nodes/wait-node.md)、[Variable](../nodes/variable-node.md) 和[并行执行](./parallel-execution.md)搭配，用于缓存、限流和协调。

#### [Grist](../nodes/grist-node.md)

Grist 节点读取、写入和管理 Grist 电子表格中的数据。操作包括 getRecord、getRecords、createRecord、updateRecord、deleteRecord、listTables 和 listColumns。提供文档 ID、表 ID，对于创建/更新操作还需使用列 ID 提供记录数据。可用于 CRUD、批量更新和电子表格自动化。

另请参阅 [Google Sheets](../nodes/google-sheets-node.md)、[DataTable](../nodes/datatable-node.md) 和[第三方集成](./integrations.md)。

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets 节点通过 OAuth2 读取、写入和管理电子表格数据。可用于在 Workflow 中读取报表、追加 Workflow 结果、更新跟踪表，以及清除或检查工作表标签页。与 [BigQuery](../nodes/bigquery-node.md) 类似，它使用 Google 支持的集成凭据，当电子表格数据是流程的一部分时，与 [Grist](../nodes/grist-node.md) 搭配良好。

可与 [Grist](../nodes/grist-node.md)、[DataTable](../nodes/datatable-node.md) 和[第三方集成](./integrations.md)搭配使用。

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery 节点通过 OAuth2 运行 SQL 查询并向 Google BigQuery 数据集插入行。它适用于分析型 Workflow、报表管道，以及从 Workflow 运行中写入结构化事件数据。它通常与 [Set](../nodes/set-node.md) 搭配以整理行数据，并与 [Google Sheets](../nodes/google-sheets-node.md) 搭配用于更轻量的电子表格导向报表。

可与 [Set](../nodes/set-node.md)、[LLM](../nodes/llm-node.md)、[Google Sheets](../nodes/google-sheets-node.md) 和[第三方集成](./integrations.md)搭配使用。
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive 节点通过 OAuth2 列出、下载、更新和删除 Drive 文件与文件夹，并可通过其 `syncToHeymDrive` 操作将 Drive 文件直接复制到 [Heym Drive](../nodes/drive-node.md)。Google Docs、Sheets 和 Slides 没有可下载的字节内容，因此该节点会自动导出它们——Docs 导出为 PDF，Sheets 导出为 XLSX，Slides 导出为 PPTX——并支持覆盖目标格式。除非启用“Delete permanently”，否则删除操作会将项目移入 Drive 回收站；该节点拒绝通过文件操作删除文件夹，反之亦然。与 [Google Sheets](../nodes/google-sheets-node.md) 类似，它使用由 Google 支持的 OAuth2 凭据；请注意，此凭据请求完整的 Drive 访问权限，因此在共享之前请查阅[凭据共享](./credentials-sharing.md)。

可与 [Loop](../nodes/loop-node.md)、[Drive](../nodes/drive-node.md)、[LLM](../nodes/llm-node.md) 和[第三方集成](./integrations.md)搭配使用。

#### [GitHub](../nodes/github-node.md)

GitHub 节点提供 40 个原生 GitHub REST 操作，涵盖仓库、组织与用户、Issue、Pull Request、审查、Release、Actions Workflow、流量洞察以及仓库文件。可用于 Issue 分类、审查自动化、Workflow 分发与完成等待、Release 自动化以及仓库文件更新，无需手动构建 HTTP 请求。它支持 GitHub.com 以及凭据上可选的 GitHub Enterprise `base_url`。

可与 [Agent 节点](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Set](../nodes/set-node.md) 和[第三方集成](./integrations.md)搭配使用。

#### [Jira](../nodes/jira-node.md)

Jira 节点将 Workflow 连接到 Jira Cloud 或 Jira Data Center / Server REST API，以实现项目、Issue、评论、附件、用户、通知和状态转换的自动化。它可以列出项目、使用 JQL 搜索 Issue、创建或更新 Issue、检查变更日志、通知利益相关者、管理评论和附件、获取或管理用户、列出可用的状态转换，并通过转换 ID 移动 Issue。使用包含 Atlassian 邮箱、API Token、站点 base URL 和部署模式的 Jira 凭据。

可与 [LLM](../nodes/llm-node.md)、[Agent 节点](../nodes/agent-node.md)、[Slack](../nodes/slack-node.md) 和[第三方集成](./integrations.md)搭配使用，用于支持受理、Bug 分类和 Release Workflow。

#### [Linear](../nodes/linear-node.md)

Linear 节点将 Workflow 连接到 Linear 的 GraphQL API，以实现工作区和 Issue 自动化。它可以列出团队、项目、Issue、Workflow 状态、团队成员和评论；创建、更新、删除和关联 Issue；以及创建、更新、解决、取消解决或删除评论。使用 Linear 个人 API Key 或 OAuth2 凭据，然后在创建或更新 Issue 之前，通过列表操作发现团队、项目、状态和负责人的 UUID。

可与 [LLM](../nodes/llm-node.md)、[Agent 节点](../nodes/agent-node.md)、[Slack](../nodes/slack-node.md) 和[第三方集成](./integrations.md)搭配使用，用于受理、分类和工程待办事项 Workflow。

#### [Supabase](../nodes/supabase-node.md)

Supabase 节点读取和修改通过 Supabase PostgREST 暴露的表。它非常适合产品后端、用户/个人资料数据、Workflow 状态以及希望无需自定义 HTTP 请求接线即可访问数据库的 CRUD 式自动化。

可与 [Set](../nodes/set-node.md)、[DataTable](../nodes/datatable-node.md)、[HTTP](../nodes/http-node.md) 和[第三方集成](./integrations.md)搭配使用。

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse 节点通过其 HTTP 接口对外部 ClickHouse 数据库执行 CRUD、count 和原始 SQL 操作。它适用于分析管道、事件日志记录和报告 Workflow：在事件发生时插入事件，然后使用 `query`/`count` 对其进行聚合或计数。它镜像了 [DataTable](../nodes/datatable-node.md) 的操作集（find、getAll、count、getById、insert、update、remove、upsert），并额外提供原始 SQL 逃生通道，其中 `update`/`remove` 以 ClickHouse mutation 方式运行。

可与 [Set](../nodes/set-node.md)、用于定时报告的 [Cron](../nodes/cron-node.md) 以及[第三方集成](./integrations.md)搭配使用。

#### [Notion](../nodes/notion-node.md)

Notion 节点通过当前 Notion API（`2026-03-11`）管理 Notion 数据库、数据源、页面和块。它支持搜索、页面 CRUD、数据库和数据源操作、块子级、追加/更新/删除块以及回收站/恢复。使用内部集成 Token 或 Notion 公共集成 OAuth 凭据。编辑器可以搜索并游标分页访问可访问的数据源和父页面。共享凭据在 Workflow 执行中的工作方式与自有凭据相同。

对于自定义 REST 调用，`$credentials.YourNotionCredential` 会解析为相同的 bearer Token。可与 [Set](../nodes/set-node.md)、[HTTP](../nodes/http-node.md)、[LLM](../nodes/llm-node.md) 和[第三方集成](./integrations.md)搭配使用。
#### [Sentry](../nodes/sentry-node.md)

Sentry 节点通过 Sentry REST API 自动化 Sentry 组织、项目、团队、问题、事件和发布。可用于告警分诊、问题状态更新、发布自动化、事件查询以及项目/团队设置或清理。它支持 Sentry SaaS 和自托管 Sentry，可通过可选的凭据 base URL 进行配置。

可与 [Error Handler](../nodes/error-handler-node.md)、[Slack](../nodes/slack-node.md)、[Linear](../nodes/linear-node.md) 和 [Third-Party Integrations](./integrations.md) 搭配使用，用于事件和发布工作流。

#### [DataTable](../nodes/datatable-node.md)

DataTable 节点读取、写入和管理 Heym DataTables（第一方结构化存储）中的数据。操作包括 find、getAll、getById、insert、update、remove 和 upsert。无需外部凭据。表从 [DataTable](../tabs/datatable-tab.md) 仪表盘标签页进行管理，并由工作流所有者直接访问。

可与 [Set](../nodes/set-node.md)、[Variable](../nodes/variable-node.md) 和 [DataTable 标签页](../tabs/datatable-tab.md) 搭配使用，用于第一方结构化存储。

#### [Drive](../nodes/drive-node.md)

Drive 节点直接从工作流内部管理由技能生成的文件。操作包括 delete、setPassword、setTtl、setMaxDownloads、shareWithMyTeams 和 unshareWithMyTeams，用于只读团队访问管理；格式转换则位于 [Converter](../nodes/converter-node.md) 节点中。使用 `$agentLabel._generated_files[0].id` 引用文件；输出包括 status、file_id、用于链接约束的更新后的 download_url，以及用于团队共享的 shared_team_count。这对于使用 [File Generation](./file-generation.md) 和 [Drive](./drive.md) 引用模型的 [Agent Node](../nodes/agent-node.md) 工作流尤为有用。

常见的搭配节点为 [Agent Node](../nodes/agent-node.md)、[File Generation](./file-generation.md) 和 [Drive](./drive.md)。

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 节点使用 `s3` 凭据（access key、secret key、region、可选的 session token）在 Amazon S3 上执行对象存储操作。操作包括 putObject、getObject、deleteObject、listObjects、copyObject、createBucket、deleteBucket、createFolder、deleteFolder、getAllFolder 和 listBuckets。支持文本上传以及文本或 base64 下载，bucket 和 key 字段接受 [Expression DSL](./expression-dsl.md)。可用于存储工作流输出、归档文件，以及将对象读回流程中。

可与 [Set](../nodes/set-node.md)、[HTTP](../nodes/http-node.md)、[Credentials](./credentials.md) 和 [Third-Party Integrations](./integrations.md) 搭配使用。

### Automation

#### [Crawler](../nodes/crawler-node.md)

Crawler 节点使用 FlareSolverr 抓取网页，并可通过 CSS 选择器进行可选的 HTML 提取。配置 FlareSolverr [凭据](./credentials.md)、URL 表达式、等待时间以及用于提取的可选选择器。输出为原始 HTML 或提取的内容。可用于网页抓取和内容提取。

可与 [HTTP](../nodes/http-node.md)、[Playwright](../nodes/playwright-node.md) 和 [LLM](../nodes/llm-node.md) 搭配使用，用于抓取并分析的流程。

#### [Playwright](../nodes/playwright-node.md)

Playwright 节点通过可配置的步骤（navigate、refresh、click、type、screenshot、extract、aiStep）或 **Run Code** 模式（用于自定义 Playwright Python，沙箱化；默认通过 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED` 关闭）来自动化浏览器交互。它支持 headless 模式、一个可减少常见 Playwright 自动化信号的可选设置、超时、可选的网络捕获（responses、cookies、localStorage、sessionStorage）、从 [Global Variables](./global-variables.md) 表达式（如 `$global.authState`）引导 cookie/storageState 认证、当认证恢复失败时的回退登录步骤，以及当选择器失败时带有 Auto Heal 的 AI 步骤。可用于网页抓取、表单填写和基于浏览器的工作流。

另请参阅 [Crawler](../nodes/crawler-node.md)、[HTTP](../nodes/http-node.md) 和 [Execution History](./execution-history.md)，了解浏览器自动化和调试。

### Utilities

#### [Output](../nodes/output-node.md)

Output 节点是工作流 endpoint，用于向调用方返回响应。将 message 表达式设置为通过标签引用前一个节点（此处切勿使用来自 [Input](../nodes/input-node.md) 节点的 `$input`）。可选的下游异步允许 output 之后的节点在响应发送后在后台运行。

常见的上游来源为 [Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md) 和 [Execute](../nodes/execute-node.md)；响应整形在 [Expression Evaluation Dialog](./expression-evaluation-dialog.md) 中更易于调试。

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper 节点根据 [Set](../nodes/set-node.md) 风格的键值映射构建一个普通 JSON 对象，并在工作流响应的根级别返回它。当 API 调用方应接收原始 JSON 正文而非标准 [Output](../nodes/output-node.md) 节点包装时，可使用此节点。
#### [HTML 输出映射器](../nodes/html-output-mapper-node.md)

HTML 输出映射器节点渲染单个 HTML 模板，将 `$nodeLabel.field` 表达式插值到页面中。当它是工作流的唯一终端节点时，execute webhook 会以 `text/html` 和节点配置的状态码进行响应，而不是返回 JSON 正文，因此工作流可以直接向浏览器提供一个页面。发送 `X-Simple-Response: false` 可获取通常的 JSON 封装以便调试。

与 [Set](../nodes/set-node.md)、[Output](../nodes/output-node.md)、[Workflow Structure](./workflow-structure.md) 和 [Webhooks](./webhooks.md) 配合使用。

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output 节点是 [Dashboard](../tabs/dashboard-tab.md) 小组件工作流的终端节点。它将上游节点产生的行转换为仪表板渲染所用的标准化图表 payload。选择一个 `chartType`（bar、line、area、pie、table、numeric、gauge、scatter、proportion、bar gauge、text 或 HITL），映射 `labelField`/`valueField`（多系列时为 `series`，markdown 消息时为 `text`），并将其放在最后；它没有输出边。HITL 会忽略上游行，并列出你待处理的人工审核。另一列作为可在新标签页中打开 URL 的链接按钮（`linkColumn`，使用 `linkLabel` 指定按钮文本）

另请参阅 [Dashboard](../tabs/dashboard-tab.md)、[Set](../nodes/set-node.md) 和 [Output](../nodes/output-node.md)。

#### [Wait](../nodes/wait-node.md)

Wait 节点将工作流执行暂停指定的毫秒时长，最长 15 分钟。可用于速率限制、延迟操作或轮询间隔。它会原样传递输入。

与 [Cron](../nodes/cron-node.md)、[Redis](../nodes/redis-node.md) 和 [Parallel Execution](./parallel-execution.md) 配合使用，以实现节奏控制和轮询。

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note 节点向画布添加 markdown 注释。它不会被执行。可与其他 [Canvas Features](./canvas-features.md) 一起用于文档、说明或工作流注释。双击画布即可编辑注释内容。

另请参阅 [Canvas Features](./canvas-features.md)、[Keyboard Shortcuts](./keyboard-shortcuts.md) 和 [Workflow Organization](./workflow-organization.md)。

#### [Console Log](../nodes/console-log-node.md)

Console Log 节点将值记录到后端（服务器）控制台。可用于开发期间的调试和检查。日志消息支持 [Expression DSL](./expression-dsl.md) 表达式；输出会原样传递输入。

与 [Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md) 和 [Expression Evaluation Dialog](./expression-evaluation-dialog.md) 配合使用以进行调试。

#### [Disable Node](../nodes/disable-node.md)

Disable Node 节点通过将另一个节点的 `active` 标志设置为 false 来永久禁用该节点。通过标签指定目标节点。可用于一次性操作，例如在满足条件后停止 [Cron](../nodes/cron-node.md) trigger。

另请参阅 [Canvas Features](./canvas-features.md)、[Edit History](./edit-history.md) 和 [Cron](../nodes/cron-node.md)，了解工作流控制模式。

#### [Enable Node](../nodes/enable-node.md)

Enable Node 节点通过将另一个节点的 `active` 标志设置为 true 并保存更改来重新启用该节点。通过标签指定目标节点。可用于从另一个入口点重新启用已禁用的 [Cron](../nodes/cron-node.md) trigger，或在满足条件后开启某个节点。位于 Enable Node 下游且尚未运行的目标节点也会在当前执行中运行。

另请参阅 [Disable Node](../nodes/disable-node.md)、[Canvas Features](./canvas-features.md) 和 [Cron](../nodes/cron-node.md)，了解工作流控制模式。

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error 节点立即停止工作流执行，并返回带有自定义 HTTP 状态码的错误响应。设置错误消息表达式和状态码（例如 400、401、403、404、429、500）。可用于验证失败、未授权访问或其他错误情况，尤其适合与 [Condition](../nodes/condition-node.md) 和 [Error Handler](../nodes/error-handler-node.md) 配合使用。

与 [Condition](../nodes/condition-node.md)、[Error Handler](../nodes/error-handler-node.md) 和 [Security](./security.md) 配合使用，以构建显式的失败路径。

---

## Reference
### [节点类型](./node-types.md)

Heym 提供多种节点类型：Trigger 类节点，如 [Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Slack Trigger](../nodes/slack-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md) 和 [Error Handler](../nodes/error-handler-node.md)；AI 类节点，如 [LLM](../nodes/llm-node.md)、[Decision](../nodes/decision-node.md)、[Agent Node](../nodes/agent-node.md)、[Codex](../nodes/codex-node.md)、[OpenCode Go](../nodes/opencode-go-node.md)、[Qdrant RAG](../nodes/rag-node.md) 和 [MCP Call](../nodes/mcp-call-node.md)；逻辑类节点，如 [Condition](../nodes/condition-node.md)、[Switch](../nodes/switch-node.md)、[Merge](../nodes/merge-node.md) 和 [Loop](../nodes/loop-node.md)；数据类节点，如 [Set](../nodes/set-node.md)、[Converter](../nodes/converter-node.md)、[Code](../nodes/code-node.md)、[Variable](../nodes/variable-node.md)、[Execute](../nodes/execute-node.md) 和 [Heym](../nodes/heym-node.md)；集成类节点，如 [HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md)、[Jira](../nodes/jira-node.md)、[Linear](../nodes/linear-node.md)、[Notion](../nodes/notion-node.md)、[Sentry](../nodes/sentry-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、[Discord](../nodes/discord-node.md)、[Send Email](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md)、[Grist](../nodes/grist-node.md)、[Google Sheets](../nodes/google-sheets-node.md)、[Google Drive](../nodes/google-drive-node.md)、[BigQuery](../nodes/bigquery-node.md)、[Supabase](../nodes/supabase-node.md)、[ClickHouse](../nodes/clickhouse-node.md)、[DataTable](../nodes/datatable-node.md) 和 [Drive](../nodes/drive-node.md)；自动化类节点，如 [Crawler](../nodes/crawler-node.md) 和 [Playwright](../nodes/playwright-node.md)；以及实用工具类节点，如 [Wait](../nodes/wait-node.md)、[Output](../nodes/output-node.md)、[JSON output mapper](../nodes/json-output-mapper-node.md)、[HTML output mapper](../nodes/html-output-mapper-node.md)、[Console Log](../nodes/console-log-node.md)、[Throw Error](../nodes/throw-error-node.md)、[Disable Node](../nodes/disable-node.md)、[Enable Node](../nodes/enable-node.md) 和 [Sticky Note](../nodes/sticky-note-node.md)。在节点配置中使用 `$input.text` 和 `$nodeLabel.field` 等表达式。

另请参阅 [Triggers](./triggers.md)、[Third-Party Integrations](./integrations.md) 和 [Parallel Execution](./parallel-execution.md)。

### [Expression DSL](./expression-dsl.md)

Heym 使用一种简单的表达式语言来引用上游节点的数据。使用 `$input` 引用 [Input](../nodes/input-node.md) 节点，使用 `$nodeLabel.field` 引用任意上游节点，使用 `$credentials.CredentialName` 引用[凭据](./credentials.md)，使用 `$global.variableName` 引用[全局变量](./global-variables.md)。内置特殊变量包括 `$now`、`$UUID` 以及 Workflow 元数据：`$workflowName`、`$workflowDescription`、`$workflowPath`、`$workflowUrl` 和 `$executionId`（该次运行的 [Execution History](./execution-history.md) id —— `/workflows/{id}/{executionId}` 会在画布上打开该次运行；仅限运行时，在表达式预览对话框中为空）。支持的功能包括字面量、算术运算、比较运算、[Loop](../nodes/loop-node.md) 上下文、嵌套字段以及字符串/数组辅助函数（包括用于解析 JSON 字符串的 `$text.toJson()`）。当完整值为单个 `$expr` 时，后端会将数组、对象、布尔值和数字保留为原生类型。

另请参阅 [Expression Evaluation Dialog](./expression-evaluation-dialog.md)、[Global Variables](./global-variables.md) 和 [Workflow Structure](./workflow-structure.md)。

### [全局变量](./global-variables.md)

全局变量存储（Global Variable Store）保存持久的、用户作用域的键值数据，这些数据可跨 Workflow 执行而存续。可从 [Variables](../tabs/global-variables-tab.md) 标签页创建变量，也可在启用“Store in Global Variable Store”的 [Variable](../nodes/variable-node.md) 节点中创建变量。在表达式中使用 `$global.variableName` 访问它们；这些变量可与其他用户或[团队](./teams.md)共享。

与 [Variable](../nodes/variable-node.md)、[Teams](./teams.md) 和 [Credentials Sharing](./credentials-sharing.md) 配合使用，以实现共享的 Workflow 状态。
### [表达式求值对话框](./expression-evaluation-dialog.md)

表达式求值对话框是一个可展开的编辑器，当你点击表达式字段旁边的展开按钮时会出现。它以大型居中模态框的形式打开，保持自动补全功能处于激活状态，并在你停止输入后自动刷新后端预览输出。对象和数组结果可通过输出路径选择器进行浏览。该对话框接受整行裸点路径（例如 `myNode.output.field`），如同 `$myNode.output.field` 一样；请参阅[表达式 DSL](./expression-dsl.md) 的放置规则。

工具栏中的 **Build with AI** 按钮允许你用纯文本描述所需的表达式。选择一个 LLM [凭证](./credentials.md)和模型，输入描述，例如 *"Get the customer name from the API response"*，然后点击 Generate。后端会将[表达式 DSL](./expression-dsl.md) 上下文和最近一次运行的节点输出发送给模型，并返回单个表达式字符串。结果会立即求值，以便你在点击 Apply 之前进行验证。

与[表达式 DSL](./expression-dsl.md)、[Output](../nodes/output-node.md) 和 [JSON 输出映射器](../nodes/json-output-mapper-node.md) 自然搭配使用。

### [Workflow 结构](./workflow-structure.md)

Workflow 以 JSON 格式存储，包含节点和边。Workflow 对象包括 id、name、description、nodes、edges 和 auth 设置。每个节点具有 id、type、position 和 data（label 及类型特定的配置）。边通过可选的 handle ID 连接源节点和目标节点 ID。data 字段中的表达式语法遵循[表达式 DSL](./expression-dsl.md)，[下载与导入](./download-import.md) 也使用相同的结构。

另请参阅[节点类型](./node-types.md)、[表达式 DSL](./expression-dsl.md) 和[下载与导入](./download-import.md)。

### [画布功能](./canvas-features.md)

将鼠标悬停在任何非便签画布节点上，然后点击 **Run** 以执行到该节点为止。必需的输入会在 Run 面板中打开，第一个字段自动获得焦点；没有输入的路径会立即开始执行。请参阅[运行到节点](./canvas-features.md#run-to-node)。

Workflow 编辑器提供数据固定（固定节点的最后一次输出，以便在不重新运行的情况下测试下游）、执行日志（实时节点结果和 Agent 进度，作为[执行历史](./execution-history.md) 的补充）、启用/禁用（在执行期间跳过节点）以及提取为子 Workflow（将所选内容移入新的 Workflow 并替换为一个 [Execute](../nodes/execute-node.md) 节点）。正在运行的生产执行可以从 History 或 Board 卡片中打开；编辑器会恢复其当前快照，附加到 SSE，并保持画布动画和 Debug 日志实时更新。[键盘快捷键](./keyboard-shortcuts.md) 支持复制、粘贴、运行和内联节点搜索。

另请参阅[键盘快捷键](./keyboard-shortcuts.md)、[编辑历史](./edit-history.md) 和[执行历史](./execution-history.md)。

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [键盘快捷键](./keyboard-shortcuts.md)

Heym 在编辑器中提供多种快捷键：命令面板（Ctrl+K）、运行（Ctrl+Enter）、保存（Ctrl+S）、撤销/重做以及 Escape 关闭。在画布上：全选、多选、复制/剪切/粘贴、删除、切换节点启用状态（D）、切换固定数据（P）以及通过输入进行内联节点搜索。快捷键已在应用内参考文档中记录，并与[画布功能](./canvas-features.md)（如数据固定和节点启用/禁用）紧密配合。

另请参阅[画布功能](./canvas-features.md)、[快速抽屉](./quick-drawer.md) 和[上下文展示](./contextual-showcase.md)。

### [AI 助手](./ai-assistant.md)

AI 助手是一个从 Debug 面板打开的聊天面板，允许你使用自然语言创建或修改 Workflow。选择一个[凭证](./credentials.md)和模型，然后描述你的需求；AI 会流式输出响应，代码块中任何有效的 [workflow JSON](./workflow-structure.md) 都会被自动解析并应用到画布上。兼容的浏览器支持语音输入。

开启 **YOLO 模式**（Agent 模式，默认关闭）后，助手会测试其构建的内容。每次更改后，它会在画布上运行 Workflow，读取结果并修复 Workflow，直到实现你的要求，每条消息最多运行 5 次。它会在首次运行前请求测试输入，在需要其他 Workflow 的结果时可以运行它们，并展示每一步的工作过程。请参阅 [AI 助手 › YOLO 模式](./ai-assistant.md#yolo-mode)。

点击画布上任何节点上方的 **AI** 即可仅更改或修复该节点。面板会显示其正在修改的节点（运行后带有其最新结果），并提供 **Change this node as ...**、**Fix error in this node ...** 和 **Other**。仅该节点会被更新；工作流的其余部分和布局保持原样。请参阅 [AI Assistant › 修改单个节点](./ai-assistant.md#changing-one-node)。

当 Workflow 需要存储记录时，助手会询问使用哪个[数据表](../tabs/datatable-tab.md)，或者创建一个包含 Workflow 所需列的数据表。请参阅 [AI 助手 › 数据表](./ai-assistant.md#data-tables)。

当当前 Workflow 包含 [Agent 节点](../nodes/agent-node.md) 技能时，助手仅将每个技能的 `SKILL.md` 发送到 Workflow 上下文中。附加的 `.py` 文件和二进制技能资源会在请求前被排除，以避免大型技能包溢出模型上下文窗口。

与[与 Heym 对话](./chat-with-heym.md)、[Agent 架构](./agent-architecture.md) 和[表达式 DSL](./expression-dsl.md) 搭配使用效果良好。
### [与 Heym 对话](./chat-with-heym.md)

与 Heym 对话是一个用于产品问题的文档页眉助手。它会在居中的对话框中打开，将凭证和模型选择保持在顶部可见，将当前文档页面路径作为上下文注入，并在对话框关闭时清除消息历史。它是对更广泛的 [AI Assistant](./ai-assistant.md) 和更轻量的 [Contextual Showcase](./contextual-showcase.md) 的补充。

另请参阅 [AI Assistant](./ai-assistant.md)、[Contextual Showcase](./contextual-showcase.md) 和 [节点类型](./node-types.md)。

### [Workflow 组织](./workflow-organization.md)

实例管理员（`HEYM_ADMIN_EMAILS`）可以访问和编辑每个 workflow，通过邮箱查找某个所有者的 workflow，检查调度和执行历史，暂停和恢复自动 Trigger，并在运行结束后删除 workflow。有关离职流程以及暂停自动 Trigger 与阻止所有调用之间的区别，请参阅[实例管理](../tabs/workflows-tab.md#instance-administration)。

Workflow 可以按树形结构组织在文件夹和子文件夹中。文件夹具有名称和可选的父级；workflow 被分配到文件夹中。Workflow 可以被安排删除（在永久移除之前移至回收站区域）。API 支持创建、更新、删除以及在文件夹之间移动 workflow，相同的组织模型也出现在 [Workflows](../tabs/workflows-tab.md) 标签页中。

另请参阅 [快速抽屉](./quick-drawer.md)、[下载与导入](./download-import.md) 和 [编辑历史](./edit-history.md)。

### [快速抽屉](./quick-drawer.md)

快速抽屉是一个固定的右侧快速运行面板，适用于内部非画布页面。它让你可以搜索 [workflow](../tabs/workflows-tab.md)、固定收藏、选择输入、立即运行，并在不打开编辑器的情况下检查进度或结果。带有 [File Upload Trigger](../nodes/file-upload-trigger-node.md) 的 workflow 可接收拖放或选择的文件。固定顺序和最后选择的 workflow 存储在浏览器中。

另请参阅 [Workflow 组织](./workflow-organization.md)、[键盘快捷键](./keyboard-shortcuts.md) 和 [执行历史](./execution-history.md)。

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase 是一个紧凑的应用内引导栏，适用于已认证的主要界面，例如仪表板标签页、[Evals](../tabs/evals-tab.md)、文档和 workflow 编辑器。它默认保持关闭，首先提供简短的页面摘要，按需提供少量额外细节，并在你需要更深入指导时链接到完整的文档文章。

与 [与 Heym 对话](./chat-with-heym.md)、[快速抽屉](./quick-drawer.md) 和 [AI Assistant](./ai-assistant.md) 配合，形成应用内引导流程。

### [凭证](./credentials.md)

凭证存储 workflow 节点使用的 API 密钥和机密信息。在 [Credentials](../tabs/credentials-tab.md) 标签页中添加它们，并在 [LLM](../nodes/llm-node.md)、[Agent 节点](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Telegram](../nodes/telegram-node.md)、[发送邮件](../nodes/send-email-node.md) 和 [Redis](../nodes/redis-node.md) 等节点中通过名称或 ID 引用它们。它们静态加密，可以与用户或[团队](./teams.md)共享，也可以通过 `$credentials.Name` 在 [Expression DSL](./expression-dsl.md) 中引用。

另请参阅 [Credentials](../tabs/credentials-tab.md)、[凭证共享](./credentials-sharing.md) 和 [第三方集成](./integrations.md)。

### [凭证共享](./credentials-sharing.md)

凭证可以通过邮箱与其他用户共享，或与团队共享；当凭证与团队共享时，所有团队成员都会获得访问权限。共享的凭证会在 [Credentials](../tabs/credentials-tab.md) 标签页中显示指示标记。在运行时，workflow 所有者的上下文会合并其拥有的、用户共享的和团队共享的凭证。在表达式中使用 `$credentials.CredentialName`，或在节点数据中设置 credentialId。

另请参阅 [凭证](./credentials.md)、[团队](./teams.md) 和 [第三方集成](./integrations.md)。

### [团队](./teams.md)

团队让你可以一次性与一组用户共享 workflow、凭证、全局变量、向量存储和 Drive 文件。从 [Teams](../tabs/teams-tab.md) 标签页创建团队，并通过邮箱添加成员。从相关的共享对话框中与团队共享资源；所有成员随后便拥有访问权限。创建者可以编辑和删除团队；删除团队会移除所有团队共享。

与 [凭证共享](./credentials-sharing.md)、[全局变量](./global-variables.md) 和 [企业版](./enterprise.md) 配合使用。

### [并行执行](./parallel-execution.md)

当节点之间没有依赖关系时，Heym 会并行运行它们。执行器构建 DAG，并使用线程池并发运行同一层级的节点；一旦某个节点完成，其下游节点就会被调度。在需要时，使用 [Merge](../nodes/merge-node.md) 节点来合并并行分支。多个 workflow 运行会并发执行；每次运行都是隔离的。[SSE Streaming](./sse-streaming.md) 模式会在节点完成时发出事件。

另请参阅 [Merge](../nodes/merge-node.md)、[Loop](../nodes/loop-node.md) 和 [执行历史](./execution-history.md)。
### [Agent 架构](./agent-architecture.md)

[Agent 节点](../nodes/agent-node.md) 支持子 Agent（编排器通过 call_sub_agent 调用其他 Agent 节点）、子 Workflow（Agent 通过 call_sub_workflow 调用其他 Workflow）、技能（来自 .zip 或 .md 的指令内容和 Python 工具），以及 [MCP](../tabs/mcp-tab.md) 客户端连接。编排器工具执行器负责路由子 Agent 和子 Workflow 调用；其他工具则交由 Python、MCP 或技能执行器处理。子 Agent 和子 Workflow 的最大嵌套深度为 5。工具调用循环包含自动上下文压缩：在每次迭代之前，会估算 Token 用量，如果超过模型上下文窗口的 80%，则使用同一模型对中间消息进行摘要，同时保持系统 Prompt、首条用户消息和末条用户消息不变。

另请参阅 [Agent 节点](../nodes/agent-node.md)、[Agent 持久记忆](./agent-persistent-memory.md)、[Human-in-the-Loop](./human-in-the-loop.md) 和 [MCP](../tabs/mcp-tab.md)。

### [Agent 持久记忆](./agent-persistent-memory.md)

可选的按 [Agent 节点](../nodes/agent-node.md) 配置的知识图谱，存储于 Postgres 中：包含实体、类型、属性和有向关系。当 `persistentMemoryEnabled` 为 true 时，每次运行时会将图谱摘要写入系统 Prompt；在成功完成后，由 [LLM](../nodes/llm-node.md) 在后台提取结构化更新。REST CRUD 位于 `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`。编辑器可通过节点上的粉色大脑控件打开。

另请参阅 [Agent 节点](../nodes/agent-node.md)、[Agent 架构](./agent-architecture.md) 和 [Traces](../tabs/traces-tab.md)。

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop 允许 [Agent 节点](../nodes/agent-node.md) 在特定检查点请求审批，创建一个公开的 `/review/{token}` 页面，并等待未登录的审核者接受、编辑或拒绝 Markdown 审核文本。启用 HITL 的 Agent 还会暴露一个 `review` 输出句柄，以便在运行挂起期间通知 [Slack](../nodes/slack-node.md)、[Send Email](../nodes/send-email-node.md) 或其他渠道。节点级别的 HITL 文本用作审批指南，而公开页面摘要则根据审核请求本身生成。挂起的运行会立即出现在 [执行历史](./execution-history.md) 中，同一次运行中可能发生多次，并且在每次决策提交后从存储的 Workflow 快照精确恢复。

另请参阅 [Agent 节点](../nodes/agent-node.md)、[Portal](./portal.md)、[执行历史](./execution-history.md) 和 [Send Email](../nodes/send-email-node.md)。

### [Webhook](./webhooks.md)

Workflow 可通过 [HTTP](../nodes/http-node.md) 在 `POST /api/workflows/{workflow_id}/execute` 触发，或通过 `POST /api/workflows/{workflow_id}/execute/stream` 进行增量流式传输。请求体作为 body 传递给 [Input](../nodes/input-node.md) 节点；headers 和 query params 可在 [Expression DSL](./expression-dsl.md) 表达式中使用。可按 Workflow 配置认证方式：匿名、JWT 或自定义 header。可选的响应缓存、速率限制以及编辑器中的 Run with cURL 对话框均位于 Workflow 层面，并同时适用于两种模式。

另请参阅 [Input](../nodes/input-node.md)、[执行 Token](./execution-tokens.md)、[SSE 流式传输](./sse-streaming.md)、[HTTP](../nodes/http-node.md) 和 [Workflow 结构](./workflow-structure.md)。

### [执行 Token](./execution-tokens.md)

执行 Token 是作用域受限的 JWT，授予对单个 Workflow 的 execute 和 stream Endpoint 的访问权限。当 Workflow 使用 JWT 认证时，Token 允许外部脚本、CI 流水线和集成调用该 Workflow，而无需共享用户会话。每个 Token 携带一个 `wid` 声明，将其绑定到单个 Workflow；一个 `jti` 用于即时撤销；以及可配置的 TTL（60 秒至 10 年）。可直接在 **Run with cURL** 对话框中创建、选择和撤销 Token——所选 Token 会自动嵌入生成的命令中。

另请参阅 [Webhook](./webhooks.md)、[安全](./security.md) 和 [SSE 流式传输](./sse-streaming.md)。

### [SSE 流式传输](./sse-streaming.md)

cURL 对话框可将 [Webhook](./webhooks.md) 执行切换为 Server-Sent Events 模式。这会实时产生 `execution_started`、`node_start`、`node_complete` 和 `execution_complete` 事件，在生成的 cURL 命令中添加 `--no-buffer`，并允许你为每个节点配置启动消息，例如 `[START] LLM` 或供外部终端消费者使用的自定义文本。

另请参阅 [Webhook](./webhooks.md)、[执行历史](./execution-history.md) 和 [LLM](../nodes/llm-node.md)。
### [Triggers](./triggers.md)

Workflow 由 Trigger 节点（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md) 接收）或入口点启动：[Webhook/API](./webhooks.md)、[MCP](../tabs/mcp-tab.md)、[Portal](./portal.md)、Cron 调度器、Telegram webhook、Discord interaction webhook、IMAP trigger 管理器、RabbitMQ 消费者或编辑器运行。每个 Trigger 都有自己的 Endpoint 或后台进程；[Cron](../nodes/cron-node.md) 每 60 秒运行一次，[Telegram Trigger](../nodes/telegram-trigger-node.md) 节点接收 bot webhook，[Discord Trigger](../nodes/discord-trigger-node.md) 节点接收已签名的 interaction webhook，[IMAP Trigger](../nodes/imap-trigger-node.md) 节点按其配置的轮询间隔运行。[Input](../nodes/input-node.md) 节点从 webhook 请求中接收 body、headers 和 query。

另请参阅 [Node Types](./node-types.md)、[Webhooks](./webhooks.md) 和 [Parallel Execution](./parallel-execution.md)。

### [Execution History](./execution-history.md)

Execution history 记录 workflow 运行：输入、输出、节点结果、状态和 Trigger 来源。可从编辑器工具栏、Docs 视图、Dashboard 头部或 [Evals](../tabs/evals-tab.md) 视图访问。按 workflow 查看的历史记录显示当前打开的 workflow 的运行；全部历史记录视图显示跨 workflow 和聊天的运行。当前正在运行的执行会出现在两个对话框的顶部，并带有 **Open live** 和 **Cancel** 操作。Open live 通过 [SSE](./sse-streaming.md) 将编辑器附加到现有执行，恢复已完成的节点，对当前和待处理的节点进行脉冲提示，并追加 Debug 日志，而不会启动另一次运行。Bring to Canvas 加载已完成运行的输入和节点输出，以便重新运行或调试；深层链接 `/workflows/{workflowId}/{executionId}` 同时支持实时执行和已完成的执行。[Human-in-the-Loop](./human-in-the-loop.md) 暂停的运行会立即存储为 `pending`，包括公开审查 URL 以及从 agent 的 `review` 分支执行的任何通知节点。如果服务器在运行中途重启，中断的运行会自动恢复：它们会使用相同的输入从头重新运行，并显示为已完成（标记为 **Recovered**），由每个 workflow 的 **Auto-recover runs** 开关控制，该开关也可以改为将其记录为 `skipped`。

另请参阅 [SSE Streaming](./sse-streaming.md)、[Human-in-the-Loop](./human-in-the-loop.md) 和 [Traces](../tabs/traces-tab.md)。

### Execution Highlights

在实时运行之后——或在 **Bring to Canvas** 之后——Canvas 右上角会出现一个可关闭的 **Execution Highlights** 弹窗，按执行顺序列出每个节点产生的内容。这是一种无需打开每个节点即可快速检查各节点输出的方式；使用 **✕** 关闭它，它会在下次运行时重新打开。Highlights 也会显示在 dashboard 运行中。详情请参阅 [Execution History](./execution-history.md)。

### [Edit History](./edit-history.md)

Edit History 跟踪 workflow 的已保存版本（每次 Save 都会创建一个版本）。查看列表，打开某个版本以查看与当前 workflow 的差异（[nodes](./workflow-structure.md)、edges、config），并通过 Revert 恢复过去的版本。与 [Execution History](./execution-history.md) 不同，Edit History 跟踪的是结构变更，而非运行。

另请参阅 [Execution History](./execution-history.md)、[Workflow Structure](./workflow-structure.md) 和 [Canvas Features](./canvas-features.md)。

### Error Workflow

一个 workflow 可以指定另一个 workflow 在其失败时运行。在 workflow 级别的 **Properties** 面板中（未选中任何节点时显示）的 **On error, run workflow** 下进行配置。只有 workflow 所有者可以设置、更改或清除它；请参阅 [Owner-only settings](./workflow-organization.md#owner-only-settings)。当顶层运行以未处理的失败结束时，所选的 error workflow 会运行并接收失败上下文（失败的 workflow id 和名称、运行 id、错误消息、失败的节点标签和类型，以及时间戳）。如果 Canvas 中已包含 [Error Handler](../nodes/error-handler-node.md) 节点，则本地处理器优先，error workflow **不会**被调用。error workflow 本身直接运行，因此它永远不会触发自己的 error workflow。

它涵盖每一次非测试的顶层运行：两个 execute Endpoint、[Portal](./portal.md)，以及每一个 Trigger，包括 [cron](../nodes/cron-node.md)、聊天平台 Trigger、电子邮件、队列、[MCP](../tabs/mcp-tab.md) 和 dashboard 小部件。启用 [Load Distribution](./cluster.md) 后这一点保持不变，包括由 worker 执行的运行：失败的节点会随结果一起返回，然后 error workflow 像任何其他运行一样被分发，因此其中必须在主实例上运行的节点仍然会在主实例上运行。有两种情况被有意排除在外，因为 workflow 自身的结果尚不可知：没有任何实例执行过的运行，以及运行可能仍在进行时超时的等待。它**也**不会由手动 Canvas 测试运行触发。
### Workflow 超时

每个 Workflow 都可以在 Workflow 级别的 **Properties** 面板中设置 **Workflow 超时**（以秒为单位）。`0`（默认值）表示禁用。设置后，超过限制的运行会在下一个节点边界处停止，并记录为带有“timed out”错误的失败运行。该超时适用于手动、API 和 Trigger 触发的运行。较长的 [Wait](../nodes/wait-node.md) 节点会被及时中断，而不会阻塞至其完整时长。

### 节省时间

每个 Workflow 都可以记录 **每次运行预计节省的时间**（以分钟为单位），在 Workflow 级别的 **Properties** 面板中设置。[Analytics](../tabs/analytics-tab.md) 标签页会在所选范围内将其汇总为 **Time Saved** 总计统计（每个 Workflow 的估算值 × 其成功运行次数之和）。Most Used 也会按 Workflow 列出该汇总值；当估算值未设置时，**Not Set** 会打开该估算字段。[Workflow Analysis](./workflow-analysis.md) 报告建议在未配置估算值时进行设置。

### [Settings](./user-settings.md)

Settings 对话框（从页眉中的头像打开）包含四个标签页：Profile（Gravatar 头像、显示名称、User Rules）、[Security](./security.md)（修改密码）、Voice（[ElevenLabs TTS/STT](./chat-voice.md)）和 Observability（只读的 [OpenTelemetry](./opentelemetry.md) 状态）。User Rules 是注入到每个 AI 请求中的自定义指令，包括 Workflow 构建器和 [Chat](../tabs/chat-tab.md)，因此你可以一次性设置语言、语气、编码风格或 Workflow 约定。密码策略和 [MCP](../tabs/mcp-tab.md) API 密钥管理也可在此处使用。

另请参阅 [Security](./security.md)、[Chat Voice](./chat-voice.md)、[OpenTelemetry Tracing](./opentelemetry.md) 和 [AI Assistant](./ai-assistant.md)。

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym 可以为每次 Workflow 运行和节点执行发出 OpenTelemetry 追踪：每次运行有一个根 `heym.workflow.execute` span，每个节点有一个子 `heym.node.execute` span，模型和 Token 用量会附加到 LLM 和 Agent 节点上。Span 通过 OTLP/HTTP 导出到任何兼容的后端（Jaeger、Grafana Tempo、Honeycomb、Datadog），并且 W3C trace context 会在入站 Webhook、出站 HTTP 和子 Workflow 之间传播。追踪默认禁用，通过 `HEYM_OTEL_*` [环境变量](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)进行配置；当前状态显示在 [Settings](./user-settings.md) 的 Observability 标签页中。

另请参阅 [Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md) 和 [Webhooks](./webhooks.md)。

### [Download & Import](./download-import.md)

从编辑器工具栏（Download 按钮）将当前 Workflow 导出为 JSON；该文件包含节点和边。通过将 JSON 文件拖放到 [Workflows](../tabs/workflows-tab.md) 标签页（创建新 Workflow）或拖放到画布上（替换或合并）来导入。JSON 必须包含 nodes 数组；name 和 edges 是可选的。可用于备份、共享或在实例之间迁移。

另请参阅 [Workflow Structure](./workflow-structure.md)、[Workflows](../tabs/workflows-tab.md) 和 [Canvas Features](./canvas-features.md)。

### [Portal](./portal.md)

Portal 将 Workflow 作为公共聊天 UI 暴露在 `/chat/{slug}`。可以为每个 Workflow 配置 portal_enabled、slug、可选认证（Portal 用户）、流式传输和文件上传。最终用户通过聊天界面进行交互，无需登录 Heym；图像输出可以显示在聊天中。当 [Agent 节点](../nodes/agent-node.md)需要审批时，Portal Workflow 还可以移交到 [Human-in-the-Loop](./human-in-the-loop.md) 审核页面，同时 Agent 的 `review` 分支会向其他渠道发送通知。可用于内部工具、面向客户的聊天机器人和 AI 驱动的表单。

另请参阅 [Human-in-the-Loop](./human-in-the-loop.md)、[Agent 节点](../nodes/agent-node.md) 和 [Drive](./drive.md)。

### [File Generation](./file-generation.md)

Skills 可以在执行期间通过写入 `_OUTPUT_DIR` 工作区来生成 PDF、DOCX、CSV、JSON 和图像等文件。Heym 会自动捕获这些文件、存储它们，并在 `_generated_files` 下暴露下载元数据，随后可以使用 [Drive 节点](../nodes/drive-node.md)进行管理，或在 [Drive](../tabs/drive-tab.md) 标签页中查看。

另请参阅 [Agent 节点](../nodes/agent-node.md)、[Drive](./drive.md) 和 [Drive 节点](../nodes/drive-node.md)。

### [Drive](./drive.md)

Drive 是 Skills 生成文件的共享存储和共享层。它允许你浏览文件、创建公开或密码保护的链接、应用过期和下载限制、以只读方式与团队共享文件，并通过 [Drive 节点](../nodes/drive-node.md)以编程方式或从 [Drive](../tabs/drive-tab.md) 标签页手动管理这些文件。

另请参阅 [Drive](../tabs/drive-tab.md)、[File Generation](./file-generation.md) 和 [Portal](./portal.md)。
### [Security](./security.md)

Heym 强制执行密码策略（长度、大写字母、小写字母、数字），将访问 Token 存储在 HttpOnly Cookie 中，并在每次使用时轮换刷新 Token。速率限制适用于登录、注册和 [Portal](./portal.md) 登录。[Credentials](./credentials.md) 使用 AES-256（Fernet）进行静态加密。[MCP](../tabs/mcp-tab.md) API key 用于客户端认证；内容安全可通过 [LLM](../nodes/llm-node.md) 和 [Agent Node](../nodes/agent-node.md) 节点上的 [Guardrails](./guardrails.md) 实现。[Execution Tokens](./execution-tokens.md) 为外部调用方提供按 Workflow 作用域限定的 JWT。

另请参阅 [Execution Tokens](./execution-tokens.md)、[Guardrails](./guardrails.md)、[Portal](./portal.md) 和 [Credentials](./credentials.md)。

### [Single Sign-On](./sso.md)

Heym 可对接任何外部 OpenID Connect 提供商进行人员认证——Keycloak、Okta、Entra ID、Auth0、Google——由 `HEYM_ADMIN_EMAILS` 中列出的实例管理员在运行时通过 **Settings → SSO** 进行配置。只需输入 issuer URL 和客户端凭证；所有 Endpoint 均来自提供商的发现文档，因此没有任何提供商被硬编码。登录使用带 PKCE 的 Authorization Code 流程，ID Token 会根据提供商公布的密钥进行验证。账户首先按 `(issuer, subject)` 映射，其次按已验证的邮箱映射，可选的自动配置仅限于邮箱域名允许列表。密码登录与 SSO 并存，在连接测试通过后可关闭密码登录，但 `HEYM_ADMIN_EMAILS` 中的账户除外，以防止配置错误的提供商导致实例被锁定。

另请参阅 [Settings](./user-settings.md)、[Security](./security.md) 和 [Audit Logging](./audit.md)。

### [Load Distribution](./cluster.md)

将第二个 Heym 实例指向同一个数据库，它便会作为 worker 加入。后台运行——cron、Webhook、MCP 工具调用、聊天 Trigger——由实例管理员在 **Settings → Instances** 中设置的百分比在实例之间共享，每个实例的状态、数据库延迟和版本显示在同一张表中。实例之间从不互相通信：Postgres 承载工作负载，因此 worker 无需开放端口，也无需回连主实例的路由。涉及本地文件、编码 Agent 工作区或已安装插件的工作始终在主实例上运行，面板会报告过去 24 小时内此类工作所占的比例，以便运维人员判断何时百分比分配无法解决问题。历史记录中的每次运行都会标明执行它的实例，两个历史记录对话框均可按实例筛选。

另请参阅 [Settings](./user-settings.md)、[Traces](../tabs/traces-tab.md) 和 [Analytics](../tabs/analytics-tab.md)。

### [Third-Party Integrations](./integrations.md)

Heym 通过存储在 [Credentials](../tabs/credentials-tab.md) 标签页中的凭证（静态加密）连接外部服务。支持的凭证类型包括 OpenAI、Google、用于 [Decision 节点](../nodes/decision-node.md)的 Decision Model、用于自动模型选择的 Model Router（见下文）、用于 [GitHub 节点](../nodes/github-node.md)和 MCP 集成的 GitHub、用于 [Jira 节点](../nodes/jira-node.md)的 Jira、用于 [Notion 节点](../nodes/notion-node.md)的 Notion、Custom LLM、Cohere、RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、[Grist](../nodes/grist-node.md)、用于 [Send Email](../nodes/send-email-node.md)的 SMTP、[RabbitMQ](../nodes/rabbitmq-node.md)、[Redis](../nodes/redis-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、Bearer、Header，以及用于 [Crawler](../nodes/crawler-node.md)的 FlareSolverr。每种类型都记录了必填字段；凭证可与用户或[团队](./teams.md)共享，并可在节点中按名称引用，或在表达式中以 `$credentials.Name` 引用。

### Model Router (Auto Model)

**Model Router** 凭证按请求选择模型，而非持有密钥。它存储一个决策模型凭证以及一组你现有的 OpenAI/Google/Custom 凭证，每个凭证都带有说明何时应使用它的条件，并在每个模型选择器中以名为 **Auto** 的单一模型出现。

Traces、画布 Execution Log 和 Span View 会同时显示选择的两部分，例如 `Auto Model / GPT-5`，而成本仍归属于实际运行的模型。Auto Model 不能与 Responses API、Batch 模式或图像输出组合使用。完整行为请参阅 [Credentials](./credentials.md)。

另请参阅 [Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 和 [Teams](./teams.md)。

### [Guardrails](./guardrails.md)

Guardrails 在不受欢迎或不安全的用户消息到达 [LLM](../nodes/llm-node.md) 或 [Agent Node](../nodes/agent-node.md) 之前将其拦截。可按节点启用并选择要拦截的类别（例如暴力、仇恨言论、色情内容、自残、骚扰、非法活动）。设置敏感度（低、中、高）。触发时，节点会抛出错误，你可以用 [Error Handler](../nodes/error-handler-node.md) 捕获。检测根据凭证类型使用提供商的 moderation API 或 LLM 分类。

另请参阅 [Security](./security.md)、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md) 和 [Error Handler](../nodes/error-handler-node.md)。
### [Enterprise](./enterprise.md)

Enterprise 涵盖面向在生产环境中运行 Heym 的团队提供的商业许可、专业支持和部署服务。它包括工作流架构协助、入门引导、Kubernetes 与扩展指导、优先支持，以及围绕 [Agent Node](../nodes/agent-node.md)、[Human-in-the-Loop](./human-in-the-loop.md)、[Parallel Execution](./parallel-execution.md) 和 [Portal](./portal.md) 等高级功能的定制开发。

另请参阅 [Running & Deployment](../getting-started/running-and-deployment.md)、[Security](./security.md) 和 [Teams](./teams.md)。

### [Heym Work](./heym-work.md)

Heym Work 是构建在 Heym 之上的面向业务团队的第二界面。用户只需描述工作内容、回答几个问题即可获得经过测试的 workflow，随后通过页面、审批以及每次运行都带有名称的活动列表开展工作。实例管理员可在**设置 → Heym Work** 中使用其地址和集成密钥进行连接；它拥有来自 Heym 团队的独立许可证。

另请参阅 [Enterprise](./enterprise.md)、[Single Sign-On](./sso.md) 和 [Human-in-the-Loop](./human-in-the-loop.md)。

---

## Dashboard Tabs

### [Workflows](../tabs/workflows-tab.md)

Workflows 标签页是默认的仪表盘视图。它显示一个双窗格列表：左侧以紧凑行形式展示工作流和文件夹，右侧显示所选工作流的预览，包括其 Trigger、上次运行和步骤，以及 Open Workflow 和 Run Now。每一行都带有一个状态标签（Running、Scheduled、Listening、Paused、API、SubWorker、Portal、Manual、Remove Scheduled），Status 下拉菜单可据此进行筛选。没有 Trigger 节点的工作流会根据其最近一次运行的启动方式进行标记——HTTP 调用标记为 API，父工作流标记为 SubWorker，其公开聊天标记为 Portal——并且在运行之前保持 Manual 状态。文件夹和子文件夹用于处理[组织](./workflow-organization.md)。使用 New Workflow 创建工作流，拖放 JSON 以[导入](./download-import.md)，并通过行操作进行编辑或删除。工作流可以在文件夹之间移动；删除会先进入计划删除（回收站），然后才会被永久移除。

另请参阅 [Workflow Organization](./workflow-organization.md)、[Download & Import](./download-import.md) 和 [Quick Drawer](./quick-drawer.md)。

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

一个 Agent 化的看板，其中卡片是持久化作业。为每一列配置一条有序的工作流链；将卡片移入该列时，会使用卡片的完整上下文（内容、评论、历史记录、先前的输出）运行该链。结果会写回卡片——成功为绿色，失败为红色，运行中为琥珀色。后续轮次会使用目前累积的所有内容重新运行当前列的链，这为迭代式规划提供了支持。运行记录会以 `board` Trigger 来源记录在 [Execution History](./execution-history.md) 中。当卡片运行处于活动状态时，**Open live** 会在带动画的画布上打开该次运行，并显示增量 Debug 日志。

另请参阅 [Workflows](../tabs/workflows-tab.md)、[Execution History](./execution-history.md) 和 [Human-in-the-Loop](./human-in-the-loop.md)。

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates 标签页让你可以保存并复用工作流模板（完整工作流）和节点模板（单个已配置的节点）。从编辑器中创建工作流模板（Share as Template），通过右键单击节点创建节点模板。按可见性（Everyone 或 Specific users/[teams](./teams.md)）浏览，应用模板以创建新工作流或将节点添加到画布，并管理你共享的模板。

另请参阅 [Workflows](../tabs/workflows-tab.md)、[Teams](./teams.md) 和 [Canvas Features](./canvas-features.md)。

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables 标签页管理 [Global Variable Store](./global-variables.md)。创建、编辑和删除全局变量；设置名称、值和值类型（Auto、String、Number、Boolean、Array、Object）。变量按用户隔离，并在多次执行之间持久保留。可在任何工作流[表达式](./expression-dsl.md)中以 `$global.variableName` 引用它们。变量可以与其他用户或[团队](./teams.md)共享。

另请参阅 [Global Variables](./global-variables.md)、[Variable](../nodes/variable-node.md) 和 [Expression DSL](./expression-dsl.md)。

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Chat 标签页是 Heym 的长时间运行 Agent 界面，用于通过对话操作整个工作区。选择一个[凭证](./credentials.md)和模型，然后让 Chat 回答问题、检查工作流定义、运行现有工作流、汇总执行记录和调度计划、报告单个工作流的运行历史（运行次数、状态分布、上次运行，以及按需提供某次运行的详细信息）、报告当前正在运行的执行（包含已用时间、当前节点，以及指向每个实时运行的链接）、处理待处理的人工审核、使用与编辑器中相同的 AI Builder 引擎创建和修改工作流，或通过自然语言向看板添加卡片。新卡片始终从所选看板的第一列开始；当有多个看板可用且未指定看板时，Chat 会在创建卡片前先呈现看板选择。

浏览器关闭后，Chat 仍会在后端继续运行。在回答流式输出期间，你可以继续发送消息；Heym 会将这些消息存储在数据库支持的队列中，允许你在它们开始执行前编辑或删除排队消息，并在当前响应完成后按顺序执行它们。如果助手需要规划细节并返回澄清问题，队列会暂停，直到你回答这些问题，然后在规划响应完成后恢复。

响应以流式方式输出，支持 markdown、内联图片、工作流预览卡片、可折叠的工具调用卡片、上下文使用情况以及自动上下文压缩。Chat 支持附件、语音输入、朗读播放、复制操作、快捷提示词、来自[设置](./user-settings.md)的 User Rules，以及作为上下文的[全局变量](./global-variables.md)。

另请参阅 [AI Assistant](./ai-assistant.md)、[Credentials](./credentials.md) 和 [Settings](./user-settings.md)。

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ 观看 Chat 演示</a></p>

### [Credentials](../tabs/credentials-tab.md)

Credentials 标签页管理节点使用的 API keys 和密钥。按类型添加凭证（OpenAI、Google、Custom、Bearer、Header、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、SMTP、[Redis](../nodes/redis-node.md)、RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、Cohere 等），为其命名，并在工作流节点中引用它们。可通过卡片进行编辑或删除；可通过电子邮件与用户共享，或与[团队](./teams.md)共享。所有值在静态存储时均加密，并在 UI 中掩码显示。

另请参阅 [Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 和 [Third-Party Integrations](./integrations.md)。

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ 观看 Credentials 演示</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vectorstores 标签页管理 [RAG](../nodes/rag-node.md) 节点使用的向量存储。使用名称和向量存储[凭证](./credentials.md)创建存储——*RAG: Qdrant + OpenAI*（外部 Qdrant）或 *RAG: Psql + OpenAI*（Heym 自有的 Postgres，通过 pgvector），这会固定该存储的后端——可选设置 collection 名称，然后上传文档（PDF、TXT 等）。管理内容（查看、删除来源）、编辑存储详情，并与用户共享存储。在 [RAG](../nodes/rag-node.md) 节点中，选择 Database、选择向量存储，并运行 insert、upsert、delete 或 search 操作。

另请参阅 [Qdrant RAG](../nodes/rag-node.md)、[Credentials](./credentials.md) 和 [Teams](./teams.md)。

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ 观看 Vectorstores 演示</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP 标签页用于配置 Model Context Protocol 集成。Heym 支持两种模式：

**默认服务器** – 通过 `/api/mcp/sse` 单一 Endpoint 暴露所有启用 MCP 的 Workflow。您可以查看并重新生成 API key、复制可直接使用的客户端 JSON、一键连接 Cursor，或按照 Claude 设置流程进行自动 OAuth 注册。

**命名服务器** – 创建多个隔离的 MCP Endpoint，每个 Endpoint 拥有基于 UUID 的独立 URL（`/api/mcp/servers/{uuid}/sse`）和独立的 API key。将特定 Workflow 分配给每个服务器，使不同的 AI 客户端或团队只能看到它们所需的工具。每个命名服务器支持相同的认证方式（API key、Claude OAuth），并拥有各自的 Copy JSON 和 Add to Cursor 快捷操作。两种 Endpoint 均支持 SSE 传输（GET）和 Streamable HTTP 传输（POST）。在命名服务器中切换某个 Workflow 时，该 Workflow 会移动到已分配列表的顶部，以便更改的行保持在视野中。

**Heym chat 工具** – 两种模式均可将 [Chat](../tabs/chat-tab.md) 引擎暴露为单个 `heym_chat` 工具，按界面独立切换，并拥有各自的 LLM credential 和模型（从 [Settings](./user-settings.md) 中的首选模型预填）。MCP 客户端发送一条自然语言 `message`，引擎完成其余工作：在构建模式下构建 Workflow（保存、最多五次测试运行、修复并验证）、运行 Workflow、分析、执行记录、实时运行状态、调度、看板和卡片、团队、全局变量、文档搜索以及人工介入决策。后续添加到 Chat 的功能可通过同一工具访问，无需额外注册。每次调用都会作为带有 plug 标记的对话存储在 Chat 标签页历史记录中，并返回一个 `conversation_id`，客户端可将其传回以继续该对话线程。

另请参阅 [Agent Architecture](./agent-architecture.md)、[Agent Node](../nodes/agent-node.md) 和 [SSE Streaming](./sse-streaming.md)。

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ 观看 MCP 演示</a></p>

### [Traces](../tabs/traces-tab.md)

Traces 标签页显示 [LLM](../nodes/llm-node.md) 执行追踪。列表上方的统计头部通过 KPI 卡片（Calls、Tokens、Cost、Avg Latency、Error %）和三个图表——Tokens by Model、Cost by Model 和 Calls Over Time（堆叠显示成功与错误）——汇总所选时间范围的数据。单一的 **Time range** 选择器（1h / 24h / 7d / 30d / All；默认 7 天）同时筛选图表和列表。Cost 根据每用户的 [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) 计算；没有定价的模型会显示内联警告并链接到该表。打开任意 trace 可查看请求和响应 Payload、耗时明细（llm_ms、tools_ms、mcp_list_ms）、工具调用（名称、参数、结果）以及包含的 skills。展开的事件以可折叠树形结构显示 JSON——包括 MCP 和 JSON-RPC Payload——默认展开第一层；**Tree / Raw** 可切换回原始文本，格式错误的 JSON 仍可阅读。使用 traces 调试 [Agent Node](../nodes/agent-node.md) 和 [LLM](../nodes/llm-node.md) 行为，并复制或导出 Payload。

另请参阅 [Execution History](./execution-history.md)、[Agent Node](../nodes/agent-node.md) 和 [LLM](../nodes/llm-node.md)。

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ 观看 Traces 演示</a></p>
### [Alerts](../tabs/alerts-tab.md)

Alerts 标签页定义时间窗口内的阈值条件，并在条件被触发时通知你。四种告警类型覆盖了运维人员实际关心的问题：**错误阈值**（在窗口内失败次数是否超过 N 次）、**workflow 时长**（运行是否变慢，按最大值、平均值或 p95 衡量）、**token / USD 成本**（支出是否超出预算，通过与 [Traces](../tabs/traces-tab.md) 相同的定价表解析），以及**执行次数**（运行频率是否远超预期）。每种类型都在你选择的时间窗口内进行判定，绝不基于单个事件，因为一次失败运行只是噪声，而突发才是事故。Alerts 可以监视一个 workflow 或你有权访问的所有 workflow。

五步向导依次引导你完成类型、范围、条件、响应和审核。审核步骤会先对条件进行**回测**，报告它在过去 24 小时到 7 天内本应触发的频率，从而在保存之前就发现阈值设置过低的问题，而不是在它触发告警之后才发现。用自然语言描述你的需求，AI 会填充它能填充的每一步，并标记其推测；即使请求不完整，向导仍会向前推进，打开第一个仍需决策的步骤，而不是让你从头开始。默认情况下，告警触发一次后便保持静默，直到指标恢复；你也可以让它按间隔重复触发。

在响应步骤中，告警可以在触发时创建并分配一个新的 workflow 来运行，使用你已有的 workflow，或不做任何操作。触发 payload 携带观测值、阈值、窗口以及贡献该数值的 workflow，这正是告警通过你已有的节点到达 Slack、email 或 Telegram 的方式。触发历史记录每次告警触发时的真实状态，并保留 90 天；确认一次触发会将徽章从 Firing 变为 Acknowledged，而不会假装条件已清除。[Chat](../tabs/chat-tab.md) 标签页可以回答存在哪些告警以及某个告警为何或何时触发。Alerts 可以与用户和[团队](../tabs/teams-tab.md)共享。

另请参阅 [Analytics](../tabs/analytics-tab.md)、[Traces](../tabs/traces-tab.md) 和 [Execution History](./execution-history.md)。

### [Analytics](../tabs/analytics-tab.md)

Analytics 标签页显示执行指标和趋势。汇总统计包括总执行次数、成功率、错误率、延迟明细以及总 **Time Saved**（每个 workflow 每次运行估计节省的分钟数 × 其成功运行次数之和）。Most Used 按 workflow 列出相同的总和。选择一个基础时间范围（24h、7d、30d 或 all），可选按 workflow 筛选，然后在任意图表上拖动以深入查看选定的日期范围。图表和 workflow 表格会刷新为所选范围，自动刷新保持指标更新。当你既需要过往结果又需要即将到来的运行时，它是对 [Execution History](./execution-history.md) 和 [Scheduled](../tabs/scheduled-tab.md) 视图的补充。

另请参阅 [Execution History](./execution-history.md)、[Scheduled](../tabs/scheduled-tab.md) 和 [Evals](../tabs/evals-tab.md)。

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ 观看 Analytics 演示</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Dashboard 标签页是一个 Grafana 风格的空间，你可以在其中构建图表 widget 网格，每个 widget 都由其各自隐藏的 Heym workflow 渲染。按需保留任意数量的 dashboard，并将每个 dashboard 与用户或团队共享，可设为只读或可编辑；widget 始终以所有者的凭证运行，因此每个人看到的数据都相同。用自然语言描述一个指标，AI 会生成该 widget，或者手动添加一个并选择图表类型，用示例数据预览：bar、line、area、pie、table、numeric、gauge、scatter、proportion、bar gauge、text 或 HITL。HITL 是你待处理的人工审核的轮播。标题栏显示 `1/n pending`。workflow 名称会在画布上打开该次运行。**Approve**、**Request changes** 和 **Reject** 可解决该审核，widget 标题旁的历史图标会在同一页面的历史对话框中打开该次运行。Widget 会缓存其结果，可以用 AI 微调（每次更改都会保存到 [Edit History](./edit-history.md)），连同其完整 workflow 一起克隆，通过 Tidy up 重新排列，并在编辑模式下拖动或调整大小。表格可以显示状态标签并将其行链接到将所点击行的记录读取为 `$page.record` 的详情仪表板，而运行（Run）小部件可从仪表板运行 workflow：基于拖放的文件、使用其输入字段或通过“运行”按钮。因为每个 widget 都是一个 workflow，任何你能获取的数据——一次 [HTTP](../nodes/http-node.md) 调用、一次 [BigQuery](../nodes/bigquery-node.md) 查询、一次 [RAG](../nodes/rag-node.md) 查找或 [LLM](../nodes/llm-node.md) 输出——都可以变成一个图表。HITL 小部件的设置可以将其缩小到单个工作流的审核，或其中的代理或 Slack 批准步骤；这样的小部件会向所有可以打开该工作流的人显示它们，并对无法打开的人隐藏。

另请参阅 [Chart Output 节点](../nodes/chart-output-node.md)、[Analytics](../tabs/analytics-tab.md) 和 [Execution History](./execution-history.md)。

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ 观看 Dashboard 演示</a></p>
### [Evals](../tabs/evals-tab.md)

Evals 标签页（位于 `/evals`）允许你创建评估套件、添加或生成测试用例、优化套件 Prompt，并针对 [Agent 节点](../nodes/agent-node.md) Workflow 运行评估。选择一个或多个模型，选择评分方法（Exact Match、Contains 或 LLM-as-Judge），可选地让单独的模型或 [Decision 模型](../nodes/decision-node.md) 来评判 LLM-as-Judge 答案，设置每个测试的运行次数（以及 Exact Match 和 Contains 的 temperature 和 reasoning effort），然后比较通过/失败结果和各模型的输出。查看过往评估的运行历史，包括每次运行所使用的评判模型，使用相同评判模型重新运行某次评估，将其导出为 JSON，并在 [Traces](../tabs/traces-tab.md) 中交叉验证底层行为。

另请参阅 [Agent 节点](../nodes/agent-node.md)、[Traces](../tabs/traces-tab.md) 和 [执行历史](./execution-history.md)。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ 观看 Evals 演示</a></p>

### [Teams](../tabs/teams-tab.md)

Teams 标签页允许你创建和管理团队。创建一个团队，通过邮箱添加成员，以及移除成员（创建者不可被移除）。从各自的共享对话框中，将 [Workflow](../tabs/workflows-tab.md)、[模板](../tabs/templates-tab.md)、[凭证](../tabs/credentials-tab.md)、[变量](../tabs/global-variables-tab.md)、[向量存储](../tabs/vectorstores-tab.md) 和 [Drive 文件](../tabs/drive-tab.md) 共享给团队；所有团队成员均可获得访问权限。编辑团队名称和描述，或删除团队（将移除所有团队共享）。

另请参阅 [Teams](./teams.md)、[凭证共享](./credentials-sharing.md) 和 [Workflow 组织](./workflow-organization.md)。

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ 观看 Teams 演示</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Scheduled 标签页在可视化日历上显示所有活跃的 [Cron](../nodes/cron-node.md) Workflow。在日、周、月视图之间切换，查看自动化任务的计划运行时间，然后在需要编辑计划时跳回相关的 [Workflow](../tabs/workflows-tab.md)。

另请参阅 [Cron](../nodes/cron-node.md)、[Analytics](../tabs/analytics-tab.md) 和 [执行历史](./execution-history.md)。

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ 观看 Scheduled 演示</a></p>

### [Logs](../tabs/logs-tab.md)

Logs 标签页显示 Heym 技术栈（后端、前端、PostgreSQL）的 Docker 容器日志。选择容器，按日志级别（All、INFO、WARNING、ERROR、DEBUG）筛选，并在日志中搜索。用于调试和故障排查。如需查看 Workflow 执行日志（节点结果、输出），请改用 [执行历史](./execution-history.md)、[Traces](../tabs/traces-tab.md) 或编辑器中的 Debug 面板。

另请参阅 [执行历史](./execution-history.md)、[Traces](../tabs/traces-tab.md) 和 [画布功能](./canvas-features.md)。

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ 观看 Logs 演示</a></p>

### [DataTable](../tabs/datatable-tab.md)

DataTable 标签页允许你在 Heym 中创建和管理结构化数据表。定义带类型的列（string、number、boolean、date、JSON），通过双击内联编辑管理行，导入/导出 CSV，并以读/写权限将表共享给用户或 [团队](./teams.md)。使用 [DataTable 节点](../nodes/datatable-node.md) 在 Workflow 中以编程方式访问表。顶部固定的 **System tables** 区域承载 **LLM Cost Table**：这是一个固定 schema 的视图，展示各模型的定价，由 Helicone 在后台填充（24 小时 TTL，可手动 Refresh），每个用户可以覆盖价格或为 Helicone 未列出的模型添加自定义行。这些定价规则驱动 [Traces](../tabs/traces-tab.md) 标签页上的成本 KPI 和各模型成本图表。

另请参阅 [DataTable 节点](../nodes/datatable-node.md)、[Traces](../tabs/traces-tab.md)、[Workflow 结构](./workflow-structure.md) 和 [Teams](./teams.md)。

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ 观看 DataTable 演示</a></p>
### [Drive](../tabs/drive-tab.md)

Drive 标签页显示由你的工作流中各技能生成的所有文件。它列出每个文件的名称、类型、大小、来源节点、创建日期和团队共享状态，并提供搜索、经身份验证的下载、共享、删除和分页控件。它是 [File Generation](./file-generation.md)、[Drive](./drive.md) 参考文档和 [Drive 节点](../nodes/drive-node.md) 的仪表盘配套功能。

另请参阅 [Drive](./drive.md)、[File Generation](./file-generation.md) 和 [Drive 节点](../nodes/drive-node.md)。

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ 观看 Drive 演示</a></p>
