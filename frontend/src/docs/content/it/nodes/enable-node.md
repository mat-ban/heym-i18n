# Nodo Enable

Il nodo **Enable Node** riattiva un altro nodo. Quando viene eseguito, imposta il campo `active` del nodo di destinazione su `true` e ne persiste la modifica. È la controparte di [Disable Node](./disable-node.md): lo si utilizza per riattivare un trigger [Cron](./cron-node.md) o qualsiasi nodo che sia stato disattivato.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `targetNodeLabel` | string | Label del nodo da attivare (es. `hourlyCheck`) |

## Comportamento

- La destinazione viene salvata come attiva, pertanto le esecuzioni e i trigger successivi la considereranno tale. Un trigger Cron riattivato si attiva nuovamente alla successiva esecuzione pianificata.
- Se la destinazione si trova a valle del Nodo Enable e non è ancora stata eseguita, viene eseguita anch'essa nell'esecuzione corrente.
- L'attivazione di un nodo già attivo non produce alcuna modifica; l'output riporta comunque `enabled: true`.
- Il nodo restituisce un errore quando `targetNodeLabel` è vuoto o nessun nodo possiede quella label.

## Caso d'uso

Avviare un trigger [Cron](./cron-node.md) su richiesta. Salvare il nodo Cron in stato disattivato e assegnare al workflow un secondo punto di ingresso, ad esempio un trigger [Input](./input-node.md). Una richiesta a tale punto di ingresso esegue il Nodo Enable e il Cron inizia ad attivarsi.

Un trigger disattivato non avvia mai un'esecuzione da solo, pertanto il Nodo Enable deve trovarsi a valle di un punto di ingresso in grado di essere eseguito.

## Esempio

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flusso: Input → Enable Node (destinazione: cron) → Output. Il nodo Cron `hourlyCheck` è salvato come disattivato nello stesso workflow ed esegue il proprio ramo di verifica HTTP una volta attivato.

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Disable Node](./disable-node.md) – Disattivare un nodo dall'interno di un workflow
- [Cron Node](./cron-node.md) – Trigger da attivare
- [Condition Node](./condition-node.md) – Diramazione prima dell'attivazione
- [Canvas Features](../reference/canvas-features.md) – Attivare o disattivare manualmente un nodo