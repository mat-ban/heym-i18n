# ClickHouse

Node **ClickHouse** thực thi các thao tác CRUD, đếm và SQL thô đối với cơ sở dữ liệu [ClickHouse](https://clickhouse.com/) bên ngoài thông qua giao diện HTTP của nó. Sử dụng node này để ghi sự kiện vào bảng ClickHouse từ một workflow, đọc hoặc tổng hợp dữ liệu phân tích, hoặc chạy SQL tùy ý — mà không cần tự viết các yêu cầu HTTP.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | ClickHouse |
| Đầu ra | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential ClickHouse từ [Credentials](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Thao tác: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, hoặc `upsert` |
| `clickhouseTable` | expression | Tên bảng đơn giản. Bắt buộc cho mọi thao tác ngoại trừ `query`. |
| `clickhouseQuery` | expression | SQL thô cho `query`. `SELECT`/`SHOW`/`DESCRIBE` trả về các hàng; các câu lệnh khác chạy như command. |
| `clickhouseFilter` | expression | Đối tượng JSON của các bộ lọc so sánh bằng, ví dụ `{"status":"active"}`. Được dùng bởi `find`, `count`, `update`, và `remove`. Các giá trị được tham số hóa. |
| `clickhouseLimit` | string | Số hàng tối đa cho `find` / `getAll` (`0` = không giới hạn, không có mệnh đề LIMIT). Mặc định `100`. |
| `clickhouseSort` | expression | Tùy chọn `column` hoặc `column ASC\|DESC` cho `find` |
| `clickhouseRowId` | expression | Giá trị được so khớp với cột `id` của bảng cho `getById` |
| `clickhouseInputMode` | string | Cho `insert`/`upsert`: chế độ mảng JSON `raw` hoặc chế độ trường key/value `selective` |
| `clickhouseData` | expression | Mảng JSON của các đối tượng hàng cho `insert`/`upsert`, hoặc đối tượng JSON của các giá trị cột cho `update` |
| `clickhouseMappings` | array | Các cặp `{key, value}` được dùng khi `clickhouseInputMode` là `selective` |

## Thiết lập Credential

Tạo một credential **ClickHouse** trong [Credentials tab](../tabs/credentials-tab.md) với:

1. **Host** — host HTTP không có scheme, ví dụ `your-instance.clickhouse.cloud`
2. **Port** — cổng giao diện HTTP (`8443` cho HTTPS, `8123` cho HTTP)
3. **Username** / **Password** — mặc định là `default` với mật khẩu rỗng
4. **Database** — mặc định là `default`
5. **Secure** — bật cho HTTPS (ClickHouse Cloud)

Node kết nối thông qua HTTP client chính thức `clickhouse-connect`. Sử dụng **Test connection** trong hộp thoại credential để xác minh khả năng kết nối trước khi lưu.

## Các thao tác

| Thao tác | Trường bắt buộc | Mô tả |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Chạy SQL thô. `SELECT` trả về `{rows, count}`; các câu lệnh khác trả về `{result}`. |
| `find` | `clickhouseTable` | Đọc các hàng với bộ lọc so sánh bằng, sắp xếp và giới hạn tùy chọn |
| `getAll` | `clickhouseTable` | Đọc các hàng đến giới hạn mà không có bộ lọc |
| `count` | `clickhouseTable` | Đếm số hàng, có thể lọc |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Đọc một hàng duy nhất theo cột `id` của nó |
| `insert` | `clickhouseTable`, `clickhouseData` hoặc mappings | Chèn một hoặc nhiều hàng |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Cập nhật các hàng khớp qua `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Xóa các hàng khớp qua `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` hoặc mappings | Chèn các hàng (giả định bảng `ReplacingMergeTree`) |

## Cú pháp Filter

`clickhouseFilter` là một đối tượng JSON phẳng của các kiểm tra so sánh bằng theo cột. Các giá trị được gửi dưới dạng tham số truy vấn được ràng buộc, do đó an toàn trước injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Đoạn này biên dịch thành `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Trình tạo filter chỉ hỗ trợ so sánh bằng — đối với khoảng giá trị, join, hoặc tổng hợp, hãy dùng thao tác `query` với SQL thô.

## Chế độ đầu vào (insert / upsert)

- **Mảng JSON** (`raw`): cung cấp một mảng JSON của các đối tượng hàng trong `clickhouseData`. Các key bị thiếu trong một hàng nhất định được chèn dưới dạng `NULL`. Tập hợp cột là hợp của các key trên tất cả các hàng.
- **Key-value** (`selective`): sau khi bạn chọn credential và bảng, trình soạn thảo sẽ phát hiện các cột của bảng và tạo một trường giá trị cho mỗi cột. Một hàng được chèn cho mỗi lần thực thi; mỗi giá trị hỗ trợ expression.

## Mutations và Ngữ nghĩa ClickHouse

ClickHouse là cơ sở dữ liệu OLAP, vì vậy các thao tác ghi ở cấp hàng hoạt động khác so với một kho OLTP:

- **`update`** phát ra `ALTER TABLE … UPDATE` và **`remove`** phát ra `DELETE FROM`. Cả hai đều là **các mutation bất đồng bộ** — chúng được áp dụng cuối cùng và tương đối tốn kém. Ưu tiên ghi theo lô hơn là các mutation một hàng thường xuyên.
- **`upsert`** thực hiện một `INSERT`. Để có hành vi merge-on-key, hãy dùng bảng với engine `ReplacingMergeTree`.
- **`getById`** giả định bảng có cột `id`.
- `update` và `remove` yêu cầu `clickhouseFilter` không rỗng để tránh mutation toàn bảng.

## Tham chiếu đầu ra

| Trường đầu ra | Kiểu | Mô tả |
|-------------|------|-------------|
| `.rows` | array | Các đối tượng hàng được trả về (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Số lượng hàng (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Một hàng duy nhất hoặc `null` (`getById`) |
| `.result` | string | Tóm tắt command cho `query` không phải SELECT |
| `.success` | boolean | Thao tác có thành công hay không |
## Ví dụ – Chèn một Event

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Ví dụ – Đếm người dùng đang hoạt động

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Truy cập output: `$activeCount.count`.

## Ví dụ – Truy vấn báo cáo hàng ngày

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Truy cập output: `$dailyReport.rows`, `$dailyReport.count`.

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Tab Credentials](../tabs/credentials-tab.md) – Thêm thông tin xác thực ClickHouse
- [Tích hợp bên thứ ba](../reference/integrations.md) – Thiết lập thông tin xác thực tích hợp
