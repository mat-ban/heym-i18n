# Logs 标签页

**Logs** 标签页显示 Heym 技术栈的 Docker 容器日志。可用于调试、监控和故障排查。如需查看 Workflow 执行日志（节点结果、输出），请使用 Workflow 编辑器中的 Debug 面板——参见 [Canvas 功能](../reference/canvas-features.md#execution-logs)。

在自托管部署中，Docker 日志默认处于禁用状态。如需启用，请设置 `DOCKER_LOGS_ENABLED=true`，将 `DOCKER_LOGS_ALLOWED_EMAILS` 设置为允许访问 Docker 日志的可信用户邮箱列表（以逗号分隔），并确保将 `/var/run/docker.sock` 挂载到后端容器中。默认的 Docker Compose 服务和直接使用 `docker run` 的示例均包含该挂载，用于支持基于 Docker 的 MCP stdio 工具；仅在您接受 Docker socket 信任边界时保留该挂载。

如果注册功能处于开放状态，请在启用 Docker 日志之前创建可信管理员账户，或保持 `ALLOW_REGISTER=false`；否则未经核验的自注册用户可能会占用允许列表中的邮箱。

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ 观看 Logs 演示</a></p>

## 容器选择

- **All Containers** – 来自 backend、frontend 和 PostgreSQL 的合并日志
- **Backend** – `heym-backend` 容器
- **Frontend** – `heym-frontend` 容器
- **PostgreSQL** – `heym-postgres` 容器

## 日志级别筛选

- **All** – 显示所有日志级别
- **INFO** – INFO 及以上级别
- **WARNING** – 警告和错误
- **ERROR** – 仅错误
- **DEBUG** – Debug 及以上级别

## 搜索

- 通过文本搜索筛选日志
- 匹配内容会在日志输出中高亮显示

## 功能

- **Auto scroll** – 新日志到达时自动滚动到底部
- **Stream** – 实时流式传输日志（在支持的情况下）
- **Copy** – 将日志复制到剪贴板
- **Download** – 将日志下载为文件

## 使用场景

- 调试 Workflow 执行失败
- 检查 API 请求/响应日志
- 监控数据库查询
- 查看启动和健康检查消息

## 相关

- [Canvas 功能](../reference/canvas-features.md) – Workflow Debug 面板中的执行日志
- [Traces 标签页](./traces-tab.md) – LLM 追踪检查
- [Analytics 标签页](./analytics-tab.md) – 执行指标
- [Workflows 标签页](./workflows-tab.md) – Workflow 管理
- [上下文展示](../reference/contextual-showcase.md) – 仪表盘界面的精简页面指南
