# Ghi chú dán

Node **Sticky Note** thêm ghi chú markdown phong phú vào canvas. Node này không được thực thi—hãy sử dụng nó cho tài liệu, hướng dẫn, hình ảnh tham chiếu hoặc ghi chú workflow.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 0 |
| Đầu ra | N/A (không được thực thi) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `stickyTitle` | string | Tiêu đề hiển thị ở đầu sticky note. |
| `stickyColor` | string | Màu nền: `yellow`, `sky`, `emerald`, `rose`, `violet`, hoặc `zinc`. |
| `note` | string | Nội dung Markdown. Nhấp đúp để chỉnh sửa trên canvas. Hỗ trợ liên kết và markdown hình ảnh như `![Alt](https://example.com/image.png)`. |

## Ví dụ

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Workflow Organization](../reference/workflow-organization.md) – Tổ chức workflow
