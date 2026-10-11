# Converter

**Converter**-noden konverterer data og filer mellem formater uden at skrive kode. Den er teknologineutral, så flere formater kan tilføjes over tid. Den konverterer CSV-, JSON- og XML-data i begge retninger, kører Tesseract OCR for at udtrække tekst fra billeder og PDF'er, og omskriver en gemt fil i et andet format.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.result` (parsed data for `csvToJson` / `xmlToJson`, tekst for `jsonToCsv` / `jsonToXml`, udtrækket tekst for `imageToText` / `pdfToText`, ny filmetadata for `fileConvert`) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `conversion` | string | `csvToJson` (CSV-tekst → array af rækkeobjekter), `jsonToCsv` (array af objekter/rækker → CSV-tekst), `xmlToJson` (XML-tekst → objekt), `jsonToXml` (objekt → XML-tekst), `imageToText` (OCR et billede), `pdfToText` (OCR hver valgte PDF-side), eller `fileConvert` (omskriv en gemt fil i et andet format) |
| `source` | expression | Dataene, der skal konverteres. Lad være tom for at bruge nodens første input |
| `delimiter` | string | Enkelttegns-feltseparator (standard `,`) |
| `hasHeader` | boolean | Kun `csvToJson` — behandl den første række som header (standard `true`) |
| `trimValues` | boolean | Kun `csvToJson` — fjern whitespace omkring headernavne og celleværdier (standard `true`) |
| `includeHeader` | boolean | Kun `jsonToCsv` — skriv en header-række (standard `true`) |
| `converterColumns` | string | Kun `jsonToCsv` — valgfri kommasepareret kolonneorden |
| `converterFileId` | expression | Filkonverteringer — Heym Drive-filen, der skal læses, f.eks. `$Upload.file.id` |
| `converterTargetFormat` | string | Kun `fileConvert` — outputformat (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Kun OCR — `auto` (standard), en Tesseract-kode som `tur`, eller `custom` |
| `ocrLanguageCustom` | string | Kun OCR — sprogkoder brugt, når `ocrLanguage` er `custom`, f.eks. `eng+tur` |
| `ocrEncoding` | string | Kun OCR — tegnsæt, som teksten normaliseres til (standard `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Kun OCR — anvend NFC-normalisering (standard `true`) |
| `ocrPsm` | string | Kun OCR — Tesseract-side-segmenteringsmode (standard `3`) |
| `ocrDpi` | number | Kun `pdfToText` — side-rasteriserings-DPI (standard `300`) |
| `ocrPageRange` | expression | Kun `pdfToText` — `3` eller `2-5`. Tom betyder hver side |

## Adfærd

- **`csvToJson`** parser kilde-CSV-teksten. Med `hasHeader: true` bliver hver række til et objekt nøglet af headerværdierne; med `hasHeader: false` bliver hver række til et array af celleværdier. Citerede felter, indlejrede separatorer og indlejrede linjeskift håndteres efter RFC 4180. En ledende UTF-8 BOM (almindelig i Excel-eksporter) fjernes, og duplikerede headernavne gøres unikke uden at overskrive en reel kolonne (`a, a, a_2` → `a`, `a_3`, `a_2`). Sæt `delimiter` til `\t` for at parse tab-separerede værdier.
- **`trimValues`** (standard `true`) fjerner omgivende whitespace fra headernavne og celleværdier, **inklusive inden i citerede felter** (`" padded "` → `padded`). RFC 4180 behandler citeret whitespace som data, så sæt `trimValues: false` for at bevare det nøjagtigt.
- **`jsonToCsv`** bygger CSV-tekst fra et array af objekter (eller arrays). Kolonneorden tages fra `converterColumns`, når det er angivet, ellers udledes fra det første objekts nøgler. Værdier, der indeholder separatorer, citater eller linjeskift, citeres automatisk.
- **`xmlToJson`** parser XML til et objekt. Attributter bruger `@`-præfikser og tekst blandet med attributter bruger `#text`; gentagne søskendeelementer bliver til arrays. XML-entitetsudvidelse er deaktiveret.
- **`jsonToXml`** serialiserer et objekt til et XML-dokument. Objektet skal have præcis én topnøgle, som bliver XML-rodelementet. Brug samme `@attribute` og `#text`-konvention som `xmlToJson` for at producere attributter og tekst sammen med underordnede elementer.
- **`imageToText`** kører Tesseract over et enkelt billede (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteriserer hver valgte side ved `ocrDpi` og genkender den. Hver side gennemgår OCR, så en digital PDF med et perfekt tekstlag stadig genlæses fra pixels. Det sikrer, at scannede og digitale dokumenter opfører sig ens, på bekostning af hastighed, så indsnævr `ocrPageRange` på lange filer.
- **`fileConvert`** omskriver kildefilen i et andet format og gemmer resultatet som en **ny** Drive-fil. Den originale fil ændres aldrig. Dokumenter gennemgår pandoc, billeder gennem Pillow, og JSON til CSV gennem Python csv-writer. Et billede kan ikke blive til et dokument, og et dokument kan ikke blive til et billede; for at læse tekst ud af et billede skal `imageToText` bruges.

## Hvordan filen indlæses

Filkonverteringer læser fra Heym Drive, ikke fra en sti eller en URL, så filen skal gemmes først. Tre almindelige kæder:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — pej `converterFileId` på `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — hent en fjernfil ind i Drive, og send derefter `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — en færdighed, der skriver en fil, eksponerer den som `$reportAgent._generated_files[0].id`.

`converterFileId` accepterer også et helt filobjekt (`$Upload.file`) eller en Heym-download-URL; fil-id'et udtrækkes fra begge. Filen skal være ejet af brugeren eller delt af en kollega.
## Sprog

`auto` (standardindstillingen) kører først Tesseracts orienterings- og skriftdetektion og vælger derefter den bedst egnede installerede model for det detekterede skrift. Skriftmodeller som `Latin` eller `Cyrillic` kan læse alle sprog, der er skrevet i det pågældende skrift, hvilket er grunden til, at `auto` kan håndtere en tyrkisk faktura og en engelsk uden at vide, hvilken der er hvilken.

Det er stadig mere præcist at angive sproget, når det er kendt. Brug en enkelt kode (`tur`), eller kombiner flere med `+` (`eng+tur`) for blandede dokumenter – flere sprog betyder langsommere og lidt mere støjende genkendelse, så hold listen kort. Koder virker kun, når de matchende sprogdata er installeret på backend; noden viser, hvad der er tilgængeligt, når der vælges en manglende kode.

Hver Heym-billede leveres med `osd`, engelsk, tyrkisk, tysk, fransk, spansk, italiensk, portugisisk, hollandsk, russisk, arabisk, forenklet kinesisk, japansk, koreansk samt Latin-, Cyrillic-, Arabic-, HanS-, Japanese- og Hangul-skriftmodeller.

## Kodning

Genkendt tekst er UTF-8 og bevarer alle tegn, som Tesseract har produceret. `ocrNormalizeUnicode` (standardindstilling) anvender NFC-normalisering, så et bogstav skrevet som `s` plus en kombinerende cedilla bliver til et enkelt `ş` – værd at beholde, da de to former ikke er ens i sammenligninger eller databasesøgninger.

`ocrEncoding` er kun relevant, hvis noget downstream ikke kan lagre hele Unicode-området. Valg af `cp1254` eller `iso-8859-9` bevarer tyrkisk tekst intakt, mens det garanterer, at resultatet passer til den pågældende tegnsæt; `latin-1` og `ascii` er smallere og erstatter det, de ikke kan repræsentere, med `?`. Lad det være `utf-8`, medmindre et målsystem tvinger til andet.

## Output

`csvToJson`, `jsonToCsv`, `xmlToJson` og `jsonToXml` returnerer `$label.result` og `$label.conversion`. OCR-konverteringer tilføjer:

| Felt | Beskrivelse |
|-------|-------------|
| `$label.result` | Den fulde ekstraherede tekst, sider forbundet med en tom linje |
| `$label.language` | Modellen, der faktisk kørte (nyttigt at se, hvad `auto` valgte) |
| `$label.encoding` | Tegnsættet, som teksten blev normaliseret til |
| `$label.page_count` | Antal genkendte sider |
| `$label.pages` | Array af `{ page, text }` til sidehåndtering |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` af kildefilen |

`fileConvert` returnerer den nye fil i stedet:

| Felt | Beskrivelse |
|-------|-------------|
| `$label.id` | UUID for den nyoplagrede fil |
| `$label.filename` | Konverteret filnavn, basisnavn beholdt og filtype udskiftet |
| `$label.mime_type` | MIME-type for den nye fil |
| `$label.size_bytes` | Størrelse på den nye fil |
| `$label.download_url` | Drive-download-URL for den nye fil |
| `$label.source_file` | Metadata for filen, der blev konverteret |

## Eksempel

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

For input `name,age\nAda,36` kan downstream-noder få adgang til de parsed rækker via `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Konvertering af XML til JSON:

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

For `<person id="1"><name>Ada</name></person>` er `$xmlToObject.result` `{ "person": { "@id": "1", "name": "Ada" } }`. For at oprette XML kan objektet sendes til en anden Converter-node med `conversion: "jsonToXml"`.

Læsning af en scannet faktura uploadet via en file upload trigger:

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

En [Agent](./agent-node.md) eller [LLM](./llm-node.md)-node downstream kan derefter udtrække struktureret data fra `$readInvoice.result`.

Konvertering af en agents markdown-rapport til PDF:

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

Downstream-noder kan læse `$convertDoc.download_url` for at dele PDF'en eller `$convertDoc.id` for at fortsætte arbejdet med den i [Drive](./drive-node.md).

## Krav

OCR bruger `tesseract` og popplers `pdftoppm`, og dokumentkonvertering bruger pandoc. Alle tre leveres med enhver måde at køre Heym på, inklusive `run.sh`, docker-compose og den enkelte release-image, så der er intet at konfigurere. Sidegrænser, timeout og maksimal DPI er faste platformværdier snarere end indstillinger.

## Relateret

- [Set](./set-node.md) – Transformér og map individuelle felter
- [JSON output mapper](./json-output-mapper-node.md) – Byg et JSON-svarobjekt
- [File upload trigger](./file-upload-trigger-node.md) – Accepter en fil i Heym Drive
- [Drive](./drive-node.md) – Gem, hent og del filer
- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Expression DSL](../reference/expression-dsl.md) – Funktioner og syntaks
