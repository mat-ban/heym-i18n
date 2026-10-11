# LLM

**LLM** 节点使用语言模型处理文本或生成图像。它支持文本生成、视觉（图像输入）、图像生成、结构化 JSON 输出，以及针对受支持文本模型的提供商原生 **Batch API** 执行。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1，启用批处理模式时额外提供可选的 `batchStatus` |
| 输出 | `$nodeLabel.text`（文本）、`$nodeLabel.image`（图像），或批处理结果字段（如 `$nodeLabel.results`） |

## 参数

### 凭证与模型

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 来自 [Credentials](../tabs/credentials-tab.md) 的 LLM 凭证 |
| `model` | string | 模型名称（例如 `gpt-4o`、`gemini-2.5-flash-lite`、用于图像的 `nanobanana`） |
| `fallbackCredentialId` | UUID（可选） | 主凭证失败时使用的备用凭证 |
| `fallbackModel` | string（可选） | 主模型失败时使用的备用模型 |

如果主凭证或模型返回错误，节点会在失败前自动使用备用凭证和模型重试。

Heym 还会从所选凭证和模型检查 **批处理能力**。批处理模式适用于：

- OpenAI 凭证
- 自定义 / OpenAI 兼容凭证，其 Endpoint 暴露所需的 `/v1/files` 和 `/v1/batches` API

如果所选提供商或模型不支持批处理执行，Properties 面板会直接显示该信息并禁用开关。

### Prompt（文本模式）

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `systemInstruction` | string | 系统 Prompt。支持[表达式](../reference/expression-dsl.md)。 |
| `userMessage` | string | 用户消息。默认值：`$input.text` |
| `temperature` | number | 0.0–2.0（默认值：0.7） |
| `maxTokens` | number | 最大响应 Token 数（可选） |
| `requestTimeoutSeconds` | number | 等待模型响应超时前的最大秒数（默认值：60）。对于较慢或自托管的提供商（LiteLLM、vLLM、本地模型），请调高该值。 |

### 图像与输出

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | 文本或图像生成 |
| `imageInputEnabled` | boolean | 在用户消息中包含图像（视觉） |
| `imageInput` | expression | Base64 数据 URL 或图像 URL |
| `jsonOutputEnabled` | boolean | 结构化 JSON 输出 |
| `jsonOutputSchema` | string | 用于结构化输出的 JSON Schema |
| `extraBodyEnabled` | boolean | 发送提供商特定的请求参数（默认值：`false`） |
| `extraBody` | string | 合并到 API 请求体中的 JSON 对象 |

### 推理模型（o1、o3）

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `isReasoningModel` | boolean | 为推理模型启用 |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | 推理深度 |

### 批处理模式

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | 使用提供商原生 Batch API 而非单请求执行 |

批处理模式仅在 **LLM** 节点上可用。它**不**适用于 [Agent 节点](./agent-node.md)。

启用批处理模式时：

- `outputType` 必须保持为 `text`
- `imageInputEnabled` 必须保持为 `false`
- `userMessage` 必须解析为**数组**
- 每个数组项必须解析为字符串或原始值

典型示例：

- `$input.items.map("item.text")`
- `$vars.promptList`

如果表达式解析为单个字符串而非数组，运行会在提供商调用开始前以验证错误失败。

## 批处理状态分支

启用批处理模式时，LLM 节点会暴露第二个输出句柄：`batchStatus`。

在批处理仍在运行时，可使用该分支进行通知、日志记录、Slack 消息或副作用操作。每当提供商状态发生有意义的变化时，该分支都会触发，包括如下规范化状态：

- `pending`
- `processing`
- `completed`
- `failed`

状态分支的 Payload 在下游节点中可通过 `$input` 访问，包含：

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

示例边：

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

示例状态映射器：

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## 批处理结果结构

成功完成后，主 LLM 输出包含：

- `$nodeLabel.text` – 拼接后的成功文本
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – 按原始顺序排列的逐项结果
- `$nodeLabel.usage`

`$nodeLabel.results` 中的每一项包含如下字段：

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

当 **JSON 输出**与批处理模式同时启用时，Heym 会分别解析每个成功项。解析后的对象按项暴露，并收集到 `parsedResults` 上。
## Responses API

**Use Responses API** 复选框会让节点的调用经由
[Responses API](https://platform.openai.com/docs/api-reference/responses) 路由，而不是 Chat
Completions。该选项默认关闭，且无论是否启用，节点的行为都相同：相同的 Prompt、
相同的 JSON 输出 schema、相同的结果结构。

它可与 OpenAI 凭据配合使用，也可与网关支持该 Endpoint 的自定义凭据配合使用，因此自托管或
代理部署也能使用它。使用 Google 凭据时该选项保持禁用，且不能与 [Batch 模式](#batch-status-branch) 组合使用——节点面板会在你运行任何内容之前说明给定凭据的适用情况。

如果该 Endpoint 在运行时不可用，节点会以指明原因的消息失败，而不是静默回退，因此配置为使用
Responses API 的节点始终运行在该 API 上。若要刻意回退到其他凭据或模型，请使用 **Fallback
Credential** 和 **Fallback Model** 字段；它们会继承此复选框，因此回退凭据也需要支持该 Endpoint。

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- 使用 [Input](./input-node.md) 提供 Prompt 时，在 `userMessage` 中使用 `$userPrompt.body.text`

## JSON Output

当 `jsonOutputEnabled` 为 true 时，LLM 返回符合 schema 的 JSON。通过 `$nodeLabel.fieldName` 访问字段。

## Extra Body

某些提供商接受标准 OpenAI 兼容字段未涵盖的请求参数，例如禁用模型的思考模式。在节点
属性中勾选 **Send extra request body** 并输入一个 JSON 对象。它会被合并到该节点发出的每个 API 请求中。

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **默认禁用。** 复选框关闭时，不会发送任何额外内容。
- 必须是 JSON **对象**。数组、标量或格式错误的文本会使节点以
  `Invalid extra body JSON` 失败，而不是被静默丢弃。
- 复选框旁的 **Format** 按钮会重新格式化 JSON，当文本无法解析时会变红并显示
  `Invalid`。
- 应用于主补全、回退模型尝试以及 Batch 模式请求。
  **不**应用于图像生成或 Guardrail 检查，它们使用不同的请求
  结构和单独的模型。
- `$` 表达式会在解析前被求值，因此 `{"max_tokens": $prev.limit}` 可用。由于
  这是文本替换，求值结果若包含双引号或换行符，会产生无效 JSON 并导致节点失败。

## Example – Text

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Example – Batch text

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Example – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

在节点属性中启用 **Guardrails**，以便在 LLM 调用之前拦截不安全的用户消息。完整参考请见 [Guardrails](../reference/guardrails.md)。

## Related

- [Agent Node](./agent-node.md) – 带工具调用的 LLM
- [Why Heym](../getting-started/why-heym.md) – LLM 步骤在 Agent 生命周期中的位置
- [Guardrails](../reference/guardrails.md) – 拦截不安全的内容类别
- [Node Types](../reference/node-types.md) – 所有节点类型概览
- [Expression DSL](../reference/expression-dsl.md) – 在 Prompt 中引用数据
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 带实时后端预览的可展开编辑器，用于 Prompt
- [Credentials Tab](../tabs/credentials-tab.md) – 添加 LLM API 密钥
- [Quick Start](../getting-started/quick-start.md) – 基础 LLM Workflow
