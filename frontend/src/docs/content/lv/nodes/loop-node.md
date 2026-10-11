# Loop

**Loop** mezgls iterē pār masīvu, izpildot lejupējos mezglus katram elementam. Lai virzītos uz priekšu, ir nepieciešams atgriezeniskais savienojums no pēdējā mezgla iterācijas pamattekstā.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 2 (noklusējuma + loop atgriezeniskā) |
| Izvades | 2 (loop, done) |
| Izvade | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `arrayExpression` | expression | Izteiksme, kas atrisinās uz masīvu (piem., `$input.items`) |

## Malu rokturi

- **Avots `loop`** – Savienojas ar mezgliem, kas apstrādā katru elementu (izpildās katrā iterācijā)
- **Avots `done`** – Savienojas ar mezgliem, kas izpildās pēc visu iterāciju pabeigšanas
- **Mērķis default** – Saņem sākotnējos datus, kas satur masīvu
- **Mērķis `loop`** – Saņem atgriezenisko savienojumu no pēdējā iterācijas pamatteksta mezgla

## Loop konteksts (iterācijas pamattekstā)

- `$loopNode.item` – Pašreizējais elements
- `$loopNode.index` – Indekss, sākot no 0
- `$loopNode.total` – Kopējais elementu skaits
- `$loopNode.isFirst` – Būla vērtība
- `$loopNode.isLast` – Būla vērtība

## Svarīgi noteikumi

1. **Nepieciešams atgriezeniskais savienojums:** Pēdējam mezglam iterācijas pamattekstā OBLIGĀTI jāsavienojas atpakaļ ar loop mezgla `loop` ievades rokturi.
2. **Nav izvades loop pamattekstā:** [Output](./output-node.md) mezgli ir aizliegti loop pamattekstā. Starprezultātiem izmantojiet [Set](./set-node.md) vai [Variable](./variable-node.md).
3. **Nav automātisku rezultātu:** Loop neapkopo rezultātus. Lai uzkrātu, izmantojiet Variable mezglus ar `$array()` un `.add()`.

## Piemērs

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Plūsma: loop → apstrādes mezgls → (atpakaļ uz loop) → loop → done zars → izvade.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Variable mezgls](./variable-node.md) – Elementu apkopošana loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, masīva metodes
