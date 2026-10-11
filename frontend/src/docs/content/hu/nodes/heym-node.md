# Heym

A **Heym** csomópont a Heym saját adatait olvassa: az elérhető workflow-kat, egy workflow szerkezetét és annak futtatási előzményeit. Ez teszi lehetővé meta-workflow-k építését — példányleltárakat, futtatási összefoglalókat és a Heymről magáról szóló állapotjelentéseket.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Műveletek | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Hitelesítési adatok | Nem szükséges |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `heymOperation` | Select | Melyik olvasási műveletet hajtsa végre |
| `heymWorkflowId` | UUID | Cél workflow. A `getWorkflow` és a `getExecutionHistory` művelethez kötelező. Kifejezést támogat. |
| `heymLimit` | String | A visszaadandó sorok maximális száma. **Hagyja üresen, vagy adjon meg `0` értéket az összes visszaadásához** — ez az alapértelmezett. Kifejezést támogat. |
| `heymStatus` | String | Opcionális állapotszűrő a `getExecutionHistory` művelethez. Kifejezést támogat. |
| `heymSinceDays` | String | Opcionális visszatekintés napokban a `getExecutionHistory` művelethez. Kifejezést támogat. |

A workflow-választó egy kereshető legördülő lista, amely minden elérhető workflow-t felsorol.

## Hozzáférési hatókör

Az eredmények hatóköre **annak a tulajdonosnak a hatóköre, akinek a workflow-jában a csomópont található** — nem pedig azé, aki a futtatást elindította. A látható halmaz a következő:

- a tulajdonos által birtokolt workflow-k,
- a tulajdonossal közvetlenül megosztott workflow-k,
- olyan workflow-k, amelyeket a tulajdonos által tagként számon tartott csapattal osztottak meg.

A tulajdonos szerinti hatókör az, ami miatt a csomópont ugyanúgy viselkedik, függetlenül attól, hogy a futtatást manuálisan, cron segítségével, egy portálról vagy egy platformesemény indította-e el. A végrehajtó szerinti hatókör minden felügyelet nélküli futtatásnál üres eredményt adna. Ez ugyanaz a szabály, amelyet a Heym már a hitelesítési adatokra és a globális változókra is alkalmaz.

Egy elérhetetlen workflow és egy nem létező workflow ugyanazt a hibaüzenetet eredményezi, így a csomópont nem használható workflow-azonosítók felderítésére.

## Műveletek

### Workflow-k listázása

Visszaadja az összes olyan workflow-t, amelyet a tulajdonos elérhet, a legutóbb frissítettekkel kezdve.

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow-összefoglalók tömbje |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow neve |
| `$nodeLabel.workflows[0].description` | Leírás, vagy `null` |
| `$nodeLabel.workflows[0].active` | Aktív-e a workflow |
| `$nodeLabel.workflows[0].folder_id` | Mappa UUID, vagy `null` |
| `$nodeLabel.workflows[0].updated_at` | Az utolsó mentés ISO időbélyege |
| `$nodeLabel.workflows[0].node_count` | Hány csomópontot tartalmaz a workflow |
| `$nodeLabel.total` | A teljes elérhető darabszám **a limit alkalmazása előtt** |

A `total` szándékosan a korlátlan darabszámot adja vissza, így a `$inventory.total` akkor is a valós méretet jelenti, ha korlátozza a visszaadott sorokat. A **Limit** törlése vagy `0` értékre állítása minden workflow-t visszaad — ez az alapértelmezett.

### Workflow lekérése

Egy workflow azonosítóját és szerkezetét adja vissza.

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | A workflow azonosítója |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | A workflow metaadatai |
| `$nodeLabel.node_count` | A csomópontok száma |
| `$nodeLabel.nodes` | `{ id, type, label, position, data }` tömb |
| `$nodeLabel.edges` | `{ id, source, target, sourceHandle, targetHandle }` tömb |

A `data` a **teljes csomópont-konfiguráció** — minden mező úgy, ahogy mentették. Ez teszi lehetővé az auditálást: nem tud egy workflow-t átvizsgálni olyan API-kulcs után, amelyet valaki beillesztett egy mezőbe, ha a csomópont megtagadja a mező megjelenítését.

Ez nem biztosít olyan hozzáférést, amellyel a hívó korábban ne rendelkezett volna. A csomópont hatóköre azokra a workflow-kra terjed ki, amelyeket a tulajdonos egyébként is meg tud nyitni a szerkesztőben, és a tárolt hitelesítési adatok titkai továbbra sincsenek itt: a csomópont adatai csak a hitelesítési adatok **azonosítóit** tartalmazzák, maguk a titkok pedig titkosítva, a hitelesítési adatok táblájában találhatók.

### Keménykódolt titkok keresése

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Adja meg az agentnek a `$detail.nodes` értéket, és kérje meg, hogy jelöljön meg minden olyan `data` értéket, amely élő kulcsnak vagy tokennek tűnik. Az érdemes figyelmet fordítani a szabad szöveges mezőkre — a HTTP csomópontok `curl` mezőjére, az LLM és Agent csomópontok `userMessage` és `systemInstruction` mezőjére, valamint a Python eszközök törzsére —, mert egy hitelesítési adat azonosítója ártalmatlan UUID, de egy beillesztett `sk-…` már nem az.
### Futtatási előzmények lekérése

Egy workflow futtatási előzményeit adja vissza, a legújabbal kezdve.

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.executions` | Előzménybejegyzések tömbje |
| `$nodeLabel.executions[0].id` | A futtatás UUID-ja |
| `$nodeLabel.executions[0].status` | `success`, `error` és így tovább |
| `$nodeLabel.executions[0].started_at` | ISO időbélyeg |
| `$nodeLabel.executions[0].execution_time_ms` | Valós futási idő |
| `$nodeLabel.executions[0].trigger_source` | Mi indította a futtatást, például `cron` vagy `heym_event` |
| `$nodeLabel.executions[0].recovered` | Hogy a futtatás helyreállt-e egy összeomlás után |
| `$nodeLabel.executions[0].inputs` | Amit a futtatás kapott – a trigger payload vagy a hívó bemenete |
| `$nodeLabel.executions[0].outputs` | A workflow kimenete az adott futtatáshoz |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | A workflow, amelyhez az előzmény tartozik |
| `$nodeLabel.total` | A limit **előtti** összes egyező futtatás |
| `$nodeLabel.by_status` | Státusz szerinti darabszámok, például `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Az időablak kezdete, vagy `null` a teljes előzmény esetén |

A bejegyzések egyszerre tartalmazzák az `inputs` és `outputs` mezőket – vagyis hogy mit kapott és mit adott vissza a futtatás –, de soha nem tartalmaznak `node_results` mezőt: a csomópontonkénti nyomkövetés a táblázat legnagyobb oszlopa, és minden mást elnyomna. Ha a teljes nyomkövetésre van szüksége, egyetlen futtatást kérjen le az API-n keresztül.

A `total` és a `by_status` mindig a **teljes** egyező előzményt írja le, akkor is, ha a **Limit** korlátozza a visszaadott bejegyzéseket – így lekérheti az öt legutóbbi futtatást, és mégis pontos hibaarányt jelenthet.

Hagyja üresen a **Since (days)** mezőt a teljes lefedéshez, a **Status filter** mezőt az összes státusz bevonásához, valamint a **Limit** mezőt üresen vagy `0` értékkel az összes bejegyzés visszaadásához.

## Példa workflow

**Napi példány-összefoglaló**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` `inventory` címkével
- **Loop** a `$inventory.workflows` felett
- **Heym** `getExecutionHistory`, a `heymWorkflowId` a cikluselem `id` értékére állítva, `heymSinceDays` értéke `1`, `heymLimit` értéke `5`
- **LLM** az összegyűjtött futtatásokból és státuszszámokból olvasható összefoglalót készít

## Megjegyzések

- Nem szükséges hitelesítési adat; a csomópont ugyanazt az adatbázist olvassa, amelyen a Heym fut.
- A **Limit** ugyanaz a mező mindkét lista-művelethez, és mindkettőben ugyanazt jelenti: üresen vagy `0` értékkel mindent visszaad.
- A csomópont normál bemenetet fogad, és Agent csomóponthoz is csatolható eszközként, így egy agent válaszolhat a Heym példányával kapcsolatos kérdésekre – vagy auditálhatja azt.
- A `getWorkflow` payloadok a workflow-val együtt nőnek: a hosszú promptok és a Python eszköztörzsek mind a `data` mezőn belül utaznak.
- Párosítsa a [Heym Trigger](./heym-trigger-node.md) csomóponttal, hogy a workflow-változásokra azok bekövetkeztekor reagáljon, ahelyett hogy ütemezés szerint kérdezne le.

## Kapcsolódó

- [Heym Trigger](./heym-trigger-node.md) – Workflow indítása platformeseményekből
- [Execute](./execute-node.md) – Egy másik workflow futtatása a leírása helyett
- [Loop](./loop-node.md) – A visszaadott workflow-lista bejárása
