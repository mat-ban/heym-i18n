# Board

**Board**-fanen er et agent-baseret kanban-board. Arbejdet bevæger sig gennem kolonner, og hver kolonne kan eksekvere Heym-workflows. En kort er ikke blot en opgave – det er en vedvarende agent-baserede job, der bærer kontekst, samtalehistorik, eksekveringsstatus, output og workflow-kørsler.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Se Board-demo</a></p>
-->

## Boards og kolonner

- Det er muligt at oprette så mange boards som nødvendigt. Et nyt board starter med standardkolonnerne **Backlog → Planning → Development → Done**.
- Ethvert board kræver en **Agentic Kanban Model** (legitimationsoplysninger plus en model). Dette er obligatorisk – dialogen for nyt board opretter ikke et board uden, og et board uden en model har deaktiverede handlinger, da det er modellen, der mapper hvert kort til workflow-inputs og omdanner output til læsbar tekst.
- Tandhjulsikonet i board-headeren åbner board-indstillingerne: navn, beskrivelse (vist under headeren) og Agentic Kanban Model.
- Kolonner kan redigeres fuldt ud: tilføj, omdøb, ændr farve, omordn eller slet dem via kolonneindstillingerne (en kolonne skal være tom før sletning).
- Kort ordnes lodret efter prioritet – træk for at omordne.
- Det er også muligt at oprette et kort fra [Chat-fanen](./chat-tab.md) med en naturlig sprogforespørgsel. Chat beder om at vælge et board, når nødvendigt, og tilføjer altid kortet til boardets første kolonne.

## Deltagelse af et board

Board-indstillingerne giver også mulighed for at dele boardet med **brugere** (via email) og med **teams**, med enten `read` eller `write`-tilladelse:

- **read** – boardet og dets kort er synlige, men intet kan ændres: ingen nye kort, flytninger, kommentarer eller kørsler.
- **write** – fuld brug af boardet: kort, flytninger, kommentarer og kørsler.
- Kun **ejeren** ser tandhjuls- og sletningsknapperne, og kun ejeren kan ændre boardets indstillinger, dets Agentic Kanban Model eller dets delinger.

Kæder på et delt board kører altid med **ejerens** legitimationsoplysninger og Agentic Kanban Model, så samarbejdspartnere aldrig behøver deres egne.

## Kortvedhæftninger

Åbn et kort og brug **Attach file** for at tilføje filer – slip dem på boksen eller vælg dem med knappen, og fjern dem fra samme liste. Vedhæftninger gemmes i [Drive](./drive-tab.md).

Hver kørsel **løser vedhæftninger før workflows starter**, efter type:

- **Dokumenter** (pdf, markdown, csv, json, tekst) ekstraheres til tekst, begrænset til 20.000 tegn pr. fil, i vedhæftningens `text`-felt.
- **Billeder** overføres som en `url`, som vision-stien indlæser direkte (en LLM-node's billedinput accepterer den uændret).
- **Alt andet** overføres som en simpel reference (`name`, `url`, `mime_type`).

Workflows læser dem ved `$input.card.attachments` (og altid ved `$input.board.attachments`, uanset hvad mapperen har mapped). Agentic Kanban Model ser den ekstraherede tekst og billed-URL'er, så den kan mappe en vedhæftning direkte til det felt, et workflow forventer.

## Kolonne-workflow-kæder

Hver kolonne kan konfigureres med en **ordnet liste af workflows** (kæden). Når et kort flyttes til en kolonne med en kæde:

1. Kæden startes automatisk i baggrunden – selve flytningen venter aldrig.
2. Workflows kører **sekventielt**. Hvert workflows output tilføjes til kortets kontekst, før det næste starter.
3. Hvis et workflow fejler, stopper kæden: resterende led springes over, og kortet bliver **rødt**.
4. Når alle led lykkes, bliver kortet **grønt**. Mens kæden kører, pulserer kortet **gult**; en kørsel sat på pause til menneskelig gennemgang viser en statisk gul tilstand.

Kørsler registreres i [Execution History](../reference/execution-history.md) med `board` som triggerkilde, og hvert kort opbevarer sin egen kørselssliste med pr. workflow-outputs og fejl. Åbn et kort, mens et workflow kører, og vælg **Open live** ved siden af kørslen for at tilknytte editoren til den pågældende eksekvering. Den samme canvas-animation, inkrementelle debug-logs og endelige resultat vises uden at starte en anden kørsel.
## Hvad workflows modtager

Kæden sender en standard payload som input til workflowet. Det er muligt at læse denne med normale
[udtryk](../reference/expression-dsl.md) såsom `$input.card.title`:

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

- `comments` — alle kommentarer på kortet, ældste først.
- `history` — den fulde aktivitetstidslinje (kommentarer, flytninger, outputs), begrænset til de
  seneste 200 indgange.
- `previous_outputs` — outputs fra tidligere afsluttede kørsler (tidligere kolonner og
  opfølgende runder).
- `chain.previous_workflow_outputs` — outputs fra tidligere led i den *nuværende*
  kæde.
- Ved opfølgende runder er `move` `null` og `rerun` er `true`.

## Planlægningsløkken (opfølgende runder)

En almindelig tilgang er at placere et planlægningsworkflow i **anden kolonne** (som standard
navngivet Planning — navnet er ligegyldigt; pladsen er det afgørende). Dette workflow beriger kortet og stiller opfølgende spørgsmål:

1. Flyt et kort ind i anden kolonne — workflowet skriver en beriget plan og dets
   spørgsmål tilbage til kortet som et output.
2. Besvar spørgsmålene i kortets kommentartråd. Svaret frigiver kortet: det flytter videre til
   næste kolonne, som modtager det med svaret i kontekst. Den anden kolonnes
   kæde køres ikke igen.
3. For at forbedre planen på pladsen, tryk på **Run follow-up round**. Den samme
   kæde køres igen med al akkumuleret kontekst, hvorefter kortet venter i den kolonne
   indtil der tilføjes en kommentar for at frigive det.

Planlægningsporten er positionsbaseret, ikke navnebaseret: den længst til venstre kolonne og kolonnen
umiddelbart til højre for den flytter sig aldrig videre af sig selv — de kører deres kæde og venter
der på input (en kommentar frigiver den anden kolonne). Fra den tredje kolonne og fremad flytter en
vellykket kæde kortet til højre af sig selv, hele vejen til den sidste kolonne. Omdøbning eller fjernelse af standardetiketten "Planning" ændrer ikke hvilken plads der fungerer som port. Et kort kan kun have én aktiv kørsel ad gangen.

## Human-in-the-loop og Codex-spørgsmål

Hvis en kædekørsel sættes på pause — på en [Human-in-the-Loop](../reference/human-in-the-loop.md)
node, på en agents HITL-værktøj, eller fordi en [Codex](../nodes/codex-node.md) node har brug for
mere information — bliver kørslen gemt som afventende, og kortet viser den gule afventende tilstand. Hver pause har sit eget svarflade: et HITL-gennemgangslink for HITL, Codex-opfølgningsskærmen for Codex.

Når der svares, genoptages kæden automatisk: det pausede workflow afsluttes, dets output
landes på kortet, resten af kolonnens kæde køres, og kortet flytter sig som sædvanligt.
Hvis den genoptagede kørsel fejler, bliver kortet rødt, og de resterende led springes over.

## Relateret

- [Workflows](./workflows-tab.md)
- [Kørselshistorik](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
