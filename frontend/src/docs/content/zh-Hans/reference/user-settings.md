# 设置

设置对话框可用于管理个人资料、设置持久化 AI 指令、更新账户密码、配置聊天语音、设置默认 AI 凭据与模型，以及查看可观测性状态。点击页眉右上角的**您的头像和姓名**即可打开。

## 打开对话框

点击页眉右上角的**您的头像和姓名**。对话框打开后包含以下标签页：**Profile**、**Security**、**Voice**、**AI Defaults** 和 **Observability**。实例管理员还会看到 **SSO**、**Heym Work** 和 **Instances** 标签页。

## Profile 标签页

### 个人头像

Heym 会在页眉中显示与您账户邮箱关联的 [Gravatar](https://gravatar.com) 头像，该头像还会显示在 [Chat](../tabs/chat-tab.md) 和 **Chat with Heym** 中您的消息旁、[Board](../tabs/board-tab.md) 评论中，以及分享对话框和团队成员列表中的您的姓名旁。如需更改头像，请更新 Gravatar 上的图片；Heym 会在几小时内同步新头像。若没有 Gravatar 头像，Heym 会显示您姓名的首字母。

头像由 Heym 服务器获取并缓存，因此您的浏览器不会直接联系 Gravatar。如果服务器无法访问 Gravatar，所有人将始终看到姓名首字母。

### 姓名

在应用中显示的您的显示名称。此字段为必填项，不能留空。

### User Rules

User Rules 是自动注入到每个 AI 请求中的自定义指令——无论是在 workflow builder 中还是在 dashboard chat 中。在 **workflow builder**（[AI Assistant](./ai-assistant.md)）中，它们会被追加到用于生成 workflow JSON 的系统 Prompt 中。在 **dashboard chat** 中，它们会作为系统级上下文应用。您只需编写一次，即可全局生效，无需在每个 Prompt 中重复。

**常见用途：**

- 语言或语气：`Always respond in English. Keep responses concise.`
- 编码风格：`Use async/await patterns. Prefer TypeScript interfaces over types.`
- Workflow 约定：`Include error handling in all workflows. Use descriptive node labels.`
- 响应格式：`Use bullet points. Avoid lengthy explanations.`

**适用范围：**

| 上下文 | 说明 |
|---------|-------------|
| **Workflow builder** | [AI Assistant](./ai-assistant.md) 用于生成或修改 workflow 的请求 |
| **Dashboard chat** | 所有 [Chat 标签页](../tabs/chat-tab.md)对话 |

User Rules 在系统级注入——它们会在每个 Prompt 之前自动运行，无需为每个 workflow 或对话进行额外配置。

### 保存个人资料更改

点击 **Save Changes** 以应用更改。更改会立即对所有新的 AI 请求生效。

## Security 标签页

### 更改密码

使用 Security 标签页更新您的账户密码。

**要求：**

| 规则 | 要求 |
|------|-------------|
| 最小长度 | 8 个字符 |
| 大写字母 | 至少一个大写字母（A–Z） |
| 小写字母 | 至少一个小写字母（a–z） |
| 数字 | 至少一个数字（0–9） |

密码还必须与当前密码不同。这些规则在前端和后端均会强制执行。

**步骤：**

1. 输入您的 **Current Password**
2. 输入您的 **New Password**（必须满足上述所有要求）
3. 在 **Confirm New Password** 中再次输入
4. 点击 **Update Password**

如果当前密码不正确，会显示内联错误消息。成功后，会显示确认消息，表单会自动重置。

## Voice 标签页

Voice 标签页用于配置 [Chat 标签页](../tabs/chat-tab.md)的语音朗读：选择一个 **ElevenLabs 凭据**（或内联添加一个），从您的 ElevenLabs 账户中选择一个 **Voice**，然后点击 **Save Voice Settings**。这将启用逐条消息朗读和交互式语音模式。完整流程请参阅 [Chat Voice (TTS & STT)](./chat-voice.md)。

## AI Defaults 标签页

AI Defaults 标签页包含两个部分。

### 首选凭据与模型

选择一个**首选 LLM 凭据**及其中的**模型**。这将成为应用中所有 AI 功能的起始默认值——包括 chat、[AI Assistant](./ai-assistant.md)（builder、analyzer 和 workflow 创建）、board mapper、AI dashboard 小组件、[docs chat](../tabs/chat-tab.md)、数据表 AI schema 辅助工具、表达式构建器以及 evals——前提是该功能界面自身没有已保存的选择。

每个功能界面遵循的选择规则如下：

1. **已保存的选择**——您在该界面上已做出的选择（例如某个 chat 对话上次使用的模型）始终优先。
2. **首选**——在没有已保存选择时使用。
3. **第一个可用凭据**——在您未设置任何偏好时的回退选项。

您仍然可以随时按功能界面更改凭据和模型；偏好设置仅用于填充初始默认值。将凭据保留为 **No preference** 可维持之前的首个凭据行为。如果您首选的凭据之后被删除或取消共享，该标签页会显示提示，各功能界面会静默回退到第一个可用凭据。

### 编码套餐用量

对于每个 **Codex** 凭证（包括共享凭证），该标签页会以水平条的形式显示每个活跃窗口的剩余速率限制用量——例如 **5 小时**窗口和/或 **Weekly** 窗口，具体取决于您的套餐。每个条显示剩余配额的百分比以及重置倒计时。**Refresh** 按钮可按需重新获取（结果会在服务器端短暂缓存）。

对于每个 **OpenCode** 凭证，该标签页会以相同样式的条显示 OpenCode Go 订阅窗口——**5 小时**、**Weekly** 和 **Monthly**——通过该凭证的 API key 从网关的已认证用量 Endpoint 读取。已达到上限的窗口会以琥珀色显示 **"limit reached"**。如果 key 无效或工作区没有 Go 订阅，卡片会说明原因，而不是显示条。

## Observability 标签页

Observability 标签页显示此实例的 [OpenTelemetry Tracing](./opentelemetry.md) 只读状态：追踪是否启用、OTLP Endpoint、服务名称、采样器比率以及发出哪些 span。追踪通过后端的 `HEYM_OTEL_*` 环境变量配置，因此此标签页不编辑任何内容。当追踪被禁用时，该标签页会列出启用它所需的环境变量。OTLP 认证头等机密信息绝不会在此处显示。完整配置参考请参见 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)。

## SSO 标签页

仅对实例管理员可见——即 `HEYM_ADMIN_EMAILS` 中列出的账户。此标签页将 Heym 连接到外部 OpenID Connect 提供商，以便人们使用已有账户登录。输入 issuer URL 和 client credentials，将只读 redirect URI 复制到您的提供商，并在启用前运行 **Test connection**。测试通过后，可从此处关闭密码登录。完整设置请参见 [Single Sign-On](./sso.md)。

## Heym Work 标签页

实例管理员可在此连接面向业务团队的界面 [Heym Work](./heym-work.md)：配置其地址、仅显示一次的集成密钥以及 **Enable Heym Work** 开关。该标签页还会显示 Heym Work 最近一次签到时间、版本号和许可证状态。请参阅[连接 Heym Work](./heym-work.md#connecting-heym-work)。

## Instances 标签页

仅对实例管理员可见——即 `HEYM_ADMIN_EMAILS` 中列出的账户。此标签页列出连接到此数据库的 Heym 实例，并设置后台运行如何在它们之间拆分。每一行显示实例的可编辑名称、角色、是否在线、到数据库的实测延迟、开/关开关以及权重。权重是当前可承接工作的实例之间的份额，而不是 100 的百分比：使用 `41 / 26 / 33` 且第三个实例关闭时，前两个实际获得 61% 和 39%。面板会在表格下方打印该有效拆分，并且仅当没有任何已启用实例具有权重时才会拒绝保存。

**Give new instances a share automatically** 默认开启：否则加入的实例会停留在权重 0 并接收不到任何工作，因此 leader 会一次性给它相等份额，并按比例缩减现有权重。它绝不会改动您自行设置权重的实例。

该面板还会报告过去 24 小时的运行中有多少只能在主实例上执行。当该份额很高时，其下方的权重无法移动这些工作。关于哪些内容保留在 main 上以及如何选择这些数字，请参见 [Load Distribution](./cluster.md)。

## 此对话框中不包含的内容

| 功能 | 在哪里找到 |
|---------|-----------------|
| **API key 管理（MCP）** | [MCP Tab](../tabs/mcp-tab.md) – 查看、复制并重新生成您的 MCP server API key |
| **主题（深色 / 浅色）** | 页眉中的 Sun/Moon 切换按钮（用户徽章旁边） |
| **邮箱更改** | 当前不支持 |

## 相关

- [AI Assistant](./ai-assistant.md) – 使用 User Rules 的 Workflow builder 聊天
- [Chat Tab](../tabs/chat-tab.md) – 使用 User Rules 的 Dashboard 聊天
- [Chat Voice (TTS & STT)](./chat-voice.md) – 在 Voice 标签页中配置的 ElevenLabs 语音
- [MCP Tab](../tabs/mcp-tab.md) – MCP server API key 和 workflow 工具暴露
- [Credentials Tab](../tabs/credentials-tab.md) – 用于 AI 节点和集成的 API key
- [Security](./security.md) – 会话管理、速率限制、凭证加密
- [Single Sign-On](./sso.md) – 连接外部 OpenID Connect 提供商
- [OpenTelemetry Tracing](./opentelemetry.md) – 用于 workflow 和节点执行的分布式追踪
