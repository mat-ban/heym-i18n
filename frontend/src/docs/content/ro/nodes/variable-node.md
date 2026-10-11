# Variabilă

Nodul **Variabilă** setează sau actualizează o variabilă accesibilă din orice nod prin `$vars.variableName` (locală workflow-ului) sau `$global.variableName` (persistentă). Utilizați-l pentru contoare, liste acumulate și stare partajată în cadrul workflow-ului.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.value`, sau acces prin `$vars.variableName` / `$global.variableName` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `variableName` | string | Numele variabilei (folosit ca `$vars.variableName` sau `$global.variableName`). Evitați [numele rezervate](../reference/expression-dsl.md). |
| `variableValue` | expression | Valoarea de setat. Acceptă expresii. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Coercizie de tip (implicit: auto) |
| `isGlobal` | boolean | Când este `true`, se stochează în [Global Variable Store](../reference/global-variables.md) (persistentă, la nivel de utilizator). Când este `false` sau omisă, este locală workflow-ului (în memorie). |

## Variabile de tip array

Inițializați array-urile cu `$array()` sau `$array("a", "b")` într-un nod Variabilă înainte de a utiliza `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Apoi adăugați elemente (fără `$` în interiorul parantezelor):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Regulă critică

**Nu utilizați niciodată `$` în interiorul parantezelor metodelor:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – întrerupe expresia

## Exemplu – Contor

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

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Loop](./loop-node.md) – Colectați elemente cu Variabilă în corpul buclei
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, nume rezervate
- [Variabile globale](../reference/global-variables.md) – Variabile persistente cu `isGlobal`
