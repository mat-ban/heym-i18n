# 禁用节点

**禁用节点**节点会永久禁用 workflow 中的另一个节点。执行时，它会将目标节点的 `active` 设置为 `false` 并持久化该更改。可用于一次性操作，例如在满足条件后停止 Cron trigger。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `targetNodeLabel` | string | 要禁用的节点标签（例如 `hourlyCheck`） |

## 使用场景

在满足条件后禁用 [Cron](./cron-node.md) trigger，使其在未来的 workflow 执行中不再运行。之后可通过[启用节点](./enable-node.md)重新开启。

## 示例

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

流程：Cron → HTTP 检查 → 条件（状态为完成？）→ 若为真：禁用节点（目标：cron）→ 输出。

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [启用节点](./enable-node.md) – 重新开启已禁用的节点
- [Cron 节点](./cron-node.md) – 要禁用的 trigger
- [条件节点](./condition-node.md) – 在禁用前进行分支
