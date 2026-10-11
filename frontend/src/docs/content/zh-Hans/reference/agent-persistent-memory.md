# Agent 持久内存

Agent 节点可以在数据库中保存一个**按节点隔离的知识图谱**：实体（包含类型与属性）以及实体之间的关系。启用后，Heym 会在每次运行时**将该图谱的摘要注入到系统提示词中**（前提是图谱非空）。在成功运行之后，一个 **LLM 提取任务**会在后台将对话中的新事实合并到图谱中。

子 Agent 和编排器默认各自使用**绑定到自身画布节点**的图谱。你也可以**授予其他 Agent 对该节点图谱的只读或读写访问权限**（包括你拥有的**其他工作流**中的 Agent）——参见[与其他 Agent 共享](#sharing-with-other-agents)。

## 启用

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | 当为 `true` 时，将此节点的图谱加载到系统提示词中，并为该节点的图谱安排运行后的提取任务 |
| `memoryShares` | array（可选） | 授予其他 Agent 节点访问**此**节点记忆图谱的权限；参见[共享](#sharing-with-other-agents) |

在 Agent 节点属性中开启它（**Persistent memory (graph)**）。当记忆启用时（或当显示模型时），节点上会出现一个粉色的**大脑**图标，点击可打开图谱编辑器。

## 图谱编辑器

该对话框将实体渲染为一个动态的力导向图——彩色圆圈的大小由连接数决定，并按实体类型进行聚类——同时提供编辑与导航功能（适应视图、整理布局、键盘快捷键）。你可以手动**添加、编辑或删除**节点与边；对于实体数量较多的图谱，Source/Target 关系选择器支持搜索。选中某个节点会显示其出站和入站连接，每个连接均可点击以跳转到该节点。更改仅应用于**此** Agent 的图谱（即你打开其大脑图标的那个画布节点的图谱）。

## 与其他 Agent 共享

在记忆图谱对话框中，**Share memory with other agents** 允许你附加可在运行时消费此图谱的**对等方（peer）**：

1. 选择一个**工作流**（任何你可以在编辑器中打开的工作流）。
2. 在该工作流中选择一个 **Agent** 节点。
3. 设置 **Read only** 或 **Read & write**。

| 权限 | 效果 |
|------------|--------|
| Read only | 当**对等方** Agent 运行时，此图谱会被合并到对等方的系统提示词中（前提是它包含实体）。对等方的运行不会向此图谱提取内容。 |
| Read & write | 提示词行为与只读相同，并且在**成功**完成对等方运行后，常规的记忆提取还可能使用对等方运行的凭证**合并到此（所有者）图谱中**。 |

对等方按所有者节点存储为 `memoryShares` 条目，包含 `peerWorkflowId` 和 `peerCanvasNodeId`（以及 `permission`）。较旧的工作流对于**同一**工作流中的对等方可能省略 `peerWorkflowId`；编辑器会将其视为当前工作流。

**跨工作流共享**在运行时通过扫描**你拥有的**工作流来解析。没有经过身份验证的用户上下文的运行，仅解析**当前**工作流 JSON（同一画布）中定义的共享。

## 运行时行为

### 自有图谱（`persistentMemoryEnabled`）

1. **在 LLM 调用之前** —— 如果图谱包含实体，会在系统指令中追加一个块，说明这些是来自先前运行的事实（可能不完整；发生冲突时以当前用户消息为准）。
2. **在成功完成之后** —— 一个后台任务会向模型（使用与 Agent 运行相同的凭证）请求结构化 JSON（实体 + 关系）。该 Payload 会被合并到数据库中（对某些类型会应用去重和关系清理，例如雇佣类边）。

### 对等方接收共享图谱

当 Agent 运行时，系统会查找**所有者**节点（尽可能在你拥有的任何工作流中），其 `memoryShares` 指向本次运行的工作流和画布节点。对于每个匹配项，该所有者的图谱会作为**共享记忆**部分追加到系统提示词中。**Read & write** 对等方还会在运行成功时为**所有者**工作流/图谱安排提取目标。

当运行出错或最终处于 HITL 待处理状态时，提取**不会**运行。

## 工作流 JSON（`data` 字段）

与其他设置一样持久化在 Agent 节点上：

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` 为 `"read"` 或 `"write"`。无共享时省略 `memoryShares` 或使用 `[]`。

完整的节点对象结构参见[工作流结构](./workflow-structure.md)。

## 相关

- [Agent 节点](../nodes/agent-node.md) —— 完整的 Agent 配置
- [Agent 架构](./agent-architecture.md) —— 编排器、子 Agent、工具
- [工作流结构](./workflow-structure.md) —— JSON 工作流格式
- [画布功能](./canvas-features.md) —— 大脑控件与图谱对话框
- [Traces 标签页](../tabs/traces-tab.md) —— LLM 请求/响应可观测性
