# Tabele danych

Zakładka **Tabele danych** umożliwia tworzenie i zarządzanie strukturalnymi tabelami danych bezpośrednio w Heym. Tabele mogą być wykorzystywane w workflow za pośrednictwem [węzła DataTable](../nodes/datatable-node.md) do programistycznych operacji CRUD.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Obejrzyj demonstrację DataTable</a></p>

## Tworzenie tabeli

1. Przejdź do zakładki Tabele danych z poziomu dashboardu
2. Kliknij **Utwórz tabelę danych**
3. Wprowadź nazwę i opcjonalny opis
4. Dodaj kolumny za pomocą edytora kolumn

## Kolumny

Każda kolumna posiada:

| Właściwość | Opis |
|----------|-------------|
| Nazwa | Nazwa wyświetlana kolumny |
| Typ | `string`, `number`, `boolean`, `date` lub `json` |
| Wymagana | Czy nowe wiersze muszą zawierać tę kolumnę |
| Unikalna | Czy wartości muszą być unikalne w obrębie wierszy |
| Wartość domyślna | Automatycznie wypełniana, gdy wiersz pomija tę kolumnę |

Kolumny można dodawać, edytować lub usuwać z nagłówka widoku szczegółów tabeli.

## Generowanie kolumn za pomocą AI

Zamiast dodawać kolumny ręcznie, można opisać tabelę w języku naturalnym (lub wkleić przykładowy JSON) i pozwolić modelowi LLM zaproponować schemat. Oba punkty wejścia otwierają to samo okno dialogowe:

- **Generuj za pomocą AI** (nagłówek listy tabel danych) — tworzy zupełnie nową tabelę na podstawie opisu.
- **Kolumny AI** (widok szczegółów tabeli, obok kontrolek kolumn) — proponuje *nowe* kolumny do dołączenia do otwartej tabeli.

### Jak to działa

1. Wybierz **dane logowania LLM** oraz **model** (domyślnie pierwsze dane logowania LLM i jego najnowszy model).
2. Wpisz opis — na przykład *„Tabela książek z tytułem, autorem, liczbą stron i informacją, czy została przeczytana"* — lub wklej przykładowy JSON/schemat.
3. Kliknij **Generuj**. Model zwróci proponowany schemat.
4. Przejrzyj wygenerowane kolumny w edytowalnym formularzu: zmień **nazwę**, **typ**, **wartość domyślną**, **unikalność** oraz **notEmpty** (wymagana) dla każdej z nich, usuń niepotrzebne kolumny lub **Dodaj kolumnę** ręcznie. W przypadku nowej tabeli można również edytować zaproponowaną przez AI **nazwę** i **opis**.
5. Kliknij **Utwórz tabelę** (nowa tabela) lub **Dodaj kolumny** (istniejąca tabela), aby zapisać. Naciśnij **Esc**, aby w dowolnym momencie zamknąć okno dialogowe.

### Tylko dołączanie dla istniejących tabel

Podczas generowania kolumn dla istniejącej tabeli model widzi bieżące kolumny jako kontekst i proponuje **wyłącznie nowe** kolumny. Istniejące kolumny i ich dane nigdy nie są modyfikowane ani usuwane — wygenerowane kolumny są dołączane. Zduplikowane nazwy (bez rozróżniania wielkości liter) są automatycznie odrzucane.

> Wymagane są dane logowania LLM (OpenAI, Google lub Custom). Jeśli ich brak, należy najpierw dodać je w Ustawieniach.

## Zarządzanie wierszami

- **Dodaj wiersz**: Kliknij przycisk dodawania, aby utworzyć nowy wiersz
- **Edycja w miejscu**: Kliknij dwukrotnie dowolną komórkę, aby edytować jej wartość. Naciśnij Enter lub kliknij poza komórką, aby zapisać, Escape, aby anulować
- **Usuń wiersz**: Użyj menu akcji wiersza, aby usunąć wiersz
- **Paginacja**: Wiersze wyświetlane są po 25 na stronę z nawigacją stron

## Import/Eksport CSV

### Import
1. Kliknij **Importuj CSV** w widoku szczegółów tabeli
2. Wybierz plik CSV do przesłania
3. Przejrzyj pierwsze 5 wierszy i mapowanie kolumn
4. Zielone kolumny są dopasowane do istniejących kolumn tabeli; żółte są niedopasowane
5. Kliknij Importuj, aby zbiorczo wstawić wiersze

### Eksport
Kliknij **Eksportuj CSV**, aby pobrać wszystkie wiersze jako plik CSV.

## Udostępnianie

Udostępniaj tabele innym użytkownikom lub zespołom:

1. Otwórz okno udostępniania z widoku szczegółów tabeli
2. Dodaj użytkowników według adresu e-mail z uprawnieniem **odczytu** lub **zapisu**
3. Dodaj zespoły z uprawnieniem **odczytu** lub **zapisu**
4. Użytkownicy z uprawnieniem tylko do odczytu mogą przeglądać dane; użytkownicy z uprawnieniem zapisu mogą modyfikować wiersze

## Tworzenie tabel z poziomu Asystenta AI

Asystent AI na canvasie [Asystent AI](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) oraz narzędzie `heym_chat` w [zakładce MCP](./mcp-tab.md) mogą wybrać jedną z tabel do workflow, który budują, lub utworzyć nową. Proponują nazwę i kolumny, a tabelę tworzą po zatwierdzeniu karty pytania. Nigdy nie zmieniają kolumn istniejącej tabeli ani nie modyfikują jej wierszy: kolumny należy dodawać lub edytować tutaj.

## Wykorzystanie w workflow

[Węzeł DataTable](../nodes/datatable-node.md) łączy tabele z workflow. Operacje obejmują find, getAll, getById, insert, update, remove oraz upsert. Dane logowania nie są wymagane.

## Tabela kosztów LLM (tabela systemowa)

Przypięta sekcja **Tabele systemowe** pojawia się nad tabelami utworzonymi przez użytkownika i zawiera jeden wpis: **Tabela kosztów LLM**. Jest to widok o stałym schemacie, edytowalny per użytkownik, zawierający ceny poszczególnych modeli wykorzystywane przez wykresy kosztów w [Wykonaniach](./traces-tab.md).

### Skąd pochodzą dane

Heym utrzymuje globalną tabelę cen poszczególnych modeli, wypełnianą z publicznego endpointu cenowego Helicone (`https://www.helicone.ai/api/llm-costs`). Synchronizacja uruchamiana jest w tle przy pierwszym otwarciu tabeli lub Wykonań i jest ograniczona do jednego pobrania na 24 godziny. Naciśnij **Odśwież**, aby wymusić natychmiastową ponowną synchronizację. Modele usunięte z listy źródłowej Helicone nie są usuwane lokalnie, dzięki czemu historyczne wyszukiwania kosztów pozostają stabilne.

### Schemat (kolumny tylko do odczytu)

| Kolumna | Znaczenie |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informacyjnie, używane przez Helicone) |
| Model | Identyfikator modelu dopasowywany do `trace.model` |
| Op | Operator dopasowania: `equals`, `startsWith` lub `includes` |
| Input $/1M | USD za 1 milion tokenów promptu |
| Output $/1M | USD za 1 milion tokenów uzupełnienia |
| Source | `helicone`, `seed` lub `user` |
### Dostosowywanie cen

- **Edytuj wiersz**, aby nadpisać jego ceny. Nadpisanie jest przypisane do użytkownika i oznaczone plakietką `Customized`; przyszłe synchronizacje Helicone pozostawiają je bez zmian.
- **Reset to default** usuwa nadpisanie i przywraca globalną wartość dla danego wiersza.
- **Add Custom Model** otwiera okno dialogowe umożliwiające utworzenie wiersza widocznego tylko dla użytkownika (na przykład prywatnego modelu dostrojonego, którego Helicone nie wymienia). Wiersze niestandardowe są oznaczone jako `User added`, a ich usunięcie powoduje całkowite ich skasowanie.

### Dopasowywanie do śladów

Gdy pulpit Traces oblicza koszt, dopasowuje każdy `trace.model` do:

1. Nadpisań użytkownika (dokładne dopasowanie nazwy modelu) w pierwszej kolejności
2. W przeciwnym razie do tabeli globalnej — dopasowanie dokładne `equals` ma priorytet nad `startsWith`/`includes`; remisy w obrębie tego samego operatora rozstrzygane są przez najdłuższy pasujący prefiks/podciąg modelu

Jeśli żaden wiersz nie pasuje, model zostaje wymieniony w powiadomieniu **Unpriced models** na stronie Traces; jego wkład w koszt wynosi zero, dopóki nie zostanie dodany wiersz niestandardowy lub nadpisany istniejący.

## Powiązane

- [Węzeł DataTable](../nodes/datatable-node.md) — dokumentacja węzła Workflow
- [Karta Traces](./traces-tab.md) — wykorzystuje tabelę kosztów LLM do wyświetlania wykresu kołowego kosztów i kart KPI
- [Węzeł Grist](../nodes/grist-node.md) — alternatywa dla zewnętrznego arkusza kalkulacyjnego
- [Karta Zmienne](./global-variables-tab.md) — alternatywa dla przechowywania klucz-wartość
