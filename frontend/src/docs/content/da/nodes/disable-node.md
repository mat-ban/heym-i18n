# Deaktiver Node

**Deaktiver Node**-noden deaktiverer permanent en anden node i workflowet. Når den udføres, sættes den målrettede nodes `active` til `false`, og ændringen gemmes. Den anvendes til engangsoperationer som at stoppe en cron-trigger, når en betingelse er opfyldt.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `targetNodeLabel` | string | Label på noden, der skal deaktiveres (f.eks. `hourlyCheck`) |

## Anvendelsestilfælde

Deaktiver en [Cron](./cron-node.md)-trigger, når en betingelse er opfyldt, så den ikke længere kører i fremtidige workflow-kørsler. Det er muligt at aktivere den igen senere med [Aktivér Node](./enable-node.md).

## Eksempel

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flow: Cron → HTTP-check → Betingelse (status complete?) → hvis sand: Deaktiver Node (mål: cron) → Output.

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Aktivér Node](./enable-node.md) – Genaktiver en deaktiveret node
- [Cron Node](./cron-node.md) – Trigger, der skal deaktiveres
- [Betingelsesnode](./condition-node.md) – Forgreningslogik før deaktivering
