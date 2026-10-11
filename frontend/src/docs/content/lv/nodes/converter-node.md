# Converter

**Converter** mezgls pārveido datus un failus starp formātiem, neprasot koda rakstīšanu. Tas ir tehnoloģiski neitrāls, tāpēc laika gaitā var tikt pievienoti arvien jauni formāti. Tas pārveido CSV, JSON un XML datus abos virzienos, palaiž Tesseract OCR, lai izgūtu tekstu no attēliem un PDF failiem, un pārraksta saglabāto failu citā formātā.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.result` (parsēti dati `csvToJson` / `xmlToJson` gadījumā, teksts `jsonToCsv` / `jsonToXml` gadījumā, izgūts teksts `imageToText` / `pdfToText` gadījumā, jauna faila metadati `fileConvert` gadījumā) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `conversion` | string | `csvToJson` (CSV teksts → rindu objektu masīvs), `jsonToCsv` (objektu/rindu masīvs → CSV teksts), `xmlToJson` (XML teksts → objekts), `jsonToXml` (objekts → XML teksts), `imageToText` (attēla OCR), `pdfToText` (katras atlasītās PDF lapas OCR) vai `fileConvert` (saglabāta faila pārrakstīšana citā formātā) |
| `source` | expression | Pārveidojamie dati. Atstājiet tukšu, lai izmantotu mezgla pirmo ievadi |
| `delimiter` | string | Vienas rakstzīmes lauku atdalītājs (pēc noklusējuma `,`) |
| `hasHeader` | boolean | Tikai `csvToJson` — uzskatīt pirmo rindu par galveni (pēc noklusējuma `true`) |
| `trimValues` | boolean | Tikai `csvToJson` — noņemt atstarpes ap galveņu nosaukumiem un šūnu vērtībām (pēc noklusējuma `true`) |
| `includeHeader` | boolean | Tikai `jsonToCsv` — ierakstīt galvenes rindu (pēc noklusējuma `true`) |
| `converterColumns` | string | Tikai `jsonToCsv` — neobligāta ar komatu atdalīta kolonnu secība |
| `converterFileId` | expression | Failu konvertēšana — lasāmais Heym Drive fails, piem., `$Upload.file.id` |
| `converterTargetFormat` | string | Tikai `fileConvert` — izvades formāts (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Tikai OCR — `auto` (pēc noklusējuma), Tesseract kods, piemēram, `tur`, vai `custom` |
| `ocrLanguageCustom` | string | Tikai OCR — valodu kodi, kas tiek izmantoti, ja `ocrLanguage` ir `custom`, piem., `eng+tur` |
| `ocrEncoding` | string | Tikai OCR — rakstzīmju kopa, uz kuru teksts tiek normalizēts (pēc noklusējuma `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Tikai OCR — piemērot NFC normalizāciju (pēc noklusējuma `true`) |
| `ocrPsm` | string | Tikai OCR — Tesseract lapas segmentācijas režīms (pēc noklusējuma `3`) |
| `ocrDpi` | number | Tikai `pdfToText` — lapas rasterizācijas DPI (pēc noklusējuma `300`) |
| `ocrPageRange` | expression | Tikai `pdfToText` — `3` vai `2-5`. Tukšs nozīmē visas lapas |

## Darbība

- **`csvToJson`** parsē avota CSV tekstu. Ar `hasHeader: true` katra rinda kļūst par objektu, kura atslēgas ir galvenes vērtības; ar `hasHeader: false` katra rinda kļūst par šūnu vērtību masīvu. Pēdiņās iekļauti lauki, iegultie atdalītāji un iegultās jaunās rindas tiek apstrādātas saskaņā ar RFC 4180. Sākumā esošais UTF-8 BOM (bieži sastopams Excel eksportos) tiek noņemts, un dublējošie galveņu nosaukumi tiek padarīti unikāli, nepārrakstot īstu kolonnu (`a, a, a_2` → `a`, `a_3`, `a_2`). Iestatiet `delimiter` uz `\t`, lai parsētu ar tabulatoru atdalītas vērtības.
- **`trimValues`** (pēc noklusējuma `true`) noņem apkārtējās atstarpes no galveņu nosaukumiem un šūnu vērtībām, **tostarp pēdiņās iekļautos laukos** (`" padded "` → `padded`). RFC 4180 uzskata pēdiņās iekļautās atstarpes par datiem, tāpēc iestatiet `trimValues: false`, lai tās saglabātu precīzi.
- **`jsonToCsv`** veido CSV tekstu no objektu (vai masīvu) masīva. Kolonnu secība tiek ņemta no `converterColumns`, ja tā ir norādīta, pretējā gadījumā tā tiek secināta no pirmā objekta atslēgām. Vērtības, kas satur atdalītāju, pēdiņas vai jaunās rindas, tiek automātiski iekļautas pēdiņās.
- **`xmlToJson`** parsē XML objektā. Atribūti izmanto `@` prefiksus, un teksts, kas sajaukts ar atribūtiem, izmanto `#text`; atkārtoti blakus esošie elementi kļūst par masīviem. XML entītiju paplašināšana ir atspējota.
- **`jsonToXml`** serializē objektu XML dokumentā. Objektam ir jābūt tieši vienai augšējā līmeņa atslēgai, kas kļūst par XML saknes elementu. Izmantojiet to pašu `@attribute` un `#text` konvenciju kā `xmlToJson`, lai kopā ar pakārtotajiem elementiem izveidotu atribūtus un tekstu.
- **`imageToText`** palaiž Tesseract uz vienu attēlu (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizē katru atlasīto lapu ar `ocrDpi` un atpazīst to. Katra lapa tiek pakļauta OCR, tāpēc digitāls PDF ar pilnīgi labu teksta slāni joprojām tiek nolasīts no pikseļiem. Tas nodrošina, ka skenēti un digitāli dokumenti darbojas identiski, uz ātruma rēķina, tāpēc garos failos sašauriniet `ocrPageRange`.
- **`fileConvert`** pārraksta avota failu citā formātā un saglabā rezultātu kā **jaunu** Drive failu. Oriģināls nekad netiek modificēts. Dokumenti tiek apstrādāti ar pandoc, attēli ar Pillow, un JSON uz CSV ar Python csv rakstītāju. Attēls nevar kļūt par dokumentu, un dokuments nevar kļūt par attēlu; lai nolasītu tekstu no attēla, izmantojiet `imageToText`.

## Faila iegūšana

Failu konvertēšana lasa no Heym Drive, nevis no ceļa vai URL, tāpēc fails vispirms ir jāsaglabā. Trīs izplatītas ķēdes:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — norādiet `converterFileId` uz `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — ielādējiet attālinātu failu Drive un pēc tam nododiet `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — prasme, kas ieraksta failu, to pakļauj kā `$reportAgent._generated_files[0].id`.

`converterFileId` pieņem arī visu faila objektu (`$Upload.file`) vai Heym lejupielādes URL; faila id tiek izgūts no jebkura no tiem. Failam ir jābūt tādam, kas pieder Jums, vai tādam, ko komandas biedrs ar Jums kopīgoja.
## Valodas

`auto` (noklusējuma vērtība) vispirms palaiž Tesseract orientācijas un rakstības noteikšanu, pēc tam izvēlas labāko instalēto modeli konstatētajai rakstībai. Rakstības modeļi, piemēram, `Latin` vai `Cyrillic`, nolasa visas valodas, kas rakstītas attiecīgajā rakstībā, tāpēc auto apstrādā gan turku rēķinu, gan angļu rēķinu, bez nepieciešamības norādīt, kurš ir kurš.

Valodas norādīšana joprojām ir precīzāka, ja tā ir zināma. Izmantojiet vienu kodu (`tur`) vai savienojiet vairākus ar `+` (`eng+tur`) jauktiem dokumentiem — vairāk valodu nozīmē lēnāku un nedaudz trokšņaināku atpazīšanu, tāpēc saglabājiet sarakstu īsu. Kodi darbojas tikai tad, ja atbilstošie valodas dati ir instalēti backend vidē; mezgls parāda pieejamos, kad izvēlaties trūkstošu.

Katrā Heym attēlā ir iekļauts `osd`, angļu, turku, vācu, franču, spāņu, itāļu, portugāļu, holandiešu, krievu, arābu, vienkāršotās ķīniešu, japāņu, korejiešu, kā arī Latin, Cyrillic, Arabic, HanS, Japanese un Hangul rakstības modeļi.

## Kodējums

Atpazītais teksts ir UTF-8 un saglabā katru rakstzīmi, ko Tesseract ir radījis. `ocrNormalizeUnicode` (pēc noklusējuma ieslēgts) piemēro NFC normalizāciju, tāpēc burts, kas rakstīts kā `s` plus apvienojošā cedilla, kļūst par vienu `ş` — to ir vērts atstāt ieslēgtu, jo abas formas nav vienādas salīdzinājumos vai datubāzes vaicājumos.

`ocrEncoding` ir svarīgs tikai tad, ja kaut kas lejup pa plūsmu nevar saglabāt pilnu Unicode diapazonu. Izvēloties `cp1254` vai `iso-8859-9`, turku teksts tiek saglabāts neskarts, vienlaikus garantējot, ka rezultāts atbilst šim rakstzīmju kopumam; `latin-1` un `ascii` ir šaurāki un aizstāj to, ko nevar attēlot, ar `?`. Atstājiet `utf-8`, ja vien mērķa sistēma neuzspiež citādi.

## Izvade

`csvToJson`, `jsonToCsv`, `xmlToJson` un `jsonToXml` atgriež `$label.result` un `$label.conversion`. OCR konversijas pievieno:

| Lauks | Apraksts |
|-------|-------------|
| `$label.result` | Pilns izvilktais teksts, lapas savienotas ar tukšu rindu |
| `$label.language` | Modelis, kas faktiski tika palaists (noderīgi, lai redzētu, ko `auto` izvēlējās) |
| `$label.encoding` | Rakstzīmju kopa, uz kuru teksts tika normalizēts |
| `$label.page_count` | Atpazīto lapu skaits |
| `$label.pages` | Masīvs ar `{ page, text }` katras lapas apstrādei |
| `$label.file` | Avota faila `{ id, filename, mime_type, size_bytes }` |

`fileConvert` tā vietā atgriež jauno failu:

| Lauks | Apraksts |
|-------|-------------|
| `$label.id` | Nesen saglabātā faila UUID |
| `$label.filename` | Konvertētais faila nosaukums, pamatnosaukums saglabāts un paplašinājums nomainīts |
| `$label.mime_type` | Jaunā faila MIME tips |
| `$label.size_bytes` | Jaunā faila izmērs |
| `$label.download_url` | Drive lejupielādes URL jaunajam failam |
| `$label.source_file` | Konvertētā faila metadati |

## Piemērs

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

Ievadei `name,age\nAda,36` lejupstraumes mezgli piekļūst parsētajām rindām, izmantojot `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

XML konvertēšana uz JSON:

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

`<person id="1"><name>Ada</name></person>` gadījumā `$xmlToObject.result` ir `{ "person": { "@id": "1", "name": "Ada" } }`. Lai izveidotu XML, nododiet šo objektu otram Converter mezglam ar `conversion: "jsonToXml"`.

Skenēta rēķina nolasīšana, kas augšupielādēts, izmantojot faila augšupielādes trigger:

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

Lejupstraumes [Agent](./agent-node.md) vai [LLM](./llm-node.md) mezgls pēc tam var izvilkt strukturētus laukus no `$readInvoice.result`.

Agenta markdown atskaites pārveidošana par PDF:

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

Lejupstraumes mezgli nolasa `$convertDoc.download_url`, lai kopīgotu PDF, vai `$convertDoc.id`, lai turpinātu ar to strādāt [Drive](./drive-node.md).

## Prasības

OCR izsauc `tesseract` un poppler `pdftoppm`, un dokumentu konvertēšana izmanto pandoc. Visi trīs tiek piegādāti ar katru Heym palaišanas veidu, tostarp `run.sh`, docker-compose un atsevišķo laidiena attēlu, tāpēc nekas nav jākonfigurē. Lapu ierobežojumi, noildzes un maksimālais DPI ir fiksētas platformas vērtības, nevis iestatījumi.

## Saistītie

- [Set](./set-node.md) – Pārveidojiet un kartējiet atsevišķus laukus
- [JSON output mapper](./json-output-mapper-node.md) – Izveidojiet JSON atbildes objektu
- [File upload trigger](./file-upload-trigger-node.md) – Pieņemiet failu Heym Drive
- [Drive](./drive-node.md) – Saglabājiet, iegūstiet un kopīgojiet failus
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Expression DSL](../reference/expression-dsl.md) – Funkcijas un sintakse
