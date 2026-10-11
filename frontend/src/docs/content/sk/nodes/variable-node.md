# Premenná

Uzol **Premenná** nastavuje alebo aktualizuje premennú prístupnú z ľubovoľného uzla prostredníctvom `$vars.variableName` (lokálna pre workflow) alebo `$global.variableName` (perzistentná). Použite ho pre počítadlá, akumulované zoznamy a zdieľaný stav v rámci celého workflowu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.value`, alebo prístup cez `$vars.variableName` / `$global.variableName` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `variableName` | string | Názov premennej (používa sa ako `$vars.variableName` alebo `$global.variableName`). Vyhnite sa [rezervovaným názvom](../reference/expression-dsl.md). |
| `variableValue` | expression | Hodnota, ktorá sa má nastaviť. Podporuje výrazy. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Konverzia typu (predvolené: auto) |
| `isGlobal` | boolean | Ak je `true`, uloží sa do [Global Variable Store](../reference/global-variables.md) (perzistentné, viazané na používateľa). Ak je `false` alebo vynechané, je lokálna pre workflow (v pamäti). |

## Pole – premenné

Inicializujte polia pomocou `$array()` alebo `$array("a", "b")` v uzle Premenná pred použitím `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Následne pridávajte položky (bez `$` v zátvorkách):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritické pravidlo

**Nikdy nepoužívajte `$` v zátvorkách metódy:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – naruší výraz

## Príklad – Počítadlo

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

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Loop Node](./loop-node.md) – Zhromažďovanie položiek pomocou uzla Premenná v tele cyklu
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, rezervované názvy
- [Global Variables](../reference/global-variables.md) – Perzistentné premenné s `isGlobal`
