# Board

**Board** 标签页是一个智能体看板。工作沿列流转，每一列都可以执行 Heym workflow。卡片不只是一项任务——它是一个持久化的智能体作业，承载上下文、对话历史、执行状态、输出以及 workflow 运行记录。

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## 看板与列

- 您可以根据需要创建任意数量的看板。新看板默认包含以下列：**Backlog → Planning → Development → Done**。
- 每个看板都需要一个 **Agentic Kanban Model**（一个凭证加一个模型）。这是强制要求——新建看板对话框在没有该配置时不会创建看板，而缺少该配置的看板其操作将保持禁用状态——因为正是该模型将每张卡片映射到其所运行 workflow 的输入中，并将其输出转换回可读文本。
- 看板标题栏中的齿轮图标可打开看板设置：名称、描述（显示在标题下方）以及 Agentic Kanban Model。
- 列完全可编辑：可在列设置中添加、重命名、更改颜色、重新排序或删除列（列必须为空才能删除）。
- 卡片按优先级垂直排序——可拖动重新排序。
- 您也可以通过 [Chat 标签页](./chat-tab.md) 使用自然语言请求创建卡片。Chat 会在需要时要求您选择看板，并始终将卡片添加到该看板的第一列。

## 共享看板

看板设置还可以将看板共享给**用户**（通过邮箱）和**团队**，权限为 `read` 或 `write`：

- **read**——看板及其卡片可见，但无法进行任何更改：不能新建卡片、不能移动、不能评论、不能运行。
- **write**——可完全使用看板：卡片、移动、评论和运行。
- 只有**所有者**能看到齿轮和删除按钮，也只有所有者能更改看板设置、其 Agentic Kanban Model 或其共享配置。

共享看板上的链始终使用**所有者**的凭证和 Agentic Kanban Model 运行，因此协作者无需自备。

## 卡片附件

打开卡片并使用 **Attach file** 为其添加文件——可将文件拖放到框中，或通过按钮选择，并可在同一列表中移除。附件存储在 [Drive](./drive-tab.md) 中。

每次运行都会**在 workflow 启动前解析附件**，按类型处理：

- **文档**（pdf、markdown、csv、json、text）会被提取为文本，每个文件上限为 20,000 个字符，存放在附件的 `text` 字段中。
- **图片**以 `url` 形式传递，视觉路径会直接加载（LLM 节点的图片输入可直接接受该形式）。
- **其他任何内容**以纯引用形式传递（`name`、`url`、`mime_type`）。

Workflow 可在 `$input.card.attachments` 处读取它们（并且无论映射器如何映射，始终可在 `$input.board.attachments` 处读取）。Agentic Kanban Model 也能看到提取的文本和图片 URL，因此它可以将附件直接映射到 workflow 所期望的字段中。

## 列 workflow 链

每一列都可以配置一个**有序的 workflow 列表**（即链）。当卡片移入具有链的列时：

1. 链会在后台自动启动——移动操作本身从不等待。
2. Workflow **按顺序**运行。每个 workflow 的输出会在下一个启动前追加到卡片上下文中。
3. 如果某个 workflow 失败，链会停止：剩余环节被跳过，卡片变为**红色**。
4. 当所有环节都成功时，卡片变为**绿色**。链运行期间卡片呈**琥珀色**脉动；因人工审核而暂停的运行显示为静态琥珀色状态。

运行记录会以 `board` trigger 来源记录在 [Execution History](../reference/execution-history.md) 中，每张卡片保留自己的运行列表，包含每个 workflow 的输出和错误。在 workflow 运行期间打开卡片，选择运行旁的 **Open live**，即可将编辑器附加到该次确切的执行。相同的画布动画、增量 Debug 日志和最终结果都会呈现，而无需启动第二次运行。

## Workflow 接收的内容

该链会将标准 Payload 作为 Workflow 的输入传递。可使用常规的[表达式](../reference/expression-dsl.md)（例如 `$input.card.title`）读取：

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — 卡片上的所有评论，按时间从早到晚排列。
- `history` — 完整的活动时间线（评论、移动、输出），最多保留最近 200 条记录。
- `previous_outputs` — 此前已完成的运行所产生的输出（之前的列以及后续轮次）。
- `chain.previous_workflow_outputs` — *当前*链中更早环节的输出。
- 在后续轮次中，`move` 为 `null`，`rerun` 为 `true`。

## 规划循环（后续轮次）

一种常见模式是将规划 Workflow 放在**第二列**（默认名为 Planning——名称无关紧要，位置才是关键）。该 Workflow 会丰富卡片内容并提出后续问题：

1. 将卡片移入第二列——该 Workflow 会将完善的计划及其问题作为输出写回卡片。
2. 在卡片的评论线程中作答。回答会释放卡片：卡片继续移动到下一列，下一列会在上下文中携带该回答来接手处理。第二列的链不会再次运行。
3. 如需就地改进计划，请按 **Run follow-up round**。同一条链会在所有已累积的上下文中再次运行，随后卡片会在该列中等待，直到您添加评论将其释放。

规划关卡是基于位置的，而非基于名称的：最左侧的列及其紧邻右侧的列不会自行向前移动——它们会运行各自的链并在那里等待您（评论可释放第二列）。从第三列开始，链成功执行后会自动将卡片向右推进，直至最后一列。重命名或移除默认的 "Planning" 标签不会改变哪个位置是关卡。一张卡片同一时间只能有一个活动运行。

## Human-in-the-Loop 与 Codex 提问

如果链中的 Workflow 暂停——在 [Human-in-the-Loop](../reference/human-in-the-loop.md) 节点上、在 Agent 的 HITL 工具上，或是因为 [Codex](../nodes/codex-node.md) 节点需要更多信息——该运行会被持久化为待处理状态，卡片会显示琥珀色的待处理状态。每次暂停都保留各自的回答界面：HITL 对应 HITL 审核链接，Codex 对应 Codex 后续跟进界面。

一旦您作答，链会自动恢复：暂停的 Workflow 完成，其输出落到卡片上，该列链的其余部分继续运行，卡片照常向前推进。如果恢复后的运行失败，卡片会变红，其余环节将被跳过。

## 相关内容

- [Workflows](./workflows-tab.md)
- [执行历史](../reference/execution-history.md)
- [表达式 DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
