# Heym Trigger

Čvor **Heym Trigger** pokreće workflow kada sam Heym objavi događaj platforme. To je trigger čvor bez ulaza za automatizaciju Hey ma pomoću Hey ma: revizijski tragovi promjena, najave implementacija i sažeci zdravlja instance.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Vjerodajnica | Nije potrebna |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `eventNames` | Polje stringova | Na koje se događaje pretplatiti. Ostavite prazno za primanje svih događaja. |

## Događaji

| Događaj | Objavljuje se kada | Opseg |
|---------|---------------------|-------|
| `heym.started` | Heym platforma se pokrene | Na razini instance: svaki pretplatnik ga prima |
| `workflow.created` | Workflow se kreira | Samo pretplatnici vlasnika workflowa |
| `workflow.updated` | Workflow se spremi | Samo pretplatnici vlasnika workflowa |
| `workflow.deleted` | Workflow se izbriše | Samo pretplatnici vlasnika workflowa |

Widgeti nadzorne ploče interno se pohranjuju kao workflowi, ali nikada ne proizvode događaje `workflow.*`.

## Dostava je grupirana

Heym šalje događaje svakih pet sekundi. **Svaki događaj preuzet u jednom prolazu slanja dolazi u jednom izvršavanju workflowa**, kao polje.

- Kreirajte dva workflowa unutar pet sekundi jedan od drugoga → **jedno** izvršavanje s dva događaja.
- Kreirajte jedan workflow → **jedno** izvršavanje s poljem od jednog elementa.

Oblik se nikada ne mijenja, pa nizvodni izrazi nikada ne moraju granati ovisno o tome je li stigao jedan ili više događaja. Kada trebate djelovati jednom po događaju, postavite čvor [Loop](./loop-node.md) iznad `$nodeLabel.events`.

## Dostava točno jednom

Svaki događaj preuzima se po pretplatničkom čvoru putem jedinstvenog ograničenja baze podataka prije dostave. To vrijedi za svaki uvicorn worker, svaki kontejner i svako računalo: pokretanje Hey ma na dva poslužitelja ne dostavlja događaj dvaput. Ako se preuzimanje ne može zabilježiti, događaj se uopće ne dostavlja — dizajn ne uspijeva zatvoreno umjesto da se aktivira dvaput.

Dva različita čvora `heymTrigger` pretplaćena na isti događaj svaki ga prime jednom; ne natječu se za njega.

## Prozor slanja

Dispečer razmatra samo događaje objavljene u **posljednjih pet minuta**. Stariji događaji ostaju u zapisniku za pregled, ali se nikada ne dostavljaju. To ograničava ono što se događa nakon zastoja: ponovno pokretanje Hey ma nakon sat vremena izvan mreže ne reproducira ništa, umjesto da odjednom aktivira sat vremena zaostatka.

Događaji se čuvaju **7 dana**, a zatim se brišu.

## Izlazna polja

| Izraz | Opis |
|-------|------|
| `$nodeLabel.events` | Polje objekata događaja, najstariji prvi. Uvijek polje. |
| `$nodeLabel.events[0].id` | UUID događaja |
| `$nodeLabel.events[0].name` | Naziv događaja, na primjer `workflow.created` |
| `$nodeLabel.events[0].payload` | Tijelo događaja |
| `$nodeLabel.events[0].workflow_id` | Id predmetnog workflowa ili `null` za `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO vremenska oznaka kada je događaj objavljen |
| `$nodeLabel.count` | Broj događaja u ovoj grupi |
| `$nodeLabel.triggered_at` | ISO vremenska oznaka izvršavanja workflowa |

### Oblici payloada

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` nosi naziv zabilježen neposredno prije brisanja, budući da je redak workflowa nestao u trenutku kada pročitate događaj.

## Primjer workflowa

**Revizijski trag promjena workflowa**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** oznake `platformEvents`, pretplaćen na `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym** čvor s `getWorkflow` i `heymWorkflowId` postavljenim na `$platformEvents.events[0].workflow_id`
- **Slack** poruka: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Napomene

- `heym.started` aktivira se **jednom po pokretanju platforme**, ne jednom po workeru, iako Heym pokreće osam workera po kontejneru. Kontejneri koji se pokrenu više od pet minuta jedan od drugoga svaki objavljuje jedan događaj.
- Izvršavanja pokrenuta na ovaj način pojavljuju se u povijesti s `trigger_source = "heym_event"`.
- Postavite **Events** na ništa umjesto da navedete sva četiri ako želite automatski obuhvatiti vrste događaja dodane u budućim verzijama.

## Povezano

- [Heym](./heym-node.md) – Čitanje workflowa i povijesti izvršavanja
- [Triggers](../reference/triggers.md) – Pregled svih ulaznih točaka workflowa
- [Loop](./loop-node.md) – Djelovanje jednom po događaju u grupi
