# Converter

De **Converter**-node converteert data en bestanden tussen formaten zonder dat er code geschreven hoeft te worden. De node is technologieneutraal, zodat er in de loop der tijd meer formaten kunnen worden toegevoegd. De node converteert CSV-, JSON- en XML-data in beide richtingen, voert Tesseract OCR uit om tekst uit afbeeldingen en PDF's te halen, en herschrijft een opgeslagen bestand in een ander formaat.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.result` (geparseerde data voor `csvToJson` / `xmlToJson`, tekst voor `jsonToCsv` / `jsonToXml`, geëxtraheerde tekst voor `imageToText` / `pdfToText`, nieuwe bestandsmetadata voor `fileConvert`) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identifier (camelCase) |
| `conversion` | string | `csvToJson` (CSV-tekst → array van rij-objecten), `jsonToCsv` (array van objecten/rijen → CSV-tekst), `xmlToJson` (XML-tekst → object), `jsonToXml` (object → XML-tekst), `imageToText` (OCR op een afbeelding), `pdfToText` (OCR op elke geselecteerde PDF-pagina), of `fileConvert` (herschrijf een opgeslagen bestand in een ander formaat) |
| `source` | expression | De data die geconverteerd moet worden. Laat leeg om de eerste invoer van de node te gebruiken |
| `delimiter` | string | Scheidingsteken van één teken (standaard `,`) |
| `hasHeader` | boolean | Alleen `csvToJson` — behandel de eerste rij als de header (standaard `true`) |
| `trimValues` | boolean | Alleen `csvToJson` — verwijder witruimte rond headernamen en celwaarden (standaard `true`) |
| `includeHeader` | boolean | Alleen `jsonToCsv` — schrijf een headerrij (standaard `true`) |
| `converterColumns` | string | Alleen `jsonToCsv` — optionele kommagescheiden kolomvolgorde |
| `converterFileId` | expression | Bestandsconversies — het te lezen Heym Drive-bestand, bijvoorbeeld `$Upload.file.id` |
| `converterTargetFormat` | string | Alleen `fileConvert` — uitvoerformaat (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Alleen OCR — `auto` (standaard), een Tesseract-code zoals `tur`, of `custom` |
| `ocrLanguageCustom` | string | Alleen OCR — taalcodes die gebruikt worden wanneer `ocrLanguage` op `custom` staat, bijvoorbeeld `eng+tur` |
| `ocrEncoding` | string | Alleen OCR — tekenset waarnaar de tekst genormaliseerd wordt (standaard `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Alleen OCR — NFC-normalisatie toepassen (standaard `true`) |
| `ocrPsm` | string | Alleen OCR — Tesseract page segmentation mode (standaard `3`) |
| `ocrDpi` | number | Alleen `pdfToText` — DPI voor het rasteren van pagina's (standaard `300`) |
| `ocrPageRange` | expression | Alleen `pdfToText` — `3` of `2-5`. Leeg betekent elke pagina |

## Gedrag

- **`csvToJson`** parseert de CSV-brontekst. Met `hasHeader: true` wordt elke rij een object met de headerwaarden als sleutels; met `hasHeader: false` wordt elke rij een array van celwaarden. Velden tussen aanhalingstekens, ingesloten scheidingstekens en ingesloten regeleinden worden volgens RFC 4180 verwerkt. Een voorloop-UTF-8-BOM (gebruikelijk bij Excel-exports) wordt verwijderd, en dubbele headernamen worden uniek gemaakt zonder een echte kolom te overschrijven (`a, a, a_2` → `a`, `a_3`, `a_2`). Stel `delimiter` in op `\t` om tabgescheiden waarden te parsen.
- **`trimValues`** (standaard `true`) verwijdert omringende witruimte uit headernamen en celwaarden, **ook binnen velden tussen aanhalingstekens** (`" padded "` → `padded`). RFC 4180 behandelt witruimte tussen aanhalingstekens als data, dus stel `trimValues: false` in om deze exact te behouden.
- **`jsonToCsv`** bouwt CSV-tekst op uit een array van objecten (of arrays). De kolomvolgorde wordt overgenomen uit `converterColumns` indien opgegeven, anders afgeleid uit de sleutels van het eerste object. Waarden die het scheidingsteken, aanhalingstekens of regeleinden bevatten, worden automatisch tussen aanhalingstekens geplaatst.
- **`xmlToJson`** parseert XML naar een object. Attributen gebruiken `@`-prefixen en tekst gemengd met attributen gebruikt `#text`; herhaalde sibling-elementen worden arrays. XML entity expansion is uitgeschakeld.
- **`jsonToXml`** serialiseert een object naar een XML-document. Het object moet precies één sleutel op het hoogste niveau hebben, die het XML-rootelement wordt. Gebruik dezelfde `@attribute`- en `#text`-conventie als bij `xmlToJson` om attributen en tekst naast child-elementen te produceren.
- **`imageToText`** voert Tesseract uit op een enkele afbeelding (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rastert elke geselecteerde pagina op `ocrDpi` en herkent deze. Elke pagina gaat door OCR, dus een digitale PDF met een perfect goede tekstlaag wordt alsnog opnieuw gelezen uit pixels. Dat houdt gescande en digitale documenten identiek in gedrag, ten koste van snelheid, dus beperk `ocrPageRange` bij lange bestanden.
- **`fileConvert`** herschrijft het bronbestand in een ander formaat en slaat het resultaat op als een **nieuw** Drive-bestand. Het origineel wordt nooit gewijzigd. Documenten gaan door pandoc, afbeeldingen door Pillow, en JSON naar CSV door de Python csv-writer. Een afbeelding kan geen document worden en een document kan geen afbeelding worden; gebruik `imageToText` om tekst uit een afbeelding te lezen.

## Het bestand binnenkrijgen

Bestandsconversies lezen uit Heym Drive, niet uit een pad of een URL, dus het bestand moet eerst opgeslagen zijn. Drie veelvoorkomende ketens:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — richt `converterFileId` op `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — haal een extern bestand op naar Drive en geef vervolgens `$Download.id` door.
- **[Agent](./agent-node.md) → Converter** — een skill die een bestand schrijft, stelt dit beschikbaar als `$reportAgent._generated_files[0].id`.

`converterFileId` accepteert ook een volledig bestandsobject (`$Upload.file`) of een Heym-download-URL; het bestands-id wordt uit beide gehaald. Het bestand moet van uzelf zijn of door een teamgenoot met u gedeeld zijn.
## Talen

`auto` (de standaard) voert eerst Tesseracts oriëntatie- en schriftdetectie uit en kiest vervolgens het beste geïnstalleerde model voor het gedetecteerde schrift. Schriftmodellen zoals `Latin` of `Cyrillic` lezen elke taal die in dat schrift wordt geschreven. Daarom verwerkt auto zowel een Turkse als een Engelse factuur zonder dat u hoeft aan te geven welke welke is.

Het benoemen van de taal is nog steeds nauwkeuriger wanneer u deze kent. Gebruik één code (`tur`), of voeg meerdere samen met `+` (`eng+tur`) voor gemengde documenten — meer talen betekent langzamere en iets ruisgevoeliger herkenning, dus houd de lijst kort. Codes werken alleen wanneer de bijbehorende taalgegevens op de backend zijn geïnstalleerd; de node toont wat beschikbaar is wanneer u een ontbrekende taal kiest.

Elke Heym-image wordt geleverd met `osd`, Engels, Turks, Duits, Frans, Spaans, Italiaans, Portugees, Nederlands, Russisch, Arabisch, Vereenvoudigd Chinees, Japans, Koreaans, en de schriftmodellen Latin, Cyrillic, Arabic, HanS, Japanese en Hangul.

## Codering

Herkende tekst is UTF-8 en behoudt elk teken dat Tesseract heeft geproduceerd. `ocrNormalizeUnicode` (standaard ingeschakeld) past NFC-normalisatie toe, zodat een letter geschreven als `s` plus een combineerende cedille één enkele `ş` wordt — het is raadzaam dit ingeschakeld te laten, omdat de twee vormen niet gelijk zijn in vergelijkingen of database-opzoekacties.

`ocrEncoding` is alleen van belang wanneer iets stroomafwaarts het volledige Unicode-bereik niet kan opslaan. Het kiezen van `cp1254` of `iso-8859-9` houdt Turkse tekst intact terwijl wordt gegarandeerd dat het resultaat in die tekenset past; `latin-1` en `ascii` zijn beperkter en vervangen wat zij niet kunnen weergeven door `?`. Laat dit op `utf-8` staan, tenzij een doelsysteem u daartoe dwingt.

## Uitvoer

`csvToJson`, `jsonToCsv`, `xmlToJson` en `jsonToXml` retourneren `$label.result` en `$label.conversion`. OCR-conversies voegen het volgende toe:

| Veld | Beschrijving |
|-------|-------------|
| `$label.result` | De volledig geëxtraheerde tekst, pagina's gescheiden door een lege regel |
| `$label.language` | Het model dat daadwerkelijk is uitgevoerd (nuttig om te zien wat `auto` heeft gekozen) |
| `$label.encoding` | De tekenset waarnaar de tekst is genormaliseerd |
| `$label.page_count` | Aantal herkende pagina's |
| `$label.pages` | Array van `{ page, text }` voor verwerking per pagina |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` van het bronbestand |

`fileConvert` retourneert in plaats daarvan het nieuwe bestand:

| Veld | Beschrijving |
|-------|-------------|
| `$label.id` | UUID van het nieuw opgeslagen bestand |
| `$label.filename` | Geconverteerde bestandsnaam, basisnaam behouden en extensie vervangen |
| `$label.mime_type` | MIME-type van het nieuwe bestand |
| `$label.size_bytes` | Grootte van het nieuwe bestand |
| `$label.download_url` | Drive-download-URL voor het nieuwe bestand |
| `$label.source_file` | Metadata van het bestand dat is geconverteerd |

## Voorbeeld

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

Voor invoer `name,age\nAda,36` benaderen stroomafwaartse nodes de geparseerde rijen via `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

XML naar JSON converteren:

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

Voor `<person id="1"><name>Ada</name></person>` is `$xmlToObject.result` gelijk aan `{ "person": { "@id": "1", "name": "Ada" } }`. Om XML te maken, geeft u dat object door aan een tweede Converter-node met `conversion: "jsonToXml"`.

Een gescande factuur lezen die is geüpload via een file upload trigger:

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

Een [Agent](./agent-node.md)- of [LLM](./llm-node.md)-node stroomafwaarts kan vervolgens gestructureerde velden uit `$readInvoice.result` halen.

Een markdown-rapport van een agent omzetten naar een PDF:

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

Stroomafwaartse nodes lezen `$convertDoc.download_url` om de PDF te delen, of `$convertDoc.id` om ermee verder te werken in [Drive](./drive-node.md).

## Vereisten

OCR maakt gebruik van `tesseract` en poppler's `pdftoppm`, en documentconversie gebruikt pandoc. Alle drie worden geleverd bij elke manier van het uitvoeren van Heym, inclusief `run.sh`, docker-compose en de single release image, dus er is niets te configureren. Paginalimieten, time-outs en de maximale DPI zijn vaste platformwaarden en geen instellingen.

## Gerelateerd

- [Set](./set-node.md) – Individuele velden transformeren en mappen
- [JSON output mapper](./json-output-mapper-node.md) – Een JSON-responsobject opbouwen
- [File upload trigger](./file-upload-trigger-node.md) – Een bestand accepteren in Heym Drive
- [Drive](./drive-node.md) – Bestanden opslaan, ophalen en delen
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Expression DSL](../reference/expression-dsl.md) – Functies en syntaxis
