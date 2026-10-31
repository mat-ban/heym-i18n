# Evals 标签页

**Evals** 标签页是位于 `/evals` 的独立页面。您可以通过它创建评估套件、定义测试用例，并针对您的 [Agent](../nodes/agent-node.md) Workflow 运行评估。 [Agent 评估套件](#agent-suites) 可以运行 Agent 或读取其实际运行记录，并检查其调用的工具、延迟、USD 成本、Token 数量以及工具调用次数。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ 观看 Evals 演示</a></p>

## 访问方式

- 在仪表盘标签栏中点击 **Evals**
- 或导航至 `/evals`
- 或使用 **Ctrl+K**（Cmd+K）并从命令面板中选择 "Evals"

## 评估套件

- **新建套件** – 选择 **Prompt 套件** 以跨模型测试系统 Prompt，或选择 **Agent 套件** 检查 Agent 的实际运行情况（参见 [Agent 套件](#agent-suites)）
- **套件选择器** – 将 Prompt 套件和 Agent 套件统一列出，并在每个名称旁注明类型；输入关键词即可搜索
- **创建套件** – 使用名称和描述定义一个套件
- **选择 Workflow** – 选择要评估的 Workflow
- **选择凭证** – 用于运行 Workflow 的 API key
- **系统 Prompt** – 直接在左侧面板中编辑套件级别的系统 Prompt
- **优化 Prompt** – 请求 LLM 改进当前系统 Prompt

## 测试用例

- 添加包含输入 Prompt 和预期输出的测试用例
- 每个用例可以设置自定义的预期值用于比较
- 在套件中编辑或删除用例
- **生成测试数据** – 使用选定的凭证/模型从套件 Prompt 自动创建测试用例

## 运行评估

- **选择一个或多个模型** – 在一次评估中针对多个模型运行同一个套件
- **评分方法** – 选择 `Exact Match`、`Contains` 或 `LLM-as-Judge`
- **Judge** – 对于 `LLM-as-Judge`，可选择 OpenAI、OpenAI 兼容（Custom）、Gemini（Google）或 [Decision Model](../nodes/decision-node.md) 凭证，并输入 Judge 的模型名称（例如 `gpt-4o-mini` 或 `jev-latest`），以使用独立的 Judge 进行评分
- **每个测试的运行次数** – 在一次运行中重复每个测试用例多次
- **记忆设置** – 套件打开时会自动应用其最新一次运行的设置：凭证、模型、评分方式和评委、Temperature、推理强度以及每个测试的运行次数。打开历史运行记录会加载当时的设置，点击 **重新运行评估** 即可完全重复该测试
- **Temperature** – 设置模型 Temperature（`Exact Match` 和 `Contains`）
- **推理强度** – 为推理模型设置推理强度，支持从 Low 到 Extra high 和 Max，与 LLM 节点和 Agent 节点保持一致（`Exact Match` 和 `Contains`）

### LLM-as-Judge

使用 Judge 时，每个模型仅凭套件 Prompt 回答测试输入，然后由 Judge 对答案与预期输出的匹配程度进行 0 到 100 的评分：

- **模型 Judge**（OpenAI、OpenAI 兼容或 Gemini）读取问题、预期输出和答案，并返回评分及一行理由。它以 Temperature `0` 运行，对于推理模型则以 `low` 推理强度运行，因此相同答案会得到相同判定。
- **Decision Model Judge** 按照五级评分标准对答案进行评分，从 *完全偏离* 到 *完全匹配*。评分是该评分标准上的概率加权位置，因此它来自模型计算出的分布，而非模型写出的数字。

单元格的悬停卡片会显示评委给出的原因，对于决策模型则显示级别、得分及其置信度。延迟和 Token 描述的是被测模型；评委自身的调用记录会以 **Evals** 来源出现在 [Traces](./traces-tab.md) 中。评委选择器会排除 Model Router 凭证，因为评委必须是固定的单个模型。被测模型的凭证可以使用 [Model Router](../reference/credentials.md#model-router-auto-model)：其 **Auto** 模型会根据每个请求动态挑选模型，机制与在 Workflow 中完全一致。

不使用 Judge 时，每个模型在单次请求中自行回答并评分。

此模式下 Temperature 和推理强度会被隐藏，运行使用固定设置：标准模型 Temperature 为 `0.7`，推理模型推理强度为 `medium`（当模型自行评分答案时为 `low`）。

## 结果

- 查看每个测试用例的通过/失败情况
- 检查实际输出与预期输出
- 当一次运行包含多个模型时，并排比较各模型的输出
- 查看过往评估的运行历史；`LLM-as-Judge` 运行会在历史列表中显示其 Judge 模型
- 从结果面板打开历史运行，检查保存的 Prompt/输入/输出快照
- 打开过往运行会将评分方法和 Judge 加载到左侧面板，因此 **Re-Run Evals** 会重复相同的评估
- **Export** 将运行下载为 JSON，包含 `judge_credential_id` 和 `judge_model`

## Agent Suites

Agent 套件用于根据 [Agent](../nodes/agent-node.md) 节点的运行记录对其进行质量检查。它从 [Traces](./traces-tab.md) 中读取数据（每次运行均已记录耗时、Token、成本及工具调用），也可以直接代您执行该 Workflow。

点击 **新建套件** → **Agent 套件**，按照以下三步完成创建：

1. **Agent** – 选择目标 Workflow 及其 Agent 节点。列表中仅展示包含 Agent 节点的 Workflow；尚未运行过的 Workflow 或 Agent 会显示但无法被选中。右侧展示所选 Agent 的设置（模型、指令、工具与限制），下方展示该 Workflow 的只读画布并高亮标出该 Agent。
2. **基线** – 该 Agent 最近的 10 次运行指标：p50 与 p95 延迟、单次运行成本、单次运行 Token 以及单次运行工具调用次数、调用了哪些工具及频次，以及每次运行的具体数据。以错误结束的运行虽会列出，但会自动从基线中剔除。
3. **检查项** – 为每个工具标记 **Must call**、**Must not call** 或 **Either**。所有调用种类均附带其类型列出：Python 与节点工具、带服务器信息的 **MCP** 工具、按标签划分的 **Sub-Agent**、按名称划分的 **Sub-Workflow** 以及 **skills**。若某个工具尚未运行过，可按类型和名称手动添加，并可通过其 **X** 图标删除。为延迟、成本、总 Token 和工具调用次数设置上限阈值；每个上限默认设为基线 p95 值的 120%，亦可单独关闭。

保存后的套件将默认展示 **结果** 界面，旁边提供 **基线** 与 **编辑检查项**：

- **运行 Workflow** – 选择运行次数（最多 20 次）；系统支持 4 次并发运行。输入参数默认沿用该 Workflow 最新一次运行的数据且支持编辑，每次运行均使用该参数。开启 **生成输入**（星光图标），选择凭证和模型，即可让模型为每次运行编写不同的输入内容。模型会阅读该 Agent 的系统指令，并生成与您所输入内容相近的数据（例如输入城市名称会拓展生成其他城市名称）。每次运行均如同正常触发一样完整执行整个 Workflow，并在执行历史中带有 `agent_suite` Trigger 标记。若需跳过后续步骤（例如发送邮件），可通过面板中的 **前往 Workflow** 打开画布并预先禁用相关节点。点击 **停止** 可终止套件运行：不会再启动新的运行，进行中的运行亦会被取消。因服务器中断（例如容器重启）而中止的套件运行，会在 1 分钟后标识为已中断，而不会无限期挂起。
- **结果** – 默认对最新的套件运行进行评分。每次套件运行记录均随其日期保存在运行选择器中，支持随时查阅或删除；您也可以切换至该 Agent 最近的 10、20 或 50 次运行，将其他外部运行一并纳入统计。您可以直观查看通过率、各检查项的通过频次、延迟、成本、Token 和工具调用与所存基线的对比，并可查看每次运行的失败原因及直达其 Trace 的链接。
- **前往 Workflow** 会在新标签页中打开该 Agent 所在的 Workflow。在名称输入框中按下 **Esc** 或点击 **X** 即可清空内容。

指标解读说明：

- **延迟** 为模型的响应时间加上该次运行中所有工具调用的耗时总和。
- **成本** 采用与 Traces 完全一致的计费定价。若所用模型未配置单价，则会自动跳过成本检查，而非判定为失败。
- 当单次运行无错误完成且所有检查项均满足时，判定为 **通过**。
- 套件仅读取您自己有权访问的 Traces，规则与 Traces 标签页完全一致。
- 在 **编辑检查项** 中点击 **使用最新运行作为基线**，即可将已存基线替换为该 Agent 最新的运行数据。

套件基线支持三种数据来源，**编辑检查项** 会在 **已存基线** 旁标明当前生效的来源：

- Agent 最新的实际运行（默认值，亦即 **使用最新运行作为基线** 所采纳的数据），
- 某次已完成的套件运行，
- 手动输入的静态数值。

后两种方式可通过 [Chat](./chat-tab.md#working-with-evals) 或直接调用 API 进行设置：

- `PATCH /api/evals/agent-suites/{id}` 支持传入 `baseline: {"source": "suite_run", "run_id": "…"}` 或 `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`。
- `POST /api/evals/agent-suites/{id}/runs` 接收 `inputs_list` 参数：每次运行对应一个输入对象，最多支持 20 个。

### 通过 Chat 和 MCP 使用

[Chat](./chat-tab.md#working-with-evals) 与 MCP `heym_chat` 工具能够直接创建、修改并执行 Prompt 套件与 Agent 套件：

- 它们能够自主编写测试用例与运行输入参数。
- 在创建 Prompt 套件前，除非候选项唯一，否则它们会向您询问应使用的凭证。
- 它们在对话中提及任何套件时均会附带直达本页面的链接。

## 基准矩阵建议

在为 Agent Workflow 构建基准矩阵时，应将 HITL 场景作为一等用例纳入，而非将其视为边缘情况。

- 覆盖全部三种审核决策：`accepted`、`edited` 和 `refused`
- 包含多种 Trigger 来源，例如编辑器运行、portal、curl/webhook 以及 Cron 触发的执行
- 添加重复审核场景，即一次 Agent 运行暂停多次
- 验证连接到 Agent `review` 输出的通知分支
- 断言拒绝后的下游行为，尤其是后续节点基于 `$agent.decision` 进行分支的情况

## 相关内容

- [Why Heym](../getting-started/why-heym.md) – Evals 作为 Agent 生命周期的测试阶段
- [Agent Node](../nodes/agent-node.md) – 被评估的 Workflow
- [Credentials Tab](./credentials-tab.md) – 用于评估运行的凭证
- [Traces Tab](./traces-tab.md) – 详细的 Trace 检查
- [Workflows Tab](./workflows-tab.md) – 创建要评估的 Workflow
- [Execution History](../reference/execution-history.md) – 查看过往运行（页眉中的 History 按钮）
- [Contextual Showcase](../reference/contextual-showcase.md) – Evals 页面上提供的紧凑页面指南
