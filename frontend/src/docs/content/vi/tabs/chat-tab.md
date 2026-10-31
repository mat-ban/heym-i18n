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
- **Credentials** – Khi workflow mà Chat tạo hoặc chỉnh sửa cần một credential, Chat hỏi bạn muốn dùng credential nào, đề nghị tạo credential mới ngay trong cuộc trò chuyện, hoặc cho phép bạn tiếp tục mà không cần. Bạn cũng có thể yêu cầu Chat tạo credential hoặc cập nhật credential bạn sở hữu; nó mở form credential trong cuộc trò chuyện. Model chỉ thấy tên và loại của credential, không bao giờ thấy giá trị, đối với cả credential bạn sở hữu và credential được chia sẻ với bạn. Các node LLM và Agent do Chat thêm vào sẽ chạy trên credential và model đã chọn cho chat, bao gồm cả credential được chia sẻ; khi Chat chỉnh sửa workflow, các node LLM và Agent hiện có sẽ giữ nguyên credential và model của chúng. Xem [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Dashboards** – Hỏi bạn có những [dashboards](./dashboard-tab.md) nào, những gì có trên một bảng điều khiển, hoặc một workflow nằm trên bảng điều khiển nào. Yêu cầu Chat thêm một tiện ích mới vào bảng điều khiển (nó đặt một tiện ích trống ở đó, sau đó xây dựng và kiểm thử workflow của nó), đặt một workflow hiện có lên bảng điều khiển dưới dạng tiện ích, đổi tên hoặc xóa tiện ích, hoặc sắp xếp gọn gàng bố cục bảng điều khiển. Heym Work hiển thị các bảng điều khiển này dưới dạng các trang của nó. Xem [Dashboard › Từ Chat và MCP](./dashboard-tab.md#từ-chat-và-mcp)
- **Bảng dữ liệu** – Khi một workflow do Chat tạo hoặc chỉnh sửa lưu trữ các bản ghi, Chat sẽ hỏi nên sử dụng [bảng dữ liệu](./datatable-tab.md) nào hoặc đề nghị tạo một bảng mới với các cột cần thiết. Nó cũng có thể kiểm tra các hàng, thêm hoặc xóa cột và chèn, cập nhật hoặc xóa hàng trực tiếp trên các bảng bạn sở hữu hoặc có thể chỉnh sửa. Cung cấp cho nó tên bảng hoặc liên kết DataTable. Việc xóa cột và xóa tất cả các hàng đều yêu cầu xác nhận; việc thêm cột giữ nguyên dữ liệu hiện có. Xem [Trợ lý AI › Bảng dữ liệu](../reference/ai-assistant.md#data-tables)
- **Phản hồi streaming** – Xem đầu ra của model khi nó streaming
- **Dừng phản hồi** – Ngắt câu trả lời đang streaming bất cứ lúc nào; việc dừng cũng xóa các tin nhắn trong hàng đợi của cuộc trò chuyện đó
- **Hiển thị Markdown** – Phản hồi hỗ trợ định dạng markdown, bao gồm hình ảnh inline
- **Hiển thị hình ảnh** – Hình ảnh được nhúng trong phản hồi (ví dụ: từ tính năng tạo ảnh của LLM) hiển thị inline; nhấp vào bất kỳ hình ảnh nào để xem toàn màn hình. Nhấn **Esc** hoặc nút quay lại (trên di động) để đóng chế độ xem toàn màn hình
- **Sao chép tin nhắn** – Sao chép bất kỳ tin nhắn nào vào clipboard
- **Xóa chat** – Bắt đầu cuộc trò chuyện mới
- **Nhập bằng giọng nói** – Sử dụng nút microphone để chuyển giọng nói thành văn bản (được trình duyệt hỗ trợ). Khi dừng ghi âm, Heym có thể tinh chỉnh nhẹ bản ghi trước khi bạn gửi
- **Workflow đã lên lịch** – Hỏi khi nào các cron workflow chạy (hôm nay, tuần này, tháng này hoặc khoảng ngày tùy chỉnh). Trợ lý sử dụng cùng dữ liệu lịch trình như tab [Scheduled](./scheduled-tab.md) và có thể giới hạn kết quả ở các workflow bạn sở hữu hoặc bao gồm cả những workflow được chia sẻ với bạn
- **Lịch sử chạy workflow** – Hỏi về một workflow ("báo cáo hàng ngày đã chạy bao nhiêu lần?", "nó có thất bại không?", "lần chạy cuối là khi nào?"). Chat tra cứu workflow theo ID và trả lời dựa trên số lần chạy, phân loại trạng thái, thời gian chạy đầu và cuối, và thời lượng trung bình. Hỏi tại sao một lần chạy thất bại hoặc nó trả về gì, Chat sẽ mở lần chạy đó để đọc input, output và lỗi theo từng node
- **Nơi các lượt chạy thất bại và lý do chúng chậm** – Hãy hỏi xem workflow của bạn thất bại ở đâu hoặc tại sao chúng chậm và Chat sẽ gọi tên các workflow chạy nhiều nhất, thất bại nhiều nhất và chậm nhất, cùng các loại nút chiếm nhiều thời gian nhất (trung bình mỗi lần gọi và tổng cộng), thất bại nhiều nhất và chạy nhiều nhất, những con số tương tự như trong tab [Analytics](./analytics-tab.md). Các loại nút được tính cho các lần chạy từ bản phát hành đã thêm phân tích nút. Hãy hỏi về giờ qua, 3 hoặc 6 giờ, 24 giờ, 7 hoặc 30 ngày, hoặc toàn bộ thời gian; các khung giờ bắt đầu đúng giờ, do đó "giờ qua" lúc 15:20 bao gồm từ 14:00 cho đến hiện tại.
- **Trạng thái chạy trực tiếp** – Hỏi hiện tại đang có gì chạy và Chat trả lời với số lượng, tên các workflow, mỗi lần chạy đã diễn ra bao lâu, đang ở node nào, và liên kết trực tiếp đến lần chạy trực tiếp

- **Chip ngữ cảnh chạy** – **Hỏi AI** trong [Execution History](../reference/execution-history.md#ask-ai) sẽ mở một cuộc trò chuyện mới với lần chạy Workflow đã chọn được đính kèm dưới dạng chip. Xem [Hỏi về một lần chạy](#hoi-ve-mot-lan-chay)

## Sử dụng Chat từ một MCP Client

Công cụ Chat cũng có thể được truy cập từ bên ngoài trình duyệt. Bật **Heym Agent** trong [tab MCP / A2A](./mcp-tab.md) và các máy khách MCP (Claude, Cursor và bất kỳ công cụ nào khác hỗ trợ MCP) sẽ nhận được một công cụ `heym_chat` duy nhất chạy chính công cụ này với tất cả các khả năng của nó. Đánh dấu chọn **Bật A2A** để các agent khác có thể gửi tác vụ cho nó qua [A2A](../reference/a2a.md); các cuộc trò chuyện đó hiển thị biểu tượng mạng trong danh sách.

Những cuộc hội thoại đó sẽ xuất hiện trong lịch sử của tab này, được đánh dấu bằng biểu tượng phích cắm trong danh sách hội thoại. Mở một cuộc hội thoại để đọc nội dung client đã hỏi, xem các tool card mà nó đã kích hoạt, và tự mình tiếp tục mạch hội thoại. Việc trả lời một câu hỏi làm rõ diễn ra giống nhau dù lượt đó bắt đầu từ đây hay từ một MCP client.

Qua MCP, Chat không liệt kê, chọn hay tạo credentials. Các Workflow mà nó tạo ra sẽ để trống các trường credential, và phần trả lời sẽ nêu tên các node cần credential để bạn có thể thiết lập chúng trong editor.

Các bảng dữ liệu cũng hoạt động qua MCP: Chat có thể trực tiếp chỉnh sửa các cột và hàng, tạo bảng và liên kết chúng vào các workflow. Các câu hỏi về bảng và xác nhận xóa xuất hiện dưới dạng văn bản trong kết quả; trả lời bằng cùng một `conversation_id`.

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

## Hỏi về một lần chạy

Chọn một lần chạy Workflow trong [Execution History](../reference/execution-history.md#ask-ai), từ trình chỉnh sửa hoặc từ All History, và nhấp vào **Hỏi AI** bên cạnh tiêu đề hộp thoại. Chat mở một cuộc trò chuyện mới với hai chip phía trên hộp tin nhắn:

- **Workflow:** tên của Workflow
- **Execution:** các ký tự đầu tiên của id lần chạy đã chọn

Xóa một chip bằng dấu **×** của nó để loại bỏ. Sau đó đặt câu hỏi của bạn, ví dụ: “tại sao lần chạy này lại mất nhiều thời gian như vậy?”, “điều gì đã thất bại ở đây?” hoặc “bạn có thể khắc phục nó không?”. Các chip còn lại được đính kèm vào tin nhắn đó với đầy đủ id, vì vậy Chat sẽ đọc trực tiếp dữ liệu đầu vào, đầu ra và dấu vết trên từng nút của lần chạy thay vì tìm kiếm Workflow. Để khắc phục Workflow, Chat sẽ lưu, chạy thử và xác minh thay đổi như được mô tả trong [Tạo Workflow](#tao-workflow).

Tin nhắn đã gửi hiển thị các chip bên dưới câu hỏi của bạn. Chúng chỉ thuộc về tin nhắn đó; các câu hỏi tiếp theo trong cùng một cuộc trò chuyện sẽ giữ lại ngữ cảnh từ lịch sử.

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

## Làm việc với Evals

Chat có thể tạo, thay đổi và chạy các bộ kiểm thử trong [Evals](./evals-tab.md), bao gồm cả bộ prompt và bộ agent:

- **Bộ prompt**: "tạo một bộ prompt cho prompt trả lời hỗ trợ của tôi với 8 trường hợp kiểm thử và so sánh gpt-4o với gpt-4.1-mini". Chat viết các trường hợp kiểm thử với câu trả lời mong đợi, chọn phương pháp tính điểm và lưu bộ kiểm thử.
  - Trước khi tạo bộ kiểm thử, nó xác định thông tin đăng nhập LLM và các mô hình cần sử dụng. Với đúng một thông tin đăng nhập LLM, nó sẽ sử dụng thông tin đó và thông báo; nếu không, nó sẽ hỏi.
  - Đối với phương pháp chấm điểm LLM-as-Judge, nó cũng hỏi xem có nên để một giám khảo riêng biệt chấm điểm các câu trả lời hay không.
- **Bộ agent**: "kiểm tra xem agent hỗ trợ của tôi có luôn tìm kiếm tài liệu và không bao giờ gửi email hay không". Chat tìm thấy agent và lưu các kiểm tra công cụ cùng ngưỡng giới hạn. Khi bạn yêu cầu, nó sẽ chạy workflow, tạo đầu vào khác nhau cho mỗi lần chạy.
  - Các lần chạy bộ agent là các lần chạy workflow thực sự, do đó các tác dụng phụ của chúng sẽ diễn ra. Chat cho biết nó bắt đầu bao nhiêu lượt chạy.
- **Baseline**: Chat có thể làm việc với đường cơ sở của agent theo ba cách:
  - Báo cáo từ các lần chạy gần đây nhất của agent.
  - Xây dựng từ các lần chạy mà nó bắt đầu ("chạy 5 lần và sử dụng kết quả đó làm baseline").
  - Lưu các con số bạn cung cấp ("đặt baseline thành 3 giây p95 và 0,01 $ cho mỗi lần chạy").
- **Các lần chạy**: Chat đợi tối đa một phút cho một lần chạy, sau đó báo cáo kết quả:
  - Đối với bộ prompt: số lần vượt qua của mỗi mô hình và các trường hợp thất bại.
  - Đối với bộ agent: tỷ lệ vượt qua, các kiểm tra thất bại và độ lệch so với đường cơ sở.
  - Một lần chạy dài hơn sẽ tiếp tục trong Evals; hãy yêu cầu Chat kiểm tra lại.

Sau khi Chat tạo hoặc thay đổi một bộ kiểm thử, câu trả lời sẽ hiển thị một thẻ có tên bộ kiểm thử, loại của nó và nút **Mở trong Evals**, giống như thẻ của một workflow đã lưu. Qua MCP, kết quả của `heym_chat` liệt kê liên kết của mọi bộ kiểm thử được lưu trong lệnh gọi đó.

Điều tương tự cũng hoạt động từ ứng dụng khách MCP thông qua `heym_chat` (xem [Sử dụng Chat từ ứng dụng khách MCP](#sử-dụng-chat-từ-ứng-dụng-khách-mcp)). Các công cụ đánh giá vẫn nằm bên trong `heym_chat`; các ứng dụng khách MCP không thấy chúng dưới dạng các công cụ riêng biệt.

Trợ lý AI của trình chỉnh sửa không tạo các bộ kiểm thử.

## Làm việc với Evals

Chat có thể tạo, thay đổi và chạy các bộ kiểm thử trong [Evals](./evals-tab.md), bao gồm cả bộ prompt và bộ agent:

- **Bộ prompt**: "tạo một bộ prompt cho prompt trả lời hỗ trợ của tôi với 8 trường hợp kiểm thử và so sánh gpt-4o với gpt-4.1-mini". Chat viết các trường hợp kiểm thử với câu trả lời mong đợi, chọn phương pháp tính điểm và lưu bộ kiểm thử.
  - Trước khi tạo bộ kiểm thử, nó xác định thông tin đăng nhập LLM và các mô hình cần sử dụng. Với đúng một thông tin đăng nhập LLM, nó sẽ sử dụng thông tin đó và thông báo; nếu không, nó sẽ hỏi.
  - Đối với phương pháp chấm điểm LLM-as-Judge, nó cũng hỏi xem có nên để một giám khảo riêng biệt chấm điểm các câu trả lời hay không.
- **Bộ agent**: "kiểm tra xem agent hỗ trợ của tôi có luôn tìm kiếm tài liệu và không bao giờ gửi email hay không". Chat tìm thấy agent và lưu các kiểm tra công cụ cùng ngưỡng giới hạn. Khi bạn yêu cầu, nó sẽ chạy workflow, tạo đầu vào khác nhau cho mỗi lần chạy.
  - Các lần chạy bộ agent là các lần chạy workflow thực sự, do đó các tác dụng phụ của chúng sẽ diễn ra. Chat cho biết nó bắt đầu bao nhiêu lượt chạy.
- **Baseline**: Chat có thể làm việc với đường cơ sở của agent theo ba cách:
  - Báo cáo từ các lần chạy gần đây nhất của agent.
  - Xây dựng từ các lần chạy mà nó bắt đầu ("chạy 5 lần và sử dụng kết quả đó làm baseline").
  - Lưu các con số bạn cung cấp ("đặt baseline thành 3 giây p95 và 0,01 $ cho mỗi lần chạy").
- **Các lần chạy**: Chat đợi tối đa một phút cho một lần chạy, sau đó báo cáo kết quả:
  - Đối với bộ prompt: số lần vượt qua của mỗi mô hình và các trường hợp thất bại.
  - Đối với bộ agent: tỷ lệ vượt qua, các kiểm tra thất bại và độ lệch so với đường cơ sở.
  - Một lần chạy dài hơn sẽ tiếp tục trong Evals; hãy yêu cầu Chat kiểm tra lại.

Sau khi Chat tạo hoặc thay đổi một bộ kiểm thử, câu trả lời sẽ hiển thị một thẻ có tên bộ kiểm thử, loại của nó và nút **Mở trong Evals**, giống như thẻ của một workflow đã lưu. Qua MCP, kết quả của `heym_chat` liệt kê liên kết của mọi bộ kiểm thử được lưu trong lệnh gọi đó.

Điều tương tự cũng hoạt động từ ứng dụng khách MCP thông qua `heym_chat` (xem [Sử dụng Chat từ ứng dụng khách MCP](#sử-dụng-chat-từ-ứng-dụng-khách-mcp)). Các công cụ đánh giá vẫn nằm bên trong `heym_chat`; các ứng dụng khách MCP không thấy chúng dưới dạng các công cụ riêng biệt.

Trợ lý AI của trình chỉnh sửa không tạo các bộ kiểm thử.

## Liên quan

- [Tab MCP / A2A](./mcp-tab.md) – Hiển thị engine này cho các MCP client dưới dạng công cụ `heym_chat`
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
