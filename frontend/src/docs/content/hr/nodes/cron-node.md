# Cron

**Cron** čvor pokreće workflow prema rasporedu koristeći cron izraz. Nije potreban nikakav korisnički unos—workflow se izvršava automatski u zadanim vremenima.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | Trigger događaj (bez payloada) |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `cronExpression` | string | Cron izraz (npr. `0 * * * *` za svaki sat) |

## Format cron izraza

Standardni cron s 5 polja: `minute hour day-of-month month day-of-week`

| Polje | Vrijednosti | Primjer |
|-------|--------|---------|
| Minuta | 0–59 | `0` = u minuti 0 |
| Sat | 0–23 | `*` = svaki sat |
| Dan u mjesecu | 1–31 | `*` = svaki dan |
| Mjesec | 1–12 | `*` = svaki mjesec |
| Dan u tjednu | 0–7 (0 i 7 = nedjelja) | `*` = svaki dan |

**Uobičajeni primjeri:**

- `0 * * * *` – svaki sat
- `0 0 * * *` – dnevno u ponoć
- `*/15 * * * *` – svakih 15 minuta
- `0 9 * * 1-5` – radnim danima u 9:00

## Primjer

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Povezano

- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Zaustavljanje cron triggera nakon uvjeta
- [Enable Node](./enable-node.md) – Ponovno pokretanje onemogućenog cron triggera
