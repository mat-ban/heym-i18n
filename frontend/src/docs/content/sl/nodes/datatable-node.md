# Podatkovna tabela

**Podatkovna tabela** vozlišče bere, piše in upravlja podatke v Heym podatkovnih tabelah. Uporabite ga za CRUD operacije na prvovrstnem strukturiranem shranjevanju brez zunanjih poverilnic.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `dataTableId` | UUID | Podatkovna tabela iz [zavihek Podatkovna tabela](../tabs/datatable-tab.md) |
| `dataTableOperation` | niz | Operacija: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | izraz | UUID vrstice (za getById, update, remove) |
| `dataTableData` | JSON niz | Vrednosti stolpcev: `{"column_name": "value"}` |
| `dataTableFilter` | JSON niz | Filter (find/upsert/count). `find` in `count` podpirata operatorje `{"age": {"$gt": 18}}`; `upsert` uporablja natančno ujemanje `{"column_name": "value"}` |
| `dataTableSort` | niz | Stolpec za razvrščanje, predpona `-` za padajoče |
| `dataTableLimit` | število | Maksimalno število vrstice, ki se vrnejo (privzeto: 100) |

## Operacije

| Operacija | Zahtevana polja | Opis |
|-----------|----------------|------|
| `find` | dataTableId | Najdite vrstice, ki ustrezajo opcijskemu operatorju filtra z opcijskim razvrščanjem/omejitvijo |
| `getAll` | dataTableId | Pridobite vse vrstice z opcijskim razvrščanjem/omejitvijo |
| `count` | dataTableId | Preštejte vrstice, ki ustrezajo opcijskemu operatorju filtra (prešteje se v bazi podatkov; vrne samo število) |
| `getById` | dataTableId, dataTableRowId | Pridobite eno samo vrstico po UUID |
| `insert` | dataTableId, dataTableData | Vstavite novo vrstico |
| `update` | dataTableId, dataTableRowId, dataTableData | Posodobite vrstico (združi podatke) |
| `remove` | dataTableId, dataTableRowId | Izbrišite vrstico |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Posodobite, če je najdeno ujemanje, sicer vstavite |

## Primer - Najdi vrstice

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

## Primer - Vstavi vrstico

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

## Primer - Preštej vrstice

Preštejte vrstice, ki ustrezajo pogojem v enem samem vozlišču, namesto `getAll` → If/Else → Map.

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

Rezultat je na voljo kot `$activeAdults.count`. Prazni ali izpuščeni filtri preštejejo vsako vrstico.

### Filtri za iskanje in štetje operatorjev

V `find` ali `count` filtru, navadna vrednost pomeni enako; objektna vrednost uporablja operator:

| Operator | Pomen |
|----------|-------|
| `$eq` (ali navadna vrednost) | Enako |
| `$ne` | Ni enako |
| `$gt`, `$gte`, `$lt`, `$lte` | Večje/manjše primerjave (numerične za stolpce tipa `number`, sicer besedilne) |
| `$contains` | Ujemanje podniza brez upoštevanja velikosti črk |
| `$in` | Vrednost je v danem naboru |

Primer kombiniranja več: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Neznani operatorji se ignorirajo. `upsert` filtri še vedno uporabljajo natančne vrednosti za iskanje vrstice za posodobitev.

Filtrirate lahko tudi po metapodatkih vrstice — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — ki so shranjeni kot pravi stolpci in ne znotraj vaših podatkov. Za datume posredujte polno vrednost za primerjave obsega (npr. `{"created_at": {"$gt": "2026-06-04"}}`) ali uporabite `$contains` za delno besedilno ujemanje (npr. `{"created_at": {"$contains": "2026-06-04"}}`). Če je eden od vaših stolpcev poimenovan enako kot metapodatkovno polje, ima prednost podatkovni stolpec.

## Dostop do izhodov

- `$nodeLabel.success` - Boolean status uspeha
- `$nodeLabel.rows` - Množica vrstic (find, getAll)
- `$nodeLabel.row` - Enotni objekt vrstice (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Dostop do specifične vrednosti stolpca
- `$nodeLabel.count` - Število vrstic (vrstice, vrnjene za find/getAll; skupno število ujemajočih vrstic za count)
- `$nodeLabel.id` - UUID vrstice (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Ime operacije (npr. `count`; `insert`/`update` za upsert)

## Ni potrebna poverilnica

Za razliko od zunanjih integracij, podatkovna tabela deluje na notranji bazi Heym. Dovoljenja za dostop lastnika delovnega toka se preverjajo samodejno.

## Zgrajeno z AI asistentom

Ko [AI asistent](../reference/ai-assistant.md#data-tables) ali [Chat](../tabs/chat-tab.md) ustvari to vozlišče, izbere ali ustvari tabelo z vami in zapiše natančna imena stolpcev tabele v `dataTableData` in `dataTableFilter`.

## Sorodno

- [Zavihek Podatkovna tabela](../tabs/datatable-tab.md) - Ustvarite in upravljajte tabele
- [Grist vozlišče](./grist-node.md) - Integracija zunanjih preglednic
- [Izraz DSL](../reference/expression-dsl.md) - Sintaksa izrazov za dinamične vrednosti
