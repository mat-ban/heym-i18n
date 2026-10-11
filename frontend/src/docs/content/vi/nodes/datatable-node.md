# DataTable

Node **DataTable** đọc, ghi và quản lý dữ liệu trong Heym DataTables. Sử dụng node này cho các thao tác CRUD trên kho lưu trữ có cấu trúc của bên thứ nhất mà không cần credential bên ngoài.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable từ [tab DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Thao tác: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID của hàng (dùng cho getById, update, remove) |
| `dataTableData` | JSON string | Giá trị các cột: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Bộ lọc (find/upsert/count). `find` và `count` hỗ trợ các toán tử `{"age": {"$gt": 18}}`; `upsert` sử dụng khớp chính xác `{"column_name": "value"}` |
| `dataTableSort` | string | Cột sắp xếp, thêm tiền tố `-` để sắp xếp giảm dần |
| `dataTableLimit` | number | Số hàng tối đa trả về (mặc định: 100) |

## Các thao tác

| Thao tác | Trường bắt buộc | Mô tả |
|-----------|----------------|-------------|
| `find` | dataTableId | Tìm các hàng khớp với bộ lọc toán tử tùy chọn, kèm sắp xếp/giới hạn tùy chọn |
| `getAll` | dataTableId | Lấy tất cả các hàng với sắp xếp/giới hạn tùy chọn |
| `count` | dataTableId | Đếm số hàng khớp với bộ lọc toán tử tùy chọn (đếm trong cơ sở dữ liệu; chỉ trả về một con số) |
| `getById` | dataTableId, dataTableRowId | Lấy một hàng theo UUID |
| `insert` | dataTableId, dataTableData | Chèn một hàng mới |
| `update` | dataTableId, dataTableRowId, dataTableData | Cập nhật hàng (hợp nhất dữ liệu) |
| `remove` | dataTableId, dataTableRowId | Xóa một hàng |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Cập nhật nếu tìm thấy khớp, ngược lại thì chèn |

## Ví dụ - Tìm các hàng

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Ví dụ - Chèn hàng

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Ví dụ - Đếm các hàng

Đếm số hàng khớp với một điều kiện trong một node duy nhất, thay vì dùng `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Kết quả có sẵn dưới dạng `$activeAdults.count`. Bộ lọc rỗng hoặc bị bỏ qua sẽ đếm tất cả các hàng.

### Các toán tử lọc của find và count

Trong bộ lọc `find` hoặc `count`, một giá trị đơn thuần nghĩa là bằng; một giá trị đối tượng sẽ áp dụng một toán tử:

| Toán tử | Ý nghĩa |
|----------|---------|
| `$eq` (hoặc một giá trị đơn thuần) | Bằng |
| `$ne` | Không bằng |
| `$gt`, `$gte`, `$lt`, `$lte` | So sánh lớn hơn/nhỏ hơn (dạng số đối với các cột có kiểu `number`, ngược lại là văn bản) |
| `$contains` | Khớp chuỗi con không phân biệt chữ hoa chữ thường |
| `$in` | Giá trị nằm trong mảng đã cho |

Ví dụ kết hợp nhiều toán tử: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Các toán tử không xác định sẽ bị bỏ qua. Bộ lọc `upsert` vẫn sử dụng các giá trị khớp chính xác để tìm hàng cần cập nhật.

Bạn cũng có thể lọc theo metadata của hàng — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — những trường này được lưu dưới dạng cột thực sự thay vì nằm trong dữ liệu của bạn. Đối với ngày tháng, hãy truyền một giá trị đầy đủ cho các so sánh khoảng (ví dụ: `{"created_at": {"$gt": "2026-06-04"}}`) hoặc dùng `$contains` để khớp văn bản một phần (ví dụ: `{"created_at": {"$contains": "2026-06-04"}}`). Nếu một trong các cột của riêng bạn có cùng tên với một trường metadata, cột dữ liệu sẽ được ưu tiên.

## Truy cập đầu ra

- `$nodeLabel.success` - Trạng thái thành công dạng Boolean
- `$nodeLabel.rows` - Mảng các hàng (find, getAll)
- `$nodeLabel.row` - Đối tượng hàng đơn (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Truy cập giá trị cột cụ thể
- `$nodeLabel.count` - Số lượng hàng (số hàng trả về cho find/getAll; tổng số hàng khớp cho count)
- `$nodeLabel.id` - UUID của hàng (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Tên thao tác (ví dụ: `count`; `insert`/`update` cho upsert)

## Không cần Credential

Khác với các tích hợp bên ngoài, DataTable hoạt động trên cơ sở dữ liệu nội bộ của Heym. Quyền truy cập của chủ sở hữu workflow được kiểm tra tự động.

## Được xây dựng bởi AI Assistant

Khi [AI Assistant](../reference/ai-assistant.md#data-tables) hoặc [Chat](../tabs/chat-tab.md) xây dựng node này, nó sẽ chọn hoặc tạo bảng cùng bạn và ghi tên cột chính xác của bảng vào `dataTableData` và `dataTableFilter`.

## Liên quan

- [Tab DataTable](../tabs/datatable-tab.md) - Tạo và quản lý các bảng
- [Node Grist](./grist-node.md) - Tích hợp bảng tính bên ngoài
- [Expression DSL](../reference/expression-dsl.md) - Cú pháp biểu thức cho các giá trị động
