# Set

Węzeł **Set** przekształca i mapuje dane wejściowe na niestandardowe dane wyjściowe. Należy go używać do zmiany wielkości liter, wyodrębniania fragmentów tekstu, konkatenacji, generowania liczb losowych oraz dowolnych transformacji danych — nie służy on do wywoływania workflow (w tym celu należy użyć węzła [Execute](./execute-node.md)).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.keyName` dla każdego klucza mapowania |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `mappings` | array | Pary klucz-wartość. Każda: `{ key, value }`, gdzie `value` jest [wyrażeniem](../reference/expression-dsl.md) |

## Użycie jako narzędzie agenta

Gdy węzeł Set jest podłączony do [Węzła agenta](./agent-node.md) jako narzędzie na canvas, każda wartość mapowania może zostać oznaczona jako **dostarczana przez agenta** za pomocą ikony bota. Oznaczone wartości mapowań stają się parametrami narzędzia, które agent wypełnia w czasie działania. Nieoznaczone mapowania pozostają stałe w konfiguracji węzła.

Ikona bota pojawia się wyłącznie wtedy, gdy węzeł Set jest podłączony do uchwytu narzędzi agenta. Samodzielny węzeł Set nie wyświetla kontrolek dostarczanych przez agenta.

## Zasady wyrażeń

- Odwołania do poprzednich węzłów: `$nodeName.text`, `$nodeName.body.field`
- Funkcje: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` wyklucza `b`; w przypadku `a > b` zwraca błąd.
- Tylko jeden znak `$` na początku wyrażenia — nigdy wewnątrz nawiasów
- Dostęp do wyjścia przez klucz: `$setNode.randomNumber`, `$setNode.text`

## Przykład

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Węzły znajdujące się dalej w przepływie uzyskują dostęp przez `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Powiązane

- [Mapper wyjścia JSON](./json-output-mapper-node.md) – Te same mapowania; pojedynczy węzeł terminalny zwraca główny JSON dla webhooków/uruchomień
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Węzeł Execute](./execute-node.md) – Wywoływanie workflow (nie transformacja danych)
- [Expression DSL](../reference/expression-dsl.md) – Funkcje i składnia
- [Okno ewaluacji wyrażeń](../reference/expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem na żywo z backendu oraz przyciskami Prev/Next dla mapowań
