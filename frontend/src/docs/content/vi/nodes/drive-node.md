# Drive

Node **Drive** quản lý các tệp được tạo bởi các skill trực tiếp trong một workflow. Sử dụng node này để truy xuất tệp, tải tệp từ URL bên ngoài, xóa chúng, chia sẻ hoặc hủy chia sẻ với các team của bạn, hoặc cập nhật các ràng buộc truy cập (mật khẩu, thời hạn, giới hạn tải xuống) một cách lập trình.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (thay đổi tùy theo thao tác) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `driveOperation` | string | Thao tác: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID của tệp Drive cần quản lý (tất cả thao tác ngoại trừ `getAll`, `downloadUrl` và `save`) |
| `driveLimit` | number | Số tệp tối đa trả về (chỉ dùng cho `getAll`; để trống nghĩa là không giới hạn) |
| `driveSourceUrl` | expression | URL để tải về và lưu trữ trong Drive (chỉ dùng cho `downloadUrl`) |
| `driveFilename` | expression | Tên tệp đầy đủ bao gồm phần mở rộng (chỉ dùng cho `save`, ví dụ: `1.mp3`) |
| `driveBase64Content` | expression | Chuỗi base64 thô hoặc data URL để giải mã và lưu trữ (chỉ dùng cho `save`) |
| `driveIncludeBinary` | boolean | Bao gồm nội dung tệp dưới dạng base64 trong đầu ra (chỉ dùng cho `get`) |
| `drivePassword` | expression | Mật khẩu để đặt trên access token (chỉ dùng cho `setPassword`) |
| `driveTtlHours` | number | Số giờ cho đến khi liên kết tải xuống hết hạn (chỉ dùng cho `setTtl`) |
| `driveMaxDownloads` | number | Số lượt tải xuống tối đa được phép (chỉ dùng cho `setMaxDownloads`) |

## Lấy File ID

Khi một skill tạo tệp, đầu ra bao gồm một mảng `_generated_files`. Mỗi mục bao gồm một trường `id`:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Tham chiếu File ID bằng: `$agentLabel._generated_files[0].id`

## Các thao tác

| Thao tác | Trường bắt buộc | Mô tả |
|-----------|----------------|-------------|
| `get` | driveFileId | Truy xuất metadata của tệp (và tùy chọn nội dung nhị phân) từ Drive |
| `getAll` | không có | Liệt kê các tệp Drive có thể đọc được thuộc sở hữu và được chia sẻ với team, kèm metadata như tên tệp, kiểu MIME, kích thước, nguồn và URL tải xuống |
| `downloadUrl` | driveSourceUrl | Tải một tệp từ URL bên ngoài và lưu trữ trong Drive |
| `save` | driveFilename, driveBase64Content | Giải mã nội dung base64 và lưu trữ dưới dạng tệp Drive |
| `delete` | driveFileId | Xóa tệp và tất cả access token của nó khỏi ổ đĩa và cơ sở dữ liệu |
| `setPassword` | driveFileId, drivePassword | Thay thế token công khai mặc định bằng một token được bảo vệ bằng mật khẩu |
| `setTtl` | driveFileId, driveTtlHours | Thay thế token công khai mặc định bằng một token hết hạn sau N giờ |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Thay thế token công khai mặc định bằng một token giới hạn N lượt tải xuống |
| `shareWithMyTeams` | driveFileId | Chia sẻ tệp ở chế độ chỉ đọc với tất cả các team mà chủ sở hữu workflow hiện đang thuộc về |
| `unshareWithMyTeams` | driveFileId | Xóa tất cả các chia sẻ team khỏi tệp |

> **Lưu ý:** Các thao tác `set*` sẽ xóa token công khai mặc định (không có ràng buộc) và tạo một token mới với ràng buộc được chỉ định. `download_url` đã cập nhật được bao gồm trong đầu ra.
> **Chia sẻ team:** `shareWithMyTeams` tạo các chia sẻ rõ ràng cho các team hiện tại của chủ sở hữu. Các team trong tương lai sẽ không được thêm tự động trừ khi thao tác được chạy lại. `unshareWithMyTeams` xóa tất cả các chia sẻ team khỏi tệp.

## Ví dụ — Tải tệp từ URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Tham chiếu tệp đã lưu trữ ở các node sau: `$fetchReport.id`, `$fetchReport.download_url`

Tên tệp được lấy từ header phản hồi `Content-Disposition`; nếu không có, nó được suy ra từ đường dẫn URL.

## Ví dụ — Lưu đầu vào Base64 vào Drive

Sử dụng trường hợp này khi một node đầu vào văn bản (hoặc bất kỳ node thượng nguồn nào) cung cấp nội dung tệp base64:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Tham chiếu tệp đã lưu trữ ở các node sau: `$saveAudio.id`, `$saveAudio.download_url`

`driveBase64Content` chấp nhận một chuỗi base64 thô hoặc một data URL dạng `data:...;base64,...`. Kiểu MIME được suy ra từ phần mở rộng của tên tệp.

## Ví dụ — Lấy tệp và sử dụng nhị phân trong Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Tham chiếu nội dung base64 ở các node sau: `$fetchImage.file_base64`

Hình ảnh được trả về qua `file_base64` sẽ được hiển thị trực tiếp trong bảng debug khi bạn chạy workflow.

## Ví dụ — Liệt kê các tệp Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Tham chiếu tệp đầu tiên được trả về ở các node sau: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Ví dụ — Xóa File Sau Khi Xử Lý

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Ví dụ — Đặt Mật khẩu cho File Đã Tạo

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Ví dụ — Đặt Thời hạn (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Ví dụ — Giới hạn Lượt tải xuống

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Ví dụ — Chia sẻ với Nhóm của Tôi

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Thành viên nhóm có thể xem và tải xuống file từ Drive cũng như sử dụng các thao tác đọc trong workflow. Họ không thể xóa, chia sẻ lại hoặc thay đổi các ràng buộc của liên kết công khai.

## Ví dụ — Hủy Chia sẻ với Nhóm của Tôi

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Chuyển đổi một file

Việc chuyển đổi định dạng đã được chuyển sang node [Converter](./converter-node.md). Lưu trữ hoặc truy xuất file bằng Drive, sau đó chuyển id của nó cho node converter:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

File gốc được giữ nguyên và file đã chuyển đổi được lưu trữ dưới dạng một file Drive mới.

## Truy cập Đầu ra

**get:**
- `$nodeLabel.id` — UUID của file
- `$nodeLabel.filename` — tên file
- `$nodeLabel.mime_type` — kiểu MIME (ví dụ: `image/png`)
- `$nodeLabel.size_bytes` — kích thước file tính bằng byte
- `$nodeLabel.download_url` — URL tải xuống công khai
- `$nodeLabel.file_base64` — nội dung file được mã hóa base64 (chỉ khi **Include binary content** được bật)

**getAll:**
- `$nodeLabel.files` — Mảng các đối tượng metadata của file
- `$nodeLabel.count` — Số lượng file được trả về
- `$nodeLabel.files[0].id` — UUID của file
- `$nodeLabel.files[0].filename` — Tên file
- `$nodeLabel.files[0].mime_type` — Kiểu MIME
- `$nodeLabel.files[0].size_bytes` — Kích thước file tính bằng byte
- `$nodeLabel.files[0].download_url` — URL tải xuống công khai khi tồn tại token công khai
- `$nodeLabel.files[0].metadata` — Đối tượng metadata đã lưu trữ
- `$nodeLabel.files[0].created_at` — Dấu thời gian tạo file

**downloadUrl:**
- `$nodeLabel.id` — UUID của file mới được lưu trữ
- `$nodeLabel.filename` — tên file (từ `Content-Disposition` hoặc đường dẫn URL)
- `$nodeLabel.mime_type` — kiểu MIME được phát hiện từ phản hồi hoặc phần mở rộng file
- `$nodeLabel.size_bytes` — kích thước file tính bằng byte
- `$nodeLabel.download_url` — URL tải xuống Drive cho file đã lưu trữ

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID của file đã xóa

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID của file
- `$nodeLabel.download_url` — URL token truy cập mới với ràng buộc đã được áp dụng

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID của file
- `$nodeLabel.shared_team_count` — Số lượng chia sẻ nhóm sau thao tác

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID của file
- `$nodeLabel.shared_team_count` — `0` sau thao tác

## Quyền sở hữu

Các thao tác chỉ dành cho chủ sở hữu yêu cầu file phải thuộc về chủ sở hữu workflow. Các thao tác đọc (`get`, `getAll`) cũng có thể truy cập các file được chia sẻ với chủ sở hữu workflow thông qua một nhóm.

## Liên quan

- [File Generation](../reference/file-generation.md) - Cách các skill tạo file và đầu ra `_generated_files`
- [Drive Tab](../reference/drive.md) - Quản lý file trực quan trong dashboard
- [Agent Node](./agent-node.md) - Chạy các skill tạo file
- [Converter Node](./converter-node.md) - Chuyển đổi file đã lưu trữ sang định dạng khác, hoặc OCR nó thành văn bản
- [Expression DSL](../reference/expression-dsl.md) - Cú pháp biểu thức cho các giá trị động
