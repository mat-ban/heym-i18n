# Expression DSL

Heym は、上流のノードからデータを参照するためのシンプルな式言語を使用します。LLM の `userMessage`、Condition の `condition`、Output の `message`、Set のマッピング、Variable の値など、ノード設定内で式を使用してください。より大きなエディタ、バックエンドによるライブプレビュー、出力パスの選択には、[Expression Evaluation Dialog](./expression-evaluation-dialog.md) を使用してください。

## 基本的な参照

### Input ノードと名前付きノード

- **`$input`** – 上流に単一の [Input](../nodes/input-node.md) ノードがあり、その出力を参照したい場合にのみ使用します。例: `$input.text`。これは「接続された入力からのデータ」を表す省略記法です。
- **`$nodeLabel.field`** – 任意の上流ノードをその**ラベル**（ノードのデータ内の `label`）で参照する場合に使用します。複数のノードがある場合や、AI Assistant / Workflow DSL が明示的なラベルを期待する場合にはこちらを推奨します。例: `$userInput.body.text`、`$myLLM.text`。

**使い分けの目安:**

| コンテキスト | 推奨 | 例 |
|--------|--------|---------|
| 単一の Input ノード、シンプルなフロー | `$input.text` | 1 つの Input からの Output メッセージ |
| 複数ノードまたは名前付き参照 | `$nodeLabel.field` | `$userInput.body.text`、`$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / Workflow JSON | 常に `$nodeLabel.field` | Workflow ビルダーは `$input` ではなくラベルを期待します |

### Input ノード

上流に単一の入力がある場合、`$input` を使用して Input ノードのデータを参照します:

```
$input.text
```

### 名前付きノード

任意の上流ノードをそのラベルで参照します。ノードに[ピン留めされたデータ](./canvas-features.md#data-pin)がある場合、式の補完には実行出力ではなくそちらが使用されます。

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

`$credentials.CredentialName` を使用して、Credential の値（API キー、ベアラー Token、Notion 統合 Token など）を名前で参照します。詳細は [Credentials Sharing](./credentials-sharing.md) を参照してください。

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

プレーンな識別子ではない名前（`-` を含む、数字で始まる、予約語であるなど）の場合は、ブラケット形式を使用します: `$credentials["my-api-key"]`。

### Global Variables

`$global.variableName` を使用して [Global Variables](./global-variables.md) を参照します。これは [Variables タブ](../tabs/global-variables-tab.md) で管理される、永続的なユーザースコープのキーと値のデータです。

```
$global.environment
$global.settings.baseUrl
```

### ネストされたフィールド

ネストされたオブジェクトにはドット記法を使用します:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## リテラル

- **文字列**: `"hello"` または `'hello'`
- **数値**: `42`、`3.14`
- **真偽値**: `true`、`false`
- **Null**: `null`

## 型の保持

**値全体**が単一の `$expr` である場合、バックエンドはネイティブの型を保持します:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

式がより大きな文字列の一部である場合、最終結果は常に文字列になります:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md) ノードはキャンバス上のドキュメントであり、実行可能な式フィールドではありません。その `note` の内容は markdown としてレンダリングされるため、`$...` 式ではなく通常の markdown リンクと画像を使用してください。

Sticky Note はカスタム表示タイトルと 6 つの保存済み背景色をサポートします:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

使用可能な `stickyColor` の値は `yellow`、`sky`、`emerald`、`rose`、`violet`、`zinc` です。

## 算術演算

サポートされる演算子: `+`、`-`、`*`、`/`、`%`

```
$input.count + 1
$llm.tokens * 2
```

## 比較

[Condition](../nodes/condition-node.md) ノードで使用します: `==`、`!=`、`>`、`<`、`>=`、`<=`、`&&`、`||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop コンテキスト

[Loop](../nodes/loop-node.md) ノード内では、`item` を使用して現在の配列要素を参照します:

```
item.name
item.value
```

## 特殊変数
- `$now` - フォーマットメソッドを備えた現在の日時
- `$Date()` - 日付の作成/パース（例: `$Date("2024-01-15")`）
- `$UUID` - 32 文字の一意な識別子を生成（括弧は不要。`$UUID()` ではなく `$UUID` を使用してください）
- `$workflowName` - 現在の Workflow の名前
- `$workflowDescription` - 現在の Workflow の説明
- `$workflowPath` - Workflow の相対パス（例: `/workflows/<id>`）
- `$workflowUrl` - Workflow の絶対 URL（例: `https://<host>/workflows/<id>`）
- `$executionId` - 現在の実行の id（[Execution History](./execution-history.md) のエントリ id と等しく、`/workflows/<id>/<executionId>` でこの実行をキャンバス上に開けます）。**ランタイム専用**: 式プレビューダイアログでは空になり、Workflow の実行中にのみ値が入ります。
- `$vars` - Workflow ローカルの変数（`$vars.variableName` でアクセス、`variable` ノードで更新）
- `$global` - 永続的なグローバル変数ストア（`$global.variableName` でアクセス）
- `$page.record` - ダッシュボードウィジェットの Workflow 専用：ダッシュボードの `?record=` パラメータから取得される、ウィジェットが配置された詳細ページのレコード。パラメータなしで開かれたダッシュボードおよび式プレビューダイアログでは `null` になります。`page` というラベルのノードが優先されます。[詳細ページ](../tabs/dashboard-tab.md#detail-pages)を参照してください。

### $vars の使用法
- `$vars.counter` - `counter` という名前の変数にアクセス
- `$vars.myArray.add("item")` - 配列変数に項目を追加

### $global の使用法
- `$global.environment` - `environment` という名前のグローバル変数にアクセス
- `$global.settings.baseUrl` - オブジェクト型のグローバル変数内のネストされたフィールドにアクセス

## リクエストコンテキスト（API実行）
WorkflowがHTTP API経由で実行される場合、入力ノードは追加のリクエストメタデータを受け取ります：
- `$textInputLabel.body` - HTTPリクエストボディオブジェクト（生のJSON Payload）
- `$textInputLabel.headers` - HTTPリクエストヘッダーオブジェクト（すべてのヘッダーキーは小文字）
- `$textInputLabel.query` - URLクエリパラメータオブジェクト

リクエストデータには次のようにアクセスします：
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## 型変換関数
- `str(value)` - 文字列に変換
- `int(value)` - 整数に変換
- `float(value)` - 浮動小数点数に変換
- `bool(value)` - 真偽値に変換
- `list(value)` - リストに変換
- `dict(key=value, ...)` - キーワード引数で辞書を作成（例：`$dict(name="Ali", age=30)`）

## 数学関数
- `len(value)` - 長さを取得
- `abs(value)` - 絶対値
- `min(a, b)` - 最小値
- `max(a, b)` - 最大値
- `round(value)` - 数値を四捨五入
- `sum(list)` - リストの合計
- `sorted(list)` - リストをソート
- `randomInt(min, max)` - ランダムな整数

## 配列関数
- `$array(a, b, c)` - 引数から配列を作成（例：`$array(1, 2, 3)` -> `[1, 2, 3]`）
- `$range(a, b)` - `a` から `b` までの整数範囲を作成（`b` は含まない）（例：`$range(1, 5)` -> `[1, 2, 3, 4]`）
  - `a > b` の場合は失敗します
- `notNull(list)` - 配列からnull値を削除

## 文字列構築関数（map/filter式用）
- `concat(a, b, c, ...)` - N個の引数を連結
  - `.map()` 内で式文字列として使用します（文字列内に `$` は不要）
  - concat文字列内ではシングルクォートを使用します：
    - 正しい例：`concat('prefix', 'item.field', 'suffix')`

## オブジェクトリテラル / 辞書
任意の文字列キーを持つ波括弧構文でオブジェクト/辞書を作成します：
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### 動的キー
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### オブジェクトリテラルのルール
- キーには任意の文字列（スペースや特殊文字を含む）を使用できます
- キーは必ずダブルクォートで囲む必要があります（例：`"key"`）
- 値には文字列/数値/真偽値/式/ネストされたオブジェクトを使用できます

## 文字列関数
- `upper(text)` - 大文字に変換
- `lower(text)` - 小文字に変換
- `strip(text)` - 空白を削除
- `capitalize(text)` - 先頭文字を大文字に変換
- `title(text)` - タイトルケースに変換
- `split(text, separator)` - 文字列を分割
- `join(separator, list)` - リストを結合
- `replace(text, old, new)` - テキストを置換
- `regexReplace(text, pattern, replacement)` - 正規表現パターンで置換
- `base64Encode(text)` - UTF-8テキストを標準Base64でエンコード
- `base64Decode(text)` - 標準Base64をUTF-8テキストにデコード
- `toJson(text)` - JSON文字列をオブジェクト、配列、または値にパース

## 文字列メソッド（文字列値に対して）
- `.orEmpty()` - 文字列値を返すか、値がnull/存在しない場合は `""` を返します
- `.upper()` / `.lower()` - 大文字/小文字変換
- `.strip()` - 空白を削除
- `.capitalize()` / `.title()` - 先頭文字を大文字に変換
- `.length` - 文字列の長さ
- `.toString()` - 文字列に変換
- `.substring(start, end)` - 部分文字列を抽出
- `.contains(text)` - 部分文字列を含むか確認
- `.startswith(prefix)` / `.endswith(suffix)` - プレフィックス/サフィックスを確認
- `.indexOf(text)` - 位置を検索（見つからない場合は-1を返す）
- `.replace(old, new)` - 最初の出現箇所を置換
- `.replaceAll(old, new)` - すべての出現箇所を置換
- `.regexReplace(pattern, replacement)` - 正規表現パターンで置換
- `.hash()` - 文字列のMD5ハッシュ
- `.base64Encode()` - UTF-8テキストを標準Base64でエンコード
- `.base64Decode()` - 標準Base64をUTF-8テキストにデコード
- `.urlEncode()` - 文字列をURLエンコード
- `.urlDecode()` - 文字列をURLデコード
- `.escape()` - JSONエスケープ文字列（特殊文字をJSON形式に変換）
- `.unescape()` - JSONアンエスケープ文字列（JSON形式を元の文字列に変換）
- `.toJson()` - JSON文字列をオブジェクト、配列、または値にパース

### 文字列メソッドの例
- `$profile.nickname.orEmpty()` - null許容/存在しないテキストを空文字列に変換
- `$text.upper()` - 大文字に変換
- `$text.lower()` - 小文字に変換
- `$text.strip()` - 空白を削除
- `$text.replace("old", "new")` - テキストを置換
- `$text.replaceAll("a", "b")` - すべての出現箇所を置換
- `$text.length` - 文字列の長さを取得
- `$text.escape()` - 特殊なJSON文字（引用符、改行など）をエスケープ
- `$escapedText.unescape()` - JSON形式の文字列を元に戻す
- `$text.toJson()` - JSONオブジェクト/配列文字列をパース（その後 `$text.toJson().repoUrl`）
- `$toJson($text)` - 関数として同じパースを実行
- `$base64Encode("Héym 🌍")` - `SMOpeW0g8J+MjQ==` を返します
- `$encodedText.base64Decode()` - Base64をUTF-8テキストにデコード
- `$text.urlEncode()` - APIパラメータ用にURLエンコード
- `$encodedText.urlDecode()` - URLエンコードされたテキストをデコード

## 配列メソッド（配列に対して）
- `.first()` - 最初の要素を取得
- `.last()` - 最後の要素を取得
- `.random()` - ランダムな要素を取得
- `.reverse()` - 配列を反転
- `.flat()` - ネストされた配列を単一の配列に平坦化
- `.flat(depth)` - 深さ制限付きで平坦化
- `.distinct()` - 重複を削除
- `.distinctBy(expr)` - 式によって重複を削除（例: `$array.distinctBy("item.id")`）
- `.notNull()` - null 値を削除
- `.add(item)` - 要素を追加（新しい配列を返します）
- `.contains(item)` - 配列に要素が含まれるか確認（boolean を返します）
- `.join(separator)` - 配列の要素を文字列に結合
- `.filter(expr)` - `item` 変数を使用して配列をフィルタリング（例: `$array.filter("item > 5")`）
- `.map(expr)` - `item` 変数を使用して各要素を変換（例: `$array.map("item.name")`）
- `.sort(expr, order)` - 式によってソート、order は `"asc"`（デフォルト）または `"desc"`
- `.take(n)` - 最初の N 個（正の値）または最後の N 個（負の値）の要素を取得
- `.length` - 配列の長さ
- `.toString()` - JSON 文字列に変換

### Filter / Map / Sort の例
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## オブジェクト/辞書メソッド（オブジェクトに対して）
- `.get(key)` - キーによって値を取得（見つからない場合は null を返します）
- `.get(key, default)` - キーによって値を取得、デフォルトのフォールバック付き
- `.keys()` - すべてのキーのリストを返します
- `.values()` - すべての値のリストを返します
- `.entries()` - `{key, value}` オブジェクトのリストを返します（プロパティごとに1つ）
- `.filter(expr)` - `{key, value}` エントリを反復処理し、一致するエントリをリストとして返します（`expr` 内で `item.key` / `item.value` を使用）
- `.map(expr)` - `{key, value}` エントリを反復処理し、変換された値のリストを返します（`expr` 内で `item.key` / `item.value` を使用）
- `.toString()` - JSON 文字列に変換

### オブジェクト反復の例
`.map()` または `.filter()` でオブジェクトを反復処理する場合、各 `item` は `{key, value}` ペアです：

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → null でないプロパティ名のリスト

## 日付/時刻
- `$now` - 現在の日時
- `$now.format("YYYY-MM-DD")` - 日付/時刻をフォーマット
- `$now.toISO()` / `.toDate()` / `.toTime()` - フォーマットを変換
- `$now.addDays(n)` / `.addHours(n)` - 日付の計算
- `$Date("2024-01-15")` - 日付文字列をパース

## 数値演算
- 基本的な算術: `+`、`-`、`*`、`/`、`%`
- 比較: `>`、`<`、`>=`、`<=`、`==`、`!=`
- 論理演算子: `and`、`or`、`not`

## Boolean 条件
boolean の場合、式を直接記述してください（`== true` を強制しないでください）：
- 誤り: `$nodeName.isValid == true`
- 正しい: `$nodeName.isValid`
- 否定: `not $nodeName.isValid`

## ルールとホワイトリスト（重要）
### $ の配置ルール
- 単独の式は通常、先頭に `$` を付けます。
- テンプレート文字列には複数の `$refs` を含めることができます。
- メソッドのパラメータには、別の式の結果を渡したい場合（動的キーやネストされた解決）、ネストされた `$refs` を含めることもできます。
  - 有効: `$node.method(other.field)` — `other` はトップレベルのラベルのようにコンテキストから解決されます（引数内に `$` はありません）。
  - 有効: `$node.method($other.field)` — ネストされた `$` は evaluate ダイアログのプレビューと条件評価でサポートされています。
  - 有効: `$array($a.x, $b.y)`
  - `.get(` 内のオートコンプリートは、`$array(...)` / `$notNull(...)` 内と同様に、**ベア**の `label.field` パス（先頭の `$` なし）を挿入します。
- **Evaluate API (Run):** 送信された値全体が先頭の `$` を**伴わない**単一のドットパスである場合（例えば、エディタで選択されたテキスト `execute.outputs.output.result.today` など）、バックエンドはそれを `$execute.outputs.output.result.today` と同じように扱います。トリミング後に改行やキャリッジリターンを含む値は書き換えられません（曖昧な複数行の Payload を避けるため）。保存された Workflow フィールドには `$` を記述することを推奨します。この書き換えは主に検査とツール用です。
- Evaluate ダイアログの `Run` 結果は、具体的な式がどのように解決されるかの信頼できる情報源です。

### 配列の文字列クォート
文字列値を持つ配列を作成する場合、常にダブルクォートを使用してください：
- 正しい: `$array("hello", "world")`
- 誤り: `$array('hello', 'world')`

### これらの関数のみを使用してください（ホワイトリスト）
以下のみを使用してください：
- `str()`、`int()`、`float()`、`bool()`、`list()`、`dict(key=value, ...)`
- `len()`、`abs()`、`min()`、`max()`、`round()`、`sum()`、`sorted()`
- `randomInt()`、`range()`、`array()`、`notNull()`
- `upper()`、`lower()`、`strip()`、`capitalize()`、`title()`
- `split()`、`join()`、`replace()`、`regexReplace()`、`hash()`
- `base64Encode()`、`base64Decode()`、`toJson()`
- ドキュメント化された文字列/配列/オブジェクトメソッド

上記に記載されていない関数は存在しません。

### 配列 / 辞書メソッドの制限
- 配列で使用できるのは以下のみです: `.first()`、`.last()`、`.random()`、`.reverse()`、`.flat()`、`.distinct()`、`.distinctBy()`、`.notNull()`、`.add()`、`.contains()`、`.join()`、`.filter()`、`.map()`、`.sort()`、`.take()`、`.length`、`.toString()`
- オブジェクト/辞書で使用できるのは以下のみです: `.get(key)`、`.get(key, default)`、`.keys()`、`.values()`、`.entries()`、`.filter(expr)`、`.map(expr)`、`.toString()`

### 予約済みノードラベル名
以下の名前はノードラベルとして使用しないでください：`length`、`orEmpty`、`toString`、`toUpperCase`、`toLowerCase`、`substring`、`indexOf`、`contains`、`startsWith`、`endsWith`、`replace`、`replaceAll`、`regexReplace`、`hash`、`toJson`、`first`、`last`、`random`、`reverse`、`distinct`、`notNull`、`filter`、`map`、`entries`、`keys`、`values`、`sort`、`join`、`headers`、`query`、`value`、`list`、`result`、`array`、`vars`、`items`、`name`、`type`、`status`、`body`、`outputs`、`result`、`item`、`index`、`total`、`isFirst`、`isLast`、`branch`、`results`、`merged`、`error`、`errorNode`、`errorNodeType`、`timestamp`、`input`、`now`、`date`。

## 例

**Condition**：`$input.text.length > 0`

**LLM user message**：`$input.text`

**Output message**：`$llm.text`

**Variable value**：`$input.count + 1`

### DSL の例

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## 関連項目

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – バックエンドのライブプレビューとオートコンプリートを備えた拡張可能なエディター
- [Canvas Features](./canvas-features.md) – ノードを再実行せずに式をテストするためのデータピン
- [Node Types](./node-types.md) – 式を使用するノード（[LLM](../nodes/llm-node.md)、[Condition](../nodes/condition-node.md)、[Output](../nodes/output-node.md)、[Set](../nodes/set-node.md) など）
- [Sticky Note](../nodes/sticky-note-node.md) – 編集可能なタイトル、色、画像表示を備えたキャンバスの markdown ノート
- [Agent Node](../nodes/agent-node.md) – Agent の Prompt で式を使用する
- [Agent Persistent Memory](./agent-persistent-memory.md) – Agent の `data` 内の `persistentMemoryEnabled` と `memoryShares`（式フィールドではありません）
- [Workflow Structure](./workflow-structure.md) – 式を受け入れるノードの `data` フィールド
- [Credentials Tab](../tabs/credentials-tab.md) – ノードから参照される Credentials
- [Credentials Sharing](./credentials-sharing.md) – Credentials を共有し、式で `$credentials` を使用する
- [Global Variables](./global-variables.md) – `$global` を使用した永続変数
