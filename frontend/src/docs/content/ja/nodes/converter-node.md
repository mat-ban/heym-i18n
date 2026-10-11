# コンバーター

**Converter** ノードは、コードを書くことなくデータとファイルをフォーマット間で変換します。技術に依存しない設計のため、対応フォーマットは今後も追加できます。CSV、JSON、XML データの双方向変換、Tesseract OCR による画像や PDF からのテキスト抽出、保存済みファイルの別フォーマットへの書き換えを行います。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 1 |
| 出力内容 | `$nodeLabel.result`（`csvToJson` / `xmlToJson` ではパース済みデータ、`jsonToCsv` / `jsonToXml` ではテキスト、`imageToText` / `pdfToText` では抽出テキスト、`fileConvert` では新しいファイルのメタデータ） |

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `conversion` | string | `csvToJson`（CSV テキスト → 行オブジェクトの配列）、`jsonToCsv`（オブジェクト/行の配列 → CSV テキスト）、`xmlToJson`（XML テキスト → オブジェクト）、`jsonToXml`（オブジェクト → XML テキスト）、`imageToText`（画像を OCR）、`pdfToText`（選択した PDF の各ページを OCR）、`fileConvert`（保存済みファイルを別フォーマットに書き換え）のいずれか |
| `source` | expression | 変換対象のデータ。空欄の場合はノードの最初の入力を使用します |
| `delimiter` | string | 単一文字のフィールド区切り文字（デフォルト `,`） |
| `hasHeader` | boolean | `csvToJson` のみ — 先頭行をヘッダーとして扱います（デフォルト `true`） |
| `trimValues` | boolean | `csvToJson` のみ — ヘッダー名とセル値の前後の空白を除去します（デフォルト `true`） |
| `includeHeader` | boolean | `jsonToCsv` のみ — ヘッダー行を出力します（デフォルト `true`） |
| `converterColumns` | string | `jsonToCsv` のみ — 任意のカンマ区切り列順 |
| `converterFileId` | expression | ファイル変換 — 読み込む Heym Drive ファイル。例：`$Upload.file.id` |
| `converterTargetFormat` | string | `fileConvert` のみ — 出力フォーマット（`pdf`、`docx`、`html`、`md`、`txt`、`csv`、`epub`、`jpg`、`png`、`bmp`、`webp`） |
| `ocrLanguage` | string | OCR のみ — `auto`（デフォルト）、`tur` などの Tesseract コード、または `custom` |
| `ocrLanguageCustom` | string | OCR のみ — `ocrLanguage` が `custom` の場合に使用する言語コード。例：`eng+tur` |
| `ocrEncoding` | string | OCR のみ — テキストを正規化する文字セット（デフォルト `utf-8`） |
| `ocrNormalizeUnicode` | boolean | OCR のみ — NFC 正規化を適用します（デフォルト `true`） |
| `ocrPsm` | string | OCR のみ — Tesseract のページセグメンテーションモード（デフォルト `3`） |
| `ocrDpi` | number | `pdfToText` のみ — ページのラスタライズ DPI（デフォルト `300`） |
| `ocrPageRange` | expression | `pdfToText` のみ — `3` または `2-5`。空欄の場合は全ページ |

## 動作

- **`csvToJson`** はソースの CSV テキストをパースします。`hasHeader: true` の場合、各行はヘッダー値でキー付けされたオブジェクトになります。`hasHeader: false` の場合、各行はセル値の配列になります。引用符で囲まれたフィールド、埋め込まれた区切り文字、埋め込まれた改行は RFC 4180 に従って処理されます。先頭の UTF-8 BOM（Excel エクスポートで一般的）は除去され、重複するヘッダー名は実際の列を上書きすることなく一意化されます（`a, a, a_2` → `a`、`a_3`、`a_2`）。タブ区切り値をパースするには `delimiter` を `\t` に設定します。
- **`trimValues`**（デフォルト `true`）はヘッダー名とセル値の前後の空白を除去します。**引用符で囲まれたフィールド内も含みます**（`" padded "` → `padded`）。RFC 4180 では引用符で囲まれた空白はデータとして扱われるため、そのまま保持するには `trimValues: false` を設定します。
- **`jsonToCsv`** はオブジェクト（または配列）の配列から CSV テキストを構築します。列順は `converterColumns` が指定されている場合はそれに従い、それ以外の場合は最初のオブジェクトのキーから推測されます。区切り文字、引用符、改行を含む値は自動的に引用符で囲まれます。
- **`xmlToJson`** は XML をオブジェクトにパースします。属性は `@` プレフィックスを使用し、属性と混在するテキストは `#text` を使用します。繰り返される兄弟要素は配列になります。XML エンティティ展開は無効化されています。
- **`jsonToXml`** はオブジェクトを XML ドキュメントにシリアライズします。オブジェクトは最上位のキーをちょうど 1 つ持つ必要があり、それが XML ルート要素になります。子要素と並んで属性とテキストを生成するには、`xmlToJson` と同じ `@attribute` および `#text` の規約を使用します。
- **`imageToText`** は単一の画像（PNG、JPEG、TIFF、WebP、BMP）に対して Tesseract を実行します。
- **`pdfToText`** は選択した各ページを `ocrDpi` でラスタライズし、認識します。すべてのページが OCR を経由するため、テキストレイヤーが完全に正常なデジタル PDF であってもピクセルから再読み取りされます。これによりスキャン文書とデジタル文書が同一の挙動を示しますが、その代償として速度が犠牲になるため、長いファイルでは `ocrPageRange` を絞ってください。
- **`fileConvert`** はソースファイルを別フォーマットに書き換え、結果を**新しい** Drive ファイルとして保存します。元のファイルは決して変更されません。ドキュメントは pandoc、画像は Pillow、JSON から CSV へは Python の csv ライターを経由します。画像をドキュメントに、ドキュメントを画像に変換することはできません。画像からテキストを読み取るには `imageToText` を使用してください。

## ファイルの取り込み

ファイル変換はパスや URL ではなく Heym Drive から読み込むため、ファイルは事前に保存されている必要があります。一般的な 3 つの連携例：

- **[File upload trigger](./file-upload-trigger-node.md) → Converter** — `converterFileId` を `$Upload.file.id` に指定します。
- **[Drive](./drive-node.md)（`downloadUrl`）→ Converter** — リモートファイルを Drive に取得し、`$Download.id` を渡します。
- **[Agent](./agent-node.md) → Converter** — ファイルを書き出すスキルは、それを `$reportAgent._generated_files[0].id` として公開します。

`converterFileId` はファイルオブジェクト全体（`$Upload.file`）や Heym のダウンロード URL も受け付けます。いずれの場合もファイル id が抽出されます。ファイルは、ご自身が所有するもの、またはチームメイトが共有したものである必要があります。
## 言語

`auto`（デフォルト）は、まず Tesseract の文字方向および文字体系の検出を実行し、検出された文字体系に対してインストール済みの最適なモデルを選択します。`Latin` や `Cyrillic` といった文字体系モデルは、その文字体系で書かれたあらゆる言語を読み取るため、auto はどちらがトルコ語でどちらが英語かを指定されなくても、トルコ語の請求書と英語の請求書を処理できます。

言語を明示する方が、それが分かっている場合にはより正確です。単一のコード（`tur`）を使用するか、混在した文書には複数のコードを `+` で結合します（`eng+tur`）。言語を増やすほど認識は遅くなり、わずかにノイズも増えるため、リストは短く保ってください。コードは、対応する言語データがバックエンドにインストールされている場合にのみ機能します。存在しない言語を選択すると、ノードに利用可能な言語が一覧表示されます。

すべての Heym イメージには、`osd`、英語、トルコ語、ドイツ語、フランス語、スペイン語、イタリア語、ポルトガル語、オランダ語、ロシア語、アラビア語、簡体字中国語、日本語、韓国語、および Latin、Cyrillic、Arabic、HanS、Japanese、Hangul の各文字体系モデルが同梱されています。

## エンコーディング

認識されたテキストは UTF-8 であり、Tesseract が生成したすべての文字を保持します。`ocrNormalizeUnicode`（デフォルトで有効）は NFC 正規化を適用するため、`s` と結合セディーユとして書かれた文字は単一の `ş` になります。この 2 つの形式は比較やデータベース検索において等価ではないため、有効のままにしておくことをお勧めします。

`ocrEncoding` は、ダウンストリームの何かが Unicode の全範囲を保存できない場合にのみ重要です。`cp1254` や `iso-8859-9` を選択すると、トルコ語のテキストをそのまま保持しつつ、結果がその文字セットに収まることを保証します。`latin-1` と `ascii` はより狭く、表現できない文字を `?` に置き換えます。対象システムに強制されない限り、`utf-8` のままにしてください。

## 出力

`csvToJson`、`jsonToCsv`、`xmlToJson`、`jsonToXml` は `$label.result` と `$label.conversion` を返します。OCR 変換では以下が追加されます：

| フィールド | 説明 |
|-------|-------------|
| `$label.result` | 抽出された全文。ページは空行で結合されます |
| `$label.language` | 実際に実行されたモデル（`auto` が何を選択したかを確認するのに便利です） |
| `$label.encoding` | テキストが正規化された文字セット |
| `$label.page_count` | 認識されたページ数 |
| `$label.pages` | ページ単位の処理用の `{ page, text }` の配列 |
| `$label.file` | ソースファイルの `{ id, filename, mime_type, size_bytes }` |

`fileConvert` は代わりに新しいファイルを返します：

| フィールド | 説明 |
|-------|-------------|
| `$label.id` | 新しく保存されたファイルの UUID |
| `$label.filename` | 変換後のファイル名。ベース名は保持され、拡張子が置き換えられます |
| `$label.mime_type` | 新しいファイルの MIME タイプ |
| `$label.size_bytes` | 新しいファイルのサイズ |
| `$label.download_url` | 新しいファイルの Drive ダウンロード URL |
| `$label.source_file` | 変換されたファイルのメタデータ |

## 例

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

入力 `name,age\nAda,36` に対して、ダウンストリームのノードは `$toRows.result`（`[{ "name": "Ada", "age": "36" }]`）を介して解析された行にアクセスします。

XML を JSON に変換する場合：

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

`<person id="1"><name>Ada</name></person>` に対して、`$xmlToObject.result` は `{ "person": { "@id": "1", "name": "Ada" } }` になります。XML を作成するには、そのオブジェクトを `conversion: "jsonToXml"` を指定した 2 番目の Converter ノードに渡します。

ファイルアップロード Trigger を介してアップロードされたスキャン済み請求書を読み取る場合：

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

ダウンストリームの [Agent](./agent-node.md) または [LLM](./llm-node.md) ノードは、`$readInvoice.result` から構造化フィールドを抽出できます。

Agent の markdown レポートを PDF に変換する場合：

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

ダウンストリームのノードは `$convertDoc.download_url` を読み取って PDF を共有するか、`$convertDoc.id` を読み取って [Drive](./drive-node.md) で作業を続けます。

## 要件

OCR は `tesseract` と poppler の `pdftoppm` を呼び出し、ドキュメント変換には pandoc を使用します。これら 3 つはすべて、`run.sh`、docker-compose、単一リリースイメージを含む、Heym を実行するあらゆる方法に同梱されているため、設定するものは何もありません。ページ制限、タイムアウト、最大 DPI は設定項目ではなく、固定のプラットフォーム値です。

## 関連

- [Set](./set-node.md) – 個々のフィールドの変換とマッピング
- [JSON output mapper](./json-output-mapper-node.md) – JSON レスポンスオブジェクトの構築
- [File upload trigger](./file-upload-trigger-node.md) – Heym Drive へのファイルの受け入れ
- [Drive](./drive-node.md) – ファイルの保存、取得、共有
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Expression DSL](../reference/expression-dsl.md) – 関数と構文
