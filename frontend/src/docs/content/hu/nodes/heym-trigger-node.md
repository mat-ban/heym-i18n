# Heym Trigger

A **Heym Trigger** csomópont akkor indít el egy workflow-t, amikor maga a Heym tesz közzé egy platformeseményt. Ez egy nulla bemenettel rendelkező trigger csomópont, amely a Heymet automatizálja a Heym segítségével: változások naplózása, telepítési értesítések és példány-állapot összefoglalók.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Hitelesítési adatok | Nem szükséges |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `eventNames` | String tömb | Mely eseményekre kíván feliratkozni. Hagyja üresen, hogy minden eseményt megkapjon. |

## Események

| Esemény | Közzététel feltétele | Hatókör |
|-------|----------------|-------|
| `heym.started` | A Heym platform elindul | Példány szintű: minden feliratkozó megkapja |
| `workflow.created` | Létrejön egy workflow | Csak a workflow tulajdonosának feliratkozói |
| `workflow.updated` | Mentésre kerül egy workflow | Csak a workflow tulajdonosának feliratkozói |
| `workflow.deleted` | Törlésre kerül egy workflow | Csak a workflow tulajdonosának feliratkozói |

Az irányítópult-widgetek belsőleg workflow-ként tárolódnak, de soha nem hoznak létre `workflow.*` eseményeket.

## A kézbesítés kötegelt

A Heym öt másodpercenként küldi ki az eseményeket. **Minden esemény, amelyet egy kiküldési menetben igénybe vesznek, egyetlen workflow-futtatásban érkezik meg**, tömb formájában.

- Hozzon létre két workflow-t öt másodpercen belül → **egy** futtatás két eseménnyel.
- Hozzon létre egy workflow-t → **egy** futtatás egyetlen elemet tartalmazó tömbbel.

A forma soha nem változik, így a downstream kifejezéseknek soha nem kell elágazniuk aszerint, hogy egy vagy több esemény érkezett-e. Ha eseményenként egyszer kell műveletet végrehajtania, helyezzen egy [Loop](./loop-node.md) csomópontot a `$nodeLabel.events` fölé.

## Pontosan egyszeri kézbesítés

Minden eseményt egy egyedi adatbázis-megkötésen keresztül vesznek igénybe feliratkozó csomópontonként, mielőtt kézbesítésre kerülne. Ez minden uvicorn worker, minden konténer és minden gép esetében érvényes: a Heym két szerveren való futtatása nem kézbesít egy eseményt kétszer. Ha egy igénylés nem rögzíthető, az esemény egyáltalán nem kerül kézbesítésre — a tervezés zárt módon hibázik, ahelyett hogy kétszer sülne el.

Két különböző `heymTrigger` csomópont, amely ugyanarra az eseményre iratkozik fel, mindegyik egyszer kapja meg; nem versengenek érte.

## A kiküldési ablak

A diszpécser csak az **elmúlt öt percben** közzétett eseményeket veszi figyelembe. A régebbi események a naplóban maradnak ellenőrzés céljából, de soha nem kerülnek kézbesítésre. Ez korlátozza azt, ami leállás után történik: a Heym egy órás offline állapot utáni újraindítása semmit nem játszik vissza, ahelyett hogy egy órányi hátralékot egyszerre sütne el.

Az eseményeket **7 napig** tárolják, majd törlik.

## Kimeneti mezők

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.events` | Eseményobjektumok tömbje, a legrégebbivel kezdve. Mindig tömb. |
| `$nodeLabel.events[0].id` | Esemény UUID |
| `$nodeLabel.events[0].name` | Esemény neve, például `workflow.created` |
| `$nodeLabel.events[0].payload` | Esemény törzse |
| `$nodeLabel.events[0].workflow_id` | Érintett workflow azonosítója, vagy `null` a `heym.started` esetén |
| `$nodeLabel.events[0].created_at` | ISO időbélyeg az esemény közzétételének időpontjáról |
| `$nodeLabel.count` | Az események száma ebben a kötegben |
| `$nodeLabel.triggered_at` | ISO időbélyeg a workflow-végrehajtásról |

### Payload formák

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

A `workflow.deleted` a törlés előtt rögzített nevet tartalmazza, mivel a workflow sor már nem létezik, mire Ön az eseményt olvassa.

## Példa workflow

**Workflow-változások naplózása**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** címke `platformEvents`, feliratkozva a `workflow.created`, `workflow.updated`, `workflow.deleted` eseményekre
- **Heym** csomópont `getWorkflow` értékkel és `heymWorkflowId` beállítva `$platformEvents.events[0].workflow_id` értékre
- **Slack** üzenet: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Megjegyzések

- A `heym.started` **platformindításonként egyszer** sül el, nem workerenként egyszer, annak ellenére, hogy a Heym nyolc workert futtat konténerenként. Azok a konténerek, amelyek több mint öt perccel később indulnak, mindegyik közzétesz egy eseményt.
- Az ilyen módon kiváltott futtatások az előzményekben `trigger_source = "heym_event"` értékkel jelennek meg.
- Állítsa az **Events** értéket semmire, ahelyett hogy mind a négyet felsorolná, ha automatikusan szeretné felvenni a jövőbeli verziókban hozzáadott eseménytípusokat.

## Kapcsolódó

- [Heym](./heym-node.md) – Workflow-k és végrehajtási előzmények olvasása
- [Triggers](../reference/triggers.md) – Az összes workflow-belépési pont áttekintése
- [Loop](./loop-node.md) – Művelet végrehajtása eseményenként egy kötegben
