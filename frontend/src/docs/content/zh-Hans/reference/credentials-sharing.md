# 凭据共享

凭据可以与其他用户共享，以便他们的工作流能够使用你的 API 密钥。有关概述，请参阅[凭据](./credentials.md)；有关添加和管理凭据，请参阅[凭据选项卡](../tabs/credentials-tab.md)。

## 与 LLM 共享凭据

要让 LLM 或 AI Agent 使用 API 密钥，请将该密钥存储为凭据，并让发起请求的节点附加该凭据。模型决定调用什么；节点在运行时对调用进行身份验证。

- **将密钥存储为凭据。** 敏感值在静态存储时加密，并在创建后在 UI 中掩码显示。
- **在发起请求的位置引用它。** [LLM](../nodes/llm-node.md) 和 [Agent](../nodes/agent-node.md) 节点通过 ID 选择其模型凭据，HTTP 请求则将 `$credentials.CredentialName` 放入认证头中。请勿将密钥放入 Prompt 字段，因为 Prompt 中的所有内容都会以文本形式发送给模型提供商。
- **为 Agent 提供工具，而非密钥。** 当 Agent 将 HTTP 节点、MCP 服务器或子工作流作为工具调用时，凭据会在该工具内部应用，模型接收的是工具的结果。
- **输出会被掩码处理。** 当长度超过七个字符的凭据值出现在节点输出中时，仅保留其前七个字符，因此回显密钥的响应在结果和追踪中只会显示该前缀。请参阅[输出掩码](#output-masking)。
- **让助手创建凭据。** 当 [AI 助手](./ai-assistant.md#credentials)或 Chat 选项卡创建凭据时，它只能看到名称和类型，你需要常规凭据表单中输入密钥。
- **以相同方式与他人共享。** 按下文所述将凭据共享给用户或团队，他们的工作流即可通过自己的 LLM 和 Agent 节点使用你的密钥。

## 共享模型

- **CredentialShare** – 将 `credential_id` 关联到 `user_id`（每对唯一）
- **通过电子邮件共享** – 使用电子邮件调用 `POST /api/credentials/{credential_id}/shares`；系统会查找该用户并将其添加
- **撤销** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

你还可以与[团队](./teams.md)共享凭据：

- **CredentialTeamShare** – 将 `credential_id` 关联到 `team_id`；所有团队成员获得访问权限
- **与团队共享** – 使用 `team_id` 调用 `POST /api/credentials/{credential_id}/team-shares`
- **撤销团队共享** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

共享的凭据会在[凭据选项卡](../tabs/credentials-tab.md) UI 中显示一个指示标记。

## 大范围权限凭据

共享凭据即授予接收方该凭据所能执行的一切操作。对于大多数集成而言，其范围仅限于一个工作区或一个 API 密钥的权限，但某些凭据的范围要广泛得多。

> **Google Drive 凭据授予完整的 Drive 访问权限。** [Google Drive](../nodes/google-drive-node.md)凭据使用 `https://www.googleapis.com/auth/drive` 作用域进行授权，以便该节点能够操作你已拥有的文件。将其共享给用户或团队，会使他们每一个人都能通过工作流**读取、修改并永久删除你 Google Drive 中的任何内容**——而不仅仅是你所设想的那些文件。请仅将其共享给你愿意直接授予完整 Drive 访问权限的人。

如果你需要限制暴露范围，请创建一个专用的 Google 账户，仅授予工作流所需文件夹的访问权限，并使用该账户而非你的主账户来连接凭据。

**Decision Model** 凭据携带 Endpoint，以及（在设置时）一个 API 密钥。共享它会让接收方能够通过他们可运行的任何工作流使用该密钥进行消费，与 LLM 凭据完全一样。

**Model Router** 凭据会共享它所路由到的所有内容。与你共享该凭据的人可以针对其选项列表中的每一个凭据运行请求，而这些请求会消耗你的密钥。他们无法读取密钥，且这些凭据不会出现在他们自己的凭据列表中。

这与直接共享 OpenAI 凭据所授予的权限相同，也正是路由器对团队有用的原因。如果你不希望如此，请改为共享各个单独的凭据，让每个人自行选择模型。

## 与工作流协作者共享

当你共享一个工作流时，协作者可以打开并运行它，但除非你也将凭据共享给他们，否则他们无法使用你的凭据。这适用于主工作流及其调用的任何子工作流中的凭据。请将每个凭据共享给你邀请到该工作流的相同用户或团队。子工作流还必须从子工作流的编辑器中单独共享。请参阅[工作流组织](./workflow-organization.md#sharing-workflows)。

## 执行上下文

当工作流运行时，凭据会针对**工作流所有者**（或运行时的当前用户）进行解析。`get_credentials_context()` 会合并：

1. **拥有的凭据** – `Credential.owner_id == user_id`
2. **用户共享的凭据** – `CredentialShare` 中 `CredentialShare.user_id == user_id` 的记录
3. **团队共享的凭据** – `CredentialTeamShare` 中用户为该团队成员的情况

所有这些都会合并到一个以凭据名称为键的单一上下文字典中。

## 在工作流中的使用
### 按名称（Expression DSL）

在 [Expression DSL](./expression-dsl.md) 中，凭据以 `$credentials.CredentialName` 的形式暴露。适用于以下场景：

- HTTP 节点（Bearer/Header 认证）
- Telegram 节点
- Slack 节点
- 自定义 HTTP 请求中的 Notion bearer token（内部 token 或 OAuth access token）
- 任何接受表达式进行认证的节点

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### 按 ID（credentialId）

部分节点会在 `node.data` 中存储 `credentialId`（UUID）：

| 节点类型 | 字段 | 描述 |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md)、Image Gen | `credentialId` | LLM API 凭据 |
| [Codex](../nodes/codex-node.md) | `credentialId`、`githubCredentialId` | Codex access token 凭据和 GitHub 凭据 |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`、`githubCredentialId` | OpenCode Go 网关凭据和 GitHub 凭据 |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud 邮箱/API token 或 Data Center 用户名/密码凭据 |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion 内部 token 或 OAuth 工作区凭据 |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token 和可选的 base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase 项目 URL 和 API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse 连接详情（host、port、auth、database） |
| [Telegram Trigger](../nodes/telegram-trigger-node.md)、[Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot 凭据 |
| [Discord Trigger](../nodes/discord-trigger-node.md)、[Discord](../nodes/discord-node.md) | `credentialId` | Discord 公钥或 webhook 凭据 |
| Vector Store | `credential_id` | Qdrant 或 Postgres（pgvector）向量数据库，通过 Qdrant、Psql 或 Custom Embeddings RAG 凭据 |
| Evals | `credential_id`、`judge_credential_id` | 模型凭据；用于 LLM-as-Judge 评判的模型或 Decision Model 凭据 |
| [Playwright](../nodes/playwright-node.md) AI step | `credentialId` | LLM/Vision 模型（用于 AI step 和 [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)） |

执行器会根据 ID 直接从数据库加载凭据并解密配置。

## 输出脱敏

执行完成后，`mask_sensitive_output()` 会对输出中的凭据值进行脱敏处理：对于长度超过七个字符的每个密钥，保留前七个字符，其余部分替换为 `**`，从而避免密钥在结果或 trace 中暴露。

## 相关内容

- [Credentials Tab](../tabs/credentials-tab.md) – 添加和共享凭据
- [Third-Party Integrations](./integrations.md) – 每种凭据类型的详细设置
- [Teams](./teams.md) – 与团队共享
- [Expression DSL](./expression-dsl.md) – `$credentials` 语法
- [Node Types](./node-types.md) – 使用凭据的节点（[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Codex](../nodes/codex-node.md)、[Jira](../nodes/jira-node.md)、[Linear](../nodes/linear-node.md)、[RAG](../nodes/rag-node.md)、[Playwright](../nodes/playwright-node.md)、[HTTP](../nodes/http-node.md)、[Notion](../nodes/notion-node.md)、[Sentry](../nodes/sentry-node.md)、[Supabase](../nodes/supabase-node.md)、[ClickHouse](../nodes/clickhouse-node.md)、[Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord](../nodes/discord-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[Slack](../nodes/slack-node.md)）
- [Agent Node](../nodes/agent-node.md) – 使用 `credentialId` 调用 LLM
