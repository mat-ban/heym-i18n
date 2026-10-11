# Discord Trigger

**Discord Trigger** 节点是一个零输入入口点，用于接收 Discord Interactions API webhook 并自动启动工作流。可将其用于斜杠命令、按钮、模态框以及其他应流入下游 AI 或集成节点的 Discord 应用交互。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.interaction`、`$nodeLabel.type`、`$nodeLabel.data`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 包含 Discord 应用公钥的 `discord_trigger` 凭证 |

## 设置指南

### 1. 创建 `discord_trigger` 凭证

1. 前往 **Settings → Credentials → New Credential**
2. 选择类型 **Discord Trigger (Public Key)**
3. 从 Discord Developer Portal 粘贴 **Application Public Key**：
   - **Your application → General Information → Public Key**
4. 保存凭证

### 2. 将节点添加到工作流

1. 将 **Discord Trigger** 拖到画布上
2. 选择该节点以打开 Properties 面板
3. 选择你的 `discord_trigger` 凭证
4. 复制节点面板中显示的 **Interactions URL**

### 3. 在 Discord 中注册 Interactions Endpoint

1. 打开 [Discord Developer Portal](https://discord.com/developers/applications)
2. 选择你的应用
3. 前往 **General Information** 或 **Interactions**
4. 将节点的 **Interactions Endpoint URL** 粘贴到 endpoint 字段中
5. Discord 会发送一个 `PING` 请求来验证该 endpoint，Heym 在验证签名后会自动响应
6. 保存你的更改

## 输出字段

节点触发后，下游节点可以访问：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.interaction` | 完整的 Discord interaction payload |
| `$nodeLabel.type` | Interaction 类型 |
| `$nodeLabel.data` | 命令、按钮或模态框 payload |
| `$nodeLabel.data.name` | 斜杠命令名称（如适用） |
| `$nodeLabel.data.options` | 斜杠命令选项数组 |
| `$nodeLabel.headers` | 经过清理的 webhook headers |
| `$nodeLabel.triggered_by` | Trigger 来源标签（`"Discord"`） |
| `$nodeLabel.trigger_node_id` | 接收 Discord interaction 的画布节点 ID |
| `$nodeLabel.triggered_at` | 此工作流执行的 ISO 时间戳 |

## 示例工作流

**Discord 斜杠命令 → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** 标签：`discordEvent`
- **LLM** 用户消息：`"Reply to this Discord command: $discordEvent.data.name"`
- **Output** 消息：`$llm.text`

## 安全性

- 使用你的应用公钥通过 **Ed25519** 验证请求
- 早于 **5 分钟** 的时间戳会被拒绝，以减少重放攻击
- 敏感 headers（`x-signature-ed25519`、`authorization` 等）会在数据到达下游节点之前被移除
- 该 trigger 需要有效的 `discord_trigger` 凭证；如果凭证缺失或无效，请求会被拒绝

## 注意事项

- Heym 会立即返回一个延迟的 Discord 响应，在后台运行工作流，并在 `Output` 节点产生内容时将最终工作流输出作为 Discord follow-up 发布
- interactions URL 派生自节点 ID，即使工作流被重命名也保持稳定
- 仅当你除了 interaction follow-up 之外还想要单独的 webhook post 时，才使用常规的 [Discord Node](./discord-node.md)
- 通常一个 `discordTrigger` 节点就足够了；在下游使用 **Switch** 或 **Condition** 来路由不同的 interaction 类型

## 相关

- [Discord Node](./discord-node.md) – 发送出站 Discord 消息
- [Triggers](../reference/triggers.md) – 所有工作流入口点概述
- [Third-Party Integrations](../reference/integrations.md) – Discord 凭证设置
- [Credentials Tab](../tabs/credentials-tab.md) – 添加和管理 `discord_trigger` 凭证
