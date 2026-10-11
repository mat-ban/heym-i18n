# HTTP

**HTTP** 节点使用 cURL 语法发起 HTTP 请求。它既可作为工作流的起点（无入边），也可接收来自上游节点的输入。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 0 或 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.status`、`$nodeLabel.body`、`$nodeLabel.headers` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `label` | string | 节点标识符（camelCase） |
| `curl` | string | cURL 命令（例如 `curl -X GET https://api.example.com`） |

## 响应格式

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## 访问响应

- `$httpNode.status` – HTTP 状态码
- `$httpNode.body` – 响应体（字符串或解析后的 JSON）
- `$httpNode.body.fieldName` – 访问 JSON 字段
- `$httpNode.headers` – 响应头

## 示例

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

使用 cURL 语法，通过 `-H` 设置请求头，通过 `-d` 设置 POST 请求体等。表达式可用于 curl 字符串中的任意位置，包括 URL、请求头或整行请求头。[Header 凭证](../reference/credentials.md)会解析为 `key: value`，因此 `-H "$credentials.MyApiKey"` 会发送完整的请求头：

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

表达式内部的引号和空格属于表达式本身，而非 cURL 命令，因此接受字符串参数的方法可以内联使用：

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## 使用凭证进行身份验证

`$credentials.Name` 会针对每种[凭证](../reference/credentials.md)类型解析为不同的值，因此请求头行取决于凭证类型：

| 凭证类型 | `$credentials.Name` 解析为 | 请求头 |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI、Custom、Cohere | 原始 API key | `-H "Authorization: Bearer $credentials.Name"` |
| Google | 原始 API key | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | 原始 API key | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets、Google Drive | 全新的 OAuth 访问 Token，过期时自动刷新 | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub、Notion、Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Bearer 凭证本身已带有 `Bearer ` 前缀，因此再添加一个会发送 `Bearer Bearer …`。Google Sheets 和 Google Drive 凭证允许你在其节点未覆盖的范围内调用 Google API（例如向电子表格添加标签页），前提是在凭证被授予的 scope 内。当名称不是纯标识符时（包含 `-`、以数字开头或为保留字），请使用方括号形式：`-H "Authorization: $credentials["my-api-key"]"`。

当 [AI Assistant](../reference/ai-assistant.md) 或 [Chat](../tabs/chat-tab.md) 构建需要身份验证的 HTTP 请求，且没有专用节点覆盖该服务时，它会询问使用哪个凭证。选择一个凭证，如果 API 期望不同的请求头名称，可修改预填的请求头名称，它会为你编写请求头行。助手只能看到凭证的名称和类型，永远看不到其值。如果你没有合适的凭证，该问题会提供创建凭证的选项。到达节点输出的密钥（例如已发送的 `request.headers`）会在运行结果中被遮蔽。

## 出口安全

- 默认情况下，URL 必须使用 `http://` 或 `https://`，且只能解析为公共地址。Loopback、私有、链路本地、组播以及云元数据目标均被阻止。
- Heym 会验证解析后的地址，并将连接目标固定，以防止 DNS 重绑定。防护激活期间，环境代理将被禁用。默认不跟随重定向；添加 cURL 的 `-L` 选项以跟随重定向。启用后，每个重定向跳转都会根据相同的公共地址策略进行检查，并在连接前固定。
- 有意连接内部服务的受信任自托管部署可设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在托管或多租户部署上请保持默认值。

**v0.0.105 升级说明：** 此实例级策略现在还会保护 Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、自定义 LLM 执行与模型发现、AI 助手、guardrails 以及 RAG embeddings 所使用的凭证派生目标。指向 loopback、私有或链路本地地址的现有凭证将被拒绝，除非在受信任的自托管实例上启用了 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。防护开启期间，受防护的 HTTP 客户端会忽略 `HTTP_PROXY` 和 `HTTPS_PROXY`；启用退出选项后会恢复它们。通过 `SSL_CERT_FILE` 或 `SSL_CERT_DIR` 配置的运维方 CA 证书包仍然受支持。ClickHouse 在连接打开前进行检查，但不会在拨号时固定，因为 clickhouse-connect 自带 urllib3 传输层。

## 相关

- [节点类型](../reference/node-types.md) – 所有节点类型概览
- [Triggers](../reference/triggers.md) – 将 HTTP 作为工作流入口点
- [凭证标签页](../tabs/credentials-tab.md) – 为需要身份验证的请求添加 API key
