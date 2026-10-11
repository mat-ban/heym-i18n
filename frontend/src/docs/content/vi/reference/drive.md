# Drive

Tab Drive cung cấp một nơi trung tâm để xem, quản lý và chia sẻ tất cả các tệp được tạo ra bởi các skill.

## Truy cập Drive

Điều hướng đến tab **Drive** trong dashboard. Tất cả các tệp được tạo ra bởi các skill trong workflow của bạn sẽ xuất hiện ở đây, được sắp xếp theo ngày tạo.

## Danh sách tệp

Danh sách tệp hiển thị:

- **Name** - Tên tệp gốc kèm biểu tượng theo loại tệp
- **Type** - MIME type của tệp (ví dụ: pdf, csv, docx)
- **Size** - Kích thước tệp ở định dạng dễ đọc
- **Source** - Nhãn node đã tạo ra tệp
- **Date** - Thời điểm tệp được tạo
- **Actions** - Các nút tải xuống, chia sẻ và xóa

## Thao tác hàng loạt

Mỗi tệp bạn sở hữu có một checkbox ở đầu hàng. Các tệp được chia sẻ với bạn thông qua team chỉ ở chế độ chỉ đọc và không thể chọn. Chọn nhiều tệp (Shift-click để chọn một dải liền kề; checkbox ở tiêu đề sẽ chọn toàn bộ trang) để hiển thị thanh thao tác hàng loạt phía trên danh sách, sau đó nhấp vào **Bulk actions** để mở một hộp thoại áp dụng cùng một cài đặt cho mọi tệp đã chọn:

- **Share all with my teams** / **Remove team sharing** — bật/tắt chia sẻ với team cho tất cả các tệp đã chọn cùng lúc
- **Create share link for each file** — tạo share link trên mỗi tệp đã chọn với cùng giá trị expiry, password và max-downloads

Hộp thoại sẽ báo cáo số lượng tệp đã được áp dụng; các tệp bạn không sở hữu sẽ bị bỏ qua. Bộ chọn số hàng mỗi trang (25 / 50 / 100 / **All**) ở cuối danh sách cho phép bạn tải nhiều tệp hơn trên một trang để có thể chọn trên toàn bộ Drive của bạn.

## Chia sẻ tệp

Nhấp vào biểu tượng **Share** để mở hộp thoại chia sẻ. Bạn có thể tạo nhiều share link cho mỗi tệp với các cấu hình khác nhau và tùy chọn chia sẻ tệp với các team hiện tại của bạn.

### Public Link (dựa trên Token)

Tạo một share link không có password. Bất kỳ ai có link đều có thể tải xuống tệp.

### Password-Protected Link (Basic Auth)

Đặt password khi tạo share. URL tải xuống sử dụng HTTP Basic Authentication - trình duyệt sẽ yêu cầu username (`file`) và password khi link được mở.

### Tùy chọn link

- **Expires (hours)** - Tùy chọn đặt thời gian hết hạn
- **Max downloads** - Tùy chọn giới hạn số lần tải xuống
- Cả hai có thể được kết hợp để kiểm soát tối đa

### Share With My Teams

Bật **Share with my teams** để cấp quyền truy cập chỉ đọc cho tất cả các team mà bạn hiện đang là thành viên. Các thành viên trong team có thể xem và tải xuống tệp từ Drive và sử dụng các thao tác Drive node theo hướng đọc, nhưng chỉ chủ sở hữu tệp mới có thể xóa tệp, tạo hoặc thu hồi public link, hoặc thay đổi password/TTL/giới hạn tải xuống.

Cài đặt này áp dụng riêng cho từng tệp. Nếu bạn tham gia hoặc tạo một team khác sau này, hãy bật lại chia sẻ hoặc chạy thao tác `shareWithMyTeams` của Drive node để thêm team đó. Sử dụng `unshareWithMyTeams` để xóa chia sẻ với team khỏi tệp trong một workflow.

### Quản lý chia sẻ

Hộp thoại chia sẻ hiển thị tất cả các share link hiện có với:
- Số lần tải xuống hiện tại
- Trạng thái hết hạn
- Basic Auth có được bật hay không
- Các nút sao chép và thu hồi

## Link tệp trong Chat & Portal

Khi một skill tạo ra các tệp trong quá trình thực thi workflow thông qua chat Portal hoặc Quick Drawer, các link tải xuống sẽ tự động xuất hiện trong phản hồi. Người dùng có thể nhấp để tải xuống trực tiếp.

## Lưu trữ

Các tệp được tạo ra được lưu trữ trên filesystem của server tại `data/files/`. Trong các triển khai Docker, thư mục này được mount như một volume để đảm bảo tính bền vững.

## Quản lý tệp từ Workflow

[Drive node](../nodes/drive-node.md) cho phép bạn quản lý các tệp Drive theo lập trình từ bên trong một workflow. Sử dụng nó để:

- **List** các tệp của bạn và trả về metadata như tên tệp, MIME type, kích thước, nguồn và URL tải xuống
- **Delete** một tệp sau khi nó đã được gửi đến người dùng
- **Share hoặc unshare với các team của bạn** để các thành viên trong team có thể đọc và tải xuống chỉ khi chia sẻ với team còn tồn tại
- **Set a password** trên link tải xuống
- **Set a TTL** để link hết hạn sau N giờ
- **Set a max downloads** để giới hạn số lần tải xuống

Việc chuyển đổi tệp sang định dạng khác là nhiệm vụ của [Converter node](../nodes/converter-node.md), với `conversion: "fileConvert"`. Nó đọc một tệp Drive và lưu kết quả đã chuyển đổi thành một tệp mới.

Tham chiếu tệp bằng ID từ output của skill: `$agentLabel._generated_files[0].id`

Xem [tài liệu Drive node](../nodes/drive-node.md) để biết chi tiết cấu hình.

## Đọc tệp Drive từ Skill

Các agent skill có thể chọn đọc từ Drive bằng cài đặt **Enable Drive files** trên skill card. Khi được bật, runtime của skill sẽ bao gồm một helper `heym_drive.py` được tạo tự động. Mã skill có thể import các helper như `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` và `list_drive_files`.

Việc đọc từ Drive được giới hạn ở các tệp mà actor của workflow có thể truy cập: các tệp sở hữu và các tệp được chia sẻ với actor thông qua team. Sử dụng file id để tra cứu chính xác, hoặc tên tệp chính xác khi người dùng tham chiếu đến tệp theo tên. Tra cứu theo tên tệp trả về tệp có thể truy cập mới nhất với tên đó; `list_drive_files(filename="...")` trả về tất cả các kết quả khớp.

## Liên quan

- [Drive Node](../nodes/drive-node.md) - Các thao tác workflow (list, get, delete, password, TTL, max downloads, chia sẻ với team)
- [Drive Tab](../tabs/drive-tab.md) - Duyệt tệp trong dashboard
- [File Generation](./file-generation.md) - Cách `_generated_files` và URL tải xuống được tạo ra

## Dọn dẹp
Các share token hết hạn được tự động dọn dẹp hàng ngày. Bản thân các tệp vẫn tồn tại cho đến khi được xóa thủ công thông qua tab Drive. Sử dụng **Clear All** để xóa mọi tệp và share link của chúng trong một thao tác.
