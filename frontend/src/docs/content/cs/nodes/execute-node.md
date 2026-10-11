# Execute

Uzel **Execute** volá jiný workflow (sub-workflow) a předává mu vstup. Použijte jej pro znovupoužitelnou logiku, nikoli pro transformaci dat – k tomu slouží uzel [Set](./set-node.md).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `executeWorkflowId` | UUID | ID workflow, který má být spuštěn |
| `executeInput` | expression | Jediný vstup (pro workflow s jedním vstupním polem) |
| `executeInputMappings` | array | `{ key, value }` pro více vstupů. `key` = název vstupního pole cílového workflow. |
| `executeDoNotWait` | boolean | Pokud je `true`, odešle sub-workflow na pozadí bez čekání. Výstup: `{ "status": "dispatched", "workflow_id": "..." }`. Výchozí hodnota: `false`. |

## Formát odpovědi

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

## Bez čekání

Pokud je `executeDoNotWait: true`, uzel odešle sub-workflow do vlákna na pozadí a okamžitě vrátí:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Nadřazený workflow pokračuje k dalšímu uzlu bez čekání. Záznam o spuštění sub-workflow je do trace zapsán asynchronně po jeho dokončení. Tuto možnost použijte, pokud výsledek sub-workflow není potřeba pro navazující kroky.

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

## Více vstupů

Pokud má cílový workflow více vstupních polí, použijte `executeInputMappings`:
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

Hodnota `key` musí odpovídat klíčům `inputFields` uzlu [Input](./input-node.md) cílového workflow.

## Související

- [Funkce Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow pro vytvoření uzlů Execute z vybraných uzlů
- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Uzel Input](./input-node.md) – Vstupní pole cílového workflow
- [Uzel Set](./set-node.md) – Transformace dat (nikoli volání workflow)
