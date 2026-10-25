# Asystent AI

**Asystent AI** to panel czatu, który otwiera się z panelu Debug i domyślnie pojawia się w prawym dolnym narożniku edytora. Przeciągnięcie nagłówka pozwala przesunąć panel, a przeciągnięcie krawędzi lub narożnika zmienia jego szerokość lub wysokość. Panel nie zmniejszy się poniżej 360×480 pikseli. Pozycja i rozmiar są zapamiętywane w tej przeglądarce. Opcja **Reset position and size** w nagłówku przywraca panel do prawego dolnego narożnika. Do tworzenia i modyfikowania workflow służy język naturalny — wystarczy opisać oczekiwany rezultat, a AI wygeneruje węzły i połączenia, które zostaną zastosowane na canvasie.

W przypadku pytań dotyczących dokumentacji poza edytorem należy korzystać z [Chat with Heym](./chat-with-heym.md). Ten interfejs jest zoptymalizowany pod pomoc produktową uwzględniającą kontekst strony, a nie pod generowanie workflow.

## Otwieranie panelu

1. Otwórz workflow w edytorze
2. Zlokalizuj **panel Debug** na dole (obszar wyników wykonania)
3. Kliknij przycisk **AI** (ikona Sparkles) na pasku narzędzi panelu
4. Panel Asystenta AI otworzy się w prawym dolnym narożniku. Przeciągnij jego nagłówek, aby go przesunąć, lub przeciągnij krawędź bądź narożnik, aby zmienić szerokość lub wysokość.

Naciśnij `Ctrl + I` / `Cmd + I` w dowolnym miejscu edytora, aby otworzyć lub zamknąć panel — skrót działa nawet wtedy, gdy fokus znajduje się w polu tekstowym. Zobacz [Keyboard Shortcuts](./keyboard-shortcuts.md).

Aby pracować nad pojedynczym węzłem, najedź na niego kursorem na canvasie i kliknij **AI** powyżej. Panel otworzy się skoncentrowany na tym węźle. Zobacz [Modyfikowanie pojedynczego węzła](#changing-one-node).

## Zamykanie panelu

Kliknij przycisk **X**, naciśnij `Ctrl + I` / `Cmd + I` lub przełącz przycisk **AI** na pasku narzędzi panelu Debug. Przeciągnięcie nagłówka przesuwa panel, ale go nie zamyka.

## Konfiguracja

Przed wysłaniem wiadomości należy wybrać:

| Ustawienie | Opis |
|---------|-------------|
| **Credential** | Dane logowania LLM (klucz API) z zakładki [Credentials](../tabs/credentials-tab.md) |
| **Model** | Nazwa modelu (np. `gpt-4o`, `gemini-2.5-flash`) |

Dane logowania dodaje się w zakładce [Credentials Tab](../tabs/credentials-tab.md). Lista modeli ładuje się na podstawie wybranych danych logowania.

## Tryb Agent a tryb Ask

Panel ma dwa tryby, przełączane za pomocą przycisku **Agent / Ask** w nagłówku panelu.

| Tryb | Domyślny | Działanie |
|------|---------|-----------|
| **Agent** | ✓ | Buduje i modyfikuje canvas. AI generuje blok JSON workflow, który jest automatycznie stosowany na canvasie po zakończeniu odpowiedzi. |
| **Ask** | | Udziela wyłącznie odpowiedzi na pytania. Canvas nie jest w żaden sposób modyfikowany. Tryb ten służy do zadawania pytań o workflow, funkcje Heym lub uzyskiwania porad bez wywoływania aktualizacji canvasa. |

Tryb można przełączyć w dowolnym momencie. Zmiana trybu nie powoduje wyczyszczenia rozmowy.

W trybie Agent pole **YOLO mode** pod polem wiadomości sprawia, że asystent uruchamia i poprawia to, co zbuduje. Zobacz [YOLO Mode](#yolo-mode).

## Korzystanie z czatu

- Wpisz żądanie w polu wprowadzania (np. „Create a workflow that takes user input and sends it to an LLM”)
- Naciśnij **Enter**, aby wysłać (Shift+Enter wstawia nowy wiersz)
- AI strumieniuje odpowiedź. W trybie **Agent**, jeśli odpowiedź zawiera workflow w bloku kodu \`\`\`json, jest on automatycznie parsowany i stosowany na canvasie. W trybie **Ask** canvas nigdy nie jest modyfikowany.
- Użyj przycisku **Clear**, aby zresetować rozmowę
- Najedź kursorem na wiadomość i kliknij jej ikonę kopiowania, aby skopiować wyświetlany tekst, w tym ewentualny JSON workflow
- Przeciągnij linię nad polem wiadomości, aby zwiększyć wysokość pola. Obszar wprowadzania może urosnąć do 60% wysokości panelu i wraca do domyślnej wysokości po przeładowaniu strony

## Automatyczne stosowanie workflow

Gdy odpowiedź AI zawiera prawidłowy blok JSON workflow (z `nodes` i opcjonalnie `edges`) w bloku kodu \`\`\`json, Heym:

1. Parsuje JSON z odpowiedzi
2. Zastępuje bieżący canvas nowymi węzłami i połączeniami
3. Porządkuje układ węzłów
4. Oznacza workflow jako niezapisany

Jeśli parsowanie się nie powiedzie, pojawia się przycisk **Retry** umożliwiający ponowne wygenerowanie odpowiedzi.

## Modyfikowanie pojedynczego węzła

Najedź kursorem na węzeł na canvasie i kliknij **AI** powyżej. Panel otworzy się w trybie Agent, skoncentrowany na tym węźle, i pokaże, który węzeł jest modyfikowany:

| Węzeł ma... | Panel pokazuje |
|---|---|
| Brak wyniku w bieżącym uruchomieniu | **Modifying Node:** w kompaktowym wierszu z ikoną i nazwą węzła. Asystent edytuje wyłącznie na podstawie konfiguracji węzła; uruchom najpierw węzeł, jeśli powinien widzieć dane wyjściowe |
| Wynik w bieżącym uruchomieniu | **Modifying Node: (Has Node Output)** nad samym węzłem: ikona, nazwa i typ, ostatni status i czas trwania oraz błąd w przypadku niepowodzenia. Asystent widzi te dane wyjściowe i błąd podczas edycji węzła |

Najedź na etykietę, aby sprawdzić stan panelu.

Niezależnie od stanu panelu asystent odczytuje również stronę dokumentacji węzła pod ikoną książki w nagłówku węzła. Wykorzystuje ją do zrozumienia opcji węzła i odpowiadania na pytania z nimi związane.

Poniżej wiadomości trzy opcje umożliwiają rozpoczęcie żądania:

| Opcja | Co robi |
|---|---|
| **Change this node as ...** | Wypełnia pole wiadomości tekstem *Zmień ten węzeł na*, aby można było dokończyć zdanie |
| **Fix error in this node ...** | Wypełnia *Napraw błąd w tym węźle.* Asystent odczytuje błąd tego węzła z ostatniego uruchomienia |
| **Other** | Ustawia fokus na pustym polu wiadomości |

Edytuj tekst i naciśnij **Send**. Asystent zwraca tylko ten węzeł, a Heym aktualizuje go w miejscu: węzeł zachowuje swój identyfikator, typ i nazwę, dzięki czemu wyrażenia takie jak `$checkLinkedIn.result` w innych węzłach nadal działają. Inne węzły, połączenia i układ nie ulegają zmianie, a **Undo** przywraca poprzednią konfigurację.

Jeśli żądanie nie mieści się w węźle, np. wymaga innego typu węzła lub nowego węzła, asystent wskazuje, co należałoby zmienić zamiast edycji. Zamknij fokus węzła za pomocą ikony **X** na karcie węzła, aby ponownie edytować cały workflow. Zamknięcie panelu również czyści fokus.

[Tryb YOLO](#yolo-mode) działa z ustawionym fokusem: asystent modyfikuje węzeł, uruchamia workflow i naprawia węzeł, aż uruchomienie zakończy się powodzeniem. W trybie **Ask** fokus wskazuje asystentowi, którego węzła dotyczy pytanie, a canvas nie ulega zmianie.

## Tryb YOLO

**Tryb YOLO** pozwala asystentowi testować to, co zbuduje. Zaznacz pole **YOLO mode** pod polem wiadomości, a następnie wyślij żądanie. Pole pojawia się wyłącznie w trybie Agent. Domyślnie jest wyłączone i wyłącza się po przeładowaniu strony. Najedź kursorem na ikonę informacji obok niego, aby wyświetlić krótkie podsumowanie.

Przy włączonym trybie YOLO asystent nie zatrzymuje się po zastosowaniu workflow:

1. Stosuje workflow na canvasie.
2. Przed pierwszym uruchomieniem prosi o dane wejściowe do testu. Karta wyświetla pola wejściowe workflow wypełnione wartościami sugerowanymi przez asystenta. Można je edytować i nacisnąć **Run**. Kolejne uruchomienia wykorzystują te same wartości. Karta pojawia się ponownie tylko wtedy, gdy zmienią się pola wejściowe lub asystent będzie potrzebował innych danych testowych.
3. Uruchamia workflow na canvasie dokładnie tak samo jak przycisk **Run**: niezapisane zmiany są najpierw zapisywane, węzły podświetlają się, a uruchomienie pojawia się w panelu Debug oraz w [Execution History](./execution-history.md).
4. Odczytuje wynik. Jeśli uruchomienie zrealizowało żądanie, kończy pracę statusem **Verified** i krótkim podsumowaniem. Jeśli nie, poprawia workflow i uruchamia go ponownie.

Wykonuje co najwyżej **5 uruchomień** na wiadomość. Naciśnięcie **Stop** w dowolnym momencie kończy pętlę i zatrzymuje uruchomienie w toku.

Każda odpowiedź pokazuje swoje kroki na bieżąco:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, z wierszem `Executing <node>` dla każdego węzła;
- ostateczny werdykt.

Po każdym uruchomieniu pojawia się krótki wiersz, np. *Attempt 1 result sent · error in 1.2s*, informujący, że wynik został przekazany z powrotem do asystenta.
### Uruchamianie innych workflow

W trybie YOLO asystent może również uruchamiać inne workflow, gdy potrzebuje ich wyniku. Może na przykład sprawdzić, co zwraca dany workflow, zanim wywoła go z węzła [Execute](../nodes/execute-node.md). Takie uruchomienia są wyświetlane jako kroki `Running workflow "<name>"...` i są zapisywane w Historii wykonań ze źródłem triggera `ai_assistant`. Edytowany workflow jest zawsze testowany na canvasie.

### Kiedy zatrzymuje się wcześniej

| Sytuacja | Co się dzieje |
|---|---|
| Asystent potrzebuje decyzji, informacji, danych logowania lub tabeli danych | Pyta za pomocą standardowej karty pytań. Odpowiedź kontynuuje pętlę. |
| Uruchomienie oczekuje na [human review](./human-in-the-loop.md) | Pętla zatrzymuje się. Należy zatwierdzić przegląd, a następnie wysłać wiadomość. |
| Workflow oczekuje na przesłanie pliku | Pętla zatrzymuje się. Tryb YOLO nie może testować uruchomień wyzwalanych przesłaniem pliku. |
| Nowsza wersja workflow została zapisana w innym miejscu | Pętla zatrzymuje się. Należy rozwiązać konflikt zapisu, a następnie wysłać wiadomość. |

> **Uruchomienia są rzeczywiste.** E-maile, wiadomości i wywołania API w workflow są faktycznie wysyłane przy każdej próbie, a węzły Tabel danych zapisują rzeczywiste wiersze. Każde uruchomienie zapisuje workflow, więc wcześniejsze wersje pozostają w [Historii](../nodes/execute-node.md).

## Wprowadzanie głosowe

W obsługiwanych przeglądarkach przycisk **Voice** włącza zamianę mowy na tekst. Kliknięcie rozpoczyna nagrywanie, ponowne kliknięcie je zatrzymuje. Przetranskrybowany tekst jest wysyłany do AI w celu poprawy gramatyki przed wysłaniem.

## Węzeł Agent a Asystent AI

| | Węzeł Agent | Asystent AI |
|---|------------|---------------|
| **Cel** | Węzeł LLM wewnątrz workflow; uruchamiany podczas wykonania | Interfejs Chat do budowania workflow w języku naturalnym |
| **Lokalizacja** | Węzeł na canvasie | Panel debugowania → panel pływający |
| **Kiedy** | W czasie wykonania | Podczas edycji |

Informacje o węźle workflow, który wykonuje wywołania LLM z narzędziami i MCP, znajdują się w sekcji [Węzeł Agent](../nodes/agent-node.md).

## Jak to działa (AI Builder DSL)

Asystent AI jest oparty na **workflow DSL** (języku dziedzinowym), który opisuje węzły, krawędzie i wyrażenia. Po wysłaniu wiadomości:

1. Wiadomość wraz z [Regułami użytkownika](./user-settings.md) i bieżącym workflow (jeśli istnieje) są wysyłane do backendu.
2. Backend buduje **system prompt**, który zawiera:
   - Pełny workflow DSL (typy węzłów, składnia wyrażeń, reguły, przykłady)
   - Reguły użytkownika dołączone jako "User Custom Rules"
   - Bieżący JSON workflow, gdy edytowany jest istniejący workflow
   - Listę dostępnych workflow, jeśli używany jest węzeł Execute
   - Nazwy, typy i identyfikatory danych logowania będących Twoją własnością lub Ci udostępnionych (nigdy ich wartości)
   - Nazwy, identyfikatory, opisy i kolumny tabel danych, których można użyć (nigdy ich wiersze)
3. Model zwraca pojedynczy blok JSON workflow (z `nodes` i `edges`). Frontend parsuje go i stosuje na canvasie.

### Dane logowania

Gdy workflow wymaga danych logowania, asystent pyta o nie przed zbudowaniem. Jeśli dostępne są dane logowania pasującego typu, wyświetla je wraz z opcją **Create a new credential**; jeśli nie ma żadnych, pyta, czy utworzyć nowe. Każde pytanie pozwala również kontynuować bez danych logowania.

Wybór utworzenia nowych danych logowania otwiera formularz w panelu, wstępnie ustawiony na właściwy typ i sugerowaną nazwę. Wartości trafiają bezpośrednio do Heym; asystent poznaje wyłącznie nazwę i typ. Dane logowania OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) są łączone w oknie popup, a na wypadek jego zablokowania pojawia się link do strony autoryzacji. Po zapisaniu danych logowania karta pokazuje ich nazwę, a przycisk tworzenia zostaje wyłączony; należy nacisnąć **Submit answers**, a asystent umieści nowe dane logowania na węźle.

Można również poprosić o same dane logowania ("create a GitHub credential") lub o zmianę posiadanych ("update my sheet credential", "reconnect my Google Sheets"). Asystent odpowiada tą samą kartą: tworzenie otwiera pusty formularz, aktualizacja otwiera formularz na tych danych logowania z zamaskowanymi sekretami.

Asystent preferuje dedykowany węzeł. Gdy żaden węzeł nie obsługuje danej operacji, na przykład dodania zakładki do Google Sheet, używa żądania HTTP i zapisuje wiersz nagłówka dla wybranych danych logowania. Zobacz [HTTP › Uwierzytelnianie za pomocą danych logowania](../nodes/http-node.md#authenticating-with-credentials).

Pytania doprecyzowujące, bez których workflow może sobie poradzić, mają w polu wejściowym oznaczenie **Optional** i można je pominąć.

DSL wymusza etykiety w camelCase, ujednolicone reguły wyrażeń i pola specyficzne dla węzłów. Jeśli wartość pola to pojedyncze `$expr`, backend zachowuje typ natywny; jeśli wartość miesza prozę z `$refs`, wynikiem jest ciąg znaków. Zasada jednego `$` nadal obowiązuje: brak `$` wewnątrz nawiasów. Reguły użytkownika z [Ustawień](./user-settings.md) są wstrzykiwane do tego system promptu, dzięki czemu preferencje mają zastosowanie do każdego workflow wygenerowanego przez AI.

Jeśli bieżący workflow zawiera umiejętności Agenta, Asystent AI uwzględnia w tym kontekście workflow wyłącznie plik `SKILL.md` każdej umiejętności. Załączone pliki `.py` i binarne zasoby umiejętności są usuwane przed wysłaniem żądania, aby builder pozostawał w granicach kontekstu modelu nawet wtedy, gdy umiejętności zawierają duże implementacje.
### Tabele danych

Gdy workflow zapisuje, przechowuje lub wyszukuje rekordy, a nie wskazano innego magazynu, asystent korzysta z węzła [DataTable](../nodes/datatable-node.md). Jeśli wskazano jedną z tabel i zawiera ona kolumny wymagane przez workflow, asystent użyje właśnie jej. W przeciwnym razie zapyta, której tabeli użyć. Karta wyświetla listę pasujących tabel, każdą z opisem i typami kolumn, a także opcję **Utwórz nową tabelę** z proponowaną nazwą i kolumnami. Tabele udostępnione użytkownikowi również są oferowane; tabela z uprawnieniem tylko do odczytu jest oferowana wyłącznie do odczytu.

Należy wybrać nową tabelę i nacisnąć **Prześlij odpowiedzi**: karta utworzy tabelę, a asystent umieści jej identyfikator w węźle i użyje dokładnych nazw jej kolumn. Można również poprosić o samą tabelę, na przykład „utwórz tabelę dla moich leadów”.

Asystent widzi nazwy tabel, opisy i kolumny, nigdy wiersze. Nigdy nie zmienia kolumn istniejącej tabeli: jeśli w tabeli brakuje kolumny wymaganej przez workflow, wskazuje tę kolumnę i proponuje nową tabelę. Kolumny należy dodawać w [zakładce DataTable](../tabs/datatable-tab.md).

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Budowanie w języku naturalnym jako pierwszy etap cyklu życia agenta
- [Szybki start](../getting-started/quick-start.md) – Zbuduj pierwszy workflow
- [Ustawienia](./user-settings.md) – Reguły użytkownika wstrzykiwane do promptu systemowego Asystenta AI
- [Chat z Heym](./chat-with-heym.md) – Asystent świadomy kontekstu strony w obszarze dokumentacji
- [Kluczowe koncepcje](../getting-started/core-concepts.md) – Workflows, węzły i przepływ wykonania
- [Węzeł Agent](../nodes/agent-node.md) – Węzeł LLM z narzędziami i MCP
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie kluczy API dla Asystenta AI
- [Struktura workflow](./workflow-structure.md) – Format JSON dla workflows
