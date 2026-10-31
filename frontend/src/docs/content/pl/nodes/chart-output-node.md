# Wyjście wykresu

Węzeł **Wyjście wykresu** jest węzłem końcowym workflow [widgetu dashboardu](../tabs/dashboard-tab.md). Pobiera wiersze wygenerowane przez węzły poprzedzające i przekształca je w standardowy payload wykresu, który renderuje dashboard.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 0 (końcowe) |
| Wyjście | Standardowy payload wykresu |

Węzeł ten należy umieścić **na końcu** workflow widgetu dashboardu. W przypadku relacji encji węzeł poprzedzający generuje obiekt grafu (zob. [Entity relationships](#entity-relationships-db)). Inne wykresy oparte na danych używają tablicy obiektów wierszy, na przykład:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Gdy dostępne są wyłącznie dane przykładowe (bez rzeczywistego źródła), należy wygenerować te wiersze za pomocą węzła **Set** z użyciem `$array(dict(...), dict(...))` — na przykład `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Nie** należy używać `${...}` ani samodzielnych literałów obiektowych `{...}`; Heym buduje obiekty wyłącznie za pomocą `dict(key=value)`.

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` lub `hitl` |
| `orientation` | string | `vertical` lub `horizontal` (tylko wykresy słupkowe) |
| `dataPath` | string | Ścieżka kropkowa do tablicy wierszy (lub obiektu grafu dla `erDiagram`) w wyjściu węzła poprzedzającego (np. `data` lub `result.items`). Pozostawić puste, aby wykryć automatycznie. |
| `labelField` | string | Klucz wiersza używany jako etykieta kategorii (pie/bar/line) |
| `valueField` | string | Klucz wiersza używany jako wartość liczbowa (pie/bar/line/numeric/gauge) |
| `series` | array | Opcjonalna definicja wielu serii `[{ "name": "Sent", "field": "sent" }]` dla bar/line (zastępuje `valueField`) |
| `columns` | array | Opcjonalna lista kolumn dla `table` (domyślnie klucze pierwszego wiersza) |
| `statusColumn` | string | Opcjonalna kolumna `table` renderowana jako kolorowe [znaczniki statusu](#status-chips). Musi być jedną z wyświetlanych kolumn. |, a z `linkColumn` zawiera także kolumnę linku i tekst przycisku.
| `statusTones` | object | Opcjonalne mapowanie wartości statusu na odcień (`success`, `attention`, `failure`, `waiting`, `neutral`) dla wartości nieobjętych ustawieniami domyślnymi |
| `linkColumn` | string | Opcjonalna kolumna `table`, której komórki zawierają adres URL, wyświetlany jako [przycisk linku](#link-buttons) otwierający go w nowej karcie. Musi być jedną z wyświetlanych kolumn. |
| `linkLabel` | string | Opcjonalny tekst przycisku linku. Jeśli pole jest puste, przycisk pokazuje tylko ikonę linku. |
| `xField` / `yField` | string | Klucze wiersza dla osi numerycznych X i Y (scatter) |
| `min` / `max` | number | Zakres numeryczny dla `gauge` (domyślnie `0` / `100`) |
| `unit` | string | Opcjonalna jednostka wyświetlana obok wartości `numeric` lub `gauge` |
| `text` | string | Wiadomość w formacie Markdown dla typu wykresu `text`. Pozostawić puste i ustawić `valueField`, aby renderować dynamiczną wiadomość pobraną z danych węzła poprzedzającego. |
| `title` | string | Opcjonalny tytuł wykresu |
| `hitlWorkflowId` | string | Tylko `hitl`. Pokazuje wyłącznie recenzje tego Workflow. Jeśli pole jest puste, widżet pokazuje wszystkie recenzje. |
| `hitlNodeId` | string | Tylko `hitl`. Zawęża `hitlWorkflowId` do jednego kroku: Agent z weryfikacją przez człowieka albo krok Slack z zatwierdzeniem, przyciskami lub formularzem. |

## Typy wykresów

- **bar / line / area / pie** — wykresy kategoryczne oparte na `labelField` + `valueField` (lub `series` dla wieloseryjnych bar/line/area). `area` to wypełniony wykres trendu.
- **table** — surowe wiersze renderowane jako przewijalna tabela z użyciem `columns`. Jedna kolumna może być renderowana jako [znaczniki statusu](#status-chips), a wiersze mogą otwierać [stronę szczegółów](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — pojedyncza wartość KPI z pierwszego wiersza, z opcjonalną `unit`.
- **gauge** — pojedyncza wartość prezentowana w zakresie `min`–`max` (np. wartość procentowa). Używa `valueField`.
- **scatter** — punkty X/Y z `xField` i `yField` dla wykresów korelacji.
- **proportion** — pojedynczy poziomy pasek podzielony na udziały z legendą procentową (np. podział według języka). Używa `labelField` + `valueField`.
- **barGauge** — jeden poziomy wskaźnik na wiersz z gradientem od czerwonego do zielonego oraz wartością (np. wolne miejsce na dysku). Używa `labelField` + `valueField`, opcjonalnie `unit` i `max` (domyślnie największa wartość wiersza).
- **gantt** — harmonogramy zadań z datami, postępem i zależnościami; zob. [Harmonogramy Gantta](#gantt-schedules).
- **erDiagram** — encje bazy danych, pola, klucze i relacje; zob. [Entity relationships](#entity-relationships-db).
- **text** — wiadomość w formacie markdown (np. notatka statusu typu „Ostatnie wykonanie o 19:47”). Umieścić markdown w `text` dla wiadomości statycznej lub pozostawić `text` puste i ustawić `valueField`, aby renderować ciąg znaków generowany przez węzeł poprzedzający. Obsługuje nagłówki, pogrubienie/kursywę, [listy](../nodes/chart-output-node.md#interactive-task-lists), linki oraz kod w linii.
- **hitl** — karuzela oczekujących recenzji użytkownika. Nagłówek wyświetla `1/n pending`; strzałka w lewo jest nieaktywna na pierwszej karcie, a strzałka w prawo na ostatniej. Nazwa workflow otwiera to wykonanie na canvasie. Przyciski **Approve**, **Request changes** i **Reject** rozstrzygają recenzję, a ikona historii obok tytułu widgetu otwiera to wykonanie w oknie historii na tej samej stronie. Ten typ wykresu ignoruje wiersze z węzłów poprzedzających, więc workflow widgetu składa się wyłącznie z węzła Wyjście wykresu. Każda zalogowana osoba widzi recenzje workflow, których jest właścicielem. Proszę wybrać **Workflow** (oraz **Select agent**, jeśli ma kilka kroków recenzji) we właściwościach węzła lub w ustawieniach widżetu, aby zamiast tego pokazać recenzje tego Workflow wszystkim, którzy mogą go otworzyć; zob. [widżety HITL](../tabs/dashboard-tab.md#hitl-widgets).

### Harmonogramy Gantta

Wybierz **Gantt** (`gantt`) dla harmonogramów projektów i osi czasu zadań. Ustaw `dataPath` na tablicę zadań, np. `tasks`. Wiersze używają stałych nazw pól:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` i `end` przyjmują daty lub znaczniki czasu ISO. Wartości bez strefy czasowej używają UTC; przesunięcia stref są konwertowane na UTC. `end` musi przypadać w tym samym dniu lub po `start`. Pole `progress` jest opcjonalne (0–100, domyślnie 0); `dependencies` zawiera identyfikatory istniejących zadań. Identyfikatory muszą być unikalne. Najedź kursorem na zadanie, aby odczytać pełne daty, postęp i zależności. Duże wykresy przewijają się wewnątrz widgetu. Akceptowanych jest maksymalnie 500 zadań.

Dla danych przykładowych mapowanie Set o nazwie `tasks` może użyć `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Połącz je z Chart Output z `chartType: "gantt"` i `dataPath: "tasks"`. Zmapuj kolumny źródłowe na te stałe nazwy za pomocą węzła Set; `labelField` i `valueField` nie są używane.

### Entity relationships (DB)

Wybierz **Entity relationships (DB)** (`erDiagram`) dla schematów baz danych i połączeń encji. Ustaw `dataPath` na **obiekt** grafu, np. `graph`, zawierający obie tablice:

```json
{
  "graph": {
    "entities": [
      { "id": "customers", "label": "Customers", "fields": [{ "name": "id", "type": "uuid", "key": "PK" }] },
      { "id": "orders", "label": "Orders", "fields": [{ "name": "customer_id", "type": "uuid", "key": "FK" }] }
    ],
    "relations": [
      { "source": "customers", "target": "orders", "sourceField": "id", "targetField": "customer_id", "cardinality": "one-to-many", "label": "places" }
    ]
  }
}
```

Pola posiadają `name`, opcjonalny `type` oraz opcjonalny `key` (`PK`, `FK`, `PK/FK` lub puste). Relacje odwołują się do istniejących identyfikatorów encji; opcjonalne pola `sourceField` i `targetField` kotwiczą połączenie z nazwanymi polami. `cardinality` akceptuje `one-to-one`, `one-to-many` (domyślnie), `many-to-one` lub `many-to-many`. Identyfikatory encji i nazwy pól w obrębie każdej encji muszą być unikalne. Akceptowanych jest maksymalnie 100 encji, 100 pól na encję i 500 relacji.

Za pomocą węzła Set skonstruuj `graph` przez `$dict(entities=array(dict(...)), relations=array(dict(...)))`; użyj `chartType: "erDiagram"` i `dataPath: "graph"`. Jest to wizualizacja dostarczonego schematu; nie dokonuje automatycznej inspekcji aktywnej bazy danych.

Oba typy pojawiają się w **Dodaj widget** z podglądem oraz w selektorze typu wykresu węzła na canvasie. Heym Work może proponować te typy podczas opisywania harmonogramu lub schematu bazy danych, rysując podglądy proponowanych zadań lub encji przed utworzeniem strony.

### Interaktywne listy zadań

W statycznym polu `text` należy użyć składni listy zadań w formacie GitHub-flavored markdown:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Na [Dashboardzie](../tabs/dashboard-tab.md) pola wyboru renderują się jako klikalne kontrolki (przyjazne dla trybu ciemnego i jasnego). Przełączenie pola wyboru aktualizuje pole `text` workflow widgetu i jest zachowywane po odświeżeniu.

**Edycja w miejscu:** kliknięcie dwukrotne etykiety elementu zadania umożliwia edycję w miejscu. Naciśnięcie Enter lub kliknięcie poza elementem zapisuje zmiany; naciśnięcie Escape anuluje. Całkowite wyczyszczenie etykiety usuwa dany element z listy.

**Linki w elementach zadań:** gdy etykieta zawiera link markdown (`[title](url)`), kliknięcie linku otwiera adres URL bez przełączania pola wyboru. Aby przełączyć pole, należy kliknąć w innym miejscu wiersza.

**Tylko tekst statyczny:** interaktywność wymaga składni listy zadań GFM (`- [ ]` / `- [x]`). Zwykłe dynamiczne wiadomości statusu bez elementów zadań pozostają tylko do odczytu. Gdy markdown pochodzi z `valueField`, pierwsze przełączenie kopiuje go do statycznego pola `text`, aby zmiany były zachowywane.
### Listy numerowane

Widżety tekstowe renderują markdown z **zachowaniem jawnych numerów wierszy**. Każdy wiersz należy poprzedzić numerem, który ma być wyświetlony (np. `9.`, `8.`, `7.`). Heym nie numeruje wierszy ponownie.

**Dlaczego jawne numery?** Standardowe uporządkowane listy markdown (`1.`, `2.`, `3.`) stają się listami HTML `<ol>`, które liczą wyłącznie **w górę** od pierwszego numeru. Lista zapisana jako `9.` / `8.` / `7.` zostałaby wyświetlona jako `9`, `10`, `11` w zwykłym rendererze markdown. Poprzedzenie każdego wiersza docelowym numerem pozwala tego uniknąć.

**Listy malejące (np. od najnowszych):** markdown należy zbudować w pętli workflow i obliczyć numer wyświetlany dla każdego elementu:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typowy wzorzec:

1. Pobierz lub zbuduj tablicę elementów (np. HTTP → `body.videos`).
2. Wykonaj [Loop](./loop-node.md) po tablicy; wewnątrz ciała użyj [Variable](./variable-node.md) z `.add()`, aby dołączyć jeden numerowany wiersz na iterację.
3. Po gałęzi **done** pętli użyj [Set](./set-node.md) `join("\n")` na zgromadzonej tablicy (lub jej odpowiedniku) do pojedynczego łańcucha markdown.
4. Wskaż **Chart Output** `valueField` na ten łańcuch (lub ustaw statyczne `text`).

Przykładowe wyrażenie wiersza wewnątrz pętli (etykieta `processVideos`, elementy z `title` i `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Wynikowy markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Dla prostej listy rosnącej zaczynającej się od 1 należy poprzedzić każdy wiersz (`1.`, `2.`, `3.`) lub użyć pętli z `$loop.index + 1`. Gdy numery nie są potrzebne, należy użyć [list punktowanych](#interactive-task-lists) (`- item`).

## Znaczniki statusu

Tabela (`table`) może wyświetlać jedną kolumnę jako kolorowe znaczniki (chips). Ustaw **Status column** we właściwościach węzła (lub `statusColumn` w DSL) na nazwę kolumny. Każda wartość otrzymuje jeden z pięciu odcieni, a popularne słowa otrzymują go bez dodatkowej konfiguracji:

| Odcień | Słowa domyślne |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | wszystko inne |

Dopasowywanie ignoruje wielkość liter, `_` oraz `-`, więc `IN_PROGRESS` i `in-progress` dają `waiting`. Dodaj **Status tones** dla innych wartości; wpis nadpisuje domyślne ustawienie dla danej wartości:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

Serwer przypisuje każdej wartości odpowiedni odcień, dzięki czemu Heym i Heym Work wyświetlają te same kolory.

## Strony szczegółów: `$page.record`

Dashboard otwarty z parametrem `?record=<value>` uruchamia każdy Workflow widżetu z tą wartością jako `$page.record`. Link w wierszu tabeli otwiera taką stronę; zobacz [Strony szczegółów](../tabs/dashboard-tab.md#detail-pages). Na dashboardzie otwartym bez rekordu oraz w oknie wyrażeń `$page.record` ma wartość `null`. Węzeł o etykiecie `page` ma nad nim pierwszeństwo.

Użyj tej wartości, aby pobrać konkretny rekord, którego dotyczy strona, na przykład w węźle [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` jest samą wartością klikniętego wiersza, np. `V-1002`, a nie obiektem z polami. Aby znaleźć ten rekord w [DataTable](./datatable-node.md), przefiltruj kolumnę rekordu według tej wartości: operacja `find` z filtrem `{"vendor_id": "$page.record"}`. Ścieżka taka jak `$page.record.id` zwraca pustą wartość, dlatego widżet tworzony lub dostrajany przez AI pomija te pola i odczytuje bezpośrednio `$page.record`.

Wartość pochodzi z adresu URL, który każdy może zmienić. Dashboard akceptuje wyłącznie wartości w swoim formacie rekordu (domyślnie litery, cyfry, `-`, `_` oraz `.`), ale mimo to należy traktować ją jako niezaufane dane wejściowe: przekazuj ją tam, gdzie węzeł escapuje wartości, np. jako parametr zapytania HTTP lub wartość filtru [DataTable](./datatable-node.md) albo ClickHouse, i nigdy nie buduj treści zapytania poprzez łączenie łańcuchów znaków. Widżety nadal wykonują się z uprawnieniami właściciela dashboardu, niezależnie od tego, kto otworzy stronę.

## Jak rozwiązywane są dane

1. Jeśli ustawiono `dataPath`, węzeł podąża tą ścieżką kropkową do danych wyjściowych poprzedzającego węzła.
2. W przeciwnym razie szuka tablicy: listy najwyższego poziomu, tablicy `data` lub pierwszego pola o wartości będącej listą.
3. Wiersze pochodzące bezpośrednio z węzła [Data Table](./datatable-node.md) (`{id, data, created_at}`) są odczytywane z ich kolumnami na najwyższym poziomie obok `id`, dzięki czemu `labelField`, `valueField` oraz `columns` wskazują bezpośrednio kolumny tabeli.
4. Dla `table` każdy wiersz staje się wierszem tabeli przy użyciu `columns` (lub kluczy pierwszego wiersza). Przy ustawionym `statusColumn` Payload zawiera również odcień każdej wartości w tej kolumnie.
5. Dla `numeric` i `gauge` wartość pochodzi z `valueField` w pierwszym wierszu (lub z pierwszego pola liczbowego).
6. Dla `scatter` każdy wiersz staje się punktem `[xField, yField]`.
7. Dla `text` komunikat jest pobierany z `valueField` w pierwszym wierszu, gdy jest ustawiony, w przeciwnym razie ze statycznej konfiguracji `text` (w ostateczności z pierwszego pola tekstowego pierwszego wiersza).

## Przykład

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (pojedyncza wartość względem zakresu):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (punkty X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (jeden słupek podzielony według udziału + legenda procentowa):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (wypełniony trend wieloseryjny):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge gradientowy na wiersz z wartościami):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (statyczny komunikat markdown — nie wymaga wierszy z poprzedzającego węzła):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dynamiczny — łańcuch komunikatu jest tworzony w poprzedzającym węźle i pobierany przez `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## Przykładowe prompty AI

Podczas generowania widżetu za pomocą **AI** poniższe prompty w czytelny sposób odpowiadają poszczególnym typom:

- **Bar** — „Show monthly revenue for the last 6 months as a vertical bar chart with example data."
- **Line** — „Plot daily active users over the last 14 days as a line chart."
- **Area** — „Show memory and CPU usage over the last 24 hours as an area chart with two series. Use example data."
- **Pie** — „Break down execution status (success, error, cancelled) as a pie chart."
- **Table** — „Show the top 10 workflows by execution count as a scrollable table with name and runs columns. Use example data."
- **Numeric** — „Show today's total workflow executions as a single KPI with unit 'runs'. Use example data."
- **Gauge** — „Show current CPU usage as a gauge from 0 to 100 percent."
- **Scatter** — „Plot request latency versus payload size as a scatter chart with example data."
- **Proportion** — „Show my most used languages as a proportion bar: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Use example data."
- **Bar gauge** — „Show free disk space per volume (sda1 to sda7) as a bar gauge in GB. Use example data."
- **Text** — „Add a text widget with a markdown checklist (one checked item, two unchecked), or list the 5 newest tutorial videos in descending order (5. down to 1.) with YouTube links — prefix each line with an explicit number (`5. Title`, `4. Title`, …)."

## Powiązane

- [Karta Dashboard](../tabs/dashboard-tab.md) — budowanie i rozmieszczanie widżetów
- [Węzeł wyjściowy](output-node.md) — węzeł końcowy dla zwykłych workflow


## Przyciski linków

Kolumnę `table` można zamienić w przyciski otwierające link. Proszę ustawić **Link column** we właściwościach węzła (lub `linkColumn` w DSL) na kolumnę, której komórki zawierają adres URL, oraz opcjonalnie **Link button text** (`linkLabel`). Każda komórka staje się przyciskiem otwierającym swój adres URL w nowej karcie. Bez tekstu przycisku pokazuje on tylko ikonę linku:

| Wartość komórki | Otwiera |
| --------------- | ------- |
| `https://jira.example.com/browse/T-1` | Inną witrynę w nowej karcie |
| `/dashboards` | Stronę wewnątrz Heym w nowej karcie |

Przyciskami stają się tylko adresy `http://` i `https://` oraz ścieżki zaczynające się od pojedynczego `/`. Każda inna wartość, na przykład `javascript:` lub `//host`, pozostaje zwykłym tekstem, a pusta komórka nic nie pokazuje.

Przycisk działa obok [linku wiersza](../tabs/dashboard-tab.md#detail-pages): kliknięcie przycisku otwiera jego link w nowej karcie, a kliknięcie w dowolnym innym miejscu wiersza nadal otwiera stronę szczegółów.
