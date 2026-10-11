# Proměnná

Uzel **Proměnná** nastavuje nebo aktualizuje proměnnou přístupnou z libovolného uzlu prostřednictvím `$vars.variableName` (lokální pro workflow) nebo `$global.variableName` (trvalá). Použijte jej pro počítadla, akumulované seznamy a sdílený stav v rámci celého workflow.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.value`, nebo přístup prostřednictvím `$vars.variableName` / `$global.variableName` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `variableName` | string | Název proměnné (používá se jako `$vars.variableName` nebo `$global.variableName`). Vyhněte se [rezervovaným názvům](../reference/expression-dsl.md). |
| `variableValue` | expression | Hodnota, která má být nastavena. Podporuje výrazy. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Převod typu (výchozí: auto) |
| `isGlobal` | boolean | Pokud je `true`, uloží se do [Global Variable Store](../reference/global-variables.md) (trvalé, vázané na uživatele). Pokud je `false` nebo vynecháno, je proměnná lokální pro workflow (v paměti). |

## Proměnné typu pole

Inicializujte pole pomocí `$array()` nebo `$array("a", "b")` v uzlu Proměnná před použitím `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Poté přidávejte položky (bez `$` uvnitř závorek):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritické pravidlo

**Nikdy nepoužívejte `$` uvnitř závorek metody:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – naruší výraz

## Příklad – Počítadlo

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

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Loop Node](./loop-node.md) – Shromažďování položek pomocí uzlu Proměnná v těle smyčky
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, rezervované názvy
- [Global Variables](../reference/global-variables.md) – Trvalé proměnné pomocí `isGlobal`
