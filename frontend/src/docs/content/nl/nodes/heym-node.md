# Heym

De **Heym**-node leest Heym's eigen gegevens: de workflows die u kunt bereiken, de structuur van één workflow en de uitvoeringsgeschiedenis daarvan. Dit is hoe u meta-workflows bouwt — instance-inventarissen, uitvoeringssamenvattingen en gezondheidsrapporten over Heym zelf.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Bewerkingen | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Referentie | Geen vereist |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `heymOperation` | Select | Welke leesbewerking moet worden uitgevoerd |
| `heymWorkflowId` | UUID | Doelworkflow. Vereist voor `getWorkflow` en `getExecutionHistory`. Ondersteunt expressies. |
| `heymLimit` | String | Maximaal aantal terug te geven rijen. **Laat dit leeg of voer `0` in om alles terug te geven** — dat is de standaardwaarde. Ondersteunt expressies. |
| `heymStatus` | String | Optionele statusfilter voor `getExecutionHistory`. Ondersteunt expressies. |
| `heymSinceDays` | String | Optionele terugkijkperiode in dagen voor `getExecutionHistory`. Ondersteunt expressies. |

De workflow-kiezer is een doorzoekbare dropdown met elke workflow die u kunt bereiken.

## Toegangsbereik

Resultaten zijn beperkt tot de **eigenaar van de workflow waarin de node zich bevindt** — niet tot degene die de uitvoering heeft gestart. De zichtbare set is:

- workflows die de eigenaar bezit,
- workflows die rechtstreeks met de eigenaar zijn gedeeld,
- workflows die zijn gedeeld met een team waartoe de eigenaar behoort.

Scoping op eigenaar is wat de node identiek laat werken, ongeacht of een uitvoering handmatig, via cron, vanuit een portaal of door een platformgebeurtenis is gestart. Scoping op actor zou niets opleveren bij elke onbeheerde uitvoering. Het is dezelfde regel die Heym al gebruikt voor referenties en globale variabelen.

Een workflow die u niet kunt bereiken en een workflow die niet bestaat, produceren dezelfde foutmelding, zodat de node niet kan worden gebruikt om workflow-id's te sonderen.

## Bewerkingen

### Workflows weergeven

Geeft elke workflow terug die de eigenaar kan bereiken, met de meest recent bijgewerkte eerst.

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.workflows` | Array van workflowsamenvattingen |
| `$nodeLabel.workflows[0].id` | Workflow-UUID |
| `$nodeLabel.workflows[0].name` | Workflownaam |
| `$nodeLabel.workflows[0].description` | Beschrijving, of `null` |
| `$nodeLabel.workflows[0].active` | Of de workflow actief is |
| `$nodeLabel.workflows[0].folder_id` | Map-UUID, of `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO-tijdstempel van de laatste opslag |
| `$nodeLabel.workflows[0].node_count` | Hoeveel nodes de workflow bevat |
| `$nodeLabel.total` | Volledige toegankelijke telling **voordat** de limiet wordt toegepast |

`total` is bewust de onbeperkte telling, zodat `$inventory.total` nog steeds de werkelijke omvang rapporteert wanneer u het aantal teruggegeven rijen beperkt. Het wissen van **Limit**, of het instellen op `0`, geeft elke workflow terug — wat de standaardwaarde is.

### Workflow ophalen

Geeft de identiteit en vorm van één workflow terug.

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow-identiteit |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow-metadata |
| `$nodeLabel.node_count` | Aantal nodes |
| `$nodeLabel.nodes` | Array van `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array van `{ id, source, target, sourceHandle, targetHandle }` |

`data` is de **volledige node-configuratie** — elk veld zoals het is opgeslagen. Dat is wat auditing mogelijk maakt: u kunt een workflow niet scannen op een API-sleutel die iemand in een veld heeft geplakt als de node weigert het veld te tonen.

Dit verleent geen bereik dat de aanroeper niet al had. De node is beperkt tot workflows die de eigenaar toch al in de editor kan openen, en opgeslagen referentiegeheimen bevinden zich hier nog steeds niet: node-data bevat alleen referentie-**id's**, terwijl de geheimen zelf versleuteld in de referentietabel leven.

### Scannen op hardcoded geheimen

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Geef de agent `$detail.nodes` en vraag hem elke `data`-waarde te markeren die op een live sleutel of token lijkt. Velden om in het oog te houden zijn de vrije-tekstvelden — `curl` op HTTP-nodes, `userMessage` en `systemInstruction` op LLM- en Agent-nodes, en Python-tool-body's — omdat een referentie-id een onschadelijke UUID is, maar een geplakte `sk-…` dat niet is.
### Uitvoeringsgeschiedenis ophalen

Retourneert geschiedenisvermeldingen van uitvoeringen voor één workflow, nieuwste eerst.

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.executions` | Array met geschiedenisvermeldingen |
| `$nodeLabel.executions[0].id` | UUID van de uitvoering |
| `$nodeLabel.executions[0].status` | `success`, `error`, enzovoort |
| `$nodeLabel.executions[0].started_at` | ISO-tijdstempel |
| `$nodeLabel.executions[0].execution_time_ms` | Werkelijke duur |
| `$nodeLabel.executions[0].trigger_source` | Wat de uitvoering heeft gestart, bijvoorbeeld `cron` of `heym_event` |
| `$nodeLabel.executions[0].recovered` | Of de uitvoering is hersteld na een crash |
| `$nodeLabel.executions[0].inputs` | Wat de uitvoering heeft ontvangen - de trigger-payload of de invoer van de aanroeper |
| `$nodeLabel.executions[0].outputs` | De uitvoer van de workflow voor die uitvoering |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | De workflow waartoe de geschiedenis behoort |
| `$nodeLabel.total` | Totaal aantal overeenkomende uitvoeringen **vóór** de limiet |
| `$nodeLabel.by_status` | Aantallen per status, bijvoorbeeld `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Begin van het venster, of `null` voor de volledige geschiedenis |

Vermeldingen bevatten zowel `inputs` als `outputs` - wat de uitvoering heeft ontvangen en wat deze heeft geretourneerd - maar nooit `node_results`: de trace per node is de grootste kolom in de tabel en zou alles stroomafwaarts overschaduwen. Haal een enkele uitvoering op via de API wanneer de volledige trace nodig is.

`total` en `by_status` beschrijven altijd de **volledige** overeenkomende geschiedenis, zelfs wanneer **Limit** het aantal geretourneerde vermeldingen beperkt — zo kunnen de vijf meest recente uitvoeringen worden opgehaald en toch een nauwkeurig aantal mislukkingen worden gerapporteerd.

Laat **Since (days)** leeg om alles te dekken, **Status filter** leeg om elke status op te nemen, en **Limit** leeg of `0` om elke vermelding te retourneren.

## Voorbeeldworkflow

**Dagelijkse instance-digest**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` met label `inventory`
- **Loop** over `$inventory.workflows`
- **Heym** `getExecutionHistory` met `heymWorkflowId` ingesteld op de `id` van het loop-item, `heymSinceDays` op `1` en `heymLimit` op `5`
- **LLM** zet de verzamelde uitvoeringen en statusaantallen om in een leesbare samenvatting

## Opmerkingen

- Er is geen referentie nodig; de node leest dezelfde database waarop Heym draait.
- **Limit** is hetzelfde veld voor beide lijstbewerkingen, en het betekent in beide hetzelfde: leeg of `0` retourneert alles.
- De node accepteert een normale invoer en kan als tool aan een Agent-node worden gekoppeld, zodat een agent vragen over uw Heym-instance kan beantwoorden — of deze kan auditen.
- `getWorkflow`-payloads groeien mee met de workflow: lange prompts en Python-tool-bodies reizen allemaal mee in `data`.
- Combineer het met [Heym Trigger](./heym-trigger-node.md) om te reageren op workflowwijzigingen zodra ze plaatsvinden, in plaats van te pollen volgens een schema.

## Gerelateerd

- [Heym Trigger](./heym-trigger-node.md) – Start een workflow vanuit platformgebeurtenissen
- [Execute](./execute-node.md) – Voer een andere workflow uit in plaats van deze te beschrijven
- [Loop](./loop-node.md) – Itereer over de geretourneerde workflowlijst
