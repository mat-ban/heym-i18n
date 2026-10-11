# Trò chuyện với Heym

Chat với Heym là một trợ lý nhận biết ngữ cảnh trang, có sẵn từ phần header của tài liệu. Nó mở ra trong một hộp thoại căn giữa, cho phép bạn chọn credential LLM và model, rồi trả lời các câu hỏi với trang tài liệu hiện tại làm ngữ cảnh đầu tiên.

## Mở hộp thoại

1. Mở bất kỳ trang nào trong `/docs`
2. Nhấp vào **Chat với Heym** ở header
3. Chọn một [credential](../tabs/credentials-tab.md) và model
4. Đặt câu hỏi về trang hoặc về nền tảng

Trên màn hình nhỏ, nút kích hoạt chỉ hiển thị biểu tượng; trên màn hình lớn hơn, nó hiển thị đầy đủ nhãn.

## Ngữ cảnh được sử dụng

- Đường dẫn tài liệu đang mở hiện tại được đưa vào yêu cầu như hướng dẫn ngữ cảnh
- Backend vẫn sử dụng endpoint chat dashboard hiện có và các công cụ tìm kiếm tài liệu
- [User Rules](./user-settings.md) ở cấp tài khoản của bạn vẫn được áp dụng vì cùng một backend chat được tái sử dụng
- Các bước chuẩn bị trực tiếp sẽ stream vào bong bóng trợ lý trước câu trả lời cuối cùng, tương tự như chat trên dashboard
- Các câu hỏi làm rõ xuất hiện dưới dạng thẻ, giống như trong [tab Chat](../tabs/chat-tab.md). Khi một yêu cầu workflow cần credential, bạn có thể chọn một credential hoặc tạo mới từ thẻ. Khi cần một data table, bạn có thể chọn một trong các bảng của mình hoặc tạo bảng mới theo cùng cách.

Khi bạn mở hộp thoại trên một bài viết cụ thể, một huy hiệu nhỏ hiển thị đường dẫn tài liệu đang hoạt động để bạn có thể xác nhận trang nào đang được ưu tiên.

## Hành vi phiên làm việc

- Lựa chọn credential và model được giữ nguyên khi hộp thoại vẫn còn được mount
- Lịch sử tin nhắn chỉ tồn tại trong phiên và bị xóa khi hộp thoại đóng
- Nhấp vào backdrop, phím `Escape`, và nút đóng đều đặt lại phiên làm việc
- **Stop** hủy phản hồi đang stream hiện tại
- Hộp thoại được thiết kế rộng và có kích thước cố định; nó không cung cấp tùy chọn chuyển sang toàn màn hình

## Khi nào nên sử dụng

- Đặt các câu hỏi tiếp theo trong khi đọc một node hoặc trang tham chiếu
- Làm rõ sự khác biệt giữa các tính năng mà không cần rời khỏi tài liệu
- Tìm bài viết phù hợp trước khi mở editor

Nếu bạn muốn xây dựng hoặc chỉnh sửa workflow trực tiếp, hãy sử dụng [AI Assistant](./ai-assistant.md) ở phía editor thay thế.

## Liên quan

- [AI Assistant](./ai-assistant.md) – Chat trong editor để xây dựng workflow
- [Tab Credentials](../tabs/credentials-tab.md) – Thêm credential LLM được hộp thoại sử dụng
- [Settings](./user-settings.md) – User Rules toàn cục được áp dụng cho các bề mặt AI
- [Quick Start](../getting-started/quick-start.md) – Hướng dẫn workflow đầu tiên
