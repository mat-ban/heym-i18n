# Amazon S3

Node Amazon S3 đọc và ghi các object trong [Amazon S3](https://aws.amazon.com/s3/).

## Các thao tác được hỗ trợ

- `Create Bucket`: Tạo một bucket trong region của credential.
- `Delete Bucket`: Xóa một bucket rỗng.
- `List Buckets`: Liệt kê các bucket mà credential có thể thấy.
- `Create Folder`: Tạo một folder marker rỗng (key zero-byte kết thúc bằng `/`).
- `Delete Folder`: Xóa tất cả các object dưới một folder prefix (bao gồm cả các key lồng nhau).
- `Get All in Folder`: Liệt kê tất cả metadata của object dưới một folder prefix (phân trang phía server).
- `Upload Object`: Ghi một payload văn bản vào bucket/key.
- `Get Object`: Tải một object và trả về nội dung văn bản đã giải mã hoặc nội dung base64.
- `Copy Object`: Sao chép một object sang key hoặc bucket khác.
- `List Objects`: Liệt kê metadata của object dưới một prefix (một trang, tối đa 1000 key; hỗ trợ continuation token).
- `Delete Object`: Xóa một object đơn lẻ theo key.

## Thiết lập credential

Tạo một credential `Amazon S3` trong tab Credentials với:

- Access Key ID
- Secret Access Key
- Region
- Session Token tùy chọn (cho credential AWS STS tạm thời)

## Các trường phổ biến

- `Bucket`: Tên bucket đích (bucket đích cho thao tác copy).
- `Object Key`: Key của object dạng đường dẫn như `reports/daily.json`.
- `Folder Path`: Prefix cho các thao tác folder (ví dụ `docs/archive`).
- `Source Bucket`: Bucket nguồn tùy chọn cho thao tác copy; mặc định là bucket đích.
- `Source Object Key`: Key nguồn cho thao tác copy.
- `Prefix`: Được dùng bởi các thao tác list để giới hạn phạm vi kết quả.
- `Continuation Token`: Token tùy chọn từ phản hồi list trước đó để lấy trang tiếp theo.
- `Max Keys`: Kích thước trang cho List Objects (1–1000).
- `Include Binary`: Khi được bật trên Get Object, trả về `body_base64` thay vì `body_text`.
- `Body`: Nội dung văn bản để upload.
- `Content Type`: MIME type tùy chọn cho các object được upload.

## Ví dụ output

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Ghi chú

- `Upload Object` hiện tại upload nội dung văn bản UTF-8.
- `Get Object` có thể trả về base64 cho các file nhị phân bằng cách bật tùy chọn binary.
- `Create Bucket` sử dụng region của credential và yêu cầu quyền `s3:CreateBucket`.
- `Delete Bucket` yêu cầu bucket phải rỗng và cần quyền `s3:DeleteBucket`.
- `List Buckets` yêu cầu quyền `s3:ListAllMyBuckets`.
- `Create Folder` upload một object marker zero-byte; S3 không có kiểu thư mục gốc.
- `Delete Folder` xóa mọi object có key bắt đầu bằng folder prefix; hãy sử dụng cẩn thận.
- `Get All in Folder` tự động phân trang qua prefix cho đến khi tất cả object được trả về.
- `List Objects` trả về một trang (tối đa 1000 key). Khi `truncated` là true, truyền `next_continuation_token` vào trường Continuation Token của lần gọi tiếp theo.
- `Copy Object` yêu cầu quyền `s3:GetObject` trên nguồn và `s3:PutObject` trên đích.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Credentials](../reference/credentials.md) – Các loại credential và cách sử dụng
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập credential Amazon S3
