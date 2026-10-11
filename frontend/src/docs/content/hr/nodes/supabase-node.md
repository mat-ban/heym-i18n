# Supabase

**Supabase** čvor čita i mijenja tablice koje su izložene putem PostgREST API-ja Supabase projekta. Koristite ga kada želite pristupiti stanju aplikacije temeljenom na SQL-u bez ručnog pisanja HTTP zahtjeva.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | Supabase |
| Izlaz | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | Supabase vjerodajnica iz [Vjerodajnica](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operacija: `select`, `insert`, `update`, `upsert` ili `delete` |
| `supabaseSchema` | izraz | Ime sheme. Ako je prazno, čvor koristi zadanu shemu vjerodajnice, zatim `public`. |
| `supabaseTable` | izraz | Jednostavno ime tablice za upit ili izmjenu. Stavite shemu u `supabaseSchema`, ne ovdje. |
| `supabaseSelectColumns` | izraz | Popis odabranih PostgREST stupaca odvojen zarezima za `select` (zadano `*`) |
| `supabaseFilter` | izraz | JSON objekt filtra. Podržava točne podudarnosti plus operator objekte i logičke grupe, npr. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}`, ili `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maksimalni broj redaka za vraćanje za `select` (`0` = dohvat svih odgovarajućih redaka s paginacijom na strani poslužitelja, negativne vrijednosti vraćaju se na `100`) |
| `supabaseOrderBy` | izraz | Opcionalni stupac za sortiranje za `select` |
| `supabaseAscending` | boolean | Sortiraj uzlazno kada je `true`, silazno kada je `false` |
| `supabaseRowsInputMode` | string | Za `insert`/`upsert`: `raw` JSON niz ili `auto` za automatsko mapiranje pojedinačnog ulaznog čvora |
| `supabaseDataInputMode` | string | Za `update`: `raw` JSON objekt ili `auto` za automatsko mapiranje pojedinačnog ulaznog čvora |
| `supabaseIgnoredInputFields` | string | Opcionalni nazivi polja odvojeni zarezima koje treba izostaviti tijekom automatskog mapiranja ulaznih podataka |
| `supabaseRows` | izraz | JSON niz objekata redaka za `insert` i `upsert` |
| `supabaseOnConflict` | izraz | Opcionalni nazivi kolona ciljeva sukoba odvojeni zarezima za `upsert`, na primjer `id` ili `tenant_id,email` |
| `supabaseData` | izraz | JSON objekt ažuriranih vrijednosti stupaca za `update` |

## Postavljanje Vjerodajnica

Kreirajte **Supabase** vjerodajnicu u [kartici Vjerodajnice](../tabs/credentials-tab.md) s:

1. Vašim **URL-om projekta**, na primjer `https://your-project.supabase.co`
2. **API ključem** s pristupom tablicama koje bi ovaj workflow trebao koristiti
3. Opcionalnom **zadanoj shemom** (zadano `public`)

Čvor komunicira s Supabase PostgREST krajnjom točkom na `/rest/v1/<table>`.
Koristite `supabaseTable` samo za tablicu, kao što su `users` ili `profiles`. Ne proslijeđujte `schema.table`, `rpc/...`, ili druge API putanje tamo.

Kada je odabrana valjana Supabase vjerodajnica, uređivač može otkriti izložene tablice i stupce tablica izravno iz PostgREST OpenAPI metapodataka. Koristite padajući izbornik **otkrivenih tablica** za odabir tablice i **kolone** ispod **Odaberi stupce** za brzo izgradnju popisa odabranih stupaca.

## Operacije

| Operacija | Obavezna polja | Opis |
|-----------|----------------|------|
| `select` | `supabaseTable` | Čitajte redove s opcionalnim filtrima točnih podudarnosti, limitom i redoslijedom |
| `insert` | `supabaseTable`, `supabaseRows` ili automatsko mapiranje ulaza | Umetnite jedan ili više redaka |
| `update` | `supabaseTable`, `supabaseData` ili automatsko mapiranje ulaza, `supabaseFilter` | Ažurirajte redove koji odgovaraju filtru |
| `upsert` | `supabaseTable`, `supabaseRows` ili automatsko mapiranje ulaza | Umetnite ili spojite redove koristeći Supabase upsert semantiku. Koristite `supabaseOnConflict` kada trebate eksplicitni cilj sukoba. |
| `delete` | `supabaseTable`, `supabaseFilter` | Izbrišite redove koji odgovaraju filtru |

## Sintaksa Filtra

`supabaseFilter` sastavlja strukturirani JSON u PostgREST parametre upita.

- Točno podudaranje: `{"status":"active"}`
- Usporedba: `{"created_at":{"gte":"2026-01-01"}}`
- Članstvo: `{"status":{"in":["active","paused"]}}`
- Podudaranje uzorka: `{"email":{"ilike":"*@example.com"}}`
- Logički OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logički AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Za više operatora na istom polju, preferirajte logičku grupu:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginacija

`select` sada izvodi pravu paginaciju na strani poslužitelja protiv PostgREST-a.

- `supabaseLimit: "0"` dohvaća sve odgovarajuće redove stranica po stranica
- Vrijednosti `supabaseLimit` iznad 1000 automatski se raspoređuju u više zahtjeva
- Rezultati se spajaju natrag u jedan `.rows` niz, a `.count` ostaje ukupni broj odgovarajućih redova

Kada čitate velike tablice, postavite stabilan `supabaseOrderBy` kako biste održali granice stranica predvidljivima.

## Automatsko mapiranje ulaza

Za `insert`, `upsert` i `update`, prebacite čvor na **Automatsko mapiranje ulaza** kada pojedinačni uzvodni čvor već isporučuje oblik koji želite zapisati.

- Jedan objekt postaje jedan redak ili jedan payload za ažuriranje
- Niz objekata postaje mnogo redaka za `insert` / `upsert`
- Uzvodni objekt s `rows` nizom izravno ponovo koristi taj niz
- `supabaseIgnoredInputFields` omogućuje vam izostavljanje polja kao što su `id`, `created_at`, ili `success`
## Referenca izlaza

| Polje izlaza | Tip | Opis |
|--------------|-----|------|
| `.rows` | niz | Vraćeni objekti redaka |
| `.count` | broj | Broj vraćenih ili pogođenih redaka |
| `.success` | boolean | Je li operacija uspjela |

## Primjer – Odabir Aktivnih Korisnika

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

Pristup izlazu: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Primjer – Upsert Redak Profila

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

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Zaslon Vjerodajnica](../tabs/credentials-tab.md) – Dodavanje Supabase vjerodajnica
- [Integracije Trećih Strana](../reference/integrations.md) – Postavljanje vjerodajnica za integraciju
