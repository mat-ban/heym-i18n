# 启用节点

**Enable Node** 节点用于重新开启另一个节点。执行时，它会将目标节点的 `active` 设置为 `true` 并持久化该变更。它是 [Disable Node](./disable-node.md) 的对应节点：可用于重新启用 [Cron](./cron-node.md) trigger 或任何已被关闭的节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.targetNode`、`$nodeLabel.enabled` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `targetNodeLabel` | string | 要启用的节点标签（例如 `hourlyCheck`） |

## 行为

- 目标节点会被保存为 active 状态，因此后续运行和 trigger 都能感知到该变更。重新启用的 Cron trigger 会在下一个计划时间再次触发。
- 如果目标节点位于 Enable Node 的下游且尚未运行，它也会在当前执行中运行。
- 启用一个已经处于 active 状态的节点不会产生任何变化；输出仍会报告 `enabled: true`。
- 当 `targetNodeLabel` 为空或没有任何节点使用该标签时，该节点会以错误失败。

## 使用场景

按需启动一个 [Cron](./cron-node.md) trigger。将 Cron 节点保存为关闭状态，并为 workflow 提供第二个入口点，例如 [Input](./input-node.md) trigger。对该入口点发起请求会运行 Enable Node，随后 Cron 开始触发。

已关闭的 trigger 自身永远不会启动运行，因此 Enable Node 必须位于一个能够运行的入口点之后。

## 示例

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

流程：Input → Enable Node（目标：cron）→ Output。Cron 节点 `hourlyCheck` 在同一 workflow 中被保存为禁用状态，一旦启用便会运行其自身的 HTTP 检查分支。

## 相关

- [Node Types](../reference/node-types.md) – 所有节点类型的概述
- [Disable Node](./disable-node.md) – 从 workflow 内部关闭节点
- [Cron Node](./cron-node.md) – 要启用的 trigger
- [Condition Node](./condition-node.md) – 在启用前进行分支
- [Canvas Features](../reference/canvas-features.md) – 手动启用或禁用节点
