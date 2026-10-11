# Node gọi MCP

Node **MCP Call** gọi trực tiếp một công cụ [Model Context Protocol (MCP)](https://modelcontextprotocol.io) cụ thể, mà không cần LLM quyết định công cụ nào sẽ được gọi. Sử dụng node này khi bạn biết chính xác công cụ cần gọi và muốn thực thi một bước mang tính xác định.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.result` |

## Khi nào nên sử dụng

Sử dụng node MCP Call khi:
- Bạn biết chính xác công cụ MCP cần gọi tại thời điểm thiết kế
- Bạn không cần LLM để chọn giữa các công cụ
- Bạn muốn một giải pháp thay thế nhẹ nhàng, mang tính xác định cho node agent khi chỉ cần gọi một công cụ duy nhất

Sử dụng [Node Agent](./agent-node.md) thay thế khi LLM cần quyết định công cụ nào sẽ được gọi hoặc khi bạn cần suy luận nhiều bước.

> Node MCP Call **không thể** được kết nối với node agent như một công cụ.

## Cấu hình kết nối

Node kết nối với một MCP server duy nhất. Chọn một transport và điền các trường tương ứng.

### SSE / Streamable HTTP

| Trường | Mô tả |
|-------|-------------|
| `transport` | `sse` hoặc `streamable_http` |
| `url` | URL đầy đủ của MCP server (ví dụ: `https://mcp.example.com/sse`). Hỗ trợ biểu thức DSL. |
| `headers` | Đối tượng JSON chứa các HTTP header (ví dụ: `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Thời gian chờ cho mỗi kết nối tính bằng giây (mặc định: 30) |

### stdio

| Trường | Mô tả |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Tệp thực thi cần chạy (ví dụ: `npx`) |
| `args` | Mảng JSON chứa các đối số (ví dụ: `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Đối tượng JSON chứa các biến môi trường (ví dụ: `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Thời gian chờ cho mỗi kết nối tính bằng giây (mặc định: 30) |

## Chọn công cụ

1. Điền các trường kết nối.
2. Nhấp vào **Fetch Tools** — node sẽ kết nối với MCP server và liệt kê các công cụ khả dụng.
3. Chọn một công cụ từ dropdown.

**Bắt buộc phải chọn công cụ.** Node sẽ không thực thi nếu chưa chọn công cụ.

## Đối số

Sau khi chọn công cụ, node sẽ hiển thị một trường nhập liệu cho mỗi đối số được định nghĩa trong input schema của công cụ. Mỗi trường chấp nhận:
- Giá trị tĩnh: `10`
- Biểu thức DSL: `$userInput.body.text`

Các đối số bắt buộc được đánh dấu bằng `*`.

## Đầu ra

| Trường | Mô tả |
|-------|-------------|
| `$nodeLabel.result` | Kết quả của công cụ. Nếu phản hồi là JSON hợp lệ, đây là một đối tượng đã được phân tích. Ngược lại, đây là một chuỗi. |

## Ví dụ

Gọi công cụ `search` trên một SSE MCP server, truyền truy vấn của người dùng:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Truy cập kết quả ở các bước tiếp theo:

```
$searchCall.result.items   ← nếu kết quả là một đối tượng JSON
$searchCall.result         ← nếu kết quả là một chuỗi thuần
```

## Lưu ý

- Node sẽ phân giải các biểu thức DSL trong `url`, `headers`, `env` và tất cả các giá trị `toolArguments` trước khi gọi công cụ.
- `timeoutSeconds` ở cấp node áp dụng cho toàn bộ quá trình thực thi; `connection.timeoutSeconds` áp dụng cho chính phiên MCP.
- Nếu MCP server không khả dụng hoặc trả về lỗi, node sẽ thất bại và thông báo lỗi sẽ có sẵn trong workflow trace.
