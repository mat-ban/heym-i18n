# Converter

Węzeł **Converter** konwertuje dane i pliki między formatami bez konieczności pisania kodu. Jest neutralny technologicznie, dzięki czemu z czasem można dodawać kolejne formaty. Konwertuje dane CSV, JSON i XML w obu kierunkach, uruchamia Tesseract OCR w celu wydobycia tekstu z obrazów i plików PDF oraz zapisuje przechowywany plik w innym formacie.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.result` (sparsowane dane dla `csvToJson` / `xmlToJson`, tekst dla `jsonToCsv` / `jsonToXml`, wyodrębniony tekst dla `imageToText` / `pdfToText`, metadane nowego pliku dla `fileConvert`) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `conversion` | string | `csvToJson` (tekst CSV → tablica obiektów wierszy), `jsonToCsv` (tablica obiektów/wierszy → tekst CSV), `xmlToJson` (tekst XML → obiekt), `jsonToXml` (obiekt → tekst XML), `imageToText` (OCR obrazu), `pdfToText` (OCR każdej wybranej strony PDF) lub `fileConvert` (zapis przechowywanego pliku w innym formacie) |
| `source` | expression | Dane do konwersji. Pozostaw puste, aby użyć pierwszego wejścia węzła |
| `delimiter` | string | Jednoznakowy separator pól (domyślnie `,`) |
| `hasHeader` | boolean | Tylko `csvToJson` — traktuj pierwszy wiersz jako nagłówek (domyślnie `true`) |
| `trimValues` | boolean | Tylko `csvToJson` — usuń białe znaki wokół nazw nagłówków i wartości komórek (domyślnie `true`) |
| `includeHeader` | boolean | Tylko `jsonToCsv` — zapisz wiersz nagłówka (domyślnie `true`) |
| `converterColumns` | string | Tylko `jsonToCsv` — opcjonalna kolejność kolumn rozdzielona przecinkami |
| `converterFileId` | expression | Konwersje plików — plik Heym Drive do odczytu, np. `$Upload.file.id` |
| `converterTargetFormat` | string | Tylko `fileConvert` — format wyjściowy (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Tylko OCR — `auto` (domyślnie), kod Tesseract taki jak `tur` lub `custom` |
| `ocrLanguageCustom` | string | Tylko OCR — kody języków używane, gdy `ocrLanguage` ma wartość `custom`, np. `eng+tur` |
| `ocrEncoding` | string | Tylko OCR — zestaw znaków, do którego normalizowany jest tekst (domyślnie `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Tylko OCR — zastosuj normalizację NFC (domyślnie `true`) |
| `ocrPsm` | string | Tylko OCR — tryb segmentacji strony Tesseract (domyślnie `3`) |
| `ocrDpi` | number | Tylko `pdfToText` — DPI rasteryzacji strony (domyślnie `300`) |
| `ocrPageRange` | expression | Tylko `pdfToText` — `3` lub `2-5`. Puste oznacza każdą stronę |

## Zachowanie

- **`csvToJson`** parsuje źródłowy tekst CSV. Przy `hasHeader: true` każdy wiersz staje się obiektem z kluczami pochodzącymi z wartości nagłówka; przy `hasHeader: false` każdy wiersz staje się tablicą wartości komórek. Pola w cudzysłowach, osadzone separatory i osadzone znaki nowej linii są obsługiwane zgodnie z RFC 4180. Wiodący BOM UTF-8 (częsty w eksportach z Excela) jest usuwany, a zduplikowane nazwy nagłówków są ujednolicane bez nadpisywania rzeczywistej kolumny (`a, a, a_2` → `a`, `a_3`, `a_2`). Ustaw `delimiter` na `\t`, aby parsować wartości rozdzielone tabulatorami.
- **`trimValues`** (domyślnie `true`) usuwa otaczające białe znaki z nazw nagłówków i wartości komórek, **również wewnątrz pól w cudzysłowach** (`" padded "` → `padded`). RFC 4180 traktuje białe znaki w cudzysłowach jako dane, dlatego należy ustawić `trimValues: false`, aby zachować je dokładnie.
- **`jsonToCsv`** buduje tekst CSV z tablicy obiektów (lub tablic). Kolejność kolumn jest pobierana z `converterColumns`, gdy zostanie podana, w przeciwnym razie jest wnioskowana z kluczy pierwszego obiektu. Wartości zawierające separator, cudzysłowy lub znaki nowej linii są automatycznie ujmowane w cudzysłowy.
- **`xmlToJson`** parsuje XML do obiektu. Atrybuty używają prefiksów `@`, a tekst zmieszany z atrybutami używa `#text`; powtarzające się elementy rodzeństwa stają się tablicami. Rozwijanie encji XML jest wyłączone.
- **`jsonToXml`** serializuje obiekt do dokumentu XML. Obiekt musi mieć dokładnie jeden klucz najwyższego poziomu, który staje się elementem głównym XML. Należy użyć tej samej konwencji `@attribute` i `#text` co w `xmlToJson`, aby uzyskać atrybuty i tekst obok elementów podrzędnych.
- **`imageToText`** uruchamia Tesseract na pojedynczym obrazie (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteryzuje każdą wybraną stronę przy `ocrDpi` i rozpoznaje ją. Każda strona przechodzi przez OCR, więc cyfrowy PDF z doskonałą warstwą tekstową jest nadal odczytywany ponownie z pikseli. Zapewnia to identyczne zachowanie dokumentów zeskanowanych i cyfrowych, kosztem szybkości, dlatego należy zawęzić `ocrPageRange` w długich plikach.
- **`fileConvert`** zapisuje plik źródłowy w innym formacie i przechowuje wynik jako **nowy** plik Drive. Oryginał nigdy nie jest modyfikowany. Dokumenty przechodzą przez pandoc, obrazy przez Pillow, a JSON do CSV przez writer csv w Pythonie. Obraz nie może stać się dokumentem, a dokument nie może stać się obrazem; aby odczytać tekst z obrazu, należy użyć `imageToText`.

## Wprowadzanie pliku

Konwersje plików czytają z Heym Drive, a nie ze ścieżki lub adresu URL, dlatego plik musi zostać najpierw zapisany. Trzy typowe łańcuchy:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — wskaż `converterFileId` na `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — pobierz zdalny plik do Drive, a następnie przekaż `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — skill, który zapisuje plik, udostępnia go jako `$reportAgent._generated_files[0].id`.

`converterFileId` przyjmuje również cały obiekt pliku (`$Upload.file`) lub adres URL pobierania Heym; identyfikator pliku jest wyciągany z obu. Plik musi być własnością użytkownika lub być udostępniony przez współpracownika.
## Języki

`auto` (domyślne ustawienie) najpierw uruchamia wykrywanie orientacji i pisma Tesseract, a następnie wybiera najlepszy zainstalowany model dla wykrytego pisma. Modele pisma, takie jak `Latin` czy `Cyrillic`, odczytują każdy język zapisany w danym piśmie — dlatego tryb auto radzi sobie zarówno z turecką fakturą, jak i angielską, bez konieczności wskazywania, który to który.

Wskazanie języka jest jednak dokładniejsze, gdy jest on znany. Należy użyć pojedynczego kodu (`tur`) lub połączyć kilka za pomocą `+` (`eng+tur`) w przypadku dokumentów mieszanych — im więcej języków, tym wolniejsze i nieco bardziej zaszumione rozpoznawanie, dlatego listę należy utrzymywać krótką. Kody działają wyłącznie wtedy, gdy odpowiednie dane językowe są zainstalowane na backendzie; węzeł wyświetla listę dostępnych opcji po wybraniu brakującego języka.

Każdy obraz Heym zawiera `osd`, angielski, turecki, niemiecki, francuski, hiszpański, włoski, portugalski, niderlandzki, rosyjski, arabski, chiński uproszczony, japoński, koreański oraz modele pisma Latin, Cyrillic, Arabic, HanS, Japanese i Hangul.

## Kodowanie

Rozpoznany tekst jest w formacie UTF-8 i zachowuje każdy znak wygenerowany przez Tesseract. `ocrNormalizeUnicode` (domyślnie włączone) stosuje normalizację NFC, dzięki czemu litera zapisana jako `s` plus łącząca cedylla staje się pojedynczym znakiem `ş` — warto pozostawić tę opcję włączoną, ponieważ obie formy nie są sobie równe w porównaniach ani wyszukiwaniach w bazie danych.

`ocrEncoding` ma znaczenie wyłącznie wtedy, gdy elementy dalszego przetwarzania nie mogą przechowywać pełnego zakresu Unicode. Wybór `cp1254` lub `iso-8859-9` zachowuje tekst turecki w nienaruszonym stanie, gwarantując jednocześnie, że wynik mieści się w tym zestawie znaków; `latin-1` i `ascii` są węższe i zastępują znaki, których nie mogą reprezentować, znakiem `?`. Należy pozostawić `utf-8`, chyba że system docelowy wymusza inne ustawienie.

## Dane wyjściowe

`csvToJson`, `jsonToCsv`, `xmlToJson` i `jsonToXml` zwracają `$label.result` oraz `$label.conversion`. Konwersje OCR dodają:

| Pole | Opis |
|-------|-------------|
| `$label.result` | Pełny wyodrębniony tekst, strony połączone pustą linią |
| `$label.language` | Model, który faktycznie został uruchomiony (przydatne, aby sprawdzić, co wybrał tryb `auto`) |
| `$label.encoding` | Zestaw znaków, do którego znormalizowano tekst |
| `$label.page_count` | Liczba rozpoznanych stron |
| `$label.pages` | Tablica `{ page, text }` do obsługi poszczególnych stron |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` pliku źródłowego |

`fileConvert` zwraca natomiast nowy plik:

| Pole | Opis |
|-------|-------------|
| `$label.id` | UUID nowo zapisanego pliku |
| `$label.filename` | Przekonwertowana nazwa pliku, nazwa bazowa zachowana, rozszerzenie zamienione |
| `$label.mime_type` | Typ MIME nowego pliku |
| `$label.size_bytes` | Rozmiar nowego pliku |
| `$label.download_url` | Adres URL pobierania nowego pliku z Drive |
| `$label.source_file` | Metadane pliku, który został przekonwertowany |

## Przykład

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

Dla danych wejściowych `name,age\nAda,36` węzły dalszego przetwarzania uzyskują dostęp do sparsowanych wierszy poprzez `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Konwersja XML do JSON:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

Dla `<person id="1"><name>Ada</name></person>` wartość `$xmlToObject.result` wynosi `{ "person": { "@id": "1", "name": "Ada" } }`. Aby utworzyć XML, należy przekazać ten obiekt do drugiego węzła Converter z ustawieniem `conversion: "jsonToXml"`.

Odczyt zeskanowanej faktury przesłanej przez trigger file upload:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

Węzeł [Agent](./agent-node.md) lub [LLM](./llm-node.md) w dalszej części przepływu może następnie wyodrębnić ustrukturyzowane pola z `$readInvoice.result`.

Konwersja raportu markdown wygenerowanego przez agenta do PDF:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Węzły dalszego przetwarzania odczytują `$convertDoc.download_url`, aby udostępnić plik PDF, lub `$convertDoc.id`, aby kontynuować pracę z nim w [Drive](./drive-node.md).

## Wymagania

OCR wywołuje zewnętrznie `tesseract` oraz `pdftoppm` z popplera, a konwersja dokumentów korzysta z pandoc. Wszystkie trzy są dołączone do każdego sposobu uruchamiania Heym, w tym `run.sh`, docker-compose oraz pojedynczego obrazu wydania, więc nie ma nic do skonfigurowania. Limity stron, limity czasu i maksymalne DPI są stałymi wartościami platformy, a nie ustawieniami.

## Powiązane

- [Set](./set-node.md) – Przekształcanie i mapowanie poszczególnych pól
- [JSON output mapper](./json-output-mapper-node.md) – Budowanie obiektu odpowiedzi JSON
- [File upload trigger](./file-upload-trigger-node.md) – Przyjmowanie pliku do Heym Drive
- [Drive](./drive-node.md) – Przechowywanie, pobieranie i udostępnianie plików
- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Expression DSL](../reference/expression-dsl.md) – Funkcje i składnia
