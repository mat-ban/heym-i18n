# Workflow 结构

Workflow 以 JSON 格式存储，包含节点和边。可用的节点类型请参阅 [Node Types](./node-types.md)，`data` 字段中的表达式语法请参阅 [Expression DSL](./expression-dsl.md)。

## Workflow 对象

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## 节点对象

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent 节点 `data`（持久化记忆）

[Agent](../nodes/agent-node.md) 节点支持为每个画布节点配置可选的知识图谱：

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | 当设为 `true` 时，将已存储的图谱加载到系统 Prompt 中，并在成功运行后合并新的事实 |
| `memoryShares` | array（可选） | 授予其他 Agent 访问此节点记忆图谱的权限（`peerWorkflowId`、`peerCanvasNodeId`、`permission`：`read` \| `write`）。请参阅 [Agent Persistent Memory](./agent-persistent-memory.md)。 |

示例：

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

有关 API 路径、编辑器行为及提取语义，请参阅 [Agent Persistent Memory](./agent-persistent-memory.md)。

## 边对象

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## 节点类型

常见的 `type` 值包括：[Input](../nodes/input-node.md)（`textInput`）、[Cron](../nodes/cron-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)（`websocketTrigger`）、[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Condition](../nodes/condition-node.md)、[Switch](../nodes/switch-node.md)、[Output](../nodes/output-node.md)、[JSON output mapper](../nodes/json-output-mapper-node.md)（`jsonOutputMapper`）、[Wait](../nodes/wait-node.md)、[HTTP](../nodes/http-node.md)、[WebSocket Send](../nodes/websocket-send-node.md)（`websocketSend`）、[Merge](../nodes/merge-node.md)、[Set](../nodes/set-node.md)、[Variable](../nodes/variable-node.md)、[Loop](../nodes/loop-node.md) 等。完整列表请参阅：[Node Types](./node-types.md)。同一执行层级中的节点会[并行](./parallel-execution.md)运行。

## 编辑器布局

每个节点都有 `position.x` 和 `position.y`，用于桌面画布布局。在低于 768px 断点的屏幕上，编辑器会将自由形式的 Vue Flow 画布替换为全屏缩进式 Workflow 树。该树遵循已连接的执行路径，标记并行分支，并使用与桌面编辑器相同的节点标签、图标和最新运行状态。

点击节点即可选中。如果该节点有已记录的执行结果，将打开全屏详情，包含输入、输出和错误标签页。移动端底部导航提供 **Nodes**、**Properties**、**Run** 和 **More**；顶部栏保留保存、历史记录、搜索、设置和分享操作。桌面端继续使用自由形式的 Vue Flow 画布和侧边面板。

在移动端 Nodes 标签页中使用 **Add node** 搜索节点库。添加常规节点后，会立即打开连接面板：选择一个锚点节点，并将其放置为 **After**、**Before** 或 **Parallel** 分支。在编辑模式下，点击已有的常规节点会打开相同的面板，并选中其当前连接。Trigger 节点保持独立，因为它们不接受常规输入。编辑控件还提供删除所选节点的操作。当相邻节点结果可用时，执行详情会包含上一条和下一条箭头。AI Assistant 以底部面板的形式在移动端树上方打开，不会更改当前活动的编辑器标签页。

## 相关内容

- [Node Types](./node-types.md) – 所有节点类型及描述
- [Canvas Features](./canvas-features.md) – 编辑器功能（数据固定、执行日志、启用/禁用、提取为子 Workflow）
- [Download & Import](./download-import.md) – 以 JSON 格式导出和导入 Workflow
- [Agent Node](../nodes/agent-node.md) – Agent 节点 `data` 结构
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`、`memoryShares` 及记忆图谱 API
- [Expression DSL](./expression-dsl.md) – `userMessage`、`condition`、`$vars`、`$global` 等的语法
- [Parallel Execution](./parallel-execution.md) – 节点如何并行运行
- [Triggers](./triggers.md) – 起始节点和入口点
- [Workflows Tab](../tabs/workflows-tab.md) – 创建和管理 Workflow
