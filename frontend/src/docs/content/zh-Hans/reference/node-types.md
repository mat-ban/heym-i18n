# 节点类型

Heym 提供多种节点类型用于构建 Workflow。在节点配置中使用[表达式](./expression-dsl.md)，例如 `$input.text` 和 `$nodeLabel.field`。

## Trigger 节点

| 节点 | 描述 | 输出 |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Workflow 的文本入口点（HTTP/[Webhook](./webhooks.md)） | 1 |
| [Cron](../nodes/cron-node.md) | 按计划触发（Cron 表达式） | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | 当 Telegram 机器人 Webhook 更新到达时触发 | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | 当 Slack 发送 Events API Webhook 时触发 | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | 当 Discord 发送应用交互 Webhook 时触发 | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | 当 IMAP 邮箱收到新邮件时触发 | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | 当 Heym 发布平台事件时触发（批量数组） | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 通过出站连接至外部 WebSocket 服务器触发 | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 生成一次性上传链接，并在大文件上传时启动 | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | 当从队列收到消息时触发 | 1 |
| [Error Handler](../nodes/error-handler-node.md) | 当任意节点出错时运行（无入边） | 1 |

所有入口点请参见 [Triggers](./triggers.md)。

## AI 节点

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | 使用语言模型处理文本 | 1 | 1 |
| [Decision](../nodes/decision-node.md) | 向决策模型提出类型化问题，并根据其返回的概率进行分支 | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | 具备工具调用、技能、MCP、可选[人工审核](./human-in-the-loop.md)及可选[持久记忆图](./agent-persistent-memory.md)的 LLM。参见 [Agent 架构](./agent-architecture.md)。 | 1 | 1，外加可选的 `review` 输出 |
| [Codex](../nodes/codex-node.md) | 使用 ChatGPT/Codex 访问 Token 针对 GitHub 仓库运行本地 Codex CLI | 1 | 1，外加 `question` 输出 |
| [OpenCode Go](../nodes/opencode-go-node.md) | 使用 OpenCode Go 网关 API 密钥，在加固容器中针对 GitHub 仓库运行 OpenCode CLI | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | 直接调用特定的 MCP 工具，无需 LLM 选择 | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | 在 Qdrant 或 Postgres（pgvector）[向量存储](../tabs/vectorstores-tab.md)中插入、更新插入、删除或搜索，用于 RAG | 1 | 1 |

## 逻辑节点

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | 基于 if/else 分支 | 1 | 2（true/false） |
| [Switch](../nodes/switch-node.md) | 通过将值与分支匹配进行路由 | 1 | n |
| [Merge](../nodes/merge-node.md) | 等待多个输入并合并 | n | 1 |
| [Loop](../nodes/loop-node.md) | 遍历数组 | 1 | 2（loop/done） |

## 数据节点

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | 转换和映射数据 | 1 | 1 |
| [Converter](../nodes/converter-node.md) | 在格式之间转换数据（CSV、JSON、XML），并将图像或 PDF 进行 OCR 转换为文本 | 1 | 1 |
| [Code](../nodes/code-node.md) | 在一次性、网络隔离的沙箱中运行 Python，并带有独立的 requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | 设置或获取变量（Workflow 局部或[全局](./global-variables.md)） | 1 | 1 |
| [Execute](../nodes/execute-node.md) | 调用另一个 Workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | 读取 Heym Workflow 和执行历史 | 1 | 1 |

## 集成节点

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | 发起 HTTP 请求（cURL） | 0 或 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | 连接到外部 WebSocket 并发送一条消息 | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | 发送 Telegram 机器人消息 | 1 | 1 |
| [Slack](../nodes/slack-node.md) | 发送 Slack 消息 | 1 | 1 |
| [Discord](../nodes/discord-node.md) | 发送 Discord webhook 消息 | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | 通过 SMTP 发送邮件 | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis 操作（set、get、hasKey、deleteKey） | 1 | 1 |
| [Grist](../nodes/grist-node.md) | 读写 Grist 电子表格 | 1 | 1 |
| [GitHub](../nodes/github-node.md) | 通过 GitHub REST API 管理仓库、用户、issue、pull request、review、release、Actions workflow 及文件 | 1 | 1 |
| [Jira](../nodes/jira-node.md) | 通过 Jira REST API 管理 Jira 项目、issue、评论、附件、用户、通知及 workflow 流转 | 1 | 1 |
| [Linear](../nodes/linear-node.md) | 通过 GraphQL 管理 Linear 团队、项目、issue、workflow 状态及评论 | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | 通过 OAuth2 读写 Google Sheets | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | 通过 OAuth2 列出、下载、更新及删除 Google Drive 文件 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | 在 BigQuery 中运行 SQL 查询并插入行 | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | 通过 PostgREST 查询和修改 Supabase 表 | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | 对 ClickHouse 执行 SQL、CRUD 及计数操作 | 1 | 1 |
| [Notion](../nodes/notion-node.md) | 管理 Notion 数据库、数据源、页面及块 | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | 管理 Sentry 组织、项目、团队、issue、事件及 release | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | 管理存储桶和文件夹；列出、上传、下载、复制及删除对象 | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | 读写 Heym DataTable（第一方存储） | 1 | 1 |
| [Drive](../nodes/drive-node.md) | 管理 Drive 文件：删除、设置密码、TTL、最大下载次数、团队共享/取消共享 | 1 | 1 |

## 自动化节点

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | 使用 FlareSolverr 抓取网页 | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | 借助 AI 步骤和 Auto Heal 实现浏览器自动化 | 1 | 1 |

## 实用节点

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | 延迟执行 | 1 | 1 |
| [Output](../nodes/output-node.md) | 输出 endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | 将字段映射为 JSON 对象；作为唯一终端时 = 顶层 webhook/运行 body | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | 渲染 HTML 页面；作为唯一终端时 = webhook 以 text/html 响应 | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | 终端仪表盘组件输出，将上游行数据映射为图表 payload | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | 在画布上添加 markdown 注释（不执行） | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | 输出日志到后端控制台 | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | 禁用 workflow 中的另一个节点 | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | 启用 workflow 中已禁用的节点 | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | 以错误响应停止 workflow | 1 | 0 |

## 插件节点

插件节点由实例上安装的插件提供。每个已安装的插件都会以自身名称出现在
**Plugins** 下的节点面板中；在底层，它映射为以下两种节点类型之一。

| 节点 | 描述 | 输入 | 输出 |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | 由已安装插件提供的自定义操作 | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | 由已安装插件提供的自定义 trigger | 0 | 1 |

## 相关

- [Canvas 功能](./canvas-features.md) – 数据固定、执行日志、启用/禁用、提取为子 Workflow
- [Agent 节点](../nodes/agent-node.md) – AI Agent 节点的详细参考
- [Agent 架构](./agent-architecture.md) – 子 Agent、编排器、技能、MCP、工具调用
- [Agent 持久记忆](./agent-persistent-memory.md) – 按节点划分的知识图谱、共享及后台提取
- [Human-in-the-Loop](./human-in-the-loop.md) – 暂停 Agent 输出以等待人工审批
- [Expression DSL](./expression-dsl.md) – 在节点配置中引用数据
- [Expression 求值对话框](./expression-evaluation-dialog.md) – 可展开编辑器，支持后端实时预览
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – 通过一次性链接接收大型分片上传
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – 实时出站 socket Trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – 向外部 socket 推送消息
- [Workflow 结构](./workflow-structure.md) – 节点与边的 JSON 格式
- [Triggers](./triggers.md) – 所有 Workflow 入口点
- [Credentials 标签页](../tabs/credentials-tab.md) – 为 LLM、HTTP 及其他节点添加 API 密钥
- [Credentials 共享](./credentials-sharing.md) – 与其他用户共享 Credentials
- [Portal](./portal.md) – 将 Workflow 暴露为公开聊天 UI
- [Vectorstores 标签页](../tabs/vectorstores-tab.md) – 为 RAG 节点创建向量存储
