# Converter

A **Converter** csomópont kód írása nélkül alakítja át az adatokat és fájlokat különböző formátumok között. Technológiától független, így idővel további formátumok is hozzáadhatók. Kétirányúan konvertálja a CSV, JSON és XML adatokat, Tesseract OCR-t futtat, hogy szöveget nyerjen ki képekből és PDF-ekből, valamint egy tárolt fájlt ír át egy másik formátumba.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.result` (értelmezett adat a `csvToJson` / `xmlToJson` esetén, szöveg a `jsonToCsv` / `jsonToXml` esetén, kinyert szöveg az `imageToText` / `pdfToText` esetén, új fájl metaadatai a `fileConvert` esetén) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `conversion` | string | `csvToJson` (CSV szöveg → sorelemek tömbje), `jsonToCsv` (objektumok/sorok tömbje → CSV szöveg), `xmlToJson` (XML szöveg → objektum), `jsonToXml` (objektum → XML szöveg), `imageToText` (egy kép OCR-feldolgozása), `pdfToText` (a kiválasztott PDF-oldalak OCR-feldolgozása), vagy `fileConvert` (egy tárolt fájl átírása más formátumba) |
| `source` | expression | Az átalakítandó adat. Hagyja üresen, hogy a csomópont első bemenetét használja |
| `delimiter` | string | Egykarakteres mezőelválasztó (alapértelmezett: `,`) |
| `hasHeader` | boolean | Csak `csvToJson` esetén — az első sor fejlécként való kezelése (alapértelmezett: `true`) |
| `trimValues` | boolean | Csak `csvToJson` esetén — a fejlécnevek és cellaértékek körüli szóközök eltávolítása (alapértelmezett: `true`) |
| `includeHeader` | boolean | Csak `jsonToCsv` esetén — fejlécsor írása (alapértelmezett: `true`) |
| `converterColumns` | string | Csak `jsonToCsv` esetén — opcionális, vesszővel elválasztott oszlopsorrend |
| `converterFileId` | expression | Fájlkonverziók — a beolvasandó Heym Drive fájl, pl. `$Upload.file.id` |
| `converterTargetFormat` | string | Csak `fileConvert` esetén — kimeneti formátum (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Csak OCR esetén — `auto` (alapértelmezett), egy Tesseract kód, például `tur`, vagy `custom` |
| `ocrLanguageCustom` | string | Csak OCR esetén — a `ocrLanguage` `custom` értéke esetén használt nyelvkódok, pl. `eng+tur` |
| `ocrEncoding` | string | Csak OCR esetén — a karakterkészlet, amelyre a szöveg normalizálásra kerül (alapértelmezett: `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Csak OCR esetén — NFC normalizálás alkalmazása (alapértelmezett: `true`) |
| `ocrPsm` | string | Csak OCR esetén — Tesseract oldalszegmentálási mód (alapértelmezett: `3`) |
| `ocrDpi` | number | Csak `pdfToText` esetén — az oldal rasterizálási DPI-je (alapértelmezett: `300`) |
| `ocrPageRange` | expression | Csak `pdfToText` esetén — `3` vagy `2-5`. Üresen hagyva minden oldalt jelent |

## Működés

- A **`csvToJson`** értelmezi a forrás CSV szöveget. `hasHeader: true` esetén minden sor egy objektummá válik, amelynek kulcsai a fejlécértékek; `hasHeader: false` esetén minden sor a cellaértékek tömbjévé válik. Az idézőjelbe tett mezők, a beágyazott elválasztók és a beágyazott sortörések az RFC 4180 szabványnak megfelelően kerülnek kezelésre. A kezdő UTF-8 BOM (jellemző az Excel exportoknál) eltávolításra kerül, és az ismétlődő fejlécnevek egyedivé válnak anélkül, hogy felülírná egy valódi oszlopot (`a, a, a_2` → `a`, `a_3`, `a_2`). Állítsa a `delimiter` értékét `\t`-re a tabulátorral elválasztott értékek értelmezéséhez.
- A **`trimValues`** (alapértelmezett: `true`) eltávolítja a fejlécnevek és cellaértékek körüli szóközöket, **beleértve az idézőjelbe tett mezők belsejét is** (`" padded "` → `padded`). Az RFC 4180 az idézőjelbe tett szóközt adatként kezeli, ezért állítsa a `trimValues: false` értéket a pontos megőrzéshez.
- A **`jsonToCsv`** CSV szöveget épít objektumok (vagy tömbök) tömbjéből. Az oszlopsorrend a `converterColumns` megadása esetén onnan származik, egyébként az első objektum kulcsaiból kerül kikövetkeztetésre. Az elválasztót, idézőjelet vagy sortörést tartalmazó értékek automatikusan idézőjelbe kerülnek.
- Az **`xmlToJson`** XML-t értelmez objektummá. Az attribútumok `@` előtagot használnak, az attribútumokkal kevert szöveg pedig `#text`-et; az ismétlődő testvérelemek tömbökké válnak. Az XML entitáskiterjesztés le van tiltva.
- A **`jsonToXml`** objektumot XML dokumentummá szerializál. Az objektumnak pontosan egy felső szintű kulccsal kell rendelkeznie, amely az XML gyökérelemévé válik. Ugyanazt az `@attribute` és `#text` konvenciót használja, mint az `xmlToJson`, hogy attribútumokat és szöveget állítson elő a gyermekelemek mellett.
- Az **`imageToText`** Tesseractot futtat egyetlen képen (PNG, JPEG, TIFF, WebP, BMP).
- A **`pdfToText`** a kiválasztott oldalakat `ocrDpi` felbontásban rasterizálja és felismeri. Minden oldal OCR-feldolgozáson esik át, így egy digitális PDF, amelynek tökéletes szövegrétege van, akkor is pixelről kerül újraolvasásra. Ez biztosítja, hogy a szkennelt és a digitális dokumentumok azonosan viselkedjenek, a sebesség rovására, ezért hosszú fájlok esetén szűkítse az `ocrPageRange` értékét.
- A **`fileConvert`** a forrásfájlt egy másik formátumban írja át, és az eredményt **új** Drive fájlként tárolja. Az eredeti soha nem módosul. A dokumentumok pandocon, a képek Pillow-n, a JSON-ból CSV-be történő átalakítás pedig a Python csv íróján keresztül mennek. Egy kép nem válhat dokumentummá, és egy dokumentum nem válhat képpé; a képből való szövegkinyeréshez használja az `imageToText`-et.

## A fájl bejuttatása

A fájlkonverziók a Heym Drive-ból olvasnak, nem útvonalból vagy URL-ből, ezért a fájlt először tárolni kell. Három gyakori lánc:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — állítsa a `converterFileId` értékét `$Upload.file.id`-re.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — töltsön le egy távoli fájlt a Drive-ba, majd adja át a `$Download.id` értékét.
- **[Agent](./agent-node.md) → Converter** — egy fájlt író skill `$reportAgent._generated_files[0].id` formában teszi elérhetővé.

A `converterFileId` egy teljes fájlobjektumot (`$Upload.file`) vagy egy Heym letöltési URL-t is elfogad; a fájl azonosítója mindkettőből kinyerésre kerül. A fájlnak olyannak kell lennie, amely az Ön tulajdonában van, vagy amelyet egy csapattárs osztott meg Önnel.
## Nyelvek

Az `auto` (az alapértelmezett) először a Tesseract orientáció- és írásrendszer-felismerését futtatja, majd kiválasztja a felismert írásrendszerhez legjobban illő telepített modellt. Az olyan írásrendszer-modellek, mint a `Latin` vagy a `Cyrillic`, minden ebben az írásrendszerben írt nyelvet felismernek, ezért az auto képes kezelni egy török és egy angol számlát anélkül, hogy meg kellene mondani, melyik melyik.

A nyelv megnevezése azonban továbbra is pontosabb, ha ismeri azt. Használjon egyetlen kódot (`tur`), vagy kapcsoljon össze többet `+` jellel (`eng+tur`) vegyes dokumentumok esetén — a több nyelv lassabb és kissé zajosabb felismerést eredményez, ezért tartsa rövid a listát. A kódok csak akkor működnek, ha a megfelelő nyelvi adatok telepítve vannak a backendben; a csomópont felsorolja az elérhetőket, amikor egy hiányzót választ.

Minden Heym image tartalmazza az `osd`, angol, török, német, francia, spanyol, olasz, portugál, holland, orosz, arab, egyszerűsített kínai, japán, koreai nyelvet, valamint a Latin, Cyrillic, Arabic, HanS, Japanese és Hangul írásrendszer-modelleket.

## Kódolás

A felismert szöveg UTF-8, és minden karaktert megtart, amelyet a Tesseract előállított. Az `ocrNormalizeUnicode` (alapértelmezés szerint bekapcsolva) NFC normalizálást alkalmaz, így a `s` betűként és kombináló cedillaként írt betű egyetlen `ş` karakterré alakul — érdemes bekapcsolva hagyni, mert a két forma nem egyenlő az összehasonlításokban vagy adatbázis-lekérdezésekben.

Az `ocrEncoding` csak akkor számít, ha valami a folyamatban nem képes a teljes Unicode tartományt tárolni. A `cp1254` vagy `iso-8859-9` kiválasztása érintetlenül hagyja a török szöveget, miközben garantálja, hogy az eredmény belefér ebbe a karakterkészletbe; a `latin-1` és az `ascii` szűkebbek, és `?` karakterrel helyettesítik azt, amit nem tudnak ábrázolni. Hagyja `utf-8` értéken, kivéve ha egy célrendszer erre kényszeríti.

## Kimenet

A `csvToJson`, `jsonToCsv`, `xmlToJson` és `jsonToXml` a `$label.result` és `$label.conversion` értékeket adja vissza. Az OCR-konverziók ezeket egészítik ki:

| Mező | Leírás |
|-------|-------------|
| `$label.result` | A teljes kinyert szöveg, az oldalak üres sorral elválasztva |
| `$label.language` | A ténylegesen lefutott modell (hasznos annak megtekintéséhez, mit választott az `auto`) |
| `$label.encoding` | A karakterkészlet, amelyre a szöveg normalizálva lett |
| `$label.page_count` | A felismert oldalak száma |
| `$label.pages` | `{ page, text }` tömb az oldalankénti kezeléshez |
| `$label.file` | A forrásfájl `{ id, filename, mime_type, size_bytes }` adatai |

A `fileConvert` ehelyett az új fájlt adja vissza:

| Mező | Leírás |
|-------|-------------|
| `$label.id` | Az újonnan tárolt fájl UUID-ja |
| `$label.filename` | A konvertált fájlnév, az alapnév megtartva és a kiterjesztés lecserélve |
| `$label.mime_type` | Az új fájl MIME-típusa |
| `$label.size_bytes` | Az új fájl mérete |
| `$label.download_url` | A Drive letöltési URL-je az új fájlhoz |
| `$label.source_file` | A konvertált fájl metaadatai |

## Példa

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

A `name,age\nAda,36` bemenet esetén a downstream csomópontok a `$toRows.result` segítségével érik el a feldolgozott sorokat (`[{ "name": "Ada", "age": "36" }]`).

XML konvertálása JSON-ná:

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

A `<person id="1"><name>Ada</name></person>` bemenet esetén a `$xmlToObject.result` értéke `{ "person": { "@id": "1", "name": "Ada" } }`. XML létrehozásához adja át ezt az objektumot egy második Converter csomópontnak `conversion: "jsonToXml"` beállítással.

Fájlfeltöltés triggeren keresztül feltöltött beolvasott számla beolvasása:

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

Egy downstream [Agent](./agent-node.md) vagy [LLM](./llm-node.md) csomópont ezután strukturált mezőket nyerhet ki a `$readInvoice.result` értékéből.

Egy agent markdown-jelentésének PDF-formátumba alakítása:

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

A downstream csomópontok a `$convertDoc.download_url` segítségével osztják meg a PDF-et, vagy a `$convertDoc.id` segítségével folytatják a munkát vele a [Drive](./drive-node.md) szolgáltatásban.

## Követelmények

Az OCR a `tesseract` és a poppler `pdftoppm` programját hívja meg, a dokumentumkonverzió pedig a pandoc-ot használja. Mindhárom megtalálható a Heym futtatásának minden módjában, beleértve a `run.sh`-t, a docker-compose-t és az egységes kiadási image-et, így nincs mit konfigurálni. Az oldalkorlátok, az időtúllépések és a maximális DPI fix platformértékek, nem pedig beállítások.

## Kapcsolódó

- [Set](./set-node.md) – Egyedi mezők átalakítása és leképezése
- [JSON output mapper](./json-output-mapper-node.md) – JSON válaszobjektum felépítése
- [File upload trigger](./file-upload-trigger-node.md) – Fájl fogadása a Heym Drive-ba
- [Drive](./drive-node.md) – Fájlok tárolása, lekérése és megosztása
- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Expression DSL](../reference/expression-dsl.md) – Függvények és szintaxis
