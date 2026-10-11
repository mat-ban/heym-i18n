# Petlja

**Petlja** čvor iterira kroz niz, izvršavajući downstream čvorove za svaki element. Potrebna je povratna veza od posljednjeg čvora u tijelu iteracije za napredovanje.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 2 (zadano + povratna veza) |
| Izlazi | 2 (petlja, završeno) |
| Izlaz | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `arrayExpression` | expression | Izraz koji se rješava u niz (npr. `$input.items`) |

## Rukovanje rubovima

- **Izvor `loop`** – Povezuje se s čvorovima koji obrađuju svaki element (izvršava se po iteraciji)
- **Izvor `done`** – Povezuje se s čvorovima koji se izvršavaju nakon što sve iteracije završe
- **Cilj zadano** – Prima inicijalne podatke koji sadrže niz
- **Cilj `loop`** – Prima povratnu vezu od posljednjeg čvora tijela iteracije

## Kontekst petlje (u tijelu iteracije)

- `$loopNode.item` – Trenutni element
- `$loopNode.index` – Indeks temeljen na 0
- `$loopNode.total` – Ukupan broj elemenata
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritična pravila

1. **Povratna veza je obavezna:** Posljednji čvor u tijelu iteracije MORATE povezati natrag na `loop` ulaz petlje.
2. **Nema izlaza u tijelu petlje:** [Izlaz](./output-node.md) čvorovi su zabranjeni unutar tijela petlje. Koristite [Set](./set-node.md) ili [Variable](./variable-node.md) za privremene rezultate.
3. **Nema automatskih rezultata:** Petlja ne prikuplja rezultate. Koristite Variable čvorove s `$array()` i `.add()` za akumulaciju.

## Primjer

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Tok: petlja → čvor za obradu → (natrag u petlju) → petlja → završna grana → izlaz.

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Variable Node](./variable-node.md) – Prikupljanje elemenata u petlji
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metode niza
