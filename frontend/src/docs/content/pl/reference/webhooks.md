# Webhooks

Workflows mogą być uruchamiane przez webhooks HTTP. Standardowy endpoint wykonania zwraca JSON, a wariant strumieniowy zwraca Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Należy zastąpić `{workflow_id}` identyfikatorem UUID workflow. Bazowy adres URL to instancja Heym (np. `https://app.heym.ai`).

## Metoda żądania

Każdy workflow akceptuje jeden czasownik HTTP, wybierany w oknie dialogowym cURL edytora: `GET`, `POST`, `PUT` lub `DELETE`. **`POST` jest wartością domyślną**, a każdy workflow utworzony przed wprowadzeniem tego ustawienia zachowuje tę wartość, więc nic, co działa obecnie, nie ulega zmianie.

Wywołanie workflow z innym czasownikiem zwraca `405 Method Not Allowed` z nagłówkiem `Allow` wskazującym skonfigurowany czasownik:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Jeden wyjątek: żądania zawierające `?test_run=true` pomijają sprawdzenie. To właśnie wysyła przycisk **Run** w edytorze oraz panel debugowania, więc workflow ustawiony na `GET` pozostaje testowalny z poziomu produktu.

### Metody bez treści żądania

`GET` i `DELETE` nie zawierają treści żądania. Dane wejściowe pochodzą z ciągu zapytania i są odczytywane za pomocą `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Okno dialogowe cURL ukrywa edytor treści żądania i usuwa nagłówek `Content-Type` dla tych dwóch metod.

Należy połączyć `GET` z [HTML output mapper](../nodes/html-output-mapper-node.md), aby udostępnić stronę, którą przeglądarka może otworzyć bezpośrednio.

## Endpoint strumieniowy

`POST /api/workflows/{workflow_id}/execute/stream`

Endpoint strumieniowy należy stosować, gdy potrzebne są przyrostowe zdarzenia wykonania zamiast pojedynczej odpowiedzi JSON. Protokół zdarzeń oraz konfigurację komunikatu startowego dla poszczególnych węzłów opisano w sekcji [SSE Streaming](./sse-streaming.md).

## Format żądania

Treść żądania jest przekazywana jako `body` do węzłów [Input](../nodes/input-node.md). Heym akceptuje oba kształty żądania:

- **Surowy JSON** – np. `{"userId": "123", "action": "create"}`
- **Format opakowany** – `{"inputs": {...}, "test_run": false}`

W przypadku formatu opakowanego pole `inputs` jest wyodrębniane i przekazywane jako `body`. Pole `test_run` pomija ograniczanie szybkości i buforowanie odpowiedzi. Można również wysłać `?test_run=true` jako parametr zapytania podczas wysyłania surowego JSON.

## Tryby treści żądania

Każdy workflow ma ustawienie `webhook_body_mode`, które kontroluje sposób budowania przykładowych żądań przez edytor:

| Tryb | Zachowanie |
|------|----------|
| **defined** | Edytor i okno dialogowe cURL kształtują przykładową treść na podstawie pól węzła Input workflow i zachowują puste klucze w payloadzie JSON. Istniejące payloady cURL w stylu defined nadal działają. |
| **generic** | Edytor i okno dialogowe cURL używają dowolnej treści JSON. Treść żądania jest przekazywana bez zmian, dzięki czemu aplikacje zewnętrzne mogą wysyłać własny, ustalony kształt payloadu. |

API wykonania pozostaje kompatybilne wstecznie w obu trybach. Surowy JSON oraz opakowane żądania `{ "inputs": ... }` są nadal akceptowane w obu przypadkach.

Nagłówki i parametry zapytania są dostępne w wyrażeniach jako `$input.headers` oraz `$input.query`. Klucze nagłówków są zapisywane małymi literami.

## Uwierzytelnianie

Konfigurowane dla każdego workflow w edytorze (ustawienia workflow). Uwierzytelnianie jest sprawdzane przed wykonaniem.

| auth_type | Zachowanie |
|-----------|----------|
| **anonymous** | Uwierzytelnianie nie jest wymagane. Każdy może wywołać endpoint. |
| **jwt** | Wymagany token Bearer. Akceptowany jest token sesji użytkownika (użytkownik musi mieć dostęp do workflow) lub ograniczony [Execution Token](./execution-tokens.md) utworzony dla tego workflow. |
| **header_auth** | Niestandardowy nagłówek musi być zgodny. Należy ustawić `auth_header_key` (np. `X-API-Key`) oraz `auth_header_value`. |

W przypadku `header_auth` wartość nagłówka żądania musi dokładnie odpowiadać skonfigurowanej wartości. Użytkownicy JWT z dostępem do workflow mogą również wywoływać bez niestandardowego nagłówka.

W przypadku `jwt` zalecanym sposobem wywoływania workflow z systemów zewnętrznych są [Execution Tokens](./execution-tokens.md) — są one ograniczone do pojedynczego workflow i mogą być odwoływane niezależnie.

## Buforowanie odpowiedzi

Należy skonfigurować `cache_ttl_seconds` dla każdego workflow. Gdy jest ustawione i większe od 0:

- **Klucz cache**: hash SHA256 z `workflow_id` + `body` + `query`
- **Trafienie w cache**: Natychmiastowy zwrot ze `status: "cached"` i zbuforowanymi danymi wyjściowymi
- **Zapis do cache**: Tylko po udanym wykonaniu (`status: "success"`)
- **Przechowywanie**: Oparte na Postgres i współdzielone między workerami backendu

| Ustawienie | Efekt |
|---------|--------|
| `cache_ttl_seconds` = 0 lub null | Buforowanie wyłączone |
| `cache_ttl_seconds` > 0 | Odpowiedzi buforowane przez tę liczbę sekund |

Żądania `test_run` pomijają cache (bez odczytu i bez zapisu).

Gdy buforowanie odpowiedzi jest włączone w oknie dialogowym cURL, przycisk **Clear cache** natychmiast usuwa zbuforowane odpowiedzi bieżącego workflow.

## Ograniczanie szybkości

Konfigurowane dla każdego workflow: `rate_limit_requests` oraz `rate_limit_window_seconds`.

- **Zakres**: Na `workflow_id` + adres IP klienta (okno przesuwne)
- **Przekroczenie**: HTTP 429 z nagłówkiem `Retry-After`
- **Nagłówki**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Ustawienie | Opis |
|---------|-------------|
| `rate_limit_requests` | Maksymalna liczba żądań dozwolonych w oknie |
| `rate_limit_window_seconds` | Czas trwania okna w sekundach |

Żądania `test_run` pomijają ograniczanie szybkości.
<a id="concurrency-limit-and-queued-runs"></a>

## Limit współbieżności i uruchomienia w kolejce

Workflow może ograniczać liczbę jednoczesnych uruchomień produkcyjnych. Włącz **Limit współbieżności** w panelu **Properties** na poziomie workflow i ustaw **Maks. liczba równoczesnych uruchomień**. Właściciele i współpracownicy z uprawnieniami do edycji mogą to zmieniać. Limit jest domyślnie wyłączony.

Po osiągnięciu limitu nowe uruchomienia czekają w kolejce FIFO (pierwsze weszło, pierwsze wyszło). Obejmuje to każdy punkt wejścia w środowisku produkcyjnym: ten endpoint, [endpoint strumieniowy](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) oraz każdy [trigger](./triggers.md). Uruchomienia testowe z edytora zawsze startują natychmiast i nie zajmują slotu. Przesłanie `test_run=true` bez zalogowanej sesji z dostępem do otwarcia workflow nie omija kolejki.

| Ustawienie | Opis |
|---|---|
| `concurrency_limit` | Dozwolona liczba uruchomień produkcyjnych jednocześnie. `0` wyłącza limit |
| `concurrency_max_queue` | Opcjonalnie. Dozwolona liczba oczekujących uruchomień. Puste pole oznacza brak limitu |
| `concurrency_max_wait_seconds` | Opcjonalnie. Uruchomienie czekające dłużej jest oznaczane jako `expired`. Puste pole oznacza brak limitu czasu oczekiwania |

### 202 Accepted

Wywołanie uruchamiane od razu działa dokładnie tak, jak opisano w sekcji Format odpowiedzi. Wywołanie, które musi poczekać, natychmiast otrzymuje kod `202 Accepted`, niezależnie od nagłówka `X-Simple-Response`, z nagłówkiem `Location` wskazującym adres URL statusu:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Pole | Opis |
|---|---|
| `queue.position` | Miejsce tego uruchomienia w kolejce, począwszy od 1 |
| `queue.size` | Uruchomienia aktualnie oczekujące |
| `queue.running` | Uruchomienia zajmujące aktualnie slot |
| `queue.limit` | Limit współbieżności danego workflow |
| `status_token` | Tylko anonimowe workflow. Zwracane jednorazowo, w tej odpowiedzi |

### Status URL

Metoda `GET /api/workflows/{workflow_id}/executions/{execution_id}/status` zwraca stan uruchomienia. Należy ją wywoływać z tymi samymi poświadczeniami, które uruchomiły zadanie: sesją lub JWT, [tokenem wykonania](./execution-tokens.md) lub niestandardowym nagłówkiem workflow. Anonimowy workflow nie wymaga weryfikacji poświadczeń, dlatego należy przesłać `status_token` z odpowiedzi 202 w nagłówku `X-Heym-Run-Token`. Token nigdy nie jest odczytywany z query string. Błędny lub brakujący token zwraca błąd `404`, tak samo jak nieznane wykonanie.

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | Znaczenie (uruchomienie, które musi poczekać na slot współbieżności, otrzymuje zamiast tego [odpowiedź 202](#202-accepted)) |
|---|---|
| `queued` | Oczekuje na slot; obiekt `queue` pokazuje stan |
| `running` | Posiada slot i jest w trakcie wykonywania |
| `success` / `error` | Zakończono; pola `outputs` i `error` są wypełnione |
| `pending` | Wstrzymano w celu [przeglądu przez człowieka](./human-in-the-loop.md) |
| `cancelled` | Anulowano z poziomu [Historii uruchomień](./execution-history.md) |
| `expired` | Oczekiwało dłużej niż `concurrency_max_wait_seconds` i nie zostało wykonane |

Wysyłaj zapytania co kilka sekund, aż status przestanie być `queued` lub `running`. Zakolejkowane uruchomienie wykona się nawet wtedy, gdy nikt nie sprawdza jego stanu.

### Przepełniona kolejka

Gdy parametr `concurrency_max_queue` jest ustawiony i tyle uruchomień już oczekuje, wywołanie zostaje odrzucone z błędem `429 Concurrency queue is full` oraz wpisem `queue_full` w historii uruchomień. Nic nie zostaje zakolejkowane.

## Format odpowiedzi

Endpoint zwraca JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Pole | Opis |
|-------|-------------|
| `workflow_id` | UUID workflow |
| `status` | `success`, `error`, `cached` lub `rate_limited` |
| `outputs` | Dane wyjściowe węzłów końcowych. Gdy jedynym węzłem końcowym jest pojedynczy [JSON output mapper](../nodes/json-output-mapper-node.md), treścią odpowiedzi jest ten zmapowany obiekt na najwyższym poziomie (domyślne proste odpowiedzi JSON). W przeciwnym razie zawiera [Output](../nodes/output-node.md) oraz pozostałe węzły końcowe kluczowane według etykiety. |
| `execution_time_ms` | Czas wykonania w milisekundach (0 dla cached/rate_limited) |

W przypadku błędu `outputs` może zawierać szczegóły błędu. Węzeł [Throw Error](../nodes/throw-error-node.md) może ustawić niestandardowy kod statusu HTTP (4xx/5xx).

## Okno dialogowe Run with cURL

Przycisk **Run with cURL** na pasku narzędzi (w prawym górnym rogu edytora, ikona `cURL`) otwiera okno dialogowe, które buduje i kopiuje gotową do uruchomienia komendę cURL dla bieżącego workflow.

### Co robi

| Pole | Opis |
|-------|-------------|
| **Request Body Mode** | Wybierz **Defined** lub **Generic**. Tryb Generic pozostawia treść jako surowy JSON zamiast kształtować ją na podstawie pól Input. |
| **Authentication** | Wybierz Anonymous, JWT Token lub Header Auth. Ustawia odpowiedni nagłówek uwierzytelniania w komendzie. Po wybraniu JWT Token okno dialogowe wyświetla menedżer [Execution Token](./execution-tokens.md) — utwórz lub wybierz token, aby osadzić go bezpośrednio w komendzie. |
| **Header Key / Value** | Widoczne po wybraniu Header Auth. Wstępnie wypełnione na podstawie ustawień uwierzytelniania workflow. |
| **Response Cache** | Liczba minut buforowania identycznych odpowiedzi (0 = wyłączone). Zmiany są zapisywane w workflow. Po włączeniu przycisk **Clear cache** natychmiast usuwa zbuforowane odpowiedzi. |
| **Rate Limit** | Maksymalna liczba żądań w oknie czasowym. Zmiany są zapisywane w workflow. |
| **SSE Streaming** | Przełącza komendę na `/execute/stream`, dodaje `--no-buffer` i udostępnia ustawienia komunikatów `node_start` dla poszczególnych węzłów. |
| **Body** | Treść żądania JSON. W trybie Defined jest wstępnie wypełniana na podstawie pól [Input](../nodes/input-node.md) i zachowuje puste klucze. W trybie Generic jest to edytor surowego JSON. |
| **Command** | Podgląd tylko do odczytu pełnej komendy cURL. |

Kliknij **Copy cURL**, aby skopiować komendę do schowka.

### Przykład

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

W trybie Generic zagnieżdżone payloady pozostają nienaruszone, na przykład:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Okno dialogowe odzwierciedla ustawienia uwierzytelniania, trybu treści, buforowania i limitu szybkości zapisane w workflow — edycja ich w tym miejscu natychmiast aktualizuje workflow.

### SSE Streaming w oknie dialogowym

Włącz **SSE Streaming**, gdy wygenerowana komenda ma śledzić wykonanie w czasie rzeczywistym z terminala.

- Endpoint zmienia się z `/execute` na `/execute/stream`
- Komenda dodaje `--no-buffer` oraz `Accept: text/event-stream`
- Każdy węzeł niebędący sticky pojawia się na liście, gdzie można:
  - włączyć lub wyłączyć komunikat `node_start`
  - dostosować tekst komunikatu startowego
- Zdarzenia `node_complete` są zawsze emitowane i zawierają pełne dane wyjściowe węzła

Przykład:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Pełny protokół zdarzeń i przykłady znajdują się w sekcji [SSE Streaming](./sse-streaming.md).

## Tagowanie źródła Trigger

Każde wykonanie przechowuje etykietę `trigger_source` widoczną w [Execution History](./execution-history.md). Ustaw ją, wysyłając nagłówek `X-Trigger-Source` z dowolną wybraną wartością:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Przycisk **Copy cURL** w oknie dialogowym edytora automatycznie dołącza `X-Trigger-Source: API`. Wartość `API` można zastąpić dowolną znaczącą wartością — `scheduler`, `rabbitmq`, `github-actions` itp.

Jeśli nagłówek nie zostanie wysłany, `trigger_source` przyjmuje domyślnie wartość `"API"`, a uruchomienie jest oznaczane jako **API** w historii. Można to nadpisać dowolną wartością znaczącą dla danego systemu — `scheduler`, `github-actions`, `rabbitmq` itp.

## Powiązane

- [Execution Tokens](./execution-tokens.md) – Ograniczone zakresowo tokeny JWT do wywoływania workflow z systemów zewnętrznych
- [SSE Streaming](./sse-streaming.md) – Strumieniowanie zdarzeń węzłów w czasie rzeczywistym przez Server-Sent Events
- [Triggers](./triggers.md) – Wszystkie punkty wejścia workflow, w tym webhook
- [Workflow Structure](./workflow-structure.md) – Węzły i krawędzie
- [Expression DSL](./expression-dsl.md) – Dostęp do `$input.body`, `$input.headers`, `$input.query`
