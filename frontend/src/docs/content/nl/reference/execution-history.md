# Uitvoeringsgeschiedenis

De uitvoeringsgeschiedenis registreert workflow-runs: inputs, outputs, knooppuntresultaten, status en trigger-bron. Gebruik deze om een actieve productie-run te volgen, eerdere runs te inspecteren, fouten te debuggen of opnieuw uit te voeren met dezelfde inputs via **Bring to Canvas**.

## Overzicht

Elke uitvoering slaat het volgende op:

| Veld | Beschrijving |
|-------|-------------|
| **Inputs** | Request body of run-inputs (bijv. `text` voor Input-knooppunt) |
| **Outputs** | Outputs op workflowniveau |
| **Knooppuntresultaten** | Outputs per knooppunt, status en uitvoeringstijd |
| **Status** | `success`, `error`, `pending`, `skipped` of `failed` (zie [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Hoe de run is getriggerd (zie [Triggers](./triggers.md)) |

## Geschiedenis openen

| Locatie | Bereik |
|----------|-------|
| **Editor**-werkbalk | Alleen de huidige workflow |
| **Docs**-weergavekop | Alleen de huidige workflow |
| **Dashboard**-kop (Chat-tab) | Alle workflows + chat/assistant-runs |
| **Evals**-weergavekop | Alle workflows + chat/assistant-runs |

Klik op de knop **History** (klokpictogram) om het dialoogvenster te openen.

## Per-workflow versus alle geschiedenis

- **Per-workflow** (Editor, Docs): Toont runs voor de workflow die op dat moment is geopend. Gebruik **Clear history** om alleen runs voor die workflow te verwijderen.
- **All History** (Dashboard, Evals): Toont runs voor alle workflows en chat/assistant-sessies. De dekking komt overeen met workflow-toegang: workflows die u bezit, workflows die direct met u zijn gedeeld en workflows die zijn gedeeld met een team waarvan u deel uitmaakt. Gebruik **Clear all history** om alle records te verwijderen die u bezit. Geschiedenis voor gedeelde workflows blijft behouden.

## Bring to Canvas

**Bring to Canvas** laadt de inputs en knooppuntoutputs van een geselecteerde run in de huidige workflow.

### Wat wordt geladen

- **Inputs** → Run-inputpaneel (bijv. `text` voor Input-knooppunt, of aangepaste velden)
- **Knooppuntresultaten** → Het uitvoeringsresultaatpaneel toont eerdere outputs per knooppunt
- **Uitvoeringsresultaat** → Status, outputs en timing van de run

### Gedrag per context

- **In Editor** (per-workflow geschiedenis): Wordt direct toegepast op de geopende workflow en sluit het dialoogvenster.
- **Vanuit All History** (Dashboard/Evals): Navigeert naar de workflow-editor en past de gegevens toe zodra de editor is geladen. Alleen beschikbaar voor workflow-runs—niet voor chat/assistant-runs.

### Deep link naar uitvoering

Het openen van een workflow op `/workflows/{workflowId}/{executionId}` brengt die uitvoering automatisch op het canvas — hetzelfde als het selecteren van de run en het kiezen van **Bring to Canvas**. Hierdoor kan een specifieke eerdere run deelbaar worden gemaakt als URL. Als de uitvoering niet kan worden gevonden (verkeerd of verwijderd id), valt de editor terug op het laden van de gewone workflow.

### Gebruiksscenario's

- Een workflow opnieuw uitvoeren met dezelfde inputs
- Een mislukte run debuggen door inputs en knooppuntoutputs te inspecteren
- Outputs tussen runs vergelijken

## AI vragen

Beide geschiedenisvensters hebben een **AI vragen**-knop (sterretje) naast hun titel. Dit opent het [tabblad Chat](../tabs/chat-tab.md#asking-about-a-run) in een nieuw gesprek met de workflow en de geselecteerde run als verwijderbare chips bijgevoegd. Vraag waarom de run traag was, wat er mislukte, of laat Chat de workflow repareren. Chat leest exact die run, inclusief de trace per node en eventuele fouten.

In het venster All History verschijnt **AI vragen** alleen wanneer een workflow-run is geselecteerd; chat- en assistent-runs tonen dit niet.

## Tijdlijn van uitvoeringen

In het detail van de run wisselt de knop **Tijdlijn** (klokje) naast **Alles uitvouwen** de lijst met **Stappen** om voor een span-tijdlijn. Terwijl de tijdlijn wordt weergegeven, toont dezelfde knop **Logboeken**; klik erop om terug te keren naar de lijst. In All History verschijnt de knop alleen voor workflow-runs. De tijdlijn tekent een balk per node op het tijdstip dat deze startte, zodat u ziet welke node hoe lang duurde en welke parallel liepen. Beweeg over een balk voor de duur; klik erop om dezelfde details-inspector te openen als de [uitvoeringstijdlijn](#execution-timeline-details) van de editor. De gekozen weergave blijft behouden zolang het dialoogvenster open is.

Runs die zijn geregistreerd voordat de starttijden van nodes werden opgeslagen, worden achter elkaar op volgorde van duur weergegeven.

## Execution Highlights

Na een live run — of na **Bring to Canvas** — verschijnt een sluitbare popup **Execution Highlights** in de **rechterbovenhoek van het Canvas**. Dit is een snelle manier om te zien *wat elk knooppunt heeft geproduceerd*, van boven naar beneden weergegeven in uitvoeringsvolgorde. Sluit deze met de **✕**; bij de volgende run wordt deze opnieuw geopend.

### Wat wordt weergegeven

| Record | Bron | Automatisch? |
|--------|--------|-------|
| **Input** | De inputparameters van de run (input/trigger-knooppunt) | Ja |
| **Output** | Het resultaat van het output-knooppunt — of, indien er geen is, het bericht van het laatste knooppunt | Ja |
| **Agent / LLM** | De output van elk agent- of LLM-knooppunt | Ja |
| **Output** | Elk ander knooppunt met **Highlight Node Output** ingeschakeld | Opt-in |

Knooppunten die al automatisch worden gemarkeerd (input / output / laatste / agent / llm) verschijnen nooit tweemaal, zelfs niet als u de schakelaar ook inschakelt.

### Elk record

- Toont `Node — message…` met de eerste **250 tekens**; klik op een rij om deze uit te klappen en het **volledige bericht als Markdown** weer te geven, met een knop **Copy**.
- Een knooppunt dat meerdere keren is uitgevoerd (bijv. binnen een loop) toont `Node (N)` met een selector `‹ i / N ›` — kies welke run u wilt bekijken; de selector van elk knooppunt is onafhankelijk.

### Highlight Node Output

Elk knooppunt **behalve Agent en LLM** heeft een selectievakje **Highlight Node Output** in het eigenschappenpaneel (standaard uit). Schakel dit in om de output van dat knooppunt aan de popup toe te voegen. Een kleine ✦-badge verschijnt op gemarkeerde knooppunten op het canvas. In de [workflow DSL](./expression-dsl.md) is dit het node-data-veld `"highlight": true` (standaard `false`).

### Op dashboards

Dashboard-widgetkaarten die een workflow hebben uitgevoerd, tonen een knop ✦ **Execution highlights** in de kaartkop; klik hierop om dezelfde popup voor de run van die widget te openen, met de getekende output van de widget als prominent record.

## Actieve Uitvoeringen

Beide geschiedenisdialogen tonen **momenteel actieve uitvoeringen** bovenaan de lijst, vóór eerdere runs.

- Een draaiende indicator en het label **Running** verschijnen met de starttijd
- Klik op **Open live** om de editor aan die specifieke run te koppelen zonder deze opnieuw te starten
- Het canvas herstelt eerst de knooppunten die al zijn voltooid en ontvangt vervolgens
  `node_start`-, `node_complete`- en definitieve uitvoeringsgebeurtenissen via SSE
- Het huidige knooppunt pulseert op het canvas, stroomafwaartse knooppunten behouden hun wachtende animatie en
  het Debug-paneel voegt elk resultaat toe zodra het binnenkomt—net als bij een run die vanuit de editor is gestart
- Klik op **Cancel** om de uitvoering onmiddellijk te stoppen
- Annuleren vanuit een dialoog (Editor of Dashboard) sluit ook de actieve SSE-stream in elk geopend canvas-tabblad voor die workflow, zodat de editorstatus netjes wordt gereset
- Na annulering verdwijnt de actieve vermelding bij de volgende verversing; klik op **Refresh** om de lijst handmatig bij te werken
- Bij het annuleren van een run die al is voltooid, is het verzoek een no-op

Runs die wachten op een [concurrency-slot](./webhooks.md#concurrency-limit-and-queued-runs) worden in dezelfde sectie weergegeven met het label **Queued 2/5**, hun positie in de rij en de wachtrijgrootte. Ze hebben geen **Open live** knop omdat er nog niets wordt uitgevoerd; **Cancel** haalt een wachtende run uit de wachtrij en registreert deze als `cancelled`. Een run die langer heeft gewacht dan de maximale wachttijd van de workflow wordt geregistreerd als `expired`, en een run die door een volle wachtrij is afgewezen als `queue_full`; beide hebben hun eigen badge in de runlijst.

De live-URL is `/workflows/{workflowId}/{executionId}`. De observer is alleen-lezen: het verlaten
van de editor verbreekt alleen dat browsertabblad en stopt nooit de workflow. Actieve snapshots
worden gedeeld via PostgreSQL, dus het openen van een run werkt nog steeds wanneer de trigger en het editorverzoek
op verschillende backend-workers terechtkomen.

## Crashherstel

Als de server opnieuw opstart (deployment, herstart van de container of crash) terwijl een workflow actief is, stopt de worker van die run halverwege de uitvoering. Heym herstelt deze onderbroken runs automatisch in plaats van ze vast te laten lopen als **Running**.

- Bij de volgende opstart detecteert het gekozen leader-proces verweesde runs — onmiddellijk bij een nette herstart, of binnen ~60 seconden bij een harde crash (zodra heartbeats duidelijk stoppen).
- Herstelde runs worden **opnieuw vanaf het begin uitgevoerd met dezelfde inputs** (niet hervat vanaf het stoppunt), met de huidige workflowdefinitie. Bij voltooiing registreren ze een normale eindvermelding (bijv. `success`), zodat de geschiedenis de run als voltooid toont.
- Een run wordt **één keer** opnieuw geprobeerd. Als de herstelpoging ook wordt onderbroken — of de workflow inmiddels is verwijderd — wordt de vermelding geregistreerd als `failed`.
- Dit werkt hetzelfde in een enkele container en bij multi-worker deployments; alleen de leader voert herstel uit, zodat een run nooit twee keer door verschillende workers wordt hersteld.

### Auto-recover-schakelaar

Het paneel **Execution Log** (run) in de editor heeft een selectievakje **Auto-recover**, **standaard ingeschakeld** per workflow.

- **Aan**: onderbroken runs van deze workflow worden opnieuw uitgevoerd zoals hierboven beschreven.
- **Uit**: onderbroken runs worden niet opnieuw uitgevoerd en worden geregistreerd met status `skipped`.

> Sub-workflow-runs worden niet onafhankelijk hersteld — ze worden opnieuw aangestuurd door hun herstelde bovenliggende run. Triggers met hun eigen herlevering (RabbitMQ, scheduled/cron, IMAP) kunnen bij een herstart ook opnieuw leveren, waardoor een herstelde run soms twee keer kan worden uitgevoerd.

## Wachtende Menselijke Beoordeling

Runs die pauzeren voor [Human-in-the-Loop](./human-in-the-loop.md)-goedkeuring worden onmiddellijk naar de geschiedenis geschreven met status `pending`.

- Het wachtende agent-knooppunt slaat een beoordelingspayload op met `reviewUrl`, `draftText` en `expiresAt`
- Alle knooppunten die zijn verbonden met de `review`-handle van de agent kunnen ook worden uitgevoerd voordat de mens reageert, en hun knooppuntresultaten worden opgeslagen in dezelfde wachtende geschiedenisvermelding
- Geschiedenisdialogen tonen de beoordelingslink zodat eigenaren deze kunnen kopiëren of openen
- Geschiedenisdialogen en het Debug-paneel van de editor tonen de definitieve menselijke beslissing nadat de run is hervat
- Wanneer een beoordelaar de tekst accepteert, bewerkt of weigert, wordt dezelfde geschiedenisvermelding bijgewerkt met het definitieve uitvoeringsresultaat
- Als dezelfde run meer dan eens pauzeert voor HITL, blijft de geschiedenisvermelding hetzelfde terwijl elk controlepunt zijn eigen eenmalige beoordelingslink krijgt

Dit is vooral nuttig voor portaalruns en langdurige workflows die uren of dagen kunnen wachten voordat ze doorgaan.

## Kopiëren

Gebruik **Copy** naast Inputs of Outputs om de JSON naar het klembord te kopiëren.

## Geschiedenis Wissen

- **Per workflow**: Klik in de geschiedenisdialoog van de Editor op **Clear history** om runs voor de huidige workflow te verwijderen.
- **Alle Geschiedenis**: Klik in de geschiedenisdialoog van het Dashboard/Evals op **Clear all history** om alle uitvoeringsrecords die u bezit te verwijderen. Runs van gedeelde workflows blijven behouden. Deze actie kan niet ongedaan worden gemaakt.

## Details van de uitvoeringstijdlijn

Wanneer het **Execution Log** van de editor is geopend, klikt u op de timerknop om de uitvoeringstijdlijn te tonen. Selecteer een span om een inline detailsinspecteur te openen die het rijengebied overneemt. Deze toont de status, duur, het aantal pogingen, retry-informatie, fouten, trace-ID en een compacte uitvoervoorbeeld van de geselecteerde stap. Object- en array-uitvoer gebruiken dezelfde `JsonTree`-viewer als de rest van het Debug-paneel; scalaire waarden gebruiken een tekstvoorbeeld. Wanneer een stap afbeeldingen uitvoert (Playwright-screenshots, gegenereerde afbeeldingen, afbeeldingsbestanden of base64-afbeeldingen in een verzoektekst, overal in de uitvoer gevonden), verschijnen deze als thumbnails boven de uitvoer, en de JSON toont een korte plaatsaanduiding in plaats van de ruwe base64. Klik op een thumbnail om deze in een lightbox te openen; de pijlknoppen of ←/→-toetsen stappen door elke afbeelding in de run, met een teller zoals `2 / 5`. Gebruik **Open trace** voor LLM- en Agent-spans wanneer een trace-ID beschikbaar is.

## Mobiel knooppuntdetail

Op een telefoon toont de editor een volledige schermworkflowstructuur in plaats van het vrije canvas. Tik op een structuurknooppunt met een vastgelegd resultaat om de uitvoering ervan te openen als een volledig schermdetail. De weergave biedt afzonderlijke tabbladen **Invoergegevens**, **Uitvoergegevens** en **Fouten**. Het uitvoertabblad toont het vastgelegde resultaat en biedt **Uitvoer kopiëren**; het invoertabblad toont de configuratie van het geselecteerde knooppunt, en het foutentabblad toont de vastgelegde fout wanneer het knooppunt is mislukt. Gebruik **Terug naar workflow** of de sluitknop om terug te keren naar de structuur.

De canvas- en dashboardgeschiedenisdialogen houden hun uitvoeringsbesturingselementen op één rij en plaatsen de beschikbare tag- en instantiefilters in een responsief raster. Hun filtermenu's gebruiken dezelfde in-app selector, zodat het geselecteerde vinkje een consistente marge en basislijn heeft met elk optielabel.

## Gerelateerd

- [Triggers](./triggers.md) – Hoe workflows worden gestart; geschiedenis registreert `trigger_source` (inclusief `board` voor uitvoeringen gestart door [Board](../tabs/board-tab.md)-kaartverplaatsingen en follow-ups)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL's voor lopende beoordelingen en hervattingsgedrag
- [Bewerkingsgeschiedenis](./edit-history.md) – Versiebeheer voor workflowopslag (terugdraaien, diff)
- [Snelstart](../getting-started/quick-start.md) – Bouw en voer uw eerste workflow uit
- [Workflows-tabblad](../tabs/workflows-tab.md) – Workflows maken en beheren
