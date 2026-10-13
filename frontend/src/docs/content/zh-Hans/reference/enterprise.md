# Enterprise

面向 Heym 平台的商业许可、专业支持与部署服务。

## 概述

Heym 基于其源码可用许可证可免费使用并自行托管。对于需要商业许可、生产级部署协助或专属支持的组织，企业版计划提供来自 Heym 团队的一对一服务。

| 服务 | 描述 |
|---------|-------------|
| **生产级 Agent 支持** | 架构评审、Agent 与 Workflow 设计指导，以及将 Agent 投入生产环境的实操协助 |
| **工具培训** | 面向您团队的入职培训课程，涵盖 Workflow 编辑器、AI 节点、Agent 及集成 |
| **Heym 答疑** | 直接对接 Heym 工程团队，解答平台问题、最佳实践及故障排查 |
| **Kubernetes 部署** | 协助多 worker 节点配置、sidecar 容器、扩缩容策略及 Cluster 配置 |
| **解决方案咨询** | 针对您的具体用例提供定制化方案设计，包括集成规划与架构建议 |
| **优先支持与 SLA** | 保证响应时间与优先问题解决 |
| **定制开发** | 根据您组织的需求进行功能开发与修改 |

## Heym Work

[Heym Work](./heym-work.md) 是运行在 Heym 之上的业务团队界面。用户只需描述任务、回答几个问题，即可获得经过测试的 Workflow，在专为他们构建的页面中开展工作并回复审核，同时具备单点登录（SSO）、Owner、Editor 和 Viewer 角色，以及每次运行上的实名记录。它使用独立许可证与您的 Heym 并行运行；可在 **Settings → Heym Work** 中进行连接。访问 [heym.run/enterprise](https://heym.run/enterprise) 了解更多信息并申请试用。

## 生产级 Agent 支持

Heym 团队帮助您为业务流程设计、构建并加固 Agent 与 Workflow。这包括评审您的需求、推荐节点配置，并确保您的 Workflow 遵循可靠性、可观测性与治理方面的最佳实践。

支持涵盖所有节点类型，包括 [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md) 及 [Cron](../nodes/cron-node.md) Trigger——以及诸如[多 Agent 编排](./agent-architecture.md)、[Human-in-the-Loop](./human-in-the-loop.md) 检查点和跨分支[并行执行](./parallel-execution.md)等高级模式。

## 工具培训

根据您团队的技能水平与用例量身定制的实操培训课程：

- Workflow 编辑器与[画布功能](./canvas-features.md)
- AI 驱动的节点：[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md)
- [Agent 架构](./agent-architecture.md)与多 Agent 编排
- [Credentials](./credentials.md) 管理与[第三方集成](./integrations.md)
- [Trigger](./triggers.md)、[Webhook](./webhooks.md) 以及使用 [Cron](../nodes/cron-node.md) 进行调度
- [表达式 DSL](./expression-dsl.md)与[全局变量](./global-variables.md)
- [Teams](./teams.md) 协作与 [Credentials 共享](./credentials-sharing.md)
- 面向客户聊天界面的 [Portal](./portal.md) 部署
- 用于 AI Workflow 可观测性的 [Traces](../tabs/traces-tab.md) 与 [Evals](../tabs/evals-tab.md)

## Kubernetes 部署

标准的[运行与部署](../getting-started/running-and-deployment.md)指南涵盖用于单服务器生产环境的 Docker Compose。企业版客户可获得面向高可用性与横向扩缩容的生产级 Kubernetes 部署协助：

- **多 worker 节点** — 将 Heym 后端 worker 分布到多个 Kubernetes 节点，以实现冗余与负载均衡
- **Sidecar 容器** — 为日志采集、监控 Agent、服务网格（Istio、Linkerd）及密钥注入（Vault）配置 sidecar 模式
- **资源规划** — CPU 与内存的 requests/limits、Pod 中断预算及水平 Pod 自动扩缩容策略
- **网络** — Ingress 控制器配置、TLS 终止，以及后端、前端与数据库 Pod 之间的内部服务通信
- **持久化存储** — 使用适当的 StorageClass 与备份策略为数据库和向量存储进行卷配置
- **监控** — 与 Prometheus、Grafana 或您现有的可观测性技术栈集成，用于容器指标、日志与告警

## 解决方案咨询

每个组织都在不同的系统与约束条件下运行 Agent。Heym 团队提供咨询以帮助您：

- 评估 Heym 是否适合您的具体用例
- 设计端到端的 Agent 与 Workflow 架构
- 规划与您现有基础设施及第三方服务的集成
- 调试复杂的 Workflow 并解决生产问题
- 从 n8n、Zapier 或 Make.com 等工具迁移现有 Workflow

## 联系方式

如需许可咨询、定价或预约介绍性通话，请通过 **enterprise@heym.run** 联系企业团队。

## 相关内容

- [运行与部署](../getting-started/running-and-deployment.md) — 使用 Docker Compose 进行生产部署
- [安全](./security.md) — 平台安全实践与配置
- [并行执行](./parallel-execution.md) — 多 worker 执行模型
- [Teams](./teams.md) — 团队协作与资源共享
- [完整功能集](./features.md) — Heym 能力全面概览
- [Heym Work](./heym-work.md)：面向业务团队的界面及其连接方式
