# Condiție

Nodul **Condiție** ramifică workflow-ul pe baza unei expresii if/else. Direcționează către calea true sau false în funcție de rezultat.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 2 (true, false) |
| Ieșire | Transmite intrarea către ramura aleasă |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `condition` | expression | Expresie de tip JavaScript (de ex. `$input.text.length > 0`) |

## Mânere de muchie

- **Mâner sursă `true`** – când condiția se evaluează ca adevărată
- **Mâner sursă `false`** – când condiția se evaluează ca falsă

## Operatori de expresie

Acceptă: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` etc. Consultați [Expression DSL](../reference/expression-dsl.md).

## Exemplu

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Conectați muchiile cu `sourceHandle: "true"` sau `sourceHandle: "false"` pentru a direcționa către ramuri diferite.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Switch](./switch-node.md) – Direcționare multi-cale după valoare
- [Expression DSL](../reference/expression-dsl.md) – Sintaxa condiției
- [Dialogul de evaluare a expresiilor](../reference/expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live în backend pentru condiție
