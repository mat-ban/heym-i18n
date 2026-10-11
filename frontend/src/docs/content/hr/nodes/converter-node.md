# Konverter

**Konverter** čvor pretvara podatke i datoteke između formata bez potrebe za pisanjem koda. Tehnološki je neutralan, tako da se s vremenom mogu dodavati novi formati. Pretvara CSV, JSON i XML podatke u oba smjera, pokreće Tesseract OCR za izdvajanje teksta iz slika i PDF-ova te prepisuje pohranjenu datoteku u drugi format.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.result` (parsing podaci za `csvToJson` / `xmlToJson`, tekst za `jsonToCsv` / `jsonToXml`, izdvojeni tekst za `imageToText` / `pdfToText`, novi metapodaci datoteke za `fileConvert`) |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `conversion` | string | `csvToJson` (CSV tekst → niz objekata redaka), `jsonToCsv` (niz objekata/redaka → CSV tekst), `xmlToJson` (XML tekst → objekt), `jsonToXml` (objekt → XML tekst), `imageToText` (OCR slike), `pdfToText` (OCR svake odabrane PDF stranice), ili `fileConvert` (prepisivanje pohranjene datoteke u drugi format) |
| `source` | izraz | Podaci za pretvorbu. Ostavite prazno za korištenje prvog ulaza čvora |
| `delimiter` | string | Separator polja s jednim znakom (zadano `,`) |
| `hasHeader` | boolean | Samo za `csvToJson` — tretirajte prvi redak kao zaglavlje (zadano `true`) |
| `trimValues` | boolean | Samo za `csvToJson` — uklonite praznine oko naziva zaglavlja i vrijednosti ćelija (zadano `true`) |
| `includeHeader` | boolean | Samo za `jsonToCsv` — napišite redak zaglavlja (zadano `true`) |
| `converterColumns` | string | Samo za `jsonToCsv` — opcionalni redoslijed stupaca odvojen zarezima |
| `converterFileId` | izraz | Konverzije datoteka — datoteka iz Heym Drive-a koju treba pročitati, npr. `$Upload.file.id` |
| `converterTargetFormat` | string | Samo za `fileConvert` — izlazni format (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Samo za OCR — `auto` (zadano), Tesseract kod poput `tur`, ili `custom` |
| `ocrLanguageCustom` | string | Samo za OCR — kodovi jezika korišteni kada je `ocrLanguage` postavljen na `custom`, npr. `eng+tur` |
| `ocrEncoding` | string | Samo za OCR — charset na koji se tekst normalizira (zadano `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Samo za OCR — primijenite NFC normalizaciju (zadano `true`) |
| `ocrPsm` | string | Samo za OCR — Tesseract način segmentacije stranica (zadano `3`) |
| `ocrDpi` | number | Samo za `pdfToText` — DPI rasterizacije stranice (zadano `300`) |
| `ocrPageRange` | izraz | Samo za `pdfToText` — `3` ili `2-5`. Prazno znači svaka stranica |

## Ponašanje

- **`csvToJson`** analizira izvorni CSV tekst. Uz `hasHeader: true` svaki redak postaje objekt s ključevima prema vrijednostima zaglavlja; uz `hasHeader: false` svaki redak postaje niz vrijednosti ćelija. Citirani podaci, ugrađeni delimitatori i ugrađeni novi redovi obrađuju se prema RFC 4180. Uklanja se vodeći UTF-8 BOM (čest u Excel izvozima), a duplicirani nazivi zaglavlja postaju jedinstveni bez prepisivanja stvarnog stupca (`a, a, a_2` → `a`, `a_3`, `a_2`). Postavite `delimiter` na `\t` za analizu vrijednosti odvojenih tabulatorima.
- **`trimValues`** (zadano `true`) uklanja okolne praznine iz naziva zaglavlja i vrijednosti ćelija, **uključujući unutar citiranih polja** (`" padded "` → `padded`). RFC 4180 tretira citirane praznine kao podatke, stoga postavite `trimValues: false` za očuvanje točne vrijednosti.
- **`jsonToCsv`** gradi CSV tekst iz niza objekata (ili nizova). Redoslijed stupaca preuzima se iz `converterColumns` kada je dostupan, inače se inferira iz ključeva prvog objekta. Vrijednosti koje sadrže delimiter, citate ili nove redove automatski se citiraju.
- **`xmlToJson`** analizira XML u objekt. Atributi koriste `@` prefikse, a tekst pomiješan s atributima koristi `#text`; ponovljeni elementi s istim roditeljem postaju nizovi. Proširenje XML entiteta je onemogućeno.
- **`jsonToXml`** serijalizira objekt u XML dokument. Objekt mora imati točno jedan ključ na vrhu, koji postaje korijenski element XML-a. Koristite istu konvenciju `@attribute` i `#text` kao u `xmlToJson` za proizvodnju atributa i teksta uz elemente djece.
- **`imageToText`** pokreće Tesseract nad jednom slikom (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizira svaku odabranu stranicu na `ocrDpi` i prepoznaje je. Svaka stranica prolazi kroz OCR, tako da se digitalni PDF s savršeno dobrim slojem teksta i dalje čita iz piksela. To omogućava skeniranim i digitalnim dokumentima da se ponašaju identično, uz trošak brzine, stoga sužavajte `ocrPageRange` na dugim datotekama.
- **`fileConvert`** prepisuje izvorni datoteku u drugi format i pohranjuje rezultat kao **novu** datoteku na Drive-u. Izvorna datoteka nikada se ne mijenja. Dokumenti prolaze kroz pandoc, slike kroz Pillow, a JSON u CSV kroz Python csv writer. Slika ne može postati dokument, a dokument ne može postati slika; za čitanje teksta iz slike koristite `imageToText`.

## Učitavanje datoteke

Konverzije datoteka čitaju iz Heym Drive-a, a ne s putanje ili URL-a, stoga datoteka mora biti prvo pohranjena. Tri uobičajena lanca:

- **[Okidač za prijenos datoteka](./file-upload-trigger-node.md) → Konverter** — usmjerite `converterFileId` na `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Konverter** — preuzmite udaljenu datoteku u Drive, a zatim proslijedite `$Download.id`.
- **[Agent](./agent-node.md) → Konverter** — vještina koja zapisuje datoteku izlaže je kao `$reportAgent._generated_files[0].id`.

`converterFileId` također prihvaća cijeli objekt datoteke (`$Upload.file`) ili Heym preuzimajući URL; ID datoteke se izvlači iz bilo kojeg od njih. Datoteka mora biti jedna koju posjedujete ili jedna koju je s Vama podijelio suradnik.
## Jezici

`auto` (zadano) prvo pokreće Tesseractovu detekciju orijentacije i skripte, a zatim odabire najbolji instalirani model za detektiranu skriptu. Skriptni modeli poput `Latin` ili `Cyrillic` čitaju svaki jezik napisan tom skriptom, zbog čega `auto` može obraditi tursku i englesku fakturu bez potrebe da se navede koji je koji.

Nazivanje jezika je još uvijek točnije kada ga znate. Koristite jedan kod (`tur`), ili spojite nekoliko s `+` (`eng+tur`) za mješovite dokumente — više jezika znači sporiju i nešto bučniju prepoznatljivost, stoga zadržite popis kratak. Kodovi rade samo kada su podaci o jeziku instalirani na backendu; čvor navodi što je dostupno kada odaberete nedostajući.

Svaka Heym slika dolazi s `osd`, engleskim, turskim, njemačkim, francuskim, španjolskim, talijanskim, portugalskim, nizozemskim, ruskim, arapskim, pojednostavljenim kineskim, japanskim, korejskim, te modelima skripti Latin, Cyrillic, Arabic, HanS, Japanese i Hangul.

## Kodiranje

Prepoznati tekst je UTF-8 i zadržava svaki znak koji je Tesseract proizveo. `ocrNormalizeUnicode` (uključeno prema zadanim postavkama) primjenjuje NFC normalizaciju, tako da slovo napisano kao `s` plus kombinirajuća cedila postaje jedno `ş` — vrijedi ostaviti uključeno, jer se dva oblika ne smatraju jednakima u usporedbama ili pretraživanjima u bazi podataka.

`ocrEncoding` je važan samo kada nešto nizvodno ne može pohraniti puni Unicode raspon. Odabir `cp1254` ili `iso-8859-9` zadržava turski tekst netaknut dok jamči da rezultat odgovara tom skupu znakova; `latin-1` i `ascii` su uži i zamjenjuju ono što ne mogu predstaviti s `?`. Ostavite na `utf-8` osim ako ciljni sustav ne prisili Vašu odluku.

## Izlaz

`csvToJson`, `jsonToCsv`, `xmlToJson` i `jsonToXml` vraćaju `$label.result` i `$label.conversion`. OCR konverzije dodaju:

| Polje | Opis |
|-------|-------------|
| `$label.result` | Cijeli izdvojeni tekst, stranice spojene praznom linijom |
| `$label.language` | Model koji je zapravo pokrenut (korisno za vidjeti što je `auto` odabrao) |
| `$label.encoding` | Skup znakova na koji je tekst normaliziran |
| `$label.page_count` | Broj prepoznatih stranica |
| `$label.pages` | Niz `{ page, text }` za obradu po stranici |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` izvorne datoteke |

`fileConvert` vraća novu datoteku umjesto:

| Polje | Opis |
|-------|-------------|
| `$label.id` | UUID nove pohranjene datoteke |
| `$label.filename` | Ime konvertirane datoteke, osnovno ime zadržano, a ekstenzija zamijenjena |
| `$label.mime_type` | MIME tip nove datoteke |
| `$label.size_bytes` | Veličina nove datoteke |
| `$label.download_url` | URL za preuzimanje nove datoteke |
| `$label.source_file` | Metapodaci datoteke koja je konvertirana |

## Primjer

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

Za ulaz `name,age\nAda,36`, nizvodni čvorovi pristupaju analiziranim redovima putem `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Konvertiranje XML-a u JSON:

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

Za `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` je `{ "person": { "@id": "1", "name": "Ada" } }`. Da biste stvorili XML, proslijedite taj objekt drugom Converter čvoru s `conversion: "jsonToXml"`.

Čitanje skenirane fakture učitane putem okidača za prijenos datoteka:

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

Nizvodni [Agent](./agent-node.md) ili [LLM](./llm-node.md) čvor tada može izvući strukturirana polja iz `$readInvoice.result`.

Pretvaranje markdown izvještaja agenta u PDF:

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

Nizvodni čvorovi čitaju `$convertDoc.download_url` za dijeljenje PDF-a, ili `$convertDoc.id` za nastavak rada s njim u [Drive](./drive-node.md).

## Zahtjevi

OCR koristi `tesseract` i popplerov `pdftoppm`, a konverzija dokumenata koristi pandoc. Sva tri dolaze s svakim načinom pokretanja Heyma, uključujući `run.sh`, docker-compose i pojedinačnu sliku izdanja, tako da nema potrebe za konfiguracijom. Ograničenja stranica, vremenska ograničenja i maksimalni DPI su fiksne platforme vrijednosti, a ne postavke.

## Povezano

- [Set](./set-node.md) – Transformirajte i mapirajte pojedinačna polja
- [JSON output mapper](./json-output-mapper-node.md) – Izradite JSON odgovor objekt
- [File upload trigger](./file-upload-trigger-node.md) – Prihvatite datoteku u Heym Drive
- [Drive](./drive-node.md) – Pohranite, preuzmite i dijelite datoteke
- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Expression DSL](../reference/expression-dsl.md) – Funkcije i sintaksa
