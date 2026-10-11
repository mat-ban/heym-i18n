# BigQuery

Node **BigQuery** chạy các truy vấn SQL và chèn các hàng vào tập dữ liệu Google BigQuery thông qua BigQuery REST API v2. Sử dụng node này để truy vấn các tập dữ liệu phân tích lớn hoặc truyền các hàng vào bảng từ dữ liệu workflow.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | BigQuery (OAuth2) |
| Đầu ra | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential BigQuery từ [Credentials](../tabs/credentials-tab.md) |
| `bqOperation` | string | Thao tác: `query` hoặc `insertRows` |
| `bqProjectId` | expression | ID dự án Google Cloud (ví dụ: `my-gcp-project`) |
| `bqQuery` | expression | Chuỗi truy vấn SQL. Bắt buộc đối với `query`. |
| `bqMaxResults` | string | Số hàng tối đa được trả về bởi `query` (mặc định `1000`). |
| `bqDatasetId` | expression | ID tập dữ liệu (ví dụ: `my_dataset`). Bắt buộc đối với `insertRows`. |
| `bqTableId` | expression | ID bảng (ví dụ: `my_table`). Bắt buộc đối với `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Đối với `insertRows`: **Raw** = mảng JSON đầy đủ; **Selective** = một hàng duy nhất dưới dạng các cặp trường key-value. |
| `bqRows` | expression | Mảng JSON của các đối tượng hàng cho chế độ raw (ví dụ: `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Các cặp key-value cho chế độ selective. Mỗi key là tên cột; mỗi value là một biểu thức. |

## Thiết lập Credential

BigQuery sử dụng mô hình **OAuth2 "Bring Your Own App"**. Bạn cung cấp thông tin xác thực OAuth2 Google Cloud của riêng mình.

**Cấu hình backend:** Đặt **`FRONTEND_URL`** trên backend Heym thành URL công khai của ứng dụng (địa chỉ người dùng nhập vào trình duyệt), ví dụ: `https://your-heym-domain`. URI chuyển hướng OAuth luôn là `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Truy cập [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → bật **BigQuery API**.
2. Truy cập **Credentials** → **Create Credentials** → **OAuth client ID** → chọn **Web application**.
3. Trong **Authorized redirect URIs**, thêm chính xác: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Sao chép **Client ID** và **Client Secret**.
5. Trong Heym Dashboard → **Credentials** → **New** → chọn **BigQuery (OAuth2)**.
6. Nhập Client ID, Client Secret và tên, sau đó nhấp **Connect** để hoàn tất quá trình đồng ý OAuth2 trong cửa sổ popup của trình duyệt.

Token tự động làm mới trong nền — không cần quản lý token thủ công.

## Các thao tác

| Thao tác | Trường bắt buộc | Mô tả |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Chạy truy vấn SQL và trả về các hàng |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows hoặc bqMappings | Chèn một hoặc nhiều hàng thông qua API streaming insertAll |

## Tham chiếu đầu ra

| Thao tác | Trường đầu ra | Kiểu | Mô tả |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Mảng các đối tượng hàng (tên cột → giá trị) |
| `query` | `.total` | number | Số hàng được trả về |
| `query` | `.schema` | array | Các trường schema của bảng |
| `insertRows` | `.insertedCount` | number | Số hàng được chèn thành công |
| `insertRows` | `.errors` | array | Lỗi chèn theo từng hàng (rỗng nếu thành công hoàn toàn) |

## Ví dụ – Chạy truy vấn

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Truy cập đầu ra: `$getUsers.rows` (mảng các đối tượng hàng), `$getUsers.rows[0].email`, `$getUsers.total`.

## Ví dụ – Chèn một hàng

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm credential BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Mẫu OAuth2 tương tự cho dữ liệu bảng tính
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập credential tích hợp
