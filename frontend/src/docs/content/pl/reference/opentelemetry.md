# Śledzenie OpenTelemetry

Heym może emitować ślady [OpenTelemetry](https://opentelemetry.io/) dla każdego uruchomienia workflow, wykonania węzła oraz wywołania narzędzia Agenta. Każde uruchomienie tworzy span główny z spanami podrzędnymi dla poszczególnych węzłów i narzędzi Agenta, dzięki czemu można zobaczyć, który krok zakończył się niepowodzeniem, ile czasu zajął, co zostało wywołane i co zostało zwrócone. Spany są eksportowane przez OTLP/HTTP do dowolnego kompatybilnego backendu, takiego jak Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic lub Grafana Cloud.

Śledzenie jest **domyślnie wyłączone**. Gdy jest wyłączone, nie występuje mierzalny narzut i nie są tworzone żadne spany.

## Włączanie śledzenia

Należy ustawić następujące zmienne środowiskowe na backendzie, a następnie uruchomić go ponownie:

Pełną listę zmiennych środowiskowych można znaleźć w sekcji [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Zmienna | Wartość domyślna | Opis |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Przełącznik główny. Ustawienie wartości `true` włącza śledzenie. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Bazowy endpoint OTLP/HTTP, na przykład `http://collector:4318`. Heym wysyła spany do `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Nagłówki `key=value` rozdzielone przecinkami na potrzeby uwierzytelniania eksportera, na przykład `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atrybut zasobu `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Współczynnik próbkowania nagłówkowego z zakresu od `0.0` do `1.0`, stosowany z samplerem opartym na rodzicu. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Gdy wartość wynosi `true`, do spanów węzłów dołączane są obcięte payloady wejściowe i wyjściowe węzła. Domyślnie wyłączone ze względu na prywatność. |

Minimalny przykład:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Aktywną konfigurację można potwierdzić w aplikacji w sekcji **Settings → Observability** (otwieranej z awatara w nagłówku). Ten panel jest tylko do odczytu i nigdy nie wyświetla sekretów eksportera.

## Co jest śledzone

### Span główny workflow

Nazwa: `heym.workflow.execute`

| Atrybut | Opis |
|-----------|-------------|
| `heym.workflow.id` | UUID workflow. |
| `heym.node.count` | Liczba węzłów w workflow. |
| `heym.workflow.test_mode` | `true` dla uruchomień testowych. |
| `heym.sub_workflow.depth` | Głębokość zagnieżdżenia w przypadku wywołania jako pod-workflow. |
| `heym.workflow.status` | Końcowy status uruchomienia. Nieudane uruchomienie ustawia status spanu na `ERROR`. |

### Span węzła

Nazwa: `heym.node.execute`, tworzony jako element podrzędny spanu workflow.

| Atrybut | Opis |
|-----------|-------------|
| `heym.node.id` | Identyfikator węzła. |
| `heym.node.type` | Typ węzła, na przykład `agent`, `llm`, `http`. |
| `heym.node.label` | Etykieta węzła wyświetlana na canvasie. |
| `heym.node.status` | `success` lub `error`. Błędy ustawiają status spanu na `ERROR`. |
| `heym.node.duration_ms` | Czas wykonania węzła w milisekundach. |
| `heym.llm.model` | Nazwa modelu dla węzłów LLM i agenta, gdy jest dostępna. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Zużycie tokenów dla węzłów LLM i agenta, gdy jest dostępne. |

Spany węzłów są prawidłowo zagnieżdżane w spanie workflow nawet wtedy, gdy węzły działają równolegle, ponieważ kontekst workflow jest propagowany do wątków roboczych.

### Span narzędzia Agenta

Nazwa: `heym.agent.tool.execute`, tworzony pod spanem aktywnego węzła Agenta.

| Atrybut | Opis |
|-----------|-------------|
| `heym.agent.tool.name` | Nazwa narzędzia wybranego przez model. |
| `heym.agent.tool.call_id` | Identyfikator wywołania narzędzia u dostawcy, gdy jest dostępny. |
| `heym.agent.tool.source` | Źródło narzędzia, takie jak `node_tool`, `mcp`, `skill` lub `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Etykieta serwera MCP, gdy ma zastosowanie. |
| `heym.agent.tool.iteration` | Iteracja pętli narzędzi Agenta. |
| `heym.agent.tool.args_bytes` | Rozmiar w UTF-8 serializowanych argumentów narzędzia. |
| `heym.agent.tool.result_bytes` | Rozmiar w UTF-8 serializowanego wyniku narzędzia. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` lub `cancelled`. Błędy narzędzia ustawiają status spanu na `ERROR`. |

Surowe argumenty i wyniki narzędzi nie są domyślnie dołączane do spanów.

## Bezpieczeństwo payloadów narzędzi Agenta

Utrwalane payloady observability Agenta są redagowane i obcinane w kodzie (`4096` znaków na ciąg, głębokość `6`, `32768` łącznych znaków na zapis śladu LLM). Całkowity budżet śladu jest dzielony między rekordy narzędzi, aby wczesny duży wynik nie mógł ukryć tożsamości i statusu cyklu życia późniejszych wywołań. Ograniczone metadane pobierania `_generated_files` są rezerwowane oddzielnie od obszernego wyniku umiejętności:

- Sekcje narzędzi `request` / `response` w śladzie LLM, w tym kopie `_hitl_pending` zapisywane do magazynu śladów
- Rekordy `tool_calls` wyniku Agenta wyświetlane w historii wykonań
- Zdarzenia wyników narzędzi w panelu Live Debug, które wykorzystują ten sam ograniczony, oczyszczony rekord

Aktywne wykonywanie narzędzi, komunikaty narzędzi powiązane z modelem oraz stan wznowienia HITL w pamięci (`_hitl_pending.agent_state.messages` / `tool_arguments`) zachowują oryginalne wartości, dzięki czemu wznowienie i dokładne dopasowanie argumentów nadal działają. Oczyszczane są wyłącznie przechowywane kopie observability.
## Propagacja kontekstu Trace

Heym stosuje standard [W3C Trace Context](https://www.w3.org/TR/trace-context/), dzięki czemu ślady pozostają spójne na granicach między usługami.

- **Webhooki przychodzące:** gdy przychodzące żądanie zawiera nagłówek `traceparent`, uruchomienie workflow jest rejestrowane jako element podrzędny tego śladu. Wiąże to uruchomienia Heym z systemem nadrzędnym, który je wywołał.
- **Wychodzące HTTP:** węzeł HTTP wstrzykuje `traceparent` do wysyłanych żądań, dzięki czemu usługi podrzędne mogą kontynuować ten sam ślad.
- **Podworkflow:** uruchomienie podworkflow jest podporządkowane węzłowi, który je wywołał, zachowując hierarchię wywołań w ramach jednego śladu.

Triggery bez kontekstu przychodzącego (takie jak Cron, IMAP, RabbitMQ i WebSocket) rozpoczynają nowy ślad dla każdego uruchomienia.

## Niezawodność

- Wolny lub nieosiągalny kolektor nigdy nie blokuje wykonania workflow. Spany są grupowane w partie i eksportowane w tle.
- Jeśli inicjalizacja śledzenia się nie powiedzie (na przykład z powodu błędnego endpointu), backend rejestruje błąd i kontynuuje działanie z wyłączonym śledzeniem, zamiast odmówić uruchomienia.
- Nagłówki uwierzytelniające OTLP są odczytywane wyłącznie ze środowiska. Nigdy nie są przechowywane w bazie danych ani zwracane przez API statusu.

## Powiązane

- [Ustawienia](./user-settings.md) – Zakładka Observability, która wyświetla status śledzenia
- [Zmienne środowiskowe](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pełne odniesienie konfiguracji
- [Triggery](./triggers.md) – Jak uruchamiane są workflow, w tym webhooki
- [Historia wykonań](./execution-history.md) – Wbudowany w Heym widok historii poszczególnych uruchomień
- [HTTP](../nodes/http-node.md) – Węzeł, który propaguje kontekst trace do wywołań podrzędnych
