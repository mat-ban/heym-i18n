# Tab MCP

Tab **MCP** cấu hình tích hợp Model Context Protocol (MCP). MCP cho phép các ứng dụng AI (Claude, ChatGPT, Gemini, Cursor và bất kỳ công cụ tương thích MCP nào) gọi các workflow của Heym như các công cụ.

Heym hỗ trợ hai chế độ: một **máy chủ mặc định** hiển thị tất cả các workflow được bật MCP dưới một endpoint duy nhất, và các **máy chủ có tên** cấp cho mỗi nhóm workflow logic một URL và API key riêng.

Cả hai chế độ đều có thể hiển thị hai loại công cụ: các **workflow** riêng lẻ, và **công cụ chat Heym** — toàn bộ engine của [Tab Chat](./chat-tab.md) nằm sau một công cụ `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Xem demo MCP</a></p>

## Máy chủ MCP mặc định

Máy chủ mặc định luôn khả dụng tại `{origin}/api/mcp/sse`. Tất cả các workflow được bật MCP sẽ xuất hiện dưới dạng công cụ tại đây.

### API Key MCP

- Các key được lưu dưới dạng digest SHA-256, vì vậy Heym không thể hiển thị key hiện có cho bạn. Tab chỉ báo cáo liệu một key đã được thiết lập hay chưa, chứ không hiển thị nội dung của nó.
- **Tạo** / **Tạo lại** – Key mới được hiển thị một lần, ngay sau khi bạn tạo. Hãy sao chép ngay lúc đó; tải lại tab sẽ ẩn nó vĩnh viễn.
- Sử dụng key này khi kết nối Claude Desktop, Cursor hoặc các ứng dụng MCP khác với Heym
- Mất key? Hãy tạo lại. Key trước đó sẽ ngừng hoạt động ngay lập tức.

### Phương thức kết nối

- **API Key** – Sử dụng API key MCP cho các kết nối lập trình. Tab có thể sao chép cấu hình JSON sẵn sàng sử dụng và bao gồm nút **Thêm vào Cursor** để thiết lập Cursor chỉ với một cú nhấp.
- **Claude** – Tab hiển thị URL máy chủ MCP và các bước thiết lập cho Claude. Để trống OAuth Client ID và Secret; Claude tự động đăng ký và xác thực qua Heym OAuth.
- **ChatGPT** – Tab hiển thị URL của MCP server và các bước thiết lập cho ứng dụng ChatGPT. Bật chế độ Nhà phát triển (Developer mode), tạo ứng dụng với URL đó và chọn OAuth; ChatGPT sẽ tự động đăng ký.
- **Gemini** – Tab hiển thị URL của MCP server và các bước thiết lập cho ứng dụng tùy chỉnh Gemini: tại gemini.google.com, vào **Settings → Connected Apps → Add a custom app**, dán URL và để **Advanced features** đóng; Gemini sẽ tự động đăng ký và xác thực qua Heym OAuth. Sau khi kết nối, Heym cũng hoạt động trong ứng dụng Gemini trên di động.

### Bật/tắt MCP cho Workflow

Mỗi workflow có thể được hiển thị như một công cụ MCP:

- **Bật** – Các công cụ của workflow trở nên khả dụng cho tất cả các ứng dụng kết nối đến máy chủ mặc định
- **Tắt** – Workflow không được hiển thị

Thẻ workflow hiển thị mô tả và bản xem trước tên các trường đầu vào để bạn có thể thấy mỗi công cụ yêu cầu gì trước khi bật.

## Công cụ chat Heym

Phần **Khả năng của Heym** biến engine của Tab Chat thành một công cụ MCP duy nhất có tên `heym_chat`. Bật nó trên máy chủ mặc định, trên bất kỳ máy chủ có tên nào, hoặc cả hai — mỗi bề mặt giữ công tắc và lựa chọn model riêng.

Khi được bật, `heym_chat` xuất hiện trong `tools/list` cùng với các công cụ workflow của bạn. Ứng dụng MCP gửi một tin nhắn ngôn ngữ tự nhiên và engine Heym sẽ xử lý từ đó, với các khả năng tương tự như Tab Chat:

- Xây dựng workflow, chạy thử với dữ liệu đầu vào mẫu, sửa lỗi và hoàn tất khi lần chạy thành công (xem [Chế độ Build](#build-mode))
- Kiểm tra và chạy các workflow hiện có của bạn
- Báo cáo phân tích, các lần thực thi gần đây và các lịch cron sắp tới
- Báo cáo lịch sử chạy của một workflow: số lần chạy, số lượng theo trạng thái, thời điểm chạy, và khi được yêu cầu thì cả đầu vào, đầu ra và lỗi theo từng node của một lần chạy
- Báo cáo những gì đang chạy ngay lúc này: có bao nhiêu thực thi đang hoạt động, tên workflow của chúng, mỗi cái đã chạy bao lâu, node hiện tại của mỗi cái, và liên kết đến lần chạy trực tiếp
- Liệt kê board, tạo card và đọc chi tiết card trên [Tab Board](./board-tab.md)
- Liệt kê các bảng dữ liệu của bạn cùng các cột, tạo bảng mới và kết nối chúng vào các workflow mà nó xây dựng
- Đọc team và biến toàn cục, và tìm kiếm tài liệu
- Phê duyệt, chỉnh sửa hoặc từ chối các đánh giá human-in-the-loop đang chờ xử lý

Các khả năng được thêm vào Tab Chat sau này sẽ tự động khả dụng qua `heym_chat` — không có công tắc riêng cho từng khả năng cần đồng bộ.

### Chế độ Build

`heym_chat` luôn chạy công cụ Chat ở chế độ build. Trong một lần gọi, trợ lý có thể lưu một workflow mới, chạy nó với các đầu vào mẫu thực tế, đọc báo cáo chạy, sửa những gì bị lỗi và chạy lại, tối đa năm lần chạy thử mỗi lần gọi. Khi lần chạy mới nhất của bản lưu mới nhất thành công, nó kết thúc bằng một câu tóm tắt và phản hồi kết thúc bằng `Verified: the latest test run of the saved workflow passed.`

- Các lần chạy thử là lần chạy thật. Các tác dụng phụ của chúng thực sự xảy ra và chúng xuất hiện trong lịch sử chạy của workflow giống như bất kỳ lần chạy nào khác.
- Việc lưu đi theo luồng của trình chỉnh sửa: một thay đổi đối với đồ thị sẽ giữ lại đồ thị trước đó trong **Edit History** của workflow.
- Để thay đổi một workflow đã xây dựng trước đó, hãy tiếp tục chuỗi hội thoại với cùng `conversation_id`. Trợ lý sẽ cập nhật workflow đó thay vì tạo mới, và chỉ thay đổi những workflow mà bạn có quyền chỉnh sửa.
- Khi đã dùng hết năm lần chạy thử, trợ lý sẽ dừng lại và giải thích những gì vẫn còn lỗi.

Thông tin xác thực vẫn nằm trong giao diện: `heym_chat` không bao giờ liệt kê, chọn hoặc tạo chúng. Khi nó xây dựng hoặc chỉnh sửa workflow, các node mới cần thông tin xác thực sẽ được để trống và phản hồi sẽ nêu tên chúng, để bạn có thể thiết lập trong trình chỉnh sửa.

Bảng dữ liệu thì khác. Một bảng không chứa bí mật, nên `heym_chat` có thể liệt kê các bảng của bạn, hỏi workflow nên dùng bảng nào, và tạo bảng mới cùng các cột. Nó không bao giờ đọc hoặc ghi các hàng.

### Thông tin xác thực và model

`heym_chat` chạy engine trên tài khoản Heym của bạn, nên nó cần thông tin xác thực LLM riêng:

| Trường | Hành vi |
|-------|----------|
| **Thông tin xác thực** | Chọn bất kỳ thông tin xác thực OpenAI, Google hoặc Custom nào bạn có thể truy cập. Được điền sẵn từ thông tin xác thực ưu tiên trong [Cài đặt](../reference/user-settings.md) khi bạn chưa chọn. |
| **Model** | Được tải từ thông tin xác thực đã chọn. Được điền sẵn từ model ưu tiên của bạn khi thông tin xác thực khớp. |

Nếu thiếu một trong hai, công cụ vẫn xuất hiện trong `tools/list` nhưng mỗi lần gọi sẽ trả về lỗi yêu cầu bạn hoàn tất thiết lập trong tab này.

### Đối số và lịch sử

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `message` | Có | Chỉ thị hoặc câu hỏi, bằng ngôn ngữ tự nhiên. |
| `conversation_id` | Không | Một `conversation_id` từ kết quả `heym_chat` trước đó, để tiếp tục luồng hội thoại đó. |

Mỗi lần gọi đều được ghi vào lịch sử [Tab Chat](./chat-tab.md) như một cuộc hội thoại bình thường, được đánh dấu bằng biểu tượng phích cắm trong danh sách hội thoại. Tin nhắn, thẻ công cụ và các khoảng dừng để làm rõ trông giống hệt một cuộc hội thoại do bạn tự bắt đầu, và bạn có thể mở luồng và tiếp tục trò chuyện trên trình duyệt. Mỗi kết quả trả về `conversation_id` của nó để ứng dụng MCP có thể tiếp tục cùng luồng thay vì mở luồng mới ở mỗi lần gọi.

Khi trợ lý cần làm rõ, nó sẽ tạm dừng và thông báo; hãy trả lời bằng cùng `conversation_id`.

## Named MCP Servers

Named servers cho phép bạn phân tách các workflow thành các MCP endpoint biệt lập. Mỗi server có URL và API key riêng, vì vậy các AI client, nhóm hoặc trường hợp sử dụng khác nhau có thể kết nối chính xác đến những workflow mà họ cần.

### Tạo một Named Server

1. Nhập tên vào trường nhập liệu ở cuối tab MCP (ví dụ: **CRM Tools**)
2. Nhấp **Create** — một thẻ server mới sẽ xuất hiện ngay lập tức
3. Nhấp vào thẻ để mở rộng

### Cài đặt cho từng Server

Mỗi thẻ server hiển thị:

| Cài đặt | Mô tả |
|---------|-------------|
| **SSE Endpoint** | URL duy nhất: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Key độc lập, chỉ hiển thị một lần khi được tạo hoặc tạo lại. Hãy sao chép ngay; key được lưu dưới dạng băm và không thể hiển thị lại sau đó |
| **How to connect** | **Copy JSON** sao chép cấu hình MCP sẵn sàng để dán; **Add to Cursor** cài đặt chỉ với một nhấp |
| **Heym Capabilities** | Bật/tắt công cụ `heym_chat` cho server này và chọn credential cùng model của nó |
| **Assigned Workflows** | Bật/tắt những workflow mà server này hiển thị |

### Gán Workflow

Việc gán workflow được thực hiện theo từng server và độc lập với công tắc của default server. Một workflow có thể được bật trên default server và trên nhiều named server cùng lúc, hoặc không bật trên server nào.

Khi bật/tắt một workflow, nó sẽ được chuyển lên đầu danh sách đã gán, vì vậy hàng bạn vừa thay đổi vẫn hiển thị thay vì bị cuộn đi.

### Xác thực

Named server hỗ trợ các phương thức xác thực giống như default server:

- **X-MCP-Key header** – Truyền API key của server trực tiếp (API client, Cursor). Chỉ dùng header: key không được chấp nhận dưới dạng tham số truy vấn `?key=`, vì URL sẽ xuất hiện trong access log, proxy log và lịch sử trình duyệt.
- **Claude, ChatGPT và Gemini OAuth** – Thêm URL của server vào trình kết nối hoặc ứng dụng tùy chỉnh của client; để trống thông tin xác thực và client sẽ tự động đăng ký qua OAuth. Bearer token phải được truyền trong header `Authorization`, không phải dưới dạng `?token=`.
- **Session token** – Được cấp trong quá trình bắt tay SSE; được giới hạn cho server cụ thể nên token từ một named server này không thể truy cập server khác. Tham số `?session=` ngắn hạn này không bị ảnh hưởng.

### Xóa một Named Server

Nhấp vào biểu tượng **X** trên tiêu đề thẻ server. Việc xóa sẽ loại bỏ server và tất cả các gán workflow của nó; bản thân các workflow không bị ảnh hưởng.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Cả hai endpoint đều hỗ trợ SSE transport (GET, MCP spec 2024-11-05) và Streamable HTTP transport (POST, MCP spec 2025-03-26). Claude, ChatGPT và Gemini sử dụng OAuth 2.1 / PKCE để đăng nhập an toàn trên cả hai.

## Related

- [Why Heym](../getting-started/why-heym.md) – MCP như một primitive hạng nhất trong Heym
- [Agent Node](../nodes/agent-node.md) – Agent node với hỗ trợ MCP tool
- [Agent Architecture](../reference/agent-architecture.md) – MCP client, tool dispatch, orchestrator
- [Triggers](../reference/triggers.md) – MCP như một điểm vào của workflow
- [Chat Tab](./chat-tab.md) – Công cụ đằng sau `heym_chat` tool
- [Workflows Tab](./workflows-tab.md) – Tạo và quản lý workflow
- [Node Types](../reference/node-types.md) – Tổng quan về AI node
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang gọn gàng cho các bề mặt dashboard
