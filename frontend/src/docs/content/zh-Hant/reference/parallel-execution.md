# 並行執行

當節點之間彼此沒有相依性時，Heym 會平行執行這些節點，並允許同時執行多個 Workflow 運行。

## 單一運行內

### 以 DAG 為基礎的排程

執行器使用有向無環圖（DAG）依**執行層級**將節點分組：

1. **層級 0** – 沒有傳入邊的節點（起始節點）
2. **層級 N** – 上游相依節點皆位於層級 0..N-1 的節點

同一層級內的節點彼此沒有相依性，會平行執行。

### 執行緒池

- **共用池**：用於節點執行的 `ThreadPoolExecutor(max_workers=8)`
- **排程**：`wait(..., return_when=FIRST_COMPLETED)` – 只要有任一節點完成，即排程其下游節點
- **執行緒安全**：節點輸出以鎖（`store_node_output`）儲存

### 協調器子代理

當協調器代理在單一回合中回傳多個 `call_sub_agent` 工具呼叫時，這些呼叫會平行執行。請參閱 [Agent 架構](./agent-architecture.md)。

### Merge 節點

[Merge](../nodes/merge-node.md) 節點會合併多個平行分支的輸出。當你明確需要合併結果時請使用它；否則平行分支可以各自結束於不同的輸出節點。

### 迴圈

迴圈迭代會**依序**執行。迴圈主體節點會於每次迭代重新排程。

### 提前回傳

具有 `allowDownstream` 的輸出節點可以提前回傳。剩餘的下游工作會在背景中執行。

## 並行 Workflow 運行

- **無個別 Workflow 鎖** – 多個請求可以同時執行同一個 Workflow
- **非同步 API** – FastAPI Endpoint 使用 `asyncio.to_thread(execute_workflow)`，讓事件迴圈保持可回應
- **隔離** – 每次運行都會取得自己的 `WorkflowExecutor` 實例與狀態

會執行 Workflow 的 Trigger（[Webhook](./webhooks.md)、[Portal](./portal.md)、[Cron](./triggers.md)、RabbitMQ、MCP、編輯器）各自獨立呼叫 `execute_workflow`。

## 串流

串流使用相同的平行模型，但會在節點完成時發出事件。編輯器與 Portal 聊天 UI 內部使用串流以提供即時進度，而 Webhook 使用者現在可以透過 [SSE 串流](./sse-streaming.md) 的 execute Endpoint 選擇加入相同的事件串流。

## 相關內容

- [為何選擇 Heym](../getting-started/why-heym.md) – Heym 執行環境中的平行 DAG 執行
- [Workflow 結構](./workflow-structure.md) – 節點、邊與執行流程
- [核心概念](../getting-started/core-concepts.md) – 執行流程概觀
- [節點類型](./node-types.md) – [Merge](../nodes/merge-node.md) 節點與其他類型
- [Trigger](./triggers.md) – 觸發運行的進入點
- [SSE 串流](./sse-streaming.md) – `/execute/stream` 的事件串流格式
