# Execute

**Execute** node kutsub välja teise workflow (alam-workflow) ja edastab sellele sisendi. Kasutage seda korduvkasutatava loogika jaoks, mitte andmete teisendamiseks—selleks kasutage [Set](./set-node.md).

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `executeWorkflowId` | UUID | Käivitatava workflow ID |
| `executeInput` | expression | Üksiksisend (workflow'dele, millel on üks sisendväli) |
| `executeInputMappings` | array | `{ key, value }` mitme sisendi jaoks. `key` = sihtworkflow' sisendvälja nimi. |
| `executeDoNotWait` | boolean | Kui `true`, saadetakse alam-workflow taustal käivitamiseks ilma ootamata. Väljund: `{ "status": "dispatched", "workflow_id": "..." }`. Vaikeväärtus: `false`. |

## Vastuse formaat

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

## Mitte ootamine

Kui `executeDoNotWait: true`, saadab node alam-workflow taustalõimele ja tagastab kohe:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Ülem-workflow jätkab järgmise node'iga ilma ootamata. Alam-workflow käivituse kirje kirjutatakse jälgimisse asünkroonselt selle lõppemisel. Kasutage seda siis, kui alam-workflow tulemust ei ole allavoolu vaja.

## Üksiksisend

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

## Mitmiksisendid

Kui sihtworkflow'l on mitu sisendvälja, kasutage `executeInputMappings`:
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

`key` peab vastama sihtworkflow' [Input](./input-node.md) `inputFields` võtmetele.

## Seotud

- [Lõuendi funktsioonid](../reference/canvas-features.md) – Extract to Sub-Workflow, et luua Execute node'e valitud node'idest
- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Input node](./input-node.md) – Sihtworkflow' sisendväljad
- [Set node](./set-node.md) – Andmete teisendamine (mitte workflow'de kutsumine)
