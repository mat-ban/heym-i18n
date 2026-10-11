# Sujungti

**Sujungti** mazgas laukia kelių lygiagrečių įėjimų ir sujungia juos į vieną išėjimą. Naudokite jį, kai reikia sujungti rezultatus iš lygiagrečių šakų prieš tęsiant.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įėjimai | n (konfigūruojama) |
| Išėjimai | 1 |
| Išėjimas | `$nodeLabel.merged` – objektas su įėjimais iš kiekvienos šakos |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `inputCount` | number | Įėjimų skaičius, kurio laukia (numatytas: 2) |

## Kada Naudoti

- Naudokite, kai reikia **sujungti** arba **prisijungti** rezultatus iš lygiagrečių šakų
- **Nenaudokite** lygiagretiems workflow, kurie baigiasi atskirais [Išėjimo](./output-node.md) mazgais
- Kiekviena įėjimo šaka prisideda prie sujungto išėjimo

## Pavyzdys

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Prijunkite kelias šakas prie sujungimo mazgo. Mazgas laukia visų įėjimų prieš generuodamas išėjimą.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Lygiagretus vykdymas](../reference/parallel-execution.md) – Kaip veikia lygiagretės šakos
- [Workflow struktūra](../reference/workflow-structure.md) – Kraštai ir rankenos
