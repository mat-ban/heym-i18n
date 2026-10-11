# Thực thi

Node **Execute** gọi một workflow khác (sub-workflow) và truyền dữ liệu đầu vào cho nó. Sử dụng node này cho logic có thể tái sử dụng, không dùng để biến đổi dữ liệu—hãy dùng [Set](./set-node.md) cho mục đích đó.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `executeWorkflowId` | UUID | ID của workflow cần thực thi |
| `executeInput` | expression | Một input duy nhất (dành cho workflow có một trường input) |
| `executeInputMappings` | array | `{ key, value }` cho nhiều input. `key` = tên trường input của workflow đích. |
| `executeDoNotWait` | boolean | Khi `true`, gửi sub-workflow chạy nền mà không chờ đợi. Output: `{ "status": "dispatched", "workflow_id": "..." }`. Mặc định: `false`. |

## Định dạng phản hồi

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Không chờ đợi

Khi `executeDoNotWait: true`, node gửi sub-workflow đến một luồng nền và trả về ngay lập tức:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Workflow cha tiếp tục đến node tiếp theo mà không chờ đợi. Bản ghi thực thi của sub-workflow được ghi vào trace một cách bất đồng bộ khi nó hoàn thành. Sử dụng tùy chọn này khi kết quả của sub-workflow không cần thiết cho các bước phía sau.

## Một input

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Nhiều input

Khi workflow đích có nhiều trường input, sử dụng `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key` phải khớp với các khóa `inputFields` của node [Input](./input-node.md) trong workflow đích.

## Liên quan

- [Canvas Features](../reference/canvas-features.md) – Extract to Sub-Workflow để tạo các node Execute từ những node được chọn
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Input Node](./input-node.md) – Các trường input của workflow đích
- [Set Node](./set-node.md) – Biến đổi dữ liệu (không phải gọi workflow)
