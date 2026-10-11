# Supabase

Vozlišče **Supabase** bere in spreminja tabele, ki jih izpostavlja PostgREST API projekta Supabase. Uporabite ga, kadar želite dostopati do stanja aplikacije, podprtega s SQL, brez ročnega pisanja HTTP zahtevkov.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | Supabase |
| Izhod | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | Poverilnica Supabase iz [Poverilnic](../tabs/credentials-tab.md) |
| `supabaseOperation` | niz | Operacija: `select`, `insert`, `update`, `upsert` ali `delete` |
| `supabaseSchema` | izraz | Ime sheme. Če je prazno, vozlišče uporablja privzeto shemo poverilnice, nato `public`. |
| `supabaseTable` | izraz | Preprosto ime tabele za poizvedbo ali spremembo. Shemo vstavite v `supabaseSchema`, ne tukaj. |
| `supabaseSelectColumns` | izraz | Seznam stolpcev za `select`, ločen z vejicami (privzeto `*`) |
| `supabaseFilter` | izraz | JSON objekt filtra. Podpira natančne ujemanja ter operatorje in logične skupine, npr. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}`, ali `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | niz | Največje število vrstic, ki jih je treba vrniti za `select` (`0` = pridobi vse ujemajoče vrstice s strani strežnika, negativne vrednosti se vrnejo na `100`) |
| `supabaseOrderBy` | izraz | Neobvezni stolpec za razvrščanje za `select` |
| `supabaseAscending` | boolean | Razvrsti naraščajoče, ko je `true`, padajoče, ko je `false` |
| `supabaseRowsInputMode` | niz | Za `insert`/`upsert`: `raw` način JSON niza ali `auto`, da samodejno preslikate en sam vhodni podatek |
| `supabaseDataInputMode` | niz | Za `update`: `raw` način JSON objekta ali `auto`, da samodejno preslikate en sam vhodni podatek |
| `supabaseIgnoredInputFields` | niz | Neobvezni imeni polj, ločeni z vejicami, ki jih je treba izpustiti med samodejnim preslikovanjem vhodnih podatkov |
| `supabaseRows` | izraz | JSON niz objektov vrstic za `insert` in `upsert` |
| `supabaseOnConflict` | izraz | Neobvezni stolpci cilja za konflikte, ločeni z vejicami, za `upsert`, na primer `id` ali `tenant_id,email` |
| `supabaseData` | izraz | JSON objekt posodobljenih vrednosti stolpcev za `update` |

## Nastavitev Poverilnice

Ustvarite **Supabase** poverilnico v [zavihku Poverilnice](../tabs/credentials-tab.md) z:

1. Vašim **URL projekta**, na primer `https://your-project.supabase.co`
2. **API ključem** z dostopom do tabel, ki jih ta workflow uporablja
3. Neobvezno **privzeto shemo** (privzeto `public`)

Vozlišče komunicira s Supabase PostgREST končnim točko na `/rest/v1/<table>`.
Uporabite `supabaseTable` samo za tabelo, kot sta `users` ali `profiles`. Ne posredujte `schema.table`, `rpc/...` ali drugih poti API.

Ko je izbrana veljavna poverilnica Supabase, lahko urejevalnik neposredno odkrije izpostavljene tabele in stolpce tabel iz PostgREST OpenAPI metapodatkov. Uporabite spustni meni **odkrite tabele** za izbiro tabele in **čipe stolpcev** pod **Izberi stolpce** za hitro sestavljanje seznama za izbiro.

## Operacije

| Operacija | Zahtevana polja | Opis |
|-----------|------------------|------|
| `select` | `supabaseTable` | Preberite vrstice z neobveznimi filtri za natančno ujemanje, omejitvijo in razvrščanjem |
| `insert` | `supabaseTable`, `supabaseRows` ali samodejno preslikovanje vhodnih podatkov | Vstavite eno ali več vrstic |
| `update` | `supabaseTable`, `supabaseData` ali samodejno preslikovanje vhodnih podatkov, `supabaseFilter` | Posodobite vrstice, ki ustrezajo filtru |
| `upsert` | `supabaseTable`, `supabaseRows` ali samodejno preslikovanje vhodnih podatkov | Vstavite ali združite vrstice z uporabo semantike upsert Supabase. Uporabite `supabaseOnConflict`, kadar potrebujete eksplicitni cilj konflikta. |
| `delete` | `supabaseTable`, `supabaseFilter` | Izbrišite vrstice, ki ustrezajo filtru |

## Sintaksa filtra

`supabaseFilter` sestavi strukturiran JSON v poizvedbene parametre PostgREST.

- Natančno ujemanje: `{"status":"active"}`
- Primerjava: `{"created_at":{"gte":"2026-01-01"}}`
- Članstvo: `{"status":{"in":["active","paused"]}}`
- Ujemanje vzorca: `{"email":{"ilike":"*@example.com"}}`
- Logični OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logični AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Za več operatorjev na istem polju raje uporabite logično skupino:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginarjenje

`select` zdaj izvaja pravo paginarjenje na strani strežnika proti PostgREST.

- `supabaseLimit: "0"` pridobi vse ujemajoče vrstice po straneh
- Vrednosti `supabaseLimit` nad 1000 se samodejno razdelijo v več zahtevkov
- Rezultati se združijo v eno `.rows` tabelo, `.count` pa ostane skupno število ujemajočih vrstic

Pri branju velikih tabel nastavite stabilen `supabaseOrderBy`, da ohranite predvidljive meje strani.

## Samodejno preslikovanje vhodov

Za `insert`, `upsert` in `update` preklopite vozlišče na **Samodejno preslikovanje vhodov**, kadar en sam zgornji vozlišče že izhodno oblikuje, ki jo želite zapisati.

- En sam objekt postane ena vrstica ali ena posodobitev payload
- Niz objektov postane več vrstic za `insert` / `upsert`
- Zgornji objekt z `rows` nizom neposredno ponovno uporabi ta niz
- `supabaseIgnoredInputFields` vam omogoča, da izpustite polja, kot so `id`, `created_at` ali `success`
## Referenca izhoda

| Izhodna polja | Tip | Opis |
|---------------|-----|------|
| `.rows` | array | Vrniti objekti vrstic |
| `.count` | number | Število vrnjenih ali prizadetih vrstic |
| `.success` | boolean | Ali je operacija uspela |

## Primer – Izbira aktivnih uporabnikov

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

Dostop do izhoda: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Primer – Upsert vrstice profila

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek poverilnic](../tabs/credentials-tab.md) – Dodajanje poverilnic za Supabase
- [Integracije tretjih oseb](../reference/integrations.md) – Nastavitev poverilnic za integracijo
