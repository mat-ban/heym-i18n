# Architektura agenta

[Węzeł agenta](../nodes/agent-node.md) obsługuje subagentów, podworkflow, narzędzia węzłów canvas, wzorzec orkiestratora, umiejętności, połączenia MCP, wywoływanie narzędzi, opcjonalną [pamięć trwałą](./agent-persistent-memory.md) (na węzeł canvas, z opcjonalnym udostępnianiem innym agentom) oraz opcjonalną [weryfikację przez człowieka](./human-in-the-loop.md). Ta strona opisuje architekturę.

## Subagenci

Subagenci to węzły agentów, które orkiestrator może wywoływać za pomocą narzędzia `call_sub_agent`.

- **Orkiestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Subagenci**: Muszą używać `$input.text` w swoim komunikacie użytkownika, aby otrzymać prompt orkiestratora
- **Narzędzie**: `call_sub_agent` z `sub_agent_label` (enum) oraz `prompt`
- **Limit głębokości**: Maksymalnie 5 zagnieżdżonych wywołań subagentów

### Przepływ wykonania

1. Orkiestrator decyduje o wywołaniu subagenta
2. `_execute_sub_agent_tool` znajduje docelowego agenta po etykiecie
3. Buduje `synthetic_inputs = {"input": {"text": prompt}}`
4. Uruchamia `_execute_agent_node` dla subagenta
5. Wynik jest zwracany do orkiestratora

### Równoległe wykonywanie subagentów

Gdy orkiestrator zwróci wiele wywołań narzędzia `call_sub_agent` w jednej turze, są one wykonywane **równolegle**. Na przykład, jeśli użytkownik pyta o „Paryż", a orkiestrator wywołuje zarówno `distanceAgent`, jak i `foodAgent`, oba działają współbieżnie zamiast sekwencyjnie.

- **Korzyść**: Całkowity czas jest w przybliżeniu równy czasowi najwolniejszego subagenta, a nie sumie wszystkich.
- **Wskazówka**: Należy zachęcać orkiestrator do wywoływania wielu subagentów w jednej turze, gdy zadanie tego wymaga.

## Podworkflow

Gdy skonfigurowano `subWorkflowIds`, agent może wywoływać inne workflow za pomocą narzędzia `call_sub_workflow`.

- **Konfiguracja**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Narzędzie**: `call_sub_workflow` z `workflow_id` (enum) oraz `inputs` (obiekt)
- **Limit głębokości**: Maksymalnie 5 zagnieżdżonych wywołań podworkflow

### Przepływ wykonania

1. Agent decyduje o wywołaniu podworkflow
2. `_execute_sub_workflow_tool` pobiera workflow z `workflow_cache`
3. Buduje `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Uruchamia `WorkflowExecutor.execute()` dla podworkflow
5. Wynik jest zwracany do agenta

Podworkflow nie mogą wstrzymywać się na potrzeby HITL w wersji 1. Jeśli zagnieżdżone podworkflow próbuje wejść w stan oczekującej weryfikacji, wykonanie kończy się niepowodzeniem zamiast zawieszenia wewnątrz zagnieżdżonego wywołania.

## Narzędzia węzłów canvas

Narzędzia węzłów canvas to węzły workflow połączone z agentem poprzez uchwyt `tool-input`. Podczas konfiguracji agenta `_build_node_tool_schemas` skanuje te krawędzie i dodaje jeden schemat narzędzia zgodny z OpenAI dla każdego połączonego węzła.

- **Źródło narzędzia**: `_source: "node_tool"`
- **Nazwa narzędzia**: pochodzi od etykiety połączonego węzła, z sufiksami dodawanymi w przypadku duplikatów
- **Parametry narzędzia**: budowane na podstawie `agentProvidedFields` węzła
- **Pola stałe**: wszystkie pola węzła niewymienione w `agentProvidedFields` pozostają w konfiguracji węzła

### Przepływ wykonania

1. Agent decyduje o wywołaniu narzędzia połączonego węzła
2. `_execute_node_tool` kopiuje dane węzła
3. Argumenty dostarczone przez agenta są scalane ze skonfigurowanymi polami węzła
4. `execute_node` uruchamia ten węzeł jednokrotnie z wyłączonym harmonogramowaniem gałęzi
5. Oryginalne dane węzła są przywracane
6. Wynik węzła jest zwracany do agenta jako rezultat narzędzia

Węzły narzędzi są wykluczone z normalnego harmonogramowania workflow, aby nie uruchamiały się dwukrotnie. Wykonują się wyłącznie poprzez ścieżkę wywołania narzędzia agenta.

## Weryfikacja przez człowieka (Human-in-the-Loop)

Gdy na agencie ustawiono `hitlEnabled`, agent otrzymuje narzędzie `request_human_review`, które może wywołać w określonych punktach kontrolnych zatwierdzania.

1. Prompt systemowy i wytyczne HITL węzła informują agenta, które działania wymagają zatwierdzenia
2. Gdy agent osiąga jeden z tych kroków, wywołuje `request_human_review`
3. Heym przechowuje migawkę wykonania workflow i tworzy publiczne żądanie weryfikacji
4. Wynik węzła jest oznaczany jako `pending` wraz z adresem URL weryfikacji
5. Uchwyt wyjściowy `review` agenta jest natychmiast harmonogramowany, aby gałęzie powiadomień mogły działać z oczekującym payloadem
6. Główne harmonogramowanie wykonania zatrzymuje się do momentu odpowiedzi weryfikującego
7. Przy `accept`, `edit` lub `refuse` executor jest odbudowywany z przechowywanej migawki
8. Wstrzymany agent kontynuuje z zatwierdzonym kontekstem weryfikacji lub kończy natychmiast przy `refuse`
9. Węzły niższego poziomu kontynuują po zakończeniu wznowionego agenta, bez ponownego uruchamiania gałęzi `review`
10. Jeśli późniejsze działanie również wymaga zatwierdzenia, agent może utworzyć kolejny punkt kontrolny HITL w tym samym uruchomieniu

Podsumowanie dla weryfikującego jest generowane na podstawie samego żądania weryfikacji, dzięki czemu pole węzła może pozostać skupione na polityce zatwierdzania i czasie.

Pozwala to workflow agenta oczekiwać na zewnętrzne zatwierdzenie przy zachowaniu historii konwersacji, ukończonych wyników węzłów, stanu pętli i innego kontekstu wykonania.

## Executor narzędzi orkiestratora

Niestandardowy executor narzędzi kieruje:

- **Wywołania subagentów** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Wywołania podworkflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Narzędzia węzłów canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Weryfikacja przez człowieka** (`_source == "hitl"`) → tworzy oczekujący punkt kontrolny HITL
- **Pozostałe narzędzia** → `_unified_tool_executor` (Python, MCP, narzędzia umiejętności)

Jest używany, gdy włączono HITL, gdy ustawiono `isOrchestrator` z `subAgentLabels` lub gdy skonfigurowano `subWorkflowIds`.
## Umiejętności

Umiejętności rozszerzają kontekst systemowy agenta i mogą dodawać narzędzia Python.

- **Struktura**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Zawartość**: Dołączana na początku instrukcji systemowej (łączona za pomocą `---`)
- **Narzędzia Python**: Dla każdej umiejętności z plikami `.py` dodawane jest narzędzie `skill_{skill_name}`
- **Wykonanie**: `skill_python_executor.py` uruchamia skrypty za pomocą `uv run python` w katalogu tymczasowym; argumenty jako JSON na standardowym wejściu, wynik jako JSON na standardowym wyjściu

Umiejętności można dodawać, przeciągając plik `.zip` lub `.md` na obszar Skills w konfiguracji [Węzła agenta](../nodes/agent-node.md).

## MCP Client

Klient MCP (Model Context Protocol) łączy się z zewnętrznymi serwerami narzędzi.

- **Transporty**: `stdio` (polecenie + argumenty) lub `sse` (url + nagłówki)
- **Lista narzędzi**: `list_mcp_tools` → `ClientSession.list_tools()` → konwersja do formatu funkcji OpenAI z `_source: "mcp"`
- **Wykonanie**: `execute_mcp_tool` → `ClientSession.call_tool()` → wynik przez `_extract_tool_result`

Połączenia MCP należy konfigurować w [Zakładce MCP](../tabs/mcp-tab.md) lub w polu `mcpConnections` węzła agenta.

## Wywoływanie narzędzi

Usługa LLM uruchamia pętlę `execute_with_tools`:

1. **Sprawdzenie kompresji kontekstu** — przed każdą iteracją należy oszacować zużycie tokenów i w razie potrzeby przeprowadzić kompresję (patrz poniżej)
2. Wywołanie modelu z `tools` i `tool_choice: "auto"`
3. Jeśli istnieją `tool_calls`: dla każdego wywołania uruchamiane jest `tool_executor(tool_def, name, args, timeout)`
4. Dołączenie wyniku narzędzia do wiadomości, powtórzenie
5. Zatrzymanie, gdy nie ma więcej wywołań narzędzi lub osiągnięto `max_tool_iterations`

### Dyspozycja narzędzi

`_unified_tool_executor` kieruje według `_source`:

| Źródło | Procedura obsługi |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (domyślnie) | `execute_tool` (narzędzia kodu Python) |

Narzędzia używają formatu wywoływania funkcji OpenAI: `name`, `description`, `parameters` (schemat JSON).

## Kompresja kontekstu

Aby zapobiec przepełnieniu kontekstu w przypadku długotrwale działających agentów, Heym automatycznie kompresuje zgromadzoną listę `messages` przed każdą iteracją narzędzia.

### Algorytm

1. **Szacowanie tokenów**: `total_chars / 4` dla wszystkich wiadomości (szybkie, bez potrzeby tokenizatora)
2. **Sprawdzenie progu**: jeśli `estimated_tokens < context_limit × 0.80`, kompresja jest pomijana
3. **Limit kontekstu**: należy spróbować `client.models.retrieve(model).context_window`; w razie niepowodzenia użyć wbudowanej tabeli (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M itd.); domyślnie 128K
4. **Zachowanie punktów zakotwiczenia**: zawsze zachowywane są
   - Pierwsza wiadomość `system` (tożsamość i instrukcje agenta)
   - Pierwsza wiadomość `user` (pierwotne zadanie)
   - Ostatnia wiadomość `user` (najnowsza instrukcja)
5. **Podsumowanie środka**: wszystko między pierwszą a ostatnią wiadomością użytkownika jest serializowane i wysyłane do tego samego modelu z promptem podsumowującym
6. **Odbudowa**: `[system, first_user, assistant(summary), last_user]`

Kompresja jest pomijana, jeśli istnieją mniej niż 2 odrębne wiadomości użytkownika (brak środka do podsumowania) lub jeśli wywołanie podsumowania LLM zakończy się niepowodzeniem (bezpieczny mechanizm awaryjny: zwrócenie oryginalnych wiadomości).

### Obserwowalność

Każde zdarzenie kompresji jest rejestrowane jako:
- Wpis `_context_compression` w `tool_calls_collected` → widoczny w szczegółach uruchomienia w Historii wykonań
- Zdarzenie `on_tool_call` z `phase: "compression"` → renderowane w panelu Debug jako `Context compressed (N messages → summary)`
- Wpis śledzenia LLM `context.compression` → widoczny w zakładce Traces z szacunkami tokenów przed/po

Wywołania narzędzi agenta emitują również bogatszą obserwowalność:

- Pola cyklu życia dla poszczególnych wywołań w `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Zagregowane `tool_metrics` w wyniku agenta (zliczenia według statusu oraz całkowity/maksymalny czas trwania); wpisy `_context_compression` są wykluczone z tych zliczeń
- Opcjonalne podrzędne spany OpenTelemetry o nazwie `heym.agent.tool.execute` (patrz [OpenTelemetry Tracing](./opentelemetry.md))
- Utrwalone ładunki `tool_calls` śledzenia LLM / historii wykonań są redagowane i ograniczone rozmiarowo; aktywny stan wznowienia HITL zachowuje oryginały do dopasowania

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Orkiestracja wielu agentów w całym cyklu życia agenta
- [Węzeł agenta](../nodes/agent-node.md) – Konfiguracja i parametry
- [Trwała pamięć agenta](./agent-persistent-memory.md) – Graf wiedzy dla węzła agenta i udostępnianie między równorzędnymi
- [Human-in-the-Loop](./human-in-the-loop.md) – Linki do przeglądu, oczekujące ładunki i zachowanie wznowienia
- [OpenTelemetry Tracing](./opentelemetry.md) – Spany workflow, węzłów i narzędzi agenta
- [Typy węzłów](./node-types.md) – Agent i powiązane węzły
- [Wykonanie równoległe](./parallel-execution.md) – Wykonanie równoległe oparte na DAG i podagentach
- [Zakładka MCP](../tabs/mcp-tab.md) – Konfiguracja połączeń MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` dla podagentów
