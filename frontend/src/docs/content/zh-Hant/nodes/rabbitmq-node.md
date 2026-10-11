# RabbitMQ

**RabbitMQ** 節點可從 RabbitMQ 佇列與交換器發送或接收訊息。適用於訊息驅動的 Workflow 與事件處理。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.status`、`$nodeLabel.message_id`、`$nodeLabel.body`（接收） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 RabbitMQ 認證 |
| `rabbitmqOperation` | `"send"` \| `"receive"` | 操作類型 |
| `rabbitmqExchange` | string | 交換器名稱（發送時為選填） |
| `rabbitmqRoutingKey` | string | 路由鍵（用於發送） |
| `rabbitmqQueueName` | string | 佇列名稱（接收時必填，發送時為選填） |
| `rabbitmqMessageBody` | expression | 發送的訊息內容（支援表達式） |
| `rabbitmqDelayMs` | number | 以毫秒為單位的 x-delay 標頭（延遲訊息外掛） |

## 操作

### 發送

將訊息發佈至佇列或交換器。

| 欄位 | 必填 | 說明 |
|-------|----------|-------------|
| `rabbitmqMessageBody` | 是 | JSON 或字串內容 |
| `rabbitmqQueueName` | 選填 | 直接指定佇列目標 |
| `rabbitmqExchange` | 選填 | 交換器名稱 |
| `rabbitmqRoutingKey` | 選填 | 路由鍵 |
| `rabbitmqDelayMs` | 選填 | 延遲毫秒數 |

**輸出：** `$nodeLabel.status`（"published"）、`$nodeLabel.message_id`、`$nodeLabel.exchange`、`$nodeLabel.routing_key`

### 接收

Trigger 模式：當訊息送達時啟動 Workflow。作為 Trigger 使用時無需傳入邊。

**輸出：** `$nodeLabel.body`（訊息 Payload）、`$nodeLabel.message_id`、`$nodeLabel.queue`

## 範例 – 發送

```json
{
  "type": "rabbitmq",
  "data": {
    "label": "publishMessage",
    "credentialId": "rabbitmq-credential-uuid",
    "rabbitmqOperation": "send",
    "rabbitmqQueueName": "tasks",
    "rabbitmqMessageBody": "$userInput.body"
  }
}
```

## 相關內容

- [節點類型](../reference/node-types.md) – 所有節點類型概觀
- [Triggers](../reference/triggers.md) – 將 RabbitMQ 作為 Workflow Trigger
- [Credentials 分頁](../tabs/credentials-tab.md) – 新增 RabbitMQ 認證
- [第三方整合](../reference/integrations.md#rabbitmq) – RabbitMQ 認證設定與延遲外掛詳細資訊
