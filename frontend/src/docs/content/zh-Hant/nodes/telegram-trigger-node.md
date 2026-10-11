# Telegram Trigger

**Telegram Trigger** 節點是一個零輸入的進入點，當你的 Telegram 機器人收到 webhook 更新時，會啟動一個 Workflow。可用於聊天機器人、支援分流、類斜線指令，或應串接至下游 AI 與整合節點的 inline 按鈕 callback。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.update`、`$nodeLabel.message`、`$nodeLabel.callback_query`、`$nodeLabel.headers`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` 認證，內含機器人 token 與選用的 webhook secret token |

## 設定指南

### 1. 建立 `telegram` 認證

1. 前往 **Settings → Credentials → New Credential**
2. 選擇類型 **Telegram Bot**
3. 貼上來自 BotFather 的 **Bot Token**
4. 若你希望 Telegram 傳送相符的驗證標頭，可選擇性設定 **Webhook Secret Token**
5. 儲存認證

### 2. 將節點加入你的 Workflow

1. 將 **Telegram Trigger** 拖曳至畫布上
2. 選取該節點以開啟 Properties 面板
3. 選擇你的 `telegram` 認證
4. 複製節點面板中顯示的 **Webhook URL**

### 3. 在 Telegram 中註冊 Webhook

使用 Bot API 的 `setWebhook` 方法，並帶入節點中的 URL：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

若你在 Heym 中設定了 secret token，請在設定 webhook 時傳送相同的值：

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## 輸出欄位

節點觸發後，下游節點可存取：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.update` | 完整的 Telegram update payload |
| `$nodeLabel.message` | update 中主要的類訊息物件 |
| `$nodeLabel.message.text` | 傳入的訊息文字 |
| `$nodeLabel.message.chat.id` | 供下游回覆使用的 Chat ID |
| `$nodeLabel.message.from.id` | Telegram 使用者 ID |
| `$nodeLabel.callback_query` | 當 update 來自 inline 鍵盤時的 callback payload |
| `$nodeLabel.headers` | 經過清理的 webhook 標頭 |
| `$nodeLabel.triggered_by` | Trigger 來源標籤（`"telegram"`） |
| `$nodeLabel.trigger_node_id` | 接收 Telegram update 的畫布節點 ID |
| `$nodeLabel.triggered_at` | 此次 Workflow 執行的 ISO 時間戳記 |

## 範例 Workflow

**Telegram 訊息 → LLM → Telegram 回覆**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** 標籤：`telegramEvent`
- **LLM** 使用者訊息：`"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId：`$telegramEvent.message.chat.id`

## 安全性

- 若你的認證含有 `secret_token`，Heym 會在執行 Workflow 前驗證 `x-telegram-bot-api-secret-token`。
- 敏感請求標頭會在 payload 抵達下游節點前移除。
- Webhook URL 對節點 ID 而言是靜態的，因此僅在節點本身變更時才需要重新註冊。

## 相關

- [Telegram Node](./telegram-node.md) – 傳送回覆或對外通知
- [Triggers](../reference/triggers.md) – 所有 Workflow 進入點概觀
- [Third-Party Integrations](../reference/integrations.md) – Telegram 認證設定
- [Credentials Tab](../tabs/credentials-tab.md) – 新增與管理 `telegram` 認證
