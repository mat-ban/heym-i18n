# Konverter

Der **Konverter**-Knoten konvertiert Daten und Dateien zwischen Formaten, ohne dass Code geschrieben werden muss. Er ist technologieneutral, sodass im Laufe der Zeit weitere Formate hinzugefügt werden können. Er konvertiert CSV-, JSON- und XML-Daten in beide Richtungen, führt Tesseract OCR aus, um Text aus Bildern und PDFs zu extrahieren, und schreibt eine gespeicherte Datei in einem anderen Format neu.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.result` (geparste Daten für `csvToJson` / `xmlToJson`, Text für `jsonToCsv` / `jsonToXml`, extrahierter Text für `imageToText` / `pdfToText`, neue Datei-Metadaten für `fileConvert`) |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knoten-Bezeichner (camelCase) |
| `conversion` | string | `csvToJson` (CSV-Text → Array von Zeilenobjekten), `jsonToCsv` (Array von Objekten/Zeilen → CSV-Text), `xmlToJson` (XML-Text → Objekt), `jsonToXml` (Objekt → XML-Text), `imageToText` (OCR eines Bildes), `pdfToText` (OCR jeder ausgewählten PDF-Seite) oder `fileConvert` (eine gespeicherte Datei in einem anderen Format neu schreiben) |
| `source` | expression | Die zu konvertierenden Daten. Leer lassen, um die erste Eingabe des Knotens zu verwenden |
| `delimiter` | string | Einzelzeichen-Feldtrenner (Standard `,`) |
| `hasHeader` | boolean | Nur `csvToJson` — die erste Zeile als Kopfzeile behandeln (Standard `true`) |
| `trimValues` | boolean | Nur `csvToJson` — Leerzeichen um Kopfzeilennamen und Zellwerte entfernen (Standard `true`) |
| `includeHeader` | boolean | Nur `jsonToCsv` — eine Kopfzeile schreiben (Standard `true`) |
| `converterColumns` | string | Nur `jsonToCsv` — optionale kommagetrennte Spaltenreihenfolge |
| `converterFileId` | expression | Dateikonvertierungen — die zu lesende Heym Drive-Datei, z. B. `$Upload.file.id` |
| `converterTargetFormat` | string | Nur `fileConvert` — Ausgabeformat (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Nur OCR — `auto` (Standard), ein Tesseract-Code wie `tur` oder `custom` |
| `ocrLanguageCustom` | string | Nur OCR — Sprachcodes, die verwendet werden, wenn `ocrLanguage` auf `custom` gesetzt ist, z. B. `eng+tur` |
| `ocrEncoding` | string | Nur OCR — Zeichensatz, auf den der Text normalisiert wird (Standard `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Nur OCR — NFC-Normalisierung anwenden (Standard `true`) |
| `ocrPsm` | string | Nur OCR — Tesseract-Seitensegmentierungsmodus (Standard `3`) |
| `ocrDpi` | number | Nur `pdfToText` — DPI für die Seitenrasterung (Standard `300`) |
| `ocrPageRange` | expression | Nur `pdfToText` — `3` oder `2-5`. Leer bedeutet jede Seite |

## Verhalten

- **`csvToJson`** parst den CSV-Quelltext. Mit `hasHeader: true` wird jede Zeile zu einem Objekt, das über die Kopfzeilenwerte verschlüsselt ist; mit `hasHeader: false` wird jede Zeile zu einem Array von Zellwerten. In Anführungszeichen gesetzte Felder, eingebettete Trennzeichen und eingebettete Zeilenumbrüche werden gemäß RFC 4180 behandelt. Eine führende UTF-8-BOM (häufig bei Excel-Exporten) wird entfernt, und doppelte Kopfzeilennamen werden eindeutig gemacht, ohne eine echte Spalte zu überschreiben (`a, a, a_2` → `a`, `a_3`, `a_2`). Setze `delimiter` auf `\t`, um tabgetrennte Werte zu parsen.
- **`trimValues`** (Standard `true`) entfernt umgebende Leerzeichen aus Kopfzeilennamen und Zellwerten, **einschließlich innerhalb von Feldern in Anführungszeichen** (`" padded "` → `padded`). RFC 4180 behandelt Leerzeichen in Anführungszeichen als Daten, daher sollte `trimValues: false` gesetzt werden, um sie exakt zu erhalten.
- **`jsonToCsv`** erstellt CSV-Text aus einem Array von Objekten (oder Arrays). Die Spaltenreihenfolge wird aus `converterColumns` übernommen, sofern angegeben, andernfalls aus den Schlüsseln des ersten Objekts abgeleitet. Werte, die das Trennzeichen, Anführungszeichen oder Zeilenumbrüche enthalten, werden automatisch in Anführungszeichen gesetzt.
- **`xmlToJson`** parst XML in ein Objekt. Attribute verwenden `@`-Präfixe, und Text gemischt mit Attributen verwendet `#text`; wiederholte Geschwisterelemente werden zu Arrays. Die XML-Entitätsexpansion ist deaktiviert.
- **`jsonToXml`** serialisiert ein Objekt in ein XML-Dokument. Das Objekt muss genau einen Schlüssel auf oberster Ebene haben, der zum XML-Wurzelelement wird. Verwende dieselbe `@attribute`- und `#text`-Konvention wie bei `xmlToJson`, um Attribute und Text neben untergeordneten Elementen zu erzeugen.
- **`imageToText`** führt Tesseract über ein einzelnes Bild aus (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rastert jede ausgewählte Seite mit `ocrDpi` und erkennt sie. Jede Seite durchläuft OCR, sodass ein digitales PDF mit einer einwandfreien Textebene dennoch aus Pixeln neu eingelesen wird. Dadurch verhalten sich gescannte und digitale Dokumente identisch, auf Kosten der Geschwindigkeit, daher sollte bei langen Dateien `ocrPageRange` eingeschränkt werden.
- **`fileConvert`** schreibt die Quelldatei in einem anderen Format neu und speichert das Ergebnis als **neue** Drive-Datei. Das Original wird niemals verändert. Dokumente durchlaufen pandoc, Bilder Pillow und JSON zu CSV den Python-csv-Writer. Ein Bild kann kein Dokument werden und ein Dokument kein Bild; um Text aus einem Bild auszulesen, verwende `imageToText`.

## Die Datei hineinbekommen

Dateikonvertierungen lesen aus Heym Drive, nicht aus einem Pfad oder einer URL, daher muss die Datei zuerst gespeichert werden. Drei gängige Ketten:

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — richte `converterFileId` auf `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — hole eine entfernte Datei in Drive und übergib dann `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — ein Skill, der eine Datei schreibt, stellt sie als `$reportAgent._generated_files[0].id` bereit.

`converterFileId` akzeptiert auch ein ganzes Dateiobjekt (`$Upload.file`) oder eine Heym-Download-URL; die Datei-ID wird aus beidem herausgezogen. Die Datei muss eine sein, die dir gehört oder die ein Teammitglied mit dir geteilt hat.
## Sprachen

`auto` (der Standard) führt zuerst die Orientierungs- und Schrifterkennung von Tesseract aus und wählt dann das beste installierte Modell für die erkannte Schrift aus. Schriftmodelle wie `Latin` oder `Cyrillic` lesen jede Sprache, die in dieser Schrift geschrieben wird, weshalb auto sowohl eine türkische als auch eine englische Rechnung verarbeitet, ohne dass ihm gesagt werden muss, welche welche ist.

Die Sprache dennoch zu benennen, ist genauer, wenn man sie kennt. Verwende einen einzelnen Code (`tur`) oder verbinde mehrere mit `+` (`eng+tur`) für gemischte Dokumente — mehr Sprachen bedeuten langsamere und etwas ungenauere Erkennung, halte die Liste also kurz. Codes funktionieren nur, wenn die passenden Sprachdaten auf dem Backend installiert sind; der Knoten listet auf, was verfügbar ist, wenn du eine fehlende auswählst.

Jedes Heym-Image enthält `osd`, Englisch, Türkisch, Deutsch, Französisch, Spanisch, Italienisch, Portugiesisch, Niederländisch, Russisch, Arabisch, vereinfachtes Chinesisch, Japanisch, Koreanisch sowie die Schriftmodelle Latin, Cyrillic, Arabic, HanS, Japanese und Hangul.

## Kodierung

Erkannter Text ist UTF-8 und behält jedes Zeichen, das Tesseract erzeugt hat. `ocrNormalizeUnicode` (standardmäßig aktiviert) wendet die NFC-Normalisierung an, sodass ein Buchstabe, der als `s` plus kombinierende Cedilla geschrieben wird, zu einem einzelnen `ş` wird — es lohnt sich, dies aktiviert zu lassen, da die beiden Formen bei Vergleichen oder Datenbankabfragen nicht gleich sind.

`ocrEncoding` ist nur dann von Bedeutung, wenn etwas nachgelagert nicht den vollen Unicode-Bereich speichern kann. Die Wahl von `cp1254` oder `iso-8859-9` hält türkischen Text intakt und garantiert gleichzeitig, dass das Ergebnis in diesen Zeichensatz passt; `latin-1` und `ascii` sind enger und ersetzen, was sie nicht darstellen können, durch `?`. Lass es bei `utf-8`, es sei denn, ein Zielsystem zwingt dich dazu.

## Ausgabe

`csvToJson`, `jsonToCsv`, `xmlToJson` und `jsonToXml` geben `$label.result` und `$label.conversion` zurück. OCR-Konvertierungen fügen hinzu:

| Feld | Beschreibung |
|-------|-------------|
| `$label.result` | Der vollständige extrahierte Text, Seiten durch eine Leerzeile getrennt |
| `$label.language` | Das Modell, das tatsächlich ausgeführt wurde (nützlich, um zu sehen, was `auto` gewählt hat) |
| `$label.encoding` | Der Zeichensatz, auf den der Text normalisiert wurde |
| `$label.page_count` | Anzahl der erkannten Seiten |
| `$label.pages` | Array von `{ page, text }` für die seitenweise Verarbeitung |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` der Quelldatei |

`fileConvert` gibt stattdessen die neue Datei zurück:

| Feld | Beschreibung |
|-------|-------------|
| `$label.id` | UUID der neu gespeicherten Datei |
| `$label.filename` | Konvertierter Dateiname, Basisname beibehalten und Erweiterung ausgetauscht |
| `$label.mime_type` | MIME-Typ der neuen Datei |
| `$label.size_bytes` | Größe der neuen Datei |
| `$label.download_url` | Drive-Download-URL für die neue Datei |
| `$label.source_file` | Metadaten der Datei, die konvertiert wurde |

## Beispiel

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

Für die Eingabe `name,age\nAda,36` greifen nachgelagerte Knoten über `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`) auf die geparsten Zeilen zu.

XML in JSON konvertieren:

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

Für `<person id="1"><name>Ada</name></person>` ist `$xmlToObject.result` gleich `{ "person": { "@id": "1", "name": "Ada" } }`. Um XML zu erzeugen, übergib dieses Objekt an einen zweiten Converter-Knoten mit `conversion: "jsonToXml"`.

Eine gescannte Rechnung lesen, die über einen File-Upload-Trigger hochgeladen wurde:

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

Ein nachgelagerter [Agent](./agent-node.md)- oder [LLM](./llm-node.md)-Knoten kann dann strukturierte Felder aus `$readInvoice.result` herausziehen.

Den Markdown-Bericht eines Agenten in ein PDF umwandeln:

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

Nachgelagerte Knoten lesen `$convertDoc.download_url`, um das PDF zu teilen, oder `$convertDoc.id`, um in [Drive](./drive-node.md) damit weiterzuarbeiten.

## Voraussetzungen

OCR ruft `tesseract` und popplers `pdftoppm` über die Shell auf, und die Dokumentkonvertierung verwendet pandoc. Alle drei sind in jeder Art enthalten, Heym auszuführen, einschließlich `run.sh`, docker-compose und dem einzelnen Release-Image, sodass nichts zu konfigurieren ist. Seitenlimits, Timeouts und die maximale DPI sind feste Plattformwerte und keine Einstellungen.

## Verwandte Themen

- [Set](./set-node.md) – Einzelne Felder transformieren und zuordnen
- [JSON output mapper](./json-output-mapper-node.md) – Ein JSON-Antwortobjekt erstellen
- [File upload trigger](./file-upload-trigger-node.md) – Eine Datei in Heym Drive aufnehmen
- [Drive](./drive-node.md) – Dateien speichern, abrufen und teilen
- [Knotentypen](../reference/node-types.md) – Überblick über alle Knotentypen
- [Ausdrucks-DSL](../reference/expression-dsl.md) – Funktionen und Syntax
