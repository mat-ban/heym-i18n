# Heym

Noden **Heym** läser Heyms egna data: de workflows som nås, en enskild workflows struktur och dess körningshistorik. Det är så meta-workflows byggs — instansöversikter, sammanställningar av körningar och hälsorapporter om Heym självt.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Operationer | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Autentiseringsuppgifter | Krävs inte |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `heymOperation` | Select | Vilken läsning som ska utföras |
| `heymWorkflowId` | UUID | Målworkflow. Krävs för `getWorkflow` och `getExecutionHistory`. Stöder uttryck. |
| `heymLimit` | String | Maximalt antal rader som returneras. **Lämna tomt eller ange `0` för att returnera allt** — det är standardvärdet. Stöder uttryck. |
| `heymStatus` | String | Valfritt statusfilter för `getExecutionHistory`. Stöder uttryck. |
| `heymSinceDays` | String | Valfri återblick i dagar för `getExecutionHistory`. Stöder uttryck. |

Workflow-väljaren är en sökbar rullista som visar samtliga workflows som nås.

## Åtkomstomfång

Resultaten begränsas till **ägaren av den workflow som noden finns i** — inte till den som startade körningen. Den synliga mängden är:

- workflows som ägaren äger,
- workflows som delats direkt med ägaren,
- workflows som delats med ett team som ägaren tillhör.

Ägaravgränsningen är det som gör att noden beter sig identiskt oavsett om en körning startades manuellt, av cron, från en portal eller av en plattformshändelse. Avgränsning till den som startade körningen skulle returnera ingenting vid varje obemannad körning. Det är samma regel som Heym redan tillämpar för autentiseringsuppgifter och globala variabler.

En workflow som inte nås och en workflow som inte finns ger samma felmeddelande, så noden kan inte användas för att sondera efter workflow-id:n.

## Operationer

### List Workflows

Returnerar samtliga workflows som ägaren når, med den senast uppdaterade först.

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.workflows` | Array med workflowsammanfattningar |
| `$nodeLabel.workflows[0].id` | Workflow-UUID |
| `$nodeLabel.workflows[0].name` | Workflowens namn |
| `$nodeLabel.workflows[0].description` | Beskrivning, eller `null` |
| `$nodeLabel.workflows[0].active` | Huruvida workflowen är aktiv |
| `$nodeLabel.workflows[0].folder_id` | Mapp-UUID, eller `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO-tidsstämpel för senaste sparning |
| `$nodeLabel.workflows[0].node_count` | Antal noder som workflowen innehåller |
| `$nodeLabel.total` | Fullständigt antal nåbara **innan** gränsen tillämpas |

`total` är medvetet det obegränsade antalet, så att `$inventory.total` fortfarande rapporterar den verkliga storleken när antalet returnerade rader begränsas. Om **Limit** rensas, eller sätts till `0`, returneras samtliga workflows — vilket är standardvärdet.

### Get Workflow

Returnerar en enskild workflows identitet och form.

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflowens identitet |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflowens metadata |
| `$nodeLabel.node_count` | Antal noder |
| `$nodeLabel.nodes` | Array med `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array med `{ id, source, target, sourceHandle, targetHandle }` |

`data` är **nodens fullständiga konfiguration** — varje fält så som det sparades. Det är detta som gör granskning möjlig: en workflow kan inte genomsökas efter en API-nyckel som någon klistrat in i ett fält om noden vägrar visa fältet.

Detta ger ingen åtkomst som anroparen inte redan hade. Noden är begränsad till workflows som ägaren ändå kan öppna i redigeraren, och lagrade hemligheter för autentiseringsuppgifter finns fortfarande inte här: noddata innehåller endast autentiseringsuppgifternas **id:n**, medan hemligheterna själva ligger krypterade i tabellen för autentiseringsuppgifter.

### Sökning efter hårdkodade hemligheter

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Ge agenten `$detail.nodes` och be den flagga varje `data`-värde som ser ut som en aktiv nyckel eller token. Fält värda att bevaka är de fritextbaserade — `curl` på HTTP-noder, `userMessage` och `systemInstruction` på LLM- och Agent-noder, samt Python-verktygskroppar — eftersom ett autentiserings-id är ett ofarligt UUID, men en inklistrad `sk-…` är det inte.
### Hämta körningshistorik

Returnerar körningshistorik-poster för ett workflow, nyaste först.

| Uttryck | Beskrivning |
|------------|-------------|
| `$nodeLabel.executions` | Array av historikposter |
| `$nodeLabel.executions[0].id` | Körningens UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` och så vidare |
| `$nodeLabel.executions[0].started_at` | ISO-tidsstämpel |
| `$nodeLabel.executions[0].execution_time_ms` | Väggklockans varaktighet |
| `$nodeLabel.executions[0].trigger_source` | Vad som startade körningen, till exempel `cron` eller `heym_event` |
| `$nodeLabel.executions[0].recovered` | Huruvida körningen återställdes efter en krasch |
| `$nodeLabel.executions[0].inputs` | Vad körningen tog emot – trigger-payloaden eller anroparens indata |
| `$nodeLabel.executions[0].outputs` | Workflowets utdata för den körningen |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflowet som historiken tillhör |
| `$nodeLabel.total` | Totalt antal matchande körningar **före** gränsen |
| `$nodeLabel.by_status` | Antal grupperade efter status, till exempel `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Fönstrets start, eller `null` för hela historiken |

Poster innehåller både `inputs` och `outputs` – vad körningen tog emot och vad den svarade – men aldrig `node_results`: spårningen per nod är tabellens största kolumn och skulle överskugga allt nedströms. Hämta en enskild körning via API:et när hela spårningen behövs.

`total` och `by_status` beskriver alltid den **hela** matchande historiken, även när **Limit** begränsar de returnerade posterna – så det går att hämta de fem senaste körningarna och ändå rapportera ett korrekt antal fel.

Lämna **Since (days)** tomt för att täcka allt, **Status filter** tomt för att inkludera alla statusar, och **Limit** tomt eller `0` för att returnera varje post.

## Exempel på workflow

**Daglig instanssammanfattning**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` märkt `inventory`
- **Loop** över `$inventory.workflows`
- **Heym** `getExecutionHistory` med `heymWorkflowId` satt till loopobjektets `id`, `heymSinceDays` på `1` och `heymLimit` på `5`
- **LLM** omvandlar de insamlade körningarna och statusantalen till en läsbar sammanfattning

## Anmärkningar

- Ingen autentiseringsuppgift behövs; noden läser samma databas som Heym körs på.
- **Limit** är samma fält för båda listoperationerna och betyder samma sak i båda: tomt eller `0` returnerar allt.
- Noden tar en vanlig indata och kan kopplas till en Agent-nod som ett verktyg, så en agent kan svara på frågor om Heym-instansen – eller granska den.
- `getWorkflow`-payloads växer med workflowet: långa prompts och Python-verktygskroppar färdas alla inuti `data`.
- Kombinera den med [Heym Trigger](./heym-trigger-node.md) för att reagera på workflowändringar när de sker i stället för att polla enligt ett schema.

## Relaterat

- [Heym Trigger](./heym-trigger-node.md) – Starta ett workflow från plattformshändelser
- [Execute](./execute-node.md) – Kör ett annat workflow i stället för att beskriva det
- [Loop](./loop-node.md) – Iterera över den returnerade workflowlistan
