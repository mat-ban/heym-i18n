# Portal

**Portal** hiển thị các workflow của Heym dưới dạng giao diện chat công khai. Người dùng cuối có thể chạy workflow thông qua URL mà không cần đăng nhập vào Heym.

## Chức năng

- **URL công khai**: `/chat/{slug}` (ví dụ: `/chat/my-workflow`)
- **Giao diện chat**: Người dùng tương tác thông qua giao diện chat (tin nhắn, đầu vào, phản hồi)
- **Xác thực tùy chọn**: Nếu đã cấu hình người dùng portal, cần đăng nhập; nếu không, portal là công khai
- **Streaming**: Tiến trình node theo thời gian thực trong quá trình thực thi (khi được bật)
- **Dừng thực thi đang chạy**: Người dùng có thể dừng một lượt chạy portal đang thực hiện từ chân trang chat; quá trình thực thi workflow đang hoạt động cũng bị hủy phía server
- **Tải tệp lên**: Tải tệp tùy chọn (văn bản, hình ảnh, v.v.) cho mỗi trường đầu vào
- **Chuyển giao đánh giá của con người**: Các lượt chạy portal có thể hiển thị [liên kết đánh giá HITL](./human-in-the-loop.md) khi agent tạm dừng để chờ phê duyệt
- **Hiển thị hình ảnh**: Đầu ra workflow chứa hình ảnh (ví dụ: từ tạo hình ảnh bằng LLM hoặc ảnh chụp Playwright) xuất hiện dưới dạng hình thu nhỏ trong chat. Nhấp vào bất kỳ hình ảnh nào để mở trình xem toàn màn hình; nhấn **Esc** hoặc sử dụng nút quay lại của thiết bị để đóng

## Cấu hình Workflow

| Cài đặt | Mô tả |
|---------|-------------|
| `portal_enabled` | Bật portal cho workflow này |
| `portal_slug` | Slug URL (ví dụ: `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Sử dụng thực thi streaming |
| `portal_file_upload_enabled` | Cho phép tải tệp lên |
| `portal_file_config` | Cấu hình tệp theo từng trường (loại, giới hạn) |

Cấu hình trong trình chỉnh sửa: Nút **Portal** trong tiêu đề workflow mở hộp thoại cài đặt portal.

## Luồng

1. **Thông tin**: `GET /api/portal/{slug}/info` – Trả về metadata workflow và các trường đầu vào (không cần xác thực)
2. **Đăng nhập** (nếu được yêu cầu): `POST /api/portal/{slug}/login` – Trả về token phiên
3. **Thực thi**: `POST /api/portal/{slug}/execute` – Giao diện chat portal gọi endpoint này (hoặc biến thể streaming của nó ở bên trong khi được bật); người dùng cuối tương tác qua giao diện chat, không gọi API trực tiếp.
4. **Dừng**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Được yêu cầu khi người dùng nhấn **Stop** trong một lượt chạy portal đang hoạt động

## Giới hạn đồng thời

Khi workflow có [giới hạn đồng thời](./webhooks.md#concurrency-limit-and-queued-runs) và mọi vị trí đều đang được sử dụng, thông điệp portal sẽ chờ đến lượt thay vì chạy ngay lập tức. Đoạn chat hiển thị **Waiting in queue (2/5)** trong dòng tiến trình cho đến khi lượt chạy bắt đầu, sau đó câu trả lời xuất hiện như bình thường. Lượt chạy vẫn diễn ra nếu người dùng đóng trang. **Stop** sẽ xóa lượt chạy đang chờ khỏi hàng đợi. Khi hàng đợi đầy, thông điệp thất bại với "Concurrency queue is full". Lượt chạy đã chờ trong hàng đợi không phát trực tuyến câu trả lời theo từng token; toàn bộ câu trả lời sẽ xuất hiện khi nó kết thúc.

## HITL trong các lượt chạy Portal

Nếu một workflow portal gặp [Node Agent](../nodes/agent-node.md) với [Human-in-the-Loop](./human-in-the-loop.md) được bật, phản hồi portal sẽ hiển thị liên kết đánh giá thay vì xuất hiện trống.

- Trạng thái thực thi workflow chuyển thành `pending`
- Chat portal hiển thị URL đánh giá
- Bất kỳ node nào được kết nối với handle đầu ra `review` của agent có thể thông báo cho Slack, email hoặc các kênh khác ngay lập tức
- Người đánh giá hoàn thành quyết định trên `/review/{token}` mà không cần đăng nhập
- Sau khi đánh giá, workflow tiếp tục từ snapshot đã lưu

Điều này cho phép kết hợp các luồng chat công khai với các bước phê duyệt của con người một cách riêng tư.

## Trường đầu vào

Các trường đầu vào đến từ các node [Input](../nodes/input-node.md). API trích xuất các node bắt đầu thuộc loại `textInput` và `inputFields` của chúng. Quá trình thực thi sử dụng cùng engine như các lượt chạy thông thường; đầu vào được truyền dưới dạng `body.inputs` và `conversation_history` cho các luồng nhiều lượt.

## Xác thực và Phiên

- **WorkflowPortalUser**: Tên người dùng/mật khẩu cho mỗi workflow (khi xác thực được bật)
- **Xóa người dùng cuối cùng**: Khi cổng thông tin được bật, việc xóa người dùng cổng thông tin cuối cùng sẽ khiến cổng thông tin trở lại công khai; hộp thoại cài đặt sẽ yêu cầu xác nhận trước
- **PortalSession**: Token phiên với TTL 168 giờ
- **Giới hạn tần suất**: 3 lần đăng nhập thất bại → cấm 24 giờ cho mỗi workflow+IP
- Các phiên hết hạn được dọn dẹp bởi một cron job

## Giao diện cấu hình

Các tab của **WebPortalSettingsDialog**:

1. **General**: Bật portal, đặt slug, sao chép URL portal
2. **Users**: Thêm/xóa người dùng portal (tên người dùng/mật khẩu)
3. **Options**: Chế độ stream, tải tệp lên, xem các trường đầu vào

## Liên quan

- [Tại sao chọn Heym](../getting-started/why-heym.md) – Portal như một bề mặt chat cho agent trong môi trường production
- [Tab Workflows](../tabs/workflows-tab.md) – Tạo workflow và bật portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Trang đánh giá công khai cho các đầu ra agent đang chờ xử lý
- [Triggers](./triggers.md) – Portal như một điểm vào
- [Các loại Node](./node-types.md) – [Input](../nodes/input-node.md) cho đầu vào portal
- [Cấu trúc Workflow](./workflow-structure.md) – Các node và cạnh
