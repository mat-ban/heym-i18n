# Lịch sử chỉnh sửa

Lịch sử Chỉnh sửa theo dõi các phiên bản đã lưu của một workflow. Sử dụng tính năng này để xem các thay đổi theo thời gian, so sánh các phiên bản hoặc khôi phục về trạng thái trước đó.

**Lưu ý:** Lịch sử Chỉnh sửa khác với [Lịch sử Thực thi](./execution-history.md). Lịch sử Chỉnh sửa theo dõi các lần **lưu** (thay đổi cấu trúc workflow); Lịch sử Thực thi theo dõi các lần **chạy** (các lần thực thi trước đó).

## Vị trí Truy cập

**Thanh công cụ Editor** → **Lịch sử Chỉnh sửa** (biểu tượng GitBranch)

## Các Phiên bản

Một phiên bản mới được tạo mỗi khi bạn **Lưu** workflow. Danh sách hiển thị:

- **Hiện tại** – Trạng thái đã lưu mới nhất (những gì bạn thấy trên canvas)
- **Phiên bản N** – Các lần lưu trước đó kèm dấu thời gian

Các phiên bản không có thay đổi so với phiên bản trước đó sẽ bị ẩn.

## Chế độ xem Diff

Chọn một phiên bản để xem những gì đã thay đổi so với workflow hiện tại:

| Loại Thay đổi | Mô tả |
|-------------|--------------|
| **Nodes** | Các node được thêm, xóa hoặc sửa đổi |
| **Edges** | Các kết nối được thêm, xóa hoặc sửa đổi |
| **Config** | Các cài đặt cấp workflow (auth, giới hạn tốc độ, v.v.) |

Mở rộng từng thay đổi để xem diff ở cấp trường (ví dụ: những thuộc tính node nào đã thay đổi).

## Xem trước

Để xem workflow trông như thế nào ở một phiên bản trước đó, nhấp vào **Xem trước** bên cạnh Khôi phục.

Một canvas chỉ đọc sẽ mở ra hiển thị các node và edge của phiên bản đó. Bạn có thể di chuyển và thu phóng để khám phá bố cục; không thể thực hiện thay đổi nào từ chế độ xem này.

## Khôi phục

Để khôi phục một phiên bản trước đó:

1. Chọn phiên bản bạn muốn
2. Nhấp vào **Khôi phục**
3. Xác nhận hành động
4. Workflow hiện tại được thay thế bằng phiên bản đã chọn; trang sẽ tải lại

Việc khôi phục tạo ra một trạng thái "hiện tại" mới—bạn có thể khôi phục lại lần nữa nếu cần.

## Xóa Lịch sử

Nhấp vào biểu tượng thùng rác ở tiêu đề hộp thoại để xóa toàn bộ lịch sử phiên bản. Hành động này không thể hoàn tác. Workflow hiện tại vẫn được giữ nguyên; chỉ các phiên bản trước đó bị xóa.

## Khi nào Phiên bản được Tạo

Các phiên bản chỉ được tạo khi bạn **Lưu** (Ctrl/Cmd+S hoặc nút Lưu). Các thay đổi chưa lưu sẽ không được lưu vào Lịch sử Chỉnh sửa cho đến khi bạn lưu.

Các chỉnh sửa skill của Agent được bao gồm trong các ảnh chụp nhanh này. Để duyệt hoặc khôi phục một skill đơn lẻ mà không khôi phục toàn bộ workflow, sử dụng nút **Lịch sử** trên thẻ skill đó trong bảng thuộc tính node Agent. Xem [Node Agent](../nodes/agent-node.md#skill-history).

## Liên quan

- [Lịch sử Thực thi](./execution-history.md) – Các lần chạy trước đó và Đưa lên Canvas
- [Cấu trúc Workflow](./workflow-structure.md) – Định dạng node và edge
- [Tab Workflows](../tabs/workflows-tab.md) – Tạo và quản lý workflow
