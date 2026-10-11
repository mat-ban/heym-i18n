# 决策

**Decision** 节点会就运行的当前状态向决策模型提出带类型的问题，并返回概率。它不生成文本。当工作流需要一项可据以分支的判断时——例如路由、分诊、排序、验证，或对无法撤销的步骤进行门控——就使用它。

决策模型（也称为 *System One* 模型）是与 LLM 不同的一类模型。它没有 Prompt，没有系统指令，没有 temperature，也没有工具调用。你发送一个 **state** 以及一组 **questions** 映射，每个答案都会以一个数字返回，背后带有概率分布。由于一个答案只有几个 Token，与要求 [LLM](./llm-node.md) 生成 JSON 再解析相比，这些模型既快速又便宜。

如需生成文本，请使用 [LLM](./llm-node.md) 节点。如需调用工具的模型，请使用 [Agent Node](./agent-node.md)。

## 概览

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | 提供方响应原文——`$nodeLabel.answers.<id>`、`$nodeLabel.model`、`$nodeLabel.usage` |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `credentialId` | UUID | 一个 *Decision Model* 凭证。不是 LLM 凭证。 |
| `model` | string | 模型名称，例如 `jev-latest` |
| `state` | expression | 模型应读取的内容（默认 `$input.text`） |
| `questions` | array | 有序的问题行；至少一个 |
| `customBodyEnabled` | boolean | 发送手写的请求体，而非使用表单 |
| `customBody` | expression (JSON) | 开关打开时要发送的请求体 |
| `requestTimeoutSeconds` | number | 最长等待秒数（默认：60） |

### State

**State** 是模型所判断的情境。它接受字符串、对象或数组。

恰好包含一个表达式的字段会保留其自身类型，因此 `$input` 发送的是对象本身，而不是其文本。包含表达式的模板（`Ticket: $input.text`）会解析为字符串。为每个问题提供足够的信息以便作答：源文本、身份、关系、策略以及当前事实。

## 问题类型

每个问题都有一个 `id`、一个 `type`、`instructions`，以及取决于类型的判定标准。

`id` 是你的工作流读回答案的方式。它**绝不会发送给模型**，因此全部含义都必须体现在 `instructions` 中。写 `id: is_urgent` 搭配 `instructions: "Is it?"` 会让模型无从下手。

### Noul

某个条件是否成立。返回答案为 yes 的概率，从 0 到 1。

判定标准是可选的：**Yes means** 和 **No means** 描述每一侧涵盖的内容。接近 0.5 的值意味着模型认为 yes 和 no 的可能性大致相当——而不是“中等强度”。

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

使用 `$triage.answers.is_urgent.noul` 读取它。

### Choice

从你定义的选项集中选择一个选项。返回所选选项、完整分布，以及由此得出的置信度。

只要可能没有合适选项，就添加一个涵盖“以上都不是”的选项——模型无法选择你未提供的选项。

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

使用 `$triage.answers.department.choice`、`.probabilities.billing` 和 `.confidence` 读取它。

### Score

按照有序评分标准对状态进行评级。返回一个可能落在各等级**之间**的概率加权值，以及图例和分布。

等级从最低开始排列，至少两个，至多十个。每个等级都应描述一种具体情境，并能独立成立。

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

使用 `$triage.answers.frustration.score`、`.legend` 和 `.confidence` 读取它。

## Generate with AI

**Generate with AI** 会将一句简单的描述转换为建议的 state 模板和一组问题行。描述你想要判断的内容——“triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds”——并在将其添加到节点之前检查返回的结果。

起草由 LLM 完成，因此该对话框会要求提供 LLM 凭证。决策模型会在稍后工作流运行时回答这些问题。生成的 id 会与节点已持有的行进行去重，因此生成两次绝不会覆盖已有的答案键。

每次生成都会记录在 [Traces](../tabs/traces-tab.md) 标签页的 **Decision Questions** 来源下，与节点本身在运行时写入的 `decision.systemone` trace 并列。
## 自定义请求体

开启 **Custom request body** 后，将发送你自己编写的 JSON，而非表单。当某个 endpoint 的契约与表单构建的契约不同时，可使用此选项。

编辑器会以当前表单为初始内容，其中的表达式会在请求发送前解析。开启该开关后，State 字段和问题行将被忽略。无论哪种方式，响应都会原样传递，因此不同的契约只会产生不同的结构，供你的表达式读取。

## 输出

该节点会原样返回提供方返回的内容。不会重命名或扁平化任何内容。

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## 基于答案进行分支

[Switch](./switch-node.md) 节点会根据所选选项进行路由，而 [Condition](./condition-node.md) 节点可以将低置信度的案例发送到人工可见的位置：

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

带类型的答案保证的是结构，而不是真实性。请根据你自己的数据和后果来选择阈值，而不是照搬示例中的数字。

## Credential

在 [Credentials](../tabs/credentials-tab.md) 标签页中创建一个 **Decision Model** credential，包含：

- **Base URL** — endpoint，例如 `https://api.typesafe.ai`。Heym 会追加 `/v1/systemone`。
- **API Key** — 可选。无需密钥的 endpoint 可以留空。

编辑 credential 时，如果密钥字段留空，则会保留已存储的密钥；仅在需要替换时才重新输入。

同一个 credential 也可以评判 [Evals](../tabs/evals-tab.md) 运行：选择 **LLM-as-Judge** 后，将其选为 judge，decision model 会根据预期输出为每个答案评分。

Heym 默认阻止向私有地址和回环地址发起出站请求，因此你在 `localhost` 或私有网段上自行运行的 decision endpoint 需要设置 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。

Decision model 不会出现在 Heym 同步的 LLM 定价表中，因此这些调用的 [Traces](../tabs/traces-tab.md) 中的 **Cost** 列会保持为空。Token 数量仍会被记录，你可以通过 pricing override 添加自己的价格。

## 错误

| 情况 | 会发生什么 |
|-----------|--------------|
| 无效的 API key | 该节点会失败，并给出指明该 credential 的消息 |
| 格式错误的问题 | 提供方自身的字段级消息会被带入节点错误中 |
| 触发速率限制或过载 | 该节点会失败，并给出说明该情况是暂时性的消息 — 为此节点开启 [retry](../reference/features.md) 以渡过该情况 |
| 重复或空的问题 id | 该节点会在发送任何请求之前失败 |

## 相关内容

- [LLM Node](./llm-node.md) – 生成文本而非判断
- [Agent Node](./agent-node.md) – 使用工具收集证据，然后在此处进行判断
- [Switch Node](./switch-node.md) – 根据所选选项进行路由
- [Condition Node](./condition-node.md) – 基于置信度进行门控
- [Node Types](../reference/node-types.md) – 所有节点类型概览
- [Credentials](../reference/credentials.md) – Credential 类型和字段
- [Traces Tab](../tabs/traces-tab.md) – 检查 decision 调用和 token 使用情况
