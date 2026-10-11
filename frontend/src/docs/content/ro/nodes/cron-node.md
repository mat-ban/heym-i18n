# Cron

Nodul **Cron** declanșează un workflow conform unui program, folosind o expresie cron. Nu este necesară nicio intervenție din partea utilizatorului—workflow-ul rulează automat la momentele specificate.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | Eveniment de declanșare (fără payload) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `cronExpression` | string | Expresie cron (de ex. `0 * * * *` pentru fiecare oră) |

## Formatul expresiei cron

Cron standard cu 5 câmpuri: `minute hour day-of-month month day-of-week`

| Câmp | Valori | Exemplu |
|-------|--------|---------|
| Minut | 0–59 | `0` = la minutul 0 |
| Oră | 0–23 | `*` = în fiecare oră |
| Ziua lunii | 1–31 | `*` = în fiecare zi |
| Luna | 1–12 | `*` = în fiecare lună |
| Ziua săptămânii | 0–7 (0 și 7 = duminică) | `*` = în fiecare zi |

**Exemple frecvente:**

- `0 * * * *` – în fiecare oră
- `0 0 * * *` – zilnic la miezul nopții
- `*/15 * * * *` – la fiecare 15 minute
- `0 9 * * 1-5` – în zilele lucrătoare la ora 9:00

## Exemplu

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Declanșatoare](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Dezactivarea nodului](./disable-node.md) – Oprirea unui trigger cron după o condiție
- [Activarea nodului](./enable-node.md) – Repornirea unui trigger cron dezactivat
