# Cron

**Cron** node käivitab workflow ajakava alusel, kasutades cron-avaldist. Kasutaja sisendit ei ole vaja—workflow käivitub automaatselt määratud aegadel.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | Trigger event (payload puudub) |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `cronExpression` | string | Cron-avaldis (nt `0 * * * *` iga tunni tagant) |

## Cron-avaldise formaat

Standardne 5-väljaline cron: `minute hour day-of-month month day-of-week`

| Väli | Väärtused | Näide |
|-------|--------|---------|
| Minut | 0–59 | `0` = minutil 0 |
| Tund | 0–23 | `*` = iga tund |
| Kuu päev | 1–31 | `*` = iga päev |
| Kuu | 1–12 | `*` = iga kuu |
| Nädalapäev | 0–7 (0 ja 7 = pühapäev) | `*` = iga päev |

**Levinud näited:**

- `0 * * * *` – iga tunni tagant
- `0 0 * * *` – iga päev keskööl
- `*/15 * * * *` – iga 15 minuti tagant
- `0 9 * * 1-5` – tööpäeviti kell 9:00

## Näide

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Peatage cron trigger pärast tingimust
- [Enable Node](./enable-node.md) – Käivitage keelatud cron trigger uuesti
