# Converter

Uzol **Converter** konvertuje dáta a súbory medzi formátmi bez potreby písať kód. Je technologicky neutrálny, takže v priebehu času možno pridávať ďalšie formáty. Konvertuje dáta CSV, JSON a XML v oboch smeroch, spúšťa Tesseract OCR na extrakciu textu z obrázkov a PDF a prepisuje uložený súbor do iného formátu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.result` (parsované dáta pre `csvToJson` / `xmlToJson`, text pre `jsonToCsv` / `jsonToXml`, extrahovaný text pre `imageToText` / `pdfToText`, metadáta nového súboru pre `fileConvert`) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `conversion` | string | `csvToJson` (text CSV → pole objektov riadkov), `jsonToCsv` (pole objektov/riadkov → text CSV), `xmlToJson` (text XML → objekt), `jsonToXml` (objekt → text XML), `imageToText` (OCR obrázka), `pdfToText` (OCR každej vybranej stránky PDF) alebo `fileConvert` (prepis uloženého súboru do iného formátu) |
| `source` | expression | Dáta na konverziu. Ponechajte prázdne, ak chcete použiť prvý vstup uzla |
| `delimiter` | string | Jednoznakový oddeľovač polí (predvolené `,`) |
| `hasHeader` | boolean | Iba `csvToJson` — považovať prvý riadok za hlavičku (predvolené `true`) |
| `trimValues` | boolean | Iba `csvToJson` — odstrániť biele znaky okolo názvov hlavičiek a hodnôt buniek (predvolené `true`) |
| `includeHeader` | boolean | Iba `jsonToCsv` — zapísať riadok hlavičky (predvolené `true`) |
| `converterColumns` | string | Iba `jsonToCsv` — voliteľné poradie stĺpcov oddelené čiarkou |
| `converterFileId` | expression | Konverzie súborov — súbor v Heym Drive na čítanie, napr. `$Upload.file.id` |
| `converterTargetFormat` | string | Iba `fileConvert` — výstupný formát (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Iba OCR — `auto` (predvolené), kód Tesseract, napr. `tur`, alebo `custom` |
| `ocrLanguageCustom` | string | Iba OCR — kódy jazykov použité, keď je `ocrLanguage` nastavené na `custom`, napr. `eng+tur` |
| `ocrEncoding` | string | Iba OCR — znaková sada, na ktorú sa text normalizuje (predvolené `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Iba OCR — použiť normalizáciu NFC (predvolené `true`) |
| `ocrPsm` | string | Iba OCR — režim segmentácie stránky Tesseract (predvolené `3`) |
| `ocrDpi` | number | Iba `pdfToText` — DPI rasterizácie stránky (predvolené `300`) |
| `ocrPageRange` | expression | Iba `pdfToText` — `3` alebo `2-5`. Prázdne znamená každú stránku |

## Správanie

- **`csvToJson`** parsuje zdrojový text CSV. Pri `hasHeader: true` sa každý riadok stane objektom s kľúčmi podľa hodnôt hlavičky; pri `hasHeader: false` sa každý riadok stane poľom hodnôt buniek. Polia v úvodzovkách, vložené oddeľovače a vložené nové riadky sa spracúvajú podľa RFC 4180. Počiatočný UTF-8 BOM (bežný pri exportoch z Excelu) sa odstráni a duplicitné názvy hlavičiek sa zjednotia bez prepísania skutočného stĺpca (`a, a, a_2` → `a`, `a_3`, `a_2`). Nastavte `delimiter` na `\t` na parsovanie hodnôt oddelených tabulátorom.
- **`trimValues`** (predvolené `true`) odstraňuje okolité biele znaky z názvov hlavičiek a hodnôt buniek, **vrátane polí v úvodzovkách** (`" padded "` → `padded`). RFC 4180 považuje biele znaky v úvodzovkách za dáta, preto nastavte `trimValues: false`, ak ich chcete zachovať presne.
- **`jsonToCsv`** vytvára text CSV z poľa objektov (alebo polí). Poradie stĺpcov sa prevezme z `converterColumns`, ak je zadané, inak sa odvodí z kľúčov prvého objektu. Hodnoty obsahujúce oddeľovač, úvodzovky alebo nové riadky sa automaticky uzatvoria do úvodzoviek.
- **`xmlToJson`** parsuje XML do objektu. Atribúty používajú predponu `@` a text zmiešaný s atribútmi používa `#text`; opakujúce sa súrodené elementy sa stanú poľami. Rozširovanie XML entít je zakázané.
- **`jsonToXml`** serializuje objekt do dokumentu XML. Objekt musí mať práve jeden kľúč najvyššej úrovne, ktorý sa stane koreňovým elementom XML. Použite rovnakú konvenciu `@attribute` a `#text` ako pri `xmlToJson` na vytvorenie atribútov a textu popri podradených elementoch.
- **`imageToText`** spúšťa Tesseract na jednom obrázku (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizuje každú vybranú stránku pri `ocrDpi` a rozpozná ju. Každá stránka prechádza OCR, takže digitálne PDF s dokonale čitateľnou textovou vrstvou sa aj tak znovu načíta z pixelov. Vďaka tomu sa naskenované a digitálne dokumenty správajú rovnako, na úkor rýchlosti, preto pri dlhých súboroch zúžte `ocrPageRange`.
- **`fileConvert`** prepisuje zdrojový súbor do iného formátu a výsledok uloží ako **nový** súbor v Drive. Originál sa nikdy neupravuje. Dokumenty prechádzajú cez pandoc, obrázky cez Pillow a JSON na CSV cez Python csv writer. Obrázok sa nemôže stať dokumentom a dokument sa nemôže stať obrázkom; na čítanie textu z obrázka použite `imageToText`.

## Ako dostať súbor dnu

Konverzie súborov čítajú z Heym Drive, nie z cesty alebo URL, takže súbor musí byť najprv uložený. Tri bežné reťazce:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — nasmerujte `converterFileId` na `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — načítajte vzdialený súbor do Drive a potom odovzdajte `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — skill, ktorý zapisuje súbor, ho sprístupní ako `$reportAgent._generated_files[0].id`.

`converterFileId` tiež akceptuje celý objekt súboru (`$Upload.file`) alebo URL na stiahnutie z Heym; id súboru sa vytiahne z oboch. Súbor musí byť buď vo Vašom vlastníctve, alebo Vám ho musí zdieľať kolega.
## Jazyky

`auto` (predvolené nastavenie) najprv spustí Tesseract detekciu orientácie a písma a potom vyberie najlepší nainštalovaný model pre detekované písmo. Modely písma, ako napríklad `Latin` alebo `Cyrillic`, čítajú všetky jazyky písané daným písmom, a preto `auto` zvládne tureckú aj anglickú faktúru bez toho, aby ste museli určiť, ktorá je ktorá.

Ak jazyk poznáte, jeho uvedenie je stále presnejšie. Použite jeden kód (`tur`) alebo spojte niekoľko kódov znakom `+` (`eng+tur`) pre zmiešané dokumenty — viac jazykov znamená pomalšie a mierne nepresnejšie rozpoznávanie, preto zoznam udržujte krátky. Kódy fungujú len vtedy, ak sú príslušné jazykové dáta nainštalované na backende; uzol zobrazí, čo je dostupné, keď vyberiete chýbajúci kód.

Každý obraz Heym obsahuje `osd`, angličtinu, turečtinu, nemčinu, francúzštinu, španielčinu, taliančinu, portugalčinu, holandčinu, ruštinu, arabčinu, zjednodušenú čínštinu, japončinu, kórejčinu a modely písma Latin, Cyrillic, Arabic, HanS, Japanese a Hangul.

## Kódovanie

Rozpoznaný text je v UTF-8 a zachováva každý znak, ktorý Tesseract vytvoril. `ocrNormalizeUnicode` (predvolene zapnuté) aplikuje normalizáciu NFC, takže písmeno zapísané ako `s` plus kombinujúca cedilla sa zmení na jediné `ş` — oplatí sa to nechať zapnuté, pretože tieto dve formy nie sú rovnaké pri porovnávaniach ani vyhľadávaní v databáze.

`ocrEncoding` je dôležité len vtedy, keď niečo v nadväznom spracovaní nedokáže uložiť celý rozsah Unicode. Výber `cp1254` alebo `iso-8859-9` zachová turecký text nedotknutý a zároveň zaručí, že výsledok sa zmestí do danej znakovej sady; `latin-1` a `ascii` sú užšie a to, čo nedokážu reprezentovať, nahradia znakom `?`. Nechajte `utf-8`, pokiaľ vás cieľový systém nedonúti k inému.

## Výstup

`csvToJson`, `jsonToCsv`, `xmlToJson` a `jsonToXml` vracajú `$label.result` a `$label.conversion`. OCR konverzie pridávajú:

| Pole | Popis |
|-------|-------------|
| `$label.result` | Celý extrahovaný text, strany spojené prázdnym riadkom |
| `$label.language` | Model, ktorý sa skutočne použil (užitočné na zistenie, čo `auto` vybralo) |
| `$label.encoding` | Znaková sada, na ktorú bol text normalizovaný |
| `$label.page_count` | Počet rozpoznaných strán |
| `$label.pages` | Pole `{ page, text }` pre spracovanie po jednotlivých stranách |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` zdrojového súboru |

`fileConvert` namiesto toho vracia nový súbor:

| Pole | Popis |
|-------|-------------|
| `$label.id` | UUID novo uloženého súboru |
| `$label.filename` | Názov konvertovaného súboru, základný názov zachovaný a prípona vymenená |
| `$label.mime_type` | MIME typ nového súboru |
| `$label.size_bytes` | Veľkosť nového súboru |
| `$label.download_url` | URL na stiahnutie nového súboru z Drive |
| `$label.source_file` | Metadáta konvertovaného súboru |

## Príklad

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

Pre vstup `name,age\nAda,36` nadväzné uzly pristupujú k naparsovaným riadkom cez `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Konverzia XML na JSON:

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

Pre `<person id="1"><name>Ada</name></person>` je `$xmlToObject.result` rovné `{ "person": { "@id": "1", "name": "Ada" } }`. Na vytvorenie XML odovzdajte tento objekt druhému uzlu Converter s `conversion: "jsonToXml"`.

Čítanie naskenovanej faktúry nahranej cez trigger na nahrávanie súborov:

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

Nadväzný uzol [Agent](./agent-node.md) alebo [LLM](./llm-node.md) potom môže vytiahnuť štruktúrované polia z `$readInvoice.result`.

Prevod markdown reportu agenta na PDF:

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

Nadväzné uzly čítajú `$convertDoc.download_url` na zdieľanie PDF alebo `$convertDoc.id` na ďalšiu prácu s ním v [Drive](./drive-node.md).

## Požiadavky

OCR volá `tesseract` a `pdftoppm` z poppleru a konverzia dokumentov používa pandoc. Všetky tri sú súčasťou každého spôsobu spustenia Heym, vrátane `run.sh`, docker-compose a jediného release obrazu, takže nie je potrebné nič konfigurovať. Limity strán, časové limity a maximálne DPI sú pevné hodnoty platformy, nie nastavenia.

## Súvisiace

- [Set](./set-node.md) – Transformácia a mapovanie jednotlivých polí
- [JSON output mapper](./json-output-mapper-node.md) – Vytvorenie objektu JSON odpovede
- [File upload trigger](./file-upload-trigger-node.md) – Prijatie súboru do Heym Drive
- [Drive](./drive-node.md) – Ukladanie, načítavanie a zdieľanie súborov
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Expression DSL](../reference/expression-dsl.md) – Funkcie a syntax
