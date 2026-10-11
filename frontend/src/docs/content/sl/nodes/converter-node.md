# Pretvornik

**Pretvornik** vozlišče pretvarja podatke in datoteke med različnimi formati brez pisanja kode. Je tehnološko nevtralen, zato se lahko sčasoma dodajajo novi formati. Pretvarja podatke CSV, JSON in XML v obe smeri, izvaja Tesseract OCR za pridobivanje besedila iz slik in PDF-jev ter prepisuje shranjeno datoteko v drug format.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.result` (analizirani podatki za `csvToJson` / `xmlToJson`, besedilo za `jsonToCsv` / `jsonToXml`, pridobljeno besedilo za `imageToText` / `pdfToText`, nova metapodatka datoteke za `fileConvert`) |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `conversion` | niz | `csvToJson` (CSV besedilo → tabela objektov vrstic), `jsonToCsv` (tabela objektov/vrstic → CSV besedilo), `xmlToJson` (XML besedilo → objekt), `jsonToXml` (objekt → XML besedilo), `imageToText` (OCR slike), `pdfToText` (OCR vsake izbrane PDF strani) ali `fileConvert` (prepis shranjene datoteke v drug format) |
| `source` | izraz | Podatki za pretvorbo. Pustite prazno, da uporabite prvi vhod vozlišča |
| `delimiter` | niz | Enoznačni ločevalnik polj (privzeto `,`) |
| `hasHeader` | boolean | Samo `csvToJson` — obravnava prvo vrstico kot glavo (privzeto `true`) |
| `trimValues` | boolean | Samo `csvToJson` — odstrani odvečne presledke okoli imen glav in vrednosti celic (privzeto `true`) |
| `includeHeader` | boolean | Samo `jsonToCsv` — zapiše vrstico glave (privzeto `true`) |
| `converterColumns` | niz | Samo `jsonToCsv` — neobvezni vrstni red stolpcev, ločenih s vejico |
| `converterFileId` | izraz | Pretvorbe datotek — datoteka Heym Drive za branje, npr. `$Upload.file.id` |
| `converterTargetFormat` | niz | Samo `fileConvert` — izhodni format (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | niz | Samo OCR — `auto` (privzeto), Tesseract koda, kot je `tur`, ali `custom` |
| `ocrLanguageCustom` | niz | Samo OCR — jezikovne kode, ki se uporabljajo, ko je `ocrLanguage` nastavljen na `custom`, npr. `eng+tur` |
| `ocrEncoding` | niz | Samo OCR — niz znakov, na katerega je besedilo normalizirano (privzeto `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Samo OCR — uporabi NFC normalizacijo (privzeto `true`) |
| `ocrPsm` | niz | Samo OCR — način segmentacije strani Tesseract (privzeto `3`) |
| `ocrDpi` | število | Samo `pdfToText` — DPI rasterizacije strani (privzeto `300`) |
| `ocrPageRange` | izraz | Samo `pdfToText` — `3` ali `2-5`. Prazno pomeni vsako stran |

## Obnašanje

- **`csvToJson`** analizira izvorno CSV besedilo. Z `hasHeader: true` vsaka vrstica postane objekt, ki ga ključijo vrednosti glav; z `hasHeader: false` vsaka vrstica postane tabela vrednosti celic. Oznake, vgrajeni ločevalniki in vgrajeni novi vrstici se obravnavajo v skladu z RFC 4180. Vodilni UTF-8 BOM (pogost pri izvozu iz Excela) se odstrani, imena podvojenih glav pa postanejo edinstvena brez prepisovanja pravega stolpca (`a, a, a_2` → `a`, `a_3`, `a_2`). Nastavite `delimiter` na `\t`, da analizirate vrednosti, ločene s tabulatorjem.
- **`trimValues`** (privzeto `true`) odstrani okolišnje presledke iz imen glav in vrednosti celic, **vključno znotraj citiranih polj** (`" padded "` → `padded`). RFC 4180 obravnava citirane presledke kot podatke, zato nastavite `trimValues: false`, da jih ohranite natančno.
- **`jsonToCsv`** gradi CSV besedilo iz tabele objektov (ali tabel). Vrstni red stolpcev se prevzame iz `converterColumns`, ko je na voljo, sicer se izpelje iz ključev prvega objekta. Vrednosti, ki vsebujejo ločevalnik, citate ali nove vrstice, se samodejno citirajo.
- **`xmlToJson`** analizira XML v objekt. Atributi uporabljajo `@` predpone, besedilo, pomešano z atributi, pa uporablja `#text`; ponovljeni sosednji elementi postanejo tabele. Razširitev XML entitet je onemogočena.
- **`jsonToXml`** serializira objekt v XML dokument. Objekt mora imeti natančno en ključ na vrhnji ravni, ki postane korenski element XML. Uporabite isto konvencijo `@attribute` in `#text`, kot pri `xmlToJson`, da ustvarite atribute in besedilo poleg otroških elementov.
- **`imageToText`** izvaja Tesseract nad eno sliko (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizira vsako izbrano stran pri `ocrDpi` in jo prepozna. Vsaka stran gre skozi OCR, zato se digitalni PDF z dobro besedilno plastjo še vedno prebere iz pikslov. To ohranja skenirane in digitalne dokumente, da se obnašajo identično, na račun hitrosti, zato ozko `ocrPageRange` pri dolgih datotekah.
- **`fileConvert`** prepisuje izvorno datoteko v drug format in shrani rezultat kot **novo** datoteko v Drive. Izvirnik nikoli ni spremenjen. Dokumenti gredo skozi pandoc, slike skozi Pillow, in JSON v CSV skozi Python csv pisca. Slika ne more postati dokument in dokument ne more postati slika; za pridobitev besedila iz slike uporabite `imageToText`.

## Pridobivanje datoteke

Pretvorbe datotek berejo iz Heym Drive, ne iz poti ali URL-ja, zato mora biti datoteka najprej shranjena. Tri pogoste verige:

- **[Sprožilec nalaganja datotek](./file-upload-trigger-node.md) → Pretvornik** — usmerite `converterFileId` na `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Pretvornik** — prenesite oddaljeno datoteko v Drive, nato posredujte `$Download.id`.
- **[Agent](./agent-node.md) → Pretvornik** — veščina, ki zapiše datoteko, jo izpostavi kot `$reportAgent._generated_files[0].id`.

`converterFileId` sprejema tudi celoten objekt datoteke (`$Upload.file`) ali Heym prenosni URL; ID datoteke se izlušči iz obeh. Datoteka mora biti ena, ki jo imate vi ali ena, ki vam jo je delil sodelavec.
## Jeziki

`auto` (privzeto) najprej izvede zaznavanje orientacije in pisave Tesseract, nato pa izbere najboljši nameščen model za zaznano pisavo. Modeli pisav, kot sta `Latin` ali `Cyrillic`, preberejo vsak jezik, napisan v tej pisavi, zato `auto` obravnava turški račun in angleškega brez potrebe po dodatnih informacijah o tem, kateri je kateri.

Poimenovanje jezika je še vedno natančnejše, ko ga poznate. Uporabite enotno kodo (`tur`), ali združite več kod z `+` (`eng+tur`) za mešane dokumente — več jezikov pomeni počasnejše in nekoliko bolj hrupno prepoznavanje, zato naj bo seznam kratek. Kode delujejo le, če so ustrezni jezikovni podatki nameščeni na zadnjem delu; vozlišče navaja, kaj je na voljo, ko izberete manjkajočega.

Vsaka slika Heym vsebuje `osd`, angleščino, turščino, nemščino, francoščino, španščino, italijanščino, portugalščino, nizozemščino, ruščino, arabščino, poenostavljeno kitajščino, japonščino, korejščino ter modele pisav Latin, Cyrillic, Arabic, HanS, Japanese in Hangul.

## Kodiranje

Prepoznano besedilo je v UTF-8 in ohrani vsak znak, ki ga je Tesseract ustvaril. `ocrNormalizeUnicode` (privzeto vklopljen) uporablja NFC normalizacijo, tako da črka, napisana kot `s`, plus kombinacijski cedilla postane en sam `ş` — vredno je pustiti vklopljeno, ker ti dve obliki nista enaki pri primerjavah ali iskanju v podatkovnih bazah.

`ocrEncoding` je pomemben le, kadar nekaj downstream ne more shraniti celotnega obsega Unicode. Izbira `cp1254` ali `iso-8859-9` ohrani turško besedilo nedotaknjeno, hkrati pa zagotavlja, da rezultat ustreza temu znakovnemu naboru; `latin-1` in `ascii` sta ožja in zamenjata tisto, kar ne moreta predstaviti, z `?`. Pustite na `utf-8`, razen če vas ciljni sistem prisili, da spremenite.

## Izhod

`csvToJson`, `jsonToCsv`, `xmlToJson` in `jsonToXml` vrnejo `$label.result` in `$label.conversion`. OCR pretvorbe dodajo:

| Polje | Opis |
|-------|-------------|
| `$label.result` | Celotno izvlečeno besedilo, strani povezane z prazno vrstico |
| `$label.language` | Model, ki je dejansko deloval (koristno za ogled, kaj je izbral `auto`) |
| `$label.encoding` | Znakovni nabor, na katerega je bilo besedilo normalizirano |
| `$label.page_count` | Število prepoznanih strani |
| `$label.pages` | Polje `{ page, text }` za obravnavo po straneh |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` izvorne datoteke |

`fileConvert` vrne novo datoteko:

| Polje | Opis |
|-------|-------------|
| `$label.id` | UUID nove shranjene datoteke |
| `$label.filename` | Pretvorjeno ime datoteke, osnovno ime ohranjeno in razširitev zamenjana |
| `$label.mime_type` | MIME tip nove datoteke |
| `$label.size_bytes` | Velikost nove datoteke |
| `$label.download_url` | URL za prenos nove datoteke |
| `$label.source_file` | Metapodatki datoteke, ki je bila pretvorjena |

## Primer

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

Za vhod `name,age\nAda,36` downstream vozlišča dostopajo do razčlenjenih vrstic preko `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Pretvorba XML v JSON:

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

Za `<person id="1"><name>Ada</name></person>` je `$xmlToObject.result` `{ "person": { "@id": "1", "name": "Ada" } }`. Za ustvarjanje XML-a, posredujte ta objekt drugemu Converter vozlišču z `conversion: "jsonToXml"`.

Branje skeniranega računa, naloženega preko sprožilca za nalaganje datotek:

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

Agent ali LLM vozlišče downstream lahko nato izvleče strukturirane podatke iz `$readInvoice.result`.

Pretvorba markdown poročila agenta v PDF:

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

Downstream vozlišča preberejo `$convertDoc.download_url`, da delijo PDF, ali `$convertDoc.id`, da nadaljujejo z delom z njim v [Drive](./drive-node.md).

## Zahteve

OCR uporablja `tesseract` in popplerjev `pdftoppm`, dokumentna pretvorba pa uporablja pandoc. Vse tri so vključene v vsak način delovanja Heym, vključno z `run.sh`, docker-compose in enotno izdajo slike, zato ni potrebno nobeno konfiguriranje. Omejitve strani, časovne omejitve in največja DPI so fiksne vrednosti platforme in ne nastavitve.

## Sorodno

- [Set](./set-node.md) – Transformacija in preslikava posameznih polj
- [JSON output mapper](./json-output-mapper-node.md) – Ustvarite JSON odgovor
- [File upload trigger](./file-upload-trigger-node.md) – Sprejmite datoteko v Heym Drive
- [Drive](./drive-node.md) – Shranite, pridobite in delite datoteke
- [Node Types](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Expression DSL](../reference/expression-dsl.md) – Funkcije in sintaksa
