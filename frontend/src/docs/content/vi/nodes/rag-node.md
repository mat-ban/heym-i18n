# RAG / Kho lưu trữ vector

Node **RAG / Vector Store** thực hiện chèn, upsert, xóa và tìm kiếm tài liệu trong một vector store cho Retrieval Augmented Generation (RAG). Sử dụng node này để bổ sung ngữ cảnh cho LLM bằng các tài liệu liên quan, và để giữ ngữ cảnh đó đồng bộ với hệ thống nguồn của các tài liệu.

Node có một dropdown **Database** để chọn backend:

- **Qdrant** – lưu trữ vector trong một máy chủ Qdrant bên ngoài (yêu cầu credential *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – lưu trữ vector bên trong cơ sở dữ liệu Postgres của chính Heym, không cần dịch vụ bên ngoài (yêu cầu credential *RAG: Psql + OpenAI*).

Mặc định là **Qdrant** để đảm bảo tương thích ngược. Việc thay đổi Database sẽ lọc danh sách **Vector Store** để chỉ hiển thị các store được hỗ trợ bởi database đó. Cả hai backend đều hỗ trợ cùng các thao tác, lọc metadata và xếp hạng lại bằng Cohere.

Mỗi backend cũng có thể được truy cập thông qua credential *RAG: Custom Embeddings*, thay thế OpenAI bằng bất kỳ endpoint embedding tương thích OpenAI nào và đặt tên cho vector store riêng của nó. Một store được tạo từ credential như vậy sẽ xuất hiện dưới Database mà nó nhắm tới. Xem [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend vector store (mặc định: `"qdrant"`) |
| `vectorStoreId` | UUID | Vector store từ tab [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Loại thao tác (còn có `operation`) |
| `documentContent` | expression | Văn bản tài liệu cần lưu trữ (insert, upsert) |
| `documentMetadata` | JSON string | Metadata cho tài liệu được lưu (insert, upsert); các giá trị hỗ trợ expression |
| `documentIdField` | string | Trường payload chứa id duy nhất (upsert, delete; mặc định `doc_id`) |
| `documentId` | expression | Giá trị của id duy nhất (upsert, delete) |
| `queryText` | expression | Truy vấn tìm kiếm (chỉ search) |
| `searchLimit` | number | Số kết quả tối đa (mặc định: 5) |
| `metadataFilters` | JSON string | Bộ lọc metadata cho tìm kiếm (các giá trị hỗ trợ expression) |
| `enableReranker` | boolean | Sử dụng Cohere để xếp hạng lại kết quả tìm kiếm |
| `rerankerCredentialId` | UUID | Credential Cohere cho việc xếp hạng lại |
| `rerankerTopN` | number | Số kết quả hàng đầu giữ lại sau khi xếp hạng lại |

## Các thao tác

### Insert

Thêm tài liệu vào vector store.

| Trường | Bắt buộc | Mô tả |
|-------|----------|-------------|
| `documentContent` | có | Văn bản cần embed và lưu trữ |
| `documentMetadata` | không | Đối tượng JSON, ví dụ: `{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expression trong metadata

Các giá trị metadata chấp nhận expression, vì vậy một tài liệu có thể được lưu trữ kèm ngữ cảnh từ lượt chạy:

```json
{ "url": "$start.url", "category": "faq" }
```

Các expression được resolve sau khi JSON được parse, không phải bằng cách thay thế văn bản vào đó, nên một giá trị chứa dấu ngoặc kép hoặc ký tự xuống dòng không thể làm hỏng cấu trúc đối tượng. Một giá trị là toàn bộ một expression sẽ giữ nguyên kiểu đã resolve — `{"count": "$start.count"}` lưu trữ một số, không phải `"7"` — điều này quan trọng vì `metadataFilters` trong tìm kiếm khớp theo đúng kiểu. Văn bản hỗn hợp như `"page $start.count"` sẽ resolve thành chuỗi, và các đối tượng lồng nhau cùng mảng cũng được duyệt qua.

Điều tương tự cũng áp dụng cho `upsert`, và cho `metadataFilters` của tìm kiếm: nó được parse trước và các giá trị của nó được resolve sau, theo cùng các quy tắc. Vì vậy một bộ lọc viết là `{"count": "$start.count"}` sẽ khớp với số mà một insert đã lưu, thay vì chuỗi `"7"`.

### Workflow nào đã lưu trữ một tài liệu

Một tài liệu được lưu trữ mà không có `source` riêng sẽ được đánh dấu bằng workflow đã lưu nó, dưới dạng `source: "workflow:<workflow name>"`. Tab [Vectorstores](../tabs/vectorstores-tab.md) nhóm các tài liệu đó dưới mục **Added workflow: _name_**, vì vậy nội dung của một store cho biết mỗi tài liệu đến từ đâu, và tài liệu của một workflow có thể được xóa theo nhóm. Việc tự đặt `source` trong `documentMetadata` luôn được ưu tiên hơn dấu đánh dấu tự động.

### Upsert

Chèn một tài liệu, hoặc thay thế tài liệu đã được lưu trữ dưới cùng id duy nhất.

Id là một trường **bên trong payload**, không phải point id nội bộ của store, vì vậy một tài liệu giữ nguyên định danh mà hệ thống của bạn đã sử dụng — id bản ghi CRM, SKU, slug trang. `documentIdField` đặt tên cho trường đó và `documentId` mang giá trị của nó.

| Trường | Bắt buộc | Mô tả |
|-------|----------|-------------|
| `documentId` | có | Id duy nhất của tài liệu (hỗ trợ expression) |
| `documentContent` | có | Văn bản cần embed và lưu trữ |
| `documentIdField` | không | Trường payload chứa id (mặc định `doc_id`) |
| `documentMetadata` | không | Đối tượng JSON, ví dụ: `{"source": "crm", "url": "$start.url"}` (các giá trị hỗ trợ expression) |

Mọi point có trường id khớp sẽ bị xóa trước, vì vậy một tài liệu trước đây được lưu trữ thành nhiều chunk sẽ được thay thế toàn bộ thay vì bị nhân bản. Trường id được ghi vào payload cho bạn, và point id vẫn ổn định qua các lần upsert cùng một tài liệu.

**Output:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — liệu một phiên bản hiện có đã bị thay thế hay chưa), `$nodeLabel.replaced_count`
### Xóa

Xóa một tài liệu theo cùng một unique id.

| Trường | Bắt buộc | Mô tả |
|-------|----------|-------------|
| `documentId` | có | Unique id của tài liệu (hỗ trợ biểu thức) |
| `documentIdField` | không | Trường payload chứa id (mặc định `doc_id`) |

**Output:** `$nodeLabel.deleted` – `true` khi có ít nhất một point khớp, `false` khi id
không có trong store. `$nodeLabel.deleted_count` cho biết có bao nhiêu point đã bị xóa.

Xóa một id không tồn tại không phải là lỗi: node thành công với `deleted: false`, vì vậy
một nhánh cleanup không cần guard phía trước.

### Tìm kiếm

Tìm kiếm ngữ nghĩa cho các tài liệu tương tự.

| Trường | Bắt buộc | Mô tả |
|-------|----------|-------------|
| `queryText` | có | Truy vấn tìm kiếm |
| `searchLimit` | không | Số kết quả tối đa (mặc định: 5) |
| `metadataFilters` | không | Lọc theo metadata (JSON object khớp chính xác, giá trị hỗ trợ biểu thức) |
| `enableReranker` | không | Bật Cohere reranking để tăng độ liên quan |
| `rerankerCredentialId` | khi reranking | Cohere credential |
| `rerankerTopN` | không | Số kết quả cuối cùng sau khi reranking |

**Output:** `$nodeLabel.results` – mảng `{ id, text, score, metadata }`

Khi reranking được bật:

- `$nodeLabel.reranked` trở thành `true`
- Mỗi kết quả cũng bao gồm `relevance_score`
- `score` vẫn là điểm tương đồng vector gốc
- `relevance_score` là điểm Cohere reranker

## Truy cập kết quả

- `$ragNode.results.first().text` – nội dung kết quả hàng đầu
- `$ragNode.results.first().score` – điểm tương đồng (0–1)
- `$ragNode.results.first().metadata.source` – metadata kết quả hàng đầu
- `$ragNode.results.map("item.text").join("\n\n")` – nối lại cho ngữ cảnh LLM
- `$ragNode.reranked` – liệu reranking có được áp dụng
- `$ragNode.count` – số kết quả trả về
- `$ragNode.replaced` – liệu một upsert có thay thế tài liệu hiện có
- `$ragNode.deleted` – liệu một thao tác xóa có xóa bất cứ thứ gì

## Ví dụ – Tìm kiếm

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Ví dụ – Chèn

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Ví dụ – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Ví dụ – Xóa

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## Liên quan

- [Tại sao chọn Heym](../getting-started/why-heym.md) – RAG tích hợp như một phần của agent runtime
- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Tab Vectorstores](../tabs/vectorstores-tab.md) – Tạo và quản lý vector store
- [Tích hợp bên thứ ba](../reference/integrations.md#qdrant) – Thiết lập credential Qdrant và Postgres (pgvector)
- [Node Agent](./agent-node.md) – Sử dụng kết quả RAG làm ngữ cảnh cho agent
- [Node LLM](./llm-node.md) – Đưa kết quả RAG vào system prompt của LLM
