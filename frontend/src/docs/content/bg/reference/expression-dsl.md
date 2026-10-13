# Expression DSL

Heym използва опростен език за изрази, с който да реферирате данни от предходни nodes. Използвайте изрази в конфигурацията на nodes, като например LLM `userMessage`, Condition `condition`, Output `message`, Set mappings и стойности на променливи. Използвайте [Expression Evaluation Dialog](./expression-evaluation-dialog.md) за по-голям редактор, live preview, захранван от backend, и избор на output path.

## Основни референции

### Input Node срещу именувани nodes

- **`$input`** – Използвайте само когато има един предходен [Input](../nodes/input-node.md) node и искате да реферирате неговия output. Пример: `$input.text`. Това е съкращение за „данните от свързания input“.
- **`$nodeLabel.field`** – Използвайте, за да реферирате който и да е предходен node чрез неговия **label** (`label` в данните на node). Предпочитайте това, когато имате няколко nodes или когато AI Assistant / workflow DSL очаква явни labels. Пример: `$userInput.body.text`, `$myLLM.text`.

**Кога кое да използвате:**

| Контекст | Предпочитайте | Пример |
|--------|--------|---------|
| Единичен input node, прост flow | `$input.text` | Output message от един Input |
| Няколко nodes или именувани референции | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Винаги `$nodeLabel.field` | Workflow builder-ът очаква labels, не `$input` |

### Input Node

Използвайте `$input`, за да реферирате данните на Input node, когато има един предходен input:

```
$input.text
```

### Именувани nodes

Реферирайте който и да е предходен node чрез неговия label. Когато даден node има [pinned data](./canvas-features.md#data-pin), expression completion използва тях вместо execution output.

```
$llm.text
$httpResponse.body
$condition
```

### Удостоверения

Използвайте `$credentials.CredentialName`, за да реферирате стойности на удостоверения (напр. API keys, bearer tokens или Notion integration tokens) по име. Вижте [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Имена, които не са обикновени идентификатори (съдържат `-`, започват с цифра или са запазени думи), използват формата с квадратни скоби: `$credentials["my-api-key"]`.

### Глобални променливи

Използвайте `$global.variableName`, за да реферирате [Global Variables](./global-variables.md) – постоянни, обвързани с потребителя key-value данни, управлявани в [Variables tab](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Вложени полета

Използвайте dot нотация за вложени обекти:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Литерали

- **Strings**: `"hello"` или `'hello'`
- **Numbers**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Запазване на типа

Когато **цялата** стойност е един `$expr`, backend-ът запазва оригиналния тип:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Когато изразът е част от по-голям string, крайният резултат винаги е string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md) nodes са документация на canvas-а, а не изпълними expression полета. Тяхното `note` съдържание се рендерира като markdown, затова използвайте обикновени markdown връзки и изображения вместо `$...` изрази.

Sticky notes поддържат персонализирано заглавие за показване и шест запазени фонови цвята:

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

Позволените стойности за `stickyColor` са `yellow`, `sky`, `emerald`, `rose`, `violet` и `zinc`.

## Аритметика

Поддържани оператори: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Сравнения

Използвайте в [Condition](../nodes/condition-node.md) nodes: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Контекст на Loop

Вътре в [Loop](../nodes/loop-node.md) node използвайте `item`, за да реферирате текущия елемент от масива:

```
item.name
item.value
```

## Специални променливи
- `$now` - Текуща дата и час с методи за форматиране
- `$Date()` - Създаване/парсване на дата (напр. `$Date("2024-01-15")`)
- `$UUID` - Генерира 32-символен уникален идентификатор (БЕЗ скоби; използвайте `$UUID`, не `$UUID()`)
- `$workflowName` - Име на текущия workflow
- `$workflowDescription` - Описание на текущия workflow
- `$workflowPath` - Относителен път на workflow-а, напр. `/workflows/<id>`
- `$workflowUrl` - Абсолютен URL на workflow-а, напр. `https://<host>/workflows/<id>`
- `$executionId` - Id на текущото изпълнение (съвпада с id на записа в [Execution History](./execution-history.md), така че `/workflows/<id>/<executionId>` отваря това изпълнение на canvas-а). **Само по време на изпълнение**: празно в expression preview dialog-а; попълва се само докато workflow-ът се изпълнява.
- `$vars` - Локални за workflow-а променливи (достъп чрез `$vars.variableName`; обновяват се чрез `variable` node)
- `$global` - Постоянно глобално хранилище за променливи (достъп чрез `$global.variableName`)
- `$page.record` - Само за workflow на уиджети от таблото: записът на детайлната страница, на която се намира уиджетът, от параметъра `?record=` на таблото. Има стойност `null` в табло, отворено без такъв параметър, както и в диалога за преглед на изрази. Възел с етикет `page` има предимство. Вижте [Детайлни страници](../tabs/dashboard-tab.md#detail-pages).

### Използване на $vars
- `$vars.counter` - Достъп до променлива с име `counter`
- `$vars.myArray.add("item")` - Добавяне на елемент към променлива от тип масив

### Използване на $global
- `$global.environment` - Достъп до глобална променлива с име `environment`
- `$global.settings.baseUrl` - Достъп до вложени полета в глобална променлива от тип обект
## Контекст на заявката (API изпълнение)
Когато даден workflow се изпълнява чрез HTTP API, входните nodes получават допълнителни метаданни за заявката:
- `$textInputLabel.body` - обект на тялото на HTTP заявката (суров JSON payload)
- `$textInputLabel.headers` - обект на HTTP хедърите на заявката (всички ключове на хедърите са с малки букви)
- `$textInputLabel.query` - обект на URL query параметрите

Достъп до данните от заявката:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Функции за преобразуване на типове
- `str(value)` - Преобразуване в string
- `int(value)` - Преобразуване в integer
- `float(value)` - Преобразуване в float
- `bool(value)` - Преобразуване в boolean
- `list(value)` - Преобразуване в list
- `dict(key=value, ...)` - Създаване на dictionary с keyword аргументи (напр. `$dict(name="Ali", age=30)`)

## Математически функции
- `len(value)` - Връща дължина
- `abs(value)` - Абсолютна стойност
- `min(a, b)` - Минимална стойност
- `max(a, b)` - Максимална стойност
- `round(value)` - Закръгляне на число
- `sum(list)` - Сума на list
- `sorted(list)` - Сортиране на list
- `randomInt(min, max)` - Случайно цяло число

## Функции за масиви
- `$array(a, b, c)` - Създаване на array от аргументите (напр. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Създаване на диапазон от цели числа от `a` до `b`, като `b` е изключен (напр. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Връща грешка, когато `a > b`
- `notNull(list)` - Премахване на null стойности от array

## Функция за изграждане на низове (за map/filter изрази)
- `concat(a, b, c, ...)` - Конкатениране на N аргумента
  - Използва се вътре в `.map()` като expression string (без `$` вътре в низа)
  - Използвайте единични кавички вътре в concat низа:
    - Правилно: `concat('prefix', 'item.field', 'suffix')`

## Object Literals / Dictionaries
Създаване на objects/dictionaries чрез синтаксис с къдрави скоби с произволни string ключове:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Динамични ключове
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Правила за Object Literal
- Ключовете могат да бъдат произволен string (включително интервали/специални символи)
- Ключовете ТРЯБВА да бъдат оградени с двойни кавички (напр. `"key"`)
- Стойностите могат да бъдат strings/numbers/booleans/expressions/вложени objects

## Функции за низове
- `upper(text)` - Главни букви
- `lower(text)` - Малки букви
- `strip(text)` - Премахване на интервали в началото и края
- `capitalize(text)` - Първа буква главна
- `title(text)` - Главна буква на всяка дума
- `split(text, separator)` - Разделяне на низ
- `join(separator, list)` - Обединяване на list
- `replace(text, old, new)` - Замяна на текст
- `regexReplace(text, pattern, replacement)` - Замяна с regex pattern
- `base64Encode(text)` - Кодиране на UTF-8 текст като стандартен Base64
- `base64Decode(text)` - Декодиране на стандартен Base64 в UTF-8 текст
- `toJson(text)` - Парсване на JSON низ в object, array или стойност

## Методи за низове (върху string стойности)
- `.orEmpty()` - Връща стойността на низа или `""`, когато стойността е null/липсва
- `.upper()` / `.lower()` - Преобразуване на регистъра
- `.strip()` - Премахване на интервали в началото и края
- `.capitalize()` / `.title()` - Главна буква
- `.length` - Дължина на низа
- `.toString()` - Преобразуване в string
- `.substring(start, end)` - Извличане на подниз
- `.contains(text)` - Проверка дали съдържа подниз
- `.startswith(prefix)` / `.endswith(suffix)` - Проверка на префикс/суфикс
- `.indexOf(text)` - Намиране на позиция (връща -1, ако не бъде намерена)
- `.replace(old, new)` - Замяна на първото срещане
- `.replaceAll(old, new)` - Замяна на всички срещания
- `.regexReplace(pattern, replacement)` - Замяна с regex pattern
- `.hash()` - MD5 hash на низа
- `.base64Encode()` - Кодиране на UTF-8 текст като стандартен Base64
- `.base64Decode()` - Декодиране на стандартен Base64 в UTF-8 текст
- `.urlEncode()` - URL кодиране на низ
- `.urlDecode()` - URL декодиране на низ
- `.escape()` - JSON escape на низ (преобразуване на специални символи в JSON формат)
- `.unescape()` - JSON unescape на низ (преобразуване на JSON формат в оригинален низ)
- `.toJson()` - Парсване на JSON низ в object, array или стойност

### Примери за методи за низове
- `$profile.nickname.orEmpty()` - Преобразуване на nullable/липсващ текст в празен низ
- `$text.upper()` - Преобразуване в главни букви
- `$text.lower()` - Преобразуване в малки букви
- `$text.strip()` - Премахване на интервали
- `$text.replace("old", "new")` - Замяна на текст
- `$text.replaceAll("a", "b")` - Замяна на всички срещания
- `$text.length` - Връщане на дължината на низа
- `$text.escape()` - Escape на специални JSON символи (напр. кавички, нови редове)
- `$escapedText.unescape()` - Unescape на JSON форматиран низ обратно към оригинала
- `$text.toJson()` - Парсване на JSON object/array низ (след това `$text.toJson().repoUrl`)
- `$toJson($text)` - Същото парсване като функция
- `$base64Encode("Héym 🌍")` - Връща `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Декодиране на Base64 в UTF-8 текст
- `$text.urlEncode()` - URL кодиране за API параметри
- `$encodedText.urlDecode()` - Декодиране на URL кодиран текст
## Методи за масиви (върху масиви)
- `.first()` - Връща първия елемент
- `.last()` - Връща последния елемент
- `.random()` - Връща случаен елемент
- `.reverse()` - Обръща масива
- `.flat()` - Разгъва вложените масиви в единен масив
- `.flat(depth)` - Разгъва с ограничение на дълбочината
- `.distinct()` - Премахва дубликатите
- `.distinctBy(expr)` - Премахва дубликатите по израз (напр. `$array.distinctBy("item.id")`)
- `.notNull()` - Премахва null стойностите
- `.add(item)` - Добавя елемент (връща нов масив)
- `.contains(item)` - Проверява дали масивът съдържа елемента (връща boolean)
- `.join(separator)` - Обединява елементите на масива в низ
- `.filter(expr)` - Филтрира масива чрез променливата `item` (напр. `$array.filter("item > 5")`)
- `.map(expr)` - Трансформира всеки елемент чрез променливата `item` (напр. `$array.map("item.name")`)
- `.sort(expr, order)` - Сортира по израз; order е `"asc"` (по подразбиране) или `"desc"`
- `.take(n)` - Взема първите N (положително) или последните N (отрицателно) елемента
- `.length` - Дължина на масива
- `.toString()` - Преобразува в JSON низ

### Примери за Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Методи за обекти/речници (върху обекти)
- `.get(key)` - Връща стойност по ключ (връща null, ако не бъде намерена)
- `.get(key, default)` - Връща стойност по ключ с резервна стойност по подразбиране
- `.keys()` - Връща списък с всички ключове
- `.values()` - Връща списък с всички стойности
- `.entries()` - Връща списък от обекти `{key, value}` (по един за всяко свойство)
- `.filter(expr)` - Обхожда записите `{key, value}` и връща съвпадащите записи като списък (използвайте `item.key` / `item.value` в `expr`)
- `.map(expr)` - Обхожда записите `{key, value}` и връща списък от трансформирани стойности (използвайте `item.key` / `item.value` в `expr`)
- `.toString()` - Преобразува в JSON низ

### Примери за обхождане на обекти
При обхождане на обект с `.map()` или `.filter()` всеки `item` е двойка `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → списък с имената на свойствата, които не са null

## Дата/Час
- `$now` - Текуща дата и час
- `$now.format("YYYY-MM-DD")` - Форматира дата/час
- `$now.toISO()` / `.toDate()` / `.toTime()` - Преобразува формати
- `$now.addDays(n)` / `.addHours(n)` - Изчисления с дати
- `$Date("2024-01-15")` - Парсва низ за дата

## Числови операции
- Основни математически операции: `+`, `-`, `*`, `/`, `%`
- Сравнения: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Булеви оператори: `and`, `or`, `not`

## Булеви условия
За булеви стойности напишете израза директно (не налагайте `== true`):
- Грешно: `$nodeName.isValid == true`
- Правилно: `$nodeName.isValid`
- Отрицание: `not $nodeName.isValid`

## Правила и бял списък (критично)
### Правила за поставяне на `$`
- Самостоятелен израз обикновено започва с водещ `$`.
- Шаблонните низове могат да съдържат множество `$refs`.
- Параметрите на методите също могат да съдържат вложени `$refs`, когато желаете да подадете резултата от друг израз (динамичен ключ или вложено разрешаване).
  - Валидно: `$node.method(other.field)` — `other` се разрешава от контекста като label на най-горно ниво (без `$` в аргумента).
  - Валидно: `$node.method($other.field)` — вложен `$` се поддържа в прегледа на диалога за оценяване и при оценяване на условия.
  - Валидно: `$array($a.x, $b.y)`
  - Автоматичното довършване в `.get(` вмъква **голи** пътища `label.field` (без водещ `$`), също както в `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Ако цялата подадена стойност е единичен dot path **без** водещ `$` (например текст, избран в редактора, като `execute.outputs.output.result.today`), backend-ът го третира по същия начин като `$execute.outputs.output.result.today`. Стойности, които съдържат нов ред или carriage return след trim, не се пренаписват (избягва се двусмислен multi-line payload). Предпочитайте да пишете `$` в запазените полета на workflow; пренаписването е основно за инспекция и инструменти.
- Резултатът от `Run` в диалога за оценяване е източникът на истина за това как се разрешава конкретен израз.

### Кавички за низове в масиви
Когато създавате масиви със стойности от тип низ, ВИНАГИ използвайте двойни кавички:
- Правилно: `$array("hello", "world")`
- Грешно: `$array('hello', 'world')`

### ИЗПОЛЗВАЙТЕ САМО ТЕЗИ ФУНКЦИИ (бял списък)
Използвайте САМО:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- документираните методи за низове/масиви/обекти

Ако дадена функция не е изброена по-горе, тя не съществува.

### Ограничения за методите на масиви / речници
- Масивите могат да използват САМО: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Обектите/речниците могат да използват САМО: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Резервирани имена на етикети на възли
Не използвайте следните имена като етикети на възли: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Примери

**Условие**: `$input.text.length > 0`

**Потребителско съобщение към LLM**: `$input.text`

**Изходно съобщение**: `$llm.text`

**Стойност на променлива**: `$input.count + 1`

### Пример с DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Свързани

- [Диалог за оценка на изрази](./expression-evaluation-dialog.md) – Разгъваем редактор с преглед на живо от backend и автодовършване
- [Функции на Canvas](./canvas-features.md) – Data pin за тестване на изрази без повторно изпълнение на възли
- [Типове възли](./node-types.md) – Възли, които използват изрази ([LLM](../nodes/llm-node.md), [Условие](../nodes/condition-node.md), [Изход](../nodes/output-node.md), [Set](../nodes/set-node.md) и др.)
- [Sticky Note](../nodes/sticky-note-node.md) – Markdown бележки в Canvas с редактируемо заглавие, цвят и показване на изображения
- [Agent Node](../nodes/agent-node.md) – Използване на изрази в prompt-ове на агенти
- [Постоянна памет на агента](./agent-persistent-memory.md) – `persistentMemoryEnabled` и `memoryShares` в `data` на агента (не са полета за изрази)
- [Структура на Workflow](./workflow-structure.md) – Полета `data` на възли, които приемат изрази
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Удостоверения, реферирани от възли
- [Споделяне на удостоверения](./credentials-sharing.md) – Споделяне на удостоверения и използване на `$credentials` в изрази
- [Глобални променливи](./global-variables.md) – Постоянни променливи с `$global`
