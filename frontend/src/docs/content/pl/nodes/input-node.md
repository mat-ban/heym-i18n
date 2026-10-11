# Węzeł wejściowy

Węzeł **Input** (wejściowy) stanowi punkt wejścia dla workflow, które odbierają dane od użytkownika lub wywołującego API. Obsługuje pojedyncze lub wiele pól wejściowych oraz udostępnia metadane żądania (nagłówki, parametry zapytania).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `value` | string | Wartość domyślna dla pojedynczego pola tekstowego (opcjonalna) |
| `inputFields` | array | Definicje pól wejściowych. Każde: `{ key, defaultValue? }` |

### Pola wejściowe

| Pole | Typ | Opis |
|-------|------|-------------|
| `key` | string | Klucz pola (np. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Wartość domyślna, jeśli nie zostanie podana (opcjonalna) |

## Dostęp do danych wejściowych

**Pola body** (zawsze należy używać `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – pole tekstowe
- `$userInput.body.imageUrl` – adres URL obrazu
- `$userInput.body.userId` – z wartością domyślną, jeśli skonfigurowano
- `$userInput.body.event.user.id` – zagnieżdżony JSON z trybu Generic webhook

**Metadane żądania** (przy wykonaniu przez API):

- `$userInput.headers` – wszystkie nagłówki (klucze małymi literami)
- `$userInput.headers.authorization` – konkretny nagłówek
- `$userInput.query` – parametry zapytania
- `$userInput.query.param1` – konkretny parametr zapytania

## Wprowadzanie plików w panelu Run

W zakładce **Run** edytora (tryb Defined webhook) każde pole wejściowe obsługuje przeciąganie i upuszczanie oraz wbudowaną kontrolkę załącznika (w prawym dolnym narożniku pola):

- **Pliki tekstowe** (`.txt`, `.md`, `.json`, `.csv` i podobne) są odczytywane jako zwykły tekst.
- **Obrazy** (JPEG, PNG, GIF, WebP) są przechowywane jako adres URL typu `data:` (base64) w wartości pola — należy używać kluczy pól takich jak `imageUrl` lub `base64`, gdy kolejne węzły oczekują danych obrazu.
- **Pliki PDF** są konwertowane na wyodrębniony tekst (maks. 5 MB pliku, 100 tys. znaków treści).

Jeden plik na pole. Po wczytaniu pliku nadal można edytować pole tekstowe. Tryb Generic webhook (surowe body JSON) nie wyświetla kontrolek plików dla poszczególnych pól.

## Pola wejściowe a Generic webhooks

`inputFields` nadal opisują oczekiwane dane wejściowe dla formularzy edytora w trybie defined, mapowania sub-workflow oraz innych powierzchni opartych na metadanych.

Gdy workflow używa trybu body **Generic** webhook, przychodzące body HTTP nie jest przekształcane na podstawie `inputFields`. Zamiast tego surowy payload JSON jest przekazywany do `$nodeLabel.body`, a kontrolki dodawania/usuwania pól węzła Input są ukryte w panelu węzła.

## Przykłady

**Pojedyncze wejście (domyślnie):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Wiele wejść:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Triggery](../reference/triggers.md) – Punkty wejścia (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Odwołania do `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Udostępnianie workflow jako interfejsów Chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP dla workflow
