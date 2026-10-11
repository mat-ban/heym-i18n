# Converter

Noden **Converter** konverterar data och filer mellan format utan att kod behöver skrivas. Den är teknikneutral, vilket gör att fler format kan läggas till över tid. Den konverterar CSV-, JSON- och XML-data i båda riktningarna, kör Tesseract OCR för att extrahera text ur bilder och PDF-filer samt skriver om en lagrad fil i ett annat format.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.result` (parsad data för `csvToJson` / `xmlToJson`, text för `jsonToCsv` / `jsonToXml`, extraherad text för `imageToText` / `pdfToText`, ny filmetadata för `fileConvert`) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `conversion` | string | `csvToJson` (CSV-text → array av radobjekt), `jsonToCsv` (array av objekt/rader → CSV-text), `xmlToJson` (XML-text → objekt), `jsonToXml` (objekt → XML-text), `imageToText` (OCR på en bild), `pdfToText` (OCR på varje vald PDF-sida) eller `fileConvert` (skriv om en lagrad fil i ett annat format) |
| `source` | expression | Data som ska konverteras. Lämna tomt för att använda nodens första indata |
| `delimiter` | string | Fältavgränsare med ett tecken (standard `,`) |
| `hasHeader` | boolean | Endast `csvToJson` — behandla första raden som rubrik (standard `true`) |
| `trimValues` | boolean | Endast `csvToJson` — ta bort blanksteg runt rubriknamn och cellvärden (standard `true`) |
| `includeHeader` | boolean | Endast `jsonToCsv` — skriv en rubrikrad (standard `true`) |
| `converterColumns` | string | Endast `jsonToCsv` — valfri kommaseparerad kolumnordning |
| `converterFileId` | expression | Filkonverteringar — Heym Drive-filen som ska läsas, t.ex. `$Upload.file.id` |
| `converterTargetFormat` | string | Endast `fileConvert` — utdataformat (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Endast OCR — `auto` (standard), en Tesseract-kod som `tur` eller `custom` |
| `ocrLanguageCustom` | string | Endast OCR — språkkoder som används när `ocrLanguage` är `custom`, t.ex. `eng+tur` |
| `ocrEncoding` | string | Endast OCR — teckenuppsättning som texten normaliseras till (standard `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Endast OCR — tillämpa NFC-normalisering (standard `true`) |
| `ocrPsm` | string | Endast OCR — Tesseracts sidsegmenteringsläge (standard `3`) |
| `ocrDpi` | number | Endast `pdfToText` — DPI för rasterisering av sidor (standard `300`) |
| `ocrPageRange` | expression | Endast `pdfToText` — `3` eller `2-5`. Tomt innebär varje sida |

## Beteende

- **`csvToJson`** parsar källans CSV-text. Med `hasHeader: true` blir varje rad ett objekt med nycklar från rubrikvärdena; med `hasHeader: false` blir varje rad en array av cellvärden. Citerade fält, inbäddade avgränsare och inbäddade radbrytningar hanteras enligt RFC 4180. En inledande UTF-8-BOM (vanlig i Excel-exporter) tas bort, och dubblerade rubriknamn görs unika utan att skriva över en verklig kolumn (`a, a, a_2` → `a`, `a_3`, `a_2`). Ange `delimiter` som `\t` för att parsa tabbseparerade värden.
- **`trimValues`** (standard `true`) tar bort omgivande blanksteg från rubriknamn och cellvärden, **även inuti citerade fält** (`" padded "` → `padded`). RFC 4180 behandlar citerat blanksteg som data, så ange `trimValues: false` för att bevara det exakt.
- **`jsonToCsv`** bygger CSV-text från en array av objekt (eller arrayer). Kolumnordningen tas från `converterColumns` när det anges, annars härleds den från det första objektets nycklar. Värden som innehåller avgränsaren, citattecken eller radbrytningar citeras automatiskt.
- **`xmlToJson`** parsar XML till ett objekt. Attribut använder prefixet `@` och text blandad med attribut använder `#text`; upprepade syskonelement blir arrayer. Expansion av XML-entiteter är inaktiverad.
- **`jsonToXml`** serialiserar ett objekt till ett XML-dokument. Objektet måste ha exakt en nyckel på översta nivån, vilken blir XML-rotelementet. Använd samma konvention med `@attribute` och `#text` som i `xmlToJson` för att producera attribut och text vid sidan av underordnade element.
- **`imageToText`** kör Tesseract på en enskild bild (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteriserar varje vald sida vid `ocrDpi` och känner igen den. Varje sida går genom OCR, så en digital PDF med ett fullt fungerande textlager läses ändå om från pixlar. Det gör att skannade och digitala dokument beter sig identiskt, till priset av hastighet, så begränsa `ocrPageRange` för långa filer.
- **`fileConvert`** skriver om källfilen i ett annat format och lagrar resultatet som en **ny** Drive-fil. Originalet ändras aldrig. Dokument går genom pandoc, bilder genom Pillow och JSON till CSV genom Pythons csv-skrivare. En bild kan inte bli ett dokument och ett dokument kan inte bli en bild; för att läsa text ur en bild används `imageToText`.

## Få in filen

Filkonverteringar läser från Heym Drive, inte från en sökväg eller en URL, så filen måste lagras först. Tre vanliga kedjor:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — peka `converterFileId` mot `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — hämta en fjärrfil till Drive och skicka sedan `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — en skill som skriver en fil exponerar den som `$reportAgent._generated_files[0].id`.

`converterFileId` accepterar även ett helt filobjekt (`$Upload.file`) eller en Heym-nedladdnings-URL; fil-id:t plockas ut ur endera. Filen måste vara en som användaren äger eller en som en teammedlem har delat med användaren.
## Språk

`auto` (standard) kör först Tesseracts orienterings- och skriptigenkänning och väljer sedan den bästa installerade modellen för det identifierade skriptet. Skriptmodeller som `Latin` eller `Cyrillic` läser alla språk som skrivs med det skriptet, vilket är anledningen till att auto hanterar en turkisk faktura och en engelsk utan att behöva veta vilken som är vilken.

Att ange språket är fortfarande mer exakt när man känner till det. Använd en enskild kod (`tur`), eller kombinera flera med `+` (`eng+tur`) för blandade dokument — fler språk innebär långsammare och något brusigare igenkänning, så håll listan kort. Koder fungerar endast när motsvarande språkdata är installerad på backend; noden listar vad som är tillgängligt när en saknad kod anges.

Varje Heym-avbildning levereras med `osd`, engelska, turkiska, tyska, franska, spanska, italienska, portugisiska, nederländska, ryska, arabiska, förenklad kinesiska, japanska, koreanska samt skriptmodellerna Latin, Cyrillic, Arabic, HanS, Japanese och Hangul.

## Kodning

Igenkänd text är UTF-8 och bevarar varje tecken som Tesseract producerade. `ocrNormalizeUnicode` (på som standard) tillämpar NFC-normalisering, så en bokstav skriven som `s` plus en kombinerande cedilj blir ett enda `ş` — värt att lämna på, eftersom de två formerna inte är lika i jämförelser eller databasuppslagningar.

`ocrEncoding` har endast betydelse när något nedströms inte kan lagra hela Unicode-intervallet. Att välja `cp1254` eller `iso-8859-9` håller turkisk text intakt samtidigt som resultatet garanterat passar den teckenuppsättningen; `latin-1` och `ascii` är snävare och ersätter det de inte kan representera med `?`. Lämna det på `utf-8` om inte ett målsystem tvingar fram något annat.

## Utdata

`csvToJson`, `jsonToCsv`, `xmlToJson` och `jsonToXml` returnerar `$label.result` och `$label.conversion`. OCR-konverteringar lägger till:

| Fält | Beskrivning |
|-------|-------------|
| `$label.result` | Den fullständiga extraherade texten, sidor sammanfogade med en tom rad |
| `$label.language` | Modellen som faktiskt kördes (användbart för att se vad `auto` valde) |
| `$label.encoding` | Teckenuppsättningen som texten normaliserades till |
| `$label.page_count` | Antal igenkända sidor |
| `$label.pages` | Array av `{ page, text }` för hantering per sida |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` för källfilen |

`fileConvert` returnerar i stället den nya filen:

| Fält | Beskrivning |
|-------|-------------|
| `$label.id` | UUID för den nyligen lagrade filen |
| `$label.filename` | Konverterat filnamn, basnamnet behålls och filändelsen byts ut |
| `$label.mime_type` | MIME-typ för den nya filen |
| `$label.size_bytes` | Storlek på den nya filen |
| `$label.download_url` | Drive-nedladdnings-URL för den nya filen |
| `$label.source_file` | Metadata för filen som konverterades |

## Exempel

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

För indata `name,age\nAda,36` kommer nedströms noder åt de tolkade raderna via `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Konvertering av XML till JSON:

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

För `<person id="1"><name>Ada</name></person>` är `$xmlToObject.result` lika med `{ "person": { "@id": "1", "name": "Ada" } }`. För att skapa XML skickas objektet till en andra Converter-nod med `conversion: "jsonToXml"`.

Läsning av en skannad faktura som laddats upp via en file upload-trigger:

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

En [Agent](./agent-node.md)- eller [LLM](./llm-node.md)-nod nedströms kan sedan hämta strukturerade fält ur `$readInvoice.result`.

Omvandling av en agents markdown-rapport till en PDF:

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

Nedströms noder läser `$convertDoc.download_url` för att dela PDF:en, eller `$convertDoc.id` för att fortsätta arbeta med den i [Drive](./drive-node.md).

## Krav

OCR anropar `tesseract` och popplers `pdftoppm` via skalet, och dokumentkonvertering använder pandoc. Alla tre levereras med varje sätt att köra Heym, inklusive `run.sh`, docker-compose och den enskilda release-avbildningen, så det finns inget att konfigurera. Sidgränser, timeouts och maximal DPI är fasta plattformsvärden snarare än inställningar.

## Relaterat

- [Set](./set-node.md) – Transformera och mappa enskilda fält
- [JSON output mapper](./json-output-mapper-node.md) – Bygg ett JSON-svarsobjekt
- [File upload trigger](./file-upload-trigger-node.md) – Ta emot en fil i Heym Drive
- [Drive](./drive-node.md) – Lagra, hämta och dela filer
- [Node Types](../reference/node-types.md) – Översikt över alla nodtyper
- [Expression DSL](../reference/expression-dsl.md) – Funktioner och syntax
