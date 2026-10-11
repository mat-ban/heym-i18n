# Tab Logs

Tab **Logs** hiển thị nhật ký (logs) của Docker container cho Heym stack. Sử dụng tab này để gỡ lỗi (debug), giám sát và khắc phục sự cố. Đối với nhật ký thực thi workflow (kết quả node, đầu ra), hãy sử dụng bảng Debug trong trình chỉnh sửa workflow—xem [Canvas Features](../reference/canvas-features.md#execution-logs).

Nhật ký dựa trên Docker bị tắt theo mặc định trong các triển khai tự lưu trữ (self-hosted). Để bật chúng, hãy đặt `DOCKER_LOGS_ENABLED=true`, đặt `DOCKER_LOGS_ALLOWED_EMAILS` thành danh sách email người dùng tin cậy được phân tách bằng dấu phẩy, những người được phép truy cập nhật ký Docker, và đảm bảo `/var/run/docker.sock` được mount vào container backend. Dịch vụ Docker Compose mặc định và ví dụ `docker run` trực tiếp đều bao gồm mount đó cho các công cụ MCP stdio dựa trên Docker; chỉ giữ nó khi bạn chấp nhận ranh giới tin cậy của Docker socket.

Nếu đăng ký đang mở, hãy tạo tài khoản admin tin cậy trước khi bật nhật ký Docker hoặc giữ `ALLOW_REGISTER=false`; nếu không, một đăng ký tự động chưa được xác minh có thể chiếm một email nằm trong danh sách cho phép.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Xem demo Logs</a></p>

## Chọn Container

- **All Containers** – Nhật ký kết hợp từ backend, frontend và PostgreSQL
- **Backend** – Container `heym-backend`
- **Frontend** – Container `heym-frontend`
- **PostgreSQL** – Container `heym-postgres`

## Bộ lọc Log Level

- **All** – Hiển thị tất cả các log level
- **INFO** – INFO và cao hơn
- **WARNING** – Cảnh báo và lỗi
- **ERROR** – Chỉ lỗi
- **DEBUG** – Debug và cao hơn

## Tìm kiếm

- Lọc nhật ký theo tìm kiếm văn bản
- Các kết quả khớp được tô sáng trong đầu ra nhật ký

## Tính năng

- **Auto scroll** – Tự động cuộn xuống cuối khi có nhật ký mới
- **Stream** – Truyền nhật ký theo thời gian thực (khi được hỗ trợ)
- **Copy** – Sao chép nhật ký vào clipboard
- **Download** – Tải nhật ký xuống dưới dạng tệp

## Trường hợp sử dụng

- Gỡ lỗi các lỗi thực thi workflow
- Kiểm tra nhật ký yêu cầu/phản hồi API
- Giám sát các truy vấn cơ sở dữ liệu
- Kiểm tra thông báo khởi động và tình trạng hoạt động

## Liên quan

- [Canvas Features](../reference/canvas-features.md) – Nhật ký thực thi trong bảng Debug của workflow
- [Tab Traces](./traces-tab.md) – Kiểm tra LLM trace
- [Tab Analytics](./analytics-tab.md) – Số liệu thực thi
- [Tab Workflows](./workflows-tab.md) – Quản lý workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang gọn cho các bề mặt dashboard
