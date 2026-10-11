# Human-in-the-Loop

Human-in-the-loop (HITL) cho phép một [Agent Node](../nodes/agent-node.md) yêu cầu phê duyệt tại những thời điểm cụ thể, chờ quyết định từ con người, sau đó tiếp tục workflow từ chính execution snapshot đó.

## Tính năng này làm gì

- Thêm các checkpoint phê duyệt tường minh vào một agent mà không cần xây dựng một workflow phê duyệt riêng
- Tạo một URL review công khai dùng một lần tại `/review/{token}`
- Cho phép người review chọn `Accept`, `Edit & Continue`, hoặc `Refuse`
- Đánh dấu execution là `pending` cho đến khi có quyết định
- Tiếp tục execution đang tạm dừng và cho phép agent tiếp tục sau khi được phê duyệt
- Hỗ trợ nhiều checkpoint HITL tuần tự trong cùng một lần chạy agent

## Cấu hình Agent

Bật HITL trong bảng thuộc tính của agent.

| Cài đặt | Mô tả |
|---------|-------------|
| `hitlEnabled` | Bật tính năng review bởi con người cho agent này |
| `hitlSummary` | Hướng dẫn phê duyệt về thời điểm agent nên yêu cầu review bởi con người |

HITL thêm một tool `request_human_review` vào agent. Sử dụng system prompt và hướng dẫn
`hitlSummary` để cho agent biết những hành động nào cần phê duyệt. Khi agent xác định một checkpoint
cần review, nó gửi một đoạn văn bản review Markdown duy nhất đến con người. Phần tóm tắt dành cho
người review được tạo từ yêu cầu của agent tại thời điểm chạy; nếu agent bỏ qua phần này, Heym sẽ tự
suy ra từ nội dung Markdown. Trong v1, HITL chỉ hỗ trợ đầu ra của agent ở chế độ văn bản, vì vậy không
thể kết hợp với `jsonOutputEnabled`.

Đối với các tool MCP, Heym yêu cầu model diễn giải các hướng dẫn HITL đã viết thành một trong ba
phạm vi phê duyệt:

- `always` cho các cụm từ như "always", "on each", hoặc "for each"
- `once` cho các cụm từ như "once" hoặc "only one time"
- `never` cho các cụm từ như "never", "do not ask", hoặc "already approved"

Cách diễn giải đó kiểm soát việc các lệnh gọi MCP lặp lại sẽ tạm dừng lần nữa, được phê duyệt một lần
và giữ nguyên, hay bỏ qua hoàn toàn bước review bởi con người.

Khi HITL được bật, agent cũng hiển thị thêm một output handle thứ hai trên canvas có nhãn `review`. Sử dụng nhánh đó để gửi URL review đang chờ và phần tóm tắt đến Slack, email, logging, hoặc bất kỳ luồng thông báo nào khác trong khi execution chính đang chờ con người.

## Luồng Review

1. Agent đến một bước yêu cầu phê duyệt và gọi `request_human_review`
2. Heym tạo một yêu cầu review công khai và trả về một URL review
3. Bất kỳ node nào được kết nối với handle `review` của agent sẽ chạy ngay lập tức với payload HITL đang chờ
4. Execution của workflow chuyển sang trạng thái `pending`
5. Người review mở `/review/{token}` mà không cần đăng nhập
6. Người review chọn một hành động:
   - `Accept` tiếp tục với Markdown gốc
   - `Edit & Continue` tiếp tục với Markdown đã chỉnh sửa
   - `Refuse` tiếp tục với `decision: "refused"` và bỏ qua các hành động tiếp theo của agent
7. Heym tiếp tục workflow từ snapshot đã lưu và cho phép agent tiếp tục với ngữ cảnh Markdown đã được phê duyệt
8. Nếu một bước sau đó cũng yêu cầu phê duyệt, agent có thể gọi HITL lần nữa và tạo một checkpoint đang chờ khác

Các liên kết review sẽ hết hạn sau 168 giờ nếu không có ai phản hồi.

## Trang Review Công khai

Trang review công khai hiển thị:

- Tên workflow và nhãn của agent
- Phần tóm tắt dành cho người review được tạo tự động từ yêu cầu review của agent
- Văn bản review Markdown được hiển thị trước tiên, như nội dung chính
- Một ô chỉnh sửa chỉ mở ra sau khi người review nhấp vào `Edit`
- Bản xem trước Markdown trực tiếp trong khi chỉnh sửa
- Các nút hành động cho `Accept`, `Edit & Continue`, và `Refuse`

Sau khi một quyết định được gửi đi, token sẽ bị khóa và không thể sử dụng lại.

## Đầu ra và Trạng thái Execution

Trong khi chờ review, đầu ra của agent chứa một payload đang chờ:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Sau khi người review phản hồi và workflow tiếp tục, đầu ra cuối cùng của agent bao gồm metadata của quyết định:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Sử dụng `$agentLabel.decision` trong các node phía sau để rẽ nhánh theo kết quả accepted, edited, hoặc refused.

## Nhánh Review trên Canvas

Output handle `review` chỉ khả dụng khi `hitlEnabled` được bật cho một agent.

- Nó chạy trước khi quyết định của con người đến
- Nó nhận payload HITL đang chờ, bao gồm `summary`, `draftText`, `reviewUrl`, `shareText`, và `shareMarkdown`
- Nó được thiết kế cho các bước thông báo hoặc chuyển tiếp như Slack, email, hoặc audit logging
- Nó chạy một lần cho mỗi checkpoint HITL
- Nó không chạy lại sau khi người review phản hồi; chỉ đường đầu ra bình thường của agent tiếp tục khi được khôi phục

## Nơi Xuất Hiện

- [Lịch sử Thực thi](./execution-history.md) hiển thị ngay các lượt chạy `pending` và lưu URL đánh giá trong kết quả của node
- Phản hồi chat trên [Portal](./portal.md) hiển thị liên kết đánh giá của con người thay vì câu trả lời trống
- Bảng Debug và các hộp thoại lịch sử hiển thị quyết định HITL cuối cùng và văn bản đã được đánh giá
- Output handle của đánh giá có thể thông báo đến các kênh bên ngoài ngay cả khi workflow được kích hoạt bởi cron, curl hoặc lưu lượng từ portal
- Nhiều checkpoint HITL dùng lại cùng một mục trong lịch sử thực thi đồng thời tạo một liên kết đánh giá dùng một lần mới cho mỗi lần tạm dừng

## Giới hạn Hiện tại

- HITL chỉ khả dụng trên các node Agent
- HITL sử dụng output văn bản của agent và không hỗ trợ output JSON trong v1
- Một lượt thực thi bị tạm dừng sẽ tiếp tục từ snapshot workflow đã lưu, không phải từ phiên bản workflow đã chỉnh sửa mới nhất
- Các sub-workflow lồng nhau không thể chuyển sang trạng thái HITL đang chờ trong v1; hãy yêu cầu đánh giá từ agent cha trước khi gọi chúng

## Liên quan

- [Node Agent](../nodes/agent-node.md) - Cấu hình HITL trên một agent
- [Kiến trúc Agent](./agent-architecture.md) - Cách agent, tool, sub-agent và HITL kết hợp với nhau
- [Lịch sử Thực thi](./execution-history.md) - Kiểm tra các lượt chạy đang chờ và đã tiếp tục
- [Board](../tabs/board-tab.md) - Các lượt chạy chuỗi trên Board sẽ tạm dừng thẻ ở trạng thái đang chờ (màu hổ phách) khi gặp HITL
- [Portal](./portal.md) - Các luồng chat công khai và liên kết đánh giá HITL
