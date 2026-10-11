# Cron

Uzel **Cron** spouští workflow podle plánu pomocí cron výrazu. Není vyžadován žádný vstup od uživatele – workflow se spustí automaticky v zadaných časech.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | Trigger event (bez payloadu) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `cronExpression` | string | Cron výraz (např. `0 * * * *` pro každou hodinu) |

## Formát cron výrazu

Standardní 5polohový cron: `minute hour day-of-month month day-of-week`

| Pole | Hodnoty | Příklad |
|-------|--------|---------|
| Minuta | 0–59 | `0` = v minutě 0 |
| Hodina | 0–23 | `*` = každou hodinu |
| Den v měsíci | 1–31 | `*` = každý den |
| Měsíc | 1–12 | `*` = každý měsíc |
| Den v týdnu | 0–7 (0 a 7 = neděle) | `*` = každý den |

**Běžné příklady:**

- `0 * * * *` – každou hodinu
- `0 0 * * *` – denně o půlnoci
- `*/15 * * * *` – každých 15 minut
- `0 9 * * 1-5` – v pracovní dny v 9:00

## Příklad

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Zastavení cron triggeru po splnění podmínky
- [Enable Node](./enable-node.md) – Opětovné spuštění zakázaného cron triggeru
