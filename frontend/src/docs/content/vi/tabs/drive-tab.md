# Tab Drive

Tab Drive hiển thị tất cả các tệp được tạo bởi các skill trong các workflow của bạn.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Xem bản demo Drive</a></p>

## Tổng quan

Các tệp được tạo bởi skill (PDF, DOCX, CSV, hình ảnh, v.v.) được tự động lưu trữ và liệt kê trong tab Drive. Mỗi tệp hiển thị tên, loại, kích thước, node nguồn, ngày tạo và trạng thái chia sẻ với team.

## Tính năng

- **Tìm kiếm** - Lọc tệp theo tên, loại hoặc node nguồn
- **Sao chép file ID** - Sao chép UUID của tệp vào clipboard, sẵn sàng dán vào node [Drive](../nodes/drive-node.md) hoặc [Converter](../nodes/converter-node.md)
- **Tải xuống** - Tải xuống có xác thực cho các tệp của bạn và các tệp được chia sẻ với bạn thông qua team
- **Chia sẻ** - Tạo liên kết tải xuống có thể chia sẻ với tùy chọn bảo vệ bằng mật khẩu và thời hạn, hoặc chia sẻ tệp ở chế độ chỉ đọc với các team hiện tại của bạn
- **Xóa** - Xóa tệp và các liên kết chia sẻ của chúng
- **Xóa tất cả** - Xóa mọi tệp và các liên kết chia sẻ của chúng sau khi xác nhận
- **Hành động hàng loạt** - Chọn nhiều tệp bằng checkbox (Shift-click để chọn một dải) và áp dụng cùng một hành động cho tất cả cùng lúc
- **Phân trang** - Duyệt qua các bộ sưu tập tệp lớn, với bộ chọn số hàng mỗi trang (25 / 50 / 100 / Tất cả)

## Hành động hàng loạt

Các tệp bạn sở hữu hiển thị checkbox ở đầu hàng của chúng (các tệp được chia sẻ với bạn qua team là chỉ đọc và không thể chọn). Chọn nhiều hàng — hoặc sử dụng checkbox ở tiêu đề để chọn toàn bộ trang, và **Shift-click** để chọn một dải — sau đó sử dụng thanh hành động hàng loạt xuất hiện phía trên danh sách:

- **Tải xuống ZIP** đóng gói mọi tệp đã chọn vào một tệp ZIP duy nhất và tải xuống
- **Hành động hàng loạt** mở một hộp thoại duy nhất để áp dụng một cài đặt cho mọi tệp đã chọn:
  - **Chia sẻ tất cả với team của tôi** / **Xóa chia sẻ với team** chỉ với một cú nhấp
  - **Tạo liên kết chia sẻ cho mỗi tệp** sử dụng cùng cài đặt mật khẩu, thời hạn và số lần tải xuống tối đa
- **Xóa** xóa mọi tệp đã chọn và các liên kết chia sẻ của chúng sau khi xác nhận
- **Bỏ chọn** bỏ chọn tất cả

Hộp thoại báo cáo số lượng tệp đã áp dụng (các tệp bạn không sở hữu sẽ bị bỏ qua). Sử dụng tùy chọn **Tất cả** trong bộ chọn số hàng mỗi trang để tải mọi tệp trên một trang và chọn trên toàn bộ Drive của bạn. Nhập vào ô tìm kiếm sẽ tự động chuyển bộ chọn số hàng mỗi trang sang **Tất cả** để tìm kiếm bao phủ mọi tệp, không chỉ trang hiện tại; xóa tìm kiếm sẽ khôi phục lựa chọn trước đó của bạn.

## Chia sẻ

Tạo liên kết chia sẻ với:
- **Không xác thực** - URL tải xuống công khai dựa trên token
- **Basic Auth** - Liên kết được bảo vệ bằng mật khẩu (tên người dùng: `file`)
- **Thời hạn** - Thời hạn tùy chọn dựa trên thời gian
- **Giới hạn tải xuống** - Số lần tải xuống tối đa tùy chọn

Bật **Chia sẻ với team của tôi** trên một tệp để làm cho nó hiển thị với tất cả các team mà bạn hiện đang là thành viên. Các thành viên team được chia sẻ có quyền truy cập chỉ đọc; các hành động quản lý chỉ dành cho chủ sở hữu.

## Truy cập Agent Skill

Các skill trên node Agent có thể chọn đọc các tệp Drive. Khi **Bật tệp Drive** được bật cho một skill, mã Python của nó có thể đọc các tệp Drive có thể truy cập bằng file id hoặc tên tệp chính xác thông qua trình trợ giúp `heym_drive.py` được tạo. Cài đặt này mặc định tắt.

Xem [Tham chiếu Drive](../reference/drive.md) để biết chi tiết đầy đủ.

## Liên quan

- [Node Drive](../nodes/drive-node.md) - Liệt kê tệp, truy xuất metadata, chia sẻ với team hoặc thay đổi ràng buộc chia sẻ từ một workflow
- [Tạo tệp](../reference/file-generation.md) - Cách các skill tạo tệp
- [Tham chiếu Drive](../reference/drive.md) - Liên kết chia sẻ, token và dọn dẹp
- [Portal](../reference/portal.md) - Liên kết tệp trong phản hồi chat của portal
