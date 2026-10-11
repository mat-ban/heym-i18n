# Telegram Trigger

**Telegram Trigger** 节点是一个零输入入口点，当你的 Telegram 机器人收到 webhook 更新时，它会启动一个工作流。可将其用于聊天机器人、支持工单分流、类斜杠命令，或应扇入下游 AI 与集成节点的内联按钮回调。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.update`、`$nodeLabel.message`、`$nodeLabel.callback_query`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` 凭证，包含机器人 token 以及可选的 webhook secret token |

## 设置指南

### 1. 创建 `telegram` 凭证

1. 前往 **Settings → Credentials → New Credential**
2. 选择类型 **Telegram Bot**
3. 粘贴来自 BotFather 的 **Bot Token**
4. 如果你希望 Telegram 发送匹配的验证 header，可选择设置 **Webhook Secret Token**
5. 保存凭证

### 2. 将节点添加到你的工作流

1. 将 **Telegram Trigger** 拖到画布上
2. 选择该节点以打开 Properties 面板
3. 选择你的 `telegram` 凭证
4. 复制节点面板中显示的 **Webhook URL**

### 3. 在 Telegram 中注册 Webhook

使用 Bot API 的 `setWebhook` 方法，并传入节点中的 URL：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

如果你在 Heym 中配置了 secret token，请在设置 webhook 时发送相同的值：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## 输出字段

节点触发后，下游节点可以访问：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.update` | 完整的 Telegram update payload |
| `$nodeLabel.message` | update 中主要的类消息对象 |
| `$nodeLabel.message.text` | 传入消息文本 |
| `$nodeLabel.message.chat.id` | 用于下游回复的 Chat ID |
| `$nodeLabel.message.from.id` | Telegram 用户 ID |
| `$nodeLabel.callback_query` | 当 update 来自内联键盘时的回调 payload |
| `$nodeLabel.headers` | 经过清理的 webhook headers |
| `$nodeLabel.triggered_by` | Trigger 来源标签（`"telegram"`） |
| `$nodeLabel.trigger_node_id` | 接收 Telegram update 的画布节点 ID |
| `$nodeLabel.triggered_at` | 本次工作流执行的 ISO 时间戳 |

## 示例工作流

**Telegram 消息 → LLM → Telegram 回复**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** 标签：`telegramEvent`
- **LLM** 用户消息：`"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId：`$telegramEvent.message.chat.id`

## 安全

- 如果你的凭证包含 `secret_token`，Heym 会在运行工作流之前验证 `x-telegram-bot-api-secret-token`。
- 敏感请求 headers 会在 payload 到达下游节点之前被移除。
- webhook URL 对于节点 ID 是静态的，因此只有当节点本身发生变化时，你才需要重新注册它。

## 相关

- [Telegram Node](./telegram-node.md) – 发送回复或出站通知
- [Triggers](../reference/triggers.md) – 所有工作流入口点概览
- [Third-Party Integrations](../reference/integrations.md) – Telegram 凭证设置
- [Credentials Tab](../tabs/credentials-tab.md) – 添加和管理 `telegram` 凭证
