# Node inschakelen

De node **Node inschakelen** schakelt een andere node weer in. Bij uitvoering stelt deze de `active` van de doelnode in op `true` en slaat de wijziging blijvend op. Het is de tegenhanger van [Node uitschakelen](./disable-node.md): gebruik het om een [Cron](./cron-node.md)-trigger of een andere node die was uitgeschakeld opnieuw te activeren.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `targetNodeLabel` | string | Label van de in te schakelen node (bijv. `hourlyCheck`) |

## Gedrag

- Het doel wordt opgeslagen als actief, zodat toekomstige uitvoeringen en triggers dit zien. Een opnieuw ingeschakelde Cron-trigger vuurt weer op het eerstvolgende geplande tijdstip.
- Als het doel stroomafwaarts van de Node inschakelen ligt en nog niet is uitgevoerd, wordt het ook in de huidige uitvoering uitgevoerd.
- Het inschakelen van een node die al actief is, verandert niets; de uitvoer meldt nog steeds `enabled: true`.
- De node mislukt met een fout wanneer `targetNodeLabel` leeg is of geen node dat label heeft.

## Gebruiksscenario

Start een [Cron](./cron-node.md)-trigger op aanvraag. Sla de Cron-node uitgeschakeld op en geef de workflow een tweede ingangspunt, zoals een [Invoer](./input-node.md)-trigger. Een verzoek naar dat ingangspunt voert de Node inschakelen uit, en de Cron begint te vuren.

Een uitgeschakelde trigger start nooit zelfstandig een uitvoering, dus de Node inschakelen moet achter een ingangspunt liggen dat kan worden uitgevoerd.

## Voorbeeld

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Stroom: Invoer → Node inschakelen (doel: cron) → Uitvoer. De Cron-node `hourlyCheck` is in dezelfde workflow opgeslagen als uitgeschakeld en voert zijn eigen HTTP-controlevertakking uit zodra deze is ingeschakeld.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Node uitschakelen](./disable-node.md) – Een node van binnenuit een workflow uitschakelen
- [Cron-node](./cron-node.md) – Trigger om in te schakelen
- [Voorwaarde-node](./condition-node.md) – Vertakken vóór het inschakelen
- [Canvas-functies](../reference/canvas-features.md) – Een node handmatig in- of uitschakelen
