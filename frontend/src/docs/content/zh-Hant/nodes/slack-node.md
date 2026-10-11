# Slack

**Slack** 節點透過 Incoming Webhook 將訊息傳送至 Slack 頻道。可用於通知、警示與錯誤回報。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | 傳遞輸入 |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自[認證](../tabs/credentials-tab.md)的 Slack 認證（webhook URL） |
| `message` | expression | 訊息文字。支援[表達式](../reference/expression-dsl.md)。 |

## 設定

1. 在您的 Slack 工作區中建立 Incoming Webhook
2. 在「認證」頁籤中新增 Slack 認證，並填入 webhook URL
3. 在節點中參照該認證

## 範例

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

搭配[錯誤處理器](./error-handler-node.md)以傳送失敗通知：
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## 出口安全

- 儲存於認證中的 webhook URL 必須使用 `http://` 或 `https://`，且僅能解析至公開位址。Loopback、私人、link-local、多播及雲端中介資料（cloud-metadata）目的地皆會被封鎖。
- Heym 會驗證解析後的位址，並在傳送前固定連線目標，因此 DNS 回應無法在檢查後將請求移至內部位址。防護機制啟用期間會停用環境 Proxy，且不會跟隨重新導向。
- 若部署環境需要將訊息傳送至內部 webhook 接收端，可在受信任的自架執行個體上設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。在託管或多租戶部署環境中，請維持預設值。

**v0.0.109 升級注意事項：** 此檢查為 Slack 新增的功能。若認證的 webhook URL 指向 loopback 或私人位址，除非啟用上述設定，否則將被拒絕。

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型概觀
- [錯誤處理器](./error-handler-node.md) – 於 Workflow 失敗時傳送 Slack
- [認證頁籤](../tabs/credentials-tab.md) – 新增 Slack webhook
