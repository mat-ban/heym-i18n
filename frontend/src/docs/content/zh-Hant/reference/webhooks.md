# Webhooks

Workflow 可透過 HTTP webhook 觸發。標準的 execute endpoint 會回傳 JSON，而串流版本則回傳 Server-Sent Events（SSE）。

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

將 `{workflow_id}` 替換為 workflow UUID。base URL 為您的 Heym 執行個體（例如 `https://app.heym.ai`）。

## Request Method

每個 workflow 接受一種 HTTP 動詞，於編輯器的 cURL 對話框中選擇：`GET`、`POST`、`PUT` 或 `DELETE`。**`POST` 為預設值**，且在此設定存在之前建立的所有 workflow 皆維持此設定，因此目前可運作的項目不會有任何變更。

以不同的動詞呼叫 workflow 會回傳 `405 Method Not Allowed`，並附帶一個 `Allow` header 指出所設定的動詞：

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

唯一的例外：帶有 `?test_run=true` 的請求會略過此檢查。這正是編輯器的 **Run** 按鈕與除錯面板所送出的內容，因此設定為 `GET` 的 workflow 仍可在產品內進行測試。

### Bodyless methods

`GET` 與 `DELETE` 不帶 request body。輸入改由 query string 提供，並以 `$input.query.<name>` 讀取：

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL 對話框會對這兩種 method 隱藏 request-body 編輯器，並移除 `Content-Type` header。

將 `GET` 與 [HTML output mapper](../nodes/html-output-mapper-node.md) 搭配使用，即可提供瀏覽器可直接開啟的頁面。

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

當您想要逐步的執行事件，而非單一 JSON 回應時，請使用 streaming endpoint。關於事件協定與各節點的啟動訊息設定，請參閱 [SSE Streaming](./sse-streaming.md)。

## Request Format

request body 會以 `body` 傳遞至 [Input](../nodes/input-node.md) 節點。Heym 接受兩種請求格式：

- **Raw JSON** – 例如 `{"userId": "123", "action": "create"}`
- **Wrapped format** – `{"inputs": {...}, "test_run": false}`

使用 wrapped format 時，`inputs` 會被擷取並以 `body` 傳遞。`test_run` 會略過速率限制與回應快取。您也可以在傳送 raw JSON 時，以 query parameter 的形式送出 `?test_run=true`。

## Request Body Modes

每個 workflow 都有一個 `webhook_body_mode` 設定，用來控制編輯器如何建構範例請求：

| Mode | Behavior |
|------|----------|
| **defined** | 編輯器與 cURL 對話框會依據 workflow 的 Input 節點欄位來塑造範例 body，並在 JSON payload 中保留空鍵。既有的 defined 風格 cURL payload 仍可繼續運作。 |
| **generic** | 編輯器與 cURL 對話框使用自由格式的 JSON body。request body 會原樣傳遞，因此外部應用程式可以送出自身固定的 payload 格式。 |

執行 API 在兩種模式下皆保持向後相容。raw JSON 與 wrapped `{ "inputs": ... }` 請求在任一種模式下仍會被接受。

Headers 與 query params 可在運算式中以 `$input.headers` 與 `$input.query` 取得。Header 鍵會轉為小寫。

## Authentication

於編輯器中依 workflow 設定（workflow settings）。驗證會在執行前檢查。

| auth_type | Behavior |
|-----------|----------|
| **anonymous** | 無需驗證。任何人都可以呼叫此 endpoint。 |
| **jwt** | 需要 Bearer token。可接受使用者 session token（使用者必須具備 workflow 存取權）或為此 workflow 建立之具範圍的 [Execution Token](./execution-tokens.md)。 |
| **header_auth** | 自訂 header 必須相符。設定 `auth_header_key`（例如 `X-API-Key`）與 `auth_header_value`。 |

對於 `header_auth`，request header 值必須與所設定的值完全相符。具備 workflow 存取權的 JWT 使用者也可在沒有自訂 header 的情況下呼叫。

對於 `jwt`，[Execution Tokens](./execution-tokens.md) 是從外部系統呼叫 workflow 的建議方式 — 其範圍限定於單一 workflow，且可獨立撤銷。

## Response Caching

依 workflow 設定 `cache_ttl_seconds`。當設定且大於 0 時：

- **Cache key**：`workflow_id` + `body` + `query` 的 SHA256 hash
- **Cache hit**：立即回傳，並帶有 `status: "cached"` 與快取的 outputs
- **Cache set**：僅在成功執行後（`status: "success"`）
- **Storage**：由 Postgres 支援，並於後端 workers 之間共用

| Setting | Effect |
|---------|--------|
| `cache_ttl_seconds` = 0 或 null | 停用快取 |
| `cache_ttl_seconds` > 0 | 回應會快取此秒數 |

`test_run` 請求會略過快取（不讀取、不寫入）。

當 cURL 對話框中啟用 response caching 時，**Clear cache** 會立即清除目前 workflow 的快取回應。

## Rate Limiting

依 workflow 設定：`rate_limit_requests` 與 `rate_limit_window_seconds`。

- **Scope**：依 `workflow_id` + 用戶端 IP（滑動視窗）
- **Exceeded**：HTTP 429，並附帶 `Retry-After` header
- **Headers**：`X-RateLimit-Limit`、`X-RateLimit-Remaining`、`X-RateLimit-Reset`

| Setting | Description |
|---------|-------------|
| `rate_limit_requests` | 視窗內允許的最大請求數 |
| `rate_limit_window_seconds` | 視窗持續時間（秒） |

`test_run` 請求會略過速率限制。

<a id="concurrency-limit-and-queued-runs"></a>

## 並行限制與排隊執行

Workflow 可以限制同時執行的正式環境執行數量。在 workflow 層級的 **Properties** 面板中開啟 **並行限制**，並設定 **最大並行執行數**。擁有者與具有編輯權限的協作者可以進行修改。此限制預設為關閉。

達到限制時，新的執行會在先進先出 (FIFO) 佇列中等待。這涵蓋所有正式環境進入點：此 endpoint、[串流 endpoint](./sse-streaming.md)、[Portal](./portal.md)、[Quick Drawer](./quick-drawer.md)、[MCP](../tabs/mcp-tab.md) 以及每個 [trigger](./triggers.md)。編輯器本身的測試執行一律會立即啟動，不會佔用額度插槽。若未登入具有開啟 workflow 權限的作業階段而傳送 `test_run=true`，並不會略過佇列。

| 設定 | 說明 |
|---|---|
| `concurrency_limit` | 同時允許的正式環境執行數。`0` 代表關閉限制 |
| `concurrency_max_queue` | 選用。允許同時等待的執行數。留空代表無限制 |
| `concurrency_max_wait_seconds` | 選用。等待時間超過此設定的執行會被記錄為 `expired`。留空代表無限制等待 |

### 202 Accepted

立即啟動的呼叫行為與回應格式中所述完全相同。必須等待的呼叫會立即收到 `202 Accepted`（無論 `X-Simple-Response` 內容為何），並帶有指向其狀態 URL 的 `Location` 標頭：

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| 欄位 | 說明 |
|---|---|
| `queue.position` | 此執行在佇列中的排隊位置，從 1 開始 |
| `queue.size` | 目前正在等待的執行數 |
| `queue.running` | 目前佔用插槽的執行數 |
| `queue.limit` | 該 workflow 的並行限制 |
| `status_token` | 僅限匿名 workflow。在此回應中僅返回一次 |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` 會回應執行的狀態。請使用啟動執行的相同憑證來呼叫：工作階段或 JWT、[執行 token](./execution-tokens.md) 或 workflow 的自訂標頭。匿名 workflow 沒有需要驗證的憑證，因此請在 `X-Heym-Run-Token` 標頭中傳送來自 202 的 `status_token`。token 絕對不會從查詢字串讀取。錯誤或遺失的 token 會收到 `404`，與未知執行的結果相同。

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | 含義（必須等待並行插槽的執行會改為收到 [202 回應](#202-accepted)） |
|---|---|
| `queued` | 正在等待插槽；`queue` 顯示其目前位置 |
| `running` | 已取得插槽且正在執行 |
| `success` / `error` | 已完成；`outputs` 與 `error` 已填入 |
| `pending` | 因[人工審核](./human-in-the-loop.md)而暫停 |
| `cancelled` | 已從[執行歷史記錄](./execution-history.md)中取消 |
| `expired` | 等待時間超過 `concurrency_max_wait_seconds` 且未曾執行 |

每隔幾秒輪詢一次，直到狀態不再是 `queued` 或 `running`。即使沒有人輪詢，排隊的執行也會照常完成執行。

### 佇列已滿

當設定了 `concurrency_max_queue` 且已有相應數量的執行正在等待時，呼叫將會被拒絕並傳回 `429 Concurrency queue is full`，同時在執行歷史記錄中留下 `queue_full` 項目。沒有任何項目會進入佇列。

## 回應格式

Endpoint 會回傳 JSON：

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| 欄位 | 說明 |
|-------|-------------|
| `workflow_id` | Workflow UUID |
| `status` | `success`、`error`、`cached` 或 `rate_limited` |
| `outputs` | 終端節點的輸出。當唯一的終端節點為單一 [JSON output mapper](../nodes/json-output-mapper-node.md) 時，回應主體即為該映射物件本身（預設的簡易 JSON 回應）。否則會包含以標籤為鍵的 [Output](../nodes/output-node.md) 與其他終端節點。 |
| `execution_time_ms` | 執行時間（毫秒）（cached/rate_limited 時為 0） |

發生錯誤時，`outputs` 可能包含錯誤詳細資訊。[Throw Error](../nodes/throw-error-node.md) 節點可設定自訂的 HTTP 狀態碼（4xx/5xx）。

## Run with cURL 對話框

**Run with cURL** 工具列按鈕（位於編輯器右上角，`cURL` 圖示）會開啟一個對話框，用於為目前的 workflow 建立並複製可直接執行的 cURL 指令。

### 功能說明

| 欄位 | 說明 |
|-------|-------------|
| **Request Body Mode** | 選擇 **Defined** 或 **Generic**。Generic 會將 body 保持為原始 JSON，而非依 Input 欄位塑形。 |
| **Authentication** | 選擇 Anonymous、JWT Token 或 Header Auth。會在指令中設定正確的驗證標頭。選擇 JWT Token 時，對話框會顯示 [Execution Token](./execution-tokens.md) 管理器 — 可建立或選擇 Token，將其直接嵌入指令中。 |
| **Header Key / Value** | 選擇 Header Auth 時顯示。會從 workflow 的驗證設定預先填入。 |
| **Response Cache** | 快取相同回應的分鐘數（0 = 停用）。變更會儲存至 workflow。啟用後，**Clear cache** 會立即清除已快取的回應。 |
| **Rate Limit** | 每個時間區間內的最大請求數。變更會儲存至 workflow。 |
| **SSE Streaming** | 將指令切換至 `/execute/stream`，加入 `--no-buffer`，並顯示各節點的 `node_start` 訊息設定。 |
| **Body** | JSON 請求主體。在 Defined 模式下，會從 [Input](../nodes/input-node.md) 欄位預先填入並保留空鍵。在 Generic 模式下，則為原始 JSON 編輯器。 |
| **Command** | 完整 cURL 指令的唯讀預覽。 |

點擊 **Copy cURL** 可將指令複製到剪貼簿。

### 範例

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

在 Generic 模式下，巢狀 payload 會保持完整，例如：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

此對話框會反映儲存於 workflow 上的驗證、body 模式、快取與速率限制設定 — 在此編輯會立即更新 workflow。

### 對話框中的 SSE Streaming

若您希望產生的指令能從終端機即時追蹤執行情形，請啟用 **SSE Streaming**。

- Endpoint 會從 `/execute` 變更為 `/execute/stream`
- 指令會加入 `--no-buffer` 與 `Accept: text/event-stream`
- 每個非 sticky 節點會出現在清單中，您可以：
  - 啟用或停用 `node_start` 訊息
  - 自訂起始訊息文字
- `node_complete` 事件一律會發出，並包含完整的節點輸出

範例：

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

完整的 event 協定與範例，請參閱 [SSE Streaming](./sse-streaming.md)。

## Trigger Source 標記

每次執行都會儲存一個 `trigger_source` 標籤，並顯示於 [Execution History](./execution-history.md) 中。您可以傳送 `X-Trigger-Source` 標頭並帶入任意值來設定：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

編輯器對話框中的 **Copy cURL** 按鈕會自動包含 `X-Trigger-Source: API`。您可以將 `API` 替換為任何有意義的值 — `scheduler`、`rabbitmq`、`github-actions` 等。

若未傳送該標頭，`trigger_source` 會預設為 `"API"`，且該次執行在歷史紀錄中會標記為 **API**。您可以用任何對您的系統有意義的值覆寫它 — `scheduler`、`github-actions`、`rabbitmq` 等。

## 相關內容

- [Execution Tokens](./execution-tokens.md) – 用於從外部系統呼叫 workflow 的範圍限定 JWT
- [SSE Streaming](./sse-streaming.md) – 透過 Server-Sent Events 即時串流節點事件
- [Triggers](./triggers.md) – 所有 workflow 進入點，包括 webhook
- [Workflow Structure](./workflow-structure.md) – 節點與邊
- [Expression DSL](./expression-dsl.md) – 存取 `$input.body`、`$input.headers`、`$input.query`
