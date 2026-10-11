# Supabase

**Supabase** mazgas skaito ir keičia lenteles, kurias pateikia Supabase projekto PostgREST API. Naudokite jį, kai norite, kad workflow turėtų prieigą prie SQL pagrindu veikiančio programos būsenos be rankiniu būdu rašomų HTTP užklausų.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | Supabase |
| Išvestis | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | Supabase kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operacija: `select`, `insert`, `update`, `upsert` arba `delete` |
| `supabaseSchema` | expression | Schemos pavadinimas. Jei tuščias, mazgas naudoja kredencialo numatytąją schemą, tada `public`. |
| `supabaseTable` | expression | Paprastas lentelės pavadinimas, kurį reikia užklausti arba keisti. Schemos nurodykite `supabaseSchema`, o ne čia. |
| `supabaseSelectColumns` | expression | Kableliais atskirtas PostgREST pasirinkimo sąrašas `select` (numatytasis `*`) |
| `supabaseFilter` | expression | JSON filtravimo objektas. Palaiko tikslius atitikimus, taip pat operatorių objektus ir loginės grupes, pvz., `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}`, arba `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maksimalus grąžinamų eilučių skaičius `select` (`0` = gauti visas atitinkančias eilutes su serverio pusės puslapiavimu, neigiamos vertės grįžta prie `100`) |
| `supabaseOrderBy` | expression | Pasirinktinė stulpelio rūšiavimo tvarka `select` |
| `supabaseAscending` | boolean | Rūšiuoti didėjimo tvarka, kai `true`, mažėjimo tvarka, kai `false` |
| `supabaseRowsInputMode` | string | `insert`/`upsert`: `raw` JSON masyvo režimas arba `auto`, kad automatiškai sužemintų vieną įvesties mazgą |
| `supabaseDataInputMode` | string | `update`: `raw` JSON objekto režimas arba `auto`, kad automatiškai sužemintų vieną įvesties mazgą |
| `supabaseIgnoredInputFields` | string | Pasirinktiniai kableliais atskirti laukų pavadinimai, kuriuos reikia praleisti automatiškai žemyninant įvesties duomenis |
| `supabaseRows` | expression | JSON masyvas su eilučių objektais `insert` ir `upsert` |
| `supabaseOnConflict` | expression | Pasirinktiniai kableliais atskirti konfliktų tiksliniai stulpeliai `upsert`, pavyzdžiui, `id` arba `tenant_id,email` |
| `supabaseData` | expression | JSON objektas su atnaujintų stulpelių reikšmėmis `update` |

## Kredencialų Nustatymas

Sukurkite **Supabase** kredencialą [Kredencialų skirtuke](../tabs/credentials-tab.md) su:

1. Jūsų **Projekto URL**, pavyzdžiui, `https://your-project.supabase.co`
2. **API raktu**, turinčiu prieigą prie lentelių, kurias turėtų naudoti šis workflow
3. Pasirinktinė **numatytoji schema** (numatytoji `public`)

Mazgas bendrauja su Supabase PostgREST galiniu tašku adresu `/rest/v1/<table>`.
Naudokite `supabaseTable` tik lentelės pavadinimui, pavyzdžiui, `users` arba `profiles`. Nenaudokite `schema.table`, `rpc/...` ar kitų API kelių.

Kai pasirinktas galiojantis Supabase kredencialas, redaktorius gali tiesiogiai atrasti atidarytas lenteles ir lentelių stulpelius iš PostgREST OpenAPI metaduomenų. Naudokite **atrastų lentelių** išskleidžiamąjį meniu, kad pasirinkti lentelę, ir **stulpelių žetonus** po **Pasirinkti stulpelius**, kad greitai sukurtumėte pasirinkimo sąrašą.

## Operacijos

| Operacija | Reikalingi laukai | Aprašymas |
|-----------|-------------------|-----------|
| `select` | `supabaseTable` | Skaityti eiles su pasirenkamais tikslaus atitikimo filtrais, limitu ir rūšiavimu |
| `insert` | `supabaseTable`, `supabaseRows` arba automatinis žemyninimas | Įterpti vieną ar daugiau eilučių |
| `update` | `supabaseTable`, `supabaseData` arba automatinis žemyninimas, `supabaseFilter` | Atnaujinti eiles, atitinkančias filtrą |
| `upsert` | `supabaseTable`, `supabaseRows` arba automatinis žemyninimas | Įterpti arba sujungti eiles naudojant Supabase upsert semantiką. Naudokite `supabaseOnConflict`, kai reikia aiškaus konflikto tikslo. |
| `delete` | `supabaseTable`, `supabaseFilter` | Ištrinti eiles, atitinkančias filtrą |

## Filtravimo Sintaksė

`supabaseFilter` sudaro struktūrizuotą JSON į PostgREST užklausos parametrus.

- Tikslaus atitikimo: `{"status":"active"}`
- Palyginimas: `{"created_at":{"gte":"2026-01-01"}}`
- Narystė: `{"status":{"in":["active","paused"]}}`
- Modelio atitikimas: `{"email":{"ilike":"*@example.com"}}`
- Loginis OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Loginis AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Dėl kelių operatorių tame pačiame lauke, teikite pirmenybę loginiai grupėms:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Puslapiavimas

`select` dabar atlieka tikrą serverio pusės puslapiavimą prieš PostgREST.

- `supabaseLimit: "0"` gauna visas atitinkančias eiles puslapiais
- `supabaseLimit` vertės virš 1000 automatiškai išsiskleidžia į kelias užklausas
- Rezultatai sujungiami į vieną `.rows` masyvą, o `.count` lieka bendras atitinkančių eilučių skaičius

Skaitant dideles lenteles, nustatykite stabilų `supabaseOrderBy`, kad puslapių ribos būtų prognozuojamos.

## Automatinis Įvesties Žemyninimas

Dėl `insert`, `upsert` ir `update`, perjunkite mazgą į **Automatinis įvesties žemyninimas**, kai vienas aukštesnio lygio mazgas jau išveda norimą rašyti formą.

- Vienas objektas tampa viena eile arba viena atnaujinimo payload
- Objektų masyvas tampa daug eilučių `insert` / `upsert`
- Aukštesnio lygio objektas su `rows` masyvu tiesiogiai pakartoja tą masyvą
- `supabaseIgnoredInputFields` leidžia jums praleisti laukus, tokius kaip `id`, `created_at` arba `success`
## Išvesties nuoroda

| Išvesties laukas | Tipas | Aprašymas |
|------------------|-------|-----------|
| `.rows`          | masyvas | Grąžinti eilučių objektai |
| `.count`         | skaičius | Grąžintų arba paveiktų eilučių skaičius |
| `.success`       | boolean | Ar operacija buvo sėkminga |

## Pavyzdys – Pasirinkti Aktyvius Vartotojus

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

Prieiga prie išvesties: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Pavyzdys – Įterpti arba Atnaujinti Profilio Eilutę

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

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti Supabase kredencialus
- [Trečiųjų šalių integracijos](../reference/integrations.md) – Integracijos kredencialų nustatymas
