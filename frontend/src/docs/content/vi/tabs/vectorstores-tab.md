# Tab Vectorstores

Tab **Vectorstores** quản lý các vector store được sử dụng bởi các node [RAG](../nodes/rag-node.md). Tạo store, tải lên tài liệu và chia sẻ chúng với nhóm của bạn.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Xem demo Vectorstores</a></p>

## Tạo một Vector Store

1. Nhấp vào **New Vector Store**
2. Nhập tên và mô tả tùy chọn
3. Chọn **credential** vector store – *RAG: Qdrant + OpenAI* (máy chủ Qdrant bên ngoài), *RAG: Psql + OpenAI* (cơ sở dữ liệu Postgres của chính Heym thông qua pgvector), hoặc *RAG: Custom Embeddings* (bất kỳ endpoint embedding tương thích OpenAI nào, nhắm đến một trong hai backend). Credential quyết định backend của store.
4. Tùy chọn đặt tên collection tùy chỉnh (mặc định là tự động tạo)
5. Lưu

> Backend của một store được cố định bởi credential của nó tại thời điểm tạo. Trong một node RAG, dropdown **Database** lọc các store theo backend tương ứng.

## Tải lên Tài liệu

- **Tải lên tệp** – Kéo và thả hoặc chọn tệp (PDF, TXT, v.v.)
- **Xử lý trùng lặp** – Chọn ghi đè hoặc bỏ qua tên tệp trùng lặp
- **Tiến trình** – Tiến trình tải lên được hiển thị trong quá trình ingestion

## Quản lý Nội dung

- **Xem các mục** – Xem các nhóm nguồn và số lượng tài liệu trên mỗi store. Các tệp đã tải lên được nhóm
  theo tên tệp của chúng; các tài liệu mà một [node RAG](../nodes/rag-node.md) lưu trữ không có
  `source` riêng sẽ được nhóm dưới **Added workflow: _name_**, đặt tên theo workflow đã
  ghi chúng
- **Xóa nguồn** – Xóa các tệp cụ thể hoặc nhóm nguồn khỏi một store, bao gồm
  mọi thứ mà một workflow đã thêm
- **Chỉnh sửa store** – Thay đổi tên, mô tả hoặc credential

## Chia sẻ

- Chia sẻ vector store với người dùng khác qua email
- Các store được chia sẻ xuất hiện với một chỉ báo
- Thu hồi chia sẻ từ menu thẻ của store

## Sử dụng trong Workflow

Trong một [node RAG](../nodes/rag-node.md), chọn vector store theo tên. Node truy xuất các chunk liên quan và bổ sung chúng vào ngữ cảnh LLM.

## Liên quan

- [Tab Credentials](./credentials-tab.md) – Thiết lập credential vector store (Qdrant, Postgres hoặc custom embeddings)
- [Node RAG](../nodes/rag-node.md) – Tham chiếu node
- [Tab Workflows](./workflows-tab.md) – Tạo workflow sử dụng RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang gọn gàng cho các bề mặt dashboard
