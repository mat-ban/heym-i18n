# 执行历史

执行历史记录 Workflow 运行情况：输入、输出、节点结果、状态以及 Trigger 来源。您可以用它来观察正在运行的生产任务、检查历史运行、调试失败问题，或通过 **Bring to Canvas** 使用相同输入重新运行。

## 概述

每次执行会存储以下内容：

| 字段 | 说明 |
|-------|-------------|
| **Inputs** | 请求体或运行输入（例如 Input 节点的 `text`） |
| **Outputs** | Workflow 级别的输出 |
| **Node results** | 每个节点的输出、状态和执行时间 |
| **Status** | `success`、`error`、`pending`、`skipped` 或 `failed`（参见 [Crash Recovery](#crash-recovery)） |
| **trigger_source** | 运行的触发方式（参见 [Triggers](./triggers.md)） |

## 访问历史记录

| 位置 | 范围 |
|----------|-------|
| **Editor** 工具栏 | 仅当前 Workflow |
| **Docs** 视图头部 | 仅当前 Workflow |
| **Dashboard** 头部（Chat 标签页） | 所有 Workflow + 聊天/助手运行 |
| **Evals** 视图头部 | 所有 Workflow + 聊天/助手运行 |

点击 **History** 按钮（时钟图标）打开对话框。

## 单个 Workflow 历史 vs 全部历史

- **单个 Workflow**（Editor、Docs）：显示您当前打开的 Workflow 的运行记录。使用 **Clear history** 仅清除该 Workflow 的运行记录。
- **全部历史**（Dashboard、Evals）：显示所有 Workflow 以及聊天/助手会话的运行记录。覆盖范围与 Workflow 访问权限一致：您拥有的 Workflow、直接共享给您的 Workflow，以及共享给您所属团队的 Workflow。使用 **Clear all history** 清除您拥有的所有记录。共享 Workflow 的历史记录将被保留。

## Bring to Canvas

**Bring to Canvas** 会将所选运行的输入和节点输出加载到当前 Workflow 中。

### 加载内容

- **Inputs** → 运行输入面板（例如 Input 节点的 `text`，或自定义字段）
- **Node results** → 执行结果面板显示每个节点的历史输出
- **Execution result** → 该次运行的状态、输出和耗时

### 不同场景下的行为

- **在 Editor 中**（单个 Workflow 历史）：立即应用到当前打开的 Workflow 并关闭对话框。
- **从全部历史中**（Dashboard/Evals）：导航到 Workflow 编辑器，然后在编辑器加载完成后应用数据。仅适用于 Workflow 运行——不适用于聊天/助手运行。

### 执行深链接

通过 `/workflows/{workflowId}/{executionId}` 打开 Workflow 时，会自动将该次执行加载到画布上——效果等同于选中该运行并选择 **Bring to Canvas**。这使得特定的历史运行可以通过 URL 分享。如果找不到该执行记录（ID 错误或已删除），编辑器将回退为加载普通 Workflow。

### 使用场景

- 使用相同输入重新运行 Workflow
- 通过检查输入和节点输出来调试失败的运行
- 对比多次运行的输出

## 询问 AI

两个历史记录对话框在标题旁均有一个 **询问 AI** 按钮（闪烁图标）。它会在新对话中打开 [Chat 标签页](../tabs/chat-tab.md#asking-about-a-run)，并将工作流和所选运行作为可移除的芯片附加。询问运行缓慢的原因、失败的地方，或让 Chat 修复工作流。Chat 会读取该精确运行，包括每个节点的跟踪和错误。

在 All History 对话框中，**询问 AI** 仅在选择工作流运行期间出现；聊天和助手运行不显示该按钮。

## 运行时间线

在运行详细信息中，**全部展开** 旁边的 **时间线** 按钮（秒表图标）会将 **步骤** 列表替换为 span 时间线。在显示时间线时，同一按钮会显示为 **日志**；点击它即可返回列表。在 All History 中，该按钮仅在工作流运行时显示。时间线会在每个节点启动时为其绘制一条横条，以便您查看每个节点花费了多长时间以及哪些节点并行运行。悬停在横条上可查看其持续时间；点击它可打开与编辑器的 [执行时间线](#execution-timeline-details) 相同的详细信息检查器。只要对话框保持打开状态，所选视图就会保留。

在存储节点开始时间之前记录的运行将按持续时间先后排列。

## 执行亮点

在实时运行之后——或在使用 **Bring to Canvas** 之后——画布**右上角**会出现一个可关闭的 **Execution Highlights** 弹窗。它可以快速展示*每个节点产生了什么*，按执行顺序从上到下排列。点击 **✕** 关闭；下次运行时会重新打开。

### 显示内容

| 记录 | 来源 | 自动？ |
|--------|--------|-------|
| **Input** | 该次运行的输入参数（input/trigger 节点） | 是 |
| **Output** | 输出节点的结果——如果没有输出节点，则为最后一个节点的消息 | 是 |
| **Agent / LLM** | 每个 Agent 或 LLM 节点的输出 | 是 |
| **Output** | 任何启用了 **Highlight Node Output** 的其他节点 | 需手动开启 |

已自动高亮的节点（input / output / last / agent / llm）不会重复出现，即使您同时启用了开关。

### 每条记录

- 显示 `Node — message…`，截取前 **250 个字符**；点击某一行可展开，以 **Markdown 格式渲染完整消息**，并提供 **Copy** 按钮。
- 运行了多次的节点（例如在循环内）会显示 `Node (N)` 以及 `‹ i / N ›` 选择器——可选择查看哪一次运行；每个节点的选择器相互独立。

### Highlight Node Output

除 Agent 和 LLM 外，每个节点在其属性面板中都有一个 **Highlight Node Output** 复选框（默认关闭）。启用后，该节点的输出将添加到弹窗中。画布上被高亮的节点会显示一个小 ✦ 标记。在 [workflow DSL](./expression-dsl.md) 中，这对应节点数据字段 `"highlight": true`（默认为 `false`）。

### 在 Dashboard 上

运行了 Workflow 的 Dashboard 组件卡片会在卡片头部显示一个 ✦ **Execution highlights** 按钮；点击即可打开该组件运行的相同弹窗，并以该组件绘制的输出作为突出显示记录。

## 运行中的执行

两个历史记录对话框都会在列表顶部、过往运行之前显示**当前正在运行的执行**。

- 显示旋转指示器和 **Running** 标签，并附带开始时间
- 点击 **Open live** 可将编辑器附加到该次运行，而无需重新启动它
- 画布首先恢复已完成的节点，然后通过 SSE 接收
  `node_start`、`node_complete` 以及最终执行事件
- 当前节点在画布上闪烁，下游节点保持其待处理动画，Debug 面板会在每个结果到达时添加它——就像从编辑器启动的运行一样
- 点击 **Cancel** 可立即停止执行
- 从任何对话框（Editor 或 Dashboard）取消，也会关闭该 workflow 在任何已打开画布标签页中的活动 SSE 流，因此编辑器状态会干净地重置
- 取消后，运行中的条目会在下次刷新时消失；按 **Refresh** 可手动更新列表
- 如果取消一个已经完成的运行，该请求将不执行任何操作

实时 URL 为 `/workflows/{workflowId}/{executionId}`。观察者是只读的：离开编辑器只会断开该浏览器标签页的连接，绝不会停止 workflow。活动快照通过 PostgreSQL 共享，因此当 Trigger 和编辑器请求落在不同的后端 worker 上时，打开运行仍然有效。

## 崩溃恢复

如果服务器在 workflow 运行期间重启（部署、容器重启或崩溃），该运行的 worker 会在执行中途停止。Heym 会自动恢复这些被中断的运行，而不是让它们卡在 **Running** 状态。

- 在下次启动时，被选举出的 leader 进程会检测孤立运行——对于优雅重启是即时检测，对于硬崩溃则在约 60 秒内检测（一旦心跳明确停止）。
- 恢复的运行会**使用相同输入从头重新运行**（而不是从停止处继续），并使用当前 workflow 定义。完成时，它们会记录一个正常的终止条目（例如 `success`），因此历史记录会将该运行显示为已完成。
- 一次运行会重试**一次**。如果恢复尝试也被中断——或者该 workflow 在此期间已被删除——该条目会记录为 `failed`。
- 这在单容器和多 worker 部署中行为相同；只有 leader 执行恢复，因此一次运行绝不会被不同 worker 恢复两次。

### 自动恢复开关

编辑器的 **Execution Log**（运行）面板有一个 **Auto-recover** 复选框，按 workflow 默认**开启**。

- **开启**：该 workflow 被中断的运行会按上述方式重新运行。
- **关闭**：被中断的运行不会重新运行，并会以状态 `skipped` 记录。

> 子 workflow 运行不会独立恢复——它们由其恢复后的父运行重新驱动。具有自身重新投递机制的 Trigger（RabbitMQ、scheduled/cron、IMAP）也可能在重启时重新投递，因此恢复的运行偶尔可能执行两次。

## 待处理的人工审核

因 [Human-in-the-Loop](./human-in-the-loop.md) 审批而暂停的运行会立即写入历史记录，状态为 `pending`。

- 待处理的 agent 节点会存储一个审核 payload，包括 `reviewUrl`、`draftText` 和 `expiresAt`
- 连接到 agent 的 `review` handle 的任何节点也可以在人工响应之前运行，并且它们的节点结果会存储在同一个待处理历史记录条目中
- 历史记录对话框会显示审核链接，以便所有者复制或打开它
- 历史记录对话框和编辑器 Debug 面板会在运行恢复后显示最终人工决策
- 当审核者接受、编辑或拒绝草稿时，同一个历史记录条目会更新为最终执行结果
- 如果同一次运行因 HITL 暂停不止一次，历史记录条目保持不变，而每个检查点都会获得自己的一次性审核链接

这对于 portal 运行以及可能在继续前等待数小时或数天的长生命周期 workflow 尤其有用。

## 复制

使用 Inputs 或 Outputs 旁边的 **Copy** 将 JSON 复制到剪贴板。

## 清除历史记录

- **按 workflow**：在 Editor 历史记录对话框中，点击 **Clear history** 以移除当前 workflow 的运行。
- **所有历史记录**：在 Dashboard/Evals 历史记录对话框中，点击 **Clear all history** 以移除您拥有的所有执行记录。来自共享 workflow 的运行会被保留。此操作无法撤销。

## 执行时间线详情

当编辑器的 **Execution Log** 打开时，点击计时器按钮以显示执行时间线。选择一个 span 会打开一个内联详情检查器，它会接管行区域。它显示所选步骤的状态、持续时间、尝试次数、重试信息、错误、trace ID 以及紧凑的输出预览。对象和数组输出使用与 Debug 面板其余部分相同的 `JsonTree` 查看器；标量值使用文本预览。当步骤输出图像（Playwright 屏幕截图、生成的图像、图像文件或请求正文中的 base64 图像，出现在输出中的任何位置）时，它们会作为缩略图显示在输出上方，并且 JSON 会显示一个简短占位符来代替原始 base64。点击缩略图可在 lightbox 中打开它；箭头按钮或 ←/→ 键可逐步浏览运行中的每张图像，并带有诸如 `2 / 5` 的计数器。当 trace ID 可用时，对 LLM 和 Agent span 使用 **Open trace**。

## 移动端节点详情

在手机上，编辑器会显示全屏的 workflow 树，而非自由画布。点击带有已记录结果的树节点，即可将其执行记录以全屏详情形式打开。该视图提供独立的 **Input Data**、**Output Data** 和 **Errors** 标签页。输出标签页显示已记录的结果并提供 **Copy Output**；输入标签页显示所选节点的配置；错误标签页则在节点执行失败时显示已记录的错误。使用 **Back to workflow** 或关闭按钮可返回树视图。

画布和仪表盘历史对话框将运行控制项保持在一行内，并将可用的标签和实例筛选器放置在响应式网格中。其筛选菜单使用相同的应用内选择器，因此选中的对勾标记与每个选项标签具有一致的内边距和基线。

## 相关

- [Triggers](./triggers.md) – Workflow 如何启动；历史记录会记录 `trigger_source`（包括由 [Board](../tabs/board-tab.md) 卡片移动和跟进所启动运行的 `board`）
- [Human-in-the-Loop](./human-in-the-loop.md) – 待审核 URL 与恢复行为
- [Edit History](./edit-history.md) – Workflow 保存的版本控制（回滚、差异对比）
- [Quick Start](../getting-started/quick-start.md) – 构建并运行您的第一个 workflow
- [Workflows Tab](../tabs/workflows-tab.md) – 创建和管理 workflow
