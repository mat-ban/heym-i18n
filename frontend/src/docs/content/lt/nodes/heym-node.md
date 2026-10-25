# Heym

**Heym** mazgas skaito Heym duomenis: workflows, kuriuos galite pasiekti, vieno workflow struktūrą ir jo vykdymo istoriją. Tai yra būdas kurti meta-workflows — instancijų inventorius, vykdymo santraukas ir sveikatos ataskaitas apie patį Heym.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Operacijos | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Kredencialai | Nereikalingi |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `heymOperation` | Pasirinkti | Kurią operaciją atlikti |
| `heymWorkflowId` | UUID | Ties `getExecutionHistory` nustatykite `all`, kad būtų nuskaitytas kiekvienas pasiekiamas Workflow. |
| `heymLimit` | String | Maksimalus grąžinamų eilučių skaičius. **Palikite tuščią arba įveskite `0`, kad grąžintumėte viską** — tai yra numatytoji reikšmė. Galima naudoti išraiškas. |
| `heymStatus` | String | Pasirinktinė statuso filtravimo reikšmė `getExecutionHistory`. Galima naudoti išraiškas. |
| `heymSinceDays` | String | Pasirinktinė atgalinės peržiūros dienomis reikšmė `getExecutionHistory`. Galima naudoti išraiškas. |

Workflow pasirinkimo sąrašas yra paieškos išskleidžiamasis sąrašas, kuriame išvardyti visi workflow, kuriuos galite pasiekti.

## Prieigos sritis

Rezultatai yra ribojami **workflow savininko**, kuriame gyvena mazgas — ne to, kas pradėjo vykdymą. Matomas rinkinys yra:

- workflow, kuriuos savininkas valdo,
- workflow, kurie tiesiogiai bendrinami su savininku,
- workflow, kurie bendrinami su komanda, kuriai priklauso savininkas.

Savininko ribojimas leidžia mazgui elgtis identiškai, nesvarbu, ar vykdymas buvo pradėtas rankiniu būdu, pagal cron, iš portalo ar platformos įvykio. Aktoriaus ribojimas grąžintų nieko kiekvienam neprižiūrimam vykdymui. Tai yra ta pati taisyklė, kurią Heym jau naudoja kredencialams ir globaliems kintamiesiems.

Workflow, kurio negalite pasiekti, ir workflow, kuris neegzistuoja, sukelia tą pačią klaidos žinutę, todėl mazgas negali būti naudojamas workflow id tyrimui.

## Operacijos

### Išvardyti Workflow

Grąžina kiekvieną workflow, kurį savininkas gali pasiekti, pradedant nuo naujausiai atnaujinto.

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.workflows` | Workflow santraukų masyvas |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow pavadinimas |
| `$nodeLabel.workflows[0].description` | Aprašymas, arba `null` |
| `$nodeLabel.workflows[0].active` | Ar workflow yra aktyvus |
| `$nodeLabel.workflows[0].folder_id` | Katalogo UUID, arba `null` |
| `$nodeLabel.workflows[0].updated_at` | Paskutinio išsaugojimo ISO laiko žymė |
| `$nodeLabel.workflows[0].node_count` | Kiek mazgų yra workflow |
| `$nodeLabel.total` | Pilnas pasiekiamas skaičius **prieš** taikant limitą |

`total` yra tyčia neribotas skaičius, todėl `$inventory.total` vis tiek rodo tikrą dydį, kai apribojate grąžinamų eilučių skaičių. Išvalius **Limit** arba nustatant jį į `0`, grąžinamas kiekvienas workflow — tai yra numatytoji reikšmė.

### Gauti Workflow

Grąžina vieno workflow tapatybę ir struktūrą.

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow tapatybė |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow metaduomenys |
| `$nodeLabel.node_count` | Mazgų skaičius |
| `$nodeLabel.nodes` | Masyvas `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Masyvas `{ id, source, target, sourceHandle, targetHandle }` |

`data` yra **visa mazgo konfigūracija** — kiekvienas laukas, kaip jis buvo išsaugotas. Tai leidžia atlikti auditą: negalite peržiūrėti workflow, kad rastumėte API raktą, kurį kažkas įklijavo į lauką, jei mazgas atsisako rodyti lauką.

Tai nesuteikia jokios prieigos, kurios skambintojas jau neturėjo. Mazgas yra ribojamas iki workflow, kuriuos savininkas gali atidaryti redaktoriuje, ir saugomi kredencialų slaptažodžiai vis dar nėra čia: mazgo duomenys laiko tik kredencialų **id**, o slaptažodžiai gyvena užšifruoti kredencialų lentelėje.

### Kietųjų slaptažodžių paieška

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Pateikite agentui `$detail.nodes` ir paprašykite, kad jis pažymėtų bet kurią `data` reikšmę, kuri atrodo kaip aktyvus raktas ar token. Laukai, kuriuos verta stebėti, yra laisvosios teksto formos — `curl` HTTP mazguose, `userMessage` ir `systemInstruction` LLM ir Agent mazguose, ir Python įrankių kūnai — nes kredencialų id yra nekenksmingas UUID, tačiau įklijuotas `sk-…` nėra.
### Gauti Vykdymo Istoriją

Grąžina vykdymo istorijos įrašus vienam workflow, naujausius pirmiausia.

| Išraiška | Aprašymas |
|----------|-----------|
| `$nodeLabel.executions` | Istorijos įrašų masyvas |
| `$nodeLabel.executions[0].id` | Vykdymo UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` ir pan. |
| `$nodeLabel.executions[0].started_at` | ISO laiko žymė |
| `$nodeLabel.executions[0].execution_time_ms` | Laiko trukmė milisekundėmis |
| `$nodeLabel.executions[0].trigger_source` | Kas pradėjo vykdymą, pavyzdžiui, `cron` arba `heym_event` |
| `$nodeLabel.executions[0].recovered` | Ar vykdymas buvo atkurtas po gedimo |
| `$nodeLabel.executions[0].inputs` | Ką vykdymas gavo - trigger payload arba skambinančiojo įvestis |
| `$nodeLabel.executions[0].outputs` | Workflow išvestis tam vykdymui |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, kuriam priklauso istorija, arba `null` su **{AW}** |
rba `null` su **{AW}** |
| `$nodeLabel.total` | Iš viso atitinkančių vykdymų **prieš** limitą |
| `$nodeLabel.by_status` | `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Su **{AW}** Workflow, kuriam priklauso kiekvienas vykdymas |
| Skaičiai pagal statusą, pavyzdžiui, `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Langas, arba `null` visai istorijai |

Įrašai turi tiek `inputs`, tiek `outputs` - ką vykdymas gavo ir ką jis atsakė - tačiau niekada `node_results`: per mazgą sekimo informacija yra didžiausia stulpelyje ir užgožtų viską žemiau. Gaukite vieną vykdymą per API, kai reikia viso sekimo.

`total` ir `by_status` visada apibūdina **visą** atitinkančią istoriją, net kai **Limit** riboja grąžinamus įrašus — taigi galite gauti penkis naujausius vykdymus ir vis tiek pateikti tikslią nesėkmių skaičių.

Palikite **Since (dienos)** tuščią, kad apimtumėte viską, **Status filter** tuščią, kad įtrauktumėte kiekvieną statusą, ir **Limit** tuščią arba `0`, kad grąžintumėte kiekvieną įrašą.

## Pavyzdinis Workflow

**Kasdienis instancijos apžvalga**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` pažymėtas `inventory`
- **Ciklas** per `$inventory.workflows`
- **Heym** `getExecutionHistory` su `heymWorkflowId`, nustatytu ciklo elemento `id`, `heymSinceDays` lygiu `1` ir `heymLimit` lygiu `5`
- **LLM** paverčia surinktus vykdymus ir statuso skaičius į skaitomą santrauką

## Pastabos

- Kredencialų nereikia; mazgas skaito tą pačią duomenų bazę, kurioje veikia Heym.
- **Limit** yra tas pats laukas abiem sąrašų operacijoms, ir jis reiškia tą patį abiem: tuščias arba `0` grąžina viską.
- Mazgas priima normalią įvestį ir gali būti prijungtas prie Agent mazgo kaip įrankis, todėl agentas gali atsakyti į klausimus apie Jūsų Heym instanciją — arba ją audituoti.
- `getWorkflow` payloadai auga su workflow: ilgos užklausos ir Python įrankių kūnai visi keliauja viduje `data`.
- Pora su [Heym Trigger](./heym-trigger-node.md), kad reaguotumėte į workflow pokyčius, kai jie vyksta, o ne tik stebėtumėte pagal tvarkaraštį.

## Susiję

- [Heym Trigger](./heym-trigger-node.md) – Pradėti workflow iš platformos įvykių
- [Execute](./execute-node.md) – Vykdyti kitą workflow, o ne jį aprašyti
- [Loop](./loop-node.md) – Kartoti per grąžintą workflow sąrašą
