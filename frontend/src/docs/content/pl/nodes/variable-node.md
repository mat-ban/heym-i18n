# Zmienna

Węzeł **Zmienna** ustawia lub aktualizuje zmienną dostępną z dowolnego węzła poprzez `$vars.variableName` (lokalna dla workflow) lub `$global.variableName` (trwała). Należy go używać do liczników, akumulowanych list oraz współdzielonego stanu w obrębie workflow.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.value` lub dostęp poprzez `$vars.variableName` / `$global.variableName` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `variableName` | string | Nazwa zmiennej (używana jako `$vars.variableName` lub `$global.variableName`). Należy unikać [nazw zarezerwowanych](../reference/expression-dsl.md). |
| `variableValue` | expression | Wartość do ustawienia. Obsługuje wyrażenia. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Wymuszenie typu (domyślnie: auto) |
| `isGlobal` | boolean | Gdy `true`, zapis w [Globalnym magazynie zmiennych](../reference/global-variables.md) (trwały, przypisany do użytkownika). Gdy `false` lub pominięty, lokalny dla workflow (w pamięci). |

## Zmienne tablicowe

Tablice należy inicjalizować za pomocą `$array()` lub `$array("a", "b")` w węźle Zmienna przed użyciem `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Następnie należy dodawać elementy (bez `$` wewnątrz nawiasów):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Zasada krytyczna

**Nigdy nie należy używać `$` wewnątrz nawiasów metod:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – psuje wyrażenie

## Przykład – Licznik

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

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł pętli](./loop-node.md) – Zbieranie elementów za pomocą Zmiennej w ciele pętli
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, nazwy zarezerwowane
- [Zmienne globalne](../reference/global-variables.md) – Zmienne trwałe z `isGlobal`
