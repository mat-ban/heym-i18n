# Hợp nhất

Node **Merge** chờ nhiều đầu vào song song và kết hợp chúng thành một đầu ra duy nhất. Sử dụng node này khi bạn cần nối kết quả từ các nhánh song song trước khi tiếp tục.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | n (có thể cấu hình) |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.merged` – đối tượng chứa các đầu vào từ mỗi nhánh |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `inputCount` | number | Số lượng đầu vào cần chờ (mặc định: 2) |

## Khi nào sử dụng

- Sử dụng khi bạn cần **kết hợp** hoặc **nối** kết quả từ các nhánh song song
- **Không** sử dụng cho các workflow song song kết thúc bằng các node [Output](./output-node.md) riêng biệt
- Mỗi nhánh đầu vào đóng góp vào đầu ra đã hợp nhất

## Ví dụ

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Kết nối nhiều nhánh vào node merge. Node sẽ chờ tất cả các đầu vào trước khi tạo đầu ra.

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Thực thi song song](../reference/parallel-execution.md) – Cách các nhánh song song chạy
- [Cấu trúc workflow](../reference/workflow-structure.md) – Các cạnh và handle
