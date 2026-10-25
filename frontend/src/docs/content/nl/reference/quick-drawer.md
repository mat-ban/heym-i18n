# Quick Drawer

De **Quick Drawer** is een sneluitvoeringspaneel aan de rechterzijde voor workflows. Het verschijnt op geauthenticeerde pagina's zoals het dashboard [Workflows-tabblad](../tabs/workflows-tab.md), Docs en Evaluatie.

## Toegang

- Klik op de vaste **Quick / Workflows**-trigger aan de rechter-middenrand van het scherm
- Wanneer de [Contextual Showcase](./contextual-showcase.md) ook beschikbaar is, bevindt de **Page Guide**-trigger zich boven Quick Workflows
- De drawer opent vanaf de rechterzijde en verschuift de huidige pagina naar links met een subtiele herschaling
- Op mobiel is de Quick Drawer verborgen
- De drawer wordt niet weergegeven in de workflow-editor, op inlog-/registratiepagina's, in het portaal of op HITL-reviewpagina's

## Workflow zoeken

Gebruik het filterveld bovenaan de drawer om workflows te doorzoeken op:

- Workflownaam
- Workflowbeschrijving

Zoeken is hoofdletterongevoelig en werkt de lijst onmiddellijk bij.

## Vastgezette workflows

Zet workflows vast om ze bovenaan de drawer te houden.

- Vastgezette workflows verschijnen in een eigen sectie boven de volledige lijst
- Nieuwe vastzettingen worden bovenaan toegevoegd
- De volgorde van vastzettingen blijft behouden na herladen in de browseropslag

## Workflows uitvoeren

Selecteer een workflow om het invoerformulier te openen.

- Invoervelden worden verticaal weergegeven in de volgorde van de drawer
- Klik op **Run Workflow** om de geselecteerde workflow uit te voeren
- Klik op **Stop Workflow** om een lopende uitvoering vanuit de drawer te annuleren
- Workflows zonder invoervelden kunnen ook direct worden uitgevoerd
- Een workflow die begint met een [File Upload Trigger](../nodes/file-upload-trigger-node.md) toont in plaats daarvan een dropzone: sleep er een bestand naartoe of klik om er een te kiezen. De zone vermeldt de bestandstypen en -grootte die de trigger accepteert en weigert andere bestanden vóór het uploaden. **Run Workflow** blijft uitgeschakeld totdat er een bestand is gekozen.

De drawer gebruikt dezelfde workflow-uitvoerings-API als andere Heym-uitvoeringsoppervlakken, zodat uitvoer en runtime-gedrag consistent blijven.

Het stoppen van een uitvoering vanuit de drawer annuleert ook de actieve backend-uitvoering, inclusief een eventueel lopende Playwright-browsertaak voor die workflowuitvoering.

## Voortgang en resultaten

Na het starten van een uitvoering toont de drawer:

- Streaming stappenvoortgang voor nodes wanneer deze starten en voltooien
- Eindstatus: `success`, `error` of `pending`
- Einduitvoer in een compact JSON-paneel
- Geschiedenisitems gemarkeerd met `Quick Drawer`

`pending` betekent dat de workflow wacht op een latere actie, zoals menselijke beoordeling.

Quick Drawer-runs zijn productieruns, dus een workflow met een [gelijktijdigheidslimiet](./webhooks.md#concurrency-limit-and-queued-runs) kan ze laten wachten. Terwijl de run in de rij staat, geeft de status **Waiting in queue (2/5)** aan; dit verandert in "running" wanneer de run start en toont het resultaat wanneer deze eindigt, zonder stapsgewijze voortgang. Een run die in de wachtrij is verlopen of tijdens het wachten is geannuleerd, eindigt als `error`.

Een bestandsuitvoering verloopt via de eenmalige uploadlink van de trigger: de drawer vraagt de workflow om een link, uploadt het bestand daarnaartoe en toont het resultaat zodra de upload klaar is. Bestandsuitvoeringen tonen de eindstatus en uitvoer, maar geen stapsgewijze voortgang, en krijgen in de geschiedenis eveneens het label `Quick Drawer`. Het gekozen bestand wordt na elke uitvoering gewist, omdat een link slechts één bestand accepteert.

## Browseropslag

De Quick Drawer slaat persoonlijke voorkeuren op in `localStorage`:

- Vastgezette workflow-ID's
- Laatst geselecteerde workflow

De drawer slaat in deze versie **geen** invoerwaarden op.

## Scope

De Quick Drawer is bewust een lichtgewicht uitvoeringsoppervlak.

- Inbegrepen: zoeken, vastzetten, selecteren, invoer (inclusief een bestand), uitvoeren, voortgang, resultaat
- Uitgesloten: workflowcreatie, bewerken, mapbeheer en canvas-acties

## Gerelateerd

- [Workflows-tabblad](../tabs/workflows-tab.md) – Hoofdlijst van workflows, mappen en beheer
- [Quick Start](../getting-started/quick-start.md) – Bouw en voer uw eerste workflow uit
- [Uitvoeringsgeschiedenis](./execution-history.md) – Bekijk eerdere uitvoeringen
- [Webhooks](./webhooks.md) – Trigger workflows via HTTP
- [Contextual Showcase](./contextual-showcase.md) – Paginaniveau-begeleidingsrail die de Quick Drawer aanvult
