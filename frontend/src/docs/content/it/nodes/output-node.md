# Output

Il nodo **Output** è l'endpoint del workflow che restituisce la risposta al chiamante. Fare sempre riferimento al nodo precedente tramite label—non usare mai `$input`.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 (opzionale, per post-elaborazione asincrona) |
| Output | Restituisce `message` al chiamante |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `message` | expression | Valore di output. **Deve** fare riferimento al nodo precedente: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Se true, i nodi successivi all'output vengono eseguiti in modo asincrono dopo l'invio della risposta |

## Utilizzo come strumento dell'agente

Quando un nodo Output è connesso a un [Nodo Agent](./agent-node.md) come strumento del canvas, il campo `message` può essere contrassegnato come **fornito dall'agente** tramite l'icona del bot. L'agente fornisce quindi il messaggio nel momento in cui richiama lo strumento. Se il nodo Output non è connesso come strumento dell'agente, l'icona del bot è nascosta.

## Regola fondamentale

**Non usare mai `$input` nel nodo di output.** Fare sempre riferimento alla label del nodo precedente:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (dove `processData` è la label del nodo precedente)

## Post-elaborazione asincrona

Quando `allowDownstream: true`, la risposta viene restituita immediatamente. I nodi connessi dopo l'output vengono eseguiti in background (ad esempio notifiche Slack, logging). Poiché la coda downstream può terminare in un momento successivo, un errore downstream può modificare lo stato di esecuzione registrato in `error` dopo che la risposta anticipata è già stata restituita; la cronologia e le analisi finali riflettono tale esito successivo.

## Esempio

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Esempio – Con asincronia

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Collegare quindi un nodo [Telegram](./telegram-node.md), [Slack](./slack-node.md) o altro nodo dopo l'output per notifiche fire-and-forget.

## Correlati

- [JSON output mapper](./json-output-mapper-node.md) – Corpo JSON root senza wrapping `result` quando è l'unico terminale
- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Expression DSL](../reference/expression-dsl.md) – Riferimento all'output di un nodo
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor espandibile con anteprima live del backend per message
- [Workflow Structure](../reference/workflow-structure.md) – Formato JSON