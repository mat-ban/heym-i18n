# Node Agent

Node **AI Agent** là một node LLM có khả năng gọi công cụ (tool calling). Node này có thể chạy các công cụ Python, gọi các node trên canvas đã kết nối như công cụ, kết nối tới các MCP server, sử dụng skills, tùy chọn hoạt động như một orchestrator điều phối tới các node agent khác, gọi các workflow khác như công cụ, và tạm dừng để [con người xem xét](../reference/human-in-the-loop.md).

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1, cộng thêm `review` tùy chọn khi bật HITL |
| Đầu ra | `$nodeLabel.text`, `$nodeLabel.fieldName` (khi bật đầu ra JSON), hoặc payload HITL đang chờ trong lúc đợi xem xét |

## Các tham số cốt lõi

### Credential & Model

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential LLM (API key) từ Settings |
| `model` | string | Tên model (ví dụ: `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (tùy chọn) | Credential dự phòng khi credential chính gặp lỗi |
| `fallbackModel` | string (tùy chọn) | Model dự phòng khi model chính gặp lỗi |

Thêm credential trong tab [Credentials](../tabs/credentials-tab.md). Danh sách model được tải từ credential đã chọn. Nếu credential hoặc model chính trả về lỗi, node sẽ tự động thử lại với credential và model dự phòng trước khi báo lỗi.

### Prompts

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt cho AI. Hỗ trợ [expressions](../reference/expression-dsl.md). |
| `userMessage` | string | Tin nhắn/prompt của người dùng. Mặc định: `$input.text` |
| `jsonOutputEnabled` | boolean | Đầu ra JSON có cấu trúc |
| `jsonOutputSchema` | string | JSON Schema cho đầu ra có cấu trúc |
| `extraBodyEnabled` | boolean | Gửi các tham số request đặc thù của nhà cung cấp (mặc định: `false`) |
| `extraBody` | string | Đối tượng JSON được hợp nhất vào mọi API request mà agent thực hiện |

Sử dụng `$input.text`, `$nodeName.field`, và các cú pháp [Expression DSL](../reference/expression-dsl.md) khác.

### Các model suy luận (o1, o3)

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (mặc định: 0.7), dành cho các model tiêu chuẩn |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Độ sâu suy luận cho các model suy luận |

Khi sử dụng model suy luận (ví dụ: o1, o3), giao diện hiển thị **Reasoning Effort** thay vì Temperature. Đối với các model tiêu chuẩn, **Temperature** điều khiển mức độ sáng tạo.

**Ví dụ đầu ra JSON:** Khi bạn cần dữ liệu có cấu trúc từ agent (ví dụ: phân loại, trích xuất), hãy bật đầu ra JSON và cung cấp schema. Agent trả về JSON khớp với schema; truy cập các trường theo tên trên đầu ra của node:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Các node phía sau có thể sử dụng `$agentLabel.status`, `$agentLabel.reason`, v.v. Hành vi tương tự như đầu ra JSON của [node LLM](../nodes/llm-node.md).

## Con người xem xét (HITL)

Sử dụng HITL khi agent có thể cần phê duyệt tại những thời điểm cụ thể trước các hành động quan trọng.

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Thêm các điểm kiểm tra con người xem xét vào agent |
| `hitlSummary` | string | Hướng dẫn phê duyệt cho agent biết khi nào cần con người xem xét |

Khi bật HITL, agent nhận được một công cụ `request_human_review`. Sử dụng system prompt và
trường hướng dẫn này để giải thích những lệnh gọi công cụ, sub-agent, sub-workflow, hành động MCP, skill,
hoặc tác động phụ nào cần phê duyệt. Agent chỉ có thể gọi công cụ đó khi cần thiết, bao gồm nhiều
lần trong một lần chạy.

Phần tóm tắt dành cho người xem xét trên trang công khai được tạo từ yêu cầu xem xét của agent tại
thời điểm chạy. Nếu agent không cung cấp tóm tắt một cách rõ ràng, Heym sẽ tạo một tóm tắt từ nội dung
xem xét Markdown.

Đối với các công cụ MCP, Heym yêu cầu model diễn giải các hướng dẫn HITL mà bạn viết thành một trong ba
phạm vi: `always`, `once`, hoặc `never`. Điều đó có nghĩa là các cách diễn đạt tự do như "cho mỗi lần gọi", "chỉ
một lần", hoặc "không bao giờ hỏi" sẽ được chuẩn hóa trước khi áp dụng cơ chế kiểm soát lúc chạy.

Mỗi điểm kiểm tra HITL tạo ra một liên kết xem xét công khai dùng một lần tại `/review/{token}`. Người xem xét có thể:

- **Accept** (Chấp nhận) nội dung xem xét Markdown gốc
- **Edit & Continue** (Chỉnh sửa & Tiếp tục) với Markdown đã sửa đổi
- **Refuse** (Từ chối) và tiếp tục với `text: ""`

Khi bật HITL, node cũng hiển thị một cổng đầu ra `review` trên canvas. Kết nối nhánh đó tới Slack, email, hoặc các node thông báo khác nếu bạn muốn phát URL xem xét và tóm tắt ngay khi lần chạy tạm dừng.

Quá trình thực thi chuyển sang trạng thái `pending` cho đến khi người xem xét phản hồi. Nội dung xem xét là một thân Markdown duy nhất, và payload đang chờ cũng bao gồm văn bản liên kết có thể chia sẻ để bàn giao ra bên ngoài. Các node trên nhánh `review` chạy ngay khi việc tạm dừng được tạo; đường đầu ra bình thường chỉ tiếp tục sau khi được phê duyệt. Sau khi phê duyệt, Heym tiếp tục từ snapshot thực thi đã lưu và agent tiếp tục với ngữ cảnh đã được phê duyệt. Nếu một bước sau đó cũng cần phê duyệt, agent có thể tạo một điểm kiểm tra HITL khác. Xem [Human-in-the-Loop](../reference/human-in-the-loop.md) để biết cấu trúc payload, hành vi URL xem xét, và ngữ nghĩa tiếp tục.

HITL chỉ khả dụng cho đầu ra agent ở chế độ văn bản. Trong v1, nó không thể kết hợp với `jsonOutputEnabled`.
## Chế độ Orchestrator

Khi được bật, agent có thể ủy thác tác vụ cho các node agent khác trong workflow. Nếu **chế độ Orchestrator bị tắt**, agent **không thể tạo kết nối agent→agent** trên canvas.

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Khi là `true`, agent nhận được công cụ `call_sub_agent` |
| `subAgentLabels` | string[] | Nhãn của các node agent mà orchestrator này có thể gọi |

**Sub-agent** phải sử dụng `$input.text` trong User Message của chúng để nhận được prompt từ orchestrator.

Khi orchestrator gọi nhiều sub-agent trong một lượt, chúng sẽ thực thi song song. Xem [Kiến trúc Agent](../reference/agent-architecture.md) để biết chi tiết.

## Sub-Workflow

Khi được cấu hình, agent nhận được công cụ `call_sub_workflow` để thực thi các workflow khác.

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID của các workflow mà agent này có thể gọi như công cụ |

Chọn các workflow trong phần Sub-Workflows của cấu hình agent. Agent sẽ gọi chúng với `workflow_id` và `inputs` (object khớp với các trường đầu vào của workflow đích). Độ sâu tối đa: 5 lần gọi sub-workflow lồng nhau.

## Công cụ Node trên Canvas

Bạn có thể kết nối một node workflow được hỗ trợ với handle **tools** của agent để agent có thể gọi node đó tại thời điểm chạy. Điều này biến các hành động và phép biến đổi hiện có trên canvas thành các công cụ có thể gọi mà không cần viết Python.

Sử dụng công cụ node trên canvas khi bạn muốn agent tự quyết định thời điểm chạy một node đã được cấu hình, đồng thời vẫn giữ nguyên credential, các trường tĩnh và cài đặt riêng của workflow trong giao diện node.

### Các trường do agent cung cấp

Các trường trên một node công cụ được kết nối có thể được đánh dấu bằng biểu tượng bot. Các trường được đánh dấu sẽ trở thành tham số công cụ bắt buộc mà agent phải cung cấp khi gọi node. Các trường không được đánh dấu vẫn cố định và được đọc từ cấu hình node.

Ví dụ:

- Kết nối một node Slack với agent như một công cụ
- Giữ credential cố định trong node Slack
- Đánh dấu `message` là do agent cung cấp
- Agent nhận được công cụ Slack mà tại đó nó chỉ cung cấp message tại thời điểm chạy

Nếu node không được kết nối với agent như một công cụ, biểu tượng bot sẽ bị ẩn và node hoạt động như một bước workflow bình thường.

### Hành vi tại thời điểm chạy

Khi agent gọi một công cụ node trên canvas, Heym tạm thời hợp nhất các đối số do agent cung cấp vào dữ liệu của node đó, thực thi node, trả kết quả đầu ra của node về cho agent, sau đó khôi phục cấu hình node ban đầu. Các node công cụ không chạy như các bước workflow thông thường thông qua lập lịch thông thường; chúng chỉ chạy khi agent gọi chúng.

Công cụ node trên canvas hữu ích với các node tích hợp như Slack, Telegram, HTTP, Send Email và các node định hình dữ liệu như [Set](./set-node.md). Các node Trigger, node điều khiển luồng và các bộ ánh xạ đầu ra cuối ([bộ ánh xạ đầu ra JSON](./json-output-mapper-node.md), [bộ ánh xạ đầu ra HTML](./html-output-mapper-node.md)) không thể được sử dụng làm công cụ cho agent.

## Công cụ Python

Định nghĩa các công cụ tùy chỉnh mà agent có thể gọi. Mỗi công cụ có:

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `name` | string | Tên công cụ (ví dụ: `count_characters`) |
| `description` | string | Mô tả cho LLM |
| `parameters` | JSON Schema | Schema function-calling của OpenAI (định dạng object) |
| `code` | string | Mã hàm Python |

**Parameters** phải là một JSON object, không phải string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Công cụ ví dụ:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Công cụ Python chạy như mã không đáng tin cậy trong một Docker container biệt lập, được gia cố theo mặc định (không có mạng, không có Docker socket, hệ thống tệp chỉ đọc, không chạy với quyền root). Việc import bị giới hạn trong một danh sách cho phép các module thư viện chuẩn an toàn. Xem [Bảo mật → Sandbox công cụ Python](../reference/security.md#python-tool-sandbox) để biết cấu hình (`HEYM_PYTHON_TOOL_SANDBOX`).

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Số giây tối đa cho mỗi lần thực thi công cụ (mặc định: 30) |
| `requestTimeoutSeconds` | number | Số giây tối đa chờ mỗi phản hồi của model trước khi hết thời gian (mặc định: 60). Tăng giá trị này cho các nhà cung cấp chậm hoặc tự lưu trữ (LiteLLM, vLLM, model cục bộ) và các lần chạy nhiều bước kéo dài. |
## Kết nối MCP

Kết nối tới các máy chủ [Model Context Protocol](https://modelcontextprotocol.io/) để cung cấp các công cụ của chúng cho agent.

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Kiểu kết nối |
| `timeoutSeconds` | number | Thời gian chờ cho kết nối này (mặc định: 30) |
| `label` | string | Tên hiển thị tùy chọn |

**stdio** (tiến trình cục bộ):

| Trường | Mô tả |
|-------|-------------|
| `command` | Lệnh cần chạy (ví dụ: `npx`) |
| `args` | Mảng JSON (ví dụ: `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Đối tượng JSON chứa các biến môi trường được đưa vào tiến trình (ví dụ: `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Hầu hết các máy chủ stdio dùng API key đều xác thực thông qua biến môi trường thay vì tham số dòng lệnh. Hãy đặt `env` theo từng kết nối để mỗi node agent có thể dùng một credential khác nhau mà không cần thay đổi môi trường của máy chủ.

Giá trị `env` hỗ trợ [Expression DSL](../reference/expression-dsl.md), vì vậy bạn có thể truyền đầu vào của workflow làm credential thay vì mã hóa cứng các secret:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Biểu thức `$userInput.pat` được giải quyết tại thời điểm chạy dựa trên dữ liệu đầu vào của workflow trước khi tiến trình MCP khởi động. Điều này cho phép bạn nhận token từ trigger hoặc node đầu vào thay vì nhúng chúng vào định nghĩa workflow.

Ví dụ — GitHub MCP với token mã hóa cứng:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Ví dụ — GitHub MCP với token động từ đầu vào workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Ví dụ — GitHub MCP với credential GitHub của Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Credential GitHub tích hợp hiện hỗ trợ xác thực dựa trên PAT. Nếu bạn cần truy cập cấp tổ chức, hãy dùng PAT với các quyền tổ chức/kho lưu trữ cần thiết.

Ví dụ — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (máy chủ từ xa):

| Trường | Mô tả |
|-------|-------------|
| `url` | URL endpoint SSE. Hỗ trợ biểu thức (ví dụ: `$userInput.serverUrl`). |
| `headers` | Đối tượng JSON cho xác thực/header tùy chỉnh. Giá trị hỗ trợ biểu thức. |

**Streamable HTTP** (máy chủ từ xa):

| Trường | Mô tả |
|-------|-------------|
| `url` | URL endpoint MCP (ví dụ: `https://example.com/mcp`). Hỗ trợ biểu thức. |
| `headers` | Đối tượng JSON cho xác thực/header tùy chỉnh. Giá trị hỗ trợ biểu thức. |

## Skills

Skills là các hướng dẫn trong SKILL.md cùng với các tệp Python tùy chọn và tài nguyên đi kèm. Chúng mở rộng ngữ cảnh hệ thống của agent và có thể bổ sung các công cụ Python.

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `name` | string | Tên skill |
| `content` | string | Nội dung SKILL.md (hướng dẫn) |
| `timeoutSeconds` | number | Thời gian chờ cho việc thực thi Python của skill (mặc định: 30) |
| `driveFilesEnabled` | boolean | Bật helper `heym_drive` tại thời điểm chạy cho skill này (mặc định: false) |
| `files` | array | Các mục `{ path, content, encoding, mimeType }` tùy chọn (ví dụ: script `.py` hoặc tài nguyên nhị phân được lưu dưới dạng base64) |

Có thể thêm skill bằng cách kéo thả tệp `.zip` hoặc `.md` vào khu vực Skills.
Sau khi mở rộng một thẻ skill, hãy kéo thả bất kỳ tệp nào vào skill đó để đính kèm hoặc thay thế một tệp đi kèm, bao gồm cả tài nguyên nhị phân như PDF và hình ảnh.
Dùng nút tải xuống trên thẻ skill để xuất skill đó dưới dạng tệp lưu trữ `.zip` nhằm sao lưu hoặc tái sử dụng trong workflow khác.

Chỉ bật **Drive files** trên một skill khi mã Python của nó cần đọc tệp từ Heym Drive. Các skill được bật sẽ nhận được helper `heym_drive.py` được tạo tại thời điểm chạy và có thể gọi `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text`, hoặc `read_drive_base64` với id tệp Drive hoặc tên tệp chính xác. Việc tra cứu theo tên tệp sử dụng kết quả khớp mới nhất có thể truy cập. Các skill bị tắt sẽ không nhận được helper.

Mỗi thẻ skill có bốn hành động trên hàng bên dưới tiêu đề:

| Nút | Mô tả |
|--------|-------------|
| **Edit with AI** | Mở Skill Builder để chỉnh sửa skill từ prompt trò chuyện |
| **Download** | Xuất skill dưới dạng tệp lưu trữ `.zip` |
| **Remove** | Xóa skill khỏi node agent này |
| **History** | Mở lịch sử skill được dẫn xuất từ [Edit History](../reference/edit-history.md) |
### Lịch sử Skill

Lịch sử Skill **không** được lưu trữ riêng biệt. Nó được suy ra từ các snapshot trong Edit History của workflow: mỗi phiên bản workflow đã lưu đều bao gồm toàn bộ mảng `skills` của agent node.

Từ hộp thoại History, bạn có thể:

- **Preview** một snapshot trong quá khứ (SKILL.md và danh sách file)
- **Edit** — tải một snapshot vào trình chỉnh sửa skill mà không cần khôi phục toàn bộ workflow
- **AI Fine-tune** — mở Skill Builder với snapshot đó làm điểm khởi đầu
- **Revert** — chỉ khôi phục skill này từ một phiên bản trong quá khứ (các node khác giữ nguyên)

Lịch sử tuân theo cùng thời gian lưu trữ 7 ngày như Edit History của workflow. Việc lưu workflow sau khi chỉnh sửa skill sẽ tạo ra các mục lịch sử mới.

Phần Skills cũng bao gồm **AI Build**:

- Nhấp vào **AI Build** để tạo một skill mới từ prompt trò chuyện
- Nhấp vào nút sparkle trên một skill hiện có để chỉnh sửa nó bằng AI
- Kéo thả file vào prompt composer để đính kèm chúng vào bình luận fine-tune; những file đó cũng được lưu dưới dạng tài sản skill đi kèm
- Modal sẽ stream văn bản của trợ lý trong khi hiển thị trực tiếp bản xem trước file `SKILL.md` và `.py`
- **Download ZIP** xuất bản xem trước hiện tại mà không thêm nó vào node
- **Save & Add** lưu các file đã tạo trở lại thông qua cùng luồng phân tích ZIP được sử dụng khi tải lên thủ công

Khi chỉnh sửa bằng AI, Heym chỉ gửi các file skill văn bản `.md` và `.py` đến builder. Các tệp đính kèm nhị phân và không thể chỉnh sửa khác được giữ nguyên và chia sẻ với builder dưới dạng metadata đường dẫn để mã Python được tạo có thể giữ tham chiếu file tương đối chính xác.
Chọn một file đã đính kèm trong bảng điều khiển bên phải và bật **Include this file in AI context** khi AI cần kiểm tra một template đi kèm. Các file văn bản, PDF và DOCX được trích xuất vào ngữ cảnh prompt khi có thể; Heym không áp dụng giới hạn kích thước tệp đính kèm riêng cho Skill Builder ngoài giới hạn kích thước body yêu cầu của nền tảng.

## Extra Body

Một số nhà cung cấp chấp nhận các tham số yêu cầu mà các trường tương thích OpenAI tiêu chuẩn không
bao phủ, chẳng hạn như vô hiệu hóa chế độ suy nghĩ của model. Đánh dấu **Send extra request body** trong thuộc tính node
và nhập một đối tượng JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Mặc định bị tắt.** Khi checkbox tắt, không có gì thêm được gửi đi.
- Được áp dụng cho **mọi** yêu cầu trong vòng lặp gọi công cụ, không chỉ lượt đầu tiên, cộng với
  lần thử model dự phòng. Không được áp dụng cho các kiểm tra guardrail, vốn sử dụng một model riêng.
- Phải là một **đối tượng** JSON. Một mảng, một giá trị vô hướng, hoặc văn bản sai định dạng sẽ làm node thất bại với
  `Invalid extra body JSON` thay vì bị âm thầm bỏ qua.
- Các biểu thức `$` được giải quyết trước khi phân tích. Vì đây là thay thế văn bản, một giá trị đã giải quyết
  chứa dấu ngoặc kép hoặc ký tự xuống dòng sẽ tạo ra JSON không hợp lệ và làm node thất bại.

Cùng trường và hành vi như extra body của [LLM node](./llm-node.md).

## Guardrails

Bật **Guardrails** trong thuộc tính node để chặn các tin nhắn người dùng không an toàn trước khi agent chạy. Xem [Guardrails](../reference/guardrails.md) để biết tài liệu tham khảo đầy đủ.

## Bộ nhớ liên tục (đồ thị)

Đồ thị tri thức **theo từng agent node** tùy chọn được lưu trữ trong cơ sở dữ liệu. Khi được bật, Heym sẽ thêm một bản tóm tắt Markdown về các thực thể và mối quan hệ đã ghi nhớ vào **system instruction** trước mỗi lần chạy (chỉ khi đồ thị không rỗng). Sau khi agent hoàn thành **thành công**, một tác vụ nền sẽ trích xuất các sự kiện bền vững mới từ cuộc trò chuyện và hợp nhất chúng vào đồ thị.

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Bật tải + trích xuất nền cho canvas node này |

Các **Sub-agent** giữ đồ thị **riêng** của chúng (được khóa theo node id của chúng), tách biệt với orchestrator.

Sử dụng nút điều khiển **brain** màu hồng trên node (khi bộ nhớ được bật hoặc hàng model được hiển thị) để mở trình chỉnh sửa đồ thị và tùy chọn **chia sẻ bộ nhớ** (các workflow/agent khác). Hành vi đầy đủ, các đường dẫn REST và chi tiết xuất JSON: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API và tính liên tục của suy luận

Một checkbox **Use Responses API** sẽ định tuyến các lệnh gọi model của agent thông qua
[Responses API](https://platform.openai.com/docs/api-reference/responses) thay vì Chat
Completions. Nó mặc định bị tắt.

Nó đặc biệt quan trọng trên một reasoning model như `gpt-5` hoặc dòng `o`. Responses API trả về
suy luận của model song song với mỗi lệnh gọi công cụ, và agent đưa các mục suy luận đó trở lại
ở lượt tiếp theo, để model giữ được chuỗi suy nghĩ của nó xuyên suốt vòng lặp công cụ nhiều bước thay vì
suy luận lại sau mỗi kết quả công cụ. Toàn bộ vòng lặp chạy trên cùng một đường dẫn, bao gồm
[human review](#human-review-hitl) tạm dừng và tiếp tục, [context compression](#context-compression),
và câu trả lời cuối cùng.

Bản thân cuộc trò chuyện vẫn ở trong Heym. Heym gửi toàn bộ đầu vào ở mỗi lượt và mang theo
suy luận dưới dạng một blob được mã hóa, vì vậy không có gì được lưu giữ ở phía nhà cung cấp giữa các lệnh gọi.
Các mục suy luận bên trong một span mà context compression tóm tắt sẽ bị loại bỏ cùng với nó, vì
một blob được mã hóa không thể được tóm tắt.

Nó hoạt động với một credential OpenAI, và với một credential tùy chỉnh mà gateway của nó hỗ trợ
endpoint. Với một credential Google, nó vẫn bị tắt.
## Nén ngữ cảnh

Khi một agent thực hiện nhiều vòng lặp công cụ với kết quả lớn (thu thập dữ liệu web, đọc tài liệu, đầu ra của sub-workflow), lịch sử tin nhắn tích lũy có thể tiến gần đến giới hạn cửa sổ ngữ cảnh của model. Heym tự động nén lịch sử hội thoại giữa chừng trong quá trình chạy để ngăn tràn ngữ cảnh.

**Cách hoạt động:**

1. Trước mỗi vòng lặp công cụ, Heym ước tính số lượng token hiện tại (~4 ký tự mỗi token).
2. Nếu ước tính vượt quá **80%** cửa sổ ngữ cảnh của model, quá trình nén được kích hoạt.
3. Lịch sử tin nhắn được chia thành phần được giữ lại và phần được nén:
   - **Giữ lại**: system prompt, tin nhắn người dùng đầu tiên, tin nhắn người dùng gần nhất
   - **Nén**: mọi thứ ở giữa (các lượt suy luận của assistant, lệnh gọi công cụ, kết quả công cụ)
4. Phần ở giữa được tóm tắt bằng **cùng model và credential** — không cần cấu hình thêm.
5. Bản tóm tắt đã nén thay thế phần ở giữa bằng một tin nhắn assistant duy nhất.

**Khả năng quan sát:**

Các sự kiện nén xuất hiện dưới dạng mục `Context compressed (N messages → summary)` trong:
- Danh sách lệnh gọi công cụ của **Debug panel** trong quá trình thực thi trực tiếp
- Chế độ xem chi tiết lần chạy trong **Execution history**
- **Traces tab** dưới dạng mục trace `context.compression`

Quá trình nén là tự động và luôn hoạt động đối với các node Agent. Nó **không** áp dụng cho các node LLM, tab Chat, hoặc các phiên AI Assistant.

## Liên quan

- [Tại sao chọn Heym](../getting-started/why-heym.md) – Cách các agent chạy và được quản trị trong môi trường production
- [Bộ nhớ liên tục của Agent](../reference/agent-persistent-memory.md) – Đồ thị tri thức cho mỗi node agent, chia sẻ tùy chọn, API, trình soạn thảo
- [Kiến trúc Agent](../reference/agent-architecture.md) – Sub-agent, orchestrator, skills, MCP, gọi công cụ
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Trang đánh giá công khai, các lần thực thi đang chờ, luồng phê duyệt/chỉnh sửa/từ chối
- [Guardrails](../reference/guardrails.md) – Chặn các danh mục nội dung không an toàn
- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [AI Assistant](../reference/ai-assistant.md) – Giao diện chat để xây dựng workflow bằng ngôn ngữ tự nhiên (khác với node Agent)
- [Expression DSL](../reference/expression-dsl.md) – Tham chiếu dữ liệu trong prompt
- [Cấu trúc Workflow](../reference/workflow-structure.md) – Node, cạnh và định dạng DSL
- [Bắt đầu nhanh](../getting-started/quick-start.md) – Workflow cơ bản với LLM và biểu thức
- [Tab Credentials](../tabs/credentials-tab.md) – Thêm API key cho agent
- [Tab MCP](../tabs/mcp-tab.md) – Cấu hình MCP cho các công cụ workflow
