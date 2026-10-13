# Expression DSL

Heym 使用一套簡單的表達式語言來參照上游節點的資料。您可以在節點配置中使用表達式，例如 LLM 的 `userMessage`、Condition 的 `condition`、Output 的 `message`、Set 映射，以及 Variable 值。若需要更大的編輯器、由後端驅動的即時預覽，以及輸出路徑挑選功能，請使用 [Expression Evaluation Dialog](./expression-evaluation-dialog.md)。

## 基本參照

### Input 節點與具名節點

- **`$input`** – 僅在只有單一上游 [Input](../nodes/input-node.md) 節點，且您想參照其輸出時使用。範例：`$input.text`。這是「來自所連接 input 的資料」的簡寫。
- **`$nodeLabel.field`** – 用於依**標籤**（節點資料中的 `label`）參照任何上游節點。當您有多個節點，或當 AI Assistant / workflow DSL 預期明確的標籤時，請優先使用此形式。範例：`$userInput.body.text`、`$myLLM.text`。

**何時使用哪一種：**

| 情境 | 優先使用 | 範例 |
|--------|--------|---------|
| 單一 input 節點、簡單流程 | `$input.text` | 來自單一 Input 的 Output message |
| 多個節點或具名參照 | `$nodeLabel.field` | `$userInput.body.text`、`$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | 一律使用 `$nodeLabel.field` | workflow builder 預期標籤，而非 `$input` |

### Input 節點

當只有單一上游 input 時，使用 `$input` 來參照 Input 節點的資料：

```
$input.text
```

### 具名節點

依標籤參照任何上游節點。當節點具有[釘選資料](./canvas-features.md#data-pin)時，表達式補全會使用該資料，而非執行輸出。

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

使用 `$credentials.CredentialName` 依名稱參照 credential 值（例如 API keys、bearer tokens 或 Notion integration tokens）。請參閱 [Credentials Sharing](./credentials-sharing.md)。

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

非單純識別字的名稱（包含 `-`、以數字開頭，或為保留字）請使用括號形式：`$credentials["my-api-key"]`。

### Global Variables

使用 `$global.variableName` 來參照 [Global Variables](./global-variables.md) – 在 [Variables tab](../tabs/global-variables-tab.md) 中管理的持久性、使用者範圍的鍵值資料。

```
$global.environment
$global.settings.baseUrl
```

### 巢狀欄位

使用點記法來存取巢狀物件：

```
$llm.choices[0].message.content
$input.metadata.userId
```

## 常值

- **字串**：`"hello"` 或 `'hello'`
- **數字**：`42`、`3.14`
- **布林值**：`true`、`false`
- **Null**：`null`

## 型別保留

當**整個**值為單一 `$expr` 時，後端會保留原生型別：

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

當表達式是較大字串的一部分時，最終結果一律為字串：

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md) 節點是畫布上的文件，而非可執行的表達式欄位。其 `note` 內容會以 markdown 呈現，因此請使用一般的 markdown 連結與圖片，而非 `$...` 表達式。

Sticky notes 支援自訂顯示標題與六種已儲存的背景顏色：

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

允許的 `stickyColor` 值為 `yellow`、`sky`、`emerald`、`rose`、`violet` 與 `zinc`。

## 算術

支援的運算子：`+`、`-`、`*`、`/`、`%`

```
$input.count + 1
$llm.tokens * 2
```

## 比較

用於 [Condition](../nodes/condition-node.md) 節點：`==`、`!=`、`>`、`<`、`>=`、`<=`、`&&`、`||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop Context

在 [Loop](../nodes/loop-node.md) 節點內，使用 `item` 來參照目前的陣列元素：

```
item.name
item.value
```

## 特殊變數
- `$now` - 目前日期時間，附格式化方法
- `$Date()` - 建立／解析日期（例如 `$Date("2024-01-15")`）
- `$UUID` - 產生 32 字元唯一識別碼（沒有括號；請使用 `$UUID` 而非 `$UUID()`）
- `$workflowName` - 目前 workflow 的名稱
- `$workflowDescription` - 目前 workflow 的描述
- `$workflowPath` - workflow 的相對路徑，例如 `/workflows/<id>`
- `$workflowUrl` - workflow 的絕對 URL，例如 `https://<host>/workflows/<id>`
- `$executionId` - 目前執行的 id（等同於 [Execution History](./execution-history.md) 項目 id，因此 `/workflows/<id>/<executionId>` 會在畫布上開啟此次執行）。**僅限執行階段**：在表達式預覽對話框中為空；僅在 workflow 執行期間填入。
- `$vars` - Workflow 區域變數（透過 `$vars.variableName` 存取；透過 `variable` 節點更新）
- `$global` - 持久性全域變數儲存區（透過 `$global.variableName` 存取）
- `$page.record` - 僅適用於儀表板小工具 Workflow：小工具所在詳細資料頁面的記錄，取自儀表板的 `?record=` 參數。在未帶此參數開啟的儀表板上以及表達式預覽對話框中為 `null`。標記為 `page` 的節點具有優先權。請參閱[詳細資料頁面](../tabs/dashboard-tab.md#detail-pages)。

### $vars 用法
- `$vars.counter` - 存取名為 `counter` 的變數
- `$vars.myArray.add("item")` - 將項目加入陣列變數

### $global 用法
- `$global.environment` - 存取名為 `environment` 的全域變數
- `$global.settings.baseUrl` - 存取物件型別全域變數中的巢狀欄位

## Request Context (API Execution)
當 Workflow 透過 HTTP API 執行時，輸入節點會接收額外的請求中介資料：
- `$textInputLabel.body` - HTTP 請求 body 物件（原始 JSON payload）
- `$textInputLabel.headers` - HTTP 請求 headers 物件（所有 header 鍵皆為小寫）
- `$textInputLabel.query` - URL 查詢參數物件

存取請求資料的方式如下：
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Type Conversion Functions
- `str(value)` - 轉換為字串
- `int(value)` - 轉換為整數
- `float(value)` - 轉換為浮點數
- `bool(value)` - 轉換為布林值
- `list(value)` - 轉換為列表
- `dict(key=value, ...)` - 以關鍵字參數建立字典（例如 `$dict(name="Ali", age=30)`）

## Math Functions
- `len(value)` - 取得長度
- `abs(value)` - 絕對值
- `min(a, b)` - 最小值
- `max(a, b)` - 最大值
- `round(value)` - 四捨五入
- `sum(list)` - 列表加總
- `sorted(list)` - 排序列表
- `randomInt(min, max)` - 隨機整數

## Array Functions
- `$array(a, b, c)` - 以參數建立陣列（例如 `$array(1, 2, 3)` -> `[1, 2, 3]`）
- `$range(a, b)` - 建立從 `a` 到 `b` 的整數範圍，且不包含 `b`（例如 `$range(1, 5)` -> `[1, 2, 3, 4]`）
  - 當 `a > b` 時會失敗
- `notNull(list)` - 從陣列中移除 null 值

## String Building Function (for map/filter expressions)
- `concat(a, b, c, ...)` - 串接 N 個參數
  - 在 `.map()` 內以表達式字串使用（字串內不使用 `$`）
  - 在 concat 字串內使用單引號：
    - 正確：`concat('prefix', 'item.field', 'suffix')`

## Object Literals / Dictionaries
使用大括號語法搭配任意字串鍵來建立物件/字典：
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamic Keys
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Object Literal Rules
- 鍵可為任意字串（包含空格/特殊字元）
- 鍵必須以雙引號包覆（例如 `"key"`）
- 值可為字串/數字/布林值/表達式/巢狀物件

## String Functions
- `upper(text)` - 轉為大寫
- `lower(text)` - 轉為小寫
- `strip(text)` - 去除空白
- `capitalize(text)` - 首字母大寫
- `title(text)` - 每個單字首字母大寫
- `split(text, separator)` - 分割字串
- `join(separator, list)` - 串接列表
- `replace(text, old, new)` - 取代文字
- `regexReplace(text, pattern, replacement)` - 以 regex 模式取代
- `base64Encode(text)` - 將 UTF-8 文字編碼為標準 Base64
- `base64Decode(text)` - 將標準 Base64 解碼為 UTF-8 文字
- `toJson(text)` - 將 JSON 字串解析為物件、陣列或值

## String Methods (on string values)
- `.orEmpty()` - 回傳字串值，當值為 null/缺失時回傳 `""`
- `.upper()` / `.lower()` - 大小寫轉換
- `.strip()` - 去除空白
- `.capitalize()` / `.title()` - 首字母大寫
- `.length` - 字串長度
- `.toString()` - 轉換為字串
- `.substring(start, end)` - 擷取子字串
- `.contains(text)` - 檢查是否包含子字串
- `.startswith(prefix)` / `.endswith(suffix)` - 檢查前綴/後綴
- `.indexOf(text)` - 尋找位置（找不到時回傳 -1）
- `.replace(old, new)` - 取代第一個出現處
- `.replaceAll(old, new)` - 取代所有出現處
- `.regexReplace(pattern, replacement)` - 以 regex 模式取代
- `.hash()` - 字串的 MD5 雜湊
- `.base64Encode()` - 將 UTF-8 文字編碼為標準 Base64
- `.base64Decode()` - 將標準 Base64 解碼為 UTF-8 文字
- `.urlEncode()` - URL 編碼字串
- `.urlDecode()` - URL 解碼字串
- `.escape()` - JSON 跳脫字串（將特殊字元轉換為 JSON 格式）
- `.unescape()` - JSON 還原跳脫字串（將 JSON 格式轉換回原始字串）
- `.toJson()` - 將 JSON 字串解析為物件、陣列或值

### String Method Examples
- `$profile.nickname.orEmpty()` - 將可為 null/缺失的文字轉換為空字串
- `$text.upper()` - 轉為大寫
- `$text.lower()` - 轉為小寫
- `$text.strip()` - 移除空白
- `$text.replace("old", "new")` - 取代文字
- `$text.replaceAll("a", "b")` - 取代所有出現處
- `$text.length` - 取得字串長度
- `$text.escape()` - 跳脫特殊 JSON 字元（例如引號、換行）
- `$escapedText.unescape()` - 將 JSON 格式字串還原為原始字串
- `$text.toJson()` - 解析 JSON 物件/陣列字串（接著使用 `$text.toJson().repoUrl`）
- `$toJson($text)` - 與函式用法相同的解析
- `$base64Encode("Héym 🌍")` - 回傳 `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - 將 Base64 解碼為 UTF-8 文字
- `$text.urlEncode()` - 為 API 參數進行 URL 編碼
- `$encodedText.urlDecode()` - 解碼 URL 編碼文字

## 陣列方法（用於陣列）
- `.first()` - 取得第一個元素
- `.last()` - 取得最後一個元素
- `.random()` - 取得隨機元素
- `.reverse()` - 反轉陣列
- `.flat()` - 將巢狀陣列攤平為單一陣列
- `.flat(depth)` - 依指定深度限制攤平
- `.distinct()` - 移除重複項目
- `.distinctBy(expr)` - 依表達式移除重複項目（例如 `$array.distinctBy("item.id")`）
- `.notNull()` - 移除 null 值
- `.add(item)` - 附加項目（回傳新陣列）
- `.contains(item)` - 檢查陣列是否包含該項目（回傳布林值）
- `.join(separator)` - 將陣列元素串接為字串
- `.filter(expr)` - 使用 `item` 變數篩選陣列（例如 `$array.filter("item > 5")`）
- `.map(expr)` - 使用 `item` 變數轉換每個元素（例如 `$array.map("item.name")`）
- `.sort(expr, order)` - 依表達式排序，order 為 `"asc"`（預設）或 `"desc"`
- `.take(n)` - 取得前 N 個（正數）或後 N 個（負數）元素
- `.length` - 陣列長度
- `.toString()` - 轉換為 JSON 字串

### Filter / Map / Sort 範例
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## 物件／字典方法（用於物件）
- `.get(key)` - 依 key 取得值（找不到時回傳 null）
- `.get(key, default)` - 依 key 取得值，並提供預設值作為備援
- `.keys()` - 回傳所有 key 的列表
- `.values()` - 回傳所有 value 的列表
- `.entries()` - 回傳 `{key, value}` 物件的列表（每個屬性一項）
- `.filter(expr)` - 迭代 `{key, value}` 項目，並以列表形式回傳符合條件的項目（在 `expr` 內使用 `item.key` / `item.value`）
- `.map(expr)` - 迭代 `{key, value}` 項目，並回傳轉換後值的列表（在 `expr` 內使用 `item.key` / `item.value`）
- `.toString()` - 轉換為 JSON 字串

### 物件迭代範例
使用 `.map()` 或 `.filter()` 迭代物件時，每個 `item` 都是 `{key, value}` 配對：

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → 非 null 的屬性名稱列表

## 日期／時間
- `$now` - 目前日期時間
- `$now.format("YYYY-MM-DD")` - 格式化日期／時間
- `$now.toISO()` / `.toDate()` / `.toTime()` - 轉換格式
- `$now.addDays(n)` / `.addHours(n)` - 日期運算
- `$Date("2024-01-15")` - 解析日期字串

## 數值運算
- 基本數學運算：`+`、`-`、`*`、`/`、`%`
- 比較運算：`>`、`<`、`>=`、`<=`、`==`、`!=`
- 布林運算子：`and`、`or`、`not`

## 布林條件
針對布林值，請直接撰寫表達式（不要強制加上 `== true`）：
- 錯誤：`$nodeName.isValid == true`
- 正確：`$nodeName.isValid`
- 否定：`not $nodeName.isValid`

## 規則與白名單（重要）
### $ 放置規則
- 獨立表達式通常以開頭的 `$` 起始。
- 範本字串可包含多個 `$refs`。
- 當您想傳入另一個表達式的結果（動態 key 或巢狀解析）時，方法參數中也可包含巢狀 `$refs`。
  - 有效：`$node.method(other.field)` — `other` 會像頂層標籤一樣從 context 解析（參數內不含 `$`）。
  - 有效：`$node.method($other.field)` — 在 evaluate 對話框預覽與條件評估中支援巢狀 `$`。
  - 有效：`$array($a.x, $b.y)`
  - 在 `.get(` 內的自動完成會插入**裸**的 `label.field` 路徑（不含開頭的 `$`），與 `$array(...)` / `$notNull(...)` 內的行為相同。
- **Evaluate API（Run）：** 若整個提交的值是單一點路徑且**不含**開頭的 `$`（例如在編輯器中選取的文字，如 `execute.outputs.output.result.today`），後端會將其視為 `$execute.outputs.output.result.today`。若值在去除前後空白後包含換行或回車字元，則不會被改寫（避免多行 Payload 產生歧義）。在已儲存的 Workflow 欄位中，請優先撰寫 `$`；此改寫主要用於檢視與工具用途。
- Evaluate 對話框的 `Run` 結果是具體表達式如何解析的唯一依據。

### 陣列字串引號
建立含字串值的陣列時，一律使用雙引號：
- 正確：`$array("hello", "world")`
- 錯誤：`$array('hello', 'world')`

### 僅可使用這些函式（白名單）
僅可使用：
- `str()`、`int()`、`float()`、`bool()`、`list()`、`dict(key=value, ...)`
- `len()`、`abs()`、`min()`、`max()`、`round()`、`sum()`、`sorted()`
- `randomInt()`、`range()`、`array()`、`notNull()`
- `upper()`、`lower()`、`strip()`、`capitalize()`、`title()`
- `split()`、`join()`、`replace()`、`regexReplace()`、`hash()`
- `base64Encode()`、`base64Decode()`、`toJson()`
- 已記載的字串／陣列／物件方法

若函式未列於上方，即代表不存在。

### 陣列／字典方法限制
- 陣列僅可使用：`.first()`、`.last()`、`.random()`、`.reverse()`、`.flat()`、`.distinct()`、`.distinctBy()`、`.notNull()`、`.add()`、`.contains()`、`.join()`、`.filter()`、`.map()`、`.sort()`、`.take()`、`.length`、`.toString()`
- 物件／字典僅可使用：`.get(key)`、`.get(key, default)`、`.keys()`、`.values()`、`.entries()`、`.filter(expr)`、`.map(expr)`、`.toString()`

### 保留的節點標籤名稱
請勿將這些名稱用作節點標籤：`length`、`orEmpty`、`toString`、`toUpperCase`、`toLowerCase`、`substring`、`indexOf`、`contains`、`startsWith`、`endsWith`、`replace`、`replaceAll`、`regexReplace`、`hash`、`toJson`、`first`、`last`、`random`、`reverse`、`distinct`、`notNull`、`filter`、`map`、`entries`、`keys`、`values`、`sort`、`join`、`headers`、`query`、`value`、`list`、`result`、`array`、`vars`、`items`、`name`、`type`、`status`、`body`、`outputs`、`result`、`item`、`index`、`total`、`isFirst`、`isLast`、`branch`、`results`、`merged`、`error`、`errorNode`、`errorNodeType`、`timestamp`、`input`、`now`、`date`。

## 範例

**Condition**：`$input.text.length > 0`

**LLM user message**：`$input.text`

**Output message**：`$llm.text`

**Variable value**：`$input.count + 1`

### DSL 範例

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## 相關內容

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – 可展開的編輯器，具備後端即時預覽與自動完成功能
- [Canvas Features](./canvas-features.md) – 資料接腳，可在不重新執行節點的情況下測試表達式
- [Node Types](./node-types.md) – 使用表達式的節點（[LLM](../nodes/llm-node.md)、[Condition](../nodes/condition-node.md)、[Output](../nodes/output-node.md)、[Set](../nodes/set-node.md) 等）
- [Sticky Note](../nodes/sticky-note-node.md) – 畫布 Markdown 註記，具備可編輯標題、顏色與圖片顯示
- [Agent Node](../nodes/agent-node.md) – 在 agent prompts 中使用表達式
- [Agent Persistent Memory](./agent-persistent-memory.md) – agent `data` 中的 `persistentMemoryEnabled` 與 `memoryShares`（非表達式欄位）
- [Workflow Structure](./workflow-structure.md) – 可接受表達式的節點 `data` 欄位
- [Credentials Tab](../tabs/credentials-tab.md) – 節點所參照的 Credentials
- [Credentials Sharing](./credentials-sharing.md) – 分享 Credentials 並在表達式中使用 `$credentials`
- [Global Variables](./global-variables.md) – 使用 `$global` 的持久變數
