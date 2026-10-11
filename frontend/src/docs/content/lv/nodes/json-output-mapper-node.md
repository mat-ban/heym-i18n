# JSON izvades kartētājs

**JSON izvades kartētāja** mezgls izveido JSON objektu no atslēgu/vērtību [kartējumiem](./set-node.md) (tāds pats modelis kā [Set](./set-node.md)). Izmantojiet to, ja izsaucējiem ir jāsaņem **vienkāršs JSON saturs** atbildes saknē.

## Pārskats

| Īpašība | Vērtība |
|----------|---------|
| Ievades | 1 |
| Izvades | 0 (sink) |
| Izpildlaika izvade | Objekts, kas veidots no `mappings` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|----------|
| `label` | string | Mezgla identifikators (camelCase) |
| `mappings` | array | `{ "key": "fieldName", "value": "expression" }` ieraksti (tāpat kā Set) |

## Aģenta rīka izmantošana

Netiek atbalstīta. Šis mezgls ir termināļa sink, tāpēc to nevar pievienot [Agent Node](./agent-node.md) rīku rokturim. Izmantojiet [Set](./set-node.md) mezglu, ja aģentam ir jāveido vērtības sarunas laikā.

## Webhook un izpildes darbība

Ja šis mezgls ir **vienīgā** termināļa izvade workflow, izpildes **outputs** ir pats kartētais objekts: atslēgas no `mappings` parādās JSON **augšējā līmenī**. Nav **nekāda** ārējā iesaiņojuma, kas būtu atslēgts ar mezgla label, un **nav** `{ "result": ... }` objekta (atšķirībā no [Output](./output-node.md) mezgla).

Ja vairāki termināļa mezgli veido izvades (piemēram, [Output](./output-node.md) kopā ar JSON izvades kartētāju vai vairāki zari), Heym izmanto parasto formu: katrs terminālis tiek atslēgts ar tā `label`.

## Cilpas ierobežojums

Tāds pats noteikums kā [Output](./output-node.md): nenovietojiet šo mezglu cilpas iterācijas zarā—tikai pēc cilpas `done` zara. Skatiet [Loop](./loop-node.md).

## Piemērs

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

## Saistītais

- [Set](./set-node.md) – Tāda pati kartēšanas mehānika starpposma pārveidojumiem
- [Output](./output-node.md) – Ziņojuma vai shēmas balstīta atbilde ar `result` iesaiņojumu
- [Node Types](../reference/node-types.md) – Visi mezglu tipi
- [Workflow Structure](../reference/workflow-structure.md) – JSON workflow formāts
- [Webhooks](../reference/webhooks.md) – Izpildes endpoint un atbildes
