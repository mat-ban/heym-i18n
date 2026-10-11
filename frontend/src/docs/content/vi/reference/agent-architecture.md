# Kiến trúc Agent

[Agent Node](../nodes/agent-node.md) hỗ trợ sub-agent, sub-workflow, canvas node tool, mô hình orchestrator, skill, kết nối MCP, tool calling, [bộ nhớ liên tục](./agent-persistent-memory.md) tùy chọn (theo từng canvas node, có thể chia sẻ tùy chọn cho các agent khác) và [human review](./human-in-the-loop.md) tùy chọn. Trang này mô tả kiến trúc.

## Sub-Agent

Sub-agent là các agent node mà orchestrator có thể gọi thông qua tool `call_sub_agent`.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agent**: Phải sử dụng `$input.text` trong User Message để nhận prompt từ orchestrator
- **Tool**: `call_sub_agent` với `sub_agent_label` (enum) và `prompt`
- **Giới hạn độ sâu**: Tối đa 5 lần gọi sub-agent lồng nhau

### Luồng thực thi

1. Orchestrator quyết định gọi một sub-agent
2. `_execute_sub_agent_tool` tìm agent đích theo label
3. Xây dựng `synthetic_inputs = {"input": {"text": prompt}}`
4. Chạy `_execute_agent_node` cho sub-agent
5. Kết quả được trả về cho orchestrator

### Thực thi Sub-Agent song song

Khi orchestrator trả về nhiều lệnh gọi tool `call_sub_agent` trong một lượt, chúng được thực thi **song song**. Ví dụ, nếu người dùng hỏi về "Paris" và orchestrator gọi cả `distanceAgent` và `foodAgent`, cả hai chạy đồng thời thay vì tuần tự.

- **Lợi ích**: Tổng thời gian xấp xỉ bằng sub-agent chậm nhất, không phải tổng của tất cả.
- **Gợi ý**: Khuyến khích orchestrator gọi nhiều sub-agent trong một lượt khi tác vụ yêu cầu.

## Sub-Workflow

Khi `subWorkflowIds` được cấu hình, agent có thể gọi các workflow khác thông qua tool `call_sub_workflow`.

- **Cấu hình**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Tool**: `call_sub_workflow` với `workflow_id` (enum) và `inputs` (object)
- **Giới hạn độ sâu**: Tối đa 5 lần gọi sub-workflow lồng nhau

### Luồng thực thi

1. Agent quyết định gọi một sub-workflow
2. `_execute_sub_workflow_tool` lấy workflow từ `workflow_cache`
3. Xây dựng `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Chạy `WorkflowExecutor.execute()` cho sub-workflow
5. Kết quả được trả về cho agent

Sub-workflow không thể tạm dừng cho HITL trong v1. Nếu một sub-workflow lồng nhau cố gắng chuyển sang trạng thái chờ review, quá trình thực thi sẽ thất bại thay vì tạm dừng bên trong lệnh gọi lồng nhau.

## Canvas Node Tool

Canvas node tool là các workflow node được kết nối với agent thông qua handle `tool-input`. Trong quá trình thiết lập agent, `_build_node_tool_schemas` quét các cạnh đó và thêm một schema tool tương thích OpenAI cho mỗi node được kết nối.

- **Nguồn tool**: `_source: "node_tool"`
- **Tên tool**: bắt nguồn từ label của node được kết nối, với hậu tố được thêm cho các trường hợp trùng lặp
- **Tham số tool**: được xây dựng từ `agentProvidedFields` của node
- **Trường cố định**: tất cả các trường của node không được liệt kê trong `agentProvidedFields` vẫn giữ nguyên trong cấu hình node

### Luồng thực thi

1. Agent quyết định gọi một node tool được kết nối
2. `_execute_node_tool` sao chép dữ liệu node
3. Các đối số do agent cung cấp được hợp nhất vào các trường đã cấu hình của node
4. `execute_node` chạy node đó một lần với lập lịch nhánh bị vô hiệu hóa
5. Dữ liệu node gốc được khôi phục
6. Đầu ra của node được trả về cho agent như kết quả tool

Các tool node bị loại khỏi lập lịch workflow thông thường để chúng không chạy hai lần. Chúng chỉ thực thi thông qua đường dẫn gọi tool của agent.

## Human-in-the-Loop

Khi `hitlEnabled` được đặt trên một agent, agent nhận được tool `request_human_review` mà nó có thể gọi tại các điểm kiểm tra phê duyệt cụ thể.

1. System prompt và hướng dẫn HITL của node cho agent biết những hành động nào cần phê duyệt
2. Khi agent đến một trong các bước đó, nó gọi `request_human_review`
3. Heym lưu một snapshot thực thi workflow và tạo một yêu cầu review công khai
4. Kết quả node được đánh dấu `pending` với một review URL
5. Handle `review` của agent được lập lịch ngay lập tức để các nhánh thông báo có thể chạy với payload đang chờ
6. Lập lịch thực thi chính dừng lại cho đến khi người review phản hồi
7. Khi `accept`, `edit` hoặc `refuse`, executor được xây dựng lại từ snapshot đã lưu
8. Agent đang tạm dừng tiếp tục với ngữ cảnh review đã được phê duyệt, hoặc thoát ngay lập tức khi `refuse`
9. Các node hạ nguồn tiếp tục sau khi agent được tiếp tục hoàn tất, mà không chạy lại nhánh `review`
10. Nếu một hành động sau đó cũng cần phê duyệt, agent có thể tạo một điểm kiểm tra HITL khác trong cùng lần chạy

Bản tóm tắt dành cho người review được tạo từ chính yêu cầu review, vì vậy trường của node có thể tập trung vào chính sách phê duyệt và thời điểm.

Điều này cho phép các agent workflow chờ phê duyệt bên ngoài trong khi vẫn bảo toàn lịch sử hội thoại, đầu ra node đã hoàn thành, trạng thái vòng lặp và ngữ cảnh runtime khác.

## Orchestrator Tool Executor

Custom tool executor định tuyến:

- **Lệnh gọi sub-agent** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Lệnh gọi sub-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas node tool** (`_source == "node_tool"`) → `_execute_node_tool`
- **Human review** (`_source == "hitl"`) → tạo một điểm kiểm tra HITL đang chờ
- **Các tool khác** → `_unified_tool_executor` (Python, MCP, skill tool)

Nó được sử dụng khi HITL được bật, khi `isOrchestrator` với `subAgentLabels` được đặt, hoặc khi `subWorkflowIds` được cấu hình.

## Skills

Skills mở rộng ngữ cảnh hệ thống của agent và có thể thêm các Python tool.

- **Cấu trúc**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Nội dung**: Được thêm vào đầu system instruction (nối với nhau bằng `---`)
- **Python tool**: Với mỗi skill có tệp `.py`, một tool `skill_{skill_name}` được thêm vào
- **Thực thi**: `skill_python_executor.py` chạy các script bằng `uv run python` trong một thư mục tạm; args dưới dạng JSON trên stdin, kết quả dưới dạng JSON trên stdout

Có thể thêm Skills bằng cách kéo thả tệp `.zip` hoặc `.md` vào vùng Skills trong cấu hình [Agent Node](../nodes/agent-node.md).

## MCP Client

MCP (Model Context Protocol) client kết nối tới các tool server bên ngoài.

- **Transport**: `stdio` (command + args) hoặc `sse` (url + headers)
- **Liệt kê tool**: `list_mcp_tools` → `ClientSession.list_tools()` → chuyển đổi sang định dạng function của OpenAI với `_source: "mcp"`
- **Thực thi**: `execute_mcp_tool` → `ClientSession.call_tool()` → kết quả qua `_extract_tool_result`

Cấu hình kết nối MCP trong [MCP Tab](../tabs/mcp-tab.md) hoặc trên `mcpConnections` của agent node.

## Tool Calling

Dịch vụ LLM chạy vòng lặp `execute_with_tools`:

1. **Kiểm tra nén ngữ cảnh** — trước mỗi vòng lặp, ước lượng mức sử dụng token và nén nếu cần (xem bên dưới)
2. Gọi model với `tools` và `tool_choice: "auto"`
3. Nếu có `tool_calls`: với mỗi call, chạy `tool_executor(tool_def, name, args, timeout)`
4. Thêm kết quả tool vào messages, lặp lại
5. Dừng khi không còn tool call nào hoặc đã đạt `max_tool_iterations`

### Tool Dispatch

`_unified_tool_executor` định tuyến theo `_source`:

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (mặc định) | `execute_tool` (Python code tool) |

Các tool sử dụng định dạng function-calling của OpenAI: `name`, `description`, `parameters` (JSON schema).

## Context Compression

Để ngăn tràn ngữ cảnh trên các agent chạy lâu dài, Heym tự động nén danh sách `messages` tích lũy trước mỗi vòng lặp tool.

### Thuật toán

1. **Ước lượng token**: `total_chars / 4` trên tất cả messages (nhanh, không cần tokenizer)
2. **Kiểm tra ngưỡng**: nếu `estimated_tokens < context_limit × 0.80`, bỏ qua nén
3. **Giới hạn ngữ cảnh**: thử `client.models.retrieve(model).context_window`; nếu không được thì dùng bảng tích hợp (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, v.v.); mặc định 128K
4. **Giữ lại anchor**: luôn giữ
   - Message `system` đầu tiên (danh tính và hướng dẫn của agent)
   - Message `user` đầu tiên (nhiệm vụ ban đầu)
   - Message `user` cuối cùng (hướng dẫn gần nhất)
5. **Tóm tắt phần giữa**: mọi thứ giữa message user đầu tiên và cuối cùng được tuần tự hóa và gửi tới cùng model với một prompt tóm tắt
6. **Tái tạo**: `[system, first_user, assistant(summary), last_user]`

Nén bị bỏ qua nếu có ít hơn 2 message user riêng biệt (không có phần giữa để tóm tắt) hoặc nếu lệnh gọi tóm tắt của LLM thất bại (fallback an toàn: trả về messages gốc).

### Khả năng quan sát

Mỗi sự kiện nén được ghi lại dưới dạng:
- Một mục `_context_compression` trong `tool_calls_collected` → hiển thị trong chi tiết lần chạy của Execution History
- Một sự kiện `on_tool_call` với `phase: "compression"` → hiển thị trong Debug panel dưới dạng `Context compressed (N messages → summary)`
- Một mục LLM trace `context.compression` → hiển thị trong Traces tab với ước lượng token trước/sau

Các tool call của agent cũng phát ra khả năng quan sát phong phú hơn:

- Các trường vòng đời cho từng call trên `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` tổng hợp trên kết quả agent (đếm theo status cộng với tổng/thời lượng tối đa); các mục `_context_compression` bị loại khỏi các phép đếm đó
- Các child span OpenTelemetry tùy chọn bật có tên `heym.agent.tool.execute` (xem [OpenTelemetry Tracing](./opentelemetry.md))
- Các payload `tool_calls` của LLM trace / execution-history được lưu trữ đều được redact và giới hạn kích thước; trạng thái resume HITL trực tiếp giữ nguyên bản gốc để khớp

## Related

- [Why Heym](../getting-started/why-heym.md) – Điều phối đa agent xuyên suốt vòng đời agent
- [Agent Node](../nodes/agent-node.md) – Cấu hình và tham số
- [Agent Persistent Memory](./agent-persistent-memory.md) – Knowledge graph theo từng agent node và chia sẻ giữa các peer
- [Human-in-the-Loop](./human-in-the-loop.md) – Liên kết review, payload đang chờ và hành vi resume
- [OpenTelemetry Tracing](./opentelemetry.md) – Span của Workflow, node và Agent tool
- [Node Types](./node-types.md) – Agent và các node liên quan
- [Parallel Execution](./parallel-execution.md) – Thực thi song song dựa trên DAG và sub-agent
- [MCP Tab](../tabs/mcp-tab.md) – Cấu hình kết nối MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` cho sub-agent
