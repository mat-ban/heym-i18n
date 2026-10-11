# Warunek

Węzeł **Warunek** rozgałęzia workflow na podstawie wyrażenia if/else. Kieruje do ścieżki true lub false w zależności od wyniku.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 2 (true, false) |
| Wyjście | Przekazuje wejście do wybranej gałęzi |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `condition` | expression | Wyrażenie w stylu JavaScript (np. `$input.text.length > 0`) |

## Uchwyty krawędzi

- **Uchwyt źródłowy `true`** – gdy warunek zostanie oceniony jako prawdziwy
- **Uchwyt źródłowy `false`** – gdy warunek zostanie oceniony jako fałszywy

## Operatory wyrażeń

Obsługiwane: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` itp. Zobacz [Expression DSL](../reference/expression-dsl.md).

## Przykład

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Połącz krawędzie z `sourceHandle: "true"` lub `sourceHandle: "false"`, aby skierować do różnych gałęzi.

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Switch](./switch-node.md) – Routing wielokierunkowy według wartości
- [Expression DSL](../reference/expression-dsl.md) – Składnia warunków
- [Okno dialogowe oceny wyrażeń](../reference/expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem backendu na żywo dla warunku
