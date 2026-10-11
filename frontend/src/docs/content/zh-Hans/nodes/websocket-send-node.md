# WebSocket 发送

**WebSocket Send** 节点会向外部 WebSocket 服务器打开一个出站客户端连接，发送一条消息，然后关闭连接。当工作流需要将事件推送到实时系统，而又不想暴露 Heym 所拥有的 socket endpoint 时，可以使用该节点。

## 概览

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.status`、`$nodeLabel.url`、`$nodeLabel.message_type`、`$nodeLabel.size_bytes` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `websocketUrl` | string / expression | 外部 `ws://` 或 `wss://` URL |
| `websocketHeaders` | JSON object string / expression | 可选的握手 headers |
| `websocketSubprotocols` | string | 可选的逗号分隔 subprotocol 列表 |
| `websocketMessage` | expression | 要发送的 Payload |

## 消息序列化规则

- 如果 `websocketMessage` 解析为 **string**，Heym 会发送一个文本帧。
- 如果它解析为 **object**、**array**、**number**、**boolean** 或 `null`，Heym 会将其序列化为 JSON 文本。
- 如果它解析为 **bytes**，Heym 会发送一个二进制帧。
- 诸如 `$input` 之类的完整表达式会在序列化之前保留原生类型。

## 输出字段

| 表达式 | 描述 |
|------------|-------------|
| `$nodeLabel.status` | 成功时为 `"sent"` |
| `$nodeLabel.url` | 解析后的目标 URL |
| `$nodeLabel.message_type` | `text`、`json` 或 `binary` |
| `$nodeLabel.size_bytes` | Payload 大小（以字节为单位） |
| `$nodeLabel.subprotocol` | 协商后的 subprotocol（如果存在） |
| `$nodeLabel.sent_at` | ISO 时间戳 |

## 示例工作流

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- **Set** 创建一个 payload 对象，例如 `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** 使用 `$payloadNode` 作为 `websocketMessage`
- **Output** 可以返回 `$socketSend.status`

## 示例节点 JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## 说明

- 该节点不需要 [credential](../reference/credentials.md)。
- 如果远程服务器需要 auth 或 tenant headers，请通过 `websocketHeaders` 传入。
- 当远程系统基于请求/响应而不是基于 socket 时，请使用 [HTTP](./http-node.md)。

## 出站安全

- 默认情况下，URL 必须使用 `ws://` 或 `wss://`，并且只能解析为公共地址。Loopback、private、link-local、multicast 以及 cloud-metadata 目标都会被阻止。
- Heym 会验证每一个解析后的地址，并直接连接到其中一个地址。在防护启用期间，环境代理和 WebSocket 重定向会被禁用。
- 支持 `Authorization`、`Origin`、`User-Agent` 以及自定义数据 headers。`Origin` 会通过 WebSocket 客户端的专用选项发送。`Host`、`Connection`、`Upgrade` 和 `Sec-WebSocket-*` headers 不能被覆盖。
- 有意连接到内部服务的受信任自托管部署可以设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在托管或多租户部署中请保持默认值。

**v0.0.105 升级说明：** 此实例级策略现在还会保护 Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、自定义 LLM 执行与模型发现、AI assistant、guardrails 以及 RAG embeddings 所使用的、源自 credential 的目标地址。除非在受信任的自托管实例上启用 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`，否则指向 loopback、private 或 link-local 地址的现有 credentials 都会被拒绝。当防护开启时，受防护的 HTTP 客户端会忽略 `HTTP_PROXY` 和 `HTTPS_PROXY`；启用 opt-out 后会恢复它们。通过 `SSL_CERT_FILE` 或 `SSL_CERT_DIR` 配置的 Operator CA bundles 仍然受支持。ClickHouse 会在连接打开前被检查，但不会在拨号时被固定，因为 clickhouse-connect 自带其自己的 urllib3 transport。

## 相关内容

- [WebSocket Trigger](./websocket-trigger-node.md) – 监听外部 socket 并在事件发生时触发工作流
- [Node Types](../reference/node-types.md) – 集成节点概览
- [Expression DSL](../reference/expression-dsl.md) – 构建动态 JSON payloads
- [Third-Party Integrations](../reference/integrations.md) – 基于 credential 与直接配置的集成
