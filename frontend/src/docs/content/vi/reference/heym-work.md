# Heym Work

**Heym Work** là giao diện thứ hai dành cho các nhóm kinh doanh, được xây dựng trên nền tảng Heym. Người dùng mô tả công việc bằng ngôn từ của mình, trả lời một số câu hỏi và nhận được workflow do Heym xây dựng và kiểm thử hoàn chỉnh. Họ làm việc trên các trang được thiết kế riêng, xử lý phê duyệt và theo dõi từng lượt chạy gắn liền với tên của người khởi tạo. Heym vận hành mọi tác vụ ở chế độ nền.

Heym Work hoạt động dưới dạng container độc lập bên cạnh Heym, với giấy phép riêng từ đội ngũ Heym. Tìm hiểu thêm và yêu cầu bản dùng thử tại [heym.run/enterprise](https://heym.run/enterprise). Xem [video giới thiệu Heym Work](https://youtu.be/5Z2gGo6bcpU) để nắm bắt thông tin trong hai phút.

## Lợi ích dành cho nhóm kinh doanh

| Khu vực | Chức năng |
|---------|-----------|
| **Chat** | Mô tả công việc bằng văn bản hoặc giọng nói. Heym hỏi các thông tin cần thiết, xây dựng workflow, kiểm thử và đánh dấu là Đã xác minh. |
| **Flows** | Người chỉnh sửa xây dựng một flow từ các lựa chọn thay vì trên canvas: điều gì bắt đầu nó, bản nháp AI tùy chọn và các hành động trong Slack, Google Sheets và email. Câu trả lời từ Slack tiếp tục lần chạy và các phê duyệt cũng chờ trong Hoạt động. Xem [Flows](#flows). |
| **Trang** | Các trang tiện ích được ghim: số liệu, biểu đồ, bảng có gắn thẻ trạng thái, khu vực thả tệp và phê duyệt. Một hàng trong bảng có thể mở trang chi tiết riêng. |
| **Phê duyệt** | Các đánh giá từ bước [Human-in-the-Loop](./human-in-the-loop.md) chờ xử lý trong Hoạt động và trên các trang, với các tùy chọn Phê duyệt, Yêu cầu thay đổi và Từ chối. |
| **Hoạt động** | Toàn bộ lượt chạy kèm theo người khởi tạo và phiên bản thực thi. |
| **Vai trò** | Chủ sở hữu, Người chỉnh sửa và Người xem. Đăng nhập được thực hiện qua tính năng [Single Sign-On](./sso.md) mà Heym đã hỗ trợ. |
| **Phiên bản chuyên ngành** | Các phiên bản dành cho ngành pháp lý, giáo dục, tài chính, logistics, năng lượng và thương mại điện tử đi kèm trang dựng sẵn, dữ liệu mẫu và workflows chuyên biệt. |

## Flows

**Flows** nằm trong menu của Heym Work dành cho Người chỉnh sửa và Chủ sở hữu. Flow được tạo từ các lựa chọn thay vì các node và Heym Work lưu nó dưới dạng workflow Heym thông thường thông qua API của Heym, dưới danh nghĩa người đã xây dựng nó. Các quy tắc truy cập, Lịch sử chỉnh sửa và đồng bộ hóa trigger của Heym áp dụng giống như trong trình chỉnh sửa và mỗi lần chạy đều hiển thị trong Hoạt động như bất kỳ lần chạy nào khác.

| Phần | Lựa chọn |
|---|---|
| **Điều gì bắt đầu nó** | Theo yêu cầu, theo lịch biểu, khi có tin nhắn Slack, khi tab Google Sheets thay đổi (các hàng được thêm, thay đổi hoặc xóa) hoặc khi email đến hộp thư đến. Trigger trang tính và email kiểm tra mỗi 1, 5, 15 hoặc 60 phút một lần. |
| **Bản nháp AI** (tùy chọn) | Mô hình và hướng dẫn sẽ chuyển đổi những gì đã bắt đầu flow thành văn bản cho các bước sau đó. Một flow không bắt đầu từ trang tính hoặc email có thể đọc các tin nhắn Slack gần đây từ kênh hoặc chuỗi tin nhắn trước. |
| **Điều gì xảy ra tiếp theo** | Các hành động theo thứ tự, trong bất kỳ công cụ nào trong số ba công cụ, bất kể điều gì đã bắt đầu flow. **Slack:** tin nhắn kênh, tin nhắn trực tiếp, biểu mẫu, tin nhắn có nút, phê duyệt, trả lời chuỗi, cập nhật tin nhắn và kết quả cuối cùng. **Google Sheets:** thêm một hàng hoặc cập nhật hàng đã thay đổi. **Email:** gửi email. |

- **Câu trả lời tiếp tục lần chạy.** Phê duyệt, nút bấm hoặc biểu mẫu sẽ tạm dừng lần chạy cho đến khi ai đó trả lời trong Slack. Phê duyệt cũng chờ trong Hoạt động và quyết định ở một trong hai nơi sẽ xóa các nút khỏi tin nhắn Slack. Các bước Slack sau đó vẫn nằm trong chuỗi tin nhắn đầu tiên.
- **Một thẻ Kết nối duy nhất.** Mỗi flow hiển thị không gian làm việc Slack, tài khoản Google Sheets và các hộp thư đến mà nó đọc và gửi qua đó. Chúng là thông tin đăng nhập của Heym: **Slack Bot** (mã thông báo bot, `xoxb-…`), **Google Sheets**, **IMAP** và **SMTP**; thông tin đăng nhập còn thiếu có thể được thêm trực tiếp từ chính flow.
- **Một ứng dụng Slack cho mỗi flow.** Trong ứng dụng Slack, hãy đặt URL yêu cầu tương tác thành `https://<Heym của bạn>/api/slack/interactions/<id thông tin đăng nhập>` và URL yêu cầu đăng ký sự kiện thành `https://<Heym của bạn>/api/slack/events/<id thông tin đăng nhập>`. Heym Work hiển thị cả hai cho kết nối đã chọn. Tất cả các flow trên thông tin đăng nhập đó đều chia sẻ chúng.
- **Trigger Slack chọn những gì chúng lắng nghe:** tin nhắn trong các kênh và tin nhắn trực tiếp, tin nhắn trực tiếp tới bot, lượt nhắc đến bot hoặc tin nhắn trong một kênh duy nhất. Bài đăng của chính bot không bao giờ bắt đầu một flow.
- **Yêu cầu.** Flows yêu cầu Heym 0.0.131 trở lên.

Các bước mà flow xây dựng là các node tương tự mà bạn có thể sử dụng trên canvas: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) và [Cron](../nodes/cron-node.md).

## Kết nối Heym Work

Xem [video hướng dẫn cài đặt](https://youtu.be/zXGfg1HPSLk) để theo dõi toàn bộ quy trình thiết lập, từ lệnh đầu tiên đến trang chủ.

Kết nối được thiết lập tại mục **Cài đặt → Heym Work**. Tab này chỉ hiển thị đối với quản trị viên phiên bản có tên trong danh sách `HEYM_ADMIN_EMAILS`.

| Trường | Chức năng |
|--------|-----------|
| **Địa chỉ Heym Work** | Nơi Heym Work vận hành, ví dụ `https://work.example.com`. Đăng nhập sẽ điều hướng quay lại địa chỉ này. Nhấn **Lưu**. |
| **Khóa tích hợp** | Nút **Tạo khóa** sẽ tạo khóa mà Heym Work sử dụng cho mỗi yêu cầu gửi tới Heym. Khóa chỉ hiển thị một lần duy nhất kèm nút sao chép. Heym chỉ lưu trữ chuỗi băm của khóa. |
| **Bật Heym Work** | Kích hoạt kết nối. Yêu cầu nhập địa chỉ và khóa trước. |
| **Phiên bản ngành và nhóm** | Các phiên bản pháp lý, giáo dục, tài chính, logistics, năng lượng và thương mại điện tử, cùng với các phiên bản CNTT, bán hàng, tiếp thị và nhân sự cho các nhóm công ty, sẽ mở ra với các trang, dữ liệu mẫu và workflow cho công việc đó. |

Sau đó mở địa chỉ của Heym Work và hoàn tất quá trình cài đặt:

1. **Giấy phép**: nhập khóa giấy phép do đội ngũ Heym cung cấp.
2. **Heym**: nhập địa chỉ Heym và khóa tích hợp.
3. **Chủ sở hữu**: đăng nhập bằng tài khoản được chỉ định làm Chủ sở hữu Heym Work.

Trang chủ mở ra và sẵn sàng phục vụ công việc của đội ngũ.

### Xoay vòng khóa

Tính năng **Đổi khóa** sẽ thay thế khóa tích hợp hiện tại. Heym Work sẽ tạm dừng hoạt động cho đến khi khóa mới được nhập tại đó, và tất cả người dùng đang đăng nhập Heym Work sẽ bị đăng xuất. Sử dụng tính năng này khi nghi ngờ khóa bị lộ hoặc khi người từng nắm giữ khóa rời tổ chức.

### Tắt kết nối

Tắt công tắc **Bật Heym Work** để ngắt kết nối. Khi đó Heym Work sẽ yêu cầu nhập lại khóa của Heym. Trong mọi trường hợp, Heym vẫn tiếp tục thực thi mọi workflow, lịch trình và webhook như bình thường.

## Mô hình bảo mật

- **Mọi thay đổi đều qua Heym.** Heym Work đọc dữ liệu hiển thị từ cơ sở dữ liệu của Heym và gửi từng hành động tới Heym qua kênh truyền bảo vệ bằng khóa, nơi Heym áp dụng các quy tắc truy cập nội bộ. Heym Work lưu trữ dữ liệu riêng trong lược đồ `heym_work` tách biệt.
- **Khóa được băm khi lưu trữ.** Heym so sánh chuỗi băm của khóa được cung cấp và không bao giờ lưu khóa dưới dạng văn bản thuần.
- **Xác thực được quản lý tại Heym.** Người dùng đăng nhập qua Heym cùng nhà cung cấp danh tính của tổ chức khi [SSO](./sso.md) được bật.
- **Mọi thao tác đều được kiểm toán.** Việc lưu kết nối và đổi khóa sẽ ghi các mục `work_integration.update` và `work_integration.key_rotate` vào [nhật ký kiểm toán](./audit.md).

## Cấp phép

Heym Work yêu cầu khóa giấy phép riêng do đội ngũ Heym phát hành. Hàng ngày, Heym Work gửi tới heym.run ID giấy phép, ID cài đặt, số người dùng hoạt động trong 30 ngày qua, tổng số thành viên, số lượt chạy trong 24 giờ qua và phiên bản của Heym cùng Heym Work. Nội dung workflow, dữ liệu đầu vào, đầu ra và thông tin xác thực luôn được lưu trữ hoàn toàn trên máy chủ của bạn.

Nếu quá trình đồng bộ hàng ngày thất bại trong 30 ngày liên tiếp, thời gian gia hạn 14 ngày sẽ bắt đầu, sau đó giao diện Heym Work sẽ yêu cầu Chủ sở hữu cung cấp khóa. Bản dùng thử có hiệu lực đến ngày cuối cùng và sẽ kích hoạt lại khi đội ngũ Heym gia hạn (mỗi lượt cài đặt được hưởng một bản dùng thử). Bản thân Heym vẫn hoạt động bình thường trong suốt thời gian này. Các mạng nội bộ không có kết nối internet sử dụng giấy phép ngoại tuyến qua email enterprise@heym.run.

## Video

Tất cả video về Heym Work được tổng hợp tại [danh sách phát Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Chủ đề liên quan

- [Enterprise](./enterprise.md): Cấp phép thương mại và hỗ trợ chuyên sâu
- [Single Sign-On](./sso.md): Cơ chế đăng nhập được Heym Work sử dụng
- [Human-in-the-Loop](./human-in-the-loop.md): Các phê duyệt hiển thị trong Heym Work
- [Nhật ký kiểm toán](./audit.md): Các bản ghi phát sinh khi thay đổi kết nối
- [Cài đặt](./user-settings.md): Vị trí hiển thị của tab Heym Work
