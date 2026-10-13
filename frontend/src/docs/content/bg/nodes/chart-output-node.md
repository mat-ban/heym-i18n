# Chart Output

**Chart Output** node е терминалният node на workflow за [dashboard widget](../tabs/dashboard-tab.md). Той взема редовете, произведени от upstream nodes, и ги превръща в стандартизиран chart payload, който dashboard-ът рендира.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 0 (терминален) |
| Изход | Стандартизиран chart payload |

Поставете този node **последен** в workflow за dashboard widget. Node-ът преди него трябва да произвежда масив от row objects, например:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Когато разполагате само с примерни/демонстрационни данни (без реален източник), произведете тези редове с **Set** node, използвайки `$array(dict(...), dict(...))` — например `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Не** използвайте `${...}` или чисти `{...}` object literals; Heym създава обекти само с `dict(key=value)`.

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` или `hitl` |
| `orientation` | string | `vertical` или `horizontal` (само за bar charts) |
| `dataPath` | string | Dot path до масива с редове във upstream изхода (напр. `data` или `result.items`). Оставете празно за автоматично откриване. |
| `labelField` | string | Ключ на ред, използван като категориен етикет (pie/bar/line) |
| `valueField` | string | Ключ на ред, използван като числова стойност (pie/bar/line/numeric/gauge) |
| `series` | array | Опционална дефиниция за multi-series `[{ "name": "Sent", "field": "sent" }]` за bar/line (замества `valueField`) |
| `columns` | array | Опционален списък с колони за `table` (по подразбиране — ключовете на първия ред) |
| `statusColumn` | string | Незадължителна колона за `table`, рендирана като цветни [чипове за статус](#status-chips). Трябва да е една от показаните колони. |
| `statusTones` | object | Незадължително съпоставяне от стойност на статус към тон (`success`, `attention`, `failure`, `waiting`, `neutral`) за стойности, които не са обхванати по подразбиране |
| `xField` / `yField` | string | Ключове на ред за X и Y числовите оси (scatter) |
| `min` / `max` | number | Числов диапазон за `gauge` (по подразбиране `0` / `100`) |
| `unit` | string | Опционална единица, показвана до стойност на `numeric` или `gauge` |
| `text` | string | Markdown съобщение за `text` chart type. Оставете празно и задайте `valueField`, за да рендирате динамично съобщение, извлечено от upstream данни. |
| `title` | string | Опционално заглавие на chart |

## Chart types

- **bar / line / area / pie** — категорийни charts, управлявани от `labelField` + `valueField` (или `series` за multi-series bar/line/area). `area` е запълнен trend chart.
- **table** — сурови редове, рендирани като scrollable таблица чрез `columns`. Една колона може да се рендира като [чипове за статус](#status-chips), а редовете могат да отварят [страница с детайли](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — единична KPI стойност от първия ред, с опционална `unit`.
- **gauge** — единична стойност, показана спрямо диапазон `min`–`max` (напр. процент). Използва `valueField`.
- **scatter** — X/Y точки от `xField` и `yField` за correlation plots.
- **proportion** — единична хоризонтална лента, разделена на дялове с процентна легенда (напр. разбивка по езици). Използва `labelField` + `valueField`.
- **barGauge** — един хоризонтален gauge на ред с градиент от червено към зелено и стойност (напр. свободно дисково пространство). Използва `labelField` + `valueField`, опционални `unit` и `max` (по подразбиране — най-голямата стойност в реда).
- **text** — markdown съобщение (напр. статусна бележка като "Last execution at 19:47"). Поставете markdown-а в `text` за статично съобщение или оставете `text` празно и задайте `valueField`, за да рендирате низ, произведен upstream. Поддържа заглавия, bold/italic, [списъци](../nodes/chart-output-node.md#interactive-task-lists), връзки и inline code.
- **hitl** — карусел с Вашите чакащи human reviews. Хедърът показва `1/n pending`; лявата стрелка е деактивирана на първата карта, а дясната — на последната. Името на workflow-а отваря това изпълнение на canvas-а. **Approve**, **Request changes** и **Reject** го разрешават, а иконата за история до заглавието на widget-а отваря това изпълнение в history dialog-а на същата страница. Този chart type игнорира upstream редовете, така че workflow-ът на widget-а е само Chart Output node. Всеки влязъл в профила си човек вижда reviews по workflow-ите, които притежава.

### Interactive task lists

Използвайте GitHub-flavored markdown синтаксис за task list в статичното поле `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

В [Dashboard](../tabs/dashboard-tab.md) чекбоксовете се рендират като кликаеми контроли (съвместими с тъмен и светъл режим). Превключването на чекбокс обновява полето `text` на workflow-а на widget-а и се запазва след презареждане.

**Inline редактиране:** щракнете двукратно върху етикета на task item, за да го редактирате на място. Натиснете Enter или щракнете извън него, за да запазите; натиснете Escape, за да отмените. Изчистете етикета напълно, за да премахнете този item от списъка.

**Връзки в task items:** когато етикетът съдържа markdown връзка (`[title](url)`), щракването върху връзката отваря URL-а, без да превключва чекбокса. Щракнете другаде върху реда, за да превключите.

**Само статичен текст:** интерактивността изисква GFM task list синтаксис (`- [ ]` / `- [x]`). Обикновените динамични статусни съобщения без task items остават read-only. Когато markdown-ът идва от `valueField`, първото превключване го копира в статичното поле `text`, така че промените да се запазят.
### Номерирани списъци

Text widgets визуализират markdown с **запазени изрични номера на редове**. Поставете префикс на всеки ред с номера, който искате да бъде показан (напр. `9.`, `8.`, `7.`). Heym не преномерира редовете вместо Вас.

**Защо изрични номера?** Стандартните markdown подредени списъци (`1.`, `2.`, `3.`) се превръщат в HTML `<ol>` списъци, които броят само **нагоре** от първото число. Списък, написан като `9.` / `8.` / `7.`, ще се покаже като `9`, `10`, `11` в обикновен markdown renderer. Поставянето на префикс с желания номер на всеки ред предотвратява това.

**Низходящи списъци (напр. най-новите първи):** изградете markdown в workflow цикъл и изчислете номера за показване за всеки елемент:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Типичен модел:

1. Извлечете или изградете масив от елементи (напр. HTTP → `body.videos`).
2. [Loop](./loop-node.md) върху масива; вътре в тялото използвайте [Variable](./variable-node.md) с `.add()`, за да добавите един номериран ред за всяка итерация.
3. След **done** клона на цикъла, [Set](./set-node.md) `join("\n")` върху натрупания масив (или еквивалент) в единен markdown низ.
4. Насочете **Chart Output** `valueField` към този низ (или задайте статичен `text`).

Примерен израз за ред вътре в цикъла (етикет `processVideos`, елементи с `title` и `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Получен markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

За прост възходящ списък, започващ от 1, или поставете префикс на всеки ред (`1.`, `2.`, `3.`), или използвайте цикъл с `$loop.index + 1`. Използвайте [bullet lists](#interactive-task-lists) (`- item`), когато не се нуждаете от номера.

## Чипове за статус

Една `table` може да показва една колона като цветни чипове. Задайте **Status column** в свойствата на възела (или `statusColumn` в DSL) на име на колона. Всяка стойност получава един от пет тона, а често срещаните думи получават тон без допълнителна конфигурация:

| Тон | Думи по подразбиране |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | всичко останало |

Сравняването игнорира главни/малки букви, `_` и `-`, така че `IN_PROGRESS` и `in-progress` са `waiting`. Добавете **Status tones** за други стойности; записът презаписва стойността по подразбиране за тази стойност:

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

Сървърът преобразува всяка стойност до нейния тон, така че Heym и Heym Work показват едни и същи цветове.

## Страници с детайли: `$page.record`

Табло, отворено с `?record=<value>`, изпълнява всеки Workflow на уиджет с тази стойност като `$page.record`. Връзка в ред от таблица отваря такава страница; вижте [Страници с детайли](../tabs/dashboard-tab.md#detail-pages). В табло, отворено без запис, както и в диалога за изрази, `$page.record` е `null`. Възел с етикет `page` има предимство пред него.

Използвайте го, за да извлечете конкретния запис, за който се отнася страницата, например във възел [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` е самата стойност на щракнатия ред, като `V-1002`, а не обект с полета. За да намерите този запис в [DataTable](./datatable-node.md), филтрирайте колоната за запис по стойността: операция `find` с филтър `{"vendor_id": "$page.record"}`. Път като `$page.record.id` не връща нищо, така че уиджет, създаден или настроен от AI, премахва тези полета и вместо това чете `$page.record`.

Стойността идва от URL адрес, който всеки може да редактира. Таблото приема само стойности във формата за запис (букви, цифри, `-`, `_` и `.` по подразбиране), но въпреки това я третирайте като ненадежден вход: подавайте я там, където възелът ескейпва стойностите, като HTTP query параметър или стойност на филтър в [DataTable](./datatable-node.md) или ClickHouse, и никога не сглобявайте текст на заявка чрез конкатенация на низове с нея. Уиджетите все така се изпълняват от името на собственика на таблото, независимо кой отваря страницата.

## Как се разрешават данните

1. Ако `dataPath` е зададен, node следва този dot path в upstream изхода.
2. В противен случай търси масив: списък на най-горно ниво, масив `data` или първото поле със стойност списък.
3. Редове директно от възел [Data Table](./datatable-node.md) (`{id, data, created_at}`) се четат с техните колони на най-горно ниво до `id`, така че `labelField`, `valueField` и `columns` назовават собствените колони на таблицата.
4. За `table`, всеки ред става ред в таблицата, използвайки `columns` (или ключовете на първия ред). Със `statusColumn` Payload-ът пренася и тона на всяка стойност в тази колона.
5. За `numeric` и `gauge`, стойността идва от `valueField` на първия ред (или първото числово поле).
6. За `scatter`, всеки ред става точка `[xField, yField]`.
7. За `text`, съобщението се взема от `valueField` на първия ред, когато е зададено, в противен случай от статичната конфигурация `text` (в противен случай първото поле от тип низ на първия ред).

## Пример

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

Gauge (единична стойност спрямо диапазон):

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

Scatter (X/Y точки):

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

Proportion (една лента, разделена по дял + легенда с проценти):

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

Area (запълнена тенденция с множество серии):

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

Bar gauge (gradient gauge за всеки ред със стойности):

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

Text (статично markdown съобщение — не са необходими upstream редове):

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

Text (динамично — низът на съобщението се създава upstream и се извлича чрез `valueField`):

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
## Примерни AI prompt-ове

Когато генерирате widget с **AI**, prompt-ове като тези съответстват точно на всеки тип:

- **Bar** — „Покажи месечния приход за последните 6 месеца като вертикална bar диаграма с примерни данни."
- **Line** — „Начертай дневно активните потребители за последните 14 дни като line диаграма."
- **Area** — „Покажи използването на памет и CPU за последните 24 часа като area диаграма с две серии. Използвай примерни данни."
- **Pie** — „Разбий статуса на изпълнение (success, error, cancelled) като pie диаграма."
- **Table** — „Покажи топ 10 workflows по брой изпълнения като таблица с възможност за скролване с колони name и runs. Използвай примерни данни."
- **Numeric** — „Покажи общия брой изпълнения на workflows за днес като единичен KPI с единица 'runs'. Използвай примерни данни."
- **Gauge** — „Покажи текущото използване на CPU като gauge от 0 до 100 процента."
- **Scatter** — „Начертай латентността на заявките спрямо размера на payload като scatter диаграма с примерни данни."
- **Proportion** — „Покажи най-използваните ми езици като proportion bar: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Използвай примерни данни."
- **Bar gauge** — „Покажи свободното дисково пространство за всеки том (sda1 до sda7) като bar gauge в GB. Използвай примерни данни."
- **Text** — „Добави text widget с markdown checklist (един отметнат елемент, два неотметнати) или изброй 5-те най-нови tutorial видеа в низходящ ред (от 5. към 1.) с YouTube връзки — постави явен номер в началото на всеки ред (`5. Title`, `4. Title`, …)."

## Свързани

- [Dashboard tab](../tabs/dashboard-tab.md) — създаване и подреждане на widgets
- [Output node](output-node.md) — терминален node за обикновени workflows
