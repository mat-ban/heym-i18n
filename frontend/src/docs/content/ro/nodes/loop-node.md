# Loop

Nodul **Loop** iterează peste un array, executând nodurile din aval pentru fiecare element. Necesită o conexiune inversă de la ultimul nod din corpul iterației pentru a avansa.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 2 (implicit + loop back) |
| Ieșiri | 2 (loop, done) |
| Ieșire | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `arrayExpression` | expression | Expresie care se rezolvă la un array (de ex. `$input.items`) |

## Mânere de conexiune

- **Sursa `loop`** – Se conectează la nodurile care procesează fiecare element (rulează la fiecare iterație)
- **Sursa `done`** – Se conectează la nodurile care rulează după finalizarea tuturor iterațiilor
- **Ținta implicită** – Primește datele inițiale care conțin array-ul
- **Ținta `loop`** – Primește conexiunea inversă de la ultimul nod din corpul iterației

## Contextul Loop (în corpul iterației)

- `$loopNode.item` – Elementul curent
- `$loopNode.index` – Index bazat pe 0
- `$loopNode.total` – Numărul total de elemente
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Reguli critice

1. **Conexiune inversă obligatorie:** Ultimul nod din corpul iterației TREBUIE să se conecteze înapoi la mânerul de intrare `loop` al nodului loop.
2. **Fără ieșire în corpul loop-ului:** Nodurile [Output](./output-node.md) sunt interzise în interiorul corpului loop-ului. Folosiți [Set](./set-node.md) sau [Variable](./variable-node.md) pentru rezultate intermediare.
3. **Fără rezultate automate:** Loop-ul nu colectează rezultate. Folosiți noduri Variable cu `$array()` și `.add()` pentru a acumula.

## Exemplu

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flux: loop → nod de procesare → (înapoi la loop) → loop → ramura done → output.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Variable](./variable-node.md) – Colectați elemente într-un loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metode de array
