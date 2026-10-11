# Varijabla

**Varijabla** čvor postavlja ili ažurira varijablu koja je dostupna iz bilo kojeg čvora putem `$vars.variableName` (lokalna za workflow) ili `$global.variableName` (perzistentna). Koristite je za brojače, akumulirane popise i dijeljeno stanje unutar workflow-a.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.value`, ili pristup putem `$vars.variableName` / `$global.variableName` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `variableName` | string | Ime varijable (koristi se kao `$vars.variableName` ili `$global.variableName`). Izbjegavajte [rezervirana imena](../reference/expression-dsl.md). |
| `variableValue` | izraz | Vrijednost za postavljanje. Podržava izraze. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Tip konverzije (zadano: auto) |
| `isGlobal` | boolean | Kada je `true`, pohranjuje se u [Global Variable Store](../reference/global-variables.md) (perzistentno, korisnički opseg). Kada je `false` ili izostavljeno, lokalno za workflow (u memoriji). |

## Varijable Nizova

Inicijalizirajte nizove s `$array()` ili `$array("a", "b")` u Varijabla čvoru prije korištenja `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Zatim dodajte stavke (bez `$` unutar zagrada):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Kritično Pravilo

**Nikada ne koristite `$` unutar zagrada metode:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – prekida izraz

## Primjer – Brojač

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

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Loop Node](./loop-node.md) – Prikupite stavke s Varijablom u tijelu petlje
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, rezervirana imena
- [Global Variables](../reference/global-variables.md) – Perzistentne varijable s `isGlobal`
