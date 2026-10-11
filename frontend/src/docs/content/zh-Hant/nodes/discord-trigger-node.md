# Discord Trigger

**Discord Trigger** 節點是一個零輸入的進入點，可接收 Discord Interactions API webhook 並自動啟動 Workflow。適用於斜線指令、按鈕、模態視窗，以及其他應流入下游 AI 或整合節點的 Discord 應用程式互動。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.interaction`、`$nodeLabel.type`、`$nodeLabel.data`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` 認證，內含 Discord 應用程式公開金鑰 |

## 設定指南

### 1. 建立 `discord_trigger` 認證

1. 前往 **Settings → Credentials → New Credential**
2. 選擇類型 **Discord Trigger (Public Key)**
3. 從 Discord Developer Portal 貼上 **Application Public Key**：
   - **Your application → General Information → Public Key**
4. 儲存認證

### 2. 將節點新增至您的 Workflow

1. 將 **Discord Trigger** 拖曳至畫布上
2. 選取該節點以開啟 Properties 面板
3. 選擇您的 `discord_trigger` 認證
4. 複製節點面板中顯示的 **Interactions URL**

### 3. 在 Discord 中註冊 Interactions Endpoint

1. 開啟 [Discord Developer Portal](https://discord.com/developers/applications)
2. 選取您的應用程式
3. 前往 **General Information** 或 **Interactions**
4. 將節點的 **Interactions Endpoint URL** 貼上至 endpoint 欄位
5. Discord 會傳送 `PING` 請求以驗證 endpoint，Heym 在驗證簽章後會自動回應
6. 儲存您的變更

## 輸出欄位

節點觸發後，下游節點可存取：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.interaction` | 完整的 Discord interaction payload |
| `$nodeLabel.type` | Interaction 類型 |
| `$nodeLabel.data` | 指令、按鈕或模態視窗 payload |
| `$nodeLabel.data.name` | 斜線指令名稱（若適用） |
| `$nodeLabel.data.options` | 斜線指令選項陣列 |
| `$nodeLabel.headers` | 經過清理的 webhook headers |
| `$nodeLabel.triggered_by` | Trigger 來源標籤（`"Discord"`） |
| `$nodeLabel.trigger_node_id` | 接收 Discord interaction 的畫布節點 ID |
| `$nodeLabel.triggered_at` | 此 Workflow 執行的 ISO 時間戳記 |

## 範例 Workflow

**Discord 斜線指令 → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** 標籤：`discordEvent`
- **LLM** 使用者訊息：`"Reply to this Discord command: $discordEvent.data.name"`
- **Output** 訊息：`$llm.text`

## 安全性

- 請求會使用您應用程式的公開金鑰，透過 **Ed25519** 進行驗證
- 超過 **5 分鐘** 的時間戳記會被拒絕，以降低重播攻擊風險
- 敏感 headers（`x-signature-ed25519`、`authorization` 等）會在資料送達下游節點前移除
- 此 Trigger 需要有效的 `discord_trigger` 認證；若認證缺少或無效，請求將被拒絕

## 備註

- Heym 會立即回傳延遲的 Discord 回應，於背景執行 Workflow，並在 `Output` 節點產生內容時，將最終 Workflow 輸出以 Discord follow-up 形式張貼
- interactions URL 由節點 ID 衍生而來，即使 Workflow 重新命名仍保持穩定
- 僅當您除了 interaction follow-up 之外，還想要另外的 webhook 貼文時，才使用一般的 [Discord Node](./discord-node.md)
- 通常一個 `discordTrigger` 節點即已足夠；請於下游使用 **Switch** 或 **Condition** 來路由不同的 interaction 類型

## 相關

- [Discord Node](./discord-node.md) – 傳送對外的 Discord 訊息
- [Triggers](../reference/triggers.md) – 所有 Workflow 進入點概觀
- [Third-Party Integrations](../reference/integrations.md) – Discord 認證設定
- [Credentials Tab](../tabs/credentials-tab.md) – 新增與管理 `discord_trigger` 認證
