# Heym

Node **Heym** đọc dữ liệu của chính Heym: các workflow bạn có thể truy cập, cấu trúc của một workflow, và lịch sử thực thi của nó. Đây là cách bạn xây dựng các meta-workflow — bản kiểm kê instance, bản tóm tắt thực thi, và báo cáo tình trạng về chính Heym.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Thao tác | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credential | Không yêu cầu |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `heymOperation` | Select | Thao tác đọc cần thực hiện |
| `heymWorkflowId` | UUID | Hãy đặt thành `all` cho `getExecutionHistory` để đọc mọi Workflow mà bạn có thể truy cập. |
| `heymLimit` | String | Số hàng tối đa trả về. **Để trống hoặc nhập `0` để trả về tất cả** — đó là giá trị mặc định. Hỗ trợ biểu thức. |
| `heymStatus` | String | Bộ lọc trạng thái tùy chọn cho `getExecutionHistory`. Hỗ trợ biểu thức. |
| `heymSinceDays` | String | Khoảng thời gian tra cứu ngược tùy chọn tính theo ngày cho `getExecutionHistory`. Hỗ trợ biểu thức. |

Bộ chọn workflow là một dropdown có thể tìm kiếm, liệt kê mọi workflow bạn có thể truy cập.

## Phạm vi truy cập

Kết quả được giới hạn theo **chủ sở hữu của workflow chứa node này** — không phải theo người khởi chạy lượt chạy. Tập hợp hiển thị bao gồm:

- các workflow do chủ sở hữu sở hữu,
- các workflow được chia sẻ trực tiếp với chủ sở hữu,
- các workflow được chia sẻ với một team mà chủ sở hữu là thành viên.

Việc giới hạn theo chủ sở hữu là điều khiến node hoạt động nhất quán dù lượt chạy được khởi chạy thủ công, bởi cron, từ portal, hay bởi một sự kiện nền tảng. Nếu giới hạn theo actor, node sẽ trả về rỗng trong mọi lượt chạy không có người giám sát. Đây cũng chính là quy tắc Heym đang dùng cho credential và biến toàn cục.

Một workflow bạn không thể truy cập và một workflow không tồn tại sẽ tạo ra cùng một thông báo lỗi, nên không thể dùng node này để dò tìm workflow id.

## Các thao tác

### Liệt kê Workflow

Trả về mọi workflow mà chủ sở hữu có thể truy cập, sắp xếp theo lần cập nhật gần nhất trước.

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.workflows` | Mảng các bản tóm tắt workflow |
| `$nodeLabel.workflows[0].id` | UUID của workflow |
| `$nodeLabel.workflows[0].name` | Tên workflow |
| `$nodeLabel.workflows[0].description` | Mô tả, hoặc `null` |
| `$nodeLabel.workflows[0].active` | Workflow có đang hoạt động hay không |
| `$nodeLabel.workflows[0].folder_id` | UUID của thư mục, hoặc `null` |
| `$nodeLabel.workflows[0].updated_at` | Dấu thời gian ISO của lần lưu cuối cùng |
| `$nodeLabel.workflows[0].node_count` | Số lượng node mà workflow chứa |
| `$nodeLabel.total` | Tổng số lượng có thể truy cập **trước khi** áp dụng giới hạn |

`total` được cố ý tính là số lượng không giới hạn, nên `$inventory.total` vẫn báo cáo kích thước thực khi bạn giới hạn số hàng trả về. Xóa **Limit**, hoặc đặt thành `0`, sẽ trả về mọi workflow — đây là giá trị mặc định.

### Lấy Workflow

Trả về danh tính và cấu trúc của một workflow.

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Danh tính workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadata của workflow |
| `$nodeLabel.node_count` | Số lượng node |
| `$nodeLabel.nodes` | Mảng `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Mảng `{ id, source, target, sourceHandle, targetHandle }` |

`data` là **cấu hình đầy đủ của node** — mọi trường đúng như khi được lưu. Đó là điều khiến việc kiểm toán trở nên khả thi: bạn không thể quét một workflow để tìm API key mà ai đó đã dán vào một trường nếu node từ chối hiển thị trường đó.

Điều này không cấp thêm quyền truy cập nào mà người gọi chưa có. Node được giới hạn theo các workflow mà chủ sở hữu vốn có thể mở trong trình soạn thảo, và các bí mật credential đã lưu vẫn không xuất hiện ở đây: dữ liệu node chỉ chứa **id** của credential, còn bản thân các bí mật được lưu mã hóa trong bảng credentials.

### Quét tìm bí mật bị hardcode

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Cung cấp cho agent `$detail.nodes` và yêu cầu nó đánh dấu bất kỳ giá trị `data` nào trông giống như key hoặc token đang hoạt động. Những trường đáng chú ý là các trường văn bản tự do — `curl` trên các node HTTP, `userMessage` và `systemInstruction` trên các node LLM và Agent, và phần thân của Python tool — bởi vì một credential id là một UUID vô hại, nhưng một chuỗi `sk-…` bị dán vào thì không.
### Lấy Lịch Sử Thực Thi

Trả về các mục lịch sử thực thi cho một workflow, mới nhất trước.

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.executions` | Mảng các mục lịch sử |
| `$nodeLabel.executions[0].id` | UUID thực thi |
| `$nodeLabel.executions[0].status` | `success`, `error`, v.v. |
| `$nodeLabel.executions[0].started_at` | Dấu thời gian ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Thời lượng thực tế |
| `$nodeLabel.executions[0].trigger_source` | Yếu tố khởi động lần chạy, ví dụ `cron` hoặc `heym_event` |
| `$nodeLabel.executions[0].recovered` | Liệu lần chạy có được khôi phục sau sự cố hay không |
| `$nodeLabel.executions[0].inputs` | Những gì lần chạy nhận được - payload trigger hoặc đầu vào của bên gọi |
| `$nodeLabel.executions[0].outputs` | Đầu ra của workflow cho lần chạy đó |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow mà lịch sử thuộc về, hoặc `null` với **{AW}** |
oặc `null` với **{AW}** |
| `$nodeLabel.total` | Tổng số thực thi khớp **trước** giới hạn |
| `$nodeLabel.by_| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Với **{AW}**, Workflow mà mỗi lần chạy thuộc về |
status` | Số lượng theo trạng thái, ví dụ `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Bắt đầu cửa sổ, hoặc `null` cho toàn bộ lịch sử |

Các mục mang cả `inputs` và `outputs` - những gì lần chạy nhận được và những gì nó trả lời - nhưng không bao giờ có `node_results`: dấu vết từng node là cột lớn nhất trong bảng và sẽ lấn át mọi thứ phía sau. Truy xuất một thực thi đơn lẻ qua API khi bạn cần dấu vết đầy đủ.

`total` và `by_status` luôn mô tả **toàn bộ** lịch sử khớp, ngay cả khi **Limit** giới hạn các mục được trả về — vì vậy bạn có thể lấy năm lần chạy gần nhất và vẫn báo cáo số lần thất bại chính xác.

Để trống **Since (days)** để bao quát mọi thứ, để trống **Status filter** để bao gồm mọi trạng thái, và để trống **Limit** hoặc `0` để trả về mọi mục.

## Workflow Ví Dụ

**Bản tóm tắt instance hàng ngày**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` được gán nhãn `inventory`
- **Loop** qua `$inventory.workflows`
- **Heym** `getExecutionHistory` với `heymWorkflowId` được đặt thành `id` của mục trong loop, `heymSinceDays` là `1`, và `heymLimit` là `5`
- **LLM** chuyển các lần chạy đã thu thập và số lượng trạng thái thành bản tóm tắt dễ đọc

## Ghi Chú

- Không cần credential; node đọc cùng cơ sở dữ liệu mà Heym đang chạy.
- **Limit** là cùng một trường cho cả hai thao tác liệt kê, và nó có cùng ý nghĩa trong cả hai: để trống hoặc `0` trả về mọi thứ.
- Node nhận đầu vào bình thường và có thể được gắn vào node Agent như một công cụ, để agent có thể trả lời câu hỏi về instance Heym của bạn — hoặc kiểm toán nó.
- Payload của `getWorkflow` tăng theo workflow: các prompt dài và phần thân công cụ Python đều di chuyển bên trong `data`.
- Kết hợp nó với [Heym Trigger](./heym-trigger-node.md) để phản ứng với các thay đổi workflow ngay khi chúng xảy ra thay vì thăm dò theo lịch.

## Liên Quan

- [Heym Trigger](./heym-trigger-node.md) – Khởi động workflow từ các sự kiện nền tảng
- [Execute](./execute-node.md) – Chạy một workflow khác thay vì mô tả nó
- [Loop](./loop-node.md) – Lặp qua danh sách workflow được trả về
