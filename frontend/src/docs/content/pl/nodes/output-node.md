# Wyjście

Węzeł **Wyjście** (Output) stanowi punkt końcowy workflow, który zwraca odpowiedź do wywołującego. Zawsze należy odwoływać się do poprzedniego węzła poprzez etykietę — nigdy nie używać `$input`.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 (opcjonalne, dla asynchronicznego przetwarzania końcowego) |
| Wyjście | Zwraca `message` do wywołującego |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `message` | expression | Wartość wyjściowa. **Musi** odwoływać się do poprzedniego węzła: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Jeśli true, węzły po wyjściu uruchamiają się asynchronicznie po wysłaniu odpowiedzi |

## Użycie jako narzędzie agenta

Gdy węzeł Wyjście jest podłączony do [Węzła agenta](./agent-node.md) jako narzędzie węzła na canvas, pole `message` można oznaczyć jako **dostarczane przez agenta** za pomocą ikony bota. Agent następnie dostarcza wiadomość, gdy wywołuje narzędzie. Jeśli węzeł Wyjście nie jest podłączony jako narzędzie agenta, ikona bota jest ukryta.

## Zasada krytyczna

**Nigdy nie używać `$input` w węźle wyjściowym.** Zawsze należy używać etykiety poprzedniego węzła:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (gdzie `processData` to etykieta poprzedniego węzła)

## Asynchroniczne przetwarzanie końcowe

Gdy `allowDownstream: true`, odpowiedź jest zwracana natychmiast. Węzły podłączone po wyjściu uruchamiają się w tle (np. powiadomienia Slack, logowanie). Ponieważ końcowy fragment downstream może zakończyć się później, awaria downstream może zmienić zapisany status uruchomienia na `error` po tym, jak wczesna odpowiedź została już zwrócona; końcowa historia i analityka odzwierciedlają ten późniejszy wynik.

## Przykład

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Przykład – z asynchronicznością

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Następnie należy podłączyć [Telegram](./telegram-node.md), [Slack](./slack-node.md) lub inny węzeł po wyjściu dla powiadomień typu fire-and-forget.

## Powiązane

- [Maper wyjścia JSON](./json-output-mapper-node.md) – Główne ciało JSON bez opakowania `result`, gdy jest jedynym terminalem
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [DSL wyrażeń](../reference/expression-dsl.md) – Odwoływanie się do wyjścia węzła
- [Okno dialogowe ewaluacji wyrażeń](../reference/expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem backendu na żywo dla message
- [Struktura workflow](../reference/workflow-structure.md) – Format JSON
