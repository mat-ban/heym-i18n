# Workflow 分析

**Workflow Analysis** 是一个左侧面板，为每个 workflow 保存一份共享、可编辑的 Markdown 文档。用它来说明 workflow 的功能并记录改进想法——还可以让 AI 为你生成初稿。

该文档是共享的：所有能访问该 workflow 的人都可以阅读和编辑它。它随 workflow 一起存储，并在 workflow 被删除时自动删除。

## 打开面板

1. 在编辑器中打开一个 workflow。
2. 点击编辑器工具栏中的 **Analyze**（Sparkles 图标）。
3. 面板会在左侧打开。面板打开时，节点面板（左侧面板）会折叠；重新打开节点面板会关闭分析面板。

该面板仅适用于已保存的 workflow。对于全新的未保存 workflow，请先保存它。

## 文档

面板显示一份 Markdown 文档，包含两个视图，通过 **Edit**（铅笔）和 **Preview**（眼睛）按钮切换：

| 视图 | 用途 |
|------|---------|
| **Edit** | 纯 Markdown 编辑器（textarea）。 |
| **Preview** | 渲染后的 Markdown。 |

页眉显示**最后编辑者**及编辑时间。

### 保存

点击 **Save** 以持久化你的更改。仅当存在未保存的编辑时，Save 才可用。

由于文档是共享的，保存使用乐观并发控制：

- 如果在你打开面板之后，其他人保存了更新的版本，你的保存会被拒绝，并显示一条警告，指明另一位编辑者。
- 然后你可以选择 **Reload (discard mine)** 以采用服务器版本，或选择 **Overwrite** 以强制用你的版本覆盖对方的版本。

## AI Analysis

在面板顶部选择一个 LLM **Credential** 和 **Model**（模型列表从所选 credential 加载——参见 [Credentials](../tabs/credentials-tab.md)）。然后运行分析：

- **Analyze my workflow** — 当文档为空时显示。它会将 AI 生成的 Markdown 报告直接流式写入编辑器，作为未保存的草稿。审阅并编辑它，然后 **Save**。
- **Reanalyze** — 当文档已有内容时显示。它会将一份新报告流式写入单独的 **preview**，不影响你当前的文档。选择 **Accept** 用新分析替换编辑器内容，或选择 **Discard** 保留原有内容。

这两个操作都会先**运行 workflow**（当它有效且可运行时），并将执行结果包含在分析 prompt 中，因此报告能反映 workflow 的实际行为。如果 workflow 无法运行，分析将改为基于其静态结构进行。

生成的报告按顺序涵盖三个部分：**Improvement areas**（具体建议，只要 workflow 涉及 credentials、用户输入、外部请求或数据暴露，就包含 **security** 角度）、workflow 的 **Purpose**，以及 **What it does**（逐步遍历各个节点）。

**Improvement areas** 部分始终执行四项明确检查：

1. **Error coverage** — 如果画布上没有 [Error Handler](../nodes/error-handler-node.md) 节点，且未配置 error workflow，报告会指出这一点并建议添加错误处理。
2. **Time saved** — 如果未设置每次运行预计节省的时间，报告会建议配置一个，以便 [Analytics](../tabs/analytics-tab.md) 的 **Time Saved** 指标能够填充数据。
3. **Network nodes** — 对于发起网络调用的节点（例如 [HTTP](../nodes/http-node.md) 和集成节点），报告会建议在这些节点上使用针对节点的错误处理（retry 和/或 continue-on-error）。
4. **Alerts** — 当未为该 workflow 配置任何 [alerts](../tabs/alerts-tab.md) 时，报告会建议在投入生产前设置 alerts。

5. **Evals**：当 Workflow 包含没有 Agent 套件的 [Agent 节点](../nodes/agent-node.md)时，报告建议在 [Evals](../tabs/evals-tab.md#agent-suites) 中创建 **Agent Suite**（或 **Prompt Suite**）；当包含 [LLM](../nodes/llm-node.md) 节点时，建议使用 **Prompt Suite** 跨模型测试该 Prompt。

### 从 Properties 运行 Analyzer

当 workflow 的画布上有节点但尚无分析文档时，workflow 级别的 [Properties](./canvas-features.md) 面板（未选中任何节点时显示）中会出现一个 **Run Analyzer** 按钮。它会打开此 Workflow Analysis 面板，以便你选择 credential 和 model 并生成报告。

每次分析运行都会记录在 [Traces](../tabs/traces-tab.md) 中，来源为 **Workflow Analysis**。

如果未配置 LLM credential，Analyze 按钮会被禁用——请在 [Credentials Tab](../tabs/credentials-tab.md) 中添加一个。

## 相关

- [AI Assistant](./ai-assistant.md) — 通过自然语言生成或修改 workflow 节点。
- [Sticky Note](../nodes/sticky-note-node.md) — 用于直接在画布上固定简短笔记。
