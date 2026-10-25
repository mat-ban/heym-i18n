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


### Các lượt chạy trong hàng đợi và heym_execution_status

Một workflow có [giới hạn đồng thời](../reference/webhooks.md#concurrency-limit-and-queued-runs) có thể bận khi máy khách gọi nó. Cuộc gọi sau đó sẽ trả về ngay lập tức một kết quả không phải là lỗi:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Client thăm dò công cụ `heym_execution_status` với `execution_id` đó. Nó trả về nội dung tương tự như [URL trạng thái](../reference/webhooks.md#status-url): `queued` với vị trí hiện tại, `running`, sau đó là `success` hoặc `error` cùng với kết quả đầu ra. Nó chỉ tìm thấy các lần chạy của các workflow mà cùng một máy chủ cung cấp. Công cụ này chỉ được liệt kê trên máy chủ mặc định và trên mỗi máy chủ được đặt tên khi có ít nhất một workflow có giới hạn đồng thời. Khi hàng đợi đầy, lệnh gọi sẽ trả về lỗi "Concurrency queue is full".
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
- Tạo hoặc cập nhật credential của bạn trên trang riêng của Heym (xem [Credentials](#credentials))
- Đọc team và biến toàn cục, và tìm kiếm tài liệu
- Phê duyệt, chỉnh sửa hoặc từ chối các đánh giá human-in-the-loop đang chờ xử lý

Các khả năng được thêm vào Tab Chat sau này sẽ tự động khả dụng qua `heym_chat` — không có công tắc riêng cho từng khả năng cần đồng bộ.

### Chế độ Build

`heym_chat` luôn chạy công cụ Chat ở chế độ build. Trong một lần gọi, trợ lý có thể lưu một workflow mới, chạy nó với các đầu vào mẫu thực tế, đọc báo cáo chạy, sửa những gì bị lỗi và chạy lại, tối đa năm lần chạy thử mỗi lần gọi. Khi lần chạy mới nhất của bản lưu mới nhất thành công, nó kết thúc bằng một câu tóm tắt và phản hồi kết thúc bằng `Verified: the latest test run of the saved workflow passed.`

Khi một lệnh gọi tạo hoặc chỉnh sửa một workflow, câu trả lời sẽ liệt kê từng workflow với liên kết trình chỉnh sửa đầy đủ, chẳng hạn như `https://heym.example.com/workflows/<id>`, và các liên kết bên trong câu trả lời của trợ lý cũng là các liên kết đầy đủ. Chúng sử dụng địa chỉ Heym đã định cấu hình của bạn (`FRONTEND_URL`) và mở cho những người đã đăng nhập vào Heym có quyền truy cập vào workflow đó.

- Các lần chạy thử là lần chạy thật. Các tác dụng phụ của chúng thực sự xảy ra và chúng xuất hiện trong lịch sử chạy của workflow giống như bất kỳ lần chạy nào khác.
- Việc lưu đi theo luồng của trình chỉnh sửa: một thay đổi đối với đồ thị sẽ giữ lại đồ thị trước đó trong **Edit History** của workflow.
- Để thay đổi một workflow đã xây dựng trước đó, hãy tiếp tục chuỗi hội thoại với cùng `conversation_id`. Trợ lý sẽ cập nhật workflow đó thay vì tạo mới, và chỉ thay đổi những workflow mà bạn có quyền chỉnh sửa.
- Khi đã dùng hết năm lần chạy thử, trợ lý sẽ dừng lại và giải thích những gì vẫn còn lỗi.

Bảng dữ liệu thì khác. Một bảng không chứa bí mật, nên `heym_chat` có thể liệt kê các bảng của bạn, hỏi workflow nên dùng bảng nào, và tạo bảng mới cùng các cột. Nó không bao giờ đọc hoặc ghi các hàng.

### Credentials

`heym_chat` nhìn thấy các credential bạn sở hữu và các credential được chia sẻ với bạn, theo tên và loại, giống như tab Chat. Khi một workflow mà nó xây dựng cần một credential, nó sẽ hỏi bạn muốn dùng cái nào dưới dạng câu hỏi trong kết quả. Trả lời với cùng một `conversation_id`.

Để thêm credential hoặc cập nhật credential bạn sở hữu, trợ lý sẽ mở biểu mẫu credential của Heym trên một trang Heym, `/credentials/setup/<id>`. Bạn đăng nhập vào Heym tại đó, nhập khóa hoặc kết nối tài khoản và nhấn lưu. Giá trị sẽ được gửi thẳng đến Heym: máy khách MCP và mô hình của nó chỉ biết tên và loại của credential. Không dán khóa vào máy khách MCP; thay vào đó hãy yêu cầu biểu mẫu.

| Máy khách | Điều gì xảy ra |
|-----------|----------------|
| Hỗ trợ lấy URL MCP | Máy khách yêu cầu bạn mở trang Heym. Lệnh gọi sẽ đợi trong khi bạn điền vào biểu mẫu, tối đa mười phút, sau đó tiếp tục với credential mới. |
| Bất kỳ điều gì khác | Kết quả mang liên kết và yêu cầu máy khách gọi lại `heym_chat` với `wait_for_credential_form`. Lệnh gọi đó đợi tối đa năm phút trong khi bạn điền vào biểu mẫu, sau đó tiếp tục cuộc trò chuyện. Nếu máy khách không đợi, hãy lưu biểu mẫu và trả lời bằng cùng một `conversation_id`; lệnh gọi tiếp theo sẽ biết biểu mẫu đã được lưu và credential nào đã được tạo. |

Trang chỉ mở cho tài khoản Heym đã bắt đầu yêu cầu, vì vậy liên kết được chuyển tiếp là vô dụng đối với bất kỳ ai khác. Biểu mẫu mở trong 24 giờ và bạn có thể từ chối biểu mẫu đó từ trang. Sau khi bạn lưu hoặc từ chối, bước trong cuộc trò chuyện tab Chat sẽ hiển thị kết quả.


### Thông tin xác thực và model

`heym_chat` chạy engine trên tài khoản Heym của bạn, nên nó cần thông tin xác thực LLM riêng:

| Trường | Hành vi |
|-------|----------|
| **Thông tin xác thực** | Chọn bất kỳ thông tin xác thực OpenAI, Google hoặc Custom nào bạn có thể truy cập. Được điền sẵn từ thông tin xác thực ưu tiên trong [Cài đặt](../reference/user-settings.md) khi bạn chưa chọn. |
| **Model** | Được tải từ thông tin xác thực đã chọn. Được điền sẵn từ model ưu tiên của bạn khi thông tin xác thực khớp. |

Nếu thiếu một trong hai, công cụ vẫn xuất hiện trong `tools/list` nhưng mỗi lần gọi sẽ trả về lỗi yêu cầu bạn hoàn tất thiết lập trong tab này.


Các node LLM và Agent trong workflow do `heym_chat` xây dựng sẽ chạy trên credential và model này, bao gồm cả credential được chia sẻ với bạn, do đó các lần chạy thử nghiệm sẽ hoạt động mà không cần thêm bước thiết lập nào khác. Khi `heym_chat` chỉnh sửa một workflow, các node LLM và Agent đã có credential sẽ giữ nguyên credential cùng với model của chúng.
### Đối số và lịch sử

| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `message` | Có | Chỉ thị hoặc câu hỏi, bằng ngôn ngữ tự nhiên. |
| `conversation_id` | Không | Một `conversation_id` từ kết quả `heym_chat` trước đó, để tiếp tục luồng hội thoại đó. |
| `wait_for_credential_form` | Không | Với `conversation_id`: đợi cho đến khi người dùng lưu hoặc từ chối biểu mẫu credential mà luồng đã mở, sau đó gửi `message`. |

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
