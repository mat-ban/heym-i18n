# Telegram

**Telegram** 節點透過 Telegram Bot API 發送訊息。可用於聊天回覆、營運警示、Workflow 狀態更新，或任何應向 Telegram 使用者、群組或頻道發送訊息的下游步驟。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.status`、`$nodeLabel.ok`、`$nodeLabel.result` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 包含 bot token 的 `telegram` 認證 |
| `chatId` | expression | 目標聊天室、群組或頻道 ID |
| `message` | expression | 外送訊息文字。支援[表達式](../reference/expression-dsl.md)。 |

## 設定

1. 建立 [Telegram Bot 認證](../reference/integrations.md#telegram)
2. 將 **Telegram** 節點新增至您的 Workflow
3. 選擇認證
4. 將 `chatId` 設為靜態聊天室 ID 或表達式，例如 `$telegramEvent.message.chat.id`
5. 將 `message` 設為外送文字，或由上游資料建構的範本

## 範例

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## 輸出欄位

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.status` | 成功時為 `"sent"` |
| `$nodeLabel.ok` | Telegram API 成功旗標 |
| `$nodeLabel.result` | 來自 Telegram 的原始 `sendMessage` 結果物件 |
| `$nodeLabel.result.message_id` | Telegram 訊息 ID |
| `$nodeLabel.result.chat.id` | Telegram 回傳的目標聊天室 ID |

## 常見模式

- 搭配 [Telegram Trigger](./telegram-trigger-node.md) 以建構對話式 bot
- 從 [Error Handler](./error-handler-node.md) 發送錯誤通知
- 發布由 [LLM](./llm-node.md) 或 [Agent](./agent-node.md) 產生的摘要

## 相關內容

- [Telegram Trigger](./telegram-trigger-node.md) – 從傳入的 bot 訊息啟動 Workflow
- [第三方整合](../reference/integrations.md) – Telegram 認證設定
- [Credentials 分頁](../tabs/credentials-tab.md) – 新增與管理 `telegram` 認證
- [節點類型](../reference/node-types.md) – 所有節點類型概觀
