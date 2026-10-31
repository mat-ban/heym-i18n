# Dashboard

**Dashboard** 标签页是一个 Grafana 风格的空间，您可以在其中构建图表 widget 网格。每个 widget 由其自身隐藏的 Heym workflow 输出渲染而成，因此您能在 workflow 中产生的任何数据——数据库查询、API 调用、RAG 查找、LLM 输出——都可以成为图表。您可以保留多个 dashboard，并将每个 dashboard 分享给个人或团队。

## Dashboards

每个人首次打开该标签页时都会自动创建一个 dashboard。使用标签页顶部的 dashboard 选择器在 dashboard 之间切换，点击旁边的 **+** 创建新的 dashboard。选择器先列出您自己的 dashboard，然后列出分享给您的 dashboard，并标注分享者的姓名。

该标签页会重新打开您上次使用的 dashboard，地址栏会携带当前打开的 dashboard（`?tab=dashboard&dashboard=<id>`），因此链接会为任何有权限的人打开该 dashboard。

设置按钮（仅限所有者）可重命名 dashboard、设置将其作为[详情页](#detail-pages)时接受的记录格式、管理分享以及删除 dashboard。删除 dashboard 会移除其 widget 及其 workflow。您始终至少保留一个自己的 dashboard，因此最后一个无法删除。

## Widgets

widget 是网格上的单个图表。支持的图表类型：

- **Bar**（垂直或水平）
- **Line**
- **Area**（填充趋势图，支持多系列）
- **Pie**
- **Table**（可滚动；点击列标题可升序排序，再次点击可降序排序。一列可以渲染为 [状态标签](../nodes/chart-output-node.md#status-chips)，一列可以包含在网页新标签页中打开 URL 的 [链接按钮](../nodes/chart-output-node.md#link-buttons)，行可以打开 [详情页](#xiang-qing-ye)）
- **Numeric**（单个 KPI 值，可带单位）
- **Gauge**（针对最小–最大范围的单个值，例如百分比）
- **Scatter**（用于相关性图的 X/Y 点）
- **Proportion**（一个条形拆分为多个份额，带百分比图例，例如语言分布）
- **Gantt**（任务日期、完成情况与依赖关系）
- **Entity relationships (DB)**（数据表、字段、主键/外键及连接）
- **Bar gauge**（每行一个水平仪表，带红→绿渐变和数值，例如可用磁盘空间）
- **Text**（markdown 消息，例如“Last execution at 19:47”这样的状态说明；当 markdown 为静态时支持[交互式复选框](../nodes/chart-output-node.md#interactive-task-lists)，并支持[显式编号列表](../nodes/chart-output-node.md#numbered-lists)以实现自定义或降序编号）
- **HITL**（您待处理的人工审核。标题显示 `1/n pending`。workflow 名称会在画布上打开该次运行。**Approve**、**Request changes** 和 **Reject** 可解决该审核。widget 标题旁的历史图标会在本页的历史对话框中打开该次运行。该 widget 不使用上游行，每个人看到自己的队列。 也可以转为显示单个 Workflow 的审查，面向所有能够打开该 Workflow 的人员；请参阅 [HITL 部件](#hitl-bu-jian)）

除图表外，**Run a workflow** widget 还可以直接从 dashboard 运行您的某个 workflow：通过拖放文件、填写输入字段或点击 Run 按钮；参见[运行类 widget](#run-widgets)。

每个 widget 在您打开标签页时异步加载数据，因此页面在图表填充时保持响应。

## 添加 widget

1. 点击 **Add widget**，为其命名并选择图表类型。在选择器下方，对话框会使用示例数据绘制该图表类型的示例，并列出其期望的行，因此您可以在构建之前比较各类型。
2. widget 会在 workflow 编辑器中打开，并带有起始图：一个产生行的 [Set](../nodes/set-node.md) 节点，连接到 [Chart Output](../nodes/chart-output-node.md) 节点。将 Set 节点替换为任意数据源。**HITL** widget 仅包含 Chart Output 节点；它读取您待处理的审核，不需要数据源。
3. 构建 workflow，使馈入 **Chart Output** 的节点产生行数组，然后配置 Chart Output 节点的字段映射（标签字段、值字段等）。
4. 保存，返回 Dashboard 标签页，widget 即会渲染。

对于 **Run a workflow** widget，改为选择它要运行的 workflow；选择器会说明 widget 将如何运行每个 workflow。该 widget 会直接添加到网格中，无需构建新的 workflow。

双击 widget（或使用其编辑按钮）可随时重新打开其 workflow。使用 widget 标题中的 **Clone widget** 可复制 widget 及其完整 workflow。副本放置在原始 widget 下方，并标注 **(Copy)**，以便您独立编辑。

## HITL 部件

新的 HITL 部件会显示您自己队列中等待的每项审查。若要仅显示某个 Workflow 的审查，请打开该部件的 **设置**：

1. 在 **Workflow** 下选择对应的 Workflow。列表中包含您可以打开的 Workflow（您拥有的，或与您或您的团队共享的），且该 Workflow 具有等待人员处理的步骤：带有工单审核的 Agent，或 Slack 审批、按钮或表单步骤。旁边的图标将在新标签页中打开该 Workflow。
2. 如果该 Workflow 恰好只有一个此类步骤，系统会自动选中该步骤。如果包含多个，**Select agent** 会按节点名称列出它们，并将 **All agents** 置于首位；Slack 步骤带有 **(Slack)** 标记。
3. 保存。标题中的 `1/n pending` 仅统计这些审查。选择 **所有 Workflow** 可重新显示您自己的队列。

画布上 Chart Output 节点的属性中也提供相同的选项。**使用 AI 微调** 也可以完成设置（「仅显示发票审批」），在描述新部件时指明 Workflow 同样可以生效。每次更改都属于 Workflow 编辑，因此会记录在 Edit History 中。

- **谁可以看到审查。** 按 Workflow 筛选的部件会向所有能够打开该 Workflow 的人员显示其审查，他们可以在部件中执行审批、请求更改或拒绝操作，就像他们可以运行该 Workflow 一样。未筛选的部件则向每位用户显示其自己的队列。
- **谁可以看到部件。** 无法打开所选 Workflow 的人员根本看不到该部件，即使在与其共享的仪表板上也同样不可见。当仪表板的所有者失去对该 Workflow 的访问权限或该 Workflow 被删除时，所有者会看到「You no longer have access to the workflow this widget shows」，并可以在 **设置** 中另选一个。
- **仅可选择具备权限的项目。** 保存部件时，无法打开的 Workflow 将被拒绝，无论该操作来自设置、画布还是 AI。

## 详情页

表格 widget 可以将其行链接到另一个 dashboard，后者即可作为详情页使用：由同一个 dashboard 服务于每一位客户、每一张发票或每一个工单。

1. 打开表格 widget 的 **Settings**，在 **Row link** 下选择目标 dashboard。
2. 输入 **Record column**（其值用于标识该行的列，例如 `id`），以及可选的 **Label column**（用于命名该行的列，例如 `name`）。
3. 保存。点击某一行（或聚焦该行后按 Enter）即可打开带有 `?record=<value>&label=<name>` 的关联 dashboard。

在详情 dashboard 上，每个 widget 的 workflow 都会将该值读取为 `$page.record`（参见 [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)），并且页面会在网格上方显示 `Dashboard / <label>` 以及用于清除记录的按钮。点击返回即可回到来源表格。

- **谁可以打开。** 只有有权打开关联 dashboard 的查看者才能点击行。其他人会看到相同的表格，但不带链接。
- **记录格式。** 记录来自 URL，因此由详情 dashboard 决定接受哪些内容。在其设置中，**Detail page records** 可选：ID（字母、数字、`-`、`_` 和 `.`，最多 128 个字符；默认）、数字、UUID 或电子邮件地址。任何其他值都会在 widget 运行前被拒绝，且 widget 会显示“This page does not accept that record”。
- **仍以所有者身份运行。** 在详情页上，widget 同样以 dashboard 所有者的身份运行。构建者应仅在节点会对该值进行转义（escape）的位置传入 `$page.record`，切勿直接拼入查询文本。
- **缓存。** 每个 widget 按记录缓存其图表，缓存有效期（TTL）与该 widget 相同，并保留最近使用的 50 条记录。

## 运行类 widget

**Run a workflow** widget 会运行您的某个 workflow 并显示结果：状态、运行耗时和输出。具体显示内容取决于该 workflow 所需的输入：

- **文件。** 对于以 [File Upload Trigger](../nodes/file-upload-trigger-node.md) 开头的 workflow，将文件拖放到该 widget 上（或点击选择文件），widget 会通过该 trigger 的一次性上传链接上传文件。widget 会显示 trigger 接受的文件类型和大小，并在上传前拒绝不符合要求的文件。如果 workflow 同时还以 Text Input 节点开头，widget 会在拖放区旁显示其输入字段：选择文件、填写字段后，点击 **Run** 会同时发送这两者。字段值会随 widget 生成的上传链接一起传递，因此共享的上传链接无法篡改它们。
- **输入字段。** 对于以 Text Input 节点开头的 workflow，widget 会显示其字段及默认值；点击 **Run** 会使用您填写的值运行 workflow。workflow 中不存在的字段值会被丢弃。
- **无输入。** 不需要输入的 workflow 会显示一个 **Run** 按钮。

结果区域的 **Wrap** 按钮可在框内对超长输出行进行自动换行；关闭它则可按原始 JSON 布局阅读输出。

- 任何能打开该 dashboard 的人都可以运行该 widget，就像任何人都可以刷新图表一样。对 workflow 的访问权限归属于 dashboard 所有者：添加该 widget 需要一个您和所有者都能运行的 workflow，而运行本身使用 workflow 所有者的凭据，与任何上传链接一致。
- 运行结果会保留在您的屏幕上，直到您离开页面；其他查看者看不到您的文件、输入值或结果。该次运行会带有 `dashboard` trigger 出现在执行历史记录中。
- 共享 dashboard 绝不会授予对 workflow 本身的访问权限。**Edit workflow** 仅为本就拥有访问权限的人员打开该 workflow，且不提供 **Fine-tune with AI**。
- 文件运行与所有 File Upload Trigger 运行一样，会在存储上传文件的主实例（main instance）上执行。

## 使用 AI 生成 widget

点击 **AI**，描述您想要的指标（例如“过去 30 天的 workflow 成功率，以条形图展示”），并选择 LLM credential 和模型。Heym 会生成一个以 Chart Output 节点结尾的完整 widget workflow，并将其添加到网格中。有关每种图表类型的示例 prompt，请参阅 [Chart Output](../nodes/chart-output-node.md#example-ai-prompts)。

部件会以您请求的语言获得一个包含一两个词的简短标题，例如「未结案件」。标题绝不包含数据表的 ID；如果模型用完整句子为部件命名，Heym 会保留其前几个词。

部件 API 也可以在不使用 AI 的情况下创建 **计数卡片**：数据表 (`data_table_id`) 上带有 `count_column` 和 `count_value` 的 `text` 部件可以显示具有该值的行数；部件标题指明该值。Heym Work 会在基于数据表创建的页面顶部为每个状态放置一张计数卡片。

使用 widget 的 **Fine-tune with AI** 按钮，通过新指令修改现有 widget。每次 AI 微调都会将之前的 workflow 快照保存到 widget 的 **Edit History** 中，因此您可以从 workflow 编辑器查看或回滚更改。

## 来自 Chat 和 MCP

[Chat](./chat-tab.md) 以及通过 [`heym_chat` 工具](./mcp-tab.md) 的 MCP 客户端可以读取您的仪表板、向其添加 widget、重命名或删除 widget，并整理仪表板的布局。Heym Work 将每个仪表板显示为一个页面，因此相同的回答也涵盖其页面。

- **有哪些仪表板以及上面有什么。** 询问“我有哪些仪表板？”、“销售仪表板上有什么？”或“收入 workflow 在哪个仪表板上？”。Chat 会列出您拥有的仪表板以及与您共享的仪表板、您的访问权限以及指向每个仪表板的链接，以及上面的每个 widget：标题、图表类型和背后的 workflow。过滤到您无法打开的 workflow 上的 [HITL widget](#hitl-widgets) 会保持隐藏，就像在仪表板上一样。
- **新建 widget。** 提出要求：“向销售仪表板添加一个按状态分类的未解决用例图表”。Chat 首先在仪表板上放置一个空白 widget，然后编写 widget 自己的 workflow，运行测试并修复错误直到运行通过，就像它[构建 workflow](./chat-tab.md#chuangjian-workflow) 一样。不会留下单独的 workflow，每次保存都会出现在 widget 的 Edit History 中。widget 的标题和图表类型遵循 Chat 保存的内容。
- **现有 workflow。** 提出要求：“将收入 workflow 放置在销售仪表板上”。以 Chart Output 节点结尾的 workflow 会变成图表 widget，并带有该 workflow 的独立副本，因此以后对 widget 的更改绝不会触及原始 workflow。带有 trigger 或 input 节点的 workflow 不能成为图表 widget。任何其他 workflow 都会变成[运行 widget](#run-widgets)，这也需要一个仪表板所有者可以运行的 workflow。
- **重命名或删除 widget。** 提出要求：“将‘收入’widget 重命名为‘销售’”，或“删除‘未解决用例’widget”。图表 widget 的 workflow 也会采用新名称；运行 widget 的 workflow 则保留自己的名称。删除图表 widget 会连同其 workflow 一起删除，就像 widget 的删除按钮一样；运行 widget 的 workflow 则保留。Chat 仅删除您明确要求的 widget，当您的描述匹配多个 widget 时会先询问具体删除哪一个。
- **整理布局。** 提出要求：“整理销售仪表板”，或“添加这三个 widget 并整理”。Chat 会按顺序排列您看到的 widget，就像 **整理** 按钮一样：随机两行或三行排列，因此再次询问会产生另一种布局。要求每行指定数量（“每行三个”）以获得该大小的行。这会在 Heym 中整理仪表板；Heym Work 保留其页面的独立排列，该排列可通过页面自身的 **整理** 按钮更改。

新 widget 位于仪表板现有 widget 的下方，并且与每个 widget 一样，在仪表板所有者的身份下运行。添加、重命名、删除和整理需要对仪表板的写入权限。构建新 widget 需要能够构建 workflow 的对话：Chat 选项卡、Heym Work 面向编辑人员的 Chat 以及 `heym_chat`。

## 编辑布局

切换 **Edit** 进入编辑模式，您可以在 12 列网格上拖动 widget 并调整其大小。布局更改会自动保存。widget 标题可在 widget 标题栏中内联编辑。

## 缓存与刷新

每个 widget 会在服务器上缓存其上次计算的数据，缓存时间可配置（TTL）。当缓存新鲜时，重新打开 dashboard 会提供存储的结果，而不是重新运行 workflow。每次重新计算数据时，缓存会就地替换（每个 widget 一个缓存，外加[详情页](#detail-pages)上每条记录一个缓存），并且当您编辑 widget 的 workflow 时会自动失效。

使用 widget 的 **Refresh** 按钮（或工具栏中的 **Refresh**）可绕过缓存并立即重新计算。

## 共享

所有者可以从仪表盘的设置中将其共享给单个用户（通过邮箱）或他们所属的任意[团队](teams-tab.md)。每次共享的权限为 **Read**（只读）或 **Write**（可写）；当某人同时拥有个人共享和团队共享时，以权限较高者为准。

| 操作 | 所有者 | Write | Read |
|--------|:-----:|:-----:|:----:|
| 查看组件、刷新组件、使用自动刷新 | ✓ | ✓ | ✓ |
| 打开详情页、运行运行类 widget | ✓ | ✓ | ✓ |
| 添加、克隆、删除、重命名和调整组件大小；AI 生成和微调；勾选清单项 | ✓ | ✓ | |
| 在编辑器中打开组件的 workflow | ✓ | ✓ | |
| 重命名或删除仪表盘、设置其记录格式、管理共享 | ✓ | | |

**组件始终以仪表盘所有者的身份运行。** 无论谁在查看，组件都使用所有者的凭据和全局变量，其运行记录出现在所有者的执行历史和追踪中。因此，团队成员无需访问背后的账户即可看到相同的数据，且每位查看者共享每个组件的同一份缓存结果。Write 协作者添加或克隆的组件同样归所有者所有。

正因如此，**Write** 权限与共享 workflow 以供编辑具有同等的信任级别：拥有写权限的协作者可以更改以您的凭据运行的内容。请仅将此权限授予您愿意让其编辑您 workflow 的人。协作者从 workflow 编辑器发起的测试运行使用其自己的凭据，与任何共享 workflow 一样；只有仪表盘本身以所有者的身份运行。**Read** 不授予对组件 workflow 的访问权限，只读查看者收到的是图表本身，而非其背后的逐节点执行详情。

移除共享，或将权限从 write 降为 read，会立即生效。

## 相关

- [Chart Output 节点](../nodes/chart-output-node.md)
- [Analytics 标签页](analytics-tab.md) — 内置执行指标（区别于用户自建的仪表盘）

## 进度计划与数据库图表

在“添加 widget”中选择 **Gantt** 可随时间显示任务以及完成情况和依赖关系链接，或选择 **Entity relationships (DB)** 可映射数据表、字段及其关系。这两种类型均使用 [Chart Output 节点](../nodes/chart-output-node.md#gantt-schedules)，并且在 Heym Work 页面上也可用。当 Work 为进度计划或数据库架构建议 widget 时，它会在构建页面之前根据建议的任务或实体绘制预览。
