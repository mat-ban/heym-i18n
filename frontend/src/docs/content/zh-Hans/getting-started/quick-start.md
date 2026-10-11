# 快速开始

几分钟内运行您的第一个 Heym workflow。

尚未运行 Heym？请参阅[运行与部署](./running-and-deployment.md)，或观看视频演示：[在两分钟内于本地设置 Heym](https://www.youtube.com/watch?v=P6YvlupUboU)。

## 1. 创建 Workflow

1. 前往 [Workflows](../tabs/workflows-tab.md) 标签页
2. 点击 **New Workflow**
3. 为您的 workflow 命名（例如 "Hello World"）

## 2. 添加节点

1. 打开左侧的 **Nodes** 面板
2. 将 [Input](../nodes/input-node.md) 节点拖拽到画布上
3. 拖拽一个 [LLM](../nodes/llm-node.md) 节点并将其连接到 Input
4. 拖拽一个 [Output](../nodes/output-node.md) 节点并将其连接到 LLM

```
[Input] --> [LLM] --> [Output]
```

查看[节点类型](../reference/node-types.md)了解所有可用节点。

## 3. 配置

- **Input**：设置默认值，或留空以接受用户输入（参见 [Input 节点](../nodes/input-node.md)）
- **LLM**：选择 [credential](../tabs/credentials-tab.md) 和模型，添加系统指令，并将 `userMessage` 设置为 `$input.text`（参见 [LLM 节点](../nodes/llm-node.md)）
- **Output**：将 `message` 设置为 `$llm.text` 以传递 LLM 响应（参见 [Output 节点](../nodes/output-node.md)）

使用 [Expression DSL](../reference/expression-dsl.md) 语法来引用 `$input.text` 和 `$llm.text`。点击表达式字段上的展开按钮可打开[表达式求值对话框](../reference/expression-evaluation-dialog.md)，其中包含实时后端预览。

## 4. 运行

点击 **Run**，按下 `Ctrl + Enter`，或使用调试面板执行。Workflow 将从 Input 节点开始，经过已连接的节点，最终到达 Output。查看 [Triggers](../reference/triggers.md) 了解运行 workflow 的其他方式（[webhook](../reference/webhooks.md)、portal、cron 等）。

在 **History**（工具栏）中查看历史运行记录，并使用 **Bring to Canvas** 以相同输入重新运行。

在 Docs、Evals 及其他非画布内部页面上，您还可以使用 [Quick Drawer](../reference/quick-drawer.md) 选择一个已固定的 workflow 并直接运行，无需返回编辑器。

如果您在阅读文档时希望在构建前获得说明，可从 Docs 页眉打开 [Chat with Heym](../reference/chat-with-heym.md) 来提出与页面相关的问题。

或者，使用调试面板中的 [AI Assistant](../reference/ai-assistant.md) 通过自然语言创建 workflow——描述您的需求，AI 将生成节点和连线。

已经在其他工具中构建自动化？[迁移到 Heym](./migrate-to-heym.md) 可将 n8n、Flowise、Dify、Langflow、sim.ai 或 Activepieces workflow 转换为可导入的 Heym workflow。

## 相关

- [核心概念](./core-concepts.md) – Workflows、节点与执行流程
- [迁移到 Heym](./migrate-to-heym.md) – 借助 AI 将 n8n、Flowise、Dify、Langflow、sim.ai 或 Activepieces workflow 转换为 Heym
- [运行与部署](./running-and-deployment.md) – 使用 `run.sh` 在本地启动，或使用 `deploy.sh` 进行部署
- [环境变量](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完整配置参考
- [设置](../reference/user-settings.md) – 配置名称、User Rules 和密码
- [画布功能](../reference/canvas-features.md) – 数据固定、执行日志、启用/禁用、提取为子 workflow
- [键盘快捷键](../reference/keyboard-shortcuts.md) – 画布和编辑器快捷键
- [Expression DSL](../reference/expression-dsl.md) – 在节点配置中引用数据
- [表达式求值对话框](../reference/expression-evaluation-dialog.md) – 带实时后端预览的可展开编辑器
- [Triggers](../reference/triggers.md) – 所有 workflow 入口点（[webhook](../reference/webhooks.md)、portal、cron 等）
- [执行历史](../reference/execution-history.md) – 查看历史运行记录并使用 Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – 从非画布页面运行已固定的 workflow
- [Chat with Heym](../reference/chat-with-heym.md) – 从文档页眉提出上下文相关问题
- [Workflows 标签页](../tabs/workflows-tab.md) – 创建和管理 workflow
- [Credentials 标签页](../tabs/credentials-tab.md) – 为 LLM 节点添加 API 密钥
- [AI Assistant](../reference/ai-assistant.md) – 使用自然语言创建 workflow
