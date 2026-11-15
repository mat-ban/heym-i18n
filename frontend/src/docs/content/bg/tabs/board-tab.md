# Табло

Табът **Табло** представлява агентно kanban табло. Работата преминава през колони, като всяка колона може да изпълнява Heym workflows. Картата не е просто задача — тя е постоянна агентна задача, която носи контекст, история на разговора, състояние на изпълнение, резултати и workflow изпълнения.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Табла и колони

- Може да създавате толкова табла, колкото са Ви необходими. Новото табло започва с колоните по подразбиране **Backlog → Planning → Development → Done**.
- Всяко табло се нуждае от **Agentic Kanban Model** (удостоверение плюс модел). Това е задължително — диалоговият прозорец за ново табло няма да създаде табло без него, а табло без такъв остава с деактивирани действия — тъй като именно моделът преобразува всяка карта във входните данни на workflows, които изпълнява, и превръща техния резултат обратно в четим текст.
- Иконата с зъбно колело в заглавната лента на таблото отваря настройките му: име, описание (показано под заглавната лента) и Agentic Kanban Model.
- Колоните са напълно редактируеми: добавяне, преименуване, промяна на цвят, пренареждане или изтриване от настройките на колоната (колоната трябва да е празна, преди да бъде изтрита).
- Картите се подреждат вертикално по приоритет — плъзнете, за да ги пренаредите.
- Може също да създадете карта от [таба Chat](./chat-tab.md) чрез заявка на естествен език. Chat Ви подканва да изберете табло, когато е необходимо, и винаги добавя картата към първата колона на това табло.

## Споделяне на табло

Настройките на таблото позволяват също споделяне на таблото с **потребители** (по имейл) и с **екипи**, с разрешение `read` или `write`:

- **read** — таблото и картите му са видими, но нищо не може да се променя: без нови карти, без премествания, без коментари, без изпълнения.
- **write** — пълно използване на таблото: карти, премествания, коментари и изпълнения.
- Само **собственикът** вижда зъбното колело и бутоните за изтриване, и само собственикът може да променя настройките на таблото, неговия Agentic Kanban Model или споделянията му.

Веригите на споделено табло винаги се изпълняват с удостоверенията и Agentic Kanban Model на **собственика**, така че сътрудниците никога не се нуждаят от свои собствени.

## Прикачени файлове към карти

Отворете карта и използвайте **Attach file**, за да добавите файлове към нея — пуснете ги в полето или ги изберете с бутона, и ги премахнете от същия списък. Прикачените файлове се съхраняват в [Drive](./drive-tab.md).

Всяко изпълнение **разрешава прикачените файлове преди стартирането на workflows**, по тип:

- **Документи** (pdf, markdown, csv, json, text) се извличат като текст, ограничен до 20 000 знака на файл, в полето `text` на прикачения файл.
- **Изображения** се предават като `url`, който vision пътят зарежда директно (входът за изображения на LLM node го приема както е).
- **Всичко останало** се предава като обикновена референция (`name`, `url`, `mime_type`).

Workflows ги четат на `$input.card.attachments` (и винаги на `$input.board.attachments`, независимо какво е преобразувал mapper-ът). Agentic Kanban Model вижда извлечения текст и URL адресите на изображенията също, така че може да преобразува прикачен файл директно в полето, което workflow очаква.

## Вериги от workflows в колони

Всяка колона може да бъде конфигурирана с **подреден списък от workflows** (веригата).
Когато карта се премести в колона, която има верига:

1. Веригата стартира автоматично на заден план — самото преместване никога не изчаква.
2. Workflows се изпълняват **последователно**. Резултатът на всеки workflow се добавя към контекста на картата, преди да започне следващият.
3. Ако даден workflow се провали, веригата спира: останалите връзки се пропускат и картата става **червена**.
4. Когато всяка връзка успее, картата става **зелена**. Докато веригата се изпълнява, картата пулсира в **кехлибарено**; изпълнение, спряно за човешки преглед, показва статично кехлибарено състояние.

Изпълненията се записват в [Execution History](../reference/execution-history.md) с източник на trigger `board`, като всяка карта поддържа свой собствен списък с изпълнения с резултати и грешки по workflow. Отворете карта, докато даден workflow се изпълнява, и изберете **Open live** до изпълнението, за да прикачите редактора към точно това изпълнение. Същата анимация на canvas, инкременталните Debug логове и крайният резултат се появяват, без да се стартира второ изпълнение.
## Какво получават Workflows

Веригата подава стандартен payload като вход на workflow. Прочетете го с обикновени
[изрази](../reference/expression-dsl.md) като `$input.card.title`:

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

- `comments` — всички коментари по картата, от най-стария към най-новия.
- `history` — пълната времева линия на активността (коментари, премествания, outputs), ограничена до
  последните 200 записа.
- `previous_outputs` — outputs от по-рано завършени изпълнения (предишни колони и
  последващи кръгове).
- `chain.previous_workflow_outputs` — outputs на по-ранните звена в *текущата*
  верига.
- При последващи кръгове `move` е `null`, а `rerun` е `true`.

## Цикълът на планиране (последващи кръгове)

Често срещан модел е да поставите workflow за планиране на **втората колона** (по подразбиране
наречена Planning — името няма значение; значението е на слота). Този workflow обогатява
картата и задава последващи въпроси:

1. Преместете карта в втората колона — workflow записва обогатен план и своите
   въпроси обратно в картата като output.
2. Отговорете в нишката с коментари на картата. Отговорът освобождава картата: тя преминава към
   следващата колона, която я поема с отговора в контекста. Веригата на втората колона
   не се изпълнява отново.
3. За да подобрите плана на място вместо това, натиснете **Run follow-up round**. Същата
   верига се изпълнява отново с целия натрупан контекст, след което картата изчаква в тази колона,
   докато добавите коментар, за да я освободите.

Портата за планиране е позиционна, а не базирана на име: най-лявата колона и колоната
непосредствено вдясно от нея никога не преминават сами — те изпълняват
своята верига и изчакват там (коментар освобождава втората колона). От третата колона нататък
успешната верига придвижва картата надясно самостоятелно, чак до последната
колона. Преименуването или премахването на етикета "Planning" по подразбиране не променя кой слот
е портата. Една карта може да има само едно активно изпълнение в даден момент.

## Human-in-the-loop и въпроси от Codex

Ако workflow във веригата спре — на [Human-in-the-Loop](../reference/human-in-the-loop.md)
node, на HITL инструмент на агент или защото [Codex](../nodes/codex-node.md) node се нуждае
от повече информация — изпълнението се запазва като чакащо и картата показва кехлибарено състояние
на изчакване. Всяко спиране запазва собствена повърхност за отговор: HITL връзка за преглед за HITL, екранът
за последващи действия на Codex за Codex.

След като отговорите, веригата се възобновява самостоятелно: спреният workflow завършва, неговият output
се записва в картата, останалата част от веригата на тази колона се изпълнява и картата се придвижва както обикновено.
Ако възобновеното изпълнение се провали, картата става червена и останалите звена се пропускат.

## Свързани

- [Workflows](./workflows-tab.md)
- [История на изпълненията](../reference/execution-history.md)
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
