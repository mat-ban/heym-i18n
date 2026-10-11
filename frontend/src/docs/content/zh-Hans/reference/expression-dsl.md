# Expression DSL

Heym 使用一种简单的表达式语言来引用上游节点的数据。可在节点配置中使用表达式，例如 LLM 的 `userMessage`、Condition 的 `condition`、Output 的 `message`、Set 映射以及 Variable 值。使用[表达式求值对话框](./expression-evaluation-dialog.md)可获得更大的编辑器、由后端驱动的实时预览以及输出路径选择功能。

## 基本引用

### Input 节点与命名节点

- **`$input`** – 仅当存在单个上游 [Input](../nodes/input-node.md) 节点且您希望引用其输出时使用。示例：`$input.text`。这是“来自所连接输入的数据”的简写形式。
- **`$nodeLabel.field`** – 用于通过**标签**（节点数据中的 `label`）引用任意上游节点。当您有多个节点，或 AI Assistant / workflow DSL 需要显式标签时，优先使用此形式。示例：`$userInput.body.text`、`$myLLM.text`。

**何时使用哪种形式：**

| 场景 | 优先使用 | 示例 |
|--------|--------|---------|
| 单个输入节点、简单流程 | `$input.text` | 来自单个 Input 的 Output message |
| 多个节点或命名引用 | `$nodeLabel.field` | `$userInput.body.text`、`$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | 始终使用 `$nodeLabel.field` | workflow 构建器需要标签，而非 `$input` |

### Input 节点

当存在单个上游输入时，使用 `$input` 引用 Input 节点的数据：

```
$input.text
```

### 命名节点

通过标签引用任意上游节点。当节点具有[固定数据](./canvas-features.md#data-pin)时，表达式补全会使用该数据而非执行输出。

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

使用 `$credentials.CredentialName` 按名称引用 credential 值（例如 API key、bearer token 或 Notion 集成 token）。请参阅 [Credentials 共享](./credentials-sharing.md)。

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

非普通标识符的名称（包含 `-`、以数字开头或为保留字）使用方括号形式：`$credentials["my-api-key"]`。

### 全局变量

使用 `$global.variableName` 引用[全局变量](./global-variables.md)——在[变量选项卡](../tabs/global-variables-tab.md)中管理的持久化、用户范围的键值数据。

```
$global.environment
$global.settings.baseUrl
```

### 嵌套字段

对嵌套对象使用点表示法：

```
$llm.choices[0].message.content
$input.metadata.userId
```

## 字面量

- **字符串**：`"hello"` 或 `'hello'`
- **数字**：`42`、`3.14`
- **布尔值**：`true`、`false`
- **Null**：`null`

## 类型保留

当**整个**值为单个 `$expr` 时，后端会保留原生类型：

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

当表达式是更大字符串的一部分时，最终结果始终为字符串：

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## 便签

[便签](../nodes/sticky-note-node.md)节点是画布文档，而非可执行的表达式字段。其 `note` 内容以 markdown 渲染，因此请使用常规 markdown 链接和图片，而非 `$...` 表达式。

便签支持自定义显示标题和六种保存的背景颜色：

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

允许的 `stickyColor` 值为 `yellow`、`sky`、`emerald`、`rose`、`violet` 和 `zinc`。

## 算术运算

支持的运算符：`+`、`-`、`*`、`/`、`%`

```
$input.count + 1
$llm.tokens * 2
```

## 比较运算

在 [Condition](../nodes/condition-node.md) 节点中使用：`==`、`!=`、`>`、`<`、`>=`、`<=`、`&&`、`||`

```
$input.text.length > 0
$llm.text != ""
```

## 循环上下文

在 [Loop](../nodes/loop-node.md) 节点内部，使用 `item` 引用当前数组元素：

```
item.name
item.value
```

## 特殊变量
- `$now` - 当前日期时间，带有格式化方法
- `$Date()` - 创建/解析日期（例如 `$Date("2024-01-15")`）
- `$UUID` - 生成 32 字符唯一标识符（无括号；使用 `$UUID` 而非 `$UUID()`）
- `$workflowName` - 当前 workflow 的名称
- `$workflowDescription` - 当前 workflow 的描述
- `$workflowPath` - workflow 的相对路径，例如 `/workflows/<id>`
- `$workflowUrl` - workflow 的绝对 URL，例如 `https://<host>/workflows/<id>`
- `$executionId` - 当前执行的 id（等同于[执行历史](./execution-history.md)条目 id，因此 `/workflows/<id>/<executionId>` 可在画布上打开本次运行）。**仅限运行时**：在表达式预览对话框中为空；仅在 workflow 执行期间填充。
- `$vars` - Workflow 局部变量（通过 `$vars.variableName` 访问；通过 `variable` 节点更新）
- `$global` - 持久化全局变量存储（通过 `$global.variableName` 访问）

### $vars 用法
- `$vars.counter` - 访问名为 `counter` 的变量
- `$vars.myArray.add("item")` - 向数组变量添加项

### $global 用法
- `$global.environment` - 访问名为 `environment` 的全局变量
- `$global.settings.baseUrl` - 访问对象类型全局变量中的嵌套字段

## 请求上下文（API 执行）
当 Workflow 通过 HTTP API 执行时，输入节点会接收额外的请求元数据：
- `$textInputLabel.body` - HTTP 请求体对象（原始 JSON payload）
- `$textInputLabel.headers` - HTTP 请求头对象（所有 header 键均为小写）
- `$textInputLabel.query` - URL 查询参数对象

访问请求数据的方式：
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## 类型转换函数
- `str(value)` - 转换为字符串
- `int(value)` - 转换为整数
- `float(value)` - 转换为浮点数
- `bool(value)` - 转换为布尔值
- `list(value)` - 转换为列表
- `dict(key=value, ...)` - 使用关键字参数创建字典（例如 `$dict(name="Ali", age=30)`）

## 数学函数
- `len(value)` - 获取长度
- `abs(value)` - 绝对值
- `min(a, b)` - 最小值
- `max(a, b)` - 最大值
- `round(value)` - 四舍五入
- `sum(list)` - 列表求和
- `sorted(list)` - 列表排序
- `randomInt(min, max)` - 随机整数

## 数组函数
- `$array(a, b, c)` - 从参数创建数组（例如 `$array(1, 2, 3)` -> `[1, 2, 3]`）
- `$range(a, b)` - 创建从 `a` 到 `b` 的整数范围，不包含 `b`（例如 `$range(1, 5)` -> `[1, 2, 3, 4]`）
  - 当 `a > b` 时失败
- `notNull(list)` - 从数组中移除 null 值

## 字符串构建函数（用于 map/filter 表达式）
- `concat(a, b, c, ...)` - 拼接 N 个参数
  - 在 `.map()` 中作为表达式字符串使用（字符串内不使用 `$`）
  - 在 concat 字符串内使用单引号：
    - 正确：`concat('prefix', 'item.field', 'suffix')`

## 对象字面量 / 字典
使用花括号语法创建对象/字典，键可为任意字符串：
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### 动态键
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### 对象字面量规则
- 键可以是任意字符串（包括空格/特殊字符）
- 键必须使用双引号包裹（例如 `"key"`）
- 值可以是字符串/数字/布尔值/表达式/嵌套对象

## 字符串函数
- `upper(text)` - 转为大写
- `lower(text)` - 转为小写
- `strip(text)` - 去除空白字符
- `capitalize(text)` - 首字母大写
- `title(text)` - 标题大小写
- `split(text, separator)` - 拆分字符串
- `join(separator, list)` - 拼接列表
- `replace(text, old, new)` - 替换文本
- `regexReplace(text, pattern, replacement)` - 使用正则表达式替换
- `base64Encode(text)` - 将 UTF-8 文本编码为标准 Base64
- `base64Decode(text)` - 将标准 Base64 解码为 UTF-8 文本
- `toJson(text)` - 将 JSON 字符串解析为对象、数组或值

## 字符串方法（作用于字符串值）
- `.orEmpty()` - 返回字符串值，当值为 null/缺失时返回 `""`
- `.upper()` / `.lower()` - 大小写转换
- `.strip()` - 去除空白字符
- `.capitalize()` / `.title()` - 首字母大写
- `.length` - 字符串长度
- `.toString()` - 转换为字符串
- `.substring(start, end)` - 提取子字符串
- `.contains(text)` - 检查是否包含子字符串
- `.startswith(prefix)` / `.endswith(suffix)` - 检查前缀/后缀
- `.indexOf(text)` - 查找位置（未找到时返回 -1）
- `.replace(old, new)` - 替换首次出现的内容
- `.replaceAll(old, new)` - 替换所有出现的内容
- `.regexReplace(pattern, replacement)` - 使用正则表达式替换
- `.hash()` - 字符串的 MD5 哈希
- `.base64Encode()` - 将 UTF-8 文本编码为标准 Base64
- `.base64Decode()` - 将标准 Base64 解码为 UTF-8 文本
- `.urlEncode()` - URL 编码字符串
- `.urlDecode()` - URL 解码字符串
- `.escape()` - JSON 转义字符串（将特殊字符转换为 JSON 格式）
- `.unescape()` - JSON 反转义字符串（将 JSON 格式转换回原始字符串）
- `.toJson()` - 将 JSON 字符串解析为对象、数组或值

### 字符串方法示例
- `$profile.nickname.orEmpty()` - 将可空/缺失的文本转换为空字符串
- `$text.upper()` - 转换为大写
- `$text.lower()` - 转换为小写
- `$text.strip()` - 去除空白字符
- `$text.replace("old", "new")` - 替换文本
- `$text.replaceAll("a", "b")` - 替换所有出现的内容
- `$text.length` - 获取字符串长度
- `$text.escape()` - 转义特殊 JSON 字符（例如引号、换行符）
- `$escapedText.unescape()` - 将 JSON 格式字符串反转义回原始内容
- `$text.toJson()` - 解析 JSON 对象/数组字符串（然后使用 `$text.toJson().repoUrl`）
- `$toJson($text)` - 与函数方式解析相同
- `$base64Encode("Héym 🌍")` - 返回 `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - 将 Base64 解码为 UTF-8 文本
- `$text.urlEncode()` - 为 API 参数进行 URL 编码
- `$encodedText.urlDecode()` - 解码 URL 编码的文本

## 数组方法（作用于数组）
- `.first()` - 获取第一个元素
- `.last()` - 获取最后一个元素
- `.random()` - 获取随机元素
- `.reverse()` - 反转数组
- `.flat()` - 将嵌套数组展平为单个数组
- `.flat(depth)` - 按深度限制展平
- `.distinct()` - 移除重复项
- `.distinctBy(expr)` - 按表达式移除重复项（例如 `$array.distinctBy("item.id")`）
- `.notNull()` - 移除 null 值
- `.add(item)` - 追加元素（返回新数组）
- `.contains(item)` - 检查数组是否包含指定元素（返回布尔值）
- `.join(separator)` - 将数组元素拼接为字符串
- `.filter(expr)` - 使用 `item` 变量过滤数组（例如 `$array.filter("item > 5")`）
- `.map(expr)` - 使用 `item` 变量转换每个元素（例如 `$array.map("item.name")`）
- `.sort(expr, order)` - 按表达式排序，order 为 `"asc"`（默认）或 `"desc"`
- `.take(n)` - 取前 N 个（正数）或后 N 个（负数）元素
- `.length` - 数组长度
- `.toString()` - 转换为 JSON 字符串

### Filter / Map / Sort 示例
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## 对象/字典方法（作用于对象）
- `.get(key)` - 按键获取值（未找到时返回 null）
- `.get(key, default)` - 按键获取值，并提供默认回退值
- `.keys()` - 返回所有键的列表
- `.values()` - 返回所有值的列表
- `.entries()` - 返回 `{key, value}` 对象的列表（每个属性一个）
- `.filter(expr)` - 遍历 `{key, value}` 条目，并将匹配的条目作为列表返回（在 `expr` 中使用 `item.key` / `item.value`）
- `.map(expr)` - 遍历 `{key, value}` 条目，并返回转换后的值列表（在 `expr` 中使用 `item.key` / `item.value`）
- `.toString()` - 转换为 JSON 字符串

### 对象遍历示例
使用 `.map()` 或 `.filter()` 遍历对象时，每个 `item` 都是一个 `{key, value}` 对：

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → 非 null 的属性名列表

## 日期/时间
- `$now` - 当前日期时间
- `$now.format("YYYY-MM-DD")` - 格式化日期/时间
- `$now.toISO()` / `.toDate()` / `.toTime()` - 转换格式
- `$now.addDays(n)` / `.addHours(n)` - 日期运算
- `$Date("2024-01-15")` - 解析日期字符串

## 数值运算
- 基本数学运算：`+`、`-`、`*`、`/`、`%`
- 比较运算：`>`、`<`、`>=`、`<=`、`==`、`!=`
- 布尔运算符：`and`、`or`、`not`

## 布尔条件
对于布尔值，直接编写表达式（不要强制使用 `== true`）：
- 错误：`$nodeName.isValid == true`
- 正确：`$nodeName.isValid`
- 取反：`not $nodeName.isValid`

## 规则与白名单（关键）
### $ 放置规则
- 独立表达式通常以开头的 `$` 开始。
- 模板字符串可以包含多个 `$refs`。
- 当您希望传递另一个表达式的结果（动态键或嵌套解析）时，方法参数中也可以包含嵌套的 `$refs`。
  - 有效：`$node.method(other.field)` — `other` 像顶层标签一样从上下文中解析（参数内没有 `$`）。
  - 有效：`$node.method($other.field)` — 在求值对话框预览和条件求值中支持嵌套 `$`。
  - 有效：`$array($a.x, $b.y)`
  - 在 `.get(` 内自动补全会插入**裸** `label.field` 路径（没有开头的 `$`），与 `$array(...)` / `$notNull(...)` 内相同。
- **Evaluate API (Run)：** 如果整个提交的值是单个点路径且**没有**开头的 `$`（例如编辑器中选中的文本，如 `execute.outputs.output.result.today`），后端会将其视为与 `$execute.outputs.output.result.today` 相同。修剪后包含换行符或回车符的值不会被重写（避免产生歧义的多行 payload）。在保存的 workflow 字段中，建议写入 `$`；重写主要用于检查和工具用途。
- Evaluate 对话框的 `Run` 结果是具体表达式如何解析的权威依据。

### 数组字符串引号
使用字符串值创建数组时，务必使用双引号：
- 正确：`$array("hello", "world")`
- 错误：`$array('hello', 'world')`

### 仅使用这些函数（白名单）
仅使用：
- `str()`、`int()`、`float()`、`bool()`、`list()`、`dict(key=value, ...)`
- `len()`、`abs()`、`min()`、`max()`、`round()`、`sum()`、`sorted()`
- `randomInt()`、`range()`、`array()`、`notNull()`
- `upper()`、`lower()`、`strip()`、`capitalize()`、`title()`
- `split()`、`join()`、`replace()`、`regexReplace()`、`hash()`
- `base64Encode()`、`base64Decode()`、`toJson()`
- 已文档化的字符串/数组/对象方法

如果某个函数未列在上面，则该函数不存在。

### 数组 / 字典方法限制
- 数组只能使用：`.first()`、`.last()`、`.random()`、`.reverse()`、`.flat()`、`.distinct()`、`.distinctBy()`、`.notNull()`、`.add()`、`.contains()`、`.join()`、`.filter()`、`.map()`、`.sort()`、`.take()`、`.length`、`.toString()`
- 对象/字典只能使用：`.get(key)`、`.get(key, default)`、`.keys()`、`.values()`、`.entries()`、`.filter(expr)`、`.map(expr)`、`.toString()`

### 保留的节点标签名称
请勿将这些名称用作节点标签：`length`、`orEmpty`、`toString`、`toUpperCase`、`toLowerCase`、`substring`、`indexOf`、`contains`、`startsWith`、`endsWith`、`replace`、`replaceAll`、`regexReplace`、`hash`、`toJson`、`first`、`last`、`random`、`reverse`、`distinct`、`notNull`、`filter`、`map`、`entries`、`keys`、`values`、`sort`、`join`、`headers`、`query`、`value`、`list`、`result`、`array`、`vars`、`items`、`name`、`type`、`status`、`body`、`outputs`、`result`、`item`、`index`、`total`、`isFirst`、`isLast`、`branch`、`results`、`merged`、`error`、`errorNode`、`errorNodeType`、`timestamp`、`input`、`now`、`date`。

## 示例

**Condition**：`$input.text.length > 0`

**LLM user message**：`$input.text`

**Output message**：`$llm.text`

**Variable value**：`$input.count + 1`

### DSL 示例

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## 相关内容

- [表达式求值对话框](./expression-evaluation-dialog.md) – 可展开的编辑器，支持后端实时预览与自动补全
- [画布功能](./canvas-features.md) – 数据引脚，用于在不重新运行节点的情况下测试表达式
- [节点类型](./node-types.md) – 使用表达式的节点（[LLM](../nodes/llm-node.md)、[Condition](../nodes/condition-node.md)、[Output](../nodes/output-node.md)、[Set](../nodes/set-node.md) 等）
- [便签](../nodes/sticky-note-node.md) – 画布 Markdown 笔记，支持可编辑标题、颜色和图片显示
- [Agent 节点](../nodes/agent-node.md) – 在 agent prompts 中使用表达式
- [Agent 持久记忆](./agent-persistent-memory.md) – agent `data` 中的 `persistentMemoryEnabled` 和 `memoryShares`（非表达式字段）
- [Workflow 结构](./workflow-structure.md) – 接受表达式的节点 `data` 字段
- [Credentials 标签页](../tabs/credentials-tab.md) – 节点引用的 Credentials
- [Credentials 共享](./credentials-sharing.md) – 共享 Credentials 并在表达式中使用 `$credentials`
- [全局变量](./global-variables.md) – 使用 `$global` 的持久变量
