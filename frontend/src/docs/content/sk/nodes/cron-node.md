# Cron

Uzol **Cron** spúšťa workflow podľa plánu pomocou cron výrazu. Nevyžaduje sa žiadny vstup od používateľa – workflow sa spustí automaticky v určených časoch.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | Trigger event (bez payloadu) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `cronExpression` | string | Cron výraz (napr. `0 * * * *` pre každú hodinu) |

## Formát cron výrazu

Štandardný 5-poľový cron: `minute hour day-of-month month day-of-week`

| Pole | Hodnoty | Príklad |
|-------|--------|---------|
| Minúta | 0–59 | `0` = v minúte 0 |
| Hodina | 0–23 | `*` = každú hodinu |
| Deň v mesiaci | 1–31 | `*` = každý deň |
| Mesiac | 1–12 | `*` = každý mesiac |
| Deň v týždni | 0–7 (0 a 7 = nedeľa) | `*` = každý deň |

**Bežné príklady:**

- `0 * * * *` – každú hodinu
- `0 0 * * *` – denne o polnoci
- `*/15 * * * *` – každých 15 minút
- `0 9 * * 1-5` – v pracovné dni o 9:00

## Príklad

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Zastavenie cron triggera po splnení podmienky
- [Enable Node](./enable-node.md) – Opätovné spustenie zakázaného cron triggera
