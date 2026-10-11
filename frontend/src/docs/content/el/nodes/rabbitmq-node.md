# RabbitMQ

Ο κόμβος **RabbitMQ** στέλνει ή λαμβάνει μηνύματα από ουρές και exchanges του RabbitMQ. Χρησιμοποιήστε τον για workflows που καθοδηγούνται από μηνύματα και για επεξεργασία συμβάντων.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (λήψη) |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο RabbitMQ από την καρτέλα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Τύπος λειτουργίας |
| `rabbitmqExchange` | string | Όνομα exchange (προαιρετικό για αποστολή) |
| `rabbitmqRoutingKey` | string | Routing key (για αποστολή) |
| `rabbitmqQueueName` | string | Όνομα ουράς (απαιτείται για λήψη, προαιρετικό για αποστολή) |
| `rabbitmqMessageBody` | expression | Σώμα μηνύματος για αποστολή (υποστηρίζει εκφράσεις) |
| `rabbitmqDelayMs` | number | Επικεφαλίδα x-delay σε ms (πρόσθετο καθυστερημένων μηνυμάτων) |

## Λειτουργίες

### Αποστολή

Δημοσιεύει ένα μήνυμα σε ουρά ή exchange.

| Πεδίο | Απαιτείται | Περιγραφή |
|-------|----------|-------------|
| `rabbitmqMessageBody` | ναι | Σώμα JSON ή string |
| `rabbitmqQueueName` | προαιρετικό | Άμεσος στόχος ουράς |
| `rabbitmqExchange` | προαιρετικό | Όνομα exchange |
| `rabbitmqRoutingKey` | προαιρετικό | Routing key |
| `rabbitmqDelayMs` | προαιρετικό | Καθυστέρηση σε χιλιοστά του δευτερολέπτου |

**Έξοδος:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Λήψη

Λειτουργία trigger: το workflow ξεκινά όταν φτάσει ένα μήνυμα. Δεν απαιτείται εισερχόμενη σύνδεση όταν χρησιμοποιείται ως trigger.

**Έξοδος:** `$nodeLabel.body` (payload μηνύματος), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Παράδειγμα – Αποστολή

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

## Σχετικά

- [Τύποι κόμβων](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Triggers](../reference/triggers.md) – Το RabbitMQ ως trigger workflow
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίων RabbitMQ
- [Ενσωματώσεις τρίτων](../reference/integrations.md#rabbitmq) – Ρύθμιση διαπιστευτηρίων RabbitMQ και λεπτομέρειες πρόσθετου καθυστέρησης
