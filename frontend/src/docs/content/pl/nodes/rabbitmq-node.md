# RabbitMQ

Węzeł **RabbitMQ** wysyła lub odbiera wiadomości z kolejek i wymian RabbitMQ. Należy go używać w workflow sterowanych wiadomościami oraz do przetwarzania zdarzeń.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (odbieranie) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania RabbitMQ z zakładki [Dane logowania](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Typ operacji |
| `rabbitmqExchange` | string | Nazwa wymiany (opcjonalna dla wysyłania) |
| `rabbitmqRoutingKey` | string | Klucz routingu (dla wysyłania) |
| `rabbitmqQueueName` | string | Nazwa kolejki (wymagana dla odbierania, opcjonalna dla wysyłania) |
| `rabbitmqMessageBody` | expression | Treść wiadomości dla wysyłania (obsługuje wyrażenia) |
| `rabbitmqDelayMs` | number | Nagłówek x-delay w ms (wtyczka opóźnionych wiadomości) |

## Operacje

### Wysyłanie

Publikuje wiadomość do kolejki lub wymiany.

| Pole | Wymagane | Opis |
|-------|----------|-------------|
| `rabbitmqMessageBody` | tak | Treść w formacie JSON lub string |
| `rabbitmqQueueName` | opcjonalne | Bezpośredni cel – kolejka |
| `rabbitmqExchange` | opcjonalne | Nazwa wymiany |
| `rabbitmqRoutingKey` | opcjonalne | Klucz routingu |
| `rabbitmqDelayMs` | opcjonalne | Opóźnienie w milisekundach |

**Wyjście:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Odbieranie

Tryb triggera: workflow uruchamia się w momencie nadejścia wiadomości. Gdy węzeł jest używany jako trigger, krawędź wejściowa nie jest wymagana.

**Wyjście:** `$nodeLabel.body` (payload wiadomości), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Przykład – wysyłanie

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

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Triggery](../reference/triggers.md) – RabbitMQ jako trigger workflow
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania RabbitMQ
- [Integracje zewnętrzne](../reference/integrations.md#rabbitmq) – Konfiguracja danych logowania RabbitMQ i szczegóły wtyczki opóźnień
