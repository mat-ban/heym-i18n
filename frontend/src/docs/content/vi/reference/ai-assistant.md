# Trợ lý AI

**Trợ lý AI** là một bảng chat mở ra từ bảng Debug và khởi đầu ở góc dưới bên phải của trình soạn thảo. Kéo phần tiêu đề để di chuyển bảng, và kéo một cạnh hoặc một góc để thay đổi chiều rộng hoặc chiều cao. Bảng sẽ không thu nhỏ dưới 360×480 pixel. Vị trí và kích thước được ghi nhớ trong trình duyệt này. **Đặt lại vị trí và kích thước** trong phần tiêu đề sẽ đưa bảng trở về góc dưới bên phải. Sử dụng ngôn ngữ tự nhiên để tạo hoặc chỉnh sửa workflow—mô tả điều bạn muốn, và AI sẽ tạo ra các node và edge được áp dụng lên canvas.

Đối với các câu hỏi về tài liệu nằm ngoài trình soạn thảo, hãy sử dụng [Chat với Heym](./chat-with-heym.md). Giao diện đó được tối ưu hóa cho trợ giúp sản phẩm theo ngữ cảnh trang thay vì tạo workflow.

## Mở bảng

1. Mở một workflow trong trình soạn thảo
2. Tìm **bảng Debug** ở phía dưới (khu vực kết quả thực thi)
3. Nhấp vào nút **AI** (biểu tượng Sparkles) trên thanh công cụ của bảng
4. Bảng Trợ lý AI mở ra ở góc dưới bên phải. Kéo phần tiêu đề để di chuyển, hoặc kéo một cạnh hoặc một góc để thay đổi chiều rộng và chiều cao.

Nhấn `Ctrl + I` / `Cmd + I` ở bất kỳ đâu trong trình soạn thảo để mở hoặc đóng bảng — phím tắt hoạt động ngay cả khi con trỏ đang ở trong ô nhập văn bản. Xem [Phím tắt](./keyboard-shortcuts.md).

Để làm việc trên một node duy nhất, hãy di chuột qua node đó trên canvas và nhấp vào **AI** phía trên. Bảng điều khiển sẽ mở ra và tập trung vào node đó. Xem [Thay đổi một Node](#changing-one-node).

## Đóng bảng

Nhấp vào nút **X**, nhấn `Ctrl + I` / `Cmd + I`, hoặc bật/tắt nút **AI** trên thanh công cụ của bảng Debug. Phần tiêu đề dùng để kéo bảng; nó không đóng bảng.

## Cấu hình

Trước khi gửi tin nhắn, hãy chọn:

| Cài đặt | Mô tả |
|---------|-------------|
| **Credential** | Thông tin xác thực LLM (API key) từ [Credentials](../tabs/credentials-tab.md) |
| **Model** | Tên model (ví dụ: `gpt-4o`, `gemini-2.5-flash`) |

Thêm thông tin xác thực trong [Tab Credentials](../tabs/credentials-tab.md). Danh sách model được tải từ thông tin xác thực đã chọn.

## Chế độ Agent và chế độ Ask

Bảng có hai chế độ, được chuyển đổi bằng chip **Agent / Ask** ở phần tiêu đề của bảng.

| Chế độ | Mặc định | Hành vi |
|------|---------|-----------|
| **Agent** | ✓ | Xây dựng và chỉnh sửa canvas. AI tạo ra một khối JSON workflow được tự động áp dụng lên canvas khi phản hồi hoàn tất. |
| **Ask** | | Chỉ trả lời câu hỏi. Canvas không bao giờ bị thay đổi. Sử dụng chế độ này để hỏi về workflow của bạn, các tính năng của Heym, hoặc nhận lời khuyên mà không kích hoạt cập nhật canvas. |

Chuyển đổi chế độ bất kỳ lúc nào. Việc thay đổi chế độ không xóa cuộc hội thoại.

Trong chế độ Agent, hộp **YOLO mode** bên dưới ô nhập tin nhắn cho phép trợ lý chạy và sửa những gì nó xây dựng. Xem [Chế độ YOLO](#yolo-mode).

## Sử dụng chat

- Nhập yêu cầu của bạn vào ô nhập (ví dụ: "Tạo một workflow nhận đầu vào từ người dùng và gửi đến một LLM")
- Nhấn **Enter** để gửi (Shift+Enter để xuống dòng)
- AI truyền phát phản hồi của nó. Trong chế độ **Agent**, nếu phản hồi chứa một workflow trong khối mã \`\`\`json, nó sẽ được tự động phân tích và áp dụng lên canvas. Trong chế độ **Ask**, canvas không bao giờ bị thay đổi.
- Sử dụng **Clear** để đặt lại cuộc hội thoại
- Di chuột qua một tin nhắn và nhấp vào biểu tượng sao chép của nó để sao chép văn bản mà nó hiển thị, bao gồm cả JSON workflow nếu có
- Kéo đường phía trên ô tin nhắn để làm cho ô cao hơn. Khu vực nhập có thể mở rộng đến 60% của bảng, và nó trở về chiều cao mặc định khi trang tải lại

## Tự động áp dụng workflow

Khi phản hồi của AI chứa một khối JSON workflow hợp lệ (với `nodes` và tùy chọn `edges`) trong khối mã \`\`\`json, Heym sẽ:

1. Phân tích JSON từ phản hồi
2. Thay thế canvas hiện tại bằng các node và edge mới
3. Sắp xếp lại bố cục node
4. Đánh dấu workflow là chưa lưu

Nếu phân tích thất bại, nút **Retry** xuất hiện để tạo lại phản hồi.

## Thay đổi một Node

Di chuột qua một node trên canvas và nhấp vào **AI** phía trên node đó. Bảng điều khiển sẽ mở ở chế độ Agent, tập trung vào node đó và hiển thị node mà nó đang thay đổi:

| Node có... | Bảng điều khiển hiển thị |
|---|---|
| Không có kết quả trong lần chạy hiện tại | **Modifying Node:** trong một hàng thu gọn có biểu tượng và tên node. Trợ lý chỉ chỉnh sửa từ cấu hình của node; hãy chạy node trước nếu cần xem đầu ra |
| Có kết quả trong lần chạy hiện tại | **Modifying Node: (Has Node Output)** ngay phía trên chính node đó: biểu tượng, tên và loại, trạng thái và thời lượng gần nhất, cùng lỗi nếu thất bại. Trợ lý sẽ nhìn thấy đầu ra và lỗi đó khi chỉnh sửa node |

Di chuột qua nhãn để xem bảng điều khiển đang ở trạng thái nào.

Dù bảng điều khiển ở trạng thái nào, trợ lý cũng đọc trang tài liệu của node phía sau biểu tượng cuốn sách ở phần đầu của node. Trang này được dùng để hiểu các tùy chọn của node và trả lời các câu hỏi về chúng.

Bên dưới tin nhắn, ba tùy chọn sẽ bắt đầu yêu cầu:

| Tùy chọn | Chức năng |
|---|---|
| **Change this node as ...** | Điền vào hộp tin nhắn nội dung *Thay đổi node này thành* để bạn hoàn thành câu |
| **Fix error in this node ...** | Điền nội dung *Sửa lỗi trong node này.* Trợ lý sẽ đọc lỗi của node này từ lần chạy gần nhất |
| **Other** | Tập trung vào một hộp tin nhắn trống |

Chỉnh sửa văn bản và nhấn **Send**. Trợ lý chỉ trả về node này và Heym sẽ cập nhật nó tại chỗ: node vẫn giữ nguyên id, loại và tên, nhờ đó các biểu thức như `$checkLinkedIn.result` ở các node khác tiếp tục hoạt động. Các node, kết nối và bố cục khác không thay đổi và **Undo** sẽ khôi phục cấu hình trước đó.

Nếu yêu cầu không phù hợp bên trong node, ví dụ như cần loại node khác hoặc node mới, trợ lý sẽ cho biết những gì cần phải thay đổi thay vì chỉnh sửa. Đóng tiêu điểm của node bằng dấu **X** trên thẻ node để chỉnh sửa lại toàn bộ workflow. Đóng bảng điều khiển cũng sẽ xóa tiêu điểm.

[Chế độ YOLO](#yolo-mode) hoạt động với một node được lấy tiêu điểm: trợ lý thay đổi node, chạy workflow và sửa node cho đến khi lần chạy thành công. Trong chế độ **Ask**, tiêu điểm cho trợ lý biết câu hỏi của bạn nói về node nào và canvas không bị thay đổi.

## Chế độ YOLO

**Chế độ YOLO** cho phép trợ lý kiểm tra những gì nó xây dựng. Đánh dấu vào hộp **YOLO mode** bên dưới ô nhập tin nhắn, sau đó gửi yêu cầu của bạn. Hộp này chỉ xuất hiện trong chế độ Agent. Nó mặc định tắt và trở về trạng thái tắt khi trang tải lại. Di chuột qua biểu tượng thông tin bên cạnh nó để xem tóm tắt ngắn.

Khi bật chế độ YOLO, trợ lý không dừng lại sau khi áp dụng workflow:

1. Nó áp dụng workflow lên canvas.
2. Trước lần chạy đầu tiên, nó yêu cầu đầu vào kiểm thử. Thẻ này liệt kê các trường đầu vào của workflow, được điền sẵn các giá trị mà trợ lý đề xuất. Chỉnh sửa chúng và nhấn **Run**. Các lần chạy sau sẽ tái sử dụng các giá trị này. Thẻ chỉ xuất hiện lại khi các trường đầu vào thay đổi hoặc trợ lý cần dữ liệu kiểm thử khác.
3. Nó chạy workflow trên canvas giống hệt nút **Run**: các thay đổi chưa lưu được lưu trước, các node sáng lên, và lần chạy xuất hiện trong bảng Debug và [Lịch sử thực thi](./execution-history.md).
4. Nó đọc kết quả. Nếu lần chạy thực hiện đúng điều bạn yêu cầu, nó kết thúc với **Verified** và một tóm tắt ngắn. Nếu không, nó sửa workflow và chạy lại.

Nó thực hiện tối đa **5 lần chạy** cho mỗi tin nhắn. Nhấn **Stop** bất kỳ lúc nào để kết thúc vòng lặp và dừng một lần chạy đang diễn ra.

Mỗi phản hồi hiển thị các bước của nó khi chúng diễn ra:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, với một dòng `Executing <node>` cho mỗi node;
- phán quyết cuối cùng.

Sau mỗi lần chạy, một dòng ngắn như *Attempt 1 result sent · error in 1.2s* cho thấy kết quả đã được gửi trở lại cho trợ lý.
### Chạy các workflow khác của bạn

Trong chế độ YOLO, trợ lý cũng có thể chạy các workflow khác của bạn khi cần kết quả của chúng. Ví dụ, nó có thể kiểm tra xem một workflow trả về gì trước khi gọi nó từ node [Execute](../nodes/execute-node.md). Những lần chạy này hiển thị dưới dạng các bước `Running workflow "<name>"...` và được ghi lại trong Execution History với nguồn trigger là `ai_assistant`. Workflow đang được chỉnh sửa luôn được kiểm thử trên canvas.

### Khi nó dừng sớm

| Tình huống | Điều gì xảy ra |
|---|---|
| Trợ lý cần một quyết định, thông tin, credential hoặc một data table | Nó hỏi bằng thẻ câu hỏi thông thường. Trả lời sẽ tiếp tục vòng lặp. |
| Lần chạy chờ [human review](./human-in-the-loop.md) | Vòng lặp dừng lại. Phê duyệt review, sau đó gửi một tin nhắn. |
| Workflow chờ tải tệp lên | Vòng lặp dừng lại. Chế độ YOLO không thể kiểm thử các lần chạy được kích hoạt bằng tải tệp lên. |
| Một phiên bản mới hơn của workflow đã được lưu ở nơi khác | Vòng lặp dừng lại. Giải quyết xung đột lưu, sau đó gửi một tin nhắn. |

> **Các lần chạy là thật.** Email, tin nhắn và lệnh gọi API trong workflow thực sự được gửi trong mỗi lần thử, và các node DataTable ghi các hàng thật. Mỗi lần chạy đều lưu workflow, vì vậy các phiên bản trước đó vẫn nằm trong [Edit History](./edit-history.md).

## Nhập bằng giọng nói

Trên các trình duyệt được hỗ trợ, nút **Voice** cho phép chuyển giọng nói thành văn bản. Nhấp để bắt đầu ghi âm, nhấp lần nữa để dừng. Văn bản được chuyển đổi sẽ được gửi đến AI để sửa ngữ pháp trước khi bạn gửi.

## Node Agent so với AI Assistant

| | Node Agent | AI Assistant |
|---|------------|---------------|
| **Mục đích** | Node LLM bên trong một workflow; chạy trong quá trình thực thi | Giao diện chat để xây dựng workflow bằng ngôn ngữ tự nhiên |
| **Vị trí** | Node trên canvas | Bảng Debug → bảng nổi |
| **Thời điểm** | Khi chạy | Trong khi chỉnh sửa |

Xem [Node Agent](../nodes/agent-node.md) để biết về node workflow thực thi các lệnh gọi LLM với tools và MCP.

## Cách hoạt động (AI Builder DSL)

AI Assistant được vận hành bởi một **workflow DSL** (ngôn ngữ đặc thù theo lĩnh vực) mô tả các node, cạnh và biểu thức. Khi bạn gửi một tin nhắn:

1. Tin nhắn của bạn cùng với [User Rules](./user-settings.md) và workflow hiện tại (nếu có) được gửi đến backend.
2. Backend xây dựng một **system prompt** bao gồm:
   - Toàn bộ workflow DSL (các loại node, cú pháp biểu thức, quy tắc, ví dụ)
   - User Rules của bạn được thêm vào dưới dạng "User Custom Rules"
   - JSON của workflow hiện tại khi bạn đang chỉnh sửa một workflow có sẵn
   - Danh sách các workflow khả dụng nếu bạn dùng node Execute
   - Tên, loại và id của các credential của riêng bạn (không bao giờ là giá trị của chúng)
   - Tên, id, mô tả và các cột của các data table mà bạn có thể dùng (không bao giờ là các hàng của chúng)
3. Mô hình trả về một khối JSON workflow duy nhất (với `nodes` và `edges`). Frontend phân tích nó và áp dụng lên canvas.

### Credential

Khi một workflow cần credential, trợ lý sẽ hỏi trước khi xây dựng nó. Nếu bạn có các credential thuộc loại phù hợp, nó liệt kê chúng cùng với **Create a new credential**; nếu bạn không có cái nào, nó hỏi liệu có tạo một cái không. Mỗi câu hỏi cũng cho phép bạn tiếp tục mà không cần credential.

Chọn tạo một cái sẽ mở biểu mẫu credential trong bảng, được đặt sẵn đúng loại và một tên gợi ý. Các giá trị được gửi thẳng đến Heym; trợ lý chỉ biết tên và loại. Các credential OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) kết nối trong một cửa sổ popup, và một liên kết đến trang ủy quyền xuất hiện trong trường hợp popup bị chặn. Sau khi credential được lưu, thẻ hiển thị tên của nó và nút tạo tắt đi; nhấn **Submit answers** và trợ lý đặt credential mới lên node.

Bạn cũng có thể yêu cầu một credential riêng lẻ ("create a GitHub credential") hoặc yêu cầu thay đổi một cái bạn sở hữu ("update my sheet credential", "reconnect my Google Sheets"). Trợ lý trả lời bằng cùng thẻ đó: tạo sẽ mở một biểu mẫu trống, cập nhật sẽ mở biểu mẫu trên credential đó với các secret được che đi.

Trợ lý ưu tiên một node chuyên dụng. Khi không có node nào bao phủ một thao tác, chẳng hạn như thêm một tab vào Google Sheet, nó dùng một HTTP request và viết dòng header cho credential đã chọn. Xem [HTTP › Xác thực bằng Credential](../nodes/http-node.md#authenticating-with-credentials).

Các câu hỏi làm rõ mà workflow có thể bỏ qua sẽ hiển thị **Optional** trong ô nhập của chúng và có thể bỏ qua.

DSL thực thi các nhãn camelCase, quy tắc biểu thức thống nhất và các trường đặc thù theo node. Nếu giá trị của một trường là một `$expr` đơn lẻ, backend giữ nguyên kiểu gốc; nếu giá trị trộn văn xuôi với `$refs`, kết quả là một chuỗi. Quy tắc một-`$` vẫn được áp dụng: không có `$` bên trong dấu ngoặc đơn. User Rules trong [Settings](./user-settings.md) được đưa vào system prompt này để các tùy chọn của bạn áp dụng cho mọi workflow do AI tạo ra.

Nếu workflow hiện tại chứa các Agent skill, AI Assistant chỉ bao gồm `SKILL.md` của mỗi skill trong ngữ cảnh workflow đó. Các tệp `.py` đính kèm và tài sản skill dạng nhị phân bị loại bỏ trước khi gửi yêu cầu để trình xây dựng vẫn nằm trong giới hạn ngữ cảnh của mô hình ngay cả khi các skill chứa các triển khai lớn.
### Bảng dữ liệu

Khi một workflow lưu, lưu trữ hoặc tra cứu bản ghi và bạn chưa chỉ định một kho lưu trữ khác, trợ lý sẽ sử dụng node [DataTable](../nodes/datatable-node.md). Nếu bạn đặt tên cho một trong các bảng của mình và bảng đó có các cột mà workflow cần, trợ lý sẽ sử dụng bảng đó. Ngược lại, trợ lý sẽ hỏi bạn muốn dùng bảng nào. Thẻ này liệt kê các bảng phù hợp, mỗi bảng kèm theo mô tả và kiểu dữ liệu của các cột, cùng với tùy chọn **Create a new table** với tên và các cột được đề xuất. Các bảng được chia sẻ với bạn cũng được đề xuất; bảng mà bạn chỉ có quyền đọc sẽ chỉ được đề xuất để đọc.

Chọn bảng mới và nhấn **Submit answers**: thẻ sẽ tạo bảng, và trợ lý sẽ đặt id của bảng lên node và sử dụng chính xác tên các cột của bảng. Bạn cũng có thể yêu cầu tạo một bảng riêng, ví dụ "create a table for my leads".

Trợ lý chỉ thấy tên bảng, mô tả và các cột, không bao giờ thấy các hàng. Trợ lý không bao giờ thay đổi các cột của một bảng hiện có: nếu một bảng thiếu cột mà workflow cần, trợ lý sẽ nêu tên cột đó và đề xuất một bảng mới thay thế. Hãy thêm cột trong [DataTable tab](../tabs/datatable-tab.md).

## Related

- [Why Heym](../getting-started/why-heym.md) – Natural-language building as the first stage of the agent lifecycle
- [Quick Start](../getting-started/quick-start.md) – Build your first workflow
- [Settings](./user-settings.md) – User Rules injected into AI Assistant system prompt
- [Chat with Heym](./chat-with-heym.md) – Page-aware assistant inside the documentation area
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodes, and execution flow
- [Agent Node](../nodes/agent-node.md) – LLM node with tools and MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Add API keys for the AI Assistant
- [Workflow Structure](./workflow-structure.md) – JSON format for workflows
