# 安全

Heym 平台的安全实践与配置。

## 密码策略

所有密码——无论是在注册时还是更改密码时——都必须满足以下要求：

| 规则 | 要求 |
|------|-------------|
| 最小长度 | 8 个字符 |
| 大写字母 | 至少一个大写字母（A–Z） |
| 小写字母 | 至少一个小写字母（a–z） |
| 数字 | 至少一个数字（0–9） |

这些规则在前端和后端（Pydantic 验证器）均会强制执行。密码不符合要求的请求会在任何数据库写入发生之前被拒绝，并返回 `422 Unprocessable Entity` 响应。

**有效密码示例：** `MyWorkflow7!`

## 会话管理

- Access Token 存储在 **HttpOnly** Cookie 中，而非 `localStorage`。这可防止 JavaScript（包括 XSS Payload）读取 Token。
- Refresh Token 的作用域限定为 `/api/auth/refresh` 路径，无法发送到其他 Endpoint。
- 每次调用 `/api/auth/refresh` 都会**轮换** Refresh Token：旧 Token 立即被撤销，并签发新 Token。重放已使用的 Refresh Token 会返回 `401`。

## 速率限制

以下 Endpoint 按 IP 进行速率限制：

| Endpoint | 限制 | 封禁时长 |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 次请求 / 60 秒 | 15 分钟 |
| `POST /api/auth/register` | 5 次请求 / 60 秒 | 10 分钟 |
| `POST /register`（OAuth 客户端） | 5 次请求 / 60 秒 | 10 分钟 |
| Portal 登录 | 3 次尝试 | 24 小时 |

配置了 `REDIS_URL` 后，速率限制在所有后端 Worker 之间共享。未配置时，限制仅适用于单个 Worker 进程。

## 凭据加密

存储在[凭据](../tabs/credentials-tab.md)面板中的所有 API Key、Webhook URL 和 Bearer Token 在写入数据库之前均使用 AES-256（Fernet）进行静态加密。密钥派生自 `ENCRYPTION_KEY` 环境变量。当该值为空时，`run.sh` 和 `deploy.sh` 脚本会自动生成一个强密钥值；如果 `ENCRYPTION_KEY` 为空或仍为已知占位符，应用程序将拒绝启动。

## MCP API Key

MCP API Key 用于验证连接到 `/api/mcp/sse` Endpoint 的外部 MCP 客户端。当 SSE 连接建立后，会签发一个短期（1 小时）会话 Token 并将其嵌入消息 Endpoint URL 中，而非使用真实的 API Key，从而防止密钥出现在服务器访问日志中。设置方法请参阅 [MCP Tab](../tabs/mcp-tab.md)。

## OAuth / PKCE

OAuth 2.0 授权服务器（用于 MCP 客户端）仅支持带 PKCE（`S256`）的 `authorization_code` 授权类型。同意表单使用 HMAC-SHA256 CSRF Token，有效期为 10 分钟。同意页面中显示的所有值均经过 HTML 转义。

## 执行 Token

[执行 Token](./execution-tokens.md) 是用于从外部系统调用 Workflow 执行 Endpoint 的作用域 JWT。与用户会话 Token 不同，它们具有以下特点：

- **单 Workflow 作用域**——Token 对其他任何 Workflow 均会被拒绝。
- **可独立撤销**——撤销 Token 对签发用户的会话没有任何影响。
- **短期或长期有效**——TTL 可从 60 秒到 10 年之间选择。

Token 使用相同的应用程序密钥（`SECRET_KEY`）签名，并在每次请求时进行检查：签名、过期时间、`wid` 声明匹配以及撤销状态。设置方法和 API 参考请参阅[执行 Token](./execution-tokens.md)。

## 内容安全

在 LLM 和 Agent 节点上使用 [Guardrails](./guardrails.md)，在用户消息到达模型之前阻止不安全或违反策略的内容。Guardrails 支持九种内容类别（暴力、仇恨言论、色情内容等），并可配置敏感度级别。

## Python 工具沙箱

[Agent 节点](../nodes/agent-node.md)上用户自定义的 Python 工具会执行不受信任的代码。默认情况下，Heym 在加固的一次性 Docker 容器中运行每个工具，具备以下特性：

- 无网络访问，
- 只读根文件系统，配有小型 `tmpfs` 工作目录，
- 非 root 用户，所有 Linux 能力均已丢弃并设置 `no-new-privileges`，
- 严格的 CPU、内存和 PID 限制，以及
- **不挂载 Docker socket**，因此工具无法访问宿主机的 Docker 守护进程。

执行后端由 `HEYM_PYTHON_TOOL_SANDBOX` 环境变量控制：

| 值 | 行为 |
|-------|----------|
| `auto`（默认） | 在加固的 Docker 容器中运行。如果 Docker 不可用，执行将**安全失败**——不会在没有操作系统隔离的情况下静默运行不受信任的代码。 |
| `docker` | 与 `auto` 相同，但绝不回退。 |
| `subprocess` | 在本地进程内子进程中运行，受导入允许列表保护。这**不是安全边界**，仅适用于受信任的代码或本地开发。`run.sh` 在原生开发时选择此模式。 |

设置 `HEYM_PYTHON_TOOL_IMAGE` 可固定沙箱镜像；为空时，Heym 会自动检测正在运行的后端镜像。进程内限制（导入允许列表加上属性和内省过滤）作为纵深防御措施应用，但容器才是真正的隔离边界——在多用户和生产部署中请保持默认的 `auto`（或 `docker`）模式。

## Skill 沙箱

挂载到 [Agent 节点](../nodes/agent-node.md) 的 Python skill 同样会执行不受信任的代码——skill 可能原封不动地出现在共享的 Workflow 或 `everyone` 可见性模板中——因此 skill 与 Python 工具一样，通过**同一个** `HEYM_PYTHON_TOOL_SANDBOX` 开关运行，并以相同方式故障关闭（fail closed）。skill 容器采用完全相同的加固措施（非 root、丢弃所有 capabilities、`no-new-privileges`、只读根文件系统、CPU/内存/PID 限制，且**无 Docker socket**），但有两处刻意保留的差异，因为 skill 确实需要它们：

- **允许网络出口**（skill 需要调用 API 并通过 `uv` 安装自身依赖），以及
- **挂载可写工作区**，以便 skill 生成输出文件并读取 Heym Drive 文件。

该工作区通过 Codex runner 所使用的同一个命名 Docker 卷（`heym-codex-workspaces`，挂载于 `/app/data/codex-workspaces`）与一次性兄弟容器共享。只有本次运行自身的子目录会通过每次运行独立的 `volume-subpath` 挂载到兄弟容器中——因此一个 skill 永远不会看到另一次运行或 Codex 的工作区数据。Docker Compose 栈始终挂载此卷；单容器 `docker run` 必须为 Python skill 以及 Codex 都包含 `-v heym-codex-workspaces:/app/data/codex-workspaces`。如果在 `auto`/`docker` 模式下该卷缺失，skill 执行将**故障关闭**，而不会在后端中运行。由于每次运行的子路径挂载需要 **Docker Engine 25.0 或更高版本**，较旧的引擎应升级，或使用 `HEYM_PYTHON_TOOL_SANDBOX=subprocess` 运行受信任的 skill。

只有非密钥、可移植的环境变量（代理与 CA 证书包设置、locale）会被转发到容器中；数据库 URL、`SECRET_KEY`/`ENCRYPTION_KEY`、提供商 API 密钥以及 OAuth 密钥均通过允许列表予以保留。skill 文件路径会经过校验以确保位于工作区内，且输出目录中植入的符号链接（包括 `_hitl_request.json` 哨兵文件）永远不会被跟随。如有需要，可通过 `HEYM_SKILL_IMAGE`、`HEYM_SKILL_NETWORK`、`HEYM_SKILL_MEMORY`、`HEYM_SKILL_CPUS`、`HEYM_SKILL_PIDS` 和 `HEYM_SKILL_USER` 覆盖默认值。

与工具一样，`subprocess` 模式在后端进程中运行 skill，**并非安全边界**——仅将其用于受信任的单用户或本地开发场景（`run.sh` 在原生开发时会选择该模式）。

## Code 节点沙箱

[Code 节点](../nodes/code-node.md) 会运行任意用户 Python 代码以及任意第三方依赖，因此它是三个沙箱中最严格的一个，也是唯一一个**没有逃生通道**的沙箱：它不读取任何沙箱模式变量，没有 `subprocess` 模式，并且在无法访问 Docker 守护进程时故障关闭。它绝不会回退到在后端进程中运行用户代码。

执行过程使用一个或两个一次性容器，二者均像工具沙箱和 skill 沙箱一样经过加固（非 root、丢弃所有 capabilities、`no-new-privileges`、只读根文件系统、CPU/内存/PID 限制，且**无 Docker socket**）：

- 当 `requirements.txt` 为空时，使用**单个带 `--network none` 的容器**运行代码。runner 通过容器的 stdin payload 传入，因此完全不挂载任何内容。
- 当存在依赖时，第一个容器在具备网络访问的情况下将依赖安装到每次运行独立的 `.deps` 目录中，第二个容器以**只读**方式挂载该子树并运行代码。除非节点的 `codeAllowNetwork` 选项被开启，否则执行容器没有网络。

依赖通过 `uv` 安装，失败时以 `pip` 重试，且从不在运行之间缓存。当后端运行在容器中时，每次运行的目录位于 skill 沙箱所使用的同一个 `heym-codex-workspaces` 卷上，并通过每次运行独立的 `volume-subpath` 挂载，因此一次运行永远不会看到另一次运行的文件；该形式需要 **Docker Engine 25.0 或更高版本**。原生后端（`./run.sh`）没有此类卷，也不需要——其每次运行的目录是直接 bind 挂载到兄弟容器中的本地临时路径。无论采用哪种方式，该目录都会在每次执行后删除，无论结果如何。

只有非密钥、可移植的环境变量会被转发到容器中——代理设置、CA 证书包以及 locale，依赖安装需要这些才能在企业代理后访问 PyPI。数据库 URL、`SECRET_KEY`/`ENCRYPTION_KEY`、提供商 API 密钥以及 OAuth 密钥均通过允许列表予以保留，因此新增的后端密钥默认会被丢弃，而不会在有人更新拒绝列表之前泄露。后端的 `HOME` 永远不会覆盖沙箱自身的可写路径。

**Format** 按钮使用同一个沙箱。Ruff 解析并重写源代码而非执行它，但在后端主机上运行它会让不受信任的文件获得一个继承后端完整环境的进程，因此它拥有自己的一次性 `--network none` 容器，具备相同的限制和相同的允许列表环境。在没有 Docker 的情况下它会故障关闭，而不会在主机上执行格式化。

沙箱限制是常量而非环境变量——512 MB 内存、一个 CPU、256 个进程、120 秒安装超时以及 60 秒执行超时。镜像从现有的 `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` 链解析；该节点不引入自身的配置。

## 相关

- [运行与部署](../getting-started/running-and-deployment.md) – 在启动时配置 `SECRET_KEY`、`ENCRYPTION_KEY`、`ALLOW_REGISTER` 和 `HEYM_PYTHON_TOOL_SANDBOX`
- [Code 节点](../nodes/code-node.md) – 具有独立依赖的沙箱化 Python 执行
- [Agent 节点](../nodes/agent-node.md) – 在沙箱中运行的自定义 Python 工具
- [执行 Token](./execution-tokens.md) – 用于从外部系统调用 Workflow 的范围化 JWT
- [Guardrails](./guardrails.md) – 在 LLM 和 Agent 节点中拦截不安全内容
- [设置](./user-settings.md) – 修改您的密码
- [Credentials 标签页](../tabs/credentials-tab.md) – 管理 API key
- [MCP 标签页](../tabs/mcp-tab.md) – MCP API key 与 OAuth 客户端
- [Portal](./portal.md) – 公开聊天门户访问控制
