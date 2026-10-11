# Cron

**Cron**-noden trigger et workflow på en tidsplan ved hjælp af et cron-udtryk. Ingen brugerinput er nødvendigt - workflowet kører automatisk på de angivne tidspunkter.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | Trigger-begivenhed (ingen payload) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `cronExpression` | string | Cron-udtryk (f.eks. `0 * * * *` for hver time) |

## Cron-udtryksformat

Standard 5-felts cron: `minut time dag-i-måned måned dag-i-uge`

| Felt | Værdier | Eksempel |
|-------|--------|---------|
| Minut | 0–59 | `0` = ved minut 0 |
| Time | 0–23 | `*` = hver time |
| Dag i måned | 1–31 | `*` = hver dag |
| Måned | 1–12 | `*` = hver måned |
| Dag i uge | 0–7 (0 og 7 = søndag) | `*` = hver dag |

**Almindelige eksempler:**

- `0 * * * *` – hver time
- `0 0 * * *` – dagligt ved midnat
- `*/15 * * * *` – hver 15. minut
- `0 9 * * 1-5` – hver hverdag kl. 9:00

## Eksempel

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Deaktiver Node](./disable-node.md) – Stop en cron-trigger efter en betingelse
- [Aktiver Node](./enable-node.md) – Start en deaktiveret cron-trigger igen
