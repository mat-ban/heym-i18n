# Scalanie

Węzeł **Scalanie** oczekuje na wiele równoległych wejść i łączy je w jedno wyjście. Należy go użyć, gdy konieczne jest połączenie wyników z równoległych gałęzi przed kontynuowaniem.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | n (konfigurowalne) |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.merged` – obiekt z wejściami z każdej gałęzi |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `inputCount` | number | Liczba wejść, na które należy poczekać (domyślnie: 2) |

## Kiedy używać

- Należy użyć, gdy konieczne jest **połączenie** lub **scalenie** wyników z równoległych gałęzi
- **Nie** należy używać dla równoległych workflow, które kończą się osobnymi węzłami [Wyjście](./output-node.md)
- Każda gałąź wejściowa wnosi wkład do scalonego wyjścia

## Przykład

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Należy podłączyć wiele gałęzi do węzła scalania. Węzeł oczekuje na wszystkie wejścia przed wygenerowaniem wyjścia.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Wykonanie równoległe](../reference/parallel-execution.md) – Jak działają równoległe gałęzie
- [Struktura workflow](../reference/workflow-structure.md) – Krawędzie i uchwyty
