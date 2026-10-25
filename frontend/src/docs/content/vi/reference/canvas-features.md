# Các tính năng của Canvas

Trình chỉnh sửa workflow cung cấp một số tính năng để gỡ lỗi, kiểm thử và sắp xếp các node: **Run to Node**, **AI trên một Node**, **Data Pin**, **Execution Logs**, **Enable/Disable** và **Extract to Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Xem bản demo Editor</a></p>

## Run to Node

Di chuột qua bất kỳ node nào (trừ sticky note) và nhấp vào **Run** bên dưới node đó. Heym sẽ thực thi node đó cùng các dependency phía trước (upstream), giữ nguyên các node phía sau (downstream) và các nhánh không liên quan. Tính năng này sử dụng chế độ test trên canvas, bao gồm cả output đã pin và các điều kiện nhánh thông thường của workflow.

Nếu đường dẫn được chọn có các trường nhập liệu, bảng **Run** bên phải sẽ mở ra và focus vào trường đầu tiên. Nhập các giá trị, sau đó nhấp vào **Run to _node label_** hoặc nhấn **Ctrl+Enter** (Cmd+Enter trên macOS). Chế độ generic body sẽ focus vào trình chỉnh sửa JSON body. Các đường dẫn không có trường nhập liệu sẽ chạy ngay lập tức mà không mở bảng. Các Input node đã pin sẽ tái sử dụng output đã pin mà không yêu cầu nhập liệu.

Bảng này giữ lại target đã chọn cho các lần chạy tiếp theo. Chọn **Run full workflow** để xóa target. Các nút Run bị vô hiệu hóa khi có một execution đang chạy. Nếu target nằm trong một loop, quá trình chạy sẽ dừng lại khi node đó được tiếp cận lần đầu; chọn một node sau loop sẽ chạy toàn bộ loop phía trước (upstream).

## AI trên một Node

Di chuột qua bất kỳ node nào ngoại trừ ghi chú dán và nhấp vào **AI** phía trên node đó. [AI Assistant](./ai-assistant.md) sẽ mở trên node đó và cung cấp **Change this node as ...**, **Fix error in this node ...** và **Other**. Ở chế độ Agent, trợ lý chỉ thay đổi node đó; các node khác, kết nối và bố cục vẫn giữ nguyên. Xem [AI Assistant › Thay đổi một Node](./ai-assistant.md#changing-one-node).

Nút này bị ẩn trên các workflow mà bạn chỉ có quyền xem.

## Data Pin

Data Pin cho phép bạn pin output của một node từ lần chạy cuối cùng để có thể kiểm thử các node phía sau (downstream) mà không cần thực thi lại node đã pin.

### Vị trí tìm

- **Bảng Properties** – Chọn một node và cuộn đến phần **Pinned Data**
- **Node badge** – Biểu tượng pin xuất hiện trên node khi dữ liệu được pin

### Các thao tác

| Thao tác | Mô tả |
|--------|-------------|
| **Pin** | Pin output của lần thực thi cuối cùng của node (khả dụng sau khi chạy) |
| **Clear** | Xóa dữ liệu đã pin |
| **Edit** | Chỉnh sửa trực tiếp JSON đã pin; nhấp Save để áp dụng |

### Hành vi trong Test Mode

Khi chạy một workflow ở test mode, các node có `pinnedData` sẽ bỏ qua bước thực thi và sử dụng output đã pin thay thế. Sử dụng tính năng này để:

- Kiểm thử logic phía sau (downstream) mà không cần gọi API bên ngoài
- Gỡ lỗi các expression tham chiếu đến output của node
- Tinh chỉnh prompt hoặc điều kiện với dữ liệu mẫu cố định

Tính năng hoàn thành expression trong trình chỉnh sửa sẽ sử dụng dữ liệu đã pin khi có sẵn để gợi ý các trường.

## Execution Logs

**Debug panel** (ngăn kéo phía dưới) hiển thị log thực thi theo thời gian thực trong quá trình chạy workflow. Bạn cũng có thể mở một execution production đang chạy từ hộp thoại History hoặc từ một thẻ Board. Trình chỉnh sửa sẽ gắn vào SSE stream của lần chạy đó, khôi phục kết quả của các node đã hoàn thành và tiếp tục hiển thị animation cùng log của node khi các node mới bắt đầu và kết thúc.

### Nội dung hiển thị

- **Node results** – Trạng thái từng node (`success`, `error`, `skipped`, `running`), thời gian thực thi và output
- **Final outputs** – Output tổng hợp từ các node [Output](../nodes/output-node.md)
- **Agent progress** – Đối với các node [Agent](../nodes/agent-node.md), hiển thị từng bước gọi tool và quá trình suy luận

### Các thao tác

- **Copy as JSON** – Sao chép toàn bộ execution log vào clipboard
- **Open in JSON editor** – Mở log trong JSON Hero hoặc JSON Editor Online để kiểm tra
- **Download generated files** – Nếu một skill tạo ra các file có thể tải xuống (`_generated_files`), nút Download sẽ xuất hiện. Một file sẽ tải trực tiếp; nhiều file sẽ mở popup chọn lựa.

### Phân biệt với Logs Tab

Debug panel hiển thị log **thực thi workflow** (kết quả node, output). [Logs Tab](../tabs/logs-tab.md) hiển thị log **Docker container** (backend, frontend, database). <!-- pragma: allowlist secret -->

## Enable / Disable

Bạn có thể vô hiệu hóa các node để chúng bị bỏ qua trong quá trình thực thi. Các node bị vô hiệu hóa sẽ hiển thị badge "off" và mờ đi.

### Cách bật/tắt

| Phương thức | Mô tả |
|--------|-------------|
| **Bảng Properties** | Chọn node → Biểu tượng Power (góc trên bên phải) |
| **Menu ngữ cảnh** | Nhấp chuột phải vào node → Disable hoặc Enable |
| **Bàn phím** | Chọn node → nhấn **D** (xem [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Chọn nhiều node

Khi nhiều node được chọn, Enable/Disable sẽ áp dụng cho tất cả. Menu ngữ cảnh hiển thị "Enable" nếu có bất kỳ node nào đang bị vô hiệu hóa, "Disable" nếu tất cả đều đang được bật.

### Hành vi khi chạy

Các node có `active: false` sẽ bị bỏ qua. Các node phía sau (downstream) sẽ không nhận được dữ liệu từ các node bị bỏ qua. Sử dụng tính năng này để tạm thời loại trừ các node mà không cần xóa chúng.

Để bật hoặc tắt một node từ bên trong workflow thay vì thao tác thủ công, hãy sử dụng [Disable Node](../nodes/disable-node.md) và [Enable Node](../nodes/enable-node.md).

## Đồ thị bộ nhớ của Agent

Các node [Agent](../nodes/agent-node.md) có bật **[bộ nhớ lâu dài](./agent-persistent-memory.md)** sẽ hiển thị nút điều khiển **brain** màu hồng trên node. Nhấp vào đó để mở trình chỉnh sửa đồ thị bộ nhớ: các thực thể được hiển thị dưới dạng đồ thị lực đẩy động, được nhóm theo loại thực thể, với các bộ chọn Source/Target có thể tìm kiếm để thêm mối quan hệ và bảng kết nối để chuyển đổi giữa các thực thể liên kết. Cùng hộp thoại đó bao gồm **Share memory with other agents** (workflow → agent → read hoặc read/write) để [chia sẻ bộ nhớ giữa các agent](./agent-persistent-memory.md#sharing-with-other-agents). Trong khi hộp thoại đang mở, thao tác undo/redo trên canvas chính sẽ bị hoãn lại để việc chỉnh sửa đồ thị giữ lịch sử riêng của nó.

**Lọc đồ thị.** Góc trên bên trái của canvas có một nút điều khiển tìm kiếm, được thu gọn thành nút phím tắt cho đến khi bạn nhấp vào nó hoặc nhấn **Ctrl/Cmd+F**. Nó khớp với tên thực thể, loại của nó, và mọi khóa và giá trị thuộc tính, cũng như loại mối quan hệ (`parent_of`) và các thuộc tính của nó; một mối quan hệ khớp sẽ mang theo cả hai thực thể của nó. Tất cả các từ được phân tách bằng khoảng trắng đều phải khớp. Một thực thể khớp sẽ mang theo toàn bộ vùng lân cận của nó — mọi mối quan hệ mà nó tham gia và thực thể ở phía bên kia của mỗi mối quan hệ — vì vậy một kết quả khớp không bao giờ bị bỏ lại như một điểm không kết nối. Một mối quan hệ khớp chỉ mang theo hai thực thể mà nó kết nối và dừng lại ở đó, vì tìm kiếm một loại quan hệ là một câu hỏi về quan hệ đó chứ không phải về mọi thứ mà các đầu của nó gắn vào. Mọi thứ khác bị ẩn hoàn toàn — không bị làm mờ — trên canvas và trong danh sách **All edges**, và một huy hiệu hiển thị số lượng thực thể còn lại trên tổng số. Nút **✕** bên trong ô sẽ xóa truy vấn trước, sau đó đóng ô khi nhấn lần thứ hai. Phím Escape cũng thu hồi theo cách tương tự, từ trong ra ngoài: nó xóa truy vấn, sau đó đóng ô tìm kiếm, sau đó thoát khỏi chế độ xem canvas mở rộng, và chỉ đóng hộp thoại khi không còn mục nào trong số đó đang mở. Việc xóa sẽ khôi phục toàn bộ đồ thị với mọi thực thể trở về vị trí ban đầu.

**Đặt thực thể thủ công.** Kéo một thực thể sẽ ghim nó tại vị trí bạn thả, để bố cục tự động sắp xếp phần còn lại của đồ thị xung quanh nó thay vì kéo nó trở lại. Kéo thực thể bạn đã chọn sẽ di chuyển các thực thể được kết nối trực tiếp cùng với nó, giữ nguyên hình dạng của nhóm; kéo bất kỳ thực thể nào khác chỉ di chuyển thực thể đó. **Tidy layout** (nút cây đũa thần) sẽ giải phóng mọi thực thể đã ghim và chạy lại bố cục tự động.

## Extract to Sub-Workflow

Chuyển các node đã chọn thành một sub-workflow có thể tái sử dụng và thay thế chúng bằng một node [Execute](../nodes/execute-node.md).

### Cách sử dụng

1. Chọn một hoặc nhiều node trên canvas
2. Nhấp chuột phải → **Extract to Sub-Workflow**
3. Nhập tên (và mô tả tùy chọn) cho workflow mới
4. Nhấp **Extract**

### Điều gì sẽ xảy ra

- Một workflow mới được tạo với các node đã chọn
- Các đầu vào bên ngoài (các edge từ bên ngoài vùng chọn) trở thành các trường [Input](../nodes/input-node.md) của sub-workflow
- Các đầu ra bên ngoài (các edge đến các node bên ngoài vùng chọn) được ánh xạ tới [Output](../nodes/output-node.md) của sub-workflow
- Các node đã chọn được thay thế bằng một node [Execute](../nodes/execute-node.md) duy nhất gọi workflow mới
- Các ánh xạ input/output được giữ nguyên tự động

### Trường hợp sử dụng

- Tái sử dụng một chuỗi node trên nhiều workflow
- Đơn giản hóa một workflow phức tạp bằng cách nhóm logic liên quan lại
- Tạo các sub-workflow dạng mô-đun, có thể kiểm thử

## Run with cURL

Nút **cURL** trên thanh công cụ của trình chỉnh sửa (góc trên bên phải) mở một hộp thoại để tạo và sao chép lệnh cURL nhằm kích hoạt workflow qua API.

- Chọn chế độ request body của workflow (`Defined` hoặc `Generic`)
- Đặt loại xác thực (Anonymous, JWT, hoặc Header Auth)
- Cấu hình bộ nhớ đệm phản hồi và giới hạn tốc độ
- Bật/tắt truyền phát SSE và tùy chỉnh thông báo khởi động cho từng node
- Chỉnh sửa request body
- Ở chế độ Generic, bảng chạy trên canvas sử dụng cùng raw JSON body như hộp thoại cURL
- Nhấp **Copy cURL** để sao chép lệnh sẵn sàng chạy

Xem [Webhooks](./webhooks.md#run-with-curl-dialog) để biết chi tiết đầy đủ về hộp thoại và [SSE Streaming](./sse-streaming.md) để biết giao thức sự kiện.

## Related

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Tất cả phím tắt trên canvas và trình chỉnh sửa
- [Agent Persistent Memory](./agent-persistent-memory.md) – Hành vi và API của đồ thị bộ nhớ
- [Execute Node](../nodes/execute-node.md) – Gọi các sub-workflow
- [Expression DSL](./expression-dsl.md) – Tham chiếu và dữ liệu đã ghim
- [Workflow Structure](./workflow-structure.md) – Định dạng node và edge
- [Download & Import](./download-import.md) – Xuất và nhập workflow dưới dạng JSON
- [Node Types](./node-types.md) – Tất cả các loại node
- [Logs Tab](../tabs/logs-tab.md) – Nhật ký container Docker
- [Execution History](./execution-history.md) – Các lần chạy trước đó
- [Templates](../tabs/templates-tab.md) – Lưu và tái sử dụng workflow và node
- [Contextual Showcase](./contextual-showcase.md) – Hướng dẫn trang rút gọn có sẵn trong trình chỉnh sửa

- [Cộng tác trên Canvas](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
