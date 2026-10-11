# RabbitMQ

Node **RabbitMQ** mengirim atau menerima pesan dari queue dan exchange RabbitMQ. Gunakan node ini untuk workflow yang digerakkan oleh pesan dan pemrosesan event.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial RabbitMQ dari [Credentials](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Jenis operasi |
| `rabbitmqExchange` | string | Nama exchange (opsional untuk send) |
| `rabbitmqRoutingKey` | string | Routing key (untuk send) |
| `rabbitmqQueueName` | string | Nama queue (wajib untuk receive, opsional untuk send) |
| `rabbitmqMessageBody` | expression | Isi pesan untuk send (mendukung expression) |
| `rabbitmqDelayMs` | number | Header x-delay dalam ms (plugin delayed message) |

## Operasi

### Send

Mempublikasikan pesan ke queue atau exchange.

| Field | Wajib | Deskripsi |
|-------|----------|-------------|
| `rabbitmqMessageBody` | ya | Body JSON atau string |
| `rabbitmqQueueName` | opsional | Target queue langsung |
| `rabbitmqExchange` | opsional | Nama exchange |
| `rabbitmqRoutingKey` | opsional | Routing key |
| `rabbitmqDelayMs` | opsional | Delay dalam milidetik |

**Output:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Mode trigger: workflow dimulai saat pesan tiba. Tidak diperlukan incoming edge saat digunakan sebagai trigger.

**Output:** `$nodeLabel.body` (payload pesan), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Contoh – Send

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

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua jenis node
- [Triggers](../reference/triggers.md) – RabbitMQ sebagai trigger workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan kredensial RabbitMQ
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – Penyiapan kredensial RabbitMQ dan detail plugin delay
