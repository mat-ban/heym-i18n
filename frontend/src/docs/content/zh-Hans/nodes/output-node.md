# 输出

**Output** 节点是工作流的终点，用于向调用方返回响应。请始终通过 label 引用前一个节点——切勿使用 `$input`。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1（可选，用于异步后处理） |
| 输出 | 向调用方返回 `message` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `message` | expression | 输出值。**必须**引用前一个节点：`$previousNodeLabel.field` |
| `allowDownstream` | boolean | 若为 true，则 output 之后的节点会在响应发送后异步运行 |

## Agent 工具用法

当 Output 节点作为画布节点工具连接到 [Agent 节点](./agent-node.md) 时，`message` 字段可通过机器人图标标记为 **agent-provided**。此时 Agent 在调用该工具时会提供 message。如果 Output 节点未作为 Agent 工具连接，则机器人图标会隐藏。

## 关键规则

**切勿在 output 节点中使用 `$input`。** 请始终使用前一个节点的 label：

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"`（其中 `processData` 是前一个节点的 label）

## 异步后处理

当 `allowDownstream: true` 时，响应会立即返回。连接到 output 之后的节点会在后台运行（例如 Slack 通知、日志记录）。由于下游尾部可能稍后完成，下游失败可能会在早期响应已经返回之后，将记录的运行状态更改为 `error`；最终历史记录和分析会反映该稍后的结果。

## 示例

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## 示例 – 带异步

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

然后在 output 之后连接 [Telegram](./telegram-node.md)、[Slack](./slack-node.md) 或其他节点，以实现即发即忘的通知。

## 相关

- [JSON output mapper](./json-output-mapper-node.md) – 当作为唯一终端时，根 JSON body 不包含 `result` 包装
- [节点类型](../reference/node-types.md) – 所有节点类型概述
- [Expression DSL](../reference/expression-dsl.md) – 引用节点输出
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 可展开编辑器，支持 message 的实时后端预览
- [工作流结构](../reference/workflow-structure.md) – JSON 格式
