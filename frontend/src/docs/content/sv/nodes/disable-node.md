# Inaktivera nod

Noden **Inaktivera nod** inaktiverar permanent en annan nod i workflowen. Vid körning sätts målnodens `active` till `false` och ändringen sparas. Den används för engångsåtgärder, till exempel att stoppa en Cron-trigger efter att ett villkor har uppfyllts.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `targetNodeLabel` | string | Etikett för noden som ska inaktiveras (t.ex. `hourlyCheck`) |

## Användningsfall

Inaktivera en [Cron](./cron-node.md)-trigger efter att ett villkor har uppfyllts så att den inte längre körs vid framtida workflow-körningar. Den kan aktiveras igen senare med [Aktivera nod](./enable-node.md).

## Exempel

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flöde: Cron → HTTP-kontroll → Villkor (status complete?) → om sant: Inaktivera nod (mål: cron) → Utdata.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Aktivera nod](./enable-node.md) – Aktivera en inaktiverad nod igen
- [Cron-nod](./cron-node.md) – Trigger som ska inaktiveras
- [Villkorsnod](./condition-node.md) – Förgrening före inaktivering
