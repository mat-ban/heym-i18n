# Wait

Węzeł **Wait** wstrzymuje wykonanie workflow na określony czas. Należy go używać do ograniczania liczby żądań (rate limiting), opóźniania działań lub ustalania interwałów odpytywania (polling).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | Przekazuje dane wejściowe dalej |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `duration` | number | Opóźnienie w milisekundach (np. 1000 = 1 sekunda). Edytor akceptuje wartości od 1 do 900000 (15 minut) |

## Przykład

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Loop](./loop-node.md) – Stosowanie węzła Wait wewnątrz pętli w celu ograniczania liczby żądań
