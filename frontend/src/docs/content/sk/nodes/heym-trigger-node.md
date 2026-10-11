# Heym Trigger

Uzol **Heym Trigger** spúšťa workflow, keď samotný Heym publikuje platformovú udalosť. Ide o trigger uzol s nulovým vstupom na automatizáciu Hey mu pomocou Hey mu: zmeny v audit trails, oznámenia o nasadení a prehľady o stave inštancie.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Prihlasovacie údaje | Žiadne sa nevyžadujú |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `eventNames` | Pole reťazcov | Ktoré udalosti sa majú odoberať. Ponechajte prázdne, ak chcete prijímať všetky udalosti. |

## Udalosti

| Udalosť | Publikovaná, keď | Rozsah |
|-------|----------------|-------|
| `heym.started` | Platforma Heym sa spustí | V rámci celej inštancie: každý odberateľ ju dostane |
| `workflow.created` | Workflow sa vytvorí | Iba odberatelia vlastníka workflowu |
| `workflow.updated` | Workflow sa uloží | Iba odberatelia vlastníka workflowu |
| `workflow.deleted` | Workflow sa vymaže | Iba odberatelia vlastníka workflowu |

Widgety dashboardu sú interne uložené ako workflowy, ale nikdy neprodukujú udalosti `workflow.*`.

## Doručenie je dávkované

Heym odosiela udalosti každých päť sekúnd. **Každá udalosť prevzatá v jednom cykle odosielania dorazí v jednom spustení workflowu**, ako pole.

- Vytvorte dva workflowy v rozmedzí piatich sekúnd → **jedno** spustenie s dvoma udalosťami.
- Vytvorte jeden workflow → **jedno** spustenie s jednoprvkovým poľom.

Štruktúra sa nikdy nemení, takže výrazy v nadväzných uzloch nikdy nemusia vetviť podľa toho, či dorazila jedna udalosť alebo viacero. Ak potrebujete vykonať akciu raz na udalosť, vložte uzol [Loop](./loop-node.md) nad `$nodeLabel.events`.

## Doručenie presne raz

Každá udalosť je prevzatá pre každý odoberajúci uzol prostredníctvom jedinečného databázového obmedzenia predtým, než je doručená. Toto platí naprieč každým uvicorn workerom, každým kontajnerom a každým strojom: prevádzka Hey mu na dvoch serveroch nedoručí udalosť dvakrát. Ak nie je možné prevzatie zaznamenať, udalosť sa nedoručí vôbec — návrh zlyháva v uzavretom stave namiesto dvojitého spustenia.

Dva rôzne uzly `heymTrigger` odoberajúce tú istú udalosť ju každý dostanú raz; nesúťažia o ňu.

## Okno odosielania

Dispečer zohľadňuje iba udalosti publikované v **posledných piatich minútach**. Staršie udalosti zostávajú v logu na kontrolu, ale nikdy sa nedoručujú. Toto ohraničuje to, čo sa stane po výpadku: opätovné spustenie Hey mu po hodine offline neprehrá nič, namiesto toho, aby naraz spustilo hodinu nahromadených udalostí.

Udalosti sa uchovávajú **7 dní** a potom sa vymažú.

## Výstupné polia

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.events` | Pole objektov udalostí, od najstaršej. Vždy pole. |
| `$nodeLabel.events[0].id` | UUID udalosti |
| `$nodeLabel.events[0].name` | Názov udalosti, napríklad `workflow.created` |
| `$nodeLabel.events[0].payload` | Telo udalosti |
| `$nodeLabel.events[0].workflow_id` | Id príslušného workflowu alebo `null` pre `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO časová značka, kedy bola udalosť publikovaná |
| `$nodeLabel.count` | Počet udalostí v tejto dávke |
| `$nodeLabel.triggered_at` | ISO časová značka spustenia workflowu |

### Tvary payloadu

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

`workflow.deleted` nesie názov zachytený tesne pred vymazaním, keďže riadok workflowu je v čase čítania udalosti už preč.

## Príklad workflowu

**Audit trail zmien workflowov**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** s označením `platformEvents`, odoberajúci `workflow.created`, `workflow.updated`, `workflow.deleted`
- Uzol **Heym** s `getWorkflow` a `heymWorkflowId` nastaveným na `$platformEvents.events[0].workflow_id`
- Správa **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Poznámky

- `heym.started` sa spustí **raz na spustenie platformy**, nie raz na worker, aj keď Heym spúšťa osem workerov na kontajner. Kontajnery, ktoré sa spustia s odstupom viac ako päť minút, publikujú každý jednu udalosť.
- Spustenia vyvolané týmto spôsobom sa zobrazujú v histórii s `trigger_source = "heym_event"`.
- Nastavte **Events** na žiadne namiesto vypísania všetkých štyroch, ak chcete automaticky zachytávať typy udalostí pridané v budúcich verziách.

## Súvisiace

- [Heym](./heym-node.md) – Čítanie workflowov a histórie spustení
- [Triggers](../reference/triggers.md) – Prehľad všetkých vstupných bodov workflowu
- [Loop](./loop-node.md) – Vykonanie akcie raz na udalosť v dávke
