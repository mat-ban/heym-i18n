# BigQuery

**BigQuery**-solmu suorittaa SQL-kyselyitä ja lisää rivejä Google BigQuery -tietokantoihin BigQuery REST API v2:n kautta. Käytä sitä suurten analytiikkatietojen kyselyyn tai workflow-datan virtauttamiseen taulukoihin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | BigQuery (OAuth2) |
| Tulos | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| `bqOperation` | string | Toiminto: `query` (kysely) tai `insertRows` (rivien lisäys) |
| `bqProjectId` | expression | Google Cloud -projektin ID (esim. `my-gcp-project`) |
| `bqQuery` | expression | SQL-kyselymerkkijono. Pakollinen `query`-toiminnossa. |
| `bqMaxResults` | string | Palautettavien rivien enimmäismäärä `query`-toiminnossa (oletus `1000`). |
| `bqDatasetId` | expression | Tietokannan ID (esim. `my_dataset`). Pakollinen `insertRows`-toiminnossa. |
| `bqTableId` | expression | Taulukon ID (esim. `my_table`). Pakollinen `insertRows`-toiminnossa. |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows`-toiminnossa: **Raw** = täysi JSON-taulukko; **Selective** = yksi rivi avain-arvo -pareina. |
| `bqRows` | expression | JSON-taulukko riviobjekteista raw-tilassa (esim. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Avain-arvo -parit selective-tilassa. Jokainen avain on sarakkeen nimi; jokainen arvo on lauseke. |

## Tunnistetietojen määrittäminen

BigQuery käyttää **OAuth2 "Bring Your Own App"** -mallia, jossa käyttäjä toimittaa omat Google Cloud OAuth2 -tunnistetiedot.

**Taustajärjestelmän asetukset:** Aseta **`FRONTEND_URL`** Heymin taustajärjestelmään sovelluksen julkiseksi URL-osoitteeksi (osoite, jonka käyttäjät kirjoittavat selaimen osoiteriville), esim. `https://your-heym-domain`. OAuthin uudelleenohjausosoite on aina `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Siirry [Google Cloud Consoleen](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → ota käyttöön **BigQuery API**.
2. Siirry **Credentials** → **Create Credentials** → **OAuth client ID** → valitse **Web application**.
3. Lisää **Authorized redirect URIs** -kohdan alle tarkalleen: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopioi **Client ID** ja **Client Secret**.
5. Heym Dashboardissa → **Tunnistetiedot** → **Uusi** → valitse **BigQuery (OAuth2)**.
6. Syötä Client ID, Client Secret ja nimi, napsauta sitten **Connect** suorittaaksesi OAuth2 -hyväksynnän selainikkunassa.

Tunnisteet päivittyvät automaattisesti taustalla – manuaalista tunnisteen hallintaa ei vaadita.

## Toiminnot

| Toiminto | Pakolliset kentät | Kuvaus |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Suorittaa SQL-kyselyn ja palauttaa rivit |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows tai bqMappings | Lisää yhden tai useamman rivin streaming insertAll -rajapinnan kautta |

## Tulosteiden viite

| Toiminto | Tulostekenttä | Tyyppi | Kuvaus |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Riviolioiden taulukko (sarakkeen nimi → arvo) |
| `query` | `.total` | number | Palautettujen rivien määrä |
| `query` | `.schema` | array | Taulukon skeeman kentät |
| `insertRows` | `.insertedCount` | number | Onnistuneesti lisättyjen rivien määrä |
| `insertRows` | `.errors` | array | Lisäysvirheet riveittäin (tyhjä täydellisen onnistumisen yhteydessä) |

## Esimerkki – Kyselyn suorittaminen

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Tulokseen pääsee käsiksi: `$getUsers.rows` (riviolioiden taulukko), `$getUsers.rows[0].email`, `$getUsers.total`.

## Esimerkki – Rivin lisääminen

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot](../tabs/credentials-tab.md) – BigQuery OAuth2 -tunnistetietojen lisääminen
- [Google Sheets](./google-sheets-node.md) – Samankaltainen OAuth2 -malli taulukkolaskentatietoihin
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Integraatiotunnistetietojen määrittäminen
