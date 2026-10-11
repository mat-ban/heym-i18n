# Discord

**Discord** 節點會透過 Incoming Webhook 將訊息傳送至 Discord 頻道。可用於警示、Workflow 通知、類機器人回覆以及錯誤回報。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`、`$nodeLabel.response`、`$nodeLabel.message`、`$nodeLabel.username`、`$nodeLabel.avatar_url` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 內含 incoming webhook URL 的 `discord` 認證 |
| `message` | expression | 傳出的訊息文字。支援 [expressions](../reference/expression-dsl.md)。 |
| `username` | expression | 此訊息的選用顯示名稱覆寫 |
| `avatarUrl` | expression | 此訊息的選用頭像 URL 覆寫 |

## 設定

1. 建立 [Discord Webhook 認證](../reference/integrations.md#discord)
2. 將 **Discord** 節點新增至您的 Workflow
3. 選擇認證
4. 將 `message` 設為傳出文字，或由上游資料建構的範本
5. 可選擇性覆寫顯示的 `username` 與 `avatarUrl`

## 範例

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## 輸出欄位

| Expression | 說明 |
|------------|-------------|
| `$nodeLabel.status` | Discord 傳回的 HTTP 狀態碼，成功時通常為 `204` |
| `$nodeLabel.response` | Discord webhook 傳回的原始回應主體 |
| `$nodeLabel.message` | Heym 所傳送的訊息文字 |
| `$nodeLabel.username` | 隨 webhook 傳送的使用者名稱（若有提供） |
| `$nodeLabel.avatar_url` | 隨 webhook 傳送的頭像 URL（若有提供） |

## 常見模式

- 當您想在互動回覆之外額外發布頻道訊息時，可與 [Discord Trigger](./discord-trigger-node.md) 搭配使用
- 從 [Error Handler](./error-handler-node.md) 傳送失敗通知
- 發布由 [LLM](./llm-node.md) 或 [Agent](./agent-node.md) 產生的摘要

## 出口安全

- 儲存於認證中的 webhook URL 必須使用 `http://` 或 `https://`，且僅能解析至公開位址。Loopback、私人、link-local、multicast 以及雲端中介資料（cloud-metadata）目的地皆會被封鎖。
- Heym 會驗證解析後的位址，並在傳送前固定連線目標，因此 DNS 回應無法在檢查後將請求移至內部位址。防護機制啟用期間會停用環境 Proxy，且不會跟隨重新導向。
- 若部署環境需要傳送至內部 webhook 接收端，可在受信任的自架執行個體上設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在託管或多租用戶部署環境中請維持預設值。

**v0.0.109 升級注意事項：** 此檢查為 Discord 新增項目。若認證的 webhook URL 指向 loopback 或私人位址，除非啟用上述設定，否則將被拒絕。

## 相關資訊

- [Discord Trigger](./discord-trigger-node.md) – 從傳入的 Discord 互動啟動 Workflow
- [Third-Party Integrations](../reference/integrations.md) – Discord 認證設定
- [Credentials Tab](../tabs/credentials-tab.md) – 新增與管理 `discord` 認證
- [Node Types](../reference/node-types.md) – 所有節點類型概觀
