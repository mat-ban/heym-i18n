# Phím tắt

Heym cung cấp các phím tắt trên trình chỉnh sửa workflow và canvas để tăng tốc các thao tác thường dùng.

## Phím tắt chung trong trình chỉnh sửa

Các phím tắt này hoạt động ở mọi nơi trong trình chỉnh sửa workflow.

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Mở Command Palette |
| `Ctrl + I` / `Cmd + I` | Bật/tắt bảng [AI Assistant](./ai-assistant.md) (hoạt động cả khi đang nhập) |
| `Ctrl + Enter` / `Cmd + Enter` | Chạy workflow hiện tại |
| `Ctrl + S` / `Cmd + S` | Lưu workflow |
| `Ctrl + Z` / `Cmd + Z` | Hoàn tác |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Làm lại |
| `Ctrl + Y` / `Cmd + Y` | Làm lại (thay thế) |
| `Escape` | Đóng các lớp phủ, hộp thoại và bảng đang mở |

## Phím tắt trên Canvas

Các phím tắt này áp dụng khi canvas đang được focus (không có ô nhập văn bản nào đang hoạt động).

### Chọn & Điều hướng

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Chọn tất cả các node |
| `Shift` (giữ) | Kéo để chọn nhiều node |
| `Ctrl` / `Cmd` (giữ) | Nhấp để thêm từng node vào vùng chọn |
| `Escape` | Bỏ chọn tất cả các node; đóng tìm kiếm node nội tuyến |

### Chỉnh sửa Node

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Sao chép (các) node đã chọn |
| `Ctrl + X` / `Cmd + X` | Cắt (các) node đã chọn |
| `Ctrl + V` / `Cmd + V` | Dán (các) node |
| `Delete` hoặc `Backspace` | Xóa (các) node và/hoặc (các) cạnh đã chọn |
| `D` | Bật/tắt trạng thái kích hoạt / vô hiệu hóa của (các) node đã chọn |
| `P` | Bật/tắt dữ liệu đã ghim (pinned data) trên node đã chọn |

### Tìm kiếm Node nội tuyến

Nhập bất kỳ ký tự in được nào trên canvas (khi không có ô nhập văn bản nào đang được focus) sẽ mở cửa sổ tìm kiếm node nội tuyến. Ký tự được nhập sẽ trở thành ký tự đầu tiên của truy vấn tìm kiếm.

| Phím tắt | Hành động |
|----------|--------|
| Bất kỳ ký tự in được nào | Mở tìm kiếm node nội tuyến và bắt đầu nhập |
| `Backspace` | Xóa ký tự cuối cùng khỏi truy vấn tìm kiếm |
| `Escape` | Đóng tìm kiếm node nội tuyến |

## Command Palette (`Ctrl + K`)

Command Palette khả dụng từ trình chỉnh sửa, dashboard, tài liệu và các chế độ xem evals. Nó cho phép bạn nhanh chóng điều hướng đến các workflow, tab và trang tài liệu mà không cần rời khỏi bàn phím.

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Mở Command Palette |
| `↑` / `↓` | Điều hướng danh sách kết quả |
| `Tab` / `Shift + Tab` | Điều hướng danh sách kết quả |
| `Enter` | Mở mục đã chọn |
| `Escape` | Đóng palette |

## Phím tắt trên Dashboard

Các phím tắt này hoạt động trên tab Workflows khi không có ô nhập văn bản nào khác đang hoạt động.

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Focus vào ô tìm kiếm workflow |
| `Escape` | Xóa nội dung tìm kiếm workflow khi ô tìm kiếm có văn bản |

## Phím tắt trên bảng Properties

Các phím tắt này hoạt động khi một node đang được chọn và bảng properties đang mở.

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Mở sub-workflow được liên kết trong tab mới (chỉ với node Execute) |

## Phím tắt trong hộp thoại Evaluate

Các phím tắt này hoạt động khi hộp thoại Evaluate đang mở.

| Phím tắt | Hành động |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Áp dụng biểu thức và đóng hộp thoại |
| `Ctrl + Z` / `Cmd + Z` | Hoàn tác các thay đổi trong trình chỉnh sửa biểu thức |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Làm lại các thay đổi trong trình chỉnh sửa biểu thức |
| `Ctrl + Y` / `Cmd + Y` | Làm lại các thay đổi trong trình chỉnh sửa biểu thức (thay thế) |

## Phím tắt trong History & Traces

Các phím tắt này khả dụng trong hộp thoại Execution History và bảng Traces.

| Phím tắt | Hành động |
|----------|--------|
| `S` | Bật/tắt ô tìm kiếm để lọc các mục |

## Liên quan

- [Tính năng Canvas](./canvas-features.md) – Ghim dữ liệu, bật/tắt, trích xuất thành sub-workflow
- [Cấu trúc Workflow](./workflow-structure.md) – Định dạng node và cạnh
- [Node Execute](../nodes/execute-node.md) – Gọi các sub-workflow (`Ctrl + Shift + O`)
- [Bắt đầu nhanh](../getting-started/quick-start.md) – Xây dựng workflow đầu tiên của bạn
