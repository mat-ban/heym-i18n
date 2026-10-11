# Converter

Il nodo **Converter** converte dati e file tra formati diversi senza scrivere codice. È neutrale rispetto alla tecnologia, così è possibile aggiungere nuovi formati nel tempo. Converte dati CSV, JSON e XML in entrambe le direzioni, esegue l'OCR Tesseract per estrarre testo da immagini e PDF e riscrive un file memorizzato in un altro formato.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.result` (dati analizzati per `csvToJson` / `xmlToJson`, testo per `jsonToCsv` / `jsonToXml`, testo estratto per `imageToText` / `pdfToText`, metadati del nuovo file per `fileConvert`) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `conversion` | string | `csvToJson` (testo CSV → array di oggetti riga), `jsonToCsv` (array di oggetti/righe → testo CSV), `xmlToJson` (testo XML → oggetto), `jsonToXml` (oggetto → testo XML), `imageToText` (OCR su un'immagine), `pdfToText` (OCR su ogni pagina PDF selezionata) oppure `fileConvert` (riscrive un file memorizzato in un altro formato) |
| `source` | expression | I dati da convertire. Lasciare vuoto per utilizzare il primo input del nodo |
| `delimiter` | string | Separatore di campo a carattere singolo (predefinito `,`) |
| `hasHeader` | boolean | Solo `csvToJson` — considera la prima riga come intestazione (predefinito `true`) |
| `trimValues` | boolean | Solo `csvToJson` — rimuove gli spazi attorno ai nomi delle intestazioni e ai valori delle celle (predefinito `true`) |
| `includeHeader` | boolean | Solo `jsonToCsv` — scrive una riga di intestazione (predefinito `true`) |
| `converterColumns` | string | Solo `jsonToCsv` — ordine opzionale delle colonne separato da virgole |
| `converterFileId` | expression | Conversioni di file — il file di Heym Drive da leggere, ad es. `$Upload.file.id` |
| `converterTargetFormat` | string | Solo `fileConvert` — formato di output (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Solo OCR — `auto` (predefinito), un codice Tesseract come `tur` oppure `custom` |
| `ocrLanguageCustom` | string | Solo OCR — codici lingua utilizzati quando `ocrLanguage` è `custom`, ad es. `eng+tur` |
| `ocrEncoding` | string | Solo OCR — charset a cui viene normalizzato il testo (predefinito `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Solo OCR — applica la normalizzazione NFC (predefinito `true`) |
| `ocrPsm` | string | Solo OCR — modalità di segmentazione pagina di Tesseract (predefinito `3`) |
| `ocrDpi` | number | Solo `pdfToText` — DPI di rasterizzazione della pagina (predefinito `300`) |
| `ocrPageRange` | expression | Solo `pdfToText` — `3` oppure `2-5`. Vuoto significa tutte le pagine |

## Comportamento

- **`csvToJson`** analizza il testo CSV di origine. Con `hasHeader: true` ogni riga diventa un oggetto con chiavi corrispondenti ai valori dell'intestazione; con `hasHeader: false` ogni riga diventa un array di valori di cella. I campi tra virgolette, i delimitatori incorporati e le interruzioni di riga incorporate vengono gestiti secondo RFC 4180. Un BOM UTF-8 iniziale (comune nelle esportazioni Excel) viene rimosso e i nomi di intestazione duplicati vengono resi univoci senza sovrascrivere una colonna reale (`a, a, a_2` → `a`, `a_3`, `a_2`). Impostare `delimiter` su `\t` per analizzare valori separati da tabulazioni.
- **`trimValues`** (predefinito `true`) rimuove gli spazi circostanti dai nomi delle intestazioni e dai valori delle celle, **anche all'interno dei campi tra virgolette** (`" padded "` → `padded`). L'RFC 4180 considera gli spazi tra virgolette come dati, quindi impostare `trimValues: false` per preservarli esattamente.
- **`jsonToCsv`** costruisce testo CSV da un array di oggetti (o array). L'ordine delle colonne viene preso da `converterColumns` quando fornito, altrimenti viene dedotto dalle chiavi del primo oggetto. I valori che contengono il delimitatore, virgolette o interruzioni di riga vengono racchiusi automaticamente tra virgolette.
- **`xmlToJson`** analizza l'XML in un oggetto. Gli attributi utilizzano il prefisso `@` e il testo misto ad attributi utilizza `#text`; gli elementi fratelli ripetuti diventano array. L'espansione delle entità XML è disabilitata.
- **`jsonToXml`** serializza un oggetto in un documento XML. L'oggetto deve avere esattamente una chiave di primo livello, che diventa l'elemento radice XML. Utilizzare la stessa convenzione `@attribute` e `#text` di `xmlToJson` per produrre attributi e testo insieme agli elementi figlio.
- **`imageToText`** esegue Tesseract su una singola immagine (PNG, JPEG, TIFF, WebP, BMP).
- **`pdfToText`** rasterizza ogni pagina selezionata a `ocrDpi` e la riconosce. Ogni pagina passa attraverso l'OCR, quindi un PDF digitale con un livello di testo perfettamente valido viene comunque riletto dai pixel. Ciò mantiene un comportamento identico tra documenti scansionati e digitali, al costo della velocità, quindi si consiglia di restringere `ocrPageRange` sui file lunghi.
- **`fileConvert`** riscrive il file di origine in un altro formato e memorizza il risultato come **nuovo** file di Drive. L'originale non viene mai modificato. I documenti passano attraverso pandoc, le immagini attraverso Pillow e la conversione da JSON a CSV attraverso il writer csv di Python. Un'immagine non può diventare un documento e un documento non può diventare un'immagine; per estrarre testo da un'immagine utilizzare `imageToText`.
## Ottenere il file in ingresso

Le conversioni dei file leggono da Heym Drive, non da un percorso o da un URL, pertanto il file deve essere prima memorizzato. Tre catene comuni:

- **[Trigger di caricamento file](./file-upload-trigger-node.md) → Converter** — impostare `converterFileId` su `$Upload.file.id`.
- **[Drive](./drive-node.md) (`downloadUrl`) → Converter** — recuperare un file remoto in Drive, quindi passare `$Download.id`.
- **[Agent](./agent-node.md) → Converter** — una skill che scrive un file lo espone come `$reportAgent._generated_files[0].id`.

`converterFileId` accetta anche un intero oggetto file (`$Upload.file`) o un URL di download Heym; l'id del file viene estratto da entrambi. Il file deve essere di proprietà dell'utente oppure condiviso da un collega.

## Lingue

`auto` (il valore predefinito) esegue prima il rilevamento dell'orientamento e dello script di Tesseract, quindi seleziona il modello installato migliore per lo script rilevato. I modelli di script come `Latin` o `Cyrillic` leggono ogni lingua scritta in quello script, motivo per cui auto gestisce una fattura turca e una inglese senza che venga indicato quale sia quale.

Specificare la lingua resta comunque più accurato quando la si conosce. Utilizzare un singolo codice (`tur`), oppure unirne diversi con `+` (`eng+tur`) per documenti misti — più lingue comportano un riconoscimento più lento e leggermente più rumoroso, pertanto è opportuno mantenere l'elenco breve. I codici funzionano solo quando i dati linguistici corrispondenti sono installati sul backend; il nodo elenca quelli disponibili quando se ne seleziona uno mancante.

Ogni immagine Heym include `osd`, inglese, turco, tedesco, francese, spagnolo, italiano, portoghese, olandese, russo, arabo, cinese semplificato, giapponese, coreano e i modelli di script Latin, Cyrillic, Arabic, HanS, Japanese e Hangul.

## Codifica

Il testo riconosciuto è UTF-8 e conserva ogni carattere prodotto da Tesseract. `ocrNormalizeUnicode` (attivo per impostazione predefinita) applica la normalizzazione NFC, pertanto una lettera scritta come `s` più una cedilla combinante diventa un singolo `ş` — è opportuno lasciarlo attivo, poiché le due forme non sono uguali nei confronti o nelle ricerche nel database.

`ocrEncoding` è rilevante solo quando un elemento a valle non è in grado di memorizzare l'intera gamma Unicode. Selezionando `cp1254` o `iso-8859-9` il testo turco rimane intatto garantendo al contempo che il risultato rientri in quel charset; `latin-1` e `ascii` sono più limitati e sostituiscono ciò che non possono rappresentare con `?`. Lasciare `utf-8` a meno che un sistema di destinazione non imponga diversamente.

## Output

`csvToJson`, `jsonToCsv`, `xmlToJson` e `jsonToXml` restituiscono `$label.result` e `$label.conversion`. Le conversioni OCR aggiungono:

| Campo | Descrizione |
|-------|-------------|
| `$label.result` | Il testo completo estratto, con le pagine unite da una riga vuota |
| `$label.language` | Il modello effettivamente eseguito (utile per vedere cosa ha scelto `auto`) |
| `$label.encoding` | Il charset a cui è stato normalizzato il testo |
| `$label.page_count` | Numero di pagine riconosciute |
| `$label.pages` | Array di `{ page, text }` per la gestione per pagina |
| `$label.file` | `{ id, filename, mime_type, size_bytes }` del file di origine |

`fileConvert` restituisce invece il nuovo file:

| Campo | Descrizione |
|-------|-------------|
| `$label.id` | UUID del file appena memorizzato |
| `$label.filename` | Nome file convertito, con il nome base mantenuto e l'estensione sostituita |
| `$label.mime_type` | Tipo MIME del nuovo file |
| `$label.size_bytes` | Dimensione del nuovo file |
| `$label.download_url` | URL di download Drive per il nuovo file |
| `$label.source_file` | Metadati del file convertito |

## Esempio

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

Per l'input `name,age\nAda,36`, i nodi a valle accedono alle righe analizzate tramite `$toRows.result` (`[{ "name": "Ada", "age": "36" }]`).

Conversione da XML a JSON:

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

Per `<person id="1"><name>Ada</name></person>`, `$xmlToObject.result` è `{ "person": { "@id": "1", "name": "Ada" } }`. Per creare XML, passare tale oggetto a un secondo nodo Converter con `conversion: "jsonToXml"`.

Lettura di una fattura scansionata caricata tramite un trigger di caricamento file:

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

Un nodo [Agent](./agent-node.md) o [LLM](./llm-node.md) a valle può quindi estrarre campi strutturati da `$readInvoice.result`.

Conversione del report markdown di un agent in PDF:

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

I nodi a valle leggono `$convertDoc.download_url` per condividere il PDF, oppure `$convertDoc.id` per continuare a lavorarci in [Drive](./drive-node.md).
## Requisiti

L'OCR si avvale di `tesseract` e di `pdftoppm` di poppler, mentre la conversione dei documenti utilizza pandoc. Tutti e tre sono inclusi in ogni modalità di esecuzione di Heym, compresi `run.sh`, docker-compose e l'immagine di release singola, pertanto non vi è nulla da configurare. I limiti di pagina, i timeout e il DPI massimo sono valori di piattaforma fissi e non impostazioni configurabili.

## Correlati

- [Set](./set-node.md) – Trasforma e mappa singoli campi
- [JSON output mapper](./json-output-mapper-node.md) – Costruisce un oggetto di risposta JSON
- [File upload trigger](./file-upload-trigger-node.md) – Accetta un file in Heym Drive
- [Drive](./drive-node.md) – Archivia, recupera e condivide file
- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Expression DSL](../reference/expression-dsl.md) – Funzioni e sintassi
