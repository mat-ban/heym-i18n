# Uvjet

Čvor **Uvjet** grana workflow na temelju if/else izraza. Usmjerava na true ili false putanju ovisno o rezultatu.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 2 (true, false) |
| Izlaz | Prosljeđuje ulaz na odabranu granu |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `condition` | expression | JavaScript-u sličan izraz (npr. `$input.text.length > 0`) |

## Ručke rubova

- **Izvorna ručka `true`** – kada se uvjet evaluira kao istinit
- **Izvorna ručka `false`** – kada se uvjet evaluira kao neistinit

## Operatori izraza

Podržava: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` itd. Pogledajte [Expression DSL](../reference/expression-dsl.md).

## Primjer

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Povežite rubove s `sourceHandle: "true"` ili `sourceHandle: "false"` za usmjeravanje na različite grane.

## Povezano

- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Switch Node](./switch-node.md) – Višesmjerno usmjeravanje prema vrijednosti
- [Expression DSL](../reference/expression-dsl.md) – Sintaksa uvjeta
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Proširivi editor s pregledom backend-a uživo za uvjet
