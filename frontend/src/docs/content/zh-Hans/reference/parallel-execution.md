# 并行执行

当节点之间没有相互依赖关系时，Heym 会并行运行这些节点，并允许多个工作流运行并发执行。

## 单次运行内

### 基于 DAG 的调度

执行器使用有向无环图（DAG）按**执行层级**对节点进行分组：

1. **第 0 层** – 没有入边的节点（起始节点）
2. **第 N 层** – 其上游依赖全部位于第 0..N-1 层的节点

同一层级中的节点之间没有依赖关系，会并行运行。

### 线程池

- **共享池**：用于节点执行的 `ThreadPoolExecutor(max_workers=8)`
- **调度**：`wait(..., return_when=FIRST_COMPLETED)` – 一旦任何节点完成，下游节点即被调度
- **线程安全**：节点输出通过锁进行存储（`store_node_output`）

### 编排器子 Agent

当编排器 Agent 在一轮中返回多个 `call_sub_agent` 工具调用时，它们会并行运行。参见 [Agent 架构](./agent-architecture.md)。

### Merge 节点

[Merge](../nodes/merge-node.md) 节点用于合并多个并行分支的输出。当你明确需要合并结果时使用它；否则并行分支可以在各自独立的输出节点中结束。

### 循环

循环迭代按**顺序**运行。循环体节点会在每次迭代时重新调度。

### 提前返回

带有 `allowDownstream` 的输出节点可以提前返回。剩余的下游工作会在后台继续运行。

## 并发工作流运行

- **无按工作流加锁** – 多个请求可以同时运行同一个工作流
- **异步 API** – FastAPI Endpoint 使用 `asyncio.to_thread(execute_workflow)`，使事件循环保持响应
- **隔离** – 每次运行都会获得自己的 `WorkflowExecutor` 实例和状态

运行工作流的 Trigger（[Webhook](./webhooks.md)、[Portal](./portal.md)、[Cron](./triggers.md)、RabbitMQ、MCP、编辑器）各自独立调用 `execute_workflow`。

## 流式传输

流式传输使用相同的并行模型，但会在节点完成时发出事件。编辑器和 Portal 聊天 UI 内部使用流式传输来实现实时进度，而 Webhook 用户现在可以通过 [SSE Streaming](./sse-streaming.md) 执行 Endpoint 选择加入相同的事件流。

## 相关内容

- [Why Heym](../getting-started/why-heym.md) – Heym 运行时中的并行 DAG 执行
- [工作流结构](./workflow-structure.md) – 节点、边和执行流
- [核心概念](../getting-started/core-concepts.md) – 执行流概览
- [节点类型](./node-types.md) – [Merge](../nodes/merge-node.md) 节点及其他类型
- [Trigger](./triggers.md) – 触发运行的入口点
- [SSE Streaming](./sse-streaming.md) – `/execute/stream` 的事件流格式
