# JSON 输出映射器

**JSON output mapper** 节点根据键/值[映射](./set-node.md)（与 [Set](./set-node.md) 相同的模型）构建一个 JSON 对象。当调用方希望在响应根级别接收**纯 JSON 正文**时，请使用此节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 0（sink） |
| 运行时输出 | 由 `mappings` 构建的对象 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` 条目（与 Set 相同） |

## Agent tool 用法

不支持。此节点是终端 sink，因此无法附加到 [Agent Node](./agent-node.md) 的 tools 句柄。当 agent 需要在对话中途塑造值时，请使用 [Set](./set-node.md) 节点。

## Webhook 与运行行为

当此节点是工作流的**唯一**终端输出时，执行**输出**即为映射后的对象本身：来自 `mappings` 的键出现在 JSON 的**顶层**。**没有**以节点 label 为键的外层包装，也**没有** `{ "result": ... }` 对象（与 [Output](./output-node.md) 节点不同）。

如果多个终端节点产生输出（例如 [Output](./output-node.md) 加上 JSON output mapper，或多个分支），Heym 使用常规结构：每个终端以其 `label` 为键。

## 循环限制

与 [Output](./output-node.md) 规则相同：不要将此节点放在循环迭代分支内——只能放在循环 `done` 分支之后。参见 [Loop](./loop-node.md)。

## 示例

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## 相关

- [Set](./set-node.md) – 用于中间转换的相同映射机制
- [Output](./output-node.md) – 带 `result` 包装的消息或基于 schema 的响应
- [Node Types](../reference/node-types.md) – 所有节点类型
- [Workflow Structure](../reference/workflow-structure.md) – JSON 工作流格式
- [Webhooks](../reference/webhooks.md) – 执行 endpoint 与响应
