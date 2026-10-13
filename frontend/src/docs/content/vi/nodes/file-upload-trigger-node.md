# Trigger tải lên tệp

Node **Trigger Tải File Lên** là điểm vào không có đầu vào cho các workflow cần một **file lớn** (âm thanh, video, tệp lưu trữ) mà không thể nhúng dưới dạng base64 bên trong một yêu cầu JSON. Khi gọi workflow, hệ thống trả về một liên kết tải lên `curl` đã được điền sẵn, dùng một lần; tải một file lên liên kết đó sẽ bắt đầu lượt chạy với file được đính kèm.

Sử dụng node này khi bên gọi — bao gồm cả một agent AI như Claude hay ChatGPT đang chạy trong sandbox — cần chuyển một bản ghi âm 20 MB hoặc một video 75 MB đến một workflow của Heym.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.file.{id,name,mime,size,download_url}`, `$nodeLabel.uploaded_at` |

## Cách hoạt động

Node hoạt động theo hai giai đoạn:

1. **Khởi tạo (Mint).** Khi workflow được gọi qua HTTP (`POST /api/workflows/{id}/execute`), dưới dạng một MCP tool, hoặc qua nút **Run Workflow** trên canvas, lượt chạy **không** thực thi phần thân. Thay vào đó, nó khởi tạo một slot tải lên dùng một lần và trả về:

   ```json
   {
     "file_upload_required": true,
     "curl": "curl -F 'file=@/path/to/your/file' 'https://your-host/api/file-intake/u/<token>'",
     "upload_url": "https://your-host/api/file-intake/u/<token>",
     "expires_at": "2026-06-25T13:00:00+00:00",
     "max_size_mb": 100,
     "allowed_types": ["audio/*"]
   }
   ```

2. **Tải lên + chạy.** Bên gọi chạy lệnh `curl` với file của họ. Endpoint tải lên sẽ xác thực slot, lưu file, chạy workflow **đồng bộ**, và trả về đầu ra của workflow trong phản hồi tải lên. Liên kết này **dùng một lần** — lần tải lên thứ hai sẽ trả về `409`.

Trên canvas, **Run Workflow** hiển thị lệnh `curl` đã khởi tạo trong bảng debug kèm nút sao chép.

## Chạy từ Heym

Có hai nơi chạy trực tiếp một Workflow như vậy trên tệp, thông qua cùng quy trình khởi tạo liên kết và tải lên:

- [Quick Drawer](../reference/quick-drawer.md) hiển thị vùng thả cho tệp. Các lần chạy đó được gắn thẻ `Quick Drawer` trong lịch sử.
- Một [Run widget](../tabs/dashboard-tab.md#run-widgets) trên bảng điều khiển sẽ chạy Workflow trên mỗi tệp được thả vào. Các lần chạy đó được gắn thẻ `dashboard`.

## Tham số

| Tham số | Kiểu | Mặc định | Mô tả |
|-----------|------|---------|-------------|
| `ttlMinutes` | number | `60` | Thời gian liên kết tải lên còn hiệu lực (1–10080 phút / tối đa 7 ngày). |
| `maxSizeMb` | number | `100` | Kích thước file tối đa được chấp nhận. Giới hạn cứng là **100 MB**. |
| `allowedTypes` | string | (trống) | Danh sách cho phép MIME/phần mở rộng tùy chọn, phân tách bằng dấu phẩy, ví dụ: `audio/*, .wav`. Để trống cho phép mọi loại. |

## Các trường đầu ra

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.file.id` | UUID của file đã lưu (một file trên Drive). |
| `$nodeLabel.file.name` | Tên file gốc. |
| `$nodeLabel.file.mime` | Kiểu nội dung được phát hiện. |
| `$nodeLabel.file.size` | Kích thước tính bằng byte. |
| `$nodeLabel.file.download_url` | URL tải xuống đã xác thực cho các node phía sau. |
| `$nodeLabel.uploaded_at` | Dấu thời gian ISO của lần tải lên. |

## Ví dụ

Một workflow phiên âm:

```
File Upload Trigger ("audio")  →  Transcribe ($audio.file)  →  LLM summary  →  Output
```

1. Một agent gọi MCP tool của workflow và nhận được lệnh `curl`.
2. Agent chạy lệnh `curl` với bản ghi âm từ sandbox của nó.
3. Lần tải lên chạy workflow và phản hồi của `curl` chứa bản tóm tắt phiên âm.

## Bảo mật

- URL tải lên nhúng một token có độ ngẫu nhiên cao — token **chính là** khả năng truy cập, vì vậy một agent trong sandbox không cần thông tin xác thực Heym để tải lên. Chỉ có hash của token được lưu phía máy chủ.
- Việc khởi tạo yêu cầu xác thực workflow thông thường, vì vậy chỉ những bên gọi được ủy quyền mới có thể tạo liên kết tải lên.
- Mọi lần khởi tạo và mọi lần thử tải lên (được chấp nhận hoặc bị từ chối — hết hạn, phát lại, quá kích thước, loại không được phép, token không xác định) đều được ghi vào một audit trail chỉ ghi thêm (append-only).
- Các lần tải lên được thực thi dùng một lần, giới hạn bởi TTL, và giới hạn kích thước; các lần tải lên quá kích thước sẽ bị từ chối.

## Ghi chú

- Các kênh gọi HTTP, MCP và canvas chung vẫn chỉ hỗ trợ JSON; node này là cách được hỗ trợ để chấp nhận tải file lên dạng multipart.
- File được tải lên được lưu dưới dạng một file Drive thông thường, vì vậy bất kỳ node phía sau nào chấp nhận tham chiếu file (phiên âm, gửi tệp đính kèm email, v.v.) đều có thể sử dụng `$nodeLabel.file`.
