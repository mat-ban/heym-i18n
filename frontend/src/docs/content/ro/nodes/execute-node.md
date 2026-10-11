# Execute

Nodul **Execute** apelează un alt workflow (sub-workflow) și transmite date de intrare către acesta. Utilizați-l pentru logică reutilizabilă, nu pentru transformarea datelor—folosiți [Set](./set-node.md) pentru aceasta.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `executeWorkflowId` | UUID | ID-ul workflow-ului de executat |
| `executeInput` | expression | O singură intrare (pentru workflow-uri cu un singur câmp de intrare) |
| `executeInputMappings` | array | `{ key, value }` pentru multiple intrări. `key` = numele câmpului de intrare al workflow-ului țintă. |
| `executeDoNotWait` | boolean | Când este `true`, trimite sub-workflow-ul în fundal fără a aștepta. Ieșire: `{ "status": "dispatched", "workflow_id": "..." }`. Implicit: `false`. |

## Formatul răspunsului

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

## Fără așteptare

Când `executeDoNotWait: true`, nodul trimite sub-workflow-ul către un thread de fundal și returnează imediat:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Workflow-ul părinte continuă către următorul nod fără a aștepta. Înregistrarea execuției sub-workflow-ului este scrisă în trace în mod asincron la finalizare. Utilizați această opțiune atunci când rezultatul sub-workflow-ului nu este necesar în aval.

## O singură intrare

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

## Multiple intrări

Când workflow-ul țintă are multiple câmpuri de intrare, utilizați `executeInputMappings`:
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

`key` trebuie să corespundă cheilor `inputFields` ale nodului [Input](./input-node.md) al workflow-ului țintă.

## Resurse conexe

- [Funcționalități Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow pentru a crea noduri Execute din nodurile selectate
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Input](./input-node.md) – Câmpurile de intrare ale workflow-ului țintă
- [Nodul Set](./set-node.md) – Transformarea datelor (nu apeluri de workflow)
