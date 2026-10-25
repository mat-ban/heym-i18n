# Heym

**Heym** čvor čita Heymove vlastite podatke: workflows koje možete dosegnuti, strukturu jednog workflowa i njegovu povijest izvršavanja. Tako gradite meta-workflows — inventare instanci, sažetke izvršavanja i izvješća o zdravlju samog Heyma.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Operacije | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Vjerodajnica | Nije potrebna |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `heymOperation` | Select | Koje čitanje izvršiti |
| `heymWorkflowId` | UUID | Postavite ga na `all` kod `getExecutionHistory` kako biste pročitali svaki dostupni Workflow. |
| `heymLimit` | String | Maksimalan broj redaka za vraćanje. **Ostavite prazno ili unesite `0` za vraćanje svega** — to je zadano. Podržava izraze. |
| `heymStatus` | String | Neobavezni filtar statusa za `getExecutionHistory`. Podržava izraze. |
| `heymSinceDays` | String | Neobavezni period pregleda u danima za `getExecutionHistory`. Podržava izraze. |

Odabir workflowa je padajući izbornik s pretraživanjem koji prikazuje svaki workflow koji možete dosegnuti.

## Opseg pristupa

Rezultati su ograničeni na **vlasnika workflowa u kojem čvor živi** — ne na onoga tko je pokrenuo izvršavanje. Vidljivi skup čine:

- workflowi u vlasništvu vlasnika,
- workflowi izravno podijeljeni s vlasnikom,
- workflowi podijeljeni s timom kojem vlasnik pripada.

Ograničavanje na vlasnika čini da se čvor ponaša identično neovisno o tome je li izvršavanje pokrenuto ručno, putem cron-a, s portala ili platformskim događajem. Ograničavanje na izvršitelja vratilo bi ništa pri svakom nenadziranom izvršavanju. To je isto pravilo koje Heym već primjenjuje za vjerodajnice i globalne varijable.

Workflow koji ne možete dosegnuti i workflow koji ne postoji daju istu poruku o pogrešci, pa se čvor ne može koristiti za ispitivanje workflow id-jeva.

## Operacije

### List Workflows

Vraća svaki workflow koji vlasnik može dosegnuti, prvo najnedavnije ažurirane.

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.workflows` | Polje sažetaka workflowa |
| `$nodeLabel.workflows[0].id` | UUID workflowa |
| `$nodeLabel.workflows[0].name` | Naziv workflowa |
| `$nodeLabel.workflows[0].description` | Opis ili `null` |
| `$nodeLabel.workflows[0].active` | Je li workflow aktivan |
| `$nodeLabel.workflows[0].folder_id` | UUID mape ili `null` |
| `$nodeLabel.workflows[0].updated_at` | ISO vremenska oznaka zadnjeg spremanja |
| `$nodeLabel.workflows[0].node_count` | Koliko čvorova workflow sadrži |
| `$nodeLabel.total` | Potpuni dostupni broj **prije** primjene ograničenja |

`total` je namjerno neograničeni broj, tako da `$inventory.total` i dalje prijavljuje stvarnu veličinu kada ograničite vraćene retke. Brisanje **Limit** ili postavljanje na `0` vraća svaki workflow — što je zadano.

### Get Workflow

Vraća identitet i oblik jednog workflowa.

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identitet workflowa |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metapodaci workflowa |
| `$nodeLabel.node_count` | Broj čvorova |
| `$nodeLabel.nodes` | Polje `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Polje `{ id, source, target, sourceHandle, targetHandle }` |

`data` je **potpuna konfiguracija čvora** — svako polje onako kako je spremljeno. To omogućuje reviziju: ne možete skenirati workflow radi API ključa koji je netko zalijepio u polje ako čvor odbija prikazati to polje.

To ne daje nikakav doseg koji pozivatelj već nije imao. Čvor je ograničen na workflows koje vlasnik ionako može otvoriti u editoru, a pohranjeni tajni podaci vjerodajnica i dalje nisu ovdje: podaci čvora sadrže samo **id-jeve** vjerodajnica, dok sami tajni podaci žive šifrirani u tablici vjerodajnica.

### Skeniranje radi otkrivanja tvrdo kodiranih tajni

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Dajte agentu `$detail.nodes` i zamolite ga da označi svaku vrijednost `data` koja izgleda kao aktivni ključ ili token. Polja vrijedna pažnje su ona slobodnog teksta — `curl` na HTTP čvorovima, `userMessage` i `systemInstruction` na LLM i Agent čvorovima te tijela Python alata — jer je id vjerodajnice bezopasan UUID, ali zalijepljeni `sk-…` nije.
### Dohvat povijesti izvršavanja

Vraća zapise povijesti izvršavanja za jedan workflow, najnovije prvo.

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.executions` | Polje zapisa povijesti |
| `$nodeLabel.executions[0].id` | UUID izvršavanja |
| `$nodeLabel.executions[0].status` | `success`, `error` i tako dalje |
| `$nodeLabel.executions[0].started_at` | ISO vremenska oznaka |
| `$nodeLabel.executions[0].execution_time_ms` | Stvarno trajanje |
| `$nodeLabel.executions[0].trigger_source` | Što je pokrenulo izvršavanje, na primjer `cron` ili `heym_event` |
| `$nodeLabel.executions[0].recovered` | Je li izvršavanje oporavljeno nakon pada |
| `$nodeLabel.executions[0].inputs` | Što je izvršavanje primilo – trigger payload ili ulaz pozivatelja |
| `$nodeLabel.executions[0].outputs` | Izlaz workflowa za to izvršavanje |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow kojem povijest pripada ili `null` uz **{AW}** |
i `null` uz **{AW}** |
| `$nodeLabel.total` | Ukupan broj odgovarajućih izvršavanja **prije** ograničenja |
| `$nodeLa| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Uz **{AW}**, Workflow kojem pripada svako izvršavanje |
bel.by_status` | Brojanja po statusu, na primjer `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Početak razdoblja ili `null` za cijelu povijest |

Zapisi sadrže i `inputs` i `outputs` – što je izvršavanje primilo i što je vratilo – ali nikada `node_results`: trag po pojedinim čvorovima najveći je stupac u tablici i zasjenio bi sve nizvodno. Dohvatite pojedinačno izvršavanje putem API-ja kada vam je potreban cijeli trag.

`total` i `by_status` uvijek opisuju **cijelu** odgovarajuću povijest, čak i kada **Limit** ograničava vraćene zapise — tako možete dohvatiti pet najnovijih izvršavanja i pritom prijaviti točan broj neuspjeha.

Ostavite **Since (days)** prazno da obuhvatite sve, **Status filter** prazno da uključite svaki status, a **Limit** prazno ili `0` da vratite svaki zapis.

## Primjer workflowa

**Dnevni pregled instanci**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` s oznakom `inventory`
- **Loop** po `$inventory.workflows`
- **Heym** `getExecutionHistory` s `heymWorkflowId` postavljenim na `id` stavke petlje, `heymSinceDays` na `1` i `heymLimit` na `5`
- **LLM** pretvara prikupljena izvršavanja i brojanja statusa u čitljiv sažetak

## Napomene

- Vjerodajnice nisu potrebne; čvor čita istu bazu podataka na kojoj Heym radi.
- **Limit** je isto polje za obje operacije popisa i znači isto u obje: prazno ili `0` vraća sve.
- Čvor prima uobičajeni ulaz i može se priložiti Agent čvoru kao alat, pa agent može odgovarati na pitanja o vašoj Heym instanci — ili je revidirati.
- `getWorkflow` payloadi rastu s workflowom: dugi promptovi i tijela Python alata putuju unutar `data`.
- Upotrijebite ga zajedno s [Heym Trigger](./heym-trigger-node.md) kako biste reagirali na promjene workflowa čim se dogode, umjesto anketiranja prema rasporedu.

## Povezano

- [Heym Trigger](./heym-trigger-node.md) – Pokrenite workflow iz događaja platforme
- [Execute](./execute-node.md) – Pokrenite drugi workflow umjesto da ga opisujete
- [Loop](./loop-node.md) – Iterirajte po vraćenom popisu workflowa
