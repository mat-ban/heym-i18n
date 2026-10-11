# Karta Alerty

Karta **Alerty** umożliwia definiowanie warunków progowych w oknie czasowym oraz otrzymywanie powiadomień w momencie ich przekroczenia. Heym rejestruje wyniki wykonania, czas trwania uruchomień oraz wydatki na LLM, ale nigdy nie udostępnia tych danych z własnej inicjatywy. Alert to sposób, w jaki można o nie poprosić.

Każdy alert jest oceniany w wybranym **oknie czasowym**, nigdy na podstawie pojedynczego zdarzenia. Jedno nieudane uruchomienie to szum. Dwanaście nieudanych uruchomień w ciągu dziesięciu minut to incydent.

## Typy alertów

| Typ | Pytanie, na które odpowiada | Skąd pochodzi liczba |
|---|---|---|
| **Próg błędów** | Czy liczba niepowodzeń w oknie przekroczyła N? | Wiersze [historii wykonań](../reference/execution-history.md) ze statusem błędu |
| **Czas trwania workflow** | Czy uruchomienia w oknie stały się wolniejsze niż oczekiwano? | Czas wykonania, agregowany jako maksimum, średnia lub 95. percentyl |
| **Koszt tokenów / USD** | Czy wydatki w oknie przekroczyły budżet? | [Ślady LLM](./traces-tab.md) oraz tabela kosztów LLM |
| **Liczba wykonań** | Czy uruchomienia występowały znacznie częściej niż powinny? | Liczba wierszy historii wykonań |

### Próg błędów

Zlicza nieudane uruchomienia w oknie i uruchamia alert, gdy liczba osiągnie próg. Ponieważ zlicza w oknie, a nie reaguje na każde pojedyncze niepowodzenie, pojedynczy przejściowy błąd nie wywoła powiadomienia.

### Czas trwania workflow

Mierzy czas trwania uruchomień w oknie. Należy wybrać **maksimum** (najwolniejsze uruchomienie), **średnią** lub **p95**. Wartość p95 wykorzystuje ten sam sposób obliczania percentyla co [karta Analityka](./analytics-tab.md), dzięki czemu alert i wykres opóźnień nigdy nie są rozbieżne dla tego samego okna.

**Minimalna liczba uruchomień w oknie** chroni przed fałszywymi alarmami. Najwolniejsze uruchomienie w niemal pustym oknie to po prostu to jedno uruchomienie, więc ustawienie minimum na przykład na 3 zapobiega uruchamianiu alertu na skutek szumu.

### Koszt tokenów / USD

Sumuje wydatki na LLM w oknie, zarówno jako łączną liczbę tokenów, jak i w dolarach amerykańskich. Kwoty w dolarach są wyliczane na podstawie tej samej tabeli cen, której używają [karta Ślady](./traces-tab.md) oraz [Tabela kosztów LLM](./datatable-tab.md#llm-cost-table-system-table), dzięki czemu alert kosztowy i strona kosztów zawsze się zgadzają.

Gdy zakres obejmuje wszystkie workflow, uwzględniane są również wywołania LLM wykonane poza workflow, takie jak [karta Chat](./chat-tab.md) oraz [Asystent AI](../reference/ai-assistant.md). Użycie agentów kodujących (Codex, OpenCode) nie jest uwzględniane.

Modele bez wiersza cenowego są zgłaszane w kontekście alertu jako wycenione jako brak, a nie po cichu liczone jako zero.

### Liczba wykonań

Zlicza uruchomienia o dowolnym statusie w oknie. To ten typ wychwytuje błędnie działający trigger: workflow, który normalnie uruchamia się 20 razy na godzinę, nagle uruchamia się 2 000 razy. Rekord uruchomienia zawiera rozbicie według źródła triggera, ponieważ to zwykle odpowiada na pytanie „dlaczego tak się stało”.

## Zakres

Alert obserwuje albo **jeden workflow**, albo **wszystkie workflow**.

„Wszystkie workflow” oznacza każde workflow, do którego właściciel alertu ma dostęp. Celowo nie oznacza każdego workflow w instancji Heym: alerty można udostępniać, a udostępnienie alertu nie powinno przekazywać komuś zagregowanych danych dla workflow, których nie może otworzyć.

## Kreator

Tworzenie alertu przebiega przez pięć kroków.

1. **Typ** — wybór jednego z czterech powyższych.
2. **Zakres** — jeden workflow lub wszystkie.
3. **Warunek** — okno czasowe oraz pola progowe dla danego typu.
4. **Reakcja** — co uruchamia się w momencie wyzwolenia i jak często powtarzać powiadomienia.
5. **Przegląd** — nadanie nazwy i podgląd testu wstecznego.

### Test wsteczny

Krok Przegląd odpowiada na pytanie, które tak naprawdę ma znaczenie przed zapisaniem: *w ciągu ostatnich 24 godzin, jak często ten alert by się uruchomił?*

Raportowana jest liczba uruchomień oraz najwyższa zaobserwowana wartość w odniesieniu do progu. Jeśli wynik wskazuje, że warunek uruchomiłby się 400 razy, należy poprawić próg przed zapisaniem, a nie po otrzymaniu powiadomień. Okres wsteczny można rozszerzyć do 3 lub 7 dni.

## Szkicowanie z AI

Na górze pierwszego kroku znajduje się pole, w którym można opisać oczekiwania w języku naturalnym:

> Ostrzeż mnie, jeśli synchronizacja faktur nie powiedzie się więcej niż 5 razy w ciągu 10 minut

Heym przekształca to w definicję alertu, wypełnia każdy krok, który może, i przechodzi dalej z polami wypełnionymi przez AI oznaczonymi, aby je potwierdzić, a nie wpisywać ponownie. Kompletne żądanie prowadzi do kroku Przegląd.

**Niekompletne żądanie również posuwa pracę do przodu.** Wystarczy podać „ostrzeż mnie, jeśli nie powiedzie się 5 razy”, a otrzyma się alert progu błędów z wypełnioną liczbą, wartościami domyślnymi dla pozostałych pól, a kreator otworzy się na pierwszym kroku, który nadal wymaga uwagi: w tym przypadku Zakres, ponieważ nie wskazano żadnego workflow. Uwaga na górze informuje, co pozostało do ustalenia. Nigdy nie blokuje przycisków Dalej ani Utwórz.

To samo dotyczy sytuacji, gdy model wskaże workflow, do którego nie ma dostępu, lub zwróci warunek z brakującymi polami. Części, które mają sens, są zachowywane, pozostałe wracają do wartości domyślnych dla danego typu alertu, a następnie dostosowuje się je ręcznie. Nic tutaj nie omija walidacji: reguły kreatora oraz API ponownie sprawdzają alert w momencie zapisu.
## Zachowanie przy powtórzeniach

Po uruchomieniu alert wchodzi w stan triggered. To, co dzieje się dalej, zależy od wyboru w kroku 4.

- **Powiadom raz, do momentu ustąpienia** (domyślnie) — alert uruchamia się raz, a następnie pozostaje cichy, dopóki warunek jest spełniony. Gdy metryka spadnie poniżej progu, alert wraca do stanu OK i może ponownie się uruchomić. Ustąpienie to zmiana stanu, a nie zdarzenie: nie tworzy rekordu uruchomienia i nie uruchamia workflow powiadamiającego.
- **Powiadamiaj cyklicznie** — alert uruchamia się ponownie co N minut, dopóki warunek jest spełniony.

Wartość domyślna istnieje dlatego, że uszkodzony workflow sprawdzany co 60 sekund generowałby 60 uruchomień na godzinę, co jest najprostszą drogą do wyciszenia alertów.

## Uruchamianie workflow przy wystąpieniu alertu

Krok 4 oferuje trzy odpowiedzi na pytanie „co powinno się stać, gdy alert się uruchomi":

- **Utwórz i przypisz nowy workflow** (domyślnie) — zapisanie alertu tworzy jednocześnie workflow o nazwie *„&lt;nazwa alertu&gt; notification"* i wiąże go z alertem. Workflow zawiera węzeł wejściowy, którego pola odpowiadają dokładnie poniższemu payloadowi, więc `$alert.body.observed_value` i pozostałe wyrażenia działają od razu — wystarczy dołączyć węzeł dostarczający wiadomość. Przycisk **Go to workflow** na karcie alertu otwiera ten workflow. Jest to ustawienie domyślne, ponieważ alert, który uruchamia się donikąd, łatwo przeoczyć.
- **Wybierz istniejący workflow** — uruchom coś, co zostało już zbudowane.
- **Nic nie rób** — uruchomienie nadal jest rejestrowane w zakładce, ale nie uruchamia żadnego workflow.

Payload alertu trafia do workflow jako jego wejściowe body:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Który workflow wygenerował daną wartość

`workflows` to jedyne miejsce, w którym pojawia się workflow. Zawiera listę wszystkich workflow, które przyczyniły się do odczytu, każdy z własnym polem `value` — liczbą błędów, liczbą uruchomień, najwolniejszym uruchomieniem w milisekundach lub wydatkiem tego workflow, w zależności od typu alertu. Lista jest posortowana według `value`, od najwyższej wartości, więc `workflows[0]` to największy sprawca.

Jest to **zawsze tablica**: jednoelementowa w zakresie pojedynczego workflow, wieloelementowa w zakresie „wszystkie moje workflow" i pusta — a nie null — gdy nic nie można przypisać. Workflow powiadamiający może ją iterować bez sprawdzania kształtu danych.

Celowo nie ma pojedynczego pola `workflow_id`. Opisywało ono zakres alertu, a nie metrykę, więc przyjmowało wartość `null` w zakresie systemowym — czyli dokładnie w przypadku, gdy pytanie „który workflow?" ma największe znaczenie. `observed_value` pozostaje wartością zagregowaną, z którą porównywano próg; pola `value` poszczególnych workflow wyjaśniają, skąd ta wartość pochodzi.

W ten sposób alerty trafiają do Slacka, poczty e-mail, Telegrama i wszędzie indziej: za pomocą [węzłów](../reference/node-types.md), które już są dostępne, a nie odrębnego systemu powiadomień.

Alert nie może powiadamiać workflow, który obserwuje. Byłaby to pętla — najwyraźniej w przypadku alertu opartego na liczbie wykonań, gdzie każde powiadomienie zwiększa liczbę, którą alert mierzy.

Uruchomienia powiadomień to zwykłe wykonania, więc pojawiają się w [historii wykonań](../reference/execution-history.md) jak każde inne uruchomienie. Nieudany workflow powiadamiający jest odnotowywany przy uruchomieniu alertu, ale nigdy nie uniemożliwia zarejestrowania samego uruchomienia.

Workflow powiadamiający działa jako właściciel alertu, z jego danymi logowania i zmiennymi globalnymi, dokładnie tak, jakby uruchomił go samodzielnie. Wybranie workflow udostępnionego przez inną osobę nie powoduje przejęcia jej danych logowania. Jeśli właściciel utraci dostęp do workflow powiadamiającego, uruchomienie alertu nadal zostanie zarejestrowane, ale uruchomienie powiadomienia zostanie pominięte.

## Historia uruchomień

Poniżej listy alertów znajduje się historia uruchomień: co się uruchomiło, kiedy, zaobserwowana wartość w odniesieniu do progu, dokładne okno czasowe poddane ewaluacji oraz wynik powiadomienia.

Potwierdzenie uruchomienia oznacza wiersz i zmienia oznaczenie alertu z **Firing** na **Acknowledged**. To stwierdzenie o użytkowniku, a nie o alercie: warunek nadal jest spełniony, a alert sam wraca do stanu **OK**, gdy metryka spadnie poniżej progu.

Każdy rekord przechowuje szczegóły przyczyn w momencie uruchomienia: identyfikatory błędnych wykonań i komunikaty błędów, wydatek według modelu lub rozbicie według źródła triggera. Jest to zamierzone. Okno czasowe już minęło, a ponowne obliczenie go później może dać inny wynik.

Rekordy uruchomień są przechowywane przez 90 dni.

## Pytania do Chat o alerty

Zakładka [Chat](./chat-tab.md) odpowiada na pytania dotyczące alertów:

- „Jakie mam alerty?"
- „Czy istnieje alert dla workflow faktur?"
- „Dlaczego uruchomił się alert kosztowy?"
- „Kiedy ostatnio się uruchomił?"

W odpowiedzi na pytanie „dlaczego się uruchomił" Chat przytacza rzeczywistą zaobserwowaną wartość, próg i okno czasowe z rekordu uruchomienia wraz ze szczegółami przyczyn.

## Udostępnianie

Alerty można udostępniać pojedynczym użytkownikom lub [zespołom](./teams-tab.md). Osoby, którym alert udostępniono, widzą go wraz z historią uruchomień. Tylko właściciel może go edytować, wstrzymywać, usuwać lub udostępniać dalej.
### Gdy dostęp do workflow zostanie odebrany

Alert dotyczący pojedynczego workflow stale odczytuje metryki uruchomień tego workflow, więc odebranie komuś dostępu do workflow decyduje również o tym, co stanie się z jego alertami na nim:

- **Usunięcie udostępnienia użytkownikowi lub zespołowi** powoduje zapytanie właściciela workflow, czy zatrzymać również alerty tego użytkownika lub zespołu na workflow. Zatrzymanie jest ustawieniem domyślnym. Zatrzymane alerty są wstrzymywane, a nie usuwane, a każdy z nich jest rejestrowany jako `alert.disable_on_access_revoke` w [dzienniku audytu](../reference/audit.md).
- **Usunięcie członka zespołu lub usunięcie zespołu** zawsze zatrzymuje dotyczące alerty, ponieważ osoba dokonująca tej zmiany niekoniecznie jest właścicielem workflow.
- Alert jest zatrzymywany tylko wtedy, gdy jego właściciel nie ma innej ścieżki dostępu do workflow, takiej jak bezpośrednie udostępnienie lub inny zespół.
- Wznowienie lub testowanie wstrzymanego alertu ponownie sprawdza dostęp właściciela, więc zatrzymanego alertu nie można ponownie włączyć ani użyć do odczytu metryk workflow bez dostępu. Naciśnięcie **Resume** bez dostępu powoduje wyświetlenie powiadomienia wyjaśniającego, że właściciel workflow musi najpierw udostępnić go ponownie.

## Zarządzanie alertami

- **Pause / Resume** — wstrzymany alert nigdy nie jest ewaluowany. Wznowienie sprawdza go natychmiast, zamiast czekać na następny interwał.
- **Edit** — zmiany są walidowane jako całość, więc częściowa edycja nie może pozostawić alertu w nieprawidłowym stanie.
- **Delete** — usuwa alert wraz z jego historią uruchomień.

## Zobacz także

- [Analytics Tab](./analytics-tab.md) — wykresy, z których pochodzą te progi
- [Traces Tab](./traces-tab.md) — skąd pochodzą wartości kosztów LLM
- [Execution History](../reference/execution-history.md) — uruchomienia, które mierzą alerty błędów, czasu trwania i liczby
- [Chat Tab](./chat-tab.md) — odpytywanie alertów w języku naturalnym
- [Teams](./teams-tab.md) — udostępnianie alertów zespołowi
