# 图表输出

**Chart Output** 节点是 [dashboard widget](../tabs/dashboard-tab.md) workflow 的终端节点。它接收上游节点生成的行数据，并将其转换为 dashboard 渲染所用的标准化 chart payload。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 0（终端） |
| 输出 | 标准化 chart payload |

将此节点放在 dashboard-widget workflow 的**最后**。其前一个节点应生成一个行对象数组，例如：

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

当你只有示例/样本数据（没有真实数据源）时，使用 **Set** 节点通过 `$array(dict(...), dict(...))` 生成这些行——例如 `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`。**不要**使用 `${...}` 或裸 `{...}` 对象字面量；Heym 仅通过 `dict(key=value)` 构建对象。

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `chartType` | string | `pie`、`bar`、`line`、`area`、`table`、`numeric`、`gauge`、`scatter`、`proportion`、`barGauge`、`text` 或 `hitl` |
| `orientation` | string | `vertical` 或 `horizontal`（仅限 bar 图表） |
| `dataPath` | string | 上游输出中行数组的点路径（例如 `data` 或 `result.items`）。留空则自动检测。 |
| `labelField` | string | 用作类别标签的行键（pie/bar/line） |
| `valueField` | string | 用作数值的行键（pie/bar/line/numeric/gauge） |
| `series` | array | 可选的多系列定义 `[{ "name": "Sent", "field": "sent" }]`，用于 bar/line（覆盖 `valueField`） |
| `columns` | array | 可选的 `table` 列列表（默认为第一行的键） |
| `statusColumn` | string | 可选的 `table` 列，渲染为彩色[状态标签](#status-chips)。必须是所显示列之一。 |，使用 `linkColumn` 时还会携带链接列和按钮文本。
| `statusTones` | object | 可选映射，将默认未涵盖的状态值映射为色调（`success`、`attention`、`failure`、`waiting`、`neutral`） |
| `linkColumn` | string | 可选的 `table` 列，其单元格包含 URL，显示为在新标签页中打开该 URL 的[链接按钮](#link-buttons)。必须是所显示列之一。 |
| `linkLabel` | string | 链接按钮的可选文本。留空时，按钮只显示链接图标。 |
| `xField` / `yField` | string | 用于 X 和 Y 数值轴的行键（scatter） |
| `min` / `max` | number | `gauge` 的数值范围（默认 `0` / `100`） |
| `unit` | string | 可选单位，显示在 `numeric` 或 `gauge` 值旁边 |
| `text` | string | `text` chart 类型的 Markdown 消息。留空并设置 `valueField` 以渲染从上游数据拉取的动态消息。 |
| `title` | string | 可选的图表标题 |
| `hitlWorkflowId` | string | 仅适用于 `hitl`。仅显示此 Workflow 的评审。留空时，小组件显示所有评审。 |
| `hitlNodeId` | string | 仅适用于 `hitl`。将 `hitlWorkflowId` 缩小到某一步骤：带人工评审的 Agent，或 Slack 审批、按钮或表单步骤。 |

## Chart 类型

- **bar / line / area / pie** — 由 `labelField` + `valueField` 驱动的分类图表（或多系列 bar/line/area 使用 `series`）。`area` 是填充趋势图。
- **table** — 使用 `columns` 将原始行渲染为可滚动表格。其中一列可以渲染为[状态标签](#status-chips)，并且点击行可以打开[详情页](../tabs/dashboard-tab.md#detail-pages)。
- **numeric** — 来自第一行的单个 KPI 值，可带 `unit`。
- **gauge** — 在 `min`–`max` 范围内显示的单个值（例如百分比）。使用 `valueField`。
- **scatter** — 来自 `xField` 和 `yField` 的 X/Y 点，用于相关性图。
- **proportion** — 单个水平条，按份额分割并带百分比图例（例如语言分布）。使用 `labelField` + `valueField`。
- **barGauge** — 每行一个水平 gauge，带红→绿渐变和一个值（例如可用磁盘空间）。使用 `labelField` + `valueField`，可选 `unit` 和 `max`（默认为最大行值）。
- **text** — 一条 markdown 消息（例如状态备注，如 "Last execution at 19:47"）。将 markdown 放入 `text` 以显示静态消息，或留空 `text` 并设置 `valueField` 以渲染上游生成的字符串。支持标题、粗体/斜体、[列表](../nodes/chart-output-node.md#interactive-task-lists)、链接和行内代码。
- **hitl** — 你待处理的人工审核的轮播。标题显示 `1/n pending`；左箭头在第一张卡片上禁用，右箭头在最后一张卡片上禁用。workflow 名称会在画布上打开该运行。**Approve**、**Request changes** 和 **Reject** 会解决它，widget 标题旁的历史图标会在同一页面的历史对话框中打开该运行。此 chart 类型忽略上游行，因此 widget workflow 仅为 Chart Output 节点。每个已登录用户会看到其拥有的 workflow 上的审核。 在节点属性或小组件设置中选择一个 **Workflow**（当它有多个评审步骤时，还需选择 **Select agent**），即可改为向所有能打开该 Workflow 的人显示其评审；参见 [HITL 小组件](../tabs/dashboard-tab.md#hitl-widgets)。

### 交互式任务列表

在静态 `text` 字段中使用 GitHub 风格 markdown 任务列表语法：

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

在 [Dashboard](../tabs/dashboard-tab.md) 上，复选框渲染为可点击控件（兼容深色和浅色模式）。切换复选框会更新 widget workflow 的 `text` 字段，并在刷新后保持。

**行内编辑：** 双击任务项的标签以就地编辑。按 Enter 或点击别处保存；按 Escape 取消。完全清除标签以从列表中移除该项。

**任务项中的链接：** 当标签包含 markdown 链接（`[title](url)`）时，点击链接会打开 URL 而不切换复选框。点击该行的其他位置以切换。

**仅限静态文本：** 交互性需要 GFM 任务列表语法（`- [ ]` / `- [x]`）。没有任务项的纯动态状态消息保持只读。当 markdown 来自 `valueField` 时，首次切换会将其复制到静态 `text` 字段，以便更改持久化。
### 编号列表

Text 组件渲染 markdown 时会**保留显式行号**。在每一行前加上你希望显示的数字（例如 `9.`、`8.`、`7.`）。Heym 不会为你重新编号。

**为什么要使用显式编号？** 标准 markdown 有序列表（`1.`、`2.`、`3.`）会转换为 HTML `<ol>` 列表，而该列表只会从第一个数字开始**向上**计数。若将列表写为 `9.` / `8.` / `7.`，在普通 markdown 渲染器中会显示为 `9`、`10`、`11`。为每一行加上预期的数字即可避免此问题。

**降序列表（例如最新在前）：** 在 Workflow 循环中构建 markdown，并为每个条目计算显示编号：

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

典型模式：

1. 获取或构建一个条目数组（例如 HTTP → `body.videos`）。
2. 对该数组进行 [Loop](./loop-node.md)；在循环体内，使用 [Variable](./variable-node.md) 的 `.add()` 在每次迭代中追加一行带编号的行。
3. 在循环的 **done** 分支之后，对累积的数组（或等效内容）执行 [Set](./set-node.md) `join("\n")`，合并为单个 markdown 字符串。
4. 将 **Chart Output** 的 `valueField` 指向该字符串（或设置静态 `text`）。

循环内的示例行表达式（label 为 `processVideos`，条目包含 `title` 和 `id`）：

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

生成的 markdown：

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

对于从 1 开始的简单升序列表，可以为每一行加上前缀（`1.`、`2.`、`3.`），或使用带 `$loop.index + 1` 的循环。当你不需要编号时，请使用[项目符号列表](#interactive-task-lists)（`- item`）。

## 状态标签

`table` 可以将某一列显示为彩色标签（chips）。在节点属性中将 **Status column**（或 DSL 中的 `statusColumn`）设置为列名。每个值都会获得五种色调之一，常见词汇无需配置即可自动匹配色调：

| 色调 | 默认词汇 |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | 其他所有值 |

匹配时忽略大小写、`_` 和 `-`，因此 `IN_PROGRESS` 和 `in-progress` 都会归为 `waiting`。可为其他值添加 **Status tones**；添加的条目会覆盖该值的默认色调：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

服务端会将每个值解析为对应色调，因此 Heym 与 Heym Work 显示相同的颜色。

## 详情页：`$page.record`

以 `?record=<value>` 打开的仪表盘会将该值作为 `$page.record` 运行每个组件的 Workflow。表格行链接可打开此类页面；参见[详情页](../tabs/dashboard-tab.md#detail-pages)。在未带记录打开的仪表盘以及表达式对话框中，`$page.record` 为 `null`。标签为 `page` 的节点优先级高于它。

可用它来获取该页面所针对的那条记录，例如在 [HTTP](./http-node.md) 节点中：

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` 是所点击行的原始值本身（如 `V-1002`），而不是包含字段的对象。若要在 [DataTable](./datatable-node.md) 中查找该记录，请按该值筛选其记录列：使用 `find` 操作并设置筛选条件 `{"vendor_id": "$page.record"}`。像 `$page.record.id` 这样的路径不会解析出任何内容，因此由 AI 构建或微调的组件会去掉这些字段，直接读取 `$page.record`。

该值来自任何人都可以修改的 URL。仪表盘仅接受符合其记录格式的值（默认为字母、数字、`-`、`_` 和 `.`），但仍应将其视为不可信输入：请将其传递到节点会对值进行转义的位置，例如 HTTP 查询参数、[DataTable](./datatable-node.md) 或 ClickHouse 筛选值，切勿通过字符串拼接与它构造查询文本。无论谁打开页面，组件始终以仪表盘所有者的身份运行。


## 链接按钮

`table` 可以把一列变成打开链接的按钮。请在节点属性中将 **Link column**（或 DSL 中的 `linkColumn`）设置为单元格包含 URL 的列，并可选设置 **Link button text**（`linkLabel`）。每个单元格都会变成一个在新标签页中打开其 URL 的按钮。没有按钮文本时，按钮只显示链接图标：

| 单元格值 | 打开 |
| ---- | --- |
| `https://jira.example.com/browse/T-1` | 另一个网站（在新标签页中） |
| `/dashboards` | Heym 内部页面（在新标签页中） |

只有 `http://` 和 `https://` 地址以及以单个 `/` 开头的路径才会变成按钮。其他任何值，例如 `javascript:` 或 `//host`，仍显示为纯文本，空单元格不显示任何内容。

该按钮可与[行链接](../tabs/dashboard-tab.md#detail-pages)并存：点击按钮会在新标签页中打开其链接，点击行内其他任何位置仍会打开详情页。

## 数据如何解析

1. 如果设置了 `dataPath`，节点会沿该点路径进入上游输出。
2. 否则它会查找数组：顶层列表、`data` 数组，或第一个值为列表的字段。
3. 直接来自 [Data Table](./datatable-node.md) 节点的行（`{id, data, created_at}`）在读取时会将各列置于顶层并与 `id` 并列，因此 `labelField`、`valueField` 和 `columns` 直接使用表自身的列名。
4. 对于 `table`，每一行使用 `columns`（或第一行的键）成为一行表格。设置了 `statusColumn` 时，Payload 还会携带该列中每个值的色调。
5. 对于 `numeric` 和 `gauge`，值来自第一行的 `valueField`（或第一个数值字段）。
6. 对于 `scatter`，每一行成为一个 `[xField, yField]` 点。
7. 对于 `text`，当设置了 `valueField` 时，消息取自第一行的 `valueField`，否则取自静态 `text` 配置（再否则取第一行的第一个字符串字段）。

## 示例

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge（单值 vs. 范围）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter（X/Y 点）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion（按占比拆分的单个条形 + 百分比图例）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area（填充式多系列趋势）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge（带数值的逐行渐变仪表）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text（静态 markdown 消息 — 无需上游行数据）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text（动态 — 消息字符串由上游生成，并通过 `valueField` 拉取）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## AI Prompt 示例

使用 **AI** 生成 widget 时，类似以下的 Prompt 可以清晰地对应到每种类型：

- **Bar** — “以垂直柱状图展示最近 6 个月的月度收入，使用示例数据。”
- **Line** — “以折线图绘制最近 14 天的每日活跃用户数。”
- **Area** — “以面积图展示最近 24 小时的内存和 CPU 使用率，包含两个系列。使用示例数据。”
- **Pie** — “以饼图分解执行状态（success、error、cancelled）。”
- **Table** — “以可滚动表格展示执行次数排名前 10 的 Workflow，包含 name 和 runs 列。使用示例数据。”
- **Numeric** — “以单个 KPI 展示今日 Workflow 执行总数，单位为 'runs'。使用示例数据。”
- **Gauge** — “以仪表盘展示当前 CPU 使用率，范围 0 到 100 百分比。”
- **Scatter** — “以散点图绘制请求延迟与 Payload 大小的关系，使用示例数据。”
- **Proportion** — “以比例条展示我最常用的语言：Kotlin 49.64%、JavaScript 23.73%、TypeScript 11.64%、Java 8.92%、Python 6.06%。使用示例数据。”
- **Bar gauge** — “以条形仪表盘展示各卷（sda1 到 sda7）的可用磁盘空间，单位为 GB。使用示例数据。”
- **Text** — “添加一个文本 widget，包含 markdown 清单（一项已勾选，两项未勾选），或按降序列出 5 个最新教程视频（5. 到 1.），附带 YouTube 链接——每行以显式编号开头（`5. Title`、`4. Title`、……）。”

## 相关

- [Dashboard tab](../tabs/dashboard-tab.md) — 构建和排列 widget
- [Output 节点](output-node.md) — 常规 Workflow 的终端节点
