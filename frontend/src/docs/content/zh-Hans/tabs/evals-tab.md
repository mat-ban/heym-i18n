# Evals 标签页

**Evals** 标签页是位于 `/evals` 的独立页面。您可以通过它创建评估套件、定义测试用例，并针对您的 [Agent](../nodes/agent-node.md) Workflow 运行评估。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ 观看 Evals 演示</a></p>

## 访问方式

- 在仪表盘标签栏中点击 **Evals**
- 或导航至 `/evals`
- 或使用 **Ctrl+K**（Cmd+K）并从命令面板中选择 "Evals"

## 评估套件

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
- **Temperature** – 设置模型 Temperature（`Exact Match` 和 `Contains`）
- **推理强度** – 为推理模型设置推理强度（`Exact Match` 和 `Contains`）

### LLM-as-Judge

使用 Judge 时，每个模型仅凭套件 Prompt 回答测试输入，然后由 Judge 对答案与预期输出的匹配程度进行 0 到 100 的评分：

- **模型 Judge**（OpenAI、OpenAI 兼容或 Gemini）读取问题、预期输出和答案，并返回评分及一行理由。它以 Temperature `0` 运行，对于推理模型则以 `low` 推理强度运行，因此相同答案会得到相同判定。
- **Decision Model Judge** 按照五级评分标准对答案进行评分，从 *完全偏离* 到 *完全匹配*。评分是该评分标准上的概率加权位置，因此它来自模型计算出的分布，而非模型写出的数字。

单元格的悬停卡片会显示 Judge 的理由，对于 Decision Model 则显示等级、评分及其置信度。延迟和 Token 描述的是被测模型；Judge 自身的调用会以 **Evals** 来源出现在 [Traces](./traces-tab.md) 中。模型选择器会排除 Model Router 凭证，因为评估比较的是特定模型。

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
