# Variabile

Il nodo **Variable** imposta o aggiorna una variabile accessibile da qualsiasi nodo tramite `$vars.variableName` (locale al workflow) o `$global.variableName` (persistente). Utilizzarlo per contatori, liste accumulate e stato condiviso all'interno del workflow.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.value`, oppure accesso tramite `$vars.variableName` / `$global.variableName` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `variableName` | string | Nome della variabile (utilizzato come `$vars.variableName` o `$global.variableName`). Evitare i [nomi riservati](../reference/expression-dsl.md). |
| `variableValue` | expression | Valore da impostare. Supporta le espressioni. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Conversione di tipo (predefinito: auto) |
| `isGlobal` | boolean | Se `true`, memorizza nel [Global Variable Store](../reference/global-variables.md) (persistente, con ambito utente). Se `false` o omesso, locale al workflow (in memoria). |

## Variabili di tipo array

Inizializzare gli array con `$array()` o `$array("a", "b")` in un nodo Variable prima di utilizzare `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Successivamente aggiungere elementi (senza `$` all'interno delle parentesi):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Regola fondamentale

**Non utilizzare mai `$` all'interno delle parentesi dei metodi:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – compromette l'espressione

## Esempio – Contatore

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Nodo Loop](./loop-node.md) – Raccogliere elementi con Variable nel corpo del loop
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, nomi riservati
- [Variabili globali](../reference/global-variables.md) – Variabili persistenti con `isGlobal`