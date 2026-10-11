# DataTable

Nodul **DataTable** citește, scrie și gestionează date în tabelele de date Heym. Utilizați-l pentru operațiuni CRUD pe stocarea structurată first-party, fără acreditări externe.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `dataTableId` | UUID | Tabel de date din [fila DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operațiune: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID-ul rândului (pentru getById, update, remove) |
| `dataTableData` | JSON string | Valorile coloanelor: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtru (find/upsert/count). `find` și `count` acceptă operatori `{"age": {"$gt": 18}}`; `upsert` utilizează potrivirea exactă `{"column_name": "value"}` |
| `dataTableSort` | string | Coloana de sortare, prefixul `-` pentru ordine descrescătoare |
| `dataTableLimit` | number | Numărul maxim de rânduri returnate (implicit: 100) |

## Operațiuni

| Operațiune | Câmpuri obligatorii | Descriere |
|-----------|----------------|-------------|
| `find` | dataTableId | Găsește rândurile care corespund unui filtru opțional cu operatori, cu sortare/limită opțională |
| `getAll` | dataTableId | Obține toate rândurile cu sortare/limită opțională |
| `count` | dataTableId | Numără rândurile care corespund unui filtru opțional cu operatori (numărate în baza de date; returnează doar un număr) |
| `getById` | dataTableId, dataTableRowId | Obține un singur rând după UUID |
| `insert` | dataTableId, dataTableData | Inserează un rând nou |
| `update` | dataTableId, dataTableRowId, dataTableData | Actualizează rândul (îmbină datele) |
| `remove` | dataTableId, dataTableRowId | Șterge un rând |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Actualizează dacă se găsește o potrivire, altfel inserează |

## Exemplu - Găsirea rândurilor

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

## Exemplu - Inserarea unui rând

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

## Exemplu - Numărarea rândurilor

Numărați rândurile care corespund unei condiții într-un singur nod, în loc de `getAll` → If/Else → Map.

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

Rezultatul este disponibil ca `$activeAdults.count`. Un filtru gol sau omis numără toate rândurile.

### Operatori de filtrare pentru find și count

Într-un filtru `find` sau `count`, o valoare simplă înseamnă egalitate; o valoare de tip obiect aplică un operator:

| Operator | Semnificație |
|----------|---------|
| `$eq` (sau o valoare simplă) | Egal cu |
| `$ne` | Diferit de |
| `$gt`, `$gte`, `$lt`, `$lte` | Comparații mai mare/mai mic (numerice pentru coloanele de tip `number`, altfel text) |
| `$contains` | Potrivire de subșir fără a ține cont de majuscule/minuscule |
| `$in` | Valoarea se află în tabloul dat |

Exemplu care combină mai mulți operatori: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Operatorii necunoscuți sunt ignorați. Filtrele `upsert` utilizează în continuare valori cu potrivire exactă pentru a găsi rândul de actualizat.

De asemenea, puteți filtra după metadatele rândului — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — care sunt stocate ca coloane reale, nu în interiorul datelor dvs. Pentru date, transmiteți o valoare completă pentru comparații de interval (de ex. `{"created_at": {"$gt": "2026-06-04"}}`) sau utilizați `$contains` pentru o potrivire parțială de text (de ex. `{"created_at": {"$contains": "2026-06-04"}}`). Dacă una dintre coloanele dvs. are același nume ca un câmp de metadate, coloana de date are prioritate.

## Accesarea ieșirii

- `$nodeLabel.success` - Starea de succes (boolean)
- `$nodeLabel.rows` - Tablou de rânduri (find, getAll)
- `$nodeLabel.row` - Obiect cu un singur rând (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Accesarea valorii unei coloane specifice
- `$nodeLabel.count` - Numărul de rânduri (rândurile returnate pentru find/getAll; totalul rândurilor care corespund pentru count)
- `$nodeLabel.id` - UUID-ul rândului (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Numele operațiunii (de ex. `count`; `insert`/`update` pentru upsert)

## Nu sunt necesare acreditări

Spre deosebire de integrările externe, DataTable operează pe baza de date internă a Heym. Permisiunile de acces ale proprietarului workflow-ului sunt verificate automat.

## Construit de Asistentul AI

Când [Asistentul AI](../reference/ai-assistant.md#data-tables) sau [Chat](../tabs/chat-tab.md) construiește acest nod, acesta alege sau creează tabelul împreună cu dvs. și scrie numele exacte ale coloanelor tabelului în `dataTableData` și `dataTableFilter`.

## Resurse conexe

- [Fila DataTable](../tabs/datatable-tab.md) - Creați și gestionați tabele
- [Nodul Grist](./grist-node.md) - Integrare externă cu foi de calcul
- [Expression DSL](../reference/expression-dsl.md) - Sintaxa expresiilor pentru valori dinamice
