# Switch

**Switch** mazgas nukreipia vykdymą į skirtingus kelius, remiantis vertės atitikimu su atvejais. Palaiko N atvejų plius numatytąjį.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | n (po vieną kiekvienam atvejui + numatytasis) |
| Išvestis | Perduoda įvestį atitinkančiai šakai |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `expression` | expression | Vertė, kurią reikia įvertinti (pvz., `$input.category`) |
| `cases` | string[] | Atvejų vertės, su kuriomis reikia atitikti (pvz., `["case1", "case2", "case3"]`) |

## Kraštų valdymas

- Kiekvienam atvejui priskiriamas šaltinio rankenėlė (indeksas 0, 1, 2, …)
- Numatytoji rankenėlė nesutampančioms vertėms

## Pavyzdys

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

Sujunkite kraštus, nustatydami `sourceHandle` į atvejo indeksą (0, 1, 2) arba numatytąją rankenėlę nesutampančioms vertėms.

## Susiję

- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Condition Node](./condition-node.md) – If/else šakos
- [Expression DSL](../reference/expression-dsl.md) – Išraiškos sintaksė
