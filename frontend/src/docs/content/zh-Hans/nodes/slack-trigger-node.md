# Slack Trigger

**Slack Trigger** 节点是一个零输入入口点，用于接收 Slack Events API webhook 并自动启动工作流。它处理 Slack 的 URL 验证挑战，并使用签名密钥验证请求签名。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.event`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 包含签名密钥的 `slack_trigger` 凭证 |

## 设置指南

### 1. 创建 `slack_trigger` 凭证

1. 前往 **Settings → Credentials → New Credential**
2. 选择类型 **Slack Trigger (Signing Secret)**
3. 粘贴来自 Slack App 的 **Signing Secret**：
   - 在 Slack 中：**App settings → Basic Information → App Credentials → Signing Secret**
4. 保存凭证

### 2. 将节点添加到工作流

1. 打开工作流画布
2. 从节点面板将 **Slack Trigger** 拖拽到画布上
3. 点击节点打开 Properties 面板
4. 选择你的 `slack_trigger` 凭证
5. 复制面板中显示的 **Webhook URL**

### 3. 配置你的 Slack App

1. 在 Slack App 设置中前往 **Event Subscriptions**
2. 开启 **Enable Events**
3. 将 Webhook URL 粘贴到 **Request URL** 字段中
4. Slack 会发送 URL 验证挑战 — Heym 会在毫秒级内自动响应
5. 该字段变为绿色：✓ Verified
6. 订阅你需要的 **Bot Events**（例如 `message.channels`、`reaction_added`）
7. 保存更改，如有提示请将应用重新安装到你的工作区

## 输出字段

节点触发后，下游节点可以访问：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.event` | 完整的 Slack 事件对象 |
| `$nodeLabel.event.type` | 事件类型（例如 `"message"`、`"reaction_added"`） |
| `$nodeLabel.event.text` | 消息文本（适用时） |
| `$nodeLabel.event.user` | 触发事件的 Slack 用户 ID |
| `$nodeLabel.event.channel` | 频道 ID |
| `$nodeLabel.event.ts` | 事件时间戳 |
| `$nodeLabel.headers` | 来自 Slack 的已清理 HTTP headers |
| `$nodeLabel.triggered_by` | Trigger 来源标签（`"Slack"`） |
| `$nodeLabel.trigger_node_id` | 接收 Slack 事件的画布节点 ID |

## 示例工作流

**Slack 消息 → LLM 回复 → Slack 发送：**

```
slackTrigger → llm → slack
```

- **slackTrigger** 标签：`slackEvent`
- **LLM** 用户消息：`"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** 消息：`$llm.text`

## 安全性

- 使用你的签名密钥通过 **HMAC-SHA256** 验证请求
- 超过 **5 分钟** 的时间戳将被拒绝（防止重放攻击）
- 敏感 headers（`x-slack-signature`、`authorization` 等）在到达下游节点之前会被剥离
- 如果未设置凭证，节点将在无验证的情况下运行 — 仅建议用于本地测试

## 备注

- Heym 会立即响应 `200 OK` 并在后台运行工作流 — 这满足了 Slack 的 3 秒响应要求
- Webhook URL 派生自节点 ID，即使工作流重命名也永远不会改变
- 每个工作流只需要一个 `slackTrigger` 节点；在下游使用 **Switch** 或 **Condition** 节点来路由不同的事件类型
