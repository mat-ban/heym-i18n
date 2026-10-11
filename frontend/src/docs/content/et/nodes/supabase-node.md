# Supabase

**Supabase** sõlm loeb ja muudab tabelites olevaid andmeid, mida Supabase projekti PostgREST API kaudu avalikustatakse. Kasutage seda, kui soovite workflow'le juurdepääsu SQL-põhisele rakenduse olekule ilma käsitsi HTTP-päringute kirjutamiseta.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Mandaat | Supabase |
| Väljund | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase'i mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Toiming: `select`, `insert`, `update`, `upsert` või `delete` |
| `supabaseSchema` | expression | Skeemi nimi. Kui tühi, kasutab sõlm mandaadi vaikeskeemi, seejärel `public`. |
| `supabaseTable` | expression | Lihtne tabeli nimi päringu tegemiseks või muutmiseks. Pange skeem väljale `supabaseSchema`, mitte siia. |
| `supabaseSelectColumns` | expression | Komaeraldusega PostgREST select-loend toimingu `select` jaoks (vaikimisi `*`) |
| `supabaseFilter` | expression | JSON-filtri objekt. Toetab täpseid vasteid ning operaatori objekte ja loogilisi gruppe, nt `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` või `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maksimaalne tagastatavate ridade arv toimingu `select` jaoks (`0` = kõigi vastavate ridade toomine serveripoolse lehekülgedeks jaotamisega, negatiivsed väärtused taanduvad väärtusele `100`) |
| `supabaseOrderBy` | expression | Valikuline veerg sorteerimiseks toimingu `select` jaoks |
| `supabaseAscending` | boolean | Sorteeri kasvavalt, kui `true`, kahanevalt, kui `false` |
| `supabaseRowsInputMode` | string | Toimingute `insert`/`upsert` jaoks: `raw` JSON-massiivi režiim või `auto`, et vastendada üksik ülemvoolu sisend automaatselt |
| `supabaseDataInputMode` | string | Toimingu `update` jaoks: `raw` JSON-objekti režiim või `auto`, et vastendada üksik ülemvoolu sisend automaatselt |
| `supabaseIgnoredInputFields` | string | Valikuline komaeraldusega väljade nimede loend, mille jätate automaatse vastendamise ajal vahele |
| `supabaseRows` | expression | JSON-massiiv reaobjektidega toimingute `insert` ja `upsert` jaoks |
| `supabaseOnConflict` | expression | Valikuline komaeraldusega konflikti sihtveergude loend toimingu `upsert` jaoks, näiteks `id` või `tenant_id,email` |
| `supabaseData` | expression | JSON-objekt uuendatud veergude väärtustega toimingu `update` jaoks |

## Mandaadi seadistamine

Looge **Supabase**'i mandaat jaotises [Mandaatide vahekaart](../tabs/credentials-tab.md) järgmistega:

1. Teie **Projekti URL**, näiteks `https://your-project.supabase.co`
2. **API võti**, millel on juurdepääs tabelitele, mida see workflow peaks kasutama
3. Valikuline **vaikeskeem** (vaikimisi `public`)

Sõlm suhtleb Supabase'i PostgREST endpoint'iga aadressil `/rest/v1/<table>`.
Kasutage `supabaseTable` jaoks ainult tabelit, näiteks `users` või `profiles`. Ärge edastage seal `schema.table`, `rpc/...` ega muid API-teid.

Kui kehtiv Supabase'i mandaat on valitud, saab redaktor avastada avalikustatud tabelid ja tabeli
veerud otse PostgREST OpenAPI metaandmetest. Kasutage **avastatud tabelite** rippmenüüd
tabeli valimiseks ja **veeru kiipide** valikut jaotises **Vali veerud**, et kiiresti select-loend koostada.

## Toimingud

| Toiming | Nõutavad väljad | Kirjeldus |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Loe ridu valikuliste täpse vaste filtrite, limiidi ja sorteerimisega |
| `insert` | `supabaseTable`, `supabaseRows` või sisendi automaatne vastendamine | Sisesta üks või mitu rida |
| `update` | `supabaseTable`, `supabaseData` või sisendi automaatne vastendamine, `supabaseFilter` | Uuenda filtrile vastavaid ridu |
| `upsert` | `supabaseTable`, `supabaseRows` või sisendi automaatne vastendamine | Sisesta või ühenda ridu Supabase'i upsert-semantika abil. Kasutage `supabaseOnConflict`, kui vajate selget konflikti sihtmärki. |
| `delete` | `supabaseTable`, `supabaseFilter` | Kustuta filtrile vastavad read |

## Filtri süntaks

`supabaseFilter` kompileerib struktureeritud JSON-i PostgREST päringuparameetriteks.

- Täpne vaste: `{"status":"active"}`
- Võrdlus: `{"created_at":{"gte":"2026-01-01"}}`
- Kuulumine: `{"status":{"in":["active","paused"]}}`
- Mustri vaste: `{"email":{"ilike":"*@example.com"}}`
- Loogiline VÕI: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Loogiline JA: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Mitme operaatori puhul samal väljal eelistage loogilist gruppi:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Lehekülgedeks jaotamine

`select` teostab nüüd tõelist serveripoolset lehekülgedeks jaotamist PostgRESTi vastu.

- `supabaseLimit: "0"` toob kõik vastavad read lehekülg lehekülje haaval
- `supabaseLimit` väärtused üle 1000 jaotuvad automaatselt mitmeks päringuks
- Tulemused ühendatakse tagasi üheks `.rows` massiiviks ja `.count` jääb kõigi vastavate ridade koguarvuks

Suurte tabelite lugemisel määrake stabiilne `supabaseOrderBy`, et hoida lehekülgede piirid etteaimatavad.

## Sisendi automaatne vastendamine

Toimingute `insert`, `upsert` ja `update` jaoks lülitage sõlm režiimi **Sisendi automaatne vastendamine**, kui üksik
ülemvoolu sõlm juba väljastab soovitud kuju, mida soovite kirjutada.

- Üksik objekt muutub üheks reaks või üheks uuenduse payload'iks
- Objektide massiiv muutub mitmeks reaks toimingute `insert` / `upsert` jaoks
- Ülemvoolu objekt, millel on `rows` massiiv, kasutab seda massiivi otse
- `supabaseIgnoredInputFields` võimaldab teil välja jätta välju nagu `id`, `created_at` või `success`
## Väljundi viide

| Väljundi väli | Tüüp | Kirjeldus |
|-------------|------|-------------|
| `.rows` | array | Tagastatud rea objektid |
| `.count` | number | Tagastatud või mõjutatud ridade arv |
| `.success` | boolean | Kas toiming õnnestus |

## Näide – Aktiivsete kasutajate valimine

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

Väljundile juurdepääs: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Näide – Profiili rea upsert

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

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'i tüüpidest
- [Credentials Tab](../tabs/credentials-tab.md) – Supabase'i mandaatide lisamine
- [Third-Party Integrations](../reference/integrations.md) – Integratsiooni mandaatide seadistamine
