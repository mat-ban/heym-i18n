# Vent

**Vent**-noden sætter workflowets udførelse på pause i en angivet varighed. Den anvendes typisk til rate limiting, forsinkede handlinger eller polling-intervaller.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | Gennemfører input |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `duration` | number | Forsinkelse i millisekunder (f.eks. 1000 = 1 sekund). Editoren accepterer værdier fra 1 til 900000 (15 minutter) |

## Eksempel

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Loop-node](./loop-node.md) – Anvend Vent-node i loops til rate limiting
