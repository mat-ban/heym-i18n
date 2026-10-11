# Tab Chat

Tab **Chat** cung cấp giao diện trò chuyện trực tiếp với LLM. Sử dụng tab này để kiểm thử model, đặt câu hỏi, chạy các workflow hiện có hoặc tạo workflow mới từ yêu cầu bằng ngôn ngữ tự nhiên.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Xem demo Chat</a></p>

## Thiết lập

1. Chọn một [credential](./credentials-tab.md) (API key cho OpenAI, Google, v.v.)
2. Chọn một model từ dropdown (các model được tải từ credential đã chọn)
3. Bắt đầu nhập để gửi tin nhắn

Bạn cũng có thể bắt đầu cuộc trò chuyện từ ô chat trên [tab Workflows](./workflows-tab.md). Ô này gửi tin nhắn đầu tiên của bạn và mở cuộc trò chuyện mới tại đây với câu trả lời đã được streaming.

## Tính năng

- **Ngữ cảnh biến toàn cục** – [Global Variables](../reference/global-variables.md) của bạn được cung cấp cho LLM, vì vậy bạn có thể hỏi về hoặc tham chiếu các giá trị đã lưu
- **Ngữ cảnh template của workspace** – Các workflow và node template được chia sẻ trong workspace của bạn được đưa vào làm ngữ cảnh, để Chat có thể trả lời các câu hỏi về template hiện có
- **Agent chạy dài** – Chat tiếp tục xử lý ở backend ngay cả khi trình duyệt đóng, vì vậy bạn có thể quay lại từ thiết bị khác và tiếp tục cùng cuộc trò chuyện
- **Tạo workflow** – Yêu cầu Chat tạo hoặc thiết lập một workflow, và nó sử dụng cùng engine Workflow AI Builder như trợ lý trong editor để tạo và lưu workflow
- **Tạo task trên Kanban** – Yêu cầu tự nhiên để thêm task hoặc tạo card. Chat thêm vào cột đầu tiên của board được yêu cầu; khi bạn có nhiều board và không nêu tên board nào, Chat sẽ hiển thị bộ chọn board trước khi tạo card
- **Tin nhắn tiếp theo trong hàng đợi** – Gửi thêm tin nhắn trong khi câu trả lời đang streaming. Các tin nhắn trong hàng đợi được lưu lại, có thể chỉnh sửa hoặc xóa trước khi bắt đầu, và chạy theo thứ tự sau khi phản hồi đang hoạt động kết thúc
- **Tạm dừng để lập kế hoạch** – Khi Chat cần thông tin chi tiết để lập kế hoạch, nó đặt câu hỏi làm rõ và tạm dừng các tin nhắn tiếp theo trong hàng đợi cho đến khi bạn trả lời. Sau khi câu trả lời lập kế hoạch hoàn tất, các tin nhắn trong hàng đợi tiếp tục
- **Credentials** – Khi workflow mà Chat tạo hoặc chỉnh sửa cần một credential, Chat hỏi bạn muốn dùng credential nào, đề nghị tạo credential mới ngay trong cuộc trò chuyện, hoặc cho phép bạn tiếp tục mà không cần. Bạn cũng có thể yêu cầu Chat tạo credential hoặc cập nhật credential bạn sở hữu; nó mở form credential trong cuộc trò chuyện. Model chỉ thấy tên và loại của credential, không bao giờ thấy giá trị. Xem [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Data tables** – Khi workflow mà Chat tạo hoặc chỉnh sửa lưu trữ bản ghi, Chat hỏi bạn muốn dùng [data table](./datatable-tab.md) nào hoặc đề nghị tạo một data table với các cột mà workflow cần. Nó cũng có thể liệt kê các bảng của bạn và các cột của chúng. Nó không bao giờ đọc hoặc ghi các hàng. Xem [AI Assistant › Data tables](../reference/ai-assistant.md#data-tables)
- **Phản hồi streaming** – Xem đầu ra của model khi nó streaming
- **Dừng phản hồi** – Ngắt câu trả lời đang streaming bất cứ lúc nào; việc dừng cũng xóa các tin nhắn trong hàng đợi của cuộc trò chuyện đó
- **Hiển thị Markdown** – Phản hồi hỗ trợ định dạng markdown, bao gồm hình ảnh inline
- **Hiển thị hình ảnh** – Hình ảnh được nhúng trong phản hồi (ví dụ: từ tính năng tạo ảnh của LLM) hiển thị inline; nhấp vào bất kỳ hình ảnh nào để xem toàn màn hình. Nhấn **Esc** hoặc nút quay lại (trên di động) để đóng chế độ xem toàn màn hình
- **Sao chép tin nhắn** – Sao chép bất kỳ tin nhắn nào vào clipboard
- **Xóa chat** – Bắt đầu cuộc trò chuyện mới
- **Nhập bằng giọng nói** – Sử dụng nút microphone để chuyển giọng nói thành văn bản (được trình duyệt hỗ trợ). Khi dừng ghi âm, Heym có thể tinh chỉnh nhẹ bản ghi trước khi bạn gửi
- **Workflow đã lên lịch** – Hỏi khi nào các cron workflow chạy (hôm nay, tuần này, tháng này hoặc khoảng ngày tùy chỉnh). Trợ lý sử dụng cùng dữ liệu lịch trình như tab [Scheduled](./scheduled-tab.md) và có thể giới hạn kết quả ở các workflow bạn sở hữu hoặc bao gồm cả những workflow được chia sẻ với bạn
- **Lịch sử chạy workflow** – Hỏi về một workflow ("báo cáo hàng ngày đã chạy bao nhiêu lần?", "nó có thất bại không?", "lần chạy cuối là khi nào?"). Chat tra cứu workflow theo ID và trả lời dựa trên số lần chạy, phân loại trạng thái, thời gian chạy đầu và cuối, và thời lượng trung bình. Hỏi tại sao một lần chạy thất bại hoặc nó trả về gì, Chat sẽ mở lần chạy đó để đọc input, output và lỗi theo từng node
- **Trạng thái chạy trực tiếp** – Hỏi hiện tại đang có gì chạy và Chat trả lời với số lượng, tên các workflow, mỗi lần chạy đã diễn ra bao lâu, đang ở node nào, và liên kết trực tiếp đến lần chạy trực tiếp

## Sử dụng Chat từ một MCP Client

Engine Chat cũng có thể được truy cập từ bên ngoài trình duyệt. Bật **Heym Chat Tool** trong [tab MCP](./mcp-tab.md) và các MCP client — Claude, Cursor, và bất kỳ công cụ nào khác hỗ trợ MCP — sẽ nhận được một tool `heym_chat` duy nhất, chạy chính engine này với đầy đủ các khả năng của nó.

Những cuộc hội thoại đó sẽ xuất hiện trong lịch sử của tab này, được đánh dấu bằng biểu tượng phích cắm trong danh sách hội thoại. Mở một cuộc hội thoại để đọc nội dung client đã hỏi, xem các tool card mà nó đã kích hoạt, và tự mình tiếp tục mạch hội thoại. Việc trả lời một câu hỏi làm rõ diễn ra giống nhau dù lượt đó bắt đầu từ đây hay từ một MCP client.

Qua MCP, Chat không liệt kê, chọn hay tạo credentials. Các Workflow mà nó tạo ra sẽ để trống các trường credential, và phần trả lời sẽ nêu tên các node cần credential để bạn có thể thiết lập chúng trong editor.

Data table cũng hoạt động qua MCP: Chat liệt kê các bảng của bạn, tạo bảng mới và kết nối chúng vào các workflow mà nó tạo ra. Câu hỏi về bảng của nó đến dưới dạng văn bản trong kết quả, vì vậy hãy trả lời bằng cùng `conversation_id`.

## Giới hạn ngữ cảnh

Chat giữ tối đa 25 tin nhắn gần nhất trong ngữ cảnh. Các tin nhắn cũ hơn sẽ bị cắt bớt để nằm trong giới hạn của model.

## Tạo Workflow

Khi bạn yêu cầu Chat tạo, xây dựng, sinh hoặc thiết lập một workflow, nó sẽ tạo một workflow đã lưu mới với tên và mô tả được sinh tự động. Phần trả lời bao gồm bản xem trước canvas chỉ đọc của các node và edge được tạo, cùng một liên kết **Open workflow** mở editor workflow trong một tab trình duyệt mới. Dùng nút **Run** trên thẻ xem trước khi bạn muốn thực thi workflow.

Phản hồi tiếp theo trong cùng cuộc chat sẽ chỉnh sửa workflow đó thay vì tạo một workflow khác. Ví dụ, sau khi Chat tạo một workflow, bạn có thể nói "add an approval step", "change the output format", hoặc "şöyle yap" và Chat sẽ cập nhật workflow đã lưu và làm mới bản xem trước.

Cách này phù hợp nhất với những yêu cầu mà bạn muốn công việc được thực hiện như một automation có thể tái sử dụng, chứ không chỉ là một câu trả lời dùng một lần.

## Tạo Kanban Task

Hãy yêu cầu Chat bằng ngôn ngữ thông thường, ví dụ: “Add a task called Fix login bug” hoặc
“Create a new card Update documentation on the Launch board.” Bạn có thể bao gồm cả
mô tả trong cùng yêu cầu. Chat luôn tạo card trong cột đầu tiên của board đã chọn.

Nếu workspace của bạn có nhiều board và bạn không chỉ định board nào, Chat sẽ tạm dừng với
bộ chọn board một lựa chọn. Chọn một board để hoàn tất việc tạo card. Không cần slash command
hay định dạng tin nhắn đặc biệt nào.

## Hỏi về những gì đang chạy

Hãy hỏi bằng ngôn ngữ thông thường — "what is running?", "how many workflows are active right now?",
"which node is the nightly report on?" — và Chat sẽ báo cáo tình hình trực tiếp:

- **Có bao nhiêu** execution đang diễn ra, được chia thành đang chạy và đang chờ con người review
- **Những workflow nào** mà chúng thuộc về, theo tên
- **Đã chạy bao lâu** cho mỗi lượt chạy (ví dụ `1m 35s`, `3h 25m`)
- **Node nào** đang thực thi ngay lúc này, theo nhãn trên canvas, cùng node cuối cùng đã hoàn thành
- **Một liên kết** đến từng lượt chạy đang hoạt động, mở canvas với execution đó đang được phát lại

Các lượt chạy bị tạm dừng để [Human-in-the-Loop](../reference/human-in-the-loop.md) hoặc review Codex sẽ được báo cáo là
đang chờ bạn, chứ không phải đang chạy. Đây là cùng dữ liệu với badge active-runs ở phần header,
nên Chat và badge không bao giờ mâu thuẫn. Với những lượt chạy đã hoàn thành, hãy hỏi về các execution gần đây
thay vào đó — nội dung đó đọc từ [Execution History](../reference/execution-history.md).

## Hỏi về Alert

Chat có thể trả lời các câu hỏi về những [alert](./alerts-tab.md) mà bạn đã định nghĩa:

- **Những gì đang tồn tại** — "what alerts do I have?", "is there an alert on the invoice workflow?",
  "which alerts are firing right now?"
- **Một alert được thiết lập như thế nào** — "what is the threshold on the cost alert?", "how is that configured?"
- **Tại sao và khi nào nó kích hoạt** — "why did the cost alert fire?", "when did this last trigger?"

Với câu hỏi "why did it fire", Chat sẽ đọc bản ghi kích hoạt và trích dẫn giá trị thực tế đã quan sát,
ngưỡng, và chính xác khoảng thời gian đã được đánh giá, cùng các chi tiết đóng góp:
id execution thất bại và thông báo lỗi đối với alert lỗi, chi tiêu theo từng model đối với alert chi phí, hoặc
phân tích theo nguồn trigger đối với alert số lượng execution. Nó báo cáo những gì đúng vào thời điểm alert
kích hoạt thay vì tính lại khoảng thời gian, bởi vì khoảng thời gian đó đã qua và một phép tính mới
có thể cho kết quả khác.

## User Rules

[User Rules](../reference/user-settings.md) (được cấu hình trong Settings) sẽ tự động được đưa vào mọi cuộc hội thoại Chat như các chỉ dẫn ở cấp hệ thống. Hãy thiết lập một lần để áp dụng các tùy chọn lâu dài cho tất cả yêu cầu chat.

## Liên quan

- [Tab MCP](./mcp-tab.md) – Hiển thị engine này cho các MCP client dưới dạng công cụ `heym_chat`
- [Cài đặt](../reference/user-settings.md) – Thiết lập User Rules áp dụng cho mọi yêu cầu chat
- [Tab Credentials](./credentials-tab.md) – Thêm và quản lý API key
- [Tab Variables](./global-variables-tab.md) – Biến toàn cục khả dụng cho Chat
- [Các loại Node](../reference/node-types.md) – Node LLM và Agent cho workflow
- [Node Agent](../nodes/agent-node.md) – AI Agent với khả năng gọi công cụ
- [Trợ lý AI](../reference/ai-assistant.md) – Trợ lý trong trình chỉnh sửa, vận hành bởi cùng DSL xây dựng workflow
- [Lịch sử thực thi](../reference/execution-history.md) – Xem các lần chạy trước đó (nút History trên thanh tiêu đề)
- [Tab Scheduled](./scheduled-tab.md) – Lịch các lần chạy cron sắp tới (cùng dữ liệu mà Chat có thể tóm tắt)
- [Tab Alerts](./alerts-tab.md) – Cảnh báo ngưỡng mà Chat có thể liệt kê và giải thích
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn định hướng gọn gàng trong ứng dụng cho trang này
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – Đọc tin nhắn thành tiếng và trò chuyện rảnh tay với ElevenLabs

## Gọi công cụ và kích thước ngữ cảnh

Mỗi khi trợ lý gọi một công cụ (chạy workflow, liệt kê các lần thực thi, tạo workflow mới), một thẻ có thể thu gọn sẽ xuất hiện trong cuộc hội thoại. Thẻ tự động mở rộng trong khi công cụ chạy, hiển thị chính xác các đối số. Khi công cụ hoàn tất, thẻ thu gọn thành một dòng tóm tắt kèm thời gian đã trôi qua. Nhấp vào bất kỳ thẻ nào để mở rộng lại các đối số và phần tóm tắt phản hồi.

Một huy hiệu vòng nhỏ bên dưới ô nhập liệu hiển thị mức sử dụng ngữ cảnh hiện tại dưới dạng phần trăm của cửa sổ ngữ cảnh model (ví dụ: `12% · ~9.2k`). Di chuột qua huy hiệu để xem chi tiết: system prompt, AGENTS.md, khối workflow, user rules, lịch sử và nội dung bạn đang soạn. Khi mức sử dụng vượt 80%, vòng chuyển sang màu hổ phách; ở 95% vòng chuyển sang màu đỏ.

Nếu mức sử dụng tiến gần đến giới hạn, Heym tự động nén các tin nhắn cũ hơn thành một bản tóm tắt ngắn bằng cùng cơ chế mà các node agent sử dụng. Một thẻ "Context compressed" xuất hiện ngay trong dòng để cho biết điều gì đã xảy ra.
