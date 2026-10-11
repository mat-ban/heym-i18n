# Cron

Vozlišče **Cron** sproži workflow po urniku z uporabo cron izraza. Uporabniški vnos ni potreben—workflow se samodejno izvaja ob določenih časih.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | Dogodek sprožitve (brez payload-a) |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `cronExpression` | niz | Cron izraz (npr. `0 * * * *` za vsakih eno uro) |

## Oblika Cron Izraza

Standardni 5-poljski cron: `minute hour day-of-month month day-of-week`

| Polje | Vrednosti | Primer |
|-------|-----------|--------|
| Minute | 0–59 | `0` = ob minuti 0 |
| Ura | 0–23 | `*` = vsako uro |
| Dan v mesecu | 1–31 | `*` = vsak dan |
| Mesec | 1–12 | `*` = vsak mesec |
| Dan v tednu | 0–7 (0 in 7 = nedelja) | `*` = vsak dan |

**Pogosti primeri:**

- `0 * * * *` – vsako uro
- `0 0 * * *` – dnevno ob polnoči
- `*/15 * * * *` – vsakih 15 minut
- `0 9 * * 1-5` – delovni dnevi ob 9:00

## Primer

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Sprožilci](../reference/triggers.md) – Cron, Vhod, RabbitMQ
- [Onemogoči vozlišče](./disable-node.md) – Ustavite cron sprožilec po pogojih
- [Omogoči vozlišče](./enable-node.md) – Ponovno zaženite onemogočen cron sprožilec
