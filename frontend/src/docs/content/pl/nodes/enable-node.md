# Węzeł Enable Node

Węzeł **Enable Node** włącza ponownie inny węzeł. Po wykonaniu ustawia pole `active` węzła docelowego na `true` i utrwala tę zmianę. Stanowi odpowiednik węzła [Disable Node](./disable-node.md): służy do ponownego uzbrojenia triggera [Cron](./cron-node.md) lub dowolnego węzła, który został wyłączony.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `targetNodeLabel` | string | Etykieta węzła do włączenia (np. `hourlyCheck`) |

## Zachowanie

- Węzeł docelowy zostaje zapisany jako aktywny, więc kolejne uruchomienia i triggery będą go uwzględniać. Ponownie włączony trigger Cron uruchomi się zgodnie z następnym zaplanowanym czasem.
- Jeśli węzeł docelowy znajduje się poniżej węzła Enable Node i nie został jeszcze uruchomiony, zostanie również wykonany w bieżącym wykonaniu.
- Włączenie węzła, który jest już aktywny, nie powoduje żadnych zmian; wyjście nadal zwraca `enabled: true`.
- Węzeł kończy się błędem, gdy `targetNodeLabel` jest pusty lub żaden węzeł nie ma takiej etykiety.

## Przypadek użycia

Uruchomienie triggera [Cron](./cron-node.md) na żądanie. Należy zapisać węzeł Cron jako wyłączony i nadać workflow drugi punkt wejścia, taki jak trigger [Input](./input-node.md). Żądanie skierowane do tego punktu wejścia uruchamia węzeł Enable Node, a Cron zaczyna działać.

Wyłączony trigger nigdy nie rozpoczyna wykonania samodzielnie, dlatego węzeł Enable Node musi znajdować się za punktem wejścia, który może zostać uruchomiony.

## Przykład

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Przepływ: Input → Enable Node (cel: cron) → Output. Węzeł Cron `hourlyCheck` jest zapisany jako wyłączony w tym samym workflow i uruchamia własną gałąź sprawdzenia HTTP po włączeniu.

## Powiązane

- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Disable Node](./disable-node.md) – Wyłączenie węzła z poziomu workflow
- [Cron Node](./cron-node.md) – Trigger do włączenia
- [Condition Node](./condition-node.md) – Rozgałęzienie przed włączeniem
- [Canvas Features](../reference/canvas-features.md) – Ręczne włączanie lub wyłączanie węzła
