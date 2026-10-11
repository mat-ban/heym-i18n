# Expression DSL

Heym використовує просту мову виразів для посилання на дані з висхідних вузлів. Використовуйте вирази в конфігурації вузлів, як-от LLM `userMessage`, Condition `condition`, Output `message`, зіставлення Set та значення Variable. Використовуйте [Expression Evaluation Dialog](./expression-evaluation-dialog.md) для більшого редактора, живого попереднього перегляду на базі бекенду та вибору шляхів виводу.

## Базові посилання

### Вузол Input проти іменованих вузлів

- **`$input`** – Використовуйте лише тоді, коли є єдиний висхідний вузол [Input](../nodes/input-node.md) і Ви хочете посилатися на його вивід. Приклад: `$input.text`. Це скорочення для "даних із під'єднаного входу."
- **`$nodeLabel.field`** – Використовуйте для посилання на будь-який висхідний вузол за його **label** (поле `label` у даних вузла). Надавайте перевагу цьому, коли у Вас є кілька вузлів або коли AI Assistant / workflow DSL очікує явні label. Приклад: `$userInput.body.text`, `$myLLM.text`.

**Коли що використовувати:**

| Контекст | Перевага | Приклад |
|--------|--------|---------|
| Єдиний вузол input, простий потік | `$input.text` | Повідомлення Output з одного Input |
| Кілька вузлів або іменовані посилання | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Завжди `$nodeLabel.field` | Конструктор workflow очікує label, а не `$input` |

### Вузол Input

Використовуйте `$input` для посилання на дані вузла Input, коли є єдиний висхідний input:

```
$input.text
```

### Іменовані вузли

Посилайтеся на будь-який висхідний вузол за його label. Коли вузол має [закріплені дані](./canvas-features.md#data-pin), автодоповнення виразів використовує їх замість виводу виконання.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Використовуйте `$credentials.CredentialName` для посилання на значення credential (наприклад, API keys, bearer tokens або Notion integration tokens) за назвою. Див. [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Назви, які не є простими ідентифікаторами (містять `-`, починаються з цифри або є зарезервованими словами), використовують форму з дужками: `$credentials["my-api-key"]`.

### Global Variables

Використовуйте `$global.variableName` для посилання на [Global Variables](./global-variables.md) – постійні дані типу ключ-значення в межах користувача, якими керують на [вкладці Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Вкладені поля

Використовуйте точкову нотацію для вкладених об'єктів:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Літерали

- **Рядки**: `"hello"` або `'hello'`
- **Числа**: `42`, `3.14`
- **Булеві значення**: `true`, `false`
- **Null**: `null`

## Збереження типів

Коли **все** значення є єдиним `$expr`, бекенд зберігає рідний тип:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Коли вираз є частиною більшого рядка, кінцевий результат завжди є рядком:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Вузли [Sticky Note](../nodes/sticky-note-node.md) – це документація на полотні, а не виконувані поля виразів. Їхній вміст `note` відображається як markdown, тож використовуйте звичайні markdown-посилання та зображення замість виразів `$...`.

Sticky notes підтримують власний заголовок відображення та шість збережених фонових кольорів:

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

Дозволені значення `stickyColor`: `yellow`, `sky`, `emerald`, `rose`, `violet` та `zinc`.

## Арифметика

Підтримувані оператори: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Порівняння

Використовуйте у вузлах [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Контекст Loop

Усередині вузла [Loop](../nodes/loop-node.md) використовуйте `item` для посилання на поточний елемент масиву:

```
item.name
item.value
```

## Спеціальні змінні
- `$now` - Поточна дата й час із методами форматування
- `$Date()` - Створити/розібрати дату (наприклад, `$Date("2024-01-15")`)
- `$UUID` - Згенерувати 32-символьний унікальний ідентифікатор (БЕЗ дужок; використовуйте `$UUID`, а не `$UUID()`)
- `$workflowName` - Назва поточного workflow
- `$workflowDescription` - Опис поточного workflow
- `$workflowPath` - Відносний шлях workflow, наприклад `/workflows/<id>`
- `$workflowUrl` - Абсолютний URL workflow, наприклад `https://<host>/workflows/<id>`
- `$executionId` - Ідентифікатор поточного виконання (дорівнює id запису в [Execution History](./execution-history.md), тож `/workflows/<id>/<executionId>` відкриває це виконання на полотні). **Лише під час виконання**: порожній у діалозі попереднього перегляду виразів; заповнюється лише під час виконання workflow.
- `$vars` - Локальні змінні workflow (доступ через `$vars.variableName`; оновлюються через вузол `variable`)
- `$global` - Постійне сховище глобальних змінних (доступ через `$global.variableName`)

### Використання $vars
- `$vars.counter` - Доступ до змінної з назвою `counter`
- `$vars.myArray.add("item")` - Додати елемент до змінної-масиву

### Використання $global
- `$global.environment` - Доступ до глобальної змінної з назвою `environment`
- `$global.settings.baseUrl` - Доступ до вкладених полів у глобальній змінній типу об'єкт

## Контекст запиту (виконання API)
Коли workflow виконується через HTTP API, вхідні вузли отримують додаткові метадані запиту:
- `$textInputLabel.body` - об'єкт тіла HTTP-запиту (raw JSON payload)
- `$textInputLabel.headers` - об'єкт заголовків HTTP-запиту (усі ключі заголовків у нижньому регістрі)
- `$textInputLabel.query` - об'єкт параметрів URL-запиту

Доступ до даних запиту:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Функції перетворення типів
- `str(value)` - Перетворити на рядок
- `int(value)` - Перетворити на ціле число
- `float(value)` - Перетворити на число з плаваючою точкою
- `bool(value)` - Перетворити на булеве значення
- `list(value)` - Перетворити на список
- `dict(key=value, ...)` - Створити словник із ключовими аргументами (наприклад, `$dict(name="Ali", age=30)`)

## Математичні функції
- `len(value)` - Отримати довжину
- `abs(value)` - Абсолютне значення
- `min(a, b)` - Мінімальне значення
- `max(a, b)` - Максимальне значення
- `round(value)` - Округлити число
- `sum(list)` - Сума списку
- `sorted(list)` - Відсортувати список
- `randomInt(min, max)` - Випадкове ціле число

## Функції для масивів
- `$array(a, b, c)` - Створити масив з аргументів (наприклад, `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Створити діапазон цілих чисел від `a` до `b`, де `b` не включено (наприклад, `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Зазнає помилки, коли `a > b`
- `notNull(list)` - Видалити null-значення з масиву

## Функція побудови рядків (для виразів map/filter)
- `concat(a, b, c, ...)` - Об'єднати N аргументів
  - Використовуйте всередині `.map()` як рядковий вираз (без `$` всередині рядка)
  - Використовуйте одинарні лапки всередині рядка concat:
    - Правильно: `concat('prefix', 'item.field', 'suffix')`

## Літерали об'єктів / словники
Створюйте об'єкти/словники за допомогою синтаксису фігурних дужок із будь-якими рядковими ключами:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Динамічні ключі
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Правила літералів об'єктів
- Ключі можуть бути будь-якими рядками (включно з пробілами/спеціальними символами)
- Ключі ПОВИННІ бути взяті в подвійні лапки (наприклад, `"key"`)
- Значення можуть бути рядками/числами/булевими значеннями/виразами/вкладеними об'єктами

## Функції для рядків
- `upper(text)` - Верхній регістр
- `lower(text)` - Нижній регістр
- `strip(text)` - Обрізати пробіли
- `capitalize(text)` - Зробити першу літеру великою
- `title(text)` - Регістр заголовка
- `split(text, separator)` - Розділити рядок
- `join(separator, list)` - Об'єднати список
- `replace(text, old, new)` - Замінити текст
- `regexReplace(text, pattern, replacement)` - Замінити за допомогою regex-шаблону
- `base64Encode(text)` - Закодувати текст UTF-8 як стандартний Base64
- `base64Decode(text)` - Декодувати стандартний Base64 у текст UTF-8
- `toJson(text)` - Розібрати рядок JSON в об'єкт, масив або значення

## Методи рядків (для рядкових значень)
- `.orEmpty()` - Повернути рядкове значення або `""`, коли значення null/відсутнє
- `.upper()` / `.lower()` - Перетворення регістру
- `.strip()` - Обрізати пробіли
- `.capitalize()` / `.title()` - Зробити першу літеру великою
- `.length` - Довжина рядка
- `.toString()` - Перетворити на рядок
- `.substring(start, end)` - Витягти підрядок
- `.contains(text)` - Перевірити наявність підрядка
- `.startswith(prefix)` / `.endswith(suffix)` - Перевірити префікс/суфікс
- `.indexOf(text)` - Знайти позицію (повертає -1, якщо не знайдено)
- `.replace(old, new)` - Замінити перше входження
- `.replaceAll(old, new)` - Замінити всі входження
- `.regexReplace(pattern, replacement)` - Замінити за допомогою regex-шаблону
- `.hash()` - MD5-хеш рядка
- `.base64Encode()` - Закодувати текст UTF-8 як стандартний Base64
- `.base64Decode()` - Декодувати стандартний Base64 у текст UTF-8
- `.urlEncode()` - URL-кодувати рядок
- `.urlDecode()` - URL-декодувати рядок
- `.escape()` - JSON-екранувати рядок (перетворити спеціальні символи у формат JSON)
- `.unescape()` - JSON-розекранувати рядок (перетворити формат JSON у вихідний рядок)
- `.toJson()` - Розібрати рядок JSON в об'єкт, масив або значення

### Приклади методів рядків
- `$profile.nickname.orEmpty()` - Перетворити nullable/відсутній текст на порожній рядок
- `$text.upper()` - Перетворити на верхній регістр
- `$text.lower()` - Перетворити на нижній регістр
- `$text.strip()` - Видалити пробіли
- `$text.replace("old", "new")` - Замінити текст
- `$text.replaceAll("a", "b")` - Замінити всі входження
- `$text.length` - Отримати довжину рядка
- `$text.escape()` - Екранувати спеціальні символи JSON (наприклад, лапки, символи нового рядка)
- `$escapedText.unescape()` - Розекранувати рядок у форматі JSON назад у вихідний
- `$text.toJson()` - Розібрати рядок JSON-об'єкта/масиву (потім `$text.toJson().repoUrl`)
- `$toJson($text)` - Те саме розбирання як функція
- `$base64Encode("Héym 🌍")` - Повертає `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Декодувати Base64 у текст UTF-8
- `$text.urlEncode()` - URL-кодувати для параметрів API
- `$encodedText.urlDecode()` - Декодувати URL-кодований текст

## Методи масивів (для масивів)
- `.first()` - Отримати перший елемент
- `.last()` - Отримати останній елемент
- `.random()` - Отримати випадковий елемент
- `.reverse()` - Перевернути масив
- `.flat()` - Розгорнути вкладені масиви в один масив
- `.flat(depth)` - Розгорнути з обмеженням глибини
- `.distinct()` - Видалити дублікати
- `.distinctBy(expr)` - Видалити дублікати за виразом (наприклад, `$array.distinctBy("item.id")`)
- `.notNull()` - Видалити значення null
- `.add(item)` - Додати елемент (повертає новий масив)
- `.contains(item)` - Перевірити, чи містить масив елемент (повертає boolean)
- `.join(separator)` - Об'єднати елементи масиву в рядок
- `.filter(expr)` - Фільтрувати масив за допомогою змінної `item` (наприклад, `$array.filter("item > 5")`)
- `.map(expr)` - Перетворити кожен елемент за допомогою змінної `item` (наприклад, `$array.map("item.name")`)
- `.sort(expr, order)` - Сортувати за виразом, order — це `"asc"` (за замовчуванням) або `"desc"`
- `.take(n)` - Взяти перші N (додатне) або останні N (від'ємне) елементів
- `.length` - Довжина масиву
- `.toString()` - Перетворити в JSON-рядок

### Приклади Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Методи об'єктів/словників (для об'єктів)
- `.get(key)` - Отримати значення за ключем (повертає null, якщо не знайдено)
- `.get(key, default)` - Отримати значення за ключем із запасним значенням за замовчуванням
- `.keys()` - Повернути список усіх ключів
- `.values()` - Повернути список усіх значень
- `.entries()` - Повернути список об'єктів `{key, value}` (по одному на властивість)
- `.filter(expr)` - Перебрати записи `{key, value}` і повернути відповідні записи як список (використовуйте `item.key` / `item.value` всередині `expr`)
- `.map(expr)` - Перебрати записи `{key, value}` і повернути список перетворених значень (використовуйте `item.key` / `item.value` всередині `expr`)
- `.toString()` - Перетворити в JSON-рядок

### Приклади ітерації об'єктів
Під час ітерації об'єкта за допомогою `.map()` або `.filter()` кожен `item` є парою `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → список назв властивостей, які не є null

## Дата/Час
- `$now` - Поточна дата й час
- `$now.format("YYYY-MM-DD")` - Форматувати дату/час
- `$now.toISO()` / `.toDate()` / `.toTime()` - Перетворити формати
- `$now.addDays(n)` / `.addHours(n)` - Арифметика з датами
- `$Date("2024-01-15")` - Розібрати рядок дати

## Числові операції
- Базова математика: `+`, `-`, `*`, `/`, `%`
- Порівняння: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Логічні оператори: `and`, `or`, `not`

## Логічні умови
Для boolean пишіть вираз безпосередньо (не змушуйте `== true`):
- Неправильно: `$nodeName.isValid == true`
- Правильно: `$nodeName.isValid`
- Заперечення: `not $nodeName.isValid`

## Правила та білий список (критично)
### Правила розміщення $
- Окремий вираз зазвичай починається з провідного `$`.
- Рядки шаблонів можуть містити кілька `$refs`.
- Параметри методів також можуть містити вкладені `$refs`, коли ви хочете передати результат іншого виразу (динамічний ключ або вкладене розв'язання).
  - Дійсно: `$node.method(other.field)` — `other` розв'язується з контексту як мітка верхнього рівня (без `$` всередині аргументу).
  - Дійсно: `$node.method($other.field)` — вкладений `$` підтримується в попередньому перегляді діалогу evaluate та під час обчислення умов.
  - Дійсно: `$array($a.x, $b.y)`
  - Автодоповнення всередині `.get(` вставляє **голі** шляхи `label.field` (без провідного `$`), так само як усередині `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Якщо все надіслане значення є єдиним шляхом із крапками **без** провідного `$` (наприклад, текст, вибраний у редакторі, як-от `execute.outputs.output.result.today`), бекенд обробляє його так само, як `$execute.outputs.output.result.today`. Значення, які після обрізання містять символ нового рядка або повернення каретки, не переписуються (щоб уникнути неоднозначних багаторядкових payload). Надавайте перевагу написанню `$` у збережених полях workflow; переписування призначене переважно для перевірки та інструментів.
- Результат `Run` у діалозі Evaluate є джерелом істини щодо того, як розв'язується конкретний вираз.

### Лапки для рядків у масивах
Під час створення масивів зі значеннями-рядками ЗАВЖДИ використовуйте подвійні лапки:
- Правильно: `$array("hello", "world")`
- Неправильно: `$array('hello', 'world')`

### ВИКОРИСТОВУЙТЕ ЛИШЕ ЦІ ФУНКЦІЇ (білий список)
Використовуйте ЛИШЕ:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- задокументовані методи рядків/масивів/об'єктів

Якщо функції немає в наведеному вище списку, вона не існує.

### Обмеження методів масивів / словників
- Масиви МОЖУТЬ використовувати ЛИШЕ: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Об'єкти/словники МОЖУТЬ використовувати ЛИШЕ: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Зарезервовані назви міток вузлів
Не використовуйте ці назви як мітки вузлів: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Приклади

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### Приклад DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Пов'язане

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Розширюваний редактор із живим попереднім переглядом на боці бекенду та автодоповненням
- [Canvas Features](./canvas-features.md) – Data pin для тестування виразів без повторного запуску вузлів
- [Node Types](./node-types.md) – Вузли, які використовують вирази ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) тощо)
- [Sticky Note](../nodes/sticky-note-node.md) – Markdown-нотатки на Canvas з редагованим заголовком, кольором і відображенням зображень
- [Agent Node](../nodes/agent-node.md) – Використання виразів у промптах агента
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled` і `memoryShares` у `data` агента (не поля виразів)
- [Workflow Structure](./workflow-structure.md) – Поля `data` вузла, які приймають вирази
- [Credentials Tab](../tabs/credentials-tab.md) – Облікові дані, на які посилаються вузли
- [Credentials Sharing](./credentials-sharing.md) – Поширення облікових даних і використання `$credentials` у виразах
- [Global Variables](./global-variables.md) – Постійні змінні з `$global`
