# Set

Il nodo **Set** trasforma e mappa i dati di input in un output personalizzato. Utilizzarlo per maiuscole, sottostringhe, concatenazioni, numeri casuali e qualsiasi trasformazione di dati—non per richiamare Workflow (a tale scopo, utilizzare [Execute](./execute-node.md)).

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.keyName` per ciascuna chiave di mapping |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `mappings` | array | Coppie chiave-valore. Ciascuna: `{ key, value }` dove `value` è un'[espressione](../reference/expression-dsl.md) |

## Utilizzo come strumento dell'agente

Quando un nodo Set è connesso a un [Nodo Agent](./agent-node.md) come strumento del canvas, ciascun valore di mapping può essere contrassegnato come **fornito dall'agente** tramite l'icona del bot. I valori di mapping contrassegnati diventano parametri dello strumento che l'agente compila a runtime. I mapping non contrassegnati rimangono fissi nella configurazione del nodo.

L'icona del bot compare solo quando il nodo Set è connesso all'handle degli strumenti di un agente. Un nodo Set autonomo non mostra i controlli per i valori forniti dall'agente.

## Regole delle espressioni

- Fare riferimento ai nodi precedenti: `$nodeName.text`, `$nodeName.body.field`
- Utilizzare le funzioni: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` esclude `b`; restituisce un errore se `a > b`.
- Un solo `$` all'inizio dell'espressione—mai all'interno delle parentesi
- Accedere all'output tramite chiave: `$setNode.randomNumber`, `$setNode.text`

## Esempio

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

I nodi a valle accedono tramite `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Correlati

- [JSON output mapper](./json-output-mapper-node.md) – Stessi mapping; l'unico terminale restituisce il JSON radice per Webhook/esecuzioni
- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Execute Node](./execute-node.md) – Richiama Workflow (non trasformazione di dati)
- [Expression DSL](../reference/expression-dsl.md) – Funzioni e sintassi
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor espandibile con anteprima live del backend e Prev/Next per i mapping