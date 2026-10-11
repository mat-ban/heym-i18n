# LLM

Node **LLM** xử lý văn bản bằng mô hình ngôn ngữ hoặc tạo hình ảnh. Node hỗ trợ tạo văn bản, vision (đầu vào hình ảnh), tạo hình ảnh, đầu ra JSON có cấu trúc và thực thi **Batch API** gốc của nhà cung cấp cho các mô hình văn bản được hỗ trợ.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1, cộng thêm `batchStatus` tùy chọn khi bật chế độ batch |
| Đầu ra | `$nodeLabel.text` (văn bản), `$nodeLabel.image` (hình ảnh), hoặc các trường kết quả batch như `$nodeLabel.results` |

## Tham số

### Credential & Model

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | LLM credential từ [Credentials](../tabs/credentials-tab.md) |
| `model` | string | Tên mô hình (ví dụ: `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` cho hình ảnh) |
| `fallbackCredentialId` | UUID (tùy chọn) | Credential dự phòng khi credential chính gặp lỗi |
| `fallbackModel` | string (tùy chọn) | Mô hình dự phòng khi mô hình chính gặp lỗi |

Nếu credential hoặc mô hình chính trả về lỗi, node sẽ tự động thử lại với credential và mô hình dự phòng trước khi thất bại.

Heym cũng kiểm tra **khả năng batch** từ credential và mô hình đã chọn. Chế độ batch khả dụng cho:

- Credential OpenAI
- Credential Custom / tương thích OpenAI có endpoint cung cấp các API `/v1/files` và `/v1/batches` cần thiết

Nếu nhà cung cấp hoặc mô hình đã chọn không hỗ trợ thực thi batch, bảng Properties sẽ hiển thị trực tiếp điều đó và vô hiệu hóa toggle.

### Prompt (chế độ văn bản)

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt. Hỗ trợ [biểu thức](../reference/expression-dsl.md). |
| `userMessage` | string | Tin nhắn người dùng. Mặc định: `$input.text` |
| `temperature` | number | 0.0–2.0 (mặc định: 0.7) |
| `maxTokens` | number | Số token phản hồi tối đa (tùy chọn) |
| `requestTimeoutSeconds` | number | Số giây tối đa chờ phản hồi từ mô hình trước khi hết thời gian (mặc định: 60). Tăng lên cho các nhà cung cấp chậm hoặc tự lưu trữ (LiteLLM, vLLM, mô hình cục bộ). |

### Hình ảnh & Đầu ra

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Tạo văn bản hoặc hình ảnh |
| `imageInputEnabled` | boolean | Bao gồm hình ảnh với tin nhắn người dùng (vision) |
| `imageInput` | expression | Data URL Base64 hoặc URL hình ảnh |
| `jsonOutputEnabled` | boolean | Đầu ra JSON có cấu trúc |
| `jsonOutputSchema` | string | JSON Schema cho đầu ra có cấu trúc |
| `extraBodyEnabled` | boolean | Gửi các tham số yêu cầu riêng của nhà cung cấp (mặc định: `false`) |
| `extraBody` | string | Đối tượng JSON được hợp nhất vào body yêu cầu API |

### Mô hình suy luận (o1, o3)

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Bật cho các mô hình suy luận |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Độ sâu suy luận |

### Chế độ Batch

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Sử dụng Batch API gốc của nhà cung cấp thay vì thực thi yêu cầu đơn lẻ |

Chế độ batch chỉ khả dụng trên node **LLM**. Nó **không** áp dụng cho [Agent Node](./agent-node.md).

Khi bật chế độ batch:

- `outputType` phải giữ là `text`
- `imageInputEnabled` phải giữ là `false`
- `userMessage` phải phân giải thành một **mảng**
- mỗi phần tử mảng phải phân giải thành một chuỗi hoặc giá trị nguyên thủy

Ví dụ điển hình:

- `$input.items.map("item.text")`
- `$vars.promptList`

Nếu biểu thức phân giải thành một chuỗi đơn lẻ thay vì một mảng, quá trình chạy sẽ thất bại với lỗi xác thực trước khi cuộc gọi đến nhà cung cấp bắt đầu.

## Nhánh Batch Status

Khi bật chế độ batch, node LLM hiển thị thêm một output handle thứ hai: `batchStatus`.

Sử dụng nhánh đó cho thông báo, ghi log, tin nhắn Slack hoặc các tác dụng phụ trong khi batch vẫn đang chạy. Nhánh này kích hoạt mỗi khi trạng thái nhà cung cấp thay đổi có ý nghĩa, bao gồm các trạng thái đã chuẩn hóa như:

- `pending`
- `processing`
- `completed`
- `failed`

Payload của nhánh trạng thái khả dụng dưới dạng `$input` bên trong các node hạ nguồn và bao gồm:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Ví dụ edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Ví dụ status mapper:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Cấu trúc kết quả Batch

Khi hoàn thành thành công, đầu ra chính của LLM chứa:

- `$nodeLabel.text` – các văn bản thành công được nối lại
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – kết quả từng mục theo thứ tự ban đầu
- `$nodeLabel.usage`

Mỗi mục trong `$nodeLabel.results` bao gồm các trường như:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Khi bật **JSON output** cùng với chế độ batch, Heym phân tích từng mục thành công riêng biệt. Các đối tượng đã phân tích được hiển thị theo từng mục và được thu thập trên `parsedResults`.
## Responses API

Hộp kiểm **Use Responses API** định tuyến lệnh gọi của node thông qua
[Responses API](https://platform.openai.com/docs/api-reference/responses) thay vì Chat
Completions. Mặc định nó tắt, và node hoạt động giống nhau ở cả hai trường hợp: cùng prompt,
cùng schema đầu ra JSON, cùng cấu trúc kết quả.

Nó hoạt động với credential OpenAI, và với credential tùy chỉnh mà gateway hỗ trợ
endpoint, nên một thiết lập tự lưu trữ hoặc qua proxy cũng có thể dùng được. Với credential Google, nó vẫn
bị vô hiệu hóa, và không thể kết hợp với [Batch mode](#batch-status-branch) - bảng điều khiển node cho biết
credential đang ở trạng thái nào trước khi bạn chạy bất cứ thứ gì.

Nếu endpoint hóa ra không khả dụng tại thời điểm chạy, node sẽ thất bại với thông báo nêu rõ
nguyên nhân thay vì âm thầm chuyển sang phương án dự phòng, nên một node được cấu hình cho Responses API luôn
chạy trên nó. Để chủ động chuyển sang credential hoặc model khác, hãy dùng các trường **Fallback
Credential** và **Fallback Model**; chúng kế thừa hộp kiểm này, nên credential dự phòng
cũng cần hỗ trợ endpoint.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Khi dùng [Input](./input-node.md) cho prompt, hãy dùng `$userPrompt.body.text` trong `userMessage`

## JSON Output

Khi `jsonOutputEnabled` là true, LLM trả về JSON khớp với schema. Truy cập các trường qua `$nodeLabel.fieldName`.

## Extra Body

Một số nhà cung cấp chấp nhận các tham số yêu cầu mà các trường tương thích OpenAI tiêu chuẩn không
bao phủ, chẳng hạn như vô hiệu hóa chế độ thinking của model. Tích **Send extra request body** trong thuộc tính
node và nhập một đối tượng JSON. Nó được hợp nhất vào mọi yêu cầu API mà node này thực hiện.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Mặc định tắt.** Khi hộp kiểm tắt, không có gì thêm được gửi.
- Phải là một **đối tượng** JSON. Một mảng, một giá trị vô hướng, hoặc văn bản sai định dạng sẽ làm node thất bại với
  `Invalid extra body JSON` thay vì bị âm thầm bỏ qua.
- Nút **Format** bên cạnh hộp kiểm sẽ định dạng lại JSON, và chuyển đỏ hiển thị
  `Invalid` khi văn bản không phân tích được.
- Được áp dụng cho completion chính, lần thử model dự phòng, và các yêu cầu batch mode.
  **Không** được áp dụng cho image generation hoặc cho các kiểm tra guardrail, vốn dùng một cấu trúc
  yêu cầu khác và một model riêng.
- Các biểu thức `$` được giải quyết trước khi phân tích, nên `{"max_tokens": $prev.limit}` hoạt động. Bởi vì
  đây là thay thế văn bản, một giá trị được giải quyết chứa dấu ngoặc kép hoặc ký tự xuống dòng
  sẽ tạo ra JSON không hợp lệ và làm node thất bại.

## Ví dụ – Text

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Ví dụ – Batch text

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Ví dụ – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

Bật **Guardrails** trong thuộc tính node để chặn các tin nhắn người dùng không an toàn trước lệnh gọi LLM. Xem [Guardrails](../reference/guardrails.md) để có tài liệu tham chiếu đầy đủ.

## Liên quan

- [Agent Node](./agent-node.md) – LLM với tool calling
- [Why Heym](../getting-started/why-heym.md) – Vị trí của các bước LLM trong vòng đời agent
- [Guardrails](../reference/guardrails.md) – Chặn các danh mục nội dung không an toàn
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Expression DSL](../reference/expression-dsl.md) – Tham chiếu dữ liệu trong prompt
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Trình soạn thảo mở rộng với xem trước backend trực tiếp cho prompt
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm khóa API LLM
- [Quick Start](../getting-started/quick-start.md) – Workflow LLM cơ bản
