# Variabel

Noden **Variabel** anger eller uppdaterar en variabel som är åtkomlig från valfri nod via `$vars.variableName` (workflow-lokal) eller `$global.variableName` (beständig). Använd den för räknare, ackumulerade listor och delat tillstånd över hela workflowet.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.value`, eller åtkomst via `$vars.variableName` / `$global.variableName` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `variableName` | string | Variabelnamn (används som `$vars.variableName` eller `$global.variableName`). Undvik [reserverade namn](../reference/expression-dsl.md). |
| `variableValue` | expression | Värde att ange. Stöder uttryck. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Typkonvertering (standard: auto) |
| `isGlobal` | boolean | När `true` lagras värdet i [Global Variable Store](../reference/global-variables.md) (beständig, användarscoped). När `false` eller utelämnad är variabeln workflow-lokal (i minnet). |

## Arrayvariabler

Initiera arrayer med `$array()` eller `$array("a", "b")` i en Variabel-nod innan `.add()` används:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Lägg sedan till objekt (inget `$` inom parenteserna):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritisk regel

**Använd aldrig `$` inom metodens parenteser:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – bryter uttrycket

## Exempel – Räknare

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Loop-nod](./loop-node.md) – Samla objekt med Variabel i loopkroppen
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, reserverade namn
- [Globala variabler](../reference/global-variables.md) – Beständiga variabler med `isGlobal`
