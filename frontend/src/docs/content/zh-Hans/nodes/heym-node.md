# Heym

**Heym** 节点用于读取 Heym 自身的数据：你可以访问的 Workflow、单个 Workflow 的结构，以及其执行历史。它是你构建元 Workflow 的方式——即关于 Heym 本身的实例清单、执行摘要和健康报告。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 操作 | `listWorkflows`、`getWorkflow`、`getExecutionHistory` |
| 凭证 | 无需凭证 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `heymOperation` | Select | 执行哪种读取操作 |
| `heymWorkflowId` | UUID | 目标 Workflow。`getWorkflow` 和 `getExecutionHistory` 必填。支持表达式。 |
| `heymLimit` | String | 返回的最大行数。**留空或输入 `0` 将返回全部内容**——这是默认行为。支持表达式。 |
| `heymStatus` | String | `getExecutionHistory` 的可选状态过滤条件。支持表达式。 |
| `heymSinceDays` | String | `getExecutionHistory` 的可选回溯天数。支持表达式。 |

Workflow 选择器是一个可搜索的下拉列表，列出你可以访问的每个 Workflow。

## 访问范围

结果的范围限定为**该节点所在 Workflow 的所有者**——而非启动运行的人。可见集合包括：

- 所有者拥有的 Workflow，
- 直接共享给所有者的 Workflow，
- 共享给所有者所属团队的 Workflow。

所有者范围限定使得该节点在手动启动、由 cron 启动、从门户启动或由平台事件启动的运行中行为完全一致。若采用执行者范围限定，则每次无人值守的运行都会返回空结果。这与 Heym 已用于凭证和全局变量的规则相同。

你无法访问的 Workflow 与不存在的 Workflow 会产生相同的错误消息，因此该节点无法被用于探测 Workflow id。

## 操作

### List Workflows

返回所有者可以访问的每个 Workflow，按最近更新排序。

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow 摘要数组 |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow 名称 |
| `$nodeLabel.workflows[0].description` | 描述，或 `null` |
| `$nodeLabel.workflows[0].active` | Workflow 是否处于激活状态 |
| `$nodeLabel.workflows[0].folder_id` | 文件夹 UUID，或 `null` |
| `$nodeLabel.workflows[0].updated_at` | 最后一次保存的 ISO 时间戳 |
| `$nodeLabel.workflows[0].node_count` | Workflow 包含的节点数量 |
| `$nodeLabel.total` | 应用限制**之前**的完整可访问数量 |

`total` 特意为不受限制的数量，因此当你限制返回行数时，`$inventory.total` 仍会报告真实大小。清空 **Limit**，或将其设置为 `0`，将返回每个 Workflow——这是默认行为。

### Get Workflow

返回单个 Workflow 的身份和结构。

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.id`、`$nodeLabel.name`、`$nodeLabel.description` | Workflow 身份 |
| `$nodeLabel.active`、`$nodeLabel.folder_id`、`$nodeLabel.updated_at` | Workflow 元数据 |
| `$nodeLabel.node_count` | 节点数量 |
| `$nodeLabel.nodes` | `{ id, type, label, position, data }` 数组 |
| `$nodeLabel.edges` | `{ id, source, target, sourceHandle, targetHandle }` 数组 |

`data` 是**完整的节点配置**——保存时的每个字段。这正是审计得以实现的原因：如果节点拒绝显示字段，你就无法扫描 Workflow 中某人粘贴到字段里的 API key。

这不会授予调用者原本没有的访问权限。该节点的范围限定为所有者本就能在编辑器中打开的 Workflow，且存储的凭证密钥仍不在此处：节点数据仅包含凭证 **id**，而密钥本身加密存储在凭证表中。

### 扫描硬编码密钥

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

将 `$detail.nodes` 提供给 agent，并要求它标记任何看起来像有效密钥或 Token 的 `data` 值。值得关注的字段是自由文本字段——HTTP 节点上的 `curl`、LLM 和 Agent 节点上的 `userMessage` 和 `systemInstruction`，以及 Python 工具主体——因为凭证 id 是无害的 UUID，但粘贴的 `sk-…` 则不是。
### 获取执行历史

返回某个工作流的执行历史条目，最新的在前。

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.executions` | 历史条目的数组 |
| `$nodeLabel.executions[0].id` | 执行 UUID |
| `$nodeLabel.executions[0].status` | `success`、`error` 等 |
| `$nodeLabel.executions[0].started_at` | ISO 时间戳 |
| `$nodeLabel.executions[0].execution_time_ms` | 实际耗时 |
| `$nodeLabel.executions[0].trigger_source` | 触发本次运行的原因，例如 `cron` 或 `heym_event` |
| `$nodeLabel.executions[0].recovered` | 该次运行是否在崩溃后被恢复 |
| `$nodeLabel.executions[0].inputs` | 该次运行接收到的内容——Trigger 的 Payload 或调用方的输入 |
| `$nodeLabel.executions[0].outputs` | 该次运行的工作流输出 |
| `$nodeLabel.workflow_id`、`$nodeLabel.workflow_name` | 该历史所属的工作流 |
| `$nodeLabel.total` | 在限制**之前**匹配的执行总数 |
| `$nodeLabel.by_status` | 按状态统计的计数，例如 `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | 时间窗口的起点，若为完整历史则为 `null` |

条目同时携带 `inputs` 和 `outputs`——即该次运行接收到的内容和返回的内容——但绝不包含 `node_results`：逐节点追踪是表中最大的列，会令下游所有内容相形见绌。当你需要完整追踪时，请通过 API 获取单次执行。

`total` 和 `by_status` 始终描述**整个**匹配历史，即使 **Limit** 限制了返回的条目数量——因此你可以只拉取最近五次运行，同时仍能报告准确的失败计数。

将 **Since (days)** 留空以覆盖全部内容，将 **Status filter** 留空以包含所有状态，将 **Limit** 留空或设为 `0` 以返回所有条目。

## 示例工作流

**每日实例摘要**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` 标记为 `inventory`
- **Loop** 遍历 `$inventory.workflows`
- **Heym** `getExecutionHistory`，将 `heymWorkflowId` 设置为循环项的 `id`，`heymSinceDays` 为 `1`，`heymLimit` 为 `5`
- **LLM** 将收集到的运行记录和状态计数转换为可读的摘要

## 说明

- 无需凭证；该节点读取的是 Heym 运行所依赖的同一个数据库。
- **Limit** 是两个列表操作共用的同一字段，含义也相同：留空或设为 `0` 返回全部内容。
- 该节点接受普通输入，并可挂载到 Agent 节点作为工具，因此 Agent 可以回答关于你的 Heym 实例的问题——或对其进行审计。
- `getWorkflow` 的 Payload 会随工作流增长：冗长的 Prompt 和 Python 工具主体都会包含在 `data` 中传输。
- 将其与 [Heym Trigger](./heym-trigger-node.md) 搭配使用，可在工作流发生变化时即时响应，而无需按计划轮询。

## 相关

- [Heym Trigger](./heym-trigger-node.md) – 从平台事件启动工作流
- [Execute](./execute-node.md) – 运行另一个工作流，而非描述它
- [Loop](./loop-node.md) – 遍历返回的工作流列表
