# Bộ tính năng đầy đủ

Tổng quan toàn diện về tất cả các khả năng của Heym. Mỗi phần mô tả một tính năng hoặc khái niệm trong vài câu.

---

## Bắt Đầu

### [Giới Thiệu](../getting-started/introduction.md)

Heym là hạ tầng để vận hành và quản trị các agent AI trong môi trường production. Bạn xây dựng các hệ thống agentic trên một canvas trực quan và vận hành chúng một cách tự tin: điều phối các agent, tự động hóa quy trình nghiệp vụ, kiểm tra mọi lần thực thi, và duy trì sự kiểm soát của con người trên hạ tầng của chính bạn. Nền tảng hỗ trợ workflow trực quan, các node được hỗ trợ bởi AI ([LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), một [AI Assistant](./ai-assistant.md), các tích hợp ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md)), email đầu vào qua [IMAP Trigger](../nodes/imap-trigger-node.md), gửi email đầu ra qua [Send Email](../nodes/send-email-node.md), lập lịch với [Cron](../nodes/cron-node.md), và các cổng chat [Portal](./portal.md) cho người dùng cuối.

Xem thêm [Core Concepts](../getting-started/core-concepts.md), [Node Types](./node-types.md), và [Third-Party Integrations](./integrations.md).

### [Tại Sao Chọn Heym](../getting-started/why-heym.md)

Tại Sao Chọn Heym đi qua vòng đời của agent (xây dựng, điều phối, vận hành, quan sát, đánh giá, kiểm soát, phơi bày) và cho thấy một runtime tự lưu trữ xử lý những gì ở mỗi giai đoạn. Nội dung bao gồm node [LLM](../nodes/llm-node.md) và [Agent Node](../nodes/agent-node.md) với tool calling, Python tools, kết nối [MCP](../tabs/mcp-tab.md), skills, và điều phối đa agent; các trigger, retry, và [phân phối tải](./cluster.md); [Traces](../tabs/traces-tab.md) với chi phí USD theo từng lần chạy và xuất OpenTelemetry; [Evals](../tabs/evals-tab.md); [các điểm kiểm duyệt của con người](./human-in-the-loop.md), guardrails, SSO, và nhật ký kiểm toán; cùng các endpoint REST, MCP, và Portal. Trang kết thúc bằng bảng so sánh khả năng với n8n, Zapier, và Make.com.

Xem thêm [Agent Node](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md), và [Agent Architecture](./agent-architecture.md).

### [Bắt Đầu Nhanh](../getting-started/quick-start.md)

Chạy workflow đầu tiên của bạn trong vài phút: tạo một workflow từ tab [Workflows](../tabs/workflows-tab.md), thêm node [Input](../nodes/input-node.md), node [LLM](../nodes/llm-node.md), và node [Output](../nodes/output-node.md), sau đó kết nối chúng. Cấu hình [LLM](../nodes/llm-node.md) với một credential và đặt `userMessage` thành `$input.text`; sử dụng Run hoặc [AI Assistant](./ai-assistant.md) để thực thi hoặc tạo workflow bằng ngôn ngữ tự nhiên.

Kết hợp tự nhiên với [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md), và [Expression DSL](./expression-dsl.md).

### [Core Concepts](../getting-started/core-concepts.md)

Workflow là các đồ thị có hướng gồm các node được kết nối bằng các edge; luồng thực thi đi từ các trigger node ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) qua các node xử lý đến các node [Output](../nodes/output-node.md). Mỗi node có một type, data (cấu hình), và các input/output; các edge định nghĩa luồng dữ liệu. Các node tham chiếu dữ liệu thượng nguồn thông qua các biểu thức [Expression DSL](./expression-dsl.md) như `$nodeLabel.field`; các node độc lập chạy [song song](./parallel-execution.md) một cách tự động.

Xem thêm [Triggers](./triggers.md), [Parallel Execution](./parallel-execution.md), và [Workflow Structure](./workflow-structure.md).

### [Vận Hành & Triển Khai](../getting-started/running-and-deployment.md)

Heym cung cấp `run.sh` cho phát triển cục bộ (database trong Docker, backend FastAPI, frontend Vite) và `deploy.sh` cho production với Docker Compose. Cả hai đều sử dụng tệp `.env`; các biến quan trọng bao gồm `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL`, và `ALLOW_REGISTER`. Môi trường phát triển chạy trên các cổng frontend và backend có thể cấu hình; production phục vụ API dưới `/api` thông qua container frontend.

Xem thêm [Security](./security.md), [Enterprise](./enterprise.md), và [Settings](./user-settings.md).

### [Chuyển Sang Heym](../getting-started/migrate-to-heym.md)

Công cụ AI Convert chuyển đổi một workflow từ nền tảng khác (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) hoặc từ một mô tả bằng ngôn ngữ tự nhiên thành một workflow Heym, được stream trực tiếp lên canvas và sẵn sàng để [tải xuống và import](./download-import.md). Công cụ chạy kiểm tra an toàn AI, sau đó tạo DSL với các giới hạn input và rate được thiết lập sẵn. Mở tại [heym.run/convert](https://heym.run/convert).

Xem thêm [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md), và [AI Assistant](./ai-assistant.md).

---

## Nodes

### Triggers
#### [Đầu vào](../nodes/input-node.md)

Node Đầu vào là điểm khởi đầu cho các workflow nhận dữ liệu từ người dùng hoặc trình gọi API. Node này hỗ trợ một hoặc nhiều trường đầu vào và cung cấp metadata của request (headers, query params). Truy cập các trường body qua `$nodeLabel.body.fieldKey`, headers qua `$nodeLabel.headers`, và query qua `$nodeLabel.query`.

Kết hợp tự nhiên với [Điều kiện](../nodes/condition-node.md), [LLM](../nodes/llm-node.md), và [Đầu ra](../nodes/output-node.md). Để tham khảo payload và truy cập trường, xem [Expression DSL](./expression-dsl.md) và [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Node Cron kích hoạt một workflow theo lịch trình bằng biểu thức cron năm trường tiêu chuẩn. Không cần đầu vào từ người dùng—workflow chạy tự động vào các thời điểm đã chỉ định (ví dụ: hàng giờ, hàng ngày, mỗi 15 phút). Đầu ra là một sự kiện trigger không có payload.

Xem thêm [Triggers](./triggers.md), [Chờ](../nodes/wait-node.md), và [Lịch sử thực thi](./execution-history.md) cho các lần chạy theo lịch trình và trì hoãn.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Node IMAP Trigger thăm dò hộp thư đến theo khoảng thời gian phút có thể cấu hình và khởi động một workflow cho mỗi email mới được phát hiện. Node xuất ra headers đã phân tích, danh sách người gửi và người nhận, nội dung văn bản thuần và HTML, metadata của tệp đính kèm, và dấu thời gian trigger. Sử dụng node này cho việc phân loại hộp thư hỗ trợ, định tuyến từ hộp thư đến [Slack](../nodes/slack-node.md), hoặc các luồng phê duyệt dựa trên email với [Human-in-the-Loop](./human-in-the-loop.md).

Kết hợp với [Gửi Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md), và [Slack](../nodes/slack-node.md) cho các workflow phân loại và phản hồi thư đến.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Node Heym Trigger khởi động một workflow khi chính Heym phát hành một sự kiện nền tảng: `heym.started`, `workflow.created`, `workflow.updated`, hoặc `workflow.deleted`. Việc gửi được xử lý theo lô - mọi sự kiện được phát hành trong một cửa sổ điều phối năm giây sẽ đến trong một lần chạy duy nhất dưới dạng `$nodeLabel.events`, luôn là một mảng. Mỗi sự kiện được xác nhận thông qua một ràng buộc cơ sở dữ liệu duy nhất, do đó nó kích hoạt chính xác một lần cho mỗi node đăng ký bất kể có bao nhiêu worker, container, hoặc máy đang chạy. Sử dụng node này cho nhật ký kiểm tra thay đổi workflow, thông báo triển khai, và bản tóm tắt tình trạng instance.

Kết hợp với node [Heym](../nodes/heym-node.md) để tra cứu workflow đã thay đổi, và với [Loop](../nodes/loop-node.md) để thực hiện hành động một lần cho mỗi sự kiện.

#### [Heym](../nodes/heym-node.md)

Node Heym đọc dữ liệu của chính Heym thông qua ba thao tác: `listWorkflows` trả về mọi workflow mà chủ sở hữu có thể truy cập cùng với số lượng node và dấu thời gian, `getWorkflow` trả về cấu trúc node và edge của một workflow, và `getExecutionHistory` trả về các mục lịch sử thực thi theo thứ tự mới nhất trước với các bộ lọc tùy chọn về trạng thái, khoảng thời gian, và giới hạn, cùng với tổng số được nhóm theo trạng thái. Kết quả được giới hạn theo chủ sở hữu của workflow chứa node, do đó một lần chạy được khởi tạo bởi cron, một portal, hoặc một sự kiện trả về cùng dữ liệu như một lần chạy thủ công. `getWorkflow` trả về cấu hình node đầy đủ, điều này cho phép kiểm tra một workflow để tìm các key hoặc token được mã hóa cứng; nó không tiết lộ bất cứ điều gì mà chủ sở hữu workflow không thể mở trong trình chỉnh sửa. Không yêu cầu credential.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Node WebSocket Trigger mở một kết nối client ra ngoài đến một máy chủ WebSocket bên ngoài và khởi động workflow khi `onMessage`, `onConnected`, hoặc `onClosed`. Node cung cấp các payload tin nhắn đã phân tích, trạng thái kết nối lại, metadata đóng kết nối, và URL socket cho các biểu thức downstream.

Kết hợp với [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md), và [SSE Streaming](./sse-streaming.md) cho các tích hợp thời gian thực.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Node Telegram Trigger nhận các cập nhật webhook từ bot và khởi động workflow ngay lập tức. Node cung cấp payload cập nhật đầy đủ, đối tượng tin nhắn chính, các callback query, headers đã làm sạch, và dấu thời gian trigger. Sử dụng node này cho chatbot, trợ lý AI trong [Telegram](../nodes/telegram-node.md), và các luồng điều khiển bằng nút bấm.

Kết hợp với [Telegram](../nodes/telegram-node.md), [Node Agent](../nodes/agent-node.md), và [Webhooks](./webhooks.md) cho các workflow điều khiển bằng bot.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Node Slack Trigger nhận các webhook từ Slack Events API và khởi động một workflow tự động sau khi xác minh chữ ký của request. Node cung cấp payload sự kiện và headers đã làm sạch cho việc định tuyến downstream, phân loại dựa trên [LLM](../nodes/llm-node.md), và các luồng phản hồi.

Kết hợp với [Slack](../nodes/slack-node.md), [Node Agent](../nodes/agent-node.md), và [Tích hợp bên thứ ba](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Node Discord Trigger nhận các webhook từ Discord Interactions API, xác minh chữ ký Ed25519 với credential `discord_trigger` đã chọn, và khởi động workflow. Node cung cấp payload tương tác đầy đủ, dữ liệu lệnh, headers đã làm sạch, và metadata trigger cho việc định tuyến hoặc phản hồi downstream.

Kết hợp với [Đầu ra](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Node Agent](../nodes/agent-node.md), và [Tích hợp bên thứ ba](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Node RabbitMQ gửi hoặc nhận tin nhắn từ các queue và exchange của RabbitMQ. Sử dụng node này cho các workflow hướng sự kiện và xử lý sự kiện. Chế độ gửi sẽ publish một tin nhắn với độ trễ tùy chọn; chế độ nhận hoạt động như một [trigger](./triggers.md) để workflow khởi động khi có tin nhắn đến. Đầu ra bao gồm status, message_id và body.

Kết hợp với [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) và [Parallel Execution](./parallel-execution.md) để xử lý hướng sự kiện.

#### [Error Handler](../nodes/error-handler-node.md)

Node Error Handler tự động chạy khi bất kỳ node nào trong workflow gặp lỗi. Không cần các cạnh đầu vào; node này được kích hoạt bởi engine. Đầu ra bao gồm thông báo lỗi, nhãn của node bị lỗi, loại node và timestamp. Sử dụng node này để gửi thông báo qua [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) hoặc [Send Email](../nodes/send-email-node.md), ghi log lỗi hoặc trả về phản hồi lỗi tùy chỉnh.

Thay vì xử lý lỗi ngay trên canvas, workflow cũng có thể chuyển giao các lỗi cho một workflow riêng — xem [Error Workflow](#error-workflow). Nếu trên canvas đã có node Error Handler, workflow xử lý lỗi sẽ **không** được gọi (handler cục bộ sẽ được ưu tiên).

Các đích thông báo phổ biến là [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) và [Send Email](../nodes/send-email-node.md); chi tiết về lượt chạy sẽ dễ kiểm tra hơn trong [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Node AI Agent là một node [LLM](../nodes/llm-node.md) có khả năng gọi công cụ. Node này có thể chạy các công cụ Python, gọi các node trên canvas đã kết nối như công cụ, kết nối tới các máy chủ [MCP](../tabs/mcp-tab.md), sử dụng skills (các tệp hướng dẫn và script Python tùy chọn), hoạt động như một orchestrator chuyển giao nhiệm vụ cho các node agent khác và gọi các workflow khác như công cụ. Đầu ra có sẵn dưới dạng `$nodeLabel.text`. Tùy chọn **Extra Body** sẽ đính kèm một đối tượng JSON chứa các tham số yêu cầu riêng của nhà cung cấp vào mọi yêu cầu trong vòng lặp gọi công cụ; mặc định tắt. Tùy chọn **Use Responses API** sẽ định tuyến các lệnh gọi model của agent qua Responses API, giúp bảo toàn khả năng suy luận của model xuyên suốt các lệnh gọi công cụ để một reasoning model giữ được chuỗi suy luận qua vòng lặp nhiều bước; mặc định tắt và hoạt động với OpenAI cùng các credential tùy chỉnh.

Các công cụ dạng node trên canvas cho phép agent gọi trực tiếp các node workflow đã cấu hình ngay từ canvas. Kết nối một node được hỗ trợ tới handle công cụ của agent, sau đó đánh dấu các trường cụ thể là do agent cung cấp bằng biểu tượng bot. Những trường đó sẽ trở thành tham số công cụ khi chạy, trong khi credential và các trường không được đánh dấu vẫn cố định trong cấu hình node.

Phần Skills hiện đã bao gồm **AI Build** để tạo skill mới, hành động chỉnh sửa AI nội tuyến cho các skill hiện có, tải xuống từng skill dưới dạng ZIP và tùy chọn **Enable Drive files** cho các skill cần đọc tệp trên Heym Drive khi chạy. Modal Skill Builder sẽ truyền phát một cuộc trò chuyện ở bên trái, chấp nhận kéo thả tệp kèm theo mỗi bình luận tinh chỉnh, hiển thị bản xem trước chỉ đọc trực tiếp của các tệp `SKILL.md` và `.py` được tạo ở bên phải, có thể tải bản xem trước đó xuống dưới dạng ZIP và lưu các tệp tinh chỉnh đã tải lên trở lại thành tài sản skill đi kèm thông qua cùng luồng nhập ZIP được dùng cho việc tải lên thủ công.

Khi bật **[Agent Persistent Memory](./agent-persistent-memory.md)**, mỗi node agent sẽ giữ đồ thị tri thức riêng: các sự kiện được nạp vào system prompt khi không rỗng, và các lượt chạy thành công sẽ kích hoạt việc hợp nhất nền các thực thể và mối quan hệ mới. Các sub-agent sử dụng đồ thị riêng. Bạn có thể **chia sẻ** đồ thị của một agent với các agent khác (cùng workflow hoặc workflow khác) với quyền chỉ đọc hoặc đọc/ghi từ hộp thoại đồ thị. Nút điều khiển brain trên canvas sẽ mở trình chỉnh sửa đồ thị.

Các node agent cũng có thể chuyển sang chế độ [Human-in-the-Loop](./human-in-the-loop.md). Ở chế độ này, agent nhận được công cụ `request_human_review` và có thể tạm dừng tại các bước yêu cầu phê duyệt cụ thể, tạo liên kết đánh giá công khai dùng một lần, mở một nhánh canvas `review` cho các luồng thông báo và chờ cho đến khi người đánh giá chấp nhận, chỉnh sửa hoặc từ chối văn bản đánh giá Markdown. Trường HITL của node đóng vai trò hướng dẫn phê duyệt về thời điểm cần hỏi, trong khi phần tóm tắt dành cho người đánh giá được tạo từ mỗi yêu cầu đánh giá. Đối với các công cụ [MCP](../tabs/mcp-tab.md), Heym sử dụng model để diễn giải các hướng dẫn bằng văn bản đó thành `always`, `once` hoặc `never`, nhờ đó ngôn ngữ phê duyệt tự do được ánh xạ thành một chính sách runtime cụ thể. Lượt chạy được đánh dấu là `pending` và tiếp tục từ snapshot thực thi đã lưu sau khi có quyết định, và cùng một lượt chạy agent có thể tạm dừng nhiều lần nếu các bước sau cũng yêu cầu đánh giá.

Các node agent tự động nén lịch sử tin nhắn tích lũy khi tiến gần đến 80% cửa sổ ngữ cảnh của model. System prompt, tin nhắn người dùng đầu tiên và tin nhắn người dùng gần nhất luôn được giữ nguyên; mọi nội dung ở giữa sẽ được tóm tắt bằng chính model và credential đó. Các sự kiện nén có thể xem trong bảng Debug, [Execution History](./execution-history.md) và tab [Traces](../tabs/traces-tab.md).

Xem thêm [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) và [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Node Codex chạy OpenAI Codex CLI bên trong một workspace Heym biệt lập. Node này chấp nhận một credential Codex (đăng nhập bằng ChatGPT để sử dụng gói đăng ký của bạn mà không tốn chi phí API theo token, hoặc dán access token), một credential GitHub, URL repository, base branch, prompt tác vụ, chế độ publish (`diff_only` hoặc `draft_pr`), tên branch và timeout. Runner sẽ clone repository về cục bộ, chỉ truyền ChatGPT token bundle hoặc `CODEX_ACCESS_TOKEN` cho tiến trình Codex, và trả về bản tóm tắt có cấu trúc, ghi chú kiểm tra, các tệp đã thay đổi, diff, metadata sử dụng và URL draft PR tùy chọn.

Khi Codex trả về `needs_input`, workflow sẽ tạm dừng và mở ra nhánh `question`. Hãy kết nối nhánh đó tới Slack, email hoặc một node thông báo khác; liên kết follow-up công khai sẽ khôi phục execution snapshot đã lưu sau khi câu trả lời được gửi đi. Node Codex cũng có thể được gắn vào một AI Agent như một tool, cho phép agent ủy thác các tác vụ lập trình; khi hoạt động như một tool, kết quả `needs_input` được trả về trực tiếp cho agent thay vì tạm dừng workflow.

Xem thêm [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) và [Node Types](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Node OpenCode Go chạy OpenCode CLI (Go) trên một repository GitHub. Cơ chế biệt lập tuân theo mô hình của Codex: khi chạy cục bộ, nó hoạt động như một tiến trình con trên host, còn khi triển khai bằng Docker, nó chạy bên trong một container anh em được gia cố bảo mật, chia sẻ workspace volume. Node này chấp nhận một credential OpenCode Go (một gateway API key với base URL tùy chọn), một credential GitHub, URL repository, base branch, prompt tác vụ, chế độ publish, tên branch, timeout và một model `opencode-go/<model>` được chọn từ danh sách model trực tiếp, có thể tìm kiếm (với danh sách dự phòng tích hợp sẵn). Heym thực hiện mọi thao tác git/GitHub trên host và không bao giờ đặt GitHub token bên trong sandbox; OpenCode chỉ chỉnh sửa các tệp trên đĩa. Node trả về bản tóm tắt có cấu trúc, ghi chú kiểm tra, các tệp đã thay đổi, diff và URL pull request tùy chọn. Nó có thể được gắn vào một AI Agent như một tool.

Xem thêm [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) và [Node Types](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Node LLM xử lý văn bản bằng một language model hoặc tạo hình ảnh. Node này hỗ trợ tạo văn bản, vision (đầu vào hình ảnh), tạo hình ảnh, đầu ra JSON có cấu trúc, thực thi Batch API gốc của nhà cung cấp cho các endpoint OpenAI và OpenAI-compatible được hỗ trợ, cùng một toggle **Use Responses API** tùy chọn để định tuyến cuộc gọi qua Responses API thay vì Chat Completions (mặc định tắt; hoạt động với OpenAI và các credential tùy chỉnh, và không thể kết hợp với chế độ Batch). Cấu hình credential, model, system và user message, temperature và max tokens; sử dụng [Expression DSL](./expression-dsl.md) trong prompt. Ở chế độ batch, `userMessage` phải phân giải thành một mảng, node phát ra nhánh `batchStatus` với các cập nhật tiến độ, và đầu ra cuối cùng bao gồm kết quả batch theo từng mục. Một toggle **Extra Body** tùy chọn sẽ đính kèm một đối tượng JSON chứa các tham số request đặc thù của nhà cung cấp (ví dụ `{"thinking": {"type": "disabled"}}`) vào mỗi cuộc gọi API; mặc định tắt. [Guardrails](./guardrails.md) tùy chọn sẽ chặn nội dung không an toàn trước khi gọi.

Kết hợp tự nhiên với [Qdrant RAG](../nodes/rag-node.md), [Agent Node](../nodes/agent-node.md), [Guardrails](./guardrails.md) và [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Node Decision đặt cho một decision model những câu hỏi có định kiểu về trạng thái của lượt chạy và trả về xác suất thay vì văn xuôi. Một trường **State** mang nội dung mà model nên đọc — một biểu thức đơn lẻ giữ nguyên kiểu của chính nó, nên `$input` gửi đối tượng thay vì văn bản của nó — và một danh sách câu hỏi mang các phán đoán. Câu hỏi có ba dạng: **noul** trả lời liệu một điều kiện có đúng hay không, **choice** chọn một tùy chọn từ tập hợp bạn định nghĩa và trả về toàn bộ phân phối, còn **score** đánh giá trạng thái theo các mức có thứ tự và có thể nằm giữa các mức đó. Câu trả lời choice và score cũng mang theo một độ tin cậy, để một [Switch](../nodes/switch-node.md) có thể định tuyến dựa trên câu trả lời trong khi một [Condition](../nodes/condition-node.md) kiểm soát dựa trên mức độ chắc chắn của nó. **Generate with AI** phác thảo template state và các hàng câu hỏi từ một câu đơn giản, còn **Custom request body** gửi JSON viết tay cho một endpoint có hợp đồng khác biệt. Phản hồi từ nhà cung cấp được truyền qua nguyên vẹn, và mỗi cuộc gọi được ghi lại trong [Traces](../tabs/traces-tab.md).

Cần một credential Decision Model; kết hợp tự nhiên với [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) và [Agent Node](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Node RAG / Vector Store chèn, upsert, xóa và tìm kiếm tài liệu trong một vector store để phục vụ retrieval-augmented generation. Dropdown Database chọn backend — **Qdrant** (máy chủ bên ngoài) hoặc **Postgres (pgvector)** (cơ sở dữ liệu của chính Heym, không cần dịch vụ bên ngoài), mặc định là Qdrant. Chọn một vector store từ tab [Vectorstores](../tabs/vectorstores-tab.md) và đặt thao tác thành insert, upsert, delete hoặc search. Upsert và delete định danh một tài liệu bằng id duy nhất được lưu trong payload — trường **Document ID Field** đặt tên cho trường đó (mặc định `doc_id`) và **Document ID** mang giá trị của nó — nhờ vậy tài liệu giữ nguyên id mà hệ thống của bạn đã dùng: upsert thay thế mọi point khớp trước khi lưu phiên bản mới, và delete báo cáo xem có bất kỳ điểm nào khớp hay không. Metadata của tài liệu chấp nhận biểu thức trong các giá trị của nó, nên `{"url": "$start.url"}` lưu những gì mà lượt chạy đã tạo ra. Search hỗ trợ bộ lọc metadata, **Hybrid Search** tùy chọn (độ tương đồng vector kết hợp với đối sánh từ khóa BM25, giúp tìm thấy các thuật ngữ chính xác như ID và mã lỗi bên cạnh các kết quả khớp theo ngữ nghĩa) và tính năng xếp hạng lại Cohere (reranking) tùy chọn, đồng thời trả về một mảng kết quả với text, score, metadata, cờ reranked và hybrid, cùng count để dùng trong các luồng [LLM](../nodes/llm-node.md) hoặc [Agent Node](../nodes/agent-node.md).

Các node hạ nguồn thường dùng là [LLM](../nodes/llm-node.md) và [Agent Node](../nodes/agent-node.md); việc thiết lập vector store nằm trong [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Node MCP Call gọi trực tiếp một công cụ [MCP](../tabs/mcp-tab.md) cụ thể, mà không cần LLM quyết định công cụ nào sẽ được gọi. Dùng nó khi bạn biết chính xác công cụ nào cần chạy ngay từ lúc thiết kế — để thực thi công cụ MCP một bước, mang tính xác định trong một workflow. Cấu hình một kết nối (SSE, Streamable HTTP hoặc stdio; cùng các trường như kết nối MCP của [Agent Node](../nodes/agent-node.md)), nhấn **Fetch Tools** để nạp vào một dropdown, chọn một công cụ và điền các trường đối số được tự động render từ input schema của công cụ. Mỗi đối số chấp nhận một giá trị tĩnh hoặc một [biểu thức DSL](./expression-dsl.md) như `$userInput.body.text`. Kết quả có sẵn dưới dạng `$nodeLabel.result` (đối tượng JSON nếu có thể parse, ngược lại là chuỗi). Node MCP Call không thể được kết nối với một [Agent Node](../nodes/agent-node.md) như một công cụ trên canvas.

Xem thêm [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) và [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Node Condition rẽ nhánh workflow dựa trên một biểu thức if/else. Nó có hai handle đầu ra: một cho trường hợp điều kiện đúng (truthy) và một cho trường hợp sai (falsy). Sử dụng các toán tử so sánh và logic từ [Expression DSL](./expression-dsl.md) trong biểu thức điều kiện; node truyền tiếp đầu vào đến nhánh được chọn.

Xem thêm [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) và [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Node Switch định tuyến việc thực thi đến các đường dẫn khác nhau bằng cách so khớp một giá trị với các case. Cấu hình một biểu thức để đánh giá và một danh sách các giá trị case; mỗi case nhận một source handle và một handle mặc định được dùng cho các giá trị không khớp. Đầu vào được truyền tiếp đến nhánh khớp.

Dùng [Condition](../nodes/condition-node.md) cho rẽ nhánh nhị phân và [Merge](../nodes/merge-node.md) để nối lại các đường dẫn đã định tuyến; các quy tắc so khớp được trình bày trong [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Node Merge chờ nhiều đầu vào song song và kết hợp chúng thành một đầu ra duy nhất. Đặt số lượng đầu vào cần chờ; node tạo ra một đối tượng đã hợp nhất khi tất cả các nhánh hoàn tất. Dùng nó để nối kết quả từ các nhánh song song trước khi tiếp tục; không dùng nó khi các nhánh song song kết thúc ở các Output node riêng biệt.

Xem thêm [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) và [Output](../nodes/output-node.md) khi kết hợp lại các nhánh.

#### [Loop](../nodes/loop-node.md)

Node Loop lặp qua một mảng, thực thi các node hạ nguồn cho mỗi phần tử. Nó yêu cầu một kết nối ngược từ node cuối cùng trong thân vòng lặp để tiến bước. Bên trong thân vòng lặp, dùng `item`, `index`, `total`, `isFirst` và `isLast`; vòng lặp có các đầu ra riêng cho đường dẫn lặp và đường dẫn hoàn tất.

Kết hợp với [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) và [Expression DSL](./expression-dsl.md) cho các workflow lặp.

### Data

#### [Set](../nodes/set-node.md)

Node Set biến đổi và ánh xạ dữ liệu đầu vào thành đầu ra tùy chỉnh. Định nghĩa các ánh xạ key-value trong đó mỗi giá trị là một biểu thức [Expression DSL](./expression-dsl.md). Dùng nó cho việc viết hoa, cắt chuỗi con, nối chuỗi, số ngẫu nhiên và các phép biến đổi tương tự. Truy cập đầu ra theo key (ví dụ: `$setNode.keyName`). Khi được kết nối với một agent như một công cụ node trên canvas, các giá trị ánh xạ có thể được đánh dấu là do agent cung cấp để agent điền chúng lúc runtime. Để gọi các workflow khác, hãy dùng node [Execute](../nodes/execute-node.md) thay thế.

Xem thêm [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) và [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Node Converter chuyển đổi dữ liệu giữa các định dạng mà không cần viết mã. Các chuyển đổi văn bản bao gồm `csvToJson` (văn bản CSV thành một mảng các đối tượng hàng, hoặc mảng khi không có header), `jsonToCsv` (một mảng các đối tượng/hàng thành văn bản CSV), `xmlToJson` (văn bản XML thành một đối tượng), và `jsonToXml` (một đối tượng thành văn bản XML). Cấu hình hướng chuyển đổi và biểu thức nguồn; các chuyển đổi CSV còn sử dụng delimiter và xử lý header, và `jsonToCsv` có thể chỉ định thứ tự cột rõ ràng. Việc đặt trong dấu ngoặc kép, delimiter nhúng, và dòng mới nhúng tuân theo RFC 4180. Thuộc tính XML sử dụng tiền tố `@`, văn bản xen lẫn với thuộc tính sử dụng `#text`, các phần tử lặp lại trở thành mảng, và việc mở rộng thực thể XML bị vô hiệu hóa. Node này cũng hoạt động trên các tệp đã lưu trữ. `imageToText` và `pdfToText` chạy Tesseract OCR, đọc một tệp từ Heym Drive (`$Upload.file.id` từ Trigger File upload, kết quả của node Drive, hoặc tệp do agent tạo ra), tự động chọn ngôn ngữ từ script được phát hiện hoặc sử dụng các mã bạn chỉ định như `tur` hoặc `eng+tur`, và chuẩn hóa văn bản thành UTF-8 theo mặc định với tùy chọn chuẩn hóa NFC và các charset hẹp hơn như `cp1254`. `fileConvert` ghi lại một tệp đã lưu trữ sang định dạng khác, tài liệu thông qua pandoc và hình ảnh thông qua Pillow, và lưu kết quả thành một tệp Drive mới mà không chạm vào bản gốc. Kết quả có sẵn dưới dạng `$converterNode.result`, cùng với `.language`, `.encoding`, `.page_count`, `.pages`, và `.file` cho các lần chạy OCR, và `.id`, `.filename`, và `.download_url` cho `fileConvert`.

Xem thêm [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), và [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Node Code chạy Python do bạn viết, với `requirements.txt` riêng, trong một container được tạo và hủy cho mỗi lần thực thi. Mã của bạn định nghĩa một hàm `main(params)` và trả về bất kỳ giá trị nào có thể tuần tự hóa JSON, giá trị này trở thành `$codeNode.result`; bất cứ thứ gì nó in ra được ghi lại riêng biệt dưới dạng `$codeNode.logs`, và `$codeNode.install` báo cáo công cụ nào đã cài đặt các dependency. Các tham số được cấu hình dưới dạng một đối tượng JSON mà các biểu thức `$` của nó được giải quyết trước khi chạy, và mã đọc chúng bằng ký pháp dấu chấm như `params.user.name` hoặc `params.orders[0].id`. Các dependency được cài đặt bằng `uv`, dự phòng sang `pip` cho các gói mà `uv` không xử lý được, không có bộ nhớ đệm giữa các lần chạy; để trống `requirements.txt` sẽ bỏ qua hoàn toàn việc cài đặt và nhanh hơn nhiều. Giai đoạn thực thi không có mạng trừ khi `codeAllowNetwork` được bật, trong khi việc cài đặt dependency luôn truy cập PyPI. Sandbox chạy với quyền non-root với tất cả các capability bị loại bỏ, hệ thống tệp gốc chỉ đọc, không có Docker socket, và không có quyền truy cập vào các bí mật backend, giới hạn ở 512 MB bộ nhớ, một CPU, 256 tiến trình, 120 giây cài đặt, và 60 giây thực thi. Docker là bắt buộc và không có chế độ dự phòng: nếu không có daemon có thể truy cập được, node sẽ thất bại thay vì chạy mã của bạn trong tiến trình backend.

#### [Variable](../nodes/variable-node.md)

Node Variable đặt hoặc cập nhật một biến cục bộ trong workflow (`$vars.variableName`) hoặc một [biến toàn cục](./global-variables.md) lâu dài (`$global.variableName`). Sử dụng nó cho các bộ đếm, danh sách tích lũy, và trạng thái chia sẻ. Cấu hình tên biến, biểu thức giá trị, ép kiểu, và có lưu trữ trong global store hay không. Các biến mảng hỗ trợ `$array()` và `.add()`.

Kết hợp với [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md), và [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Node Execute gọi một workflow khác (sub-workflow) và truyền đầu vào cho nó. Chỉ định workflow đích bằng ID và cung cấp đầu vào thông qua một biểu thức duy nhất hoặc các ánh xạ key-value. Đầu ra bao gồm workflow_id, status, và outputs; sử dụng nó cho logic có thể tái sử dụng, không phải cho việc chuyển đổi dữ liệu (hãy dùng Set cho việc đó).

Xem thêm [Canvas Features](./canvas-features.md) cho Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md), và [Output](../nodes/output-node.md).

### Tích hợp

#### [HTTP](../nodes/http-node.md)

Node HTTP thực hiện các yêu cầu HTTP bằng cấu hình kiểu cURL. Nó có thể là điểm khởi đầu của workflow (không có cạnh đến) hoặc nhận đầu vào từ các node thượng nguồn. Phản hồi có sẵn dưới dạng status, headers, và body (JSON đã phân tích khi áp dụng). Sử dụng [Credentials](./credentials.md) cho xác thực Bearer hoặc custom header.

Kết hợp với [Webhooks](./webhooks.md), [Credentials](./credentials.md), và [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Node WebSocket Send mở một kết nối client hướng ra ngoài, gửi một tin nhắn text/JSON/binary, và đóng nó. Sử dụng nó để xuất bản đầu ra của workflow đến các hệ thống thời gian thực mà không cần tạo một socket endpoint do Heym lưu trữ.

Xem thêm [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md), và [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Node Telegram gửi tin nhắn bot đến một chat, nhóm hoặc kênh. Cấu hình một [credential](./credentials.md) Telegram, đặt `chatId`, và soạn `message` gửi đi bằng các biểu thức [Expression DSL](./expression-dsl.md). Node này kết hợp tự nhiên với [Telegram Trigger](../nodes/telegram-trigger-node.md) cho các workflow hội thoại và với [Error Handler](../nodes/error-handler-node.md) để gửi cảnh báo cho người vận hành.

Xem thêm [Third-Party Integrations](./integrations.md) và [Credentials](./credentials.md) để biết cách thiết lập và các mẫu credential.

#### [Slack](../nodes/slack-node.md)

Node Slack gửi tin nhắn đến một kênh Slack thông qua Incoming Webhook. Cấu hình một [credential](./credentials.md) Slack và một biểu thức tin nhắn. Sử dụng node này cho thông báo, cảnh báo và báo cáo lỗi; output truyền qua input.

Kết hợp với [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md), và [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Node Discord gửi tin nhắn đến một kênh Discord thông qua Incoming Webhook. Cấu hình một [credential](./credentials.md) Discord, soạn tin nhắn gửi đi bằng [Expression DSL](./expression-dsl.md), và tùy chọn đặt ghi đè username hoặc avatar của webhook.

Kết hợp với [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md), và [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Node Send Email gửi email qua SMTP. Cấu hình một [credential](./credentials.md) SMTP và các biểu thức [Expression DSL](./expression-dsl.md) cho người nhận, tiêu đề và nội dung. Sử dụng node này cho thông báo, cảnh báo và email giao dịch. Output bao gồm status, to, và subject.

[IMAP Trigger](../nodes/imap-trigger-node.md) bổ trợ cho Send Email bằng cách xử lý thư đến. Kết hợp cả hai cho phép một workflow đọc email đến từ hộp thư chung, tóm tắt hoặc phân loại bằng các node AI, và gửi tin nhắn theo dõi hoặc leo thang. [Telegram Trigger](../nodes/telegram-trigger-node.md) và [node Telegram](../nodes/telegram-node.md) cung cấp cùng mô hình vào/ra cho các workflow chat do bot điều khiển.

Đối với luồng thông báo hai chiều, node này cũng kết hợp tốt với [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), và [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Node Redis thực hiện các thao tác Redis: set, get, hasKey, và deleteKey. Sử dụng node này cho caching, giới hạn tần suất và lưu trữ key-value. Cấu hình một [credential](./credentials.md), loại thao tác, biểu thức key, và đối với thao tác set thì cần value và TTL tùy chọn. Output thay đổi theo thao tác (value, success, exists, deleted).

Kết hợp với [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md), và [Parallel Execution](./parallel-execution.md) cho caching, điều tiết và phối hợp.

#### [Grist](../nodes/grist-node.md)

Node Grist đọc, ghi và quản lý dữ liệu trong bảng tính Grist. Các thao tác bao gồm getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables, và listColumns. Cung cấp document ID, table ID, và đối với create/update thì cần dữ liệu bản ghi sử dụng column ID. Sử dụng node này cho CRUD, cập nhật hàng loạt và tự động hóa bảng tính.

Xem thêm [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md), và [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Node Google Sheets đọc, ghi và quản lý dữ liệu bảng tính qua OAuth2. Sử dụng node này để đọc báo cáo, thêm kết quả workflow, cập nhật bảng theo dõi, và xóa hoặc kiểm tra các tab sheet từ bên trong workflow. Giống như [BigQuery](../nodes/bigquery-node.md), node này sử dụng credential tích hợp do Google cung cấp và phù hợp khi dữ liệu bảng tính là một phần của luồng, bên cạnh [Grist](../nodes/grist-node.md).

Kết hợp với [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md), và [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Node BigQuery chạy các truy vấn SQL và chèn hàng vào tập dữ liệu Google BigQuery qua OAuth2. Node này hữu ích cho các workflow phân tích, pipeline báo cáo và ghi dữ liệu sự kiện có cấu trúc từ các lần chạy workflow. Node này thường kết hợp với [Set](../nodes/set-node.md) để định hình hàng và [Google Sheets](../nodes/google-sheets-node.md) cho báo cáo hướng bảng tính nhẹ nhàng hơn.

Kết hợp với [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md), và [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Node Google Drive liệt kê, tải xuống, cập nhật và xóa các tệp và thư mục trên Drive thông qua OAuth2, đồng thời có thể sao chép trực tiếp một tệp Drive vào [Heym Drive](../nodes/drive-node.md) bằng thao tác `syncToHeymDrive`. Google Docs, Sheets và Slides không có byte nào có thể tải xuống, vì vậy node sẽ tự động xuất chúng — Docs sang PDF, Sheets sang XLSX, Slides sang PPTX — với tùy chọn ghi đè định dạng đích. Các thao tác xóa sẽ chuyển mục vào thùng rác của Drive trừ khi bật "Delete permanently", và node từ chối xóa một thư mục thông qua thao tác tệp hoặc ngược lại. Giống như [Google Sheets](../nodes/google-sheets-node.md), node này sử dụng credential OAuth2 do Google cung cấp; lưu ý rằng credential này yêu cầu quyền truy cập đầy đủ vào Drive, vì vậy hãy xem xét [Credential Sharing](./credentials-sharing.md) trước khi chia sẻ nó.

Kết hợp với [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) và [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Node GitHub cung cấp 40 hành động REST gốc của GitHub bao gồm repositories, organizations và users, issues, pull requests, reviews, releases, Actions workflows, traffic insights và repository files. Sử dụng node này để phân loại issue, tự động hóa review, dispatch workflow và chờ hoàn thành, tự động hóa release và cập nhật tệp repo mà không cần tự xây dựng các yêu cầu HTTP. Node hỗ trợ GitHub.com và `base_url` tùy chọn của GitHub Enterprise trên credential.

Kết hợp với [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) và [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Node Jira kết nối workflow với Jira Cloud hoặc Jira Data Center / Server REST APIs để tự động hóa project, issue, comment, attachment, user, notification và transition. Node có thể liệt kê project, tìm kiếm issue bằng JQL, tạo hoặc cập nhật issue, kiểm tra changelog, thông báo cho các bên liên quan, quản lý comment và attachment, lấy hoặc quản lý user, liệt kê các transition khả dụng và di chuyển issue thông qua transition ID. Sử dụng credential Jira với email Atlassian, API token, site base URL và deployment mode.

Kết hợp với [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) và [Third-Party Integrations](./integrations.md) cho các workflow tiếp nhận hỗ trợ, phân loại bug và release.

#### [Linear](../nodes/linear-node.md)

Node Linear kết nối workflow với GraphQL API của Linear để tự động hóa workspace và issue. Node có thể liệt kê team, project, issue, workflow state, thành viên team và comment; tạo, cập nhật, xóa và liên kết issue; và tạo, cập nhật, resolve, unresolve hoặc xóa comment. Sử dụng Linear personal API key hoặc credential OAuth2, sau đó khám phá UUID của team, project, state và assignee từ các thao tác liệt kê trước khi tạo hoặc cập nhật issue.

Kết hợp với [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) và [Third-Party Integrations](./integrations.md) cho các workflow tiếp nhận, phân loại và backlog kỹ thuật.

#### [Supabase](../nodes/supabase-node.md)

Node Supabase đọc và thay đổi các bảng được hiển thị thông qua Supabase PostgREST. Node phù hợp cho backend sản phẩm, dữ liệu người dùng/hồ sơ, trạng thái workflow và các tự động hóa kiểu CRUD muốn truy cập cơ sở dữ liệu mà không cần tự kết nối các yêu cầu HTTP tùy chỉnh.

Kết hợp với [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) và [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Node ClickHouse thực thi các thao tác CRUD, count và raw SQL trên cơ sở dữ liệu ClickHouse bên ngoài thông qua giao diện HTTP của nó. Node phù hợp cho các pipeline phân tích, ghi log sự kiện và workflow báo cáo: chèn sự kiện ngay khi chúng xảy ra, sau đó tổng hợp hoặc đếm chúng bằng `query`/`count`. Node phản chiếu tập thao tác của [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) cùng với một lối thoát raw SQL, trong đó `update`/`remove` chạy dưới dạng các mutation của ClickHouse.

Kết hợp với [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) cho các báo cáo theo lịch và [Third-Party Integrations](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Node Notion quản lý các cơ sở dữ liệu, data source, page và block của Notion thông qua Notion API hiện tại (`2026-03-11`). Node hỗ trợ tìm kiếm, CRUD page, các thao tác database và data source, block children, append/update/delete block và trash/restore. Sử dụng internal integration token hoặc credential OAuth2 của Notion public integration. Trình chỉnh sửa có thể tìm kiếm và phân trang bằng cursor các data source và parent page có thể truy cập. Credential được chia sẻ hoạt động giống như credential sở hữu đối với việc thực thi workflow.

Đối với các lệnh gọi REST tùy chỉnh, `$credentials.YourNotionCredential` phân giải thành cùng bearer token. Kết hợp với [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) và [Third-Party Integrations](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Node Sentry tự động hóa các tổ chức, dự án, nhóm, issue, sự kiện và bản phát hành của Sentry thông qua Sentry REST API. Sử dụng node này để phân loại cảnh báo, cập nhật trạng thái issue, tự động hóa bản phát hành, tra cứu sự kiện và thiết lập hoặc dọn dẹp dự án/nhóm. Node hỗ trợ Sentry SaaS và Sentry tự lưu trữ (self-hosted) thông qua base URL tùy chọn trong credential.

Kết hợp với [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) và [Third-Party Integrations](./integrations.md) cho các workflow xử lý sự cố và bản phát hành.

#### [DataTable](../nodes/datatable-node.md)

Node DataTable đọc, ghi và quản lý dữ liệu trong Heym DataTables (lưu trữ có cấu trúc first-party). Các thao tác bao gồm find, getAll, getById, insert, update, remove và upsert. Không yêu cầu credential bên ngoài. Các bảng được quản lý từ tab dashboard [DataTable](../tabs/datatable-tab.md) và được chủ sở hữu workflow truy cập trực tiếp.

Kết hợp với [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) và [DataTable tab](../tabs/datatable-tab.md) cho lưu trữ có cấu trúc first-party.

#### [Drive](../nodes/drive-node.md)

Node Drive quản lý các tệp được tạo bởi skill trực tiếp từ bên trong workflow. Các thao tác bao gồm delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams và unshareWithMyTeams để quản lý quyền truy cập nhóm chỉ đọc; chuyển đổi định dạng nằm ở node [Converter](../nodes/converter-node.md) thay vào đó. Tham chiếu tệp bằng `$agentLabel._generated_files[0].id`; đầu ra bao gồm status, file_id, download_url đã cập nhật cho các ràng buộc liên kết và shared_team_count cho chia sẻ nhóm. Điều này đặc biệt hữu ích với các workflow [Agent Node](../nodes/agent-node.md) sử dụng [File Generation](./file-generation.md) và mô hình tham chiếu [Drive](./drive.md).

Các node đồng hành phổ biến là [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) và [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Node Amazon S3 thực hiện các thao tác lưu trữ đối tượng trên Amazon S3 bằng credential `s3` (access key, secret key, region, session token tùy chọn). Các thao tác bao gồm putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder và listBuckets. Hỗ trợ tải lên văn bản và tải xuống văn bản hoặc base64, với các trường bucket và key chấp nhận [Expression DSL](./expression-dsl.md). Sử dụng node này để lưu trữ đầu ra workflow, lưu trữ tệp và đọc đối tượng trở lại vào luồng.

Kết hợp với [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) và [Third-Party Integrations](./integrations.md).

### Automation

#### [Crawler](../nodes/crawler-node.md)

Node Crawler thu thập dữ liệu từ các trang web bằng FlareSolverr với tùy chọn trích xuất HTML thông qua CSS selector. Cấu hình [credential](./credentials.md) FlareSolverr, biểu thức URL, thời gian chờ và các selector tùy chọn để trích xuất. Đầu ra là HTML thô hoặc nội dung đã trích xuất. Sử dụng node này để thu thập dữ liệu web và trích xuất nội dung.

Kết hợp với [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) và [LLM](../nodes/llm-node.md) cho các luồng thu thập và phân tích dữ liệu.

#### [Playwright](../nodes/playwright-node.md)

Node Playwright tự động hóa các tương tác trình duyệt với các bước có thể cấu hình (navigate, refresh, click, type, screenshot, extract, aiStep) hoặc chế độ **Run Code** cho Playwright Python tùy chỉnh (chạy trong sandbox; mặc định tắt qua `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Node hỗ trợ chế độ headless, một cài đặt tùy chọn giúp giảm các tín hiệu tự động hóa Playwright phổ biến, thời gian chờ, tùy chọn thu thập dữ liệu mạng (responses, cookies, localStorage, sessionStorage), khởi tạo xác thực cookie/storageState từ các biểu thức [Global Variables](./global-variables.md) như `$global.authState`, các bước đăng nhập dự phòng khi khôi phục xác thực thất bại và bước AI với Auto Heal khi selector thất bại. Sử dụng node này để thu thập dữ liệu web, điền biểu mẫu và các workflow dựa trên trình duyệt.

Xem thêm [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) và [Execution History](./execution-history.md) để tự động hóa trình duyệt và gỡ lỗi.

### Utilities

#### [Output](../nodes/output-node.md)

Node Output là endpoint của workflow trả về phản hồi cho bên gọi. Đặt biểu thức message để tham chiếu node trước đó bằng nhãn (không bao giờ sử dụng `$input` từ node [Input](../nodes/input-node.md) ở đây). Tùy chọn async downstream cho phép các node sau output chạy nền sau khi phản hồi được gửi đi.

Các nguồn upstream phổ biến là [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) và [Execute](../nodes/execute-node.md); việc định hình phản hồi dễ gỡ lỗi hơn trong [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Node JSON output mapper xây dựng một đối tượng JSON thuần từ các ánh xạ key-value kiểu [Set](../nodes/set-node.md) và trả về nó ở gốc của phản hồi workflow. Sử dụng node này khi bên gọi API cần nhận một JSON body thô thay vì wrapper của node [Output](../nodes/output-node.md) tiêu chuẩn.
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Node HTML output mapper hiển thị một HTML template duy nhất, nội suy các biểu thức `$nodeLabel.field` vào trang. Khi đây là node đầu ra duy nhất của workflow, execute webhook sẽ phản hồi bằng `text/html` và mã trạng thái được cấu hình của node thay vì phần thân JSON, nhờ đó workflow có thể phục vụ trực tiếp một trang cho trình duyệt. Gửi `X-Simple-Response: false` để nhận lại envelope JSON thông thường phục vụ gỡ lỗi.

Kết hợp với [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) và [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Node Chart Output là node đầu ra của workflow widget [Dashboard](../tabs/dashboard-tab.md). Nó chuyển các hàng do các node thượng nguồn tạo ra thành payload biểu đồ chuẩn hóa để dashboard hiển thị. Chọn `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text hoặc HITL), ánh xạ `labelField`/`valueField` (hoặc `series` cho nhiều chuỗi, hoặc `text` cho thông điệp markdown), và đặt nó ở cuối; nó không có cạnh đầu ra. HITL bỏ qua các hàng thượng nguồn và liệt kê các human review đang chờ xử lý của bạn. và một cột khác làm nút liên kết mở URL trong tab mới (`linkColumn`, với `linkLabel` cho văn bản nút)

Xem thêm [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) và [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Node Wait tạm dừng thực thi workflow trong một khoảng thời gian xác định tính bằng mili giây, tối đa 15 phút. Dùng nó để giới hạn tốc độ, trì hoãn hành động hoặc đặt khoảng thời gian polling. Nó truyền đầu vào nguyên vẹn.

Kết hợp với [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) và [Parallel Execution](./parallel-execution.md) để điều tiết nhịp độ và polling.

#### [Sticky Note](../nodes/sticky-note-node.md)

Node Sticky Note thêm ghi chú markdown lên canvas. Nó không được thực thi. Dùng nó để ghi tài liệu, hướng dẫn hoặc ghi chú workflow bên cạnh các [Canvas Features](./canvas-features.md) khác. Nhấp đúp lên canvas để chỉnh sửa nội dung ghi chú.

Xem thêm [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) và [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Node Console Log ghi một giá trị ra console backend (máy chủ). Dùng nó để gỡ lỗi và kiểm tra trong quá trình phát triển. Thông điệp log hỗ trợ các biểu thức [Expression DSL](./expression-dsl.md); đầu ra truyền qua đầu vào.

Kết hợp với [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) và [Expression Evaluation Dialog](./expression-evaluation-dialog.md) để gỡ lỗi.

#### [Disable Node](../nodes/disable-node.md)

Node Disable Node vô hiệu hóa vĩnh viễn một node khác trong workflow bằng cách đặt cờ `active` của nó thành false. Chỉ định node đích theo nhãn. Dùng nó cho các thao tác một lần như dừng trigger [Cron](../nodes/cron-node.md) sau khi một điều kiện được thỏa mãn.

Xem thêm [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) và [Cron](../nodes/cron-node.md) cho các mẫu điều khiển workflow.

#### [Enable Node](../nodes/enable-node.md)

Node Enable Node bật lại một node khác bằng cách đặt cờ `active` của nó thành true và lưu thay đổi. Chỉ định node đích theo nhãn. Dùng nó để kích hoạt lại trigger [Cron](../nodes/cron-node.md) đã bị vô hiệu hóa từ một điểm vào khác, hoặc để bật một node khi một điều kiện được thỏa mãn. Một node đích nằm ở hạ nguồn của Enable Node và chưa chạy cũng sẽ chạy trong lần thực thi hiện tại.

Xem thêm [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) và [Cron](../nodes/cron-node.md) cho các mẫu điều khiển workflow.

#### [Throw Error](../nodes/throw-error-node.md)

Node Throw Error dừng thực thi workflow ngay lập tức và trả về phản hồi lỗi với mã trạng thái HTTP tùy chỉnh. Đặt biểu thức thông điệp lỗi và mã trạng thái (ví dụ: 400, 401, 403, 404, 429, 500). Dùng nó cho các trường hợp xác thực thất bại, truy cập trái phép hoặc các điều kiện lỗi khác, đặc biệt khi kết hợp với [Condition](../nodes/condition-node.md) và [Error Handler](../nodes/error-handler-node.md).

Kết hợp với [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) và [Security](./security.md) cho các đường dẫn thất bại tường minh.

---

## Tham khảo
### [Các loại node](./node-types.md)

Heym cung cấp nhiều loại node khác nhau: các trigger như [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) và [Error Handler](../nodes/error-handler-node.md); các node AI như [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) và [MCP Call](../nodes/mcp-call-node.md); các node logic như [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) và [Loop](../nodes/loop-node.md); các node dữ liệu như [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) và [Heym](../nodes/heym-node.md); các tích hợp như [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) và [Drive](../nodes/drive-node.md); các node tự động hóa như [Crawler](../nodes/crawler-node.md) và [Playwright](../nodes/playwright-node.md); và các tiện ích như [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) và [Sticky Note](../nodes/sticky-note-node.md). Sử dụng các biểu thức như `$input.text` và `$nodeLabel.field` trong cấu hình node.

Xem thêm [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) và [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym sử dụng một ngôn ngữ biểu thức đơn giản để tham chiếu dữ liệu từ các node thượng nguồn. Sử dụng `$input` cho node [Input](../nodes/input-node.md), `$nodeLabel.field` cho bất kỳ node thượng nguồn nào, `$credentials.CredentialName` cho [credentials](./credentials.md) và `$global.variableName` cho [global variables](./global-variables.md). Các biến đặc biệt tích hợp sẵn bao gồm `$now`, `$UUID` và metadata của workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` và `$executionId` (id [Execution History](./execution-history.md) của lần chạy — `/workflows/{id}/{executionId}` sẽ mở lần chạy đó trên canvas; chỉ tồn tại trong thời gian chạy, để trống trong hộp thoại xem trước biểu thức). Hỗ trợ bao gồm các literal, phép toán số học, so sánh, ngữ cảnh [Loop](../nodes/loop-node.md), các trường lồng nhau và các helper cho chuỗi/mảng (bao gồm `$text.toJson()` để phân tích cú pháp một chuỗi JSON). Khi toàn bộ giá trị là một `$expr` duy nhất, backend sẽ giữ nguyên mảng, đối tượng, boolean và số dưới dạng kiểu native.

Xem thêm [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) và [Workflow Structure](./workflow-structure.md).

### [Global Variables](./global-variables.md)

Global Variable Store lưu trữ dữ liệu key-value liên tục, theo phạm vi người dùng, tồn tại qua các lần thực thi workflow. Tạo biến từ tab [Variables](../tabs/global-variables-tab.md) hoặc từ node [Variable](../nodes/variable-node.md) với tùy chọn "Store in Global Variable Store" được bật. Truy cập chúng bằng `$global.variableName` trong các biểu thức; chúng có thể được chia sẻ với người dùng khác hoặc [teams](./teams.md).

Kết hợp với [Variable](../nodes/variable-node.md), [Teams](./teams.md) và [Credentials Sharing](./credentials-sharing.md) để chia sẻ trạng thái workflow.
### [Hộp thoại Đánh giá Biểu thức](./expression-evaluation-dialog.md)

Hộp thoại Đánh giá Biểu thức là một trình soạn thảo có thể mở rộng, xuất hiện khi bạn nhấp vào nút mở rộng bên cạnh các trường biểu thức. Nó mở ra dưới dạng một modal lớn căn giữa, giữ tính năng autocomplete luôn hoạt động và tự động làm mới kết quả xem trước từ backend sau khi bạn ngừng nhập. Kết quả dạng object và array có thể được duyệt bằng trình chọn đường dẫn đầu ra. Hộp thoại chấp nhận một đường dẫn dot trần trên toàn dòng (ví dụ `myNode.output.field`) như thể nó là `$myNode.output.field`; xem quy tắc đặt vị trí trong [Expression DSL](./expression-dsl.md).

Nút **Build with AI** trên thanh công cụ cho phép bạn mô tả biểu thức mong muốn bằng văn bản thuần. Chọn một [credential](./credentials.md) LLM và model, nhập mô tả chẳng hạn như *"Get the customer name from the API response"*, rồi nhấp Generate. Backend gửi ngữ cảnh [Expression DSL](./expression-dsl.md) và kết quả đầu ra của node ở lần chạy gần nhất đến model và trả về một chuỗi biểu thức duy nhất. Kết quả được đánh giá ngay lập tức để bạn có thể xác minh trước khi nhấp Apply.

Kết hợp tự nhiên với [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md), và [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Cấu trúc Workflow](./workflow-structure.md)

Workflow được lưu trữ dưới dạng JSON với các node và edge. Đối tượng workflow bao gồm id, name, description, nodes, edges, và các thiết lập auth. Mỗi node có id, type, position, và data (label cùng cấu hình riêng theo type). Các edge kết nối ID của node nguồn và node đích với các handle ID tùy chọn. Cú pháp biểu thức trong các trường data tuân theo [Expression DSL](./expression-dsl.md), và cùng cấu trúc này được sử dụng bởi [Download & Import](./download-import.md).

Xem thêm [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md), và [Download & Import](./download-import.md).

### [Tính năng Canvas](./canvas-features.md)

Di chuột qua bất kỳ node canvas không phải sticky nào và nhấp **Run** để thực thi đến node đó. Các đầu vào bắt buộc sẽ mở trong bảng Run với trường đầu tiên được focus; các đường dẫn không có đầu vào sẽ bắt đầu ngay lập tức. Xem [Run to Node](./canvas-features.md#run-to-node).

Trình soạn thảo workflow cung cấp Data Pin (ghim kết quả đầu ra cuối cùng của một node để kiểm thử các node phía sau mà không cần chạy lại), Execution Logs (kết quả node theo thời gian thực và tiến trình agent, bổ trợ cho [Execution History](./execution-history.md)), Enable/Disable (bỏ qua các node trong quá trình thực thi), và Extract to Sub-Workflow (di chuyển một vùng chọn vào workflow mới và thay thế nó bằng một node [Execute](../nodes/execute-node.md)). Một execution production đang chạy có thể được mở từ History hoặc từ một thẻ trên Board; trình soạn thảo khôi phục snapshot hiện tại của nó, kết nối với SSE, và giữ hoạt ảnh canvas cùng Debug logs luôn hoạt động. [Keyboard Shortcuts](./keyboard-shortcuts.md) hỗ trợ copy, paste, run, và tìm kiếm node inline.

Xem thêm [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md), và [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Xem demo Editor</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym cung cấp các phím tắt xuyên suốt trình soạn thảo: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo, và Escape để đóng. Trên canvas: chọn tất cả, chọn nhiều, copy/cut/paste, xóa, bật/tắt node (D), bật/tắt dữ liệu đã ghim (P), và tìm kiếm node inline bằng cách nhập. Các phím tắt được ghi lại trong tài liệu tham khảo trong ứng dụng và hoạt động chặt chẽ với [Canvas Features](./canvas-features.md) như Data Pin và bật/tắt node.

Xem thêm [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md), và [Contextual Showcase](./contextual-showcase.md).

### [AI Assistant](./ai-assistant.md)

AI Assistant là một bảng chat được mở từ bảng Debug, cho phép bạn tạo hoặc chỉnh sửa workflow bằng ngôn ngữ tự nhiên. Chọn một [credential](./credentials.md) và model, sau đó mô tả điều bạn muốn; AI sẽ stream phản hồi và bất kỳ [workflow JSON](./workflow-structure.md) hợp lệ nào trong khối mã sẽ được tự động phân tích và áp dụng vào canvas. Hỗ trợ nhập bằng giọng nói trên các trình duyệt tương thích.

Bật **YOLO mode** (Agent mode, mặc định tắt) và assistant sẽ kiểm thử những gì nó xây dựng. Sau mỗi thay đổi, nó chạy workflow trên canvas, đọc kết quả và sửa workflow cho đến khi làm được điều bạn yêu cầu, tối đa 5 lần chạy cho mỗi tin nhắn. Nó yêu cầu đầu vào kiểm thử trước lần chạy đầu tiên, có thể chạy các workflow khác của bạn khi cần kết quả của chúng, và hiển thị từng bước trong quá trình làm việc. Xem [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Nhấp vào **AI** phía trên bất kỳ node nào trên canvas để chỉ thay đổi hoặc sửa chữa node đó. Bảng điều khiển hiển thị node mà nó đang thay đổi (với kết quả gần nhất sau khi chạy) và cung cấp **Change this node as ...**, **Fix error in this node ...** và **Other**. Chỉ node đó được cập nhật; phần còn lại của workflow và bố cục vẫn giữ nguyên. Xem [AI Assistant › Thay đổi một Node](./ai-assistant.md#changing-one-node).

Khi một workflow lưu trữ bản ghi, assistant sẽ hỏi nên dùng [data table](../tabs/datatable-tab.md) nào, hoặc tạo một bảng với các cột mà workflow cần. Xem [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Khi workflow hiện tại chứa các skill của [Agent Node](../nodes/agent-node.md), assistant chỉ gửi `SKILL.md` của từng skill vào ngữ cảnh workflow. Các tệp `.py` đính kèm và tài nguyên skill dạng nhị phân bị loại trừ trước khi gửi yêu cầu để các gói skill lớn không làm tràn cửa sổ ngữ cảnh của model.

Kết hợp tốt với [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md), và [Expression DSL](./expression-dsl.md).
### [Chat với Heym](./chat-with-heym.md)

Chat với Heym là trợ lý tiêu đề tài liệu dành cho các câu hỏi về sản phẩm. Nó mở trong một hộp thoại căn giữa, giữ lựa chọn credential và model luôn hiển thị ở phía trên, chèn đường dẫn trang tài liệu đang hoạt động làm ngữ cảnh, và xóa lịch sử tin nhắn khi hộp thoại đóng lại. Nó bổ trợ cho [AI Assistant](./ai-assistant.md) rộng hơn và [Contextual Showcase](./contextual-showcase.md) nhẹ hơn.

Xem thêm [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md), và [Node Types](./node-types.md).

### [Tổ chức Workflow](./workflow-organization.md)

Quản trị viên instance (`HEYM_ADMIN_EMAILS`) có thể truy cập và chỉnh sửa mọi workflow, tìm workflow của một chủ sở hữu theo email, kiểm tra lịch trình và lịch sử thực thi, tạm dừng và tiếp tục các trigger tự động, và xóa workflow sau khi các lần chạy đã ổn định. Xem [Instance Administration](../tabs/workflows-tab.md#instance-administration) để biết quy trình offboarding và sự khác biệt giữa việc tạm dừng trigger tự động và chặn tất cả các cuộc gọi.

Workflow có thể được tổ chức trong các thư mục và thư mục con theo cấu trúc cây. Thư mục có tên và parent tùy chọn; workflow được gán vào thư mục. Workflow có thể được lên lịch xóa (chuyển vào vùng thùng rác trước khi xóa vĩnh viễn). API hỗ trợ tạo, cập nhật, xóa và di chuyển workflow giữa các thư mục, và cùng mô hình tổ chức này xuất hiện trong tab [Workflows](../tabs/workflows-tab.md).

Xem thêm [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md), và [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Quick Drawer là bảng chạy nhanh cố định bên phải dành cho các trang nội bộ không phải canvas. Nó cho phép bạn tìm kiếm [workflow](../tabs/workflows-tab.md), ghim mục yêu thích, chọn input, chạy ngay lập tức, và kiểm tra tiến trình hoặc kết quả mà không cần mở editor. Một workflow có [File Upload Trigger](../nodes/file-upload-trigger-node.md) sẽ nhận tệp được kéo thả hoặc chọn. Thứ tự ghim và workflow được chọn lần cuối được lưu trong trình duyệt.

Xem thêm [Tổ chức Workflow](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md), và [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase là thanh hướng dẫn trong ứng dụng nhỏ gọn dành cho các bề mặt chính đã xác thực như các tab dashboard, [Evals](../tabs/evals-tab.md), Docs, và workflow editor. Nó đóng theo mặc định, đưa ra tóm tắt trang ngắn gọn trước, cung cấp thêm một chút chi tiết khi có yêu cầu, và liên kết đến bài viết tài liệu đầy đủ khi bạn muốn hướng dẫn sâu hơn.

Kết hợp với [Chat với Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md), và [AI Assistant](./ai-assistant.md) cho các luồng hướng dẫn trong ứng dụng.

### [Credentials](./credentials.md)

Credentials lưu trữ API key và secret được sử dụng bởi các node workflow. Thêm chúng trong tab [Credentials](../tabs/credentials-tab.md) và tham chiếu chúng theo tên hoặc ID trong các node như [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md), và [Redis](../nodes/redis-node.md). Chúng được mã hóa khi lưu trữ, có thể được chia sẻ với người dùng hoặc [teams](./teams.md), và cũng có thể được tham chiếu trong [Expression DSL](./expression-dsl.md) thông qua `$credentials.Name`.

Xem thêm [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md), và [Third-Party Integrations](./integrations.md).

### [Credentials Sharing](./credentials-sharing.md)

Credentials có thể được chia sẻ với người dùng khác qua email hoặc với teams; tất cả thành viên team đều có quyền truy cập khi một credential được chia sẻ với một team. Credentials được chia sẻ xuất hiện với một chỉ báo trong tab [Credentials](../tabs/credentials-tab.md). Khi chạy, ngữ cảnh của chủ sở hữu workflow hợp nhất các credential thuộc sở hữu, được chia sẻ bởi người dùng, và được chia sẻ bởi team. Sử dụng `$credentials.CredentialName` trong các biểu thức hoặc đặt credentialId trong dữ liệu node.

Xem thêm [Credentials](./credentials.md), [Teams](./teams.md), và [Third-Party Integrations](./integrations.md).

### [Teams](./teams.md)

Teams cho phép bạn chia sẻ workflow, credentials, global variables, vector stores, và Drive files với một nhóm người dùng cùng lúc. Tạo teams từ tab [Teams](../tabs/teams-tab.md) và thêm thành viên qua email. Chia sẻ tài nguyên với một team từ các hộp thoại chia sẻ tương ứng; tất cả thành viên sau đó đều có quyền truy cập. Người tạo có thể chỉnh sửa và xóa team; xóa một team sẽ loại bỏ tất cả các chia sẻ của team đó.

Kết hợp với [Credentials Sharing](./credentials-sharing.md), [Global Variables](./global-variables.md), và [Enterprise](./enterprise.md).

### [Parallel Execution](./parallel-execution.md)

Heym chạy các node song song khi chúng không có phụ thuộc lẫn nhau. Executor xây dựng một DAG và chạy các node trong cùng một cấp đồng thời với một thread pool; ngay khi một node hoàn thành, các node hạ nguồn của nó được lên lịch. Sử dụng node [Merge](../nodes/merge-node.md) để kết hợp các nhánh song song khi cần. Nhiều lần chạy workflow thực thi đồng thời; mỗi lần chạy được cô lập. Chế độ [SSE Streaming](./sse-streaming.md) phát ra các sự kiện khi các node hoàn thành.

Xem thêm [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md), và [Execution History](./execution-history.md).
### [Kiến trúc Agent](./agent-architecture.md)

[Node Agent](../nodes/agent-node.md) hỗ trợ sub-agent (orchestrator gọi các node agent khác thông qua call_sub_agent), sub-workflow (agent gọi các workflow khác thông qua call_sub_workflow), skill (nội dung hướng dẫn và công cụ Python từ tệp .zip hoặc .md), và kết nối client [MCP](../tabs/mcp-tab.md). Bộ thực thi công cụ của orchestrator định tuyến các lệnh gọi sub-agent và sub-workflow; các công cụ khác được chuyển đến bộ thực thi Python, MCP hoặc skill. Độ sâu lồng nhau tối đa cho sub-agent và sub-workflow là 5. Vòng lặp gọi công cụ bao gồm tính năng nén ngữ cảnh tự động: trước mỗi lần lặp, mức sử dụng token được ước tính và nếu vượt quá 80% cửa sổ ngữ cảnh của model, các tin nhắn ở giữa sẽ được tóm tắt bằng chính model đó, giữ nguyên system prompt, tin nhắn người dùng đầu tiên và tin nhắn người dùng cuối cùng.

Xem thêm [Node Agent](../nodes/agent-node.md), [Bộ nhớ lâu dài của Agent](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md), và [MCP](../tabs/mcp-tab.md).

### [Bộ nhớ lâu dài của Agent](./agent-persistent-memory.md)

Đồ thị tri thức tùy chọn cho từng [Node Agent](../nodes/agent-node.md) được lưu trữ trong Postgres: các thực thể, kiểu, thuộc tính và mối quan hệ có hướng. Khi `persistentMemoryEnabled` là true, đồ thị được tóm tắt vào system prompt trong mỗi lần chạy; sau khi hoàn thành thành công, một [LLM](../nodes/llm-node.md) sẽ trích xuất các cập nhật có cấu trúc ở chế độ nền. REST CRUD nằm tại `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Trình chỉnh sửa mở từ nút điều khiển hình não màu hồng trên node.

Xem thêm [Node Agent](../nodes/agent-node.md), [Kiến trúc Agent](./agent-architecture.md), và [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop cho phép [Node Agent](../nodes/agent-node.md) yêu cầu phê duyệt tại các checkpoint cụ thể, tạo trang `/review/{token}` công khai và chờ người đánh giá chưa đăng nhập chấp nhận, chỉnh sửa hoặc từ chối văn bản đánh giá Markdown. Các agent được bật HITL cũng cung cấp một output handle `review` để bạn có thể thông báo cho [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) hoặc các kênh khác trong khi quá trình chạy đang chờ xử lý. Văn bản HITL ở cấp node được dùng làm hướng dẫn phê duyệt, trong khi phần tóm tắt trên trang công khai được tạo từ chính yêu cầu đánh giá. Các lần chạy đang chờ xử lý xuất hiện trong [Lịch sử thực thi](./execution-history.md) ngay lập tức, có thể xảy ra nhiều lần trong cùng một lần chạy và tiếp tục từ đúng snapshot workflow đã lưu sau khi mỗi quyết định được gửi đi.

Xem thêm [Node Agent](../nodes/agent-node.md), [Portal](./portal.md), [Lịch sử thực thi](./execution-history.md), và [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflow có thể được kích hoạt qua [HTTP](../nodes/http-node.md) tại `POST /api/workflows/{workflow_id}/execute`, hoặc truyền phát tăng dần từ `POST /api/workflows/{workflow_id}/execute/stream`. Phần body của request được truyền dưới dạng body cho các node [Input](../nodes/input-node.md); headers và query params có sẵn trong các biểu thức [Expression DSL](./expression-dsl.md). Cấu hình xác thực cho từng workflow: anonymous, JWT hoặc custom header. Tính năng bộ nhớ đệm phản hồi tùy chọn, giới hạn tốc độ và hộp thoại Run with cURL của trình chỉnh sửa đều nằm trên workflow và áp dụng cho cả hai chế độ. Với [giới hạn đồng thời](./webhooks.md#concurrency-limit-and-queued-runs), cuộc gọi phải chờ sẽ nhận được `202 Accepted` với ID thực thi và URL trạng thái thay thế.

Xem thêm [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md), và [Cấu trúc Workflow](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Execution token là các JWT có phạm vi cấp quyền truy cập vào endpoint execute và stream của một workflow duy nhất. Khi một workflow sử dụng xác thực JWT, token cho phép các script bên ngoài, pipeline CI và các tích hợp gọi workflow mà không cần chia sẻ phiên người dùng. Mỗi token mang một claim `wid` gắn nó với một workflow, một `jti` dùng để thu hồi tức thì và TTL có thể cấu hình (từ 60 giây đến 10 năm). Tạo, chọn và thu hồi token trực tiếp từ hộp thoại **Run with cURL** — token được chọn sẽ tự động được nhúng vào lệnh được tạo.

Xem thêm [Webhooks](./webhooks.md), [Bảo mật](./security.md), và [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

Hộp thoại cURL có thể chuyển chế độ thực thi [webhook](./webhooks.md) sang chế độ Server-Sent Events. Điều này tạo ra các sự kiện `execution_started`, `node_start`, `node_complete` và `execution_complete` theo thời gian thực, thêm `--no-buffer` vào lệnh cURL được tạo và cho phép bạn cấu hình thông báo bắt đầu cho từng node như `[START] LLM` hoặc văn bản tùy chỉnh cho các trình tiêu thụ terminal bên ngoài.

Xem thêm [Webhooks](./webhooks.md), [Lịch sử thực thi](./execution-history.md), và [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflow được khởi động bởi các node trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), RabbitMQ nhận) hoặc các entry point: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), bộ lập lịch Cron, Telegram webhook, Discord interaction webhook, trình quản lý IMAP trigger, RabbitMQ consumer, hoặc chạy từ Editor. Mỗi trigger có endpoint hoặc tiến trình nền riêng; [Cron](../nodes/cron-node.md) chạy mỗi 60 giây, các node [Telegram Trigger](../nodes/telegram-trigger-node.md) nhận bot webhook, các node [Discord Trigger](../nodes/discord-trigger-node.md) nhận interaction webhook có chữ ký, và các node [IMAP Trigger](../nodes/imap-trigger-node.md) chạy theo khoảng thời gian polling đã cấu hình. Các node [Input](../nodes/input-node.md) nhận body, headers và query từ các yêu cầu webhook.

Xem thêm [Node Types](./node-types.md), [Webhooks](./webhooks.md) và [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Execution history ghi lại các lần chạy workflow: đầu vào, đầu ra, kết quả của từng node, trạng thái và nguồn trigger. Truy cập từ thanh công cụ Editor, chế độ xem Docs, tiêu đề Dashboard hoặc chế độ xem [Evals](../tabs/evals-tab.md). Lịch sử theo từng workflow hiển thị các lần chạy của workflow đang mở; chế độ xem toàn bộ lịch sử hiển thị các lần chạy trên tất cả workflow và chat. Các execution đang chạy hiện lên ở đầu cả hai hộp thoại với các hành động **Open live** và **Cancel**. Open live gắn editor vào execution đang tồn tại qua [SSE](./sse-streaming.md), khôi phục các node đã hoàn thành, nhấp nháy các node hiện tại và đang chờ, đồng thời thêm log Debug mà không khởi động một lần chạy mới. Bring to Canvas tải đầu vào và đầu ra của các node trong một lần chạy đã hoàn thành để chạy lại hoặc gỡ lỗi; deep link `/workflows/{workflowId}/{executionId}` hỗ trợ cả execution đang chạy lẫn đã hoàn thành. Các lần chạy bị tạm dừng bởi [Human-in-the-Loop](./human-in-the-loop.md) được lưu ngay lập tức dưới trạng thái `pending`, bao gồm URL review công khai và mọi node thông báo được thực thi từ nhánh `review` của agent. Nếu server khởi động lại giữa lúc chạy, các lần chạy bị gián đoạn sẽ được khôi phục tự động: chúng được chạy lại từ đầu với cùng đầu vào và hiển thị là đã hoàn thành (đánh dấu **Recovered**), được điều khiển bởi tùy chọn **Auto-recover runs** theo từng workflow, thay vào đó có thể ghi chúng là `skipped`.

Xem thêm [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) và [Traces](../tabs/traces-tab.md).

### Execution Highlights

Sau một lần chạy trực tiếp — hoặc sau **Bring to Canvas** — một popup **Execution Highlights** có thể đóng xuất hiện ở góc trên bên phải của Canvas, liệt kê những gì mỗi node đã tạo ra theo thứ tự thực thi. Đây là cách nhanh để kiểm tra đầu ra của từng node mà không cần mở từng node; đóng nó bằng **✕**, và nó sẽ mở lại ở lần chạy tiếp theo. Highlights cũng được hiển thị trên các lần chạy trong dashboard. Xem [Execution History](./execution-history.md) để biết chi tiết.

### [Edit History](./edit-history.md)

Edit History theo dõi các phiên bản đã lưu của một workflow (mỗi lần Save tạo một phiên bản). Xem danh sách, mở một phiên bản để xem diff so với workflow hiện tại ([nodes](./workflow-structure.md), edges, config), và Revert để khôi phục một phiên bản trước đó. Khác với [Execution History](./execution-history.md), Edit History theo dõi các thay đổi cấu trúc, không phải các lần chạy.

Xem thêm [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) và [Canvas Features](./canvas-features.md).

### Error Workflow

Một workflow có thể chỉ định một workflow khác để chạy khi nó thất bại. Cấu hình trong bảng **Properties** ở cấp workflow (hiển thị khi không có node nào được chọn) tại mục **On error, run workflow**. Chỉ chủ sở hữu workflow mới có thể đặt, thay đổi hoặc xóa nó; xem [Owner-only settings](./workflow-organization.md#owner-only-settings). Khi một lần chạy cấp cao nhất kết thúc với lỗi không được xử lý, workflow lỗi đã chọn sẽ chạy và nhận ngữ cảnh lỗi (id và tên workflow thất bại, id lần chạy, thông báo lỗi, nhãn và loại node thất bại, cùng dấu thời gian). Nếu canvas đã chứa node [Error Handler](../nodes/error-handler-node.md), trình xử lý cục bộ sẽ được ưu tiên và workflow lỗi sẽ **không** được gọi. Bản thân workflow lỗi chạy trực tiếp, nên nó không bao giờ kích hoạt workflow lỗi của chính nó.

Nó bao phủ mọi lần chạy cấp cao nhất không phải test: cả hai endpoint execute, [Portal](./portal.md), và mọi trigger, bao gồm [cron](../nodes/cron-node.md), các trigger nền tảng chat, email, hàng đợi, [MCP](../tabs/mcp-tab.md) và widget dashboard. Khi bật [Load Distribution](./cluster.md), điều này không thay đổi, kể cả các lần chạy do worker thực thi: node thất bại được truyền ngược lại cùng kết quả, và workflow lỗi sau đó được phân phối như bất kỳ lần chạy nào khác, nên một node bên trong nó phải chạy trên instance chính vẫn sẽ chạy như vậy. Hai trường hợp được cố ý loại trừ, vì kết quả của chính workflow vẫn chưa được biết: một lần chạy mà không instance nào từng thực thi, và một khoảng chờ hết thời gian trong khi lần chạy có thể vẫn đang diễn ra. Nó cũng **không** được kích hoạt bởi các lần chạy test thủ công trên canvas.
### Workflow Timeout

Mỗi workflow có thể đặt **workflow timeout** tính bằng giây trong bảng **Properties** ở cấp workflow. `0` (mặc định) sẽ vô hiệu hóa tính năng này. Khi được đặt, một lần chạy vượt quá giới hạn sẽ bị dừng tại ranh giới node tiếp theo và được ghi nhận là lần chạy thất bại với lỗi "timed out". Timeout áp dụng cho các lần chạy thủ công, qua API và qua trigger. Các node [Wait](../nodes/wait-node.md) dài sẽ bị ngắt ngay lập tức thay vì chặn trong suốt thời gian của chúng.

### Giới hạn đồng thời

Mỗi workflow có thể giới hạn số lượng lượt chạy sản xuất được thực thi cùng lúc bằng tùy chọn **Giới hạn đồng thời** trong bảng **Properties** ở cấp workflow; chủ sở hữu và cộng tác viên có quyền chỉnh sửa có thể thay đổi và tính năng này tắt theo mặc định. Khi đạt đến giới hạn, các lượt chạy mới từ các endpoint [webhook](./webhooks.md#concurrency-limit-and-queued-runs) và [streaming](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) và mọi [trigger](./triggers.md) sẽ chờ trong hàng đợi FIFO (vào trước, ra trước), được tính trên tất cả các instance của một [cluster](./cluster.md). Các lượt chạy thử nghiệm của trình chỉnh sửa, các lệnh gọi sub-workflow, [Evals](../tabs/evals-tab.md) và việc tiếp tục xem xét không bao giờ bị xếp vào hàng đợi, đồng thời các lượt chạy thẻ trên [Board](../tabs/board-tab.md), tải lên tệp, các lượt chạy do công cụ run-workflow của trợ lý AI khởi chạy và workflow thông báo cảnh báo sẽ bắt đầu mà không cần chờ slot. Cuộc gọi webhook phải chờ sẽ nhận ngay `202 Accepted` với `execution_id`, URL trạng thái phản hồi bằng cùng thông tin xác thực, vị trí của nó, kích thước hàng đợi và số lượng đang chạy; ứng dụng khách MCP nhận được thông tin tương tự và thăm dò công cụ `heym_execution_status`. Mục tùy chọn **Kích thước hàng đợi tối đa** sẽ từ chối các cuộc gọi vượt mức với mã `429`, và mục tùy chọn **Thời gian chờ tối đa** sẽ ghi lại lượt chạy đã chờ quá lâu là `expired`. Các lượt chạy đang chờ xuất hiện trong [Lịch sử lượt chạy](./execution-history.md) dưới dạng **Trong hàng đợi n/m** và có thể bị hủy tại đó.

### Time Saved

Mỗi workflow có thể ghi lại **estimated time saved per run** (tính bằng phút), được đặt trong bảng **Properties** ở cấp workflow. Tab [Analytics](../tabs/analytics-tab.md) tổng hợp giá trị này trong khoảng đã chọn thành chỉ số **Time Saved** tổng (tổng của ước tính mỗi workflow × số lần chạy thành công của nó). Most Used cũng liệt kê tổng đó theo từng workflow; **Not Set** sẽ mở trường ước tính khi nó chưa được đặt. Báo cáo [Workflow Analysis](./workflow-analysis.md) khuyến nghị đặt ước tính khi chưa có cấu hình nào.

### [Settings](./user-settings.md)

Hộp thoại Settings (mở từ avatar của bạn ở phần header) có bốn tab: Profile (ảnh Gravatar, tên hiển thị, User Rules), [Security](./security.md) (đổi mật khẩu), Voice ([ElevenLabs TTS/STT](./chat-voice.md)), và Observability (trạng thái [OpenTelemetry](./opentelemetry.md) chỉ đọc). User Rules là các hướng dẫn tùy chỉnh được chèn vào mọi yêu cầu AI, bao gồm cả workflow builder và [Chat](../tabs/chat-tab.md), để bạn có thể thiết lập ngôn ngữ, giọng điệu, phong cách lập trình hoặc quy ước workflow một lần. Chính sách mật khẩu và quản lý API key [MCP](../tabs/mcp-tab.md) cũng có sẵn.

Xem thêm [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md), và [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym có thể phát ra các trace OpenTelemetry cho mỗi lần chạy workflow và mỗi lần thực thi node: một span gốc `heym.workflow.execute` cho mỗi lần chạy và một span con `heym.node.execute` cho mỗi node, với thông tin model và token usage được đính kèm vào các node LLM và agent. Các span được xuất qua OTLP/HTTP đến bất kỳ backend tương thích nào (Jaeger, Grafana Tempo, Honeycomb, Datadog), và W3C trace context được truyền qua các webhook đến, HTTP đi ra và sub-workflow. Tracing bị vô hiệu hóa theo mặc định và được cấu hình bằng các [environment variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; trạng thái hiện tại được hiển thị trong tab Observability của [Settings](./user-settings.md).

Xem thêm [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md), và [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Xuất workflow hiện tại dưới dạng JSON từ thanh công cụ Editor (nút Download); tệp bao gồm các node và edge. Nhập bằng cách kéo một tệp JSON vào tab [Workflows](../tabs/workflows-tab.md) (tạo workflow mới) hoặc vào canvas (thay thế hoặc hợp nhất). JSON phải bao gồm một mảng nodes; name và edges là tùy chọn. Sử dụng tính năng này để sao lưu, chia sẻ hoặc di chuyển giữa các instance.

Xem thêm [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md), và [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal hiển thị các workflow dưới dạng giao diện chat công khai tại `/chat/{slug}`. Cấu hình portal_enabled, slug, auth tùy chọn (portal users), streaming và tải tệp lên cho từng workflow. Người dùng cuối tương tác qua giao diện chat mà không cần đăng nhập vào Heym; đầu ra hình ảnh có thể được hiển thị trong chat. Các workflow Portal cũng có thể chuyển sang các trang đánh giá [Human-in-the-Loop](./human-in-the-loop.md) khi một [Agent Node](../nodes/agent-node.md) yêu cầu phê duyệt, trong khi nhánh `review` của agent gửi thông báo đến các kênh khác. Sử dụng tính năng này cho các công cụ nội bộ, chatbot hướng đến khách hàng và các biểu mẫu được hỗ trợ bởi AI.

Xem thêm [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md), và [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills có thể tạo các tệp như PDF, DOCX, CSV, JSON và hình ảnh trong quá trình thực thi bằng cách ghi vào workspace `_OUTPUT_DIR`. Heym tự động thu thập các tệp đó, lưu trữ chúng và cung cấp metadata tải xuống dưới `_generated_files`, sau đó có thể được quản lý bằng [Drive node](../nodes/drive-node.md) hoặc xem trong tab [Drive](../tabs/drive-tab.md).

Xem thêm [Agent Node](../nodes/agent-node.md), [Drive](./drive.md), và [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive là lớp lưu trữ và chia sẻ chung cho các tệp được tạo bởi skills. Nó cho phép bạn duyệt tệp, tạo liên kết công khai hoặc được bảo vệ bằng mật khẩu, áp dụng thời hạn và giới hạn tải xuống, chia sẻ tệp ở chế độ chỉ đọc với các team của bạn, và quản lý những tệp đó theo lập trình bằng [Drive node](../nodes/drive-node.md) hoặc thủ công từ tab [Drive](../tabs/drive-tab.md).

Xem thêm [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md), và [Portal](./portal.md).
### [Bảo mật](./security.md)

Heym áp dụng chính sách mật khẩu (độ dài, chữ hoa, chữ thường, chữ số), lưu trữ access token trong HttpOnly cookie và luân chuyển refresh token mỗi lần sử dụng. Giới hạn tần suất được áp dụng cho đăng nhập, đăng ký và đăng nhập [Portal](./portal.md). [Credentials](./credentials.md) được mã hóa khi lưu trữ bằng AES-256 (Fernet). API key của [MCP](../tabs/mcp-tab.md) được dùng để xác thực client; tính năng an toàn nội dung khả dụng thông qua [Guardrails](./guardrails.md) trên các node [LLM](../nodes/llm-node.md) và [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) cung cấp JWT phạm vi theo từng workflow cho các bên gọi bên ngoài.

Xem thêm [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) và [Credentials](./credentials.md).

### [Đăng nhập một lần (Single Sign-On)](./sso.md)

Heym xác thực người dùng với bất kỳ nhà cung cấp OpenID Connect bên ngoài nào - Keycloak, Okta, Entra ID, Auth0, Google - được cấu hình tại thời điểm chạy từ **Settings → SSO** bởi quản trị viên instance có trong `HEYM_ADMIN_EMAILS`. Chỉ cần nhập issuer URL và client credentials; mọi endpoint đều lấy từ discovery document của nhà cung cấp, do đó không có nhà cung cấp nào bị hardcode. Đăng nhập sử dụng Authorization Code với PKCE, và ID token được xác minh dựa trên các khóa công khai của nhà cung cấp. Tài khoản được ánh xạ theo `(issuer, subject)` trước, sau đó theo email đã xác minh, với tính năng tự động cấp phát tùy chọn giới hạn trong danh sách cho phép theo tên miền email. Đăng nhập bằng mật khẩu vẫn khả dụng song song với SSO và có thể tắt sau khi kiểm tra kết nối thành công, với các tài khoản trong `HEYM_ADMIN_EMAILS` được miễn trừ để nhà cung cấp bị cấu hình sai không thể khóa instance.

Xem thêm [Settings](./user-settings.md), [Security](./security.md) và [Audit Logging](./audit.md).

### [Phân phối tải (Load Distribution)](./cluster.md)

Trỏ một instance Heym thứ hai vào cùng cơ sở dữ liệu và nó sẽ tham gia như một worker. Các tác vụ chạy nền - cron, webhook, lệnh gọi công cụ MCP, chat trigger - được chia sẻ giữa các instance theo tỷ lệ phần trăm do quản trị viên instance thiết lập trong **Settings → Instances**, với trạng thái, độ trễ cơ sở dữ liệu và phiên bản của mỗi instance hiển thị trong một bảng. Các instance không bao giờ giao tiếp với nhau: Postgres đảm nhận công việc, do đó worker không cần cổng mở và không cần đường dẫn trở về instance chính. Công việc liên quan đến tệp cục bộ, workspace của coding-agent hoặc plugin đã cài đặt luôn chạy trên instance chính, và bảng điều khiển báo cáo tỷ lệ đó trong 24 giờ qua, để người vận hành có thể thấy khi nào tỷ lệ phần trăm không giúp ích được. Mọi lần chạy trong lịch sử đều ghi rõ instance đã thực thi nó, và cả hai hộp thoại lịch sử đều có thể lọc theo tiêu chí này.

Xem thêm [Settings](./user-settings.md), [Traces](../tabs/traces-tab.md) và [Analytics](../tabs/analytics-tab.md).

### [Tích hợp bên thứ ba (Third-Party Integrations)](./integrations.md)

Heym kết nối với các dịch vụ bên ngoài thông qua credentials được lưu trong tab [Credentials](../tabs/credentials-tab.md) (được mã hóa khi lưu trữ). Các loại được hỗ trợ bao gồm OpenAI, Google, Decision Model cho [Decision node](../nodes/decision-node.md), Model Router để tự động chọn model (xem bên dưới), GitHub cho [GitHub node](../nodes/github-node.md) và các tích hợp MCP, Jira cho [Jira node](../nodes/jira-node.md), Notion cho [Notion node](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP cho [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header và FlareSolverr cho [Crawler](../nodes/crawler-node.md). Mỗi loại đều có tài liệu về các trường bắt buộc; credentials có thể được chia sẻ với người dùng hoặc [teams](./teams.md) và được tham chiếu theo tên trong các node hoặc dưới dạng `$credentials.Name` trong biểu thức.

### Model Router (Auto Model)

Credential **Model Router** chọn model cho từng yêu cầu thay vì giữ một key. Nó
lưu trữ một credential decision model cùng danh sách các credential OpenAI/Google/Custom
hiện có của bạn, mỗi credential kèm tiêu chí nói khi nào nên dùng, và xuất hiện trong mọi
model picker với một model duy nhất gọi là **Auto**.

Traces, Execution Log trên canvas và Span View hiển thị cả hai phần của lựa chọn, ví
dụ `Auto Model / GPT-5`, trong khi chi phí vẫn được quy cho model đã chạy. Auto
Model không thể kết hợp với Responses API, chế độ Batch hoặc đầu ra hình ảnh. Xem
[Credentials](./credentials.md) để biết đầy đủ hành vi.

Xem thêm [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) và [Teams](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails chặn các tin nhắn người dùng không an toàn hoặc không mong muốn trước khi chúng đến [LLM](../nodes/llm-node.md) hoặc [Agent Node](../nodes/agent-node.md). Bật chúng theo từng node và chọn các danh mục cần chặn (ví dụ: bạo lực, ngôn từ thù địch, nội dung tình dục, tự gây hại, quấy rối, hoạt động bất hợp pháp). Đặt độ nhạy (thấp, trung bình, cao). Khi bị kích hoạt, node sẽ ném ra lỗi mà bạn có thể bắt bằng [Error Handler](../nodes/error-handler-node.md). Việc phát hiện sử dụng API kiểm duyệt của nhà cung cấp hoặc phân loại LLM tùy thuộc vào loại credential.

Xem thêm [Security](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) và [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise bao gồm cấp phép thương mại, hỗ trợ chuyên nghiệp và dịch vụ triển khai cho các nhóm vận hành Heym trong môi trường production. Gói này bao gồm hỗ trợ kiến trúc workflow, onboarding, hướng dẫn Kubernetes và mở rộng quy mô, hỗ trợ ưu tiên, và phát triển tùy chỉnh xoay quanh các tính năng nâng cao như [Agent Node](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md), và [Portal](./portal.md).

Xem thêm [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md), và [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work là giao diện thứ hai dành cho các nhóm nghiệp vụ được xây dựng trên nền Heym. Mọi người mô tả công việc, trả lời một vài câu hỏi và nhận được một workflow đã được kiểm thử, sau đó làm việc từ các trang, phê duyệt và danh sách Hoạt động nơi mỗi lần chạy đều có tên. Quản trị viên hệ thống kết nối nó trong **Cài đặt → Heym Work** bằng địa chỉ và khóa tích hợp; sản phẩm có giấy phép riêng từ đội ngũ Heym.

Xem thêm [Enterprise](./enterprise.md), [Single Sign-On](./sso.md), và [Human-in-the-Loop](./human-in-the-loop.md).

---

## Các Tab trên Dashboard

### [Workflows](../tabs/workflows-tab.md)

Tab Workflows là chế độ xem mặc định của dashboard. Tab này hiển thị danh sách hai khung: workflows và folders dưới dạng các hàng dày đặc ở bên trái, và bản xem trước của workflow được chọn ở bên phải cùng với trigger, lần chạy gần nhất, và các bước, kèm theo Open Workflow và Run Now. Mỗi hàng đều có một chip trạng thái (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) mà dropdown Status có thể lọc theo. Một workflow không có node trigger sẽ được gán nhãn dựa trên cách lần chạy gần nhất của nó bắt đầu - API cho một lệnh gọi HTTP, SubWorker cho một workflow cha, Portal cho chat công khai của nó - và vẫn ở trạng thái Manual cho đến khi nó đã chạy. Folders và sub-folders xử lý việc [tổ chức](./workflow-organization.md). Tạo workflow với New Workflow, kéo và thả JSON để [import](./download-import.md), và chỉnh sửa hoặc xóa từ các hành động trên hàng. Workflows có thể được di chuyển giữa các folder; việc xóa được lên lịch (thùng rác) trước khi xóa vĩnh viễn.

Xem thêm [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md), và [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Xem demo Workflows</a></p>

### [Board](../tabs/board-tab.md)

Một bảng kanban dạng agentic nơi các thẻ là các job liên tục. Cấu hình mỗi cột với một chuỗi workflow có thứ tự; di chuyển một thẻ vào cột sẽ chạy chuỗi đó với toàn bộ ngữ cảnh của thẻ (nội dung, bình luận, lịch sử, các output trước đó). Kết quả được ghi trở lại thẻ — màu xanh khi thành công, màu đỏ khi thất bại, màu hổ phách khi đang chạy. Các vòng tiếp theo sẽ chạy lại chuỗi của cột hiện tại với mọi thứ đã tích lũy cho đến thời điểm đó, điều này hỗ trợ việc lập kế hoạch lặp lại. Các lần chạy được ghi lại trong [Execution History](./execution-history.md) với nguồn trigger là `board`. Trong khi một lần chạy thẻ đang hoạt động, **Open live** sẽ mở chính xác lần chạy đó trên canvas động với nhật ký Debug tăng dần.

Xem thêm [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md), và [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Xem demo Board</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Tab Templates cho phép bạn lưu và tái sử dụng các workflow template (workflow đầy đủ) và node template (các node được cấu hình đơn lẻ). Tạo workflow template từ trình chỉnh sửa (Share as Template) và node template bằng cách nhấp chuột phải vào một node. Duyệt theo chế độ hiển thị (Everyone hoặc người dùng/[teams](./teams.md) cụ thể), áp dụng một template để tạo workflow mới hoặc thêm một node vào canvas, và quản lý các template đã chia sẻ của bạn.

Xem thêm [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md), và [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Xem demo Templates</a></p>

### [Variables](../tabs/global-variables-tab.md)

Tab Variables quản lý [Global Variable Store](./global-variables.md). Tạo, chỉnh sửa, và xóa các biến toàn cục; đặt tên, giá trị, và kiểu giá trị (Auto, String, Number, Boolean, Array, Object). Các biến được giới hạn theo người dùng và tồn tại qua các lần thực thi. Tham chiếu chúng trong bất kỳ [expression](./expression-dsl.md) workflow nào dưới dạng `$global.variableName`. Các biến có thể được chia sẻ với người dùng khác hoặc [teams](./teams.md).

Xem thêm [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md), và [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Xem demo Variables</a></p>
### [Chat](../tabs/chat-tab.md)

Tab Chat là bề mặt agent chạy dài hạn của Heym để vận hành workspace từ hội thoại. Chọn một [credential](./credentials.md) và model, sau đó yêu cầu Chat trả lời câu hỏi, kiểm tra định nghĩa workflow, chạy các workflow hiện có, tóm tắt các execution và schedule, báo cáo lịch sử chạy của một workflow (số lần chạy, phân loại theo trạng thái, lần chạy cuối cùng và chi tiết của một lần chạy khi được yêu cầu), báo cáo những execution đang chạy ngay lúc này (kèm thời gian đã trôi qua, node hiện tại và liên kết đến từng lần chạy trực tiếp), giải quyết các human review đang chờ, tạo và chỉnh sửa workflow bằng chính AI Builder engine được dùng trong editor, hoặc thêm card vào kanban board bằng ngôn ngữ tự nhiên. Card mới luôn bắt đầu ở cột đầu tiên của board được chọn; khi có nhiều board khả dụng và không có board nào được chỉ định, Chat sẽ hiển thị lựa chọn board trước khi tạo card.

Chat tiếp tục chạy trên backend sau khi trình duyệt đóng. Trong khi câu trả lời đang được stream, bạn có thể gửi thêm tin nhắn; Heym lưu chúng vào hàng đợi dựa trên cơ sở dữ liệu, cho phép bạn chỉnh sửa hoặc xóa các tin nhắn đang chờ trước khi chúng bắt đầu, và chạy chúng theo thứ tự khi phản hồi hiện tại hoàn tất. Nếu assistant cần thêm chi tiết lập kế hoạch và trả về các câu hỏi làm rõ, hàng đợi sẽ tạm dừng cho đến khi bạn trả lời những câu hỏi đó, sau đó tiếp tục sau phản hồi lập kế hoạch.

Các phản hồi được stream với markdown, hình ảnh inline, workflow preview card, tool-call card có thể thu gọn, mức sử dụng context và tự động nén context. Chat hỗ trợ tệp đính kèm, nhập bằng giọng nói, phát lại đọc thành tiếng, thao tác sao chép, quick prompt, User Rules từ [Settings](./user-settings.md) và [global variables](./global-variables.md) làm context.

Xem thêm [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) và [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Xem demo Chat</a></p>

### [Credentials](../tabs/credentials-tab.md)

Tab Credentials quản lý API key và secret được các node sử dụng. Thêm credential theo loại (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, v.v.), đặt tên và tham chiếu chúng trong các workflow node. Chỉnh sửa hoặc xóa từ card; chia sẻ với người dùng qua email hoặc với [teams](./teams.md). Tất cả giá trị được mã hóa khi lưu trữ và được che trong UI.

Xem thêm [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) và [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Xem demo Credentials</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Tab Vectorstores quản lý các vector store được các node [RAG](../nodes/rag-node.md) sử dụng. Tạo một store với tên và một vector store [credential](./credentials.md) — *RAG: Qdrant + OpenAI* (Qdrant bên ngoài) hoặc *RAG: Psql + OpenAI* (Postgres của chính Heym thông qua pgvector), điều này cố định backend của store — tùy chọn đặt tên collection, sau đó tải lên tài liệu (PDF, TXT, v.v.). Quản lý nội dung (xem, xóa nguồn), chỉnh sửa chi tiết store và chia sẻ store với người dùng. Trong một node [RAG](../nodes/rag-node.md), chọn Database, chọn vector store và chạy các thao tác insert, upsert, delete hoặc search.

Xem thêm [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) và [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Xem demo Vectorstores</a></p>
### [MCP](../tabs/mcp-tab.md)

Tab MCP cấu hình tích hợp Model Context Protocol. Heym hỗ trợ hai chế độ:

**Máy chủ mặc định** – Một endpoint duy nhất tại `/api/mcp/sse` hiển thị tất cả các workflow được bật MCP. Xem và tạo lại API key của bạn, sao chép JSON client sẵn sàng sử dụng, kết nối Cursor chỉ với một cú nhấp, hoặc làm theo quy trình thiết lập Claude với đăng ký OAuth tự động.

**Máy chủ có tên** – Tạo nhiều endpoint MCP riêng biệt, mỗi endpoint có URL dựa trên UUID riêng (`/api/mcp/servers/{uuid}/sse`) và API key độc lập. Gán các workflow cụ thể cho từng máy chủ để các AI client hoặc nhóm khác nhau chỉ thấy những công cụ họ cần. Mỗi máy chủ có tên hỗ trợ cùng các phương thức xác thực (API key, Claude OAuth) và có các phím tắt Copy JSON và Add to Cursor riêng. Cả hai endpoint đều hỗ trợ SSE transport (GET) và Streamable HTTP transport (POST). Bật/tắt một workflow bên trong máy chủ có tên sẽ di chuyển nó lên đầu danh sách được gán để hàng đã thay đổi vẫn hiển thị trong tầm nhìn.

**Công cụ chat Heym** – Cả hai chế độ đều có thể hiển thị engine [Chat](../tabs/chat-tab.md) như một công cụ `heym_chat` duy nhất, được bật/tắt theo từng bề mặt với credential LLM và model riêng (được điền sẵn từ model ưa thích của bạn trong [Settings](./user-settings.md)). Một MCP client gửi một `message` ngôn ngữ tự nhiên và engine sẽ làm phần còn lại: xây dựng workflow ở chế độ build (lưu, chạy thử tối đa năm lần, sửa lỗi và xác minh), chạy workflow, phân tích, thực thi, trạng thái chạy trực tiếp, lịch trình, bảng và thẻ, nhóm, biến toàn cục, tìm kiếm tài liệu và các quyết định human-in-the-loop. Các khả năng được thêm vào Chat sau này đều có thể truy cập thông qua cùng công cụ đó mà không cần đăng ký thêm. Mỗi lần gọi được lưu trong lịch sử tab Chat dưới dạng cuộc hội thoại được đánh dấu plug và trả về một `conversation_id` mà client có thể truyền lại để tiếp tục luồng hội thoại.

Xem thêm [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) và [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Xem demo MCP</a></p>

### [Traces](../tabs/traces-tab.md)

Tab Traces hiển thị các trace thực thi [LLM](../nodes/llm-node.md). Phần tiêu đề thống kê phía trên danh sách tóm tắt khoảng thời gian đã chọn bằng các thẻ KPI (Calls, Tokens, Cost, Avg Latency, Error %) và ba biểu đồ — Tokens by Model, Cost by Model và Calls Over Time (xếp chồng thành công so với lỗi). Một bộ chọn **Time range** duy nhất (1h / 24h / 7d / 30d / All; mặc định 7 ngày) lọc cả biểu đồ và danh sách cùng nhau. Cost được tính từ [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) theo từng người dùng; các model không có giá sẽ hiển thị dưới dạng cảnh báo nội tuyến có liên kết đến bảng đó. Mở bất kỳ trace nào để xem payload yêu cầu và phản hồi, phân tích thời gian (llm_ms, tools_ms, mcp_list_ms), các lệnh gọi công cụ (tên, đối số, kết quả) và các skill được bao gồm. Các sự kiện được mở rộng hiển thị JSON—bao gồm cả payload MCP và JSON-RPC—dưới dạng cây có thể thu gọn với cấp đầu tiên được mở theo mặc định; **Tree / Raw** chuyển đổi trở lại văn bản gốc và JSON không hợp lệ vẫn có thể đọc được. Sử dụng traces để gỡ lỗi hành vi của [Agent Node](../nodes/agent-node.md) và [LLM](../nodes/llm-node.md) cũng như để sao chép hoặc xuất payload.

Xem thêm [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) và [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Xem demo Traces</a></p>
### [Cảnh báo](../tabs/alerts-tab.md)

Tab Cảnh báo định nghĩa các điều kiện ngưỡng trong một khoảng thời gian và thông báo cho bạn khi chúng bị vượt qua. Bốn loại cảnh báo bao quát các câu hỏi mà người vận hành thực sự đặt ra: **ngưỡng lỗi** (liệu điều này có thất bại nhiều hơn N lần trong khoảng thời gian không), **thời lượng workflow** (liệu các lần chạy có chậm hơn không, đo theo giá trị tối đa, trung bình hoặc p95), **chi phí token / USD** (liệu chi tiêu có vượt ngân sách không, được quy đổi qua cùng bảng giá như [Traces](../tabs/traces-tab.md)), và **số lần thực thi** (liệu điều này có chạy thường xuyên hơn mức nên có không). Mọi loại đều được đánh giá trong một khoảng thời gian bạn chọn, không bao giờ dựa trên một sự kiện đơn lẻ, bởi vì một lần chạy thất bại là nhiễu còn một đợt bùng phát là sự cố. Cảnh báo theo dõi một workflow hoặc mọi workflow mà bạn có thể truy cập.

Một wizard năm bước dẫn qua loại, phạm vi, điều kiện, phản hồi và xem xét. Bước Xem xét **backtest** điều kiện trước, báo cáo tần suất nó sẽ kích hoạt trong khoảng 24 giờ đến 7 ngày qua, để một ngưỡng quá thấp được phát hiện trước khi lưu thay vì sau khi nó gọi ai đó. Mô tả điều bạn muốn bằng ngôn ngữ tự nhiên và AI điền vào mọi bước mà nó có thể, đánh dấu các phỏng đoán của nó; một yêu cầu một phần vẫn đưa wizard tiến lên, mở ở bước đầu tiên vẫn cần quyết định thay vì bắt bạn bắt đầu lại. Theo mặc định, một cảnh báo kích hoạt một lần và giữ im lặng cho đến khi chỉ số phục hồi; bạn có thể thay vào đó để nó lặp lại theo một khoảng thời gian.

Ở bước phản hồi, một cảnh báo có thể tạo và gán một workflow mới để chạy khi nó kích hoạt, dùng một workflow bạn đã có, hoặc không làm gì. Payload kích hoạt mang theo giá trị quan sát được, ngưỡng, khoảng thời gian và các workflow đã đóng góp vào con số đó, đây là cách cảnh báo đến được Slack, email hoặc Telegram bằng các node bạn đã có. Lịch sử kích hoạt ghi lại những gì đúng tại thời điểm mỗi cảnh báo kích hoạt và được lưu trong 90 ngày; xác nhận một lần kích hoạt thay đổi huy hiệu từ Firing thành Acknowledged mà không giả vờ rằng điều kiện đã được giải quyết. Tab [Chat](../tabs/chat-tab.md) có thể trả lời những cảnh báo nào tồn tại và tại sao hoặc khi nào một cảnh báo kích hoạt. Cảnh báo có thể được chia sẻ với người dùng và [teams](../tabs/teams-tab.md).

Xem thêm [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md) và [Execution History](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

Tab Analytics hiển thị các chỉ số và xu hướng thực thi. Thống kê tóm tắt bao gồm tổng số lần thực thi, tỷ lệ thành công, tỷ lệ lỗi, phân tích độ trễ và tổng **Time Saved** (tổng số phút tiết kiệm ước tính của mỗi workflow cho mỗi lần chạy × số lần chạy thành công của nó). Most Used liệt kê cùng tổng đó theo từng workflow. Chọn một khoảng thời gian cơ sở (24h, 7d, 30d hoặc tất cả), tùy chọn lọc theo workflow, sau đó kéo qua bất kỳ biểu đồ nào để xem chi tiết trong một khoảng ngày đã chọn. Biểu đồ và bảng workflow làm mới theo lựa chọn, và tự động làm mới giữ các chỉ số được cập nhật. Nó bổ sung cho [Execution History](./execution-history.md) và chế độ xem [Scheduled](../tabs/scheduled-tab.md) khi bạn cần cả kết quả trong quá khứ lẫn các lần chạy sắp tới.

Xem thêm [Execution History](./execution-history.md), [Scheduled](../tabs/scheduled-tab.md) và [Evals](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Xem demo Analytics</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Tab Dashboard là một không gian kiểu Grafana nơi bạn xây dựng các lưới widget biểu đồ, mỗi widget được render từ workflow Heym ẩn riêng của nó. Giữ bao nhiêu dashboard tùy nhu cầu và chia sẻ từng cái với người dùng hoặc teams, chỉ đọc hoặc có thể chỉnh sửa; các widget luôn chạy với thông tin xác thực của chủ sở hữu, nên mọi người thấy cùng dữ liệu. Mô tả một chỉ số bằng ngôn ngữ tự nhiên và AI tạo widget, hoặc thêm thủ công và chọn loại biểu đồ, được xem trước với dữ liệu mẫu: bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text hoặc HITL. HITL là một carousel các đánh giá thủ công đang chờ của bạn. Tiêu đề hiển thị `1/n pending`. Tên workflow mở lần chạy đó trên canvas. **Approve**, **Request changes** và **Reject** giải quyết nó, và biểu tượng lịch sử bên cạnh tiêu đề widget mở lần chạy đó trong hộp thoại lịch sử trên cùng trang. Các widget lưu cache kết quả, có thể được tinh chỉnh bằng AI (mỗi thay đổi được lưu vào [Edit History](./edit-history.md)), được nhân bản cùng với workflow hoàn chỉnh của chúng, được sắp xếp lại bằng Tidy up, và được kéo hoặc thay đổi kích thước trong chế độ chỉnh sửa. Các bảng có thể hiển thị chip trạng thái và liên kết các hàng của chúng với bảng điều khiển chi tiết đọc bản ghi của hàng được nhấp dưới dạng `$page.record`, và một widget Run sẽ chạy workflow từ bảng điều khiển: trên tệp được kéo thả, với các trường input của nó, hoặc bằng nút Run. Vì mỗi widget là một workflow, bất kỳ dữ liệu nào bạn có thể lấy — một lệnh gọi [HTTP](../nodes/http-node.md), một truy vấn [BigQuery](../nodes/bigquery-node.md), một tra cứu [RAG](../nodes/rag-node.md) hoặc đầu ra [LLM](../nodes/llm-node.md) — đều có thể trở thành biểu đồ. Cài đặt của widget HITL có thể thu hẹp nó vào các đánh giá của một workflow duy nhất hoặc vào một bước phê duyệt của agent hoặc Slack trong đó; widget như vậy sẽ hiển thị chúng cho bất kỳ ai có thể mở workflow đó và bị ẩn đối với bất kỳ ai không thể.

Xem thêm [Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) và [Execution History](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Xem demo Dashboard</a></p>
### [Evals](../tabs/evals-tab.md)

Tab Evals (tại `/evals`) cho phép bạn tạo các bộ đánh giá, thêm hoặc sinh các test case, tối ưu prompt của bộ đánh giá và chạy đánh giá trên các workflow [Node Agent](../nodes/agent-node.md). Chọn một hoặc nhiều model, chọn phương pháp chấm điểm (Exact Match, Contains hoặc LLM-as-Judge), tùy chọn để một model riêng biệt hoặc một [Node Decision](../nodes/decision-node.md) đánh giá các câu trả lời LLM-as-Judge, đặt số lần chạy cho mỗi test (cùng với temperature và reasoning effort cho Exact Match và Contains), sau đó so sánh kết quả đạt/không đạt và đầu ra của từng model. Xem lại lịch sử chạy cho các đánh giá trước đó, bao gồm judge mà mỗi lần chạy đã sử dụng, chạy lại một lần với cùng judge, xuất nó dưới dạng JSON và kiểm tra chéo hành vi bên dưới trong [Traces](../tabs/traces-tab.md).

Xem thêm [Node Agent](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) và [Lịch sử thực thi](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Xem demo Evals</a></p>

### [Teams](../tabs/teams-tab.md)

Tab Teams cho phép bạn tạo và quản lý các team. Tạo một team, thêm thành viên bằng email và xóa thành viên (người tạo không thể bị xóa). Chia sẻ [workflow](../tabs/workflows-tab.md), [template](../tabs/templates-tab.md), [credential](../tabs/credentials-tab.md), [biến](../tabs/global-variables-tab.md), [vector store](../tabs/vectorstores-tab.md) và [tệp Drive](../tabs/drive-tab.md) với các team từ hộp thoại chia sẻ tương ứng của chúng; tất cả thành viên trong team đều được cấp quyền truy cập. Chỉnh sửa tên và mô tả của team hoặc xóa team (xóa tất cả các chia sẻ của team).

Xem thêm [Teams](./teams.md), [Chia sẻ Credential](./credentials-sharing.md) và [Tổ chức Workflow](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Xem demo Teams</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Tab Scheduled hiển thị tất cả các workflow [Cron](../nodes/cron-node.md) đang hoạt động trên một lịch trực quan. Chuyển đổi giữa chế độ xem ngày, tuần và tháng để xem khi nào các tự động hóa của bạn được lên lịch chạy, sau đó quay lại [workflow](../tabs/workflows-tab.md) liên quan khi bạn cần chỉnh sửa lịch trình.

Xem thêm [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) và [Lịch sử thực thi](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Xem demo Scheduled</a></p>

### [Logs](../tabs/logs-tab.md)

Tab Logs hiển thị log của các container Docker cho stack Heym (backend, frontend, PostgreSQL). Chọn (các) container, lọc theo mức log (All, INFO, WARNING, ERROR, DEBUG) và tìm kiếm trong log. Sử dụng nó để gỡ lỗi và khắc phục sự cố. Đối với log thực thi workflow (kết quả node, đầu ra), hãy sử dụng [Lịch sử thực thi](./execution-history.md), [Traces](../tabs/traces-tab.md) hoặc bảng Debug trong trình chỉnh sửa.

Xem thêm [Lịch sử thực thi](./execution-history.md), [Traces](../tabs/traces-tab.md) và [Tính năng Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Xem demo Logs</a></p>

### [DataTable](../tabs/datatable-tab.md)

Tab DataTable cho phép bạn tạo và quản lý các bảng dữ liệu có cấu trúc trong Heym. Định nghĩa các cột có kiểu (string, number, boolean, date, JSON), quản lý các hàng với chỉnh sửa trực tiếp bằng nhấp đúp, nhập/xuất CSV và chia sẻ bảng với người dùng hoặc [team](./teams.md) với quyền đọc/ghi. Sử dụng [Node DataTable](../nodes/datatable-node.md) để truy cập các bảng theo lập trình trong workflow. Một mục **System tables** được ghim ở đầu chứa **LLM Cost Table**: một chế độ xem có schema cố định về giá của từng model được nạp từ Helicone trong nền (TTL 24 giờ, làm mới thủ công), nơi mỗi người dùng có thể ghi đè giá hoặc thêm các hàng tùy chỉnh cho các model mà Helicone không liệt kê. Các quy tắc định giá này điều khiển KPI chi phí và biểu đồ chi phí theo từng model trên tab [Traces](../tabs/traces-tab.md).

Xem thêm [Node DataTable](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Cấu trúc Workflow](./workflow-structure.md) và [Teams](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Xem demo DataTable</a></p>
### [Drive](../tabs/drive-tab.md)

Tab Drive hiển thị tất cả các tệp được tạo bởi các skill trong workflow của bạn. Tab này liệt kê từng tệp với tên, loại, kích thước, node nguồn, ngày tạo và trạng thái chia sẻ nhóm, đồng thời cung cấp các điều khiển tìm kiếm, tải xuống có xác thực, chia sẻ, xóa và phân trang. Đây là bảng điều khiển đồng hành với [File Generation](./file-generation.md), tài liệu tham chiếu [Drive](./drive.md) và [Drive node](../nodes/drive-node.md).

Xem thêm [Drive](./drive.md), [File Generation](./file-generation.md) và [Drive node](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Xem demo Drive</a></p>

### [Cộng tác trên Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
