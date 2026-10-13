# グラフ出力

**Chart Output** ノードは、[dashboard widget](../tabs/dashboard-tab.md) Workflow の終端ノードです。上流のノードが生成した行データを受け取り、dashboard がレンダリングするための標準化された chart payload に変換します。

## 概要

| プロパティ | 値 |
|----------|-------|
| 入力 | 1 |
| 出力 | 0（終端） |
| Output | 標準化された chart payload |

このノードは dashboard-widget Workflow の**最後**に配置してください。その直前のノードは、行オブジェクトの配列を生成する必要があります。例：

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

例示用・サンプルデータのみで実際のソースがない場合は、**Set** ノードで `$array(dict(...), dict(...))` を使用してこれらの行を生成してください。例えば `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))` のように記述します。`${...}` や裸の `{...}` オブジェクトリテラルは使用**しないでください**。Heym は `dict(key=value)` でのみオブジェクトを構築します。

## パラメータ

| パラメータ | 型 | 説明 |
|-----------|------|-------------|
| `label` | string | ノード識別子（camelCase） |
| `chartType` | string | `pie`、`bar`、`line`、`area`、`table`、`numeric`、`gauge`、`scatter`、`proportion`、`barGauge`、`text`、または `hitl` |
| `orientation` | string | `vertical` または `horizontal`（bar チャートのみ） |
| `dataPath` | string | 上流の出力内にある行配列へのドットパス（例：`data` または `result.items`）。空欄にすると自動検出されます。 |
| `labelField` | string | カテゴリラベルとして使用する行のキー（pie/bar/line） |
| `valueField` | string | 数値として使用する行のキー（pie/bar/line/numeric/gauge） |
| `series` | array | bar/line 用の任意の複数系列定義 `[{ "name": "Sent", "field": "sent" }]`（`valueField` を上書きします） |
| `columns` | array | `table` 用の任意の列リスト（デフォルトは最初の行のキー） |
| `statusColumn` | string | 色付きの[ステータスチップ](#status-chips)としてレンダリングされる任意の `table` カラム。表示されるカラムのいずれかである必要があります。 |
| `statusTones` | object | デフォルトでカバーされないステータス値をトーン（`success`、`attention`、`failure`、`waiting`、`neutral`）に対応付ける任意のマップ |
| `xField` / `yField` | string | X 軸および Y 軸の数値に対応する行のキー（scatter） |
| `min` / `max` | number | `gauge` の数値範囲（デフォルト `0` / `100`） |
| `unit` | string | `numeric` または `gauge` の値の横に表示される任意の単位 |
| `text` | string | `text` chart type 用の Markdown メッセージ。空欄にして `valueField` を設定すると、上流データから取得した動的メッセージをレンダリングします。 |
| `title` | string | 任意のチャートタイトル |

## Chart types

- **bar / line / area / pie** — `labelField` + `valueField`（複数系列の bar/line/area の場合は `series`）で駆動されるカテゴリカルチャートです。`area` は塗りつぶしのトレンドチャートです。
- **table** — `columns` を使用して、生の行をスクロール可能なテーブルとしてレンダリングします。1 つのカラムを[ステータスチップ](#status-chips)として表示でき、行から[詳細ページ](../tabs/dashboard-tab.md#detail-pages)を開くことができます。
- **numeric** — 最初の行から取得した単一の KPI 値で、任意の `unit` を付けられます。
- **gauge** — `min`〜`max` の範囲に対して表示される単一の値（例：パーセンテージ）。`valueField` を使用します。
- **scatter** — 相関プロット用に `xField` と `yField` から取得した X/Y の点です。
- **proportion** — パーセンテージ凡例付きで、割合ごとに分割された単一の水平バー（例：言語の内訳）。`labelField` + `valueField` を使用します。
- **barGauge** — 赤→緑のグラデーションと値を持つ、行ごとの水平ゲージ（例：空きディスク容量）。`labelField` + `valueField` を使用し、任意で `unit` と `max`（デフォルトは最大の行値）を指定できます。
- **text** — markdown メッセージ（例：「Last execution at 19:47」のようなステータスノート）。静的なメッセージの場合は `text` に markdown を記述するか、`text` を空欄にして `valueField` を設定すると、上流で生成された文字列をレンダリングします。見出し、太字/斜体、[リスト](../nodes/chart-output-node.md#interactive-task-lists)、リンク、インラインコードをサポートします。
- **hitl** — 保留中のヒューマンレビューのカルーセルです。ヘッダーには `1/n pending` が表示され、左矢印は最初のカードで、右矢印は最後のカードで無効になります。Workflow 名をクリックすると、その実行がキャンバス上で開きます。**Approve**、**Request changes**、**Reject** で解決でき、ウィジェットタイトルの横にある履歴アイコンをクリックすると、同じページの履歴ダイアログでその実行が開きます。この chart type は上流の行を無視するため、ウィジェット Workflow は Chart Output ノードのみとなります。サインインしている各ユーザーには、自身が所有する Workflow のレビューが表示されます。

### Interactive task lists

静的な `text` フィールドで GitHub 風の markdown タスクリスト構文を使用します：

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

[Dashboard](../tabs/dashboard-tab.md) では、チェックボックスがクリック可能なコントロールとしてレンダリングされます（ダークモードとライトモードの両方に対応）。チェックボックスを切り替えると、ウィジェット Workflow の `text` フィールドが更新され、リフレッシュ後も保持されます。

**インライン編集：** タスク項目のラベルをダブルクリックすると、その場で編集できます。Enter を押すか、別の場所をクリックすると保存され、Escape を押すとキャンセルされます。ラベルを完全に消去すると、その項目がリストから削除されます。

**タスク項目内のリンク：** ラベルに markdown リンク（`[title](url)`）が含まれている場合、リンクをクリックするとチェックボックスを切り替えずに URL が開きます。切り替えるには、行の別の場所をクリックしてください。

**静的テキストのみ：** インタラクティブ性には GFM タスクリスト構文（`- [ ]` / `- [x]`）が必要です。タスク項目のない通常の動的ステータスメッセージは読み取り専用のままです。markdown が `valueField` から取得される場合、最初の切り替え時にその内容が静的な `text` フィールドにコピーされ、変更が保持されます。
### 番号付きリスト

テキストウィジェットは、**明示的な行番号を保持したまま** markdown をレンダリングします。表示したい番号を各行の先頭に付けてください（例：`9.`、`8.`、`7.`）。Heym は行番号を自動で振り直すことはありません。

**なぜ明示的な番号が必要なのか？** 標準的な markdown の順序付きリスト（`1.`、`2.`、`3.`）は HTML の `<ol>` リストに変換され、最初の番号から**昇順にしか**カウントされません。`9.` / `8.` / `7.` と書かれたリストは、通常の markdown レンダラーでは `9`、`10`、`11` と表示されてしまいます。各行の先頭に意図した番号を付けることで、これを回避できます。

**降順リスト（例：新しい順）：** Workflow のループ内で markdown を構築し、項目ごとに表示番号を計算します：

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

典型的なパターン：

1. 項目の配列を取得または構築します（例：HTTP → `body.videos`）。
2. 配列に対して [Loop](./loop-node.md) を実行します。body 内で [Variable](./variable-node.md) の `.add()` を使用し、イテレーションごとに番号付きの行を 1 行ずつ追加します。
3. ループの **done** ブランチの後で、蓄積された配列に対して `join("\n")` を実行し（または同等の処理）、単一の markdown 文字列にまとめます（[Set](./set-node.md) を使用）。
4. **Chart Output** の `valueField` をその文字列に指定します（または静的な `text` を設定します）。

ループ内の行式の例（ラベル `processVideos`、`title` と `id` を持つ項目）：

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

生成される markdown：

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

1 から始まる単純な昇順リストの場合は、各行の先頭に番号を付けるか（`1.`、`2.`、`3.`）、`$loop.index + 1` を使用したループを使います。番号が不要な場合は[箇条書きリスト](#interactive-task-lists)（`- item`）を使用してください。

## ステータスチップ

`table` では、1 つのカラムを色付きのチップとして表示できます。ノードのプロパティの **Status column**（または DSL の `statusColumn`）にカラム名を設定します。各値には 5 種類のトーンのいずれかが割り当てられ、一般的な単語は設定なしで自動的に判定されます：

| トーン | デフォルトの単語 |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | その他すべて |

判定では大文字・小文字、`_`、`-` が無視されるため、`IN_PROGRESS` と `in-progress` はどちらも `waiting` になります。その他の値には **Status tones** を追加してください。エントリを追加すると、その値のデフォルトが上書きされます：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

サーバーが各値をトーンに解決するため、Heym と Heym Work で同じ色が表示されます。

## 詳細ページ：`$page.record`

`?record=<value>` 付きで開かれたダッシュボードは、その値を `$page.record` としてすべてのウィジェット Workflow を実行します。テーブル行のリンクからこのようなページが開きます（[詳細ページ](../tabs/dashboard-tab.md#detail-pages)を参照）。レコード指定なしで開かれたダッシュボードおよび式ダイアログでは、`$page.record` は `null` です。`page` というラベルのノードがある場合はそちらが優先されます。

たとえば [HTTP](./http-node.md) ノードで、ページの対象となる 1 件のレコードを取得するために使用します：

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` はクリックされた行の値そのもの（`V-1002` など）であり、フィールドを持つオブジェクトではありません。[DataTable](./datatable-node.md) でそのレコードを検索するには、レコードカラムをその値でフィルタリングします（`find` 操作でフィルタ `{"vendor_id": "$page.record"}` を指定）。`$page.record.id` のようなパスは何も解決しないため、AI が作成または微調整したウィジェットではそうしたフィールドは除外され、代わりに `$page.record` が読み取られます。

この値は誰でも編集できる URL から渡されます。ダッシュボードはレコード形式（デフォルトでは英字、数字、`-`、`_`、`.`）に合致する値のみを受け付けますが、それでも信頼できない入力として扱ってください。HTTP クエリパラメータや [DataTable](./datatable-node.md)・ClickHouse のフィルタ値など、ノードが値をエスケープする箇所に渡し、文字列連結によってクエリ文を組み立てることは絶対に避けてください。誰がページを開いても、ウィジェットはダッシュボード所有者の権限で実行されます。

## データの解決方法

1. `dataPath` が設定されている場合、ノードはそのドットパスに従って上流の出力へ進みます。
2. それ以外の場合は配列を探します：トップレベルのリスト、`data` 配列、または最初のリスト値フィールドのいずれかです。
3. [Data Table](./datatable-node.md) ノードから直接渡された行（`{id, data, created_at}`）は、各カラムが `id` と並ぶトップレベルとして読み取られるため、`labelField`、`valueField`、`columns` にはテーブル自身のカラム名をそのまま指定できます。
4. `table` の場合、各行は `columns`（または最初の行のキー）を使用してテーブル行になります。`statusColumn` が設定されている場合、Payload にはそのカラム内の各値のトーンも含まれます。
5. `numeric` および `gauge` の場合、値は最初の行の `valueField`（または最初の数値フィールド）から取得されます。
6. `scatter` の場合、各行は `[xField, yField]` のポイントになります。
7. `text` の場合、メッセージは設定されていれば最初の行の `valueField` から取得され、そうでなければ静的な `text` 設定から取得されます（それもなければ最初の行の最初の文字列フィールドから取得されます）。

## 例

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge（単一値と範囲）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter（X/Y ポイント）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion（割合で分割された 1 本のバー + パーセンテージ凡例）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area（塗りつぶしのマルチシリーズトレンド）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge（値付きの行ごとのグラデーションゲージ）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text（静的な markdown メッセージ — 上流の行は不要）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text（動的 — メッセージ文字列は上流で生成され、`valueField` を介して取得されます）：

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## AI Prompt の例

**AI** でウィジェットを生成する場合、次のような Prompt が各タイプにそのまま対応します：

- **Bar** — 「過去6か月の月次売上を縦棒グラフで表示してください。example data を使用してください。」
- **Line** — 「過去14日間の日次アクティブユーザーを折れ線グラフでプロットしてください。」
- **Area** — 「過去24時間のメモリと CPU 使用率を2つのシリーズを持つエリアチャートで表示してください。example data を使用してください。」
- **Pie** — 「実行ステータス（success、error、cancelled）を円グラフで内訳表示してください。」
- **Table** — 「実行回数の多い上位10件の Workflow を、name 列と runs 列を持つスクロール可能なテーブルで表示してください。example data を使用してください。」
- **Numeric** — 「本日の Workflow 実行総数を、単位 'runs' の単一 KPI として表示してください。example data を使用してください。」
- **Gauge** — 「現在の CPU 使用率を0～100パーセントのゲージで表示してください。」
- **Scatter** — 「リクエストレイテンシーと Payload サイズの関係を散布図でプロットしてください。example data を使用してください。」
- **Proportion** — 「最もよく使う言語をプロポーションバーで表示してください：Kotlin 49.64%、JavaScript 23.73%、TypeScript 11.64%、Java 8.92%、Python 6.06%。example data を使用してください。」
- **Bar gauge** — 「ボリュームごとの空きディスク容量（sda1～sda7）を GB 単位のバーゲージで表示してください。example data を使用してください。」
- **Text** — 「markdown チェックリスト（チェック済み1件、未チェック2件）を含むテキストウィジェットを追加するか、最新のチュートリアル動画5件を降順（5. から 1.）で YouTube リンク付きでリストアップしてください。各行の先頭に明示的な番号を付けてください（`5. Title`、`4. Title`、…）。」

## 関連

- [Dashboard tab](../tabs/dashboard-tab.md) — ウィジェットの構築と配置
- [Output node](output-node.md) — 通常の Workflow 用の終端ノード
