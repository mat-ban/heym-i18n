# Telegram Trigger

Węzeł **Telegram Trigger** to punkt wejściowy bez danych wejściowych, który uruchamia workflow, gdy bot Telegram otrzyma aktualizację przez Webhook. Zastosowanie obejmuje chatboty, triage zgłoszeń wsparcia, komendy w stylu slash oraz wywołania zwrotne przycisków inline, które powinny być przekazywane do dalszych węzłów AI i integracyjnych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania typu `telegram` zawierające token bota oraz opcjonalny token tajny Webhook |

## Przewodnik konfiguracji

### 1. Utwórz dane logowania typu `telegram`

1. Przejdź do **Settings → Credentials → New Credential**
2. Wybierz typ **Telegram Bot**
3. Wklej **Bot Token** z BotFather
4. Opcjonalnie ustaw **Webhook Secret Token**, jeśli Telegram ma wysyłać pasujący nagłówek weryfikacyjny
5. Zapisz dane logowania

### 2. Dodaj węzeł do workflow

1. Przeciągnij **Telegram Trigger** na canvas
2. Wybierz węzeł, aby otworzyć panel właściwości
3. Wybierz swoje dane logowania typu `telegram`
4. Skopiuj **Webhook URL** wyświetlany w panelu węzła

### 3. Zarejestruj Webhook w Telegramie

Użyj metody `setWebhook` z Bot API, podając URL z węzła:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Jeśli w Heym skonfigurowano token tajny, należy przesłać tę samą wartość podczas ustawiania Webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Pola wyjściowe

Po uruchomieniu węzła dalsze węzły mogą uzyskać dostęp do:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.update` | Pełny Payload aktualizacji Telegram |
| `$nodeLabel.message` | Główny obiekt typu message z aktualizacji |
| `$nodeLabel.message.text` | Treść wiadomości przychodzącej |
| `$nodeLabel.message.chat.id` | ID czatu do odpowiedzi w dalszych węzłach |
| `$nodeLabel.message.from.id` | ID użytkownika Telegram |
| `$nodeLabel.callback_query` | Payload wywołania zwrotnego, gdy aktualizacja pochodzi z klawiatury inline |
| `$nodeLabel.headers` | Oczyszczone nagłówki Webhook |
| `$nodeLabel.triggered_by` | Etykieta źródła Trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID węzła na canvas, który otrzymał aktualizację Telegram |
| `$nodeLabel.triggered_at` | Znacznik czasu ISO dla tego wykonania workflow |

## Przykładowy workflow

**Wiadomość Telegram → LLM → odpowiedź Telegram**

```
telegramTrigger → llm → telegram
```

- Etykieta **Telegram Trigger**: `telegramEvent`
- Wiadomość użytkownika **LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId **Telegram**: `$telegramEvent.message.chat.id`

## Bezpieczeństwo

- Jeśli dane logowania zawierają `secret_token`, Heym weryfikuje nagłówek `x-telegram-bot-api-secret-token` przed uruchomieniem workflow.
- Wrażliwe nagłówki żądania są usuwane, zanim Payload dotrze do dalszych węzłów.
- URL Webhook jest stały dla danego ID węzła, więc ponowna rejestracja jest wymagana tylko w przypadku zmiany samego węzła.

## Powiązane

- [Telegram Node](./telegram-node.md) – Wysyłanie odpowiedzi lub powiadomienia wychodzącego
- [Triggers](../reference/triggers.md) – Przegląd wszystkich punktów wejściowych workflow
- [Third-Party Integrations](../reference/integrations.md) – Konfiguracja danych logowania Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i zarządzanie danymi logowania typu `telegram`
