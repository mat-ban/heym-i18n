# Heym Trigger

Uzel **Heym Trigger** spouští workflow ve chvíli, kdy samotný Heym publikuje událost platformy. Jedná se o trigger uzel bez vstupů určený k automatizaci HeyMu pomocí HeyMu: auditní záznamy změn, oznámení o nasazení a přehledy stavu instance.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Přihlašovací údaje | Nejsou vyžadovány |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `eventNames` | Pole řetězců | Které události odebírat. Ponechte prázdné pro příjem všech událostí. |

## Události

| Událost | Publikována když | Rozsah |
|-------|----------------|-------|
| `heym.started` | Platforma Heym se spustí | V rámci celé instance: obdrží ji každý odběratel |
| `workflow.created` | Je vytvořen workflow | Pouze odběratelé vlastníka workflow |
| `workflow.updated` | Je uložen workflow | Pouze odběratelé vlastníka workflow |
| `workflow.deleted` | Je smazán workflow | Pouze odběratelé vlastníka workflow |

Widgety dashboardu jsou interně ukládány jako workflow, ale nikdy neprodukují události `workflow.*`.

## Doručování je dávkované

Heym odesílá události každých pět sekund. **Každá událost nárokovaná v jednom průchodu odesílání dorazí v jediném spuštění workflow**, jako pole.

- Vytvořte dva workflow v rozmezí pěti sekund → **jedno** spuštění se dvěma událostmi.
- Vytvořte jeden workflow → **jedno** spuštění s jedno-prvkovým polem.

Struktura se nikdy nemění, takže navazující výrazy nikdy nemusí větvit podle toho, zda dorazila jedna událost nebo mnoho. Pokud potřebujete provést akci jednou za událost, vložte uzel [Loop](./loop-node.md) nad `$nodeLabel.events`.

## Doručení právě jednou

Každá událost je nárokována pro každý odebírající uzel prostřednictvím jedinečného databázového omezení ještě před doručením. To platí napříč všemi uvicorn workery, všemi kontejnery a všemi stroji: provoz HeyMu na dvou serverech nedoručí událost dvakrát. Pokud nárok nelze zaznamenat, událost není doručena vůbec — návrh selhává zavřeně, místo aby se spustil dvakrát.

Dva různé uzly `heymTrigger` odebírající stejnou událost ji každý obdrží jednou; nesoutěží o ni.

## Okno odesílání

Dispečer bere v úvahu pouze události publikované v **posledních pěti minutách**. Starší události zůstávají v logu pro kontrolu, ale nejsou nikdy doručeny. To ohraničuje, co se stane po výpadku: opětovné spuštění HeyMu po hodině offline nic nepřehrává, místo aby najednou spustilo hodinu nahromaděných událostí.

Události jsou uchovávány po dobu **7 dní** a poté smazány.

## Výstupní pole

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.events` | Pole objektů událostí, od nejstarší. Vždy pole. |
| `$nodeLabel.events[0].id` | UUID události |
| `$nodeLabel.events[0].name` | Název události, například `workflow.created` |
| `$nodeLabel.events[0].payload` | Tělo události |
| `$nodeLabel.events[0].workflow_id` | Id subjektu workflow, nebo `null` pro `heym.started` |
| `$nodeLabel.events[0].created_at` | ISO časové razítko publikování události |
| `$nodeLabel.count` | Počet událostí v této dávce |
| `$nodeLabel.triggered_at` | ISO časové razítko spuštění workflow |

### Struktury payloadu

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

`workflow.deleted` nese název zachycený těsně před smazáním, protože řádek workflow je v době čtení události již pryč.

## Příklad workflow

**Auditní záznam změn workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** s označením `platformEvents`, odebírající `workflow.created`, `workflow.updated`, `workflow.deleted`
- Uzel **Heym** s `getWorkflow` a `heymWorkflowId` nastaveným na `$platformEvents.events[0].workflow_id`
- Zpráva **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Poznámky

- `heym.started` se spouští **jednou za spuštění platformy**, nikoli jednou za worker, přestože Heym provozuje osm workerů na kontejner. Kontejnery, které se spustí s odstupem více než pěti minut, publikují každý jednu událost.
- Spuštění vyvolaná tímto způsobem se v historii zobrazují s `trigger_source = "heym_event"`.
- Pokud chcete automaticky zachytávat typy událostí přidané v budoucích verzích, nastavte **Events** na žádné, místo abyste vypisovali všechny čtyři.

## Související

- [Heym](./heym-node.md) – Čtení workflow a historie spuštění
- [Triggers](../reference/triggers.md) – Přehled všech vstupních bodů workflow
- [Loop](./loop-node.md) – Provedení akce jednou za událost v dávce
