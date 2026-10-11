# Cron

**Cron** 节点使用 cron 表达式按计划触发 Workflow。无需用户输入——Workflow 会在指定时间自动运行。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | Trigger 事件（无 Payload） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `cronExpression` | string | Cron 表达式（例如 `0 * * * *` 表示每小时） |

## Cron 表达式格式

标准 5 字段 cron：`minute hour day-of-month month day-of-week`

| 字段 | 值 | 示例 |
|-------|--------|---------|
| 分钟 | 0–59 | `0` = 在第 0 分钟 |
| 小时 | 0–23 | `*` = 每小时 |
| 日 | 1–31 | `*` = 每天 |
| 月 | 1–12 | `*` = 每月 |
| 星期 | 0–7（0 和 7 = 星期日） | `*` = 每天 |

**常见示例：**

- `0 * * * *` – 每小时
- `0 0 * * *` – 每天午夜
- `*/15 * * * *` – 每 15 分钟
- `0 9 * * 1-5` – 工作日 9:00

## 示例

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型的概述
- [Triggers](../reference/triggers.md) – Cron、Input、RabbitMQ
- [禁用节点](./disable-node.md) – 在条件满足后停止 cron Trigger
- [启用节点](./enable-node.md) – 再次启动已禁用的 cron Trigger
