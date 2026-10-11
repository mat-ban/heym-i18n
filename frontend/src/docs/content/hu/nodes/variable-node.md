# Változó

A **Változó** csomópont egy olyan változót hoz létre vagy frissít, amely bármely csomópontból elérhető a `$vars.variableName` (workflow-lokális) vagy a `$global.variableName` (perzisztens) segítségével. Használja számlálókhoz, halmozott listákhoz és a workflow-n belül megosztott állapotokhoz.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.value`, vagy elérés a `$vars.variableName` / `$global.variableName` segítségével |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `variableName` | string | Változónév (a `$vars.variableName` vagy `$global.variableName` formában használatos). Kerülje a [fenntartott neveket](../reference/expression-dsl.md). |
| `variableValue` | expression | A beállítandó érték. Támogatja a kifejezéseket. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Típuskényszerítés (alapértelmezett: auto) |
| `isGlobal` | boolean | Ha `true`, a [Globális Változótárban](../reference/global-variables.md) tárolja (perzisztens, felhasználóhoz kötött). Ha `false` vagy nincs megadva, workflow-lokális (memóriabeli). |

## Tömbváltozók

A tömböket a `$array()` vagy `$array("a", "b")` segítségével inicializálja egy Változó csomópontban, mielőtt a `.add()` metódust használná:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Ezután adja hozzá az elemeket (a zárójeleken belül ne használjon `$` jelet):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritikus szabály

**Soha ne használja a `$` jelet a metódusok zárójelein belül:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – megtöri a kifejezést

## Példa – Számláló

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

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Loop csomópont](./loop-node.md) – Elemek gyűjtése Változóval a loop törzsében
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, fenntartott nevek
- [Globális változók](../reference/global-variables.md) – Perzisztens változók az `isGlobal` segítségével
