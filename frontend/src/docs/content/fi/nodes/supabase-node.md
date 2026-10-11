# Supabase

**Supabase**-solmu lukee ja muokkaa Supabase-projektin PostgREST API:n tarjoamia taulukoita. Käytä sitä, kun haluat workflow-sovelluksesi käsittelevän SQL-pohjaista sovellustilaa ilman manuaalisia HTTP-pyyntöjen kirjoittamista.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | Supabase |
| Tuloste | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| `supabaseOperation` | merkkijono | Toiminto: `select`, `insert`, `update`, `upsert` tai `delete` |
| `supabaseSchema` | lauseke | Skeeman nimi. Jos tyhjä, solmu käyttää tunnistetietojen oletusskeemaa, sitten `public`-skeemaa. |
| `supabaseTable` | lauseke | Kysely- tai muutostaulukon yksinkertainen nimi. Skeema määritetään `supabaseSchema`-kentässä, ei tässä. |
| `supabaseSelectColumns` | lauseke | Pilkuin erotettu PostgREST -valintalista `select`-toimintoa varten (oletus `*`) |
| `supabaseFilter` | lauseke | JSON-suodatinobjekti. Tukee tarkkoja vastineita sekä operaattoriobjekteja ja loogisia ryhmiä, esim. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` tai `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | merkkijono | Enimmäismäärä palautettavia rivejä `select`-toiminnossa (`0` = hae kaikki vastaavat rivit palvelinpuolen sivutusjärjestelmällä, negatiiviset arvot käyttävät oletusta `100`) |
| `supabaseOrderBy` | lauseke | Valinnainen lajittelusarake `select`-toimintoa varten |
| `supabaseAscending` | totuusarvo | Lajittele nousevasti kun `true`, laskevasti kun `false` |
| `supabaseRowsInputMode` | merkkijono | `insert`/`upsert`-toiminnoille: `raw` JSON-taulukkotila tai `auto` yhden ylävirran syötteen automaattiseen yhdistämiseen |
| `supabaseDataInputMode` | merkkijono | `update`-toiminnalle: `raw` JSON-objektitila tai `auto` yhden ylävirran syötteen automaattiseen yhdistämiseen |
| `supabaseIgnoredInputFields` | merkkijono | Valinnainen pilkuin erotettu kenttienimien lista, joka jätetään pois automaattisen yhdistämisen yhteydessä |
| `supabaseRows` | lauseke | JSON-taulukko riviobjekteista `insert`- ja `upsert`-toiminnoille |
| `supabaseOnConflict` | lauseke | Valinnainen pilkuin erotettu ristiriitatavoitekenttien lista `upsert`-toiminnalle, esim. `id` tai `tenant_id,email` |
| `supabaseData` | lauseke | JSON-objekti päivitettävistä sarakearvoista `update`-toimintoa varten |

## Tunnistetietojen määrittäminen

Luo **Supabase**-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdellä seuraavilla tiedoilla:

1. **Projektin URL**, esim. `https://your-project.supabase.co`
2. **API-avain**, jolla on pääsy tämän workflow:n käyttämiin taulukoihin
3. Valinnainen **oletusskeema** (oletus `public`)

Solmu kommunikoi Supabase PostgREST -rajapinnan kanssa osoitteessa `/rest/v1/<table>`.
Käytä `supabaseTable`-kentässä vain taulukon nimeä, kuten `users` tai `profiles`. Älä käytä muotoa `schema.table`, `rpc/...` tai muita API-polkuja.

Kun kelvolliset Supabase-tunnistetiedot on valittu, editori voi löytää tarjottuja taulukoita ja sarakkeita suoraan PostgREST OpenAPI-metadatasta. Käytä **löydettyjen taulukoiden** pudotusvalikkoa taulukon valitsemiseen ja **sarakkeiden valintapainikkeita** **Select Columns** -kohdassa valintalistan nopeaan rakentamiseen.

## Toiminnot

| Toiminto | Pakolliset kentät | Kuvaus |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Lue rivejä valinnaisilla tarkkoilla suodattimilla, rajoituksilla ja lajittelulla |
| `insert` | `supabaseTable`, `supabaseRows` tai automaattinen syötteen yhdistäminen | Lisää yksi tai useampi rivi |
| `update` | `supabaseTable`, `supabaseData` tai automaattinen syötteen yhdistäminen, `supabaseFilter` | Päivitä suodattimeen täsmäävät rivit |
| `upsert` | `supabaseTable`, `supabaseRows` tai automaattinen syötteen yhdistäminen | Lisää tai yhdistä rivit Supabasen upsert-semantiikalla. Käytä `supabaseOnConflict`-kenttää, kun tarvitset eksplisiittisen ristiriitatavoitteen. |
| `delete` | `supabaseTable`, `supabaseFilter` | Poista suodattimeen täsmäävät rivit |

## Suodatinsyntaksi

`supabaseFilter` kääntää rakenteellisen JSON:n PostgREST-kyselyparametreiksi.

- Tarkka vastine: `{"status":"active"}`
- Vertailu: `{"created_at":{"gte":"2026-01-01"}}`
- Jäsenyys: `{"status":{"in":["active","paused"]}}`
- Kuviosovitus: `{"email":{"ilike":"*@example.com"}}`
- Looginen TAI: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Looginen JA: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Kun samalle kentälle tarvitaan useita operaattoreita, suositaan loogista ryhmää:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Sivutus

`select`-toiminto suorittaa nyt aidon palvelinpuolen sivutuksen PostgREST:iä vastaan.

- `supabaseLimit: "0"` hakee kaikki vastaavat rivit sivu kerrallaan
- `supabaseLimit`-arvot yli 1000 jakautuvat automaattisesti useisiin pyyntöihin
- Tulokset yhdistetään yhteen `.rows`-taulukkoon ja `.count` säilyy vastaavien rivien kokonaismääränä

Kun luetaan suuria taulukoita, aseta vakaa `supabaseOrderBy` pitääksesi sivurajat ennustettavina.

## Automaattinen syötteen yhdistäminen

`insert`-, `upsert`- ja `update`-toiminnoille voit vaihtaa solmun **Automaattiseen syötteen yhdistämiseen**, kun yksi ylävirran solmu tuottaa jo haluamasi muotoisen tulosteen.

- Yksi objekti muuttuu yhdeksi riviksi tai yhdeksi päivityspaketiksi
- Objektitaulukko muuttuu useiksi riveiksi `insert` / `upsert` -toiminnoille
- Ylävirran objekti, jossa on `rows`-taulukko, käyttää kyseistä taulukkoa suoraan
- `supabaseIgnoredInputFields` mahdollistaa kenttien jättämisen pois, kuten `id`, `created_at` tai `success`
## Output Reference

| Output field | Type | Description |
|-------------|------|-------------|
| `.rows` | array | Palautetut rivit |
| `.count` | number | Palautettujen tai muokattujen rivien määrä |
| `.success` | boolean | Onnistuiko operaatio |

## Esimerkki – Valitse aktiiviset käyttäjät

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

Tulokseen pääsee käsiksi: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Esimerkki – Päivitä tai lisää profiilirivi

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

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää Supabase-tunnistetiedot
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Integraatiotunnistetietojen määrittäminen
