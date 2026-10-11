# Crawler

**Crawler** 節點使用 FlareSolverr 爬取網頁，並可選擇透過 CSS 選擇器進行 HTML 擷取。適用於網頁爬取與內容擷取。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.body`（HTML 或擷取的內容） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 FlareSolverr 認證 |
| `crawlerUrl` | expression | 要爬取的 URL（支援表達式） |
| `crawlerWaitSeconds` | number | 爬取前等待的秒數（預設：0） |
| `crawlerMaxTimeout` | number | 最大逾時時間（毫秒）（預設：60000） |
| `crawlerMode` | string | `"basic"` 或其他模式 |
| `crawlerSelectors` | array | 用於擷取的 CSS 選擇器。每個項目：`{ selector, attribute? }` |

## 範例

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## 出口安全

- 儲存於認證中的 FlareSolverr URL 必須使用 `http://` 或 `https://`，且不得解析為 link-local 或雲端 metadata 位址。拒絕的集合為 `169.254.0.0/16`、`fe80::/10`、阿里雲與 AWS 的 IPv6 metadata 位址，以及可能攜帶上述其中之一位址的 IPv6 轉換形式。這是一份已知 Endpoint 的清單，並非對每個供應商的保證。
- 迴環位址與私有位址是刻意允許的，因此文件中記載的 `http://localhost:8191` 設定，以及如 `http://flaresolverr:8191` 的 compose 服務名稱皆可繼續運作。其後果是此欄位也可能被指向後端在這些位址上可觸及的任何其他服務，而回應會出現在節點輸出中。認證分享並無法遏止此情況：任何已登入的使用者都能建立自己的 FlareSolverr 認證，因此保留既有的認證並不會改變任何事。真正適用的控制措施是信任有權撰寫 Workflow 的人員，以及限制後端可觸及範圍的網路規則。
- Heym 會在連線前固定解析後的位址，因此 DNS 回應無法在檢查之後將請求移至 metadata 位址。當防護機制啟用時，環境 Proxy 會被停用，且不會跟隨重新導向。
- FlareSolverr 接著為您抓取的頁面是另一個由 FlareSolverr 自行解析的跳點。Heym 不會檢查它，因此限制 FlareSolverr 容器可連線的位置屬於您的網路政策範疇。
- 受信任的自架部署可透過 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` 解除 metadata 規則。在託管或多租戶部署上請保持預設值。

## 相關

- [Node Types](../reference/node-types.md) – 所有節點類型的概觀
- [Playwright Node](./playwright-node.md) – 瀏覽器自動化的替代方案
- [Credentials Tab](../tabs/credentials-tab.md) – 新增 FlareSolverr 認證
