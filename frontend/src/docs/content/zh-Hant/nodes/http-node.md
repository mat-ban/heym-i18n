# HTTP

**HTTP** 節點使用 cURL 語法發出 HTTP 請求。它可以是 Workflow 的起始點（沒有傳入邊），或接收來自上游節點的輸入。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 或 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.status`、`$nodeLabel.body`、`$nodeLabel.headers` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `curl` | string | cURL 指令（例如 `curl -X GET https://api.example.com`） |

## 回應格式

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## 存取回應

- `$httpNode.status` – HTTP 狀態碼
- `$httpNode.body` – 回應主體（字串或解析後的 JSON）
- `$httpNode.body.fieldName` – 存取 JSON 欄位
- `$httpNode.headers` – 回應標頭

## 範例

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

使用 cURL 語法，以 `-H` 指定標頭、`-d` 指定 POST 主體等。表達式可用於 curl 字串中的任何位置，包括 URL、標頭或整行標頭。[Header 認證](../reference/credentials.md)會解析為 `key: value`，因此 `-H "$credentials.MyApiKey"` 會送出完整的標頭：

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

表達式內的引號與空格屬於表達式本身，而非 cURL 指令，因此接受字串引數的方法可內嵌使用：

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## 使用認證進行驗證

`$credentials.Name` 會依每種[認證](../reference/credentials.md)類型解析為不同的值，因此標頭行取決於類型：

| 認證類型 | `$credentials.Name` 解析為 | 標頭 |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI、Custom、Cohere | 原始 API 金鑰 | `-H "Authorization: Bearer $credentials.Name"` |
| Google | 原始 API 金鑰 | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | 原始 API 金鑰 | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets、Google Drive | 全新的 OAuth 存取 Token，於到期時重新整理 | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub、Notion、Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Bearer 認證本身已帶有 `Bearer ` 前綴，因此再加上一個會送出 `Bearer Bearer …`。Google Sheets 與 Google Drive 認證可讓你在該認證被授予的範圍內，呼叫其節點未涵蓋的 Google API，例如在試算表中新增工作表。當名稱不是單純的識別碼時（包含 `-`、以數字開頭，或為保留字），請使用括號形式：`-H "Authorization: $credentials["my-api-key"]"`。

當 [AI Assistant](../reference/ai-assistant.md) 或 [Chat](../tabs/chat-tab.md) 建立需要驗證的 HTTP 請求，且沒有專用節點涵蓋該服務時，它會詢問要使用哪個認證。選擇一個，若 API 預期不同的標頭名稱，請變更預填的標頭名稱，它便會為你撰寫標頭行。助理能看到認證的名稱與類型，但永遠看不到其值。若你沒有合適的認證，該問題會提供建立一個的選項。進入節點輸出的機密（例如送出的 `request.headers`）會在執行結果中被遮蔽。

## 出口安全

- 依預設，URL 必須使用 `http://` 或 `https://`，且僅能解析為公開位址。Loopback、私人、link-local、多播與雲端中介資料目的地皆會被封鎖。
- Heym 會驗證解析後的位址，並將連線目標固定，以防止 DNS 重新綁定。防護啟用期間會停用環境 Proxy。依預設不會跟隨重新導向；請加入 cURL 的 `-L` 選項以跟隨。啟用後，每個重新導向跳轉都會依相同的公開位址政策檢查，並在連線前固定。
- 有意連線至內部服務的受信任自架部署可設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在託管或多租戶部署上請保持預設值。

**v0.0.105 升級注意事項：** 此執行個體層級的政策現在也保護 Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、自訂 LLM 執行與模型探索、AI 助理、guardrails 及 RAG embeddings 所使用的認證衍生目的地。指向 loopback、私人或 link-local 位址的現有認證會被拒絕，除非在受信任的自架執行個體上啟用 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。防護啟用期間，受防護的 HTTP 用戶端會忽略 `HTTP_PROXY` 與 `HTTPS_PROXY`；啟用退出選項則會恢復它們。透過 `SSL_CERT_FILE` 或 `SSL_CERT_DIR` 設定的操作員 CA 憑證捆綁仍受支援。ClickHouse 會在連線開啟前檢查，但不會在撥號時固定，因為 clickhouse-connect 自帶其 urllib3 傳輸。

## 相關

- [節點類型](../reference/node-types.md) – 所有節點類型的概觀
- [Trigger](../reference/triggers.md) – 以 HTTP 作為 Workflow 進入點
- [Credentials 分頁](../tabs/credentials-tab.md) – 為已驗證的請求新增 API 金鑰
