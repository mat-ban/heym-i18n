# MCP Tab

**MCP** 頁籤用於設定 Model Context Protocol (MCP) 整合。MCP 讓 AI 用戶端（Claude、ChatGPT、Gemini、Cursor，以及任何相容於 MCP 的工具）能將您的 Heym Workflow 當作工具來呼叫。

Heym 支援兩種模式：**預設伺服器**，在單一 Endpoint 下公開所有已啟用 MCP 的 Workflow；以及**具名伺服器**，讓每個邏輯群組的 Workflow 擁有專屬的 URL 與 API Key。

兩種模式都能公開兩類工具：個別的 **Workflow**，以及 **Heym 聊天工具**——也就是將整個 [Chat 頁籤](./chat-tab.md)引擎包裝在單一的 `heym_chat` 工具之後。

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ 觀看 MCP 示範</a></p>

## 預設 MCP 伺服器

預設伺服器一律可透過 `{origin}/api/mcp/sse` 存取。所有已開啟 MCP 的 Workflow 都會在此顯示為工具。

### MCP API Key

- Key 以 SHA-256 摘要形式儲存，因此 Heym 無法顯示既有的 Key。此頁籤僅會回報是否已設定，而不會顯示其內容。
- **Generate** / **Regenerate** – 新 Key 僅在您建立後顯示一次。請於當下複製；重新載入頁籤後即永久隱藏。
- 連接 Claude Desktop、Cursor 或其他 MCP 用戶端至 Heym 時，請使用此 Key。
- Key 遺失了？請重新產生。先前的 Key 會立即失效。

### 連線方式

- **API Key** – 使用 MCP API Key 進行程式化連線。此頁籤可複製可直接使用的 JSON 設定，並提供 **Add to Cursor** 按鈕，一鍵完成 Cursor 設定。
- **Claude** – 此頁籤會顯示 MCP 伺服器 URL 與 Claude 的設定步驟。OAuth Client ID 與 Secret 請留空；Claude 會自動註冊並透過 Heym OAuth 進行驗證。
- **ChatGPT** – 此頁籤會顯示 ChatGPT 應用程式的 MCP 伺服器 URL 與設定步驟。開啟開發人員模式（Developer mode），使用該 URL 建立應用程式並選擇 OAuth；ChatGPT 會自動完成註冊。
- **Gemini** – 此頁籤會顯示 Gemini 自訂應用程式的 MCP 伺服器 URL 與設定步驟：在 gemini.google.com 中依序前往 **Settings → Connected Apps → Add a custom app**，貼上 URL 並保持 **Advanced features** 關閉；Gemini 會自動註冊並透過 Heym OAuth 進行驗證。連線後，Heym 也能在 Gemini 行動應用程式中運作。

### Workflow MCP 開關

每個 Workflow 都能公開為 MCP 工具：

- **Enable** – 該 Workflow 的工具將提供給所有連接至預設伺服器的用戶端使用
- **Disable** – 該 Workflow 不會被公開

Workflow 卡片會顯示描述與輸入欄位名稱預覽，讓您在啟用前先了解每個工具預期的內容。

## Heym 聊天工具

**Heym Capabilities** 區段會將 Chat 頁籤引擎轉換為單一 MCP 工具，名為 `heym_chat`。您可以在預設伺服器、任何具名伺服器，或兩者上啟用它——每個介面各自保有獨立的開關與模型選擇。

啟用後，`heym_chat` 會與您的 Workflow 工具一同出現在 `tools/list` 中。MCP 用戶端傳送一則自然語言訊息，Heym 引擎便會接手處理，並具備與 Chat 頁籤相同的能力：

- 建立 Workflow、以範例輸入執行測試、修正問題，並在執行通過時完成（請參閱[建置模式](#build-mode)）
- 檢視並執行您現有的 Workflow
- 回報分析資料、近期執行紀錄，以及即將到來的 Cron 排程
- 回報單一 Workflow 的執行歷史：執行次數、狀態計數、執行時間，並可依要求提供單次執行的輸入、輸出與各節點錯誤
- 回報目前正在執行的內容：進行中的執行數量、其 Workflow 名稱、各自已執行多久、目前所在的節點，以及即時執行的連結
- 在 [Board 頁籤](./board-tab.md)上列出看板、建立卡片，以及讀取卡片詳細資料
- 列出您的資料表及其欄位、建立新資料表，並將其串接至它所建立的 Workflow 中
- 讀取團隊與全域變數，並搜尋文件
- 核准、編輯或拒絕待處理的人為介入審查

日後新增至 Chat 頁籤的能力會自動透過 `heym_chat` 提供——無需逐一同步各能力的開關。

### 建置模式

`heym_chat` 一律以建置模式（build mode）執行 Chat 引擎。在單次呼叫中，助理可以儲存新的 Workflow、使用真實的範例輸入加以執行、讀取執行報告、修正失敗的部分並再次執行，每次呼叫最多可進行五次測試執行。當最新儲存版本的最新一次執行通過時，助理會以一句話摘要作結，且回覆最後會附帶 `Verified: the latest test run of the saved workflow passed.`

- 測試執行是真實的執行。其副作用會實際發生，並會像任何其他執行一樣出現在 Workflow 的執行歷史記錄中。
- 儲存操作會遵循編輯器的路徑：對圖形的變更會將先前的圖形保留在 Workflow 的 **Edit History** 中。
- 若要修改先前建立的 Workflow，請使用相同的 `conversation_id` 延續該對話串。助理會更新該 Workflow 而非建立新的 Workflow，且僅會修改您有權編輯的 Workflow。
- 當五次測試執行用盡時，助理會停止並說明仍然失敗的原因。

Credential 一律保留於 UI 中：`heym_chat` 絕不會列出、選擇或建立 Credential。當它建立或編輯 Workflow 時，需要 Credential 的新節點會保持空白，並於回覆中列出這些節點，讓您能在編輯器中設定。

資料表則不同。資料表不包含機密資訊，因此 `heym_chat` 可以列出您的資料表、詢問 Workflow 應使用哪一個，並建立含欄位的新資料表。它絕不會讀取或寫入資料列。

### Credential 與模型

`heym_chat` 會在您的 Heym 帳號上執行引擎，因此需要專屬的 LLM Credential：

| 欄位 | 行為 |
|-------|----------|
| **Credential** | 選擇任何您可存取的 OpenAI、Google 或 Custom Credential。當您尚未選擇時，會從 [Settings](../reference/user-settings.md) 中的偏好 Credential 預先填入。 |
| **Model** | 從所選的 Credential 載入。當 Credential 相符時，會從您的偏好模型預先填入。 |

若任一項缺少，該工具仍會出現在 `tools/list` 中，但每次呼叫都會回傳錯誤，提示您在此頁籤完成設定。

### 參數與歷史紀錄

| 參數 | 必填 | 說明 |
|----------|----------|-------------|
| `message` | 是 | 以自然語言表達的指令或問題。 |
| `conversation_id` | 否 | 來自先前 `heym_chat` 結果的 `conversation_id`，用於延續該對話串。 |

每次呼叫都會以一般對話的形式寫入您的 [Chat 頁籤](./chat-tab.md)歷史紀錄，並在對話清單中以插頭圖示標示。訊息、工具卡片與釐清暫停的呈現方式，與您自行發起的對話完全相同，您可以開啟該對話串並在瀏覽器中繼續對話。每次結果都會回傳其 `conversation_id`，讓 MCP 用戶端能延續同一對話串，而不必在每次呼叫時開啟新的對話。

當助理需要釐清時，會暫停並說明；請使用相同的 `conversation_id` 回覆您的答案。

## 具名 MCP Servers

具名伺服器讓您將 workflows 區隔為獨立的 MCP endpoints。每個伺服器擁有專屬的 URL 與 API key，因此不同的 AI 用戶端、團隊或使用情境都能精準連線至所需的 workflows。

### 建立具名伺服器

1. 在 MCP 分頁底部的輸入欄位中輸入名稱（例如 **CRM Tools**）
2. 點擊 **Create** — 新的伺服器卡片會立即出現
3. 點擊卡片以展開

### 各伺服器設定

每張伺服器卡片顯示：

| 設定 | 說明 |
|---------|-------------|
| **SSE Endpoint** | 專屬 URL：`{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | 獨立 key，於產生或重新產生時僅顯示一次。請立即複製；該 key 以雜湊形式儲存，之後無法再顯示 |
| **How to connect** | **Copy JSON** 會複製可直接貼上的 MCP 設定；**Add to Cursor** 則可一鍵安裝 |
| **Heym Capabilities** | 為此伺服器切換 `heym_chat` 工具，並選擇其 credential 與 model |
| **Assigned Workflows** | 切換此伺服器要暴露哪些 workflows |

### Workflow 指派

Workflow 指派以各伺服器為單位，且獨立於預設伺服器的切換設定。一個 workflow 可以同時在預設伺服器與多個具名伺服器上啟用，也可以全部不啟用。

切換某個 workflow 時，該項目會移至指派清單頂端，因此您剛變更的那一列會保持可見，而不會捲動至畫面外。

### 驗證

具名伺服器支援與預設伺服器相同的驗證方式：

- **X-MCP-Key header** – 直接傳遞伺服器的 API key（API 用戶端、Cursor）。僅限 header：key 不接受以 `?key=` 查詢參數傳遞，因為 URL 會留存於存取記錄、代理伺服器記錄與瀏覽器歷史中。
- **Claude、ChatGPT 與 Gemini OAuth** – 將伺服器 URL 加入用戶端的連接器或自訂應用程式；憑證留空，用戶端便會透過 OAuth 自動註冊。bearer token 必須以 `Authorization` header 傳遞，而非 `?token=`。
- **Session token** – 於 SSE 握手期間核發；範圍限定於特定伺服器，因此來自某個具名伺服器的 token 無法存取另一個伺服器。此短效的 `?session=` 參數不受影響。

### 刪除具名伺服器

點擊伺服器卡片標題上的 **X** 圖示。刪除會移除該伺服器及其所有 workflow 指派；workflows 本身不受影響。

## SSE Endpoint

| 伺服器 | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

兩個 endpoints 皆支援 SSE transport（GET，MCP 規格 2024-11-05）與 Streamable HTTP transport（POST，MCP 規格 2025-03-26）。Claude、ChatGPT 與 Gemini 在兩者上皆使用 OAuth 2.1 / PKCE 進行安全登入。

## 相關內容

- [Why Heym](../getting-started/why-heym.md) – MCP 作為 Heym 中的一級基本要素
- [Agent Node](../nodes/agent-node.md) – 支援 MCP 工具的 Agent 節點
- [Agent Architecture](../reference/agent-architecture.md) – MCP 用戶端、工具分派、協調器
- [Triggers](../reference/triggers.md) – MCP 作為 workflow 進入點
- [Chat Tab](./chat-tab.md) – `heym_chat` 工具背後的引擎
- [Workflows Tab](./workflows-tab.md) – 建立與管理 workflows
- [Node Types](../reference/node-types.md) – AI 節點總覽
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板介面的精簡頁面指南
