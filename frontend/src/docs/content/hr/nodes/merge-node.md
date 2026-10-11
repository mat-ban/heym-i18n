# Spajanje

**Merge** čvor čeka na više paralelnih ulaza i kombinira ih u jedan izlaz. Koristite ga kada trebate spojiti rezultate iz paralelnih grana prije nastavka.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | n (konfigurabilno) |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.merged` – objekt s ulazima iz svake grane |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `inputCount` | number | Broj ulaza na koje se čeka (zadano: 2) |

## Kada koristiti

- Koristite kada trebate **kombinirati** ili **spojiti** rezultate iz paralelnih grana
- **Ne** koristite za paralelne workflows koji završavaju s odvojenim [Output](./output-node.md) čvorovima
- Svaka ulazna grana doprinosi spojenom izlazu

## Primjer

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Povežite više grana s merge čvorom. Čvor čeka na sve ulaze prije nego što proizvede izlaz.

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Paralelno izvršavanje](../reference/parallel-execution.md) – Kako paralelne grane rade
- [Struktura workflows-a](../reference/workflow-structure.md) – Rubovi i ručke
