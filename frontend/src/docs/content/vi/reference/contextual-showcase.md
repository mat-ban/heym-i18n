# Showcase theo ngữ cảnh

**Giới thiệu theo Ngữ cảnh** là một thanh hướng dẫn nhẹ trong ứng dụng, giải thích trang bạn đang truy cập mà không đẩy bạn ngay vào luồng tài liệu đầy đủ.

## Chức năng

- Hiển thị tóm tắt ngắn gọn cho trang hiện tại
- Giữ lớp đầu tiên súc tích để bạn không bị quá tải
- Cho phép mở rộng một lượng nhỏ chi tiết bổ sung chỉ khi cần thiết
- Liên kết ra trang tài liệu đầy đủ để đọc sâu hơn

## Vị trí xuất hiện

Trong v1, tính năng giới thiệu khả dụng trên các bề mặt chính đã xác thực của Heym:

- Các tab Dashboard
- [Evals](../tabs/evals-tab.md)
- [Tài liệu](../getting-started/introduction.md)
- Canvas của trình soạn thảo workflow

Các trang công khai như đăng nhập, đăng ký, cổng chat và đánh giá HITL không hiển thị tính năng giới thiệu.

## Truy cập

### Desktop

- Một nút **Page Guide** cố định xuất hiện ở cạnh phải màn hình
- Tính năng giới thiệu mở dưới dạng drawer bên phải
- Mặc định luôn đóng
- Một teaser hiển thị một lần giúp gợi ý rằng hướng dẫn tồn tại mà không buộc phải mở

### Mobile

- Nội dung tương tự khả dụng từ nút **Page Guide** nổi
- Nó mở trong bottom sheet thay vì thanh bên phải

## Mô hình Nội dung

Mỗi mục giới thiệu sử dụng định nghĩa có cấu trúc thay vì component tùy chỉnh hoàn toàn.

- **Tiêu đề** – Trang này là gì
- **Tóm tắt** – Một giải thích ngắn
- **Bullets** – Một vài gợi ý dễ quét
- **Highlights** – Các card nhỏ cho giá trị chính hoặc mẫu sử dụng
- **Chi tiết thêm** – Các phần thu gọn cho ngữ cảnh bổ sung
- **Hành động** – Thường là một hoặc hai liên kết, thường trỏ đến tài liệu đầy đủ

Điều này giữ hệ thống linh hoạt trong khi tránh các bảng trợ giúp dài dòng, ồn ào.

## Nhận biết Ngữ cảnh

Tính năng giới thiệu thay đổi theo bề mặt hiện tại.

- Mỗi tab Dashboard có tóm tắt riêng
- Trình soạn thảo trỏ đến [Tính năng Canvas](./canvas-features.md)
- Trang tài liệu sử dụng tổng quan tài liệu chung và, khi có thể, trỏ đến bài viết hiện tại bạn đang mở

## Lưu trữ

Tính năng giới thiệu lưu một lượng nhỏ trạng thái UI cá nhân trong bộ nhớ trình duyệt:

- Panel hoặc sheet lần cuối có mở hay không
- Những ngữ cảnh trang nào đã hiển thị teaser
- Phần chi tiết mở rộng cuối cùng cho mỗi ngữ cảnh

## Tại sao tồn tại

Mục tiêu là giúp Heym dễ học hơn mà không thêm nhiều UI chrome nặng nề.

- Hướng dẫn ngắn, luôn gần gũi để định hướng
- Đường dẫn rõ ràng đến tài liệu sâu hơn
- Ít gián đoạn cho người dùng có kinh nghiệm

## Liên quan

- [Tab Workflows](../tabs/workflows-tab.md) – Bề mặt dashboard chính
- [Tab Evals](../tabs/evals-tab.md) – Các workflow đánh giá
- [Tính năng Canvas](./canvas-features.md) – Hành vi trình soạn thảo và gỡ lỗi
- [Quick Drawer](./quick-drawer.md) – Bề mặt tiện ích cố định bên phải khác
