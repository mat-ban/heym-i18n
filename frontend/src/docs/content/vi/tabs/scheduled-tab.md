# Tab Đã lên lịch

Tab **Đã lên lịch** hiển thị tất cả các workflow cron đang hoạt động trên một lịch trực quan. Chuyển đổi giữa chế độ xem ngày, tuần và tháng để xem thời điểm các tự động hóa của bạn được lên lịch chạy.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Xem bản demo Đã lên lịch</a></p>

## Chế độ xem

- **Ngày** – Dòng thời gian theo từng giờ cho ngày đã chọn; mỗi lần chạy xuất hiện dưới dạng một khối tại thời điểm đã lên lịch
- **Tuần** – Lưới bảy cột trải dài trong tuần hiện tại; các khối xếp chồng lên nhau khi nhiều workflow cùng kích hoạt vào một giờ
- **Tháng** – Lưới đầy đủ cả tháng; mỗi ô liệt kê các workflow được lên lịch chạy vào ngày đó

## Khối Workflow

Mỗi khối hiển thị:

- **Tên workflow** – Nhấp để mở trực tiếp canvas của workflow
- **Biểu thức Cron** – Hiển thị khi di chuột, cho thấy lịch trình thô (ví dụ: `0 9 * * 1-5`)

## Điều hướng

Quản trị viên instance được liệt kê trong `HEYM_ADMIN_EMAILS` sẽ thấy lịch trình của mọi chủ sở hữu khi tùy chọn **Hiển thị tất cả workflow** được chọn. Bỏ chọn để chỉ thấy workflow của chính họ. Người dùng khác vẫn giữ tùy chọn **Hiển thị được chia sẻ với tôi**. Để ngừng tự động hóa của một nhân viên, hãy sử dụng [các điều khiển quản trị instance](./workflows-tab.md#instance-administration) trên bản xem trước Workflows để tạm dừng hoặc tiếp tục các trigger.

- Sử dụng các mũi tên **trước / tiếp theo** để di chuyển qua các ngày, tuần hoặc tháng
- Nút **Hôm nay** đưa bạn trở về ngày hiện tại ngay lập tức

## Liên quan

- [Cron Node](../nodes/cron-node.md) – Cấu hình các trigger đã lên lịch trên canvas
- [Tab Workflows](./workflows-tab.md) – Quản lý và tổ chức tất cả các workflow
- [Tab Analytics](./analytics-tab.md) – Các chỉ số và xu hướng thực thi
