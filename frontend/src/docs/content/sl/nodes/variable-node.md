# Spremenljivka

**Spremenljivka** vozlišče nastavi ali posodobi spremenljivko, dostopno iz kateregakoli vozlišča preko `$vars.variableName` (lokalno za workflow) ali `$global.variableName` (trajna). Uporabite jo za števce, akumulirane sezname in skupno stanje v okviru workflow.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.value`, ali dostop preko `$vars.variableName` / `$global.variableName` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `variableName` | niz | Ime spremenljivke (uporablja se kot `$vars.variableName` ali `$global.variableName`). Izogibajte se [rezerviranim imenom](../reference/expression-dsl.md). |
| `variableValue` | izraz | Vrednost, ki jo je treba nastaviti. Podpira izraze. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tip konverzije (privzeto: auto) |
| `isGlobal` | boolean | Ko je `true`, shranite v [Global Variable Store](../reference/global-variables.md) (trajna, uporabniško omejena). Ko je `false` ali izpuščeno, lokalno za workflow (v pomnilniku). |

## Spremenljivke seznama

Inicializirajte sezname z `$array()` ali `$array("a", "b")` v vozlišču Spremenljivka pred uporabo `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Nato dodajte elemente (brez `$` znotraj oklepajev):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritično pravilo

**Nikoli ne uporabljajte `$` znotraj oklepajev metod:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – prekine izraz

## Primer – Števec

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Cikli vozlišča](./loop-node.md) – Zbiranje elementov s spremenljivko v telesu cikla
- [Izrazni DSL](../reference/expression-dsl.md) – `$vars`, `$global`, rezervirana imena
- [Globalne spremenljivke](../reference/global-variables.md) – Trajne spremenljivke z `isGlobal`
