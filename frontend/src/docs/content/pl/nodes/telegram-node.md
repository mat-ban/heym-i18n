# Telegram

Węzeł **Telegram** wysyła wiadomość przez Telegram Bot API. Należy go użyć do odpowiedzi w czacie, alertów operacyjnych, aktualizacji statusu workflow lub dowolnego kolejnego kroku, który powinien wysłać wiadomość do użytkownika, grupy lub kanału Telegram.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania `telegram` zawierające token bota |
| `chatId` | expression | ID docelowego czatu, grupy lub kanału |
| `message` | expression | Tekst wiadomości wychodzącej. Obsługuje [wyrażenia](../reference/expression-dsl.md). |

## Konfiguracja

1. Utwórz [dane logowania Telegram Bot](../reference/integrations.md#telegram)
2. Dodaj węzeł **Telegram** do swojego workflow
3. Wybierz dane logowania
4. Ustaw `chatId` na statyczne ID czatu lub wyrażenie takie jak `$telegramEvent.message.chat.id`
5. Ustaw `message` na tekst wychodzący lub szablon zbudowany z danych pochodzących z wcześniejszych kroków

## Przykład

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

## Pola wyjściowe

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` w przypadku sukcesu |
| `$nodeLabel.ok` | Flaga sukcesu Telegram API |
| `$nodeLabel.result` | Surowy obiekt wyniku `sendMessage` zwrócony przez Telegram |
| `$nodeLabel.result.message_id` | ID wiadomości Telegram |
| `$nodeLabel.result.chat.id` | ID docelowego czatu zwrócone przez Telegram |

## Typowe wzorce

- Połącz go z [Telegram Trigger](./telegram-trigger-node.md) w celu tworzenia botów konwersacyjnych
- Wysyłaj powiadomienia o błędach z [Error Handler](./error-handler-node.md)
- Publikuj podsumowania generowane przez [LLM](./llm-node.md) lub [Agent](./agent-node.md)

## Powiązane

- [Telegram Trigger](./telegram-trigger-node.md) – Uruchamianie workflow na podstawie przychodzących wiadomości bota
- [Third-Party Integrations](../reference/integrations.md) – Konfiguracja danych logowania Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i zarządzanie danymi logowania `telegram`
- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
