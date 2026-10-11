# 轉換器

**Converter** 節點可在無需撰寫程式碼的情況下，於各種格式之間轉換資料與檔案。此節點與技術無關，因此未來可持續新增更多格式。它可雙向轉換 CSV、JSON 與 XML 資料、執行 Tesseract OCR 以從圖片與 PDF 擷取文字，並將已儲存的檔案改寫為另一種格式。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.result`（`csvToJson` / `xmlToJson` 為解析後的資料，`jsonToCsv` / `jsonToXml` 為文字，`imageToText` / `pdfToText` 為擷取出的文字，`fileConvert` 為新檔案的中繼資料） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `label` | string | 節點識別碼（camelCase） |
| `conversion` | string | `csvToJson`（CSV 文字 → 列物件陣列）、`jsonToCsv`（物件／列陣列 → CSV 文字）、`xmlToJson`（XML 文字 → 物件）、`jsonToXml`（物件 → XML 文字）、`imageToText`（對圖片執行 OCR）、`pdfToText`（對每個選取的 PDF 頁面執行 OCR），或 `fileConvert`（將已儲存的檔案改寫為另一種格式） |
| `source` | expression | 要轉換的資料。留空則使用節點的第一個輸入 |
| `delimiter` | string | 單一字元欄位分隔符號（預設為 `,`） |
| `hasHeader` | boolean | 僅限 `csvToJson` — 將第一列視為標頭（預設為 `true`） |
| `trimValues` | boolean | 僅限 `csvToJson` — 去除標頭名稱與儲存格值前後的空白（預設為 `true`） |
| `includeHeader` | boolean | 僅限 `jsonToCsv` — 寫入標頭列（預設為 `true`） |
| `converterColumns` | string | 僅限 `jsonToCsv` — 選用的逗號分隔欄位順序 |
| `converterFileId` | expression | 檔案轉換 — 要讀取的 Heym Drive 檔案，例如 `$Upload.file.id` |
| `converterTargetFormat` | string | 僅限 `fileConvert` — 輸出格式（`pdf`、`docx`、`html`、`md`、`txt`、`csv`、`epub`、`jpg`、`png`、`bmp`、`webp`） |
| `ocrLanguage` | string | 僅限 OCR — `auto`（預設）、Tesseract 代碼（例如 `tur`），或 `custom` |
| `ocrLanguageCustom` | string | 僅限 OCR — 當 `ocrLanguage` 為 `custom` 時所使用的語言代碼，例如 `eng+tur` |
| `ocrEncoding` | string | 僅限 OCR — 文字正規化後的字符集（預設為 `utf-8`） |
| `ocrNormalizeUnicode` | boolean | 僅限 OCR — 套用 NFC 正規化（預設為 `true`） |
| `ocrPsm` | string | 僅限 OCR — Tesseract 頁面分割模式（預設為 `3`） |
| `ocrDpi` | number | 僅限 `pdfToText` — 頁面點陣化的 DPI（預設為 `300`） |
| `ocrPageRange` | expression | 僅限 `pdfToText` — `3` 或 `2-5`。留空表示每一頁 |

## 行為

- **`csvToJson`** 會解析來源 CSV 文字。當 `hasHeader: true` 時，每一列會成為以標頭值為鍵的物件；當 `hasHeader: false` 時，每一列會成為儲存格值的陣列。帶引號的欄位、內嵌分隔符號與內嵌換行會依 RFC 4180 處理。開頭的 UTF-8 BOM（常見於 Excel 匯出檔）會被去除，重複的標頭名稱會在不覆寫真實欄位的情況下使其唯一（`a, a, a_2` → `a`、`a_3`、`a_2`）。將 `delimiter` 設為 `\t` 即可解析以 Tab 分隔的值。
- **`trimValues`**（預設為 `true`）會去除標頭名稱與儲存格值前後的空白，**包括帶引號欄位內部的空白**（`" padded "` → `padded`）。RFC 4180 會將帶引號的空白視為資料，因此請設定 `trimValues: false` 以完整保留。
- **`jsonToCsv`** 會從物件（或陣列）陣列建構 CSV 文字。若有提供 `converterColumns`，欄位順序會取自該參數，否則會從第一個物件的鍵推斷。包含分隔符號、引號或換行的值會自動加上引號。
- **`xmlToJson`** 會將 XML 解析為物件。屬性使用 `@` 前綴，與屬性混合的文字使用 `#text`；重複的同層元素會成為陣列。XML 實體展開功能已停用。
- **`jsonToXml`** 會將物件序列化為 XML 文件。該物件必須恰好有一個最上層鍵，該鍵會成為 XML 根元素。使用與 `xmlToJson` 相同的 `@attribute` 與 `#text` 慣例，即可在子元素旁產生屬性與文字。
- **`imageToText`** 會對單一圖片（PNG、JPEG、TIFF、WebP、BMP）執行 Tesseract。
- **`pdfToText`** 會以 `ocrDpi` 將每個選取的頁面點陣化並進行辨識。每一頁都會經過 OCR，因此即使數位 PDF 擁有完好的文字層，仍會從像素重新讀取。這可讓掃描文件與數位文件的行為一致，代價是速度，因此對於長檔案請縮小 `ocrPageRange`。
- **`fileConvert`** 會將來源檔案改寫為另一種格式，並將結果儲存為**新的** Drive 檔案。原始檔案絕不會被修改。文件會經過 pandoc 處理，圖片會經過 Pillow 處理，JSON 轉 CSV 則會經過 Python csv writer 處理。圖片無法變成文件，文件也無法變成圖片；若要從圖片讀取文字，請使用 `imageToText`。

## 取得檔案輸入

檔案轉換會從 Heym Drive 讀取，而非從路徑或 URL，因此檔案必須先被儲存。三種常見的鏈結：

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — 將 `converterFileId` 指向 `$Upload.file.id`。
- **[Drive](./drive-node.md)（`downloadUrl`）→ Converter** — 將遠端檔案擷取至 Drive，然後傳入 `$Download.id`。
- **[Agent](./agent-node.md) → Converter** — 寫入檔案的 skill 會將其公開為 `$reportAgent._generated_files[0].id`。

`converterFileId` 也接受整個檔案物件（`$Upload.file`）或 Heym 下載 URL；檔案 id 會從兩者中擷取出來。該檔案必須是你擁有的檔案，或是隊友與你共用的檔案。
## 語言

`auto`（預設值）會先執行 Tesseract 的朝向與文字系統偵測，接著針對偵測到的文字系統挑選最合適的已安裝模型。諸如 `Latin` 或 `Cyrillic` 這類文字系統模型可讀取以該文字系統書寫的所有語言，這正是 auto 無需事先告知即可處理土耳其文發票與英文發票的原因。

當你確知語言時，明確指定語言仍更為準確。使用單一語言代碼（`tur`），或以 `+` 串接多個代碼（`eng+tur`）以處理混合語言文件——語言越多代表辨識越慢且略為雜訊，因此請保持清單精簡。語言代碼僅在後端已安裝對應語言資料時才能運作；當你選擇了尚未安裝的語言時，節點會列出目前可用的項目。

每個 Heym 映像檔均隨附 `osd`、英文、土耳其文、德文、法文、西班牙文、義大利文、葡萄牙文、荷蘭文、俄文、阿拉伯文、簡體中文、日文、韓文，以及 Latin、Cyrillic、Arabic、HanS、Japanese 與 Hangul 文字系統模型。

## 編碼

辨識出的文字為 UTF-8，並保留 Tesseract 產生的每一個字元。`ocrNormalizeUnicode`（預設為開啟）會套用 NFC 正規化，因此以 `s` 加上組合式下加符書寫的字母會變成單一的 `ş`——建議保持開啟，因為這兩種形式在比較或資料庫查詢中並不相等。

`ocrEncoding` 僅在下游系統無法儲存完整 Unicode 範圍時才重要。選擇 `cp1254` 或 `iso-8859-9` 可保持土耳其文完整，同時確保結果符合該字元集；`latin-1` 與 `ascii` 範圍較窄，會將無法表示的字元替換為 `?`。除非目標系統強制要求，否則請保持 `utf-8`。

## 輸出

`csvToJson`、`jsonToCsv`、`xmlToJson` 與 `jsonToXml` 會回傳 `$label.result` 與 `$label.conversion`。OCR 轉換額外提供：

| 欄位 | 說明 |
|-------|-------------|
| `$label.result` | 完整擷取的文字，各頁以空行分隔 |
| `$label.language` | 實際執行的模型（可用於查看 `auto` 選擇了什麼） |
| `$label.encoding` | 文字正規化後的字元集 |
| `$label.page_count` | 辨識的頁數 |
| `$label.pages` | `{ page, text }` 陣列，用於逐頁處理 |
| `$label.file` | 來源檔案的 `{ id, filename, mime_type, size_bytes }` |

`fileConvert` 則回傳新檔案：

| 欄位 | 說明 |
|-------|-------------|
| `$label.id` | 新儲存檔案的 UUID |
| `$label.filename` | 轉換後的檔名，保留主檔名並替換副檔名 |
| `$label.mime_type` | 新檔案的 MIME 類型 |
| `$label.size_bytes` | 新檔案的大小 |
| `$label.download_url` | 新檔案的 Drive 下載 URL |
| `$label.source_file` | 被轉換檔案的中繼資料 |

## 範例

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

對於輸入 `name,age\nAda,36`，下游節點可透過 `$toRows.result`（`[{ "name": "Ada", "age": "36" }]`）存取解析後的分列資料。

將 XML 轉換為 JSON：

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

對於 `<person id="1"><name>Ada</name></person>`，`$xmlToObject.result` 為 `{ "person": { "@id": "1", "name": "Ada" } }`。若要建立 XML，請將該物件傳遞給第二個 Converter 節點，並設定 `conversion: "jsonToXml"`。

讀取透過檔案上傳 Trigger 上傳的掃描發票：

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

下游的 [Agent](./agent-node.md) 或 [LLM](./llm-node.md) 節點接著便可從 `$readInvoice.result` 擷取結構化欄位。

將 Agent 的 markdown 報告轉換為 PDF：

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

下游節點可讀取 `$convertDoc.download_url` 以分享 PDF，或讀取 `$convertDoc.id` 以在 [Drive](./drive-node.md) 中繼續使用該檔案。

## 需求

OCR 會呼叫外部的 `tesseract` 與 poppler 的 `pdftoppm`，而文件轉換則使用 pandoc。這三者均隨附於每一種執行 Heym 的方式中，包括 `run.sh`、docker-compose 與單一發行映像檔，因此無需任何設定。頁數上限、逾時與最大 DPI 皆為固定的平台值，而非可調整的設定。

## 相關內容

- [Set](./set-node.md) – 轉換與對應個別欄位
- [JSON 輸出對應器](./json-output-mapper-node.md) – 建立 JSON 回應物件
- [檔案上傳 Trigger](./file-upload-trigger-node.md) – 將檔案接收至 Heym Drive
- [Drive](./drive-node.md) – 儲存、取得與分享檔案
- [節點類型](../reference/node-types.md) – 所有節點類型總覽
- [Expression DSL](../reference/expression-dsl.md) – 函式與語法
