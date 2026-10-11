# Bộ ánh xạ đầu ra JSON

Node **JSON output mapper** xây dựng một đối tượng JSON từ các [mappings](./set-node.md) key/value (cùng mô hình như [Set](./set-node.md)). Sử dụng node này khi bên gọi cần nhận được **plain JSON body** ở gốc của response.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 0 (sink) |
| Runtime output | Đối tượng được xây dựng từ `mappings` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `mappings` | array | Các mục `{ "key": "fieldName", "value": "expression" }` (giống như Set) |

## Sử dụng làm agent tool

Không được hỗ trợ. Node này là một terminal sink, vì vậy không thể gắn vào tools handle của [Agent Node](./agent-node.md). Sử dụng node [Set](./set-node.md) khi agent cần định hình giá trị giữa cuộc hội thoại.

## Hành vi Webhook và run

Khi node này là terminal output **duy nhất** của workflow, **outputs** của quá trình thực thi chính là đối tượng được mapping: các key từ `mappings` xuất hiện ở **cấp cao nhất** của JSON. **Không** có wrapper bên ngoài được đặt key theo label của node và **không** có đối tượng `{ "result": ... }` (khác với node [Output](./output-node.md)).

Nếu nhiều terminal node cùng tạo ra outputs (ví dụ [Output](./output-node.md) kết hợp với JSON output mapper, hoặc nhiều nhánh), Heym sử dụng dạng thông thường: mỗi terminal được đặt key theo `label` của nó.

## Giới hạn trong Loop

Cùng quy tắc như [Output](./output-node.md): không đặt node này bên trong nhánh lặp của loop—chỉ đặt sau nhánh `done` của loop. Xem [Loop](./loop-node.md).

## Ví dụ

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Liên quan

- [Set](./set-node.md) – Cùng cơ chế mapping cho các phép biến đổi trung gian
- [Output](./output-node.md) – Response dựa trên message hoặc schema với wrapper `result`
- [Node Types](../reference/node-types.md) – Tất cả các loại node
- [Workflow Structure](../reference/workflow-structure.md) – Định dạng JSON của workflow
- [Webhooks](../reference/webhooks.md) – Endpoint thực thi và các response
