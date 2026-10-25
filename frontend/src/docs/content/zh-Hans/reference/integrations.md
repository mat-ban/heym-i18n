# 第三方集成

Heym 通过 **credentials** 连接外部服务。每种 credential 类型存储一个服务的连接详情，并可在多个节点和 workflow 中重复使用。有关概述，请参阅 [Credentials](./credentials.md)。

在 [Settings → Credentials](../tabs/credentials-tab.md) 中添加 credentials。所有值均静态加密。Credentials 可与其他用户或 [Teams](./teams.md) [共享](./credentials-sharing.md)。

部分集成节点**不**需要 credentials。[WebSocket Trigger](../nodes/websocket-trigger-node.md) 和 [WebSocket Send](../nodes/websocket-send-node.md) 使用直接在节点上配置的 URL、headers 和 subprotocols 连接外部 socket。

## Credential 类型一览

| 类型 | 使用者 | 关键字段 |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`，可选 `base_url` |
| **Google** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md)、[Codex](../nodes/codex-node.md)、[OpenCode Go](../nodes/opencode-go-node.md)、[Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md) | `api_key`，可选 `base_url` |
| **Jira** | [Jira 节点](../nodes/jira-node.md) | `api_token`、`base_url`、`deployment`、`auth_mode`、`email`（仅限 Basic auth），可选 `api_version` |
| **Linear** | [Linear 节点](../nodes/linear-node.md) | `api_key`，或 `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry 节点](../nodes/sentry-node.md) | `api_token`，可选 `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md) | `api_key`、`base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md)、[Evals](../tabs/evals-tab.md)（LLM-as-Judge 评判器） | `base_url`，可选 `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、Chat、AI Defaults | 一个 decision model credential，以及引用其他 credentials 的模型选项 |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md)、Vectorstores | `qdrant_host`、`openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md)、Vectorstores | `openai_api_key`（向量通过 pgvector 存储在 Heym 自有的 Postgres 中） |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md)、Vectorstores | `embedding_base_url`、`embedding_model`、`embedding_dimensions`、`db_type`，可选 `embedding_api_key`，当 `db_type` 为 `qdrant` 时还需 `qdrant_host` |
| **Grist** | [Grist 节点](../nodes/grist-node.md) | `api_key`、`server_url` |
| **Google Sheets** | [Google Sheets 节点](../nodes/google-sheets-node.md) | `client_id`、`client_secret` + OAuth2 授权 |
| **Google Drive** | [Google Drive 节点](../nodes/google-drive-node.md) | `client_id`、`client_secret` + OAuth2 授权（完整 Drive 权限范围） |
| **BigQuery** | [BigQuery 节点](../nodes/bigquery-node.md) | `client_id`、`client_secret` + OAuth2 授权 |
| **Supabase** | [Supabase 节点](../nodes/supabase-node.md) | `supabase_url`、`supabase_key`，可选 `supabase_schema` |
| **ClickHouse** | [ClickHouse 节点](../nodes/clickhouse-node.md) | `host`、`port`、`username`、`password`、`database`、`secure` |
| **Notion** | [Notion 节点](../nodes/notion-node.md) | `api_token`，或 `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 节点](../nodes/amazon-s3-node.md) | `aws_access_key_id`、`aws_secret_access_key`、`aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`、`port`、`email`、`password` |
| **IMAP** | [IMAP Trigger 节点](../nodes/imap-trigger-node.md) | `imap_host`、`imap_port`、`imap_username`、`imap_password` |
| **Telegram** | [Telegram Trigger 节点](../nodes/telegram-trigger-node.md)、[Telegram 节点](../nodes/telegram-node.md) | `bot_token`，可选 `secret_token` |
| **Discord** | [Discord 节点](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger 节点](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ 节点](../nodes/rabbitmq-node.md) | `rabbitmq_host`、`rabbitmq_username`、`rabbitmq_password` |
| **Redis** | [Redis 节点](../nodes/redis-node.md) | `host`、`port`、`password` |
| **Slack** | [Slack 节点](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger 节点](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP 节点](../nodes/http-node.md) | `token` |
| **Header** | [HTTP 节点](../nodes/http-node.md) | `header_key`、`header_value` |
| **FlareSolverr** | [Crawler 节点](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub credential 存储 GitHub 个人访问令牌（PAT），以便 workflow 通过 [GitHub 节点](../nodes/github-node.md) 调用 GitHub REST API、将令牌传入诸如 `@modelcontextprotocol/server-github` 之类的 MCP 服务器，或在 [HTTP 节点](../nodes/http-node.md) 中用于自定义 REST 调用。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `api_key` | GitHub 个人访问令牌（`github_pat_...` 细粒度 PAT 或经典 `ghp_...` PAT） |
### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `base_url` | GitHub Enterprise Server 的 GitHub API base URL（例如 `https://github.example.com/api/v3`） |

### 说明

- 在可能的情况下，建议使用细粒度 personal access token，因为你可以将其范围限定到特定的仓库和权限。
- 对于 GitHub.com，请将 `base_url` 留空。对于 GitHub Enterprise Server，请使用包含 `/api/v3` 的完整 REST API endpoint（例如 `https://github.example.com/api/v3`），而不是服务器的 Web UI 根地址（如 `https://github.example.com`）。
- 此凭证目前仅对基于 PAT 的认证进行建模。要访问组织仓库，请使用已被授予所需组织/仓库权限的 PAT。
- GitHub App 安装 token 和 GitHub App 设置流程目前在 Heym UI 中并非一等公民。
- 对于原生仓库、用户、issue、pull request、review、release、Actions workflow、traffic 和文件操作，请优先使用 [GitHub 节点](../nodes/github-node.md)。仅当你需要 GitHub 节点未覆盖的 endpoint 或 payload 时，才使用 [HTTP 节点](../nodes/http-node.md)。
- 将 `$credentials.YourGitHubCredential` 传入 MCP 连接环境变量（例如 `GITHUB_PERSONAL_ACCESS_TOKEN`），以配合 MCP 使用 [Agent 节点](../nodes/agent-node.md)。
- GitHub 的 REST API 通常期望 `Authorization: Bearer <token>` 以及 `Accept: application/vnd.github+json`。
- 编辑 GitHub 凭证时，将 GitHub Enterprise 的 `base_url` 留空会保留现有 endpoint。仅当你想要更改该 endpoint 时，才输入新的 URL。

### 使用者

- [GitHub 节点](../nodes/github-node.md)
- [Codex 节点](../nodes/codex-node.md)
- [Agent 节点](../nodes/agent-node.md)
- [HTTP 节点](../nodes/http-node.md)

---

## Decision Model

Decision model 会针对某个状态回答带类型的问题，并返回概率而非文本。TypeSafe 的 Jev 是参考实现；任何接受相同 `{model, state, questions}` 请求体的 endpoint 都可以使用，而 [Decision](../nodes/decision-node.md) 节点可以为不支持的 endpoint 发送手写请求体。

### 必填字段

- `base_url` – endpoint，例如 `https://api.typesafe.ai`。Heym 会追加 `/v1/systemone`。

### 可选字段

- `api_key` – 以 `Authorization: Bearer` 发送。无需密钥的 endpoint 可以将此项留空。

### 说明

- **Test Connection** 会发送一个极小的问题，以确认 endpoint 和密钥可用。
- 编辑凭证时，如果密钥字段留空，则会保留已存储的密钥。
- 默认情况下，发往私有地址和回环地址的出站请求会被阻止，因此位于 `localhost` 或私有网段上的自托管 endpoint 需要设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。
- 这些模型不在 Heym 同步的 LLM 定价表中，因此 [Traces](../tabs/traces-tab.md) 中的 Cost 列会保持为空。Token 计数仍会被记录。

### 使用者

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – 根据预期输出对 `LLM-as-Judge` 答案进行评分

## OpenAI Codex

OpenAI Codex 凭证用于对 [Codex 节点](../nodes/codex-node.md)进行认证。它独立于 LLM、Agent 和 RAG 节点所使用的 OpenAI API key 凭证。

### 认证模式

| 模式 | 描述 |
|------|-------------|
| **Sign in with ChatGPT**（推荐） | 使用你的 ChatGPT Plus/Pro 订阅进行 OAuth (PKCE) 登录，因此运行时可避免按 token 计费的 API 成本。Heym 会存储并自动刷新 token 包。 |
| **Access token** | 仅传递给本地 Codex CLI 进程的 ChatGPT/Codex `access_token`。 |

### 说明

- 此凭证类型不接受 API key。
- Codex token 不会通过 `$credentials.Name` 暴露。
- Codex 节点还需要一个 GitHub 凭证，用于仓库克隆、分支推送和草稿 PR 创建。

### 使用者

- [Codex 节点](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go 凭证用于对 [OpenCode Go 节点](../nodes/opencode-go-node.md)进行认证。它存储 OpenCode Go gateway API key（来自 [opencode.ai/go](https://opencode.ai/go)）以及可选的 gateway base URL。

### 字段

| 字段 | 描述 |
|-------|-------------|
| **API Key** | OpenCode Go gateway API key（必填）。 |
| **Gateway Base URL** | 可选；默认为 `https://opencode.ai/zen/go/v1`。仅对自托管或代理 gateway 进行覆盖。 |

### 说明

- API key 仅会传递给加固容器内的 OpenCode CLI 进程。
- OpenCode Go 节点还需要一个 GitHub 凭证，用于仓库克隆、分支推送和 pull request 创建。GitHub token 绝不会放入沙箱容器内。

### 使用者

- [OpenCode Go 节点](../nodes/opencode-go-node.md)

---

## Linear

Linear 凭证支持 personal API key 或 OAuth2，用于 [Linear 节点](../nodes/linear-node.md)。Heym 会向 Linear 发送原生 GraphQL 查询，以获取工作区元数据、项目、issue 和评论。
### 设置

选择一种认证模式：

**个人 API key**

1. 在 Linear 中，打开 **Settings → Security & Access → Personal API keys**。
2. 创建一个有权访问您想要自动化的 workspace 的 key。
3. 将该 key 粘贴到 Heym 中的 Linear credential，并使用 **Test Connection** 进行验证。

**OAuth2**

1. 创建一个 Linear OAuth 应用程序。
2. 将 `{FRONTEND_URL}/api/credentials/linear/oauth/callback` 注册为 redirect URI。
3. 在 Heym Dashboard → **Credentials** → **New** → 类型选择 **Linear**。
4. 选择 **OAuth2**，输入 Client ID 和 Client Secret，然后点击 **Connect**。

### 必填字段

| 模式 | 字段 | 描述 |
|------|-------|-------------|
| Personal API key | `api_key` | Linear 个人 API key，通常以 `lin_api_` 为前缀 |
| OAuth2 | `client_id` | 来自 Linear OAuth 应用程序的 Client ID |
| OAuth2 | `client_secret` | 来自 Linear OAuth 应用程序的 Client Secret |

OAuth token（`access_token`、`refresh_token`、`token_expiry`）会被自动存储和刷新。

### 注意事项

- 个人 API key 和 OAuth token 以创建或授权它们的 Linear 用户身份执行操作。
- Linear OAuth 使用 `read,write,issues:create,comments:create` 这些 scope。
- 在 credential 对话框中使用 **Test Connection**，针对 Linear API 验证 API key 或 OAuth token。
- 在创建或筛选 issue 之前，使用 Linear 节点中的 List Teams 和 List Projects 来发现 UUID。
- 使用 List Workflow States 和 List Team Members 来发现用于更新的 state 和 assignee UUID。
- 通过编辑 credential 并输入替换值来轮换 API key。如果您轮换了 OAuth 应用程序的 secret，请通过 **Connect** 重新连接 credential。

### 使用者

- [Linear 节点](../nodes/linear-node.md)

---

## Jira

Jira credential 为 [Jira 节点](../nodes/jira-node.md) 存储 Jira Basic auth 凭据或 Data Center 个人访问 token（PAT）、Jira 站点 base URL、部署模式以及可选的 REST API 版本。Jira Cloud 使用 `cloud`，Jira Data Center / Server 使用 `data_center`。

### 设置

**Jira Cloud**

1. 在 Atlassian 账户设置中，创建一个 API token。
2. 在 Heym Dashboard → **Credentials** → **New** → 类型选择 **Jira**。
3. 输入 Atlassian 邮箱、API token 以及 Jira 站点 URL，例如 `https://your-domain.atlassian.net`。
4. 使用 **Test Connection** 验证 credential。

**Jira Data Center / Server**

1. 选择 **Jira Data Center / Server** 作为部署模式。
2. 选择身份验证方式。**用户名和密码** 使用 Basic auth。**Personal Access Token** 使用 `Authorization: Bearer <token>`，需要 Jira Data Center / Server 8.14 或更高版本。在 Jira 的 **个人资料 → Personal Access Tokens** 中创建 token。
3. 输入 Jira 用户名和密码，或粘贴个人访问 token（无需用户名）。
4. 输入 Jira 站点 URL，例如 `https://jira.example.com`。
5. 使用 **Test Connection** 验证 credential。

### 字段

| 字段 | 描述 |
| --- | --- |
| `auth_mode` | `basic`（缺失时默认）或 `pat`。`pat` 仅对 `data_center` 有效 |
| `email` | Jira Cloud Atlassian 账户邮箱或 Jira Data Center / Server 用户名。在 `pat` 模式下不使用 |
| `api_token` | Jira Cloud Atlassian API token、用于 Basic auth 的 Jira Data Center / Server 密码，或 `pat` 模式下的 Data Center 个人访问 token |
| `base_url` | Jira 站点 base URL |
| `deployment` | Jira Cloud 使用 `cloud`，Jira Data Center / Server 使用 `data_center` |
| `api_version` | REST API 版本；Jira Cloud 默认为 `3`。Data Center / Server 使用 v2 |

### 注意事项

- 对于 Jira Cloud REST API v3，Jira 节点将 issue 描述和评论作为 Atlassian Document Format 文本文档发送。Data Center / Server credential 发送纯文本。
- Data Center / Server 支持用户名/密码 Basic auth 以及使用 Bearer 方案的个人访问 token（PAT）身份验证。PAT 身份验证需要 Jira Data Center / Server 8.14 或更高版本。
- 附件上传接受 base64 或 data URL 内容，并受平台文件大小限制（默认 99 MB）。启用后，附件下载可以返回 base64 内容。
- 用户创建、删除和 issue 通知要求已认证的 Jira 账户具有相关的 Jira 站点或组织权限。
- 使用 List Projects、Search Issues 和 List Transitions 来发现 project key、issue key 和 transition ID。
- 对于 Jira 节点未覆盖的自定义 endpoint，请在 cURL 命令中使用带有 Jira Basic Auth（Cloud 使用 `email:api_token`，Data Center / Server 使用 `username:password`）或 PAT Bearer auth（Data Center / Server 使用 `Authorization: Bearer <token>`）的 [HTTP 节点](../nodes/http-node.md)。或者，使用带有相应 `Authorization` 头的 Header credential。

另请参阅：

- [Jira 节点](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Sentry credential 为 [Sentry 节点](../nodes/sentry-node.md) 存储 auth token。Heym 使用 Sentry 的 REST API 执行组织、项目、团队、issue、event 和 release 操作。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `api_token` | 有权访问您所自动化的组织和项目的 Sentry auth token |

### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `base_url` | 自托管 Sentry 的可选根 URL，例如 `https://sentry.example.com` |

### 注意事项

- 对于 Sentry SaaS，请将 `base_url` 留空。
- 使用 **Test Connection** 确认该 token 可以列出可见的组织。
- 对于自定义 REST 调用，请使用 `$credentials.YourSentryCredential` 作为 bearer token。

### 使用者

- [Sentry 节点](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) 是一个开源向量数据库，用于语义搜索和 RAG（Retrieval Augmented Generation）。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `qdrant_host` | 指向您的 Qdrant 实例的完整 URL（例如 `http://localhost:6333` 或 cloud endpoint） |
| `openai_api_key` | 用于在索引和搜索文档时生成 embedding 的 OpenAI API key |
### 说明

- Qdrant collection 从 [Vectorstores](../tabs/vectorstores-tab.md) 标签页进行管理。每个 vector store 映射到一个 Qdrant collection。
- [RAG 节点](../nodes/rag-node.md)使用 vector store（其引用 Qdrant 凭证）——它并不直接引用凭证。
- 如果你的 Qdrant 实例需要 API key，请将其包含在 `qdrant_host` 值中，或相应地配置 Qdrant；当前集成没有单独的 Qdrant API key 字段。
- 自托管 Qdrant：使用[官方 Docker 镜像](https://hub.docker.com/r/qdrant/qdrant)并暴露端口 `6333`。

### 使用方

- [RAG 节点](../nodes/rag-node.md)（通过 vector store）
- [Vectorstores 标签页](../tabs/vectorstores-tab.md)

## 自定义 Embeddings（RAG）

默认情况下，RAG embeddings 来自 OpenAI。**RAG: Custom Embeddings** 凭证则指向任意
OpenAI 兼容的 embeddings endpoint——Ollama、vLLM、Text Embeddings Inference、LM Studio、
Together 或托管网关——并指定其写入的 vector store。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `embedding_base_url` | 包含 `/v1` 路径的 Endpoint URL，例如 `http://localhost:11434/v1` |
| `embedding_api_key` | 可选。本地服务器通常无需 key |
| `embedding_model` | Endpoint 所期望的模型名称，例如 `nomic-embed-text` |
| `embedding_dimensions` | 模型返回的向量宽度（默认 `1536`） |
| `embedding_request_dimensions` | 可选。请求 Endpoint 返回 `embedding_dimensions`，而非模型的原生宽度 |
| `db_type` | `qdrant` 或 `pgvector` |
| `qdrant_host`、`qdrant_port`、`qdrant_api_key` | Qdrant 连接信息，当 `db_type` 为 `qdrant` 时必填 |

### 说明

- **Qdrant 接受任意维度数量。** 每个 collection 均按此凭证声明的宽度创建，因此 Dimensions
  字段可自由编辑。
- **Postgres（pgvector）要求恰好 1536 个维度。** 其列是固定的 `vector(1536)`，因此
  Dimensions 字段被固定为 1536，声明任何其他宽度的凭证在保存时都会被拒绝。
- **针对 pgvector 的缩短处理。** 当存储为 Postgres 时，对话框会提供 *Ask the
  endpoint to return 1536 dimensions*。这会发送 `dimensions` 请求参数，使用 Matryoshka
  表示法训练的模型（OpenAI `text-embedding-3-*`、`nomic-embed-text-v1.5`、`jina-v3`
  及类似模型）会遵循该参数，返回缩短但仍具意义的向量。不支持该参数的 Endpoint 会拒绝
  请求，而接受但忽略该参数的 Endpoint 会产生明确的错误，指明实际返回的宽度。Heym
  自身从不截断向量，因为对非 Matryoshka 模型的输出进行切片会静默降低检索质量。该选项
  不适用于 Qdrant，因为 Qdrant 可将 collection 调整为任意宽度。
- 在凭证对话框中使用 **Test Connection** 来嵌入一个探测字符串，并在创建存储之前查看
  模型实际返回的宽度。
- `dimensions` 请求参数仅发送给 OpenAI 本身，因为大多数 OpenAI 兼容服务器会拒绝未知
  参数。模型的原生宽度则会针对凭证进行校验。
- 现有的 **RAG: Qdrant + OpenAI** 和 **RAG: Psql + OpenAI** 凭证保持不变，继续可用。

### 使用方

- [RAG 节点](../nodes/rag-node.md)（通过 vector store）
- [Vectorstores 标签页](../tabs/vectorstores-tab.md)

## Postgres（pgvector）

Heym 还可以使用 [pgvector](https://github.com/pgvector/pgvector) 扩展将向量**存储在其
自身的 Postgres 数据库内**——无需外部向量服务。创建一个 **RAG: Psql + OpenAI** 凭证，
并在创建 vector store 时使用它，然后在 RAG 节点的 Database 下拉列表中选择
**Postgres (pgvector)**。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `openai_api_key` | 用于在索引和搜索文档时生成 embeddings 的 OpenAI API key |

### 说明

- 无需 host/port——向量写入 Heym 自身的数据库；Heym 从不连接其他数据库。
- Qdrant 可用的所有 RAG 功能（插入、搜索、元数据过滤、Cohere 重排序、克隆、共享）在
  Postgres 后端上同样可用。
- 需要 `vector` 扩展。Heym 保持官方 `postgres:16` 镜像不变（因此现有数据绝不会被触碰），
  并在**启动时自动安装 `postgresql-16-pgvector` 包**——`run.sh`、`deploy.sh` 和
  `run_e2e.sh` 均会处理此操作。该安装是非致命的：如果无法运行（例如无网络），Qdrant RAG
  会继续工作，Postgres 后端则保持非活动状态（迁移会优雅地跳过该表）。
- 如果你针对**你自己的外部 Postgres** 运行已发布的单容器镜像
  （`ghcr.io/heymrun/heym`），该数据库必须支持 `vector` 扩展（Heym 无法将其安装到它不
  管理的数据库中）。若不支持，创建或上传到 Postgres vector store 时会返回明确的消息，
  而 Qdrant RAG 会继续工作。

### 使用方

- [RAG 节点](../nodes/rag-node.md)（通过 vector store）
- [Vectorstores 标签页](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) 是一款支持结构化数据和公式的电子表格/数据库混合工具。Grist 凭证允许 Heym 读取和写入 Grist 文档。
### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `api_key` | Grist API key（可在你的 Grist 实例中的 **Profile → API Key** 找到） |
| `server_url` | 你的 Grist 服务器的基础 URL（例如 Grist Cloud 为 `https://docs.getgrist.com`，或你的自托管 URL） |

### 说明

- [Grist 节点](../nodes/grist-node.md) 在其配置中需要 **Document ID**（来自 Grist 文档 URL）和 **Table ID** —— 这些不属于凭据的一部分。
- 对于自托管 Grist，将 `server_url` 设置为你的实例域名。
- Grist 中的列 ID 使用下划线（例如 `User_Name`），而非显示标签。使用 `listColumns` 操作来发现它们。

### 使用者

- [Grist 节点](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets 凭据使用 OAuth2“自带应用”模式将 Heym 连接到 Google Sheets API。你需提供 Google Cloud OAuth2 Client ID 和 Client Secret，然后通过浏览器弹窗授权访问。Token 会在后台自动刷新。

### 设置

1. 打开 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → 搜索并启用 **Google Sheets API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 应用类型选择 **Web application**。
3. 在 **Authorized redirect URIs** 下添加：`https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. 复制生成的 **Client ID** 和 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 类型选择 **Google Sheets (OAuth2)**。
6. 输入 Client ID、Client Secret 和名称，然后点击 **Connect** 打开 Google 同意弹窗并授权访问。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `client_id` | 来自 Google Cloud Console 的 OAuth2 Client ID |
| `client_secret` | 来自 Google Cloud Console 的 OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）会被自动存储和刷新 —— 你无需直接管理它们。

### 说明

- OAuth2 同意屏幕需要 spreadsheets scope（`https://www.googleapis.com/auth/spreadsheets`）。
- Heym 使用 refresh token 在 access token 过期前获取新的 access token（60 秒安全缓冲）。
- 如果你在 Google Cloud Console 中轮换了 Client Secret，请通过 **Connect** 按钮重新连接凭据。
- **生产环境：** 将后端 **`FRONTEND_URL`** 设置为用户在浏览器中打开的精确公共 URL（scheme + host，例如 `https://heym.example.com`）。Heym 仅根据此值构建 Google OAuth redirect URI —— 它**不**信任 `Origin` 或 `X-Forwarded-*` 头（客户端可控）。在 Google Cloud Console 中注册 `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`。

### 使用者

- [Google Sheets 节点](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive 凭据使用与 Google Sheets 相同的 OAuth2“自带应用”模式将 Heym 连接到 Google Drive API。你需提供 Google Cloud OAuth2 Client ID 和 Client Secret，然后通过浏览器弹窗授权访问。Token 会在后台自动刷新。

### 设置

1. 打开 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → 搜索并启用 **Google Drive API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 应用类型选择 **Web application**。
3. 在 **Authorized redirect URIs** 下添加：`https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. 复制生成的 **Client ID** 和 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 类型选择 **Google Drive (OAuth2)**。
6. 输入 Client ID、Client Secret 和名称，然后点击 **Connect** 打开 Google 同意弹窗并授权访问。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `client_id` | 来自 Google Cloud Console 的 OAuth2 Client ID |
| `client_secret` | 来自 Google Cloud Console 的 OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）会被自动存储和刷新 —— 你无需直接管理它们。

### Scope

Google Drive 请求**完整的 Drive scope**（`https://www.googleapis.com/auth/drive`）。

这是必需的，因为该节点操作的是你已拥有的文件。较窄的 `drive.file` scope 仅授予对 OAuth 客户端自身创建的文件的访问权限，这会导致 `listFolderFiles`、`updateFile`、`removeFile` 和 `removeFolder` 无法看到你现有 Drive 中的任何内容。

由于你提供的是来自你自己 Google Cloud 项目的 Client ID 和 Secret，此 scope 的 Google 应用验证要求适用于你的项目，而非 Heym。

### 说明

- Heym 使用 refresh token 在 access token 过期前获取新的 access token（60 秒安全缓冲）。
- 如果你在 Google Cloud Console 中轮换了 Client Secret，请通过 **Connect** 按钮重新连接凭据。
- 支持共享驱动器 —— 该节点在每次 API 调用时都会设置 `supportsAllDrives`。
- **生产环境：** 将后端 **`FRONTEND_URL`** 设置为用户在浏览器中打开的精确公共 URL。Heym 仅根据此值构建 Google OAuth redirect URI —— 它**不**信任 `Origin` 或 `X-Forwarded-*` 头。在 Google Cloud Console 中注册 `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback`。
- 在将此凭据与团队共享之前，请参阅 [凭据共享](./credentials-sharing.md)。

### 使用者

- [Google Drive 节点](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery 凭证通过 OAuth2“自带应用”（Bring Your Own App）模式将 Heym 连接到 Google BigQuery API。您需要提供 Google Cloud OAuth2 Client ID 和 Client Secret，然后通过浏览器弹窗授权访问。Token 会在后台自动刷新。

### 设置

1. 打开 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → 搜索并启用 **BigQuery API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 应用类型选择 **Web application**。
3. 在 **Authorized redirect URIs** 下添加：`https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. 复制生成的 **Client ID** 和 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 类型选择 **BigQuery (OAuth2)**。
6. 输入 Client ID、Client Secret 和名称，然后点击 **Connect** 打开 Google 授权同意弹窗并授权访问。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `client_id` | 来自 Google Cloud Console 的 OAuth2 Client ID |
| `client_secret` | 来自 Google Cloud Console 的 OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）会被自动存储和刷新。

### 注意事项

- OAuth2 授权同意屏幕需要 BigQuery scope（`https://www.googleapis.com/auth/bigquery`）。
- **生产环境：** 将后端 **`FRONTEND_URL`** 设置为公开 URL。在 Google Cloud Console 中注册 `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`。

### 使用者

- [BigQuery 节点](../nodes/bigquery-node.md)

---

## Supabase

Supabase 凭证将 Heym 连接到 Supabase 项目的 PostgREST API，使工作流能够查询和修改基于 Postgres 的表。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `supabase_url` | 项目基础 URL，例如 `https://your-project.supabase.co` |
| `supabase_key` | 具有目标表访问权限的 API key |
| `supabase_schema` | 可选的默认 schema（默认为 `public`） |

### 注意事项

- [Supabase 节点](../nodes/supabase-node.md) 与 `/rest/v1/<table>` 通信，支持操作符过滤器（`eq`、`neq`、`gt`、`gte`、`lt`、`lte`、`like`、`ilike`、`is`、`in` 及相关 PostgREST 操作符）以及嵌套的 `or` / `and` 逻辑分组。
- 对于写操作，建议使用面向可信服务端用途且仅具备最低所需表权限的 key。
- 即使凭证定义了默认 schema，节点仍可在每个步骤中覆盖 schema。

### 使用者

- [Supabase 节点](../nodes/supabase-node.md)

## ClickHouse

ClickHouse 凭证通过其 HTTP 接口将 Heym 连接到外部 ClickHouse 数据库，使工作流能够针对 OLAP 表执行 SQL、CRUD 和计数操作。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `host` | 不含 scheme 的 HTTP 主机，例如 `your-instance.clickhouse.cloud` |
| `port` | HTTP 接口端口（HTTPS 使用 `8443`，HTTP 使用 `8123`） |
| `username` | ClickHouse 用户（默认为 `default`） |
| `password` | 用户密码（可选） |
| `database` | 目标数据库（默认为 `default`） |
| `secure` | 为 `true` 时使用 HTTPS（ClickHouse Cloud 必需） |

### 注意事项

- [ClickHouse 节点](../nodes/clickhouse-node.md) 使用官方 `clickhouse-connect` HTTP 客户端，并对过滤器和值绑定进行参数化处理。
- `update` 和 `remove` 映射为 `ALTER TABLE ... UPDATE` 和 `DELETE FROM`，这些是 ClickHouse 的异步 mutation；两者都需要过滤器。
- `upsert` 执行 `INSERT`，并假定使用 `ReplacingMergeTree` 表以实现按键合并行为。
- 使用凭证对话框中的 **Test connection** 验证连通性。

### 使用者

- [ClickHouse 节点](../nodes/clickhouse-node.md)

## Notion

Notion 凭证支持内部集成 token 或公共集成 OAuth 连接。OAuth 允许每个用户从 Heym 授权 Notion 工作区，而无需手动复制 token。

### 必填字段

| 模式 | 字段 | 描述 |
|------|-------|-------------|
| 内部 token | `api_token` | 内部集成 token（`ntn_...`） |
| OAuth | `client_id` | 来自 Notion 公共集成的 Client ID |
| OAuth | `client_secret` | 来自 Notion 公共集成的 Client Secret |

OAuth 回调会自动存储 `access_token`、`auth_mode`、`workspace_id`、`workspace_name` 和 `bot_id`。OAuth 完成后，之前的所有内部 `api_token` 都会被移除。在 Notion 中注册以下重定向 URI：
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`。

### OAuth 设置流程

1. 在凭证对话框中选择 **OAuth**，输入名称、Client ID 和 Client Secret。
2. 点击 **Connect** 并在 Notion 弹窗中授权工作区。
   - 对于**新**凭证，Heym 会在您点击 **Connect** 时创建凭证记录。
   - 在弹窗中完成授权，然后点击 **Save** 返回凭证列表。
3. 已连接的凭证在列表中显示 `connected (Workspace Name)`。待处理的 OAuth 凭证在授权完成前显示 `Not connected`。

使用凭证对话框中的 **Test Connection** 验证内部 token 或已完成的 OAuth 授权。编辑时，将 token 字段留空会保留已存储的内部 token。

内部 token 和 OAuth access token 均可通过 `$credentials.CredentialName` 获取，用于需要 Notion bearer token 的自定义 [HTTP](../nodes/http-node.md) 调用。
### 说明

- 内部集成需要共享相关的页面、数据库和数据源。
- OAuth 用户在 Notion 授权期间选择工作区/页面。
- OAuth 应用凭证在 Notion 凭证内部加密存储。回调在服务端重新加载它们；密钥不会嵌入到 OAuth state 中。
- 已连接的 OAuth 凭证会显示工作区名称；待处理的 OAuth 凭证会显示 `Not connected`，直到授权完成。
- **生产环境：** 将后端 **`FRONTEND_URL`** 设置为公开的浏览器 URL（协议 + 主机，无尾部斜杠）。Notion 重定向 URI 必须完全匹配：
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`。
- 该节点使用 API 版本 `2026-03-11` 以及当前的 `data_source` 术语。有关从旧版 `archived`、`after` 或数据库查询示例迁移的指导，请参阅 [Notion 节点](../nodes/notion-node.md#api-version-notes) 文章。
- 对象值为 `database` 的旧版搜索过滤器会被规范化为 `data_source`。

### 使用者

- [Notion 节点](../nodes/notion-node.md)

---

## SMTP（电子邮件）

SMTP 凭证存储用于发送外发邮件的电子邮件服务器连接详细信息。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `host` | SMTP 服务器主机名（例如 `smtp.gmail.com`） |
| `port` | SMTP 端口（STARTTLS 通常为 `587`，SSL 为 `465`） |
| `email` | SMTP 服务器登录所用的用户名；当 `from` 为空时也作为可见发件人 |
| `password` | SMTP 密码或应用专用密码 |

### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `from` (`smtp_from`) | 可见的发件人（From）地址。留空则以 `email` 发送。服务器仍以 `email` 身份登录，因此该账户必须获准以此地址发送邮件（在 Gmail 中为已验证的**用这个地址发送邮件**别名）。 |

### 常见 SMTP 提供商

| 提供商 | 主机 | 端口 | 说明 |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | 需要[应用专用密码](https://support.google.com/accounts/answer/185833)（必须启用两步验证） |
| Outlook / Office 365 | `smtp.office365.com` | `587` | 使用你的 Microsoft 账户凭证 |
| Mailgun | `smtp.mailgun.org` | `587` | 使用域名设置中的 Mailgun SMTP 凭证 |
| SendGrid | `smtp.sendgrid.net` | `587` | 使用 `apikey` 作为用户名，API 密钥作为密码 |
| 自定义 / 自托管 | 你的域名 | `587` / `465` | Postfix、Exim 等 |

### 说明

- 当启用两步验证时，Gmail 需要 **应用专用密码** 而非你的常规密码。
- 端口 `587` 使用 STARTTLS（以明文开始，升级为 TLS）。端口 `465` 使用隐式 TLS（从一开始就使用 SSL）。

### 使用者

- [发送电子邮件节点](../nodes/send-email-node.md)

---

## IMAP（入站电子邮件）

IMAP 凭证存储用于通过 [IMAP Trigger 节点](../nodes/imap-trigger-node.md) 监控收件箱的连接详细信息。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `imap_host` | IMAP 服务器主机名（例如 `imap.gmail.com`） |
| `imap_port` | IMAP 端口（大多数提供商使用 `993` 进行 SSL/TLS） |
| `imap_username` | 邮箱用户名或完整电子邮件地址 |
| `imap_password` | 密码或提供商特定的应用专用密码 |

### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `imap_mailbox` | 要监控的邮箱文件夹（默认：`INBOX`） |
| `imap_use_ssl` | 启用 SSL/TLS（推荐；默认：`true`） |

### 说明

- IMAP Trigger 在首次轮询时对当前邮箱建立基线，之后仅处理更新的电子邮件。
- Gmail、Microsoft 365 和其他托管提供商通常需要 **应用专用密码** 或类似的 IMAP 专用密钥。
- 附件内容不会下载到工作流 payload 中；Heym 仅公开附件元数据。

### 使用者

- [IMAP Trigger 节点](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md)（IMAP 作为工作流 Trigger）

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) 是一个开源消息代理。RabbitMQ 凭证存储用于向队列和交换机发布消息以及从队列和交换机消费消息的连接详细信息。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `rabbitmq_host` | AMQP 连接 URL（例如 `amqp://localhost:5672`） |
| `rabbitmq_username` | RabbitMQ 用户名（默认：`guest`） |
| `rabbitmq_password` | RabbitMQ 密码（默认：`guest`） |

### 虚拟主机

要连接到特定的虚拟主机，请将其包含在 `rabbitmq_host` URL 中：

```
amqp://username:password@hostname:5672/vhost
```

如果使用默认虚拟主机，可以省略路径 `/`。

### 延迟消息插件

[RabbitMQ 节点](../nodes/rabbitmq-node.md) 支持 **rabbitmq_delayed_message_exchange** 插件。当你的 RabbitMQ 服务器上启用了此插件时，你可以使用节点上的 `rabbitmqDelayMs` 字段为外发消息设置延迟（以毫秒为单位）。

该节点会在已发布的消息上设置 `x-delay` 标头。交换机类型必须为 `x-delayed-message`，延迟才会生效。

要在自托管的 RabbitMQ 实例上启用该插件：

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

当未安装该插件时，`x-delay` 标头会被忽略，消息会立即投递。

### 使用者

- [RabbitMQ 节点](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md)（RabbitMQ 作为工作流 Trigger）

---

## Amazon S3

Amazon S3 凭证将 Heym 连接到 [Amazon S3](https://aws.amazon.com/s3/)。将其与 [Amazon S3 节点](../nodes/amazon-s3-node.md) 配合使用，可在工作流中管理存储桶和文件夹、上传和下载对象、复制键，以及列出或删除对象。
### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `aws_access_key_id` | AWS IAM 访问密钥 ID |
| `aws_secret_access_key` | 与访问密钥 ID 配对的私有访问密钥 |
| `aws_region` | 存储桶所在的 AWS 区域（例如 `us-east-1`） |

### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `aws_session_token` | 使用 AWS STS 凭证时的临时会话 Token |

### 说明

- 该凭证通过 boto3 使用标准 AWS SigV4 认证。
- 上传操作目前发送 UTF-8 文本内容；下载可返回文本或二进制对象的 base64 编码。

### 使用者

- [Amazon S3 节点](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) 是一种内存键值存储，用于缓存和快速数据访问。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `host` | Redis 服务器主机名或 IP（例如 `localhost`） |
| `port` | Redis 端口（默认：`6379`） |
| `password` | Redis 密码（未设置时留空） |

### 使用者

- [Redis 节点](../nodes/redis-node.md)

---

## Slack

Slack 凭证存储用于向 Slack 频道发送消息的 **Incoming Webhook URL**。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL（来自你的 Slack 应用配置） |

### 说明

- 在 [api.slack.com/apps](https://api.slack.com/apps) → 你的应用 → **Incoming Webhooks** 中创建 Incoming Webhook。
- 每个 Webhook 仅作用于特定频道。为不同频道创建多个凭证。

### 使用者

- [Slack 节点](../nodes/slack-node.md)

---

## Telegram

Telegram 凭证存储用于基于 Bot 的 Workflow 的 **Bot Token** 和可选的 **Webhook Secret Token**。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `bot_token` | 来自 BotFather 的 Telegram Bot API Token |

### 可选字段

| 字段 | 描述 |
|-------|-------------|
| `secret_token` | 用于在接收 Webhook 时与 `x-telegram-bot-api-secret-token` 进行校验的共享密钥 |

### 说明

- [Telegram Trigger](../nodes/telegram-trigger-node.md) 和 [Telegram](../nodes/telegram-node.md) 可使用同一凭证。
- 使用 Telegram Trigger 节点面板中显示的 URL，通过 Telegram 的 `setWebhook` API 手动注册 Webhook。
- Telegram 节点中的 `chatId` 可以是字面量 ID，也可以是类似 `$telegramEvent.message.chat.id` 的表达式。

### 使用者

- [Telegram Trigger 节点](../nodes/telegram-trigger-node.md)
- [Telegram 节点](../nodes/telegram-node.md)

---

## HTTP Auth（Bearer 与 Header）

这些凭证由 [HTTP 节点](../nodes/http-node.md) 用于对发出的请求进行认证。

### Bearer

向 HTTP 请求附加 `Authorization: Bearer <token>` 请求头。

| 字段 | 描述 |
|-------|-------------|
| `token` | Bearer Token 值 |

### Header

向 HTTP 请求附加自定义请求头。

| 字段 | 描述 |
|-------|-------------|
| `header_key` | 请求头名称（例如 `X-Api-Key`） |
| `header_value` | 请求头值 |

两种类型也可在 [Expression DSL](./expression-dsl.md) 中通过 `$credentials.CredentialName` 引用，以便在任何支持表达式的节点中动态使用。

### 使用者

- [HTTP 节点](../nodes/http-node.md)

---

## LLM 提供商（OpenAI、Google、Custom、Cohere）

这些凭证为 AI 节点提供支持。

| 类型 | 描述 |
|------|-------------|
| **OpenAI** | 用于 GPT 模型和 OpenAI embeddings 的 API key |
| **Google** | 用于 Gemini 模型的 API key |
| **Custom** | 用于 OpenAI 兼容 Endpoint（Ollama、vLLM、LM Studio 等）的 API key + base URL |
| **Cohere** | 用于 Cohere embeddings 的 API key |

### OpenAI Prompt 缓存

OpenAI 会自动缓存系统 Prompt 中静态（不变）的前缀——无需额外配置。多次 Workflow 运行若共享相同的系统 Prompt 前缀，将受益于缓存 Token 定价，从而降低成本和延迟。当你拥有较长的固定指令、且每次运行之间仅用户消息发生变化时，此功能尤为有用。可在 [Traces 标签页](../tabs/traces-tab.md) 或 OpenAI 使用情况仪表板中监控缓存命中率和 Token 节省情况，以优化 Prompt 结构，实现最大缓存复用。

### 使用者

- [LLM 节点](../nodes/llm-node.md)
- [Agent 节点](../nodes/agent-node.md)
- [RAG 节点](../nodes/rag-node.md)（通过 Qdrant 凭证使用 OpenAI embeddings）

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) 是一种代理服务器，用于绕过 Cloudflare 及类似的 Bot 防护挑战。

### 必填字段

| 字段 | 描述 |
|-------|-------------|
| `flaresolverr_url` | 你的 FlareSolverr 实例的 URL（例如 `http://localhost:8191`） |

此处支持回环地址和私有地址，因此按文档所述在 Heym 旁运行 FlareSolverr 可以正常工作。该 URL 不得解析为链路本地地址或云元数据地址。由于允许私有地址，此字段也可指向其他内部服务，回复将返回在节点输出中。任何已登录用户均可创建此凭证，因此边界在于谁可以编写 Workflow 以及你的网络规则，而非凭证共享。请参阅 [Egress Safety](../nodes/crawler-node.md#egress-safety)。

### 使用者

- [Crawler 节点](../nodes/crawler-node.md)

---
## 相关

- [Credentials](./credentials.md) – 凭据概述以及节点如何使用它们
- [Credentials Tab](../tabs/credentials-tab.md) – 添加和管理凭据
- [Credentials Sharing](./credentials-sharing.md) – 与用户和团队共享凭据
- [Security](./security.md) – 静态加密、访问控制
- [Expression DSL](./expression-dsl.md) – 用于动态访问的 `$credentials` 语法

---

## Model Router（自动模型）

使用决策模型将每个请求路由到您现有的某个模型凭据。它仅存储引用，绝不存储自己的密钥。

### 必填字段

- `decision_credential_id` – 您可访问的 **Decision Model** 凭据。
- `decision_model` – 执行路由调用的模型，例如 `jev-latest`。
- `options` – 至少两个条目，每个条目包含一个名称、您的某个 OpenAI/Google/Custom 凭据、该凭据上的一个模型，以及说明其应在何时胜出的判定条件。

### 可选字段

- `routing_instructions` – 如何对各个选项进行整体权衡。
- 可将其中一个选项标记为路由失败时使用的回退选项。

### 说明

选项名称是决策模型进行选择时所依据的标识，因此它们必须各不相同。一个选项不能指向另一个 Model Router。
