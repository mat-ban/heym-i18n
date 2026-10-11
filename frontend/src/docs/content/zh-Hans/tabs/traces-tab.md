# Traces 标签页

**Traces** 标签页展示 LLM 执行轨迹。您可以检查请求/响应 Payload、耗时、工具调用，调试 [Agent](../nodes/agent-node.md) 和 [LLM](../reference/node-types.md) 节点的行为，并查看任意时间窗口内的聚合指标（调用次数、Token 数、成本、延迟、错误率）。

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ 观看 Traces 演示</a></p>

## 统计头部

页面在轨迹列表上方展示统计摘要，基于所选时间范围及其他生效的筛选条件计算得出：

- **KPI 卡片** – 总调用次数、总 Token 数、总成本（USD）、平均延迟、错误率 %
- **按模型统计 Token** – 各模型 Token 量的环形图
- **按模型统计成本** – 各模型 USD 花费的环形图。未配置定价的模型会显示“配置定价”链接，指向 [LLM 成本表](./datatable-tab.md#llm-cost-table-system-table)
- **调用趋势** – 按时间分桶（5 分钟 / 1 小时 / 6 小时 / 1 天，根据范围自动选择）展示成功与失败调用的堆叠面积图
- **未定价模型提示** – 当部分被追踪的模型没有定价记录时，显示在图表下方，链接至 LLM 成本表

## 时间范围

筛选栏顶部有一个 **Time range** 选择器，同时驱动统计头部和轨迹列表。可选值：最近 1 小时、最近 24 小时、最近 7 天（默认）、最近 30 天、全部时间。更改范围会重置分页，并同时重新加载图表和列表。

## 轨迹列表

- 所选时间范围内最近轨迹的分页列表
- 每条轨迹显示：Workflow、节点、凭证、时间戳、耗时
- 点击轨迹可打开详情视图
- 在详情对话框中可使用 **Prev / Next** 在轨迹之间切换，无需关闭对话框

## 筛选

- **Time range** – 1h / 24h / 7d / 30d / All；同时筛选图表和列表
- **Credential** – 按使用的凭证（API key）筛选
- **Source** – 按 Workflow 或执行来源筛选
- **Search** – 按模型、Workflow、凭证或节点标签搜索
- **Refresh** – 重新加载当前页的轨迹

## 轨迹详情

打开一条轨迹后：

- **Steps** – 自上而下的时间线，将轨迹呈现为有序链路：System → User → Assistant → Tool → Answer。每个步骤均可折叠；展开后显示可读的详情（消息文本，或工具的 arguments 和 result），随后是该步骤的 JSON。所有事件类型中的 JSON 内容——包括 MCP 调用和 JSON-RPC Payload——默认以可展开树形展示，第一层已展开。使用 **Tree / Raw** 在格式化结构与原始文本之间切换。格式错误的 JSON 仍以纯文本显示。工具步骤会显示其耗时和 MCP/Skill 徽章（如适用），以及工具调用状态被设置时的 pending / timeout / cancelled 徽章。Answer 步骤可显示聚合的 `tool_metrics` 徽章（按状态统计的调用次数和工具总耗时）。当轨迹记录每次模型调用时（如 Dashboard Chat 消息和路由 Agent 所做的那样），**LLM** 步骤位于其请求的工具之前，**Duration Breakdown** 将每次模型调用、工具和路由决策展开在同一条时间线上。一条 Dashboard Chat 消息是一条轨迹，无论经过多少轮工具调用。没有消息链的轨迹（例如图像生成）显示精简的 Request → Response 时间线。
- **Request** – 发送给 LLM 的完整请求 Payload，提供 **Tree / Raw** JSON 视图
- **Response** – 模型响应，包括工具调用（如有），提供 **Tree / Raw** JSON 视图
- **Tool metrics** – 当响应中存在时，显示工具调用次数（`success` / `error` / `pending` / `timeout` / `cancelled`）和工具总耗时的紧凑摘要
- **Timing breakdown** – `llm_ms`、`tools_ms`、`mcp_list_ms`，用于性能分析
- **Tool calls** – 工具名称、arguments、result、状态和耗时
- **Skills included** – 请求中传递给模型的 Skills
- **Go to Workflow** – 从轨迹详情对话框直接跳转到相关 Workflow

## 复制与导出

- 将请求或响应 JSON 复制到剪贴板；复制始终使用完整的原始 Payload，与当前视图无关
- 用于调试或与支持团队共享

## 维护

- **Clear All** – 确认后删除所有已保存的轨迹
- 分页控件显示当前可见范围（例如 `1-25 of 240`）

## 相关

- [Why Heym](../getting-started/why-heym.md) – 跨 Agent 生命周期的 LLM 可观测性
- [Agent Node](../nodes/agent-node.md) – 支持工具调用的 Agent 节点
- [Node Types](../reference/node-types.md) – LLM 和 Agent 节点
- [Credentials Tab](./credentials-tab.md) – 轨迹中使用的凭证
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – 针对 Workflow、节点和 Agent 工具 span 的可选 OTel 导出
- [DataTable Tab](./datatable-tab.md) – 承载成本图表使用的 LLM 成本表
- [Contextual Showcase](../reference/contextual-showcase.md) – 仪表盘界面的精简页面指南
