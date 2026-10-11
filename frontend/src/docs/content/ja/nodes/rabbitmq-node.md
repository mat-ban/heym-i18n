# RabbitMQ

**RabbitMQ** ノードは、RabbitMQ のキューおよび exchange との間でメッセージを送受信します。メッセージ駆動型の Workflow やイベント処理にご利用ください。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| Output | `$nodeLabel.status`、`$nodeLabel.message_id`、`$nodeLabel.body`（受信時） |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) で設定した RabbitMQ の credential |
| `rabbitmqOperation` | `"send"` \| `"receive"` | 操作タイプ |
| `rabbitmqExchange` | string | Exchange 名（送信時は任意） |
| `rabbitmqRoutingKey` | string | Routing key（送信時） |
| `rabbitmqQueueName` | string | キュー名（受信時は必須、送信時は任意） |
| `rabbitmqMessageBody` | expression | 送信するメッセージ本文（式をサポート） |
| `rabbitmqDelayMs` | number | x-delay ヘッダー（ミリ秒単位、遅延メッセージプラグイン用） |

## 操作

### 送信

キューまたは exchange にメッセージをパブリッシュします。

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `rabbitmqMessageBody` | はい | JSON または文字列の本文 |
| `rabbitmqQueueName` | 任意 | 直接のキュー送信先 |
| `rabbitmqExchange` | 任意 | Exchange 名 |
| `rabbitmqRoutingKey` | 任意 | Routing key |
| `rabbitmqDelayMs` | 任意 | 遅延時間（ミリ秒単位） |

**Output:** `$nodeLabel.status`（"published"）、`$nodeLabel.message_id`、`$nodeLabel.exchange`、`$nodeLabel.routing_key`

### 受信

Trigger モード：メッセージの到着時に Workflow が開始されます。Trigger として使用する場合、入力エッジは不要です。

**Output:** `$nodeLabel.body`（メッセージ Payload）、`$nodeLabel.message_id`、`$nodeLabel.queue`

## 例 – 送信

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

## 関連項目

- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Triggers](../reference/triggers.md) – RabbitMQ を Workflow の Trigger として使用する方法
- [Credentials Tab](../tabs/credentials-tab.md) – RabbitMQ の credential の追加
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – RabbitMQ の credential 設定と遅延プラグインの詳細
