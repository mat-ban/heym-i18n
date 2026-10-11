# Konverteris

**Konverteris** mazgas konvertuoja duomenis ir failus tarp formatų, nerašant kodo. Jis yra technologijų neutralus, todėl laikui bėgant galima pridėti daugiau formatų. Jis konvertuoja CSV, JSON ir XML duomenis abiem kryptimis, vykdo Tesseract OCR, kad iš gautų tekstą iš vaizdų ir PDF failų, ir perrašo saugomą failą kitu formatu.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.result` (išanalizuoti duomenys `csvToJson` / `xmlToJson`, tekstas `jsonToCsv` / `jsonToXml`, išgautas tekstas `imageToText` / `pdfToText`, naujo failo metaduomenys `fileConvert`) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `conversion` | string | `csvToJson` (CSV tekstas → eilučių objektų masyvas), `jsonToCsv` (objektų/eilučių masyvas → CSV tekstas), `xmlToJson` (XML tekstas → objektas), `jsonToXml` (objektas → XML tekstas), `imageToText` (OCR vaizdui), `pdfToText` (OCR kiekvienai pasirinktos PDF puslapiui), arba `fileConvert` (perrašyti saugomą failą kitu formatu) |
| `source` | expression | Duomenys, kuriuos reikia konvertuoti. Palikite tuščią, kad naudotumėte pirmą mazgo įvestį |
| `delimiter` | string | Vieno simbolio laukų separatorius (numatytasis `,`) |
| `hasHeader` | boolean | Tik `csvToJson` — laikyti pirmą eilutę kaip antraštę (numatytasis `true`) |
| `trimValues` | boolean | Tik `csvToJson` — pašalinti tarpus aplink antraščių pavadinimus ir langelių vertes (numatytasis `true`) |
| `includeHeader` | boolean | Tik `jsonToCsv` — rašyti antraštės eilutę (numatytasis `true`) |
| `converterColumns` | string | Tik `jsonToCsv` — pasirenkamas stulpelių tvarkos, atskirtos kableliais, sąrašas |
| `converterFileId` | expression | Failų konversijos — Heym Drive failas, kurį reikia perskaityti, pvz., `$Upload.file.id` |
| `converterTargetFormat` | string | Tik `fileConvert` — išvesties formatas (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Tik OCR — `auto` (numatytasis), Tesseract kodas, pvz., `tur`, arba `custom` |
| `ocrLanguageCustom` | string | Tik OCR — kalbos kodai, naudojami, kai `ocrLanguage` yra `custom`, pvz., `eng+tur` |
| `ocrEncoding` | string | Tik OCR — simbolių rinkinys, kuriam tekstas normalizuojamas (numatytasis `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Tik OCR — taikyti NFC normalizavimą (numatytasis `true`) |
| `ocrPsm` | string | Tik OCR — Tesseract puslapio segmentavimo režimas (numatytasis `3`) |
| `ocrDpi` | number | Tik `pdfToText` — puslapio rasterizavimo DPI (numatytasis `300`) |
| `ocrPageRange` | expression | Tik `pdfToText` — `3` arba `2-5`. Tuščia reiškia kiekvieną puslapį |

## Elgsena

- **`csvToJson`** analizuoja šaltinio CSV tekstą. Su `hasHeader: true` kiekviena eilutė tampa objektu, kurio raktai yra antraštės vertės; su `hasHeader: false` kiekviena eilutė tampa langelių verčių masyvu. Cituojami laukai, įterpti separatoriai ir įterpti nauji eilutės simboliai yra tvarkomi pagal RFC 4180. Priešpriešinis UTF-8 BOM (dažnas Excel eksportuose) yra pašalinamas, o pasikartojančių antraščių pavadinimai padaromi unikalūs, neperrašant tikro stulpelio (`a, a, a_2` → `a`, `a_3`, `a_2`). Nustatykite `delimiter` į `\t`, kad analizuotumėte tabuliuotus duomenis.
- **`trimValues`** (numatytasis `true`) pašalina aplinkinius tarpus iš antraščių pavadinimų ir langelių verčių, **įskaitant cituotuose laukuose** (`" padded "` → `padded`). RFC 4180 traktuoja cituotus tarpus kaip duomenis, todėl nustatykite `trimValues: false`, kad išsaugotumėte juos tiksliai.
- **`jsonToCsv`** sudaro CSV tekstą iš objektų (arba masyvų) masyvo. Stulpelių tvarka imama iš `converterColumns`, kai ji pateikiama, kitaip ji nustatoma pagal pirmo objekto raktus. Vertės, turinčios separatorius, cituojamus simbolius ar naujų eilučių simbolius, automatiškai cituojamos.
- **`xmlToJson`** analizuoja XML į objektą. Atributai naudoja `@` prefiksus, o tekstas, sumaišytas su atributais, naudoja `#text`; pakartotiniai broliniai elementai tampa masyvais. XML objekto plėtimas yra išjungtas.
- **`jsonToXml`** serializuoja objektą į XML dokumentą. Objektas turi turėti tik vieną viršutinio lygio raktą, kuris tampa XML šakninio elemento. Naudokite tą patį `@attribute` ir `#text` konvenciją kaip `xmlToJson`, kad sukurtumėte atributus ir tekstą kartu su vaikų elementais.
- **`imageToText`** vykdo Tesseract vienam vaizdui (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizuoja kiekvieną pasirinktą puslapį `ocrDpi` ir atpažįsta jį. Kiekvienas puslapis pereina per OCR, todėl skaitmeninis PDF su puikiai geru teksto sluoksniu vis tiek yra perskaitytas iš pikselių. Tai leidžia nuskaityti ir skaitmeninius dokumentus elgtis identiškai, tačiau tai sumažina greitį, todėl siaurinkite `ocrPageRange` ilguose failuose.
- **`fileConvert`** perrašo šaltinio failą kitu formatu ir saugo rezultatą kaip **naują** Drive failą. Originalas niekada nėra modifikuojamas. Dokumentai pereina per pandoc, vaizdai per Pillow, o JSON į CSV per Python csv rašytoją. Vaizdas negali tapti dokumentu, o dokumentas negali tapti vaizdu; norint išgauti tekstą iš vaizdo, naudokite `imageToText`.

## Failo įkėlimas

Failų konversijos skaito iš Heym Drive, o ne iš kelio ar URL, todėl failas pirmiausia turi būti saugomas. Trys dažni grandinės:

- **[Failo įkėlimo triggeris](./file-upload-trigger-node.md) → Konverteris** — nurodykite `converterFileId` į `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Konverteris** — atsisiųskite nuotolinį failą į Drive, tada perduokite `$Download.id`.
- **[Agentas](./agent-node.md) → Konverteris** — įgūdžių, kurie rašo failą, išvestis yra `$reportAgent._generated_files[0].id`.

`converterFileId` taip pat priima visą failo objektą (`$Upload.file`) arba Heym atsisiuntimo URL; failo ID yra ištraukiamas iš bet kurio iš jų. Failas turi būti tas, kurį valdote, arba tas, kurį su jumis pasidalino komandos narys.
## Kalbos

`auto` (numatytasis) pirmiausia vykdo Tesseract orientacijos ir rašto atpažinimo procesą, tada pasirenka geriausią įdiegtą modelį atpažintam raštui. Rašto modeliai, tokie kaip `Latin` arba `Cyrillic`, skaito kiekvieną kalbą, parašytą tuo raštu, todėl `auto` tvarko tiek Turkijos, tiek anglų kalbos sąskaitą, nesakydamas, kuri yra kuri.

Nurodyti kalbą vis tiek yra tikslesnis sprendimas, kai tai žinote. Naudokite vieną kodą (`tur`), arba sujunkite kelis su `+` (`eng+tur`) mišriems dokumentams — kuo daugiau kalbų, tuo lėtesnis ir šiek tiek triukšmingesnis atpažinimas, todėl laikykite sąrašą trumpą. Kodai veikia tik tada, kai atitinkami kalbos duomenys yra įdiegti backend'e; mazgas nurodo, kas yra prieinama, kai pasirenkate trūkstamą.

Kiekvienas Heym vaizdas apima `osd`, anglų, turkų, vokiečių, prancūzų, ispanų, italų, portugalų, olandų, rusų, arabų, supaprastintą kinų, japonų, korėjiečių, taip pat Latin, Cyrillic, Arabic, HanS, japonų ir Hangul rašto modelius.

## Kodavimas

Atpažintas tekstas yra UTF-8 ir išlaiko kiekvieną simbolį, kurį sukūrė Tesseract. `ocrNormalizeUnicode` (numatytasis įjungtas) taiko NFC normalizavimą, todėl raidė, parašyta kaip `s`, plius derinimo cedilla, tampa vienu `ş` — verta palikti įjungtą, nes dvi formos nėra lygios palyginimuose ar duomenų bazės paieškose.

`ocrEncoding` yra svarbus tik tada, kai kažkas žemiau negali saugoti viso Unicode diapazono. Pasirinkus `cp1254` arba `iso-8859-9`, turkų tekstas išlieka nepakitęs, tuo pačiu užtikrinant, kad rezultatas atitiktų tą simbolių rinkinį; `latin-1` ir `ascii` yra siauresni ir pakeičia tai, ko negali atstovauti, simboliu `?`. Palikite `utf-8`, nebent tikslinė sistema priverčia jus tai daryti.

## Išvestis

`csvToJson`, `jsonToCsv`, `xmlToJson` ir `jsonToXml` grąžina `$label.result` ir `$label.conversion`. OCR konversijos prideda:

| Laukas | Aprašymas |
|--------|-----------|
| `$label.result` | Pilnas išgautas tekstas, puslapiai sujungti tuščia eilute |
| `$label.language` | Modelis, kuris iš tikrųjų buvo vykdomas (naudinga matyti, ką pasirinko `auto`) |
| `$label.encoding` | Simbolių rinkinys, į kurį tekstas buvo normalizuotas |
| `$label.page_count` | Atpažintų puslapių skaičius |
| `$label.pages` | `{ page, text }` masyvas puslapių tvarkymui |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` šaltinio failo |

`fileConvert` grąžina naują failą:

| Laukas | Aprašymas |
|--------|-----------|
| `$label.id` | Naujai saugomo failo UUID |
| `$label.filename` | Konvertuotas failo pavadinimas, išlaikant bazinį pavadinimą ir pakeičiant plėtinį |
| `$label.mime_type` | Naujo failo MIME tipas |
| `$label.size_bytes` | Naujo failo dydis |
| `$label.download_url` | Atsisiuntimo URL naujam failui |
| `$label.source_file` | Konvertuoto failo metaduomenys |

## Pavyzdys

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

Įvedus `name,age\nAda,36`, žemiau esantys mazgai pasiekia išanalizuotas eilutes per `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Konvertuojant XML į JSON:

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

Į `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` yra `{ "person": { "@id": "1", "name": "Ada" } }`. Norint sukurti XML, perduokite tą objektą antram Converter mazgui su `conversion: "jsonToXml"`.

Skaitant nuskenuotą sąskaitą, įkeliamą per failo įkėlimo trigger'į:

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

Žemiau esantis [Agent](./agent-node.md) arba [LLM](./llm-node.md) mazgas gali tada ištraukti struktūrizuotus laukus iš `$readInvoice.result`.

Agentų markdown ataskaitos konvertavimas į PDF:

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

Žemiau esantys mazgai skaito `$convertDoc.download_url`, kad pasidalintų PDF, arba `$convertDoc.id`, kad toliau dirbtų su juo [Drive](./drive-node.md).

## Reikalavimai

OCR naudoja `tesseract` ir poppler `pdftoppm`, o dokumentų konversija naudoja pandoc. Visi trys yra įtraukti į kiekvieną Heym veikimo būdą, įskaitant `run.sh`, docker-compose ir vieną išleidimo vaizdą, todėl nieko nereikia konfigūruoti. Puslapio limitai, laikini limitai ir maksimalus DPI yra fiksuoti platformos parametrai, o ne nustatymai.

## Susiję

- [Set](./set-node.md) – Transformuoti ir žemėlapiuoti atskirus laukus
- [JSON output mapper](./json-output-mapper-node.md) – Sukurti JSON atsakymo objektą
- [File upload trigger](./file-upload-trigger-node.md) – Priimti failą į Heym Drive
- [Drive](./drive-node.md) – Saugojimas, gavimas ir failų dalijimasis
- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Expression DSL](../reference/expression-dsl.md) – Funkcijos ir sintaksė
