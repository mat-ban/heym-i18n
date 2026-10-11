# Execute

Uzol **Execute** volá iný workflow (pod-workflow) a odovzdáva mu vstup. Použite ho na opakovane použiteľnú logiku, nie na transformáciu údajov – na to slúži uzol [Set](./set-node.md).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `executeWorkflowId` | UUID | ID workflow, ktorý sa má spustiť |
| `executeInput` | expression | Jediný vstup (pre workflowy s jedným vstupným poľom) |
| `executeInputMappings` | array | `{ key, value }` pre viacero vstupov. `key` = názov vstupného poľa cieľového workflow. |
| `executeDoNotWait` | boolean | Ak je `true`, odošle pod-workflow na pozadí bez čakania. Výstup: `{ "status": "dispatched", "workflow_id": "..." }`. Predvolené: `false`. |

## Formát odpovede

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Bez čakania

Ak je `executeDoNotWait: true`, uzol odošle pod-workflow do vlákna na pozadí a okamžite vráti:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Nadradený workflow pokračuje na ďalší uzol bez čakania. Záznam o spustení pod-workflow sa do trace zapíše asynchrónne po jeho dokončení. Použite to vtedy, keď výsledok pod-workflow nie je potrebný v nadväzujúcich krokoch.

## Jediný vstup

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Viacero vstupov

Ak má cieľový workflow viacero vstupných polí, použite `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

Hodnota `key` sa musí zhodovať s kľúčmi `inputFields` uzla [Input](./input-node.md) cieľového workflow.

## Súvisiace

- [Canvas Features](../reference/canvas-features.md) – Extract to Sub-Workflow na vytvorenie uzlov Execute z vybraných uzlov
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Input Node](./input-node.md) – Vstupné polia cieľového workflow
- [Set Node](./set-node.md) – Transformácia údajov (nie volanie workflow)
