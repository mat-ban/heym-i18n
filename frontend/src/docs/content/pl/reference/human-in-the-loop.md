# Human-in-the-Loop

Human-in-the-loop (HITL) umożliwia [węzłowi Agenta](../nodes/agent-node.md) żądanie zatwierdzenia w określonych momentach, oczekiwanie na decyzję człowieka, a następnie kontynuowanie workflow od tego samego zrzutu wykonania.

## Co robi

- Dodaje jawne punkty kontrolne zatwierdzania do agenta bez konieczności budowania osobnego workflow zatwierdzania
- Tworzy jednorazowy publiczny adres URL do przeglądu pod `/review/{token}`
- Umożliwia recenzentowi wybór opcji `Accept`, `Edit & Continue` lub `Refuse`
- Oznacza wykonanie jako `pending` do momentu otrzymania decyzji
- Wznawia wstrzymane wykonanie i pozwala agentowi kontynuować po zatwierdzeniu
- Obsługuje wiele następujących po sobie punktów kontrolnych HITL w tym samym uruchomieniu agenta

## Konfiguracja agenta

Należy włączyć HITL w panelu właściwości agenta.

| Ustawienie | Opis |
|---------|-------------|
| `hitlEnabled` | Włącza przegląd przez człowieka dla tego agenta |
| `hitlSummary` | Wytyczne zatwierdzania określające, kiedy agent powinien zażądać przeglądu przez człowieka |

HITL dodaje do agenta narzędzie `request_human_review`. Należy użyć promptu systemowego oraz wytycznych `hitlSummary`, aby poinformować agenta, które działania wymagają zatwierdzenia. Gdy agent uzna, że punkt kontrolny wymaga przeglądu, wysyła pojedynczy tekst przeglądu w formacie Markdown do człowieka. Podsumowanie widoczne dla recenzenta jest generowane na podstawie żądania agenta w czasie wykonania; jeśli agent je pominie, Heym wyprowadza je z treści Markdown. W wersji v1 HITL obsługuje wyłącznie dane wyjściowe agenta w trybie tekstowym, więc nie można go łączyć z `jsonOutputEnabled`.

W przypadku narzędzi MCP Heym prosi model o zinterpretowanie zapisanych instrukcji HITL na jeden z trzech zakresów zatwierdzania:

- `always` dla wyrażeń takich jak „always", „on each" lub „for each"
- `once` dla wyrażeń takich jak „once" lub „only one time"
- `never` dla wyrażeń takich jak „never", „do not ask" lub „already approved"

Ta interpretacja kontroluje, czy powtarzane wywołania MCP ponownie się wstrzymają, pozostaną zatwierdzone jednorazowo, czy całkowicie pominą przegląd przez człowieka.

Gdy HITL jest włączony, agent udostępnia również drugi uchwyt wyjściowy na canvas oznaczony jako `review`. Należy użyć tej gałęzi do wysyłania oczekującego adresu URL przeglądu i podsumowania do Slack, poczty e-mail, logowania lub dowolnego innego przepływu powiadomień, podczas gdy główne wykonanie oczekuje na osobę.

## Przepływ przeglądu

1. Agent osiąga krok wymagający zatwierdzenia i wywołuje `request_human_review`
2. Heym tworzy publiczne żądanie przeglądu i zwraca adres URL przeglądu
3. Wszystkie węzły podłączone do uchwytu `review` agenta uruchamiają się natychmiast z oczekującym payloadem HITL
4. Wykonanie workflow przechodzi w stan `pending`
5. Recenzent otwiera `/review/{token}` bez logowania
6. Recenzent wybiera jedną z akcji:
   - `Accept` kontynuuje z oryginalnym Markdown
   - `Edit & Continue` kontynuuje ze zmodyfikowanym Markdown
   - `Refuse` kontynuuje z `decision: "refused"` i pomija dalsze działania agenta
7. Heym wznawia workflow z zapisanego zrzutu i pozwala agentowi kontynuować z zatwierdzonym kontekstem Markdown
8. Jeśli późniejszy krok również wymaga zatwierdzenia, agent może ponownie wywołać HITL i utworzyć kolejny oczekujący punkt kontrolny

Linki do przeglądu wygasają po 168 godzinach, jeśli nikt nie odpowie.

## Publiczna strona przeglądu

Publiczna strona przeglądu wyświetla:

- Nazwę workflow i etykietę agenta
- Automatycznie wygenerowane podsumowanie dla recenzenta na podstawie żądania przeglądu agenta
- Tekst przeglądu w formacie Markdown jako pierwszą, główną treść
- Pole edycji, które otwiera się dopiero po kliknięciu `Edit` przez recenzenta
- Podgląd Markdown na żywo podczas edycji
- Przyciski akcji `Accept`, `Edit & Continue` i `Refuse`

Po przesłaniu decyzji token zostaje zablokowany i nie można go ponownie użyć.

## Dane wyjściowe i stan wykonania

Podczas oczekiwania na przegląd dane wyjściowe agenta zawierają oczekujący payload:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Po odpowiedzi recenzenta i wznowieniu workflow końcowe dane wyjściowe agenta zawierają metadane decyzji:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Należy użyć `$agentLabel.decision` w węzłach downstream, aby rozgałęzić przepływ na wyniki zaakceptowane, zmodyfikowane lub odrzucone.

## Gałąź przeglądu na canvas

Uchwyt wyjściowy `review` jest dostępny tylko wtedy, gdy dla agenta włączono `hitlEnabled`.

- Uruchamia się przed nadejściem decyzji człowieka
- Otrzymuje oczekujący payload HITL, w tym `summary`, `draftText`, `reviewUrl`, `shareText` i `shareMarkdown`
- Jest przeznaczony do kroków powiadamiania lub przekazywania, takich jak Slack, poczta e-mail lub logowanie audytowe
- Uruchamia się raz dla każdego punktu kontrolnego HITL
- Nie uruchamia się ponownie po odpowiedzi recenzenta; po wznowieniu kontynuowana jest wyłącznie normalna ścieżka danych wyjściowych agenta
## Gdzie występuje

- [Historia wykonań](./execution-history.md) natychmiast pokazuje uruchomienia w stanie `pending` i zapisuje adres URL przeglądu w wynikach węzła
- Odpowiedzi w czacie [Portalu](./portal.md) pokazują link do przeglądu przez człowieka zamiast pustej odpowiedzi
- Panel Debug oraz okna historii pokazują ostateczną decyzję HITL i zrecenzowany tekst
- Wyjściowy uchwyt przeglądu może powiadamiać kanały zewnętrzne, nawet gdy workflow został uruchomiony przez cron, curl lub ruch z portalu
- Wiele punktów kontrolnych HITL korzysta z tego samego wpisu historii wykonań, tworząc jednorazowy link do przeglądu dla każdego zatrzymania

## Obecne ograniczenia

- HITL jest dostępny wyłącznie w węzłach Agent
- HITL korzysta z wyjścia tekstowego agenta i nie obsługuje wyjścia JSON w wersji v1
- Wstrzymane wykonanie wznawia się ze zapisanego snapshotu workflow, a nie z najnowszej edytowanej wersji workflow
- Zagnieżdżone pod-workflow nie mogą wejść w stan oczekiwania HITL w wersji v1; należy zlecić przegląd nadrzędnemu agentowi przed ich wywołaniem

## Powiązane

- [Węzeł Agent](../nodes/agent-node.md) — Konfiguracja HITL w agencie
- [Architektura agenta](./agent-architecture.md) — Jak agenci, narzędzia, pod-agenci i HITL współdziałają ze sobą
- [Historia wykonań](./execution-history.md) — Przeglądanie uruchomień oczekujących i wznowionych
- [Tablica](../tabs/board-tab.md) — Uruchomienia łańcucha na tablicy wstrzymują kartę w stanie oczekiwania (bursztynowym) przy HITL
- [Portal](./portal.md) — Publiczne przepływy czatu i linki do przeglądu HITL
