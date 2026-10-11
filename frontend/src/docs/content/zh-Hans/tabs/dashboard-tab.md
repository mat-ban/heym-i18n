# Dashboard

**Dashboard** 标签页是一个 Grafana 风格的空间，您可以在其中构建图表 widget 网格。每个 widget 由其自身隐藏的 Heym workflow 输出渲染而成，因此您能在 workflow 中产生的任何数据——数据库查询、API 调用、RAG 查找、LLM 输出——都可以成为图表。您可以保留多个 dashboard，并将每个 dashboard 分享给个人或团队。

## Dashboards

每个人首次打开该标签页时都会自动创建一个 dashboard。使用标签页顶部的 dashboard 选择器在 dashboard 之间切换，点击旁边的 **+** 创建新的 dashboard。选择器先列出您自己的 dashboard，然后列出分享给您的 dashboard，并标注分享者的姓名。

该标签页会重新打开您上次使用的 dashboard，地址栏会携带当前打开的 dashboard（`?tab=dashboard&dashboard=<id>`），因此链接会为任何有权限的人打开该 dashboard。

设置按钮（仅限所有者）可重命名 dashboard、管理分享以及删除 dashboard。删除 dashboard 会移除其 widget 及其 workflow。您始终至少保留一个自己的 dashboard，因此最后一个无法删除。

## Widgets

widget 是网格上的单个图表。支持的图表类型：

- **Bar**（垂直或水平）
- **Line**
- **Area**（填充趋势图，支持多系列）
- **Pie**
- **Table**（可滚动）
- **Numeric**（单个 KPI 值，可带单位）
- **Gauge**（针对最小–最大范围的单个值，例如百分比）
- **Scatter**（用于相关性图的 X/Y 点）
- **Proportion**（一个条形拆分为多个份额，带百分比图例，例如语言分布）
- **Bar gauge**（每行一个水平仪表，带红→绿渐变和数值，例如可用磁盘空间）
- **Text**（markdown 消息，例如“Last execution at 19:47”这样的状态说明；当 markdown 为静态时支持[交互式复选框](../nodes/chart-output-node.md#interactive-task-lists)，并支持[显式编号列表](../nodes/chart-output-node.md#numbered-lists)以实现自定义或降序编号）
- **HITL**（您待处理的人工审核。标题显示 `1/n pending`。workflow 名称会在画布上打开该次运行。**Approve**、**Request changes** 和 **Reject** 可解决该审核。widget 标题旁的历史图标会在本页的历史对话框中打开该次运行。该 widget 不使用上游行，每个人看到自己的队列）

每个 widget 在您打开标签页时异步加载数据，因此页面在图表填充时保持响应。

## 添加 widget

1. 点击 **Add widget**，为其命名并选择图表类型。在选择器下方，对话框会使用示例数据绘制该图表类型的示例，并列出其期望的行，因此您可以在构建之前比较各类型。
2. widget 会在 workflow 编辑器中打开，并带有起始图：一个产生行的 [Set](../nodes/set-node.md) 节点，连接到 [Chart Output](../nodes/chart-output-node.md) 节点。将 Set 节点替换为任意数据源。**HITL** widget 仅包含 Chart Output 节点；它读取您待处理的审核，不需要数据源。
3. 构建 workflow，使馈入 **Chart Output** 的节点产生行数组，然后配置 Chart Output 节点的字段映射（标签字段、值字段等）。
4. 保存，返回 Dashboard 标签页，widget 即会渲染。

双击 widget（或使用其编辑按钮）可随时重新打开其 workflow。使用 widget 标题中的 **Clone widget** 可复制 widget 及其完整 workflow。副本放置在原始 widget 下方，并标注 **(Copy)**，以便您独立编辑。

## 使用 AI 生成 widget

点击 **AI**，描述您想要的指标（例如“过去 30 天的 workflow 成功率，以条形图展示”），并选择 LLM credential 和模型。Heym 会生成一个以 Chart Output 节点结尾的完整 widget workflow，并将其添加到网格中。有关每种图表类型的示例 prompt，请参阅 [Chart Output](../nodes/chart-output-node.md#example-ai-prompts)。

使用 widget 的 **Fine-tune with AI** 按钮，通过新指令修改现有 widget。每次 AI 微调都会将之前的 workflow 快照保存到 widget 的 **Edit History** 中，因此您可以从 workflow 编辑器查看或回滚更改。

## 编辑布局

切换 **Edit** 进入编辑模式，您可以在 12 列网格上拖动 widget 并调整其大小。布局更改会自动保存。widget 标题可在 widget 标题栏中内联编辑。

## 缓存与刷新

每个 widget 会在服务器上缓存其上次计算的数据，缓存时间可配置（TTL）。当缓存新鲜时，重新打开 dashboard 会提供存储的结果，而不是重新运行 workflow。每次重新计算数据时，缓存会就地替换（每个 widget 一个缓存），并且当您编辑 widget 的 workflow 时会自动失效。

使用 widget 的 **Refresh** 按钮（或工具栏中的 **Refresh**）可绕过缓存并立即重新计算。

## 共享

所有者可以从仪表盘的设置中将其共享给单个用户（通过邮箱）或他们所属的任意[团队](teams-tab.md)。每次共享的权限为 **Read**（只读）或 **Write**（可写）；当某人同时拥有个人共享和团队共享时，以权限较高者为准。

| 操作 | 所有者 | Write | Read |
|--------|:-----:|:-----:|:----:|
| 查看组件、刷新组件、使用自动刷新 | ✓ | ✓ | ✓ |
| 添加、克隆、删除、重命名和调整组件大小；AI 生成和微调；勾选清单项 | ✓ | ✓ | |
| 在编辑器中打开组件的 workflow | ✓ | ✓ | |
| 重命名或删除仪表盘、管理共享 | ✓ | | |

**组件始终以仪表盘所有者的身份运行。** 无论谁在查看，组件都使用所有者的凭据和全局变量，其运行记录出现在所有者的执行历史和追踪中。因此，团队成员无需访问背后的账户即可看到相同的数据，且每位查看者共享每个组件的同一份缓存结果。Write 协作者添加或克隆的组件同样归所有者所有。

正因如此，**Write** 权限与共享 workflow 以供编辑具有同等的信任级别：拥有写权限的协作者可以更改以您的凭据运行的内容。请仅将此权限授予您愿意让其编辑您 workflow 的人。协作者从 workflow 编辑器发起的测试运行使用其自己的凭据，与任何共享 workflow 一样；只有仪表盘本身以所有者的身份运行。**Read** 不授予对组件 workflow 的访问权限，只读查看者收到的是图表本身，而非其背后的逐节点执行详情。

移除共享，或将权限从 write 降为 read，会立即生效。

## 相关

- [Chart Output 节点](../nodes/chart-output-node.md)
- [Analytics 标签页](analytics-tab.md) — 内置执行指标（区别于用户自建的仪表盘）
