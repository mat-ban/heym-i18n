# WebSocket Send

Węzeł **WebSocket Send** otwiera wychodzące połączenie klienckie do zewnętrznego serwera WebSocket, wysyła jedną wiadomość i zamyka połączenie. Należy go użyć, gdy workflow musi wypchnąć zdarzenia do systemu czasu rzeczywistego bez udostępniania endpointu socket zarządzanego przez Heym.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Zewnętrzny adres URL `ws://` lub `wss://` |
| `websocketHeaders` | JSON object string / expression | Opcjonalne nagłówki handshake |
| `websocketSubprotocols` | string | Opcjonalna lista subprotokołów rozdzielona przecinkami |
| `websocketMessage` | expression | Payload do wysłania |

## Zasady serializacji wiadomości

- Jeśli `websocketMessage` przyjmuje wartość typu **string**, Heym wysyła ramkę tekstową.
- Jeśli przyjmuje wartość typu **object**, **array**, **number**, **boolean** lub `null`, Heym serializuje ją jako tekst JSON.
- Jeśli przyjmuje wartość typu **bytes**, Heym wysyła ramkę binarną.
- Pełne wyrażenia, takie jak `$input`, zachowują natywne typy przed serializacją.

## Pola wyjściowe

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` w przypadku powodzenia |
| `$nodeLabel.url` | Rozwiązany docelowy adres URL |
| `$nodeLabel.message_type` | `text`, `json` lub `binary` |
| `$nodeLabel.size_bytes` | Rozmiar payloadu w bajtach |
| `$nodeLabel.subprotocol` | Wynegocjowany subprotokół, jeśli występuje |
| `$nodeLabel.sent_at` | Znacznik czasu ISO |

## Przykładowy workflow

**Żądanie HTTP → transformacja → publikacja przez WebSocket**

```
input → set → websocketSend → output
```

- **Set** tworzy obiekt payload, taki jak `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** używa `$payloadNode` jako `websocketMessage`
- **Output** może zwrócić `$socketSend.status`

## Przykładowy JSON węzła

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Uwagi

- Ten węzeł nie wymaga [danych logowania](../reference/credentials.md).
- Jeśli zdalny serwer oczekuje nagłówków uwierzytelniających lub nagłówków tenanta, należy przekazać je przez `websocketHeaders`.
- Należy użyć [HTTP](./http-node.md), gdy zdalny system działa w modelu żądanie/odpowiedź, a nie w oparciu o socket.

## Bezpieczeństwo ruchu wychodzącego

- Domyślnie adres URL musi używać `ws://` lub `wss://` i wskazywać wyłącznie adresy publiczne. Miejsca docelowe typu loopback, prywatne, link-local, multicast oraz cloud-metadata są blokowane.
- Heym weryfikuje każdy rozwiązany adres i łączy się bezpośrednio z jednym z nich. Proxy środowiskowe oraz przekierowania WebSocket są wyłączone, gdy ochrona jest aktywna.
- Obsługiwane są nagłówki `Authorization`, `Origin`, `User-Agent` oraz niestandardowe nagłówki danych. `Origin` jest wysyłany przez dedykowaną opcję klienta WebSocket. Nagłówki `Host`, `Connection`, `Upgrade` oraz `Sec-WebSocket-*` nie mogą być nadpisane.
- Zaufane wdrożenia self-hosted, które celowo łączą się z usługami wewnętrznymi, mogą ustawić `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. W przypadku wdrożeń hostowanych lub wielodostępnych należy pozostawić wartość domyślną.

**Uwaga dotycząca aktualizacji do v0.0.105:** ta polityka obejmująca całą instancję chroni teraz również miejsca docelowe pochodzące z danych logowania, używane przez Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, niestandardowe wykonywanie LLM i odkrywanie modeli, asystenta AI, guardrails oraz embeddingi RAG. Istniejące dane logowania wskazujące na adresy loopback, prywatne lub link-local są odrzucane, chyba że na zaufanej instancji self-hosted włączono `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Gdy ochrona jest aktywna, chronione klienty HTTP ignorują `HTTP_PROXY` i `HTTPS_PROXY`; włączenie opcji opt-out przywraca ich działanie. Pakiety CA operatora skonfigurowane przez `SSL_CERT_FILE` lub `SSL_CERT_DIR` pozostają obsługiwane. ClickHouse jest sprawdzany przed otwarciem połączenia, ale nie jest przypinany w momencie nawiązywania połączenia, ponieważ clickhouse-connect korzysta z własnego transportu urllib3.

## Powiązane

- [WebSocket Trigger](./websocket-trigger-node.md) – Nasłuchiwanie zewnętrznego socketu i wyzwalanie workflow na zdarzenia
- [Typy węzłów](../reference/node-types.md) – Przegląd węzłów integracyjnych
- [Expression DSL](../reference/expression-dsl.md) – Budowanie dynamicznych payloadów JSON
- [Integracje zewnętrzne](../reference/integrations.md) – Integracje oparte na danych logowania vs konfigurowane bezpośrednio
