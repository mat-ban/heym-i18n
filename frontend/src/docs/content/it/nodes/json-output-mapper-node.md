# JSON output mapper

Il nodo **JSON output mapper** costruisce un oggetto JSON a partire da [mappature](./set-node.md) chiave/valore (stesso modello del nodo [Set](./set-node.md)). Lo si utilizzi quando i chiamanti devono ricevere un **corpo JSON semplice** alla radice della risposta.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 0 (sink) |
| Output a runtime | Oggetto costruito a partire da `mappings` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `mappings` | array | Voci `{ "key": "fieldName", "value": "expression" }` (come nel nodo Set) |

## Utilizzo come strumento dell'Agent

Non supportato. Questo nodo è un sink terminale, pertanto non può essere collegato a un handle degli strumenti del [Nodo Agent](./agent-node.md). Si utilizzi un nodo [Set](./set-node.md) quando un agent deve modellare valori durante la conversazione.

## Comportamento con Webhook ed esecuzione

Quando questo nodo è l'**unico** output terminale del workflow, gli **output** dell'esecuzione sono l'oggetto mappato stesso: le chiavi di `mappings` compaiono al **livello superiore** del JSON. **Non** è presente alcun wrapper esterno con chiave corrispondente alla label del nodo e **nessun** oggetto `{ "result": ... }` (a differenza del nodo [Output](./output-node.md)).

Se più nodi terminali producono output (ad esempio [Output](./output-node.md) più JSON output mapper, oppure più rami), Heym utilizza la struttura normale: ciascun terminale è identificato dalla propria `label`.

## Restrizione sui loop

Stessa regola del nodo [Output](./output-node.md): non collocare questo nodo all'interno di un ramo di iterazione del loop—solo dopo il ramo `done` del loop. Si veda [Loop](./loop-node.md).

## Esempio

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Correlati

- [Set](./set-node.md) – Stessa meccanica di mappatura per trasformazioni intermedie
- [Output](./output-node.md) – Risposta basata su messaggio o schema con wrapping `result`
- [Node Types](../reference/node-types.md) – Tutti i tipi di nodo
- [Workflow Structure](../reference/workflow-structure.md) – Formato JSON del workflow
- [Webhooks](../reference/webhooks.md) – Endpoint di esecuzione e risposte