# Pętla

Węzeł **Pętla** iteruje po tablicy, wykonując węzły następne dla każdego elementu. Wymaga połączenia zwrotnego z ostatniego węzła w ciele iteracji, aby przejść do kolejnego kroku.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 2 (domyślne + powrót pętli) |
| Wyjścia | 2 (pętla, zakończono) |
| Wyjście | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `arrayExpression` | expression | Wyrażenie, które zwraca tablicę (np. `$input.items`) |

## Uchwyty krawędzi

- **Źródło `loop`** – Łączy się z węzłami przetwarzającymi każdy element (uruchamiane w każdej iteracji)
- **Źródło `done`** – Łączy się z węzłami uruchamianymi po zakończeniu wszystkich iteracji
- **Cel domyślny** – Odbiera dane początkowe zawierające tablicę
- **Cel `loop`** – Odbiera połączenie zwrotne z ostatniego węzła ciała iteracji

## Kontekst pętli (w ciele iteracji)

- `$loopNode.item` – Bieżący element
- `$loopNode.index` – Indeks liczony od 0
- `$loopNode.total` – Łączna liczba elementów
- `$loopNode.isFirst` – Wartość logiczna
- `$loopNode.isLast` – Wartość logiczna

## Kluczowe zasady

1. **Wymagane połączenie zwrotne:** Ostatni węzeł w ciele iteracji MUSI łączyć się z powrotem z uchwytem wejściowym `loop` pętli.
2. **Brak wyjścia w ciele pętli:** Węzły [Wyjście](./output-node.md) są zabronione wewnątrz ciała pętli. Należy użyć [Set](./set-node.md) lub [Zmienna](./variable-node.md) dla wyników pośrednich.
3. **Brak automatycznego gromadzenia wyników:** Pętla nie zbiera wyników. Należy użyć węzłów Zmienna z `$array()` i `.add()`, aby je gromadzić.

## Przykład

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Przepływ: pętla → węzeł przetwarzający → (powrót do pętli) → pętla → gałąź zakończenia → wyjście.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Zmienna](./variable-node.md) – Gromadzenie elementów w pętli
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metody tablicowe
