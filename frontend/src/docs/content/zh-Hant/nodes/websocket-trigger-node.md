# WebSocket Trigger

**WebSocket Trigger** 節點會對外部 WebSocket 伺服器建立對外客戶端連線，並在選定的 socket 事件發生時啟動 Workflow。適用於市場行情饋送、遙測或聊天後端等事件串流。若要連線至內部即時系統，則需採用下方所述的私有 URL 例外設定。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.eventName`、`$nodeLabel.message`、`$nodeLabel.connection`、`$nodeLabel.close` |

## 重要行為

- 此節點會**從 Heym 連線至另一個 WebSocket 伺服器**。
- 它**不會**在 Heym 上暴露 WebSocket Endpoint。
- 不需要任何 [credential](../reference/credentials.md)。請直接在節點上設定 URL、headers 與 subprotocols。
- Leader worker 會在背景維持連線開啟，並在啟用時重新連線。

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `websocketUrl` | string | 外部 `ws://` 或 `wss://` URL |
| `websocketHeaders` | JSON object string | 選用的握手 headers |
| `websocketSubprotocols` | string | 選用的逗號分隔 subprotocol 清單 |
| `websocketTriggerEvents` | array | `onMessage`、`onConnected`、`onClosed` 中任一項 |
| `retryEnabled` | boolean | 中斷後重新連線 |
| `retryWaitSeconds` | integer | 重新連線前的延遲時間 |

## 發出的事件

### `onMessage`

當遠端 socket 傳入訊框時觸發。

實用欄位：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.message.data` | 解析後的 JSON Payload 或原始訊息值 |
| `$nodeLabel.message.text` | 可用時以 UTF-8 解碼的文字 |
| `$nodeLabel.message.base64` | 以 base64 表示的二進位 Payload |
| `$nodeLabel.message.sizeBytes` | Payload 大小 |
| `$nodeLabel.message.isJson` | 訊息是否解析為 JSON |

### `onConnected`

當 socket 成功開啟後觸發。

實用欄位：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | 首次連線為 `false`，後續重新連線為 `true` |
| `$nodeLabel.connection.subprotocol` | 協商後的 subprotocol |

### `onClosed`

當已建立的連線關閉時觸發。

實用欄位：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`、`client` 或 `unknown` |
| `$nodeLabel.close.code` | WebSocket 關閉代碼 |
| `$nodeLabel.close.reason` | 關閉原因 |
| `$nodeLabel.close.wasClean` | 正常 `1000` 關閉時為 `true` |
| `$nodeLabel.close.reconnecting` | 節點是否會嘗試重新連線 |

## Trigger 語意

- 一個作用中的節點會維持一條長生命週期的對外 socket 連線。
- 此連線僅在 leader worker 上執行，類似於 [IMAP Trigger](./imap-trigger-node.md) 與 [RabbitMQ](./rabbitmq-node.md) 的接收模式。
- 若啟用重新連線，Heym 會等待 `retryWaitSeconds`，並於中斷後再次開啟 socket。
- 每個發出的事件都會建立一次獨立的 Workflow 執行，並帶有 `trigger_source = "websocket"`。

## 出口安全

- 預設情況下，URL 必須使用 `ws://` 或 `wss://`，且僅能解析至公開位址。Loopback、私有、link-local、multicast 及雲端 metadata 目的地皆會被封鎖。
- Heym 會在每次重新連線時重新驗證 DNS、驗證每個解析後的位址，並直接連線至其中一個位址。當防護機制啟用時，環境 Proxy 與 WebSocket 重導向皆會被停用。
- 永久性的政策違規會停止 Trigger，而非無限重試。暫時性的 DNS 或網路失敗仍會依節點的 retry 設定處理。
- 支援 `Authorization`、`Origin`、`User-Agent` 及自訂資料 headers。`Origin` 會透過 WebSocket 客戶端的專用選項傳送。`Host`、`Connection`、`Upgrade` 及 `Sec-WebSocket-*` headers 無法被覆寫。
- 有意連線至內部服務的可信任自架部署可設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在託管或多租戶部署上請維持預設值。

**v0.0.105 升級注意事項：** 此執行個體層級的政策現在也保護由 Jira、Sentry、GitHub、Grist、Supabase、ClickHouse、自訂 LLM 執行與模型探索、AI 助理、guardrails 及 RAG embeddings 所使用的 credential 衍生目的地。既有的 credential 若指向 loopback、私有或 link-local 位址，將被拒絕，除非在可信任的自架執行個體上啟用 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。當防護機制開啟時，受防護的 HTTP 客戶端會忽略 `HTTP_PROXY` 與 `HTTPS_PROXY`；啟用例外設定則會恢復它們。透過 `SSL_CERT_FILE` 或 `SSL_CERT_DIR` 設定的 Operator CA 憑證捆綁仍受支援。ClickHouse 會在連線開啟前檢查，但不會在撥號時鎖定，因為 clickhouse-connect 會自帶其 urllib3 傳輸層。

## 範例 Workflow

**外部事件串流 → 篩選 → 通知**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** 標籤：`streamEvent`
- **Condition**：`$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** 訊息：`"Realtime alert: $streamEvent.message.data.title"`
## 範例節點 JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## 相關內容

- [Trigger](../reference/triggers.md) – 背景 Trigger 架構與 `trigger_source`
- [WebSocket 傳送](./websocket-send-node.md) – 從 Workflow 步驟將資料推送至外部 socket
- [節點類型](../reference/node-types.md) – 所有節點總覽
- [第三方整合](../reference/integrations.md) – 哪些節點使用憑證，哪些不使用
