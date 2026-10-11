# Tổ chức Workflow

Heym cho phép bạn tổ chức các workflow trong các thư mục, tạo thư mục con và lên lịch xóa workflow. Xem [Workflows Tab](../tabs/workflows-tab.md) để biết tổng quan về giao diện.

## Thư mục và Thư mục con

Các thư mục tạo thành một cấu trúc cây. Mỗi thư mục có:

- **Name** – Tên hiển thị
- **Parent** – `parent_id` liên kết đến một thư mục khác; `null` nghĩa là thư mục gốc
- **Workflows** – Workflow có thể được di chuyển vào thư mục thông qua `folder_id`

### API

| Endpoint | Mục đích |
|----------|---------|
| `GET /folders` | Chỉ các thư mục gốc |
| `GET /folders/tree` | Toàn bộ cây (thư mục con + workflow) |
| `GET /folders/{id}` | Một thư mục với nội dung của nó |
| `POST /folders` | Tạo thư mục (`parent_id` tùy chọn) |
| `PUT /folders/{id}` | Cập nhật tên hoặc `parent_id` |
| `DELETE /folders/{id}` | Xóa thư mục (xóa theo tầng) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Di chuyển workflow vào thư mục |
| `DELETE /folders/workflows/{workflow_id}/folder` | Xóa workflow khỏi thư mục |
| `GET /folders/{id}/export` | Tải xuống thư mục + tất cả thư mục con dưới dạng ZIP |

### Cấu trúc cây

Phản hồi cây bao gồm `children` và `workflows` cho mỗi thư mục. Các workflow được chia sẻ có thể xuất hiện trong một thư mục thông qua `WorkflowShare.folder_id`.

## Chia sẻ Workflow

Mở **Share** trong trình chỉnh sửa workflow để mời người dùng qua email hoặc chia sẻ với một [team](./teams.md). Mỗi lời mời và mỗi lần chia sẻ với team đều mang một quyền:

| Quyền | Những gì người cộng tác có thể làm |
|------------|------------------------------|
| **Read** | Mở workflow, xem xét nó, xem lịch sử thực thi và chạy nó. Trình chỉnh sửa mở ở chế độ chỉ đọc: Save bị vô hiệu hóa và canvas không thể thay đổi. |
| **Write** | Mọi thứ mà Read cho phép, cộng thêm việc chỉnh sửa canvas, cài đặt, tài liệu phân tích và bộ nhớ agent. |

Quyền được hiển thị bên cạnh mỗi mục trong hộp thoại Share và có thể được thay đổi bất cứ lúc nào từ dropdown đó, mà không cần xóa và thêm lại chia sẻ. Khi một người dùng tiếp cận một workflow qua nhiều đường dẫn (một chia sẻ trực tiếp và một hoặc nhiều team), quyền **cao nhất** sẽ thắng. Các chia sẻ tồn tại trước khi quyền được giới thiệu là **Write**, và các API client bỏ qua `permission` cũng nhận được **Write**.

Các hành động chỉ dành cho chủ sở hữu không bao giờ phụ thuộc vào quyền: xóa workflow, hoàn nguyên hoặc xóa các phiên bản, xóa lịch sử, quản lý chia sẻ, và [cài đặt chỉ dành cho chủ sở hữu](#owner-only-settings) bên dưới vẫn thuộc về chủ sở hữu ngay cả đối với người cộng tác có quyền **Write**. Một người cộng tác có quyền **Read** gửi một chỉnh sửa qua API (`PUT /api/workflows/{id}`, ghi chú phân tích, bộ nhớ agent, xóa cache) hoặc qua AI Assistant sẽ nhận `403` với `You have read-only access to this workflow`.

Chia sẻ một workflow cấp quyền truy cập vào canvas, lịch sử thực thi và tài liệu phân tích. Nó **không** tự động chia sẻ:

- **Credentials** được tham chiếu bởi các node trong workflow
- **Sub-workflows** được gọi bởi các node [Execute](../nodes/execute-node.md) hoặc các agent

Người nhận cần những credentials và workflow con đó được chia sẻ với họ một cách riêng biệt (cùng người dùng hoặc team). Chia sẻ credentials từ [Credentials tab](../tabs/credentials-tab.md); xem [Credentials Sharing](./credentials-sharing.md). Chia sẻ từng sub-workflow từ hộp thoại chia sẻ của trình chỉnh sửa riêng của nó.

### Cài đặt chỉ dành cho chủ sở hữu

Toàn bộ cấu hình **Run with cURL** vẫn thuộc về chủ sở hữu sau khi chia sẻ. Người cộng tác vẫn mở hộp thoại và sao chép lệnh được tạo, nhưng các điều khiển ở chế độ chỉ đọc.

Thay đổi bất kỳ điều nào sau đây với tư cách không phải chủ sở hữu sẽ bị từ chối với `403`:

- **Authentication** (`auth_type`) và **Header Key** (`auth_header_key`)
- Chế độ **Request Body** (`webhook_body_mode`) và **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) và **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) hoạt động khác: nó bị ẩn hoàn toàn khỏi người cộng tác, và thao tác ghi của người cộng tác bị bỏ qua thay vì bị từ chối. Trình chỉnh sửa hiển thị trường này ở dạng che khuất, vì vậy `403` ở đó sẽ phá vỡ một thao tác lưu thông thường thay vì báo hiệu một cuộc tấn công.

Authentication là lý do khối này chỉ dành cho chủ sở hữu: `Anonymous` cho phép những người gọi chưa xác thực chạy workflow, và một lần chạy không có người gọi đã đăng nhập sẽ phân giải credentials và biến toàn cục với tư cách **chủ sở hữu**, không phải người gọi. Phần còn lại của khối là hợp đồng yêu cầu đã công bố và các kiểm soát chi phí của chủ sở hữu, vì vậy nó đi kèm với nhau.

**On error, run workflow** (`error_workflow_id`) trong bảng **Properties** cấp workflow cũng chỉ dành cho chủ sở hữu vì lý do tương tự: [error workflow](./features.md#error-workflow) chạy với credentials và biến toàn cục của lần chạy thất bại, vốn thuộc về chủ sở hữu đối với các lần chạy được kích hoạt và ẩn danh. Người cộng tác thấy cài đặt ở chế độ chỉ đọc, và việc thêm, thay thế hoặc xóa nó với tư cách không phải chủ sở hữu sẽ bị từ chối với `403`.

Việc chỉnh sửa canvas, tên và mô tả không bị ảnh hưởng.

### Execution tokens

Một người cộng tác có thể tạo một execution token cho một workflow được chia sẻ với họ. Lần chạy được gán cho **bất kỳ ai đã tạo token**, vì vậy nó sử dụng credentials và biến toàn cục của người dùng đó, không phải của chủ sở hữu. Chỉ một lệnh gọi thực sự ẩn danh — `auth_type: anonymous` không có người gọi — mới chạy trong ngữ cảnh của chủ sở hữu.

## Lên lịch xóa

Workflow có thể được lên lịch xóa thay vì bị xóa ngay lập tức.

- **Trường**: `scheduled_for_deletion` (datetime có thể null)
- **Hành vi**: Khi được đặt, workflow chuyển sang `folder_id = null` và xuất hiện trong phần "Scheduled for Deletion".
### API

| Endpoint | Mục đích |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Đặt `scheduled_for_deletion`, xóa `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Xóa `scheduled_for_deletion` (khôi phục) |

### UI

- **Kéo vào thùng rác** – Thả workflow vào khu vực "Scheduled for Deletion" để lên lịch xóa
- **Khôi phục** – Xóa khỏi lịch xóa
- **Xóa ngay lập tức** – Biểu tượng thùng rác để xóa vĩnh viễn

### Logic dọn dẹp

Một cron job chạy hàng ngày lúc **23:59** (theo múi giờ đã cấu hình). Một workflow chỉ bị xóa khi:

- **Tất cả node đầu vào** (các node không có cạnh đến, loại trừ sticky/errorHandler) đều có `active === false`

Nếu bất kỳ node đầu vào nào vẫn đang hoạt động, workflow sẽ được giữ lại cho đến lần chạy tiếp theo.

## Dashboard UI

- **Các hàng thư mục** – New Folder, cây thư mục đệ quy với tính năng mở rộng/thu gọn. Mỗi thư mục có
  mô tả tùy chọn bên dưới tên và một badge đếm số workflow mà nó chứa, bao gồm cả
  các thư mục con.
- **Thao tác thư mục** – New Subfolder, Rename, Change icon, Download as ZIP và Delete nằm inline
  trên mỗi hàng thư mục; menu ngữ cảnh chuột phải cung cấp cùng bộ thao tác, và trên điện thoại hiển thị một
  nút menu duy nhất.
- **Khu vực chính** – Các workflow gốc (không thuộc thư mục, không được lên lịch) và Scheduled for Deletion
- **Xem trước khi thả vào thư mục** – Kéo một workflow sẽ làm nổi bật thư mục hoặc thư mục con chính xác và
  hiển thị đường dẫn đầy đủ của nó trong bản xem trước cỡ thẻ. Một thư mục đang thu gọn sẽ mở rộng sau một khoảng hover ngắn.
- **Phản hồi kéo thả ổn định** – Thẻ nguồn sử dụng drag ghost, và mục tiêu thả đang hoạt động vẫn
  được chọn khi cuộn hoặc di chuyển qua các control bên trong cùng một thư mục.
- **Kiểm tra đích** – Thư mục hiện tại được hiển thị là **Already in Folder** và không chấp nhận
  một thao tác di chuyển dư thừa.
- **Các vùng thả khác** – Root và "Scheduled for Deletion" được làm nổi bật khi chúng có thể chấp nhận
  workflow được kéo.
- **Thả ZIP** – Thả một tệp ZIP vào khu vực workflow để import cấu trúc thư mục ở cấp gốc

## Liên quan

- [Workflows Tab](../tabs/workflows-tab.md) – Tạo và quản lý workflow
- [Credentials Sharing](./credentials-sharing.md) – Chia sẻ credential với cộng tác viên workflow
- [Teams](./teams.md) – Chia sẻ workflow và credential với các team
- [Core Concepts](../getting-started/core-concepts.md) – Workflow, node và thực thi
- [Workflow Structure](./workflow-structure.md) – Định dạng JSON cho workflow
- [Triggers](./triggers.md) – Các node đầu vào và điểm khởi đầu
