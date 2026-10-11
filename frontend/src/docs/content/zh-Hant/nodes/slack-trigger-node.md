# Slack Trigger

**Slack Trigger** 節點是一個零輸入的進入點，負責接收 Slack Events API webhook 並自動啟動 workflow。它會處理 Slack 的 URL 驗證挑戰，並使用簽章密鑰驗證請求簽章。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.event`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 包含簽章密鑰的 `slack_trigger` 認證資料 |

## 設定指南

### 1. 建立 `slack_trigger` 認證資料

1. 前往 **Settings → Credentials → New Credential**
2. 選擇類型 **Slack Trigger (Signing Secret)**
3. 貼上 Slack App 中的 **Signing Secret**：
   - 在 Slack 中：**App settings → Basic Information → App Credentials → Signing Secret**
4. 儲存認證資料

### 2. 將節點新增至您的 Workflow

1. 開啟 workflow 畫布
2. 從節點面板將 **Slack Trigger** 拖曳至畫布上
3. 點擊該節點以開啟 Properties 面板
4. 選擇您的 `slack_trigger` 認證資料
5. 複製面板中顯示的 **Webhook URL**

### 3. 設定您的 Slack App

1. 在您的 Slack App 設定中前往 **Event Subscriptions**
2. 將 **Enable Events** 切換為開啟
3. 將 Webhook URL 貼上至 **Request URL** 欄位
4. Slack 會傳送 URL 驗證挑戰 — Heym 會在數毫秒內自動回應
5. 該欄位會變成綠色：✓ Verified
6. 訂閱您所需的 **Bot Events**（例如 `message.channels`、`reaction_added`）
7. 儲存您的變更，若系統提示，請將應用程式重新安裝至您的工作區

## 輸出欄位

節點觸發後，下游節點可以存取：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.event` | 完整的 Slack 事件物件 |
| `$nodeLabel.event.type` | 事件類型（例如 `"message"`、`"reaction_added"`） |
| `$nodeLabel.event.text` | 訊息文字（適用時） |
| `$nodeLabel.event.user` | 觸發事件的 Slack 使用者 ID |
| `$nodeLabel.event.channel` | 頻道 ID |
| `$nodeLabel.event.ts` | 事件時間戳記 |
| `$nodeLabel.headers` | 來自 Slack 的已清理 HTTP headers |
| `$nodeLabel.triggered_by` | Trigger 來源標籤（`"Slack"`） |
| `$nodeLabel.trigger_node_id` | 接收 Slack 事件的畫布節點 ID |

## 範例 Workflow

**Slack 訊息 → LLM 回覆 → Slack 傳送：**

```
slackTrigger → llm → slack
```

- **slackTrigger** 標籤：`slackEvent`
- **LLM** 使用者訊息：`"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** 訊息：`$llm.text`

## 安全性

- 請求會使用您的簽章密鑰透過 **HMAC-SHA256** 進行驗證
- 超過 **5 分鐘**的時間戳記會被拒絕（防止重播攻擊）
- 敏感 headers（`x-slack-signature`、`authorization` 等）會在到達下游節點前被移除
- 若未設定認證資料，節點將在未經驗證的情況下執行 — 僅建議用於本機測試

## 備註

- Heym 會立即回應 `200 OK` 並在背景執行 workflow — 這滿足了 Slack 的 3 秒回應要求
- Webhook URL 衍生自節點 ID，且永遠不會變更，即使 workflow 重新命名後亦然
- 每個 workflow 僅需一個 `slackTrigger` 節點；請在下游使用 **Switch** 或 **Condition** 節點來路由不同的事件類型
