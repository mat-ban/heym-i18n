# Slack Trigger

Węzeł **Slack Trigger** to punkt wejściowy bez danych wejściowych, który odbiera webhooki Slack Events API i automatycznie uruchamia workflow. Obsługuje wyzwanie weryfikacji URL Slacka oraz weryfikuje sygnatury żądań za pomocą signing secret.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania `slack_trigger` zawierające signing secret |

## Przewodnik konfiguracji

### 1. Utwórz dane logowania `slack_trigger`

1. Przejdź do **Settings → Credentials → New Credential**
2. Wybierz typ **Slack Trigger (Signing Secret)**
3. Wklej **Signing Secret** z aplikacji Slack:
   - W Slacku: **App settings → Basic Information → App Credentials → Signing Secret**
4. Zapisz dane logowania

### 2. Dodaj węzeł do workflow

1. Otwórz canvas workflow
2. Przeciągnij **Slack Trigger** z panelu węzłów na canvas
3. Kliknij węzeł, aby otworzyć panel właściwości
4. Wybierz swoje dane logowania `slack_trigger`
5. Skopiuj **Webhook URL** wyświetlony w panelu

### 3. Skonfiguruj aplikację Slack

1. W ustawieniach aplikacji Slack przejdź do **Event Subscriptions**
2. Włącz opcję **Enable Events**
3. Wklej Webhook URL w polu **Request URL**
4. Slack wysyła wyzwanie weryfikacji URL — Heym odpowiada automatycznie w ciągu milisekund
5. Pole zmienia kolor na zielony: ✓ Verified
6. Zasubskrybuj potrzebne **Bot Events** (np. `message.channels`, `reaction_added`)
7. Zapisz zmiany i w razie potrzeby ponownie zainstaluj aplikację w swoim workspace

## Pola wyjściowe

Po uruchomieniu węzła kolejne węzły mogą uzyskać dostęp do:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.event` | Pełny obiekt zdarzenia Slack |
| `$nodeLabel.event.type` | Typ zdarzenia (np. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Treść wiadomości (jeśli dotyczy) |
| `$nodeLabel.event.user` | ID użytkownika Slack, który wywołał zdarzenie |
| `$nodeLabel.event.channel` | ID kanału |
| `$nodeLabel.event.ts` | Znacznik czasu zdarzenia |
| `$nodeLabel.headers` | Oczyszczone nagłówki HTTP ze Slacka |
| `$nodeLabel.triggered_by` | Etykieta źródła triggera (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID węzła na canvas, który odebrał zdarzenie Slack |

## Przykładowy workflow

**Wiadomość Slack → odpowiedź LLM → wysyłka Slack:**

```
slackTrigger → llm → slack
```

- Etykieta **slackTrigger**: `slackEvent`
- Wiadomość użytkownika **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Wiadomość **Slack**: `$llm.text`

## Bezpieczeństwo

- Żądania są weryfikowane za pomocą **HMAC-SHA256** z użyciem signing secret
- Znaczniki czasu starsze niż **5 minut** są odrzucane (zapobieganie atakom replay)
- Wrażliwe nagłówki (`x-slack-signature`, `authorization` itp.) są usuwane, zanim dotrą do kolejnych węzłów
- Jeśli nie ustawiono danych logowania, węzeł działa bez weryfikacji — zalecane wyłącznie do testów lokalnych

## Uwagi

- Heym odpowiada natychmiast `200 OK` i uruchamia workflow w tle — spełnia to wymóg 3-sekundowej odpowiedzi Slacka
- Webhook URL jest wyprowadzany z ID węzła i nigdy się nie zmienia, nawet po zmianie nazwy workflow
- Wystarczy jeden węzeł `slackTrigger` na workflow; do routowania różnych typów zdarzeń należy użyć węzłów **Switch** lub **Condition** w dalszej części workflow
