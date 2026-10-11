# Ühendamine

**Ühendamise** sõlm ootab mitut paralleelset sisendit ja ühendab need üheks väljundiks. Kasutage seda, kui on vaja paralleelsete harude tulemused enne jätkamist kokku liita.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | n (konfigureeritav) |
| Väljundid | 1 |
| Väljund | `$nodeLabel.merged` – objekt, mis sisaldab iga haru sisendeid |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `inputCount` | number | Oodatavate sisendite arv (vaikimisi: 2) |

## Millal kasutada

- Kasutage, kui on vaja paralleelsete harude tulemused **kombineerida** või **ühendada**
- **Ärge** kasutage paralleelsete workflow'de puhul, mis lõpevad eraldi [Väljundi](./output-node.md) sõlmedega
- Iga sisendharu panustab ühendatud väljundisse

## Näide

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Ühendage mitu haru ühendamise sõlmega. Sõlm ootab kõiki sisendeid enne väljundi loomist.

## Seotud

- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Paralleelne täitmine](../reference/parallel-execution.md) – Kuidas paralleelsed harud töötavad
- [Workflow struktuur](../reference/workflow-structure.md) – Servad ja käepidemed
