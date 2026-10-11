# Execute

Il nodo **Execute** richiama un altro workflow (sub-workflow) e vi trasmette l'input. Utilizzarlo per logica riutilizzabile, non per la trasformazione dei dati—a tale scopo utilizzare [Set](./set-node.md).

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `executeWorkflowId` | UUID | ID del workflow da eseguire |
| `executeInput` | expression | Input singolo (per workflow con un solo campo di input) |
| `executeInputMappings` | array | `{ key, value }` per input multipli. `key` = nome del campo di input del workflow di destinazione. |
| `executeDoNotWait` | boolean | Quando `true`, invia il sub-workflow in background senza attendere. Output: `{ "status": "dispatched", "workflow_id": "..." }`. Predefinito: `false`. |

## Formato della risposta

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

## Do Not Wait

Quando `executeDoNotWait: true`, il nodo invia il sub-workflow a un thread in background e restituisce immediatamente:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Il workflow padre prosegue verso il nodo successivo senza attendere. Il record di esecuzione del sub-workflow viene scritto nella traccia in modo asincrono al termine. Utilizzare questa opzione quando il risultato del sub-workflow non è necessario nelle fasi successive.

## Input singolo

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

## Input multipli

Quando il workflow di destinazione presenta più campi di input, utilizzare `executeInputMappings`:
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

La `key` deve corrispondere alle chiavi `inputFields` del nodo [Input](./input-node.md) del workflow di destinazione.

## Correlati

- [Funzionalità del Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow per creare nodi Execute dai nodi selezionati
- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Nodo Input](./input-node.md) – Campi di input del workflow di destinazione
- [Nodo Set](./set-node.md) – Trasformazione dei dati (non chiamate a workflow)