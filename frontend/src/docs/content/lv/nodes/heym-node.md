# Heym

**Heym** mezgls nolasa Heym paša datus: workflow, kuriem varat piekļūt, viena workflow struktūru un tā izpildes vēsturi. Tas ir veids, kā veidot meta-workflow — instanču inventarizāciju, izpildes kopsavilkumus un veselības pārskatus par pašu Heym.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Operācijas | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Akreditācijas dati | Nav nepieciešami |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `heymOperation` | Select | Kuru lasīšanas darbību veikt |
| `heymWorkflowId` | UUID | Iestatiet to uz `all` pie `getExecutionHistory`, lai nolasītu katru pieejamo Workflow. |
| `heymLimit` | String | Maksimālais atgriežamo rindu skaits. **Atstājiet tukšu vai ievadiet `0`, lai atgrieztu visu** — tā ir noklusējuma vērtība. Atbalsta izteiksmes. |
| `heymStatus` | String | Neobligāts statusa filtrs `getExecutionHistory`. Atbalsta izteiksmes. |
| `heymSinceDays` | String | Neobligāts atskatīšanās periods dienās `getExecutionHistory`. Atbalsta izteiksmes. |

Workflow atlasītājs ir meklējams nolaižamais saraksts, kurā uzskaitīti visi workflow, kuriem varat piekļūt.

## Piekļuves tvērums

Rezultāti ir ierobežoti ar **tā workflow īpašnieku, kurā mezgls atrodas** — nevis ar to, kas uzsāka izpildi. Redzamā kopa ir:

- workflow, kas pieder īpašniekam,
- workflow, kas tieši koplietoti ar īpašnieku,
- workflow, kas koplietoti ar komandu, kurai īpašnieks pieder.

Īpašnieka tvērums nodrošina, ka mezgls darbojas identiski neatkarīgi no tā, vai izpilde tika uzsākta manuāli, ar cron, no portāla vai ar platformas notikumu. Izpildītāja tvērums atgrieztu neko katrā neuzraudzītā izpildē. Tas ir tas pats noteikums, ko Heym jau izmanto akreditācijas datiem un globālajiem mainīgajiem.

Workflow, kuram nevarat piekļūt, un workflow, kas neeksistē, rada vienu un to pašu kļūdas ziņojumu, tāpēc mezglu nevar izmantot workflow id noskaidrošanai.

## Operācijas

### List Workflows

Atgriež katru workflow, kuram īpašnieks var piekļūt, visnesenāk atjauninātos vispirms.

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow kopsavilkumu masīvs |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow nosaukums |
| `$nodeLabel.workflows[0].description` | Apraksts vai `null` |
| `$nodeLabel.workflows[0].active` | Vai workflow ir aktīvs |
| `$nodeLabel.workflows[0].folder_id` | Mapes UUID vai `null` |
| `$nodeLabel.workflows[0].updated_at` | Pēdējā saglabāšanas ISO laikspiedols |
| `$nodeLabel.workflows[0].node_count` | Cik mezglus workflow satur |
| `$nodeLabel.total` | Pilns pieejamais skaits **pirms** limita piemērošanas |

`total` apzināti ir neierobežotais skaits, tāpēc `$inventory.total` joprojām norāda reālo apjomu, pat ja ierobežojat atgriežamo rindu skaitu. Notīrot **Limit** vai iestatot to uz `0`, tiek atgriezti visi workflow — tā ir noklusējuma vērtība.

### Get Workflow

Atgriež viena workflow identitāti un struktūru.

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow identitāte |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow metadati |
| `$nodeLabel.node_count` | Mezglu skaits |
| `$nodeLabel.nodes` | Masīvs ar `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Masīvs ar `{ id, source, target, sourceHandle, targetHandle }` |

`data` ir **pilnīga mezgla konfigurācija** — katrs lauks tā, kā tas tika saglabāts. Tas ir tas, kas padara auditēšanu iespējamu: nevarat pārbaudīt workflow, vai tajā nav API atslēgas, ko kāds ielīmējis laukā, ja mezgls atsakās rādīt šo lauku.

Tas nepiešķir piekļuvi, kas izsaucējam jau nebūtu. Mezgls ir ierobežots ar workflow, ko īpašnieks tik un tā var atvērt redaktorā, un saglabātie akreditācijas datu noslēpumi joprojām šeit nav: mezgla datos ir tikai akreditācijas datu **id**, savukārt paši noslēpumi glabājas šifrēti akreditācijas datu tabulā.

### Cietkodētu noslēpumu skenēšana

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Piešķiriet aģentam `$detail.nodes` un lūdziet tam atzīmēt jebkuru `data` vērtību, kas izskatās pēc aktīvas atslēgas vai token. Lauki, kam vērts pievērst uzmanību, ir brīvā teksta lauki — `curl` HTTP mezglos, `userMessage` un `systemInstruction` LLM un Agent mezglos, kā arī Python rīku pamatteksti — jo akreditācijas datu id ir nekaitīgs UUID, bet ielīmēts `sk-…` nav.
### Iegūt izpildes vēsturi

Atgriež vienam workflow piederošos izpildes vēstures ierakstus, jaunākie vispirms.

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.executions` | Vēstures ierakstu masīvs |
| `$nodeLabel.executions[0].id` | Izpildes UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` un tā tālāk |
| `$nodeLabel.executions[0].started_at` | ISO laika zīmogs |
| `$nodeLabel.executions[0].execution_time_ms` | Faktiskais ilgums |
| `$nodeLabel.executions[0].trigger_source` | Kas uzsāka izpildi, piemēram, `cron` vai `heym_event` |
| `$nodeLabel.executions[0].recovered` | Vai izpilde tika atjaunota pēc avārijas |
| `$nodeLabel.executions[0].inputs` | Ko izpilde saņēma — trigger payload vai izsaucēja ievade |
| `$nodeLabel.executions[0].outputs` | Workflow izvade šai izpildei |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, kuram vēsture pieder, vai `null` ar **{AW}** |
ai `null` ar **{AW}** |
| `$nodeLabel.total` | Kopējais atbilstošo izpildes gadījumu skaits **pirms** limita |
|| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Ar **{AW}** Workflow, kuram pieder katra izpilde |
 `$nodeLabel.by_status` | Skaiti pēc statusa, piemēram, `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Loga sākums vai `null` visai vēsturei |

Ieraksti satur gan `inputs`, gan `outputs` — ko izpilde saņēma un ko tā atbildēja —, bet nekad `node_results`: katra mezgla trace ir lielākā kolonna tabulā un aizēnotu visu pārējo. Kad nepieciešams pilns trace, iegūstiet vienu izpildi, izmantojot API.

`total` un `by_status` vienmēr apraksta **visu** atbilstošo vēsturi, pat ja **Limit** ierobežo atgriezto ierakstu skaitu — tāpēc varat iegūt piecas jaunākās izpildes un joprojām ziņot precīzu kļūdu skaitu.

Atstājiet **Since (days)** tukšu, lai aptvertu visu, **Status filter** tukšu, lai iekļautu visus statusus, un **Limit** tukšu vai `0`, lai atgrieztu visus ierakstus.

## Piemēra workflow

**Ikdienas instanču kopsavilkums**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` ar apzīmējumu `inventory`
- **Loop** pār `$inventory.workflows`
- **Heym** `getExecutionHistory` ar `heymWorkflowId`, kas iestatīts uz cikla elementa `id`, `heymSinceDays` ar vērtību `1` un `heymLimit` ar vērtību `5`
- **LLM** pārvērš apkopotās izpildes un statusu skaitus lasāmā kopsavilkumā

## Piezīmes

- Akreditācijas dati nav nepieciešami; mezgls lasa to pašu datubāzi, kurā darbojas Heym.
- **Limit** ir viens un tas pats lauks abām saraksta operācijām, un tam ir viena un tā pati nozīme abās: tukšs vai `0` atgriež visu.
- Mezgls pieņem parastu ievadi un to var pievienot Agent mezglam kā rīku, tāpēc aģents var atbildēt uz jautājumiem par Jūsu Heym instanci — vai to auditēt.
- `getWorkflow` payload kļūst lielāks līdz ar workflow: gari prompt un Python rīku saturs ceļo `data` ietvaros.
- Savienojiet to ar [Heym Trigger](./heym-trigger-node.md), lai reaģētu uz workflow izmaiņām to rašanās brīdī, nevis aptaujātu pēc grafika.

## Saistītais

- [Heym Trigger](./heym-trigger-node.md) – Uzsākt workflow no platformas notikumiem
- [Execute](./execute-node.md) – Palaist citu workflow, nevis to aprakstīt
- [Loop](./loop-node.md) – Iterēt pār atgriezto workflow sarakstu
