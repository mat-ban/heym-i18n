# Apvienošana

**Apvienošanas** mezgls gaida vairākas paralēlas ievades un apvieno tās vienā izvadē. Izmantojiet to, ja nepieciešams apvienot rezultātus no paralēliem zariem pirms turpināšanas.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | n (konfigurējams) |
| Izvades | 1 |
| Izvade | `$nodeLabel.merged` – objekts ar ievadēm no katra zara |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezgla identifikators (camelCase) |
| `inputCount` | number | Gaidāmo ievadu skaits (noklusējums: 2) |

## Kad izmantot

- Izmantojiet, ja nepieciešams **apvienot** vai **savienot** rezultātus no paralēliem zariem
- Neizmantojiet paralēlām workflow, kas beidzas ar atsevišķiem [Izvades](./output-node.md) mezgliem
- Katrs ievades zars sniedz ieguldījumu apvienotajā izvadē

## Piemērs

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Pievienojiet vairākus zarus apvienošanas mezglam. Mezgls gaida visas ievades pirms izvades ģenerēšanas.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Paralēlā izpilde](../reference/parallel-execution.md) – Kā darbojas paralēlie zari
- [Workflow struktūra](../reference/workflow-structure.md) – Malas un rokturi
