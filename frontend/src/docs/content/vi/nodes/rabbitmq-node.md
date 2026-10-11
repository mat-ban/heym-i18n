# RabbitMQ

Node **RabbitMQ** gửi hoặc nhận tin nhắn từ các queue và exchange của RabbitMQ. Sử dụng node này cho các workflow hướng sự kiện và xử lý tin nhắn.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (nhận) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực RabbitMQ từ [Credentials](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Loại thao tác |
| `rabbitmqExchange` | string | Tên exchange (tùy chọn cho send) |
| `rabbitmqRoutingKey` | string | Routing key (cho send) |
| `rabbitmqQueueName` | string | Tên queue (bắt buộc cho receive, tùy chọn cho send) |
| `rabbitmqMessageBody` | expression | Nội dung tin nhắn cho send (hỗ trợ biểu thức) |
| `rabbitmqDelayMs` | number | Header x-delay tính bằng ms (delayed message plugin) |

## Các thao tác

### Send

Gửi một tin nhắn đến queue hoặc exchange.

| Trường | Bắt buộc | Mô tả |
|-------|----------|-------------|
| `rabbitmqMessageBody` | có | Nội dung JSON hoặc string |
| `rabbitmqQueueName` | tùy chọn | Đích queue trực tiếp |
| `rabbitmqExchange` | tùy chọn | Tên exchange |
| `rabbitmqRoutingKey` | tùy chọn | Routing key |
| `rabbitmqDelayMs` | tùy chọn | Độ trễ tính bằng mili giây |

**Đầu ra:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Chế độ Trigger: workflow bắt đầu khi có tin nhắn đến. Không cần incoming edge khi sử dụng làm trigger.

**Đầu ra:** `$nodeLabel.body` (payload tin nhắn), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Ví dụ – Send

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

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Triggers](../reference/triggers.md) – RabbitMQ làm trigger cho workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm thông tin xác thực RabbitMQ
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – Thiết lập thông tin xác thực RabbitMQ và chi tiết delay plugin
