# 为什么选择 Heym

Heym 是用于在生产环境中运行和治理 AI Agent 的基础设施。一个自托管运行时即可覆盖 Agent 生命周期的每个阶段。

原型阶段的 Agent 只需要一个模型、一个 Prompt 和少量工具。而生产环境的 Agent 还需要 Trigger 和重试机制、在等待人工介入时保存状态、记录每一次模型和工具调用、统计每次运行的成本、在变更上线前进行测试，以及对其自主行为设定明确的边界。Heym 将这一切集中在一处，因此您在画布上设计的系统就是实际运行的系统。构建 Agent 系统，然后自信地运行它们。

## 一个运行时覆盖 Agent 全生命周期

| 阶段 | Heym 为您提供的能力 |
|---|---|
| **构建** | 在画布上编排 Agent 和确定性步骤，通过 [AI Assistant](../reference/ai-assistant.md) 生成它们，或从 [Templates](../tabs/templates-tab.md) 和可移植技能开始。 |
| **编排** | 协调 Agent、[子 Agent](../reference/agent-architecture.md)、编码 Agent、RAG、浏览器自动化和工具，具备明确的数据流和[并行执行](../reference/parallel-execution.md)能力。 |
| **运行** | 通过 [Webhook](../reference/webhooks.md)、调度和事件 [Trigger](../reference/triggers.md) 启动运行，支持按节点重试、[错误处理](../nodes/error-handler-node.md)以及跨实例的[负载分发](../reference/cluster.md)。 |
| **观测** | 通过[历史记录](../reference/execution-history.md)、[LLM 追踪](../tabs/traces-tab.md)、每次运行的美元成本、画布上的实时运行、[分析](../tabs/analytics-tab.md)、[告警](../tabs/alerts-tab.md)和 [OpenTelemetry](../reference/opentelemetry.md) 导出，检查每一次执行。 |
| **评估** | 在 [Evals](../tabs/evals-tab.md) 中针对预期输出测试 Prompt 和模型，支持 LLM-as-Judge 评分和模型并排对比。 |
| **管控** | 通过[审核检查点](../reference/human-in-the-loop.md)和[护栏](../reference/guardrails.md)确保人工掌控，并通过加密的[凭据](../reference/credentials.md)、[团队](../reference/teams.md)、[单点登录](../reference/sso.md)和[审计追踪](../reference/audit.md)治理访问权限。 |
| **对外暴露** | 通过 REST 和 [SSE](../reference/sse-streaming.md) 提供 Workflow 服务，作为 [MCP](../tabs/mcp-tab.md) 工具、[Portal](../reference/portal.md) 聊天界面以及[仪表盘](../tabs/dashboard-tab.md)小组件对外提供。 |

## 构建

### AI Assistant：用自然语言构建 Workflow

[AI Assistant](../reference/ai-assistant.md) 是 Workflow 编辑器内的一个聊天面板。描述您的需求，例如“创建一个 Workflow，接收用户输入，搜索我的知识库，并使用 GPT-4o 回复”，助手会生成节点和连线并即时应用到画布上。

- 使用您自己的 LLM 凭据（支持任何兼容的模型）
- 支持**语音输入**，实现免手动的 Workflow 设计
- 自动将 AI 响应中有效的 Workflow JSON 应用到画布
- 实时流式输出响应

助手直接在编辑器内工作，将节点实时流式呈现在画布上，其生成的所有内容都像您手动放置的节点一样可编辑。

### 技能系统

技能是可移植的能力包，包含一个 `SKILL.md` 指令文件以及可选的 Python 脚本，可以拖放到任何 Agent 节点上。

- 技能的指令会前置到 Agent 的系统 Prompt 中
- 技能中的 Python 文件会变为可调用的工具
- 技能可跨 Workflow 复用，并可作为 `.zip` 归档分享

这相当于一次性为您的 Agent 提供职位描述和工具箱。

### Workflow 分析器：运行感知反馈

[Workflow 分析](../reference/workflow-analysis.md)面板是内置于编辑器中的运行感知文档和反馈工具。点击 **Analyze**，选择一个 LLM 凭据和模型，Heym 会为当前 Workflow 生成一份可编辑的 Markdown 报告。

与静态笔记不同，分析器会先尽可能运行 Workflow，并将执行结果包含在 Prompt 中。报告涵盖改进领域、Workflow 的用途，以及节点功能的逐步说明。当报告已存在时，**Reanalyze** 会流式输出一个独立的预览，以便您接受新版本或保留当前共享文档。

## 编排

### 内置 LLM 与 Agent 节点

Heym 的 [Agent 节点](../nodes/agent-node.md)运行一个紧密集成的工具调用循环，支持内联 Python 工具、MCP 连接以及可移植的技能系统，全部为生产级 Agent 而设计。

Heym 的普通 [LLM 节点](../nodes/llm-node.md)同样超越了单次 Prompt-响应步骤。对于受支持的 OpenAI 及 OpenAI 兼容 Endpoint，它可以切换到 **Batch API 模式**，使一个节点以更低成本的提供商原生批量请求提交一组 Prompt 数组。画布随后会暴露一个专用的 `batchStatus` 分支，在批次经历 `pending`、`processing` 和 `completed` 等状态时触发。

这意味着 LLM 节点可以同时完成两件事：

- 运行主批量请求，并在正常分支上返回最终的逐项输出
- 在每次有意义的批次状态更新时触发通知或日志逻辑，而无需将流程变成自定义轮询循环

批量执行是一等 LLM Workflow 原语，节点 UI 中内置了提供商和模型能力检查。

**Agent 节点**是 Heym 中 Agent 编排的核心：

- **工具调用** – Agent 在循环中迭代工具调用，直到产生最终答案
- **Python 工具** – 使用完整的 Python 内联定义自定义工具；Agent 在运行时调用它们
- **MCP 连接** – 连接到任意 [Model Context Protocol](https://modelcontextprotocol.io/) 服务器（stdio 或 SSE），Agent 自动获取其所有工具
- **技能** – 将 `.zip` 或 `.md` 文件拖放到 Agent 上，即可扩展其系统上下文并添加 Python 工具
- **子 Workflow 调用** – Agent 可以将其他 Heym Workflow 作为工具调用，无需自定义代码即可组合复杂行为

完整参考请参阅 [Agent 节点](../nodes/agent-node.md)和 [Agent 架构](../reference/agent-architecture.md)。

### 多 Agent 编排

Heym 通过一等可视化原语支持 **orchestrator 模式**：

- 一个 Agent 充当 **orchestrator**（`isOrchestrator: true`），并被赋予 `call_sub_agent` 工具
- 它将任务委派给同一画布上命名的 **sub-agent**
- Sub-agent 自身可以调用其他 Agent 或子 Workflow（最大深度：5）
- **并行执行**：当 orchestrator 在一轮中调用多个 sub-agent 时，它们会并行运行以加快结果产出

这使得诸如规划 Agent 将工作路由给研究员、编码者和总结者之类的架构成为可能，全部通过可视化方式连接，无需自定义编排代码。

执行细节请参阅 [Agent 架构](../reference/agent-architecture.md)。

### 作为 Workflow 节点的编码 Agent

Heym 提供两个节点，它们将真正的编码 Agent 作为 Workflow 步骤运行，而非聊天补全：

- **[Codex 节点](../nodes/codex-node.md)** – 在隔离的 Heym 工作区中针对 GitHub 仓库运行 OpenAI Codex CLI。支持 **Sign in with ChatGPT**（在您的 Plus/Pro 订阅上使用 PKCE OAuth，无按 Token 计费的 API 成本）或访问 Token，克隆仓库，让 Codex 编辑代码，并返回 `summary`、`diff`、`changedFiles` 以及草稿 `pullRequestUrl`。
- **[OpenCode Go 节点](../nodes/opencode-go-node.md)** – 通过提供商无关的 OpenCode 网关（Kimi、DeepSeek、Qwen 等）执行相同的仓库 Workflow，运行在**加固的一次性容器**中：丢弃所有 capabilities、只读根文件系统、pid/内存/CPU 限制。GitHub Token 始终位于沙箱之外：Heym 在宿主机侧执行所有 git 和 GitHub 操作，因此生成的代码无法窃取推送凭证。

这意味着一个 Workflow 可以从 Webhook 分类 Bug、将仓库交给编码 Agent、等待草稿 PR，并将链接发布到 Slack，全程自动化，且资源限制可按部署配置。

### 内置 RAG 管道

Heym 包含一个 [RAG / Vector Store 节点](../nodes/rag-node.md)以及托管的 [Vectorstores](../tabs/vectorstores-tab.md) 标签页。您可以：

- 选择向量后端：**Qdrant**（外部服务器）或 **Postgres (pgvector)**，后者将向量存储在 Heym 自有数据库中，无需运行额外服务
- 直接从 Workflow 节点向向量存储插入文档
- 执行语义搜索并将结果馈送到 LLM 或 Agent 节点
- 使用 `$ragNode.results.map("item.payload.content").join("\n\n")` 等表达式引用结果

在 Heym 中，RAG 就是两个节点，对嵌入和检索拥有完全控制权。

### 使用 Playwright 进行浏览器自动化

[Playwright 节点](../nodes/playwright-node.md)是画布上的一等浏览器自动化能力。

- **Steps 模式** – 可视化地组合导航、点击、输入、填充、截图、提取和滚动操作
- **带自动修复的 AI 步骤** – 用自然语言描述操作，由 LLM 生成 Playwright 操作；失败的选择器可以自动修复，生成的步骤可以缓存以跳过未来的 LLM 调用
- **Run Code 模式** – 将节点切换为完整的 Playwright Python 以处理复杂流程（默认禁用；启用后在 Heym 的加固沙箱中运行）
- **已认证会话** – 运行前恢复 cookies/`storageState`，通过选择器检查验证登录，并回退到脚本化登录步骤
- **网络捕获** – 可选地随结果一起收集 JSON 响应、headers、cookies 和浏览器存储

Heym 将浏览器视为普通节点，拥有与其他所有节点相同的表达式、凭证和错误处理。

### Expression DSL

Heym 的 [Expression DSL](../reference/expression-dsl.md) 提供了一套简洁而强大的语法，用于引用上游节点数据：

- `$input.text` – Input 节点数据
- `$nodeName.field` – 任意上游节点的输出字段
- `$global.variableName` – 持久化全局变量
- 数组辅助方法：`.first()`、`.map("field")`、`.join("\n")`

表达式可用于所有字符串字段，包括 Prompt、HTTP 请求头、条件判断和赋值操作，因此数据在步骤之间显式传递。该 DSL 在强大与可读之间取得平衡，无需掌握完整的 JavaScript 知识。

## 运行

### Trigger、重试与错误路径

Workflow 可以从多种来源启动。[Input](../nodes/input-node.md) 节点接收 HTTP [Webhook](../reference/webhooks.md)，[Cron](../nodes/cron-node.md) 按计划运行，事件 [Trigger](../reference/triggers.md) 可从 Telegram、Discord、Slack、IMAP 收件箱、WebSocket 流、RabbitMQ 队列、文件上传以及 Heym 平台事件启动运行。

故障在图内部处理。任何节点都可以在失败时按设定的尝试次数和间隔进行重试，每次尝试都会记录在[执行历史](../reference/execution-history.md)中，节点失败时 [Error Handler](../nodes/error-handler-node.md) 节点会自动运行，因此恢复机制本身就是 Workflow 的一部分。

### 并行 DAG 执行

Heym 的 Workflow 执行器采用有向无环图（DAG）调度器。独立节点自动并行运行，无需任何配置。

- 处于同一依赖层级的节点被并发分派到线程池（`max_workers=8`）
- 任一节点完成后，其下游节点立即被调度
- [Merge 节点](../nodes/merge-node.md)合并并行分支的结果
- 多个 Workflow 运行并发执行；每次运行完全隔离

并行是默认行为，由图结构决定。

参见[并行执行](../reference/parallel-execution.md)。

### 跨实例扩展

将第二个 Heym 实例指向同一个 PostgreSQL 数据库，它便会作为 Worker 加入。后台运行按您设置的权重在实例间分担，一个被选举出的 Leader 负责保持调度、告警评估和崩溃恢复在故障转移期间持续运行，每次运行都会记录执行它的实例。参见[负载分布](../reference/cluster.md)。

### Agentic 看板

[Board 标签页](../tabs/board-tab.md)是内置的看板，其中的列本身即可执行 Workflow。卡片是持久化的 Agentic 任务，承载上下文、对话历史、执行状态、输出和 Workflow 运行。

- **列 Workflow 链** – 将卡片移入某一列会触发该列的 Workflow 链；**Agentic 看板模型**（您的凭证 + 模型）将卡片内容映射为 Workflow 输入，并将输出转换回可读文本
- **卡片附件** – 将文件拖放到卡片上；每次运行前，文档会被提取为文本，图像会传递给支持视觉的模型
- **实时运行画布** – 在卡片内打开当前运行，在真实的 Workflow 画布上逐节点观看执行过程
- **团队共享** – 以读/写权限将看板共享给用户或团队；共享看板上的链以所有者的凭证运行，协作者无需自备凭证
- **故障可见性** – 失败的卡片会显示错误历史指示器，后续运行可以暂停以等待评论

看板是平台的原生界面：卡片、Workflow、凭证和实时运行都集中在一处。

### Heym Drive：内置文件存储

[Drive 标签页](../tabs/drive-tab.md)是平台内置的文件存储。由技能和 Workflow 生成的文件（PDF、DOCX、CSV、图像）会自动存入其中，看板卡片附件也存储在那里。

- **分享链接** – 公开或密码保护（Basic Auth）的下载链接，支持可选的过期时间和最大下载次数限制
- **团队共享** – 以只读方式将文件共享给您的团队，并可一键移除所有团队共享
- **批量操作** – 通过 Shift 点击选择范围进行多选，将所选文件打包为单个 ZIP 下载，或对多个文件一次性应用同一分享/密码/删除设置
- **Agent 访问** – 技能可以选择读取 Drive 文件，因此 Agent 可以处理您或其他 Workflow 生成的文档

生成的产物在平台内获得永久、可分享的存放位置。

## 观测

### LLM 追踪

[Traces 标签页](../tabs/traces-tab.md)为每次 LLM 调用提供完整的可观测性：

- 请求和响应 Payload
- 每次调用的耗时：`llm_ms`、`tools_ms`、`mcp_list_ms`
- 工具调用名称、参数和结果
- 传递给模型的技能

追踪系统专为调试 Agentic 行为而构建，提供完整的请求和响应 Payload 以及每次调用的耗时。

### LLM Token 成本追踪

Heym 中的每次 LLM 调用都会自动计费。[Traces 标签页](../tabs/traces-tab.md)会显示每条 trace 的输入和输出 Token 数量，以及基于同步定价表计算出的实时美元成本。

- **单条 trace 成本** – 每条 trace 行上显示输入 Token、输出 Token 和总美元成本
- **成本分析** – KPI 卡片和按模型划分的成本图表会随所选时间范围（1h / 24h / 7d / 30d / All）更新
- **LLM 成本表** – [DataTable 标签页](../tabs/datatable-tab.md)中的系统表每 24 小时从 Helicone 同步一次；您可以覆盖价格或为尚未列出的模型添加自定义行
- **缺失价格警告** – 没有定价条目的模型，其 trace 会显示内联警告，并附带指向成本表的直接链接

每次执行都携带自身的美元成本，并按模型细分。

### 在实时画布上打开生产运行

生产 Workflow 在编辑器之外启动后，仍然可以保持可检查状态。从任一 History 对话框中打开任意 **Running** 条目，或在 Agentic Kanban 卡片中打开活跃运行，Heym 会将常规 Workflow 编辑器附加到该次确切的执行上。

- 已完成的节点会立即显示其结果
- 当前节点和待处理的下游节点会随着执行推进持续脉冲显示
- Debug 面板会接收到与画布启动运行相同的增量节点结果
- 最终输出和执行高亮无需轮询或启动重复运行即可到达
- 关闭编辑器只会断开观察者；绝不会取消生产 Workflow

观察者使用由跨 worker 执行快照支持的 SSE，因此即使运行由另一个后端 worker 持有，它也能适用于 Webhook、Schedule、Chat、MCP、Integration 和 Board Trigger。

### OpenTelemetry、分析与告警

Heym 会为每次 Workflow 运行、节点执行和 Agent 工具调用发出 [OpenTelemetry](../reference/opentelemetry.md) span，并通过 OTLP/HTTP 导出到 Jaeger、Grafana Tempo、Honeycomb、Datadog 或任何其他兼容后端。

[Analytics](../tabs/analytics-tab.md) 标签页会按 Workflow 跟踪运行次数、成功率、时长和趋势。[Alerts](../tabs/alerts-tab.md) 会监视时间窗口内的错误计数、运行时长、Token 或美元支出以及执行量，然后运行您选择的 notify Workflow，因此告警可以到达 Slack、电子邮件、Telegram 或任何节点能够到达的地方。

## Evaluate

### 内置 Evals

[Evals 标签页](../tabs/evals-tab.md)允许您定义测试套件，并针对您的 Agent Workflow 运行它们：

- 使用输入和预期输出创建测试用例，或从套件 Prompt 生成它们
- 针对多个模型运行同一个套件，并并排比较它们的输出
- 使用 Exact Match、Contains 或 LLM-as-Judge（配合独立 judge 模型）进行评分
- 查看通过/失败、实际值与预期值以及运行历史

更改 Prompt 或模型，重新运行套件，并在变更进入生产之前比较结果。

## Control

### Human-in-the-Loop (HITL)

Heym 内置了 [Human-in-the-Loop](../reference/human-in-the-loop.md) 系统，允许 Agent 暂停执行、请求人工审核，并从暂停处精确恢复。

- **Agent 检查点** – 在任意 Agent 节点上启用 `hitlEnabled`，即可为其提供 `request_human_review` 工具。Agent 会判断何时需要人工监督，并携带摘要和草稿调用该工具。
- **公开审核 URL** – 每个审核请求都会生成一个安全的一次性链接 `/review/{token}`（TTL 为 168 小时）。审核者无需登录即可**接受**、**编辑并继续**或**拒绝**。
- **执行快照** – Workflow 会冻结其完整状态（对话历史、变量、工具结果），以便在审核者响应后从暂停处精确恢复。
- **通知分支** – 可选的 `review` 输出句柄允许您接入通知流程（Slack、电子邮件、Webhook），在请求审核时触发。
- **MCP 工具审批策略** – 书面 HITL 指南会被解释为审批范围（`always` / `once` / `never`），因此 Agent 可以自动批准低风险工具，并升级高风险工具。
- **多个检查点** – 单次 Agent 运行可以多次暂停以进行审核；每个检查点都是独立的。

公开审核 URL、编辑并继续、通知分支以及基于快照的恢复，均可从同一个 Agent 检查点工作。

完整参考请参见 [Human-in-the-Loop](../reference/human-in-the-loop.md)。

### LLM Guardrails

Heym 在 [LLM](../nodes/llm-node.md) 和 [Agent](../nodes/agent-node.md) 节点上都内置了 [Guardrails](../reference/guardrails.md)，因此您可以在模型响应到达下游步骤之前阻止不安全内容。

- **节点级安全开关** – 直接在生成或处理面向用户内容的节点上启用 Guardrails
- **广泛的策略覆盖** – 阻止暴力、仇恨言论、色情内容、NSFW/亵渎、骚扰、非法活动、个人数据请求以及 Prompt 注入尝试
- **多语言检测** – 在土耳其语、英语、阿拉伯语、西班牙语及其他语言中应用相同的安全规则
- **Workflow 原生回退** – 当消息被阻止时，节点会抛出类型化的 Workflow 错误，您可以通过 [Error Handler](../nodes/error-handler-node.md) 进行路由

安全策略直接存在于 LLM 和 Agent 配置中，并直接接入 Workflow 分支和错误处理。

### 访问、凭证与审计

Agent 以真实凭证执行操作，因此访问控制是治理的一部分。[Credentials](../reference/credentials.md) 在静态存储时加密，创建后即被掩码，并可与用户或 [teams](../reference/teams.md) 共享；teams 还可共享 workflows、variables、vector stores 和 Drive 文件。[Single sign-on](../reference/sso.md) 可连接任何 OpenID Connect 提供商，包括 Okta、Entra ID、Keycloak、Auth0 和 Google。[audit trail](../reference/audit.md) 记录每一项与安全相关的操作及其执行者、目标和结果，并与您的容器日志一同流式传输到您已有的日志收集器或 SIEM。

### 自托管，数据归您所有

Heym 运行在您自己的基础设施上。Workflows、credentials、执行历史和 traces 都存放在您自己的数据库中，模型调用从您的服务器发往您选择的提供商，或通过 Ollama 或 vLLM 发往您自行托管的模型。对于处理敏感文档、客户数据或专有知识库的 agents 而言，这往往是一项硬性要求。

Heym 采用 **MIT License with the Commons Clause condition** 许可。源代码为 source-available：您可以自由使用、修改和自托管。Commons Clause 限制的是销售本软件的行为，包括提供付费托管或咨询/支持服务，且其价值主要来源于 Heym。如需商业许可、企业部署或专业支持，请联系 [enterprise@heym.run](mailto:enterprise@heym.run)。

## Expose

### APIs 与流式传输

Workflows 可通过 HTTP 调用：`/api/workflows/{workflow_id}/execute` 返回 JSON，`/api/workflows/{workflow_id}/execute/stream` 在运行过程中以 Server-Sent Events 流式传输节点事件。两者共享 workflow 级别的身份验证、速率限制和响应缓存。参见 [Webhooks](../reference/webhooks.md) 和 [SSE Streaming](../reference/sse-streaming.md)。

### MCP（Model Context Protocol）集成

Heym 在两端均原生支持 [MCP](../tabs/mcp-tab.md)：

- **作为客户端**：Agent 节点通过 stdio 或 SSE 连接外部 MCP 服务器（Filesystem、Browserbase、自定义工具），并自动使用其工具
- **作为服务器**：开启 MCP 的 Workflows 会成为默认服务器 `/api/mcp/sse` 上的工具，或成为拥有独立 URL 和 API key 的命名服务器上的工具，从而让 Claude Desktop、Cursor 及其他 MCP 客户端直接调用您的 Heym workflows

Agents 可同时使用多个 MCP 服务器，任何 workflow 都可成为外部 MCP 客户端的工具。

### Portal：将 Workflows 发布为聊天 UI

[Portal](../reference/portal.md) 功能可将任何 workflow 转变为面向公众的聊天界面，位于 `/chat/{slug}`：

- 可选的身份验证，支持按用户配置 credentials
- 流式执行（实时节点进度）
- 文件上传支持
- 多轮对话历史

Teams 只需一个 workflow 和一个 URL，即可交付内部工具、面向客户的聊天机器人和 AI 驱动的表单，无需编写任何前端代码。

### Workflow 驱动的仪表板

[Dashboard tab](../tabs/dashboard-tab.md) 是用户自建的报表界面，其中每个图表组件都由其各自隐藏的 Heym workflow 驱动。组件可以调用 APIs、查询 BigQuery、搜索 RAG/vector stores、运行 LLM 步骤、转换数据行，并以 [Chart Output node](../nodes/chart-output-node.md) 收尾。您可以手动创建组件、用 AI 生成组件、后续微调、缓存结果，并以可视化方式重新排列网格布局。

## 与 Workflow 自动化工具对比

许多团队从 Workflow 自动化工具转向 Heym。下表在 agent 进入生产环境后至关重要的能力维度上，将 Heym 与 n8n、Zapier 和 Make.com 进行了对比，表格下方的脚注引用了对比所依据的官方文档。如需逐一深入了解某个工具，请参阅 [heym.run/compare](https://heym.run/compare) 上的对比页面。

| 能力 | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| 内置 LLM 节点 | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + 状态分支 | ✓ | 有限¹¹ | –¹¹ | 有限¹¹ |
| 内置 Agent 节点（工具调用） | ✓ | ✓ | ✓ | ✓ |
| 多 Agent 编排 | ✓ | ✓ | 有限 | 有限 |
| 编码 Agent 节点（Codex、OpenCode） | ✓ | –²⁰ | –²⁰ | –²⁰ |
| 内置 RAG / 向量存储 | ✓ | ✓ | 有限¹ | 插件² |
| WebSocket 读 / 写 | ✓ | 有限¹² | –¹³ | –¹⁴ |
| 自然语言 Workflow 构建器 | ✓ | 有限³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| 在实时画布上打开运行中的执行 | ✓ | 有限¹⁹ | 有限¹⁹ | –¹⁹ |
| Workflow 驱动的仪表盘 | ✓ | 有限¹⁷ | 有限¹⁷ | 有限¹⁷ |
| Agentic 看板 | ✓ | –²¹ | –²¹ | –²¹ |
| MCP（Model Context Protocol） | ✓ | ✓ | ✓ | ✓ |
| Agent 技能系统 | ✓ | – | – | – |
| 内置文件驱动器（分享链接、团队） | ✓ | 有限²² | 有限²² | –²² |
| 浏览器自动化节点（Playwright） | ✓ | 有限²³ | 有限²³ | –²³ |
| LLM 链路追踪检查 | ✓ | 有限⁴ | – | ✓ |
| OpenTelemetry 追踪导出 | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM Token 成本追踪（USD） | ✓ | –¹⁵ | –¹⁵ | 有限¹⁵ |
| 面向 AI Workflow 的内置评估 | ✓ | ✓ | – | – |
| Human-in-the-Loop（HITL） | ✓ | ✓⁵ | 有限⁶ | 有限⁷ |
| LLM 护栏 | ✓ | ✓⁸ | ✓⁸ | 有限⁸ |
| 自动上下文压缩 | ✓ | – | – | – |
| 并行 DAG 执行 | ✓ | 有限⁹ | – | – |
| 可自托管、源码可用 | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| 用于动态数据的表达式 DSL | ✓ | ✓ | 有限 | ✓ |

> **脚注：** ¹ Zapier Knowledge Sources — 未暴露向量存储或嵌入控制。² Make.com 有 Pinecone/Qdrant 模块，但没有原生 RAG 节点。³ n8n AI Workflow Builder 是仅限云端的测试版，有额度上限。⁴ n8n 显示中间步骤；完整追踪需要第三方工具。⁵ n8n 支持通过聊天、电子邮件和协作渠道进行 AI 工具调用审批，但它不像 Heym 那样对整个执行进行快照和恢复。⁶ Zapier Human in the Loop 支持在 Zaps 内进行审批和数据收集，但它不是公开审查、快照恢复的检查点系统。⁷ Make.com 将 Human in the Loop 作为企业版应用提供，支持审查请求以及调整/批准/取消结果，但它仍受套餐限制且不够 agent 原生。⁸ n8n 提供专用的 Guardrails 节点，Zapier 在其 AI 产品中提供 AI Guardrails，Make.com 记录了 agent 规则及审查流程，但没有可比拟的独立 guardrails 功能，因此 Make 被标记为有限。⁹ n8n 默认按顺序执行；并行需要子 Workflow 变通方案。¹⁰ Sustainable Use License — 可免费自托管用于内部使用，商业再分发受限。¹¹ 截至 2026 年 4 月 22 日，n8n 的官方文档描述的是 HTTP 批处理和循环/等待模式，而非原生 LLM 批处理状态分支；Zapier 的官方 ChatGPT 应用文档未列出任何 Trigger，仅有一个通用的 API Request 测试版；Make 的官方 OpenAI 集成页面暴露了诸如 create/watch completed 之类的批处理操作，但没有一等状态分支 LLM 节点，因此 n8n/Make 在此特定 Workflow 模式上被标记为有限，Zapier 被标记为不可用。¹² n8n 的官方文档涵盖 HTTP Webhook 和 HTTP Request 节点以及 Code/自定义/社区扩展性，但我找不到第一方 WebSocket Trigger/发送节点，因此 n8n 被标记为有限。¹³ Zapier 的官方文档涵盖入站 Webhook 和出站 Webhook/API 请求（仅限 HTTP），不包含原生 WebSocket Trigger 或发送步骤。¹⁴ Make 的官方文档涵盖 Webhooks 模块和 HTTP(S) 请求模块，但我找不到原生 WebSocket Trigger 或发送模块。¹⁵ n8n 没有原生 LLM Token 成本追踪；存在社区变通 Workflow，但需要手动安装和执行后 API 调用（截至 2026 年 5 月有开放的功能请求）。Zapier 不向用户暴露每次执行的 Token 数量或美元成本；AI 步骤仅消耗任务。Make.com 的积分仪表板部分反映 Make 托管 AI 的 Token 消耗（自 2025 年 8 月起），但第三方 API 密钥连接按 1 次操作 = 1 积分计费，不进行 Token 计数；没有按模型划分的每次执行美元明细。¹⁶ Heym 通过 OTLP/HTTP 向任何兼容后端发出原生 OpenTelemetry span（每次 Workflow 运行一个，每个节点一个），具有 W3C trace-context 传播且无需插桩代码，通过 `HEYM_OTEL_*` 环境变量配置，默认禁用。n8n 有文档化的 OpenTelemetry 追踪集成，用于 Workflow 和节点执行。截至 2026 年 6 月，Zapier 和 Make.com 未记录其 Workflow/场景执行的 OpenTelemetry 导出。¹⁷ n8n 记录了用于生产执行指标的 Insights 仪表板，Zapier 记录了 Zap History 加 Task Usage，Make.com 记录了 Scenario History；这些是监控/历史界面，而非像 Heym 的 Dashboard 标签页那样由任意 Workflow 逻辑支持的自定义仪表板组件。¹⁸ Heym Workflow Analyzer 在可能的情况下运行 Workflow，读取执行结果，并生成一份共享的可编辑 Markdown 报告，涵盖改进领域、目的和逐步行为。n8n 记录了用于创建/优化/调试 Workflow 的 AI Workflow Builder，Zapier 记录了针对出错 Zap 运行的 AI 故障排除，Make.com 记录了场景历史加 AI agent 推理步骤，但它们的公开文档未描述相同的运行感知共享 Workflow 分析文档。¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) 列出正在运行的执行，并可将先前执行的数据加载到编辑器中，而 [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) 在其编辑器中暴露运行状态。[Make Scenario History](https://help.make.com/scenario-history) 记录了运行详情和日志。其公开文档（于 2026 年 7 月 18 日查阅）未描述 Heym 的确切流程：从 History 或 Kanban 卡片打开任意进行中的生产运行，恢复其当前节点快照，并在同一画布上继续接收节点动画和 Debug 日志。²⁰ Heym 的 [Codex](../nodes/codex-node.md) 和 [OpenCode Go](../nodes/opencode-go-node.md) 节点在隔离的 Heym 工作区中针对 GitHub 仓库运行真实的编码 agent CLI — 克隆、编辑、生成 diff、推送分支、打开 pull request — 作为一等 Workflow 步骤。截至 2026 年 7 月 20 日，没有竞争对手记录了等效功能：n8n 的 [OpenAI 节点](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) 涵盖聊天/助手 API 调用，而非仓库级编码 agent，原生 Codex 支持仍是社区请求；Zapier 自己的博客记录了相反方向 — [Codex 通过 Zapier MCP 驱动 Zapier 工具](https://zapier.com/blog/automate-codex-zapier-mcp/) — 而非 Codex 作为 Zap 步骤；Make.com 的 OpenAI 模块暴露补全/助手/批处理操作，而非克隆仓库并打开 PR 的编码 agent。²¹ Heym 的 [Board 标签页](../tabs/board-tab.md) 是内置的 agentic Kanban 看板，其列执行 Workflow，其卡片携带上下文、对话历史、执行状态和运行。n8n（[Kanban Tool 集成](https://n8n.io/integrations/kanban-tool/)）、Zapier（[Kanban Tool 集成](https://zapier.com/apps/kanbantool/integrations)）和 Make.com（[Kanban Tool 集成](https://www.make.com/en/integrations/kanban-tool)）仅连接到第三方 kanban 应用，如 Kanban Tool、Wekan 或 NocoDB；截至 2026 年 7 月 20 日，没有任何一个记录了运行自身 Workflow 的内置看板。²² n8n 在内部存储执行二进制数据（可选存储在 [S3 兼容外部存储](https://docs.n8n.io/hosting/scaling/external-storage/) 上），但未记录任何面向用户的文件驱动器（带分享链接或团队共享），因此被标记为有限。Zapier 的 [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) 仅在 Zap 运行期间处理文件，[Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) 保存小型文本值，因此 Zapier 被标记为有限。Make.com 的 [数据存储](https://help.make.com/l6du-data-stores) 保存结构化记录，其 [文件处理](https://help.make.com/working-with-files) 在应用之间传递文件，但没有持久的内置存储，因此 Make 被标记为不可用。²³ Heym 的 [Playwright 节点](../nodes/playwright-node.md) 是第一方浏览器自动化，具有可视化步骤模式、AI 生成步骤和全代码模式。n8n 仅提供社区包，如 [n8n-playwright](https://github.com/toema/n8n-playwright)，且[原生浏览器自动化节点的功能请求](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796)仍然开放，因此被标记为有限。Zapier Agents 可以[通过网络浏览和 Chrome 扩展浏览和阅读页面](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension)，但 Zapier 未记录任何脚本化浏览器自动化步骤，因此被标记为有限。截至 2026 年 7 月 20 日，Make.com 记录的是 HTTP 模块和第三方抓取应用，而非任何原生浏览器自动化模块。

## 相关

- [简介](./introduction.md) – 平台概览
- [快速开始](./quick-start.md) – 构建您的第一个 Workflow
- [Workflow 分析](../reference/workflow-analysis.md) – 生成共享的运行时感知 Workflow 报告与改进反馈
- [Dashboard 标签页](../tabs/dashboard-tab.md) – 使用 AI 生成的图表组件构建由 Workflow 驱动的仪表盘
- [Agent 节点](../nodes/agent-node.md) – 支持工具调用、MCP 和技能的 LLM 节点
- [Agent 架构](../reference/agent-architecture.md) – 子 Agent、编排器与工具分发
- [Board 标签页](../tabs/board-tab.md) – 具备 Workflow 执行列的 Agentic 看板
- [Codex 节点](../nodes/codex-node.md) – 针对 GitHub 仓库运行 OpenAI Codex 编码 Agent
- [OpenCode Go 节点](../nodes/opencode-go-node.md) – 在加固容器中运行与提供商无关的编码 Agent
- [Drive 标签页](../tabs/drive-tab.md) – 内置文件存储，支持分享链接、团队和批量操作
- [Playwright 节点](../nodes/playwright-node.md) – 第一方浏览器自动化，支持 AI 步骤和代码模式
- [RAG / 向量存储节点](../nodes/rag-node.md) – 向量搜索与文档插入（Qdrant 或 Postgres pgvector）
- [AI 助手](../reference/ai-assistant.md) – 自然语言 Workflow 构建器
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 带公开审核 URL 的 Agent 检查点
- [Guardrails](../reference/guardrails.md) – 在到达模型之前拦截不安全的 Prompt
- [Traces 标签页](../tabs/traces-tab.md) – LLM 调用可观测性
- [Evals 标签页](../tabs/evals-tab.md) – AI Workflow 的测试套件
- [Alerts 标签页](../tabs/alerts-tab.md) – 针对错误、时长、成本和运行量的阈值告警
- [OpenTelemetry 追踪](../reference/opentelemetry.md) – 通过 OTLP 导出运行、节点和工具 Span
- [负载分发](../reference/cluster.md) – 通过 Leader 故障转移在实例间共享运行
- [单点登录](../reference/sso.md) – 通过任意 OpenID Connect 提供商登录
- [审计日志](../reference/audit.md) – 记录操作者、目标和结果的安全相关操作
- [Portal](../reference/portal.md) – 将 Workflow 发布为公开聊天 UI
- [并行执行](../reference/parallel-execution.md) – 基于 DAG 的并发执行
- [MCP 标签页](../tabs/mcp-tab.md) – MCP 服务端与客户端配置
