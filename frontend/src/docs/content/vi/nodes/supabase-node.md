# Supabase

Node **Supabase** đọc và thay đổi các bảng được phơi bày bởi PostgREST API của một dự án Supabase. Sử dụng node này khi bạn muốn workflow truy cập trạng thái ứng dụng dựa trên SQL mà không cần tự viết các yêu cầu HTTP.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | Supabase |
| Đầu ra | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential Supabase từ [Credentials](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Thao tác: `select`, `insert`, `update`, `upsert`, hoặc `delete` |
| `supabaseSchema` | expression | Tên schema. Nếu để trống, node sử dụng schema mặc định của credential, sau đó là `public`. |
| `supabaseTable` | expression | Tên bảng đơn giản để truy vấn hoặc thay đổi. Đặt schema trong `supabaseSchema`, không đặt ở đây. |
| `supabaseSelectColumns` | expression | Danh sách select PostgREST phân tách bằng dấu phẩy cho `select` (mặc định `*`) |
| `supabaseFilter` | expression | Đối tượng filter JSON. Hỗ trợ khớp chính xác cùng các đối tượng toán tử và nhóm logic, ví dụ `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}`, hoặc `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Số hàng tối đa trả về cho `select` (`0` = lấy tất cả các hàng khớp với phân trang phía server, giá trị âm sẽ quay về `100`) |
| `supabaseOrderBy` | expression | Cột tùy chọn để sắp xếp cho `select` |
| `supabaseAscending` | boolean | Sắp xếp tăng dần khi `true`, giảm dần khi `false` |
| `supabaseRowsInputMode` | string | Cho `insert`/`upsert`: chế độ mảng JSON `raw` hoặc `auto` để tự động ánh xạ đầu vào thượng nguồn đơn |
| `supabaseDataInputMode` | string | Cho `update`: chế độ đối tượng JSON `raw` hoặc `auto` để tự động ánh xạ đầu vào thượng nguồn đơn |
| `supabaseIgnoredInputFields` | string | Tên trường tùy chọn phân tách bằng dấu phẩy để bỏ qua khi tự động ánh xạ dữ liệu đầu vào |
| `supabaseRows` | expression | Mảng JSON các đối tượng hàng cho `insert` và `upsert` |
| `supabaseOnConflict` | expression | Các cột mục tiêu xung đột tùy chọn phân tách bằng dấu phẩy cho `upsert`, ví dụ `id` hoặc `tenant_id,email` |
| `supabaseData` | expression | Đối tượng JSON các giá trị cột được cập nhật cho `update` |

## Thiết lập Credential

Tạo credential **Supabase** trong [Credentials tab](../tabs/credentials-tab.md) với:

1. **Project URL** của bạn, ví dụ `https://your-project.supabase.co`
2. Một **API key** có quyền truy cập vào các bảng mà workflow này nên sử dụng
3. Một **schema mặc định** tùy chọn (mặc định là `public`)

Node giao tiếp với endpoint PostgREST của Supabase tại `/rest/v1/<table>`.
Chỉ sử dụng `supabaseTable` cho tên bảng, chẳng hạn như `users` hoặc `profiles`. Không truyền `schema.table`, `rpc/...`, hoặc các đường dẫn API khác vào đó.

Khi một credential Supabase hợp lệ được chọn, trình soạn thảo có thể khám phá các bảng được phơi bày và các cột của bảng
trực tiếp từ metadata OpenAPI của PostgREST. Sử dụng dropdown **discovered tables** để
chọn một bảng và **column chips** dưới **Select Columns** để nhanh chóng xây dựng danh sách select.

## Các thao tác

| Thao tác | Trường bắt buộc | Mô tả |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Đọc các hàng với filter khớp chính xác tùy chọn, giới hạn và sắp xếp |
| `insert` | `supabaseTable`, `supabaseRows` hoặc tự động ánh xạ đầu vào | Chèn một hoặc nhiều hàng |
| `update` | `supabaseTable`, `supabaseData` hoặc tự động ánh xạ đầu vào, `supabaseFilter` | Cập nhật các hàng khớp với filter |
| `upsert` | `supabaseTable`, `supabaseRows` hoặc tự động ánh xạ đầu vào | Chèn hoặc hợp nhất các hàng sử dụng ngữ nghĩa upsert của Supabase. Sử dụng `supabaseOnConflict` khi bạn cần mục tiêu xung đột rõ ràng. |
| `delete` | `supabaseTable`, `supabaseFilter` | Xóa các hàng khớp với filter |

## Cú pháp Filter

`supabaseFilter` biên dịch JSON có cấu trúc thành các tham số truy vấn PostgREST.

- Khớp chính xác: `{"status":"active"}`
- So sánh: `{"created_at":{"gte":"2026-01-01"}}`
- Thành viên: `{"status":{"in":["active","paused"]}}`
- Khớp mẫu: `{"email":{"ilike":"*@example.com"}}`
- Logic OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logic AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Đối với nhiều toán tử trên cùng một trường, hãy ưu tiên một nhóm logic:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Phân trang

`select` hiện thực hiện phân trang phía server thực sự đối với PostgREST.

- `supabaseLimit: "0"` lấy tất cả các hàng khớp theo từng trang
- Các giá trị `supabaseLimit` trên 1000 tự động tách thành nhiều yêu cầu
- Kết quả được hợp nhất trở lại thành một mảng `.rows` và `.count` giữ tổng số hàng khớp

Khi đọc các bảng lớn, hãy đặt `supabaseOrderBy` ổn định để giữ ranh giới trang có thể dự đoán được.

## Tự động ánh xạ đầu vào

Đối với `insert`, `upsert`, và `update`, chuyển node sang **Auto-map input** khi node
thượng nguồn đơn đã xuất ra hình dạng bạn muốn ghi.

- Một đối tượng đơn trở thành một hàng hoặc một payload cập nhật
- Một mảng các đối tượng trở thành nhiều hàng cho `insert` / `upsert`
- Một đối tượng thượng nguồn có mảng `rows` sẽ tái sử dụng mảng đó trực tiếp
- `supabaseIgnoredInputFields` cho phép bạn bỏ các trường như `id`, `created_at`, hoặc `success`
## Tham chiếu Output

| Trường Output | Kiểu | Mô tả |
|-------------|------|-------------|
| `.rows` | array | Các đối tượng hàng được trả về |
| `.count` | number | Số lượng hàng được trả về hoặc bị ảnh hưởng |
| `.success` | boolean | Thao tác có thành công hay không |

## Ví dụ – Chọn Người dùng Đang hoạt động

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Truy cập output: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Ví dụ – Upsert một Hàng Profile

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Liên quan

- [Các loại Node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Tab Credentials](../tabs/credentials-tab.md) – Thêm thông tin xác thực Supabase
- [Tích hợp Bên thứ ba](../reference/integrations.md) – Thiết lập thông tin xác thực tích hợp
