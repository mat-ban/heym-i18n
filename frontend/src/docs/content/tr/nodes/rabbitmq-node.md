# RabbitMQ

**RabbitMQ** düğümü, RabbitMQ kuyruklarından ve exchange'lerinden mesaj gönderir veya alır. Mesaj güdümlü iş akışları ve olay işleme için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıktı | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (alma) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden RabbitMQ kimlik bilgisi |
| `rabbitmqOperation` | `"send"` \| `"receive"` | İşlem türü |
| `rabbitmqExchange` | string | Exchange adı (gönderme için isteğe bağlı) |
| `rabbitmqRoutingKey` | string | Routing key (gönderme için) |
| `rabbitmqQueueName` | string | Kuyruk adı (alma için zorunlu, gönderme için isteğe bağlı) |
| `rabbitmqMessageBody` | expression | Gönderme için mesaj gövdesi (ifadeleri destekler) |
| `rabbitmqDelayMs` | number | x-delay başlığı (ms cinsinden) (delayed message plugin) |

## İşlemler

### Gönderme

Bir kuyruğa veya exchange'e mesaj yayınlar.

| Alan | Zorunlu | Açıklama |
|-------|----------|-------------|
| `rabbitmqMessageBody` | evet | JSON veya string gövde |
| `rabbitmqQueueName` | isteğe bağlı | Doğrudan kuyruk hedefi |
| `rabbitmqExchange` | isteğe bağlı | Exchange adı |
| `rabbitmqRoutingKey` | isteğe bağlı | Routing key |
| `rabbitmqDelayMs` | isteğe bağlı | Gecikme (milisaniye cinsinden) |

**Çıktı:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Alma

Trigger modu: bir mesaj geldiğinde iş akışı başlar. Trigger olarak kullanıldığında gelen bağlantı gerekmez.

**Çıktı:** `$nodeLabel.body` (mesaj payload'ı), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Örnek – Gönderme

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

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Triggers](../reference/triggers.md) – İş akışı trigger'ı olarak RabbitMQ
- [Credentials Tab](../tabs/credentials-tab.md) – RabbitMQ kimlik bilgilerini ekleme
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – RabbitMQ kimlik bilgisi kurulumu ve delay plugin ayrıntıları
