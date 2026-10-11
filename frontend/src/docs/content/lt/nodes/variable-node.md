# Kintamasis

**Kintamojo** mazgas nustato arba atnaujina kintamąjį, prieinamą iš bet kurio mazgo per `$vars.variableName` (workflow-lokalus) arba `$global.variableName` (nuolatinis). Naudokite jį skaičiavimo, sukauptų sąrašų ir bendros būsenos valdymui visame workflow.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.value`, arba prieiga per `$vars.variableName` / `$global.variableName` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `variableName` | string | Kintamojo pavadinimas (naudojamas kaip `$vars.variableName` arba `$global.variableName`). Venkite [rezervuotų pavadinimų](../reference/expression-dsl.md). |
| `variableValue` | expression | Nustatoma vertė. Palaiko išraiškas. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tipo konvertavimas (numatytasis: auto) |
| `isGlobal` | boolean | Kai `true`, saugoma [Global Variable Store](../reference/global-variables.md) (nuolatinis, vartotojo apimties). Kai `false` arba praleista, workflow-lokalus (atmintyje). |

## Masyvų Kintamieji

Inicijuokite masyvus su `$array()` arba `$array("a", "b")` Kintamojo mazge prieš naudojant `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Tada pridėkite elementus (be `$` viduje skliaustų):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritinė Taisyklė

**Niekada nenaudokite `$` viduje metodo skliaustų:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – sugadina išraišką

## Pavyzdys – Skaitiklis

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

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Ciklo Mazgas](./loop-node.md) – Rinkti elementus su Kintamuoju ciklo kūne
- [Išraiškų DSL](../reference/expression-dsl.md) – `$vars`, `$global`, rezervuoti pavadinimai
- [Globalūs Kintamieji](../reference/global-variables.md) – Nuolatiniai kintamieji su `isGlobal`
