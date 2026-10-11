# Mapovač JSON výstupu

Uzel **Mapovač JSON výstupu** sestavuje objekt JSON z mapování klíč/hodnota [mappings](./set-node.md) (stejný model jako u uzlu [Set](./set-node.md)). Použijte jej v případech, kdy mají volající obdržet **prosté tělo JSON** na kořenové úrovni odpovědi.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 0 (sink) |
| Runtime výstup | Objekt sestavený z `mappings` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `mappings` | array | Položky `{ "key": "fieldName", "value": "expression" }` (stejné jako u uzlu Set) |

## Použití jako nástroje agenta

Není podporováno. Tento uzel je koncový sink, takže jej nelze připojit k handle nástrojů uzlu [Agent Node](./agent-node.md). Pokud agent potřebuje upravovat hodnoty v průběhu konverzace, použijte uzel [Set](./set-node.md).

## Chování při Webhook a spuštění

Když je tento uzel **jediným** koncovým výstupem workflow, jsou **výstupy** spuštění samotný mapovaný objekt: klíče z `mappings` se objeví na **nejvyšší úrovni** JSON. Neexistuje **žádný** vnější obalový klíč podle labelu uzlu ani **žádný** objekt `{ "result": ... }` (na rozdíl od uzlu [Output](./output-node.md)).

Pokud výstupy produkuje více koncových uzlů (například [Output](./output-node.md) plus Mapovač JSON výstupu, nebo několik větví), Heym použije běžný tvar: každý koncový uzel je klíčován svým `label`.

## Omezení smyčky

Stejné pravidlo jako u uzlu [Output](./output-node.md): neumisťujte tento uzel do větve iterace smyčky – pouze za větev `done` smyčky. Viz [Loop](./loop-node.md).

## Příklad

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

## Související

- [Set](./set-node.md) – Stejná mechanika mapování pro mezilehlé transformace
- [Output](./output-node.md) – Zpráva nebo odpověď založená na schématu s obalem `result`
- [Node Types](../reference/node-types.md) – Všechny typy uzlů
- [Workflow Structure](../reference/workflow-structure.md) – Formát JSON workflow
- [Webhooks](../reference/webhooks.md) – Endpoint pro spuštění a odpovědi
