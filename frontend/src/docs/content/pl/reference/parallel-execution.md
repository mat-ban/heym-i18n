# Wykonywanie równoległe

Heym uruchamia węzły równolegle, gdy nie mają one wzajemnych zależności, oraz umożliwia jednoczesne wykonywanie wielu uruchomień workflow.

## W ramach pojedynczego uruchomienia

### Harmonogramowanie oparte na DAG

Executor grupuje węzły według **poziomu wykonania** z wykorzystaniem grafu skierowanego acyklicznego (DAG):

1. **Poziom 0** – Węzły bez krawędzi przychodzących (węzły początkowe)
2. **Poziom N** – Węzły, których wszystkie zależności nadrzędne znajdują się na poziomach 0..N-1

Węzły na tym samym poziomie nie mają wzajemnych zależności i są uruchamiane równolegle.

### Pula wątków

- **Współdzielona pula**: `ThreadPoolExecutor(max_workers=8)` do wykonywania węzłów
- **Harmonogramowanie**: `wait(..., return_when=FIRST_COMPLETED)` – gdy tylko dowolny węzeł zakończy działanie, węzły zależne są planowane do uruchomienia
- **Bezpieczeństwo wątków**: Dane wyjściowe węzłów są przechowywane z użyciem blokady (`store_node_output`)

### Pod-agenty orkiestratora

Gdy agent orkiestratora zwraca w jednej turze wiele wywołań narzędzia `call_sub_agent`, są one uruchamiane równolegle. Zobacz [Architektura agenta](./agent-architecture.md).

### Węzeł scalający

Węzeł [Merge](../nodes/merge-node.md) łączy dane wyjściowe z wielu równoległych gałęzi. Należy go użyć, gdy istnieje wyraźna potrzeba połączenia wyników; w przeciwnym razie równoległe gałęzie mogą zakończyć się w osobnych węzłach wyjściowych.

### Pętle

Iteracje pętli są wykonywane **sekwencyjnie**. Węzły tworzące ciało pętli są planowane ponownie dla każdej iteracji.

### Wczesny powrót

Węzły wyjściowe z opcją `allowDownstream` mogą zwrócić wynik wcześniej. Pozostałe zadania zależne są wykonywane w tle.

## Współbieżne uruchomienia workflow

- **Brak blokady na poziomie workflow** – Wiele żądań może jednocześnie uruchamiać ten sam workflow
- **Asynchroniczne API** – Endpointy FastAPI korzystają z `asyncio.to_thread(execute_workflow)`, dzięki czemu pętla zdarzeń pozostaje responsywna
- **Izolacja** – Każde uruchomienie otrzymuje własną instancję `WorkflowExecutor` oraz własny stan

Trigger, które uruchamiają workflow ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Edytor), każde niezależnie wywołuje `execute_workflow`.

## Strumieniowanie

Strumieniowanie wykorzystuje ten sam model równoległy, ale emituje zdarzenia w miarę zakończenia węzłów. Edytor oraz interfejs czatu portalu używają strumieniowania wewnętrznie do śledzenia postępu w czasie rzeczywistym, a użytkownicy Webhook mogą obecnie włączyć się do tego samego strumienia zdarzeń poprzez endpoint wykonywania [SSE Streaming](./sse-streaming.md).

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Równoległe wykonywanie DAG w środowisku uruchomieniowym Heym
- [Struktura workflow](./workflow-structure.md) – Węzły, krawędzie i przepływ wykonania
- [Kluczowe koncepcje](../getting-started/core-concepts.md) – Przegląd przepływu wykonania
- [Typy węzłów](./node-types.md) – Węzeł [Merge](../nodes/merge-node.md) i inne typy
- [Trigger](./triggers.md) – Punkty wejścia uruchamiające wykonania
- [SSE Streaming](./sse-streaming.md) – Format strumienia zdarzeń dla `/execute/stream`
