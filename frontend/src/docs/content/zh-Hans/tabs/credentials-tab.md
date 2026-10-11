# Credentials 标签页

**Credentials** 标签页用于管理节点所使用的 API 密钥和密钥信息。在此处添加凭据，并在 workflow 节点中通过名称引用它们。有关凭据的概念以及节点如何使用凭据的概述，请参阅 [Credentials](../reference/credentials.md)。

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ 观看 Credentials 演示</a></p>

## 凭据类型

| 类型 | 用途 |
|------|----------|
| **OpenAI** | 用于 LLM、Agent 和 RAG 节点的 OpenAI API key |
| **Google** | Google AI (Gemini) API key |
| **GitHub** | 用于 GitHub API、GitHub 节点 workflow、MCP 服务器和 agent workflow 的 GitHub personal access token (PAT)；可选的 GitHub Enterprise `base_url` |
| **Linear** | 用于团队、项目、issue 和评论的 Linear personal API key 或 OAuth2 |
| **Notion** | 内部集成 token 或公共集成 OAuth 工作区授权 |
| **Custom** | 自定义 LLM endpoint |
| **Bearer** | 用于 HTTP 认证的 Bearer token |
| **Header** | 用于 HTTP 请求的自定义 header 键值对 |
| **Telegram** | Telegram bot token 及可选的 webhook secret |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Discord 应用公钥 |
| **IMAP** | 入站邮箱 trigger 凭据 |
| **SMTP** | 邮件发送凭据 |
| **Redis** | Redis 连接 |
| **RAG: Qdrant + OpenAI** | 用于 RAG 节点的向量存储，由外部 Qdrant 服务器提供支持 |
| **RAG: Psql + OpenAI** | 用于 RAG 节点的向量存储，由 Heym 自有的 Postgres 数据库 (pgvector) 提供支持——无需外部服务 |
| **RAG: Custom Embeddings** | 用于 RAG 节点的向量存储，使用任意 OpenAI 兼容的 embedding endpoint，并以 Qdrant 或 Postgres (pgvector) 作为存储 |
| **Cohere** | 用于 embedding 的 Cohere API |

## 添加凭据

1. 点击 **Add Credential**
2. 选择凭据类型
3. 输入所需的值（API key、URL 等）
4. 为其命名，以便在节点中引用

对于 GitHub，当前的凭据流程基于 PAT。推荐使用细粒度 PAT。GitHub App 安装流程目前在 UI 中并非一等公民。如果您使用 GitHub Enterprise Server，还可以设置可选的 GitHub API base URL，例如 `https://github.example.com/api/v3`。

对于 Linear，请在对话框中选择 **Personal API key** 或 **OAuth2**。Personal API key 在 Linear 的 **Settings → Security & Access → Personal API keys** 下创建。OAuth2 使用 Linear OAuth 应用的 Client ID 和 Client Secret，并将 `{FRONTEND_URL}/api/credentials/linear/oauth/callback` 注册为 redirect URI。凭据以创建或授权它的 Linear 用户的权限执行操作。在保存之前，请使用凭据对话框中的 **Test Connection** 验证 API key 或 OAuth token。

对于 **Notion**，请在对话框中选择 **Internal token** 或 **OAuth**。OAuth 使用您 Notion 公共集成的 Client ID 和 Client Secret；Heym 会将其加密存储在凭据中。在保存 workflow 之前，请使用 **Test Connection** 验证 Supabase、Linear 或 Notion 凭据。有关 Notion 的设置详情，请参阅 [Third-Party Integrations](../reference/integrations.md#notion)。

OAuth 凭据会在弹窗中打开提供方的授权页面。如果浏览器阻止了弹窗，请使用 Connect 按钮下方的 **Open the authorization page** 链接；连接完成后对话框会给出提示。新凭据连接成功后，按钮会显示 **Connected**。

## 编辑与删除

- **Edit** – 更新凭据值（敏感值会被掩码显示）
- **Delete** – 删除凭据；使用该凭据的 workflow 将需要替换

在 GitHub Enterprise Server 上编辑 **GitHub** 凭据时，将可选的 **GitHub API Base URL** 留空会保留现有的 Enterprise endpoint。仅在需要更改该 endpoint 时才输入新的 URL。

## 共享

- 通过电子邮件与其他用户共享凭据，或与 [Teams](../reference/teams.md) 共享（参见 [共享凭据](../reference/credentials-sharing.md)）
- 共享的凭据会带有指示标记
- 可从凭据卡片菜单中撤销共享

## 在节点中使用

在节点配置中按名称引用凭证。例如：
- [LLM 节点](../nodes/llm-node.md) – 为模型 API 选择凭证
- [HTTP 节点](../nodes/http-node.md) – 使用 Bearer 或 Header 凭证进行认证
- [Agent 节点](../nodes/agent-node.md) – 将 GitHub Token 传入 MCP 服务器环境变量，例如 `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub 节点](../nodes/github-node.md) – 执行原生 GitHub 仓库、用户、Issue、审查、发布、Workflow、流量及文件操作
- [Linear 节点](../nodes/linear-node.md) – 读取工作区元数据并自动化 Linear Issue 和评论
- [Notion 节点](../nodes/notion-node.md) – 管理 Notion 数据库、数据源、页面和块
- [RAG 节点](../nodes/rag-node.md) – 为向量存储使用 Qdrant 或 Postgres (pgvector) 凭证
- [Telegram Trigger 节点](../nodes/telegram-trigger-node.md) – 接收 Telegram 机器人 Webhook
- [Telegram 节点](../nodes/telegram-node.md) – 发送 Telegram 机器人消息
- [Discord Trigger 节点](../nodes/discord-trigger-node.md) – 接收 Discord 交互 Webhook
- [Discord 节点](../nodes/discord-node.md) – 发送 Discord Webhook 消息
- [IMAP Trigger 节点](../nodes/imap-trigger-node.md) – 轮询共享收件箱以获取新邮件

关于在表达式中引用凭证支持的值，请参阅[表达式 DSL](../reference/expression-dsl.md)。

## 相关内容

- [第三方集成](../reference/integrations.md) – 每种凭证类型的详细设置指南（Telegram、Discord、Qdrant、Grist、IMAP、SMTP、RabbitMQ、Redis、Slack 等）
- [凭证共享](../reference/credentials-sharing.md) – 与其他用户共享凭证
- [安全](../reference/security.md) – 静态加密、会话管理、速率限制
- [节点类型](../reference/node-types.md) – 使用凭证的节点（[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[GitHub](../nodes/github-node.md)、[Linear](../nodes/linear-node.md)、[RAG](../nodes/rag-node.md)、[HTTP](../nodes/http-node.md)、[Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord](../nodes/discord-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[Slack](../nodes/slack-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[发送邮件](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md)）
- [Vectorstores 标签页](./vectorstores-tab.md) – 使用 Qdrant 或 Postgres (pgvector) 凭证
- [Chat 标签页](./chat-tab.md) – 使用 OpenAI/Google 凭证
- [上下文展示](../reference/contextual-showcase.md) – 仪表盘界面的精简页面指南
