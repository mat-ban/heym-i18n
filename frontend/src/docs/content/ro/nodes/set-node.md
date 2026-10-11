# Set

Nodul **Set** transformă și mapează datele de intrare către o ieșire personalizată. Utilizați-l pentru majuscule, substring, concatenare, numere aleatorii și orice transformare de date—nu pentru apelarea workflow-urilor (folosiți [Execute](./execute-node.md) pentru aceasta).

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.keyName` pentru fiecare cheie de mapare |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `mappings` | array | Perechi cheie-valoare. Fiecare: `{ key, value }` unde `value` este o [expresie](../reference/expression-dsl.md) |

## Utilizarea ca instrument pentru agent

Atunci când un nod Set este conectat la un [Nod Agent](./agent-node.md) ca instrument de tip canvas, fiecare valoare de mapare poate fi marcată ca **furnizată de agent** cu ajutorul pictogramei bot. Valorile de mapare marcate devin parametri ai instrumentului pe care agentul îi completează la runtime. Mapările nemarcate rămân fixe în configurația nodului.

Pictograma bot apare doar atunci când nodul Set este conectat la mânerul de instrumente al unui agent. Un nod Set independent nu afișează controale pentru valorile furnizate de agent.

## Reguli pentru expresii

- Referiți nodurile anterioare: `$nodeName.text`, `$nodeName.body.field`
- Utilizați funcții: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` exclude b; dacă `a > b` returnează o eroare.
- Un singur `$` la începutul expresiei—niciodată în interiorul parantezelor
- Accesați ieșirea prin cheie: `$setNode.randomNumber`, `$setNode.text`

## Exemplu

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

Nodurile din aval accesează prin `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Resurse conexe

- [Mapator de ieșire JSON](./json-output-mapper-node.md) – Aceleași mapări; singurul terminal returnează JSON rădăcină pentru webhook-uri/execuții
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nod Execute](./execute-node.md) – Apelarea workflow-urilor (nu transformarea datelor)
- [Expression DSL](../reference/expression-dsl.md) – Funcții și sintaxă
- [Dialogul de evaluare a expresiilor](../reference/expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live în backend și Prev/Next pentru mapări
