# Heym Trigger

当 Heym 自身发布平台事件时，**Heym Trigger** 节点会启动一个工作流。它是一个零输入 Trigger 节点，用于以 Heym 自动化 Heym：变更审计追踪、部署公告以及实例健康摘要。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.events`、`$nodeLabel.count`、`$nodeLabel.triggered_at` |
| Credential | 无需凭据 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `eventNames` | String array | 要订阅哪些事件。留空以接收所有事件。 |

## 事件

| 事件 | 发布时间 | 范围 |
|-------|----------------|-------|
| `heym.started` | Heym 平台启动时 | 实例范围：每个订阅者都会收到 |
| `workflow.created` | 创建 Workflow 时 | 仅 Workflow 所有者的订阅者 |
| `workflow.updated` | 保存 Workflow 时 | 仅 Workflow 所有者的订阅者 |
| `workflow.deleted` | 删除 Workflow 时 | 仅 Workflow 所有者的订阅者 |

Dashboard 小组件在内部以 Workflow 形式存储，但它们永远不会产生 `workflow.*` 事件。

## 投递是批量的

Heym 每五秒派发一次事件。**在一次派发过程中被认领的每个事件都会以数组形式到达同一个 Workflow 运行中**。

- 在五秒内创建两个 Workflow → **一次**运行，包含两个事件。
- 创建一个 Workflow → **一次**运行，包含一个单元素数组。

其结构永不改变，因此下游表达式无需根据到达的是一个事件还是多个事件进行分支判断。当你需要针对每个事件执行一次操作时，请在 `$nodeLabel.events` 上放置一个 [Loop](./loop-node.md) 节点。

## 精确一次投递

每个事件在投递之前，都会通过一个唯一的数据库约束按订阅节点进行认领。这在每个 uvicorn worker、每个容器以及每台机器上都成立：在两台服务器上运行 Heym 不会将事件投递两次。如果无法记录认领，则事件根本不会被投递——该设计会故障关闭（fail closed），而不是触发两次。

两个不同的 `heymTrigger` 节点订阅同一事件时，各自都会收到一次；它们不会相互竞争。

## 派发窗口

派发器只考虑在**最近五分钟**内发布的事件。更早的事件会保留在日志中供检查，但永远不会被投递。这限定了停机后会发生的情况：在离线一小时后重新启动 Heym 不会重放任何内容，而不是一次性触发一小时的积压事件。

事件会保留 **7 天**，然后被删除。

## 输出字段

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.events` | 事件对象数组，最旧的在前。始终是数组。 |
| `$nodeLabel.events[0].id` | 事件 UUID |
| `$nodeLabel.events[0].name` | 事件名称，例如 `workflow.created` |
| `$nodeLabel.events[0].payload` | 事件正文 |
| `$nodeLabel.events[0].workflow_id` | 主体 Workflow id，对于 `heym.started` 为 `null` |
| `$nodeLabel.events[0].created_at` | 事件发布时间的 ISO 时间戳 |
| `$nodeLabel.count` | 此批次中的事件数量 |
| `$nodeLabel.triggered_at` | Workflow 执行时间的 ISO 时间戳 |

### Payload 结构

`workflow.created`、`workflow.updated`、`workflow.deleted`：

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`：

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` 携带删除前一刻捕获的名称，因为当你读取该事件时，Workflow 行已经不存在了。

## 示例 Workflow

**Workflow 变更审计追踪**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** 标签为 `platformEvents`，订阅 `workflow.created`、`workflow.updated`、`workflow.deleted`
- **Heym** 节点，`getWorkflow` 和 `heymWorkflowId` 设置为 `$platformEvents.events[0].workflow_id`
- **Slack** 消息：`"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## 备注

- `heym.started` **每次平台启动触发一次**，而不是每个 worker 触发一次，尽管 Heym 每个容器运行八个 worker。启动时间相隔超过五分钟的容器各自发布一个事件。
- 以此方式触发的执行会在历史记录中显示为 `trigger_source = "heym_event"`。
- 如果你希望自动拾取未来版本新增的事件类型，请将 **Events** 设置为空，而不是列出全部四个事件。

## 相关

- [Heym](./heym-node.md) – 读取 Workflow 和执行历史
- [Triggers](../reference/triggers.md) – 所有 Workflow 入口点概述
- [Loop](./loop-node.md) – 针对批次中的每个事件执行一次操作
