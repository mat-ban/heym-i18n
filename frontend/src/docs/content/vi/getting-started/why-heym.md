# Tại sao chọn Heym

Heym là hạ tầng để vận hành và quản trị các AI agent trong môi trường production. Một runtime tự lưu trữ (self-hosted) duy nhất đáp ứng mọi giai đoạn trong vòng đời của agent.

Một agent nguyên mẫu cần một model, một prompt và vài công cụ. Một agent production còn cần trigger và cơ chế thử lại, lưu trạng thái khi tạm dừng để chờ con người, ghi lại mọi lần gọi model và công cụ, chi phí cho mỗi lần chạy, kiểm thử trước khi phát hành thay đổi, và giới hạn rõ ràng về những gì agent được phép tự thực hiện. Heym lưu giữ tất cả những điều đó trong một nơi, để hệ thống bạn thiết kế trên canvas chính là hệ thống được vận hành. Xây dựng các hệ thống agentic, rồi vận hành chúng một cách tự tin.

## Một Runtime cho toàn bộ Vòng đời Agent

| Giai đoạn | Heym mang lại cho bạn |
|---|---|
| **Xây dựng** | Kết hợp các agent và bước xác định (deterministic) trên canvas, tạo chúng bằng [AI Assistant](../reference/ai-assistant.md), hoặc bắt đầu từ [Templates](../tabs/templates-tab.md) và các skill có thể di chuyển. |
| **Điều phối** | Phối hợp các agent, [sub-agent](../reference/agent-architecture.md), coding agent, RAG, tự động hóa trình duyệt và công cụ với luồng dữ liệu tường minh và [thực thi song song](../reference/parallel-execution.md). |
| **Vận hành** | Khởi chạy từ [webhook](../reference/webhooks.md), lịch trình và [trigger](../reference/triggers.md) sự kiện, với cơ chế thử lại theo từng node, [xử lý lỗi](../nodes/error-handler-node.md) và [phân phối tải](../reference/cluster.md) trên nhiều instance. |
| **Quan sát** | Kiểm tra mọi lần thực thi qua [lịch sử](../reference/execution-history.md), [LLM trace](../tabs/traces-tab.md), chi phí USD theo từng lần chạy, các lần chạy trực tiếp trên canvas, [phân tích](../tabs/analytics-tab.md), [cảnh báo](../tabs/alerts-tab.md) và xuất [OpenTelemetry](../reference/opentelemetry.md). |
| **Đánh giá** | Kiểm thử prompt và model dựa trên kết quả mong đợi trong [Evals](../tabs/evals-tab.md), với chấm điểm bằng LLM-as-Judge và so sánh model song song. |
| **Kiểm soát** | Giữ con người trong vòng kiểm soát với [điểm dừng phê duyệt](../reference/human-in-the-loop.md) và [guardrail](../reference/guardrails.md), đồng thời quản trị quyền truy cập bằng [credential](../reference/credentials.md) được mã hóa, [team](../reference/teams.md), [đăng nhập một lần](../reference/sso.md) và [nhật ký kiểm toán](../reference/audit.md). |
| **Công bố** | Cung cấp workflow qua REST và [SSE](../reference/sse-streaming.md), dưới dạng công cụ [MCP](../tabs/mcp-tab.md), dưới dạng giao diện chat [Portal](../reference/portal.md) và dưới dạng widget [dashboard](../tabs/dashboard-tab.md). |

## Xây dựng

### AI Assistant: Xây dựng Workflow bằng Ngôn ngữ Tự nhiên

[AI Assistant](../reference/ai-assistant.md) là một bảng chat nằm trong trình chỉnh sửa workflow. Hãy mô tả điều bạn muốn, ví dụ "tạo một workflow nhận đầu vào từ người dùng, tìm kiếm trong knowledge base của tôi và trả lời bằng GPT-4o", và trợ lý sẽ tạo ra các node cùng edge được áp dụng ngay lập tức lên canvas.

- Sử dụng credential LLM của chính bạn (bất kỳ model nào được hỗ trợ)
- Hỗ trợ **nhập bằng giọng nói** để thiết kế workflow không cần dùng tay
- Tự động áp dụng workflow JSON hợp lệ từ phản hồi của AI lên canvas
- Truyền phát phản hồi theo thời gian thực

Trợ lý hoạt động trực tiếp bên trong trình chỉnh sửa và truyền phát các node lên canvas theo thời gian thực, và mọi thứ nó tạo ra đều có thể chỉnh sửa như những node bạn tự đặt bằng tay.

### Hệ thống Skill

Skill là các gói năng lực có thể di chuyển, gồm một tệp hướng dẫn `SKILL.md` cùng các script Python tùy chọn, có thể được thả vào bất kỳ node Agent nào.

- Hướng dẫn của skill được thêm vào đầu system prompt của agent
- Các tệp Python trong skill trở thành công cụ có thể gọi được
- Skill có thể tái sử dụng giữa các workflow và chia sẻ dưới dạng tệp lưu trữ `.zip`

Điều này tương tự như trao cho agent của bạn cả bản mô tả công việc lẫn hộp công cụ chỉ trong một lần thả.

### Workflow Analyzer: Phản hồi dựa trên lần chạy

Bảng [Workflow Analysis](../reference/workflow-analysis.md) là công cụ tài liệu hóa và phản hồi dựa trên lần chạy được tích hợp sẵn trong trình chỉnh sửa. Nhấp vào **Analyze**, chọn credential LLM và model, Heym sẽ tạo một báo cáo Markdown có thể chỉnh sửa cho workflow hiện tại.

Khác với một ghi chú tĩnh, trình phân tích trước tiên sẽ chạy workflow khi có thể và đưa kết quả thực thi vào prompt. Báo cáo bao gồm các điểm cần cải thiện, mục đích của workflow và giải thích từng bước về những gì các node thực hiện. Khi báo cáo đã tồn tại, **Reanalyze** sẽ truyền phát một bản xem trước riêng để bạn có thể chấp nhận phiên bản mới hoặc giữ tài liệu chia sẻ hiện tại.

## Điều phối

### Các Node LLM và Agent Tích hợp sẵn

[Agent Node](../nodes/agent-node.md) của Heym vận hành một vòng lặp gọi công cụ được tích hợp chặt chẽ với các công cụ Python nội tuyến, kết nối MCP và hệ thống skills có thể di chuyển, tất cả đều được thiết kế cho các agent trong môi trường production.

[LLM node](../nodes/llm-node.md) thông thường của Heym cũng vượt xa một bước prompt-response đơn lẻ. Đối với các endpoint OpenAI và OpenAI-compatible được hỗ trợ, node có thể chuyển sang **chế độ Batch API** để một node gửi một mảng các prompt trong một yêu cầu batch gốc của nhà cung cấp với chi phí thấp hơn. Canvas sau đó hiển thị một nhánh `batchStatus` chuyên dụng, được kích hoạt khi batch di chuyển qua các trạng thái như `pending`, `processing` và `completed`.

Điều đó có nghĩa là LLM node có thể làm hai việc cùng lúc:

- Chạy yêu cầu batch chính và trả về kết quả cuối cùng cho từng mục trên nhánh thông thường
- Kích hoạt logic thông báo hoặc ghi log trên mỗi cập nhật trạng thái batch quan trọng mà không cần biến luồng thành một vòng lặp polling tùy chỉnh

Thực thi batch là một primitive workflow LLM hạng nhất, với các kiểm tra khả năng của nhà cung cấp và model trong giao diện node.

**Agent Node** là cốt lõi của việc điều phối agent trong Heym:

- **Gọi công cụ** – Agent lặp qua các lệnh gọi công cụ trong một vòng lặp cho đến khi tạo ra câu trả lời cuối cùng
- **Công cụ Python** – Định nghĩa các công cụ tùy chỉnh nội tuyến bằng Python đầy đủ; agent gọi chúng tại thời điểm chạy
- **Kết nối MCP** – Kết nối tới bất kỳ máy chủ [Model Context Protocol](https://modelcontextprotocol.io/) nào (stdio hoặc SSE) và agent sẽ tự động nhận được tất cả công cụ của nó
- **Skills** – Thả một tệp `.zip` hoặc `.md` vào một agent để mở rộng ngữ cảnh hệ thống và thêm công cụ Python
- **Gọi sub-workflow** – Agent có thể gọi các workflow Heym khác như công cụ, kết hợp các hành vi phức tạp mà không cần code tùy chỉnh

Xem [Agent Node](../nodes/agent-node.md) và [Agent Architecture](../reference/agent-architecture.md) để có tài liệu tham khảo đầy đủ.

### Điều phối Đa Agent

Heym hỗ trợ **mô hình orchestrator** với các primitive trực quan hạng nhất:

- Một agent đóng vai trò **orchestrator** (`isOrchestrator: true`) và được cấp một công cụ `call_sub_agent`
- Nó ủy thác nhiệm vụ cho các **sub-agent** được đặt tên trên cùng canvas
- Các sub-agent có thể tự gọi các agent khác hoặc sub-workflow (độ sâu tối đa: 5)
- **Thực thi song song**: Khi orchestrator gọi nhiều sub-agent trong một lượt, chúng chạy song song để có kết quả nhanh hơn

Điều này cho phép các kiến trúc như một agent lập kế hoạch định tuyến công việc tới một researcher, một coder và một summarizer, tất cả được kết nối trực quan mà không cần code điều phối tùy chỉnh.

Xem [Agent Architecture](../reference/agent-architecture.md) để biết chi tiết thực thi.

### Coding Agent như các Node Workflow

Heym cung cấp hai node chạy một coding agent thực sự như một bước workflow, không phải một chat completion:

- **[Codex Node](../nodes/codex-node.md)** – Chạy OpenAI Codex CLI trong một workspace Heym biệt lập trên một kho GitHub. Hỗ trợ **Sign in with ChatGPT** (PKCE OAuth trên gói Plus/Pro của bạn, không tốn chi phí API theo token) hoặc một access token, clone repo, cho phép Codex chỉnh sửa code, và trả về `summary`, `diff`, `changedFiles` và một `pullRequestUrl` nháp.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Cùng quy trình repository thông qua gateway OpenCode không phụ thuộc nhà cung cấp (Kimi, DeepSeek, Qwen, và nhiều hơn nữa), được thực thi trong một **container dùng một lần được tăng cường bảo mật**: loại bỏ mọi capability, root chỉ đọc, giới hạn pid/memory/CPU. GitHub token được giữ bên ngoài sandbox: Heym thực hiện mọi thao tác git và GitHub ở phía host, nên code được tạo ra không thể đánh cắp thông tin xác thực push.

Điều đó có nghĩa là một workflow có thể phân loại một bug từ webhook, giao repo cho một coding agent, chờ PR nháp, và đăng liên kết lên Slack, hoàn toàn tự động, với các giới hạn tài nguyên có thể cấu hình theo từng triển khai.

### Pipeline RAG Tích hợp sẵn

Heym bao gồm một [RAG / Vector Store Node](../nodes/rag-node.md) và một tab [Vectorstores](../tabs/vectorstores-tab.md) được quản lý. Bạn có thể:

- Chọn backend vector của bạn: **Qdrant** (máy chủ bên ngoài) hoặc **Postgres (pgvector)**, lưu trữ vector trong cơ sở dữ liệu của chính Heym mà không cần chạy thêm dịch vụ nào
- Chèn tài liệu vào một vector store trực tiếp từ một node workflow
- Thực hiện tìm kiếm ngữ nghĩa và đưa kết quả vào một LLM hoặc Agent node
- Tham chiếu kết quả bằng các biểu thức như `$ragNode.results.map("item.payload.content").join("\n\n")`

Trong Heym, RAG là hai node với toàn quyền kiểm soát embeddings và truy xuất.

### Tự động hóa Trình duyệt với Playwright

[Playwright node](../nodes/playwright-node.md) là tính năng tự động hóa trình duyệt first-party trên canvas.

- **Chế độ Steps** – Kết hợp các hành động navigate, click, type, fill, screenshot, extract và scroll một cách trực quan
- **AI steps với auto-heal** – Mô tả một hành động bằng ngôn ngữ tự nhiên và một LLM tạo ra các hành động Playwright; các selector thất bại có thể được tự động sửa chữa, và các bước được tạo có thể được cache để bỏ qua các lệnh gọi LLM trong tương lai
- **Chế độ Run Code** – Chuyển node sang Playwright Python đầy đủ cho các luồng phức tạp (bị tắt theo mặc định; chạy trong sandbox được tăng cường bảo mật của Heym khi được bật)
- **Phiên đã xác thực** – Khôi phục cookies/`storageState` trước khi chạy, xác minh đăng nhập bằng kiểm tra selector, và dự phòng bằng các bước đăng nhập theo script
- **Thu thập mạng** – Tùy chọn thu thập các phản hồi JSON, headers, cookies và bộ nhớ trình duyệt cùng với kết quả

Heym coi trình duyệt như một node bình thường với cùng các biểu thức, thông tin xác thực và xử lý lỗi như mọi thứ khác.

### Expression DSL

[Expression DSL](../reference/expression-dsl.md) của Heym cung cấp một cú pháp rõ ràng và mạnh mẽ để tham chiếu dữ liệu từ các node phía trước:

- `$input.text` – Dữ liệu của Input node
- `$nodeName.field` – Trường output của bất kỳ node nào phía trước
- `$global.variableName` – Các biến toàn cục lâu dài
- Các helper cho mảng: `.first()`, `.map("field")`, `.join("\n")`

Expression hoạt động trong mọi trường chuỗi, bao gồm prompt, HTTP header, điều kiện và giá trị set, nhờ đó dữ liệu được truyền giữa các bước một cách tường minh. DSL cân bằng giữa sức mạnh và tính dễ đọc mà không yêu cầu kiến thức JavaScript đầy đủ.

## Run

### Trigger, Retry và Error Path

Một workflow có thể bắt đầu từ nhiều nơi. Các node [Input](../nodes/input-node.md) nhận HTTP [webhook](../reference/webhooks.md), [Cron](../nodes/cron-node.md) chạy theo lịch, và các [trigger](../reference/triggers.md) sự kiện khởi chạy run từ Telegram, Discord, Slack, hộp thư IMAP, luồng WebSocket, hàng đợi RabbitMQ, file tải lên và các sự kiện của nền tảng Heym.

Các lỗi được xử lý ngay trong graph. Bất kỳ node nào cũng có thể retry khi thất bại với số lần thử được đặt trước và thời gian chờ giữa các lần thử; mỗi lần thử đều được ghi lại trong [execution history](../reference/execution-history.md), và node [Error Handler](../nodes/error-handler-node.md) sẽ tự động chạy khi một node thất bại, nhờ đó việc khôi phục là một phần của chính workflow.

### Thực thi DAG song song

Bộ thực thi workflow của Heym sử dụng bộ lập lịch directed acyclic graph (DAG). Các node độc lập chạy song song tự động, không cần cấu hình.

- Các node ở cùng mức phụ thuộc được điều phối đồng thời tới một thread pool (`max_workers=8`)
- Ngay khi một node hoàn thành, các node phía sau nó được lên lịch
- [Merge Node](../nodes/merge-node.md) kết hợp kết quả của các nhánh song song
- Nhiều run của workflow thực thi đồng thời; mỗi run hoàn toàn độc lập

Tính song song là hành vi mặc định, được quyết định bởi cấu trúc graph.

Xem [Parallel Execution](../reference/parallel-execution.md).

### Mở rộng quy mô qua nhiều instance

Trỏ một instance Heym thứ hai vào cùng cơ sở dữ liệu PostgreSQL và nó sẽ tham gia như một worker. Các run chạy nền được chia sẻ giữa các instance theo trọng số bạn đặt; một leader được bầu chọn sẽ duy trì lịch chạy, đánh giá cảnh báo và khôi phục sau sự cố xuyên suốt quá trình failover, và mỗi run đều ghi lại instance đã thực thi nó. Xem [Load Distribution](../reference/cluster.md).

### Bảng Kanban dạng Agentic

[Tab Board](../tabs/board-tab.md) là một bảng Kanban tích hợp sẵn, nơi chính các cột thực thi workflow. Một card là một công việc agentic lâu dài mang theo ngữ cảnh, lịch sử hội thoại, trạng thái thực thi, output và các run của workflow.

- **Chuỗi workflow theo cột** – Di chuyển một card vào một cột sẽ kích hoạt chuỗi workflow của cột đó; một **Agentic Kanban Model** (credential + model của bạn) ánh xạ nội dung card thành input của workflow và chuyển output trở lại thành văn bản dễ đọc
- **Tệp đính kèm của card** – Kéo thả file vào một card; tài liệu được trích xuất thành văn bản và hình ảnh được truyền tới các model có khả năng xử lý thị giác trước mỗi run
- **Canvas run trực tiếp** – Mở run đang hoạt động bên trong một card và theo dõi nó thực thi trên canvas workflow thực, từng node một
- **Chia sẻ theo nhóm** – Chia sẻ board với người dùng hoặc nhóm với quyền đọc/ghi; các chuỗi trên board được chia sẻ sẽ chạy bằng credential của chủ sở hữu, nhờ đó cộng tác viên không cần credential riêng
- **Khả năng hiển thị lỗi** – Các card thất bại sẽ hiển thị chỉ báo lịch sử lỗi, và các run tiếp theo có thể tạm dừng để chờ bình luận

Board là một bề mặt gốc của nền tảng: card, workflow, credential và các run trực tiếp đều nằm trong một nơi.

### Heym Drive: Lưu trữ file tích hợp sẵn

[Tab Drive](../tabs/drive-tab.md) là một kho lưu trữ file được tích hợp vào nền tảng. Các file được tạo ra bởi skill và workflow (PDF, DOCX, CSV, hình ảnh) tự động được lưu tại đó, và tệp đính kèm của card trên board cũng được lưu trữ ở đó.

- **Liên kết chia sẻ** – Liên kết tải xuống công khai hoặc được bảo vệ bằng mật khẩu (Basic Auth) với tùy chọn ngày hết hạn và giới hạn số lần tải xuống tối đa
- **Chia sẻ theo nhóm** – Chia sẻ file ở chế độ chỉ đọc với các nhóm của bạn, và xóa toàn bộ chia sẻ nhóm chỉ bằng một thao tác
- **Thao tác hàng loạt** – Chọn nhiều mục bằng cách shift-click theo dải, gộp các mục đã chọn thành một file ZIP để tải xuống, hoặc áp dụng một thiết lập chia sẻ/mật khẩu/xóa cho nhiều file cùng lúc
- **Truy cập cho agent** – Skill có thể chọn bật để đọc file trên Drive, nhờ đó agent có thể làm việc trên các tài liệu do bạn hoặc các workflow khác tạo ra

Các artifact được tạo ra sẽ có một nơi lưu trữ lâu dài, có thể chia sẻ ngay trong nền tảng.

## Observe

### LLM Traces

[Tab Traces](../tabs/traces-tab.md) cung cấp khả năng quan sát đầy đủ cho mọi lần gọi LLM:

- Payload của request và response
- Thời gian từng lần gọi: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Tên, đối số và kết quả của tool call
- Các skill được truyền tới model

Hệ thống trace được thiết kế riêng cho việc debug hành vi agentic, với đầy đủ payload của request và response cùng thời gian từng lần gọi.

### Theo dõi chi phí Token LLM

Mọi lệnh gọi LLM trong Heym đều được tính chi phí tự động. [Tab Traces](../tabs/traces-tab.md) hiển thị số lượng token đầu vào và đầu ra theo từng trace cùng với chi phí USD theo thời gian thực được tính từ bảng giá đã đồng bộ.

- **Chi phí theo từng trace** – Token đầu vào, token đầu ra và tổng USD hiển thị trên mỗi dòng trace
- **Phân tích chi phí** – Các thẻ KPI và biểu đồ chi phí theo từng model cập nhật theo khoảng thời gian đã chọn (1h / 24h / 7d / 30d / Tất cả)
- **Bảng chi phí LLM** – Một bảng hệ thống trong [tab DataTable](../tabs/datatable-tab.md) được khởi tạo từ Helicone mỗi 24 giờ; bạn có thể ghi đè giá hoặc thêm dòng tùy chỉnh cho các model chưa được liệt kê
- **Cảnh báo thiếu giá** – Các trace của model không có mục giá sẽ hiển thị cảnh báo nội tuyến kèm liên kết trực tiếp đến bảng chi phí

Mỗi lần thực thi đều mang chi phí USD riêng, được phân tách theo model.

### Mở các Production Run trên Canvas trực tiếp

Một workflow production vẫn có thể kiểm tra được sau khi nó khởi chạy bên ngoài editor. Mở bất kỳ mục **Running** nào từ một trong hai hộp thoại History, hoặc mở run đang hoạt động bên trong một thẻ Agentic Kanban, và Heym sẽ gắn editor workflow thông thường vào đúng lần thực thi đó.

- Các node đã hoàn thành sẽ xuất hiện với kết quả của chúng ngay lập tức
- Node hiện tại và các node phía sau đang chờ tiếp tục nhấp nháy khi quá trình thực thi tiến triển
- Bảng Debug nhận được cùng kết quả node tăng dần như một run được khởi chạy từ canvas
- Kết quả cuối cùng và các điểm nhấn thực thi xuất hiện mà không cần polling hay khởi chạy một run trùng lặp
- Đóng editor chỉ ngắt kết nối trình quan sát; không bao giờ hủy workflow production

Trình quan sát sử dụng SSE được hỗ trợ bởi snapshot thực thi xuyên worker, nên nó hoạt động với các trigger webhook, schedule, chat, MCP, integration và Board ngay cả khi một backend worker khác đang sở hữu run đó.

### OpenTelemetry, Phân tích và Cảnh báo

Heym phát ra các span [OpenTelemetry](../reference/opentelemetry.md) cho mọi lần chạy workflow, thực thi node và lệnh gọi công cụ Agent, được xuất qua OTLP/HTTP đến Jaeger, Grafana Tempo, Honeycomb, Datadog hoặc bất kỳ backend tương thích nào khác.

Tab [Analytics](../tabs/analytics-tab.md) theo dõi số lần chạy, tỷ lệ thành công, thời lượng và xu hướng theo từng workflow. [Alerts](../tabs/alerts-tab.md) theo dõi số lỗi, thời lượng chạy, chi tiêu token hoặc USD và khối lượng thực thi trong một khoảng thời gian, sau đó chạy một workflow thông báo do bạn chọn, để cảnh báo có thể đến Slack, email, Telegram hoặc bất kỳ nơi nào mà một node có thể đến.

## Đánh giá

### Evals tích hợp sẵn

[Tab Evals](../tabs/evals-tab.md) cho phép bạn định nghĩa các bộ kiểm thử và chạy chúng với các workflow agent của bạn:

- Tạo các test case với đầu vào và đầu ra mong đợi, hoặc sinh chúng từ prompt của bộ kiểm thử
- Chạy một bộ kiểm thử với nhiều model và so sánh đầu ra của chúng song song
- Chấm điểm bằng Exact Match, Contains hoặc LLM-as-Judge với một model giám khảo độc lập
- Xem lại đạt/không đạt, thực tế so với mong đợi và lịch sử chạy

Thay đổi một prompt hoặc một model, chạy lại bộ kiểm thử và so sánh kết quả trước khi thay đổi đó đến môi trường production.

## Kiểm soát

### Human-in-the-Loop (HITL)

Heym có hệ thống [Human-in-the-Loop](../reference/human-in-the-loop.md) tích hợp sẵn cho phép agent tạm dừng thực thi, yêu cầu con người xem xét và tiếp tục đúng từ nơi chúng đã dừng lại.

- **Checkpoint của Agent** – Bật `hitlEnabled` trên bất kỳ node Agent nào để cấp cho nó một công cụ `request_human_review`. Agent tự quyết định khi nào một quyết định cần con người giám sát và gọi công cụ với một bản tóm tắt và bản nháp.
- **URL review công khai** – Mỗi yêu cầu review tạo ra một liên kết dùng một lần an toàn tại `/review/{token}` (TTL 168 giờ). Người review có thể **chấp nhận**, **chỉnh sửa & tiếp tục** hoặc **từ chối** mà không cần đăng nhập.
- **Snapshot thực thi** – Workflow đóng băng toàn bộ trạng thái của nó (lịch sử hội thoại, biến, kết quả công cụ) để nó tiếp tục đúng từ nơi đã tạm dừng sau khi người review phản hồi.
- **Nhánh thông báo** – Một cổng ra `review` tùy chọn cho phép bạn nối một luồng thông báo (Slack, email, webhook) được kích hoạt khi có yêu cầu review.
- **Chính sách phê duyệt công cụ MCP** – Các hướng dẫn HITL bằng văn bản được diễn giải thành các phạm vi phê duyệt (`always` / `once` / `never`) để agent có thể tự động phê duyệt các công cụ rủi ro thấp và chuyển lên cấp cao hơn cho các công cụ rủi ro cao.
- **Nhiều checkpoint** – Một lần chạy agent duy nhất có thể tạm dừng để review nhiều lần; mỗi checkpoint là độc lập.

URL review công khai, chỉnh sửa-và-tiếp tục, phân nhánh thông báo và tiếp tục dựa trên snapshot đều hoạt động từ cùng một checkpoint của agent.

Xem [Human-in-the-Loop](../reference/human-in-the-loop.md) để có tài liệu tham khảo đầy đủ.

### Guardrails cho LLM

Heym có [Guardrails](../reference/guardrails.md) tích hợp sẵn trên cả node [LLM](../nodes/llm-node.md) và [Agent](../nodes/agent-node.md), để bạn có thể chặn nội dung không an toàn trước khi phản hồi của model đến các bước phía sau.

- **Công tắc an toàn ở cấp node** – Bật guardrails trực tiếp trên node tạo ra hoặc xử lý nội dung hướng đến người dùng
- **Phạm vi chính sách rộng** – Chặn bạo lực, ngôn từ thù địch, nội dung tình dục, NSFW/tục tĩu, quấy rối, hoạt động bất hợp pháp, yêu cầu dữ liệu cá nhân và các nỗ lực prompt injection
- **Phát hiện đa ngôn ngữ** – Áp dụng cùng các quy tắc an toàn cho tiếng Thổ Nhĩ Kỳ, tiếng Anh, tiếng Ả Rập, tiếng Tây Ban Nha và các ngôn ngữ khác
- **Dự phòng thuần workflow** – Khi một tin nhắn bị chặn, node sẽ ném ra một lỗi workflow có kiểu mà bạn có thể định tuyến qua một [Error Handler](../nodes/error-handler-node.md)

Chính sách an toàn nằm trực tiếp bên trong cấu hình LLM và Agent và cắm thẳng vào việc phân nhánh workflow và xử lý lỗi.

### Quyền truy cập, Thông tin xác thực và Kiểm toán

Agent hoạt động với thông tin xác thực thực tế, vì vậy quyền truy cập là một phần của quản trị. [Thông tin xác thực](../reference/credentials.md) được mã hóa khi lưu trữ, che giấu sau khi tạo và có thể chia sẻ với người dùng hoặc [nhóm](../reference/teams.md), và nhóm cũng chia sẻ workflow, biến, vector store và tệp Drive. [Đăng nhập một lần](../reference/sso.md) kết nối với bất kỳ nhà cung cấp OpenID Connect nào, bao gồm Okta, Entra ID, Keycloak, Auth0 và Google. [Nhật ký kiểm toán](../reference/audit.md) ghi lại mọi hành động liên quan đến bảo mật cùng với tác nhân, mục tiêu và kết quả, được truyền cùng nhật ký container của bạn đến bộ thu thập nhật ký hoặc SIEM mà bạn đang sử dụng.

### Tự lưu trữ, Bạn sở hữu dữ liệu của mình

Heym chạy trên hạ tầng của bạn. Workflow, thông tin xác thực, lịch sử thực thi và trace nằm trong cơ sở dữ liệu của riêng bạn, và các lệnh gọi model đi từ máy chủ của bạn đến nhà cung cấp bạn chọn, hoặc đến model bạn tự lưu trữ thông qua Ollama hoặc vLLM. Đối với các agent xử lý tài liệu nhạy cảm, dữ liệu khách hàng hoặc cơ sở tri thức độc quyền, đây thường là yêu cầu bắt buộc.

Heym được cấp phép theo **Giấy phép MIT với điều kiện Commons Clause**. Mã nguồn là source-available: bạn có thể sử dụng, chỉnh sửa và tự lưu trữ một cách tự do. Commons Clause hạn chế việc bán phần mềm, bao gồm cung cấp dịch vụ lưu trữ trả phí hoặc dịch vụ tư vấn/hỗ trợ mà giá trị của chúng chủ yếu xuất phát từ Heym. Để cấp phép thương mại, triển khai doanh nghiệp hoặc hỗ trợ chuyên nghiệp, hãy liên hệ [enterprise@heym.run](mailto:enterprise@heym.run).

## Phơi bày

### API và Streaming

Workflow có thể được gọi qua HTTP tại `/api/workflows/{workflow_id}/execute`, trả về JSON, và tại `/api/workflows/{workflow_id}/execute/stream`, truyền các sự kiện node dưới dạng Server-Sent Events trong khi quá trình chạy diễn ra. Cả hai đều chia sẻ xác thực cấp workflow, giới hạn tốc độ và bộ nhớ đệm phản hồi. Xem [Webhook](../reference/webhooks.md) và [SSE Streaming](../reference/sse-streaming.md).

### Tích hợp MCP (Model Context Protocol)

Heym có hỗ trợ [MCP](../tabs/mcp-tab.md) gốc ở cả hai phía:

- **Là client**: Các node Agent kết nối đến máy chủ MCP bên ngoài (Filesystem, Browserbase, công cụ tùy chỉnh) qua stdio hoặc SSE và tự động sử dụng các công cụ của chúng
- **Là server**: Các workflow có bật MCP trở thành công cụ trên máy chủ mặc định tại `/api/mcp/sse`, hoặc trên các máy chủ được đặt tên với URL và API key riêng, để Claude Desktop, Cursor và các MCP client khác có thể gọi trực tiếp các workflow Heym của bạn

Agent có thể sử dụng nhiều máy chủ MCP cùng lúc, và bất kỳ workflow nào cũng có thể trở thành công cụ cho một MCP client bên ngoài.

### Portal: Xuất bản Workflow dưới dạng giao diện Chat

Tính năng [Portal](../reference/portal.md) biến bất kỳ workflow nào thành giao diện chat công khai tại `/chat/{slug}`:

- Xác thực tùy chọn với thông tin xác thực theo từng người dùng
- Thực thi streaming (tiến trình node theo thời gian thực)
- Hỗ trợ tải tệp lên
- Lịch sử hội thoại nhiều lượt

Các nhóm triển khai công cụ nội bộ, chatbot hướng đến khách hàng và biểu mẫu hỗ trợ AI chỉ từ một workflow và một URL, không cần viết mã frontend.

### Dashboard được hỗ trợ bởi Workflow

[Tab Dashboard](../tabs/dashboard-tab.md) là bề mặt báo cáo do người dùng tự xây dựng, nơi mỗi widget biểu đồ được hỗ trợ bởi workflow Heym ẩn riêng của nó. Một widget có thể gọi API, truy vấn BigQuery, tìm kiếm RAG/vector store, chạy các bước LLM, biến đổi các hàng dữ liệu và kết thúc bằng [node Chart Output](../nodes/chart-output-node.md). Bạn có thể tạo widget thủ công, tạo chúng bằng AI, tinh chỉnh sau đó, lưu vào bộ nhớ đệm kết quả và sắp xếp lại lưới một cách trực quan.

## So sánh với các Công cụ Tự động hóa Workflow

Nhiều đội ngũ đến với Heym từ các công cụ tự động hóa workflow. Bảng dưới đây so sánh Heym với n8n, Zapier và Make.com về những khả năng quan trọng khi agent vận hành trong môi trường production, và các chú thích bên dưới dẫn chiếu tài liệu chính thức đằng sau so sánh này. Để xem chi tiết sâu hơn về từng công cụ, vui lòng tham khảo các trang so sánh tại [heym.run/compare](https://heym.run/compare).

| Khả năng | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Node LLM tích hợp sẵn | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + nhánh trạng thái | ✓ | hạn chế¹¹ | –¹¹ | hạn chế¹¹ |
| Node Agent tích hợp sẵn (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Điều phối đa agent | ✓ | ✓ | hạn chế | hạn chế |
| Node coding agent (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / vector store tích hợp sẵn | ✓ | ✓ | hạn chế¹ | plugin² |
| Đọc / ghi WebSocket | ✓ | hạn chế¹² | –¹³ | –¹⁴ |
| Trình tạo workflow bằng ngôn ngữ tự nhiên | ✓ | hạn chế³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Mở một lượt chạy đang diễn ra trên canvas trực tiếp | ✓ | hạn chế¹⁹ | hạn chế¹⁹ | –¹⁹ |
| Dashboard vận hành bằng workflow | ✓ | hạn chế¹⁷ | hạn chế¹⁷ | hạn chế¹⁷ |
| Bảng Kanban dạng agentic | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Hệ thống Skills cho agent | ✓ | – | – | – |
| File drive tích hợp sẵn (share link, team) | ✓ | hạn chế²² | hạn chế²² | –²² |
| Node tự động hóa trình duyệt (Playwright) | ✓ | hạn chế²³ | hạn chế²³ | –²³ |
| Kiểm tra LLM trace | ✓ | hạn chế⁴ | – | ✓ |
| Xuất tracing OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Theo dõi chi phí token LLM (USD) | ✓ | –¹⁵ | –¹⁵ | hạn chế¹⁵ |
| Eval tích hợp sẵn cho workflow AI | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | hạn chế⁶ | hạn chế⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | hạn chế⁸ |
| Nén ngữ cảnh tự động | ✓ | – | – | – |
| Thực thi DAG song song | ✓ | hạn chế⁹ | – | – |
| Có thể self-host, mã nguồn mở | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL cho dữ liệu động | ✓ | ✓ | hạn chế | ✓ |

> **Chú thích:** ¹ Zapier Knowledge Sources — không có vector store hay khả năng kiểm soát embedding nào được công khai. ² Make.com có các module Pinecone/Qdrant nhưng không có node RAG gốc. ³ n8n AI Workflow Builder chỉ là bản beta trên cloud với giới hạn credit. ⁴ n8n hiển thị các bước trung gian; muốn tracing đầy đủ cần dùng công cụ bên thứ ba. ⁵ n8n hỗ trợ phê duyệt tool-call của AI thông qua chat, email và các kênh cộng tác, nhưng không snapshot và resume toàn bộ quá trình thực thi như Heym. ⁶ Zapier Human in the Loop hỗ trợ phê duyệt và thu thập dữ liệu bên trong Zap, nhưng không phải là hệ thống checkpoint public-review, snapshot-resume. ⁷ Make.com cung cấp Human in the Loop dưới dạng ứng dụng Enterprise với các yêu cầu review và kết quả adjusted/approved/canceled, nhưng vẫn bị giới hạn theo gói và ít agent-native hơn. ⁸ n8n có node Guardrails chuyên dụng, Zapier có AI Guardrails trên các sản phẩm AI của mình, và Make.com có tài liệu về agent rules cùng các luồng review nhưng không có tính năng guardrails độc lập tương đương, nên Make được đánh dấu là limited. ⁹ n8n thực thi tuần tự theo mặc định; muốn chạy song song phải dùng workaround sub-workflow. ¹⁰ Sustainable Use License — miễn phí self-host cho mục đích nội bộ, hạn chế phân phối thương mại. ¹¹ Tính đến ngày 22 tháng 4 năm 2026, tài liệu chính thức của n8n mô tả HTTP batching và các pattern loop/wait thay vì một nhánh batch-status LLM gốc; tài liệu chính thức về ứng dụng ChatGPT của Zapier không liệt kê trigger nào và chỉ có API Request beta chung chung; còn trang tích hợp OpenAI chính thức của Make chỉ cung cấp các batch action như create/watch completed chứ không có node LLM phân nhánh theo status đúng nghĩa, do đó n8n/Make được đánh dấu là limited và Zapier được đánh dấu là unavailable cho pattern workflow cụ thể này. ¹² Tài liệu chính thức của n8n có đề cập node HTTP Webhook và HTTP Request cùng khả năng mở rộng bằng Code/custom/community, nhưng tôi không tìm thấy node WebSocket trigger/send của bên thứ nhất, nên n8n được đánh dấu là limited. ¹³ Tài liệu chính thức của Zapier đề cập inbound webhook và outbound webhook/API request chỉ qua HTTP, không có bước WebSocket trigger hay send gốc. ¹⁴ Tài liệu chính thức của Make đề cập các module Webhooks và module HTTP(S) request, nhưng tôi không tìm thấy module WebSocket trigger hay send gốc. ¹⁵ n8n không có tính năng theo dõi chi phí token LLM gốc; có các workflow workaround từ cộng đồng nhưng phải cài thủ công và gọi API sau khi thực thi (feature request vẫn đang mở tính đến tháng 5 năm 2026). Zapier không hiển thị số token hay chi phí USD theo từng lần thực thi cho người dùng; các bước AI chỉ tiêu tốn task. Bảng điều khiển credits của Make.com phản ánh một phần mức tiêu thụ token đối với AI do Make host (từ tháng 8 năm 2025) nhưng các kết nối dùng API key bên thứ ba được tính 1 operation = 1 credit mà không đếm token; không có bảng phân tích chi phí USD theo từng lần thực thi và theo model. ¹⁶ Heym phát ra các span OpenTelemetry gốc (một span cho mỗi lần chạy workflow cộng thêm một span cho mỗi node) qua OTLP/HTTP tới bất kỳ backend tương thích nào, với lan truyền W3C trace-context và không cần code instrumentation, được cấu hình qua các biến môi trường `HEYM_OTEL_*` và mặc định bị tắt. n8n có tích hợp OpenTelemetry tracing được ghi nhận trong tài liệu cho việc thực thi workflow và node. Zapier và Make.com không ghi nhận việc export OpenTelemetry cho các lần thực thi workflow/scenario của họ tính đến tháng 6 năm 2026. ¹⁷ n8n có tài liệu về bảng điều khiển Insights cho các chỉ số thực thi production, Zapier có tài liệu về Zap History cùng Task Usage, và Make.com có tài liệu về Scenario History; đây là các bề mặt giám sát/lịch sử, không phải các widget dashboard tùy chỉnh được hỗ trợ bởi logic workflow tùy ý như tab Dashboard của Heym. ¹⁸ Heym Workflow Analyzer chạy workflow khi có thể, đọc kết quả thực thi và tạo một báo cáo Markdown có thể chỉnh sửa và chia sẻ, bao quát các điểm cần cải thiện, mục đích và hành vi từng bước. n8n có tài liệu về AI Workflow Builder để tạo/tinh chỉnh/debug workflow, Zapier có tài liệu về AI troubleshooting cho các lần chạy Zap bị lỗi, và Make.com có tài liệu về scenario history cùng các bước suy luận của AI agent, nhưng tài liệu công khai của họ không mô tả cùng loại tài liệu phân tích workflow chia sẻ, nhận biết lần chạy như vậy. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) liệt kê các lần thực thi đang chạy và có thể tải dữ liệu từ một lần thực thi trước đó vào editor, trong khi [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) hiển thị trạng thái running trong editor của nó. [Make Scenario History](https://help.make.com/scenario-history) có tài liệu về chi tiết lần chạy và log. Tài liệu công khai của họ, được kiểm tra ngày 18 tháng 7 năm 2026, không mô tả đúng luồng của Heym: mở một lần chạy production đang diễn ra bất kỳ từ History hoặc từ một thẻ Kanban, khôi phục snapshot node hiện tại của nó, và tiếp tục nhận animation node cùng Debug log trên cùng một canvas. ²⁰ Các node [Codex](../nodes/codex-node.md) và [OpenCode Go](../nodes/opencode-go-node.md) của Heym chạy một coding agent CLI thực sự trong workspace Heym biệt lập trên một repository GitHub — clone, chỉnh sửa, tạo diff, push branch, mở pull request — như một bước workflow hạng nhất. Tính đến ngày 20 tháng 7 năm 2026, không có đối thủ nào có tài liệu tương đương: [node OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) của n8n chỉ bao quát các lệnh gọi chat/assistant API, không phải coding agent cấp repository, và hỗ trợ Codex gốc vẫn là yêu cầu từ cộng đồng; blog của chính Zapier mô tả chiều ngược lại — [Codex điều khiển các công cụ Zapier thông qua Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — chứ không phải Codex như một bước trong Zap; các module OpenAI của Make.com cung cấp completions/assistants/batch action, không phải coding agent clone repo và mở PR. ²¹ [Tab Board](../tabs/board-tab.md) của Heym là một bảng Kanban agentic tích hợp sẵn, trong đó các cột thực thi workflow và các thẻ mang theo context, lịch sử hội thoại, trạng thái thực thi và các lần chạy. n8n ([tích hợp Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([tích hợp Kanban Tool](https://zapier.com/apps/kanbantool/integrations)), và Make.com ([tích hợp Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) chỉ kết nối tới các ứng dụng kanban bên thứ ba như Kanban Tool, Wekan hay NocoDB; không có bên nào có tài liệu về một bảng tích hợp sẵn tự chạy workflow của chính nó, tính đến ngày 20 tháng 7 năm 2026. ²² n8n lưu trữ dữ liệu nhị phân của lần thực thi ở nội bộ (tùy chọn trên [lưu trữ ngoài tương thích S3](https://docs.n8n.io/hosting/scaling/external-storage/)) nhưng không có tài liệu về một file drive hướng người dùng với share link hay chia sẻ nhóm, nên được đánh dấu là limited. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) của Zapier chỉ xử lý file trong suốt thời gian chạy Zap và [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) chỉ lưu các giá trị văn bản nhỏ, nên Zapier được đánh dấu là limited. [data stores](https://help.make.com/l6du-data-stores) của Make.com lưu các bản ghi có cấu trúc và [xử lý file](https://help.make.com/working-with-files) của nó truyền file giữa các ứng dụng mà không có lưu trữ tích hợp sẵn lâu dài, nên Make được đánh dấu là unavailable. ²³ [Node Playwright](../nodes/playwright-node.md) của Heym là tự động hóa trình duyệt của bên thứ nhất với chế độ bước trực quan, các bước do AI tạo và chế độ full-code. n8n chỉ cung cấp các gói cộng đồng như [n8n-playwright](https://github.com/toema/n8n-playwright) với [feature request cho node tự động hóa trình duyệt gốc](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796) vẫn đang mở, nên được đánh dấu là limited. Zapier Agents có thể [duyệt và đọc trang thông qua web browsing và tiện ích Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) nhưng Zapier không có tài liệu về bước tự động hóa trình duyệt theo script, nên được đánh dấu là limited. Make.com có tài liệu về các module HTTP và ứng dụng scraping bên thứ ba chứ không có module tự động hóa trình duyệt gốc nào, tính đến ngày 20 tháng 7 năm 2026.

## Liên quan

- [Giới thiệu](./introduction.md) – Tổng quan về nền tảng
- [Bắt đầu nhanh](./quick-start.md) – Xây dựng workflow đầu tiên của bạn
- [Phân tích Workflow](../reference/workflow-analysis.md) – Tạo báo cáo workflow dùng chung theo từng lần chạy và phản hồi cải tiến
- [Tab Dashboard](../tabs/dashboard-tab.md) – Xây dựng dashboard dựa trên workflow với các widget biểu đồ do AI tạo
- [Node Agent](../nodes/agent-node.md) – Node LLM với gọi công cụ, MCP và skills
- [Kiến trúc Agent](../reference/agent-architecture.md) – Sub-agent, orchestrator và điều phối công cụ
- [Tab Board](../tabs/board-tab.md) – Bảng Kanban dạng agentic với các cột thực thi workflow
- [Node Codex](../nodes/codex-node.md) – Chạy coding agent OpenAI Codex trên một repo GitHub
- [Node OpenCode Go](../nodes/opencode-go-node.md) – Coding agent không phụ thuộc nhà cung cấp trong container được gia cố
- [Tab Drive](../tabs/drive-tab.md) – Lưu trữ tệp tích hợp với liên kết chia sẻ, nhóm và thao tác hàng loạt
- [Node Playwright](../nodes/playwright-node.md) – Tự động hóa trình duyệt chính chủ với các bước AI và chế độ code
- [Node RAG / Vector Store](../nodes/rag-node.md) – Tìm kiếm vector và chèn tài liệu (Qdrant hoặc Postgres pgvector)
- [Trợ lý AI](../reference/ai-assistant.md) – Trình xây dựng workflow bằng ngôn ngữ tự nhiên
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Điểm kiểm tra của agent với URL đánh giá công khai
- [Guardrails](../reference/guardrails.md) – Chặn các prompt không an toàn trước khi chúng đến mô hình của bạn
- [Tab Traces](../tabs/traces-tab.md) – Khả năng quan sát các lệnh gọi LLM
- [Tab Evals](../tabs/evals-tab.md) – Bộ kiểm thử cho workflow AI
- [Tab Alerts](../tabs/alerts-tab.md) – Cảnh báo theo ngưỡng về lỗi, thời lượng, chi phí và khối lượng lần chạy
- [Tracing OpenTelemetry](../reference/opentelemetry.md) – Xuất span của lần chạy, node và công cụ qua OTLP
- [Phân phối tải](../reference/cluster.md) – Chia sẻ các lần chạy giữa các instance với chuyển đổi dự phòng leader
- [Đăng nhập một lần](../reference/sso.md) – Đăng nhập qua bất kỳ nhà cung cấp OpenID Connect nào
- [Ghi nhật ký kiểm toán](../reference/audit.md) – Các hành động liên quan đến bảo mật với actor, target và kết quả
- [Portal](../reference/portal.md) – Xuất bản workflow dưới dạng giao diện chat công khai
- [Thực thi song song](../reference/parallel-execution.md) – Thực thi đồng thời dựa trên DAG
- [Tab MCP](../tabs/mcp-tab.md) – Cấu hình MCP server và client
