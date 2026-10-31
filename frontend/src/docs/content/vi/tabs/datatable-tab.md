# DataTable

Tab **DataTable** cho phép bạn tạo và quản lý các bảng dữ liệu có cấu trúc trực tiếp trong Heym. Các bảng có thể được sử dụng trong workflow thông qua [DataTable node](../nodes/datatable-node.md) để thực hiện các thao tác CRUD theo chương trình.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Xem demo DataTable</a></p>

## Tạo bảng

1. Điều hướng đến tab DataTable từ dashboard
2. Nhấp vào **Create DataTable**
3. Nhập tên và mô tả tùy chọn
4. Thêm các cột bằng trình chỉnh sửa cột

## Cột

Mỗi cột có:

| Thuộc tính | Mô tả |
|----------|-------------|
| Name | Tên hiển thị của cột |
| Type | `string`, `number`, `boolean`, `date`, hoặc `json` |
| Required | Liệu các hàng mới có bắt buộc phải bao gồm cột này không |
| Unique | Liệu các giá trị có phải là duy nhất trên các hàng không |
| Default Value | Tự động điền khi một hàng bỏ qua cột này |

Thêm, chỉnh sửa hoặc xóa các cột từ tiêu đề chế độ xem chi tiết bảng.

## Tạo cột bằng AI

Thay vì thêm cột thủ công, bạn có thể mô tả bảng bằng ngôn ngữ tự nhiên (hoặc dán JSON mẫu) và để LLM đề xuất schema. Cả hai điểm truy cập đều mở cùng một hộp thoại:

- **Generate with AI** (tiêu đề danh sách DataTable) — tạo một bảng hoàn toàn mới từ mô tả của bạn.
- **AI columns** (chế độ xem chi tiết bảng, bên cạnh các điều khiển cột) — đề xuất các cột *mới* để thêm vào bảng bạn đang mở.

### Cách hoạt động

1. Chọn một **LLM credential** và **model** (mặc định là LLM credential đầu tiên của bạn và model mới nhất của nó).
2. Nhập mô tả — ví dụ *"Một bảng sách với tiêu đề, tác giả, số trang, và liệu tôi đã đọc nó chưa"* — hoặc dán JSON mẫu/schema.
3. Nhấp vào **Generate**. Model trả về một schema được đề xuất.
4. Xem xét các cột được tạo trong một biểu mẫu có thể chỉnh sửa: thay đổi **name**, **type**, **default**, **unique**, và **notEmpty** (bắt buộc) cho mỗi cột, xóa các cột không mong muốn, hoặc **Add column** thủ công. Đối với bảng mới, bạn cũng có thể chỉnh sửa **name** và **description** do AI đề xuất.
5. Nhấp vào **Create Table** (bảng mới) hoặc **Add Columns** (bảng hiện có) để lưu. Nhấn **Esc** để đóng hộp thoại bất cứ lúc nào.

### Chỉ thêm vào đối với bảng hiện có

Khi tạo cột cho một bảng hiện có, model sẽ thấy các cột hiện tại của bạn làm ngữ cảnh và chỉ đề xuất các cột **mới**. Các cột hiện có và dữ liệu của chúng không bao giờ bị sửa đổi hoặc xóa — các cột được tạo sẽ được thêm vào. Các tên trùng lặp (không phân biệt chữ hoa chữ thường) sẽ tự động bị loại bỏ.

> Cần có một LLM credential (OpenAI, Google, hoặc Custom). Nếu bạn chưa có, hãy thêm một cái trong Settings trước.

## Quản lý hàng

- **Thêm hàng**: Nhấp vào nút thêm để tạo một hàng mới
- **Chỉnh sửa trực tiếp**: Nhấp đúp vào bất kỳ ô nào để chỉnh sửa giá trị của nó. Nhấn Enter hoặc nhấp ra ngoài để lưu, Escape để hủy
- **Xóa hàng**: Sử dụng menu hành động của hàng để xóa một hàng
- **Phân trang**: Các hàng hiển thị 25 mỗi trang với điều hướng trang

## Nhập/Xuất CSV

### Nhập
1. Nhấp vào **Import CSV** trong chế độ xem chi tiết bảng
2. Chọn một tệp CSV để tải lên
3. Xem trước 5 hàng đầu tiên và ánh xạ cột
4. Các cột màu xanh lá cây được khớp với các cột bảng hiện có; màu vàng là chưa khớp
5. Nhấp vào Import để chèn hàng loạt các hàng

### Xuất
Nhấp vào **Export CSV** để tải xuống tất cả các hàng dưới dạng tệp CSV.

## Chia sẻ

Chia sẻ bảng với người dùng hoặc nhóm khác:

1. Mở hộp thoại chia sẻ từ chế độ xem chi tiết bảng
2. Thêm người dùng bằng email với quyền **read** hoặc **write**
3. Thêm nhóm với quyền **read** hoặc **write**
4. Người dùng chỉ đọc có thể xem dữ liệu; người dùng có quyền ghi có thể sửa đổi các hàng và cột. Việc đổi tên bảng, thay đổi mô tả và quản lý chia sẻ vẫn chỉ dành riêng cho chủ sở hữu.

## Tạo bảng từ AI Assistant

[Trợ lý AI](../reference/ai-assistant.md#data-tables) trên canvas, [Chat](./chat-tab.md) và công cụ `heym_chat` trên [tab MCP](./mcp-tab.md) có thể chọn một trong các bảng của bạn cho workflow mà chúng xây dựng, hoặc tạo một bảng mới. Chúng đề xuất tên và các cột, đồng thời tạo bảng khi bạn gửi thẻ câu hỏi. Trợ lý canvas định cấu hình các nút workflow từ siêu dữ liệu bảng. Chat và `heym_chat` cũng có thể kiểm tra các hàng, thêm hoặc xóa cột và chèn, cập nhật hoặc xóa hàng trực tiếp. Cung cấp cho chúng tên bảng hoặc liên kết của tab này. Thao tác ghi yêu cầu quyền sở hữu hoặc quyền **ghi** trực tiếp/nhóm. Việc thêm cột giữ nguyên dữ liệu hiện có; việc xóa cột sẽ xóa giá trị của chúng khỏi mỗi hàng. Việc xóa cột và xóa tất cả các hàng đều yêu cầu xác nhận, tương ứng với tab này.

## Sử dụng trong Workflow

[DataTable node](../nodes/datatable-node.md) kết nối các bảng với workflow. Các thao tác bao gồm find, getAll, getById, insert, update, remove, và upsert. Không yêu cầu credentials.

## Bảng chi phí LLM (bảng hệ thống)

Một phần **System tables** được ghim xuất hiện phía trên các bảng do người dùng tạo của bạn với một mục duy nhất: **LLM Cost Table**. Đây là chế độ xem có schema cố định, có thể chỉnh sửa theo từng người dùng về giá theo từng model được sử dụng bởi biểu đồ chi phí [Traces](./traces-tab.md).

### Dữ liệu đến từ đâu

Heym duy trì một bảng toàn cầu về giá theo từng model được khởi tạo từ endpoint giá công khai của Helicone (`https://www.helicone.ai/api/llm-costs`). Quá trình đồng bộ chạy trong nền lần đầu tiên bạn mở bảng hoặc Traces và được giới hạn ở một lần tải mỗi 24 giờ. Nhấn **Refresh** để buộc đồng bộ lại ngay lập tức. Các mục bị Helicone xóa khỏi danh sách thượng nguồn không bị xóa cục bộ, vì vậy các tra cứu chi phí lịch sử vẫn ổn định.

### Schema (các cột chỉ đọc)

| Cột | Ý nghĩa |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (thông tin, được Helicone sử dụng) |
| Model | Định danh model được khớp với `trace.model` |
| Op | Toán tử khớp: `equals`, `startsWith`, hoặc `includes` |
| Input $/1M | USD trên 1 triệu prompt token |
| Output $/1M | USD trên 1 triệu completion token |
| Source | `helicone`, `seed`, hoặc `user` |

### Tùy chỉnh bảng giá

- **Chỉnh sửa một hàng** để ghi đè giá của hàng đó. Thay đổi ghi đè của bạn là theo từng người dùng và được đánh dấu bằng nhãn `Customized`; các lần đồng bộ Helicone trong tương lai sẽ không thay đổi nó.
- **Đặt lại về mặc định** sẽ xóa phần ghi đè và khôi phục giá trị chung cho hàng đó.
- **Thêm Model tùy chỉnh** mở một hộp thoại để tạo một hàng chỉ dành riêng cho người dùng (ví dụ: một model fine-tuned riêng tư mà Helicone không liệt kê). Các hàng tùy chỉnh được đánh dấu `User added` và khi xóa chúng sẽ bị loại bỏ hoàn toàn.

### Đối chiếu với traces

Khi bảng điều khiển Traces tính toán chi phí, nó đối chiếu mỗi `trace.model` với:

1. Các phần ghi đè của bạn (khớp chính xác theo tên model) trước tiên
2. Nếu không thì dùng bảng chung — khớp chính xác `equals` được ưu tiên hơn `startsWith`/`includes`; các trường hợp ngang nhau trong cùng một toán tử được giải quyết bằng tiền tố/chuỗi con khớp dài nhất của model

Nếu không có hàng nào khớp, model sẽ được liệt kê trong thông báo **Unpriced models** trên trang Traces; phần đóng góp chi phí của nó bằng không cho đến khi bạn thêm một hàng tùy chỉnh hoặc ghi đè một hàng.

## Liên quan

- [DataTable Node](../nodes/datatable-node.md) - Tham chiếu node Workflow
- [Traces Tab](./traces-tab.md) - Sử dụng LLM Cost Table cho biểu đồ tròn chi phí và các thẻ KPI
- [Grist Node](../nodes/grist-node.md) - Giải pháp thay thế bảng tính bên ngoài
- [Variables Tab](./global-variables-tab.md) - Giải pháp thay thế lưu trữ key-value