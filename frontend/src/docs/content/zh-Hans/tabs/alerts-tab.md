# Alerts 标签页

**Alerts** 标签页让您定义基于时间窗口的阈值条件，并在条件被触发时收到通知。Heym 已经记录了执行结果、运行时长和 LLM 花费，但它从不主动告知这些信息。Alert 就是您要求它主动通知的方式。

每个 alert 都在您选择的**时间窗口**上进行评估，绝不会基于单个事件。一次失败的运行只是噪声。十分钟内十二次失败的运行才是事故。

## Alert 类型

| 类型 | 它回答的问题 | 数字来源 |
|---|---|---|
| **Error threshold** | 在窗口内失败次数是否超过 N 次？ | [执行历史](../reference/execution-history.md)中状态为错误的记录行 |
| **Workflow duration** | 在窗口内运行是否比预期更慢？ | 执行时间，按最大值、平均值或第 95 百分位聚合 |
| **Token / USD cost** | 在窗口内花费是否超出预算？ | [LLM traces](./traces-tab.md) 加上 LLM 成本表 |
| **Execution count** | 运行频率是否远超应有水平？ | 执行历史记录行数 |

### Error threshold

统计窗口内的失败运行次数，当计数达到您的阈值时触发。由于它是在窗口内计数而非挂钩每次失败，单个瞬时错误不会向您发送告警。

### Workflow duration

测量窗口内的运行时长。可选择 **max**（最慢的一次运行）、**average** 或 **p95**。p95 数值使用与 [Analytics 标签页](./analytics-tab.md)相同的百分位计算方式，因此 alert 和延迟图表在同一窗口内永远不会出现不一致。

**窗口内的最小运行次数**确保结果可靠。在几乎为空的窗口中，最慢的运行就是那唯一一次运行，因此设置一个最小值（例如 3）可以防止 alert 因噪声而触发。

### Token / USD cost

汇总窗口内的 LLM 花费，可以是总 token 数或美元金额。美元金额通过 [Traces 标签页](./traces-tab.md)和 [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)所使用的同一价格表换算，因此成本 alert 和成本页面始终一致。

当范围为您的所有 workflow 时，这包括在 workflow 之外发起的 LLM 调用，例如 [Chat 标签页](./chat-tab.md)和 [AI Assistant](../reference/ai-assistant.md)。编码 agent 的使用（Codex、OpenCode）不包含在内。

没有价格记录的模型会在 alert 的上下文中报告为未定价，而不会被静默计为零。

### Execution count

统计窗口内任意状态的运行次数。这是能捕获 trigger 异常的那一类：一个通常每小时运行 20 次的 workflow 突然运行了 2,000 次。触发记录包含按 trigger 来源的细分，因为这通常就是"为什么会发生这种情况"的答案。

## 范围

一个 alert 监视**一个 workflow** 或**您的所有 workflow**。

"您的所有 workflow"指 alert 所有者可以访问的每个 workflow。它刻意不表示 Heym 实例上的每个 workflow：alert 可以被共享，而共享一个 alert 不应向某人提供他们无法打开的 workflow 的聚合数据。

## 向导

创建 alert 需要经过五个步骤。

1. **Type** — 从上述四种类型中选择一种。
2. **Scope** — 一个 workflow，或全部。
3. **Condition** — 时间窗口，以及该类型对应的阈值字段。
4. **Response** — 触发时运行什么，以及多久持续通知您一次。
5. **Review** — 命名，并查看回测。

### 回测

Review 步骤在您保存前回答了真正重要的问题：*在过去 24 小时内，这个 alert 会触发多少次？*

它会报告触发次数以及相对于您阈值的最高观测值。如果它显示该条件会触发 400 次，您可以在保存前修正阈值，而不是在被告警之后。您可以将回溯范围扩大到 3 天或 7 天。

## AI 起草

第一步的顶部有一个输入框，您可以用自然语言描述您的需求：

> Warn me if the invoice sync fails more than 5 times in 10 minutes

Heym 会将其转换为 alert 定义，填充它能填充的每个步骤，并跳转到已标记的 AI 填充字段处，让您确认而非重新输入。完整的请求会直接带您到 Review。

**部分请求仍会推动您前进。** 例如只说"warn me if it fails 5 times"，您会得到一个 error threshold alert，计数已填充，其余使用默认值，向导会打开在仍需要您操作的第一步：在这个例子中是 Scope，因为没有指定 workflow。顶部会有一条说明指出还有哪些需要决定。它绝不会阻止 Next 或 Create。

当模型指定了一个您无法访问的 workflow，或返回的条件缺少字段时，同样适用。合理的部分会被保留，其余回退到该 alert 类型的默认值，您再从中调整。这里没有任何东西绕过验证：向导自身的规则和 API 在您保存时都会重新检查 alert。

## 重复行为

一旦告警触发，它便进入已触发状态。接下来会发生什么，取决于您在步骤 4 中的选择。

- **仅通知一次，直到恢复**（默认）——触发一次后，在条件持续期间保持静默。当指标回落至阈值以下时，告警恢复为 OK 状态，并可再次触发。恢复是一种状态变化，而非事件：它不会创建触发记录，也不会运行通知 Workflow。
- **按间隔持续通知**——只要条件持续存在，每隔 N 分钟再次触发。

默认行为的存在是有原因的：一个每 60 秒检查一次的故障 Workflow，否则每小时将产生 60 次触发，这正是告警被静音的原因。

## 触发时运行 Workflow

步骤 4 为“触发时应该发生什么”提供了三种选择：

- **创建并分配新 Workflow**（默认）——保存告警的同时会创建一个名为 *“&lt;告警名称&gt; notification”* 的 Workflow 并建立关联。该 Workflow 自带一个输入节点，其字段与下方 Payload 完全一致，因此 `$alert.body.observed_value` 及其他字段可立即解析，您只需附加负责投递消息的节点即可。告警卡片上的 **Go to workflow** 可打开该 Workflow。这是默认选项，因为一个触发后毫无反应的告警很容易被忽视。
- **选择现有 Workflow**——运行您已构建好的 Workflow。
- **不做任何事**——触发仍会记录在标签页中，只是不会运行任何内容。

告警 Payload 作为该 Workflow 的输入 body 传入：

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### 是哪个 Workflow 产生了这个数值

`workflows` 是唯一出现 Workflow 的地方。它列出了所有对本次读数有贡献的 Workflow，每个都带有自己的 `value`——即该 Workflow 的错误数、运行次数、最慢运行时间（毫秒）或花费，具体取决于告警类型。该列表按 `value` 降序排列，因此 `workflows[0]` 是问题最严重的那个。

它**始终是一个数组**：在单 Workflow 范围内为单元素，在“我的所有 Workflow”下为多元素，当无法归因于任何 Workflow 时为空数组而非 null。通知 Workflow 可以直接遍历它，无需进行结构检查。

这里刻意没有单数的 `workflow_id`。它描述的是告警的范围而非指标，因此在系统范围下为 `null`，而这恰恰是最需要知道“是哪个 Workflow？”的场景。`observed_value` 仍为与阈值比较的聚合值；各 Workflow 的 `value` 字段则解释了它的来源。

这正是告警触达 Slack、邮件、Telegram 或其他任何地方的方式：使用您已有的[节点](../reference/node-types.md)，而非单独的通知系统。

告警不能通知它正在监视的 Workflow。那将形成循环，最明显的例子是执行次数告警——每次通知都会增加它所测量的计数。

通知运行是普通执行，因此会像其他运行一样出现在[执行历史](../reference/execution-history.md)中。通知 Workflow 失败会记录在触发记录上，但绝不会阻止触发本身被记录。

通知 Workflow 以告警所有者的身份运行，使用其凭据和全局变量，就如同所有者亲自运行一样。选择他人与您共享的 Workflow 并不会借用该人的凭据。如果所有者失去了对通知 Workflow 的访问权限，触发仍会被记录，但通知运行会被跳过。

## 触发历史

告警列表下方是触发历史：什么触发了、何时触发、观测值与阈值的对比、所评估的确切时间窗口，以及通知结果。

确认一条触发记录会标记该行，并将告警徽章从 **Firing** 变为 **Acknowledged**。这是关于您的声明，而非关于告警的：条件仍然成立，当指标回落至阈值以下时，告警会自行恢复为 **OK**。

每条记录都存储了触发时刻的贡献详情：失败的执行 ID 和错误消息、按模型的花费，或触发来源细分。这是刻意为之。时间窗口已经过去，事后重新计算可能得出不同的结果。

触发记录保留 90 天。

## 向 Chat 询问告警

[Chat 标签页](./chat-tab.md)可以回答关于您告警的问题：

- “我有哪些告警？”
- “invoice workflow 上有告警吗？”
- “成本告警为什么触发？”
- “这上次是什么时候触发的？”

对于“为什么触发”的问题，Chat 会引用触发记录中实际的观测值、阈值和时间窗口，以及贡献详情。

## 共享

告警可以共享给单个用户或[团队](./teams-tab.md)。与您共享的人可以查看告警及其触发历史。只有所有者可以编辑、暂停、删除或重新共享它。

### 移除 Workflow 访问权限时

针对单个 Workflow 的告警需要持续读取该 Workflow 的运行指标，因此移除某人对该 Workflow 的访问权限也会决定其告警的处理方式：

- **移除用户或团队共享**时，会询问 Workflow 所有者是否同时停止该用户或团队在该 Workflow 上的告警。默认操作为停止。被停止的告警是暂停而非删除，每一条都会以 `alert.disable_on_access_revoke` 记录在[审计日志](../reference/audit.md)中。
- **移除团队成员或删除团队**时，始终会停止受影响的告警，因为执行该操作的人不一定是 Workflow 所有者。
- 仅当告警所有者没有其他途径访问该 Workflow（例如直接共享或通过其他团队）时，告警才会被停止。
- 恢复或测试已暂停的告警时会重新检查所有者的访问权限，因此在没有访问权限的情况下，已停止的告警无法被重新开启或用于读取该 Workflow 的指标。在没有访问权限时按下 **Resume** 会显示通知，说明 Workflow 所有者需要先重新共享该 Workflow。

## 管理告警

- **Pause / Resume** — 已暂停的告警不会被评估。恢复时会立即检查，而非等待下一个间隔。
- **Edit** — 更改会作为整体进行验证，因此部分编辑不会使告警处于无效状态。
- **Delete** — 移除告警及其触发历史记录。

## 另请参阅

- [Analytics Tab](./analytics-tab.md) — 这些阈值所依据的图表
- [Traces Tab](./traces-tab.md) — LLM 成本数据的来源
- [Execution History](../reference/execution-history.md) — 错误、时长和次数告警所衡量的运行记录
- [Chat Tab](./chat-tab.md) — 以自然语言查询告警
- [Teams](./teams-tab.md) — 与团队共享告警
