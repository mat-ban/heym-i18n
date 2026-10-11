# Aktivera nod

Noden **Aktivera nod** slår på en annan nod igen. Vid körning sätts målnodens `active` till `true` och ändringen sparas. Den är motparten till [Inaktivera nod](./disable-node.md): använd den för att återaktivera en [Cron](./cron-node.md)-trigger eller vilken nod som helst som har stängts av.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `targetNodeLabel` | string | Etikett för noden som ska aktiveras (t.ex. `hourlyCheck`) |

## Beteende

- Målet sparas som aktivt, så framtida körningar och triggers ser det. En återaktiverad Cron-trigger utlöses igen vid sin nästa schemalagda tidpunkt.
- Om målet ligger nedströms Aktivera nod och ännu inte har körts, körs det även i den aktuella körningen.
- Att aktivera en nod som redan är aktiv ändrar ingenting; utdatan rapporterar fortfarande `enabled: true`.
- Noden misslyckas med ett fel när `targetNodeLabel` är tom eller ingen nod har den etiketten.

## Användningsfall

Starta en [Cron](./cron-node.md)-trigger på begäran. Spara Cron-noden avstängd och ge workflowet en andra ingångspunkt, till exempel en [Input](./input-node.md)-trigger. En begäran till den ingångspunkten kör Aktivera nod, och Cron börjar utlösas.

En avstängd trigger startar aldrig en körning av sig själv, så Aktivera nod måste ligga bakom en ingångspunkt som kan köras.

## Exempel

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flöde: Input → Aktivera nod (mål: cron) → Output. Cron-noden `hourlyCheck` sparas som inaktiverad i samma workflow och kör sin egen HTTP-kontrollgren när den har aktiverats.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Inaktivera nod](./disable-node.md) – Stäng av en nod inifrån ett workflow
- [Cron-nod](./cron-node.md) – Trigger att aktivera
- [Villkorsnod](./condition-node.md) – Förgrena innan aktivering
- [Canvas-funktioner](../reference/canvas-features.md) – Aktivera eller inaktivera en nod manuellt
