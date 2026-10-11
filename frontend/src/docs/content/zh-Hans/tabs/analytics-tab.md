# Analytics 标签页

**Analytics** 标签页展示您的 Workflow 的执行指标与趋势。监控使用情况、性能表现，并识别瓶颈。

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ 观看 Analytics 演示</a></p>

## 汇总统计

- **总执行次数** – 所选时间段内 Workflow 运行次数
- **成功率** – 成功运行的百分比
- **平均耗时** – 平均执行时间
- **节省时间** – 估算的总节省时间：每个 Workflow 配置的每次运行节省分钟数 × 其成功运行次数，在所选时间窗口内求和
- **趋势** – 与上一周期相比的上升/下降指标

## 时间范围

- **24h** – 最近 24 小时
- **7d** – 最近 7 天
- **30d** – 最近 30 天
- **All** – 全部可用历史记录

## Workflow 筛选

- 按特定 Workflow 筛选指标
- **All workflows** – 汇总所有 Workflow 的数据

## 表格

两个表格展示 Workflow 使用情况：**Most Used**（较宽）和 **Most Failed**。

- **Time Saved** – Most Used 表格显示每个 Workflow 的累计节省时间（每次运行节省分钟数 × 成功运行次数）。**Not Set** 表示缺少估算值；点击可打开该 Workflow 上的对应字段。
- **可排序列** – 点击列标题按该列排序。再次点击可切换升序/降序。箭头指示器显示排序方向。
- **移动端标签** – 在小屏幕上，列标签会缩短（例如 "Executions" → "Runs"，"Success" → "OK"，"Error" → "Err"），以便表格无需横向滚动即可适配。

## 图表

- **Execution Volume Over Time** – 按时间分桶的执行次数折线图
- **Success vs Error Rate** – 对比健康运行与失败运行的面积图
- **Average Latency Over Time** – 展示响应时间变化的折线图
- **拖拽选择** – 在任意图表上点击并拖拽以聚焦自定义日期范围
- **选择模式** – 选定的范围会刷新汇总卡片、图表和 Workflow 表格，而不改变基础预设
- **Clear Selection** – 完成深入分析后返回预设时间窗口

## 自动刷新

- 启用自动刷新可在无需手动重新加载的情况下保持指标更新

## 相关

- [Workflows 标签页](./workflows-tab.md) – 被测量的 Workflow
- [Traces 标签页](./traces-tab.md) – 详细的 Trace 检查
- [Logs 标签页](./logs-tab.md) – 用于调试的运行时日志
- [Contextual Showcase](../reference/contextual-showcase.md) – 仪表盘界面的精简页面指南

当图表显示出您希望被通知而非持续关注的趋势时，可将其转化为[告警](./alerts-tab.md)：错误计数、运行时长、LLM 支出和执行次数均可设置时间窗口内的阈值。
