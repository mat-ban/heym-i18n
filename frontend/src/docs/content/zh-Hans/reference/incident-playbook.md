# Heym Incident Playbook (L0)

使用此 Playbook 确认 Heym 故障事件、评估用户影响、选择严重性级别（severity），并快速获取正确的恢复规程与责任人。

详细操作规程：[Heym Runbook (L1)](./operations-runbook.md)

最后审查时间：2026-11-10。适用范围：自托管 Heym，单实例或 Cluster，运行于 Docker Compose 或 Kubernetes。

## 部署交接 (Deployment handover)

在值班（on-call）使用这些文档之前，请为每个环境填写此表。名称、URL、容量目标和恢复指标均取决于具体部署。代码库中的示例不代表生产环境清单。

| 项目 | 部署值 |
| --- | --- |
| 环境及 Heym 公网 URL | `<environment>`, `<public-url>` |
| 平台值班人员及替补 | `<rotation-or-contact>`, `<backup-contact>` |
| 事件沟通频道与事件跟踪系统 | `<channel>`, `<tracker-url>` |
| 数据库值班人员及数据库标识符 | `<contact>`, `<database-id>` |
| 基础设施、网络与存储负责人 | `<contacts>` |
| 发布负责人与部署系统 | `<contact>`, `<deployment-url>` |
| 应用错误、延迟与可用性仪表板 | `<dashboard-url>` |
| 主机或 Pod CPU、内存、磁盘与重启仪表板 | `<dashboard-url>` |
| PostgreSQL 连接数、锁、磁盘与复制仪表板 | `<dashboard-url>` |
| 日志与可选 OTel Trace 后端 | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose 项目/文件或 Kubernetes 上下文/命名空间 | `<exact-target>` |
| Main、Worker、数据库与存储位置 | `<services-or-deployments>`, `<storage-ids>` |
| 批准的冒烟 Workflow 及预期结果 | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| 数据库与文件备份规程、最新恢复测试 | `<procedure-url>`, `<test-date>` |
| 恢复时间目标与恢复点目标 (RTO, RPO) | `<RTO>`, `<RPO>` |

请将联系方式和仪表板链接保存在部署受限的运维副本中。证据应包含 ID、时间戳、计数和脱敏错误信息，而非凭据或 Workflow Payload。

## 平台清单

| 组件 | 职责 | 故障影响 |
| --- | --- | --- |
| 前端与 Main 后端 | UI、API、MCP、Portal、交互式执行 | 分别检查公网路由与 Main 主进程 |
| PostgreSQL | 应用状态、执行注册表、Run Queue、并发槽位、协调与通知 | 数据库中断可能会同时终止请求处理与后台执行 |
| Worker 实例（启用 Cluster 模式时） | 队列中符合条件的后台运行任务 | 健康的 Worker 无法替代 Main 的公网 Endpoint |
| 选出的 Leader 进程 | Cron、告警评估、后台协调 | 兼容的 Worker 可成为 Leader；这不会将其角色转变为 Main |
| Main 的持久化存储 | Drive 文件、已安装插件与 Coding-Agent 工作区 | 将存储与 Main 一同恢复；将 Ingress 路由至 Worker 无法恢复存储 |
| 各执行实例上的 Sandbox 后端 | 用于隔离执行的 Docker 容器或 Kubernetes Pod | Sandbox 后端故障可能会影响选定节点，而 UI 仍正常工作 |
| Workflow 依赖项 | 模型提供商、MCP 服务器、外部 API、数据存储与消息服务 | 确定是单个依赖项故障还是整个平台故障 |
| 可选 OTel Collector | 导出的 Workflow、节点与 Agent Tool Span | 仅缺少导出的 Trace 并不能证明执行失败 |

Heym 内置的 Run Queue 使用 PostgreSQL。Redis、RabbitMQ 和向量存储可作为 Workflow 依赖项；它们不是内置队列的强制服务。

`GET /api/health` 仅报告进程健康状态与版本。它不测试 PostgreSQL、队列、Leader 选举、Sandbox 容量或凭据同步。返回绿色状态仅代表单项检查通过，并非端到端就绪的保证。

## 前五分钟响应

| 步骤 | 行动 | 决策或证据 |
| --- | --- | --- |
| 1 | 确认告警并验证环境、服务及开始时间 | 记录 UTC 时间戳以及最近的发布/配置变更 |
| 2 | 检查公网 UI 和 `/api/health`，随后检查直接 Main 后端 | 公网故障而直接后端正常，表明存在路由或前端问题 |
| 3 | 检查 PostgreSQL 连通性与连接池压力 | 在重启应用服务之前，先将数据库故障路由至 L1 |
| 4 | 检查容器/Pod 状态、CPU、内存、存储与最近错误 | 区分基础设施故障、高负载与特定 Workflow 故障 |
| 5 | 在 Cluster 模式下检查 **设置 > 实例**、队列状态与 Leader 证据 | 确认 Main 丢失、离线/不匹配的 Worker 或仅限 Main 的任务 |
| 6 | 指定严重性级别并从路由表中启动一项缓解措施 | 针对 P1/P2，立即创建事件记录并通知相关负责人 |
| 7 | 验证安全生产模式下的冒烟 Workflow 运行并观察恢复情况 | 确认队列延迟（Queue Age）、错误率与资源使用改善；设定下次更新时间 |

如果发布与故障同时发生，请参阅[错误部署或配置回退](./operations-runbook.md#bad-deployment-or-configuration-regression)。回滚前请检查 Schema 兼容性。

## 严重性级别与响应

以下为基准响应目标。若具体部署的事件策略与业务影响要求更严格，请以更严格者为准。

| 严重性 | 示例 | 响应 |
| --- | --- | --- |
| P1 | Main 对所有用户不可用；数据库不可用或写入失败；大规模执行失败；关键接入在所有 Workflow 中中断 | 立即缓解，建立事件记录，通知平台与依赖项值班人员 |
| P2 | 积压增长；Worker 容量损失；连接池接近耗尽；单个 Workflow 降低共享容量；反复 OOM | 立即开始缓解，目标 15 分钟内遏制，建立事件记录 |
| P3 | 孤立的 Workflow/提供商故障；在平台整体健康容量下影响有限 | Workflow 或依赖项负责人跟进，记录值班备注 |
| P4 | 信息性信号、预期内的容量趋势、已验证的误报 | 确认、记录，必要时调整监控告警阈值 |

## 信号路由至 L1

在配置告警链接时，请使用这些相对锚点。当监控服务需要绝对 URL 时，请前缀托管运维副本的具体地址。

| 信号 | 从此处开始 |
| --- | --- |
| UI/API 不可用，公网 5xx，进程健康检查失败 | [UI 或 API 中断](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL 无法连接、连接被拒、写入失败 | [数据库中断](./operations-runbook.md#postgresql-down-or-not-writable) |
| 客户端过多、连接池超时、锁等待、活跃连接激增 | [数据库连接与锁](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| 需要受控重启后端/Worker | [服务重启](./operations-runbook.md#controlled-service-restart) |
| 执行次数、总时长、Token、CPU 或内存激增 | [资源消耗最大的 Workflow](./operations-runbook.md#most-resource-consuming-workflows) |
| 队列增长，运行任务处于等待或停滞状态 | [队列积压](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| 实例离线/不匹配、Worker 空闲、调度或分配问题 | [Cluster 检查](./operations-runbook.md#cluster-mode-checks) |
| Worker 正常但 Main 实例丢失 | [Main 实例不可用](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook 错误、MCP/Portal 故障、SSE 断开 | [Ingress 与执行 Endpoint](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM、CrashLoop、Pending、磁盘满、Persistent Volume 故障 | [容器、Pod 或存储问题](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| 镜像、环境或 Schema 变更后错误增加 | [错误部署](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Agent/LLM/MCP 提供商错误、429、凭据失败 | [模型或集成故障](./operations-runbook.md#model-credential-or-integration-failure) |
| Code/Playwright/Skill/Coding-Agent Sandbox 失败 | [Sandbox 故障](./operations-runbook.md#sandbox-failure) |
| 恢复无法满足目标；数据库或文件丢失 | [恢复与灾难响应](./operations-runbook.md#recovery-and-disaster-response) |

## 升级流程 (Escalation)

| 发现项 | 介入人员 | 提供信息 |
| --- | --- | --- |
| 多个交互面或 Workflow 受影响 | 平台值班人员与事件指挥官 | 环境、范围、开始时间、缓解措施、下次更新时间 |
| 数据库不可用、过载、死锁或磁盘耗尽 | 数据库值班人员 | 数据库 ID、连接数、阻塞 PID、脱敏错误、存储状态 |
| Pod/节点故障、存储挂载失败、Sandbox 容量不足 | 基础设施/存储负责人 | 上下文、命名空间、工作负载、Pod 事件、资源压力 |
| 直接后端正常但公网路由失败 | 网络/Ingress 负责人 | 受影响路由、状态码、延迟、后端对比 |
| 单个 Workflow 占用过多负载或单独失败 | Workflow 负责人 | Workflow/Run ID、Trigger 来源、速率、时间窗口、临时限制 |
| 存在关联的部署/配置变更 | 发布负责人 | 运行镜像摘要、发布时间、Schema 版本、上一已知正常版本 |
| 提供商配额/身份验证/可用性问题 | 凭据或集成负责人 | 提供商、模型/服务、状态码、安全请求 ID；切勿包含密钥 |

如果在首次缓解后 P1/P2 影响依然存在，请立即凭借已收集的证据进行升级。切勿等待完整的根本原因分析。

## 故障预期

| 故障现象 | 哪些功能可维持 | 首要行动 |
| --- | --- | --- |
| PostgreSQL 不可用 | 静态前端可能仍可加载 | 恢复数据库连接路径；切勿盲目重启所有应用实例 |
| Main 不可用，Worker 正常 | 若有兼容 Worker 成为 Leader，符合条件的后台任务与调度可继续 | 将 Main 与其持久化存储一同恢复；公网 UI/API/MCP/Portal 仍不可用 |
| Worker 不可用 | 重新分配时，其他合格实例可接管队列中的任务 | 在增加流量前检查实例分布、备用容量与恢复情况 |
| 执行中断 | 符合条件的可恢复运行任务可从头重新启动一次 | 手动重放之前，请先检查自动恢复机制与外部副作用 |
| 仅限 Main 的工作负载过载 | Worker 可能保持空闲 | 减少违规接入或增加 Main 容量；调整权重无法转移已固定的任务 |
| 内部告警不可用 | 外部 Uptime/数据库/基础架构监控仍可正常运行 | 使用 Heym 之外的监控；Heym 告警依赖于相同的数据库与调度器 |
| Sandbox 或提供商不可用 | 不依赖该项的 Workflow 可正常工作 | 隔离受影响的 Workflow 并修复相应依赖项 |

## 恢复与事件关闭

1. 验证公网访问、数据库访问、预期的实例合格状态以及安全的生产模式冒烟 Workflow。在编辑器中测试无法证明 Worker 调度正常。
2. 观察至少 10 分钟稳定的错误率、延迟、资源利用率以及下降的队列延迟（Queue Age）。同时观察下一次预期的关键定时任务或达成一致的等效冒烟检查。
3. 与 Workflow 负责人核对失败、已恢复、跳过、过期以及待处理的运行任务。在重放任何操作前检查外部副作用。
4. 逐步恢复临时 Trigger 暂停、限制策略以及 Worker 权重。为每一项剩余限制指定负责人和过期时间。
5. 使用影响范围、UTC 时间线、采取的行动、证据以及未解决的风险更新事件记录。为 P1/P2 指派根本原因复盘，并在规程缺失时更新这两份文档。

## 相关操作参考

- [L1 命令设置与检查](./operations-runbook.md#command-setup)
- [运行与部署](../getting-started/running-and-deployment.md)
- [负载分配](./cluster.md)
- [Kubernetes 部署](../getting-started/kubernetes.md)
- [安全与密钥轮换](./security.md)
