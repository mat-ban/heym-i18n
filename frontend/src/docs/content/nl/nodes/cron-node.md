# Cron

De **Cron**-node activeert een workflow volgens een tijdschema met behulp van een cron-expressie. Er is geen gebruikersinvoer vereist—de workflow wordt automatisch uitgevoerd op de opgegeven tijdstippen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | Trigger-event (geen payload) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `cronExpression` | string | Cron-expressie (bijv. `0 * * * *` voor elk uur) |

## Cron-expressieformaat

Standaard cron met 5 velden: `minuut uur dag-van-maand maand dag-van-week`

| Veld | Waarden | Voorbeeld |
|-------|--------|---------|
| Minuut | 0–59 | `0` = op minuut 0 |
| Uur | 0–23 | `*` = elk uur |
| Dag van maand | 1–31 | `*` = elke dag |
| Maand | 1–12 | `*` = elke maand |
| Dag van week | 0–7 (0 en 7 = zondag) | `*` = elke dag |

**Veelvoorkomende voorbeelden:**

- `0 * * * *` – elk uur
- `0 0 * * *` – dagelijks om middernacht
- `*/15 * * * *` – elke 15 minuten
- `0 9 * * 1-5` – werkdagen om 9:00

## Voorbeeld

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Node uitschakelen](./disable-node.md) – Stop een cron-trigger na een voorwaarde
- [Node inschakelen](./enable-node.md) – Start een uitgeschakelde cron-trigger opnieuw
