# Board

Fliken **Board** är en agentisk kanban-tavla. Arbete rör sig genom kolumner, och varje
kolumn kan köra Heym-workflows. Ett kort är inte bara en uppgift — det är ett beständigt
agentiskt jobb som bär kontext, konversationshistorik, körningstillstånd, utdata
och workflow-körningar.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Tavlor och kolumner

- Det går att skapa så många tavlor som behövs. En ny tavla startar med standardkolumnerna
  **Backlog → Planning → Development → Done**.
- Varje tavla kräver en **Agentic Kanban Model** (en credential plus en modell). Den är
  obligatorisk — dialogrutan för ny tavla skapar inte en tavla utan en sådan, och en tavla
  som saknar en har sina åtgärder inaktiverade — eftersom det är modellen som mappar varje
  kort till indata för de workflows den kör och omvandlar deras utdata tillbaka till
  läsbar text.
- Kugghjulsikonen i tavlans huvud öppnar tavlans inställningar: namn, beskrivning
  (visas under huvudet) och Agentic Kanban Model.
- Kolumner är fullt redigerbara: lägg till, byt namn på, ändra färg på, ordna om eller ta bort dem från
  kolumninställningarna (en kolumn måste vara tom innan den kan tas bort).
- Kort ordnas vertikalt efter prioritet — dra för att ändra ordning.
- Det går även att skapa ett kort från [Chat-fliken](./chat-tab.md) med en begäran i naturligt
  språk. Chat ber om att välja en tavla vid behov och lägger alltid till kortet i den
  tavlans första kolumn.

## Dela en tavla

Tavlans inställningar delar även tavlan med **användare** (via e-post) och med **team**, med
behörigheten `read` eller `write`:

- **read** — tavlan och dess kort är synliga, men inget kan ändras: inga nya
  kort, inga flyttar, inga kommentarer, inga körningar.
- **write** — full användning av tavlan: kort, flyttar, kommentarer och körningar.
- Endast **ägaren** ser kugghjulet och borttagningsknapparna, och endast ägaren kan ändra
  tavlans inställningar, dess Agentic Kanban Model eller dess delningar.

Kedjor på en delad tavla körs alltid med **ägarens** credentials och Agentic Kanban
Model, så medarbetare behöver aldrig sina egna.

## Kortbilagor

Öppna ett kort och använd **Attach file** för att lägga till filer till det — släpp dem på rutan eller välj dem
med knappen, och ta bort dem från samma lista. Bilagor lagras i
[Drive](./drive-tab.md).

Varje körning **löser upp bilagorna innan workflowen startar**, efter typ:

- **Dokument** (pdf, markdown, csv, json, text) extraheras till text, begränsat till 20 000
  tecken per fil, i bilagans `text`-fält.
- **Bilder** överlämnas som en `url` som vision-sökvägen laddar direkt (en LLM-nods bild-
  indata accepterar den som den är).
- **Allt annat** skickas vidare som en vanlig referens (`name`, `url`, `mime_type`).

Workflows läser dem vid `$input.card.attachments` (och alltid vid `$input.board.attachments`,
oavsett vad mapparen mappade). Agentic Kanban Model ser även den extraherade texten och bild-
URL:erna, så den kan mappa en bilaga direkt till det fält en workflow förväntar sig.

## Kolumnens workflow-kedjor

Varje kolumn kan konfigureras med en **ordnad lista av workflows** (kedjan).
När ett kort flyttas in i en kolumn som har en kedja:

1. Kedjan startar automatiskt i bakgrunden — själva flytten väntar aldrig.
2. Workflows körs **sekventiellt**. Varje workflows utdata läggs till i kortets
   kontext innan nästa startar.
3. Om en workflow misslyckas stoppas kedjan: återstående länkar hoppas över och
   kortet blir **rött**.
4. När varje länk lyckas blir kortet **grönt**. Medan kedjan körs
   pulserar kortet **gult**; en körning som pausats för mänsklig granskning visar ett statiskt gult
   tillstånd.

Körningar registreras i [Execution History](../reference/execution-history.md) med
trigger-källan `board`, och varje kort har sin egen körningslista med per-workflow-
utdata och fel. Öppna ett kort medan en workflow körs och välj **Open live** bredvid
körningen för att koppla editorn till just den körningen. Samma canvas-animering, inkrementella
Debug-loggar och slutresultat visas utan att en andra körning startas.
## Vad workflows tar emot

Kedjan skickar en standardpayload som workflowens input. Den läses med vanliga
[uttryck](../reference/expression-dsl.md) såsom `$input.card.title`:

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

- `comments` — samtliga kommentarer på kortet, äldst först.
- `history` — hela aktivitetstidslinjen (kommentarer, förflyttningar, utdata), begränsad till
  de 200 senaste posterna.
- `previous_outputs` — utdata från tidigare slutförda körningar (tidigare kolumner och
  uppföljningsrundor).
- `chain.previous_workflow_outputs` — utdata från tidigare länkar i den *aktuella*
  kedjan.
- Vid uppföljningsrundor är `move` `null` och `rerun` är `true`.

## Planeringsloopen (uppföljningsrundor)

Ett vanligt mönster är att placera en planerings-workflow på **andra kolumnen** (som
standard kallas den Planning — namnet saknar betydelse; platsen avgör). Den workflowen
berikar kortet och ställer uppföljningsfrågor:

1. Flytta ett kort till den andra kolumnen — workflowen skriver en berikad plan och sina
   frågor tillbaka till kortet som utdata.
2. Svara i kortets kommentarstråd. Svaret släpper kortet: det flyttas vidare till
   nästa kolumn, som tar emot det med svaret i kontexten. Den andra kolumnens
   kedja körs inte igen.
3. För att i stället förbättra planen på plats, tryck på **Run follow-up round**. Samma
   kedja körs igen med all ackumulerad kontext, varefter kortet väntar i den kolumnen
   tills en kommentar läggs till för att släppa det.

Planeringsgrinden är positionsbaserad, inte namnbaserad: kolumnen längst till vänster och kolumnen
omedelbart till höger om den flyttar aldrig vidare av sig själva — de kör sin
kedja och väntar där (en kommentar släpper den andra kolumnen). Från och med den tredje kolumnen
avancerar en lyckad kedja kortet till höger av sig själv, hela vägen till den sista
kolumnen. Att byta namn på eller ta bort standardetiketten "Planning" ändrar inte vilken plats
som är grinden. Ett kort kan endast ha en aktiv körning åt gången.

## Human-in-the-Loop och Codex-frågor

Om en kedja-workflow pausar — vid en [Human-in-the-Loop](../reference/human-in-the-loop.md)-
nod, vid ett agents HITL-verktyg, eller eftersom en [Codex](../nodes/codex-node.md)-nod behöver
mer information — sparas körningen som väntande och kortet visar det gula väntande
tillståndet. Varje paus behåller sin egen svarsyta: en HITL-granskningslänk för HITL, Codex
uppföljningsskärm för Codex.

När svaret har lämnats återupptas kedjan av sig själv: den pausade workflowen slutförs, dess utdata
hamnar på kortet, resten av den kolumnens kedja körs och kortet avancerar som vanligt.
Om den återupptagna körningen misslyckas blir kortet rött och återstående länkar hoppas över.

## Relaterat

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
