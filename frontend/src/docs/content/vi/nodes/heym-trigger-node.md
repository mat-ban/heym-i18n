# Heym Trigger

Node **Heym Trigger** khởi động một workflow khi chính Heym phát một sự kiện nền tảng. Đây là node trigger không có đầu vào, dùng để tự động hóa Heym bằng chính Heym: theo dõi thay đổi, thông báo triển khai và báo cáo tình trạng instance.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Output | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credential | Không yêu cầu |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `eventNames` | Mảng String | Các sự kiện cần đăng ký. Để trống để nhận mọi sự kiện. |

## Sự kiện

| Sự kiện | Được phát khi | Phạm vi |
|-------|----------------|-------|
| `heym.started` | Nền tảng Heym khởi động | Toàn instance: mọi subscriber đều nhận được |
| `workflow.created` | Một workflow được tạo | Chỉ subscriber của chủ sở hữu workflow |
| `workflow.updated` | Một workflow được lưu | Chỉ subscriber của chủ sở hữu workflow |
| `workflow.deleted` | Một workflow bị xóa | Chỉ subscriber của chủ sở hữu workflow |

Các widget dashboard được lưu trữ nội bộ dưới dạng workflow, nhưng chúng không bao giờ tạo ra sự kiện `workflow.*`.

## Gửi theo lô

Heym gửi sự kiện mỗi năm giây. **Mọi sự kiện được nhận trong một lượt gửi sẽ đến trong một lần chạy workflow duy nhất**, dưới dạng một mảng.

- Tạo hai workflow trong vòng năm giây → **một** lần chạy với hai sự kiện.
- Tạo một workflow → **một** lần chạy với mảng một phần tử.

Cấu trúc không bao giờ thay đổi, vì vậy các biểu thức phía sau không bao giờ phải rẽ nhánh dựa trên việc có một hay nhiều sự kiện đến. Khi bạn cần xử lý từng sự kiện một, hãy đặt node [Loop](./loop-node.md) trên `$nodeLabel.events`.

## Gửi đúng một lần

Mỗi sự kiện được nhận theo từng node đăng ký thông qua một ràng buộc cơ sở dữ liệu duy nhất trước khi được gửi. Điều này đúng trên mọi uvicorn worker, mọi container và mọi máy: chạy Heym trên hai server không gửi một sự kiện hai lần. Nếu không thể ghi nhận việc nhận, sự kiện sẽ không được gửi — thiết kế này thất bại theo hướng đóng thay vì kích hoạt hai lần.

Hai node `heymTrigger` khác nhau đăng ký cùng một sự kiện đều nhận được nó một lần; chúng không cạnh tranh nhau.

## Cửa sổ gửi

Bộ gửi chỉ xem xét các sự kiện được phát trong **năm phút gần nhất**. Các sự kiện cũ hơn vẫn nằm trong log để kiểm tra nhưng không bao giờ được gửi. Điều này giới hạn những gì xảy ra sau thời gian ngừng hoạt động: khởi động lại Heym sau một giờ offline sẽ không phát lại gì cả, thay vì kích hoạt một giờ tồn đọng cùng lúc.

Sự kiện được lưu trong **7 ngày** rồi bị xóa.

## Các trường Output

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.events` | Mảng các đối tượng sự kiện, cũ nhất trước. Luôn là một mảng. |
| `$nodeLabel.events[0].id` | UUID sự kiện |
| `$nodeLabel.events[0].name` | Tên sự kiện, ví dụ `workflow.created` |
| `$nodeLabel.events[0].payload` | Nội dung sự kiện |
| `$nodeLabel.events[0].workflow_id` | Id workflow chủ thể, hoặc `null` với `heym.started` |
| `$nodeLabel.events[0].created_at` | Timestamp ISO cho thời điểm sự kiện được phát |
| `$nodeLabel.count` | Số lượng sự kiện trong lô này |
| `$nodeLabel.triggered_at` | Timestamp ISO cho lần thực thi workflow |

### Cấu trúc Payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` mang theo tên được ghi lại ngay trước khi xóa, vì hàng workflow đã biến mất vào lúc bạn đọc sự kiện.

## Workflow ví dụ

**Theo dõi thay đổi workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** với label `platformEvents`, đăng ký `workflow.created`, `workflow.updated`, `workflow.deleted`
- Node **Heym** với `getWorkflow` và `heymWorkflowId` được đặt thành `$platformEvents.events[0].workflow_id`
- Tin nhắn **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Ghi chú

- `heym.started` kích hoạt **một lần cho mỗi lần khởi động nền tảng**, không phải một lần cho mỗi worker, dù Heym chạy tám worker mỗi container. Các container khởi động cách nhau hơn năm phút sẽ mỗi cái phát một sự kiện.
- Các lần thực thi được kích hoạt theo cách này xuất hiện trong lịch sử với `trigger_source = "heym_event"`.
- Đặt **Events** thành rỗng thay vì liệt kê cả bốn sự kiện nếu bạn muốn tự động nhận các loại sự kiện được thêm trong các phiên bản tương lai.

## Liên quan

- [Heym](./heym-node.md) – Đọc workflow và lịch sử thực thi
- [Triggers](../reference/triggers.md) – Tổng quan về tất cả các điểm vào của workflow
- [Loop](./loop-node.md) – Xử lý từng sự kiện một trong một lô
