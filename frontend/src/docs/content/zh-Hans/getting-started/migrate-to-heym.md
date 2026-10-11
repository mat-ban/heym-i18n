# 迁移至 Heym

已经在其他工具中创建了 Workflow？**AI Convert** 可以将其转换为 Heym Workflow。粘贴来自 n8n、Flowise、Dify、Langflow、sim.ai 或 Activepieces 的 Workflow——或者直接描述您的需求——Heym 将在实时画布上构建等效的 Workflow，供您下载和导入。

请访问 **[heym.run/convert](https://heym.run/convert)** 打开该工具，或使用站点页眉中的 **✨ AI Convert** 按钮。

## 工作原理

1. **选择来源工具**（可选）——n8n、Flowise、Dify、Langflow、sim.ai、Activepieces，或保持 *Auto*。
2. **提供您的 Workflow**——粘贴从当前工具导出的 JSON，或用自然语言描述您想要的自动化流程。
3. **生成**——Heym 将结果流式输出到画布上，实时绘制节点和连接。
4. **下载或复制**生成的 Workflow（JSON 格式）。
5. **导入 Heym**——使用 [Download & Import](../reference/download-import.md) 流程将 JSON 粘贴到画布上，然后运行。

转换过程还会在画布上添加一个小的 *Sticky Note*，标记该 Workflow 由 Heym 生成——您可以随时删除它。

## 您将获得什么

转换器会将来源工具的概念映射到 Heym 原生节点——Trigger、[LLM](../nodes/llm-node.md) 步骤、[HTTP](../nodes/http-node.md) 调用、[Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) 操作、[Loop](../nodes/loop-node.md)、[Condition](../nodes/condition-node.md) 和 [Output](../nodes/output-node.md)。请在画布上审查结果，配置您的 [Credentials](../reference/credentials.md)，并调整来源工具中表达方式不同的任何内容。

> AI Convert 是一个起点，而非保证 1:1 的移植。在生产环境运行之前，请务必审查生成的 Workflow。

## 注意事项

- **AI 驱动：** 转换由大型语言模型生成，因此每次运行的结果可能有所不同。如果首次结果不够理想，可以重新生成。
- **输入大小：** 粘贴或输入的文本限制在大约 **25,000 tokens** 以内。转换前请精简过大的导出文件。
- **速率限制：** 为确保所有用户都能使用该工具，每位访客的请求上限为**每分钟 1 次、每小时 5 次、每天 10 次**。
- **安全性：** 请求会经过筛查，仅处理与构建 Workflow 相关的请求。

## 后续步骤

- 初次使用画布？请从 [Quick Start](./quick-start.md) 开始。
- 在 [Download & Import](../reference/download-import.md) 中了解导入的工作方式。
- 自行部署 Heym？请参阅 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) 获取完整配置参考。
- 使用应用内 [AI Assistant](../reference/ai-assistant.md) 从零开始构建。
