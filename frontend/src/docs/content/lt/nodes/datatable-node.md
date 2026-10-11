# Duomenų lentelė

**Duomenų lentelės** mazgas skaito, rašo ir valdo duomenis Heym Duomenų lentelėse. Naudokite jį CRUD operacijoms pirmosios šalies struktūrizuotame saugojime be išorinių kredencialų.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `dataTableId` | UUID | Duomenų lentelė iš [Duomenų lentelės skirtuko](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operacija: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Eilutės UUID (naudojama getById, update, remove) |
| `dataTableData` | JSON string | Stulpelių reikšmės: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtras (find/upsert/count). `find` ir `count` palaiko operatorius `{"age": {"$gt": 18}}`; `upsert` naudoja tikslius atitikmenis `{"column_name": "value"}` |
| `dataTableSort` | string | Rūšiavimo stulpelis, prefiksas `-` mažėjimui |
| `dataTableLimit` | number | Maksimalus grąžinamų eilučių skaičius (numatytasis: 100) |

## Operacijos

| Operacija | Reikalingi laukai | Aprašymas |
|-----------|-------------------|-----------|
| `find` | dataTableId | Rasti eiles, atitinkančias pasirinktą operatoriaus filtrą su pasirinktiniu rūšiavimu/limitu |
| `getAll` | dataTableId | Gauti visas eiles su pasirinktiniu rūšiavimu/limitu |
| `count` | dataTableId | Suskaičiuoti eiles, atitinkančias pasirinktą operatoriaus filtrą (skaičiuojama duomenų bazėje; grąžina tik skaičių) |
| `getById` | dataTableId, dataTableRowId | Gauti vieną eilutę pagal UUID |
| `insert` | dataTableId, dataTableData | Įterpti naują eilutę |
| `update` | dataTableId, dataTableRowId, dataTableData | Atnaujinti eilutę (sujungia duomenis) |
| `remove` | dataTableId, dataTableRowId | Ištrinti eilutę |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Atnaujinti, jei rastas atitikmuo, kitaip įterpti |

## Pavyzdys - Rasti Eiles

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Pavyzdys - Įterpti Eilutę

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Pavyzdys - Suskaičiuoti Eiles

Suskaičiuoti eiles, atitinkančias sąlygą viename mazge, vietoj `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Rezultatas yra prieinamas kaip `$activeAdults.count`. Tuščias arba praleistas filtras skaičiuoja kiekvieną eilutę.

### Rasti ir skaičiuoti filtro operatoriai

`find` arba `count` filtre paprasta reikšmė reiškia lygu; objekto reikšmė taiko operatorių:

| Operatorius | Reikšmė |
|-------------|---------|
| `$eq` (arba paprasta reikšmė) | Lygu |
| `$ne` | Nelygu |
| `$gt`, `$gte`, `$lt`, `$lte` | Didesnis/mažesnis palyginimas (skaičiuojant stulpeliams, kurių tipas `number`, kitaip tekstas) |
| `$contains` | Nereikšminis dalies atitikimas |
| `$in` | Reikšmė yra nurodytame masyve |

Pavyzdys, derinantis kelis: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Nežinomi operatoriai ignoruojami. `upsert` filtrai vis tiek naudoja tikslius atitikmenis, kad rastų eilutę, kurią reikia atnaujinti.

Taip pat galite filtruoti pagal eilutės metaduomenis — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — kurie saugomi kaip tikri stulpeliai, o ne jūsų duomenų viduje. Datoms perduokite pilną reikšmę diapazono palyginimams (pvz., `{"created_at": {"$gt": "2026-06-04"}}`) arba naudokite `$contains` daliniam teksto atitikimui (pvz., `{"created_at": {"$contains": "2026-06-04"}}`). Jei vienas iš jūsų stulpelių pavadintas taip pat kaip metaduomenų laukas, duomenų stulpelis turi pirmenybę.

## Išvesties Prieiga

- `$nodeLabel.success` - Boolean sėkmės statusas
- `$nodeLabel.rows` - Eilučių masyvas (find, getAll)
- `$nodeLabel.row` - Vienos eilutės objektas (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Prieiga prie konkrečios stulpelio reikšmės
- `$nodeLabel.count` - Eilučių skaičius (eilučių grąžinimas find/getAll; atitinkančių eilučių visuma skaičiavimui)
- `$nodeLabel.id` - Eilutės UUID (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Operacijos pavadinimas (pvz., `count`; `insert`/`update` už upsert)

## Kredencialų Nereikia

Skirtingai nuo išorinių integracijų, Duomenų lentelė veikia Heym vidinėje duomenų bazėje. Darbo eigos savininko prieigos teisės tikrinamos automatiškai.

## Sukurtas AI Asistento

Kai [AI Asistentas](../reference/ai-assistant.md#data-tables) arba [Chat](../tabs/chat-tab.md) kuria šį mazgą, jis pasirenka arba sukuria lentelę kartu su Jumis ir įrašo tikslius lentelės stulpelių pavadinimus į `dataTableData` ir `dataTableFilter`.

## Susiję

- [Duomenų lentelės skirtukas](../tabs/datatable-tab.md) - Kurti ir valdyti lenteles
- [Grist mazgas](./grist-node.md) - Išorinio skaičiuoklių integravimas
- [Išraiškų DSL](../reference/expression-dsl.md) - Išraiškų sintaksė dinaminėms reikšmėms
