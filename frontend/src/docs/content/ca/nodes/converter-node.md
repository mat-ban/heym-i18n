# Converter

El node **Converter** converteix dades i fitxers entre formats sense escriure codi. És neutral quant a tecnologia, de manera que es poden afegir més formats amb el temps. Converteix dades CSV, JSON i XML en totes dues direccions, executa Tesseract OCR per extreure text d'imatges i PDF, i reescriu un fitxer emmagatzemat en un altre format.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.result` (dades analitzades per a `csvToJson` / `xmlToJson`, text per a `jsonToCsv` / `jsonToXml`, text extret per a `imageToText` / `pdfToText`, metadades del fitxer nou per a `fileConvert`) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `conversion` | string | `csvToJson` (text CSV → matriu d'objectes de fila), `jsonToCsv` (matriu d'objectes/files → text CSV), `xmlToJson` (text XML → objecte), `jsonToXml` (objecte → text XML), `imageToText` (OCR d'una imatge), `pdfToText` (OCR de cada pàgina PDF seleccionada), o `fileConvert` (reescriu un fitxer emmagatzemat en un altre format) |
| `source` | expression | Les dades a convertir. Deixeu-ho buit per utilitzar la primera entrada del node |
| `delimiter` | string | Separador de camps d'un sol caràcter (per defecte `,`) |
| `hasHeader` | boolean | Només `csvToJson` — tracta la primera fila com a capçalera (per defecte `true`) |
| `trimValues` | boolean | Només `csvToJson` — elimina els espais en blanc al voltant dels noms de capçalera i dels valors de les cel·les (per defecte `true`) |
| `includeHeader` | boolean | Només `jsonToCsv` — escriu una fila de capçalera (per defecte `true`) |
| `converterColumns` | string | Només `jsonToCsv` — ordre de columnes opcional separat per comes |
| `converterFileId` | expression | Conversions de fitxers — el fitxer de Heym Drive a llegir, p. ex. `$Upload.file.id` |
| `converterTargetFormat` | string | Només `fileConvert` — format de sortida (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Només OCR — `auto` (per defecte), un codi Tesseract com ara `tur`, o `custom` |
| `ocrLanguageCustom` | string | Només OCR — codis d'idioma utilitzats quan `ocrLanguage` és `custom`, p. ex. `eng+tur` |
| `ocrEncoding` | string | Només OCR — joc de caràcters al qual es normalitza el text (per defecte `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Només OCR — aplica la normalització NFC (per defecte `true`) |
| `ocrPsm` | string | Només OCR — mode de segmentació de pàgina de Tesseract (per defecte `3`) |
| `ocrDpi` | number | Només `pdfToText` — DPI de rasterització de la pàgina (per defecte `300`) |
| `ocrPageRange` | expression | Només `pdfToText` — `3` o `2-5`. Buit significa totes les pàgines |

## Comportament

- **`csvToJson`** analitza el text CSV d'origen. Amb `hasHeader: true` cada fila es converteix en un objecte amb clau segons els valors de la capçalera; amb `hasHeader: false` cada fila es converteix en una matriu de valors de cel·la. Els camps entre cometes, els delimitadors incrustats i els salts de línia incrustats es gestionen segons RFC 4180. S'elimina un BOM UTF-8 inicial (habitual en exportacions d'Excel), i els noms de capçalera duplicats es fan únics sense sobreescriure una columna real (`a, a, a_2` → `a`, `a_3`, `a_2`). Establiu `delimiter` a `\t` per analitzar valors separats per tabulacions.
- **`trimValues`** (per defecte `true`) elimina els espais en blanc circumdants dels noms de capçalera i dels valors de les cel·les, **incloent-hi dins de camps entre cometes** (`" padded "` → `padded`). RFC 4180 tracta els espais en blanc entre cometes com a dades, de manera que establiu `trimValues: false` per preservar-los exactament.
- **`jsonToCsv`** construeix text CSV a partir d'una matriu d'objectes (o matrius). L'ordre de les columnes es pren de `converterColumns` quan es proporciona; en cas contrari, s'infereix de les claus del primer objecte. Els valors que contenen el delimitador, cometes o salts de línia es posen entre cometes automàticament.
- **`xmlToJson`** analitza XML en un objecte. Els atributs utilitzen el prefix `@` i el text barrejat amb atributs utilitza `#text`; els elements germans repetits es converteixen en matrius. L'expansió d'entitats XML està desactivada.
- **`jsonToXml`** serialitza un objecte en un document XML. L'objecte ha de tenir exactament una clau de nivell superior, que es converteix en l'element arrel XML. Utilitzeu la mateixa convenció `@attribute` i `#text` que a `xmlToJson` per produir atributs i text al costat d'elements fills.
- **`imageToText`** executa Tesseract sobre una única imatge (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasteritza cada pàgina seleccionada a `ocrDpi` i la reconeix. Cada pàgina passa per OCR, de manera que un PDF digital amb una capa de text perfectament bona es torna a llegir a partir de píxels. Això fa que els documents escanejats i els digitals es comportin de manera idèntica, a costa de la velocitat, així que limiteu `ocrPageRange` en fitxers llargs.
- **`fileConvert`** reescriu el fitxer d'origen en un altre format i emmagatzema el resultat com un fitxer de Drive **nou**. L'original no es modifica mai. Els documents passen per pandoc, les imatges per Pillow, i JSON a CSV pel writer csv de Python. Una imatge no pot esdevenir un document i un document no pot esdevenir una imatge; per llegir text d'una imatge utilitzeu `imageToText`.
## Obtenir el fitxer

Les conversions de fitxers llegeixen de Heym Drive, no d'una ruta ni d'una URL, de manera que el fitxer s'ha d'emmagatzemar primer. Tres cadenes habituals:

- **[Trigger de pujada de fitxer](./file-upload-trigger-node.md) → Converter** — apunteu `converterFileId` a `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — obteniu un fitxer remot cap a Drive i, tot seguit, passeu `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — una skill que escriu un fitxer l'exposa com a `$reportAgent._generated_files[0].id`.

`converterFileId` també accepta un objecte de fitxer sencer (`$Upload.file`) o una URL de descàrrega de Heym; l'id del fitxer s'extreu de qualsevol dels dos. El fitxer ha de ser un que posseïu o un que un company d'equip hagi compartit amb vosaltres.

## Idiomes

`auto` (el valor per defecte) executa primer la detecció d'orientació i d'escriptura del Tesseract i, després, tria el millor model instal·lat per a l'escriptura detectada. Els models d'escriptura com ara `Latin` o `Cyrillic` llegeixen tots els idiomes escrits en aquesta escriptura, motiu pel qual auto gestiona una factura en turc i una en anglès sense que calgui indicar quina és quina.

Tot i això, anomenar l'idioma és més precís quan el coneixeu. Utilitzeu un sol codi (`tur`), o bé combineu-ne diversos amb `+` (`eng+tur`) per a documents mixtos — com més idiomes, més lent i lleugerament més sorollós és el reconeixement, de manera que convé mantenir la llista curta. Els codis només funcionen quan les dades d'idioma corresponents estan instal·lades al backend; el node llista què hi ha disponible quan en trieu un que falta.

Cada imatge de Heym inclou `osd`, anglès, turc, alemany, francès, espanyol, italià, portuguès, neerlandès, rus, àrab, xinès simplificat, japonès, coreà, i els models d'escriptura Latin, Cyrillic, Arabic, HanS, Japanese i Hangul.

## Codificació

El text reconegut és UTF-8 i conserva tots els caràcters que el Tesseract ha produït. `ocrNormalizeUnicode` (activat per defecte) aplica la normalització NFC, de manera que una lletra escrita com a `s` més una cedilla combinant esdevé una sola `ş` — val la pena deixar-ho activat, perquè les dues formes no són iguals en comparacions ni en consultes a bases de dades.

`ocrEncoding` només és rellevant quan alguna cosa aigües avall no pot emmagatzemar tot el rang Unicode. Triar `cp1254` o `iso-8859-9` manté el text turc intacte alhora que garanteix que el resultat cap dins d'aquest joc de caràcters; `latin-1` i `ascii` són més estrets i substitueixen pel caràcter `?` allò que no poden representar. Deixeu-ho a `utf-8` tret que un sistema de destinació us ho imposi.

## Sortida

`csvToJson`, `jsonToCsv`, `xmlToJson` i `jsonToXml` retornen `$label.result` i `$label.conversion`. Les conversions OCR afegeixen:

| Camp | Descripció |
|-------|-------------|
| `$label.result` | El text extret complet, amb les pàgines unides per una línia en blanc |
| `$label.language` | El model que realment s'ha executat (útil per veure què ha triat `auto`) |
| `$label.encoding` | El joc de caràcters al qual s'ha normalitzat el text |
| `$label.page_count` | Nombre de pàgines reconegudes |
| `$label.pages` | Array de `{ page, text }` per al tractament per pàgina |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` del fitxer d'origen |

`fileConvert` retorna el fitxer nou en el seu lloc:

| Camp | Descripció |
|-------|-------------|
| `$label.id` | UUID del fitxer acabat d'emmagatzemar |
| `$label.filename` | Nom de fitxer convertit, amb el nom base conservat i l'extensió intercanviada |
| `$label.mime_type` | Tipus MIME del fitxer nou |
| `$label.size_bytes` | Mida del fitxer nou |
| `$label.download_url` | URL de descàrrega de Drive per al fitxer nou |
| `$label.source_file` | Metadades del fitxer que s'ha convertit |

## Exemple

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

Per a l'entrada `name,age\nAda,36`, els nodes aigües avall accedeixen a les files analitzades mitjançant `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Conversió d'XML a JSON:

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

Per a `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` és `{ "person": { "@id": "1", "name": "Ada" } }`. Per crear XML, passeu aquest objecte a un segon node Converter amb `conversion: "jsonToXml"`.

Lectura d'una factura escanejada pujada mitjançant un trigger de pujada de fitxer:

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

Un node [Agent](./agent-node.md) o [LLM](./llm-node.md) aigües avall pot extreure després camps estructurats de `$readInvoice.result`.

Conversió de l'informe en markdown d'un agent a PDF:

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

Els nodes aigües avall llegeixen `$convertDoc.download_url` per compartir el PDF, o `$convertDoc.id` per continuar treballant-hi a [Drive](./drive-node.md).
## Requisits

L'OCR invoca `tesseract` i `pdftoppm` de poppler, i la conversió de documents utilitza pandoc. Els tres s'inclouen amb totes les maneres d'executar Heym, incloent-hi `run.sh`, docker-compose i la imatge d'alliberament única, de manera que no cal configurar res. Els límits de pàgina, els temps d'espera i el DPI màxim són valors fixos de la plataforma, no paràmetres de configuració.

## Relacionat

- [Set](./set-node.md) – Transformeu i assigneu camps individuals
- [JSON output mapper](./json-output-mapper-node.md) – Construïu un objecte de resposta JSON
- [File upload trigger](./file-upload-trigger-node.md) – Accepteu un fitxer a Heym Drive
- [Drive](./drive-node.md) – Emmagatzemeu, recupereu i compartiu fitxers
- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Expression DSL](../reference/expression-dsl.md) – Funcions i sintaxi
