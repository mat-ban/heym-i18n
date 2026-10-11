# Muutuja

**Muutuja** node määrab või uuendab muutujat, millele pääseb ligi igast node'ist kasutades `$vars.variableName` (workflow-lokaalne) või `$global.variableName` (püsiv). Kasutage seda loendurite, kogutud nimekirjade ja workflow'de vahel jagatud oleku jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.value` või ligipääs läbi `$vars.variableName` / `$global.variableName` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Node'i identifikaator (camelCase) |
| `variableName` | string | Muutuja nimi (kasutatakse kujul `$vars.variableName` või `$global.variableName`). Vältige [reserveeritud nimesid](../reference/expression-dsl.md). |
| `variableValue` | expression | Määratav väärtus. Toetab avaldisi. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tüübi teisendamine (vaikimisi: auto) |
| `isGlobal` | boolean | Kui `true`, salvestatakse [Globaalsete muutujate hoidlasse](../reference/global-variables.md) (püsiv, kasutajapõhine). Kui `false` või puudub, on workflow-lokaalne (mälus). |

## Massiivi muutujad

Massiivid tuleb enne `.add()` kasutamist initsialiseerida Muutuja node'is käsuga `$array()` või `$array("a", "b")`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Seejärel lisage üksusi (sulgudes ei tohi olla `$`):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kriitiline reegel

**Ärge kunagi kasutage `$` meetodi sulgudes:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – rikub avaldise

## Näide – Loendur

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

## Seotud

- [Node'i tüübid](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Loop Node](./loop-node.md) – Üksuste kogumine Muutuja abil loop'i kehas
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, reserveeritud nimed
- [Globaalsed muutujad](../reference/global-variables.md) – Püsivad muutujad käsuga `isGlobal`
