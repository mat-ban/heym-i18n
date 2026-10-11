# ClickHouse

Nodul **ClickHouse** execută operațiuni CRUD, de numărare și SQL brut împotriva unei baze de date externe [ClickHouse](https://clickhouse.com/) prin interfața sa HTTP. Utilizați-l pentru a scrie evenimente într-un tabel ClickHouse dintr-un workflow, pentru a citi sau agrega date analitice sau pentru a rula SQL arbitrar — fără a scrie manual cereri HTTP.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | ClickHouse |
| Ieșire | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare ClickHouse din [Acreditări](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operațiune: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` sau `upsert` |
| `clickhouseTable` | expression | Nume simplu de tabel. Obligatoriu pentru fiecare operațiune, cu excepția `query`. |
| `clickhouseQuery` | expression | SQL brut pentru `query`. `SELECT`/`SHOW`/`DESCRIBE` returnează rânduri; alte instrucțiuni rulează ca comenzi. |
| `clickhouseFilter` | expression | Obiect JSON de filtre de egalitate, de ex. `{"status":"active"}`. Folosit de `find`, `count`, `update` și `remove`. Valorile sunt parametrizate. |
| `clickhouseLimit` | string | Numărul maxim de rânduri pentru `find` / `getAll` (`0` = nelimitat, fără clauză LIMIT). Implicit `100`. |
| `clickhouseSort` | expression | Opțional `column` sau `column ASC\|DESC` pentru `find` |
| `clickhouseRowId` | expression | Valoare comparată cu coloana `id` a tabelului pentru `getById` |
| `clickhouseInputMode` | string | Pentru `insert`/`upsert`: modul `raw` cu array JSON sau modul `selective` cu câmpuri cheie/valoare |
| `clickhouseData` | expression | Array JSON de obiecte rând pentru `insert`/`upsert` sau obiect JSON de valori de coloană pentru `update` |
| `clickhouseMappings` | array | Perechi `{key, value}` folosite când `clickhouseInputMode` este `selective` |

## Configurarea acreditărilor

Creați o acreditare **ClickHouse** în [fila Acreditări](../tabs/credentials-tab.md) cu:

1. **Host** — gazda HTTP fără schemă, de exemplu `your-instance.clickhouse.cloud`
2. **Port** — portul interfeței HTTP (`8443` pentru HTTPS, `8123` pentru HTTP)
3. **Username** / **Password** — implicit `default` cu parolă goală
4. **Database** — implicit `default`
5. **Secure** — activați pentru HTTPS (ClickHouse Cloud)

Nodul se conectează prin clientul HTTP oficial `clickhouse-connect`. Folosiți **Test connection** în dialogul de acreditare pentru a verifica accesibilitatea înainte de salvare.

## Operațiuni

| Operațiune | Câmpuri obligatorii | Descriere |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Rulați SQL brut. `SELECT` returnează `{rows, count}`; alte instrucțiuni returnează `{result}`. |
| `find` | `clickhouseTable` | Citiți rânduri cu filtre de egalitate, sortare și limită opționale |
| `getAll` | `clickhouseTable` | Citiți rânduri până la limită fără filtru |
| `count` | `clickhouseTable` | Numărați rânduri, opțional filtrate |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Citiți un singur rând după coloana sa `id` |
| `insert` | `clickhouseTable`, `clickhouseData` sau mappings | Inserați unul sau mai multe rânduri |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Actualizați rândurile corespunzătoare prin `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Ștergeți rândurile corespunzătoare prin `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` sau mappings | Inserați rânduri (presupune un tabel `ReplacingMergeTree`) |

## Sintaxa filtrelor

`clickhouseFilter` este un obiect JSON plat de verificări de egalitate pe coloane. Valorile sunt trimise ca parametri de interogare legați, deci sunt sigure împotriva injecției.

```json
{ "status": "active", "tenant_id": 42 }
```

Acesta se compilează în `WHERE status = {…:String} AND tenant_id = {…:Int64}`. În constructorul de filtre este acceptată doar egalitatea — pentru intervale, join-uri sau agregări, folosiți operațiunea `query` cu SQL brut.

## Moduri de intrare (insert / upsert)

- **Array JSON** (`raw`): furnizați un array JSON de obiecte rând în `clickhouseData`. Cheile care lipsesc dintr-un anumit rând sunt inserate ca `NULL`. Setul de coloane este reuniunea cheilor din toate rândurile.
- **Cheie-valoare** (`selective`): după ce selectați o acreditare și un tabel, editorul descoperă coloanele tabelului și creează un câmp de valoare pentru fiecare coloană. Se inserează un rând per execuție; fiecare valoare acceptă expresii.

## Mutații și semantica ClickHouse

ClickHouse este o bază de date OLAP, astfel încât scrierile la nivel de rând se comportă diferit față de un depozit OLTP:

- **`update`** emite `ALTER TABLE … UPDATE`, iar **`remove`** emite `DELETE FROM`. Ambele sunt **mutații asincrone** — sunt aplicate în cele din urmă și sunt relativ costisitoare. Preferați scrierile în loturi în locul mutațiilor frecvente pe un singur rând.
- **`upsert`** efectuează un `INSERT`. Pentru a obține comportamentul de merge-on-key, bazați tabelul pe un motor `ReplacingMergeTree`.
- **`getById`** presupune că tabelul are o coloană `id`.
- `update` și `remove` necesită un `clickhouseFilter` ne-gol pentru a evita mutațiile pe întregul tabel.

## Referință pentru ieșire

| Câmp de ieșire | Tip | Descriere |
|-------------|------|-------------|
| `.rows` | array | Obiecte rând returnate (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Numărul de rânduri (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Un singur rând sau `null` (`getById`) |
| `.result` | string | Rezumatul comenzii pentru `query` non-SELECT |
| `.success` | boolean | Dacă operațiunea a reușit |
## Exemplu – Inserarea unui eveniment

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Exemplu – Numărarea utilizatorilor activi

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Accesarea rezultatului: `$activeCount.count`.

## Exemplu – Interogare pentru raportul zilnic

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Accesarea rezultatului: `$dailyReport.rows`, `$dailyReport.count`.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugarea acreditărilor ClickHouse
- [Integrări terțe](../reference/integrations.md) – Configurarea acreditărilor pentru integrări
