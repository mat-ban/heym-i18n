# Merge

Nodul **Merge** așteaptă multiple intrări paralele și le combină într-o singură ieșire. Utilizați-l atunci când trebuie să uniți rezultatele din ramuri paralele înainte de a continua.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | n (configurabil) |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.merged` – obiect cu intrări din fiecare ramură |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `inputCount` | number | Numărul de intrări de așteptat (implicit: 2) |

## Când să utilizați

- Utilizați când trebuie să **combinați** sau să **uniți** rezultatele din ramuri paralele
- Nu utilizați pentru workflow-uri paralele care se încheie cu noduri [Output](./output-node.md) separate
- Fiecare ramură de intrare contribuie la ieșirea combinată

## Exemplu

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Conectați multiple ramuri la nodul merge. Nodul așteaptă toate intrările înainte de a produce ieșirea.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Execuție paralelă](../reference/parallel-execution.md) – Cum rulează ramurile paralele
- [Structura workflow-ului](../reference/workflow-structure.md) – Muchii și mânere
