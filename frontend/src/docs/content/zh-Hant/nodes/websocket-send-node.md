# WebSocket 發送

**WebSocket Send** 節點會開啟對外部 WebSocket 伺服器的對外客戶端連線，傳送一則訊息，然後關閉連線。當 Workflow 需要將事件推送至即時系統，而不想暴露 Heym 擁有的 socket Endpoint 時，請使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.status`、`$nodeLabel.url`、`$nodeLabel.message_type`、`$nodeLabel.size_bytes` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `websocketUrl` | string / expression | 外部 `ws://` 或 `wss://` URL |
| `websocketHeaders` | JSON object string / expression | 選用的握手標頭 |
| `websocketSubprotocols` | string | 選用的逗號分隔子協定清單 |
| `websocketMessage` | expression | 要傳送的 Payload |

## 訊息序列化規則

- 若 `websocketMessage` 解析為 **string**，Heym 會傳送文字框架。
- 若解析為 **object**、**array**、**number**、**boolean** 或 `null`，Heym 會將其序列化為 JSON 文字。
- 若解析為 **bytes**，Heym 會傳送二進位框架。
- 完整表達式（例如 `$input`）會在序列化前保留原生類型。

## 輸出欄位

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.status` | 成功時為 `"sent"` |
| `$nodeLabel.url` | 解析後的目的地 URL |
| `$nodeLabel.message_type` | `text`、`json` 或 `binary` |
| `$nodeLabel.size_bytes` | Payload 大小（以位元組為單位） |
| `$nodeLabel.subprotocol` | 協商後的子協定（若存在） |
| `$nodeLabel.sent_at` | ISO 時間戳記 |

## 範例 Workflow

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- **Set** 建立 Payload 物件，例如 `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** 使用 `$payloadNode` 作為 `websocketMessage`
- **Output** 可回傳 `$socketSend.status`

## 範例節點 JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## 備註

- 此節點不需要 [credential](../reference/credentials.md)。
- 若遠端伺服器需要驗證或租戶標頭，請透過 `websocketHeaders` 傳遞。
- 當遠端系統是基於請求／回應而非基於 socket 時，請改用 [HTTP](./http-node.md)。

## 出口安全

- 預設情況下，URL 必須使用 `ws://` 或 `wss://`，且僅能解析為公開位址。Loopback、私人、link-local、多播及雲端中介資料目的地皆會被封鎖。
- Heym 會驗證每個解析後的位址，並直接連線至其中一個位址。當防護機制啟用時，環境 Proxy 與 WebSocket 重新導向會被停用。
- 支援 `Authorization`、`Origin`、`User-Agent` 及自訂資料標頭。`Origin` 會透過 WebSocket 客戶端的專用選項傳送。`Host`、`Connection`、`Upgrade` 及 `Sec-WebSocket-*` 標頭無法被覆寫。
- 刻意連線至內部服務的可信任自架部署，可設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在託管或多租戶部署上請保持預設值。

**v0.0.105 升級注意事項：** 此執行個體層級政策現在也保護由 Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、自訂 LLM 執行與模型探索、AI 助理、guardrails 及 RAG embeddings 所使用的 credential 衍生目的地。指向 loopback、私人或 link-local 位址的現有 credential 會被拒絕，除非在可信任的自架執行個體上啟用 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。當防護機制開啟時，受防護的 HTTP 客戶端會忽略 `HTTP_PROXY` 與 `HTTPS_PROXY`；啟用退出選項則會恢復它們。透過 `SSL_CERT_FILE` 或 `SSL_CERT_DIR` 設定的操作員 CA 憑證捆綁仍受支援。ClickHouse 會在連線開啟前進行檢查，但不會在撥號時鎖定，因為 clickhouse-connect 自帶 urllib3 傳輸層。

## 相關資訊

- [WebSocket Trigger](./websocket-trigger-node.md) – 監聽外部 socket 並在事件發生時觸發 Workflow
- [Node Types](../reference/node-types.md) – 整合節點概觀
- [Expression DSL](../reference/expression-dsl.md) – 建立動態 JSON Payload
- [Third-Party Integrations](../reference/integrations.md) – credential 支援與直接設定整合的比較
