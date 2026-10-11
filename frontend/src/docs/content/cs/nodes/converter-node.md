# Converter

Uzel **Converter** převádí data a soubory mezi formáty bez nutnosti psát kód. Je technologicky neutrální, takže lze postupně přidávat další formáty. Převádí data ve formátech CSV, JSON a XML v obou směrech, spouští Tesseract OCR pro extrakci textu z obrázků a PDF a přepisuje uložený soubor do jiného formátu.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.result` (parsovaná data pro `csvToJson` / `xmlToJson`, text pro `jsonToCsv` / `jsonToXml`, extrahovaný text pro `imageToText` / `pdfToText`, metadata nového souboru pro `fileConvert`) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `conversion` | string | `csvToJson` (text CSV → pole objektů řádků), `jsonToCsv` (pole objektů/řádků → text CSV), `xmlToJson` (text XML → objekt), `jsonToXml` (objekt → text XML), `imageToText` (OCR obrázku), `pdfToText` (OCR každé vybrané stránky PDF) nebo `fileConvert` (přepis uloženého souboru do jiného formátu) |
| `source` | expression | Data k převodu. Ponechte prázdné pro použití prvního vstupu uzlu |
| `delimiter` | string | Jednoznakový oddělovač polí (výchozí `,`) |
| `hasHeader` | boolean | Pouze `csvToJson` — považovat první řádek za hlavičku (výchozí `true`) |
| `trimValues` | boolean | Pouze `csvToJson` — odstranit bílé znaky kolem názvů hlaviček a hodnot buněk (výchozí `true`) |
| `includeHeader` | boolean | Pouze `jsonToCsv` — zapsat řádek s hlavičkou (výchozí `true`) |
| `converterColumns` | string | Pouze `jsonToCsv` — volitelné pořadí sloupců oddělené čárkami |
| `converterFileId` | expression | Převody souborů — soubor v Heym Drive ke čtení, např. `$Upload.file.id` |
| `converterTargetFormat` | string | Pouze `fileConvert` — výstupní formát (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Pouze OCR — `auto` (výchozí), kód Tesseract, např. `tur`, nebo `custom` |
| `ocrLanguageCustom` | string | Pouze OCR — kódy jazyků použité, když je `ocrLanguage` nastaveno na `custom`, např. `eng+tur` |
| `ocrEncoding` | string | Pouze OCR — znaková sada, na kterou je text normalizován (výchozí `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Pouze OCR — použít normalizaci NFC (výchozí `true`) |
| `ocrPsm` | string | Pouze OCR — režim segmentace stránky Tesseract (výchozí `3`) |
| `ocrDpi` | number | Pouze `pdfToText` — DPI rasterizace stránky (výchozí `300`) |
| `ocrPageRange` | expression | Pouze `pdfToText` — `3` nebo `2-5`. Prázdné znamená všechny stránky |

## Chování

- **`csvToJson`** parsuje zdrojový text CSV. Při `hasHeader: true` se každý řádek stane objektem s klíči podle hodnot hlavičky; při `hasHeader: false` se každý řádek stane polem hodnot buněk. Uvozovkami ohraničená pole, vložené oddělovače a vložené znaky nového řádku jsou zpracovány podle RFC 4180. Počáteční UTF-8 BOM (běžný u exportů z Excelu) je odstraněn a duplicitní názvy hlaviček jsou zjednoznačněny bez přepsání skutečného sloupce (`a, a, a_2` → `a`, `a_3`, `a_2`). Pro parsování hodnot oddělených tabulátorem nastavte `delimiter` na `\t`.
- **`trimValues`** (výchozí `true`) odstraňuje okolní bílé znaky z názvů hlaviček a hodnot buněk, **včetně uvnitř polí ohraničených uvozovkami** (`" padded "` → `padded`). RFC 4180 považuje bílé znaky v uvozovkách za data, proto pro jejich přesné zachování nastavte `trimValues: false`.
- **`jsonToCsv`** sestavuje text CSV z pole objektů (nebo polí). Pořadí sloupců se přebírá z `converterColumns`, pokud je zadáno, jinak se odvodí z klíčů prvního objektu. Hodnoty obsahující oddělovač, uvozovky nebo znaky nového řádku jsou automaticky ohraničeny uvozovkami.
- **`xmlToJson`** parsuje XML do objektu. Atributy používají předponu `@` a text smíchaný s atributy používá `#text`; opakované sourozenecké elementy se stávají poli. Expanze XML entit je zakázána.
- **`jsonToXml`** serializuje objekt do dokumentu XML. Objekt musí mít právě jeden klíč nejvyšší úrovně, který se stane kořenovým elementem XML. Pro vytvoření atributů a textu vedle podřízených elementů použijte stejnou konvenci `@attribute` a `#text` jako u `xmlToJson`.
- **`imageToText`** spouští Tesseract nad jedním obrázkem (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizuje každou vybranou stránku při `ocrDpi` a rozpozná ji. Každá stránka prochází OCR, takže digitální PDF s dokonale funkční textovou vrstvou je přesto znovu načteno z pixelů. Díky tomu se naskenované a digitální dokumenty chovají identicky, ovšem na úkor rychlosti, proto u dlouhých souborů zúžte `ocrPageRange`.
- **`fileConvert`** přepisuje zdrojový soubor do jiného formátu a výsledek ukládá jako **nový** soubor v Drive. Originál není nikdy upraven. Dokumenty procházejí přes pandoc, obrázky přes Pillow a JSON do CSV přes zapisovač csv v Pythonu. Obrázek se nemůže stát dokumentem a dokument se nemůže stát obrázkem; pro čtení textu z obrázku použijte `imageToText`.

## Jak dostat soubor dovnitř

Převody souborů čtou z Heym Drive, nikoli z cesty nebo URL, takže soubor musí být nejprve uložen. Tři běžné řetězce:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — namiřte `converterFileId` na `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — načtěte vzdálený soubor do Drive a předejte `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — skill, který zapisuje soubor, jej zpřístupní jako `$reportAgent._generated_files[0].id`.

`converterFileId` také přijímá celý objekt souboru (`$Upload.file`) nebo URL pro stažení z Heym; id souboru je vytaženo z obojího. Soubor musí být váš nebo vám jej musí sdílet kolega.
## Jazyky

`auto` (výchozí hodnota) nejprve spustí detekci orientace a skriptu v Tesseractu a poté vybere nejlepší nainstalovaný model pro detekovaný skript. Skriptové modely jako `Latin` nebo `Cyrillic` čtou všechny jazyky psané daným skriptem, a proto `auto` zvládne tureckou i anglickou fakturu, aniž by bylo nutné určit, která je která.

Pokud jazyk znáte, je jeho uvedení stále přesnější. Použijte jeden kód (`tur`) nebo spojte několik kódů znakem `+` (`eng+tur`) pro smíšené dokumenty — více jazyků znamená pomalejší a mírně zašuměnější rozpoznávání, proto seznam udržujte krátký. Kódy fungují pouze tehdy, když jsou odpovídající jazyková data nainstalována na backendu; pokud zvolíte chybějící jazyk, uzel zobrazí seznam dostupných.

Každý image Heym obsahuje `osd`, angličtinu, turečtinu, němčinu, francouzštinu, španělštinu, italštinu, portugalštinu, nizozemštinu, ruštinu, arabštinu, zjednodušenou čínštinu, japonštinu, korejštinu a skriptové modely Latin, Cyrillic, Arabic, HanS, Japanese a Hangul.

## Kódování

Rozpoznaný text je v UTF-8 a zachovává každý znak, který Tesseract vytvořil. `ocrNormalizeUnicode` (ve výchozím stavu zapnuto) aplikuje normalizaci NFC, takže písmeno zapsané jako `s` plus kombinující cedilla se stane jediným `ş` — vyplatí se ponechat zapnuto, protože obě formy si nejsou rovny při porovnávání ani při vyhledávání v databázi.

`ocrEncoding` má význam pouze tehdy, když něco v navazujícím zpracování nedokáže uložit celý rozsah Unicode. Volba `cp1254` nebo `iso-8859-9` zachová turecký text neporušený a zároveň zaručí, že výsledek odpovídá dané znakové sadě; `latin-1` a `ascii` jsou užší a nahrazují to, co nedokážou reprezentovat, znakem `?`. Ponechte `utf-8`, pokud vás cílový systém nedonutí k jiné volbě.

## Výstup

`csvToJson`, `jsonToCsv`, `xmlToJson` a `jsonToXml` vracejí `$label.result` a `$label.conversion`. Konverze OCR přidávají:

| Pole | Popis |
|-------|-------------|
| `$label.result` | Celý extrahovaný text, stránky spojené prázdným řádkem |
| `$label.language` | Model, který skutečně proběhl (užitečné pro zjištění, co `auto` zvolilo) |
| `$label.encoding` | Znaková sada, na kterou byl text normalizován |
| `$label.page_count` | Počet rozpoznaných stránek |
| `$label.pages` | Pole `{ page, text }` pro zpracování po jednotlivých stránkách |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` zdrojového souboru |

`fileConvert` místo toho vrací nový soubor:

| Pole | Popis |
|-------|-------------|
| `$label.id` | UUID nově uloženého souboru |
| `$label.filename` | Název převedeného souboru, základní název zachován a přípona vyměněna |
| `$label.mime_type` | MIME typ nového souboru |
| `$label.size_bytes` | Velikost nového souboru |
| `$label.download_url` | URL pro stažení nového souboru z Drive |
| `$label.source_file` | Metadata souboru, který byl převeden |

## Příklad

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

Pro vstup `name,age\nAda,36` přistupují navazující uzly k parsovaným řádkům přes `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Převod XML na JSON:

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

Pro `<person id="1"><name>Ada</name></person>` je `$xmlToObject.result` roven `{ "person": { "@id": "1", "name": "Ada" } }`. Pro vytvoření XML předejte tento objekt druhému uzlu Converter s `conversion: "jsonToXml"`.

Čtení naskenované faktury nahrané přes trigger pro nahrání souboru:

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

Navazující uzel [Agent](./agent-node.md) nebo [LLM](./llm-node.md) pak může z `$readInvoice.result` vytáhnout strukturovaná pole.

Převod markdown reportu agenta na PDF:

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

Navazující uzly čtou `$convertDoc.download_url` pro sdílení PDF nebo `$convertDoc.id` pro další práci s ním v [Drive](./drive-node.md).

## Požadavky

OCR volá externě `tesseract` a `pdftoppm` z poppleru a konverze dokumentů používá pandoc. Všechny tři jsou součástí každého způsobu spuštění Heym, včetně `run.sh`, docker-compose a jediného release image, takže není co konfigurovat. Limity stránek, časové limity a maximální DPI jsou pevné hodnoty platformy, nikoli nastavení.

## Související

- [Set](./set-node.md) – Transformace a mapování jednotlivých polí
- [JSON output mapper](./json-output-mapper-node.md) – Sestavení objektu odpovědi JSON
- [File upload trigger](./file-upload-trigger-node.md) – Přijetí souboru do Heym Drive
- [Drive](./drive-node.md) – Ukládání, načítání a sdílení souborů
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Expression DSL](../reference/expression-dsl.md) – Funkce a syntaxe
