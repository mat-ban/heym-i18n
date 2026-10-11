# Discord

**Discord** 节点通过 Incoming Webhook 向 Discord 频道发送消息。可用于告警、工作流通知、类机器人回复以及错误上报。

## 概览

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.status`、`$nodeLabel.response`、`$nodeLabel.message`、`$nodeLabel.username`、`$nodeLabel.avatar_url` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 包含 incoming webhook URL 的 `discord` 凭证 |
| `message` | expression | 发出的消息文本。支持 [expressions](../reference/expression-dsl.md)。 |
| `username` | expression | 可选的显示名称覆盖，仅用于本条消息 |
| `avatarUrl` | expression | 可选的头像 URL 覆盖，仅用于本条消息 |

## 设置

1. 创建 [Discord Webhook 凭证](../reference/integrations.md#discord)
2. 将 **Discord** 节点添加到你的工作流
3. 选择该凭证
4. 将 `message` 设置为发出的文本，或基于上游数据构建的模板
5. 可选地覆盖显示 `username` 和 `avatarUrl`

## 示例

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## 输出字段

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.status` | Discord 返回的 HTTP 状态码，成功时通常为 `204` |
| `$nodeLabel.response` | Discord webhook 返回的原始响应体 |
| `$nodeLabel.message` | Heym 发送的消息文本 |
| `$nodeLabel.username` | 随 webhook 发送的用户名（如提供） |
| `$nodeLabel.avatar_url` | 随 webhook 发送的头像 URL（如提供） |

## 常见模式

- 当你希望在交互回复之外额外向频道发布消息时，可与 [Discord Trigger](./discord-trigger-node.md) 搭配使用
- 从 [Error Handler](./error-handler-node.md) 发送失败通知
- 发布由 [LLM](./llm-node.md) 或 [Agent](./agent-node.md) 生成的摘要

## 出口安全

- 凭证中存储的 webhook URL 必须使用 `http://` 或 `https://`，且只能解析到公共地址。回环、私有、链路本地、组播以及云元数据目标均会被阻止。
- Heym 会校验解析后的地址，并在发送前固定连接目标，因此 DNS 应答无法在检查后将请求转移到内部地址。防护生效期间会禁用环境代理，且不会跟随重定向。
- 需要向内部 webhook 接收端发送消息的部署，可在受信任的自托管实例上设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在托管或多租户部署中请保持默认值。

**v0.0.109 升级说明：** 此检查是 Discord 新增的。若凭证的 webhook URL 指向回环或私有地址，除非启用上述设置，否则将被拒绝。

## 相关

- [Discord Trigger](./discord-trigger-node.md) – 从传入的 Discord 交互启动工作流
- [Third-Party Integrations](../reference/integrations.md) – Discord 凭证设置
- [Credentials Tab](../tabs/credentials-tab.md) – 添加和管理 `discord` 凭证
- [Node Types](../reference/node-types.md) – 所有节点类型概览
