# WebSocket Trigger

Węzeł **WebSocket Trigger** otwiera wychodzące połączenie klienckie do zewnętrznego serwera WebSocket i uruchamia workflow, gdy wystąpią wybrane zdarzenia gniazda. Zastosowanie obejmuje strumienie zdarzeń, takie jak kanały rynkowe, telemetria czy systemy czatu. Połączenie z wewnętrznymi systemami czasu rzeczywistego wymaga opisanej poniżej rezygnacji z blokady prywatnych adresów URL.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Ważne zachowanie

- Węzeł ten łączy się **z Heym do innego serwera WebSocket**.
- **Nie** udostępnia endpointu WebSocket w Heym.
- Nie jest wymagane żadne [dane logowania](../reference/credentials.md). Adres URL, nagłówki i subprotokoły konfiguruje się bezpośrednio w węźle.
- Węzeł leader utrzymuje połączenie otwarte w tle i ponownie je nawiązuje, gdy jest to włączone.

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `websocketUrl` | string | Zewnętrzny adres URL `ws://` lub `wss://` |
| `websocketHeaders` | JSON object string | Opcjonalne nagłówki handshake |
| `websocketSubprotocols` | string | Opcjonalna lista subprotokołów rozdzielona przecinkami |
| `websocketTriggerEvents` | array | Dowolne z `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Ponowne połączenie po rozłączeniu |
| `retryWaitSeconds` | integer | Opóźnienie przed ponownym połączeniem |

## Emitowane zdarzenia

### `onMessage`

Uruchamiane, gdy z zdalnego gniazda przychodzi ramka.

Przydatne pola:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.message.data` | Sparsowany payload JSON lub surowa wartość wiadomości |
| `$nodeLabel.message.text` | Tekst zdekodowany w UTF-8, gdy jest dostępny |
| `$nodeLabel.message.base64` | Payload binarny w formacie base64 |
| `$nodeLabel.message.sizeBytes` | Rozmiar payloadu |
| `$nodeLabel.message.isJson` | Czy wiadomość została sparsowana jako JSON |

### `onConnected`

Uruchamiane po pomyślnym otwarciu gniazda.

Przydatne pola:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` przy pierwszym połączeniu, `true` przy kolejnych ponownych połączeniach |
| `$nodeLabel.connection.subprotocol` | Wynegocjowany subprotokół |

### `onClosed`

Uruchamiane, gdy ustanowione połączenie zostanie zamknięte.

Przydatne pola:

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` lub `unknown` |
| `$nodeLabel.close.code` | Kod zamknięcia WebSocket |
| `$nodeLabel.close.reason` | Przyczyna zamknięcia |
| `$nodeLabel.close.wasClean` | `true` dla normalnego zamknięcia `1000` |
| `$nodeLabel.close.reconnecting` | Czy węzeł będzie próbował ponownie się połączyć |

## Semantyka triggera

- Jeden aktywny węzeł utrzymuje jedno długotrwałe wychodzące połączenie gniazda.
- Połączenie działa wyłącznie na węźle leader, podobnie jak w trybie odbioru [IMAP Trigger](./imap-trigger-node.md) i [RabbitMQ](./rabbitmq-node.md).
- Jeśli ponowne połączenie jest włączone, Heym odczekuje `retryWaitSeconds` i ponownie otwiera gniazdo po zerwaniu.
- Każde emitowane zdarzenie tworzy osobne wykonanie workflow z `trigger_source = "websocket"`.

## Bezpieczeństwo ruchu wychodzącego

- Domyślnie adres URL musi używać `ws://` lub `wss://` i wskazywać wyłącznie adresy publiczne. Miejsca docelowe typu loopback, prywatne, link-local, multicast oraz metadane chmury są blokowane.
- Heym ponownie weryfikuje DNS przy każdym ponownym połączeniu, sprawdza każdy rozwiązany adres i łączy się bezpośrednio z jednym z nich. Proxy środowiskowe i przekierowania WebSocket są wyłączone, gdy ochrona jest aktywna.
- Trwałe naruszenia polityki zatrzymują trigger zamiast ponawiać próby w nieskończoność. Tymczasowe awarie DNS lub sieci nadal podlegają ustawieniom ponownego połączenia węzła.
- Obsługiwane są nagłówki `Authorization`, `Origin`, `User-Agent` oraz niestandardowe nagłówki danych. `Origin` jest wysyłany przez dedykowaną opcję klienta WebSocket. Nagłówki `Host`, `Connection`, `Upgrade` i `Sec-WebSocket-*` nie mogą być nadpisane.
- Zaufane wdrożenia self-hosted, które celowo łączą się z usługami wewnętrznymi, mogą ustawić `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. W przypadku wdrożeń hostowanych lub wielodostępnych należy pozostawić wartość domyślną.

**Uwaga dotycząca aktualizacji do v0.0.105:** ta polityka obejmująca całą instancję chroni teraz również miejsca docelowe pochodzące z danych logowania, używane przez Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, niestandardowe wykonywanie LLM i wykrywanie modeli, asystenta AI, guardrails oraz osadzenia RAG. Istniejące dane logowania wskazujące na adresy loopback, prywatne lub link-local są odrzucane, chyba że na zaufanej instancji self-hosted włączono `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Gdy ochrona jest aktywna, chronione klienty HTTP ignorują `HTTP_PROXY` i `HTTPS_PROXY`; włączenie rezygnacji przywraca ich działanie. Pakiety CA operatora skonfigurowane przez `SSL_CERT_FILE` lub `SSL_CERT_DIR` pozostają obsługiwane. ClickHouse jest sprawdzany przed otwarciem połączenia, ale nie jest przypinany w momencie nawiązywania połączenia, ponieważ clickhouse-connect korzysta z własnego transportu urllib3.

## Przykładowy workflow

**Zewnętrzny strumień zdarzeń → filtr → powiadomienie**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** etykieta: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** wiadomość: `"Realtime alert: $streamEvent.message.data.title"`
## Przykładowy JSON węzła

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Powiązane

- [Triggery](../reference/triggers.md) – Architektura triggerów działających w tle oraz `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Wysyłanie danych do zewnętrznego gniazda z poziomu kroku workflow
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich węzłów
- [Integracje zewnętrzne](../reference/integrations.md) – Które węzły korzystają z danych logowania, a które nie
