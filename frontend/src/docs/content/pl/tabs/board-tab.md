# Tablica

Zakładka **Tablica** to agentowa tablica kanban. Praca przepływa przez kolumny, a każda
kolumna może uruchamiać workflowy Heym. Karta to nie tylko zadanie — to trwałe
zadanie agentowe, które przenosi kontekst, historię rozmowy, stan wykonania, wyniki
oraz uruchomienia workflowów.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Tablice i kolumny

- Można utworzyć dowolną liczbę tablic. Nowa tablica rozpoczyna się od domyślnych
  kolumn **Backlog → Planning → Development → Done**.
- Każda tablica wymaga **Agentic Kanban Model** (dane logowania oraz model). Jest
  to obowiązkowe — okno dialogowe nowej tablicy nie utworzy tablicy bez tego modelu,
  a tablica, która go nie ma, pozostaje z wyłączonymi akcjami — ponieważ to model mapuje
  każdą kartę na dane wejściowe uruchamianych workflowów i przekształca ich wyniki
  z powrotem w czytelny tekst.
- Ikona koła zębatego w nagłówku tablicy otwiera ustawienia tablicy: nazwę, opis
  (wyświetlany pod nagłówkiem) oraz Agentic Kanban Model.
- Kolumny są w pełni edytowalne: można je dodawać, zmieniać nazwy, zmieniać kolory,
  zmieniać kolejność lub usuwać w ustawieniach kolumny (kolumna musi być pusta, zanim
  będzie można ją usunąć).
- Karty są uporządkowane pionowo według priorytetu — przeciągnij, aby zmienić kolejność.
- Kartę można również utworzyć z [zakładki Chat](./chat-tab.md) za pomocą polecenia
  w języku naturalnym. Chat w razie potrzeby prosi o wybór tablicy i zawsze dodaje kartę
  do pierwszej kolumny tej tablicy.

## Udostępnianie tablicy

Ustawienia tablicy pozwalają również udostępnić tablicę **użytkownikom** (po adresie e-mail)
oraz **zespołom**, z uprawnieniem `read` lub `write`:

- **read** — tablica i jej karty są widoczne, ale nic nie można zmienić: brak nowych
  kart, przenoszenia, komentarzy i uruchomień.
- **write** — pełne korzystanie z tablicy: karty, przenoszenie, komentarze i uruchomienia.
- Tylko **właściciel** widzi ikonę koła zębatego i przyciski usuwania oraz tylko właściciel
  może zmieniać ustawienia tablicy, jej Agentic Kanban Model lub jej udostępnienia.

Łańcuchy na udostępnionej tablicy zawsze działają z **danymi logowania właściciela** i jego
Agentic Kanban Model, więc współpracownicy nigdy nie potrzebują własnych.

## Załączniki kart

Otwórz kartę i użyj **Attach file**, aby dodać do niej pliki — przeciągnij je na pole lub
wybierz przyciskiem, a usuń je z tej samej listy. Załączniki są przechowywane w
[Drive](./drive-tab.md).

Każde uruchomienie **rozwiązuje załączniki przed rozpoczęciem workflowów**, według typu:

- **Dokumenty** (pdf, markdown, csv, json, text) są wyodrębniane do tekstu, z limitem 20 000
  znaków na plik, w polu `text` załącznika.
- **Obrazy** są przekazywane jako `url`, który ścieżka wizyjna ładuje bezpośrednio (wejście
  obrazu węzła LLM akceptuje go bez zmian).
- **Wszystko inne** jest przekazywane jako zwykłe odwołanie (`name`, `url`, `mime_type`).

Workflowy odczytują je pod `$input.card.attachments` (oraz zawsze pod `$input.board.attachments`,
niezależnie od tego, co zmapował mapper). Agentic Kanban Model widzi również wyodrębniony
tekst i adresy URL obrazów, dzięki czemu może zmapować załącznik bezpośrednio do pola,
którego oczekuje workflow.

## Łańcuchy workflowów kolumn

Każdą kolumnę można skonfigurować z **uporządkowaną listą workflowów** (łańcuchem).
Gdy karta przechodzi do kolumny, która ma łańcuch:

1. Łańcuch uruchamia się automatycznie w tle — samo przeniesienie nigdy nie czeka.
2. Workflowy działają **sekwencyjnie**. Wynik każdego workflowu jest dołączany do kontekstu
   karty przed rozpoczęciem następnego.
3. Jeśli workflow zakończy się niepowodzeniem, łańcuch zatrzymuje się: pozostałe ogniwa są
   pomijane, a karta zmienia kolor na **czerwony**.
4. Gdy wszystkie ogniwa zakończą się powodzeniem, karta zmienia kolor na **zielony**.
   Podczas działania łańcucha karta pulsuje **bursztynowo**; uruchomienie wstrzymane do
   przeglądu przez człowieka wyświetla statyczny bursztynowy stan.

Uruchomienia są rejestrowane w [Historii wykonań](../reference/execution-history.md) ze
źródłem triggera `board`, a każda karta prowadzi własną listę uruchomień z wynikami
i błędami poszczególnych workflowów. Otwórz kartę podczas działania workflowu i wybierz
**Open live** obok uruchomienia, aby podłączyć edytor do dokładnie tego wykonania. Ta sama
animacja canvas, przyrostowe logi Debug i wynik końcowy pojawiają się bez uruchamiania
drugiego przebiegu.
## Co otrzymują workflow

Łańcuch przekazuje standardowy payload jako dane wejściowe workflow. Można go odczytać za pomocą zwykłych
[wyrażeń](../reference/expression-dsl.md), takich jak `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — wszystkie komentarze na karcie, od najstarszego.
- `history` — pełna os czasu aktywności (komentarze, przeniesienia, dane wyjściowe), ograniczona do
  200 najnowszych wpisów.
- `previous_outputs` — dane wyjściowe z wcześniejszych zakończonych uruchomień (poprzednie kolumny i
  kolejne rundy follow-up).
- `chain.previous_workflow_outputs` — dane wyjściowe wcześniejszych ogniw w *bieżącym*
  łańcuchu.
- W rundach follow-up `move` ma wartość `null`, a `rerun` ma wartość `true`.

## Pętla planowania (rundy follow-up)

Częstym wzorcem jest umieszczenie workflow planowania w **drugiej kolumnie** (domyślnie
nazywanej Planning — nazwa nie ma znaczenia; liczy się slot). Ten workflow wzbogaca
kartę i zadaje pytania uzupełniające:

1. Przenieś kartę do drugiej kolumny — workflow zapisuje wzbogacony plan i swoje
   pytania z powrotem na karcie jako dane wyjściowe.
2. Odpowiedz w wątku komentarzy karty. Odpowiedź zwalnia kartę: przechodzi ona do
   następnej kolumny, która przejmuje ją z odpowiedzią w kontekście. Łańcuch drugiej kolumny
   nie jest uruchamiany ponownie.
3. Aby zamiast tego ulepszyć plan w miejscu, naciśnij **Run follow-up round**. Ten sam
   łańcuch uruchamia się ponownie z całym zgromadzonym kontekstem, a następnie karta czeka w tej kolumnie,
   aż dodasz komentarz, który ją zwolni.

Bramka planowania jest pozycyjna, a nie oparta na nazwie: skrajna lewa kolumna i kolumna
bezpośrednio po jej prawej stronie nigdy nie przechodzą dalej samodzielnie — uruchamiają swój łańcuch i czekają
tam na Ciebie (komentarz zwalnia drugą kolumnę). Od trzeciej kolumny wzwyż
udany łańcuch samodzielnie przesuwa kartę w prawo, aż do ostatniej
kolumny. Zmiana nazwy lub usunięcie domyślnej etykiety „Planning" nie zmienia tego, który slot
jest bramką. Karta może mieć tylko jedno aktywne uruchomienie jednocześnie.

## Human-in-the-loop i pytania Codex

Jeśli workflow w łańcuchu zostanie wstrzymany — na węźle [Human-in-the-Loop](../reference/human-in-the-loop.md),
na narzędziu HITL agenta lub ponieważ węzeł [Codex](../nodes/codex-node.md) potrzebuje
więcej informacji — uruchomienie jest zapisywane jako oczekujące, a karta pokazuje bursztynowy stan oczekiwania. Każde wstrzymanie zachowuje własną powierzchnię odpowiedzi: link do przeglądu HITL dla HITL, ekran
follow-up Codex dla Codex.

Po udzieleniu odpowiedzi łańcuch wznawia się samodzielnie: wstrzymany workflow kończy działanie, jego dane wyjściowe
trafiają na kartę, uruchamiana jest reszta łańcucha tej kolumny, a karta przechodzi dalej jak zwykle.
Jeśli wznowione uruchomienie zakończy się niepowodzeniem, karta zmienia kolor na czerwony, a pozostałe ogniwa są pomijane.

## Powiązane

- [Workflows](./workflows-tab.md)
- [Historia wykonań](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
