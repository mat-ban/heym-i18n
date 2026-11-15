# Board

Záložka **Board** je agentní kanban board. Práce se pohybuje mezi sloupci a každý
sloupec může spouštět workflowy Heym. Karta není jen úkol — je to trvalá
agentní úloha, která nese kontext, historii konverzace, stav provádění, výstupy
a spuštění workflowů.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boardy a sloupce

- Můžete vytvořit tolik boardů, kolik potřebujete. Nový board začíná s výchozími
  sloupci **Backlog → Planning → Development → Done**.
- Každý board potřebuje **Agentic Kanban Model** (přihlašovací údaje plus model). Je
  povinný — dialog Nový board nevytvoří board bez něj a board, který žádný nemá,
  má své akce zakázané — protože právě model mapuje každou kartu na
  vstupy workflowů, které spouští, a převádí jejich výstup zpět na
  čitelný text.
- Ikona ozubeného kola v záhlaví boardu otevírá nastavení boardu: název, popis
  (zobrazený pod záhlavím) a Agentic Kanban Model.
- Sloupce jsou plně editovatelné: přidávejte, přejmenovávejte, měňte barvy, přeskupujte nebo je odstraňujte
  v nastavení sloupce (sloupec musí být prázdný, než jej lze odstranit).
- Karty jsou řazeny svisle podle priority — přetažením je přeskupíte.
- Kartu můžete také vytvořit ze [záložky Chat](./chat-tab.md) pomocí požadavku
  v přirozeném jazyce. Chat vás v případě potřeby vyzve k výběru boardu a vždy přidá kartu
  do prvního sloupce daného boardu.

## Sdílení boardu

Nastavení boardu také umožňuje sdílet board s **uživateli** (podle e-mailu) a s **týmy**,
s oprávněním `read` nebo `write`:

- **read** — board a jeho karty jsou viditelné, ale nelze nic měnit: žádné nové
  karty, žádné přesuny, žádné komentáře, žádná spuštění.
- **write** — plné použití boardu: karty, přesuny, komentáře a spuštění.
- Pouze **vlastník** vidí ozubené kolo a tlačítka pro smazání a pouze vlastník může měnit
  nastavení boardu, jeho Agentic Kanban Model nebo jeho sdílení.

Řetězce na sdíleném boardu vždy běží s **vlastníkovými** přihlašovacími údaji a Agentic Kanban
Modelem, takže spolupracovníci nikdy nepotřebují své vlastní.

## Přílohy karet

Otevřete kartu a pomocí **Attach file** k ní přidejte soubory — přetáhněte je do pole nebo je vyberte
tlačítkem a ze stejného seznamu je také odstraňte. Přílohy jsou uloženy v
[Drive](./drive-tab.md).

Každé spuštění **vyhodnotí přílohy před spuštěním workflowů**, podle typu:

- **Dokumenty** (pdf, markdown, csv, json, text) jsou extrahovány do textu, s limitem 20 000
  znaků na soubor, v poli `text` přílohy.
- **Obrázky** jsou předány jako `url`, které vision cesta načte přímo (obrazový
  vstup uzlu LLM jej přijímá tak, jak je).
- **Vše ostatní** je předáno jako prostý odkaz (`name`, `url`, `mime_type`).

Workflowy je čtou na `$input.card.attachments` (a vždy na `$input.board.attachments`,
bez ohledu na to, co mapper namapoval). Agentic Kanban Model vidí extrahovaný text i URL
obrázků, takže může namapovat přílohu přímo do pole, které workflow očekává.

## Řetězce workflowů sloupců

Každý sloupec lze nakonfigurovat pomocí **uspořádaného seznamu workflowů** (řetězce).
Když se karta přesune do sloupce, který má řetězec:

1. Řetězec se spustí automaticky na pozadí — samotný přesun nikdy nečeká.
2. Workflowy běží **sekvenčně**. Výstup každého workflowu je připojen ke kontextu
   karty před spuštěním dalšího.
3. Pokud workflow selže, řetězec se zastaví: zbývající články jsou přeskočeny a
   karta zčervená.
4. Když každý článek uspěje, karta zezelená. Zatímco řetězec běží,
   karta pulzuje **jantarově**; spuštění pozastavené kvůli lidské kontrole zobrazuje statický jantarový
   stav.

Spuštění jsou zaznamenána v [Execution History](../reference/execution-history.md) se
zdrojem triggeru `board` a každá karta si vede vlastní seznam spuštění s výstupy
a chybami jednotlivých workflowů. Otevřete kartu, zatímco workflow běží, a zvolte **Open live** vedle
spuštění, čímž připojíte editor k přesně tomuto provádění. Zobrazí se stejná animace plátna, přírůstkové
Debug logy a konečný výsledek, aniž by se spustilo druhé spuštění.
## Co workflows dostávají

Řetězec předává standardní payload jako vstup workflow. Přečtěte jej pomocí běžných
[expressions](../reference/expression-dsl.md), jako je `$input.card.title`:

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

- `comments` — všechny komentáře na kartě, od nejstaršího.
- `history` — kompletní časová osa aktivity (komentáře, přesuny, výstupy), omezená na
  nejnovějších 200 záznamů.
- `previous_outputs` — výstupy z dřívějších dokončených běhů (předchozí sloupce a
  navazující kola).
- `chain.previous_workflow_outputs` — výstupy dřívějších článků v *aktuálním*
  řetězci.
- V navazujících kolech je `move` nastaveno na `null` a `rerun` na `true`.

## Plánovací smyčka (navazující kola)

Častým vzorem je umístit plánovací workflow do **druhého sloupce** (ve výchozím stavu
pojmenovaného Planning — název není podstatný; rozhoduje pozice). Toto workflow obohatí
kartu a položí navazující otázky:

1. Přesuňte kartu do druhého sloupce — workflow zapíše obohacený plán a své
   otázky zpět na kartu jako výstup.
2. Odpovězte ve vlákně komentářů karty. Odpověď kartu uvolní: přesune se do
   dalšího sloupce, který ji převezme s odpovědí v kontextu. Řetězec druhého sloupce
   se znovu nespouští.
3. Chcete-li místo toho vylepšit plán na místě, stiskněte **Run follow-up round**. Stejný
   řetězec se spustí znovu se vším nashromážděným kontextem a karta poté v tomto sloupci
   čeká, dokud nepřidáte komentář, který ji uvolní.

Plánovací brána je určena pozicí, nikoli názvem: nejlevější sloupec a sloupec
bezprostředně napravo od něj se samy nikdy neposouvají dál — spustí svůj
řetězec a čekají tam na vás (komentář uvolní druhý sloupec). Od třetího sloupce dál
úspěšný řetězec posouvá kartu doprava sám, až do posledního
sloupce. Přejmenování nebo odstranění výchozího označení "Planning" nemění to, která pozice
je branou. Karta může mít v daném okamžiku pouze jeden aktivní běh.

## Human-in-the-Loop a otázky Codex

Pokud se workflow řetězce pozastaví — na uzlu [Human-in-the-Loop](../reference/human-in-the-loop.md),
na HITL nástroji agenta, nebo protože uzel [Codex](../nodes/codex-node.md) potřebuje
více informací — běh se uloží jako čekající a karta zobrazí jantarový stav čekání.
Každé pozastavení má vlastní rozhraní pro odpověď: odkaz na HITL review pro HITL, obrazovku
pro navazující krok Codex pro Codex.

Jakmile odpovíte, řetězec sám pokračuje: pozastavené workflow se dokončí, jeho výstup
se zapíše na kartu, zbytek řetězce tohoto sloupce se spustí a karta se jako obvykle posune dál.
Pokud obnovený běh selže, karta zčervená a zbývající články se přeskočí.

## Související

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
