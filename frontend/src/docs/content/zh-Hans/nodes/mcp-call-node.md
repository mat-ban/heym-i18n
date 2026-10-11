# MCP 调用节点

**MCP Call** 节点直接调用特定的 [Model Context Protocol (MCP)](https://modelcontextprotocol.io) 工具，无需由 LLM 决定调用哪个工具。当你明确知道要调用哪个工具，并希望获得确定性的单步执行时，请使用此节点。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.result` |

## 使用场景

在以下情况下使用 MCP Call 节点：
- 你在设计时明确知道要调用哪个 MCP 工具
- 你不需要 LLM 在多个工具之间进行选择
- 你希望为单次工具调用使用轻量级、确定性的替代方案，而非 agent 节点

当应由 LLM 决定调用哪些工具，或你需要多步推理时，请改用 [Agent 节点](./agent-node.md)。

> MCP Call 节点**不能**作为工具连接到 agent 节点。

## 连接配置

该节点连接到单个 MCP 服务器。选择一种传输方式并填写相应字段。

### SSE / Streamable HTTP

| 字段 | 描述 |
|-------|-------------|
| `transport` | `sse` 或 `streamable_http` |
| `url` | MCP 服务器的完整 URL（例如 `https://mcp.example.com/sse`）。支持 DSL 表达式。 |
| `headers` | HTTP 请求头的 JSON 对象（例如 `{"Authorization": "Bearer ..."}`） |
| `timeoutSeconds` | 每次连接的超时时间（秒）（默认值：30） |

### stdio

| 字段 | 描述 |
|-------|-------------|
| `transport` | `stdio` |
| `command` | 要运行的可执行文件（例如 `npx`） |
| `args` | 参数的 JSON 数组（例如 `["-y", "@modelcontextprotocol/server-filesystem"]`） |
| `env` | 环境变量的 JSON 对象（例如 `{"API_KEY": "..."}`） |
| `timeoutSeconds` | 每次连接的超时时间（秒）（默认值：30） |

## 工具选择

1. 填写连接字段。
2. 点击 **Fetch Tools** —— 节点将连接到 MCP 服务器并列出可用工具。
3. 从下拉列表中选择一个工具。

**工具选择为必填项。** 未选择工具时，节点将不会执行。

## 参数

选择工具后，节点会为工具输入 schema 中定义的每个参数渲染一个输入字段。每个字段接受：
- 静态值：`10`
- DSL 表达式：`$userInput.body.text`

必填参数会以 `*` 标记。

## 输出

| 字段 | 描述 |
|-------|-------------|
| `$nodeLabel.result` | 工具结果。如果响应是有效的 JSON，则为解析后的对象。否则为字符串。 |

## 示例

在 SSE MCP 服务器上调用 `search` 工具，并传入用户的查询：

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

在下游访问结果：

```
$searchCall.result.items   ← 如果 result 是 JSON 对象
$searchCall.result         ← 如果 result 是纯字符串
```

## 注意事项

- 节点在调用工具之前，会解析 `url`、`headers`、`env` 以及所有 `toolArguments` 值中的 DSL 表达式。
- 节点级别的 `timeoutSeconds` 适用于整体执行；`connection.timeoutSeconds` 适用于 MCP 会话本身。
- 如果 MCP 服务器不可用或返回错误，节点将失败，错误消息可在 workflow trace 中查看。
