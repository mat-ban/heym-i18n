# 画布功能

Workflow 编辑器提供了多项用于调试、测试和组织节点的功能：**运行至节点**、**节点上的 AI**、**数据固定**、**执行日志**、**启用/禁用**以及**提取为子 Workflow**。

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ 观看编辑器演示</a></p>

## 运行至节点

将鼠标悬停在任意节点（便签除外）上，点击节点下方的 **Run**。Heym 将执行该节点及其上游依赖，不影响下游节点和无关分支。此操作使用画布测试模式，包括已固定的输出和 Workflow 的正常分支条件。

如果所选路径包含输入字段，右侧 **Run** 面板将打开并聚焦第一个字段。输入值后，点击 **Run to _节点标签_** 或按 **Ctrl+Enter**（macOS 上为 Cmd+Enter）。通用 body 模式将聚焦 JSON body 编辑器。不含输入字段的路径将立即运行，不会打开面板。已固定输入的 Input 节点将复用其固定输出，不会请求输入。

面板会保留所选目标以供后续运行使用。选择 **Run full workflow** 可清除目标。执行进行中时，运行按钮将被禁用。位于循环内部的目标在该节点首次被到达时停止运行；选择循环之后的节点将运行完整的上游循环。

## 节点上的 AI

在除便签外的任何节点上悬停，然后点击其上方的 **AI**。[AI Assistant](./ai-assistant.md) 会在该节点上打开并提供 **Change this node as ...**、**Fix error in this node ...** 和 **Other**。在 Agent 模式下，助手仅更改该节点；其他节点、连接和布局保持原样。请参阅 [AI Assistant › 修改单个节点](./ai-assistant.md#changing-one-node)。

在您仅具有查看权限的工作流上，该按钮会被隐藏。

## 数据固定

数据固定允许您将节点上次运行的输出固定下来，从而无需重新执行该节点即可测试下游节点。

### 查找位置

- **属性面板** – 选择节点并滚动至 **Pinned Data** 区域
- **节点标记** – 数据被固定后，节点上会显示固定图标

### 操作

| 操作 | 说明 |
|--------|-------------|
| **Pin** | 固定节点上次执行的输出（运行后可用） |
| **Clear** | 移除已固定的数据 |
| **Edit** | 直接编辑已固定的 JSON；点击 Save 应用更改 |

### 测试模式行为

在测试模式下运行 Workflow 时，具有 `pinnedData` 的节点将跳过执行，改用固定输出。可用于：

- 在不调用外部 API 的情况下测试下游逻辑
- 调试引用该节点输出的表达式
- 使用固定样本数据迭代 Prompt 或条件

编辑器中的表达式补全在可用时会使用固定数据来建议字段。

## 执行日志

**Debug 面板**（底部抽屉）在 Workflow 运行期间显示实时执行日志。您也可以通过 History 对话框或 Board 卡片打开正在运行的生产执行。编辑器将附加到该运行的 SSE 流，恢复已完成的节点结果，并在新节点启动和完成时继续显示节点动画和日志。

### 显示内容

- **节点结果** – 每个节点的状态（`success`、`error`、`skipped`、`running`）、执行时间和输出
- **最终输出** – 来自 [Output](../nodes/output-node.md) 节点的聚合输出
- **Agent 进度** – 对于 [Agent](../nodes/agent-node.md) 节点，显示逐步的工具调用和推理过程

### 操作

- **Copy as JSON** – 将完整执行日志复制到剪贴板
- **Open in JSON editor** – 在 JSON Hero 或 JSON Editor Online 中打开日志以供检查
- **Download generated files** – 如果某个 skill 生成了可下载文件（`_generated_files`），将显示 Download 按钮。单文件直接下载；多文件将打开选择弹窗。

### 与 Logs 标签页的区别

Debug 面板显示 **Workflow 执行**日志（节点结果、输出）。[Logs 标签页](../tabs/logs-tab.md) 显示 **Docker 容器**日志（后端、前端、数据库）。 <!-- pragma: allowlist secret -->

## 启用 / 禁用

您可以禁用节点，使其在执行期间被跳过。已禁用的节点显示"off"标记并呈灰显状态。

### 切换方式

| 方式 | 说明 |
|--------|-------------|
| **属性面板** | 选择节点 → 电源图标（右上角） |
| **右键菜单** | 右键点击节点 → Disable 或 Enable |
| **键盘** | 选择节点 → 按 **D**（参见[键盘快捷键](./keyboard-shortcuts.md)） |

### 多选

当选中多个节点时，启用/禁用将应用于所有选中节点。如果任一选中节点已禁用，右键菜单显示"Enable"；如果全部已启用，则显示"Disable"。

### 运行时行为

`active: false` 的节点将被跳过。下游节点不会从被跳过的节点接收数据。可用于临时排除节点而不删除它们。

如需在 Workflow 内部而非手动切换节点的启用状态，请使用 [Disable Node](../nodes/disable-node.md) 和 [Enable Node](../nodes/enable-node.md)。

## Agent 记忆图谱

启用了 **[持久化记忆](./agent-persistent-memory.md)** 的 [Agent](../nodes/agent-node.md) 节点会在节点上显示一个粉色的 **brain** 控件。点击该控件即可打开记忆图谱编辑器：实体以动画力导向图的形式呈现，并按实体类型进行聚类；提供可搜索的 Source/Target 选择器用于添加关系，以及一个连接面板用于在关联实体之间跳转。同一对话框中还包含 **Share memory with other agents**（workflow → agent → read 或 read/write），用于[跨 Agent 记忆共享](./agent-persistent-memory.md#sharing-with-other-agents)。当该对话框打开时，主画布的撤销/重做会被暂缓，以便图谱编辑保留自己的历史记录。

**过滤图谱。** 画布左上角有一个搜索控件，在您点击它或按下 **Ctrl/Cmd+F** 之前会折叠为一个快捷按钮。它会匹配实体的名称、类型以及每个属性的键和值，还会匹配关系的类型（`parent_of`）及其属性；匹配到的关系会连同其两端的实体一起显示。所有以空白分隔的搜索词都必须匹配。匹配到的实体会连同其整个邻域一起显示——即它参与的每一条关系以及每条关系另一端的实体——因此匹配结果绝不会成为孤立的点。匹配到的关系只显示它所连接的两个实体，不再继续扩展，因为搜索关系类型是在询问该关系本身，而非其两端所连接的一切。其余内容会在画布和 **All edges** 列表中直接隐藏——而非淡化——并通过一个徽标显示剩余实体占总数的比例。搜索框内的 **✕** 会先清除查询，再次按下则关闭搜索框。Escape 键也按同样的顺序逐层退出，由内向外：先清除查询，再关闭搜索框，然后退出展开的画布视图，只有当以上均未打开时才关闭对话框。清除查询后，完整图谱会恢复，每个实体回到原来的位置。

**手动放置实体。** 拖动实体会将其固定在您放置的位置，这样自动布局会在其周围安置图谱的其余部分，而不会将其拉回。拖动已选中的实体会连同其直接连接的实体一起移动，保持聚类的形状；拖动其他任何实体则只移动该实体。**Tidy layout**（魔棒按钮）会释放所有被固定的实体并重新运行自动布局。

## Extract to Sub-Workflow

将选中的节点转换为可复用的子 Workflow，并用一个 [Execute](../nodes/execute-node.md) 节点替换它们。

### 如何使用

1. 在画布上选择一个或多个节点
2. 右键单击 → **Extract to Sub-Workflow**
3. 为新 Workflow 输入名称（以及可选描述）
4. 点击 **Extract**

### 执行结果

- 使用选中的节点创建一个新的 Workflow
- 外部输入（来自选区外部的边）成为子 Workflow 的 [Input](../nodes/input-node.md) 字段
- 外部输出（指向选区外部节点的边）映射到子 Workflow 的 [Output](../nodes/output-node.md)
- 选中的节点被替换为一个调用新 Workflow 的 [Execute](../nodes/execute-node.md) 节点
- 输入/输出映射会自动保留

### 使用场景

- 在多个 Workflow 中复用一组节点序列
- 通过将相关逻辑分组来简化复杂的 Workflow
- 创建模块化、可测试的子 Workflow

## Run with cURL

编辑器工具栏（右上角）中的 **cURL** 按钮会打开一个对话框，用于构建并复制通过 API 触发 Workflow 的 cURL 命令。

- 选择 Workflow 的请求体模式（`Defined` 或 `Generic`）
- 设置认证类型（Anonymous、JWT 或 Header Auth）
- 配置响应缓存和速率限制
- 切换 SSE 流式传输并自定义每个节点的启动消息
- 编辑请求体
- 在 Generic 模式下，画布运行面板使用与 cURL 对话框相同的原始 JSON 请求体
- 点击 **Copy cURL** 复制可直接运行的命令

完整的对话框详情请参阅 [Webhooks](./webhooks.md#run-with-curl-dialog)，事件协议请参阅 [SSE Streaming](./sse-streaming.md)。

## 相关内容

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – 所有画布和编辑器快捷键
- [Agent Persistent Memory](./agent-persistent-memory.md) – 记忆图谱的行为和 API
- [Execute Node](../nodes/execute-node.md) – 调用子 Workflow
- [Expression DSL](./expression-dsl.md) – 引用和固定数据
- [Workflow Structure](./workflow-structure.md) – 节点和边的格式
- [Download & Import](./download-import.md) – 以 JSON 格式导出和导入 Workflow
- [Node Types](./node-types.md) – 所有节点类型
- [Logs Tab](../tabs/logs-tab.md) – Docker 容器日志
- [Execution History](./execution-history.md) – 历史运行记录
- [Templates](../tabs/templates-tab.md) – 保存和复用 Workflow 与节点
- [Contextual Showcase](./contextual-showcase.md) – 编辑器中可用的精简页面指南

- [Canvas 协作](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
