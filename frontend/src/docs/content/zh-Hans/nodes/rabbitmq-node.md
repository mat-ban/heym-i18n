# RabbitMQ

**RabbitMQ** 节点用于从 RabbitMQ 队列和交换机发送或接收消息。适用于消息驱动的工作流和事件处理。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.status`、`$nodeLabel.message_id`、`$nodeLabel.body`（接收） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自[凭证](../tabs/credentials-tab.md)的 RabbitMQ 凭证 |
| `rabbitmqOperation` | `"send"` \| `"receive"` | 操作类型 |
| `rabbitmqExchange` | string | 交换机名称（发送时可选） |
| `rabbitmqRoutingKey` | string | 路由键（用于发送） |
| `rabbitmqQueueName` | string | 队列名称（接收时必填，发送时可选） |
| `rabbitmqMessageBody` | expression | 发送的消息体（支持表达式） |
| `rabbitmqDelayMs` | number | x-delay 头部，单位为毫秒（延迟消息插件） |

## 操作

### 发送

将消息发布到队列或交换机。

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `rabbitmqMessageBody` | 是 | JSON 或字符串消息体 |
| `rabbitmqQueueName` | 可选 | 直接队列目标 |
| `rabbitmqExchange` | 可选 | 交换机名称 |
| `rabbitmqRoutingKey` | 可选 | 路由键 |
| `rabbitmqDelayMs` | 可选 | 延迟时间，单位为毫秒 |

**输出：** `$nodeLabel.status`（"published"）、`$nodeLabel.message_id`、`$nodeLabel.exchange`、`$nodeLabel.routing_key`

### 接收

Trigger 模式：当消息到达时工作流启动。作为 Trigger 使用时无需传入边。

**输出：** `$nodeLabel.body`（消息 Payload）、`$nodeLabel.message_id`、`$nodeLabel.queue`

## 示例 – 发送

```json
{
  "type": "rabbitmq",
  "data": {
    "label": "publishMessage",
    "credentialId": "rabbitmq-credential-uuid",
    "rabbitmqOperation": "send",
    "rabbitmqQueueName": "tasks",
    "rabbitmqMessageBody": "$userInput.body"
  }
}
```

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型概述
- [Triggers](../reference/triggers.md) – 将 RabbitMQ 用作工作流 Trigger
- [凭证选项卡](../tabs/credentials-tab.md) – 添加 RabbitMQ 凭证
- [第三方集成](../reference/integrations.md#rabbitmq) – RabbitMQ 凭证设置和延迟插件详情
