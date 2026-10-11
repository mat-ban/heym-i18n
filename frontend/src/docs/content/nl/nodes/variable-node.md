# Variabele

De **Variabele**-node stelt een variabele in of werkt deze bij. Deze is toegankelijk vanuit elke node via `$vars.variableName` (workflow-lokaal) of `$global.variableName` (persistent). Gebruik deze voor tellers, verzamelde lijsten en gedeelde status binnen de workflow.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.value`, of toegang via `$vars.variableName` / `$global.variableName` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `variableName` | string | Variabelenaam (gebruikt als `$vars.variableName` of `$global.variableName`). Vermijd [gereserveerde namen](../reference/expression-dsl.md). |
| `variableValue` | expression | Waarde om in te stellen. Ondersteunt expressies. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Type-coercitie (standaard: auto) |
| `isGlobal` | boolean | Wanneer `true`, opslaan in [Global Variable Store](../reference/global-variables.md) (persistent, gebruikersgebonden). Wanneer `false` of weggelaten, workflow-lokaal (in-memory). |

## Array-variabelen

Initialiseer arrays met `$array()` of `$array("a", "b")` in een Variabele-node voordat u `.add()` gebruikt:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Voeg vervolgens items toe (geen `$` binnen de haakjes):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritieke regel

**Gebruik nooit `$` binnen methode-haakjes:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – breekt de expressie

## Voorbeeld – Teller

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

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Loop Node](./loop-node.md) – Verzamel items met Variabele in de loop-body
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, gereserveerde namen
- [Global Variables](../reference/global-variables.md) – Persistente variabelen met `isGlobal`
