# Wyłączanie węzła

Węzeł **Disable Node** trwale wyłącza inny węzeł w workflow. Po wykonaniu ustawia pole `active` węzła docelowego na `false` i utrwala tę zmianę. Zastosowanie: operacje jednorazowe, takie jak zatrzymanie triggera Cron po spełnieniu warunku.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `targetNodeLabel` | string | Etykieta węzła do wyłączenia (np. `hourlyCheck`) |

## Przypadek użycia

Wyłączenie triggera [Cron](./cron-node.md) po spełnieniu warunku, aby nie był już uruchamiany w kolejnych wykonaniach workflow. Ponowne włączenie jest możliwe później za pomocą węzła [Enable Node](./enable-node.md).

## Przykład

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Przepływ: Cron → sprawdzenie HTTP → Condition (status complete?) → jeśli true: Disable Node (cel: cron) → Output.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Enable Node](./enable-node.md) – Ponowne włączenie wyłączonego węzła
- [Węzeł Cron](./cron-node.md) – Trigger do wyłączenia
- [Węzeł Condition](./condition-node.md) – Rozgałęzienie przed wyłączeniem
