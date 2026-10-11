# Converter

**Converter** node teisendab andmeid ja faile formaatide vahel ilma koodi kirjutamata. See on tehnoloogianeutraalne, seega saab aja jooksul lisada rohkem formaate. See teisendab CSV, JSON ja XML andmeid mõlemas suunas, käivitab Tesseract OCR-i, et tõmmata tekst välja piltidelt ja PDF-idest, ning kirjutab salvestatud faili ümber teises formaadis.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.result` (parsed data for `csvToJson` / `xmlToJson`, text for `jsonToCsv` / `jsonToXml`, extracted text for `imageToText` / `pdfToText`, new file metadata for `fileConvert`) |

## Parameetrid

| Parameter | Type | Description |
|-----------|------|-------------|
| `label` | string | Node identifier (camelCase) |
| `conversion` | string | `csvToJson` (CSV text → array of row objects), `jsonToCsv` (array of objects/rows → CSV text), `xmlToJson` (XML text → object), `jsonToXml` (object → XML text), `imageToText` (OCR an image), `pdfToText` (OCR every selected PDF page), or `fileConvert` (rewrite a stored file in another format) |
| `source` | expression | The data to convert. Leave empty to use the node's first input |
| `delimiter` | string | Single-character field separator (default `,`) |
| `hasHeader` | boolean | `csvToJson` only — treat the first row as the header (default `true`) |
| `trimValues` | boolean | `csvToJson` only — strip whitespace around header names and cell values (default `true`) |
| `includeHeader` | boolean | `jsonToCsv` only — write a header row (default `true`) |
| `converterColumns` | string | `jsonToCsv` only — optional comma-separated column order |
| `converterFileId` | expression | File conversions — the Heym Drive file to read, e.g. `$Upload.file.id` |
| `converterTargetFormat` | string | `fileConvert` only — output format (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | OCR only — `auto` (default), a Tesseract code such as `tur`, or `custom` |
| `ocrLanguageCustom` | string | OCR only — language codes used when `ocrLanguage` is `custom`, e.g. `eng+tur` |
| `ocrEncoding` | string | OCR only — charset the text is normalized to (default `utf-8`) |
| `ocrNormalizeUnicode` | boolean | OCR only — apply NFC normalization (default `true`) |
| `ocrPsm` | string | OCR only — Tesseract page segmentation mode (default `3`) |
| `ocrDpi` | number | `pdfToText` only — page rasterization DPI (default `300`) |
| `ocrPageRange` | expression | `pdfToText` only — `3` or `2-5`. Empty means every page |

## Käitumine

- **`csvToJson`** parsib lähteteksti CSV. Kui `hasHeader: true`, muutub iga rida objektiks, mille võtmeteks on päiseväärtused; kui `hasHeader: false`, muutub iga rida lahtriväärtuste massiiviks. Jutumärkides väljad, manustatud eraldajad ja manustatud reavahetused töödeldakse vastavalt RFC 4180-le. Alguses olev UTF-8 BOM (tavaline Exceli eksportides) eemaldatakse ning duplikaatsed päisenimed muudetakse unikaalseks, kirjutamata üle tegelikku veergu (`a, a, a_2` → `a`, `a_3`, `a_2`). Tab-eraldusega väärtuste parsimiseks määrake `delimiter` väärtuseks `\t`.
- **`trimValues`** (vaikeväärtus `true`) eemaldab ümbritseva tühiku päisenimedelt ja lahtriväärtustelt, **sealhulgas jutumärkides väljade seest** (`" padded "` → `padded`). RFC 4180 käsitleb jutumärkides tühikut andmetena, seega selle täpselt säilitamiseks määrake `trimValues: false`.
- **`jsonToCsv`** koostab CSV-teksti objektide (või massiivide) massiivist. Veergude järjekord võetakse `converterColumns`-ist, kui see on antud, vastasel juhul tuletatakse esimese objekti võtmetest. Väärtused, mis sisaldavad eraldajat, jutumärke või reavahetusi, tsiteeritakse automaatselt.
- **`xmlToJson`** parsib XML-i objektiks. Atribuudid kasutavad `@` eesliiteid ja atribuutidega segatud tekst kasutab `#text`; korduvad sõsarelemendid muutuvad massiivideks. XML-olemite laiendamine on keelatud.
- **`jsonToXml`** serialiseerib objekti XML-dokumendiks. Objektil peab olema täpselt üks ülataseme võti, millest saab XML-i juurelement. Kasutage sama `@attribute` ja `#text` konventsiooni nagu `xmlToJson`-is, et luua atribuute ja teksti koos alamelementidega.
- **`imageToText`** käivitab Tesseracti üksiku pildi (PNG, JPEG, TIFF, WebP, BMP) peal.
- **`pdfToText`** rasteriseerib iga valitud lehekülje `ocrDpi` juures ja teeb sellele OCR-i. Iga lehekülg läbib OCR-i, seega digitaalne PDF, millel on täiesti korralik tekstikiht, loetakse ikkagi pikslitest uuesti. See hoiab skaneeritud ja digitaalsed dokumendid ühtlaselt käituvana, kiiruse hinnaga, seega kitsendage `ocrPageRange`-i pikkade failide puhul.
- **`fileConvert`** kirjutab lähtefaili ümber teises formaadis ja salvestab tulemuse **uue** Drive-failina. Originaali ei muudeta kunagi. Dokumendid läbivad pandoc-i, pildid Pillow, ja JSON CSV-ks Pythoni csv-kirjutaja. Pilt ei saa muutuda dokumendiks ja dokument ei saa muutuda pildiks; tekstist pildilt välja lugemiseks kasutage `imageToText`.

## Faili sisseviimine

Faili teisendused loevad Heym Drive-ist, mitte teelt ega URL-ilt, seega fail tuleb esmalt salvestada. Kolm levinud ahelat:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — suunake `converterFileId` väärtusele `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — tooge kaugfail Drive-i, seejärel edastage `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — oskus, mis kirjutab faili, avaldab selle kujul `$reportAgent._generated_files[0].id`.

`converterFileId` võtab vastu ka terve failiobjekti (`$Upload.file`) või Heym allalaadimise URL-i; faili id tõmmatakse mõlemast välja. Fail peab olema teie oma või selline, mille meeskonnakaaslane on teiega jaganud.
## Keeled

`auto` (vaikeväärtus) käivitab esmalt Tesseracti orientatsiooni- ja kirjasüsteemi tuvastuse ning valib seejärel tuvastatud kirjasüsteemi jaoks parima installitud mudeli. Kirjasüsteemi mudelid nagu `Latin` või `Cyrillic` loevad iga keelt, mida selles kirjasüsteemis kirjutatakse — seetõttu tuleb auto-toiming toime nii türgi kui ka inglise arvega, ilma et peaks ütlema, kumb kumb on.

Keele nimetamine on siiski täpsem, kui see on teada. Kasutage üksikut koodi (`tur`) või ühendage mitu koodi märgiga `+` (`eng+tur`) segadokumentide jaoks — rohkem keeli tähendab aeglasemat ja veidi mürasemat tuvastust, seega hoidke nimekiri lühike. Koodid töötavad ainult siis, kui vastav keeleandmestik on backend'is installitud; kui valite puuduva keele, loetleb sõlm saadaolevad valikud.

Iga Heymi image sisaldab `osd`-d, inglise, türgi, saksa, prantsuse, hispaania, itaalia, portugali, hollandi, vene, araabia, lihtsustatud hiina, jaapani, korea keelt ning ladina, kirillitsa, araabia, HanS, jaapani ja hanguli kirjasüsteemi mudeleid.

## Kodeering

Tuvastatud tekst on UTF-8 ja säilitab iga märgi, mille Tesseract tekitas. `ocrNormalizeUnicode` (vaikimisi sees) rakendab NFC-normaliseerimist, seega täht, mis on kirjutatud kujul `s` pluss ühendav sedilj, muutub üksikuks `ş`-ks — seda tasub sees hoida, sest need kaks vormi ei ole võrdlustes ega andmebaasipäringutes võrdsed.

`ocrEncoding` on oluline ainult siis, kui midagi allavoolu ei suuda kogu Unicode'i vahemikku salvestada. Valik `cp1254` või `iso-8859-9` hoiab türgi teksti puutumatuna, tagades samal ajal, et tulemus mahub sellesse märgistikku; `latin-1` ja `ascii` on kitsamad ja asendavad selle, mida nad esitada ei suuda, märgiga `?`. Jätke see väärtusele `utf-8`, välja arvatud juhul, kui sihtsüsteem sunnib teid muud valima.

## Väljund

`csvToJson`, `jsonToCsv`, `xmlToJson` ja `jsonToXml` tagastavad `$label.result` ja `$label.conversion`. OCR-i konversioonid lisavad:

| Väli | Kirjeldus |
|-------|-------------|
| `$label.result` | Kogu eraldatud tekst, lehed on ühendatud tühja reaga |
| `$label.language` | Mudel, mis tegelikult töötas (kasulik nägemaks, mille `auto` valis) |
| `$label.encoding` | Märgistik, millesse tekst normaliseeriti |
| `$label.page_count` | Tuvastatud lehtede arv |
| `$label.pages` | Massiiv kujul `{ page, text }` lehekaupa töötlemiseks |
| `$label.file` | Lähtefaili `{ id, filename, mime_type, size_bytes }` |

`fileConvert` tagastab selle asemel uue faili:

| Väli | Kirjeldus |
|-------|-------------|
| `$label.id` | Äsja salvestatud faili UUID |
| `$label.filename` | Konverteeritud failinimi, baasnimi säilitatud ja laiend vahetatud |
| `$label.mime_type` | Uue faili MIME-tüüp |
| `$label.size_bytes` | Uue faili suurus |
| `$label.download_url` | Drive'i allalaadimise URL uue faili jaoks |
| `$label.source_file` | Konverteeritud faili metaandmed |

## Näide

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

Sisendi `name,age\nAda,36` korral pääsevad allavoolu sõlmed parsitud ridadele ligi avaldise `$toRows.result` kaudu (`[{ "name": "Ada", "age": "36" }]`).

XML-i konverteerimine JSON-iks:

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

Sisendi `<person id="1"><name>Ada</name></person>` korral on `$xmlToObject.result` väärtus `{ "person": { "@id": "1", "name": "Ada" } }`. XML-i loomiseks edastage see objekt teisele Converter-sõlmele väärtusega `conversion: "jsonToXml"`.

Skaneeritud arve lugemine, mis on üles laaditud file upload triggeri kaudu:

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

Seejärele saab allavoolu asuv [Agent](./agent-node.md) või [LLM](./llm-node.md) sõlm eraldada `$readInvoice.result` seest struktureeritud väljad.

Agendi markdown-aruande muutmine PDF-iks:

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

Allavoolu sõlmed loevad `$convertDoc.download_url`, et PDF-i jagada, või `$convertDoc.id`, et sellega [Drive'is](./drive-node.md) edasi töötada.

## Nõuded

OCR kasutab välist käsku `tesseract` ja poppleri `pdftoppm`, dokumentide konverteerimine kasutab pandocit. Kõik kolm tulevad kaasa iga Heymi käitamisviisiga, sealhulgas `run.sh`, docker-compose ja üksiku release image'iga, seega pole midagi konfigureerida. Lehepiirangud, timeout'id ja maksimaalne DPI on fikseeritud platvormi väärtused, mitte seadistused.

## Seotud

- [Set](./set-node.md) – Üksikute väljade teisendamine ja kaardistamine
- [JSON output mapper](./json-output-mapper-node.md) – JSON-vastuseobjekti loomine
- [File upload trigger](./file-upload-trigger-node.md) – Faili vastuvõtmine Heym Drive'i
- [Drive](./drive-node.md) – Failide salvestamine, toomine ja jagamine
- [Node Types](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Expression DSL](../reference/expression-dsl.md) – Funktsioonid ja süntaks
