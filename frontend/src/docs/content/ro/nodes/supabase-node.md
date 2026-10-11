# Supabase

Nodul **Supabase** citește și modifică tabelele expuse de API-ul PostgREST al unui proiect Supabase. Utilizați-l atunci când doriți să accesați din workflow starea aplicației susținută de SQL fără a scrie manual cereri HTTP.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | Supabase |
| Ieșire | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare Supabase din [Acreditări](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operațiune: `select`, `insert`, `update`, `upsert` sau `delete` |
| `supabaseSchema` | expression | Numele schemei. Dacă este gol, nodul utilizează schema implicită a acreditării, apoi `public`. |
| `supabaseTable` | expression | Nume simplu de tabel pentru interogare sau modificare. Introduceți schema în `supabaseSchema`, nu aici. |
| `supabaseSelectColumns` | expression | Listă de selecție PostgREST separată prin virgule pentru `select` (implicit `*`) |
| `supabaseFilter` | expression | Obiect JSON de filtrare. Acceptă potriviri exacte, precum și obiecte cu operatori și grupuri logice, de ex. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` sau `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Numărul maxim de rânduri returnate pentru `select` (`0` = preia toate rândurile care corespund, cu paginare pe server, valorile negative revin la `100`) |
| `supabaseOrderBy` | expression | Coloană opțională pentru sortare la `select` |
| `supabaseAscending` | boolean | Sortare crescătoare când este `true`, descrescătoare când este `false` |
| `supabaseRowsInputMode` | string | Pentru `insert`/`upsert`: mod `raw` cu array JSON sau `auto` pentru a mapa automat singura intrare din amonte |
| `supabaseDataInputMode` | string | Pentru `update`: mod `raw` cu obiect JSON sau `auto` pentru a mapa automat singura intrare din amonte |
| `supabaseIgnoredInputFields` | string | Nume opționale de câmpuri separate prin virgule, de omis la maparea automată a datelor de intrare |
| `supabaseRows` | expression | Array JSON de obiecte rând pentru `insert` și `upsert` |
| `supabaseOnConflict` | expression | Coloane țintă de conflict opționale, separate prin virgule, pentru `upsert`, de exemplu `id` sau `tenant_id,email` |
| `supabaseData` | expression | Obiect JSON cu valorile coloanelor actualizate pentru `update` |

## Configurarea acreditării

Creați o acreditare **Supabase** în [fila Acreditări](../tabs/credentials-tab.md) cu:

1. **Project URL**-ul dvs., de exemplu `https://your-project.supabase.co`
2. O **cheie API** cu acces la tabelele pe care acest workflow ar trebui să le utilizeze
3. O **schemă implicită** opțională (implicit `public`)

Nodul comunică cu endpoint-ul Supabase PostgREST la `/rest/v1/<table>`.
Utilizați `supabaseTable` doar pentru tabel, cum ar fi `users` sau `profiles`. Nu introduceți acolo `schema.table`, `rpc/...` sau alte căi API.

Când este selectată o acreditare Supabase validă, editorul poate descoperi tabelele expuse și coloanele
tabelelor direct din metadatele OpenAPI PostgREST. Utilizați meniul derulant **discovered tables** pentru
a alege un tabel și **column chips** de sub **Select Columns** pentru a construi rapid o listă de selecție.

## Operațiuni

| Operațiune | Câmpuri obligatorii | Descriere |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Citește rânduri cu filtre opționale de potrivire exactă, limită și ordonare |
| `insert` | `supabaseTable`, `supabaseRows` sau mapare automată a intrării | Inserează unul sau mai multe rânduri |
| `update` | `supabaseTable`, `supabaseData` sau mapare automată a intrării, `supabaseFilter` | Actualizează rândurile care corespund filtrului |
| `upsert` | `supabaseTable`, `supabaseRows` sau mapare automată a intrării | Inserează sau fuzionează rânduri folosind semantica upsert Supabase. Utilizați `supabaseOnConflict` când aveți nevoie de o țintă de conflict explicită. |
| `delete` | `supabaseTable`, `supabaseFilter` | Șterge rândurile care corespund filtrului |

## Sintaxa filtrelor

`supabaseFilter` compilează JSON structurat în parametri de interogare PostgREST.

- Potrivire exactă: `{"status":"active"}`
- Comparație: `{"created_at":{"gte":"2026-01-01"}}`
- Apartenență: `{"status":{"in":["active","paused"]}}`
- Potrivire de tipar: `{"email":{"ilike":"*@example.com"}}`
- SAU logic: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- ȘI logic: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Pentru mai mulți operatori pe același câmp, preferați un grup logic:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginare

`select` efectuează acum paginare reală pe server către PostgREST.

- `supabaseLimit: "0"` preia toate rândurile care corespund, pagină cu pagină
- Valorile `supabaseLimit` peste 1000 se împart automat în mai multe cereri
- Rezultatele sunt fuzionate înapoi într-un singur array `.rows`, iar `.count` rămâne numărul total de rânduri care corespund

La citirea tabelelor mari, setați un `supabaseOrderBy` stabil pentru a menține limitele paginilor previzibile.

## Mapare automată a intrării

Pentru `insert`, `upsert` și `update`, comutați nodul pe **Auto-map input** atunci când singurul
nod din amonte produce deja forma pe care doriți să o scrieți.

- Un singur obiect devine un rând sau un payload de actualizare
- Un array de obiecte devine mai multe rânduri pentru `insert` / `upsert`
- Un obiect din amonte cu un array `rows` reutilizează direct acel array
- `supabaseIgnoredInputFields` vă permite să eliminați câmpuri precum `id`, `created_at` sau `success`
## Referință pentru ieșire

| Câmp de ieșire | Tip | Descriere |
|-------------|------|-------------|
| `.rows` | array | Obiectele de rând returnate |
| `.count` | number | Numărul de rânduri returnate sau afectate |
| `.success` | boolean | Indică dacă operațiunea a reușit |

## Exemplu – Selectarea utilizatorilor activi

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Accesarea ieșirii: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Exemplu – Upsert pentru un rând de profil

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugarea acreditărilor Supabase
- [Integrări terțe](../reference/integrations.md) – Configurarea acreditărilor pentru integrări
