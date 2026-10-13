# Vectorstores 分頁

**Vectorstores** 分頁用於管理 [RAG](../nodes/rag-node.md) 節點所使用的向量儲存庫。您可以建立儲存庫、上傳文件，並與您的團隊共享。

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ 觀看 Vectorstores 示範</a></p>

## 建立 Vector Store

1. 點擊 **New Vector Store**
2. 輸入名稱與選填的描述
3. 選擇 vector store **credential** – *RAG: Qdrant + OpenAI*（外部 Qdrant 伺服器）、*RAG: Psql + OpenAI*（Heym 自有、透過 pgvector 的 Postgres 資料庫），或 *RAG: Custom Embeddings*（任何與 OpenAI 相容的 embedding endpoint，可指向上述任一後端）。credential 決定了儲存庫的後端。
4. 選填自訂 collection 名稱（預設為自動產生）
5. 儲存

> 儲存庫的後端在建立時即由其 credential 固定。在 RAG 節點中，**Database** 下拉選單會篩選出後端相符的儲存庫。

## 上傳文件

- **Upload files** – 拖放或選擇檔案（PDF、TXT 等）
- **Duplicate handling** – 選擇覆寫或略過重複的檔名
- **Progress** – 擷取過程中會顯示上傳進度

## 管理內容

- **View items** – 檢視各儲存庫的來源群組與文件數量。上傳的檔案會依其檔名分組；
  [RAG 節點](../nodes/rag-node.md)所儲存、本身沒有 `source` 的文件，則會歸類在
  **Added workflow: _name_** 之下，並標示寫入這些文件的 workflow 名稱
- **Delete sources** – 從儲存庫中移除特定檔案或來源群組，包括某個 workflow 新增的所有內容
- **Edit store** – 變更名稱、描述或 credential
- **Search** – 以 `query`（以及 1 到 20 之間的 `limit`，預設為 5）呼叫 `POST /api/vector-stores/{id}/search`，會回傳 RAG 節點搜尋所會回傳的區塊（chunks），最佳比對排在最前面，每個區塊皆附帶其分數與來源。Heym Work 的 RAG 畫面會使用此功能來測試檢索

## 共享

- 透過電子郵件與其他使用者共享 vector store
- 共享的儲存庫會顯示指示標記
- 可從儲存庫卡片選單撤銷共享

## 在 Workflow 中使用

在 [RAG 節點](../nodes/rag-node.md)中，依名稱選擇 vector store。該節點會擷取相關的 chunk，並將其加入 LLM 的 context 中。

## 相關內容

- [Credentials 分頁](./credentials-tab.md) – Vector store credential 設定（Qdrant、Postgres 或自訂 embeddings）
- [RAG 節點](../nodes/rag-node.md) – 節點參考
- [Workflows 分頁](./workflows-tab.md) – 建立使用 RAG 的 workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板介面的精簡頁面指南
