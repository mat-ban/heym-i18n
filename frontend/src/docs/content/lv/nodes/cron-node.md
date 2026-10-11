# Cron

**Cron** mezgls palaiž workflow pēc grafika, izmantojot cron izteiksmi. Lietotāja ievade nav nepieciešama — workflow tiek palaists automātiski norādītajos laikos.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | Trigger notikums (bez payload) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgls identifikators (camelCase) |
| `cronExpression` | string | Cron izteiksme (piem., `0 * * * *` katru stundu) |

## Cron izteiksmes formāts

Standarta 5 lauku cron: `minute hour day-of-month month day-of-week`

| Lauks | Vērtības | Piemērs |
|-------|--------|---------|
| Minūte | 0–59 | `0` = 0. minūtē |
| Stunda | 0–23 | `*` = katru stundu |
| Mēneša diena | 1–31 | `*` = katru dienu |
| Mēnesis | 1–12 | `*` = katru mēnesi |
| Nedēļas diena | 0–7 (0 un 7 = svētdiena) | `*` = katru dienu |

**Biežāk lietotie piemēri:**

- `0 * * * *` – katru stundu
- `0 0 * * *` – katru dienu pusnaktī
- `*/15 * * * *` – ik pēc 15 minūtēm
- `0 9 * * 1-5` – darba dienās plkst. 9:00

## Piemērs

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Saistītie

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Apturēt cron trigger pēc nosacījuma
- [Enable Node](./enable-node.md) – Atkal palaist atspējotu cron trigger
