# Disable Node

**Disable Node** mezgls neatgriezeniski atspējo citu mezglu workflow. Kad tas tiek izpildīts, tas iestata mērķa mezgla `active` uz `false` un saglabā izmaiņas. Izmantojiet to vienreizējām darbībām, piemēram, lai apturētu cron trigger pēc nosacījuma izpildes.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `targetNodeLabel` | string | Tā mezgla label, kuru atspējot (piem., `hourlyCheck`) |

## Lietošanas gadījums

Atspējojiet [Cron](./cron-node.md) trigger pēc nosacījuma izpildes, lai tas vairs netiktu palaists turpmākajās workflow izpildēs. Vēlāk ieslēdziet to atpakaļ ar [Enable Node](./enable-node.md).

## Piemērs

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Plūsma: Cron → HTTP check → Condition (status complete?) → ja true: Disable Node (target: cron) → Output.

## Saistītais

- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Enable Node](./enable-node.md) – Atspējota mezgla ieslēgšana atpakaļ
- [Cron Node](./cron-node.md) – Trigger, kuru atspējot
- [Condition Node](./condition-node.md) – Sazarojums pirms atspējošanas
