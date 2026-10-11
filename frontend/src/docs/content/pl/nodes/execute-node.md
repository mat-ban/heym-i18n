# Execute

Węzeł **Execute** wywołuje inny workflow (pod-workflow) i przekazuje do niego dane wejściowe. Należy go używać do logiki wielokrotnego użytku, a nie do transformacji danych — do tego służy węzeł [Set](./set-node.md).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `executeWorkflowId` | UUID | ID workflow do wykonania |
| `executeInput` | expression | Pojedyncze wejście (dla workflow z jednym polem wejściowym) |
| `executeInputMappings` | array | `{ key, value }` dla wielu wejść. `key` = nazwa pola wejściowego docelowego workflow. |
| `executeDoNotWait` | boolean | Gdy `true`, pod-workflow jest uruchamiany w tle bez oczekiwania. Wyjście: `{ "status": "dispatched", "workflow_id": "..." }`. Domyślnie: `false`. |

## Format odpowiedzi

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

## Tryb bez oczekiwania

Gdy `executeDoNotWait: true`, węzeł uruchamia pod-workflow w wątku w tle i natychmiast zwraca:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Workflow nadrzędny przechodzi do następnego węzła bez oczekiwania. Rekord wykonania pod-workflow jest zapisywany w śladzie asynchronicznie po jego zakończeniu. Należy użyć tego trybu, gdy wynik pod-workflow nie jest potrzebny w dalszej części przepływu.

## Pojedyncze wejście

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

## Wiele wejść

Gdy docelowy workflow ma wiele pól wejściowych, należy użyć `executeInputMappings`:
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

Wartość `key` musi odpowiadać kluczom `inputFields` węzła [Input](./input-node.md) docelowego workflow.

## Powiązane

- [Funkcje Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow umożliwia tworzenie węzłów Execute z wybranych węzłów
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Input](./input-node.md) – Pola wejściowe docelowego workflow
- [Węzeł Set](./set-node.md) – Transformacja danych (nie wywołania workflow)
