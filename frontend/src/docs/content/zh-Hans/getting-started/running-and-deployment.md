# 运行与部署

Heym 提供两个脚本以适配不同环境：`run.sh` 用于本地开发，`deploy.sh` 用于基于 Docker Compose 的生产部署。

> **视频演示：** [2 分钟内完成 Heym 本地搭建](https://www.youtube.com/watch?v=P6YvlupUboU) —— 克隆仓库、启动 PostgreSQL、填写必需的环境变量，并在本地实例上创建第一个账户。

## 前置条件

两个脚本均要求安装以下工具：

| 工具 | 用途 |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 数据库容器（开发）与完整技术栈（生产） |
| [uv](https://github.com/astral-sh/uv) | 后端 Python 包管理器 |
| [bun](https://bun.sh) | 前端 JavaScript 运行时 |

## 环境配置

`run.sh` 与 `deploy.sh` 均从项目根目录的 `.env` 文件读取配置。若该文件不存在，脚本会自动从 `.env.example` 创建一份——本地开发与生产环境均如此。

`SECRET_KEY` 与 `ENCRYPTION_KEY` 在 `.env.example` 中默认为空。当任一为空时，`run.sh` 与 `deploy.sh` 会自动生成一个密码学强度足够的值并写回 `.env`，因此全新搭建无需手动处理密钥。若现有 `.env` 中仍包含旧版 `ENCRYPTION_KEY` 占位符（`change_this_to_a_random_32_byte_hex_value`），脚本会以显式错误终止而非覆盖它——轮换该密钥会导致此前加密的凭据无法读取。若任一密钥为空或仍为已知占位符，后端自身也会拒绝启动。

如需手动创建该文件（可选——脚本会自动完成）：

```bash
cp .env.example .env
```

关键环境变量：

关于所有支持的变量、默认值及生产环境注意事项，请参阅 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)。

| 变量 | 描述 |
|----------|-------------|
| `SECRET_KEY` | **必填。** JWT 签名密钥。为空时由 `run.sh`/`deploy.sh` 自动生成。 |
| `ENCRYPTION_KEY` | **必填。** 凭据加密密钥。为空时由 `run.sh`/`deploy.sh` 自动生成。 |
| `DATABASE_URL` | 可选的数据库连接字符串覆盖项。若为空，Heym 将根据 `POSTGRES_*` 设置构建。 |
| `BACKEND_PORT` | 后端 API 端口——默认为 `10105` |
| `FRONTEND_PORT` | 前端端口——默认为 `4017` |
| `FRONTEND_URL` | **生产环境必填。** 应用的公开 URL（协议 + 主机，例如 `https://heym.example.com`）。用于 OAuth 重定向 URI（Google Sheets、BigQuery、Notion 等），以及后台运行生成的审查、Codex 跟进和文件链接；必须与用户在浏览器中使用的 URL 一致。在 Cluster 中，需在每个实例上设置相同的值。 |
| `ALLOW_REGISTER` | 开放用户注册（生产环境为 `false`，开发环境为 `true`）。仅在管理员账户创建完成后再将其设为 `false`——系统没有首用户引导机制，因此空数据库加上禁用注册将导致无法创建任何账户。 |
| `DOCKER_LOGS_ENABLED` | 设为 `true` 时启用基于 Docker 的 Logs 标签页访问；同时需要 Docker socket 访问权限 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | 当 `DOCKER_LOGS_ENABLED=true` 时，允许访问 Docker 日志的可信用户邮箱列表，以逗号分隔 |
| `REQUEST_BODY_MAX_SIZE_MB` | Endpoint 处理程序运行前可接受的最大 HTTP 请求体大小；默认为 `100`，比 `FILE_MAX_SIZE_MB` 大一 MB，为 multipart 开销留出空间 |
| `HEYM_PYTHON_TOOL_SANDBOX` | 用户自定义 Python 工具的运行方式：`auto`（默认——加固的隔离 Docker 容器；Docker 不可用时安全失败）、`docker`（同上，绝不回退）或 `subprocess`（进程内本地回退；非安全边界，仅限可信/开发环境）。`run.sh` 在原生开发时设为 `subprocess`。参见 [Security](../reference/security.md#python-tool-sandbox)。 |
| `HEYM_PYTHON_TOOL_IMAGE` | 用于 Python 工具 Docker 沙箱的镜像。为空 = 自动检测正在运行的后端镜像。 |

数据库连接默认值（`POSTGRES_HOST`、`POSTGRES_PORT`、`POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DB`）记录于 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) 和 `.env.example`。

---

## 开发：`run.sh`

`run.sh` 通过单条命令在本地启动全部三个服务——数据库（以 Docker 容器形式）、FastAPI 后端以及 Vite 开发服务器。

```bash
./run.sh
```

**其执行步骤依次如下：**

1. 检查 `docker`、`bun` 和 `uv` 是否可用
2. 若 `.env` 缺失，则从 `.env.example` 创建；当 `SECRET_KEY` 或 `ENCRYPTION_KEY` 为空时，生成随机值
3. 在端口 `6543` 上启动（或创建）数据库 Docker 容器，数据存储于 `heym-postgres-data` Docker 卷中，而非宿主机目录
4. 通过 `uv sync` 安装 Python 依赖
5. 运行 Alembic 数据库迁移（`alembic upgrade head`）
6. 若后端与前端端口被占用，则释放之
7. 以 `--reload` 启动 FastAPI 后端（代码变更时热重载）
8. 通过 `bun install` 安装前端依赖
9. 启动 Vite 开发服务器

**选项：**

| 标志 | 说明 |
|------|-------------|
| *（无）* | 启用调试日志启动（`LOG_LEVEL=DEBUG`） |
| `--no-debug` | 使用默认日志级别启动（无调试输出） |
| `--help` | 显示用法信息 |

**服务地址（开发环境）：**

| 服务 | 地址 |
|---------|---------|
| 前端 | `localhost` 上的 `FRONTEND_PORT`（默认：4017） |
| 后端 API | `localhost` 上的 `BACKEND_PORT`（默认：10105） |
| 交互式 API 文档 | `localhost:10105/docs` |
| 数据库 | `localhost:6543` |

按 `Ctrl+C` 可优雅停止所有服务。

---

## 端到端测试：`run_e2e.sh`

前端 Playwright 测试套件针对真实的 Vue 应用、FastAPI 后端以及独立的 PostgreSQL 数据库运行：

```bash
./run_e2e.sh
```

该套件是面向关键路径的冒烟与回归测试套件，并非详尽的产品覆盖。它涵盖身份验证、核心 Workflow 生命周期与执行、部分仪表盘资源、公开路由，以及模拟的 HITL 审核 UI。提供商集成、所有节点类型、共享/权限矩阵以及完整的 HITL 恢复执行，仍主要由后端测试覆盖，或需要专门的集成环境。

每次运行都会获得独立的临时 PostgreSQL 16 容器、随机可用的数据库/后端/前端端口、身份验证状态、测试结果以及 HTML 报告。这使得多个 `run_e2e.sh` 进程可以并发运行，而不会共享状态或覆盖产物。脚本在运行结束后会移除其数据库容器，并打印产物目录与报告路径。

实用命令：

```bash
./run_e2e.sh --ui         # 带独立数据库的交互式 Playwright 运行器
cd frontend
bun run test:e2e:report   # 打开最近一次完成的本地运行
```

直接运行 `bun run test:e2e` 和 `bun run test:e2e:ui` 需要显式指定 `DATABASE_URL`，以免它们悄无声息地针对本地开发数据库启动。常规本地运行请使用 `./run_e2e.sh`。

`./check.sh` 运行 lint、类型检查、格式化以及后端测试，但不包含 E2E 套件，从而保持默认本地检查路径的快速性。Playwright E2E 测试请单独通过 `./run_e2e.sh` 运行。Pull Request 始终会在 GitHub Actions 中运行 Chromium E2E 套件，并在失败时保留 trace、截图、视频以及 HTML 报告。

---

## 生产环境：`deploy.sh`

`deploy.sh` 使用 Docker Compose 构建并运行完整技术栈。数据库、后端和前端这三个服务均以容器方式运行。后端入口点在启动服务器前会自动执行迁移，并以 8 个 worker 运行。

**首次部署（构建 + 启动）：**

```bash
./deploy.sh
```

此操作执行零停机部署：先构建镜像，同时现有容器继续运行，随后切换至新版本。

**可用命令：**

| 命令 | 说明 |
|---------|-------------|
| `./deploy.sh` | 构建镜像并启动/更新所有服务 |
| `./deploy.sh --status` | 显示容器状态 |
| `./deploy.sh --logs` | 流式输出所有容器的日志 |
| `./deploy.sh --restart` | 重启所有容器 |
| `./deploy.sh --down` | 停止并移除所有容器 |
| `./deploy.sh --migrate-pgdata` | 一次性迁移：将现有的 `data/postgres` 目录复制到 `heym-postgres-data` Docker 卷中，并重建其索引 |
| `./deploy.sh --help` | 显示用法信息 |

**数据库存储：使用 Docker 命名卷，而非宿主机目录。**

Compose 将 PostgreSQL 存储在 `heym-postgres-data` Docker 卷中。早期版本则改为绑定挂载宿主机目录 `./data/postgres`。在 macOS（virtiofs）和 Windows/WSL2 上的宿主机绑定挂载无法为 PostgreSQL 提供其所需的 `fsync` 和文件关闭保证：此类环境下的 Cluster 在处理 WAL 段时会遇到 `PANIC: could not close file … Input/output error`，并随时间推移发生损坏。Linux 绑定挂载从未受影响，但现在所有平台均使用相同的布局。

升级仍将数据存放在 `./data/postgres` 中的部署属于一次性操作。`./deploy.sh` 会检测到该情况，在构建前停止，并要求您先执行迁移：

```bash
./deploy.sh --migrate-pgdata   # 停止服务，复制到卷中，重建索引
./deploy.sh                    # 照常部署
```

**迁移过程还会重建索引。** 复制是逐字节进行的，因此旧绑定挂载造成的索引损坏也会一并带入。为此，`--migrate-pgdata` 会在新卷上单独启动 `postgres` 服务，对其运行 `reindexdb`，然后再次停止该服务，之后其余技术栈才会启动。这一点很重要，因为此类损坏会导致索引条目指向堆末尾之外——这种状态 `pg_amcheck` 会报告为正常，因此检查通过并不能证明表是健康的。REINDEX 会修复这些条目；但它无法恢复旧文件系统已经丢失的堆页面。对于已知健康的大型数据库，您可以通过 `./deploy.sh --migrate-pgdata --skip-reindex` 跳过重建。

复制过程是非破坏性的。`./data/postgres` 会保留在原处作为备份，且迁移过程拒绝覆盖已包含数据库的卷。如果任何步骤失败，新卷将被移除，因此半迁移状态的 Cluster 绝不会被误部署。确认您的 Workflow 完好无损后，即可删除旧目录。`postgres` 容器带有相同的保护机制，因此手动执行 `docker compose up` 也无法在您的数据之上静默初始化一个空数据库。全新安装无需任何操作。

**服务地址（生产环境）：**

前端容器暴露在 `FRONTEND_PORT`（默认值：4017）上。后端 API 通过 `/api` 路径提供服务，经由前端容器代理——因此生产环境中只有一个面向公众的端口。

**容器概览：**

| 容器 | 说明 |
|-----------|-------------|
| `heym-db` | 关系型数据库 |
| `heym-backend` | FastAPI API 服务器（8 个 worker，基于 `backend/Dockerfile` 构建） |
| `heym-frontend` | 前端预览容器，提供构建后的 Vue 应用（基于 `frontend/Dockerfile` 构建） |

**版本更新徽章：**

应用页眉会显示当前运行的 Docker 构建版本。当该版本落后于最新的 Heym GitHub 发布版本时，版本号旁会出现一个紫色的 **Update** 徽章。点击版本号或徽章即可打开 Heym GitHub 发布页面。

---

## 预构建镜像：`docker run`

如果不想在本地构建应用，可以直接拉取已发布的容器镜像并运行。

该镜像会在一个容器中同时启动前端和后端。PostgreSQL 仍为外部依赖，但您可以通过 `.env.example` 提供 `DATABASE_URL` 或 `POSTGRES_*` 变量。

> **将数据库存储在 Docker 命名卷中。** 发布镜像不附带数据库，因此 `DATABASE_URL` 背后的 PostgreSQL 需由您自行运行。请将其挂载为 `-v heym-postgres-data:/var/lib/postgresql/data`，而非主机路径：在 macOS（virtiofs）和 Windows/WSL2 上，绑定挂载的 PostgreSQL 数据目录无法满足数据库所需的 `fsync` 保证，会随时间推移损坏 Cluster。

> **向量存储后端。** `run.sh` 和 `deploy.sh` 运行官方 `postgres:16` 镜像，并在启动时自动安装 `postgresql-16-pgvector` 包，因此 **Postgres (pgvector) RAG 后端** 开箱即用，无需更改数据。但预构建的单容器镜像连接的是**您**提供的 PostgreSQL——该数据库必须支持 `vector` 扩展才能使用 Postgres 后端。Heym 无法向非其管理的数据库安装 pgvector。若缺少该扩展，启动迁移会优雅地跳过 pgvector 表——部署仍会成功，Qdrant RAG 继续正常工作，而创建或上传到 Postgres 向量存储时会返回明确的“后端不可用”消息，直到启用 pgvector。

**直接运行镜像时请自行设置密钥。** 与 `run.sh`/`deploy.sh` 不同，预构建镜像不会自动生成密钥。执行 `cp .env.example .env` 后，填充两个空密钥（就地替换可避免重复条目）：

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **将文件和插件挂载设为绝对路径。** `FILE_STORAGE_DIR` 和 `HEYM_PLUGINS_DIR` 默认使用相对路径 `./data/files` 和 `data/plugins`，而发布镜像从 `/app/backend` 启动后端。若保持相对路径，它们会解析为 `/app/backend/data/files` 和 `/app/backend/data/plugins`，导致上述两个绑定挂载接收不到任何内容，容器被替换时上传文件会丢失。`-e` 标志会覆盖 `.env.example` 通过 `--env-file` 提供的相对值，因为命令行 `-e` 优先于 `--env-file`。Compose（`./deploy.sh`）无需此操作：该镜像从 `/app` 运行后端，相对默认值已落在挂载点上。

> **Docker socket 访问。** 挂载 `/var/run/docker.sock` 会使后端对主机 Docker 守护进程拥有广泛控制权。默认 Docker Compose 服务和直接 `docker run` 示例均包含此挂载，以支持运行 `docker` 命令的基于 Docker 的 MCP stdio 工具。Logs 标签页仍需 `DOCKER_LOGS_ENABLED=true` 和 `DOCKER_LOGS_ALLOWED_EMAILS`（逗号分隔的可信用户邮箱列表）。请在启用 Docker 日志前创建可信管理员账户，或保持 `ALLOW_REGISTER=false`，以防未验证的自注册用户占用允许列表中的邮箱。用户自定义 Python 工具**不会**获得此 socket：它们在独立的加固容器中运行，无 Docker socket。参见[安全](../reference/security.md#python-tool-sandbox)。

> **Codex runner。** Codex 节点使用与 `ghcr.io/heymrun/heym` 相同的镜像作为同级 runner 容器（`--entrypoint codex`），以便 Codex 的 Linux 沙箱能够创建命名空间。若希望在直接镜像设置中使用 Codex Workflow，请保留 `heym-codex-workspaces` 卷挂载；runner 不会接收 Docker socket 或后端密钥。

> **OpenCode Go runner。** OpenCode Go 节点使用相同镜像作为加固的同级 runner（`--entrypoint opencode`），共享 `heym-opencode-workspaces`。若希望在直接镜像设置中使用 OpenCode Workflow，请保留该卷挂载；runner 不会接收 Docker socket 或 GitHub Token。

> **Skill 沙箱。** Agent 节点上的 Python skill 在共享 `heym-codex-workspaces` 卷的加固同级容器中运行，因此请为 skill 也保留该卷挂载——不仅限于 Codex。每次运行都会获得隔离的按次运行子路径，同级容器既不接收 Docker socket 也不接收后端密钥。此功能需要 **Docker Engine 25.0+**；在旧版引擎上，或缺少该卷时，`HEYM_PYTHON_TOOL_SANDBOX=auto` 会安全失败——仅在可信的单用户环境中设置 `HEYM_PYTHON_TOOL_SANDBOX=subprocess`。参见[安全](../reference/security.md#skill-sandbox)。

> **Playwright 需要 `--shm-size 2g`。** Docker 为容器分配的 `/dev/shm` 默认为 64 MB，Chromium 在该限制下会导致渲染进程崩溃。基于步骤的 Playwright 节点在此容器内以子进程方式运行 Chromium，因此该限制属于此容器；自定义 `playwrightCode` 在兄弟容器中运行，该容器会自行设置限制。`docker-compose.yml` 已声明 `shm_size: "2gb"`，因此 `run.sh` 和 `deploy.sh` 不受影响——仅直接使用 `docker run` 时需要该参数。

> **Playwright Run Code。** 自定义 Playwright Python 需要 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` 以及上述 Docker socket 挂载。发布镜像为 GHCR 布局（`/app/backend/.venv`）设置了 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON`。Compose `./deploy.sh` 将沙箱镜像默认为 `heym-backend:local`。在沙箱容器内的 Chromium 启动参数中保留 `--no-sandbox`。

**直接运行镜像所需的最低环境变量：**

| 变量 | 是否必需 | 用途 |
|----------|----------|---------|
| `DATABASE_URL` | 可选 | 完整的 PostgreSQL 连接字符串覆盖 |
| `POSTGRES_HOST` | 当 `DATABASE_URL` 为空时必需 | PostgreSQL 主机 |
| `POSTGRES_PORT` | 当 `DATABASE_URL` 为空时必需 | PostgreSQL 端口 |
| `POSTGRES_USER` | 当 `DATABASE_URL` 为空时必需 | PostgreSQL 用户名 |
| `POSTGRES_PASSWORD` | 当 `DATABASE_URL` 为空时必需 | PostgreSQL 密码 |
| `POSTGRES_DB` | 当 `DATABASE_URL` 为空时必需 | PostgreSQL 数据库名称 |
| `SECRET_KEY` | 必需 | JWT 签名密钥 |
| `ENCRYPTION_KEY` | 必需 | 凭据加密密钥 |
| `FRONTEND_URL` | 推荐 | 公开浏览器 URL，尤其用于 OAuth 回调 |
| `CORS_ORIGINS` | 推荐 | 允许的浏览器来源 |
| `FILE_STORAGE_DIR` | 推荐 | 挂载该路径时将其设置为绝对路径 `/app/data/files`；相对路径默认值 `./data/files` 在此镜像中解析到 `/app/backend` 下，会错过挂载点 |
| `ALLOW_REGISTER` | 推荐 | 在生产环境中设置为 `false`，除非有意开放注册，但仅在管理员账户已存在后设置——没有首用户引导机制 |
| `DOCKER_LOGS_ENABLED` | 可选 | 设置为 `true` 以允许 Logs 标签页使用 Docker socket 访问 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | 当 `DOCKER_LOGS_ENABLED=true` 时必需 | 允许访问 Docker 日志的受信任用户邮箱列表，以逗号分隔 |
| `HEYM_PLUGINS_ENABLED` | 可选 | 设置为 `true` 以启用插件子系统（以 zip 形式安装的自定义节点）。默认关闭 |
| `HEYM_PLUGIN_ADMIN_EMAILS` | 当 `HEYM_PLUGINS_ENABLED=true` 时必需 | 允许安装/卸载插件的操作员邮箱列表，以逗号分隔 |
| `HEYM_PLUGINS_DIR` | 可选 | 插件文件的存储位置。挂载该路径时将其设置为绝对路径 `/app/data/plugins`；相对路径默认值 `data/plugins` 在此镜像中解析到 `/app/backend` 下，会错过挂载点 |
| `HEYM_PYTHON_TOOL_SANDBOX` | 可选 | Python 工具隔离模式；默认为 `auto`（加固的 Docker 沙箱，故障关闭）。参见 [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | 可选 | 覆盖 Python 工具沙箱镜像；为空 = 自动检测后端镜像 |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | 可选 | 兄弟 Codex 运行器容器使用的 Docker 卷；在 Docker 部署中默认为 `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | 可选 | 允许 Codex 的沙箱命令下载文件/依赖；Docker 部署默认启用 |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | 可选 | 兄弟 OpenCode 运行器容器使用的 Docker 卷；在 Docker 部署中默认为 `heym-opencode-workspaces` |

**注意事项：**

- 镜像暴露端口 `4017`
- 后端保持内部访问，并通过 `/api` 代理
- 当 `POSTGRES_HOST=localhost` 时，发布镜像会在需要时自动将其重写为 `host.docker.internal`，以便同一份 `.env` 在 macOS Docker/Desktop 工具上与宿主机级别的 PostgreSQL 容器配合使用
- 如需 Drive 上传和技能生成的文件在容器重启后仍然保留，请保留 `data/files` 挂载
- **插件：** 如需启用，请设置 `HEYM_PLUGINS_ENABLED=true` 和 `HEYM_PLUGIN_ADMIN_EMAILS`，并挂载 `data/plugins`，以便已安装的插件文件在容器重建后仍然保留。插件元数据存储于您的 PostgreSQL 中，因此同样可以保留。插件声明的 pip `dependencies` 会在安装时安装到容器中；由于镜像文件系统是临时的，它们会在每次启动时**为每个已安装插件自动重新安装**（发布镜像的 `uv` venv 可写，因此在单容器镜像中同样有效）

### 将现有数据库迁移到命名卷

`./deploy.sh --migrate-pgdata` 仅识别 Compose 栈。如果针对您自己的 PostgreSQL 容器运行发布镜像，且该容器绑定挂载了宿主机目录，则需要自行迁移。

首先检查数据库容器使用的方式：

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

如果 `"Type"` 显示为 `bind`，请将其迁移到命名卷：

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

#   如果此 Docker 主机运行多个 Heym 部署，则使用卷名称。
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. 在卷上重新启动 PostgreSQL，复用之前的 flags
#    但替换 bind mount。
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. 一旦它接受连接，就重建索引。
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**在第 2 步和第 3 步中使用您自己的镜像，而不是 `postgres:16`。** 如果您的数据库运行的是 `pgvector/pgvector:pg16` 或其他变体，使用原版镜像启动复制后的 cluster 可能会失败，因为它所期望的扩展库缺失。

此过程不会改动您的原始数据目录，因此它仍然是您的回滚路径。只有在确认迁移后的数据库能够为您的 workflows 提供服务后，才删除它。第 4 步之所以重要，原因与 Compose 迁移中相同：复制操作会连同任何已有的索引损坏一起带走。

---

## 运行多个实例

以上所有内容部署的是单个 Heym 实例。当一台机器不再足够时，将第二个实例指向同一个 PostgreSQL 数据库，它就会作为 worker 加入：后台运行——cron、webhooks、MCP tool calls、chat triggers——随后会按照您在 **Settings → Instances** 中设置的百分比在实例之间共享。

实例之间从不相互通信。Postgres 承载工作，因此 worker 不需要开放端口，也不需要返回主实例的路由，并且不涉及消息代理。涉及本地磁盘的工作——Drive 文件、coding-agent 工作区、已安装插件——始终在主实例上运行，因此无需通过文件系统共享任何内容。

cluster 无法替您强制执行两条规则：每个实例都必须使用相同的 `SECRET_KEY` 和 `ENCRYPTION_KEY`，并且 ingress 必须只指向主实例。这两条规则以及放置规则和如何选择百分比，都在 [Load Distribution](../reference/cluster.md) 中说明。

> 这是负载分发，而不是高可用。主实例仍然是 ingress、文件存储和编辑器的单点故障。

## 常见 Workflows

**首次设置：**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

对于预构建的 `docker run` 镜像，请先手动生成密钥（参见上文的 **Prebuilt Image** 部分）。

**代码变更后更新生产环境：**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**检查生产日志：**

```bash
./deploy.sh --logs
```

**停止生产服务：**

```bash
./deploy.sh --down
```

---

## 相关内容

- [Introduction](./introduction.md) – 平台概览
- [Quick Start](./quick-start.md) – 构建您的第一个 workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 完整配置参考
- [Security](../reference/security.md) – JWT、加密和 CORS 设置
- [Load Distribution](../reference/cluster.md) – 针对一个数据库运行多个实例
