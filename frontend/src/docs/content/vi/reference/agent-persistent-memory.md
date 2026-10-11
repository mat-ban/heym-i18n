# Bộ nhớ liên tục của Agent

Các node Agent có thể duy trì một **đồ thị tri thức theo từng node** được lưu trong cơ sở dữ liệu: các thực thể (với loại và thuộc tính) và các mối quan hệ giữa chúng. Khi được bật, Heym **chèn một bản tóm tắt của đồ thị đó vào system prompt** trong mỗi lần chạy (nếu đồ thị không rỗng). Sau một lần chạy thành công, một **tác vụ trích xuất bằng LLM** sẽ hợp nhất các dữ kiện mới từ cuộc hội thoại vào đồ thị trong nền.

Các sub-agent và orchestrator mặc định đều sử dụng đồ thị gắn với **node canvas của chính chúng**. Bạn cũng có thể **cấp cho các agent khác quyền đọc hoặc đọc/ghi** đối với đồ thị của node này (bao gồm cả các agent trong **các workflow khác** mà bạn sở hữu)—xem [Chia sẻ với các agent khác](#sharing-with-other-agents).

## Kích hoạt

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Khi là `true`, tải đồ thị của node này vào system prompt và lên lịch trích xuất sau khi chạy cho đồ thị của node này |
| `memoryShares` | array (tùy chọn) | Cấp cho các node agent khác quyền truy cập vào đồ thị bộ nhớ của **node này**; xem [Chia sẻ](#sharing-with-other-agents) |

Bật nó trong thuộc tính của node Agent (**Persistent memory (graph)**). Biểu tượng **brain** màu hồng trên node sẽ mở trình chỉnh sửa đồ thị khi bộ nhớ được bật (hoặc khi một model được hiển thị).

## Trình chỉnh sửa đồ thị

Hộp thoại hiển thị các thực thể dưới dạng một đồ thị lực đẩy động — các vòng tròn được tô màu với kích thước theo số lượng kết nối và được nhóm theo loại thực thể — cùng với các tính năng chỉnh sửa và điều hướng (fit view, sắp xếp gọn gàng, phím tắt). Bạn có thể **thêm, chỉnh sửa hoặc xóa** các node và cạnh theo cách thủ công; các bộ chọn mối quan hệ Source/Target có thể tìm kiếm được đối với các đồ thị có nhiều thực thể. Chọn một node sẽ hiển thị các kết nối đi ra và đi vào của nó, mỗi kết nối có thể nhấp để nhảy đến node đó. Các thay đổi chỉ áp dụng cho đồ thị của agent **này** (đồ thị của node canvas mà bạn đã mở brain).

## Chia sẻ với các agent khác

Trong hộp thoại đồ thị bộ nhớ, **Share memory with other agents** cho phép bạn đính kèm các **peer** có thể sử dụng đồ thị này tại thời điểm chạy:

1. Chọn một **workflow** (bất kỳ workflow nào bạn có thể mở trong trình chỉnh sửa).
2. Chọn một node **agent** trong workflow đó.
3. Đặt **Read only** hoặc **Read & write**.

| Quyền | Hiệu lực |
|------------|--------|
| Read only | Khi agent **peer** chạy, đồ thị này được hợp nhất vào system prompt của peer (nếu nó có thực thể). Không trích xuất vào đồ thị này từ lần chạy của peer. |
| Read & write | Hành vi prompt tương tự như read, và sau khi peer hoàn thành **thành công**, việc trích xuất bộ nhớ thông thường cũng có thể **hợp nhất vào đồ thị (chủ sở hữu) này** bằng credential của lần chạy peer. |

Các peer được lưu theo từng node chủ sở hữu dưới dạng các mục `memoryShares` với `peerWorkflowId` và `peerCanvasNodeId` (và `permission`). Các workflow cũ hơn có thể bỏ qua `peerWorkflowId` đối với các peer trong **cùng** workflow; trình chỉnh sửa coi đó là workflow hiện tại.

**Chia sẻ xuyên workflow** được giải quyết tại thời điểm chạy bằng cách quét các workflow **bạn sở hữu**. Các lần chạy không có ngữ cảnh người dùng đã xác thực chỉ giải quyết các chia sẻ được định nghĩa trong JSON của workflow **hiện tại** (cùng canvas).

## Hành vi tại thời điểm chạy

### Đồ thị riêng (`persistentMemoryEnabled`)

1. **Trước lệnh gọi LLM** — Nếu đồ thị có thực thể, một khối được thêm vào system instruction giải thích rằng đây là các dữ kiện từ những lần chạy trước (có thể không đầy đủ; tin nhắn hiện tại của người dùng sẽ thắng khi xung đột).
2. **Sau khi hoàn thành thành công** — Một tác vụ nền yêu cầu model (cùng credential như lần chạy agent) trả về JSON có cấu trúc (thực thể + mối quan hệ). Payload đó được hợp nhất vào cơ sở dữ liệu (áp dụng khử trùng lặp và dọn dẹp mối quan hệ cho một số loại, ví dụ các cạnh kiểu quan hệ việc làm).

### Peer nhận đồ thị được chia sẻ

Khi một agent chạy, hệ thống tìm các node **chủ sở hữu** (trong bất kỳ workflow nào của bạn, khi có thể) mà `memoryShares` của chúng trỏ đến workflow và node canvas của lần chạy này. Với mỗi kết quả khớp, đồ thị của chủ sở hữu đó được thêm vào như một phần **shared memory** trong system prompt. Các peer **Read & write** còn lên lịch các mục tiêu trích xuất cho workflow/đồ thị của **chủ sở hữu** khi lần chạy thành công.

Việc trích xuất **không** chạy khi lần chạy gặp lỗi hoặc kết thúc ở trạng thái HITL đang chờ xử lý.

## Workflow JSON (trường `data`)

Được lưu trên node agent giống như các cài đặt khác:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` là `"read"` hoặc `"write"`. Bỏ qua `memoryShares` hoặc dùng `[]` khi không chia sẻ.

Xem [Workflow Structure](./workflow-structure.md) để biết hình dạng đầy đủ của đối tượng node.

## Liên quan

- [Agent Node](../nodes/agent-node.md) — Cấu hình đầy đủ của agent
- [Agent Architecture](./agent-architecture.md) — Orchestrator, sub-agent, công cụ
- [Workflow Structure](./workflow-structure.md) — Định dạng JSON của workflow
- [Canvas Features](./canvas-features.md) — Điều khiển brain và hộp thoại đồ thị
- [Traces tab](../tabs/traces-tab.md) — Khả năng quan sát yêu cầu/phản hồi LLM
