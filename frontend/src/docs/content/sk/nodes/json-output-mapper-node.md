# JSON output mapper

Uzol **JSON output mapper** vytvára JSON objekt z key/value [mappings](./set-node.md) (rovnaký model ako [Set](./set-node.md)). Použite ho, keď volajúci majú dostať **plain JSON body** na koreni odpovede.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 0 (sink) |
| Runtime výstup | Objekt vytvorený z `mappings` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `mappings` | array | Záznamy `{ "key": "fieldName", "value": "expression" }` (rovnaké ako Set) |

## Použitie ako nástroj agenta

Nie je podporované. Tento uzol je terminálny sink, takže ho nie je možné pripojiť k handle nástrojov [Agent Node](./agent-node.md). Keď agent potrebuje upraviť hodnoty počas konverzácie, použite uzol [Set](./set-node.md).

## Správanie pri Webhook a spustení

Keď je tento uzol **jediným** terminálnym výstupom workflow, **výstupy** spustenia sú samotný mapovaný objekt: kľúče z `mappings` sa objavia na **najvyššej úrovni** JSON. Neexistuje **žiadny** vonkajší wrapper kľúčovaný podľa labelu uzla a **žiadny** objekt `{ "result": ... }` (na rozdiel od uzla [Output](./output-node.md)).

Ak viacero terminálnych uzlov vytvára výstupy (napríklad [Output](./output-node.md) plus JSON output mapper alebo niekoľko vetiev), Heym použije bežný tvar: každý terminál je kľúčovaný podľa svojho `label`.

## Obmedzenie slučky

Rovnaké pravidlo ako pri [Output](./output-node.md): neumiestňujte tento uzol do vetvy iterácie slučky – iba za vetvu `done` slučky. Pozrite [Loop](./loop-node.md).

## Príklad

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

## Súvisiace

- [Set](./set-node.md) – Rovnaká mechanika mapovania pre medzikroky transformácií
- [Output](./output-node.md) – Odpoveď založená na správe alebo schéme s obalením `result`
- [Node Types](../reference/node-types.md) – Všetky typy uzlov
- [Workflow Structure](../reference/workflow-structure.md) – Formát JSON workflow
- [Webhooks](../reference/webhooks.md) – Endpoint spustenia a odpovede
