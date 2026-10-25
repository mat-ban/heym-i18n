# Heym

**Heym**-noden læser Heyms egne data: de workflows der kan tilgås, strukturen af et enkelt workflow og dets kørselshistorik. Den bruges til at oprette meta-workflows - f.eks. instansoversigter, kørselsresuméer og sundhedsrapporter om Heym selv.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Operationer | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Legitimationsoplysninger | Kræves ikke |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `heymOperation` | Vælg | Hvilken læseoperation der skal udføres |
| `heymWorkflowId` | UUID | Angiv `all` for `getExecutionHistory` for at læse ethvert tilgængeligt Workflow. |
| `heymLimit` | String | Maksimalt antal rækker der returneres. **Lad feltet være tomt eller indtast `0` for at returnere alt** - dette er standardværdien. Kan indeholde udtryk. |
| `heymStatus` | String | Valgfri statusfilter for `getExecutionHistory`. Kan indeholde udtryk. |
| `heymSinceDays` | String | Valgfri tilbagebliksperiode i dage for `getExecutionHistory`. Kan indeholde udtryk. |

Workflow-vælgeren er en søgbar dropdown-menu, der viser alle tilgængelige workflows.

## Adgangsomfang

Resultaterne er begrænset til **ejeren af det workflow, hvor noden er placeret** - ikke den der startede kørslen. Det synlige omfang omfatter:

- workflows som ejeren selv har oprettet,
- workflows der er delt direkte med ejeren,
- workflows der er delt med et team som ejeren tilhører.

Denne ejerscoping sikrer, at noden opfører sig ens uanset om en kørsel startes manuelt, via cron, fra en portal eller af en platformshandling. Actorscoping ville returnere ingenting ved hver automatisk kørsel. Det er samme regel som Heym allerede anvender for legitimationsoplysninger og globale variabler.

Et workflow der ikke kan tilgås og et workflow der ikke eksisterer giver samme fejlmeddelelse, så noden kan ikke bruges til at søge efter workflow-ids.

## Operationer

### List Workflows

Returnerer alle workflows som ejeren kan tilgå, sorteret efter seneste opdatering.

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.workflows` | Array af workflow-resuméer |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow-navn |
| `$nodeLabel.workflows[0].description` | Beskrivelse, eller `null` |
| `$nodeLabel.workflows[0].active` | Angiver om workflowet er aktivt |
| `$nodeLabel.workflows[0].folder_id` | Mappe-UUID, eller `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO-tidsstempel for sidste lagring |
| `$nodeLabel.workflows[0].node_count` | Antal noder i workflowet |
| `$nodeLabel.total` | Samlet tilgængeligt antal **før** grænsen anvendes |

`total` er med vilje det ubegrænsede antal, så `$inventory.total` stadig rapporterer den faktiske størrelse selv når der anvendes en grænse. Ved at rydde **Limit** eller indstille den til `0` returneres alle workflows - hvilket er standardindstillingen.

### Get Workflow

Returnerer identitet og struktur for et enkelt workflow.

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow-identitet |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow-metadata |
| `$nodeLabel.node_count` | Antal noder |
| `$nodeLabel.nodes` | Array af `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array af `{ id, source, target, sourceHandle, targetHandle }` |

`data` indeholder den **fulde nodekonfiguration** - alle felter som de blev gemt. Dette muliggør auditing: det er ikke muligt at scanne et workflow for en API-nøgle, som nogen har indsat i et felt, hvis noden nægter at vise feltet.

Dette giver ingen yderligere adgang end den kaldende allerede havde. Noden er begrænset til workflows som ejeren alligevel kan åbne i editoren, og gemte legitimationshemmeligheder vises stadig ikke her: nodedata indeholder kun legitimations-**ids**, mens selve hemmelighederne forbliver krypteret i legitimationsdatabasen.

### Scanning for hårdkodede hemmeligheder

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Giv agenten `$detail.nodes` og bed den flagge enhver `data`-værdi der ligner en aktiv nøgle eller token. Felter der er værd at tjekke er de fritekstfelter - `curl` på HTTP-noder, `userMessage` og `systemInstruction` på LLM- og Agent-noder samt Python-værktøjskroppe - da et legitimations-id er en harmløs UUID, mens en indsat `sk-…` ikke er det.
### Hent Kørselshistorik

Returnerer kørselshistorikposter for et workflow, nyeste først.

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.executions` | Array af historikposter |
| `$nodeLabel.executions[0].id` | Kørsels-UUID |
| `$nodeLabel.executions[0].status` | `success`, `error`, osv. |
| `$nodeLabel.executions[0].started_at` | ISO-tidsstempel |
| `$nodeLabel.executions[0].execution_time_ms` | Vægur-varighed |
| `$nodeLabel.executions[0].trigger_source` | Hvad startede kørslen, f.eks. `cron` eller `heym_event` |
| `$nodeLabel.executions[0].recovered` | Om kørslen blev gendannet efter en nedbrud |
| `$nodeLabel.executions[0].inputs` | Hvad kørslen modtog - trigger-payload eller kalders input |
| `$nodeLabel.executions[0].outputs` | Workflowets output for den pågældende kørsel |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Det Workflow, som historikken tilhører, eller `null` med **{AW}** |
, eller `null` med **{AW}** |
| `$nodeLabel.total` | Samlet antal matchende kørsler **før** grænsen |
| `$nod| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Med **{AW}** det Workflow, som hver kørsel tilhører |
eLabel.by_status` | Tæller nøgler efter status, f.eks. `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Starten af vinduet, eller `null` for fuld historik |

Poster indeholder både `inputs` og `outputs` - hvad kørslen modtog og hvad den svarede - men aldrig `node_results`: per-node-sporet er den største kolonne i tabellen og ville overdøve alt nedstrøms. Hent en enkelt kørsel via API'en, når det fulde spor er nødvendigt.

`total` og `by_status` beskriver altid den **hele** matchende historik, selv når **Limit** begrænser de returnerede poster - så det er muligt at hente de fem seneste kørsler og stadig rapportere en nøjagtig fejltælling.

Lad **Since (days)** være tom for at dække alt, **Status filter** tom for at inkludere alle statusser, og **Limit** tom eller `0` for at returnere alle poster.

## Eksempel på Workflow

**Daglig instansoversigt**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` mærket `inventory`
- **Loop** over `$inventory.workflows`
- **Heym** `getExecutionHistory` med `heymWorkflowId` sat til loop-elementets `id`, `heymSinceDays` på `1`, og `heymLimit` på `5`
- **LLM** omdanner de indsamlede kørsler og statustællinger til en læsbar oversigt

## Bemærkninger

- Ingen legitimationsoplysninger er nødvendige; noden læser den samme database som Heym kører på.
- **Limit** er det samme felt for begge listeoperationer, og det betyder det samme i begge: tom eller `0` returnerer alt.
- Noden tager et normalt input og kan tilsluttes en Agent-node som et værktøj, så en agent kan besvare spørgsmål om Heym-instansen - eller revidere den.
- `getWorkflow`-payloads vokser med workflowet: lange prompts og Python-værktøjskroppe transporteres alle i `data`.
- Kombiner det med [Heym Trigger](./heym-trigger-node.md) for at reagere på workflowændringer, når de sker, i stedet for at afstemme efter en tidsplan.

## Relateret

- [Heym Trigger](./heym-trigger-node.md) – Start et workflow fra platformhændelser
- [Execute](./execute-node.md) – Kør et andet workflow i stedet for at beskrive det
- [Loop](./loop-node.md) – Gentag over den returnerede workflownodeliste
