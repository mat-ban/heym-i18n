# Chuyển sang Heym

Bạn đã có workflow trong một công cụ khác? **AI Convert** sẽ chuyển chúng thành workflow Heym cho bạn. Hãy dán một workflow từ n8n, Flowise, Dify, Langflow, sim.ai hoặc Activepieces — hoặc chỉ cần mô tả điều bạn muốn — và Heym sẽ tạo workflow tương đương trên một canvas trực tiếp mà bạn có thể tải xuống và import.

Mở tại **[heym.run/convert](https://heym.run/convert)**, hoặc dùng nút **✨ AI Convert** ở phần header của trang.

## Cách hoạt động

1. **Chọn công cụ nguồn** (tùy chọn) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, hoặc để ở chế độ *Auto*.
2. **Cung cấp workflow của bạn** — dán JSON đã export từ công cụ hiện tại, hoặc viết mô tả bằng ngôn ngữ tự nhiên về automation bạn muốn.
3. **Generate** — Heym truyền kết quả lên canvas, vẽ các node và kết nối ngay khi chúng được tạo ra.
4. **Tải xuống hoặc sao chép** workflow đã tạo dưới dạng JSON.
5. **Import vào Heym** — dùng quy trình [Download & Import](../reference/download-import.md) để dán JSON lên canvas của bạn, sau đó chạy nó.

Quá trình chuyển đổi cũng thêm một *Sticky Note* nhỏ trên canvas đánh dấu workflow được tạo bởi Heym — bạn có thể xóa nó bất cứ lúc nào.

## Những gì bạn nhận được

Công cụ chuyển đổi ánh xạ các khái niệm nguồn sang các node gốc của Heym — trigger, các bước [LLM](../nodes/llm-node.md), lệnh gọi [HTTP](../nodes/http-node.md), hành động [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) và [Output](../nodes/output-node.md). Hãy xem lại kết quả trên canvas, kết nối [Credentials](../reference/credentials.md) của bạn và điều chỉnh bất kỳ điểm nào mà công cụ nguồn diễn đạt khác đi.

> AI Convert là điểm khởi đầu, không phải bản chuyển đổi 1:1 được đảm bảo. Luôn xem lại workflow đã tạo trước khi chạy nó trong môi trường production.

## Những điều cần biết

- **Được hỗ trợ bởi AI:** các bản chuyển đổi được tạo bởi một large language model, nên kết quả có thể khác nhau giữa các lần chạy. Hãy tạo lại nếu kết quả đầu tiên chưa thật sự phù hợp.
- **Kích thước đầu vào:** nội dung bạn dán hoặc nhập được giới hạn ở khoảng **25.000 token**. Hãy cắt gọn các bản export quá lớn trước khi chuyển đổi.
- **Giới hạn tần suất:** để giữ công cụ luôn khả dụng cho mọi người, các yêu cầu bị giới hạn ở mức **1 lần mỗi phút, 5 lần mỗi giờ và 10 lần mỗi ngày** cho mỗi khách truy cập.
- **An toàn:** các yêu cầu đều được sàng lọc, và chỉ những yêu cầu xây dựng workflow mới được xử lý.

## Các bước tiếp theo

- Mới làm quen với canvas? Hãy bắt đầu với [Quick Start](./quick-start.md).
- Tìm hiểu cách import hoạt động trong [Download & Import](../reference/download-import.md).
- Tự host Heym? Xem [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) để có tài liệu tham chiếu cấu hình đầy đủ.
- Xây dựng từ đầu với [AI Assistant](../reference/ai-assistant.md) trong ứng dụng.
