# 简介

**构建智能体系统，自信运行。**

Heym 是用于在生产环境中运行和治理 AI 智能体的基础设施。编排智能体、自动化业务流程、检查每一次执行，并让人类保持控制。在您自己的基础设施上部署 Heym。

在 Heym 中，Workflow 定义了智能体、确定性步骤、工具和数据如何协同工作。运行时执行该图、记录每次运行，并在您指定的位置暂停以进行人工审核。可视化画布是您构建和检查 Workflow 的地方，同样的 Workflow 也可以通过 API、调度、事件 Trigger、MCP 客户端和 Portal 聊天来运行。访问 [heym.run](https://heym.run) 了解产品站点，并参阅 [Why Heym](./why-heym.md) 了解 Heym 在智能体生命周期各阶段所处理的内容。

## 您可以做什么

- **构建** – 在 [Workflows](../tabs/workflows-tab.md) 标签页的[画布](../reference/canvas-features.md)上组合智能体和确定性步骤，通过 [AI Assistant](../reference/ai-assistant.md) 描述它们，或从[模板](../tabs/templates-tab.md)开始
- **编排** – 协调 [Agent](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md) 和 [RAG](../nodes/rag-node.md) 节点、[子智能体](../reference/agent-architecture.md)、MCP 工具以及 [集成](../reference/integrations.md)（如 HTTP、Slack 和电子邮件），在依赖关系允许时进行[并行执行](../reference/parallel-execution.md)
- **运行** – 从 [Webhook](../reference/webhooks.md)、[Cron](../nodes/cron-node.md) 调度和事件 [Trigger](../reference/triggers.md) 启动 Workflow，支持逐节点重试、[错误处理](../nodes/error-handler-node.md)以及跨实例的[负载分发](../reference/cluster.md)
- **观测** – 检查[执行历史](../reference/execution-history.md)、带 Token 成本的 [LLM 追踪](../tabs/traces-tab.md)、[分析](../tabs/analytics-tab.md)和[告警](../tabs/alerts-tab.md)，并导出 [OpenTelemetry](../reference/opentelemetry.md) 追踪
- **评估** – 在 [Evals](../tabs/evals-tab.md) 标签页中针对预期输出测试 Prompt 和模型
- **控制** – 暂停智能体以进行[人工审核](../reference/human-in-the-loop.md)，通过[护栏](../reference/guardrails.md)阻止不安全内容，并通过[凭据](../tabs/credentials-tab.md)、[团队](../reference/teams.md)、[单点登录](../reference/sso.md)和[审计追踪](../reference/audit.md)管理访问权限
- **暴露** – 通过 REST 和 [SSE 流式传输](../reference/sse-streaming.md)提供 Workflow 服务，作为 [MCP](../tabs/mcp-tab.md) 工具，以及作为面向最终用户的 [Portal](../reference/portal.md) 聊天界面；使用 [Chat](../tabs/chat-tab.md) 标签页直接测试模型
- **与 Heym 对话** – 在文档中通过 [Chat with Heym](../reference/chat-with-heym.md) 对话框提出页面感知的产品问题

## 核心概念

- **Workflows** – 由节点和边组成的有向图。在 [Workflows](../tabs/workflows-tab.md) 标签页中管理它们。参阅 [Workflow 结构](../reference/workflow-structure.md)。
- **节点** – 处理单元（[Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[Condition](../nodes/condition-node.md) 等）。参阅[节点类型](../reference/node-types.md)。
- **边** – 定义执行流的连接
- **凭据** – 存储在[凭据](../tabs/credentials-tab.md)标签页中的 API 密钥和机密，由节点引用。
- **变量** – [变量](../tabs/global-variables-tab.md)标签页中的持久键值数据，可通过 `$global.variableName` 访问。参阅[全局变量](../reference/global-variables.md)。
- **表达式** – 使用 `$input` 和 `$nodeName.field` 引用上游数据。参阅[表达式 DSL](../reference/expression-dsl.md)。

## 相关

- [Why Heym](./why-heym.md) – Heym 在智能体生命周期各阶段所处理的内容
- [快速开始](./quick-start.md) – 构建您的第一个 Workflow
- [运行与部署](./running-and-deployment.md) – 使用 `run.sh` 在本地启动，或使用 `deploy.sh` 进行部署
- [AI Assistant](../reference/ai-assistant.md) – 使用自然语言创建 Workflow
- [Chat with Heym](../reference/chat-with-heym.md) – 阅读文档时提出后续问题
- [核心概念](./core-concepts.md) – Workflow、节点和执行流
- [Workflows 标签页](../tabs/workflows-tab.md) – 管理 Workflow 和文件夹
- [凭据标签页](../tabs/credentials-tab.md) – 为节点添加 API 密钥
