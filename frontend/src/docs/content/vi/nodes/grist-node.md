# Grist

Node **Grist** đọc, ghi và quản lý dữ liệu trong bảng tính Grist. Sử dụng node này cho các thao tác CRUD, cập nhật hàng loạt và tự động hóa bảng tính.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Output | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực Grist từ [Credentials](../tabs/credentials-tab.md) |
| `gristOperation` | string | Thao tác: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID tài liệu (từ URL Grist) |
| `gristTableId` | expression | ID bảng |
| `gristRecordId` | expression | ID bản ghi (thao tác một bản ghi) |
| `gristRecordData` | JSON string | Giá trị trường cho create/update. Sử dụng **column ID** (ví dụ: `User_Name`), không dùng nhãn hiển thị. |
| `gristRecordsData` | JSON string | Mảng các bản ghi cho thao tác hàng loạt |
| `gristFilter` | JSON string | Bộ lọc: `{"Column_ID": [values]}` |
| `gristSort` | string | Sắp xếp: `Column_ID` hoặc `-Column_ID` (giảm dần) |
| `gristLimit` | number | Số bản ghi tối đa (mặc định: 100) |

## Column ID và Nhãn

Sử dụng **column ID** (dấu gạch dưới, ví dụ: `User_Name`) trong `gristRecordData` và bộ lọc, không dùng nhãn hiển thị. Sử dụng `listColumns` để khám phá các column ID.

## Ví dụ – Get Records

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Ví dụ – Create Record

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm Grist API key
- [Third-Party Integrations](../reference/integrations.md#grist) – Thiết lập thông tin xác thực Grist
