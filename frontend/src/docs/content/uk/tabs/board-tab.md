# Board

Вкладка **Board** — це агентна kanban-дошка. Робота просувається колонками, і кожна
колонка може виконувати Heym workflows. Картка — це не просто завдання, а постійне
агентне завдання, яке несе контекст, історію розмови, стан виконання, результати
та запуски workflow.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Дошки та колонки

- Ви можете створити стільки дошок, скільки потрібно. Нова дошка починається з типових
  колонок **Backlog → Planning → Development → Done**.
- Кожна дошка потребує **Agentic Kanban Model** (credential плюс модель). Це
  обов'язково — діалог New board не створить дошку без неї, а дошка,
  яка її не має, залишає свої дії вимкненими — тому що саме модель перетворює кожну
  картку на входи workflows, які вона запускає, і перетворює їхній вивід назад на
  читабельний текст.
- Іконка шестерні в заголовку дошки відкриває налаштування дошки: назва, опис
  (показаний під заголовком) та Agentic Kanban Model.
- Колонки повністю редаговані: додавайте, перейменовуйте, змінюйте колір, змінюйте порядок або видаляйте їх у
  налаштуваннях колонки (колонка має бути порожньою, перш ніж її можна видалити).
- Картки впорядковані вертикально за пріоритетом — перетягніть, щоб змінити порядок.
- Ви також можете створити картку з [вкладки Chat](./chat-tab.md) за допомогою запиту
  природною мовою. Chat просить вас вибрати дошку, коли потрібно, і завжди додає картку до
  першої колонки цієї дошки.

## Спільний доступ до дошки

Налаштування дошки також надають спільний доступ до дошки для **користувачів** (за email) та для
**команд**, з дозволом `read` або `write`:

- **read** — дошка та її картки видимі, але нічого не можна змінити: жодних нових
  карток, переміщень, коментарів, запусків.
- **write** — повне використання дошки: картки, переміщення, коментарі та запуски.
- Лише **власник** бачить шестерню та кнопки видалення, і лише власник може змінювати
  налаштування дошки, її Agentic Kanban Model або її спільний доступ.

Ланцюжки на спільній дошці завжди виконуються з **обліковими даними власника** та Agentic Kanban
Model, тож співробітникам ніколи не потрібні власні.

## Вкладення карток

Відкрийте картку та використайте **Attach file**, щоб додати до неї файли — перетягніть їх у поле або виберіть
їх кнопкою, і видаліть їх з того самого списку. Вкладення зберігаються в
[Drive](./drive-tab.md).

Кожен запуск **обробляє вкладення перед початком workflows**, за типом:

- **Документи** (pdf, markdown, csv, json, text) витягуються в текст, обмежений 20 000
  символами на файл, у полі `text` вкладення.
- **Зображення** передаються як `url`, який vision-шлях завантажує безпосередньо (вхід зображення вузла LLM
  приймає його як є).
- **Будь-що інше** передається як просте посилання (`name`, `url`, `mime_type`).

Workflows читають їх за `$input.card.attachments` (і завжди за `$input.board.attachments`,
незалежно від того, що зіставив mapper). Agentic Kanban Model також бачить витягнутий текст і URL-адреси
зображень, тож він може зіставити вкладення безпосередньо з полем, яке очікує workflow.

## Ланцюжки workflow колонок

Кожну колонку можна налаштувати з **упорядкованим списком workflows** (ланцюжком).
Коли картка переміщується в колонку, яка має ланцюжок:

1. Ланцюжок запускається автоматично у фоновому режимі — саме переміщення ніколи не чекає.
2. Workflows виконуються **послідовно**. Вивід кожного workflow додається до контексту картки
   перед початком наступного.
3. Якщо workflow зазнає невдачі, ланцюжок зупиняється: решта ланок пропускаються, а
   картка стає **червоною**.
4. Коли кожна ланка успішна, картка стає **зеленою**. Поки ланцюжок виконується,
   картка пульсує **бурштиновим**; запуск, призупинений для перевірки людиною, показує статичний бурштиновий
   стан.

Запуски записуються в [Execution History](../reference/execution-history.md) з
джерелом trigger `board`, і кожна картка зберігає власний список запусків з виводами
та помилками для кожного workflow. Відкрийте картку, поки виконується workflow, і виберіть **Open live** поруч
із запуском, щоб приєднати редактор до саме цього виконання. Та сама анімація полотна, інкрементальні
Debug-логи та фінальний результат з'являються без запуску другого виконання.

## Що отримують workflow

Ланцюжок передає стандартний payload як вхідні дані workflow. Читайте його за допомогою звичайних
[виразів](../reference/expression-dsl.md), як-от `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — усі коментарі до картки, від найстарішого.
- `history` — повна стрічка активності (коментарі, переміщення, виводи), обмежена
  останніми 200 записами.
- `previous_outputs` — виводи з попередніх завершених запусків (попередні стовпці та
  додаткові раунди).
- `chain.previous_workflow_outputs` — виводи попередніх ланок *поточного*
  ланцюжка.
- У додаткових раундах `move` дорівнює `null`, а `rerun` — `true`.

## Цикл планування (додаткові раунди)

Поширений підхід — розмістити workflow планування в **другому стовпці** (типово
з назвою Planning — назва не має значення; має значення сама позиція). Цей workflow збагачує
картку та ставить додаткові запитання:

1. Перемістіть картку в другий стовпець — workflow записує збагачений план та свої
   запитання назад у картку як вивід.
2. Дайте відповідь у гілці коментарів картки. Відповідь вивільняє картку: вона переміщується
   до наступного стовпця, який підхоплює її з відповіддю в контексті. Ланцюжок другого стовпця
   повторно не запускається.
3. Щоб натомість покращити план на місці, натисніть **Run follow-up round**. Той самий
   ланцюжок запускається знову з усім накопиченим контекстом, після чого картка очікує в цьому стовпці,
   доки Ви додасте коментар, щоб вивільнити її.

Шлюз планування визначається позицією, а не назвою: найлівіший стовпець і стовпець
безпосередньо праворуч від нього ніколи не просуваються самі — вони запускають свій
ланцюжок і очікують там на Вас (коментар вивільняє другий стовпець). Починаючи з третього стовпця,
успішний ланцюжок самостійно просуває картку праворуч, аж до останнього
стовпця. Перейменування або видалення типової позначки "Planning" не змінює, яка позиція
є шлюзом. Картка може мати лише один активний запуск одночасно.

## Human-in-the-Loop і запитання Codex

Якщо workflow ланцюжка призупиняється — на вузлі
[Human-in-the-Loop](../reference/human-in-the-loop.md), на HITL-інструменті агента або
тому, що вузол [Codex](../nodes/codex-node.md) потребує
додаткової інформації — запуск зберігається як pending, а картка показує бурштиновий стан
pending. Кожна пауза має власну поверхню для відповіді: посилання на HITL-перевірку для HITL,
екран додаткових запитань Codex для Codex.

Щойно Ви відповісте, ланцюжок відновлюється самостійно: призупинений workflow завершується, його вивід
потрапляє на картку, решта ланцюжка цього стовпця виконується, а картка просувається як завжди.
Якщо відновлений запуск зазнає невдачі, картка стає червоною, а решта ланок пропускається.

## Пов'язане

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)

- **Advance cards automatically** in the board settings is on by default. Turn it off for
  a plain team task board: cards then stay in the column people put them in, and column
  workflows still run when a card enters their column.
- You can also manage the board from the [Chat tab](./chat-tab.md) or any MCP client; see
  [From Chat and MCP](#from-chat-and-mcp).

## Card details

Card details open in a wide dialog on desktop and fit the viewport on phones.
Use **Preview** beside **Description** to view Markdown formatting, including unsaved
edits. Choose **Edit** to return to the source text, then **Save description** to keep
your changes. Label chips use brighter text in dark mode; hover over a shortened label
to read its full name.

Open a card to set its **Details**:

- **Assignee** — anyone who can open the board: its owner, and the people and team
  members it is shared with.
- **Priority** — Urgent, High, Medium or Low.
- **Due date** — the card shows it as a chip, amber when it is due today and red when it
  is overdue.
- **Labels** — up to ten short labels, such as a client or a project.

Column workflows receive these fields in the card's `metadata` (`assignee_user_id`,
`priority`, `due_date`, `labels`).

If someone else changes the card while you edit it, saving shows a notice and loads their
version instead of overwriting it. An open board checks for changes made elsewhere (by a
teammate, in Heym Work, from Chat or MCP) every few seconds and redraws.

Moving a card that waits for a review asks first: the move cancels that review. A move
never approves a review; reviews are approved only from the review itself.

## From Chat and MCP

The [Chat tab](./chat-tab.md), Heym Work's chat, and any MCP client through `heym_chat`
can manage boards in plain language, with the same permissions as the Board tab:

- list boards, read a board's columns and cards, and list cards across boards filtered by
  assignee ("my tasks"), column, priority, due date (overdue, today, this week), label or
  review state;
- create a board (Chat turns off automatic advancing for a plain task board), rename it or
  change its settings, and delete it after you confirm its name (owner only). A board Chat
  creates uses the chat's credential and model as its Agentic Kanban Model; ask Chat to
  give its model to one of your boards that has none, such as a board made before this;
- add, rename, reorder and delete columns;
- add, edit, assign, move, reorder and delete cards;
- comment on a card, as you. A comment on a card waiting at the planning step answers its
  agent's questions, and the card moves on, as in the card's own comment box. A comment
  never approves a review.
