# Variable

El node **Variable** estableix o actualitza una variable accessible des de qualsevol node mitjançant `$vars.variableName` (local del workflow) o `$global.variableName` (persistent). Utilitzeu-lo per a comptadors, llistes acumulades i estat compartit al llarg del workflow.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.value`, o accés mitjançant `$vars.variableName` / `$global.variableName` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `variableName` | string | Nom de la variable (utilitzat com a `$vars.variableName` o `$global.variableName`). Eviteu els [noms reservats](../reference/expression-dsl.md). |
| `variableValue` | expression | Valor a establir. Admet expressions. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Coerció de tipus (per defecte: auto) |
| `isGlobal` | boolean | Quan és `true`, s'emmagatzema a [Global Variable Store](../reference/global-variables.md) (persistent, amb abast d'usuari). Quan és `false` o s'omet, és local del workflow (en memòria). |

## Variables de tipus array

Inicialitzeu arrays amb `$array()` o `$array("a", "b")` en un node Variable abans d'utilitzar `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

A continuació, afegiu elements (sense `$` dins dels parèntesis):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Regla crítica

**No utilitzeu mai `$` dins dels parèntesis d'un mètode:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – trenca l'expressió

## Exemple – Comptador

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

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Loop Node](./loop-node.md) – Recolliu elements amb Variable dins del cos del bucle
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, noms reservats
- [Global Variables](../reference/global-variables.md) – Variables persistents amb `isGlobal`