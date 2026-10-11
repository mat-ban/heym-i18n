# Heym

Vozlišče **Heym** bere lastne podatke Heym: workflows, do katerih lahko dostopate, strukturo enega workflowa in zgodovino njegovih izvajanj. To je način, kako gradite meta-workflows — inventarje instanc, povzetke izvajanj in poročila o zdravju samega Heyma.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Operacije | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Poverilnice | Ni potrebna |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `heymOperation` | Izbira | Katero branje izvesti |
| `heymWorkflowId` | UUID | Ciljni workflow. Obvezno za `getWorkflow` in `getExecutionHistory`. Zmožnost izražanja. |
| `heymLimit` | Niz | Maksimalno število vrstic za vrnitev. **Pustite prazno ali vnesite `0`, da vrnete vse** — to je privzeto. Zmožnost izražanja. |
| `heymStatus` | Niz | Neobvezni filter statusa za `getExecutionHistory`. Zmožnost izražanja. |
| `heymSinceDays` | Niz | Neobvezno iskanje nazaj v dneh za `getExecutionHistory`. Zmožnost izražanja. |

Izbirnik workflowov je iskalni spustni seznam, ki navaja vsak workflow, do katerega lahko dostopate.

## Obseg dostopa

Rezultati so omejeni na **lastnika workflowa, v katerem se nahaja vozlišče** — ne na tistega, ki je zagnal izvajanje. Vidni nabor je:

- workflows, ki jih lastnik ima,
- workflows, ki so neposredno deljeni z lastnikom,
- workflows, ki so deljeni s skupino, kateri lastnik pripada.

Omejitev lastnika je tisto, kar omogoča, da se vozlišče obnaša enako, ne glede na to, ali je bilo izvajanje zagnano ročno, s cronom, iz portala ali z dogodkom platforme. Omejitev akterja bi pri vsakem neobvladovanem izvajanju vrnila nič. To je enako pravilo, ki ga Heym že uporablja za poverilnice in globalne spremenljivke.

Workflow, do katerega ne morete dostopati, in workflow, ki ne obstaja, proizvedeta isto sporočilo o napaki, zato vozlišča ni mogoče uporabiti za iskanje id-jev workflowov.

## Operacije

### Seznam Workflowov

Vrne vsak workflow, do katerega lahko dostopate, pri čemer so najnovejše posodobitve na vrhu.

| Izraz | Opis |
|-------|------|
| `$nodeLabel.workflows` | Množica povzetkov workflowov |
| `$nodeLabel.workflows[0].id` | UUID workflowa |
| `$nodeLabel.workflows[0].name` | Ime workflowa |
| `$nodeLabel.workflows[0].description` | Opis ali `null` |
| `$nodeLabel.workflows[0].active` | Ali je workflow aktiven |
| `$nodeLabel.workflows[0].folder_id` | UUID mape ali `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO časovni žig zadnje shranitve |
| `$nodeLabel.workflows[0].node_count` | Koliko vozlišč vsebuje workflow |
| `$nodeLabel.total` | Skupno dostopno število **pred** uporabo omejitve |

`total` je namerno neomejeno število, tako da `$inventory.total` še vedno poroča o dejanski velikosti, ko omejite vrnjene vrstice. Čiščenje **Omejitve** ali nastavitev na `0` vrne vsak workflow — kar je privzeto.

### Pridobi Workflow

Vrne identiteto in obliko enega workflowa.

| Izraz | Opis |
|-------|------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identiteta workflowa |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metapodatki workflowa |
| `$nodeLabel.node_count` | Število vozlišč |
| `$nodeLabel.nodes` | Množica `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Množica `{ id, source, target, sourceHandle, targetHandle }` |

`data` je **polna konfiguracija vozlišča** — vsak field, kot je bil shranjen. To omogoča revizijo: ne morete skenirati workflowa za API ključ, ki ga je nekdo prilepil v field, če vozlišče zavrne prikazovanje tega fielda.

To ne daje dostopa, ki ga klicatelj že ni imel. Vozlišče je omejeno na workflows, ki jih lastnik lahko odpre v urejevalniku, in shranjeni skrivni podatki poverilnic še vedno niso tukaj: podatki vozlišča vsebujejo le **id**-je poverilnic, medtem ko skrivnosti same živijo šifrirane v tabeli poverilnic.

### Iskanje po trdno kodiranih skrivnostih

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Dajte agentu `$detail.nodes` in ga prosite, naj označi katero koli vrednost `data`, ki izgleda kot aktiven ključ ali token. Polja, ki jih je vredno spremljati, so tista z prostim besedilom — `curl` na HTTP vozliščih, `userMessage` in `systemInstruction` na LLM in Agent vozliščih ter telesa Python orodij — ker je id poverilnice nedolžen UUID, vendar prilepljen `sk-…` ni.
### Pridobitev Zgodovine Izvajanj

Vrne vnose zgodovine izvajanj za en workflow, najnovejše najprej.

| Izraz | Opis |
|-------|------|
| `$nodeLabel.executions` | Množica vnosov zgodovine |
| `$nodeLabel.executions[0].id` | UUID izvajanja |
| `$nodeLabel.executions[0].status` | `success`, `error` in tako naprej |
| `$nodeLabel.executions[0].started_at` | ISO časovni žig |
| `$nodeLabel.executions[0].execution_time_ms` | Trajanje v milisekundah |
| `$nodeLabel.executions[0].trigger_source` | Kaj je zagnalo izvajanje, na primer `cron` ali `heym_event` |
| `$nodeLabel.executions[0].recovered` | Ali je bilo izvajanje obnovljeno po zrušitvi |
| `$nodeLabel.executions[0].inputs` | Kaj je izvajanje prejelo - payload sprožilca ali vhod uporabnika |
| `$nodeLabel.executions[0].outputs` | Izhod workflowa za to izvajanje |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, kateremu pripada zgodovina |
| `$nodeLabel.total` | Skupno število ujemajočih se izvajanj **pred** omejitvijo |
| `$nodeLabel.by_status` | Števila razvrščena po statusu, na primer `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Začetek okna ali `null` za celotno zgodovino |

Vnosi vsebujejo tako `inputs` kot `outputs` - kaj je izvajanje prejelo in kaj je odgovorilo - vendar nikoli `node_results`: sled za vsak node je največja kolona v tabeli in bi zasenčila vse spodnje. Pridobite eno izvajanje preko API, ko potrebujete celotno sled.

`total` in `by_status` vedno opisujeta **celotno** ujemajočo se zgodovino, tudi ko **Limit** omejuje vrnjene vnose — tako lahko pridobite pet najnovejših izvajanj in še vedno poročate o natančnem številu napak.

Pustite **Since (dni)** prazno, da pokrijete vse, **Status filter** prazno, da vključite vsak status, in **Limit** prazno ali `0`, da vrnete vsak vnos.

## Primer Workflowa

**Dnevni povzetek instance**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` označen `inventory`
- **Zanka** preko `$inventory.workflows`
- **Heym** `getExecutionHistory` z `heymWorkflowId` nastavljenim na `id` elementa zanke, `heymSinceDays` na `1`, in `heymLimit` na `5`
- **LLM** pretvori zbrane izvajanja in števila statusov v berljiv povzetek

## Opombe

- Poverilnica ni potrebna; vozlišče bere isto bazo, na kateri deluje Heym.
- **Limit** je isto polje za obe operaciji seznama in pomeni isto tudi v obeh: prazno ali `0` vrne vse.
- Vozlišče sprejema normalen vhod in ga je mogoče povezati z Agent vozliščem kot orodjem, tako da lahko agent odgovori na vprašanja o vaši instanci Heym — ali jo pregleda.
- `getWorkflow` payloadi rastejo z workflowom: dolgi prompti in telesa Python orodij potujejo znotraj `data`.
- Povežite ga z [Heym Trigger](./heym-trigger-node.md), da reagirate na spremembe workflowa, ko se zgodijo, namesto da bi redno preverjali po urniku.

## Sorodno

- [Heym Trigger](./heym-trigger-node.md) – Začnite workflow iz platformskih dogodkov
- [Execute](./execute-node.md) – Zaženite drug workflow namesto da bi ga opisovali
- [Loop](./loop-node.md) – Ponovite seznam vrnjenih workflowov
