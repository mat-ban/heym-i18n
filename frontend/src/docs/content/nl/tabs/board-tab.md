# Board

Het tabblad **Board** is een agentisch kanbanbord. Werk verplaatst zich door kolommen en elke
kolom kan Heym-workflows uitvoeren. Een kaart is niet slechts een taak — het is een persistente
agentische job die context, gespreksgeschiedenis, uitvoeringsstatus, uitvoer en workflow-runs
met zich meedraagt.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boards en kolommen

- Er kunnen zoveel boards worden aangemaakt als nodig. Een nieuw board begint met de standaard
  kolommen **Backlog → Planning → Development → Done**.
- Elk board heeft een **Agentic Kanban Model** nodig (een referentie plus een model). Dit is
  verplicht — het dialoogvenster voor een nieuw board maakt geen board aan zonder dit, en bij een
  board zonder Agentic Kanban Model blijven de acties uitgeschakeld — omdat het model elke
  kaart omzet naar de invoer van de workflows die het uitvoert en hun uitvoer weer omzet naar
  leesbare tekst.
- Het tandwielpictogram in de board-header opent de board-instellingen: naam, beschrijving
  (weergegeven onder de header) en het Agentic Kanban Model.
- Kolommen zijn volledig bewerkbaar: toevoegen, hernoemen, van een andere kleur voorzien,
  herordenen of verwijderen via de kolominstellingen (een kolom moet leeg zijn voordat deze kan
  worden verwijderd).
- Kaarten worden verticaal op prioriteit geordend — versleep ze om de volgorde te wijzigen.
- Een kaart kan ook worden aangemaakt vanuit het [Chat-tabblad](./chat-tab.md) met een verzoek in
  natuurlijke taal. Chat vraagt indien nodig om een board te selecteren en voegt de kaart altijd
  toe aan de eerste kolom van dat board.

## Een board delen

Via de board-instellingen kan het board ook worden gedeeld met **gebruikers** (via e-mail) en met
**teams**, met `read`- of `write`-machtiging:

- **read** — het board en de kaarten zijn zichtbaar, maar er kan niets worden gewijzigd: geen
  nieuwe kaarten, geen verplaatsingen, geen opmerkingen, geen runs.
- **write** — volledig gebruik van het board: kaarten, verplaatsingen, opmerkingen en runs.
- Alleen de **eigenaar** ziet het tandwiel en de verwijderknoppen, en alleen de eigenaar kan de
  board-instellingen, het Agentic Kanban Model of de delingen wijzigen.

Chains op een gedeeld board worden altijd uitgevoerd met de referenties en het Agentic Kanban
Model van de **eigenaar**, zodat samenwerkers nooit hun eigen referenties nodig hebben.

## Kaartbijlagen

Open een kaart en gebruik **Attach file** om bestanden toe te voegen — sleep ze op het vak of kies
ze met de knop, en verwijder ze uit dezelfde lijst. Bijlagen worden opgeslagen in
[Drive](./drive-tab.md).

Elke run **verwerkt de bijlagen voordat de workflows starten**, op basis van het type:

- **Documenten** (pdf, markdown, csv, json, tekst) worden geëxtraheerd naar tekst, beperkt tot
  20.000 tekens per bestand, in het veld `text` van de bijlage.
- **Afbeeldingen** worden doorgegeven als een `url` die het vision-pad direct laadt (de
  afbeeldingsinvoer van een LLM-knooppunt accepteert deze ongewijzigd).
- **Al het overige** wordt doorgegeven als een gewone referentie (`name`, `url`, `mime_type`).

Workflows lezen ze op `$input.card.attachments` (en altijd op `$input.board.attachments`,
ongeacht wat de mapper heeft gemapt). Het Agentic Kanban Model ziet de geëxtraheerde tekst en de
afbeeldings-URL's eveneens, zodat het een bijlage rechtstreeks kan mappen naar het veld dat een
workflow verwacht.

## Workflow-chains per kolom

Elke kolom kan worden geconfigureerd met een **geordende lijst van workflows** (de chain).
Wanneer een kaart naar een kolom met een chain wordt verplaatst:

1. De chain start automatisch op de achtergrond — de verplaatsing zelf wacht nooit.
2. Workflows worden **sequentieel** uitgevoerd. De uitvoer van elke workflow wordt aan de
   kaartcontext toegevoegd voordat de volgende start.
3. Als een workflow mislukt, stopt de chain: de resterende schakels worden overgeslagen en de
   kaart wordt **rood**.
4. Wanneer elke schakel slaagt, wordt de kaart **groen**. Terwijl de chain loopt, pulseert de
   kaart **amber**; een run die is gepauzeerd voor menselijke beoordeling toont een statische
   amber-status.

Runs worden vastgelegd in [Execution History](../reference/execution-history.md) met de
triggingsbron `board`, en elke kaart houdt zijn eigen runlijst bij met uitvoer en fouten per
workflow. Open een kaart terwijl een workflow loopt en kies **Open live** naast de run om de
editor aan die exacte uitvoering te koppelen. Dezelfde canvas-animatie, incrementele
Debug-logs en het eindresultaat verschijnen zonder een tweede run te starten.

## Wat workflows ontvangen

De chain geeft een standaard payload door als invoer van de workflow. Lees deze met normale
[expressies](../reference/expression-dsl.md) zoals `$input.card.title`:

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

- `comments` — elke opmerking op de kaart, oudste eerst.
- `history` — de volledige activiteitentijdlijn (opmerkingen, verplaatsingen, outputs), beperkt tot de
  meest recente 200 vermeldingen.
- `previous_outputs` — outputs van eerdere voltooide uitvoeringen (eerdere kolommen en
  vervolgrondes).
- `chain.previous_workflow_outputs` — outputs van eerdere schakels in de *huidige*
  chain.
- Bij vervolgrondes is `move` `null` en is `rerun` `true`.

## De planningslus (vervolgrondes)

Een veelvoorkomend patroon is om een planningsworkflow op de **tweede kolom** te plaatsen (standaard
genaamd Planning — de naam maakt niet uit; de positie wel). Die workflow verrijkt de
kaart en stelt vervolgvragen:

1. Verplaats een kaart naar de tweede kolom — de workflow schrijft een verrijkt plan en de
   bijbehorende vragen terug naar de kaart als een output.
2. Antwoord in het opmerkingenthread van de kaart. Het antwoord geeft de kaart vrij: deze gaat verder naar
   de volgende kolom, die de kaart oppakt met het antwoord in context. De chain van de tweede kolom
   wordt niet opnieuw uitgevoerd.
3. Om het plan ter plaatse te verbeteren, drukt u op **Run follow-up round**. Dezelfde
   chain wordt opnieuw uitgevoerd met alle verzamelde context, waarna de kaart in die kolom wacht
   totdat u een opmerking toevoegt om deze vrij te geven.

De planningspoort is positioneel, niet op naam gebaseerd: de meest linkse kolom en de kolom
direct daarnaast gaan nooit zelfstandig verder — ze voeren hun chain uit en wachten
daar op u (een opmerking geeft de tweede kolom vrij). Vanaf de derde kolom laat een
succesvolle chain de kaart zelfstandig naar rechts opschuiven, helemaal tot aan de laatste
kolom. Het hernoemen of verwijderen van het standaardlabel "Planning" verandert niet welke positie
de poort is. Een kaart kan slechts één actieve uitvoering tegelijk hebben.

## Human-in-the-Loop en Codex-vragen

Als een chain-workflow pauzeert — bij een [Human-in-the-Loop](../reference/human-in-the-loop.md)-
knooppunt, bij een HITL-tool van een agent, of omdat een [Codex](../nodes/codex-node.md)-knooppunt meer
informatie nodig heeft — wordt de uitvoering opgeslagen als in behandeling en toont de kaart de amberkleurige
status 'in behandeling'. Elke pauze behoudt zijn eigen antwoordoppervlak: een HITL-reviewlink voor HITL, het Codex
vervolkscherm voor Codex.

Zodra u antwoordt, hervat de chain zelfstandig: de gepauzeerde workflow wordt voltooid, de output
komt op de kaart terecht, de rest van de chain van die kolom wordt uitgevoerd en de kaart gaat zoals gebruikelijk verder.
Als de hervatte uitvoering mislukt, wordt de kaart rood en worden de resterende schakels overgeslagen.

## Gerelateerd

- [Workflows](./workflows-tab.md)
- [Uitvoeringsgeschiedenis](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
