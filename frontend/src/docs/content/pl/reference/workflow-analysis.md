# Analiza Workflow

**Analiza Workflow** to panel boczny po lewej stronie, który przechowuje jeden wspólny, edytowalny dokument Markdown dla każdego workflow. Służy do opisywania działania workflow oraz gromadzenia pomysłów na usprawnienia — a także do generowania wstępnego szkicu przy pomocy AI.

Dokument jest wspólny: każda osoba mająca dostęp do workflow może go odczytywać i edytować. Jest przechowywany razem z workflow i usuwany automatycznie wraz z jego usunięciem.

## Otwieranie panelu

1. Otwórz workflow w edytorze.
2. Kliknij **Analyze** (ikona Sparkles) na pasku narzędzi edytora.
3. Panel otworzy się po lewej stronie. Paleta węzłów (panel lewy) zwija się na czas jego otwarcia; ponowne otwarcie palety węzłów zamyka panel analizy.

Panel jest dostępny wyłącznie dla zapisanych workflow. W przypadku zupełnie nowego, niezapisanego workflow należy najpierw go zapisać.

## Dokument

Panel wyświetla pojedynczy dokument Markdown z dwoma widokami, przełączanymi przyciskami **Edit** (ołówek) i **Preview** (oko):

| Widok | Przeznaczenie |
|------|---------|
| **Edit** | Zwykły edytor Markdown (textarea). |
| **Preview** | Wyrenderowany Markdown. |

Nagłówek wskazuje, **kto ostatnio edytował** dokument oraz kiedy.

### Zapisywanie

Kliknij **Save**, aby utrwalić zmiany. Przycisk Save jest aktywny tylko wtedy, gdy istnieją niezapisane zmiany.

Ponieważ dokument jest wspólny, zapisy wykorzystują optymistyczną kontrolę współbieżności:

- Jeśli ktoś inny zapisał nowszą wersję od momentu otwarcia panelu, zapis zostanie odrzucony, a pojawi się ostrzeżenie wskazujące drugiego edytora.
- Można wówczas wybrać **Reload (discard mine)**, aby przyjąć wersję z serwera, lub **Overwrite**, aby wymusić zapis własnej wersji.

## Analiza AI

Wybierz **Credential** oraz **Model** LLM u góry panelu (lista modeli ładuje się na podstawie wybranego credentiala — zobacz [Credentials](../tabs/credentials-tab.md)). Następnie uruchom analizę:

- **Analyze my workflow** — wyświetlane, gdy dokument jest pusty. Strumieniuje raport Markdown wygenerowany przez AI bezpośrednio do edytora jako niezapisany szkic. Przejrzyj go i edytuj, a następnie kliknij **Save**.
- **Reanalyze** — wyświetlane, gdy dokument ma już treść. Strumieniuje nowy raport do osobnego **podglądu**, pozostawiając bieżący dokument bez zmian. Wybierz **Accept**, aby zastąpić treść edytora nową analizą, lub **Discard**, aby zachować dotychczasową wersję.

Obie akcje najpierw **uruchamiają workflow** (gdy jest prawidłowy i możliwy do uruchomienia) i dołączają wyniki wykonania do promptu analizy, dzięki czemu raport odzwierciedla rzeczywiste zachowanie workflow. Jeśli workflow nie może zostać uruchomiony, analiza przebiega na podstawie jego struktury statycznej.

Wygenerowany raport obejmuje trzy sekcje w kolejności: **Improvement areas** (konkretne sugestie, w tym aspekt **bezpieczeństwa**, gdy workflow dotyczy danych logowania, danych wejściowych użytkownika, żądań zewnętrznych lub ekspozycji danych), **Purpose** workflow oraz **What it does** (przewodnik krok po kroku po węzłach).

Sekcja **Improvement areas** zawsze przeprowadza cztery jawne kontrole:

1. **Error coverage** — jeśli na canvas nie ma węzła [Error Handler](../nodes/error-handler-node.md) i nie skonfigurowano workflow błędów, raport to wskazuje i zaleca dodanie obsługi błędów.
2. **Time saved** — jeśli nie ustawiono szacowanego czasu zaoszczędzonego na jedno uruchomienie, raport zaleca jego skonfigurowanie, aby metryka **Time Saved** w [Analytics](../tabs/analytics-tab.md) mogła się wypełniać.
3. **Network nodes** — dla węzłów wykonujących wywołania sieciowe (takich jak [HTTP](../nodes/http-node.md) oraz węzły integracyjne) raport zaleca obsługę błędów specyficzną dla węzła (retry i/lub continue-on-error).
4. **Alerts** — gdy dla workflow nie skonfigurowano żadnych [alertów](../tabs/alerts-tab.md), raport zaleca skonfigurowanie alertów przed wdrożeniem na produkcję.

5. **Evals**: gdy workflow zawiera węzeł [Agent](../nodes/agent-node.md) bez zestawu agenta, raport zaleca utworzenie **Agent Suite** (lub **Prompt Suite**) w [Evals](../tabs/evals-tab.md#agent-suites); gdy zawiera węzeł [LLM](../nodes/llm-node.md), zaleca **Prompt Suite** w celu przetestowania promptu w wielu modelach.

### Uruchamianie Analyzera z panelu Properties

Gdy workflow ma węzły na canvas, ale nie ma jeszcze dokumentu analizy, w panelu [Properties](./canvas-features.md) na poziomie workflow (wyświetlanym, gdy żaden węzeł nie jest zaznaczony) pojawia się przycisk **Run Analyzer**. Otwiera on panel Analizy Workflow, umożliwiając wybór credentiala i modelu oraz wygenerowanie raportu.

Każde uruchomienie analizy jest rejestrowane w [Traces](../tabs/traces-tab.md) ze źródłem **Workflow Analysis**.

Jeśli nie skonfigurowano żadnego credentiala LLM, przycisk Analyze jest nieaktywny — należy dodać credential w [Credentials Tab](../tabs/credentials-tab.md).

## Powiązane

- [AI Assistant](./ai-assistant.md) — generowanie lub modyfikowanie węzłów workflow na podstawie języka naturalnego.
- [Sticky Note](../nodes/sticky-note-node.md) — do krótkich notatek przypinanych bezpośrednio na canvas.
