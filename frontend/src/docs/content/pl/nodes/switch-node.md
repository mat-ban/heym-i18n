# Switch

Węzeł **Switch** kieruje wykonanie do różnych ścieżek na podstawie dopasowania wartości do przypadków. Obsługuje N przypadków oraz gałąź domyślną.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | n (po jednym na każdy przypadek + domyślne) |
| Wyjście | Przekazuje dane wejściowe do dopasowanej gałęzi |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `expression` | expression | Wartość do ewaluacji (np. `$input.category`) |
| `cases` | string[] | Wartości przypadków do dopasowania (np. `["case1", "case2", "case3"]`) |

## Uchwyty krawędzi

- Każdy przypadek otrzymuje uchwyt źródłowy (indeks 0, 1, 2, …)
- Uchwyt domyślny dla wartości niedopasowanych

## Przykład

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Należy połączyć krawędzie z `sourceHandle` ustawionym na indeks przypadku (0, 1, 2) lub na uchwyt domyślny dla wartości niedopasowanych.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Condition](./condition-node.md) – Rozgałęzianie if/else
- [Expression DSL](../reference/expression-dsl.md) – Składnia wyrażeń
