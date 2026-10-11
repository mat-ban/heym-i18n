# Scheduled 标签页

**Scheduled** 标签页以可视化日历的形式展示所有活跃的 Cron Workflow。您可以在日、周、月视图之间切换，查看自动化任务的计划运行时间。

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ 观看 Scheduled 演示</a></p>

## 视图

- **日视图** – 以逐小时时间线展示所选日期的安排；每次执行按其计划时间显示为一个区块
- **周视图** – 以七列网格展示当前一周的安排；当多个 Workflow 在同一小时触发时，区块会堆叠显示
- **月视图** – 以完整月历网格展示；每个单元格列出当天计划运行的 Workflow

## Workflow 区块

每个区块显示以下内容：

- **Workflow 名称** – 点击可直接打开 Workflow 画布
- **Cron 表达式** – 悬停时可见，显示原始调度规则（例如 `0 9 * * 1-5`）

## 导航

在 `HEYM_ADMIN_EMAILS` 中列出的实例管理员勾选 **Show all workflows** 后，可查看所有所有者的调度安排。取消勾选则仅显示自己的 Workflow。其他用户保留 **Show shared with me** 选项。如需停用某位员工的自动化任务，请使用 Workflows 预览页上的[实例管理控件](./workflows-tab.md#instance-administration)来暂停或恢复 Trigger。

- 使用 **previous / next** 箭头在日、周、月之间切换
- **Today** 按钮可立即返回当前日期

## 相关内容

- [Cron 节点](../nodes/cron-node.md) – 在画布上配置定时 Trigger
- [Workflows 标签页](./workflows-tab.md) – 管理和组织所有 Workflow
- [Analytics 标签页](./analytics-tab.md) – 执行指标与趋势
