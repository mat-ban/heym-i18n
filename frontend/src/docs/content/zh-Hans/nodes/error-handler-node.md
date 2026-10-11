# 错误处理程序

**Error Handler** 节点用于捕获 workflow 中任意节点产生的错误。当该节点存在时，任何节点失败都会自动触发它运行。无需传入连接——它由 workflow 引擎触发。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0（出错时触发） |
| 输出 | 1 |
| 输出 | `$nodeLabel.error`、`$nodeLabel.errorNode`、`$nodeLabel.errorNodeType`、`$nodeLabel.timestamp` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `message` | expression | 可选。默认值：`$error.message` |

## 错误上下文

当 error handler 运行时，以下字段可用：

| 字段 | 描述 |
|-------|-------------|
| `$errorHandler.error` | 错误消息字符串 |
| `$errorHandler.errorNode` | 失败节点的 label |
| `$errorHandler.errorNodeType` | 失败节点的类型 |
| `$errorHandler.timestamp` | 错误发生的时间 |

## 使用场景

- 在失败时发送 [Telegram](./telegram-node.md)、[Slack](./slack-node.md) 或 [Send Email](./send-email-node.md) 通知
- 将错误记录到外部系统
- 通过 [Output](./output-node.md) 返回自定义错误响应

每个 workflow 仅允许一个 Error Handler。

## 示例

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

连接到 Output 以返回自定义错误响应：
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

或连接到 Slack 以发送通知：
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## 相关

- [Node Types](../reference/node-types.md) – 所有节点类型概览
- [Telegram Node](./telegram-node.md) – 出错时通知
- [Slack Node](./slack-node.md) – 出错时通知
- [Send Email Node](./send-email-node.md) – 邮件告警
- [Throw Error Node](./throw-error-node.md) – 主动抛出错误
