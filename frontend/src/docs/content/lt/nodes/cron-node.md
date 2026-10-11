# Cron

**Cron** mazgas suaktyvina workflow pagal grafiką, naudodamas cron išraišką. Vartotojo įvesties nereikia – workflow automatiškai vykdomas nurodytu laiku.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | Trigger įvykis (be payload) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `cronExpression` | string | Cron išraiška (pvz., `0 * * * *` kas valandą) |

## Cron Išraiškos Formatavimas

Standartinė 5 laukų cron: `minute hour day-of-month month day-of-week`

| Laukas | Vertės | Pavyzdys |
|-------|--------|---------|
| Minutė | 0–59 | `0` = 0 minutę |
| Valanda | 0–23 | `*` = kiekvieną valandą |
| Mėnesio diena | 1–31 | `*` = kiekvieną dieną |
| Mėnuo | 1–12 | `*` = kiekvieną mėnesį |
| Savaitės diena | 0–7 (0 ir 7 = sekmadienis) | `*` = kiekvieną dieną |

**Dažniausi pavyzdžiai:**

- `0 * * * *` – kas valandą
- `0 0 * * *` – kasdien vidurnaktį
- `*/15 * * * *` – kas 15 minučių
- `0 9 * * 1-5` – darbo dienomis 9:00

## Pavyzdys

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Susiję

- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Sustabdyti cron trigger po sąlygos
- [Enable Node](./enable-node.md) – Vėl pradėti išjungtą cron trigger
