# Slack

**Slack** 节点通过 Incoming Webhook 向 Slack 频道发送消息。可用于通知、告警和错误上报。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出行为 | 透传输入 |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 Slack 凭证（webhook URL） |
| `message` | expression | 消息文本。支持 [expressions](../reference/expression-dsl.md)。 |

## 设置

1. 在您的 Slack 工作区中创建 Incoming Webhook
2. 在 Credentials 标签页中添加一个包含 webhook URL 的 Slack 凭证
3. 在节点中引用该凭证

## 示例

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

与 [Error Handler](./error-handler-node.md) 配合使用以发送失败通知：
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## 出口安全

- 存储在凭证中的 webhook URL 必须使用 `http://` 或 `https://`，并且只能解析到公共地址。回环地址、私有地址、链路本地地址、组播地址以及云元数据目标均会被阻止。
- Heym 会验证解析后的地址，并在发送前固定连接目标，因此 DNS 应答无法在检查后将请求转移到内部地址。在防护机制启用期间，环境代理会被禁用，并且不会跟随重定向。
- 需要向内部 webhook 接收端发送请求的部署，可在受信任的自托管实例上设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在托管或多租户部署中请保持默认值。

**v0.0.109 升级说明：** 此检查是 Slack 新增的。除非启用上述设置，否则 webhook URL 指向回环地址或私有地址的凭证将被拒绝。

## 相关

- [Node Types](../reference/node-types.md) – 所有节点类型概览
- [Error Handler](./error-handler-node.md) – 在 Workflow 失败时发送 Slack 消息
- [Credentials Tab](../tabs/credentials-tab.md) – 添加 Slack webhook
