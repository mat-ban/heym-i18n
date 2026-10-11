# Mapper wyjścia JSON

Węzeł **Mapper wyjścia JSON** buduje obiekt JSON na podstawie mapowań klucz/wartość [mappings](./set-node.md) (ten sam model co węzeł [Set](./set-node.md)). Należy go użyć, gdy wywołujący powinni otrzymać **zwykłe ciało JSON** w katalogu głównym odpowiedzi.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 0 (sink) |
| Wyjście wykonania | Obiekt zbudowany z `mappings` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `mappings` | array | Wpisy `{ "key": "fieldName", "value": "expression" }` (takie same jak w Set) |

## Użycie jako narzędzie agenta

Nieobsługiwane. Ten węzeł jest terminalnym sinkiem, więc nie można go podłączyć do uchwytu narzędzi [Węzła agenta](./agent-node.md). Należy użyć węzła [Set](./set-node.md), gdy agent musi kształtować wartości w trakcie rozmowy.

## Zachowanie Webhook i wykonania

Gdy ten węzeł jest **jedynym** terminalnym wyjściem workflow, **wyjścia** wykonania stanowią sam mapowany obiekt: klucze z `mappings` pojawiają się na **najwyższym poziomie** JSON. **Nie** ma zewnętrznego wrappera kluczowanego etykietą węzła ani obiektu `{ "result": ... }` (w przeciwieństwie do węzła [Output](./output-node.md)).

Jeśli wiele terminalnych węzłów produkuje wyjścia (na przykład [Output](./output-node.md) oraz Mapper wyjścia JSON, albo kilka gałęzi), Heym stosuje standardowy kształt: każdy terminal jest kluczowany przez swój `label`.

## Ograniczenie pętli

Ta sama zasada co w węźle [Output](./output-node.md): nie należy umieszczać tego węzła wewnątrz gałęzi iteracji pętli — wyłącznie po gałęzi `done` pętli. Zobacz [Loop](./loop-node.md).

## Przykład

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Powiązane

- [Set](./set-node.md) – Ta sama mechanika mapowania dla transformacji pośrednich
- [Output](./output-node.md) – Odpowiedź oparta na wiadomości lub schemacie z opakowaniem `result`
- [Typy węzłów](../reference/node-types.md) – Wszystkie typy węzłów
- [Struktura workflow](../reference/workflow-structure.md) – Format JSON workflow
- [Webhooks](../reference/webhooks.md) – Endpoint wykonania i odpowiedzi
