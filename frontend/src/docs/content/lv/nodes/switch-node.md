# Switch

**Switch** mezgls maršrutē izpildi uz dažādiem ceļiem, pamatojoties uz vērtības saskaņošanu ar gadījumiem. Atbalsta N gadījumus plus noklusējuma gadījumu.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | n (pa vienai katram gadījumam + noklusējuma) |
| Izvade | Nodod ievadi tālāk uz atbilstošo zaru |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `expression` | expression | Novērtējamā vērtība (piem., `$input.category`) |
| `cases` | string[] | Saskaņojamās gadījumu vērtības (piem., `["case1", "case2", "case3"]`) |

## Malu rokturi

- Katrs gadījums iegūst avota rokturi (indekss 0, 1, 2, …)
- Noklusējuma rokturis vērtībām, kas neatbilst nevienam gadījumam

## Piemērs

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Savienojiet malas ar `sourceHandle`, kas iestatīts uz gadījuma indeksu (0, 1, 2) vai noklusējuma rokturi vērtībām, kas neatbilst nevienam gadījumam.

## Saistītais

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Condition mezgls](./condition-node.md) – If/else zarošana
- [Expression DSL](../reference/expression-dsl.md) – Izteiksmju sintakse
