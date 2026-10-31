# Credentials

Credentials 存储 Workflow 节点使用的 API keys 和 secrets。您可以在 [Credentials Tab](../tabs/credentials-tab.md) 中添加它们，并在节点配置中通过名称引用。

## Credentials 是什么

- **按用户存储** – 每个 credential 属于一个用户，可以[共享](./credentials-sharing.md)给其他用户或 [Teams](./teams.md)。
- **静态加密** – 敏感值会被加密；创建后 UI 会将其掩码显示。
- **按名称引用** – 节点通过名称（或 ID）选择 credential。执行引擎在运行时为 Workflow 所有者解析 credential。

## 节点如何使用它们

| 节点类型 | 典型 credential | 用途 |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Evals](../tabs/evals-tab.md) | OpenAI、Google、Custom | 模型的 API key |
| [Decision](../nodes/decision-node.md)、[Evals](../tabs/evals-tab.md) judge | Decision Model | 决策模型 Endpoint 的 Base URL，以及可选的 API key |
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、Chat、AI Defaults, [Evals](../tabs/evals-tab.md) Prompt 套件 | Model Router (Auto Model) | 使用决策模型选择由哪个模型处理每个请求 |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT 订阅登录（OAuth）或用于 runner 的 Codex access token，以及用于仓库操作的 GitHub PAT |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | 用于 runner 的 OpenCode Go gateway API key（可选 base URL），以及用于仓库操作的 GitHub PAT |
| [Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md) | GitHub | 用于 GitHub API 调用、GitHub 节点操作和 MCP 集成的 GitHub personal access token (PAT) |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token、Data Center username/password 或个人访问 Token、Jira 站点 base URL、部署模式，以及可选的 REST API 版本 |
| [Linear](../nodes/linear-node.md) | Linear | 用于 teams、projects、issues 和 comments 的 Personal API key 或 OAuth2 |
| [HTTP](../nodes/http-node.md) | Bearer、Header | 请求的认证 |
| [Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token 和可选的 webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | 用于签名验证的 Application public key |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、RAG: Custom Embeddings | 向量存储连接（外部 Qdrant，或 Heym 自有的 Postgres via pgvector），配合 OpenAI 或任何 OpenAI 兼容的 embedding Endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook 或 API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | 入站邮箱连接 |
| [Send Email](../nodes/send-email-node.md) | SMTP | 邮件服务器 |
| [Redis](../nodes/redis-node.md) | Redis | 连接 |
| [Grist](../nodes/grist-node.md) | Grist | API key + 服务器 URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [Supabase](../nodes/supabase-node.md) | Supabase | Project URL + API key（+ 可选默认 schema） |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + username/password + database（+ secure） |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token，或 public integration Client ID + Client Secret + OAuth consent |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token 以及可选的自托管 base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key、secret key、region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

有关详细设置（hosts、ports、各提供商特定字段），请参阅[第三方集成](./integrations.md)。其中包括 Telegram bot 设置、通过 IMAP 接收邮件以及通过 SMTP 发送邮件。

当您面向 GitHub Enterprise Server 而非 GitHub.com 时，GitHub credentials 还可以包含可选的 `base_url`。当您编辑 GitHub credential 以轮换 token 时，将 `base_url` 留空会保留现有的 Enterprise Endpoint。仅在您希望更改该 Endpoint 时才输入新的 URL。

Jira、Linear、Supabase、Notion、Sentry 和 ClickHouse credentials 在 credential 对话框中提供 **Test Connection**。对于 Jira，该检查会调用 Jira 的当前用户 Endpoint。对于 Linear，该检查会使用 `getViewer` 调用 Linear API，并确认 API key 或 OAuth token 有效。编辑时，如果存储的 secret 仍然存在，您无需重新输入 API key 即可进行测试。对于 Notion，请在对话框中选择 **Internal token** 或 **OAuth**；OAuth 使用您 Notion public integration 中的 Client ID 和 Client Secret。有关 Notion 设置详情，请参阅[第三方集成](./integrations.md#notion)。

## 编码套餐用量

[Settings](./user-settings.md) 中的 **AI Defaults** 标签页会显示您的 Codex 凭据（自有和共享）剩余的编码套餐用量。对于每个 Codex 凭据，它会为每个活跃的速率限制窗口渲染一个水平条——通常是一个 **5 小时**和/或 **每周**窗口，具体取决于您的套餐——并显示剩余配额百分比和重置倒计时。数据来自 Codex 后端的速率限制响应头，按需获取。

OpenCode Go 凭据也会在此列出，但标记为 **“用量不可用”**：OpenCode zen 网关不暴露剩余配额数据，因此无法显示进度条。

## 在表达式中使用

部分节点允许在认证中使用表达式。使用 [Expression DSL](./expression-dsl.md) 配合 `$credentials.CredentialName`，即可在表达式中引用凭据解析后的密钥。关于每种凭据类型在 HTTP 请求中所需的请求头行，请参阅 [HTTP › 使用凭据进行认证](../nodes/http-node.md#authenticating-with-credentials)。

Codex 凭据被有意排除在 `$credentials` 之外。无论您是通过 ChatGPT 登录（订阅制，无按 Token 计费的 API 成本），还是粘贴 Codex `access_token`，这些 Token 都只会传递给本地 Codex 运行进程。ChatGPT 登录 Token 会在过期时自动刷新。

Jira 凭据同样被排除在 `$credentials` 之外。[Jira 节点](../nodes/jira-node.md) 在运行时通过 `credentialId` 加载凭据。对于 Jira 节点未覆盖的自定义 Jira REST 调用，可使用 [HTTP 节点](../nodes/http-node.md) 配合 Jira Basic Auth（Jira Cloud 使用 `email:api_token`，Data Center / Server 使用 `username:password`），例如 `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`。您也可以使用 [Header](../nodes/http-node.md) 凭据配合 `Authorization: Basic <base64(user:secret)>`。对于 Jira Data Center / Server 个人访问 Token，请改用 `Authorization: Bearer <token>`；Jira 凭据本身通过其 **Personal Access Token** 认证模式支持该功能。

| 凭据类型 | 暴露给 `$credentials.Name` 的值 |
|-----------------|--------------------------------------|
| Bearer | Bearer Token 字符串 |
| Header | 完整的 `header key: header value` 行，可直接放入 cURL 的 `-H` 参数 |
| GitHub | 个人访问 Token |
| Notion | 内部 `api_token` 或 OAuth `access_token`（用于 Notion API 调用的 Bearer Token） |
| Sentry | Sentry 认证 Token |
| Discord / Slack | Webhook URL |

示例：

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

使用 Notion **节点**进行原生的数据库、页面和块操作。当自定义 [HTTP](../nodes/http-node.md) 请求需要相同的 Notion Bearer Token 时，使用 `$credentials`。

## 从聊天创建凭据

[AI Assistant](./ai-assistant.md#credentials)、[Chat 标签页](../tabs/chat-tab.md) 和 [Chat with Heym](./chat-with-heym.md) 可以在 Workflow 需要凭据时创建凭据，也可以在您主动要求时创建。助手会建议类型和名称，常规凭据表单会在对话中打开。要求更新您拥有的凭据时，同一表单会在该凭据上打开，并对其密钥进行掩码处理。助手只能看到名称和类型。通过 [MCP](../tabs/mcp-tab.md) 使用 `heym_chat` 无法创建、更新或选择凭据。

## 相关内容

- [Credentials 标签页](../tabs/credentials-tab.md) – 添加、编辑、删除凭据
- [GitHub 节点](../nodes/github-node.md) – 原生 GitHub REST 操作
- [Jira 节点](../nodes/jira-node.md) – Jira 项目、Issue、评论、附件、用户、通知和状态转换自动化
- [Linear 节点](../nodes/linear-node.md) – Linear GraphQL 工作区和 Issue 自动化
- [Notion 节点](../nodes/notion-node.md) – 搜索和管理 Notion 内容
- [Sentry 节点](../nodes/sentry-node.md) – Sentry 组织、项目、团队、Issue、事件和发布自动化
- [凭据共享](./credentials-sharing.md) – 与用户和团队共享
- [第三方集成](./integrations.md) – 每种凭据类型的设置指南
- [Expression DSL](./expression-dsl.md) – 表达式中的 `$credentials`

## Model Router（Auto Model）

Model Router 不持有任何密钥。它持有一个**决策模型凭据**、一个**模型选项**列表——每个选项是一个现有的 OpenAI、Google 或 Custom 凭据加上一个模型——以及每个选项的说明该选项应在何时使用的自由文本。

它会出现在所有提供模型选择的选取器中：[LLM](../nodes/llm-node.md) 和 [Agent](../nodes/agent-node.md) 节点、Chat、AI Defaults、Dashboards、表达式构建器和 Data Tables。它唯一的模型是 **Auto**。选择它后，决策模型会读取每个请求并进行路由。[Evals](../tabs/evals-tab.md) 不包含它，因为 eval 比较的是特定模型，而 router 会自行选择。

Agent 会随着其工具循环的推进重新路由，因此廉价模型可以处理早期轮次，而更强的模型处理需要它的那一轮。相同的输入会复用之前的决策，因此循环只有在对话确实发生变化时才会为一次决策付出成本。

### 它不能做什么

Auto Model 不能与 **Responses API**、**Batch mode** 或**图像输出**组合使用。选择 router 时，这些开关会自动禁用，并各自说明原因。Guardrail 检查和人工审核策略分类器是固定的单模型调用，永远不会路由。

### 当路由失败时

将某个选项标记为 **当路由失败时使用此选项**，这样决策模型故障就永远不会中断运行；系统会使用回退方案，并在运行记录中记录原因。如果没有标记，节点会直接失败，而不是进行猜测。

### 查看请求的去向

Traces 中显示的是 `Auto Model / GPT-5`，而不仅仅是模型本身，成本仍归属于实际运行的模型。画布的 Execution Log 和 Span View 显示相同的配对信息，且 Span View 会列出每一轮对话的去向。
