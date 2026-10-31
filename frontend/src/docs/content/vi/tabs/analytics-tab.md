# Tab Analytics

Tab **Analytics** hiển thị các chỉ số thực thi và xu hướng cho các workflow của bạn. Theo dõi mức sử dụng, hiệu suất và xác định các điểm nghẽn.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Xem demo Analytics</a></p>

## Thống kê tổng quan

- **Tổng số lần thực thi** – Số lần chạy workflow trong khoảng thời gian đã chọn
- **Tỷ lệ thành công** – Phần trăm các lần chạy thành công
- **Thời lượng trung bình** – Thời gian thực thi trung bình
- **Thời gian tiết kiệm** – Tổng thời gian tiết kiệm ước tính: số phút tiết kiệm mỗi lần chạy được cấu hình của từng workflow × số lần chạy thành công, cộng dồn trong khoảng thời gian đã chọn
- **Xu hướng** – Các chỉ báo tăng/giảm so với khoảng thời gian trước đó

## Khoảng thời gian

- **1h**, **3h**, **6h** – 1 giờ, 3 giờ hoặc 6 giờ qua. Dữ liệu phân tích được lưu theo giờ, do đó các khoảng này tính trọn vẹn giờ bắt đầu cửa sổ: Giờ qua lúc 15:20 bao gồm từ 14:00 đến hiện tại
- **24h** – 24 giờ qua
- **7d** – 7 ngày qua
- **30d** – 30 ngày qua
- **All** – Toàn bộ lịch sử hiện có

## Bộ lọc Workflow

- Lọc các chỉ số theo một workflow cụ thể
- **Tất cả workflow** – Tổng hợp trên tất cả workflow

## Bảng

Hai bảng hiển thị mức sử dụng workflow: **Được dùng nhiều nhất** (rộng hơn) và **Thất bại nhiều nhất**.

- **Thời gian tiết kiệm** – Bảng Được dùng nhiều nhất hiển thị tổng thời gian tiết kiệm của từng workflow (số phút tiết kiệm mỗi lần chạy × số lần chạy thành công). **Chưa thiết lập** nghĩa là thiếu ước tính; nhấp vào đó để mở trường tương ứng trên workflow.
- **Cột có thể sắp xếp** – Nhấp vào tiêu đề cột để sắp xếp theo cột đó. Nhấp lại để chuyển đổi giữa tăng dần/giảm dần. Các chỉ báo mũi tên hiển thị hướng sắp xếp.
- **Nhãn trên thiết bị di động** – Trên màn hình nhỏ, nhãn cột được rút gọn (ví dụ: "Executions" → "Runs", "Success" → "OK", "Error" → "Err") để các bảng vừa vặn mà không cần cuộn ngang.

## Biểu đồ

- **Khối lượng thực thi theo thời gian** – Biểu đồ đường về số lần thực thi theo từng khoảng thời gian
- **Tỷ lệ thành công so với lỗi** – Biểu đồ vùng so sánh các lần chạy thành công và thất bại
- **Độ trễ trung bình theo thời gian** – Biểu đồ đường hiển thị thay đổi về thời gian phản hồi
- **Kéo để chọn** – Nhấp và kéo trên bất kỳ biểu đồ nào để tập trung vào một khoảng ngày tùy chỉnh. Lựa chọn phải bao gồm ít nhất hai điểm trên biểu đồ; một cú nhấp chuột đơn thuần không chọn bất cứ điều gì
- **Chế độ chọn** – Các khoảng đã chọn sẽ làm mới thẻ thống kê, biểu đồ và bảng workflow mà không thay đổi preset cơ sở
- **Xóa lựa chọn** – Quay lại khoảng thời gian preset khi bạn hoàn tất việc xem chi tiết

## Loại node

Bên dưới các phân vị độ trễ, ba biểu đồ hiển thị thời gian và lỗi của node diễn ra ở đâu, được nhóm theo loại node (Agent, HTTP Request, Code, v.v.) trên các workflow đang hiển thị:

- **Các node tốn nhiều thời gian nhất** – 10 loại node có tổng thời gian thực thi nhiều nhất, được biểu diễn dưới dạng thời lượng trung bình cho mỗi lệnh gọi. Một giờ không có lệnh gọi của một loại sẽ hiển thị **Không có lệnh gọi** trong chú giải công cụ.
- **Các loại node thất bại nhiều nhất** – 10 loại node có nhiều lỗi nhất (lỗi hoặc timeout), mỗi loại có số lượng lỗi riêng trên mỗi khoảng thời gian.
- **Các loại node được gọi nhiều nhất** – 10 loại node chạy nhiều nhất, mỗi loại có số lệnh gọi riêng trên mỗi khoảng thời gian. Các node bị bỏ qua không được tính.

Di chuột qua biểu đồ để xem loại node ngay cạnh con trỏ. Loại node quá nhỏ để nhìn thấy bên cạnh loại lớn nhất trên biểu đồ (dưới 1% so với loại đó) sẽ bị loại khỏi biểu đồ và chú giải. Các biểu đồ tuân theo bộ lọc workflow, khoảng thời gian và bất kỳ vùng nào bạn kéo chọn trên biểu đồ. Phân tích node được ghi lại cho các lượt chạy từ phiên bản bổ sung tính năng này, và một lượt chạy hoàn tất sẽ xuất hiện trong vòng khoảng một phút. Các lượt chạy cũ hơn không được tính.

## Tự động làm mới

- Bật tự động làm mới để giữ các chỉ số luôn cập nhật mà không cần tải lại thủ công

## Liên quan

- [Tab Workflows](./workflows-tab.md) – Các workflow đang được đo lường
- [Tab Traces](./traces-tab.md) – Kiểm tra trace chi tiết
- [Tab Logs](./logs-tab.md) – Log runtime để gỡ lỗi
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang gọn nhẹ cho các bề mặt dashboard

Khi một biểu đồ hiển thị xu hướng mà bạn muốn được thông báo thay vì tự theo dõi, hãy biến nó thành một [alert](./alerts-tab.md): số lỗi, thời lượng chạy, chi phí LLM và số lần thực thi đều có thể được đặt ngưỡng theo khoảng thời gian.
