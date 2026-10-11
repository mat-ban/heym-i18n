# Cron

**Cron**-noden utlöser ett workflow enligt ett schema med hjälp av ett cron-uttryck. Ingen användarinmatning krävs—workflowet körs automatiskt vid de angivna tidpunkterna.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 0 |
| Utmatningar | 1 |
| Utdata | Trigger-händelse (ingen payload) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `cronExpression` | string | Cron-uttryck (t.ex. `0 * * * *` för varje timme) |

## Format för cron-uttryck

Standardformat med 5 fält: `minute hour day-of-month month day-of-week`

| Fält | Värden | Exempel |
|------|--------|---------|
| Minute | 0–59 | `0` = vid minut 0 |
| Hour | 0–23 | `*` = varje timme |
| Day of month | 1–31 | `*` = varje dag |
| Month | 1–12 | `*` = varje månad |
| Day of week | 0–7 (0 och 7 = söndag) | `*` = varje dag |

**Vanliga exempel:**

- `0 * * * *` – varje timme
- `0 0 * * *` – dagligen vid midnatt
- `*/15 * * * *` – var 15:e minut
- `0 9 * * 1-5` – vardagar kl. 9:00

## Exempel

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Inaktivera nod](./disable-node.md) – Stoppa en cron-trigger efter ett villkor
- [Aktivera nod](./enable-node.md) – Starta en inaktiverad cron-trigger igen
