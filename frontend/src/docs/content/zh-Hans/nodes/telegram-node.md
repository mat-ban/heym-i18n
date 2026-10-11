# Telegram

**Telegram** 节点通过 Telegram Bot API 发送消息。可用于聊天回复、运维告警、工作流状态更新，或任何需要向 Telegram 用户、群组或频道发送消息的下游步骤。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.status`、`$nodeLabel.ok`、`$nodeLabel.result` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 包含 bot token 的 `telegram` 凭证 |
| `chatId` | expression | 目标聊天、群组或频道 ID |
| `message` | expression | 发出的消息文本。支持[表达式](../reference/expression-dsl.md)。 |

## 设置

1. 创建 [Telegram Bot 凭证](../reference/integrations.md#telegram)
2. 将 **Telegram** 节点添加到你的工作流
3. 选择凭证
4. 将 `chatId` 设置为静态聊天 ID 或表达式，例如 `$telegramEvent.message.chat.id`
5. 将 `message` 设置为发出的文本或基于上游数据构建的模板

## 示例

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## 输出字段

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.status` | 成功时为 `"sent"` |
| `$nodeLabel.ok` | Telegram API 成功标志 |
| `$nodeLabel.result` | 来自 Telegram 的原始 `sendMessage` 结果对象 |
| `$nodeLabel.result.message_id` | Telegram 消息 ID |
| `$nodeLabel.result.chat.id` | Telegram 返回的目标聊天 ID |

## 常见模式

- 与 [Telegram Trigger](./telegram-trigger-node.md) 搭配使用，构建对话式机器人
- 从 [Error Handler](./error-handler-node.md) 发送错误通知
- 发布由 [LLM](./llm-node.md) 或 [Agent](./agent-node.md) 生成的摘要

## 相关

- [Telegram Trigger](./telegram-trigger-node.md) – 从传入的机器人消息启动工作流
- [第三方集成](../reference/integrations.md) – Telegram 凭证设置
- [Credentials 标签页](../tabs/credentials-tab.md) – 添加和管理 `telegram` 凭证
- [节点类型](../reference/node-types.md) – 所有节点类型概览
