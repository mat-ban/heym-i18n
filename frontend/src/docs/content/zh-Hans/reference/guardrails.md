# Guardrails

Guardrails 让你在用户消息到达 [LLM](../nodes/llm-node.md) 或 [Agent](../nodes/agent-node.md) 节点之前，拦截不安全或不需要的消息。当消息匹配某个被屏蔽的类别时，节点会抛出错误而不是继续执行，你可以通过 [Error Handler](../nodes/error-handler-node.md) 节点捕获该错误。

## 启用 Guardrails

打开 **LLM** 或 **AI Agent** 节点的 Properties 面板，滚动到 **Enable Guardrails** 开关（盾牌图标）。勾选该复选框后会显示配置区域。

## Guardrail Credential 与 Model

启用 guardrails 后，你**必须**为内容安全选择一个 **credential 和 model**。Guardrail 检查使用节点中所选的 credential 和 model —— 没有回退机制，也不使用环境变量。请使用 OpenAI 或 Google credential 以获得可靠的内容过滤，尤其是当你的主模型使用自定义提供商（例如 Zhipu、GLM）时，这些提供商可能不支持 guardrails 或返回 API 错误（例如 404）。

在 Guardrail Credential 和 Guardrail Model 均被选中之前，工作流无法运行。

## 屏蔽类别

选择一个或多个要屏蔽的类别。匹配任何已勾选类别的消息都会被拒绝。

| 类别 | 屏蔽内容 |
|---|---|
| **Violence** | 暴力、威胁或造成身体伤害的内容 |
| **Hate Speech** | 歧视、种族主义或偏执言论 |
| **Sexual Content** | 露骨的性内容或场景 |
| **NSFW / Profanity** | 任何语言中的粗俗语言、脏话、露骨侮辱语和成人俚语 |
| **Self-Harm** | 自杀、自残或相关内容 |
| **Harassment** | 人身攻击、侮辱、欺凌或恐吓 |
| **Illegal Activity** | 实施非法行为的指导说明 |
| **Political Extremism** | 极端主义政治内容或暴力宣传 |
| **Spam / Phishing** | 垃圾信息、钓鱼或社会工程 |
| **Personal Data Request** | 索取私人或可识别个人身份的信息 |
| **Prompt Injection** | 试图覆盖系统指令、注入恶意 prompt 或操纵模型行为 |

## 敏感度

**Sensitivity** 设置控制违规检测的严格程度：

| 级别 | 行为 |
|---|---|
| **Low** | 连边缘或模糊的情况也会标记 |
| **Medium** *（默认）* | 标记明确的违规；忽略边缘情况 |
| **High** | 仅标记极端、明确无误的违规 |

## 检测工作原理

检测使用**所选的 guardrail credential 和 model**：

- **OpenAI credentials** —— 对其原生覆盖的五个类别（Violence、Hate Speech、Sexual Content、Self-Harm、Harassment）使用 [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)（免费、快速、不消耗 token）。其余类别使用所选 guardrail model 通过 LLM 分类调用进行检查。
- **Google / 自定义 credentials** —— 所有类别均使用所选 guardrail credential 和 model 通过 LLM 分类调用进行检查。

当你的主模型使用自定义提供商（例如 Zhipu、Cerebras）可能返回 404 或其他 API 错误时，请为 guardrails 选择 **OpenAI 或 Google credential**。

## 错误格式

当 guardrail 被触发时，节点会抛出错误，消息为：

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

节点结果的 `output` 还包含 `guardrail_violated_categories`（违规类别标签的数组），以便 Debug Panel 和 Execution History 清晰地显示 "Blocked by: X, Y"。

使用节点的 **Continue on error** 选项（或 [Error Handler](../nodes/error-handler-node.md)）在 guardrails 触发时将工作流路由到回退分支。

## 示例工作流

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## 注意事项

- **不重试**：Guardrail 违规是有意屏蔽，即使节点启用了 "Retry on failure" 也绝不会重试。
- 无需数据库迁移 —— guardrail 设置与其他节点数据一起存储在 workflow 的节点 JSON 中。
- Guardrails 检查的是解析后的**用户消息**（在模板表达式求值之后），而不是原始模板。
- 在启用 guardrails 的情况下设置**无类别**等同于禁用 —— 不执行任何检查。
- 在 **Low** 敏感度下，LLM 分类始终运行（最佳多语言覆盖）。OpenAI credentials 还会额外运行 Moderation API。
- 在 **Medium/High** 敏感度下，OpenAI credentials 对原生支持的类别使用 Moderation API，其余类别使用 LLM 分类。Google/自定义 credentials 始终使用 LLM 分类。
- LLM 分类**与语言无关** —— 它能检测土耳其语、阿拉伯语、俄语、西班牙语及其他语言中的违规。
