# Trwała pamięć agenta

Węzły agenta mogą przechowywać **graf wiedzy dla poszczególnego węzła** zapisany w bazie danych: encje (z typami i właściwościami) oraz relacje między nimi. Gdy funkcja jest włączona, Heym **wstrzykuje podsumowanie tego grafu do promptu systemowego** przy każdym uruchomieniu (jeśli graf nie jest pusty). Po udanym uruchomieniu zadanie **ekstrakcji przez LLM** scala nowe fakty z konwersacji do grafu w tle.

Sub-agenci i orkiestratory domyślnie korzystają z grafu powiązanego z **własnym węzłem canvas**. Istnieje również możliwość **przyznania innym agentom dostępu do odczytu lub odczytu i zapisu** do grafu tego węzła (w tym agentom w **innych workflow**, których jest się właścicielem) — zobacz [Udostępnianie innym agentom](#udostępnianie-innym-agentom).

## Włączanie

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Gdy `true`, ładuje graf tego węzła do promptu systemowego i planuje ekstrakcję po uruchomieniu dla grafu tego węzła |
| `memoryShares` | array (opcjonalny) | Przyznaje innym węzłom agenta dostęp do grafu pamięci **tego** węzła; zobacz [Udostępnianie](#udostępnianie-innym-agentom) |

Funkcję włącza się we właściwościach węzła agenta (**Persistent memory (graph)**). Różowa ikona **mózgu** na węźle otwiera edytor grafu, gdy pamięć jest włączona (lub gdy wyświetlany jest model).

## Edytor grafu

Okno dialogowe renderuje encje jako animowany graf siłowy — kolorowe okręgi o rozmiarze zależnym od liczby połączeń, grupowane według typu encji — wraz z edycją i nawigacją (dopasowanie widoku, uporządkowanie układu, skróty klawiaturowe). Węzły i krawędzie można **dodawać, edytować i usuwać** ręcznie; selektory relacji Source/Target są przeszukiwalne w grafach z dużą liczbą encji. Wybranie węzła pokazuje jego połączenia wychodzące i przychodzące, z których każde można kliknąć, aby przejść do danego węzła. Zmiany dotyczą wyłącznie grafu **tego** agenta (grafu węzła canvas, którego ikonę mózgu otwarto).

## Udostępnianie innym agentom

W oknie dialogowym grafu pamięci opcja **Share memory with other agents** pozwala przypiąć **peers**, które mogą korzystać z tego grafu w czasie działania:

1. Wybierz **workflow** (dowolny workflow, który można otworzyć w edytorze).
2. Wybierz węzeł **agenta** w tym workflow.
3. Ustaw **Read only** lub **Read & write**.

| Uprawnienie | Efekt |
|------------|--------|
| Read only | Gdy uruchamiany jest agent **peer**, ten graf jest scalany z promptem systemowym peera (jeśli zawiera encje). Brak ekstrakcji do tego grafu z uruchomienia peera. |
| Read & write | Zachowanie promptu jak w przypadku odczytu, a po **udanym** zakończeniu peera standardowa ekstrakcja pamięci może również **scalić dane z grafem właściciela** przy użyciu danych logowania z uruchomienia peera. |

Peers są przechowywane dla każdego węzła właściciela jako wpisy `memoryShares` z `peerWorkflowId` i `peerCanvasNodeId` (oraz `permission`). Starsze workflow mogą pomijać `peerWorkflowId` dla peers w **tym samym** workflow; edytor traktuje to jako bieżący workflow.

**Udostępnianie między workflow** jest rozwiązywane w czasie działania poprzez skanowanie workflow, których jest się **właścicielem**. Uruchomienia bez uwierzytelnionego kontekstu użytkownika rozwiązują wyłącznie udziały zdefiniowane w JSON **bieżącego** workflow (ten sam canvas).

## Zachowanie w czasie działania

### Własny graf (`persistentMemoryEnabled`)

1. **Przed wywołaniem LLM** — Jeśli graf zawiera encje, do instrukcji systemowej dołączany jest blok wyjaśniający, że są to fakty z wcześniejszych uruchomień (mogą być niekompletne; w przypadku konfliktu wygrywa bieżąca wiadomość użytkownika).
2. **Po udanym zakończeniu** — Zadanie w tle prosi model (z tymi samymi danymi logowania co uruchomienie agenta) o ustrukturyzowany JSON (encje + relacje). Ten payload jest scalany z bazą danych (deduplikacja i czyszczenie relacji mają zastosowanie dla niektórych typów, np. krawędzi typu zatrudnienie).

### Peer otrzymujący udostępnione grafy

Gdy uruchamiany jest agent, system wyszukuje węzły **właściciela** (w dowolnych workflow, których jest się właścicielem, gdy to możliwe), których `memoryShares` wskazują na workflow i węzeł canvas tego uruchomienia. Dla każdego dopasowania graf tego właściciela jest dołączany jako sekcja **shared memory** w promptcie systemowym. Peers z uprawnieniem **Read & write** dodatkowo planują cele ekstrakcji dla workflow/grafu **właściciela**, gdy uruchomienie zakończy się sukcesem.

Ekstrakcja **nie** jest uruchamiana, gdy uruchomienie zakończy się błędem lub w stanie oczekiwania HITL.

## JSON workflow (pole `data`)

Zapisywany w węźle agenta jak inne ustawienia:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` przyjmuje wartość `"read"` lub `"write"`. Należy pominąć `memoryShares` lub użyć `[]`, gdy nie ma udostępniania.

Pełny kształt obiektu węzła opisano w [Workflow Structure](./workflow-structure.md).

## Powiązane

- [Agent Node](../nodes/agent-node.md) — Pełna konfiguracja agenta
- [Agent Architecture](./agent-architecture.md) — Orkiestrator, sub-agenci, narzędzia
- [Workflow Structure](./workflow-structure.md) — Format JSON workflow
- [Canvas Features](./canvas-features.md) — Kontrolka mózgu i okno dialogowe grafu
- [Traces tab](../tabs/traces-tab.md) — Obserwowalność żądań/odpowiedzi LLM
