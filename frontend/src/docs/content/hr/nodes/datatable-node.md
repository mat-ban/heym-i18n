# Tablica podataka

**Tablica podataka** čvor čita, piše i upravlja podacima u Heym Tablicama podataka. Koristite ga za CRUD operacije na prvotnim strukturiranim spremištima bez vanjskih vjerodajnica.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `dataTableId` | UUID | Tablica podataka iz [DataTable taba](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operacija: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | izraz | UUID retka (za getById, update, remove) |
| `dataTableData` | JSON string | Vrijednosti stupaca: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtriranje (find/upsert/count). `find` i `count` podržavaju operatore `{"age": {"$gt": 18}}`; `upsert` koristi točno podudaranje `{"column_name": "value"}` |
| `dataTableSort` | string | Stupac za sortiranje, prefiks `-` za silazno |
| `dataTableLimit` | broj | Maksimalni broj vraćenih redaka (zadano: 100) |

## Operacije

| Operacija | Obavezna polja | Opis |
|-----------|----------------|-------------|
| `find` | dataTableId | Pronađite retke koji odgovaraju opcionalnom operatoru filtra s opcionalnim sortiranjem/ograničenjem |
| `getAll` | dataTableId | Dohvatite sve retke s opcionalnim sortiranjem/ograničenjem |
| `count` | dataTableId | Prebrojite retke koji odgovaraju opcionalnom operatoru filtra (broji se u bazi podataka; vraća samo broj) |
| `getById` | dataTableId, dataTableRowId | Dohvatite jedan redak prema UUID-u |
| `insert` | dataTableId, dataTableData | Umetnite novi redak |
| `update` | dataTableId, dataTableRowId, dataTableData | Ažurirajte redak (spaja podatke) |
| `remove` | dataTableId, dataTableRowId | Izbrišite redak |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Ažurirajte ako je pronađeno podudaranje, umetnite inače |

## Primjer - Pronađi Retke

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

## Primjer - Umetni Redak

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

## Primjer - Prebroj Retke

Prebrojite retke koji odgovaraju uvjetu u jednom čvoru, umjesto `getAll` → If/Else → Map.

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

Rezultat je dostupan kao `$activeAdults.count`. Prazan ili izostavljen filtar broji svaki redak.

### Operatori filtra za pronalaženje i prebrojavanje

U `find` ili `count` filtru, obična vrijednost znači jednako; objektna vrijednost primjenjuje operator:

| Operator | Značenje |
|----------|---------|
| `$eq` (ili obična vrijednost) | Jednako |
| `$ne` | Nije jednako |
| `$gt`, `$gte`, `$lt`, `$lte` | Veće/manje usporedbe (numerički za stupce tipa `number`, inače tekst) |
| `$contains` | Usporedba podstringa bez obzira na velika/mala slova |
| `$in` | Vrijednost je u danom nizu |

Primjer kombiniranja nekoliko: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Nepoznata podudaranja se ignoriraju. `upsert` filtri i dalje koriste točne vrijednosti za pronalaženje retka koji će se ažurirati.

Možete također filtrirati prema metapodacima retka — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — koji se pohranjuju kao stvarni stupci, a ne unutar Vaših podataka. Za datume, proslijedite punu vrijednost za usporedbe raspona (npr. `{"created_at": {"$gt": "2026-06-04"}}`) ili koristite `$contains` za djelomično podudaranje teksta (npr. `{"created_at": {"$contains": "2026-06-04"}}`). Ako je jedan od Vaših vlastitih stupaca imenovan isto kao metapodatkovno polje, stupac podataka ima prednost.

## Pristup Izlazu

- `$nodeLabel.success` - Boolean status uspjeha
- `$nodeLabel.rows` - Niz redaka (find, getAll)
- `$nodeLabel.row` - Objekt jednog retka (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Pristup specifičnoj vrijednosti stupca
- `$nodeLabel.count` - Broj redaka (redovi vraćeni za find/getAll; ukupni broj podudaranja za count)
- `$nodeLabel.id` - UUID retka (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Ime operacije (npr. `count`; `insert`/`update` za upsert)

## Nema Potrebnih Vjerodajnica

Za razliku od vanjskih integracija, Tablica podataka djeluje na unutarnjoj bazi podataka Heym-a. Pristupne dozvole vlasnika radnog toka automatski se provjeravaju.

## Izradila AI Asistent

Kada [AI Asistent](../reference/ai-assistant.md#data-tables) ili [Chat](../tabs/chat-tab.md) izgrade ovaj čvor, odabire ili stvara tablicu s Vama i upisuje točna imena stupaca tablice u `dataTableData` i `dataTableFilter`.

## Povezano

- [DataTable Tab](../tabs/datatable-tab.md) - Kreirajte i upravljajte tablicama
- [Grist Node](./grist-node.md) - Vanjska integracija proračunskih tablica
- [Expression DSL](../reference/expression-dsl.md) - Sintaksa izraza za dinamičke vrijednosti
