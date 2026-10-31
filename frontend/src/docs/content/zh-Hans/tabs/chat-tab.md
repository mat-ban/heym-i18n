# Chat 标签页

**Chat** 标签页提供直接的 LLM 对话界面。您可以用它来测试模型、提问、运行已有的 Workflow，或通过自然语言请求创建新的 Workflow。

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ 观看 Chat 演示</a></p>

## 设置

1. 选择一个[凭据](./credentials-tab.md)（OpenAI、Google 等的 API key）
2. 从下拉菜单中选择一个模型（模型根据所选凭据加载）
3. 开始输入以发送消息

您也可以从 [Workflows 标签页](./workflows-tab.md)的聊天框中发起对话。它会发送您的第一条消息，并在此处打开新对话，答案已开始流式输出。

## 功能

- **全局变量上下文** – 您的[全局变量](../reference/global-variables.md)对 LLM 可用，因此您可以询问或引用已存储的值
- **工作区模板上下文** – 工作区中共享的 Workflow 和节点模板会作为上下文包含在内，因此 Chat 可以回答关于可用模板的问题
- **长时间运行的 Agent** – 即使浏览器关闭，Chat 仍会在后端继续运行，因此您可以从另一台设备回来继续同一对话
- **Workflow 创建** – 让 Chat 创建或设置一个 Workflow，它会使用与编辑器助手相同的 Workflow AI Builder 引擎来生成并保存该 Workflow
- **看板任务创建** – 用自然语言请求添加任务或创建卡片。Chat 会将其添加到所请求看板的第一列；当您有多个看板且未指定时，Chat 会在创建卡片前呈现看板选择器
- **排队后续消息** – 在答案流式输出期间发送更多消息。排队的消息会被持久化，可在开始前编辑或删除，并在当前响应完成后按顺序运行
- **规划暂停** – 当 Chat 需要规划细节时，它会提出澄清问题并暂停排队的后续消息，直到您回答。规划答案完成后，排队的消息会恢复
- **凭据** – 当 Chat 创建或编辑的 Workflow 需要凭据时，Chat 会询问使用哪一个，提供在对话中创建新凭据的选项，或允许您跳过。您也可以让 Chat 创建凭据或更新您拥有的凭据；它会在对话中打开凭据表单。模型只能看到凭据的名称和类型，永远看不到其值，对于您拥有的凭据和与您共享的凭据均是如此。Chat 添加的 LLM 和 Agent 节点使用为该聊天选择的凭据和模型运行（包括共享凭据）；当 Chat 编辑 Workflow 时，其原有的 LLM 和 Agent 节点将保留各自的凭据和模型。参见 [AI Assistant › 凭据](../reference/ai-assistant.md#credentials)
- **Dashboards** – 询问您有哪些[仪表盘](./dashboard-tab.md)、某个仪表盘上有什么内容，或者某个 Workflow 位于哪个仪表盘上。让 Chat 向仪表盘添加新小组件（它会在那里放置一个空小组件，然后构建并测试其 Workflow）、将现有 Workflow 作为小组件放入仪表盘、重命名或删除小组件，或整理仪表盘的布局。Heym Work 将这些仪表盘显示为其页面。请参阅 [Dashboard › 来自 Chat 和 MCP](./dashboard-tab.md#来自-chat-和-mcp)
- **数据表** – 当 Chat 创建或编辑的 Workflow 需要存储记录时，Chat 会询问使用哪个[数据表](./datatable-tab.md)，或提议创建一个包含所需列的新表。它还可以检查行、添加或删除列，并直接在您拥有或可编辑的表上插入、更新或删除行。向其提供表名或 DataTable 链接即可。删除列和清除所有行都会要求确认；添加列会保留现有数据。请参阅 [AI 助手 › 数据表](../reference/ai-assistant.md#data-tables)
- **流式响应** – 实时查看模型的输出流
- **停止响应** – 随时中断当前正在流式输出的答案；停止操作也会清除该对话中排队的消息
- **Markdown 渲染** – 响应支持 markdown 格式，包括内联图片
- **图片显示** – 响应中嵌入的图片（例如来自 LLM 图片生成）会内联显示；点击任意图片可全屏查看。按 **Esc** 或返回按钮（移动端）关闭全屏视图
- **复制消息** – 将任意消息复制到剪贴板
- **清除对话** – 开始新对话
- **语音输入** – 使用麦克风按钮进行语音转文字（浏览器支持）。录音停止后，Heym 可以在您发送前对转录文本进行轻度清理
- **定时 Workflow** – 询问 Cron Workflow 的运行时间（今天、本周、本月或自定义日期范围）。助手使用与[定时](./scheduled-tab.md)标签页相同的调度数据，并可将结果限制为您拥有的 Workflow 或包含与您共享的 Workflow
- **Workflow 运行历史** – 询问某个 Workflow 的情况（“日报运行了多少次？”、“它失败了吗？”、“它上次运行是什么时候？”）。Chat 通过其 ID 查找该 Workflow，并根据其运行次数、状态分布、首次和最后运行时间以及平均时长来回答。询问某次运行为何失败或返回了什么，Chat 会打开该次运行以读取其输入、输出和每个节点的错误
- **运行在何处失败以及为何缓慢** – 询问您的 Workflow 在何处失败或为何缓慢，Chat 会列出运行最多、失败最多和最慢的 Workflow，以及耗时最多（每次调用平均耗时和总耗时）、失败最多和运行最多的节点类型，这些数据与 [Analytics](./analytics-tab.md) 标签页中的数据完全相同。节点类型是从添加节点分析功能的版本开始计算运行情况的。可以询问过去 1 小时、3 或 6 小时、24 小时、7 或 30 天或所有时间的数据；小时窗口从整点开始，因此在 15:20 询问“过去一小时”涵盖从 14:00 至今的时间段。
- **实时运行状态** – 询问当前正在运行的内容，Chat 会回答数量、Workflow 名称、每次运行已持续的时间、当前所在节点，以及直接指向实时运行的链接

- **运行上下文标签** – [Execution History](../reference/execution-history.md#ask-ai) 中的 **询问 AI** 会打开一个新对话，并将选定的 Workflow 运行作为标签附加。请参阅 [询问关于运行的信息](#xun-wen-guan-yu-yun-xing-de-xin-xi)

## 从 MCP 客户端使用 Chat

Chat 引擎也可以从浏览器外部访问。在 [MCP / A2A 标签页](./mcp-tab.md)中开启 **Heym Agent**，MCP 客户端（Claude、Cursor 以及任何其他支持 MCP 的工具）即可获得单个 `heym_chat` 工具，运行带有全部功能的相同引擎。同时勾选 **启用 A2A**，其他 Agent 即可通过 [A2A](../reference/a2a.md) 向其发送任务；这些对话在列表中会显示网络图标。

这些对话会出现在此标签页的历史记录中，并在对话列表中标记一个插头图标。打开其中一个即可查看客户端发送了什么、查看它触发的工具卡片，并自行继续该对话。无论是从此处发起还是从 MCP 客户端发起，回答澄清问题的方式都相同。

通过 MCP 使用时，Chat 不会列出、选择或创建凭据。它构建的 Workflow 会将凭据字段留空，并在回复中列出需要凭据的节点，以便您在编辑器中设置。

数据表同样支持通过 MCP 使用：Chat 可以直接编辑列和行、创建表并将其连接到 Workflow 中。表相关的问题和删除确认会作为结果中的文本提供；使用相同的 `conversation_id` 回复即可。

## 上下文限制

Chat 在上下文中保留最多 25 条最近消息。较早的消息会被裁剪，以保持在模型限制范围内。

## 创建 Workflow

当您要求 Chat 创建、构建、生成或设置一个 Workflow 时，它会创建一个新的已保存 Workflow，并生成名称和描述。响应中包含生成节点和边的只读画布预览，以及一个 **Open workflow** 链接，可在新的浏览器标签页中打开 Workflow 编辑器。当您想要执行该 Workflow 时，请使用预览卡片上的 **Run** 按钮。

在同一对话中的后续反馈会编辑该 Workflow，而不是创建另一个。例如，在 Chat 创建了一个 Workflow 之后，您可以输入“add an approval step”、“change the output format”或“şöyle yap”，Chat 会更新已保存的 Workflow 并刷新预览。

这最适合您希望将工作作为可复用自动化来完成、而不仅仅是一次性回答的请求。

## 创建看板任务

用日常语言向 Chat 提出请求，例如“Add a task called Fix login bug”或
“Create a new card Update documentation on the Launch board.”您可以在同一请求中包含
描述。Chat 始终会在所选看板的第一列中创建卡片。

如果您的工作区有多个看板且您未指明具体看板，Chat 会暂停并显示一个单选看板选择器。选择一个看板以完成卡片创建。无需斜杠命令或特殊消息格式。

## 查询正在运行的内容

用日常语言提问——“what is running?”、“how many workflows are active right now?”、
“which node is the nightly report on?”——Chat 会报告实时情况：

- **有多少**执行正在进行，分为运行中和等待人工审核
- **属于哪些 Workflow**，按名称列出
- **每次运行已持续多久**（例如 `1m 35s`、`3h 25m`）
- **当前正在执行哪个节点**，按其画布标签显示，以及最后完成的节点
- **每个实时运行的链接**，可打开画布并回放该执行

因 [Human-in-the-Loop](../reference/human-in-the-loop.md) 或 Codex 审核而暂停的运行会报告为等待您处理，而不是运行中。这与页眉中的活跃运行徽章数据相同，因此 Chat 和徽章永远不会不一致。对于已经完成的运行，请改为查询最近的执行——即读取 [Execution History](../reference/execution-history.md)。

## 询问关于运行的信息

在 [Execution History](../reference/execution-history.md#ask-ai) 中选择一次 Workflow 运行（可从编辑器或 All History 中选择），然后点击对话框标题旁的 **询问 AI**。Chat 会打开一个新对话，并在消息输入框上方显示两个标签：

- **Workflow:** Workflow 的名称
- **Execution:** 所选运行 ID 的前几个字符

点击标签的 **×** 即可将其移除。然后输入您的问题，例如「为什么这次运行耗时这么长？」、「这里失败的原因是什么？」或「你能修复它吗？」。剩余的标签将附带完整 ID 附加到该消息中，以便 Chat 直接读取运行的输入、输出以及各节点的跟踪记录，而无需搜索该 Workflow。如需修复 Workflow，Chat 会保存、测试运行并验证更改，如 [创建 Workflow](#chuang-jian-workflow) 中所述。

发送的消息会在您的问题下方显示这些标签。它们仅属于该消息；同一对话中的后续问题会保留历史记录中的上下文。

## 查询告警

Chat 可以回答关于您已定义的[告警](./alerts-tab.md)的问题：

- **存在哪些告警**——“what alerts do I have?”、“is there an alert on the invoice workflow?”、
  “which alerts are firing right now?”
- **某个告警如何配置**——“what is the threshold on the cost alert?”、“how is that configured?”
- **为何以及何时触发**——“why did the cost alert fire?”、“when did this last trigger?”

对于“为何触发”的问题，Chat 会读取触发记录，并引用实际观测值、阈值以及被评估的确切窗口，外加相关细节：错误告警的失败执行 ID 和错误消息、成本告警的按模型支出，或执行次数告警的触发源细分。它报告的是告警触发时为真的情况，而不是重新计算窗口，因为窗口已经过去，重新计算可能得出不同结果。

## 用户规则

[User Rules](../reference/user-settings.md)（在 Settings 中配置）会自动作为系统级指令注入到每个 Chat 对话中。设置一次即可将持久偏好应用于所有 Chat 请求。

## 使用 Evals

Chat 可以创建、修改和运行 [Evals](./evals-tab.md) 中的套件，包括 Prompt 套件和 Agent 套件：

- **Prompt 套件**：“为我的支持回复 Prompt 创建一个包含 8 个测试用例的 Prompt 套件，并对比 gpt-4o 与 gpt-4.1-mini”。Chat 会编写带有预期答案的测试用例，选择评分方法并保存套件。
  - 在创建套件之前，它会确定使用哪个 LLM 凭证和模型。如果仅有一个 LLM 凭证，它会直接使用并说明；否则会进行询问。
  - 对于 LLM-as-Judge 评分，它还会询问是否应由单独的裁判模型对答案进行评分。
- **Agent 套件**：“检查我的支持 Agent 是否总是搜索文档且从不发送电子邮件”。Chat 会找到该 Agent 并保存工具检查项和阈值。当您提出要求时，它会运行 Workflow，为每次运行生成不同的输入。
  - Agent 套件的运行是真实的 Workflow 运行，因此其实际副作用会发生。Chat 会说明其启动了多少次运行。
  - **Baseline**：Chat 可以通过三种方式处理 Agent 的基线：
  - 根据该 Agent 的最新运行记录进行报告。
  - 根据其启动的运行进行构建（“运行 5 次并将该结果作为 baseline”）。
  - 保存您给出的数值（“将 baseline 设置为 3 秒 p95，每次运行 0.01 美元”）。
- **运行**：Chat 最多等待一分钟以完成一次运行，然后报告结果：
  - 对于 Prompt 套件：每个模型的通过计数以及失败的用例。
  - 对于 Agent 套件：通过率、失败的检查项以及与基线的偏差。
  - 耗时更长的运行会在 Evals 中继续进行；可以让 Chat 再次进行检查。

Chat 创建或更改套件后，回复会显示一个卡片，其中包含套件名称、类型和 **在 Evals 中打开** 按钮，就像已保存 Workflow 的卡片一样。通过 MCP，`heym_chat` 结果会列出该次调用中保存的每个套件的链接。

通过 `heym_chat` 从 MCP 客户端执行相同操作也是如此（请参阅 [从 MCP 客户端使用 Chat](#从-mcp-客户端使用-chat)）。评估工具保留在 `heym_chat` 内部；MCP 客户端不会将它们视为单独的工具。

编辑器的 AI 助手不会创建套件。

## 使用 Evals

Chat 可以创建、修改和运行 [Evals](./evals-tab.md) 中的套件，包括 Prompt 套件和 Agent 套件：

- **Prompt 套件**：“为我的支持回复 Prompt 创建一个包含 8 个测试用例的 Prompt 套件，并对比 gpt-4o 与 gpt-4.1-mini”。Chat 会编写带有预期答案的测试用例，选择评分方法并保存套件。
  - 在创建套件之前，它会确定使用哪个 LLM 凭证和模型。如果仅有一个 LLM 凭证，它会直接使用并说明；否则会进行询问。
  - 对于 LLM-as-Judge 评分，它还会询问是否应由单独的裁判模型对答案进行评分。
- **Agent 套件**：“检查我的支持 Agent 是否总是搜索文档且从不发送电子邮件”。Chat 会找到该 Agent 并保存工具检查项和阈值。当您提出要求时，它会运行 Workflow，为每次运行生成不同的输入。
  - Agent 套件的运行是真实的 Workflow 运行，因此其实际副作用会发生。Chat 会说明其启动了多少次运行。
  - **Baseline**：Chat 可以通过三种方式处理 Agent 的基线：
  - 根据该 Agent 的最新运行记录进行报告。
  - 根据其启动的运行进行构建（“运行 5 次并将该结果作为 baseline”）。
  - 保存您给出的数值（“将 baseline 设置为 3 秒 p95，每次运行 0.01 美元”）。
- **运行**：Chat 最多等待一分钟以完成一次运行，然后报告结果：
  - 对于 Prompt 套件：每个模型的通过计数以及失败的用例。
  - 对于 Agent 套件：通过率、失败的检查项以及与基线的偏差。
  - 耗时更长的运行会在 Evals 中继续进行；可以让 Chat 再次进行检查。

Chat 创建或更改套件后，回复会显示一个卡片，其中包含套件名称、类型和 **在 Evals 中打开** 按钮，就像已保存 Workflow 的卡片一样。通过 MCP，`heym_chat` 结果会列出该次调用中保存的每个套件的链接。

通过 `heym_chat` 从 MCP 客户端执行相同操作也是如此（请参阅 [从 MCP 客户端使用 Chat](#从-mcp-客户端使用-chat)）。评估工具保留在 `heym_chat` 内部；MCP 客户端不会将它们视为单独的工具。

编辑器的 AI 助手不会创建套件。

## 相关

- [MCP / A2A Tab](./mcp-tab.md) – 将此引擎作为 `heym_chat` 工具暴露给 MCP 客户端
- [Settings](../reference/user-settings.md) – 设置应用于所有聊天请求的 User Rules
- [Credentials Tab](./credentials-tab.md) – 添加和管理 API keys
- [Variables Tab](./global-variables-tab.md) – Chat 可用的全局变量
- [Node Types](../reference/node-types.md) – 用于 Workflow 的 LLM 和 Agent 节点
- [Agent Node](../nodes/agent-node.md) – 支持工具调用的 AI Agent
- [AI Assistant](../reference/ai-assistant.md) – 由同一 workflow builder DSL 驱动的编辑器助手
- [Execution History](../reference/execution-history.md) – 查看历史运行记录（页眉中的 History 按钮）
- [Scheduled Tab](./scheduled-tab.md) – 即将执行的 cron 运行日历（Chat 可汇总的同一数据）
- [Alerts Tab](./alerts-tab.md) – Chat 可列出并解释的阈值告警
- [Contextual Showcase](../reference/contextual-showcase.md) – 此页面的紧凑型应用内引导
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – 通过 ElevenLabs 朗读消息并免提对话

## 工具调用与上下文大小

每当助手调用工具（运行 Workflow、列出执行记录、构建新 Workflow）时，对话中会出现一张可折叠卡片。卡片在工具运行期间自动展开，显示确切的参数。工具完成后，卡片折叠为一行摘要，并显示耗时。点击任意卡片可重新展开参数和响应摘要。

输入框下方的小环形徽章显示当前上下文使用量占模型窗口的百分比（例如 `12% · ~9.2k`）。将鼠标悬停在徽章上可查看明细：system prompt、AGENTS.md、workflows block、user rules、history 以及您的草稿输入。当使用量超过 80% 时，环形变为琥珀色；达到 95% 时变为红色。

如果使用量接近上限，Heym 会自动使用与 Agent 节点相同的机制将较早的消息压缩为简短摘要。对话中会出现一张“Context compressed”卡片，显示所发生的情况。
