# Tab Templates

Tab Templates cho phép bạn lưu, duyệt và tái sử dụng toàn bộ workflow cũng như từng node riêng lẻ. Chia sẻ những gì bạn đã tạo một lần và áp dụng cho các dự án mới chỉ với một cú nhấp.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Xem demo Templates</a></p>

## Tổng quan

Có hai loại template:

- **Workflow templates** — lưu một workflow hoàn chỉnh (tất cả các node và kết nối) làm điểm khởi đầu có thể tái sử dụng.
- **Node templates** — lưu một node đã được cấu hình (ví dụ: một node LLM đã tinh chỉnh hoặc một node HTTP tùy chỉnh) để tái sử dụng across các workflow khác nhau.

Chuyển đổi giữa hai loại bằng nút **Workflows / Nodes** ở đầu tab.

Sử dụng thanh tìm kiếm để lọc các template hiển thị theo tên, mô tả, thẻ (tags) hoặc loại node.

---

## Tạo một Template

### Workflow template

1. Mở workflow bạn muốn chia sẻ trong trình chỉnh sửa.
2. Nhấp vào **Share as Template** trên thanh công cụ phía trên.
3. Điền tên, mô tả và các thẻ tùy chọn.
4. Chọn chế độ hiển thị: **Everyone** (tất cả người dùng) hoặc **Specific users** (nhập tên người dùng và/hoặc chọn teams).
5. Nhấp **Share**. Một thông báo màu xanh xác nhận thành công.

### Node template

1. Nhấp chuột phải vào bất kỳ node nào trên canvas.
2. Chọn **Share as Template** từ menu ngữ cảnh.
3. Điền vào biểu mẫu và nhấp **Share**.

---

## Sử dụng một Template

### Workflow template

1. Mở tab **Templates** và đảm bảo **Workflows** được chọn.
2. Nhấp vào một thẻ để xem trước, hoặc nhấp **Use** trực tiếp.
3. Workflow được sao chép thành một workflow mới mở trong trình chỉnh sửa.

### Node template

1. Mở tab **Templates** và chọn **Nodes**.
2. Nhấp **Use** trên thẻ node template.
3. Một hộp thoại xuất hiện — chọn nơi thêm node:
   - **New workflow** — tạo một workflow mới chỉ chứa node này.
   - **Existing workflow** — chọn từ danh sách workflow của bạn; node được chèn tự động khi trình chỉnh sửa mở ra.

---

## Xem trước

Nhấp vào bất kỳ thẻ template nào để mở bản xem trước đầy đủ:

- **Card thumbnails** — các thẻ template hiển thị ảnh chụp canvas chỉ đọc vừa vặn cho cả workflow và node template đơn lẻ.
- **Workflow templates** — một canvas chỉ đọc khớp với kiểu xem trước lịch sử chỉnh sửa, bao gồm pan và zoom.
- **Node templates** — node đã lưu mở trên cùng canvas chỉ đọc dưới dạng xem trước node đơn lẻ.
- **Node details** — nhấp vào bất kỳ node nào trong bản xem trước để kiểm tra cấu hình đã lưu của nó trong bảng bên cạnh.
- Thẻ (tags), số lần sử dụng và **owner** được hiển thị cho tất cả các template.

Nhấn **ESC** hoặc nhấp ra ngoài để đóng bản xem trước.

---

## Quản lý Templates

- **Edit** – Nếu bạn là chủ sở hữu template, di chuột qua thẻ và nhấp vào biểu tượng bút chì để cập nhật tên, mô tả, thẻ hoặc chế độ hiển thị
- **Delete** – Nếu bạn là chủ sở hữu template, di chuột qua thẻ và xóa template sau lời nhắc xác nhận
- **Owner-only actions** – Các nút chỉnh sửa và xóa chỉ hiển thị cho các template bạn đã tạo

---

## Command Palette (CTRL+K)

Templates (cả workflow và node) có thể tìm kiếm từ command palette **CTRL+K**. Chọn một template để sử dụng ngay — workflow templates mở trong trình chỉnh sửa, node templates hỏi nơi đến.

---

## Templates trong Chat

Bạn có thể đặt câu hỏi cho AI về các template của mình — nó biết tất cả các template trong workspace của bạn.

---

## Chế độ hiển thị

| Cài đặt | Ai có thể thấy |
|---|---|
| Everyone | Tất cả người dùng trên nền tảng |
| Specific users | Người dùng bạn liệt kê theo tên và/hoặc teams bạn chọn — tất cả thành viên team đều có quyền truy cập |

Khi chia sẻ với **Specific users**, bạn có thể thêm cả người dùng cá nhân (theo tên) và teams. Thành viên team thấy template trong tab Templates và có thể sử dụng nó.

---

## Liên quan

- [Teams](../reference/teams.md) – Chia sẻ templates với teams
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang ngắn cho các tab dashboard
