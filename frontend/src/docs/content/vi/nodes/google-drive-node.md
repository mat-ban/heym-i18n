# Google Drive

Node **Google Drive** liệt kê, tải xuống, cập nhật và xóa các tệp và thư mục trong Google Drive thông qua OAuth2. Node cũng có thể sao chép trực tiếp một tệp Drive vào [Heym Drive](./drive-node.md) chỉ với một thao tác duy nhất.

> **Đây không phải là node [Drive](./drive-node.md).** Node đó là *Heym Drive* — bộ lưu trữ tệp nội bộ của chính Heym. Node này giao tiếp với Google Drive. Thao tác `syncToHeymDrive` chính là cầu nối giữa hai bên.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Credential | Google Drive (OAuth2) |
| Đầu ra | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential Google Drive từ [Credentials](../tabs/credentials-tab.md) |
| `gdOperation` | string | Thao tác: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID thư mục hoặc URL đầy đủ của thư mục Drive. Được dùng bởi `listFolderFiles` và `removeFolder`. Để trống nghĩa là thư mục gốc của Drive. |
| `gdFileId` | expression | ID tệp hoặc URL đầy đủ của Drive/Docs. Được dùng bởi `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Dành cho `listFolderFiles`: số tệp tối đa trả về (mặc định 100). Để trống hoặc `0` sẽ tải toàn bộ thư mục thông qua phân trang. Mỗi tệp được liệt kê bao gồm `size_bytes` khi Drive báo cáo kích thước. |
| `gdQuery` | expression | Dành cho `listFolderFiles`: truy vấn Drive bổ sung được AND với bộ lọc thư mục, ví dụ `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Dành cho `listFolderFiles`: bao gồm cả các tệp trong thùng rác. Mặc định là false. |
| `gdExportFormat` | string | Dành cho `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Để trống nghĩa là tự động. Bị bỏ qua đối với các tệp thông thường. |
| `gdFilename` | expression | Dành cho `syncToHeymDrive`: ghi đè tên tệp được lưu trong Heym Drive. |
| `gdBase64Content` | expression | Dành cho `updateFile`: chuỗi base64 hoặc URL `data:` thay thế nội dung tệp. |
| `gdNewName` | expression | Dành cho `updateFile`: tên tệp mới (đổi tên). |
| `gdNewParentId` | expression | Dành cho `updateFile`: ID hoặc URL thư mục đích (di chuyển). |
| `gdPermanentDelete` | boolean | Dành cho `removeFile` / `removeFolder`: khi false (mặc định) mục sẽ được chuyển vào thùng rác và có thể khôi phục; khi true mục sẽ bị xóa vĩnh viễn. |

## ID tệp và thư mục

`gdFileId`, `gdFolderId` và `gdNewParentId` chấp nhận **ID thuần** hoặc **URL đầy đủ** — Heym sẽ tự động trích xuất ID. Tất cả các dạng sau đều hoạt động:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets và Slides

Các tài liệu gốc của Google **không có byte nào để tải xuống**. Chúng là các bản ghi trên máy chủ của Google, không phải tệp — Drive API trả về lỗi `403 Only files with binary content can be downloaded` nếu bạn yêu cầu nội dung thô của chúng.

`downloadFile` và `syncToHeymDrive` tự động phát hiện các tài liệu này và **export** thay vì tải xuống, do đó không có thao tác nào thất bại chỉ vì mục tiêu là một Google Doc:

| Nguồn | Định dạng export mặc định |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Bất kỳ loại gốc Google nào khác | PDF |

Đặt **Export Format** để ghi đè định dạng đích. Cài đặt này bị bỏ qua đối với các tệp được tải lên thông thường, vốn luôn được tải xuống nguyên trạng.

## Các thao tác

| Thao tác | Bắt buộc | Mô tả |
|-----------|----------|-------------|
| `listFolderFiles` | — (thư mục trống = thư mục gốc) | Liệt kê các tệp trong một thư mục, với bộ lọc truy vấn tùy chọn |
| `downloadFile` | `gdFileId` | Tải byte của tệp dưới dạng base64, tự động export các tài liệu gốc |
| `syncToHeymDrive` | `gdFileId` | Tải xuống từ Google Drive và lưu kết quả vào Heym Drive |
| `updateFile` | `gdFileId` + ít nhất một trong nội dung / tên / thư mục cha | Thay thế nội dung, đổi tên và/hoặc di chuyển |
| `removeFile` | `gdFileId` | Chuyển vào thùng rác (mặc định) hoặc xóa vĩnh viễn một tệp |
| `removeFolder` | `gdFolderId` | Chuyển vào thùng rác (mặc định) hoặc xóa vĩnh viễn một thư mục cùng nội dung bên trong |

### Xóa mặc định có thể khôi phục

`removeFile` và `removeFolder` di chuyển mục vào **thùng rác Google Drive**, nơi có thể khôi phục lại. Đây là mặc định an toàn cho những thứ có thể chạy theo lịch trình hoặc bên trong một [Loop](./loop-node.md).

Bật **Delete permanently** sẽ phá hủy mục đó mà không thể khôi phục. Đối với `removeFolder`, điều đó cũng phá hủy mọi thứ bên trong thư mục.

Node cũng kiểm tra loại mục tiêu: `removeFile` từ chối một thư mục và `removeFolder` từ chối một tệp, do đó một ID bị gõ sai không thể âm thầm xóa nhầm thứ khác.

### updateFile để nguyên các trường trống

`updateFile` là thao tác cập nhật, không phải thay thế. Điền bất kỳ tổ hợp nào của nội dung, tên mới và thư mục mới — bất cứ thứ gì bạn để trống sẽ không bị động đến. Cần ít nhất một trong ba trường này.
## Thiết lập Credential

Google Drive sử dụng mô hình **OAuth2 "Bring Your Own App"**. Bạn cung cấp thông tin xác thực OAuth2 Google Cloud của riêng mình.

> **Credential này cấp toàn quyền truy cập Drive.** Heym yêu cầu scope `https://www.googleapis.com/auth/drive` vì node thao tác trên các tệp bạn đã sở hữu. Scope hẹp hơn `drive.file` chỉ nhìn thấy các tệp do chính ứng dụng tạo ra, điều này sẽ khiến việc liệt kê, cập nhật và xóa các tệp hiện có của bạn trở nên bất khả thi. Xem [Chia sẻ Credential](../reference/credentials-sharing.md) trước khi chia sẻ credential này với một nhóm.

**Cấu hình backend:** Đặt **`FRONTEND_URL`** trên backend Heym thành URL công khai của ứng dụng. URI chuyển hướng OAuth luôn là `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — nó chỉ được suy ra từ cài đặt này, không phải từ các header của request.

1. Truy cập [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → bật **Google Drive API**.
2. Truy cập **Credentials** → **Create Credentials** → **OAuth client ID** → chọn **Web application**.
3. Trong **Authorized redirect URIs**, thêm chính xác `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Sao chép **Client ID** và **Client Secret**.
5. Trong Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, dán cả hai giá trị, sau đó nhấp **Connect** và phê duyệt quyền truy cập trong cửa sổ bật lên.

## Output

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

`size_bytes` là `null` đối với thư mục và các tệp gốc của Google, vì chúng không báo cáo kích thước.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Đối với một tệp thông thường, `exported` là `false` và `export_format` là `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

`id` là ID tệp **Heym Drive** mới, khác với `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

`deleted` là `"trashed"` hoặc `"permanent"`.

## Ví dụ: sao lưu một thư mục Drive vào Heym Drive

1. **[Cron](./cron-node.md)** — chạy hàng ngày.
2. **Google Drive** — `listFolderFiles` trên thư mục nguồn, với `gdQuery` được đặt thành `mimeType='application/pdf'` nếu bạn chỉ muốn các tệp PDF.
3. **[Loop](./loop-node.md)** — lặp qua `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` với `gdFileId` được đặt thành `$BackupLoop.item.id` và `gdFilename` được đặt thành `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — đăng bản tóm tắt những gì đã được sao lưu.

## Ghi chú

- Mọi trường văn bản đều chấp nhận biểu thức `$`, vì vậy ID và tên tệp có thể đến từ các node trước đó.
- Shared drive được hỗ trợ — node đặt `supportsAllDrives` trên mọi request.
- Các lượt tải xuống được kiểm tra kích thước dựa trên cài đặt `FILE_MAX_SIZE_MB` của backend.
- Gắn node này vào đầu vào công cụ của node [Agent](./agent-node.md) và sử dụng biểu tượng bot trên bất kỳ trường nào để cho phép agent điền nó tại thời điểm chạy.

## Xem thêm

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Credentials](../reference/credentials.md)
- [Chia sẻ Credential](../reference/credentials-sharing.md)
