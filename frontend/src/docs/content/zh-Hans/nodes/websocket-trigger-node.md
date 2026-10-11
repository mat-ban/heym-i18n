# WebSocket Trigger

**WebSocket Trigger** 节点会向外部 WebSocket 服务器发起出站客户端连接，并在选定的 socket 事件发生时启动工作流。它适用于行情推送、遥测数据或聊天后端等事件流场景。连接内部实时系统需要按下文所述启用私有 URL 例外配置。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 |
| 输出 | 1 |
| 输出 | `$nodeLabel.eventName`、`$nodeLabel.message`、`$nodeLabel.connection`、`$nodeLabel.close` |

## 重要行为

- 此节点**从 Heym 连接到另一个 WebSocket 服务器**。
- 它**不会**在 Heym 上暴露 WebSocket endpoint。
- 无需 [credential](../reference/credentials.md)。直接在节点上配置 URL、headers 和 subprotocols。
- Leader worker 会在后台保持连接打开，并在启用时自动重连。

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `websocketUrl` | string | 外部 `ws://` 或 `wss://` URL |
| `websocketHeaders` | JSON object string | 可选的握手 headers |
| `websocketSubprotocols` | string | 可选的逗号分隔 subprotocol 列表 |
| `websocketTriggerEvents` | array | `onMessage`、`onConnected`、`onClosed` 中的任意组合 |
| `retryEnabled` | boolean | 断开后是否重连 |
| `retryWaitSeconds` | integer | 重连前的等待时间 |

## 发出的事件

### `onMessage`

当从远端 socket 收到帧时触发。

常用字段：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.message.data` | 解析后的 JSON payload 或原始消息值 |
| `$nodeLabel.message.text` | 可用时的 UTF-8 解码文本 |
| `$nodeLabel.message.base64` | 以 base64 表示的二进制 payload |
| `$nodeLabel.message.sizeBytes` | Payload 大小 |
| `$nodeLabel.message.isJson` | 消息是否解析为 JSON |

### `onConnected`

当 socket 成功打开后触发。

常用字段：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | 首次连接为 `false`，后续重连为 `true` |
| `$nodeLabel.connection.subprotocol` | 协商后的 subprotocol |

### `onClosed`

当已建立的连接关闭时触发。

常用字段：

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`、`client` 或 `unknown` |
| `$nodeLabel.close.code` | WebSocket 关闭码 |
| `$nodeLabel.close.reason` | 关闭原因 |
| `$nodeLabel.close.wasClean` | 正常 `1000` 关闭时为 `true` |
| `$nodeLabel.close.reconnecting` | 节点是否会尝试重连 |

## Trigger 语义

- 一个活跃节点保持一条长期运行的外向 socket 连接。
- 该连接仅在 leader worker 上运行，类似于 [IMAP Trigger](./imap-trigger-node.md) 和 [RabbitMQ](./rabbitmq-node.md) 的接收模式。
- 如果启用了重连，Heym 会在连接断开后等待 `retryWaitSeconds`，然后再次打开 socket。
- 每个发出的事件都会创建一个独立的工作流运行，其 `trigger_source = "websocket"`。

## 出站安全

- 默认情况下，URL 必须使用 `ws://` 或 `wss://`，并且只能解析到公共地址。Loopback、私有、link-local、多播以及云元数据目标均会被阻止。
- Heym 会在每次重连时重新校验 DNS，校验每个解析出的地址，并直接连接到其中一个地址。在防护启用期间，环境代理和 WebSocket 重定向会被禁用。
- 永久性策略违规会停止 trigger，而不是无限重试。临时性 DNS 或网络故障仍会遵循节点的重试设置。
- 支持 `Authorization`、`Origin`、`User-Agent` 以及自定义数据 headers。`Origin` 通过 WebSocket 客户端的专用选项发送。`Host`、`Connection`、`Upgrade` 和 `Sec-WebSocket-*` headers 不可覆盖。
- 有意连接内部服务的可信自托管部署可以设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在托管或多租户部署中请保持默认值。

**v0.0.105 升级说明：** 此实例级策略现在还会保护 Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、自定义 LLM 执行与模型发现、AI assistant、guardrails 以及 RAG embeddings 所使用的源自 credential 的目标地址。指向 loopback、私有或 link-local 地址的现有 credential 将被拒绝，除非在可信自托管实例上启用了 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在防护启用期间，受防护的 HTTP 客户端会忽略 `HTTP_PROXY` 和 `HTTPS_PROXY`；启用例外配置后会恢复它们。通过 `SSL_CERT_FILE` 或 `SSL_CERT_DIR` 配置的运维方 CA 证书包仍然受支持。ClickHouse 会在连接打开前进行检查，但不会在拨号时固定地址，因为 clickhouse-connect 自带 urllib3 传输层。

## 示例工作流

**外部事件流 → 过滤 → 通知**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** 标签：`streamEvent`
- **Condition**：`$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** 消息：`"Realtime alert: $streamEvent.message.data.title"`
## 示例节点 JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## 相关内容

- [Trigger](../reference/triggers.md) – 后台 Trigger 架构与 `trigger_source`
- [WebSocket 发送](./websocket-send-node.md) – 从工作流步骤向外部 socket 推送数据
- [节点类型](../reference/node-types.md) – 所有节点概览
- [第三方集成](../reference/integrations.md) – 哪些节点使用凭证，哪些不使用
