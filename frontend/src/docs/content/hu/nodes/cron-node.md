# Cron

A **Cron** csomópont egy workflow-t indít el ütemezés szerint, cron kifejezés használatával. Nem szükséges felhasználói bemenet—a workflow automatikusan fut a megadott időpontokban.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | Trigger esemény (payload nélkül) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont azonosító (camelCase) |
| `cronExpression` | string | Cron kifejezés (pl. `0 * * * *` az óránkénti futáshoz) |

## Cron kifejezés formátuma

Szabványos 5 mezős cron: `minute hour day-of-month month day-of-week`

| Mező | Értékek | Példa |
|-------|--------|---------|
| Perc | 0–59 | `0` = a 0. percben |
| Óra | 0–23 | `*` = minden órában |
| A hónap napja | 1–31 | `*` = minden nap |
| Hónap | 1–12 | `*` = minden hónapban |
| A hét napja | 0–7 (0 és 7 = vasárnap) | `*` = minden nap |

**Gyakori példák:**

- `0 * * * *` – óránként
- `0 0 * * *` – naponta éjfélkor
- `*/15 * * * *` – 15 percenként
- `0 9 * * 1-5` – hétköznapokon 9:00-kor

## Példa

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Triggerek](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Csomópont letiltása](./disable-node.md) – Cron trigger leállítása egy feltétel után
- [Csomópont engedélyezése](./enable-node.md) – Egy letiltott cron trigger újbóli elindítása
