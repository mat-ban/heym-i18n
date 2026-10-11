# Cấu trúc Workflow

Workflow được lưu trữ dưới dạng JSON với các nodes và edges. Xem [Node Types](./node-types.md) để biết các loại node khả dụng và [Expression DSL](./expression-dsl.md) để biết cú pháp biểu thức trong các trường `data`.

## Đối tượng Workflow

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

## Đối tượng Node

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

### `data` của Agent node (bộ nhớ lâu dài)

Các node [Agent](../nodes/agent-node.md) hỗ trợ một knowledge graph tùy chọn cho mỗi canvas node:

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Khi là `true`, tải graph đã lưu vào system prompt và hợp nhất các dữ kiện mới sau khi chạy thành công |
| `memoryShares` | array (tùy chọn) | Cấp cho các agent khác quyền truy cập vào memory graph của node này (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Xem [Agent Persistent Memory](./agent-persistent-memory.md). |

Ví dụ:

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

Xem [Agent Persistent Memory](./agent-persistent-memory.md) để biết các đường dẫn API, hành vi của editor và ngữ nghĩa trích xuất.

## Đối tượng Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Các loại Node

Các giá trị `type` phổ biến: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), và nhiều loại khác. Danh sách đầy đủ: [Node Types](./node-types.md). Các node trong cùng một execution level chạy [song song](./parallel-execution.md).

## Bố cục Editor

Mỗi node có `position.x` và `position.y` cho bố cục trên canvas desktop. Trên các màn hình dưới
breakpoint 768px, editor thay thế canvas Vue Flow tự do bằng một workflow tree toàn màn hình, có thụt lề.
Tree đi theo các đường dẫn thực thi được kết nối, đánh dấu các nhánh song song và sử dụng
cùng nhãn node, biểu tượng và trạng thái lần chạy mới nhất như editor desktop.

Nhấn vào một node để chọn nó. Nếu node có kết quả thực thi được ghi lại, chi tiết toàn màn hình của nó sẽ mở ra với
các tab input, output và error. Thanh điều hướng dưới cùng trên mobile cung cấp **Nodes**, **Properties**,
**Run** và **More**; phần header giữ nguyên các hành động lưu, lịch sử, tìm kiếm, cài đặt và chia sẻ.
Desktop tiếp tục sử dụng canvas Vue Flow tự do và các side panel.

Sử dụng **Add node** trong tab Nodes trên mobile để tìm kiếm thư viện node. Một node thông thường sẽ mở
connection sheet ngay sau khi được thêm: chọn một anchor node và đặt nó **After**,
**Before**, hoặc như một nhánh **Parallel**. Ở chế độ chỉnh sửa, nhấn vào một node thông thường hiện có để mở cùng
sheet với kết nối hiện tại của nó được chọn. Các trigger node vẫn độc lập vì chúng không nhận
input thông thường. Nút điều khiển chỉnh sửa cũng hiển thị hành động xóa cho node được chọn. Chi tiết thực thi
bao gồm các mũi tên trước và sau khi có sẵn kết quả
node liền kề. AI Assistant mở phía trên mobile tree dưới dạng bottom sheet, mà không
thay đổi tab editor đang hoạt động.

## Liên quan

- [Node Types](./node-types.md) – Tất cả các loại node và mô tả
- [Canvas Features](./canvas-features.md) – Các tính năng của editor (data pin, execution logs, enable/disable, extract to sub-workflow)
- [Download & Import](./download-import.md) – Xuất và nhập workflow dưới dạng JSON
- [Agent Node](../nodes/agent-node.md) – Cấu trúc `data` của Agent node
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` và API memory graph
- [Expression DSL](./expression-dsl.md) – Cú pháp cho `userMessage`, `condition`, `$vars`, `$global`, v.v.
- [Parallel Execution](./parallel-execution.md) – Cách các node chạy song song
- [Triggers](./triggers.md) – Các start node và entry point
- [Workflows Tab](../tabs/workflows-tab.md) – Tạo và quản lý workflow
